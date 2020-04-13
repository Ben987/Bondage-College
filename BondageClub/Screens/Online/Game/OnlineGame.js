"use strict";
var OnlineGameName = "";
var OnlineGameDictionary = null;

// Loads the online game dictionary that will be used throughout the game to output messages
function OnlneGameDictionaryLoad() {
	if (OnlineGameDictionary == null) {

		// Tries to read it from cache first
		var FullPath = "Screens/Online/Game/OnlineGameDictionary.csv";
		if (CommonCSVCache[FullPath]) {
			OnlineGameDictionary = CommonCSVCache[FullPath];
			return;
		}

		// Opens the file, parse it and returns the result in an object
		CommonGet(FullPath, function () {
			if (this.status == 200) {
				CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
				OnlineGameDictionary = CommonCSVCache[FullPath];
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
function OnlineGameDictionaryText(KeyWord) {
	for (var D = 0; D < OnlineGameDictionary.length; D++)
		if (OnlineGameDictionary[D][0] == OnlineGameName + KeyWord)
			return OnlineGameDictionary[D][1].trim();
	return "MISSING ONLINE GAME DESCRIPTION FOR KEYWORD " + KeyWord;
}

// Catches the character click from chat rooms and make sure the online game doesn't need to handle them
function OnlineGameClickCharacter(C) {
	if ((ChatRoomSpace == "LARP") && (GameLARPStatus != "")) return GameLARPCharacterClick(C);
	return false;
}

// Catches the chat room clicks and make sure the online game doesn't need to handle them
function OnlineGameClick() {
	if ((ChatRoomSpace == "LARP") && (GameLARPStatus != "")) return GameLARPClickProcess();
	return false;
}

// Run the online game scripts
function OnlineGameRun() {

	// In LARP, the player turn can be skipped by an administrator after 20 seconds
	if (OnlineGameName == "LARP") GameLARPRunProcess();

}

// Returns TRUE if there's no online game that blocks changing
function OnlineGameAllowChange() {
	if ((OnlineGameName == "LARP") && (GameLARPStatus != "")) return false;
	return true;
}

// Returns TRUE if the online game allows you to block items
function OnlineGameAllowBlockItems() {
	if ((OnlineGameName == "LARP") && (GameLARPStatus != "")) return false;
	return true;
}

// Retrieves the current status of online games
function OnlineGameLoadStatus() {
	if (OnlineGameName == "LARP") {
		for (var C = 0; C < ChatRoomCharacter.length; C++)
			if ((ChatRoomData.Admin.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) && (ChatRoomCharacter[C].Game.LARP.Status != "")) {
				GameLARPStatus = ChatRoomCharacter[C].Game.LARP.Status;
				return;
			}
		GameLARPStatus = "";
	}
}

// Draws the online game images needed on the characters
function OnlineGameDrawCharacter(C, X, Y, Zoom) {
	if ((CurrentModule == "Online") && (CurrentScreen == "ChatRoom") && (OnlineGameName == "LARP")) {
		GameLARPDrawIcon(C, X + 70 * Zoom, Y + 800 * Zoom, 0.6 * Zoom);
		if ((GameLARPPlayer.length > 0) && (C.MemberNumber == GameLARPPlayer[GameLARPTurnPosition].MemberNumber) && (GameLARPStatus == "Running") && (GameLARPTurnFocusCharacter == null)) {
			MainCanvas.font = "72px Arial";
			var Time = Math.ceil((GameLARPTurnTimer - CurrentTime) / 1000);
			DrawText(((Time < 0) || (Time > 20)) ? OnlineGameDictionaryText("TimerNA") : Time.toString(), X + 250 * Zoom, Y + 830 * Zoom, "Red", "Black");
			MainCanvas.font = "36px Arial";
		}
	}
}
