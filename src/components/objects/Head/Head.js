import { Group, Scene } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import HEART_OBJ from "./heart.obj";
import HEART_MAT from "./heart.mtl";
import BOW_OBJ from "./bow.obj";
import BOW_MAT from "./bow.mtl";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";
import { ResourceTracker } from "../../tracker";

class Head extends Group {
	constructor(parent, item) {
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

		this.category = "HEAD";
		this.item = item;

		var material = new THREE.MeshPhongMaterial({
			color: 0xff4466,
			specular: 0xffffff,
			shininess: 100
		});

		this.itemMap = {
			"HEART": [HEART_MAT, HEART_OBJ, 0, -1, 0],
			"BOW": [BOW_MAT, BOW_OBJ, 0, -1, 0],
			"CAP": [HEART_MAT, HEART_OBJ, 0, 1, 0],
			"HAT": [HEART_MAT, HEART_OBJ, 0, -5, 0]
		}

		this.addItem(item, this);
		parent.addToUpdateList(this);
		
		// Populate GUI
		// this.state.gui.add(this.state, 'bob');
		// this.state.gui.add(this.state, 'spin');

	}

	addItem(item, self) {
		var params = self.itemMap[item];
		//   console.log(self);
		const objloader = new OBJLoader();
		const mtlLoader = new MTLLoader();
		mtlLoader.load(params[0], function ( materials ) {
			var objLoader = new OBJLoader();
			objLoader.setMaterials( materials );//Set the materials for the objects using OBJLoader's setMaterials method
			objLoader.load( params[1], object => {
				// object.scale.set( 0, 0, 1 ); 
				object.position.set( params[2], params[3], params[4] ); 
				object.rotation.set( 0, -Math.PI, 0 ); 
				self.add( object );
			});
		});
	}

	dispose() {
		console.log("Head.js - disposed");
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
		// console.log(this.leg1.geometry);
		// this.leg1.geometry.vertices[50].x += 0.1;
        if (this.state.bob) {
            // Bob back antd forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
	}
}

export default Head;
