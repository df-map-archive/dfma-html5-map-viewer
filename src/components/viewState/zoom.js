/**
 * Configure methods by injecting in shared viewState dependency
 *
 * @param {object} viewState
 */
export default (viewState) => {
  const jump = 1.05

  /**
   * Zoom in by a set amount
   */
  function zoomIn () {
    viewState.scale *= jump
    if (viewState.scale > 20) {
      viewState.scale = 20
    }
    zoom()
  }

  /**
   * Zoom out by a set amount
   */
  function zoomOut () {
    viewState.scale /= jump
    if (viewState.scale < 0.01) {
      viewState.scale = 0.01
    }
    zoom()
  }

  /**
   * Update the view position based on a change in scale
   */
  function zoom () {
    const { canvasWidth, canvasHeight } = viewState

    const curCenterX = canvasWidth / 2 - viewState.imageX
    const curCenterY = canvasHeight / 2 - viewState.imageY

    const ratioX = curCenterX / viewState.imgWidth
    const ratioY = curCenterY / viewState.imgHeight

    viewState.imgWidth = viewState.originalImgWidth * viewState.scale
    viewState.imgHeight = viewState.originalImgHeight * viewState.scale

    viewState.imageX = canvasWidth / 2 - viewState.imgWidth * ratioX
    viewState.imageY = canvasHeight / 2 - viewState.imgHeight * ratioY
    viewState.originalImgWidth = 0

    viewState.messages.push(`Zoomed at: ${viewState.scale.toFixed(3)}`)
  }

  return {
    zoomIn,
    zoomOut
  }
}
