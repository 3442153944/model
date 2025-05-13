<template>
  <div class="loading-spinner-container">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup>
// 可以接收自定义颜色和速度的props
const props = defineProps({
  color: {
    type: String,
    default: '#4fc3f7' // 天蓝色
  },
  speed: {
    type: String,
    default: '1s' // 默认1秒转一圈
  },
  size: {
    type: String,
    default: '100%' // 默认填满容器
  }
})
</script>

<style scoped>
.loading-spinner-container {
  display: inline-block;
  align-items: center;
  justify-content: center;
  /*
  width: v-bind('props.size');
  height: v-bind('props.size');
  */
  aspect-ratio: 1/1; /* 保持正圆形 */
}

.loading-spinner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: calc(max(2px, min(3px, 3vw))) solid transparent;
  border-top-color: v-bind('props.color');
  border-left-color: v-bind('props.color');
  animation: spin v-bind('props.speed') linear infinite;
  position: relative;
}

.loading-spinner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: inherit;
  border-top-color: transparent;
  border-left-color: transparent;
  opacity: 0.5;
  filter: blur(1px);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>