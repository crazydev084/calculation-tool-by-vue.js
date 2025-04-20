import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc46/useCalc'
import testCases from '../fixtures/calc46/test-cases.json'

// テストを実行
createCalcTests(46, useCalc, testCases) 