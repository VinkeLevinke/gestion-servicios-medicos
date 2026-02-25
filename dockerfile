FROM node:20-alpine

# INSTALAR LIBRERÍAS CRÍTICAS PARA PRISMA
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY package*.json ./
# Instalamos dependencias
RUN npm install

# Copiamos la carpeta prisma ANTES de generar el cliente
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]