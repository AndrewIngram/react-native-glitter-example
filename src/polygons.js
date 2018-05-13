// @preval
import { voronoi } from 'd3-voronoi';
import { range } from 'lodash';
import { HEIGHT, NUM_COLUMNS, NUM_PIXELS, PIXEL_SIZE, WIDTH } from './constants';

const v = voronoi();

function randomShift(position) {
  return position + PIXEL_SIZE * (0.5 - Math.random());
}

const points = range(0, NUM_PIXELS).map(index => [
  WIDTH / 2 - randomShift(index % NUM_COLUMNS * PIXEL_SIZE),
  HEIGHT / 2 - randomShift(Math.floor(index / NUM_COLUMNS) * PIXEL_SIZE),
]);

const polygons = v.polygons(points).map(polygon => polygon.filter(Boolean).map(coordinates => [
  Math.round(coordinates[0]),
  Math.round(coordinates[1]),
]));


module.exports = polygons;