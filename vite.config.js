import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { viteSingleFile } from 'vite-plugin-singlefile'
import mime from 'mime-types'
import { fileURLToPath, URL } from 'url'
import { watch } from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const execAsync = promisify(exec)

// ビルドモードかどうかを確認
const isBuildCommand = process.argv.includes('build')

// calculatorsフォルダから自動的にIDを取得する関数
function getCalculatorIds() {
  const calculatorsDir = path.resolve(__dirname, 'src/components/calculators')
  return fs.readdirSync(calculatorsDir)
    .filter(calc => {
      const fullPath = path.join(calculatorsDir, calc)
      return fs.statSync(fullPath).isDirectory() && calc.startsWith('calc')
    })
    .map(calc => parseInt(calc.replace('calc', '')))
    .sort((a, b) => a - b)
}

// Markdownデータを計算機ごとに処理する関数
function processMarkdownsByCalculator(calcId) {
  const calculatorsDir = path.resolve(__dirname, 'src/components/calculators')
  const calcName = `calc${calcId}`
  const calcDir = path.join(calculatorsDir, calcName)
  const markdownData = {}

  // 計算機固有のMarkdownファイルを探索
  function findMarkdownFiles(dir) {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const fullPath = path.join(dir, file)
      if (fs.statSync(fullPath).isDirectory()) {
        findMarkdownFiles(fullPath)
      } else if (file.endsWith('.md')) {
        const relativePath = path.relative(calculatorsDir, fullPath)
        const content = fs.readFileSync(fullPath, 'utf-8')
        
        // 画像をBase64に変換
        let processedContent = content.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, imgPath) => {
          if (imgPath.startsWith('http') || imgPath.startsWith('data:')) {
            return match
          }
          try {
            const imgFullPath = path.resolve(dir, imgPath)
            if (fs.existsSync(imgFullPath)) {
              const imgBuffer = fs.readFileSync(imgFullPath)
              const base64Data = imgBuffer.toString('base64')
              const mimeType = mime.lookup(imgFullPath) || 'image/png'
              return `![${alt}](data:${mimeType};base64,${base64Data})`
            }
          } catch (error) {
            console.warn(`Warning: Failed to process image ${imgPath}`, error)
          }
          return match
        })
        
        markdownData[relativePath] = processedContent
      }
    })
  }

  if (fs.existsSync(calcDir)) {
    findMarkdownFiles(calcDir)
  }

  return markdownData
}

// Markdownファイルをインポートするためのプラグイン（画像のBase64埋め込み対応版）
const markdownImport = () => {
  return {
    name: 'markdown-import',
    transform(code, id) {
      if (id.endsWith('.md')) {
        const mdDir = path.dirname(id);
        let fileContent = fs.readFileSync(id, 'utf-8');
        
        // Markdownファイル内の画像参照を検出して置換
        // 対応パターン: ![alt](path/to/image.png)
        const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
        fileContent = fileContent.replace(imgRegex, (match, alt, imgPath) => {
          // 外部URLの場合はそのまま返す
          if (imgPath.startsWith('http://') || imgPath.startsWith('https://') || imgPath.startsWith('data:')) {
            return match;
          }
          
          try {
            // 画像パスの解決（相対パスを絶対パスに変換）
            const absoluteImgPath = path.resolve(mdDir, imgPath);
            
            // ファイルが存在するか確認
            if (fs.existsSync(absoluteImgPath)) {
              // ファイルを読み込んでBase64エンコード
              const imgBuffer = fs.readFileSync(absoluteImgPath);
              const base64Data = imgBuffer.toString('base64');
              
              // MIMEタイプを取得
              const mimeType = mime.lookup(absoluteImgPath) || 'image/png';
              
              // データURLを生成して返す
              return `![${alt}](data:${mimeType};base64,${base64Data})`;
            } else {
              console.warn(`警告: 画像ファイル ${absoluteImgPath} が見つかりません`);
              return match;
            }
          } catch (error) {
            console.error(`画像の処理中にエラーが発生しました: ${imgPath}`, error);
            return match;
          }
        });
        
        return `export default ${JSON.stringify(fileContent)}`;
      }
    }
  }
}

// 開発サーバー用のカスタムミドルウェア
const devServerMiddleware = () => {
  return {
    name: 'dev-server-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // URLが/index_N.htmlパターンにマッチするか確認
        const match = req.url.match(/^\/index_(\d+)\.html/);
        if (match) {
          // index.htmlの内容を返す
          req.url = '/';
        }
        next();
      });
    }
  };
};

const watchBuildPlugin = () => {
  return {
    name: 'watch-build',
    apply: 'build',
    closeBundle: async () => {
      // watch モードかどうかを確認
      const isWatchMode = process.argv.includes('--watch')
      
      // 通常のビルドの場合は何もせずに終了
      if (!isWatchMode) {
        return
      }

      const watchDirs = [
        'src/components',
        'src/tests',
        'src/tests/fixtures'  // fixturesディレクトリを追加
      ].filter(dir => {
        const fullPath = path.resolve(__dirname, dir)
        return fs.existsSync(fullPath)
      })

      console.log('🔍 ファイル監視を開始します:', watchDirs)

      let buildTimeout
      let testTimeout
      const watchers = []

      // 各ディレクトリの監視を設定
      watchDirs.forEach(dir => {
        const watcher = fs.watch(dir, { recursive: true }, async (eventType, filename) => {
          // fixturesディレクトリの変更の場合はテストを実行
          if (dir.includes('fixtures') && filename.endsWith('.json')) {
            clearTimeout(testTimeout)
            testTimeout = setTimeout(async () => {
              try {
                console.log('🧪 テストケースの変更を検知しました。テストを実行します...')
                const { stdout, stderr } = await execAsync('yarn test')
                if (stderr) console.error('テストエラー:', stderr)
                console.log('✅ テスト完了:', stdout)
              } catch (error) {
                console.error('❌ テスト失敗:', error)
              }
            }, 1000)
          } else {
            // その他のディレクトリの変更の場合はビルドを実行
            clearTimeout(buildTimeout)
            buildTimeout = setTimeout(async () => {
              try {
                console.log('🔄 ファイルの変更を検知しました。ビルドを開始します...')
                const { stdout, stderr } = await execAsync('vite build --mode production')
                if (stderr) console.error('ビルドエラー:', stderr)
                console.log('✅ ビルド完了:', stdout)
              } catch (error) {
                console.error('❌ ビルド失敗:', error)
              }
            }, 1000)
          }
        })
        watchers.push(watcher)
      })

      // watch モードの場合のみプロセスを継続
      return new Promise(() => {
        process.on('SIGINT', () => {
          console.log('\n👋 ファイル監視を終了します')
          watchers.forEach(watcher => watcher.close())
          process.exit(0)
        })
      })
    }
  }
}

// markdownFilterプラグインを別途定義
const markdownFilter = (calcId = null) => ({
  name: 'markdown-filter',
  transform(code, id) {
    if (id.endsWith('.md')) {
      // ファイルのディレクトリパスを取得
      const mdDir = path.dirname(id);
      
      // 特定の計算機のmarkdownファイルのみを処理
      if (calcId === null || id.includes(`/calc${calcId}/`)) {
        // 画像パスを処理
        let processedCode = code.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, imgPath) => {
          // 外部URLや既にbase64エンコードされているパスはそのまま
          if (imgPath.startsWith('http://') || 
              imgPath.startsWith('https://') || 
              imgPath.startsWith('data:')) {
            return match;
          }
          
          try {
            // 画像パスの解決（相対パスを絶対パスに変換）
            const absoluteImgPath = path.resolve(mdDir, imgPath);
            
            // ファイルが存在するか確認
            if (fs.existsSync(absoluteImgPath)) {
              // ファイルを読み込んでBase64エンコード
              const imgBuffer = fs.readFileSync(absoluteImgPath);
              const base64Data = imgBuffer.toString('base64');
              
              // MIMEタイプを取得
              const mimeType = mime.lookup(absoluteImgPath) || 'image/png';
              
              // データURLを生成して返す
              return `![${alt}](data:${mimeType};base64,${base64Data})`;
            } else {
              console.warn(`警告: 画像ファイル ${absoluteImgPath} が見つかりません`);
              return match;
            }
          } catch (error) {
            console.error(`画像の処理中にエラーが発生しました: ${imgPath}`, error);
            return match;
          }
        });
        
        return {
          code: `export default ${JSON.stringify(processedCode)}`,
          map: null
        }
      }
      return {
        code: 'export default ""',
        map: null
      }
    }
  }
})

// 計算ツールリストを自動生成する関数
function generateCalculatorList() {
  const calculatorsDir = path.resolve(__dirname, 'src/components/calculators')
  const calculators = []
  
  // calculatorsディレクトリが存在する場合のみ処理
  if (fs.existsSync(calculatorsDir)) {
    // calculatorsディレクトリ内のサブディレクトリを検索
    fs.readdirSync(calculatorsDir).forEach(dir => {
      // calc数字形式のディレクトリのみを処理
      if (dir.startsWith('calc') && /calc\d+/.test(dir)) {
        const calcId = parseInt(dir.replace('calc', ''))
        
        // まずCalc.vueファイルからcalculatorTitleを探す
        const calcVuePath = path.join(calculatorsDir, dir, 'Calc.vue')
        let title = `計算ツール ${calcId}`
        
        if (fs.existsSync(calcVuePath)) {
          try {
            const calcVueContent = fs.readFileSync(calcVuePath, 'utf-8')
            // calculatorTitleを正規表現で抽出
            const titleMatch = calcVueContent.match(/calculatorTitle:\s*['"]([^'"]+)['"]/);
            if (titleMatch && titleMatch[1]) {
              title = titleMatch[1]
            }
          } catch (error) {
            console.error(`Error parsing Calc.vue for calculator ${dir}:`, error)
          }
        }
        
        // config.jsonがある場合はそちらも確認
        const configPath = path.join(calculatorsDir, dir, 'config.json')
        if (fs.existsSync(configPath)) {
          try {
            const configContent = fs.readFileSync(configPath, 'utf-8')
            const config = JSON.parse(configContent)
            
            // config.jsonにtitleがある場合はそちらを優先
            if (config.title) {
              title = config.title
            }
          } catch (error) {
            console.error(`Error parsing config.json for calculator ${dir}:`, error)
          }
        }
        
        // ツール情報を追加
        calculators.push({
          id: calcId,
          title: title
        })
      }
    })
  }
  
  // 手動で定義された基本ツールを追加
  const baseCalculators = [
    { id: 1, title: '体重ベース投薬量計算' },
    { id: 2, title: '体表面積ベース投薬量計算' },
    { id: 3, title: 'クレアチニンクリアランス計算' }
  ]
  
  // 既存のIDと重複しないようにベースツールを追加
  baseCalculators.forEach(calc => {
    if (!calculators.some(c => c.id === calc.id)) {
      calculators.push(calc)
    }
  })
  
  // ID順にソート
  calculators.sort((a, b) => a.id - b.id)
  
  // 生成されたリストをファイルに書き込む
  const outputDir = path.resolve(__dirname, 'src/generated')
  const outputPath = path.resolve(outputDir, 'calculatorList.js')
  
  // 出力ディレクトリが存在しない場合は作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  // ファイルに書き込む
  const fileContent = `// このファイルは自動生成されています。手動で編集しないでください。
export const calculatorList = ${JSON.stringify(calculators, null, 2)}
`
  fs.writeFileSync(outputPath, fileContent)
  
  console.log(`Generated calculator list with ${calculators.length} tools`)
  return calculators
}

// ビルド時に計算ツールリストを生成
generateCalculatorList()

export default defineConfig(({ command, mode }) => {
  const calcId = process.env.CALCULATOR_ID ? parseInt(process.env.CALCULATOR_ID) : null

  return {
    base: './',
    plugins: [
      vue(),
      markdownFilter(calcId),
      devServerMiddleware(),
      watchBuildPlugin(),
      {
        ...viteSingleFile(),
        enforce: 'post'
      }
    ],
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      allowedHosts: [
        'localhost'
      ]
    },
    build: {
      target: 'esnext',
      assetsInlineLimit: 100000000,
      chunkSizeWarningLimit: 100000000,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          format: 'iife'
        },
        input: {
          main: path.resolve(__dirname, 'index.html')
        }
      },
      outDir: calcId ? `dist/calc${calcId}` : 'dist'
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer()
        ]
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/tests/**/useCalc.test.js'],  // すべてのuseCalc.test.jsファイルを含む
      exclude: ['src/tests/common/**'],  // commonディレクトリを除外
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
      },
    },
  }
}) 