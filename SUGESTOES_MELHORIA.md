# Sugestões de Melhoria para o Projeto

Este arquivo reúne ideias e boas práticas para evoluir ainda mais o projeto no futuro.

## 1. Integração Contínua (CI)
- Já implementado: adicionamos workflow de CI em `.github/workflows/ci.yml` que roda lint, testes e build para o `frontend`.
 - Próxima melhoria: adicionar cache de dependências e upload de coverage (artifacts/Codecov).

## 2. Badge de Cobertura
- Status: Pendente — sugerido integrar com Codecov e adicionar badge no `README.md`.

## 3. Testes de Integração
- Status: Pendente — recomenda-se Playwright (ou Cypress) para E2E.
 - Observação: adicionar job E2E separado no CI para não bloquear execuções rápidas.

## 4. Testes de Erro/localStorage
- Status: Pendente — implementar testes unitários que mockem `localStorage` e verifiquem fallbacks.

## 5. Testes de Acessibilidade Automatizados
- Status: Parcial — testes unitários já verificam roles/labels. Recomenda-se integrar `jest-axe`.

## 6. Documentação
- Status: Parcial — README central foi adicionado. Recomenda-se anexar exemplos de Docker, DevContainer e comandos Makefile.

### Novas sugestões solicitadas pelo autor

- Melhorar os títulos do portfólio no modo light (contraste/cores) — verificar estilos Tailwind e ajustar classes para garantir legibilidade em temas claros.
- Adicionar seção de contato com formulário (name, email, mensagem) e integração mínima (ex.: Netlify Forms, Formspree ou endpoint simples) para receber leads.
- Adicionar um botão de download direto do currículo (link para `public/cv.pdf` e atributo `download` no botão).
- Implementar um assistente IA que fale sobre você (ex.: integrar um modelo de ChatGPT via API para responder perguntas sobre seu perfil) — começar com uma seção estática que conversa via API.
- Testes end-to-end com Playwright; dois ambientes: `production` (reflexo da `main`) e `homol` (branch de homologação) para validar releases antes do deploy final.
- Implementar política de bloqueio de deploy: configurar o workflow para falhar (e bloquear o deploy) caso lint ou testes falhem — usar proteção de branch e exigir checks obrigatórios.

---

Marque abaixo as sugestões que você quer que eu implemente primeiro e eu começo a trabalhar nelas:

- [ ] Integrar Codecov e adicionar badge
- [ ] Adicionar Playwright + job E2E no CI
- [ ] Implementar seção de contato + backend simples / Formspree
- [ ] Adicionar botão de download do CV (colocar o arquivo `public/cv.pdf`)
- [ ] Implementar IA (inicialmente como integração com OpenAI para respostas estáticas)
- [ ] Ajustar estilos para contraste no modo light
- [ ] Configurar proteção de branch para bloquear deploy quando checks falharem
 - [ ] Integrar Google Analytics 4 (GA4) — adicionar Measurement ID e enviar eventos (CV download, projetos, contato, idioma, tema)

## 7. Testes de Performance
- Avaliar tempo de renderização dos principais componentes se o projeto crescer.

---

Sinta-se livre para adicionar novas ideias ou marcar as concluídas!
