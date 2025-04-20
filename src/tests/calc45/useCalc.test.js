import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc45/useCalc'
import testCases from '../fixtures/calc45/test-cases.json'

// テストを実行
createCalcTests(45, useCalc, testCases) 