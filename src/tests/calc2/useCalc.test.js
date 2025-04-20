import { useCalc } from '@/components/calculators/calc2/useCalc'
import testCases from '../fixtures/calc2/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(2, useCalc, testCases) 