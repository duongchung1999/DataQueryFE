<template>
  <el-scrollbar style="height: 100%" ref="scroll">
    <!-- 页面正常显示数据-->
    <div v-if="TestFailDataFlag && SpecifyCategoryDatalag">
      <div id="Menu">
        <!--下拉菜单-->
        <div class="select">
          <!-- <p>时间节点</p> -->
          <el-select v-model="TimeValue" size="large" filterable :placeholder="$t('message.common.YearPrompt')" @change="GetModelName()">
            <el-option v-for="(item, index) in TimeList" :key="index" :label="item.FormatYear" :value="item.Year">
            </el-option>
          </el-select>
          <!-- 机型名称 -->
          <el-select v-model="ModelValue" size="large" filterable :placeholder="$t('message.common.ModelPrompt')" @change="GetStation()">
            <el-option v-for="(item, index) in ModelList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
          <!-- 站别名称 -->
          <el-select v-model="StationValue" size="large" filterable :placeholder=" $t('message.common.StationPrompt')" @change="GetComputerName()">
            <el-option v-for="(item, index) in StationList" :key="index" :value="item.Station">
            </el-option>
          </el-select>
          <!-- 电脑编号 -->
          <el-select v-model="ComputerNumberValue" size="large" filterable :placeholder="$t('message.common.ComputerNumberPrompt')" @change="ClearTestData"
            clearable>
            <el-option v-for="(item, index) in ComputerNumberList" :key="index" :value="item.MachineName">
            </el-option>
          </el-select>
        </div>
        <div class="select">
          <!-- 节点查询 -->
          <el-select v-model="NodeValue" size="large" filterable :placeholder="$t('message.common.NodePrompt')" @change="NodeSelect" clearable>
            <el-option v-for="(item, index) in NodeList" :key="index" :value="item.value">
            </el-option>
          </el-select>
          <!-- 测试结果 -->
          <el-select v-model="ResultValue" size="large" filterable :placeholder="$t('message.common.ResultPrompt')" @change="ClearTestData" clearable>
            <el-option v-for="(item, index) in FixedValue" :key="index" :value="item.value">
            </el-option>
          </el-select>
          <!-- 去重选择 -->
          <el-select v-model="DuplicateRemoval" size="large" filterable :placeholder="$t('message.common.DuplicateRemovalPrompt')" @change="ClearTestData"
            clearable>
            <el-option v-for="(item, index) in FixedValue" :key="index" :value="item.value">
            </el-option>
          </el-select>
          <!-- 工单信息 -->
          <el-select v-model="WorkordersValue" size="large" filterable :placeholder="$t('message.common.WorkordersPrompt')" @change="ClearTime" clearable>
            <el-option v-for="(item, index) in WorkOrderList" :key="index" :value="item.workorders">
            </el-option>
          </el-select>
        </div>
        <!--自定义输入框-->
        <div>
          <el-input style="width: 42%; float: left" :placeholder="$t('message.common.CustomQueryPrompt')" v-model="CustomQuery" @input="Custom_Query_Value"
            clearable>
          </el-input>
          <el-input style="width: 26%; float: left" :placeholder="$t('message.common.SNQueryPrompt')" v-model="SNValue" clearable @change="ClearTime">
          </el-input>
          <el-input style="width: 26%; float: left" :placeholder="$t('message.common.IncludePrompt')" v-model="IncludeValue" clearable
            @change="ClearTime">
          </el-input>
        </div>
        <div>
          <span class="demonstration">{{ $t('message.common.QueryTime') }}</span>
          <el-date-picker v-model="DateTimeValue" type="datetimerange" range-separator="至" :start-placeholder="$t('message.common.StartTime')"
            :end-placeholder="$t('message.common.EndTime')" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" @change="TimeChage()">
          </el-date-picker>
          <!--按钮-->
          <el-button type="warning" :disabled="Saveflag == 1 ? true : false" @click="SaveExcel">{{ $t('message.common.SaveExcel') }}</el-button>
          <el-button type="danger" :disabled="Buttonflag == 1 ? true : false" @click="ClearTable">{{ $t('message.common.ClearPage') }}</el-button>
          <el-button type="success" :disabled="Buttonflag == 1 ? true : false" @click="TestDataQuery">{{ $t('message.common.Query') }}</el-button>
        </div>
        <div>
          <el-input id="MoHu" ref="FuzzyQueryFocus" placeholder="模糊查询" v-model="FuzzyQueryValues"
            :disabled="TestData.length == 0 ? true : false" clearable @input="Fuzzy_query">
          </el-input>
        </div>
      </div>
      <div id="Data">
        <TestDataTable :TestDataTitle="TestDataTitle" :TestDataList="TestData" TableHeight="410px"></TestDataTable>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="CurrentPage"
          :page-sizes="PageSizeInfo" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <TestStatistics :TestStatistics="TestStatistics" :AdverseEvent="DataStatisticsClickEvent"
          id="TestStatisticsTable">
        </TestStatistics>
      </div>
    </div>
    <h2 v-if="SpecifyCategoryDatalag == false || TestFailDataFlag == false" style="text-align: center;margin: 10px;">
      {{ SpecifyCategoryDataTitle }}</h2>
    <!-- 显示指定测试失败项,不良品和重测产品测试数据-->
    <div id="Data" v-if="SpecifyCategoryDatalag == false | TestFailDataFlag == false">
      <TestDataTable style="margin-top: 0.5%;" :TestDataTitle="TestDataTitle" :TestDataList="SpecifyCategoryDataList"
        :TableHeight="TableHeight">
      </TestDataTable>
      <el-pagination v-if="SpecifyCategoryDataTitle != '不良产品数据'" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page="CurrentPage" :page-sizes="PageSizeInfo" :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <TestStatistics v-if="SpecifyCategoryDatalag == false" :TestStatistics="TestStatistics"
        :AdverseEvent="DataStatisticsClickEvent" id="TestStatisticsTable">
      </TestStatistics>
    </div>
    <Echarts v-if="SpecifyCategoryDatalag" myChartIndex="1" myChartName="myChart" :ChartClick="PieChartClickEvent" ref="EchartsChid"></Echarts>
  </el-scrollbar>
</template>
<script>
import TestDataTable from "@/layout/CustomComponents/DataTable.vue"
import TestStatistics from "@/layout/CustomComponents/TestStatistics.vue"
import Echarts from "@/layout/CustomComponents/Echarts.vue"
import store from "@/store";
import {
  Get_Node_Time,
  Get_Data_Table_Name,
  Get_Data_Table_Station,
  Get_Computer_Name,
  Get_Data_Table_Work_Order,
  Get_Test_Data,
  Custom_Query_Test_Data,
  Get_Test_Data_Title,
  Get_Pagination_Test_Data,
  Get_Fuzzy_Query,
  Get_Test_Data_Fail_Statistics_Title,
  Get_Test_Failure_Statistics_Data,
  Get_Test_Failure_Data,
  Save_Test_Data,
  Save_Fuzzy_Query_Test_Data,
  Clear_Test_Data,
  Get_Retest_Test_Data,
  Get_Defective_Test_Data,
} from "@/utils/RequestProcessing/TestDataQueryProcessing";
import {
  Get_User_Model,
  Get_Station
} from "@/utils/RequestProcessing/BackgroundDataProcessing";
import { DefaultTime, Generate_Time, Tips, Generate_Model_Name } from "@/utils/RequestProcessing/GeneralMethod";
import { ElMessage } from "element-plus";
import Moment from 'moment'

export default {
  components: { TestDataTable, TestStatistics, Echarts },
  data() {
    return {
      total: 0, // 总共多少数据
      CurrentPage: 1, // 当前页
      PageSize: 25, // 当前页显示多少条,默认50条
      PageSizeInfo: [25, 50, 75, 100, 150, 200], // 单页显示多少条

      Buttonflag: 1, // 按钮是否禁用
      Saveflag: 1, // 存储按钮状态

      TimeList: [], // 存储时间季度数据
      TableNameList: [], // 存储所有表名
      ModelList: [], // 存储机型名称
      StationList: [], // 存储站别数据
      WorkOrderList: [], // 存储工单数据
      ComputerNumberList: [], // 存储电脑编号数据
      //#region 固定值
      // 存储固定值数据
      FixedValue: [
        {
          value: "True",
        },
        {
          value: "False",
        }
      ],

      // 存储节点数据
      NodeList: [
        {
          value: "第一节点",
        },
        {
          value: "第二节点",
        },
        {
          value: "第三节点",
        },
        {
          value: "第四节点",
        }
      ],
      //#endregion

      TimeValue: "", // 存储选择的时间季度
      ModelValue: "", // 存储选择的机型
      StationValue: "", //存储选择的站别
      WorkordersValue: "", // 存储选择的工单
      NodeValue: "", // 存储选择的节点
      ComputerNumberValue: "", // 存储选择的电脑编号
      ResultValue: "", // 存储选择的测试结果
      DuplicateRemoval: "", // 存储选择的是否去重
      FuzzyQueryValues: "", // 存储模糊查询的内容
      // 时间选择默认值
      DateTimeValue: [],
      CustomQuery: "", // 存储自定义查询语句
      CustomQueryFlag: false,
      SNValue: "",
      IncludeValue: "",

      // 测试数据表数据
      TestDataTitle: [], // 存储测试数据的标题
      TestData: [], // 存储测试数据

      TestFailDataFlag: true, // 失败项目显示Flag
      SpecifyCategoryDataTitle: '', // 存储测试失败项目名称/不良品数据标题或重测产品数据标题
      SpecifyCategoryDataList: [], // 存储失败项目数据/不良品数据和重测产品测试数据
      TestStatistics: [], //存储统计数据
      SpecifyCategoryDatalag: true, // 是否显示不良品或重测产品测试数据Flag
      TableHeight: "" // 存储表格高度
    };
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
      this.DateTimeValue = await DefaultTime();
      this.TableNameList = await Get_Data_Table_Name();
      if (this.TableNameList.length == 0) return;
      this.TimeList = await Generate_Time(this.TableNameList);
      this.TimeValue = this.TimeList[0].Year;
      this.DuplicateRemoval = "False";
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
      await this.GetStation()
    },
    //#endregion

    //#region 获取站别名称
    async GetStation() {
      this.ClearTestData();
      this.StationValue = "";
      this.StationList = [];
      this.StationList = await Get_Station(this.ModelValue);
      if (this.StationList.length == 0) {
        this.StationList = await Get_Data_Table_Station(`${this.ModelValue}_${this.TimeValue}`);
      }
      this.StationValue = this.StationList[0].Station;
      await this.GetComputerName();
    },
    //#endregion

    //#region 获取电脑名称和工单号
    async GetComputerName() {
      this.ClearTestData();
      this.ComputerNumberValue = "";
      this.ComputerNumberList = [];
      this.WorkordersValue = "";
      this.WorkOrderList = [];
      this.ComputerNumberList = await Get_Computer_Name(`${this.ModelValue}_${this.TimeValue}`, this.StationValue);
      if (this.ComputerNumberList.length == 0) {
        ElMessage.warning(`${this.ModelValue} ${this.StationValue}站暂无测试电脑编号信息`);
        this.Buttonflag = 1; // 禁用按钮
        this.Saveflag = 1;
        return;
      }
      this.Buttonflag = 0;
      this.CustomQuery = `${this.ModelValue.replace(/-/g, '_')}_${this.TimeValue} where Station = '${this.StationValue}'`;
      this.WorkOrderList = await Get_Data_Table_Work_Order(`${this.ModelValue}_${this.TimeValue}`, this.StationValue);
    },
    //#endregion

    //#region 节点查询
    async NodeSelect() {
      if (this.ComputerNumberList.length == 0) {
        this.NodeValue = ""
        ElMessage.warning(`${this.ModelValue} ${this.StationValue}站暂无测试数据`);
        return
      }
      this.ClearTestData();
      // 传入选择的节点改变查询时间
      this.DateTimeValue = await Get_Node_Time(this.NodeValue);
    },
    //#endregion

    //#region 自定义查询语句
    Custom_Query_Value() {
      let DefaultCustomQuery = `${this.ModelValue.replace(/-/g, '_')}_${this.TimeValue} where Station = '${this.StationValue}'`;
      if (this.CustomQuery.length == 0) {
        this.CustomQuery = DefaultCustomQuery;
        this.CustomQueryFlag = false;
        return;
      }
      this.CustomQueryFlag = true;
      this.Buttonflag = 0;
    },
    //#endregion

    //#region SN/工单和内容包含查询清空时间
    async ClearTime() {
      this.ClearTestData();
      this.DateTimeValue = [];
      if (
        this.SNValue.length == 0 &&
        this.IncludeValue.length == 0 &&
        this.WorkordersValue.length == 0
      ) {
        this.DateTimeValue = await DefaultTime();
      }
    },
    //#endregion

    //#region 查询数据
    async TestDataQuery() {
      this.Buttonflag = 1; // 禁用按钮
      this.ClearTestData();
      if (this.CustomQueryFlag) {
        this.TestStatistics = await Custom_Query_Test_Data(this.CustomQuery)

      } else {
        let TableName = `${this.ModelValue.replace(/-/g, '_')}_${this.TimeValue}`;
        let DataQueryInfo = new FormData();
        DataQueryInfo.append("TableName", TableName);
        DataQueryInfo.append("Station", this.StationValue);
        DataQueryInfo.append("MachineName", this.ComputerNumberValue);
        DataQueryInfo.append("Result", this.ResultValue);
        DataQueryInfo.append("DuplicateRemoval", this.DuplicateRemoval);
        DataQueryInfo.append("Workorders", this.WorkordersValue);
        DataQueryInfo.append("SN", this.SNValue);
        DataQueryInfo.append("IncludeValue", this.IncludeValue);
        DataQueryInfo.append("StartTime", this.DateTimeValue==null?null:this.DateTimeValue[0]);
        DataQueryInfo.append("EndTime", this.DateTimeValue==null?null:this.DateTimeValue[1]);
        this.TestStatistics = await Get_Test_Data(DataQueryInfo)
      }
      this.Buttonflag = 0; // 启用按钮
      if (this.TestStatistics.length == 0) {
        this.ClearTestData();
        ElMessage.warning(
          `${this.ModelValue} ${this.StationValue} 站当前条件查询数据为空`
        );
        return;
      }
      this.$refs.scroll.wrap.scrollTop = 95;
      await this.LoadData();
      this.Saveflag = 0; // 启用按钮
    },
    //#endregion

    // #region 页面数据加载
    async LoadData() {
      if (this.TestStatistics.length == 0) {
        this.ClearTestData();
        return;
      }
      this.total = this.TestStatistics[0]["测试总次数"]
      this.TestData = await Get_Pagination_Test_Data(
        this.PageSize * (this.CurrentPage - 1),
        this.PageSize
      );
      this.TestDataTitle = await Get_Test_Data_Title(); 2333

      let TestDataFailStatisticsTitle = await Get_Test_Data_Fail_Statistics_Title(); // 获取测试失败项标题
      let TestDataFailureStatisticsList = await Get_Test_Failure_Statistics_Data(); // 获取测试失败项统计数据
      this.$refs.EchartsChid.drawPieTestFail(TestDataFailStatisticsTitle, TestDataFailureStatisticsList);
      this.Buttonflag = 0; // 启用按钮
      return;
    },
    //#endregion

    //#region 模糊查询
    async Fuzzy_query() {
      this.Buttonflag = 1; // 禁用按钮
      this.TestData = []; // 清空测试数据
      if (this.FuzzyQueryValues.length == 0) {
        this.LoadData();
      } else {
        let FuzzyQueryData = await Get_Fuzzy_Query(
          this.FuzzyQueryValues,
          this.PageSize * (this.CurrentPage - 1),
          this.PageSize
        );
        this.total = FuzzyQueryData[0];
        this.TestData = FuzzyQueryData[1]
        if (this.total == 0) ElMessage.warning("暂无该内容数据")
        this.$refs.FuzzyQueryFocus.focus(); // 锁定焦点在模糊查询上
      }
      this.Buttonflag = 0; // 启用按钮
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
      if (this.TestFailDataFlag && this.SpecifyCategoryDatalag) {
        if (this.FuzzyQueryValues.length == 0) {
          this.$refs.EchartsChid.ClearPieChart();
          await this.LoadData();
        }
        else {
          await this.Fuzzy_query();
        }
      } else if (this.SpecifyCategoryDatalag == false) {
        await this.GetRetestTestData();
      }
      else if (this.TestFailDataFlag == false) {
        await this.GetTestFailureData();
      }
    },
    // #endregion

    //#region 测试失败饼图点击事件
    async PieChartClickEvent(FailName) {
      this.TableHeight = "310px";
      this.PageSize = 25;
      this.CurrentPage = 1;
      if (this.SpecifyCategoryDataTitle.indexOf(FailName) == -1) {
        this.PageSizeInfo = [25, 50, 75];
        this.SpecifyCategoryDataTitle = FailName;
        await this.GetTestFailureData();
        setTimeout(() => {
          this.$refs.scroll.wrap.scrollTop = 0;
        }, 5);
      } else {
        this.PageSizeInfo = [25, 50, 75, 100, 150, 200]
        this.TestFailDataFlag = true
        this.SpecifyCategoryDataTitle = "";
        this.total = this.TestStatistics[0]["测试总次数"]
        setTimeout(() => {
          this.$refs.scroll.wrap.scrollTop = 95;
        }, 2);
      }
    },
    //#endregion

    //#region 获取测试失败项目分页数据
    async GetTestFailureData() {
      let TestFailureData = await Get_Test_Failure_Data(this.SpecifyCategoryDataTitle, this.PageSize * (this.CurrentPage - 1),
        this.PageSize)
      this.TestFailDataFlag = false
      this.total = TestFailureData[0]
      this.SpecifyCategoryDataList = TestFailureData[1]
    },
    //#endregion

    //#region 数据统计点击事件
    async DataStatisticsClickEvent(Name) {
      this.PageSize = 25;
      this.CurrentPage = 1;
      if (this.SpecifyCategoryDataTitle.indexOf(Name) == -1) {
        this.PageSizeInfo = [25, 50, 75];
        if (Name == "不良产品数") {
          this.SpecifyCategoryDataList = await Get_Defective_Test_Data()
          if (this.SpecifyCategoryDataList.length == 2) {
            ElMessage.warning('当前暂无不良产品测试数据');
            return;
          } else {
            this.TableHeight = "510px";
            this.SpecifyCategoryDataTitle = "不良产品数据";
          }
        }
        else {
          if (!await this.GetRetestTestData()) return;
        }
        this.SpecifyCategoryDatalag = false
      } else {
        this.PageSizeInfo = [25, 50, 75, 100, 150, 200]
        this.TableHeight = "410px";
        this.total = this.TestStatistics[0]["测试总次数"]
        this.SpecifyCategoryDataTitle = "";
        this.SpecifyCategoryDatalag = true;
        let TestDataFailStatisticsTitle = await Get_Test_Data_Fail_Statistics_Title(); // 获取测试失败项标题
        let TestDataFailureStatisticsList = await Get_Test_Failure_Statistics_Data(); // 获取测试失败项统计数据
        this.$refs.EchartsChid.drawPieTestFail(TestDataFailStatisticsTitle, TestDataFailureStatisticsList);
        setTimeout(() => {
          this.$refs.scroll.wrap.scrollTop = 95;
        }, 2);
      }
    },
    //#endregion

    //#region 获取重测产品测试数据
    async GetRetestTestData() {
      let Retest_Test_Data = await Get_Retest_Test_Data(this.PageSize * (this.CurrentPage - 1),
        this.PageSize)
      if (Retest_Test_Data[0] == 0) {
        ElMessage.warning('当前暂无重测产品测试数据');
        return false;
      } else {
        this.TableHeight = "470px";
        this.SpecifyCategoryDataTitle = "重测产品数据";
        this.total = Retest_Test_Data[0]
        this.SpecifyCategoryDataList = Retest_Test_Data[1];
      }
      return true;
    },
    //#endregion

    //#region 保存测试数据
    async SaveExcel() {
      if (this.FuzzyQueryValues == 0) {
        await Save_Test_Data(this.ModelValue, this.StationValue);
      } else {
        await Tips(`请确认是否保存模糊查询数据，是则保存模糊查询内容，否则保存页面所有内容`).then(async () => {
          await Save_Fuzzy_Query_Test_Data(this.FuzzyQueryValues, this.ModelValue, this.StationValue);
          return;
        }).catch(async () => {
          await Save_Test_Data(this.ModelValue, this.StationValue);
          return;
        })

      }
    },
    //#endregion

    //#region 恢复页面至默认状态
    async ClearTable() {
      await this.ClearTestData();
      // 初始化界面时间选项
      this.DateTimeValue = await DefaultTime();
      this.ComputerNumberValue = "";
      this.NodeValue = "";
      this.ResultValue = "";
      this.SNValue = "";
      this.WorkordersValue = "";
      this.DuplicateRemoval = "False";
      this.FuzzyQueryValues = "";

    },
    //#endregion

    // #region 清空测试数据
    async ClearTestData() {
      await Clear_Test_Data();
      this.TestDataTitle = [];
      this.TestData = [];
      this.TestStatistics = [];
      this.currentPage = 1; // 将页码恢复为1
      this.pagesize = 50; // 将单页显示条数恢复默认
      this.total = 0; // 将分页总数改为0
      this.$refs.EchartsChid.ClearPieChart();
      this.FuzzyQueryValues = "";
      this.Saveflag = 1; // 禁用按钮
      this.CustomQueryFlag = false;
    },
    //#endregion

    //#region 时间选择事件
    async TimeChage() {
      let value = Moment().format('YYYY-MM-DD');
      if (this.DateTimeValue == null) return;
      if (value < this.DateTimeValue[0].split(' ')[0]) {
        ElMessage.warning('查询开始时间不能大于当前日期');
        this.DateTimeValue = await DefaultTime();
        return;
      }
    }
    //#endregion
  },
}
</script>
<style scoped>
@import "./TestDataCss.css";
</style>