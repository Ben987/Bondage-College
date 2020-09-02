"use strict";
var ChatSearchBackground = "IntroductionDark";
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

/**
 * Loads the chat search screen properties, creates the inputs and loads up the first 24 rooms.
 * @returns {void} - Nothing
 */
function ChatSearchLoad() {
	if (ChatSearchSafewordAppearance == null) {
		ChatSearchSafewordAppearance = Player.Appearance.slice(0);
		ChatSearchSafewordPose = Player.ActivePose;
	}
	Player.ArousalSettings.OrgasmCount = 0;
	ElementCreateInput("InputSearch", "text", "", "20");
	ChatSearchQuery();
	ChatSearchMessage = "";
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
	DrawText(TextGet(ChatSearchMessage), 255, 935, "White", "Gray");
	ElementPosition("InputSearch",  740, 926, 470);
	DrawButton(980, 898, 280, 64, TextGet("SearchRoom"), "White");
	DrawButton(1280, 898, 280, 64, TextGet("CreateRoom"), "White");
	DrawButton(1685, 885, 90, 90, "", "White", ChatSearchMode != "Filter" ? "Icons/DialogPermissionMode.png" : "Icons/DialogNormalMode.png", TextGet(ChatSearchMode != "Filter" ?  "FilterMode" : "NormalMode"));
	DrawButton(1785, 885, 90, 90, "", "White", "Icons/FriendList.png");
	DrawButton(1885, 885, 90, 90, "", "White", "Icons/Exit.png");
	if (ChatSearchResult.length + (ChatSearchMode != "Filter" ? 0 : ChatSearchIgnoredRooms.length) > ChatSearchRoomsPerPage) DrawButton(1585, 885, 90, 90, "", "White", "Icons/Next.png");
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
	if (MouseIn(1280, 898, 280, 64)) CommonSetScreen("Online", "ChatCreate");
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
			var IsFull = ChatSearchResult[C].MemberCount == ChatSearchResult[C].MemberLimit;
			DrawButton(X, Y, 630, 85, "", (HasFriends && IsFull ? "#448855" : HasFriends ? "#CFFFCF" : IsFull ? "#666" : "White"));
			DrawTextFit((ChatSearchResult[C].Friends != null && ChatSearchResult[C].Friends.length > 0 ? "(" + ChatSearchResult[C].Friends.length + ") " : "") + ChatSearchResult[C].Name + " - " + ChatSearchResult[C].Creator + " " + ChatSearchResult[C].MemberCount + "/" + ChatSearchResult[C].MemberLimit + "", X + 315, Y + 25, 620, "black");
			DrawTextFit(ChatSearchResult[C].Description, X + 315, Y + 62, 620, "black");

			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}
		}

		// Draws the hovering text of friends in the current room
		if (!CommonIsMobile && (MouseX >= 25) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 875)) {

			// Finds the room where the mouse is hovering
			X = 25;
			Y = 25;
			for (let C = ChatSearchResultOffset; C < ChatSearchResult.length && C < (ChatSearchResultOffset + ChatSearchRoomsPerPage); C++) {

				// Builds the friend list and shows it
				if ((MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85) && (ChatSearchResult[C].Friends != null) && (ChatSearchResult[C].Friends.length > 0)) {
					DrawTextWrap(TextGet("FriendsInRoom") + " " + ChatSearchResult[C].Name, (X > 1000) ? 685 : X + 660, (Y > 352) ? 352 : Y, 630, 60, "black", "#FFFF88", 1);
					for (let F = 0; F < ChatSearchResult[C].Friends.length; F++)
						DrawTextWrap(ChatSearchResult[C].Friends[F].MemberName + " (" + ChatSearchResult[C].Friends[F].MemberNumber + ")", (X > 1000) ? 685 : X + 660, ((Y > 352) ? 352 : Y) + 60 + F * 60, 630, 60, "black", "#FFFF88", 1);
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
			var isIgnored = ChatSearchIgnoredRooms.includes(ChatSearchResult[C].Name.toUpperCase());
			var Hover = (MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85) && !CommonIsMobile;
			// Draw the room rectangle
			DrawRect(X, Y, 630, 85, isIgnored ? (Hover ? "red" : "pink") : ( Hover ? "green" : "lime"));
			DrawTextFit((ChatSearchResult[C].Friends != null && ChatSearchResult[C].Friends.length > 0 ? "(" + ChatSearchResult[C].Friends.length + ") " : "") + ChatSearchResult[C].Name + " - " + ChatSearchResult[C].Creator + " " + ChatSearchResult[C].MemberCount + "/" + ChatSearchResult[C].MemberLimit + "", X + 315, Y + 25, 620, "black");
			DrawTextFit(ChatSearchResult[C].Description, X + 315, Y + 62, 620, "black");

			// Moves the next window position
			X = X + 660;
			if (X > 1500) {
				X = 25;
				Y = Y + 109;
			}
			ShownRooms++;
		}
		
		// Display ignored rooms that are no longer present
		var IgnoreOffset = ChatSearchResultOffset;
		if (IgnoreOffset < 0) IgnoreOffset = 0;
		for (let C = IgnoreOffset; C < ChatSearchIgnoredRooms.length && ShownRooms < ChatSearchRoomsPerPage; C++) {
			var isIgnored = !ChatSearchResult.map(Room => Room.Name.toUpperCase()).includes(ChatSearchIgnoredRooms[C]);
			if (isIgnored) {
				var Hover = (MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85) && !CommonIsMobile;
				
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
			var RoomName = ChatSearchResult[C].Name.toUpperCase();
			var Idx = ChatSearchIgnoredRooms.indexOf(RoomName);
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
	
	// Clicks for the extra hidden rooms
	var IgnoreOffset = ChatSearchResultOffset;
	if (IgnoreOffset < 0) IgnoreOffset = 0;
	for (let C = IgnoreOffset; C < ChatSearchIgnoredRooms.length && ShownRooms < ChatSearchRoomsPerPage; C++) {
		var isIgnored = !ChatSearchResult.map(Room => Room.Name.toUpperCase()).includes(ChatSearchIgnoredRooms[C]);
		if (isIgnored) {
			// If the click is valid
			if ((MouseX >= X) && (MouseX <= X + 630) && (MouseY >= Y) && (MouseY <= Y + 85)) {
				var RoomName = ChatSearchIgnoredRooms[C];
				var Idx = ChatSearchIgnoredRooms.indexOf(RoomName);
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
		if (((data == "RoomBanned") || (data == "RoomKicked")) && (CurrentScreen == "ChatRoom")) {
			if (CurrentCharacter != null) DialogLeave();
			ElementRemove("InputChat");
			ElementRemove("TextAreaChatLog");
			CommonSetScreen("Online", "ChatSearch");
			CharacterDeleteAllOnline();
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
	ChatSearchQuerySort();
}

/**
 * Sends the search query data to the server. The response will be handled by ChatSearchResponse once it is received
 * @returns {void} - Nothing
 */
function ChatSearchQuery() {
	var Query = ElementValue("InputSearch").toUpperCase().trim();
	// Prevent spam searching the same thing.
	if (ChatSearchLastQuerySearch != Query || ChatSearchLastQuerySearchHiddenRooms != ChatSearchIgnoredRooms.length || (ChatSearchLastQuerySearch == Query && ChatSearchLastQuerySearchTime + 2000 < CommonTime())) { 
		ChatSearchLastQuerySearch = Query;
		ChatSearchLastQuerySearchTime = CommonTime();
		ChatSearchLastQuerySearchHiddenRooms = ChatSearchIgnoredRooms.length;
		ChatSearchResult = [];
		ServerSend("ChatRoomSearch", { Query: Query, Space: ChatRoomSpace, FullRooms: (Player.ChatSettings && Player.ChatSettings.SearchShowsFullRooms), Ignore: ChatSearchIgnoredRooms });
	}
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
	if (Player.ChatSettings && Player.ChatSettings.SearchFriendsFirst)
		ChatSearchResult.sort((R1, R2) => R2.Friends.length - R1.Friends.length);
}