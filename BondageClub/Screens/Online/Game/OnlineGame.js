"use strict";
var OnlineGameName = "";
var OnlineGameDictionary = null;

/**
 * Loads the online game dictionary that will be used throughout the game to output messages
 * @returns {void} - Nothing
 */
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

/**
 * Searches in the dictionary for a specific keyword and returns the message linked to it
 * @param {string} KeyWord - Keyword of the text to look for
 * @returns {string} The text attached to the keyword, will return a missing text if it was not found 
 */
function OnlineGameDictionaryText(KeyWord) {
	for (var D = 0; D < OnlineGameDictionary.length; D++)
		if (OnlineGameDictionary[D][0] == OnlineGameName + KeyWord)
			return OnlineGameDictionary[D][1].trim();
	return "MISSING ONLINE GAME DESCRIPTION FOR KEYWORD " + KeyWord;
}

/**
 * Catches the character click from chat rooms and make sure the online game doesn't need to handle them
 * @param {Character} C - Character that has been clicked on
 * @return {*} Returns the return content of click function of the currently selected game, or false if there is no corresponding game
 */
function OnlineGameClickCharacter(C) {
	if ((ChatRoomSpace == "LARP") && (GameLARPStatus != "")) return GameLARPCharacterClick(C);
	return false;
}

/**
 * Catches the chat room clicks and make sure the online game doesn't need to handle them
 * @return {*} Returns the return content of click function of the currently selected game, or false if there is no corresponding game
 */
function OnlineGameClick() {
	if ((ChatRoomSpace == "LARP") && (GameLARPStatus != "")) return GameLARPClickProcess();
	return false;
}

/**
 * Run the corresponding online game scripts
 * @returns {void} - Nothing
 */
function OnlineGameRun() {

	// In LARP, the player turn can be skipped by an administrator after 20 seconds
	if (OnlineGameName == "LARP") GameLARPRunProcess();

}

/**
 * Checks if clothes can be changed in an online game space
 * @returns {boolean} - Returns TRUE if there's no online game that currently blocks changing
 */
function OnlineGameAllowChange() {
	if ((OnlineGameName == "LARP") && (GameLARPStatus != "")) return false;
	return true;
}

/**
 * Checks if blocking items is currently allowed
 * @returns {boolean} - Returns TRUE if the online game allows you to block items
 */
function OnlineGameAllowBlockItems() {
	if ((OnlineGameName == "LARP") && (GameLARPStatus != "")) return false;
	return true;
}

/**
 * Retrieves the current status of online games and stores it in GameLARPStatus
 * @returns {void} - Nothing
 */
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

/**
 * Draws the online game images/text needed on the characters
 * @param {Character} C - Character to draw the info for
 * @param {number} X - Position of the character the X axis
 * @param {number} Y - Position of the character the Y axis
 * @param {number} Zoom - Amount of zoom the character has (Height)
 * @returns {void} - Nothing 
 */
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
