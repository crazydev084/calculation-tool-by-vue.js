<template>
  <div>
    <!-- 数値入力フィールド -->
    <input 
      v-if="field.type === 'number'" 
      :id="field.id"
      v-model="fieldModelValue"
      :type="field.type"
      :step="field.step"
      :min="field.min"
      :max="field.max"
      :placeholder="field.placeholder"
      class="mt-1 block w-full rounded-md border-pocket-border p-2 border h-[42px]"
    />
    
    <!-- Select -->
    <div v-else-if="field.type === 'select'" class="relative">
      <select 
        :id="field.id"
        v-model="fieldModelValue"
        class="appearance-none mt-1 block w-full rounded-md border-pocket-border p-2 border h-[42px] pr-10 focus:outline-none focus:ring-1 focus:ring-pocket-border-blue bg-white"
      >
        <option 
          v-for="option in field.options" 
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }} {{ option.value ? `(${option.value})` : '' }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pls-object-secondary">
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path></svg>
      </div>
    </div>

    <!-- ラジオボタングループ -->
    <div v-else-if="field.type === 'radio'" class="flex">
      <!-- 2個以下の場合は横並び -->
      <div v-if="field.options.length <= 2 && field.mode !== 'vertical'" 
           class="relative flex flex-row w-full rounded overflow-hidden">
        <div 
          v-for="(option, index) in field.options" 
          :key="option.value"
          class="group relative flex-1 min-w-[44px]"
        >
          <input
            :id="`${field.id}_${option.value}`"
            type="radio"
            :name="field.id"
            :value="option.value"
            v-model="fieldModelValue"
            :required="field.required"
            class="peer hidden"
          />
          <label 
            :for="`${field.id}_${option.value}`"
            class="flex items-center justify-between w-full p-[8px] cursor-pointer border transition-all duration-200 z-10"
            :class="[
              index > 0 ? '-ml-[1px]' : '',
              fieldModelValue == option.value 
                ? 'bg-pls-active-primary border-blue-500 text-pls-object-link z-20 shadow-sm group-first:rounded-l group-last:rounded-r relative' 
                : 'border-pocket-border text-pls-object-secondary hover:bg-gray-50 group-first:rounded-l group-last:rounded-r'
            ]"
            v-html="formatOptionLabel(option.label, option.value, field.showValue)"
          >
          </label>
        </div>
      </div>
      
      <!-- 3個以上の場合は縦並び -->
      <div v-else class="relative flex flex-col w-full rounded overflow-hidden">
        <div 
          v-for="(option, index) in field.options" 
          :key="option.value"
          class="group relative flex-1 min-w-[44px]"
        >
          <input
            :id="`${field.id}_${option.value}`"
            type="radio"
            :name="field.id"
            :value="option.value"
            v-model="fieldModelValue"
            :required="field.required"
            class="peer hidden"
          />
          <label 
            :for="`${field.id}_${option.value}`"
            class="flex items-center justify-between w-full p-[8px] cursor-pointer border transition-all duration-200 z-10"
            :class="[
              index > 0 ? '-mt-[1px]' : '',
              fieldModelValue == option.value 
                ? 'bg-pls-active-primary border-blue-500 text-pls-object-link z-20 shadow-sm group-first:rounded-t group-last:rounded-b relative' 
                : 'border-pocket-border text-pls-object-secondary group-first:rounded-t group-last:rounded-b'
            ]"
            v-html="formatOptionLabel(option.label, option.value, field.showValue)"
          >
          </label>
        </div>
      </div>
    </div>

    <!-- チェックボックス -->
    <div v-else-if="field.type === 'checkbox'">
      <input
        :id="field.id"
        type="checkbox"
        v-model="fieldModelValue"
        :required="field.required"
      />
      <label :for="field.id">{{ field.label }}</label>
    </div>

    <!-- テキスト入力 -->
    <input 
      v-else-if="field.type === 'text'" 
      :id="field.id"
      v-model="fieldModelValue"
      type="text"
      :placeholder="field.placeholder"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
    />

    <!-- 未対応のフィールドタイプ -->
    <div v-else class="text-red-500">
      未対応のフィールドタイプ: {{ field.type }}
    </div>

    <span 
        v-if="field.suffix" 
        class="text-xs text-gray-500"
        v-html="field.suffix"
      ></span>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FormField',
  props: {
    field: {
      type: Object,
      required: true
    },
    modelValue: {
      type: [String, Number, Boolean, Object],
      default: null
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // 双方向バインディングの実装
    const fieldModelValue = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    // 改行文字を<br>タグに変換する関数
    const formatOptionLabel = (label, value, showValue) => {
      if (!label) label = '';
      label = label.replace(/\n/g, '<br>');
      if (Number.isInteger(value) && value > 0) {
        value = '+' + value;
      }
      if (showValue === false) {
        return label;
      } else {
        return label + '<span>' + value + '</span>';
      }
    }

    return {
      fieldModelValue,
      formatOptionLabel
    }
  }
}
</script>

<style lang="scss" scoped>
</style> 