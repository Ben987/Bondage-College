"use strict";
var ChatCreateBackground = "IntroductionDark";
var ChatCreateResult = [];
var ChatCreateMessage = "";
var ChatCreatePrivate = false;
var ChatCreateBackgroundIndex = 0;
var ChatCreateBackgroundSelect = "";
var ChatCreateBackgroundList = null;
var ChatCreateName = "";
var ChatCreateMode = "";
var ChatCreateDescription = "";
var ChatCreateSize = "";
var ChatCreateOffset = 0;

// When the chat creation screens loads
function ChatCreateLoad() {

	// If the current background isn't valid, we pick the first one
	if (ChatCreateBackgroundList.indexOf(ChatCreateBackgroundSelect) < 0) {
		ChatCreateBackgroundIndex = 0;
		ChatCreateBackgroundSelect = ChatCreateBackgroundList[0];
		ChatCreateBackground = ChatCreateBackgroundSelect + "Dark";
	}

	// Prepares the controls to create a room
	ElementRemove("InputSearch");
	ElementCreateInput("InputName", "text", "", "20");
	ElementCreateInput("InputDescription", "text", "", "100");
	ElementCreateInput("InputSize", "text", "10", "2");
	ChatCreateMessage = "";
	ChatCreatePrivate = false;

}

// When the chat creation screen runs
function ChatCreateRun() {

	if (ChatCreateMode == "ShowGrid") {
		ChatCreatePreviewRun();
		return;
	}

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
	DrawText(TextGet("RoomBackground"), 850, 672, "White", "Gray");
	DrawBackNextButton(1100, 640, 350, 65, TextGet(ChatCreateBackgroundSelect), "White", null,
		() => TextGet((ChatCreateBackgroundIndex == 0) ? ChatCreateBackgroundList[ChatCreateBackgroundList.length - 1] : ChatCreateBackgroundList[ChatCreateBackgroundIndex - 1]),
		() => TextGet((ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length - 1) ? ChatCreateBackgroundList[0] : ChatCreateBackgroundList[ChatCreateBackgroundIndex + 1]));
	DrawButton(1300, 640, 300, 65, TextGet("ShowAll"), "White");
	DrawButton(600, 800, 300, 65, TextGet("Create"), "White");
	DrawButton(1100, 800, 300, 65, TextGet("Cancel"), "White");
}

// When the player clicks in the chat creation screen
function ChatCreateClick() {

	if (ChatCreateMode == "ShowGrid") {
		ChatCreatePreviewClick();
		return;
	}

	// When the private box is checked
	if ((MouseX >= 1300) && (MouseX < 1364) && (MouseY >= 428) && (MouseY < 492)) ChatCreatePrivate = !ChatCreatePrivate;

	// When we select a new background
	if ((MouseX >= 1100) && (MouseX < 1450) && (MouseY >= 640) && (MouseY < 705)) {
		ChatCreateBackgroundIndex += ((MouseX < 1275 && !CommonIsMobile) ? -1 : 1);
		if (ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length) ChatCreateBackgroundIndex = 0;
		if (ChatCreateBackgroundIndex < 0) ChatCreateBackgroundIndex = ChatCreateBackgroundList.length - 1;
		ChatCreateBackgroundSelect = ChatCreateBackgroundList[ChatCreateBackgroundIndex];
		ChatCreateBackground = ChatCreateBackgroundSelect + "Dark";
	}

	// Show backgrounds in grid
	if ((MouseX >= 1300) && (MouseX < 1600) && (MouseY >= 640) && (MouseY < 705)) {
		ChatCreateMode = "ShowGrid";
		ChatCreateName = ElementValue("InputName");
		ChatCreateDescription = ElementValue("InputDescription");
		ChatCreateSize = ElementValue("InputSize");
		ElementRemove("InputName");
		ElementRemove("InputDescription");
		ElementRemove("InputSize");
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

// When the chat background selection screen runs
function ChatCreatePreviewRun() {
	DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1785, 25, 90, 90, "", "White", "Icons/Next.png");
	let X = 45;
	let Y = 170;
	for (var i = 0; (i + ChatCreateOffset) < ChatCreateBackgroundList.length && i < 12; ++i) {
		DrawButton(X, Y, 450, 225, "", "White", "Backgrounds/" + ChatCreateBackgroundList[i + ChatCreateOffset] + ".jpg");
		X += 450 + 35;
		if (i % 4 == 3) {
			X = 45;
			Y += 225 + 35;
		}
	}
}

// When the player clicks in the background selection screen
function ChatCreatePreviewClick() {
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
		ChatCreateExit();
	}

	if ((MouseX >= 1785) && (MouseX < 1875) && (MouseY >= 25) && (MouseY < 115)) {
		ChatCreateOffset += 12;
		if (ChatCreateOffset >= ChatCreateBackgroundList.length) ChatCreateOffset = 0;
	}

	var X = 45;
	var Y = 170;
	for (var i = 0; (i + ChatCreateOffset) < ChatCreateBackgroundList.length && i < 12; ++i) {
		if ((MouseX >= X) && (MouseX < X + 450) && (MouseY >= Y) && (MouseY < Y + 225)) {
			ChatCreateBackgroundIndex = i + ChatCreateOffset;
			if (ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length) ChatCreateBackgroundIndex = 0;
			if (ChatCreateBackgroundIndex < 0) ChatCreateBackgroundIndex = ChatCreateBackgroundList.length - 1;
			ChatCreateBackgroundSelect = ChatCreateBackgroundList[ChatCreateBackgroundIndex];
			ChatCreateBackground = ChatCreateBackgroundSelect + "Dark";
		}
		X += 450 + 35;
		if (i % 4 == 3) {
			X = 45;
			Y += 225 + 35;
		}
	}
}

// When the user press "enter", we create the room
function ChatCreateKeyDown() {
	if (KeyPress == 13 && ChatCreateMode == "") ChatCreateRoom();
	if (KeyPress == 13 && ChatCreateMode == "ShowGrid") ChatCreateExit();
}

// When the user exit from this screen
function ChatCreateExit() {
	if (ChatCreateMode == "") {
		ElementRemove("InputName");
		ElementRemove("InputDescription");
		ElementRemove("InputSize");
		CommonSetScreen("Online", "ChatSearch");
	} else if (ChatCreateMode == "ShowGrid") {
		ChatCreateMode = "";
		ElementCreateInput("InputName", "text", ChatCreateName, "20");
		ElementCreateInput("InputDescription", "text", ChatCreateDescription, "100");
		ElementCreateInput("InputSize", "text", ChatCreateSize, "2");
	}
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