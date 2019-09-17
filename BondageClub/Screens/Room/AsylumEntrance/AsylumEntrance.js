"use strict";
var AsylumEntranceBackground = "AsylumEntrance";
var AsylumEntranceNurse = null;

// Returns TRUE if specific dialog conditions are met
function AsylumEntranceCanWander() { return (Player.CanWalk() && ((LogValue("Committed", "Asylum") >= CurrentTime) || ((ReputationGet("Asylum") >= 1) && AsylumEntranceIsWearingNurseClothes(Player)))) }

// Loads the room and generates the nurse
function AsylumEntranceLoad() {
	if (AsylumEntranceNurse == null) {
		AsylumEntranceNurse = CharacterLoadNPC("NPC_AsylumEntrance_Nurse");
		AsylumEntranceWearNurseClothes(AsylumEntranceNurse);
		AsylumEntranceNurse.AllowItem = false;
	}
}

// Runs the room (shows the nurse, player, icons and committed time)
function AsylumEntranceRun() {
	DrawCharacter(Player, 500, 0, 1);
	DrawCharacter(AsylumEntranceNurse, 1000, 0, 1);
	if (Player.CanWalk() && (LogValue("Committed", "Asylum") < CurrentTime)) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (AsylumEntranceCanWander()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Chat.png", TextGet("ChatRoom"));
	if (AsylumEntranceCanWander()) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Bedroom.png", TextGet("Bedroom"));
	if (AsylumEntranceCanWander()) DrawButton(1885, 505, 90, 90, "", "White", "Icons/FriendList.png", TextGet("Meeting"));
	if (AsylumEntranceCanWander()) DrawButton(1885, 625, 90, 90, "", "White", "Icons/Therapy.png", TextGet("Therapy"));
	if (LogValue("Committed", "Asylum") >= CurrentTime) {
		DrawText(TextGet("RemainingTime"), 1800, 915, "white", "gray");
		DrawText(TimerToString(LogValue("Committed", "Asylum") - CurrentTime), 1800, 965, "white", "gray");
	}
}

// When the user clicks in the room
function AsylumEntranceClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) {
		if (LogValue("Committed", "Asylum") >= CurrentTime) AsylumEntranceNurse.Stage = "100";
		else if (AsylumEntranceNurse.Stage == "100") AsylumEntranceNurse.Stage = "0";
		if ((LogValue("Escaped", "Asylum") >= CurrentTime) && !AsylumEntranceNurse.IsRestrained()) AsylumEntranceNurse.Stage = "140";
		CharacterSetCurrent(AsylumEntranceNurse);
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk() && (LogValue("Committed", "Asylum") < CurrentTime)) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && AsylumEntranceCanWander()) AsylumEntranceStartChat();
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && AsylumEntranceCanWander()) CommonSetScreen("Room", "AsylumBedroom");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 505) && (MouseY < 595) && AsylumEntranceCanWander()) CommonSetScreen("Room", "AsylumMeeting");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 625) && (MouseY < 715) && AsylumEntranceCanWander()) CommonSetScreen("Room", "AsylumTherapy");
}

// Enters the online chat room in "Asylum mode"
function AsylumEntranceStartChat() {
	ChatRoomSpace = "Asylum";
	ChatSearchBackground = "AsylumEntranceDark";
	ChatSearchLeaveRoom = "AsylumEntrance";
	ChatCreateBackgroundList = ["AsylumEntrance", "AsylumBedroom", "AsylumMeeting", "AsylumTherapy", "PaddedCell"];
	CommonSetScreen("Online", "ChatSearch");
}

// Wears the nurse clothes on a character (same as nursery)
function AsylumEntranceWearNurseClothes(C) {
	InventoryWear(C, "NurseUniform", "Cloth", "Default");
	InventoryWear(C, "NurseCap", "Hat", "Default");
	InventoryWear(C, "Stockings2", "Socks", "Default");
}

// Wears the patient clothes on a character
function AsylumEntranceWearPatientClothes(C) {
	if ((typeof C === "string") && (C == "Player")) C = Player;
	InventoryWear(C, "TShirt1", "Cloth", "#500028");
	InventoryWear(C, "Pajama1", "ClothLower", "#FF0080");
	InventoryWear(C, "Socks2", "Socks", "#CCCCCC");
	InventoryRemove(C, "Shoes");
	InventoryRemove(C, "Wings");
	InventoryRemove(C, "TailStraps");
	InventoryRemove(C, "Gloves");
	InventoryRemove(C, "HairAccessory");
	InventoryRemove(C, "Hat");
}

// Returns TRUE if the player is wearing patient clothes
function AsylumEntranceIsWearingPatientClothes() {
	if ((InventoryGet(Player, "Cloth") == null) || (InventoryGet(Player, "Cloth").Asset.Name != "TShirt1")) return false;
	if ((InventoryGet(Player, "ClothLower") == null) || (InventoryGet(Player, "ClothLower").Asset.Name != "Pajama1")) return false;
	if ((InventoryGet(Player, "Socks") == null) || (InventoryGet(Player, "Socks").Asset.Name != "Socks2")) return false;
	if (InventoryGet(Player, "Shoes") != null) return false;
	if (InventoryGet(Player, "Wings") != null) return false;
	if (InventoryGet(Player, "TailStraps") != null) return false;
	if (InventoryGet(Player, "Gloves") != null) return false;
	if (InventoryGet(Player, "HairAccessory") != null) return false;
	if (InventoryGet(Player, "Hat") != null) return false;
	return true;
}

// Returns TRUE if the player is wearing nurse clothes
function AsylumEntranceIsWearingNurseClothes() {
	if ((InventoryGet(Player, "Cloth") == null) || (InventoryGet(Player, "Cloth").Asset.Name != "NurseUniform")) return false;
	if ((InventoryGet(Player, "Hat") == null) || (InventoryGet(Player, "Hat").Asset.Name != "NurseCap")) return false;
	if ((InventoryGet(Player, "Socks") == null) || (InventoryGet(Player, "Socks").Asset.Name != "Stockings2")) return false;
	return true;
}

// When a patient gets committed
function AsylumEntranceCommitPatient(Duration, ReputationChange) {
	LogAdd("Committed", "Asylum", CurrentTime + parseInt(Duration));
	if (ReputationGet("Asylum") >= 0) DialogSetReputation("Asylum", -1);
	DialogChangeReputation("Asylum", parseInt(ReputationChange) * -1);
}

// Starts to work as a nurse for the asylum
function AsylumEntranceStartNurse() {
	AsylumEntranceWearNurseClothes(Player);
	if (ReputationGet("Asylum") <= 0) DialogSetReputation("Asylum", 1);
}

// When a patient player fights for her freedom against the nurse
function AsylumEntranceFightNurse() {
	KidnapStart(AsylumEntranceNurse, "AsylumEntranceDark", 7, "AsylumEntranceFightNurseEnd()");
}

// When the fight against the nurse ends
function AsylumEntranceFightNurseEnd() {
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (AsylumEntranceNurse.KidnapMaxWillpower - AsylumEntranceNurse.KidnapWillpower)) * 2);
	AsylumEntranceNurse.Stage = (KidnapVictory) ? "120" : "130";
	DialogChangeReputation("Asylum", -6);
	if (!KidnapVictory) CharacterRelease(AsylumEntranceNurse);
	else CharacterRelease(Player);
	AsylumEntranceWearNurseClothes(AsylumEntranceNurse);
	AsylumEntranceWearPatientClothes(Player);
	InventoryRemove(AsylumEntranceNurse, "ItemHead");
	InventoryRemove(AsylumEntranceNurse, "ItemMouth");
	InventoryRemove(AsylumEntranceNurse, "ItemFeet");
	InventoryRemove(AsylumEntranceNurse, "ItemNeck");
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(Player, "ItemFeet");
	CommonSetScreen("Room", "AsylumEntrance");
	CharacterSetCurrent(AsylumEntranceNurse);
	AsylumEntranceNurse.CurrentDialog = DialogFind(AsylumEntranceNurse, (KidnapVictory) ? "FightVictory" : "FightDefeat");
}

// Restrains the player in a straitjacket with a custom difficulty
function AsylumEntrancePlayerJacket(Pose) {
	InventoryWear(Player, "StraitJacket", "ItemArms", "Default", 3);
	Player.FocusGroup = { Name: "ItemArms" };
	InventoryItemArmsStraitJacketSetPose(Pose);
	Player.FocusGroup = null;
}

// When the player steals the nurse clothes
function AsylumEntrancePlayerNurseClothes(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	AsylumEntranceWearNurseClothes(Player);
}

// When the nurse is forced to be a patient (player will be tracked down for a full day after)
function AsylumEntranceNurseBecomePatient() {
	LogAdd("Escaped", "Asylum", CurrentTime + 86400000);
	LogDelete("Committed", "Asylum");
	AsylumEntranceWearPatientClothes(AsylumEntranceNurse);
}

// When the nurse gets strapped down by the player
function AsylumEntranceNurseStrap(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	InventoryWear(AsylumEntranceNurse, "StraitJacket", "ItemArms");
	InventoryWear(AsylumEntranceNurse, "SmallBlindfold", "ItemHead");
	InventoryWear(AsylumEntranceNurse, "MuzzleGag", "ItemMouth");
}

// When the player gets committed again after escaping
function AsylumEntranceRecommit() {
	DialogChangeReputation("Asylum", -3);
	LogAdd("Committed", "Asylum", CurrentTime + 86400000);
	LogDelete("Escaped", "Asylum");
	CharacterRelease(Player);
	AsylumEntranceWearPatientClothes(Player);
	AsylumEntrancePlayerJacket("Tight");
}