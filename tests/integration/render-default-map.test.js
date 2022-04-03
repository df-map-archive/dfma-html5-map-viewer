import { expect } from 'chai'
import Nightmare from 'nightmare'
import pixelmatch from 'pixelmatch'
import path from 'path'
import fs from 'fs'
import { PNG } from 'pngjs'
import '../helpers/start-server.js'

import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nightmare = Nightmare({
  show: false,
  gotoTimeout: 5000,
  waitTimeout: 5000
})

function localPath (pathFragment) {
  return path.join(__dirname, pathFragment)
}

function readBinary (pathFragment) {
  const filepath = localPath(pathFragment)
  return fs.readFileSync(filepath)
}

describe('Render Default Map', () => {
  const width = 800
  const height = 600
  const padding = 50

  before(async function () {
    this.timeout(40000)
    console.log('[Render Default Map] [Before]')
    try {
      return nightmare
        .on('console', (log, ...msg) => {
          console.log('Nightmare Console', ...msg)
        })
        .viewport(width + padding, height + padding)
        .goto('http://localhost:9757/fullscreen.html')
        .screenshot(localPath('results/default-map-actual-pre-wait.png'), { x: 0, y: 0, width, height })
        .wait('canvas#defaultCanvas0')
        .click('canvas')
        .screenshot(localPath('results/default-map-actual.png'), { x: 0, y: 0, width, height })
        .evaluate(() => document.querySelector('#defaultCanvas0').className)
        .end()
        .then((result) => {
          console.log('[Before Render Default Map]', result)
        })
        .catch(error => {
          console.error('[Before Render Default Map] Failed:', error)
        })
    } catch (ex) {
      console.log('[Before Render Defaults Map] [Error]', ex)
    }
  })

  it('Should render map data to the page', () => {
    const actual = PNG.sync.read(readBinary('results/default-map-actual.png'))
    const expected = PNG.sync.read(readBinary('samples/default-map-expected.png'))
    const { width, height } = expected
    const diff = new PNG({ width, height })

    const result = pixelmatch(expected.data, actual.data, diff.data, width, height, { threshold: 0.1 })
    fs.writeFileSync(localPath('results/default-map-diff.png'), PNG.sync.write(diff))

    expect(result).to.deep.equal(0)
  })
})
