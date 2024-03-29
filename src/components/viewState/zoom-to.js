/**
 * Configure methods by injecting in shared viewState dependency
 *
 * @param {object} viewState
 */
export default (viewState) => {
  /**
   * Zoom to a POI
   *
   * Side effects:
   * - read viewState.dfMapData for tileWidth, tileHeight, and mapData
   * - read viewState for idx, scale,
   *   imgWidth, originalImgWidth,
   *   imgHeight, originalImgHeight,
   *   canvasWidth, canvasHeight
   * - calls console.log
   * - assigns viewState.idx, viewState.scale, viewState.imgWidth, viewState.imgHeight
   *   viewState.imageX, viewState.imageY
   *
   * @param {integer} layer the layer to zoom to
   * @param {number} pscale the zoom scale (zoom amount)
   * @param {integer} xTile the xTile to zoom to
   * @param {integer} yTile the yTile to zoom to
   *
   * @return null manipulates viewState as a side effect
   */
  return (layer, pscale, xTile, yTile) => {
    // find the desired layer
    let found = false
    let curLayer

    const emptyMap = {}
    const dfMapData = viewState.dfMapData || emptyMap
    const { mapData } = dfMapData
    const { canvasWidth, canvasHeight } = viewState

    viewState.messages.push(`Canvas width: ${canvasWidth}, height: ${canvasHeight}`)

    if (!mapData) {
      viewState.messages.push(`Map data not available: ${JSON.stringify(dfMapData)}`)
      return
    }

    for (let i = 0; i < mapData.length; i++) {
      curLayer = mapData[i]
      if (curLayer.depth === layer) {
        found = true
        break
      }
    }

    if (!found) {
      viewState.messages.push(`Layer ${layer} not found in map layers: [${mapData.map(m => (m || {}).depth || -1)}]`)
      if (mapData.length > 0) {
        curLayer = mapData[0]
        viewState.messages.push(`Defaulting to first layer: ${curLayer.depth}`)
      }
    } else {
      viewState.messages.push(`Layer ${layer} found in map layers: [${mapData.map(m => (m || {}).depth || -1)}]`)
    }

    viewState.idx = curLayer.index
    viewState.scale = pscale

    viewState.imgWidth = viewState.originalImgWidth * viewState.scale
    viewState.imgHeight = viewState.originalImgHeight * viewState.scale

    console.log('[Zoom To]', { windowWidth: canvasWidth, tileWidth: dfMapData.tileWidth, scale: viewState.scale, xTile })
    viewState.imageX = canvasWidth / 2 - dfMapData.tileWidth * viewState.scale * xTile + dfMapData.tileWidth / 2 * viewState.scale
    viewState.imageY = canvasHeight / 2 - dfMapData.tileHeight * viewState.scale * yTile + dfMapData.tileHeight / 2 * viewState.scale
  }
}
