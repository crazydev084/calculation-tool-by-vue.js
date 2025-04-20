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
    
    let totalScore = 0

    if (formData.initialEcgRhythm === null || Number(formData.initialEcgRhythm) < 0 ||
        formData.timeToROSC === null || Number(formData.timeToROSC) < 0 ||
        formData.ph === null || Number(formData.ph) < 0 ||
        formData.lactate === null || Number(formData.lactate) < 0 ||
        formData.gcsM === null || Number(formData.gcsM) < 0) {
      return null
    }
  
    const initialEcgRhythm = new Big(formData.initialEcgRhythm)
    const timeToROSC = new Big(formData.timeToROSC)
    const ph = new Big(formData.ph)
    const lactate = new Big(formData.lactate)
    const gcsM = new Big(formData.gcsM)

    totalScore = Big(1.0)
    .times(initialEcgRhythm)
    .add(Big(2.0).times(timeToROSC))
    .add(Big(2.5).times(ph))
    .add(Big(0.5).times(lactate))
    .add(Big(4.5).times(gcsM))
    .round(2)
    .toFixed(1)
    
    // 結果の配列を返す [スコア, コメント, ステータス]
    const status = getStatus(totalScore)
    const message = getMessage(totalScore)
    const more = getMore(totalScore)
    
    return {
      data: [
        totalScore,
        message,
        status,
        more
      ]
    }
  }

  const getStatus = (score) => {
    if (score < 6.0) return 'green'
    if (score >= 6.0 && score <= 14.0) return 'yellow'
    if (score > 14.0) return 'red'
  }

  const getMessage = (score) => {
    if (score < 6.0) return '低リスク'
    if (score >= 6.0 && score <= 14.0) return '中リスク'
    if (score > 14.0) return '高リスク'
    return '-'
  }

  const getMore = (score) => {
    if (score < 6.0) return '30日後神経学的不良率：13.5％、死亡率：2.1％\n90日後神経学的不良率：14.5％、死亡率：4.4％'
    if (score >= 6.0 && score <= 14.0) return '30日後神経学的不良率：56.3％、死亡率：20.3％\n90日後神経学的不良率：52.7％、死亡率：34.5％'
    if (score > 14.0) return '30日後神経学的不良率：94.8％、死亡率：62.8％\n90日後神経学的不良率：95.4％、死亡率：73.2％'
    return '-'
  }

  const score = computed(() => calculateDose(input.value))
  const status = computed(() => getStatus(score.value?.data?.[0]))
  const message = computed(() => getMessage(score.value?.data?.[0]))
  const more = computed(() => getMore(score.value?.data?.[0]))

  return {
    input,
    score,
    status,
    message,
    more,
    calculateDose
  }
} 