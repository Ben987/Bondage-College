"use strict";
var KinkyDungeonBackground = "BrickWall";
var KinkyDungeonPlayer = null
var KinkyDungeonState = "Menu"

/**
 * Loads the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonLoad() {
	//KinkyDungeonCreateMap(MiniGameDifficulty);
	var appearance = CharacterAppearanceStringify(Player)
	CharacterAppearanceRestore(KinkyDungeonPlayer, appearance)
	CharacterReleaseTotal(KinkyDungeonPlayer)
	CharacterNaked(KinkyDungeonPlayer)
	InventoryWear(KinkyDungeonPlayer, "WitchHat1", "Hat")
	InventoryWear(KinkyDungeonPlayer, "WeddingDress1", "Cloth")
	CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, "#444444", "Cloth");
	
	KinkyDungeonState = "Menu"
}

/**
 * Runs the kinky dungeon game and draws its components on screen
 * @returns {void} - Nothing
 */
function KinkyDungeonRun() {

	// Draw the characters
	DrawCharacter(KinkyDungeonPlayer, 0, 0, 1);


	
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	
	if (KinkyDungeonState == "Menu") {
		// Draw temp start screen
		DrawText(TextGet("Intro"), 1250, 400, "white", "silver");
		DrawText(TextGet("Intro2"), 1250, 500, "white", "silver");
		DrawText(TextGet("Intro3"), 1250, 600, "white", "silver");
		DrawButton(1075, 750, 350, 64, TextGet("GameStart"), "White", "");
	} else if (KinkyDungeonState == "Game") {
		KinkyDungeonDrawGame();
	}

}

/**
 * Handles clicks during the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) {
		KinkyDungeonExit()
	}
	if (KinkyDungeonState == "Menu") {
		if (MouseIn(1075, 750, 350, 64)) {
			KinkyDungeonCreateMap(1)
			KinkyDungeonState = "Game"
		}
	} else if (KinkyDungeonState == "Game") {
		KinkyDungeonClickGame();
	}
}

/**
 * Handles exit during the kinky dungeon game
 * @returns {void} - Nothing
 */
function KinkyDungeonExit() {
	CommonDynamicFunction(MiniGameReturnFunction + "()");
}