"use strict";
let renderer;
let scene;
let camera;
let model;
var Draw3DEnabled = false;

function Draw3DLoad() {
	// const path3d =  "/Assets/3D/fbx/items/";
	// //list all item folders
  // const pathitem = ["arms", "back hair", "bra", "eyes", "front hair", "head"
	// 									,"neck", "pantie", "shoes", "skin", "skirt", "socks", "Tail"
	// 									, "top"	];
	init();
	MainCanvas.canvas.appendChild(renderer.domElement);
}

function Draw3DKeyDown(event) {
	if ((KeyPress == 51) && (CurrentScreen == "MainHall") && (CurrentCharacter == null)) Draw3DEnable(!Draw3DEnabled);
	if ((KeyPress == 37) && Draw3DEnabled) model.rotation.y -= 0.1;
	if ((KeyPress == 39) && Draw3DEnabled) model.rotation.y += 0.1;
	if ((KeyPress == 38) && Draw3DEnabled) model.rotation.x -= 0.1;
	if ((KeyPress == 40) && Draw3DEnabled) model.rotation.x += 0.1;
}

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1, 1000);
// 	Google Chrome newest version.
// Version 83.0.4103.116 Offical Build) (64-Bit)
//
// my fbx model is now inside the pmd folder.(maybe it was a problem, i'm not sure)
//
// test 1:
// i've deleted all light section execpt the ambientLight.
// please, change the model from Assets/3D/fbx/pmd/0intro/intro1.fbx to Assets/3D/Rin/Rin1.fbx, to see if one of them works.
// both model work ?
// when both models are working just fine. we know that's the second light and probably third light section is the problem.
// when only your model works.(mmm, my model sucks ... <.<)
//
// test 2 :
// i've added a second and a third light section.
// please, change the model from Assets/3D/fbx/pmd/0intro/intro1.fbx to Assets/3D/Rin/Rin1.fbx, to see if one of them works.
// i bet my model isn't working but i'm curious if your model works.
// when your model works( something must be with my model.)

	renderer = new THREE.WebGLRenderer({  alpha : true });
	renderer.setPixelRatio(window.devicePixelRatio); //add
	renderer.setSize(window.innerWidth, window.innerHeight);

	let light = new THREE.DirectionalLight( 0xffffff, 0.5); //add
	light.position.set( 0, 2000, 100 );//add
	light.castShadow = true;//add
	scene.add( light );//add

	let light1 = new THREE.PointLight(0xffffff);
	light1.castShadow = true;
	scene.add(light1);

	let ambientLight = new THREE.AmbientLight(0xffffff,1);
  ambientLight.castShadow = true;
  ambientLight.position.set(200,2000,200);
  scene.add(ambientLight);

    let loader = new THREE.FBXLoader();
    loader.load('Assets/3D/fbx/pmd/0intro/intro1.fbx',
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
