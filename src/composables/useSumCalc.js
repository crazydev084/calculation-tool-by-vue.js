import { ref } from 'vue'

/**
 * 汎用的なスコア合計計算のためのコンポーザブル
 * 複数の計算機で再利用可能
 */
export function useSumCalc() {
  /**
   * 複数の数値項目の合計を計算
   * @param {Object} formData - フォームデータ
   * @param {Array} fieldIds - 合計に含める項目のID配列
   * @returns {Object} 計算結果
   */
  const calculateSum = (formData, fieldIds) => {
    // 各フィールドの値を数値に変換して合計
    let total = 0
    const fieldValues = {}
    
    fieldIds.forEach(fieldId => {
      const value = formData[fieldId] ? Number(formData[fieldId]) : 0
      fieldValues[fieldId] = value
      total += value
    })
    
    return {
      ...fieldValues,
      total
    }
  }
  
  return {
    calculateSum
  }
} 