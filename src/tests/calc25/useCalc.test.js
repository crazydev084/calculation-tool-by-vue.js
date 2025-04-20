import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc25/useCalc'
import testCases from '../fixtures/calc25/test-cases.json'

// テストを実行
createCalcTests(25, useCalc, testCases) 