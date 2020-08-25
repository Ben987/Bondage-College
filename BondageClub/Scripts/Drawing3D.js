"use strict";
var renderer;
var scene;
var camera;
var model;
var character3D;
var material;
var path3d = "Assets/3D/";
var Draw3DEnabled = false;
var count = 0;
var count1 = 0;
var maid, textures, webpath;
var strip3D;
var d2tod3,second;
var mixer;
// var clock = new THREE.Clock();

function Draw3DLoad() {
	init();
	// animate();
	// animate(character3D);
	document.body.appendChild(renderer.domElement);
	renderer.domElement.style.display = "none";
}

function Draw3DKeyDown() {
	if ((KeyPress == 51) && (CurrentScreen == "MainHall") && (CurrentCharacter == null)) Draw3DEnable(!Draw3DEnabled);
	if (Draw3DEnabled) {
		if ((KeyPress == 81) || (KeyPress == 113)) Strip3Dmodel(character3D.children, count--); //character3D.rotation.y -= 0.1;
		if ((KeyPress == 69) || (KeyPress == 101)) character3D.rotation.y += 0.1;
		if ((KeyPress == 65) || (KeyPress == 97)) dress3DModels(character3D,path3d, count1++); //character3D.position.x -= 1;
		if ((KeyPress == 68) || (KeyPress == 100)) character3D.position.x += 1;
		if ((KeyPress == 87) || (KeyPress == 119)) refresh3DModel (character3D, path3d, count);;// //character3D.position.z += 1;
		if ((KeyPress == 83) || (KeyPress == 115)) character3D.position.z += 1;
	}
}
// TODO: create more fbx assets
// TODO: call each 3d asset and transform x,y towards the next bone node(point)
function init(){
	webpath = window.location.href;
	let _mixers = [];
	var itemgroup = ["HairBack/HairBack1", "HairFront/HairFront6","Eyes/BlueEyes 1","BodyUpper/Pale Skin1",  "Cloth/MaidOutfit1","Panties/MaidPanties1", "Bra/MaidBra", "ItemNeck/MaidCollar", "Shoes/Heels1"];

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true  });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	// window.addEventListener( 'resize', onWindowResize, false );


	light();





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

	let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	ambientLight.castShadow = true;
	ambientLight.position.set(200, 2000, 200);
	scene.add(ambientLight);
}

//set color
function set3Dcolor(hexcolor,grpname , itemname, path3d){
	let loader = new THREE.TextureLoader();

	if (hexcolor == "Default") hexcolor = "#C0C0C0";

	let textlist = 0;
	let textut = 0;
	let http = new XMLHttpRequest();
	while ( textut < 9 ){
		var zero = `${webpath}${path3d}${grpname}/${itemname}${textut}.bmp`;
		textut += 1;
		http.open('HEAD', zero, false);
		http.send();
		if (http.status === 200 )textlist += 1;
	}
	for (let i = 0; i < textlist; i++ ){
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

function Loadassets(character3D, path3d, grpname, itemcolor, itemname){
	var loader = new THREE.FBXLoader();
	loader.load(`${path3d}${grpname}/${itemname}.fbx`,function( object ) {
		model = object;
		model.name = itemname;
		model.type = grpname;
		// if(model.group == "BodyUpper") animate(model);
		// mixer.root = mixer.getRoot(); //add
		set3Dcolor(itemcolor, grpname, itemname, path3d);
		// mixer = new THREE.AnimationMixer(model); //add
		// var action = mixer.clipAction(model.animations[0]); //add
		// action.play(); //add

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
		var chargroup = character3D.children[k].group;
		asset3D.push(chargroup);
	}
	var asset3Dexist = asset3D.includes(grpname);
	if (asset3Dexist != true) Loadassets(group,path3d, grpname,itemcolor, itemname);
}



// TODO: create animation
// TODO: change the current animation

function animat(model){
	var animspath = "Assets/3D/1animation/";
	var anims = "Standing";
	const anim = new THREE.FBXLoader();
	anim.load(`${animspath}${anims}.fbx`, function(model){
		var mixer = new THREE.AnimationMixer(model);
		var action = mixer.clipAction(model.animations[0]);
		action.play();


		},
		undefined,
		function( error ) {
			console.log(error);
	});
}

function animate() {
		requestAnimationFrame( animate );
		var delta = clock.getDelta();
		if ( mixer ) mixer.update( delta );
		renderer.render( scene, camera );

	}


// 3d enviourment
// function env3D(loader){
// 	loader.load(`${path3d}${env}.fbx`, function(object){
// 		env = object;
// 		env.castShadow = true;
// 		env.receiveShadow = true;
// 	});
// }
