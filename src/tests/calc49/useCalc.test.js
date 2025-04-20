import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc49/useCalc'
import testCases from '../fixtures/calc49/test-cases.json'

// テストを実行
createCalcTests(49, useCalc, testCases) 