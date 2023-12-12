import { GetTestDataFromSN,SaveSNTestData } from "@/api/SNDataQuery";
import { ElMessage } from "element-plus";
import {
  Generate_Limit,
  Get_Test_Data_title,
  ClearTestData,
  GMTToStr,
} from "@/utils/RequestProcessing/GeneralMethod";
//#region 获取指定SN测试数据
export async function Get_Test_Data_From_SN(DataQueryInfo) {
  for (const [key, value] of DataQueryInfo.entries()) {
    // 检查数据是否为空
    if (value === "") {
      ElMessage.error(`${key} 值不能为空`);
      return;
    }
  }
  let res = await GetTestDataFromSN(DataQueryInfo);
  if (res.status != 200) {
    ElMessage.error(`获取指定SN测试数据失败，异常信息${res.message}`);
    return [];
  }
  if (res.data.length == 0) {
    ElMessage.warning(`查询的SN暂无测试数据，请确认SN是否正确或者查询的时间是否正确`);
    return res.data;
  }
  let Station_Data = new Set(res.data.map((x) => x.Station));
  let SN_Test_Data = [];
  for (const StationName of Station_Data) {
    let StationTestdata = res.data.filter((x) => x.Station === StationName);
    // 生成Limit和标题
    let TestDataLimit = await Generate_Limit(StationTestdata[0], true);
    let TestDataTitle = await Get_Test_Data_title();
    StationTestdata = await Generate_Test_Data(StationTestdata);
    StationTestdata.unshift(TestDataLimit[0]);
    StationTestdata.unshift(TestDataLimit[1]);
    let value = [];
    value.push({ Title: TestDataTitle });
    value.push({ StationTestdata: StationTestdata });
    SN_Test_Data.push({ StationName, "Testdata":value });
  }
  return SN_Test_Data;
}

//#endregion

// #region 生成测试数据
export async function Generate_Test_Data(TestData) {
  // 生成测试数据
  let numberValue = 1;
  for (let i = 0; i < TestData.length; i++) {
    let TestLogValue = TestData[i].Testlog.split(/[#,]/);
    let l = 1;
    for (let j = 0; j < TestLogValue.length - 1; j += 5) {
      TestData[i][TestLogValue[j].replace(/[+.-]/g, "") + l] =
        TestLogValue[j + 2];
      l++;
    }
    TestData[i]["number"] = numberValue;
    numberValue++;
    TestData[i]["Time"] = GMTToStr(TestData[i]["Time"]);
    delete TestData[i].Testlog;
  }
  return TestData;
}
//#endregion

//#region 保存SN查询所有测试数据
export async function Save_SN_Test_Data(Model,SNTestData) {
  console.log(SNTestData)
  let SaveSNDataInfo = new FormData();
  SaveSNDataInfo.append("Model",Model)
  SaveSNDataInfo.append("SNTestData",JSON.stringify(SNTestData))
  await SaveSNTestData(Model,SaveSNDataInfo)
}
//#endregion
