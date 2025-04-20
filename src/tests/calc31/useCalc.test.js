import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc31/useCalc'
import testCases from '../fixtures/calc31/test-cases.json'

// テストを実行
createCalcTests(31, useCalc, testCases) 