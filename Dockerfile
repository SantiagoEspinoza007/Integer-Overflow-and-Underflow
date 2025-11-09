FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer puertos de las tiendas
EXPOSE 3200 3201

CMD ["node", "vuln-tech-store.js"]
