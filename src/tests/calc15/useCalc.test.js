import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc15/useCalc'
import testCases from '../fixtures/calc15/test-cases.json'

// テストを実行
createCalcTests(15, useCalc, testCases) 