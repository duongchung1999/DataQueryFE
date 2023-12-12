import {
  GetUserModel,
  GetUploadAEDataUserModel,
  GetStation,
  GetLGStation,
  GetStationConfig,
} from "@/api/BackgroundData";

// #region 根据用户ID获取用户所有机型
export async function Get_User_Model() {
  let res = await GetUserModel();
  if (res.status != 200) {
    ElMessage.error(`获取机型名称失败，异常信息${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据用户ID获取用户所有有上传声学数据的机型
export async function Get_Upload_AE_Data_User_Model() {
  let res = await GetUploadAEDataUserModel();
  if (res.status != 200) {
    ElMessage.error(`获取机型名称失败，异常信息${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据机型名称获取后台有上传测试数据的站别
export async function Get_Station(ModelName) {
  let res = await GetStation(ModelName);
  if (res.status != 200) {
    ElMessage.error(`获取后台有上传测试数据的站别失败，异常信息${res.message}`);
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据机型名称获取后台有上传Logi测试数据的站别
export async function Get_LG_Station(ModelName) {
  let res = await GetLGStation(ModelName);
  if (res.status != 200) {
    ElMessage.error(
      `获取后台有上传Logi测试数据的站别失败，异常信息${res.message}`
    );
    return [];
  }
  return res.data;
}
//#endregion

// #region 根据机型和站别名称获取后台站别Config
export async function Get_Station_Config(ModelName,StationName) {
  let res = await GetStationConfig(ModelName,StationName);
  if (res.status != 200) {
    ElMessage.error(
      `获取${Model} ${Station.split("|")[0]}后台Config信息失败，异常信息${res.message}`
    );
    return res;
  }
  return res;
}
//#endregion
