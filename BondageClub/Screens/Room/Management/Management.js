"use strict";
var ManagementBackground = "Management";
var ManagementMistress = null;
var ManagementSub = null;
var ManagementMistressAngryCount = 0;
var ManagementMistressReleaseTimer = 0;
var ManagementPlayerAppearance = null;
var ManagementMistressAllowPlay = false;
var ManagementCanReleaseChastity = true;

// Returns TRUE if the dialog situation is allowed
function ManagementNoTitle() { return (!LogQuery("JoinedSorority", "Maid") && (ReputationGet("Kidnap") < 50)) }
function ManagementGetMistressAngryCount(InCount) { return (InCount == ManagementMistressAngryCount) }
function ManagementMistressAngryAdd() { ManagementMistressAngryCount++ }
function ManagementMistressWillRelease() { return (CommonTime() >= ManagementMistressReleaseTimer) }
function ManagementFriendIsChaste() { return (((PrivateCharacter.length > 1) && PrivateCharacter[1].IsChaste()) || ((PrivateCharacter.length > 2) && PrivateCharacter[2].IsChaste()) || ((PrivateCharacter.length > 3) && PrivateCharacter[3].IsChaste())); }
function ManagementCanPlayWithoutPermission() { return (!ManagementMistressAllowPlay && Player.CanInteract() && (ManagementMistressReleaseTimer == 0)) } 
function ManagementOwnerFromBondageCollege() { return ((Player.Owner == "NPC-Sidney") || (Player.Owner == "NPC-Amanda") || (Player.Owner == "NPC-Jennifer")) }
function ManagementOwnerInPrivateRoom() { return false }
function ManagementOwnerAway() { return !((Player.Owner == "NPC-Sidney") || (Player.Owner == "NPC-Amanda") || (Player.Owner == "NPC-Jennifer")) }
function ManagementAllowReleaseChastity() { return (Player.IsChaste() && ManagementCanReleaseChastity) }
function ManagementRefuseReleaseChastity() { return (Player.IsChaste() && !ManagementCanReleaseChastity) }
function ManagementOwnerPending() { return (CommonTime() < ManagementMistressReleaseTimer) }
function ManagementOwnerAccepted() { return ((CommonTime() >= ManagementMistressReleaseTimer) && ManagementCanReleaseChastity) }
function ManagementOwnerRefused() { return ((CommonTime() >= ManagementMistressReleaseTimer) && !ManagementCanReleaseChastity) }
function ManagementCanUnlockBra() { return ((Player.Money >= 25) && Player.IsBreastChaste()) }
function ManagementCanUnlockBelt() { return ((Player.Money >= 25) && Player.IsVulvaChaste()) }
function ManagementEndChastityRelease() { ManagementMistressReleaseTimer = 0 }
function ManagementCanReleaseFromOwnerFirst() { return ((Player.Money >= 60) && !LogQuery("ReleasedFromOwner", "Management")) }
function ManagementCanReleaseFromOwner() { return ((Player.Money >= 200) && LogQuery("ReleasedFromOwner", "Management")) }

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
		InventoryWear(ManagementSub, "Ears" + (Math.floor(Math.random() * 2) + 1).toString(), "Hat", "#BBBBBB");
		InventoryWear(ManagementSub, "TailButtPlug", "ItemButt");
		InventoryWear(ManagementSub, "MetalChastityBelt", "ItemPelvis");
		InventoryWear(ManagementSub, "MetalChastityBra", "ItemBreast");
		CharacterSetActivePose(ManagementSub, "Kneel");
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
	if (Player.CanKneel()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Kneel.png");
}

// When the user clicks in the management room
function ManagementClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) {
		if (((ManagementMistress.Stage == "0") || (ManagementMistress.Stage == "5")) && (ReputationGet("Dominant") < 0) && !Player.IsKneeling()) {
			ManagementMistress.CurrentDialog = DialogFind(ManagementMistress, "KneelToTalk");
			ManagementMistress.Stage = "5";
		}
		if ((ManagementMistress.Stage == "5") && Player.IsKneeling()) ManagementMistress.Stage = "0";
		CharacterSetCurrent(ManagementMistress);
	}
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ManagementSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
}

// Releases the player and dress her back
function ManagementPlayerStrip() {
	ManagementPlayerAppearance = Player.Appearance.slice();
	CharacterRelease(Player);
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
	ManagementCanReleaseChastity = false;
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
	ManagementMistressReleaseTimer = 0;
}

// When the player switches from the sub to the Mistress because she's angry
function ManagementSwitchToAngryMistress() {
	ManagementSub.Stage = "0";
	if (ManagementMistressAngryCount >= 3) {
		ManagementMistress.Stage = "11";
		CharacterSetCurrent(ManagementMistress);
		ManagementMistress.CurrentDialog = DialogFind(ManagementMistress, "TouchSubPunishment");
	} else {
		ManagementMistress.Stage = "30";
		CharacterSetCurrent(ManagementMistress);
		ManagementMistressAngryCount++;
		ManagementMistress.CurrentDialog = DialogFind(ManagementMistress, "TouchSubAngry" + ManagementMistressAngryCount.toString());
	}
}

// Releases all girls that are locked in chastity items in the private room
function ManagementReleasePrivateRoom() {
	for (var P = 1; P < PrivateCharacter.length; P++) {
		if (PrivateCharacter[P].IsVulvaChaste()) InventoryRemove(PrivateCharacter[P], "ItemPelvis");
		if (PrivateCharacter[P].IsBreastChaste()) InventoryRemove(PrivateCharacter[P], "ItemBreast");
		PrivateSaveCharacter(P);
	}
	CharacterChangeMoney(Player, -50);
}

// When the player gets unlocked
function ManagementUnlockItem(ItemGroup) {
	InventoryRemove(Player, ItemGroup);
	CharacterChangeMoney(Player, -25);
}

// When the Mistress will contact the player owner
function ManagementContactOwner() {
	ManagementMistressReleaseTimer = CommonTime() + 200000 + Math.floor(Math.random() * 200000);
	CharacterChangeMoney(Player, -20);
	ManagementCanReleaseChastity = (Math.random() >= 0.3);
	if (Player.Owner == "NPC-Sidney") ManagementCanReleaseChastity = (Math.random() >= 0.6);
}

// When the Mistress releases the player from her owner
function ManagementReleaseFromOwner(RepChange) {
	Player.Owner = "";
	AccountSync();
	InventoryRemove(Player, "ItemNeck");
	ReputationProgress("Dominant", RepChange);
	LogAdd("ReleasedFromOwner", "Management");
}