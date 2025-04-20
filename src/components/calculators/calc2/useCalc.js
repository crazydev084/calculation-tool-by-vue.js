import { ref } from 'vue'

export function useCalc() {
  // 体重ベースの投薬量計算
  const calculateDose = (formData) => {
    // 全ての入力値が揃っているか確認
    if (!formData) return null
    
    // 各項目のスコアを取得
    const nauseaScore = isNaN(formData.nausea) ? 0 : parseInt(formData.nausea);
    const hydronephrosisScore = isNaN(formData.hydronephrosis) ? 0 : parseInt(formData.hydronephrosis);
    const hematuriaScore = isNaN(formData.hematuria) ? 0 : parseInt(formData.hematuria);
    const stoneHistoryScore = isNaN(formData.stoneHistory) ? 0 : parseInt(formData.stoneHistory);
    const genderScore = isNaN(formData.gender) ? 0 : parseInt(formData.gender);
    const ageScore = isNaN(formData.age) ? 0 : parseInt(formData.age);
    const painImprovementScore = isNaN(formData.painImprovement) ? 0 : parseInt(formData.painImprovement);
    
    // 合計スコアを計算
    const totalScore = nauseaScore + hydronephrosisScore + hematuriaScore + 
                       stoneHistoryScore + genderScore + ageScore + painImprovementScore;
    
    // スコアによるリスク評価
    let riskLevel = "";
    let status = "";
    
    if (totalScore >= 6) {
      riskLevel = "尿路結石の可能性が高い";
      status = "red"
    } else {
      riskLevel = "尿路結石の可能性は低い";
      status = "green"
    }
    
    // 計算結果をcalc1と同じフォーマットで返す
    return {
      data: [totalScore, riskLevel, status],
    }
  }
  
  return {
    calculateDose
  }
} 