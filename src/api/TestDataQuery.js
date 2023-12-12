import request from "@/utils/system/request";
import { ElMessage } from "element-plus";

//#region 获取所有表名
export function GetDataTableName() {
  return request({
    method: "post",
    url: "/TestDataQuery/GetDataTableName",
  });
}
//#endregion

//#region 根据表名获取表中所有站别
export function GetDataTableStation(TableName) {
  let DataInfo = new FormData();
  DataInfo.append("TableName", TableName);
  return request({
    method: "post",
    url: "/TestDataQuery/GetDataTableStation",
    data: DataInfo,
  });
}
//#endregion

//#region 根据表名获取表中指定站别所有测试电脑编号
export function GetComputerName(TableName, Station) {
  let DataInfo = new FormData();
  DataInfo.append("TableName", TableName);
  DataInfo.append("Station", Station);
  return request({
    method: "post",
    url: "/TestDataQuery/GetComputerName",
    data: DataInfo,
  });
}
//#endregion

//#region 根据表名获取表中指定站别所有工单信息
export function GetDataTableWorkOrder(TableName, Station) {
  let DataInfo = new FormData();
  DataInfo.append("TableName", TableName);
  DataInfo.append("Station", Station);
  return request({
    method: "post",
    url: "/TestDataQuery/GetDataTableWorkOrder",
    data: DataInfo,
  });
}
//#endregion

//#region 获取指定条件测试数据
export function GetTestData(DataQueryInfo) {
  return request({
    method: "post",
    url: "/TestDataQuery/GetTestData",
    data: DataQueryInfo,
  });
}
//#endregion

//#region 自定义查询测试数据
export function CustomQuery(Sql) {
  let DataInfo = new FormData();
  DataInfo.append("Sql", Sql);
  return request({
    method: "post",
    url: "/TestDataQuery/CustomQuery",
    data: DataInfo,
  });
}
//#endregion

//#region 保存测试数据
export function SaveTestData(FileName, DataInfo) {
  return request({
    url: "/TestDataQuery/SaveTestData",
    method: "post",
    data: DataInfo,
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`下载进度${progress}%`)
    }
  }).then((res) => {
    // 处理返回的文件流
    if (res === undefined) return;
    const content = res;
    const blob = new Blob([content]);
    const fileName = FileName + "测试数据.xlsx";
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

//#region 保存模糊查询测试数据
export function SaveFuzzyQueryTestData(FileName, DataInfo) {
  return request({
    url: "/TestDataQuery/SaveFuzzyQueryTestData",
    method: "post",
    data: DataInfo,
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      console.log(`下载进度${progress}%`)
    }
  }).then((res) => {
    // 处理返回的文件流
    if (res === undefined) return;
    const content = res;
    const blob = new Blob([content]);
    const fileName = FileName + "测试数据.xlsx";
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
      console.log(111)
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