/**
 * A map containing appearance item diffs, keyed according to the item group. Used to compare and validate before/after
 * for appearance items.
 * @typedef AppearanceDiffMap
 * @type {object.<string, Item[]>}
 */

"use strict";
/** @type {import("socket.io-client").Socket} */
var ServerSocket = null;
var ServerURL = "http://localhost:4288";
var ServerBeep = {};
var ServerIsConnected = false;
var ServerReconnectCount = 0;

/** Loads the server by attaching the socket events and their respective callbacks */
function ServerInit() {
	ServerSocket = io(ServerURL);
	ServerSocket.on("connect", ServerConnect);
	ServerSocket.on("disconnect", function () { ServerDisconnect(); });
	ServerSocket.io.on("reconnect_attempt", ServerReconnecting);
	ServerSocket.on("ServerMessage", function (data) { console.log(data); });
	ServerSocket.on("ServerInfo", function (data) { ServerInfo(data); });
	ServerSocket.on("CreationResponse", function (data) { CreationResponse(data); });
	ServerSocket.on("LoginResponse", function (data) { LoginResponse(data); });
	ServerSocket.on("LoginQueue", function (data) { LoginQueue(data); });
	ServerSocket.on("ForceDisconnect", function (data) { ServerDisconnect(data, true); });
	ServerSocket.on("ChatRoomSearchResult", function (data) { ChatSearchResultResponse(data); });
	ServerSocket.on("ChatRoomSearchResponse", function (data) { ChatSearchResponse(data); });
	ServerSocket.on("ChatRoomCreateResponse", function (data) { ChatCreateResponse(data); });
	ServerSocket.on("ChatRoomUpdateResponse", function (data) { ChatAdminResponse(data); });
	ServerSocket.on("ChatRoomSync", function (data) { ChatRoomSync(data); });
	ServerSocket.on("ChatRoomSyncMemberJoin", function (data) { ChatRoomSyncMemberJoin(data); });
	ServerSocket.on("ChatRoomSyncMemberLeave", function (data) { ChatRoomSyncMemberLeave(data); });
	ServerSocket.on("ChatRoomSyncRoomProperties", function (data) { ChatRoomSyncRoomProperties(data); });
	ServerSocket.on("ChatRoomSyncCharacter", function (data) { ChatRoomSyncCharacter(data); });
	ServerSocket.on("ChatRoomSyncSwapPlayers", function (data) { ChatRoomSyncSwapPlayers(data); });
	ServerSocket.on("ChatRoomSyncMovePlayer", function (data) { ChatRoomSyncMovePlayer(data); });
	ServerSocket.on("ChatRoomSyncReorderPlayers", function (data) { ChatRoomSyncReorderPlayers(data); });
	ServerSocket.on("ChatRoomSyncSingle", function (data) { ChatRoomSyncSingle(data); });
	ServerSocket.on("ChatRoomSyncExpression", function (data) { ChatRoomSyncExpression(data); });
	ServerSocket.on("ChatRoomSyncPose", function (data) { ChatRoomSyncPose(data); });
	ServerSocket.on("ChatRoomSyncArousal", function (data) { ChatRoomSyncArousal(data); });
	ServerSocket.on("ChatRoomSyncItem", function (data) { ChatRoomSyncItem(data); });
	ServerSocket.on("ChatRoomMessage", function (data) { ChatRoomMessage(data); });
	ServerSocket.on("ChatRoomAllowItem", function (data) { ChatRoomAllowItem(data); });
	ServerSocket.on("ChatRoomGameResponse", function (data) { ChatRoomGameResponse(data); });
	ServerSocket.on("PasswordResetResponse", function (data) { PasswordResetResponse(data); });
	ServerSocket.on("AccountQueryResult", function (data) { ServerAccountQueryResult(data); });
	ServerSocket.on("AccountBeep", function (data) { ServerAccountBeep(data); });
	ServerSocket.on("AccountOwnership", function (data) { ServerAccountOwnership(data); });
	ServerSocket.on("AccountLovership", function (data) { ServerAccountLovership(data); });
}

/**
 * Sets the connection status of the server and updates the login page message
 * @param {boolean} connected - whether or not the websocket connection to the server has been established successfully
 * @param {string} errorMessage - the error message to display if not connected
 */
function ServerSetConnected(connected, errorMessage) {
	ServerIsConnected = connected;
	if (connected) {
		ServerReconnectCount = 0;
		LoginErrorMessage = "";
	} else {
		LoginErrorMessage = errorMessage || "";
		LoginSubmitted = false;
	}
	LoginUpdateMessage();
}

/**
 * Callback when receiving a "connect" event on the socket - this will be called on initial connection and on
 * successful reconnects.
 */
function ServerConnect() {
	//console.info("Server connection established");
	ServerSetConnected(true);
}

/**
 * Callback when receiving a "reconnecting" event on the socket - this is called when socket.io initiates a retry after
 * a failed connection attempt.
 */
function ServerReconnecting() {
	ServerReconnectCount++;
	if (ServerReconnectCount >= 3) LoginErrorMessage = "ErrorUnableToConnect";
	LoginUpdateMessage();
}

/**
 * Callback used to parse received information related to the server
 * @param {{OnlinePlayers: number, Time: number}} data - Data object containing the server information
 * @returns {void} - Nothing
 */
function ServerInfo(data) {
	if (data.OnlinePlayers != null) CurrentOnlinePlayers = data.OnlinePlayers;
	if (data.Time != null) CurrentTime = data.Time;
}

/**
 * Callback used when we are disconnected from the server, try to enter the reconnection mode (relog screen) if the
 * user was logged in
 * @param {*} data - Error to log
 * @param {boolean} [close=false] - close the transport
 * @returns {void} - Nothing
 */
function ServerDisconnect(data, close = false) {
	if (!ServerIsConnected) return;
	console.warn("Server connection lost");
	const ShouldRelog = Player.Name != "";
	let msg = ShouldRelog ? "Disconnected" : "ErrorDisconnectedFromServer";
	if (data) {
		console.warn(data);
		msg = data;
	}
	ServerSetConnected(false, msg);
	if (close) {
		ServerSocket.disconnect();
		// If the error was duplicated login, we want to reconnect
		if (data === "ErrorDuplicatedLogin") {
			ServerInit();
		}
	}

	if (ShouldRelog) {
		if (CurrentScreen != "Relog") {

			// Exits out of the chat room or a sub screen of the chatroom, so we'll be able to get in again when we log back
			if (ServerPlayerIsInChatRoom()) {
				RelogChatLog = document.getElementById("TextAreaChatLog").cloneNode(true);
				RelogChatLog.id = "RelogChatLog";
				RelogChatLog.name = "RelogChatLog";
				ElementRemove("InputChat");
				ElementRemove("TextAreaChatLog");
				CurrentScreen = "ChatSearch";
				CurrentModule = "Online";
				CurrentCharacter = null;
			} else RelogChatLog = null;

			// Keeps the relog data
			RelogData = { Screen: CurrentScreen, Module: CurrentModule, Character: CurrentCharacter };
			CurrentCharacter = null;
			CommonSetScreen("Character", "Relog");

		}
	}

	// Raise a notification to alert the user
	if (!document.hasFocus()) {
		NotificationRaise(NotificationEventType.DISCONNECT);
	}
}

/**
 * Returns whether the player is currently in a chatroom or viewing a subscreen while in a chatroom
 * @returns {boolean} - True if in a chatroom
 */
function ServerPlayerIsInChatRoom() {
	return (CurrentScreen == "ChatRoom")
		|| (CurrentScreen == "ChatAdmin")
		|| (CurrentScreen == "GameLARP")
		|| ((CurrentScreen == "Appearance") && (CharacterAppearanceReturnRoom == "ChatRoom"))
		|| ((CurrentScreen == "InformationSheet") && (InformationSheetPreviousScreen == "ChatRoom"))
		|| ((CurrentScreen == "Title") && (InformationSheetPreviousScreen == "ChatRoom"))
		|| ((CurrentScreen == "OnlineProfile") && (InformationSheetPreviousScreen == "ChatRoom"))
		|| ((CurrentScreen == "FriendList") && (InformationSheetPreviousScreen == "ChatRoom") && (FriendListReturn == null))
		|| ((CurrentScreen == "Preference") && (InformationSheetPreviousScreen == "ChatRoom"))
		|| ((CurrentModule == "MiniGame") && (DialogGamingPreviousRoom == "ChatRoom"));
}

/** Sends a message with the given data to the server via socket.emit */
function ServerSend(Message, Data) {
	ServerSocket.emit(Message, Data);
}

/**
 * Syncs Money, owner name and lover name with the server
 * @returns {void} - Nothing
 */
function ServerPlayerSync() {
	var D = { Money: Player.Money, Owner: Player.Owner, Lover: Player.Lover };
	ServerSend("AccountUpdate", D);
	delete Player.Lover;
}

/**
 * Syncs the full player inventory to the server.
 * @returns {void} - Nothing
 */
function ServerPlayerInventorySync() {
	const Inv = {};
	for (let I = 0; I < Player.Inventory.length; I++) {
		if (Player.Inventory[I].Asset != null) {
			let G = Inv[Player.Inventory[I].Asset.Group.Name];
			if (G === undefined) {
				G = Inv[Player.Inventory[I].Asset.Group.Name] = [];
			}
			G.push(Player.Inventory[I].Asset.Name);
		}
	}
	ServerSend("AccountUpdate", { Inventory: Inv });
}

/**
 * Syncs player's blocked, limited and hidden items to the server
 * @returns {void} - Nothing
 */
function ServerPlayerBlockItemsSync() {
	ServerSend("AccountUpdate", {
		BlockItems: CommonPackItemArray(Player.BlockItems),
		LimitedItems: CommonPackItemArray(Player.LimitedItems),
		HiddenItems: Player.HiddenItems
	});
}

/**
 * Syncs the full player log array to the server.
 * @returns {void} - Nothing
 */
function ServerPlayerLogSync() {
	var D = {};
	D.Log = Log;
	ServerSend("AccountUpdate", D);
}

/**
 * Syncs the full player reputation array to the server.
 * @returns {void} - Nothing
 */
function ServerPlayerReputationSync() {
	var D = {};
	D.Reputation = Player.Reputation;
	ServerSend("AccountUpdate", D);
}

/**
 * Syncs the full player skill array to the server.
 * @returns {void} - Nothing
 */
function ServerPlayerSkillSync() {
	var D = {};
	D.Skill = Player.Skill;
	ServerSend("AccountUpdate", D);
}

/**
 * Syncs player's relations and related info to the server.
 * @returns {void} - Nothing
 */
function ServerPlayerRelationsSync() {
	const D = {};
	D.FriendList = Player.FriendList;
	D.GhostList = Player.GhostList;
	D.WhiteList = Player.WhiteList;
	D.BlackList = Player.BlackList;
	Array.from(Player.FriendNames.keys()).forEach(k => {
		if (!Player.FriendList.includes(k) && !Player.SubmissivesList.has(k))
			Player.FriendNames.delete(k);
	});
	D.FriendNames = LZString.compressToUTF16(JSON.stringify(Array.from(Player.FriendNames)));
	D.SubmissivesList = LZString.compressToUTF16(JSON.stringify(Array.from(Player.SubmissivesList)));
	ServerSend("AccountUpdate", D);
}

/**
 * Prepares an appearance bundle so we can push it to the server. It minimizes it by keeping only the necessary
 * information. (Asset name, group name, color, properties and difficulty)
 * @param {Item[]} Appearance - The appearance array to bundle
 * @returns {AppearanceBundle} - The appearance bundle created from the given appearance array
 */
function ServerAppearanceBundle(Appearance) {
	var Bundle = [];
	for (let A = 0; A < Appearance.length; A++) {
		var N = {};
		N.Group = Appearance[A].Asset.Group.Name;
		N.Name = Appearance[A].Asset.Name;
		if ((Appearance[A].Color != null) && (Appearance[A].Color != "Default")) N.Color = Appearance[A].Color;
		if ((Appearance[A].Difficulty != null) && (Appearance[A].Difficulty != 0)) N.Difficulty = Appearance[A].Difficulty;
		if (Appearance[A].Property != null) N.Property = Appearance[A].Property;
		Bundle.push(N);
	}
	return Bundle;
}

/**
 * Loads the appearance assets from a server bundle that only contains the main info (no asset) and validates their
 * properties to prevent griefing and respecting permissions in multiplayer
 * @param {Character} C - Character for which to load the appearance
 * @param {string} AssetFamily - Family of assets used for the appearance array
 * @param {AppearanceBundle} Bundle - Bundled appearance
 * @param {number} SourceMemberNumber - Member number of the user who triggered the change
 * @param {boolean} AppearanceFull - Whether or not the appearance should be assigned to an NPC's AppearanceFull
 * property
 * @returns {boolean} - Whether or not the appearance bundle update contained invalid items
 */
function ServerAppearanceLoadFromBundle(C, AssetFamily, Bundle, SourceMemberNumber, AppearanceFull) {
	const appearanceDiffs = ServerBuildAppearanceDiff(AssetFamily, C.Appearance, Bundle);
	ServerAddRequiredAppearance(AssetFamily, appearanceDiffs);

	if (SourceMemberNumber == null) SourceMemberNumber = C.MemberNumber;
	const updateParams = ValidationCreateDiffParams(C, SourceMemberNumber);

	const { appearance, updateValid } = Object.keys(appearanceDiffs)
		.reduce(({ appearance, updateValid }, key) => {
			const diff = appearanceDiffs[key];
			const { item, valid } = ValidationResolveAppearanceDiff(diff[0], diff[1], updateParams);
			if (item) appearance.push(item);
			updateValid = updateValid && valid;
			return { appearance, updateValid };
		}, { appearance: [], updateValid: true });

	if (AppearanceFull) {
		C.AppearanceFull = appearance;
	} else {
		C.Appearance = appearance;
	}

	// If the appearance update was invalid, send another update to correct any issues
	if (!updateValid && C.ID === 0) {
		console.warn("Invalid appearance update bundle received. Updating with sanitized appearance.");
		ChatRoomCharacterUpdate(C);
	}
	return updateValid;
}

/**
 * Builds a diff map for comparing changes to a character's appearance, keyed by asset group name
 * @param {string} assetFamily - The asset family of the appearance
 * @param {Item[]} appearance - The current appearance to compare against
 * @param {AppearanceBundle} bundle - The new appearance bundle
 * @returns {AppearanceDiffMap} - An appearance diff map representing the changes that have been made to the character's
 * appearance
 */
function ServerBuildAppearanceDiff(assetFamily, appearance, bundle) {
	const diffMap = {};
	appearance.forEach((item) => {
		diffMap[item.Asset.Group.Name] = [item, null];
	});
	bundle.forEach((item) => {
		const appearanceItem = ServerBundledItemToAppearanceItem(assetFamily, item);
		if (appearanceItem) {
			const diff = diffMap[item.Group] = (diffMap[item.Group] || [null, null]);
			diff[1] = appearanceItem;
		}
	});
	return diffMap;
}

/**
 * Maps a bundled appearance item, as stored on the server and used for appearance update messages, into a full
 * appearance item, as used by the game client
 * @param {string} assetFamily - The asset family of the appearance item
 * @param {ItemBundle} item - The bundled appearance item
 * @returns {Item} - A full appearance item representation of the provided bundled appearance item
 */
function ServerBundledItemToAppearanceItem(assetFamily, item) {
	if (!item || typeof item !== "object" || typeof item.Name !== "string" || typeof item.Group !== "string") return null;

	const asset = AssetGet(assetFamily, item.Group, item.Name);
	if (!asset) return null;

	return {
		Asset: asset,
		Difficulty: parseInt(item.Difficulty == null ? 0 : item.Difficulty),
		Color: ServerParseColor(asset, item.Color, asset.Group.ColorSchema),
		Property: item.Property,
	};
}

/**
 * Parses an item color, based on the allowed colorable layers on an asset, and the asset's color schema
 * @param {Asset} asset - The asset on which the color is set
 * @param {string|string[]} color - The color value to parse
 * @param {string[]} schema - The color schema to validate against
 * @returns {string|string[]} - A parsed valid item color
 */
function ServerParseColor(asset, color, schema) {
	if (Array.isArray(color)) {
		if (color.length > asset.ColorableLayerCount) color = color.slice(0, asset.ColorableLayerCount);
		return color.map(c => ServerValidateColorAgainstSchema(c, schema));
	} else {
		return ServerValidateColorAgainstSchema(color, schema);
	}
}

/**
 * Populates an appearance diff map with any required items, to ensure that all asset groups are present that need to
 * be.
 * @param {string} assetFamily - The asset family for the appearance
 * @param {AppearanceDiffMap} diffMap - The appearance diff map to populate
 * @returns {void} - Nothing
 */
function ServerAddRequiredAppearance(assetFamily, diffMap) {
	AssetGroup.forEach(group => {
		// If it's not in the appearance category or is allowed to empty, return
		if (group.Category !== "Appearance" || group.AllowNone) return;
		// If the current source already has an item in the group, return
		if (diffMap[group.Name] && diffMap[group.Name][0]) return;

		const diff = diffMap[group.Name] = diffMap[group.Name] || [null, null];

		if (group.MirrorGroup) {
			// If we need to mirror an item, see if it exists
			const itemToMirror = diffMap[group.MirrorGroup] && diffMap[group.MirrorGroup][0];
			if (itemToMirror) {
				const mirroredAsset = AssetGet(assetFamily, group.Name, itemToMirror.Asset.Name);
				// If there is an item to mirror, copy it and its color
				if (mirroredAsset) diff[0] = { Asset: mirroredAsset, Color: itemToMirror.Color };
			}
		}

		// If the item still hasn't been filled, use the first item from the group's asset list
		if (!diff[0]) {
			const asset = Asset.find(a => a.Group.Name === group.Name);
			diff[0] = { Asset: asset, Color: group.ColorSchema[0] };
		}
	});
}

/**
 * Validates and returns a color against a color schema
 * @param {string} Color - The color to validate
 * @param {string[]} Schema - The color schema to validate against (a list of accepted Color values)
 * @returns {string} - The color if it is a valid hex color string or part of the color schema, or the default color
 *     from the color schema otherwise
 */
function ServerValidateColorAgainstSchema(Color, Schema) {
	var HexCodeRegex = /^#(?:[0-9a-f]{3}){1,2}$/i;
	if (typeof Color === 'string' && (Schema.includes(Color) || HexCodeRegex.test(Color))) return Color;
	return Schema[0];
}

/**
 * Syncs the player appearance with the server
 * @returns {void} - Nothing
 */
function ServerPlayerAppearanceSync() {

	// Creates a big parameter string of every appearance items and sends it to the server
	if (Player.AccountName != "") {
		var D = {};
		D.AssetFamily = Player.AssetFamily;
		D.Appearance = ServerAppearanceBundle(Player.Appearance);
		ServerSend("AccountUpdate", D);
	}

}

/**
 * Syncs all the private room characters with the server
 * @returns {void} - Nothing
 */
function ServerPrivateCharacterSync() {
	if (PrivateVendor != null) {
		var D = {};
		D.PrivateCharacter = [];
		for (let ID = 1; ID < PrivateCharacter.length; ID++) {
			var C = {
				Name: PrivateCharacter[ID].Name,
				Love: PrivateCharacter[ID].Love,
				Title: PrivateCharacter[ID].Title,
				Trait: PrivateCharacter[ID].Trait,
				Cage: PrivateCharacter[ID].Cage,
				Owner: PrivateCharacter[ID].Owner,
				Lover: PrivateCharacter[ID].Lover,
				AssetFamily: PrivateCharacter[ID].AssetFamily,
				Appearance: ServerAppearanceBundle(PrivateCharacter[ID].Appearance),
				AppearanceFull: ServerAppearanceBundle(PrivateCharacter[ID].AppearanceFull),
				ArousalSettings: PrivateCharacter[ID].ArousalSettings,
				Event: PrivateCharacter[ID].Event
			};
			D.PrivateCharacter.push(C);
		}
		ServerSend("AccountUpdate", D);
	}
}

/**
 * Callback used to parse received information related to a query made by the player such as viewing their online
 * friends or current email status
 * @param {object} data - Data object containing the query data
 * @returns {void} - Nothing
 */
function ServerAccountQueryResult(data) {
	if ((data != null) && (typeof data === "object") && !Array.isArray(data) && (data.Query != null) && (typeof data.Query === "string") && (data.Result != null)) {
		if (data.Query == "OnlineFriends") FriendListLoadFriendList(data.Result);
		if (data.Query == "EmailStatus" && data.Result && document.getElementById("InputEmailOld"))
			document.getElementById("InputEmailOld").placeholder = TextGet("UpdateEmailLinked");
		if (data.Query == "EmailStatus" && !data.Result && document.getElementById("InputEmailNew"))
			document.getElementById("InputEmailNew").placeholder = TextGet("UpdateEmailEmpty");
		if (data.Query == "EmailUpdate") ElementValue("InputEmailNew", TextGet(data.Result ? "UpdateEmailSuccess" : "UpdateEmailFailure"));
	}
}

/**
 * Callback used to parse received information related to ta beep from another account
 * @param {object} data - Data object containing the beep object which contain at the very least a name and a member
 *     number
 * @returns {void} - Nothing
 */
function ServerAccountBeep(data) {
	if ((data != null) && (typeof data === "object") && !Array.isArray(data) && (data.MemberNumber != null) && (typeof data.MemberNumber === "number") && (data.MemberName != null) && (typeof data.MemberName === "string")) {
		if (!data.BeepType || data.BeepType == "") {
			if (typeof data.Message === "string") {
				data.Message = data.Message.substr(0, 1000);
			} else {
				delete data.Message;
			}
			ServerBeep.MemberNumber = data.MemberNumber;
			ServerBeep.MemberName = data.MemberName;
			ServerBeep.ChatRoomName = data.ChatRoomName;
			ServerBeep.Timer = CurrentTime + 10000;
			if (Player.AudioSettings.PlayBeeps) {
				AudioPlayInstantSound("Audio/BeepAlarm.mp3");
			}
			ServerBeep.Message = `${DialogFindPlayer("BeepFrom")} ${ServerBeep.MemberName} (${ServerBeep.MemberNumber})`;
			if (ServerBeep.ChatRoomName != null)
				ServerBeep.Message = ServerBeep.Message + " " + DialogFindPlayer("InRoom") + " \"" + ServerBeep.ChatRoomName + "\" " + (data.ChatRoomSpace === "Asylum" ? DialogFindPlayer("InAsylum") : '');
			if (data.Message) {
				ServerBeep.Message += `; ${DialogFindPlayer("BeepWithMessage")}`;
			}
			FriendListBeepLog.push({
				MemberNumber: data.MemberNumber,
				MemberName: data.MemberName,
				ChatRoomName: data.ChatRoomName,
				ChatRoomSpace: data.ChatRoomSpace,
				Sent: false,
				Time: new Date(),
				Message: data.Message
			});
			if (CurrentScreen == "FriendList") ServerSend("AccountQuery", { Query: "OnlineFriends" });
			if (!document.hasFocus()) {
				NotificationRaise(NotificationEventType.BEEP, {
					memberNumber: data.MemberNumber,
					characterName: data.MemberName,
					chatRoomName: data.ChatRoomName,
					body: data.Message
				});
			}
		} else if (data.BeepType == "Leash" && ChatRoomLeashPlayer == data.MemberNumber && data.ChatRoomName) {
			if (Player.OnlineSharedSettings && Player.OnlineSharedSettings.AllowPlayerLeashing != false && ( CurrentScreen != "ChatRoom" || !ChatRoomData || (CurrentScreen == "ChatRoom" && ChatRoomData.Name != data.ChatRoomName))) {
				if (ChatRoomCanBeLeashedBy(data.MemberNumber, Player)) {
					ChatRoomJoinLeash = data.ChatRoomName;

					DialogLeave();
					ChatRoomClearAllElements();
					if (CurrentScreen == "ChatRoom") {
						ServerSend("ChatRoomLeave", "");
						CommonSetScreen("Online", "ChatSearch");
					}
					else ChatRoomStart("", "", "MainHall", "Introduction", BackgroundsTagList); //CommonSetScreen("Room", "ChatSearch")
				} else {
					ChatRoomLeashPlayer = null;
				}
			}
		}
	}
}



/** Draws the last beep sent by the server if the timer is still valid, used during the drawing process */
function ServerDrawBeep() {
	if ((ServerBeep.Timer != null) && (ServerBeep.Timer > CurrentTime)) {
		DrawButton((CurrentScreen == "ChatRoom") ? 0 : 500, 0, 1000, 50, ServerBeep.Message, "Pink", "");
		if (document.hasFocus()) {
			NotificationReset(NotificationEventType.BEEP);
		}
	}
}

/**
 * Callback used to parse received information related to the player ownership data
 * @param {object} data - Data object containing the Owner name and Ownership object
 * @returns {void} - Nothing
 */
function ServerAccountOwnership(data) {

	// If we get a result for a specific member number, we show that option in the online dialog
	if ((data != null) && (typeof data === "object") && !Array.isArray(data) && (data.MemberNumber != null) && (typeof data.MemberNumber === "number") && (data.Result != null) && (typeof data.Result === "string"))
		if ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber == data.MemberNumber))
			ChatRoomOwnershipOption = data.Result;

	// If we must update the character ownership data
	if ((data != null) && (typeof data === "object") && !Array.isArray(data) && (data.Owner != null) && (typeof data.Owner === "string") && (data.Ownership != null) && (typeof data.Ownership === "object")) {
		Player.Owner = data.Owner;
		Player.Ownership = data.Ownership;
		LoginValidCollar();
	}

	// If we must clear the character ownership data
	if ((data != null) && (typeof data === "object") && !Array.isArray(data) && (data.ClearOwnership != null) && (typeof data.ClearOwnership === "boolean") && (data.ClearOwnership == true)) {
		Player.Owner = "";
		Player.Ownership = null;
		LogDelete("ReleasedCollar", "OwnerRule");
		LoginValidCollar();
	}

}

/**
 * Callback used to parse received information related to the player lovership data
 * @param {object} data - Data object containing the Lovership array
 * @returns {void} - Nothing
 */
function ServerAccountLovership(data) {

	// If we get a result for a specific member number, we show that option in the online dialog
	if ((data != null) && (typeof data === "object") && !Array.isArray(data) && (data.MemberNumber != null) && (typeof data.MemberNumber === "number") && (data.Result != null) && (typeof data.Result === "string"))
		if ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber == data.MemberNumber))
			ChatRoomLovershipOption = data.Result;

	// If we must update the character lovership data
	if ((data != null) && (typeof data === "object") && !Array.isArray(data) && (data.Lovership != null) && (typeof data.Lovership === "object")) {
		Player.Lovership = data.Lovership;
		LoginLoversItems();
	}
}
