<template>
  <div class="video_info">
    <video :src="video.video" muted="true" ref="video_e"></video>
    <div class="video_tools_box" v-if="video_e">
      <progress_bar :progress="progress" @change="change_progress($event)">
      </progress_bar>
      <div class="tools_box">
        <video_tools class="video_tools" :video_e="video_e"></video_tools>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, ref, watch, onUnmounted } from 'vue'
import template from './template.mp4'
import video_tools from './video_tools.vue'
import progress_bar from './progress_bar.vue'
import { main } from './video_operate/main.ts'

const props = defineProps({
  video: {
    type: Object,
    default: () => ({
      name: '视频预览',
      video: template,
      id: 0,
    })
  }
})

const video_e = ref(null)
const video_operate = ref(null) // 改用 ref
const progress = ref(0)

// 监听 video_e 变化
watch(video_e, (newVal) => {
  if (newVal) {
    try {
      video_operate.value = new main(newVal)
      startProgressTracking()
    } catch (err) {
      console.error('初始化视频控制器失败:', err)
    }
  }
})

let timer = null
// 进度跟踪
const startProgressTracking = () => {
  const updateProgress = () => {
    if (!video_operate.value) return
    const current = video_operate.value.getCurrentTime()
    const duration = video_operate.value.getDuration()
    progress.value = duration > 0 ? current / duration * 100 : 0
    if (current >= duration) {
      clearInterval(timer)
      progress.value = 0
      video_operate.value.stop()
    }
  }
  timer = setInterval(updateProgress, 100)
}
//选择播放进度
const change_progress = (e) => {
  console.log('选择进度', e);
  let duration = video_operate.value.getDuration()
  if (duration == 0) {
    return
  }
  let target = parseInt(e / 100 * duration)
  video_operate.value.seek(target)
}

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.video_info {
  max-width: calc(100% - 20px);
  height: auto;
  display: flex;
  position: relative;
}

video {
  width: 100%;
  height: auto;
}

.video_tools_box {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0;
  gap: 3px;
  background-color: rgba(255, 255, 255, 0.5);
}

.tools_box {
  height: 50px;
  width: 100%;
  pointer-events: fill;
}

.in {
  transform: translateY(0);
  opacity: 1;
}

.out {
  transform: translateY(-100%);
  opacity: 0;
}
</style>