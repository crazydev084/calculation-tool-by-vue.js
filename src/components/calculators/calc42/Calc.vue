<script>
import { ref } from 'vue'
import BaseCalc from '@/components/common/BaseCalc.vue'
import { useCalc } from './useCalc'
import formConfig from './config.json'
import markdownContent from './summary.md'
import explanationContent from './calculation.md'

export default {
  name: 'Calc42',
  components: {
    BaseCalc
  },
  setup() {
    const { calculateDose } = useCalc()
    // const resultStatus = ref('green')
    
    // 計算結果を配列形式で格納するための変数
    const resultItems = ref([
      {
        title: "FeUA",
        value: '-',
        unit: "%"
      },
      {
        value: null,
        comment: ""
      }
    ])

    const onCalculated = (result) => {
      if (result && result.data) {
        resultItems.value[0].value = result.data[0]
        resultItems.value[1].comment = result.data[1]
      }
    }

    return {
      formConfig,
      calculateFunction: calculateDose,
      resultItems,
      onCalculated,
      markdownContent,
      explanationContent,
      calculatorId: '42',
      calculatorTitle: 'FeUA'
    }
  }
}
</script>

<template>
  <BaseCalc
    :calculator-id="calculatorId"
    :calculator-title="calculatorTitle"
    :form-config="formConfig"
    :calculation-function="calculateFunction"
    :result-items="resultItems"
    :explanation-content="explanationContent"
    :markdown-content="markdownContent"
    @calculated="onCalculated"
  />
</template>

<style lang="scss" scoped>
</style> 