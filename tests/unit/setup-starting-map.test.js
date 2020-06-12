import { expect } from 'chai'
import unitUnderTest from '../../src/util/setup-starting-map'

describe('Setup Starting Map', () => {
  it('should export a function to test', () => {
    expect(typeof unitUnderTest).to.equal('function')
  })
})
