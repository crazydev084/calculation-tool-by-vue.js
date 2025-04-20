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
    
    if (formData.systolicBloodPressure === null || Number(formData.systolicBloodPressure) < 0 || 
      formData.bun === null || Number(formData.bun) < 0 || 
      formData.sodium === null || Number(formData.sodium) < 0 || 
      formData.age === null || Number(formData.age) < 0 || 
      formData.heartRate === null || Number(formData.heartRate) < 0 || 
      formData.blackRace === null || Number(formData.blackRace) < 0 || 
      formData.copd === null || Number(formData.copd) < 0) {
      return null
    }

    const systolicBloodPressure = new Big(formData.systolicBloodPressure)
    const bun = new Big(formData.bun)
    const sodium = new Big(formData.sodium)
    const age = new Big(formData.age)
    const heartRate = new Big(formData.heartRate)
    const blackRace = new Big(formData.blackRace)
    const copd = new Big(formData.copd)
    
    const totalScore = getResult(age, heartRate, systolicBloodPressure, bun, sodium, blackRace, copd)
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

  const getResult = (age, heartRate, systolicBloodPressure, bun, sodium, blackRace, copd) => {
    let result = age.plus(heartRate).plus(systolicBloodPressure).plus(bun).plus(sodium).plus(blackRace).plus(copd).toNumber()
    return result
  }

  const getStatus = (score) => {
    if (score <= 33) {
      return 'green'
    } else if (score > 33 && score <= 61) {
      return 'yellow-green'
    } else if (score > 61 && score <= 70) {
      return 'yellow'
    } else if (score > 70 && score <= 78) {
      return 'orange'
    } else if (score > 78) {
      return 'red'
    }
    return 'green'
  }

  const getMessage = (score) => {
    if (score <= 33) {
      return '予測院内死亡率は1％未満'
    } else if (score <= 50) {
      return '予測院内死亡率は1-5％'
    } else if (score <= 57) {
      return '予測院内死亡率は5-10％'
    } else if (score <= 61) {
      return '予測院内死亡率は10-15％'
    } else if (score <= 65) {
      return '予測院内死亡率は15-20％'
    } else if (score <= 70) {
      return '予測院内死亡率は20-30％'
    } else if (score <= 74) {
      return '予測院内死亡率は30-40％'
    } else if (score <= 78) {
      return '予測院内死亡率は40-50％'
    } else if (score > 78) {
      return '予測院内死亡率は50％以上'
    }
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