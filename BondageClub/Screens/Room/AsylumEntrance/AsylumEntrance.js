"use strict";
var AsylumEntranceBackground = "AsylumEntrance";
var AsylumEntranceNurse = null;

// Loads the room and generates the nurse
function AsylumEntranceLoad() {
	if (AsylumEntranceNurse == null) {
		AsylumEntranceNurse = CharacterLoadNPC("NPC_AsylumEntrance_Nurse");
		NurseryNurseOutfitForNPC(AsylumEntranceNurse);
		AsylumEntranceNurse.AllowItem = false;
	}
}

// Run the Slave Market
function AsylumEntranceRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(AsylumEntranceNurse, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the Slave Market
function AsylumEntranceClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(AsylumEntranceNurse);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}