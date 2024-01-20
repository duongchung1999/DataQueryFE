import axios from "axios";
import store from "@/store";
import { ElMessage } from "element-plus";
import { showLoading, hideLoading } from "@/utils/system/loading.js";

const baseURL = import.meta.env.VITE_BASE_URL+':8088/api/';
//const baseURL = import.meta.env.VITE_BASE_URL+":7071/api/";

const service = axios.create({
  baseURL: baseURL,
  timeout: 200000
});

// 请求前的统一处理
service.interceptors.request.use(
  (config) => {
    showLoading();
    // JWT鉴权处理
    if (store.getters["user/token"]) {
      config.headers["token"] = store.state.user.token;
    }
    return config;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    setTimeout(() => {
      hideLoading();
      if (response.status != 200) {
        switch (response.status) {
          case 400:
            ElMessage.error("Bad request");
            //console.log("错误请求")
            break;
          case 401:
            ElMessage.error("Unauthorized, please log in again");
            setTimeout(() => {
              store.dispatch("user/loginOut");
            }, 1000);
            //console.log("未授权，请重新登录")
            break;
          case 403:
            ElMessage.error("Access denied");
            //console.log("拒绝访问")
            break;
          case 404:
            ElMessage.error("Request error, the resource was not found");
            //console.log("请求错误，未找到该资源")
            break;
          case 404:
            ElMessage.error("请求方法为允许");
            //console.log("请求方法为允许")
            break;
          case 408:
            ElMessage.error("Timeout!");
            //console.log("请求超时")
            break;
          case 500:
            ElMessage.error(`Server-side error ${response.data.message}`);
            //console.log("服务器端出错")
            break;
          case 501:
            ElMessage.error("Network is not implemented");
            //console.log("网络未实现")
            break;
          case 502:
            ElMessage.error("Network Error");
            //console.log("网络错误")
            break;
          case 503:
            ElMessage.error("service is not available");
            //console.log("服务不可用")
            break;
          case 504:
            ElMessage.error("Network Timeout!");
            //console.log("网络超时")
            break;
          case 505:
            ElMessage.error("http version does not support this request");
            //console.log("http版本不支持该请求")
            break;
          default:
            ElMessage.error(`connection error${response.status}`);
          //console.log(`连接错误${err.response.status}`)
        }
      }
    }, 100);
    return response.data;
  },
  (error) => {
    if (error && error.response) {
      // 对响应数据做点什么
      setTimeout(() => {
        hideLoading();
      }, 200);
      switch (error.response.status) {
        case 400:
          ElMessage.error("错误请求");
          //console.log("错误请求")
          break;
        case 401:
          this.$store.commit("delToken");
          ElMessage.error("未授权，请重新登录");
          store.dispatch("user/loginOut");
          //console.log("未授权，请重新登录")
          break;
        case 403:
          ElMessage.error("拒绝访问");
          //console.log("拒绝访问")
          break;
        case 404:
          ElMessage.error("请求错误，未找到该资源");
          //console.log("请求错误，未找到该资源")
          break;
        case 404:
          ElMessage.error("请求方法为允许");
          //console.log("请求方法为允许")
          break;
        case 408:
          ElMessage.error("请求超时");
          //console.log("请求超时")
          break;
        case 500:
          ElMessage.error("服务器端出错");
          //console.log("服务器端出错")
          break;
        case 501:
          ElMessage.error("网络未实现");
          //console.log("网络未实现")
          break;
        case 502:
          ElMessage.error("网络错误");
          //console.log("网络错误")
          break;
        case 503:
          ElMessage.error("服务不可用");
          //console.log("服务不可用")
          break;
        case 504:
          ElMessage.error("网络超时");
          //console.log("网络超时")
          break;
        case 505:
          ElMessage.error("http版本不支持该请求");
          //console.log("http版本不支持该请求")
          break;
        default:
          ElMessage.error(`连接错误${err.response.status}`);
        //console.log(`连接错误${err.response.status}`)
      }
    } else {
      hideLoading();
      ElMessage.error("连接到服务器失败");
      //console.log('连接到服务器失败')
    }
  }
);

export default service;
