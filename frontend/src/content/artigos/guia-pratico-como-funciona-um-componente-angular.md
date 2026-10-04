---
title: "GUIA PRÁTICO - COMO FUNCIONA UM COMPONENTE ANGULAR"
description: "INTRODUÇÃ0   O Angular é um framework popular para o desenvolvimento de aplicativos web e..."
pubDate: 2023-06-19
tags: ["webdev","javascript","angular","beginners"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fc79jia79b2fr00yt4rez.png"
devtoUrl: "https://dev.to/danielcamucatto/guia-pratico-como-funciona-um-componente-angular-12l5"
---

## INTRODUÇÃ0

O Angular é um framework popular para o desenvolvimento de aplicativos web e possui uma arquitetura baseada em componentes. Neste artigo, vamos explorar o funcionamento de um componente no Angular, desde sua estrutura básica até a criação, uso e exclusão. Entender como os componentes funcionam é essencial para criar aplicações robustas e reutilizáveis.

## O QUE É UM COMPONENTE NO ANGULAR?

Um componente no Angular é uma unidade reutilizável que combina HTML, CSS e TypeScript para formar uma parte da interface do usuário de uma aplicação. Ele representa uma parte específica da aplicação, como um menu, um formulário ou uma barra de pesquisa. A ideia é criar componentes independentes que possam ser facilmente reutilizados em diferentes partes do aplicativo, evitando a duplicação de código.

## ESTRUTURA DE UM COMPONENTE

No Angular, podemos usar o Angular CLI (Command Line Interface) para facilitar a criação de componentes. O comando a seguir cria um novo componente:

```tsx
ng generate component nomeDoComponente
```

Também é possível utilizar a forma abreviada:

```
ng g c nomeDoComponente
```

Após a criação do componente, o Angular CLI gera automaticamente os arquivos necessários e registra o componente no arquivo "app.module.ts", que é o módulo principal da aplicação.

## UTILIZANDO UM COMPONENTE

Para utilizar um componente em um aplicativo Angular, basta adicionar a tag correspondente ao componente no HTML de outros componentes. Por exemplo:

```
<app-nomeDoComponente></app-nomeDoComponente>
```

Dessa forma, o componente será renderizado no local onde a tag foi adicionada.

## **Exemplo: Criando um Componente de Botão**

Vamos criar um exemplo prático de um componente de botão. Siga os passos abaixo para construir seu primeiro componente:

1. No terminal, execute o seguinte comando para criar o componente:

```tsx
ng generate component botao
```

1. Isso criará uma pasta chamada "botao" com os arquivos necessários do componente.
2. Abra o arquivo "botao.component.html" e adicione o seguinte código:

```tsx
<button>Meu Botão</button>
```

4. Abra o arquivo "botao.component.css" e adicione o seguinte código:

```css
button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

5. Agora, você pode usar o componente de botão em outros componentes. Abra o arquivo "app.component.html" e adicione a seguinte linha de código:

```css
<app-botao></app-botao>
```

6. Ao executar o aplicativo, você verá o botão sendo renderizado na tela.

## **Referências**

Para mais informações sobre o funcionamento de componentes no Angular, você pode consultar os seguintes recursos:

- Documentação oficial do Angular: **https://angular.io/guide/architecture-components**


## **Resumo**

Neste artigo, exploramos o funcionamento de um componente no Angular. Vimos que um componente é uma parte reutilizável da interface do usuário, composto por HTML, CSS e TypeScript. A estruturação correta de um componente é essencial para criar aplicativos robustos e reutilizáveis. Além disso, fornecemos um exemplo prático de como criar um componente de botão. Agora você está pronto para começar a desenvolver seus próprios componentes no Angular.

Espero que esse artigo atenda às suas expectativas. Se você tiver mais alguma pergunta ou solicitação, fique à vontade para me informar!

### **Perdeu os últimos posts? segue o link abaixo**
- [O que é Angular](https://dev.to/danielcamucatto/o-que-e-angular-2agd)
- [Dicas úteis para otimizar desempenho de aplicações web](https://dev.to/danielcamucatto/dicas-uteis-para-otimizar-o-desempenho-de-aplicacoes-web-1c8a)
