import { Group, Scene } from "three";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";
// import POSX from "../../scenes/textures/Skybox/posx.jpg";
// import NEGX from "../../scenes/textures/Skybox/negx.jpg";
// import POSY from "../../scenes/textures/Skybox/posy.jpg";
// import NEGY from "../../scenes/textures/Skybox/negy.jpg";
// import POSZ from "../../scenes/textures/Skybox/posz.jpg";
// import NEGZ from "../../scenes/textures/Skybox/negz.jpg";

class Earrings extends Group {
  constructor(parent, metalMap, x, y, z, radius, grow) {
    // Call parent Group() constructor
	super();

    // Init state
    this.state = {
		// gui: parent.state.gui,
		bob: false,
		spin: this.spin.bind(this),
		// twirl: 0,
	};
  
	this.name = "EARRINGS"  

	let geometry = new THREE.SphereGeometry( 0.1, 32, 32 );

	let material = new THREE.MeshPhongMaterial({
		color: 0xfcd3de,
		specular: 0xffffff,
		shininess: 100
	});

	let sphere1 = new THREE.Mesh( geometry, material );
	sphere1.position.set(1.5, 0, 0);
	let sphere2 = new THREE.Mesh( geometry, material );
	sphere2.position.set(-1.5, 0, 0);
	this.add(sphere1);
	this.add(sphere2);
    parent.addToUpdateList(this);
	this.visible = false;

  }

  spin() {
	// Add a simple twirl
	this.state.twirl += 12 * Math.PI;

	// Use timing library for more precice "bounce" animation
	// TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
	// Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
	const jumpUp = new TWEEN.Tween(this.position)
		.to({ y: this.position.y + 3 }, 300)
		.easing(TWEEN.Easing.Quadratic.Out);
	const fallDown = new TWEEN.Tween(this.position)
		.to({ y: 0 }, 300)
		.easing(TWEEN.Easing.Quadratic.In);

	// Fall down after jumping up
	jumpUp.onComplete(() => fallDown.start());

	// Start animation
	jumpUp.start();
}

update(timeStamp) {
	if (this.state.bob) {
		// Bob back antd forth
		this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
	}
	if (this.state.twirl > 0) {
		this.state.twirl -= Math.PI / 8;
		this.rotation.y += Math.PI / 8;
	}

	// Advance tween animations, if any exist
	TWEEN.update();
}
}

export default Earrings;
