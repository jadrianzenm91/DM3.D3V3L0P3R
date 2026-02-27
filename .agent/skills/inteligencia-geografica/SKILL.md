---
name: inteligencia-geografica
description: Habilidades para la gestión de ubicaciones, bases aéreas y catálogos de Ubigeo.
---

# Skill: Inteligencia Geográfica y Ubicaciones FAP

Este skill se enfoca en la ubicación precisa de los activos aéreos en el territorio nacional para @DMC.1NST1TUT3.

## Capacidades Principales
1. **Catálogo FAP**: Consultar lugares específicos de operación en la tabla `TM_UBIGEO_FAP`.
2. **Mapeo por ID**: Utilizar el identificador único `IDUBICACION` para garantizar precisión geográfica.

## Cómo proceder
- Priorice el uso de catálogos maestros para evitar duplicidad.
- Valide que el ID de ubicación exista antes de persistir el reporte.
