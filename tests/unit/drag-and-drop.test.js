import { expect } from 'chai'
import { join, dirname } from 'path'
import jsdom from 'jsdom'
import unitUnderTest from '../../src/components/drag-and-drop.js'

import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const { JSDOM } = jsdom

describe('Drag and Drop', () => {
  let document, body
  before(async () => {
    const { window } = await JSDOM.fromFile(join(__dirname, 'stubs/dragAndDrop.html'))
    document = window.document
    body = document.querySelector('body')
    console.log('[Drag and Drop Test] Body ready for testing', body)
  })

  it('should export a function to test', () => {
    expect(typeof unitUnderTest).to.equal('function')
  })
})
