"use strict";
var CollegeTheaterBackground = "CollegeTheater";
var CollegeTheaterJulia = null;

// Returns TRUE if the dialog option should be shown
function CollegeTheaterCanInviteToPrivateRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax)) }

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
		CharacterNaked(CollegeTheaterJulia);
		InventoryWear(CollegeTheaterJulia, "Yukata1", "Cloth", "Default");
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
		CharacterRefresh(CollegeTheaterJulia);
		
	}

}

// Runs the room (shows the player and Julia)
function CollegeTheaterRun() {
	DrawCharacter(Player, 500, 0, 1);
	if (CollegeTheaterJulia != null) DrawCharacter(CollegeTheaterJulia, 1000, 0, 1);
	DrawButton(1885, 25, 90, 90, "", Player.CanWalk() ? "White" : "Pink", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
}

// When the user clicks in the room
function CollegeTheaterClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && (CollegeTheaterJulia != null)) CharacterSetCurrent(CollegeTheaterJulia);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "CollegeEntrance");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// When the plater invites Julia to her room
function CollegeTheaterInviteToPrivateRoom() {
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(CollegeTheaterJulia, null, true);
	var C = PrivateCharacter[PrivateCharacter.length - 1];
	C.Trait = [];
	NPCTraitSet(C, "Dominant", 30);
	NPCTraitSet(C, "Violent", 60);
	NPCTraitSet(C, "Dumb", 40);
	NPCTraitSet(C, "Rude", 90);
	C.Love = 20;
	NPCTraitDialog(C);
	ServerPrivateCharacterSync();
	DialogLeave();
	CollegeTheaterJulia = null;
}