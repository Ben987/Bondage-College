"use strict";
var InformationSheetBackground = "Sheet";
var InformationSheetSelection = null;
var InformationSheetPreviousModule = "";
var InformationSheetPreviousScreen = "";

// Gets the best title for the player and returns it
function InformationSheetGetTitle() {
	if (LogQuery("ClubMistress", "Management")) return TextGet("TitleMistress");
	if (SkillGetLevel(Player, "Dressage") >= 10) return TextGet("TitlePonyPegasus");
	if (LogQuery("LeadSorority", "Maid")) return TextGet("TitleHeadMaid");
	if (ReputationGet("Kidnap") >= 100) return TextGet("TitleMasterKidnapper");
	if (SkillGetLevel(Player, "Dressage") >= 8) return TextGet("TitlePonyUnicorn");
	if (SkillGetLevel(Player, "Dressage") >= 6) return TextGet("TitlePonyWild");
	if (SkillGetLevel(Player, "Dressage") >= 5) return TextGet("TitlePonyHot");
	if (LogQuery("JoinedSorority", "Maid")) return TextGet("TitleMaid");
	if (ReputationGet("Kidnap") >= 50) return TextGet("TitleKidnapper");
	if (SkillGetLevel(Player, "Dressage") >= 4) return TextGet("TitlePonyWarm");
	if (SkillGetLevel(Player, "Dressage") >= 3) return TextGet("TitlePonyCold");
	if (SkillGetLevel(Player, "Dressage") >= 2) return TextGet("TitlePonyFarm");
	if (SkillGetLevel(Player, "Dressage") >= 1) return TextGet("TitlePonyFoal");
	return TextGet("TitleNone");
}

// Returns the NPC love text
function InformationSheetGetLove(Love) {
	if (Love >= 100) return TextGet("Relationship") + " " + Love.toString() + " " + TextGet("RelationshipPerfect");
	if (Love >= 75) return TextGet("Relationship") + " " + Love.toString() + " " + TextGet("RelationshipGreat");
	if (Love >= 50) return TextGet("Relationship") + " " + Love.toString() + " " + TextGet("RelationshipGood");
	if (Love >= 25) return TextGet("Relationship") + " " + Love.toString() + " " + TextGet("RelationshipFair");
	if (Love > -25) return TextGet("Relationship") + " " + Love.toString() + " " + TextGet("RelationshipNeutral");
	if (Love > -50) return TextGet("Relationship") + " " + Love.toString() + " " + TextGet("RelationshipPoor");
	if (Love > -75) return TextGet("Relationship") + " " + Love.toString() + " " + TextGet("RelationshipBad");
	if (Love > -100) return TextGet("Relationship") + " " + Love.toString() + " " + TextGet("RelationshipHorrible");
	return TextGet("Relationship") + " " + Love.toString() + " " + TextGet("RelationshipAtrocious");
}

// Run the character info screen
function InformationSheetRun() {

	// Draw the character base values
	var C = InformationSheetSelection;
	DrawCharacter(C, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Name") + " " + C.Name, 550, 125, "Black", "Gray");
	DrawText(TextGet("Title") + " " + ((C.ID == 0) ? InformationSheetGetTitle() : (C.Title == null) ? TextGet("TitleNone") : TextGet("Title" + C.Title)), 550, 200, "Black", "Gray");
	DrawText(TextGet("Owner") + " " + (((C.Owner == null) || (C.Owner == "")) ? TextGet("OwnerNone") : C.Owner.replace("NPC-", "")), 550, 275, "Black", "Gray");
	DrawText(TextGet("Lover") + " " + (((C.Lover == null) || (C.Lover == "")) ? TextGet("LoverNone") : C.Lover.replace("NPC-", "")), 550, 350, "Black", "Gray");

	// Some info are not available for online players
	if (C.AccountName.indexOf("Online-") < 0) {
		if (C.ID == 0) DrawText(TextGet("MemberFor") + " " + (Math.floor((CurrentTime - C.Creation) / 86400000)).toString() + " " + TextGet("Days"), 550, 425, "Black", "Gray");
		else DrawText(TextGet("FriendsFor") + " " + (Math.floor((CurrentTime - NPCEventGet(C, "PrivateRoomEntry")) / 86400000)).toString() + " " + TextGet("Days"), 550, 425, "Black", "Gray");
		if (C.ID == 0) DrawText(TextGet("Money") + " " + C.Money.toString() + " $", 550, 500, "Black", "Gray");
		else if (C.Love != null) DrawText(InformationSheetGetLove(C.Love), 550, 500, "Black", "Gray");
	}

	// For player and online characters, we show the reputation and skills
	if ((C.ID == 0) || (C.AccountName.indexOf("Online-") >= 0)) {

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
		if (C.AccountName.indexOf("Online-") >= 0) {
			DrawText(TextGet("Unknown"), 1450, 200, "Black", "Gray");
		}
		else {
			for(var S = 0; S < C.Skill.length; S++)
				DrawText(TextGet("Skill" + C.Skill[S].Type) + " " + C.Skill[S].Level.toString() + " (" + Math.floor(C.Skill[S].Progress / 10) + "%)", 1450, 200 + S * 75, "Black", "Gray");
			if (C.Skill.length == 0) DrawText(TextGet("SkillNone"), 1450, 200, "Black", "Gray");
		}
	
	} else {

		// For NPC characters, we show the traits
		DrawText(TextGet("Trait"), 1000, 125, "Black", "Gray");

		// After one week we show the traits, after two weeks we show the level
		if (CurrentTime >= NPCEventGet(C, "PrivateRoomEntry") * CheatFactor("AutoShowTraits", 0) + 604800000) {
			var pos = 0;
			for(var T = 0; T < C.Trait.length; T++)
				if ((C.Trait[T].Value != null) && (C.Trait[T].Value > 0)) {
					DrawText(TextGet("Trait" + C.Trait[T].Name) + " " + ((CurrentTime >= NPCEventGet(C, "PrivateRoomEntry") * CheatFactor("AutoShowTraits", 0) + 1209600000) ? C.Trait[T].Value.toString() : "??"), 1000, 200 + pos * 75, "Black", "Gray");
					pos++;
				}
		} else DrawText(TextGet("TraitUnknown"), 1000, 200, "Black", "Gray");

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