import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc48/useCalc'
import testCases from '../fixtures/calc48/test-cases.json'

// テストを実行
createCalcTests(48, useCalc, testCases) 