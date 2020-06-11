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
    const mapInfo = readMapInfoFromDocument(document)
    console.log('[Map Viewer]', mapInfo)
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

function readMapInfoFromDocument(parent) {
  const defaultMap = Array.from(parent.getElementsByTagName('default-map'))[0]

  function readTag(tagName) {
    return defaultMap.getElementsByTagName(tagName)[0].innerText
  }

  const mapInfo = {
    mapLink: readTag('map-link'),
    mapDescription: readTag('map-description'),
    startLevel: readTag('start-level'),
    startX: readTag('start-x'),
    startY: readTag('start-y'),
    startZoom: readTag('start-zoom'),
    startOrientation: readTag('start-orientation'),
    poiTitle: readTag('poi-title'),
    poiDescription: readTag('poi-description'),
    poiAuthor: readTag('poi-author')
  }

  return mapInfo
}

setup()
