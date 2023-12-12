import {
  GetLGAEDataModel,
  GetLGAEDataStationFromModel,
  GetLGAEDataName,
  PreviewFiles,
  DownloadSingleAcousticData,
  DownloadSelectedAcousticData,
  DownloadAcousticData,
  DownloadAndUploadFiles,
} from "@/api/LGAETestData";
import { ElMessage } from "element-plus";
import { Get_Station_Config } from "@/utils/RequestProcessing/BackgroundDataProcessing";

// #region 获取上传LG声学数据的所有机型
export async function Get_LG_AE_Data_Model() {
  let res = await GetLGAEDataModel();
  if (res.status != 200) {
    ElMessage.error(`获取上传LG声学数据的所有机型异常,${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据机型获取上传LG声学数据的站别
export async function Get_LG_AE_Data_Station_From_Model(ModelName) {
  let res = await GetLGAEDataStationFromModel(ModelName);
  if (res.status != 200) {
    ElMessage.error(
      `根据机型获取上传LG声学数据的站别失败，异常信息${res.message}`
    );
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据站别和时间获取上传的LG声学数据文件名称
export async function Get_LG_AE_Data_Name(Model,LGStation, StartTime, EndTime) {
  let res = await GetLGAEDataName(Model,LGStation.split("|")[1], StartTime, EndTime);
  if (res.status != 200) {
    ElMessage.error(
      `根据站别和时间获取上传的LG声学数据文件名称失败，异常信息${res.message}`
    );
    return [];
  }
  if (res.data.length == 0) {
    ElMessage.warning(`${LGStation} ${StartTime}-${EndTime} ${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

//#region 在线预览
export async function Preview_Files(FilePath) {
}
//#endregion

//#region 根据文件路径下载单个文件
export async function Download_Single_Acoustic_Data(FileName, FilePath) {
  await DownloadSingleAcousticData(FileName.toUpperCase(), FilePath);
}
//#endregion

//#region 下载页面选择的文件
export async function Download_Selected_Acoustic_Data(FileName, FileInfo) {
  await DownloadSelectedAcousticData(FileName, FileInfo);
}
//#endregion

//#region 下载页面指定条件下的所有声学数据
export async function Download_Acoustic_Data(
  Model,
  LGStation,
  StartTime,
  EndTime,
  FileName
) {
  await DownloadAcousticData(
    Model,
    LGStation.split("|")[1],
    StartTime,
    EndTime,
    FileName
  );
}
//#endregion

//#region 导出上传源文件
export async function Download_And_Upload_Files(Model, Station) {
  let res = await Get_Station_Config(Model, Station.split("|")[0]);
  if (res.status != 200) return;
  if (res.data.length == 0) {
    ElMessage.warning(`${Model} ${Station.split("|")[0]} 后台暂无配置信息`);
    return;
  }
  let StationConfig = {};
  if (res.data[0].config.indexOf("LogiLogFlag=1") != -1) {
    res.data[0].config.split("\n").forEach((item) => {
      if (
        (item.indexOf("LogiBU") != -1) |
        (item.indexOf("LogiProject") != -1) |
        (item.indexOf("LogiStation") != -1) |
        (item.indexOf("LogiStage") != -1) |
        (item.indexOf("LogioemSource") != -1)
      ) {
        StationConfig[item.split("=")[0]] = item
          .split("=")[1]
          .replace("\r", "");
      }
    });
    await DownloadAndUploadFiles(StationConfig, `${Station.split("|")[1]}.zip`);
  } else {
    ElMessage.warning(
      `${Model} ${Station.split("|")[0]} 后台没有打开 LG 数据上传`
    );
  }
  console.log(StationConfig);
}
//#endregion
