"use strict";
var renderer;
var scene;
var camera;
var model;
var group1;
var material;
var Draw3DEnabled = false;

function Draw3DLoad() {


	// const animations = ["LookAround", "Move", "StumbleBackWards"];

	init();
	// update3D();
	document.body.appendChild(renderer.domElement);
	renderer.domElement.style.display = "none";
}

function Draw3DKeyDown() {
	if ((KeyPress == 51) && (CurrentScreen == "MainHall") && (CurrentCharacter == null)) Draw3DEnable(!Draw3DEnabled);
	if (Draw3DEnabled) {
		if ((KeyPress == 81) || (KeyPress == 113)) group1.rotation.y -= 0.1;
		if ((KeyPress == 69) || (KeyPress == 101)) group1.rotation.y += 0.1;
		if ((KeyPress == 65) || (KeyPress == 97)) group1.position.x -= 1;
		if ((KeyPress == 68) || (KeyPress == 100)) group1.position.x += 1;
		if ((KeyPress == 87) || (KeyPress == 119)) group1.position.z -= 1;
		if ((KeyPress == 83) || (KeyPress == 115)) group1.position.z += 1;
		// if ((KeyPress == 67) || (KeyPress == 107)) switchcamera();
	}
}
// TODO: load all fbx files when the player is already logged in
// TODO: create more fbx assets <.<
// TODO: seperate all fbx files by using the clone function
// TODO: assign all 2D asset names to the 3D asset path
// TODO: walk animation
function init(){
	var path3d = "Assets/3D/fbx/pmd/";
	var itemgroup = ["Back Hair/Back Hair 1", "Front Hair/Front Hair 1","Eyes/BlueEyes 1", "Skin/Dark Skin","Top/Maid Top 1"];
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
	renderer = new THREE.WebGLRenderer({  alpha : true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

  group1 = new THREE.Group();
	light();
		for (let i of itemgroup){
			let loader = new THREE.FBXLoader();
				loader.load(`${path3d}${i}.fbx`,function( object ) {
				  console.log(`${path3d}${i}.fbx`);
					model = object;
					group1.add(model); //merge all fbx files
					object.traverse( function ( child ) {
						if ( child.isMesh ) {
								if (i == "Back Hair/Back Hair 1" || i == "Front Hair/Front Hair 1"){
									child.castShadow = true;
									child.receiveShadow = true;
									child.material = new THREE.MeshPhongMaterial( {
									color: 0x0c3863, // hair color
									wireframe: false,
									} );
								}else {
								child.castShadow = true;
								child.receiveShadow = true;
								}
							}
						} );
					},
					undefined,
					function( error ) {
						console.log(error);
					}
			);
		}
		scene.add(group1);
	}

function Draw3DEnable(Enable) {
	Draw3DEnabled = Enable;
	renderer.domElement.style.display = (Enable) ? "" : "none";
}

function Draw3DProcess() {
	if (Draw3DEnabled && (group1 != null)) {
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
function light(){
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
// function switchcamera(fade 0.5){
// 	let camera = new THREE.PerspectiveCamera();
// 	camera.position.set(0,200,0);
// }

// function anima(){
// 	const action = new THREE.new THREE.AnimationClip(anims, model.mixer.root);
// 	action.Play();
// }
