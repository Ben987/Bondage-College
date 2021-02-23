"use strict";

var MiniGameKinkyDungeonCheckpoint = 0;
var MiniGameKinkyDungeonLevel = 1;
var KinkyDungeonMapIndex = [];


// Starts the the game at a specified level
function KinkyDungeonCreateMap(Level, Random) {
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
}



// Draw function for the game portion
function KinkyDungeonDrawGame() {
	MiniGameKinkyDungeonCheckpoint = 10*Math.floor(MiniGameKinkyDungeonLevel / 10)
		
	DrawText(TextGet("CurrentLevel") + MiniGameKinkyDungeonLevel, 1000, 72, "white", "silver");
	DrawText(TextGet("DungeonName" + KinkyDungeonMapIndex[MiniGameKinkyDungeonCheckpoint]), 1500, 72, "white", "silver");
}



// Click function for the game portion
function KinkyDungeonClickGame(Level) {

}

