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
    
    if (
      formData.severeCkd === null || Number(formData.severeCkd) < 0 || 
      formData.peripheralVascularDisease === null || Number(formData.peripheralVascularDisease) < 0 || 
      formData.atrialFibrillation === null || Number(formData.atrialFibrillation) < 0 || 
      formData.anemia === null || Number(formData.anemia) < 0 || 
      formData.ageOver75 === null || Number(formData.ageOver75) < 0 || 
      formData.heartFailure === null || Number(formData.heartFailure) < 0 || 
      formData.diabetes === null || Number(formData.diabetes) < 0 || 
      formData.chronicTotalOcclusion === null || Number(formData.chronicTotalOcclusion) < 0
    ) {
      return null
    }

    const severeCkd = new Big(formData.severeCkd)
    const peripheralVascularDisease = new Big(formData.peripheralVascularDisease)
    const atrialFibrillation = new Big(formData.atrialFibrillation)
    const anemia = new Big(formData.anemia)
    const ageOver75 = new Big(formData.ageOver75)
    const heartFailure = new Big(formData.heartFailure)
    const diabetes = new Big(formData.diabetes)
    const chronicTotalOcclusion = new Big(formData.chronicTotalOcclusion)

    const totalScore = getResult(severeCkd, peripheralVascularDisease, atrialFibrillation, anemia, ageOver75, heartFailure, diabetes, chronicTotalOcclusion)
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

  const getResult = (severeCkd, peripheralVascularDisease, atrialFibrillation, anemia, ageOver75, heartFailure, diabetes, chronicTotalOcclusion) => {
    let result = severeCkd.plus(peripheralVascularDisease).plus(atrialFibrillation).plus(anemia).plus(ageOver75).plus(heartFailure).plus(diabetes).plus(chronicTotalOcclusion).toNumber()
    return result
  }

  const getStatus = (score) => {
    if (score <= 1) return "green"
    if (score <= 3) return "yellow"
    return "red"
  }

  const getMessage = (score) => {
    let message = ""
    if (score <= 1) message = "イベント発生率は2.4％"
    else if (score <= 3) message = "イベント発生率は3.7％"
    else message = "イベント発生率は7.6％"

    message += "\n（DAPT期間は臨床的に判断する）<a href='clinicalpocket://calculator/31'>出血性リスクも評価</a>"
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