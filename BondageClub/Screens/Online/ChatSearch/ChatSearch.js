"use strict";
var ChatSearchBackground = "Introduction";
var ChatSearchResult = [];
var ChatSearchLastQuerySearch = "";
var ChatSearchLastQuerySearchTime = 0;
var ChatSearchLastQuerySearchHiddenRooms = 0;
var ChatSearchLastQueryJoin = "";
var ChatSearchLastQueryJoinTime = 0;
var ChatSearchResultOffset = 0;
var ChatSearchRoomsPerPage = 24;
var ChatSearchMessage = "";
var ChatSearchLeaveRoom = "MainHall";
var ChatSearchSafewordAppearance = null;
var ChatSearchSafewordPose = null;
var ChatSearchPreviousActivePose = null;
var ChatSearchIgnoredRooms = [];
var ChatSearchMode = "";
var ChatRoomJoinLeash = "";

/**
 * Loads the chat search screen properties, creates the inputs and loads up the first 24 rooms.
 * @returns {void} - Nothing
 */
function ChatSearchLoad() {
	CurrentDarkFactor = 0.5;
	if (ChatSearchLeaveRoom == "MainHall") ChatRoomGame = "";
	if (ChatSearchSafewordAppearance == null) {
		ChatSearchSafewordAppearance = Player.Appearance.slice(0);
		ChatSearchSafewordPose = Player.ActivePose;
	}
	Player.ArousalSettings.OrgasmCount = 0;
	ElementCreateInput("InputSearch", "text", "", "20");
	ChatSearchQuery();
	ChatSearchMessage = "";
	ChatRoomNotificationReset();
}

/**
 * When the chat Search screen runs, draws the screen
 * @returns {void} - Nothing
 */
function ChatSearchRun() {

	if (ChatSearchMode == "")
		ChatSearchNormalDraw();
	else if (ChatSearchMode == "Filter")
		ChatSearchPermissionDraw();

	// Draw the bottom controls
	if (ChatSearchMessage == "") ChatSearchMessage = "EnterName";
	DrawTextFit(TextGet(ChatSearchMessage), 255, 935, 490, "White", "Gray");
	ElementPosition("InputSearch",  740, 926, 470);
	DrawButton(980, 898, 280, 64, TextGet("SearchRoom"), "White");
	DrawButton(1280, 898, 280, 64, TextGet("CreateRoom"), "White");
	if (ChatSearchResult.length + (ChatSearchMode != "Filter" ? 0 : ChatSearchIgnoredRooms.length) > ChatSearchRoomsPerPage) DrawButton(1585, 885, 90, 90, "", "White", "Icons/Next.png", TextGet("Next"));
	DrawButton(1685, 885, 90, 90, "", "White", ChatSearchMode != "Filter" ? "Icons/DialogPermissionMode.png" : "Icons/DialogNormalMode.png", TextGet(ChatSearchMode != "Filter" ?  "FilterMode" : "NormalMode"));
	DrawButton(1785, 885, 90, 90, "", "White", "Icons/FriendList.png", TextGet("FriendList"));
	DrawButton(1885, 885, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
}

/**
 * Handles the click events on the chat search screen. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function ChatSearchClick() {
	if ((MouseX >= 25) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 875)) {
		if (ChatSearchMode == "Filter") ChatSearchClickPermission();
		if (ChatSearchMode == "" && Array.isArray(ChatSearchResult) && (ChatSearchResult.length >= 1)) ChatSearchJoin();
	}
	if (MouseIn(980, 898, 280, 64)) ChatSearchQuery();
	if (MouseIn(1280, 898, 280, 64)) {
		ChatBlockItemCategory = [];
		CommonSetScreen("Online", "ChatCreate");
	}
	if (MouseIn(1585, 885, 90, 90)) {
		ChatSearchResultOffset += ChatSearchRoomsPerPage;
		if (ChatSearchResultOffset >= ChatSearchResult.length + (ChatSearchMode != "Filter" ? 0 : ChatSearchIgnoredRooms.length)) ChatSearchResultOffset = 0;
	}
	if (MouseIn(1685, 885, 90, 90)) {
		ChatSearchMode = (ChatSearchMode == "Filter" ? "" : "Filter");
		ChatSearchQuery();
	}
	if (MouseIn(1785, 885, 90, 90)) { ElementRemove("InputSearch"); CommonSetScreen("Character", "FriendList"); FriendListReturn = "ChatSearch"; }
	if (MouseIn(1885, 885, 90, 90)) ChatSearchExit();
}

/**
 * Handles the key presses while in the chat search screen. When the user presses enter, we lauch the search query.
 * @returns {void} - Nothing
 */
function ChatSearchKeyDown() {
	if (KeyPress == 13) ChatSearchQuery();
}

/**
 * Handles exiting from the chat search screen, removes the input.
 * @returns {void} - Nothing
 */
function ChatSearchExit() {
	ChatSearchPreviousActivePose = Player.ActivePose;
	ElementRemove("InputSearch");
	CommonSetScreen("Room", ChatSearchLeaveRoom);
}

/**
 * Draws the list of rooms in normal mode.
 * @returns {void} - Nothing
 */
function ChatSearchNormalDraw() {

	// If we can show the chat room search result in normal mode
	if (Array.isArray(ChatSearchResult) && (ChatSearchResult.length >= 1)) {

		// Show up to 24 results
		var X = 25;
		var Y = 25;
		for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && C < (ChatSearchResultOffset + ChatSearchRoomsPerPage); C++) {

			// Draw the room rectangle
			var HasFriends = ChatSearchResult[C].Friends != null && ChatSearchResult[C].Friends.length > 0;
			var IsFull = ChatSearchResult[C].MemberCount >= ChatSearchResult[C].MemberLimit;
			var HasBlock = CharacterHasBlockedItem(Player, ChatSearchResult[C].BlockCategory);
			DrawButton(X, Y, 630, 85, "", (HasBlock && IsFull ? "#884444" : HasBlock ? "#FF9999" : HasFriends && IsFull ? "#448855" : HasFriends ? "#CFFFCF" : IsFull ? "#666" : "White"), null, null, IsFull);
			DrawTextFit((ChatSearchResult[C].Friends != null && ChatSearchResult[C].Friends.length > 0 ? "(" + ChatSearchResult[C].Friends.length + ") " : "") + ChatSearchMuffle(ChatSearchResult[C].Name) + " - " + ChatSearchMuffle(ChatSearchResult[C].Creator) + " " + ChatSearchResult[C].MemberCount + "/" + ChatSearchResult[C].MemberLimit + "", X + 315, Y + 25, 620, "black");
			DrawTextFit(ChatSearchMuffle(ChatSearchResult[C].Description), X + 315, Y + 62, 620, "black");

			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}
		}

		// Draws the hovering text of friends in the current room
		if (!CommonIsMobile && MouseIn(25, 25, 1950, 850)) {

			// Finds the room where the mouse is hovering
			X = 25;
			Y = 25;
			for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && C < (ChatSearchResultOffset + ChatSearchRoomsPerPage); C++) {

				// Determine the hover text starting position to ensure there's enough room
				let Height = 58;
				let ListHeight = Height * (
					(ChatSearchResult[C].Friends.length > 0 ? 1 : 0) + ChatSearchResult[C].Friends.length
					+ (ChatSearchResult[C].BlockCategory.length > 0 ? 1 : 0)
					+ (ChatSearchResult[C].Game != "" ? 1 : 0));
				let ListY = Math.min(Y, 872 - ListHeight);

				// Builds the friend list as hover text
				if (MouseIn(X, Y, 630, 85) && ChatSearchResult[C].Friends != null && ChatSearchResult[C].Friends.length > 0) {
					DrawTextWrap(TextGet("FriendsInRoom") + " " + ChatSearchMuffle(ChatSearchResult[C].Name), (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#FFFF88", 1);
					ListY += Height;
					for (let F = 0; F < ChatSearchResult[C].Friends.length; F++) {
						DrawTextWrap(ChatSearchMuffle(ChatSearchResult[C].Friends[F].MemberName + " (" + ChatSearchResult[C].Friends[F].MemberNumber + ")"), (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#FFFF88", 1);
						ListY += Height;
					}
				}

				// Builds the blocked categories list below it
				if (MouseIn(X, Y, 630, 85) && (ChatSearchResult[C].BlockCategory != null) && (ChatSearchResult[C].BlockCategory.length > 0)) {
					let Block = TextGet("Block");
					for (let B = 0; B < ChatSearchResult[C].BlockCategory.length; B++)
						Block = Block + ((B > 0) ? ", " : " ") + TextGet(ChatSearchResult[C].BlockCategory[B]);
					DrawTextWrap(Block, (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#FF9999", 1);
					ListY += Height;
				}

				// Builds the game box below it
				if (MouseIn(X, Y, 630, 85) && (ChatSearchResult[C].Game != null) && (ChatSearchResult[C].Game != "")) {
					DrawTextWrap(TextGet("GameLabel") + " " + TextGet("Game" + ChatSearchResult[C].Game), (X > 1000) ? 685 : X + 660, ListY, 630, Height, "black", "#9999FF", 1);
					ListY += Height;
				}

				// Moves the next window position
				X = X + 660;
				if (X > 1500) {
					X = 25;
					Y = Y + 109;
				}
			}

		}

	} else DrawText(TextGet("NoChatRoomFound"), 1000, 450, "White", "Gray");
}

/**
 *
 * Garbles based on immersion settings
 * @param {string} Text - The text to garble
 * @returns {string} - Garbled text
 */
function ChatSearchMuffle(Text) {
	let ret = Text;
	if (Player.ImmersionSettings && Player.ImmersionSettings.ChatRoomMuffle && Player.GetBlindLevel() > 0) {
		ret = SpeechGarbleByGagLevel(Player.GetBlindLevel() * Player.GetBlindLevel(), Text, true);
		if (ret.length == 0)
			return "...";
		return ret;
	}
	return ret;
}



/**
 * Draws the list of rooms in permission mode.
 * @returns {void} - Nothing
 */
function ChatSearchPermissionDraw() {
	if (Array.isArray(ChatSearchResult) && (ChatSearchResult.length + ChatSearchIgnoredRooms.length >= 1)) {

		// Show results + previously hidden rooms
		var X = 25;
		var Y = 25;
		var ShownRooms = 0;

		for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && ShownRooms < ChatSearchRoomsPerPage; C++) {
			let isIgnored = ChatSearchIgnoredRooms.includes(ChatSearchResult[C].Name.toUpperCase());
			let Hover = (MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85) && !CommonIsMobile;
			// Draw the room rectangle
			DrawRect(X, Y, 630, 85, isIgnored ? (Hover ? "red" : "pink") : ( Hover ? "green" : "lime"));
			DrawTextFit((ChatSearchResult[C].Friends != null && ChatSearchResult[C].Friends.length > 0 ? "(" + ChatSearchResult[C].Friends.length + ") " : "") + ChatSearchMuffle(ChatSearchResult[C].Name) + " - " + ChatSearchMuffle(ChatSearchResult[C].Creator) + " " + ChatSearchResult[C].MemberCount + "/" + ChatSearchResult[C].MemberLimit + "", X + 315, Y + 25, 620, "black");
			DrawTextFit(ChatSearchMuffle(ChatSearchResult[C].Description), X + 315, Y + 62, 620, "black");

			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}
			ShownRooms++;
		}

		const IgnoredRoomsOffset = ChatSearchCalculateIgnoredRoomsOffset(ShownRooms);
		if (IgnoredRoomsOffset < 0)
			return;

		// Display ignored rooms that are no longer present
		for (let C = IgnoredRoomsOffset; C < ChatSearchIgnoredRooms.length && ShownRooms < ChatSearchRoomsPerPage; C++) {
			let isIgnored = !ChatSearchResult.map(Room => Room.Name.toUpperCase()).includes(ChatSearchIgnoredRooms[C]);
			if (isIgnored) {
				let Hover = (MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85) && !CommonIsMobile;

				// Draw the room rectangle
				DrawRect(X, Y, 630, 85, Hover ? "red" : "pink");
				DrawTextFit(ChatSearchIgnoredRooms[C], X + 315, Y + 25, 620, "black");

				// Moves the next window position
				X = X + 660;
				if (X > 1500) {
					X = 25;
					Y = Y + 109;
				}
				ShownRooms++;
			}
		}
	} else DrawText(TextGet("NoChatRoomFound"), 1000, 450, "White", "Gray");
}

/**
 * Handles the clicks related to the chatroom list when in normal mode
 * @returns {void} - Nothing
 */
function ChatSearchJoin() {

	// Scans results
	var X = 25;
	var Y = 25;
	for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && C < (ChatSearchResultOffset + ChatSearchRoomsPerPage); C++) {

		// If the player clicked on a valid room
		if ((MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85)) {
			var RoomName = ChatSearchResult[C].Name;
			if (ChatSearchLastQueryJoin != RoomName || (ChatSearchLastQueryJoin == RoomName && ChatSearchLastQueryJoinTime + 1000 < CommonTime())) {
				ChatSearchLastQueryJoinTime = CommonTime();
				ChatSearchLastQueryJoin = RoomName;
				ChatRoomPlayerCanJoin = true;
				ServerSend("ChatRoomJoin", { Name: RoomName });
				ChatRoomPingLeashedPlayers();
			}

		}

		// Moves the next window position
		X = X + 660;
		if (X > 1500) {
			X = 25;
			Y = Y + 109;
		}
	}
}

/**
 * Handles the clicks related to the chatroom list when in permission mode
 * @returns {void} - Nothing
 */
function ChatSearchClickPermission() {
	// Scans results + hidden rooms
	var X = 25;
	var Y = 25;
	var ShownRooms = 0;
	for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && ShownRooms < ChatSearchRoomsPerPage; C++) {

		// If the player clicked on an existing room
		if ((MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85)) {
			let RoomName = ChatSearchResult[C].Name.toUpperCase();
			let Idx = ChatSearchIgnoredRooms.indexOf(RoomName);
			if (Idx != -1)
				ChatSearchIgnoredRooms.splice(Idx, 1);
			else
				ChatSearchIgnoredRooms.push(RoomName);
		}

		// Moves the next window position
		X = X + 660;
		if (X > 1500) {
			X = 25;
			Y = Y + 109;
		}
		ShownRooms++;
	}

	const IgnoredRoomsOffset = ChatSearchCalculateIgnoredRoomsOffset(ShownRooms);
	if (IgnoredRoomsOffset < 0)
		return;

	// Clicks for the extra hidden rooms
	for (let C = IgnoredRoomsOffset; C < ChatSearchIgnoredRooms.length && ShownRooms < ChatSearchRoomsPerPage; C++) {
		var isIgnored = !ChatSearchResult.map(Room => Room.Name.toUpperCase()).includes(ChatSearchIgnoredRooms[C]);
		if (isIgnored) {
			// If the click is valid
			if ((MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85)) {
				let RoomName = ChatSearchIgnoredRooms[C];
				let Idx = ChatSearchIgnoredRooms.indexOf(RoomName);
				if (Idx != -1)
					ChatSearchIgnoredRooms.splice(Idx, 1);
				else
					ChatSearchIgnoredRooms.push(RoomName);
			}

			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}
			ShownRooms++;
		}
	}
}


/**
 * Handles the reception of the server response when joining a room or when getting banned/kicked
 * @param {string} data - Response from the server
 * @returns {void} - Nothing
 */
function ChatSearchResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != "")) {
		if (((data == "RoomBanned") || (data == "RoomKicked")) && ServerPlayerIsInChatRoom()) {
			ChatRoomClearAllElements();
			CommonSetScreen("Online", "ChatSearch");
			CharacterDeleteAllOnline();
			ChatRoomSetLastChatRoom("");
		}
		ChatSearchMessage = "Response" + data;
	}
}

/**
 * Handles the reception of the server data when it responds to the search query
 * @param {string} data - Response from the server, contains the room list matching the query
 * @returns {void} - Nothing
 */
function ChatSearchResultResponse(data) {
	ChatSearchResult = data;
	ChatSearchResultOffset = 0;
	ChatSearchQuerySort();
	if (ChatRoomJoinLeash != "") {
		for (let R = 0; R < ChatSearchResult.length; R++)
			if (ChatSearchResult[R].Name == ChatRoomJoinLeash) {
				ChatSearchLastQueryJoinTime = CommonTime();
				ChatSearchLastQueryJoin = ChatSearchResult[R].Name;
				ChatRoomPlayerCanJoin = true;
				ServerSend("ChatRoomJoin", { Name: ChatSearchResult[R].Name });
				break;
			}
	} else if (Player.ImmersionSettings && Player.LastChatRoom && Player.LastChatRoom != "" && Player.ImmersionSettings.ReturnToChatRoom) {
		var found = false;
		var roomIsFull = false;
		for (let R = 0; R < data.length; R++) {
			var room = data[R];
			if (room.Name == Player.LastChatRoom && room.Game == "") {
				if (room.MemberCount < room.MemberLimit) {
					var RoomName = room.Name;
					if (ChatSearchLastQueryJoin != RoomName || (ChatSearchLastQueryJoin == RoomName && ChatSearchLastQueryJoinTime + 1000 < CommonTime())) {
						found = true;
						ChatSearchLastQueryJoinTime = CommonTime();
						ChatSearchLastQueryJoin = RoomName;
						ChatRoomPlayerCanJoin = true;
						ServerSend("ChatRoomJoin", { Name: RoomName });
						break;
					}
				} else {
					roomIsFull = true;
					break;
				}

			}
		}
		if (!found) {
			if (Player.ImmersionSettings.ReturnToChatRoomAdmin
			&& Player.LastChatRoomAdmin
			&& Player.LastChatRoomBG
			&& Player.LastChatRoomPrivate != null
			&& Player.LastChatRoomSize
			&& Player.LastChatRoomDesc != null) {
				ChatRoomPlayerCanJoin = true;
				ChatRoomPlayerJoiningAsAdmin = true;
				var block = [];
				var ChatRoomName = Player.LastChatRoom;
				var ChatRoomDesc = Player.LastChatRoomDesc;
				/*if (Player.LastChatRoomPrivate) {
					ChatRoomName = Player.Name + Player.MemberNumber
					ChatRoomDesc = ""
				} else*/
				if (roomIsFull) {
					ChatRoomName = ChatRoomName.substring(0, Math.min(ChatRoomName.length, 16)) + Math.floor(1+Math.random() * 998); // Added
				}
				if (ChatBlockItemCategory) block = ChatBlockItemCategory;
				var NewRoom = {
					Name: ChatRoomName.trim(),
					Description: ChatRoomDesc.trim(),
					Background: Player.LastChatRoomBG,
					Private: Player.LastChatRoomPrivate,
					Space: ChatRoomSpace,
					Game: "",
					Admin: [Player.MemberNumber],
					Limit: ("" + Math.min(Math.max(Player.LastChatRoomSize, 2), 10)).trim(),
					BlockCategory: block
				};
				ServerSend("ChatRoomCreate", NewRoom);
				ChatCreateMessage = "CreatingRoom";

				if (Player.ImmersionSettings.ReturnToChatRoomAdmin && Player.LastChatRoomAdmin) {
					NewRoom.Admin = Player.LastChatRoomAdmin;
					ChatRoomNewRoomToUpdate = NewRoom;
				}
			} else {
				ChatSearchMessage = roomIsFull ? "ResponseRoomFull" : "ResponseCannotFindRoom";
				ChatRoomSetLastChatRoom("");
			}
		}
	}
	ChatRoomJoinLeash = "";
}

/**
 * Sends the search query data to the server. The response will be handled by ChatSearchResponse once it is received
 * @returns {void} - Nothing
 */
function ChatSearchQuery() {
	var Query = ElementValue("InputSearch").toUpperCase().trim();
	let FullRooms = (Player.OnlineSettings && Player.OnlineSettings.SearchShowsFullRooms);

	if (ChatRoomJoinLeash != null && ChatRoomJoinLeash != "") {
		Query = ChatRoomJoinLeash.toUpperCase().trim();
	} else if (Player.ImmersionSettings && Player.LastChatRoom && Player.LastChatRoom != "") {
		if (Player.ImmersionSettings.ReturnToChatRoom) {
			Query = Player.LastChatRoom.toUpperCase().trim();
			FullRooms = true;
		} else {
			ChatRoomSetLastChatRoom("");
		}
	}

	// Prevent spam searching the same thing.
	if (ChatSearchLastQuerySearch != Query || ChatSearchLastQuerySearchHiddenRooms != ChatSearchIgnoredRooms.length || (ChatSearchLastQuerySearch == Query && ChatSearchLastQuerySearchTime + 2000 < CommonTime())) {
		ChatSearchLastQuerySearch = Query;
		ChatSearchLastQuerySearchTime = CommonTime();
		ChatSearchLastQuerySearchHiddenRooms = ChatSearchIgnoredRooms.length;
		ChatSearchResult = [];
		ServerSend("ChatRoomSearch", { Query: Query, Space: ChatRoomSpace, Game: ChatRoomGame, FullRooms: FullRooms, Ignore: ChatSearchIgnoredRooms });
	}

	ChatSearchMessage = "EnterName";
}

/**
 * Sorts the room result based on a player's settings
 * @returns {void} - Nothing
 */
function ChatSearchQuerySort() {
	// Send full rooms to the back of the list and save the order of creation.
	ChatSearchResult = ChatSearchResult.map((Room, Idx) => { Room.Order = Idx; return Room; });
	ChatSearchResult.sort((R1, R2) => R1.MemberCount >= R1.MemberLimit ? 1 : (R2.MemberCount >= R2.MemberLimit ? -1 : (R1.Order - R2.Order)));

	// Friendlist option overrides basic order, but keeps full rooms at the back for each number of each different total of friends.
	if (Player.OnlineSettings && Player.OnlineSettings.SearchFriendsFirst)
		ChatSearchResult.sort((R1, R2) => R2.Friends.length - R1.Friends.length);
}

/**
 * Calculates starting offset for the ignored rooms list when displaying results in filter/permission mode.
 * @param {number} shownRooms - Number of rooms shown before the ignored rooms.
 * @returns {number} - Starting offset for ingored rooms
 */
function ChatSearchCalculateIgnoredRoomsOffset(shownRooms) {
	return ChatSearchResultOffset + shownRooms - ChatSearchResult.length;
}