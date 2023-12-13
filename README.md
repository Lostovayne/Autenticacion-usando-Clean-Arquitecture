# Rest Project + TypeScript
## Instalación

1. Clonar .env.template a .env y configurar las variables de entorno
2. Ejecutar `npm install` para instalar las dependencias
3. En caso de necesitar base de datos, configurar el docker-compose.yml y ejecutar `docker-compose up -d` para levantar los servicios deseados.
4. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo
5. Crear documento .env
6. Correr el gnrok `ngrok http 3000`



    ## Variables de entorno
- `PORT`: 3000
- `MONGO_URL`: mongodb://mongo-user:123456@localhost:27017
- `MONGO_DB_NAME`: mystore

