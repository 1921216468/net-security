<!-- Card.vue -->
<template>
    <div class="card" :style="{ background: gradient, boxShadow: boxShadow }">
        <div class="icon">{{ icon }}</div>
        <div class="content">
            <div class="title">{{ title }}</div>
            <div class="value">{{ value }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        icon: String,
        title: String,
        value: Number,
        color: String,
    },
    computed: {
        gradient() {
            return `linear-gradient(45deg, ${this.color} 30%, #ffffff 70%)`;
        },
        boxShadow() {
            return `0px 4px 8px rgba(0, 0, 0, 0.1)`;
        },
    },
};
</script>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    border-radius: 12px;
    color: white;
    transition: transform 0.2s;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-4px);
}

.icon {
    font-size: 24px;
}

.content {
    margin-top: 10px;
    text-align: center;
}

.title {
    font-size: 18px;
}

.value {
    font-size: 24px;
    font-weight: bold;
}
</style>
