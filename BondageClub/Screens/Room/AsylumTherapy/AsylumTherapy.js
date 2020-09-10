"use strict";
var AsylumTherapyBackground = "AsylumTherapy";
var AsylumTherapyNurse = null;
var AsylumTherapyPatient = null;

/**
 * Checks if the therapy for the player can start
 * @returns {boolean} - Returns true, if the player is ready for therapy, false otherwise
 */
function AsylumTherapyPatientReadyForTherapy() { return (!Player.IsRestrained() && Player.IsNaked()) }

/**
 * Loads the room and initializes the nurse and the patient
 * @returns {void} - Nothing
 */
function AsylumTherapyLoad() {
	if (AsylumTherapyNurse == null) {
		AsylumTherapyNurse = CharacterLoadNPC("NPC_AsylumTherapy_Nurse");
		AsylumEntranceWearNurseClothes(AsylumTherapyNurse);
		AsylumTherapyNurse.AllowItem = false;
	}
	if (AsylumTherapyPatient == null) {
		AsylumTherapyPatient = CharacterLoadNPC("NPC_AsylumTherapy_Patient");
		AsylumEntranceWearPatientClothes(AsylumTherapyPatient);
		AsylumTherapyPatient.AllowItem = false;
	}
}

/**
 * Runs the room. This function is called over and over again at short intervals. So better don't use expensive loops or functions from here.
 * @returns {void} - Nothing
 */
function AsylumTherapyRun() {
	DrawCharacter(Player, 500, 0, 1);
	if (ReputationGet("Asylum") >= 1) DrawCharacter(AsylumTherapyPatient, 1000, 0, 1);
	if (ReputationGet("Asylum") <= -1) DrawCharacter(AsylumTherapyNurse, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
	if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Naked.png");
}

/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function AsylumTherapyClick() {
	if (MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1000, 0, 500, 1000) && (ReputationGet("Asylum") >= 1)) CharacterSetCurrent(AsylumTherapyPatient);
	if (MouseIn(1000, 0, 500, 1000) && (ReputationGet("Asylum") <= -1)) CharacterSetCurrent(AsylumTherapyNurse);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) {
		if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) AsylumEntranceWearPatientClothes(Player);
		if ((ReputationGet("Asylum") <= -50) && (LogValue("Committed", "Asylum") >= CurrentTime) && Player.CanInteract()) InventoryWear(Player, "StraitJacket", "ItemArms", "Default", 3);
		CommonSetScreen("Room", "AsylumEntrance");
	}
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1885, 265, 90, 90) && Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) AsylumEntranceWearPatientClothes(Player);
	if (MouseIn(1885, 385, 90, 90) && Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) CharacterNaked(Player);
}

/**
 * When the player gets ungagged by the nurse, her reputation is reduced
 * @returns {void} - Nothing
 */
function AsylumTherapyPlayerUngag() {
	DialogChangeReputation("Dominant", -1);
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemHood");
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(Player, "ItemMouth2");
	InventoryRemove(Player, "ItemMouth3");
}

/**
 * Release and strip the player
 * @returns {void} - Nothing
 */
function AsylumTherapyStripPlayer() {
	CharacterRelease(Player);
	CharacterNaked(Player);
}

/**
 * Apply restraints on the player for bondage therapy. Depending on the patient reputation, the bondage therapy gets harsher
 * @returns {void} - Nothing
 */
function AsylumTherapyBondageTherapyRestrain() {
	if ((ReputationGet("Asylum") <= -1) && (ReputationGet("Asylum") >= -49)) CharacterFullRandomRestrain(Player, "FEW");
	if ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") >= -99)) CharacterFullRandomRestrain(Player, "LOT");
	if ((ReputationGet("Asylum") <= -100) && (ReputationGet("Asylum") >= -100)) CharacterFullRandomRestrain(Player, "ALL");
	if (Player.CanTalk()) InventoryWearRandom(Player, "ItemMouth");
}

/**
 * Releases the player at the end of a therapy session
 * @returns {void} - Nothing
 */
function AsylumTherapyTherapyEnd() {
	CharacterRelease(Player);
	if (!Player.IsBreastChaste()) InventoryRemove(Player, "ItemNipples");
	InventoryRemove(AsylumTherapyNurse, "ItemHands");
	CharacterSetActivePose(Player, null);
}

/**
 * When the patient therapy fails, loses reputation
 * @returns {void} - Nothing
 */
function AsylumTherapyTherapyFail() {
	DialogChangeReputation("Asylum", 2);
	if (ReputationGet("Asylum") >= 0) DialogSetReputation("Asylum", -1);
	AsylumTherapyTherapyEnd();
}

/**
 * When the patient therapy succeeds, gain reputation
 * @returns {void} - Nothing
 */
function AsylumTherapyTherapySuccess() {
	DialogChangeReputation("Asylum", -4);
	AsylumTherapyTherapyEnd();
}

/**
 * Apply restraints on the player for pain therapy. 
 * Depending on the patient's reputation, the pain therapy gets a tougher weapon
 * @returns {void} - Nothing
 */
function AsylumTherapyPainTherapyRestrain() {
	InventoryWear(Player, "FourLimbsShackles", "ItemArms");
	CharacterSetActivePose(Player, "Kneel");
	InventoryWear(AsylumTherapyNurse, "SpankingToys", "ItemHands");
	if ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") >= -99)) InventoryGet(AsylumTherapyNurse, "ItemHands").Property = { Type: "Paddle" };
	if (ReputationGet("Asylum") <= -100) InventoryGet(AsylumTherapyNurse, "ItemHands").Property = { Type: "Whip" };
	CharacterRefresh(AsylumTherapyNurse);
}

/**
 * For the tickle therapy, we use the four limbs shackle that forces the hands behind the back
 * @returns {void} - Nothing
 */
function AsylumTherapyTickleTherapyRestrain() {
	InventoryWear(Player, "FourLimbsShackles", "ItemArms");
}

/**
 * For the tickle therapy, we apply a blindfold that's tougher depending on the patient reputation
 * @returns {void} - Nothing
 */
function AsylumTherapyTickleTherapyBlindfold() {
	if ((ReputationGet("Asylum") <= -1) && (ReputationGet("Asylum") >= -49)) InventoryWear(Player, "ClothBlindfold", "ItemHead");
	if ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") >= -99)) InventoryWear(Player, "LeatherBlindfold", "ItemHead");
	if ((ReputationGet("Asylum") <= -100) && (ReputationGet("Asylum") >= -100)) InventoryWear(Player, "LeatherHoodOpenMouth", "ItemHood");
}

/**
 * For the orgasm therapy, a vibrating toy can be applied on the player's breast
 * @returns {void} - Nothing
 */
function AsylumTherapyOrgasmTherapyRestrain() {
	if ((ReputationGet("Asylum") <= -1) && (ReputationGet("Asylum") >= -49)) InventoryWear(Player, "TapedVibeEggs", "ItemNipples");
	if ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") >= -99)) InventoryWear(Player, "NippleSuctionCups", "ItemNipples");
	if ((ReputationGet("Asylum") <= -100) && (ReputationGet("Asylum") >= -100)) InventoryWear(Player, "NippleClamp", "ItemNipples");
}

/**
 * Initiates the bondage therapy as a nurse
 * @param {number} RepChange - The amount, the player's reputation changes
 * @param {"FEW" | "LOT" | "ALL" } RestraintsLevel - The level of restraints to use
 * @returns {void} - Nothing
 */
function AsylumTherapyPatientBondageIntro(RepChange, RestraintsLevel) {
	DialogChangeReputation("Dominant", RepChange);
	CharacterFullRandomRestrain(AsylumTherapyPatient, RestraintsLevel);
}

/**
 * Initiates the pain therapy as a nurse
 * @param {number} RepChange - The amount, the player's reputation changes
 * @returns {void} - Nothing
 */
function AsylumTherapyPatientPainIntro(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	InventoryWear(AsylumTherapyPatient, "FourLimbsShackles", "ItemArms");
	CharacterSetActivePose(AsylumTherapyPatient, "Kneel");
	InventoryWear(Player, "SpankingToys", "ItemHands");
	if ((ReputationGet("Asylum") >= 50) && (ReputationGet("Asylum") <= 99)) InventoryGet(Player, "ItemHands").Property = { Type: "Paddle" };
	if (ReputationGet("Asylum") >= 100) InventoryGet(Player, "ItemHands").Property = { Type: "Whip" };
	CharacterRefresh(Player);
}

/**
 * Initiates the tickle therapy as a nurse
 * @param {number} RepChange - The amount, the player's reputation changes
 * @returns {void} - Nothing
 */
function AsylumTherapyPatientTickleIntro(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	InventoryWear(AsylumTherapyPatient, "FourLimbsShackles", "ItemArms");
	if ((ReputationGet("Asylum") >= 1) && (ReputationGet("Asylum") <= 49)) InventoryWear(AsylumTherapyPatient, "ClothBlindfold", "ItemHead");
	if ((ReputationGet("Asylum") >= 50) && (ReputationGet("Asylum") <= 99)) InventoryWear(AsylumTherapyPatient, "LeatherBlindfold", "ItemHead");
	if (ReputationGet("Asylum") >= 100) InventoryWear(AsylumTherapyPatient, "LeatherHoodOpenMouth", "ItemHood");
	CharacterRefresh(AsylumTherapyPatient);
}

/**
 * Initiates the orgasm therapy as a nurse
 * @param {number} RepChange - The amount, the player's reputation changes
 * @returns {void} - Nothing
*/
function AsylumTherapyPatientOrgasmIntro(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	InventoryWear(AsylumTherapyPatient, "FourLimbsShackles", "ItemArms");
	if ((ReputationGet("Asylum") >= 1) && (ReputationGet("Asylum") <= 49)) InventoryWear(AsylumTherapyPatient, "TapedVibeEggs", "ItemNipples");
	if ((ReputationGet("Asylum") >= 50) && (ReputationGet("Asylum") <= 99)) InventoryWear(AsylumTherapyPatient, "NippleSuctionCups", "ItemNipples");
	if (ReputationGet("Asylum") >= 100) InventoryWear(AsylumTherapyPatient, "NippleClamp", "ItemNipples");
	CharacterRefresh(AsylumTherapyPatient);
}

/**
 * Starts the therapy mini-game as a nurse
 * @param {number} Difficulty - The difficulty of the mini game
 * @returns {void} - Nothing
 */
function AsylumTherapyTherapyStart(Difficulty) {
	TherapyCharacterLeft = Player;
	TherapyCharacterRight = AsylumTherapyPatient;
	MiniGameStart("Therapy", Difficulty, "AsylumTherapyTherapyMiniGameEnd");
}

/**
 * Ends the therapy mini-game as a nurse, plays with reputation and money
 * @returns {void} - Nothing
 */
function AsylumTherapyTherapyMiniGameEnd() {
	CommonSetScreen("Room", "AsylumTherapy");
	CharacterSetActivePose(AsylumTherapyPatient, null);
	InventoryRemove(AsylumTherapyPatient, "ItemHead");
	InventoryRemove(AsylumTherapyPatient, "ItemHood");
	InventoryRemove(AsylumTherapyPatient, "ItemMouth");
	CharacterSetCurrent(AsylumTherapyPatient);
	AsylumTherapyPatient.Stage = MiniGameVictory ? "1100" : "1200";
	AsylumTherapyPatient.CurrentDialog = DialogFind(AsylumTherapyPatient, MiniGameVictory ? "TherapyVictory" : "TherapyDefeat");
	if (!MiniGameVictory) {
		DialogChangeReputation("Asylum", -2);
		if (ReputationGet("Asylum") <= 0) DialogSetReputation("Asylum", 1);
	}
	if (MiniGameVictory && (MiniGameDifficulty == "Easy")) {
		DialogChangeReputation("Asylum", 2);
		CharacterChangeMoney(Player, 10);
	}
	if (MiniGameVictory && (MiniGameDifficulty == "Normal")) {
		DialogChangeReputation("Asylum", 4);
		CharacterChangeMoney(Player, 15);
	}
	if (MiniGameVictory && (MiniGameDifficulty == "Hard")) {
		DialogChangeReputation("Asylum", 6);
		CharacterChangeMoney(Player, 20);
	}
	if (MiniGameVictory) IntroductionJobProgress("DomTrainer");
}

/**
 * When a new patient comes in
 * @returns {void} - Nothing
 */
function AsylumTherapyPatientNew() {
	CharacterRelease(AsylumTherapyPatient);
	InventoryRemove(AsylumTherapyPatient, "ItemNeck");
	InventoryRemove(Player, "ItemHands");
	AsylumTherapyPatient = CharacterLoadNPC("NPC_AsylumTherapy_Patient");
	CharacterAppearanceFullRandom(AsylumTherapyPatient);
	AsylumEntranceWearPatientClothes(AsylumTherapyPatient);
	AsylumTherapyPatient.AllowItem = false;
	CharacterRandomName(AsylumTherapyPatient);
	if (CurrentCharacter != null) DialogLeave();
}