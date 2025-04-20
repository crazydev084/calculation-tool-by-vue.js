import { useCalc } from '@/components/calculators/calc10/useCalc'
import testCases from '../fixtures/calc10/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(10, useCalc, testCases) 