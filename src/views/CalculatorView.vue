<template>
  <div>
    <template v-if="currentCalculator">
      <component :is="currentCalculator" />
    </template>
    <template v-else>
      <div class="error-message">
        <p>指定された計算ツールが見つかりませんでした。</p>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, defineAsyncComponent, onMounted, watch, shallowRef, markRaw } from 'vue'
import { useRoute } from 'vue-router'

// 動的にコンポーネントを読み込む関数
const loadCalculatorComponents = async () => {
  const components = {}
  const modules = import.meta.glob('@/components/calculators/*/Calc.vue')
  
  for (const path in modules) {
    const match = path.match(/calculators\/calc(\d+)\/Calc\.vue$/)
    if (match) {
      const calcId = match[1]
      components[`calc${calcId}`] = modules[path]
    }
  }
  return components
}

export default {
  name: 'CalculatorView',
  props: {
    // IDをpropsとして受け取る
    id: {
      type: String,
      default: '1'
    }
  },
  setup(props) {
    const route = useRoute()
    const currentCalculator = shallowRef(null)
    const calculatorComponents = ref({})

    const initializeComponents = async () => {
      calculatorComponents.value = await loadCalculatorComponents()
    }

    const loadCalculator = async (calculatorId) => {
      
      try {
        const componentKey = `calc${calculatorId}`
        if (calculatorComponents.value[componentKey]) {
          const AsyncComponent = defineAsyncComponent(calculatorComponents.value[componentKey])
          currentCalculator.value = markRaw(AsyncComponent)
        } else {
          throw new Error(`Unknown calculator ID: ${calculatorId}`)
        }
      } catch (error) {
        currentCalculator.value = null
      }
    }

    // コンポーネントの初期化
    onMounted(async () => {
      await initializeComponents()
      loadCalculator(props.id)
    })

    // URLパラメータのIDが変わったらコンポーネントを再読み込み
    watch(() => route.params.id, (newId) => {
      if (newId) {
        loadCalculator(newId)
      }
    }, { immediate: true })

    // propsのIDが変わったらコンポーネントを再読み込み
    watch(() => props.id, (newId) => {
      if (newId) {
        loadCalculator(newId)
      }
    })

    return {
      currentCalculator
    }
  }
}
</script>

<style scoped>
.error-message {
  color: #e53e3e;
  text-align: center;
  padding: 2rem;
  background-color: #fff5f5;
  border-radius: 0.5rem;
  margin-top: 2rem;
}
</style> 