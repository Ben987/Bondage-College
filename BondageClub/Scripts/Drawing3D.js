"use strict";
var renderer;
var scene;
var camera;
var model;
var character3D, chanames;
var material;
var path3d = "Assets/3D/";
var Draw3DEnabled = false;
var count = 0;
var count1 = 0;
var textures, webpath;
var strip3D;
var d2tod3,second, maid = true;
var mixer;


function Draw3DLoad() {
	var anims = ["Standing", "Walking", "Walking Backwards"];
	var clock = new THREE.Clock();
	init();
	// animate();
	document.body.appendChild(renderer.domElement);
	renderer.domElement.style.display = "none";
}

function Draw3DKeyDown() {
	if ((KeyPress == 51) && (CurrentScreen == "MainHall") && (CurrentCharacter == null)) Draw3DEnable(!Draw3DEnabled);
	if (Draw3DEnabled) {
		if ((KeyPress == 81) || (KeyPress == 113)) character3D.rotation.y -= 0.1;
		if ((KeyPress == 69) || (KeyPress == 101)) character3D.rotation.y += 0.1;
		if ((KeyPress == 65) || (KeyPress == 97))  character3D.position.x -= 1, chanames.position.x -= 1, chanames.rotation.y += 0.004; //&& mesh.position.x -=1;
		if ((KeyPress == 68) || (KeyPress == 100)) character3D.position.x += 1, chanames.position.x += 1, chanames.rotation.y -= 0.004;
		if ((KeyPress == 87) || (KeyPress == 119)) refresh3DModel (character3D, path3d, count);
		if ((KeyPress == 83) || (KeyPress == 115)) character3D.position.z += 1, chanames.position.z += 1;
		if ((KeyPress == 90) || (KeyPress == 122)) dress3DModels(character3D, path3d, count1++);
		if ((KeyPress == 88) || (KeyPress == 120)) Strip3Dmodel(character3D.children, count--);
	}
}
// TODO: create more fbx assets
// TODO: call each 3d asset and transform x,y towards the next bone node(point)
function init(){
	var loca = window.location.href.slice(-10);
	if (loca == "index.html" ){
		webpath = window.location.href.slice(0, -10);
	}else{
		webpath = window.location.href;
	}

	var itemgroup = ["HairBack/HairBack1", "HairFront/HairFront6", "Eyes/BlueEyes1","BodyUpper/Pale Skin1",  "Cloth/MaidOutfit1","Panties/MaidPanties1", "Bra/MaidBra", "ItemNeck/MaidCollar", "Shoes/Heels1"];

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true  });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

  character3D = new THREE.Group();
  chanames = new THREE.Group();
	character3D.name = "Maid";
	light();
		for (let i of itemgroup){
			let subst = i.indexOf("/");
			let grpname = i.slice(0, subst);
			let itemname = i.slice(subst +1);
			var itemcolor = "#c21e56";
			// if (grpname == "BodyUpper"){
			Loadassets(character3D,path3d,grpname, itemcolor, itemname);
			charactername3D(path3d, chanames); //new

	 }
	scene.add(character3D);
	scene.add(chanames);
	setTimeout(countz, 3000);
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

	let directlight = new THREE.DirectionalLight( 0xbbbbbb, 1);
	directlight.position.set( 0, 2000, 100 );
	directlight.castShadow = true;
	scene.add( directlight );

	let ambientLight = new THREE.AmbientLight(0xffffff, 1);
	ambientLight.castShadow = true;
	ambientLight.position.set(200, 2000, 200);
	scene.add(ambientLight);
}

//set color
function set3Dcolor(hexcolor,grpname , itemname, path3d) {
	var texturecount  = 0;
	let loader = new THREE.TextureLoader();
	if (hexcolor == "Default") hexcolor = "#C0C0C0";

	// var data = JSON.parse(data); //hardcode texture amount ?
	let http = new XMLHttpRequest();
	// ask how many and if texture exists

	model.traverse( function ( child ) {
		if ( child.isMesh ) {
				 if (grpname !== "BodyUpper" && grpname !== "Eyes"){

					 while (texturecount < 9){
						 // old try
						 var zero = `${webpath}${path3d}${grpname}/${itemname}${texturecount}.bmp`;
					   http.open('Head', zero, false);
					 	 http.send();
						 // if (http.status == 404) 
						 if (http.status !== 200) break;

					 	 textures = loader.load(`${path3d}${grpname}/${itemname}${texturecount}.bmp`);
						 child.castShadow = true;
						 child.receiveShadow = true;
						 child.material = new THREE.MeshPhongMaterial( {
								 name: `${itemname}_Mesh` ,
								 map: textures,
								 color: hexcolor
							} );
							texturecount += 1;
						}
				}else {
					child.castShadow = true;
					child.receiveShadow = true;
				}
		 }
	});
}

//strip the model
function Strip3Dmodel(models, i){
	if ( second == true && models.length <= 4 || i == -1){
			console.log("can't strip further");
	}else {
		if (models[i].type !== "BodyUpper" && models[i].type !== "Eyes" && models[i].type !== "HairBack" && models[i].type !== "HairFront"){
			character3D.remove(models[i]);
			console.log(i);
			count1 = 0;
			strip3D = true;

		}
	}
}

function dress3DModels(group, path3d, j){
	if ( strip3D){
		if(maid == true){
			var group2 = [ "Panties/MaidPanties1", "Bra/MaidBra", "ItemNeck/MaidCollar", "Shoes/Heels1" ,"Cloth/MaidOutfit1"];
				if (j < 5){
				var subst = group2[j].indexOf("/");
				var grpname = group2[j].slice(0, subst);
				var itemcolor = "#ADD8E6";
				var itemname = group2[j].slice(subst +1);
				Loadassets(group ,path3d ,grpname, itemcolor, itemname);
				scene.add(group);
				second = true;
				count = character3D.children.length;
			}else {
				console.log("Dressed!")
			}
		}else {
			var group2 = Character[0].Appearance.length -1;
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
		console.log("Dressed!");
	}
}

function refresh3DModel (group1, path3d, count){
	scene.remove(group1);
	maid = false;
	let characternames = Character[0].Name;
	character3D = new THREE.Group();
	character3D.name = characternames;
	let chale = Character[0].Appearance.length ;
	for (let i = 0;i < chale; i){
		// jumpover3Daset
		var jumpoverasset = ["Blush", "BodyLower", "Emoticon", "Fluids", "Hands", "Mask",
		"Nipple","Pussy", "Wings", "Height",  "Mouth", "Nipples", "Eyes2","Eyebrows",
		"SuitLower","Suit", "Head"]; //
		var jumpover3Dasset = jumpoverasset.includes(Character[0].Appearance[i].Asset.DynamicGroupName);
		if (jumpover3Dasset ){
			i +=1;
		}else{
			let grpname =	Character[0].Appearance[i].Asset.DynamicGroupName;
			let itemname = Character[0].Appearance[i].Asset.Name;
			let itemcolor = Character[0].Appearance[i].Color;
			if (grpname == "BodyUpper" && itemcolor == "Black") itemname = "Dark Skin";
			if (grpname == "BodyUpper" && itemcolor == "White") itemname = "Pale Skin";
			if (grpname == "BodyUpper" && itemcolor == "Asian") itemname = "Light Skin1";
			let neweyes = itemname.slice(0, 4);
			if (neweyes == "Eyes") itemname = "BlueEyes1"; // TODO: change and ask for color range
			let newhair = itemname.slice(-1);
			if (grpname == "HairFront" && newhair == "b") itemname = itemname.slice(0, -1);
			if (itemname == "HairBack23") itemname = "HairBack24";
			Loadassets(character3D, path3d, grpname, itemcolor, itemname);
			charactername3D(path3d, chanames ); //new
			i +=1;
		}
	}
	scene.add(character3D);
	scene.add(chanames);
	// second = false;
	strip3D = false;
	setTimeout(countz, 3000);
}
//delay the process
function countz(){
	count = character3D.children.length -1;
}

function Loadassets(character3D, path3d, grpname, itemcolor, itemname){
	var loader = new THREE.FBXLoader();
	loader.load(`${path3d}${grpname}/${itemname}.fbx`,function( object ) {
		model = object;
		model.name = itemname;
		model.type = grpname;
		set3Dcolor(itemcolor, grpname, itemname, path3d);
		character3D.add(model);
		},
		undefined,
		function( error ) {
			console.log(error);
		}
	);
}



function assetexist(group,path3d, grpname,itemcolor, itemname){
	var asset3D = [];
	var assetleng = character3D.children.length;
	for (var k = 0; k < assetleng; k++ ){
		var chargroup = character3D.children[k].type;
		asset3D.push(chargroup);
	}
	var asset3Dexist = asset3D.includes(grpname);
	if (!asset3Dexist) Loadassets(group,path3d, grpname,itemcolor, itemname);
}

//new set character name
function charactername3D(path3d, group1){
	let character3Dname = maid == false ? Character[0].Name : '';
	let character3Dlabelcolor =  maid == false ? Character[0].LabelColor : "#202020";
	if (character3Dlabelcolor == undefined)character3Dlabelcolor = "#ffffff";
	if (character3Dname == "") return;
	var loader = new THREE.FontLoader();
	loader.load( `${path3d}1animation/helvetiker_regular.typeface.json`, function ( font ) {
		var modelname = new THREE.TextGeometry(`${character3Dname}`,{
			font: font,
			size: 8,
			height: 5,
			curveSegments: 12,
			bevelThickness: 10,
			bevelSize: 8,
			bevelSegments: 5
		});
		var textMaterial = new THREE.MeshPhongMaterial(
    { color: character3Dlabelcolor  }
  );
	var nameposition  = character3Dname.length;
	nameposition = ~nameposition - nameposition;
  var mesh = new THREE.Mesh( modelname, textMaterial );
	mesh.name = "characterletter";
	mesh.position.set(nameposition,-20,0);
	mesh.rotation.x = 270;
	group1.add(mesh);
	});
}

//autori
// function autorigger(model){
// 	let cloneAnim = model.animations;
// 	let bone = model.children[3].bone[0];
// 	let asset3Dcor =
// 	grab vec 1,2,3 of each model and circle them around the bone
//
//
// }

// TODO: create animation
// TODO: change the current animation
// function set3dModelAnim(model, anims){
// 	var anims = "Standing";
// 	let loader = new THREE.FBXLoader();
// 	loader.load(`${path3d}/1animation/${anims}.fbx`, function(anim){
// 		var mixer = new THREE.AnimationMixer(anim);
// 		var action = mixer.clipAction(model.animations[0]);
// 		},
// 		undefined,
// 		function( error ) {
// 			console.log(error);
// 	});
// action.play();
// }
//
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
