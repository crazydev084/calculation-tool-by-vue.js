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
    
    if (formData.urineSodiumConcentration === null || formData.urineCreatinineConcentration === null || formData.serumSodiumConcentration === null || formData.serumCreatinineConcentration === null) {
      return null
    }
    if (formData.urineSodiumConcentration <= 0 || formData.urineCreatinineConcentration <= 0 || formData.serumSodiumConcentration <= 0 || formData.serumCreatinineConcentration <= 0) {
      return null
    }
    if (formData.urineSodiumConcentration > 9999.9 || formData.urineCreatinineConcentration > 9999.9 || formData.serumSodiumConcentration > 9999.9 || formData.serumCreatinineConcentration > 9999.9) {
      return null
    }

    const urineSodiumConcentration = new Big(formData.urineSodiumConcentration)
    const urineCreatinineConcentration = new Big(formData.urineCreatinineConcentration)
    const serumSodiumConcentration = new Big(formData.serumSodiumConcentration)
    const serumCreatinineConcentration = new Big(formData.serumCreatinineConcentration)

    const totalScore = getResult(urineSodiumConcentration, urineCreatinineConcentration, serumSodiumConcentration, serumCreatinineConcentration)
    const status = getStatus(totalScore)
    const message = getMessage(totalScore)
    const more = getMore(totalScore, urineSodiumConcentration, urineCreatinineConcentration, serumSodiumConcentration, serumCreatinineConcentration)
    return {
      data: [
        totalScore,
        message,
        status,
        more
      ]
    }
  }

  const getResult = (urineSodiumConcentration, urineCreatinineConcentration, serumSodiumConcentration, serumCreatinineConcentration) => {
    let result =(
      (
        urineSodiumConcentration.div(urineCreatinineConcentration)
      ).div(
        serumSodiumConcentration.div(serumCreatinineConcentration)
      )
    )
    .times(100)
    .round(3).toFixed(2)

    if (result > 100) {
      result = "100.00"
    }

    if (result < 0) {
      result = "0"
    }

    return result
  }

  const getStatus = (score) => {
    if (score < 1) {
      return 'green'
    } else if (score >= 1) {
      return 'red'
    }
  }

  const getMessage = (score) => {

    let message = ''

    if (score >= 0 && score < 1) {
      message = '腎前性AKIの可能性あり'
    } else if (score >= 1) {
      message = '腎性AKIの可能性あり'
    }
    return message
  }

  const getMore = (score, urineSodiumConcentration, urineCreatinineConcentration, serumSodiumConcentration, serumCreatinineConcentration) => {

    let value = urineSodiumConcentration
    .minus(urineCreatinineConcentration
    .times(serumSodiumConcentration)
    .div(serumCreatinineConcentration.times(100)))
    .round(0, Big.roundUp)
    .abs()
    .toFixed(0)

    let message = ''

    if (score >= 0 && score < 1) {
      message += '※UNaがあと' + value + 'mEq/L高いとFENaが1%超'
    } else if (score > 1) {
      message += '※UNaがあと' + value + 'mEq/L低ければFENaが1%以下'
    } else {
      message = ''
    }
    return message
  }

  const score = computed(() => calculateDose(input.value))
  const status = computed(() => getStatus(score.value?.data?.[0]))
  const message = computed(() => getMessage(score.value?.data?.[0]))
  const more = computed(() => getMore(score.value?.data?.[0], score.value?.data?.[1], score.value?.data?.[2], score.value?.data?.[3], score.value?.data?.[4]))
  return {
    input,
    score,
    status,
    message,
    more,
    calculateDose
  }
} 