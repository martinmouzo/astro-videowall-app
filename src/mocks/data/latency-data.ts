import type { LatencyConfig, LatencyNode, Connection, NetworkStats } from '../../types/latency';

// Nodo central en Arteixo, A Coruña - basado en panel04.html
const centralNode: LatencyNode = {
  id: 'arteixo-central',
  name: 'Arteixo DC',
  country: 'Spain',
  city: 'Arteixo',
  coordinates: [-8.5096, 43.3039],
  screenPosition: { x: 40.5, y: 15.5 }, // Posición exacta del panel04.html
  latency: 0,
  status: 'online',
  lastUpdate: new Date()
};

// Nodos remotos basados en el diseño del panel04.html
const remoteNodes: LatencyNode[] = [
  {
    id: 'usa-node',
    name: 'USA DC',
    country: 'United States',
    city: 'New York',
    coordinates: [-74.0060, 40.7128], // Nueva York - coordenadas corregidas
    screenPosition: { x: 25, y: 14 }, // Posición del panel04.html
    latency: 95,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'brasil-node',
    name: 'Brasil DC',
    country: 'Brazil',
    city: 'São Paulo',
    coordinates: [-46.6333, -23.5505], // São Paulo - coordenadas verificadas
    screenPosition: { x: 30, y: 37 }, // Posición del panel04.html
    latency: 185,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'sudafrica-node',
    name: 'Sudáfrica DC',
    country: 'South Africa',
    city: 'Cape Town',
    coordinates: [18.4241, -33.9249], // Ciudad del Cabo - coordenadas verificadas
    screenPosition: { x: 53, y: 51 }, // Posición del panel04.html
    latency: 312,
    status: 'warning',
    lastUpdate: new Date()
  },
  {
    id: 'china-node',
    name: 'China DC',
    country: 'China',
    city: 'Beijing',
    coordinates: [116.4074, 39.9042], // Beijing - coordenadas verificadas
    screenPosition: { x: 63, y: 17 }, // Posición del panel04.html
    latency: 145,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'japon-node',
    name: 'Japón DC',
    country: 'Japan',
    city: 'Tokyo',
    coordinates: [139.6917, 35.6895], // Tokyo - coordenadas verificadas
    screenPosition: { x: 55, y: 9 }, // Posición del panel04.html
    latency: 198,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'australia-node',
    name: 'Australia DC',
    country: 'Australia',
    city: 'Sydney',
    coordinates: [151.2093, -33.8688], // Sydney - coordenadas verificadas
    screenPosition: { x: 66, y: 34 }, // Posición del panel04.html
    latency: 287,
    status: 'online',
    lastUpdate: new Date()
  }
];

// Generar conexiones desde el nodo central a todos los nodos remotos
const connections: Connection[] = remoteNodes.map(node => ({
  id: `${centralNode.id}-${node.id}`,
  from: centralNode.id,
  to: node.id,
  latency: node.latency,
  status: node.latency < 50 ? 'active' : node.latency < 100 ? 'slow' : 'timeout',
  quality: Math.max(0, 100 - node.latency),
  packetLoss: Math.random() * 2 // 0-2% packet loss
}));

export const latencyConfig: LatencyConfig = {
  centralNode,
  remoteNodes,
  connections,
  updateInterval: 5, // actualizar cada 5 segundos
  thresholds: {
    good: 50,
    warning: 100,
    critical: 200
  }
};

// Función para calcular estadísticas de red
export function calculateNetworkStats(config: LatencyConfig): NetworkStats {
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

// Función para simular cambios en latency (para demo en tiempo real)
export function generateRandomLatency(): LatencyConfig {
  const updatedNodes = remoteNodes.map(node => {
    const baseLatency = node.latency;
    const variation = (Math.random() - 0.5) * 40; // variación de ±20ms
    const newLatency = Math.max(5, Math.round(baseLatency + variation));

    return {
      ...node,
      latency: newLatency,
      status: (Math.random() > 0.95 ? 'warning' :
               Math.random() > 0.98 ? 'offline' : 'online') as any,
      lastUpdate: new Date()
    };
  });

  const updatedConnections = updatedNodes.map(node => ({
    id: `${centralNode.id}-${node.id}`,
    from: centralNode.id,
    to: node.id,
    latency: node.latency,
    status: node.status === 'offline' ? 'timeout' :
            node.latency < 50 ? 'active' : 'slow' as any,
    quality: Math.max(0, 100 - node.latency),
    packetLoss: Math.random() * (node.status === 'warning' ? 5 : 2)
  }));

  return {
    ...latencyConfig,
    remoteNodes: updatedNodes,
    connections: updatedConnections
  };
}

// Función para generar datos de rendimiento histórico
export function generateHistoricalData(hours: number = 24) {
  const data = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const config = generateRandomLatency();
    const stats = calculateNetworkStats(config);

    data.push({
      timestamp,
      ...stats,
      nodes: config.remoteNodes.map(node => ({
        id: node.id,
        name: node.name,
        latency: node.latency,
        status: node.status
      }))
    });
  }

  return data;
}
