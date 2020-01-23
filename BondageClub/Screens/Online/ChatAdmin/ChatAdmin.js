"use strict";
var ChatAdminBackground = "Sheet";
var ChatAdminMessage = "";
var ChatAdminPrivate = false;
var ChatAdminBackgroundIndex = 0;
var ChatAdminBackgroundSelect = "";
var ChatAdminPrivate = false;
var ChatAdminLocked = false;
var ChatAdminMode = "";
var ChatAdminOffset = 0;

// When the chat admin screens loads
function ChatAdminLoad(BackgroundIsSet) {

	// If the current room background isn't valid, we pick the first one
	if (BackgroundIsSet != true) {
		ChatAdminBackgroundSelect = ChatRoomData.Background;
		if (ChatCreateBackgroundList.indexOf(ChatAdminBackgroundSelect) < 0) {
			ChatAdminBackgroundIndex = 0;
			ChatAdminBackgroundSelect = ChatCreateBackgroundList[0];
		} else ChatAdminBackgroundIndex = ChatCreateBackgroundList.indexOf(ChatAdminBackgroundSelect);
	}

	ChatAdminBackground = "Sheet";

	// Prepares the controls to edit a room
	ElementCreateInput("InputName", "text", ChatRoomData.Name, "20");
	document.getElementById("InputName").setAttribute("autocomplete", "off");
	ElementCreateInput("InputSize", "text", ChatRoomData.Limit.toString(), "2");
	document.getElementById("InputSize").setAttribute("autocomplete", "off");
	ElementCreateTextArea("InputDescription");
	document.getElementById("InputDescription").setAttribute("maxLength", 100);
	document.getElementById("InputDescription").setAttribute("autocomplete", "off");
	ElementValue("InputDescription", ChatRoomData.Description);
	ElementCreateTextArea("InputAdminList");
	document.getElementById("InputAdminList").setAttribute("maxLength", 250);
	document.getElementById("InputAdminList").setAttribute("autocomplete", "off");
	ElementValue("InputAdminList", CommonConvertArrayToString(ChatRoomData.Admin));
	ElementCreateTextArea("InputBanList");
	document.getElementById("InputBanList").setAttribute("maxLength", 250);
	document.getElementById("InputBanList").setAttribute("autocomplete", "off");
	ElementValue("InputBanList", CommonConvertArrayToString(ChatRoomData.Ban));
	ChatAdminPrivate = ChatRoomData.Private;
	ChatAdminLocked = ChatRoomData.Locked;

	// If the player isn't an admin, we disable the inputs
	if (!ChatRoomPlayerIsAdmin()) {
		document.getElementById("InputName").setAttribute("disabled", "disabled");
		document.getElementById("InputDescription").setAttribute("disabled", "disabled");
		document.getElementById("InputAdminList").setAttribute("disabled", "disabled");
		document.getElementById("InputBanList").setAttribute("disabled", "disabled");
		document.getElementById("InputSize").setAttribute("disabled", "disabled");
		ChatAdminMessage = "AdminOnly";
	} else ChatAdminMessage = "UseMemberNumbers";

}

// When the chat Admin screen runs
function ChatAdminRun() {

	if (ChatAdminMode == "ShowGrid") {
		ChatAdminPreviewRun();
		return;
	}

	// Draw the main controls
	DrawText(TextGet(ChatAdminMessage), 650, 870, "Black", "Gray");
	DrawText(TextGet("RoomName"), 535, 110, "Black", "Gray");
	ElementPosition("InputName", 535, 170, 820);
	DrawText(TextGet("RoomSize"), 1100, 110, "Black", "Gray");
	ElementPosition("InputSize", 1100, 170, 250);
	DrawText(TextGet("RoomDescription"), 675, 265, "Black", "Gray");
	ElementPosition("InputDescription", 675, 380, 1100, 160);
	DrawText(TextGet("RoomAdminList"), 390, 530, "Black", "Gray");
	ElementPosition("InputAdminList", 390, 680, 530, 230);
	DrawText(TextGet("RoomBanList"), 960, 530, "Black", "Gray");
	ElementPosition("InputBanList", 960, 680, 530, 230);

	// Background selection
	DrawImageResize("Backgrounds/" + ChatAdminBackgroundSelect + "Dark.jpg", 1300, 75, 600, 400);
	DrawBackNextButton(1350, 500, 500, 65, TextGet(ChatAdminBackgroundSelect), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null,
		() => TextGet((ChatAdminBackgroundIndex == 0) ? ChatCreateBackgroundList[ChatCreateBackgroundList.length - 1] : ChatCreateBackgroundList[ChatAdminBackgroundIndex - 1]),
		() => TextGet((ChatAdminBackgroundIndex >= ChatCreateBackgroundList.length - 1) ? ChatCreateBackgroundList[0] : ChatCreateBackgroundList[ChatAdminBackgroundIndex + 1]));

	// Private and Locked check boxes
	DrawText(TextGet("RoomPrivate"), 1514, 640, "Black", "Gray");
	DrawButton(1686, 608, 64, 64, "", ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", ChatAdminPrivate ? "Icons/Checked.png" : "");
	DrawText(TextGet("RoomLocked"), 1514, 740, "Black", "Gray");
	DrawButton(1686, 708, 64, 64, "", ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", ChatAdminLocked ? "Icons/Checked.png" : "");

	// Save & Cancel/Exit buttons + help text
	DrawButton(1325, 840, 250, 65, TextGet("Save"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4");
	DrawButton(1625, 840, 250, 65, TextGet(ChatRoomPlayerIsAdmin() ? "Cancel" : "Exit"), "White");
}

// When the player clicks in the chat Admin screen
function ChatAdminClick() {

	if (ChatAdminMode == "ShowGrid") {
		ChatAdminPreviewClick();
		return;
	}

	// When the user cancels/exits
	if ((MouseX >= 1625) && (MouseX < 1875) && (MouseY >= 840) && (MouseY < 905)) ChatAdminExit();

	// All other controls are for administrators only
	if (ChatRoomPlayerIsAdmin()) {

		// When we select a new background
		if ((MouseX >= 1350) && (MouseX <= 1850) && (MouseY >= 500) && (MouseY <= 565)) {
			ChatAdminBackgroundIndex += ((MouseX < 1600 && !CommonIsMobile) ? -1 : 1);
			if (ChatAdminBackgroundIndex >= ChatCreateBackgroundList.length) ChatAdminBackgroundIndex = 0;
			if (ChatAdminBackgroundIndex < 0) ChatAdminBackgroundIndex = ChatCreateBackgroundList.length - 1;
			ChatAdminBackgroundSelect = ChatCreateBackgroundList[ChatAdminBackgroundIndex];
		}

		// Private & Locked check boxes + save button
		if ((MouseX >= 1686) && (MouseX <= 1750) && (MouseY >= 608) && (MouseY <= 672)) ChatAdminPrivate = !ChatAdminPrivate;
		if ((MouseX >= 1686) && (MouseX <= 1750) && (MouseY >= 708) && (MouseY <= 772)) ChatAdminLocked = !ChatAdminLocked;
		if ((MouseX >= 1325) && (MouseX < 1575) && (MouseY >= 840) && (MouseY < 905) && ChatRoomPlayerIsAdmin()) ChatAdminUpdateRoom();

		if ((MouseX >= 1300) && (MouseX <= 1300 + 600) && (MouseY >= 75) && (MouseY <= 75 + 400)) {
			ChatAdminMode = "ShowGrid";
			ChatAdminBackground = ChatAdminBackgroundSelect;
			ElementRemove("InputName");
			ElementRemove("InputDescription");
			ElementRemove("InputSize");
			ElementRemove("InputAdminList");
			ElementRemove("InputBanList");
		}
	}
}

// When the chat background selection screen runs
function ChatAdminPreviewRun() {
	DrawButton(1785, 25, 90, 90, "", "White", "Icons/Next.png");
	DrawButton(1885, 25, 90, 90,"", "White", "Icons/Exit.png");
	var X = 45;
	var Y = 170;
	for (var i = 0; (i + ChatAdminOffset) < ChatCreateBackgroundList.length && i < 12; ++i) {
		DrawButton(X, Y, 450, 225, ChatCreateBackgroundList[i + ChatAdminOffset], "White");
		DrawImageResize("Backgrounds/" + ChatCreateBackgroundList[i + ChatAdminOffset] + ".jpg", X + 2, Y + 2, 446, 221);
		X += 450 + 35;
		if (i % 4 == 3) {
			X = 45;
			Y += 225 + 35;
		}
	}
}

// When the player clicks in the background selection screen
function ChatAdminPreviewClick() {

	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) {
		ChatAdminExit();
	}

	if ((MouseX >= 1785) && (MouseX < 1875) && (MouseY >= 25) && (MouseY < 115)) {
		ChatAdminOffset += 12;
		if (ChatAdminOffset >= ChatCreateBackgroundList.length) ChatAdminOffset = 0;
	}

	var X = 45;
	var Y = 170;
	for (var i = 0; (i + ChatAdminOffset) < ChatCreateBackgroundList.length && i < 12; ++i) {
		if ((MouseX >= X) && (MouseX < X + 450) && (MouseY >= Y) && (MouseY < Y + 225)) {
			ChatAdminBackgroundIndex = i + ChatAdminOffset;
			if (ChatAdminBackgroundIndex >= ChatCreateBackgroundList.length) ChatAdminBackgroundIndex = 0;
			if (ChatAdminBackgroundIndex < 0) ChatAdminBackgroundIndex = ChatCreateBackgroundList.length - 1;
			ChatAdminBackgroundSelect = ChatCreateBackgroundList[ChatAdminBackgroundIndex];
			ChatAdminBackground = ChatAdminBackgroundSelect;
		}
		X += 450 + 35;
		if (i % 4 == 3) {
			X = 45;
			Y += 225 + 35;
		}
	}
}


// When the user exit from this screen
function ChatAdminExit() {
	if (ChatAdminMode == "ShowGrid") {
		ChatAdminMode = "";
		ChatAdminLoad(true);
		return;
	}
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ElementRemove("InputAdminList");
	ElementRemove("InputBanList");
	CommonSetScreen("Online", "ChatRoom");
}

// When the server sends a response, if it was updated properly we exit, if not we show the error
function ChatAdminResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		if (data === "Updated") ChatAdminExit();
		else ChatAdminMessage = "Response" + data;
}

// Sends the chat room update packet to the server and waits for the answer
function ChatAdminUpdateRoom() {
	var UpdatedRoom = {
		Name: ElementValue("InputName").trim(),
		Description: ElementValue("InputDescription").trim(),
		Background: ChatAdminBackgroundSelect,
		Limit: ElementValue("InputSize").trim(),
		Admin: CommonConvertStringToArray(ElementValue("InputAdminList").trim()),
		Ban: CommonConvertStringToArray(ElementValue("InputBanList").trim()),
		Private: ChatAdminPrivate,
		Locked: ChatAdminLocked
	};
	ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
	ChatAdminMessage = "UpdatingRoom";
}