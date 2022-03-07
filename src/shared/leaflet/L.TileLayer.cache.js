/* eslint-disable */
L.TileLayer.include({
  /**
   *
   * @param bbox map.getBounds()
   * @param minZoom
   * @param maxZoom
   */
  getTileUrlsForSeed: async function (bbox, minZoom, maxZoom) {
    console.log("===", {bbox, minZoom, maxZoom})
    if (!this._map) return;
    for (var z = minZoom; z <= maxZoom; z++) {
      const northEastPosition = bbox.getNorthEast()
      const southWestPosition = bbox.getSouthWest()
      await this.handleZoomPositions(northEastPosition, southWestPosition, z)
    }
  },
  handleZoomPositions: async function (northEastPosition, southWestPosition, z, cb) {
    const northEastPoint = this._map.project(northEastPosition, z);
    const southWestPoint = this._map.project(southWestPosition, z);
    const tileBounds = this._pxBoundsToTileRange(
      L.bounds([northEastPoint, southWestPoint])
    );
    for (let j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
      for (let i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
        const point = new L.Point(i, j);
        point.z = z;
        if (cb) {
          await cb(point)
        }
      }
    }
  }
});
