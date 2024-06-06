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


            <template #status="{ row }">
                <lay-switch
                    :model-value="row.status"
                    @change="changeStatus($event, row)"
                ></lay-switch>
            </template>

        </lay-table>
    </div>
</template>
<script lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { layer } from '@layui/layui-vue'
import {ExamRecordApi} from "../../servie/ExamRecordApi.ts";

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
            }, 10)
        })

        const selectedKeys = ref<string[]>([])
        const tagColor = ref(' "primary"')

        const page = reactive({ current: 1, limit: 10, total: 100 })


        const columns = ref([
            { title: '题库标题', width: '120px', key: 'title' },
            { title: '答错错题', width: '80px', key: 'mistakeNum' },
            { title: '累计作答', width: '80px', key: 'questionNum' },
            { title: '练习时间', width: '120px', key: 'createTime' },
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

        const fetch_record = async (pageSize) => {
            ExamRecordApi.getMyExamRecordList({ current: page.current, pageSize: pageSize }).then((res) => {
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



        const loadDataSource = (page: any, pageSize: number) => {
            fetch_record(pageSize);
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
            sortChange,
            tagColor
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
