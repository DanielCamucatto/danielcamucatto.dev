---
title: "PARE DE TESTAR SEU CÓDIGO DE FORMA BURRA"
description: "Por Que o Seu Teste Unitário Quebra o Encapsulamento   Se você já se viu usando Reflection..."
pubDate: 2025-10-22
tags: ["programming","test","code"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fzbqs3l2q2rsadryfj51w.png"
devtoUrl: "https://dev.to/danielcamucatto/pare-de-testar-seu-codigo-de-forma-burra-46i9"
---

## Por Que o Seu Teste Unitário Quebra o Encapsulamento

Se você já se viu usando **Reflection** (ou similares) no seu código de teste para forçar o acesso a um método `private`, pare. Você está criando testes frágeis, caros de manter e que, ironicamente, minam a qualidade do seu software.

Este artigo é um alerta sobre uma das práticas de teste mais comuns e prejudiciais: o foco na **implementação** (o _como_) em vez do **comportamento** (o _o quê_).

### 1. Introdução: O Teste Falso e o Preço da Fragilidade

No desenvolvimento moderno, a busca por alta **cobertura de código** (code coverage) é constante. No entanto, muitos desenvolvedores confundem a métrica com qualidade. Eles se preocupam em cobrir _todas_ as linhas, inclusive as internas, criando o que chamamos de **testes frágeis**.

Um teste frágil é aquele que quebra quando você refatora o código, **mesmo que o comportamento externo e a funcionalidade final da classe permaneçam idênticos**. Ele se torna um fardo, não uma garantia. A raiz desse problema? Ignorar o **Encapsulamento**.

### 2. Pilar Fundamental: O Que é Encapsulamento (E por que ele é sagrado)

O encapsulamento é um dos pilares da Programação Orientada a Objetos (POO) e é crucial para a manutenibilidade do código.

**Pense na sua Máquina de Café:**

1. **Interface Pública (`public`):** São os botões que você usa: `ligar()`, `selecionarExpresso()`, `adicionarÁgua()`. Você interage com a máquina SÓ através destes pontos.
    
2. **Detalhes Privados (`private`):** São os processos internos: `aquecerResistencia()`, `moerGraos()`, `bombearÁgua()`. Estes métodos são auxiliares, internos à classe, e seu acesso é proibido para o mundo exterior.
    

#### A Quebra da Cápsula

O teste unitário deve validar que a máquina de café produz um "Expresso" (o **resultado esperado**) quando você aperta o botão `selecionarExpresso()` (o **método público**).

Quando você usa Reflection para forçar o teste do método `moerGraos()` (o **método privado**), você está **abrindo a máquina**, quebrando sua proteção e expondo a complexidade desnecessariamente.

### 3. A Crítica Principal: Por Que Testar Métodos Privados é Burro

Testar métodos privados diretamente é um anti-padrão de teste. Chamamos de "burro" porque ele é caro e contraproducente:

#### Custo 1: Alto Custo de Manutenção

Se amanhã você decide que `moerGraos()` precisa ser renomeado para `processarInsumos()` ou ser dividido em dois métodos (`moer()` e `peneirar()`), o seu **código de produção não quebra**. Nenhuma outra classe se importa com isso.

**No entanto, o seu teste unitário frágil quebra**, porque ele estava acoplado ao nome exato do método privado. Você gastou tempo escrevendo um teste que lhe pune por melhorar o seu código.

#### Custo 2: Violação do Contrato Público

O objetivo do teste é garantir que o **Contrato Público** da sua classe seja cumprido.

Se você está testando uma classe `ValidadorDeCPF`, o que importa é que o método `public validar(cpf)` retorne `true` ou `false`. Não importa se ele usa um método privado chamado `calcularDigitos()`, `verificarRegra1()` ou `verificarRegra2()`.

Se o método público funciona, ele já está provando que todos os métodos privados que o suportam estão funcionando.

#### Custo 3: Confusão de Papéis

Se o seu método privado é tão complexo ou crítico que você _sente_ a necessidade de testá-lo isoladamente, isso é um **Code Smell** (cheiro de código ruim).

**A Solução não é testar o método privado. A Solução é movê-lo para a sua própria classe.**

Quando você move a lógica complexa de um método privado para uma nova classe pública (por exemplo, `ExtratorDeNivel`), você pode testá-la de forma limpa, sem Reflection e sem quebrar o encapsulamento.

### 4. A Solução Inteligente: Testando o Comportamento, Não Detalhes

Vamos voltar ao caso que motivou esta discussão, onde um método privado (`extractNumeroNivel`) estava sendo testado diretamente, como visto na thread inicial.

#### O Teste Burro (Com Reflection em PHP)

```php
// Teste Frágil, com acoplamento interno (EVITAR ESTE TESTE)
// Este é o cenário exato que o David criticou!
public function testExtractNumeroNivelParsesCorrectly(): void
{
    // 1. Usa ReflectionClass para obter a classe
    $ref = new ReflectionClass(NivelDynamic::class); 
    // 2. Obtém o método privado 'extractNumeroNivel'
    $method = $ref->getMethod('extractNumeroNivel'); 
    // 3. Torna o método acessível (QUEBRA O ENCAPSULAMENTO)
    $method->setAccessible(true); 

    // 4. Invoca o método diretamente
    $this->assertEquals('P', $method->invokeArgs($this->nivelDynamic, ['3 - Silver']));
}
```

**Problema:** Se o nome do método privado (`extractNumeroNivel`) for alterado, o teste quebra.

#### O Teste Inteligente (No Comportamento em PHP)

Assumindo que a classe `NivelDynamic` tem um método público chamado `processarOferta($dados)`:

```php
// Teste Robusto, focado no comportamento (APROVE ESTE TESTE)
public function testProcessarOfertaComNivelSilver(): void
{
    $dadosEntrada = ['descricao' => '3 - Silver'];
    $oferta = $this->nivelDynamic->processarOferta($dadosEntrada);

    // Se o método público entrega o resultado esperado ('P'), 
    // isso prova que o método privado 'extractNumeroNivel' funcionou internamente.
    $this->assertEquals('P', $oferta['NIVEL_FINAL']);
}
```

**Vantagem:** O teste inteligente não se importa _como_ o nível foi extraído, apenas que o resultado final da oferta está correto. Você pode refatorar a lógica interna do `private extractNumeroNivel` à vontade; enquanto o `processarOferta` funcionar, o teste passa. O teste agora é uma **garantia de funcionalidade**, não um fiscal de implementação.

### 5. Conclusão: Melhores Práticas e Dicas de Teste

O verdadeiro teste unitário é aquele que atua como uma especificação do seu contrato público.

**Em resumo, adote estas melhores práticas:**

- **Se for `private`:** Ele é um detalhe de implementação. Teste-o através do método `public` que o chama.
    
- **Se for complexo demais para ser testado indiretamente:** Ele **não deve ser private**. Ele deve ser extraído para sua própria classe e se tornar **público** em seu próprio contexto.
    

Passe a criar testes que garantem o valor que seu código entrega, e não testes que punem você por torná-lo mais limpo e elegante. **Pare de testar de forma burra.**
