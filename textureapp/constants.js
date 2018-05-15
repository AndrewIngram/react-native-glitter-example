export const WIDTH = 512;
export const HEIGHT = 512;

export const PIXEL_SIZE = 16;

export const NUM_COLUMNS = Math.ceil(WIDTH / PIXEL_SIZE) - 1;
export const NUM_ROWS = Math.ceil(HEIGHT / PIXEL_SIZE) - 1;

export const NUM_PIXELS = NUM_COLUMNS * NUM_ROWS;
