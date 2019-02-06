"use strict";
var InformationSheetBackground = "Sheet";
var InformationSheetSelection = null;
var InformationSheetPreviousModule = "";
var InformationSheetPreviousScreen = "";

// Gets the best title for the player and returns it
function InformationSheetGetTitle() {
	if (LogQuery("LeadSorority", "Maid")) return TextGet("TitleHeadMaid");
	if (ReputationGet("Kidnap") >= 100) return TextGet("TitleMasterKidnapper");
	if (LogQuery("JoinedSorority", "Maid")) return TextGet("TitleMaid");
	if (ReputationGet("Kidnap") >= 50) return TextGet("TitleKidnapper");
	return TextGet("TitleNone");
}

// Run the character info screen
function InformationSheetRun() {

	// Draw the character base values
	var C = InformationSheetSelection;
	DrawCharacter(C, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Name") + " " + C.Name, 550, 125, "Black", "Gray");
	DrawText(TextGet("Title") + " " + ((C.ID == 0) ? InformationSheetGetTitle() : TextGet("TitleNone")), 550, 200, "Black", "Gray");
	DrawText(TextGet("Owner") + " " + (((C.Owner == null) || (C.Owner == "")) ? TextGet("OwnerNone") : C.Owner.replace("NPC-", "")), 550, 275, "Black", "Gray");
	DrawText(TextGet("Lover") + " " + (((C.Lover == null) || (C.Lover == "")) ? TextGet("LoverNone") : C.Lover.replace("NPC-", "")), 550, 350, "Black", "Gray");
	if (C.ID == 0) DrawText(TextGet("Money") + " " + C.Money.toString() + " $", 550, 425, "Black", "Gray");

	// For player character, we show the reputation and skills
	if (C.ID == 0) {

		// Draw the reputation section
		DrawText(TextGet("Reputation"), 1000, 125, "Black", "Gray");
		var pos = 0;
		for(var R = 0; R < C.Reputation.length; R++)
			if (C.Reputation[R].Value != 0) {
				DrawText(TextGet("Reputation" + C.Reputation[R].Type + ((C.Reputation[R].Value > 0) ? "Positive" : "Negative")) + " " + Math.abs(C.Reputation[R].Value).toString(), 1000, 200 + pos * 75, "Black", "Gray");
				pos++;
			}
		if (pos == 0) DrawText(TextGet("ReputationNone"), 1000, 200, "Black", "Gray");

		// Draw the skill section
		DrawText(TextGet("Skill"), 1450, 125, "Black", "Gray");
		for(var S = 0; S < C.Skill.length; S++)
			DrawText(TextGet("Skill" + C.Skill[S].Type) + " " + C.Skill[S].Level.toString() + " (" + Math.floor(C.Skill[S].Progress / 10) + "%)", 1450, 200 + S * 75, "Black", "Gray");
		if (C.Skill.length == 0) DrawText(TextGet("SkillNone"), 1450, 200, "Black", "Gray");
	
	} else {

		// For NPC characters, we show the traits
		DrawText(TextGet("Trait"), 1000, 125, "Black", "Gray");
		var pos = 0;
		for(var T = 0; T < C.Trait.length; T++)
			if ((C.Trait[T].Value != null) && (C.Trait[T].Value > 0)) {
				DrawText(TextGet("Trait" + C.Trait[T].Name) + " " + C.Trait[T].Value.toString(), 1000, 200 + pos * 75, "Black", "Gray");
				pos++;
			}

	}
	

	// Draw the last controls
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

}

// When the user clicks on the character info screen
function InformationSheetClick() {
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) CommonSetScreen(InformationSheetPreviousModule, InformationSheetPreviousScreen);
}

// Loads the information sheet for a character
function InformationSheetLoadCharacter(C) {
	InformationSheetSelection = C;
	InformationSheetPreviousModule = CurrentModule;
	InformationSheetPreviousScreen = CurrentScreen;
	CommonSetScreen("Character", "InformationSheet");
}