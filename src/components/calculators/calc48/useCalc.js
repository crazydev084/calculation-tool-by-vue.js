import { ref, computed } from 'vue'
import Big from 'big.js'
export function useCalc() {
  const input = ref({})
  
  /**
   * @param {Object} formData - フォームからの入力値
   * @returns {Object} - 計算結果
   */
  const calculateDose = (formData) => {
    if (!formData) return null

    let totalScore = 0

    if (formData.disease === null || Number(formData.disease) < 0 ||
        formData.Coagulation === null || Number(formData.Coagulation) < 0 ||
        formData.Fibrinolysis === null || Number(formData.Fibrinolysis) < 0 ) {
      return null
    }

    const disease = new Big(formData.disease)
    const Coagulation = new Big(formData.Coagulation)
    const Fibrinolysis = new Big(formData.Fibrinolysis)

    totalScore = disease
    .plus(Coagulation)
    .plus(Fibrinolysis)
    .round(2)
    .toFixed(0)
    
    // 結果の配列を返す [スコア, コメント, ステータス]
    const status = getStatus(totalScore)
    const message = getMessage(totalScore)
    
    return {
      data: [
        totalScore,
        message,
        status,
      ]
    }
  }

  const getStatus = (score) => {
    if (score >= 8.0 && score <= 9.0) return 'green'
    return 'yellow'
  }

  const getMessage = (score) => {
    if (score >= 8.0 && score <= 9.0) return '満たす'
    return '-'
  }

  const score = computed(() => calculateDose(input.value))
  const status = computed(() => getStatus(score.value?.data?.[0]))
  const message = computed(() => getMessage(score.value?.data?.[0]))

  return {
    input,
    score,
    status,
    message,
    calculateDose
  }
} 