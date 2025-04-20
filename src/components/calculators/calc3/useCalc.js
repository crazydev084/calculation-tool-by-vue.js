import { ref } from 'vue'
import config from './config.json'

export function useCalc() {
  /**
   * DICスコアを計算する関数
   * @param {Object} formData - フォームからの入力値
   * @returns {Object} - 計算結果
   */
  const calculateDose = (formData) => {
    // 全ての入力値が揃っているか確認
    if (!formData) return null

    // 入力値を数値型に変換して合計スコアを計算
    let totalScore = 0
    
    // formConfigのfieldsを走査して、各フィールドの値を合算
    config.fields.forEach(field => {
      if (field.type === 'group' && field.fields) {
        // グループ内のフィールドを処理
        field.fields.forEach(subField => {
          const value = formData[subField.id]
          if (value !== undefined && value !== null && value !== '') {
            totalScore += Number(value)
          }
        })
      } else {
        // 単独のフィールドを処理
        const value = formData[field.id]
        if (value !== undefined && value !== null && value !== '') {
          totalScore += Number(value)
        }
      }
    })

    // DICリスクレベルの判定
    let riskLevel = ''
    let status = 'normal'
    
    if (totalScore >= 7) {
      riskLevel = 'DIC'
      status = 'red'
    } else if (totalScore === 6) {
      riskLevel = 'DICの疑い'
      status = 'orange'
    } else {
      riskLevel = 'DICの可能性は低い。ただし、白血病および類縁疾患に該当する場合は解説を参照。'
      status = 'green'
    }

    // 結果を配列形式で返す（ResultDisplayコンポーネントと互換性のある形式）
    return {
      data: [totalScore, riskLevel, status]
    }
  }

  return {
    calculateDose
  }
} 