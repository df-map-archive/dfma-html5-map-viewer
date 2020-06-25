import p5adapter from '../adapters/p5adapter'

const browserWindow = (typeof window !== 'undefined') ? window : {}
const p5 = p5adapter(browserWindow)

/**
 * Object which stores all data for a specific map
 */
export function MapData () {
  this.loaded = false
  this.version = 0
  this.numTiles = 0
  this.tileWidth = 0
  this.tileHeight = 0
  this.numTilesX = 0
  this.numTilesY = 0
  this.numLayers = 0
  this.tiles = []
  this.mapData = []
  this.horizontals = []
  this.verticals = []
  this.ptr = 0
  this.data = undefined

  /**
     * Get a specific layer's image (P5.image)
     */
  this.getLayer = function (idx) {
    const mData = this.mapData[idx]
    if (mData.loaded) {
      return mData.img
    } else {
      this.loadLayer(idx)
      return this.mapData[idx].img
    }
  }

  //TODO add getter for side / front views

  /**
     * **Internal Function***
     * Loads a layer if it is not already cached
     *
     * <rant> Why does javascript not have namespaces / private scope?
     * I know closures exist but they're like building a rocket to launch a
     * paper airplane. </rant>
     *
     * idx - Index of layer to load (not layer number)
     */
  this.loadLayer = function (idx) {
    if (this.mapData[idx].loaded) { return }

    this.mapData[idx].loading = true
    const curMapData = this.mapData[idx]
    const imgTWidth = curMapData.width
    const imgTHeight = curMapData.height
    this.numTilesX = imgTWidth
    this.numTilesY = imgTHeight

    const imgWidth = imgTWidth * this.tileWidth
    const imgHeight = imgTHeight * this.tileHeight

    const curLayer = p5.createImage(imgWidth, imgHeight)
    curLayer.loadPixels()

    // blit whole pix
    for (let x = 0; x < imgTWidth; x++) {
      for (let y = 0; y < imgTHeight; y++) {
        const yTileIndex = y * this.tileHeight
        const xTileIndex = x * this.tileWidth
        const curIndex = y + x * imgTHeight

        const curTile = curMapData.blocks[curIndex]

        for (let ty = 0; ty < this.tileHeight; ty++) {
          for (let tx = 0; tx < this.tileWidth; tx++) {
            const srcIdx = tx * 4 + ty * 4 * this.tileWidth
            const destIdx = ((xTileIndex + tx) * 4) + ((yTileIndex + ty) * 4 * imgWidth)
            curLayer.pixels[destIdx] = curTile[srcIdx]
            curLayer.pixels[destIdx + 1] = curTile[srcIdx + 1]
            curLayer.pixels[destIdx + 2] = curTile[srcIdx + 2]
            curLayer.pixels[destIdx + 3] = curTile[srcIdx + 3]

            // curLayer.set(xTileIndex + tx, yTileIndex + ty, color(curTile[srcIdx], curTile[srcIdx + 1], curTile[srcIdx + 2]))
          }
        }
      }
    }

    curLayer.updatePixels()

    this.mapData[idx].loaded = true
    this.mapData[idx].img = curLayer
    this.mapData[idx].loading = false
  }

  /**
     * Parse a dataview object built on a UInt8Array.
     *
     * Populates this object
     * data - Dataview object
     */
  this.parse = function (data) {
    if (this.loaded) {
      return
    }
    this.data = data

    this.version = data.getInt32(this.ptr, true)
    this.ptr += 4
    this.numTiles = data.getInt32(this.ptr, true)
    this.ptr += 4
    this.tileWidth = data.getInt32(this.ptr, true)
    this.ptr += 4
    this.tileHeight = data.getInt32(this.ptr, true)
    this.ptr += 4
    this.numLayers = data.getInt32(this.ptr, true)
    this.ptr += 4

    if (this.version < -3) {
      console.log('UNSUPPORTED FDF-MAP FILE FORMAT - Version: ' + this.version + ' IS INVALID OR NOT IMPLEMENTED YET')
      return
    }

    const flags = -1 - this.version
    // let RLE = false    // Not using RLE
    let TID = false

    if (flags & 1) { TID = true }
    // if (flags & 2) { RLE = true }

    // get layer metadata
    for (let i = 0; i < this.numLayers; i++) {
      const curDepth = data.getInt32(this.ptr, true)
      this.ptr += 4
      const curWidth = data.getInt32(this.ptr, true)
      this.ptr += 4
      const curHeight = data.getInt32(this.ptr, true)
      this.ptr += 4
      this.mapData.push({ depth: curDepth, width: curWidth, height: curHeight, index: i, loaded: false, blocks: [] })
    }

    for (let curTileIdx = 0; curTileIdx < this.numTiles; curTileIdx++) {
      const numPixels = this.tileWidth * this.tileHeight
      let processed = 0
      const pixelData = []

      // throw away tile information for now
      if (TID) { this.ptr += 3 }

      while (processed < numPixels) { // P5 needs RGBA
        const num = data.getUint8(this.ptr++, true)
        const b = data.getUint8(this.ptr++, true)
        const g = data.getUint8(this.ptr++, true)
        const r = data.getUint8(this.ptr++, true)
        for (let i = num; i > 0; i--) {
          pixelData.push(r)// RED
          pixelData.push(g)// GREEN
          pixelData.push(b)// BLUE
          pixelData.push(255)// ALPHA
          processed++
        }
      }
      this.tiles.push(pixelData)
    }

    for (let i = 0; i < this.numLayers; i++) {
      const curMapData = this.mapData[i]
      const imgTWidth = curMapData.width
      const imgTHeight = curMapData.height

      for (let j = 0; j < imgTWidth * imgTHeight; j++) {
        let curIndex
        if (this.numTiles <= 127) {
          curIndex = this.data.getUint8(this.ptr++, true)
        } else if (this.numTiles <= 32767) {
          curIndex = this.data.getUint16(this.ptr, true)
          this.ptr += 2
        } else {
          curIndex = this.data.getUint32(this.ptr, true)
          this.ptr += 4
        }
        curMapData.blocks.push(this.tiles[curIndex])
      }
    }

    this.mapData.sort((a, b) => { // sort by layer
      return a.depth - b.depth
    })

    console.log('[Parser] Parsed', this.mapData.length, 'layers')
    this.loaded = true
  }
}

export default {
  MapData
}
