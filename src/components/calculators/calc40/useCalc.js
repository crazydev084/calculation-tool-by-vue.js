import Big from "big.js";

export function useCalc() {
  // 体重ベースの投薬量計算
  const calculateDose = (formData) => {
    // 全ての入力値が揃っているか確認
    if (!formData) return null
    
    let rbc = formData.rbc
    const weight = formData.weight

    if (rbc && isNaN(rbc)) {
      rbc = 0
    }

    // 体重が0または未入力の場合は計算不可
    if (!weight || Number(weight) <= 0) {
      return {
        data: ['-']
      }
    }

    // 空文字なら0に置換する
    const rbcvalue = !rbc ? new Big(-1) : new Big(rbc)
    const weightvalue = new Big(weight)

    try {
      // 　予測Plt増加数＝{(0.2×10^11×輸血単位数)/(70×体重×10^3)}×(2/3)
      const result = rbcvalue.times(0.2).times('1e11').div(weightvalue).div(70).div('1e3').times(2/3).div(10000)
      const result1 = result.round(2).toFixed(1)

      const data = [
        Number(result1) < 0
            ? '-'
            : result1
      ]

      return {
        data: data
      }
    } catch (error) {
      // 計算中にエラーが発生した場合（0除算など）
      return {
        data: ['-']
      }
    }
  }
  
  return {
    calculateDose
  }
} 