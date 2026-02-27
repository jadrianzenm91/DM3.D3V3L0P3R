---
name: consolidacion-reportes
description: Habilidades para la agregación de datos y generación del Parte Diario.
---

# Skill: Consolidación y Generación de Reportes

Este skill se enfoca en la transformación de datos individuales en inteligencia operativa y resúmenes gerenciales para @DMC.1NST1TUT3.

## Capacidades Principales
1. **Agregación Automática**: Ejecutar cálculos de consolidación para generar el **Parte Diario**.
2. **Cálculo de Efectivos**: Aplicar la lógica `Efectivo = Operativos + Inoperativos + Disponibles`.
3. **Integridad del Cronograma**: Resumir datos por fecha en la tabla `TT_PARTE_DIARIO`.

## Cómo proceder
- Limpie registros previos para la misma fecha antes de una nueva generación para evitar duplicados.
- Verifique que el Dashboard refleje los cambios inmediatamente después del cálculo.
