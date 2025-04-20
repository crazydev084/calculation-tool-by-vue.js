<template>
  <div>
    <h2 v-if="formConfig.title" class="">{{ formConfig.title }}</h2>
    <p v-if="formConfig.description" v-html="formConfig.description" class="text-pls-s p-pls-m"></p>
    
    <form @submit.prevent="handleSubmit">
      <template v-for="(field, index) in formConfig.fields" :key="field.id">
        <!-- グループフィールドの処理 -->
        <div v-if="field.type === 'group'" class="px-pls-m">
          <div class="flex items-center gap-pls-s py-pls-s border-b border-b-pls-border">
            <h3 class="text-pls-s">{{ field.label }}</h3>
          </div>
          
          <div class="">
            <div v-for="(childField, childIndex) in field.fields" :key="childField.id" class="flex items-center gap-pls-s py-pls-s"
                 :class="{'border-b border-b-pls-border': childIndex < field.fields.length - 1}">
              <label :for="childField.id" class="text-pls-s font-pls-bold leading-pls-body-m wrap-p text-wrap-pretty w-[35%] max-w-[35%]">
                <span v-html="formatLabel(childField.label)"></span>
              </label>
              
              <!-- 共通FormFieldコンポーネントを使用 -->
              <div class="flex-1">
                <FormField 
                  :field="childField" 
                  v-model="formData[childField.id]"
                />
              </div>
            
              <span v-if="childField.unit" class="w-[80px] max-w-[80px]">{{ childField.unit }}</span>
            </div>
          </div>
        </div>
        
        <!-- 通常のフィールド（グループでないもの）の処理 -->
        <div v-else-if="field.type === 'radio-group'" class="px-pls-m">
          <div class="flex items-center gap-pls-s py-pls-s"
               :class="{'border-b border-b-pls-border': !getSelectedOptionFields(field) || index < formConfig.fields.length - 1}">
            <label :for="field.id" class="text-pls-s font-pls-bold leading-pls-body-m wrap-p text-wrap-pretty w-[35%] max-w-[35%]">
              <span v-html="formatLabel(field.label)"></span>
            </label>
            
            <div class="flex-1">
              <div 
                class="flex flex-row"
                :class="[
                  field.options.length > 2 || field.mode === 'vertical' ? 'flex-col' : 'nowrap'
                ]">
                <div v-for="option in field.options" :key="option.value" class="flex items-center justify-between border min-w-[44px] w-full p-[8px] transition-all duration-200 cursor-pointer"
                :class="[
                  formData[field.id] == option.value 
                    ? 'bg-pls-active-primary border-blue-500 shadow-sm' 
                    : 'border-pls-strong hover:bg-gray-50'
                ]">
                  <input
                    type="radio"
                    :id="`${field.id}-${option.value}`"
                    :name="field.id"
                    :value="option.value"
                    v-model="formData[field.id]"
                    class="hidden"
                    @change="handleRadioGroupChange(field.id, option)"
                  >
                  <label :for="`${field.id}-${option.value}`" 
                    class="flex items-center justify-between w-full cursor-pointer"
                    :class="formData[field.id] == option.value ? 'font-bold text-pls-object-link' : 'text-pls-object-secondary'">
                    {{ option.label }}
                  </label>
                </div>
              </div>
            </div>
            
            <span v-if="field.unit" v-html="field.unit" class="w-[80px] max-w-[80px]"></span>
          </div>

          <!-- サブフィールドの表示部分 -->
          <div v-if="getSelectedOptionFields(field)">
            <template v-for="(subField, subIndex) in getSelectedOptionFields(field)" :key="subField.id">
              <div class="flex items-center gap-pls-s py-pls-s"
                   :class="{'border-b border-b-pls-border': !(subIndex === getSelectedOptionFields(field).length - 1 && index === formConfig.fields.length - 1)}">
                <label :for="subField.id" class="text-pls-s font-pls-bold leading-pls-body-m wrap-p text-wrap-pretty w-[35%] max-w-[35%]">
                  <span v-html="formatLabel(subField.label)"></span>
                </label>

                <div class="flex-1">
                  <FormField 
                    :field="subField" 
                    v-model="formData[subField.id]"
                  />
                </div>
                <span v-if="subField.unit" v-html="subField.unit" class="w-[80px] max-w-[80px]"></span>
              </div>
            </template>
          </div>
        </div>
        
        <!-- 通常のフィールド（グループでないもの）の処理 -->
        <div v-else class="px-pls-m">
          <div class="flex items-center gap-pls-s py-pls-s"
               :class="{'border-b border-b-pls-border': index < formConfig.fields.length - 1}">
            <label :for="field.id" class="text-pls-s font-pls-bold leading-pls-body-m wrap-p text-wrap-pretty w-[35%] max-w-[35%]">
              <span v-html="formatLabel(field.label)"></span>
            </label>
            
            <!-- 共通FormFieldコンポーネントを使用 -->
            <div class="flex-1">
              <FormField 
                :field="field" 
                v-model="formData[field.id]"
              />
            </div>
            <span v-if="field.unit" v-html="field.unit" class="w-[80px] max-w-[80px]"></span>
          </div>
          
        </div>
      </template>
    </form>
    
  </div>
</template>

<script>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import FormField from './FormField.vue'

export default {
  name: 'DynamicForm',
  components: {
    FormField
  },
  props: {
    formConfig: {
      type: Object,
      required: true
    },
    calculationFunction: {
      type: Function,
      required: true
    },
    autoCalculate: {
      type: Boolean,
      default: true
    }
  },
  emits: ['calculated', 'reset'],
  setup(props, { emit }) {
    const formData = reactive({})
    const calculationResult = ref(null)
    const errors = reactive({})
    const isFormInitialized = ref(false)
    let debounceTimer = null
    
    // フォームの初期化
    onMounted(() => {
      initializeForm()
      isFormInitialized.value = true
    })
    
    // フォームを初期値で初期化
    const initializeForm = () => {
      const initialValues = {}
      props.formConfig.fields.forEach(field => {
        if (field.type === 'group' && field.fields) {
          field.fields.forEach(childField => {
            const defaultVal = childField.defaultValue !== undefined ? childField.defaultValue : ''
            formData[childField.id] = defaultVal
            initialValues[childField.id] = defaultVal
          })
        } else {
          const defaultVal = field.defaultValue !== undefined ? field.defaultValue : ''
          formData[field.id] = defaultVal
          initialValues[field.id] = defaultVal
        }
      })
    }
    
    // フォームデータの変更を監視
    watch(formData, (newVal, oldVal) => {
      if (!isFormInitialized.value || !props.autoCalculate) return
      
      // デバウンス処理
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        // 必須フィールドがすべて入力されているか確認
        let allFields = []
        props.formConfig.fields.forEach(field => {
          if (field.type === 'group' && field.fields) {
            allFields = [...allFields, ...field.fields]
          } else {
            allFields.push(field)
          }
        })
        
        const allRequiredFieldsFilled = allFields.every(field => 
          !field.required || (formData[field.id] !== undefined && formData[field.id] !== '')
        )
        
        if (allRequiredFieldsFilled) {
          handleCalculation()
        }
      }, 1)
    }, { deep: true })
    
    // 計算処理を実行
    const handleCalculation = () => {
      try {
        // 計算用のデータを整形
        const calculationData = prepareCalculationData(formData)
        const result = props.calculationFunction(calculationData)
        calculationResult.value = result
        emit('calculated', result)
      } catch (error) {
        console.error('計算中にエラーが発生しました:', error)
      }
    }
    
    // 計算用のデータを準備する関数を修正
    const prepareCalculationData = (data) => {
      const calculationData = {}
      
      props.formConfig.fields.forEach(field => {
        if (field.type === 'group' && field.fields) {
          // グループフィールドの処理
          field.fields.forEach(childField => {
            if (data[childField.id] !== undefined) {
              calculationData[childField.id] = data[childField.id]
            }
          })
        } else if (field.type === 'radio-group') {
          // radio-groupの場合、選択されているサブフィールドの値のみを含める
          const selectedFields = getSelectedOptionFields(field)
          if (selectedFields) {
            selectedFields.forEach(subField => {
              if (data[subField.id] !== undefined) {
                calculationData[subField.id] = Number(data[subField.id])
              }
            })
          }
        } else {
          // 通常のフィールドはそのまま含める
          if (data[field.id] !== undefined) {
            calculationData[field.id] = Number(data[field.id])
          }
        }
      })
      
      return calculationData
    }
    
    // フォームの送信処理
    const handleSubmit = () => {
      // バリデーションのリセット
      Object.keys(errors).forEach(key => {
        errors[key] = null
      })
      
      // 必須フィールドの確認
      let isValid = true
      let allFields = []
      
      props.formConfig.fields.forEach(field => {
        if (field.type === 'group' && field.fields) {
          allFields = [...allFields, ...field.fields]
        } else {
          allFields.push(field)
        }
      })
      
      allFields.forEach(field => {
        if (field.required && !formData[field.id] && formData[field.id] !== 0) {
          errors[field.id] = '入力必須項目です'
          isValid = false
        }
      })
      
      if (!isValid) return
      
      // 計算関数の実行
      handleCalculation()
    }
    
    // フォームのリセット
    const resetForm = () => {
      initializeForm()
      emit('reset')
    }
    
    // ラベル内の改行文字をHTMLの改行タグに変換
    const formatLabel = (label) => {
      if (!label) return ''
      return label.replace(/\n/g, '<br>')
    }

    // handleRadioGroupChangeも修正して、計算を即時実行するように
    const handleRadioGroupChange = (fieldId, selectedOption) => {
      const parentField = props.formConfig.fields.find(f => f.id === fieldId)
      const selectedValue = Number(selectedOption.value)
      
      parentField.options.forEach(opt => {
        if (opt.fields) {
          opt.fields.forEach(subField => {
            if (Number(opt.value) !== selectedValue) {
              delete formData[subField.id]
            } else {
              // 新しい選択肢のフィールドにデフォルト値を設定
              formData[subField.id] = subField.defaultValue
            }
          })
        }
      })
      
      // 計算を即時実行
      if (isFormValid()) {
        const calculationData = prepareCalculationData(formData)
        const result = props.calculationFunction(calculationData)
        emit('calculated', result)
      }
    }

    // 選択されたoptionに紐づくfieldsを取得
    const getSelectedOptionFields = (field) => {
      if (field.type !== 'radio-group' || formData[field.id] === undefined) return null
      // 値を数値に変換して比較
      const currentValue = Number(formData[field.id])
      const selectedOption = field.options.find(opt => Number(opt.value) === currentValue)
      return selectedOption?.fields
    }

    // フォームのバリデーション処理も修正
    const isFormValid = () => {
      let allFields = []
      
      props.formConfig.fields.forEach(field => {
        if (field.type === 'group' && field.fields) {
          // グループフィールドの処理
          allFields = [...allFields, ...field.fields]
        } else if (field.type === 'radio-group') {
          // radio-groupの場合、選択されているサブフィールドも含める
          const selectedFields = getSelectedOptionFields(field)
          if (selectedFields) {
            allFields = [...allFields, ...selectedFields]
          }
        } else {
          // 通常のフィールド
          allFields.push(field)
        }
      })

      return allFields.every(field => 
        !field.required || (formData[field.id] !== undefined && formData[field.id] !== '')
      )
    }

    return {
      formData,
      calculationResult,
      errors,
      handleSubmit,
      resetForm,
      formatLabel,
      handleRadioGroupChange,
      getSelectedOptionFields,
      isFormValid
    }
  }
}
</script>

<style lang="scss" scoped>
</style> 