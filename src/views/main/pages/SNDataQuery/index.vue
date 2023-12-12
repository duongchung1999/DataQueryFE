<template>
    <el-scrollbar style="height: 100%" ref="scroll">
        <div id="Menu">
            <div>
                <!-- <p>时间节点</p> -->
                <!-- <span class="Text">年份季度</span> -->
                <el-select v-model="TimeValue" size="large" filterable placeholder="年份季度" @change="GetModelName()">
                    <el-option v-for="(item, index) in TimeList" :key="index" :label="item.FormatYear" :value="item.Year">
                    </el-option>
                </el-select>
                <!-- 机型名称 -->
                <!-- <span class="Text">机型</span> -->
                <el-select v-model="ModelValue" size="large" filterable :placeholder="$t('message.common.ModelPrompt')" style=" width: 16%;"
                    @change="ClearTestData">
                    <el-option v-for="(item, index) in ModelList" :key="index" :label="item" :value="item">
                    </el-option>
                </el-select>
                <!-- 查询整年 -->
                <!-- <span class="Text">查询整年</span> -->
                <el-select v-model="YearFalgValue" size="large" filterable placeholder="查询整年" @change="ClearTestData">
                    <el-option v-for="(item, index) in FixedValue" :key="index" :label="item.value" :value="item.value">
                    </el-option>
                </el-select>
                <!-- <span class="Text">SN</span> -->
                <el-input style="width: 38%;" placeholder="SN" v-model="SNValue" clearable @change="ClearTestData">
                </el-input>
            </div>
            <div>
                <el-button :disabled="Saveflag == 1 ? true : false" @click="SaveSNTestData()"
                    type="warning">{{ $t('message.common.SaveExcel') }}</el-button>
                <el-button type="danger" :disabled="Buttonflag == 1 ? true : false" @click="ClearTable">{{ $t('message.common.ClearPage') }}</el-button>
                <el-button :disabled="Buttonflag == 1 ? true : false" @click="SelectSNData()" type="success">{{ $t('message.common.Query') }}</el-button>
            </div>
        </div>
        <div style="padding-bottom: 1%;">
            <div id="Data" v-for="(item, index) in StationTestData" :key="index">
                <h2 style="text-align: center;margin: 2px;"> {{ item.StationName }}</h2>
                <TestDataTable :TestDataTitle="item.Testdata[0].Title" :TestDataList="item.Testdata[1].StationTestdata"
                    :TableHeight="(item.Testdata[1].StationTestdata.length + 1) * 36 + 8 + 'px'"></TestDataTable>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
import TestDataTable from "@/layout/CustomComponents/DataTable.vue"
import { Get_Data_Table_Name } from "@/utils/RequestProcessing/TestDataQueryProcessing";
import { Get_User_Model } from "@/utils/RequestProcessing/BackgroundDataProcessing";
import { Generate_Time, Generate_Model_Name } from "@/utils/RequestProcessing/GeneralMethod"
import { Get_Test_Data_From_SN, Save_SN_Test_Data } from "@/utils/RequestProcessing/SNDataQueryProcessing";
import store from "@/store";

export default {
    components: { TestDataTable },
    data() {
        return {
            Buttonflag: 1, // 按钮是否禁用
            Saveflag: 1, // 存储按钮状态
            FixedValue: [
                {
                    value: "True",
                },
                {
                    value: "False",
                }
            ],

            TimeList: [], // 存储时间季度数据
            TableNameList: [], // 存储所有表名
            TimeValue: "", // 存储选择的时间季度
            ModelValue: "", // 存储选择的机型
            ModelList: [], // 存储机型名称
            YearFalgValue: "False",// 存储选择是否查整年
            SNValue: "", // 存储SN输入值
            StationTestData: [], // 存储测试数据

        }
    },
    created() {
        this.GetTestDataTableName();
    },
    methods: {
        //#region 加载所有表名生成季度信息
        async GetTestDataTableName() {
            this.TimeValue = "";
            this.TimeList = [];
            this.TableNameList = [];
            // 初始化界面时间选项
            this.TableNameList = await Get_Data_Table_Name();
            if (this.TableNameList.length == 0) return;
            this.TimeList = await Generate_Time(this.TableNameList);
            this.TimeValue = this.TimeList[0].Year;
            this.YearFalgValue = "False";
            await this.GetModelName();
        },
        //#endregion

        //#region 获取机型名称
        async GetModelName() {
            this.ClearTestData();
            this.ModelValue = "";
            this.ModelList = [];
            if (store.state.user.LoginFlag) {
                this.ModelList = await Get_User_Model();
            } else {
                this.ModelList = await Generate_Model_Name(this.TimeValue, this.TableNameList);
            }
            this.ModelValue = this.ModelList[0].replace('-', '_');
            this.Buttonflag = 0
        },
        //#endregion

        //#region 查询指定SN数据
        async SelectSNData() {
            let TableName = `${this.ModelValue.replace(/-/g, '_')}_${this.TimeValue}`;
            let DataQueryInfo = new FormData();
            DataQueryInfo.append("TableName", TableName);
            DataQueryInfo.append("YearFalgValue", this.YearFalgValue);
            DataQueryInfo.append("SN", this.SNValue);
            this.StationTestData = await Get_Test_Data_From_SN(DataQueryInfo);
            if (this.StationTestData.length > 0) this.Saveflag = 0; // 启用按钮
            console.log(this.StationTestData)
        },
        //#endregion
        async SaveSNTestData() {
            await Save_SN_Test_Data(this.ModelValue, this.StationTestData);
        },

        //#region 恢复页面至默认状态
        async ClearTable() {
            await this.ClearTestData();
            this.YearFalgValue = "False";
            this.SNValue = "";
        },
        //#endregion

        // #region 清空测试数据
        async ClearTestData() {
            this.Saveflag = 1; // 禁用按钮
            this.StationTestData = [];
        },
        //#endregion

    }
}
</script>

<style  lang="scss" scoped>
@import "./SNDataQueryCss.css";
</style>