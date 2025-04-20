import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc17/useCalc'
import testCases from '../fixtures/calc17/test-cases.json'

// テストを実行
createCalcTests(17, useCalc, testCases) 