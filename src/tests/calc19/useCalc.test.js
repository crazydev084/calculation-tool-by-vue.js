import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc19/useCalc'
import testCases from '../fixtures/calc19/test-cases.json'

// テストを実行
createCalcTests(19, useCalc, testCases) 