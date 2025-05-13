<template>
  <div 
    class="progress-bar"
    :class="direction"
    :style="{ width: bar_width, height: bar_height }"
    @click="handleClick"
  >
    <div class="track" ref="track">
      <div 
        class="progress" 
        :style="progressStyle"
      ></div>
      <div
        class="thumb"
        :style="thumbStyle"
        @mousedown="startDrag"
        @touchstart.prevent="startDrag"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  min: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 1
  },
  bar_color: {
    type: String,
    default: 'rgb(0,150,250)'
  },
  point_color: {
    type: String,
    default: 'rgb(255,255,255)'
  },
  bar_width: {
    type: String,
    default: '100%'
  },
  bar_height: {
    type: String,
    default: '10px'
  },
  direction: {
    type: String,
    default: 'horizontal',
    validator: (val) => ['horizontal', 'vertical'].includes(val)
  }
})

const emit = defineEmits(['update:progress', 'change'])

const track = ref(null)
const isDragging = ref(false)
const progressValue = ref(props.progress)

// 进度计算
const calcProgress = (value) => {
  return Math.min(Math.max(value, props.min), props.max)
}

// 进度样式
const progressStyle = computed(() => {
  const percentage = (progressValue.value - props.min) / (props.max - props.min) * 100
  return props.direction === 'horizontal' 
    ? { width: `${percentage}%`, backgroundColor: props.bar_color }
    : { height: `${percentage}%`, backgroundColor: props.bar_color }
})

// 滑块样式
const thumbStyle = computed(() => ({
  backgroundColor: props.point_color,
  [props.direction === 'horizontal' ? 'left' : 'bottom']: progressStyle.value[props.direction === 'horizontal' ? 'width' : 'height']
}))

// 处理点击事件
const handleClick = (e) => {
  if (isDragging.value) return
  updateProgress(e)
}

// 开始拖动
const startDrag = () => {
  isDragging.value = true
  window.addEventListener('mousemove', updateProgress)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', updateProgress)
  window.addEventListener('touchend', stopDrag)
}

// 停止拖动
const stopDrag = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', updateProgress)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', updateProgress)
  window.removeEventListener('touchend', stopDrag)
  emit('change', progressValue.value)
}

// 更新进度
const updateProgress = (e) => {
  if (!isDragging.value && e.type !== 'click') return
  
  const rect = track.value.getBoundingClientRect()
  let newValue
  
  if (props.direction === 'horizontal') {
    const x = (e.clientX || e.touches[0].clientX) - rect.left
    newValue = (x / rect.width) * (props.max - props.min) + props.min
  } else {
    const y = rect.bottom - (e.clientY || e.touches[0].clientY)
    newValue = (y / rect.height) * (props.max - props.min) + props.min
  }

  newValue = Math.round(newValue / props.step) * props.step
  newValue = calcProgress(newValue)
  
  if (newValue !== progressValue.value) {
    progressValue.value = newValue
    emit('update:progress', newValue)
    if (!isDragging.value) emit('change', newValue)
  }
}

// 监听props变化
watch(() => props.progress, (val) => {
  progressValue.value = calcProgress(val)
})

// 生命周期
onMounted(() => {
  progressValue.value = calcProgress(props.progress)
})

onUnmounted(() => {
  stopDrag()
})
</script>

<style scoped>
.progress-bar {
  position: relative;
  cursor: pointer;
  transition: height 0.3s, width 0.3s;
}

.progress-bar.horizontal {
  height: v-bind('bar_height');
}

.progress-bar.vertical {
  width: v-bind('bar_height');
  height: v-bind('bar_width');
}

.track {
  position: relative;
  background: #ebebeb;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar.horizontal .track {
  width: 100%;
  height: 100%;
}

.progress-bar.vertical .track {
  width: 100%;
  height: 100%;
  transform: rotate(180deg);
}

.progress {
  position: absolute;
  transition: all 0.2s ease;
}

.progress-bar.horizontal .progress {
  height: 100%;
  left: 0;
  top: 0;
}

.progress-bar.vertical .progress {
  width: 100%;
  bottom: 0;
  left: 0;
}

.thumb {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  cursor: grab;
  z-index: 2;
}

.progress-bar.horizontal .thumb {
  top: 50%;
}

.progress-bar.vertical .thumb {
  left: 50%;
}

.thumb:active {
  transform: translate(-50%, -50%) scale(1.2);
  cursor: grabbing;
}
</style>