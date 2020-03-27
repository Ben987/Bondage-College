"use strict";
var PreferenceBackground = "Sheet";
var PreferenceMessage = "";
var PreferenceColorPick = "";
var PreferenceSubscreen = "";
var PreferenceChatColorThemeSelected = "";
var PreferenceChatColorThemeList = ["Light", "Dark"];
var PreferenceChatColorThemeIndex = 0;
var PreferenceChatEnterLeaveSelected = "";
var PreferenceChatEnterLeaveList = ["Normal", "Smaller", "Hidden"];
var PreferenceChatEnterLeaveIndex = 0;
var PreferenceChatMemberNumbersSelected = "";
var PreferenceChatMemberNumbersList = ["Always", "Never", "OnMouseover"];
var PreferenceChatMemberNumbersIndex = 0;
var PreferenceSettingsSensDepList = ["Normal", "SensDepNames", "SensDepTotal"];
var PreferenceSettingsSensDepIndex = 0;
var PreferenceSettingsVolumeList = [1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
var PreferenceSettingsVolumeIndex = 0;
var PreferenceEmailStatusReceived = false;
var PreferenceArousalActiveList = ["Inactive", "NoMeter", "Manual", "Hybrid", "Automatic"];
var PreferenceArousalActiveIndex = 0;
var PreferenceArousalVisibleList = ["All", "Access", "Self"];
var PreferenceArousalVisibleIndex = 0;
var PreferenceArousalAffectStutterList = ["None", "Arousal", "Vibration", "All"];
var PreferenceArousalAffectStutterIndex = 0;
var PreferenceArousalActivityList = null;
var PreferenceArousalActivityIndex = 0;
var PreferenceArousalActivityFactorSelf = 0;
var PreferenceArousalActivityFactorOther = 0;
var PreferenceArousalZoneFactor = 0;

// Returns the love factor of the activity for the character (0 is horrible, 2 is normal, 4 is great)
function PreferenceGetActivityFactor(C, Type, Self) {
	var Factor = 2;
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Activity != null))
		for (var P = 0; P < C.ArousalSettings.Activity.length; P++)
			if (C.ArousalSettings.Activity[P].Name == Type)
				Factor = (Self) ? C.ArousalSettings.Activity[P].Self : C.ArousalSettings.Activity[P].Other;
	if ((Factor == null) || (typeof Factor !== "number") || (Factor < 0) || (Factor > 4)) Factor = 2;
	return Factor;
}

// Sets the love factor of the activity for the character (0 is horrible, 2 is normal, 4 is great)
function PreferenceSetActivityFactor(C, Type, Self, Factor) {
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Activity != null))
		for (var P = 0; P < C.ArousalSettings.Activity.length; P++)
			if (C.ArousalSettings.Activity[P].Name == Type)
				if (Self) C.ArousalSettings.Activity[P].Self = Factor;
				else C.ArousalSettings.Activity[P].Other = Factor;
}

// Returns the love factor of a zone for the character (0 is horrible, 2 is normal, 4 is great)
function PreferenceGetZoneFactor(C, Zone) {
	var Factor = 2;
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Zone != null))
		for (var Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
			if (C.ArousalSettings.Zone[Z].Name == Zone)
				Factor = C.ArousalSettings.Zone[Z].Factor;
	if ((Factor == null) || (typeof Factor !== "number") || (Factor < 0) || (Factor > 4)) Factor = 2;
	return Factor;
}

// Sets the love factor for a specific body zone on the player (0 is horrible, 2 is normal, 4 is great)
function PreferenceSetZoneFactor(C, Zone, Factor) {
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Zone != null))
		for (var Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
			if (C.ArousalSettings.Zone[Z].Name == Zone)
				C.ArousalSettings.Zone[Z].Factor = Factor;
}

// Returns TRUE if the zone allows orgasms for a character
function PreferenceGetZoneOrgasm(C, Zone) {
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Zone != null))
		for (var Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
			if (C.ArousalSettings.Zone[Z].Name == Zone)
				return ((C.ArousalSettings.Zone[Z].Orgasm != null) && (typeof C.ArousalSettings.Zone[Z].Orgasm === "boolean") && C.ArousalSettings.Zone[Z].Orgasm);
	return false;
}

// Sets if a zone can give an orgasm to the character
function PreferenceSetZoneOrgasm(C, Zone, CanOrgasm) {
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Zone != null))
		for (var Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
			if (C.ArousalSettings.Zone[Z].Name == Zone)
				if (CanOrgasm) C.ArousalSettings.Zone[Z].Orgasm = true;
				else delete C.ArousalSettings.Zone[Z].Orgasm;
}

// Returns a red color for low factors and a green color for high factors
function PreferenceGetFactorColor(Factor) {
	if (Factor == 0) return "#FF000088";
	if (Factor == 1) return "#FF000044";
	if (Factor == 3) return "#00FF0044";
	if (Factor == 4) return "#00FF0088";
	return "#80808044";
}

// Returns TRUE if we must active the preference controls
function PreferenceArousalIsActive() {
	return (PreferenceArousalActiveList[PreferenceArousalActiveIndex] != "Inactive");
}

// Loads the activity factor combo boxes based on the current activity selected
function PreferenceLoadActivityFactor() {
	PreferenceArousalActivityFactorSelf = PreferenceGetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], true);
	PreferenceArousalActivityFactorOther = PreferenceGetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], false);
}

// Initialize and validates the character settings
function PreferenceInit(C) {

	// If the settings aren't set before, construct them to replicate the default behavior
	if (!C.ChatSettings) C.ChatSettings = { DisplayTimestamps: true, ColorNames: true, ColorActions: true, ColorEmotes: true, ShowActivities: true };
	if (C.ChatSettings.DisplayTimestamps == null) C.ChatSettings.DisplayTimestamps = true;
	if (C.ChatSettings.ColorNames == null) C.ChatSettings.ColorNames = true;
	if (C.ChatSettings.ColorActions == null) C.ChatSettings.ColorActions = true;
	if (C.ChatSettings.ColorEmotes == null) C.ChatSettings.ColorEmotes = true;
	if (C.ChatSettings.ShowActivities == null) C.ChatSettings.ShowActivities = true;
	if (!C.VisualSettings) C.VisualSettings = { ForceFullHeight: false };
    if (!C.AudioSettings || (typeof C.AudioSettings.Volume !== "number") || (typeof C.AudioSettings.PlayBeeps !== "boolean")) C.AudioSettings = { Volume: 1, PlayBeeps: false };

	// Sets the default arousal settings
	if (!C.ArousalSettings) C.ArousalSettings = { Active: "Hybrid", Visible: "Access", ShowOtherMeter: true, AffectExpression: true, AffectStutter: "All", Progress: 0, ProgressTimer: 0, Activity: [], Zone: [] };
	if (typeof C.ArousalSettings.Active !== "string") C.ArousalSettings.Active = "Hybrid";
	if (typeof C.ArousalSettings.Visible !== "string") C.ArousalSettings.Visible = "Access";
	if (typeof C.ArousalSettings.ShowOtherMeter !== "boolean") C.ArousalSettings.ShowOtherMeter = true;
	if (typeof C.ArousalSettings.AffectExpression !== "boolean") C.ArousalSettings.AffectExpression = true;
	if (typeof C.ArousalSettings.AffectStutter !== "string") C.ArousalSettings.AffectStutter = "All";
	if ((typeof C.ArousalSettings.Progress !== "number") || isNaN(C.ArousalSettings.Progress)) C.ArousalSettings.Progress = 0;
	if ((typeof C.ArousalSettings.ProgressTimer !== "number") || isNaN(C.ArousalSettings.ProgressTimer)) C.ArousalSettings.ProgressTimer = 0;
	if ((C.ArousalSettings.Activity == null) || !Array.isArray(C.ArousalSettings.Activity)) C.ArousalSettings.Activity = [];
	if ((C.ArousalSettings.Zone == null) || !Array.isArray(C.ArousalSettings.Zone)) C.ArousalSettings.Zone = [];

	// Sets the default game settings
	if (!C.GameplaySettings) C.GameplaySettings = {};
	if (typeof C.GameplaySettings.SensDepChatLog !== "string") C.GameplaySettings.SensDepChatLog = "Normal";
	if (typeof C.GameplaySettings.BlindDisableExamine !== "boolean") C.GameplaySettings.BlindDisableExamine = false;
	if (typeof C.GameplaySettings.DisableAutoRemoveLogin !== "boolean") C.GameplaySettings.DisableAutoRemoveLogin = false;
	if (typeof C.GameplaySettings.EnableAfkTimer !== "boolean") C.GameplaySettings.EnableAfkTimer = true;
	
	// Validates the player preference, they must match with the assets activities & zones, default factor is 2 (normal love)
	if (Player.AssetFamily == "Female3DCG") {
		
		// Validates the activities
		for (var A = 0; A < ActivityFemale3DCG.length; A++) {
			var Found = false;
			for (var P = 0; P < C.ArousalSettings.Activity.length; P++)
				if ((C.ArousalSettings.Activity[P] != null) && (C.ArousalSettings.Activity[P].Name != null) && (ActivityFemale3DCG[A].Name == C.ArousalSettings.Activity[P].Name)) {
					Found = true;
					if ((C.ArousalSettings.Activity[P].Self == null) || (typeof C.ArousalSettings.Activity[P].Self !== "number") || (C.ArousalSettings.Activity[P].Self < 0) || (C.ArousalSettings.Activity[P].Self > 4)) C.ArousalSettings.Activity[P].Self = 2;
					if ((C.ArousalSettings.Activity[P].Other == null) || (typeof C.ArousalSettings.Activity[P].Other !== "number") || (C.ArousalSettings.Activity[P].Other < 0) || (C.ArousalSettings.Activity[P].Other > 4)) C.ArousalSettings.Activity[P].Other = 2;
				}
			if (!Found) C.ArousalSettings.Activity.push({ Name: ActivityFemale3DCG[A].Name, Self: 2, Other: 2 });
		}

		// Validates the zones
		for (var A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Zone != null) && (AssetGroup[A].Activity != null)) {
				var Found = false;
				for (var Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
					if ((C.ArousalSettings.Zone[Z] != null) && (C.ArousalSettings.Zone[Z].Name != null) && (AssetGroup[A].Name == C.ArousalSettings.Zone[Z].Name)) {
						Found = true;
						if ((C.ArousalSettings.Zone[Z].Factor == null) || (typeof C.ArousalSettings.Zone[Z].Factor !== "number") || (C.ArousalSettings.Zone[Z].Factor < 0) || (C.ArousalSettings.Zone[Z].Factor > 4)) C.ArousalSettings.Zone[Z].Factor = 2;
					}
				if (!Found) {
					C.ArousalSettings.Zone.push({ Name: AssetGroup[A].Name, Factor: 2 });
					if (AssetGroup[A].Name == "ItemVulva") PreferenceSetZoneOrgasm(C, "ItemVulva", true);
				}
			}

	}

	// Enables the AFK timer for the current player only
	AfkTimerSetEnabled((C.ID == 0) && C.GameplaySettings && (C.GameplaySettings.EnableAfkTimer != false));

}

// When the preference screens loads
function PreferenceLoad() {

	// Sets up the player label color
	if (!CommonIsColor(Player.LabelColor)) Player.LabelColor = "#ffffff";
	PreferenceMainScreenLoad();
	PreferenceInit(Player);

	// Sets the chat themes
	PreferenceChatColorThemeIndex = (PreferenceChatColorThemeList.indexOf(Player.ChatSettings.ColorTheme) < 0) ? 0 : PreferenceChatColorThemeList.indexOf(Player.ChatSettings.ColorTheme);
	PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveList.indexOf(Player.ChatSettings.EnterLeave) < 0) ? 0 : PreferenceChatEnterLeaveList.indexOf(Player.ChatSettings.EnterLeave);
	PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersList.indexOf(Player.ChatSettings.MemberNumbers) < 0) ? 0 : PreferenceChatMemberNumbersList.indexOf(Player.ChatSettings.MemberNumbers);
	PreferenceSettingsSensDepIndex = (PreferenceSettingsSensDepList.indexOf(Player.GameplaySettings.SensDepChatLog) < 0 ) ? 0 : PreferenceSettingsSensDepList.indexOf(Player.GameplaySettings.SensDepChatLog);
    PreferenceSettingsVolumeIndex = (PreferenceSettingsVolumeList.indexOf(Player.AudioSettings.Volume) < 0) ? 0 : PreferenceSettingsVolumeList.indexOf(Player.AudioSettings.Volume);
    PreferenceArousalActiveIndex = (PreferenceArousalActiveList.indexOf(Player.ArousalSettings.Active) < 0) ? 0 : PreferenceArousalActiveList.indexOf(Player.ArousalSettings.Active);
    PreferenceArousalVisibleIndex = (PreferenceArousalVisibleList.indexOf(Player.ArousalSettings.Visible) < 0) ? 0 : PreferenceArousalVisibleList.indexOf(Player.ArousalSettings.Visible);
    PreferenceArousalAffectStutterIndex = (PreferenceArousalAffectStutterList.indexOf(Player.ArousalSettings.AffectStutter) < 0) ? 0 : PreferenceArousalAffectStutterList.indexOf(Player.ArousalSettings.AffectStutter);
	PreferenceChatColorThemeSelected = PreferenceChatColorThemeList[PreferenceChatColorThemeIndex];
	PreferenceChatEnterLeaveSelected = PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex];
	PreferenceChatMemberNumbersSelected = PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex];

	// Prepares the activity list
	PreferenceArousalActivityList = [];
	if (Player.AssetFamily == "Female3DCG")
		for (var A = 0; A < ActivityFemale3DCG.length; A++)
			PreferenceArousalActivityList.push(ActivityFemale3DCG[A].Name);
	PreferenceArousalActivityIndex = 0;
	PreferenceLoadActivityFactor();

}

// Run the preference screen
function PreferenceRun() {
	
	// If a subscreen is active, draw that instead
	if (PreferenceSubscreen == "Chat") return PreferenceSubscreenChatRun();
	if (PreferenceSubscreen == "Audio") return PreferenceSubscreenAudioRun();
	if (PreferenceSubscreen == "Arousal") return PreferenceSubscreenArousalRun();
	if (PreferenceSubscreen == "Security") return PreferenceSubscreenSecurityRun();

	// Draw the online preferences
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Preferences"), 500, 125, "Black", "Gray");
    if (PreferenceMessage != "") DrawText(TextGet(PreferenceMessage), 865, 125, "Red", "Black");
	DrawText(TextGet("CharacterLabelColor"), 500, 225, "Black", "Gray");
	ElementPosition("InputCharacterLabelColor", 990, 212, 250);
	if (CommonIsColor(ElementValue("InputCharacterLabelColor"))) document.getElementById("InputCharacterLabelColor").style.color = ElementValue("InputCharacterLabelColor");
	else document.getElementById("InputCharacterLabelColor").style.color = Player.LabelColor;
	document.getElementById("InputCharacterLabelColor").style.backgroundColor = "#000000";
	DrawButton(1140, 187, 65, 65, "", "White", "Icons/Color.png");
	DrawButton(500, 280, 90, 90, "", "White", "Icons/Next.png");
	DrawText(TextGet("ItemPermission") + " " + TextGet("PermissionLevel" + Player.ItemPermission.toString()), 615, 325, "Black", "Gray");
	DrawText(TextGet("SensDepSetting"), 800, 428, "Black", "Gray");

	// Checkboxes
	DrawCheckbox(500, 472, 64, 64, TextGet("BlindDisableExamine"), Player.GameplaySettings.BlindDisableExamine);
	DrawCheckbox(500, 552, 64, 64, TextGet("DisableAutoRemoveLogin"), Player.GameplaySettings.DisableAutoRemoveLogin);
	DrawCheckbox(500, 632, 64, 64, TextGet("EnableAfkTimer"), Player.GameplaySettings.EnableAfkTimer);
	DrawCheckbox(500, 712, 64, 64, TextGet("ForceFullHeight"), Player.VisualSettings.ForceFullHeight);

	MainCanvas.textAlign = "center";
	DrawBackNextButton(500, 392, 250, 64, TextGet(Player.GameplaySettings.SensDepChatLog), "White", "",
		() => TextGet(PreferenceSettingsSensDepList[(PreferenceSettingsSensDepIndex + PreferenceSettingsSensDepList.length - 1) % PreferenceSettingsSensDepList.length]),
		() => TextGet(PreferenceSettingsSensDepList[(PreferenceSettingsSensDepIndex + 1) % PreferenceSettingsSensDepList.length]));

	// Draw the player & controls
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (PreferenceColorPick != "") {
		ColorPickerDraw(1250, 185, 675, 830, document.getElementById(PreferenceColorPick));
	} else {
    	ColorPickerHide();
		DrawButton(1815, 190, 90, 90, "", "White", "Icons/Chat.png");
		DrawButton(1815, 305, 90, 90, "", "White", "Icons/Audio.png");
		DrawButton(1815, 420, 90, 90, "", "White", "Icons/Activity.png");
		DrawButton(1815, 535, 90, 90, "", "White", "Icons/Lock.png");
	}
}

// When the user clicks in the preference screen
function PreferenceClick() {

	// If a subscreen is active, process that instead
	if (PreferenceSubscreen == "Chat") return PreferenceSubscreenChatClick();
	if (PreferenceSubscreen == "Audio") return PreferenceSubscreenAudioClick();
	if (PreferenceSubscreen == "Arousal") return PreferenceSubscreenArousalClick();
	if (PreferenceSubscreen == "Security") return PreferenceSubscreenSecurityClick();

	// If the user clicks on "Exit"
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) PreferenceExit();

	// If the user clicks on the chat settings button
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 190) && (MouseY < 280) && (PreferenceColorPick == "")) {
		PreferenceMainScreenExit();
		PreferenceSubscreen = "Chat";
	}

	// If the user clicks on the audio settings button
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 305) && (MouseY < 395) && (PreferenceColorPick == "")) {
		PreferenceMainScreenExit();
		PreferenceSubscreen = "Audio";
	}

	// If the user clicks on the arousal settings button
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 420) && (MouseY < 510) && (PreferenceColorPick == "")) {
		PreferenceMainScreenExit();
		PreferenceSubscreen = "Arousal";
	}

	// If the user clicks on the security settings button
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 535) && (MouseY < 625) && (PreferenceColorPick == "")) {
		PreferenceMainScreenExit();
		ElementCreateInput("InputEmailOld", "text", "", "100");
		ElementCreateInput("InputEmailNew", "text", "", "100");
		ServerSend("AccountQuery", { Query: "EmailStatus" });
		PreferenceSubscreen = "Security";
	}
	
	// If we must change the restrain permission level
	if ((MouseX >= 500) && (MouseX < 590) && (MouseY >= 280) && (MouseY < 370)) {
		Player.ItemPermission++;
		if (Player.ItemPermission > 5) Player.ItemPermission = 0;
	}

	// If we must show/hide/use the color picker
	if ((MouseX >= 1140) && (MouseX < 1205) && (MouseY >= 187) && (MouseY < 252)) PreferenceColorPick = (PreferenceColorPick != "InputCharacterLabelColor") ? "InputCharacterLabelColor" : "";
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick != "")) PreferenceColorPick = "";

    // If we must change audio gameplay or visual settings
	if ((MouseX >= 500) && (MouseX < 750) && (MouseY >= 392) && (MouseY < 456)) {
		if (MouseX <= 625) PreferenceSettingsSensDepIndex = (PreferenceSettingsSensDepList.length + PreferenceSettingsSensDepIndex - 1) % PreferenceSettingsSensDepList.length;
		else PreferenceSettingsSensDepIndex = (PreferenceSettingsSensDepIndex + 1) % PreferenceSettingsSensDepList.length;
		Player.GameplaySettings.SensDepChatLog = PreferenceSettingsSensDepList[PreferenceSettingsSensDepIndex];
	}

	// Preference check boxes
	if (CommonIsClickAt(500, 472, 64, 64)) Player.GameplaySettings.BlindDisableExamine = !Player.GameplaySettings.BlindDisableExamine;
	if (CommonIsClickAt(500, 552, 64, 64)) Player.GameplaySettings.DisableAutoRemoveLogin = !Player.GameplaySettings.DisableAutoRemoveLogin;
	if (CommonIsClickAt(500, 632, 64, 64)) {
		Player.GameplaySettings.EnableAfkTimer = !Player.GameplaySettings.EnableAfkTimer;
		AfkTimerSetEnabled(Player.GameplaySettings.EnableAfkTimer);
	}
	if (CommonIsClickAt(500, 712, 64, 64)) Player.VisualSettings.ForceFullHeight = !Player.VisualSettings.ForceFullHeight;

}

// When the user exit the preference screen, we push the data back to the server
function PreferenceExit() {
	if (CommonIsColor(ElementValue("InputCharacterLabelColor"))) {
		Player.LabelColor = ElementValue("InputCharacterLabelColor");
		var P = {
			ItemPermission: Player.ItemPermission,
			LabelColor: Player.LabelColor,
			ChatSettings: Player.ChatSettings,
			VisualSettings: Player.VisualSettings,
			AudioSettings: Player.AudioSettings,
			GameplaySettings: Player.GameplaySettings,
			ArousalSettings: Player.ArousalSettings
		};
		ServerSend("AccountUpdate", P);
		PreferenceMessage = "";
		PreferenceMainScreenExit();
		CommonSetScreen("Character", "InformationSheet");
	} else PreferenceMessage = "ErrorInvalidColor";
}

// Redirected to from the main Run function if the player is in the audio settings subscreen
function PreferenceSubscreenAudioRun() {
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("AudioPreferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("AudioVolume"), 800, 225, "Black", "Gray");
	DrawText(TextGet("AudioPlayBeeps"), 600, 305, "Black", "Gray");
    DrawButton(500, 272, 64, 64, "", "White", (Player.AudioSettings && Player.AudioSettings.PlayBeeps) ? "Icons/Checked.png" : "");
    DrawText(TextGet("AudioPlayItem"), 600, 385, "Black", "Gray");
	DrawButton(500, 352, 64, 64, "", "White", (Player.AudioSettings && Player.AudioSettings.PlayItem) ? "Icons/Checked.png" : "");
	MainCanvas.textAlign = "center";
    DrawBackNextButton(500, 193, 250, 64, Player.AudioSettings.Volume * 100 + "%", "White", "",
        () => PreferenceSettingsVolumeList[(PreferenceSettingsVolumeIndex + PreferenceSettingsVolumeList.length - 1) % PreferenceSettingsVolumeList.length] * 100 + "%",
        () => PreferenceSettingsVolumeList[(PreferenceSettingsVolumeIndex + 1) % PreferenceSettingsVolumeList.length] * 100 + "%");
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// Redirected to from the main Run function if the player is in the chat settings subscreen
function PreferenceSubscreenChatRun() {
	MainCanvas.textAlign = "left";
	DrawText(TextGet("ChatPreferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("ColorTheme"), 500, 225, "Black", "Gray");
	DrawText(TextGet("EnterLeaveStyle"), 500, 325, "Black", "Gray");
	DrawText(TextGet("DisplayMemberNumbers"), 500, 425, "Black", "Gray");
	DrawText(TextGet("DisplayTimestamps"), 600, 525, "Black", "Gray");
	DrawText(TextGet("ColorNames"), 600, 605, "Black", "Gray");
	DrawText(TextGet("ColorActions"), 600, 685, "Black", "Gray");
	DrawText(TextGet("ColorEmotes"), 600, 765, "Black", "Gray");
	DrawText(TextGet("ShowActivities"), 600, 845, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawBackNextButton(1000, 190, 350, 70, TextGet(PreferenceChatColorThemeSelected), "White", "",
		() => TextGet((PreferenceChatColorThemeIndex == 0) ? PreferenceChatColorThemeList[PreferenceChatColorThemeList.length - 1] : PreferenceChatColorThemeList[PreferenceChatColorThemeIndex - 1]),
		() => TextGet((PreferenceChatColorThemeIndex >= PreferenceChatColorThemeList.length - 1) ? PreferenceChatColorThemeList[0] : PreferenceChatColorThemeList[PreferenceChatColorThemeIndex + 1]));
	DrawBackNextButton(1000, 290, 350, 70, TextGet(PreferenceChatEnterLeaveSelected), "White", "",
		() => TextGet((PreferenceChatEnterLeaveIndex == 0) ? PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveList.length - 1] : PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex - 1]),
		() => TextGet((PreferenceChatEnterLeaveIndex >= PreferenceChatEnterLeaveList.length - 1) ? PreferenceChatEnterLeaveList[0] : PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex + 1]));
	DrawBackNextButton(1000, 390, 350, 70, TextGet(PreferenceChatMemberNumbersSelected), "White", "",
		() => TextGet((PreferenceChatMemberNumbersIndex == 0) ? PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersList.length - 1] : PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex - 1]),
		() => TextGet((PreferenceChatMemberNumbersIndex >= PreferenceChatMemberNumbersList.length - 1) ? PreferenceChatMemberNumbersList[0] : PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex + 1]));
	DrawButton(500, 492, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.DisplayTimestamps) ? "Icons/Checked.png" : "");
	DrawButton(500, 572, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ColorNames) ? "Icons/Checked.png" : "");
	DrawButton(500, 652, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ColorActions) ? "Icons/Checked.png" : "");
	DrawButton(500, 732, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ColorEmotes) ? "Icons/Checked.png" : "");
	DrawButton(500, 812, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ShowActivities) ? "Icons/Checked.png" : "");
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawCharacter(Player, 50, 50, 0.9);
}

// Redirected to from the main Run function if the player is in the arousal settings subscreen
function PreferenceSubscreenArousalRun() {

	// Draws the main labels and player
	DrawCharacter(Player, 50, 50, 0.9, false);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("ArousalPreferences"), 550, 125, "Black", "Gray");
	DrawText(TextGet("ArousalActive"), 550, 225, "Black", "Gray");
	DrawText(TextGet("ArousalStutter"), 550, 425, "Black", "Gray");
	DrawCheckbox(550, 286, 64, 64, TextGet("ArousalShowOtherMeter"), Player.ArousalSettings.ShowOtherMeter);

	// The other controls are only drawn if the arousal is active
	if (PreferenceArousalIsActive()) {

		// Draws the labels and check boxes
		DrawCheckbox(1250, 286, 64, 64, TextGet("ArousalAffectExpression"), Player.ArousalSettings.AffectExpression);
		DrawText(TextGet("ArousalVisible"), 1240, 225, "Black", "Gray");
		DrawText(TextGet("ArousalActivity"), 550, 525, "Black", "Gray");
		DrawText(TextGet("ArousalActivityLoveSelf"), 550, 625, "Black", "Gray");
		DrawText(TextGet("ArousalActivityLoveOther"), 1255, 625, "Black", "Gray");

		// Draws all the available character zones
		for (var A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Zone != null) && (AssetGroup[A].Activity != null)) {
				DrawAssetGroupZoneBackground(Player, AssetGroup[A].Zone, 0.9, 50, 50, PreferenceGetFactorColor(PreferenceGetZoneFactor(Player, AssetGroup[A].Name)));
				DrawAssetGroupZone(Player, AssetGroup[A].Zone, 0.9, 50, 50, "#808080FF", 3);
			}

		// The zones can be selected and drawn on the character
		if (Player.FocusGroup != null) {
			DrawCheckbox(1230, 793, 64, 64, TextGet("ArousalAllowOrgasm"), PreferenceGetZoneOrgasm(Player, Player.FocusGroup.Name));
			DrawText(TextGet("ArousalZone" + Player.FocusGroup.Name) + " - " + TextGet("ArousalConfigureErogenousZones"), 550, 725, "Black", "Gray");
			DrawAssetGroupZone(Player, Player.FocusGroup.Zone, 0.9, 50, 50, "cyan");
			MainCanvas.textAlign = "center";
			DrawBackNextButton(550, 793, 600, 64, TextGet("ArousalZoneLove" + PreferenceArousalZoneFactor), PreferenceGetFactorColor(PreferenceGetZoneFactor(Player, Player.FocusGroup.Name)), "", () => "", () => "");
			Player.FocusGroup
		}
		else DrawText(TextGet("ArousalSelectErogenousZones"), 550, 725, "Black", "Gray");

		// Draws the sub-selection controls
		MainCanvas.textAlign = "center";
		DrawBackNextButton(1505, 193, 400, 64, TextGet("ArousalVisible" + PreferenceArousalVisibleList[PreferenceArousalVisibleIndex]), "White", "", () => "", () => "");
		DrawBackNextButton(900, 493, 500, 64, ActivityDictionaryText("Activity" + PreferenceArousalActivityList[PreferenceArousalActivityIndex]), "White", "", () => "", () => "");
		DrawBackNextButton(900, 593, 300, 64, TextGet("ArousalActivityLove" + PreferenceArousalActivityFactorSelf), PreferenceGetFactorColor(PreferenceGetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], true)), "", () => "", () => "");
		DrawBackNextButton(1605, 593, 300, 64, TextGet("ArousalActivityLove" + PreferenceArousalActivityFactorOther), PreferenceGetFactorColor(PreferenceGetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], false)), "", () => "", () => "");

	}

	// We always draw the active & stutter control
	MainCanvas.textAlign = "center";
	DrawBackNextButton(750, 193, 450, 64, TextGet("ArousalActive" + PreferenceArousalActiveList[PreferenceArousalActiveIndex]), "White", "", () => "", () => "");
	DrawBackNextButton(900, 393, 500, 64, TextGet("ArousalStutter" + PreferenceArousalAffectStutterList[PreferenceArousalAffectStutterIndex]), "White", "", () => "", () => "");
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

}

// Redirected to from the main Run function if the player is in the security settings subscreen
function PreferenceSubscreenSecurityRun() {
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("SecurityPreferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("UpdateEmailOld"), 500, 225, "Black", "Gray");
	DrawText(TextGet("UpdateEmailNew"), 500, 305, "Black", "Gray");
	ElementPosition("InputEmailOld", 1200, 225, 800);
	ElementPosition("InputEmailNew", 1200, 305, 800);
	DrawText(TextGet("UpdateEmailDescription"), 800, 397, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawButton(500, 365, 250, 64, TextGet("UpdateEmail"), "White", "");
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// When the user clicks in the audio preference subscreen
function PreferenceSubscreenAudioClick() {

	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) {
		PreferenceSubscreen = "";
		PreferenceMainScreenLoad();
	}

	// Volume increase/decrease control
    if ((MouseX >= 500) && (MouseX < 750) && (MouseY >= 193) && (MouseY < 257)) {
        if (MouseX <= 625) PreferenceSettingsVolumeIndex = (PreferenceSettingsVolumeList.length + PreferenceSettingsVolumeIndex - 1) % PreferenceSettingsVolumeList.length;
        else PreferenceSettingsVolumeIndex = (PreferenceSettingsVolumeIndex + 1) % PreferenceSettingsVolumeList.length;
        Player.AudioSettings.Volume = PreferenceSettingsVolumeList[PreferenceSettingsVolumeIndex];
    }

	// Individual audio check-boxes
	if ((MouseX >= 500) && (MouseX < 564)) {
		if ((MouseY >= 272) && (MouseY < 336)) Player.AudioSettings.PlayBeeps = !Player.AudioSettings.PlayBeeps;
		if ((MouseY >= 352) && (MouseY < 416)) Player.AudioSettings.PlayItem = !Player.AudioSettings.PlayItem;
	}

}

// Redirected to from the main Click function if the player is in the chat settings subscreen
function PreferenceSubscreenChatClick() {

	// If the user clicked one of the check-boxes
	if ((MouseX >= 500) && (MouseX <= 564)) {
		if ((MouseY >= 492) && (MouseY <= 556)) Player.ChatSettings.DisplayTimestamps = !Player.ChatSettings.DisplayTimestamps;
		if ((MouseY >= 572) && (MouseY <= 636)) Player.ChatSettings.ColorNames = !Player.ChatSettings.ColorNames;
		if ((MouseY >= 652) && (MouseY <= 716)) Player.ChatSettings.ColorActions = !Player.ChatSettings.ColorActions;
		if ((MouseY >= 732) && (MouseY <= 796)) Player.ChatSettings.ColorEmotes = !Player.ChatSettings.ColorEmotes;
		if ((MouseY >= 812) && (MouseY <= 876)) Player.ChatSettings.ShowActivities = !Player.ChatSettings.ShowActivities;
	}

	// If the user used one of the BackNextButtons
	if ((MouseX >= 1000) && (MouseX < 1350) && (MouseY >= 190) && (MouseY < 270)) {
		if (MouseX <= 1175) PreferenceChatColorThemeIndex = (PreferenceChatColorThemeIndex <= 0) ? PreferenceChatColorThemeList.length - 1 : PreferenceChatColorThemeIndex - 1;
		else PreferenceChatColorThemeIndex = (PreferenceChatColorThemeIndex >= PreferenceChatColorThemeList.length - 1) ? 0 : PreferenceChatColorThemeIndex + 1;
		PreferenceChatColorThemeSelected = PreferenceChatColorThemeList[PreferenceChatColorThemeIndex];
		Player.ChatSettings.ColorTheme = PreferenceChatColorThemeSelected;
	}
	if ((MouseX >= 1000) && (MouseX < 1350) && (MouseY >= 290) && (MouseY < 370)) {
		if (MouseX <= 1175) PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveIndex <= 0) ? PreferenceChatEnterLeaveList.length - 1 : PreferenceChatEnterLeaveIndex - 1;
		else PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveIndex >= PreferenceChatEnterLeaveList.length - 1) ? 0 : PreferenceChatEnterLeaveIndex + 1;
		PreferenceChatEnterLeaveSelected = PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex];
		Player.ChatSettings.EnterLeave = PreferenceChatEnterLeaveSelected;
	}
	if ((MouseX >= 1000) && (MouseX < 1350) && (MouseY >= 390) && (MouseY < 470)) {
		if (MouseX <= 1175) PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersIndex <= 0) ? PreferenceChatMemberNumbersList.length - 1 : PreferenceChatMemberNumbersIndex - 1;
		else PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersIndex >= PreferenceChatMemberNumbersList.length - 1) ? 0 : PreferenceChatMemberNumbersIndex + 1;
		PreferenceChatMemberNumbersSelected = PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex];
		Player.ChatSettings.MemberNumbers = PreferenceChatMemberNumbersSelected;
	}

	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) {
		PreferenceSubscreen = "";
		PreferenceMainScreenLoad();
	}

}

// When the user clicks in the arousal preference subscreen
function PreferenceSubscreenArousalClick() {

	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) {
		PreferenceSubscreen = "";
		Player.FocusGroup = null;
		PreferenceMainScreenLoad();
	}

	// Arousal active control
    if ((MouseX >= 750) && (MouseX < 1200) && (MouseY >= 193) && (MouseY < 257)) {
        if (MouseX <= 975) PreferenceArousalActiveIndex = (PreferenceArousalActiveList.length + PreferenceArousalActiveIndex - 1) % PreferenceArousalActiveList.length;
        else PreferenceArousalActiveIndex = (PreferenceArousalActiveIndex + 1) % PreferenceArousalActiveList.length;
        Player.ArousalSettings.Active = PreferenceArousalActiveList[PreferenceArousalActiveIndex];
    }

	// Speech stuttering control
    if ((MouseX >= 900) && (MouseX < 1400) && (MouseY >= 393) && (MouseY < 457)) {
        if (MouseX <= 1150) PreferenceArousalAffectStutterIndex = (PreferenceArousalAffectStutterList.length + PreferenceArousalAffectStutterIndex - 1) % PreferenceArousalAffectStutterList.length;
        else PreferenceArousalAffectStutterIndex = (PreferenceArousalAffectStutterIndex + 1) % PreferenceArousalAffectStutterList.length;
        Player.ArousalSettings.AffectStutter = PreferenceArousalAffectStutterList[PreferenceArousalAffectStutterIndex];
    }

	// Show other player meter check box
	if ((MouseX >= 550) && (MouseX < 614) && (MouseY >= 286) && (MouseY < 350)) 
		Player.ArousalSettings.ShowOtherMeter = !Player.ArousalSettings.ShowOtherMeter;
	
	// If the arousal is active, we allow more controls
	if (PreferenceArousalIsActive()) {

		// Meter affect your facial expressions check box
		if ((MouseX >= 1250) && (MouseX < 1314) && (MouseY >= 286) && (MouseY < 350)) 
			Player.ArousalSettings.AffectExpression = !Player.ArousalSettings.AffectExpression;

		// Arousal visible control
		if ((MouseX >= 1505) && (MouseX < 1905) && (MouseY >= 193) && (MouseY <= 257)) {
			if (MouseX <= 1705) PreferenceArousalVisibleIndex = (PreferenceArousalVisibleList.length + PreferenceArousalVisibleIndex - 1) % PreferenceArousalVisibleList.length;
			else PreferenceArousalVisibleIndex = (PreferenceArousalVisibleIndex + 1) % PreferenceArousalVisibleList.length;
			Player.ArousalSettings.Visible = PreferenceArousalVisibleList[PreferenceArousalVisibleIndex];
		}

		// Arousal activity control
		if ((MouseX >= 900) && (MouseX < 1400) && (MouseY >= 493) && (MouseY <= 557)) {
			if (MouseX <= 1150) PreferenceArousalActivityIndex = (PreferenceArousalActivityList.length + PreferenceArousalActivityIndex - 1) % PreferenceArousalActivityList.length;
			else PreferenceArousalActivityIndex = (PreferenceArousalActivityIndex + 1) % PreferenceArousalActivityList.length;
			PreferenceLoadActivityFactor();
		}

		// Arousal activity love on self control
		if ((MouseX >= 900) && (MouseX < 1200) && (MouseY >= 593) && (MouseY <= 657)) {
			if (MouseX <= 1050) PreferenceArousalActivityFactorSelf = (5 + PreferenceArousalActivityFactorSelf - 1) % 5;
			else PreferenceArousalActivityFactorSelf = (PreferenceArousalActivityFactorSelf + 1) % 5;
			PreferenceSetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], true, PreferenceArousalActivityFactorSelf);
		}

		// Arousal activity love on other control
		if ((MouseX >= 1605) && (MouseX < 1905) && (MouseY >= 593) && (MouseY <= 657)) {
			if (MouseX <= 1755) PreferenceArousalActivityFactorOther = (5 + PreferenceArousalActivityFactorOther - 1) % 5;
			else PreferenceArousalActivityFactorOther = (PreferenceArousalActivityFactorOther + 1) % 5;
			PreferenceSetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], false, PreferenceArousalActivityFactorOther);
		}

		// Arousal zone love control
		if ((Player.FocusGroup != null) && (MouseX >= 550) && (MouseX < 1150) && (MouseY >= 793) && (MouseY < 857)) {
			if (MouseX <= 850) PreferenceArousalZoneFactor = (5 + PreferenceArousalZoneFactor - 1) % 5;
			else PreferenceArousalZoneFactor = (PreferenceArousalZoneFactor + 1) % 5;
			PreferenceSetZoneFactor(Player, Player.FocusGroup.Name, PreferenceArousalZoneFactor);
		}

		// Arousal zone orgasm check box
		if ((Player.FocusGroup != null) && (MouseX >= 1230) && (MouseX < 1294) && (MouseY >= 793) && (MouseY < 857))
			PreferenceSetZoneOrgasm(Player, Player.FocusGroup.Name, !PreferenceGetZoneOrgasm(Player, Player.FocusGroup.Name));

		// In arousal mode, the player can click on her zones
		for (var A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Zone != null) && (AssetGroup[A].Activity != null))
				for (var Z = 0; Z < AssetGroup[A].Zone.length; Z++)
					if (((Player.Pose.indexOf("Suspension") < 0) && (MouseX >= ((AssetGroup[A].Zone[Z][0] * 0.9) + 50)) && (MouseY >= (((AssetGroup[A].Zone[Z][1] - Player.HeightModifier) * 0.9) + 50)) && (MouseX <= (((AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) * 0.9) + 50)) && (MouseY <= (((AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3] - Player.HeightModifier) * 0.9) + 50)))
						|| ((Player.Pose.indexOf("Suspension") >= 0) && (MouseX >= ((AssetGroup[A].Zone[Z][0] * 0.9) + 50)) && (MouseY >= 0.9 * ((1000 - (AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3])) - Player.HeightModifier)) && (MouseX <= (((AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) * 0.9) + 50)) && (MouseY <= 0.9 * (1000 - ((AssetGroup[A].Zone[Z][1])) - Player.HeightModifier)))) {
						Player.FocusGroup = AssetGroup[A];
						PreferenceArousalZoneFactor = PreferenceGetZoneFactor(Player, AssetGroup[A].Name);
					}

	}
		
}

// When the user clicks in the security preference subscreen
function PreferenceSubscreenSecurityClick() {

	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) {
		PreferenceSubscreen = "";
		ElementRemove("InputEmailOld");
		ElementRemove("InputEmailNew");
		PreferenceMainScreenLoad();
	}

	// If we must update the email
	if ((MouseX >= 500) && (MouseX < 750) && (MouseY >= 365) && (MouseY < 415)) {
		var EmailOld = ElementValue("InputEmailOld");
		var EmailNew = ElementValue("InputEmailNew");
		var E = /^[a-zA-Z0-9@.!#$%&'*+/=?^_`{|}~-]+$/;
		if ((EmailOld.match(E) || (EmailOld == "")) && (EmailOld.length <= 100) && (EmailNew.match(E) || (EmailNew == "")) && (EmailNew.length <= 100))
			ServerSend("AccountUpdateEmail", { EmailOld: EmailOld, EmailNew: EmailNew });
		else
			ElementValue("InputEmailNew", TextGet("UpdateEmailInvalid"));
	}

}

// Handles the loading of the main preferences screen
function PreferenceMainScreenLoad() {
	ElementCreateInput("InputCharacterLabelColor", "text", Player.LabelColor);
}

// Handles the exiting of the main preferences screen
function PreferenceMainScreenExit() {
	ElementRemove("InputCharacterLabelColor");
}

// Return true if sensory deprivation is active
function PreferenceIsPlayerInSensDep() {
	return (Player.GameplaySettings && ((Player.GameplaySettings.SensDepChatLog == "SensDepNames") || (Player.GameplaySettings.SensDepChatLog == "SensDepTotal")) && (Player.Effect.indexOf("DeafHeavy") >= 0) && (Player.Effect.indexOf("BlindHeavy") >= 0));
}