# Reglas del Proyecto: Parte de Situación de Aeronaves

## Arquitectura
- Utilizar HTML5, Tailwind CSS y JavaScript Vanilla para el frontend.
- La lógica del backend debe interactuar directamente con la base de datos MySQL.
- Servidor: Node.js (Express) configurado para servir archivos estáticos y API.

## Modelo de Datos
- Adherirse estrictamente al esquema `eofapcd3`.
- **Diferenciación de Identidad**: El **Tipo de Aeronave** (modelo/clase) y la **Matrícula** (identificador único de la unidad) son campos separados y nunca deben combinarse.
- Campos técnicos obligatorios: `TOTALHORAS` (Decimal), `CODUNIDAD` (String), `SIGLA` (String).
- Claves primarias: `ID` (Gestionados manualmente en el backend si no son autoincrementales).
- Claves foráneas: Utilizar `ID_CONDICION`, `IDUBICACION`.

## Reglas de Negocio
1. Condiciones de Aeronaves: `Operativo`, `Inoperativo`, `Disponible`.
2. Ubicación: Utilizar el catálogo `TM_UBIGEO_FAP` mediante el `IDUBICACION`.
3. Lógica de suma: `Efectivo = Inoperativos + Disponibles + Operativos`.
4. El "Parte Diario" se genera mediante un proceso de agregación (`POST /api/generar-parte-diario`) que consolida los datos de situación por tipo de aeronave.

## UI/UX
- Diseño responsivo utilizando Tailwind. Estética "Glassmorphism" oscura.
- Botón interactivo para totalizar el estado diario desde el Dashboard.
- Notificaciones de éxito para cada registro y proceso de cálculo.

