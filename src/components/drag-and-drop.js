function registerOn (document, browserWindow, { viewState, loadMapFromFileSystem }) {
  const dropTarget = document.getElementById('p5-dfma-html5-map-viewer')

  console.log('[Drag and Drop]', 'Registered drop target', dropTarget)

  dropTarget.ondragover = fileHover
  dropTarget.ondragleave = fileHoverLeave
  dropTarget.ondrop = fileDrop

  function allowDrop (ev) {
    ev.preventDefault()
  }

  /**
   * Callback for when a hover event occurs
   */
  function fileHover (ev) {
    allowDrop(ev)
    viewState.dragged = true
  }

  /**
   * Call back for when a hover event leaves canvas
   */
  function fileHoverLeave () {
    viewState.dragged = false
  }

  /**
   * Callback for when a file drop event occurs
   */
  async function fileDrop (ev) {
    allowDrop(ev)
    const { dataTransfer } = ev
    const { files } = dataTransfer
    console.log(files)
    const dropFile = files[0]

    if (!dropFile.name.endsWith('fdf-map')) {
      browserWindow.alert("Invalid File Format! You must submit an 'fdf-map' file!")
    }

    // Reset draw on existing map
    viewState.originalImgWidth = 0
    viewState.originalImgHeight = 0

    fileHoverLeave()
    if (document.getElementById('fileName')) {
      document.getElementById('fileName').innerText = dropFile.name
    }

    viewState.dfMapData = await loadMapFromFileSystem(dropFile)
  }
}

export default registerOn
