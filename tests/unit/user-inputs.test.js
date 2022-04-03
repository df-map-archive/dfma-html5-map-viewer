import { expect } from 'chai'
import { join, dirname } from 'path'
import jsdom from 'jsdom'
import unitUnderTest from '../../src/components/user-inputs.js'

import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const { JSDOM } = jsdom

describe('User Inputs', () => {
  let document, body
  before(async () => {
    const { window } = await JSDOM.fromFile(join(__dirname, 'stubs/userInputs.html'))
    document = window.document
    body = document.querySelector('body')
    console.log('[User Inputs Test] Body ready for testing', body)
  })

  it('should export a function to test', () => {
    expect(typeof unitUnderTest).to.equal('function')
  })
})
