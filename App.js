import { Accelerometer, Font, GLView } from 'expo';
import ExpoTHREE, { THREE } from 'expo-three';
import React, { Fragment, PureComponent } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import polygons from './src/polygons';

THREE.suppressExpoWarnings(true);

const material = new THREE.MeshPhysicalMaterial({
  color: 0x371159,
  metalness: 1,
});

function meshForPolygon(polygon, index) {
  const [first, ...remainder] = polygon;

  const shape = new THREE.Shape();

  shape.moveTo(first[0], first[1]);

  remainder.forEach(([x, y]) => {
    shape.lineTo(x, y);
  });

  shape.lineTo(first[0], first[1]);

  const geometry = new THREE.ShapeGeometry(shape);

  const normal =  new THREE.Vector3(0.5 - Math.random(), 0.5 - Math.random(), 1);

  geometry.faces.forEach(face => {
    face.vertexNormals = [normal, normal, normal];
  });
  geometry.elementsNeedUpdate = true;

  return new THREE.Mesh(geometry, material);
}

const mergedGeometry = polygons.map(meshForPolygon).reduce((acc, mesh) => {
  mesh.updateMatrix();
  acc.merge(mesh.geometry, mesh.matrix);
  return acc;
}, new THREE.Geometry());

const mesh = new THREE.Mesh(mergedGeometry, material);

export default class App extends PureComponent {
  state = {
    loaded: false
  }

  _accelerometerData = {
    x: 0,
    y: 0,
    z: 0,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'pacifico': require('./assets/Pacifico-Regular.ttf'),
    });
    this.setState({
      loaded: true
    })
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    Accelerometer.setUpdateInterval(16);
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this._accelerometerData = {
        x: accelerometerData.x,
        y: accelerometerData.y,
        z: accelerometerData.z,
      };
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  _onGLContextCreate = gl => {
    const near_plane = 2;
    const far_plane = 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      near_plane,
      far_plane
    );

    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    scene.add(mesh);

    camera.position.set(0, 0, far_plane );
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const light = new THREE.SpotLight(0xffffff);
    light.position.set(0, 0, 2 * far_plane);
    light.intensity = 0.6;
    scene.add(light);

    const renderLoop = () => {
      requestAnimationFrame(renderLoop);
      light.position.x = 1000 * this._accelerometerData.x;
      light.position.y = 1000 * this._accelerometerData.y;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    renderLoop();
  };

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <GLView
            style={{ flex: 1 }}
            onContextCreate={this._onGLContextCreate}
          />
        </View>
        {this.state.loaded && <View style={[StyleSheet.absoluteFill, styles.textContainer]}>
        <Text style={{ fontFamily: 'pacifico', fontSize: 36, color: 'yellow' }}>
  Glittery
</Text>
        </View>}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rebeccapurple',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
