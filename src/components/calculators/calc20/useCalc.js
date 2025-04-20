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
        formData.anginaSymptoms === null || Number(formData.anginaSymptoms) < 0 ||
        formData.aspirinUse === null || Number(formData.aspirinUse) < 0 ||
        formData.coronaryRiskFactors === null || Number(formData.coronaryRiskFactors) < 0 ||
        formData.coronaryStenosis === null || Number(formData.coronaryStenosis) < 0 ||
        formData.stElevation === null || Number(formData.stElevation) < 0 ||
        formData.biomarkerElevation === null || Number(formData.biomarkerElevation) < 0) {
      return null
    }

    const age = new Big(formData.age)
    const anginaSymptoms = new Big(formData.anginaSymptoms)
    const aspirinUse = new Big(formData.aspirinUse)
    const coronaryRiskFactors = new Big(formData.coronaryRiskFactors)
    const coronaryStenosis = new Big(formData.coronaryStenosis)
    const stElevation = new Big(formData.stElevation)
    const biomarkerElevation = new Big(formData.biomarkerElevation)
    
    const totalScore = getResult(age, anginaSymptoms, aspirinUse, coronaryRiskFactors, coronaryStenosis, stElevation, biomarkerElevation)
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

  const getResult = (age, anginaSymptoms, aspirinUse, coronaryRiskFactors, coronaryStenosis, stElevation, biomarkerElevation) => {
    let result = age
      .plus(anginaSymptoms)
      .plus(aspirinUse)
      .plus(coronaryRiskFactors)
      .plus(coronaryStenosis)
      .plus(stElevation)
      .plus(biomarkerElevation)
      .toNumber()
    return result
  }

  const getStatus = (score) => {
    if (score <= 1) {
      return 'green'
    } else if (score === 2 || score === 3) {
      return 'yellow-green'
    } else if (score === 4) {
      return 'yellow'
    } else if (score === 5) {
      return 'orange'
    }
    return 'red'
  }

  const getMessage = (score) => {
    if (score === 0) {
      return '30日以内死亡,急性心筋梗塞発生率1.4％'
    } else if (score === 1) {
      return '30日以内死亡,急性心筋梗塞発生率0.7％'
    } else if (score === 2) {
      return '30日以内死亡,急性心筋梗塞発生率3.2％'
    } else if (score === 3) {
      return '30日以内死亡,急性心筋梗塞発生率3.7％'
    } else if (score === 4) {
      return '30日以内死亡,急性心筋梗塞発生率7.0％'
    } else if (score === 5) {
      return '30日以内死亡,急性心筋梗塞発生率16.0％'
    } else if (score > 5) {
      return '30日以内死亡,急性心筋梗塞発生率34.1％'
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