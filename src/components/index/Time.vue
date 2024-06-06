<template>
    <div class="timer-container">
        <div class="timer-display">{{ formattedTime }}</div>
        <button @click="start" :disabled="isRunning">Start</button>
        <button @click="stop" :disabled="!isRunning">Stop</button>
        <button @click="reset">Reset</button>
        <div class="score">Score: {{ score }}</div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const time = ref(0);
const isRunning = ref(false);
const score = ref(0);
const timerInterval = ref(null);

const start = () => {
    if (!isRunning.value) {
        isRunning.value = true;
        timerInterval.value = setInterval(() => {
            time.value++;
            score.value = Math.floor(time.value / 60); // Increase score every minute
        }, 1000);
    }
};

const stop = () => {
    clearInterval(timerInterval.value);
    isRunning.value = false;
};

const reset = () => {
    stop();
    time.value = 0;
    score.value = 0;
};

const formattedTime = computed(() => {
    const mins = Math.floor(time.value / 60);
    const secs = time.value % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
});
</script>

<style>
.timer-container {
    text-align: center;
    margin-top: 20px;
}
.timer-display {
    font-size: 24px;
    margin-bottom: 10px;
}
.score {
    margin-top: 10px;
    font-weight: bold;
}
</style>
