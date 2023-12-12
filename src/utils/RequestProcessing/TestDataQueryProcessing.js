import {
  GetDataTableName,
  GetDataTableStation,
  GetComputerName,
  GetDataTableWorkOrder,
  GetTestData,
  CustomQuery,
  SaveTestData,
  SaveFuzzyQueryTestData,
} from "@/api/TestDataQuery";
import {
  timeStr,
  DefaultTime,
  Generate_Limit,
  Get_Test_Data_title,
  Generate_Statistical_Data,
  Generate_Test_Data,
  GetTestFailureStatistics,
  GetTestFailureData,
  ClearTestData,
} from "@/utils/RequestProcessing/GeneralMethod";
import Enumerable from "linq";
import { ElMessage } from "element-plus";

// #region 获取选取的节点时间
export async function Get_Node_Time(NodeValue) {
  let DateTimeValue = "";
  if (NodeValue.indexOf("第一节点") != -1) {
    DateTimeValue = [
      await timeStr(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            8 * 60 * 60 * 1000
        )
      ),
      await timeStr(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            10 * 60 * 60 * 1000
        )
      ),
    ];
  } else if (NodeValue.indexOf("第二节点") != -1) {
    DateTimeValue = [
      await timeStr(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            10 * 60 * 60 * 1000
        )
      ),
      await timeStr(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            12 * 60 * 60 * 1000
        )
      ),
    ];
  } else if (NodeValue.indexOf("第三节点") != -1) {
    DateTimeValue = [
      await timeStr(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            12 * 60 * 60 * 1000
        )
      ),
      await timeStr(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            16 * 60 * 60 * 1000
        )
      ),
    ];
  } else if (NodeValue.indexOf("第四节点") != -1) {
    DateTimeValue = [
      await timeStr(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            16 * 60 * 60 * 1000
        )
      ),
      await timeStr(
        new Date(
          new Date(new Date().toLocaleDateString()).getTime() +
            19 * 60 * 60 * 1000 +
            600000
        )
      ),
    ];
  } else {
    DateTimeValue = await DefaultTime();
  }
  return DateTimeValue;
}
//#endregion

// #region 获取测试数据数据库所有表名
export async function Get_Data_Table_Name() {
  let res = await GetDataTableName();
  if (res.status != 200) {
    ElMessage.error(`获取数据库所有表名失败，异常信息${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据表名获取表中所有站别
export async function Get_Data_Table_Station(TableName) {
  let res = await GetDataTableStation(TableName.replace(/-/g, "_"));
  if (res.status != 200) {
    ElMessage.error(`获取表中所有站别失败，异常信息${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据表名获取表中指定站别所有测试电脑编号
export async function Get_Computer_Name(TableName, Station) {
  let res = await GetComputerName(TableName.replace(/-/g, "_"), Station);
  if (res.status != 200) {
    ElMessage.error(
      `获取表中指定站别所有测试电脑编号失败，异常信息${res.message}`
    );
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据表名获取表中指定站别所有工单
export async function Get_Data_Table_Work_Order(TableName, Station) {
  let res = await GetDataTableWorkOrder(TableName.replace(/-/g, "_"), Station);
  if (res.status != 200) {
    ElMessage.error(`获取表中所有站别失败，异常信息${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 获取指定条件测试数据
// 存储查询的数据
var TestData = [];
// 存储数据标题
var TestDataTitle = [];
// 存储上下限数据
var TestDataLimit = [];

// 存储测试失败项统计数据
var TestDataFailureStatisticsList = [];
// 存储统计数据
var TestDataStatistics = [];
export async function Get_Test_Data(DataQueryInfo) {
  for (const [key, value] of DataQueryInfo.entries()) {
    // 检查数据是否为空
    if (value === "" || value.indexOf(undefined)==0) {
      // 将空数据替换为null
      DataQueryInfo.set(key, "null");
    }
  }
  let res = await GetTestData(DataQueryInfo);
  if (res.status != 200) {
    ElMessage.error(`获取指定条件测试数据失败，异常信息${res.message}`);
    return [];
  }
  if (res.data.length == 0) {
    return res.data;
  }
  await Analyze_Test_Data(res.data);
   return TestDataStatistics;
}
//#endregion

//#region 自定义查询
export async function Custom_Query_Test_Data(Sql) {
  let res = await CustomQuery(Sql);
  if (res.status != 200) {
    ElMessage.error(`获取自定义条件查询测试数据失败，异常信息${res.message}`);
    return [];
  }
  if (res.data.length == 0) {
    ElMessage.warning(`当前自定义查询数据为空`);
    return [];
  }
  await Analyze_Test_Data(res.data);
  return TestDataStatistics;
}
//#endregion

//#region 解析测试数据
export async function Analyze_Test_Data(TestDataInfo) {
  TestData = TestDataInfo;
  // 生成Limit和标题
  TestDataLimit = await Generate_Limit(TestData[0], true);
  TestDataTitle = await Get_Test_Data_title();
  // 生成统计数据
  TestDataStatistics = await Generate_Statistical_Data(
    TestData,
    "SN",
    "Result"
  );
  // 生成测试数据
  TestData = await Generate_Test_Data(TestData, "Data");
}
//#endregion

// #region 返回测试数据标题
export async function Get_Test_Data_Title() {
  return TestDataTitle;
}
//#endregion

//#region 返回分页测试数据
export async function Get_Pagination_Test_Data(page, pagesize) {
  let result = Enumerable.from(TestData).skip(page).take(pagesize).toArray(); // 分页查询;
  result.unshift(TestDataLimit[0]);
  result.unshift(TestDataLimit[1]);
  return result;
}
//#endregion

//#region 返回模糊查询数据
export async function Get_Fuzzy_Query(Condition, page, pagesize) {
  let FuzzyQueryData = Enumerable.from(TestData)
    .where(
      (x) =>
        x.SN.indexOf(Condition) != -1 ||
        x.Result.indexOf(Condition) != -1 ||
        x.Time.indexOf(Condition) != -1 ||
        x.workorders.indexOf(Condition) != -1 ||
        x.MachineName.indexOf(Condition) != -1 ||
        x.Testlog.indexOf(Condition) != -1
    )
    .toArray();
  let res = Enumerable.from(FuzzyQueryData).skip(page).take(pagesize).toArray(); // 分页查询;
  res.unshift(TestDataLimit[0]);
  res.unshift(TestDataLimit[1]);
  return [FuzzyQueryData.length, res];
}
//#endregion

//#region 返回测试失败统计数据标题
export async function Get_Test_Data_Fail_Statistics_Title() {
  // 生成测试失败项分析数据
  TestDataFailureStatisticsList = [];
  var TestFail = await GetTestFailureStatistics();
  TestDataFailureStatisticsList = Object.entries(TestFail)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  return TestDataFailureStatisticsList.map((element) => element.name);
}
//#endregion

//#region 返回测试失败统计数据
export async function Get_Test_Failure_Statistics_Data() {
  return TestDataFailureStatisticsList;
}
//#endregion

//#region 返回测试失败单项分页测试数据
export async function Get_Test_Failure_Data(TestName, page, pagesize) {
  let TestFailureData = await GetTestFailureData(TestName);
  let res = Enumerable.from(TestFailureData)
    .skip(page)
    .take(pagesize)
    .toArray(); // 分页查询;
  res.unshift(TestDataLimit[0]);
  res.unshift(TestDataLimit[1]);
  return [TestFailureData.length, res];
}
//#endregion

//#region 获取重测测试数据
export async function Get_Retest_Test_Data(page, pagesize) {
  let Test_Data = Enumerable.from(TestData)
    .where((x) => x.SN.search("TE_BZP") == -1)
    .toArray();
  // 获取去除标准码之后产品测试有FALSE记录且最后为TRUE的所有测试数据
  let Retest_Test_Data = Test_Data.filter((item) =>item.Result === "False" &&
      Test_Data.some((i) => i.SN === item.SN && i.Result === "True"))
    .concat(
      Test_Data.filter(
        (item) =>
          item.Result === "True" &&
          Test_Data.some((i) => i.SN === item.SN && i.Result === "False")
      )
    )
    .sort((a, b) => b.Time.localeCompare(a.Time))
    .sort((a, b) => a.SN.localeCompare(b.SN));
  let res = Enumerable.from(Retest_Test_Data)
    .skip(page)
    .take(pagesize)
    .toArray(); // 分页查询;
  res.unshift(TestDataLimit[0]);
  res.unshift(TestDataLimit[1]);
  return [Retest_Test_Data.length, res];
}
//#endregion

//#region 获取不良品测试数据
export async function Get_Defective_Test_Data() {
  let Defective_Test_Data = Enumerable.from(TestData)
    .where((x) => x.SN.search("TE_BZP") == -1)
    .toArray();
  // 获取去除标准码之后产品测试只有FALSE记录的所有测试数据
  let res = Defective_Test_Data.filter(
    (item) =>
      item.Result === "False" &&
      !Defective_Test_Data.some((i) => i.SN === item.SN && i.Result === "True")
  );
  res.unshift(TestDataLimit[0]);
  res.unshift(TestDataLimit[1]);
  return res;
}
//#endregion

//#region 清空缓存数据
export async function Clear_Test_Data() {
  await ClearTestData();
  // 存储查询的数据
  TestData = [];
  // 存储数据标题
  TestDataTitle = [];
  // 存储上下限数据
  TestDataLimit = [];
  // 存储测试失败项统计数据
  TestDataFailureStatisticsList = [];
  // 存储统计数据
  TestDataStatistics = [];
}
//#endregion

//#region 保存测试数据
export async function Save_Test_Data(Model, Station) {

  let SaveDataInfo = {
    Model: Model,
    TestData: TestData,
    TestDataTitle: TestDataTitle,
    TestDataLimit: TestDataLimit,
    TestDataStatistics: TestDataStatistics,
    TestFailStatistics: TestDataFailureStatisticsList,
  };
  let FileName = Model.toUpperCase() + "-" + Station.toUpperCase();
  let res = await SaveTestData(FileName, SaveDataInfo);
}
//#endregion

//#region 保存模糊查询的测试数据
export async function Save_Fuzzy_Query_Test_Data(Condition, Model, Station) {
  let FuzzyQueryData = Enumerable.from(TestData)
    .where(
      (x) =>
        x.SN.indexOf(Condition) != -1 ||
        x.Result.indexOf(Condition) != -1 ||
        x.Time.indexOf(Condition) != -1 ||
        x.workorders.indexOf(Condition) != -1 ||
        x.MachineName.indexOf(Condition) != -1 ||
        x.Testlog.indexOf(Condition) != -1
    )
    .toArray();
  let DataInfo = {
    Model: Model,
    TestData: FuzzyQueryData,
    TestDataTitle: TestDataTitle,
    TestDataLimit: TestDataLimit,
  };
  let FileName = Model.toUpperCase() + "-" + Station.toUpperCase();
  let res = await SaveFuzzyQueryTestData(FileName, DataInfo);
}
//#endregion