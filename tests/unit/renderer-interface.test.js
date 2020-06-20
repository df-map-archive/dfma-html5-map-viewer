import { expect } from 'chai'
import unitUnderTest from '../../src/components/renderer'

describe('Renderer Interface', () => {
  const viewState = {
    external: 'data'
  }
  const browserWindow = {}

  it('should expose the expected properties on the default interface', () => {
    const actual = Object.keys(unitUnderTest(viewState, browserWindow))
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
    const actual = unitUnderTest(viewState, browserWindow).viewState
    expect(actual).to.equal(viewState)
  })
})
