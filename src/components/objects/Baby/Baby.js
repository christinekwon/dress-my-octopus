import { Group, Scene, RedFormat } from "three";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import MODEL from "./baby.obj";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";
import { ResourceTracker } from "../../tracker";
import STRIPES from "../textures/green-stripes.png";

class Baby extends Group {
	constructor(parent, id) {
		// Call parent Group() constructor
		super();

		// Init state
		this.state = {
			gui: parent.state.gui,
			bob: true,
			spin: this.spin.bind(this),
			twirl: 0,
		};

		this.tracker = new ResourceTracker();
		const track = this.tracker.track.bind(this.tracker);

		this.item = "BABY";
		let material1, material2, material3, material4, x, y, z;

		if (id == 0) {
			material1 = new THREE.MeshPhongMaterial({
				color: 0x79dd69,
				// color: 0x7da1sd8,
				specular: 0xffffff,
				shininess: 1000
			});
			material2 = new THREE.MeshPhongMaterial({
				// color: 0xff90b3,
				color: 0xf397d6,
				specular: 0xffffff,
				shininess: 1000
			});
			material3 = new THREE.MeshPhongMaterial({
				color: 0xfdc5f5,
				specular: 0xffffff,
				shininess: 1000
			});
			material4 = new THREE.MeshPhongMaterial({
				// color: 0xb8336a,
				color: 0xff58ab,
				specular: 0xffffff,
				shininess: 1000
			});
			x = 3;
			y = -1;
			z = -2;
		}
		else if (id == 1) {
			material1 = new THREE.MeshPhongMaterial({
				color: 0xf49097,
				specular: 0xffffff,
				shininess: 1000
			});
			material2 = new THREE.MeshPhongMaterial({
				// color: 0xf9b5ac,
				color: 0x66c3e8,
				specular: 0xffffff,
				shininess: 1000
			});
			material3 = new THREE.MeshPhongMaterial({
				// color: 0xffee93,
				color: 0xb0d8e8,
				specular: 0xffffff,
				shininess: 1000
			});
			material4 = new THREE.MeshPhongMaterial({
				// color: 0xff8c42,
				color: 0x2a8dce,
				specular: 0xffffff,
				shininess: 1000
			});
			x = -3;
			y = -1;
			z = -2;
		}

		const objloader = new OBJLoader();
		// const mtlLoader = new MTLLoader();
		objloader.load(MODEL, obj => {
			obj.position.set(x, y, z);
			obj.scale.multiplyScalar(0.3);
			obj.rotation.set(0, -Math.PI, 0);

		// 	let textureloader = new THREE.TextureLoader();
		// 	textureloader.load(STRIPES,function(tx){
		// 	 let stripeMaterial = new THREE.MeshPhongMaterial({
		// 		 map: tx,
		// 		wireframe: false,
		// 		specular: 0xffffff,
		// 		shininess: 1000
		// 	 });
		// 	 obj.children[0].material = stripeMaterial;
		//  });

			obj.children[0].material = material1;
			obj.children[1].material = material2;
			obj.children[2].material = material3;
			obj.children[3].material = material4;

			
			obj.matrixAutoUpdate = false;
			obj.updateMatrix();
			
			// uncomment to add octopus
			this.add(obj);
			this.obj = obj;

		});

		// this.addItem(this);
		parent.addToUpdateList(this);
		this.visible = false;
	}

	// addItem(self) {
	// 	const mtlLoader = new MTLLoader();
	// 	mtlLoader.load(HEART_MAT, function ( materials ) {
	// 		var objLoader = new OBJLoader();
	// 		objLoader.setMaterials( materials );//Set the materials for the objects using OBJLoader's setMaterials method
	// 		objLoader.load( HEART_OBJ, object => {
	// 			object.scale.multiplyScalar(self.size); 
	// 			object.position.set( self.pos[0], self.pos[1], self.pos[2] ); 
	// 			object.rotation.set( 0, -Math.PI, 0 ); 
	// 			self.add( object );
	// 		});
	// 	});
	// }

	dispose() {
		// console.log("Head.js - disposed");
        this.parent.remove(this);
        this.tracker.dispose();
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

export default Baby;
