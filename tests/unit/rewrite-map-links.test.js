import { expect } from 'chai'
import { join } from 'path'
import jsdom from 'jsdom'
import unitUnderTest from '../../src/components/rewrite-map-links'

const { JSDOM } = jsdom

describe('Rewrite map links', () => {
  let document
  before(async () => {
    const { window } = await JSDOM.fromFile(join(__dirname, 'stubs/mapLinks.html'), { pretendToBeVisual: true })
    document = window.document
  })

  it('should export a function to test', () => {
    expect(typeof unitUnderTest).to.equal('function')
  })

  it('should attach functions to the click event of map-links ', () => {
    const clicks = []
    function callback (href) {
      clicks.push(href)
    }
    unitUnderTest(document.querySelector('body'), callback)
    const mapLinks = Array.from(document.getElementsByTagName('map-link'))
    mapLinks.forEach(el => {
      el.click()
    })

    expect(clicks).to.deep.equal([
      '/dfma/maps/2008-02/alexencandar-Fortress of Rage-region1-1053-16119.fdf-map',
      '/dfma/maps/2010-03/memory-Gulfobeyed-region10-63-26010.fdf-map',
      '/dfma/maps/2014-06/ajr_-Mountain of Immortal-region1-222-7581.fdf-map'
    ])
  })
})
