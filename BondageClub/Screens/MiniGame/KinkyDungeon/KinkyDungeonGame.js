"use strict";

var MiniGameKinkyDungeonCheckpoint = 0;
var MiniGameKinkyDungeonLevel = 1;
var KinkyDungeonMapIndex = [];


var KinkyDungeonGrid = ""
var KinkyDungeonGrid_Last = ""
var KinkyDungeonGridSize = 72

var KinkyDungeonCanvas = document.createElement("canvas");
var KinkyDungeonContext = null

function KinkyDungeonInitialize(Level, Random) {
	MiniGameKinkyDungeonLevel = Level
	
	for (let I = 1; I < 10; I++)
		KinkyDungeonMapIndex.push(I)

	if (Random) {
		/* Randomize array in-place using Durstenfeld shuffle algorithm */
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		for (var i = KinkyDungeonMapIndex.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = KinkyDungeonMapIndex[i];
			KinkyDungeonMapIndex[i] = KinkyDungeonMapIndex[j];
			KinkyDungeonMapIndex[j] = temp;
		}
	}
	KinkyDungeonMapIndex.unshift(0)
	KinkyDungeonMapIndex.push(10)
	
	KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[0]])
	
	
	KinkyDungeonContext = KinkyDungeonCanvas.getContext("2d")
	KinkyDungeonCanvas.width = KinkyDungeonGridSize*20;
	KinkyDungeonCanvas.height = KinkyDungeonGridSize*10;
}
// Starts the the game at a specified level
function KinkyDungeonCreateMap(MapParams) {
	KinkyDungeonGrid = "11111111111111111111\n11111111111111111111\n11111111111111111111\n11111111111111111111\n11111111111111111111\n11111111111111111111\n11111111111111111111\n11111111111111111111\n11111111111111111111\n11111111111111111111"
	KinkyDungeonGrid_Last = ""
	
	
	
	var rows = KinkyDungeonGrid.split('\n')
	
	
	var height = rows.length
	var width = rows[0].length
	
	var startpos = 1 + Math.floor(Math.random() * (height - 2))
	var endpos = 1 + Math.floor(Math.random() * (height - 2))
	
	KinkyDungeonMapSet(1, startpos, '0')
	KinkyDungeonMapSet(rows[0].length-2, endpos, '0')
	
	// Make rooms
	var rooms = []
	var openness = MapParams["openness"]
	var tunnellength = MapParams["tunnellength"]
	var roomcount = 20
	
	
	for (let R = 0; R < roomcount; R++) {
		var size = 1+Math.floor(Math.random() * (openness))
		rooms.push({
			x: 1 + Math.floor(Math.random() * (width - 1 - size)),
			y: 1 + Math.floor(Math.random() * (height - 1 - size)),
			size: size,
		})
	}
	
	for (let R = 0; R < rooms.length; R++) {
		const room = rooms[R]
		for (let X = 0; X < room.size; X++)
			for (let Y = 0; Y < room.size; Y++)
				KinkyDungeonMapSet(room.x+X, room.y+Y, '0')
	}
	
}



function KinkyDungeonMapSet(X, Y, SetTo) {
	var height = KinkyDungeonGrid.split('\n').length
	var width = KinkyDungeonGrid.split('\n')[0].length
	
	if (X > 0 && X < width-1 && Y > 0 && Y < height-1) {
		KinkyDungeonGrid = KinkyDungeonGrid.replaceAt(X + Y*(width+1), SetTo)
		return true;
	}
	return false;
}


// Draw function for the game portion
function KinkyDungeonDrawGame() {
	MiniGameKinkyDungeonCheckpoint = 10*Math.floor(MiniGameKinkyDungeonLevel / 10)
		
	DrawText(TextGet("CurrentLevel") + MiniGameKinkyDungeonLevel, 1000, 72, "white", "silver");
	DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500, 72, "white", "silver");
	
	
	if (KinkyDungeonCanvas) {
		
		if (KinkyDungeonGrid_Last != KinkyDungeonGrid) {
			KinkyDungeonContext.fillStyle = "rgba(20,20,20.0,1.0)";
			KinkyDungeonContext.fillRect(0, 0, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height);
			KinkyDungeonContext.fill()
			// Draw the grid
			var rows = KinkyDungeonGrid.split('\n')
			for (let R = 0; R < rows.length; R++)  {
				for (let X = 0; X < rows[R].length; X++)  {
					if (rows[R][X] == "1")
						DrawImageZoomCanvas("Screens/Minigame/KinkyDungeon/Wall" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint] + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonGridSize, KinkyDungeonGridSize, X*KinkyDungeonGridSize, R*KinkyDungeonGridSize, KinkyDungeonGridSize, KinkyDungeonGridSize, false)
					else DrawImageZoomCanvas("Screens/Minigame/KinkyDungeon/Floor" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint] + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonGridSize, KinkyDungeonGridSize, X*KinkyDungeonGridSize, R*KinkyDungeonGridSize, KinkyDungeonGridSize, KinkyDungeonGridSize, false)
				}
			}
			
			//KinkyDungeonGrid_Last = KinkyDungeonGrid
		}
		
		MainCanvas.drawImage(KinkyDungeonCanvas, 500, 164);
	}
}



// Click function for the game portion
function KinkyDungeonClickGame(Level) {

}

