"use strict";
var CollegeTheaterBackground = "CollegeTheater";
var CollegeTheaterJulia = null;
var CollegeTheaterJuliaLove = 0;
var CollegeTheaterRandomColors = ["#AA4444", "#44AA44", "#4444AA", "#AAAA44", "#AA44AA", "#44AAAA"];


/**
 * Checks if the player can invite an extra player to their private room. (Used for Julia.)
 * @returns {boolean} - Returns TRUE if the player has a private room and at least one empty place in it.
 */
function CollegeTheaterCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax)) }
/**
 * Checks if Julia's love level is of a given level.
 * @param {number} LoveLevel - The love level threshold to check for.
 * @returns {boolean} - Returns TRUE if the current love level of Julia is at or above the given level
 */
function CollegeTheaterJuliaLoveIs(LoveLevel) { return (CollegeTheaterJuliaLove >= parseInt(LoveLevel)) }
/**
 * Checks if the player can pick their role. The player can pick their role when they are a switch (not too submissive or dominant)
 * @returns {boolean} - Returns TRUE if the player can choose her role.
 */
function CollegeTheaterCanChooseRole() { return ((ReputationGet("Dominant") > -30) && (ReputationGet("Dominant") < 30)) }
/**
 * Gives the teacher room key to the player.
 * @returns {void} - Nothing
 */
function CollegeTheaterGetTeacherKey() { LogAdd("TeacherKey", "College") }

/**
 * Dresses Julia in her full theater outfit.
 * @returns {void} - Nothing
 */
function CollegeTheaterJuliaClothes() {
	CharacterNaked(CollegeTheaterJulia);
	InventoryWear(CollegeTheaterJulia, "Yukata1", "Cloth", "#993333");
	InventoryWear(CollegeTheaterJulia, "PussyDark1", "Pussy", "#e86e37");
	InventoryWear(CollegeTheaterJulia, "Eyes3", "Eyes", "#f85e27");
	InventoryWear(CollegeTheaterJulia, "Eyes3", "Eyes2", "#f85e27");
	InventoryWear(CollegeTheaterJulia, "Mouth", "Mouth", "Default");
	InventoryWear(CollegeTheaterJulia, "H0990", "Height", "Default");
	InventoryWear(CollegeTheaterJulia, "XLarge", "BodyUpper", "White");
	InventoryWear(CollegeTheaterJulia, "XLarge", "BodyLower", "White");
	InventoryWear(CollegeTheaterJulia, "Default", "Hands", "White");
	InventoryWear(CollegeTheaterJulia, "HairBack5", "HairBack", "#e86e37");
	InventoryWear(CollegeTheaterJulia, "HairFront6", "HairFront", "#e86e37");
	InventoryWear(CollegeTheaterJulia, "OuvertPerl1", "Bra", "#BB0000");
	InventoryWear(CollegeTheaterJulia, "Panties11", "Panties", "#BB0000");
	InventoryWear(CollegeTheaterJulia, "Pantyhose1", "Socks", "Default");
	InventoryWear(CollegeTheaterJulia, "Sandals", "Shoes", "Default");
}

/**
 * Loads the college theater screen, generates Julia like she is in bondage college. Julia is not generated if she is in the player's private room.
 * @returns {void} - Nothing
 */
function CollegeTheaterLoad() {

	// Generates a full Julia model based on the Bondage College template
	if (CollegeTheaterJulia == null) {

		// Do not generate her if she's already in the private room
		if (PrivateCharacter.length > 1)
			for (var P = 1; P < PrivateCharacter.length; P++)
				if (PrivateCharacter[P].Name == "Julia")
					return;
		
		// Generates the model
		CollegeTheaterJulia = CharacterLoadNPC("NPC_CollegeTheater_Julia");
		CollegeTheaterJulia.AllowItem = false;
		CollegeTheaterJulia.Name = "Julia";
		CollegeTheaterJulia.GoneAway = false;
		CollegeTheaterJuliaClothes();
		CharacterRefresh(CollegeTheaterJulia);
		
	}

}

/**
 * Runs and draws the College Theater screen, show the player and Julia
 * @returns {void} - Nothing
 */
function CollegeTheaterRun() {
	DrawCharacter(Player, 500, 0, 1);
	if ((CollegeTheaterJulia != null) && !CollegeTheaterJulia.GoneAway) DrawCharacter(CollegeTheaterJulia, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles clicks in the college theater screen
 * @returns {void} - Nothing
 */
function CollegeTheaterClick() {
	if (MouseIn(1000, 0, 500, 1000) && (CollegeTheaterJulia != null) && !CollegeTheaterJulia.GoneAway) CharacterSetCurrent(CollegeTheaterJulia);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * Dresses the two given characters for the play
 * @param {Character} C1 - First character for the play (the witch)
 * @param {Character} C2 - Second character for the play (the maiden)
 * @returns {void} - Nothing
 */
function CollegeTheaterPlayClothes(C1, C2) {
	InventoryWear(C1, "WitchHat1", "Hat", "#555555");
	InventoryWear(C1, "BondageDress2", "Cloth", "#555555");
	InventoryWear(C2, "Beret1", "Hat", "#CC8899");
	InventoryWear(C2, "Dress2", "Cloth", "Default");
}

/**
 * Puts ropes of a random color on a given character
 * @param {Character} C - Character to tie with ropes
 * @returns {void} - Nothing
 */
function CollegeTheaterRandomRope(C) {
	var Color = CommonRandomItemFromList("", CollegeTheaterRandomColors);
	InventoryWear(C, "HempRope", "ItemArms", Color);
	InventoryWear(C, "HempRope", "ItemLegs", Color);
	InventoryWear(C, "HempRope", "ItemFeet", Color);
}

/**
 * Puts 3 belts of a random color on a given character
 * @param {Character} C - Character to put belts
 * @returns {void} - Nothing
 */
function CollegeTheaterRandomBelt(C) {
	var Color = CommonRandomItemFromList("", CollegeTheaterRandomColors);
	InventoryWear(C, "SturdyLeatherBelts", "ItemArms", Color);
	InventoryWear(C, "SturdyLeatherBelts", "ItemLegs", Color);
	InventoryWear(C, "SturdyLeatherBelts", "ItemFeet", Color);
}

/**
 * Strips a character to her underwear
 * @param {Character} C - Character to strip 
 * @returns {void} - Nothing
 */
function CollegeTheaterUnderwear(C) {
	InventoryRemove(C, "Cloth");
	InventoryRemove(C, "ClothLower");
	InventoryRemove(C, "Shoes");
	InventoryRemove(C, "Hat");
}

/**
 * Triggered when Julia's love towards the player changes, it can also trigger an event.  When a good or bad move is done, her expression will change quickly.
 * @param {string} LoveChange - Number representing the change in love 
 * @param {string} Event - The event that may have occured for the love factor to change.
 * @returns {void} - Nothing
 */
function CollegeTheaterJuliaLoveChange(LoveChange, Event) {
	if (LoveChange != null) CollegeTheaterJuliaLove = CollegeTheaterJuliaLove + parseInt(LoveChange);
	if ((LoveChange != null) && (parseInt(LoveChange) <= 0)) CharacterSetFacialExpression(CollegeTheaterJulia, "Eyes", "Dazed", 2);
	if ((LoveChange != null) && (parseInt(LoveChange) >= 2)) CharacterSetFacialExpression(CollegeTheaterJulia, "Blush", "Low", 2);
	if (Event == "PlayerWitch") CollegeTheaterPlayClothes(Player, CollegeTheaterJulia);
	if (Event == "JuliaWitch") CollegeTheaterPlayClothes(CollegeTheaterJulia, Player);
	if (Event == "PlayerUnderwear") CollegeTheaterUnderwear(Player);
	if (Event == "JuliaUnderwear") CollegeTheaterUnderwear(CollegeTheaterJulia);
	if (Event == "PlayerNaked") CharacterNaked(Player);
	if (Event == "JuliaNaked") CharacterNaked(CollegeTheaterJulia);
	if (Event == "PlayerHandCuffs") InventoryWear(Player, "MetalCuffs", "ItemArms", CommonRandomItemFromList("", CollegeTheaterRandomColors));
	if (Event == "PlayerFeetCuffs") InventoryWear(Player, "Irish8Cuffs", "ItemFeet", CommonRandomItemFromList("", CollegeTheaterRandomColors));
	if (Event == "PlayerFeetIron") InventoryWear(Player, "BallChain", "ItemFeet", CommonRandomItemFromList("", CollegeTheaterRandomColors));
	if (Event == "PlayerFairy") InventoryWear(Player, "BatWings", "Wings", CommonRandomItemFromList("", CollegeTheaterRandomColors));
	if (Event == "JuliaRope") CollegeTheaterRandomRope(CollegeTheaterJulia);
	if (Event == "JuliaBelt") CollegeTheaterRandomBelt(CollegeTheaterJulia);
	if (Event == "JuliaClothBlindfold") InventoryWear(CollegeTheaterJulia, "ClothBlindfold", "ItemHead", CommonRandomItemFromList("", CollegeTheaterRandomColors));
	if (Event == "JuliaLeatherBlindfold") InventoryWear(CollegeTheaterJulia, "LeatherBlindfold", "ItemHead", CommonRandomItemFromList("", CollegeTheaterRandomColors));
}

/**
 * Desses the player and Julia at the end of the play.
 * @returns {void} - Nothing
 */
function CollegeTheaterDressBack() {
	CharacterRelease(Player);
	CharacterRelease(CollegeTheaterJulia);
	CollegeEntranceWearStudentClothes(Player);
	CollegeTheaterJuliaClothes();
	InventoryRemove(Player, "Hat");
	InventoryRemove(CollegeTheaterJulia, "Hat");
}

/**
 * Triggered when the player invites Julia to their private room. The player receives the accessories used during the play.
 * @param {string} Role - The role the player add during the play
 * @returns {void} - Nothing
 */
function CollegeTheaterInviteToPrivateRoom(Role) {
	CollegeTheaterDressBack();
	if (Role == "Witch") InventoryAdd(Player, "WitchHat1", "Hat");
	if (Role == "Witch") InventoryAdd(Player, "BondageDress2", "Cloth");
	if (Role == "Maiden") InventoryAdd(Player, "Dress2", "Cloth");
	if (Role == "Maiden") InventoryAdd(Player, "BatWings", "Wings");
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(CollegeTheaterJulia, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Playful", 90);
	NPCTraitSet(C, "Peaceful", 70);
	NPCTraitSet(C, "Horny", 40);
	NPCTraitSet(C, "Polite", 20);
	C.Love = 20;
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
	DialogLeave();
	CollegeTheaterJulia.GoneAway = true;
}