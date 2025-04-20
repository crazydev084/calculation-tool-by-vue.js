<script>
import { ref, onMounted } from 'vue'
import DynamicForm from '@/components/common/DynamicForm.vue'
import TabContainer from '@/components/common/TabContainer.vue'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import ResultDisplay from '@/components/common/ResultDisplay.vue'
import FeedbackLink from '@/components/common/FeedbackLink.vue'
import SearchLink from '@/components/common/SearchLink.vue'

export default {
  name: 'BaseCalc',
  components: {
    DynamicForm,
    TabContainer,
    MarkdownRenderer,
    ResultDisplay,
    FeedbackLink,
    SearchLink
  },
  props: {
    calculatorId: {
      type: String,
      required: true
    },
    calculatorTitle: {
      type: String,
      required: true
    },
    formConfig: {
      type: Object,
      required: true
    },
    calculationFunction: {
      type: Function,
      required: true
    },
    resultItems: {
      type: Array,
      required: true
    },
    explanationContent: {
      type: String,
      required: true
    },
    markdownContent: {
      type: String,
      required: true
    },
    tipsContent: {
      type: String,
      required: false
    },
    resultStatus: {
      type: String,
      default: ''
    }
  },
  emits: ['calculated'],
  setup(props, { emit }) {
    const calculated = ref(false)
    const tabContainer = ref(null)
    const activeTab = ref(0)
    
    const showDetails = () => {
      if (tabContainer.value) {
        tabContainer.value.switchToTab(1)
      }
    }
    
    const onTabChange = (index) => {
      activeTab.value = index
    }

    const onCalculated = (result) => {
      calculated.value = true
      emit('calculated', result)
    }
    
    // タブインデックスに基づいてタブを切り替える関数
    const switchToTabIndex = (index) => {
      if (tabContainer.value && index >= 0 && index < (props.tipsContent ? 3 : 2)) {
        tabContainer.value.switchToTab(index)
      }
    }
    
    // URLのハッシュに基づいて初期タブを設定
    onMounted(() => {
      // URLからアンカー情報を取得
      const url = new URL(window.location.href);
      const anchorId = url.searchParams.get('anchor');
      
      if (anchorId) {
        // アンカーIDからタブインデックスを特定
        const tabPrefixMappings = {
          0: ['calculation_'],
          1: ['summary_'],
          2: ['tips_']
        };
        
        // アンカーIDからタブインデックスを特定
        for (const [tabIndex, prefixes] of Object.entries(tabPrefixMappings)) {
          for (const prefix of prefixes) {
            if (anchorId.startsWith(prefix)) {
              // タブを切り替え
              setTimeout(() => {
                switchToTabIndex(Number(tabIndex));
                
                // 要素が表示されるまで少し待ってからスクロール
                setTimeout(() => {
                  const element = document.getElementById(anchorId);
                  if (element) {
                    // タブの下に収まるようにスクロール
                    const offset = 50;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition - offset;
                    
                    window.scrollBy({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                    
                    element.classList.add('highlight-target');
                    setTimeout(() => {
                      element.classList.remove('highlight-target');
                    }, 2000);
                  }
                }, 300);
              }, 100);
              break;
            }
          }
        }
      }
    });
    
    return {
      calculated,
      tabContainer,
      activeTab,
      showDetails,
      onTabChange,
      onCalculated,
      switchToTabIndex
    }
  }
}
</script>

<template>
  <div class="bg-pls-bg">
    <TabContainer 
      ref="tabContainer"
      :tabs="tipsContent ? ['計算', '詳細', '活用のコツ'] : ['計算', '詳細']"
      :default-tab="0"
      @tab-change="onTabChange"
    >
      <!-- 計算タブ -->
      <template #tab-0>
        <div class="flex flex-col gap-pls-s pt-[48px]">
          <!-- DynamicFormコンポーネント -->
           <div class="bg-pls-surface">
            <DynamicForm 
              :form-config="formConfig" 
              :calculation-function="calculationFunction"
              @calculated="onCalculated"
            />
          </div>
          
          <!-- 計算式の説明 -->
          <div class="bg-pls-surface">
            <MarkdownRenderer 
              :content="explanationContent" 
              :tab-prefixes="{1: 'summary_', 2: 'tips_'}"
              :switch-tab="switchToTabIndex"
            />
            <FeedbackLink 
              :calc-id="calculatorId"
              :calc-title="calculatorTitle"
            />
          </div>
        </div>
      </template>
      
      <!-- 詳細タブ -->
      <template #tab-1>
        <div class="pt-[48px] bg-white">
          <MarkdownRenderer 
            :content="markdownContent" 
            :tab-prefixes="{0: 'calculation_', 2: 'tips_'}"
            :switch-tab="switchToTabIndex"
          />
          <SearchLink :search-text="calculatorTitle" />
          <FeedbackLink 
            :calc-id="calculatorId"
            :calc-title="calculatorTitle"
          />
        </div>
      </template>

      <!-- 活用のコツタブ -->
      <template v-if="tipsContent" #tab-2>
        <div class="pt-[48px] bg-white">
          <MarkdownRenderer 
            :content="tipsContent" 
            :tab-prefixes="{0: 'calculation_', 1: 'summary_'}"
            :switch-tab="switchToTabIndex"
            source-file="tips.md"
          />
          <FeedbackLink 
            :calc-id="calculatorId"
            :calc-title="calculatorTitle"
          />
        </div>
      </template>
    </TabContainer>
    
    <ResultDisplay 
      :items="resultItems" 
      :has-details="true"
      :status="resultStatus"
      @show-details="showDetails"
    />
  </div>
</template> 