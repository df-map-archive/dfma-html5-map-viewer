const p5 = require('p5')
const parser = require('./fork/parser')
const renderer = require('./fork/renderer')

function setup () {
  if (typeof window !== 'undefined') {
    window.p5 = p5
    Object.assign(window, parser)
    Object.assign(window, renderer)
  }

  if (typeof document !== 'undefined') {

    rewriteMapLinks(document, renderer)
    setupStartingMap(document, renderer)
  }
}

function rewriteMapLinks(document, renderer) {
  const { setMapByURL } = renderer
  const mapLinks = Array.from(document.getElementsByTagName('map-link'))
  mapLinks.forEach(mapLink => {
    const href = mapLink.innerText
    mapLink.onclick = () => {
      console.log('[map-viewer] Map link clicked:', href)
      setMapByURL(href)
    }
  })
}

async function setupStartingMap(document, renderer) {
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

function readMapInfoFromDocument(parent) {
  const defaultMap = Array.from(parent.getElementsByTagName('default-map'))[0]

  function readTag(tagName) {
    return defaultMap.getElementsByTagName(tagName)[0].innerText
  }

  const mapInfo = {
    mapLink: readTag('map-link'),
    mapDescription: readTag('map-description'),
    startLevel: Number.parseInt(readTag('start-level')),
    startX: Number.parseInt(readTag('start-x')),
    startY: Number.parseInt(readTag('start-y')),
    startZoom: Number.parseFloat(readTag('start-zoom')),
    startOrientation: readTag('start-orientation'),
    poiTitle: readTag('poi-title'),
    poiDescription: readTag('poi-description'),
    poiAuthor: readTag('poi-author')
  }

  return mapInfo
}

setup()
