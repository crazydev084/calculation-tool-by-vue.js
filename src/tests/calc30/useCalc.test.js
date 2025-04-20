import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc30/useCalc'
import testCases from '../fixtures/calc30/test-cases.json'

// テストを実行
createCalcTests(30, useCalc, testCases) 