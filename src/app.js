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

var FLOWER = 0;
const HEAD = "head";
const FACE = "face";
const BODY = "body";
const LEGS = "legs";
const BASE = "base";
const ACC = "acc";

const BACKGROUND = new Color("rgb(255, 243, 175)");
const TYPE_ON = "rgba(255, 217, 0, 0.8)";
const TYPE_OFF = "transparent";
const TYPE_ON_HOVER = "rgba(255, 217, 0, 1.0)";
const TYPE_OFF_HOVER = "rgba(255, 232, 103, 0.7)";

var typeMap = {
    "head": "",
}

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(0, 3, -20);
camera.lookAt(new Vector3(0, 0, 0));

scene.background = BACKGROUND;

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
for (let i = 0; i < choices.length; i++) {
    choices[i].addEventListener("click", toggleElement);
    choices[i].addEventListener("mouseover", darken);
    choices[i].addEventListener("mouseout", lighten);
}

function darken(e) {
    let button = e.target;
    let category = button.classList[0];
    let type = button.value;
    if (typeMap[category] == type) {
        button.style.background = TYPE_ON_HOVER;
    }
    else {
        button.style.background = TYPE_OFF_HOVER;
    }
}

function lighten(e) {
    let button = e.target;
    let category = button.classList[0];
    let type = button.value;
    if (typeMap[category] == type) {
        button.style.background = TYPE_ON;
    }
    else {
        button.style.background = TYPE_OFF;
    }
}

function toggleElement(e) {
    // get obj type. e.g. head, face, etc
    let button = e.target;
    let category = button.classList[0];
    let type = button.value;
    console.log("button value: " + button.value);

    // if there is an obj
    if (typeMap[category] == type) {
        console.log("remove");
        clearType(category);
        typeMap[category] = "";
        button.style.background = "transparent";
    }
    else {
        console.log("add");
        addType(button.value, category);
        typeMap[category] = type;
        toggleChoices(category, type);
    }
}

function clearType(category) {
    if (category == HEAD) {
        scene.head.clear();
    }
}

function addType(type, category) {
    clearType(category);
    if (category == HEAD) {
        scene.head.addObject(type, scene.head);
    }
}

function toggleChoices(category, type) {
    let buttons = document.getElementsByClassName(category);
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].value == type) {
            buttons[i].style.background = TYPE_ON;
        }
        else {
            buttons[i].style.background = TYPE_OFF;
        }
    }
}