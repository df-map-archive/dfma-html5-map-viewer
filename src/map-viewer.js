const pako = require('../external/DFMA-Viewer-HTML5/public/pako.js')
const p5 = require('../external/DFMA-Viewer-HTML5/public/p5.min.js')
const { parser, renderer } = require('../external/DFMA-Viewer-HTML5')

function setup() {} {
  if (typeof window !== undefined) {
    window.pako = pako
    window.p5 = p5
    Object.assign(window, parser)
    Object.assign(window, renderer)
  }
}

module.exports = setup
