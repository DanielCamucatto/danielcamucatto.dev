---
title: "Node.js Cluster Mode: Maximizando a sua CPU para Performance de Elite"
description: "Você já parou para olhar o gerenciador de tarefas do seu servidor enquanto sua aplicação Node.js está..."
pubDate: 2026-03-15
tags: ["webdev","programming","javascript","node"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fer6noef11598f7odgs3z.png"
devtoUrl: "https://dev.to/danielcamucatto/nodejs-cluster-mode-maximizando-a-sua-cpu-para-performance-de-elite-21ib"
---

Você já parou para olhar o gerenciador de tarefas do seu servidor enquanto sua aplicação Node.js está sob carga pesada? É frustrante ver um único núcleo da CPU a 100% enquanto os outros sete estão praticamente dormindo.

Por padrão, o Node.js é single-threaded. Isso significa que ele executa todo o seu código JavaScript em um único fio de execução. Se o seu servidor possui 4, 8 ou 16 núcleos, você está deixando a maior parte do poder de processamento na mesa. É aqui que entra o Cluster Mode.

## O Que é o Módulo Cluster?

O módulo cluster é uma ferramenta nativa do Node.js que permite criar múltiplos processos "filhos" (workers) que compartilham as mesmas portas de rede. Em vez de uma instância solitária tentando lidar com milhares de requisições, você tem um exército de instâncias distribuindo o trabalho.

### A Anatomia do Cluster

Existem dois tipos de processos em um cluster:

1. Primary (Antigo Master): É o processo "gerente". Ele não lida com requisições HTTP diretamente. Sua única função é monitorar os workers, criá-los ou reiniciá-los se eles falharem.

2. Worker: É a sua aplicação real. Cada worker roda em seu próprio processo, tem sua própria memória e seu próprio Event Loop.

## Implementação Prática: O Código

Atualmente, a recomendação é usar os.availableParallelism() para detectar quantos núcleos estão disponíveis para o processo.

```javascript
// server.js
import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  console.log(`[Primary] Processo ${process.pid} está rodando.`);

  // Cria um worker para cada núcleo da CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Se um worker morrer, o Primary cria um novo (Self-healing)
  cluster.on('exit', (worker, code, signal) => {
    console.log(`[Primary] Worker ${worker.process.pid} morreu. Iniciando novo...`);
    cluster.fork();
  });

} else {
  // O código aqui dentro roda em cada Worker
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Olá do Cluster Mode!\n');
  }).listen(8000);

  console.log(`[Worker] Processo ${process.pid} iniciado.`);
}
```

## O Desafio da Memória Compartilhada
O Cluster Mode escala a aplicação horizontalmente dentro da máquina, mas traz um desafio: os workers não compartilham memória.

Isso significa que:

- Variáveis globais não são sincronizadas entre instâncias.

- Sessões de usuário salvas em memória (memory store) não funcionarão, pois o usuário pode cair no Worker A na primeira requisição e no Worker B na segunda.

A Solução: Para aplicações escaláveis, use sempre um banco de dados externo ou um Redis para gerenciar estados e sessões.

## PM2: O Cluster Mode no Mundo Real

Embora o módulo nativo seja excelente para entender o conceito, em produção utilizamos gerenciadores de processos como o PM2. Ele abstrai toda a complexidade do código acima.

Para rodar sua aplicação aproveitando todos os núcleos com PM2:

```shell
pm2 start server.js -i max

```

## Conclusão: Quando Usar?

O Cluster Mode é indispensável para:

- Aplicações que precisam de alta disponibilidade (se um processo cai, os outros seguram as pontas).
- APIs que lidam com muito tráfego.
- Máquinas com múltiplos núcleos (VPS, Bare Metal).

Se você está rodando em ambientes como Kubernetes ou AWS Lambda, o escalonamento já é feito em nível de infraestrutura, e o uso do Cluster Mode interno pode ser redundante. Porém, para qualquer servidor gerenciado manualmente, ativar o Cluster é o caminho mais rápido para dobrar (ou octuplicar) a capacidade da sua aplicação.
