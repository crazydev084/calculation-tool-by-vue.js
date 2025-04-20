import { ref, computed } from 'vue'
import config from './config.json'

export function useCalc() {
  const input = ref({})
  
  /**
   * Glasgow-Blatchford スコアを計算する関数
   * @param {Object} formData - フォームからの入力値
   * @returns {Object} - 計算結果
   */
  const calculateDose = (formData) => {
    if (!formData) return null
    
    let totalScore = 0
    
    // 各フィールドの値を合算
    Object.entries(formData).forEach(([key, value]) => {
      // radio-groupのサブフィールド（hbMale, hbFemale）も含めて計算
      if (key !== 'gender') { // genderフィールドは計算から除外
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
    if (score <= 0) return 'green'
    if (score === 1) return 'yellow-green'
    if (score === 2) return 'yellow'
    if (score === 3) return 'orange'
    return 'red'
  }

  const getMessage = (score) => {
    if (score <= 0) return 'A群溶連菌性咽頭炎の確率：8%'
    if (score === 1) return 'A群溶連菌性咽頭炎の確率：14%'
    if (score === 2) return 'A群溶連菌性咽頭炎の確率：23%'
    if (score === 3) return 'A群溶連菌性咽頭炎の確率：37%'
    return 'A群溶連菌性咽頭炎の確率：55%'
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