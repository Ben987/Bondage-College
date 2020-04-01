"use strict";
var GameLARPBackground = "Sheet";
var GameLARPClassList = ["Matron", "Seducer", "Trickster", "Servant", "Artist", "Protector"];
var GameLARPTeamList = ["None", "Red", "Green", "Blue", "Yellow", "Cyan", "Purple", "Orange", "White", "Gray", "Black"];

// Draws the LARP class/team icon of a character
function GameLARPDrawIcon(C, X, Y, Zoom) {
	if ((C != null) && (C.Game != null) && (C.Game.LARP != null) && (C.Game.LARP.Class != null) && (C.Game.LARP.Team != null) && (C.Game.LARP.Team != "None"))
		DrawImageZoomCanvas("Icons/LARP/" + C.Game.LARP.Class + C.Game.LARP.Team + ".png", MainCanvas, 0, 0, 100, 100, X, Y, 100 * Zoom, 100 * Zoom);
}

// When the screens loads
function GameLARPLoad() {

}

// When the screen runs
function GameLARPRun() {

	// Draw the character, text and buttons
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Title"), 550, 125, "Black", "Gray");
	DrawText(TextGet("SelectClass"), 550, 225, "Black", "Gray");
	DrawText(TextGet("SelectTeam"), 550, 325, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawBackNextButton(900, 193, 400, 64, TextGet("Class" + Player.Game.LARP.Class), "White", "", () => "", () => "");
	DrawBackNextButton(900, 293, 400, 64, TextGet("Color" + Player.Game.LARP.Team), "White", "", () => "", () => "");
	GameLARPDrawIcon(Player, 1000, 450, 2);

}

// When the player clicks in the chat Admin screen
function GameLARPClick() {

	// When the user exits
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165)) GameLARPExit();

	// When the user selects a new class
	if ((MouseX >= 900) && (MouseX < 1300) && (MouseY >= 193) && (MouseY < 257)) {
		if (MouseX <= 1100) Player.Game.LARP.Class = (GameLARPClassList.indexOf(Player.Game.LARP.Class) <= 0) ? GameLARPClassList[GameLARPClassList.length - 1] : GameLARPClassList[GameLARPClassList.indexOf(Player.Game.LARP.Class) - 1];
		else Player.Game.LARP.Class = (GameLARPClassList.indexOf(Player.Game.LARP.Class) >= GameLARPClassList.length - 1) ? GameLARPClassList[0] : GameLARPClassList[GameLARPClassList.indexOf(Player.Game.LARP.Class) + 1];
	}
	
	// When the user selects a new team
	if ((MouseX >= 900) && (MouseX < 1300) && (MouseY >= 293) && (MouseY < 357)) {
		if (MouseX <= 1100) Player.Game.LARP.Team = (GameLARPTeamList.indexOf(Player.Game.LARP.Team) <= 0) ? GameLARPTeamList[GameLARPTeamList.length - 1] : GameLARPTeamList[GameLARPTeamList.indexOf(Player.Game.LARP.Team) - 1];
		else Player.Game.LARP.Team = (GameLARPTeamList.indexOf(Player.Game.LARP.Team) >= GameLARPTeamList.length - 1) ? GameLARPTeamList[0] : GameLARPTeamList[GameLARPTeamList.indexOf(Player.Game.LARP.Team) + 1];
	}
	
}

// When the user exit from this screen
function GameLARPExit() {

	// Notices everyone in the room of the change
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	ServerSend("ChatRoomChat", { Content: "LARPChangeTeamClass", Type: "Action" , Dictionary: Dictionary});

	// Updates the player and go back to the chat room
	ServerSend("AccountUpdate", { Game: Player.Game });
	ChatRoomCharacterUpdate(Player);
	CommonSetScreen("Online", "ChatRoom");

}

// Processes the LARP game messages
function GameLARPProcess(data) {
	console.log(data);
}