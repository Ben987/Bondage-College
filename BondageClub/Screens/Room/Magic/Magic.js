"use strict";

var MagicBackground = "Magic";
var MagicPerformer = null;
var MagicPerformerAppearance = null;

var MagicAssistant = null;
var MagicAssistantAppearance = null;

var MagicPlayerAppearance = null;

////////////////////////////////////////////////////////////////////////////////////////////
//General Room function
////////////////////////////////////////////////////////////////////////////////////////////
// functions for Dialogs

// Loads the room characters with many restrains
function MagicLoad() {
	// Default load
	if (MagicPerformer == null) {
		MagicPerformer = CharacterLoadNPC("NPC_Magic_Performer");
		MagicAssistant = CharacterLoadNPC("NPC_Magic_Assistant");
		CharacterRandomUnderwear(MagicAssistant);
	}
}

// Run the Magic, draw all 3 characters
function MagicRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(MagicPerformer, 750, 0, 1);
	DrawCharacter(MagicAssistant, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	//todo button
	DrawButton(1885, 265, 90, 90, "", "White", "Icons/Magic.png");
}

// When the user clicks in the Magic
function MagicClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(MagicPerformer);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(MagicAssistant);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) {}
}

