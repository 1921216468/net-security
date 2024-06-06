<template>
    <div class="table-content">
        <lay-table
                :page="page"
                :columns="columns"
                :loading="loading"
                :default-toolbar="true"
                :data-source="dataSource"
                v-model:selected-keys="selectedKeys"
                @change="change"
                @sortChange="sortChange"
        >
            <template #img="{ row }">
                <!-- 在这里渲染图片，你可以使用 row.img -->
                <img :src="row.img" alt="图片" class="img-column" />
            </template>

            <template #status="{ row }">
                <lay-switch
                        :model-value="row.status"
                        @change="changeStatus($event, row)"
                ></lay-switch>
            </template>
            <template v-slot:toolbar>
                <lay-button size="sm" @click="remove">删除</lay-button>
                <lay-button size="sm" type="primary" @click="add">发布</lay-button>
            </template>
            <template v-slot:operator="{ row }">
                <lay-button size="xs" type="primary" @click="edit(row)"
                >编辑</lay-button
                >
                <!--                <lay-button size="xs">查看</lay-button>-->
            </template>
        </lay-table>
    </div>
</template>
<script lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { layer } from '@layui/layui-vue'
import {router} from "../../../router";
import {LessonApi} from "../../../servie/LessonApi.ts";
import {CarouselApi} from "../../../servie/CarouselApi.ts";

export default {
    setup() {
        const currentTab = ref('system')
        const messageInfo = ref({
            system: 3,
            user: 0,
            todo: 11
        })
        const loading = ref(true)

        onMounted(() => {
            setTimeout(() => {
                loading.value = false
            }, 1000)
        })

        const selectedKeys = ref<string[]>([])

        const page = reactive({ current: 1, limit: 10, total: 100 })

        const columns = ref([
            { title: '选项', width: '55px', type: 'checkbox', fixed: 'left' },
            { title: '编号', width: '80px', key: 'id', fixed: 'left', sort: 'desc' },
            { title: '标题', width: '260px', key: 'title' },
            { title: '图片', width: '260px', key: 'img', customSlot: 'img' },
            { title: '时间', width: '120px', key: 'createTime' },
            {
                title: '操作',
                width: '150px',
                customSlot: 'operator',
                key: 'operator',
                fixed: 'right'
            }
        ])

        const change = (page: any) => {
            loading.value = true
            setTimeout(() => {
                dataSource.value = loadDataSource(page.current, page.limit)
                loading.value = false
            }, 1000)
        }

        const sortChange = (key: any, sort: any) => {
            layer.msg(
                `字段${key} - 排序${sort}, 你可以利用 sort-change 实现服务端排序`
            )
        }

        const dataSource = ref([])

        const fetch_article = async (pageSize) => {
            CarouselApi.getCarouselList({ current: page.current, pageSize: pageSize }).then((res) => {
                dataSource.value = res.data.records
                page.total = res.data.total
                console.log(res.data.records)
                dataSource.value.forEach((item) => {
                    item.status = item.status === true
                })
            })
        }

        const changeStatus = (isChecked: boolean, row: any) => {
            dataSource.value.forEach((item) => {
                if (item.id === row.id) {
                    layer.msg('Success', { icon: 1 }, () => {
                        item.status = isChecked
                    })
                }
            })
        }

        const remove = () => {
            if (selectedKeys.value.length === 0) {
                layer.msg('请先选择要删除的数据', { icon: 2 })
                return
            }
            CarouselApi.deleteCarouselById({id:selectedKeys.value[0]}).then((res) => {
                layer.msg('Success', { icon: 1 }, () => {
                    fetch_article(page.limit)
                })
            })
        }

        const loadDataSource = (page: any, pageSize: number) => {
            fetch_article(pageSize);
            var response = []
            var startIndex = (page - 1) * pageSize + 1
            var endIndex = page * pageSize
            for (var i = startIndex; i <= endIndex; i++) {
                response.push({
                    id: `${i}`,
                    age: '18',
                    sex: '男',
                    name: `张三${i}`,
                    email: 'test@qq.com',
                    remark: '花开堪折直须折,莫待无花空折枝.',
                    joinTime: '2022-02-09',
                    city: '浙江杭州',
                    status: true
                })
            }
            return response
        }

        const edit =  (row: any) => {
            const id = row.id
            router.push({
                name: 'EditCarousel',
                query: { id }, // 使用 query 参数携带文章id
            });
        }

        const add =  () => {
            router.push({
                name: 'AddCarousel',
            });
        }

        onMounted(() => {
            loadDataSource(page.current, page.limit)
        })

        return {
            currentTab,
            messageInfo,
            columns,
            dataSource,
            selectedKeys,
            loading,
            page,
            change,
            changeStatus,
            remove,
            edit,
            sortChange,
            add
        }
    }
}
</script>

<style scoped>
.table-content {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
}
.option-icon {
    cursor: pointer;
}
.img-column {
    max-width: 50%;
}
.video-column {
    max-width: 100%;
    max-height: 100px;
}
</style>
