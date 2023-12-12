<template>
  <el-scrollbar id="Test" ref="scroll">
    <h2>功能重新开发中</h2>
    <!-- <div class="my-table" style="margin: 10px 2%; width: 96%" v-for="(item, index) in Title" :key="index">
      <el-table border :data="DataTable[index][item]" :row-class-name="tableRowClassName">
        <el-table-column :label="item.toUpperCase() + '测试生产状况'" align="center">
          <el-table-column prop="Station" label="站别"></el-table-column>
          <el-table-column prop="TotalNumberOfTests" label="测试总次数"></el-table-column>
          <el-table-column prop="NumberOfTestedProducts" label="测试产品数"></el-table-column>
          <el-table-column prop="NumberOfDirectProducts" label="直通产品数  "></el-table-column>
          <el-table-column prop="TotalNumberOfRetests" label="重测总次数"></el-table-column>
          <el-table-column prop="ComputerFail" label="测试电脑最近三十次测试Fail最多次数"></el-table-column>
          <el-table-column prop="RetestRateOld" label="重测率(旧)"></el-table-column>
          <el-table-column prop="RetestRateNew" label="重测率(New)"></el-table-column>
          <el-table-column prop="DirectRate" label="直通率"></el-table-column>
        </el-table-column>
      </el-table>
      <div :id="'DirectRate' + index" class="Chart"></div>
      <div :id="'RetestRate' + index" class="Chart"></div>
      <hr />
    </div> -->
  </el-scrollbar>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      Title: ["BHC128", "BHC111"],
      DataTable: [{
        "BHC128": [
          {
            "Model": "BHC128",
            "Station": "OQC",
            "TotalNumberOfTests": 11,
            "NumberOfTestedProducts": 1,
            "NumberOfDirectProducts": 0,
            "TotalNumberOfRetests": 10,
            "ComputerFail": "0次",
            "RetestRateOld": "1000%",
            "RetestRateNew": "1000%",
            "DirectRate": "0%"
          },
          {
            "Model": "BHC128",
            "Station": "T3.2",
            "TotalNumberOfTests": 601,
            "NumberOfTestedProducts": 562,
            "NumberOfDirectProducts": 547,
            "TotalNumberOfRetests": 39,
            "ComputerFail": "0次",
            "RetestRateOld": "6.94%",
            "RetestRateNew": "1000%",
            "DirectRate": "97.33%"
          },
        ]
      },{
        "BHC111": [
          {
            "Model": "BHC128",
            "Station": "OQC",
            "TotalNumberOfTests": 11,
            "NumberOfTestedProducts": 1,
            "NumberOfDirectProducts": 0,
            "TotalNumberOfRetests": 10,
            "ComputerFail": "0次",
            "RetestRateOld": "1000%",
            "RetestRateNew": "1000%",
            "DirectRate": "0%"
          },
          {
            "Model": "BHC128",
            "Station": "T3.2",
            "TotalNumberOfTests": 601,
            "NumberOfTestedProducts": 562,
            "NumberOfDirectProducts": 547,
            "TotalNumberOfRetests": 39,
            "ComputerFail": "0次",
            "RetestRateOld": "6.94%",
            "RetestRateNew": "1000%",
            "DirectRate": "97.33%"
          },
        ]
      }],
      EchartsTitle: [
        "14:52:57",
        "14:53:56",
        "14:54:56",
        "14:55:56",
        "14:56:56",
        "14:57:56",
        "14:58:56",
        "14:59:56",
        "15:00:56",
        "15:01:56",
        "15:02:56",
        "15:03:56",
        "15:04:56",
        "15:05:56",
        "15:06:56",
        "15:07:56",
        "15:08:56",
        "15:09:56",
        "15:10:56",
        "15:11:56"
      ],
      Station: [
        [
          "T1.01"
        ],
        [
          "T3.2"
        ]
      ],
      LineData: [
        [
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28",
          "40.28"
        ],
        [
          "76.6",
          "76.6",
          "76.6",
          "76.6",
          "76.6",
          "76.74",
          "76.58",
          "76.65",
          "76.79",
          "76.85",
          "76.99",
          "77.06",
          "77.06",
          "76.97",
          "76.97",
          "76.74",
          "76.52",
          "76.59",
          "76.72",
          "76.86"
        ]
      ]
    }
  },
  created() {
    setTimeout(() => {
      this.Test()
    }, 100);
  },
  methods: {
    // 检测表格为False的记录
    tableRowClassName({ row }) {
      let DirectRate = row["DirectRate"]
      let num = parseInt(DirectRate.replace('%', ''));
      if (num < 90) {
        return "warning-row";
      }
      return "";
    },
    async Test() {
      this.drawLine("DirectRate0", "生产直通率", this.EchartsTitle, this.Station, this.LineData);
      this.drawLine("RetestRate0", "生产重测率", this.EchartsTitle, this.Station, this.LineData);
    },
    //#region 绘制折线图表
    drawLine(ID, name, Title, Station, LineData) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById(ID));
            console.log(
                "绘制折线图表",
                ID,
                name,
                Title,
                Station,
                LineData
            );
            // 绘制图表
            myChart.setOption({
                title: {
                    text: name,
                    top: "30",
                    left: "32",
                    textStyle: {
                        fontSize: 28, //字体大小
                        color: "#000", //字体颜色
                        fontWeight: "500",
                    },
                },
                tooltip: {
                    //触发类型：坐标轴触发
                    trigger: "axis", //触发类型  'item'图形触发：散点图，饼图等无类目轴的图表中使用； 'axis'坐标轴触发；'none'：什么都不触发。
                    axisPointer: {
                        type: "line", //默认为line，line直线，cross十字准星，shadow阴影
                        lineStyle: {
                            type: "dashed",
                            color: "#808BA9",
                        },
                    },
                    backgroundColor: "#fff", //也可以通过设置rgba调节背景颜色与透明度
                    color: "#333",
                    borderWidth: "2",
                    borderColor: "#D9E1F8",
                    textStyle: {
                        color: "#333",
                        fontSize: "22",
                        lineHeight: "17",
                    },
                },
                legend: {
                    icon: "circle",
                    itemHeight: 16, //修改icon图形大小
                    textStyle: {
                        fontSize: 20,
                        color: "#333",
                    },
                    x: "left", //可设定图例在左、右、居中
                    y: "top", //可设定图例在上、下、居中
                    padding: [81, 0, 0, 32], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
                },
                grid: {
                    top: "145",
                    left: "17",
                    right: "17",
                    bottom: "41",
                    containLabel: true,
                },
                xAxis: {
                    type: "category",
                    data: Title,
                    //使坐标轴刻度与标签对齐
                    axisTick: {
                        alignWithLabel: true,
                    },
                    axisLine: {
                        // 改变x轴颜色
                        lineStyle: {
                            // color: "#D9E1F8",
                            color: "#666",
                            width: "2",
                        },
                    },
                    axisLabel: {
                        // 改变x轴字体颜色和大小
                        formatter(val) {
                            return "{a|" + `${val}` + "}";
                        },
                        rich: {
                            a: {
                                height: 40, // 设置字体行高
                                color: "#666",
                                fontSize: 18,
                            },
                        },
                    },
                },
                yAxis: [
                    {
                        type: "value",
                        name: "百分比",
                        min: 0,
                        axisLabel: {
                            color: "#333",
                            fontSize: "18",
                            lineHeight: "17",
                            formatter: "{value}%",
                        },
                        axisLine: {
                            show: false, //y轴线消失
                        },
                        axisTick: {
                            show: false, //y轴坐标点消失
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: "dashed",
                                color: "#D9E1F8",
                            },
                        },
                    },
                ],
                series: (() => {
                    var serie = [];
                    for (var i = 0; i < Station.length; i++) {
                        var item = {
                            name: Station[i] + "站",
                            type: "line",
                            data: LineData[i],
                            symbol: "circle", //折线点设置为实心点
                            symbolSize: 12, //折线点的大小
                        };
                        serie.push(item);
                    }
                    return serie;
                })(),
            });
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        },
        //#endregion
  }
}
</script>

<style scoped>
@import "./indexCss.css";
</style>