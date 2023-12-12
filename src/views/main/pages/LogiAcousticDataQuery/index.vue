<template>
  <el-scrollbar style="height: 100%" ref="scroll">
    <div id="Menu">
      <div>
        <!-- 机型名称 -->
        <el-select
          v-model="LGAEModelValue"
          class="Model"
          size="large"
          filterable
          placeholder="机型"
          @change="GetStation()"
        >
          <el-option
            v-for="(item, index) in LGAEModelList"
            :key="index"
            :value="item.Model"
          >
          </el-option>
        </el-select>
        <!-- 站别名称 -->
        <el-select
          v-model="LGAEStationValue"
          class="Station"
          size="large"
          filterable
          placeholder="站别"
        >
          <el-option
            v-for="(item, index) in LGAEStationList"
            :key="index"
            :label="item.Station"
            :value="item.Station"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-model="LGAEDateTimeValue"
          type="daterange"
          range-separator="至"
          :start-placeholder="$t('message.common.StartTime')"
          :end-placeholder="$t('message.common.EndTime')"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="TimeChage()"
        >
        </el-date-picker>
        <span class="demonstration">{{ $t("message.common.QueryTime") }}</span>
      </div>
      <div>
        <el-button
          :disabled="LGAEDataButtonflag == 1 ? true : false"
          @click="DownloadAcousticData()"
          type="warning"
          >{{ $t("message.common.Download") }}</el-button
        >
        <el-button
          :disabled="LGAEButtonflag == 1 ? true : false"
          @click="DownloadAndUploadFiles()"
          type="warning"
          >{{ $t("message.common.DownloadAndUploadFiles") }}</el-button
        >
        <el-button
          type="danger"
          :disabled="LGAEDataButtonflag == 1 ? true : false"
          @click="ClearLGTestData"
          >{{ $t("message.common.ClearPage") }}</el-button
        >
        <el-button
          :disabled="LGAEButtonflag == 1 ? true : false"
          @click="SelectLGData()"
          type="success"
          >{{ $t("message.common.Query") }}</el-button
        >
      </div>
    </div>
    <div id="Data">
      <el-table
        border
        ref="multipleTable"
        :data="AEDataNameInfo"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50px"> </el-table-column>
        <el-table-column prop="FileName" label="文件名称"> </el-table-column>
        <el-table-column label="操作" width="240px">
          <template #default="scope">
            <el-button
              size="mini"
              @click="DownloadSingleAcousticData(scope.row)"
              type="warning"
              style="width: 40%; min-width: 10px"
              >下载</el-button
            >
            <!-- <el-button size="mini" @click="PreviewFiles(scope.row)" type="success"
                            style="width: 40%; min-width: 10px;">预览</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-button
          size="mini"
          type="warning"
          :disabled="FileSelectFlag == 1 ? true : false"
          @click="DownloadSelectedAcousticData()"
          >{{ $t("message.common.DownloadSelected") }}</el-button
        >
        <el-button
          size="mini"
          type="danger"
          :disabled="FileSelectFlag == 1 ? true : false"
          @click="toggleSelection()"
          >{{ $t("message.common.ClearSelection") }}</el-button
        >
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import {
  Get_LG_AE_Data_Model,
  Get_LG_AE_Data_Station_From_Model,
  Get_LG_AE_Data_Name,
  Download_Single_Acoustic_Data,
  Download_Selected_Acoustic_Data,
  Download_Acoustic_Data,
  Download_And_Upload_Files,
} from "@/utils/RequestProcessing/LGAETestDataProcessing";
import { Get_Upload_AE_Data_User_Model } from "@/utils/RequestProcessing/BackgroundDataProcessing";
import store from "@/store";
import { ElMessage } from "element-plus";
import Moment from "moment";

export default {
  data() {
    return {
      LGAEModelList: [], // 存储机型数据
      LGAEModelValue: "", // 存储页面选择的机型
      LGAEStationList: [], // 存储站别数据
      LGAEStationValue: "", // 存储页面选择的站别数据
      LGAEDateTimeValue: [], // 存储页面选择时间
      LGAEButtonflag: 1, // 查询按键Flag
      LGAEDataButtonflag: 1, // 是否有数据Flag

      // 测试数据
      AEDataNameInfo: [],
      SelectedFiles: [],
      FileSelectFlag: 1,
      previewUrl: null,
    };
  },
  created() {
    this.GetModelName();
  },
  methods: {
    //#region 根据选择的年份季度生成机型信息
    async GetModelName() {
      this.ClearLGTestData();
      await this.DefaultTime();
      this.LGAEModelValue = "";
      this.LGAEModelList = [];
      if (store.state.user.LoginFlag) {
        this.LGAEModelList = await Get_Upload_AE_Data_User_Model();
      } else {
        this.LGAEModelList = await Get_LG_AE_Data_Model();
      }
      this.LGAEModelValue = this.LGAEModelList[0].Model;
      await this.GetStation();
    },
    //#endregion

    //#region 根据机型名称获取站别
    async GetStation() {
      this.ClearLGTestData();
      this.LGAEStationValue = "";
      this.LGAEStationList = [];
      this.LGAEStationList = await Get_LG_AE_Data_Station_From_Model(
        this.LGAEModelValue
      );
      this.LGAEStationValue = this.LGAEStationList[0].Station;
      this.LGAEButtonflag = 0;
    },
    //#endregion

    //#region 查询点击事件
    async SelectLGData() {
      console.log(this.LGAEDateTimeValue);
      if (this.LGAEDateTimeValue == null) {
        ElMessage.warning("查询时间不能为空！");
        return;
      }
      this.LGAEButtonflag = 1; // 禁用按钮
      this.AEDataNameInfo = await Get_LG_AE_Data_Name(
        this.LGAEModelValue,
        this.LGAEStationValue,
        this.LGAEDateTimeValue[0],
        this.LGAEDateTimeValue[1]
      );
      if (this.AEDataNameInfo.length > 0) this.LGAEDataButtonflag = 0;
      this.LGAEButtonflag = 0; // 启用按钮
    },
    //#endregion

    //#region 清除选中的内容
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //#endregion

    //#region 选择内容
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.FileSelectFlag = this.multipleSelection.length > 0 ? 0 : 1;
    },
    //#endregion

    //#region 预览单个文件
    async PreviewFiles(row) {},
    //#endregion

    //#region 下载单个文件
    async DownloadSingleAcousticData(row) {
      await Download_Single_Acoustic_Data(row.FileName, row.FilePath);
    },
    //#endregion

    //#region 下载选中的声学数据
    async DownloadSelectedAcousticData() {
      if (this.multipleSelection.length == 1) {
        await Download_Single_Acoustic_Data(
          this.multipleSelection[0].FileName,
          this.multipleSelection[0].FilePath
        );
      } else {
        let Time =
          this.LGAEDateTimeValue[0] == this.LGAEDateTimeValue[1]
            ? this.LGAEDateTimeValue[0].replace(/-/g, "")
            : `${this.LGAEDateTimeValue[0].replace(
                /-/g,
                ""
              )}-${this.LGAEDateTimeValue[1].replace(/-/g, "")}`;
        let FileName = `${this.LGAEModelValue}_${
          this.LGAEStationValue.split("|")[0]
        }_${Time}.zip`;
        await Download_Selected_Acoustic_Data(FileName, this.multipleSelection);
      }
    },
    //#endregion

    //#region 下载页面指定条件下的所有声学数据
    async DownloadAcousticData() {
      let Time =
        this.LGAEDateTimeValue[0] == this.LGAEDateTimeValue[1]
          ? this.LGAEDateTimeValue[0].replace(/-/g, "")
          : `${this.LGAEDateTimeValue[0].replace(
              /-/g,
              ""
            )}-${this.LGAEDateTimeValue[1].replace(/-/g, "")}`;
      let FileName = `${this.LGAEModelValue}_${
        this.LGAEStationValue.split("|")[0]
      }_${Time}.zip`;
      await Download_Acoustic_Data(
        this.LGAEModelValue,
        this.LGAEStationValue,
        this.LGAEDateTimeValue[0],
        this.LGAEDateTimeValue[1],
        FileName
      );
    },
    //#endregion

    //#region 导出上传源文件
    async DownloadAndUploadFiles() {
      await Download_And_Upload_Files(
        this.LGAEModelValue,
        this.LGAEStationValue
      );
    },
    //#endregion

    //#region 清空页面原有数据
    async ClearLGTestData() {
      this.AEDataNameInfo = [];
      this.FileSelectFlag = 1; // 禁用按钮
      this.LGAEDataButtonflag = 1;
    },
    //#endregion

    //#region 时间选择事件
    async TimeChage() {
      let value = Moment().format("YYYY-MM-DD");
      if (this.DateTimeValue == null) return;
      if (value < this.LGAEDateTimeValue[0]) {
        ElMessage.warning("查询开始时间不能大于当前日期");
        this.DefaultTime();
        return;
      }
    },
    //#endregion

    //#region 设置默认时间
    async DefaultTime() {
      this.LGAEDateTimeValue = [
        Moment().format("YYYY-MM-DD"),
        Moment().format("YYYY-MM-DD"),
      ];
    },
    //#endregion
  },
};
</script>

<style  lang="scss" scoped>
@import "./LogiAcousticDataQueryCss.css";
</style>