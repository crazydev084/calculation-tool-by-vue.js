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
    
    if (formData.age === null || Number(formData.age) < 0 ||
        formData.bloodPressure === null || Number(formData.bloodPressure) < 0 || 
        formData.clinicalFeatures === null || Number(formData.clinicalFeatures) < 0 || 
        formData.duration === null || Number(formData.duration) < 0 || 
        formData.diabetes === null || Number(formData.diabetes) < 0) {
      return null
    }

    const age = new Big(formData.age)
    const bloodPressure = new Big(formData.bloodPressure)
    const clinicalFeatures = new Big(formData.clinicalFeatures)
    const duration = new Big(formData.duration)
    const diabetes = new Big(formData.diabetes)
    
    const totalScore = getResult(age, bloodPressure, clinicalFeatures, duration, diabetes)
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

  const getResult = (age, bloodPressure, clinicalFeatures, duration, diabetes) => {
    let result = age
      .plus(bloodPressure)
      .plus(clinicalFeatures)
      .plus(duration)
      .plus(diabetes)
      .toNumber()
    return result
  }

  const getStatus = (score) => {
    if (score <= 3) {
      return 'green'
    } else if (score === 4 || score === 5) {
      return 'yellow'
    } else {
      return 'red'
    }
  }

  const getMessage = (score) => {
    if (score <= 3) {
      return '48時間以内の脳梗塞発症率は1％'
    } else if (score === 4 || score === 5) {
      return '48時間以内の脳梗塞発症率は4.1％'
    } else {
      return '48時間以内の脳梗塞発症率は8.1％'
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