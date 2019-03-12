"use strict";
var PlayerMistressBackground = "Management";
var PlayerMistressMistressLeft = null;
var PlayerMistressMistressRight = null;
var PlayerMistressMaidLeft = null;
var PlayerMistressMaidRight = null;

// Loads the player mistress NPCs
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

// Runs the Mistress cutscene
function PlayerMistressRun() {
	DrawCharacter(Player, 750, 0, 1);
	DrawCharacter(PlayerMistressMistressLeft, 250, 0, 1);
	DrawCharacter(PlayerMistressMistressRight, 1250, 0, 1);
	if (CutsceneStage > 2) DrawCharacter(PlayerMistressMaidLeft, -200, 100, 1);
	if (CutsceneStage > 2) DrawCharacter(PlayerMistressMaidRight, 1700, 100, 1);
	DrawText(TextGet("PlayerMistress" + CutsceneStage.toString()), 1000, 980, "White", "Black");
}

// When the user clicks in the cutscene
function PlayerMistressClick() {
	CutsceneStage++;
	if (CutsceneStage > 5) CommonSetScreen("Room", "Management");
}