import Big from "big.js";

export function useCalc() {
  // 体重ベースの投薬量計算
  const calculateDose = (formData) => {
    // 全ての入力値が揃っているか確認
    if (!formData) return null
    
    let rcc = formData.rcc
    const weight = formData.weight
    let hb = formData.hb

    if (rcc && isNaN(rcc)) {
      rcc = 0
    }

    if (hb && isNaN(hb)) {
      hb = 0
    }

    // 体重が0または未入力の場合は計算不可
    if (!weight || Number(weight) <= 0) {
      return {
        data: ['-', '-']
      }
    }

    // 空文字なら0に置換する
    const rccvalue = !rcc ? new Big(-1) : new Big(rcc)
    const weightvalue = new Big(weight)
    // 空文字なら0に置換する
    const hbvalue = !hb ? new Big(-1) : new Big(hb)

    try {
      // 予測上昇Hb値＝投与本数 × 26.5[g] /(体重 [kg] ×70 [mL/kg] /100)
      const result = rccvalue.times(26.5).div(weightvalue).div(70).times(100)
      // 投与RCC＝予測上昇Hb値[g/dL]*(体重 [kg] ×70 [mL/kg] /100)/26.5[g]
      const subresult = hbvalue.times(weightvalue).times(70).div(100).div(26.5)

      const result1 = result.round(2).toFixed(1)
      const result2 = subresult.round(3).toFixed(2)

      const data = [
        Number(result1) < 0 || Number(result1) > 100
            ? '-'
            : result1,
        Number(result2) < 0 || Number(result2) > 100
            ? '-'
            : result2,
      ]

      return {
        data: data
      }
    } catch (error) {
      // 計算中にエラーが発生した場合（0除算など）
      return {
        data: ['-', '-']
      }
    }
  }
  
  return {
    calculateDose
  }
} 