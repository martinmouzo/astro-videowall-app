# Implementación de Indicadores en VideoWall

## Resumen

Se ha implementado un sistema de visualización de indicadores en tiempo real para el VideoWall, mostrando métricas de diferentes regiones (América, Europa, Asia) dentro de círculos interactivos.

## Componentes Implementados

### 1. `IndicatorList.astro`
- **Propósito**: Muestra una lista de indicadores filtrados por región
- **Características**:
  - Filtra indicadores por región automáticamente
  - Usa valores del JSON mock o genera valores realistas
  - Colores distintivos por tipo de indicador
  - Animaciones de entrada escalonadas
  - Efectos de pulso para indicadores críticos

### 2. `RegionSummary.astro`
- **Propósito**: Muestra un resumen ejecutivo de la región
- **Características**:
  - Indicador de estado visual (color)
  - Estadísticas clave: total de tiendas, incidencias, tiendas offline
  - Estados de alerta basados en umbrales

### 3. `UpdateIndicator.astro`
- **Propósito**: Muestra información de última actualización
- **Características**:
  - Timestamp de última actualización
  - Próxima actualización programada
  - Indicador visual de actividad (pulso)

### 4. `RegionCircle.astro` (Actualizado)
- **Propósito**: Contenedor principal para cada región
- **Características**:
  - Integra todos los componentes de indicadores
  - Diseño responsivo
  - Efectos visuales mejorados

## Estructura de Datos

### Archivo Mock: `indicadores.json`
```json
[
  {
    "idTipoIndicador": 3,
    "descripcion": "Tiendas abiertas",
    "indicadores": [
      {
        "nombre": "TIENDAS_ABIERTAS_AMERICA",
        "parametros": [
          {
            "descripcion": "NUMERO_ELEMENTOS",
            "valor": "779"
          }
        ]
      }
    ]
  }
]
```

### Mapeo de Regiones
- `america` → `AMERICA`
- `europe` → `EUROPA`
- `asia` → `ASIA`

## Tipos de Indicadores y Colores

| Tipo | Descripción | Color |
|------|-------------|-------|
| 3 | Tiendas abiertas | Verde (#00ff00) |
| 13 | Tiendas con cierre | Azul (#0080ff) |
| 6 | Incidencias | Naranja (#ff8000) |
| 4 | Tiendas offline | Rojo (#ff0000) |
| 12 | Reformas | Amarillo (#ffff00) |
| 5 | Contenidos pendientes | Magenta (#ff00ff) |
| 1 | Tickets acumulados | Cian (#00ffff) |
| 2 | Tickets online | Verde claro (#80ff80) |
| 49 | Pedidos Zara | Azul claro (#8080ff) |
| 50 | Pedidos eCommerce | Rosa (#ff8080) |

## Valores Mock por Región

### América
- Tiendas abiertas: 779
- Incidencias: 234
- Tiendas offline: 5
- Tickets acumulados: 1245

### Europa
- Tiendas abiertas: 4323
- Incidencias: 578
- Tiendas offline: 4
- Tickets acumulados: 3567

### Asia
- Tiendas abiertas: 483
- Incidencias: 156
- Tiendas offline: 1
- Tickets acumulados: 892

## Características Técnicas

### Responsividad
- Fuentes escalables con `clamp()`
- Ajustes de padding y spacing en breakpoints
- Scrollbar personalizado para listas largas

### Animaciones
- Entrada escalonada de elementos (0.1s delays)
- Efectos de hover con transformaciones
- Pulso para indicadores críticos
- Indicador de actividad en tiempo real

### Estados de Alerta
- **Normal**: Verde (#44ff44)
- **Advertencia**: Naranja (#ffaa00) - más de 5 tiendas offline
- **Crítico**: Rojo (#ff4444) - más de 10 tiendas offline

## Uso

Los componentes se integran automáticamente en `RegionCircle.astro`:

```astro
<RegionSummary region={id} indicadores={indicadoresData} />
<IndicatorList region={id} indicadores={indicadoresData} />
<UpdateIndicator frequency={300} />
```

## Archivos Relacionados

- `/src/components/IndicatorList.astro`
- `/src/components/RegionSummary.astro`
- `/src/components/UpdateIndicator.astro`
- `/src/components/RegionCircle.astro`
- `/src/mocks/data/indicadores.json`
- `/src/utils/indicadores.ts`
- `/src/utils/mockDataConfig.ts`

## Próximas Mejoras

1. **Integración API Real**: Conectar con endpoints reales de indicadores
2. **WebSocket**: Actualizaciones en tiempo real sin polling
3. **Configuración Dinámica**: Umbrales de alerta configurables
4. **Filtros**: Capacidad de filtrar tipos de indicadores
5. **Historial**: Gráficos de tendencias para métricas clave
6. **Notificaciones**: Alertas sonoras y visuales para estados críticos
