import { loadMapFromURL, MapData } from './parser'
import p5adapter from './p5adapter'

const pako = require('pako')

const browser = (typeof window !== 'undefined') ? window : {}
const p5 = p5adapter(browser)

let dfMapData
let idx = 0

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
    dfMapData = map
    return map
  })
}

/**
 * P5 setup
 *
 * Occurs once before main loop
 */
function setup () {
  const canvas = p5.createCanvas(800, 600)
  canvas.parent('canvas_container')
  canvas.dragOver(fileHoverCB)
  canvas.dragLeave(fileHoverLeaveCB)
  canvas.drop(fileDropCB)
  p5.background(0)
  p5.textFont('Helvetica', 15)
  p5.textAlign(window.CENTER, window.CENTER)
  p5.pixelDensity(1)
}

// GLOBALS
let dragged = false
let imageX = 0
let imageY = 0
let originalImgHeight = 0
let originalImgWidth = 0
let imgWidth = 0
let imgHeight = 0
let clickX = 0
let clickY = 0

let scale = 1.00
const jump = 1.05

/**
 * P5 Draw Function
 *
 * Occurs each frame
 */
function draw () {
  if (dfMapData.loaded) {
    if (window.keyIsPressed === true && (window.key === '=' || window.key === '+' || window.key === '-')) { zoom() }

    // setup zoom information
    if (originalImgWidth === 0) { // not loaded
      originalImgWidth = dfMapData.mapData[0].width * dfMapData.tileWidth
      originalImgHeight = dfMapData.mapData[0].height * dfMapData.tileHeight
      imgWidth = originalImgWidth * scale
      imgHeight = originalImgHeight * scale
      // return;
    }

    p5.background(0)// Make background black

    if (dfMapData.mapData[idx] !== undefined && dfMapData.mapData[idx].loaded === false && !dfMapData.mapData[idx].loading) {
      dfMapData.getLayer(idx)
      return
    }
    if (dfMapData.mapData[idx] === undefined || dfMapData.mapData[idx].img === undefined) { return }
    const img = dfMapData.getLayer(idx)
    p5.image(img, imageX, imageY, imgWidth, imgHeight)

    const selectorWidth = dfMapData.tileWidth * scale
    const selectorHeight = dfMapData.tileHeight * scale

    // draw selector
    const curCenterX = window.width / 2 - imageX
    const curCenterY = window.height / 2 - imageY
    const selectedX = p5.floor(curCenterX / (dfMapData.tileWidth * scale))
    const selectedY = p5.floor(curCenterY / (dfMapData.tileHeight * scale))

    p5.stroke(255, 0, 0)
    p5.strokeWeight(p5.max(scale, 2))
    p5.noFill()
    p5.rect(imageX + selectorWidth * selectedX, imageY + selectorHeight * selectedY, selectorWidth, selectorHeight)
    p5.stroke(255, 255, 0)
    const crosshairSize = 5
    p5.strokeWeight(2)
    p5.line(window.width / 2 - crosshairSize, window.height / 2, window.width / 2 + crosshairSize, window.height / 2)
    p5.line(window.width / 2, window.height / 2 - crosshairSize, window.width / 2, window.height / 2 + crosshairSize)

    // text
    const textLeftOffset = 15
    const textTopOffset = 20
    p5.stroke(255)
    p5.noFill()
    p5.strokeWeight(1)
    p5.textFont('Helvetica', 12)
    p5.textAlign(window.LEFT)
    p5.text('Layer: ' + dfMapData.mapData[idx].depth, textLeftOffset, textTopOffset)
    p5.text('Zoom: ' + scale.toFixed(2), textLeftOffset, textTopOffset + 20)
    p5.text(`X: ${selectedX}, Y: ${selectedY}`, textLeftOffset, textTopOffset + 40)

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

    if (dragged) {
      p5.fill(0, 0, 0, 200)
      p5.textFont('Helvetica', 30)
      p5.textAlign(window.CENTER, window.CENTER)
      p5.rect(0, 0, window.width, window.height)
      p5.fill(255)
      p5.text('DROP FDF-MAP FILE HERE', window.width / 2, window.height / 2)
    }
  } else {
    p5.background(0)
    p5.textFont('Helvetica', 20)
    p5.textAlign(window.CENTER, window.CENTER)
    p5.stroke(255)
    p5.fill(255)

    p5.text('Loading...', window.width / 2, window.height / 2)
  }
}

/**
 * Called whenever a 'zoom' key is pressed.
 */
function zoom () {
  let zoomed = false
  // ZOOM

  if (window.key === '=' || window.key === '+') {
    scale *= jump
    if (scale > 20) { scale = 20 }

    zoomed = true
  }

  if (window.key === '-') {
    scale /= jump
    if (scale < 0.01) { scale = 0.01 }

    zoomed = true
  }

  // center zoom
  if (zoomed) {
    const curCenterX = window.width / 2 - imageX
    const curCenterY = window.height / 2 - imageY

    const ratioX = curCenterX / imgWidth
    const ratioY = curCenterY / imgHeight

    imgWidth = originalImgWidth * scale
    imgHeight = originalImgHeight * scale

    imageX = window.width / 2 - imgWidth * ratioX
    imageY = window.height / 2 - imgHeight * ratioY
    originalImgWidth = 0
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
  for (let i = 0; i < dfMapData.mapData.length; i++) {
    curLayer = dfMapData.mapData[i]
    if (curLayer.depth === layer) {
      found = true
      break
    }
  }

  console.log('[Renderer] zoomTo', { layer, pscale, xTile, yTile, found, dfMapData })

  if (!found) { return }

  idx = curLayer.index
  scale = pscale

  imgWidth = originalImgWidth * scale
  imgHeight = originalImgHeight * scale

  imageX = window.width / 2 - dfMapData.tileWidth * scale * xTile + dfMapData.tileWidth / 2 * scale
  imageY = window.height / 2 - dfMapData.tileHeight * scale * yTile + dfMapData.tileHeight / 2 * scale
}

/**
 * P5 MousePressed
 *
 * Called whenever the mouse is pressed
 */
function mousePressed () {
  clickX = window.mouseX
  clickY = window.mouseY
}

/**
 * P5 MouseDragged
 *
 * Called whenever the mouse is dragged
 */
function mouseDragged () {
  const xDif = (window.mouseX - clickX)
  const yDif = (window.mouseY - clickY)
  clickX = window.mouseX
  clickY = window.mouseY
  imageX += xDif
  imageY += yDif
}
/**
 * P5 KeyPressed function
 *
 * called whenever a key is pressed
 */
function keyPressed () {
  if (window.key === ',' || window.key === '<') {
    idx++
    if (idx >= dfMapData.numLayers) { idx = dfMapData.numLayers - 1 }
  }
  if (window.key === '.' || window.key === '>') {
    idx--
    if (idx < 0) { idx = 0 }
  }

  let modifier = 1

  if (p5.keyIsDown(90)) { //  'z'
    modifier = 10
  }

  if (p5.keyIsDown(102)) { // number 6
    imageX -= dfMapData.tileWidth * scale * modifier
  }
  if (p5.keyIsDown(100)) { // number 4
    imageX += dfMapData.tileWidth * scale * modifier
  }
  if (p5.keyIsDown(98)) { // number 2
    imageY -= dfMapData.tileHeight * scale * modifier
  }
  if (p5.keyIsDown(104)) { // number 8
    imageY += dfMapData.tileHeight * scale * modifier
  }
}

/**
 * Callback for when a hover event occurs
 */
function fileHoverCB () {
  dragged = true
}

/**
 * Call back for when a hover event leaves canvas
 */
function fileHoverLeaveCB () {
  dragged = false
}

/**
 * Callback for when a file drop event occurs
 */
function fileDropCB (file) {
  if (!file.name.endsWith('fdf-map')) {
    window.alert("Invalid File Format! You must submit an 'fdf-map' file!")
  }

  originalImgWidth = 0
  originalImgHeight = 0

  const reader = new window.FileReader()
  reader.onload = function () {
    const arr = new Uint8Array(reader.result)
    // inflate data
    const data = pako.inflate(arr)
    const res = new DataView(data.buffer)
    // bytes = new DataView(data.buffer);
    dfMapData = new MapData()
    dfMapData.parse(res)
  }

  reader.readAsArrayBuffer(file.file)
  fileHoverLeaveCB()
  document.getElementById('fileName').innerText = file.name
}

export default {
  fileDropCB,
  fileHoverLeaveCB,
  keyPressed,
  mouseDragged,
  mousePressed,
  zoom,
  draw,
  setMapByURL,
  setup,
  preload,
  zoomTo
}
