/**
 * An item is a pair of asset and its dynamic properties that define a worn asset.
 * @typedef {{Asset: object, Color: string, Difficulty: number, Property: object | undefined}} Item
 */

/**
 * An appearance array is an array of object defining each appearance item of a character in all of its details.
 * @typedef {Array.<Item>} AppearanceArray
 */

/**
 * An appearance bundle is an array of object defining each appearance item of a character. It's a minified version of the normal appearance array
 * @typedef {Array.<{Group: string, Name: string, Difficulty: number | undefined, Color: string | undefined, Property: object | undefined}>} AppearanceBundle
 */

"use strict";
var ServerSocket = null;
var ServerURL = "http://localhost:4288";
var ServerBeep = {};
var ServerBeepAudio = new Audio();
var ServerIsConnected = false;
var ServerReconnectCount = 0;

/** Loads the server by attaching the socket events and their respective callbacks */
function ServerInit() {
	ServerSocket = io(ServerURL);
	ServerSocket.on("connect", ServerConnect);
	ServerSocket.on("reconnecting", ServerReconnecting);
	ServerSocket.on("event", function (data) { console.log(data); });
	ServerSocket.on("ServerMessage", function (data) { console.log(data); });
	ServerSocket.on("ServerInfo", function (data) { ServerInfo(data); });
	ServerSocket.on("CreationResponse", function (data) { CreationResponse(data); });
	ServerSocket.on("LoginResponse", function (data) { LoginResponse(data); });
	ServerSocket.on("disconnect", function (data) { ServerDisconnect(); });
	ServerSocket.on("ForceDisconnect", function (data) { ServerDisconnect(data, true); });
	ServerSocket.on("ChatRoomSearchResult", function (data) { ChatSearchResultResponse(data); });
	ServerSocket.on("ChatRoomSearchResponse", function (data) { ChatSearchResponse(data); });
	ServerSocket.on("ChatRoomCreateResponse", function (data) { ChatCreateResponse(data); });
	ServerSocket.on("ChatRoomUpdateResponse", function (data) { ChatAdminResponse(data); });
	ServerSocket.on("ChatRoomSync", function (data) { ChatRoomSync(data); });
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
	ServerBeepAudio.src = "Audio/BeepAlarm.mp3";
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
 * Callback when receiving a "connect" event on the socket - this will be called on initial connection and on successful reconnects.
 */
function ServerConnect() {
	console.info("Server connection established");
	ServerSetConnected(true);
}

/**
 * Callback when receiving a "reconnecting" event on the socket - this is called when socket.io initiates a retry after a failed connection attempt.
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
 * Callback used when we are disconnected from the server, try to enter the reconnection mode (relog screen) if the user was logged in
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
		|| ((CurrentScreen == "Preference") && (InformationSheetPreviousScreen == "ChatRoom"));
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
 * Syncs the full player inventory to the server. The inventory is a stringified object compressed with LZString
 * @returns {void} - Nothing
 */
function ServerPlayerInventorySync() {
	var Inv = [];
	for (let I = 0; I < Player.Inventory.length; I++)
		if (Player.Inventory[I].Asset != null)
			Inv.push([Player.Inventory[I].Asset.Name, Player.Inventory[I].Asset.Group.Name]);
	ServerSend("AccountUpdate", { Inventory: LZString.compressToUTF16(JSON.stringify(Inv)) });
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
	})
	D.FriendNames = LZString.compressToUTF16(JSON.stringify(Array.from(Player.FriendNames)));
	D.SubmissivesList = LZString.compressToUTF16(JSON.stringify(Array.from(Player.SubmissivesList)));
	ServerSend("AccountUpdate", D);
}

/** 
 * Prepares an appearance bundle so we can push it to the server. It minimizes it by keeping only the necessary information. (Asset name, group name, color, properties and difficulty)
 * @param {AppearanceArray} Appearance - The appearance array to bundle
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
 * Validates the properties for a given item to prevent griefing in multiplayer
 * @param {Character} C - The character the item will be applied to
 * @param {Item} Item - The item for which to validate the properties
 * @param {Object} [Validation=null] - Validates the LockMemberNumber against the source
 * @param {number} Validation.SourceMemberNumber - Source character MemberNumber
 * @param {number} Validation.FromOwner - Indicates the source is an owner or herself
 * @param {number} Validation.FromLoversOrOwner - Indicates the source is an lover or owner or herself
 * @returns {void} - Nothing
 */
function ServerValidateProperties(C, Item, Validation) {
	// No validations for NPCs
	if ((C.AccountName.substring(0, 4) == "NPC_") || (C.AccountName.substring(0, 4) == "NPC-")) return;

	// Remove LockMemberNumber if the source is incorrect prior to all checks
	if ((Item.Property != null) && (C.ID == 0) && (Validation != null) && (Validation.SourceMemberNumber != null)) {
		var Lock = InventoryGetLock(Item);
		if ((Lock != null) && (Lock.Property != null)) {
			if (!Validation.FromOwner && Lock.Asset.OwnerOnly) delete Item.Property.LockMemberNumber;
			else if (!Validation.FromLoversOrOwner && Lock.Asset.LoverOnly) delete Item.Property.LockMemberNumber;
		}
	}

	// For each effect on the item
	if ((Item.Property != null) && (Item.Property.Effect != null)) {
		for (let E = Item.Property.Effect.length - 1; E >= 0; E--) {

			// Make sure the item or its subtype can be locked, remove any lock that's invalid
			var Effect = Item.Property.Effect[E];
			if ((Effect == "Lock") &&
			    (
			        !Item.Asset.AllowLock ||
				    (InventoryGetLock(Item) == null) ||
				    (InventoryIsPermissionBlocked(C, Item.Property.LockedBy, "ItemMisc")) ||
				    (Item.Property && Item.Property.AllowLock === false) ||
				    // Check if a lock on the items sub type is allowed
				    (Item.Property && Item.Asset.AllowLockType && !Item.Asset.AllowLockType.includes(Item.Property.Type))
			    )) {
				ServerDeleteLock(Item.Property);
			}

			// If the item is locked by a lock
			if ((Effect == "Lock") && (InventoryGetLock(Item) != null)) {

				// Make sure the combination number on the lock is valid, 4 digits only
				var Lock = InventoryGetLock(Item);
				if ((Item.Property.CombinationNumber != null) && (typeof Item.Property.CombinationNumber == "string")) {
					var Regex = /^[0-9]+$/;
					if (!Item.Property.CombinationNumber.match(Regex) || (Item.Property.CombinationNumber.length != 4)) {
						Item.Property.CombinationNumber = "0000";
					}
				} else delete Item.Property.CombinationNumber;

				// Make sure the password on the lock is valid, 6 letters only
				var Lock = InventoryGetLock(Item);
				if ((Item.Property.Password != null) && (typeof Item.Property.Password == "string")) {
					var Regex = /^[A-Z]+$/;
					if (!Item.Property.Password.toUpperCase().match(Regex) || (Item.Property.Password.length > 8)) {
						Item.Property.Password = "UNLOCK";
					}
				} else delete Item.Property.Password;

				// Make sure the remove timer on the lock is valid
				if ((Lock.Asset.RemoveTimer != null) && (Lock.Asset.RemoveTimer != 0)) {
					var CurrentTimeDelay = 5000;
					// As CurrentTime can be slightly different, we accept a small delay in ms
					if ((typeof Item.Property.RemoveTimer !== "number") || (Item.Property.RemoveTimer - CurrentTimeDelay > CurrentTime + Lock.Asset.MaxTimer * 1000)) {
						Item.Property.RemoveTimer = Math.round(CurrentTime + Lock.Asset.RemoveTimer * 1000);
					}
				} else delete Item.Property.RemoveTimer;

				var LockNumber = Item.Property.LockMemberNumber;
				var OwnerNumber = C.Ownership && C.Ownership.MemberNumber;

				// Make sure the owner lock is valid
				if (Lock.Asset.OwnerOnly && ((LockNumber == null) || ((LockNumber != C.MemberNumber) && (LockNumber != OwnerNumber)))) {
					ServerDeleteLock(Item.Property);
				}

				if (Lock.Asset.LoverOnly && ((LockNumber == null) || (C.GetLoversNumbers().length == 0) || ((LockNumber != C.MemberNumber) && !C.GetLoversNumbers().includes(LockNumber) && !((LockNumber == OwnerNumber) && ((C.ID != 0) || !LogQuery(C, "BlockLoverLockOwner", "LoverRule")))))) {
					ServerDeleteLock(Item.Property);
				}

			}

			// Other effects can be removed
			if (Effect != "Lock") {

				// Check if the effect is allowed for the item
				var MustRemove = true;
				if (Item.Asset.AllowEffect != null)
					for (let A = 0; A < Item.Asset.AllowEffect.length; A++)
						if (Item.Asset.AllowEffect[A] == Effect)
							MustRemove = false;

				// Remove the effect if it's not allowed
				if (MustRemove) {
					Item.Property.Effect.splice(E, 1);
				}

			}
		}
	}

	// For each block on the item
	if ((Item.Property != null) && (Item.Property.Block != null)) {
		for (let B = Item.Property.Block.length - 1; B >= 0; B--) {

			// Check if the effect is allowed for the item
			var MustRemove = true;
			if (Item.Asset.AllowBlock != null)
				for (let A = 0; A < Item.Asset.AllowBlock.length; A++)
					if (Item.Asset.AllowBlock[A] == Item.Property.Block[B])
						MustRemove = false;

			// Remove the effect if it's not allowed
			if (MustRemove) {
				Item.Property.Block.splice(B, 1);
			}
		}
	}

	// Removes any type that's not allowed on the item
	if ((Item.Property != null) && (Item.Property.Type != null))
		if ((Item.Asset.AllowType == null) || (Item.Asset.AllowType.indexOf(Item.Property.Type) < 0))
			delete Item.Property.Type;

	// Remove impossible combinations
	if ((Item.Property != null) && (Item.Property.Type == null) && (Item.Property.Restrain == null))
		["SetPose", "Difficulty", "SelfUnlock", "Hide"].forEach(P => delete Item.Property[P]);

	// Keeps item opacity within the allowed range
	if (Item.Property && typeof Item.Property.Opacity === "number") {
		if (Item.Property.Opacity > Item.Asset.MaxOpacity) Item.Property.Opacity = Item.Asset.MaxOpacity;
		if (Item.Property.Opacity < Item.Asset.MinOpacity) Item.Property.Opacity = Item.Asset.MinOpacity;
	}
}

/**
 * Completely removes a lock from an item
 * @param {object} Property - The item to remove the lock from
 * @returns {void} - Nothing
 */
function ServerDeleteLock(Property) {
	if (Property) {
		delete Property.LockedBy;
		delete Property.LockMemberNumber;
		delete Property.LockMemberNumberList;
		delete Property.CombinationNumber;
		delete Property.Password;
		delete Property.Hint;
		delete Property.LockSet;
		delete Property.RemoveTimer;
		delete Property.MaxTimer;
		delete Property.RemoveItem;
		delete Property.ShowTimer;
		delete Property.EnableRandomInput;
		delete Property.MemberNumberList;
		if (Array.isArray(Property.Effect)) {
			Property.Effect = Property.Effect.filter(E => E !== "Lock");
		}
	}
}

/**
 * Loads the appearance assets from a server bundle that only contains the main info (no asset) and validates their properties to prevent griefing and respecting permissions in multiplayer
 * @param {Character} C - Character for which to load the appearance
 * @param {string} AssetFamily - Family of assets used for the appearance array
 * @param {AppearanceBundle} Bundle - Bundled appearance
 * @param {number} SourceMemberNumber - Member number of the user who triggered the change
 * @returns {void} - Nothing
 */
function ServerAppearanceLoadFromBundle(C, AssetFamily, Bundle, SourceMemberNumber) {

	// Removes any invalid data from the appearance bundle
	for (let B = 0; B < Bundle.length; B++)
		if ((Bundle[B] == null) || (typeof Bundle[B] !== "object") || (Bundle[B].Name == null) || (typeof Bundle[B].Name != "string") || (Bundle[B].Name == null) || (typeof Bundle[B].Name != "string")) {
			Bundle.splice(B, 1);
			B--;
		}

	// We do not check if the load is from the Player
	var FromSelf = (SourceMemberNumber != null) && (SourceMemberNumber == C.MemberNumber);
	var FromOwner = (SourceMemberNumber != null) && (C.Ownership != null) && ((SourceMemberNumber == C.Ownership.MemberNumber) || FromSelf);
	var LoverNumbers = CharacterGetLoversNumbers(C);
	var FromLoversOrOwner = (SourceMemberNumber != null) && (LoverNumbers.length != 0) && (LoverNumbers.includes(SourceMemberNumber) || FromOwner);

	// Clears the appearance to begin
	var Appearance = [];

	// Reapply any item that was equipped and isn't enable, same for owner locked items if the source member isn't the owner
	if ((SourceMemberNumber != null) && (C.ID == 0))
		for (let A = 0; A < C.Appearance.length; A++) {
			if (!C.Appearance[A].Asset.Enable && !C.Appearance[A].Asset.OwnerOnly && !C.Appearance[A].Asset.LoverOnly) {
				Appearance.push(C.Appearance[A]);
			} else {
				if ((!FromOwner && InventoryOwnerOnlyItem(C.Appearance[A])) || (!FromLoversOrOwner && InventoryLoverOnlyItem(C.Appearance[A]))) {
					// If the owner-locked item is sent back from a non-owner, we allow to change some properties and lock it back with the owner lock
					if (!C.Appearance[A].Asset.OwnerOnly && !C.Appearance[A].Asset.LoverOnly)  {
						for (let B = 0; B < Bundle.length; B++)
							if ((C.Appearance[A].Asset.Name == Bundle[B].Name) && (C.Appearance[A].Asset.Group.Name == Bundle[B].Group) && (C.Appearance[A].Asset.Group.Family == AssetFamily)) {
								ServerItemCopyProperty(C, C.Appearance[A], Bundle[B].Property);
								break;
							}
					}
					Appearance.push(C.Appearance[A]);
				}
			}
		}

	// For each appearance item to load
	for (let A = 0; A < Bundle.length; A++) {

		// Skip blocked items
		const Type = typeof Bundle[A].Property === "object" ? Bundle[A].Property.Type : null;
		const Limited = C.ID == 0 && InventoryIsPermissionLimited(C, Bundle[A].Name, Bundle[A].Group, Type) && (SourceMemberNumber != null) && SourceMemberNumber !== Player.MemberNumber && ((C.Ownership == null) || (C.Ownership.MemberNumber == null) || ((C.Ownership.MemberNumber != SourceMemberNumber))) && ((C.GetLoversNumbers().indexOf(SourceMemberNumber) < 0)) && ((C.ItemPermission > 3) || C.WhiteList.indexOf(SourceMemberNumber) < 0);
		if ((InventoryIsPermissionBlocked(C, Bundle[A].Name, Bundle[A].Group, Type)  || Limited) && OnlineGameAllowBlockItems()) continue;

		// Cycles in all assets to find the correct item to add (do not add )
		for (let I = 0; I < Asset.length; I++)
			if ((Asset[I].Name == Bundle[A].Name) && (Asset[I].Group.Name == Bundle[A].Group) && (Asset[I].Group.Family == AssetFamily)) {

				// OwnerOnly items can only get update if it comes from owner
				if (SourceMemberNumber != null && Asset[I].OwnerOnly && (C.ID == 0) && !FromOwner) break;

				// LoverOnly items can only get update if it comes from lover
				if (SourceMemberNumber != null && Asset[I].LoverOnly && (C.ID == 0) && !FromLoversOrOwner) break;

				var ColorSchema = Asset[I].Group.ColorSchema;
				var Color = Bundle[A].Color;
				if (Array.isArray(Color)) {
					if (Color.length > Asset[I].ColorableLayerCount) Color = Color.slice(0, Asset[I].ColorableLayerCount);
					Color = Color.map(Col => ServerValidateColorAgainstSchema(Col, ColorSchema));
				} else {
					Color = ServerValidateColorAgainstSchema(Color, ColorSchema);
				}

				// Creates the item and colorize it
				var NA = {
					Asset: Asset[I],
					Difficulty: parseInt((Bundle[A].Difficulty == null) ? 0 : Bundle[A].Difficulty),
					Color,
				};

				// Sets the item properties and make sure a non-owner cannot add an owner lock
				if (Bundle[A].Property != null) {
					NA.Property = Bundle[A].Property;

					// If a non-owner/lover has added an owner/lover-only lock, remove it
					const Lock = InventoryGetLock(NA);
					if (C.ID === 0 && !FromOwner && Lock && Lock.Asset.OwnerOnly) ServerDeleteLock(NA.Property);
					if (C.ID === 0 && !FromLoversOrOwner && Lock && Lock.Asset.LoverOnly) ServerDeleteLock(NA.Property);

					ServerValidateProperties(C, NA, { SourceMemberNumber: SourceMemberNumber, FromOwner: FromOwner, FromLoversOrOwner: FromLoversOrOwner });
				}

				// Make sure we don't push an item if there's already an item in that slot
				var CanPush = true;
				for (let P = 0; P < Appearance.length; P++)
					if (Appearance[P].Asset.Group.Name == NA.Asset.Group.Name) {
						CanPush = false;
						break;
					}

				// Make sure we don't push an item that's disabled, coming from another player
				if (CanPush && !NA.Asset.Enable && !NA.Asset.OwnerOnly && !NA.Asset.LoverOnly && (SourceMemberNumber != null) && (C.ID == 0)) CanPush = false;
				if (CanPush) Appearance.push(NA);
				break;

			}

	}

	// Adds any critical appearance asset that could be missing, adds the default one
	for (let G = 0; G < AssetGroup.length; G++)
		if ((AssetGroup[G].Category == "Appearance") && !AssetGroup[G].AllowNone) {

			// Check if we already have the item
			var Found = false;
			for (let A = 0; A < Appearance.length; A++)
				if (Appearance[A].Asset.Group.Name == AssetGroup[G].Name)
					Found = true;

			// Adds the missing appearance part, we copy the mirrored group if it is not found and it exists
			if (!Found) {
				if (AssetGroup[G].MirrorGroup) {
					var MirroredAsset = null;
					for (let A = 0; A < Appearance.length; A++)
						if (Appearance[A].Asset.Group.Name == AssetGroup[G].MirrorGroup) {
							for (let I = 0; I < Asset.length; I++)
								if (Asset[I].Group.Name == AssetGroup[G].Name && Asset[I].Name == Appearance[A].Asset.Name) {
									MirroredAsset = { Asset: Asset[I], Color: Appearance[A].Color };
									break;
								}
							break;
						}
					if (MirroredAsset == null)
						for (let I = 0; I < Asset.length; I++)
							if (Asset[I].Group.Name == AssetGroup[G].Name) {
								MirroredAsset = { Asset: Asset[I], Color: Asset[I].Group.ColorSchema[0] };
								break;
							}
					Appearance.push(MirroredAsset);
				} else
					for (let I = 0; I < Asset.length; I++)
						if (Asset[I].Group.Name == AssetGroup[G].Name) {
							Appearance.push({ Asset: Asset[I], Color: Asset[I].Group.ColorSchema[0] });
							break;
						}
			}

		}
	return Appearance;

}

/**
 * Validates a new item properties to the item the character has
 * @param {Character} C - Character for which to apply the update
 * @param {Item} Item - The item the character has
 * @param {Property} NewProperty - The new Property we want to set on the item
 * @returns {void} - Nothing
 */
function ServerItemCopyProperty(C, Item, NewProperty) {
	if (Item.Property == null) return;
	if (Item.Property.LockedBy != null) NewProperty.LockedBy = Item.Property.LockedBy;
	if (Item.Property.LockMemberNumber != null) NewProperty.LockMemberNumber = Item.Property.LockMemberNumber; else delete NewProperty.LockMemberNumber;
	if (Item.Property.CombinationNumber != null) NewProperty.CombinationNumber = Item.Property.CombinationNumber; else delete NewProperty.CombinationNumber;
	if (Item.Property.RemoveItem != null) NewProperty.RemoveItem = Item.Property.RemoveItem; else delete NewProperty.RemoveItem;
	if (Item.Property.ShowTimer != null) NewProperty.ShowTimer = Item.Property.ShowTimer; else delete NewProperty.ShowTimer;
	if (Item.Property.EnableRandomInput != null) NewProperty.EnableRandomInput = Item.Property.EnableRandomInput; else delete NewProperty.EnableRandomInput;
	if (!NewProperty.EnableRandomInput || NewProperty.LockedBy != "LoversTimerPadlock") {
		if (Item.Property.MemberNumberList != null) NewProperty.MemberNumberList = Item.Property.MemberNumberList; else delete NewProperty.MemberNumberList;
		if (Item.Property.RemoveTimer != null) NewProperty.RemoveTimer = Math.round(Item.Property.RemoveTimer); else delete NewProperty.RemoveTimer;
	}
	if (Item.Property.Password != null) NewProperty.Password = Item.Property.Password; else delete NewProperty.Password;
	if (Item.Property.Hint != null) NewProperty.Hint = Item.Property.Hint; else delete NewProperty.Hint;
	if (Item.Property.LockSet != null) NewProperty.LockSet = Item.Property.LockSet; else delete NewProperty.LockSet;
	Item.Property = NewProperty;
	ServerValidateProperties(C, Item);
	if (Item.Property.LockedBy == "OwnerPadlock") InventoryLock(C, Item, { Asset: AssetGet(C.AssetFamily, "ItemMisc", "OwnerPadlock") }, NewProperty.LockMemberNumber);
	else if (Item.Property.LockedBy == "LoversPadlock") InventoryLock(C, Item, { Asset: AssetGet(C.AssetFamily, "ItemMisc", "LoversPadlock") }, NewProperty.LockMemberNumber);
}

/**
 * Validates and returns a color against a color schema
 * @param {string} Color - The color to validate
 * @param {string[]} Schema - The color schema to validate against (a list of accepted Color values)
 * @returns {string} - The color if it is a valid hex color string or part of the color schema, or the default color from the color schema
 * otherwise
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
};

/**
 * Callback used to parse received information related to a query made by the player such as viewing their online friends or current email status
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
 * @param {object} data - Data object containing the beep object which contain at the very least a name and a member number
 * @returns {void} - Nothing
 */
function ServerAccountBeep(data) {
	if ((data != null) && (typeof data === "object") && !Array.isArray(data) && (data.MemberNumber != null) && (typeof data.MemberNumber === "number") && (data.MemberName != null) && (typeof data.MemberName === "string")) {
		if (!data.BeepType || data.BeepType == "") {
			ServerBeep.MemberNumber = data.MemberNumber;
			ServerBeep.MemberName = data.MemberName;
			ServerBeep.ChatRoomName = data.ChatRoomName;
			ServerBeep.Timer = CurrentTime + 10000;
			if (Player.AudioSettings && Player.AudioSettings.PlayBeeps) {
				ServerBeepAudio.volume = Player.AudioSettings.Volume;
				ServerBeepAudio.play();
			}
			ServerBeep.Message = DialogFind(Player, "BeepFrom") + " " + ServerBeep.MemberName + " (" + ServerBeep.MemberNumber.toString() + ")";
			if (ServerBeep.ChatRoomName != null)
				ServerBeep.Message = ServerBeep.Message + " " + DialogFind(Player, "InRoom") + " \"" + ServerBeep.ChatRoomName + "\" " + (data.ChatRoomSpace === "Asylum" ? DialogFind(Player, "InAsylum") : '');
			FriendListBeepLog.push({ MemberNumber: data.MemberNumber, MemberName: data.MemberName, ChatRoomName: data.ChatRoomName, ChatRoomSpace: data.ChatRoomSpace, Sent: false, Time: new Date() });
			if (CurrentScreen == "FriendList") ServerSend("AccountQuery", { Query: "OnlineFriends" });
			if (Player.NotificationSettings.Beeps && !document.hasFocus()) CommonNotificationIncrement("Beep");
		} else if (data.BeepType == "Leash" && ChatRoomLeashPlayer == data.MemberNumber && data.ChatRoomName) {
			if (Player.OnlineSharedSettings && Player.OnlineSharedSettings.AllowPlayerLeashing != false && ( CurrentScreen != "ChatRoom" || !ChatRoomData || (CurrentScreen == "ChatRoom" && ChatRoomData.Name != data.ChatRoomName))) {
				if (ChatRoomCanBeLeashedBy(data.MemberNumber, Player)) {
					ChatRoomJoinLeash = data.ChatRoomName
					
					DialogLeave()
					ChatRoomClearAllElements();
					if (CurrentScreen == "ChatRoom") {
						ServerSend("ChatRoomLeave", "");
						CommonSetScreen("Online", "ChatSearch");
					}
					else ChatRoomStart("", "", "MainHall", "IntroductionDark", BackgroundsTagList) //CommonSetScreen("Room", "ChatSearch")
				} else {
					ChatRoomLeashPlayer = null
				}
			}
		}
	}
}



/** Draws the last beep sent by the server if the timer is still valid, used during the drawing process */
function ServerDrawBeep() {
	if ((ServerBeep.Timer != null) && (ServerBeep.Timer > CurrentTime)) {
		DrawButton((CurrentScreen == "ChatRoom") ? 0 : 500, 0, 1000, 50, ServerBeep.Message, "Pink", "");
		if (document.hasFocus()) CommonNotificationReset("Beep");
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
