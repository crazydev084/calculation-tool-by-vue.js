import { useCalc } from '@/components/calculators/calc12/useCalc'
import testCases from '@/tests/fixtures/calc12/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(12, useCalc, testCases) 