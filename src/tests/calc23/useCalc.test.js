import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc23/useCalc'
import testCases from '../fixtures/calc23/test-cases.json'

// テストを実行
createCalcTests(23, useCalc, testCases) 