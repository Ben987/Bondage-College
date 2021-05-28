"use strict";
var ActivityDictionary = null;
var ActivityOrgasmGameButtonX = 0;
var ActivityOrgasmGameButtonY = 0;
var ActivityOrgasmGameProgress = 0;
var ActivityOrgasmGameDifficulty = 0;
var ActivityOrgasmGameResistCount = 0;
var ActivityOrgasmGameTimer = 0;
var ActivityOrgasmResistLabel = "";

/**
 * Checks if the current room allows for activities. (They can only be done in certain rooms)
 * @returns {boolean} - Whether or not activities can be done
 */
function ActivityAllowed() {
	return (CurrentScreen == "ChatRoom" && !(ChatRoomData && ChatRoomData.BlockCategory && ChatRoomData.BlockCategory.includes("Arousal")))
		|| ((CurrentScreen == "Private") && LogQuery("RentRoom", "PrivateRoom")); }

/**
 * Loads the activity dictionary that will be used throughout the game to output messages. Loads from cache first if possible.
 * @return {void} - Nothing
 */
function ActivityDictionaryLoad() {

	// Tries to read it from cache first
	var FullPath = "Screens/Character/Preference/ActivityDictionary.csv";
	var TranslationPath = FullPath.replace(".csv", "_" + TranslationLanguage + ".txt");

	if (CommonCSVCache[FullPath]) {
		ActivityDictionary = JSON.parse(JSON.stringify(CommonCSVCache[FullPath]));
	} else {
		// Opens the file, parse it and returns the result in an object
		CommonGet(FullPath, function () {
			if (this.status == 200) {
				CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
				ActivityDictionary = JSON.parse(JSON.stringify(CommonCSVCache[FullPath]));
			}
		});
	}

	// If a translation file is available, we open the txt file and keep it in cache
	if (TranslationAvailable(TranslationPath))
		CommonGet(TranslationPath, function () {
			if (this.status == 200) {
				TranslationCache[TranslationPath] = TranslationParseTXT(this.responseText);
				ActivityTranslate(TranslationPath);
			}
		});

	ActivityTranslate(TranslationPath);
}

/**
 * Translates the activity dictionary.
 * @param {string} CachePath - Path to the language cache.
 */
function ActivityTranslate(CachePath) {
	if (!Array.isArray(TranslationCache[CachePath])) return;

	for (let T = 0; T < ActivityDictionary.length; T++) {
		if (ActivityDictionary[T][1]) {
			let indexText = TranslationCache[CachePath].indexOf(ActivityDictionary[T][1].trim());
			if (indexText >= 0) {
				ActivityDictionary[T][1] = TranslationCache[CachePath][indexText + 1];
			}
		}
	}
}

/**
 * Searches in the dictionary for a specific keyword's text
 * @param {string} KeyWord - Tag of the activity description to search for
 * @returns {string} - Description associated to the given keyword
 */
function ActivityDictionaryText(KeyWord) {
	for (let D = 0; D < ActivityDictionary.length; D++)
		if (ActivityDictionary[D][0] == KeyWord)
			return ActivityDictionary[D][1].trim();
	return "MISSING ACTIVITY DESCRIPTION FOR KEYWORD " + KeyWord;
}

/**
 * Builds the possible dialog activity options based on the character settings
 * @param {Character} C - The character for which to build the activity dialog options
 * @return {void} - Nothing
 */
function ActivityDialogBuild(C) {

	// Clears the current activities to rebuild them
	DialogActivity = [];
	if ((C.FocusGroup != null) && (C.FocusGroup.Activity != null)) {

		// For each activities
		for (let A = 0; A < C.FocusGroup.Activity.length; A++) {

			// Make sure the activity is valid for that player asset family
			var Activity = AssetGetActivity(C.AssetFamily, C.FocusGroup.Activity[A]);
			if (Activity != null && Activity.Name.indexOf("Item") < 0) {

				// If the player is targeting herself, we validate that this activity can be done on self
				var Allow = true;
				if ((C.ID == 0) && ((Activity.TargetSelf == null) || (Activity.TargetSelf.indexOf(C.FocusGroup.Name) < 0))) Allow = false;

				// Make sure all the prerequisites are met
				if (Allow && (Activity.Prerequisite != null))
					for (let P = 0; P < Activity.Prerequisite.length; P++) {
						if ((Activity.Prerequisite[P] == "UseMouth") && (Player.IsMouthBlocked() || !Player.CanTalk())) Allow = false;
						else if ((Activity.Prerequisite[P] == "UseTongue") && Player.IsMouthBlocked()) Allow = false;
						else if ((Activity.Prerequisite[P] == "TargetMouthBlocked") && !C.IsMouthBlocked()) Allow = false;
						else if ((Activity.Prerequisite[P] == "IsGagged") && Player.CanTalk()) Allow = false;
						else if ((Activity.Prerequisite[P] == "SelfOnly") && C.ID != 0) Allow = false;
						else if ((Activity.Prerequisite[P] == "TargetKneeling") && !C.IsKneeling()) Allow = false;
						else if ((Activity.Prerequisite[P] == "UseHands") && !Player.CanInteract()) Allow = false;
						else if ((Activity.Prerequisite[P] == "UseArms") && (!Player.CanInteract() && (InventoryGet(Player, "ItemArms") || InventoryGroupIsBlocked(Player, "ItemArms")))) Allow = false;
						else if ((Activity.Prerequisite[P] == "UseFeet") && !Player.CanWalk()) Allow = false;
						else if ((Activity.Prerequisite[P] == "CantUseArms") && !(!Player.CanInteract() && (InventoryGet(Player, "ItemArms") || InventoryGroupIsBlocked(Player, "ItemArms")))) Allow = false;
						else if ((Activity.Prerequisite[P] == "CantUseFeet") && Player.CanWalk()) Allow = false;
						else if ((Activity.Prerequisite[P] == "TargetCanUseTongue") && C.IsMouthBlocked()) Allow = false;
						else if ((Activity.Prerequisite[P] == "TargetMouthOpen") && (C.FocusGroup.Name == "ItemMouth") && (InventoryGet(C, "ItemMouth") && !C.IsMouthOpen())) Allow = false;
						else if ((Activity.Prerequisite[P] == "VulvaEmpty") && (C.FocusGroup.Name == "ItemVulva") && C.IsVulvaFull()) Allow = false;
						else if ((Activity.Prerequisite[P] == "MoveHead") && (C.FocusGroup.Name == "ItemHead") && C.Effect != null && C.Effect.includes("FixedHead")) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneAccessible") && InventoryGroupIsBlocked(C, C.FocusGroup.Name, true)) Allow = false;
						else if ((Activity.Prerequisite[P] == "WearingPenetrationItem") && (!CharacterHasItemForActivity(Player, "Penetrate") || Player.IsEnclose())) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && (C.FocusGroup.Name == "ItemButt") && ((InventoryPrerequisiteMessage(C, "AccessButt") != "") || C.IsPlugged())) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && (C.FocusGroup.Name == "ItemVulva") && ((InventoryPrerequisiteMessage(C, "AccessVulva") != "") || C.IsVulvaChaste())) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && ((C.FocusGroup.Name == "ItemBreast") || (C.FocusGroup.Name == "ItemNipples")) && ((InventoryPrerequisiteMessage(C, "AccessBreast") != "") || C.IsBreastChaste())) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && (C.FocusGroup.Name == "ItemBoots") && (InventoryPrerequisiteMessage(C, "NakedFeet") != "")) Allow = false;
						else if ((Activity.Prerequisite[P] == "ZoneNaked") && (C.FocusGroup.Name == "ItemHands") && (InventoryPrerequisiteMessage(C, "NakedHands") != "")) Allow = false;
					}

				// Make sure the current player has permission to do this activity
				if (Allow && (Player.ArousalSettings != null) && (Player.ArousalSettings.Activity != null))
					for (let P = 0; P < Player.ArousalSettings.Activity.length; P++)
						if ((Player.ArousalSettings.Activity[P].Name == C.FocusGroup.Activity[A]) && (Player.ArousalSettings.Activity[P].Other != null) && (Player.ArousalSettings.Activity[P].Other == 0))
							Allow = false;

				// Make sure the target player gives permission for this activity
				if (Allow && (C.ArousalSettings != null) && (C.ArousalSettings.Activity != null))
					for (let P = 0; P < C.ArousalSettings.Activity.length; P++)
						if ((C.ArousalSettings.Activity[P].Name == C.FocusGroup.Activity[A]) && (C.ArousalSettings.Activity[P].Self != null) && (C.ArousalSettings.Activity[P].Self == 0))
							Allow = false;

				// Adds the activity to the dialog if it's allowed
				if (Allow) DialogActivity.push(Activity);

			}

		}

	}

}

/**
 * Calculates the effect of an activity performed on a zone
 * @param {Character} S - The character performing the activity
 * @param {Character} C - The character on which the activity is performed
 * @param {string|Activity} A - The activity performed
 * @param {string} Z - The group/zone name where the activity was performed
 * @param {number} [Count=1] - If the activity is done repeatedly, this defines the number of times, the activity is done.
 * If you don't want an activity to modify arousal, set this parameter to '0'
 * @return {void} - Nothing
 */
function ActivityEffect(S, C, A, Z, Count) {

	// Converts from activity name to the activity object
	if (typeof A === "string") A = AssetGetActivity(C.AssetFamily, A);
	if ((A == null) || (typeof A === "string")) return;
	if ((Count == null) || (Count == undefined) || (Count == 0)) Count = 1;

	// Calculates the next progress factor
	var Factor = (PreferenceGetActivityFactor(C, A.Name, (C.ID == 0)) * 5) - 10; // Check how much the character likes the activity, from -10 to +10
	Factor = Factor + (PreferenceGetZoneFactor(C, Z) * 5) - 10; // The zone used also adds from -10 to +10
	Factor = Factor + Math.floor((Math.random() * 8)); // Random 0 to 7 bonus
	if ((C.ID != S.ID) && (((C.ID != 0) && C.IsLoverOfPlayer()) || ((C.ID == 0) && S.IsLoverOfPlayer()))) Factor = Factor + Math.floor((Math.random() * 8)); // Another random 0 to 7 bonus if the target is the player's lover
	Factor = Factor + ActivityFetishFactor(C) * 2; // Adds a fetish factor based on the character preferences
	Factor = Factor + Math.round(Factor * (Count - 1) / 3); // if the action is done repeatedly, we apply a multiplication factor based on the count
	ActivitySetArousalTimer(C, A, Z, Factor);

}

/**
 * Used for arousal events that are not activities, such as stimulation events
 * @param {Character} S - The character performing the activity
 * @param {Character} C - The character on which the activity is performed
 * @param {number} Amount - The base amount of arousal to add
 * @param {string} Z - The group/zone name where the activity was performed
 * @param {number} [Count=1] - If the activity is done repeatedly, this defines the number of times, the activity is done.
 * If you don't want an activity to modify arousal, set this parameter to '0'
 * @return {void} - Nothing
 */
function ActivityEffectFlat(S, C, Amount, Z, Count) {

	// Converts from activity name to the activity object
	if ((Amount == null) || (typeof Amount != "number")) return;
	if ((Count == null) || (Count == undefined) || (Count == 0)) Count = 1;

	// Calculates the next progress factor
	var Factor = Amount; // Check how much the character likes the activity, from -10 to +10
	Factor = Factor + (PreferenceGetZoneFactor(C, Z) * 5) - 10; // The zone used also adds from -10 to +10
	Factor = Factor + ActivityFetishFactor(C) * 2; // Adds a fetish factor based on the character preferences
	Factor = Factor + Math.round(Factor * (Count - 1) / 3); // if the action is done repeatedly, we apply a multiplication factor based on the count
	ActivitySetArousalTimer(C, null, Z, Factor);

}

/**
 * Syncs the player arousal with everyone in chatroom
 * @param {Character} C - The character for which to sync the arousal data
 * @return {void} - Nothing
 */
function ActivityChatRoomArousalSync(C) {
	if ((C.ID == 0) && (CurrentScreen == "ChatRoom"))
		ServerSend("ChatRoomCharacterArousalUpdate", { OrgasmTimer: C.ArousalSettings.OrgasmTimer, Progress: C.ArousalSettings.Progress, ProgressTimer: C.ArousalSettings.ProgressTimer, OrgasmCount: C.ArousalSettings.OrgasmCount });
}

/**
 * Sets the character arousal level and validates the value
 * @param {Character} C - The character for which to set the arousal progress of
 * @param {number} Progress - Progress to set for the character (Ranges from 0 to 100)
 * @return {void} - Nothing
 */
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

/**
 * Sets an activity progress on a timer, activities are capped at MaxProgress
 * @param {Character} C - The character for which to set the timer for
 * @param {object} Activity - The activity for which the timer is for
 * @param {string} Zone - The target zone of the activity
 * @param {number} Progress - Progress to set
 * @return {void} - Nothing
 */
function ActivitySetArousalTimer(C, Activity, Zone, Progress) {

	// If there's already a progress timer running, we add it's value but divide it by 2 to lessen the impact, the progress must be between -25 and 25
	if ((C.ArousalSettings.ProgressTimer == null) || (typeof C.ArousalSettings.ProgressTimer !== "number") || isNaN(C.ArousalSettings.ProgressTimer)) C.ArousalSettings.ProgressTimer = 0;
	Progress = Math.round((C.ArousalSettings.ProgressTimer / 2) + Progress);
	if (Progress < -25) Progress = -25;
	if (Progress > 25) Progress = 25;

	// Make sure we do not allow orgasms if the activity (MaxProgress) or the zone (AllowOrgasm) doesn't allow it
	var Max = ((Activity == null || Activity.MaxProgress == null) || (Activity.MaxProgress > 100)) ? 100 : Activity.MaxProgress;
	if ((Max > 95) && !PreferenceGetZoneOrgasm(C, Zone)) Max = 95;
	if ((Max > 67) && (Zone == "ActivityOnOther")) Max = 67;
	if ((Progress > 0) && (C.ArousalSettings.Progress + Progress > Max)) Progress = (Max - C.ArousalSettings.Progress >= 0) ? Max - C.ArousalSettings.Progress : 0;

	// If we must apply a progress timer change, we publish it
	if ((C.ArousalSettings.ProgressTimer == null) || (C.ArousalSettings.ProgressTimer != Progress)) {
		C.ArousalSettings.ProgressTimer = Progress;
		ActivityChatRoomArousalSync(C);
	}

}


/**
 * Draws the arousal progress bar at the given coordinates for every orgasm timer.
 * @param {number} X - Position on the X axis
 * @param {number} Y - Position on the Y axis
 * @return {void} - Nothing
 */
function ActivityOrgasmProgressBar(X, Y) {
	var Pos = 0;
	if ((ActivityOrgasmGameTimer != null) && (ActivityOrgasmGameTimer > 0) && (CurrentTime < Player.ArousalSettings.OrgasmTimer))
		Pos = ((Player.ArousalSettings.OrgasmTimer - CurrentTime) / ActivityOrgasmGameTimer) * 100;
	if (Pos < 0) Pos = 0;
	if (Pos > 100) Pos = 100;
	DrawProgressBar(X, Y, 900, 25, Pos);
}

/**
 * Increases the player's willpower when resisting an orgasm.
 * @param {Character} C - The character currently resisting
 * @return {void} - Nothing
 */
function ActivityOrgasmWillpowerProgress(C) {
	if ((C.ID == 0) && (ActivityOrgasmGameProgress > 0)) {
		SkillProgress("Willpower", ActivityOrgasmGameProgress);
		ActivityOrgasmGameProgress = 0;
	}
}

/**
 * Starts an orgasm for a given character, lasts between 5 to 15 seconds and can be displayed in a chatroom.
 * @param {Character} C - Character for which an orgasm is starting
 * @returns {void} - Nothing
 */
function ActivityOrgasmStart(C) {
	if ((C.ID == 0) || C.IsNpc()) {
		if (C.ID == 0) ActivityOrgasmGameResistCount = 0;
		ActivityOrgasmWillpowerProgress(C);
		C.ArousalSettings.OrgasmTimer = CurrentTime + (Math.random() * 10000) + 5000;
		C.ArousalSettings.OrgasmStage = 2;
		C.ArousalSettings.OrgasmCount = (C.ArousalSettings.OrgasmCount == null) ? 1 : C.ArousalSettings.OrgasmCount + 1;
		ActivityOrgasmGameTimer = C.ArousalSettings.OrgasmTimer - CurrentTime;
		if ((C.ID == 0) && (CurrentScreen == "ChatRoom")) {
			var Dictionary = [];
			Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
			ServerSend("ChatRoomChat", { Content: "Orgasm" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: Dictionary });
			ActivityChatRoomArousalSync(C);
		}
	}
}

/**
 * Triggered when an orgasm needs to be stopped
 * @param {Character} C - Character for which to stop the orgasm
 * @param {number} Progress - Arousal level to set the character at once the orgasm ends
 * @returns {void} - Nothing
 */
function ActivityOrgasmStop(C, Progress) {
	if ((C.ID == 0) || C.IsNpc()) {
		ActivityOrgasmWillpowerProgress(C);
		C.ArousalSettings.OrgasmTimer = 0;
		C.ArousalSettings.OrgasmStage = 0;
		ActivitySetArousal(C, Progress);
		ActivityTimerProgress(C, 0);
		ActivityChatRoomArousalSync(C);
	}
}

/**
 * Generates an orgasm button and progresses in the orgasm mini-game. Handles the resets and success/failures
 * @param {number} Progress - Progress of the currently running mini-game
 * @returns {void} - Nothing
 */
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
			Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
			ServerSend("ChatRoomChat", { Content: "OrgasmResist" + (Math.floor(Math.random() * 10)).toString(), Type: "Activity", Dictionary: Dictionary });
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

/**
 * Triggers an orgasm for the player or an NPC which lasts from 5 to 15 seconds
 * @param {Character} C - Character for which an orgasm was triggered
 * @returns {void} - Nothing
 */
function ActivityOrgasmPrepare(C) {
	if (C.Effect.includes("DenialMode")) {
		C.ArousalSettings.Progress = 99;
		return;
	}

	if (C.IsEdged()) {
		C.ArousalSettings.Progress = 95;
		return;
	}

	if ((C.ID == 0) || C.IsNpc()) {

		// Starts the timer and exits from dialog if necessary
		C.ArousalSettings.OrgasmTimer = (C.ID == 0) ? CurrentTime + 5000 : CurrentTime + (Math.random() * 10000) + 5000;
		C.ArousalSettings.OrgasmStage = (C.ID == 0) ? 0 : 2;
		if (C.ID == 0) ActivityOrgasmGameTimer = C.ArousalSettings.OrgasmTimer - CurrentTime;
		if ((CurrentCharacter != null) && ((C.ID == 0) || (CurrentCharacter.ID == C.ID))) DialogLeave();
		ActivityChatRoomArousalSync(C);

		// If an NPC orgasmed, it will raise her love based on the horny trait
		if (C.IsNpc())
			if ((C.Love == null) || (C.Love < 60) || (C.IsOwner()) || (C.IsOwnedByPlayer()) || C.IsLoverPrivate())
				NPCLoveChange(C, Math.floor((NPCTraitGet(C, "Horny") + 100) / 20) + 1);

	}
}

/**
 * Sets a character's facial expressions based on their arousal level if their settings allow it.
 * @param {Character} C - Character for which to set the facial expressions
 * @param {number} Progress - Current arousal progress
 * @returns {void} - Nothing
 */
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
	for (let A = 0; A < C.Appearance.length; A++) {
		if (C.Appearance[A].Asset.Group.Name == "Blush") C.Appearance[A].Property = { Expression: Blush };
		if (C.Appearance[A].Asset.Group.Name == "Eyebrows") C.Appearance[A].Property = { Expression: Eyebrows };
		if (C.Appearance[A].Asset.Group.Name == "Fluids") C.Appearance[A].Property = { Expression: Fluids };
		if (C.Appearance[A].Asset.Group.Name == "Eyes") C.Appearance[A].Property = { Expression: Eyes };
		if (C.Appearance[A].Asset.Group.Name == "Eyes2") C.Appearance[A].Property = { Expression: Eyes };
	}

	// Refreshes the character
	CharacterRefresh(C, false);

}

/**
 * With time, we increase or decrease the arousal. Validates the result to keep it within 0 to 100 and triggers an orgasm when it reaches 100
 * @param {Character} C - Character for which the timer is progressing
 * @param {number} Progress - Progress made (from -100 to 100)
 * @returns {void} - Nothing
 */
function ActivityTimerProgress(C, Progress) {

	// Changes the current arousal progress value
	C.ArousalSettings.Progress = C.ArousalSettings.Progress + Progress;
	// Decrease the vibratorlevel to 0 if not being aroused, while also updating the change time to reset the vibrator animation
	if (Progress < 0) {
		if (C.ArousalSettings.VibratorLevel != 0) {
			C.ArousalSettings.VibratorLevel = 0;
			C.ArousalSettings.ChangeTime = CommonTime();
		}
	}

	if (C.ArousalSettings.Progress < 0) C.ArousalSettings.Progress = 0;
	if (C.ArousalSettings.Progress > 100) C.ArousalSettings.Progress = 100;

	// Update the recent change time, so that on other player's screens the character's arousal meter will vibrate again when vibes start
	if (C.ArousalSettings.Progress == 0) {
		C.ArousalSettings.ChangeTime = CommonTime();
	}

	// Out of orgasm mode, it can affect facial expressions at every 10 steps
	if ((C.ArousalSettings.OrgasmTimer == null) || (typeof C.ArousalSettings.OrgasmTimer !== "number") || isNaN(C.ArousalSettings.OrgasmTimer) || (C.ArousalSettings.OrgasmTimer < CurrentTime))
		if (((C.ArousalSettings.AffectExpression == null) || C.ArousalSettings.AffectExpression) && ((C.ArousalSettings.Progress + ((Progress < 0) ? 1 : 0)) % 10 == 0))
			ActivityExpression(C, C.ArousalSettings.Progress);

	// Can trigger an orgasm
	if (C.ArousalSettings.Progress == 100) ActivityOrgasmPrepare(C);

}

/**
 * Set the current vibrator level for drawing purposes
 * @param {Character} C - Character for which the timer is progressing
 * @param {number} Level - Level from 0 to 4 (higher = more vibration)
 * @returns {void} - Nothing
 */
function ActivityVibratorLevel(C, Level) {
	if (C.ArousalSettings != null) {
		if (Level != C.ArousalSettings.VibratorLevel) {
			C.ArousalSettings.VibratorLevel = Level;
			C.ArousalSettings.ChangeTime = CommonTime();
		}
	}
}


/**
 * Calculates the progress one character does on another right away
 * @param {Character} Source - The character who performed the activity
 * @param {Character} Target - The character on which the activity was performed
 * @param {object} Activity - The activity performed
 * @returns {void} - Nothing
 */
function ActivityRunSelf(Source, Target, Activity) {
	if (((Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic")) && (Source.ID == 0) && (Target.ID != 0)) {
		var Factor = (PreferenceGetActivityFactor(Player, Activity.Name, false) * 5) - 10; // Check how much the player likes the activity, from -10 to +10
		Factor = Factor + Math.floor((Math.random() * 8)); // Random 0 to 7 bonus
		if (Target.IsLoverOfPlayer()) Factor = Factor + Math.floor((Math.random() * 8)); // Another random 0 to 7 bonus if the target is the player's lover
		ActivitySetArousalTimer(Player, Activity, "ActivityOnOther", Factor); // For activities on other, it cannot go over 2/3
	}
}

/**
 * Launches a sexual activity for a character and sends the chatroom message if applicable.
 * @param {Character} C - Character on which the activity was triggered
 * @param {object} Activity - Activity performed
 * @returns {void} - Nothing
 */
function ActivityRun(C, Activity) {

	// If the player does the activity on herself or an NPC, we calculate the result right away
	if ((C.ArousalSettings.Active == "Hybrid") || (C.ArousalSettings.Active == "Automatic"))
		if ((C.ID == 0) || C.IsNpc())
			ActivityEffect(Player, C, Activity, C.FocusGroup.Name);

	if (C.ID == 0) {
		if (Activity.MakeSound) {
			AutoPunishGagActionFlag = true;
			AutoShockGagActionFlag = true;
		}
	}

	// If the player does the activity on someone else, we calculate the progress for the player right away
	ActivityRunSelf(Player, C, Activity);

	// The text result can be outputted in the chatroom or in the NPC dialog
	if (CurrentScreen == "ChatRoom") {

		// Publishes the activity to the chatroom
		var Dictionary = [];
		Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
		Dictionary.push({ Tag: "ActivityGroup", Text: C.FocusGroup.Name });
		Dictionary.push({ Tag: "ActivityName", Text: Activity.Name });
		ServerSend("ChatRoomChat", { Content: ((C.ID == 0) ? "ChatSelf-" : "ChatOther-") + C.FocusGroup.Name + "-" + Activity.Name, Type: "Activity", Dictionary: Dictionary });

		if (C.ID == 0 && Activity.Name.indexOf("Struggle") >= 0 )

			ChatRoomStimulationMessage("StruggleAction");

		// Exits from dialog to see the result
		DialogLeave();

	}

}

/**
 * Checks if a used asset should trigger an activity/arousal progress on the target character
 * @param {Character} Source - The character who used the item
 * @param {Character} Target - The character on which the item was used
 * @param {object} Asset - Asset used
 * @return {void} - Nothing
 */
function ActivityArousalItem(Source, Target, Asset) {
	var AssetActivity = Asset.DynamicActivity(Source);
	if (AssetActivity != null) {
		var Activity = AssetGetActivity(Target.AssetFamily, AssetActivity);
		if ((Source.ID == 0) && (Target.ID != 0)) ActivityRunSelf(Source, Target, Activity);
		if (((Target.ArousalSettings != null) && ((Target.ArousalSettings.Active == "Hybrid") || (Target.ArousalSettings.Active == "Automatic"))) && ((Target.ID == 0) || (Target.IsNpc())))
			ActivityEffect(Source, Target, AssetActivity, Asset.Group.Name);
	}
}

/**
 * Checks if the character is wearing an item tagged with the fetish type name and returns the love factor for it
 * @param {Character} C - The character to validate
 * @param {string} Type - The fetish type name
 * @return {number} - From -2 (hate it) to 2 (adore it) based on the player preferences
 */
function ActivityFetishItemFactor(C, Type) {
	var Factor = (PreferenceGetFetishFactor(C, Type) - 2);
	if (Factor != 0)
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Fetish != null))
				if (C.Appearance[A].Asset.Fetish.indexOf(Type) >= 0)
					return Factor;
	return 0;
}

/**
 * Loops in all fetishes for a character and calculates the total fetish factor
 * @param {Character} C - The character to validate
 * @return {number} - The negative/positive number will have negative/positive impact on arousal
 */
function ActivityFetishFactor(C) {
	var Factor = 0;
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Fetish != null))
		for (let A = 0; A < C.ArousalSettings.Fetish.length; A++)
			if (C.ArousalSettings.Fetish[A].Factor != 2)
				for (let F = 0; F < FetishFemale3DCG.length; F++)
					if (FetishFemale3DCG[F].Name == C.ArousalSettings.Fetish[A].Name)
						Factor = Factor + FetishFemale3DCG[F].GetFactor(C);
	return Factor;
}
