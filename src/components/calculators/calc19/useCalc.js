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
    
    if (formData.woundCharacteristics === null || Number(formData.woundCharacteristics) < 0 ||
        formData.tetanusVaccinationHistory === null || Number(formData.tetanusVaccinationHistory) < 0) {
      return null
    }

    const woundCharacteristics = new Big(formData.woundCharacteristics)
    const tetanusVaccinationHistory = new Big(formData.tetanusVaccinationHistory)

    const totalScore = getResult(woundCharacteristics, tetanusVaccinationHistory)
    const status = getStatus(totalScore)
    const message = getMessage(totalScore)
    
    return {
      data: [
        '',
        message,
        status
      ]
    }
  }

  const getResult = (woundCharacteristics, tetanusVaccinationHistory) => {
    let result = woundCharacteristics.plus(tetanusVaccinationHistory).toNumber()
    return result
  }

  const getStatus = (score) => {
    return 'blue'
  }

  const getMessage = (score) => {
    if (score === 11) {
      return "◯最終接種から5年以上経過している場合、\n　破傷風トキソイドを1回接種\n◯最終接種から5年未満の場合、\n　接種不要"
    } else if (score === 12) {
      return "◯最終接種から10年以上経過している場合、\n　破傷風トキソイドを1回接種\n◯最終接種から10年未満の場合、\n　接種不要"
    } else if (score === 21) {
      return "◯抗破傷風人免疫グロブリン(TIG)使用\n◯破傷風トキソイドを次の手順で3回接種する。\n・受傷時に1回目接種\n・1回目の3〜8週後に2回目接種\n・2回目の6〜18か月後に3回目接種"
    } else if (score === 22) {
      return "◯破傷風トキソイドを次の手順で3回接種する。\n・受傷時に1回目接種\n・1回目の3〜8週後に2回目接種\n・2回目の6〜18か月後に3回目接種"
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