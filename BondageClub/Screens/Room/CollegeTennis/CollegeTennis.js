"use strict";
var CollegeTennisBackground = "CollegeTennis";
var CollegeTennisJennifer = null;
var CollegeTennisJenniferStatus = "";
var CollegeTennisJenniferWillJoinRoom = false;

// Returns TRUE if the dialog option should be shown
function CollegeTennisJenniferStatusIs(QueryStatus) { return (QueryStatus == CollegeTennisJenniferStatus) }
function CollegeTennisCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax)) }

// Generates Jennifer
function CollegeTennisLoad() {

	// Sets Jennifer current relationship with the player
	if (LogQuery("BondageCollege", "Import")) CollegeTennisJenniferStatus = "SchoolMate";
	if (LogQuery("JenniferLover", "NPC-Jennifer") && (Player.Lover == "NPC-Jennifer")) CollegeTennisJenniferStatus = "Lover";
	if (LogQuery("JenniferLover", "NPC-Jennifer") && (Player.Lover != "NPC-Jennifer")) CollegeTennisJenniferStatus = "ExLover";
	if (LogQuery("JenniferCollared", "NPC-Jennifer")) CollegeTennisJenniferStatus = "Owned";
	if (LogQuery("JenniferMistress", "NPC-Jennifer") && (Player.Owner == "NPC-Jennifer")) CollegeTennisJenniferStatus = "Owner";
	if (LogQuery("JenniferMistress", "NPC-Jennifer") && (Player.Owner != "NPC-Jennifer")) CollegeTennisJenniferStatus = "ExOwner";
	if (PrivateCharacter.length > 1)
		for (var P = 1; P < PrivateCharacter.length; P++)
			if (PrivateCharacter[P].Name == "Jennifer")
				CollegeTennisJenniferStatus = "Away";

	// Generates a full Jennifer model based on the Bondage College template
	if (CollegeTennisJennifer == null) {
		
		// If Jennifer is away, we generate a random girl
		CollegeTennisJennifer = CharacterLoadNPC("NPC_CollegeTennis_Jennifer");
		CollegeTennisJennifer.AllowItem = false;
		CharacterNaked(CollegeTennisJennifer);			
		if (CollegeTennisJenniferStatus != "Away") {
			CollegeTennisJennifer.Name = "Jennifer";
			InventoryWear(CollegeTennisJennifer, "PussyLight1", "Pussy", "#edd6b0");
			InventoryWear(CollegeTennisJennifer, "Eyes5", "Eyes", "#ffa239");
			InventoryWear(CollegeTennisJennifer, "Mouth1", "Mouth", "Default");
			InventoryWear(CollegeTennisJennifer, "H0980", "Height", "Default");
			InventoryWear(CollegeTennisJennifer, "Small", "BodyUpper", "White");
			InventoryWear(CollegeTennisJennifer, "Small", "BodyLower", "White");
			InventoryWear(CollegeTennisJennifer, "Default", "Hands", "White");
			InventoryWear(CollegeTennisJennifer, "HairBack6", "HairBack", "#8dccce");
			InventoryWear(CollegeTennisJennifer, "HairFront5", "HairFront", "#8dccce");
			InventoryWear(CollegeTennisJennifer, "Bra1", "Bra", "#CCCCCC");
			InventoryWear(CollegeTennisJennifer, "Panties1", "Panties", "#CCCCCC");
			InventoryWear(CollegeTennisJennifer, "Glasses1", "Glasses", "Default");
			if (CollegeTennisJenniferStatus == "Owned") {
				InventoryWear(CollegeTennisJennifer, "SlaveCollar", "ItemNeck");
				CollegeTennisJennifer.Owner = Player.Name;
			}
		} else CollegeTennisJennifer.Stage = 1000;
		InventoryWear(CollegeTennisJennifer, "TennisShirt1", "Cloth", "Default");
		InventoryWear(CollegeTennisJennifer, "TennisSkirt1", "ClothLower", "Default");
		InventoryWear(CollegeTennisJennifer, "Socks1", "Socks", "#CCCCCC");
		InventoryWear(CollegeTennisJennifer, "Sneakers1", "Shoes", "Default");
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

// When the tennis game starts
function CollegeTennisGameStart(Difficulty) {

	// Gives a racket to the player
	InventoryWear(Player, "SpankingToys", "ItemHands");
	InventoryGet(Player, "ItemHands").Property = { Type: "TennisRacket" };
	CharacterRefresh(Player);

	// Starts the match (can bet money on the game if it's not against Jennifer)
	if ((Difficulty == "Hard") && (CollegeTennisJennifer.Name != "Jennifer")) CharacterChangeMoney(Player, -25);
	TennisCharacterLeft = Player;
	TennisCharacterRight = CollegeTennisJennifer;
	MiniGameStart("Tennis", Difficulty, "CollegeTennisGameEnd");

}

// When the tennis game ends (an extra dialog can open to invite Jennifer after winning)
function CollegeTennisGameEnd() {
	CommonSetScreen("Room", "CollegeTennis");
	CharacterSetCurrent(CollegeTennisJennifer);
	if ((MiniGameDifficulty == "Hard") && MiniGameVictory && (CollegeTennisJennifer.Name != "Jennifer")) CharacterChangeMoney(Player, 50);
	if (CollegeTennisJennifer.Name == "Jennifer") CollegeTennisJennifer.Stage = MiniGameVictory ? "100" : "200";
	else CollegeTennisJennifer.Stage = MiniGameVictory ? "1100" : "1200";
	CollegeTennisJennifer.CurrentDialog = DialogFind(CollegeTennisJennifer, MiniGameVictory ? "TennisVictory" : "TennisDefeat");
	CollegeTennisJenniferWillJoinRoom = ((CollegeTennisJennifer.Name == "Jennifer") && MiniGameVictory && (MiniGameDifficulty != "Easy") && (CollegeTennisJenniferStatus != "Lover") && (CollegeTennisJenniferStatus != "Owned") && (CollegeTennisJenniferStatus != "Owner") && LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax));
}

// When the plater invites Jennifer to her room, she also gets a tennis racket
function CollegeTennisInviteToPrivateRoom() {
	InventoryAdd(Player, "SpankingToysTennisRacket", "ItemHands");
	InventoryRemove(CollegeTennisJennifer, "ItemHands");
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(CollegeTennisJennifer, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Submissive", 20);
	NPCTraitSet(C, "Frigid", 80);
	NPCTraitSet(C, "Wise", 40);
	NPCTraitSet(C, "Serious", 30);
	NPCTraitSet(C, "Polite", 60);
	C.Love = 20;
	if (CollegeTennisJennifer.Owner == Player.Name) {
		NPCEventAdd(C, "NPCCollaring", CurrentTime);
		InventoryWear(C, "SlaveCollar", "ItemNeck");
		C.Owner = Player.Name;
		C.Love = 100;
	}
	if (Player.Lover == "NPC-Jennifer") {
		C.Lover = Player.Name;
		C.Love = 100;
	}
	if (Player.Owner == "NPC-Jennifer") {
		NPCEventAdd(C, "PlayerCollaring", CurrentTime);
		NPCEventAdd(C, "LastGift", CurrentTime);
		C.Love = 100;
	}
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
	DialogLeave();
	CharacterAppearanceFullRandom(CollegeTennisJennifer);
	CharacterRandomName(CollegeTennisJennifer);
	CollegeTennisJennifer = null;
}