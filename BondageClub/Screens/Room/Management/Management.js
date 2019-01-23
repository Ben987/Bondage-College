"use strict";
var ManagementBackground = "Management";
var ManagementMistress = null;
var ManagementSub = null;
var ManagementMistressAngryCount = 0;
var ManagementMistressReleaseTimer = 0;
var ManagementPlayerAppearance = null;
var ManagementMistressAllowPlay = false;

// Returns TRUE if the dialog situation is allowed
function ManagementNoTitle() { return (!LogQuery("JoinedSorority", "Maid") && (ReputationGet(RepType) < 50)) }
function ManagementGetMistressAngryCount(InCount) { return (InCount == ManagementMistressAngryCount) }
function ManagementMistressAngryAdd() { ManagementMistressAngryCount++ }
function ManagementMistressWillRelease() { return (CommonTime() >= ManagementMistressReleaseTimer) }
function ManagementFriendIsChaste() { return true } 

// Loads the club management room, creates the Mistress and sub character
function ManagementLoad() {
	if ((ManagementMistress == null) && (TextGet("Mistress") != "")) {
		ManagementMistress = CharacterLoadNPC("NPC_Management_Mistress");
		ManagementMistress.Name = TextGet("Mistress") + " " + ManagementMistress.Name;
		ManagementMistress.AllowItem = false;
		ManagementMistressAngryCount = 0;
		ManagementSub = CharacterLoadNPC("NPC_Management_Sub");
		CharacterNaked(ManagementSub);
		InventoryWear(ManagementSub, "SlaveCollar", "ItemNeck");
		CharacterFullRandomRestrain(ManagementSub, "Lot");
		InventoryWear(ManagementSub, "MetalChastityBelt", "ItemPelvis");
		InventoryWear(ManagementSub, "MetalChastityBra", "ItemBreast");
		ManagementSub.AllowItem = false;
	}
}

// Run the management room, draw the 2 characters
function ManagementRun() {
	ManagementLoad();
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(ManagementMistress, 750, 0, 1);
	DrawCharacter(ManagementSub, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the management room
function ManagementClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ManagementMistress);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ManagementSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// Releases the player and dress her back
function ManagementPlayerStrip() {
	ManagementPlayerAppearance = Player.Appearance.slice();
	CharacterNaked(Player);
}

// Straps a tight armbinder on the player for 2 players
function ManagementPlayerArmbinder(ChangeRep) {
	if (ChangeRep != 0) DialogChangeReputation("Dominant", ChangeRep);
	InventoryWear(Player, "LeatherArmbinder", "ItemArms");
	InventorySetDifficulty(Player, "ItemArms", 20);
	ManagementMistressReleaseTimer = CommonTime() + 120000;
}

// Straps many restrains and chastity items on the player
function ManagementPlayerRandomRestrain() {
	CharacterFullRandomRestrain(Player, "Lot");
	InventoryWear(Player, "MetalChastityBelt", "ItemPelvis");
	InventoryWear(Player, "MetalChastityBra", "ItemBreast");
}

// Starts the submissive play mode for the player
function ManagementPlayerRandomRestrainPlay() {
	CharacterFullRandomRestrain(Player, "Lot");
	ManagementMistressAllowPlay = true;
}

// Releases the player and dress her back
function ManagementPlayerRelease() {
	CharacterRelease(Player);
	CharacterDress(Player, ManagementPlayerAppearance);
	ManagementMistressAllowPlay = false;
}