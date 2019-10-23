"use strict";
var CollegeTennisBackground = "CollegeTennis";
var CollegeTennisJennifer = null;

// Generates Jennifer
function CollegeTennisLoad() {
	if (CollegeTennisJennifer == null) {
		CollegeTennisJennifer = CharacterLoadNPC("NPC_CollegeTennis_Jennifer");
		CollegeTennisJennifer.Name = "Jennifer";
		CollegeTennisJennifer.AllowItem = false;
		CharacterNaked(CollegeTennisJennifer);		
		if (LogQuery("JenniferCollared", "NPC-Jennifer")) {
			InventoryWear(CollegeTennisJennifer, "SlaveCollar", "ItemNeck");
			CollegeTennisJennifer.Owner = Player.Name;
		}
		InventoryWear(CollegeTennisJennifer, "PussyLight1", "Pussy", "#edd6b0");
		InventoryWear(CollegeTennisJennifer, "Eyes5", "Eyes", "#ffa239");
		InventoryWear(CollegeTennisJennifer, "Mouth1", "Mouth", "Default");
		InventoryWear(CollegeTennisJennifer, "Small", "BodyUpper", "White");
		InventoryWear(CollegeTennisJennifer, "Small", "BodyLower", "White");
		InventoryWear(CollegeTennisJennifer, "Default", "Hands", "White");
		InventoryWear(CollegeTennisJennifer, "HairBack6", "HairBack", "#8dccce");
		InventoryWear(CollegeTennisJennifer, "HairFront5", "HairFront", "#8dccce");
		InventoryWear(CollegeTennisJennifer, "Bra1", "Bra", "#CCCCCC");
		InventoryWear(CollegeTennisJennifer, "Panties1", "Panties", "#CCCCCC");
		InventoryWear(CollegeTennisJennifer, "TennisShirt1", "Cloth", "Default");
		InventoryWear(CollegeTennisJennifer, "TennisSkirt1", "ClothLower", "Default");
		InventoryWear(CollegeTennisJennifer, "Socks1", "Socks", "#CCCCCC");
		InventoryWear(CollegeTennisJennifer, "Sneakers1", "Shoes", "Default");
		InventoryWear(CollegeTennisJennifer, "Glasses1", "Glasses", "Default");
		InventoryWear(CollegeTennisJennifer, "SpankingToys", "ItemHands");
		InventoryGet(CollegeTennisJennifer, "ItemHands").Property = { Type: "TennisRacket" };
		CharacterRefresh(CollegeTennisJennifer);
	}
}

// Runs the room (shows the player and Jennifer)
function CollegeTennisRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(CollegeTennisJennifer, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

// When the user clicks in the room
function CollegeTennisClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(CollegeTennisJennifer);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}