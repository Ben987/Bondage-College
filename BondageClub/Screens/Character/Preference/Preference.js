"use strict";
var PreferenceBackground = "Sheet";
var PreferenceMessage = "";
var PreferenceSafewordConfirm = false;
var PreferenceMaidsButton = true;
var PreferenceColorPick = "";
var PreferenceSubscreen = "";
var PreferenceSubscreenList = ["General", "Difficulty", "Restriction", "Chat", "Audio", "Arousal", "Security", "Online", "Visibility", "Immersion", "Graphics", "Controller", "Notifications"];
var PreferencePageCurrent = 1;
var PreferenceChatColorThemeSelected = "";
var PreferenceChatColorThemeList = ["Light", "Dark", "Light2", "Dark2"];
var PreferenceChatColorThemeIndex = 0;
var PreferenceChatEnterLeaveSelected = "";
var PreferenceChatEnterLeaveList = ["Normal", "Smaller", "Hidden"];
var PreferenceChatEnterLeaveIndex = 0;
var PreferenceChatMemberNumbersSelected = "";
var PreferenceChatMemberNumbersList = ["Always", "Never", "OnMouseover"];
var PreferenceChatMemberNumbersIndex = 0;
var PreferenceSettingsSensDepList = ["SensDepLight", "Normal", "SensDepNames", "SensDepTotal", "SensDepExtreme"];
var PreferenceSettingsSensDepIndex = 0;
var PreferenceSettingsVFXList = ["VFXInactive", "VFXSolid", "VFXAnimatedTemp", "VFXAnimated"];
var PreferenceSettingsVFXIndex = 0;
var PreferenceSettingsVolumeList = [1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
var PreferenceSettingsSensitivityList = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var PreferenceSettingsDeadZoneList = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
var PreferenceSettingsVolumeIndex = 0;
var PreferenceSettingsSensitivityIndex = 13;
var PreferenceSettingsDeadZoneIndex = 1;
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
var PreferenceArousalFetishList = null;
var PreferenceArousalFetishIndex = 0;
var PreferenceArousalFetishFactor = 0;
var PreferenceVisibilityGroupList = [];
var PreferenceVisibilityGroupIndex = 0;
var PreferenceVisibilityAssetIndex = 0;
var PreferenceVisibilityHideChecked = false;
var PreferenceVisibilityBlockChecked = false;
var PreferenceVisibilityCanBlock = true;
var PreferenceVisibilityPreviewAsset = null;
var PreferenceVisibilityHiddenList = [];
var PreferenceVisibilityBlockList = [];
var PreferenceVisibilityResetClicked = false;
var PreferenceDifficultyLevel = null;
var PreferenceDifficultyAccept = false;
var PreferenceGraphicsFontList = ["Arial", "TimesNewRoman", "Papyrus", "ComicSans", "Impact", "HelveticaNeue", "Verdana", "CenturyGothic", "Georgia", "CourierNew", "Copperplate"];
var PreferenceGraphicsFontIndex = 0;
var PreferenceCalibrationStage = 0;

/**
 * Gets the effect of a sexual activity on the player
 * @param {Character} C - The player who performs the sexual activity
 * @param {string} Type - The type of the activity that is performed
 * @param {boolean} Self - Determines, if the current player is giving (false) or receiving (true)
 * @returns {number} - Returns the love factor of the activity for the character (0 is horrible, 2 is normal, 4 is great)
 */
function PreferenceGetActivityFactor(C, Type, Self) {
	var Factor = 2;
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Activity != null))
		for (let P = 0; P < C.ArousalSettings.Activity.length; P++)
			if (C.ArousalSettings.Activity[P].Name == Type)
				Factor = (Self) ? C.ArousalSettings.Activity[P].Self : C.ArousalSettings.Activity[P].Other;
	if ((Factor == null) || (typeof Factor !== "number") || (Factor < 0) || (Factor > 4)) Factor = 2;
	return Factor;
}

/**
 * Gets the factor of a fetish for the player
 * @param {Character} C - The character to query
 * @param {string} Type - The name of the fetish
 * @returns {number} - Returns the love factor of the fetish for the character (0 is horrible, 2 is normal, 4 is great)
 */
function PreferenceGetFetishFactor(C, Type) {
	var Factor = 2;
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Fetish != null))
		for (let F = 0; F < C.ArousalSettings.Fetish.length; F++)
			if (C.ArousalSettings.Fetish[F].Name == Type)
				Factor = C.ArousalSettings.Fetish[F].Factor;
	if ((Factor == null) || (typeof Factor !== "number") || (Factor < 0) || (Factor > 4)) Factor = 2;
	return Factor;
}

/**
 * Sets the love factor of a sexual activity for the character
 * @param {Character} C - The character for whom the activity factor should be set
 * @param {string} Type - The type of the activity that is performed
 * @param {boolean} Self - Determines, if the current player is giving (false) or receiving (true)
 * @param {number} Factor - The factor of the sexual activity (0 is horrible, 2 is normal, 4 is great)
 */
function PreferenceSetActivityFactor(C, Type, Self, Factor) {
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Activity != null))
		for (let P = 0; P < C.ArousalSettings.Activity.length; P++)
			if (C.ArousalSettings.Activity[P].Name == Type)
				if (Self) C.ArousalSettings.Activity[P].Self = Factor;
				else C.ArousalSettings.Activity[P].Other = Factor;
}

/**
 * Gets the love factor of a zone for the character
 * @param {Character} C - The character for whom the love factor of a particular zone should be gotten
 * @param {string} Zone - The name of the zone to get the love factor for
 * @returns {number} - Returns the love factor of a zone for the character (0 is horrible, 2 is normal, 4 is great)
 */
function PreferenceGetZoneFactor(C, Zone) {
	var Factor = 2;
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Zone != null))
		for (let Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
			if (C.ArousalSettings.Zone[Z].Name == Zone)
				Factor = C.ArousalSettings.Zone[Z].Factor;
	if ((Factor == null) || (typeof Factor !== "number") || (Factor < 0) || (Factor > 4)) Factor = 2;
	return Factor;
}

/**
 * Sets the love factor for a specific body zone on the player
 * @param {Character} C - The character, for whom the love factor of a particular zone should be set
 * @param {string} Zone - The name of the zone, the factor should be set for
 * @param {number} Factor - The factor of the zone (0 is horrible, 2 is normal, 4 is great)
 * @returns {void} - Nothing
 */
function PreferenceSetZoneFactor(C, Zone, Factor) {
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Zone != null))
		for (let Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
			if (C.ArousalSettings.Zone[Z].Name == Zone)
				C.ArousalSettings.Zone[Z].Factor = Factor;
}

/**
 * Determines, if a player can reach on orgasm from a particular zone
 * @param {Character} C - The character whose ability to orgasm we check
 * @param {string} Zone - The name of the zone to check
 * @returns {boolean} - Returns true if the zone allows orgasms for a character, false otherwise
 */
function PreferenceGetZoneOrgasm(C, Zone) {
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Zone != null))
		for (let Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
			if (C.ArousalSettings.Zone[Z].Name == Zone)
				return ((C.ArousalSettings.Zone[Z].Orgasm != null) && (typeof C.ArousalSettings.Zone[Z].Orgasm === "boolean") && C.ArousalSettings.Zone[Z].Orgasm);
	return false;
}

/**
 * Sets the ability to induce an orgasm for a given zone*
 * @param {Character} C - The characterfor whom we set the ability to órgasm from a given zone
 * @param {string} Zone - The name of the zone to set the ability to orgasm for
 * @param {boolean} CanOrgasm - Sets, if the character can cum from the given zone (true) or not (false)
 * @returns {void} - Nothing
 */
function PreferenceSetZoneOrgasm(C, Zone, CanOrgasm) {
	if ((C.ArousalSettings != null) && (C.ArousalSettings.Zone != null))
		for (let Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
			if (C.ArousalSettings.Zone[Z].Name == Zone)
				if (CanOrgasm) C.ArousalSettings.Zone[Z].Orgasm = true;
				else delete C.ArousalSettings.Zone[Z].Orgasm;
}

/**
 * Gets a color code for a given arousal factor
 * @param {number} Factor - The factor that should be translated in a color code
 * @returns {string} - The color for the given factor in the format "#rrggbbaa"
 */
function PreferenceGetFactorColor(Factor) {
	if (Factor == 0) return "#FF000088";
	if (Factor == 1) return "#FF000044";
	if (Factor == 3) return "#00FF0044";
	if (Factor == 4) return "#00FF0088";
	return "#80808044";
}

/**
 * Checks, if the arousal activity controls must be activated
 * @returns {boolean} - Returns true if we must activate the preference controls, false otherwise
 */
function PreferenceArousalIsActive() {
	return (PreferenceArousalActiveList[PreferenceArousalActiveIndex] != "Inactive");
}

/**
 * Loads the activity factor combo boxes based on the current activity selected
 * @returns {void} - Nothing
 */
function PreferenceLoadActivityFactor() {
	PreferenceArousalActivityFactorSelf = PreferenceGetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], true);
	PreferenceArousalActivityFactorOther = PreferenceGetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], false);
}

/**
 * Loads the fetish factor combo boxes based on the current fetish selected
 * @returns {void} - Nothing
 */
function PreferenceLoadFetishFactor() {
	PreferenceArousalFetishFactor = PreferenceGetFetishFactor(Player, PreferenceArousalFetishList[PreferenceArousalFetishIndex]);
}

/**
 * Initialize and validates the character settings
 * @param {Character} C - The character, whose preferences are initialized
 * @returns {void} - Nothing
 */
function PreferenceInit(C) {
	// Arousal settings
	if (!C.ArousalSettings) C.ArousalSettings = {};
	if (typeof C.ArousalSettings.Active !== "string") C.ArousalSettings.Active = "Hybrid";
	if (typeof C.ArousalSettings.Visible !== "string") C.ArousalSettings.Visible = "Access";
	if (typeof C.ArousalSettings.ShowOtherMeter !== "boolean") C.ArousalSettings.ShowOtherMeter = true;
	if (typeof C.ArousalSettings.AffectExpression !== "boolean") C.ArousalSettings.AffectExpression = true;
	if (typeof C.ArousalSettings.AffectStutter !== "string") C.ArousalSettings.AffectStutter = "All";
	if (typeof C.ArousalSettings.VFX !== "string") C.ArousalSettings.VFX = "VFXAnimatedTemp";
	if (typeof C.ArousalSettings.Progress !== "number" || isNaN(C.ArousalSettings.Progress)) C.ArousalSettings.Progress = 0;
	if (typeof C.ArousalSettings.ProgressTimer !== "number" || isNaN(C.ArousalSettings.ProgressTimer)) C.ArousalSettings.ProgressTimer = 0;
	if (typeof C.ArousalSettings.VibratorLevel !== "number" || isNaN(C.ArousalSettings.VibratorLevel)) C.ArousalSettings.VibratorLevel = 0;
	if (typeof C.ArousalSettings.ChangeTime !== "number" || isNaN(C.ArousalSettings.ChangeTime)) C.ArousalSettings.ChangeTime = CommonTime();
	if (!Array.isArray(C.ArousalSettings.Activity)) C.ArousalSettings.Activity = [];
	if (!Array.isArray(C.ArousalSettings.Zone)) C.ArousalSettings.Zone = [];
	if (!Array.isArray(C.ArousalSettings.Fetish)) C.ArousalSettings.Fetish = [];

	// Validates the player preference, they must match with the assets activities & zones, default factor is 2 (normal love)
	if (Player.AssetFamily == "Female3DCG") {

		// Validates the activities
		for (let A = 0; A < ActivityFemale3DCG.length; A++) {
			let Found = false;
			for (let P = 0; P < C.ArousalSettings.Activity.length; P++)
				if ((C.ArousalSettings.Activity[P] != null) && (C.ArousalSettings.Activity[P].Name != null) && (ActivityFemale3DCG[A].Name == C.ArousalSettings.Activity[P].Name)) {
					Found = true;
					if ((C.ArousalSettings.Activity[P].Self == null) || (typeof C.ArousalSettings.Activity[P].Self !== "number") || (C.ArousalSettings.Activity[P].Self < 0) || (C.ArousalSettings.Activity[P].Self > 4)) C.ArousalSettings.Activity[P].Self = 2;
					if ((C.ArousalSettings.Activity[P].Other == null) || (typeof C.ArousalSettings.Activity[P].Other !== "number") || (C.ArousalSettings.Activity[P].Other < 0) || (C.ArousalSettings.Activity[P].Other > 4)) C.ArousalSettings.Activity[P].Other = 2;
				}
			if (!Found) C.ArousalSettings.Activity.push({ Name: ActivityFemale3DCG[A].Name, Self: 2, Other: 2 });
		}

		// Validates the fetishes
		for (let A = 0; A < FetishFemale3DCG.length; A++) {
			let Found = false;
			for (let F = 0; F < C.ArousalSettings.Fetish.length; F++)
				if ((C.ArousalSettings.Fetish[F] != null) && (C.ArousalSettings.Fetish[F].Name != null) && (FetishFemale3DCG[A].Name == C.ArousalSettings.Fetish[F].Name)) {
					Found = true;
					if ((C.ArousalSettings.Fetish[F].Factor == null) || (typeof C.ArousalSettings.Fetish[F].Factor !== "number") || (C.ArousalSettings.Fetish[F].Factor < 0) || (C.ArousalSettings.Fetish[F].Factor > 4)) C.ArousalSettings.Fetish[F].Factor = 2;
				}
			if (!Found) C.ArousalSettings.Fetish.push({ Name: FetishFemale3DCG[A].Name, Factor: 2 });
		}

		// Validates the zones
		for (let A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Zone != null) && (AssetGroup[A].Activity != null)) {
				let Found = false;
				for (let Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
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
}

/**
 * Initialize and validates Player settings
 * @returns {void} - Nothing
 */
function PreferenceInitPlayer() {
	const C = Player;

	// Save settings for comparison
	const PrefBefore = {
		ArousalSettings: JSON.stringify(C.ArousalSettings) || "",
		ChatSettings: JSON.stringify(C.ChatSettings) || "",
		VisualSettings: JSON.stringify(C.VisualSettings) || "",
		AudioSettings: JSON.stringify(C.AudioSettings) || "",
		ControllerSettings: JSON.stringify(C.ControllerSettings) || "",
		GameplaySettings: JSON.stringify(C.GameplaySettings) || "",
		ImmersionSettings: JSON.stringify(C.ImmersionSettings) || "",
		RestrictionSettings: JSON.stringify(C.RestrictionSettings) || "",
		OnlineSettings: JSON.stringify(C.OnlineSettings) || "",
		OnlineSharedSettings: JSON.stringify(C.OnlineSharedSettings) || "",
		GraphicsSettings: JSON.stringify(C.GraphicsSettings) || "",
		NotificationSettings: JSON.stringify(C.NotificationSettings) || "",
	};

	// Non-player specific settings
	PreferenceInit(C);

	// If the settings aren't set before, construct them to replicate the default behavior

	// Chat settings
	if (!C.ChatSettings) C.ChatSettings = {};
	if (typeof C.ChatSettings.DisplayTimestamps !== "boolean") C.ChatSettings.DisplayTimestamps = true;
	if (typeof C.ChatSettings.ColorNames !== "boolean") C.ChatSettings.ColorNames = true;
	if (typeof C.ChatSettings.ColorActions !== "boolean") C.ChatSettings.ColorActions = true;
	if (typeof C.ChatSettings.ColorEmotes !== "boolean") C.ChatSettings.ColorEmotes = true;
	if (typeof C.ChatSettings.ShowActivities !== "boolean") C.ChatSettings.ShowActivities = true;
	if (typeof C.ChatSettings.ShowAutomaticMessages !== "boolean") C.ChatSettings.ShowAutomaticMessages = false;
	if (typeof C.ChatSettings.WhiteSpace !== "string") C.ChatSettings.WhiteSpace = "Preserve";
	if (typeof C.ChatSettings.ColorActivities !== "boolean") C.ChatSettings.ColorActivities = true;
	if (typeof C.ChatSettings.ShrinkNonDialogue !== "boolean") C.ChatSettings.ShrinkNonDialogue = false;


	// Visual settings
	if (!C.VisualSettings) C.VisualSettings = {};
	if (typeof C.VisualSettings.ForceFullHeight !== "boolean") C.VisualSettings.ForceFullHeight = false;

	// Audio settings
	if (!C.AudioSettings) C.AudioSettings = {};
	if (typeof C.AudioSettings.Volume !== "number") C.AudioSettings.Volume = 1;
	if (typeof C.AudioSettings.PlayBeeps !== "boolean") C.AudioSettings.PlayBeeps = false;
	if (typeof C.AudioSettings.PlayItem !== "boolean") C.AudioSettings.PlayItem = false;
	if (typeof C.AudioSettings.PlayItemPlayerOnly !== "boolean") C.AudioSettings.PlayItemPlayerOnly = false;
	if (typeof C.AudioSettings.Notifications !== "boolean") C.AudioSettings.Notifications = false;

	// Controller settings
	if (!C.ControllerSettings) C.ControllerSettings = {};
	if (typeof C.ControllerSettings.ControllerSensitivity !== "number") C.ControllerSettings.ControllerSensitivity = 5;
	if (typeof C.ControllerSettings.ControllerDeadZone !== "number") C.ControllerSettings.ControllerDeadZone = 0.01;
	if (typeof C.ControllerSettings.ControllerA !== "number") C.ControllerSettings.ControllerA = 1;
	if (typeof C.ControllerSettings.ControllerB !== "number") C.ControllerSettings.ControllerB = 0;
	if (typeof C.ControllerSettings.ControllerX !== "number") C.ControllerSettings.ControllerX = 3;
	if (typeof C.ControllerSettings.ControllerY !== "number") C.ControllerSettings.ControllerY = 2;
	if (typeof C.ControllerSettings.ControllerStickUpDown !== "number") C.ControllerSettings.ControllerStickUpDown = 1;
	if (typeof C.ControllerSettings.ControllerStickLeftRight !== "number") C.ControllerSettings.ControllerStickLeftRight = 0;
	if (typeof C.ControllerSettings.ControllerStickRight !== "number") C.ControllerSettings.ControllerStickRight = 1;
	if (typeof C.ControllerSettings.ControllerStickDown !== "number") C.ControllerSettings.ControllerStickDown = 1;
	if (typeof C.ControllerSettings.ControllerDPadUp !== "number") C.ControllerSettings.ControllerDPadUp = 4;
	if (typeof C.ControllerSettings.ControllerDPadDown !== "number") C.ControllerSettings.ControllerDPadDown = 5;
	if (typeof C.ControllerSettings.ControllerDPadLeft !== "number") C.ControllerSettings.ControllerDPadLeft = 6;
	if (typeof C.ControllerSettings.ControllerDPadRight !== "number") C.ControllerSettings.ControllerDPadRight = 7;
	if (typeof C.ControllerSettings.ControllerActive !== "boolean") C.ControllerSettings.ControllerActive = false;

	ControllerSensitivity = C.ControllerSettings.ControllerSensitivity;
	ControllerDeadZone = C.ControllerSettings.ControllerDeadZone;
	PreferenceSettingsSensitivityIndex = PreferenceSettingsSensitivityList.indexOf(Player.ControllerSettings.ControllerSensitivity);
	PreferenceSettingsDeadZoneIndex = PreferenceSettingsDeadZoneList.indexOf(Player.ControllerSettings.ControllerDeadZone);
	ControllerA = C.ControllerSettings.ControllerA;
	ControllerB = C.ControllerSettings.ControllerB;
	ControllerX = C.ControllerSettings.ControllerX;
	ControllerY = C.ControllerSettings.ControllerY;
	ControllerStickUpDown = C.ControllerSettings.ControllerStickUpDown;
	ControllerStickLeftRight = C.ControllerSettings.ControllerStickLeftRight;
	ControllerStickRight = C.ControllerSettings.ControllerStickRight;
	ControllerStickDown = C.ControllerSettings.ControllerStickDown;
	ControllerDPadUp = C.ControllerSettings.ControllerDPadUp;
	ControllerDPadDown = C.ControllerSettings.ControllerDPadDown;
	ControllerDPadLeft = C.ControllerSettings.ControllerDPadLeft;
	ControllerDPadRight = C.ControllerSettings.ControllerDPadRight;
	ControllerActive = C.ControllerSettings.ControllerActive;

	// Gameplay settings
	if (!C.GameplaySettings) C.GameplaySettings = {};
	if (typeof C.GameplaySettings.SensDepChatLog !== "string") C.GameplaySettings.SensDepChatLog = "Normal";
	if (typeof C.GameplaySettings.BlindDisableExamine !== "boolean") C.GameplaySettings.BlindDisableExamine = false;
	if (typeof C.GameplaySettings.DisableAutoRemoveLogin !== "boolean") C.GameplaySettings.DisableAutoRemoveLogin = false;
	if (typeof C.GameplaySettings.ImmersionLockSetting !== "boolean") C.GameplaySettings.ImmersionLockSetting = false;
	if (typeof C.GameplaySettings.EnableSafeword !== "boolean") C.GameplaySettings.EnableSafeword = true;
	if (typeof C.GameplaySettings.DisableAutoMaid !== "boolean") C.GameplaySettings.DisableAutoMaid = false;
	if (typeof C.GameplaySettings.OfflineLockedRestrained !== "boolean") C.GameplaySettings.OfflineLockedRestrained = false;

	// Immersion settings
	if (!C.ImmersionSettings) C.ImmersionSettings = {};
	if (typeof C.ImmersionSettings.BlockGaggedOOC !== "boolean") C.ImmersionSettings.BlockGaggedOOC = false;
	if (typeof C.ImmersionSettings.StimulationEvents !== "boolean") C.ImmersionSettings.StimulationEvents = true;
	if (typeof C.ImmersionSettings.ReturnToChatRoom !== "boolean") C.ImmersionSettings.ReturnToChatRoom = false;
	if (typeof C.ImmersionSettings.ReturnToChatRoomAdmin !== "boolean") C.ImmersionSettings.ReturnToChatRoomAdmin = false;
	if (typeof C.ImmersionSettings.SenseDepMessages !== "boolean") C.ImmersionSettings.SenseDepMessages = false;
	if (typeof C.ImmersionSettings.ChatRoomMuffle !== "boolean") C.ImmersionSettings.ChatRoomMuffle = false;

	// Misc
	if (typeof C.LastChatRoom !== "string") C.LastChatRoom = "";
	if (typeof C.LastChatRoomBG !== "string") C.LastChatRoomBG = "";
	if (typeof C.LastChatRoomPrivate !== "boolean") C.LastChatRoomPrivate = false;
	if (typeof C.LastChatRoomSize !== "number") C.LastChatRoomSize = 10;
	if (typeof C.LastChatRoomDesc !== "string") C.LastChatRoomDesc = "";
	if (!C.LastChatRoomAdmin) C.LastChatRoomAdmin = [];

	// Restriction settings
	if (!C.RestrictionSettings) C.RestrictionSettings = {};
	if (typeof C.RestrictionSettings.BypassStruggle !== "boolean") C.RestrictionSettings.BypassStruggle = false;
	if (typeof C.RestrictionSettings.SlowImmunity !== "boolean") C.RestrictionSettings.SlowImmunity = false;
	if (typeof C.RestrictionSettings.BypassNPCPunishments !== "boolean") C.RestrictionSettings.BypassNPCPunishments = false;

	// Online settings
	if (!C.OnlineSettings) C.OnlineSettings = {};
	if (typeof C.OnlineSettings.AutoBanBlackList !== "boolean") C.ChatSettings.AutoBanBlackList = false;
	if (typeof C.OnlineSettings.AutoBanGhostList !== "boolean") C.ChatSettings.AutoBanGhostList = true;
	if (typeof C.OnlineSettings.DisableAnimations !== "boolean") C.ChatSettings.DisableAnimations = false;
	if (typeof C.OnlineSettings.SearchShowsFullRooms !== "boolean") C.ChatSettings.SearchShowsFullRooms = true;
	if (typeof C.OnlineSettings.SearchFriendsFirst !== "boolean") C.ChatSettings.SearchFriendsFirst = false;
	if (typeof C.OnlineSettings.EnableAfkTimer !== "boolean") C.OnlineSettings.EnableAfkTimer = true;
	if (typeof C.OnlineSettings.EnableWardrobeIcon !== "boolean") C.OnlineSettings.EnableWardrobeIcon = false;

	// Onilne shared settings
	if (!C.OnlineSharedSettings) C.OnlineSharedSettings = {};
	if (typeof C.OnlineSharedSettings.AllowFullWardrobeAccess !== "boolean") C.OnlineSharedSettings.AllowFullWardrobeAccess = false;
	if (typeof C.OnlineSharedSettings.BlockBodyCosplay !== "boolean") C.OnlineSharedSettings.BlockBodyCosplay = false;
	if (typeof C.OnlineSharedSettings.AllowPlayerLeashing !== "boolean") C.OnlineSharedSettings.AllowPlayerLeashing = true;
	if (typeof C.OnlineSharedSettings.DisablePickingLocksOnSelf !== "boolean") C.OnlineSharedSettings.DisablePickingLocksOnSelf = false;
	if (C.OnlineSharedSettings.GameVersion !== GameVersion) {
		if (CommonCompareVersion(GameVersion, C.OnlineSharedSettings.GameVersion) < 0) {
			CommonVersionUpdated = true;
		}
		C.OnlineSharedSettings.GameVersion = GameVersion;
	}

	// Graphical settings
	if (!C.GraphicsSettings) C.GraphicsSettings = {};
	if (typeof C.GraphicsSettings.Font !== "string") C.GraphicsSettings.Font = "Arial";
	if (typeof C.GraphicsSettings.InvertRoom !== "boolean") C.GraphicsSettings.InvertRoom = true;
	if (typeof C.GraphicsSettings.StimulationFlashes !== "boolean") C.GraphicsSettings.StimulationFlashes = true;
	if (typeof C.GraphicsSettings.DoBlindFlash !== "boolean") C.GraphicsSettings.DoBlindFlash = false;

	// Notification settings
	let NS = C.NotificationSettings;
	if (!NS) NS = {};
	const defaultAudio = typeof NS.Audio === "boolean" && NS.Audio ? NotificationAudioType.FIRST : NotificationAudioType.NONE;
	if (typeof NS.Beeps !== "object") NS.Beeps = PreferenceInitNotificationSetting(NS.Beeps, defaultAudio, NotificationAlertType.POPUP);
	if (typeof NS.Chat !== "undefined") { NS.ChatMessage = NS.Chat; delete NS.Chat; }
	if (typeof NS.ChatMessage !== "object") NS.ChatMessage = PreferenceInitNotificationSetting(NS.ChatMessage, defaultAudio);
	if (typeof NS.ChatMessage.IncludeActions === "boolean") {
		// Convert old version of settings
		const chatMessagesEnabled = NS.ChatMessage.AlertType !== NotificationAudioType.NONE;
		NS.ChatMessage.Normal = chatMessagesEnabled;
		NS.ChatMessage.Whisper = chatMessagesEnabled;
		NS.ChatMessage.Activity = chatMessagesEnabled && NS.ChatMessage.IncludeActions;
		delete NS.ChatMessage.IncludeActions;
	}
	if (typeof NS.ChatMessage.Normal !== "boolean") NS.ChatMessage.Normal = true;
	if (typeof NS.ChatMessage.Whisper !== "boolean") NS.ChatMessage.Whisper = true;
	if (typeof NS.ChatMessage.Activity !== "boolean") NS.ChatMessage.Activity = false;
	if (typeof NS.ChatActions !== "undefined") delete NS.ChatActions;
	if (typeof NS.ChatJoin !== "object") NS.ChatJoin = PreferenceInitNotificationSetting(NS.ChatJoin, defaultAudio);
	if (typeof NS.ChatJoin.Enabled !== "undefined") {
		// Convert old version of settings
		NS.ChatJoin.AlertType = NS.ChatJoin.Enabled ? NotificationAlertType.TITLEPREFIX : NotificationAlertType.NONE;
		NS.ChatJoin.Audio = NotificationAudioType.NONE;
		delete NS.ChatJoin.Enabled;
	}
	if (typeof NS.ChatJoin.Owner !== "boolean") NS.ChatJoin.Owner = false;
	if (typeof NS.ChatJoin.Lovers !== "boolean") NS.ChatJoin.Lovers = false;
	if (typeof NS.ChatJoin.Friendlist !== "boolean") NS.ChatJoin.Friendlist = false;
	if (typeof NS.ChatJoin.Subs !== "boolean") NS.ChatJoin.Subs = false;
	if (typeof NS.Audio !== "undefined") delete NS.Audio;
	if (typeof NS.Disconnect !== "object") NS.Disconnect = PreferenceInitNotificationSetting(NS.Disconnect, defaultAudio);
	if (typeof NS.Larp !== "object") NS.Larp = PreferenceInitNotificationSetting(NS.Larp, defaultAudio, NotificationEventType.NONE);
	if (typeof NS.Test !== "object") NS.Test = PreferenceInitNotificationSetting(NS.Test, defaultAudio, NotificationAlertType.TITLEPREFIX);
	C.NotificationSettings = NS;

	// Forces some preferences depending on difficulty

	// Difficulty: non-Roleplay settings
	if (C.GetDifficulty() >= 1) {
		C.RestrictionSettings.BypassStruggle = false;
		C.RestrictionSettings.SlowImmunity = false;
		C.RestrictionSettings.BypassNPCPunishments = false;
	}

	// Difficulty: Hardcore settings
	if (C.GetDifficulty() >= 2) {
		C.GameplaySettings.EnableSafeword = false;
		C.GameplaySettings.DisableAutoMaid = true;
		C.GameplaySettings.OfflineLockedRestrained = true;
	}

	// Difficulty: Extreme settings
	if (C.GetDifficulty() >= 3) {
		PreferenceSettingsSensDepIndex = PreferenceSettingsSensDepList.length - 1;
		C.GameplaySettings.SensDepChatLog = PreferenceSettingsSensDepList[PreferenceSettingsSensDepIndex];
		C.GameplaySettings.BlindDisableExamine = true;
		C.GameplaySettings.DisableAutoRemoveLogin = true;
		C.GameplaySettings.ImmersionLockSetting = true;
		C.ImmersionSettings.BlockGaggedOOC = true;
		C.ImmersionSettings.StimulationEvents = true;
		C.ImmersionSettings.ReturnToChatRoom = true;
		C.ImmersionSettings.ReturnToChatRoomAdmin = true;
		C.ImmersionSettings.SenseDepMessages = true;
		C.ImmersionSettings.ChatRoomMuffle = true;
		C.OnlineSharedSettings.AllowPlayerLeashing = true;
	}

	// Enables the AFK timer for the current player only
	AfkTimerSetEnabled(C.OnlineSettings.EnableAfkTimer);

	// Sync settings if anything changed
	const toUpdate = {};

	for (const prop of Object.keys(PrefBefore))
		if (PrefBefore[prop] !== JSON.stringify(C[prop]))
			toUpdate[prop] = C[prop];

	if (Object.keys(toUpdate).length > 0) {
		ServerSend("AccountUpdate", toUpdate);
	}
}

/**
 * Initialise the Notifications settings, converting the old boolean types to objects
 * @param {object} setting - The old version of the setting
 * @param {NotificationAudioType} audio - The audio setting
 * @param {NotificationAlertType} [defaultAlertType] - The default AlertType to use
 * @returns {NotificationSetting} - The setting to use
 */
function PreferenceInitNotificationSetting(setting, audio, defaultAlertType) {
	const alertType = typeof setting === "boolean" && setting === true ? NotificationAlertType.TITLEPREFIX : defaultAlertType || NotificationAlertType.NONE;
	setting = {};
	setting.AlertType = alertType;
	setting.Audio = audio;
	return setting;
}

/**
 * Migrates a named preference from one preference object to another if not already migrated
 * @param {object} from - The preference object to migrate from
 * @param {object} to - The preference object to migrate to
 * @param {string} prefName - The name of the preference to migrate
 * @param {*} defaultValue - The default value for the preference if it doesn't exist
 * @returns {void} - Nothing
 */
function PreferenceMigrate(from, to, prefName, defaultValue) {
	if (to[prefName] == null) {
		to[prefName] = from[prefName];
		if (to[prefName] == null) to[prefName] = defaultValue;
		if (from[prefName] != null) delete from[prefName];
	}
}

/**
 * Loads the preference screen. This function is called dynamically, when the character enters the preference screen for the first time
 * @returns {void} - Nothing
 */
function PreferenceLoad() {

	// Sets up the player label color
	PreferenceDifficultyLevel = null;
	if (!CommonIsColor(Player.LabelColor)) Player.LabelColor = "#ffffff";
	PreferenceInitPlayer();

	// Sets the chat themes
	PreferenceChatColorThemeIndex = (PreferenceChatColorThemeList.indexOf(Player.ChatSettings.ColorTheme) < 0) ? 0 : PreferenceChatColorThemeList.indexOf(Player.ChatSettings.ColorTheme);
	PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveList.indexOf(Player.ChatSettings.EnterLeave) < 0) ? 0 : PreferenceChatEnterLeaveList.indexOf(Player.ChatSettings.EnterLeave);
	PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersList.indexOf(Player.ChatSettings.MemberNumbers) < 0) ? 0 : PreferenceChatMemberNumbersList.indexOf(Player.ChatSettings.MemberNumbers);
	PreferenceSettingsSensDepIndex = (PreferenceSettingsSensDepList.indexOf(Player.GameplaySettings.SensDepChatLog) < 0) ? 0 : PreferenceSettingsSensDepList.indexOf(Player.GameplaySettings.SensDepChatLog);
	PreferenceSettingsVolumeIndex = (PreferenceSettingsVolumeList.indexOf(Player.AudioSettings.Volume) < 0) ? 0 : PreferenceSettingsVolumeList.indexOf(Player.AudioSettings.Volume);
	PreferenceArousalActiveIndex = (PreferenceArousalActiveList.indexOf(Player.ArousalSettings.Active) < 0) ? 0 : PreferenceArousalActiveList.indexOf(Player.ArousalSettings.Active);
	PreferenceSettingsVFXIndex = (PreferenceSettingsVFXList.indexOf(Player.ArousalSettings.VFX) < 0) ? 0 : PreferenceSettingsVFXList.indexOf(Player.ArousalSettings.VFX);
	PreferenceArousalVisibleIndex = (PreferenceArousalVisibleList.indexOf(Player.ArousalSettings.Visible) < 0) ? 0 : PreferenceArousalVisibleList.indexOf(Player.ArousalSettings.Visible);
	PreferenceArousalAffectStutterIndex = (PreferenceArousalAffectStutterList.indexOf(Player.ArousalSettings.AffectStutter) < 0) ? 0 : PreferenceArousalAffectStutterList.indexOf(Player.ArousalSettings.AffectStutter);
	PreferenceChatColorThemeSelected = PreferenceChatColorThemeList[PreferenceChatColorThemeIndex];
	PreferenceChatEnterLeaveSelected = PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex];
	PreferenceChatMemberNumbersSelected = PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex];

	// Prepares the activity list
	PreferenceArousalActivityList = [];
	if (Player.AssetFamily == "Female3DCG")
		for (let A = 0; A < ActivityFemale3DCG.length; A++)
			PreferenceArousalActivityList.push(ActivityFemale3DCG[A].Name);
	PreferenceArousalActivityIndex = 0;
	PreferenceLoadActivityFactor();

	// Prepares the fetish list
	PreferenceArousalFetishList = [];
	if (Player.AssetFamily == "Female3DCG")
		for (let A = 0; A < FetishFemale3DCG.length; A++)
			PreferenceArousalFetishList.push(FetishFemale3DCG[A].Name);
	PreferenceArousalFetishIndex = 0;
	PreferenceLoadFetishFactor();

	// Sets the Players text font
	PreferenceGraphicsFontIndex = (PreferenceGraphicsFontList.indexOf(Player.GraphicsSettings.Font) < 0) ? 0 : PreferenceGraphicsFontList.indexOf(Player.GraphicsSettings.Font);

}

/**
 * Runs the preference screen. This function is called dynamically on a repeated basis.
 * So don't use complex loops or other function calls within this method
 * @returns {void} - Nothing
 */
function PreferenceRun() {

	// If a subscreen is active, draw that instead
	if (PreferenceSubscreen != "") return CommonDynamicFunction("PreferenceSubscreen" + PreferenceSubscreen + "Run()");

	// Draw the player & controls
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Preferences"), 500, 125, "Black", "Gray");
	MainCanvas.textAlign = "center";

	// Draw all the buttons to access the submenus
	for (let A = 0; A < PreferenceSubscreenList.length; A++) {
		ControllerIgnoreButton = true;
		DrawButton(500 + 420 * Math.floor(A / 7), 160 + 110 * (A % 7), 400, 90, "", "White", "Icons/" + PreferenceSubscreenList[A] + ".png");
		ControllerIgnoreButton = false;
		DrawTextFit(TextGet("Homepage" + PreferenceSubscreenList[A]), 745 + 420 * Math.floor(A / 7), 205 + 110 * (A % 7), 310, "Black");
		if (ControllerActive == true) {
			setButton(745 + 420 * Math.floor(A / 7), 205 + 110 * (A % 7));
		}
	}

}

/**
 * Handles click events in the preference screen that are propagated from CommonClick()
 * @returns {void} - Nothing
 */
function PreferenceSubscreenGeneralRun() {

	// Draw the online preferences
	MainCanvas.textAlign = "left";
	DrawText(TextGet("GeneralPreferences"), 500, 125, "Black", "Gray");
	if (PreferenceMessage != "") DrawText(TextGet(PreferenceMessage), 865, 125, "Red", "Black");
	DrawText(TextGet("CharacterLabelColor"), 500, 225, "Black", "Gray");
	ElementPosition("InputCharacterLabelColor", 990, 212, 250);
	if (CommonIsColor(ElementValue("InputCharacterLabelColor"))) document.getElementById("InputCharacterLabelColor").style.color = ElementValue("InputCharacterLabelColor");
	else document.getElementById("InputCharacterLabelColor").style.color = Player.LabelColor;
	document.getElementById("InputCharacterLabelColor").style.backgroundColor = "#000000";
	DrawButton(1140, 187, 65, 65, "", "White", "Icons/Color.png");
	DrawButton(500, 280, 90, 90, "", "White", "Icons/Next.png");
	DrawText(TextGet("ItemPermission") + " " + TextGet("PermissionLevel" + Player.ItemPermission.toString()), 615, 325, "Black", "Gray");

	// Checkboxes (Some are not available when playing on Hardcore or Extreme)
	DrawCheckbox(500, 402, 64, 64, TextGet("ForceFullHeight"), Player.VisualSettings.ForceFullHeight);
	DrawCheckbox(500, 482, 64, 64, TextGet("DisablePickingLocksOnSelf"), Player.OnlineSharedSettings.DisablePickingLocksOnSelf);
	if (Player.GetDifficulty() < 2) {
		DrawCheckbox(500, 722, 64, 64, TextGet(PreferenceSafewordConfirm ? "ConfirmSafeword" : "EnableSafeword"), Player.GameplaySettings.EnableSafeword);
		DrawCheckbox(500, 562, 64, 64, TextGet("DisableAutoMaid"), !Player.GameplaySettings.DisableAutoMaid);
		DrawCheckbox(500, 642, 64, 64, TextGet("OfflineLockedRestrained"), Player.GameplaySettings.OfflineLockedRestrained);
	} else DrawText(TextGet("GeneralHardcoreWarning"), 500, 622, "Red", "Gray");

	// Draw the player & controls
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (PreferenceColorPick != "")
		ColorPickerDraw(1250, 185, 675, 830, document.getElementById(PreferenceColorPick));
	else
		ColorPickerHide();

	MainCanvas.textAlign = "center";
}

/**
 * Runs and draw the preference screen, difficulty subscreen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenDifficultyRun() {

	// Draw the character and the controls
	MainCanvas.textAlign = "left";
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawText(TextGet("DifficultyPreferences"), 500, 125, "Black", "Gray");

	// When no level is selected, we allow to select one
	if (PreferenceDifficultyLevel == null) {

		// Draw the difficulty levels
		DrawText(TextGet("DifficultyTitle"), 500, 225, "Black", "Gray");
		for (let D = 0; D <= 3; D++) {
			DrawText(TextGet("DifficultySummary" + D.toString() + "A"), 850, 325 + 150 * D, 1050, 120, "Black", "White");
			DrawText(TextGet("DifficultySummary" + D.toString() + "B"), 850, 375 + 150 * D, 1050, 120, "Black", "White");
		}

		// Draw the difficulty buttons
		MainCanvas.textAlign = "center";
		for (let D = 0; D <= 3; D++)
			DrawButton(500, 320 + 150 * D, 300, 64, TextGet("DifficultyLevel" + D.toString()), (D == Player.GetDifficulty()) ? "#DDFFDD" : "White", "");

	} else {

		// Draw the detailed texts
		for (let T = 0; T <= 4; T++)
			DrawText(TextGet("Difficulty" + PreferenceDifficultyLevel.toString() + "Text" + T.toString()), 500, 225 + 100 * T, 1050, 120, "Black", "White");

		// Can only set to 2 or 3 if no change was done for 1 week
		if (PreferenceDifficultyLevel != Player.GetDifficulty()) {
			var LastChange = ((Player.Difficulty == null) || (Player.Difficulty.LastChange == null) || (typeof Player.Difficulty.LastChange !== "number")) ? Player.Creation : Player.Difficulty.LastChange;
			if ((PreferenceDifficultyLevel <= 1) || (LastChange + 604800000 < CurrentTime)) {
				DrawCheckbox(500, 700, 64, 64, TextGet("DifficultyIAccept"), PreferenceDifficultyAccept);
				MainCanvas.textAlign = "center";
				DrawButton(500, 825, 300, 64, TextGet("DifficultyChangeMode") + " " + TextGet("DifficultyLevel" + PreferenceDifficultyLevel.toString()), PreferenceDifficultyAccept ? "White" : "#ebebe4", "");
			} else DrawText(TextGet("DifficultyWaitSevenDays").replace("NumberOfHours", Math.ceil((LastChange + 604800000 - CurrentTime) / 3600000).toString()), 500, 825, 1050, 120, "Black", "White");
		} else DrawText(TextGet("DifficultyAlreadyPlayingOn"), 500, 825, 1050, 120, "Black", "White");
		MainCanvas.textAlign = "center";

	}

}

/**
 * Runs and draw the preference screen, restriction subscreen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenRestrictionRun() {

	// Draw the character and the controls
	MainCanvas.textAlign = "left";
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawText(TextGet("RestrictionPreferences"), 500, 125, "Black", "Gray");
	const disableButtons = Player.GetDifficulty() > 0;
	DrawText(TextGet(disableButtons ? "RestrictionNoAccess" : "RestrictionAccess"), 500, 225, "Black", "Gray");
	DrawCheckbox(500, 325, 64, 64, TextGet("RestrictionBypassStruggle"), Player.RestrictionSettings.BypassStruggle && !disableButtons, disableButtons);
	DrawCheckbox(500, 425, 64, 64, TextGet("RestrictionSlowImmunity"), Player.RestrictionSettings.SlowImmunity && !disableButtons, disableButtons);
	DrawCheckbox(500, 525, 64, 64, TextGet("RestrictionBypassNPCPunishments"), Player.RestrictionSettings.BypassNPCPunishments && !disableButtons, disableButtons);
	MainCanvas.textAlign = "center";
}

/**
 * Handles click events in the preference screen that are propagated from CommonClick()
 * @returns {void} - Nothing
 */
function PreferenceClick() {
	if (ControllerActive == true) {
		ClearButtons();
	}
	// Pass the click into the opened subscreen
	if (PreferenceSubscreen != "") return CommonDynamicFunction("PreferenceSubscreen" + PreferenceSubscreen + "Click()");

	// Exit button
	if (MouseIn(1815, 75, 90, 90)) PreferenceExit();

	// Open the selected subscreen
	for (let A = 0; A < PreferenceSubscreenList.length; A++)
		if (MouseIn(500 + 500 * Math.floor(A / 7), 160 + 110 * (A % 7), 400, 90)) {
			if (typeof window["PreferenceSubscreen" + PreferenceSubscreenList[A] + "Load"] === "function")
				CommonDynamicFunction("PreferenceSubscreen" + PreferenceSubscreenList[A] + "Load()");
			PreferenceSubscreen = PreferenceSubscreenList[A];
			PreferencePageCurrent = 1;
			break;
		}

}

/**
 * Handles the click events in the preference screen, general sub-screen, propagated from CommonClick()
 * @returns {void} - Nothing
 */
function PreferenceSubscreenGeneralClick() {

	// If the user clicks on "Exit"
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreenGeneralExit();

	// If we must change the restrain permission level
	if (MouseIn(500, 280, 90, 90)) {
		Player.ItemPermission++;
		if (Player.ItemPermission > 5) Player.ItemPermission = 0;
		if (Player.GetDifficulty() >= 3) LoginExtremeItemSettings();
	}

	// If we must show/hide/use the color picker
	if (MouseIn(1140, 187, 65, 65)) PreferenceColorPick = (PreferenceColorPick != "InputCharacterLabelColor") ? "InputCharacterLabelColor" : "";
	if (MouseIn(1815, 75, 90, 90) && (PreferenceColorPick != "")) PreferenceColorPick = "";

	// Preference check boxes
	if (MouseIn(500, 402, 64, 64)) Player.VisualSettings.ForceFullHeight = !Player.VisualSettings.ForceFullHeight;
	if (MouseIn(500, 482, 64, 64) ) Player.OnlineSharedSettings.DisablePickingLocksOnSelf = !Player.OnlineSharedSettings.DisablePickingLocksOnSelf;
	if (MouseIn(500, 722, 64, 64) && (Player.GetDifficulty() < 2)) {
		if (!Player.GameplaySettings.EnableSafeword && !Player.IsRestrained() && !Player.IsChaste()) {
			if (PreferenceSafewordConfirm) {
				Player.GameplaySettings.EnableSafeword = true;
				PreferenceSafewordConfirm = false;
			} else PreferenceSafewordConfirm = true;
		} else if (Player.GameplaySettings.EnableSafeword) {
			if (PreferenceSafewordConfirm) {
				Player.GameplaySettings.EnableSafeword = false;
				PreferenceSafewordConfirm = false;
			} else PreferenceSafewordConfirm = true;
		}
	} else PreferenceSafewordConfirm = false;
	if (MouseIn(500, 562, 64, 64) && (Player.GetDifficulty() < 2)) Player.GameplaySettings.DisableAutoMaid = !Player.GameplaySettings.DisableAutoMaid;
	if (MouseIn(500, 642, 64, 64) && (Player.GetDifficulty() < 2)) Player.GameplaySettings.OfflineLockedRestrained = !Player.GameplaySettings.OfflineLockedRestrained;
}

/**
 * Handles the click events in the preference screen, difficulty sub-screen, propagated from CommonClick()
 * @returns {void} - Nothing
 */
function PreferenceSubscreenDifficultyClick() {

	// When no level is selected, the user can pick one to go into details
	if (PreferenceDifficultyLevel == null) {
		PreferenceDifficultyAccept = false;
		if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreenDifficultyExit();
		for (let D = 0; D <= 3; D++)
			if (MouseIn(500, 320 + 150 * D, 300, 64))
				PreferenceDifficultyLevel = D;
	} else {

		// If a level is selected, the user must check to confirm
		if (MouseIn(1815, 75, 90, 90)) PreferenceDifficultyLevel = null;
		if (PreferenceDifficultyLevel != Player.GetDifficulty()) {
			var LastChange = ((Player.Difficulty == null) || (Player.Difficulty.LastChange == null) || (typeof Player.Difficulty.LastChange !== "number")) ? Player.Creation : Player.Difficulty.LastChange;
			if ((PreferenceDifficultyLevel <= 1) || (LastChange + 604800000 < CurrentTime)) {
				if (MouseIn(500, 700, 64, 64)) PreferenceDifficultyAccept = !PreferenceDifficultyAccept;
				if (MouseIn(500, 825, 300, 64) && PreferenceDifficultyAccept) {
					Player.Difficulty = { LastChange: CurrentTime, Level: PreferenceDifficultyLevel };
					ServerSend("AccountDifficulty", PreferenceDifficultyLevel);
					PreferenceInitPlayer();
					LoginDifficulty();
					PreferenceDifficultyLevel = null;
					PreferenceSubscreenDifficultyExit();
				}
			}
		}

	}

}

/**
 * Handles the click events in the preference screen, restriction sub-screen, propagated from CommonClick()
 * @returns {void} - Nothing
 */
function PreferenceSubscreenRestrictionClick() {
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreenDifficultyExit();
	if (MouseIn(500, 325, 64, 64) && (Player.GetDifficulty() == 0)) Player.RestrictionSettings.BypassStruggle = !Player.RestrictionSettings.BypassStruggle;
	if (MouseIn(500, 425, 64, 64) && (Player.GetDifficulty() == 0)) Player.RestrictionSettings.SlowImmunity = !Player.RestrictionSettings.SlowImmunity;
	if (MouseIn(500, 525, 64, 64) && (Player.GetDifficulty() == 0)) Player.RestrictionSettings.BypassNPCPunishments = !Player.RestrictionSettings.BypassNPCPunishments;
}

/**
 * Runs and draws the preference screen, immersion sub-screen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenImmersionRun() {

	// Draw the player & base controls
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (PreferenceMessage != "") DrawText(TextGet(PreferenceMessage), 865, 125, "Red", "Black");
	//PreferencePageChangeDraw(1595, 75, 2); // Uncomment when adding a 2nd page
	MainCanvas.textAlign = "left";
	DrawText(TextGet("ImmersionPreferences"), 500, 125, "Black", "Gray");

	const disableButtons = Player.GetDifficulty() > 2 || (Player.GameplaySettings.ImmersionLockSetting && Player.IsRestrained());
	if (Player.GetDifficulty() <= 2) {
		DrawCheckbox(500, 172, 64, 64, TextGet("ImmersionLockSetting"), Player.GameplaySettings.ImmersionLockSetting, disableButtons);
	} else {
		// Cannot change any value under the Extreme difficulty mode
		DrawText(TextGet("ImmersionLocked"), 500, 205, "Red", "Gray");
	}
	DrawEmptyRect(500, 255, 1400, 0, "Black", 1);

	if (PreferencePageCurrent === 1) {
		DrawText(TextGet("SensDepSetting"), 800, 308, "Black", "Gray");
		DrawCheckbox(500, 352, 64, 64, TextGet("BlindDisableExamine"), Player.GameplaySettings.BlindDisableExamine, disableButtons);
		DrawCheckbox(500, 432, 64, 64, TextGet("DisableAutoRemoveLogin"), Player.GameplaySettings.DisableAutoRemoveLogin, disableButtons);
		DrawCheckbox(500, 512, 64, 64, TextGet("BlockGaggedOOC"), Player.ImmersionSettings.BlockGaggedOOC, disableButtons);
		DrawCheckbox(500, 592, 64, 64, TextGet("AllowPlayerLeashing"), Player.OnlineSharedSettings.AllowPlayerLeashing, disableButtons);
		DrawCheckbox(500, 672, 64, 64, TextGet("ReturnToChatRoom"), Player.ImmersionSettings.ReturnToChatRoom, disableButtons);
		const returnToRoomEnabled = Player.ImmersionSettings.ReturnToChatRoom;
		DrawCheckbox(1300, 672, 64, 64, TextGet("ReturnToChatRoomAdmin"), returnToRoomEnabled && Player.ImmersionSettings.ReturnToChatRoomAdmin, !returnToRoomEnabled || disableButtons);
		DrawCheckbox(500, 752, 64, 64, TextGet("StimulationEvents"), Player.ImmersionSettings.StimulationEvents, disableButtons);
		DrawCheckbox(500, 832, 64, 64, TextGet("ChatRoomMuffle"), Player.ImmersionSettings.ChatRoomMuffle, disableButtons);
		const canHideMessages = Player.GameplaySettings.SensDepChatLog !== "SensDepLight";
		DrawCheckbox(1300, 272, 64, 64, TextGet("SenseDepMessages"), canHideMessages && Player.ImmersionSettings.SenseDepMessages, !canHideMessages || disableButtons);
		MainCanvas.textAlign = "center";

		DrawBackNextButton(500, 272, 250, 64, TextGet(Player.GameplaySettings.SensDepChatLog), "White", "",
			() => disableButtons ? "" : TextGet(PreferenceSettingsSensDepList[(PreferenceSettingsSensDepIndex + PreferenceSettingsSensDepList.length - 1) % PreferenceSettingsSensDepList.length]),
			() => disableButtons ? "" : TextGet(PreferenceSettingsSensDepList[(PreferenceSettingsSensDepIndex + 1) % PreferenceSettingsSensDepList.length]));
	}
	else if (PreferencePageCurrent === 2) {
		// New settings here
	}

	MainCanvas.textAlign = "center";
}

/**
 * Handles the click events in the preference screen, immersion sub-screen, propagated from CommonClick()
 * @returns {void} - Nothing
 */
function PreferenceSubscreenImmersionClick() {

	// If the user clicks on "Exit"
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreen = "";
	// Change page
	//PreferencePageChangeClick(1595, 75, 2); // Uncomment when adding a 2nd page

	// Cannot change any value under the Extreme difficulty mode
	if (Player.GetDifficulty() <= 2 && (!Player.GameplaySettings.ImmersionLockSetting || (!Player.IsRestrained()))) {
		if (PreferencePageCurrent === 1) {
			// If we must change sens dep settings
			if (MouseIn(500, 272, 250, 64)) {
				if (MouseX <= 625) PreferenceSettingsSensDepIndex = (PreferenceSettingsSensDepList.length + PreferenceSettingsSensDepIndex - 1) % PreferenceSettingsSensDepList.length;
				else PreferenceSettingsSensDepIndex = (PreferenceSettingsSensDepIndex + 1) % PreferenceSettingsSensDepList.length;
				Player.GameplaySettings.SensDepChatLog = PreferenceSettingsSensDepList[PreferenceSettingsSensDepIndex];
				if (Player.GameplaySettings.SensDepChatLog == "SensDepExtreme") ChatRoomSetTarget(null);
			}

			// Preference check boxes
			if (MouseIn(500, 172, 64, 64)) Player.GameplaySettings.ImmersionLockSetting = !Player.GameplaySettings.ImmersionLockSetting;
			if (MouseIn(500, 352, 64, 64)) Player.GameplaySettings.BlindDisableExamine = !Player.GameplaySettings.BlindDisableExamine;
			if (MouseIn(500, 432, 64, 64)) Player.GameplaySettings.DisableAutoRemoveLogin = !Player.GameplaySettings.DisableAutoRemoveLogin;
			if (MouseIn(500, 512, 64, 64)) {
				Player.ImmersionSettings.BlockGaggedOOC = !Player.ImmersionSettings.BlockGaggedOOC;
				if (Player.ImmersionSettings.BlockGaggedOOC) ChatRoomSetTarget(null);
			}
			if (MouseIn(500, 592, 64, 64)) Player.OnlineSharedSettings.AllowPlayerLeashing = !Player.OnlineSharedSettings.AllowPlayerLeashing;
			if (MouseIn(500, 672, 64, 64)) Player.ImmersionSettings.ReturnToChatRoom = !Player.ImmersionSettings.ReturnToChatRoom;
			if (MouseIn(1300, 672, 64, 64) && Player.ImmersionSettings.ReturnToChatRoom)
				Player.ImmersionSettings.ReturnToChatRoomAdmin = !Player.ImmersionSettings.ReturnToChatRoomAdmin;
			if (MouseIn(500, 752, 64, 64)) Player.ImmersionSettings.StimulationEvents = !Player.ImmersionSettings.StimulationEvents;
			if (MouseIn(500, 832, 64, 64)) Player.ImmersionSettings.ChatRoomMuffle = !Player.ImmersionSettings.ChatRoomMuffle;
			if (MouseIn(1300, 272, 64, 64) && Player.GameplaySettings.SensDepChatLog !== "SensDepLight")
				Player.ImmersionSettings.SenseDepMessages = !Player.ImmersionSettings.SenseDepMessages;
		}
		else if (PreferencePageCurrent === 2) {
			// New settings here
		}
	}

}

/**
 * Is called when the player exits the preference screen. All settings of the preference screen are sent to the server.
 * If the player is in a subscreen, they exit to the main preferences menu instead.
 * @returns {void} - Nothing
 */
function PreferenceExit() {
	if (PreferenceSubscreen !== "") {
		// Exit the subscreen to the main preferences menu
		if (typeof window["PreferenceSubscreen" + PreferenceSubscreen + "Exit"] === "function") {
			window["PreferenceSubscreen" + PreferenceSubscreen + "Exit"]();
		}
		else {
			PreferenceMessage = "";
			PreferenceSubscreen = "";
		}
	} else {
		// Exit the preference menus
		const P = {
			ArousalSettings: Player.ArousalSettings,
			ChatSettings: Player.ChatSettings,
			VisualSettings: Player.VisualSettings,
			AudioSettings: Player.AudioSettings,
			ControllerSettings: Player.ControllerSettings,
			GameplaySettings: Player.GameplaySettings,
			ImmersionSettings: Player.ImmersionSettings,
			RestrictionSettings: Player.RestrictionSettings,
			OnlineSettings: Player.OnlineSettings,
			OnlineSharedSettings: Player.OnlineSharedSettings,
			GraphicsSettings: Player.GraphicsSettings,
			NotificationSettings: Player.NotificationSettings,
			ItemPermission: Player.ItemPermission,
			LabelColor: Player.LabelColor,
			LimitedItems: CommonPackItemArray(Player.LimitedItems),
		};
		ServerSend("AccountUpdate", P);
		PreferenceMessage = "";
		CommonSetScreen("Character", "InformationSheet");
	}
}

/**
 * Sets the audio preferences for the player. Redirected to from the main Run function if the player is in the audio settings subscreen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenAudioRun() {
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("AudioPreferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("AudioVolume"), 800, 225, "Black", "Gray");
	DrawCheckbox(500, 272, 64, 64, TextGet("AudioPlayBeeps"), Player.AudioSettings.PlayBeeps);
	DrawCheckbox(500, 352, 64, 64, TextGet("AudioPlayItem"), Player.AudioSettings.PlayItem);
	DrawCheckbox(500, 432, 64, 64, TextGet("AudioPlayItemPlayerOnly"), Player.AudioSettings.PlayItemPlayerOnly);
	DrawCheckbox(500, 512, 64, 64, TextGet("AudioNotifications"), Player.AudioSettings.Notifications);
	MainCanvas.textAlign = "center";
	DrawBackNextButton(500, 193, 250, 64, Player.AudioSettings.Volume * 100 + "%", "White", "",
		() => PreferenceSettingsVolumeList[(PreferenceSettingsVolumeIndex + PreferenceSettingsVolumeList.length - 1) % PreferenceSettingsVolumeList.length] * 100 + "%",
		() => PreferenceSettingsVolumeList[(PreferenceSettingsVolumeIndex + 1) % PreferenceSettingsVolumeList.length] * 100 + "%");
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

/**
 * Sets the audio preferences for the player. Redirected to from the main Run function if the player is in the audio settings subscreen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenControllerRun() {
	if (PreferenceCalibrationStage == 0) {
		DrawCharacter(Player, 50, 50, 0.9);
		MainCanvas.textAlign = "left";
		DrawText(TextGet("ControllerPreferences"), 500, 125, "Black", "Gray");
		DrawText(TextGet("Sensitivity"), 800, 225, "Black", "Gray");
		DrawText(TextGet("DeadZone"), 800, 625, "Black", "Gray");
		DrawCheckbox(500, 272, 64, 64, TextGet("ControllerActive"), ControllerActive);

		DrawButton(500, 380, 400, 90, "", "White");
		DrawTextFit(TextGet("MapButtons"), 590, 425, 310, "Black");

		DrawButton(500, 480, 400, 90, "", "White");
		DrawTextFit(TextGet("MapSticks"), 590, 525, 310, "Black");

		MainCanvas.textAlign = "center";
		DrawBackNextButton(500, 193, 250, 64, Player.ControllerSettings.ControllerSensitivity, "White", "",
			() => PreferenceSettingsSensitivityList[(PreferenceSettingsSensitivityIndex + PreferenceSettingsSensitivityList.length - 1) % PreferenceSettingsSensitivityList.length],
			() => PreferenceSettingsSensitivityList[(PreferenceSettingsSensitivityIndex + 1) % PreferenceSettingsSensitivityList.length]);
		MainCanvas.textAlign = "center";
		DrawBackNextButton(500, 593, 250, 64, Player.ControllerSettings.ControllerDeadZone, "White", "",
			() => PreferenceSettingsDeadZoneList[(PreferenceSettingsDeadZoneIndex + PreferenceSettingsDeadZoneList.length - 1) % PreferenceSettingsDeadZoneList.length],
			() => PreferenceSettingsDeadZoneList[(PreferenceSettingsDeadZoneIndex + 1) % PreferenceSettingsDeadZoneList.length] );
	}
	if (PreferenceCalibrationStage == 101) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("MoveLeftStickUp"), 590, 425, 310, "Black");
	}
	if (PreferenceCalibrationStage == 102) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("MoveLeftStickRight"), 590, 425, 310, "Black");
	}
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (PreferenceCalibrationStage == 1) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("PressA"), 590, 425, 310, "Black");
	}
	if (PreferenceCalibrationStage == 2) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("PressB"), 590, 425, 310, "Black");
	}
	if (PreferenceCalibrationStage == 3) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("PressX"), 590, 425, 310, "Black");
	}
	if (PreferenceCalibrationStage == 4) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("PressY"), 590, 425, 310, "Black");
	}
	if (PreferenceCalibrationStage == 5) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("PressUpOnDpad"), 590, 425, 310, "Black");
	}
	if (PreferenceCalibrationStage == 6) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("PressDownOnDpad"), 590, 425, 310, "Black");
	}
	if (PreferenceCalibrationStage == 7) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("PressLeftOnDpad"), 590, 425, 310, "Black");
	}
	if (PreferenceCalibrationStage == 8) {
		MainCanvas.textAlign = "left";
		DrawTextFit(TextGet("PressRightOnDpad"), 590, 425, 310, "Black");
	}
	MainCanvas.textAlign = "center";
}

/**
 * Sets the chat preferences for the player. Redirected to from the main Run function if the player is in the chat settings subscreen.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenChatRun() {
	MainCanvas.textAlign = "left";
	DrawText(TextGet("ChatPreferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("ColorTheme"), 500, 225, "Black", "Gray");
	DrawText(TextGet("EnterLeaveStyle"), 500, 325, "Black", "Gray");
	DrawText(TextGet("DisplayMemberNumbers"), 500, 425, "Black", "Gray");
	DrawCheckbox(500, 492, 64, 64, TextGet("DisplayTimestamps"), Player.ChatSettings.DisplayTimestamps);
	DrawCheckbox(500, 572, 64, 64, TextGet("ColorNames"), Player.ChatSettings.ColorNames);
	DrawCheckbox(500, 652, 64, 64, TextGet("ColorActions"), Player.ChatSettings.ColorActions);
	DrawCheckbox(500, 732, 64, 64, TextGet("ColorEmotes"), Player.ChatSettings.ColorEmotes);
	DrawCheckbox(500, 812, 64, 64, TextGet("ShowActivities"), Player.ChatSettings.ShowActivities);
	DrawCheckbox(1200, 492, 64, 64, TextGet("ShowAutomaticMessages"), Player.ChatSettings.ShowAutomaticMessages);
	DrawCheckbox(1200, 572, 64, 64, TextGet("PreserveWhitespace"), Player.ChatSettings.WhiteSpace == "Preserve");
	DrawCheckbox(1200, 652, 64, 64, TextGet("ColorActivities"), Player.ChatSettings.ColorActivities);
	DrawCheckbox(1200, 732, 64, 64, TextGet("ShrinkNonDialogue"), Player.ChatSettings.ShrinkNonDialogue);
	
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
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawCharacter(Player, 50, 50, 0.9);
}

/**
 * Sets the online preferences for the player. Redirected to from the main Run function if the player is in the online settings subscreen.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenOnlineRun() {
	MainCanvas.textAlign = "left";
	DrawText(TextGet("OnlinePreferences"), 500, 125, "Black", "Gray");
	DrawCheckbox(500, 172, 64, 64, TextGet("AutoBanBlackList"), Player.OnlineSettings.AutoBanBlackList);
	DrawCheckbox(500, 255, 64, 64, TextGet("AutoBanGhostList"), Player.OnlineSettings.AutoBanGhostList);
	DrawCheckbox(500, 335, 64, 64, TextGet("SearchShowsFullRooms"), Player.OnlineSettings.SearchShowsFullRooms);
	DrawCheckbox(500, 415, 64, 64, TextGet("SearchFriendsFirst"), Player.OnlineSettings.SearchFriendsFirst);
	DrawCheckbox(500, 495, 64, 64, TextGet("DisableAnimations"), Player.OnlineSettings.DisableAnimations);
	DrawCheckbox(500, 575, 64, 64, TextGet("EnableAfkTimer"), Player.OnlineSettings.EnableAfkTimer);
	DrawCheckbox(500, 655, 64, 64, TextGet("EnableWardrobeIcon"), Player.OnlineSettings.EnableWardrobeIcon);
	DrawCheckbox(500, 735, 64, 64, TextGet("AllowFullWardrobeAccess"), Player.OnlineSharedSettings.AllowFullWardrobeAccess);
	DrawCheckbox(500, 815, 64, 64, TextGet("BlockBodyCosplay"), Player.OnlineSharedSettings.BlockBodyCosplay);

	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "center";
}

/**
 * Sets the arousal preferences for a player. Redirected to from the main Run function if the player is in the arousal settings subscreen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenArousalRun() {

	// Draws the main labels and player
	DrawCharacter(Player, 50, 50, 0.9, false);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("ArousalPreferences"), 550, 125, "Black", "Gray");
	DrawText(TextGet("ArousalActive"), 550, 225, "Black", "Gray");
	DrawText(TextGet("ArousalStutter"), 550, 410, "Black", "Gray");
	DrawCheckbox(550, 286, 64, 64, TextGet("ArousalShowOtherMeter"), Player.ArousalSettings.ShowOtherMeter);

	// The other controls are only drawn if the arousal is active
	if (PreferenceArousalIsActive()) {

		// Draws the labels and check boxes
		DrawCheckbox(1250, 286, 64, 64, TextGet("ArousalAffectExpression"), Player.ArousalSettings.AffectExpression);
		DrawText(TextGet("ArousalVisible"), 1240, 225, "Black", "Gray");
		DrawText(TextGet("ArousalFetish"), 550, 495, "Black", "Gray");
		DrawText(TextGet("ArousalActivity"), 550, 580, "Black", "Gray");
		DrawText(TextGet("ArousalActivityLoveSelf"), 550, 665, "Black", "Gray");
		DrawText(TextGet("ArousalActivityLoveOther"), 1255, 665, "Black", "Gray");

		// Draws all the available character zones
		for (let A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Zone != null) && (AssetGroup[A].Activity != null))
				DrawAssetGroupZone(Player, AssetGroup[A].Zone, 0.9, 50, 50, 1, "#808080FF", 3, PreferenceGetFactorColor(PreferenceGetZoneFactor(Player, AssetGroup[A].Name)));

		// The zones can be selected and drawn on the character
		if (Player.FocusGroup != null) {
			DrawCheckbox(1230, 813, 64, 64, TextGet("ArousalAllowOrgasm"), PreferenceGetZoneOrgasm(Player, Player.FocusGroup.Name));
			DrawText(TextGet("ArousalZone" + Player.FocusGroup.Name) + " - " + TextGet("ArousalConfigureErogenousZones"), 550, 745, "Black", "Gray");
			DrawAssetGroupZone(Player, Player.FocusGroup.Zone, 0.9, 50, 50, 1, "cyan");
			MainCanvas.textAlign = "center";
			DrawBackNextButton(550, 813, 600, 64, TextGet("ArousalZoneLove" + PreferenceArousalZoneFactor), PreferenceGetFactorColor(PreferenceGetZoneFactor(Player, Player.FocusGroup.Name)), "", () => "", () => "");
		}
		else DrawText(TextGet("ArousalSelectErogenousZones"), 550, 745, "Black", "Gray");

		// Draws the sub-selection controls
		MainCanvas.textAlign = "center";
		DrawBackNextButton(1505, 193, 400, 64, TextGet("ArousalVisible" + PreferenceArousalVisibleList[PreferenceArousalVisibleIndex]), "White", "", () => "", () => "");
		DrawBackNextButton(900, 548, 500, 64, ActivityDictionaryText("Activity" + PreferenceArousalActivityList[PreferenceArousalActivityIndex]), "White", "", () => "", () => "");
		DrawBackNextButton(900, 633, 300, 64, TextGet("ArousalActivityLove" + PreferenceArousalActivityFactorSelf), PreferenceGetFactorColor(PreferenceGetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], true)), "", () => "", () => "");
		DrawBackNextButton(1605, 633, 300, 64, TextGet("ArousalActivityLove" + PreferenceArousalActivityFactorOther), PreferenceGetFactorColor(PreferenceGetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], false)), "", () => "", () => "");

		// Fetish elements
		DrawBackNextButton(900, 463, 500, 64, TextGet("ArousalFetish" + PreferenceArousalFetishList[PreferenceArousalFetishIndex]), "White", "", () => "", () => "");
		DrawBackNextButton(1455, 463, 450, 64, TextGet("ArousalFetishLove" + PreferenceArousalFetishFactor), PreferenceGetFactorColor(PreferenceGetFetishFactor(Player, PreferenceArousalFetishList[PreferenceArousalFetishIndex], false)), "", () => "", () => "");
	}

	// We always draw the active & stutter control
	MainCanvas.textAlign = "center";
	DrawBackNextButton(750, 193, 450, 64, TextGet("ArousalActive" + PreferenceArousalActiveList[PreferenceArousalActiveIndex]), "White", "", () => "", () => "");
	DrawBackNextButton(900, 378, 500, 64, TextGet("ArousalStutter" + PreferenceArousalAffectStutterList[PreferenceArousalAffectStutterIndex]), "White", "", () => "", () => "");
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

}

/**
 * Sets the security preferences for a player. Redirected to from the main Run function if the player is in the security settings subscreen
 * @returns {void} - Nothing
 */
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

/**
 * Sets the item visibility preferences for a player. Redirected to from the main Run function if the player is in the visibility settings subscreen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenVisibilityRun() {

	// Character and exit buttons
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1720, 60, 90, 90, "", "White", "Icons/Accept.png", TextGet("LeaveSave"));
	DrawButton(1820, 60, 90, 90, "", "White", "Icons/Cancel.png", TextGet("LeaveNoSave"));
	MainCanvas.textAlign = "left";
	DrawText(TextGet("VisibilityPreferences"), 500, 125, "Black", "Gray");

	// Not available in Extreme mode
	if (Player.GetDifficulty() <= 2) {

		// Left-aligned text controls
		DrawText(TextGet("VisibilityGroup"), 500, 225, "Black", "Gray");
		DrawText(TextGet("VisibilityAsset"), 500, 304, "Black", "Gray");
		DrawCheckbox(500, 352, 64, 64, TextGet("VisibilityCheckboxHide"), PreferenceVisibilityHideChecked);
		DrawCheckbox(500, 432, 64, 64, TextGet("VisibilityCheckboxBlock"), PreferenceVisibilityBlockChecked, !PreferenceVisibilityCanBlock);
		if (PreferenceVisibilityHideChecked) {
			DrawImageResize("Screens/Character/Player/HiddenItem.png", 500, 516, 86, 86);
			DrawText(TextGet("VisibilityWarning"), 600, 548, "Black", "Gray");
		}
		if (PreferenceVisibilityResetClicked) DrawText(TextGet("VisibilityResetDescription"), 500, 732, "Black", "Gray");
		MainCanvas.textAlign = "center";

		// Buttons
		DrawBackNextButton(650, 193, 500, 64, PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Group.Description, "White", "", () => "", () => "");
		DrawBackNextButton(650, 272, 500, 64, PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Assets[PreferenceVisibilityAssetIndex].Asset.Description, "White", "", () => "", () => "");
		DrawButton(500, PreferenceVisibilityResetClicked ? 780 : 700, 300, 64, TextGet("VisibilityReset"), "White", "");

		// Preview icon
		if (PreferenceVisibilityHideChecked) DrawPreviewBox(1200, 193, "Icons/HiddenItem.png", "", { Border: true });

		else DrawAssetPreview(1200, 193, PreferenceVisibilityPreviewAsset, {Description: "", Border: true});
	} else {
		MainCanvas.textAlign = "center";
		DrawText(TextGet("VisibilityLocked"), 1200, 500, "Red", "Gray");
	}

}

/**
 * Sets the graphical preferences for a player. Redirected to from the main Run function if the player is in the visibility settings subscreen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenGraphicsRun() {

	// Character and exit button
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

	// Left-aligned text controls
	MainCanvas.textAlign = "left";
	DrawText(TextGet("VFXPreferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("VFX"), 800, 246, "Black", "Gray");
	DrawText(TextGet("GraphicsFont"), 800, 336, "Black", "Gray");
	DrawTextFit(TextGet("GraphicsFontDisclaimer"), 500, 406, 1400, "Black", "Gray");
	DrawCheckbox(500, 470, 64, 64, TextGet("GraphicsInvertRoom"), Player.GraphicsSettings.InvertRoom);
	DrawCheckbox(500, 550, 64, 64, TextGet("GraphicsStimulationFlash"), Player.GraphicsSettings.StimulationFlash);
	DrawCheckbox(500, 630, 64, 64, TextGet("DoBlindFlash"), Player.GraphicsSettings.DoBlindFlash);

	MainCanvas.textAlign = "center";
	DrawBackNextButton(500, 212, 250, 64, TextGet(Player.ArousalSettings.VFX), "White", "",
		() => TextGet(PreferenceSettingsVFXList[(PreferenceSettingsVFXIndex + PreferenceSettingsVFXList.length - 1) % PreferenceSettingsVFXList.length]),
		() => TextGet(PreferenceSettingsVFXList[(PreferenceSettingsVFXIndex + 1) % PreferenceSettingsVFXList.length]));

	DrawBackNextButton(500, 300, 250, 64, TextGet(Player.GraphicsSettings.Font), "White", "",
		() => TextGet(PreferenceGraphicsFontList[(PreferenceGraphicsFontIndex + PreferenceGraphicsFontList.length - 1) % PreferenceGraphicsFontList.length]),
		() => TextGet(PreferenceGraphicsFontList[(PreferenceGraphicsFontIndex + 1) % PreferenceGraphicsFontList.length]));
}

/**
 * Handles click events for the audio preference settings.  Redirected from the main Click function.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenGraphicsClick() {
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreen = "";
	if (MouseIn(500, 212, 250, 64)) {
		if (MouseX <= 625) PreferenceSettingsVFXIndex = (PreferenceSettingsVFXList.length + PreferenceSettingsVFXIndex - 1) % PreferenceSettingsVFXList.length;
		else PreferenceSettingsVFXIndex = (PreferenceSettingsVFXIndex + 1) % PreferenceSettingsVFXList.length;
		Player.ArousalSettings.VFX = PreferenceSettingsVFXList[PreferenceSettingsVFXIndex];
	}
	if (MouseIn(500, 300, 250, 64)) {
		if (MouseX <= 625) PreferenceGraphicsFontIndex = (PreferenceGraphicsFontList.length + PreferenceGraphicsFontIndex - 1) % PreferenceGraphicsFontList.length;
		else PreferenceGraphicsFontIndex = (PreferenceGraphicsFontIndex + 1) % PreferenceGraphicsFontList.length;
		Player.GraphicsSettings.Font = PreferenceGraphicsFontList[PreferenceGraphicsFontIndex];
		CommonGetFont.clearCache();
		CommonGetFontName.clearCache();
	}
	if (MouseIn(500, 470, 64, 64)) Player.GraphicsSettings.InvertRoom = !Player.GraphicsSettings.InvertRoom;
	if (MouseIn(500, 550, 64, 64)) Player.GraphicsSettings.StimulationFlash = !Player.GraphicsSettings.StimulationFlash;
	if (MouseIn(500, 630, 64, 64)) Player.GraphicsSettings.DoBlindFlash = !Player.GraphicsSettings.DoBlindFlash;
}

/**
 * Handles click events for the audio preference settings.  Redirected from the main Click function.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenAudioClick() {

	// If the user clicked the exit icon to return to the main screen
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreenAudioExit();

	// Volume increase/decrease control
	if (MouseIn(500, 193, 250, 64)) {
		if (MouseX <= 625) PreferenceSettingsVolumeIndex = (PreferenceSettingsVolumeList.length + PreferenceSettingsVolumeIndex - 1) % PreferenceSettingsVolumeList.length;
		else PreferenceSettingsVolumeIndex = (PreferenceSettingsVolumeIndex + 1) % PreferenceSettingsVolumeList.length;
		Player.AudioSettings.Volume = PreferenceSettingsVolumeList[PreferenceSettingsVolumeIndex];
	}

	// Individual audio check-boxes
	if (MouseXIn(500, 64)) {
		if (MouseYIn(272, 64)) Player.AudioSettings.PlayBeeps = !Player.AudioSettings.PlayBeeps;
		if (MouseYIn(352, 64)) Player.AudioSettings.PlayItem = !Player.AudioSettings.PlayItem;
		if (MouseYIn(432, 64)) Player.AudioSettings.PlayItemPlayerOnly = !Player.AudioSettings.PlayItemPlayerOnly;
		if (MouseYIn(512, 64)) Player.AudioSettings.Notifications = !Player.AudioSettings.Notifications;
	}
}

/**
 * Exists the preference screen.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenAudioExit() {
	// If audio has been disabled for notifications, disable each individual notification audio setting
	if (!Player.AudioSettings.Notifications) {
		for (const setting in Player.NotificationSettings) {
			let audio = Player.NotificationSettings[setting].Audio;
			if (typeof audio === 'number' && audio > 0) Player.NotificationSettings[setting].Audio = NotificationAudioType.NONE;
		}
	}

	PreferenceSubscreen = "";
}

/**
 * Handles click events for the audio preference settings.  Redirected from the main Click function.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenControllerClick() {
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreenControllerExit();

	if (PreferenceCalibrationStage == 0) {

		if (MouseIn(500, 193, 250, 64)) {
			if (MouseX <= 625) PreferenceSettingsSensitivityIndex = (PreferenceSettingsSensitivityList.length + PreferenceSettingsSensitivityIndex - 1) % PreferenceSettingsSensitivityList.length;
			else PreferenceSettingsSensitivityIndex = (PreferenceSettingsSensitivityIndex + 1) % PreferenceSettingsSensitivityList.length;
			Player.ControllerSettings.ControllerSensitivity = PreferenceSettingsSensitivityList[PreferenceSettingsSensitivityIndex];
			ControllerSensitivity = Player.ControllerSettings.ControllerSensitivity;
		}
		if (MouseIn(500, 593, 250, 64)) {
			if (MouseX <= 625) PreferenceSettingsDeadZoneIndex = (PreferenceSettingsDeadZoneList.length + PreferenceSettingsDeadZoneIndex - 1) % PreferenceSettingsDeadZoneList.length;
			else PreferenceSettingsDeadZoneIndex = (PreferenceSettingsDeadZoneIndex + 1) % PreferenceSettingsDeadZoneList.length;
			Player.ControllerSettings.ControllerDeadZone = PreferenceSettingsDeadZoneList[PreferenceSettingsDeadZoneIndex];
			ControllerDeadZone = Player.ControllerSettings.ControllerDeadZone;
		}

		if (MouseIn(590, 400, 310, 90)) {
			PreferenceCalibrationStage = 1;
			Calibrating = true;
		}

		if (MouseIn(590, 500, 310, 90)) {
			PreferenceCalibrationStage = 101;
			Calibrating = true;
		}

		if (MouseIn(500, 272, 64, 64)) {
			ControllerActive = !ControllerActive;
			Player.ControllerSettings.ControllerActive = ControllerActive;
			ClearButtons();
		}
	}
}

/**
 * Handles the click events for the chat settings of a player.  Redirected from the main Click function.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenChatClick() {

	// If the user clicked one of the check-boxes
	if (MouseXIn(500, 64)) {
		if (MouseYIn(492, 64)) Player.ChatSettings.DisplayTimestamps = !Player.ChatSettings.DisplayTimestamps;
		if (MouseYIn(572, 64)) Player.ChatSettings.ColorNames = !Player.ChatSettings.ColorNames;
		if (MouseYIn(652, 64)) Player.ChatSettings.ColorActions = !Player.ChatSettings.ColorActions;
		if (MouseYIn(732, 64)) Player.ChatSettings.ColorEmotes = !Player.ChatSettings.ColorEmotes;
		if (MouseYIn(812, 64)) Player.ChatSettings.ShowActivities = !Player.ChatSettings.ShowActivities;
	}

	if (MouseXIn(1200, 64)) {
		if (MouseYIn(492, 64)) Player.ChatSettings.ShowAutomaticMessages = !Player.ChatSettings.ShowAutomaticMessages;
		if (MouseYIn(572, 64)) Player.ChatSettings.WhiteSpace = Player.ChatSettings.WhiteSpace == "Preserve" ? "" : "Preserve";
		if (MouseYIn(652, 64)) Player.ChatSettings.ColorActivities = !Player.ChatSettings.ColorActivities;
		if (MouseYIn(732, 64)) Player.ChatSettings.ShrinkNonDialogue = !Player.ChatSettings.ShrinkNonDialogue;
		
	}

	// If the user used one of the BackNextButtons
	if (MouseIn(1000, 190, 350, 80)) {
		if (MouseX <= 1175) PreferenceChatColorThemeIndex = (PreferenceChatColorThemeIndex <= 0) ? PreferenceChatColorThemeList.length - 1 : PreferenceChatColorThemeIndex - 1;
		else PreferenceChatColorThemeIndex = (PreferenceChatColorThemeIndex >= PreferenceChatColorThemeList.length - 1) ? 0 : PreferenceChatColorThemeIndex + 1;
		PreferenceChatColorThemeSelected = PreferenceChatColorThemeList[PreferenceChatColorThemeIndex];
		Player.ChatSettings.ColorTheme = PreferenceChatColorThemeSelected;
	}
	if (MouseIn(1000, 290, 350, 80)) {
		if (MouseX <= 1175) PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveIndex <= 0) ? PreferenceChatEnterLeaveList.length - 1 : PreferenceChatEnterLeaveIndex - 1;
		else PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveIndex >= PreferenceChatEnterLeaveList.length - 1) ? 0 : PreferenceChatEnterLeaveIndex + 1;
		PreferenceChatEnterLeaveSelected = PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex];
		Player.ChatSettings.EnterLeave = PreferenceChatEnterLeaveSelected;
	}
	if (MouseIn(1000, 390, 350, 80)) {
		if (MouseX <= 1175) PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersIndex <= 0) ? PreferenceChatMemberNumbersList.length - 1 : PreferenceChatMemberNumbersIndex - 1;
		else PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersIndex >= PreferenceChatMemberNumbersList.length - 1) ? 0 : PreferenceChatMemberNumbersIndex + 1;
		PreferenceChatMemberNumbersSelected = PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex];
		Player.ChatSettings.MemberNumbers = PreferenceChatMemberNumbersSelected;
	}

	// If the user clicked the exit icon to return to the main screen
	if (MouseIn(1815, 75,90,90)) PreferenceSubscreenChatExit();

}

/**
 * Handles the click events for the online settings.  Redirected from the main Click function.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenOnlineClick() {
	const OnlineSettings = Player.OnlineSettings;
	const OnlineSharedSettings = Player.OnlineSharedSettings;
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreen = "";
	else if (MouseIn(500, 175, 64, 64)) OnlineSettings.AutoBanBlackList = !OnlineSettings.AutoBanBlackList;
	else if (MouseIn(500, 255, 64, 64)) OnlineSettings.AutoBanGhostList = !OnlineSettings.AutoBanGhostList;
	else if (MouseIn(500, 335, 64, 64)) OnlineSettings.SearchShowsFullRooms = !OnlineSettings.SearchShowsFullRooms;
	else if (MouseIn(500, 415, 64, 64)) OnlineSettings.SearchFriendsFirst = !OnlineSettings.SearchFriendsFirst;
	else if (MouseIn(500, 495, 64, 64)) OnlineSettings.DisableAnimations = !OnlineSettings.DisableAnimations;
	else if (MouseIn(500, 575, 64, 64)) {
		OnlineSettings.EnableAfkTimer = !OnlineSettings.EnableAfkTimer;
		AfkTimerSetEnabled(OnlineSettings.EnableAfkTimer);
	}
	else if (MouseIn(500, 655, 64, 64)) OnlineSettings.EnableWardrobeIcon = !OnlineSettings.EnableWardrobeIcon;
	else if (MouseIn(500, 735, 64, 64)) OnlineSharedSettings.AllowFullWardrobeAccess = !OnlineSharedSettings.AllowFullWardrobeAccess;
	else if (MouseIn(500, 815, 64, 64)) OnlineSharedSettings.BlockBodyCosplay = !OnlineSharedSettings.BlockBodyCosplay;
}

/**
 * Handles the click events for the arousal settings.  Redirected from the main Click function.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenArousalClick() {

	// If the user clicked the exit icon to return to the main screen
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreenArousalExit();

	// Arousal active control
	if (MouseIn(750, 193, 450, 64)) {
		if (MouseX <= 975) PreferenceArousalActiveIndex = (PreferenceArousalActiveList.length + PreferenceArousalActiveIndex - 1) % PreferenceArousalActiveList.length;
		else PreferenceArousalActiveIndex = (PreferenceArousalActiveIndex + 1) % PreferenceArousalActiveList.length;
		Player.ArousalSettings.Active = PreferenceArousalActiveList[PreferenceArousalActiveIndex];
	}

	// Speech stuttering control
	if (MouseIn(900, 378, 500, 64)) {
		if (MouseX <= 1150) PreferenceArousalAffectStutterIndex = (PreferenceArousalAffectStutterList.length + PreferenceArousalAffectStutterIndex - 1) % PreferenceArousalAffectStutterList.length;
		else PreferenceArousalAffectStutterIndex = (PreferenceArousalAffectStutterIndex + 1) % PreferenceArousalAffectStutterList.length;
		Player.ArousalSettings.AffectStutter = PreferenceArousalAffectStutterList[PreferenceArousalAffectStutterIndex];
	}

	// Show other player meter check box
	if (MouseIn(550, 286, 64, 350))
		Player.ArousalSettings.ShowOtherMeter = !Player.ArousalSettings.ShowOtherMeter;

	// If the arousal is active, we allow more controls
	if (PreferenceArousalIsActive()) {

		// Meter affect your facial expressions check box
		if (MouseIn(1250, 286, 64, 64))
			Player.ArousalSettings.AffectExpression = !Player.ArousalSettings.AffectExpression;

		// Arousal visible control
		if (MouseIn(1505, 193, 400, 64)) {
			if (MouseX <= 1705) PreferenceArousalVisibleIndex = (PreferenceArousalVisibleList.length + PreferenceArousalVisibleIndex - 1) % PreferenceArousalVisibleList.length;
			else PreferenceArousalVisibleIndex = (PreferenceArousalVisibleIndex + 1) % PreferenceArousalVisibleList.length;
			Player.ArousalSettings.Visible = PreferenceArousalVisibleList[PreferenceArousalVisibleIndex];
		}

		// Fetish master control
		if (MouseIn(900, 463, 500, 64)) {
			if (MouseX <= 1150) PreferenceArousalFetishIndex = (PreferenceArousalFetishList.length + PreferenceArousalFetishIndex - 1) % PreferenceArousalFetishList.length;
			else PreferenceArousalFetishIndex = (PreferenceArousalFetishIndex + 1) % PreferenceArousalFetishList.length;
			PreferenceLoadFetishFactor();
		}

		// Fetish love control
		if (MouseIn(1455, 463, 450, 64)) {
			if (MouseX <= 1680) PreferenceArousalFetishFactor = (5 + PreferenceArousalFetishFactor - 1) % 5;
			else PreferenceArousalFetishFactor = (PreferenceArousalFetishFactor + 1) % 5;
			for (let F = 0; F < Player.ArousalSettings.Fetish.length; F++)
				if (Player.ArousalSettings.Fetish[F].Name == PreferenceArousalFetishList[PreferenceArousalFetishIndex])
					Player.ArousalSettings.Fetish[F].Factor = PreferenceArousalFetishFactor;
		}

		// Arousal activity control
		if (MouseIn(900, 548, 500, 64)) {
			if (MouseX <= 1150) PreferenceArousalActivityIndex = (PreferenceArousalActivityList.length + PreferenceArousalActivityIndex - 1) % PreferenceArousalActivityList.length;
			else PreferenceArousalActivityIndex = (PreferenceArousalActivityIndex + 1) % PreferenceArousalActivityList.length;
			PreferenceLoadActivityFactor();
		}

		// Arousal activity love on self control
		if (MouseIn(900, 633, 300, 64)) {
			if (MouseX <= 1050) PreferenceArousalActivityFactorSelf = (5 + PreferenceArousalActivityFactorSelf - 1) % 5;
			else PreferenceArousalActivityFactorSelf = (PreferenceArousalActivityFactorSelf + 1) % 5;
			PreferenceSetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], true, PreferenceArousalActivityFactorSelf);
		}

		// Arousal activity love on other control
		if (MouseIn(1605, 633, 300, 64)) {
			if (MouseX <= 1755) PreferenceArousalActivityFactorOther = (5 + PreferenceArousalActivityFactorOther - 1) % 5;
			else PreferenceArousalActivityFactorOther = (PreferenceArousalActivityFactorOther + 1) % 5;
			PreferenceSetActivityFactor(Player, PreferenceArousalActivityList[PreferenceArousalActivityIndex], false, PreferenceArousalActivityFactorOther);
		}

		// Arousal zone love control
		if ((Player.FocusGroup != null) && MouseIn(550, 813, 600, 64)) {
			if (MouseX <= 850) PreferenceArousalZoneFactor = (5 + PreferenceArousalZoneFactor - 1) % 5;
			else PreferenceArousalZoneFactor = (PreferenceArousalZoneFactor + 1) % 5;
			PreferenceSetZoneFactor(Player, Player.FocusGroup.Name, PreferenceArousalZoneFactor);
		}

		// Arousal zone orgasm check box
		if ((Player.FocusGroup != null) && MouseIn(1230, 813, 64, 64))
			PreferenceSetZoneOrgasm(Player, Player.FocusGroup.Name, !PreferenceGetZoneOrgasm(Player, Player.FocusGroup.Name));

		// In arousal mode, the player can click on her zones
		for (let A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Zone != null) && (AssetGroup[A].Activity != null))
				for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++)
					if (DialogClickedInZone(Player, AssetGroup[A].Zone[Z], 0.9, 50, 50, 1)) {
						Player.FocusGroup = AssetGroup[A];
						PreferenceArousalZoneFactor = PreferenceGetZoneFactor(Player, AssetGroup[A].Name);
					}

	}

}

/**
 * Handles the click events in the security settings dialog for a player.  Redirected from the main Click function.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenSecurityClick() {

	// If the user clicked the exit icon to return to the main screen
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreenSecurityExit();

	// If we must update the email
	if (MouseIn(500, 365, 250, 50)) {
		var EmailOld = ElementValue("InputEmailOld");
		var EmailNew = ElementValue("InputEmailNew");
		var E = /^[a-zA-Z0-9@.!#$%&'*+/=?^_`{|}~-]+$/;
		if ((EmailOld.match(E) || (EmailOld == "")) && (EmailOld.length <= 100) && (EmailNew.match(E) || (EmailNew == "")) && (EmailNew.length <= 100))
			ServerSend("AccountUpdateEmail", { EmailOld: EmailOld, EmailNew: EmailNew });
		else
			ElementValue("InputEmailNew", TextGet("UpdateEmailInvalid"));
	}

}

/**
 * Handles the click events for the visibility settings of a player.  Redirected from the main Click function.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenVisibilityClick() {

	// Most controls are not available in Extreme mode
	if (Player.GetDifficulty() <= 2) {

		// Group button
		if (MouseIn(650, 193, 500, 64)) {
			if (MouseX >= 900) {
				PreferenceVisibilityGroupIndex++;
				if (PreferenceVisibilityGroupIndex >= PreferenceVisibilityGroupList.length) PreferenceVisibilityGroupIndex = 0;
			}
			else {
				PreferenceVisibilityGroupIndex--;
				if (PreferenceVisibilityGroupIndex < 0) PreferenceVisibilityGroupIndex = PreferenceVisibilityGroupList.length - 1;
			}
			PreferenceVisibilityAssetIndex = 0;
			PreferenceVisibilityAssetChanged(true);
		}

		// Asset button
		if (MouseIn(650, 272, 500, 64)) {
			if (MouseX >= 900) {
				PreferenceVisibilityAssetIndex++;
				if (PreferenceVisibilityAssetIndex >= PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Assets.length) PreferenceVisibilityAssetIndex = 0;
			}
			else {
				PreferenceVisibilityAssetIndex--;
				if (PreferenceVisibilityAssetIndex < 0) PreferenceVisibilityAssetIndex = PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Assets.length - 1;
			}
			PreferenceVisibilityAssetChanged(true);
		}

		// Hide checkbox
		if (MouseIn(500, 352, 64, 64)) {
			PreferenceVisibilityHideChange();
			if (PreferenceVisibilityHideChecked != PreferenceVisibilityBlockChecked && PreferenceVisibilityCanBlock) PreferenceVisibilityBlockChange();
		}

		// Block checkbox
		if (MouseIn(500, 432, 64, 64) && PreferenceVisibilityCanBlock) PreferenceVisibilityBlockChange();

		// Reset button
		if (MouseIn(500, PreferenceVisibilityResetClicked ? 780 : 700, 300, 64)) {
			if (PreferenceVisibilityResetClicked) {
				Player.HiddenItems = [];
				PreferenceVisibilityExit(true);
			}
			else PreferenceVisibilityResetClicked = true;
		}

	}

	// Confirm button
	if (MouseIn(1720, 60, 90, 90)) {
		Player.HiddenItems = PreferenceVisibilityHiddenList;
		Player.BlockItems = PreferenceVisibilityBlockList;
		PreferenceVisibilityExit(true);
	}

	// Cancel button
	if (MouseIn(1820, 60, 90, 90)) PreferenceVisibilityExit(false);

}

/**
 * Handles the loading of the visibility settings of a player
 * @returns {void} - Nothing
 */
function PreferenceSubscreenVisibilityLoad() {
	PreferenceVisibilityHiddenList = Player.HiddenItems.slice();
	PreferenceVisibilityBlockList = Player.BlockItems.slice();
	for (let G = 0; G < AssetGroup.length; G++)
		if (AssetGroup[G].Clothing || AssetGroup[G].Category != "Appearance") {
			var AssetList = [];
			for (let A = 0; A < Asset.length; A++)
				if (Asset[A].Group.Name == AssetGroup[G].Name && Asset[A].Visible)
					AssetList.push({
						Asset: Asset[A],
						Hidden: CharacterAppearanceItemIsHidden(Asset[A].Name, AssetGroup[G].Name),
						Blocked: InventoryIsPermissionBlocked(Player, Asset[A].Name, AssetGroup[G].Name),
						Limited: InventoryIsPermissionLimited(Player, Asset[A].Name, AssetGroup[G].Name)
					});
			if (AssetList.length > 0) PreferenceVisibilityGroupList.push({ Group: AssetGroup[G], Assets: AssetList });
		}
	PreferenceVisibilityAssetChanged(true);
}

/**
 * Update the checkbox settings and asset preview image based on the new asset selection
 * @param {boolean} RefreshCheckboxes - If TRUE, load the new asset settings. If FALSE, a checkbox was just manually changed so don't refresh them
 * @returns {void} - Nothing
 */
function PreferenceVisibilityAssetChanged(RefreshCheckboxes) {
	var CurrAsset = PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Assets[PreferenceVisibilityAssetIndex];

	// Load info for the new asset
	if (RefreshCheckboxes) {
		PreferenceVisibilityHideChecked = CurrAsset.Hidden;
		PreferenceVisibilityBlockChecked = CurrAsset.Blocked;
	}

	// Can't change the Block setting if the item is worn or set to limited permissions
	var WornItem = InventoryGet(Player, PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Group.Name);
	PreferenceVisibilityCanBlock = (WornItem == null || WornItem.Asset.Name != CurrAsset.Asset.Name) && !CurrAsset.Limited;

	// Get the preview image path
	PreferenceVisibilityPreviewAsset = CurrAsset.Asset;

	PreferenceVisibilityResetClicked = false;
}

/**
 * Toggles the Hide checkbox
 * @returns {void} - Nothing
 */
function PreferenceVisibilityHideChange() {
	PreferenceVisibilityHideChecked = !PreferenceVisibilityHideChecked;
	PreferenceVisibilityCheckboxChanged(PreferenceVisibilityHiddenList, PreferenceVisibilityHideChecked);
	PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Assets[PreferenceVisibilityAssetIndex].Hidden = PreferenceVisibilityHideChecked;
	PreferenceVisibilityAssetChanged(false);
}

/**
 * Toggles the Block checkbox
 * @returns {void} - Nothing
 */
function PreferenceVisibilityBlockChange() {
	PreferenceVisibilityBlockChecked = !PreferenceVisibilityBlockChecked;
	PreferenceVisibilityCheckboxChanged(PreferenceVisibilityBlockList, PreferenceVisibilityBlockChecked);
	PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Assets[PreferenceVisibilityAssetIndex].Blocked = PreferenceVisibilityBlockChecked;
	PreferenceVisibilityAssetChanged(false);
}

/**
 * Adds or removes the current item to/from the list based on the new state of the corresponding checkbox
 * @param {Array} List - The list to add or remove the item from
 * @param {boolean} CheckSetting - The new true/false setting of the checkbox
 */
function PreferenceVisibilityCheckboxChanged(List, CheckSetting) {
	var CurrGroup = PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Group.Name;
	var CurrAsset = PreferenceVisibilityGroupList[PreferenceVisibilityGroupIndex].Assets[PreferenceVisibilityAssetIndex].Asset.Name;
	if (CheckSetting == true) {
		List.push({ Name: CurrAsset, Group: CurrGroup });
	}
	else {
		for (let A = 0; A < List.length; A++)
			if (List[A].Name == CurrAsset && List[A].Group == CurrGroup) {
				List.splice(A, 1);
				break;
			}
	}
}

/**
 * Saves changes to the settings, disposes of large lists & exits the visibility preference screen.
 * @param {boolean} SaveChanges - If TRUE, update HiddenItems and BlockItems for the account
 * @returns {void} - Nothing
 */
function PreferenceVisibilityExit(SaveChanges) {
	if (SaveChanges) ServerPlayerBlockItemsSync();

	PreferenceVisibilityGroupList = [];
	PreferenceVisibilityHiddenList = [];
	PreferenceVisibilityBlockList = [];
	PreferenceSubscreen = "";
}

/**
 * Loads the Preferences screen.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenGeneralLoad() {
	ElementCreateInput("InputCharacterLabelColor", "text", Player.LabelColor);
}

/**
 * Exists the preference screen. Cleans up elements that are not needed anymore
 * If the selected color is invalid, the player cannot leave the screen.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenGeneralExit() {
	if (PreferenceColorPick == "") {
		if (CommonIsColor(ElementValue("InputCharacterLabelColor"))) {
			Player.LabelColor = ElementValue("InputCharacterLabelColor");
			PreferenceMessage = "";
			ElementRemove("InputCharacterLabelColor");
			PreferenceSubscreen = "";
		} else PreferenceMessage = "ErrorInvalidColor";
	}
}

/**
 * Exists the difficulty screen. Cleans up elements that are not needed anymore
 * @returns {void} - Nothing
 */
function PreferenceSubscreenDifficultyExit() {
	PreferenceMessage = "";
	PreferenceSubscreen = "";
}

/**
 * Loads the Preferences screen.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenSecurityLoad() {
	ElementCreateInput("InputEmailOld", "text", "", "100");
	ElementCreateInput("InputEmailNew", "text", "", "100");
	ServerSend("AccountQuery", { Query: "EmailStatus" });
}

/**
 * Get the sensory deprivation setting for the player
 * @returns {boolean} - Return true if sensory deprivation is active, false otherwise
 */
function PreferenceIsPlayerInSensDep() {
	return (Player.GameplaySettings && ((Player.GameplaySettings.SensDepChatLog == "SensDepNames") || (Player.GameplaySettings.SensDepChatLog == "SensDepTotal") || (Player.GameplaySettings.SensDepChatLog == "SensDepExtreme")) && (Player.GetDeafLevel() >= 3) && (Player.GetBlindLevel() >= 3));
}

/**
 * Loads the preference screen. This function is called dynamically, when the character enters the preference screen for the first time
 * @returns {void} - Nothing
 */
function PreferenceSubscreenNotificationsLoad() {
	const NS = Player.NotificationSettings;
	PreferenceNotificationsCheckSetting(NS.Beeps);
	PreferenceNotificationsCheckSetting(NS.ChatMessage);
	PreferenceNotificationsCheckSetting(NS.ChatJoin);
	PreferenceNotificationsCheckSetting(NS.Disconnect);
	PreferenceNotificationsCheckSetting(NS.Test);
}

/**
 * If the setting's alert type is not allowed for this session, e.g. from using a new device/browser, reset it to 'None'
 * @param {NotificationSetting} setting - The notifications setting to check
 * @returns {void} - Nothing
 */
function PreferenceNotificationsCheckSetting(setting) {
	const type = NotificationAlertTypeList.find(N => N === setting.AlertType);
	if (type == null) setting.AlertType = NotificationAlertTypeList[0];
}

/**
 * Sets the notifications preferences for a player. Redirected to from the main Run function if the player is in the notifications settings subscreen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenNotificationsRun() {

	// Character and exit button
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	//PreferencePageChangeDraw(1705, 185, 2); // Uncomment when adding a 2nd page

	// Left-aligned text controls
	MainCanvas.textAlign = "left";
	const NS = Player.NotificationSettings;

	DrawText(TextGet("NotificationsPreferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("NotificationsExplanation"), 500, 190, "Black", "Gray");
	DrawEmptyRect(1140, 92, 510, 125, "Black", 2);
	DrawImage("Icons/Audio1.png", 1152, 97);
	DrawText(TextGet("NotificationsAudioExplanation1"), 1205, 125, "Black", "Gray");
	DrawText(TextGet("NotificationsAudioExplanation2"), 1150, 190, "Black", "Gray");


	if (PreferencePageCurrent === 1) {
		PreferenceNotificationsDrawSetting(500, 235, TextGet("NotificationsBeeps"), NS.Beeps);

		PreferenceNotificationsDrawSetting(500, 315, TextGet("NotificationsChatMessage"), NS.ChatMessage);
		DrawText(TextGet("NotificationsOnly"), 550, 427, "Black", "Gray");
		const chatMessageDisabled = NS.ChatMessage.AlertType === NotificationAlertType.NONE;
		DrawCheckbox(700, 395, 64, 64, TextGet("NotificationsChatMessageNormal"), NS.ChatMessage.Normal && !chatMessageDisabled, chatMessageDisabled);
		DrawCheckbox(1150, 395, 64, 64, TextGet("NotificationsChatMessageWhisper"), NS.ChatMessage.Whisper && !chatMessageDisabled, chatMessageDisabled);
		DrawCheckbox(1500, 395, 64, 64, TextGet("NotificationsChatMessageActivity"), NS.ChatMessage.Activity && !chatMessageDisabled, chatMessageDisabled);

		PreferenceNotificationsDrawSetting(500, 475, TextGet("NotificationsChatJoin"), NS.ChatJoin);
		DrawText(TextGet("NotificationsOnly"), 550, 587, "Black", "Gray");
		const chatJoinDisabled = NS.ChatJoin.AlertType === NotificationAlertType.NONE;
		DrawCheckbox(700, 555, 64, 64, TextGet("NotificationsChatJoinOwner"), NS.ChatJoin.Owner && !chatJoinDisabled, chatJoinDisabled);
		DrawCheckbox(980, 555, 64, 64, TextGet("NotificationsChatJoinLovers"), NS.ChatJoin.Lovers && !chatJoinDisabled, chatJoinDisabled);
		DrawCheckbox(1260, 555, 64, 64, TextGet("NotificationsChatJoinFriendlist"), NS.ChatJoin.Friendlist && !chatJoinDisabled, chatJoinDisabled);
		DrawCheckbox(1540, 555, 64, 64, TextGet("NotificationsChatJoinSubs"), NS.ChatJoin.Subs && !chatJoinDisabled, chatJoinDisabled);

		PreferenceNotificationsDrawSetting(500, 635, TextGet("NotificationsDisconnect"), NS.Disconnect);
		PreferenceNotificationsDrawSetting(500, 715, TextGet("NotificationsLarp"), NS.Larp);
	}
	else if (PreferencePageCurrent === 2) {
		// New settings here
	}

	// Test buttons
	PreferenceNotificationsDrawSetting(500, 820, "", NS.Test);
	MainCanvas.textAlign = "center";
	DrawEmptyRect(500, 800, 1400, 0, "Black", 1);
	DrawButton(800, 820, 450, 64, TextGet("NotificationsTestRaise"), "White");
	DrawButton(1286, 820, 450, 64, TextGet("NotificationsTestReset"), "White");
}

/**
 * Draws the two checkbox row for a notifications setting
 * @param {number} Left - The X co-ordinate the row starts on
 * @param {number} Top - The Y co-ordinate the row starts on
 * @param {string} Text - The text for the setting's description
 * @param {NotificationSetting} Setting - The player setting the row corresponds to
 * @returns {void} - Nothing
 */
function PreferenceNotificationsDrawSetting(Left, Top, Text, Setting) {
	MainCanvas.textAlign = "center";
	DrawBackNextButton(Left, Top, 164, 64, TextGet("NotificationsAlertType" + Setting.AlertType.toString()), "White", null, () => "", () => "");
	MainCanvas.textAlign = "left";
	const Enabled = Setting.AlertType > 0;
	if (Enabled) {
		DrawButton(Left + 200, Top, 64, 64, "", "White", "Icons/Audio" + Setting.Audio.toString() + ".png");
	} else {
		DrawCheckbox(Left + 200, Top, 64, 64, "", false, true);
	}
	DrawText(Text, Left + 300, Top + 33, "Black", "Gray");
}

/**
 * Handles the click events for the notifications settings of a player.  Redirected from the main Click function.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenNotificationsClick() {

	// If the user clicked the exit icon to return to the main screen
	if (MouseIn(1815, 75, 90, 90)) PreferenceSubscreenNotificationsExit();
	// Change pages
	//PreferencePageChangeClick(1705, 185, 2); // Uncomment when adding a 2nd page

	// Checkboxes
	const NS = Player.NotificationSettings;
	if (PreferencePageCurrent === 1) {
		PreferenceNotificationsClickSetting(500, 235, NS.Beeps, NotificationEventType.BEEP);

		PreferenceNotificationsClickSetting(500, 315, NS.ChatMessage, NotificationEventType.CHATMESSAGE);
		if (NS.ChatMessage.AlertType > 0) {
			if (MouseIn(700, 395, 64, 64)) NS.ChatMessage.Normal = !NS.ChatMessage.Normal;
			if (MouseIn(1150, 395, 64, 64)) NS.ChatMessage.Whisper = !NS.ChatMessage.Whisper;
			if (MouseIn(1500, 395, 64, 64)) NS.ChatMessage.Activity = !NS.ChatMessage.Activity;
		}

		PreferenceNotificationsClickSetting(500, 475, NS.ChatJoin, NotificationEventType.CHATJOIN);
		if (NS.ChatJoin.AlertType > 0) {
			if (MouseIn(700, 555, 64, 64)) NS.ChatJoin.Owner = !NS.ChatJoin.Owner;
			if (MouseIn(980, 555, 64, 64)) NS.ChatJoin.Lovers = !NS.ChatJoin.Lovers;
			if (MouseIn(1260, 555, 64, 64)) NS.ChatJoin.Friendlist = !NS.ChatJoin.Friendlist;
			if (MouseIn(1540, 555, 64, 64)) NS.ChatJoin.Subs = !NS.ChatJoin.Subs;
		}

		PreferenceNotificationsClickSetting(500, 635, NS.Disconnect, NotificationEventType.DISCONNECT);
		PreferenceNotificationsClickSetting(500, 715, NS.Larp, NotificationEventType.LARP);
	}
	else if (PreferencePageCurrent === 2) {
		// New settings here
	}

	// Test buttons
	PreferenceNotificationsClickSetting(500, 820, NS.Test, NotificationEventType.TEST);
	if (MouseIn(800, 820, 450, 64)) {
		NotificationRaise(NotificationEventType.TEST, { body: TextGet("NotificationsTestMessage"), character: Player, useCharAsIcon: true });
	}
	if (MouseIn(1286, 820, 450, 64)) NotificationResetAll();
}

/**
 * Handles the click events within a multi-checkbox settings row.
 * @param {number} Left - The X co-ordinate the row starts on
 * @param {number} Top - The Y co-ordinate the row starts on
 * @param {NotificationSetting} Setting - The player setting the row corresponds to
 * @param {NotificationEventType} EventType - The event type the setting corresponds to
 * @returns {void} - Nothing
 */
function PreferenceNotificationsClickSetting(Left, Top, Setting, EventType) {

	// Toggle the alert type
	if (MouseIn(Left, Top, 164, 64)) {
		if (EventType) NotificationReset(EventType);
		if (MouseXIn(Left, 83)) {
			let prevType = NotificationAlertTypeList.findIndex(N => N === Setting.AlertType) - 1;
			if (prevType < 0) prevType = NotificationAlertTypeList.length - 1;
			Setting.AlertType = NotificationAlertTypeList[prevType];
		}
		else if (MouseXIn(Left + 83, 83)) {
			let nextType = NotificationAlertTypeList.findIndex(N => N === Setting.AlertType) + 1;
			if (nextType > NotificationAlertTypeList.length - 1) nextType = 0;
			Setting.AlertType = NotificationAlertTypeList[nextType];
		}
	}

	// Toggle the audio type
	if (MouseIn(Left + 200, Top, 64, 64) && Setting.AlertType > 0) {
		let nextType = NotificationAudioTypeList.findIndex(N => N === Setting.Audio) + 1;
		if (nextType > NotificationAudioTypeList.length - 1) nextType = 0;
		Setting.Audio = NotificationAudioTypeList[nextType];
	}
}

/**
 * Exits the preference screen. Resets the test notifications.
 * @returns {void} - Nothing
 */
function PreferenceSubscreenNotificationsExit() {

	// If any of the settings now have audio enabled, enable the AudioSettings setting as well
	let enableAudio = false;
	for (const setting in Player.NotificationSettings) {
		let audio = Player.NotificationSettings[setting].Audio;
		if (typeof audio === 'number' && audio > 0) enableAudio = true;
	}
	if (enableAudio) Player.AudioSettings.Notifications = true;

	NotificationReset(NotificationEventType.TEST);
	PreferenceSubscreen = "";
}

/**
 * Exits the preference screen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenControllerExit() {
	PreferenceSubscreen = "";
	PreferenceCalibrationStage = 0;
	Calibrating = false;
}

/**
 * Exits the preference screen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenChatExit() {
	if (PreferenceColorPick == "") PreferenceSubscreen = "";
}

/**
 * Exits the preference screen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenArousalExit() {
	PreferenceSubscreen = "";
	Player.FocusGroup = null;
}

/**
 * Exits the preference screen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenSecurityExit() {
	PreferenceSubscreen = "";
	ElementRemove("InputEmailOld");
	ElementRemove("InputEmailNew");
}

/**
 * Exits the preference screen
 * @returns {void} - Nothing
 */
function PreferenceSubscreenVisibilityExit() {
	PreferenceVisibilityExit(false);
}

/**
 * Draw a button to navigate multiple pages in a preference subscreen
 * @param {number} Left - The X co-ordinate of the button
 * @param {number} Top - The Y co-ordinate of the button
 * @param {number} TotalPages - The total number of pages on the subscreen
 * @returns {void} - Nothing
 */
function PreferencePageChangeDraw(Left, Top, TotalPages) {
	DrawBackNextButton(Left, Top, 200, 90, TextGet("Page") + " " + PreferencePageCurrent.toString() + "/" + TotalPages.toString(), "White", "", () => "", () => "");
}

/**
 * Handles clicks of the button to navigate multiple pages in a preference subscreen
 * @param {number} Left - The X co-ordinate of the button
 * @param {number} Top - The Y co-ordinate of the button
 * @param {number} TotalPages - The total number of pages on the subscreen
 * @returns {void} - Nothing
 */
function PreferencePageChangeClick(Left, Top, TotalPages) {
	if (MouseIn(Left, Top, 100, 90)) {
		PreferencePageCurrent--;
		if (PreferencePageCurrent < 1) PreferencePageCurrent = TotalPages;
	}
	else if (MouseIn(Left + 100, Top, 100, 90)) {
		PreferencePageCurrent++;
		if (PreferencePageCurrent > TotalPages) PreferencePageCurrent = 1;
	}
}
