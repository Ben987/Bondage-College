var ShibariBackground = "ShibariDojo";
var ShibariTeacher = null;
var ShibariAllowTeacherItem = false;
var ShibariStudent = null;
var ShibariPlayerAppearance = null;
var ShibariSubCommentDone = false;
var ShibariDomCommentDone = false;
var ShibariSurrenderDone = false;
var ShibariSpankDone = false;
var ShibariTeacherReleaseTimer = false;

// Returns TRUE if a specific dialog action is allowed
function ShibariAllowTeacherBondage() { return (!ShibariAllowTeacherItem && DialogReputationGreater("Dominant", 75)); }
function ShibariAllowTeacherStrip() { return (ShibariAllowTeacherItem && !ShibariTeacher.IsRestrained() && (InventoryGet(ShibariTeacher, "Cloth") != null)); }
function ShibariAllowPlayerBondage() { return !Player.IsRestrained() && !ShibariTeacher.IsRestrained() }
function ShibariAllowSpank() { return (((CurrentCharacter.ID == ShibariTeacher.ID) ? (ShibariTeacher.Pose.indexOf("Suspension") >= 0) : (ShibariStudent.Pose.indexOf("Suspension") >= 0)) && Player.CanInteract()) }
function ShibariAllowAskRope() { return (!InventoryAvailable(Player, "SuspensionHempRope", "ItemFeet") && (SkillGetLevel(Player, "Bondage") < 7)) }
function ShibariAllowGetRope() { return (!InventoryAvailable(Player, "SuspensionHempRope", "ItemFeet") && (SkillGetLevel(Player, "Bondage") >= 7)) }

// Loads the shibari dojo characters with many restrains
function ShibariLoad() {
	
	// Default load
	ShibariPlayerAppearance = Player.Appearance.slice();
	if (ShibariTeacher == null) {
		ShibariTeacher = CharacterLoadNPC("NPC_Shibari_Teacher");
		ShibariTeacher.AllowItem = ShibariAllowTeacherItem;
		InventoryWear(ShibariTeacher, "ChineseDress1", "Cloth");
		ShibariStudent = CharacterLoadNPC("NPC_Shibari_Student");
		CharacterNaked(ShibariStudent);
		InventoryAdd(ShibariTeacher, "HempRope", "ItemArms");
		InventoryAdd(ShibariTeacher, "HempRope", "ItemLegs");
		InventoryAdd(ShibariTeacher, "HempRope", "ItemFeet");
		InventoryAdd(ShibariTeacher, "SuspensionHempRope", "ItemFeet");
		InventoryAdd(ShibariTeacher, "HempRopeHarness", "ItemTorso");
		InventoryAdd(ShibariTeacher, "ClothCleaveGag", "ItemMouth");
		InventoryAdd(ShibariStudent, "HempRope", "ItemArms");
		InventoryAdd(ShibariStudent, "HempRope", "ItemLegs");
		InventoryAdd(ShibariStudent, "HempRope", "ItemFeet");
		InventoryAdd(ShibariStudent, "SuspensionHempRope", "ItemFeet");
		InventoryAdd(ShibariStudent, "HempRopeHarness", "ItemTorso");
		InventoryAdd(ShibariStudent, "ClothCleaveGag", "ItemMouth");
		InventoryWear(ShibariStudent, "HempRope", "ItemArms");
		InventoryWear(ShibariStudent, "HempRope", "ItemLegs");
		InventoryWear(ShibariStudent, "SuspensionHempRope", "ItemFeet");
		InventoryWear(ShibariStudent, "HempRopeHarness", "ItemTorso");
		InventoryWear(ShibariStudent, "ClothCleaveGag", "ItemMouth");
	}
	
	// Rescue mission load
	if ((MaidQuartersCurrentRescue == "ShibariDojo") && !MaidQuartersCurrentRescueStarted) {
		MaidQuartersCurrentRescueStarted = true;
		CharacterNaked(ShibariStudent);
		InventoryWear(ShibariStudent, "HempRope", "ItemArms");
		InventoryWear(ShibariStudent, "HempRope", "ItemLegs");
		InventoryWear(ShibariStudent, "SuspensionHempRope", "ItemFeet");
		InventoryWear(ShibariStudent, "HempRopeHarness", "ItemTorso");
		InventoryWearRandom(ShibariStudent, "ItemMouth");
		InventoryWearRandom(ShibariStudent, "ItemHead");
		ShibariStudent.Stage = "MaidRescue";
		CharacterNaked(ShibariTeacher);
		InventoryWear(ShibariTeacher, "HempRope", "ItemArms");
		InventoryWear(ShibariTeacher, "HempRope", "ItemLegs");
		InventoryWear(ShibariTeacher, "SuspensionHempRope", "ItemFeet");
		InventoryWear(ShibariTeacher, "HempRopeHarness", "ItemTorso");
		InventoryWearRandom(ShibariTeacher, "ItemMouth");
		InventoryWearRandom(ShibariTeacher, "ItemHead");		
		ShibariTeacher.Stage = "MaidRescue";
		ShibariStartTeacherBondage();
	}

}

// Run the shibari dojo, draw all 3 characters
function ShibariRun() {
	DrawCharacter(Player, 250, 0, 1);
	DrawCharacter(ShibariTeacher, 750, 0, 1);
	DrawCharacter(ShibariStudent, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanInteract()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
	if (Player.CanInteract()) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Naked.png");
}

// When the user clicks in the shibari dojo
function ShibariClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ShibariTeacher);
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(ShibariStudent);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) { CharacterDress(Player, ShibariPlayerAppearance); CommonSetScreen("Room", "MainHall"); }
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanInteract()) CharacterDress(Player, ShibariPlayerAppearance);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && Player.CanInteract()) CharacterNaked(Player);
}

// When we allow the player to restrain the teacher
function ShibariStartTeacherBondage() {
	ShibariAllowTeacherItem = true;
	ShibariTeacher.AllowItem = true;
}

// When the player gets restrained by the teacher
function ShibariRestrainPlayer(Level) {
	if (Level >= 1) InventoryWear(Player, "HempRope", "ItemArms");
	if (Level >= 2) InventoryWear(Player, "HempRope", "ItemLegs");
	if (Level == 2) InventoryWear(Player, "HempRope", "ItemFeet");
	if (Level >= 3) InventoryWear(Player, "SuspensionHempRope", "ItemFeet");
	if ((Level >= 4) && (InventoryGet(Player, "Cloth") == null) && (InventoryGet(Player, "ItemTorso") == null)) InventoryWear(Player, "HempRopeHarness", "ItemTorso");
	if (Level >= 4) InventoryWearRandom(Player, "ItemMouth");
	InventorySetDifficulty(Player, "ItemArms", (Level - 1) * 3);
	ShibariTeacherReleaseTimer = CommonTime() + ((Level + 1) * 30000);
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