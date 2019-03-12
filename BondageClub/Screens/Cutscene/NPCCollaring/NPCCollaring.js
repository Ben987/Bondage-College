"use strict";
var NPCCollaringBackground = "Management";
var NPCCollaringSub = null;
var NPCCollaringMistressLeft = null;
var NPCCollaringMistressRight = null;
var NPCCollaringGirlLeft = null;
var NPCCollaringGirlRight = null;

// Loads the collaring NPCs
function NPCCollaringLoad() {
	CutsceneStage = 0;
	NPCCollaringMistressLeft = CharacterLoadNPC("NPC_MistressLeft");
	NPCCollaringMistressRight = CharacterLoadNPC("NPC_MistressRight");
	NPCCollaringGirlLeft = CharacterLoadNPC("NPC_GirlLeft");
	NPCCollaringGirlRight = CharacterLoadNPC("NPC_GirlRight");
}

// Runs the collaring cutscene
function NPCCollaringRun() {
	DrawCharacter(Player, 900, 0, 1);
	DrawCharacter(NPCCollaringMistressLeft, 200, 0, 1);
	DrawCharacter(NPCCollaringMistressRight, 1300, 0, 1);
	if (CutsceneStage > 0) DrawCharacter(NPCCollaringSub, 600, 0, 1);
	if (CutsceneStage > 0) DrawCharacter(NPCCollaringGirlLeft, -200, 100, 1);
	if (CutsceneStage > 0) DrawCharacter(NPCCollaringGirlRight, 1700, 100, 1);
	DrawText(TextGet("NPCCollaring" + CutsceneStage.toString()), 1000, 980, "White", "Black");
}

// When the user clicks in the management room
function NPCCollaringClick() {
	CutsceneStage++;
	if (CutsceneStage == 2) CharacterNaked(NPCCollaringSub);
	if (CutsceneStage == 4) CharacterSetActivePose(NPCCollaringSub, "Kneel");
	if (CutsceneStage == 6) InventoryWear(NPCCollaringSub, "SlaveCollar", "ItemNeck");
	if (CutsceneStage > 8) {
		ServerPrivateCharacterSync();
		CommonSetScreen("Room", "Private");
		CharacterSetCurrent(NPCCollaringSub);
		NPCCollaringSub.CurrentDialog = DialogFind(NPCCollaringSub, "SubmissiveVow");
	}
}