"use strict";
var PlayerMistressBackground = "Management";
var PlayerMistressMistressLeft = null;
var PlayerMistressMistressRight = null;
var PlayerMistressMaidLeft = null;
var PlayerMistressMaidRight = null;

/**
 * Loads the mistress promotion cutscene by creating the random maids and mistress, and setting the stage
 * @returns {void} - Nothing
 */
function PlayerMistressLoad() {
	CutsceneStage = 0;
	PlayerMistressMistressLeft = CharacterLoadNPC("NPC_MistressLeft");
	PlayerMistressMistressRight = CharacterLoadNPC("NPC_MistressRight");
	PlayerMistressMaidLeft = CharacterLoadNPC("NPC_MaidLeft");
	PlayerMistressMaidRight = CharacterLoadNPC("NPC_MaidRight");
	CharacterFullRandomRestrain(PlayerMistressMaidLeft, "Lot");
	CharacterFullRandomRestrain(PlayerMistressMaidRight, "Lot");
	InventoryWear(PlayerMistressMaidLeft, "WoodenMaidTrayFull", "ItemMisc");
	InventoryWear(PlayerMistressMaidRight, "WoodenMaidTrayFull", "ItemMisc");
}

/**
 * Runs and draws the mistress promotion cutscene
 * @returns {void} - Nothing
 */
function PlayerMistressRun() {
	DrawCharacter(Player, 750, 0, 1);
	DrawCharacter(PlayerMistressMistressLeft, 250, 0, 1);
	DrawCharacter(PlayerMistressMistressRight, 1250, 0, 1);
	if (CutsceneStage > 2) DrawCharacter(PlayerMistressMaidLeft, -200, 100, 1);
	if (CutsceneStage > 2) DrawCharacter(PlayerMistressMaidRight, 1700, 100, 1);
	DrawText(TextGet("PlayerMistress" + CutsceneStage.toString()), 1000, 980, "White", "Black");
}

/**
 * Handles clicks during the mistress promotion cutscene. Clicking anywhere on the screen advances the cutscene. At the end of the cutscene, the player stays in the management room but the state goes back to normal.
 * @returns {void} - Nothing
 */
function PlayerMistressClick() {
	CutsceneStage++;
	if (CutsceneStage > 5) CommonSetScreen("Room", "Management");
}