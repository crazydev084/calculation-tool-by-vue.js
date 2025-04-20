<template>
  <div
    class="fixed w-full bottom-0 overflow-hidden flex flex-col gap-pls-xss p-pls-m text-pls-white bg-pls-blue-600 z-30"
    :class="{
      'bg-pls-red-600': status === 'red',
      'bg-pls-green-600': status === 'green',
      'bg-pls-orange-600': status === 'orange',
      'bg-pls-yellow-green-600': status === 'yellow-green',
      'bg-pls-yellow-600': status === 'yellow',
    }"
  >
    <div class="flex justify-between items-center">
      <div class="flex flex-col w-full" @click="toggleDetails">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="flex justify-start items-end gap-1 text-pls-s leading-pls-body-m text-pls-white"
        >
          <span v-if="item.title" v-html="item.title" class="font-pls-bold"></span>
          <span
            class="text-pls-xxl font-pls-bold pb-[0.1em]"
            v-if="item.value !== null"
            >{{ item.value }}</span
          >
          <span v-if="item.unit">{{ item.unit }}</span>
          <span v-if="item.comment" v-html="formatComment(item.comment)" class="leading-[1.4]"></span>
        </div>
      </div>

      <button
        v-if="items[2]"
        @click="toggleDetails"
        :class="{ 'transform rotate-180': isExpanded }"
      >
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z"></path></svg>
      </button>
    </div>
    <div v-if="isExpanded">
      <div v-if="items[2] && items[2].more" v-html="items[2].more" class="text-pls-s"></div>
      <!-- <div
        class="flex justify-center items-center border border-pls-white rounded-pls-s p-pls-xs mt-pls-s"
      >
        <button
          @click="showDetails"
          class="flex items-center justify-center text-pls-s w-full"
        >
          詳細を見る<img
            class=""
            src="data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_404_3310)'%3e%3cpath%20d='M10.9766%2010.0001L6.85156%205.87511L8.0299%204.69678L13.3332%2010.0001L8.0299%2015.3034L6.85156%2014.1251L10.9766%2010.0001Z'%20fill='white'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_404_3310'%3e%3crect%20width='20'%20height='20'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
          />
        </button>
      </div> -->
    </div>
    <div
      v-if="formattedMessage"
      class="message text-pls-s mt-pls-xs"
      v-html="formattedMessage"
    ></div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'ResultDisplay',
  props: {
    items: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      default: '',
    },
    hasDetails: {
      type: Boolean,
      default: true,
    },
    score: {
      type: [Number, String],
      default: null,
    },
    message: {
      type: String,
      default: '',
    },
  },
  emits: ['show-details'],
  setup(props, { emit }) {
    // 単一の展開状態を管理
    const isExpanded = ref(false);

    // 展開状態の切り替え
    const toggleDetails = () => {
      isExpanded.value = !isExpanded.value;
    };

    const showDetails = () => {
      console.log('詳細を表示イベントを発火します');
      emit('show-details');
    };

    const formattedMessage = computed(() => {
      if (!props.message) return '';
      return props.message.replace(/\n/g, '<br>');
    });

    // コメントの改行を<br>に変換する関数
    const formatComment = (comment) => {
      if (!comment) return '';
      return comment.replace(/\n/g, '<br>');
    };

    return {
      isExpanded,
      toggleDetails,
      showDetails,
      formattedMessage,
      formatComment,
    };
  },
};
</script>

<style scoped>
.result-display {
  transition: all 0.3s ease;
}

/* アニメーション用のクラス */
.rotate-180 {
  transform: rotate(180deg);
}

.message {
  white-space: pre-line;
}
</style>
