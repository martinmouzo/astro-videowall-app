// Script para agregar valores de prueba realistas a los indicadores
// Este archivo puede ser usado para poblar datos de prueba

export const MOCK_DATA_CONFIG = {
  // Configuración de valores por región y tipo
  regions: {
    AMERICA: {
      tiendas_abiertas: 779,
      tiendas_cerradas: 12,
      incidencias_caja: 234,
      incidencias_pda: 156,
      incidencias_tgt: 89,
      incidencias_comm: 67,
      incidencias_mkd: 45,
      tiendas_offline: 5,
      reformas: 18,
      contenidos_pendientes: 0,
      tickets_acumulados: 1245,
      tickets_online: 45,
      pedidos_zara: 1890,
      pedidos_ecommerce: 2345
    },
    EUROPA: {
      tiendas_abiertas: 4323,
      tiendas_cerradas: 45,
      incidencias_caja: 578,
      incidencias_pda: 1408,
      incidencias_tgt: 234,
      incidencias_comm: 189,
      incidencias_mkd: 156,
      tiendas_offline: 4,
      reformas: 43,
      contenidos_pendientes: 0,
      tickets_acumulados: 3567,
      tickets_online: 78,
      pedidos_zara: 5432,
      pedidos_ecommerce: 6789
    },
    ASIA: {
      tiendas_abiertas: 483,
      tiendas_cerradas: 8,
      incidencias_caja: 156,
      incidencias_pda: 298,
      incidencias_tgt: 67,
      incidencias_comm: 45,
      incidencias_mkd: 34,
      tiendas_offline: 1,
      reformas: 12,
      contenidos_pendientes: 0,
      tickets_acumulados: 892,
      tickets_online: 23,
      pedidos_zara: 2341,
      pedidos_ecommerce: 3456
    }
  },

  // Configuración de umbrales para alertas
  thresholds: {
    tiendas_offline: {
      warning: 3,
      critical: 8
    },
    incidencias_total: {
      warning: 300,
      critical: 600
    }
  },

  // Configuración de colores por estado
  statusColors: {
    normal: '#44ff44',
    warning: '#ffaa00',
    critical: '#ff4444',
    offline: '#ff0000'
  }
};

// Función para generar datos mock actualizados
export function generateUpdatedMockData() {
  return {
    timestamp: new Date().toISOString(),
    data: MOCK_DATA_CONFIG.regions
  };
}

// Función para simular variaciones en tiempo real
export function simulateRealTimeVariations(baseData: any) {
  const variation = () => Math.floor(Math.random() * 5) - 2; // -2 a +2

  Object.keys(baseData).forEach(region => {
    Object.keys(baseData[region]).forEach(metric => {
      const currentValue = baseData[region][metric];
      const newValue = Math.max(0, currentValue + variation());
      baseData[region][metric] = newValue;
    });
  });

  return baseData;
}
