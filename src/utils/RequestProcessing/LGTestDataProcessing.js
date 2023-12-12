import {
  GetLGDataTableName,
  GetDataTableLGStation,
  GetLGComputerName,
  GetLGTestData,
  GetJsonFileData,
  SaveLGTestData
} from "@/api/LGTestData";

import {
  Generate_Limit,
  Get_Test_Data_title,
  Generate_Statistical_Data,
  Generate_Test_Data,
  GetTestFailureStatistics,
  GetTestFailureData,
  ClearTestData,
  getFullTime,
} from "@/utils/RequestProcessing/GeneralMethod";
import Enumerable from "linq";
import { ElMessage } from "element-plus";
import Moment from "moment";
import { saveAs } from "file-saver";

// #region 获取测试数据数据库所有表名
export async function Get_LG_Data_Table_Name() {
  let res = await GetLGDataTableName();
  if (res.status != 200) {
    ElMessage.error(`获取数据库所有表名失败，异常信息${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据表名获取LG测试数据表中所有站别
export async function Get_Data_Table_LG_Station(TableName) {
  let res = await GetDataTableLGStation(TableName.replace(/-/g, "_"));
  if (res.status != 200) {
    ElMessage.error(`获取表中所有站别失败，异常信息${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据表名获取LG测试数据表中指定站别所有测试电脑名称
export async function Get_LG_Computer_Name(TableName, Station) {
  let res = await GetLGComputerName(TableName.replace(/-/g, "_"), Station);
  if (res.status != 200) {
    ElMessage.error(
      `获取表中指定站别所有测试电脑编号失败，异常信息${res.message}`
    );
    return [];
  }
  return res.data;
}
//#endregion

//#region 获取指定条件LG测试数据
// 存储查询的数据
var LGTestData = [];
// 存储数据标题
var LGTestDataTitle = [];
// 存储上下限数据
var LGTestDataLimit = [];
// 存储测试失败项统计数据
var LGTestDataFailureStatisticsList = [];
// 存储统计数据
var LGTestDataStatistics = [];
export async function Get_LG_Test_Data(DataQueryInfo) {
  for (const [key, value] of DataQueryInfo.entries()) {
    // 检查数据是否为空
    if (value === ""|| value.indexOf(undefined)==0) {
      // 将空数据替换为null
      DataQueryInfo.set(key, "null");
    }
  }
  let res = await GetLGTestData(DataQueryInfo);
  if (res.status != 200) {
    ElMessage.error(`获取指定条件测试数据失败，异常信息${res.message}`);
    return [];
  }
  if (res.data.length == 0) {
    return res.data;
  }
  LGTestData = res.data;
  // console.log(LGTestData)
  // 生成Limit和标题
  LGTestDataLimit = await Generate_Limit(LGTestData[0], false);
  LGTestDataTitle = await Get_Test_Data_title();
  // 生成测试数据
  LGTestData = await Generate_Test_Data(LGTestData, "LG");
  // 生成统计数据
  LGTestDataStatistics = await Generate_Statistical_Data(
    LGTestData,
    "UID",
    "Status"
  );
  return LGTestDataStatistics;
}
//#endregion

// #region 返回测试数据标题
export async function Get_LG_Test_Data_Title() {
  return LGTestDataTitle;
}
//#endregion

//#region 返回分页测试数据
export async function Get_Pagination_LG_Test_Data(page, pagesize) {
  let result = Enumerable.from(LGTestData).skip(page).take(pagesize).toArray(); // 分页查询;
  result.unshift(LGTestDataLimit[0]);
  result.unshift(LGTestDataLimit[1]);
  return result;
}
//#endregion

//#region 返回LG测试失败统计数据标题
export async function Get_LG_Test_Data_Fail_Statistics_Title() {
  // 生成测试失败项分析数据
  LGTestDataFailureStatisticsList = [];
  var TestFail = await GetTestFailureStatistics();
  LGTestDataFailureStatisticsList = Object.entries(TestFail)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  return LGTestDataFailureStatisticsList.map((element) => element.name);
}
//#endregion

//#region 返回LG测试失败统计数据
export async function Get_LG_Test_Failure_Statistics_Data() {
  return LGTestDataFailureStatisticsList;
}
//#endregion

//#region 返回LG测试失败单项分页测试数据
export async function Get_LG_Test_Failure_Data(TestName, page, pagesize) {
  let TestFailureData = await GetTestFailureData(TestName);
  let res = Enumerable.from(TestFailureData)
    .skip(page)
    .take(pagesize)
    .toArray(); // 分页查询;
  res.unshift(LGTestDataLimit[0]);
  res.unshift(LGTestDataLimit[1]);
  return [TestFailureData.length, res];
}
//#endregion

//#region 获取重测测试数据
export async function Get_Retest_LG_Test_Data(page, pagesize) {
  let Test_Data = Enumerable.from(LGTestData)
    .where((x) => x.UID.search("TE_BZP") == -1)
    .toArray();
  // 获取去除标准码之后产品测试有FALSE记录且最后为TRUE的所有测试数据
  let Retest_Test_Data = Test_Data.filter(
    (item) =>
      item.Status === "F" &&
      Test_Data.some((i) => i.UID === item.UID && i.Status === "P")
  )
    .concat(
      Test_Data.filter(
        (item) =>
          item.Result === "P" &&
          Test_Data.some((i) => i.UID === item.UID && i.Status === "F")
      )
    )
    .sort((a, b) => b.Test_Start_Time.localeCompare(a.Test_Start_Time))
    .sort((a, b) => a.UID.localeCompare(b.UID));
  let res = Enumerable.from(Retest_Test_Data)
    .skip(page)
    .take(pagesize)
    .toArray(); // 分页查询;
  res.unshift(LGTestDataLimit[0]);
  res.unshift(LGTestDataLimit[1]);
  return [Retest_Test_Data.length, res];
}
//#endregion

//#region 获取不良品测试数据
export async function Get_Defective_LG_Test_Data() {
  let Defective_Test_Data = Enumerable.from(LGTestData)
    .where((x) => x.UID.search("TE_BZP") == -1)
    .toArray();
  // 获取去除标准码之后产品测试只有FALSE记录的所有测试数据
  let res = Defective_Test_Data.filter(
    (item) =>
      item.Status === "F" &&
      !Defective_Test_Data.some((i) => i.SN === item.SN && i.Status === "P")
  );
  res.unshift(LGTestDataLimit[0]);
  res.unshift(LGTestDataLimit[1]);
  return res;
}
//#endregion

//#region 清空缓存数据
export async function Clear_LG_Test_Data() {
  await ClearTestData();
  // 清空存储查询的数据
  LGTestData = [];
  // 清空存储数据标题
  LGTestDataTitle = [];
  // 清空存储上下限数据
  LGTestDataLimit = [];
  // 清空存储测试失败项统计数据
  LGTestDataFailureStatisticsList = [];
  // 清空存储统计数据
  LGTestDataStatistics = [];
}
//#endregion

//#region 保存页面LG数据
export async function Save_LG_Test_Data(Model,DataQueryInfo) {
  console.log(DataQueryInfo)
  if (LGTestData.length == 0) {
      let result = await Get_LG_Test_Data(DataQueryInfo);
      if (result.length ==0) return result;
  }
  let SaveLGDataInfo = {
    Model: Model,
    StartTime:DataQueryInfo.get("StartTime"),
    EndTime:DataQueryInfo.get("EndTime"),
    TestData: LGTestData,
    TestDataStatistics: LGTestDataStatistics,
    TestFailStatistics: LGTestDataFailureStatisticsList,
  };
  let fileName = `${Model}_${DataQueryInfo.get("Station")}_LogiData.zip`;
  await (SaveLGTestData(fileName,SaveLGDataInfo))
}
//#endregion

// #region 保存json文件
export async function Save_Json(ModelName, DataQueryInfo) {
  let jsonValue = [];
  for (const [key, value] of DataQueryInfo.entries()) {
    // 检查数据是否为空
    if (value === "") {
      // 将空数据替换为null
      DataQueryInfo.set(key, "null");
    }
  }
  let res = await GetJsonFileData(DataQueryInfo);
  if (res.status != 200) {
    ElMessage.error(`获取指定条件测试数据失败，异常信息${res.message}`);
    return [];
  }
  if (res.data.length == 0) {
    return res.data;
  }
  let Time = Moment(getFullTime(res.data[0]["Test_Start_Time"])).format(
    "YYMMDD"
  );
  let fileName = `${res.data[0]["Project"]}_${res.data[0]["Stage"]}_${res.data[0]["Station"]}__${Time}_${res.data[0]["MachineName"]}_01.json`;
  console.log(fileName);
  let value = 1;
  let TestLogValue = res.data[0].Testlog.split(/[#,]/);
  let ItemValue = {};
  for (let j = 0; j < TestLogValue.length - 1; j += 5) {
    ItemValue[TestLogValue[j].replace(/[\\/\-+.,，]/g, "")] = {
      U_Limit: TestLogValue[j + 4].replace(/^\s*|\s*$/g, ""),
      L_Limit: TestLogValue[j + 3].replace(/^\s*|\s*$/g, ""),
      EID: `E${(Array(3).join("0") + value).slice(-3)}`,
      Description: TestLogValue[j].replace(/[\\/\-+.,，]/g, ""),
    };
    value++;
  }
  jsonValue.push({
    TestPlan: ModelName,
    BU: res.data[0]["BU"],
    Project: res.data[0]["Project"],
    Station: res.data[0]["Station"],
    Stage: res.data[0]["Stage"],
    oemSource: res.data[0]["oemSource"],
    Items: ItemValue,
  });
  // 存储json文件
  // console.log(jsonValue[0],JSON.stringify(jsonValue[0],null,2))
  var content = JSON.stringify(jsonValue[0], null, 2);
  var blob = new Blob([content], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, fileName);
}
//#endregion
