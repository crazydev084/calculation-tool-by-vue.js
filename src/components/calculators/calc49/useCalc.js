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

    if (formData.back === null || Number(formData.back) < 0 ||
        formData.station === null || Number(formData.station) < 0 ||
        formData.hard === null || Number(formData.hard) < 0 ||
        formData.open === null || Number(formData.open) < 0 ||
        formData.position === null || Number(formData.position) < 0) {
      return null
    }

    const back = new Big(formData.back)
    const station = new Big(formData.station)
    const hard = new Big(formData.hard)
    const open = new Big(formData.open)
    const position = new Big(formData.position)

    totalScore = back
    .plus(station)
    .plus(hard)
    .plus(open)
    .plus(position)
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
    if (score >= 7.0 && score <= 13.0) return 'green'
    if (score > 0 && score <= 6.0) return 'red'
    return 'blue'
  }

  const getMessage = (score) => {
    if (score >= 7.0 && score <= 13.0) return '頸管熟化は良好。自然分娩や分娩誘発を検討する。'
    if (score > 0 && score <= 6.0) return '頸管熟化は不良。熟化促進や分娩誘発の延期を検討する。'
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