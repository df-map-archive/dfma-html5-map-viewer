import { expect } from 'chai'
import { chromium } from 'playwright'
import pixelmatch from 'pixelmatch'
import path from 'path'
import fs from 'fs'
import { PNG } from 'pngjs'
import '../helpers/start-server.js'

import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
    this.timeout(20000)
    // Make sure to run headed.
    const browser = await chromium.launch({ headless: true, width, height, padding })

    // Setup context however you like.
    const context = await browser.newContext({ /* pass any options */ })
    await context.route('**/*', route => route.continue())

    // Pause the page, and start recording manually.
    const page = await context.newPage()
    await page.goto('http://localhost:9757/fullscreen.html')
    await page.locator('canvas').screenshot({ path: localPath('results/default-map-actual.png'), width, height })
    
    browser.close()
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
