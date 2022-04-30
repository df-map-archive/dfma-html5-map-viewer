import p5adapter from '../adapters/p5adapter.js'

function isMouseOutOfBounds ({ mouseX, mouseY }, viewState) {
  return mouseX < 0 || mouseX > viewState.canvasWidth ||
    mouseY < 0 || mouseY > viewState.canvasHeight
}

function registerOn (browserWindow, { viewState }) {
  const p5 = p5adapter(browserWindow)
  /**
   * P5 MousePressed
   *
   * Called whenever the mouse is pressed
   */
  function mousePressed () {
    if (isMouseOutOfBounds(browserWindow, viewState)) {
      return
    }

    console.log('Mouse Pressed, viewState:', viewState)

    viewState.clickX = browserWindow.mouseX
    viewState.clickY = browserWindow.mouseY
    viewState.dragActive = true
  }

  /**
   * P5 MouseReleased
   *
   * Called whenever the mouse is released
   */
  function mouseReleased () {
    viewState.dragActive = false
  }

  /**
   * P5 MouseDragged
   *
   * Called whenever the mouse is dragged
   */
  function mouseDragged () {
    if (!viewState.dragActive) {
      return
    }

    const xDif = (browserWindow.mouseX - viewState.clickX)
    const yDif = (browserWindow.mouseY - viewState.clickY)
    viewState.clickX = browserWindow.mouseX
    viewState.clickY = browserWindow.mouseY
    viewState.imageX += xDif
    viewState.imageY += yDif
  }

  /**
   * P5 KeyPressed function
   *
   * called whenever a key is pressed
   */
  function keyPressed () {
    if (browserWindow.key === ',' || browserWindow.key === '<') {
      viewState.idx++
      if (viewState.idx >= viewState.dfMapData.numLayers) {
        viewState.idx = viewState.dfMapData.numLayers - 1
      }
    }
    if (browserWindow.key === '.' || browserWindow.key === '>') {
      viewState.idx = Math.max(0, viewState.idx - 1)
    }

    let modifier = 1

    if (p5.keyIsDown(90)) { //  'z'
      modifier = 10
    }

    if (p5.keyIsDown(102)) { // number 6
      viewState.imageX -= viewState.dfMapData.tileWidth * viewState.scale * modifier
    }
    if (p5.keyIsDown(100)) { // number 4
      viewState.imageX += viewState.dfMapData.tileWidth * viewState.scale * modifier
    }
    if (p5.keyIsDown(98)) { // number 2
      viewState.imageY -= viewState.dfMapData.tileHeight * viewState.scale * modifier
    }
    if (p5.keyIsDown(104)) { // number 8
      viewState.imageY += viewState.dfMapData.tileHeight * viewState.scale * modifier
    }
  }

  browserWindow.keyPressed = keyPressed
  browserWindow.mouseDragged = mouseDragged
  browserWindow.mousePressed = mousePressed
  browserWindow.mouseReleased = mouseReleased
}

export default registerOn
