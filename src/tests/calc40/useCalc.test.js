import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc40/useCalc'
import testCases from '../fixtures/calc40/test-cases.json'

// テストを実行
createCalcTests(40, useCalc, testCases) 