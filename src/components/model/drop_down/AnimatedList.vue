<template>
    <div class="wrapper">
        <button @click="toggleList">
            {{ listVisible ? '收起列表' : '展开列表' }}
        </button>
        <div class="list_box">
            <div class="list" ref="listRef">
                <div v-for="(item, index) in items" :key="index" class="list-item" :data-index="index">
                    {{ item }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
    list: {
        type: Array,
        default: () => ['菜单1', '菜单2', '菜单3', '菜单4', '菜单5']
    },
    direction: {
        type: String,
        default: 'left' // 控制水平方向：'left' | 'right'
    },
    delay: {
        type: Number,
        default: 600 // ms
    },
    delay_time: {
        type: Number,
        default: 40 // ms
    },
    list_expand_direction: {
        type: String,
        default: 'right',
        validator(value) {
            return ['top', 'bottom', 'left', 'right'].includes(value)
        }
    }
})

const listVisible = ref(false)
const listRef = ref(null)
const items = ref([])

const toggleList = async () => {
    if (listVisible.value) {
        await animateOut()
        items.value = []
        listVisible.value = false
    } else {
        items.value = [...props.list]
        listVisible.value = true
        await nextTick()
        animateIn()
    }
}

// 定义方向偏移映射
const directionMap = {
    left: 'translateX(-30px)',
    right: 'translateX(30px)',
    top: 'translateY(-30px)',
    bottom: 'translateY(30px)'
}

const animateIn = () => {
    const els = listRef.value.querySelectorAll('.list-item')
    const delayBetween = Math.max(props.delay_time, props.delay / els.length)
    const transformFrom = directionMap[props.list_expand_direction] || 'translateY(-30px)'

    els.forEach((el, idx) => {
        el.style.transition = 'none'
        el.style.opacity = '0'
        el.style.transform = transformFrom

        setTimeout(() => {
            el.style.transition = 'all 0.3s ease'
            el.style.opacity = '1'
            el.style.transform = 'translate(0, 0)'
        }, idx * delayBetween)
    })
}

const animateOut = async () => {
    const els = Array.from(listRef.value.querySelectorAll('.list-item')).reverse()
    const delayBetween = Math.max(props.delay_time, props.delay / els.length)
    const transformTo = directionMap[props.list_expand_direction] || 'translateY(-30px)'

    return new Promise((resolve) => {
        els.forEach((el, idx) => {
            setTimeout(() => {
                el.style.transition = 'all 0.3s ease'
                el.style.opacity = '0'
                el.style.transform = transformTo
                if (idx === els.length - 1) {
                    setTimeout(resolve, 300)
                }
            }, idx * delayBetween)
        })
    })
}
</script>

<style scoped>
.wrapper {
    width: 300px;
    margin: 20px auto;
    text-align: center;
}

button {
    margin-bottom: 10px;
    padding: 6px 12px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
.list_box{
    position: relative;
}

.list {
    overflow: hidden;
}

.list-item {
    padding: 10px;
    margin-bottom: 6px;
    background-color: #f0f0f0;
    border-radius: 4px;
    cursor: pointer;
}
</style>