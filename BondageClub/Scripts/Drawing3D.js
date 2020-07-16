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
		if (KeyPress == 73) update3Dmodel(group1, path3d); // press i
	}
}
// TODO: load all fbx files when the player is already logged in
// TODO: create more fbx assets <.<
// TODO: seperate all fbx files by using the clone function
// TODO: assign all 2D asset names to the 3D asset path
// TODO: walk animation
function init(){
	var animations = ["Standing", "Walk", "WalkBack"];
	var path3d = "Assets/3D/";
	var itemgroup = ["HairBack/Back Hair 1", "HairFront/Front Hair 1","Eyes/BlueEyes 1", "BodyUpper/Dark Skin","Cloth/Maid Top 1"]; //load paleskin
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
					// if ( i == "BodyUpper/ ")
					model = object;
					color2(0x0c3863, i);
					group1.add(model); //merge all fbx files
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
	let directlight = new THREE.DirectionalLight( 0xbbbbbb, 0.5);
	directlight.position.set( 0, 2000, 100 );
	directlight.castShadow = true;
	scene.add( directlight );

	let ambientLight = new THREE.AmbientLight(0xffffff, 1);
	ambientLight.castShadow = true;
	ambientLight.position.set(200, 2000, 200);
	scene.add(ambientLight);
}

function color2(hexcolor, i){
	model.traverse( function ( child ) {
		if ( child.isMesh ) {
				if (i == "HairBack/Back Hair 1" || i == "HairFront/Front Hair 1"){
				// if (grpname  == "BackHair" || grpname == "FrontHair" ){
					child.castShadow = true;
					child.receiveShadow = true;
					child.material = new THREE.MeshPhongMaterial( {
						color: hexcolor, // hair color
						wireframe: false,
					} );
				}else {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			}
		} );
}

function update3Dmodel (group1, path3d){
	// scene.clone(group1);
	scene.remove(group1);
	let chale = Character[0].Appearance.length;
	for(let i = 0; i < chale; i++){
		let grpname =	Character[0].Appearance[i].Asset.DynamicGroupName;
		let itemname = Character[0].Appearance[i].Asset.Name;
		let itemcolor = Character[0].Appearance[i].Color;
		if (grpname == "BodyUpper" && itemcolor == "Black") itemname = "Dark Skin";
		if (grpname == "BodyUpper" && itemcolor == "White") itemname = "Pale Skin";
		if (grpname == "BodyUpper" && itemcolor == "Asian") itemname = "Light Skin";
		let loader = new THREE.FBXLoader();
			loader.load(`${path3d}${grpname}/${itemname}.fbx`, function( object ) {
				model = object;
				color2(itemcolor, grpname);
				group1.add(model);

			},
			undefined,
			function( error ) {
				console.log(error);
			}
		);
  }
		scene.add(group1);
}
// function animate (){
//
// }
