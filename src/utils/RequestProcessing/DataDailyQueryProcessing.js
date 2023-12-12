import {
  GetDailyTableName,
  GetModelFromYear,
  GetDailyData,
  GetDailyReportData,
  SaveDailyReport
} from "@/api/DataDailyQuery";
import { GetTestData } from "@/api/TestDataQuery";
import { GetStation } from "@/api/BackgroundData";
import { Generate_Statistical_Data,GMTToStr } from "@/utils/RequestProcessing/GeneralMethod";
import { ElMessage } from "element-plus";
import Moment from "moment";


//#region 获取有数据日报的年份信息
export async function Get_Year_Value() {
  let Year = [];
  let res = await GetDailyTableName();
  if (res.status != 200) {
    ElMessage.error(`获取数据日报的年份信息失败，异常信息${res.message}`);
    return [];
  }
  res.data.forEach((element) => {
    if (
      element.table_name.indexOf("test_statistics_") != -1 ||
      element.table_name.indexOf("Test_Statistics") != -1
    ) {
      Year.push(element.table_name.split("_")[2] + "年");
    }
  });
  return Year.sort().reverse();
}
//#endregion

// #region 根据选择的年份获取当年所有有数据的机型
export async function Get_Model_From_Year(Year) {
  let res = await GetModelFromYear(Year);
  if (res.status != 200) {
    ElMessage.error(`获取当年所有有数据的机型失败，异常信息${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 查询指定机型指定时间段日报表数据
export async function Get_Daily_Data_Query(Year, Model, StartTime, EndTime) {
  let DataInfo = new FormData();
  DataInfo.append("Year", Year);
  DataInfo.append("Model", Model);
  DataInfo.append("StartTime", StartTime);
  DataInfo.append("EndTime", EndTime);
  let res = await GetDailyData(DataInfo);
  if (res.status != 200) {
    ElMessage.error(
      `查询指定机型指定时间段日报表数据失败，异常信息${res.message}`
    );
    return [];
  }
  if (res.data.length == 0) {
    ElMessage.warning(`当前条件下暂无日报表数据`);
    return [];
  }
  let DataResult = [];
  // 获取唯一站别，去重
  let Station = new Set(res.data.map((item) => item.Station));
  // 遍历站别得到该站的所有日报数据
  Station.forEach((station) => {
    let Data = res.data.filter((item) => item.Station === station);
    if (Data.length == 0) return;
    DataResult.push({
      [station]: Data,
    });
  });
  return DataResult;
}
//#endregion

// #region 查询单日报表数据通用方法
export async function Get_daily_report_data(Year, Model, StartTime) {
  let DataResult = []; // 存储机型所有日报数据
  let DataValue = []; // 存储单站日报数据
  let NowDate = Moment().format("YYYY-MM-DD");
  // 判定选择的日期是否为当前日期
  if (NowDate == StartTime) {
    let year = Moment().format("YY");
    let currMonth = Moment().format("MM"); //获取当前月份(0-11,0代表1月)
    let currQuarter = Math.floor(
      currMonth % 3 == 0 ? currMonth / 3 : currMonth / 3 + 1
    ); // 计算当前季度
    let TableName = `${Model.replace("-", "_")}_${year}_${currQuarter}`;
    let Station = await GetStation(Model);
    if (Station.status != 200) {
      ElMessage.error(
        `获取后台有上传测试数据的站别失败，异常信息${res.message}`
      );
      return [];
    }
    for(let index in Station.data){
      DataValue = [];
      let DataQueryInfo = new FormData();
      DataQueryInfo.append("TableName", TableName);
      DataQueryInfo.append("Station", Station.data[index].Station);
      DataQueryInfo.append("MachineName", "null");
      DataQueryInfo.append("Result", "null");
      DataQueryInfo.append("DuplicateRemoval", "False");
      DataQueryInfo.append("Workorders", "null");
      DataQueryInfo.append("SN", "null");
      DataQueryInfo.append("IncludeValue", "null");
      DataQueryInfo.append("StartTime", `${NowDate} 08:00:00`);
      DataQueryInfo.append("EndTime", `${NowDate} 19:10:00`);
      let TestData = await GetTestData(DataQueryInfo);
      if (TestData.status != 200 || TestData.data.length == 0) continue;
      // 计算第一节点
      let NodeData = TestData.data.filter((item) => {
        let itemTime = new Date(GMTToStr(item.Time));
        return itemTime >= new Date(`${NowDate} 08:00:00`) && itemTime <=  new Date(`${NowDate} 10:00:00`);
      });
      DataValue.push(await CalculateDailyReportData("第一节点", NodeData));
      // 计算第二节点
      NodeData = TestData.data.filter((item) => {
        let itemTime = new Date(GMTToStr(item.Time));
        return itemTime >= new Date(`${NowDate} 10:00:00`) && itemTime <= new Date(`${NowDate} 13:00:00`);
      });
      DataValue.push(await CalculateDailyReportData("第二节点", NodeData));
      // 计算第三节点
      NodeData = TestData.data.filter((item) => {
        let itemTime = new Date(GMTToStr(item.Time));
        return itemTime >= new Date(`${NowDate} 13:00:00`) && itemTime <=  new Date(`${NowDate} 16:00:00`);
      });
      DataValue.push(await CalculateDailyReportData("第三节点", NodeData));
      //计算第四节点
      NodeData = TestData.data.filter((item) => {
        let itemTime = new Date(GMTToStr(item.Time));
        return itemTime >= new Date(`${NowDate} 16:00:00`) && itemTime <=  new Date(`${NowDate} 19:10:00`);
      });
      DataValue.push(await CalculateDailyReportData("第四节点", NodeData));
      if (DataValue.length == 0) return;
      DataResult.push({
        [Station.data[index].Station]: DataValue,
      });
    };
  } else {
    let DataInfo = new FormData();
    DataInfo.append("Year", Year);
    DataInfo.append("Model", Model);
    DataInfo.append("StartTime", `${StartTime} 00:00:00`);
    DataInfo.append("EndTime", `${StartTime} 23:59:59`);
    let res = await GetDailyReportData(DataInfo);
    if (res.status != 200) {
      ElMessage.error(
        `查询指定机型指定时间段日报表数据失败，异常信息${res.message}`
      );
      return [];
    }
    if (res.data.length == 0) {
      ElMessage.warning(`当前条件下暂无日报表数据`);
      return [];
    }
    // 获取唯一站别，去重
    let Station = new Set(res.data.map((item) => item.Station));
    // 遍历站别得到该站的所有日报数据
    Station.forEach((station) => {
      let Data = res.data.filter((item) => item.Station === station);
      if (Data.length === 0) return;
      Data.map((element) => {
        DataValue = [];
        if (element.Total_number_of_tests > 0) {
          const nodeData = element.Node_data_statistics.split(/[#,]/);
          for (let i = 0; i < nodeData.length - 14; i += 15) {
            const dataObject = {};
            for (let j = 0; j <= 15; j++) {
              const key = nodeData[i + j].split(":")[0].replace(/[(|)]/g, "");
              const value = nodeData[i + j].split(":")[1];
              dataObject[key] = value;
            }
            DataValue.push(dataObject);
          }
        }
      });
      if (DataValue.length == 0) return;
      DataResult.push({
        [station]: DataValue,
      });
    });
  }
  return DataResult;
}
//#endregion

//#region 根据传入的数据计算日报表数据
export async function CalculateDailyReportData(name, res) {
  var DataCountData = await Generate_Statistical_Data(res, "SN", "Result");
  return {
    节点名称: name,
    测试产品数: DataCountData[0]["测试产品数"],
    直通产品数: DataCountData[0]["直通产品数"],
    重测产品数: DataCountData[0]["重测产品数"],
    不良产品数: DataCountData[0]["不良产品数"],
    直通率: DataCountData[0]["直通率"],
    重测率新: DataCountData[0]["重测率(新)"],
    重测率旧: DataCountData[0]["重测率(旧)"],
    不良率: DataCountData[0]["不良率"],
    测试总次数: DataCountData[0]["测试总次数"],
    测试成功总次数: DataCountData[0]["测试成功总次数"],
    测试失败总次数: DataCountData[0]["测试失败总次数"],
    包含TE_BZP测试总次数: DataCountData[0]["包含TE_BZP测试总次数"],
    工程专用条码测试次数: DataCountData[0]["工程专用条码测试次数"],
    品质专用条码测试次数: DataCountData[0]["品质专用条码测试次数"],
    制造专用条码测试次数: DataCountData[0]["制造专用条码测试次数"],
  };
}
//#endregion

//#region 保存日报数据到Excel
export async function Save_Daily_Report(ModelName,DailyReportData,SaveType) {

  await (SaveDailyReport(ModelName,DailyReportData,SaveType))
}
//#endregion
