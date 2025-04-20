import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc18/useCalc'
import testCases from '../fixtures/calc18/test-cases.json'

// テストを実行
createCalcTests(18, useCalc, testCases) 