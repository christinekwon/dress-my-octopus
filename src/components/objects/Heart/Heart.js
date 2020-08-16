import { Group, Scene, RedFormat } from "three";
// import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import MODEL from "./heart.obj";
// import HEART_MAT from "./heart.mtl";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";
import { ResourceTracker } from "../../tracker";

class Heart extends Group {
	constructor(parent, envMap) {
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

		this.item = "HEART";

		// var redMaterial = new THREE.MeshStandardMaterial( {
		// 	color: 0xff0000,
		// 	metalness: 1,   // between 0 and 1
		// 	roughness: 0, // between 0 and 1
		// 	envMap: envMap,
		// 	envMapIntensity: 2
		// } );

		var redMaterial = new THREE.MeshPhongMaterial({
			color: 0xff0000,
			specular: 0xffffff,
			shininess: 1000
		});

		var whiteMaterial = new THREE.MeshPhongMaterial({
			color: 0xffffff,
			specular: 0xffffff,
			shininess: 100
		});
	
		const objloader = new OBJLoader();
		// const mtlLoader = new MTLLoader();
		objloader.load(MODEL, obj => {
			obj.position.set(0, -1.5, 0);
			obj.rotation.set(0, -Math.PI, 0);

			obj.children[0].material = whiteMaterial;
			obj.children[1].material = redMaterial;
			obj.children[2].material = whiteMaterial;
			obj.children[3].material = redMaterial;

			obj.matrixAutoUpdate = false;
			obj.updateMatrix();
			
			// uncomment to add octopus
			this.add(obj);
			this.obj = obj;

		});

		// this.addItem(this);
		parent.addToUpdateList(this);
		this.visible = true;
	}

	addItem(self) {
		const mtlLoader = new MTLLoader();
		mtlLoader.load(HEART_MAT, function ( materials ) {
			var objLoader = new OBJLoader();
			objLoader.setMaterials( materials );//Set the materials for the objects using OBJLoader's setMaterials method
			objLoader.load( HEART_OBJ, object => {
				object.scale.multiplyScalar(self.size); 
				object.position.set( self.pos[0], self.pos[1], self.pos[2] ); 
				// object.rotation.set( 0, -Math.PI, 0 ); 
				self.add( object );
			});
		});
	}

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

export default Heart;
