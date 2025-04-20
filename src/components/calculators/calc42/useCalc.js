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
    
    if (!formData.UA1 || !formData.UA2 || !formData.Cr1 || !formData.Cr2 ||
        Number(formData.UA1) === 0 || Number(formData.UA2) === 0 || Number(formData.Cr1) === 0 || Number(formData.Cr2) === 0) {
      return null
    }
    
    const UA1 = new Big(formData.UA1)
    const UA2 = new Big(formData.UA2)
    const Cr1 = new Big(formData.Cr1)
    const Cr2 = new Big(formData.Cr2)

    totalScore = UA2
    .div(UA1)
    .times(Cr1)
    .div(Cr2)
    .times(100)
    .round(3)
    .toFixed(2)

    if (totalScore < 0 || totalScore > 9999.9) {
      return null
    }
    
    // 結果の配列を返す [スコア, コメント, ステータス]
    // const status = getStatus(totalScore)
    const message = getMessage(totalScore)
    
    return {
      data: [
        totalScore,
        message,
        // status
      ]
    }
  }

  // const getStatus = (score) => {
  //   if (score >= 0 && score <= 11) return 'green'
  //   return 'red'
  // }

  const getMessage = (score) => {
    if (score >= 0 && score <= 11) return 'SIADHとRSWの鑑別に有用。<br><small>Na補正後に<11％となればSIADH、そのままならRSWの可能性が高い</small>'
    if (score > 11) return 'SIADHとRSWの鑑別に有用。'
    return ''
  }

  const score = computed(() => calculateDose(input.value))
  // const status = computed(() => getStatus(score.value?.data?.[0]))
  const message = computed(() => getMessage(score.value?.data?.[0]))

  return {
    input,
    score,
    // status,
    message,
    calculateDose
  }
} 