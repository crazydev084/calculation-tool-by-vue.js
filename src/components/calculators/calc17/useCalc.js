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
    
    if (formData.weight === null || formData.height === null || formData.age === null) {
      return null
    }
    if (formData.weight <= 0 || formData.height <= 0 || formData.age < 0) {
      return null
    }

    const gender = Number(formData.gender)
    const weight = new Big(formData.weight)
    const height = new Big(formData.height)
    const age = new Big(formData.age)

    const totalScore = getResult(weight, height, age, gender)
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

  const getResult = (weight, height, age, gender) => {
    let result = 0
    if (gender === 0) {
      result = Big(66.5)
          .add(Big(13.75).times(weight))
          .add(Big(5.0).times(height))
          .minus(Big(6.76).times(age))
          .round(1)
          .toFixed(0)
    }
    else if (gender === 1) {
      result = Big(655.1)
          .add(Big(9.56).times(weight))
          .add(Big(1.85).times(height))
          .minus(Big(4.68).times(age))
          .round(1)
          .toFixed(0)
    }

    if (result < 0 || result > 9999.9) {
      result = '-'
    }

    return result
  }

  const getStatus = (score) => {
    return 'blue'
  }

  const getMessage = (score) => {
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