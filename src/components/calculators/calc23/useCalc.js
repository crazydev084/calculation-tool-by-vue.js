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
      formData.bnp === null || Number(formData.bnp) < 0 ||
      formData.ntProBnp === null || Number(formData.ntProBnp) < 0
    ) {
      return null
    }

    const bnp = new Big(formData.bnp)
    const ntProBnp = new Big(formData.ntProBnp)
    
    const totalScore = getResult(bnp, ntProBnp)
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

  const getResult = (bnp, ntProBnp) => {
    let result = -1
    if (bnp >= 35 || ntProBnp >= 125) {
      result = 1
    } else if (bnp < 35 || ntProBnp < 125) {
      result = 2
    }
    return result
  }

  const getStatus = (score) => {
    if (score < 1 && score > 1) {
      return 'green'
    } else if (score === 1) {
      return 'red'
    } else {
      return 'blue'
    }
  }

  const getMessage = (score) => {
    if (score === 1) {
      return '心不全の可能性は高い'
    } else if (score === 2) {
      return '心不全の可能性は低い'
    } else {
      return ''
    }
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