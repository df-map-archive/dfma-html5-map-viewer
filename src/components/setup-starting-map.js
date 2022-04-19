import readMapInfoFromDocument from './read-map-info.js'
import viewState from './viewState/model.js'

async function setupStartingMap (document, { setMapByURL, zoomTo }) {
  const mapInfo = readMapInfoFromDocument(document)
  const map = await setMapByURL(mapInfo.mapLink)
  console.log('Starting map:', map, mapInfo)
  viewState.messages.push(`Starting map: start level: ${mapInfo.startLevel}, start zoom: ${mapInfo.startZoom}`)
  zoomTo(
    mapInfo.startLevel,
    mapInfo.startZoom,
    mapInfo.startX / map.tileWidth,
    mapInfo.startY / map.tileHeight
  )
}

export default setupStartingMap
