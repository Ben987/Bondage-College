"use strict";
var AudioDialog = new Audio();

// Players a sound with a set volume
function AudioPlayInstantSound(src, volume) {
	var audio = new Audio();
	audio.src = src;
	audio.volume = volume;
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
	if (data.Content == "ActionUse") {
		noiseLevelModifier += 3; //constant vibration volume level
		var NextAsset = data.Dictionary.find(function (el) {return el.Tag == "NextAsset";});
		if (!NextAsset || !NextAsset.AssetName) return;
		if (NextAsset.AssetName == "LeatherCrop")
			audioFile = "Audio/SmackBareSkin04-1.mp3";
		else if (NextAsset.AssetName == "LeatherWhip")
			audioFile = "Audio/SmackWhip2.mp3";
		else if (NextAsset.AssetName == "SpankingToys") {
			var characterSource = ChatRoomCharacter.find(function(e1){return e1.MemberNumber == data.Sender;});
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
				default: return;
			}
		}
	} else {

		// When the vibrator or inflatable level increases or decreases
		if(data.Content.includes("Pumppumps"))
			audioFile = "Audio/Inflation.mp3";
		else if(data.Content.includes("Pumpdeflates"))
			audioFile = "Audio/Deflation.mp3";
		else if (data.Content.includes("Decrease") || data.Content.includes("Increase")) { 
			if (data.Content.endsWith("-1")) return; // special case of turning vibrators off, may be a click sound in the future?
			var vibrationLevel = parseInt(data.Content.substr(data.Content.length - 1));
			if (!isNaN(vibrationLevel)) noiseLevelModifier += vibrationLevel * 3;
			var assetName = data.Content.substring(0, data.Content.length - "IncreaseTo1".length);
			switch (assetName) {
				case "Nipple":
				case "NippleEgg":
				case "LoveChastityBeltVibe":
				case "Egg": audioFile = "Audio/VibrationTone4ShortLoop.mp3"; break;
				case "Belt":
				case "Buttplug":
				case "Panties": audioFile = "Audio/VibrationTone4Long3.mp3"; break;
				case "InflVibeDildo_Vibe":
				case "Dildo": audioFile = "Audio/VibrationTone4Long6.mp3"; break;
				case "Sybian": audioFile = "Audio/Sybian.mp3"; break;
				default: return;
			}
		} else if (data.Content.includes("CollarShockUnitTrigger") || data.Content.includes("ShockCollarTrigger") || data.Content.includes("LoveChastityBeltShockTrigger")) {
			var shockLevel = parseInt(data.Content.substr(data.Content.length - 1));
			if (!isNaN(shockLevel)) noiseLevelModifier+= shockLevel * 3;
			audioFile = "Audio/Shocks.mp3";
		}

	}

	// Update noise level depending on who the interaction took place between.  Sensory isolation increases volume for self, decreases for others.
	if (!audioFile) return;
	var target = data.Dictionary.find(function (el) {return el.Tag == "DestinationCharacter" || el.Tag == "DestinationCharacterName";});
	if (!target || !target.MemberNumber) return;

	// Changes the volume based on sensory deprivation
	if (target.MemberNumber == Player.MemberNumber) {
		noiseLevelModifier += 2;
		if (Player.Effect.indexOf("BlindHeavy") >= 0) noiseLevelModifier += 5;
		else if (Player.Effect.indexOf("BlindNormal") >= 0) noiseLevelModifier += 3;
		else if (Player.Effect.indexOf("BlindLight") >= 0) noiseLevelModifier += 1;
		if (Player.Effect.indexOf("DeafTotal") >= 0) noiseLevelModifier += 6;
		else if (Player.Effect.indexOf("DeafHeavy") >= 0) noiseLevelModifier += 5;
		else if (Player.Effect.indexOf("DeafNormal") >= 0) noiseLevelModifier += 3;
		else if (Player.Effect.indexOf("DeafLight") >= 0) noiseLevelModifier += 1;
	} else {
		if (Player.Effect.indexOf("DeafTotal") >= 0) noiseLevelModifier -= 4;
		else if (Player.Effect.indexOf("DeafHeavy") >= 0) noiseLevelModifier -= 3;
		else if (Player.Effect.indexOf("DeafNormal") >= 0) noiseLevelModifier -= 2;
		else if (Player.Effect.indexOf("DeafLight") >= 0) noiseLevelModifier -= 1;
	}

	// Sends the audio file to be played
	if (data.Sender != Player.MemberNumber && target.MemberNumber != Player.MemberNumber) noiseLevelModifier -= 2;
	AudioPlayInstantSound(audioFile, Player.AudioSettings.Volume * (.1 + noiseLevelModifier / 30));

}