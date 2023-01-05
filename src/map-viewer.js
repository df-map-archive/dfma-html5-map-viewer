import parser from './components/parser'
import renderer from './components/renderer'
import viewState from './components/viewState/model'
import rewriteMapLinks from './components/rewrite-map-links'
import userInputs from './components/user-inputs'
import zoom from './components/viewState/zoom'
import zoomTo from './components/viewState/zoom-to'

import setupStartingMap from './components/setup-starting-map'
import dragAndDrop from './components/drag-and-drop'
import setMapByURL from './components/viewState/set-map-by-url'
import { loadMapFromURL, loadMapFromFileSystem } from './components/readers'

import p5 from 'p5'
import buildInfo from './buildInfo.json'

function setup () {
  let mapRenderer
  if (typeof window !== 'undefined') {
    const { zoomIn, zoomOut } = zoom(viewState)
    mapRenderer = renderer({ viewState, zoomIn, zoomOut }, window)

    window.p5 = p5
    window.buildInfo = buildInfo
    Object.assign(window, parser)
    Object.assign(window, mapRenderer)

    userInputs(window, { viewState })
  }

  if (typeof document !== 'undefined') {
    rewriteMapLinks(document, { setMapByURL: setMapByURL(viewState, loadMapFromURL) })
    setupStartingMap(document, { setMapByURL: setMapByURL(viewState, loadMapFromURL), zoomTo: zoomTo(viewState) })
    dragAndDrop(document, window, { viewState, loadMapFromFileSystem })
  }
}

try {
  setup()
} catch (ex) {
  console.log(`map-viewer.js Encounted error: ${ex.message}`, ex)
}
