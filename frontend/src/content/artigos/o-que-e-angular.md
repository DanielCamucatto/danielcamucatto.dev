---
title: "O QUE É ANGULAR"
description: "Sempre que começamos a pesquisar uma nova tecnologia, ou qualquer assunto relacionado a qualquer área..."
pubDate: 2023-06-11
tags: ["beginners","programming","javascript","angular"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fyoww2zy9f82s5mf9a8pb.png"
devtoUrl: "https://dev.to/danielcamucatto/o-que-e-angular-2agd"
---

Sempre que começamos a pesquisar uma nova tecnologia, ou qualquer assunto relacionado a qualquer área de estudo, é importante começarmos com a pergunta "o que é?" Embora pareça algo óbvio atualmente explicar o que é o Angular, dada a imensa quantidade de material disponível sobre o assunto em diversos formatos e linguagens, decidi começar por esse ponto para que possamos estar na mesma página. Entender "o que é" e "por que serve" as coisas que nos rodeiam é o primeiro passo para solidificar a base e avançar de forma mais tranquila em um conhecimento mais avançado sobre o assunto.

Portanto, convido você, leitor que já tem uma certa experiência com Angular, a reservar alguns minutos para consolidar seu conhecimento. Talvez nada do que está neste texto seja realmente novo para você, mas ele servirá para revisar conceitos básicos que você já sabe, mas que podem estar adormecidos.

E você, caro leitor que está começando agora no maravilhoso mundo do Angular, está mais do que convidado a embarcar nessa jornada de compreender como funciona um dos frameworks mais utilizados do mundo.

## **FRAMEWORK OU BIBLIOTECA?**

Antes de entrarmos especificamente no que é o Angular, é preciso definir o que é um framework. Em linhas gerais, um framework é uma estrutura de códigos genérica que torna possível desenvolver aplicações de forma mais rápida, concisa e eficiente. Ele opera com um template para a linguagem de programação, oferecendo ao desenvolvedor uma base sólida na qual a aplicação pode ser desenvolvida.

Podemos fazer uma analogia com a construção de uma casa ou prédio: o framework seria toda a estrutura inicial, ou seja, ele seria responsável pelos alicerces da casa ou prédio. Assim, os pedreiros (desenvolvedores) não "gastariam tempo" se preocupando com toda a parte da fundação.

Agora que temos uma ideia do que é um framework, precisamos falar sobre bibliotecas. Embora muitas vezes tenhamos ouvido falar em framework e biblioteca como se fossem a mesma coisa, existem diferenças. Novamente, utilizando nossos exemplos:

Se o framework é a base para a construção de uma casa, uma biblioteca seria como se você já tivesse uma casa pronta e apenas quisesse melhorar algum aspecto dela, como comprar um portão elétrico ou pintar uma parede. De maneira mais técnica, podemos dizer que, quando usamos uma biblioteca, estamos no controle do fluxo da aplicação. Isso significa que com a biblioteca você tem um controle maior do seu código e é mais livre para conduzi-lo, decidindo quando e onde usar uma biblioteca.

Ao contrário de uma biblioteca, o framework é responsável pelo fluxo. É ele quem fornece o espaço para que o desenvolvedor escreva o código e é ele quem interpreta esse código para construir a aplicação.

Resumindo, tanto frameworks quanto bibliotecas são códigos desenvolvidos por terceiros que têm o objetivo de facilitar a construção de aplicações. A diferença é que o framework já define todo o fluxo e estrutura da aplicação, enquanto a biblioteca oferece componentes que podem ser usados para melhorar aspectos específicos.

## **ANGULARJS VS ANGULAR 2+**

Ao pesquisar sobre Angular, é comum encontrar referências ao AngularJS e ao Angular 2+ (também conhecido como apenas "Angular"). É importante entender a diferença entre essas duas versões.

O AngularJS foi a primeira versão do Angular lançada em 2010. Ele é um framework JavaScript de código aberto que permite a criação de aplicações web dinâmicas. O AngularJS utilizava JavaScript puro e possuía um conjunto de recursos e funcionalidades específicos.

Já o Angular 2+ (Angular) é uma reescrita completa do AngularJS, lançada em 2016. Ele foi desenvolvido utilizando a linguagem TypeScript, que é um superconjunto do JavaScript. O Angular 2+ introduziu uma série de melhorias em relação ao AngularJS, incluindo uma arquitetura modular, performance aprimorada e suporte a recursos avançados, como renderização do lado do servidor e geração de aplicativos móveis nativos.

Desde então, o Angular tem passado por atualizações regulares, sendo lançadas versões subsequentes, como Angular 4, Angular 5, e assim por diante. Essas versões posteriores do Angular 2 são compatíveis entre si e trazem novos recursos e aprimoramentos.

## **O QUE É O ANGULAR?**

Agora que entendemos a diferença entre AngularJS e Angular 2+, vamos focar no Angular. O Angular é um framework de desenvolvimento de aplicações web mantido pelo Google. Ele é baseado em TypeScript e é uma evolução do AngularJS.

O Angular é uma poderosa plataforma de desenvolvimento que oferece uma série de recursos para a criação de aplicações web modernas e escaláveis. Ele segue os princípios da arquitetura MVC (Model-View-Controller) e utiliza componentes reutilizáveis para criar interfaces de usuário interativas.

Além disso, o Angular possui uma ampla gama de recursos, como roteamento, gerenciamento de estado, injeção de dependência, teste automatizado e muito mais. Ele também possui uma vasta comunidade de desenvolvedores e uma documentação abrangente, o que facilita a aprendizagem e suporte ao utilizar o framework.

## **ELEMENTOS DE UMA APLICAÇÃO ANGULAR**

Uma aplicação Angular é composta por vários elementos principais:

1. Componentes: Os componentes são as unidades básicas de uma aplicação Angular. Eles são responsáveis por controlar a lógica de negócio e a interface de usuário de uma parte específica da aplicação. Cada componente possui um template que define a estrutura e o layout da parte da interface de usuário controlada por ele.
2. Módulos: Os módulos são unidades de organização do código em uma aplicação Angular. Eles agrupam componentes, diretivas, serviços e outros artefatos relacionados em um contexto coeso. Os módulos ajudam a organizar o código e facilitam a reutilização de componentes em diferentes partes da aplicação.
3. Diretivas: As diretivas são instruções que podem ser aplicadas a elementos HTML para alterar seu comportamento ou aparência. Existem dois tipos principais de diretivas no Angular: diretivas de atributo e diretivas estruturais. As diretivas permitem estender o HTML e adicionar funcionalidades personalizadas às páginas da aplicação.
4. Serviços: Os serviços são classes que fornecem funcionalidades compartilhadas por diferentes partes da aplicação. Eles são usados para centralizar a lógica de negócio, acesso a dados, comunicação com servidores e outras tarefas que não estão diretamente relacionadas a um componente específico. Os serviços podem ser injetados em componentes e outros serviços conforme necessário.

Esses são apenas alguns dos elementos fundamentais do Angular. O framework possui muitos outros recursos e conceitos que podem ser explorados para criar aplicações web robustas e escaláveis.

## **CONCLUSÃO**

O Angular é um framework poderoso e popular para o desenvolvimento de aplicações web. Ele fornece uma estrutura sólida e abrangente para construir interfaces de usuário interativas e escaláveis. Com o Angular, é possível criar aplicações complexas de forma eficiente, aproveitando uma ampla gama de recursos e uma comunidade ativa de desenvolvedores.

Espero que este texto tenha ajudado a consolidar seu conhecimento sobre o Angular ou a iniciar sua jornada de aprendizado neste framework. Continue explorando o Angular e suas possibilidades, e não hesite em recorrer à documentação oficial e à comunidade para obter mais informações e suporte.

## Referencias

[https://www.freecodecamp.org/portuguese/news/a-diferenca-entre-um-framework-e-uma-biblioteca/#:~:text=A diferença técnica entre um,está ao encargo do fluxo](https://www.freecodecamp.org/portuguese/news/a-diferenca-entre-um-framework-e-uma-biblioteca/#:~:text=A%20diferen%C3%A7a%20t%C3%A9cnica%20entre%20um,est%C3%A1%20ao%20encargo%20do%20fluxo).

 https://www.treinaweb.com.br/blog/qual-a-diferenca-entre-framework-e-biblioteca

https://blog.algaworks.com/o-que-e-angular/
