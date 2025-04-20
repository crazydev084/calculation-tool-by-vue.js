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
    
    let totalScore = 0
    
    if (formData.sodiumConcentration === null || formData.ureaNitrogenConcentration === null || formData.glucoseConcentration === null) {
      return null
    }

    if (formData.sodiumConcentration < 0 || formData.ureaNitrogenConcentration < 0 || formData.glucoseConcentration < 0) {
      return null
    }

    const sodiumConcentration = new Big(formData.sodiumConcentration)
    const ureaNitrogenConcentration = new Big(formData.ureaNitrogenConcentration)
    const glucoseConcentration = new Big(formData.glucoseConcentration)

    totalScore = Big(2)
    .times(sodiumConcentration)
    .add(ureaNitrogenConcentration.div(2.8))
    .add(glucoseConcentration.div(18))
    .round(2)
    .toFixed(1)

    if (totalScore < 0 || totalScore > 9999.9) {
      totalScore = '-'
    }

    const blowStandardValue = sodiumConcentration
    .add(
      ureaNitrogenConcentration
      .div(2.8)
      .add(
        glucoseConcentration
        .div(18)
      )
      .minus(
        Big(275)
      )
      .div(
        Big(2)
      )
    ).round(0, Big.roundUp).toFixed(0)

    const exceedStandardValue = sodiumConcentration
    .add(
      ureaNitrogenConcentration
      .div(2.8)
      .add(
        glucoseConcentration
        .div(18)
      )
      .minus(
        Big(290)
      )
      .div(
        Big(2)
      )
    ).round(0, Big.roundUp).toFixed(0)
    
    // 結果の配列を返す [スコア, コメント, ステータス]
    const status = getStatus(totalScore)
    const message = getMessage(totalScore)
    const more = getMore(totalScore, blowStandardValue, exceedStandardValue)
    
    return {
      data: [
        totalScore,
        message,
        status,
        more
      ]
    }
  }

  const getStatus = (score) => {
    if (score < 275) return 'green'
    if (score >= 275 && score <= 290) return 'yellow'
    return 'red'
  }

  const getMessage = (score, blowStandardValue, exceedStandardValue) => {
    let message = ''
    if (score < 275) {
      message = '=基準値(275〜290)未満'
    }
    else if (score >= 275 && score <= 290) {
      message = '=基準値(275〜290)'
    }
    else if (score > 290) {
      message = '=基準値(275〜290)超過'
    }
    
    return message
  }

  const getMore = (score, blowStandardValue, exceedStandardValue) => {
    if (score < 275) return ''
    if (score >= 275 && score <= 290) return '※血清Na濃度があと' + blowStandardValue + 'mEq/L低ければ基準値未満'
    if (score > 290) return '※血清Na濃度があと' + exceedStandardValue + 'mEq/L低ければ基準値'
    return ''
  }

  const score = computed(() => calculateDose(input.value))
  const status = computed(() => getStatus(score.value?.data?.[0]))
  const message = computed(() => getMessage(score.value?.data?.[0]))
  const more = computed(() => getMore(score.value?.data?.[0], score.value?.data?.[1], score.value?.data?.[2]))

  return {
    input,
    score,
    status,
    message,
    more,
    calculateDose
  }
} 