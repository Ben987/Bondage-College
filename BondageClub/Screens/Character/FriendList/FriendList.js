"use strict";
var FriendListBackground = "BrickWall";
var FriendListContent = "";
var FriendListConfirmDelete = [];
var FriendListReturn = null;
var FriendListModes = ["Beeps", "Delete"];
var FriendListModeIndex = 0;
var FriendListShowBeep = -1;
var FriendListLastBeeps = new Map();
var FriendListLastData = [];

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
	DrawText(TextGet("OnlineFriend"), 340, 35, "White", "Gray");
	DrawText(TextGet("MemberNumber"), 800, 35, "White", "Gray");
	DrawText(TextGet("ChatRoomName"), 1270, 35, "White", "Gray");
	DrawText(TextGet("Action"), 1685, 35, "White", "Gray");
	ElementPositionFix("FriendList", 36, 5, 75, 1885, 890);
	DrawButton(1865, 5, 60, 60, "", "White", "Icons/Small/Next.png");
	DrawButton(1935, 5, 60, 60, "", "White", "Icons/Small/Exit.png");
}

// When the user clicks on the screen
function FriendListClick() {
	if ((MouseX >= 1865) && (MouseX < 1925) && (MouseY >= 5) && (MouseY < 65)) {
		FriendListModeIndex++;
		if (FriendListModeIndex >= FriendListModes.length) FriendListModeIndex = 0;
		ServerSend("AccountQuery", { Query: "OnlineFriends" });
	}
	if ((MouseX >= 1935) && (MouseX < 1995) && (MouseY >= 5) && (MouseY < 65)) {
		ElementRemove("FriendList");
		if (FriendListReturn != null) {
			if (FriendListReturn == "ChatSearch") CommonSetScreen("Online", "ChatSearch");
			FriendListReturn = null;
		} else CommonSetScreen("Character", "InformationSheet");
	}
}

// Loads the friend list data in the div
function FriendListLoadFriendList(data) {
	FriendListLastData = data;
	var BeepCaption = DialogFind(Player, "Beep");
	var DeleteCaption = DialogFind(Player, "Delete");
	var ConfirmDeleteCaption = DialogFind(Player, "ConfirmDelete");
	var PrivateRoomCaption = DialogFind(Player, "PrivateRoom");
	FriendListContent = "";
	for (var F = 0; F < data.length; F++) {
		var friend = "";
		friend += "<div class='FriendListRow'>";
		friend += "<div class='FriendListRow'>";
		friend += "<div class='FriendListTextColumn FriendListFirstColumn'>" + data[F].MemberName + "</div>";
		friend += "<div class='FriendListTextColumn'>" + data[F].MemberNumber.toString() + "</div>";
		friend += "<div class='FriendListTextColumn'>" + ((data[F].ChatRoomName == null) ? "-" : data[F].ChatRoomName.replace("-Private-", PrivateRoomCaption)) + "</div>";
		friend += "<div class='FriendListLinkColumn' onClick='FriendListBeep(" + data[F].MemberNumber.toString() + ")'>" + BeepCaption + "</div>";
		if (FriendListModes[FriendListModeIndex] == "Beeps") {
			if (FriendListLastBeeps.has(data[F].MemberNumber)) {
				friend += "<div class='FriendListLinkColumn' ";
				if (CommonIsMobile) {
					if (FriendListShowBeep == data[F].MemberNumber) {
						friend += "onClick='FriendListShowLastBeep(" + data[F].MemberNumber.toString() + ", false)' ";
					} else {
						friend += "onClick='FriendListShowLastBeep(" + data[F].MemberNumber.toString() + ", true)' ";
					}
				} else {
					friend += "onmouseover='FriendListShowLastBeep(" + data[F].MemberNumber.toString() + ", true)' ";
					friend += "onmouseout='FriendListShowLastBeep(" + data[F].MemberNumber.toString() + ", false)' ";
				}
				friend += "ondblclick='FriendListRemoveLastBeep(" + data[F].MemberNumber.toString() + ")' >";
				if (FriendListShowBeep == data[F].MemberNumber) {
					friend += FriendListLastBeeps.get(data[F].MemberNumber).Message;
				} else {
					friend += FriendListLastBeeps.get(data[F].MemberNumber).Time;
				}
				friend += "</div>";
			}
		} else if (FriendListModes[FriendListModeIndex] = "Delete") {
			if ((data[F].Type != null) && (data[F].Type != "Submissive")) {
				friend += "<div class='FriendListLinkColumn' onClick='FriendListDelete(" + data[F].MemberNumber.toString() + ")'>" + ((FriendListConfirmDelete.indexOf(data[F].MemberNumber) >= 0) ? ConfirmDeleteCaption : DeleteCaption) + "</div>";
			}
		}
		friend += "</div>";
		FriendListContent += friend;
	}
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
function FriendListBeep(MemberNumber) {
	ServerSend("AccountBeep", { MemberNumber: MemberNumber });
}

// sets the membernumber to show 
function FriendListShowLastBeep(MemberNumber, Show) {
	FriendListShowBeep = Show ? MemberNumber : -1;
	FriendListLoadFriendList(FriendListLastData);
}

// removes a saved beep
function FriendListRemoveLastBeep(MemberNumber) {
	FriendListShowBeep = -1;
	FriendListLastBeeps.delete(MemberNumber);
	FriendListLoadFriendList(FriendListLastData);
}