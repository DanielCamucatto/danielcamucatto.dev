# Sistema de Download de CV

## Descrição
O sistema de download de CV permite que os usuários baixem o currículo do Daniel Camucatto em formato PDF, automaticamente traduzido para o idioma selecionado no site (Português, Inglês ou Espanhol).

## Como Funciona

### 1. Componente DownloadCVButton
- Localizado em: `src/components/DownloadCVButton.tsx`
- Renderiza um botão estilizado com ícone de download
- Utiliza o contexto de idioma para exibir texto adequado
- Implementa tooltip responsivo

### 2. Serviço de Geração de PDF
- Localizado em: `src/services/pdfGenerator.ts`
- Utiliza a biblioteca `jsPDF` para criar documentos PDF
- Coleta informações dos arquivos JSON de tradução
- Formata automaticamente o conteúdo baseado no idioma selecionado

### 3. Estrutura de Dados
Os dados do CV são coletados dos seguintes arquivos JSON:
- `src/locales/[idioma]/header.json` - Informações pessoais e links sociais
- `src/locales/[idioma]/about.json` - Seção "Sobre"
- `src/locales/[idioma]/experience.json` - Experiências profissionais

### 4. Integração no Header
O botão foi integrado no componente `Header.tsx`, logo após os links sociais.

## Funcionalidades

### Personalização por Idioma
- **Português**: `Daniel_Camucatto_CV_Portugues.pdf`
- **Inglês**: `Daniel_Camucatto_CV_English.pdf`
- **Espanhol**: `Daniel_Camucatto_CV_Espanol.pdf`

### Formatação Automática
- Cabeçalho com nome, cargo e descrição
- Links para LinkedIn, GitHub e Dev.to
- Seção "Sobre" com parágrafos formatados
- Experiências profissionais com:
  - Período de trabalho
  - Cargo e empresa
  - Descrição das atividades
  - Tecnologias utilizadas
- Paginação automática quando necessário
- Footer com data de geração e numeração de páginas

### Estilização
- Cores consistentes com o design do site
- Tipografia hierárquica para melhor legibilidade
- Layout responsivo e profissional

## Dependências Adicionadas
```json
{
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1"
}
```

## Como Usar
1. Acesse o site
2. Selecione o idioma desejado usando o LanguageToggle
3. Clique no botão "Baixar CV" / "Download CV" / "Descargar CV"
4. O PDF será automaticamente baixado no idioma selecionado

## Manutenção
Para atualizar o conteúdo do CV, basta editar os arquivos JSON correspondentes em `src/locales/[idioma]/`. As mudanças serão automaticamente refletidas no PDF gerado.

## Tecnologias Utilizadas
- **jsPDF**: Geração de documentos PDF
- **React Context**: Gerenciamento de idioma
- **TypeScript**: Tipagem e desenvolvimento
- **TailwindCSS**: Estilização do botão