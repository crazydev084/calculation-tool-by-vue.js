import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc47/useCalc'
import testCases from '../fixtures/calc47/test-cases.json'

// テストを実行
createCalcTests(47, useCalc, testCases) 