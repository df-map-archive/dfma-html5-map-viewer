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
      'setup',
      'zoom'
    ])
  })
})
