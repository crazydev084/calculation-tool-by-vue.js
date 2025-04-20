<script>
import { ref } from 'vue'
import BaseCalc from '@/components/common/BaseCalc.vue'
import { useCalc } from './useCalc'
import formConfig from './config.json'
import markdownContent from './summary.md'
import explanationContent from './calculation.md'

export default {
  name: 'Calc41',
  components: {
    BaseCalc
  },
  setup() {
    const { calculateDose } = useCalc()
    const resultStatus = ref('green')
    // 計算結果を配列形式で格納するための変数
    const resultItems = ref([
      {
        title: "新DIC診断スコア：",
        value: 0,
        unit: "点(基本型)"
      },
      {
        title: "新DIC診断基準を",
        value: null,
        comment: ""
      },
      {
        title: "新DIC診断スコア：",
        value: 0,
        unit: "点(造血障害型)"
      },
      {
        title: "新DIC診断基準を",
        value: null,
        comment: ""
      },
      {
        title: "新DIC診断スコア：",
        value: 0,
        unit: "点(感染症型)"
      },
      {
        title: "新DIC診断基準を",
        value: null,
        comment: ""
      }
    ])

    const onCalculated = (result) => {
      if (result && result.data) {
        resultItems.value[0].value = result.data[0]
        resultItems.value[1].comment = result.data[3]
        resultItems.value[2].value = result.data[1]
        resultItems.value[3].comment = result.data[4]
        resultItems.value[4].value = result.data[2]
        resultItems.value[5].comment = result.data[5]
        resultStatus.value = result.data[6]
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
      calculatorId: '41',
      calculatorTitle: 'DIC'
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