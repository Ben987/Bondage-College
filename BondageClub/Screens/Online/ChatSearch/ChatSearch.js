"use strict";
var ChatSearchBackground = "IntroductionDark";
var ChatSearchResult = [];
var ChatSearchMessage = "";
var ChatSearchLeaveRoom = "MainHall";
var ChatSearchSafewordAppearance = null;
var ChatSearchSafewordPose = null;

// When the chat screens loads, we loads up to 24 public rooms
function ChatSearchLoad() {
	if (ChatSearchSafewordAppearance == null) {
		ChatSearchSafewordAppearance = Player.Appearance.slice(0);
		ChatSearchSafewordPose = Player.ActivePose;
	}
	ElementCreateInput("InputSearch", "text", "", "20");
	ChatSearchQuery();
	ChatSearchMessage = "";
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
			DrawButton(X, Y, 630, 85, "", ((ChatSearchResult[C].Friends != null) && (ChatSearchResult[C].Friends.length > 0)) ? "#CFFFCF" : "White");
			DrawTextFit(ChatSearchResult[C].Name + " - " + ChatSearchResult[C].Creator + " " + ChatSearchResult[C].MemberCount + "/" + ChatSearchResult[C].MemberLimit + "", X + 315, Y + 25, 620, "black");
			DrawTextFit(ChatSearchResult[C].Description, X + 315, Y + 62, 620, "black");

			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}
		}

		// Draws the hovering text of friends in the current room
		if (!CommonIsMobile && (MouseX >= 25) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 875)) {

			// Finds the room where the mouse is hovering
			X = 25;
			Y = 25;
			for (var C = 0; C < ChatSearchResult.length && C < 24; C++) {

				// Builds the friend list and shows it
				if ((MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85) && (ChatSearchResult[C].Friends != null) && (ChatSearchResult[C].Friends.length > 0)) {
					DrawTextWrap(TextGet("FriendsInRoom") + " " + ChatSearchResult[C].Name, (X > 1000) ? 685 : X + 660, (Y > 352) ? 352 : Y, 630, 60, "black", "#FFFF88", 1);
					for (var F = 0; F < ChatSearchResult[C].Friends.length; F++)
						DrawTextWrap(ChatSearchResult[C].Friends[F].MemberName + " (" + ChatSearchResult[C].Friends[F].MemberNumber + ")", (X > 1000) ? 685 : X + 660, ((Y > 352) ? 352 : Y) + 60 + F * 60, 630, 60, "black", "#FFFF88", 1);
				}

				// Moves the next window position
				X = X + 660;
				if (X > 1500) {
					X = 25;
					Y = Y + 109;
				}
			}

		}

	} else DrawText(TextGet("NoChatRoomFound"), 1000, 450, "White", "Gray");

	// Draw the bottom controls
	if (ChatSearchMessage == "") ChatSearchMessage = "EnterName";
	DrawText(TextGet(ChatSearchMessage), 280, 935, "White", "Gray");
	ElementPosition("InputSearch", 790, 926, 500);
	DrawButton(1065, 898, 320, 64, TextGet("SearchRoom"), "White");
	DrawButton(1415, 898, 320, 64, TextGet("CreateRoom"), "White");
	DrawButton(1765, 885, 90, 90, "", "White", "Icons/FriendList.png");
	DrawButton(1885, 885, 90, 90, "", "White", "Icons/Exit.png");
}

// When the player clicks in the chat screen
function ChatSearchClick() {
	if ((MouseX >= 25) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 875) && Array.isArray(ChatSearchResult) && (ChatSearchResult.length >= 1)) ChatSearchJoin();
	if ((MouseX >= 1065) && (MouseX < 1385) && (MouseY >= 898) && (MouseY < 962)) ChatSearchQuery();
	if ((MouseX >= 1415) && (MouseX < 1735) && (MouseY >= 898) && (MouseY < 962)) CommonSetScreen("Online", "ChatCreate");
	if ((MouseX >= 1765) && (MouseX < 1855) && (MouseY >= 885) && (MouseY < 975)) { ElementRemove("InputSearch"); CommonSetScreen("Character", "FriendList"); FriendListReturn = "ChatSearch"; }
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 885) && (MouseY < 975)) ChatSearchExit();
}

// When the user press "enter" in the search box, we launch a search query
function ChatSearchKeyDown() {
	if (KeyPress == 13) ChatSearchQuery();
}

// when the user exit this screen
function ChatSearchExit() {
	ElementRemove("InputSearch");
	CommonSetScreen("Room", ChatSearchLeaveRoom);
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
			ServerSend("ChatRoomJoin", { Name: ChatSearchResult[C].Name });
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
	ServerSend("ChatRoomSearch", { Query: ElementValue("InputSearch").toUpperCase().trim(), Space: ChatRoomSpace });
}