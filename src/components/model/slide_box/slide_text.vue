<template>
  <div class="slide_wrapper" ref="wrapper">
    <!-- 控制按钮 -->
    <div class="btn_box">
      <button
        class="ctrl-btn left"
        @click="slide(-1)"
        :disabled="!left_btn_status"
      >
        <img :src="left_btn" alt="left" />
      </button>
      <button
        class="ctrl-btn right"
        @click="slide(1)"
        :disabled="!right_btn_status"
      >
        <img :src="right_btn" alt="right" />
      </button>
    </div>
    <!-- 滑动区域 -->
    <div class="viewport" ref="viewport">
      <div
        class="track"
        ref="track"
        :style="{
          transform: `translateX(-${currentOffset}px)`,
          transition: isAnimating ? transitionCSS : 'none',
        }"
      >
        <!-- 开始检查点 -->
        <div
          class="start_tag"
          ref="start_tag"
          :style="{ flex: '0 0 auto', width: '1px' }"
        ></div>

        <!-- 你的标签项 -->
        <div v-for="(item, idx) in list" :key="idx" class="slide_tag">
          <div class="tag-content" :style="{ backgroundColor: item.bg }">
            <span  :item="item.text">{{ item.text }}</span>
          </div>
        </div>

        <!-- 结束检查点 -->
        <div
          class="end_tag"
          ref="end_tag"
          :style="{ flex: '0 0 auto', width: '1px' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
  computed,
  nextTick,
} from "vue";
import left_btn from "./向左.svg";
import right_btn from "./向右.svg";

const props = defineProps({
  list: { type: Array, default: () => [] },
  bg_color: {
    type: Array,
    default: () => [
      "rgb(160,126,200)",
      "rgb(131,126,200)",
      "rgb(200,145,126)",
      "rgb(200,184,126)",
      "rgb(200,126,136)",
      "rgb(200,184,126)",
      "rgb(200,172,126)",
      "rgb(126,153,200)",
      "rgb(189,126,200)",
      "rgb(126,194,200)",
    ],
  },
  left_btn: { type: String, default: left_btn },
  right_btn: { type: String, default: right_btn },
  duration: { type: Number, default: 1000 },
  easing: { type: String, default: "cubic-bezier(0.25,0.1,0.25,1)" },
  slideWidth: { type: Number, default: 0 },
});

const emit = defineEmits(["start", "change", "end", "enterStart", "enterEnd"]);

const wrapper = ref(null);
const viewport = ref(null);
const track = ref(null);
const start_tag = ref(null);
const end_tag = ref(null);

const isAnimating = ref(false);
const currentOffset = ref(0);
const left_btn_status = ref(false);
const right_btn_status = ref(false);
let obs = null;

// 构建带背景的 list
const list = ref([]);
function getRandom(min = 0, max = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomColor() {
  return props.bg_color[getRandom(0, props.bg_color.length - 1)];
}
function initList() {
  if (props.list.length) {
    list.value = props.list.map((txt) => ({ text: txt, bg: getRandomColor() }));
  } else {
    list.value = Array.from({ length: 20 }, (_, i) => ({
      text: `Hello World ${i}`,
      bg: getRandomColor(),
    }));
  }
}

// 动画 transition
const transitionCSS = computed(
  () => `transform ${props.duration}ms ${props.easing}`
);

// 容器宽度与页宽
let viewportWidth = 0;
let pageWidth = 0;

function updateSizes() {
  viewportWidth = viewport.value.clientWidth;
  pageWidth = props.slideWidth || viewportWidth;
}

// 最大可滚动偏移
function maxOffset() {
  return Math.max(track.value.scrollWidth - viewportWidth, 0);
}

// 刷新按钮状态
function refreshButtons() {
  const vp = viewport.value.getBoundingClientRect();
  const s = start_tag.value.getBoundingClientRect();
  const e = end_tag.value.getBoundingClientRect();
  left_btn_status.value = s.left < vp.left;
  right_btn_status.value = e.right > vp.right;
}

// 单个 observer 处理
function setupObserver() {
  obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.target === start_tag.value) {
          const vis = e.isIntersecting;
          left_btn_status.value = !vis;
          if (vis) emit("enterStart");
        }
        if (e.target === end_tag.value) {
          const vis = e.isIntersecting;
          right_btn_status.value = !vis;
          if (vis) emit("enterEnd");
        }
      });
    },
    { root: viewport.value, threshold: 0.1 }
  );
  obs.observe(start_tag.value);
  obs.observe(end_tag.value);
}
onUnmounted(() => {
  if (obs) obs.disconnect();
});

// 滑动函数
function slide(dir) {
  if (isAnimating.value) return;
  emit("start", currentOffset.value);

  updateSizes();
  const maxOff = maxOffset();
  let target = currentOffset.value + dir * pageWidth;
  target = Math.max(0, Math.min(target, maxOff));

  if (target === currentOffset.value) {
    // 无偏移时直接刷新按钮状态
    refreshButtons();
    return;
  }

  isAnimating.value = true;
  currentOffset.value = target;
  emit("change", target);

  setTimeout(() => {
    isAnimating.value = false;
    refreshButtons();
    emit("end", target);
  }, props.duration);
}

onMounted(async () => {
  initList();
  await nextTick();
  updateSizes();
  setupObserver();
  refreshButtons();
  window.addEventListener("resize", () => {
    updateSizes();
    refreshButtons();
  });
});
</script>

<style scoped lang="scss">
.slide_wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(145deg, #f8f9fa, #ffffff);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  .btn_box {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    z-index: 2;
    pointer-events: none;

    .ctrl-btn {
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;
      pointer-events: auto;
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      &:hover:not(:disabled) {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 1);
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .viewport {
    overflow: hidden;
    padding: 16px 0;
  }

  .track {
    display: flex;
    gap: 12px;
    padding: 0 16px;
    will-change: transform;
  }

  .slide_tag {
    flex: 0 0 auto;
    cursor: pointer; // 确保手型指针
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); // 平滑过渡

    &:hover {
      transform: translateY(-3px); // 悬停上移效果
      // 添加微妙的阴影提升层次感
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
    }

    // 点击时的反馈效果
    &:active {
      transform: translateY(-1px);
      transition-duration: 0.1s;
    }

    .tag-content {
      padding: 12px 24px;
      border-radius: 8px;
      color: #fff;
      font-weight: 500;
      white-space: nowrap;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      transition: 
        box-shadow 0.3s ease,
        background-color 0.3s ease; // 添加颜色过渡
    }
  }
}
</style>
