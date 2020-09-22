"use strict";
var CollegeTennisBackground = "CollegeTennis";
var CollegeTennisJennifer = null;
var CollegeTennisJenniferStatus = "";
var CollegeTennisJenniferWillJoinRoom = false;

/**
 * Checks if Jennifer is currently in the given status.
 * @param {string} QueryStatus - Status to query
 * @returns {boolean} - Returns TRUE if Jennifer is currently in that status
 */
function CollegeTennisJenniferStatusIs(QueryStatus) { return (QueryStatus == CollegeTennisJenniferStatus) }
/**
 * Checks if the player can invite a new character to a private room. (Used for Jennifer.)
 * @returns {boolean} - Returns TRUE if the player has a private room and an empty spot in it.
 */
function CollegeTennisCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax)) }

/**
 * Loads the tennis screen by generating Jennifer. The player's relationship with her from the bondage college is taken into consideration.
 * @returns {void} - Nothing
 */
function CollegeTennisLoad() {

	// Sets Jennifer current relationship with the player
	if (LogQuery("BondageCollege", "Import")) CollegeTennisJenniferStatus = "SchoolMate";
	if (LogQuery("JenniferLover", "NPC-Jennifer") && (Player.Lover == "NPC-Jennifer")) CollegeTennisJenniferStatus = "Lover";
	if (LogQuery("JenniferLover", "NPC-Jennifer") && (Player.Lover != "NPC-Jennifer")) CollegeTennisJenniferStatus = "ExLover";
	if (LogQuery("JenniferCollared", "NPC-Jennifer")) CollegeTennisJenniferStatus = "Owned";
	if (LogQuery("JenniferMistress", "NPC-Jennifer") && (Player.Owner == "NPC-Jennifer")) CollegeTennisJenniferStatus = "Owner";
	if (LogQuery("JenniferMistress", "NPC-Jennifer") && (Player.Owner != "NPC-Jennifer")) CollegeTennisJenniferStatus = "ExOwner";
	if (PrivateCharacter.length > 1)
		for (let P = 1; P < PrivateCharacter.length; P++)
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
			InventoryWear(CollegeTennisJennifer, "Eyes5", "Eyes2", "#ffa239");
			InventoryWear(CollegeTennisJennifer, "Mouth", "Mouth", "Default");
			InventoryWear(CollegeTennisJennifer, "H0980", "Height", "Default");
			InventoryWear(CollegeTennisJennifer, "Small", "BodyUpper", "White");
			InventoryWear(CollegeTennisJennifer, "Small", "BodyLower", "White");
			InventoryWear(CollegeTennisJennifer, "Default", "Hands", "White");
			InventoryWear(CollegeTennisJennifer, "Default", "Head", "White");
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

/**
 * Runs and draws the tennis screen. Shows the player and Jennifer
 * @returns {void} - Nothing
 */
function CollegeTennisRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(CollegeTennisJennifer, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles clicks in the tennis court screen
 * @returns {void} - Nothing
 */
function CollegeTennisClick() {
	if (MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(CollegeTennisJennifer);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * Starts the tennis mini game on the given difficulty. The player is equipped with a racket.
 * @param {number} Difficulty - Difficulty factor of the minigame
 * @returns {void} - Nothing
 */
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

/**
 * Triggered when the tennis game ends. Winning opens a dialog option to allow the player to invite Jennifer to their room.
 * @returns {void} - Nothing
 */
function CollegeTennisGameEnd() {
	CommonSetScreen("Room", "CollegeTennis");
	CharacterSetCurrent(CollegeTennisJennifer);
	if ((MiniGameDifficulty == "Hard") && MiniGameVictory && (CollegeTennisJennifer.Name != "Jennifer")) CharacterChangeMoney(Player, 50);
	if (CollegeTennisJennifer.Name == "Jennifer") CollegeTennisJennifer.Stage = MiniGameVictory ? "100" : "200";
	else CollegeTennisJennifer.Stage = MiniGameVictory ? "1100" : "1200";
	CollegeTennisJennifer.CurrentDialog = DialogFind(CollegeTennisJennifer, MiniGameVictory ? "TennisVictory" : "TennisDefeat");
	CollegeTennisJenniferWillJoinRoom = ((CollegeTennisJennifer.Name == "Jennifer") && MiniGameVictory && (MiniGameDifficulty != "Easy") && (CollegeTennisJenniferStatus != "Lover") && (CollegeTennisJenniferStatus != "Owned") && (CollegeTennisJenniferStatus != "Owner") && LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax));
}

/**
 * Triggered when Jennifer is invited to the player's private room. The player earns a tennis racket.
 * @returns {void} - Nothing
 */
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
		NPCEventAdd(C, "Girlfriend", CurrentTime);
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
