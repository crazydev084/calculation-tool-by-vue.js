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
    
    if (!formData.UN1 || !formData.UN2 || !formData.Cr1 || !formData.Cr2 ||
        Number(formData.UN1) === 0 || Number(formData.UN2) === 0 || Number(formData.Cr1) === 0 || Number(formData.Cr2) === 0) {
      return null
    }
    
    const UN1 = new Big(formData.UN1)
    const UN2 = new Big(formData.UN2)
    const Cr1 = new Big(formData.Cr1)
    const Cr2 = new Big(formData.Cr2)

    totalScore = UN2
    .div(UN1)
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
  //   if (score >= 0 && score <= 14) return 'green'
  //   return 'red'
  // }

  const getMessage = (score) => {
    if (score >= 0 && score <= 14) return '尿中Cr/血清Cr<140の場合、FeNa≧0.5％ or FeUN≧55％でSIADHパターンの判断に有用'
    if (score > 14) return '尿中Cr/血清Cr>140の場合、FeNa≧0.15％ or FeUN≧45％でSIADHパターンの判断に有用'
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