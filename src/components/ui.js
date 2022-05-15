// import p5adapter from '../adapters/p5adapter'

/**
 * Adds UI information into the viewstate
 *
 * @param {*} browserWindow
 * @param {*} viewstate
 * @returns
 */
export function registerUI (browserWindow, { viewState }) {
  //   const p5 = p5adapter(browserWindow)

  const buttons = {
    top_view_btn: {
      name: 'top_view_btn',
      text: 'top',
      width: 45,
      height: 45,
      xPos: viewState.canvasWidth - 60,
      yPos: 10,
      image: {},
      hovered: true,
      active: false
    },
    side_view_btn: {
      name: 'side_view_btn',
      text: 'side',
      width: 20,
      height: 45,
      xPos: viewState.canvasWidth - 90,
      yPos: 10,
      image: {},
      hovered: false,
      active: false
    },
    front_view_btn: {
      name: 'front_view_btn',
      text: 'front',
      width: 45,
      height: 20,
      xPos: viewState.canvasWidth - 60,
      yPos: 65,
      image: {},
      hovered: false,
      active: false
    }
  }

  const ui = { ui: { buttons } }
  Object.assign(viewState, ui)
  console.log('UPDATED VIEWSTATE: ', viewState)
  return ui
}

/**
 *
 * Checks whether a point is inside bounds of a uiElement (button for example)
 * uiElement must have the following fields:
 * width
 * height
 * xPos
 * yPos
 *
 * @param {*} uiElement Element bounds to check (i.e. button object from viewState)
 * @param {number} x x coordinate to check
 * @param {*} y y coordinate to check
 * @returns {*} true if coordinates are in bounds
 */
function inBounds (uiElement, x, y) {
  if (x < uiElement.xPos || y < uiElement.yPos) { return false }

  if (x > uiElement.xPos + uiElement.width || y > uiElement.yPos + uiElement.height) { return false }

  return true
}

export function uiCaptureMouse (browserWindow, { viewState }) {
//   let clickedElement = {}

  let elementFound = false
  for (const buttonName in viewState.ui.buttons) {
    const button = viewState.ui.buttons[buttonName]
    if (inBounds(button, browserWindow.mouseX, browserWindow.mouseY)) {
      console.log('[UI] UI Element Clicked: ', button.name)
      //   clickedElement = button
      elementFound = true
      button.active = true
      break
    } else {
      button.active = false
      button.hovered = false
    }
  }

  if (!elementFound) { return false }

  return true
}

export function clearButtonState (browserWindow, { viewState }) {
  for (const buttonName in viewState.ui.buttons) {
    const button = viewState.ui.buttons[buttonName]
    button.active = false
    button.hovered = false
  }
}

export default { registerUI, uiCaptureMouse, clearButtonState }
