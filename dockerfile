FROM node:20-alpine

# Instalación de librerías críticas para el correcto funcionamiento de Prisma en Alpine Linux
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copia de archivos de configuración de dependencias
COPY package*.json ./

# Instalación de dependencias del proyecto
RUN npm install

# Copia de esquema Prisma y generación del cliente para asegurar tipado fuerte
COPY prisma ./prisma/
RUN npx prisma generate

# Copia del resto del código fuente
COPY . .

# Compilación del proyecto NestJS
RUN npm run build

# Exposición del puerto configurado
EXPOSE 3000

# Comando por defecto (sobrescrito por docker-compose en desarrollo)
CMD ["npm", "run", "start:prod"]