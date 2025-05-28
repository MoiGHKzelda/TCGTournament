FROM node:18

WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar la caché
COPY package*.json ./

# Instalamos dependencias (aquí se instala Vite)
RUN npm install

# Copiamos el resto del proyecto
COPY . .

EXPOSE 5173

# Ejecuta Vite con host accesible desde fuera
CMD ["npm", "run", "dev"]
