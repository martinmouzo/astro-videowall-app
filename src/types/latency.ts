// Tipos para la funcionalidad de latency pins
export interface LatencyNode {
  id: string;
  name: string;
  country: string;
  coordinates: [number, number]; // [lng, lat]
  screenPosition: { x: number; y: number }; // Posición en porcentaje para el diseño de pantalla
  latency: number; // en ms
  status: 'online' | 'warning' | 'offline';
  lastUpdate: Date;
  city?: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  latency: number;
  status: 'active' | 'slow' | 'timeout';
  quality: number; // 0-100
  packetLoss: number; // 0-100
}

export interface LatencyConfig {
  centralNode: LatencyNode;
  remoteNodes: LatencyNode[];
  connections: Connection[];
  updateInterval: number; // en segundos
  thresholds: {
    good: number;    // < 50ms
    warning: number; // < 200ms
    critical: number; // > 200ms
  };
}

export interface NetworkStats {
  totalNodes: number;
  activeNodes: number;
  averageLatency: number;
  uptime: number; // porcentaje
}