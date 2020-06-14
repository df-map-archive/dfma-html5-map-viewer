import { MapData } from './parser'
const pako = require('pako')

function registerOn (browserWindow, renderer) {
  const dropTarget = browserWindow.getElementById('p5-dfma-html5-map-viewer')
  dropTarget.dragOver(fileHoverCB)
  dropTarget.dragLeave(fileHoverLeaveCB)
  dropTarget.drop(fileDropCB)

  /**
   * Callback for when a hover event occurs
   */
  function fileHoverCB () {
    renderer.dragged = true
  }

  /**
   * Call back for when a hover event leaves canvas
   */
  function fileHoverLeaveCB () {
    renderer.dragged = false
  }

  /**
   * Callback for when a file drop event occurs
   */
  function fileDropCB (dropFile) {
    if (!dropFile.name.endsWith('fdf-map')) {
      browserWindow.alert("Invalid File Format! You must submit an 'fdf-map' file!")
    }

    // Reset draw on existing map
    renderer.originalImgWidth = 0
    renderer.originalImgHeight = 0

    const reader = new browserWindow.FileReader()
    reader.onload = function () {
      const arr = new Uint8Array(reader.result)
      // inflate data
      const data = pako.inflate(arr)
      const res = new DataView(data.buffer)
      // bytes = new DataView(data.buffer);
      renderer.dfMapData = new MapData()
      renderer.dfMapData.parse(res)
    }

    reader.readAsArrayBuffer(dropFile.file)
    fileHoverLeaveCB()
    if (document.getElementById('fileName')) {
      document.getElementById('fileName').innerText = dropFile.name
    }
  }
}

export default registerOn
