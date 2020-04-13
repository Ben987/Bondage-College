"use strict";
var LARPBackground = "WrestlingRing";
var LARPOrganiser = null;

// Loads the LARP screen NPC
function LARPLoad() {
	if (LARPOrganiser == null) {		
		LARPOrganiser = CharacterLoadNPC("NPC_LARP_Organiser");
		CharacterNaked(LARPOrganiser);
		InventoryWear(LARPOrganiser, "SteampunkCorsetTop1", "Cloth", "Default");
		InventoryWear(LARPOrganiser, "LatexSkirt2", "ClothLower", "#666666");
		InventoryWear(LARPOrganiser, "Sandals", "Shoes", "#666666");
		LARPOrganiser.AllowItem = false;
	}
}

// Run the LARP screen
function LARPRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(LARPOrganiser, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Leave"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if ((ReputationGet("LARP") >= 1) && (Player.Game != null) && (Player.Game.LARP != null) && (Player.Game.LARP.Class != null)) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Battle.png", TextGet("Battle"));
}

// When the user clicks in the LARP screen
function LARPClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(LARPOrganiser);	
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY <= 115)) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY <= 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY <= 355) && (ReputationGet("LARP") >= 1) && (Player.Game != null) && (Player.Game.LARP != null) && (Player.Game.LARP.Class != null)) {
		Player.Game.LARP.Team = "None";
		ServerSend("AccountUpdate", { Game: Player.Game });
		var BG = CommonBackgroundList.slice();
		BG.unshift("WrestlingRing");
		ChatRoomStart("LARP", "LARP", "LARP", "WrestlingRingDark", BG);
	}
}

// When the user selects a class
function LARPSelectClass(NewClass) {
	if (ReputationGet("LARP") <= 0) DialogSetReputation("LARP", 1);
	if (Player.Game == null) Player.Game = {};
	Player.Game.LARP = { Class: NewClass };
	ServerSend("AccountUpdate", { Game: Player.Game });
}