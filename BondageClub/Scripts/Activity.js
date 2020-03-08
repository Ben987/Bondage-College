"use strict";
var ActivityDictionary = null;

// Loads the activity dictionary that will be used throughout the game to output messages
function ActivityDictionaryLoad() {
	if (ActivityDictionary == null) {

		// Tries to read it from cache first
		var FullPath = "Screens/Character/Preference/ActivityDictionary.csv";
		if (CommonCSVCache[FullPath]) {
			ActivityDictionary = CommonCSVCache[FullPath];
			return;
		}

		// Opens the file, parse it and returns the result in an object
		CommonGet(FullPath, function () {
			if (this.status == 200) {
				CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
				ActivityDictionary = CommonCSVCache[FullPath];
			}
		});

		// If a translation file is available, we open the txt file and keep it in cache
		var TranslationPath = FullPath.replace(".csv", "_" + TranslationLanguage + ".txt");
		if (TranslationAvailable(TranslationPath))
			CommonGet(TranslationPath, function() {
				if (this.status == 200) TranslationCache[TranslationPath] = TranslationParseTXT(this.responseText);
			});

	}
}

// Searches in the dictionary for a specific keyword and returns the message linked to it
function ActivityDictionaryText(KeyWord) {
	for (var D = 0; D < ActivityDictionary.length; D++)
		if (ActivityDictionary[D][0] == KeyWord)
			return ActivityDictionary[D][1].trim();
	return "MISSING ACTIVITY DESCRIPTION FOR KEYWORD " + KeyWord;
}

// Builds an activity selection dialog
function ActivityDialogBuild(C) {

	// Clears the current activities to rebuild them
	DialogActivity = [];
	if ((C.FocusGroup != null) && (C.FocusGroup.Activity != null)) {

		// For each activities
		for (var A = 0; A < C.FocusGroup.Activity.length; A++) {

			// Make sure the activity is valid for that player asset family
			var Activity = AssetGetActivity(C.AssetFamily, C.FocusGroup.Activity[A]);
			if (Activity != null) {

				// If the player is targeting herself, we validate that this activity can be done on self
				var Allow = true;
				if ((C.ID == 0) && ((Activity.TargetSelf == null) || (Activity.TargetSelf.indexOf(C.FocusGroup.Name) < 0))) Allow = false;

				// Make sure all the prerequisites are met
				if (Allow && (Activity.Prerequisite != null))
					for (var P = 0; P < Activity.Prerequisite.length; P++) {
						if ((Activity.Prerequisite[P] == "UseMouth") && !Player.CanTalk()) Allow = false;
						if ((Activity.Prerequisite[P] == "UseHands") && !Player.CanInteract()) Allow = false;
						if ((Activity.Prerequisite[P] == "UseFeet") && !Player.CanWalk()) Allow = false;
						if ((Activity.Prerequisite[P] == "ZoneNaked") && ((C.FocusGroup.Name == "ItemButt") || (C.FocusGroup.Name == "ItemVulva")) && (InventoryPrerequisiteMessage(C, "AccessVulva") != "")) Allow = false;
						if ((Activity.Prerequisite[P] == "ZoneNaked") && (C.FocusGroup.Name == "ItemBreast") && (InventoryPrerequisiteMessage(C, "AccessBreast") != "")) Allow = false;
					}

				// Make sure the current player has permission to do this activity
				if (Allow && (Player.ArousalSettings != null) && (Player.ArousalSettings.Activity != null))
					for (var P = 0; P < Player.ArousalSettings.Activity.length; P++)
						if ((Player.ArousalSettings.Activity[P].Name == C.FocusGroup.Activity[A]) && (Player.ArousalSettings.Activity[P].Other != null) && (Player.ArousalSettings.Activity[P].Other == 0))
							Allow = false;

				// Make sure the target player gives permission for this activity
				if (Allow && (C.ArousalSettings != null) && (C.ArousalSettings.Activity != null))
					for (var P = 0; P < C.ArousalSettings.Activity.length; P++)
						if ((C.ArousalSettings.Activity[P].Name == C.FocusGroup.Activity[A]) && (C.ArousalSettings.Activity[P].Self != null) && (C.ArousalSettings.Activity[P].Self == 0))
							Allow = false;

				// Adds the activity to the dialog if it's allowed
				if (Allow) DialogActivity.push(Activity);

			}

		}

	}

}

// Calculates the effect of an activity (A) on target character (C) from source character (S) on zone (Z)
function ActivityEffect(S, C, A, Z) {

	// Converts from activity name to the activity object
	if (typeof A === "string") A = AssetGetActivity(C.AssetFamily, A);
	if ((A == null) || (typeof A === "string")) return;

	// Calculates the next progress factor
	var Factor = (PreferenceGetActivityFactor(C, A.Name, (C.ID == 0)) * 5) - 10; // Check how much the character likes the activity, from -10 to +10
	Factor = Factor + (PreferenceGetZoneFactor(C, Z) * 5) - 10; // The zone used also adds from -10 to +10
	Factor = Factor + Math.floor((Math.random() * 8)); // Random 0 to 7 bonus
	if ((C.ID != S.ID) && (((C.ID != 0) && C.IsLoverOfPlayer()) || ((C.ID == 0) && S.IsLoverOfPlayer()))) Factor = Factor + Math.floor((Math.random() * 8)); // Another random 0 to 7 bonus if the target is the player's lover
	ActivitySetArousalTimer(C, A, Z, Factor);

}

// Sets the character arousal level and validates the value
function ActivitySetArousal(C, Progress) {
	if ((C.ArousalSettings.Progress == null) || (typeof C.ArousalSettings.Progress !== "number") || isNaN(C.ArousalSettings.Progress)) C.ArousalSettings.Progress = 0;
	if ((Progress == null) || (Progress < 0)) Progress = 0;
	if (Progress > 100) Progress = 100;
	if (C.ArousalSettings.Progress != Progress) {
		C.ArousalSettings.Progress = Progress;
		C.ArousalSettings.ProgressTimer = 0;
		if ((C.ID == 0) && (CurrentScreen == "ChatRoom"))
			ChatRoomCharacterUpdate(Player);
	}
}

// The progress can be set on a timer to grow slowly, activities are capped at MaxProgress
function ActivitySetArousalTimer(C, Activity, Zone, Progress) {

	// If there's already a progress timer running, we add it's value but divide it by 2 to lessen the impact, the progress must be between -25 and 25
	if ((C.ArousalSettings.ProgressTimer == null) || (typeof C.ArousalSettings.ProgressTimer !== "number") || isNaN(C.ArousalSettings.ProgressTimer)) C.ArousalSettings.ProgressTimer = 0;
	Progress = Math.round((C.ArousalSettings.ProgressTimer / 2) + Progress);
	if (Progress < -25) Progress = -25;
	if (Progress > 25) Progress = 25;

	// Make sure we do not allow orgasms if the activity (MaxProgress) or the zone (AllowOrgasm) doesn't allow it
	var Max = ((Activity.MaxProgress == null) || (Activity.MaxProgress > 100)) ? 100 : Activity.MaxProgress;
	if ((Max > 95) && !PreferenceGetZoneOrgasm(C, Zone)) Max = 95;
	if ((Max > 67) && (Zone == "ActivityOnOther")) Max = 67;
	if ((Progress > 0) && (C.ArousalSettings.Progress + Progress > Max)) Progress = (Max - C.ArousalSettings.Progress >= 0) ? Max - C.ArousalSettings.Progress : 0;

	// If we must apply a progress timer change, we publish it
	if ((C.ArousalSettings.ProgressTimer == null) || (C.ArousalSettings.ProgressTimer != Progress)) {
		C.ArousalSettings.ProgressTimer = Progress;
		if ((C.ID == 0) && (CurrentScreen == "ChatRoom"))
			ChatRoomCharacterUpdate(Player);
	}

}

// Triggers an orgasm for the player or an NPC which lasts from 5 to 15 seconds
function ActivityOrgasm(C) {
	if ((C.ID == 0) || (C.AccountName.substring(0, 4) == "NPC_") || (C.AccountName.substring(0, 4) == "NPC-")) {

		// The orgasm can be outputted in the chatroom
		if ((C.ID == 0) && (CurrentScreen == "ChatRoom")) {
			var Dictionary = [];
			Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
			ServerSend("ChatRoomChat", {Content: "Orgasm" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: Dictionary});
		}

		// Starts the timer and exits from dialog if necessary
		C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;
		ActivitySetArousal(C, 23);
		if ((CurrentCharacter != null) && (CurrentCharacter.ID == C.ID)) DialogLeave();

		// If an NPC orgasmed, it will raise her love based on the horny trait
		if ((C.AccountName.substring(0, 4) == "NPC_") || (C.AccountName.substring(0, 4) == "NPC-"))
			NPCLoveChange(C, Math.floor((NPCTraitGet(C, "Horny") + 100) / 20) + 1);

	}
}

// The current arousal level can affect the facial expressions of a character
function ActivityExpression(C, Progress) {

	// Floors the progress to the nearest 10 to pick the expression
	Progress = Math.floor(Progress / 10) * 10;
	
	// The blushes goes to red progressively
	var Blush = "";
	if ((Progress == 10) || (Progress == 30) || (Progress == 50) || (Progress == 70)) Blush = "Low";
	if ((Progress == 60) || (Progress == 80) || (Progress == 90)) Blush = "Medium";
	if (Progress == 100) Blush = "High";

	// The eyebrows position changes
	var Eyebrows = "";
	if ((Progress == 20) || (Progress == 30)) Eyebrows = "Raised";
	if ((Progress == 50) || (Progress == 60)) Eyebrows = "Lowered";
	if ((Progress == 80) || (Progress == 90)) Eyebrows = "Soft";

	// Drool can activate at a few stages
	var Fluids = "";
	if ((Progress == 40) || (C.ArousalSettings.Progress == 70)) Fluids = "DroolLow";
	if (Progress == 100) Fluids = "DroolMedium";

	// Eyes can activate at a few stages
	var Eyes = "";
	if (Progress == 20) Eyes = "Dazed";
	if (Progress == 70) Eyes = "Horny";
	if (Progress == 90) Eyes = "Surprised";
	if (Progress == 100) Eyes = "Closed";

	// Find the expression in the character appearance and alters it
	for (var A = 0; A < C.Appearance.length; A++) {
		if (C.Appearance[A].Asset.Group.Name == "Blush") C.Appearance[A].Property = { Expression: Blush };
		if (C.Appearance[A].Asset.Group.Name == "Eyebrows") C.Appearance[A].Property = { Expression: Eyebrows };
		if (C.Appearance[A].Asset.Group.Name == "Fluids") C.Appearance[A].Property = { Expression: Fluids };
		if (C.Appearance[A].Asset.Group.Name == "Eyes") C.Appearance[A].Property = { Expression: Eyes };
	}

	// Refreshes the character
	CharacterRefresh(C);

}

// With time ticking, the arousal get increase or decrease
function ActivityTimerProgress(C, Progress) {

	// Changes the current arousal progress value
	C.ArousalSettings.Progress = C.ArousalSettings.Progress + Progress;
	if (C.ArousalSettings.Progress < 0) C.ArousalSettings.Progress = 0;
	if (C.ArousalSettings.Progress > 100) C.ArousalSettings.Progress = 100;

	// Out of orgasm mode, it can affect facial expressions at every 10 steps
	if ((C.ArousalSettings.OrgasmTimer == null) || (typeof C.ArousalSettings.OrgasmTimer !== "number") || isNaN(C.ArousalSettings.OrgasmTimer) || (C.ArousalSettings.OrgasmTimer < CurrentTime))
		if (((C.ArousalSettings.AffectExpression == null) || C.ArousalSettings.AffectExpression) && (C.ArousalSettings.Progress % 10 == 0))
			ActivityExpression(C, C.ArousalSettings.Progress);

	// Can trigger an orgasm
	if (C.ArousalSettings.Progress == 100) ActivityOrgasm(C);

}

// Launches a sexual activity (A) for character (C)
function ActivityRun(C, A) {

	// If the player does the activity on herself or an NPC, we calculate the result right away
	if ((C.ArousalSettings.Active == "Hybrid") || (C.ArousalSettings.Active == "Automatic"))
		if ((C.ID == 0) || (C.AccountName.substring(0, 4) == "NPC_") || (C.AccountName.substring(0, 4) == "NPC-"))
			ActivityEffect(Player, C, A, C.FocusGroup.Name);

	// If the player does the activity on someone else, we calculate the result right away
	if (((Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic")) && (C.ID != 0)) {
		var Factor = (PreferenceGetActivityFactor(Player, A.Name, false) * 5) - 10; // Check how much the player likes the activity, from -10 to +10
		Factor = Factor + Math.floor((Math.random() * 8)); // Random 0 to 7 bonus
		if (C.IsLoverOfPlayer()) Factor = Factor + Math.floor((Math.random() * 8)); // Another random 0 to 7 bonus if the target is the player's lover
		ActivitySetArousalTimer(Player, A, "ActivityOnOther", Factor); // For activities on other, it cannot go over 2/3
	}

	// The text result can be outputted in the chatroom or in the NPC dialog
	if (CurrentScreen == "ChatRoom") {

		// Publishes the activity to the chatroom
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		Dictionary.push({Tag: "ActivityGroup", Text: C.FocusGroup.Name});
		Dictionary.push({Tag: "ActivityName", Text: A.Name});
		ServerSend("ChatRoomChat", {Content: ((C.ID == 0) ? "ChatSelf-" : "ChatOther-") + C.FocusGroup.Name + "-" + A.Name, Type: "Activity", Dictionary: Dictionary});

		// Exits from dialog to see the result
		DialogLeave();

	}

}