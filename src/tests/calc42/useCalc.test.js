import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc42/useCalc'
import testCases from '../fixtures/calc42/test-cases.json'

// テストを実行
createCalcTests(42, useCalc, testCases) 