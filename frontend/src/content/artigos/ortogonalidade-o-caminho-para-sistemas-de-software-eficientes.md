---
title: "Ortogonalidade: O Caminho para Sistemas de Software Eficientes"
description: "O Pesadelo do Desenvolvedor Júnior   Imagine o seguinte: Você acabou de entrar em um novo..."
pubDate: 2025-11-15
updatedDate: 2025-11-15
tags: ["architecture","beginners","cleancode"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fdygdba2u434w6kckmkjs.png"
devtoUrl: "https://dev.to/danielcamucatto/ortogonalidade-o-caminho-para-sistemas-de-software-eficientes-38jd"
---

## O Pesadelo do Desenvolvedor Júnior

Imagine o seguinte: Você acabou de entrar em um novo projeto e precisa adicionar uma funcionalidade simples, por exemplo, um campo extra na tela de cadastro de usuários.

Você faz a alteração em uma classe, mas o sistema começa a falhar em três outras áreas não relacionadas (o módulo de relatórios, o envio de e-mail e a validação de estoque).

**Pergunta:** Qual princípio de design de software foi violado, causando esse efeito dominó?

Se você não soube responder imediatamente qual dos conceitos (Acoplamento ou Coesão) é o principal culpado, este artigo é para você. A resposta está na **Ortogonalidade**.

## O que é Ortogonalidade?

Em programação, o princípio da **Ortogonalidade** significa que componentes não relacionados de um sistema devem ser independentes uns dos outros.

Em um sistema ortogonal:

1. **Independência:** A alteração em um módulo **não causa efeitos colaterais** em outro.
    
2. **Modularidade:** Os componentes são isolados e têm responsabilidades claras.
    

O oposto é o **Alto Acoplamento**, ou o famoso "código espaguete," onde as mudanças são custosas e arriscadas. Para alcançar a Ortogonalidade, você deve buscar dois pilares essenciais: **Baixo Acoplamento** e **Alta Coesão**.

## Pilar 1: Coesão 🧱

A Coesão mede o quanto as responsabilidades e os elementos **dentro de um único módulo ou classe** pertencem logicamente uns aos outros. É um olhar **interno**.

|   |   |   |
|---|---|---|
|**Tipo de Coesão**|**Definição**|**Implicações**|
|**Alta Coesão (Desejável)**|O módulo tem um **único propósito** bem definido (Princípio da Responsabilidade Única - SRP).|Fácil de entender, isolar e testar. **Apenas uma razão para mudar.**|
|**Baixa Coesão (Indesejável)**|O módulo tem **muitas responsabilidades** não relacionadas.|O módulo se torna um "faz-tudo". Mudanças em uma área podem afetar as outras.|

### Exemplo em PHP: Baixa Coesão

O código a seguir tem **Baixa Coesão** porque a classe `Pedido` é responsável por três tarefas distintas e não relacionadas.

```
<?php
class Pedido
{
    // Baixa Coesão: Múltiplas responsabilidades
    public function processar(array $dados)
    {
        // 1. Validação (Lógica de Negócio)
        if (empty($dados['produto_id'])) {
            throw new Exception("Produto inválido.");
        }

        // 2. Persistência (Lógica de Infraestrutura)
        $db = new DatabaseConnection();
        $db->save($dados);

        // 3. Notificação (Lógica de Serviço Externo)
        $emailService = new EmailService();
        $emailService->sendConfirmation($dados['email']);
    }
}
?>

```

**Problema:** Se você alterar a forma como o e-mail é enviado, terá que editar e potencialmente quebrar a lógica de Validação ou Persistência.

## Pilar 2: Acoplamento 🔗

O Acoplamento mede o grau de interdependência **entre diferentes módulos ou classes**. É um olhar **externo**.

|   |   |   |
|---|---|---|
|**Tipo de Acoplamento**|**Definição**|**Implicações**|
|**Baixo Acoplamento (Desejável)**|Módulos se comunicam apenas por **contratos (interfaces)** ou abstrações.|Isolamento de falhas, permite substituição de dependências (Injeção de Dependência).|
|**Alto Acoplamento (Indesejável)**|Um módulo depende dos **detalhes internos** ou da implementação concreta de outro módulo.|O "efeito dominó" de falhas: uma mudança externa exige mudanças internas.|

### Exemplo em PHP: Alto Acoplamento

Este exemplo mostra como a classe `ProcessadorDePedidos` cria sua própria dependência de e-mail, gerando **Alto Acoplamento**:

```
<?php
// Alto Acoplamento
class ProcessadorDePedidos
{
    public function enviarConfirmacao($dados)
    {
        // O Módulo está acoplado à implementação concreta de 'GmailSender'
        $sender = new GmailSender(); 
        $sender->send($dados['email'], "Seu pedido foi processado!");
    }
}
?>

```

### O Caminho Ortogonal: Baixo Acoplamento (Injeção de Dependência)

Para alcançar o **Baixo Acoplamento**, usamos o princípio da **Injeção de Dependência (DI)**. O módulo deve **receber** suas dependências, em vez de criá-las.

1. **Crie um Contrato (Interface):**
    
    ```
    interface Notificador
    {
        public function enviar(string $destino, string $mensagem): void;
    }
    
    ```
    
2. **Crie Implementações Concretas:**
    
    ```
    class SendGridNotificador implements Notificador
    {
        public function enviar(string $destino, string $mensagem): void { /* ... lógica SendGrid ... */ }
    }
    
    class LogNotificador implements Notificador
    {
        public function enviar(string $destino, string $mensagem): void { /* ... lógica de log ... */ }
    }
    
    ```
    <br>
3. **Injete a Dependência (Baixo Acoplamento):**
    
    ```
    <?php
    // Baixo Acoplamento - O Processador depende da Interface (Contrato), não da Classe Concreta
    class ProcessadorDePedidos
    {
        // Usa a Injeção de Dependência via Construtor
        public function __construct(private Notificador $notificador)
        {
            // O Processador não sabe se é SendGrid ou Log, apenas sabe que pode "enviar"
        }
    
        public function enviarConfirmacao(array $dados): void
        {
            $this->notificador->enviar($dados['email'], "Seu pedido foi processado!");
        }
    }
    ?>
    
    ```
    

**Vantagem Ortogonal:** Se amanhã você precisar trocar o SendGrid por um novo fornecedor, basta criar uma nova classe que implemente a interface `Notificador` e injetá-la. O `ProcessadorDePedidos` (o módulo principal) não precisa ser alterado, provando sua ortogonalidade.

## Conclusão: A Resposta ao Desenvolvedor Júnior

Voltando à pergunta inicial: Se o desenvolvedor mudou uma linha de código e quebrou o módulo de e-mail ou relatórios, o principal culpado é o **Alto Acoplamento**. O módulo original estava rigidamente conectado às implementações concretas de seus colaboradores, fazendo com que uma alteração em uma ponta se propagasse para outras.

A busca por um design **Ortogonal** é o que separa um programador comum de um programador eficiente:

|   |   |   |
|---|---|---|
|**Cenário de Mudança**|**Problema (Não-Ortogonal)**|**Solução (Ortogonal)**|
|**Mudança Externa** (Troca de Banco de Dados)|**Alto Acoplamento**|**Baixo Acoplamento** (Use Injeção de Dependência)|
|**Mudança Interna** (Alterar Regra de Negócio)|**Baixa Coesão**|**Alta Coesão** (Use SRP e separe em classes focadas)|

Aderir à ortogonalidade (Alta Coesão e Baixo Acoplamento) tem um impacto direto e mensurável na qualidade e no custo de manutenção do seu software. Este gráfico compara os atributos de um sistema ortogonal versus um não-ortogonal.
como mostra o grafico 

![Tabela de comparação com sistemas ortogonais e não ortogonais](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t5zi95lua63fxmfuqq6h.png)
