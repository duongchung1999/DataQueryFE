import request from "@/utils/system/request";
import { ElMessage } from "element-plus";

//#region 获取上传LG声学数据的所有机型
export function GetLGAEDataModel() {
  return request({
    method: "post",
    url: "/LGAETestData/GetLGAEDataModel",
  });
}
//#endregion

//#region 根据机型获取上传LG声学数据的站别
export function GetLGAEDataStationFromModel(ModelName) {
  let DataInfo = new FormData();
  DataInfo.append("Model", ModelName);
  return request({
    method: "post",
    url: "/LGAETestData/GetLGAEDataStationFromModel",
    data: DataInfo,
  });
}
//#endregion

//#region 根据站别和时间获取上传的LG声学数据文件名称
export function GetLGAEDataName(Model,LGStation, StartTime, EndTime) {
  let DataInfo = new FormData();
  DataInfo.append("Model",Model)
  DataInfo.append("LGStation", LGStation);
  DataInfo.append("StartTime", StartTime);
  DataInfo.append("EndTime", EndTime);
  return request({
    method: "post",
    url: "/LGAETestData/GetLGAEDataName",
    data: DataInfo,
  });
}
//#endregion

//#region 在线预览
export function PreviewFiles(FilePath) {

}
//#endregion

//#region 根据页面选择下载单个声学数据文件
export function DownloadSingleAcousticData(FileName, FilePath) {
  let DataInfo = new FormData();
  DataInfo.append("FilePath", FilePath);
  return request({
    url: "/LGAETestData/DownloadSingleAcousticData",
    method: "post",
    data: DataInfo,
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      let progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`下载进度${progress}%`);
    },
  }).then((res) => {
    // 处理返回的文件流
    if (res === undefined) return;
    const content = res;
    const blob = new Blob([content]);
    if ("download" in document.createElement("a")) {
      // 非IE下载
      const elink = document.createElement("a");
      elink.download = FileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, FileName);
    }
    ElMessage.success({
      message: "存储成功",
      type: "success",
    });
  });
}
//#endregion

//#region 下载页面选择的声学数据
export function DownloadSelectedAcousticData(FileName, FileInfo) {
  let DataInfo = new FormData();
  DataInfo.append("FileName", FileName);
  DataInfo.append("FileInfo", JSON.stringify(FileInfo));
  return request({
    url: "/LGAETestData/DownloadSelectedAcousticData",
    method: "post",
    data: DataInfo,
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      let progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`下载进度${progress}%`);
    },
  }).then((res) => {
    // 处理返回的文件流
    if (res === undefined) return;
    const content = res;
    const blob = new Blob([content]);
    if ("download" in document.createElement("a")) {
      // 非IE下载
      const elink = document.createElement("a");
      elink.download = FileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, FileName);
    }
    ElMessage.success({
      message: "存储成功",
      type: "success",
    });
  });
}
//#endregion

//#region 下载页面指定条件下的所有声学数据
export function DownloadAcousticData(Model,LGStation, StartTime, EndTime, FileName) {
  let DataInfo = new FormData();
  DataInfo.append("Model",Model)
  DataInfo.append("LGStation", LGStation);
  DataInfo.append("StartTime", StartTime);
  DataInfo.append("EndTime", EndTime);
  DataInfo.append("FileName", FileName);
  return request({
    url: "/LGAETestData/DownloadAcousticData",
    method: "post",
    data: DataInfo,
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      let progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`下载进度${progress}%`);
    },
  }).then((res) => {
    // 处理返回的文件流
    if (res === undefined) return;
    const content = res;
    const blob = new Blob([content]);
    if ("download" in document.createElement("a")) {
      // 非IE下载
      const elink = document.createElement("a");
      elink.download = FileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, FileName);
    }
    ElMessage.success({
      message: "存储成功",
      type: "success",
    });
  });
}
//#endregion

//#region 下载根据数据生成上传的源文件
export function DownloadAndUploadFiles(StationConfig, FileName) {
  console.log(StationConfig);
  let DataInfo = new FormData();
  DataInfo.append("StationConfig", JSON.stringify(StationConfig));
  return request({
    url: "/LGAETestData/DownloadAndUploadFiles",
    method: "post",
    data: DataInfo,
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      let progress = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      console.log(`下载进度${progress}%`);
    },
  }).then((res) => {
    // 处理返回的文件流
    if (res === undefined) return;
    const content = res;
    const blob = new Blob([content]);
    if ("download" in document.createElement("a")) {
      // 非IE下载
      const elink = document.createElement("a");
      elink.download = FileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, FileName);
    }
    ElMessage.success({
      message: "存储成功",
      type: "success",
    });
  });
}
//#endregion
