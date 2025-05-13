<template>
  <div class="video-preview">
    <div class="content">
        <div class="video">
            <video
                :src="video_info.video"
                controls
                autoplay
                loop
                muted
                :key="video_info.id"
            >
            </video>
            <div class="video_time">
                <span>00:00</span>
            </div>
        </div>
        <div class="info">
            <span>{{video_info.name}}</span>
        </div>
    </div>
  </div>
</template>


<script setup>
import { ref,onMounted } from 'vue'
import template from './template.mp4'

const props=defineProps({
    video_info:{
        type:Object,
        default:()=>{
            return {
                name:'视频预览',
                video:template,
                id:0,
            }
        }
    }
})

</script>

<style scoped>
  
</style>