# Componente de Mapa Mundial Interactivo

## Descripción

Este componente de Astro proporciona un mapa mundial interactivo con soporte para datos GeoJSON y marcadores personalizados. Utiliza MapLibre GL JS para renderizar mapas vectoriales con un estilo minimalista y monocromático.

## Características

- 🗺️ **Mapa mundial interactivo** con controles de navegación
- 📍 **Marcadores personalizados** con popups informativos
- 🎨 **Estilos configurables** (oscuro, claro, monocromo)
- 📊 **Soporte GeoJSON** para datos geoespaciales
- 🎛️ **Panel de control** para gestionar capas y configuraciones
- 📱 **Diseño responsivo** optimizado para móviles
- 🔍 **Controles de zoom** y navegación
- 📥 **Exportación de datos** en formato JSON

## Tecnologías Utilizadas

- **MapLibre GL JS**: Biblioteca de mapas vectoriales de código abierto
- **Astro**: Framework web moderno
- **TypeScript**: Tipado estático para JavaScript
- **CSS moderno**: Estilos con variables y animaciones

## Instalación y Uso

### 1. Instalar dependencias

```bash
npm install maplibre-gl @types/maplibre-gl
```

### 2. Importar el componente

```astro
---
import WorldMap from '../components/WorldMap.astro';
---

<WorldMap />
```

### 3. Ejemplo de página completa

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import WorldMap from '../components/WorldMap.astro';
---

<BaseLayout title="Mapa Mundial">
  <main>
    <WorldMap />
  </main>
</BaseLayout>
```

## Configuración

### Marcadores por defecto

El componente incluye marcadores de ejemplo en España:
- **Arteixo, A Coruña**: Ubicación principal con información detallada
- **Madrid**: Capital de España
- **Barcelona**: Segunda ciudad más grande

### Datos GeoJSON incluidos

- **Región de Galicia**: Polígono representativo
- **Zona Industrial de Arteixo**: Punto de interés
- **Área Metropolitana de A Coruña**: Región urbana

### Estilos disponibles

1. **Oscuro** (por defecto): Tema minimalista con fondo negro
2. **Claro**: Tema con mayor brillo para uso diurno
3. **Monocromo**: Estilo en escala de grises

## Funcionalidades del Panel de Control

### Controles de Capas
- **Marcadores**: Mostrar/ocultar todos los marcadores
- **Datos GeoJSON**: Alternar visibilidad de capas geoespaciales

### Controles de Estilo
- Cambio dinámico entre temas visuales
- Ajustes de contraste y saturación

### Herramientas
- **Resetear Vista**: Volver a la vista inicial con todos los marcadores
- **Exportar Datos**: Descargar configuración actual en JSON

## Personalización

### Agregar nuevos marcadores

```typescript
// En mapUtils.ts
export const customLocations: MarkerData[] = [
  {
    id: 'mi-ubicacion',
    coordinates: [longitud, latitud],
    title: 'Mi Ubicación',
    description: 'Descripción personalizada',
    data: {
      categoria: 'personalizado',
      info: 'Información adicional'
    }
  }
];
```

### Modificar estilos

```typescript
// En mapUtils.ts
export const customMapStyle = {
  background: '#tu-color',
  rasterOpacity: 0.8,
  rasterContrast: -0.3,
  rasterSaturation: -0.8,
  brightnessMin: 0.1,
  brightnessMax: 0.4
};
```

### Agregar datos GeoJSON personalizados

```javascript
const miGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Mi Área",
        description: "Descripción del área"
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[lng1, lat1], [lng2, lat2], ...]]
      }
    }
  ]
};

// Agregar al mapa
addGeoJSONLayer(map, miGeoJSON, 'mi-capa');
```

## API y Métodos Disponibles

### Funciones principales

#### `createCustomMarker(markerData)`
Crea un marcador personalizado con popup informativo.

#### `addGeoJSONLayer(map, geojsonData, layerId)`
Agrega una capa GeoJSON al mapa con estilos predefinidos.

#### `flyToLocation(map, coordinates, zoom)`
Anima la vista del mapa hacia una ubicación específica.

#### `changeMapStyle(map, styleName)`
Cambia dinámicamente el estilo visual del mapa.

### Utilidades disponibles

#### `geocodeAddress(address)`
Convierte una dirección en coordenadas usando Nominatim.

#### `calculateDistance(coord1, coord2)`
Calcula la distancia entre dos puntos usando la fórmula de Haversine.

#### `formatCoordinates(lng, lat)`
Formatea coordenadas para visualización legible.

## Eventos del Mapa

El mapa responde a varios eventos:

```javascript
// Click en el mapa
map.on('click', (e) => {
  console.log('Coordenadas:', e.lngLat);
});

// Click en polígonos GeoJSON
map.on('click', 'capa-geojson', (e) => {
  // Mostrar popup con información
});

// Hover sobre elementos interactivos
map.on('mouseenter', 'capa-geojson', () => {
  // Cambiar cursor
});
```

## Accesibilidad

- Controles navegables por teclado
- Atributos ARIA apropiados
- Contraste de colores optimizado
- Soporte para lectores de pantalla

## Rendimiento

- Lazy loading de tiles del mapa
- Optimización de GeoJSON para datasets grandes
- Debouncing en eventos de interacción
- Cleanup automático de recursos

## Troubleshooting

### Error: "Cannot read property 'addTo' of undefined"
- Verificar que MapLibre GL JS esté correctamente importado
- Asegurar que el contenedor del mapa existe en el DOM

### Marcadores no aparecen
- Verificar coordenadas (longitud, latitud)
- Comprobar que las coordenadas estén en el rango válido
- Verificar que el marcador se agregue después de que el mapa esté cargado

### Estilos no se aplican
- Importar los CSS de MapLibre GL JS
- Verificar que los selectores CSS tengan la especificidad correcta
- Comprobar orden de importación de estilos

## Contribución

Para contribuir al componente:

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## Licencia

Este componente utiliza MapLibre GL JS (licencia BSD) y está disponible bajo la misma licencia.

## Enlaces Útiles

- [MapLibre GL JS Documentation](https://maplibre.org/maplibre-gl-js-docs/)
- [GeoJSON Specification](https://geojson.org/)
- [Astro Framework](https://astro.build/)
- [OpenStreetMap](https://www.openstreetmap.org/)
