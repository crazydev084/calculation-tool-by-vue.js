import { useCalc } from '@/components/calculators/calc1/useCalc'
import testCases from '../fixtures/calc1/test-cases.json'
import { createCalcTests } from '../common/useCalc.test'

createCalcTests(1, useCalc, testCases) 