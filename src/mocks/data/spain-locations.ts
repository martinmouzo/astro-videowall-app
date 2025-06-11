import type { LatencyNode, LatencyConfig, Connection, NetworkStats } from '../../types/latency';

// Ubicaciones en España para el mapa nacional
// Coordenadas verificadas y centradas para cada ubicación

// Nodo central - Arteixo (A Coruña)
const centralNode: LatencyNode = {
  id: 'arteixo-central',
  name: 'Arteixo',
  country: 'Spain',
  city: 'Arteixo',
  coordinates: [-8.5096, 43.3039],
  screenPosition: { x: 15, y: 20 }, // Posición en Galicia
  latency: 0,
  status: 'online',
  lastUpdate: new Date()
};

// Nodos en España según las ubicaciones especificadas
const spainNodes: LatencyNode[] = [
  {
    id: 'laracha-node',
    name: 'Laracha',
    country: 'Spain',
    city: 'Laracha',
    coordinates: [-8.5874, 43.2505], // A Coruña
    screenPosition: { x: 14, y: 21 },
    latency: 5, // Muy cercano a Arteixo
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'naron-node',
    name: 'Narón',
    country: 'Spain',
    city: 'Narón',
    coordinates: [-8.1463, 43.5294], // A Coruña
    screenPosition: { x: 17, y: 18 },
    latency: 8, // Cercano en Galicia
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'leon-node',
    name: 'León',
    country: 'Spain',
    city: 'León',
    coordinates: [-5.5665, 42.5987], // Castilla y León
    screenPosition: { x: 35, y: 25 },
    latency: 12,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'sallent-node',
    name: 'Sallent',
    country: 'Spain',
    city: 'Sallent',
    coordinates: [1.9048, 41.8177], // Barcelona (Sallent de Llobregat)
    screenPosition: { x: 68, y: 30 },
    latency: 15,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'cerdanyola-node',
    name: 'Cerdanyola',
    country: 'Spain',
    city: 'Cerdanyola del Vallès',
    coordinates: [2.1407, 41.4909], // Barcelona
    screenPosition: { x: 69, y: 32 },
    latency: 18,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'tordera-node',
    name: 'Tordera',
    country: 'Spain',
    city: 'Tordera',
    coordinates: [2.7154, 41.7008], // Barcelona
    screenPosition: { x: 72, y: 30 },
    latency: 20,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'zaragoza-node',
    name: 'Zaragoza',
    country: 'Spain',
    city: 'Zaragoza',
    coordinates: [-0.8773, 41.6518], // Aragón - Plataforma Logística Plaza
    screenPosition: { x: 50, y: 28 },
    latency: 22,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'meco-node',
    name: 'Meco',
    country: 'Spain',
    city: 'Meco',
    coordinates: [-3.3247, 40.5464], // Madrid
    screenPosition: { x: 45, y: 38 },
    latency: 25,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'cabanillas-node',
    name: 'Cabanillas',
    country: 'Spain',
    city: 'Cabanillas del Campo',
    coordinates: [-3.2369, 40.6378], // Guadalajara
    screenPosition: { x: 47, y: 37 },
    latency: 28,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'marchamalo-node',
    name: 'Marchamalo',
    country: 'Spain',
    city: 'Marchamalo',
    coordinates: [-3.1752, 40.6246], // Guadalajara
    screenPosition: { x: 48, y: 37 },
    latency: 30,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'toledo-node',
    name: 'Toledo',
    country: 'Spain',
    city: 'Toledo',
    coordinates: [-4.0273, 39.8628], // Castilla-La Mancha
    screenPosition: { x: 42, y: 42 },
    latency: 32,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'illescas-node',
    name: 'Illescas',
    country: 'Spain',
    city: 'Illescas',
    coordinates: [-3.8494, 40.1217], // Toledo
    screenPosition: { x: 43, y: 40 },
    latency: 35,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'elche-tempe-node',
    name: 'Tempe Elche',
    country: 'Spain',
    city: 'Elche',
    coordinates: [-0.7037, 38.2682], // Alicante - Tempe Inditex Logistics
    screenPosition: { x: 52, y: 55 },
    latency: 38,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'elche-logistics-node',
    name: 'Elche Logistics',
    country: 'Spain',
    city: 'Elche',
    coordinates: [-0.6896, 38.2584], // Alicante - Avda. del Calzado
    screenPosition: { x: 53, y: 56 },
    latency: 40,
    status: 'online',
    lastUpdate: new Date()
  }
];

// Generar conexiones desde el nodo central (Arteixo) a todas las ubicaciones
const connections: Connection[] = spainNodes.map(node => ({
  id: `${centralNode.id}-${node.id}`,
  from: centralNode.id,
  to: node.id,
  latency: node.latency,
  status: node.latency < 20 ? 'active' : node.latency < 35 ? 'slow' : 'timeout',
  quality: Math.max(0, 100 - node.latency * 2),
  packetLoss: Math.random() * 1 // 0-1% packet loss para conexiones nacionales
}));

export const spainConfig: LatencyConfig = {
  centralNode,
  remoteNodes: spainNodes,
  connections,
  updateInterval: 5, // actualizar cada 5 segundos
  thresholds: {
    good: 20,     // < 20ms (Excelente para conexiones nacionales)
    warning: 35,  // < 35ms (Advertencia)
    critical: 50  // > 50ms (Crítico para conexiones nacionales)
  }
};

// Función para calcular estadísticas específicas de España
export function calculateSpainNetworkStats(config: LatencyConfig): NetworkStats {
  const activeNodes = config.remoteNodes.filter(node => node.status === 'online').length;
  const totalLatency = config.remoteNodes.reduce((sum, node) => sum + node.latency, 0);
  const averageLatency = totalLatency / config.remoteNodes.length;
  const uptime = (activeNodes / config.remoteNodes.length) * 100;

  return {
    totalNodes: config.remoteNodes.length + 1, // +1 para el nodo central
    activeNodes: activeNodes + 1, // +1 para el nodo central
    averageLatency: Math.round(averageLatency),
    uptime: Math.round(uptime * 100) / 100
  };
}

// Función para simular cambios en latencia específicos para España
export function generateSpainLatencyVariation(): LatencyConfig {
  const updatedNodes = spainNodes.map(node => {
    const baseLatency = node.latency;
    const variation = (Math.random() - 0.5) * 10; // variación de ±5ms (menor que mundial)
    const newLatency = Math.max(2, Math.round(baseLatency + variation));

    return {
      ...node,
      latency: newLatency,
      status: (Math.random() > 0.97 ? 'warning' :
               Math.random() > 0.99 ? 'offline' : 'online') as any,
      lastUpdate: new Date()
    };
  });

  const updatedConnections = updatedNodes.map(node => ({
    id: `${centralNode.id}-${node.id}`,
    from: centralNode.id,
    to: node.id,
    latency: node.latency,
    status: node.status === 'offline' ? 'timeout' :
            node.latency < 20 ? 'active' : 'slow' as any,
    quality: Math.max(0, 100 - node.latency * 2),
    packetLoss: Math.random() * (node.status === 'warning' ? 2 : 0.5)
  }));

  return {
    ...spainConfig,
    remoteNodes: updatedNodes,
    connections: updatedConnections
  };
}

// Datos geográficos adicionales de España
export const spainMapData = {
  center: [-3.7492, 40.2637] as [number, number], // Centro ajustado para mejor visualización de España
  bounds: {
    southwest: [-9.5, 35.9], // Incluye todas las ubicaciones
    northeast: [3.5, 44.0]
  },
  zoom: {
    initial: 6.2,
    min: 5,
    max: 12
  }
};

// Información detallada de las ubicaciones
export const locationDetails = {
  'arteixo-central': {
    fullName: 'Centro de Datos Principal - Arteixo',
    address: 'Arteixo, A Coruña, Galicia',
    type: 'Sede Central',
    importance: 'critical',
    description: 'Centro de operaciones principal de Inditex'
  },
  'zaragoza-node': {
    fullName: 'Plataforma Logística Plaza',
    address: 'C/Osca, 7, 50197 Zaragoza',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Principal hub logístico en Aragón'
  },
  'elche-tempe-node': {
    fullName: 'Tempe Inditex Logistics',
    address: 'C/Ramón y Cajal, 25, 03203, Elche, Alicante',
    type: 'Centro Logístico Tempe',
    importance: 'high',
    description: 'Centro logístico especializado en calzado'
  },
  'elche-logistics-node': {
    fullName: 'Centro Logístico Elche',
    address: 'Avda. del Calzado de Elche, 46, 03203, Elche, Alicante',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Centro de distribución del calzado'
  }
};
