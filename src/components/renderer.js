import { loadMapFromURL } from './parser'
import p5adapter from '../adapters/p5adapter'

const browserWindow = (typeof window !== 'undefined') ? window : {}
const p5 = p5adapter(browserWindow)

// RENDERER SHARED STATE

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

    // debug code for seeing all tiles
    //       loadPixels();
    //    let xT = 0, yT = 0;
    //      let wPixels = dfMapData.tileWidth;
    //      let hPixels = dfMapData.tileHeight;
    //      for (let i = 0; i < dfMapData.numTiles; i++) {

    //          let cols = dfMapData.tiles[i];
    //          for (let y = 0; y < hPixels; y++) {
    //              for (let x = 0; x < wPixels; x++) {
    //                  let idx = x * 4 + y * 4 * wPixels;
    //                  pixels[(xT * wPixels * 4) + x * 4 + (y + yT * hPixels) * width * 4] = cols[idx];
    //                  pixels[(xT * wPixels * 4) + x * 4 + (y + yT * hPixels) * width * 4 + 1] = cols[idx + 1];
    //                  pixels[(xT * wPixels * 4) + x * 4 + (y + yT * hPixels) * width * 4 + 2] = cols[idx + 2];
    //                  pixels[(xT * wPixels * 4) + x * 4 + (y + yT * hPixels) * width * 4 + 3] = cols[idx + 3];
    //              }
    //          }
    //          xT++;
    //          if (xT >= width / wPixels) {
    //              xT = 0;
    //              yT++;
    //              if (yT >= height / hPixels)
    //                  break;
    //          }
    //      }
    //      updatePixels();

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

/**
 * P5 MousePressed
 *
 * Called whenever the mouse is pressed
 */
function mousePressed () {
  viewState.clickX = browserWindow.mouseX
  viewState.clickY = browserWindow.mouseY
}

/**
 * P5 MouseDragged
 *
 * Called whenever the mouse is dragged
 */
function mouseDragged () {
  const xDif = (browserWindow.mouseX - viewState.clickX)
  const yDif = (browserWindow.mouseY - viewState.clickY)
  viewState.clickX = browserWindow.mouseX
  viewState.clickY = browserWindow.mouseY
  viewState.imageX += xDif
  viewState.imageY += yDif
}
/**
 * P5 KeyPressed function
 *
 * called whenever a key is pressed
 */
function keyPressed () {
  if (browserWindow.key === ',' || browserWindow.key === '<') {
    viewState.idx++
    if (viewState.idx >= viewState.dfMapData.numLayers) {
      viewState.idx = viewState.dfMapData.numLayers - 1
    }
  }
  if (browserWindow.key === '.' || browserWindow.key === '>') {
    viewState.idx = Math.min(0, viewState.idx - 1)
  }

  let modifier = 1

  if (p5.keyIsDown(90)) { //  'z'
    modifier = 10
  }

  if (p5.keyIsDown(102)) { // number 6
    viewState.imageX -= viewState.dfMapData.tileWidth * viewState.scale * modifier
  }
  if (p5.keyIsDown(100)) { // number 4
    viewState.imageX += viewState.dfMapData.tileWidth * viewState.scale * modifier
  }
  if (p5.keyIsDown(98)) { // number 2
    viewState.imageY -= viewState.dfMapData.tileHeight * viewState.scale * modifier
  }
  if (p5.keyIsDown(104)) { // number 8
    viewState.imageY += viewState.dfMapData.tileHeight * viewState.scale * modifier
  }
}

export default {
  draw,
  keyPressed,
  mouseDragged,
  mousePressed,
  preload,
  setMapByURL,
  setup,
  viewState,
  zoom,
  zoomTo
}
