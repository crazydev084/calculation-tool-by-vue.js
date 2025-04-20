import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc28/useCalc'
import testCases from '../fixtures/calc28/test-cases.json'

// テストを実行
createCalcTests(28, useCalc, testCases) 