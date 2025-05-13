<template>
  <div class="drop-menu">
    <div class="menu">
      <div class="menu-list">
        <div 
          v-for="(item, index) in menu_item" 
          :key="index"
          class="menu-item"
          @mouseenter="activeIndex = index"
          @mouseleave="activeIndex = null"
        >
          {{ item.name }}
          <div 
            v-if="item.sub?.().length"
            class="sub-menu"
            :class="{ 'show': activeIndex === index }"
          >
            <div
              v-for="(subItem, subIndex) in item.sub()"
              :key="subIndex"
              class="sub-item"
              @click="handleSelect(subItem)"
            >
              {{ subItem.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['select'])
const activeIndex = ref(null)

const props = defineProps({
  menu_item: {
    type: Array,
    default: () => {
      const temp = []
      for (let i = 0; i < 5; i++) {
        temp.push({
          name: '菜单' + i,
          sub: () => {
            const temp_sub = []
            for (let j = 0; j < 5; j++) {
              temp_sub.push({
                name: '子菜单' + j,
                component: null
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

function handleSelect(item) {
  emit('select', item)
  if (item.component) {
    // 组件处理逻辑（由父组件实现）
  }
}
</script>

<style scoped>
.drop-menu {
  position: relative;
  display: inline-block;
}

.menu-list {
  display: flex;
  gap: 20px;
  padding: 8px 16px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-item {
  position: relative;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #333;
  border-bottom: 2px solid transparent;
}

.menu-item:hover {
  background-color: #f5f5f5;
  border-radius: 4px;
  border-bottom: 2px solid rgb(0,150,250);
  border-radius: 4px 4px 0px 0px;
}

.sub-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 160px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  transform: translateY(10px);
  z-index: 100;
}

.sub-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.sub-item {
  padding: 8px 16px;
  transition: background-color 0.2s;
  color: #666;
}

.sub-item:hover {
  background-color: #f0f0f0;
  color: #333;
  cursor: pointer;
  border-bottom: 3px solid rgb(0,150,250);
}
</style>