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
      formData.heartFailure === null || Number(formData.heartFailure) < 0 || 
      formData.thrombocytopenia === null || Number(formData.thrombocytopenia) < 0 || 
      formData.atrialFibrillation === null || Number(formData.atrialFibrillation) < 0 || 
      formData.myocardialInfarctionHistory === null || Number(formData.myocardialInfarctionHistory) < 0 || 
      formData.malignantTumor === null || Number(formData.malignantTumor) < 0
    ) {
      return null
    }

    const severeCkd = new Big(formData.severeCkd)
    const peripheralVascularDisease = new Big(formData.peripheralVascularDisease)
    const heartFailure = new Big(formData.heartFailure)
    const atrialFibrillation = new Big(formData.atrialFibrillation)
    const thrombocytopenia = new Big(formData.thrombocytopenia)
    const myocardialInfarctionHistory = new Big(formData.myocardialInfarctionHistory)
    const malignantTumor = new Big(formData.malignantTumor)

    const totalScore = getResult(severeCkd, peripheralVascularDisease, atrialFibrillation, thrombocytopenia, myocardialInfarctionHistory, malignantTumor, heartFailure)
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

  const getResult = (severeCkd, peripheralVascularDisease, atrialFibrillation, thrombocytopenia, myocardialInfarctionHistory, malignantTumor, heartFailure) => {
    let result = severeCkd.plus(peripheralVascularDisease).plus(atrialFibrillation).plus(thrombocytopenia).plus(myocardialInfarctionHistory).plus(malignantTumor).plus(heartFailure).toNumber()
    return result
  }

  const getStatus = (score) => {
    if (score === 0) return "green"
    if (score <= 2) return "yellow"
    return "red"
  }

  const getMessage = (score) => {
    let message = ""
    if (score === 0) message = "イベント発生率は2.3％"
    else if (score <= 2) message = "イベント発生率は4.1％"
    else message = "イベント発生率は8.8％"

    message += "\n（DAPT期間は臨床的に判断する）<a href='clinicalpocket://calculator/30'>血栓性リスクも評価</a>"
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