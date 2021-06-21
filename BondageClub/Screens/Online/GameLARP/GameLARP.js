"use strict";
var GameLARPBackground = "Sheet";
var GameLARPClass = [
	{
		Name: "Matron",
		Bonus: [0.20, 0.00],
		Ability: ["Charge", "Control", "Detain"]
	},
	{
		Name: "Seducer",
		Bonus: [0.16, 0.04],
		Ability: ["Expose", "Inspire", "Seduce"]
	},
	{
		Name: "Trickster",
		Bonus: [0.12, 0.08],
		Ability: ["Confuse", "Hide", "Immobilize"]
	},
	{
		Name: "Artist",
		Bonus: [0.08, 0.12],
		Ability: ["Cheer", "Costume", "Evasion"]
	},
	{
		Name: "Servant",
		Bonus: [0.04, 0.16],
		Ability: ["Rescue", "Silence", "Ungag"]
	},
	{
		Name: "Protector",
		Bonus: [0.00, 0.20],
		Ability: ["Cover", "Dress", "Support"]
	},
];
var GameLARPTeamList = ["None", "Red", "Green", "Blue", "Yellow", "Cyan", "Purple", "Orange", "White", "Gray", "Black"];
var GameLARPTimerDelay = [20, 60];
var GameLARPEntryClass = "";
var GameLARPEntryTeam = "";
var GameLARPStatus = "";
var GameLARPProgress = [];
var GameLARPPlayer = [];
var GameLARPOption = [];
var GameLARPAction = "";
var GameLARPInventory = [];
var GameLARPInventoryOffset = 0;
var GameLARPTurnAdmin = 0;
var GameLARPTurnPosition = 0;
var GameLARPTurnAscending = true;
var GameLARPTurnTimer = null;
var GameLARPTurnTimerDelay = GameLARPTimerDelay[0];
var GameLARPTurnFocusCharacter = null;
var GameLARPTurnFocusGroup = null;

/**
 * Checks if the character is an admin or the LARP admin while the game is going.
 * @param {Character} C - Character to check for
 * @returns {boolean} -  Returns TRUE if that character is an admin/the game administrator
 */
function GameLARPIsAdmin(C) {
	if (GameLARPStatus == "")
		return (ChatRoomData.Admin.indexOf(C.MemberNumber) >= 0);
	else
		return (GameLARPTurnAdmin == C.MemberNumber);
}

/**
 * Draws the LARP class/team icon of a character
 * @param {Character} C - Character for which to draw the icons
 * @param {number} X - Position on the X axis of the canvas
 * @param {number} Y - Position on the Y axis of the canvas
 * @param {number} Zoom - Zoom factor of the character
 * @returns {void} - Nothing
 */
function GameLARPDrawIcon(C, X, Y, Zoom) {
	if ((C != null) && (C.Game != null) && (C.Game.LARP != null) && (C.Game.LARP.Class != null) && (C.Game.LARP.Team != null) && (C.Game.LARP.Team != "") && (C.Game.LARP.Team != "None"))
		DrawImageZoomCanvas("Icons/LARP/" + C.Game.LARP.Class + C.Game.LARP.Team + ".png", MainCanvas, 0, 0, 100, 100, X, Y, 100 * Zoom, 100 * Zoom);
}

/**
 * Loads the LARP game.
 * @returns {void} - Nothing
 */
function GameLARPLoad() {
	if (Player.Game == null) Player.Game = {};
	if (Player.Game.LARP == null) Player.Game.LARP = {};
	if (Player.Game.LARP.Class == null) Player.Game.LARP.Class = GameLARPClass[0].Name;
	if (Player.Game.LARP.Team == null) Player.Game.LARP.Team = GameLARPTeamList[0];
	if (Player.Game.LARP.TimerDelay == null) Player.Game.LARP.TimerDelay = GameLARPTimerDelay[0];
	GameLARPEntryClass = Player.Game.LARP.Class;
	GameLARPEntryTeam = Player.Game.LARP.Team;
	if (GameLARPStatus == "") GameLARPProgress = [];
}

/**
 * Runs and draws the LARP game.
 * @returns {void} - Nothing
 */
function GameLARPRun() {

	// Draw the character, text and buttons
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Title"), 550, 125, "Black", "Gray");
	DrawText(TextGet("SelectClass"), 550, 225, "Black", "Gray");
	DrawText(TextGet("SelectTeam"), 550, 425, "Black", "Gray");
	if (GameLARPStatus != "") DrawText(TextGet("Class" + Player.Game.LARP.Class), 900, 225, "Black", "Gray");
	DrawText(TextGet("LevelProgress"), 550, 325, "Black", "Gray");
	DrawText(GameLARPGetClassLevel(Player.Game.LARP) + " (" + Math.floor(GameLARPGetClassProgress(Player.Game.LARP) / 10).toString() + "%)", 900, 325, "Black", "Gray");
	if (GameLARPStatus != "") DrawText(TextGet("Color" + Player.Game.LARP.Team), 900, 425, "Black", "Gray");
	DrawText(TextGet((GameLARPStatus == "") ? "StartCondition" : "RunningGame"), 550, 525, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (GameLARPStatus == "") DrawBackNextButton(900, 193, 400, 64, TextGet("Class" + Player.Game.LARP.Class), "White", "", () => "", () => "");
	if (GameLARPStatus == "") DrawBackNextButton(900, 393, 400, 64, TextGet("Color" + Player.Game.LARP.Team), "White", "", () => "", () => "");
	GameLARPDrawIcon(Player, 1400, 225, 2);
	if (GameLARPCanLaunchGame()) DrawBackNextButton(550, 600, 400, 65, TextGet("TimerDelay" + Player.Game.LARP.TimerDelay), "White", "", () => "", () => "");
	if (GameLARPCanLaunchGame()) DrawButton(1050, 600, 400, 65, TextGet("StartGame"), "White");

}

/**
 * Runs the game from the chat room
 * @returns {void} - Nothing
 */
function GameLARPRunProcess() {

	// If the player is an admin, she can make player skip their turns
	if ((GameLARPStatus == "Running") && (TimerGetTime() > GameLARPTurnTimer) && GameLARPIsAdmin(Player)) {
		GameLARPTurnTimer = TimerGetTime() + (GameLARPTurnTimerDelay * 1000);
		ServerSend("ChatRoomGame", { GameProgress: "Skip" });
	}

	// Clears the focused character if it's not the player turn
	if ((GameLARPTurnFocusCharacter != null) && ((GameLARPStatus != "Running") || (GameLARPPlayer[GameLARPTurnPosition].ID != 0))) GameLARPTurnFocusCharacter = null;

	// If we must show the focused character and available abilities
	if (GameLARPTurnFocusCharacter != null) {

		// Draw the room dark background
		DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 500, 0, 1000, 1000, 0, 0, 1000, 1000);
		DrawRect(0, 0, 1000, 1000, "rgba(0,0,0," + 0.5 + ")");

		// In inventory selection mode
		if (GameLARPTurnFocusGroup != null) {

			// Draw the label and buttons
			DrawText(OnlineGameDictionaryText("ItemSelect"), 263, 50, "White", "Gray");
			if (GameLARPInventory.length > 12) DrawButton(525, 20, 200, 60, OnlineGameDictionaryText("ItemNext"), "White");
			DrawButton(775, 20, 200, 60, OnlineGameDictionaryText("ItemCancel"), "White");

			// Prepares a 4x3 square selection with inventory from the buffer
			var X = 15;
			var Y = 110;
			for (let A = GameLARPInventoryOffset; (A < GameLARPInventory.length) && (A < GameLARPInventoryOffset + 12); A++) {
				const asset = GameLARPInventory[A];
				const Hover = MouseIn(X, Y, 225, 275) && !CommonIsMobile;
				const Hidden = CharacterAppearanceItemIsHidden(asset.Name, asset.Group.Name);
				if (Hidden) DrawPreviewBox(X, Y, "Icons/HiddenItem.png", asset.Description, { Background: Hover ? "cyan" : "#fff" });
				else DrawAssetPreview(X, Y, asset, {Hover: true});

				X = X + 250;
				if (X > 800) {
					X = 15;
					Y = Y + 300;
				}
			}

		} else {

			// Draw all the possible options
			DrawCharacter(GameLARPTurnFocusCharacter, 500, 0, 1);
			for (let O = 0; O < GameLARPOption.length; O++)
				DrawButton(50, 35 + (O * 100), 400, 65, OnlineGameDictionaryText("Option" + GameLARPOption[O].Name).replace("OptionOdds", Math.round(GameLARPOption[O].Odds * 100)), "White");
			DrawButton(50, 900, 400, 65, OnlineGameDictionaryText("BackToCharacters"), "White");

			// Draw the timer
			MainCanvas.font = CommonGetFont(108);
			var Time = Math.ceil((GameLARPTurnTimer - TimerGetTime()) / 1000);
			DrawText(((Time < 0) || (Time > GameLARPTimerDelay[GameLARPTimerDelay.length - 1])) ? OnlineGameDictionaryText("TimerNA") : Time.toString(), 250, 800, "Red", "White");
			MainCanvas.font = CommonGetFont(36);

		}

	}

	// Reset any notification that may have been raised
	if (document.hasFocus()) NotificationReset(NotificationEventType.LARP);
}

/**
 * Builds the inventory selection list for a given asset group.
 * @param {string} FocusGroup - Asset group for which to build the inventory.
 * @returns {void} - Nothing
 */
function GameLARPBuildInventory(FocusGroup) {
	GameLARPTurnFocusGroup = FocusGroup;
	GameLARPInventory = [];
	GameLARPInventoryOffset = 0;
	for (let A = 0; A < Player.Inventory.length; A++)
		if ((Player.Inventory[A].Asset != null) && (Player.Inventory[A].Asset.Group.Name == FocusGroup) && Player.Inventory[A].Asset.Enable && Player.Inventory[A].Asset.Wear && Player.Inventory[A].Asset.Random)
			GameLARPInventory.push(Player.Inventory[A].Asset);
	GameLARPInventory.sort((a,b) => (a.Description > b.Description) ? 1 : ((b.Description > a.Description) ? -1 : 0));
}

/**
 * Triggered when an option is selected for the current target character. The inventory for it is built and the action is published
 * @param {string} Name - Name of the selected option
 * @returns {void} - Nothing
 */
function GameLARPClickOption(Name) {
	GameLARPAction = Name;
	if ((Name == "RestrainLegs") || (Name == "Immobilize")) return GameLARPBuildInventory("ItemFeet");
	if ((Name == "RestrainMouth") || (Name == "Silence")) return GameLARPBuildInventory("ItemMouth");
	if ((Name == "RestrainArms") || (Name == "Detain")) return GameLARPBuildInventory("ItemArms");
	if ((Name == "Costume") || (Name == "Dress")) return GameLARPBuildInventory("Cloth");
	ServerSend("ChatRoomGame", { GameProgress: "Action", Action: Name, Target: GameLARPTurnFocusCharacter.MemberNumber });
}

/**
 * Handles clicks during the LARP game.
 * @returns {boolean} - Returns TRUE if the click was handled by this LARP click handler
 */
function GameLARPClickProcess() {

	// Do not handle any click if no character is selected, a target is required here
	if (GameLARPTurnFocusCharacter == null) return false;

	// In inventory selection mode
	if (GameLARPTurnFocusGroup != null) {

		// If "Next" or "Cancel" is clicked
		if ((GameLARPInventory.length > 12) && MouseIn(525, 20, 200, 60)) {
			GameLARPInventoryOffset = GameLARPInventoryOffset + 12;
			if (GameLARPInventoryOffset >= GameLARPInventory.length) GameLARPInventoryOffset = 0;
		}
		if (MouseIn(775, 20, 200, 60)) GameLARPTurnFocusGroup = null;

		// Checks if one of the 4x3 inventory square is clicked
		var X = 15;
		var Y = 110;
		for (let A = GameLARPInventoryOffset; (A < GameLARPInventory.length) && (A < GameLARPInventoryOffset + 12); A++) {
			if ((MouseX >= X) && (MouseX <= X + 225) && (MouseY >= Y) && (MouseY <= Y + 275))
				ServerSend("ChatRoomGame", { GameProgress: "Action", Action: GameLARPAction, Item: GameLARPInventory[A].Name, Target: GameLARPTurnFocusCharacter.MemberNumber });
			X = X + 250;
			if (X > 800) {
				X = 15;
				Y = Y + 300;
			}
		}

	} else {

		// If we must catch the click on one of the buttons
		for (let O = 0; O < GameLARPOption.length; O++)
			if ((MouseX >= 50) && (MouseX < 450) && (MouseY >= 35 + (O * 100)) && (MouseY <= 100 + (O * 100)))
				GameLARPClickOption(GameLARPOption[O].Name);

		// If we must exit from the currently focused character
		if (MouseIn(50, 900, 400, 65)) GameLARPTurnFocusCharacter = null;

	}

	// Flags the click as being handled
	return true;

}

/**
 * Starts a LARP match.
 * @returns {void} - Nothing
 */
function GameLARPStartProcess() {

	// Gives a delay in seconds, based on the player preference
	GameLARPTurnTimer = TimerGetTime() + (GameLARPTurnTimerDelay * 1000);

	// Notices everyone in the room that the game starts
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	ServerSend("ChatRoomChat", { Content: "LARPGameStart", Type: "Action" , Dictionary: Dictionary});

	// Changes the game status and exits
	ServerSend("ChatRoomGame", { GameProgress: "Start" });
	Player.Game.LARP.Status = "Running";
	ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
	ChatRoomCharacterUpdate(Player);
}

/**
 * Handles clicks in the LARP chat Admin screen
 * @returns {void} - Nothing
 */
function GameLARPClick() {

	// When the user exits
	if (MouseIn(1815, 75, 90, 90)) GameLARPExit();

	// When the user selects a new class
	if (MouseIn(900, 193, 400, 64) && (GameLARPStatus == "")) {
		var Index = 0;
		for (let I = 0; I < GameLARPClass.length; I++)
			if (GameLARPClass[I].Name == Player.Game.LARP.Class)
				Index = I;
		if (MouseX <= 1100) Index = (Index <= 0) ? GameLARPClass.length - 1 : Index - 1;
		else Index = (Index >= GameLARPClass.length - 1) ? 0 : Index + 1;
		Player.Game.LARP.Class = GameLARPClass[Index].Name;
	}

	// When the user selects a new team
	if (MouseIn(900, 393, 400, 64) && (GameLARPStatus == "")) {
		if (MouseX <= 1100) Player.Game.LARP.Team = (GameLARPTeamList.indexOf(Player.Game.LARP.Team) <= 0) ? GameLARPTeamList[GameLARPTeamList.length - 1] : GameLARPTeamList[GameLARPTeamList.indexOf(Player.Game.LARP.Team) - 1];
		else Player.Game.LARP.Team = (GameLARPTeamList.indexOf(Player.Game.LARP.Team) >= GameLARPTeamList.length - 1) ? GameLARPTeamList[0] : GameLARPTeamList[GameLARPTeamList.indexOf(Player.Game.LARP.Team) + 1];
	}

	// When the user selects a new timer delay
	if (MouseIn(550, 600, 400, 65) && GameLARPCanLaunchGame()) {
		if (MouseX <= 750) Player.Game.LARP.TimerDelay = (GameLARPTimerDelay.indexOf(Player.Game.LARP.TimerDelay) <= 0) ? GameLARPTimerDelay[GameLARPTimerDelay.length - 1] : GameLARPTimerDelay[GameLARPTimerDelay.indexOf(Player.Game.LARP.TimerDelay) - 1];
		else Player.Game.LARP.TimerDelay = (GameLARPTimerDelay.indexOf(Player.Game.LARP.TimerDelay) >= GameLARPTimerDelay.length - 1) ? GameLARPTimerDelay[0] : GameLARPTimerDelay[GameLARPTimerDelay.indexOf(Player.Game.LARP.TimerDelay) + 1];
	}

	// If the administrator wants to start the game
	if (MouseIn(1050, 600, 400, 65) && GameLARPCanLaunchGame()) {

		// Updates the player data
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
		ChatRoomCharacterUpdate(Player);

		// Shuffles all players in the chat room
		for (let C = 0; C < ChatRoomCharacter.length; C++) {
			if (ChatRoomCharacter[C].MemberNumber != Player.MemberNumber) {
				ServerSend("ChatRoomAdmin", { MemberNumber: ChatRoomCharacter[C].MemberNumber, Action: "Shuffle" });
				break;
			}
		}

		// Give time for the server to shuffle the room
		setTimeout(GameLARPStartProcess, 4000);
		CommonSetScreen("Online", "ChatRoom");

	}

}

/**
 * Triggered when the player exits the LARP info screen.
 * @returns {void} - Nothing
 */
function GameLARPExit() {

	// When the game isn't running, we allow to change the class or team
	if (GameLARPStatus == "") {

		// Notices everyone in the room of the change, if there is any
		if (GameLARPEntryClass != Player.Game.LARP.Class || GameLARPEntryTeam != Player.Game.LARP.Team) {
			var Dictionary = [];
			Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
			ServerSend("ChatRoomChat", { Content: "LARPChangeTeamClass", Type: "Action", Dictionary: Dictionary });
		}

		// Updates the player and go back to the chat room
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
		ChatRoomCharacterUpdate(Player);
		CommonSetScreen("Online", "ChatRoom");

	} else {
		Player.Game.LARP.Class = GameLARPEntryClass;
		Player.Game.LARP.Team = GameLARPEntryTeam;
		CommonSetScreen("Online", "ChatRoom");
	}

}

/**
 * Checks if a LARP match can be launched. The player must be an admin and two different teams must be selected.
 * @returns {boolean} - Returns TRUE if the game can be launched
 */
function GameLARPCanLaunchGame() {
	if (Player.Game.LARP.Class == null || Player.Game.LARP.Class == "") return false;
	if (Player.Game.LARP.Team == null || Player.Game.LARP.Team == "None") return false;
	if (GameLARPStatus != "") return false;
	if (!GameLARPIsAdmin(Player)) return false;
	var Team = "";
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].Game.LARP.Team != "") && (ChatRoomCharacter[C].Game.LARP.Team != "None") && (InventoryGet(ChatRoomCharacter[C], "ItemArms") == null)) {
			if (Team == "")
				Team = ChatRoomCharacter[C].Game.LARP.Team;
			else
				if (Team != ChatRoomCharacter[C].Game.LARP.Team)
					return true;
		}
	return false;
}

/**
 * Gets a specific bonus from a given character's class.
 * @param {Character} Target - Character to check for a specific bonus value.
 * @param {number} BonusType - The bonus type to get the value of.
 * @returns {number} - Total bonuses for the given character.
 */
function GameLARPGetBonus(Target, BonusType) {

	// Gets the base class bonus
	var ClassBonus = 0;
	for (let C = 0; C < GameLARPClass.length; C++)
		if (Target.Game.LARP.Class == GameLARPClass[C].Name)
			ClassBonus = GameLARPClass[C].Bonus[BonusType];

	// Gets the class level bonus (0 gives no bonus, 10 gives a 50% to class bonus)
	var LevelBonus = 0;
	if ((Target.Game.LARP.Level != null) && (ClassBonus > 0))
		for (let L = 0; L < Target.Game.LARP.Level.length; L++)
			if ((Target.Game.LARP.Level[L].Name == Target.Game.LARP.Class) && (Target.Game.LARP.Level[L].Level != null) && (typeof Target.Game.LARP.Level[L].Level === "number"))
				if ((Target.Game.LARP.Level[L].Level >= 0) && (Target.Game.LARP.Level[L].Level <= 10))
					LevelBonus = Math.round((ClassBonus * 0.05 * Target.Game.LARP.Level[L].Level) * 100) / 100;

	// The ability bonuses only work for a full cycle (GameLARPPlayer.length * 2)
	var AbilityBonus = 0;
	for (let P = ((GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 > 0) ? GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 : 0); P < GameLARPProgress.length; P++)
		if ((GameLARPProgress[P].Success != null) && (GameLARPProgress[P].Data.GameProgress == "Action")) {
			var Source = GameLARPGetPlayer(GameLARPProgress[P].Sender);
			if ((Source.Game.LARP.Team == Target.Game.LARP.Team) && (GameLARPProgress[P].Data.Action == "Charge") && (BonusType == 0)) AbilityBonus = 0.25;
			if ((Source.Game.LARP.Team == Target.Game.LARP.Team) && (GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == "Support") && (BonusType == 1)) AbilityBonus = 0.25;
			if ((GameLARPProgress[P].Data.Target == Target.MemberNumber) && (GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == "Cheer")) AbilityBonus = 0.25;
		}

	// Returns both bonuses
	return ClassBonus + LevelBonus + AbilityBonus;

}

/**
 * Gets the odds of successfully doing an offensive action on a given character.
 * @param {string} Action - Action attempted.
 * @param {Character} Source - Character doing the move.
 * @param {Character} Target - Character targetted by the move.
 * @returns {number} - Odds of successfully doing an offensive action. The number has two decimals.
 */
function GameLARPGetOdds(Action, Source, Target) {

	// The basic odds are 50% + Offensive bonus of source - Defensive bonus of target
	var Odds = 0.5 + GameLARPGetBonus(Source, 0) - GameLARPGetBonus(Target, 1);

	// Struggling starts at 10% + 10% for each new unsuccessful tries, tightening the bonds will reset it to 10%
	if (Action == "Struggle") {
		Odds = 0.05;
		for (let P = 0; P < GameLARPProgress.length; P++)
			if ((GameLARPProgress[P].Success != null) && (GameLARPProgress[P].Data.GameProgress == "Action")) {
				if ((GameLARPProgress[P].Sender == Source.MemberNumber) && (GameLARPProgress[P].Data.Target == Source.MemberNumber) && (GameLARPProgress[P].Data.Action == "Struggle") && !GameLARPProgress[P].Success) Odds = Odds + 0.05;
				if ((GameLARPProgress[P].Sender == Source.MemberNumber) && (GameLARPProgress[P].Data.Target == Source.MemberNumber) && (GameLARPProgress[P].Data.Action == "Struggle") && GameLARPProgress[P].Success) Odds = 0.05;
				if ((GameLARPProgress[P].Data.Target == Source.MemberNumber) && (GameLARPProgress[P].Data.Action == "RestrainArms") && GameLARPProgress[P].Success) Odds = 0.05;
				if ((GameLARPProgress[P].Data.Target == Source.MemberNumber) && (GameLARPProgress[P].Data.Action == "Tighten") && GameLARPProgress[P].Success) Odds = 0.05;
			}
	}

	// Many actions have fixed %
	if (["Pass", "Charge", "Control", "Hide", "Evasion", "Support", "Dress"].indexOf(Action) >= 0) return (Source.MemberNumber == Target.MemberNumber) ? 1 : 0;
	if (["Inspire", "Cheer", "Costume", "Rescue", "Cover", "Ungag"].indexOf(Action) >= 0) return ((Source.MemberNumber != Target.MemberNumber) && (Source.Game.LARP.Team == Target.Game.LARP.Team)) ? 1 : 0;
	if (["Detain", "Expose", "Seduce", "Confuse", "Immobilize", "Silence", "Tighten"].indexOf(Action) >= 0) return ((Source.MemberNumber != Target.MemberNumber) && (Source.Game.LARP.Team != Target.Game.LARP.Team)) ? 1 : 0;

	// Returns the % between 0 and 1
	if (Odds > 1) Odds = 1;
	if (Odds < 0) Odds = 0;
	return Odds.toFixed(2);

}

/**
 * In LARP, check if the given character can talk.
 * @param {Character} C - Character to check.
 * @returns {boolean} - Whether the character can talk or not
 */
function GameLARPCanTalk(C) { return (InventoryGet(C, "ItemMouth") == null); }
/**
 * In LARP, check if the given character can walk.
 * @param {Character} C - Character to check.
 * @returns {boolean} - Whether the character can walk or not
 */
function GameLARPCanWalk(C) { return (InventoryGet(C, "ItemFeet") == null); }
/**
 * In LARP, check if the given character can act.
 * @param {Character} C - Character to check.
 * @returns {boolean} - Whether the character can act or not
 */
function GameLARPCanAct(C) { return (InventoryGet(C, "ItemArms") == null); }
/**
 * In LARP, check if the given character is wearing clothes.
 * @param {Character} C - Character to check.
 * @returns {boolean} - Whether the character is wearing clothes or not
 */
function GameLARPClothed(C) { return (InventoryGet(C, "Cloth") != null); }

/**
 * Checks if an item can be removed in LARP.
 * @param {Character} C - Character to check for a lock on the given group.
 * @param {string} Zone - Group to check for a lock.
 * @returns {boolean} - Returns TRUE if we can remove an item at a specific zone (cannot remove if there's a custom lock)
 */
function GameLARPCanRemoveItem(C, Zone) {
	var Item = InventoryGet(C, Zone);
	if (Item == null) return false;
	if (InventoryGetLock(Item) != null) return false;
	return true;
}

/**
 * Adds all available class abilities to the built basic options
 * @param {Character} Source - Character about to do an action.
 * @param {Character} Target - The character on which an action is about to be done.
 * @param {Array.<{ Name: string, Odds: number}>} Option - List of the basic options the source character can perform
 * @param {string} Ability - Character's ability.
 * @returns {void} - Nothing
 */
function GameLARPBuildOptionAbility(Source, Target, Option, Ability) {

	// Only the "Evasion" special ability can be used when arms are restrained
	if ((Ability != "Evasion") && !GameLARPCanAct(Source)) return;

	// If the ability was already used in that battle, it cannot be used again, the ability "Inspire" makes it usable once again
	var AlreadyUsed = false;
	for (let P = 0; P < GameLARPProgress.length; P++) {
		if ((GameLARPProgress[P].Sender == Source.MemberNumber) && (GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == Ability)) AlreadyUsed = true;
		if ((GameLARPProgress[P].Success != null) && GameLARPProgress[P].Success && (GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == "Inspire") && (GameLARPProgress[P].Data.Target == Source.MemberNumber)) AlreadyUsed = false;
	}
	if (AlreadyUsed) return;

	// If "Control" or "Confuse" is in progress for this cycle, no class abilities can be used
	for (let P = ((GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 > 0) ? GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 : 0); P < GameLARPProgress.length; P++) {
		if ((GameLARPProgress[P].Success != null) && (GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == "Control")) return;
		if ((GameLARPProgress[P].Success != null) && (GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == "Confuse") && (GameLARPProgress[P].Data.Target == Source.MemberNumber)) return;
	}

	// If the player targets herself
	if (Source.MemberNumber == Target.MemberNumber) {

		// Abilities that can be used on yourself
		let Odds = GameLARPGetOdds(Ability, Source, Source);
		if ((Ability == "Charge") && GameLARPCanWalk(Source)) Option.push({ Name: Ability, Odds: Odds });
		if ((Ability == "Control") && GameLARPCanTalk(Source)) Option.push({ Name: Ability, Odds: Odds });
		if (Ability == "Hide") Option.push({ Name: Ability, Odds: Odds });
		if ((Ability == "Evasion") && (GameLARPCanRemoveItem(Source, "ItemFeet") || GameLARPCanRemoveItem(Source, "ItemArms"))) Option.push({ Name: Ability, Odds: Odds });
		if ((Ability == "Support") && GameLARPCanTalk(Source)) Option.push({ Name: Ability, Odds: Odds });
		if (Ability == "Dress") Option.push({ Name: Ability, Odds: Odds });

	} else {

		// If the player targets someone from her team
		let Odds = GameLARPGetOdds(Ability, Source, Target);
		if (Source.Game.LARP.Team == Target.Game.LARP.Team) {

			// Abilities that can be used on someone from your team
			if (Ability == "Inspire") Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Cheer") && GameLARPCanTalk(Source)) Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Costume") && GameLARPCanWalk(Source)) Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Rescue") && GameLARPCanWalk(Source) && (GameLARPCanRemoveItem(Target, "ItemFeet") || GameLARPCanRemoveItem(Target, "ItemArms"))) Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Cover") && GameLARPCanWalk(Source)) Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Ungag") && GameLARPCanRemoveItem(Target, "ItemMouth")) Option.push({ Name: Ability, Odds: Odds });

		} else {

			// Abilities that are used on players from another team, cannot be used if target arms are restrained
			if (InventoryGet(Target, "ItemArms") != null) return;
			if ((Ability == "Detain") && !GameLARPClothed(Target) && !GameLARPCanTalk(Target) && !GameLARPCanWalk(Target)) Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Expose") && GameLARPClothed(Target)) Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Seduce") && GameLARPCanTalk(Source)) Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Confuse") && GameLARPCanTalk(Source)) Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Immobilize") && !GameLARPClothed(Target) && GameLARPCanWalk(Target)) Option.push({ Name: Ability, Odds: Odds });
			if ((Ability == "Silence") && !GameLARPClothed(Target) && GameLARPCanTalk(Target)) Option.push({ Name: Ability, Odds: Odds });

		}

	}

}

/**
 * Builds the available options a character can perform on another for the LARP menu.
 * @param {Character} Source - Character about to do an action.
 * @param {Character} Target - The character on which an action is about to be done.
 * @returns {Array.<{ Name: string, Odds: number}>} - Options the character can perform
 */
function GameLARPBuildOption(Source, Target) {

	// If the source clicks on herself, she can always pass her turn and do nothing
	var Option = [];
	if (Source.MemberNumber == Target.MemberNumber) Option.push({ Name: "Pass", Odds: GameLARPGetOdds("Pass", Source, Source) });

	// If seduce is in progress on the source, all she can do is pass her turn
	var PassTurn = false;
	for (let P = ((GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 > 0) ? GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 : 0); P < GameLARPProgress.length; P++) {
		if ((GameLARPProgress[P].Success != null) && GameLARPProgress[P].Success && (GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == "Seduce") && (GameLARPProgress[P].Data.Target == Source.MemberNumber)) PassTurn = true;
		if ((GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == "Pass") && (GameLARPProgress[P].Sender == Source.MemberNumber)) PassTurn = false;
	}
	if (PassTurn) return Option;

	// If the source is restrained, she only has the struggle option on herself
	if ((InventoryGet(Source, "ItemArms") != null) && (Source.MemberNumber == Target.MemberNumber))
		Option.push({ Name: "Struggle", Odds: GameLARPGetOdds("Struggle", Source, Source) });

	// If "Hide" or "Cover" are in progress, no offensive abilities can be used
	if (Source.Game.LARP.Team != Target.Game.LARP.Team) {

		// Checks for "Hide"
		var CanTarget = true;
		for (let P = ((GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 > 0) ? GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 : 0); P < GameLARPProgress.length; P++)
			if (GameLARPProgress[P].Sender == Target.MemberNumber)
				CanTarget = !((GameLARPProgress[P].Success != null) && GameLARPProgress[P].Success && (GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == "Hide") && (GameLARPProgress[P].Sender == Target.MemberNumber));
		if (!CanTarget) return Option;

		// Checks for "Cover"
		for (let P = ((GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 > 0) ? GameLARPProgress.length - GameLARPPlayer.length * 2 + 1 : 0); P < GameLARPProgress.length; P++)
			if ((GameLARPProgress[P].Success != null) && GameLARPProgress[P].Success && (GameLARPProgress[P].Data.GameProgress == "Action") && (GameLARPProgress[P].Data.Action == "Cover") && (GameLARPProgress[P].Data.Target == Target.MemberNumber))
				return Option;

	}

	// Gets all abilities for the class and assigns which one can be used
	var Ability = [];
	for (let C = 0; C < GameLARPClass.length; C++)
		if (Source.Game.LARP.Class == GameLARPClass[C].Name)
			Ability = GameLARPClass[C].Ability;
	for (let A = 0; A < Ability.length; A++)
		GameLARPBuildOptionAbility(Source, Target, Option, Ability[A]);

	// Builds the "Strip" & "Restrain" options if the target isn't in the source team
	if ((Target.Game.LARP.Team != Source.Game.LARP.Team) && (InventoryGet(Source, "ItemArms") == null)) {

		// Some actions are different based on the target current restrains
		if (GameLARPClothed(Target)) Option.push({ Name: "Strip", Odds: GameLARPGetOdds("Strip", Source, Target) });
		else if (!GameLARPCanAct(Target)) Option.push({ Name: "Tighten", Odds: GameLARPGetOdds("Tighten", Source, Target) });
		else if (!GameLARPCanWalk(Target) && !GameLARPCanTalk(Target)) Option.push({ Name: "RestrainArms", Odds: GameLARPGetOdds("RestrainArms", Source, Target) });
		else {
			if (GameLARPCanWalk(Target)) Option.push({ Name: "RestrainLegs", Odds: GameLARPGetOdds("RestrainLegs", Source, Target) });
			if (GameLARPCanTalk(Target)) Option.push({ Name: "RestrainMouth", Odds: GameLARPGetOdds("RestrainMouth", Source, Target) });
		}

	}

	// Returns all valid options
	return Option;

}

/**
 * Gets a character from the LARP game by member number
 * @param {number} MemberNumber - Member number of the character to get.
 * @returns {Character | null} - The corresponding character, if it exists.
 */
function GameLARPGetPlayer(MemberNumber) {
	for (let C = 0; C < GameLARPPlayer.length; C++)
		if (GameLARPPlayer[C].MemberNumber == MemberNumber)
			return GameLARPPlayer[C];
	return null;
}

/**
 * Processes an action for a player.
 * @param {string} Action - Action attempted.
 * @param {string} ItemName - Name of the item to attempt to use.
 * @param {Character} Source - Source character of the action
 * @param {Character} Target - Character targetted by the action
 * @param {number} RNG - Random odds received for which the character's odds will be compared.
 * @returns {void} - Nothing
 */
function GameLARPProcessAction(Action, ItemName, Source, Target, RNG) {

	// Skip if the characters aren't valid
	if ((Source == null) || (Target == null)) return;

	// Gets the item description in the user language
	var ItemDesc = "N/A";
	if (ItemName != "") {
		var A;
		if ((Action == "RestrainLegs") || (Action == "Immobilize")) A = AssetGet(Target.AssetFamily, "ItemFeet", ItemName);
		if ((Action == "RestrainArms") || (Action == "Detain")) A = AssetGet(Target.AssetFamily, "ItemArms", ItemName);
		if ((Action == "RestrainMouth") || (Action == "Silence")) A = AssetGet(Target.AssetFamily, "ItemMouth", ItemName);
		if ((Action == "Dress") || (Action == "Costume")) A = AssetGet(Target.AssetFamily, "Cloth", ItemName);
		if ((A != null) && (A.Description != null)) ItemDesc = A.Description;
	}

	// If the odds are successful (0% never succeeds, 100% always succeeds)
	var Odds = GameLARPGetOdds(Action, Source, Target);
	if ((Odds >= 0.01) && ((Odds >= 1) || (Odds >= RNG.toFixed(2)))) {

		// Regular restrain actions
		ChatRoomAllowCharacterUpdate = false;
		if ((Action == "RestrainLegs") || (Action == "Immobilize")) InventoryWear(Target, ItemName, "ItemFeet", null, 6);
		if ((Action == "RestrainArms") || (Action == "Detain")) InventoryWear(Target, ItemName, "ItemArms", null, 6);
		if ((Action == "RestrainMouth") || (Action == "Silence")) InventoryWear(Target, ItemName, "ItemMouth", null, 6);
		if ((Action == "Dress") || (Action == "Costume")) InventoryWear(Target, ItemName, "Cloth");
		ChatRoomAllowCharacterUpdate = true;

		// Struggle and evasion can remove some restraints
		if (Action == "Struggle") InventoryRemove(Target, "ItemArms");
		if (Action == "Ungag") InventoryRemove(Target, "ItemMouth");
		if ((Action == "Evasion") || (Action == "Rescue")) {
			if (InventoryGet(Target, "ItemArms") != null) InventoryRemove(Target, "ItemArms");
			else InventoryRemove(Target, "ItemFeet");
		}

		// Strip / Expose removes the cloth items
		if ((Action == "Strip") || (Action == "Expose")) {
			InventoryRemove(Target, "Cloth");
			InventoryRemove(Target, "ClothLower");
			InventoryRemove(Target, "ClothAccessory");
		}

		// Publishes the success
		GameLARPAddChatLog("Option" + Action + "Success", Source, Target, ItemDesc, RNG, Odds, "#00B000");
		GameLARPProgress[GameLARPProgress.length - 1].Success = true;

	} else {

		// Publishes the failure
		GameLARPAddChatLog("Option" + Action + "Fail", Source, Target, ItemDesc, RNG, Odds, "#B00000");
		GameLARPProgress[GameLARPProgress.length - 1].Success = false;

	}

}

/**
 * Processes the LARP game clicks. This method is called from the generic OnlineGameClickCharacter function when the current game is LARP.
 * @param {Character} C - Character clicked on
 * @returns {boolean} - returns TRUE if the code handles the click
 */
function GameLARPCharacterClick(C) {

	// If it's the player turn, we allow clicking on a character to get the abilities menu
	if ((GameLARPStatus == "Running") && (GameLARPPlayer[GameLARPTurnPosition].ID == 0) && (C.Game != null) && (C.Game.LARP != null) && (C.Game.LARP.Team != null) && (C.Game.LARP.Team != "") && (C.Game.LARP.Team != "None")) {
		GameLARPTurnFocusCharacter = C;
		GameLARPTurnFocusGroup = null;
		GameLARPOption = GameLARPBuildOption(Player, GameLARPTurnFocusCharacter);
	}

	// Flags that transaction as being handled
	return true;

}

/**
 * Adds a LARP message to the chat log.
 * @param {string} Msg - Message tag
 * @param {Character} Source - Source character of the message
 * @param {Character} Target - Character targetted by the message
 * @param {string} Description - Description of the message (item name, team name, etc.)
 * @param {number} RNG - The number given by RNG.
 * @param {number} Odds - The number required for the move to work.
 * @param {string} Color - Color of the message to add.
 * @returns {void} - Nothing
 */
function GameLARPAddChatLog(Msg, Source, Target, Description, RNG, Odds, Color) {

	// The first message of the game is blue
	if (GameLARPProgress.length == 0) Color = "#0000B0";

	// Gets the message from the dictionary
	Msg = OnlineGameDictionaryText(Msg);
	Msg = Msg.replace("SourceName", Source.Name);
	Msg = Msg.replace("SourceNumber", Source.MemberNumber.toString());
	Msg = Msg.replace("TargetName", Target.Name);
	Msg = Msg.replace("TargetNumber", Target.MemberNumber.toString());
	Msg = Msg.replace("ActionRNG", Math.round(RNG * 100).toString());
	Msg = Msg.replace("ActionOdds", Math.round(Odds * 100).toString());
	Msg = Msg.replace("ItemDesc", Description);
	Msg = Msg.replace("TeamName", Description);

	// Adds the message and scrolls down unless the user has scrolled up
	var div = document.createElement("div");
	div.setAttribute('class', 'ChatMessage ChatMessageServerMessage');
	div.setAttribute('data-time', ChatRoomCurrentTime());
	if ((Color != null) && (Color != "")) div.style.color = Color;
	div.innerHTML = Msg;
	var Refocus = document.activeElement.id == "InputChat";
	var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
	if (document.getElementById("TextAreaChatLog") != null) {
		document.getElementById("TextAreaChatLog").appendChild(div);
		if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
		if (Refocus) ElementFocus("InputChat");
	}

}

/**
 * Sets the new turn player and publish it in the chat room
 * @param {number} NewPlayerPosition - Position of the new player
 * @param {boolean} Ascending - Whether or not the turn is ascending
 * @param {string} Msg - Message tag to display such as TurnStart, TurnSkip and TurnNext
 * @returns {void} - Nothing
 */
function GameLARPNewTurnPublish(NewPlayerPosition, Ascending, Msg) {

	// Sets the new position and turn order, the timer is divided by 2 if the are restrained, then publish in the chat log
	GameLARPTurnPosition = NewPlayerPosition;
	GameLARPTurnAscending = Ascending;
	GameLARPTurnTimer = TimerGetTime() + (GameLARPTurnTimerDelay * (GameLARPPlayer[GameLARPTurnPosition].CanInteract() ? 1000 : 500));
	GameLARPAddChatLog(Msg, Player, GameLARPPlayer[GameLARPTurnPosition], "", 0, 0);

}

/**
 * Generates a new turn for the LARP game.
 * @param {string} Msg - Content of the turn message such as TurnNext, TurnStart or TurnSkip
 * @returns {void} - Nothing
 */
function GameLARPNewTurn(Msg) {

	// Resets the focus
	GameLARPTurnFocusCharacter = null;
	GameLARPTurnFocusGroup = null;

	// Cycles in the game player array ascending or descending and shifts the position
	if ((GameLARPTurnAscending) && (GameLARPTurnPosition < GameLARPPlayer.length - 1)) GameLARPNewTurnPublish(GameLARPTurnPosition + 1, true, Msg);
	else if ((GameLARPTurnAscending) && (GameLARPTurnPosition == GameLARPPlayer.length - 1)) GameLARPNewTurnPublish(GameLARPTurnPosition, false, Msg);
	else if ((!GameLARPTurnAscending) && (GameLARPTurnPosition > 0)) GameLARPNewTurnPublish(GameLARPTurnPosition - 1, false, Msg);
	else if ((!GameLARPTurnAscending) && (GameLARPTurnPosition == 0)) GameLARPNewTurnPublish(GameLARPTurnPosition, true, Msg);

	// Raise a notification if it's the player's turn and they're away
	if (!document.hasFocus() && GameLARPPlayer[GameLARPTurnPosition].ID === 0) {
		NotificationRaise(NotificationEventType.LARP);
	}
}

/**
 * Builds the full LARP player list. Someone with no team is not playing the match.
 * @returns {void} - Nothing
 */
function GameLARPBuildPlayerList() {
	GameLARPPlayer = [];
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].Game != null) && (ChatRoomCharacter[C].Game.LARP != null) && (ChatRoomCharacter[C].Game.LARP.Team != null) && (ChatRoomCharacter[C].Game.LARP.Team != "") && (ChatRoomCharacter[C].Game.LARP.Team != "None"))
			GameLARPPlayer.push(ChatRoomCharacter[C]);
}

/**
 * Each time a game is over, in victory or defeat, the player progresses toward the next class level
 * @param {number} NewProgress - The progress factor to apply
 * @returns {void} - Nothing
 */
function GameLARPLevelProgress(NewProgress) {
	if (NewProgress > 50) NewProgress = 50;
	if (Player.Game.LARP.Level == null) Player.Game.LARP.Level = [];
	var Level = 0;
	var Progress = 0;
	var Found = false;
	for (let L = 0; L < Player.Game.LARP.Level.length; L++)
		if (Player.Game.LARP.Level[L].Name == Player.Game.LARP.Class) {
			Level = Player.Game.LARP.Level[L].Level;
			Progress = Player.Game.LARP.Level[L].Progress;
			Found = true;
		}
	if (Found == false) Player.Game.LARP.Level.push({ Name: Player.Game.LARP.Class, Level: 0, Progress: 0 });
	if (Level >= 10) return;
	NewProgress = NewProgress * (12 - Level) * 5;
	if (Progress + NewProgress >= 1000) {
		Level++;
		Progress = 0;
	} else Progress = Progress + NewProgress;
	for (let L = 0; L < Player.Game.LARP.Level.length; L++)
		if (Player.Game.LARP.Level[L].Name == Player.Game.LARP.Class) {
			Player.Game.LARP.Level[L].Level = Level;
			Player.Game.LARP.Level[L].Progress = Progress;
		}
}

/**
 * Returns the class level for a LARP player, based on their LARP object
 * @param {object} LARP - The LARP object, coming from the Character.Game object
 * @returns {number} - The level between 0 and 10
 */
function GameLARPGetClassLevel(LARP) {
	if (LARP.Level == null) return 0;
	for (let L = 0; L < LARP.Level.length; L++)
		if ((LARP.Level[L].Name == LARP.Class) && (typeof LARP.Level[L].Level === "number"))
			if ((LARP.Level[L].Level >= 0) && (LARP.Level[L].Level <= 10))
				return LARP.Level[L].Level;
	return 0;
}

/**
 * Returns the class level progress for a LARP player, based on their LARP object
 * @param {object} LARP - The LARP object, coming from the Character.Game object
 * @returns {number} - The level progress between 0 and 1000
 */
function GameLARPGetClassProgress(LARP) {
	if (LARP.Level == null) return 0;
	for (let L = 0; L < LARP.Level.length; L++)
		if ((LARP.Level[L].Name == LARP.Class) && (typeof LARP.Level[L].Progress === "number"))
			if ((LARP.Level[L].Progress >= 0) && (LARP.Level[L].Progress <= 1000))
				return LARP.Level[L].Progress;
	return 0;
}

/**
 * Moves forward in the LARP game. If there are less than 2 teams with free arms, the game is over.
 * @returns {boolean} - Returns TRUE if the game ends and runs the end scripts.
 */
function GameLARPContinue() {

	// See if there's at least 2 teams in which players have free arms, return TRUE if that's the case
	var Team = "";
	for (let C = 0; C < GameLARPPlayer.length; C++)
		if ((GameLARPPlayer[C].Game.LARP.Team != "") && (GameLARPPlayer[C].Game.LARP.Team != "None") && (InventoryGet(GameLARPPlayer[C], "ItemArms") == null) && OnlineGameCharacterInChatRoom(GameLARPPlayer[C].MemberNumber)) {
			if (Team == "")
				Team = GameLARPPlayer[C].Game.LARP.Team;
			else
				if (Team != GameLARPPlayer[C].Game.LARP.Team)
					return true;
		}

	// If there's a winning team, we announce it and stop the game
	if (Team != "") {

		// Progresses toward the next class level
		GameLARPLevelProgress(GameLARPProgress.length);

		// Shows the winning team and updates the player status
		GameLARPAddChatLog("EndGame", Player, Player, OnlineGameDictionaryText("Team" + Team), 0, 0, "#0000B0");
		GameLARPReset();
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);

		// Calculate the reputation gained, the longer the game took, the higher it will rise the rep, times 2 if the player team won
		var RepGain = Math.round(GameLARPProgress.length / GameLARPPlayer.length * ((Player.Game.LARP.Team == Team) ? 0.5 : 0.25));
		if (RepGain > 10) RepGain = 10;
		if (RepGain > 0) DialogChangeReputation("LARP", RepGain);
		ChatRoomCharacterUpdate(Player);

		// If the player is one the winning team, she earns some money based on game length, split by the number of winners
		if ((Player.Game.LARP.Team == Team) && (GameLARPProgress.length >= 5)) {
			var PlayersInWinningTeam = 0;
			for (let C = 0; C < GameLARPPlayer.length; C++)
				if (GameLARPPlayer[C].Game.LARP.Team == Team)
					PlayersInWinningTeam++;
			var MoneyGain = Math.round(GameLARPPlayer.length * Math.sqrt(GameLARPProgress.length) / PlayersInWinningTeam);
			if (MoneyGain > 30) MoneyGain = 30;
			if (MoneyGain > 0) CharacterChangeMoney(Player, MoneyGain);
		}

		return false;

	} else return true;

}

/**
 * Processes the LARP game messages for turns and actions.
 * @param {object} P - Data object containing the message data.
 * @returns {void} - Nothing
 */
function GameLARPProcess(P) {
	if ((P != null) && (typeof P === "object") && (P.Data != null) && (typeof P.Data === "object") && (P.Sender != null) && (typeof P.Sender === "number") && (P.RNG != null) && (typeof P.RNG === "number")) {

		// The administrator can start the LARP game, he becomes the turn admin in the process
		if ((ChatRoomData.Admin.indexOf(P.Sender) >= 0) && (P.Data.GameProgress == "Start")) {
			GameLARPStatus = "Running";
			GameLARPTurnAdmin = P.Sender;
			GameLARPTurnPosition = -1;
			GameLARPTurnAscending = true;
			GameLARPBuildPlayerList();
			GameLARPProgress = [];
			for (let C = 0; C < GameLARPPlayer.length; C++)
				if (ChatRoomData.Admin.indexOf(GameLARPPlayer[C].MemberNumber) >= 0)
					GameLARPTurnTimerDelay = GameLARPPlayer[C].Game.LARP.TimerDelay;
			if ((typeof GameLARPTurnTimerDelay !== "number") || (GameLARPTurnTimerDelay < GameLARPTimerDelay[0]) || (GameLARPTurnTimerDelay > GameLARPTimerDelay[GameLARPTimerDelay.length - 1])) GameLARPTurnTimerDelay = GameLARPTimerDelay[0];
			GameLARPNewTurn("TurnStart");
		}

		// The turn administrator can skip turns after the delay has ran out
		if ((GameLARPStatus == "Running") && (GameLARPTurnAdmin == P.Sender) && (P.Data.GameProgress == "Skip")) {
			GameLARPProgress.push({ Sender: P.Sender, Time: CurrentTime, RNG: P.RNG, Data: P.Data });
			if (GameLARPContinue()) GameLARPNewTurn("TurnSkip");
		}

		// The current turn player can trigger an action
		if ((GameLARPStatus == "Running") && (GameLARPPlayer[GameLARPTurnPosition].MemberNumber == P.Sender) && (P.Data.GameProgress == "Action") && (P.Data.Action != null) && (P.Data.Target != null)) {

			// Before we process it, we make sure the action is valid by checking all possible options
			var Source = GameLARPGetPlayer(P.Sender);
			var Target = GameLARPGetPlayer(P.Data.Target);
			if ((Source != null) && (Target != null)) {
				var Option = GameLARPBuildOption(Source, Target);
				for (let O = 0; O < Option.length; O++)
					if (Option[O].Name == P.Data.Action) {
						GameLARPProgress.push({ Sender: P.Sender, Time: CurrentTime, RNG: P.RNG, Data: P.Data });
						GameLARPProcessAction(P.Data.Action, P.Data.Item, Source, Target, P.RNG);
						if (GameLARPContinue()) GameLARPNewTurn("TurnNext");
						return;
					}
			}

		}

	}
}

/**
 * Resets the LARP game so a new game might be started
 * @returns {void} - Nothing
 */
function GameLARPReset() {
	GameLARPStatus = "";
	if ((Player.Game != null) && (Player.Game.LARP != null)) Player.Game.LARP.Status = "";
}
