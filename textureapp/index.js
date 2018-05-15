import { WIDTH, HEIGHT } from "./constants";

import getNormalMapScene from "./getNormalMapScene";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#000000");
renderer.setSize(WIDTH, HEIGHT);

const near_plane = 2;
const far_plane = 600;

const camera = new THREE.OrthographicCamera(
  -0.5 * WIDTH,
  0.5 * WIDTH,
  0.5 * HEIGHT,
  -0.5 * HEIGHT
);

camera.position.set(0, 0, 2000);
camera.lookAt(new THREE.Vector3(0, 0, 0));

document.body.appendChild(renderer.domElement);

renderer.render(getNormalMapScene(), camera);
