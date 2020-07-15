"use strict";
var AsylumTherapyBackground = "AsylumTherapy";
var AsylumTherapyNurse = null;
var AsylumTherapyPatient = null;

function AsylumTherapyPatientReadyForTherapy() { return (!Player.IsRestrained() && Player.IsNaked()) }

// Loads the room
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

// Runs the room
function AsylumTherapyRun() {
	DrawCharacter(Player, 500, 0, 1);
	if (ReputationGet("Asylum") >= 1) DrawCharacter(AsylumTherapyPatient, 1000, 0, 1);
	if (ReputationGet("Asylum") <= -1) DrawCharacter(AsylumTherapyNurse, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
	if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Naked.png");
}

// When the user clicks in the room
function AsylumTherapyClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && (ReputationGet("Asylum") >= 1)) CharacterSetCurrent(AsylumTherapyPatient);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && (ReputationGet("Asylum") <= -1)) CharacterSetCurrent(AsylumTherapyNurse);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) {
		if (Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) AsylumEntranceWearPatientClothes(Player);
		if ((ReputationGet("Asylum") <= -50) && (LogValue("Committed", "Asylum") >= CurrentTime) && Player.CanInteract()) InventoryWear(Player, "StraitJacket", "ItemArms", "Default", 3);
		CommonSetScreen("Room", "AsylumEntrance");
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) AsylumEntranceWearPatientClothes(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && Player.CanChange() && (LogValue("Committed", "Asylum") >= CurrentTime)) CharacterNaked(Player);
}

// When the player gets ungagged by the nurse
function AsylumTherapyPlayerUngag() {
	DialogChangeReputation("Dominant", -1);
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemHood");
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(Player, "ItemMouth2");
	InventoryRemove(Player, "ItemMouth3");
}

// When the player is stripped and unrestrained
function AsylumTherapyStripPlayer() {
	CharacterRelease(Player);
	CharacterNaked(Player);
}

// Depending on the patient reputation, the bondage therapy gets harsher
function AsylumTherapyBondageTherapyRestrain() {
	if ((ReputationGet("Asylum") <= -1) && (ReputationGet("Asylum") >= -49)) CharacterFullRandomRestrain(Player, "FEW");
	if ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") >= -99)) CharacterFullRandomRestrain(Player, "LOT");
	if ((ReputationGet("Asylum") <= -100) && (ReputationGet("Asylum") >= -100)) CharacterFullRandomRestrain(Player, "ALL");
	if (Player.CanTalk()) InventoryWearRandom(Player, "ItemMouth");
}

// When any therapy ends (fail or success), release player
function AsylumTherapyTherapyEnd() {
	CharacterRelease(Player);
	if (!Player.IsBreastChaste()) InventoryRemove(Player, "ItemNipples");
	InventoryRemove(AsylumTherapyNurse, "ItemHands");
	CharacterSetActivePose(Player, null);
}

// When the patient therapy fails, loses reputation
function AsylumTherapyTherapyFail() {
	DialogChangeReputation("Asylum", 2);
	if (ReputationGet("Asylum") >= 0) DialogSetReputation("Asylum", -1);
	AsylumTherapyTherapyEnd();
}

// When the patient therapy succeeds, gain reputation
function AsylumTherapyTherapySuccess() {
	DialogChangeReputation("Asylum", -4);
	AsylumTherapyTherapyEnd();
}

// Depending on the patient reputation, the pain therapy gets a tougher weapon
function AsylumTherapyPainTherapyRestrain() {
	InventoryWear(Player, "FourLimbsShackles", "ItemArms");
	CharacterSetActivePose(Player, "Kneel");
	InventoryWear(AsylumTherapyNurse, "SpankingToys", "ItemHands");
	if ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") >= -99)) InventoryGet(AsylumTherapyNurse, "ItemHands").Property = { Type: "Paddle" };
	if (ReputationGet("Asylum") <= -100) InventoryGet(AsylumTherapyNurse, "ItemHands").Property = { Type: "Whip" };
	CharacterRefresh(AsylumTherapyNurse);
}

// For the tickle therapy, we use the four limbs shackle that forces the hands behind the back
function AsylumTherapyTickleTherapyRestrain() {
	InventoryWear(Player, "FourLimbsShackles", "ItemArms");
}

// For the tickle therapy, we apply a blindfold that's tougher depending on the patient reputation
function AsylumTherapyTickleTherapyBlindfold() {
	if ((ReputationGet("Asylum") <= -1) && (ReputationGet("Asylum") >= -49)) InventoryWear(Player, "ClothBlindfold", "ItemHead");
	if ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") >= -99)) InventoryWear(Player, "LeatherBlindfold", "ItemHead");
	if ((ReputationGet("Asylum") <= -100) && (ReputationGet("Asylum") >= -100)) InventoryWear(Player, "LeatherHoodOpenMouth", "ItemHood");
}

// For the orgasm therapy, a vibrating toy can be applied on the player's breast
function AsylumTherapyOrgasmTherapyRestrain() {
	if ((ReputationGet("Asylum") <= -1) && (ReputationGet("Asylum") >= -49)) InventoryWear(Player, "TapedVibeEggs", "ItemNipples");
	if ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") >= -99)) InventoryWear(Player, "NippleSuctionCups", "ItemNipples");
	if ((ReputationGet("Asylum") <= -100) && (ReputationGet("Asylum") >= -100)) InventoryWear(Player, "NippleClamp", "ItemNipples");
}

// Initiates the bondage therapy as a nurse
function AsylumTherapyPatientBondageIntro(RepChange, RestraintsLevel) {
	DialogChangeReputation("Dominant", RepChange);
	CharacterFullRandomRestrain(AsylumTherapyPatient, RestraintsLevel);
}

// Initiates the pain therapy as a nurse
function AsylumTherapyPatientPainIntro(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	InventoryWear(AsylumTherapyPatient, "FourLimbsShackles", "ItemArms");
	CharacterSetActivePose(AsylumTherapyPatient, "Kneel");
	InventoryWear(Player, "SpankingToys", "ItemHands");
	if ((ReputationGet("Asylum") >= 50) && (ReputationGet("Asylum") <= 99)) InventoryGet(Player, "ItemHands").Property = { Type: "Paddle" };
	if (ReputationGet("Asylum") >= 100) InventoryGet(Player, "ItemHands").Property = { Type: "Whip" };
	CharacterRefresh(Player);
}

// Initiates the tickle therapy as a nurse
function AsylumTherapyPatientTickleIntro(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	InventoryWear(AsylumTherapyPatient, "FourLimbsShackles", "ItemArms");
	if ((ReputationGet("Asylum") >= 1) && (ReputationGet("Asylum") <= 49)) InventoryWear(AsylumTherapyPatient, "ClothBlindfold", "ItemHead");
	if ((ReputationGet("Asylum") >= 50) && (ReputationGet("Asylum") <= 99)) InventoryWear(AsylumTherapyPatient, "LeatherBlindfold", "ItemHead");
	if (ReputationGet("Asylum") >= 100) InventoryWear(AsylumTherapyPatient, "LeatherHoodOpenMouth", "ItemHood");
	CharacterRefresh(AsylumTherapyPatient);
}

// Initiates the orgasm therapy as a nurse
function AsylumTherapyPatientOrgasmIntro(RepChange) {
	DialogChangeReputation("Dominant", RepChange);
	InventoryWear(AsylumTherapyPatient, "FourLimbsShackles", "ItemArms");
	if ((ReputationGet("Asylum") >= 1) && (ReputationGet("Asylum") <= 49)) InventoryWear(AsylumTherapyPatient, "TapedVibeEggs", "ItemNipples");
	if ((ReputationGet("Asylum") >= 50) && (ReputationGet("Asylum") <= 99)) InventoryWear(AsylumTherapyPatient, "NippleSuctionCups", "ItemNipples");
	if (ReputationGet("Asylum") >= 100) InventoryWear(AsylumTherapyPatient, "NippleClamp", "ItemNipples");
	CharacterRefresh(AsylumTherapyPatient);
}

// Starts the therapy mini-game as a nurse
function AsylumTherapyTherapyStart(Difficulty) {
	TherapyCharacterLeft = Player;
	TherapyCharacterRight = AsylumTherapyPatient;
	MiniGameStart("Therapy", Difficulty, "AsylumTherapyTherapyMiniGameEnd");
}

// Ends the therapy mini-game as a nurse, plays with reputation and money
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

// When a new patient comes in
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