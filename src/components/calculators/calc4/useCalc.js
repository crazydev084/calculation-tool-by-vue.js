import { ref } from 'vue'
import config from './config.json'

export function useCalc() {
  /**
   * NIHSSスコアを計算する関数
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
            // 値が'N'の場合は0として計算
            totalScore += value === 'N' ? 0 : Number(value)
          }
        })
      } else {
        // 単独のフィールドを処理
        const value = formData[field.id]
        if (value !== undefined && value !== null && value !== '') {
          // 値が'N'の場合は0として計算
          totalScore += value === 'N' ? 0 : Number(value)
        }
      }
    })

    // NIHSSスコアの判定
    let riskLevel = ''
    let status = 'normal'
    
    if (totalScore === 0) {
      riskLevel = '正常'
      status = 'green'
    } else if (totalScore <= 4) {
      riskLevel = '軽症'
      status = 'yellow-green'
    } else if (totalScore >= 5 && totalScore <= 15) {
      riskLevel = '中等症'
      status = 'yellow'
    } else if (totalScore >= 16 && totalScore <= 20) {
      riskLevel = '中等症から重症'
      status = 'orange'
    } else if (totalScore >= 21) {
      riskLevel = '重症'
      status = 'red'
    } else {
      riskLevel = ''
      status = 'green'
    }

    // 結果を配列形式で返す
    return {
      data: [totalScore, riskLevel, status]
    }
  }

  return {
    calculateDose
  }
} 