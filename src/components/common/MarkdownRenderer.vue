<template>
  <div class="px-pls-m">
    <div class="markdown-content" :class="contentClass" v-html="renderedContent" ref="markdownContent" v-show="true"></div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { render, useMarkdownIt, useMarked, renderTipsFile } from '@/utils/markdownParser'
import { marked } from 'marked'
import { getImageDataUrl } from '@/utils/imageCache'

export default {
  name: 'MarkdownRenderer',
  props: {
    content: {
      type: String,
      required: true
    },
    useMarked: {
      type: Boolean,
      default: false
    },
    enableScrollToAnchor: {
      type: Boolean,
      default: true
    },
    tabPrefixes: {
      type: Object,
      default: () => ({})
    },
    switchTab: {
      type: Function,
      default: null
    },
    // ソースファイル名の属性、コンテンツのソースを判断するため
    sourceFile: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const renderedContent = ref('')
    const markdownContent = ref(null)
    
    // ソースファイルに基づいてCSSクラスを計算
    const contentClass = computed(() => {
      if (props.sourceFile.endsWith('tips.md')) {
        return '--calc-tips'
      }
      return ''
    })
    
    // スクロールとハイライトのロジックを再利用可能な関数として抽出
    const scrollToElement = (id, highlight = true, delay = 100) => {
      // ルーティングパスの場合は処理しない
      if (!id || id.startsWith('/')) {
        return false;
      }
      
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // タブの下に収まるようにスクロール
          const offset = 50;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition - offset;
          
          window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          if (highlight) {
            element.classList.add('highlight-target');
            setTimeout(() => {
              element.classList.remove('highlight-target');
            }, 2000);
          }
          return true;
        } else {
          console.warn('アンカー要素が見つかりません:', id);
          return false;
        }
      }, delay);
    };
    
    // リンククリックの処理関数
    const handleAnchorClick = (event) => {
      // リンク要素を探す
      let target = event.target;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }
      
      // アンカーリンクがある場合
      if (target && target.hash) {
        // ルーティングリンク（#/で始まる）の場合はブラウザのデフォルト動作を許可
        if (target.hash.startsWith('#/')) {
          return;
        }
        
        event.preventDefault();
        
        // IDに基づいて要素を見つける
        const id = target.hash.substring(1);
        
        // IDがタブプレフィックスで始まる場合、タブを切り替える
        if (props.switchTab && props.tabPrefixes) {
          for (const [tabIndex, prefix] of Object.entries(props.tabPrefixes)) {
            if (id.startsWith(prefix)) {
              // タブを切り替える
              props.switchTab(Number(tabIndex));
              
              // タブ切り替え後に要素を探してスクロール
              scrollToElement(id);
              return;
            }
          }
        }
        
        // 通常のアンカー処理
        if (scrollToElement(id)) {
          // URLをクエリパラメータで更新（ハッシュルーターと衝突しないように）
          const url = new URL(window.location.href);
          url.searchParams.set('anchor', id);
          history.pushState(null, null, url.toString());
        }
      }
    };
    
    // 画像処理ロジックの最適化
    const renderMarkdown = async (markdown) => {
      if (!markdown) return '';
      
      try {
        // 画像パスを検出する正規表現
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
        
        // すべての画像変換を並行して実行
        const replacements = []
        let match
        let lastIndex = 0
        
        // 正規表現の状態をリセット
        imageRegex.lastIndex = 0
        
        while ((match = imageRegex.exec(markdown)) !== null) {
          const [fullMatch, alt, imagePath] = match
          replacements.push(
            getImageDataUrl(imagePath).then(dataUrl => ({
              original: fullMatch,
              replacement: `![${alt}](${dataUrl})`
            }))
          )
        }

        // すべての変換を待つ
        const results = await Promise.all(replacements)
        
        // 変換結果で置換（正規表現の代わりに文字列置換を使用）
        let processedMarkdown = markdown
        results.forEach(({ original, replacement }) => {
          processedMarkdown = processedMarkdown.replace(original, replacement)
        })

        // マークダウンをHTMLに変換
        if (props.sourceFile.endsWith('tips.md')) {
          // tips.mdファイル専用の処理を使用
          renderedContent.value = renderTipsFile(processedMarkdown)
        } else {
          // 通常のmarkdown処理を使用
          renderedContent.value = render(processedMarkdown)
        }
      } catch (error) {
        console.error('Markdown処理エラー:', error)
        // エラーが発生した場合でも元のマークダウンをレンダリング
        renderedContent.value = render(markdown)
      }
    }
    
    // イベントリスナー
    let handleLinkClick = null;
    
    // 単一のonMountedコールバック
    onMounted(() => {
      // 初期化時にmarkdown-itを確実に初期化
      useMarkdownIt()
      renderMarkdown(props.content)
      
      // アンカーリンクのスクロール処理
      if (props.enableScrollToAnchor) {
        // リンククリック時の処理をハンドル
        handleLinkClick = handleAnchorClick;
        
        // リンクのクリックをリッスン
        const contentElement = markdownContent.value;
        if (contentElement) {
          contentElement.addEventListener('click', handleLinkClick);
        }
        
        // URLハッシュがあれば対応する要素にスクロール
        if (window.location.hash) {
          // ルーティングの一部として使われるURLハッシュは処理しない
          // 例: #/calc/7 のようなハッシュルーティングは無視
          const hash = window.location.hash;
          if (!hash.includes('/#/') && !hash.startsWith('#/')) {
            const id = hash.substring(1);
            scrollToElement(id, false, 300);
          }
        }
        
        // クエリパラメータからアンカー情報を取得
        const url = new URL(window.location.href);
        const anchorId = url.searchParams.get('anchor');
        if (anchorId) {
          scrollToElement(anchorId, true, 300);
        }
      }
    })
    
    // contentが変更されたら再レンダリング
    watch(() => props.content, renderMarkdown)
    
    // イベントリスナーをクリーンアップ
    onBeforeUnmount(() => {
      if (handleLinkClick && markdownContent.value) {
        markdownContent.value.removeEventListener('click', handleLinkClick);
      }
    })
    
    return {
      renderedContent,
      markdownContent,
      contentClass
    }
  }
}
</script>

<style lang="scss">
.markdown-content {
  @apply overflow-x-auto;

  h1, h2, h3, h4, h5, h6, p, div, ul, ol, li, table, blockquote {
    scroll-margin-top: 60px; /* スクロール時のマージンを追加（タブの高さ+余白） */
  }

  /* 特にアンカー対象となる要素のスクロールマージン */
  [id] {
    scroll-margin-top: 60px;
  }

  h1 {
    @apply text-2xl font-bold mb-4;
  }

  h2 {
    @apply text-xl font-bold mt-6 mb-3;
  }

  h3:not(#tipsHeader h3) {
    @apply text-pls-l font-pls-bold border-b border-b-pls-border mt-6 mb-pls-s;

    &::before {
      content: '';
      @apply border-l-[4px] border-pls-blue-600 pr-pls-s;
    }
  }

  h4 {
    @apply text-pls-m font-pls-bold leading-pls-body-m mb-pls-m;
  }

  p {
    @apply text-pls-m leading-pls-body-m mb-pls-m;

    img {
      @apply max-w-[398px] w-[100%] h-auto mx-auto;
    }
  }

  small, p small {
    @apply text-xs leading-[1rem];
  }

  ul, ol {
    @apply ml-6 mb-2;
  }

  ul {
    @apply list-disc;
  }

  ol {
    @apply list-decimal;
  }

  li {
    @apply break-all;
  }

  ol > li {
    @apply list-decimal list-item;
  }

  table {
    @apply w-full max-w-full mb-4 border-collapse;
    font-size: clamp(0.75rem, 0.6364rem + 0.5682vw, 1rem);
  }

  th, td {
    @apply border border-gray-300 p-1 text-center align-middle;
  }

  th {
    @apply bg-gray-100 font-bold text-center;
  }

  strong {
    @apply font-bold;
  }
  
  /* アンカーリンクのスタイル */
  a {
    @apply text-blue-600 hover:text-blue-800 hover:underline;
  }

  dl {
    @apply mb-pls-m;
  }

  dt {
    @apply font-medium;
  }

  dd {
    @apply ml-pls-m;
  }

  /* リンクホバー時に目立つようにする */
  :target, .highlight-target {
    @apply bg-yellow-100 px-1 py-2 -mx-1 rounded transition-colors duration-300;
  }

  .tags {
    @apply flex gap-pls-s mb-pls-m;

    label {
      @apply text-pls-s bg-pls-blue-100 py-pls-s px-pls-m rounded-pls-full;
    }
  }

  .gray-box {
    @apply bg-gray-100 p-pls-m mb-pls-m;
  }

  .emphasis_high_risk {
    @apply p-pls-xxs rounded-pls-xxs bg-pls-red-300 text-pls-white;
  }

  .math-formula {
    @apply bg-gray-100 rounded p-4 my-6 font-medium text-pls-s leading-relaxed overflow-x-auto block;
  }

  /* 活用のコツ用スタイル */
  &.--calc-tips {

    @apply my-6;

    // targetエレメントの背景ハイライトを解除
    :target, .highlight-target {
      @apply bg-transparent px-0 py-0 mx-0 rounded-none transition-none;
    }

    // 活用のコツヘッダー
    #tipsHeader {
      @apply bg-pls-blue-600 text-white rounded-lg p-4 relative overflow-hidden;
      
      // 装飾用の半透明円形（小）
      &::after {
        content: '';
        @apply absolute w-16 h-16 rounded-full bg-white opacity-5;
        top: -1rem;
        left: -1rem;
        z-index: 0;
      }

      h3 {
        @apply text-pls-l font-pls-bold p-0;

        &::after {
          display: none;
        }
      }

      p {
        @apply mt-2 mb-0 px-2 py-1 bg-[rgba(255,255,255,0.1)] rounded text-xs;
      }
    }

    // 活用のテーマ
    #topics {
      ul {
        @apply list-none ml-0 mb-0 flex flex-col gap-1;

        li {
          @apply p-4 rounded-lg bg-[#F6F6F9] relative pr-6;
          
          &::after {
            content: '';
            @apply absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z'%3E%3C/path%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: center;
          }

          a {
            @apply text-pls-object-primary font-bold block w-full no-underline;
          }
        }
      }
    }

    // 回答
    #discussion {
      section {
        @apply border border-pocket-border rounded-lg;

        h4 {
          @apply mb-4 p-4 text-white bg-pls-blue-600 rounded-t-lg flex;
          
          &::before {
            content: 'Q';
            @apply text-pls-blue-600 bg-white rounded-full w-6 h-6 text-center leading-6 block mr-2 flex-shrink-0;
          }
        }

        ul {
          @apply list-none ml-0 my-4 flex flex-col gap-1;

          li {
            @apply flex;
          }
          
          li::before {
            content: '';
            @apply w-2 h-2 bg-pls-blue-600 rounded-full block mr-2 mt-2 flex-shrink-0;
          }
        }

        .blue-box {
          @apply my-4 mx-4 p-4 rounded-lg bg-[#F6F6F9] relative pr-6;

          h5 {
            @apply font-bold text-pls-blue-600 mb-2;
          }
        }
        

        > *:not(h4) {
          @apply px-4;
        }

        > p:first-of-type {
          @apply text-pls-blue-600 font-bold flex;

          &::before {
            content: 'A';
            @apply text-white bg-pls-blue-600 rounded-full w-6 h-6 text-center leading-6 block mr-2 flex-shrink-0;
          }
        }
      }

      section + section {
        @apply mt-4;
      }
    }
  }
}
</style> 