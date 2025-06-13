import type { LatencyNode, LatencyConfig, Connection, NetworkStats } from '../../types/latency';

// Ubicaciones reales de Inditex en España
// Coordenadas exactas basadas en las direcciones oficiales proporcionadas

// Sede Central - Arteixo (A Coruña)
// Dirección: Avda. de la Diputación S/N, 15142, A Coruña, España
const centralNode: LatencyNode = {
  id: 'arteixo-central',
  name: 'Arteixo',
  country: 'Spain',
  city: 'Arteixo',
  coordinates: [-8.5096, 43.3039], // Sede central de Inditex
  screenPosition: { x: 15, y: 20 },
  latency: 0,
  status: 'online',
  lastUpdate: new Date()
};

// Sedes oficiales de Inditex en España
const spainNodes: LatencyNode[] = [
  {
    id: 'laracha-cpd2-node',
    name: 'CPD 2 A Laracha',
    country: 'Spain',
    city: 'A Laracha',
    coordinates: [-8.5874, 43.2505], // Parque Empresarial de Laracha, A Coruña
    screenPosition: { x: 14, y: 21 },
    latency: 3, // Muy cercano a Arteixo - sede central secundaria
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'naron-node',
    name: 'Narón',
    country: 'Spain',
    city: 'Narón',
    coordinates: [-8.1463, 43.5294], // Polígono Río do Pozo, A Coruña
    screenPosition: { x: 17, y: 18 },
    latency: 8,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'leon-node',
    name: 'León',
    country: 'Spain',
    city: 'Santovenia de la Valdoncina',
    coordinates: [-5.5665, 42.5987], // Polígono Industrial León II Fase
    screenPosition: { x: 35, y: 25 },
    latency: 12,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'sallent-node',
    name: 'Sallent',
    country: 'Spain',
    city: 'Cabrianes-Sallent',
    coordinates: [1.9048, 41.8177], // Pol. Ind. Berenguer II, Barcelona
    screenPosition: { x: 68, y: 30 },
    latency: 15,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'tordera-node',
    name: 'Tordera',
    country: 'Spain',
    city: 'Tordera',
    coordinates: [2.7154, 41.7008], // Polígono Inditex, Barcelona
    screenPosition: { x: 72, y: 30 },
    latency: 18,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'zaragoza-node',
    name: 'Zaragoza',
    country: 'Spain',
    city: 'Zaragoza',
    coordinates: [-0.8773, 41.6518], // Plataforma logística de Zaragoza
    screenPosition: { x: 50, y: 28 },
    latency: 20,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'meco-node',
    name: 'Meco',
    country: 'Spain',
    city: 'Meco',
    coordinates: [-3.3247, 40.5464], // Polígono Industrial Meco, Madrid
    screenPosition: { x: 45, y: 38 },
    latency: 22,
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'cabanillas-node',
    name: 'Cabanillas',
    country: 'Spain',
    city: 'Cabanillas del Campo',
    coordinates: [-3.2369, 40.6378], // Plataforma Cabanillas S.A., Guadalajara
    screenPosition: { x: 47, y: 37 },
    latency: 28, // Warning range
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'marchamalo-node',
    name: 'Marchámalo',
    country: 'Spain',
    city: 'Marchámalo',
    coordinates: [-3.1752, 40.6246], // Plataforma XPO, Guadalajara
    screenPosition: { x: 48, y: 37 },
    latency: 32, // Warning range
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'toledo-node',
    name: 'Toledo',
    country: 'Spain',
    city: 'Toledo',
    coordinates: [-4.0273, 39.8628], // Polígono Santa María de Benquerencia
    screenPosition: { x: 42, y: 42 },
    latency: 38, // Critical range
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'illescas-node',
    name: 'Illescas',
    country: 'Spain',
    city: 'Illescas',
    coordinates: [-3.8494, 40.1217], // Polígono Pradillos II, Toledo
    screenPosition: { x: 43, y: 40 },
    latency: 42, // Critical range
    status: 'online',
    lastUpdate: new Date()
  },
  {
    id: 'elche-node',
    name: 'Elche',
    country: 'Spain',
    city: 'Elche',
    coordinates: [-0.7037, 38.2682], // Parque Industrial de Elche, Alicante
    screenPosition: { x: 52, y: 55 },
    latency: 29, // Warning range
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

// Función utilitaria para clasificar latencia de manera consistente
export function getLatencyClass(latency: number): 'excellent' | 'good' | 'warning' | 'critical' {
  if (latency === 0) return 'excellent'; // HUB/Central
  if (latency <= 10) return 'excellent';
  if (latency <= 20) return 'good';
  if (latency <= 35) return 'warning';
  return 'critical';
}

// Función para obtener el texto de latencia formateado
export function getLatencyText(latency: number): string {
  return latency === 0 ? 'Nodo Central' : `${latency}ms`;
}

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

// Información detallada de las ubicaciones reales de Inditex
export const locationDetails = {
  'arteixo-central': {
    fullName: 'Sede Central Inditex - Arteixo',
    address: 'Avda. de la Diputación S/N, 15142, A Coruña, España',
    type: 'Sede Central',
    importance: 'critical',
    description: 'Centro de operaciones principal de Inditex'
  },
  'naron-node': {
    fullName: 'Centro Logístico Narón',
    address: 'Polígono Río do Pozo - Parcela 2 - Sector 2, Av. Gonzalo Navarro, 37-43, 15578 - Narón, A Coruña',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Centro de distribución en Galicia'
  },
  'laracha-cpd2-node': {
    fullName: 'CPD 2 A Laracha - Sede Central Secundaria',
    address: 'Parque Empresarial de Laracha, manzanas E1-E2-E3-E4, 15145, A Laracha – A Coruña, España',
    type: 'Sede Central',
    importance: 'critical',
    description: 'Centro de procesamiento de datos secundario de Inditex'
  },
  'leon-node': {
    fullName: 'Centro Logístico León',
    address: 'Polígono Industrial León II Fase, Calle A Parcelas G2 y G3, SANTOVENIA DE LA VALDONCINA, 24391 León',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Hub logístico en Castilla y León'
  },
  'sallent-node': {
    fullName: 'Centro Logístico Sallent',
    address: 'Pol. Ind. Berenguer II, 08650 Cabrianes-Sallent, Barcelona',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Centro de distribución en Cataluña'
  },
  'tordera-node': {
    fullName: 'Polígono Inditex Tordera',
    address: 'Polígono Inditex, Ctra. local Tordera-Palafolls K.m. 0.6, 08490 - Tordera, Barcelona',
    type: 'Centro Industrial',
    importance: 'high',
    description: 'Centro industrial en Barcelona'
  },
  'zaragoza-node': {
    fullName: 'Plataforma Logística Zaragoza',
    address: 'Plataforma logística de Zaragoza, C/ Osca Nº 7, 50197 - Zaragoza',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Principal hub logístico en Aragón'
  },
  'meco-node': {
    fullName: 'Centro Logístico Meco',
    address: 'POLÍGONO INDUSTRIAL MECO, Sector R2, Parcela 10, 28880 - Meco - Madrid',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Centro de distribución en Madrid'
  },
  'cabanillas-node': {
    fullName: 'Plataforma Cabanillas',
    address: 'Plataforma Cabanillas S.A., Polígono Industrial SI20 parcela IG07, Avda. de la Veguilla 14, 19171 Cabanillas del Campo, Guadalajara',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Centro logístico en Guadalajara'
  },
  'marchamalo-node': {
    fullName: 'Plataforma XPO Marchámalo',
    address: 'Plataforma XPO, Avd. Arriaca, 6, salida 54 - radial r2, 19180 Marchámalo, Guadalajara, España',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Centro logístico XPO en Guadalajara'
  },
  'toledo-node': {
    fullName: 'Centro Logístico Toledo',
    address: 'Calle Rio Jarama 153 - Polígono Santa María de Benquerencia (Nave Montepino), Toledo',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Centro de distribución en Toledo'
  },
  'illescas-node': {
    fullName: 'Centro Logístico Illescas',
    address: 'Polígono Pradillos II, CP: 45200 - ILLESCAS - TOLEDO (ESPAÑA)',
    type: 'Centro Logístico',
    importance: 'high',
    description: 'Centro de distribución en Toledo'
  },
  'elche-node': {
    fullName: 'Parque Industrial Elche',
    address: 'Parque Industrial de Elche, C/. Severo Ochoa, 22-28, Carretera N-340, 03203 - Elche, Alicante',
    type: 'Centro Industrial',
    importance: 'high',
    description: 'Centro industrial especializado en calzado'
  }
};
