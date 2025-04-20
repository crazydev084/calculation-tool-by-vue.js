import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function buildCalculators() {
  const calculatorsDir = path.resolve(__dirname, '../src/components/calculators')
  const calcIds = fs.readdirSync(calculatorsDir)
    .filter(calc => {
      const fullPath = path.join(calculatorsDir, calc)
      return fs.statSync(fullPath).isDirectory() && calc.startsWith('calc')
    })
    .map(calc => parseInt(calc.replace('calc', '')))
    .sort((a, b) => a - b)

  // 各計算機ごとに個別にビルド
  for (const id of calcIds) {
    console.log(`Building calculator ${id}...`)
    try {
      execSync(`CALCULATOR_ID=${id} vite build`, {
        stdio: 'inherit',
        env: { ...process.env, CALCULATOR_ID: id.toString() }
      })

      // ビルドされたファイルを移動
      const builtFile = path.resolve(__dirname, `../dist/calc${id}/index.html`)
      const targetFile = path.resolve(__dirname, `../dist/index_${id}.html`)
      if (fs.existsSync(builtFile)) {
        fs.renameSync(builtFile, targetFile)
        fs.rmdirSync(path.resolve(__dirname, `../dist/calc${id}`), { recursive: true })
      }
    } catch (error) {
      console.error(`Failed to build calculator ${id}:`, error)
      process.exit(1)
    }
  }
}

buildCalculators().catch(err => {
  console.error('Build failed:', err)
  process.exit(1)
}) 