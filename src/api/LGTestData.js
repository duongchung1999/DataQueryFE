import request from "@/utils/system/request";
import { ElMessage } from "element-plus";

//#region 获取LG测试数据数据库所有表名
export function GetLGDataTableName() {
  return request({
    method: "post",
    url: "/LGTestData/GetLGDataTableName",
  });
}
//#endregion

//#region 根据表名获取LG测试数据表中所有站别
export function GetDataTableLGStation(TableName) {
  let DataInfo = new FormData();
  DataInfo.append("TableName", TableName);
  return request({
    method: "post",
    url: "/LGTestData/GetDataTableLGStation",
    data: DataInfo,
  });
}
//#endregion

//#region 根据表名获取LG测试数据表中指定站别所有测试电脑名称
export function GetLGComputerName(TableName, Station) {
  let DataInfo = new FormData();
  DataInfo.append("TableName", TableName);
  DataInfo.append("Station", Station);
  return request({
    method: "post",
    url: "/LGTestData/GetLGComputerName",
    data: DataInfo,
  });
}
//#endregion

//#region 获取指定条件LG测试数据
export function GetLGTestData(DataQueryInfo) {
  return request({
    method: "post",
    url: "/LGTestData/GetLGTestData",
    data: DataQueryInfo,
  });
}
//#endregion

//#region 根据指定调节剂获取生成 Json File 文件原始数据 
export function GetJsonFileData(DataQueryInfo) {
  return request({
    method: "post",
    url: "/LGTestData/GetJsonFileData",
    data: DataQueryInfo,
  });
}
//#endregion

// 存储测试数据
export function SaveLGTestData(FileName, DataInfo) {
  // console.log(fileName,DataValue)
  return request({
      url: "/LGTestData/SaveLGTestData",
      method: 'post',
      data: DataInfo,
      responseType: 'blob'
  }).then((res) => { // 处理返回的文件流
      if (res === undefined) return
      console.log(res)
      var xhr = new XMLHttpRequest();
      xhr.open("get", res, true);
      xhr.addEventListener("progress", function (evt) {
          if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total;
              console.log(percentComplete);
              $("#progressing").html((percentComplete * 100) + "%");
          }
      }, false);
      const content = res
      const blob = new Blob([content])
      if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = FileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
      } else { // IE10+下载
          navigator.msSaveBlob(blob, FileName)
          
      }
      ElMessage.success({
          message: '存储成功',
          type: 'success'
        });
  })
}