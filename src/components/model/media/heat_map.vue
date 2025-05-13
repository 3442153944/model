<template>
  <div class="heat-map" :style="{ height: `${height}px` }">
    <svg
      :viewBox="`0 0 ${maxX} ${maxY}`"
      preserveAspectRatio="none"
      class="heat-svg"
    >
      <!-- 填充区域 -->
      <path
        :d="areaPath"
        :fill="bg_color"
      />
      <!-- 平滑折线 -->
      <path
        :d="linePath"
        fill="none"
        :stroke="frame_color"
        stroke-width="2"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  head_map_arr: {
    type: Array,
    default: () => {
      const temp = []
      for (let i = 0; i < 100; i++) {
        temp.push({
          x: i,
          value: Math.floor(Math.random() * 100)
        })
      }
      return temp
    }
  },
  bg_color: {
    type: String,
    default: 'rgba(0, 0, 0, 0.2)'
  },
  frame_color: {
    type: String,
    default: 'rgba(255, 255, 255, 0.6)'
  },
  height: {
    type: Number,
    default: 200
  }
})

// 计算最大 X、Y
const maxX = computed(() => {
  return props.head_map_arr.length
    ? props.head_map_arr[props.head_map_arr.length - 1].x
    : 1
})
const maxY = computed(() => {
  return Math.max(...props.head_map_arr.map((p) => p.value), 1)
})

// 将原始数据映射到 SVG 坐标系（SVG 的 y 向下增大，所以做一次反转）
const points = computed(() =>
  props.head_map_arr.map((p) => ({
    x: p.x,
    y: maxY.value - p.value
  }))
)

// Catmull–Rom 插值转 Bézier 曲线
function catmullRom2bezier(pts) {
  const d = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2

    // 1/6 因子
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    if (i === 0) {
      // 起始点
      d.push(`M ${p1.x},${p1.y}`)
    }
    d.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`)
  }
  return d.join(' ')
}

// 折线路径
const linePath = computed(() => catmullRom2bezier(points.value))

// 填充区域路径：在折线末尾拉到基线再回到起点，闭合
const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const d = catmullRom2bezier(points.value)
  // 从最后一个点到基线，再画回起点并闭合
  return (
    d +
    ` L ${maxX.value},${maxY.value}` +
    ` L 0,${maxY.value}` +
    ' Z'
  )
})
</script>

<style scoped>
.heat-map {
  width: 100%;
  overflow: hidden;
}

.heat-svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
