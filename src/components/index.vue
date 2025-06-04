<template>
  <div class="index">
    <div class="menu_box">
      <div class="menu" v-for="(item, idx) in menu_item" :key="idx">
        <div class="menu_item">
          {{ item.name }}
          <div class="sub_menu" v-if="item.sub">
            <div 
              class="sub_item" 
              v-for="(sub, sub_idx) in item.sub" 
              :key="sub_idx"
              @click="selectComponent(sub.component)"
            >
              {{ sub.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <component :is="now_component" v-model:progress="now_progress" @change="changeProgress($event)"></component>
    </div>
  </div>
</template>

<script setup>
import { markRaw, shallowRef,watch,ref } from 'vue'
import loading from './model/loading/loading.vue';
import slide_index from './model/slide_box/slide_index.vue';
import slide_text from './model/slide_box/slide_text.vue';
import drop_menu from './model/drop_down/drop_menu.vue';
import drop_left from './model/drop_down/drop_left.vue';
import slide_img from './model/slide_box/slide_img.vue';
import progress_bar from './model/media/progress_bar.vue';
import heat_map from './model/media/heat_map.vue';
import video_info from './model/media/video_info.vue'
import AnimatedList from './model/drop_down/AnimatedList.vue';

const now_component = shallowRef(null);

const menu_item = [
  {
    name: '滑动栏',
    sub: [
      {
        name: '滑动文本',
        component: markRaw(slide_text)
      },{
        name:'滑动图片',
        component:slide_img
      }
    ]
  },
  {
    name: '下拉菜单',
    sub: [
      {
        name: '下拉菜单',
        component: markRaw(drop_menu)
      },
      {
        name:'侧边栏',
        component: markRaw(drop_left)
      },
      {
        name:'逐级展开列表',
        component:markRaw(AnimatedList)
      }
    ]
  },
  {
    name: '加载',
    sub: [
      {
        name: '加载动画',
        component: markRaw(loading)
      }
    ]
  },{
    name:'多媒体',
    sub:[
      {
        name:'视频信息',
        component:video_info
      },
      {
        name:'图像轮播',
        component:null
      },{
        name:'进度条',
        component:markRaw(progress_bar)
      },
      {
        name:'热力图',
        component:markRaw(heat_map)
      }
    ]
  }
];

const selectComponent = (component) => {
  now_component.value = component;
};

let now_progress=ref(0);
let changeProgress=(val)=>{
  console.log('选择进度',val);
}
watch(now_progress, (newVal) => {
  console.log('监控进度',newVal);
});

</script>

<style scoped lang="scss">
.index {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  
  .menu_box {
    width: 100%;
    height: 60px;
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 100;
    
    .menu {
      position: relative;
      height: 100%;
      
      .menu_item {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 20px;
        cursor: pointer;
        font-weight: 500;
        color: #495057;
        position: relative;
        
        &:hover {
          color: #1971c2;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: #1971c2;
          }
          
          .sub_menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
        }
        
        .sub_menu {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 180px;
          background: white;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
          z-index: 100;
          
          .sub_item {
            padding: 12px 20px;
            color: #495057;
            transition: all 0.2s ease;
            border-radius: 5px;
            &:hover {
              background: #f1f3f5;
              color: #1971c2;
            }
          }
        }
      }
    }
  }
  
  .content {
    flex: 1;
    padding: 20px;
    background: white;
  }
}
</style>