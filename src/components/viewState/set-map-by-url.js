/**
 * Configure methods by injecting in shared viewState dependency
 *
 * @param {object} viewState        the shared view model
 * @param {function} loadMapFromURL the fetcher for map data
 *
 * @return {MapData} the decoded map
 */
export default (viewState, loadMapFromURL) => {
  /**
   * Set map to view by URL
   *
   * @param {string} mapUrl the URL of the fdf-map file to load and view
   */
  return async function (mapUrl) {
    if (document && document.getElementById) {
      document.getElementById('fileName').innerText = mapUrl
    }

    // fetch local file
    const map = await loadMapFromURL(mapUrl)
    viewState.dfMapData = map
    return map
  }
}
