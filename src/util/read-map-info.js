function readMapInfoFromDocument (parent) {
  const defaultMap = Array.from(parent.getElementsByTagName('default-map'))[0]

  function readTag (tagName) {
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

export default readMapInfoFromDocument
