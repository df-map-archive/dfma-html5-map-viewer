import p5adapter from '../adapters/p5adapter.js'

/**
 * Based on "DFMapDecoder g1.as"
 * - https://github.com/df-map-archive/legacy-dfma-flash-map-viewer/blob/master/decoders/DFMapDecoder%20g1.as
 */
export class MapData {
  loaded = false

  negativeVersion // int
  numberOfTiles // uint
  tileWidth // uint
  tileHeight // uint
  mapWidthInTiles = 0 // uint
  mapHeightInTiles = 0 // uint
  numberOfMapLayers // uint

  tileIndex // Array
  mapLayers // Array

  getLayer (idx) {
    const layerData = this.mapData[idx]
    if (layerData.loaded) {
      return layerData.img
    } else {
      this.loadLayer(idx)
      return this.mapData[idx].img
    }
  }

  loadLayer (idx) {
    if (this.mapData[idx].loaded) {
      return
    }

    const browserWindow = (typeof window !== 'undefined') ? window : {}
    const p5 = p5adapter(browserWindow)

    this.mapData[idx].loading = true
    const currentLayer = this.mapData[idx]
    const tilesWide = currentLayer.widthInTiles
    const tilesHigh = currentLayer.heightInTiles

    const imgWidth = tilesWide * this.tileWidth
    const imgHeight = tilesHigh * this.tileHeight

    const layerImage = p5.createImage(imgWidth, imgHeight)
    layerImage.loadPixels()

    // blit whole pix
    for (let x = 0; x < tilesWide; x++) {
      for (let y = 0; y < tilesHigh; y++) {
        const yTileIndex = y * this.tileHeight
        const xTileIndex = x * this.tileWidth
        const currentIndex = y + x * tilesHigh

        const currentTile = currentLayer.tileData[currentIndex].tileBitmap.pixels

        for (let ty = 0; ty < this.tileHeight; ty++) {
          for (let tx = 0; tx < this.tileWidth; tx++) {
            const srcIdx = tx * 4 + ty * 4 * this.tileWidth
            const destIdx = ((xTileIndex + tx) * 4) + ((yTileIndex + ty) * 4 * imgWidth)
            layerImage.pixels[destIdx] = currentTile[srcIdx]
            layerImage.pixels[destIdx + 1] = currentTile[srcIdx + 1]
            layerImage.pixels[destIdx + 2] = currentTile[srcIdx + 2]
            layerImage.pixels[destIdx + 3] = currentTile[srcIdx + 3]
          }
        }
      }
    }

    layerImage.updatePixels()

    this.mapData[idx].loaded = true
    this.mapData[idx].img = layerImage
    this.mapData[idx].loading = false
  }

  /**
   * A DataView object of the decompressed map data
   * @param {DataView} data
   */
  parse (data) {
    let k, t, i, j // uint
    let mapLayer = {}

    let dataPointer = 0
    function readInt () {
      const res = data.getInt32(dataPointer, true)
      dataPointer += 4
      return res
    }

    function readUnsignedInt () {
      const res = data.getUint32(dataPointer, true)
      dataPointer += 4
      return res
    }

    function readUnsignedShort () {
      const res = data.getUint16(dataPointer, true)
      dataPointer += 2
      return res
    }

    function readUnsignedByte () {
      const res = data.getUint8(dataPointer)
      dataPointer += 1
      return res
    }

    if (data === null) {
      console.error('No binary DataView containing map data provided', { data })
      throw new Error('No binary DataView containing map data provided')
    }

    console.log('Decode Map Start')

    this.negativeVersion = readInt()

    if (this.negativeVersion >= 0) {
      this.numberOfTiles = this.negativeVersion
      this.negativeVersion = 0
      console.log('  Number of Tiles:', this.numberOfTiles)
    } else {
      console.log('  Negative Version:', this.negativeVersion)
      this.numberOfTiles = readUnsignedInt()
    }

    if (!(this.negativeVersion === -1 || this.negativeVersion === -2)) {
      console.error('File not recognised. NegativeVersion (' + this.negativeVersion + ') not recognised, expected -1 or -2 as first byte.')
      throw new Error('File not recognised. NegativeVersion (' + this.negativeVersion + ') not recognised, expected -1 or -2 as first byte.')
    }

    this.tileWidth = readUnsignedInt()
    this.tileHeight = readUnsignedInt()

    console.log('  Tile Width:', { tileWidth: this.tileWidth })
    console.log('  Tile Height:', { tileHeight: this.tileHeight })

    this.mapLayers = []
    if (this.negativeVersion < 0) {
      this.numberOfMapLayers = readUnsignedInt()
      console.log('  Found', { numberOfMapLayers: this.numberOfMapLayers })

      for (k = 0; k < this.numberOfMapLayers; k++) {
        mapLayer = {}
        mapLayer.depth = readUnsignedInt()
        mapLayer.widthInTiles = readUnsignedInt()
        mapLayer.heightInTiles = readUnsignedInt()

        // Track largest values
        if (mapLayer.widthInTiles > this.mapWidthInTiles) {
          this.mapWidthInTiles = mapLayer.widthInTiles
        }
        if (mapLayer.heightInTiles > this.mapHeightInTiles) {
          this.mapHeightInTiles = mapLayer.heightInTiles
        }

        this.mapLayers.push(mapLayer)

        console.log('  Decoded mapLayer, depth:', { depth: mapLayer })
      }
    } else {
      this.numberOfMapLayers = 1
      console.log('  Defaulted to single (1) numberOfMapLayers')
      mapLayer = {
        depth: 0,
        widthInTiles: readUnsignedInt(),
        heightInTiles: readUnsignedInt()
      }

      this.mapWidthInTiles = mapLayer.widthInTiles
      this.mapHeightInTiles = mapLayer.heightInTiles

      this.mapLayers.push(mapLayer)
    }

    console.log('Decode Map : Phase 1 Complete')

    let tile, tileBitmap

    this.tileIndex = []

    const tileByteLength = this.tileWidth * this.tileHeight * 4

    console.log('Decode Map : Phase 2A Complete')

    for (t = 0; t < this.numberOfTiles; t++) {
      let characterCode, backgroundColor, foregroundColor
      try {
        if (this.negativeVersion === -2) {
          characterCode = readUnsignedByte()
          backgroundColor = readUnsignedByte()
          foregroundColor = readUnsignedByte()
        } else {
          characterCode = 0
          backgroundColor = 0
          foregroundColor = 0
        }
      } catch (ex) {
        console.error('Unable to decode tile index:', ex.message)
      }

      tile = {
        characterCode,
        backgroundColor,
        foregroundColor,
        tileBitmap: {
          width: this.tileWidth,
          height: this.tileHeight,
          color: { r: 0, g: 0, b: 0 },
          pixels: []
        }
      }

      let tileBytesLoaded = 0
      const tilePixels = tile.tileBitmap.pixels
      try {
        const a = 255
        while (tileBytesLoaded < tileByteLength) {
          for (let numPixels = readUnsignedByte(); numPixels > 0; numPixels--) {
            const b = readUnsignedByte()
            const g = readUnsignedByte()
            const r = readUnsignedByte()
            tilePixels.push(r, g, b, a)
            tileBytesLoaded += 4
          }
        }
      } catch (ex) {
        console.error('Unable to read tile bytes:', ex.message)
        throw new Error('Unable to read tile bytes: ' + ex.message)
        return
      }

      this.tileIndex.push(tile)
    }

    console.log('Decode Map : Phase 2B Complete')

    let varSize

    if (this.numberOfTiles <= 255) {
      varSize = 1 // use uint8
    } else if (this.numberOfTiles <= 65536) {
      varSize = 2 // use uint16
    } else {
      varSize = 3 // use uint32
    }

    let index
    try {
      for (k = 0; k < this.numberOfMapLayers; k++) {
        mapLayer = this.mapLayers[k]
        mapLayer.tileData = new Array(mapLayer.widthInTiles)

        for (i = 0; i < mapLayer.widthInTiles; i++) {
          mapLayer.tileData[i] = new Array(mapLayer.heightInTiles)

          for (j = 0; j < mapLayer.heightInTiles; j++) {
            switch (varSize) {
              case 1:
                index = readUnsignedByte()
                break
              case 2:
                index = readUnsignedShort()
                break
              case 3:
              default:
                index = readUnsignedInt()
                break
            }
            mapLayer.tileData[i][j] = index
          }
        }
      }
    } catch (ex) {
      let varType

      switch (varSize) {
        case 1:
          varType = 'unsigned byte'
          break
        case 2:
          varType = 'unsigned short'
          break
        case 3:
        default:
          varType = 'unsigned int'
          break
      }
      throw new Error(ex.message + ' Happened while reading ' + varType + ' map indexes')
    }

    console.log('Decode Map : Phase 3 Complete')

    this.mapLayers.sort((a, b) => {
      const da = a.depth
      const db = b.depth
      return da > db ? -1 : 1
    })

    for (const ml in this.mapLayers) {
      console.log('  Sorted map layer:', ml.depth)
    }

    console.log('Decode Map : Phase 4 Complete')

    console.log('[Parser] Parsed', this.mapLayers.length, 'layers')
    this.mapData = this.mapLayers
    this.loaded = true
  }
}

export default {
  MapData
}
