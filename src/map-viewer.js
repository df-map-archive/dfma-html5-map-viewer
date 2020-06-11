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
  }
}

function rewriteMapLinks(document, renderer) {
  const mapLinks = Array.from(document.getElementsByTagName('map-link'))
  mapLinks.forEach(mapLink => {
    const href = mapLink.innerText
    mapLink.onclick = () => {
      console.log('[map-viewer] Map link clicked:', href)
    }
  })
}

setup()
