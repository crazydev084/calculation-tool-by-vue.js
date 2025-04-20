# Clinical Pocket Calculator

## 概要

このプロジェクトは医療従事者向けの臨床計算ツールを提供するアプリケーションです。体重ベースの投薬量計算、クレアチニンクリアランス計算など、様々な臨床計算機能を集約しています。

## インストールと起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクション用ビルド
npm run build

# 特定の計算ツールのみをビルド
CALCULATOR_ID=1 npm run build

# ビルドのプレビュー
npm run preview

# テスト実行
npm run test
```

## 新しい計算ツールの追加方法

1. `src/components/calculators/calc[番号]` ディレクトリを作成
   - 番号は現在存在するツールの最大番号+1を使用してください

2. 必須ファイルを作成：
   - `config.json`: 計算ツールの設定情報
   - `useCalc.js`: 計算ロジックを実装
   - `Calc.vue`: UIコンポーネント

### Calc.vueの作成

```vue
<script>
import { ref } from 'vue'
import BaseCalc from '@/components/common/BaseCalc.vue'
import { useCalc } from './useCalc'
import formConfig from './config.json'
import markdownContent from './summary.md'
import explanationContent from './calculation.md'

export default {
  name: '計算ツールID',
  components: {
    BaseCalc
  },
  setup() {
    const { calculateDose } = useCalc()
    const resultStatus = ref('green')
    
    // 計算結果を配列形式で格納するための変数
    const resultItems = ref([
      {
        title: "計算ツールの名前",
        value: '-',
        unit: "単位"
      },
      {
        value: null,
        comment: ""
      }
    ])

    const onCalculated = (result) => {
      if (result && result.data) {
        resultItems.value[0].value = result.data[0]
        resultItems.value[1].comment = result.data[1]
        resultStatus.value = result.data[2]
      }
    }

    return {
      formConfig,
      calculateFunction: calculateDose,
      resultItems,
      resultStatus,
      onCalculated,
      markdownContent,
      explanationContent,
      calculatorId: 'ツールID',
      calculatorTitle: '計算ツールの名前'
    }
  }
}
</script>

<template>
  <BaseCalc
    :calculator-id="calculatorId"
    :calculator-title="calculatorTitle"
    :form-config="formConfig"
    :calculation-function="calculateFunction"
    :result-items="resultItems"
    :result-status="resultStatus"
    :explanation-content="explanationContent"
    :markdown-content="markdownContent"
    @calculated="onCalculated"
  />
</template>

<style lang="scss" scoped>
</style> 
```

### config.jsonの作成

選択肢の場合
```json
{
  "fields": [
    {
      "id": "inputFieldId",
      "label": "入力項目のラベル",
      "type": "radio",
      "required": true,
      "defaultValue": 0,
      "options": [
        {
          "label": "選択肢1",
          "value": 1
        },
        {
          "label": "選択肢2",
          "value": 0
        }
      ]
    },
    // 他の入力フィールド...
  ]
}
```

数値入力の場合
```json
{
  "fields": [
    {
      "id": "inputFieldId",
      "label": "入力項目のラベル",
      "type": "number",
      "unit": "単位",
      "required": true,
      "defaultValue": "",
      "min": 0,
      "step": 1,
      "placeholder": "入力数値例"
    },
    // 他の入力フィールド...
  ]
}
```

### useCalc.jsの作成

```javascript
import { ref, computed } from 'vue'
import config from './config.json'
import Big from 'big.js'

export function useCalc() {
  const input = ref({})
  
  /**
   * @param {Object} formData - フォームからの入力値
   * @returns {Object} - 計算結果
   */
  const calculateDose = (formData) => {
    if (!formData) return null
    
    // 入力チェック
    if (formData.field1 === null || formData.field2 === null) {
      return null
    }

    // 計算ロジック
    const field1 = new Big(formData.field1)
    const field2 = new Big(formData.field2)

    const result = getResult(field1, field2)
    const status = getStatus(result)
    const message = getMessage(result)

    return {
      data: [
        result,
        message,
        status
      ]
    }
  }

  // 結果計算ロジック
  const getResult = (field1, field2) => {
    let result = field1.plus(field2).toNumber()
    return result
  }

  // ステータス判定ロジック
  const getStatus = (score) => {
    if (score <= 1) return "green"
    if (score <= 3) return "yellow"
    return "red"
  }

  // メッセージ生成ロジック
  const getMessage = (score) => {
    // スコアによってメッセージを返す
    return "計算結果: " + score
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
```

### 活用のコツ（tips.md）の書き方

計算ツールの「活用のコツ」（tips.md）は、以下の規則に従って作成します：

> **ヒント**：テンプレートファイル [`src/utils/tipTemplate.md`](src/utils/tipsTemplate.md) をコピーして使用することができます。このテンプレートには必要なすべての構造が含まれています。

#### 1. 基本構造

tips.md ファイルは特定の構造で作成してください：

1. **タイトル部分**：`### Well's criteria {#tipsHeader}`

- h3 見出し（`###`）を使用
- 必ず`{#tipsHeader}`を ID として付与
- 監修情報を含めることができる

2. **テーマリスト**：`### 題目 {#topics}`

- h3 見出し（`###`）を使用
- 必ず`{#topics}`を ID として付与
- 各ディスカッションテーマへのリンクを含むリスト

3. **ディスカッション**：`### ディスカッションコメント {#discussion}`

- h3 見出し（`###`）を使用
- 必ず`{#discussion}`を ID として付与
- 複数のサブディスカッションを含む

4. **参考文献**：`### 引用文献 {#references}`

- h3 見出し（`###`）を使用
- 必ず`{#references}`を ID として付与
- 文献引用リストを含む

#### 2. ID 標記のルール

1. **h3 見出しの固定 ID**：h3 見出しには以下の固定 ID のみ使用可能

- `{#tipsHeader}` - タイトル部分用
- `{#topics}` - テーマリスト用
- `{#discussion}` - ディスカッション部分用
- `{#references}` - 引用文献用
- これ以外の ID を h3 見出しに使用することはできない

2. **トピックの ID 標記**：`#discussion`セクション内の h4 見出し（`####`）には自由に ID を指定可能

- 例：`#### 【DVTを疑う臨床症状】とは？ {#suggestDVT}`
- これらの ID はドキュメント内のどこからでも参照可能
- `[リンクテキスト](#suggestDVT)`の形式で、対応するセクションに自動的にスクロールする

#### 3. 特殊ブロック形式

1. **青色背景ブロック**：
   ```markdown
   <div class="blue-box">
   ##### PEで見られる症状<sup>6)</sup>
   * 呼吸困難（73%）
   * 胸痛（66%）
   * ...
   </div>
   ```
   - HTML 要素`<div class="blue-box">`を使用して特殊スタイルブロックを作成
   - 内部に h5 見出し（`#####`）とリストが使用可能
   - 上付き注釈`<sup>n)</sup>`形式の引用をサポート

#### 4. サブディスカッション部分

1. **ディスカッションセクション**：

   ```markdown
   #### 【DVT を疑う臨床症状】とは？ {#suggestDVT}

   10 年目呼吸器外科医、外科専門医

   深部静脈血栓症（Deep Vein Thrombosis：DVT）を疑う臨床症状としては、主に以下のような所見が挙げられます。

   - 片側性の下肢の腫脹
   ```

   - h4 見出し（`####`）を使用
   - ID 標記`{#identifier}`を含める
   - 冒頭には著者の専門的背景を記載
   - その後にディスカッション内容、リストや段落を含めることが可能

#### 5. 引用と注釈

1. **上付き引用**：`<sup>n)</sup>`形式を使用

   - 例：`PEの症状<sup>6)</sup>`

2. **引用文献形式**：
   ```markdown
   1. 日本循環器学会ほか合同：「肺血栓塞栓症および深部静脈血栓症の診断,治療,予防に関するガイドライン（2017 年改訂版）」.
   2. Wells PS, et al. Evaluation of D-dimer in the diagnosis of suspected deep-vein thrombosis. N Engl J Med. 2003;349(13):1227-35.
   ```
   - 数字+右括弧を番号として使用：`1)`
   - 引用形式は学術引用規範に従う

## テストの追加

1. `src/tests/fixtures/calc[番号]` ディレクトリを作成

2. テストケースJSONファイルを作成
```json
{
  "testCases": [
    {
      "description": "テストケース1の説明",
      "input": {
        "field1": 1,
        "field2": 2
      },
      "expected": {
        "data": [3, "計算結果: 3", "yellow"]
      }
    },
    // その他のテストケース
  ]
}
```

3. テストファイルを作成
```javascript
import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc[番号]/useCalc'
import testCases from '../fixtures/calc[番号]/test-cases.json'

// テストを実行
createCalcTests([番号], useCalc, testCases)
```

## ビルドプロセス

プロジェクトのビルドプロセスは以下の手順で行われます：

1. `npm run build` コマンドを実行
2. ビルド時に `vite.config.js` 内の `generateCalculatorList` 関数によって、自動的に計算ツールのリストが生成される
3. 生成されたリストは `src/generated/calculatorList.js` に保存される
4. HomeView で生成されたリストが使用され、利用可能な計算ツールとして表示される

### タイトルの自動検出

計算ツールのタイトルは以下の順序で決定されます：

1. `config.json` ファイル内に `title` プロパティがある場合、それが使用されます
2. なければ `Calc.vue` 内の `calculatorTitle` 変数の値が使用されます
3. どちらも見つからない場合は「計算ツール [ID]」というデフォルト名が使用されます