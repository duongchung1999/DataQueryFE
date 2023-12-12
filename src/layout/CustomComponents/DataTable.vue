<template>
    <!--数据显示列表-->
    <el-table border :data="TestDataList" :row-class-name="tableRowClassName" width="100%" :height="TableHeight">
        <el-table-column v-for="(item, index) in TestDataTitle" :key="index" :prop="item.prop" :label="item.label"
            width="150px" show-overflow-tooltip>
        </el-table-column>
    </el-table>
</template>
<script>
export default {
    name: 'TestDataTable',
    props: {
        TestDataTitle: {},
        TestDataList: {},
        TableHeight: ""
    },
    methods: {
        //#region  检测表格为False的记录
        tableRowClassName({row}) {
            if (row["Result"] === "False" ||row["Status"] === "F" ) {
                return "warning-row";
            }
            return "";
        },
        //#endregion
    }
}
</script>


