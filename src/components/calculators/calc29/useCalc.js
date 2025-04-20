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
      formData.gender === null || Number(formData.gender) < 0 || 
      formData.systolicBloodPressure === null || Number(formData.systolicBloodPressure) < 0 || 
      formData.glucoseMetabolismAbnormality === null || Number(formData.glucoseMetabolismAbnormality) < 0 || 
      formData.serumLDL_C === null || Number(formData.serumLDL_C) < 0 || 
      formData.serumHDL_C === null || Number(formData.serumHDL_C) < 0 || 
      formData.smoking === null || Number(formData.smoking) < 0 || 
      formData.age === null) {
      return null
    }

    const gender = new Big(formData.gender)
    const systolicBloodPressure = new Big(formData.systolicBloodPressure)
    const glucoseMetabolismAbnormality = new Big(formData.glucoseMetabolismAbnormality)
    const serumLDL_C = new Big(formData.serumLDL_C)
    const serumHDL_C = new Big(formData.serumHDL_C)
    const smoking = new Big(formData.smoking)
    const age = new Big(formData.age)

    const totalScore = getResult(gender, age, systolicBloodPressure, glucoseMetabolismAbnormality, serumLDL_C, serumHDL_C, smoking)
    const absoluteRisk = getAbsoluteRisk(totalScore, age)
    const riskCategory = getRiskCategory(absoluteRisk)
    const status = getStatus(riskCategory)
    const message = getMessage(absoluteRisk, riskCategory)
    const more = getMore(riskCategory)

    return {
      data: [
        totalScore,
        message,
        status,
        more
      ]
    }
  }

  const getResult = (gender, age, systolicBloodPressure, glucoseMetabolismAbnormality, serumLDL_C, serumHDL_C, smoking) => {
    let result = gender.plus(systolicBloodPressure).plus(glucoseMetabolismAbnormality).plus(serumLDL_C).plus(serumHDL_C).plus(smoking).toNumber()
    return result
  }

  const getAbsoluteRisk = (score, age) => {
    if (score < 0 || score > 19) return ""
    if (age < 0 || age > 3) return "" 

    const riskTable = [
      ["<1.0%", "<1.0%", "1.7%", "3.4%"],
      ["<1.0%", "<1.0%", "1.9%", "3.9%"],
      ["<1.0%", "<1.0%", "2.2%", "4.5%"],
      ["<1.0%", "1.1%", "2.6%", "5.2%"],
      ["<1.0%", "1.3%", "3.0%", "6.0%"],
      ["<1.0%", "1.4%", "3.4%", "6.9%"],
      ["<1.0%", "1.7%", "3.9%", "7.9%"],
      ["<1.0%", "1.9%", "4.5%", "9.1%"],
      ["1.1%", "2.2%", "5.2%", "10.4%"],
      ["1.3%", "2.6%", "6.0%", "11.9%"],
      ["1.4%", "3.0%", "6.9%", "13.6%"],
      ["1.7%", "3.4%", "7.9%", "15.5%"],
      ["1.9%", "3.9%", "9.1%", "17.7%"],
      ["2.2%", "4.5%", "10.4%", "20.2%"],
      ["2.6%", "5.2%", "11.9%", "22.9%"],
      ["3.0%", "6.0%", "13.6%", "25.9%"],
      ["3.4%", "6.9%", "15.5%", "29.3%"],
      ["3.9%", "7.9%", "17.7%", "33.0%"],
      ["4.5%", "9.1%", "20.2%", "37.0%"],
      ["5.2%", "10.4%", "22.9%", "41.1%"],
    ];
    return riskTable[score][age.toNumber()]
  }

  const getRiskCategory = (riskStr) => {
    if (!riskStr) return ""
    const hasLessThan = riskStr.includes("<")
    let numericPart = riskStr.replace(/[<%]/g, "")
    let val = parseFloat(numericPart || "0")

    if (hasLessThan && val < 1.0) {
      val = 1.0;
    }

    if (val < 2) return "低リスク";
    if (val < 10) return "中リスク";
    return "高リスク";
  }

  const getStatus = (riskCategory) => {
    if (riskCategory === "低リスク") return "green"
    if (riskCategory === "中リスク") return "yellow"
    if (riskCategory === "高リスク") return "red"
    return "green"
  }

  const getMessage = (absoluteRisk, riskCategory) => {
    if (absoluteRisk === "") return ""
    let message = riskCategory + "（発症確率は" + absoluteRisk + "）"
    return message
  }

  const getMore = (riskCategory) => {
    if (riskCategory === "低リスク") return "脂質管理目標値 LDL<160、Non-HDL<190、TG<150、HDL≥40"
    if (riskCategory === "中リスク") return "脂質管理目標値 LDL<140、Non-HDL<170、TG<150、HDL≥40"
    if (riskCategory === "高リスク") return "脂質管理目標値 LDL<120、Non-HDL<150、TG<150、HDL≥40"
    return ""
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