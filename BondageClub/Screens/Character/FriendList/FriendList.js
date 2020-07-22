"use strict";
var FriendListBackground = "BrickWall";
var FriendListContent = "";
var FriendListConfirmDelete = [];
var FriendListReturn = null;
var FriendListMode = ["Friends", "Beeps", "Delete"];
var FriendListModeIndex = 0;
var FriendListShowBeep = -1;
var FriendListBeepLog = [];

/**
 * Loads the online friend list from the server. This function is called dynamically, when the player invokes the friendlist dialog.
 * @returns {void} - Nothing
 */
function FriendListLoad() {
	FriendListConfirmDelete = [];
	ElementCreateDiv("FriendList");
	ElementPositionFix("FriendList", 36, 0, 70, 2000, 930);
	ElementContent("FriendList", FriendListContent);
	ServerSend("AccountQuery", { Query: "OnlineFriends" });
}

// 
/**
 * Run the friend list screen - Draw the controls and print the result of the server query to the screen. 
 * This function is called dynamically on a regular basis. So don't do complex loops within
 * @returns {void} - Nothing
 */
function FriendListRun() {
	DrawText(TextGet("OnlineFriend"), 230, 35, "White", "Gray");
	DrawText(TextGet("MemberNumber"), 665, 35, "White", "Gray");
	DrawText(TextGet("ChatRoomName"), 1100, 35, "White", "Gray");
	DrawText(TextGet("Action" + FriendListMode[FriendListModeIndex]), 1535, 35, "White", "Gray");
	ElementPositionFix("FriendList", 36, 5, 75, 1985, 890);
	DrawButton(1865, 5, 60, 60, "", "White", "Icons/Small/Next.png");
	DrawButton(1935, 5, 60, 60, "", "White", "Icons/Small/Exit.png");
}

/**
 * Handles the click events in the friend list. Clicks are propagated to this function from CommonClick()
 * @returns {void} - Nothing
 */
function FriendListClick() {
	if ((MouseX >= 1865) && (MouseX < 1925) && (MouseY >= 5) && (MouseY < 65)) {
		FriendListModeIndex++;
		if (FriendListModeIndex >= FriendListMode.length) FriendListModeIndex = 0;
		ServerSend("AccountQuery", { Query: "OnlineFriends" });
	}
	if ((MouseX >= 1935) && (MouseX < 1995) && (MouseY >= 5) && (MouseY < 65)) FriendListExit();
}

/**
 * This function is called, when the user exists the friend list. From here we either get back to the InformationSheet 
 * or the ChatRoom serach, depending on the value of the global variable 'FriendListReturn'
 * @returns {void} - Nothing
 */
function FriendListExit() {
	ElementRemove("FriendList");
	if (FriendListReturn != null) {
		if (FriendListReturn == "ChatSearch") CommonSetScreen("Online", "ChatSearch");
		FriendListReturn = null;
	} else CommonSetScreen("Character", "InformationSheet");
}

// 
/**
 * Loads the friend list data into the HTML div element.
 * @param {Array.<*>} data - An array of data, we receive from the server
 * @param {string} data.MemberName - The name of the player
 * @param {number} data.MemberNumber - The ID of the player
 * @param {string} data.ChatRoomName - The name of the ChatRoom
 * @param {string} data.ChatRoomSpace - The space, where this room was created. Currently this can be the Asylum or the LARP arena
 * @param {string} data.Type - The relationship that exists between the player and the friend of the list. 
 * Currently, only "submissive" is supported
 * @returns {void} - Nothing
 */
function FriendListLoadFriendList(data) {

	// Loads the header caption
	var BeepCaption = DialogFind(Player, "Beep");
	var DeleteCaption = DialogFind(Player, "Delete");
	var ConfirmDeleteCaption = DialogFind(Player, "ConfirmDelete");
	var PrivateRoomCaption = DialogFind(Player, "PrivateRoom");
	var SentCaption = DialogFind(Player, "SentBeep");
	var ReceivedCaption = DialogFind(Player, "ReceivedBeep");
	var SpaceAsylumCaption = DialogFind(Player, "ChatRoomSpaceAsylum");
	FriendListContent = "";

	// In Friend List mode, we show the friend list and allow doing beeps
	if (FriendListMode[FriendListModeIndex] == "Friends")
		for (var F = 0; F < data.length; F++) {
			FriendListContent += "<div class='FriendListRow'>";
			FriendListContent += "<div class='FriendListTextColumn FriendListFirstColumn'>" + data[F].MemberName + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + data[F].MemberNumber.toString() + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((data[F].ChatRoomName == null) ? "-" : (data[F].ChatRoomSpace ? data[F].ChatRoomSpace.replace("Asylum", SpaceAsylumCaption) + " - " : '') + data[F].ChatRoomName.replace("-Private-", PrivateRoomCaption)) + "</div>";
			FriendListContent += "<div class='FriendListLinkColumn' onClick='FriendListBeep(" + data[F].MemberNumber.toString() + ", \"" + data[F].MemberName.toString() + "\")'>" + BeepCaption + "</div>";
			FriendListContent += "</div>";
		}

	// In Beeps mode, we show all the beeps sent and received
	if (FriendListMode[FriendListModeIndex] == "Beeps")
		for (var B = FriendListBeepLog.length - 1; B >= 0; B--) {
			FriendListContent += "<div class='FriendListRow'>";
			FriendListContent += "<div class='FriendListTextColumn FriendListFirstColumn'>" + FriendListBeepLog[B].MemberName + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((FriendListBeepLog[B].MemberNumber != null) ? FriendListBeepLog[B].MemberNumber.toString() : "-") + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((FriendListBeepLog[B].ChatRoomName == null) ? "-" : (FriendListBeepLog[B].ChatRoomSpace ? FriendListBeepLog[B].ChatRoomSpace.replace("Asylum", SpaceAsylumCaption) + " - " : '') + FriendListBeepLog[B].ChatRoomName.replace("-Private-", PrivateRoomCaption)) + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((FriendListBeepLog[B].Sent) ? SentCaption : ReceivedCaption) + " " + TimerHourToString(FriendListBeepLog[B].Time) + "</div>";
			FriendListContent += "</div>";
		}

	// In Delete mode, we show the friend list and allow the user to remove them
	if (FriendListMode[FriendListModeIndex] == "Delete")
		for (var F = 0; F < data.length; F++)
			if ((data[F].Type == null) || (data[F].Type != "Submissive")) {
				FriendListContent += "<div class='FriendListRow'>";
				FriendListContent += "<div class='FriendListTextColumn FriendListFirstColumn'>" + data[F].MemberName + "</div>";
				FriendListContent += "<div class='FriendListTextColumn'>" + data[F].MemberNumber.toString() + "</div>";
				FriendListContent += "<div class='FriendListTextColumn'>" + ((data[F].ChatRoomName == null) ? "-" : (data[F].ChatRoomSpace ? data[F].ChatRoomSpace.replace("Asylum", SpaceAsylumCaption) + " - " : '') + data[F].ChatRoomName.replace("-Private-", PrivateRoomCaption)) + "</div>";
				FriendListContent += "<div class='FriendListLinkColumn' onClick='FriendListDelete(" + data[F].MemberNumber.toString() + ")'>" + ((FriendListConfirmDelete.indexOf(data[F].MemberNumber) >= 0) ? ConfirmDeleteCaption : DeleteCaption) + "</div>";
				FriendListContent += "</div>";
			}

	// Loads the friend list div
	ElementContent("FriendList", FriendListContent);

}

/**
 * When the user wants to delete someone from her friend list this must be confirmed. 
 * This function either displays the confirm message or deletes the friend from the player's friendlist
 * @param {number} MemberNumber - The member to delete from the friendlist
 * @returns {void} - Nothing
 */
function FriendListDelete(MemberNumber) {
	if (FriendListConfirmDelete.indexOf(MemberNumber) >= 0) {
		Player.FriendList.splice(Player.FriendList.indexOf(MemberNumber), 1);
		ServerSend("AccountUpdate", { FriendList: Player.FriendList });
	} else FriendListConfirmDelete.push(MemberNumber);
	ServerSend("AccountQuery", { Query: "OnlineFriends" });
}

/**
 * Beeps a given member by sending the name and the current room of the beepee. Also adds an entry to the beep log of the player
 * @param {number} MemberNumber - The ID of the player to beep
 * @param {string} MemberName - The name of the player to beep
 */
function FriendListBeep(MemberNumber, MemberName) {
	ServerSend("AccountBeep", { MemberNumber: MemberNumber });
	FriendListBeepLog.push({ MemberNumber: MemberNumber, MemberName: MemberName, ChatRoomName: ((ChatRoomData == null) ? null : ChatRoomData.Name), Sent: true, Time: new Date() });
}
