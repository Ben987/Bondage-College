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
	InventoryWear(KinkyDungeonPlayer, "Dress3", "Cloth")
	InventoryWear(KinkyDungeonPlayer, "Socks4", "Socks")
	InventoryWear(KinkyDungeonPlayer, "Heels3", "Shoes")
	
	
	CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, "#444444", "Socks");
	CharacterAppearanceSetColorForGroup(KinkyDungeonPlayer, "#222222", "Shoes");
	
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
	} else if (KinkyDungeonState == "End") {
		// Draw temp start screen
		DrawText(TextGet("End"), 1250, 400, "white", "silver");
		DrawText(TextGet("End2"), 1250, 500, "white", "silver");
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
			KinkyDungeonInitialize(1)
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