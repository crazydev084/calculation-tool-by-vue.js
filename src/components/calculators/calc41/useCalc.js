import { ref, computed } from 'vue'
export function useCalc() {
  const input = ref({})
  
  /**
   * @param {Object} formData - フォームからの入力値
   * @returns {Object} - 計算結果
   */
  const calculateDose = (formData) => {
    if (!formData) return null
    
    // Ensure totalScore is declared and initialized
    let totalScore = 0;
    
    // 各フィールドの値を合算
    Object.entries(formData).forEach(([key, value]) => {
      totalScore += Number(value)
    })
    let disorder = totalScore - Number(formData.Plt || 0)-Number(formData.decrease || 0);
    let disease = totalScore - Number(formData.Fib || 0);
    
    // 結果の配列を返す [スコア, コメント, ステータス]
    const status = getStatus(totalScore)
    const message1 = getMessage1(totalScore)
    const message2 = getMessage2(disorder)
    const message3 = getMessage3(disease)

    return {
      data: [
        totalScore,
        disorder,
        disease,
        message1,
        message2,
        message3,
        status
      ]
    }
  }

  const getStatus = (score) => {
    if (score >= 6) return 'green'
    if (score >= 4) return 'yellow'
    return 'red'
  }

  const getMessage1 = (score) => {
    if (score >= 6) return '基準を満たす'
    return '基準を満たさない'
  }

  const getMessage2 = (score) => {
    if (score >= 4) return '基準を満たす'
    return '基準を満たさない'
  }

  const getMessage3 = (score) => {
    if (score >= 5) return '基準を満たす'
    return '基準を満たさない'
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