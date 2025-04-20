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
        formData.AbnormalRenal === null || Number(formData.AbnormalRenal) < 0 || 
        formData.liverFunction === null || Number(formData.liverFunction) < 0 || 
        formData.stroke === null || Number(formData.stroke) < 0 || 
        formData.bleeding === null || Number(formData.bleeding) < 0 ||
        formData.unstableInr === null || Number(formData.unstableInr) < 0 ||
        formData.age66OrMore === null || Number(formData.age66OrMore) < 0 ||
        formData.antiplateletOrNsaids === null ||
        formData.alcoholDependence === null) { 
      return null
    }

    const systolicBloodPressure = new Big(formData.systolicBloodPressure)
    const AbnormalRenal = new Big(formData.AbnormalRenal)
    const liverFunction = new Big(formData.liverFunction)
    const stroke = new Big(formData.stroke)
    const bleeding = new Big(formData.bleeding)
    const unstableInr = new Big(formData.unstableInr)
    const age66OrMore = new Big(formData.age66OrMore)
    const antiplateletOrNsaids = new Big(formData.antiplateletOrNsaids)
    const alcoholDependence = new Big(formData.alcoholDependence)
    
    const totalScore = getResult(systolicBloodPressure, AbnormalRenal, liverFunction, stroke, bleeding, unstableInr, age66OrMore, antiplateletOrNsaids, alcoholDependence)
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

  const getResult = (systolicBloodPressure, AbnormalRenal, liverFunction, stroke, bleeding, unstableInr, age66OrMore, antiplateletOrNsaids, alcoholDependence) => {
    let result = systolicBloodPressure.plus(AbnormalRenal).plus(liverFunction).plus(stroke).plus(bleeding).plus(unstableInr).plus(age66OrMore).plus(antiplateletOrNsaids).plus(alcoholDependence).toNumber()
    return result
  }

  const getStatus = (score) => {
    if (score  < 3) {
      return 'green'
    } else {
      return 'red'
    }
  }

  const getMessage = (score) => {
    let message = ''
    if (score < 3) {
      message = '低リスク'
    } else {
      message = '高リスク(抗凝固療法の適用を慎重に判断)'
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