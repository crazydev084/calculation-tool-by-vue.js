<script>
import { ref } from 'vue'
import BaseCalc from '@/components/common/BaseCalc.vue'
import { useCalc } from './useCalc'
import formConfig from './config.json'
import markdownContent from './summary.md'
import explanationContent from './calculation.md'

export default {
  name: 'Calc1',
  components: {
    BaseCalc
  },
  setup() {
    const { calculateDose } = useCalc()
    
    // 計算結果を配列形式で格納するための変数
    const resultItems = ref([
      {
        title: "予測上昇Hb値",
        value: "-",
        unit: "g/dL"
      },
      {
        title: "投入するRCC",
        value: "-",
        unit: "単位"
      }
    ])
    
    const onCalculated = (result) => {
      resultItems.value[0].value = result.data[0]
      resultItems.value[1].value = result.data[1]
    }

    return {
      formConfig,
      calculateFunction: calculateDose,
      resultItems,
      onCalculated,
      markdownContent,
      explanationContent,
      calculatorId: '1',
      calculatorTitle: '赤血球輸血によるHbの上昇予測'
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