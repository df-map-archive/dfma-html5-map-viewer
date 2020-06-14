import parser from './components/parser'
import renderer from './components/renderer'
import setupStartingMap from './components/setup-starting-map'
import rewriteMapLinks from './components/rewrite-map-links'
import dragAndDrop from './components/drag-and-drop'
import userInputs from './components/user-inputs'

const p5 = require('p5')

function setup () {
  if (typeof window !== 'undefined') {
    window.p5 = p5
    Object.assign(window, parser)
    Object.assign(window, renderer)
    userInputs(window, renderer)
  }

  if (typeof document !== 'undefined') {
    rewriteMapLinks(document, renderer)
    setupStartingMap(document, renderer)
    dragAndDrop(document, window, renderer)
  }
}

setup()
