import { useCalc } from '@/components/calculators/calc11/useCalc'
import testCases from '../fixtures/calc11/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(11, useCalc, testCases) 