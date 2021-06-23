"use strict";
var AsylumEntranceBackground = "AsylumEntrance";
var AsylumEntranceNurse = null;
var AsylumEntranceKidnapNurse = null;
var AsylumEntranceEscapedPatient = null;
var AsylumEntranceEscapedPatientWillBribe = false;
var AsylumEntranceEscapedPatientWillJoin = false;

/**
 * Checks, if the player is able to leave the Asylum
 * @returns {boolean} - Returns true, if the player is able to leave, false otherwise
 */
function AsylumEntranceCanWander() { return (Player.CanWalk() && ((LogValue("Committed", "Asylum") >= CurrentTime) || ((ReputationGet("Asylum") >= 1) && AsylumEntranceIsWearingNurseClothes()))); }
/**
 * Checks, if the player can bring the nurse to her private room
 * @returns {boolean} - Returns true, if the player can drag the nurse to her private roo, false otherwise
 */
function AsylumEntranceCanTransferToRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax) && !LogQuery("LockOutOfPrivateRoom", "Rule")); }
/**
 * CHecks if the player can kiss the nurse
 * @returns {boolean} - Returns true, if the player can kiss the nurse, false otherwise
 */
function AsylumEntranceCanKiss() { return (Player.CanTalk() && CurrentCharacter.CanTalk()); }
/**
 * Checks if the player can have a nurse uniform of her own
 * @returns {boolean} - Returns true, if the player can have her own nurse uniform, false otherwise
 */
function AsylumEntranceCanGetNurseUniform() { return ((ReputationGet("Asylum") >= 50) && (!DialogInventoryAvailable("NurseUniform", "Cloth") || !DialogInventoryAvailable("NurseCap", "Hat"))); }

/**
 * Loads the room and generates the nurse. Is called dynamically
 * @returns {void} - Nothing
 */
function AsylumEntranceLoad() {
	AsylumEntranceBackground = "AsylumEntrance";
	if (AsylumEntranceNurse == null) {
		AsylumEntranceNurse = CharacterLoadNPC("NPC_AsylumEntrance_Nurse");
		AsylumEntranceWearNurseClothes(AsylumEntranceNurse);
		AsylumEntranceNurse.AllowItem = false;
	}
}

/**
 * // Runs the room (shows the nurse, player, icons and committed time).
 * Is called over and over again, so don't call expensive functions or loops from here.
 * @returns {void} - Nothing
 */
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

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function AsylumEntranceClick() {
	if (MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1000, 0, 500, 1000)) {
		if (LogValue("Committed", "Asylum") >= CurrentTime) AsylumEntranceNurse.Stage = "100";
		else if (AsylumEntranceNurse.Stage == "100") AsylumEntranceNurse.Stage = "0";
		if ((LogValue("Escaped", "Asylum") >= CurrentTime) && !AsylumEntranceNurse.IsRestrained()) AsylumEntranceNurse.Stage = "140";
		ManagementClubSlaveDialog(AsylumEntranceNurse);
		CharacterSetCurrent(AsylumEntranceNurse);
	}
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk() && (LogValue("Committed", "Asylum") < CurrentTime)) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1885, 265, 90, 90) && AsylumEntranceCanWander()) AsylumEntranceStartChat();
	if (MouseIn(1885, 385, 90, 90) && AsylumEntranceCanWander()) CommonSetScreen("Room", "AsylumBedroom");
	if (MouseIn(1885, 505, 90, 90) && AsylumEntranceCanWander()) CommonSetScreen("Room", "AsylumMeeting");
	if (MouseIn(1885, 625, 90, 90) && AsylumEntranceCanWander()) CommonSetScreen("Room", "AsylumTherapy");
}

/**
 * Enters the online chat room in "Asylum mode"
 * @returns {void} - Nothing
 */
function AsylumEntranceStartChat() {
	ChatRoomStart("Asylum", "", "AsylumEntrance", "AsylumEntrance", [BackgroundsTagAsylum]);
}

// Wears the nurse clothes on a character (same as nursery)
/**
 * Dresses a given character as a nurse
 * @param {Character} C - The character to dress
 * @returns {void} - Nothing
 */
function AsylumEntranceWearNurseClothes(C) {
	InventoryWear(C, "NurseUniform", "Cloth", "#848080");
	InventoryWear(C, "NurseCap", "Hat", "Default");
	InventoryWear(C, "Stockings2", "Socks", "Default");
	InventoryRemove(C, "ClothLower");
	InventoryRemove(C, "ClothAccessory");
}

// Wears the patient clothes on a character
/**
 * Dresses a given character as a patient. Removes all clothes and respects cosplay rules
 * @param {"Player" | Character} C - The character to dress
 * @returns {void} - Nothing
 */
function AsylumEntranceWearPatientClothes(C) {
	if ((typeof C === "string") && (C == "Player")) C = Player;
	InventoryWear(C, "TShirt1", "Cloth", "#500028");
	InventoryWear(C, "Pajama1", "ClothLower", "#FF0080");
	InventoryWear(C, "Socks2", "Socks", "#CCCCCC");
	InventoryRemove(C, "Shoes");
	InventoryRemove(C, "Gloves");
	InventoryRemove(C, "HairAccessory1");
	if (C.IsNpc() || C.OnlineSharedSettings && !C.OnlineSharedSettings.BlockBodyCosplay) {
		InventoryRemove(C, "HairAccessory2");
		InventoryRemove(C, "Wings");
		InventoryRemove(C, "TailStraps");
	}
	InventoryRemove(C, "HairAccessory3");
	InventoryRemove(C, "Hat");
}

/**
 * Checks, if the player is dressed as a patient
 * @returns {boolean} - Returns true, if the player is dressed as a patient, false otherwise
 */
function AsylumEntranceIsWearingPatientClothes() {
	if ((InventoryGet(Player, "Cloth") == null) || (InventoryGet(Player, "Cloth").Asset.Name != "TShirt1")) return false;
	if ((InventoryGet(Player, "ClothLower") == null) || (InventoryGet(Player, "ClothLower").Asset.Name != "Pajama1")) return false;
	if ((InventoryGet(Player, "Socks") == null) || (InventoryGet(Player, "Socks").Asset.Name != "Socks2")) return false;
	if (InventoryGet(Player, "Shoes") != null) return false;
	if (InventoryGet(Player, "Gloves") != null) return false;
	if (InventoryGet(Player, "HairAccessory1") != null) return false;
	if (InventoryGet(Player, "HairAccessory2") != null && !Player.OnlineSharedSettings.BlockBodyCosplay) return false;
	if (InventoryGet(Player, "Wings") != null && !Player.OnlineSharedSettings.BlockBodyCosplay) return false;
	if (InventoryGet(Player, "TailStraps") != null && !Player.OnlineSharedSettings.BlockBodyCosplay) return false;
	if (InventoryGet(Player, "HairAccessory3") != null) return false;
	if (InventoryGet(Player, "Hat") != null) return false;
	return true;
}

/**
 * Checks, if the player is dressed as a nurse
 * @returns {boolean} - Returns true, if the player is dressed as a nurse, false otherwise
 */
function AsylumEntranceIsWearingNurseClothes() {
	if ((InventoryGet(Player, "Cloth") == null) || (InventoryGet(Player, "Cloth").Asset.Name != "NurseUniform")) return false;
	if ((InventoryGet(Player, "Hat") == null) || (InventoryGet(Player, "Hat").Asset.Name != "NurseCap")) return false;
	if ((InventoryGet(Player, "Socks") == null) || (InventoryGet(Player, "Socks").Asset.Name != "Stockings2")) return false;
	return true;
}

// When a patient gets committed
/**
 * Commits a player to the asylum for a given time and changes the players reputation
 * @param {string} Duration - The time (in micro seconds) the player gets committed for
 * @param {string} ReputationChange - The amount the player's reputation is going to change
 * @returns {void} - Nothing
 */
function AsylumEntranceCommitPatient(Duration, ReputationChange) {
	LogAdd("Committed", "Asylum", CurrentTime + parseInt(Duration));
	if (ReputationGet("Asylum") >= 0) DialogSetReputation("Asylum", -1);
	DialogChangeReputation("Asylum", parseInt(ReputationChange) * -1);
}

/**
 * The player starts working as a nurse for the Asylum. Dresses the player and sets her reputation to 1
 * @returns {void} - Nothing
 */
function AsylumEntranceStartNurse() {
	AsylumEntranceWearNurseClothes(Player);
	if (ReputationGet("Asylum") <= 0) DialogSetReputation("Asylum", 1);
}

// When a patient player fights for her freedom against the nurse
/**
 * Starts the fight for freedom between the player and the nurse
 * @returns {void} - Nothing
 */
function AsylumEntranceFightNurse() {
	KidnapStart(AsylumEntranceNurse, "AsylumEntrance", 7, "AsylumEntranceFightNurseEnd()");
}

// When the fight against the nurse ends
/**
 * Resolves the result of the fight against the nurse
 * @returns {void} - Nothing
 */
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

/**
 * Restrains the player in a straitjacket with a custom difficulty
 * @param {string} Pose - The tightness of the straitjacket
 * @returns {void} - Nothing
 */
function AsylumEntrancePlayerJacket(Pose) {
	InventoryWear(Player, "StraitJacket", "ItemArms", "Default", 3);
	Player.FocusGroup = AssetGroupGet("Female3DCG", "ItemArms");
	const Options = TypedItemDataLookup.ItemArmsStraitJacket.options;
	const Option = Options.find(o => o.Name === Pose);
	if (Option) {
		ExtendedItemSetType(Player, Options, Option);
	}
	Player.FocusGroup = null;
}

/**
 * Handles the theft of the nurse's clothes by the player
 * @param {number} RepChange - The amount of reputation change
 * @returns {void} - Nothing
 */
function AsylumEntrancePlayerNurseClothes(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	AsylumEntranceWearNurseClothes(Player);
}

/**
 * When the nurse is forced to be a patient (player will be tracked down for a full day after and a title will be forced)
 * @returns {void} - Nothing
 */
function AsylumEntranceNurseBecomePatient() {
	LogAdd("Escaped", "Asylum", CurrentTime + 86400000);
	MainHallRandomEventOdds = 0;
	TitleSet("EscapedPatient");
	LogDelete("Committed", "Asylum");
	AsylumEntranceWearPatientClothes(AsylumEntranceNurse);
}

/**
 * Handles the restraining of the nurse by the player
 * @param {number} RepChange - The amount of reputation change for the player
 * @returns {void} - Nothing
 */
function AsylumEntranceNurseStrap(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	InventoryWear(AsylumEntranceNurse, "StraitJacket", "ItemArms");
	InventoryWear(AsylumEntranceNurse, "SmallBlindfold", "ItemHead");
	InventoryWear(AsylumEntranceNurse, "MuzzleGag", "ItemMouth");
}

//
/**
 * When the player gets committed again after escaping, she is restraint tightly and has to stay for a full day
 * @returns {void} - Nothing
 */
function AsylumEntranceRecommit() {
	DialogChangeReputation("Asylum", -3);
	LogAdd("Committed", "Asylum", CurrentTime + 86400000);
	LogDelete("Escaped", "Asylum");
	TitleSet("None");
	CharacterRelease(Player);
	AsylumEntranceWearPatientClothes(Player);
	AsylumEntrancePlayerJacket("Tight");
}

/**
 * Handles the player being caught by a nurse, after escaping the Asylum. The player is brought back and the doors locked
 * @returns {void} - Nothing
 */
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

/**
 * Handled the player'S fight against the kidnap nurse
 * @returns {void} - Nothing
 */
function AsylumEntranceKidnapNurseFight() {
	DialogChangeReputation("Dominant", 4);
	KidnapStart(AsylumEntranceKidnapNurse, "MainHall", 7, "AsylumEntranceKidnapNurseFightOutro()");
}

/**
 * Resolved the fight against the kidnap nurse
 * @param {boolean} Surrender - Wether the player surrendered or not
 * @returns {void} - Nothing
 */
function AsylumEntranceKidnapNurseFightOutro(Surrender) {
	CommonSetScreen("Room", "AsylumEntrance");
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (AsylumEntranceKidnapNurse.KidnapMaxWillpower - AsylumEntranceKidnapNurse.KidnapWillpower)) * 2);
	if ((Surrender != null) && Surrender) DialogChangeReputation("Dominant", -3);
	AsylumEntranceKidnapNurse.Stage = (KidnapVictory) ? "100" : "200";
	if (!KidnapVictory) CharacterRelease(AsylumEntranceKidnapNurse);
	CharacterSetCurrent(AsylumEntranceKidnapNurse);
	AsylumEntranceKidnapNurse.CurrentDialog = DialogFind(AsylumEntranceKidnapNurse, ((KidnapVictory) ? "Victory" : "Defeat"));
}

/**
 * Handles the bribe attempt of the kidnapping nurse
 * @param {string} BribeAmount - The offered bribe amount
 * @param {string} BribeOdds - The odds of a succesful bribe attempt
 * @returns {void} - Nothing
 */
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

/**
 * When the player transfers the kidnap nurse to her room
 * @returns {void} - Nothing
 */
function AsylumEntranceKidnapNurseTransferToRoom() {
	AsylumEntranceWearNurseClothes(AsylumEntranceKidnapNurse);
	CharacterRelease(Player);
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(AsylumEntranceKidnapNurse, "Nurse");
	DialogLeave();
}

/**
 * When the player leaves the kidnap nurse
 * @returns {void} - Nothing
 */
function AsylumEntranceKidnapNurseExit() {
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

/**
 * When the escaped player walks back to the asylum
 * @returns {void} - Nothing
 */
function AsylumEntranceGoToAsylum() {
	AsylumEntranceBackground = "AsylumEntrance";
	LogAdd("Committed", "Asylum", CurrentTime + 86400000);
	LogDelete("Escaped", "Asylum");
	TitleSet("None");
}

/**
 * When the escaped player is dressed back as a patient
 * @returns {void} - Nothing
 */
function AsylumEntranceBackAsPatient() {
	CharacterRelease(Player);
	AsylumEntranceWearPatientClothes("Player");
	CharacterRelease(AsylumEntranceNurse);
	AsylumEntranceWearNurseClothes(AsylumEntranceNurse);
}

/**
 * The player meets  an escaped patient while on nurse duty
 * @returns {void} - Nothing
 */
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

/**
 * When the player starts a fight against the escaped patient
 * @returns {void} - Nothing
 */
function AsylumEntranceEscapedPatientFight() {
	DialogChangeReputation("Asylum", 2);
	DialogChangeReputation("Dominant", 2);
	KidnapStart(AsylumEntranceEscapedPatient, "MainHall", 4, "AsylumEntranceEscapedPatientFightOutro()");
}

// When the player fight ends against the escaped patient
/**
 * Resolves the fight against an escaped patient
 * @param {boolean} Surrender - Wether the player surrendered or not
 * @returns {void} - Nothing
 */
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

/**
 * Resolves the bribe attempt towards the player by an escaped patient
 * @returns {void} - Nothing
 */
function AsylumEntranceEscapedPatientBribe() {
	CharacterChangeMoney(Player, 5);
	DialogChangeReputation("Asylum", -1);
}

/**
 * When the player transfers a patient to her room
 * @returns {void} - Nothing
 */
function AsylumEntranceEscapedPatientTransferToRoom() {
	AsylumEntranceWearPatientClothes(AsylumEntranceEscapedPatient);
	CharacterRelease(Player);
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(AsylumEntranceEscapedPatient, "Patient");
	DialogLeave();
}

/**
 * Handles the returning of an escaped patient by the player
 * @returns {void} - Nothing
 */
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

/**
 * When the player leaves the escaped patient
 * @returns {void} - Nothing
 */
function AsylumEntranceEscapedPatientLeave() {
	CommonSetScreen("Room", "MainHall");
	DialogLeave();
}

/**
 * The player gets a nurse uniform of her own
 * @returns {void} - Nothing
 */
function AsylumEntranceGiveNurseUniform() {
	var ItemsToEarn = [];
	ItemsToEarn.push({Name: "NurseUniform", Group: "Cloth"});
	ItemsToEarn.push({Name: "NurseCap", Group: "Hat"});
	InventoryAddMany(Player, ItemsToEarn);
}

/**
 * Whether or not a patient has earned a set of Asylum restraints.
 * @returns {boolean} - TRUE if the the player is a patient but is not eligible for their own set of Asylum restraints,
 * FALSE otherwise.
 */
function AsylumEntrancePatientCannotGetRestraints() {
	const reputation = ReputationGet("Asylum");
	return reputation <= -1 && reputation > -100 && !LogQuery("ReputationMaxed", "Asylum");
}

/**
 * Whether or not a patient has earned a set of Asylum restraints.
 * @returns {boolean} - TRUE if the the player is a patient and is eligible for their own set of Asylum restraints,
 * FALSE otherwise.
 */
function AsylumEntrancePatientCanGetRestraints() {
	const reputation = ReputationGet("Asylum");
	return reputation <= -100 && !LogQuery("ReputationMaxed", "Asylum");
}

/**
 * Whether or not a nurse has earned a set of Asylum restraints.
 * @returns {boolean} - TRUE if the the player is a nurse but is not eligible for their own set of Asylum restraints,
 * FALSE otherwise.
 */
function AsylumEntranceNurseCannotGetRestraints() {
	const reputation = ReputationGet("Asylum");
	return reputation >= 1 && reputation < 100 && !LogQuery("ReputationMaxed", "Asylum");
}

/**
 * Whether or not a nurse has earned a set of Asylum restraints.
 * @returns {boolean} - TRUE if the the player is a nurse and is eligible for their own set of Asylum restraints,
 * FALSE otherwise
 */
function AsylumEntranceNurseCanGetRestraints() {
	const reputation = ReputationGet("Asylum");
	return reputation >= 100 && !LogQuery("ReputationMaxed", "Asylum");
}

/**
 * Called when the player has earned their own set of Asylum restraints.
 * @returns {void} - Nothing
 */
function AsylumEntranceGiveRestraints() {
	LogAdd("ReputationMaxed", "Asylum");
	InventoryAddMany(Player, [
		{Name: "MedicalBedRestraints", Group: "ItemArms"},
		{Name: "MedicalBedRestraints", Group: "ItemLegs"},
		{Name: "MedicalBedRestraints", Group: "ItemFeet"},
	]);
}
