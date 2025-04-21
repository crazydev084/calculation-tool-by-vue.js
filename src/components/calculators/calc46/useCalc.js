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
    
    const age = new Big(formData.age || 0).round(3).toFixed(0)
    const abdomen1 = new Big(formData.abdomen || 0)
    const abdomen2 = new Big(formData.abdomen1 || 0)
    const trapping = new Big(formData.tapping || 0)
    const appetite = new Big(formData.vomiting || 0)
    const fever = new Big(formData.appetite || 0)
    const diabetes = new Big(formData.fever || 0)
    const blood = new Big(formData.blood || 0)
    const neutrophil = new Big(formData.neutrophil || 0)

    totalScore = abdomen1
    .plus(abdomen2)
    .plus(trapping)
    .plus(appetite)
    .plus(fever)
    .plus(diabetes)
    .plus(blood)
    .plus(neutrophil)
    .round(3)
    .toFixed(0)

    if (totalScore < 0 || totalScore > 9999.9) {
      return null
    }
    // 結果の配列を返す [スコア, コメント, ステータス]
    const status = getStatus(totalScore,age)
    const message = getMessage(totalScore,age)
    
    return {
      data: [
        totalScore,
        message,
        status
      ]
    }
  }
  

  const getStatus = (score,age) => {
    if (age == 0) return 'green'
    else{
      if (score >= 0 && score < 4) return 'blue'
      else if (score >= 4 && score < 7) return 'yellow'
      else return 'red'
    }
  }

  const getMessage = (score,age) => {
    if (age == 0) return 'PAS対象外'
    else{
      if (score >= 0 && score < 4) return '低リスク'
      else if (score >= 4 && score < 7) return '中リスク'
      else if (score >= 7 && score < 11) return '高リスク'
      else return 'PAS対象外'
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