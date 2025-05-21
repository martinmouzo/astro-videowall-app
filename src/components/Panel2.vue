<template>
    <div class="iframe-container" ref="iframeContainerElement">
        <iframe v-if="iframeUrl" :src="iframeUrl" width="auto" height="auto" frameborder="0" >
        </iframe>
        <div v-else class="loading">Cargando iframe...</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const iframeUrl = ref('');
const iframeContainerElement = ref<HTMLDivElement | null>(null);
let intervalId: number | undefined = undefined;

const updateIframeUrl = async () => {
    await nextTick();

    if (iframeContainerElement.value) {
        const actualWidth = iframeContainerElement.value.offsetWidth;
        const actualHeight = iframeContainerElement.value.offsetHeight;
        const timestamp = new Date().getTime();

        // Construye la URL para tu endpoint de proxy
        // Pasa los parámetros necesarios como query params
        const params = new URLSearchParams({
            Graph: 'g1415105270.14471', // Puedes hacerlo dinámico si es necesario
            Start: 'end-30m',
            End: 'now',
            Width: actualWidth.toString(),
            Height: actualHeight.toString(),
            _: timestamp.toString()
        });

        iframeUrl.value = `/api/grafana-proxy?${params.toString()}`;

    } else {
        console.error("El contenedor del iframe no se encontró en el DOM.");
    }
};

onMounted(async () => {
    await updateIframeUrl(); // Carga inicial
    intervalId = window.setInterval(updateIframeUrl, 60000);
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});

</script>

<style scoped>
/* ...existing code... */
.iframe-container {
    width: 100%;
    height: 500px;
    background-color: #1E1E1E;
    position: relative;
    overflow: hidden;
    /* Evita que el contenido se desborde */
}

.loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ccc;
}

/* Esto afectará al iframe para que llene completamente su contenedor */
iframe {
    display: block;
    /* Elimina espacios en blanco innecesarios */
    width: 100% !important;
    height: 100% !important;
    /* object-fit: contain; */
    /* object-fit en el iframe es poco probable que funcione como se espera para contenido genérico. La escala debe ser manejada por el contenido del iframe o los parámetros de la URL. */
    background-color: transparent;
}
</style>