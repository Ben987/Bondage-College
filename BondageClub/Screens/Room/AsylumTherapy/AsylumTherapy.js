"use strict";
var AsylumTherapyBackground = "AsylumTherapy";
var AsylumTherapyNurse = null;
var AsylumTherapyPatient = null;

// Loads the room
function AsylumTherapyLoad() {
	if (AsylumTherapyNurse == null) {
		AsylumTherapyNurse = CharacterLoadNPC("NPC_AsylumTherapy_Nurse");
		AsylumEntranceWearNurseClothes(AsylumTherapyNurse);
		AsylumTherapyNurse.AllowItem = false;
	}
	if (AsylumTherapyPatient == null) {
		AsylumTherapyPatient = CharacterLoadNPC("NPC_AsylumTherapy_Patient");
		AsylumEntranceWearPatientClothes(AsylumTherapyPatient);
		AsylumTherapyPatient.AllowItem = false;
	}
}

// Runs the room
function AsylumTherapyRun() {
	DrawCharacter(Player, 500, 0, 1);
	if (ReputationGet("Asylum") >= 1) DrawCharacter(AsylumTherapyPatient, 1000, 0, 1);
	if (ReputationGet("Asylum") <= -1) DrawCharacter(AsylumTherapyNurse, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
	if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Naked.png");
}

// When the user clicks in the room
function AsylumTherapyClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && (ReputationGet("Asylum") >= 1)) CharacterSetCurrent(AsylumTherapyPatient);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && (ReputationGet("Asylum") <= -1)) CharacterSetCurrent(AsylumTherapyNurse);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) {
		if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) AsylumEntranceWearPatientClothes(Player);
		CommonSetScreen("Room", "AsylumEntrance");
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) AsylumEntranceWearPatientClothes(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) CharacterNaked(Player);
}

// When the players get ungagged by the nurse
function AsylumTherapyPlayerUngag() {
	DialogChangeReputation("Dominant", -1);
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemMouth");
}