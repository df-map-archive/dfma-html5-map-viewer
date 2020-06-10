const pako = require('pako')
const p5 = require('p5')
const parser = require('./fork/parser')
const renderer = require('./fork/renderer')

function setup() {} {
  if (typeof window !== undefined) {
    window.pako = pako
    window.p5 = p5
    Object.assign(window, parser)
    Object.assign(window, renderer)
  }
}

module.exports = setup
