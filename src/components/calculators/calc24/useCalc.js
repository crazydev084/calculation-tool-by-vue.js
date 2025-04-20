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
        formData.hypertension === null || Number(formData.hypertension) < 0 || 
        formData.age === null || Number(formData.age) < 0 || 
        formData.diabetesMellitus === null || Number(formData.diabetesMellitus) < 0 || 
        formData.strokeTiaHistory === null || Number(formData.strokeTiaHistory) < 0) {
      return null
    }

    const congestiveHeartFailure = new Big(formData.congestiveHeartFailure)
    const hypertension = new Big(formData.hypertension)
    const age = new Big(formData.age)
    const diabetesMellitus = new Big(formData.diabetesMellitus)
    const strokeTiaHistory = new Big(formData.strokeTiaHistory)
    
    const totalScore = getResult(congestiveHeartFailure, hypertension, age, diabetesMellitus, strokeTiaHistory)
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

  const getResult = (congestiveHeartFailure, hypertension, age, diabetesMellitus, strokeTiaHistory) => {
    let result = congestiveHeartFailure.plus(hypertension).plus(age).plus(diabetesMellitus).plus(strokeTiaHistory).toNumber()
    return result
  }

  const getStatus = (score) => {
    if (score === 0) {
      return 'green'
    } else if (score >= 1) {
      return 'red'
    } else {
      return 'blue'
    }
  }

  const getMessage = (score) => {
    let message = ''
    if (score === 0) {
      message = 'リスク因子があればDOACまたはワルファリン考慮可'
    } else if (score >= 1) {
      message = 'DOAC推奨、ワルファリン考慮可'
    } else {
      message = ''
    }

    if (score === 0) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：0.5％'
    } else if (score === 1) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：0.9％'
    } else if (score === 2) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：1.5％'
    } else if (score === 3) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：2.7％'
    } else if (score === 4) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：6.1％'
    } else if (score === 5) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：3.9％'
    } else if (score === 6) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：7.2％'
    } else {
      message = ''
    }
    return message
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