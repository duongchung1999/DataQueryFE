<template>
    <div class="my-table">
      <el-table :data="TableData" :row-class-name="tableRowClassName">
        <el-table-column :label="TableTitle" align="center">
          <el-table-column
            v-for="(item, index) in TitleName"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          >
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  export default {
    // mounted() {
    //   console.log(111, this.TableData);
    // },
    props: {
      TableTitle: "",
      TitleName: {
        type: Array,
      },
      TableData: {
        type: Array,
      },
    },
    methods: {
      // 检测表格为False的记录
      tableRowClassName({ row }) {
        let DirectRate = row["DirectRate"]
        let num = parseInt(DirectRate.replace('%',''));
        if (num < 90) {
          return "warning-row";
        }
        return "";
      },
    },
  };
  </script>
  <style lang="scss" scoped>
  // 设置Table样式
  :deep(.el-table .warning-row) {
    color: #fff;
    background: #ac3d3d;
  }
  </style>