<template>
  <div class="logo-container">
    <img style="width: 25px;margin: 2px 10px;" src="@/assets/favicon.ico" alt="">
    <h1 v-if="!isCollapse">{{ $t(systemTitle) }}</h1>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { systemTitle } from '@/config'
export default defineComponent({
  setup() {
    const store = useStore()
    const isCollapse = computed(() => store.state.app.isCollapse)
    return {
      isCollapse,
      systemTitle
    }
  }
})
</script>

<style lang="scss" scoped>
  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-color: var(--system-logo-background);
    h1 {
      font-size: 20px;
      white-space: nowrap;
      color: var(--system-logo-color);
    }
  }
</style>