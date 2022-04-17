function readMapInfoFromDocument (parent) {
  const defaultMap = Array.from(parent.getElementsByTagName('default-map'))[0]

  function readTag (tagName) {
    return defaultMap.getElementsByTagName(tagName)[0].textContent
  }

  function readIntegerTag (tagName, defaultValue) {
    try {
      const tagValue = readTag(tagName) || defaultValue
      return Number.parseInt(tagValue)
    } catch (ex) {
      return defaultValue
    }
  }

  function readFloatTag (tagName, defaultValue) {
    try {
      const tagValue = readTag(tagName) || defaultValue
      return Number.parseFloat(tagValue)
    } catch (ex) {
      return defaultValue
    }
  }

  function readStringTag (tagName, defaultValue) {
    try {
      return readTag(tagName) || defaultValue
    } catch (ex) {
      return defaultValue
    }
  }

  const mapInfo = {
    mapLink: readStringTag('map-link'),
    mapDescription: readStringTag('map-description'),
    startLevel: readIntegerTag('start-level', 0),
    startX: readIntegerTag('start-x', 0),
    startY: readIntegerTag('start-y', 0),
    startZoom: readFloatTag('start-zoom', 1.0),
    startOrientation: readStringTag('start-orientation'),
    poiTitle: readStringTag('poi-title'),
    poiDescription: readStringTag('poi-description'),
    poiAuthor: readStringTag('poi-author')
  }

  mapInfo.startZoom = mapInfo.startZoom || 1.0

  console.log('Map info (read-map-info.js):', mapInfo)

  return mapInfo
}

export default readMapInfoFromDocument
