---
title: "Gerenciamento de memória em Node.js: o que todo desenvolvedor precisa saber antes que a produção avise"
description: "\"A aplicação caiu de madrugada. O heap estava em 3 GB. Ninguém sabia por quê.\" Essa frase é mais..."
pubDate: 2026-05-02
updatedDate: 2026-05-02
tags: ["node","programming"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F0s2966iq2wia69y44aae.png"
devtoUrl: "https://dev.to/danielcamucatto/gerenciamento-de-memoria-em-nodejs-o-que-todo-desenvolvedor-precisa-saber-antes-que-a-producao-4khk"
---

> "A aplicação caiu de madrugada. O heap estava em 3 GB. Ninguém sabia por quê."  
> Essa frase é mais comum do que deveria ser.

Memory leaks são silenciosos. Eles não geram exceção, não quebram testes e não aparecem em code review. Crescem devagar, às vezes por semanas, até que o processo começa a travar, a latência dispara e o servidor reinicia sozinho às 3 da manhã.

Este artigo é um guia prático sobre como a memória funciona no Node.js, por que leaks acontecem e, principalmente, como detectá-los e evitá-los antes que o problema chegue em produção.

---

## 1 · O modelo de memória do V8

Node.js roda sobre o **V8**, o mesmo motor JavaScript do Chrome. Entender como o V8 organiza a memória é o primeiro passo para não ter surpresas.

### Stack vs. Heap

A memória de um processo Node é dividida em duas regiões principais:

**Stack (Pilha):** armazena valores primitivos (`number`, `boolean`, `string` curta) e referências a objetos. É alocada e liberada automaticamente conforme funções entram e saem do call stack. Rápida, com tamanho fixo, sem necessidade de garbage collection.

**Heap:** é onde vivem objetos, arrays, closures e funções. É aqui que os memory leaks moram.

### As regiões do Heap

O Heap do V8 é subdividido em áreas com comportamentos distintos:

| Região | Tamanho típico | Função |
|---|---|---|
| **New Space** | 1–8 MB | Objetos recém-criados. Coletado com frequência. |
| **Old Space** | até ~1.5 GB | Objetos que sobreviveram ao GC. Onde leaks se acumulam. |
| **Large Object Space** | variável | Objetos acima de ~512 KB. Nunca movidos. |
| **Code Space** | variável | Bytecode compilado pelo JIT. |

A maioria dos objetos nasce no **New Space** e morre lá. Apenas os que sobrevivem a dois ciclos de GC são **promovidos** para o Old Space e é exatamente nessa promoção que problemas silenciosos começam.

### O limite padrão do Heap

Em sistemas 64-bit, o V8 limita o Heap a aproximadamente **1.5 GB** por padrão. Para cargas maiores, você pode ajustar:

```bash
node --max-old-space-size=4096 app.js  # aumenta para 4 GB
```

⚠️ **Atenção:** aumentar o limite não resolve um leak. Só compra tempo e geralmente mascara o problema até ele ficar catastrófico.

---

## 2 · O Garbage Collector: como ele decide o que coletar

O GC do V8 é sofisticado e usa estratégias diferentes para cada região do Heap.

### Scavenge — para o New Space

Rápido e frequente. O algoritmo copia objetos **vivos** para uma área limpa e descarta tudo que sobrou. Dura de 1 a 5 ms e raramente afeta a aplicação. A maioria dos objetos que você cria (variáveis locais, respostas de funções) morre aqui.

### Mark-and-Sweep / Mark-Compact — para o Old Space

Mais pesado. Funciona em duas fases:

1. **Mark:** percorre todas as referências a partir das "raízes" (variáveis globais, call stack ativa, handles do libuv) e marca o que ainda está vivo.
2. **Sweep/Compact:** remove o que não foi marcado. Opcionalmente, compacta o heap para reduzir fragmentação.

O V8 moderno usa **incremental marking** e **concurrent sweeping** para evitar parar a aplicação inteira, mas **GC pauses ainda existem**. Em ambientes de alta carga, elas aparecem como picos de latência inexplicáveis em dashboards.

### Visualizando o GC em ação

```bash
node --trace-gc app.js
```

Saída típica:

```plaintext
[12345] Scavenge 2.5 (3.0) -> 1.8 (4.0) MB, 1.2 ms
[12345] Mark-Compact 48.0 (52.0) -> 30.1 (52.0) MB, 124.6 ms
```

Um `Mark-Compact` de **124 ms em produção** é um problema real para qualquer API com SLA abaixo de 200 ms. Se você vê isso com frequência, seu Old Space está crescendo além do normal.

---

## 3 · As quatro causas mais comuns de memory leak

Um leak tem uma definição simples: **um objeto que não é mais necessário, mas que o GC não consegue coletar porque ainda existe alguma referência a ele.** Veja os padrões mais comuns:

---

### 3.1 · Event listeners não removidos

Este é o leak mais frequente em aplicações Node.js. Cada vez que você adiciona um listener com `.on()` sem removê-lo depois, a função callback, e tudo que ela referencia via closure — permanece na memória.

```javascript
// ❌ Problemático: novo listener adicionado a cada requisição
app.get('/stream', (req, res) => {
  emitter.on('dados', (chunk) => {
    res.write(chunk);
  });
  // listener nunca é removido quando a conexão fecha
});

// ✅ Correto: remover o listener quando a conexão encerrar
app.get('/stream', (req, res) => {
  const handler = (chunk) => res.write(chunk);
  emitter.on('dados', handler);
  
  req.on('close', () => {
    emitter.removeListener('dados', handler);
  });
});
```

> 💡 O Node.js emite um aviso `MaxListenersExceededWarning` quando um EventEmitter ultrapassa 10 listeners. **Não ignore esse aviso** ele é quase sempre sintoma de um leak.

---

### 3.2 · Closures capturando mais do que deveriam

Closures são poderosas, mas capturam o **escopo inteiro** da função onde foram criadas. Se esse escopo contém um objeto grande, ele permanece na memória enquanto a closure existir.

```javascript
// ❌ Problemático: closure retém array inteiro de 500 MB
function criarHandlers(itens) {
  const todosOsRegistros = carregarBaseFull(); // 500 MB em memória

  return itens.map(item => {
    // esta função fecha sobre 'todosOsRegistros' inteiro
    return () => todosOsRegistros.find(r => r.id === item.id);
  });
}

// ✅ Correto: extrair apenas o necessário antes de criar a closure
function criarHandlers(itens) {
  const todosOsRegistros = carregarBaseFull();
  const indice = new Map(todosOsRegistros.map(r => [r.id, r]));
  // agora podemos liberar a referência ao array grande
  // todosOsRegistros = null; // (se for var/let fora de módulo)

  return itens.map(item => {
    return () => indice.get(item.id); // closure só fecha sobre o Map
  });
}
```

---

### 3.3 · Caches sem limite de tamanho

Um cache em memória sem política de expiração ou limite de entradas é um leak garantido em ambientes com dados dinâmicos.

```javascript
// ❌ Problemático: Map que só cresce
const cache = new Map();

app.get('/produto/:id', async (req, res) => {
  if (!cache.has(req.params.id)) {
    cache.set(req.params.id, await buscarProduto(req.params.id));
  }
  res.json(cache.get(req.params.id));
  // após 1 milhão de produtos diferentes: 1 milhão de entradas no Map
});

// ✅ Correto: cache com limite e TTL usando lru-cache
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 1000,              // máximo de 1000 entradas
  ttl: 1000 * 60 * 5,    // expiração: 5 minutos
});

app.get('/produto/:id', async (req, res) => {
  const cached = cache.get(req.params.id);
  if (cached) return res.json(cached);

  const produto = await buscarProduto(req.params.id);
  cache.set(req.params.id, produto);
  res.json(produto);
});
```

---

### 3.4 · Referências globais acidentais

No modo não-strict, atribuir a uma variável não declarada cria uma propriedade no objeto global (`global` no Node.js). Ela nunca é coletada enquanto o processo viver.

```javascript
// ❌ Problemático: 'resultado' vira global.resultado silenciosamente
function processar(dados) {
  resultado = transformar(dados); // sem const/let/var!
  return resultado;
}

// ✅ Correto: 'use strict' + sempre declarar variáveis
'use strict';

function processar(dados) {
  const resultado = transformar(dados);
  return resultado;
}
```

> 💡 Use sempre `'use strict'` ou prefira módulos ES (`import/export`), que são strict por padrão.

---

## 4 · Detectando e diagnosticando leaks

Suspeitar de um leak é uma coisa. Provar e localizar é outra. Veja o fluxo de diagnóstico recomendado:

### 4.1 · Monitorar o uso de memória em tempo real

O ponto de partida mais simples é o próprio Node:

```javascript
setInterval(() => {
  const mem = process.memoryUsage();
  console.log({
    rss:      `${Math.round(mem.rss / 1024 / 1024)} MB`,      // memória total do processo
    heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`, // heap em uso
    heapTotal:`${Math.round(mem.heapTotal / 1024 / 1024)} MB`, // heap alocado
    external: `${Math.round(mem.external / 1024 / 1024)} MB`,  // buffers C++
  });
}, 5000);
```

Se `heapUsed` cresce continuamente sem estabilizar, você tem um leak.

### 4.2 · Heap snapshot com Chrome DevTools

O jeito mais eficaz de encontrar o que está vazando:

```bash
# Iniciar a aplicação com suporte a inspeção
node --inspect app.js
```

1. Abra `chrome://inspect` no Chrome
2. Clique em **"inspect"** na sua aplicação
3. Vá na aba **Memory → Heap snapshot**
4. Tire um snapshot, execute a carga, tire outro snapshot
5. Compare os dois usando a view **"Comparison"** — os objetos que aparecem em vermelho e cresceram são os suspeitos

### 4.3 · heapdump programático

Para ambientes de produção onde não é viável usar DevTools interativamente:

```javascript
import heapdump from 'heapdump';

// Gera snapshot sob demanda via sinal UNIX
process.on('SIGUSR2', () => {
  heapdump.writeSnapshot(`./heap-${Date.now()}.heapsnapshot`);
  console.log('Heap snapshot salvo.');
});
```

```bash
# Enviar o sinal para o processo
kill -USR2 <PID>
```

O arquivo `.heapsnapshot` gerado pode ser carregado no Chrome DevTools para análise.

### 4.4 · Clínica.js — diagnóstico automatizado

Para um diagnóstico mais completo sem precisar de conhecimento profundo de DevTools:

```bash
npm install -g clinic
clinic doctor -- node app.js
```

O **Clinic.js Doctor** gera um relatório visual identificando automaticamente GC pressure, event loop lag e padrões suspeitos de memória.

---

## 5 · Boas práticas para prevenir leaks

Prevenir é sempre melhor que diagnosticar. Estas práticas tornam leaks menos prováveis por padrão:

### 5.1 · Prefira WeakMap e WeakRef para metadados

Quando você precisa associar dados extras a um objeto sem impedir que ele seja coletado:

```javascript
// Map comum: mantém referência forte — objeto nunca é coletado
const metadados = new Map();
metadados.set(usuario, { ultimoAcesso: Date.now() });

// WeakMap: referência fraca — objeto é coletado normalmente quando não há mais uso
const metadados = new WeakMap();
metadados.set(usuario, { ultimoAcesso: Date.now() });
// quando 'usuario' não tiver mais referências, a entrada some automaticamente
```

### 5.2 · Sempre remova listeners ao destruir objetos

```javascript
class ServicoDeNotificacao {
  constructor(emitter) {
    this.emitter = emitter;
    this.handler = this.processar.bind(this);
    this.emitter.on('notificacao', this.handler);
  }

  processar(evento) {
    // lógica de processamento
  }

  // Sempre implementar um método de limpeza
  destroy() {
    this.emitter.removeListener('notificacao', this.handler);
  }
}

// Uso correto
const servico = new ServicoDeNotificacao(emitter);
// ... quando não precisar mais:
servico.destroy();
```

### 5.3 · Use AbortController para timers e operações assíncronas

```javascript
// ❌ Timer que nunca é cancelado mantém a closure viva
const timer = setInterval(() => verificar(), 1000);

// ✅ Cancele timers quando não precisar mais deles
const controller = new AbortController();

const timer = setInterval(() => {
  if (controller.signal.aborted) {
    clearInterval(timer);
    return;
  }
  verificar();
}, 1000);

// Para limpar:
controller.abort();
```

### 5.4 · Limite o tamanho de filas e buffers internos

Em streams e filas de processamento, sempre defina backpressure:

```javascript
import { Transform } from 'stream';

const transformacao = new Transform({
  highWaterMark: 16 * 1024, // 16 KB — limite o buffer interno
  transform(chunk, encoding, callback) {
    // processar
    callback(null, chunk);
  }
});
```

---

## 6 · Monitoramento em produção

Detectar um leak em desenvolvimento é bom. Detectar em produção antes que ele derrube a aplicação é melhor.

### Métricas essenciais para expor

```javascript
import express from 'express';
const app = express();

app.get('/metrics', (req, res) => {
  const mem = process.memoryUsage();
  const uptime = process.uptime();

  res.json({
    uptime_seconds: uptime,
    heap_used_mb:   Math.round(mem.heapUsed  / 1024 / 1024),
    heap_total_mb:  Math.round(mem.heapTotal / 1024 / 1024),
    rss_mb:         Math.round(mem.rss       / 1024 / 1024),
    external_mb:    Math.round(mem.external  / 1024 / 1024),
  });
});
```

### Alertas proativos com threshold

```javascript
const LIMITE_HEAP_MB = 800; // 80% do max-old-space-size

setInterval(() => {
  const heapMB = process.memoryUsage().heapUsed / 1024 / 1024;

  if (heapMB > LIMITE_HEAP_MB) {
    logger.warn({
      mensagem: 'Heap acima do limite seguro',
      heapMB: Math.round(heapMB),
      limiteMB: LIMITE_HEAP_MB,
    });
    // integrar com Slack, PagerDuty, etc.
  }
}, 30_000);
```

### Integração com Prometheus + Grafana

A biblioteca `prom-client` é o padrão para expor métricas Node.js no ecossistema Prometheus:

```javascript
import client from 'prom-client';

// Coleta métricas padrão do Node (heap, GC, event loop lag)
client.collectDefaultMetrics({ prefix: 'minha_app_' });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
```

Com isso, você tem dashboards de heap, GC pressure e event loop lag prontos no Grafana, e pode configurar alertas antes que o problema afete usuários.

---

## Checklist de saúde de memória

Use como referência em code reviews e antes de subir para produção:

- [ ] Todos os event listeners têm um correspondente `removeListener` ou `.once()`?
- [ ] Caches em memória têm limite de tamanho e TTL definidos?
- [ ] Não há variáveis declaradas sem `const`, `let` ou `var`?
- [ ] Streams e filas têm `highWaterMark` configurado?
- [ ] Closures de longa duração não capturam objetos grandes desnecessariamente?
- [ ] `WeakMap`/`WeakRef` são usados para metadados associados a objetos externos?
- [ ] O endpoint `/metrics` (ou equivalente) está expondo `heapUsed` e `heapTotal`?
- [ ] Existe alerta configurado para quando o heap ultrapassar 80% do limite?

---

## Conclusão

Gerenciamento de memória em Node.js não é um tema reservado a especialistas em performance. É conhecimento fundamental para qualquer desenvolvedor que coloca código em produção.

O V8 faz um trabalho excelente automatizando a coleta de lixo, mas ele só pode coletar o que não tem mais referências. A responsabilidade de **não criar referências desnecessárias** é sempre do desenvolvedor.

Os problemas mais graves raramente são causados por código complexo. São causados por um `map.set()` sem um `map.delete()` correspondente, por um `.on()` sem `.off()`, por um `setInterval` que nunca foi cancelado. Detalhes pequenos, consequências grandes.

Monitore, instrumente, e quando o dashboard mostrar aquela curva de heap que não para de subir, agora você sabe o que fazer.

---

## Referências

- [V8 Memory Management — v8.dev](https://v8.dev/blog/trash-talk)
- [Node.js Documentation: process.memoryUsage()](https://nodejs.org/api/process.html#processmemoryusage)
- [Clinic.js — Node.js Performance Profiling](https://clinicjs.org/)
- [lru-cache — npm](https://www.npmjs.com/package/lru-cache)
- [prom-client — Prometheus client for Node.js](https://github.com/siimon/prom-client)
- [Chrome DevTools: Memory panel](https://developer.chrome.com/docs/devtools/memory-problems/)
- [Node.js Best Practices — Memory](https://github.com/goldbergyoni/nodebestpractices#7-performance-best-practices)
- [heapdump — npm](https://www.npmjs.com/package/heapdump)
