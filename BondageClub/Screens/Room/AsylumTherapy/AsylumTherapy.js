"use strict";
var AsylumTherapyBackground = "AsylumTherapy";

// Loads the room
function AsylumTherapyLoad() {
}

// Runs the room
function AsylumTherapyRun() {
	DrawCharacter(Player, 750, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
	if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Naked.png");
}

// When the user clicks in the room
function AsylumTherapyClick() {
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) {
		if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) AsylumEntranceWearPatientClothes(Player);
		CommonSetScreen("Room", "AsylumEntrance");
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) AsylumEntranceWearPatientClothes(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) CharacterNaked(Player);
}