import { ref, computed } from 'vue'
import config from './config.json'
import Big from 'big.js'
export function useCalc() {
  const input = ref({})
  
  /**
   * Glasgow-Blatchford スコアを計算する関数
   * @param {Object} formData - フォームからの入力値
   * @returns {Object} - 計算結果
   */
  const calculateDose = (formData) => {
    if (!formData) return null
    
    let totalScore = 0
    let subScore = 0

    if (
      !formData.targetDose || formData.targetDose < 0 || isNaN(formData.targetDose) ||
      !formData.weight || formData.weight < 0 || isNaN(formData.weight) ||
      !formData.administeredDrugAmount || formData.administeredDrugAmount < 0 || isNaN(formData.administeredDrugAmount) ||
      !formData.dilutedDrudAmount || formData.dilutedDrudAmount < 0 || isNaN(formData.dilutedDrudAmount)
    ) return null

    const targetDose = new Big(formData.targetDose)
    const weight = new Big(formData.weight)
    const administeredDrugAmount = new Big(formData.administeredDrugAmount)
    const dilutedDrudAmount = new Big(formData.dilutedDrudAmount)

    totalScore = targetDose
    .times(weight)
    .times(60)
    .div(administeredDrugAmount.div(dilutedDrudAmount)
    .times(1000))
    .round(3)
    .toFixed(2);

    subScore = administeredDrugAmount
    .div(dilutedDrudAmount)
    .times(1000)
    .div(weight)
    .div(60)
    .round(3)
    .toFixed(2);

    if (totalScore < 0 || totalScore > 9999.9) return null
    
    // 結果の配列を返す [スコア, コメント, ステータス]
    const status = 'blue'
    const message = getMessage(subScore)
    
    return {
      data: [
        totalScore,
        message,
        status
      ]
    }
  }

  const getMessage = (subScore) => {
    if (subScore < 0 || subScore > 9999.9) return '-'
    return '1ml/hrあげると、' + subScore + 'γ上昇'
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