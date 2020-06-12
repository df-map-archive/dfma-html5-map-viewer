function rewriteMapLinks (document, callback) {
  const mapLinks = Array.from(document.getElementsByTagName('map-link'))
  mapLinks.forEach(mapLink => {
    const href = mapLink.textContent
    mapLink.onclick = () => {
      callback(href)
    }
  })
}

export default rewriteMapLinks
