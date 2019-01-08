"use strict";
var NurseryBackground = "Nursery";
var NurseryNurse = null;
var NurseryNurseReleasedPlayer = false;

// Returns TRUE if the player is dressed in a diaper and ready to join the other AB in the nursery 
// Returns TRUE if the player is dressed in a maid uniform or can take a specific chore
//function NurseryPlayerInMaidUniform() { return ((CharacterAppearanceGetCurrentValue(Player, "Cloth", "Name") == "MaidOutfit1") && (CharacterAppearanceGetCurrentValue(Player, "Hat", "Name") == "MaidHairband1")) }
//function NurseryAllowMaidDrinks() { return (!Player.IsRestrained() && !NurseryNurse.IsRestrained()); }
//function NurseryAllowMaidCleaning() { return (!Player.IsRestrained() && !NurseryNurse.IsRestrained()); }
//function NurseryAllowRescue() { return (!Player.IsRestrained()); }
//function NurseryAllowCancelRescue() { return (NurseryCurrentRescueStarted && !NurseryCurrentRescueCompleted); }

// Loads the maid quarters room
function NurseryLoad() {
	NurseryNurse = CharacterLoadNPC("NPC_Nursery_Maid");
	NurseryNurse.AllowItem = false;
}

// Run the nursery
function NurseryRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(NurseryNurse, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
}

// When the user clicks in the maid quarters
function NurseryClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(NurseryNurse);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
}

// The maid can ungag the player
function NurseryNurseUngagPlayer() {
	if (NurseryNurse.CanInteract()) {
		if (!NurseryNurseReleasedPlayer) {
			ReputationProgress("Dominant", -1);
			NurseryNurseReleasedPlayer = true;
		}
		InventoryRemove(Player, "ItemMouth");
		InventoryRemove(Player, "ItemHead");
	} else NurseryNurse.CurrentDialog = DialogFind(NurseryNurse, "CantReleasePlayer");
}