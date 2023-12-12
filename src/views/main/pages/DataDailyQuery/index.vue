<template>
  <el-scrollbar style="height: 100%" ref="scroll">
    <div id="Menu">
      <!-- 年份 -->
      <el-select
        v-model="YearValue"
        size="large"
        filterable
        placeholder="年份"
        style="width: 90px"
        @change="GetModel"
      >
        <el-option
          v-for="(item, index) in Year"
          :key="index"
          :label="item"
          :value="item.split('年')[0]"
        >
        </el-option>
      </el-select>
      <!-- 机型名称 -->
      <el-select
        v-model="ModelValue"
        size="large"
        filterable
        :placeholder="$t('message.common.ModelPrompt')"
        @change="Clear"
      >
        <el-option
          v-for="(item, index) in ModelList"
          :key="index"
          :label="item.Model"
          :value="item.Model.split('年')[0]"
        >
        </el-option>
      </el-select>
      <span class="demonstration">{{ $t("message.common.QueryTime") }}</span>
      <el-date-picker
        v-model="DateTimeValue"
        type="daterange"
        range-separator="至"
        start-placeholder="{{ $t('message.common.StartTime') }}"
        end-placeholder="{{ $t('message.common.EndTime') }}"
        @change="Clear"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
      >
      </el-date-picker>
      <el-button
        :disabled="Selectflag == 1 ? true : false"
        @click="SelectDataReport"
        type="success"
        >{{ $t("message.common.Query") }}</el-button
      >
      <el-button
        :disabled="Saveflag == 1 ? true : false"
        @click="Save_Data"
        type="warning"
        >{{ $t("message.common.SaveExcel") }}</el-button
      >
    </div>
    <!-- <div v-for="index in myChartIndex" :key="index" :id="'myChart' + index" class="Chart">
      {{ index }}
    </div> -->
    <Echarts
      :myChartIndex="myChartIndex"
      myChartName="myChart"
      ref="EchartsChid"
    ></Echarts>
  </el-scrollbar>
</template>
<script>
import {
  Get_Year_Value,
  Get_Model_From_Year,
  Get_Daily_Data_Query,
  Get_daily_report_data,
  Save_Daily_Report,
} from "@/utils/RequestProcessing/DataDailyQueryProcessing";
import { Get_User_Model } from "@/utils/RequestProcessing/BackgroundDataProcessing";
import {
  getFullTime,
  Tips,
  timeStr,
} from "@/utils/RequestProcessing/GeneralMethod";
import { ElMessage } from "element-plus";
import store from "@/store";
import Echarts from "@/layout/CustomComponents/Echarts.vue";
import Moment from "moment";

export default {
  components: { Echarts },
  data() {
    return {
      Year: [], // 存储年份数据
      ModelList: [], // 存储机型数据
      YearValue: "", // 存储选择的年份
      ModelValue: "", // 存储选择的机型
      Selectflag: 1, // 按钮是否禁用
      Saveflag: 1, // 存储按钮状态
      myChartIndex: 0, // 存储页面生成DOM的数量
      DailyData: new Array(), // 存储日报数据
      DateTimeValue: [],
    };
  },
  created() {
    this.GetYear();
  },
  methods: {
    // #region 获取年份
    async GetYear() {
      try {
        this.Year = await Get_Year_Value(); // 获取年份
        if (this.Year.length == 0) return;
        this.YearValue = this.Year[0].split("年")[0]; // 设置默认为当前年份
        this.DefaultTime();
        await this.GetModel();
      } catch (ex) {
        console.log("错误信息", ex);
      }
    },
    //#endregion

    //#region 根据年份查询机型名称
    async GetModel() {
      // 清空原有数据
      this.DailyData = [];
      this.ModelList = [];
      if (store.state.user.LoginFlag) {
        this.ModelList = await Get_User_Model();
      } else {
        this.ModelList = await Get_Model_From_Year(this.YearValue);
      }
      this.ModelValue = this.ModelList[0].Model;
      this.Selectflag = 0;
      await this.DailyDataQuery();
    },
    //#endregion

    //#region 查询按钮事件
    async SelectDataReport() {
      // 清空原有的数据
      this.Clear();
      this.myChartIndex = 0;
      if (this.DateTimeValue == null) {
        ElMessage.warning("时间不能为空");
        this.DefaultTime();
        return;
      }
      if (this.DateTimeValue[0] == this.DateTimeValue[1]) {
        await this.DailyReportData();
      } else {
        await this.DailyDataQuery();
      }
    },
    //#endregion

    //#region 查询跨日的日报表数据
    async DailyDataQuery() {
      let DailyData = await Get_Daily_Data_Query(
        this.YearValue,
        this.ModelValue,
        this.DateTimeValue[0],
        this.DateTimeValue[1]
      );
      if (DailyData.length == 0) return;
      this.myChartIndex = DailyData.length;
      this.DailyData = DailyData;
      this.$nextTick(() => {
        // 循环站别数据
        DailyData.forEach((element, index) => {
          let TableName = "";
          let TitleData = [];
          let Direct_rate = [];
          let Retest_rate = [];
          let Number_of_products_tested = [];
          let Total_number_of_retests = [];
          // 循环单站的所有数据存储到数组
          for (var item in element) {
            TableName = `${this.ModelValue} ${item} 报表`;
            element[item].forEach((values) => {
              TitleData.push(getFullTime(values.Time).split(" ")[0]);
              Direct_rate.push(values.Test_pass_through_rate);
              Retest_rate.push(values.Retest_rate);
              Number_of_products_tested.push(
                values.Total_number_of_products_tested
              );
              Total_number_of_retests.push(values.Total_number_of_retests);
            });
          }
          // 绘制图表
          this.$refs.EchartsChid.drawColumnAndLine(
            index + 1,
            TableName,
            TitleData,
            Direct_rate,
            Retest_rate,
            Number_of_products_tested,
            Total_number_of_retests
          );
        });
      });
      this.Saveflag = 0;
    },
    //#endregion

    // #region 通用查询日报表并生成图表
    async DailyReportData() {
      // 调用查询日报表的良率报告方法
      let DailyData = await Get_daily_report_data(
        this.YearValue,
        this.ModelValue,
        this.DateTimeValue[0]
      );
      // 数据为空则提示用户
      if (DailyData.length == 0) return;
      this.myChartIndex = DailyData.length;
      this.DailyData = DailyData;
      this.$nextTick(() => {
        // 循环站别数据
        DailyData.forEach((element, index) => {
          let TableName = "";
          let TitleData = [];
          let Direct_rate = [];
          let Retest_rate = [];
          let Number_of_products_tested = [];
          let Total_number_of_retests = [];
          // 循环单站的所有数据存储到数组
          for (var item in element) {
            TableName = `${this.ModelValue} ${item} 报表`;
            element[item].forEach((values) => {
              TitleData.push(values.节点名称);
              Direct_rate.push(values.直通率.replace("%", ""));
              Retest_rate.push(values.重测率新.replace("%", ""));
              Number_of_products_tested.push(values.测试产品数);
              Total_number_of_retests.push(values.重测产品数);
            });
          }
          // 绘制图表
          this.$refs.EchartsChid.drawColumnAndLine(
            index + 1,
            TableName,
            TitleData,
            Direct_rate,
            Retest_rate,
            Number_of_products_tested,
            Total_number_of_retests
          ); //折线图
        });
      });
      this.Saveflag = 0;
    },
    //#endregion

    //#region 保存日报数据
    async Save_Data() {
      let SaveType;
      if (this.DateTimeValue[0] == this.DateTimeValue[1]) {
        SaveType = "单日";
      } else {
        SaveType = "多日";
      }
      await Save_Daily_Report(
        this.ModelValue.toUpperCase(),
        this.DailyData,
        SaveType
      );
    },
    //#endregion

    //#region 清除页面内容
    async Clear() {
      let value = Moment().format("YYYY-MM-DD");
      if (value < this.DateTimeValue[0]) {
        ElMessage.warning("开始时间不能大于当前日期");
        this.DefaultTime();
        return;
      }
      this.Saveflag = 1;
      this.DailyData = [];
      if (this.myChartIndex.length > 0) {
        this.$refs.EchartsChid.ClearLineChart();
      }
      this.myChartIndex = []; // 将DOM数量清空
    },
    //#endregion

    //#region 设置默认时间
    async DefaultTime() {
      this.DateTimeValue = [
        (
          await timeStr(
            new Date(new Date(new Date().toLocaleDateString()).getTime()) -
              24 * 7 * 60 * 60 * 1000
          )
        ).split(" ")[0],
        Moment().format("YYYY-MM-DD"),
      ];
    },
    //#endregion
  },
};
</script>
<style scoped>
@import "./DataDailyCss.css";
</style>