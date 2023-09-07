# Utilizar una imagen base de Node.js
FROM node:18

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json al contenedor
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código fuente al contenedor
COPY . .

# Exponer el puerto que tu aplicación utiliza (por ejemplo, 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
