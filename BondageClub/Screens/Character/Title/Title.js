"use strict";
var TitleBackground = "Sheet";
var TitleList = [
	{ Name: "None", Requirement: function () { return true; } },
	{ Name: "Mistress", Requirement: function () { return LogQuery("ClubMistress", "Management"); }, Earned: true },
	{ Name: "ClubSlave", Requirement: function () { return ManagementIsClubSlave(); }, Force: true },
	{ Name: "Maid", Requirement: function () { return (LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid")); }, Earned: true },
	{ Name: "HeadMaid", Requirement: function () { return LogQuery("LeadSorority", "Maid"); }, Earned: true },
	{ Name: "BondageMaid", Requirement: function () { return ((LogQuery("JoinedSorority", "Maid") || LogQuery("LeadSorority", "Maid")) && SkillGetLevel(Player, "Evasion") >= 10); }, Earned: true },
	{ Name: "Kidnapper", Requirement: function () { return ((ReputationGet("Kidnap") >= 50) && (ReputationGet("Kidnap") < 100)); }, Earned: true },
	{ Name: "MasterKidnapper", Requirement: function () { return (ReputationGet("Kidnap") >= 100); }, Earned: true },
	{ Name: "Patient", Requirement: function () { return ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") > -100)); }, Earned: true },
	{ Name: "PermanentPatient", Requirement: function () { return (ReputationGet("Asylum") <= -100); }, Earned: true },
	{ Name: "EscapedPatient", Requirement: function () { return (LogValue("Escaped", "Asylum") >= CurrentTime); }, Force: true },
	{ Name: "Nurse", Requirement: function () { return ((ReputationGet("Asylum") >= 50) && (ReputationGet("Asylum") < 100)); }, Earned: true },
	{ Name: "Doctor", Requirement: function () { return (ReputationGet("Asylum") >= 100); }, Earned: true },
	{ Name: "LadyLuck", Requirement: function () { return (ReputationGet("Gambling") >= 100); }, Earned: true },
	{ Name: "Patron", Requirement: function () { return CheatAllow; }, Earned: true },
	{ Name: "CollegeStudent", Requirement: function () { return LogQuery("BondageCollege", "Import"); }, Earned: true },
	{ Name: "Nawashi", Requirement: function () { return (SkillGetLevel(Player, "Bondage") >= 10); }, Earned: true },
	{ Name: "Houdini", Requirement: function () { return (SkillGetLevel(Player, "Evasion") >= 10); }, Earned: true },
	{ Name: "PonyAlicorn", Requirement: function () { return (SkillGetLevel(Player, "Dressage") >= 10); }, Earned: true },
	{ Name: "PonyPegasus", Requirement: function () { return ((SkillGetLevel(Player, "Dressage") >= 8) && (SkillGetLevel(Player, "Dressage") <= 9)); }, Earned: true },
	{ Name: "PonyUnicorn", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 7); }, Earned: true },
	{ Name: "PonyWild", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 6); }, Earned: true },
	{ Name: "PonyHot", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 5); }, Earned: true },
	{ Name: "PonyWarm", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 4); }, Earned: true },
	{ Name: "PonyCold", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 3); }, Earned: true },
	{ Name: "PonyFarm", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 2); }, Earned: true },
	{ Name: "PonyFoal", Requirement: function () { return ((SkillGetLevel(Player, "Dressage") == 1) || ((SkillGetLevel(Player, "Dressage") >= 1) && (ReputationGet("ABDL") >= 1))); }, Earned: true },
	{ Name: "InfilrationMole", Requirement: function () { return ((SkillGetLevel(Player, "Infiltration") == 2) || (SkillGetLevel(Player, "Infiltration") == 3)); }, Earned: true },
	{ Name: "InfilrationInfiltrator", Requirement: function () { return ((SkillGetLevel(Player, "Infiltration") == 4) || (SkillGetLevel(Player, "Infiltration") == 5)); }, Earned: true },
	{ Name: "InfilrationAgent", Requirement: function () { return ((SkillGetLevel(Player, "Infiltration") == 6) || (SkillGetLevel(Player, "Infiltration") == 7)); }, Earned: true },
	{ Name: "InfilrationOperative", Requirement: function () { return ((SkillGetLevel(Player, "Infiltration") == 8) || (SkillGetLevel(Player, "Infiltration") == 9)); }, Earned: true },
	{ Name: "InfilrationSuperspy", Requirement: function () { return (SkillGetLevel(Player, "Infiltration") >= 10); }, Earned: true },
	{ Name: "Duchess", Requirement: function () { return LogQuery("KidnapSophie", "Sarah"); }, Earned: true},
	{ Name: "LittleOne", Requirement: function () { return (ReputationGet("ABDL") >= 1); }, Earned: true },
	{ Name: "Baby", Requirement: function () { return (ReputationGet("ABDL") >= 1); }, Earned: true },
	{ Name: "DL", Requirement: function () { return (ReputationGet("ABDL") >= 1); }, Earned: true },
	{ Name: "BondageBaby", Requirement: function () { return ((SkillGetLevel(Player, "Evasion")) >= 10 && (ReputationGet("ABDL") >= 1)); }, Earned: true },
	{ Name: "Switch", Requirement: function () { return true; } },
	{ Name: "Kitten", Requirement: function () { return true; } },
	{ Name: "Puppy", Requirement: function () { return true; } },
	{ Name: "Foxy", Requirement: function () { return true; } },
	{ Name: "Bunny", Requirement: function () { return true; } },
	{ Name: "Doll", Requirement: function () { return true; } },
	{ Name: "Demon", Requirement: function () { return true; } },
	{ Name: "Angel", Requirement: function () { return true; } },
	{ Name: "Succubus", Requirement: function () { return true; } }
];

/**
 * Sets the new title of the player, if the title has changed
 * @param {string} NewTitle - The new title for the player
 * @returns {string} - The new title of the player
 */
function TitleSet(NewTitle) {
	if (NewTitle != Player.Title) {
		Player.Title = NewTitle;
		ServerAccountUpdate.QueueData({ Title: NewTitle });
	}
	return NewTitle;
}

/**
 * Returns the current title of the given player. If an invalid title is found or the player has to wear a certain title
 * the correct title is pushed to the player's attributes
 * @param {Character} C - The player, whose title we want to get
 * @returns {string} - The title of the given player
 */
function TitleGet(C) {

	// If we find a title that we must force, we set it and return it
	if (C.ID == 0)
		for (let T = 0; T < TitleList.length; T++)
			if (TitleList[T].Requirement() && (TitleList[T].Force != null) && TitleList[T].Force)
				return TitleSet(TitleList[T].Name);

	// No title or other character titles aren't validated
	if ((C.Title == null) || (C.Title == "") || (C.Title == "None")) return "None";
	if (C.ID != 0) return C.Title;

	// If we find a valid title, we return it
	for (let T = 0; T < TitleList.length; T++)
		if ((C.Title == TitleList[T].Name) && TitleList[T].Requirement())
			return C.Title;

	// If the title is invalid, we set it to none
	return TitleSet("None");

}

/**
 * Checks, if the given title is forced a forced title like 'Club Slave' or 'Escaped Patient'
 * @param {string} Title - The title to check
 * @returns {boolean} - Result of the check
 */
function TitleIsForced(Title) {
	if ((Title == null) || (Title == "") || (Title == "None")) return false;
	for (let T = 0; T < TitleList.length; T++)
		if ((Title == TitleList[T].Name) && (TitleList[T].Force != null) && TitleList[T].Force)
			return true;
	return false;
}

/**
 * Checks, if the given title is earned a earned title is any title that doesn't always return true such as 'Switch', 'Doll' & 'Angel'
 * @param {string} Title - The title to check
 * @returns {boolean} - Result of the check
 */
function TitleIsEarned(Title) {
	if ((Title == null) || (Title == "") || (Title == "None")) return false;
	for (let T = 0; T < TitleList.length; T++)
		if ((Title == TitleList[T].Name) && (TitleList[T].Earned != null) && TitleList[T].Earned)
			return true;
	return false;
}

/**
 * Runs the title selection screen. This function is called dynamically on a repeated basis,
 * so don't use complex loops or call extended functions from here.
 * @returns {void} - Nothing
 */
function TitleRun() {

	// List all the available titles
	DrawText(TextGet("SelectTitle"), 1000, 120, "Black", "Gray");
	var X = 130;
	var Y = 200;
	for (let T = 0; T < TitleList.length; T++)
		if (TitleList[T].Requirement()) {
			DrawButton(X, Y, 400, 65, TextGet("Title" + TitleList[T].Name), "White");
			X = X + 450;
			if (X > 1500) {
				X = 130;
				Y = Y + 100;
			}
		}

	// Draw the exit button
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

}

/**
 * Handles the click events in the title selection screen. Clicks are forwarded from CommonClick()
 * @returns {void} - Nothing
 */
function TitleClick() {

	// When the user exits
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) TitleExit();

	// When the user selects a title
	var X = 130;
	var Y = 200;
	for (let T = 0; T < TitleList.length; T++)
		if (TitleList[T].Requirement()) {
			if ((MouseX >= X) && (MouseX <= X + 400) && (MouseY >= Y) && (MouseY <= Y + 65)) {
				TitleSet(TitleList[T].Name);
				CommonSetScreen("Character", "InformationSheet");
			}
			X = X + 450;
			if (X > 1500) {
				X = 130;
				Y = Y + 100;
			}
		}

}

// when the user exit this screen
/**
 * Exits the title selection screen and brings the player back to the InformationSheet
 * @returns {void} - Nothing
 */
function TitleExit() {
	CommonSetScreen("Character", "InformationSheet");
}