"use strict";
let renderer;
let scene;
let camera;
let model;
var Draw3DEnabled = false;

function Draw3DLoad() {
	init();
	renderer.domElement.addEventListener("click", Click);
	renderer.domElement.addEventListener("touchstart", Touch);
	renderer.domElement.addEventListener("mousemove", MouseMove);
	renderer.domElement.addEventListener("mouseleave", LoseFocus);
	renderer.domElement.addEventListener("keydown", Draw3DKeyDown);
	document.body.addEventListener("keydown", Draw3DKeyDown);
	document.body.appendChild(renderer.domElement);
}

function Draw3DKeyDown(event) {
	var KeyCode = event.keyCode || event.which;
	if ((KeyCode == 51) && (CurrentScreen == "MainHall") && (CurrentCharacter == null)) Draw3DEnable(!Draw3DEnabled);
	if ((KeyCode == 37) && Draw3DEnabled) model.rotation.y -= 0.1;
	if ((KeyCode == 39) && Draw3DEnabled) model.rotation.y += 0.1;
	if ((KeyCode == 38) && Draw3DEnabled) model.rotation.x -= 0.1;
	if ((KeyCode == 40) && Draw3DEnabled) model.rotation.x += 0.1;
}

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1, 1000);



	let light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 2000, 100 );
	light.castShadow = true;
	scene.add( light );

	renderer = new THREE.WebGLRenderer({  alpha : true });
	renderer.setSize(window.innerWidth, window.innerHeight);

	//when we load an env.
	// renderer.shadowMap.enabled = false;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	// renderer.shadowMapDebug = true;

	let ambientLight = new THREE.AmbientLight(0xffffff);
	ambientLight.castShadow = true;
	ambientLight.position.set(200,2000,200);
	scene.add(ambientLight);

    let loader = new THREE.FBXLoader();
    loader.load('Assets/3D/fbx/maid.fbx',
				function( object ) {
					model = object;
					// animation
					// model.mixer = new THREE.AnimationMixer(object);
					// model.mixer = object.mixer;
					// model.root = object.mixer.getRoot();

					model.castShadow = true;
					model.reciveShadow = true;

					model.traverse( function (child){
						if (child.isMesh){
							child.castShadow = true;
							child.reciveShadow = true;
						}
					});
					//object.scale.set(0.01, 0.01, 0.01);
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
