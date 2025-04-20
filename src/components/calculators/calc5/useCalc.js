import { ref, computed } from 'vue'
import config from './config.json'

export function useCalc() {
  const input = ref({})
  
  const calculateDose = (formData) => {
    if (!formData) return null
    
    let totalScore = 0
    
    // 各フィールドの値を直接合算
    config.fields.forEach(field => {
      const value = formData[field.id]
      if (value !== undefined) {
        totalScore += Number(value)
      }
    })
    
    // 結果の配列を返す [スコア, コメント, ステータス]
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

  const getStatus = (score) => {
    if (score >= 7) return 'red'
    if (score >= 5) return 'yellow'
    return 'green'
  }

  const getMessage = (score) => {
    if (score === null) return ''
    if (score >= 7) return '高リスク群（入院にて手術）'
    if (score >= 5) return '中リスク（入院にて経過観察）'
    return '低リスク（帰宅）'
  }

  return {
    calculateDose
  }
} 