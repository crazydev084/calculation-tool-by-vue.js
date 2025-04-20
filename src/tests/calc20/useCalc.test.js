import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc20/useCalc'
import testCases from '../fixtures/calc20/test-cases.json'

// テストを実行
createCalcTests(20, useCalc, testCases) 