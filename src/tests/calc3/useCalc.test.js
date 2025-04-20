import { useCalc } from '@/components/calculators/calc3/useCalc'
import testCases from '../fixtures/calc3/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(3, useCalc, testCases) 