import { expect } from 'chai'
import unitUnderTest from '../../src/components/renderer'

describe('Renderer Interface', () => {
  it('should expose the expected properties on the default interface', () => {
    const actual = Object.keys(unitUnderTest)
    expect(actual).to.deep.equal([
      'draw',
      'preload',
      'setMapByURL',
      'setup',
      'viewState',
      'zoom',
      'zoomTo'
    ])
  })

  it('should expose the viewState on the renderer that can be accessed by other components', () => {
    const actual = unitUnderTest.viewState
    expect(actual).to.deep.equal({
      clickX: 0,
      clickY: 0,
      dfMapData: false,
      dragged: false,
      idx: 0,
      imageX: 0,
      imageY: 0,
      imgHeight: 0,
      imgWidth: 0,
      originalImgHeight: 0,
      originalImgWidth: 0,
      scale: 0
    })
  })
})
