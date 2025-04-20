import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CalculatorView from '@/views/CalculatorView.vue'

// URLから計算ツールIDを取得するためのユーティリティ関数
function getCalcIdFromUrl() {
  const url = window.location.pathname;
  
  // index_N.htmlパターンを検出
  const match = url.match(/\/index_(\d+)\.html/);
  
  // クエリパラメータからIDを取得（開発環境用）
  const searchParams = new URLSearchParams(window.location.search);
  const queryId = searchParams.get('id');
  
  // 優先順位：1. URLパス内のID、2. クエリパラメータのID、3. デフォルト値
  return match ? match[1] : (queryId || '1');
}

// index_N.htmlかどうかを判定
const isIndexHtml = window.location.pathname.includes('index_');

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: isIndexHtml ? CalculatorView : HomeView,
      props: isIndexHtml ? () => ({ id: getCalcIdFromUrl() }) : undefined
    },
    // 開発環境用のルート
    ...(!isIndexHtml ? [{
      path: '/calc/:id',
      name: 'calculator',
      component: CalculatorView,
      props: true
    }] : [])
  ]
})

// ハッシュの変更を防止
if (isIndexHtml) {
  router.beforeEach((to, from, next) => {
    if (to.path === '/') {
      next();
    } else {
      next('/');
    }
  });
}

export default router 