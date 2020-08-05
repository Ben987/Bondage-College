"use strict";
var renderer;
var scene;
var camera;
var model;
var group1;
var material;
var action;
var path3d;
var Draw3DEnabled = false;
var count = 0;

function Draw3DLoad() {
	init();
	document.body.appendChild(renderer.domElement);
	renderer.domElement.style.display = "none";
}
function Draw3DKeyDown() {
	if ((KeyPress == 51) && (CurrentScreen == "MainHall") && (CurrentCharacter == null)) Draw3DEnable(!Draw3DEnabled);
	if (Draw3DEnabled) {
		if ((KeyPress == 81) || (KeyPress == 113)) Strip3Dmodel(group1.children, count-- );//update3Dmodel(group1);
		if ((KeyPress == 69) || (KeyPress == 101)) group1.rotation.y += 0.1;
		if ((KeyPress == 65) || (KeyPress == 97)) group1.position.x -= 1;
		if ((KeyPress == 68) || (KeyPress == 100)) group1.position.x += 1;
		if ((KeyPress == 87) || (KeyPress == 119)) group1.position.z -= 1;
		if ((KeyPress == 83) || (KeyPress == 115)) group1.position.z += 1;
	}
}

// TODO: create more fbx assets <.<
// TODO: seperate all fbx files
// TODO: call each 3d asset and transform x,y towards the next bone node(point)
function init(){

	var animspath = "Assets/3D/1animation/";
	var anims = ["Standing", "Walk", "WalkBack"];

	path3d = "Assets/3D/";

	var itemgroup = ["HairBack/Back Hair 1", "HairFront/Front Hair 1","Eyes/BlueEyes 1","BodyUpper/Pale Skin",  "Cloth/TopMaid","Panties/PantieMaid", "Bra/MaidBra", "ItemNeck/MaidCollar", "Shoes/HighHeels"];


	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true  });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);



  // clock = new THREE.Clock();

  group1 = new THREE.Group();
	count = -1;
	light();
		for (let i of itemgroup){
			count += 1;
			let loader = new THREE.FBXLoader();
				loader.load(`${path3d}${i}.fbx`,function( object ) {
					model = object;
					model.name = i;

					// model.group = i;
					// model.mixer = new THREE.AnimationMixer(model);
					// model.mixer.root = model.mixer.getRoot();

					color2("#0c3863", i);
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

//light section
function light(){

	let directlight = new THREE.DirectionalLight( 0xbbbbbb, 0.5);
	directlight.position.set( 0, 2000, 100 );
	directlight.castShadow = true;
	scene.add( directlight );

	let ambientLight = new THREE.AmbientLight(0xffffff, 1);
	ambientLight.castShadow = true;
	ambientLight.position.set(200, 2000, 200);
	scene.add(ambientLight);
}

//set color
function color2(hexcolor){
	model.traverse( function ( child ) {
		if ( child.isMesh ) {
				if (model.name == "HairBack/Back Hair 1" || model.name == "HairFront/Front Hair 1"){
				// if (grpname  == "BackHair" || grpname == "FrontHair" || grpname == "Shoes"){
					child.castShadow = true;
					child.receiveShadow = true;
					child.material = new THREE.MeshPhongMaterial( {
						color: hexcolor, // hair color
						wireframe: false,
						// map:
					} );
				}else {
					child.castShadow = true;
					child.receiveShadow = true;
				}
		 }
	} );
}

//strip the model
function Strip3Dmodel(models, i){
	if (i <= -1){
		console.log("I can't strip further");
	}else {
		if (models[i].name !== "BodyUpper/Pale Skin" && models[i].name !== "Eyes/BlueEyes 1" && models[i].name !== "HairBack/Back Hair 1" && models[i].name !== "HairFront/Front Hair 1" ) group1.remove(models[i]);
	}
}


// function update3Dmodel (models){
// 	path3d = "Assets/3D/";
// 	group1.remove(models);
// 	let chale = Character[0].Appearance.length;
// 	for(let i = 0; i < chale; i++){
// 		let grpname =	Character[0].Appearance[i].Asset.DynamicGroupName;
// 		let itemname = Character[0].Appearance[i].Asset.Name;
// 		let itemcolor = Character[0].Appearance[i].Color;
// 		if (grpname == "BodyUpper" && itemcolor == "Black") itemname = "Dark Skin";
// 		if (grpname == "BodyUpper" && itemcolor == "White") itemname = "Pale Skin";
// 		if (grpname == "BodyUpper" && itemcolor == "Asian") itemname = "Light Skin";
// 		let loader = new THREE.FBXLoader();
// 		loader.load(`${path3d}${grpname}/${itemname}.fbx`, function( object ) {
// 				model = object;
//				model.name = itemname;
//				model.group = grpname;
// 				color2(itemcolor, grpname);
// 				group1.add(model);
//
// 			},
// 			undefined,
// 			function( error ) {
// 				console.log(error);
// 			}
// 		);
// 	}
// 		scene.add(group1);
// }

//
// function delete3dassets(group1, i){
// 	let selectedmodel = scene.getObjectByName;
// 	for(let o of group1){
// 		if ( o == selectedmodel){
// 			scene.remove(selectedmodel(i));
// 		}
// 	}
// }


// 3d enviourment
// function env(loader){
// 	loader.load(`${path3d}${}.fbx`, function(object){
// 		env = object;
// 		env.castShadow = true;
// 		env.receiveShadow = true;
// 	});
// }

// function animations(loader){
//
//
// }
// function animate(){
// 	requestAnimationFrame(animate);
// }
