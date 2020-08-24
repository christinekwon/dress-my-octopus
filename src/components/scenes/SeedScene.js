import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Octopus, Heart, Bow, Necklace, Chain, Baby, Lash, Lips, Mask, Sunglasses, Earrings, Purse, Bubble } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from "three";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';

// import { ResourceTracker } from "tracker";
import POSX from "./textures/Skybox/posx.jpg";
import NEGX from "./textures/Skybox/negx.jpg";
import POSY from "./textures/Skybox/posy.jpg";
import NEGY from "./textures/Skybox/negy.jpg";
import POSZ from "./textures/Skybox/posz.jpg";
import NEGZ from "./textures/Skybox/negz.jpg";
import WATER from "./textures/Water/bg-04.png";
// import WHITE from "./textures/White/white.png";

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            bob: true,
            spin: this.spin.bind(this),
            twirl: 0,
        };

        var metalMap = new THREE.CubeTextureLoader()
        .load( [
            POSX, NEGX,
            POSY, NEGY,
            POSZ, NEGZ
        ] );

        var envMap = new THREE.CubeTextureLoader()
        .load( [
            WATER, WATER,
            WATER, WATER,
            WATER, WATER
        ] );

        this.envMap = envMap;

        this.objects = {
            "HEART": new Heart(this, envMap),
            "BOW": new Bow(this),
            "NECKLACE": new Necklace(this, envMap),
            "CHAIN": new Chain(this),
            "BABY0": new Baby(this, 0),
            "BABY1": new Baby(this, 1),
            "LASH": new Lash(this),
            "LIPS": new Lips(this),
            "MASK": new Mask(this),
            "SUNGLASSES": new Sunglasses(this, metalMap),
            "EARRINGS": new Earrings(this, metalMap),
            "PURSE": new Purse(this, metalMap),
        }

        for (var obj in this.objects) {
            this.add(this.objects[obj]);
        }

        const bubbles = [];
        bubbles.push(new Bubble(this, metalMap, 12, -8, 3, 0.3, 1));
        bubbles.push(new Bubble(this, metalMap, 11, 1, 1, 0.6, 0));
        bubbles.push(new Bubble(this, metalMap, 10, -3, 5, 0.3, 1));
        bubbles.push(new Bubble(this, metalMap, 9, 2, 2, 0.1, 0));
        bubbles.push(new Bubble(this, metalMap, 9, 7, 7, 0.8, 0));
        bubbles.push(new Bubble(this, metalMap, 8, -1, 7, 0.2, 1));
        bubbles.push(new Bubble(this, metalMap, 7, 4, 9, 0.6, 0));
        bubbles.push(new Bubble(this, metalMap, 6, -4, 0, 0.4, 1));
        bubbles.push(new Bubble(this, metalMap, 5, -9, 9, 0.9, 0));
        bubbles.push(new Bubble(this, metalMap, 4, 6, 8, 0.5, 1));
        bubbles.push(new Bubble(this, metalMap, 3, -1, 10, 0.3, 0));
        bubbles.push(new Bubble(this, metalMap, 2, 4, 3, 0.1, 1));
        bubbles.push(new Bubble(this, metalMap, 1, -6, 5, 0.4, 0));
        bubbles.push(new Bubble(this, metalMap, 0, -10, 7, 0.2, 1));
        bubbles.push(new Bubble(this, metalMap, 0, 7, 4, 0.4, 1));
        bubbles.push(new Bubble(this, metalMap, -1, 5, 9, 0.3, 0));
        bubbles.push(new Bubble(this, metalMap, -2, 6, 4, 0.1, 1));
        bubbles.push(new Bubble(this, metalMap, -3, -9, 6, 0.4, 0));
        bubbles.push(new Bubble(this, metalMap, -4, -1, 3, 0.2, 1));
        bubbles.push(new Bubble(this, metalMap, -5, 4, 10, 0.6, 0));
        bubbles.push(new Bubble(this, metalMap, -7, -2, 5, 0.7, 0));
        bubbles.push(new Bubble(this, metalMap, -8, 6, 7, 0.3, 1));
        bubbles.push(new Bubble(this, metalMap, -9, -8, 4, 0.5, 0));
        bubbles.push(new Bubble(this, metalMap, -10, 1, 11, 0.3, 1));
        bubbles.push(new Bubble(this, metalMap, -11, -3, 2, 0.9, 0));
        bubbles.push(new Bubble(this, metalMap, -12, 5, 4, 0.4, 1));

        for (let bubble of bubbles) {
            this.add(bubble);
        }

        // this.add(this.objects.heart);
        // console.log(this.objects.keys);

        // Set background to a nice color
        this.background = envMap;


        const octopus = new Octopus(this);
        this.octopus = octopus;
        const lights = new BasicLights();
        this.add(octopus, lights);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
        // this.state.gui.add(this.state, 'rotationSpeed', -30, 30);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
        object.spin.bind(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // spins objects
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

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
                if (obj.name != "BUBBLE") {
                    obj.rotation.y += Math.PI / 8;

                }
            }
            this.state.twirl -= Math.PI / 8;
        }

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    toggle(item) {
        // let currentItems = this.children;
        // let disposed = 0;
        // for (let i = 0; i < currentItems.length; i++) {
        //     if (currentItems[i].item == item) {
        //         console.log("seedscene.js - disposed");
        //         currentItems[i].dispose();
        //         disposed = 1;
        //         break;
        //     }
        // }
        // if (!disposed) {
        //     // if (item ==)
        //     console.log("seedscene.js - added");
        //     // const obj = new Heart(this);
        //     // this.add(obj);

        //     // console.log(obj.visible);
        //     console.log(this.objects.heart.visible);
        //     this.objects.heart.visible = true;
        //     console.log(this.objects.heart.visible);
        // }
        this.objects[item].visible = !this.objects[item].visible;
    }

    spin() {
		// Add a simple twirl
		this.state.twirl += 6 * Math.PI;

		// Use timing library for more precice "bounce" animation
		// TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const { updateList } = this.state;

        for (const obj of updateList) {
            if (obj.name != "BUBBLE") {
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

	}

    reset() {

        for (var obj in this.objects) {
            this.objects[obj].visible = false;
        }

        // while (this.children.length > 2) {
        //     this.remove(this.children[0]);
        // }
    }
}

export default SeedScene;
