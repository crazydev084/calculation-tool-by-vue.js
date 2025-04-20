import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc26/useCalc'
import testCases from '../fixtures/calc26/test-cases.json'

// テストを実行
createCalcTests(26, useCalc, testCases) 