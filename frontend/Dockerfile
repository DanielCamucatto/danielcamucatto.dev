# Use uma imagem base do Node.js para construir e servir a aplicação.
# O "alpine" é uma versão leve do Node.js, ideal para contêineres.
FROM node:20-alpine as build

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock/pnpm-lock.yaml)
# para instalar as dependências.
COPY frontend/package*.json ./

# Instala as dependências do projeto.
# Usa --silent para uma saída mais limpa, --no-cache para não armazenar cache do npm
# e --production para instalar apenas dependências de produção (se fosse o caso de build prod).
# Como estamos na fase de build, instalamos tudo para o Vite poder otimizar.
RUN npm cache clean --force && npm install 

# Copia todo o restante do código da sua aplicação para o diretório de trabalho
COPY frontend/. .

# Constrói a aplicação React para produção (gera os arquivos estáticos)
# O `npm run build` deve ser definido no seu package.json para usar `vite build`.
RUN npm run build

# --- Fase de Produção (Imagem menor para servir os arquivos estáticos) ---
# Usaremos o Nginx para servir os arquivos estáticos da aplicação React
FROM nginx:alpine

# Remove o arquivo de configuração default do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia os arquivos de build da fase anterior para o diretório de serviço do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia o arquivo de configuração customizado do Nginx para o contêiner
# Este arquivo será criado no passo 3
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 do contêiner
EXPOSE 80

# Comando para iniciar o Nginx quando o contêiner for iniciado
CMD ["nginx", "-g", "daemon off;"]