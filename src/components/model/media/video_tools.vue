<template>
  <div class="video_tools" ref="video_tools">
    <div class="menu" ref="menu">
      <div class="left_box">
        <div class="icon rotate" @click="back" @mouseenter="set_float_msg('后退10s', $event)" @mouseleave="clear_float_msg">
          <img :src="fast_forward" alt="快退" />
        </div>
        <div class="icon" @click="play_or_pause" @mouseenter="set_float_msg(is_play ? '暂停' : '播放', $event)" @mouseleave="clear_float_msg">
          <img :src="play" alt="播放" v-if="!is_play" />
          <img :src="pause" alt="暂停" v-else />
        </div>
        <div class="icon" @click="forward" @mouseenter="set_float_msg('前进10s', $event)" @mouseleave="clear_float_msg">
          <img :src="fast_forward" alt="快进" />
        </div>
        <div class="time_box">
          <span>{{ video_operate.formatTime(play_time) }}/{{ video_operate.formatTime(video_time) }}</span>
        </div>
      </div>

      <div class="right_box">
        <div class="hd_box" @mouseenter="toggle_hd(true)" @mouseleave="toggle_hd(false)">
          <span style="color: white;">{{ hd_list[hd_index].name }}</span>
          <transition name="hd-fade">
            <div v-show="hd_show" class="hd_list">
              <div v-for="(item, index) in hd_list" :key="index"
                class="hd_list_item"
                :class="{ selected: hd_index === index }"
                @click="change_hd(index)">
                {{ item.name }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- 浮动提示 -->
    <transition name="fade">
      <div class="float_msg" v-if="float_msg_show" :style="{ left: float_msg_position.x, top: float_msg_position.y }">
        <span>{{ float_msg_text }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import fast_forward from './快进.svg'
import pause from './暂停.svg'
import play from './播放.svg'
import { main } from './video_operate/main'

const props = defineProps({
  video_e: {
    type: HTMLVideoElement,
    required: true
  }
})

const video_operate = new main(props.video_e)
const is_play = ref(false)
const play_time = ref(0)
const video_time = ref(0)
let timer = null

const menu = ref(null)
const video_tools = ref(null)

// 浮动提示
const float_msg_text = ref('')
const float_msg_show = ref(false)
const float_msg_position = ref({ x: 0, y: 0 })
let float_msg_timer = null

function set_float_msg(text, e) {
  if (!video_tools.value || !video_tools.value.contains(e.target)) return
  clearTimeout(float_msg_timer)
  let menu_height = menu.value.offsetHeight
  setTimeout(() => {
    float_msg_text.value = text
    float_msg_position.value = {
      x: e.clientX - 15 + 'px',
      y: e.clientY - (menu_height + 15) + 'px'
    }
    float_msg_show.value = true
    float_msg_timer = setTimeout(() => {
      float_msg_show.value = false
    }, 2000)
  }, 200)
}

function clear_float_msg() {
  clearTimeout(float_msg_timer)
  float_msg_show.value = false
}

// 播放或暂停
const play_or_pause = () => {
  is_play.value ? video_operate.stop() : video_operate.start()
  is_play.value = !is_play.value
}

// 快退10秒
const back = () => {
  const now = video_operate.getCurrentTime()
  video_operate.seek(Math.max(0, now - 10))
}

// 快进10秒
const forward = () => {
  const now = video_operate.getCurrentTime()
  const duration = video_operate.getDuration()
  video_operate.seek(Math.min(duration, now + 10))
}

// 时间同步
onMounted(() => {
  timer = setInterval(() => {
    play_time.value = video_operate.getCurrentTime()
  }, 100)
  video_time.value = video_operate.getDuration()
})

onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(float_msg_timer)
})

// 清晰度
let hd_list = ref([
  { name: '标清480p', leave: 0 },
  { name: '高清720p', leave: 1 },
  { name: '超清1080p', leave: 2 },
  { name: '原画4K', leave: 3 }
])
const hd_index = ref(0)
const hd_show = ref(false)
let hd_timer = null

const change_hd = (index) => {
  hd_index.value = index
  hd_show.value = false
}

const toggle_hd = (show) => {
  if (show) {
    clearTimeout(hd_timer)
    hd_show.value = true
  } else {
    hd_timer = setTimeout(() => {
      hd_show.value = false
    }, 300)
  }
}
</script>

<style scoped lang="scss">
.video_tools {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.menu {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(50px, 350px) 1fr;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: space-between;
}

.left_box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  height: 100%;
}

.time_box {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon {
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  transform: scale(0.85);
  position: relative;

  &:hover {
    transform: scale(1);
    filter: brightness(1.2);
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
  }

  img {
    height: 100%;
    width: auto;
    object-fit: cover;
    display: block;
  }
}

.rotate img {
  transform: rotate(180deg);
}

.right_box {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  position: relative;
}
.hd_box{
  cursor: pointer;
  transition: all 0.3s;
  padding: 5px 10px;
  &:hover{
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.4);
  }
}

// ==========================
// 浮动提示动画样式部分
// ==========================
.float_msg {
  position: fixed;
  background-color: rgba(30, 30, 30, 0.85);
  color: #fff;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 6px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 9999;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  transform: translate(10px, 10px);
  opacity: 0.9;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(0px, 0px);
}

// ==========================
// 清晰度切换动画样式
// ==========================
.hd_list {
  position: absolute;
  bottom: 100%;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 6px;
  overflow: hidden;
  padding: 5px 0;
  max-height: 300px;
  transition: max-height 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.hd_list_item {
  padding: 8px 16px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.selected {
    background-color: rgba(255, 255, 255, 0.25);
    font-weight: bold;
  }
}

.hd-fade-enter-active,
.hd-fade-leave-active {
  transition: all 0.3s ease;
}

.hd-fade-enter-from,
.hd-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  height: 0%;
}
</style>
