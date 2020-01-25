"use strict";
var ChatCreateBackground = "IntroductionDark";
var ChatCreateResult = [];
var ChatCreateMessage = "";
var ChatCreatePrivate = null;
var ChatCreateBackgroundIndex = 0;
var ChatCreateBackgroundSelect = "";
var ChatCreateBackgroundList = null;

// When the chat creation screens loads
function ChatCreateLoad() {

	// If the current background isn't valid, we pick the first one
	ChatCreateBackgroundIndex = ChatCreateBackgroundList.indexOf(ChatCreateBackgroundSelect);
	if (ChatCreateBackgroundIndex < 0) {
		ChatCreateBackgroundIndex = 0;
	}
	ChatCreateBackgroundSelect = ChatCreateBackgroundList[ChatCreateBackgroundIndex];
	ChatCreateBackground = ChatCreateBackgroundSelect + "Dark";

	// Prepares the controls to create a room
	ElementRemove("InputSearch");
	if (document.getElementById("InputName") == null) {
		ElementCreateInput("InputName", "text", "", "20");
		ElementCreateInput("InputDescription", "text", "", "100");
		ElementCreateInput("InputSize", "text", "10", "2");
	}
	ChatCreateMessage = "";
	ChatCreatePrivate = ChatCreatePrivate || false;

}

// When the chat creation screen runs
function ChatCreateRun() {

	// Draw the controls
	if (ChatCreateMessage == "") ChatCreateMessage = "EnterRoomInfo";
	DrawText(TextGet(ChatCreateMessage), 1000, 60, "White", "Gray");
	DrawText(TextGet("RoomName"), 1000, 150, "White", "Gray");
	ElementPosition("InputName", 1000, 200, 500);
	DrawText(TextGet("RoomDescription"), 1000, 300, "White", "Gray");
	ElementPosition("InputDescription", 1000, 350, 1500);
	DrawText(TextGet("RoomPrivate"), 970, 460, "White", "Gray");
	DrawButton(1300, 428, 64, 64, "", "White", ChatCreatePrivate ? "Icons/Checked.png" : "");
	DrawText(TextGet("RoomSize"), 930, 568, "White", "Gray");
	ElementPosition("InputSize", 1400, 560, 150);
	DrawText(TextGet("RoomBackground"), 650, 672, "White", "Gray");
	DrawButton(1300, 640, 300, 65, TextGet("ShowAll"), "White");
	DrawBackNextButton(900, 640, 350, 65, DialogFind(Player, ChatCreateBackgroundSelect), "White", null,
		() => DialogFind(Player, (ChatCreateBackgroundIndex == 0) ? ChatCreateBackgroundList[ChatCreateBackgroundList.length - 1] : ChatCreateBackgroundList[ChatCreateBackgroundIndex - 1]),
		() => DialogFind(Player, (ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length - 1) ? ChatCreateBackgroundList[0] : ChatCreateBackgroundList[ChatCreateBackgroundIndex + 1]));
	DrawButton(600, 800, 300, 65, TextGet("Create"), "White");
	DrawButton(1100, 800, 300, 65, TextGet("Cancel"), "White");
}

// When the player clicks in the chat creation screen
function ChatCreateClick() {

	// When the private box is checked
	if ((MouseX >= 1300) && (MouseX < 1364) && (MouseY >= 428) && (MouseY < 492)) ChatCreatePrivate = !ChatCreatePrivate;

	// When we select a new background
	if ((MouseX >= 900) && (MouseX < 1250) && (MouseY >= 640) && (MouseY < 705)) {
		ChatCreateBackgroundIndex += ((MouseX < 1275 && !CommonIsMobile) ? -1 : 1);
		if (ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length) ChatCreateBackgroundIndex = 0;
		if (ChatCreateBackgroundIndex < 0) ChatCreateBackgroundIndex = ChatCreateBackgroundList.length - 1;
		ChatCreateBackgroundSelect = ChatCreateBackgroundList[ChatCreateBackgroundIndex];
		ChatCreateBackground = ChatCreateBackgroundSelect + "Dark";
	}

	// Show backgrounds in grid
	if ((MouseX >= 1300) && (MouseX < 1600) && (MouseY >= 640) && (MouseY < 705)) {
		BackgroundSelectionMake(ChatCreateBackgroundList, Name => ChatCreateBackgroundSelect = Name);
		document.getElementById("InputName").style.display = "none";
		document.getElementById("InputDescription").style.display = "none";
		document.getElementById("InputSize").style.display = "none";
	}

	// If the user wants to create a room
	if ((MouseX >= 600) && (MouseX < 900) && (MouseY >= 800) && (MouseY < 865)) {
		ChatCreateRoom();
	}

	// When the user cancels
	if ((MouseX >= 1100) && (MouseX < 1400) && (MouseY >= 800) && (MouseY < 865)) {
		ChatCreateExit();
	}
}

// When the user press "enter", we create the room
function ChatCreateKeyDown() {
	if (KeyPress == 13) ChatCreateRoom();
}

// When the user exit from this screen
function ChatCreateExit() {
	ChatCreatePrivate = null;
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	CommonSetScreen("Online", "ChatSearch");
}

// When the server sends a response
function ChatCreateResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		ChatCreateMessage = "Response" + data;
}

// Creates the chat room
function ChatCreateRoom() {
	ChatRoomPlayerCanJoin = true;
	var NewRoom = {
		Name: ElementValue("InputName").trim(),
		Description: ElementValue("InputDescription").trim(),
		Background: ChatCreateBackgroundSelect,
		Private: ChatCreatePrivate,
		Space: ChatRoomSpace,
		Limit: ElementValue("InputSize").trim()
	};
	ServerSend("ChatRoomCreate", NewRoom);
	ChatCreateMessage = "CreatingRoom";
}