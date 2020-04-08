"use strict";
var ShibariBackground = "Shibari";
var ShibariTeacher = null;
var ShibariTeacherAppearance = null;
var ShibariAllowTeacherItem = false;
var ShibariStudent = null;
var ShibariPlayerAppearance = null;
var ShibariSubCommentDone = false;
var ShibariDomCommentDone = false;
var ShibariSurrenderDone = false;
var ShibariSpankDone = false;
var ShibariTeacherReleaseTimer = false;
var ShibariRescueScenario = "";
var ShibariRescueScenarioList = ["JapaneseGirl", "RebelStudent", "SelfBondage", "HeadMistress"];
var ShibariTrainingPrice = 20;
var ShibariTrainingPriceList = [20, 40, 75, 125, 200, 300, 450, 600, 800, 1000];

// Returns TRUE if a specific dialog action is allowed
function ShibariAllowTeacherBondage() { return (!ShibariAllowTeacherItem && DialogReputationGreater("Dominant", 75)); }
function ShibariAllowTeacherStrip() { return (ShibariAllowTeacherItem && !ShibariTeacher.IsRestrained() && (InventoryGet(ShibariTeacher, "Cloth") != null) && ShibariTeacher.CanTalk()); }
function ShibariAllowPlayerBondage() { return !Player.IsRestrained() && !ShibariTeacher.IsRestrained() }
function ShibariAllowSpank() { return (((CurrentCharacter.ID == ShibariTeacher.ID) ? (ShibariTeacher.Pose.indexOf("Suspension") >= 0) : (ShibariStudent.Pose.indexOf("Suspension") >= 0)) && Player.CanInteract()) }
function ShibariIsRescueScenario(ScenarioName) { return (ShibariRescueScenario == ScenarioName) }
function ShibariIsTeacherRestrained() { return (ShibariTeacher.IsRestrained() || !ShibariTeacher.CanTalk()) }
function ShibariCanTrainSkill(SkillType) { return (SkillGetLevelReal(Player, SkillType) < 10) }
function ShibariCanPayForTraining() { return (Player.Money >= ShibariTrainingPrice) }

// Puts a character in a random bondage position
function ShibariRandomBondage(C, Level) {
	
	// For NPCs, we give the items
	if (C.ID != 0) {
		InventoryAdd(C, "HempRope", "ItemArms");
		InventoryAdd(C, "HempRope", "ItemLegs");
		InventoryAdd(C, "HempRope", "ItemFeet");
		InventoryAdd(C, "HempRopeHarness", "ItemTorso");
		InventoryAdd(C, "BambooGag", "ItemMouth");
	}
	
	// At a level of 0, we pick a random level, over zero, we apply restrains
	if (Level >= 0) {
		
		// Wears more item with higher levels
		if (Level >= 1) InventoryWear(C, "HempRope", "ItemArms", "Default", (Level - 1) * 3);
		if (Level >= 2) InventoryWear(C, "HempRope", "ItemLegs", "Default", (Level - 1) * 3);
		if (Level >= 2) InventoryWear(C, "HempRope", "ItemFeet", "Default", (Level - 1) * 3);
		if ((Level >= 3) && (InventoryGet(C, "Cloth") == null) && (InventoryGet(C, "ItemTorso") == null)) {
			InventoryWear(C, "HempRopeHarness", "ItemTorso", "Default", (Level - 1) * 3);
			if (Math.random() > 0.66) InventoryGet(C, "ItemTorso").Property = { Type: "Diamond", Difficulty: 0, Effect: [] };
			else if (Math.random() > 0.5) InventoryGet(C, "ItemTorso").Property = { Type: "Harness", Difficulty: 0, Effect: [] };
		}
		if (Level >= 4) InventoryWear(C, "BambooGag", "ItemMouth");
		
		// At 3 or more, there's a random chance of a more complicated bondage
		if (Level >= 3) {
			Level = Math.floor(Math.random() * 4);
			InventoryGet(C, "ItemFeet").Property = { Type: null };
			InventoryGet(C, "ItemArms").Property = { Type: null };
			if (Level == 1) InventoryGet(C, "ItemFeet").Property = { Type: "Suspension", SetPose: ["Suspension", "LegsClosed"], Difficulty: 0, Effect: [] };
			if (Level == 2) InventoryGet(C, "ItemArms").Property = { Type: "Hogtied", SetPose: ["Hogtied"], Difficulty: 0, Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], Effect: ["Block", "Freeze", "Prone"] };
			if (Level == 3) InventoryGet(C, "ItemArms").Property = { Type: "SuspensionHogtied", SetPose: ["Hogtied", "SuspensionHogtied"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], Difficulty: 0, Effect: ["Block", "Freeze", "Prone"] };
			if (Level == 3) InventoryWear(C, "SuspensionHempRope", "ItemHidden");
		}
		CharacterRefresh(C);
	}
}

// Loads the shibari dojo characters with many restrains
function ShibariLoad() {
	
	// Default load
	if (ShibariPlayerAppearance == null) ShibariPlayerAppearance = Player.Appearance.slice();
	if (ShibariTeacher == null) {
		ShibariTeacher = CharacterLoadNPC("NPC_Shibari_Teacher");
		ShibariTeacher.AllowItem = ShibariAllowTeacherItem;
		InventoryWear(ShibariTeacher, "ChineseDress" + (Math.floor(Math.random() * 2) + 1).toString(), "Cloth");
		InventoryRemove(ShibariTeacher, "ClothLower");
		ShibariTeacherAppearance = ShibariTeacher.Appearance.slice();
		ShibariStudent = CharacterLoadNPC("NPC_Shibari_Student");
		CharacterNaked(ShibariStudent);
		ShibariRandomBondage(ShibariStudent, 4);
	}
	
	// Rescue mission load
	if ((MaidQuartersCurrentRescue == "ShibariDojo") && !MaidQuartersCurrentRescueStarted) {
		MaidQuartersCurrentRescueStarted = true;
		CharacterNaked(ShibariStudent);
		ShibariStudent.Stage = "MaidRescue";
		CharacterNaked(ShibariTeacher);
		ShibariTeacher.Stage = "MaidRescue";
		ShibariStartTeacherBondage();
		ShibariRescueScenario = CommonRandomItemFromList(ShibariRescueScenario, ShibariRescueScenarioList);
		ShibariRandomBondage(ShibariTeacher, 4);
		ShibariRandomBondage(ShibariStudent, 4);
	}

}

// Run the shibari dojo, draw all 3 characters
function ShibariRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(ShibariTeacher, 750, 0, 1);
	DrawCharacter(ShibariStudent, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanChange()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
	if (Player.CanChange()) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Naked.png");
}

// When the user clicks in the shibari dojo
function ShibariClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ShibariTeacher);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ShibariStudent);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanChange()) CharacterDress(Player, ShibariPlayerAppearance);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && Player.CanChange()) CharacterNaked(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) {
		CharacterDress(Player, ShibariPlayerAppearance);
		ShibariPlayerAppearance = null;
		CommonSetScreen("Room", "MainHall");
	}
}

// When we allow the player to restrain the teacher
function ShibariStartTeacherBondage() {
	ShibariAllowTeacherItem = true;
	ShibariTeacher.AllowItem = true;
}

// When the player gets restrained by the teacher
function ShibariRestrainPlayer(Level) {
	ShibariRandomBondage(Player, Level);
	ShibariTeacherReleaseTimer = CommonTime() + 60000;
}

// On the first submissive comment, we lower the dominant value
function ShibariSubComment() {
	if (!ShibariSubCommentDone) {
		ReputationProgress("Dominant", -2);
		ShibariSubCommentDone = true;
	}
}

// On the first dominant comment, we raise the dominant value
function ShibariDomComment() {
	if (!ShibariDomCommentDone) {
		ReputationProgress("Dominant", 2);
		ShibariDomCommentDone = true;
	}
}

// On the first time the character surrenders to the teacher
function ShibariSurrenderToTeacher() {
	if (CommonTime() >= ShibariTeacherReleaseTimer) {
		CharacterRelease(Player);
		if (InventoryGet(Player, "Cloth") == null) InventoryRemove(Player, "ItemTorso");
		if (!ShibariSurrenderDone) {
			ReputationProgress("Dominant", -2);
			ShibariSurrenderDone = true;
		}
		ShibariTeacher.Stage = "0";
		ShibariTeacher.CurrentDialog = DialogFind(ShibariTeacher, "TeacherRelease");
	}
}

// On the first time the character spanks the submissive or the teacher
function ShibariSpank() {
	if (!ShibariSpankDone) {
		ReputationProgress("Dominant", 2);
		ShibariSpankDone = true;
	}
}

// When the teacher gives the suspension hemp rope to the player
function ShibariGetRope() {
	InventoryAdd(Player, "SuspensionHempRope", "ItemFeet");
}

// When the player rescue the teacher and completes the mission
function ShibariCompleteRescue() {
	ShibariAllowTeacherItem = false;
	ShibariTeacher.AllowItem = false;
	CharacterRelease(ShibariTeacher);
	CharacterDress(ShibariTeacher, ShibariTeacherAppearance);
	MaidQuartersCurrentRescueCompleted = true;
	ShibariStudent.Stage = "0";
}

// The training price is linked to the current skill level of the player
function ShibariCalculateTrainingPrice(SkillType) {
	ShibariTrainingPrice = ShibariTrainingPriceList[SkillGetLevelReal(Player, SkillType)];
	ShibariTeacher.CurrentDialog = ShibariTeacher.CurrentDialog.replace("MoneyAmount", ShibariTrainingPrice.toString());
}

// When the player pays to get trained in a skill
function ShibariPayForTraining(SkillType) {

	// Raises the actual progress by 25 to 50%, can gain a level
	var L = SkillGetLevelReal(Player, SkillType);
	var P = SkillGetProgress(Player, SkillType) + 250 + Math.round(Math.random() * 250);
	if (P >= 1000) {
		L++;
		P = 0;
	}

	// Updates the player skill and money
	SkillChange(SkillType, L, P);
	CharacterChangeMoney(Player, ShibariTrainingPrice * -1);

}