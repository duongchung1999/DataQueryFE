<template>
  <el-scrollbar style="height: 100%" ref="scroll">
    <!-- 页面正常显示数据-->
    <div v-if="LGTestFailDataFlag && LGSpecifyCategoryDatalag">
      <div id="Menu">
        <div>
          <!-- <p>年份季度</p> -->
          <el-select
            v-model="LGTimeValue"
            size="large"
            filterable
            placeholder="年份季度"
            @change="GetModelName()"
          >
            <el-option
              v-for="(item, index) in LGTimeList"
              :key="index"
              :label="item.FormatYear"
              :value="item.Year"
            >
            </el-option>
          </el-select>
          <!-- 机型名称 -->
          <el-select
            v-model="LGModelValue"
            size="large"
            filterable
            placeholder="机型"
            @change="GetStation()"
          >
            <el-option
              v-for="(item, index) in LGModelList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <!-- 站别名称 -->
          <el-select
            v-model="LGStationValue"
            size="large"
            filterable
            placeholder="站别"
            @change="GetComputerName()"
          >
            <el-option
              v-for="(item, index) in LGStationList"
              :key="index"
              :label="item.Station"
              :value="item.Station"
            >
            </el-option>
          </el-select>
          <!-- MES状态 -->
          <el-select
            v-model="MesStatusValue"
            size="large"
            filterable
            placeholder="MES状态"
            @change="ClearLGTestData()"
          >
            <el-option
              v-for="(item, index) in MesInfo"
              :key="index"
              :label="item.lable"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <!-- 电脑编号 -->
          <el-select
            v-model="LGComputerNumberValue"
            size="large"
            filterable
            :placeholder="$t('message.common.ComputerNumberPrompt')"
            @change="ClearLGTestData()"
            clearable
          >
            <el-option
              v-for="(item, index) in LGComputerNumberList"
              :key="index"
              :value="item.MachineName"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <span class="demonstration">{{
            $t("message.common.QueryTime")
          }}</span>
          <el-date-picker
            v-model="LGDateTimeValue"
            type="datetimerange"
            range-separator="至"
            :start-placeholder="$t('message.common.StartTime')"
            :end-placeholder="$t('message.common.EndTime')"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            @change="TimeChage()"
          >
          </el-date-picker>
          <el-button
            :disabled="LGButtonflag == 1 ? true : false"
            @click="SaveLGTestData()"
            type="warning"
            >{{ $t("message.common.SaveCSV") }}</el-button
          >
          <el-button
            :disabled="LGButtonflag == 1 ? true : false"
            @click="SaveJson()"
            type="warning"
            >{{ $t("message.common.SaveJson") }}</el-button
          >
          <el-button
            :disabled="LGButtonflag == 1 ? true : false"
            @click="SelectLGData()"
            type="success"
            >{{ $t("message.common.Query") }}</el-button
          >
        </div>
      </div>
      <div id="Data">
        <TestDataTable
          :TestDataTitle="LGTestDataTitle"
          :TestDataList="LGTestData"
          TableHeight="410px"
        >
        </TestDataTable>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="CurrentPage"
          :page-sizes="PageSizeInfo"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <TestStatistics
          :TestStatistics="LGTestStatistics"
          :AdverseEvent="LGDataStatisticsClickEvent"
          id="TestStatisticsTable"
        >
        </TestStatistics>
      </div>
    </div>
    <h2
      v-if="LGSpecifyCategoryDatalag == false || LGTestFailDataFlag == false"
      style="text-align: center; margin: 10px"
    >
      {{ LGSpecifyCategoryDataTitle }}
    </h2>
    <!-- 显示指定测试失败项,不良品和重测产品测试数据-->
    <div
      id="Data"
      v-if="(LGSpecifyCategoryDatalag == false) | (LGTestFailDataFlag == false)"
    >
      <TestDataTable
        style="margin-top: 0.5%"
        :TestDataTitle="LGTestDataTitle"
        :TestDataList="LGSpecifyCategoryDataList"
        :TableHeight="TableHeight"
      >
      </TestDataTable>
      <el-pagination
        v-if="LGSpecifyCategoryDataTitle != '不良产品数据'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="CurrentPage"
        :page-sizes="PageSizeInfo"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <TestStatistics
        v-if="LGSpecifyCategoryDatalag == false"
        :TestStatistics="LGTestStatistics"
        :AdverseEvent="LGDataStatisticsClickEvent"
        id="TestStatisticsTable"
      >
      </TestStatistics>
    </div>
    <Echarts
      v-if="LGSpecifyCategoryDatalag"
      myChartIndex="1"
      myChartName="myChart"
      :ChartClick="PieChartClickEvent"
      ref="EchartsChid"
    >
    </Echarts>
  </el-scrollbar>
</template>

<script>
import TestDataTable from "@/layout/CustomComponents/DataTable.vue";
import TestStatistics from "@/layout/CustomComponents/TestStatistics.vue";
import Echarts from "@/layout/CustomComponents/Echarts.vue";
import {
  DefaultTime,
  Generate_Time,
  Generate_Model_Name,
} from "@/utils/RequestProcessing/GeneralMethod";
import {
  Get_LG_Data_Table_Name,
  Get_Data_Table_LG_Station,
  Get_LG_Computer_Name,
  Get_LG_Test_Data,
  Get_LG_Test_Data_Title,
  Get_Pagination_LG_Test_Data,
  Get_LG_Test_Data_Fail_Statistics_Title,
  Get_LG_Test_Failure_Statistics_Data,
  Clear_LG_Test_Data,
  Get_LG_Test_Failure_Data,
  Get_Defective_LG_Test_Data,
  Get_Retest_LG_Test_Data,
  Save_LG_Test_Data,
  Save_Json,
} from "@/utils/RequestProcessing/LGTestDataProcessing";
import {
  Get_User_Model,
  Get_LG_Station,
} from "@/utils/RequestProcessing/BackgroundDataProcessing";
import store from "@/store";
import { ElMessage } from "element-plus";
import Moment from "moment";

export default {
  components: { TestDataTable, TestStatistics, Echarts },
  data() {
    return {
      total: 0, // 总共多少数据
      CurrentPage: 1, // 当前页
      PageSize: 25, // 当前页显示多少条,默认50条
      PageSizeInfo: [25, 50, 75, 100, 150, 200], // 单页显示多少条

      LGButtonflag: 1,
      LGTableNameList: [], // 存储所有表名
      LGTimeList: [], // 存储年份季度信息
      LGTimeValue: "", // 存储页面选择的年份季度信息
      LGModelList: [], // 存储机型数据
      LGModelValue: "", // 存储页面选择的机型
      LGStationList: [], // 存储站别数据
      LGStationValue: "", // 存储页面选择的站别数据
      MesStatusValue: "True", // 存储页面选择的MES状态
      MesInfo: [
        {
          lable: "MES模式",
          value: "True",
        },
        {
          lable: "单机模式",
          value: "False",
        },
      ],
      LGComputerNumberList: [], // 存储电脑编号
      LGComputerNumberValue: "", // 存储页面选择的电脑编号
      LGDateTimeValue: [],

      // 测试数据表数据
      LGTestDataTitle: [], // 存储测试数据的标题
      LGTestData: [], // 存储测试数据
      LGTestStatistics: [], //存储统计数据

      LGTestFailDataFlag: true, // 失败项目显示Flag(不显示为True,显示为False)
      LGSpecifyCategoryDataTitle: "", // 存储测试失败项目名称/不良品数据标题或重测产品数据标题
      LGSpecifyCategoryDataList: [], // 存储失败项目数据/不良品数据和重测产品测试数据
      LGSpecifyCategoryDatalag: true, // 是否显示不良品或重测产品测试数据(不显示为True,显示为False)
    };
  },
  created() {
    this.GetTestDataTableName();
  },
  methods: {
    //#region 加载所有表名生成季度信息
    async GetTestDataTableName() {
      this.LGTimeValue = "";
      this.LGTimeList = [];
      this.LGTableNameList = [];
      // 初始化界面时间选项
      this.LGDateTimeValue = await DefaultTime();
      this.LGTableNameList = await Get_LG_Data_Table_Name();
      if (this.LGTableNameList.length == 0) return;
      this.LGTimeList = await Generate_Time(this.LGTableNameList);
      this.LGTimeValue = this.LGTimeList[0].Year;
      this.DuplicateRemoval = "False";
      await this.GetModelName();
    },
    //#endregion

    //#region 根据选择的年份季度生成机型信息
    async GetModelName() {
      this.ClearLGTestData();
      this.LGModelValue = "";
      this.LGModelList = [];
      if (store.state.user.LoginFlag) {
        this.LGModelList = await Get_User_Model();
      } else {
        this.LGModelList = await Generate_Model_Name(
          this.LGTimeValue,
          this.LGTableNameList
        );
      }
      this.LGModelValue = this.LGModelList[0].replace("-", "_");
      await this.GetStation();
    },
    //#endregion

    //#region 根据机型名称获取有上传LG测试数据的站别
    async GetStation() {
      this.ClearLGTestData();
      this.LGStationValue = "";
      this.LGStationList = [];
      this.LGStationList = await Get_LG_Station(this.LGModelValue);
      if (this.LGStationList.length == 0) {
        this.LGStationList = await Get_Data_Table_LG_Station(
          `${this.LGModelValue}_${this.LGTimeValue}`
        );
      }
      this.LGStationValue = this.LGStationList[0].Station;
      await this.GetComputerName();
    },
    //#endregion

    //#region 根据表名获取LG测试数据表中指定站别所有测试电脑名称
    async GetComputerName() {
      this.ClearLGTestData();
      this.LGComputerNumberValue = "";
      this.LGComputerNumberList = [];
      this.LGComputerNumberList = await Get_LG_Computer_Name(
        `${this.LGModelValue}_${this.LGTimeValue}`,
        this.LGStationValue.split("|")[1]
      );
      if (this.LGComputerNumberList.length == 0) {
        this.LGButtonflag = 1; // 禁用按钮
        ElMessage.warning(
          `${this.LGModelValue} ${
            this.LGStationValue.split("|")[1]
          }站暂无测试电脑编号信息`
        );
        return;
      }
      this.LGButtonflag = 0;
    },
    //#endregion

    //#region 查询点击事件
    async SelectLGData() {
      this.LGButtonflag = 1; // 禁用按钮
      this.ClearLGTestData();
      let TableName = `${this.LGModelValue.replace(/-/g, "_")}_${
        this.LGTimeValue
      }`;
      let DataQueryInfo = new FormData();
      DataQueryInfo.append("TableName", TableName);
      DataQueryInfo.append("Station", this.LGStationValue.split("|")[1]);
      DataQueryInfo.append("MachineName", this.LGComputerNumberValue);
      DataQueryInfo.append("MesStatus", this.MesStatusValue);
      DataQueryInfo.append(
        "StartTime",
        this.LGDateTimeValue == null ? null : this.LGDateTimeValue[0]
      );
      DataQueryInfo.append(
        "EndTime",
        this.LGDateTimeValue == null ? null : this.LGDateTimeValue[1]
      );
      this.LGTestStatistics = await Get_LG_Test_Data(DataQueryInfo);
      this.LGButtonflag = 0; // 启用按钮
      if (this.LGTestStatistics.length == 0) {
        ElMessage.warning(
          `${this.LGModelValue} ${
            this.LGStationValue.split("|")[0]
          } 站当前条件查询 LG 数据为空`
        );
        return;
      }
      this.LoadData();
    },
    //#endregion

    // #region 页面数据加载
    async LoadData() {
      if (this.LGTestStatistics.length == 0) {
        this.ClearLGTestData();
        return;
      }
      this.total = this.LGTestStatistics[0]["测试总次数"];
      this.LGTestDataTitle = await Get_LG_Test_Data_Title();
      this.LGTestData = await Get_Pagination_LG_Test_Data(
        this.PageSize * (this.CurrentPage - 1),
        this.PageSize
      );
      let TestDataFailStatisticsTitle =
        await Get_LG_Test_Data_Fail_Statistics_Title(); // 获取测试失败项标题
      let TestDataFailureStatisticsList =
        await Get_LG_Test_Failure_Statistics_Data(); // 获取测试失败项统计数据
      this.$refs.EchartsChid.drawPieTestFail(
        TestDataFailStatisticsTitle,
        TestDataFailureStatisticsList
      );
      this.LGButtonflag = 0; // 启用按钮
    },
    //#endregion

    //#region 分页区域
    // 切换当前页总数据
    async handleSizeChange(val) {
      this.PageSize = val;
      await this.GetPagingData();
      // console.log(this.PageSize,val)
    },
    // 切换当前页面
    async handleCurrentChange(val) {
      this.CurrentPage = val;
      await this.GetPagingData();
      // console.log(`当前页: ${val}`);
    },

    // 获取分页数据
    async GetPagingData() {
      if (this.LGTestFailDataFlag && this.LGSpecifyCategoryDatalag) {
        this.$refs.EchartsChid.ClearPieChart();
        await this.LoadData();
      } else if (this.LGSpecifyCategoryDatalag == false) {
        await this.GetRetestLGTestData();
      } else if (this.LGTestFailDataFlag == false) {
        await this.GetLGTestFailureData();
      }
    },
    // #endregion

    //#region 测试失败饼图点击事件
    async PieChartClickEvent(FailName) {
      this.TableHeight = "310px";
      this.PageSize = 25;
      this.CurrentPage = 1;
      if (this.LGSpecifyCategoryDataTitle.indexOf(FailName) == -1) {
        this.PageSizeInfo = [25, 50, 75];
        this.LGSpecifyCategoryDataTitle = FailName;
        await this.GetLGTestFailureData();
        setTimeout(() => {
          this.$refs.scroll.wrap.scrollTop = 0;
        }, 5);
      } else {
        this.PageSizeInfo = [25, 50, 75, 100, 150, 200];
        this.LGTestFailDataFlag = true;
        this.LGSpecifyCategoryDataTitle = "";
        this.total = this.LGTestStatistics[0]["测试总次数"];
        setTimeout(() => {
          this.$refs.scroll.wrap.scrollTop = 0;
        }, 2);
      }
    },
    //#endregion

    //#region 获取测试失败项目分页数据
    async GetLGTestFailureData() {
      let TestFailureData = await Get_LG_Test_Failure_Data(
        this.LGSpecifyCategoryDataTitle,
        this.PageSize * (this.CurrentPage - 1),
        this.PageSize
      );
      this.LGTestFailDataFlag = false;
      this.total = TestFailureData[0];
      this.LGSpecifyCategoryDataList = TestFailureData[1];
    },
    //#endregion

    //#region 数据统计点击事件
    async LGDataStatisticsClickEvent(Name) {
      this.PageSize = 25;
      this.CurrentPage = 1;
      if (this.LGSpecifyCategoryDataTitle.indexOf(Name) == -1) {
        this.PageSizeInfo = [25, 50, 75];
        if (Name == "不良产品数") {
          this.LGSpecifyCategoryDataList = await Get_Defective_LG_Test_Data();
          if (this.SpecifyCategoryDataList.length == 2) {
            ElMessage.warning("当前暂无不良产品测试数据");
            return;
          } else {
            this.TableHeight = "510px";
            this.LGSpecifyCategoryDataTitle = "不良产品数据";
          }
        } else {
          if (!(await this.GetRetestLGTestData())) return;
        }
        this.LGSpecifyCategoryDatalag = false;
      } else {
        this.PageSizeInfo = [25, 50, 75, 100, 150, 200];
        this.TableHeight = "410px";
        this.total = this.LGTestStatistics[0]["测试总次数"];
        this.LGSpecifyCategoryDataTitle = "";
        this.LGSpecifyCategoryDatalag = true;
        let TestDataFailStatisticsTitle =
          await Get_LG_Test_Data_Fail_Statistics_Title(); // 获取测试失败项标题
        let TestDataFailureStatisticsList =
          await Get_LG_Test_Failure_Statistics_Data(); // 获取测试失败项统计数据
        this.$refs.EchartsChid.drawPieTestFail(
          TestDataFailStatisticsTitle,
          TestDataFailureStatisticsList
        );
        setTimeout(() => {
          this.$refs.scroll.wrap.scrollTop = 0;
        }, 2);
      }
    },
    //#endregion

    //#region 获取重测产品测试数据
    async GetRetestLGTestData() {
      this.LGSpecifyCategoryDataTitle = "重测产品数据";
      let Retest_Test_Data = await Get_Retest_LG_Test_Data(
        this.PageSize * (this.CurrentPage - 1),
        this.PageSize
      );
      if (Retest_Test_Data[0] == 0) {
        ElMessage.warning("当前暂无重测产品测试数据");
        this.LGSpecifyCategoryDataTitle = "";
        return false;
      } else {
        this.TableHeight = "470px";
        this.LGSpecifyCategoryDataTitle = "重测产品数据";
        this.total = Retest_Test_Data[0];
        this.LGSpecifyCategoryDataList = Retest_Test_Data[1];
      }
      return true;
    },
    //#endregion

    //#region 保存 LG 测试数据
    async SaveLGTestData() {
      let TableName = `${this.LGModelValue.replace(/-/g, "_")}_${
        this.LGTimeValue
      }`;
      let DataQueryInfo = new FormData();
      DataQueryInfo.append("TableName", TableName);
      DataQueryInfo.append("Station", this.LGStationValue.split("|")[1]);
      DataQueryInfo.append("MachineName", this.LGComputerNumberValue);
      DataQueryInfo.append("MesStatus", this.MesStatusValue);
      DataQueryInfo.append("StartTime", this.LGDateTimeValue[0]);
      DataQueryInfo.append("EndTime", this.LGDateTimeValue[1]);
      await Save_LG_Test_Data(this.LGModelValue, DataQueryInfo);
    },
    //#endregion

    //#region 导出 Json File 文件
    async SaveJson() {
      let TableName = `${this.LGModelValue.replace(/-/g, "_")}_${
        this.LGTimeValue
      }`;
      let DataQueryInfo = new FormData();
      DataQueryInfo.append("TableName", TableName);
      DataQueryInfo.append("Station", this.LGStationValue.split("|")[1]);
      DataQueryInfo.append("MachineName", this.LGComputerNumberValue);
      DataQueryInfo.append("MesStatus", this.MesStatusValue);
      DataQueryInfo.append("StartTime", this.LGDateTimeValue[0]);
      DataQueryInfo.append("EndTime", this.LGDateTimeValue[1]);
      await Save_Json(this.LGModelValue, DataQueryInfo);
    },
    //#endregion

    //#region 清空页面原有数据
    async ClearLGTestData() {
      await Clear_LG_Test_Data();
      this.LGTestDataTitle = [];
      this.LGTestData = [];
      this.LGTestStatistics = [];
      this.currentPage = 1; // 将页码恢复为1
      this.pagesize = 50; // 将单页显示条数恢复默认
      this.total = 0; // 将分页总数改为0
      this.$refs.EchartsChid.ClearPieChart();
    },
    //#endregion

    //#region 时间选择事件
    async TimeChage() {
      let value = Moment().format("YYYY-MM-DD");
      if (this.DateTimeValue == null) return;
      if (value < this.LGDateTimeValue[0].split(" ")[0]) {
        ElMessage.warning("查询开始时间不能大于当前日期");
        this.LGDateTimeValue = await DefaultTime();
        return;
      }
    },
    //#endregion
  },
};
</script>

<style  lang="scss" scoped>
@import "./LogiTestDataCss.css";
</style>