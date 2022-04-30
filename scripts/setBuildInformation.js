import fs from 'fs'
import path, { dirname } from 'path'

import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

let buildHash
try {
  buildHash = fs.readFileSync(path.join(__dirname, '../build/buildhash.txt'), 'utf8')
} catch (ex) {
  buildHash = 'UNKNOWN'
}

const date = new Date()
const source = `https://github.com/df-map-archive/dfma-html5-map-viewer/commit/${buildHash}`

const buildInfo = {
  buildHash,
  date,
  source
}

fs.writeFileSync(path.join(__dirname, '../src/buildInfo.json'), JSON.stringify(buildInfo, null, 2), 'utf8')

console.log('[Set Build Information]', buildInfo)
