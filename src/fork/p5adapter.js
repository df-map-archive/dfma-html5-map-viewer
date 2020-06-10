function adaptToObject(fnName, object) {
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
  'loadFromURL',
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

module.exports = methodsToAdapt.reduce((acc, methodName) => {
  acc[methodName] = adaptToObject(methodName, window)
  return acc
}, {})
