<template>
    <div class="stats-container">
        <div class="stat-item"
             v-for="(item, index) in stats"
             :key="item.title"
             :style="{ background: item.gradient }"
             @click="selectItem(index)">
            <div class="title">{{ item.title }}</div>
            <div class="value">{{ item.value }}</div>
        </div>
    </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import ErrorQuestionRecords from "../ability/ErrorQuestionRecords.vue";
import ExamRecords from "../ability/ExamRecords.vue";
import PointRecords from "../ability/PointRecords.vue";

export default {
    name: 'StatsComponent',
    components: {
        ErrorQuestionRecords,
        ExamRecords,
        PointRecords
    },
    setup() {

        const selectedComponent = ref('ExamRecords');

        const stats = reactive([
            { title: '累计错题', value: '268', gradient: 'linear-gradient(to right, #16baaa, #66b1ff)' },
            { title: '累计积分', value: '10,268', gradient: 'linear-gradient(to right, #16baaa, #66b1ff)' },
            { title: '累计积分', value: '10,268', gradient: 'linear-gradient(to right, #16baaa, #66b1ff)' },
            { title: '累计积分', value: '10,268', gradient: 'linear-gradient(to right, #16baaa, #66b1ff)' },
        ]);

        const examData = reactive([
            { id: 1, name: '数学期中考试', date: '2024-02-10', answered: 50, wrong: 5 },
            { id: 2, name: '物理期末考试', date: '2024-06-15', answered: 60, wrong: 10 },
            { id: 3, name: '数学期中考试', date: '2024-02-10', answered: 50, wrong: 5 },
            { id: 4, name: '物理期末考试', date: '2024-06-15', answered: 60, wrong: 10 },
            { id: 5, name: '数学期中考试', date: '2024-02-10', answered: 50, wrong: 5 },
            { id: 6, name: '物理期末考试', date: '2024-06-15', answered: 60, wrong: 10 },
            // ... 更多的考试数据 ...
        ]);
        const selectedItem = ref(0);

        const selectItem = (index) => {
            selectedItem.value = index;

            // Determine which component to render based on the selected item
            if (index === 0) {
                selectedComponent.value = 'ExamRecords';
            } else if (index === 1) {
                selectedComponent.value = 'ErrorQuestionRecords';
            } else if (index === 2) {
                selectedComponent.value = 'PointRecords';
            } else {
                // Add more conditions as needed
                selectedComponent.value = null; // No component selected
            }
        };



        return {
            stats,
            selectedItem,
            selectItem,
            examData,
            selectedComponent
        };
    }
};
</script>

<style scoped>
.stats-container {
    margin: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 10px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    padding: 20px;
    color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    background: linear-gradient(to right, #16baaa, #66b1ff); /* Default gradient */
}

.stat-item:hover {
    transform: scale(2.05);
}

.title {
    font-size: 1em;
    margin-bottom: 5px;
}

.value {
    font-size: 2em;
    font-weight: bold;
}

/* Gradient backgrounds for each stat item */
.stat-item:nth-child(1) {
    background: linear-gradient(to right, #16baaa, #66b1ff);
}

.stat-item:nth-child(2) {
    background: linear-gradient(to right, #16baaa, #66b1ff);
}

.stat-item:nth-child(3), .stat-item:nth-child(4) {
    background: linear-gradient(to right, #16baaa, #66b1ff);
}

/* Responsive design */
@media (max-width: 600px) {
    .stat-item {
        width: 100%;
    }
}

@media (min-width: 601px) and (max-width: 1000px) {
    .stat-item {
        width: 30%;
    }
}

@media (min-width: 1001px) {
    .stat-item {
        width: 22%;
    }
}

.stats-container {
    margin: 20px;
    padding: 20px;
    border-radius: 15px;
}
</style>
