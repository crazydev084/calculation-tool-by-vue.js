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
      isNaN(formData.weight) || formData.weight <= 0 ||
      isNaN(formData.administeredDrugAmount) || formData.administeredDrugAmount <= 0 ||
      isNaN(formData.dilutedDrudAmount) || formData.dilutedDrudAmount <= 0 ||
      isNaN(formData.infusionRate) || formData.infusionRate <= 0
    ) return null
    
    const weight = new Big(formData.weight)
    const administeredDrugAmount = new Big(formData.administeredDrugAmount)
    const dilutedDrudAmount = new Big(formData.dilutedDrudAmount)
    const infusionRate = new Big(formData.infusionRate)

    totalScore = infusionRate
    .times(
      administeredDrugAmount.div(
        dilutedDrudAmount
      )
    )
    .times(1000)
    .div(
      weight.times(60)
    ).round(3).toFixed(2)

    if (totalScore < 0 || totalScore > 9999.9) {
      totalScore = '-'
    }
    
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