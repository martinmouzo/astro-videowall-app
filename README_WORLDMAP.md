# 🌍 WorldMap Component - Network Monitor

## Descripción

El componente WorldMap es una implementación completa de un monitor de red interactivo que visualiza conexiones de latencia entre un nodo central en Arteixo, A Coruña, España y nodos remotos distribuidos globalmente.

## ✨ Funcionalidades Principales

### 🗺️ Mapa Interactivo
- **MapLibre GL JS**: Renderizado de mapas vectoriales de alto rendimiento
- **Países coloreados**: España (dorado) y países con nodos remotos (verde)
- **Navegación fluida**: Zoom, pan, flyTo animations
- **Vista responsiva**: Adaptación automática a diferentes tamaños de pantalla

### 📍 Sistema de Pins
- **Pin central (Arteixo)**: Marcador dorado distintivo para el centro de operaciones
- **Pins de latencia**: Marcadores dinámicos que muestran latencia en tiempo real
- **Estados visuales**: Colores basados en rangos de latencia
  - Verde: < 50ms (buena)
  - Naranja: 50-100ms (advertencia)
  - Rojo: 100-200ms (crítico)
  - Gris: > 200ms (offline)
- **Animaciones**: Efectos de aparición y pulsación en hover
- **Interactividad**: Click para centrar mapa, tooltips informativos

### 🔗 Líneas de Conexión
- **Conexiones dinámicas**: Líneas desde Arteixo a cada nodo remoto
- **Colores adaptativos**: Basados en latencia actual
- **Grosor variable**: Conexiones mejores tienen líneas más gruesas
- **Animación**: Efecto de líneas punteadas en movimiento

### 📊 Panel de Estadísticas (MapStats)
- **Métricas en tiempo real**:
  - Total de nodos
  - Conexiones activas
  - Latencia promedio
  - Estado del mapa
- **Actualización automática**: Cada 5 segundos
- **Indicador de estado**: LED visual de conexión
- **Responsive**: Adaptación a móviles

### 🔔 Sistema de Notificaciones
- **Alertas automáticas**: Cambios significativos de latencia
- **Tipos de notificación**: Éxito, advertencia, error, información
- **Auto-dismissal**: Desaparición automática configurable
- **Interactividad**: Click para cerrar manualmente
- **Monitoreo proactivo**: Detección de conexiones críticas

## 🎮 Controles de Interfaz

### Botones de Control
- **🌍 Reset View**: Volver a vista global del mapa
- **📊 Toggle Stats**: Mostrar/ocultar panel de estadísticas
- **🔄 Refresh Data**: Actualizar datos del mapa
- **🔔 Clear Alerts**: Limpiar todas las notificaciones

### ⌨️ Atajos de Teclado
- `Ctrl/Cmd + R`: Actualizar datos
- `Ctrl/Cmd + S`: Toggle panel de estadísticas
- `Ctrl/Cmd + C`: Limpiar notificaciones
- `Escape`: Restablecer vista del mapa
- `F1`: Mostrar ayuda de atajos

## 🏗️ Arquitectura Técnica

### Componentes
```
├── WorldMap.astro          # Componente principal del mapa
├── MapStats.astro          # Panel de estadísticas
├── NotificationSystem.astro # Sistema de alertas
└── network-monitor.astro   # Página principal
```

### Tecnologías
- **MapLibre GL JS 5.6.0**: Motor de renderizado de mapas
- **TypeScript**: Tipado fuerte y mejor DX
- **Astro**: Framework web moderno
- **CSS3**: Animaciones y transiciones avanzadas

### Datos de Configuración
```typescript
// src/mocks/data/latency-data.ts
export const latencyConfig = {
  centralNode: {
    name: "Arteixo",
    coordinates: [-8.5096, 43.3039], // A Coruña, España
    country: "Spain"
  },
  remoteNodes: [
    { country: "USA", coordinates: [-74.0060, 40.7128], latency: 270, status: "online" },
    { country: "Brazil", coordinates: [-46.6333, -23.5505], latency: 450, status: "online" },
    // ... más nodos
  ]
};
```

## 🔧 Funcionalidades Avanzadas

### Simulación de Latencia
- **Variación realista**: ±30ms cada 15 segundos
- **Límites configurables**: Entre 10ms y 500ms
- **Actualización visual**: Cambios de color automáticos
- **Persistencia**: Valores se mantienen en configuración

### Sistema de Debug
```javascript
// Herramientas disponibles en consola del navegador
window.mapUtils = {
  getLatencyConfig: () => latencyConfig,
  getMap: () => map,
  getMapStats: () => stats,
  resetMap: () => void,
  markers: () => markers[]
};

window.notifications = {
  success: (title, message, duration?) => void,
  warning: (title, message, duration?) => void,
  error: (title, message, duration?) => void,
  info: (title, message, duration?) => void,
  clear: () => void
};
```

### Manejo de Errores
- **Reintentos automáticos**: Si falla la carga del mapa
- **Logging detallado**: Errores en consola para debugging
- **Fallbacks**: Valores por defecto para datos faltantes
- **Notificaciones**: Alertas visuales para errores críticos

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 768px - Interfaz completa
- **Mobile**: ≤ 768px - Controles adaptados, stats compactos

### Optimizaciones Móviles
- Touch controls optimizados
- Botones más grandes
- Panel de stats compacto
- Notificaciones adaptadas al ancho

## 🚀 Rendimiento

### Optimizaciones
- **Lazy loading**: Componentes cargan según necesidad
- **Debounced updates**: Actualizaciones limitadas en frecuencia
- **Memory management**: Limpieza de markers y eventos
- **Efficient animations**: CSS transforms y GPU acceleration

### Métricas
- **Initial load**: < 2s en conexión rápida
- **Memory usage**: < 50MB típico
- **CPU usage**: Mínimo en estado idle
- **Network**: Tiles vectoriales eficientes

## 🧪 Testing

### Funcionalidad Manual
1. **Carga inicial**: Verificar que el mapa aparece con todos los pins
2. **Interactividad**: Click en pins para centrar vista
3. **Estadísticas**: Verificar actualización automática
4. **Notificaciones**: Alertas aparecen correctamente
5. **Controles**: Todos los botones funcionan
6. **Responsive**: Probar en diferentes tamaños

### Debug Console
```javascript
// Verificar estado del mapa
console.log(window.mapUtils.getMapStats());

// Probar notificaciones
window.notifications.success('Test', 'Funciona correctamente');

// Información de latencia
console.log(window.mapUtils.getLatencyConfig());
```

## 📈 Extensibilidad

### Agregar Nuevos Nodos
```typescript
// En src/mocks/data/latency-data.ts
remoteNodes: [
  // ... nodos existentes
  {
    country: "India",
    coordinates: [77.2090, 28.6139], // Nueva Delhi
    latency: 180,
    status: "online"
  }
]
```

### Personalizar Colores
```css
/* En WorldMap.astro */
:global(.pin-latency.good) {
  background: linear-gradient(135deg, #nuevo-color, #nuevo-color-dark);
}
```

### Nuevos Tipos de Notificación
```javascript
// En NotificationSystem.astro
window.notifications.custom({
  type: 'custom',
  title: 'Tipo Personalizado',
  message: 'Mensaje custom',
  icon: '🎯'
});
```

## 🎯 Roadmap

### Próximas Mejoras
- [ ] **WebSocket**: Datos de latencia en tiempo real
- [ ] **Filtros**: Por región, tipo de conexión, etc.
- [ ] **Histórico**: Gráficos de latencia temporal
- [ ] **Exportar**: Datos a CSV/JSON
- [ ] **Temas**: Dark/light mode
- [ ] **Multi-idioma**: i18n support
- [ ] **PWA**: Funcionamiento offline
- [ ] **Tests automatizados**: Unit y E2E testing

### Integraciones Futuras
- **APIs externas**: Datos reales de latencia
- **Bases de datos**: Persistencia de métricas
- **Alerting**: Email/SMS para eventos críticos
- **Dashboard**: Múltiples mapas simultáneos

---

**Desarrollado con ❤️ para el proyecto Videowall CPD**

*Documentación actualizada: Junio 2025*
