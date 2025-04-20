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
      formData.age === null || Number(formData.age) < 0 || 
      formData.heartRate === null || Number(formData.heartRate) < 0 || 
      formData.systolicBloodPressure === null || Number(formData.systolicBloodPressure) < 0 || 
      formData.serumCreatinine === null || Number(formData.serumCreatinine) < 0 || 
      formData.killipClassification === null || Number(formData.killipClassification) < 0 || 
      formData.cardiacBiomarkerElevation === null || Number(formData.cardiacBiomarkerElevation) < 0 || 
      formData.stDeviation === null || Number(formData.stDeviation) < 0 || 
      formData.hospitalizationDueToCardiacArrest === null || Number(formData.hospitalizationDueToCardiacArrest) < 0
    ) {
      return null
    }

    const age = new Big(formData.age)
    const heartRate = new Big(formData.heartRate)
    const systolicBloodPressure = new Big(formData.systolicBloodPressure)
    const serumCreatinine = new Big(formData.serumCreatinine)
    const killipClassification = new Big(formData.killipClassification)
    const cardiacBiomarkerElevation = new Big(formData.cardiacBiomarkerElevation)
    const stDeviation = new Big(formData.stDeviation)
    const hospitalizationDueToCardiacArrest = new Big(formData.hospitalizationDueToCardiacArrest)
    
    const totalScore = getResult(age, heartRate, systolicBloodPressure, serumCreatinine, killipClassification, cardiacBiomarkerElevation, stDeviation, hospitalizationDueToCardiacArrest)
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

  const getResult = (age, heartRate, systolicBloodPressure, serumCreatinine, killipClassification, cardiacBiomarkerElevation, stDeviation, hospitalizationDueToCardiacArrest) => {
    let result = age.plus(heartRate).plus(systolicBloodPressure).plus(serumCreatinine).plus(killipClassification).plus(cardiacBiomarkerElevation).plus(stDeviation).plus(hospitalizationDueToCardiacArrest).toNumber()
    return result
  }

  const getStatus = (score) => {
    return 'blue'
  }

  const getMessage = (score) => {
    const deathRate = [
      { threshold: 60, rate: "0.2" },
      { threshold: 70, rate: "0.3" },
      { threshold: 80, rate: "0.4" },
      { threshold: 90, rate: "0.6" },
      { threshold: 100, rate: "0.8" },
      { threshold: 110, rate: "1.1" },
      { threshold: 120, rate: "1.6" },
      { threshold: 130, rate: "2.1" },
      { threshold: 140, rate: "2.9" },
      { threshold: 150, rate: "3.9" },
      { threshold: 160, rate: "5.4" },
      { threshold: 170, rate: "7.3" },
      { threshold: 180, rate: "9.8" },
      { threshold: 190, rate: "13" },
      { threshold: 200, rate: "18" },
      { threshold: 210, rate: "23" },
      { threshold: 220, rate: "29" },
      { threshold: 230, rate: "36" },
      { threshold: 240, rate: "44" },
      { threshold: 250, rate: "52" },
    ];
    
    let message = ''
    if (score <= deathRate[0].threshold) {
      message = `ACSによる院内死亡率は${deathRate[0].rate}％以下`
    } else {
      for (let i = 1; i < deathRate.length; i++) {
        if (score <= deathRate[i].threshold) {
          message = `ACSによる院内死亡率は${deathRate[i].rate}％以下`;
          break;
        }
      }
      if (message === '') {
        message = 'ACSによる院内死亡率は52％以上'
      }
    }
    message += '<p>実臨床では<a class="result-link" href="https://www.outcomes-umassmed.org/GRACE/default.aspx" target="_blank">GRACE公式サイト</a></p>'
    return message
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