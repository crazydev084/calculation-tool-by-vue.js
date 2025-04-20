import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc21/useCalc'
import testCases from '../fixtures/calc21/test-cases.json'

// テストを実行
createCalcTests(21, useCalc, testCases) 