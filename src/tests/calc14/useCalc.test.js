import { useCalc } from '@/components/calculators/calc14/useCalc'
import testCases from '@/tests/fixtures/calc14/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(14, useCalc, testCases) 