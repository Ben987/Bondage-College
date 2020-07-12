"use strict";
let renderer;
let scene;
let camera;
let model;
var Draw3DEnabled = false;

function Draw3DLoad() {

	init();
	document.body.appendChild(renderer.domElement);
	renderer.domElement.style.display = "none";
}

function Draw3DKeyDown() {
	if ((KeyPress == 51) && (CurrentScreen == "MainHall") && (CurrentCharacter == null)) Draw3DEnable(!Draw3DEnabled);
	if (Draw3DEnabled) {
		if ((KeyPress == 81) || (KeyPress == 113)) model.rotation.y -= 0.1;
		if ((KeyPress == 69) || (KeyPress == 101)) model.rotation.y += 0.1;
		if ((KeyPress == 65) || (KeyPress == 97)) model.position.x -= 1;
		if ((KeyPress == 68) || (KeyPress == 100)) model.position.x += 1;
		if ((KeyPress == 87) || (KeyPress == 119)) model.position.z -= 1;
		if ((KeyPress == 83) || (KeyPress == 115)) model.position.z += 1;
	}
}

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
	renderer = new THREE.WebGLRenderer({  alpha : true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	light();

    let loader = new THREE.FBXLoader();
    loader.load('Assets/3D/fbx/pmd/maid/maid.fbx',
				function( object ) {
					model = object;
					scene.add(model);
    			},
				undefined,
				function( error ) {
					console.log(error);
				}
    );
}

function Draw3DEnable(Enable) {
	Draw3DEnabled = Enable;
	renderer.domElement.style.display = (Enable) ? "" : "none";
}

function Draw3DProcess() {
	if (Draw3DEnabled && (model != null)) {
		if (document.activeElement.id != "MainCanvas") MainCanvas.canvas.focus();
		if (CurrentScreen != "MainHall") return Draw3DEnable(false);
		if (CurrentCharacter != null) return Draw3DEnable(false);
		if (renderer.domElement.style.width != "100%") {
			renderer.domElement.style.width = "100%";
			renderer.domElement.style.height = "";

		}
		renderer.render(scene, camera);
	}
}

function Draw3DCharacter(C, X, Y, Zoom, IsHeightResizeAllowed) {
	camera.position.set(0, 80, 300);
}

function light() {
	//light section
	let directlight = new THREE.DirectionalLight( 0xbbbbbb, 0.5); //add
	directlight.position.set( 0, 2000, 100 );//add
	directlight.castShadow = true;//add
	scene.add( directlight );//add

	let ambientLight = new THREE.AmbientLight(0xffffff, 1);
	ambientLight.castShadow = true;
	ambientLight.position.set(200, 2000, 200);
	scene.add(ambientLight);
}
