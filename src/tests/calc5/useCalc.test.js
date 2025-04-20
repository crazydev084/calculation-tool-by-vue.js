import { useCalc } from '@/components/calculators/calc5/useCalc'
import testCases from '../fixtures/calc5/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(5, useCalc, testCases) 