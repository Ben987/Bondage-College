"use strict";
var AsylumBedroomBackground = "AsylumBedroom";

// Loads the room
function AsylumBedroomLoad() {
}

// Runs the room
function AsylumBedroomRun() {
	DrawCharacter(Player, 750, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the room
function AsylumBedroomClick() {
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "AsylumEntrance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}