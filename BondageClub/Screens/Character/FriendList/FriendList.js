"use strict";
var FriendListBackground = "BrickWall";
var FriendListContent = "";
var FriendListConfirmDelete = [];
var FriendListReturn = null;
var FriendListMode = ["Friends", "Beeps", "Delete"];
var FriendListModeIndex = 0;
var FriendListShowBeep = -1;
var FriendListBeepLog = [];
let FriendListNextCheck = null;

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
	const mode = FriendListMode[FriendListModeIndex];
	DrawText(TextGet("MemberNumber"), 665, 35, "White", "Gray");
	if (mode === "Friends") {
		DrawText(TextGet("ListOnlineFriends"), 230, 35, "White", "Gray");
		DrawText(TextGet("ChatRoomName"), 1100, 35, "White", "Gray");
		DrawText(TextGet("ActionFriends"), 1535, 35, "White", "Gray");
	} else if (mode === "Beeps") {
		DrawText(TextGet("ListBeeps"), 230, 35, "White", "Gray");
		DrawText(TextGet("ChatRoomName"), 1100, 35, "White", "Gray");
	} else if (mode === "Delete") {
		DrawText(TextGet("ListFriends"), 230, 35, "White", "Gray");
		DrawText(TextGet("FriendType"), 1100, 35, "White", "Gray");
		DrawText(TextGet("ActionDelete"), 1535, 35, "White", "Gray");
	}
	ElementPositionFix("FriendList", 36, 5, 75, 1985, 890);
	DrawButton(1865, 5, 60, 60, "", "White", "Icons/Small/Next.png");
	DrawButton(1935, 5, 60, 60, "", "White", "Icons/Small/Exit.png");
	if ((FriendListNextCheck !== null) && (CurrentTime >= FriendListNextCheck))
		ServerSend("AccountQuery", { Query: "OnlineFriends" });
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

	// Refresh the friend list automatically again in 30 seconds
	FriendListNextCheck = CurrentTime + 30000;

	// Loads the header caption
	const BeepCaption = DialogFind(Player, "Beep");
	const DeleteCaption = DialogFind(Player, "Delete");
	const ConfirmDeleteCaption = DialogFind(Player, "ConfirmDelete");
	const PrivateRoomCaption = DialogFind(Player, "PrivateRoom");
	const SentCaption = DialogFind(Player, "SentBeep");
	const ReceivedCaption = DialogFind(Player, "ReceivedBeep");
	const SpaceAsylumCaption = DialogFind(Player, "ChatRoomSpaceAsylum");
	const FriendTypeCaption = {
		Owner: TextGet("TypeOwner"),
		Lover: TextGet("TypeLover"),
		Submissive: TextGet("TypeSubmissive"),
		Friend: TextGet("TypeFriend")
	};
	FriendListContent = "";

	const mode = FriendListMode[FriendListModeIndex];

	let infoChanged = false;
	data.forEach(friend => {
		if (!Player.FriendNames.has(friend.MemberNumber)) {
			Player.FriendNames.set(friend.MemberNumber, friend.MemberName);
			infoChanged = true;
		}
		if (Player.SubmissivesList.has(friend.MemberNumber) != (friend.Type == "Submissive")) {
			if (friend.Type == "Submissive") {
				Player.SubmissivesList.add(friend.MemberNumber)
			} else {
				Player.SubmissivesList.delete(friend.MemberNumber)
			}
			infoChanged = true;
		}
	});
	if (infoChanged) ServerPlayerRelationsSync();

	if (mode === "Friends") {
		// In Friend List mode, we show the friend list and allow doing beeps
		for (const friend of data.sort((a, b) => a.MemberName.localeCompare(b))) {
			FriendListContent += "<div class='FriendListRow'>";
			FriendListContent += `<div class='FriendListTextColumn FriendListFirstColumn'> ${friend.MemberName} </div>`;
			FriendListContent += `<div class='FriendListTextColumn'> ${friend.MemberNumber} </div>`;
			if (friend.ChatRoomName == null) friend.ChatRoomName = "-";
			if (friend.ChatRoomName.startsWith("-")) {
				FriendListContent += `<div class='FriendListTextColumn'> ${friend.ChatRoomName.replace("-Private-", PrivateRoomCaption)} </div>`;
			} else {
				FriendListContent += `<div class='FriendListTextColumn'> ${friend.ChatRoomSpace ? friend.ChatRoomSpace.replace("Asylum", SpaceAsylumCaption) + " - " : ''} ${friend.ChatRoomName} </div>`;
			}
			FriendListContent += `<div class='FriendListLinkColumn' onClick='FriendListBeep(${friend.MemberNumber}, "${friend.MemberName}")'> ${BeepCaption} </div>`;
			FriendListContent += "</div>";
		}
	} else if (mode === "Beeps") {
		// In Beeps mode, we show all the beeps sent and received
		for (let B = FriendListBeepLog.length - 1; B >= 0; B--) {
			FriendListContent += "<div class='FriendListRow'>";
			FriendListContent += "<div class='FriendListTextColumn FriendListFirstColumn'>" + FriendListBeepLog[B].MemberName + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((FriendListBeepLog[B].MemberNumber != null) ? FriendListBeepLog[B].MemberNumber.toString() : "-") + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((FriendListBeepLog[B].ChatRoomName == null) ? "-" : (FriendListBeepLog[B].ChatRoomSpace ? FriendListBeepLog[B].ChatRoomSpace.replace("Asylum", SpaceAsylumCaption) + " - " : '') + FriendListBeepLog[B].ChatRoomName.replace("-Private-", PrivateRoomCaption)) + "</div>";
			FriendListContent += "<div class='FriendListTextColumn'>" + ((FriendListBeepLog[B].Sent) ? SentCaption : ReceivedCaption) + " " + TimerHourToString(FriendListBeepLog[B].Time) + "</div>";
			FriendListContent += "</div>";
		}
	} else if (mode === "Delete") {
		// In Delete mode, we show the friend list and allow the user to remove them
		for (const [k, v] of Array.from(Player.FriendNames).sort((a, b) => a[1].localeCompare(b[1]))) {
			FriendListContent += "<div class='FriendListRow'>";
			FriendListContent += `<div class='FriendListTextColumn FriendListFirstColumn'> ${v} </div>`;
			FriendListContent += `<div class='FriendListTextColumn'> ${k} </div>`;
			let Type = "Friend";
			if (Player.Ownership != null && Player.Ownership.MemberNumber === k) {
				Type = "Owner";
			} else if (Player.Lovership.some(lover => lover.MemberNumber == k)) {
				Type = "Lover";
			} else if (Player.SubmissivesList.has(k)) {
				Type = "Submissive";
			}
			FriendListContent += `<div class='FriendListTextColumn'> ${FriendTypeCaption[Type]} </div>`;
			if (Type === "Friend" && Player.FriendList.includes(k) || Type === "Submissive" && Player.SubmissivesList.has(k)) {
				FriendListContent += `<div class='FriendListLinkColumn' onClick='FriendListDelete(${k})'> ${FriendListConfirmDelete.includes(k) ? ConfirmDeleteCaption : DeleteCaption} </div>`;
			}
			FriendListContent += "</div>";
		}
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
	if (FriendListConfirmDelete.includes(MemberNumber)) {
		FriendListConfirmDelete.splice(FriendListConfirmDelete.indexOf(MemberNumber), 1);
		if (Player.FriendList.includes(MemberNumber)) {
			Player.FriendList.splice(Player.FriendList.indexOf(MemberNumber), 1);
		}
		Player.SubmissivesList.delete(MemberNumber);
		ServerPlayerRelationsSync();
	} else FriendListConfirmDelete.push(MemberNumber);
	ServerSend("AccountQuery", { Query: "OnlineFriends" });
}

/**
 * Beeps a given member by sending the name and the current room of the beepee. Also adds an entry to the beep log of the player
 * @param {number} MemberNumber - The ID of the player to beep
 * @param {string} MemberName - The name of the player to beep
 */
function FriendListBeep(MemberNumber, MemberName) {
	ServerSend("AccountBeep", { MemberNumber: MemberNumber, BeepType:""});
	FriendListBeepLog.push({ MemberNumber: MemberNumber, MemberName: MemberName, ChatRoomName: ((ChatRoomData == null) ? null : ChatRoomData.Name), Sent: true, Time: new Date() });
}
