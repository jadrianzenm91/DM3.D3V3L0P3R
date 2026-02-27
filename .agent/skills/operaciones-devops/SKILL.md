---
name: operaciones-devops
description: Habilidades para el despliegue continuo, seguridad de secretos y portabilidad del sistema.
---

# Skill: Operaciones DevOps y Despliegue Continuo

Este skill se enfoca en la estabilidad, seguridad y portabilidad de la aplicación @DMC.1NST1TUT3 en la nube.

## Capacidades Principales
1. **Control de Versiones (Git)**: Gestionar el historial de cambios y ramas de producción.
2. **Portabilidad de Entornos**: Configurar el frontend con **rutas relativas** (`/api`).
3. **Sincronización de Nube**: Gestionar el flujo hacia GitHub para disparar redespliegues en Render.
4. **Gestión de Secretos**: Mantener información sensible fuera del código público mediante `.gitignore`.
5. **Reconstrucción del Esquema**: Habilidad para utilizar el archivo `schema.sql` (fuente de verdad) para recrear la estructura de la base de datos MySQL en cualquier nuevo servidor.

## Cómo proceder
- Asegure que el servidor Express sirva los archivos estáticos desde la raíz.
- Configure las variables de entorno en el panel de Render coincidiendo con el `.env` local.
