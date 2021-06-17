"use strict";
var AudioDialog = new Audio();

var AudioList = [
	{ Name: "Bag", File: "Bag" },
	{ Name: "Beep", File: "BeepAlarm" },
	{ Name: "BellMedium", File: "BellMedium" },
	{ Name: "BellSmall", File: "BellSmall" },
	{ Name: "ChainLong", File: "ChainLong" },
	{ Name: "SciFiEffect", File: "SciFiEffect" },
	{ Name: "SciFiPump", File: "SciFiPump" },
	{ Name: "SciFiConfigure", File: "SciFiConfigure" },
	{ Name: "SciFiBeeps1", File: "SciFiBeeps1" },
	{ Name: "SciFiBeeps2", File: "SciFiBeeps2" },
	{ Name: "SciFiBeeps3", File: "SciFiBeeps3" },
	{ Name: "ChainShort", File: "ChainShort" },
	{ Name: "CuffsMetal", File: "CuffsMetal" },
	{ Name: "FuturisticApply", File: "FuturisticApply" },
	{ Name: "HydraulicLock", File: "HydraulicLock" },
	{ Name: "HydraulicUnlock", File: "HydraulicUnlock" },
	{ Name: "Deflation", File: "Deflation" },
	{ Name: "DuctTape", File: "DuctTape18" },
	{ Name: "Inflation", File: "Inflation" },
	{ Name: "LockLarge", File: "LockLarge" },
	{ Name: "LockSmall", File: "LockSmall" },
	{ Name: "RopeLong", File: "RopeLong" },
	{ Name: "RopeShort", File: "RopeShort" },
	{ Name: "Shocks", File: "Shocks" },
	{ Name: "SmackSkin1", File: "SmackBareSkin04-1" },
	{ Name: "SmackSkin2", File: "SmackBareSkin04-2" },
	{ Name: "SmackSkin3", File: "SmackBareSkin04-3" },
	{ Name: "Whip1", File: "SmackWhip1" },
	{ Name: "Whip2", File: "SmackWhip2" },
	{ Name: "Sybian", File: "Sybian" },
	{ Name: "Unlock", File: "UnlockSmall" },
	{ Name: "VibrationLong1", File: "VibrationTone4Long3" },
	{ Name: "VibrationLong2", File: "VibrationTone4Long6" },
	{ Name: "VibrationShort", File: "VibrationTone4ShortLoop" },
	{ Name: "Wand", File: "Wand" },
	{ Name: "WoodenCuffs", File: "WoodenCuffs" },
	{ Name: "ZipTie", File: "ZipTie" },
];

var AudioActions = [
	{ Action: "ActionAddLock", Sound: "LockSmall" },
	{ Action: "TimerRelease", Sound: "Unlock" },
	{ Action: "ActionUnlock", Sound: "Unlock" },
	{ Action: "ActionPick", Sound: "Unlock" },
	{ Action: "ActionUnlockAndRemove", Sound: "Unlock" },
	{ Action: "FuturisticCollarTriggerLockdown", Sound: "HydraulicLock" },
	{ Action: "FuturisticCollarTriggerUnlock", Sound: "HydraulicUnlock" },
	{ Action: "ActionLock", GetAudioInfo: AudioPlayAssetSound },
	{
		IsAction: (data) => ["ActionUse", "ActionSwap"].includes(data.Content) && data.Sender !== Player.MemberNumber,
		GetAudioInfo: AudioPlayAssetSound,
	},
	{
		IsAction: (data) => data.Content.indexOf("ActionActivity") == 0,
		GetAudioInfo: AudioPlayAssetSound
	},
	{
		IsAction: (data) => ["pumps", "Suctightens", "InflatableBodyBagRestrain"].find(A => data.Content.includes(A)),
		Sound: "Inflation"
	},
	{
		IsAction: (data) => ["InteractiveVisorHeadSet"].find(A => data.Content.includes(A)),
		Sound: "SciFiEffect"
	},
	{
		IsAction: (data) => ["FuturisticPanelGagMouthSetLightBall", "FuturisticPanelGagMouthSetBall", "FuturisticPanelGagMouthSetPadded", "FuturisticPanelGagMouthSetPlug"].find(A => data.Content.includes(A)),
		Sound: "SciFiPump"
	},
	{
		IsAction: (data) => ["deflates", "Sucloosens"].find(A => data.Content.includes(A)),
		Sound: "Deflation"
	},
	{
		IsAction: (data) => ["ChainSet"].find(A => data.Content.includes(A)),
		Sound: "ChainLong"
	},
	{
		IsAction: (data) => ["RopeSet"].find(A => data.Content.includes(A)),
		Sound: "RopeShort"
	},
	{
		IsAction: (data) => ["ShacklesRestrain", "Ornate"].find(A => data.Content.includes(A)),
		Sound: "CuffsMetal"
	},
	{
		IsAction: (data) => ["FuturisticChastityBeltShock"].find(A => data.Content.includes(A)),
		Sound: "Shocks"
	},
	{
		IsAction: (data) => ["FuturisticChastityBeltSetClosed", "FuturisticChastityBeltSetOpen", "InventoryItemBreastFuturisticBraSet", "FuturisticHeelsSet", "FuturisticArmbinderSet", "FuturisticCuffsRestrain", "FuturisticLegCuffsRestrain", "FuturisticAnkleCuffsRestrain", "SciFiPleasurePantiesAction"].find(A => data.Content.includes(A)),
		Sound: "SciFiConfigure"
	},
	{
		IsAction: (data) => ["FuturisticChastityBeltSetPunish", "FuturisticChastityBeltSetGeneric", "FuturisticPanelGagMouthSetAutoPunish", "SciFiPleasurePantiesBeep"].find(A => data.Content.includes(A)),
		GetAudioInfo: AudioSciFiBeepSounds
	},
	{
		IsAction: (data) => ["FuturisticPanelGagMouthSetAutoInflate"].find(A => data.Content.includes(A)),
		Sound: "Inflation"
	},
	{
		IsAction: (data) => ["FuturisticPanelGagMouthSetAutoDeflate"].find(A => data.Content.includes(A)),
		Sound: "Deflation"
	},
	{
		IsAction: (data) => ["CollarShockUnitTrigger", "ShockCollarTrigger", "LoveChastityBeltShockTrigger", "SciFiPleasurePantiesShockTrigger", "TriggerShock", "CollarAutoShockUnitTrigger", "FuturisticVibratorShockTrigger"].find(A => data.Content.includes(A)),
		GetAudioInfo: (data) => InventoryItemNeckAccessoriesCollarShockUnitDynamicAudio(data)
	},
	{
		IsAction: (data) => ["Decrease", "Increase"].find(A => data.Content.includes(A)) && !data.Content.endsWith("-1"),
		GetAudioInfo: AudioVibratorSounds
	},
];

/**
 * Plays a sound at a given volume
 * @param {string} src - Source of the audio file to play
 * @param {number} [volume] - Volume of the audio in percentage (ranges from 0 to 1)
 * @returns {void} - Nothing
 */
function AudioPlayInstantSound(src, volume) {
	const vol = volume != null ? volume : Player.AudioSettings.Volume;
	if (vol > 0) {
		var audio = new Audio();
		audio.src = src;
		audio.volume = Math.min(vol, 1);
		audio.play();
	}
}

/**
 * Begins to play a sound when applying/removing an item
 * @param {string} SourceFile - Source of the audio file to play
 * @returns {void} - Nothing
 */
function AudioDialogStart(SourceFile) {
	if (!Player.AudioSettings || !Player.AudioSettings.PlayItem || !Player.AudioSettings.Volume || (Player.AudioSettings.Volume == 0)) return;
	AudioDialog.pause();
	AudioDialog.currentTime = 0;
	AudioDialog.src = SourceFile;
	AudioDialog.volume = Player.AudioSettings.Volume;
	AudioDialog.play();
}

/**
 * Stops playing the sound when done applying/removing an item
 * @returns {void} - Nothing
 */
function AudioDialogStop() {
	AudioDialog.pause();
	AudioDialog.currentTime = 0;
}

/**
 * Takes the received data dictionary content and identifies the audio to be played
 * @param {object} data - Data received
 * @returns {void} - Nothing
 */
function AudioPlayContent(data) {
	// Exits right away if we are missing content data
	if (!Player.AudioSettings || !Player.AudioSettings.PlayItem || (Player.AudioSettings.Volume == 0) || !data.Dictionary || !data.Dictionary.length) return;
	var NoiseModifier = 0;
	var FileName = "";

	// Instant actions can trigger a sound depending on the action. It can be a specific string or custom function to determine if a sound should be played, it can also alter the sound level.
	// The sound can be a specific one or the result of a function
	var Action = AudioActions.find(A => A.Action && A.Action == data.Content) || AudioActions.find(CA => CA.IsAction && CA.IsAction(data));
	if (Action) {
		if (Action.GetAudioInfo) {
			var Result = Action.GetAudioInfo(data);
			FileName = AudioGetFileName(Result[0]);
			NoiseModifier += Result[1] || 0;
		} else
			FileName = AudioGetFileName(Action.Sound);
	}

	// Update noise level depending on who the interaction took place between.  Sensory isolation increases volume for self, decreases for others.
	var Target = data.Dictionary.find((el) => el.Tag == "DestinationCharacter" || el.Tag == "DestinationCharacterName" || el.Tag == "TargetCharacter");

	if (!FileName || !Target || !Target.MemberNumber) return;

	if (Target.MemberNumber == Player.MemberNumber) NoiseModifier += 3;
	else if (data.Sender != Player.MemberNumber) NoiseModifier -= 3;

	const blindLevel = Player.GetBlindLevel();
	if (blindLevel >= 3) NoiseModifier += 4;
	else if (blindLevel == 2) NoiseModifier += 2;
	else if (blindLevel == 1) NoiseModifier += 1;

	NoiseModifier -= (3 * Player.GetDeafLevel());

	// Sends the audio file to be played
	AudioPlayInstantSound("Audio/" + FileName + ".mp3", Player.AudioSettings.Volume * (.2 + NoiseModifier / 40));
}

function AudioGetFileName(sound) {
	var AssetSound = AudioList.find(A => A.Name == sound);
	return AssetSound ? AssetSound.File : "";
}

/**
 * Processes which sound should be played for items
 * @param {object} data - Data content triggering the potential sound
 * @returns {[string, number]} - he name of the sound to play, followed by the noise modifier
 */
function AudioPlayAssetSound(data) {
	var NextAsset = data.Dictionary.find((el) => el.Tag == "NextAsset");
	var NextAssetGroup = data.Dictionary.find((el) => el.Tag == "FocusAssetGroup");
	var FileName = "";

	if (!NextAsset || !NextAsset.AssetName || !NextAssetGroup || !NextAssetGroup.AssetGroupName) return [FileName, 0];

	var Asset = AssetGet("Female3DCG", NextAssetGroup.AssetGroupName, NextAsset.AssetName);

	if (!Asset) return [FileName, 0];

	if (Asset.DynamicAudio) {
		var Char = ChatRoomCharacter.find((C) => C.MemberNumber == data.Sender);
		FileName = Char ? Asset.DynamicAudio(Char) : "";
	}

	return [(FileName || Asset.Audio), 3];
}

/**
 * Processes the sound for vibrators
 * @param {object} data - Represents the chat message received
 * @returns {[string, number]} - The name of the sound to play, followed by the noise modifier
 */
function AudioVibratorSounds(data) {
	var Sound = "";

	var Level = parseInt(data.Content.substr(data.Content.length - 1));
	if (isNaN(Level)) Level = 0;

	var AssetName = data.Content.substring(0, data.Content.length - "IncreaseToX".length);
	switch (AssetName) {
		case "Vibe":
		case "VibeHeartClitPiercing":
		case "NippleHeart":
		case "Nipple":
		case "NippleEgg":
		case "TapedClitEgg":
		case "ClitStimulator":
		case "Egg": Sound = "VibrationShort"; break;
		case "LoveChastityBeltVibe":
		case "SciFiPleasurePantiesVibe":
		case "Belt":
		case "Panties": Sound = "VibrationLong1"; break;
		case "Buttplug":
		case "InflVibeButtPlug_Vibe":
		case "InflVibeDildo_Vibe":
		case "HempRopeBelt":
		case "SpreaderVibratingDildoBar":
		case "BunnyTailVibe":
		case "EggVibePlugXXL":
		case "Dildo": Sound = "VibrationLong2"; break;
		case "Sybian": Sound = "Sybian"; break;
	}

	return [Sound, Level * 3];
}

/**
 * @returns {[string, number]}
 */
function AudioSciFiBeepSounds() {
	var AudioRandomNumber = Math.random();

	if (AudioRandomNumber < 0.33) {
		return ["SciFiBeeps1", 4];
	} else if (AudioRandomNumber > 0.67) {
		return ["SciFiBeeps2", 4];
	}
	return ["SciFiBeeps3", 4];
}
