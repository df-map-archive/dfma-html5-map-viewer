import { expect } from 'chai'
import unitUnderTest from '../../src/components/renderer'

describe('Renderer Interface', () => {
  it('should expose the expected properties on the default interface', () => {
    const actual = Object.keys(unitUnderTest)
    expect(actual).to.deep.equal([
      'fileDropCB',
      'fileHoverLeaveCB',
      'keyPressed',
      'mouseDragged',
      'mousePressed',
      'zoom',
      'draw',
      'setMapByURL',
      'setup',
      'preload',
      'zoomTo'
    ])
  })
})
