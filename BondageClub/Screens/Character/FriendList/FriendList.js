"use strict";
var FriendListBackground = "BrickWall";
var FriendListContent = "";
var FriendListConfirmDelete = [];
var FriendListReturn = null;

// Loads the online friend list from the server
function FriendListLoad() {
	FriendListConfirmDelete = [];
	ElementCreateDiv("FriendList");
	ElementPositionFix("FriendList", 36, 0, 70, 2000, 930);
	ElementContent("FriendList", FriendListContent);
	ServerSend("AccountQuery", {Query: "OnlineFriends"});
}

// Run the friend list screen - Draw the controls
function FriendListRun() {
	DrawText(TextGet("OnlineFriend"), 340, 35, "White", "Gray");
	DrawText(TextGet("MemberNumber"), 800, 35, "White", "Gray");
	DrawText(TextGet("ChatRoomName"), 1270, 35, "White", "Gray");
	DrawText(TextGet("Action"), 1685, 35, "White", "Gray");
	ElementPositionFix("FriendList", 36, 5, 75, 1885, 890);
	DrawButton(1935, 5, 60, 60, "", "White", "Icons/Small/Exit.png");
}

// When the user clicks on the screen
function FriendListClick() {
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
	var BeepCaption = DialogFind(Player, "Beep");
	var DeleteCaption = DialogFind(Player, "Delete");
	var ConfirmDeleteCaption = DialogFind(Player, "ConfirmDelete");
	var PrivateRoomCaption = DialogFind(Player, "PrivateRoom");
	FriendListContent = "";
	for (var F = 0; F < data.length; F++) {
		FriendListContent = FriendListContent + "<div class='FriendListRow'>";
		FriendListContent = FriendListContent + "<div class='FriendListTextColumn FriendListFirstColumn'>" + data[F].MemberName + "</div>";
		FriendListContent = FriendListContent + "<div class='FriendListTextColumn'>" + data[F].MemberNumber.toString() + "</div>";
		FriendListContent = FriendListContent + "<div class='FriendListTextColumn'>" + ((data[F].ChatRoomName == null) ? "-" : data[F].ChatRoomName.replace("-Private-", PrivateRoomCaption)) + "</div>";
		FriendListContent = FriendListContent + "<div class='FriendListLinkColumn' onClick='FriendListBeep(" + data[F].MemberNumber.toString() + ")'>" + BeepCaption + "</div>";
		if ((data[F].Type != null) && (data[F].Type != "Submissive")) FriendListContent = FriendListContent + "<div class='FriendListLinkColumn' onClick='FriendListDelete(" + data[F].MemberNumber.toString() + ")'>" + ((FriendListConfirmDelete.indexOf(data[F].MemberNumber) >= 0) ? ConfirmDeleteCaption : DeleteCaption) + "</div>";
		FriendListContent = FriendListContent + "</div>";
	}
	ElementContent("FriendList", FriendListContent);
}

// When the user wants to delete someone from her friend list (must click twice to confirm deletion)
function FriendListDelete(MemberNumber) {
	if (FriendListConfirmDelete.indexOf(MemberNumber) >= 0) {
		Player.FriendList.splice(Player.FriendList.indexOf(MemberNumber), 1);
		ServerSend("AccountUpdate", {FriendList: Player.FriendList});
	} else FriendListConfirmDelete.push(MemberNumber);
	ServerSend("AccountQuery", {Query: "OnlineFriends"});
}

// When the user wants to beep someone
function FriendListBeep(MemberNumber) {
	ServerSend("AccountBeep", {MemberNumber: MemberNumber});
}