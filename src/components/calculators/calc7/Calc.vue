<script>
import { ref } from 'vue'
import BaseCalc from '@/components/common/BaseCalc.vue'
import { useCalc } from './useCalc'
import formConfig from './config.json'
import markdownContent from './summary.md'
import explanationContent from './calculation.md'
import tipsContent from './tips.md'

export default {
  name: 'Calc7',
  components: {
    BaseCalc
  },
  setup() {
    const { calculateDose } = useCalc()
    const resultStatus = ref('')
    
    // 計算結果を配列形式で格納するための変数
    const resultItems = ref([
      {
        title: "Well’s criteria",
        value: 0,
        unit: "点"
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
        resultStatus.value = result.data[2]
      }
    }

    return {
      formConfig,
      calculateFunction: calculateDose,
      resultItems,
      resultStatus,
      onCalculated,
      markdownContent,
      explanationContent,
      tipsContent,
      calculatorId: '7',
      calculatorTitle: 'Wellscriteria'
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
    :result-status="resultStatus"
    :explanation-content="explanationContent"
    :markdown-content="markdownContent"
    :tips-content="tipsContent"
    @calculated="onCalculated"
  />
</template>

<style lang="scss" scoped>
</style> 