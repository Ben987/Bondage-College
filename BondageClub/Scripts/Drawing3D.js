"use strict";
var renderer;
var scene;
var camera;
var model;
var group1;
var material;
var path3d = "Assets/3D/";
var Draw3DEnabled = false;
var count = 0;
var count1 = 0;
var maid, textures, webpath;
var strip3D;
var d2tod3,second;
var mixer;

function Draw3DLoad() {
	init();
	document.body.appendChild(renderer.domElement);
	renderer.domElement.style.display = "none";
}
function Draw3DKeyDown() {
	if ((KeyPress == 51) && (CurrentScreen == "MainHall") && (CurrentCharacter == null)) Draw3DEnable(!Draw3DEnabled);
	if (Draw3DEnabled) {
		if ((KeyPress == 81) || (KeyPress == 113)) character3D.rotation.y -= 0.1;
		if ((KeyPress == 69) || (KeyPress == 101)) character3D.rotation.y += 0.1;
		if ((KeyPress == 65) || (KeyPress == 97))  character3D.position.x -= 1;
		if ((KeyPress == 68) || (KeyPress == 100)) character3D.position.x += 1;
		if ((KeyPress == 87) || (KeyPress == 119)) character3D.position.z -= 1;
		if ((KeyPress == 83) || (KeyPress == 115)) character3D.position.z += 1;
		if ((KeyPress == 90) || (KeyPress == 122)) dress3DModels(group1,path3d, count1++);
		if ((KeyPress == 88) || (KeyPress == 120)) Strip3Dmodel(group1.children, count--);
	}
}

// TODO: create more fbx assets <.<
// TODO: seperate all fbx files
// TODO: call each 3d asset and transform x,y towards the next bone node(point)
function init(){

	var animspath = "Assets/3D/1animation/";
	var anims = ["Standing", "Walk", "WalkBack"];

	var _mixers = [];
	var itemgroup = ["HairBack/HairBack1", "HairFront/HairFront6","Eyes/BlueEyes 1","BodyUpper/Pale Skin1",  "Cloth/MaidOutfit1","Panties/MaidPanties1", "Bra/MaidBra", "ItemNeck/MaidCollar", "Shoes/Heels1"];


	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true  });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
  // window.addEventListener( 'resize', onWindowResize, false );
  // clock = new THREE.Clock();
  light();
  group1 = new THREE.Group();
	count = -1;

	character3D = new THREE.Group();
count = -1;
light();
	for (let i of itemgroup){
		count += 1;
		let subst = i.indexOf("/");
		let grpname = i.slice(0, subst);
		let itemname = i.slice(subst +1);
		var itemcolor = "#c21e56";
		// if (grpname == "BodyUpper"){
		Loadassets(character3D,path3d,grpname, itemcolor, itemname);


 }
scene.add(character3D);
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



//strip the model
function Strip3Dmodel(models, i){
	if (second == true && models.length <= 4 || i == -1){
			console.log("can't strip further");
	}else {

		if (models[i].group !== "BodyUpper" && models[i].group !== "Eyes" && models[i].group !== "HairBack" && models[i].group !== "HairFront"){
			character3D.remove(models[i]);
			console.log(i);
			count1 = 0;
			strip3D = true;
			if (d2tod3 == true){
				maid = false;
			}else {
				maid = true;
			}
		}
	}
}

function dress3DModels(group, path3d, j){
	if ( strip3D == true){
		if(maid == true ){
			var group2 = [ "Panties/MaidPanties1", "Bra/MaidBra", "ItemNeck/MaidCollar", "Shoes/Heels1" ,"Cloth/MaidOutfit1"];
				// let group12 = group2.length;
				if (j < 5){
				var subst = group2[j].indexOf("/");
				var grpname = group2[j].slice(0, subst);
				var itemcolor = "#ADD8E6";
				var itemname = group2[j].slice(subst +1);
				Loadassets(group ,path3d ,grpname, itemcolor, itemname, );
				scene.add(group);
				second = true;
				count = character3D.children.length;
			}else {
				console.log("Dressed!")
			}
		}else {
			console.log(j);
			var group2 = Character[0].Appearance.length -1;
			console.log(count1);
			if (j < group2){
				var grpname =	Character[0].Appearance[j].Asset.DynamicGroupName;
				var itemname = Character[0].Appearance[j].Asset.Name;
				var itemcolor = Character[0].Appearance[j].Color;
				assetexist(group,path3d, grpname,itemcolor, itemname);
				scene.add(group);
				second = true;
				count = character3D.children.length - 1;
			}else{
				console.log("Dressed!");
			}
		}
	}else {
		console.log("");
	}
}

// function set character 2d to 3d asset
function refresh3DModel (group, path3d, count){
	scene.remove(group);
	let characternames = Character[0].Name;
	character3D = new THREE.Group();
	character3D.name = characternames;
	let chale = Character[0].Appearance.length ;
	for(let i = 0; i < chale; i++){
		let grpname =	Character[0].Appearance[i].Asset.DynamicGroupName;
		let itemname = Character[0].Appearance[i].Asset.Name;
		let itemcolor = Character[0].Appearance[i].Color;
		if (grpname == "BodyUpper" && itemcolor == "Black") itemname = "Dark Skin";
		if (grpname == "BodyUpper" && itemcolor == "White") itemname = "Pale Skin";
		if (grpname == "BodyUpper" && itemcolor == "Asian") itemname = "Light Skin1";
		let neweyes = itemname.slice(0, 4);
		if (neweyes == "Eyes") itemname = "BlueEyes 1"; // TODO: change and ask for color range
		let newhair = itemname.slice(-1);
		if (grpname == "HairFront" && newhair == "b") itemname = itemname.slice(0, -1);
		if (itemname == "HairBack23") itemname = "HairBack24";
		Loadassets(character3D, path3d, grpname, itemcolor, itemname);

	}
	scene.add(character3D);
	second = false;
	maid = false;
	strip3D = false;
	d2tod3 = true;
	setTimeout(countz, 3000);
}
//delay the process  
function countz(){
	count = character3D.children.length -1;
}
//function load assets
function Loadassets(character3D, path3d, grpname, itemcolor, itemname){
	var loader = new THREE.FBXLoader();
	loader.load(`${path3d}${grpname}/${itemname}.fbx`,function( object ) {
		model = object;
		model.name = itemname;
		model.type = grpname;

		set3DColorandTexture(itemcolor, grpname, itemname, path3d);

		character3D.add(model);

		},
		undefined,
		function( error ) {
			console.log(error);
		}
	);
}
//set color
function set3DColorandTexture(hexcolor,grpname , itemname, path3d){
	let loader = new THREE.TextureLoader();

	if (hexcolor == "Default") hexcolor = "#C0C0C0";
	// ask how many and if texture exists
	let texturelist = 0;
	let texturecount = 0;
	let http = new XMLHttpRequest();
	while ( texturecount < 9 ){
		var zero = `${webpath}${path3d}${grpname}/${itemname}${textut}.bmp`;
		texturecount += 1;
		http.open('HEAD', zero, false);
		http.send();
		if (http.status === 200 )texturelist += 1;
	}
	for (let i = 0; i < texturelist; i++ ){
		textures = loader.load(`${path3d}${grpname}/${itemname}${i}.bmp`);
	}

	model.traverse( function ( child ) {
		if ( child.isMesh ) {
				 if (grpname !== "BodyUpper" && grpname !== "Eyes"){
							 if(textures !== undefined){
								child.castShadow = true;
								child.receiveShadow = true;
								child.material = new THREE.MeshPhongMaterial( {
								 name: `${itemname}_Mesh`,
								 map: textures,
								 color:hexcolor,
								 wireframe: false,
							 } );
						}
				}else {
					child.castShadow = true;
					child.receiveShadow = true;
				}
		 }
	});
}

function assetexist(group,path3d, grpname,itemcolor, itemname){
	var asset3D = [];
	var assetleng = character3D.children.length;
	for (var k = 0; k < assetleng; k++ ){
		var chargroup = character3D.children[k].group;
		asset3D.push(chargroup);
	}
	var asset3Dexist = asset3D.includes(grpname);
	if (asset3Dexist != true) Loadassets(group,path3d, grpname,itemcolor, itemname);
}

// TODO: create animation
// TODO: change the current animation

// function animat(model1, grpname){
// 	var animspath = "Assets/3D/1animation/";
// 	var anims = "Standing";
// 	var amountB = 0;
// 	const anim = new THREE.FBXLoader();
// 	anim.load(`${animspath}${anims}.fbx`, function(model){
// 		if (model1 !== "BodyUpper"){
// 			for (let j = 0; j < 10; j++){
// 				let animationrange = model.animations[j].name;
// 				let modelboner = model1.animations[j].name;
// 				if (modelboner == animationrange){
// 					var modelname =	model.animations[i];
// 					let model1anim = model1.animations;
// 					model1anim.push(modelname);
// 				}else{
//
// 				}
//
// 		var mixer = new THREE.AnimationMixer(model1);
// 		var action = mixer.clipAction(model1.animations[0]);
// 		action.play();
//
//
// 		},
// 		undefined,
// 		function( error ) {
// 			console.log(error);
// 	});
// }

// animate model
// function animate() {
// 		requestAnimationFrame( animate );
// 		var delta = clock.getDelta();
// 		if ( mixer ) mixer.update( delta );
// 		renderer.render( scene, camera );
//
// }

// 3d enviourment
// function env3D(loader){
// 	loader.load(`${path3d}${env}.fbx`, function(object){
// 		env = object;
// 		env.castShadow = true;
// 		env.receiveShadow = true;
// 	});
// }
