---
title: "GUIA PRÁTICO - COMO FUNCIONA UM TEMPLATE"
description: "Introdução:   O Angular é um framework de desenvolvimento web amplamente utilizado para a..."
pubDate: 2023-07-02
updatedDate: 2023-07-02
tags: ["webdev","beginners","angular","programming"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fewwjdcx8t1yg1kaycm3x.png"
devtoUrl: "https://dev.to/danielcamucatto/como-funciona-um-template-6h2"
---

## Introdução:

O Angular é um framework de desenvolvimento web amplamente utilizado para a criação de aplicações web modernas e escaláveis. Neste guia, vamos explorar dois conceitos fundamentais no Angular: o template e o metadata. Entender esses conceitos é essencial para construir componentes eficientes e interativos no Angular.

## Template e Metadata no Angular

## O Papel do Template

No Angular, o template é responsável por definir a visão de um componente. Ele é composto por código HTML, diretivas do Angular e bindings, que permitem a interação dinâmica com os componentes. O template é a representação visual do componente e define como o conteúdo será renderizado no navegador.

```jsx
<div>
  <h1>{{ title }}</h1>
  <p>Seja bem-vindo ao meu aplicativo Angular!</p>
</div>
```

## Renderizando o Template

O código HTML presente no template é interpretado pelo Angular e renderizado no navegador. Podemos incluir elementos HTML como títulos, parágrafos, listas e outros componentes personalizados. O Angular também fornece diretivas, como *ngFor e *ngIf, que permitem iterar sobre coleções de dados e controlar a exibição condicional de elementos.

```jsx
<ul>
  <li *ngFor="let item of items">{{ item }}</li>
</ul>
```

## Entendendo o Metadata

### O que é Metadata no Angular?

O metadata é um conjunto de informações que descrevem como o Angular deve processar uma classe. Ele é definido usando decoradores, sendo o decorador @Component o principal para configurar um componente. O metadata permite que o Angular reconheça a classe como um componente e estabeleça a ligação com o template correspondente.

### @Component: O Decorador Principal

O decorador @Component é usado para identificar uma classe como um componente no Angular. Ao decorar uma classe com @Component, devemos fornecer os metadados necessários para o Angular reconhecer completamente o componente. Esses metadados incluem o seletor, que define o nome do componente dentro de uma página HTML, e o templateUrl, que especifica o caminho para o template HTML associado ao componente.

```jsx
@Component({
  selector: 'app-exemplo',
  templateUrl: './exemplo.component.html',
  styleUrls: ['./exemplo.component.css']
})
export class ExemploComponent {
  // Lógica do componente aqui
}
```

### Propriedades do Metadata

Além do seletor e do templateUrl, o decorador @Component possui outras propriedades importantes. Por exemplo, styleUrls é usado para especificar o arquivo CSS do componente, permitindo a estilização personalizada. Também podemos definir propriedades como inputs e outputs para estabelecer a comunicação entre componentes pai e filho. Além disso, existem os lifecycle hooks, como ngOnInit e ngOnDestroy, que nos permitem executar ações em momentos específicos do ciclo de vida do componente.

```jsx
@Component({
  selector: 'app-exemplo',
  templateUrl: './exemplo.component.html',
  styleUrls: ['./exemplo.component.css']
})
export class ExemploComponent implements OnInit, OnDestroy {
  @Input() nome: string;
  @Output() mensagem: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    // Lógica a ser executada quando o componente é inicializado
  }

  ngOnDestroy() {
    // Lógica a ser executada quando o componente é destruído
  }

  // Outras funções e propriedades do componente
}
```

## Exemplo Prático: Construindo o Componente Lista de Pessoas

## Configurando o Componente

Vamos criar um exemplo de componente chamado ListaPessoaComponent. Para isso, utilizaremos o decorador @Component para configurar o seletor como 'app-lista-pessoa' e especificar o templateUrl como './lista-pessoa.component.html'. Essa configuração define o nome do componente dentro do projeto e indica o caminho para o template HTML correspondente.

```jsx
@Component({
  selector: 'app-lista-pessoa',
  templateUrl: './lista-pessoa.component.html',
})
export class ListaPessoaComponent {
  // Lógica do componente aqui
}
```

## Utilizando o Componente

Agora, podemos utilizar o componente ListaPessoaComponent em um arquivo HTML. Basta adicionar a marcação <app-lista-pessoa></app-lista-pessoa> onde desejamos exibir a lista de pessoas. O Angular identificará essa marcação como um componente personalizado e renderizará o conteúdo do template associado.

```jsx
<app-lista-pessoa></app-lista-pessoa>
```

## Explorando Outras Funcionalidades

Além do template e do metadata, o Angular oferece outras funcionalidades poderosas. Podemos utilizar serviços para lidar com lógica de negócio e compartilhar dados entre componentes. Através do decorador @Injectable, podemos criar e injetar dependências nos nossos serviços. É importante explorar todas as possibilidades que o Angular oferece para obter o máximo de produtividade e eficiência no desenvolvimento.

## Conclusão:

Neste guia, exploramos os conceitos fundamentais de template e metadata no Angular. O template define a visão do componente, enquanto o metadata configura a relação entre a classe e o template. Compreender esses conceitos é essencial para construir aplicações web modernas e escaláveis com o Angular. À medida que você se aprofunda no desenvolvimento com o Angular, lembre-se de explorar todas as funcionalidades disponíveis e aproveitar ao máximo o poder desse framework.

Agora que você tem um bom entendimento do template e do metadata no Angular, está pronto para iniciar a construção de seus próprios componentes e explorar todo o potencial desse poderoso framework de desenvolvimento web.

## Resumo dos Assuntos Abordados:

- O template é responsável por definir a visão de um componente no Angular, utilizando código HTML, diretivas e bindings.
- O metadata é um conjunto de informações que descrevem como o Angular deve processar uma classe, sendo definido usando decoradores como @Component.
- O decorador @Component identifica uma classe como um componente, fornecendo metadados como o seletor e o templateUrl.
- O seletor define o nome do componente dentro de uma página HTML, enquanto o templateUrl especifica o caminho para o template HTML associado.
- O decorador @Component também possui outras propriedades importantes, como styleUrls, inputs, outputs e lifecycle hooks.
- Além do template e do metadata, o Angular oferece funcionalidades adicionais, como serviços e injeção de dependências.

## Referências:

- Angular Documentation: **https://angular.io/docs**
- "Angular Development with TypeScript" by Yakov Fain and Anton Moiseev
- "Learning Angular: A Hands-On Guide to Angular 11+" by Brad Dayley
