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
        formData.strokeHistory === null || Number(formData.strokeHistory) < 0 ||
        formData.vascularDisease === null || Number(formData.vascularDisease) < 0 ||
        formData.sexCategory === null || Number(formData.sexCategory) < 0) {
      return null
    }

    const congestiveHeartFailure = new Big(formData.congestiveHeartFailure)
    const hypertension = new Big(formData.hypertension)
    const age = new Big(formData.age)
    const diabetesMellitus = new Big(formData.diabetesMellitus)
    const strokeHistory = new Big(formData.strokeHistory)
    const vascularDisease = new Big(formData.vascularDisease)
    const sexCategory = new Big(formData.sexCategory)
    
    const totalScore = getResult(congestiveHeartFailure, hypertension, age, diabetesMellitus, strokeHistory, vascularDisease, sexCategory)
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

  const getResult = (congestiveHeartFailure, hypertension, age, diabetesMellitus, strokeHistory, vascularDisease, sexCategory) => {
    let result = congestiveHeartFailure.plus(hypertension).plus(age).plus(diabetesMellitus).plus(strokeHistory).plus(vascularDisease).plus(sexCategory).toNumber()
    return result
  }

  const getStatus = (score) => {
    if (score >= 0 && score < 2) {
      return 'green'
    } else if (score >= 2) {
      return 'red'
    } else {
      return 'blue'
    }
  }

  const getMessage = (score) => {
    let message = ''
    if (score >= 0 && score < 2) {
      message = 'CHADS<sub>2</sub>スコアと合わせて評価する'
    } else if (score >= 2) {
      message = '抗凝固療法を検討する'
    } else {
      message = ''
    }

    if (score === 0) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：0％'
    } else if (score === 1) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：1.3％'
    } else if (score === 2) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：2.2％'
    } else if (score === 3) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：3.2％'
    } else if (score === 4) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：4.0％'
    } else if (score === 5) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：6.7％'
    } else if (score === 6) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：9.8％'
    } else if (score === 7) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：9.6％'
    } else if (score === 8) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：6.7％'
    } else if (score === 9) {
      message += '\n抗凝固療法未施行例における脳梗塞発症率：15.2％'
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