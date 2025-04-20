import { useCalc } from '@/components/calculators/calc6/useCalc'
import testCases from '../fixtures/calc6/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(6, useCalc, testCases) 