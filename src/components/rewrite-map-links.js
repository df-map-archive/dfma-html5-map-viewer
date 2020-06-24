function rewriteMapLinks (document, { setMapByURL }) {
  const mapLinks = Array.from(document.getElementsByTagName('map-link'))
  mapLinks.forEach(mapLink => {
    const href = mapLink.textContent
    mapLink.onclick = () => {
      setMapByURL(href)
    }
  })
}

export default rewriteMapLinks
