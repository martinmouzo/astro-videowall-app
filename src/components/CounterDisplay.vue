<template>
    <span class="counter-display">{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps({
    value: { type: Number, required: true },
    duration: { type: Number, default: 500 } // Animation duration in ms
});

const displayValue = ref(props.value);
const previousValue = ref(props.value);

watch(() => props.value, (newValue) => {
    animateValue(previousValue.value, newValue);
    previousValue.value = newValue;
});

function animateValue(start: number, end: number) {
    let startTime: number | null = null;

    const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / props.duration, 1);
        displayValue.value = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            displayValue.value = end; // Ensure final value is exact
        }
    };

    requestAnimationFrame(step);
}

// Initial setup without animation
displayValue.value = props.value;
previousValue.value = props.value;

</script>

<style scoped>
.counter-display {
    /* Add styling similar to your .number elements */
    font-weight: bold;
    /* Example styling */
    font-size: 2em;
    color: #eee;
}
</style>