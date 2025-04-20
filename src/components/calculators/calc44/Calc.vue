<script>
import { ref } from 'vue'
import BaseCalc from '@/components/common/BaseCalc.vue'
import { useCalc } from './useCalc'
import formConfig from './config.json'
import markdownContent from './summary.md'
import explanationContent from './calculation.md'

export default {
  name: 'Calc44',
  components: {
    BaseCalc
  },
  setup() {
    const { calculateDose } = useCalc()
    const resultStatus = ref('green')
    
    // 計算結果を配列形式で格納するための変数
    const resultItems = ref([
      {
        title: "身長：",
        value: ' ',
        unit: "SDスコア"
      },
      {
        title: "体重：",
        value: ' ',
        unit: "SDスコア"
      },
      {
        value: null,
        comment: ""
      },
      {
        title: "頭囲：",
        value: null,
        comment: ""
      }
    ])

    const onCalculated = (result) => {
      if (result && result.data) {
        resultItems.value[0].value = result.data[0]
        resultItems.value[1].value = result.data[1]
        resultItems.value[2].comment = result.data[2]
        resultItems.value[3].value = result.data[4]
        resultStatus.value = result.data[3]
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
      calculatorId: '44',
      calculatorTitle: '小児成長曲線_SDスコア'
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
    @calculated="onCalculated"
  />
</template>

<style lang="scss" scoped>
</style> 