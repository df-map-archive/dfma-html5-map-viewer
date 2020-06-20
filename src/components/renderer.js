import { loadMapFromURL } from './readers'
import p5adapter from '../adapters/p5adapter'

export default function (viewState, browserWindow) {
  const p5 = p5adapter(browserWindow)

  // RENDERER SHARED STATE

  // CONSTANTS

  const jump = 1.05
  const canvasWidth = 800
  const canvasHeight = 600

  /**
   * P5 Preload.
   *
   * Occurs once before setup.
   */
  function preload () {
    // setMapByURL('file.fdf-map')
  }

  /**
   * Set map to view by URL
   *
   * @param {string} mapUrl the URL of the fdf-map file to load and view
   */
  async function setMapByURL (mapUrl) {
    document.getElementById('fileName').innerText = mapUrl

    // fetch local file
    return loadMapFromURL(mapUrl).then(map => {
      viewState.dfMapData = map
      return map
    })
  }

  /**
   * P5 setup
   *
   * Occurs once before main loop
   */
  function setup () {
    const canvas = p5.createCanvas(canvasWidth, canvasHeight)
    canvas.parent('p5-dfma-html5-map-viewer')
    p5.background(0)
    p5.textFont('Helvetica', 15)
    p5.textAlign(browserWindow.CENTER, browserWindow.CENTER)
    p5.pixelDensity(1)
  }

  /**
   * P5 Draw Function
   *
   * Occurs each frame
   */
  function draw () {
    if (viewState.dfMapData && viewState.dfMapData.loaded) {
      if (browserWindow.keyIsPressed === true && (browserWindow.key === '=' || browserWindow.key === '+' || browserWindow.key === '-')) { zoom() }

      // setup zoom information
      if (viewState.originalImgWidth === 0) { // not loaded
        viewState.originalImgWidth = viewState.dfMapData.mapData[0].width * viewState.dfMapData.tileWidth
        viewState.originalImgHeight = viewState.dfMapData.mapData[0].height * viewState.dfMapData.tileHeight
        viewState.imgWidth = viewState.originalImgWidth * viewState.scale
        viewState.imgHeight = viewState.originalImgHeight * viewState.scale
        // return;
      }

      p5.background(0)// Make background black

      const mapData = viewState.dfMapData.mapData
      if (mapData[viewState.idx] !== undefined && mapData[viewState.idx].loaded === false && !mapData[viewState.idx].loading) {
        viewState.dfMapData.getLayer(viewState.idx)
        return
      }
      if (mapData[viewState.idx] === undefined || mapData[viewState.idx].img === undefined) {
        return
      }
      const img = viewState.dfMapData.getLayer(viewState.idx)
      p5.image(img, viewState.imageX, viewState.imageY, viewState.imgWidth, viewState.imgHeight)

      const selectorWidth = viewState.dfMapData.tileWidth * viewState.scale
      const selectorHeight = viewState.dfMapData.tileHeight * viewState.scale

      // draw selector
      const curCenterX = canvasWidth / 2 - viewState.imageX
      const curCenterY = canvasHeight / 2 - viewState.imageY
      const selectedX = p5.floor(curCenterX / (viewState.dfMapData.tileWidth * viewState.scale))
      const selectedY = p5.floor(curCenterY / (viewState.dfMapData.tileHeight * viewState.scale))

      p5.stroke(255, 0, 0)
      p5.strokeWeight(p5.max(viewState.scale, 2))
      p5.noFill()
      p5.rect(viewState.imageX + selectorWidth * selectedX, viewState.imageY + selectorHeight * selectedY, selectorWidth, selectorHeight)
      p5.stroke(255, 255, 0)
      const crosshairSize = 5
      p5.strokeWeight(2)
      p5.line(canvasWidth / 2 - crosshairSize, canvasHeight / 2, canvasWidth / 2 + crosshairSize, canvasHeight / 2)
      p5.line(canvasWidth / 2, canvasHeight / 2 - crosshairSize, canvasWidth / 2, canvasHeight / 2 + crosshairSize)

      // text
      const textLeftOffset = 15
      const textTopOffset = 20
      p5.stroke(255)
      p5.noFill()
      p5.strokeWeight(1)
      p5.textFont('Helvetica', 12)
      p5.textAlign(browserWindow.LEFT)
      p5.text('Layer: ' + viewState.dfMapData.mapData[viewState.idx].depth, textLeftOffset, textTopOffset)
      p5.text('Zoom: ' + viewState.scale.toFixed(2), textLeftOffset, textTopOffset + 20)
      p5.text(`X: ${selectedX} ${viewState.imageX}, Y: ${selectedY} ${viewState.imageY}`, textLeftOffset, textTopOffset + 40)

      if (viewState.showTiles) {
        showTiles()
      }

      if (viewState.dragged) {
        p5.fill(0, 0, 0, 200)
        p5.textFont('Helvetica', 30)
        p5.textAlign(browserWindow.CENTER, browserWindow.CENTER)
        p5.rect(0, 0, canvasWidth, canvasHeight)
        p5.fill(255)
        p5.text('DROP FDF-MAP FILE HERE', window.width / 2, window.height / 2)
      }
    } else {
      p5.background(0)
      p5.textFont('Helvetica', 20)
      p5.textAlign(browserWindow.CENTER, browserWindow.CENTER)
      p5.stroke(255)
      p5.fill(255)

      p5.text('Loading...', canvasWidth / 2, canvasHeight / 2)
    }
  }

  function showTiles () {
    p5.loadPixels()
    let xT = 0; let yT = 0
    const wPixels = viewState.dfMapData.tileWidth
    const hPixels = viewState.dfMapData.tileHeight
    for (let i = 0; i < viewState.dfMapData.numTiles; i++) {
      const cols = viewState.dfMapData.tiles[i]
      for (let y = 0; y < hPixels; y++) {
        for (let x = 0; x < wPixels; x++) {
          const idx = x * 4 + y * 4 * wPixels
          browserWindow.pixels[(xT * wPixels * 4) + x * 4 + (y + yT * hPixels) * browserWindow.width * 4] = cols[idx]
          browserWindow.pixels[(xT * wPixels * 4) + x * 4 + (y + yT * hPixels) * browserWindow.width * 4 + 1] = cols[idx + 1]
          browserWindow.pixels[(xT * wPixels * 4) + x * 4 + (y + yT * hPixels) * browserWindow.width * 4 + 2] = cols[idx + 2]
          browserWindow.pixels[(xT * wPixels * 4) + x * 4 + (y + yT * hPixels) * browserWindow.width * 4 + 3] = cols[idx + 3]
        }
      }
      xT++
      if (xT >= viewState.width / wPixels) {
        xT = 0
        yT++
        if (yT >= viewState.height / hPixels) {
          break
        }
      }
    }
    p5.updatePixels()
  }

  /**
   * Called whenever a 'zoom' key is pressed.
   */
  function zoom () {
    let zoomed = false
    // ZOOM

    if (browserWindow.key === '=' || browserWindow.key === '+') {
      viewState.scale *= jump
      if (viewState.scale > 20) {
        viewState.scale = 20
      }

      zoomed = true
    }

    if (browserWindow.key === '-') {
      viewState.scale /= jump
      if (viewState.scale < 0.01) {
        viewState.scale = 0.01
      }

      zoomed = true
    }

    // center zoom
    if (zoomed) {
      const curCenterX = canvasWidth / 2 - viewState.imageX
      const curCenterY = canvasHeight / 2 - viewState.imageY

      const ratioX = curCenterX / viewState.imgWidth
      const ratioY = curCenterY / viewState.imgHeight

      viewState.imgWidth = viewState.originalImgWidth * viewState.scale
      viewState.imgHeight = viewState.originalImgHeight * viewState.scale

      viewState.imageX = canvasWidth / 2 - viewState.imgWidth * ratioX
      viewState.imageY = canvasHeight / 2 - viewState.imgHeight * ratioY
      viewState.originalImgWidth = 0
    }
  }

  /**
   * Zoom to a POI
   * layer - layer to zoom to
   * scale - zoom scale (zoom amount)
   * xTile - xTile to zoom to
   * yTile - yTile to zoom to
   */
  function zoomTo (layer, pscale, xTile, yTile) {
    // find the desired layer
    let found = false
    let curLayer
    for (let i = 0; i < viewState.dfMapData.mapData.length; i++) {
      curLayer = viewState.dfMapData.mapData[i]
      if (curLayer.depth === layer) {
        found = true
        break
      }
    }

    if (!found) {
      return
    }

    viewState.idx = curLayer.index
    viewState.scale = pscale

    viewState.imgWidth = viewState.originalImgWidth * viewState.scale
    viewState.imgHeight = viewState.originalImgHeight * viewState.scale

    console.log('[Zoom To]', { windowWidth: canvasWidth, tileWidth: viewState.dfMapData.tileWidth, scale: viewState.scale, xTile })
    viewState.imageX = canvasWidth / 2 - viewState.dfMapData.tileWidth * viewState.scale * xTile + viewState.dfMapData.tileWidth / 2 * viewState.scale
    viewState.imageY = canvasHeight / 2 - viewState.dfMapData.tileHeight * viewState.scale * yTile + viewState.dfMapData.tileHeight / 2 * viewState.scale
  }

  return {
    draw,
    preload,
    setMapByURL,
    setup,
    viewState,
    zoom,
    zoomTo
  }
}
