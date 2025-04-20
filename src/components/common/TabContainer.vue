<template>
  <div class="">
    <div class="flex gap-pls-s w-full h-[48px] fixed top-0 bg-white 
    border-b border-b-pls-default z-30">
      <button 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="flex-1 flex items-center justify-center text-[16px] leading-[20px] pointer pt-[3px]"
        :class="{ 
          'text-pls-blue-600 font-pls-bold border-b-[3px] border-pls-blue-600': activeTab === index,
          '': activeTab !== index
        }"
        @click="switchTab(index)"
      >
        {{ tab }}
      </button>
    </div>
    
    <!-- タブの内容部分: すべてのタブコンテンツをレンダリングし、v-showで表示制御 -->
    <div>
      <div v-for="(_, index) in tabs" :key="index" v-show="activeTab === index">
        <slot :name="`tab-${index}`"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'TabContainer',
  props: {
    tabs: {
      type: Array,
      required: true,
      default: () => ['計算', '詳細']
    },
    defaultTab: {
      type: Number,
      default: 0
    }
  },
  emits: ['tab-change'],
  setup(props, { emit }) {
    const activeTab = ref(props.defaultTab)
    
    // タブ切り替え関数
    const switchTab = (index) => {
      activeTab.value = index
      emit('tab-change', index)
      
      // タブ切り替え時にスクロール位置をトップに戻す
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      })
    }

    // 外部から呼び出せる関数として公開
    const switchToTab = (index) => {
      switchTab(index)
    }
    
    return {
      activeTab,
      switchTab,
      switchToTab
    }
  }
}
</script> 