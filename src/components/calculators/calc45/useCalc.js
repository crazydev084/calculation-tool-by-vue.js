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
    
    let Danger1 = new Big(0)
    let Danger2 = new Big(0)
    let Danger3 = new Big(0)
    let Danger4 = new Big(0)
    let totalScore;
    
    Danger1 = new Big(formData.gcs || 0).plus(new Big(formData.altered1 || 0)).plus(new Big(formData.fracture || 0)).round(3).toFixed(2);
    Danger2 = new Big(formData.hematoma || 0).plus(new Big(formData.loss1 || 0)).plus(new Big(formData.injury || 0)).plus(new Big(formData.point || 0)).round(3).toFixed(2);
    Danger3 = new Big(formData.gcs2 || 0).plus(new Big(formData.altered2 || 0)).plus(new Big(formData.skull || 0)).round(3).toFixed(2);
    Danger4 = new Big(formData.loss2 || 0).plus(new Big(formData.vomiting || 0)).plus(new Big(formData.injury2 || 0)).plus(new Big(formData.headache || 0)).round(3).toFixed(2);
    
    if (Danger1 > 0) {
      totalScore = 4.4 * Danger1+0.9*Danger2;
    } else if (Danger2 > 0) {
      totalScore = 0.9 * Danger2;
    } else if (Danger3 > 0) {
      totalScore = 4.3 * Danger3+0.9*Danger4;
    } else if (Danger4 > 0) {
      totalScore = 0.8 * Danger4;
    } else {
      totalScore = 0;
    }
    
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
    if (score >= 4.4) return 'red'
    if (score >= 0.9) return 'yellow'
    return 'green'
  }

  const getMessage = (score) => {
    if (score >= 4.4) return '頭部CTを推奨する'
    if (score >= 0.9) return '頭部CT or 経過観察（以下の条件を考慮する）'
    return '頭部CTを推奨しない'
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