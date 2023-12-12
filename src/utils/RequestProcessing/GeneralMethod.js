import Enumerable from "linq";
// 导入格式化时间包
import Moment from "moment";
import { ElMessageBox } from "element-plus";

//#region 弹窗提示是否继续
export function Tips(text) {
  return ElMessageBox.confirm(text, "提示", {
    cancelButtonText: "否",
    confirmButtonText: "是",
    type: "warning",
  });
}
//#endregion

//#region 界面时间选择器默认时间
export async function DefaultTime() {
  return [
    await timeStr(
      new Date(
        new Date(new Date().toLocaleDateString()).getTime() + 8 * 60 * 60 * 1000
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
}
//#endregion

// #region 根据表名生成年份季度数据
export function Generate_Time(TableName) {
  let Time = [];
  if (TableName.length > 0) {
    for (var i = 0; i < TableName.length; i++) {
      // 得到当前表名中所有的时间
      var Year =
        TableName[i].table_name.split("_")[
          TableName[i].table_name.split("_").length - 2
        ] +
        "_" +
        TableName[i].table_name.split("_")[
          TableName[i].table_name.split("_").length - 1
        ];
      Time.push(Year);
    }
  }
  Time = unique(Time).sort().reverse();
  let YearQuarter = [];
  Time.forEach((element) => {
    YearQuarter.push({
      Year: element,
      FormatYear: `${element.split("_")[0]}年第${element.split("_")[1]}季度`,
    });
  });
  return YearQuarter;
}
//#endregion

// #region 根据表名生成选择的年份和季度对应机型名称
export async function Generate_Model_Name(TimeValue, TableName) {
  let result = [];
  TableName.forEach((table) => {
    if (table.table_name.includes(TimeValue)) {
      let ModelName = table.table_name.split("_").slice(0, -2).join("-");
      ModelName =
        ModelName.split("-").length <= 2
          ? ModelName
          : ModelName.replace(/-/g, "_");
      result.push(ModelName);
    }
  });
  return result;
}
//#endregion

//#region 根据表名格式化机型名称
export function FormatModelName(TableName) {
  let name = "";
  for (let index = 0; index < TableName.split("_").length - 2; index++) {
    if (name.length > 0) name += "-";
    name += TableName.split("_")[index];
  }
  return name.split("-").length <= 2 ? name : name.replace("-", "_");
}
//#endregion

// #region  生成标题数据和Limit数据区域
// 存储数据标题
var TestDataTitle = [];
// 生成Limit数据和标题数据并返回Limit数据
export async function Generate_Limit(TestData, flag) {
  TestDataTitle = []; // 清空原有标题数据
  var DataLimitValues = []; // 存储上下限数据
  let limitValue = [];
  let resultName;
  if (flag) {
    resultName = "Result";
    TestDataTitle = [
      {
        label: "SN",
        prop: "SN",
      },
      {
        label: "时间",
        prop: "Time",
      },
      {
        label: "结果",
        prop: "Result",
      },
    ];
    // 生成limit固定数据
    limitValue = [
      {
        testItemName: "SN",
        result: "NUll",
      },
      {
        testItemName: "Time",
        result: "NUll",
      },
    ];
  } else {
    resultName = "Status";
    TestDataTitle = [
      {
        label: "序号",
        prop: "number",
      },
      {
        label: "Logi站别",
        prop: "Station",
      },
      {
        label: "时间",
        prop: "Test_Start_Time",
      },
      {
        label: "状态",
        prop: "Stage",
      },
      {
        label: "结果",
        prop: "Status",
      },
    ];
    limitValue = [
      {
        testItemName: "number",
        result: "N/A",
      },
      {
        testItemName: "Station",
        result: "N/A",
      },
      {
        testItemName: "Test_Start_Time",
        result: "N/A",
      },
      {
        testItemName: "Stage",
        result: "N/A",
      },
    ];
  }
  let TestDataUpperLimit = {};
  let TestDataLowerLimit = {};
  limitValue.forEach((item) => {
    TestDataLowerLimit[item["testItemName"]] = item["result"];
    TestDataUpperLimit[item["testItemName"]] = item["result"];
  });
  TestDataLowerLimit[resultName] = "下限";
  TestDataUpperLimit[resultName] = "上限";
  let value = 1;
  // 生成标题，上限和下限数据
  let TestLogValue = TestData.Testlog.split(/[#,]/);
  for (let j = 0; j < TestLogValue.length - 1; j += 5) {
    let DataName = TestLogValue[j].replace(/[\\/\-+.,，]/g, "");
    if (flag) {
      DataName = TestLogValue[j].replace(/[\\/\-+.,，]/g, "") + value;
    }
    // 添加标题数据
    TestDataTitle.push({
      label: value + "-" + TestLogValue[j].replace(/[\\/\-+.,，]/g, ""),
      prop: DataName,
    });

    // 添加下限数据
    TestDataLowerLimit[DataName] =
      TestLogValue[j + 3].trim().length != 0 ? TestLogValue[j + 3] : "N/A";
    // 添加上限数据
    TestDataUpperLimit[DataName] =
      TestLogValue[j + 4].trim().length != 0 ? TestLogValue[j + 4] : "N/A";
    value++;
  }
  if (flag) {
    TestDataTitle.push(
      {
        label: "站别",
        prop: "Station",
      },
      {
        label: "工单",
        prop: "workorders",
      },
      {
        label: "测试电脑",
        prop: "MachineName",
      },
      {
        label: "测试时间(S)",
        prop: "TestTime",
      }
    );
    limitValue = [
      {
        testItemName: "Station",
        result: "NUll",
      },
      {
        testItemName: "workorders",
        result: "NUll",
      },
      {
        testItemName: "MachineName",
        result: "NUll",
      },
      {
        testItemName: "TestTime",
        result: "NUll",
      },
    ];
  } else {
    TestDataTitle.push(
      {
        label: "工单",
        prop: "workorders",
      },
      {
        label: "测试电脑",
        prop: "MachineName",
      },
      {
        label: "系统名称",
        prop: "MesName",
      },
      {
        label: "测试时间(S)",
        prop: "Test_Duration",
      }
    );
    limitValue = [
      {
        testItemName: "workorders",
        result: "NUll",
      },
      {
        testItemName: "MachineName",
        result: "NUll",
      },
      {
        testItemName: "MesName",
        result: "NUll",
      },
      {
        testItemName: "Test_Duration",
        result: "NUll",
      },
    ];
  }
  limitValue.forEach((item) => {
    TestDataLowerLimit[item["testItemName"]] = item["result"];
    TestDataUpperLimit[item["testItemName"]] = item["result"];
  });
  DataLimitValues.push(TestDataLowerLimit);
  DataLimitValues.push(TestDataUpperLimit);
  return DataLimitValues;
}

// 返回测试数据标题
export async function Get_Test_Data_title() {
  return TestDataTitle;
}
//#endregion

// #region 生成测试数据和统计测试失败项
var TestFailureStatistics = []; // 存储测试失败项统计
var TestFailureData = {};
export async function Generate_Test_Data(TestData, name) {
  TestFailureStatistics = [];
  TestFailureData = {};
  // 生成测试数据
  let numberValue = 1;
  for (let i = 0; i < TestData.length; i++) {
    let FalseFlag = true;
    let TestLogValue = TestData[i].Testlog.split(/[#,]/);
    let l = 1;
    for (let j = 0; j < TestLogValue.length - 1; j += 5) {
      // 获取测试项失败统计
      if (FalseFlag) {
        if (TestLogValue[j + 1] == "F") {
          FalseFlag = false;
          let TestName = TestLogValue[j];
          if (TestFailureStatistics.hasOwnProperty(TestName)) {
            TestFailureStatistics[TestName] =
              TestFailureStatistics[TestName] + 1;
            TestFailureData[TestName].push(TestData[i]);
          } else {
            TestFailureStatistics[TestName] = 1;
            TestFailureData[TestName] = [TestData[i]];
          }
        }
      }
      if (name == "LG") {
        let resultValue =
          TestLogValue[j + 2] == "True" ? "Pass" : TestLogValue[j + 2];
        TestData[i][TestLogValue[j].replace(/[\\/\-+.,，]/g, "")] = resultValue;
      } else {
        TestData[i][TestLogValue[j].replace(/[\\/\-+.,，]/g, "") + l] =
          TestLogValue[j + 2];
      }
      l++;
    }
    TestData[i]["number"] = numberValue;
    numberValue++;
    if (name == "LG") {
      TestData[i]["Test_Start_Time"] = getFullTime(
        TestData[i]["Test_Start_Time"]
      );
    } else {
      TestData[i]["Time"] = GMTToStr(TestData[i]["Time"]);
    }
    // delete TestData[i].Testlog;
  }
  // console.log(myDate.toLocaleString())
  return TestData;
}
export async function GetTestFailureStatistics() {
  return TestFailureStatistics;
}

export async function GetTestFailureData(TestName) {
  return TestFailureData[TestName];
}
//#endregion

//#region 生成统计数据
export async function Generate_Statistical_Data(res, SN, result) {
  var DataCountData = [];
  var FalseValue = "";
  var TrueValue = "";
  if (SN == "UID") {
    FalseValue = "F";
    TrueValue = "P";
  } else {
    FalseValue = "False";
    TrueValue = "True";
  }
  // 测试记录
  // 存储测试总次数
  let Total_number_of_tests = res.length;
  // 存储测试失败总次数
  let Number_of_test_failures = Enumerable.from(res)
    .where((x) => x[result] == FalseValue)
    .toArray().length;
  // 存储测试成功总次数
  let Test_success_times = Total_number_of_tests - Number_of_test_failures;

  // 测试产品
  // 存储去除特殊条码的测试数据
  let test_data = Enumerable.from(res)
    .where((x) => x[SN].search("TE_BZP") == -1)
    .toArray();
  // 存储测试产品数
  // let Total_number_of_products_tested = Enumerable.from(test_data)
  //   .distinct((x) => x[SN])
  //   .toArray().length;
  let Total_number_of_products_tested = new Set(test_data.map((x) => x[SN]))
    .size;
  // 得到去除特殊条码测试为Pass并以SN去重的所有数据
  let Test_product_pass_data = Enumerable.from(test_data)
    .where((x) => x[result] == TrueValue)
    .select((x) => x[SN])
    .distinct()
    .toArray();
  // 得到去除特殊条码测试为Fail并以SN去重的所有数据
  let Test_product_Fail_data = Enumerable.from(test_data)
    .where((x) => x[result] == FalseValue)
    .select((x) => x[SN])
    .distinct()
    .toArray();
  // 直通产品数
  let Number_of_direct_products = Enumerable.from(Test_product_pass_data)
    .except(Test_product_Fail_data)
    .toArray().length; // 存储通过计算Pass和Fail集合的差集得到直通产品数
  // 不良产品数
  let Defective_products = Enumerable.from(Test_product_Fail_data)
    .except(Test_product_pass_data)
    .toArray();
  //  console.log("不良产品数据", Defective_products);
  let Number_of_defective_products = Defective_products.length; // 存储通过计算Fail和Pass集合的差集得到不良产品数
  // 重测产品数
  let Total_number_of_retests =
    Test_product_Fail_data.length - Number_of_defective_products; // 存储使用Fail记录的总数减去不良产品数得到重测产品数

  // 存储计算的直通率(直通产品数/测试产品数)
  let Pass_through_rate = (
    (Number_of_direct_products / Total_number_of_products_tested) *
    100
  ).toFixed(2);
  if (isNaN(Pass_through_rate)) Pass_through_rate = 0;
  // 存储计算的重测率(新)(重测产品数/测试产品数)
  let Retest_rate_new = (
    (Total_number_of_retests / Total_number_of_products_tested) *
    100
  ).toFixed(2);
  if (isNaN(Retest_rate_new)) Retest_rate_new = 0;
  // 存储计算的不良率(不良产品数/测试产品数)
  let Defective_rate = (
    (Number_of_defective_products / Total_number_of_products_tested) *
    100
  ).toFixed(2);
  if (isNaN(Defective_rate)) Defective_rate = 0;
  // 得到重测总次数
  let Retest_times = test_data.length - Total_number_of_products_tested;
  // 统计测试重测率
  let Retest_rate_old = (
    (Retest_times / Total_number_of_products_tested) *
    100
  ).toFixed(2);
  if (isNaN(Retest_rate_old)) Retest_rate_old = 0;
  let Engineering_barcode_times = Enumerable.from(res)
    .where((x) => x[SN].search("TE_BZP_EN") != -1)
    .toArray().length; // 存储工程专用条码测试次数
  let Quality_bar_code_times = Enumerable.from(res)
    .where((x) => x[SN].search("TE_BZP_QC") != -1)
    .toArray().length; // 存储品质专用条码测试次数
  let Manufacturing_barcode_times = Enumerable.from(res)
    .where((x) => x[SN].search("TE_BZP_MF") != -1)
    .toArray().length; // 存储制造专用条码测试次数
  let Te_BZP_Count = Enumerable.from(res)
    .where((x) => x[SN].search("TE_BZP") != -1)
    .toArray().length; // 存储TE_BZP测试总次数
  DataCountData = [
    {
      测试产品数: Total_number_of_products_tested,
      直通产品数: Number_of_direct_products,
      重测产品数: Total_number_of_retests,
      不良产品数: Number_of_defective_products,
      直通率: Pass_through_rate + "%",
      "重测率(新)": Retest_rate_new + "%",
      "重测率(旧)": Retest_rate_old + "%",
      不良率: Defective_rate + "%",
      测试总次数: Total_number_of_tests,
      测试成功总次数: Test_success_times,
      测试失败总次数: Number_of_test_failures,
      包含TE_BZP测试总次数: Te_BZP_Count,
      工程专用条码测试次数: Engineering_barcode_times,
      品质专用条码测试次数: Quality_bar_code_times,
      制造专用条码测试次数: Manufacturing_barcode_times,
    },
  ];
  return DataCountData;
}
export async function Get_Statistical_Data_Title() {
  return [
    {
      label: "直通率",
      prop: "直通率",
    },
    {
      label: "重测率(新)",
      prop: "重测率(新)",
    },
    {
      label: "重测率(旧)",
      prop: "重测率(旧)",
    },
    {
      label: "不良率",
      prop: "不良率",
    },
    {
      label: "测试总次数",
      prop: "测试总次数",
    },
    {
      label: "测试成功总次数",
      prop: "测试成功总次数",
    },
    {
      label: "测试失败总次数",
      prop: "测试失败总次数",
    },
    {
      label: "测试产品数",
      prop: "测试产品数",
    },
    {
      label: "直通产品数",
      prop: "直通产品数",
    },
    {
      label: "重测产品数",
      prop: "重测产品数",
    },
    {
      label: "不良产品数",
      prop: "不良产品数",
    },
    {
      label: "包含TE_BZP测试总次数",
      prop: "包含TE_BZP测试总次数",
    },
    {
      label: "工程专用条码测试次数",
      prop: "工程专用条码测试次数",
    },
    {
      label: "品质专用条码测试次数",
      prop: "品质专用条码测试次数",
    },
    {
      label: "制造专用条码测试次数 ",
      prop: "制造专用条码测试次数",
    },
  ];
}

//#endregion

//#region 清除缓存数据
export async function ClearTestData() {
  TestDataTitle = []; // 清空原有标题数据
  TestFailureStatistics = [];
  TestFailureData = {};
}
//#endregion

// #region 将时间戳转换为日期
export function getFullTime(timeStamp) {
  const stamp = new Date(timeStamp * 1000);
  const time = Moment(stamp).format("YYYY-MM-DD HH:mm:ss");
  return time;
}
// #endregion

// #region 格式化时间
//格式化--时间
export async function timeStr(dataStr) {
  var date = new Date(dataStr);
  var y = date.getFullYear();

  // 获得月
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;

  // 获得日
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;

  // 获得小时
  var h = date.getHours();
  h = h < 10 ? "0" + h : h;

  //获得分
  var mm = date.getMinutes();
  mm = mm < 10 ? "0" + mm : mm;

  //获得秒
  var ss = date.getSeconds();
  ss = ss < 10 ? "0" + ss : ss;

  return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + ss;
}
//#endregion

// #region 去除数组重复值
export function unique(arr) {
  let hash = [];
  for (let i = 0; i < arr.length; i++) {
    if (hash.indexOf(arr[i]) === -1) {
      hash.push(arr[i]);
    }
  }
  return hash;
}
//#endregion

// #region 格式化测试数据时间
export function GMTToStr(time) {
  if (time.indexOf("上午") != -1) {
    time = time.replace("上午", "");
    let date = new Date(time);
    let yaer = date.getFullYear();
    let mouth =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return `${yaer}-${mouth}-${day} ${hours}:${minutes}:${seconds}`;
  } else if (time.indexOf("下午") != -1) {
    time = time.replace("下午", "");
    let date = new Date(time);
    let yaer = date.getFullYear();
    let mouth =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hours =
      date.getHours() < 12 ? Number(date.getHours() + 12) : date.getHours();
    let minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return `${yaer}-${mouth}-${day} ${hours}:${minutes}:${seconds}`;
  } else {
    let date = new Date(time);
    let yaer = date.getFullYear();
    let mouth =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return `${yaer}-${mouth}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
//#endregion
