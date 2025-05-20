import type { APIRoute } from 'astro';
import { Buffer } from 'buffer';

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const graph = searchParams.get('Graph') || 'g1415105270.14471';
    const start = searchParams.get('Start') || 'end-30m';
    const end = searchParams.get('End') || 'now';
    const width = searchParams.get('Width') || '800';
    const height = searchParams.get('Height') || '600';

    const username = import.meta.env.GRAFANA_USERNAME;
    const password = import.meta.env.GRAFANA_PASSWORD;

    if (!username || !password) {
        console.error("Credenciales de Grafana no configuradas en las variables de entorno.");
        return new Response("Error de configuración del servidor", { status: 500 });
    }

    const timestamp = new Date().getTime();
    const targetUrl = `https://axinstats.central.inditex.grp/drraw/?Mode=show;Graph=g1415105270.14471;Start=end-30m;End=now;Width=1450;Height=300`;

    const basicAuthToken = Buffer.from(`${username}:${password}`).toString('base64');

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Authorization': `Basic ${basicAuthToken}`
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error desde Grafana (${response.status}): ${errorText}`);
            return new Response(`Error al contactar el servicio de Grafana: ${response.status}`, { status: response.status });
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const body = await response.arrayBuffer();

        return new Response(body, {
            status: 200,
            headers: {
                'Content-Type': contentType,
            }
        });

    } catch (error) {
        console.error("Error al hacer proxy a Grafana:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Detalle del error:", errorMessage);
        return new Response(`Error interno del servidor al hacer proxy: ${errorMessage}`, { status: 500 });
    }
};