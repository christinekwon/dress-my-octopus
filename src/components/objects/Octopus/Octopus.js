import { Group, Scene } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import MODEL from "./Octopus.obj";
import MATERIAL from "./Octopus.mtl";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import * as THREE from "three";
import POSX from "./textures/FishPond/posx.jpg";
import NEGX from "./textures/FishPond/negx.jpg";
import POSY from "./textures/FishPond/posy.jpg";
import NEGY from "./textures/FishPond/negy.jpg";
import POSZ from "./textures/FishPond/posz.jpg";
import NEGZ from "./textures/FishPond/negz.jpg";
import WHITE from "./textures/white/white.png";
import Tube from "./NewTubeGeometry.js";

class Octopus extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    // Init state
    this.state = {
		gui: parent.state.gui,
		bob: true,
		spin: this.spin.bind(this),
		twirl: 0,
	};
  
	this.name = "OCTOPUS"
	var material = new THREE.MeshPhongMaterial({
		color: 0xff4466,
		specular: 0xffffff,
		shininess: 100
	});

	const objloader = new OBJLoader();
	const mtlLoader = new MTLLoader();
	mtlLoader.load(MATERIAL, function ( materials ) {
		var objLoader = new OBJLoader();
		objLoader.setMaterials( materials );//Set the materials for the objects using OBJLoader's setMaterials method
		objLoader.load( MODEL, object => {
			// object.scale.set( 0, 0, 1 ); 
			object.position.set( 0, -2, 0 ); 
			object.rotation.set( 0, 0, 0 ); 
			parent.octopus.add( object );
		});

	});


    // objloader.setMaterials(mtlLoader.parse(MATERIAL)).load(MODEL, obj => {
	// 	console.log(mtlLoader.parse(MATERIAL));
    //   obj.position.set(0, -1, 0);
    //   obj.rotation.set(0, Math.PI, 0);

    //   obj.children[0].material = material;


    //   obj.matrixAutoUpdate = false;
    //   obj.updateMatrix();
	  
	//   // uncomment to add octopus
    //   this.add(obj);
    //   this.obj = obj;

	// });
	
	// radius, widthsegments, heightsegments, phistart, philength, thetastart, thetalength
	// var geometry = new THREE.SphereGeometry( 2, 32, 32 );
	// var head = new THREE.Mesh( geometry, material );
	// head.position.y += 1;
	// this.add(head);

	// var numPoints = 4;
	// var start = new THREE.Vector3(1, 0, 0);
	// var middle = new THREE.Vector3(2, -1, -1);
	// var end = new THREE.Vector3(3, -3, -2);

	// var curveQuad = new THREE.QuadraticBezierCurve3(start, middle, end);

	// var tube = new THREE.TubeGeometry(curveQuad, numPoints, 0.5, 20, true);
	// var leg1 = new THREE.Mesh(tube, new THREE.MeshNormalMaterial({
	// 	opacity: 0.9,
	// 	transparent: true
	// }));
	// this.leg1 = leg1;
	// this.add(leg1);

	
    
    parent.addToUpdateList(this);
    
    // Populate GUI
    // this.state.gui.add(this.state, 'bob');
	// this.state.gui.add(this.state, 'spin');

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
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }
        TWEEN.update();
	}
}

export default Octopus;
