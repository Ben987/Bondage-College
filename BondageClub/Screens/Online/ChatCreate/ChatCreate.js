"use strict";
var ChatCreateBackground = "IntroductionDark"
var ChatCreateResult = [];
var ChatCreateMessage = "";
var ChatCreatePrivate = false;
var ChatCreateBackgroundSelect = "Introduction";
var ChatCreateBackgroundList = ["Introduction", "KidnapLeague", "MaidQuarters", "MainHall", "Management", "Private", "Shibari"];

// When the chat screens loads, we loads up to 24 public rooms
function ChatCreateLoad() {
	ElementRemove("InputSearch");
	ElementCreateInput("InputName", "text", "", "20");
	ElementCreateInput("InputDescription", "text", "", "100");
	ChatCreateMessage = "";
	ChatCreatePrivate = false;
}

// When the chat creation screen runs
function ChatCreateRun() {
	
	// Draw the controls
	if (ChatCreateMessage == "") ChatCreateMessage = "EnterRoomInfo";
	DrawText(TextGet(ChatCreateMessage), 1000, 60, "White", "Gray");
	DrawText(TextGet("RoomName"), 1000, 200, "White", "Gray");
	ElementPosition("InputName", 1000, 250, 500);
	DrawText(TextGet("RoomDescription"), 1000, 350, "White", "Gray");
	ElementPosition("InputDescription", 1000, 400, 1500);
	DrawText(TextGet("RoomPrivate"), 970, 500, "White", "Gray");
	DrawButton(1300, 468, 64, 64, "", "White", ChatCreatePrivate ? "Icons/Checked.png" : "");
	DrawText(TextGet("RoomBackground"), 850, 600, "White", "Gray");
	DrawButton(1100, 570, 350, 65, ChatCreateBackgroundSelect, "White");
	DrawButton(600, 750, 300, 65, TextGet("Create"), "White");
	DrawButton(1100, 750, 300, 65, TextGet("Cancel"), "White");

}

// When the player clicks in the chat creation screen
function ChatCreateClick() {

	// When the private box is checked
	if ((MouseX >= 1300) && (MouseX < 1364) && (MouseY >= 468) && (MouseY < 532)) ChatCreatePrivate = !ChatCreatePrivate;

	// When we select a new background
	if ((MouseX >= 1100) && (MouseX < 1450) && (MouseY >= 570) && (MouseY < 635)) {
		var I = ChatCreateBackgroundList.indexOf(ChatCreateBackgroundSelect) + 1;
		if (I >= ChatCreateBackgroundList.length) I = 0;
		ChatCreateBackgroundSelect = ChatCreateBackgroundList[I];
		ChatCreateBackground = ChatCreateBackgroundSelect + "Dark";
	}

	// If the user wants to create a room
	if ((MouseX >= 600) && (MouseX < 900) && (MouseY >= 750) && (MouseY < 815)) {
		var NewRoom = {
			Name: ElementValue("InputName").trim(),
			Description: ElementValue("InputDescription").trim(),
			Background: ChatCreateBackgroundSelect,
			Private: ChatCreatePrivate
		};
		ServerSend("ChatRoomCreate", NewRoom);
		ChatCreateMessage = "CreatingRoom";
	}

	// When the user cancels
	if ((MouseX >= 1100) && (MouseX < 1400) && (MouseY >= 750) && (MouseY < 815)) {
		ElementRemove("InputName");
		ElementRemove("InputDescription");
		CommonSetScreen("Online", "ChatSearch");
	}

}

// When the server sends a response
function ChatCreateResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		ChatCreateMessage = "Response" + data;
}