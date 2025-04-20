import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc41/useCalc'
import testCases from '../fixtures/calc41/test-cases.json'

// テストを実行
createCalcTests(41, useCalc, testCases) 