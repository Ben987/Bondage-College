"use strict";
var AsylumEntranceBackground = "AsylumEntrance";
var AsylumEntranceNurse = null;
var AsylumEntranceKidnapNurse = null;
var AsylumEntranceEscapedPatient = null;
var AsylumEntranceEscapedPatientWillBribe = false;
var AsylumEntranceEscapedPatientWillJoin = false;

// Returns TRUE if specific dialog conditions are met
function AsylumEntranceCanWander() { return (Player.CanWalk() && ((LogValue("Committed", "Asylum") >= CurrentTime) || ((ReputationGet("Asylum") >= 1) && AsylumEntranceIsWearingNurseClothes(Player)))) }
function AsylumEntranceCanTransferToRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax) && !LogQuery("LockOutOfPrivateRoom", "Rule")) }
function AsylumEntranceCanKiss() { return (Player.CanTalk() && CurrentCharacter.CanTalk()) }
function AsylumEntranceCanGetNurseUniform() { return ((ReputationGet("Asylum") >= 50) && (!DialogInventoryAvailable("NurseUniform", "Cloth") || !DialogInventoryAvailable("NurseCap", "Hat"))) }

// Loads the room and generates the nurse
function AsylumEntranceLoad() {
	AsylumEntranceBackground = "AsylumEntrance";
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
		ManagementClubSlaveDialog(AsylumEntranceNurse);
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
	ChatRoomStart("Asylum", "", "AsylumEntrance", "AsylumEntranceDark", ["AsylumEntrance", "AsylumBedroom", "AsylumMeeting", "AsylumTherapy", "PaddedCell", "PaddedCell2"]);
}

// Wears the nurse clothes on a character (same as nursery)
function AsylumEntranceWearNurseClothes(C) {
	InventoryWear(C, "NurseUniform", "Cloth", "#848080");
	InventoryWear(C, "NurseCap", "Hat", "Default");
	InventoryWear(C, "Stockings2", "Socks", "Default");
	InventoryRemove(C, "ClothLower");
	InventoryRemove(C, "ClothAccessory");
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
	InventoryRemove(C, "HairAccessory1");
	InventoryRemove(C, "HairAccessory2");
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
	if (InventoryGet(Player, "HairAccessory1") != null) return false;
	if (InventoryGet(Player, "HairAccessory2") != null) return false;
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
	InventoryRemove(AsylumEntranceNurse, "ItemHood");
	InventoryRemove(AsylumEntranceNurse, "ItemNose");
	InventoryRemove(AsylumEntranceNurse, "ItemMouth");
	InventoryRemove(AsylumEntranceNurse, "ItemFeet");
	InventoryRemove(AsylumEntranceNurse, "ItemNeck");
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemHood");
	InventoryRemove(Player, "ItemNose");
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

// When the nurse is forced to be a patient (player will be tracked down for a full day after and a title will be forced)
function AsylumEntranceNurseBecomePatient() {
	LogAdd("Escaped", "Asylum", CurrentTime + 86400000);
	MainHallRandomEventOdds = 0;
	TitleSet("EscapedPatient");
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
	TitleSet("None");
	CharacterRelease(Player);
	AsylumEntranceWearPatientClothes(Player);
	AsylumEntrancePlayerJacket("Tight");
}

// When the player has escaped from the asylum and is caught by a nurse
function AsylumEntranceNurseCatchEscapedPlayer() {
	CommonSetScreen("Room", "AsylumEntrance");
	AsylumEntranceBackground = "MainHall";
	AsylumEntranceKidnapNurse = null;
	CharacterDelete("NPC_AsylumEntrance_KidnapNurse");	
	AsylumEntranceKidnapNurse = CharacterLoadNPC("NPC_AsylumEntrance_KidnapNurse");	
	AsylumEntranceWearNurseClothes(AsylumEntranceKidnapNurse);
	AsylumEntranceKidnapNurse.Stage = "0";
	AsylumEntranceKidnapNurse.CurrentDialog = DialogFind(AsylumEntranceKidnapNurse, (Player.CanInteract() ? "Intro" : "Automatic") + (Math.floor(Math.random() * 3)).toString());
	AsylumEntranceKidnapNurse.AllowItem = false;
	CharacterSetCurrent(AsylumEntranceKidnapNurse);
}

// When the player fights against the kidnap nurse
function AsylumEntranceKidnapNurseFight() {
	DialogChangeReputation("Dominant", 4);
	KidnapStart(AsylumEntranceKidnapNurse, "MainHallDark", 7, "AsylumEntranceKidnapNurseFightOutro()");
}

// When the fight against the kidnap nurse ends
function AsylumEntranceKidnapNurseFightOutro(Surrender) {
	CommonSetScreen("Room", "AsylumEntrance");
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (AsylumEntranceKidnapNurse.KidnapMaxWillpower - AsylumEntranceKidnapNurse.KidnapWillpower)) * 2);
	if ((Surrender != null) && Surrender) DialogChangeReputation("Dominant", -3);
	AsylumEntranceKidnapNurse.Stage = (KidnapVictory) ? "100" : "200";	
	if (!KidnapVictory) CharacterRelease(AsylumEntranceKidnapNurse);
	CharacterSetCurrent(AsylumEntranceKidnapNurse);
	AsylumEntranceKidnapNurse.CurrentDialog = DialogFind(AsylumEntranceKidnapNurse, ((KidnapVictory) ? "Victory" : "Defeat"));
}

// When the player tries to bribe the kidnap nurse
function AsylumEntranceKidnapNurseBribe(BribeAmount, BribeOdds) {
	if (parseInt(BribeOdds) > Math.random() * 100) {
		CharacterChangeMoney(Player, parseInt(BribeAmount) * -1);
		AsylumEntranceKidnapNurse.Stage = "12";
		AsylumEntranceKidnapNurse.CurrentDialog = DialogFind(AsylumEntranceKidnapNurse, "BribeSuccess");
	} else {
		AsylumEntranceKidnapNurse.Stage = "11";
		AsylumEntranceKidnapNurse.CurrentDialog = DialogFind(AsylumEntranceKidnapNurse, "BribeFailure");
	}
}

// When the player transfers the kidnap nurse to her room
function AsylumEntranceKidnapNurseTransferToRoom() {
	AsylumEntranceWearNurseClothes(AsylumEntranceKidnapNurse);
	CharacterRelease(Player);
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(AsylumEntranceKidnapNurse, "Nurse");
	DialogLeave();
}

// When the player leaves the kidnap nurse
function AsylumEntranceKidnapNurseExit() {
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

// When the player walks back to the asylum
function AsylumEntranceGoToAsylum() {
	AsylumEntranceBackground = "AsylumEntrance";
	LogAdd("Committed", "Asylum", CurrentTime + 86400000);
	LogDelete("Escaped", "Asylum");
	TitleSet("None");
}

// When the player is dressed back as a patient
function AsylumEntranceBackAsPatient() {
	CharacterRelease(Player);
	AsylumEntranceWearPatientClothes("Player");
	CharacterRelease(AsylumEntranceNurse);
	AsylumEntranceWearNurseClothes(AsylumEntranceNurse);
}

// When the player meets an escaped patient as a nurse
function AsylumEntranceEscapedPatientMeet() {
	CommonSetScreen("Room", "AsylumEntrance");
	AsylumEntranceBackground = "MainHall";
	AsylumEntranceEscapedPatient = null;
	CharacterDelete("NPC_AsylumEntrance_EscapedPatient");	
	AsylumEntranceEscapedPatient = CharacterLoadNPC("NPC_AsylumEntrance_EscapedPatient");	
	AsylumEntranceWearPatientClothes(AsylumEntranceEscapedPatient);
	AsylumEntranceEscapedPatient.Stage = "0";
	AsylumEntranceEscapedPatient.CurrentDialog = DialogFind(AsylumEntranceEscapedPatient, "Intro" + (Math.floor(Math.random() * 3)).toString());
	AsylumEntranceEscapedPatient.AllowItem = false;
	AsylumEntranceEscapedPatientWillBribe = (Math.random() > 0.667);
	AsylumEntranceEscapedPatientWillJoin = ((Math.random() > 0.667) && AsylumEntranceCanTransferToRoom());
	CharacterSetCurrent(AsylumEntranceEscapedPatient);
}

// When the player starts a fight against the escaped patient
function AsylumEntranceEscapedPatientFight() {
	DialogChangeReputation("Asylum", 2);
	DialogChangeReputation("Dominant", 2);
	KidnapStart(AsylumEntranceEscapedPatient, "MainHallDark", 4, "AsylumEntranceEscapedPatientFightOutro()");
}

// When the player fight ends against the escaped patient
function AsylumEntranceEscapedPatientFightOutro(Surrender) {
	CommonSetScreen("Room", "AsylumEntrance");
	AsylumEntranceBackground = "MainHall";
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (AsylumEntranceEscapedPatient.KidnapMaxWillpower - AsylumEntranceEscapedPatient.KidnapWillpower)) * 2);
	if ((Surrender != null) && Surrender) DialogChangeReputation("Dominant", -3);
	AsylumEntranceEscapedPatient.Stage = (KidnapVictory) ? "100" : "200";
	if (!KidnapVictory) CharacterRelease(AsylumEntranceEscapedPatient);
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(AsylumEntranceEscapedPatient, "ItemMouth");
	CharacterSetCurrent(AsylumEntranceEscapedPatient);
	AsylumEntranceEscapedPatient.CurrentDialog = DialogFind(AsylumEntranceEscapedPatient, ((KidnapVictory) ? "Victory" : "Defeat"));
}

// When the player gets bribed by a patient
function AsylumEntranceEscapedPatientBribe() {
	CharacterChangeMoney(Player, 5);
	DialogChangeReputation("Asylum", -1);
}

// When the player transfers a patient to her room
function AsylumEntranceEscapedPatientTransferToRoom() {
	AsylumEntranceWearPatientClothes(AsylumEntranceEscapedPatient);
	CharacterRelease(Player);
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(AsylumEntranceEscapedPatient, "Patient");
	DialogLeave();
}

// When the player brings back an escaped patient to the asylum
function AsylumEntranceEscapedPatientTransferToAsylum() {
	AsylumEntranceBackground = "AsylumEntrance";
	CharacterChangeMoney(Player, 15);
	DialogChangeReputation("Asylum", 4);
	CharacterRelease(AsylumEntranceEscapedPatient);
	AsylumEntranceWearPatientClothes(AsylumEntranceEscapedPatient);
	InventoryWear(AsylumEntranceEscapedPatient, "StraitJacket", "ItemArms");
	InventoryWear(AsylumEntranceEscapedPatient, "SmallBlindfold", "ItemHead");
	InventoryWear(AsylumEntranceEscapedPatient, "MuzzleGag", "ItemMouth");
}

// When the player leaves the escaped patient
function AsylumEntranceEscapedPatientLeave() {
	CommonSetScreen("Room", "MainHall");
	DialogLeave();
}

// Gives the nurse uniform to the player if asylum reputation is 50 or more
function AsylumEntranceGiveNurseUniform() {
	InventoryAdd(Player, "NurseUniform", "Cloth");
	InventoryAdd(Player, "NurseCap", "Hat");
}