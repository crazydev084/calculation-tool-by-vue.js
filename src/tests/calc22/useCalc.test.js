import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc22/useCalc'
import testCases from '../fixtures/calc22/test-cases.json'

// テストを実行
createCalcTests(22, useCalc, testCases) 