import readMapInfoFromDocument from './read-map-info'

async function setupStartingMap (document, renderer) {
  const mapInfo = readMapInfoFromDocument(document)
  console.log('[Map Viewer]', mapInfo)

  const { setMapByURL, zoomTo } = renderer
  const map = await setMapByURL(mapInfo.mapLink)
  zoomTo(
    mapInfo.startLevel,
    mapInfo.startZoom,
    mapInfo.startX / map.tileWidth,
    mapInfo.startY / map.tileHeight
  )
}

export default setupStartingMap
