---
description: Cómo configurar e instalar el proyecto Parte de Situación de Aeronaves desde cero
---

Siga estos pasos para recrear el ambiente de desarrollo y ejecutar la aplicación.

### 1. Requisitos Previos
- Node.js (v16 o superior)
- MySQL Server (accesible con las credenciales del .env)
- npm o yarn

### 2. Estructura de Archivos
Asegúrese de que el proyecto tenga la siguiente estructura:
```
/assets/js/app.js
/assets/css/index.css
/index.html
/server.js
/schema.sql
/.env
/package.json
```

### 3. Configuración de Base de Datos
Ejecute el archivo `schema.sql` en su instancia de MySQL para crear las tablas necesarias.
```bash
mysql -u <usuario> -p <base_de_datos> < schema.sql
```

### 4. Instalación de Dependencias
// turbo
```bash
npm install express mysql2 dotenv cors
```

### 5. Configuración de Variables de Entorno
Cree un archivo `.env` en la raíz con el siguiente formato:
```env
DB_HOST=51.79.66.140
DB_PORT=33306
DB_USER=eofap
DB_PASS=qwerty*2025
DB_NAME=eofapcd3
PORT=3000
```

### 6. Ejecución del Servidor
// turbo
```bash
node server.js
```

### 7. Acceso a la Aplicación
Abra su navegador en `http://localhost:3000` para ver el Dashboard interactivo.
