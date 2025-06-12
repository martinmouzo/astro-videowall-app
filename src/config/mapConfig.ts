// Configuración centralizada para el componente WorldMap
export const MAP_CONFIG = {
  // Configuración por defecto del mapa
  DEFAULT_CENTER: [-8.5, 43.37] as [number, number], // A Coruña
  DEFAULT_ZOOM: 2,

  // Límites del mapa
  MAX_ZOOM: 18,
  MIN_ZOOM: 1,

  // Configuración de animaciones
  ANIMATION_DURATION: 2000,

  // Colores del tema
  COLORS: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#45b7d1',
    background: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#cccccc',
    textMuted: '#999999'
  },

  // Configuración de países coloreados
  COUNTRY_COLORS: {
    'South Africa': '#90EE90',  // Verde claro
    'Spain': '#FFD700',         // Oro
    'France': '#87CEEB',        // Azul cielo
    'Brazil': '#FF6B6B',        // Rojo coral
    'Japan': '#DDA0DD',         // Violeta
    'Australia': '#98D8C8',     // Verde menta
    'Germany': '#FFA07A',       // Salmón claro
    'Canada': '#20B2AA',        // Verde azulado
    'India': '#FFB6C1',         // Rosa claro
    'China': '#F0E68C'          // Caqui
  },

  // Configuración de marcadores
  MARKER: {
    DEFAULT_SIZE: 20,
    HOVER_SCALE: 1.2,
    COLORS: [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
      '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'
    ]
  },

  // Configuración de capas GeoJSON
  GEOJSON: {
    FILL_OPACITY: 0.3,
    LINE_WIDTH: 2,
    LINE_OPACITY: 0.8,
    POINT_RADIUS: 6,
    STROKE_WIDTH: 2
  },

  // URLs de servicios
  SERVICES: {
    NOMINATIM: 'https://nominatim.openstreetmap.org/search',
    TILE_SERVER: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
  }
};

// Tipos de datos para mejor tipado
export interface MapMarkerData {
  id: string;
  coordinates: [number, number];
  title: string;
  description: string;
  category?: string;
  color?: string;
  data?: Record<string, any>;
}

export interface MapGeoJSONFeature {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon';
    coordinates: number[] | number[][] | number[][][];
  };
}

export interface MapGeoJSONCollection {
  type: 'FeatureCollection';
  features: MapGeoJSONFeature[];
}

// Validadores
export function validateCoordinates(lng: number, lat: number): boolean {
  return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
}

export function validateZoom(zoom: number): boolean {
  return zoom >= MAP_CONFIG.MIN_ZOOM && zoom <= MAP_CONFIG.MAX_ZOOM;
}

// Utilidades para el manejo de eventos
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Constantes para eventos del mapa
export const MAP_EVENTS = {
  CLICK: 'click',
  MOUSE_ENTER: 'mouseenter',
  MOUSE_LEAVE: 'mouseleave',
  ZOOM_END: 'zoomend',
  MOVE_END: 'moveend',
  LOAD: 'load'
} as const;

// Configuración de capas predefinidas
export const LAYER_STYLES = {
  polygon: {
    fill: {
      'fill-color': MAP_CONFIG.COLORS.primary,
      'fill-opacity': MAP_CONFIG.GEOJSON.FILL_OPACITY
    },
    line: {
      'line-color': MAP_CONFIG.COLORS.primary,
      'line-width': MAP_CONFIG.GEOJSON.LINE_WIDTH,
      'line-opacity': MAP_CONFIG.GEOJSON.LINE_OPACITY
    }
  },
  point: {
    circle: {
      'circle-color': MAP_CONFIG.COLORS.primary,
      'circle-radius': MAP_CONFIG.GEOJSON.POINT_RADIUS,
      'circle-stroke-color': MAP_CONFIG.COLORS.text,
      'circle-stroke-width': MAP_CONFIG.GEOJSON.STROKE_WIDTH
    }
  },
  line: {
    line: {
      'line-color': MAP_CONFIG.COLORS.primary,
      'line-width': MAP_CONFIG.GEOJSON.LINE_WIDTH,
      'line-opacity': MAP_CONFIG.GEOJSON.LINE_OPACITY
    }
  }
};
