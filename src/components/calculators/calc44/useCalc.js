import { ref, computed } from 'vue'
import data from './data.json'
import head_data from './head.json'
import Big from 'big.js'
export function useCalc() {
const input = ref({})

/**
   * @param {Object} formData - フォームからの入力値
   * @returns {Object} - 計算結果
*/
const calculateDose = (formData) => {
    if (!formData) return null

    if (formData.age === null || Number(formData.age) < 0 ||
            formData.age_month === null || Number(formData.age_month) < 0 ||
            formData.gender === null || Number(formData.gender) < 0 ||
            formData.height === null || Number(formData.height) < 0 ||
            formData.weight === null || Number(formData.weight) < 0 ||
            formData.head === null || Number(formData.head) < 0) {
            return null
    }
    const age = new Big(formData.age).round(3).toFixed()
    const age_month = new Big(formData.age_month).round(3).toFixed()
    const gender = new Big(formData.gender).round(3).toFixed()
    const height = new Big(formData.height)
    const weight = new Big(formData.weight)
    const head = new Big(formData.head).round(3).toFixed(2)
    let age_data = `${age}-${age_month}`

    let avg_weight
    let sd_weight
    let avg_height
    let sd_height
    let message_head

    if(age == 17 && age_month > 6){
        alert("年齢…0歳0ヶ月～17歳6ヶ月")
    }else {
        if(gender == 1){
            data.girl.forEach((item) => {
                if (item.age_data === age_data) {
                    avg_height = item.avg_height
                    avg_weight = item.avg_weight
                    sd_height = item.sd_height
                    sd_weight = item.sd_weight
                    if (item.head) {
                        const headers = Object.values(head_data.girl[item.head])
                        if (head < parseFloat(headers[0])) {
                            message_head = "小頭症の疑い"
                        } else if (head > parseFloat(headers[6])) {
                            message_head = "巨頭症の疑い"
                        } else if (head > parseFloat(headers[0]) && head <= parseFloat(headers[1])) {
                            message_head = `3%~10%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[1]) && head <= parseFloat(headers[2])) {
                            message_head = `10%~25%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[2]) && head <= parseFloat(headers[3])) {
                            message_head = `25%~50%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[3]) && head <= parseFloat(headers[4])) {
                            message_head = `50%~75%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[4]) && head <= parseFloat(headers[5])) {
                            message_head = `75%~90%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[5]) && head < parseFloat(headers[6])) {
                            message_head = `90%~97%tile（平均${headers[3]}cm）`
                        }                        
                    }   
                }
            })
        } else {
            data.boy.forEach((item) => {
                if (item.age_data === age_data) {
                    avg_height = item.avg_height
                    avg_weight = item.avg_weight
                    sd_height = item.sd_height
                    sd_weight = item.sd_weight
                    if (item.head) {
                        const headers = Object.values(head_data.boy[item.head])
                        if (head < parseFloat(headers[0])) {
                            message_head = "小頭症の疑い"
                        } else if (head > parseFloat(headers[6])) {
                            message_head = "巨頭症の疑い"
                        } else if (head > parseFloat(headers[0]) && head <= parseFloat(headers[1])) {
                            message_head = `3%~10%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[1]) && head <= parseFloat(headers[2])) {
                            message_head = `10%~25%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[2]) && head <= parseFloat(headers[3])) {
                            message_head = `25%~50%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[3]) && head <= parseFloat(headers[4])) {
                            message_head = `50%~75%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[4]) && head <= parseFloat(headers[5])) {
                            message_head = `75%~90%tile（平均${headers[3]}cm）`
                        } else if (head > parseFloat(headers[5]) && head < parseFloat(headers[6])) {
                            message_head = `90%~97%tile（平均${headers[3]}cm）`
                        }                        
                    } 
                }
            })
        }
    }

    let result_weight = Number((weight - avg_weight) / sd_weight).toFixed(2)
    let result_height = Number((height - avg_height) / sd_height).toFixed(2)

    // 結果の配列を返す [スコア, コメント, ステータス]
    const status = getStatus(result_height)
    const message = getMessage(result_height)
    
    return {
        data: [
            result_weight,
            result_height,
            message,
            status,
            message_head
        ]
    }
}

const getStatus = (score) => {
    if (score <= -2) return 'red'
    return 'green'
}

const getMessage = (score) => {
    if (score <= -2) return '低身長の疑い'
    return ''
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