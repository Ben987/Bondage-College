"use strict";

var MiniGameKinkyDungeonCheckpoint = 0;
var MiniGameKinkyDungeonLevel = 1;
var KinkyDungeonMapIndex = [];

var KinkyDungeonLightGrid = "";
var KinkyDungeonUpdateLightGrid = true;
var KinkyDungeonGrid = "";
var KinkyDungeonGrid_Last = "";
var KinkyDungeonGridSize = 50;
var KinkyDungeonGridWidth = 31;
var KinkyDungeonGridHeight = 19;

var KinkyDungeonGridSizeDisplay = 72;
var KinkyDungeonGridWidthDisplay = 17;
var KinkyDungeonGridHeightDisplay = 9;

var KinkyDungeonMoveDirection = KinkyDungeonGetDirection(0, 0);

var KinkyDungeonTextMessagePriority = 0;
var KinkyDungeonTextMessage = "";
var KinkyDungeonTextMessageTime = 0;
var KinkyDungeonTextMessageColor = "white";

var KinkyDungeonActionMessagePriority = 0;
var KinkyDungeonActionMessage = "";
var KinkyDungeonActionMessageTime = 0;
var KinkyDungeonActionMessageColor = "white";

var KinkyDungeonSpriteSize = 72;

var KinkyDungeonCanvas = document.createElement("canvas");
var KinkyDungeonContext = null;
var KinkyDungeonCanvasFow = document.createElement("canvas");
var KinkyDungeonContextFow = null;
var KinkyDungeonCanvasPlayer = document.createElement("canvas");
var KinkyDungeonContextPlayer = null;

var KinkyDungeonEntities = [];
var KinkyDungeonTerrain = [];

var KinkyDungeonMapBrightness = 5;

var KinkyDungeonGroundTiles = "02"
var KinkyDungeonMovableTilesEnemy = KinkyDungeonGroundTiles + "SsRrd"; // Objects which can be moved into: floors, debris, open doors, staircases
var KinkyDungeonMovableTilesSmartEnemy = "D" + KinkyDungeonMovableTilesEnemy; //Smart enemies can open doors as well
var KinkyDungeonMovableTiles = "CA" + KinkyDungeonMovableTilesSmartEnemy; // Player can open chests

var KinkyDungeonTiles = {};
var KinkyDungeonTargetTile = null;
var KinkyDungeonTargetTileLocation = "";

var KinkyDungeonBaseLockChance = 0.25;
var KinkyDungeonScalingLockChance = 0.1; // Lock chance per 10 floors. Does not affect the guaranteed locked chest each level
var KinkyDungeonGreenLockChance = 0.3;
var KinkyDungeonGreenLockChanceScaling = 0.01;
var KinkyDungeonGreenLockChanceScalingMax = 0.8;
var KinkyDungeonYellowLockChance = 0.15;
var KinkyDungeonYellowLockChanceScaling = 0.008;
var KinkyDungeonYellowLockChanceScalingMax = 0.7;
var KinkyDungeonBlueLockChance = -0.05;
var KinkyDungeonBlueLockChanceScaling = 0.005;
var KinkyDungeonBlueLockChanceScalingMax = 0.35;


var KinkyDungeonEasyLockChance = 0.8;
var KinkyDungeonEasyLockChanceScaling = -0.007;
var KinkyDungeonEasyLockChanceScalingMax = 1.0;
var KinkyDungeonHardLockChance = 0.2;
var KinkyDungeonHardLockChanceScaling = 0.005;
var KinkyDungeonHardLockChanceScalingMax = 0.4;


var KinkyDungeonDoorCloseTimer = 0;
var KinkyDungeonLastMoveDirection = null;
var KinkyDungeonTargetingSpell = null;

var KinkyDungeonMaxLevel = 10; // Game stops when you reach this level

function KinkyDungeonSetCheckPoint() {
	MiniGameKinkyDungeonCheckpoint = Math.floor(MiniGameKinkyDungeonLevel / 10);
}

function KinkyDungeonInitialize(Level, Random) {
	CharacterReleaseTotal(KinkyDungeonPlayer);
	KinkyDungeonDressPlayer();
	KinkyDungeonDrawState = "Game";

	KinkyDungeonTextMessage = "";
	KinkyDungeonActionMessage = "";
	MiniGameKinkyDungeonLevel = Level;
	KinkyDungeonSetCheckPoint();

	for (let I = 1; I < 10; I++)
		KinkyDungeonMapIndex.push(I);

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
	KinkyDungeonMapIndex.unshift(0);
	KinkyDungeonMapIndex.push(10);


	KinkyDungeonContextPlayer = KinkyDungeonCanvasPlayer.getContext("2d");
	KinkyDungeonCanvasPlayer.width = KinkyDungeonGridSizeDisplay;
	KinkyDungeonCanvasPlayer.height = KinkyDungeonGridSizeDisplay;

	KinkyDungeonContext = KinkyDungeonCanvas.getContext("2d");
	KinkyDungeonCanvas.height = KinkyDungeonCanvasPlayer.height*KinkyDungeonGridHeightDisplay;

	KinkyDungeonContextFow = KinkyDungeonCanvasFow.getContext("2d");
	KinkyDungeonCanvasFow.width = KinkyDungeonCanvas.width;
	KinkyDungeonCanvasFow.height = KinkyDungeonCanvas.height;

	KinkyDungeonDefaultStats();

	// Set up the first level
	KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[0]], 0);
}
// Starts the the game at a specified level
function KinkyDungeonCreateMap(MapParams, Floor) {
	KinkyDungeonGrid = "";
	KinkyDungeonTiles = {};
	KinkyDungeonTargetTile = "";

	var height = MapParams.min_height + 2*Math.floor(0.5*Math.random() * (MapParams.max_height - MapParams.min_height));
	var width = MapParams.min_width + 2*Math.floor(0.5*Math.random() * (MapParams.max_width - MapParams.min_width));

	KinkyDungeonCanvas.width = KinkyDungeonCanvasPlayer.width*KinkyDungeonGridWidthDisplay;
	KinkyDungeonGridHeight = height;
	KinkyDungeonGridWidth = width;

	// Generate the grid
	for (let X = 0; X < height; X++) {
		for (let Y = 0; Y < width; Y++)
			KinkyDungeonGrid = KinkyDungeonGrid + '1';
		KinkyDungeonGrid = KinkyDungeonGrid + '\n';
	}

	// We only rerender the map when the grid changes
	KinkyDungeonGrid_Last = "";
	KinkyDungeonUpdateLightGrid = true;

	// Setup variables

	var rows = KinkyDungeonGrid.split('\n');
	var startpos = 1 + 2*Math.floor(Math.random()*0.5 * (height - 2));

	// MAP GENERATION

	var VisitedRooms = [];
	KinkyDungeonMapSet(1, startpos, '1', VisitedRooms);
	//KinkyDungeonMapSet(rows[0].length-2, endpos, '0')

	// Use primm algorithm with modification to spawn random rooms in the maze

	var openness = MapParams.openness;
	var density = MapParams.density;
	var doodadchance = MapParams.doodadchance;
	var treasurechance = 1.0; // Chance for an extra locked chest
	var treasurecount = MapParams.chestcount; // Max treasure chest count
	var shrinechance = MapParams.shrinechance; // Chance for an extra shrine
	var shrinecount = MapParams.shrinecount; // Max treasure chest count
	var rubblechance = MapParams.rubblechance; // Chance of lootable rubble
	var doorchance = MapParams.doorchance; // Max treasure chest count
	var brickchance = MapParams.brickchance; // Chance for brickwork to start being placed
	KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density);

	KinkyDungeonGroundItems = []; // Clear items on the ground
	KinkyDungeonBullets = []; // Clear all bullets

	KinkyDungeonReplaceDoodads(doodadchance, width, height); // Replace random internal walls with doodads
	KinkyDungeonPlaceStairs(startpos, width, height); // Place the start and end locations
	KinkyDungeonPlaceChests(treasurechance, treasurecount, rubblechance, Floor, width, height); // Place treasure chests inside dead ends
	KinkyDungeonPlaceDoors(doorchance, width, height); // Place treasure chests inside dead ends
	KinkyDungeonPlaceShrines(shrinechance, shrinecount, Floor, width, height); // Place treasure chests inside dead ends
	KinkyDungeonPlaceBrickwork(brickchance, Floor, width, height); // Place treasure chests inside dead ends

	// Place the player!
	KinkyDungeonPlayerEntity = {MemberNumber:Player.MemberNumber, x: 1, y:startpos};
	KinkyDungeonUpdateStats(0);

	// Place enemies after player
	KinkyDungeonPlaceEnemies(MapParams.enemytags, Floor, width, height);

	// Set map brightness
	KinkyDungeonMapBrightness = MapParams.brightness;

}

function KinkyDungeonPlaceEnemies(Tags, Floor, width, height) {
	KinkyDungeonEntities = [];

	var enemyCount = 4 + Math.floor(Math.sqrt(Floor) + width/20 + height/20);
	var count = 0;
	var tries = 0;
	var miniboss = false;

	// Create this number of enemies
	while (count < enemyCount && tries < 1000) {
		var X = 1 + Math.floor(Math.random()*(width - 1));
		var Y = 1 + Math.floor(Math.random()*(height - 1));
		var playerDist = 4;
		let PlayerEntity = KinkyDungeonNearestPlayer({x:X, y:Y})

		if (Math.sqrt((X - PlayerEntity.x) * (X - PlayerEntity.x) + (Y - PlayerEntity.y) * (Y - PlayerEntity.y)) > playerDist && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(X, Y))) {
			var tags = [];
			if (KinkyDungeonMapGet(X, Y) == 'R' || KinkyDungeonMapGet(X, Y) == 'r') tags.push("rubble");
			if (Floor % 10 >= 5) tags.push("secondhalf");
			if (Floor % 10 >= 8) tags.push("lastthird");
			if (Floor % 10 >= 8) tags.push("lastthird");
			if (miniboss) tags.push("miniboss");

			var Enemy = KinkyDungeonGetEnemy(tags, Floor, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
			if (Enemy) {
				KinkyDungeonEntities.push({Enemy: Enemy, x:X, y:Y, hp: (Enemy.startinghp) ? Enemy.startinghp : Enemy.maxhp, movePoints: 0, attackPoints: 0});
				if (Enemy.tags.includes("minor")) count += 0.2; else count += 1; // Minor enemies count as 1/5th of an enemy
				if (Enemy.tags.includes("elite")) count += 1; // Elite enemies count as 2 normal enemies
				if (Enemy.tags.includes("miniboss")) miniboss = true; // Adds miniboss as a tag
				//console.log("Created a " + Enemy.name)
			}
		}
		tries += 1;
	}
}

function KinkyDungeonPlaceChests(treasurechance, treasurecount, rubblechance, Floor, width, height) {
	let chestlist = [];


	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y)) && Math.random()) {
				// Check the 3x3 area
				var wallcount = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X'))
							wallcount += 1;
				if (wallcount == 7) {
					chestlist.push({x:X, y:Y});
				}
			}

	// Truncate down to max chest count in a location-neutral way
    let count = 0;
	let extra = Math.random() < treasurechance;
	treasurecount += (extra ? 1 : 0);
    while (chestlist.length > 0) {
		let N = Math.floor(Math.random()*chestlist.length);
		if (count < treasurecount) {
			let chest = chestlist[N];
			KinkyDungeonMapSet(chest.x, chest.y, 'C');

			// Add a lock on the chest! For testing purposes ATM
			let lock = KinkyDungeonGenerateLock((extra && count == 0) ? true : false , Floor);
			if (lock)
				KinkyDungeonTiles["" + chest.x + "," +chest.y] = {Type: "Lock", Lock: lock};

			count += 1;
		} else {

			let chest = chestlist[N];
			if (Math.random() < rubblechance) KinkyDungeonMapSet(chest.x, chest.y, 'R');
				else KinkyDungeonMapSet(chest.x, chest.y, 'r');
		}
		chestlist.splice(N, 1);
    }

    //console.log("Created " + count + " chests")
}


function KinkyDungeonPlaceShrines(shrinechance, shrinecount, Floor, width, height) {
	let shrinelist = [];


	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
				// Check the 3x3 area
				let freecount = 0;
				let freecount_diag = 0;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1)
						if (!(XX == X && YY == Y) && KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(XX, YY)))
							if (XX == X || YY == Y)
								freecount += 1;
							else
								freecount_diag += 1;

				if (freecount >= 4 && freecount_diag >= 1)
					shrinelist.push({x:X, y:Y});
				

			} else if (KinkyDungeonMapGet(X, Y) == "R" || KinkyDungeonMapGet(X, Y) == "r")
				shrinelist.push({x:X, y:Y});

	// Truncate down to max chest count in a location-neutral way
    let count = 0;
    while (shrinelist.length > 0) {
		let N = Math.floor(Math.random()*shrinelist.length);
		if (count < shrinecount) {

			let shrine = shrinelist[N];
			if (count == shrinecount && Math.random() < shrinechance)
				KinkyDungeonMapSet(shrine.x, shrine.y, 'a');
			else {
				KinkyDungeonTiles["" + shrine.x + "," +shrine.y] =  {Type: "Shrine", Name: KinkyDungeonGenerateShrine(Floor)};
				KinkyDungeonMapSet(shrine.x, shrine.y, 'A');
			}


			count += 1;
		}

		shrinelist.splice(N, 1);
    }

    //console.log("Created " + count + " shrines")
}



function KinkyDungeonGenerateShrine(Floor) {
	let level = (Floor) ? Floor : MiniGameKinkyDungeonLevel;
	let Params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	let mult = (Params.lockmult) ? Params.lockmult : 1.0;



	if (Params.shrines) {


		var shrineWeightTotal = 0;
		var shrineWeights = [];

		for (let L = 0; L < Params.shrines.length; L++) {
			var shrine = Params.shrines[L];
			shrineWeights.push({shrine: shrine, weight: shrineWeightTotal});
			shrineWeightTotal += shrine.Weight;
		}

		var selection = Math.random() * shrineWeightTotal;

		for (let L = shrineWeights.length - 1; L >= 0; L--) {
			if (selection > shrineWeights[L].weight) {
				return shrineWeights[L].shrine.Type;
			}
		}
	}


	return "";
}


function KinkyDungeonPlaceBrickwork( brickchance, Floor, width, height) {
	// Populate the chests
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonMapGet(X, Y) == '0') {
				let chance = brickchance
				// Check the 3x3 area
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						if (!(XX == X && YY == Y) && !KinkyDungeonMovableTilesEnemy.includes(KinkyDungeonMapGet(XX, YY)))
							chance += 0.01;
						if (KinkyDungeonMapGet(XX, YY) == 'A')
							chance += 0.5;
						else if (KinkyDungeonMapGet(XX, YY) == 'a')
							chance += 0.25;
					}

				if (Math.random() < chance)
					KinkyDungeonMapSet(X, Y, '2')
			}
}


function KinkyDungeonGenerateLock(Guaranteed, Floor) {
	let level = (Floor) ? Floor : MiniGameKinkyDungeonLevel;
	let Params = KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]];
	let mult = (Params.lockmult) ? Params.lockmult : 1.0;

	let chance = (level == 0) ? 0 : KinkyDungeonBaseLockChance;
	chance += KinkyDungeonScalingLockChance * level / 10;

	if (Guaranteed) chance = 1.0;

	if (Math.random() < chance) {
		// Now we get the amount failed by
		// Default: red lock
		let locktype = Math.random();
		let difficulty = Math.random(); // Some are easy, some are unpickable and always break picks

		let modifiers = "";

		//let EasyChance =  Math.min(KinkyDungeonEasyLockChance + level * KinkyDungeonEasyLockChanceScaling, KinkyDungeonEasyLockChanceScalingMax)
		//let HardChance =  Math.min(KinkyDungeonHardLockChance + level * KinkyDungeonHardLockChanceScaling, KinkyDungeonHardLockChanceScalingMax)

		//if (difficulty < HardChance) modifiers = "Hard"
		//else if (difficulty < EasyChance) modifiers = "Easy"

		let GreenChance = Math.min(KinkyDungeonGreenLockChance + level * KinkyDungeonGreenLockChanceScaling, KinkyDungeonGreenLockChanceScalingMax);
		let YellowChance = Math.min(KinkyDungeonYellowLockChance + level * KinkyDungeonYellowLockChanceScaling, KinkyDungeonYellowLockChanceScalingMax);
		let BlueChance = Math.min(KinkyDungeonBlueLockChance + level * KinkyDungeonBlueLockChanceScaling, KinkyDungeonBlueLockChanceScalingMax);

		if (locktype < BlueChance) return "Blue" + modifiers;
		if (locktype < YellowChance) return "Yellow" + modifiers;
		if (locktype < GreenChance) return "Green" + modifiers;
		return "Red" + modifiers;
	}

	return "";
}

function KinkyDungeonPlaceDoors(doorchance, width, height) {
	// Populate the doors
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
				// Check the 3x3 area
				var wallcount = 0;
				var up = false;
				var down = false;
				var left = false;
				var right = false;
				for (let XX = X-1; XX <= X+1; XX += 1)
					for (let YY = Y-1; YY <= Y+1; YY += 1) {
						var get = KinkyDungeonMapGet(XX, YY);
						if (!(XX == X && YY == Y) && (get == '1' || get == 'X' || get == 'C')) {
							wallcount += 1; // Get number of adjacent walls
							if (XX == X+1 && YY == Y && get == '1') right = true;
							else if (XX == X-1 && YY == Y && get == '1') left = true;
							else if (XX == X && YY == Y+1 && get == '1') down = true;
							else if (XX == X && YY == Y-1 && get == '1') up = true;
						} else if (get == 'D') // No adjacent doors
							wallcount = 100;
					}
				if (wallcount < 5 && ((up && down) != (left && right))) { // Requirements: 4 doors and either a set in up/down or left/right but not both
					if (Math.random() < doorchance)
						KinkyDungeonMapSet(X, Y, 'D');
					else
						KinkyDungeonMapSet(X, Y, 'd');
					
					KinkyDungeonTiles["" + X + "," + Y] = {Type: "Door"};
				}
			}
}

function KinkyDungeonPlaceStairs(startpos, width, height) {
	// Starting stairs are predetermined and guaranteed to be open
	KinkyDungeonMapSet(1, startpos, 'S');


	// Ending stairs are not.
	var placed = false;
	for (let L = 100; L > 0; L -= 1) { // Try up to 100 times
		let X = width - 2;
		let Y = 1 + 2*Math.floor(Math.random()*0.5 * (height - 2));
		if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
			// Check the 3x3 area
			var wallcount = 0;
			for (let XX = X-1; XX <= X+1; XX += 1)
				for (let YY = Y-1; YY <= Y+1; YY += 1)
					if (!(XX == X && YY == Y) && (KinkyDungeonMapGet(XX, YY) == '1' || KinkyDungeonMapGet(XX, YY) == 'X'))
						wallcount += 1;
			if (wallcount == 7) {
				placed = true;
				KinkyDungeonMapSet(X, Y, 's');
				L = 0;
			}
		}
	}

	if (!placed) // Loosen the constraints
		for (let L = 100; L > 0; L -= 1) { // Try up to 100 times
			let X = width - 2 - Math.floor(Math.random() * width/4);
			let Y = 1 + Math.floor(Math.random() * (height - 2));
			if (KinkyDungeonGroundTiles.includes(KinkyDungeonMapGet(X, Y))) {
				KinkyDungeonMapSet(X, Y, 's');
				L = 0;
			}
		}

}


function KinkyDungeonReplaceDoodads(Chance, width, height) {
	for (let X = 1; X < width; X += 1)
		for (let Y = 1; Y < height; Y += 1)
			if (KinkyDungeonMapGet(X, Y) == '1' && Math.random() < Chance) {
				KinkyDungeonMapSet(X, Y, 'X');
			}

}

function KinkyDungeonCreateMaze(VisitedRooms, width, height, openness, density) {
	// Variable setup

	var Walls = {};
	var WallsList = {};
	var VisitedCells = {};

	// Initialize the first cell in our Visited Cells list

	VisitedCells[VisitedRooms[0].x + "," + VisitedRooms[0].y] = {x:VisitedRooms[0].x, y:VisitedRooms[0].y};

	// Walls are basically even/odd pairs.
	for (let X = 2; X < width; X += 2)
		for (let Y = 1; Y < height; Y += 2)
			if (KinkyDungeonMapGet(X, Y) == '1') {
				Walls[X + "," + Y] = {x:X, y:Y};
			}
	for (let X = 1; X < width; X += 2)
		for (let Y = 2; Y < height; Y += 2)
			if (KinkyDungeonMapGet(X, Y) == '1') {
				Walls[X + "," + Y] = {x:X, y:Y};
			}

	// Setup the wallslist for the first room
	KinkyDungeonMazeWalls(VisitedRooms[0], Walls, WallsList);

	// Per a randomized primm algorithm from Wikipedia, we loop through the list of walls until there are no more walls

	var WallKeys = Object.keys(WallsList);
	var CellKeys = Object.keys(VisitedCells);

	while (WallKeys.length > 0) {
		var I = Math.floor(Math.random() * WallKeys.length);
		var wall = Walls[WallKeys[I]];
		var unvisitedCell = null;

		// Check if wall is horizontal or vertical and determine if there is a single unvisited cell on the other side of the wall
		if (wall.x % 2 == 0) { //horizontal wall
			if (!VisitedCells[(wall.x-1) + "," + wall.y]) unvisitedCell = {x:wall.x-1, y:wall.y};
			if (!VisitedCells[(wall.x+1) + "," + wall.y]) {
				if (unvisitedCell) unvisitedCell = null;
				else unvisitedCell = {x:wall.x+1, y:wall.y};
			}
		} else { //vertical wall
			if (!VisitedCells[wall.x + "," + (wall.y-1)]) unvisitedCell = {x:wall.x, y:wall.y-1};
			if (!VisitedCells[wall.x + "," + (wall.y+1)]) {
				if (unvisitedCell) unvisitedCell = null;
				else unvisitedCell = {x:wall.x, y:wall.y+1};
			}
		}

		// We only add a new cell if only one of the cells is unvisited
		if (unvisitedCell) {
			delete Walls[wall.x + "," + wall.y];

			KinkyDungeonMapSet(wall.x, wall.y, '0');
			KinkyDungeonMapSet(unvisitedCell.x, unvisitedCell.y, '0');
			VisitedCells[unvisitedCell.x + "," + unvisitedCell.y] = unvisitedCell;

			KinkyDungeonMazeWalls(unvisitedCell, Walls, WallsList);
		}

		// Either way we remove this wall from consideration
		delete WallsList[wall.x + "," + wall.y];

		// Chance of spawning a room!
		if (Math.random() < 0.1 - 0.015*density) {
			var size = 1+Math.ceil(Math.random() * (openness));

			// We open up the tiles
			for (let XX = wall.x; XX < wall.x +size; XX++)
				for (let YY = wall.y; YY < wall.y+size; YY++) {
					KinkyDungeonMapSet(XX, YY, '0');
					VisitedCells[XX + "," + YY] = {x:XX, y:YY};
					KinkyDungeonMazeWalls({x:XX, y:YY}, Walls, WallsList);
					delete Walls[XX + "," + YY];
				}

			// We also remove all walls inside the room from consideration!
			for (let XX = wall.x; XX < wall.x +size; XX++)
				for (let YY = wall.y; YY < wall.y+size; YY++) {
					delete WallsList[XX + "," + YY];
				}
		}

		// Update keys

		WallKeys = Object.keys(WallsList);
		CellKeys = Object.keys(VisitedCells);
	}

}

function KinkyDungeonMazeWalls(Cell, Walls, WallsList) {
	if (Walls[(Cell.x+1) + "," + Cell.y]) WallsList[(Cell.x+1) + "," + Cell.y] = {x:Cell.x+1, y:Cell.y};
	if (Walls[(Cell.x-1) + "," + Cell.y]) WallsList[(Cell.x-1) + "," + Cell.y] = {x:Cell.x-1, y:Cell.y};
	if (Walls[Cell.x + "," + (Cell.y+1)]) WallsList[Cell.x + "," + (Cell.y+1)] = {x:Cell.x, y:Cell.y+1};
	if (Walls[Cell.x + "," + (Cell.y-1)]) WallsList[Cell.x + "," + (Cell.y-1)] = {x:Cell.x, y:Cell.y-1};
}

function KinkyDungeonMapSet(X, Y, SetTo, VisitedRooms) {
	var height = KinkyDungeonGridHeight;
	var width = KinkyDungeonGridWidth;

	if (X > 0 && X < width-1 && Y > 0 && Y < height-1) {
		KinkyDungeonGrid = KinkyDungeonGrid.replaceAt(X + Y*(width+1), SetTo);
		if (VisitedRooms)
			VisitedRooms.push({x: X, y: Y});
		return true;
	}
	return false;
}

function KinkyDungeonMapGet(X, Y) {
	var height = KinkyDungeonGrid.split('\n').length;
	var width = KinkyDungeonGrid.split('\n')[0].length;

	return KinkyDungeonGrid[X + Y*(width+1)];
}

function KinkyDungeonLightSet(X, Y, SetTo) {
	var height = KinkyDungeonGridHeight;
	var width = KinkyDungeonGridWidth;

	if (X >= 0 && X <= width-1 && Y >= 0 && Y <= height-1) {
		KinkyDungeonLightGrid = KinkyDungeonLightGrid.replaceAt(X + Y*(width+1), SetTo);
		return true;
	}
	return false;
}

function KinkyDungeonLightGet(X, Y) {
	var height = KinkyDungeonLightGrid.split('\n').length;
	var width = KinkyDungeonLightGrid.split('\n')[0].length;

	return KinkyDungeonLightGrid[X + Y*(width+1)];
}

const canvasOffsetX = 500;
const canvasOffsetY = 164;



// returns an object containing coordinates of which direction the player will move after a click, plus a time multiplier
function KinkyDungeonGetDirection(dx, dy) {

	var X = 0;
	var Y = 0;

	if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5)
		return {x:0, y:0, delta:1};

	// Cardinal directions first - up down left right
	if (dy > 0 && Math.abs(dx) < Math.abs(dy)/2.61312593) Y = 1;
	else if (dy < 0 && Math.abs(dx) < Math.abs(dy)/2.61312593) Y = -1;
	else if (dx > 0 && Math.abs(dy) < Math.abs(dx)/2.61312593) X = 1;
	else if (dx < 0 && Math.abs(dy) < Math.abs(dx)/2.61312593) X = -1;

	// Diagonals
	else if (dy > 0 && dx > dy/2.61312593) {Y = 1; X = 1;}
	else if (dy > 0 && -dx > dy/2.61312593) {Y = 1; X = -1;}
	else if (dy < 0 && dx > -dy/2.61312593) {Y = -1; X = 1;}
	else if (dy < 0 && -dx > -dy/2.61312593) {Y = -1; X = -1;}

	return {x:X, y:Y, delta:Math.round(Math.sqrt(X*X+Y*Y)*2)/2}; // Delta is always in increments of 0.5
}

// GetDirection, but it also pivots randomly 45 degrees to either side
function KinkyDungeonGetDirectionRandom(dx, dy) {
	var dir = KinkyDungeonGetDirection(dx, dy);
	var pivot = Math.floor(Math.random()*3)-1;

	if (dir.x == 0 && dir.y == 1) dir.x = pivot;
	else if (dir.x == 0 && dir.y == -1) dir.x = -pivot;
	else if (dir.x == 1 && dir.y == 0) dir.y = pivot;
	else if (dir.x == -1 && dir.y == 0) dir.y = -pivot;
	else if (dir.x == 1 && dir.y == 1) {if (pivot == 1) {dir.y = 0;} else if (pivot == -1) {dir.x = 0;}}
	else if (dir.x == 1 && dir.y == -1) {if (pivot == 1) {dir.x = 0;} else if (pivot == -1) {dir.y = 0;}}
	else if (dir.x == -1 && dir.y == 1) {if (pivot == 1) {dir.x = 0;} else if (pivot == -1) {dir.y = 0;}}
	else if (dir.x == -1 && dir.y == -1) {if (pivot == 1) {dir.y = 0;} else if (pivot == -1) {dir.x = 0;}}

	dir.delta = Math.round(Math.sqrt(dir.x*dir.x+dir.y*dir.y)*2)/2;
	return dir; // Delta is always in increments of 0.5
}


// Click function for the game portion
function KinkyDungeonClickGame(Level) {
	// First we handle buttons
	if (KinkyDungeonHandleHUD()) {
		return;
	}
	// beep


	// If no buttons are clicked then we handle move
	else {
		KinkyDungeonSetMoveDirection();
		
		if (KinkyDungeonTargetingSpell) {
			if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
				if (KinkyDungeonSpellValid) {
					KinkyDungeonCastSpell(KinkyDungeonTargetX, KinkyDungeonTargetY, KinkyDungeonTargetingSpell);
					KinkyDungeonAdvanceTime(1);
					KinkyDungeonTargetingSpell = null;
				}
			} else KinkyDungeonTargetingSpell = null;
		} else if (MouseIn(canvasOffsetX, canvasOffsetY, KinkyDungeonCanvas.width, KinkyDungeonCanvas.height)) {
			KinkyDungeonMove(KinkyDungeonMoveDirection, 1);
		}
	}
}

function KinkyDungeonGameKeyDown() {
	var moveDirection = null;


	// Cardinal moves
	if ((KeyPress == KinkyDungeonKey[0])) moveDirection = KinkyDungeonGetDirection(0, -1);
	else if ((KeyPress == KinkyDungeonKey[1])) moveDirection = KinkyDungeonGetDirection(-1, 0);
	else if ((KeyPress == KinkyDungeonKey[2])) moveDirection = KinkyDungeonGetDirection(0, 1);
	else if ((KeyPress == KinkyDungeonKey[3])) moveDirection = KinkyDungeonGetDirection(1, 0);
	// Diagonal moves
	else if ((KeyPress == KinkyDungeonKey[4])) moveDirection = KinkyDungeonGetDirection(-1, -1);
	else if ((KeyPress == KinkyDungeonKey[5])) moveDirection = KinkyDungeonGetDirection(1, -1);
	else if ((KeyPress == KinkyDungeonKey[6])) moveDirection = KinkyDungeonGetDirection(-1, 1);
	else if ((KeyPress == KinkyDungeonKey[7])) moveDirection = KinkyDungeonGetDirection(1, 1);


	/*	if ((KeyPress == KinkyDungeonKey[0]) || (KeyPress == KinkyDungeonKeyLower[0]) || (KeyPress == KinkyDungeonKeyNumpad[0])) moveDirection = KinkyDungeonGetDirection(0, -1);
	else if ((KeyPress == KinkyDungeonKey[1]) || (KeyPress == KinkyDungeonKeyLower[1]) || (KeyPress == KinkyDungeonKeyNumpad[1])) moveDirection = KinkyDungeonGetDirection(-1, 0);
	else if ((KeyPress == KinkyDungeonKey[2]) || (KeyPress == KinkyDungeonKeyLower[2]) || (KeyPress == KinkyDungeonKeyNumpad[2])) moveDirection = KinkyDungeonGetDirection(0, 1);
	else if ((KeyPress == KinkyDungeonKey[3]) || (KeyPress == KinkyDungeonKeyLower[3]) || (KeyPress == KinkyDungeonKeyNumpad[3])) moveDirection = KinkyDungeonGetDirection(1, 0);
	// Diagonal moves
	else if ((KeyPress == KinkyDungeonKey[4]) || (KeyPress == KinkyDungeonKeyLower[4]) || (KeyPress == KinkyDungeonKeyNumpad[4])) moveDirection = KinkyDungeonGetDirection(-1, -1);
	else if ((KeyPress == KinkyDungeonKey[5]) || (KeyPress == KinkyDungeonKeyLower[5]) || (KeyPress == KinkyDungeonKeyNumpad[5])) moveDirection = KinkyDungeonGetDirection(1, -1);
	else if ((KeyPress == KinkyDungeonKey[6]) || (KeyPress == KinkyDungeonKeyLower[6]) || (KeyPress == KinkyDungeonKeyNumpad[6])) moveDirection = KinkyDungeonGetDirection(-1, 1);
	else if ((KeyPress == KinkyDungeonKey[7]) || (KeyPress == KinkyDungeonKeyLower[7]) || (KeyPress == KinkyDungeonKeyNumpad[7])) moveDirection = KinkyDungeonGetDirection(1, 1);
	*/
	else if (KinkyDungeonKeyWait.includes(KeyPress)) moveDirection = KinkyDungeonGetDirection(0, 0);

	if (moveDirection) {
		KinkyDungeonMove(moveDirection, 1);
	} else if (KinkyDungeonKeySpell.includes(KeyPress)) {
		KinkyDungeonSpellPress = KeyPress;
		KinkyDungeonHandleSpell();
	}




}

function KinkyDungeonSendTextMessage(priority, text, color, time) {
	if ( priority >= KinkyDungeonTextMessagePriority) {
		KinkyDungeonTextMessageTime = time;
		KinkyDungeonTextMessage = text;
		KinkyDungeonTextMessageColor = color;
		KinkyDungeonTextMessagePriority = priority;
		return true;
	}
	return false;
}


function KinkyDungeonSendActionMessage(priority, text, color, time) {
	if ( priority >= KinkyDungeonActionMessagePriority) {
		KinkyDungeonActionMessageTime = time;
		KinkyDungeonActionMessage = text;
		KinkyDungeonActionMessageColor = color;
		KinkyDungeonActionMessagePriority = priority;
		return true;
	}
	return false;
}


function KinkyDungeonMove(moveDirection, delta) {
	var moveX = moveDirection.x + KinkyDungeonPlayerEntity.x;
	var moveY = moveDirection.y + KinkyDungeonPlayerEntity.y;
	var Enemy = KinkyDungeonEnemyAt(moveX, moveY);
	if (Enemy && KinkyDungeonStatStamina + KinkyDungeonStaminaRate >= KinkyDungeonStatStaminaCostAttack) {
		KinkyDungeonAttackEnemy(Enemy, {damage: KinkyDungeonPlayerDamage, type: KinkyDungeonPlayerDamageType});

		KinkyDungeonStatStamina += KinkyDungeonStatStaminaCostAttack;

		KinkyDungeonAdvanceTime(1);
	} else {
		if (moveDirection.x == 0 && moveDirection.y == 0) KinkyDungeonDoorCloseTimer = 0; // Allow manually waiting to turn around and be able to slam a door
		else if (KinkyDungeonLastMoveDirection && !(KinkyDungeonLastMoveDirection.x == 0 && KinkyDungeonLastMoveDirection.y == 0) && (Math.abs(KinkyDungeonLastMoveDirection.x - moveDirection.x) + Math.abs(KinkyDungeonLastMoveDirection.y - moveDirection.y)) <= 1) {
			KinkyDungeonDoorCloseTimer = Math.max(KinkyDungeonDoorCloseTimer, 1); // if you are running in the same direction you cant close the door without turning around. this also helps speed up the game
		}
		
		var moveObject = KinkyDungeonMapGet(moveX, moveY);
		if (KinkyDungeonMovableTiles.includes(moveObject) && KinkyDungeonNoEnemy(moveX, moveY)) { // If the player can move to an empy space or a door

			if (KinkyDungeonTiles["" + moveX + "," + moveY] && ((moveObject == 'd' && KinkyDungeonTargetTile == null && KinkyDungeonNoEnemy(moveX, moveY, true) && KinkyDungeonDoorCloseTimer <= 0) || KinkyDungeonTiles["" + moveX + "," + moveY].Type != "Door") ) {
				KinkyDungeonTargetTileLocation = "" + moveX + "," + moveY;
				KinkyDungeonTargetTile = KinkyDungeonTiles[KinkyDungeonTargetTileLocation];
				KinkyDungeonSendTextMessage(2, TextGet("KinkyDungeonObject" + KinkyDungeonTargetTile.Type).replace("TYPE", TextGet("KinkyDungeonShrine" + KinkyDungeonTargetTile.Name)), "white", 1);
				KinkyDungeonDoorCloseTimer = 2; // To avoid cases with severe annoyance while walking through halls with lots of doors
			} else {
				if (KinkyDungeonDoorCloseTimer > 0) KinkyDungeonDoorCloseTimer -= 1;
				KinkyDungeonTargetTile = null;
				KinkyDungeonTargetTileLocation = "";
				if (moveObject == 'D') { // Open the door
					KinkyDungeonMapSet(moveX, moveY, 'd');
					KinkyDungeonDoorCloseTimer = 1;
				} else if (moveObject == 'C') { // Open the chest
					KinkyDungeonLoot(MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint], "chest");
					KinkyDungeonMapSet(moveX, moveY, 'c');
				} else {// Move
					if (KinkyDungeonStatStamina > 0) { // You can only move if your stamina is > 0
						KinkyDungeonMovePoints = Math.min(Math.ceil(KinkyDungeonSlowLevel + 1), KinkyDungeonMovePoints + delta); // Can't store extra move points

						if (KinkyDungeonMovePoints >= Math.max(1, KinkyDungeonSlowLevel)) { // You need more move points than your slow level, unless your slow level is 1 
							KinkyDungeonMoveTo(moveX, moveY);
							
						}
						
						// Messages to inform player they are slowed
						if (KinkyDungeonSlowLevel > 0) {
							if (KinkyDungeonSlowLevel == 1) KinkyDungeonSendTextMessage(0, TextGet("KinkyDungeonSlowed"), "yellow", 2);
							else if (KinkyDungeonSlowLevel == 2) KinkyDungeonSendTextMessage(0, TextGet("KinkyDungeonHopping"), "orange", 2);
							else if (KinkyDungeonSlowLevel == 3) KinkyDungeonSendTextMessage(0, TextGet("KinkyDungeonInching"), "red", 2);
							else if (KinkyDungeonSlowLevel < 10) KinkyDungeonSendTextMessage(0, TextGet("KinkyDungeonCrawling"), "red", 2);
							else KinkyDungeonSendTextMessage(0, TextGet("KinkyDungeonCantMove"), "red", 2);

							if ((moveDirection.x != 0 || moveDirection.y != 0)) {
								KinkyDungeonStatStamina += (KinkyDungeonStatStaminaRegenPerSlowLevel * KinkyDungeonSlowLevel) * delta;
								KinkyDungeonStatWillpowerExhaustion = Math.max(1, KinkyDungeonStatWillpowerExhaustion);
							} else if (KinkyDungeonStatStamina < KinkyDungeonStatStaminaMax) {
								KinkyDungeonMovePoints = 0;
								KinkyDungeonWaitMessage();
							}
						}
													
						if (moveObject == 'R') {
							KinkyDungeonLoot(MiniGameKinkyDungeonLevel, MiniGameKinkyDungeonCheckpoint, "rubble");

							KinkyDungeonMapSet(moveX, moveY, 'r');
						}
					}
				}
				KinkyDungeonAdvanceTime(1); // was moveDirection.delta, but became too confusing
			}
		} else {
			if (KinkyDungeonGetVisionRadius() <= 1) KinkyDungeonAdvanceTime(1);
		}
	}
	
	KinkyDungeonLastMoveDirection = moveDirection;
}

function KinkyDungeonWaitMessage() {
	if (KinkyDungeonStatWillpowerExhaustion > 1) KinkyDungeonSendActionMessage(3, TextGet("WaitSpellExhaustion"), "orange", 2);
	else KinkyDungeonSendActionMessage(1, TextGet("Wait"), "yellow", 2);
}

function KinkyDungeonMoveTo(moveX, moveY) {
	if (KinkyDungeonNoEnemy(moveX, moveY, true)) {
		KinkyDungeonPlayerEntity.x = moveX;
		KinkyDungeonPlayerEntity.y = moveY;
		
		KinkyDungeonMovePoints = 0;
	}
}

function KinkyDungeonAdvanceTime(delta) {
	//let now = performance.now()
	// Here we move enemies and such
	KinkyDungeonUpdateLightGrid = true;
	if (KinkyDungeonTextMessageTime > 0) KinkyDungeonTextMessageTime -= 1;
	if (KinkyDungeonTextMessageTime <= 0) KinkyDungeonTextMessagePriority = 0;
	if (KinkyDungeonActionMessageTime > 0) KinkyDungeonActionMessageTime -= 1;
	if (KinkyDungeonActionMessageTime <= 0) KinkyDungeonActionMessagePriority = 0;

	// Updates the character's stats
	KinkyDungeonItemCheck(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y, MiniGameKinkyDungeonLevel); //console.log("Item Check " + (performance.now() - now));
	KinkyDungeonUpdateBuffs();
	KinkyDungeonUpdateBullets(delta); //console.log("Bullets Check " + (performance.now() - now));
	KinkyDungeonUpdateEnemies(delta); //console.log("Enemy Check " + (performance.now() - now));
	KinkyDungeonUpdateBulletsCollisions(delta); //console.log("Bullet Check " + (performance.now() - now));
	KinkyDungeonUpdateStats(delta);


	if (KinkyDungeonMapGet(KinkyDungeonPlayerEntity.x, KinkyDungeonPlayerEntity.y) == 's') { // Go down the next stairs
		MiniGameKinkyDungeonLevel += 1;
		KinkyDungeonSetCheckPoint();

		KinkyDungeonSendActionMessage(10, TextGet("ClimbDown"), "#ffffff", 1);

		if (MiniGameKinkyDungeonLevel >= KinkyDungeonMaxLevel) {
			KinkyDungeonState = "End";
			MiniGameVictory = true;
		} else
			KinkyDungeonCreateMap(KinkyDungeonMapParams[KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]], MiniGameKinkyDungeonLevel, KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]);
	} else if (KinkyDungeonStatWillpower == 0) {
		KinkyDungeonState = "Lose";
	}


}

