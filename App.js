import { Accelerometer, Font, GLView } from "expo";
import ExpoTHREE, { THREE } from "expo-three";
import React, { Fragment, PureComponent } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

THREE.suppressExpoWarnings(true);

import getSquareGeometry from "./src/getSquareGeometry";

export default class App extends PureComponent {
  state = {
    loaded: false
  };

  _accelerometerData = {
    x: 0,
    y: 0,
    z: 0
  };

  async componentDidMount() {
    this._normalMap = await ExpoTHREE.loadAsync(
      require("./assets/normalMap.png")
    );
    // await Font.loadAsync({
    //   pacifico: require("./assets/Pacifico-Regular.ttf")
    // });
    this.setState({
      loaded: true
    });
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
        z: accelerometerData.z
      };
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  _onGLContextCreate = gl => {
    const near_plane = 1;
    const far_plane = 900;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      near_plane,
      far_plane
    );

    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const geometry = getSquareGeometry();
    geometry.center();

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x371159,
      metalness: 1,
      // map: this._normalMap,
      normalMap: this._normalMap
    });

    const mesh = new THREE.Mesh(geometry, material);
    // mesh.center();
    mesh.scale.set(256, 256, 1);

    scene.add(mesh);

    const dist = 256 / (2 * Math.tan(camera.fov * Math.PI / 360));

    camera.position.set(0, 0, 256 / 2 + dist);

    // camera.position.set(0, 0, far_plane);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const light = new THREE.SpotLight(0xffffff);
    light.position.set(-2048, -2048, 256 + dist);
    light.intensity = 0.9;
    scene.add(light);

    const renderLoop = () => {
      requestAnimationFrame(renderLoop);
      light.position.x = 512 * this._accelerometerData.x;
      light.position.y = 512 * this._accelerometerData.y;

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
          {this.state.loaded && (
            <GLView
              style={{ flex: 1 }}
              onContextCreate={this._onGLContextCreate}
            />
          )}
        </View>
        {/* {this.state.loaded && (
          <View style={[StyleSheet.absoluteFill, styles.textContainer]}>
            <Text
              style={{ fontFamily: "pacifico", fontSize: 36, color: "yellow" }}
            >
              Glittery
            </Text>
          </View>
        )} */}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rebeccapurple"
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center"
  }
});
