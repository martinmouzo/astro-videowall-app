// Utilidades para manejo de datos GeoJSON y funciones del mapa
import type { GeoJSONFeature, GeoJSONFeatureCollection } from 'maplibre-gl';

export interface MarkerData {
  id: string;
  coordinates: [number, number];
  title: string;
  description: string;
  data?: Record<string, any>;
}

export interface MapStyles {
  background: string;
  rasterOpacity: number;
  rasterContrast: number;
  rasterSaturation: number;
  brightnessMin: number;
  brightnessMax: number;
}

// Estilos predefinidos del mapa
export const mapStyles = {
  dark: {
    background: '#1a1a1a',
    rasterOpacity: 0.8,
    rasterContrast: -0.3,
    rasterSaturation: -0.8,
    brightnessMin: 0.1,
    brightnessMax: 0.4
  },
  light: {
    background: '#f8f9fa',
    rasterOpacity: 1.0,
    rasterContrast: 0,
    rasterSaturation: 0,
    brightnessMin: 0.8,
    brightnessMax: 1.2
  },
  monochrome: {
    background: '#2d3748',
    rasterOpacity: 0.7,
    rasterContrast: -0.5,
    rasterSaturation: -1.0,
    brightnessMin: 0.2,
    brightnessMax: 0.6
  }
};

// Datos de ubicaciones de ejemplo en España
export const sampleLocations: MarkerData[] = [
  {
    id: 'arteixo',
    coordinates: [-8.5086, 43.3036],
    title: 'Arteixo',
    description: 'A Coruña, España',
    data: {
      population: '~32,000',
      region: 'Galicia',
      province: 'A Coruña'
    }
  },
  {
    id: 'madrid',
    coordinates: [-3.7038, 40.4168],
    title: 'Madrid',
    description: 'Capital de España',
    data: {
      population: '~3,300,000',
      region: 'Comunidad de Madrid',
      province: 'Madrid'
    }
  },
  {
    id: 'barcelona',
    coordinates: [2.1734, 41.3851],
    title: 'Barcelona',
    description: 'Cataluña, España',
    data: {
      population: '~1,600,000',
      region: 'Cataluña',
      province: 'Barcelona'
    }
  }
];

// Función para validar coordenadas
export function isValidCoordinate(lng: number, lat: number): boolean {
  return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
}

// Función para crear GeoJSON a partir de coordenadas
export function createGeoJSONPoint(
  lng: number,
  lat: number,
  properties: Record<string, any> = {}
): GeoJSONFeature {
  if (!isValidCoordinate(lng, lat)) {
    throw new Error('Coordenadas inválidas');
  }

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lng, lat]
    },
    properties
  };
}

// Función para crear una colección GeoJSON
export function createGeoJSONCollection(features: GeoJSONFeature[]): GeoJSONFeatureCollection {
  return {
    type: 'FeatureCollection',
    features
  };
}

// Función para convertir dirección a coordenadas (usando Nominatim)
export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
    );

    if (!response.ok) {
      throw new Error('Error en la geocodificación');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      return [lng, lat];
    }

    return null;
  } catch (error) {
    console.error('Error en geocodificación:', error);
    return null;
  }
}

// Función para calcular distancia entre dos puntos (fórmula de Haversine)
export function calculateDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;

  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Función para generar colores aleatorios para marcadores
export function generateMarkerColor(): string {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
    '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Función para formatear coordenadas para mostrar
export function formatCoordinates(lng: number, lat: number): string {
  const lngDir = lng >= 0 ? 'E' : 'W';
  const latDir = lat >= 0 ? 'N' : 'S';

  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

// Configuración de niveles de zoom para diferentes escalas
export const zoomLevels = {
  world: 2,
  continent: 4,
  country: 6,
  region: 8,
  city: 12,
  street: 16
};

// Límites geográficos de España para centrar el mapa
export const spainBounds = {
  southwest: [-18.16, 27.64], // Incluye Canarias
  northeast: [4.33, 43.79]    // Incluye todo el territorio peninsular
} as const;
