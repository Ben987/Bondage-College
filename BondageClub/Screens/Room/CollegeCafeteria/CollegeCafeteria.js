"use strict";
var CollegeCafeteriaBackground = "CollegeCafeteria";
var CollegeCafeteriaSidney = null;
var CollegeCafeteriaSidneyStatus = "";
var CollegeCafeteriaSidneyLove = 0;
var CollegeCafeteriaStudentRight = null;
var CollegeCafeteriaStudentFarRight = null;

/**
 * Checks, if the query matches the current state of Sidney
 * @param {string} QueryStatus - The query to compare
 * @returns {boolean} - Returns true, if the query matches the state of Sidney, false otherwise
 */
function CollegeCafeteriaSidneyStatusIs(QueryStatus) { return (QueryStatus == CollegeCafeteriaSidneyStatus) }

/**
 * CHecks, if Sidney can be invited to the player's room
 * @returns {boolean} - Returns true, if the player can invite Sidney, false otherwise
 */
function CollegeCafeteriaCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax) && (CollegeCafeteriaSidneyLove > 10)) }

/**
 * Loads the cafeteria and generates Sidney according to her current state
 * @returns {void} - Nothing
 */
function CollegeCafeteriaLoad() {

	// Sets Sidney current relationship with the player
	if (LogQuery("BondageCollege", "Import")) CollegeCafeteriaSidneyStatus = "SchoolMate";
	if (LogQuery("JenniferLover", "NPC-Sidney") && (Player.Lover == "NPC-Sidney")) CollegeCafeteriaSidneyStatus = "Lover";
	if (LogQuery("JenniferLover", "NPC-Sidney") && (Player.Lover != "NPC-Sidney")) CollegeCafeteriaSidneyStatus = "ExLover";
	if (LogQuery("JenniferCollared", "NPC-Sidney")) CollegeCafeteriaSidneyStatus = "Owned";
	if (LogQuery("JenniferMistress", "NPC-Sidney") && (Player.Owner == "NPC-Sidney")) CollegeCafeteriaSidneyStatus = "Owner";
	if (LogQuery("JenniferMistress", "NPC-Sidney") && (Player.Owner != "NPC-Sidney")) CollegeCafeteriaSidneyStatus = "ExOwner";
	if (PrivateCharacter.length > 1)
		for (let P = 1; P < PrivateCharacter.length; P++)
			if (PrivateCharacter[P].Name == "Sidney")
				CollegeCafeteriaSidneyStatus = "Away";

	// Generates a full Sidney model based on the Bondage College template
	if (CollegeCafeteriaSidney == null) {
		
		// If Sidney is away, we generate a random girl
		CollegeCafeteriaSidney = CharacterLoadNPC("NPC_CollegeCafeteria_Sidney");
		CollegeCafeteriaSidney.AllowItem = false;
		if (CollegeCafeteriaSidneyStatus != "Away") {
			CollegeCafeteriaSidney.Name = "Sidney";
			CharacterNaked(CollegeCafeteriaSidney);
			InventoryWear(CollegeCafeteriaSidney, "PussyDark1", "Pussy", "#505050");
			InventoryWear(CollegeCafeteriaSidney, "Eyes10", "Eyes", "#FF0000");
			InventoryWear(CollegeCafeteriaSidney, "Eyes10", "Eyes2", "#FF0000");
			InventoryWear(CollegeCafeteriaSidney, "Mouth", "Mouth", "Default");
			InventoryWear(CollegeCafeteriaSidney, "H0960", "Height", "Default");
			InventoryWear(CollegeCafeteriaSidney, "XLarge", "BodyUpper", "White");
			InventoryWear(CollegeCafeteriaSidney, "XLarge", "BodyLower", "White");
			InventoryWear(CollegeCafeteriaSidney, "Default", "Hands", "White");
			InventoryWear(CollegeCafeteriaSidney, "Default", "Head", "White");
			InventoryWear(CollegeCafeteriaSidney, "HairBack21", "HairBack", "#222222");
			InventoryWear(CollegeCafeteriaSidney, "HairFront6", "HairFront", "#222222");
			InventoryWear(CollegeCafeteriaSidney, "Bandeau1", "Bra", "#222222");
			InventoryWear(CollegeCafeteriaSidney, "StringPanties1", "Panties", "#222222");
			InventoryWear(CollegeCafeteriaSidney, "Boots1", "Shoes", "#222222");
			InventoryWear(CollegeCafeteriaSidney, "CollegeDunce", "Hat", "#A0A080");
			if (CollegeCafeteriaSidneyStatus == "Owned") {
				InventoryWear(CollegeCafeteriaSidney, "SlaveCollar", "ItemNeck");
				CollegeCafeteriaSidney.Owner = Player.Name;
			}
		} else CollegeCafeteriaSidney.Stage = 1000;
		CollegeEntranceWearStudentClothes(CollegeCafeteriaSidney);
		CharacterRefresh(CollegeCafeteriaSidney);

		// Generates two extra girls in the cafeteria line
		CollegeCafeteriaStudentRight = CharacterLoadNPC("NPC_CollegeCafeteria_Right");
		CollegeCafeteriaStudentRight.AllowItem = false;
		CollegeEntranceWearStudentClothes(CollegeCafeteriaStudentRight);
		CollegeCafeteriaStudentFarRight = CharacterLoadNPC("NPC_CollegeCafeteria_FarRight");
		CollegeCafeteriaStudentFarRight.AllowItem = false;
		CollegeEntranceWearStudentClothes(CollegeCafeteriaStudentFarRight);
		
		// Sets the starting love level
		if (CollegeCafeteriaSidneyStatus == "Lover") CollegeCafeteriaSidneyLove = 5;
		if (CollegeCafeteriaSidneyStatus == "ExLover") CollegeCafeteriaSidneyLove = -2;
		if (CollegeCafeteriaSidneyStatus == "Owned") CollegeCafeteriaSidneyLove = 7;
		if (CollegeCafeteriaSidneyStatus == "Owner") CollegeCafeteriaSidneyLove = 3;
		if (CollegeCafeteriaSidneyStatus == "ExOwner") CollegeCafeteriaSidneyLove = -2;

	}

}

/**
 * Runs the room (shows the player and Sidney)
 * @returns {void} - Nothing
 */
function CollegeCafeteriaRun() {
	DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(CollegeCafeteriaSidney, 470, 0, 1);
	DrawCharacter(CollegeCafeteriaStudentRight, 940, 0, 1);
	DrawCharacter(CollegeCafeteriaStudentFarRight, 1410, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function CollegeCafeteriaClick() {
	if (MouseIn(485, 0, 510, 1000)) CharacterSetCurrent(CollegeCafeteriaSidney);
	if (MouseIn(925, 0, 500, 1000)) CharacterSetCurrent(CollegeCafeteriaStudentRight);
	if (MouseIn(1395, 0, 490, 1000)) CharacterSetCurrent(CollegeCafeteriaStudentFarRight);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * When Sidney love towards the player changes
 * @param {string} LoveChange - The amount the love of Sidney changes
 * @param {string} MoneyChange - The amount of money, the plyer looses
 * @returns {void} - Nothing
 */
function CollegeCafeteriaSidneyLoveChange(LoveChange, MoneyChange) {
	if (LoveChange != null) CollegeCafeteriaSidneyLove = CollegeCafeteriaSidneyLove + parseInt(LoveChange);
	if (MoneyChange != null) CharacterChangeMoney(Player, parseInt(MoneyChange) * -1);
}

/**
 * Starts the fight between Sidney and the player
 * @returns {void} - Nothing
 */
function CollegeCafeteriaFightStart() {
	KidnapStart(CollegeCafeteriaSidney, "CollegeCafeteriaDark", 7, "CollegeCafeteriaFightEnd()");
}

/**
 * Resolves the fight between the player and Sidney
 * @returns {void} - Nothing
 */
function CollegeCafeteriaFightEnd() {
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (CollegeCafeteriaSidney.KidnapMaxWillpower - CollegeCafeteriaSidney.KidnapWillpower)) * 2);
	CollegeCafeteriaSidney.Stage = (KidnapVictory) ? "300" : "400";
	CharacterRelease(Player);
	CharacterRelease(CollegeCafeteriaSidney);
	InventoryWear(Player, "CollegeOutfit1", "Cloth", "Default");
	InventoryWear(CollegeCafeteriaSidney, "CollegeOutfit1", "Cloth", "Default");
	CommonSetScreen("Room", "CollegeCafeteria");
	CharacterSetCurrent(CollegeCafeteriaSidney);
	CollegeCafeteriaSidney.CurrentDialog = DialogFind(CollegeCafeteriaSidney, (KidnapVictory) ? "FightVictory" : "FightDefeat");
}

/**
 * When the plater invites Sidney to her room, she also gets a college dunce hat
 * @returns {void} - Nothing
 */
function CollegeCafeteriaInviteToPrivateRoom() {

	// Adds the dunce hat and removes it from Sidney before adding her to the player's room
	InventoryAdd(Player, "CollegeDunce", "Hat");
	InventoryRemove(CollegeCafeteriaSidney, "Hat");
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(CollegeCafeteriaSidney, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Dominant", 30);
	NPCTraitSet(C, "Violent", 60);
	NPCTraitSet(C, "Dumb", 40);
	NPCTraitSet(C, "Rude", 90);
	C.Love = 20;
	if (CollegeCafeteriaSidney.Owner == Player.Name) {
		NPCEventAdd(C, "NPCCollaring", CurrentTime);
		InventoryWear(C, "SlaveCollar", "ItemNeck");
		C.Owner = Player.Name;
		C.Love = 100;
	}
	if (Player.Lover == "NPC-Sidney") {
		NPCEventAdd(C, "Girlfriend", CurrentTime);
		C.Lover = Player.Name;
		C.Love = 100;
	}
	if (Player.Owner == "NPC-Sidney") {
		NPCEventAdd(C, "PlayerCollaring", CurrentTime);
		NPCEventAdd(C, "LastGift", CurrentTime);
		C.Love = 100;
	}
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
	DialogLeave();

	// Generates a new random character at Sidney's spot
	CharacterAppearanceFullRandom(CollegeCafeteriaSidney);
	CharacterRandomName(CollegeCafeteriaSidney);
	CollegeEntranceWearStudentClothes(CollegeCafeteriaSidney);
	CollegeCafeteriaSidney.Stage = 1000;
	CharacterRefresh(CollegeCafeteriaSidney);

}
