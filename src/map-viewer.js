import parser from './components/parser'
import renderer from './components/renderer'
import setupStartingMap from './components/setup-starting-map'
import rewriteMapLinks from './components/rewrite-map-links'
import dragAndDrop from './components/drag-and-drop'
import userInputs from './components/user-inputs'

const p5 = require('p5')

const viewState = {
  dfMapData: false,
  dragged: false,
  imageX: 0,
  imageY: 0,
  originalImgHeight: 0,
  originalImgWidth: 0,
  imgWidth: 0,
  imgHeight: 0,
  clickX: 0,
  clickY: 0,
  idx: 0,
  scale: 0
}

function setup () {
  let mapRenderer
  if (typeof window !== 'undefined') {
    mapRenderer = renderer(viewState, window)

    window.p5 = p5
    Object.assign(window, parser)
    Object.assign(window, mapRenderer)
    userInputs(window, mapRenderer)
  }

  if (typeof document !== 'undefined') {
    rewriteMapLinks(document, mapRenderer)
    setupStartingMap(document, mapRenderer)
    dragAndDrop(document, window, mapRenderer)
  }
}

setup()
