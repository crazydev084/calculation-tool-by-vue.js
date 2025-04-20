import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc24/useCalc'
import testCases from '../fixtures/calc24/test-cases.json'

// テストを実行
createCalcTests(24, useCalc, testCases) 