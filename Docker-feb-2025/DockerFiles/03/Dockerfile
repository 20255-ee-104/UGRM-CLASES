FROM node:14
WORKDIR /app

# Copiar package.json y package-lock.json antes de instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar todo el código, incluyendo server.js
COPY . .

EXPOSE 8080
CMD ["npm", "start"]

