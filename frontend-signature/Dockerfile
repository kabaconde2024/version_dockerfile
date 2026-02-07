# --- Étape de Build ---
FROM node:18 AS build
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Étape Finale (Production) ---
FROM nginx:stable-alpine

# On copie les fichiers compilés
COPY --from=build /app/dist /usr/share/nginx/html

# CONFIGURATION CRUCIALE : On crée un fichier de config Nginx pour gérer les routes React
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]