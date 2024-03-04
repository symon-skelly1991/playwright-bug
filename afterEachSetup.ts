/* eslint-disable no-empty-pattern */
import { test, expect, type TestInfo } from '@playwright/test'
import * as path from 'path'

test.afterEach(async ({ }, testInfo) => {
  const steps = (testInfo as any)._steps
  if (testInfo.status !== 'passed') {
    attachTraceToReport(testInfo)
    attachScreenshotsToReport(testInfo)
  }

  generateReportSteps(steps, testInfo)
  console.log(testInfo.annotations)
})

export function generateReportSteps (steps: any, testInfo: TestInfo) {
  const testrailResultSteps: string[] = []
  for (const step in steps) {
    if (steps[step].stepId.includes('test.step') === true) {
      console.log(`${testInfo.title}: Step: ${JSON.stringify(steps[step])}`)
      const errorMessage = steps[step].error
      if (errorMessage === undefined) {
        testrailResultSteps.push(`passed: ${steps[step].title}`)
      } else {
        testrailResultSteps.push(`failed: ${steps[step].title}`)
      }
    }
  }
  for (const step of testrailResultSteps) {
    testInfo.annotations.push({ type: 'testrail_result_step', description: step })
  }
  return testrailResultSteps
}

export function attachScreenshotsToReport (testInfo: TestInfo) {
  const pathParts = testInfo.outputDir.split('\\')
  // Filter out any empty strings or white spaces.
  const filteredPathParts = pathParts.filter(part => part.trim() !== '')
  // Get the last directory.
  const lastDirectory = filteredPathParts[filteredPathParts.length - 1]
  const attachments = testInfo.attachments
  let filePath = ''

  for (const attachment of attachments) {
    const filename = path.basename(attachment.path)
    filePath = path.join('results', 'testrail-results', 'traces', lastDirectory, filename)
    testInfo.annotations.push({ type: 'testrail_attachment', description: filePath })
  }

}

export function attachTraceToReport (testInfo: TestInfo) {
  const pathParts = testInfo.outputDir.split('\\')
  // Filter out any empty strings or white spaces.
  const filteredPathParts = pathParts.filter(part => part.trim() !== '')
  // Get the last directory.
  const lastDirectory = filteredPathParts[filteredPathParts.length - 1]
  let filePath = path.join('results', 'testrail-results', 'traces', lastDirectory, 'trace.zip')
  testInfo.annotations.push({ type: 'testrail_attachment', description: filePath })
}

export { test, expect }
