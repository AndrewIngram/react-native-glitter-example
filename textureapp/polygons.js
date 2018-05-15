import { voronoi } from "d3-voronoi";
import { range } from "lodash";
import {
  HEIGHT,
  NUM_COLUMNS,
  NUM_ROWS,
  NUM_PIXELS,
  PIXEL_SIZE,
  WIDTH
} from "./constants";

const v = voronoi();
function randomShift(position) {
  return position + PIXEL_SIZE * (0.5 - Math.random());
}

const points = range(0, NUM_PIXELS).map(index => [
  randomShift(PIXEL_SIZE / 2 + (index % NUM_COLUMNS) * PIXEL_SIZE),
  randomShift(PIXEL_SIZE / 2 + Math.floor(index / NUM_ROWS) * PIXEL_SIZE)
]);

console.log(points);

const polygons = v
  .polygons(points)
  .map(polygon =>
    polygon
      .filter(Boolean)
      .map(coordinates => [
        WIDTH / 2 - coordinates[0],
        HEIGHT / 2 - coordinates[1]
      ])
  );

module.exports = polygons;
