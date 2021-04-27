"use strict";
var ChatAdminBackground = "Sheet";
var ChatAdminMessage = "";
var ChatAdminBackgroundIndex = 0;
var ChatAdminBackgroundSelect = "";
var ChatAdminPrivate = false;
var ChatAdminLocked = false;
var ChatAdminGame = "";
var ChatAdminGameList = ["", "LARP"];
var ChatAdminBackgroundSelected = null;
var ChatAdminTemporaryData = null;
var ChatAdminBlockCategory = [];

/**
 * Loads the chat Admin screen properties and creates the inputs
 * @returns {void} - Nothing
 */
function ChatAdminLoad() {

	// If the current room background isn't valid, we pick the first one
	ChatAdminBackgroundSelect = ChatAdminBackgroundSelected || ChatRoomData.Background;
	ChatAdminBackgroundIndex = ChatCreateBackgroundList.indexOf(ChatAdminBackgroundSelect);
	if (ChatAdminBackgroundIndex < 0) ChatAdminBackgroundIndex = 0;
	ChatAdminBackgroundSelect = ChatCreateBackgroundList[ChatAdminBackgroundIndex];
	ChatAdminBlockCategory = ChatRoomData.BlockCategory;
	ChatAdminGame = ChatRoomGame;

	// Prepares the controls to edit a room
	ElementCreateInput("InputName", "text", ChatAdminTemporaryData ? ChatAdminTemporaryData.Name : ChatRoomData.Name, "20");
	document.getElementById("InputName").setAttribute("autocomplete", "off");
	ElementCreateInput("InputSize", "text", ChatAdminTemporaryData ? ChatAdminTemporaryData.Limit : ChatRoomData.Limit.toString(), "2");
	document.getElementById("InputSize").setAttribute("autocomplete", "off");
	ElementCreateTextArea("InputDescription");
	document.getElementById("InputDescription").setAttribute("maxLength", 100);
	document.getElementById("InputDescription").setAttribute("autocomplete", "off");
	ElementValue("InputDescription", ChatAdminTemporaryData ? ChatAdminTemporaryData.Description : ChatRoomData.Description);
	ElementCreateTextArea("InputAdminList");
	document.getElementById("InputAdminList").setAttribute("maxLength", 250);
	document.getElementById("InputAdminList").setAttribute("autocomplete", "off");
	ElementValue("InputAdminList", ChatAdminTemporaryData ? ChatAdminTemporaryData.AdminList : CommonConvertArrayToString(ChatRoomData.Admin));
	ElementCreateTextArea("InputVipList");
	document.getElementById("InputVipList").setAttribute("maxLength", 1000);
	document.getElementById("InputVipList").setAttribute("autocomplete", "off");
	ElementValue("InputVipList", ChatAdminTemporaryData ? ChatAdminTemporaryData.VipList : CommonConvertArrayToString(ChatRoomData.Vip));
	ElementCreateTextArea("InputBanList");
	document.getElementById("InputBanList").setAttribute("maxLength", 1000);
	document.getElementById("InputBanList").setAttribute("autocomplete", "off");
	ElementValue("InputBanList", ChatAdminTemporaryData ? ChatAdminTemporaryData.BanList : CommonConvertArrayToString(ChatRoomData.Ban));
	ChatAdminPrivate = ChatAdminTemporaryData ? ChatAdminTemporaryData.Private :ChatRoomData.Private;
	ChatAdminLocked = ChatAdminTemporaryData ? ChatAdminTemporaryData.Locked : ChatRoomData.Locked;

	// If the player isn't an admin, we disable the inputs
	if (!ChatRoomPlayerIsAdmin()) {
		document.getElementById("InputName").setAttribute("disabled", "disabled");
		document.getElementById("InputDescription").setAttribute("disabled", "disabled");
		document.getElementById("InputAdminList").setAttribute("disabled", "disabled");
		document.getElementById("InputVipList").setAttribute("disabled", "disabled");
		document.getElementById("InputBanList").setAttribute("disabled", "disabled");
		document.getElementById("InputSize").setAttribute("disabled", "disabled");
		ChatAdminMessage = "AdminOnly";
	} else ChatAdminMessage = "UseMemberNumbers";

}

/**
 * When the chat Admin screen runs, draws the screen
 * @returns {void} - Nothing
 */
function ChatAdminRun() {

	// Draw the main controls
	DrawText(TextGet(ChatAdminMessage), 650, 885, "Black", "Gray");
	DrawText(TextGet("RoomName"), 535, 110, "Black", "Gray");
	ElementPosition("InputName", 535, 170, 820);
	DrawText(TextGet("RoomSize"), 1100, 110, "Black", "Gray");
	ElementPosition("InputSize", 1100, 170, 250);
	DrawText(TextGet("RoomDescription"), 675, 255, "Black", "Gray");
	ElementPosition("InputDescription", 675, 350, 1100, 140);
	
	DrawText(TextGet("RoomAdminList"), 280, 490, "Black", "Gray");
	ElementPosition("InputAdminList", 280, 685, 380, 300);
	DrawText(TextGet("RoomVipList"), 670, 490, "Black", "Gray");
	ElementPosition("InputVipList", 670, 640, 380, 210);
	DrawText(TextGet("RoomBanList"), 1060, 490, "Black", "Gray");
	ElementPosition("InputBanList", 1060, 640, 380, 210);
	
	DrawButton(480, 770, 360, 35, TextGet("QuickvipFriendList"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	DrawButton(480, 810, 360, 35, TextGet("QuickvipWhiteList"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	
	DrawButton(870, 770, 360, 35, TextGet("QuickbanBlackList"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	DrawButton(870, 810, 360, 35, TextGet("QuickbanGhostList"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());

	// Background selection, block button and game selection
	DrawImageResize("Backgrounds/" + ChatAdminBackgroundSelect + ".jpg", 1300, 75, 600, 350);
	DrawBackNextButton(1300, 450, 500, 60, DialogFindPlayer(ChatAdminBackgroundSelect), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null,
		() => DialogFindPlayer((ChatAdminBackgroundIndex == 0) ? ChatCreateBackgroundList[ChatCreateBackgroundList.length - 1] : ChatCreateBackgroundList[ChatAdminBackgroundIndex - 1]),
		() => DialogFindPlayer((ChatAdminBackgroundIndex >= ChatCreateBackgroundList.length - 1) ? ChatCreateBackgroundList[0] : ChatCreateBackgroundList[ChatAdminBackgroundIndex + 1]), !ChatRoomPlayerIsAdmin());
	DrawButton(1840, 450, 60, 60, "", ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", "Icons/Small/Preference.png", null, !ChatRoomPlayerIsAdmin());
	DrawButton(1300, 575, 275, 60, TextGet("BlockCategory"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	DrawBackNextButton(1625, 575, 275, 60, TextGet("Game" + ChatAdminGame), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, () => "", () => "");

	// Private and Locked check boxes
	DrawText(TextGet("RoomPrivate"), 1384, 740, "Black", "Gray");
	DrawButton(1486, 708, 64, 64, "", ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", ChatAdminPrivate ? "Icons/Checked.png" : "", null, !ChatRoomPlayerIsAdmin());
	DrawText(TextGet("RoomLocked"), 1684, 740, "Black", "Gray");
	DrawButton(1786, 708, 64, 64, "", ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", ChatAdminLocked ? "Icons/Checked.png" : "", null, !ChatRoomPlayerIsAdmin());

	// Save & Cancel/Exit buttons + help text
	DrawButton(1325, 840, 250, 65, TextGet("Save"), ChatRoomPlayerIsAdmin() ? "White" : "#ebebe4", null, null, !ChatRoomPlayerIsAdmin());
	DrawButton(1625, 840, 250, 65, TextGet(ChatRoomPlayerIsAdmin() ? "Cancel" : "Exit"), "White");
}

/**
 * Handles the click events on the admin screen. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function ChatAdminClick() {

	// When the user cancels/exits
	if (MouseIn(1625, 840, 250, 65)) ChatAdminExit();

	// All other controls are for administrators only
	if (ChatRoomPlayerIsAdmin()) {

		// When we select a new background
		if (MouseIn(1300, 450, 500, 60)) {
			ChatAdminBackgroundIndex += ((MouseX < 1550) ? -1 : 1);
			if (ChatAdminBackgroundIndex >= ChatCreateBackgroundList.length) ChatAdminBackgroundIndex = 0;
			if (ChatAdminBackgroundIndex < 0) ChatAdminBackgroundIndex = ChatCreateBackgroundList.length - 1;
			ChatAdminBackgroundSelect = ChatCreateBackgroundList[ChatAdminBackgroundIndex];
		}

		// When we select a new game type
		if (MouseIn(1625, 575, 275, 60)) {
			let Index = ChatAdminGameList.indexOf(ChatAdminGame);
			Index = Index + ((MouseX < 1763) ? -1 : 1);
			if (Index < 0) Index = ChatAdminGameList.length - 1;
			if (Index >= ChatAdminGameList.length) Index = 0;
			ChatAdminGame = ChatAdminGameList[Index];
		}

		// Background selection button and item block button (Save values before entering)
		if (MouseIn(1300, 75, 600, 350) || MouseIn(1840, 450, 60, 60) || MouseIn(1300, 575, 275, 60)) {
			ChatAdminTemporaryData = {
				Name: ElementValue("InputName"),
				Description: ElementValue("InputDescription"),
				Limit: ElementValue("InputSize"),
				AdminList: ElementValue("InputAdminList"),
				BanList: ElementValue("InputBanList"),
				VipList: ElementValue("InputVipList"),
				Private: ChatAdminPrivate,
				Locked: ChatAdminLocked,
			};
			ElementRemove("InputName");
			ElementRemove("InputDescription");
			ElementRemove("InputSize");
			ElementRemove("InputAdminList");
			ElementRemove("InputBanList");
			ElementRemove("InputVipList");
			if (MouseIn(1300, 575, 275, 60)) {
				ChatBlockItemReturnData = { Screen: "ChatAdmin" };
				ChatBlockItemCategory = ChatAdminBlockCategory;
				CommonSetScreen("Online", "ChatBlockItem");
			} else BackgroundSelectionMake(ChatCreateBackgroundList, ChatAdminBackgroundIndex, Name => ChatAdminBackgroundSelected = Name);
		}

		// Private & Locked check boxes + save button + quickban buttons
		if (MouseIn(1486, 708, 64, 64)) ChatAdminPrivate = !ChatAdminPrivate;
		if (MouseIn(1786, 708, 64, 64)) ChatAdminLocked = !ChatAdminLocked;
		if (MouseIn(1325, 840, 250, 65) && ChatRoomPlayerIsAdmin()) ChatAdminUpdateRoom();

		if (MouseIn(480, 770, 360, 35)) ElementValue("InputVipList", CommonConvertArrayToString(ChatRoomConcatenateVipList(true, false, CommonConvertStringToArray(ElementValue("InputVipList").trim()))));
		if (MouseIn(480, 810, 360, 35)) ElementValue("InputVipList", CommonConvertArrayToString(ChatRoomConcatenateVipList(false, true, CommonConvertStringToArray(ElementValue("InputVipList").trim()))));
		if (MouseIn(870, 770, 360, 35)) ElementValue("InputBanList", CommonConvertArrayToString(ChatRoomConcatenateBanList(true, false, CommonConvertStringToArray(ElementValue("InputBanList").trim()))));
		if (MouseIn(870, 810, 360, 35)) ElementValue("InputBanList", CommonConvertArrayToString(ChatRoomConcatenateBanList(false, true, CommonConvertStringToArray(ElementValue("InputBanList").trim()))));


	}
}

/**
 * Handles exiting from the admin screen, removes the inputs and resets the state of the variables
 * @returns {void} - Nothing
 */
function ChatAdminExit() {
	ChatAdminBackgroundSelected = null;
	ChatAdminTemporaryData = null;
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ElementRemove("InputAdminList");
	ElementRemove("InputBanList");
	ElementRemove("InputVipList");
	CommonSetScreen("Online", "ChatRoom");
}

/**
 * Handles the reception of the server response after attempting to update a chatroom: Leaves the admin screen or shows an error message
 * @param {string} data - Response from the server ("Updated" or error message)
 * @returns {void} - Nothing
 */
function ChatAdminResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		if (data === "Updated") ChatAdminExit();
		else ChatAdminMessage = "Response" + data;
}

/**
 * Sends the chat room data packet to the server. The response will be handled by ChatAdminResponse once it is received
 * @returns {void} - Nothing
 */
function ChatAdminUpdateRoom() {
	var UpdatedRoom = {
		Name: ElementValue("InputName").trim(),
		Description: ElementValue("InputDescription").trim(),
		Background: ChatAdminBackgroundSelect,
		Limit: ElementValue("InputSize").trim(),
		Admin: CommonConvertStringToArray(ElementValue("InputAdminList").trim()),
		Ban: CommonConvertStringToArray(ElementValue("InputBanList").trim()),
		Vip: CommonConvertStringToArray(ElementValue("InputVipList").trim()),
		BlockCategory: ChatAdminBlockCategory,
		Game: ChatAdminGame,
		Private: ChatAdminPrivate,
		Locked: ChatAdminLocked
	};
	ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
	ChatAdminMessage = "UpdatingRoom";
}
