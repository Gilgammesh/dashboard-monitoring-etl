# PANEL DE ETL's

## Instalaciones previas

### Paso 1: Instalar Node

Usar versión 18.20.3 desde el enlace https://nodejs.org/en/blog/release/v18.20.3

### Paso 2: Instalar PM2 

Instalar PM2 de forma global

```sh
npm install pm2 -g
```

Instalar pm2-windows-startup de forma global `(sólo para windows)`

```sh
npm install pm2-windows-startup -g
```

Configurar el registro de Windows `(sólo para windows)`

```sh
pm2-startup install
```

Configurar el registro `(sólo para linux)`

```sh
pm2 startup
```

## Pasos para levantar la Aplicación en modo Desarrollo

### Paso 1: Instalaciones

Instalar las dependencias del Proyecto

```sh
npm install
```

### Paso 2: Configuraciones previas

Situarse en la carpeta donde están los archivos `client-key.key`, `client-cert.crt` y `server-ca.crt`.

Generar la clave de `client-identity.p12` usando `client-key.key` y `client-cert.crt`.

```sh
openssl pkcs12 -export -out client-identity.p12 -inkey client-key.key -in client-cert.crt
```

Se pedirá un password:

```sh
Enter Export Password: ############
```

Este valor deberá guardarse para usarse después.

### Paso 3: Variable de entorno Desarrollo

Crear una copia de `.env.template` y renombrarlo a `.env`.

Reemplazar los valores de las variables `username`, `password`, `host`, `port`, `database_name`, `path_sslidentity` y `path_server-ca`

```properties
# DATABASE
DATABASE_URL="postgresql://username:password@127.0.0.1:5432/database_name?sslmode=require&sslidentity=C:/certif/client-identity.p12&sslpassword=123456&sslcert=C:/certif/server-ca.crt"
```

Para los paths de `client-identity.p12` y `server-ca.crt`, se deberá poner la ruta completa de ubicación en windows.

### Paso 4: Variable de entorno Producción

Construir el valor de la variable de entorno `DATABASE_URL`

```txt
postgresql://username:password@127.0.0.1:5432/database_name?sslmode=require&sslidentity=C:/certif/client-identity.p12&sslpassword=123456&sslcert=C:/certif/server-ca.crt
```

Para los paths de `client-identity.p12` y `server-ca.crt`, se deberá poner la ruta completa de ubicación en windows.

Este valor se deberá copiar en las variables de entorno de de windows en la clave `DATABASE_URL`

### Paso 5: Prisma

Hacer un pull a la base de datos, para verificar la conexión y traer los schemas

```sh
npx prisma db pull
```

Generar el cliente de prisma

```sh
npx prisma generate
```

### Paso 6: Arrancar el proyecto

De manera normal

```sh
npm run dev
```

Con turbo, funcionalidad nueva

```sh
npm run dev:turbo
```

## Pasos para levantar la Aplicación en modo Producción

Despues de haber realizado los pasos de la aplicación en modo Desarrollo

### Paso 1: Compilar

Compilar la aplicación

```sh
npm run build
```

Una vez construida, verificar el funcionamiento de la compilación

```sh
npm start
```

### Paso 2: Ejecutar

Primero configurar el puerto donde arrancará la aplicación en el servidor. Para esto ingresar al archivo `ecosystem.config.js` que está en el root del proyecto y modificar el valor de `3005` por el puerto deseado.

```javascript
module.exports = {
    apps: [
      {
        name: "dashboard-etl",
        script: "node",
        args: "node_modules/next/dist/bin/next start -p 3005",
        env: {
          NODE_ENV: "production",
          PORT: 3005,
        }
      },
    ],
  };
  
```

Ejecutar la aplicación de forma permanente con PM2, nos situamos en el root del proyecto

```sh
pm2 start ecosystem.config.js
```

Esto arrancará la aplicación, se deberá ver algo similar a:

```sh
[PM2][WARN] Applications dashboard-etl not running, starting...
[PM2] App [dashboard-etl] launched (1 instances)
┌────┬────────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                       │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼────────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ dashboard-etl              │ default     │ N/A     │ fork    │ 11128    │ 0s     │ 0    │ online    │ 0%       │ 51.0mb   │ carlo    │ disabled │
└────┴────────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
[PM2][WARN] Current process list is not synchronized with saved list. App ms-catalogs differs. Type 'pm2 save' to synchronize.
```

Verificar el status:

- Si en caso el status estuviera en rojo, ejecutar el comando para revisar los logs:
  ```sh
    pm2 log dashboard-etl
  ```

- Si el status está `online` y de color verde, proceder con los siguientes paso.

Guardar la configuración para que la aplicación se siga ejecutando al reinicio del servidor.

```sh
pm2 save
```