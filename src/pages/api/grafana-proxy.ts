import type { APIRoute } from 'astro';
import { Buffer } from 'buffer';

// Function to create a placeholder SVG image
function createPlaceholderImage(width: string, height: string, message: string, errorType: 'service' | 'network' = 'service'): string {
    const w = parseInt(width) || 800;
    const h = parseInt(height) || 200;

    const backgroundColor = errorType === 'service' ? '#2a2a2a' : '#3a2a2a';
    const iconColor = errorType === 'service' ? '#ffaa00' : '#ff6b6b';
    const textColor = '#cccccc';

    const icon = errorType === 'service'
        ? `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="${iconColor}"/>`
        : `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="${iconColor}"/>`;

    return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${backgroundColor}" stroke="#555" stroke-width="2" stroke-dasharray="5,5"/>
        <g transform="translate(${w/2 - 12}, ${h/2 - 30})">
            <svg width="24" height="24" viewBox="0 0 24 24">
                ${icon}
            </svg>
        </g>
        <text x="${w/2}" y="${h/2 + 10}" text-anchor="middle" fill="${textColor}" font-family="Arial, sans-serif" font-size="14" font-weight="500">
            ${message}
        </text>
        <text x="${w/2}" y="${h/2 + 30}" text-anchor="middle" fill="#888" font-family="Arial, sans-serif" font-size="12">
            ${errorType === 'service' ? 'Reintentando automáticamente...' : 'Verificando conexión...'}
        </text>
    </svg>`;
}

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const graph = searchParams.get('Graph');
    const graphId = graph || 'g1415105270.14471';
    const start = searchParams.get('Start') || 'end-30m';
    const end = searchParams.get('End') || 'now';
    const width = searchParams.get('Width') || '800';
    const height = searchParams.get('Height') || '600';

    const username = import.meta.env.GRAFANA_USERNAME;
    const password = import.meta.env.GRAFANA_PASSWORD;

    if (!username || !password) {
        console.error("Credenciales de Grafana no configuradas en las variables de entorno.");

        // Return a placeholder for configuration errors
        const placeholderSvg = createPlaceholderImage(
            width,
            height,
            'Error de configuración',
            'service'
        );

        return new Response(placeholderSvg, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Grafana-Error': 'config-error',
                'X-Error-Message': 'Missing Grafana credentials'
            }
        });
    }

    const targetUrl = `https://axinstats.central.inditex.grp/drraw/?Mode=show;Graph=${graphId};Start=${start};End=${end};Width=${width};Height=${height}`;

    const basicAuthToken = Buffer.from(`${username}:${password}`).toString('base64');

    try {
        // Add timeout to the request (30 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(targetUrl, {
            headers: {
                'Authorization': `Basic ${basicAuthToken}`
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error desde Grafana (${response.status}): ${errorText}`);

            // Return a placeholder image for service errors (500, 401, etc.)
            const placeholderSvg = createPlaceholderImage(
                width,
                height,
                `Servicio temporalmente no disponible (${response.status})`,
                'service'
            );

            return new Response(placeholderSvg, {
                status: 200, // Return 200 so the image loads
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'X-Grafana-Error': 'service-error', // Custom header to indicate this is an error placeholder
                    'X-Original-Status': response.status.toString()
                }
            });
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const body = await response.arrayBuffer();

        return new Response(body, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

    } catch (error) {
        console.error("Error al hacer proxy a Grafana:", error);

        // Determine error type for better messaging
        let errorMessage = 'Conexión no disponible';
        let errorType: 'service' | 'network' = 'network';

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = 'Timeout de conexión';
                errorType = 'network';
            } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
                errorMessage = 'Servidor no alcanzable';
                errorType = 'network';
            }
        }

        // Return a placeholder image for network/connection errors
        const placeholderSvg = createPlaceholderImage(
            width,
            height,
            errorMessage,
            errorType
        );

        return new Response(placeholderSvg, {
            status: 200, // Return 200 so the image loads
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Grafana-Error': 'network-error', // Custom header to indicate this is an error placeholder
                'X-Error-Message': error instanceof Error ? error.message : String(error)
            }
        });
    }
};