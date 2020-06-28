"use strict";
var ActivityDictionary = null;
var ActivityOrgasmGameButtonX = 0;
var ActivityOrgasmGameButtonY = 0;
var ActivityOrgasmGameProgress = 0;
var ActivityOrgasmGameDifficulty = 0;
var ActivityOrgasmGameResistCount = 0;
var ActivityOrgasmGameTimer = 0;
var ActivityOrgasmResistLabel = "";

// Activities are only allowed in certain rooms
function ActivityAllowed() { return ((CurrentScreen == "ChatRoom") || ((CurrentScreen == "Private") && LogQuery("RentRoom", "PrivateRoom"))) }

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
			if (Activity != null && Activity.Name.indexOf("Item") < 0) {

				// If the player is targeting herself, we validate that this activity can be done on self
				var Allow = true;
				if ((C.ID == 0) && ((Activity.TargetSelf == null) || (Activity.TargetSelf.indexOf(C.FocusGroup.Name) < 0))) Allow = false;

				// Make sure all the prerequisites are met
				if (Allow && (Activity.Prerequisite != null))
					for (var P = 0; P < Activity.Prerequisite.length; P++) {
						if ((Activity.Prerequisite[P] == "UseMouth") && (Player.IsMouthBlocked() || !Player.CanTalk())) Allow = false;
						else if ((Activity.Prerequisite[P] == "UseTongue") && Player.IsMouthBlocked()) Allow = false;
						else if ((Activity.Prerequisite[P] == "UseHands") && !Player.CanInteract()) Allow = false;
						else if ((Activity.Prerequisite[P] == "UseFeet") && !Player.CanWalk()) Allow = false;
						else if ((Activity.Prerequisite[P] == "TargetCanUseTongue") && C.IsMouthBlocked()) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && (C.FocusGroup.Name == "ItemButt") && ((InventoryPrerequisiteMessage(C, "AccessButt") != "") || C.IsPlugged())) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && (C.FocusGroup.Name == "ItemVulva") && ((InventoryPrerequisiteMessage(C, "AccessVulva") != "") || C.IsVulvaChaste())) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && ((C.FocusGroup.Name == "ItemBreast") || (C.FocusGroup.Name == "ItemNipples")) && ((InventoryPrerequisiteMessage(C, "AccessBreast") != "") || C.IsBreastChaste())) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && (C.FocusGroup.Name == "ItemBoots") && (InventoryPrerequisiteMessage(C, "NakedFeet") != "")) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && (C.FocusGroup.Name == "ItemHands") && (InventoryPrerequisiteMessage(C, "NakedHands") != "")) Allow = false;
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

// Syncs the player arousal with everyone in chatroom
function ActivityChatRoomArousalSync(C) {
	if ((C.ID == 0) && (CurrentScreen == "ChatRoom"))
		ServerSend("ChatRoomCharacterArousalUpdate", { OrgasmTimer: C.ArousalSettings.OrgasmTimer, Progress: C.ArousalSettings.Progress, ProgressTimer: C.ArousalSettings.ProgressTimer });
}

// Sets the character arousal level and validates the value
function ActivitySetArousal(C, Progress) {
	if ((C.ArousalSettings.Progress == null) || (typeof C.ArousalSettings.Progress !== "number") || isNaN(C.ArousalSettings.Progress)) C.ArousalSettings.Progress = 0;
	if ((Progress == null) || (Progress < 0)) Progress = 0;
	if (Progress > 100) Progress = 100;
	if (Progress == 0) C.ArousalSettings.OrgasmTimer = 0;
	if (C.ArousalSettings.Progress != Progress) {
		C.ArousalSettings.Progress = Progress;
		C.ArousalSettings.ProgressTimer = 0;
		ActivityChatRoomArousalSync(C);
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
		ActivityChatRoomArousalSync(C);
	}

}

// Draw the progress bar at X, Y for every orgasm timer
function ActivityOrgasmProgressBar(X, Y) {
	var Pos = 0;
	if ((ActivityOrgasmGameTimer != null) && (ActivityOrgasmGameTimer > 0) && (CurrentTime < Player.ArousalSettings.OrgasmTimer))
		Pos = ((Player.ArousalSettings.OrgasmTimer - CurrentTime) / ActivityOrgasmGameTimer) * 100;
	if (Pos < 0) Pos = 0;
	if (Pos > 100) Pos = 100;
	DrawProgressBar(X, Y, 900, 25, Pos);
}

// Each time the player tries to resist, it slowly raises her willpower
function ActivityOrgasmWillpowerProgress(C) {
	if ((C.ID == 0) && (ActivityOrgasmGameProgress > 0)) {
		SkillProgress("Willpower", ActivityOrgasmGameProgress);
		ActivityOrgasmGameProgress = 0;
	}
}

// The orgasm lasts between 5 and 15 seconds and can be outputted in the chatroom
function ActivityOrgasmStart(C) {
	if ((C.ID == 0) || (C.AccountName.substring(0, 4) == "NPC_") || (C.AccountName.substring(0, 4) == "NPC-")) {
		if (C.ID == 0) ActivityOrgasmGameResistCount = 0;
		ActivityOrgasmWillpowerProgress(C);
		C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;
		C.ArousalSettings.OrgasmStage = 2;
		ActivityOrgasmGameTimer = C.ArousalSettings.OrgasmTimer - CurrentTime;
		if ((C.ID == 0) && (CurrentScreen == "ChatRoom")) {
			var Dictionary = [];
			Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
			ServerSend("ChatRoomChat", {Content: "Orgasm" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: Dictionary});
			ActivityChatRoomArousalSync(C);
		}
	}
}

// If we need to stop an orgasm
function ActivityOrgasmStop(C, Progress) {
	if ((C.ID == 0) || (C.AccountName.substring(0, 4) == "NPC_") || (C.AccountName.substring(0, 4) == "NPC-")) {
		ActivityOrgasmWillpowerProgress(C);
		C.ArousalSettings.OrgasmTimer = 0;
		C.ArousalSettings.OrgasmStage = 0;
		ActivitySetArousal(C, Progress);
		ActivityTimerProgress(C, 0);
		ActivityChatRoomArousalSync(C);
	}
}

// Generates an orgasm button and progresses in the mini-game
function ActivityOrgasmGameGenerate(Progress) {

	// If we must reset the mini-game
	if (Progress == 0) {
		Player.ArousalSettings.OrgasmStage = 1;
		Player.ArousalSettings.OrgasmTimer = CurrentTime + 5000 + (SkillGetLevel(Player, "Willpower") * 1000);
		ActivityOrgasmGameTimer = Player.ArousalSettings.OrgasmTimer - CurrentTime;
		ActivityOrgasmGameDifficulty = (6 + (ActivityOrgasmGameResistCount * 2)) * (CommonIsMobile ? 1.5 : 1);
	}

	// Runs the game or finish it if the threshold is reached, it can trigger a chatroom message for everyone to see
	if (Progress >= ActivityOrgasmGameDifficulty) {
		if (CurrentScreen == "ChatRoom") {
			var Dictionary = [];
			Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
			ServerSend("ChatRoomChat", {Content: "OrgasmResist" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: Dictionary});
		}
		ActivityOrgasmGameResistCount++;
		ActivityOrgasmStop(Player, 70);
	} else {
		ActivityOrgasmResistLabel = TextGet("OrgasmResist") + " (" + (ActivityOrgasmGameDifficulty - Progress).toString() + ")";
		ActivityOrgasmGameProgress = Progress;
		ActivityOrgasmGameButtonX = 50 + Math.floor(Math.random() * 650);
		ActivityOrgasmGameButtonY = 50 + Math.floor(Math.random() * 836);
	}

}

// Triggers an orgasm for the player or an NPC which lasts from 5 to 15 seconds
function ActivityOrgasmPrepare(C) {
	if ((C.ID == 0) || (C.AccountName.substring(0, 4) == "NPC_") || (C.AccountName.substring(0, 4) == "NPC-")) {

		// Starts the timer and exits from dialog if necessary
		C.ArousalSettings.OrgasmTimer = (C.ID == 0) ? CurrentTime + 5000 : CurrentTime + (Math.random() * 10000) + 5000;
		C.ArousalSettings.OrgasmStage = (C.ID == 0) ? 0 : 2;
		if (C.ID == 0) ActivityOrgasmGameTimer = C.ArousalSettings.OrgasmTimer - CurrentTime;
		if ((CurrentCharacter != null) && ((C.ID == 0) || (CurrentCharacter.ID == C.ID))) DialogLeave();
		ActivityChatRoomArousalSync(C);

		// If an NPC orgasmed, it will raise her love based on the horny trait
		if ((C.AccountName.substring(0, 4) == "NPC_") || (C.AccountName.substring(0, 4) == "NPC-"))
			if ((C.Love == null) || (C.Love < 60) || (C.IsOwner()) || (C.IsOwnedByPlayer()) || C.IsLoverPrivate())
				NPCLoveChange(C, Math.floor((NPCTraitGet(C, "Horny") + 100) / 20) + 1);

	}
}

// The current arousal level can affect the facial expressions of a character
function ActivityExpression(C, Progress) {

	// Floors the progress to the nearest 10 to pick the expression
	Progress = Math.floor(Progress / 10) * 10;
	
	// The blushes goes to red progressively
	var Blush = null;
	if ((Progress == 10) || (Progress == 30) || (Progress == 50) || (Progress == 70)) Blush = "Low";
	if ((Progress == 60) || (Progress == 80) || (Progress == 90)) Blush = "Medium";
	if (Progress == 100) Blush = "High";

	// The eyebrows position changes
	var Eyebrows = null;
	if ((Progress == 20) || (Progress == 30)) Eyebrows = "Raised";
	if ((Progress == 50) || (Progress == 60)) Eyebrows = "Lowered";
	if ((Progress == 80) || (Progress == 90)) Eyebrows = "Soft";

	// Drool can activate at a few stages
	var Fluids = null;
	if ((Progress == 40) || (C.ArousalSettings.Progress == 70)) Fluids = "DroolLow";
	if (Progress == 100) Fluids = "DroolMedium";

	// Eyes can activate at a few stages
	var Eyes = null;
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
	CharacterRefresh(C, false);

}

// With time ticking, the arousal get increase or decrease
function ActivityTimerProgress(C, Progress) {

	// Changes the current arousal progress value
	C.ArousalSettings.Progress = C.ArousalSettings.Progress + Progress;
	if (C.ArousalSettings.Progress < 0) C.ArousalSettings.Progress = 0;
	if (C.ArousalSettings.Progress > 100) C.ArousalSettings.Progress = 100;

	// Out of orgasm mode, it can affect facial expressions at every 10 steps
	if ((C.ArousalSettings.OrgasmTimer == null) || (typeof C.ArousalSettings.OrgasmTimer !== "number") || isNaN(C.ArousalSettings.OrgasmTimer) || (C.ArousalSettings.OrgasmTimer < CurrentTime))
		if (((C.ArousalSettings.AffectExpression == null) || C.ArousalSettings.AffectExpression) && ((C.ArousalSettings.Progress + ((Progress < 0) ? 1 : 0)) % 10 == 0))
			ActivityExpression(C, C.ArousalSettings.Progress);

	// Can trigger an orgasm
	if (C.ArousalSettings.Progress == 100) ActivityOrgasmPrepare(C);

}

// If the player does the activity on someone else, we calculate the progress for the player right away
function ActivityRunSelf(Source, Target, Activity) {
	if (((Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic")) && (Source.ID == 0) && (Target.ID != 0)) {
		var Factor = (PreferenceGetActivityFactor(Player, Activity.Name, false) * 5) - 10; // Check how much the player likes the activity, from -10 to +10
		Factor = Factor + Math.floor((Math.random() * 8)); // Random 0 to 7 bonus
		if (Target.IsLoverOfPlayer()) Factor = Factor + Math.floor((Math.random() * 8)); // Another random 0 to 7 bonus if the target is the player's lover
		ActivitySetArousalTimer(Player, Activity, "ActivityOnOther", Factor); // For activities on other, it cannot go over 2/3
	}
}

// Launches a sexual activity for a character
function ActivityRun(C, Activity) {

	// If the player does the activity on herself or an NPC, we calculate the result right away
	if ((C.ArousalSettings.Active == "Hybrid") || (C.ArousalSettings.Active == "Automatic"))
		if ((C.ID == 0) || (C.AccountName.substring(0, 4) == "NPC_") || (C.AccountName.substring(0, 4) == "NPC-"))
			ActivityEffect(Player, C, Activity, C.FocusGroup.Name);

	// If the player does the activity on someone else, we calculate the progress for the player right away
	ActivityRunSelf(Player, C, Activity);

	// The text result can be outputted in the chatroom or in the NPC dialog
	if (CurrentScreen == "ChatRoom") {

		// Publishes the activity to the chatroom
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		Dictionary.push({Tag: "ActivityGroup", Text: C.FocusGroup.Name});
		Dictionary.push({Tag: "ActivityName", Text: Activity.Name});
		ServerSend("ChatRoomChat", {Content: ((C.ID == 0) ? "ChatSelf-" : "ChatOther-") + C.FocusGroup.Name + "-" + Activity.Name, Type: "Activity", Dictionary: Dictionary});

		// Exits from dialog to see the result
		DialogLeave();

	}

}

// Some items such as vibrating wands and spanking toys can trigger arousal for both the source and target character
function ActivityArousalItem(Source, Target, Asset) {
	var AssetActivity = Asset.DynamicActivity(Source);
	if (AssetActivity != null) {
		var Activity = AssetGetActivity(Target.AssetFamily, AssetActivity);
		if ((Source.ID == 0) && (Target.ID != 0)) ActivityRunSelf(Source, Target, Activity);
		if (((Target.ArousalSettings != null) && ((Target.ArousalSettings.Active == "Hybrid") || (Target.ArousalSettings.Active == "Automatic"))) && ((Target.ID == 0) || (Target.AccountName.substring(0, 4) == "NPC_") || (Target.AccountName.substring(0, 4) == "NPC-")))
			ActivityEffect(Source, Target, AssetActivity, Asset.Group.Name);
	}
}