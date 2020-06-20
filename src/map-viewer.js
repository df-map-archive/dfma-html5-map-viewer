import parser from './components/parser'
import renderer from './components/renderer'
import setupStartingMap from './components/setup-starting-map'
import rewriteMapLinks from './components/rewrite-map-links'
import dragAndDrop from './components/drag-and-drop'
import userInputs from './components/user-inputs'
import setMapByURL from './components/viewState/set-map-by-url'
import zoom from './components/viewState/zoom'
import zoomTo from './components/viewState/zoom-to'
import viewState from './components/viewState/model'
import { loadMapFromURL, loadMapFromFileSystem } from './components/readers'

const p5 = require('p5')

function setup () {
  let mapRenderer
  if (typeof window !== 'undefined') {
    const { zoomIn, zoomOut } = zoom(viewState)
    mapRenderer = renderer({ viewState, zoomIn, zoomOut }, window)

    window.p5 = p5
    Object.assign(window, parser)
    Object.assign(window, mapRenderer)

    userInputs(window, { viewState })
  }

  if (typeof document !== 'undefined') {
    rewriteMapLinks(document, { setMapByURL: mapRenderer.setMapByURL })
    setupStartingMap(document, { setMapByURL: setMapByURL(viewState, loadMapFromURL), zoomTo: zoomTo(viewState) })
    dragAndDrop(document, window, { viewState, loadMapFromFileSystem })
  }
}

setup()
