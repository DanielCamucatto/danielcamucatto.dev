---
title: "PHP 8 + RoadRunner: A Performance de Go dentro do ecossistema PHP"
description: "Por muito tempo, o PHP foi rotulado como uma linguagem \"lenta\" ou inadequada para sistemas de..."
pubDate: 2026-03-24
tags: ["webdev","programming","php","laravel"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fybs5pc2cy7csrjsq3oyd.png"
devtoUrl: "https://dev.to/danielcamucatto/php-8-roadrunner-a-performance-de-go-dentro-do-ecossistema-php-234f"
---

Por muito tempo, o PHP foi rotulado como uma linguagem "lenta" ou inadequada para sistemas de altíssima escala. Esse estigma, em grande parte, não se deve à linguagem em si, mas ao modelo de execução tradicional **Shared-Nothing**.

Hoje, vamos falar sobre como o **RoadRunner** e o PHP 8 estão virando esse jogo, entregando performances que batem de frente com Go e Node.js.

## O Problema: O Gargalo do Ciclo de Vida "Shared-Nothing"

No modelo tradicional que dominou o PHP por décadas (Apache/Nginx + PHP-FPM), a arquitetura é baseada no conceito de Shared-Nothing. Isso significa que cada requisição HTTP é tratada como um evento isolado e efêmero.

Para cada clique de um usuário, o servidor realiza um esforço hercúleo:

1. **Incialização do Runtime:** O SO cria um processo ou thread, e o PHP precisa carregar seu Core e todas as extensões configuradas (mbstring, pdo, json, etc).

2. **Parsing de Arquivos:** O interpretador lê e compila centenas de arquivos .php (especialmente em frameworks como Laravel ou Symfony). Mesmo com o OPcache, o esforço de "montar" a árvore de objetos da aplicação é repetido.

3. **Bootstrap do Framework:** A aplicação instancia Service Providers, carrega configurações, prepara o Container de Injeção de Dependência e registra rotas.

4. **Conexões Externas:** Novas conexões com Banco de Dados e Redis são estabelecidas (o que envolve o custo de handshake TCP/TLS).

5. **Execução e Morte:** A lógica é executada, a resposta é enviada, e o processo é destruído imediatamente. Toda a memória é liberada e nada é reaproveitado para a próxima requisição.

Imagine um restaurante onde, para cada cliente que entra, a equipe precisa construir a cozinha do zero, instalar o fogão, cozinhar o prato e, após o cliente pagar, demolir a cozinha inteira com uma marreta.

Esse overhead de inicialização (o famoso bootstrapping) consome frequentemente mais tempo e CPU do que a própria lógica de negócio da aplicação. Em sistemas de alto tráfego, isso é o que impede o PHP-FPM de escalar horizontalmente de forma eficiente.

## A Solução: RoadRunner e o Modelo de Workers

O RoadRunner é um servidor de aplicação de alta performance escrito em Go. Ao contrário do PHP-FPM, ele utiliza um modelo de Workers persistentes.

Ele inicia a sua aplicação uma única vez e a mantém viva na memória. Quando uma requisição chega, o RoadRunner (via Goroutines em Go) a repassa para um worker PHP que já está "quente", com o framework carregado, conexões de banco prontas e pronto para processar.

### O Salto de Performance (Representação Gráfica)

Se compararmos as requisições por segundo (RPS) em uma API simples:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7uoxlewj9r6wn5vrz8tc.png)

## Laravel Octane: A Experiência de Primeiro Nível

Se você é desenvolvedor Laravel, o uso do RoadRunner ficou trivial com o Laravel Octane. Ele abstrai toda a complexidade de gerenciar os workers.

Com um comando:

```shell
php artisan octane:start --server=roadrunner
```
Sua aplicação passa a rodar em um estado persistente, permitindo ganhos de performance de até 5x a 10x sem mudar uma linha de lógica de negócio.

## Exemplo Prático: Como funciona por baixo do capô?

Para o RoadRunner entender sua aplicação, ele utiliza um arquivo de configuração e um "entry point" (o worker).

Configuração (.rr.yaml)

```yaml
version: "3"

http:
  address: :8080
  pool:
    num_workers: 4 # Mantém 4 instâncias do PHP sempre vivas
    max_jobs: 64
    allocate_timeout: 60s
    destroy_timeout: 60s

server:
  command: "php worker.php" # O comando que inicia o worker

```

O Worker PHP (worker.php)

Usando a biblioteca spiral/roadrunner, o código fica assim:

```php
<?php
use Spiral\RoadRunner;
use Nyholm\Psr7;

require __DIR__ . '/vendor/autoload.php';

$worker = RoadRunner\Http\HttpWorker::create(
    RoadRunner\Worker::create()
);

$factory = new Psr7\Factory\Psr17Factory();

while ($request = $worker->waitRequest()) {
    try {
        // Sua lógica de negócio aqui - O Framework já está carregado na memória!
        $response = $factory->createResponse(200)
            ->withBody($factory->createStream('Olá do RoadRunner!'));

        $worker->respond($response);
    } catch (\Throwable $e) {
        $worker->getWorker()->error((string)$e);
    }
}
```

## Cuidados Importantes

Nem tudo são flores. Como a aplicação não "morre" após a requisição, você precisa estar atento a:

- **Memory Leaks:** Variáveis globais ou estáticas que crescem indefinidamente podem derrubar o worker.

- **Singletons:** Objetos injetados no container podem persistir entre usuários diferentes se não forem resetados adequadamente (o Octane cuida de muitos destes casos).

- **Conexões de Banco:** O gerenciamento de timeouts e conexões inativas (idle) precisa de atenção, já que as conexões não fecham ao fim da requisição.

# Conclusão

O PHP 8 somado ao RoadRunner prova que a linguagem está mais viva do que nunca, pronta para microsserviços e APIs de altíssimo tráfego. Se você ainda não testou o modelo de Workers, está deixando performance (e dinheiro) na mesa.

Você já utiliza RoadRunner ou Laravel Octane em produção? Quais foram os maiores desafios na migração?
