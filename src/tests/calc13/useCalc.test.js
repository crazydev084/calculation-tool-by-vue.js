import { useCalc } from '@/components/calculators/calc13/useCalc'
import testCases from '@/tests/fixtures/calc13/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(13, useCalc, testCases) 