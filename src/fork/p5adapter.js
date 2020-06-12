function adaptToObject (fnName, object) {
  return (...args) => object[fnName](...args)
}

const methodsToAdapt = [
  'alert',
  'background',
  'createCanvas',
  'createImage',
  'fill',
  'floor',
  'image',
  'keyIsDown',
  'max',
  'noFill',
  'line',
  'rect',
  'stroke',
  'strokeWeight',
  'text',
  'textAlign',
  'textFont',
  'pixelDensity'
]

module.exports = (window) => {
  const methods = methodsToAdapt.reduce((acc, methodName) => {
    acc[methodName] = adaptToObject(methodName, window)
    return acc
  }, {})
  return methods
}
