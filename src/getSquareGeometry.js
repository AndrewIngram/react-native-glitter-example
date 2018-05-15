import { THREE } from "expo-three";

export default function getSquareGeometry(size) {
  const shape = new THREE.Shape();

  shape.moveTo(0, 0);
  shape.lineTo(1, 0);
  shape.lineTo(1, 1);
  shape.lineTo(0, 1);
  shape.lineTo(0, 0);

  return new THREE.ShapeGeometry(shape);
}
