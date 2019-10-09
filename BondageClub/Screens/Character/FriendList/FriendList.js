"use strict";
var FriendListBackground = "BrickWall";
var FriendListContent = "";
var FriendListConfirmDelete = [];
var FriendListReturn = null;
var FriendListMode = ["Friends", "Beeps", "Delete"];
var FriendListModeIndex = 0;
var FriendListShowBeep = -1;
var FriendListBeepLog = [];

// Loads the online friend list from the server
function FriendListLoad() {
	FriendListConfirmDelete = [];
	ElementCreateDiv("FriendList");
	ElementPositionFix("FriendList", 36, 0, 70, 2000, 930);
	ElementContent("FriendList", FriendListContent);
	ServerSend("AccountQuery", { Query: "OnlineFriends" });
}

// Run the friend list screen - Draw the controls
function FriendListRun() {
	DrawText(TextGet("OnlineFriend"), 230, 35, "White", "Gray");
	DrawText(TextGet("MemberNumber"), 665, 35, "White", "Gray");
	DrawText(TextGet("ChatRoomName"), 1100, 35, "White", "Gray");
	DrawText(TextGet("Action" + FriendListMode[FriendListModeIndex]), 1535, 35, "White", "Gray");
	ElementPositionFix("FriendList", 36, 5, 75, 1985, 890);
	DrawButton(1865, 5, 60, 60, "", "White", "Icons/Small/Next.png");
	DrawButton(1935, 5, 60, 60, "", "White", "Icons/Small/Exit.png");
}

// When the user clicks on the screen
function FriendListClick() {
	if ((MouseX >= 1865) && (MouseX < 1925) && (MouseY >= 5) && (MouseY < 65)) {
		FriendListModeIndex++;
		if (FriendListModeIndex >= FriendListMode.length) FriendListModeIndex = 0;
		ServerSend("AccountQuery", { Query: "OnlineFriends" });
	}
	if ((MouseX >= 1935) && (MouseX < 1995) && (MouseY >= 5) && (MouseY < 65)) FriendListExit();
}

// when the user exit this screen
function FriendListExit() {
	ElementRemove("FriendList");
	if (FriendListReturn != null) {
		if (FriendListReturn == "ChatSearch") CommonSetScreen("Online", "ChatSearch");
		FriendListReturn = null;
	} else CommonSetScreen("Character", "InformationSheet");
}

// Loads the friend list data in the div
function FriendListLoadFriendList(data) {

	// Loads the header caption
	var BeepCaption = DialogFind(Player, "Beep");
	var DeleteCaption = DialogFind(Player, "Delete");
	var ConfirmDeleteCaption = DialogFind(Player, "ConfirmDelete");
	var PrivateRoomCaption = DialogFind(Player, "PrivateRoom");	
	var SentCaption = DialogFind(Player, "SentBeep");
	var ReceivedCaption = DialogFind(Player, "ReceivedBeep");
	FriendListContent = "";

	// In Friend List mode, we show the friend list and allow doing beeps
	if (FriendListMode[FriendListModeIndex] == "Friends")
		for (var F = 0; F < data.length; F++) {
			FriendListContent += "<div class='FriendListRow'>";
			FriendListContent += "<div class='FriendListTextColumn FriendListFirstColumn'>" + data[F].MemberName + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + data[F].MemberNumber.toString() + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((data[F].ChatRoomName == null) ? "-" : data[F].ChatRoomName.replace("-Private-", PrivateRoomCaption)) + "</div>";
			FriendListContent += "<div class='FriendListLinkColumn' onClick='FriendListBeep(" + data[F].MemberNumber.toString() + ", \"" + data[F].MemberName.toString() + "\")'>" + BeepCaption + "</div>";
			FriendListContent += "</div>";
		}

	// In Beeps mode, we show all the beeps sent and received
	if (FriendListMode[FriendListModeIndex] == "Beeps")
		for (var B = FriendListBeepLog.length - 1; B >= 0; B--) {
			FriendListContent += "<div class='FriendListRow'>";
			FriendListContent += "<div class='FriendListTextColumn FriendListFirstColumn'>" + FriendListBeepLog[B].MemberName + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((FriendListBeepLog[B].MemberNumber != null) ? FriendListBeepLog[B].MemberNumber.toString() : "-") + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((FriendListBeepLog[B].ChatRoomName == null) ? "-" : FriendListBeepLog[B].ChatRoomName.replace("-Private-", PrivateRoomCaption)) + "</div>";
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
				FriendListContent += "<div class='FriendListTextColumn'>" + ((data[F].ChatRoomName == null) ? "-" : data[F].ChatRoomName.replace("-Private-", PrivateRoomCaption)) + "</div>";
				FriendListContent += "<div class='FriendListLinkColumn' onClick='FriendListDelete(" + data[F].MemberNumber.toString() + ")'>" + ((FriendListConfirmDelete.indexOf(data[F].MemberNumber) >= 0) ? ConfirmDeleteCaption : DeleteCaption) + "</div>";
				FriendListContent += "</div>";
			}

	// Loads the friend list div
	ElementContent("FriendList", FriendListContent);

}

// When the user wants to delete someone from her friend list (must click twice to confirm deletion)
function FriendListDelete(MemberNumber) {
	if (FriendListConfirmDelete.indexOf(MemberNumber) >= 0) {
		Player.FriendList.splice(Player.FriendList.indexOf(MemberNumber), 1);
		ServerSend("AccountUpdate", { FriendList: Player.FriendList });
	} else FriendListConfirmDelete.push(MemberNumber);
	ServerSend("AccountQuery", { Query: "OnlineFriends" });
}

// When the user wants to beep someone
function FriendListBeep(MemberNumber, MemberName) {
	ServerSend("AccountBeep", { MemberNumber: MemberNumber });
	FriendListBeepLog.push({ MemberNumber: MemberNumber, MemberName: MemberName, ChatRoomName: ((ChatRoomData == null) ? null : ChatRoomData.Name), Sent: true, Time: new Date() });
}