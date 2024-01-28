# Rest Project + TypeScript
## Instalación

1. Clonar .env.template a .env y configurar las variables de entorno
2. Ejecutar `pnpm install` para instalar las dependencias
3. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
5. Crear documento .env
6. Correr el gnrok `ngrok http 3000`
4. Ejecutar `pnpm  dev` para levantar el proyecto en modo desarrollo
7. Abrir la URL de tu navegador generada por gnrok



    ## Variables de entorno
- PORT=3000
- MONGO_URL=mongodb://******:*******@localhost:27017
- MONGO_DB_NAME=mystore
- JWT_SEED=Loquesea

- SEND_EMAIL=false 
- MAILER_SERVICE=gmail
- MAILER_EMAIL=correo@gmail.com
- MAILER_SECRET_KEY=contraseña
- WEBSERVICE_URL=https://f65a-2803-c600-810c-e970-f80f-5309-ab56-a7d6.ngrok-free.app/api
