"use strict";
var InformationSheetBackground = "Sheet";
var InformationSheetSelection = null;
var InformationSheetPreviousModule = "";
var InformationSheetPreviousScreen = "";
var InformationSheetSecondScreen = false;

/**
 * Returns the love sheet of an NPC
 * @param {number} Love - The current realtionship value
 * @returns {string} - The text describing the relationship to the NPC
 */
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

/**
 * Main function of the character info screen. It's called continuously, so be careful
 * to add time consuming functions or loops here
 * @returns {void} - Nothing
 */
function InformationSheetRun() {

	// Draw the character base values
	var C = InformationSheetSelection;
	var CurrentTitle = TitleGet(C);
	DrawCharacter(C, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawTextFit(TextGet("Name") + " " + C.Name, 550, 125, 450, "Black", "Gray");
	DrawTextFit(TextGet("Title") + " " + TextGet("Title" + CurrentTitle), 550, 200, 450, TitleIsForced(CurrentTitle) ? "Red" : TitleIsEarned(CurrentTitle) ? "#0000BF" : "Black", "Gray");
	DrawTextFit(TextGet("MemberNumber") + " " + ((C.MemberNumber == null) ? TextGet("NoMemberNumber") : C.MemberNumber.toString()), 550, 275, 450, "Black", "Gray");

	// Some info are not available for online players
	var OnlinePlayer = C.AccountName.indexOf("Online-") >= 0;
	if (!OnlinePlayer) {
		if (C.ID == 0) DrawTextFit(TextGet("MemberFor") + " " + (Math.floor((CurrentTime - C.Creation) / 86400000)).toString() + " " + TextGet("Days"), 550, 350, 450, "Black", "Gray");
		else DrawTextFit(TextGet("FriendsFor") + " " + (Math.floor((CurrentTime - NPCEventGet(C, "PrivateRoomEntry")) / 86400000)).toString() + " " + TextGet("Days"), 550, 350, 450, "Black", "Gray");
		if (C.ID == 0) DrawTextFit(TextGet("Money") + " " + C.Money.toString() + " $", 550, 425, 450, "Black", "Gray");
		else if (C.Love != null) DrawTextFit(InformationSheetGetLove(C.Love), 550, 425, 450, "Black", "Gray");
	} else {
		if (C.Creation != null) DrawTextFit(TextGet("MemberFor") + " " + (Math.floor((CurrentTime - C.Creation) / 86400000)).toString() + " " + TextGet("Days"), 550, 350, 450, "Black", "Gray");
	}

	// For the current player or an online player
	if ((C.ID == 0) || OnlinePlayer) {

		// Shows the difficulty level
		let Days = Math.floor((CurrentTime - (((C.Difficulty == null) || (C.Difficulty.LastChange == null) || (typeof C.Difficulty.LastChange !== "number")) ? C.Creation : C.Difficulty.LastChange)) / 86400000);
		DrawTextFit(TextGet("DifficultyLevel" + C.GetDifficulty()) + " " + TextGet("DifficultyTitle").replace("NumberOfDays", Days.toString()), 550, 500, 450, "Black", "Gray");

		// Shows the owner
		if ((C.Ownership != null) && (C.Ownership.Name != null) && (C.Ownership.MemberNumber != null) && (C.Ownership.Start != null) && (C.Ownership.Stage != null)) {
			DrawTextFit(TextGet("Owner") + " " + C.Ownership.Name + " (" + C.Ownership.MemberNumber + ")", 550, 575, 450, "Black", "Gray");
			DrawTextFit(TextGet((C.Ownership.Stage == 0) ? "TrialFor" : "CollaredFor") + " " + (Math.floor((CurrentTime - C.Ownership.Start) / 86400000)).toString() + " " + TextGet("Days"), 550, 635, 450, "Black", "Gray");
		}
		else { DrawTextFit(TextGet("Owner") + " " + (((C.Owner == null) || (C.Owner == "")) ? TextGet("OwnerNone") : C.Owner.replace("NPC-", "")), 550, 575, 450, "Black", "Gray"); }

		// Shows the member number and online permissions for other online players
		if (C.ID != 0) {
			DrawTextFit(TextGet("ItemPermission"), 550, 815, 450, "Black", "Gray");
			DrawTextFit(TextGet("PermissionLevel" + C.ItemPermission.toString()), 550, 875, 450, "Black", "Gray");
		}

	}

	// Draw the buttons on the right side
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (C.ID == 0) {
		if (!TitleIsForced(CurrentTitle)) DrawButton(1815, 190, 90, 90, "", "White", "Icons/Title.png");
		DrawButton(1815, 305, 90, 90, "", "White", "Icons/Preference.png");
		DrawButton(1815, 420, 90, 90, "", "White", "Icons/FriendList.png");
		DrawButton(1815, 535, 90, 90, "", "White", "Icons/Introduction.png");
		DrawButton(1815, 765, 90, 90, "", "White", "Icons/Next.png");
	} else if (OnlinePlayer) {
		DrawButton(1815, 190, 90, 90, "", "White", "Icons/Introduction.png");
		DrawButton(1815, 765, 90, 90, "", "White", "Icons/Next.png");
	}

	// Draw the second screen for reputation & skills
	MainCanvas.textAlign = "left";
	if (InformationSheetSecondScreen) return InformationSheetSecondScreenRun();

	// For player and online characters, we show the lover list (NPC or online)
	if ((C.ID == 0) || OnlinePlayer) {
		DrawText(TextGet("Relationships"), 1200, 125, "Black", "Gray");
		if (C.Lovership.length < 1) DrawText(TextGet("Lover") + " " + TextGet("LoverNone"), 1200, 200, "Black", "Gray");
		for (let L = 0; L < C.Lovership.length; L++) {
			if (C.Lovership[L].MemberNumber == null) DrawText(TextGet("Lover") + " " + C.Lovership[L].Name.replace("NPC-", ""), 1200, 200 + L * 150, "Black", "Gray");
			else {
				DrawText(TextGet("Lover") + " " + C.Lovership[L].Name + " (" + C.Lovership[L].MemberNumber + ")", 1200, 200 + L * 150, "Black", "Gray");
				DrawText(TextGet((C.Lovership[L].Stage == 0) ? "DatingFor" : (C.Lovership[L].Stage == 1) ? "EngagedFor" : "MarriedFor") + " " + (Math.floor((CurrentTime - C.Lovership[L].Start) / 86400000)).toString() + " " + TextGet("Days"), 1200, 260 + L * 150, "Black", "Gray");
			}
		}
	} else {

		// For NPC characters, shows the lover, owner & traits
		DrawText(TextGet("Lover") + " " + (((C.Lover == null) || (C.Lover == "")) ? TextGet("LoverNone") : C.Lover.replace("NPC-", "")), 550, 500, "Black", "Gray");
		if ((C.Lover != null) && (C.Lover != "") && (C.ID != 0) && (NPCEventGet(C, "Girlfriend") > 0)) DrawText(TextGet("LoverFor") + " " + (Math.floor((CurrentTime - NPCEventGet(C, "Girlfriend")) / 86400000)).toString() + " " + TextGet("Days"), 550, 575, "Black", "Gray");
		DrawText(TextGet("Owner") + " " + (((C.Owner == null) || (C.Owner == "")) ? TextGet("OwnerNone") : C.Owner.replace("NPC-", "")), 550, 650, "Black", "Gray");
		if ((C.Owner != null) && (C.Owner != "") && (C.ID != 0) && (NPCEventGet(C, "NPCCollaring") > 0)) DrawText(TextGet("CollaredFor") + " " + (Math.floor((CurrentTime - NPCEventGet(C, "NPCCollaring")) / 86400000)).toString() + " " + TextGet("Days"), 550, 725, "Black", "Gray");
		DrawText(TextGet("Trait"), 1000, 125, "Black", "Gray");

		// After one week we show the traits, after two weeks we show the level
		if (CurrentTime >= NPCEventGet(C, "PrivateRoomEntry") * CheatFactor("AutoShowTraits", 0) + 604800000) {
			let Pos = 0;
			for (let T = 0; T < C.Trait.length; T++)
				if ((C.Trait[T].Value != null) && (C.Trait[T].Value != 0)) {
					DrawText(TextGet("Trait" + ((C.Trait[T].Value > 0) ? C.Trait[T].Name : NPCTraitReverse(C.Trait[T].Name))) + " " + ((CurrentTime >= NPCEventGet(C, "PrivateRoomEntry") * CheatFactor("AutoShowTraits", 0) + 1209600000) ? Math.abs(C.Trait[T].Value).toString() : "??"), 1000, 200 + Pos * 75, "Black", "Gray");
					Pos++;
				}
		} else DrawText(TextGet("TraitUnknown"), 1000, 200, "Black", "Gray");

	}
	MainCanvas.textAlign = "center";

}

/**
 * Display the second part of the information sheet for reputation & skills
 * @returns {void} - Nothing
 */
function InformationSheetSecondScreenRun() {

	// For current player and online characters
	var C = InformationSheetSelection;
	var OnlinePlayer = C.AccountName.indexOf("Online-") >= 0;
	if ((C.ID == 0) || OnlinePlayer) {

		// Draw the reputation section
		DrawText(TextGet("Reputation"), 1000, 125, "Black", "Gray");
		var pos = 0;
		for (let R = 0; R < C.Reputation.length; R++)
			if (C.Reputation[R].Value != 0) {
				DrawText(TextGet("Reputation" + C.Reputation[R].Type + ((C.Reputation[R].Value > 0) ? "Positive" : "Negative")) + " " + Math.abs(C.Reputation[R].Value).toString(), 1000, 200 + pos * 75, "Black", "Gray");
				pos++;
			}
		if (pos == 0) DrawText(TextGet("ReputationNone"), 1000, 200, "Black", "Gray");

		// Draw the skill section
		DrawText(TextGet("Skill"), 1425, 125, "Black", "Gray");
		if (C.AccountName.indexOf("Online-") >= 0) {
			DrawText(TextGet("Unknown"), 1425, 200, "Black", "Gray");
		}
		else {
			for (let S = 0; S < C.Skill.length; S++)
				DrawText(TextGet("Skill" + C.Skill[S].Type) + " " + C.Skill[S].Level.toString() + " (" + Math.floor(C.Skill[S].Progress / 10) + "%)", 1425, 200 + S * 75, ((C.Skill[S].Ratio != null) && (C.Skill[S].Ratio != 1)) ? "Red" : "Black", "Gray");
			if (C.Skill.length == 0) DrawText(TextGet("SkillNone"), 1425, 200, "Black", "Gray");
		}

		// Draw the player skill modifier if there's one
		SkillGetLevel(C, "Evasion");
		if ((C.ID == 0) && (SkillModifier != 0)) {
			var PlusSign = (SkillModifier > 0) ? "+" : "";
			DrawText(TextGet("SkillModifier"), 1425, 650, "Black", "Gray");
			DrawText(TextGet("SkillBondage") + " " + PlusSign + SkillModifier, 1425, 725, "Black", "Gray");
			DrawText(TextGet("SkillEvasion") + " " + PlusSign + SkillModifier, 1425, 800, "Black", "Gray");
			DrawText(TextGet("SkillModifierDuration") + " " + (TimermsToTime(LogValue("ModifierDuration", "SkillModifier") - CurrentTime)), 1425, 875, "Black", "Gray");
		}

	}
	MainCanvas.textAlign = "center";

}

/**
 * Handles the click events on the screen
 * @returns {void} - Nothing
 */
function InformationSheetClick() {
	var C = InformationSheetSelection;
	if (MouseIn(1815, 75, 90, 90)) InformationSheetExit();
	if (C.ID == 0) {
		if (MouseIn(1815, 190, 90, 90) && !TitleIsForced(TitleGet(C))) CommonSetScreen("Character", "Title");
		if (MouseIn(1815, 305, 90, 90)) CommonSetScreen("Character", "Preference");
		if (MouseIn(1815, 420, 90, 90)) CommonSetScreen("Character", "FriendList");
		if (MouseIn(1815, 535, 90, 90)) CommonSetScreen("Character", "OnlineProfile");
		if (MouseIn(1815, 765, 90, 90)) InformationSheetSecondScreen = !InformationSheetSecondScreen;
	} else if (C.AccountName.indexOf("Online-") >= 0) {
		if (MouseIn(1815, 190, 90, 90)) CommonSetScreen("Character", "OnlineProfile");
		if (MouseIn(1815, 765, 90, 90)) InformationSheetSecondScreen = !InformationSheetSecondScreen;
	}
}

/**
 * Cleanup all elements, if the user exits the screen
 * @returns {void} - Nothing
 */
function InformationSheetExit() {
	InformationSheetSecondScreen = false;
	CommonSetScreen(InformationSheetPreviousModule, InformationSheetPreviousScreen);
}

/**
 * Loads the information sheet for a character
 * @param {Character} C - The character whose information sheet should be displayed
 * @returns {void} - Nothing
 */
function InformationSheetLoadCharacter(C) {
	InformationSheetSelection = C;
	InformationSheetPreviousModule = CurrentModule;
	InformationSheetPreviousScreen = CurrentScreen;
	CommonSetScreen("Character", "InformationSheet");
}
