import request from "@/utils/system/request";
import { ElMessage } from "element-plus";

//#region 获取指定SN测试数据
export function GetTestDataFromSN(DataQueryInfo) {
    return request({
      method: "post",
      url: "/SNDataQuery/GetTestDataFromSN",
      data: DataQueryInfo,
    });
  }
  //#endregion

  //#region 保存SN查询所有测试数据
export function SaveSNTestData(FileName, DataInfo) {
  return request({
    url: "/SNDataQuery/SaveSNTestData",
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