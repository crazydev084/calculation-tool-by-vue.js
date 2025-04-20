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
    
    // 各フィールドの値を合算
    Object.entries(formData).forEach(([key, value]) => {
      totalScore += Number(value)
    })
    
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
    if (score < 10) return 'green'
    if (score === 10) return 'yellow'
    return 'red'
  }

  const getMessage = (score) => {
    if (score < 10) return 'ICU入室時死亡率33%以下'
    if (score === 10) return 'ICU入室時死亡率33%以上'
    return 'ICU入室時死亡率95%'
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