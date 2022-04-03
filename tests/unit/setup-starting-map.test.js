import { expect } from 'chai'
import { join, dirname } from 'path'
import jsdom from 'jsdom'
import unitUnderTest from '../../src/components/setup-starting-map.js'

import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const { JSDOM } = jsdom

const stubMap = { tileWidth: 16, tileHeight: 16 }

describe('Setup starting map', () => {
  let document, body
  before(async () => {
    const { window } = await JSDOM.fromFile(join(__dirname, 'stubs/mapInfo.html'))
    document = window.document
    body = document.querySelector('body')
  })

  it('should export a function to test', () => {
    expect(typeof unitUnderTest).to.equal('function')
  })

  it('should read values from the document, and call setMapByURL', async () => {
    function callback (mapLink) {
      expect(mapLink).to.equal('/dfma/maps/2020-03/mounf-Bellsshower-A_library-251-110.fdf-map')
      return stubMap
    }
    return unitUnderTest(body, { setMapByURL: callback, zoomTo: () => null })
  })

  it('should read values from the document, and call zoomTo', async () => {
    function callback (startLevel, startZoom, startX, startY) {
      expect({
        startLevel,
        startZoom,
        startX,
        startY
      }).to.deep.equal({
        startLevel: 68,
        startZoom: 1,
        startX: 1824 / stubMap.tileWidth,
        startY: 976 / stubMap.tileHeight
      })
    }
    return unitUnderTest(body, { setMapByURL: () => stubMap, zoomTo: callback })
  })
})
