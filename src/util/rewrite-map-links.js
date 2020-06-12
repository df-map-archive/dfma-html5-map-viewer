function rewriteMapLinks (document, renderer) {
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

export default rewriteMapLinks
