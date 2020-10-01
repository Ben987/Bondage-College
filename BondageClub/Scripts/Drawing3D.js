"use strict";
var renderer;
var scene;
var camera;
var model;
var character3D;
var material;
var Draw3DEnabled = false;
var count = 0;
var count1 = 0;
var textures, webpath;
var strip3D;
var d2tod3,second, maid = true;
var mixer;


function Draw3DLoad() {
	// var anims = ["Standing", "Walking", "Walking Backwards"];
	// var clock = new THREE.Clock();
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
		if ((KeyPress == 65) || (KeyPress == 97))  character3D.position.x -= 1;
		if ((KeyPress == 68) || (KeyPress == 100)) character3D.position.x += 1;
		if ((KeyPress == 87) || (KeyPress == 119)) refresh3DModel (character3D, count);
		if ((KeyPress == 83) || (KeyPress == 115)) character3D.position.z += 1;
		if ((KeyPress == 90) || (KeyPress == 122)) dress3DModel(character3D, count1++);
		if ((KeyPress == 88) || (KeyPress == 120)) strip3DModel(character3D.children, count--);
	}
}
// TODO: 20.9 check all assets! texture problem ! hairfront /hairback
// TODO: create more fbx assets
// TODO: call each 3d asset and transform x,y towards the next bone node(point)
function init(){

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
	// maidmodel = new THREE.Group();
	// character3D.name = "Maid";
	light();
		for (let i of itemgroup){
			let subst = i.indexOf("/");
			let grpname = i.slice(0, subst);
			let itemname = i.slice(subst +1);
			var itemcolor = "#c21e56";
			LoadAssets(character3D,grpname, itemcolor, itemname);
	 }
	characterName3D(character3D);
	scene.add(character3D);
	setTimeout(countz, 5000);
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

//set color and declare texture amount
function set3Dcolor(character3D) {
	var children1 = character3D.children.length -1;

	for (let j = 0; j <= children1; j++ ){
		var grpname = character3D.children[j].type;
		var hexcolor = character3D.children[j].color;
		if (hexcolor == "Default")  hexcolor = "#C0C0C0";
		var meshtext = grpname !== "BodyUpper" ? character3D.children[j].children[0].material.length -1 : 0;
		var isnan = Number.isNaN(meshtext);
		if (isnan){
			if (grpname !== "BodyUpper" && grpname !== "Eyes") character3D.children[j].children[0].material.color.set(hexcolor);
		}else{
			for (let i = 0; i <= meshtext; i++){
				if (grpname !== "BodyUpper" && grpname !== "Eyes") character3D.children[j].children[0].material[i].color.set(hexcolor);
			}
		}
	}
}


function strip3DModel(models, i){
	if ( second == true && models.length <= 4 || i <= -1){
			console.log("can't strip further");
	}else {
		if (models[i].type !== "BodyUpper" && models[i].type !== "Eyes" && models[i].type !== "HairBack" && models[i].type !== "HairFront" && models[i].name !== "Charactername"){
			character3D.remove(models[i]);
			count1 = 0;
			strip3D = true;
		}
	}
}

function dress3DModel(group, j){
	if ( strip3D){
		if(maid == true){
			var group2 = [ "Panties/MaidPanties1", "Bra/MaidBra", "ItemNeck/MaidCollar", "Shoes/Heels1" ,"Cloth/MaidOutfit1"];
				if (j < 5){
				var subst = group2[j].indexOf("/");
				var grpname = group2[j].slice(0, subst);
				var itemcolor = "#ADD8E6";
				var itemname = group2[j].slice(subst +1);
				LoadAssets(group ,grpname, itemcolor, itemname);
				scene.add(group);
				second = true;
				count = character3D.children.length;
			}else {
				console.log("Dressed!")
			}
		}else {
			var group2 = Character[0].Appearance.length -1;
			if (j < group2){
			  j = jumpOverAsset(j);
				var grpname =	Character[0].Appearance[j].Asset.DynamicGroupName;
				var itemname = Character[0].Appearance[j].Asset.Name;
				var itemcolor = Character[0].Appearance[j].Color;
				assetExist(group, grpname,itemcolor, itemname);
				scene.add(group);
				second = true;
			}else{
				set3Dcolor(character3D);
			}
		}
	}else {
		console.log("Dressed!");
	}
	setTimeout(countz, 6000);
}

function refresh3DModel (character3D, count){
	for (var k = character3D.children.length -1 ; k >= 0; k--){
		character3D.remove(character3D.children[k]);
	}
	maid = false;
  // character3D = new THREE.Group();
	let chale = Character[0].Appearance.length ;
	for (let i = 0;i < chale; i){
		// jumpover3Daset
		var jumpoverasset = ["Blush", "BodyLower", "Emoticon", "Fluids", "Hands", "Mask",
		"Nipple","Pussy", "Wings", "Height",  "Mouth", "Nipples", "Eyes2","Eyebrows",
		"SuitLower","Suit", "Head"];
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
			LoadAssets(character3D,grpname, itemcolor, itemname);
			i += 1;
		}
	}
	character3D.name = Character[0].Name;
	character3D.Owner = Character[0].Owner ;
	character3D.Money = Character[0].Money ;
	character3D.MemberNumber = Character[0].MemberNumber ;
	characterName3D(character3D); //new
	scene.add(character3D);
	strip3D = false;
	setTimeout(countz, 6000);
}
//delay the process
function countz(){
	count = character3D.children.length -1;
	set3Dcolor(character3D);
}


function LoadAssets(character3D,  grpname, itemcolor, itemname){
	let path3d = "Assets/3D/";
	var loader = new THREE.FBXLoader();
	loader.load(`${path3d}${grpname}/${itemname}.fbx`,function( object ) {
		model = object;
		model.name = itemname;
		model.type = grpname;
		model.color = itemcolor;

		model.traverse( function ( child ) {
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			 }
		});
		character3D.add(model);
		},
		undefined,
		function( error ) {
			console.log(error);
		}
	);
}

//ask if asset already exists if true don't join the group
function assetExist(group, grpname,itemcolor, itemname){
	var asset3D = [];
	var assetleng = character3D.children.length;
	for (var k = 0; k < assetleng; k++ ){
		var chargroup = character3D.children[k].type;
		asset3D.push(chargroup);
	}
	var asset3Dexist = asset3D.includes(grpname);
	if (!asset3Dexist) LoadAssets(group, grpname,itemcolor, itemname);
}

//new: set character name
function characterName3D(character3D){
	let path3d = "Assets/3D/";
	var chanames = new THREE.Group();
	chanames.name = "Charactername";
	let character3Dname = maid == false ? Character[0].Name : '';
	let character3Dlabelcolor =  maid == false ? Character[0].LabelColor : "";
	if (character3Dlabelcolor == undefined)character3Dlabelcolor = "#ffffff";
	if (character3Dname !== ''){
		var loader = new THREE.FontLoader();
		loader.load( `${path3d}1animation/helvetiker_regular.typeface.json`, function ( font ) {
			var modelname = new THREE.TextGeometry(`${character3Dname}`,{
				font: font,
				size: 8,
				height: 1,
				curveSegments: 1,
				bevelThickness: 1,
				bevelSize: 1,
				bevelSegments: 1
			});
			var textMaterial = new THREE.MeshPhongMaterial(
	    { color: character3Dlabelcolor  }
	  );

	  var mesh = new THREE.Mesh( modelname, textMaterial);
		mesh.name = "characterletter";
		var nameposition  = character3Dname.length;
		nameposition = ~nameposition - nameposition;
		mesh.position.set(nameposition,-20,0);
		mesh.rotation.x = 270;
	  chanames.add(mesh);
		character3D.add(chanames);
		});
	}
	scene.add(chanames);
}

function jumpOverAsset(i){
	var jumpoverasset = ["Blush", "BodyLower", "Emoticon", "Fluids", "Hands", "Mask",
	"Nipple","Pussy", "Wings", "Height",  "Mouth", "Nipples", "Eyes2","Eyebrows",
	"SuitLower","Suit", "Head"];
	while (true){
		var jumpover3Dasset = jumpoverasset.includes(Character[0].Appearance[i].Asset.DynamicGroupName);
		if (jumpover3Dasset){
			i += 1;
		}else{
			return i;
		}
	}
}

// function autoUpdate3DSpace(){
// 	let character3Dnamecolor = Character[0].LabelColor;
// 	let labelcolor = chanames.color;
// 	if ( labelcolor != character3Dnamecolor || ){
//
// 	}
// }
//TODO: create animation
//TODO: change the current animation
// function set3dModelAnim(model, anims){
// 	let loader = new THREE.FBXLoader();
// 	if ( grpname !== "BodyUpper"){
//
//
// 		//
// 	}
// 	loader.load(`${path3d}/1animation/${anims}.fbx`, function(anim){
// 		var mixer = new THREE.AnimationMixer(anim);
// 		var action = mixer.clipAction(model.animations[0]);
//
// 		// TODO: delete animations[0] and set new animation
// 		//create new bones and set animation to new bones
// 		// clip new mesh to main bones and set vectors
// 		},
// 		undefined,
// 		function( error ) {
// 			console.log(error);
// 	});
// action.play();
// }
// //update animation
// function animate() {
// 		requestAnimationFrame( animate );
// 		var delta = clock.getDelta();
// 		if ( mixer ) mixer.update( delta );
// 		renderer.render( scene, camera );

// }

// 3d enviourment
// function env3D(loader){
// 	loader.load(`${path3d}${env}.fbx`, function(object){
// 		env = object;
// 		env.castShadow = true;
// 		env.receiveShadow = true;
// 	});
// }
