"use strict";
var GameLARPBackground = "Sheet";
var GameLARPClassList = ["Matron", "Seducer", "Trickster", "Servant", "Artist", "Protector"];
var GameLARPClassOffensiveBonus = [30, 20, 20, 10, 10, 0];
var GameLARPClassDefensiveBonus = [0, 10, 10, 20, 20, 30];
var GameLARPTeamList = ["None", "Red", "Green", "Blue", "Yellow", "Cyan", "Purple", "Orange", "White", "Gray", "Black"];
var GameLARPEntryClass = "";
var GameLARPEntryTeam = "";
var GameLARPStatus = "";
var GameLARPProgress = [];
var GameLARPPlayer = [];
var GameLARPOption = [];
var GameLARPTurnAdmin = 0;
var GameLARPTurnPosition = 0;
var GameLARPTurnAscending = true;
var GameLARPTurnTimer = null;
var GameLARPTurnFocusCharacter = null;

// Return TRUE if that character is the room creator (game administrator)
function GameLARPIsAdmin(C) {
	if (GameLARPStatus == "")
		return (ChatRoomData.Admin.indexOf(C.MemberNumber) >= 0)
	else
		return (GameLARPTurnAdmin == C.MemberNumber);
};

// Draws the LARP class/team icon of a character
function GameLARPDrawIcon(C, X, Y, Zoom) {
	if ((C != null) && (C.Game != null) && (C.Game.LARP != null) && (C.Game.LARP.Class != null) && (C.Game.LARP.Team != null) && (C.Game.LARP.Team != "") && (C.Game.LARP.Team != "None"))
		DrawImageZoomCanvas("Icons/LARP/" + C.Game.LARP.Class + C.Game.LARP.Team + ".png", MainCanvas, 0, 0, 100, 100, X, Y, 100 * Zoom, 100 * Zoom);
}

// When the screens loads
function GameLARPLoad() {
	GameLARPEntryClass = Player.Game.LARP.Class;
	GameLARPEntryTeam = Player.Game.LARP.Team;
	if (GameLARPStatus == "") GameLARPProgress = [];
}

// When the screen runs
function GameLARPRun() {

	// Draw the character, text and buttons
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Title"), 550, 125, "Black", "Gray");
	DrawText(TextGet("SelectClass"), 550, 225, "Black", "Gray");
	DrawText(TextGet("SelectTeam"), 550, 325, "Black", "Gray");
	if (GameLARPStatus != "") DrawText(TextGet("Class" + Player.Game.LARP.Class), 900, 225, "Black", "Gray");
	if (GameLARPStatus != "") DrawText(TextGet("Color" + Player.Game.LARP.Team), 900, 325, "Black", "Gray");
	DrawText(TextGet((GameLARPStatus == "") ? "StartCondition" : "RunningGame"), 550, 425, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (GameLARPStatus == "") DrawBackNextButton(900, 193, 400, 64, TextGet("Class" + Player.Game.LARP.Class), "White", "", () => "", () => "");
	if (GameLARPStatus == "") DrawBackNextButton(900, 293, 400, 64, TextGet("Color" + Player.Game.LARP.Team), "White", "", () => "", () => "");
	GameLARPDrawIcon(Player, 1400, 200, 1.5);
	if (GameLARPCanLaunchGame()) DrawButton(550, 500, 400, 65, TextGet("StartGame"), "White");

}

// Runs the game from the chat room
function GameLARPRunProcess() {

	// If the player is an admin, she can make player skip their turns
	if ((GameLARPStatus == "Running") && (CurrentTime > GameLARPTurnTimer) && GameLARPIsAdmin(Player)) ServerSend("ChatRoomGame", { GameProgress: "Skip" });

	// Clears the focused character if it's not the player turn
	if ((GameLARPTurnFocusCharacter != null) && ((GameLARPStatus != "Running") || (GameLARPPlayer[GameLARPTurnPosition].ID != 0))) GameLARPTurnFocusCharacter = null;

	// If we must show the focused character and available abilities
	if (GameLARPTurnFocusCharacter != null) {
		
		// Draw a black background and the target character
		DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + "Dark.jpg", MainCanvas, 500, 0, 1000, 1000, 0, 0, 1000, 1000);
		DrawCharacter(GameLARPTurnFocusCharacter, 500, 0, 1);
		
		// Draw all the possible options
		for (var O = 0; O < GameLARPOption.length; O++)
			DrawButton(50, 35 + (O * 100), 400, 65, OnlineGameDictionaryText("Option" + GameLARPOption[O].Name).replace("OptionOdds", GameLARPOption[O].Odds), "White");
		DrawButton(50, 900, 400, 65, OnlineGameDictionaryText("BackToCharacters"), "White");
		
		// Draw the timer
		MainCanvas.font = "108px Arial";
		var Time = Math.round((GameLARPTurnTimer - CurrentTime) / 1000);
		DrawText(((Time < 0) || (Time > 15)) ? OnlineGameDictionaryText("TimerNA") : Time.toString(), 250, 800, "Red", "White");
		MainCanvas.font = "36px Arial";

	}

}

// Return TRUE if we intercept clicks in the chat room
function GameLARPClickProcess() {

	// Do not handle any click if no character is selected, a target is required here
	if (GameLARPTurnFocusCharacter == null) return false;

	// If we must exit from the currently focused character
	if ((MouseX >= 50) && (MouseX < 450) && (MouseY >= 900) && (MouseY <= 965)) GameLARPTurnFocusCharacter = null;

	// Flags the click as being handled
	return true;

}

// When the player clicks in the chat Admin screen
function GameLARPClick() {

	// When the user exits
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) GameLARPExit();

	// When the user selects a new class
	if ((MouseX >= 900) && (MouseX < 1300) && (MouseY >= 193) && (MouseY < 257) && (GameLARPStatus == "")) {
		if (MouseX <= 1100) Player.Game.LARP.Class = (GameLARPClassList.indexOf(Player.Game.LARP.Class) <= 0) ? GameLARPClassList[GameLARPClassList.length - 1] : GameLARPClassList[GameLARPClassList.indexOf(Player.Game.LARP.Class) - 1];
		else Player.Game.LARP.Class = (GameLARPClassList.indexOf(Player.Game.LARP.Class) >= GameLARPClassList.length - 1) ? GameLARPClassList[0] : GameLARPClassList[GameLARPClassList.indexOf(Player.Game.LARP.Class) + 1];
	}
	
	// When the user selects a new team
	if ((MouseX >= 900) && (MouseX < 1300) && (MouseY >= 293) && (MouseY < 357) && (GameLARPStatus == "")) {
		if (MouseX <= 1100) Player.Game.LARP.Team = (GameLARPTeamList.indexOf(Player.Game.LARP.Team) <= 0) ? GameLARPTeamList[GameLARPTeamList.length - 1] : GameLARPTeamList[GameLARPTeamList.indexOf(Player.Game.LARP.Team) - 1];
		else Player.Game.LARP.Team = (GameLARPTeamList.indexOf(Player.Game.LARP.Team) >= GameLARPTeamList.length - 1) ? GameLARPTeamList[0] : GameLARPTeamList[GameLARPTeamList.indexOf(Player.Game.LARP.Team) + 1];
	}
	
	// If the administrator wants to start the game
	if ((MouseX >= 550) && (MouseX < 950) && (MouseY >= 500) && (MouseY < 565) && GameLARPCanLaunchGame()) {

		// Shuffles all players in the chat room
		for (var C = 0; C < ChatRoomCharacter.length; C++) {
			if (ChatRoomCharacter[C].MemberNumber != Player.MemberNumber) {
				ServerSend("ChatRoomAdmin", { MemberNumber: ChatRoomCharacter[C].MemberNumber, Action: "Shuffle" });
				break;
			}
		}

		// Give two seconds to the server to shuffle the room before calling the start game function (could be reviewed, maybe this is not needed)
		var waitUntil = new Date().getTime() + 2000;
		while(new Date().getTime() < waitUntil) true;

		// Notices everyone in the room that the game starts
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		ServerSend("ChatRoomChat", { Content: "LARPGameStart", Type: "Action" , Dictionary: Dictionary});

		// Changes the game status and exits
		ServerSend("ChatRoomGame", { GameProgress: "Start" });
		Player.Game.LARP.Status = "Running";
		ServerSend("AccountUpdate", { Game: Player.Game });
		ChatRoomCharacterUpdate(Player);
		CommonSetScreen("Online", "ChatRoom");

	}
	
}

// When the user exit from this screen
function GameLARPExit() {

	// When the game isn't running, we allow to change the class or team
	if (GameLARPStatus == "") {
		
		// Notices everyone in the room of the change
		var Dictionary = [];
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		ServerSend("ChatRoomChat", { Content: "LARPChangeTeamClass", Type: "Action" , Dictionary: Dictionary});

		// Updates the player and go back to the chat room
		ServerSend("AccountUpdate", { Game: Player.Game });
		ChatRoomCharacterUpdate(Player);
		CommonSetScreen("Online", "ChatRoom");

	} else {
		Player.Game.LARP.Class = GameLARPEntryClass;
		Player.Game.LARP.Team = GameLARPEntryTeam;
		CommonSetScreen("Online", "ChatRoom");
	}

}

// Returns TRUE if the game can be launched, the player must an administrator and two different teams must be selected
function GameLARPCanLaunchGame() {
	if (Player.Game.LARP.Class != GameLARPEntryClass) return false;
	if (Player.Game.LARP.Team != GameLARPEntryTeam) return false;
	if (GameLARPStatus != "") return false;
	if (!GameLARPIsAdmin(Player)) return false;
	var Team = "";
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].Game.LARP.Team != "") && (ChatRoomCharacter[C].Game.LARP.Team != "None")) {
			if (Team == "")
				Team = ChatRoomCharacter[C].Game.LARP.Team;
			else
				if (Team != ChatRoomCharacter[C].Game.LARP.Team)
					return true;
		}
	return false;
}

// Build a clickable menu for everything that can be tempted on a character
function GameLARPBuildOption() {
	
	// Builds the basic "Strip" / "Restrain" options if that player isn't in the player team
	GameLARPOption = [];
	if (GameLARPTurnFocusCharacter.Game.LARP.Team != Player.Game.LARP.Team) {
		
		// The formula is 50% + the offensive bonus - the opponent defensive bonus
		var Prc = 50 + GameLARPClassOffensiveBonus[GameLARPClassList.indexOf(Player.Game.LARP.Class)] - GameLARPClassDefensiveBonus[GameLARPClassList.indexOf(GameLARPTurnFocusCharacter.Game.LARP.Class)];

		// Some actions are different based on the player current status
		if (!CharacterIsInUnderwear(GameLARPTurnFocusCharacter)) GameLARPOption.push({ Name: "Strip", Odds: Prc });
		else if (!GameLARPTurnFocusCharacter.CanWalk() && !GameLARPTurnFocusCharacter.CanTalk()) GameLARPOption.push({ Name: "RestrainArms", Odds: Prc });
		else {
			if (GameLARPTurnFocusCharacter.CanWalk()) GameLARPOption.push({ Name: "RestrainLegs", Odds: Prc });
			if (GameLARPTurnFocusCharacter.CanTalk()) GameLARPOption.push({ Name: "RestrainMouth", Odds: Prc });
		}

	}

}

// Processes the LARP game clicks, returns TRUE if the code handles the click
function GameLARPCharacterClick(C) {

	// If it's the player turn, we allow clicking on a character to get the abilities menu
	if ((GameLARPStatus == "Running") && (GameLARPPlayer[GameLARPTurnPosition].ID == 0) && (C.Game != null) && (C.Game.LARP != null) && (C.Game.LARP.Team != null) && (C.Game.LARP.Team != "") && (C.Game.LARP.Team != "None") && C.CanInteract()) {
		GameLARPTurnFocusCharacter = C;
		GameLARPBuildOption();
	}

	// Flags that transaction as being handled
	return true;

}

// Sets the new turn player and publish it in the chat room
function GameLARPNewTurnPublish(NewPlayerPosition, Ascending, Msg) {
		
	// Sets the new position and turn order, the timer is 15 seconds
	GameLARPTurnPosition = NewPlayerPosition;
	GameLARPTurnAscending = Ascending;
	GameLARPTurnTimer = CurrentTime + 15000;
	
	// Gets the message from the dictionary
	Msg = OnlineGameDictionaryText(Msg);
	Msg = Msg.replace("TargetName", GameLARPPlayer[GameLARPTurnPosition].Name);
	Msg = Msg.replace("TargetNumber", GameLARPPlayer[GameLARPTurnPosition].MemberNumber.toString());
	
	// Adds the message and scrolls down unless the user has scrolled up
	var div = document.createElement("div");
	div.setAttribute('class', 'ChatMessage ChatMessageServerMessage');
	div.setAttribute('data-time', ChatRoomCurrentTime());
	div.innerHTML = Msg;
	var Refocus = document.activeElement.id == "InputChat";
	var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
	if (document.getElementById("TextAreaChatLog") != null) {
		document.getElementById("TextAreaChatLog").appendChild(div);
		if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
		if (Refocus) ElementFocus("InputChat");
	}

}

// Generates a new turn for the LARP game
function GameLARPNewTurn(Msg) {

	// Cycles in the game player array ascending or descending and shifts the position
	if ((GameLARPTurnAscending) && (GameLARPTurnPosition < GameLARPPlayer.length - 1)) return GameLARPNewTurnPublish(GameLARPTurnPosition + 1, true, Msg);
	if ((GameLARPTurnAscending) && (GameLARPTurnPosition == GameLARPPlayer.length - 1)) return GameLARPNewTurnPublish(GameLARPTurnPosition, false, Msg);
	if ((!GameLARPTurnAscending) && (GameLARPTurnPosition > 0)) return GameLARPNewTurnPublish(GameLARPTurnPosition - 1, false, Msg);
	if ((!GameLARPTurnAscending) && (GameLARPTurnPosition == 0)) return GameLARPNewTurnPublish(GameLARPTurnPosition, true, Msg);

}

// Builds the full player list
function GameLARPBuildPlayerList() {
	GameLARPPlayer = [];
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].Game != null) && (ChatRoomCharacter[C].Game.LARP != null) && (ChatRoomCharacter[C].Game.LARP.Team != null) && (ChatRoomCharacter[C].Game.LARP.Team != "") && (ChatRoomCharacter[C].Game.LARP.Team != "None"))
			GameLARPPlayer.push(ChatRoomCharacter[C]);
}

// Processes the LARP game messages
function GameLARPProcess(P) {
	if ((P != null) && (typeof P === "object") && (P.Data != null) && (typeof P.Data === "object") && (P.Sender != null) && (typeof P.Sender === "number") && (P.RNG != null) && (typeof P.RNG === "number")) {

		// The administrator can start the LARP game, he becomes the turn admin in the process
		if ((ChatRoomData.Admin.indexOf(P.Sender) >= 0) && (P.Data.GameProgress == "Start")) {
			GameLARPStatus = "Running";
			GameLARPTurnFocusCharacter = null;
			GameLARPTurnAdmin = P.Sender;
			GameLARPTurnPosition = -1;
			GameLARPTurnAscending = true;
			GameLARPBuildPlayerList();
			GameLARPProgress = [];
			GameLARPProgress.push({ Sender: P.Sender, Time: CurrentTime, RNG: P.RNG, Data: P.Data });
			GameLARPNewTurn("TurnStart");
		}

		// The turn administrator can skip turns after the delay has ran out
		if ((GameLARPTurnAdmin == P.Sender) && (P.Data.GameProgress == "Skip")) {
			GameLARPTurnFocusCharacter = null;
			GameLARPProgress.push({ Sender: P.Sender, Time: CurrentTime, RNG: P.RNG, Data: P.Data });
			GameLARPNewTurn("TurnSkip");
		}

		console.log(P);
	}
}