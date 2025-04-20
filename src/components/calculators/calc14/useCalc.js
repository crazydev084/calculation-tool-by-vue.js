import { ref, computed } from 'vue'
import config from './config.json'
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
    
    if (!formData.spo2 || !formData.fio2 || !formData.respiratoryRate ||
        Number(formData.fio2) === 0 || Number(formData.respiratoryRate) === 0) {
      return null
    }
    
    const spo2 = new Big(formData.spo2)
    const fio2 = new Big(formData.fio2)
    const respiratoryRate = new Big(formData.respiratoryRate)

    totalScore = spo2
    .div(fio2)
    .times(100)
    .div(respiratoryRate)
    .round(3)
    .toFixed(2)

    if (totalScore < 0 || totalScore > 9999.9) {
      return null
    }
    
    // 結果の配列を返す [スコア, コメント, ステータス]
    const status = getStatus(totalScore)
    const message = getMessage(totalScore)
    
    return {
      data: [
        totalScore,
        message,
        status
      ]
    }
  }

  const getStatus = (score) => {
    if (score < 0 || score >= 4.88) return 'green'
    return 'red'
  }

  const getMessage = (score) => {
    if (score >= 0 && score < 4.88) return '気管挿管を検討する'
    if (score >= 4.88) return '気管挿管を積極的に検討しない'
    return ''
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