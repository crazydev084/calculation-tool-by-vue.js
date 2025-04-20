import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc27/useCalc'
import testCases from '../fixtures/calc27/test-cases.json'

// テストを実行
createCalcTests(27, useCalc, testCases) 