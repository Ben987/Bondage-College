"use strict";
var TitleBackground = "Sheet";
var TitleList = [
	{ Name: "None", Requirement: function () { return true } },
	{ Name: "Mistress", Requirement: function () { return LogQuery("ClubMistress", "Management") } },
	{ Name: "Maid", Requirement: function () { return (LogQuery("JoinedSorority", "Maid") && !LogQuery("LeadSorority", "Maid")) } },
	{ Name: "HeadMaid", Requirement: function () { return LogQuery("LeadSorority", "Maid") } },
	{ Name: "Kidnapper", Requirement: function () { return ((ReputationGet("Kidnap") >= 50) && (ReputationGet("Kidnap") < 100)) } },
	{ Name: "MasterKidnapper", Requirement: function () { return (ReputationGet("Kidnap") >= 100) } },
	{ Name: "Patient", Requirement: function () { return ((ReputationGet("Asylum") <= -50) && (ReputationGet("Asylum") > -100)) } },
	{ Name: "PermanentPatient", Requirement: function () { return (ReputationGet("Asylum") <= -100) } },
	{ Name: "EscapedPatient", Requirement: function () { return (LogValue("Escaped", "Asylum") >= CurrentTime) }, Force: true },
	{ Name: "Nurse", Requirement: function () { return ((ReputationGet("Asylum") >= 50) && (ReputationGet("Asylum") < 100)) } },
	{ Name: "Doctor", Requirement: function () { return (ReputationGet("Asylum") >= 100) } },
	{ Name: "PonyPegasus", Requirement: function () { return (SkillGetLevel(Player, "Dressage") >= 10) } },
	{ Name: "PonyUnicorn", Requirement: function () { return ((SkillGetLevel(Player, "Dressage") >= 8) && (SkillGetLevel(Player, "Dressage") <= 9)) } },
	{ Name: "PonyWild", Requirement: function () { return ((SkillGetLevel(Player, "Dressage") >= 6) && (SkillGetLevel(Player, "Dressage") <= 7)) } },
	{ Name: "PonyHot", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 5) } },
	{ Name: "PonyWarm", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 4) } },
	{ Name: "PonyCold", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 3) } },
	{ Name: "PonyFarm", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 2) } },
	{ Name: "PonyFoal", Requirement: function () { return (SkillGetLevel(Player, "Dressage") == 1) } }
]

// Sets the title for the player
function TitleSet(NewTitle) {
	if (NewTitle != Player.Title) {
		Player.Title = NewTitle;
		ServerSend("AccountUpdate", { Title: NewTitle } );
	}
	return NewTitle;
}

// Returns the current title and validates the title for the player
function TitleGet(C) {

	// No title or other character titles aren't validated
	if ((C.Title == null) || (C.Title == "") || (C.Title == "None")) return "None";
	if (C.ID != 0) return C.Title;

	// If we find a title that we must force, we set it and return it
	for (var T = 0; T < TitleList.length; T++)
		if (TitleList[T].Requirement() && (TitleList[T].Force != null) && TitleList[T].Force)
			return TitleSet(TitleList[T].Name);

	// If we find a valid title, we return it
	for (var T = 0; T < TitleList.length; T++)
		if ((C.Title == TitleList[T].Name) && TitleList[T].Requirement())
			return C.Title;

	// If the title is invalid, we set it to none
	return TitleSet("None");

}

// Returns TRUE if the current player title is forced upon her
function TitleIsForced() {
	if ((Player.Title == null) || (Player.Title == "") || (Player.Title == "None")) return false;
	for (var T = 0; T < TitleList.length; T++)
		if ((Player.Title == TitleList[T].Name) && (TitleList[T].Force != null) && TitleList[T].Force)
			return true;
	return false;
}

// Run the title selection screen
function TitleRun() {

	// List all the available titles
	DrawText(TextGet("SelectTitle"), 1000, 120, "Black", "Gray");
	var X = 130;
	var Y = 200;
	for (var T = 0; T < TitleList.length; T++)
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

// When the user clicks on the screen
function TitleClick() {

	// When the user exits
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) CommonSetScreen("Character", "InformationSheet");

	// When the user selects a title
	var X = 130;
	var Y = 200;
	for (var T = 0; T < TitleList.length; T++)
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