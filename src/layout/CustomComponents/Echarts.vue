<template>
    <!-- <div id="myChart"></div> -->
    <div v-for="index in myChartIndex" :key="index" :id="myChartName + index" class="Chart">
    </div>
</template>
<script>
import * as echarts from "echarts";
export default {
    name: 'Echarts',
    props: {
        myChartIndex: 0,
        myChartName: '',
        ChartClick: Function
    },
    methods: {
        // #region 绘制测试项失败分析饼图
        drawPieTestFail(TestDataTitle, TestDataList) {
            let myChart = echarts.init(document.getElementById("myChart1")); // 绘制图表
            myChart.setOption({
                // echarts选项，所有绘图数据和样式都在这里设置
                title: {
                    text: "测试项失败分析图",
                    x: "center", //x轴方向对齐方式
                },
                legend: {
                    orient: "vertical", // 布局方式，默认为水平布局，可选为：'horizontal' ¦ 'vertical'
                    // 水平安放位置，默认为左侧，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
                    x: "left",
                    // 垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
                    y: "center",
                    formatter: function (name) {
                        //该函数用于设置图例显示后的百分比
                        let total = 0;
                        let value;
                        TestDataList.forEach((item) => {
                            total += item.value;
                            if (item.name == name) {
                                value = item.value;
                            }
                        });
                        var p = String((value / total) * 100).replace(/^(.*\..{2}).*$/, "$1"); //求出百分比
                        return `${name}  ${value}次  ${p}%`; //返回出图例所显示的内容是名称+次数+百分比
                    },
                    textStyle: {
                        //图例文字的样式
                        color: "#000000",
                        fontSize: 12,
                    },
                    //图表上方的标题
                    data: TestDataTitle,
                },
                series: [
                    {
                        name: "测试项失败",
                        type: "pie",
                        barWidth: "60%",
                        data: TestDataList,
                    },
                ],
            });
            // 添加饼图的点击事件
            myChart.on('click', async (params) => {
                this.ChartClick(params.data.name)
            });
            // 添加监听
            window.onresize = myChart.resize;
        },
        //#endregion

        // #region 饼图清除当前页面
        ClearPieChart() {
            let myChart = echarts.getInstanceByDom(document.getElementById("myChart1"));
            if (myChart != undefined) {
                myChart.dispose(); // 销毁 echarts
                window.removeEventListener('resize', myChart.resize); // 移除事件监听器
                window.onresize = null; // 将监听事件设置为null,确保事件不会再触发
            }
        },
        //#endregion

        // #region 绘制日报柱状加折线图表
        drawColumnAndLine(
            ID,
            name,
            TitleData,
            Direct_rate,
            Retest_rate,
            Number_of_products_tested,
            Total_number_of_retests
        ) {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById("myChart" + ID));
            // console.log(
            //   222222,
            //   ID,
            //   name,
            //   TitleData,
            //   Direct_rate,
            //   Retest_rate,
            //   Number_of_products_tested,
            //   Total_number_of_retests
            // );
            // 绘制图表
            myChart.setOption({
                title: {
                    text: name,
                    top: "30",
                    left: "32",
                    textStyle: {
                        fontSize: 16, //字体大小
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
                        fontSize: "12",
                        lineHeight: "17",
                    },
                    formatter: function (arg) {
                        // 自定义提示
                        return (
                            arg[0].name +
                            "<br>" +
                            '<span style="margin:0 5px 2px 0;display:inline-block;width:6px;height:6px;border-radius:5px;background-color:' +
                            arg[0].color +
                            ';"></span>' +
                            arg[0].seriesName +
                            '<span style="margin-left:10px;">' +
                            arg[0].data +
                            "%" +
                            "</span>" +
                            "<br>" +
                            '<span style="margin:0 5px 2px 0;display:inline-block;width:6px;height:6px;border-radius:5px;background-color:' +
                            arg[1].color +
                            ';"></span>' +
                            arg[1].seriesName +
                            '<span style="margin-left:10px;">' +
                            arg[1].data +
                            "%" +
                            "</span>" +
                            "<br>" +
                            '<span style="margin:0 5px 2px 0;display:inline-block;width:6px;height:6px;border-radius:5px;background-color:' +
                            arg[2].color +
                            ';"></span>' +
                            arg[2].seriesName +
                            '<span style="margin-left:10px;">' +
                            arg[2].data +
                            "次" +
                            "</span>" +
                            "<br>" +
                            '<span style="margin:0 5px 2px 0;display:inline-block;width:6px;height:6px;border-radius:5px;background-color:' +
                            arg[3].color +
                            ';"></span>' +
                            arg[3].seriesName +
                            '<span style="margin-left:10px;">' +
                            arg[3].data +
                            "次" +
                            "</span>"
                        );
                    },
                },
                legend: {
                    icon: "circle",
                    itemHeight: 10, //修改icon图形大小
                    // textStyle: {
                    //   fontSize: 14,
                    //   color: "#333",
                    // },
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
                    data: TitleData,
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
                                fontSize: 14,
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
                            fontSize: "12",
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
                    {
                        type: "value",
                        name: "测试次数",
                        min: 0,
                        axisLabel: {
                            color: "#333",
                            fontSize: "12",
                            lineHeight: "17",
                            formatter: "{value}次",
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
                series: [
                    {
                        name: "直通率",
                        type: "line", //bar:柱状 line:折线图
                        data: Direct_rate,
                        color: "#339900",
                        symbol: "circle", //折线点设置为实心点
                        symbolSize: 8, //折线点的大小
                    },
                    {
                        name: "重测率",
                        type: "line",
                        data: Retest_rate,
                        color: "#FFCC00",
                        symbol: "circle", //折线点设置为实心点
                        symbolSize: 8, //折线点的大小
                    },
                    {
                        name: "测试产品数",
                        type: "bar",
                        data: Number_of_products_tested,
                        color: "#00FFFF",
                        yAxisIndex: 1,
                        symbolSize: 8, //折线点的大小
                    },
                    {
                        name: "重测产品数",
                        type: "bar",
                        data: Total_number_of_retests,
                        color: "#00CCFF",
                        yAxisIndex: 1,
                        symbolSize: 8, //折线点的大小
                    },
                ],
            });
            window.addEventListener("resize", function () {
                setTimeout(() => {
                    myChart.resize();
                }, 200)
            });
        },
        //#endregion

        // #region 柱状加折线图清除当前Dom
        ClearLineChart() {
            for (let index = 1; index <= this.myChartIndex; index++) {
                let myChart = echarts.getInstanceByDom(document.getElementById("myChart" + index));
                if (myChart != undefined) {
                    myChart.dispose(); // 销毁 echarts
                    window.removeEventListener('resize', myChart.resize); // 移除事件监听器
                    window.addEventListener = null; // 将监听事件设置为null,确保事件不会再触发
                    var child = document.getElementById("myChart" + index);
                    child.parentNode.removeChild(child);
                }
            }
        },
        //#endregion
    }
}
</script>