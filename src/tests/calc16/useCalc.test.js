import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc16/useCalc'
import testCases from '../fixtures/calc16/test-cases.json'

// テストを実行
createCalcTests(16, useCalc, testCases) 