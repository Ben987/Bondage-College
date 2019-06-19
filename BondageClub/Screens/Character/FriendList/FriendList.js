"use strict";
var FriendListBackground = "BrickWall";
var FriendListContent = "";

// Loads the online friend list from the server
function FriendListLoad() {
	ElementCreateDiv("FriendList");
	ElementPositionFix("FriendList", 36, 0, 70, 2000, 930);
	ElementContent("FriendList", FriendListContent);
	ServerSend("AccountQuery", {Query: "OnlineFriends"});
}

// Run the friend list screen - Draw the controls
function FriendListRun() {
	DrawText(TextGet("OnlineFriend"), 380, 35, "White", "Gray");
	DrawText(TextGet("MemberNumber"), 940, 35, "White", "Gray");
	DrawText(TextGet("ChatRoomName"), 1500, 35, "White", "Gray");
	ElementPositionFix("FriendList", 36, 5, 75, 1885, 890);
	DrawButton(1935, 5, 60, 60, "", "White", "Icons/Small/Exit.png");
}

// When the user clicks on the screen
function FriendListClick() {
	if ((MouseX >= 1935) && (MouseX < 1995) && (MouseY >= 5) && (MouseY < 65)) {
		ElementRemove("FriendList");
		CommonSetScreen("Character", "InformationSheet");
	}
}

// Loads the friend list data in the div
function FriendListLoadFriendList(data) {
	FriendListContent = "";
	for (var F = 0; F < data.length; F++) {
		FriendListContent = FriendListContent + "<div class='FriendListBlock'>" + data[F].MemberName + "</div>";
		FriendListContent = FriendListContent + "<div class='FriendListBlock'>" + data[F].MemberNumber.toString() + "</div>";
		FriendListContent = FriendListContent + "<div class='FriendListBlock'>" + ((data[F].ChatRoomName == null) ? "-" : data[F].ChatRoomName) + "</div>";
	}
	ElementContent("FriendList", FriendListContent);
}