---
title: "Redis em Larga Escala: O que aprendi quando o \"Coração\" do Sistema parou"
description: "Era uma segunda-feira comum até que, em questão de minutos, a latência do nosso principal serviço de..."
pubDate: 2026-03-28
tags: ["systemdesign","redis","backend","scala"]
cover: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fj2e8rpm84ud2p0a56ofy.png"
devtoUrl: "https://dev.to/danielcamucatto/redis-em-larga-escala-o-que-aprendi-quando-o-coracao-do-sistema-parou-54kl"
---

Era uma segunda-feira comum até que, em questão de minutos, a latência do nosso principal serviço de e-commerce saltou de 100ms para 15s. O nosso painel do Datadog estava em chamas: 100% de uso de CPU e uma fila de conexões pendentes que não parava de crescer.

O culpado? Uma Hot Key. Tínhamos uma chave de "configurações de campanha" que era consultada em cada requisição. Quando o tráfego triplicou devido a uma promoção, o nó que detinha aquela chave no cluster simplesmente não aguentou o volume de IOPS (Operações de Entrada/Saída por Segundo). Em sistemas de alta performance, o limite de IOPS define o quão rápido o hardware consegue processar requisições; quando esse teto é atingido, as solicitações enfileiram e o sistema trava.

Como resolvemos: No auge da crise, a solução imediata foi escalar verticalmente o nó afetado, mas a correção definitiva veio com a implementação de Client-side Caching. Passamos a invalidar o cache local das aplicações via Pub/Sub do Redis apenas quando a configuração mudava. Isso reduziu drasticamente as chamadas de rede e "esfriou" a chave, devolvendo a estabilidade ao cluster.

Se você usa Redis apenas como um "puxadinho" para guardar sessões, este artigo não é para você. Mas se o seu sistema depende do Redis para performance em larga escala, aqui estão as lições que aprendemos "na dor" sobre arquitetura e resiliência.

## O Mito da "Memória Infinita" e a Política de Evicção

Em escala, o Redis não é um banco de dados, é um recurso finito. O erro mais comum é deixar a configuração padrão de memória.

A Lição: Sempre defina um maxmemory e, mais importante, uma maxmemory-policy.

Para caches puros, allkeys-lru é sua melhor amiga. Ela descarta as chaves menos usadas recentemente para dar lugar às novas.

Sem isso, o Redis retornará erros de escrita assim que a RAM lotar, derrubando sua aplicação.

## Cluster vs. Sentinel: Quando mudar a marcha?

Muitos times começam com o Redis Sentinel. Ele é ótimo para Alta Disponibilidade (failover), mas ele não escala escrita ou leitura além do que um único nó aguenta.

Quando chegamos a milhões de operações por segundo, a resposta é o Redis Cluster.

Sharding Automático: O Redis divide seus dados em 16.384 hash slots distribuídos entre os nós.

Escalabilidade Horizontal: Precisa de mais performance? Adicione mais nós e rebalanceie os slots sem downtime.

## O Perigo das "Hot Keys" e "Big Keys"

No incidente que citei no início, o problema não era o Redis, era o nosso padrão de acesso.

Hot Keys: Quando uma única chave é requisitada por todos os clientes simultaneamente. Solução? Réplicas de leitura ou, melhor ainda, Client-side Caching (introduzido no Redis 6), onde a aplicação guarda uma cópia local e o Redis apenas avisa quando ela mudar.

Big Keys: Um único Hash ou List com centenas de megabytes. Isso causa pausas no processamento (o Redis é single-threaded para comandos de dados!). Use MEMORY USAGE para encontrar esses vilões.

## Comandos O(N) são Proibidos em Produção

Se eu pudesse dar apenas um conselho: Delete o comando KEYS * do seu vocabulário.
Em um banco com milhões de chaves, o KEYS trava o processo inteiro enquanto varre a memória.

Use SCAN: Ele itera sobre as chaves de forma incremental sem bloquear o servidor.

O mesmo vale para HGETALL em hashes gigantes; prefira HSCAN.

## Persistência: RDB ou AOF?

Escalar o Redis exige cuidado com o disco.

RDB (snapshots) é performático, mas você pode perder alguns minutos de dados.

AOF (log de operações) é mais seguro, mas pode gerar um gargalo terrível de escrita em disco (IOPS) em sistemas de alta vazão.
Dica de ouro: Em clusters de cache, muitas vezes é melhor desativar a persistência nos nós principais e deixá-la ativa apenas em um nó secundário para disaster recovery.

# Conclusão

O Redis é uma Ferrari, mas ninguém dirige uma Ferrari a 300km/h sem manutenção constante. Em larga escala, a observabilidade é tudo. Monitore seu Slow Log, entenda sua distribuição de chaves e nunca subestime o poder de uma configuração bem feita.

E você? Já passou por algum "aperto" com o Redis que parecia inexplicável? Vamos conversar nos comentários! 🚀
