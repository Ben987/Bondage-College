"use strict";
var ChatSearchBackground = "IntroductionDark";
var ChatSearchResult = [];
var ChatSearchMessage = "";

// When the chat screens loads, we loads up to 24 public rooms
function ChatSearchLoad() {
	ElementCreateInput("InputSearch", "text", "", "20");
	ChatSearchQuery();
	ChatSearchMessage = "";
	ChatRoomLog = "";
}

// When the chat screens load
function ChatSearchRun() {
	
	// If we can show the chat room search result
	if (Array.isArray(ChatSearchResult) && (ChatSearchResult.length >= 1)) {
		
		// Show up to 24 results
		var X = 25;
		var Y = 25;
		for (var C = 0; C < ChatSearchResult.length && C < 24; C++) {

			// Draw the room rectangle
			DrawButton(X, Y, 630, 85, "", "White");
			DrawTextFit(ChatSearchResult[C].Name + " - " + ChatSearchResult[C].Creator + " " + ChatSearchResult[C].MemberCount + "/" + ChatSearchResult[C].MemberLimit + "", X + 315, Y + 25, 620, "black");
			DrawTextFit(ChatSearchResult[C].Description, X + 315, Y + 62, 620, "black");
		
			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}

		}
		
	} else DrawText(TextGet("NoChatRoomFound"), 1000, 450, "White", "Gray");
	
	// Draw the bottom controls
	if (ChatSearchMessage == "") ChatSearchMessage = "EnterName";
	DrawText(TextGet(ChatSearchMessage), 300, 935, "White", "Gray");
	ElementPosition("InputSearch", 850, 926, 500);
	DrawButton(1125, 898, 350, 64, TextGet("SearchRoom"), "White");
	DrawButton(1505, 898, 350, 64, TextGet("CreateRoom"), "White");
	DrawButton(1885, 885, 90, 90, "", "White", "Icons/Exit.png");

}

// When the player clicks in the chat screen
function ChatSearchClick() {
	if ((MouseX >= 25) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 875) && Array.isArray(ChatSearchResult) && (ChatSearchResult.length >= 1)) ChatSearchJoin();
	if ((MouseX >= 1125) && (MouseX < 1475) && (MouseY >= 898) && (MouseY < 962)) ChatSearchQuery();
	if ((MouseX >= 1505) && (MouseX < 1855) && (MouseY >= 898) && (MouseY < 962)) CommonSetScreen("Online", "ChatCreate");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 885) && (MouseY < 975)) { ElementRemove("InputSearch"); CommonSetScreen("Room", "MainHall"); }
}

// When the user press "enter" in the search box, we launch a search query
function ChatSearchKeyDown() {
    if (KeyPress == 13) ChatSearchQuery();
}

// When the player wants to join a chat room
function ChatSearchJoin() {

	// Scans up to 24 results
	var X = 25;
	var Y = 25;
	for (var C = 0; C < ChatSearchResult.length && C < 24; C++) {

		// If the player clicked on a valid room
		if ((MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85)) {
			ChatRoomPlayerCanJoin = true;
			ServerSend("ChatRoomJoin", { Name: ChatSearchResult[C].Name } );
		}

		// Moves the next window position
		X = X + 660;
		if (X > 1500) {
			X = 25;
			Y = Y + 109;
		}

	}

}

// When the server sends a response (force leave the room if the user was banned)
function ChatSearchResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != "")) {
		if (((data == "RoomBanned") || (data == "RoomKicked")) && (CurrentScreen == "ChatRoom")) {
			if (CurrentCharacter != null) DialogLeave();
			ElementRemove("InputChat");
			ElementRemove("TextAreaChatLog");
			CommonSetScreen("Online", "ChatSearch");
		}
		ChatSearchMessage = "Response" + data;
	}
}

// Sends a search query to the server
function ChatSearchQuery() {
	ChatSearchResult = [];
	ServerSend("ChatRoomSearch", { Query: ElementValue("InputSearch").toUpperCase().trim() } );
}