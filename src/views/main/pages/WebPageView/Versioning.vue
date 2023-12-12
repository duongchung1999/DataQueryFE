
<template>
    <el-scrollbar class="scroll" style="width:100%;height: 100%" ref="scroll">
        <iframe :src="URL" id="mobsf" scrolling="no" frameborder="0" :style="StyleValue"></iframe>
    </el-scrollbar>
</template>
   
   
<script>
export default {
    data() {
        return {
            URL:"",
            StyleValue: ""
        }
    },
    mounted() {
        this.URL=import.meta.env.VITE_BASE_URL+':9999/';
        /**
        * iframe-宽高自适应显示   
        */
        // 获取元素
        const element = document.querySelector('.scroll');

        // 获取计算样式
        const computedStyle = window.getComputedStyle(element);
        // 获取宽度和高度
        const height = parseFloat(computedStyle.getPropertyValue('height'));
        this.StyleValue = `width:100%;height:${height - 4}px`;
    },
}
</script>

  