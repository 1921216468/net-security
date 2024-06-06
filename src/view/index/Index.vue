<template>
        <lay-carousel class="carousel-container"  v-model="active4">
            <lay-carousel-item :id="item.id" v-for="item in arrays" :arrow="none">
                <div >
                    <img :src="item.img">
                </div>
            </lay-carousel-item>
        </lay-carousel>
<!--    课程渲染-->
        <br/>
<ArticleCard />

</template>

<script>
import { ref ,onMounted} from 'vue'
import {CarouselApi} from "../../servie/CarouselApi.ts";
import ArticleCard from "../../components/index/IndexCard.vue";

export default {
    components: {ArticleCard},
    setup() {

        /**轮播图绑定id*/
        const active4 = ref("1")
        /**轮播图数组*/
        const arrays = ref([])
        /**获取轮播图*/
        const fetch_carousel = () => {
            CarouselApi.getCarouselList({}).then(res => {
                active4.value = res.data.records[0].id;
                arrays.value = res.data.records;
            }).catch(error => {
                layer.msg('获取失败');
            })
        }



        onMounted(() => {
            fetch_carousel();

        })

        return {
            active4,
            arrays,

        }
    }
}
</script>

<style scoped>
    .carousel-container {
        width: 100%;
        height: 300px;
        text-align: center;
        line-height: 300px;
        /*color: #fff;*/
        /*background: #393D49;*/
    }
</style>
