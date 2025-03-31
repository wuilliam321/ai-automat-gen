# Etapa de compilación
FROM node:18 AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente (excluyendo node_modules)
COPY . .

# Ejecutar el proceso de compilación
RUN npm run build:server

# Etapa de producción
FROM node:18-slim

WORKDIR /app

# Copiar solo los archivos necesarios desde la etapa de compilación
COPY --from=build /app/build/* ./
COPY --from=build /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Exponer el puerto (ajústalo según tu aplicación)
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["node", "./server.js", "selenium"]
