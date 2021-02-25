"use strict";

var MiniGameKinkyDungeonCheckpoint = 0;
var MiniGameKinkyDungeonLevel = 1;
var KinkyDungeonMapIndex = [];

var KinkyDungeonLightGrid = ""
var KinkyDungeonUpdateLightGrid = true
var KinkyDungeonGrid = ""
var KinkyDungeonGrid_Last = ""
var KinkyDungeonGridSize = 50
var KinkyDungeonGridWidth = 27
var KinkyDungeonGridHeight = 15


var KinkyDungeonSpriteSize = 72

var KinkyDungeonCanvas = document.createElement("canvas");
var KinkyDungeonContext = null
var KinkyDungeonCanvasFow = document.createElement("canvas");
var KinkyDungeonContextFow = null
var KinkyDungeonCanvasPlayer = document.createElement("canvas");
var KinkyDungeonContextPlayer = null

var KinkyDungeonEntities = []
var KinkyDungeonTerrain = []
var KinkyDungeonPlayerEntity = null

var KinkyDungeonMapBrightness = 5

function KinkyDungeonInitialize(Level, Random) {
	MiniGameKinkyDungeonLevel = Level
	
	for (let I = 1; I < 10; I++)
		KinkyDungeonMapIndex.push(I)

	// Option to shuffle the dungeon types besides the initial one (graveyard)
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
	KinkyDungeonCanvas.width = KinkyDungeonGridSize*KinkyDungeonGridWidth;
	KinkyDungeonCanvas.height = KinkyDungeonGridSize*KinkyDungeonGridHeight;

	KinkyDungeonContextFow = KinkyDungeonCanvasFow.getContext("2d")
	KinkyDungeonCanvasFow.width = KinkyDungeonCanvas.width
	KinkyDungeonCanvasFow.height = KinkyDungeonCanvas.height;
	
	
	KinkyDungeonContextPlayer = KinkyDungeonCanvasPlayer.getContext("2d")
	KinkyDungeonCanvasPlayer.width = KinkyDungeonGridSize
	KinkyDungeonCanvasPlayer.height = KinkyDungeonGridSize;
}
// Starts the the game at a specified level
function KinkyDungeonCreateMap(MapParams) {
	KinkyDungeonGrid = ""
	
	// Generate the grid
	for (let X = 0; X < KinkyDungeonGridHeight; X++) {
		for (let Y = 0; Y < KinkyDungeonGridWidth; Y++)
			KinkyDungeonGrid = KinkyDungeonGrid + '1'
		KinkyDungeonGrid = KinkyDungeonGrid + '\n'
	}
	
	// We only rerender the map when the grid changes
	KinkyDungeonGrid_Last = ""
	
	// Setup variables
	
	var rows = KinkyDungeonGrid.split('\n')
	var height = KinkyDungeonGridHeight
	var width = KinkyDungeonGridWidth
	var startpos = 1 + 2*Math.floor(Math.random()*0.5 * (height - 2))
	
	// MAP GENERATION
	
	var VisitedRooms = []
	KinkyDungeonMapSet(1, startpos, '0', VisitedRooms)
	//KinkyDungeonMapSet(rows[0].length-2, endpos, '0')
	
	// Use primm algorithm with modification to spawn random rooms in the maze
	
	var openness = MapParams["openness"]
	var density = MapParams["density"]
	var doodadchance = MapParams["doodadchance"]
	var treasurechance = 0.33 // Chance a treasure chest will appear in a suitable location
	var treasurecount = MapParams["chestcount"] // Max treasure chest count
	var doorchance = MapParams["doorchance"] // Max treasure chest count
	KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density)	
	
	KinkyDungeonReplaceDoodads(doodadchance, width, height) // Replace random internal walls with doodads
	
	KinkyDungeonPlaceChests(treasurechance, treasurecount, width, height) // Place treasure chests inside dead ends
	KinkyDungeonPlaceDoors(doorchance, width, height) // Place treasure chests inside dead ends
	
	
	// Place the player!
	KinkyDungeonPlayerEntity = {Type:"Player", x: 1, y:startpos}
	KinkyDungeonEntities.push(KinkyDungeonPlayerEntity)
	
	// Set map brightness
	KinkyDungeonMapBrightness = MapParams["brightness"]
}

function KinkyDungeonPlaceChests(treasurechance, treasurecount, width, height) {
	var chestlist = []

	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonMapGet(X, Y) == '0' && Math.random() < treasurechance) {
				// Check the 3x3 area
				var wallcount = 0
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X'))
							wallcount += 1
				if (wallcount == 7) {
					chestlist.push({x:X, y:Y})
				}
			}
	
	// Truncate down to max chest count in a location-neutral way
    var count = 0;
    while (count < treasurecount &&  chestlist.length > 0) {
    	var N = Math.floor(Math.random()*chestlist.length)
    	var chest = chestlist[N]
    	KinkyDungeonMapSet(chest.x, chest.y, 'C')
        chestlist.splice(N, 1)
        count += 1;
    }

    console.log("Created " + count + " chests")
}


function KinkyDungeonPlaceDoors(doorchance, width, height) {
	var chestlist = []

	// Populate the doors
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonMapGet(X, Y) == '0' && Math.random() < doorchance) {
				// Check the 3x3 area
				var wallcount = 0
				var up = false
				var down = false
				var left = false
				var right = false
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
					    var get = KinkyDungeonMapGet(XX, YY)
						if (!(XX == X && YY == Y) && (get == '1' || get == 'X' || get == 'C')) {
							wallcount += 1 // Get number of adjacent walls
							if (XX == X+1 && YY == Y && get == '1') right = true
							else if (XX == X-1 && YY == Y && get == '1') left = true
							else if (XX == X && YY == Y+1 && get == '1') down = true
							else if (XX == X && YY == Y-1 && get == '1') up = true
						} else if (get == 'D') // No adjacent doors
							wallcount = 100
					}
				console.log("Updown: " + (up && down) + ", leftright: " + (left && right))
				if (wallcount < 5 && ((up && down) != (left && right))) { // Requirements: 4 doors and either a set in up/down or left/right but not both
					KinkyDungeonMapSet(X, Y, 'D')
				}
			}
}


function KinkyDungeonReplaceDoodads(Chance, width, height) {
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonMapGet(X, Y) == '1' && Math.random() < Chance) {
				KinkyDungeonMapSet(X, Y, 'X')
			}
				
}

function KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density) {
	// Variable setup
	
	var Walls = {}
	var WallsList = {}
	var VisitedCells = {}
	
	// Initialize the first cell in our Visited Cells list
	
	VisitedCells[VisitedRooms[0].x + "," + VisitedRooms[0].y] = {x:VisitedRooms[0].x, y:VisitedRooms[0].y}
	
	// Walls are basically even/odd pairs.
	for (let X = 2; X < width; X += 2)
		for (let Y = 1; Y < height; Y += 2)
			if (KinkyDungeonMapGet(X, Y) == '1') {
				Walls[X + "," + Y] = {x:X, y:Y}
			}
	for (let X = 1; X < width; X += 2)
		for (let Y = 2; Y < height; Y += 2)
			if (KinkyDungeonMapGet(X, Y) == '1') {
				Walls[X + "," + Y] = {x:X, y:Y}
			}
		
	// Setup the wallslist for the first room
	KinkyDungeonMazeWalls(VisitedRooms[0], Walls, WallsList)
	
	// Per a randomized primm algorithm from Wikipedia, we loop through the list of walls until there are no more walls
	
	var WallKeys = Object.keys(WallsList)
	var CellKeys = Object.keys(VisitedCells)
			
	while (WallKeys.length > 0) {
		var I = Math.floor(Math.random() * WallKeys.length)
		var wall = Walls[WallKeys[I]]
		var unvisitedCell = null
		
		// Check if wall is horizontal or vertical and determine if there is a single unvisited cell on the other side of the wall
		if (wall.x % 2 == 0) { //horizontal wall
			if (!VisitedCells[(wall.x-1) + "," + wall.y]) unvisitedCell = {x:wall.x-1, y:wall.y}
			if (!VisitedCells[(wall.x+1) + "," + wall.y]) {
				if (unvisitedCell) unvisitedCell = null
				else unvisitedCell = {x:wall.x+1, y:wall.y}
			}
		} else { //vertical wall
			if (!VisitedCells[wall.x + "," + (wall.y-1)]) unvisitedCell = {x:wall.x, y:wall.y-1}
			if (!VisitedCells[wall.x + "," + (wall.y+1)]) {
				if (unvisitedCell) unvisitedCell = null
				else unvisitedCell = {x:wall.x, y:wall.y+1}
			}
		}
		
		// We only add a new cell if only one of the cells is unvisited
		if (unvisitedCell) {
			delete Walls[wall.x + "," + wall.y]

			KinkyDungeonMapSet(wall.x, wall.y, '0')
			KinkyDungeonMapSet(unvisitedCell.x, unvisitedCell.y, '0')
			VisitedCells[unvisitedCell.x + "," + unvisitedCell.y] = unvisitedCell
			
			KinkyDungeonMazeWalls(unvisitedCell, Walls, WallsList)
		}

		// Either way we remove this wall from consideration
		delete WallsList[wall.x + "," + wall.y]
		
		// Chance of spawning a room!
		if (Math.random() < 0.1 - 0.015*density) {
			var size = 1+Math.ceil(Math.random() * (openness))
			
			// We open up the tiles
			for (let XX = wall.x; XX < wall.x +size; XX++)
				for (let YY = wall.y; YY < wall.y+size; YY++) {
					KinkyDungeonMapSet(XX, YY, '0')
					VisitedCells[XX + "," + YY] = {x:XX, y:YY}
					KinkyDungeonMazeWalls({x:XX, y:YY}, Walls, WallsList)
					delete Walls[XX + "," + YY]
				}
				
			// We also remove all walls inside the room from consideration!
			for (let XX = wall.x; XX < wall.x +size; XX++)
				for (let YY = wall.y; YY < wall.y+size; YY++) {
					delete WallsList[XX + "," + YY]
				}
		}
		
		// Update keys
		
		WallKeys = Object.keys(WallsList)
		CellKeys = Object.keys(VisitedCells)
	}

}

function KinkyDungeonMazeWalls(Cell, Walls, WallsList) {
	if (Walls[(Cell.x+1) + "," + Cell.y]) WallsList[(Cell.x+1) + "," + Cell.y] = {x:Cell.x+1, y:Cell.y}
	if (Walls[(Cell.x-1) + "," + Cell.y]) WallsList[(Cell.x-1) + "," + Cell.y] = {x:Cell.x-1, y:Cell.y}
	if (Walls[Cell.x + "," + (Cell.y+1)]) WallsList[Cell.x + "," + (Cell.y+1)] = {x:Cell.x, y:Cell.y+1}
	if (Walls[Cell.x + "," + (Cell.y-1)]) WallsList[Cell.x + "," + (Cell.y-1)] = {x:Cell.x, y:Cell.y-1}
}

function KinkyDungeonMapSet(X, Y, SetTo, VisitedRooms) {
	var height = KinkyDungeonGridHeight
	var width = KinkyDungeonGridWidth
	
	if (X > 0 && X < width-1 && Y > 0 && Y < height-1) {
		KinkyDungeonGrid = KinkyDungeonGrid.replaceAt(X + Y*(width+1), SetTo)
		if (VisitedRooms)
			VisitedRooms.push({x: X, y: Y})
		return true;
	}
	return false;
}

function KinkyDungeonMapGet(X, Y) {
	var height = KinkyDungeonGrid.split('\n').length
	var width = KinkyDungeonGrid.split('\n')[0].length
	
	return KinkyDungeonGrid[X + Y*(width+1)]
}

function KinkyDungeonLightSet(X, Y, SetTo) {
	var height = KinkyDungeonGridHeight
	var width = KinkyDungeonGridWidth
	
	if (X >= 0 && X <= width-1 && Y >= 0 && Y <= height-1) {
		KinkyDungeonLightGrid = KinkyDungeonLightGrid.replaceAt(X + Y*(width+1), SetTo)
		return true;
	}
	return false;
}

function KinkyDungeonLightGet(X, Y) {
	var height = KinkyDungeonLightGrid.split('\n').length
	var width = KinkyDungeonLightGrid.split('\n')[0].length
	
	return KinkyDungeonLightGrid[X + Y*(width+1)]
}

const canvasOffsetX = 500
const canvasOffsetY = 164

// Draw function for the game portion
function KinkyDungeonDrawGame() {
	MiniGameKinkyDungeonCheckpoint = 10*Math.floor(MiniGameKinkyDungeonLevel / 10)
		
	DrawText(TextGet("CurrentLevel") + MiniGameKinkyDungeonLevel, 1000, 72, "white", "silver");
	DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500, 72, "white", "silver");
	
	
	var movedirection = KinkyDungeonGetDirection(KinkyDungeonPlayerEntity.x*KinkyDungeonGridSize + canvasOffsetX, KinkyDungeonPlayerEntity.y*KinkyDungeonGridSize + canvasOffsetY)
	
	if (KinkyDungeonCanvas) {
		
		if (KinkyDungeonGrid_Last != KinkyDungeonGrid) {
			
			
			KinkyDungeonContext.fillStyle = "rgba(20,20,20.0,1.0)";
			KinkyDungeonContext.fillRect(0, 0, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height);
			KinkyDungeonContext.fill()
			// Draw the grid
			var rows = KinkyDungeonGrid.split('\n')
			for (let R = 0; R < rows.length; R++)  {
				for (let X = 0; X < rows[R].length; X++)  {
					var sprite = "Floor"
					if (rows[R][X] == "1") sprite = "Wall"
					else if (rows[R][X] == "X") sprite = "Doodad"
					else if (rows[R][X] == "C") sprite = "Chest"
					else if (rows[R][X] == "D") sprite = "Door"
						
					DrawImageZoomCanvas("Screens/Minigame/KinkyDungeon/" + sprite + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint] + ".png", KinkyDungeonContext, 0, 0, KinkyDungeonSpriteSize, KinkyDungeonSpriteSize, X*KinkyDungeonGridSize, R*KinkyDungeonGridSize, KinkyDungeonGridSize, KinkyDungeonGridSize, false)
				}
			}
			
			//KinkyDungeonGrid_Last = KinkyDungeonGrid
		}
		
		// Get lighting grid
		if (KinkyDungeonUpdateLightGrid) {
			KinkyDungeonUpdateLightGrid = false
			KinkyDungeonMakeLightMap(KinkyDungeonGridWidth, KinkyDungeonGridHeight, [ {x: KinkyDungeonPlayerEntity.x, y:KinkyDungeonPlayerEntity.y, brightness: KinkyDungeonMapBrightness}])
		}
			
		
		// Draw fog of war
		var rows = KinkyDungeonLightGrid.split('\n')
		for (let R = 0; R < rows.length; R++)  {
			for (let X = 0; X < rows[R].length; X++)  {
				KinkyDungeonContext.beginPath();
				KinkyDungeonContext.fillStyle = "rgba(0,0,0," + Math.max(0, 1-Number(rows[R][X])/3) + ")";
				
				KinkyDungeonContext.fillRect(X*KinkyDungeonGridSize, R*KinkyDungeonGridSize, KinkyDungeonGridSize, KinkyDungeonGridSize);
				KinkyDungeonContext.fill()
			}
		}
		
		for (let Y = 0; Y < rows.length; Y++)  {
			for (let X = 0; X < rows[Y].length; X++)  {
				var dist = Math.sqrt((X - KinkyDungeonPlayerEntity.x) * (X - KinkyDungeonPlayerEntity.x) + (Y - KinkyDungeonPlayerEntity.y) * (Y - KinkyDungeonPlayerEntity.y))
				
				
				

			}
		}
		
		// Draw targeting reticule
		if ((movedirection.x != 0 || movedirection.y != 0)) {
			KinkyDungeonContext.beginPath();
			KinkyDungeonContext.rect((movedirection.x + KinkyDungeonPlayerEntity.x)*KinkyDungeonGridSize, (movedirection.y + KinkyDungeonPlayerEntity.y)*KinkyDungeonGridSize, KinkyDungeonGridSize, KinkyDungeonGridSize);
			KinkyDungeonContext.lineWidth = 3;
			KinkyDungeonContext.strokeStyle = "#ff4444";
			KinkyDungeonContext.stroke()
		}
		MainCanvas.drawImage(KinkyDungeonCanvas, canvasOffsetX, canvasOffsetY);
		
	}
	
	CharacterSetFacialExpression(KinkyDungeonPlayer, "Emoticon", null);
	
	// Draw the player no matter what
	KinkyDungeonContextPlayer.fillStyle = "rgba(0,0,0,1.0)";
	KinkyDungeonContextPlayer.fillRect(0, 0, KinkyDungeonCanvasPlayer.width, KinkyDungeonCanvasPlayer.height);
	KinkyDungeonContextPlayer.fill()
	DrawCharacter(KinkyDungeonPlayer, -KinkyDungeonGridSize/2, 0, KinkyDungeonGridSize/250, false, KinkyDungeonContextPlayer)
	
	

	MainCanvas.drawImage(KinkyDungeonCanvasPlayer,  KinkyDungeonPlayerEntity.x*KinkyDungeonGridSize + canvasOffsetX, KinkyDungeonPlayerEntity.y*KinkyDungeonGridSize + canvasOffsetY); 
	 
}

// returns an object containing coordinates of which direction the player will move after a click, plus a time multiplier
function KinkyDungeonGetDirection(PX, PY) {
	const dx = MouseX - PX - KinkyDungeonGridSize / 2
	const dy = MouseY - PY - KinkyDungeonGridSize / 2
	
	var X = 0;
	var Y = 0;
	
	// Cardinal directions first - up down left right
	if (dy > 0 && Math.abs(dx) < Math.abs(dy)/2.61312593) Y = 1
	else if (dy < 0 && Math.abs(dx) < Math.abs(dy)/2.61312593) Y = -1
	else if (dx > 0 && Math.abs(dy) < Math.abs(dx)/2.61312593) X = 1
	else if (dx < 0 && Math.abs(dy) < Math.abs(dx)/2.61312593) X = -1
	
	// Diagonals
	else if (dy > 0 && dx > dy/2.61312593) {Y = 1; X = 1}
	else if (dy > 0 && -dx > dy/2.61312593) {Y = 1; X = -1}
	else if (dy < 0 && dx > -dy/2.61312593) {Y = -1; X = 1}
	else if (dy < 0 && -dx > -dy/2.61312593) {Y = -1; X = -1}
	
	return {x:X, y:Y, delta:Math.sqrt(X*X+Y*Y)}
}


// Click function for the game portion
function KinkyDungeonClickGame(Level) {
	// First we handle buttons
	
	
	// If no buttons are clicked then we handle move
	
	//{
		var movedirection = KinkyDungeonGetDirection(KinkyDungeonPlayerEntity.x*KinkyDungeonGridSize + canvasOffsetX, KinkyDungeonPlayerEntity.y*KinkyDungeonGridSize + canvasOffsetY)
		var moveX = movedirection.x + KinkyDungeonPlayerEntity.x
		var moveY = movedirection.y + KinkyDungeonPlayerEntity.y
		var moveObject = KinkyDungeonMapGet(moveX, moveY)
		if (moveObject == '0' || moveObject == 'D') { // If the player can move to an empy space or a door
			if (moveObject == 'D') { // Open the door
				KinkyDungeonMapSet(moveX, moveY, '0')
			} else {
				KinkyDungeonPlayerEntity.x = moveX
				KinkyDungeonPlayerEntity.y = moveY
			}
			KinkyDungeonAdvanceTime(movedirection.delta)
		}
	//}
}

function KinkyDungeonAdvanceTime(delta) {
	// Here we move enemies and such
	KinkyDungeonUpdateLightGrid = true
}

