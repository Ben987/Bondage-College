"use strict";
var CollegeTheaterBackground = "CollegeTheater";
var CollegeTheaterJulia = null;
var CollegeTheaterJuliaLove = 0;
var CollegeTheaterRandomColors = ["#AA4444", "#44AA44", "#4444AA", "#AAAA44", "#AA44AA", "#44AAAA"]

// Returns TRUE if the dialog option should be shown
function CollegeTheaterCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax)) }
function CollegeTheaterJuliaLoveIs(LoveLevel) { return (CollegeTheaterJuliaLove >= parseInt(LoveLevel)) }
function CollegeTheaterCanChooseRole() { return ((ReputationGet("Dominant") > -30) && (ReputationGet("Dominant") < 30)) }

// Sets Julia in her full theater clothes
function CollegeTheaterJuliaClothes() {
	CharacterNaked(CollegeTheaterJulia);
	InventoryWear(CollegeTheaterJulia, "Yukata1", "Cloth", "#993333");
	InventoryWear(CollegeTheaterJulia, "PussyDark1", "Pussy", "#e86e37");
	InventoryWear(CollegeTheaterJulia, "Eyes3", "Eyes", "#f85e27");
	InventoryWear(CollegeTheaterJulia, "Mouth1", "Mouth", "Default");
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

// Generates Julia
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

// Runs the room (shows the player and Julia)
function CollegeTheaterRun() {
	DrawCharacter(Player, 500, 0, 1);
	if ((CollegeTheaterJulia != null) && !CollegeTheaterJulia.GoneAway) DrawCharacter(CollegeTheaterJulia, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

// When the user clicks in the room
function CollegeTheaterClick() {
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && (CollegeTheaterJulia != null) && !CollegeTheaterJulia.GoneAway) CharacterSetCurrent(CollegeTheaterJulia);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// Wears the clothes for the play
function CollegeTheaterPlayClothes(C1, C2) {
	InventoryWear(C1, "WitchHat1", "Hat", "#555555");
	InventoryWear(C1, "BondageDress2", "Cloth", "#555555");
	InventoryWear(C2, "Beret1", "Hat", "#CC8899");
	InventoryWear(C2, "Dress2", "Cloth", "Default");
}

// Puts a random colored rope on a character
function CollegeTheaterRandomRope(C) {
	var Color = CommonRandomItemFromList("", CollegeTheaterRandomColors);
	InventoryWear(C, "HempRope", "ItemArms", Color);
	InventoryWear(C, "HempRope", "ItemLegs", Color);
	InventoryWear(C, "HempRope", "ItemFeet", Color);
}

// Puts a random colored belt on a character
function CollegeTheaterRandomBelt(C) {
	var Color = CommonRandomItemFromList("", CollegeTheaterRandomColors);
	InventoryWear(C, "SturdyLeatherBelts", "ItemArms", Color);
	InventoryWear(C, "SturdyLeatherBelts", "ItemLegs", Color);
	InventoryWear(C, "SturdyLeatherBelts", "ItemFeet", Color);
}

// Strips a character to its underwear
function CollegeTheaterUnderwear(C) {
	InventoryRemove(C, "Cloth");
	InventoryRemove(C, "ClothLower");
	InventoryRemove(C, "Shoes");
	InventoryRemove(C, "Hat");
}

// When Julia love towards the player changes, it can also trigger an event.  When a good or bad move is done, her expression will change quickly.
function CollegeTheaterJuliaLoveChange(LoveChange, Event) {
	if (LoveChange != null) CollegeTheaterJuliaLove = CollegeTheaterJuliaLove + parseInt(LoveChange);
	if ((LoveChange != null) && (parseInt(LoveChange) <= 0)) {
		CharacterSetFacialExpression(CollegeTheaterJulia, "Eyebrows", "Angry");
		TimerInventoryRemoveSet(CollegeTheaterJulia, "Eyebrows", 2);
	}
	if ((LoveChange != null) && (parseInt(LoveChange) >= 2)) {
		CharacterSetFacialExpression(CollegeTheaterJulia, "Blush", "Low");
		TimerInventoryRemoveSet(CollegeTheaterJulia, "Blush", 2);
	}
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

// Dress back the player and Julia when the plays end
function CollegeTheaterDressBack() {
	CharacterRelease(Player);
	CharacterRelease(CollegeTheaterJulia);
	CollegeEntranceWearStudentClothes(Player);
	CollegeTheaterJuliaClothes();
	InventoryRemove(Player, "Hat");
	InventoryRemove(CollegeTheaterJulia, "Hat");
}

// When the plater invites Julia to her room
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