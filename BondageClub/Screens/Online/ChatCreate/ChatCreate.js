"use strict";
var ChatCreateBackground = "IntroductionDark";
var ChatCreateResult = [];
var ChatCreateMessage = "";
var ChatCreatePrivate = false;
var ChatCreateBackgroundIndex = 0;
var ChatCreateBackgroundSelect = "Introduction";
var ChatCreateBackgroundList = ["Introduction", "KidnapLeague", "MaidQuarters", "MainHall", "Management", "Private", "Shibari", "Bedroom", "HorseStable", "Nursery", "PrisonHall", "PaddedCell", "BDSMRoomBlue", "BDSMRoomPurple", "BDSMRoomRed", "Gardens", "IndoorPool", "OutdoorPool", "MaidCafe", "PublicBath", "ParkDay", "ParkNight", "ChillRoom", "Boudoir", "BondageBedChamber"];

// When the chat screens loads, we loads up to 24 public rooms
function ChatCreateLoad() {
	ElementRemove("InputSearch");
	ElementCreateInput("InputName", "text", "", "20");
	ElementCreateInput("InputDescription", "text", "", "100");
	ElementCreateInput("InputSize", "text", "10", "2");
	ChatCreateMessage = "";
	ChatCreatePrivate = false;
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
	DrawText(TextGet("RoomBackground"), 850, 672, "White", "Gray");
	DrawBackNextButton(1100, 640, 350, 65, ChatCreateBackgroundSelect, "White", null,
		() => (ChatCreateBackgroundIndex == 0) ? ChatCreateBackgroundList[ChatCreateBackgroundList.length - 1] : ChatCreateBackgroundList[ChatCreateBackgroundIndex - 1],
		() => (ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length - 1) ? ChatCreateBackgroundList[0] : ChatCreateBackgroundList[ChatCreateBackgroundIndex + 1]);
	DrawButton(600, 800, 300, 65, TextGet("Create"), "White");
	DrawButton(1100, 800, 300, 65, TextGet("Cancel"), "White");

}

// When the player clicks in the chat creation screen
function ChatCreateClick() {

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

// creates chat room
function ChatCreateRoom() {
	ChatRoomPlayerCanJoin = true;
	var NewRoom = {
		Name: ElementValue("InputName").trim(),
		Description: ElementValue("InputDescription").trim(),
		Background: ChatCreateBackgroundSelect,
		Private: ChatCreatePrivate,
		Limit: ElementValue("InputSize").trim()
	};
	ServerSend("ChatRoomCreate", NewRoom);
	ChatCreateMessage = "CreatingRoom";
}