# Integração com Formspree

## Visão Geral

O formulário de contato do portfólio está integrado com [Formspree](https://formspree.io/), um serviço que gerencia envio de formulários sem necessidade de backend próprio.

## Configuração Atual

- **Endpoint:** `https://formspree.io/f/xyznpdbz`
- **Método:** POST
- **Campos enviados:**
  - `name` - Nome do contato
  - `email` - Email do contato
  - `subject` - Assunto da mensagem
  - `message` - Mensagem

## Recursos do Formspree

✅ **Gratuito** até 50 envios/mês  
✅ **Proteção anti-spam** integrada  
✅ **Notificações por email** automáticas  
✅ **Dashboard** para visualizar submissões  
✅ **Zero configuração** de servidor/backend  
✅ **GDPR compliant**  

## Como Funciona

1. Usuário preenche o formulário no site
2. Frontend envia POST para `https://formspree.io/f/xyznpdbz`
3. Formspree valida e processa o envio
4. Formspree envia notificação por email para `daniel.camucatto@gmail.com`
5. Você pode visualizar todas as mensagens no dashboard Formspree

## Personalização no Formspree

Acesse https://formspree.io/forms/xyznpdbz/integration para configurar:

- **Email de notificação** - Adicionar/remover destinatários
- **Auto-resposta** - Enviar confirmação automática para o remetente
- **Webhook** - Integrar com outras ferramentas (Slack, Zapier, etc)
- **Campos customizados** - Validações adicionais
- **Redirecionamento** - Página de sucesso após envio
- **Proteção anti-spam** - Configurar reCAPTCHA ou honeypot

## Implementação no Código

Arquivo: `frontend/src/components/ContactForm.tsx`

```typescript
const res = await fetch('https://formspree.io/f/xyznpdbz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, subject, message }),
});

const data = await res.json();

if (!res.ok || !data.ok) {
  throw new Error(data.error || 'Falha no envio');
}
```

## Segurança

- O endpoint do Formspree é público (pode ser exposto no frontend)
- Formspree tem rate limiting automático
- Proteção contra spam incluída
- CORS habilitado para seu domínio

## Upgrade (Opcional)

Se precisar de mais envios/mês ou recursos avançados:

- **Gold Plan** - $10/mês - 1000 envios
- **Platinum** - $40/mês - 10000 envios
- Recursos extras: custom domains, webhooks ilimitados, storage de arquivos

## Alternativas (se necessário no futuro)

- **Netlify Forms** - Se hospedar no Netlify
- **EmailJS** - Similar ao Formspree
- **Backend próprio** - Supabase + Netlify Functions (já implementado anteriormente)
- **SendGrid API** - Direto do backend

## Suporte

- Documentação: https://help.formspree.io/
- Status: https://status.formspree.io/
