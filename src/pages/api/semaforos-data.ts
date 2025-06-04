import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    // Extraer parámetros de la URL
    const url = new URL(request.url);
    const idPanel = url.searchParams.get('idPanel') || '3';

    // Validar idPanel - solo aceptamos valores numéricos
    if (!/^\d+$/.test(idPanel)) {
      return new Response(JSON.stringify({ error: 'Invalid idPanel parameter' }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    try {
      // Intentar hacer la petición al servidor interno
      const response = await fetch(`http://axinweb/appweb-videowallcpd/api/semaforos/status?idPanel=${idPanel}`, {
        headers: {
          "accept": "application/json, text/plain, */*",
          "accept-language": "es-ES,es;q=0.5",
          "sec-gpc": "1",
          "cookie": "JSESSIONID=0000zqI44pz6uppcZNaJke_z4Ef:1i0bmg9qh",
          "Referer": "http://axinweb/appweb-videowallcpd/panel03.html",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "X-Data-Source": "live-api", // Para depuración
        },
      });
    } catch (error) {
      console.error('Error fetching semaforos data:', error);

      // Cargar datos de mockup desde el archivo
      try {
        const fileUrl = new URL('../../mocks/data/semaforos-mock.json', import.meta.url);
        const filePath = fileURLToPath(fileUrl);
        const mockData = readFileSync(filePath, 'utf8');

        console.log('Usando datos de mock para semáforos');

        return new Response(mockData, {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "X-Data-Source": "mock-file", // Para depuración
          },
        });
      } catch (mockError) {
        console.error('Error cargando mock data:', mockError);

        // Datos de fallback en caso de que fallen tanto la API como el mock
        const fallbackData = [{
          "idGrupo": 1,
          "items": [
            {
              "id": 29,
              "title": "BBDD Oracle (Fallback)",
              "priority": 10,
              "isDeviceSubscribed": null,
              "isStatic": true,
              "isActive": false,
              "sound": true,
              "severity": 0,
              "status": 0,
              "items": [],
              "timestamp": "2025-06-03 06:08:43",
              "secondsFirstAlert": 0,
              "demoMode": false
            },
            {
              "id": 32,
              "title": "Comunicaciones MPLS (Fallback)",
              "priority": 30,
              "isDeviceSubscribed": null,
              "isStatic": true,
              "isActive": true,
              "sound": true,
              "severity": 2,
              "status": 0,
              "items": [
                {
                  "severity": 2,
                  "description": "router_main",
                  "status": 0,
                  "pais": "ESP",
                  "ciudad": "Madrid",
                  "cpd": "CPD1"
                }
              ],
              "timestamp": "2025-06-03 10:23:41",
              "secondsFirstAlert": 14582,
              "demoMode": false
            }
          ],
          "limiteDinamicosActivos": 4,
          "limiteDinamicosNoActivos": 12
        }];

        return new Response(JSON.stringify(fallbackData), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "X-Data-Source": "component-fallback", // Para depuración
          },
        });
      }
    }
  } catch (outerError) {
    console.error('Fatal error in semaforos-data API:', outerError);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
