import { Group, Scene, RedFormat } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import MODEL from "./sunglasses.obj";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";
import { ResourceTracker } from "../../tracker";
import BUTTERFLY from "../textures/butterfly.png";

class Sunglasses extends Group {
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

		this.item = "SUNGLASSES";

		// let lensMaterial = new THREE.MeshPhongMaterial({
		// 	color: 0xff4466,

		// 	// color: 0xffffff,
		// 	envMap: envMap,
		// 	refractionRatio: 0.7,
		// 	shininess: 1000,
        // });
        
        var lensMaterial = new THREE.MeshStandardMaterial( {
            emissive: 0xea526f,
            specular: 0xffffff,
            metalness: 1,
            roughness: 0,
            color: 0xf9ada0,
            envMap: envMap,
            envMapIntensity: 1.5
        } );
	

        var goldMaterial = new THREE.MeshPhongMaterial( {
            // color: 0xfcc742,
            // emissive: 0xad6a0e,
            color: 0xffffff,
			shininess: 1000,
        } );
	
		const objloader = new OBJLoader();
		// const mtlLoader = new MTLLoader();
		objloader.load(MODEL, obj => {
			obj.position.set(0, -1.2, -0.1);
			obj.rotation.set(0, -Math.PI, 0);

			obj.children[0].material = lensMaterial;
			obj.children[1].material = lensMaterial;
			obj.children[2].material = goldMaterial;
			
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

export default Sunglasses;
