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
    
    if (formData.congestiveHeartFailure === null || Number(formData.congestiveHeartFailure) < 0 ||
        formData.hematocrit === null || Number(formData.hematocrit) < 0 ||
        formData.ecgAbnormality === null || Number(formData.ecgAbnormality) < 0 ||
        formData.shortnessOfBreath === null || Number(formData.shortnessOfBreath) < 0 ||
        formData.systolicBloodPressure === null || Number(formData.systolicBloodPressure) < 0) {
      return null
    }

    const congestiveHeartFailure = new Big(formData.congestiveHeartFailure)
    const hematocrit = new Big(formData.hematocrit)
    const ecgAbnormality = new Big(formData.ecgAbnormality)
    const shortnessOfBreath = new Big(formData.shortnessOfBreath)
    const systolicBloodPressure = new Big(formData.systolicBloodPressure)
    
    const totalScore = getResult(congestiveHeartFailure, hematocrit, ecgAbnormality, shortnessOfBreath, systolicBloodPressure)
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

  const getResult = (congestiveHeartFailure, hematocrit, ecgAbnormality, shortnessOfBreath, systolicBloodPressure) => {
    let result = congestiveHeartFailure
      .plus(hematocrit)
      .plus(ecgAbnormality)
      .plus(shortnessOfBreath)
      .plus(systolicBloodPressure)
      .toNumber()
    return result
  }

  const getStatus = (score) => {
    if (score <= 0) {
      return 'green'
    }
    return 'red'
  }

  const getMessage = (score) => {
    if (score <= 0) {
      return '失神後7日以内の重篤な合併症発症リスク低'
    }
    return '失神後7日以内の重篤な合併症発症リスク高'
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