# Skills: Parte de Situación de Aeronaves

## 1. Gestión del Estado de Vuelo
- **Descripción**: Gestiona la condición de las aeronaves (Operativo/Inoperativo/Disponible).
- **Funciones**:
    - `updateCondition(aircraftId, condition)`
    - `getConditionHistory(aircraftId)`

## 2. Reporte Diario y Situación Técnica
- **Descripción**: Maneja el reporte diario incluyendo métricas técnicas de las aeronaves.
- **Funciones**:
    - `registerDailyReport(reportData)`: Registra **Tipo de Aeronave** (ej: KT-1P) y **Matrícula** (ej: 341) como campos **independientes**. Incluye también Total Horas, Código de Unidad, Sigla y Condición.
    - `validateTechnicalData(hours, unitCode)`: Asegura la precisión de los datos decimales y códigos de unidad.

## 3. Contexto Geográfico Simplificado
- **Descripción**: Gestiona las ubicaciones utilizando el catálogo maestro de la FAP.
- **Funciones**:
    - `getUbigeoByLocationID(idUbicacion)`: Utiliza el `IDUBICACION` como identificador único para el mapeo geográfico.
    - `listAvailableLocations()`: Carga el catálogo dinámico de lugares y ubigeos.

## 4. Agregación y Cálculo de Parte Diario
- **Descripción**: Método para totalizar automáticamente el estado de las aeronaves al final del día.
- **Funciones**:
    - `generarParteDiario()`: Ejecuta la agregación SQL (Count/Sum) para consolidar los registros en la tabla de resumen `TT_PARTE_DIARIO`.
    - `refreshDashboardSummary()`: Actualiza las tarjetas de estadísticas globales (Efectivos, Operativos, etc.).

## 5. Registro Detallado de Aeronaves
- **Descripción**: Gestiona los registros específicos de aeronaves y su histórico situacional.
- **Funciones**:
    - `getAircraftDetail(matricula)`
    - `saveSituacionActual(formData)`: Persiste la información técnica y de ubicación vinculada a una matrícula.
## 6. Despliegue Continuo y CI/CD
- **Descripción**: Automatiza la subida de cambios y el despliegue en entornos de nube (Render).
- **Funciones**:
    - `setupGitRepository()`: Inicializa Git y configura `.gitignore` para proteger secretos.
    - `pushToProduction(repositoryUrl)`: Sincroniza el código local con el remoto para disparar el redespliegue.
    - `configureEnvironmentVariables()`: Valida que el archivo `.env` local sea compatible con los secretos de Render.

## 7. Gestión de Entornos Dinámicos
- **Descripción**: Asegura que el frontend se comunique con el backend sin importar la URL del despliegue.
- **Funciones**:
    - `setRelativeAPIPath()`: Configura `API_BASE_URL` como ruta relativa (`/api`) para eliminar problemas de CORS.
