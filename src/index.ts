import { KeyDisplay } from './utils';
import { CharacterControls } from './characterControls';
import * as THREE from 'three'
import { CameraHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import connect from "./Connect.js";
import { mode } from '../webpack.config';

// import anurag from "./img/anurag.png"
// import abhay from './img/abhay.png'
// import abhinav from './img/abhinav.png'
// import anshika from './img/anshika.png'
// import apoorv from './img/apoorv.png'
// import deghpreet from './img/deghpreet.png'
// import jess from './img/jess.png'
// import jivraj from './img/jivraj.png'

const imageList =[
  '/img/jess.png',
  '/img/abhay.png',
  '/img/anurag.png',
  '/img/abhinav.png',
  '/img/anshika.png',
  '/img/apoorv.png',
  '/img/deghpreet.png',
  '/img/jivraj.png',
]
// const imageList =[
//   jess,
//   abhay,
//   anurag,
//   abhinav,
//   anshika,
//   apoorv,
//   deghpreet,
//   jivraj
// ]
const openSeaURL =[
  'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/104206034018960734157227822297469707953732132324313266366585641666534577274881',
  'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/104206034018960734157227822297469707953732132324313266366585641667634088902657',
  'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/104206034018960734157227822297469707953732132324313266366585641668733600530433',
  'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/104206034018960734157227822297469707953732132324313266366585641674231158669313',
  'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/104206034018960734157227822297469707953732132324313266366585641673131647041537',
  'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/104206034018960734157227822297469707953732132324313266366585641669833112158209',
  'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/104206034018960734157227822297469707953732132324313266366585641672032135413761',
  'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/104206034018960734157227822297469707953732132324313266366585641675330670297089'
]

// custom global variables
var targetList = [];

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 0;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true
orbitControls.minDistance = 5
orbitControls.maxDistance = 15
orbitControls.enablePan = false
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
orbitControls.update();

// LIGHTS
light()

// FLOOR
generateFloor()

// WEB3

connect.then((result) => {
    // console.log(result);
    result.buildings.forEach( (b:any, index:any) => {
      if (index <= result.supply) {
        // const jeffTexture = new THREE.TextureLoader().load('./img/abhay.png');
        const jeffTexture = new THREE.TextureLoader().load(imageList[index-1]);
        const boxGeometry = new THREE.BoxGeometry(b.w, b.h, b.d);
        // const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        // const box = new THREE.Mesh(boxGeometry, boxMaterial);
        const box = new THREE.Mesh(
                    boxGeometry, 
                    new THREE.MeshBasicMaterial({ map: jeffTexture })
                    );
        box.position.set(b.x, b.y, b.z);
        box.userData = { URL: openSeaURL[index-1]};
        targetList.push(box);
        scene.add(box);
     }
    });
  });

// MODEL WITH ANIMATIONS
var characterControls: CharacterControls
new GLTFLoader().load('models/Soldier.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
    });
    scene.add(model);

    const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap: Map<string, THREE.AnimationAction> = new Map()
    gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a))
    })

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera,  'Idle')
});

new GLTFLoader().load('models/Flamingo.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.03,0.03,0.03)
    model.position.set(6,5,-4)

    scene.add(model);
});

new GLTFLoader().load('models/SheenChair.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(1.2,1.2,1.2)
    model.position.set(3,0,-4)

    scene.add(model);
});

new GLTFLoader().load('models/Horse.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(.01,.01,.01)
    model.position.set(9,0,-4)
    model.rotateY(2)

    scene.add(model);
});

new GLTFLoader().load('models/Xbot.glb', function (gltf) {
    const model = gltf.scene;
    // model.scale.set(.01,.01,.01)
    model.position.set(8,5,8)
    model.rotateY(2)
    scene.add(model);
    });

    new GLTFLoader().load('models/collision-world.glb', function (gltf) {
    const model = gltf.scene;
    model.scale.set(2,2,2)
    model.position.set(6,0,9)
    model.rotateY(2)
    scene.add(model);
    });

// CONTROL KEYS
const keysPressed = {  }
const keyDisplayQueue = new KeyDisplay();
document.addEventListener('keydown', (event) => {
    keyDisplayQueue.down(event.key)
    if (event.shiftKey && characterControls) {
        characterControls.switchRunToggle()
    } else {
        (keysPressed as any)[event.key.toLowerCase()] = true
    }
}, false);
document.addEventListener('keyup', (event) => {
    keyDisplayQueue.up(event.key);
    (keysPressed as any)[event.key.toLowerCase()] = false
}, false);

const clock = new THREE.Clock();
// ANIMATE
function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyDisplayQueue.updatePosition()
}
window.addEventListener('resize', onWindowResize);

function generateFloor() {
    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load("./textures/placeholder/placeholder.png");
    const sandBaseColor = textureLoader.load("./textures/sand/Sand 002_COLOR.jpg");
    const sandNormalMap = textureLoader.load("./textures/sand/Sand 002_NRM.jpg");
    const sandHeightMap = textureLoader.load("./textures/sand/Sand 002_DISP.jpg");
    const sandAmbientOcclusion = textureLoader.load("./textures/sand/Sand 002_OCC.jpg");

    const WIDTH = 4
    const LENGTH = 4
    const NUM_X = 15
    const NUM_Z = 15

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
        {
            map: sandBaseColor, normalMap: sandNormalMap,
            displacementMap: sandHeightMap, displacementScale: 0.1,
            aoMap: sandAmbientOcclusion
        })
    // const material = new THREE.MeshPhongMaterial({ map: placeholder})

    for (let i = 0; i < NUM_X; i++) {
        for (let j = 0; j < NUM_Z; j++) {
            const floor = new THREE.Mesh(geometry, material)
            floor.receiveShadow = true
            floor.rotation.x = - Math.PI / 2

            floor.position.x = i * WIDTH - (NUM_X / 2) * WIDTH
            floor.position.z = j * LENGTH - (NUM_Z / 2) * LENGTH

            scene.add(floor)
        }
    }
}

function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(- 60, 100, - 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = - 50;
    dirLight.shadow.camera.left = - 50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}