import { useCalc } from '@/components/calculators/calc9/useCalc'
import testCases from '../fixtures/calc9/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(9, useCalc, testCases) 