import { WIDTH, HEIGHT } from "./constants";
import polygons from "./polygons";

import polygonToGeometry from "./polygonToGeometry";

export default function getNormalMapScene() {
  const scene = new THREE.Scene();

  polygons.forEach(polygon => {
    const geometry = polygonToGeometry(polygon);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.5 - Math.random(), 0.5 - Math.random(), 1)
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });

  return scene;
}
