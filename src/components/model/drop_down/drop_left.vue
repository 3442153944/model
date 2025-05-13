<template>
  <div class="container" ref="drop_left">
    <div class="open_btn" @click="toggleMenu">
      <img :src="menu_svg" alt="菜单" :class="{ rotated: menu_show }" />
    </div>
    <transition name="slide">
      <div class="menu_box" v-if="menu_show">
        <div class="menu_list" v-for="(item, idx) in processedMenu" :key="idx">
          <!-- 主菜单项 -->
          <div class="menu_item" @click.stop="toggleSubMenu(item)">
            <img :src="item.img" alt="菜单" />
            <span>{{ item.name }}</span>
            <div class="show_box">
              <img
                :src="item.show_img"
                alt="展开"
                :class="{ rotated: item.show_status }"
              />
            </div>
          </div>
          <!-- 子菜单项（上下排列） -->
          <transition name="expand">
            <div class="sub_menu_list" v-if="item.show_status">
              <div
                class="sub_menu_item"
                v-for="(sub, sub_idx) in item.sub"
                :key="sub_idx"
                @click="handleSelect(sub)"
              >
                <img :src="sub.img" alt="菜单" />
                <span>{{ sub.name }}</span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import menu_svg from './列表.svg'
import wait_svg from './待定-.svg'
import show_svg from './展开.svg'

const emit = defineEmits(['select'])
const props = defineProps({
  menu_svg: {
    type: String,
    default: menu_svg
  },
  wait_svg: {
    type: String,
    default: wait_svg
  },
  menu_list: {
    type: Array,
    default: () => {
      const temp = []
      for (let i = 0; i < 5; i++) {
        temp.push({
          name: '菜单' + i,
          img: wait_svg,
          component: null,
          show_img: show_svg,
          show_status: false,
          sub: () => {
            const temp_sub = []
            for (let j = 0; j < 5; j++) {
              temp_sub.push({
                name: '子菜单' + j,
                component: null,
                img: wait_svg
              })
            }
            return temp_sub
          }
        })
      }
      return temp
    }
  }
})

const menu_show = ref(false)
const localMenu = ref([])
const drop_left = ref(null)

//点击外部时关闭菜单
const closeMenu=(e)=>{
    if (drop_left.value && !drop_left.value.contains(e.target)) {
        menu_show.value = false
    }
}

// 深拷贝处理函数
const deepCloneMenu = (menu) => {
  return menu.map(item => ({
    ...item,
    show_status: false,
    sub: (typeof item.sub === 'function' ? item.sub() : [...item.sub]).map(subItem => ({
      ...subItem
    }))
  }))
}

onMounted(() => {
  localMenu.value = deepCloneMenu(props.menu_list)
    document.addEventListener('click', closeMenu)
})
onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

watch(
  () => props.menu_list,
  (newVal) => {
    localMenu.value = deepCloneMenu(newVal)
  },
  { deep: true }
)

const processedMenu = computed(() => localMenu.value)

const toggleMenu = () => {
  menu_show.value = !menu_show.value
}

const toggleSubMenu = (item) => {
  const target = localMenu.value.find(m => m.name === item.name)
  if (target) {
    target.show_status = !target.show_status
  }
}

const handleSelect = (item) => {
  emit('select', item)
  if (item.component) {
    // 处理组件逻辑
  }
}
</script>

<style scoped>
.container {
  position: relative;
}
.open_btn {
  position: fixed;
  left: 20px;
  top: 20px;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.5s;
}
.open_btn img {
  width: 24px;
  height: 24px;
  transition: transform 0.5s;
}
.rotated {
  transform: rotate(180deg);
}
.menu_box {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 240px;
  background: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  padding: 60px 20px 20px;
  overflow-y: auto;
}
.menu_list {
  margin-bottom: 8px;
}
.menu_item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}
.menu_item:hover {
  background: #f5f5f5;
}
.menu_item img {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}
.show_box {
  margin-left: auto;
  transition: transform 0.5s;
}
.show_box img {
  width: 16px;
  height: 16px;
}
.sub_menu_list {
  padding-left: 20px;
  margin-top: 4px;
  overflow: hidden;
}
.sub_menu_item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s;
  cursor: pointer;
}
.sub_menu_item img {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}
.sub_menu_item:hover {
  background: #f0f0f0;
}
/* 侧边栏动画 */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
/* 子菜单展开动画 */
.expand-enter-active, .expand-leave-active {
  transition: all 0.5s ease;
  max-height: 500px;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
