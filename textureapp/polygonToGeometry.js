export default function meshForPolygon(polygon, index) {
  const [first, ...remainder] = polygon;

  const shape = new THREE.Shape();

  shape.moveTo(first[0], first[1]);

  remainder.forEach(([x, y]) => {
    shape.lineTo(x, y);
  });

  shape.lineTo(first[0], first[1]);

  return new THREE.ShapeGeometry(shape);
}
