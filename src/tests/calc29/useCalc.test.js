import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc29/useCalc'
import testCases from '../fixtures/calc29/test-cases.json'

// テストを実行
createCalcTests(29, useCalc, testCases) 