import parser from './fork/parser'
import renderer from './fork/renderer'
import setupStartingMap from './util/setup-starting-map'
import rewriteMapLinks from './util/rewrite-map-links'

const p5 = require('p5')

function setup () {
  if (typeof window !== 'undefined') {
    window.p5 = p5
    Object.assign(window, parser)
    Object.assign(window, renderer)
  }

  if (typeof document !== 'undefined') {
    rewriteMapLinks(document, renderer.setMapByURL)
    setupStartingMap(document, renderer)
  }
}

setup()
