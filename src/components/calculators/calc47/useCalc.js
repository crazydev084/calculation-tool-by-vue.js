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

    if (formData.appearance === null || Number(formData.appearance) < 0 ||
        formData.pulse === null || Number(formData.pulse) < 0 ||
        formData.grimace === null || Number(formData.grimace) < 0 ||
        formData.activity === null || Number(formData.activity) < 0 ||
        formData.respiration === null || Number(formData.respiration) < 0) {
      return null
    }

    const appearance = new Big(formData.appearance)
    const pulse = new Big(formData.pulse)
    const grimace = new Big(formData.grimace)
    const activity = new Big(formData.activity)
    const respiration = new Big(formData.respiration)

    totalScore = appearance
    .plus(pulse)
    .plus(grimace)
    .plus(activity)
    .plus(respiration)
    .round(2)
    .toFixed(1)
    
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
    if (score >= 7.0 && score <= 10 ) return 'green'
    if (score >= 4.0 && score <= 6.0) return 'yellow'
    if (score <= 3.0) return 'red'
  }

  const getMessage = (score) => {
    if (score >= 7.0 && score <= 10) return '正常'
    if (score >= 4.0 && score <= 6.0) return '第1度仮死'
    if (score <= 3.0) return '第2度仮死'
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