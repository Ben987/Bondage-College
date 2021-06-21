"use strict";
var ChatCreateBackground = "Introduction";
var ChatCreateResult = [];
var ChatCreateMessage = "";
var ChatCreatePrivate = null;
var ChatCreateBackgroundIndex = 0;
var ChatCreateBackgroundSelect = "";
var ChatCreateBackgroundList = null;

/**
 * Loads the chat creation screen properties and creates the inputs
 * @returns {void} - Nothing
 */
function ChatCreateLoad() {

	CurrentDarkFactor = 0.5;

	// Resets the room game statuses
	if ((ChatRoomGame == "LARP") && (Player.Game.LARP.Status != "")) {
		Player.Game.LARP.Status = "";
		ServerAccountUpdate.QueueData({ Game: Player.Game }, true);
	}

	// If the current background isn't valid, we pick the first one
	ChatCreateBackgroundIndex = ChatCreateBackgroundList.indexOf(ChatCreateBackgroundSelect);
	if (ChatCreateBackgroundIndex < 0) {
		ChatCreateBackgroundIndex = 0;
	}
	ChatCreateBackgroundSelect = ChatCreateBackgroundList[ChatCreateBackgroundIndex];
	ChatCreateBackground = ChatCreateBackgroundSelect;

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

/**
 * When the chat creation screen runs, draws the screen
 * @returns {void} - Nothing
 */
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
	DrawBackNextButton(900, 640, 350, 65, DialogFindPlayer(ChatCreateBackgroundSelect), "White", null,
		() => DialogFindPlayer((ChatCreateBackgroundIndex == 0) ? ChatCreateBackgroundList[ChatCreateBackgroundList.length - 1] : ChatCreateBackgroundList[ChatCreateBackgroundIndex - 1]),
		() => DialogFindPlayer((ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length - 1) ? ChatCreateBackgroundList[0] : ChatCreateBackgroundList[ChatCreateBackgroundIndex + 1]));
	DrawButton(850, 775, 300, 65, TextGet("BlockItems"), "White");
	DrawButton(600, 900, 300, 65, TextGet("Create"), "White");
	DrawButton(1100, 900, 300, 65, TextGet("Cancel"), "White");

}

/**
 * Handles the click events on the chat creation screen. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function ChatCreateClick() {

	// When the private box is checked
	if ((MouseX >= 1300) && (MouseX < 1364) && (MouseY >= 428) && (MouseY < 492)) ChatCreatePrivate = !ChatCreatePrivate;

	// When we select a new background
	if ((MouseX >= 900) && (MouseX < 1250) && (MouseY >= 640) && (MouseY < 705)) {
		ChatCreateBackgroundIndex += ((MouseX < 1075) ? -1 : 1);
		if (ChatCreateBackgroundIndex >= ChatCreateBackgroundList.length) ChatCreateBackgroundIndex = 0;
		if (ChatCreateBackgroundIndex < 0) ChatCreateBackgroundIndex = ChatCreateBackgroundList.length - 1;
		ChatCreateBackgroundSelect = ChatCreateBackgroundList[ChatCreateBackgroundIndex];
		ChatCreateBackground = ChatCreateBackgroundSelect;
	}

	// Show backgrounds in grid
	if ((MouseX >= 1300) && (MouseX < 1600) && (MouseY >= 640) && (MouseY < 705)) {
		BackgroundSelectionMake(ChatCreateBackgroundList, ChatCreateBackgroundIndex, Name => ChatCreateBackgroundSelect = Name, ChatRoomSpace === "Asylum");
		document.getElementById("InputName").style.display = "none";
		document.getElementById("InputDescription").style.display = "none";
		document.getElementById("InputSize").style.display = "none";
	}

	// When the bottom buttons are used
	if (MouseIn(850, 775, 300, 65)) ChatCreateBlockItems();
	if (MouseIn(600, 900, 300, 65)) ChatCreateRoom();
	if (MouseIn(1100, 900, 300, 65)) ChatCreateExit();

}

/**
 * Handles the key presses while in the creation screen. When the user presses enter, we create the room.
 * @returns {void} - Nothing
 */
function ChatCreateKeyDown() {
	if (KeyPress == 13) ChatCreateRoom();
}

/**
 * Handles exiting from the chat creation screen, removes the inputs and resets the state of the variable
 * @returns {void} - Nothing
 */
function ChatCreateExit() {
	ChatCreatePrivate = null;
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	CommonSetScreen("Online", "ChatSearch");
}

/**
 * Handles the reception of the server response after attempting to create a chatroom: shows the error message, if applicable
 * @param {string} data - Response from the server
 * @returns {void} - Nothing
 */
function ChatCreateResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		ChatCreateMessage = "Response" + data;
}

/**
 * Sends the chat room data packet to the server and prepares the player to join a room. The response will be handled by ChatCreateResponse once it is received
 * @returns {void} - Nothing
 */
function ChatCreateRoom() {
	ChatRoomPlayerCanJoin = true;
	ChatRoomPlayerJoiningAsAdmin = true;
	var NewRoom = {
		Name: ElementValue("InputName").trim(),
		Description: ElementValue("InputDescription").trim(),
		Background: ChatCreateBackgroundSelect,
		Private: ChatCreatePrivate,
		Space: ChatRoomSpace,
		Game: ChatRoomGame,
		Limit: ElementValue("InputSize").trim(),
		BlockCategory: ChatBlockItemCategory
	};
	ServerSend("ChatRoomCreate", NewRoom);
	ChatCreateMessage = "CreatingRoom";

	ChatRoomPingLeashedPlayers();
}

/**
 * When we need to enter the item blocking screen
 * @returns {void} - Nothing
 */
function ChatCreateBlockItems() {
	ChatBlockItemReturnData = { Screen: "ChatCreate", Name: ElementValue("InputName"), Description: ElementValue("InputDescription"), Limit: ElementValue("InputSize") };
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	CommonSetScreen("Online", "ChatBlockItem");
}