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
        <!-- 图片项 -->
        <div
          v-for="(item, idx) in processedList"
          :key="item.id"
          class="slide_item"
          @click="handleSelect(item)"
        >
          <div class="img-container" :style="containerStyle">
            <loading v-if="!item.loaded" class="loading" />
            <img
              :src="item.img"
              :alt="item.name"
              :style="imgStyle"
              @load="item.loaded = true"
            />
          </div>
          <span class="img-name">{{ item.name }}</span>
        </div>
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
import loading from "./loading.vue";
import img from "./图片.svg";

const props = defineProps({
  img_list: {
    type: Array,
    default: () => {
      let temp = [];
      for (let i = 0; i < 15; i++) {
        temp.push({
          img: img,
          id: i,
          name: "图片" + i,
        });
      }
      return temp;
    },
  },
  left_btn: { type: String, default: left_btn },
  right_btn: { type: String, default: right_btn },
  size: {
    type: Array,
    default: () => [200, 200],
  },
  duration: { type: Number, default: 500 },
  easing: { type: String, default: "cubic-bezier(0.25,0.1,0.25,1)" },
  slideWidth: { type: Number, default: 0 },
});
const emit = defineEmits(["select"]);

// 响应式数据
const processedList = ref([]);
const wrapper = ref(null);
const viewport = ref(null);
const track = ref(null);
const isAnimating = ref(false);
const currentOffset = ref(0);
const left_btn_status = ref(false);
const right_btn_status = ref(false);

// 样式计算
const containerStyle = computed(() => ({
  width: `${props.size[0]}px`,
  height: `${props.size[1]}px`,
}));

const imgStyle = computed(() => ({
  width: "100%",
  height: "100%",
  objectFit: "cover",
}));

// 初始化处理
const initList = () => {
  processedList.value = props.img_list.map((item) => ({
    ...item,
    loaded: false,
  }));
};

// 滑动逻辑（与参考组件相同）
let viewportWidth = 0;
let pageWidth = 0;

const updateSizes = () => {
  viewportWidth = viewport.value.clientWidth;
  pageWidth = viewportWidth;
};

const maxOffset = () => {
  return Math.max(track.value.scrollWidth - viewportWidth, 0);
};

// 动画 transition
const transitionCSS = computed(
  () => `transform ${props.duration}ms ${props.easing}`
);

const slide = (dir) => {
  if (isAnimating.value) return;

  updateSizes();
  const maxOff = maxOffset();
  let target = currentOffset.value + dir * pageWidth;
  target = Math.max(0, Math.min(target, maxOff));

  if (target === currentOffset.value) return;

  isAnimating.value = true;
  currentOffset.value = target;

  setTimeout(() => {
    isAnimating.value = false;
    refreshButtons();
  }, 500);
};

// 按钮状态更新
const refreshButtons = () => {
  left_btn_status.value = currentOffset.value > 0;
  right_btn_status.value = currentOffset.value < maxOffset();
};

// 事件处理
const handleSelect = (item) => {
  emit("select", item);
};

// 生命周期
onMounted(async () => {
  initList();
  await nextTick();
  updateSizes();
  refreshButtons();

  window.addEventListener("resize", () => {
    updateSizes();
    refreshButtons();
  });
});

onUnmounted(() => {
  try{
    window.removeEventListener("resize");
  }
  catch(e){
    console.error("Error removing event listener:", e);
  }  
});
</script>

<style scoped lang="scss">
.slide_wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;

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
    padding: 20px 0;
  }

  .track {
    display: flex;
    gap: 20px;
    padding: 0 60px;
    will-change: transform;
  }

  .slide_item {
    flex: 0 0 auto;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-5px);
    }

    .img-container {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background: #f5f5f5;

      img {
        transition: opacity 0.3s ease;
        &[loaded="false"] {
          opacity: 0;
        }
      }

      .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .img-name {
      display: block;
      text-align: center;
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
