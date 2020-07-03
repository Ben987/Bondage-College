"use strict";
var AudioDialog = new Audio();

// Players a sound with a set volume
function AudioPlayInstantSound(src, volume) {
	var audio = new Audio();
	audio.src = src;
	audio.volume = Math.max(0, Math.min(volume, 1));
	audio.play();
}

// Plays a background sound in the dialog for applying/removing an item
function AudioDialogStart(SourceFile) {
	if (!Player.AudioSettings || !Player.AudioSettings.PlayItem || !Player.AudioSettings.Volume || (Player.AudioSettings.Volume == 0)) return;
	AudioDialog.pause();
	AudioDialog.currentTime = 0;
	AudioDialog.src = SourceFile;
	AudioDialog.volume = Player.AudioSettings.Volume;
	AudioDialog.play();
}

// Plays the background sound in the dialog for applying/removing an item
function AudioDialogStop() {
	AudioDialog.pause();
	AudioDialog.currentTime = 0;
}

// Takes a data dictionary content and sends the related audio mp3 to be played
function AudioPlayContent(data) {
	// Exits right away if we are missing content data
	if (!Player.AudioSettings || !Player.AudioSettings.PlayItem || (Player.AudioSettings.Volume == 0)) return;
	if (!data.Dictionary || !data.Dictionary.length) return;
	var noiseLevelModifier = 0;
	var audioFile = "";

	// Instant actions can trigger a sound depending on the asset
	if (data.Content == "ActionAddLock") {
		audioFile = "Audio/LockSmall.mp3";
	} else if (data.Content == "TimerRelease" || data.Content == "ActionUnlock" || data.Content == "ActionUnlockAndRemove") {
		audioFile = "Audio/UnlockSmall.mp3";
	} else if (data.Content == "ActionLock" || data.Content == "ActionUse" || data.Content == "ActionSwap" || data.Content == "SlaveCollarChangeType" || (data.Content.indexOf("ActionActivity") == 0)) {
		noiseLevelModifier += 3; //constant vibration volume level
		var NextAsset = data.Dictionary.find(function (el) {return el.Tag == "NextAsset";});
		if (!NextAsset || !NextAsset.AssetName) return;
		if (NextAsset.AssetName == "LeatherCrop")
			audioFile = "Audio/SmackBareSkin04-1.mp3";
		else if (NextAsset.AssetName == "LeatherWhip")
			audioFile = "Audio/SmackWhip2.mp3";
		else if (NextAsset.AssetName == "SpankingToys") {
			if (data.Dictionary.find(function (g) { return g.AssetGroupName; }) == "ItemHands") return;
			var characterSource = ChatRoomCharacter.find(function (e1) { return e1.MemberNumber == data.Sender; });
			var equippedItem = InventoryGet(characterSource, "ItemHands");
			if (!equippedItem || !equippedItem.Property) return;
			switch (equippedItem.Property.Type) {
				case "Crop":
				case "Flogger": audioFile = "Audio/SmackBareSkin04-1.mp3"; break;
				case "Cane":
				case "HeartCrop": audioFile = "Audio/SmackBareSkin04-2.mp3"; break;
				case "Paddle":
				case "WhipPaddle":
				case "TennisRacket": audioFile = "Audio/SmackBareSkin04-3.mp3"; break;
				case "Whip": audioFile = "Audio/SmackWhip1.mp3"; break;
				case "CattleProd": audioFile = "Audio/Shocks.mp3"; break;
				default: return;
			}
		} else {
			switch (NextAsset.AssetName) {
				case "VibratingWand" : audioFile = "Audio/Wand.mp3"; break;
				case "Zipties" : audioFile = "Audio/ZipTie.mp3"; break;
				case "DuctTape" : audioFile = "Audio/DuctTape18.mp3"; break;
				case "InflatableBodyBag":
				case "BurlapSack": audioFile = "Audio/Bag.mp3"; break;
				case "HempRope": audioFile = "Audio/RopeShort.mp3"; break;
				case "CollarChainShort":
				case "CollarChainLong":
				case "Chains":
				case "CrotchChain":
				case "Manacles":
				case "FullBodyShackles": audioFile = "Audio/ChainLong.mp3"; break;
				case "PolishedSteelHood":
				case "WoodenBox":
				case "SmallWoodenBox":
				case "Cage":
				case "LowCage":
				case "TheDisplayFrame":
				case "DisplayCase":
				case "SmallDisplayCase":
				case "HighSecurityCollar": audioFile = "Audio/LockLarge.mp3"; break;
				case "ChainLeash":
				case "CollarLeash":
				case "MetalCuffs":
				case "ToeCuffs": audioFile = "Audio/LockSmall.mp3"; break;
				case "PolishedMittens":
				case "SteelMuzzleGag":
				case "BondageBouquet":
				case "Irish8Cuffs":
				case "WristShackles":
				case "AnkleShackles":
				case "SlenderSteelCollar":
				case "OrnateCollar":
				case "OrnateLegCuffs":
				case "OrnateAnkleCuffs":
				case "OrnateCuffs":
				case "OrnateChastityBelt":
				case "OrnateChastityBra":
				case "MetalChastityBelt":
				case "MetalChastityBra":
				case "PolishedChastityBelt":
				case "PolishedChastityBra":
				case "LoveChastityBelt":
				case "SteelChastityPanties":
				case "SteelPostureCollar": audioFile = "Audio/CuffsMetal.mp3"; break;
				case "LeatherCollarBell": audioFile = "Audio/BellMedium.mp3"; break;
				case "BellClamps":
				case "BellClitPiercing":
				case "BellPiercing": audioFile = "Audio/BellSmall.mp3"; break;
				default: return;
			}
		}
	} else {
		// When the vibrator or inflatable level increases or decreases
		if(data.Content.includes("pumps") || data.Content.includes("Suctightens") || data.Content.includes("InflatableBodyBagRestrain"))
			audioFile = "Audio/Inflation.mp3";
		else if(data.Content.includes("deflates") || data.Content.includes("Sucloosens"))
			audioFile = "Audio/Deflation.mp3";
		else if (data.Content.includes("Decrease") || data.Content.includes("Increase")) { 
			if (data.Content.endsWith("-1")) return; // special case of turning vibrators off, may be a click sound in the future?
			var vibrationLevel = parseInt(data.Content.substr(data.Content.length - 1));
			if (!isNaN(vibrationLevel)) noiseLevelModifier += vibrationLevel * 3;
			var assetName = data.Content.substring(0, data.Content.length - "IncreaseTo1".length);
			switch (assetName) {
				case "VibeHeartClitPiercing":
				case "NippleHeart":
				case "Nipple":
				case "NippleEgg":
				case "TapedClitEgg":
				case "Egg": audioFile = "Audio/VibrationTone4ShortLoop.mp3"; break;
				case "LoveChastityBeltVibe":
				case "Belt":
				case "Panties": audioFile = "Audio/VibrationTone4Long3.mp3"; break;
				case "Buttplug":
				case "InflVibeButtPlug_Vibe":
				case "InflVibeDildo_Vibe":
				case "Dildo": audioFile = "Audio/VibrationTone4Long6.mp3"; break;
				case "Sybian": audioFile = "Audio/Sybian.mp3"; break;
				default: return;
			}
		} else if (data.Content.includes("CollarShockUnitTrigger") || data.Content.includes("ShockCollarTrigger") || data.Content.includes("LoveChastityBeltShockTrigger")) {
			var shockLevel = parseInt(data.Content.substr(data.Content.length - 1));
			if (!isNaN(shockLevel)) noiseLevelModifier+= shockLevel * 3;
			audioFile = "Audio/Shocks.mp3";
		} else if (data.Content.includes("ShacklesRestrain") || data.Content.includes("Ornate")){
			audioFile = "Audio/CuffsMetal.mp3";
		} else if (data.Content.includes("RopeSet")){
			audioFile = "Audio/RopeShort.mp3";
			data.Sender = data.Dictionary.find(function (el) {return el.Tag == "SourceCharacter";}).MemberNumber;
		} else if (data.Content.includes("ChainSet")){
			audioFile = "Audio/ChainLong.mp3";
			data.Sender = data.Dictionary.find(function (el) {return el.Tag == "SourceCharacter";}).MemberNumber;
		}
	}

	// Update noise level depending on who the interaction took place between.  Sensory isolation increases volume for self, decreases for others.
	if (!audioFile) return;
	var target = data.Dictionary.find(function (el) {return el.Tag == "DestinationCharacter" || el.Tag == "DestinationCharacterName" || el.Tag == "TargetCharacter";});
	if (!target || !target.MemberNumber) return;

	var targetIsPlayer = target.MemberNumber == Player.MemberNumber;

	// If the player is the target, increase volume
	if (targetIsPlayer) noiseLevelModifier += 3;

	// If the player is blindfolded, increase volume based on blindfold level
	if (Player.Effect.indexOf("BlindHeavy") >= 0) noiseLevelModifier += 4;
	else if (Player.Effect.indexOf("BlindNormal") >= 0) noiseLevelModifier += 2;
	else if (Player.Effect.indexOf("BlindLight") >= 0) noiseLevelModifier += 1;

	// Reduce volume based on player's deafness level
	noiseLevelModifier -= (3 * Player.GetDeafLevel());

	// Reduce volume a little if the player was neither the sender nor target
	if (data.Sender != Player.MemberNumber && !targetIsPlayer) noiseLevelModifier -= 3;

	// Sends the audio file to be played
	AudioPlayInstantSound(audioFile, Player.AudioSettings.Volume * (.2 + noiseLevelModifier / 40));
}
