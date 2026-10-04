---
title: "O QUE SÃO DIRETIVAS ANGULAR?"
description: "Introdução   O Angular é um dos frameworks mais populares para o desenvolvimento de..."
pubDate: 2023-07-20
tags: ["programming","tutorial","angular","frontend"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F2or6qskzeyqgvo2947gt.png"
devtoUrl: "https://dev.to/danielcamucatto/o-que-sao-diretivas-angular-58d4"
---

## *Introdução*

O Angular é um dos frameworks mais populares para o desenvolvimento de aplicações web modernas. Uma das suas principais características são as diretivas, que permitem que os desenvolvedores estendam o HTML, adicionando comportamentos e estilos personalizados. Neste artigo, exploraremos o que são as diretivas no Angular, como criar diferentes tipos de diretivas e exemplos práticos para entender seu funcionamento.

## *O que são Diretivas no Angular?*

As diretivas são uma das ferramentas mais fundamentais e poderosas do Angular. Elas oferecem a capacidade de manipular o DOM (Modelo de Objeto de Documento) e fornecem uma forma de interagir diretamente com os elementos HTML, criando comportamentos personalizados. Com as diretivas, é possível criar novos elementos HTML, modificar elementos existentes e até mesmo adicionar novos atributos ao HTML.

## *Tipos de Diretivas*

No Angular, existem dois tipos principais de diretivas: diretivas de atributo e diretivas de elemento. As diretivas de atributo são usadas para adicionar comportamentos e estilos personalizados a elementos HTML já existentes, enquanto as diretivas de elemento são utilizadas para criar novos elementos HTML com comportamentos e estilos personalizados.

## *Como Criar uma Diretiva Angular*

Para criar uma diretiva no Angular, é necessário criar um arquivo TypeScript ou JavaScript que contenha a diretiva. O arquivo deve conter uma classe que herda da classe **`Directive`** do Angular. Além disso, essa classe deve possuir uma propriedade chamada **`selector`**, que determina o nome do elemento HTML ao qual a diretiva será aplicada.

Vejamos um exemplo de uma diretiva de atributo que adiciona um comportamento personalizado a um elemento HTML existente:

```tsx
typescriptCopy code
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[my-directive]'
})
export class MyDirective {

  @Input() myProp: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.textContent = this.myProp;
  }
}

```

Para utilizar a diretiva, basta adicionar o seletor ao elemento HTML, como no exemplo a seguir:

```html
htmlCopy code
<div my-directive my-prop="Olá, Mundo!"></div>

```

Dessa forma, a diretiva **`my-directive`** adicionará o comportamento personalizado ao elemento HTML.

### *Exemplo de uma Diretiva de Atributo*

Agora, vamos criar um exemplo prático de uma diretiva de atributo chamada **`my-border`**, que adiciona uma borda a um elemento HTML.

```tsx
typescriptCopy code
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[my-border]'
})
export class MyBorderDirective {

  @Input() myProp: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.style.border = '1px solid black';
  }
}

```

Para utilizar essa diretiva, basta adicionar o seletor ao elemento HTML desejado:

```html
htmlCopy code
<div my-border my-prop="Olá, Mundo!"></div>

```

Ao fazer isso, a diretiva **`my-border`** será aplicada e adicionará uma borda ao elemento HTML.

### *Exemplo de uma Diretiva de Elemento*

Agora, vamos criar uma diretiva de elemento chamada **`my-element`**, que criará um novo elemento HTML com um comportamento personalizado.

```tsx
typescriptCopy code
import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: 'my-element'
})
export class MyElementDirective {

  @Input() myProp: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.textContent = this.myProp;
  }
}

```

Para utilizar essa diretiva, basta adicionar o seletor ao elemento HTML desejado:

```html
htmlCopy code
<my-element my-prop="Olá, Mundo!"></my-element>

```

Ao fazer isso, a diretiva **`my-element`** criará um novo elemento HTML com o conteúdo "Olá, Mundo!".

## *Conclusão*

As diretivas são uma das ferramentas mais poderosas do Angular, permitindo que os desenvolvedores personalizem o comportamento e o estilo dos elementos HTML de maneira simples e eficiente. Neste artigo, exploramos os conceitos das diretivas de atributo e de elemento, bem como fornecemos exemplos práticos para compreender melhor o seu uso. Com o conhecimento sobre diretivas em mãos, você estará preparado para criar aplicações web mais sofisticadas e interativas utilizando o Angular.
