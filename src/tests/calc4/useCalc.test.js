import { useCalc } from '@/components/calculators/calc4/useCalc'
import testCases from '../fixtures/calc4/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(4, useCalc, testCases) 