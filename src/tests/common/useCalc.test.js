import { describe, it, expect } from 'vitest'

export function createCalcTests(calcNumber, useCalc, testCases) {
  describe(`calc${calcNumber}`, () => {
    testCases.testCases?.forEach((testCase) => {
      it(testCase.name || testCase.description, () => {
        const { calculateDose } = useCalc()
        const result = calculateDose(testCase.input)
        
        if (testCase.expected === null) {
          expect(result).toBe(null)
        } else {
          expect(result).toEqual(testCase.expected)
        }
      })
    })
  })
} 