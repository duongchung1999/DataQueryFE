import request from "@/utils/system/request";

//#region 获取日报表数据数据库所有表名
export function GetDailyTableName() {
  return request({
    method: "post",
    url: "/DataDailyQuery/GetDailyTableName",
  });
}
//#endregion

//#region 根据年获取当年所有有数据的机型
export function GetModelFromYear(Year) {
  let DataInfo = new FormData();
  DataInfo.append("Year", Year);
  return request({
    method: "post",
    url: "/DataDailyQuery/GetModelFromYear",
    data: DataInfo,
  });
}
//#endregion

//#region 查询指定机型指定时间段每日生产数据统计
export function GetDailyData(DataInfo) {
  return request({
    method: "post",
    url: "/DataDailyQuery/GetDailyData",
    data: DataInfo,
  });
}
//#endregion

//#region 查询指定机型指定时间段单日生产数据统计
export function GetDailyReportData(DataInfo) {
  return request({
    method: "post",
    url: "/DataDailyQuery/GetDailyReportData",
    data: DataInfo,
  });
}
//#endregionSaveDailyReport

//#region 保存测试数据
export function SaveDailyReport(ModelName, DailyReportData,SaveType) {
  console.log(DailyReportData)
  let DataInfo = new FormData();
  DataInfo.append("ModelName", ModelName);
  DataInfo.append("DailyReportData", JSON.stringify(DailyReportData));
  DataInfo.append("SaveType", SaveType);
  return request({
    url: "/DataDailyQuery/SaveDailyReport",
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
    const fileName = ModelName + " 测试数据日报.xlsx";
    if ("download" in document.createElement("a")) {
      // 非IE下载
      const elink = document.createElement("a");
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      console.log(111);
      // IE10+下载
      navigator.msSaveBlob(blob, fileName);
    }
    ElMessage.success({
      message: "存储成功",
      type: "success",
    });
  });
}
//#endregion
