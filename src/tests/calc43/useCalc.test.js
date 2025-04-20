import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc43/useCalc'
import testCases from '../fixtures/calc43/test-cases.json'

// テストを実行
createCalcTests(43, useCalc, testCases) 