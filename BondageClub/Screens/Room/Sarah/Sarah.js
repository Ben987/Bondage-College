"use strict";
var SarahBackground = "SarahBedroom";
var SarahStatus = "";
var Sarah = null;

// Sets Sarah status
function SarahSetStatus() {
	if (LogQuery("SarahLover", "NPC-Sarah")) SarahStatus = "Lover";
	if (LogQuery("SarahCollared", "NPC-Sarah")) SarahStatus = "Owned";
	if (LogQuery("SarahCollaredWithCurfew", "NPC-Sarah")) SarahStatus = "Curfew";
	if (LogQuery("SarahWillBePunished", "NPC-Sarah")) SarahStatus = "WillBePunished";
	if (LogQuery("SarahCameWithPlayer", "NPC-Sarah")) SarahStatus = "CameWithPlayer";
}

// Loads the Sarah room
function SarahLoad() {

	// If Sarah doesn't exist as a character
	if (Sarah == null) {

		// Creates Sarah and equips her like in the Bondage Club original story
		Sarah = CharacterLoadNPC("NPC_Sarah");
		Sarah.Name = "Sarah";
		Sarah.AllowItem = false;
		CharacterNaked(Sarah);
		InventoryWear(Sarah, "Eyes1", "Eyes", "#b98364");
		InventoryWear(Sarah, "Normal", "BodyUpper", "White");
		InventoryWear(Sarah, "Normal", "BodyLower", "White");
		InventoryWear(Sarah, "Default", "Hands", "White");
		InventoryWear(Sarah, "HairBack19", "HairBack", "#edd6b0");
		InventoryWear(Sarah, "HairFront11", "HairFront", "#edd6b0");
		InventoryWear(Sarah, "Bra1", "Bra", "#a02424");
		InventoryWear(Sarah, "Panties1", "Panties", "#a02424");
		InventoryWear(Sarah, "FourLimbsShackles", "ItemArms");
		InventoryWear(Sarah, "StuddedBlindfold", "ItemHead");
		CharacterSetActivePose(Sarah, "Kneel");

	}

	// If we must show the intro scene
	if (!SarahIntroDone)
		CommonSetScreen("Cutscene", "SarahIntro");

}

// Resets the full Sarah chapter
function SarahReset() {
	Sarah = null;
	SarahStatus = "";
	SarahIntroDone = false;
}

// Run the main introduction room, draw all 3 characters
function SarahRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(Sarah, 1000, -270, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the introduction room
function SarahClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Sarah);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}