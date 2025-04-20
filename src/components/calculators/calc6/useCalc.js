import { ref, computed } from 'vue'
import Big from "big.js";

export function useCalc() {
  const input = ref({})
  
  /**
   * Glasgow-Blatchford スコアを計算する関数
   * @param {Object} formData - フォームからの入力値
   * @returns {Object} - 計算結果
   */
  const calculateDose = (formData) => {
    if (!formData) return null
    
    let totalScore = new Big(0)
    
    // 各フィールドの値を合算
    Object.entries(formData).forEach(([key, value]) => {
      // radio-groupのサブフィールド（hbMale, hbFemale）も含めて計算
      if (key !== 'gender') { // genderフィールドは計算から除外
        if (value !== null) {
          totalScore = totalScore.plus(new Big(value))
        }
      }
    })
    
    // 結果の配列を返す [スコア, コメント, ステータス]
    totalScore = totalScore.toNumber()
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
    if (score >= 2) return 'yellow'
    return 'green'
  }

  const getMessage = (score) => {
    if (score === null) return ''
    if (score < 2) return '緊急内視鏡が不要な可能性が高い'
    if (score <= 6) return '待機的な内視鏡検査で良い場合が多い'
    return '至急の内視鏡検査が必要になることが多い'
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