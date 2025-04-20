<template>
  <div class="home">
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold mb-4">利用可能な計算ツール</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <router-link 
          v-for="calc in calculators" 
          :key="calc.id"
          :to="`/calc/${calc.id}`"
          class="block p-4 border rounded-lg hover:bg-blue-50 transition-colors"
        >
          <h3 class="font-semibold text-lg">{{ calc.title }}</h3>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { calculatorList } from '@/generated/calculatorList'

export default {
  name: 'HomeView',
  setup() {
    return {
      calculators: calculatorList
    }
  }
}
</script> 