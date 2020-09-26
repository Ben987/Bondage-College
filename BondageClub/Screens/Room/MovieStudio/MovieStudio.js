"use strict";
var MovieStudioBackground = "MovieStudio";
var MovieStudioDirectory = null;
var MovieStudioCurrentMovie = "";

/**
 * Loads the Movie Studio introduction room screen
 * @returns {void} - Nothing
 */
function MovieStudioLoad() {
	if (MovieStudioDirectory == null) {		
		MovieStudioDirectory = CharacterLoadNPC("NPC_MovieStudio_Director");
		InventoryWear(MovieStudioDirectory, "SunGlasses1", "Glasses");
		InventoryWear(MovieStudioDirectory, "AdmiralTop", "Cloth");
		InventoryWear(MovieStudioDirectory, "AdmiralSkirt", "ClothLower");
		MovieStudioDirectory.AllowItem = false;
	}
}

/**
 * Runs and draws the Movie Studio screen
 * @returns {void} - Nothing
 */
function MovieStudioRun() {
	if (MovieStudioCurrentMovie == "") {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(MovieStudioDirectory, 1000, 0, 1);
	}
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Leave"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles clicks in the Movie Studio screen
 * @returns {void} - Nothing
 */
function MovieStudioClick() {
	if ((MovieStudioCurrentMovie == "") && MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if ((MovieStudioCurrentMovie == "") && MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(MovieStudioDirectory);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}