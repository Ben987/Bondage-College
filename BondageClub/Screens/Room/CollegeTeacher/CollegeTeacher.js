"use strict";
var CollegeTeacherBackground = "CollegeTeacherLounge";
var CollegeTeacherMildred = null;
var CollegeTeacherMildredLove = 0;

// Returns TRUE if the dialog option should be shown
/**
 * Checks, if the teacher can be invited to the player's room
 * @returns {boolean} - Returns true, if the player can invite the teacher to her room, false otherwise
 */
function CollegeTeacherCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax)) }

/**
 * Checks, if Mildred's love level is higher than a given value
 * @param {string} LoveLevel - The level of love to check against
 * @returns {boolean} - Returns true, if Mildred's love is equal or higher than the given level, false otherwise
 */
function CollegeTeacherMildredLoveIs(LoveLevel) { return (CollegeTeacherMildredLove >= parseInt(LoveLevel)) }

/**
 * Fully dress-up Mildred
 * @returns {void} - Nothing
 */
function CollegeTeacherMildredClothes() {
	CharacterNaked(CollegeTeacherMildred);
	InventoryWear(CollegeTeacherMildred, "TeacherOutfit1", "Cloth", "Default");
	InventoryWear(CollegeTeacherMildred, "PussyDark3", "Pussy", "#333333");
	InventoryWear(CollegeTeacherMildred, "Eyes1", "Eyes", "#a57b78");
	InventoryWear(CollegeTeacherMildred, "Eyes1", "Eyes2", "#a57b78");
	InventoryWear(CollegeTeacherMildred, "Glasses4", "Glasses", "#333333");
	InventoryWear(CollegeTeacherMildred, "Mouth", "Mouth", "Default");
	InventoryWear(CollegeTeacherMildred, "H0940", "Height", "Default");
	InventoryWear(CollegeTeacherMildred, "Normal", "BodyUpper", "White");
	InventoryWear(CollegeTeacherMildred, "Normal", "BodyLower", "White");
	InventoryWear(CollegeTeacherMildred, "Default", "Hands", "White");
	InventoryWear(CollegeTeacherMildred, "HairBack21", "HairBack", "#626060");
	InventoryWear(CollegeTeacherMildred, "HairFront3", "HairFront", "#626060");
	InventoryWear(CollegeTeacherMildred, "Bra1", "Bra", "#2222AA");
	InventoryWear(CollegeTeacherMildred, "Panties11", "Panties", "#2222AA");
	InventoryWear(CollegeTeacherMildred, "Socks5", "Socks", "#111111");
	InventoryWear(CollegeTeacherMildred, "Heels1", "Shoes", "#222222");
}

// Generates Mildred
/**
 * Loads the teacher's lounge and generates Mildred
 * @returns {void} - Nothing
 */
function CollegeTeacherLoad() {

	// Generates a full Mildred model based on the Bondage College template
	if (CollegeTeacherMildred == null) {

		// Do not generate her if she's already in the private room
		if (PrivateCharacter.length > 1)
			for (let P = 1; P < PrivateCharacter.length; P++)
				if (PrivateCharacter[P].Name == "Mildred")
					return;
		
		// Generates the model
		CollegeTeacherMildred = CharacterLoadNPC("NPC_CollegeTeacher_Mildred");
		CollegeTeacherMildred.AllowItem = false;
		CollegeTeacherMildred.Name = "Mildred";
		CollegeTeacherMildred.GoneAway = false;
		CollegeTeacherMildredClothes();
		CharacterRefresh(CollegeTeacherMildred);

	}

}

/**
 * Runs the room (shows the player and Mildred)
 * @returns {void} - Nothing
 */
function CollegeTeacherRun() {
	DrawCharacter(Player, 0, 0, 1);
	if ((CollegeTeacherMildred != null) && !CollegeTeacherMildred.GoneAway) DrawCharacter(CollegeTeacherMildred, 500, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function CollegeTeacherClick() {
	if (MouseIn(500, 0, 500, 1000) && (CollegeTeacherMildred != null) && !CollegeTeacherMildred.GoneAway) CharacterSetCurrent(CollegeTeacherMildred);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * When Mildred love towards the player changes, it can also trigger an event.  
 * When a good or bad move is done, her expression will change quickly.
 * @param {string} LoveChange - The amount, the teacher's love changes
 * @param {string} Event - The event to trigger
 * @returns {void} - Nothing
 */
function CollegeTeacherMildredLoveChange(LoveChange, Event) {
	if (LoveChange != null) CollegeTeacherMildredLove = CollegeTeacherMildredLove + parseInt(LoveChange);
	if ((LoveChange != null) && (parseInt(LoveChange) < 0)) CharacterSetFacialExpression(CollegeTeacherMildred, "Eyes", "Dazed", 2);
	if ((LoveChange != null) && (parseInt(LoveChange) > 0)) CharacterSetFacialExpression(CollegeTeacherMildred, "Blush", "Low", 2);
	if (Event == "Pillory") InventoryWear(Player, "Pillory", "ItemArms");
	if (Event == "Lock") InventoryLock(Player, "ItemArms", "IntricatePadlock", -1);
	if (Event == "Crop") {
		InventoryWear(CollegeTeacherMildred, "SpankingToys", "ItemHands");
		InventoryGet(CollegeTeacherMildred, "ItemHands").Property = { Type: "Crop" };
	}
	if (Event == "Hit") {
		CharacterSetFacialExpression(Player, "Eyes", "Closed", 3);
		CharacterSetFacialExpression(Player, "Blush", "Medium", 3);
	}		
	if (Event == "Gag") InventoryWear(Player, "DogMuzzleExposed", "ItemMouth");
}

/**
 * Dress back the player and Mildred
 * @returns {void} - Nothing
 */
function CollegeTeacherDressBack() {
	CharacterRelease(Player);
	CharacterRelease(CollegeTeacherMildred);
	InventoryRemove(CollegeTeacherMildred, "ItemHands");
	CollegeEntranceWearStudentClothes(Player);
	CollegeTeacherMildredClothes();
}

/**
 * Sets the current background for the scene
 * @param {string} New - The name of the new background
 * @returns {void} - Nothing
 */
function CollegeTeacherNewBackground(New) {
	CollegeTeacherBackground = New;
}

//
/**
 * When the plater invites Mildred to her room, she gets the pillory
 * @returns {void} - Nothing
 */
function CollegeTeacherInviteToPrivateRoom() {
	CollegeTeacherDressBack();
	InventoryAdd(Player, "Pillory", "ItemArms");
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(CollegeTeacherMildred, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Dominant", 60);
	NPCTraitSet(C, "Violent", 50);
	NPCTraitSet(C, "Frigid", 40);
	NPCTraitSet(C, "Polite", 20);
	NPCTraitSet(C, "Wise", 30);
	NPCTraitSet(C, "Serious", 80);
	C.Love = 20;
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
	DialogLeave();
	CollegeTeacherMildred.GoneAway = true;
}