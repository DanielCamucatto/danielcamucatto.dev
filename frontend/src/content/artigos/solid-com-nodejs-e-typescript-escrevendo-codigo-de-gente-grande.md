---
title: "SOLID com Node.js e TypeScript: Escrevendo Código de Gente Grande"
description: "Muitos desenvolvedores acreditam que os princípios SOLID são relíquias da era do Java clássico que..."
pubDate: 2026-01-25
updatedDate: 2026-01-25
tags: ["webdev","programming","node","typescript"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fwoh75mvjc6zds8ygurei.png"
devtoUrl: "https://dev.to/danielcamucatto/solid-com-nodejs-e-typescript-escrevendo-codigo-de-gente-grande-32nj"
---

Muitos desenvolvedores acreditam que os princípios **SOLID** são relíquias da era do Java clássico que não se aplicam ao mundo ágil e dinâmico do Node.js. Ledo engano. À medida que as aplicações Node.js crescem em complexidade, a falta de uma base sólida transforma projetos promissores em pesadelos de manutenção.

Quando combinamos o **TypeScript** com Node.js, ganhamos as ferramentas necessárias para aplicar esses princípios de forma elegante, garantindo que o sistema seja fácil de estender e testar.

## O que é SOLID?

Cunhado por **Robert C. Martin** (o "Uncle Bob") no início dos anos 2000, o SOLID é um acrônimo para cinco princípios de design de software que visam tornar o código mais compreensível, flexível e sustentável.

### 1. S — Single Responsibility Principle (SRP)

_“Uma classe deve ter um e apenas um motivo para mudar.”_

**Exemplo Ruim:** Um service que cria usuário e envia e-mail de boas-vindas. Se a forma de enviar e-mail mudar, você altera o service de usuário.

```
// Ruim: Responsabilidades misturadas
class UserService {
  async create(data: UserDTO) {
    const user = await db.user.create(data);
    const smtp = new SMTPLib(); // Acoplamento direto
    await smtp.send('welcome@example.com', 'Welcome!');
  }
}
```

**Exemplo Bom:** Separar a lógica de negócio da infraestrutura de e-mail.

```
class MailProvider {
  async sendEmail(to: string, message: string) { /* ... */ }
}

class UserService {
  constructor(private mailProvider: MailProvider) {}

  async create(data: UserDTO) {
    const user = await db.user.create(data);
    await this.mailProvider.sendEmail(user.email, 'Welcome!');
  }
}
```

### 2. O — Open/Closed Principle (OCP)

_“Entidades devem estar abertas para extensão, mas fechadas para modificação.”_

**Exemplo Ruim:** Usar `switch` ou `if/else` para tratar diferentes tipos de pagamento. Para adicionar "Pix", você precisa modificar a classe existente.

```
class PaymentProcessor {
  process(amount: number, type: 'credit' | 'debit') {
    if (type === 'credit') { /* lógica credit */ }
    else if (type === 'debit') { /* lógica debit */ }
  }
}
```

**Exemplo Bom:** Usar interfaces e polimorfismo.

```
interface IPaymentMethod {
  execute(amount: number): void;
}

class PixPayment implements IPaymentMethod {
  execute(amount: number) { /* lógica Pix */ }
}

class CreditPayment implements IPaymentMethod {
  execute(amount: number) { /* lógica Crédito */ }
}

// O processador não muda mais ao adicionar novos métodos
class PaymentProcessor {
  process(amount: number, method: IPaymentMethod) {
    method.execute(amount);
  }
}
```

### 3. D — Dependency Inversion Principle (DIP)

_“Dependa de abstrações, não de implementações concretas.”_

Este é o princípio que permite testes unitários eficientes.

**Exemplo Bom (com TypeScript):**

```
// 1. Definimos o contrato (Abstração)
interface IUserRepository {
  save(user: UserEntity): Promise<void>;
}

// 2. Implementação concreta
class PostgresUserRepository implements IUserRepository {
  async save(user: UserEntity) { /* salva no Postgres */ }
}

// 3. O Service não sabe qual banco é usado
class CreateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: UserEntity) {
    await this.userRepository.save(data);
  }
}

// Nos testes, podemos injetar um Mock (Abstração)
const mockRepo: IUserRepository = { save: async () => {} };
const service = new CreateUserService(mockRepo);
```

## Por que usar SOLID com TypeScript?

1. **Testabilidade:** Código desacoplado permite o uso de **Jest** para injetar mocks facilmente.
    
2. **Escalabilidade:** Novos desenvolvedores entendem onde termina uma responsabilidade e começa outra.
    
3. **Segurança de Tipo:** O TypeScript força o cumprimento das interfaces (contratos), evitando erros comuns de tempo de execução.
    

## Conclusão

Aplicar SOLID em Node.js com TypeScript não é sobre burocracia; é sobre **resiliência**. No início, pode parecer que você está criando arquivos demais, mas quando o projeto precisar de uma mudança drástica no futuro, você agradecerá por ter investido em uma arquitetura flexível.

### Notas e Referências

- **Robert C. Martin (Uncle Bob):** Autor de _"Clean Architecture"_ e o principal evangelista do SOLID.
    
- **Michael Feathers:** Sua obra "Working Effectively with Legacy Code" (Trabalhando Eficazmente com Código Legado) complementa o SOLID ao mostrar como levar sistemas antigos para esses padrões através de técnicas de desacoplamento e testes.
