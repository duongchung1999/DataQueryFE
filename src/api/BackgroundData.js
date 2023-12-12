import request from "@/utils/system/request";
import store from "@/store";

// 根据用户ID获取用户所有机型
export function GetUserModel() {
  let DataInfo = new FormData();
  DataInfo.append("UserID",store.state.user.info.Id);
  return request({
    method: "post",
    url: "/BackgroundData/GetUserModel",
    data:DataInfo
  });
}

// 根据用户ID获取用户所有有上传声学数据的机型
export function GetUploadAEDataUserModel() {
  let DataInfo = new FormData();
  DataInfo.append("UserID",store.state.user.info.Id);
  return request({
    method: "post",
    url: "/BackgroundData/GetUploadAEDataUserModel",
    data:DataInfo
  });
}

// 根据机型名称获取后台有上传测试数据的站别
export function GetStation(ModelName) {
  let DataInfo = new FormData();
  DataInfo.append("ModelName",ModelName);
  return request({
    method: "post",
    url: "/BackgroundData/GetStation",
    data:DataInfo
  });
}

// 根据机型名称获取后台有上传Logi测试数据的站别
export function GetLGStation(ModelName) {
  let DataInfo = new FormData();
  DataInfo.append("ModelName",ModelName);
  return request({
    method: "post",
    url: "/BackgroundData/GetLGStation",
    data:DataInfo
  });
}

// 根据机型和站别名称获取后台站别Config
export function GetStationConfig(ModelName,StationName) {
  let DataInfo = new FormData();
  DataInfo.append("ModelName",ModelName);
  DataInfo.append("StationName",StationName);
  return request({
    method: "post",
    url: "/BackgroundData/GetStationConfig",
    data:DataInfo
  });
}