import { MapData } from './parser-g1.js'
import pako from 'pako'

const browserWindow = (typeof window !== 'undefined') ? window : {}
const fetch = browserWindow.fetch

/**
 * Loads and parses a data file from a local user machine
 *
 * This only parses the data, it does NOT populate the image files.
 * These are generated and cached on-the-fly.
 *
 * @param {string} mapFile local filesystem path of the .fdf-map file to read
 *
 * @return {MapData} a mapData object that's ready to have its layers queried with mapData.getLayer()
 */
export async function loadMapFromFileSystem (mapFile) {
  const reader = new browserWindow.FileReader()
  reader.readAsArrayBuffer(mapFile)

  let resolved, rejected
  const result = new Promise((resolve, reject) => {
    resolved = resolve
    rejected = reject
  })

  let mapData
  reader.onload = function () {
    try {
      const arr = new Uint8Array(reader.result)
      const data = pako.inflate(arr)
      const res = new DataView(data.buffer)

      mapData = new MapData()
      mapData.parse(res)
      resolved(mapData)
    } catch (ex) {
      rejected(ex)
    }
  }

  return result
}

/**
 * Uses Es6 Fetch to get a file at the given path
 *
 * path - path to file (relative to root or absolute)
 */
async function fetchAndDecompressMapData (path) {
  const res = await fetch(path, {
    method: 'GET',
    headers: {
      Origin: 'https://mkv25.net'
    }
  })
  const arrayBuffer = await res.arrayBuffer()
  const dataArray = new Uint8Array(arrayBuffer)

  // inflate data
  const data = pako.inflate(dataArray)
  const result = new DataView(data.buffer)

  return result
}

/**
 * Fetches and parses a data file from a specific network path
 *
 * This only parses the data, it does NOT populate the image files.
 * These are generated and cached on-the-fly.
 *
 * NOTE: Due to CORS the desired file must be under the same origin.
 * path - path to data file
 *
 * @param {string} path remote URL of the .fdf-map file to fetch
 *
 * @return {MapData} a mapData object that's ready to have its layers queried with mapData.getLayer()
 */
export async function loadMapFromURL (path) {
  const mapData = new MapData()
  try {
    const loadedData = await fetchAndDecompressMapData(path)
    mapData.parse(loadedData)
  } catch (err) {
    console.error(err)
  }

  return mapData
}

export default {
  loadMapFromURL,
  loadMapFromFileSystem
}
