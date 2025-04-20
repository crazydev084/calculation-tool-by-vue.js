import { useCalc } from '@/components/calculators/calc8/useCalc'
import testCases from '../fixtures/calc8/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(8, useCalc, testCases) 