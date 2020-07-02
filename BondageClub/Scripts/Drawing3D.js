"use strict";
var renderer;
var scene;
var camera;
var model;
var Draw3DEnabled = false;

function Draw3DLoad() {
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000);
	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize(2000, 1000);
	renderer.domElement.style.visibility = Draw3DEnabled ? "visible" : "hidden";
	//renderer.setClearColor(0x000000, 0);
	document.body.appendChild(renderer.domElement);

	//scene.background = new THREE.Color(0xf1f1f1);
	scene.background = null;
	var ambientLight = new THREE.AmbientLight(0xffffff, 1.0 );
	scene.add(ambientLight);
						
    var loader = new THREE.FBXLoader();
    loader.load('Assets/3D/Rin/Rin1.fbx',
				function( object ) {
					model = object;
					//object.scale.set(0.01, 0.01, 0.01);
    				scene.add(object);
    			},
				undefined,
				function( error ) {
					console.log(error);
				}
    );

	renderer.domElement.addEventListener("click", Click);
	renderer.domElement.addEventListener("touchstart", Touch);
	renderer.domElement.addEventListener("mousemove", MouseMove);
	renderer.domElement.addEventListener("mouseleave", LoseFocus);
	renderer.domElement.addEventListener("keydown", Draw3DKeyDown);
	document.body.addEventListener("keydown", Draw3DKeyDown);

}

function Draw3DKeyDown(event) {
	var KeyCode = event.keyCode || event.which;
	if ((KeyCode == 51) && (CurrentScreen == "MainHall") && (CurrentCharacter == null)) Draw3DEnable(!Draw3DEnabled);
	if ((KeyCode == 37) && Draw3DEnabled) model.rotation.y -= 0.1;
	if ((KeyCode == 39) && Draw3DEnabled) model.rotation.y += 0.1;
}

function Draw3DEnable(Enable) {
	Draw3DEnabled = Enable;
	renderer.domElement.style.visibility = Enable ? "visible" : "hidden";
	renderer.clear();
}

function Draw3DProcess() {
	if (Draw3DEnabled && (model != null)) {
		if (CurrentScreen != "MainHall") Draw3DEnable(false);
		if (CurrentCharacter != null) Draw3DEnable(false);
		if (renderer.domElement.style.width != "100%") {
			renderer.domElement.style.width = "100%";
			renderer.domElement.style.height = "";
		}
		if (Draw3DEnabled) renderer.render(scene, camera);
	}
}

function Draw3DCharacter(C, X, Y, Zoom, IsHeightResizeAllowed) {
	camera.position.set(0, 90, 250);
}