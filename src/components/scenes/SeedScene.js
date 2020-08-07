import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Octopus, Head } from 'objects';
import { BasicLights } from 'lights';
import * as THREE from "three";
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
        };

        // Set background to a nice color
        this.background = new Color(0xffcccc);

        // this.background = new THREE.CubeTextureLoader()
		// 	.load( [
        //         POSX, NEGX,
        //         POSY, NEGY,
        //         POSZ, NEGZ
        // ] );

        // Add meshes to scene
        // const land = new Land();
        const octopus = new Octopus(this);
        this.octopus = octopus;
        const lights = new BasicLights();
        this.add(octopus, lights);

        // const head = new Head(this);
        // this.add(head);
        // this.head = head;

        // this.addFlower();

        // Populate GUI
        this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
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

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    toggle(category, item) {
        // console.log("seedscene.js - toggle");
        let currentItems = this.children;
        let disposed = 0;
        // console.log("updateList before: ");
        // console.log(currentItems);
        for (let i = 0; i < currentItems.length; i++) {
            if (currentItems[i].item == item) {
                console.log("seedscene.js - disposed");
                currentItems[i].dispose();
                disposed = 1;
                break;
            }
        }
        if (!disposed) {
            console.log("seedscene.js - added");
            const head = new Head(this, item);
            this.add(head);
        }
        // console.log("updateList after: ");
        // console.log(currentItems);
    }

    reset() {
        while (this.children.length > 2) {
            this.remove(this.children[2]);
        }
    }

    addFlower() {
        const flower = new Flower(this);
        this.add(flower);
        this.flower = flower;
    }

    removeFlower() {
        this.flower.dispose();
    }
}

export default SeedScene;
