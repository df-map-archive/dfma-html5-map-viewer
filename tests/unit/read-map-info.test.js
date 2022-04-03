import { expect } from 'chai'
import { join, dirname } from 'path'
import jsdom from 'jsdom'
import unitUnderTest from '../../src/components/read-map-info.js'

import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const { JSDOM } = jsdom

describe('Read map info', () => {
  let document, body
  before(async () => {
    const { window } = await JSDOM.fromFile(join(__dirname, 'stubs/mapInfo.html'))
    document = window.document
    body = document.querySelector('body')
  })

  it('should export a function to test', () => {
    expect(typeof unitUnderTest).to.equal('function')
  })

  it('should return an object with values parsed from the document', () => {
    const actual = unitUnderTest(body)
    expect(actual).to.deep.equal({
      mapDescription: 'A comunity/story fort aiming to build a library and fort across all 3 cavern levels. I\'ve not explored the library mechanics before.',
      mapLink: '/dfma/maps/2020-03/mounf-Bellsshower-A_library-251-110.fdf-map',
      startLevel: 68,
      startX: 1824,
      startY: 976,
      startZoom: 1.0,
      startOrientation: 'top',
      poiTitle: 'Temporary fort',
      poiDescription: 'The lower level of the dining hall - this is temporary whilst preparing to breach and secure the upper cavern.',
      poiAuthor: 'mounf'
    })
  })
})
