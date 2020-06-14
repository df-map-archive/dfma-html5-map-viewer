import { loadMapFromURL } from './parser'
import p5adapter from '../adapters/p5adapter'

const browserWindow = (typeof window !== 'undefined') ? window : {}
const p5 = p5adapter(browserWindow)

// RENDERER SHARED STATE

const renderer = {
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
    renderer.dfMapData = map
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
  if (renderer.dfMapData && renderer.dfMapData.loaded) {
    if (browserWindow.keyIsPressed === true && (browserWindow.key === '=' || browserWindow.key === '+' || browserWindow.key === '-')) { zoom() }

    // setup zoom information
    if (renderer.originalImgWidth === 0) { // not loaded
      renderer.originalImgWidth = renderer.dfMapData.mapData[0].width * renderer.dfMapData.tileWidth
      renderer.originalImgHeight = renderer.dfMapData.mapData[0].height * renderer.dfMapData.tileHeight
      renderer.imgWidth = renderer.originalImgWidth * renderer.scale
      renderer.imgHeight = renderer.originalImgHeight * renderer.scale
      // return;
    }

    p5.background(0)// Make background black

    const mapData = renderer.dfMapData.mapData
    if (mapData[renderer.idx] !== undefined && mapData[renderer.idx].loaded === false && !mapData[renderer.idx].loading) {
      renderer.dfMapData.getLayer(renderer.idx)
      return
    }
    if (mapData[renderer.idx] === undefined || mapData[renderer.idx].img === undefined) {
      return
    }
    const img = renderer.dfMapData.getLayer(renderer.idx)
    p5.image(img, renderer.imageX, renderer.imageY, renderer.imgWidth, renderer.imgHeight)

    const selectorWidth = renderer.dfMapData.tileWidth * renderer.scale
    const selectorHeight = renderer.dfMapData.tileHeight * renderer.scale

    // draw selector
    const curCenterX = canvasWidth / 2 - renderer.imageX
    const curCenterY = canvasHeight / 2 - renderer.imageY
    const selectedX = p5.floor(curCenterX / (renderer.dfMapData.tileWidth * renderer.scale))
    const selectedY = p5.floor(curCenterY / (renderer.dfMapData.tileHeight * renderer.scale))

    p5.stroke(255, 0, 0)
    p5.strokeWeight(p5.max(renderer.scale, 2))
    p5.noFill()
    p5.rect(renderer.imageX + selectorWidth * selectedX, renderer.imageY + selectorHeight * selectedY, selectorWidth, selectorHeight)
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
    p5.text('Layer: ' + renderer.dfMapData.mapData[renderer.idx].depth, textLeftOffset, textTopOffset)
    p5.text('Zoom: ' + renderer.scale.toFixed(2), textLeftOffset, textTopOffset + 20)
    p5.text(`X: ${selectedX} ${renderer.imageX}, Y: ${selectedY} ${renderer.imageY}`, textLeftOffset, textTopOffset + 40)

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

    if (renderer.dragged) {
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
    renderer.scale *= jump
    if (renderer.scale > 20) {
      renderer.scale = 20
    }

    zoomed = true
  }

  if (browserWindow.key === '-') {
    renderer.scale /= jump
    if (renderer.scale < 0.01) {
      renderer.scale = 0.01
    }

    zoomed = true
  }

  // center zoom
  if (zoomed) {
    const curCenterX = canvasWidth / 2 - renderer.imageX
    const curCenterY = canvasHeight / 2 - renderer.imageY

    const ratioX = curCenterX / renderer.imgWidth
    const ratioY = curCenterY / renderer.imgHeight

    renderer.imgWidth = renderer.originalImgWidth * renderer.scale
    renderer.imgHeight = renderer.originalImgHeight * renderer.scale

    renderer.imageX = canvasWidth / 2 - renderer.imgWidth * ratioX
    renderer.imageY = canvasHeight / 2 - renderer.imgHeight * ratioY
    renderer.originalImgWidth = 0
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
  for (let i = 0; i < renderer.dfMapData.mapData.length; i++) {
    curLayer = renderer.dfMapData.mapData[i]
    if (curLayer.depth === layer) {
      found = true
      break
    }
  }

  if (!found) {
    return
  }

  renderer.idx = curLayer.index
  renderer.scale = pscale

  renderer.imgWidth = renderer.originalImgWidth * renderer.scale
  renderer.imgHeight = renderer.originalImgHeight * renderer.scale

  console.log('[Zoom To]', { windowWidth: canvasWidth, tileWidth: renderer.dfMapData.tileWidth, scale: renderer.scale, xTile })
  renderer.imageX = canvasWidth / 2 - renderer.dfMapData.tileWidth * renderer.scale * xTile + renderer.dfMapData.tileWidth / 2 * renderer.scale
  renderer.imageY = canvasHeight / 2 - renderer.dfMapData.tileHeight * renderer.scale * yTile + renderer.dfMapData.tileHeight / 2 * renderer.scale
}

/**
 * P5 MousePressed
 *
 * Called whenever the mouse is pressed
 */
function mousePressed () {
  renderer.clickX = browserWindow.mouseX
  renderer.clickY = browserWindow.mouseY
}

/**
 * P5 MouseDragged
 *
 * Called whenever the mouse is dragged
 */
function mouseDragged () {
  const xDif = (browserWindow.mouseX - renderer.clickX)
  const yDif = (browserWindow.mouseY - renderer.clickY)
  renderer.clickX = browserWindow.mouseX
  renderer.clickY = browserWindow.mouseY
  renderer.imageX += xDif
  renderer.imageY += yDif
}
/**
 * P5 KeyPressed function
 *
 * called whenever a key is pressed
 */
function keyPressed () {
  if (browserWindow.key === ',' || browserWindow.key === '<') {
    renderer.idx++
    if (renderer.idx >= renderer.dfMapData.numLayers) {
      renderer.idx = renderer.dfMapData.numLayers - 1
    }
  }
  if (browserWindow.key === '.' || browserWindow.key === '>') {
    renderer.idx = Math.min(0, renderer.idx - 1)
  }

  let modifier = 1

  if (p5.keyIsDown(90)) { //  'z'
    modifier = 10
  }

  if (p5.keyIsDown(102)) { // number 6
    renderer.imageX -= renderer.dfMapData.tileWidth * renderer.scale * modifier
  }
  if (p5.keyIsDown(100)) { // number 4
    renderer.imageX += renderer.dfMapData.tileWidth * renderer.scale * modifier
  }
  if (p5.keyIsDown(98)) { // number 2
    renderer.imageY -= renderer.dfMapData.tileHeight * renderer.scale * modifier
  }
  if (p5.keyIsDown(104)) { // number 8
    renderer.imageY += renderer.dfMapData.tileHeight * renderer.scale * modifier
  }
}

export default {
  draw,
  keyPressed,
  mouseDragged,
  mousePressed,
  preload,
  renderer,
  setMapByURL,
  setup,
  zoom,
  zoomTo
}
