---
title: "GUIA ANGULAR - ENTENDENDO DATA BINDING"
description: "Introdução   Suponha que você esteja desenvolvendo um aplicativo de lista de tarefas onde o..."
pubDate: 2023-07-10
tags: ["webdev","angular","frontend","javascript"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fp96yrsbvvrn67aue05y5.png"
devtoUrl: "https://dev.to/danielcamucatto/guia-angular-entendendo-data-binding-16jj"
---

## **Introdução**

Suponha que você esteja desenvolvendo um aplicativo de lista de tarefas onde o usuário pode adicionar, marcar como concluída ou excluir tarefas. Além disso, você precisa exibir o número total de tarefas concluídas em tempo real. Mas como você faria isso?

Você pode pensar inicialmente em utilizar um CRUD (Create, Read, Update, Delete). Embora isso seja válido, podemos melhorar essa abordagem com uma técnica amplamente utilizada chamada data binding.

Você pode estar se perguntando: qual é a diferença entre um CRUD normal e o data binding? Basicamente, o data binding melhora a forma como os dados são sincronizados entre o modelo de dados e a interface do usuário.

Por exemplo, com um CRUD normal, ao adicionar uma nova tarefa, você precisaria adicionar manualmente a tarefa ao modelo de dados e, em seguida, atualizar manualmente a interface do usuário para exibir a nova tarefa adicionada. Isso precisaria ser feito para cada ação do Create, Read, Update e Delete. É fácil perceber que essa abordagem é pouco performática.

Usando o data binding, quando uma nova tarefa for adicionada, a interface do usuário é atualizada automaticamente para exibir a nova tarefa, sem a necessidade de escrever código extra para atualizar manualmente a interface. Da mesma forma, o mesmo acontecerá quando uma tarefa for marcada como concluída ou excluída.

Em resumo, o benefício do data binding é automatizar a sincronização entre os dados e a interface, proporcionando uma experiência mais fluida e reduzindo a necessidade de escrever código manualmente para manter a sincronia.

## **COMO USAR O DATA BINDING NO ANGULAR**

No Angular, podemos passar informações da classe para serem exibidas no template ou passar informações do template para serem executadas na classe do componente.

Existem 4 tipos de data binding: interpolação, property binding, event binding e two-way binding.

## **INTERPOLAÇÃO**

A interpolação é usada quando queremos exibir dados da classe do componente no template. Ela sempre tem o sentido de transporte do componente para o template.

Para passar essas informações da classe do componente para o template, utilizamos chaves duplas no template, como por exemplo **`{{ variavel }}`**, onde **`variavel`** é o nome da variável que está na classe do componente. Isso indica ao Angular que queremos exibir os dados da variável no template.

Exemplo de interpolação:

```jsx

<p>Tarefa: {{ nomeTarefa }}</p>

```

## **PROPERTY BINDING**

O property binding segue o mesmo sentido da interpolação. É usado quando queremos passar informações da classe do componente para uma propriedade de uma tag no template.

Um exemplo é a tag **`<img>`**, que possui a propriedade **`src`**, onde passamos o caminho de alguma imagem. Para utilizar o property binding, colocamos a propriedade entre colchetes (**`[]`**), como por exemplo:

```jsx
<img [src]="caminhoImagem">
```

## **EVENT BINDING**

O event binding segue o caminho inverso dos dois primeiros. É utilizado para passar dados do template para a classe do componente. É comumente usado para eventos de tela, como clique em um botão ou algum tipo de entrada de dados.

O event binding é usado para interagir com o usuário, e cada ação desse evento atualiza ou manipula algo dentro da classe do componente.

Para utilizar o event binding, colocamos parênteses (**`()`**) na tag do template, seguido pela ação que desejamos executar. Por exemplo:

```jsx
htmlCopy code
<button (click)="salvarTarefa()">Salvar</button>

```

## **TWO-WAY DATA BINDING**

O two-way data binding combina o binding de propriedade e o binding de evento. Ele é representado por **`[(ngModel)]="variavel"`**, abrangendo tanto a representação da propriedade quanto do evento.

Dessa forma, o two-way data binding atualiza o template e a classe do componente a qualquer momento. Se a variável for alterada pelo template, o valor será atualizado na classe do componente. Da mesma forma, se a variável for alterada pela classe do componente, o valor será atualizado no template.

Podemos usar essa forma, por exemplo, em um formulário em que as informações são constantemente alteradas. Ao utilizar o two-way data binding nos campos do formulário, cada alteração será enviada para a classe do componente e poderá ser validada de acordo com as regras do formulário.

Exemplo de two-way data binding:

```jsx

<input type="text" [(ngModel)]="nomeTarefa">

```

Essas são as diferentes formas de utilizar o data binding no Angular. Com essas técnicas, você pode criar aplicações mais dinâmicas, sincronizando automaticamente os dados entre a classe do componente e o template, proporcionando uma experiência mais eficiente para os usuários.

Espero que esse artigo tenha sido útil para entender o conceito e aplicação do data binding no Angular. Agora você está pronto para utilizar essa poderosa técnica em seus projetos!

## **Conclusão**

Neste artigo, exploramos o conceito de data binding no Angular e como aplicá-lo de forma clara em nossos projetos. O data binding é uma poderosa técnica que permite a sincronização automática e bidirecional entre o modelo de dados e a interface do usuário. Com o uso adequado do data binding, podemos melhorar a experiência do usuário, reduzir a quantidade de código necessário e criar aplicações mais dinâmicas.

Vimos os quatro tipos de data binding disponíveis no Angular: interpolação, property binding, event binding e two-way binding. Cada um deles tem sua utilidade específica, seja para exibir dados da classe no template, passar informações do template para a classe, responder a eventos do usuário ou atualizar o modelo de dados e a interface simultaneamente.

Ao dominar o data binding no Angular, você terá mais facilidade em desenvolver aplicações interativas e responsivas. Portanto, comece a aplicar essas técnicas nos seus projetos e aproveite os benefícios dessa abordagem eficiente.

## **Link para o texto anterior**

Para complementar seus conhecimentos sobre o projeto de aprender Angular, você pode conferir meu texto anterior em **https://dev.to/danielcamucatto/como-funciona-um-template-6h2**. Nesse artigo, exploro detalhadamente como os templates funcionam no contexto do Angular, fornecendo informações valiosas para o seu aprendizado.

## **Referências Bibliográficas**

Aqui estão algumas referências bibliográficas que podem ser úteis para aprofundar seus conhecimentos sobre data binding no Angular:

- Documentação oficial do Angular: **https://angular.io/docs**


Essas referências fornecem informações detalhadas sobre o assunto e podem ser úteis para aprofundar seus estudos sobre o data binding no Angular.
