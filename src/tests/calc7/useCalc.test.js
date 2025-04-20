import { useCalc } from '@/components/calculators/calc7/useCalc'
import testCases from '../fixtures/calc7/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(7, useCalc, testCases) 