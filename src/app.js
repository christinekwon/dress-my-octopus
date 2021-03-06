/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
// import CURSOR from './cursor.png';

var FLOWER = 0;
const HEAD = "head";
const FACE = "face";
const BODY = "body";
const LEGS = "legs";
const BASE = "base";
const ACC = "acc";

// yellow
// const BACKGROUND = new Color("rgb(255, 243, 175)");

const BACKGROUND = new Color("rgb(155, 254, 247)");
// const BACKGROUND = new Color("rgb(0, 0, 0)");
const ITEM_ON = "rgba(255, 255, 255, 0.75)";
const ITEM_OFF = "transparent";
const ITEM_ON_HOVER = "rgba(255, 255, 255, 1)";
const ITEM_OFF_HOVER = "rgba(255, 255, 255, 0.5)";

var itemMap = {
    "HEART": 0,
    "BOW": 0,
    "CAP": 0,
    "HAT": 0,
    "BABY0": 0,
    "BABY1": 0,
    "NECKLACE": 0,
    "CHAIN": 0,
    "LASH": 0,
    "LIPS": 0,
    "MASK": 0,
    "SUNGLASSES": 0,
    "EARRINGS": 0,
    "PURSE": 0,
}

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
// renderer.gammaInput = true;
// renderer.gammaOutput = true;
// Set up camera
camera.position.set(0, 2, -15);
camera.lookAt(new Vector3(0, 0, 0));

// scene.background = BACKGROUND;

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

// document.getElementById("flower").addEventListener('click', flower);

// function flower() {
//     if (FLOWER == 0) {
//         scene.addFlower();
//         document.getElementById("flower").innerHTML = "remove";
//         FLOWER = 1;
//     }
//     else {
//         scene.removeFlower();
//         document.getElementById("flower").innerHTML = "flower";
//         FLOWER = 0;
//     }
// }

// document.body.style.cursor = CURSOR;

var coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
        content.style.maxHeight = null;
        } else {
        content.style.maxHeight = content.scrollHeight + "px";
        } 
    });
}

var choices = document.getElementsByClassName("choice");
for (var choice of choices) {
    choice.addEventListener("click", toggleElement);
    // choice.addEventListener("mouseover", darken);
    // choice.addEventListener("mouseout", lighten);
}

document.getElementById("spin").addEventListener("click", function() {
    scene.spin();
});

document.getElementById("reset").addEventListener("click", function() {
    scene.reset();
    for (var choice of choices) {
        // choice.style.background = ITEM_OFF;
        choice.style.textDecoration = "line-through";
    }
    for (let item in itemMap) {
        itemMap[item] = 0;
    }
});

function darken(e) {
    let button = e.target;
    // let category = button.classList[0];
    let item = button.value;
    if (itemMap[item]) {
        button.style.background = ITEM_ON_HOVER;
    }
    else {
        button.style.background = ITEM_OFF_HOVER;
    }
}

function lighten(e) {
    let button = e.target;
    // let category = button.classList[0];
    let item = button.value;
    if (itemMap[item]) {
        button.style.background = ITEM_ON;
    }
    else {
        button.style.background = ITEM_OFF;
    }
}

function toggleElement(e) {
    // get obj type. e.g. head, face, etc
    let button = e.target;
    let category = button.classList[0];
    let item = button.value;
    // console.log("button value: " + button.value);

    // if there is an obj
    if (itemMap[item]) {
        // console.log("app.js - remove");
        itemMap[item] = 0;
        // button.style.background = ITEM_OFF;
        button.style.textDecoration = "line-through";
    }
    else {
        // console.log("app.js - add");
        itemMap[item] = 1;
        // button.style.background = ITEM_ON;
        button.style.textDecoration = "none";
        // toggleChoices(category, item);
    }
    // scene.toggle(category, item);
    scene.toggle(item);

}

function toggleChoices(category, item) {
    let buttons = document.getElementsByClassName(category);
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].value == item) {
            buttons[i].style.background =ITEM_ON;
        }
        else {
            buttons[i].style.background = ITEM_OFF;
        }
    }
}