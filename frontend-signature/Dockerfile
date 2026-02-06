# Exemple de Dockerfile pour Frontend Vite
FROM node:18 AS build
WORKDIR /app

# On définit l'argument de build
ARG VITE_API_URL

# On l'expose comme variable d'environnement pour le processus 'npm run build'
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]