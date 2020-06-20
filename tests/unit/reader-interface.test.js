import { expect } from 'chai'
import unitUnderTest from '../../src/components/readers'

describe('Reader Interface', () => {
  it('should expose the expected properties on the default interface', () => {
    const actual = Object.keys(unitUnderTest)
    expect(actual).to.deep.equal([
      'loadMapFromURL',
      'loadMapFromFileSystem'
    ])
  })
})
