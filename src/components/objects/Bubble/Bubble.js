import { Group, Scene } from "three";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";
// import POSX from "../../scenes/textures/Skybox/posx.jpg";
// import NEGX from "../../scenes/textures/Skybox/negx.jpg";
// import POSY from "../../scenes/textures/Skybox/posy.jpg";
// import NEGY from "../../scenes/textures/Skybox/negy.jpg";
// import POSZ from "../../scenes/textures/Skybox/posz.jpg";
// import NEGZ from "../../scenes/textures/Skybox/negz.jpg";

class Bubble extends Group {
  constructor(parent, metalMap, x, y, z, radius, grow) {
    // Call parent Group() constructor
	super();

    // Init state
    this.state = {
		// gui: parent.state.gui,
		bob: false,
		spin: this.spin.bind(this),
		// twirl: 0,
		count: radius * 100,
		grow: grow,
	};
  
	this.name = "BUBBLE"  

	let geometry = new THREE.SphereGeometry( radius, 32, 32 );
	// let material = new THREE.MeshPhongMaterial({
	// 	color: 0xff99c8,
	// 	specular: 0xffffff,
	// 	emissive: 0x007777,
	// 	// color: 0xffffff,
	// 	envMap: parent.envMap,
	// 	refractionRatio: 0.7,
	// 	shininess: 1000,
	//   });
	// material.envMap.mapping = THREE.CubeRefractionMapping;


	var material = new THREE.MeshStandardMaterial( {
		color: 0xff99c8,
		emissive: 0x007777,
		metalness: 1,   // between 0 and 1
		roughness: 0, // between 0 and 1
		envMap: metalMap,
		envMapIntensity: 3
	} );

	let sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(x, y, z);
	this.add(sphere);
	this.sphere = sphere;

    parent.addToUpdateList(this);
    
    // Populate GUI
    // this.state.gui.add(this.state, 'bob');
	// this.state.gui.add(this.state, 'spin');

  }

  spin() {

	}
	update(timeStamp) {
		if (this.state.grow) {
			this.state.count++;
			this.sphere.scale.multiplyScalar(1.002);
			if (this.state.count == 200) {
				this.state.grow = 0;
			}
		}
		else {
			this.state.count--;
			this.sphere.scale.multiplyScalar(0.998);
			if (this.state.count == 0) {
				this.state.grow = 1;
			}
		}


        // TWEEN.update();
	}
}

export default Bubble;
