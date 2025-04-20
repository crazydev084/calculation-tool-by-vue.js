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
    
    if (
      isNaN(formData.age) || formData.age < 0 ||
      isNaN(formData.weight) || formData.weight <= 0 ||
      isNaN(formData.serumCreatinine) || formData.serumCreatinine <= 0
    ) return null
    
    const gender = new Big(formData.gender)
    const age = new Big(formData.age)
    const weight = new Big(formData.weight)
    const serumCreatinine = new Big(formData.serumCreatinine)

    totalScore = Big(140)
    .minus(age)
    .times(weight)
    .times(gender.eq(0) ? 1 : 0.85)
    .div(Big(72).times(serumCreatinine))
    .round(2)
    .toFixed(1)
    
    // 結果の配列を返す [スコア, コメント, ステータス]
    const status = 'blue'
    const message = ''
    
    return {
      data: [
        totalScore,
        message,
        status
      ]
    }
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