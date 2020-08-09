import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Octopus, Head } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from "three";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

// import { ResourceTracker } from "tracker";
import POSX from "./textures/Earth/posx.jpg";
import NEGX from "./textures/Earth/negx.jpg";
import POSY from "./textures/Earth/posy.jpg";
import NEGY from "./textures/Earth/negy.jpg";
import POSZ from "./textures/Earth/posz.jpg";
import NEGZ from "./textures/Earth/negz.jpg";
import WHITE from "./textures/White/white.png";

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            bob: true,
            spin: this.spin.bind(this),
            twirl: 0,
        };

        // Set background to a nice color
        this.background = new Color(0xffcccc);

        const octopus = new Octopus(this);
        this.octopus = octopus;
        const lights = new BasicLights();
        this.add(octopus, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'bob');
        this.state.gui.add(this.state, 'spin');
        this.state.gui.add(this.state, 'rotationSpeed', -30, 30);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
        object.spin.bind(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // spins objects
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        if (this.state.bob) {
            for (let obj of updateList) {
                obj.state.bob = true;
            }
            // Bob back antd forth
            // this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        else {
            for (let obj of updateList) {
                obj.state.bob = false;
            }
        }

        if (this.state.twirl > 0) {
            for (let obj of updateList) {
                obj.rotation.y += Math.PI / 8;
            }
            this.state.twirl -= Math.PI / 8;
        }

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    toggle(category, item) {
        let currentItems = this.children;
        let disposed = 0;
        for (let i = 0; i < currentItems.length; i++) {
            if (currentItems[i].item == item) {
                // console.log("seedscene.js - disposed");
                currentItems[i].dispose();
                disposed = 1;
                break;
            }
        }
        if (!disposed) {
            // console.log("seedscene.js - added");
            const head = new Head(this, item);
            this.add(head);
        }
    }

    spin() {
		// Add a simple twirl
		this.state.twirl += 12 * Math.PI;

		// Use timing library for more precice "bounce" animation
		// TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const { updateList } = this.state;

        for (const obj of updateList) {
            const jumpUp = new TWEEN.Tween(obj.position)
                .to({ y: obj.position.y + 3 }, 300)
                .easing(TWEEN.Easing.Quadratic.Out);
		    const fallDown = new TWEEN.Tween(obj.position)
                .to({ y: 0 }, 300)
                .easing(TWEEN.Easing.Quadratic.In);

            // Fall down after jumping up
            jumpUp.onComplete(() => fallDown.start());

            // Start animation
            jumpUp.start();
        }

	}

    reset() {
        while (this.children.length > 2) {
            this.remove(this.children[2]);
        }
    }
}

export default SeedScene;
