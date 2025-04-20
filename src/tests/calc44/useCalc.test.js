import { createCalcTests } from '../common/useCalc.test.js'
import { useCalc } from '@/components/calculators/calc44/useCalc'
import testCases from '../fixtures/calc44/test-cases.json'

// テストを実行
createCalcTests(44, useCalc, testCases) 