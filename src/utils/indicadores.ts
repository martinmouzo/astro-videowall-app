// Tipos para los indicadores
export interface Parametro {
  idParametro: number;
  descripcion: string;
  valor: string;
  idIndicadorParametro: number;
  fechaAlta: number;
}

export interface TipoIndicador {
  idTipoIndicador: number;
  descripcion: string;
  frecuenciaActualizacion: number;
  prioridad: any;
  estatico: any;
  sonido: any;
  notificacion: boolean | null;
  modoDemo: any;
  formatedDescripcion: string;
}

export interface Indicador {
  idIndicador: number;
  tipoIndicador: TipoIndicador;
  nombre: string;
  descripcion: string;
  severidad: any;
  parametros: Parametro[];
}

export interface TipoIndicadorData {
  idTipoIndicador: number;
  descripcion: string;
  frecuenciaActualizacion: number;
  indicadores: Indicador[];
  tipoIndicadorUmbrals: any[];
}

export interface IndicadorProcesado {
  nombre: string;
  descripcion: string;
  valor: number;
  tipo: number;
  label: string;
  color: string;
}

// Mapeo de regiones
export const REGION_MAPPING: Record<string, string> = {
  'america': 'AMERICA',
  'europe': 'EUROPA',
  'asia': 'ASIA'
};

// Valores mock realistas por tipo y región
export const MOCK_VALUES: Record<number, Record<string, number>> = {
  3: { 'AMERICA': 779, 'EUROPA': 4323, 'ASIA': 483 }, // Tiendas abiertas
  13: { 'AMERICA': 12, 'EUROPA': 45, 'ASIA': 8 }, // Tiendas con cierre
  6: { 'AMERICA': 234, 'EUROPA': 578, 'ASIA': 156 }, // Incidencias
  4: { 'AMERICA': 5, 'EUROPA': 4, 'ASIA': 1 }, // Tiendas offline
  12: { 'AMERICA': 18, 'EUROPA': 43, 'ASIA': 12 }, // Reformas
  5: { 'AMERICA': 0, 'EUROPA': 0, 'ASIA': 0 }, // Contenidos pendientes
  1: { 'AMERICA': 1245, 'EUROPA': 3567, 'ASIA': 892 }, // Tickets acumulados
  2: { 'AMERICA': 45, 'EUROPA': 78, 'ASIA': 23 }, // Tickets online
  49: { 'AMERICA': 1890, 'EUROPA': 5432, 'ASIA': 2341 }, // Pedidos Zara
  50: { 'AMERICA': 2345, 'EUROPA': 6789, 'ASIA': 3456 } // Pedidos eCommerce
};

// Colores por tipo de indicador
export const INDICATOR_COLORS: Record<number, string> = {
  3: '#00ff00',  // Tiendas abiertas - Verde
  13: '#0080ff', // Tiendas con cierre - Azul
  6: '#ff8000',  // Incidencias - Naranja
  4: '#ff0000',  // Tiendas offline - Rojo
  12: '#ffff00', // Reformas - Amarillo
  5: '#ff00ff',  // Contenidos pendientes - Magenta
  1: '#00ffff',  // Tickets acumulados - Cian
  2: '#80ff80',  // Tickets online - Verde claro
  49: '#8080ff', // Pedidos Zara - Azul claro
  50: '#ff8080'  // Pedidos eCommerce - Rosa
};

// Función para obtener valor de indicador
export function getIndicatorValue(indicador: Indicador, tipoId: number, region: string): number {
  if (indicador.parametros && indicador.parametros.length > 0) {
    const numeroElementos = indicador.parametros.find(p =>
      p.descripcion === "NUMERO_ELEMENTOS"
    );
    if (numeroElementos && numeroElementos.valor) {
      const valor = parseInt(numeroElementos.valor);
      if (!isNaN(valor)) return valor;
    }
  }

  // Retornar valor mock si no hay datos
  return MOCK_VALUES[tipoId]?.[region] || Math.floor(Math.random() * 100);
}

// Función para formatear nombre de indicador
export function formatIndicatorName(nombre: string, region: string): string {
  return nombre
    .replace(`_${region}`, '')
    .replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Función para obtener color de indicador
export function getIndicatorColor(tipo: number): string {
  return INDICATOR_COLORS[tipo] || '#ffffff';
}

// Función principal para procesar indicadores por región
export function getIndicadoresPorRegion(
  indicadores: TipoIndicadorData[],
  region: string
): IndicadorProcesado[] {
  const resultado: IndicadorProcesado[] = [];
  const regionKey = REGION_MAPPING[region] || region.toUpperCase();

  indicadores.forEach(tipoIndicador => {
    if (!tipoIndicador.indicadores) return;

    tipoIndicador.indicadores.forEach(indicador => {
      if (!indicador.nombre) return;

      const nombreRegion = indicador.nombre.toLowerCase();
      const regionBuscada = regionKey.toLowerCase();

      if (nombreRegion.includes(regionBuscada)) {
        const valor = getIndicatorValue(indicador, tipoIndicador.idTipoIndicador, regionKey);

        resultado.push({
          nombre: indicador.nombre,
          descripcion: tipoIndicador.descripcion,
          valor,
          tipo: tipoIndicador.idTipoIndicador,
          label: formatIndicatorName(indicador.nombre, regionKey),
          color: getIndicatorColor(tipoIndicador.idTipoIndicador)
        });
      }
    });
  });

  return resultado.sort((a, b) => b.valor - a.valor);
}
