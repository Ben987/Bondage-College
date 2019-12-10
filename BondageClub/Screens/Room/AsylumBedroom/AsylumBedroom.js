"use strict";
var AsylumBedroomBackground = "AsylumBedroom";

// Loads the room
function AsylumBedroomLoad() {
}

// Runs the room
function AsylumBedroomRun() {
	DrawCharacter(Player, 750, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Entrance"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (LogValue("Committed", "Asylum") >= CurrentTime) {
		DrawButton(1885, 265, 90, 90, "", "White", "Icons/Bedroom.png", TextGet("Sleep"));
		DrawText(TextGet("RemainingTime"), 1800, 915, "white", "gray");
		DrawText(TimerToString(LogValue("Committed", "Asylum") - CurrentTime), 1800, 965, "white", "gray");
	}
}

// When the user clicks in the room
function AsylumBedroomClick() {
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "AsylumEntrance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && (LogValue("Committed", "Asylum") >= CurrentTime)) window.location = window.location;
}