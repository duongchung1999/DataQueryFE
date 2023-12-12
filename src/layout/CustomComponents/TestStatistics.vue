<template>
    <el-table border :data="TestStatistics" width="100%" height="81px">
        <!-- <el-table-column v-for="(item, index) in CountDataTitle" :key="index" :prop="item.prop" :label="item.label"
            width="160px">
        </el-table-column> -->
        <el-table-column prop="直通率" label="直通率" width="90px"></el-table-column>
        <el-table-column prop="重测率(新)" label="重测率(新)" width="90px"></el-table-column>
        <el-table-column prop="重测率(旧)" label="重测率(旧)" width="90px"></el-table-column>
        <el-table-column prop="不良率" label="不良率" width="90px"></el-table-column>
        <el-table-column prop="测试总次数" label="测试总次数" width="90px"></el-table-column>
        <el-table-column prop="测试成功总次数" label="测试成功总次数" width="110px"></el-table-column>
        <el-table-column prop="测试失败总次数" label="测试失败总次数" width="110px"></el-table-column>
        <el-table-column prop="测试产品数" label="测试产品数" width="90px"></el-table-column>
        <el-table-column prop="直通产品数" label="直通产品数" width="90px"></el-table-column>
        <el-table-column prop="重测产品数" label="重测产品数" width="90px">
            <template #default="{ row }">
                <div @click="handleClick('重测产品数')">{{ row.重测产品数 }}</div>
            </template>
        </el-table-column>
        <el-table-column prop="不良产品数" label="不良产品数" width="90px">
            <template #default="{ row }">
                <div @click="handleClick('不良产品数')">{{ row.不良产品数 }}</div>
            </template>
        </el-table-column>
        <el-table-column prop="包含TE_BZP测试总次数" label="包含TE_BZP测试总次数" width="160px"></el-table-column>
        <el-table-column prop="工程专用条码测试次数" label="工程专用条码测试次数" width="160px"></el-table-column>
        <el-table-column prop="品质专用条码测试次数" label="品质专用条码测试次数" width="160px"></el-table-column>
        <el-table-column prop="制造专用条码测试次数" label="制造专用条码测试次数" width="160px"></el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'TestStatistics',
    props: {
        TestStatistics: {},
        AdverseEvent: Function
    },
    methods: {
        handleClick(Name) {
            this.AdverseEvent(Name)
        }
    }
}
</script>