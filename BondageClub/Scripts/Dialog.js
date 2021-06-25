"use strict";
var DialogText = "";
var DialogTextDefault = "";
var DialogTextDefaultTimer = -1;
var StruggleProgress = -1;
var DialogColor = null;
var DialogExpressionColor = null;
var DialogColorSelect = null;
var DialogPreviousCharacterData = {};
var DialogInventory = [];
var DialogInventoryOffset = 0;
/** @type {Item|null} */
var DialogFocusItem = null;
var DialogFocusSourceItem = null;
var DialogFocusItemColorizationRedrawTimer = null;
var DialogMenuButton = [];
var DialogItemToLock = null;
var DialogAllowBlush = false;
var DialogAllowEyebrows = false;
var DialogAllowFluids = false;
var DialogFacialExpressions = [];
var DialogFacialExpressionsSelected = -1;
var DialogFacialExpressionsSelectedBlindnessLevel = 2;
var DialogActivePoses = [];
var DialogItemPermissionMode = false;
var DialogExtendedMessage = "";
var DialogActivityMode = false;
var DialogActivity = [];
var DialogSortOrderEnabled = 1;
var DialogSortOrderEquipped = 2;
var DialogSortOrderUsable = 3;
var DialogSortOrderUnusable = 4;
var DialogSortOrderBlocked = 5;
var DialogSelfMenuSelected = null;
var DialogLeaveDueToItem = false; // This allows dynamic items to call DialogLeave() without crashing the game
var DialogLockMenu = false;
var DialogLentLockpicks = false;
var DialogGamingPreviousRoom = "";
var DialogGamingPreviousModule = "";

/** @type {Map<string, string>} */
var PlayerDialog = new Map();

/**
 * The list of menu types available when clicking on yourself
 * @const
 * @type {Array.<object>}
 */
var DialogSelfMenuOptions = [
	{
		Name: "Expression",
		IsAvailable: () => true,
		Draw: DialogDrawExpressionMenu,
		Click: DialogClickExpressionMenu,
	},
	{
		Name: "Pose",
		IsAvailable: () => (CurrentScreen == "ChatRoom" || CurrentScreen == "Photographic"),
		Draw: DialogDrawPoseMenu,
		Click: DialogClickPoseMenu,
	},
	{
		Name: "SavedExpressions",
		IsAvailable: () => true,
		Draw: DialogDrawSavedExpressionsMenu,
		Click: DialogClickSavedExpressionsMenu,
	},
	{
		Name: "OwnerRules",
		IsAvailable: () => DialogSelfMenuSelected && DialogSelfMenuSelected.Name == "OwnerRules",
		Draw: DialogDrawOwnerRulesMenu,
		Click: () => {},
	},
];

/**
 * Compares the player's reputation with a given value
 * @param {string} RepType - The name of the reputation to check
 * @param {string} Value - The value to compare
 * @returns {boolean} - Returns TRUE if a specific reputation type is less or equal than a given value
 */
function DialogReputationLess(RepType, Value) { return (ReputationGet(RepType) <= Value); }

/**
 * Compares the player's reputation with a given value
 * @param {string} RepType - The name of the reputation to check
 * @param {string} Value - The value to compare
 * @returns {boolean} - Returns TRUE if a specific reputation type is greater or equal than a given value
 */
function DialogReputationGreater(RepType, Value) { return (ReputationGet(RepType) >= Value); }

/**
 * Compares the player's money with a given amount
 * @param {string} Amount - The amount of money that must be met
 * @returns {boolean} - Returns TRUE if the player has enough money
 */
function DialogMoneyGreater(Amount) { return (parseInt(Player.Money) >= parseInt(Amount)); }

/**
 * Changes a given player's account by a given amount
 * @param {string} Amount - The amount that should be charged or added to the player's account
 * @returns {void} - Nothing
 */
function DialogChangeMoney(Amount) { CharacterChangeMoney(Player, Amount); }

/**
 * Alters the current player's reputation by a given amount
 * @param {string} RepType - The name of the reputation to change
 * @param {string} Value - The value, the player's reputation should be altered by
 * @returns {void} - Nothing
 */
function DialogSetReputation(RepType, Value) { ReputationChange(RepType, (parseInt(ReputationGet(RepType)) * -1) + parseInt(Value)); } // Sets a fixed number for the player specific reputation

/**
 * Change the player's reputation progressively through dialog options (a reputation is easier to break than to build)
 * @param {string} RepType - The name of the reputation to change
 * @param {string} Value - The value, the player's reputation should be altered by
 * @returns {void} - Nothing
 */
function DialogChangeReputation(RepType, Value) { ReputationProgress(RepType, Value); }

/**
 * Equips a specific item on the player from dialog
 * @param {string} AssetName - The name of the asset that should be equipped
 * @param {string} AssetGroup - The name of the corresponding asset group
 * @returns {void} - Nothing
 */
function DialogWearItem(AssetName, AssetGroup) { InventoryWear(Player, AssetName, AssetGroup); }

/**
 * Equips a random item from a given group to the player from dialog
 * @param {string} AssetGroup - The name of the asset group to pick from
 * @returns {void} - Nothing
 */
function DialogWearRandomItem(AssetGroup) { InventoryWearRandom(Player, AssetGroup); }

/**
 * Removes an item of a specific item group from the player
 * @param {string} AssetGroup - The item to be removed belongs to this asset group
 * @returns {void} - Nothing
 */
function DialogRemoveItem(AssetGroup) { InventoryRemove(Player, AssetGroup); }

/**
 * Releases a character from restraints
 * @param {string} C - The character to be released.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {void} - Nothing
 */
function DialogRelease(C) { CharacterRelease((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter); }

/**
 * Strips a character naked and removes the restrains
 * @param {string} C - The character to be stripped and released.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {void} - Nothing
 */
function DialogNaked(C) { CharacterNaked((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter); }

/**
 * Fully restrain a character with random items
 * @param {string} C - The character to be restrained.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {void} - Nothing
 */
function DialogFullRandomRestrain(C) { CharacterFullRandomRestrain((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter); }

/**
 * Checks, if a specific log has been registered with the player
 * @param {string} LogType - The name of the log to search for
 * @param {string} LogGroup - The name of the log group
 * @returns {boolean} - Returns true, if a specific log is registered
 */
function DialogLogQuery(LogType, LogGroup) { return LogQuery(LogType, LogGroup); }

/**
 * Sets the AllowItem flag on the current character
 * @param {string} Allow - The flag to set. Either "TRUE" or "FALSE"
 * @returns {boolean} - The boolean version of the flag
 */
function DialogAllowItem(Allow) { return CurrentCharacter.AllowItem = (Allow.toUpperCase().trim() == "TRUE"); }

/**
 * Returns the value of the AllowItem flag of a given character
 * @param {string} C - The character whose flag should be returned.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - The value of the given character's AllowItem flag
 */
function DialogDoAllowItem(C) { return (C.toUpperCase().trim() == "PLAYER") ? Player.AllowItem : CurrentCharacter.AllowItem; }

/**
 * Determines if the given character is kneeling
 * @param {string} C - The character to check
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is kneeling
 */
function DialogIsKneeling(C) { return (C.toUpperCase().trim() == "PLAYER") ? Player.IsKneeling() : CurrentCharacter.IsKneeling(); }

/**
 * Determines if the player is owned by the current character
 * @returns {boolean} - Returns true, if the player is owned by the current character, false otherwise
 */
function DialogIsOwner() { return (CurrentCharacter.Name == Player.Owner.replace("NPC-", "")); }

/**
 * Determines, if the current character is the player's lover
 * @returns {boolean} - Returns true, if the current character is one of the player's lovers
 */
function DialogIsLover() { return (CurrentCharacter.Name == Player.Lover.replace("NPC-", "")); }

/**
 * Determines if the current character is owned by the player
 * @returns {boolean} - Returns true, if the current character is owned by the player, false otherwise
 */
function DialogIsProperty() { return (CurrentCharacter.Owner == Player.Name); }

/**
 * Checks, if a given character is currently restrained
 * @param {string} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is wearing restraints, false otherwise
 */
function DialogIsRestrained(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.IsRestrained() : CurrentCharacter.IsRestrained()); }

/**
 * Checks, if a given character is currently blinded
 * @param {string} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is blinded, false otherwise
 */
function DialogIsBlind(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.IsBlind() : CurrentCharacter.IsBlind()); }

/**
 * Checks, if a given character is currently wearing a vibrating item
 * @param {string} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is wearing a vibrating item, false otherwise
 */
function DialogIsEgged(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.IsEgged() : CurrentCharacter.IsEgged()); }

/**
 * Checks, if a given character is able to change her clothes
 * @param {string} C - The character to check.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @returns {boolean} - Returns true, if the given character is able to change clothes, false otherwise
 */
function DialogCanInteract(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.CanInteract() : CurrentCharacter.CanInteract()); }

/**
 * Sets a new pose for the given character
 * @param {string} C - The character whose pose should be altered.
 * Either the player (value: Player) or the current character (value: CurrentCharacter)
 * @param {string} [NewPose=null] - The new pose, the character should take.
 * Can be omitted to bring the character back to the standing position.
 * @returns {void} - Nothing
 */
function DialogSetPose(C, NewPose) { CharacterSetActivePose((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter, ((NewPose != null) && (NewPose != "")) ? NewPose : null, true); }

/**
 * CHecks, wether a given skill of the player is greater or equal a given value
 * @param {string} SkillType - Name of the skill to check
 * @param {string} Value - The value, the given skill must be compared to
 * @returns {boolean} - Returns true if a specific skill is greater or equal than a given value
 */
function DialogSkillGreater(SkillType, Value) { return (parseInt(SkillGetLevel(Player, SkillType)) >= parseInt(Value)); }

/**
 * Cheks, if a given item is available in the player's inventory
 * @param {string} InventoryName
 * @param {string} InventoryGroup
 * @returns {boolean} - Returns true, if the item is available, false otherwise
 */
function DialogInventoryAvailable(InventoryName, InventoryGroup) { return InventoryAvailable(Player, InventoryName, InventoryGroup); }

/**
 * Checks, if the player is the administrator of the current chat room
 * @returns {boolean} - Returns true, if the player belogs to the group of administrators for the current char room false otherwise
 */
function DialogChatRoomPlayerIsAdmin() { return (ChatRoomPlayerIsAdmin() && (CurrentScreen == "ChatRoom")); }

/**
 * Checks, if a safe word can be used.
 * @returns {boolean} - Returns true, if the player is currently within a chat room
 */
function DialogChatRoomCanSafeword() { return (CurrentScreen == "ChatRoom" && Player.GameplaySettings.EnableSafeword); }

/**
 * Checks if the player is currently owned.
 * @returns {boolean} - Returns true, if the player is currently owned by an online player (not in trial)
 */
function DialogCanViewRules() { return (Player.Ownership != null) && (Player.Ownership.Stage == 1); }

/**
 * Checks if the chat room allows the photograph feature to be used.
 * @returns {boolean} - TRUE if the player can take a photo.
 */
function DialogChatRoomCanTakePhotos() { return CurrentScreen == "ChatRoom" && ChatRoomCanTakePhotos(); }

/**
 * Checks the prerequisite for a given dialog
 * @param {number} D - Index of the dialog to check
 * @returns {boolean} - Returns true, if the prerequisite is met, false otherwise
 */
function DialogPrerequisite(D) {
	if (CurrentCharacter.Dialog[D].Prerequisite == null)
		return true;
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("Player.") == 0)
		return Player[CurrentCharacter.Dialog[D].Prerequisite.substring(7, 250).replace("()", "").trim()]();
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("!Player.") == 0)
		return !Player[CurrentCharacter.Dialog[D].Prerequisite.substring(8, 250).replace("()", "").trim()]();
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("CurrentCharacter.") == 0)
		return CurrentCharacter[CurrentCharacter.Dialog[D].Prerequisite.substring(17, 250).replace("()", "").trim()]();
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("!CurrentCharacter.") == 0)
		return !CurrentCharacter[CurrentCharacter.Dialog[D].Prerequisite.substring(18, 250).replace("()", "").trim()]();
	else if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("(") >= 0)
		return CommonDynamicFunctionParams(CurrentCharacter.Dialog[D].Prerequisite);
	else if (CurrentCharacter.Dialog[D].Prerequisite.substring(0, 1) != "!")
		return !!window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.trim()];
	else
		return !window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.substr(1, 250).trim()];
}


/**
 * Checks if the player can play VR games
 * @returns {boolean} - Whether or not the player is wearing a VR headset with Gaming type
 */
function DialogHasGamingHeadset() {
	let head = InventoryGet(Player, "ItemHead");
	if (head && head.Property && head.Property.Type == "Gaming") return true;

	return false;
}
/**
 * Checks if the player can watch VR games
 * @returns {boolean} - Whether or not the player is wearing a VR headset with Gaming type
 */
function DialogCanWatchKinkyDungeon() {
	if (CurrentCharacter) {
		let head = InventoryGet(CurrentCharacter, "ItemHead");
		if (!(head && head.Property && head.Property.Type == "Gaming")) return false;

		if (Player.Effect.includes("VR")) return true;
	}
	return false;
}


/**
 * Starts the kinky dungeon game
 * @returns {void}
 */
function DialogStartKinkyDungeon(Arcade) {
	if (CurrentCharacter) {
		if (KinkyDungeonPlayerCharacter != CurrentCharacter) {
			KinkyDungeonGameRunning = false; // Reset the game to prevent carrying over spectator data
		}
		KinkyDungeonPlayerCharacter = CurrentCharacter;
		if (KinkyDungeonPlayerCharacter != Player && CurrentCharacter.MemberNumber) {
			KinkyDungeonGameData = null;
			ServerSend("ChatRoomChat", { Content: "RequestFullKinkyDungeonData", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
		}
	}
	DialogGamingPreviousRoom = CurrentScreen;
	DialogGamingPreviousModule = CurrentModule;
	MiniGameStart("KinkyDungeon", 0, "DialogEndKinkyDungeon");
}


/**
 * Return to previous room
 * @returns {void}
 */
function DialogEndKinkyDungeon() {
	CommonSetScreen(DialogGamingPreviousModule, DialogGamingPreviousRoom);
}

/**
 * Checks whether the player has a key for the item
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} Item - The item that should be unlocked
 * @returns {boolean} - Returns true, if the player can unlock the given item with a key, false otherwise
 */
function DialogHasKey(C, Item) {
	if (InventoryGetItemProperty(Item, "SelfUnlock") == false && (!Player.CanInteract() || C.ID == 0)) return false;
	if (C.IsOwnedByPlayer() && InventoryAvailable(Player, "OwnerPadlockKey", "ItemMisc") && Item.Asset.Enable) return true;
	const lock = InventoryGetLock(Item);
	if (C.IsLoverOfPlayer() && InventoryAvailable(Player, "LoversPadlockKey", "ItemMisc") && Item.Asset.Enable && Item.Property && Item.Property.LockedBy && !Item.Property.LockedBy.startsWith("Owner")) return true;
	if (lock && lock.Asset.ExclusiveUnlock && ((!Item.Property.MemberNumberListKeys && Item.Property.LockMemberNumber != Player.MemberNumber) || (Item.Property.MemberNumberListKeys && CommonConvertStringToArray("" + Item.Property.MemberNumberListKeys).indexOf(Player.MemberNumber) < 0))) return false;

	if (lock && lock.Asset.ExclusiveUnlock) return true;

	var UnlockName = "Unlock-" + Item.Asset.Name;
	if ((Item.Property != null) && (Item.Property.LockedBy != null)) UnlockName = "Unlock-" + Item.Property.LockedBy;
	for (let I = 0; I < Player.Inventory.length; I++)
		if (InventoryItemHasEffect(Player.Inventory[I], UnlockName)) {
			if (lock != null) {
				if (lock.Asset.LoverOnly && !C.IsLoverOfPlayer()) return false;
				if (lock.Asset.OwnerOnly && !C.IsOwnedByPlayer()) return false;
				return true;
			} else return true;
		}
	return false;
}

/**
 * Checks whether the player is able to unlock the provided item on the provided character
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} Item - The item that should be unlocked
 * @returns {boolean} - Returns true, if the player can unlock the given item, false otherwise
 */
function DialogCanUnlock(C, Item) {
	if ((C.ID != 0) && !Player.CanInteract()) return false;
	if ((Item != null) && (Item.Property != null) && (Item.Property.LockedBy != null) && (Item.Property.LockedBy == "ExclusivePadlock")) return (C.ID != 0);
	if (LogQuery("KeyDeposit", "Cell")) return false;
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.OwnerOnly == true)) return Item.Asset.Enable && C.IsOwnedByPlayer();
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.LoverOnly == true)) return Item.Asset.Enable && C.IsLoverOfPlayer();

	return DialogHasKey(C, Item);
}

/**
 * Some specific screens like the movie studio cannot allow the player to use items on herself, return FALSE if it's the case
 * @returns {boolean} - Returns TRUE if we allow using items
 */
function DialogAllowItemScreenException() {
	if ((CurrentScreen == "MovieStudio") && (MovieStudioCurrentMovie != "")) return false;
	return true;
}

/**
 * Returns the current character dialog intro
 * @returns {string} - The name of the current dialog, if such a dialog exists, any empty string otherwise
 */
function DialogIntro() {
	for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option == null) && (CurrentCharacter.Dialog[D].Result != null) && DialogPrerequisite(D))
			return CurrentCharacter.Dialog[D].Result;
	return "";
}


/**
 * Generic dialog function to leave conversation. De-inititalizes global variables and reverts the
 * FocusGroup of the player and the current character to null
 * @returns {void} - Nothing
 */
function DialogLeave() {
	if (DialogItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
	DialogLeaveFocusItem();
	DialogItemPermissionMode = false;
	DialogActivityMode = false;
	DialogItemToLock = null;
	Player.FocusGroup = null;
	if (CurrentCharacter) {
		if (CharacterAppearanceForceUpCharacter == CurrentCharacter.MemberNumber) {
			CharacterAppearanceForceUpCharacter = -1;
			CharacterRefresh(CurrentCharacter, false);
		}
		CurrentCharacter.FocusGroup = null;
	}
	DialogInventory = null;
	CurrentCharacter = null;
	DialogSelfMenuSelected = null;
	DialogFacialExpressionsSelected = -1;
	ClearButtons();
}

/**
 * Generic dialog function to remove a piece of the conversation that's already done
 * @returns {void} - Nothing
 */
function DialogRemove() {
	var pos = 0;
	for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
			if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 250 + pos * 105)) {
				CurrentCharacter.Dialog.splice(D, 1);
				break;
			}
			pos++;
		}
}

/**
 * Generic dialog function to remove any dialog from a specific group
 * @param {string} GroupName - All dialog options are removed from this group
 * @returns {void} - Nothing
 */
function DialogRemoveGroup(GroupName) {
	GroupName = GroupName.trim().toUpperCase();
	for (let D = CurrentCharacter.Dialog.length - 1; D >= 0; D--)
		if ((CurrentCharacter.Dialog[D].Group != null) && (CurrentCharacter.Dialog[D].Group.trim().toUpperCase() == GroupName)) {
			CurrentCharacter.Dialog.splice(D, 1);
		}
}

/**
 * Generic function that sets timers for expression changes, if the player'S expressions have been altered by the dialog
 * @returns {void} - Nothing
 */
function DialogEndExpression() {
	if (DialogAllowBlush) {
		TimerInventoryRemoveSet(Player, "Blush", 15);
		DialogAllowBlush = false;
	}
	if (DialogAllowEyebrows) {
		TimerInventoryRemoveSet(Player, "Eyebrows", 5);
		DialogAllowEyebrows = false;
	}
	if (DialogAllowFluids) {
		TimerInventoryRemoveSet(Player, "Fluids", 5);
		DialogAllowFluids = false;
	}
}

/**
 * Leaves the item menu for both characters. De-initializes global variables, sets the FocusGroup of
 * player andd current character to null and calls various cleanup functions
 * @returns {void} - Nothing
 */
function DialogLeaveItemMenu() {
	DialogEndExpression();
	DialogItemToLock = null;
	Player.FocusGroup = null;
	if (CurrentCharacter) {
		CurrentCharacter.FocusGroup = null;
	}
	DialogInventory = null;
	StruggleProgress = -1;
	DialogLockMenu = false;
	StruggleLockPickOrder = null;
	DialogColor = null;
	DialogMenuButton = [];
	if (DialogItemPermissionMode && CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
	DialogItemPermissionMode = false;
	DialogActivityMode = false;
	DialogTextDefault = "";
	DialogTextDefaultTimer = 0;
	DialogPreviousCharacterData = {};
	ElementRemove("InputColor");
	AudioDialogStop();
	ColorPickerEndPick();
	ColorPickerRemoveEventListener();
	ItemColorCancelAndExit();
}

/**
 * Leaves the item menu of the focused item. Constructs a function name from the
 * item's asset group name and the item's name and tries to call that.
 * @returns {boolean} - Returns true, if an item specific exit function was called, false otherwise
 */
function DialogLeaveFocusItem() {
	if (DialogFocusItem != null) {
		if (DialogFocusItem.Asset.Extended) {
			ExtendedItemExit();
		}

		var funcName = "Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Exit";
		if (typeof window[funcName] === "function") {
			window[funcName]();
			DialogFocusItem = null;
			return true;
		}
		DialogFocusItem = null;
	}
	return false;
}

/**
 * Adds the item in the dialog list
 * @param {Character} C - The character, whose inventory should be manipulated
 * @param {Item} NewInv - The item that should be added to the player's inventory
 * @param {boolean} NewInvWorn - Should be true, if the item is worn, false otherwise
 * @param {number} SortOrder - Defines the group the item is added to.
 * @returns {void} - Nothing
 */
function DialogInventoryAdd(C, NewInv, NewInvWorn, SortOrder) {

	// Make sure we do not add owner/lover only items for invalid characters, owner/lover locks can be applied on the player by the player for self-bondage
	if (NewInv.Asset.OwnerOnly && !NewInvWorn && !C.IsOwnedByPlayer())
		if ((C.ID != 0) || ((C.Owner == "") && (C.Ownership == null)) || !NewInv.Asset.IsLock || ((C.ID == 0) && LogQuery("BlockOwnerLockSelf", "OwnerRule")))
			return;
	if (NewInv.Asset.LoverOnly && !NewInvWorn && !C.IsLoverOfPlayer()) {
		if (!NewInv.Asset.IsLock || C.GetLoversNumbers(true).length == 0) return;
		if (C.ID == 0) {
			if (LogQuery("BlockLoverLockSelf", "LoverRule")) return;
		}
		else if (!C.IsOwnedByPlayer() || LogQueryRemote(C, "BlockLoverLockOwner", "LoverRule")) return;
	}


	// Do not show keys if they are in the deposit
	if (LogQuery("KeyDeposit", "Cell") && InventoryIsKey(NewInv)) return;

	// Make sure we do not duplicate the non-blocked item
	for (let I = 0; I < DialogInventory.length; I++)
		if ((DialogInventory[I].Asset.Group.Name == NewInv.Asset.Group.Name) && (DialogInventory[I].Asset.Name == NewInv.Asset.Name))
			return;

	// If the item is blocked, we show it at the end of the list
	if (InventoryBlockedOrLimited(C, NewInv))
		SortOrder = DialogSortOrderBlocked;

	// Creates a new dialog inventory item
	var DI = {
		Asset: NewInv.Asset,
		Worn: NewInvWorn,
		Icon: "",
		SortOrder: SortOrder.toString() + NewInv.Asset.Description
	};

	// Loads the correct icon and push the item in the array
	if (NewInvWorn && InventoryItemHasEffect(NewInv, "Lock", true)) DI.Icon = "Locked";
	if (!NewInvWorn && InventoryItemHasEffect(NewInv, "Lock", true)) DI.Icon = "Unlocked";
	DialogInventory.push(DI);

}

/**
 * Some special screens can always allow you to put on new restraints. This function determines, if this is possible
 * @returns {boolean} - Returns trues, if it is possible to put on new restraints.
 */
function DialogAlwaysAllowRestraint() {
	return (CurrentScreen == "Photographic");
}

/**
 * Checks whether the player can use a remote on the given character and item
 * @param {Character} C - the character that the item is equipped on
 * @param {Item} Item - the item to check for remote usage against
 * @return {boolean} - Returns true if the player is able to use a remote for the given character and item. Returns false otherwise.
 */
function DialogCanUseRemote(C, Item) {
	// Can't use remotes if there is no item, the item doesn't have the "Egged" effect, or the player cannot interact
	// with remotes in the first place
	if (!Item || (!InventoryItemHasEffect(Item, "Egged") && !InventoryItemHasEffect(Item, "UseRemote")) || !Player.CanInteract()) return false;
	// Can't use remotes on self if the player is owned and their remotes have been blocked by an owner rule
	if (C.ID === 0 && Player.Ownership && Player.Ownership.Stage === 1 && LogQuery("BlockRemoteSelf", "OwnerRule")) return false;
	if (Item.Asset.LoverOnly) {
		// If the item is lover-only, the player must have the appropriate remote, be a lover of the character, and match the member number on the item
		return C.IsLoverOfPlayer() && Item.Property && Item.Property.ItemMemberNumber === Player.MemberNumber && InventoryAvailable(Player, "LoversVibratorRemote", "ItemVulva");
	} else {

		// Otherwise, the player must have a vibrator remote and some items can block remotes
		if (C.Effect.indexOf("BlockRemotes") >= 0) return false;
		return InventoryAvailable(Player, "VibratorRemote", "ItemVulva");
	}
}

/**
 * Checks whether the player can color the given item on the given character
 * @param {Character} C - The character on whom the item is equipped
 * @param {Item} Item - The item to check the player's ability to color against
 * @returns {boolean} - TRUE if the player is able to color the item, FALSE otherwise
 */
function DialogCanColor(C, Item) {
	const ItemColorable = !Item || (Item && Item.Asset && Item.Asset.ColorableLayerCount > 0);
	const CanUnlock = InventoryItemHasEffect(Item, "Lock", true) ? DialogCanUnlock(C, Item) : true;
	return (Player.CanInteract() && CanUnlock && ItemColorable) || DialogAlwaysAllowRestraint();
}

function DialogCanInspectLockWhileBlind(lockName) {
	return ["SafewordPadlock", "CombinationPadlock"].includes(lockName);
}

/**
 * Build the buttons in the top menu
 * @param {Character} C - The character for whom the dialog is prepared
 * @returns {void} - Nothing
 */
function DialogMenuButtonBuild(C) {

	// The "Exit" button is always available
	DialogMenuButton = ["Exit"];

	const Item = InventoryGet(C, C.FocusGroup.Name);
	const ItemBlockedOrLimited = !!Item && InventoryBlockedOrLimited(C, Item);

	// In color picker mode
	if (DialogColor != null && Item == null) {
		DialogMenuButton.push("ColorCancel");
		DialogMenuButton.push("ColorSelect");
		return;
	}
	if (StruggleLockPickOrder)
		DialogMenuButton.push("LockCancel");

	// Out of struggle mode, we calculate which buttons to show in the UI
	if ((StruggleProgress < 0) && !StruggleLockPickOrder && !DialogActivityMode) {

		// Pushes all valid main buttons, based on if the player is restrained, has a blocked group, has the key, etc.
		const IsItemLocked = InventoryItemHasEffect(Item, "Lock", true);
		const IsGroupBlocked = InventoryGroupIsBlocked(C);
		const CanAccessLockpicks = Player.CanInteract() || Player.CanWalk(); // If the character can access her tools. Maybe in the future you will be able to hide a lockpick in your panties :>

		if (DialogLockMenu) {
			DialogMenuButton.push("LockCancel");

			// If the item isn't locked, there are no more buttons to add
			const Lock = InventoryGetLock(Item);
			if (!IsItemLocked || !Lock) return;

			const LockBlockedOrLimited = InventoryBlockedOrLimited(C, Lock) || ItemBlockedOrLimited;

			if (!Player.IsBlind() && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked && ((C.ID != 0) || Player.CanInteract())
				|| ((Item != null) && (C.ID == 0) && !Player.CanInteract() && InventoryItemHasEffect(Item, "Block", true) && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked)) {
				DialogMenuButton.push("Unlock");
			}
			if (InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked && !InventoryGroupIsBlocked(Player, "ItemHands") && InventoryItemIsPickable(Item) && (C.ID == 0 || (C.OnlineSharedSettings && !C.OnlineSharedSettings.DisablePickingLocksOnSelf))) {
				if (DialogLentLockpicks)
					DialogMenuButton.push("PickLock");
				else if (CanAccessLockpicks)
					for (let I = 0; I < Player.Inventory.length; I++)
						if (Player.Inventory[I].Name == "Lockpicks") {
							DialogMenuButton.push("PickLock");
							break;
						}
			}
			if (Lock && (!Player.IsBlind() || DialogCanInspectLockWhileBlind(Lock.Asset.Name))) {
				DialogMenuButton.push(LockBlockedOrLimited ? "InspectLockDisabled" : "InspectLock");
			}

		} else {
			if ((DialogInventory != null) && (DialogInventory.length > 12) && ((Player.CanInteract() && !IsGroupBlocked) || DialogItemPermissionMode)) DialogMenuButton.push("Next");
			if (C.FocusGroup.Name == "ItemMouth" || C.FocusGroup.Name == "ItemMouth2" || C.FocusGroup.Name == "ItemMouth3") DialogMenuButton.push("ChangeLayersMouth");
			if (IsItemLocked && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked && ((C.ID != 0) || Player.CanInteract())) {  DialogMenuButton.push("Remove"); }
			if (IsItemLocked && ((!Player.IsBlind() || (Item.Property && DialogCanInspectLockWhileBlind(Item.Property.LockedBy))) || (InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked && !InventoryGroupIsBlocked(Player, "ItemHands") && InventoryItemIsPickable(Item))  && (C.ID == 0 || (C.OnlineSharedSettings && !C.OnlineSharedSettings.DisablePickingLocksOnSelf)))
				&& (Item.Property != null) && (Item.Property.LockedBy != null) && (Item.Property.LockedBy != "")
			) {
				DialogMenuButton.push("LockMenu");
			}
			if ((Item != null) && (C.ID == 0) && (!Player.CanInteract() || (IsItemLocked && !DialogCanUnlock(C, Item))) && (DialogMenuButton.indexOf("Unlock") < 0) && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Struggle");
			if ((Item != null) && !IsItemLocked && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) {
				if (Item.Asset.AllowLock && (!Item.Property || (Item.Property && Item.Property.AllowLock !== false))) {
					if (!Item.Asset.AllowLockType || (Item.Property && Item.Asset.AllowLockType.includes(Item.Property.Type))) {
						DialogMenuButton.push(ItemBlockedOrLimited ? "LockDisabled" : "Lock");
					}
				}
			}
			if ((Item != null) && !IsItemLocked && !InventoryItemHasEffect(Item, "Mounted", true) && !InventoryItemHasEffect(Item, "Enclose", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Remove");
			if ((Item != null) && !IsItemLocked && InventoryItemHasEffect(Item, "Mounted", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Dismount");
			if ((Item != null) && !IsItemLocked && InventoryItemHasEffect(Item, "Enclose", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !IsGroupBlocked) DialogMenuButton.push("Escape");
			if ((Item != null) && Item.Asset.Extended && ((Player.CanInteract()) || DialogAlwaysAllowRestraint() || Item.Asset.AlwaysInteract) && (!IsGroupBlocked || Item.Asset.AlwaysExtend) && (!Item.Asset.OwnerOnly || (C.IsOwnedByPlayer())) && (!Item.Asset.LoverOnly || (C.IsLoverOfPlayer()))) DialogMenuButton.push(ItemBlockedOrLimited ? "UseDisabled" : "Use");
			// Extended icon doesnt show up if remote works
			if (!DialogMenuButton.includes("Use") && DialogCanUseRemote(C, Item)) DialogMenuButton.push(ItemBlockedOrLimited ? "RemoteDisabled" : "Remote");
			
			if (DialogCanColor(C, Item)) DialogMenuButton.push(ItemBlockedOrLimited ? "ColorPickDisabled" : "ColorPick");

			// Make sure the target player zone is allowed for an activity
			if ((C.FocusGroup.Activity != null) && ((!C.IsEnclose() && !Player.IsEnclose()) || C.ID == 0) && ActivityAllowed() && (C.ArousalSettings != null) && (C.ArousalSettings.Zone != null) && (C.ArousalSettings.Active != null) && (C.ArousalSettings.Active != "Inactive"))
				for (let Z = 0; Z < C.ArousalSettings.Zone.length; Z++)
					if ((C.ArousalSettings.Zone[Z].Name == C.FocusGroup.Name) && (C.ArousalSettings.Zone[Z].Factor != null) && (C.ArousalSettings.Zone[Z].Factor > 0)) {
						ActivityDialogBuild(C);
						if (DialogActivity.length > 0) DialogMenuButton.push("Activity");
					}

			// Item permission enter/exit
			if (C.ID == 0) {
				if (DialogItemPermissionMode) DialogMenuButton.push("DialogNormalMode");
				else DialogMenuButton.push("DialogPermissionMode");
			}
		}
	}
}


/**
 * Sort the inventory list by the global variable SortOrder (a fixed number & current language description)
 * @returns {void} - Nothing
 */
function DialogInventorySort() {
	DialogInventory.sort((a, b) => a.SortOrder.localeCompare(b.SortOrder, undefined, { numeric: true, sensitivity: 'base' }));
}

//
/**
 * Build the inventory listing for the dialog which is what's equipped,
 * the player's inventory and the character's inventory for that group
 * @param {Character} C - The character whose inventory must be built
 * @param {number} [Offset] - The offset to be at, if specified.
 * @param {boolean} [redrawPreviews=false] - If TRUE and if building a list of preview character images, redraw the canvases
 * @returns {void} - Nothing
 */
function DialogInventoryBuild(C, Offset, redrawPreviews = false) {

	// Make sure there's a focused group
	DialogInventoryOffset = Offset;
	if (DialogInventoryOffset == null) DialogInventoryOffset = 0;

	const DialogInventoryBefore = DialogInventoryStringified(C);
	DialogInventory = [];
	if (C.FocusGroup != null) {

		// First, we add anything that's currently equipped
		var CurItem = null;
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name) && C.Appearance[A].Asset.DynamicAllowInventoryAdd(C)) {
				DialogInventoryAdd(C, C.Appearance[A], true, DialogSortOrderEnabled);
				CurItem = C.Appearance[A];
				break;
			}

		// In item permission mode we add all the enable items except the ones already on, unless on Extreme difficulty
		if (DialogItemPermissionMode) {
			const onExtreme = Player.GetDifficulty() >= 3;
			for (let A = 0; A < Asset.length; A++)
				if (Asset[A].Enable && Asset[A].Group.Name == C.FocusGroup.Name) {
					if (Asset[A].Wear && !onExtreme) {
						if ((CurItem == null) || (CurItem.Asset.Name != Asset[A].Name) || (CurItem.Asset.Group.Name != Asset[A].Group.Name))
							DialogInventory.push({ Asset: Asset[A], Worn: false, Icon: "", SortOrder: DialogSortOrderEnabled.toString() + Asset[A].Description });
					}
					else if (Asset[A].IsLock && (!onExtreme || MainHallStrongLocks.includes(Asset[A].Name))) {
						const LockIsWorn = InventoryCharacterIsWearingLock(C, Asset[A].Name);
						DialogInventory.push({ Asset: Asset[A], Worn: LockIsWorn, Icon: "", SortOrder: DialogSortOrderEnabled.toString() + Asset[A].Description });
					}
				}
		} else {

			// Second, we add everything from the victim inventory
			for (let A = 0; A < C.Inventory.length; A++)
				if ((C.Inventory[A].Asset != null) && (C.Inventory[A].Asset.Group.Name == C.FocusGroup.Name) && C.Inventory[A].Asset.DynamicAllowInventoryAdd(C)) {
					let DialogSortOrder = C.Inventory[A].Asset.DialogSortOverride != null ? C.Inventory[A].Asset.DialogSortOverride : (InventoryAllow(C, C.Inventory[A].Asset.Prerequisite, false) && InventoryChatRoomAllow(C.Inventory[A].Asset.Category)) ? DialogSortOrderUsable : DialogSortOrderUnusable;
					DialogInventoryAdd(C, C.Inventory[A], false, DialogSortOrder);
				}

			// Third, we add everything from the player inventory if the player isn't the victim
			if (C.ID != 0)
				for (let A = 0; A < Player.Inventory.length; A++)
					if ((Player.Inventory[A].Asset != null) && (Player.Inventory[A].Asset.Group.Name == C.FocusGroup.Name) && Player.Inventory[A].Asset.DynamicAllowInventoryAdd(C)) {
						let DialogSortOrder = Player.Inventory[A].Asset.DialogSortOverride != null ? Player.Inventory[A].Asset.DialogSortOverride : (InventoryAllow(C, Player.Inventory[A].Asset.Prerequisite, false) && InventoryChatRoomAllow(Player.Inventory[A].Asset.Category)) ? DialogSortOrderUsable : DialogSortOrderUnusable;
						DialogInventoryAdd(C, Player.Inventory[A], false, DialogSortOrder);
					}

			// Fourth, we add all free items (especially useful for clothes), or location-specific always available items
			for (let A = 0; A < Asset.length; A++) {
				if (Asset[A].Group.Name === C.FocusGroup.Name && Asset[A].DynamicAllowInventoryAdd(C)) {
					if (Asset[A].Value === 0 || (Asset[A].AvailableLocations.includes("Asylum") && (CurrentScreen.startsWith("Asylum") || ChatRoomSpace === "Asylum"))) {
						let DialogSortOrder = Asset[A].DialogSortOverride != null ? Asset[A].DialogSortOverride :
							(InventoryAllow(C, Asset[A].Prerequisite, false) && InventoryChatRoomAllow(Asset[A].Category)) ?
								DialogSortOrderUsable : DialogSortOrderUnusable;
						DialogInventoryAdd(C, { Asset: Asset[A] }, false, DialogSortOrder);
					}
				}
			}
		}

		// Rebuilds the dialog menu and its buttons
		DialogInventorySort();
		DialogMenuButtonBuild(C);

		// Build the list of preview images
		const DialogInventoryAfter = DialogInventoryStringified(C);
		const redraw = redrawPreviews || (DialogInventoryBefore !== DialogInventoryAfter);
		AppearancePreviewBuild(C, redraw);
	}
}

/**
 * Create a stringified list of the group and the assets currently in the dialog inventory
 * @param {Character} C - The character the dialog inventory has been built for
 * @returns {string} - The list of assets as a string
 */
function DialogInventoryStringified(C) {
	return (C.FocusGroup ? C.FocusGroup.Name : "") + (DialogInventory ? JSON.stringify(DialogInventory.map(I => I.Asset.Name).sort()) : "");
}

/**
 * Build the initial state of the selection available in the facial expressions menu
 * @returns {void} - Nothing
 */
function DialogFacialExpressionsBuild() {
	DialogFacialExpressions = [];
	for (let I = 0; I < Player.Appearance.length; I++) {
		const PA = Player.Appearance[I];
		let ExpressionList = PA.Asset.Group.AllowExpression;
		if (!ExpressionList || !ExpressionList.length || PA.Asset.Group.Name == "Eyes2") continue;
		ExpressionList = ExpressionList.slice();
		if (!ExpressionList.includes(null)) ExpressionList.unshift(null);
		const Item = {};
		Item.Appearance = PA;
		Item.Group = PA.Asset.Group.Name;
		Item.CurrentExpression = (PA.Property == null) ? null : PA.Property.Expression;
		Item.ExpressionList = ExpressionList;
		DialogFacialExpressions.push(Item);
	}
	// Temporary (?) solution to make the facial elements appear in a more logical order, as their alphabetical order currently happens to match up
	DialogFacialExpressions = DialogFacialExpressions.sort(function (a, b) {
		return a.Appearance.Asset.Group.Name < b.Appearance.Asset.Group.Name ? -1 : a.Appearance.Asset.Group.Name > b.Appearance.Asset.Group.Name ? 1 : 0;
	});
}

/**
 * saves the expressions to a slot
 * @param {any} Slot slot 0-4
 */
function DialogFacialExpressionsSave(Slot) {
	Player.SavedExpressions[Slot] = [];
	for (let x = 0; x < DialogFacialExpressions.length; x++) {
		Player.SavedExpressions[Slot].push({ Group: DialogFacialExpressions[x].Group, CurrentExpression: DialogFacialExpressions[x].CurrentExpression });
	}
	ServerAccountUpdate.QueueData({ SavedExpressions: Player.SavedExpressions });
}
/**
 * loads expressions from a slot
 * @param {any} Slot slot 0-4
 */
function DialogFacialExpressionsLoad(Slot) {
	if (Player.SavedExpressions[Slot] != null) {
		for (let x = 0; x < Player.SavedExpressions[Slot].length; x++) {
			CharacterSetFacialExpression(Player, Player.SavedExpressions[Slot][x].Group, Player.SavedExpressions[Slot][x].CurrentExpression);
		}
		DialogFacialExpressionsBuild();
	}
}
/**draws the savedexpressions menu */
function DialogDrawSavedExpressionsMenu() {
	DrawText(DialogFindPlayer("SavedExpressions"), 195, 25, "White", "Black");
	DrawText(DialogFindPlayer("SavedExpressionsSave"), 140, 180, "White", "Black");
	DrawText(DialogFindPlayer("SavedExpressionsLoad"), 260, 180, "White", "Black");
	for (let x = 0; x < 5; x++) {
		DrawButton(100, 200 + (x * 100), 80, 80, x + 1, "White");
		DrawButton(220, 200 + (x * 100), 80, 80, x + 1, "White");
	}
}
/**handles clicks in the savedexpressions menu */
function DialogClickSavedExpressionsMenu() {
	if (MouseXIn(100, 80)) {
		for (let x = 0; x < 5; x++) {
			if (MouseYIn(200 + (x * 100), 80)) {
				DialogFacialExpressionsSave(x);
			}
		}
	}
	if (MouseXIn(220, 80)) {
		for (let x = 0; x < 5; x++) {
			if (MouseYIn(200 + (x * 100), 80)) {
				DialogFacialExpressionsLoad(x);
			}
		}
	}
}

/**
 * Build the initial state of the pose menu
 * @returns {void} - Nothing
 */
function DialogActivePoseMenuBuild() {
	DialogActivePoses = [];

	PoseFemale3DCG
		.filter(P => P.AllowMenu)
		.map(P => P.Category)
		.filter((C, I, Categories) => C && Categories.indexOf(C) === I)
		.forEach(Category => {
			DialogActivePoses.push(PoseFemale3DCG.filter(P =>  P.AllowMenu && P.Category == Category));
		});
}



/**
 * Handles the Click events in the Dialog Screen
 * @returns {void} - Nothing
 */
function DialogMenuButtonClick() {

	// Finds the current icon
	for (let I = 0; I < DialogMenuButton.length; I++)
		if ((MouseX >= 1885 - I * 110) && (MouseX <= 1975 - I * 110)) {

			// Gets the current character and item
			const C = CharacterGetCurrent();
			const Item = InventoryGet(C, C.FocusGroup.Name);

			// Exit Icon - Go back to the character dialog
			if (DialogMenuButton[I] == "Exit") {
				if (DialogItemPermissionMode) ChatRoomCharacterUpdate(Player);
				if ((StruggleProgressStruggleCount >= 50) && (StruggleProgressChallenge > 6) && (StruggleProgressAuto < 0) && (StruggleProgress > 0)) ChatRoomStimulationMessage("StruggleFail");
				DialogLeaveItemMenu();
				return;
			}

			// Next Icon - Shows the next 12 items
			else if (DialogMenuButton[I] == "Next") {
				DialogInventoryOffset = DialogInventoryOffset + 12;
				if (DialogInventoryOffset >= DialogInventory.length) DialogInventoryOffset = 0;
				return;
			}

			// Use Icon - Pops the item extension for the focused item
			else if ((DialogMenuButton[I] == "Use") && (Item != null)) {
				DialogExtendItem(Item);
				return;
			}

			// Remote Icon - Pops the item extension
			else if ((DialogMenuButton[I] == "Remote") && DialogCanUseRemote(C, Item)) {
				DialogExtendItem(Item);
				return;
			}

			// Cycle through the layers of restraints for the mouth
			else if (DialogMenuButton[I] == "ChangeLayersMouth") {
				var NewLayerName;
				if (C.FocusGroup.Name == "ItemMouth") NewLayerName = "ItemMouth2";
				if (C.FocusGroup.Name == "ItemMouth2") NewLayerName = "ItemMouth3";
				if (C.FocusGroup.Name == "ItemMouth3") NewLayerName = "ItemMouth";
				for (let A = 0; A < AssetGroup.length; A++)
					if (AssetGroup[A].Name == NewLayerName) {
						C.FocusGroup = AssetGroup[A];
						DialogInventoryBuild(C);
					}
			}


			// Lock Icon - Rebuilds the inventory list with locking items
			else if ((DialogMenuButton[I] == "Lock") && (Item != null)) {
				if (DialogItemToLock == null) {
					if ((Item != null) && (Item.Asset.AllowLock != null)) {
						DialogInventoryOffset = 0;
						DialogInventory = [];
						DialogItemToLock = Item;
						for (let A = 0; A < Player.Inventory.length; A++)
							if ((Player.Inventory[A].Asset != null) && Player.Inventory[A].Asset.IsLock)
								DialogInventoryAdd(C, Player.Inventory[A], false, DialogSortOrderUsable);
						DialogInventorySort();
						DialogMenuButtonBuild(C);
					}
				} else {
					DialogItemToLock = null;
					DialogInventoryBuild(C);
				}
				return;
			}

			// Unlock Icon - If the item is padlocked, we immediately unlock.  If not, we start the struggle progress.
			else if ((DialogMenuButton[I] == "Unlock") && (Item != null)) {
				if (!InventoryItemHasEffect(Item, "Lock", false) && InventoryItemHasEffect(Item, "Lock", true) && ((C.ID != 0) || C.CanInteract())) {
					InventoryUnlock(C, C.FocusGroup.Name);
					if (CurrentScreen == "ChatRoom") ChatRoomPublishAction(C, Item, null, true, "ActionUnlock");
					else DialogInventoryBuild(C);
					DialogLockMenu = false;
				} else StruggleProgressStart(C, Item, null);
				StruggleLockPickOrder = null;
				DialogLockMenu = false;
				return;
			}

			// Remove/Struggle Icon - Starts the struggling mini-game (can be impossible to complete)
			else if (((DialogMenuButton[I] == "Remove") || (DialogMenuButton[I] == "Struggle") || (DialogMenuButton[I] == "Dismount") || (DialogMenuButton[I] == "Escape")) && (Item != null)) {
				StruggleProgressStart(C, Item, null);
				return;
			}

			// Remove/Struggle Icon - Starts the struggling mini-game (can be impossible to complete)
			else if (((DialogMenuButton[I] == "PickLock")) && (Item != null)) {
				StruggleLockPickProgressStart(C, Item);
				return;
			}

			// When the player inspects a lock
			else if ((DialogMenuButton[I] == "InspectLock") && (Item != null)) {
				var Lock = InventoryGetLock(Item);
				if (Lock != null) DialogExtendItem(Lock, Item);
				return;
			}

			// Color picker Icon - Starts the color picking, keeps the original color and shows it at the bottom
			else if (DialogMenuButton[I] == "ColorPick") {
				if (!Item) {
					ElementCreateInput("InputColor", "text", (DialogColorSelect != null) ? DialogColorSelect.toString() : "");
				} else {
					const originalColor = Item.Color;
					ItemColorLoad(C, Item, 1300, 25, 675, 950);
					ItemColorOnExit((save) => {
						DialogColor = null;
						if (save && !CommonColorsEqual(originalColor, Item.Color)) {
							if (C.ID == 0) ServerPlayerAppearanceSync();
							ChatRoomPublishAction(C, Object.assign({}, Item, { Color: originalColor }), Item, false);
						}
					});
				}
				DialogColor = "";
				DialogMenuButtonBuild(C);
				return;
			}

			// When the user selects a color, applies it to the item
			else if (!Item && (DialogMenuButton[I] == "ColorSelect") && CommonIsColor(ElementValue("InputColor"))) {
				DialogColor = null;
				DialogColorSelect = ElementValue("InputColor");
				ElementRemove("InputColor");
				DialogMenuButtonBuild(C);
				return;
			}

			// When the user cancels out of color picking, we recall the original color
			else if (!Item && DialogMenuButton[I] == "ColorCancel") {
				DialogColor = null;
				DialogColorSelect = null;
				ElementRemove("InputColor");
				DialogMenuButtonBuild(C);
				return;
			}


			// When the user cancels out of lock menu, we recall the original color
			else if (Item && DialogMenuButton[I] == "LockCancel") {
				DialogLockMenu = false;
				StruggleLockPickOrder = null;
				DialogMenuButtonBuild(C);
				return;
			}
			// When the user selects the lock menu, we enter
			else if (Item && DialogMenuButton[I] == "LockMenu") {
				DialogLockMenu = true;
				DialogMenuButtonBuild(C);
				return;
			}


			// When the user wants to select a sexual activity to perform
			else if (DialogMenuButton[I] == "Activity") {
				DialogActivityMode = true;
				DialogMenuButton = null;
				DialogInventoryOffset = 0;
				DialogTextDefault = "";
				DialogTextDefaultTimer = 0;
				return;
			}

			// When we enter item permission mode, we rebuild the inventory to set permissions
			else if (DialogMenuButton[I] == "DialogPermissionMode") {
				DialogItemPermissionMode = true;
				DialogItemToLock = null;
				DialogInventoryBuild(C);
				return;
			}

			// When we leave item permission mode, we upload the changes for everyone in the room
			else if (DialogMenuButton[I] == "DialogNormalMode") {
				if (CurrentScreen == "ChatRoom") ChatRoomCharacterUpdate(Player);
				DialogItemPermissionMode = false;
				DialogInventoryBuild(C);
				return;
			}
		}

}

/**
 * Publishes the item action to the local chat room or the dialog screen
 * @param {Character} C - The character who is the actor in this action
 * @param {Item} ClickItem - The item that is used
 * @returns {void} - Nothing
 */
function DialogPublishAction(C, ClickItem) {

	// The shock triggers can trigger items that can shock the wearer
	if (C.FocusGroup != null) {
		var TargetItem = (InventoryGet(C, C.FocusGroup.Name));
		if (InventoryItemHasEffect(ClickItem, "TriggerShock") && InventoryItemHasEffect(TargetItem, "ReceiveShock")) {
			if (CurrentScreen == "ChatRoom") {
				let intensity = TargetItem.Property ? TargetItem.Property.Intensity : 0;
				InventoryExpressionTrigger(C, ClickItem);
				ChatRoomPublishCustomAction(TargetItem.Asset.Name + "Trigger" + intensity, true, [{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber }]);
			}
			else {
				let intensity = TargetItem.Property ? TargetItem.Property.Intensity : 0;
				let D = (DialogFindPlayer(TargetItem.Asset.Name + "Trigger" + intensity)).replace("DestinationCharacterName", C.Name);
				if (D != "") {
					InventoryExpressionTrigger(C, ClickItem);
					C.CurrentDialog = "(" + D + ")";
					DialogLeaveItemMenu();
				}
			}
			return;
		}
	}

	// Publishes the item result
	if ((CurrentScreen == "ChatRoom") && !InventoryItemHasEffect(ClickItem)) {
		InventoryExpressionTrigger(C, ClickItem);
		ChatRoomPublishAction(C, null, ClickItem, true);
	}
	else {
		let D = DialogFind(C, ClickItem.Asset.Group.Name + ClickItem.Asset.Name, null, false);
		if (D != "") {
			InventoryExpressionTrigger(C, ClickItem);
			C.CurrentDialog = D;
			DialogLeaveItemMenu();
		}
	}

}

/**
 * Handles clicks on an item
 * @param {Item} ClickItem - The item that is clicked
 * @returns {void} - Nothing
 */
function DialogItemClick(ClickItem) {

	// Gets the current character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	var CurrentItem = InventoryGet(C, C.FocusGroup.Name);

	// In permission mode, the player can allow or block items for herself
	if ((C.ID == 0) && DialogItemPermissionMode) {
		if (ClickItem.Worn || (CurrentItem && (CurrentItem.Asset.Name == ClickItem.Asset.Name))) return;
		InventoryTogglePermission(ClickItem, null);
		return;
	}

	// If the item is blocked or limited for that character, we do not use it
	if (InventoryBlockedOrLimited(C, ClickItem)) return;

	// If we must apply a lock to an item (can trigger a daily job)
	if (DialogItemToLock != null) {
		if ((CurrentItem != null) &&
			(CurrentItem.Asset.AllowLock || CurrentItem.Asset.Extended && CurrentItem.Property && CurrentItem.Property.AllowLock !== false && CurrentItem.Asset.AllowLockType.indexOf(CurrentItem.Property.Type)>=0)) {
			InventoryLock(C, CurrentItem, ClickItem, Player.MemberNumber);
			IntroductionJobProgress("DomLock", ClickItem.Asset.Name, true);
			DialogItemToLock = null;
			DialogInventoryBuild(C);
			ChatRoomPublishAction(C, CurrentItem, ClickItem, true);
		}
		return;
	}

	// Cannot change item if the previous one is locked or blocked by another group
	if ((CurrentItem == null) || !InventoryItemHasEffect(CurrentItem, "Lock", true)) {
		if (!InventoryGroupIsBlocked(C, null, true) && (!InventoryGroupIsBlocked(C) || !ClickItem.Worn))
			if (InventoryAllow(C, ClickItem.Asset.Prerequisite) && InventoryChatRoomAllow(ClickItem.Asset.Category))
				if ((CurrentItem == null) || (CurrentItem.Asset.Name != ClickItem.Asset.Name)) {
					if (ClickItem.Asset.Wear) {

						// Check if selfbondage is allowed for the item if used on self
						if ((ClickItem.Asset.SelfBondage <= 0) || (SkillGetLevel(Player, "SelfBondage") >= ClickItem.Asset.SelfBondage) || (C.ID != 0) || DialogAlwaysAllowRestraint()) StruggleProgressStart(C, CurrentItem, ClickItem);
						else if (ClickItem.Asset.SelfBondage <= 10) DialogSetText("RequireSelfBondage" + ClickItem.Asset.SelfBondage);
						else DialogSetText("CannotUseOnSelf");

					} else {

						// The vibrating egg remote can open the vibrating egg's extended dialog
						if ((ClickItem.Asset.Name === "VibratorRemote" || ClickItem.Asset.Name === "LoversVibratorRemote") && DialogCanUseRemote(C, CurrentItem)) {
							DialogExtendItem(InventoryGet(C, C.FocusGroup.Name));
						}

						// Runs the activity arousal process if activated, & publishes the item action text to the chatroom
						DialogPublishAction(C, ClickItem);
						ActivityArousalItem(Player, C, ClickItem.Asset);

					}
				}
				else if ((CurrentItem.Asset.Name == ClickItem.Asset.Name) && CurrentItem.Asset.Extended)
					DialogExtendItem(CurrentItem);
		return;
	}

	// If the item can unlock another item or simply show dialog text (not wearable)
	if (InventoryAllow(C, ClickItem.Asset.Prerequisite))
		if (InventoryItemHasEffect(ClickItem, "Unlock-" + CurrentItem.Asset.Name))
			StruggleProgressStart(C, CurrentItem, null);
		else if ((CurrentItem.Asset.Name == ClickItem.Asset.Name) && CurrentItem.Asset.Extended)
			DialogExtendItem(CurrentItem);
		else if (!ClickItem.Asset.Wear)
			DialogPublishAction(C, ClickItem);

}

/**
 * Handles the click in the dialog screen
 * @returns {void} - Nothing
 */
function DialogClick() {

	// If the user clicked the Up button, move the character up to the top of the screen
	if ((CurrentCharacter.HeightModifier < -90 || CurrentCharacter.HeightModifier > 30) && (CurrentCharacter.FocusGroup != null) && MouseIn (510,50,90,90)) {
		CharacterAppearanceForceUpCharacter = CurrentCharacter.MemberNumber;
		CurrentCharacter.HeightModifier = 0;
		return;
	}


	if (DialogColor != null && CurrentCharacter.FocusGroup && InventoryGet(CurrentCharacter, CurrentCharacter.FocusGroup.Name) && MouseIn(1300, 25, 675, 950)) {
		return ItemColorClick(CurrentCharacter, CurrentCharacter.FocusGroup.Name, 1200, 25, 775, 950, true);
	}

	// If the user clicked on the interaction character or herself, we check to build the item menu
	if ((CurrentCharacter.AllowItem || (MouseX < 500)) && MouseIn(0,0,1000,1000) && ((CurrentCharacter.ID != 0) || (MouseX > 500)) && (DialogIntro() != "") && DialogAllowItemScreenException()) {
		DialogLeaveItemMenu();
		DialogLeaveFocusItem();
		var C = (MouseX < 500) ? Player : CurrentCharacter;
		let X = MouseX < 500 ? 0 : 500;
		for (let A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
				for (let Z = 0; Z < AssetGroup[A].Zone.length; Z++)
					if (DialogClickedInZone(C, AssetGroup[A].Zone[Z], 1, X, 0, C.HeightRatio)) {
						C.FocusGroup = AssetGroup[A];
						DialogItemToLock = null;
						DialogFocusItem = null;
						DialogInventoryBuild(C);
						DialogText = DialogTextDefault;
						break;
					}
	}

	// If the user clicked anywhere outside the current character item zones, ensure the position is corrected
	if (CharacterAppearanceForceUpCharacter == CurrentCharacter.MemberNumber && ((MouseX < 500) || (MouseX > 1000) || (CurrentCharacter.FocusGroup == null))) {
		CharacterAppearanceForceUpCharacter = -1;
		CharacterRefresh(CurrentCharacter, false, false);
	}

	// In activity mode, we check if the user clicked on an activity box
	if (DialogActivityMode && (StruggleProgress < 0 && !StruggleLockPickOrder) && (DialogColor == null) && ((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)))
		if ((MouseX >= 1000) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 1000)) {

			// For each activities in the list
			let X = 1000;
			let Y = 125;
			for (let A = DialogInventoryOffset; (A < DialogActivity.length) && (A < DialogInventoryOffset + 12); A++) {

				// If this specific activity is clicked, we run it
				if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275)) {
					IntroductionJobProgress("SubActivity", DialogActivity[A].MaxProgress.toString(), true);
					ActivityRun((Player.FocusGroup != null) ? Player : CurrentCharacter, DialogActivity[A]);
					return;
				}

				// Change the X and Y position to get the next square
				X = X + 250;
				if (X > 1800) {
					X = 1000;
					Y = Y + 300;
				}

			}

			// Exits and do not validate any more clicks
			return;

		}

	// In item menu mode VS text dialog mode
	if (((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)) && (DialogIntro() != "")) {

		// If we must are in the extended menu of the item
		if (DialogFocusItem != null)
			CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Click()");
		else {

			// If the user wants to speed up the add / swap / remove progress
			if ((MouseX >= 1000) && (MouseX < 2000) && (MouseY >= 400) && (MouseY < 1000) && (StruggleProgress >= 0)) StruggleClick(false);

			// If the user wants to pick a lock
			if ((MouseX >= 1000) && (MouseX < 2000) && (MouseY >= 200) && (MouseY < 1000) && (StruggleLockPickOrder)) {StruggleLockPickClick(CurrentCharacter); return;}

			// If the user wants to click on one of icons in the item menu
			if ((MouseX >= 1000) && (MouseX < 2000) && (MouseY >= 15) && (MouseY <= 105)) DialogMenuButtonClick();

			// If the user clicks on one of the items
			if ((MouseX >= 1000) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 1000) && ((DialogItemPermissionMode && (Player.FocusGroup != null)) || (Player.CanInteract() && !InventoryGroupIsBlocked((Player.FocusGroup != null) ? Player : CurrentCharacter, null, true))) && (StruggleProgress < 0 && !StruggleLockPickOrder) && (DialogColor == null)) {
				// For each items in the player inventory
				let X = 1000;
				let Y = 125;
				for (let I = DialogInventoryOffset; (I < DialogInventory.length) && (I < DialogInventoryOffset + 12); I++) {

					// If the item is clicked
					if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275))
						if (DialogInventory[I].Asset.Enable || (DialogInventory[I].Asset.Extended && DialogInventory[I].Asset.OwnerOnly && CurrentCharacter.IsOwnedByPlayer())) {
							DialogItemClick(DialogInventory[I]);
							break;
						}

					// Change the X and Y position to get the next square
					X = X + 250;
					if (X > 1800) {
						X = 1000;
						Y = Y + 300;
					}

				}
			}
		}

	} else {

		// If we need to leave the dialog (only allowed when there's an entry point to the dialog, not in the middle of a conversation)
		if ((DialogIntro() != "") && (DialogIntro() != "NOEXIT") && (MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110))
			DialogLeave();

		// If the user clicked on a text dialog option, we trigger it
		if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 100) && (MouseY <= 990) && (CurrentCharacter != null)) {
			var pos = 0;
			for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
				if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 250 + pos * 105)) {

						// If the player is gagged, the answer will always be the same
						if (!Player.CanTalk()) CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PlayerGagged");
						else CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;

						// A dialog option can change the conversation stage, show text or launch a custom function
						if ((Player.CanTalk() && CurrentCharacter.CanTalk()) || SpeechFullEmote(CurrentCharacter.Dialog[D].Option)) {
							CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;
							if (CurrentCharacter.Dialog[D].NextStage != null) CurrentCharacter.Stage = CurrentCharacter.Dialog[D].NextStage;
							if (CurrentCharacter.Dialog[D].Function != null) CommonDynamicFunctionParams(CurrentCharacter.Dialog[D].Function);
						} else if ((CurrentCharacter.Dialog[D].Function != null) && (CurrentCharacter.Dialog[D].Function.trim() == "DialogLeave()"))
							DialogLeave();
						break;

					}
					pos++;
				}
		}

	}

	// If the user clicked in the facial expression menu
	if ((CurrentCharacter != null) && (CurrentCharacter.ID == 0) && (MouseX >= 0) && (MouseX <= 500)) {
		if (MouseIn(420, 50, 90, 90) && DialogSelfMenuOptions.filter(SMO => SMO.IsAvailable()).length > 1) DialogFindNextSubMenu();
		if (!DialogSelfMenuSelected)
			DialogClickExpressionMenu();
		else
			DialogSelfMenuSelected.Click();
	}

}

/**
 * Returns whether the clicked co-ordinates are inside the asset zone
 * @param {Character} C - The character the click is on
 * @param {Array} Zone - The 4 part array of the rectangular asset zone on the character's body: [X, Y, Width, Height]
 * @param {number} Zoom - The amount the character has been zoomed
 * @param {number} X - The X co-ordinate of the click
 * @param {number} Y - The Y co-ordinate of the click
 * @param {number} HeightRatio - The displayed height ratio of the character
 * @returns {boolean} - If TRUE the click is inside the zone
 */
function DialogClickedInZone(C, Zone, Zoom, X, Y, HeightRatio) {
	let CZ = DialogGetCharacterZone(C, Zone, X, Y, Zoom, HeightRatio);
	return MouseIn(CZ[0], CZ[1], CZ[2], CZ[3]);
}

/**
 * Return the co-ordinates and dimensions of the asset group zone as it appears on screen
 * @param {Character} C - The character the zone is calculated for
 * @param {Array} Zone - The 4 part array of the rectangular asset zone: [X, Y, Width, Height]
 * @param {number} X - The starting X co-ordinate of the character's position
 * @param {number} Y - The starting Y co-ordinate of the character's position
 * @param {number} Zoom - The amount the character has been zoomed
 * @param {number} HeightRatio - The displayed height ratio of the character
 * @returns {Array} - The 4 part array of the displayed rectangular asset zone: [X, Y, Width, Height]
 */
function DialogGetCharacterZone(C, Zone, X, Y, Zoom, HeightRatio) {
	X += CharacterAppearanceXOffset(C, HeightRatio) * Zoom;
	Y += CharacterAppearanceYOffset(C, HeightRatio) * Zoom;
	Zoom *= HeightRatio;

	let Left = X + Zone[0] * Zoom;
	let Top = CharacterAppearsInverted(C) ? 1000 - (Y + (Zone[1] + Zone[3]) * Zoom) : Y + Zone[1] * Zoom;
	let Width = Zone[2] * Zoom;
	let Height = Zone[3] * Zoom;
	return [Left, Top, Width, Height];
}

/**
 * Finds and sets the next available character sub menu.
 * @returns {void} - Nothing
 */
function DialogFindNextSubMenu() {
	var CurrentIndex = DialogSelfMenuOptions.indexOf(DialogSelfMenuSelected);
	if (CurrentIndex == -1) CurrentIndex = 0;

	var NextIndex = CurrentIndex + 1 == DialogSelfMenuOptions.length ? 0 : CurrentIndex + 1;

	for (let SM = NextIndex; SM < DialogSelfMenuOptions.length; SM++) {
		if (DialogSelfMenuOptions[SM].IsAvailable()) {
			DialogSelfMenuSelected = DialogSelfMenuOptions[SM];
			return;
		}
		if (SM + 1 == DialogSelfMenuOptions.length) SM = -1;
	}
}

/**
 * Displays the given text for 5 seconds
 * @param {string} NewText - The text to be displayed
 * @returns {void} - Nothing
 */
function DialogSetText(NewText) {
	DialogTextDefaultTimer = CommonTime() + 5000;
	DialogText = DialogFindPlayer(NewText);
}

/**
 * Shows the extended item menue for a given item, if possible.
 * Therefore a dynamic function name is created and then called.
 * @param {Item} Item - The item the extended menu should be shown for
 * @param {Item} [SourceItem] - The source of the extended menu
 * @returns {void} - Nothing
 */
function DialogExtendItem(Item, SourceItem) {
	const C = CharacterGetCurrent();
	if (InventoryBlockedOrLimited(C, Item)) return;
	StruggleProgress = -1;
	StruggleLockPickOrder = null;
	DialogLockMenu = false;
	DialogColor = null;
	DialogFocusItem = Item;
	DialogFocusSourceItem = SourceItem;
	CommonDynamicFunction("Inventory" + Item.Asset.Group.Name + Item.Asset.Name + "Load()");
}

/**
 * Validates that the player is allowed to change the item color and swaps it on the fly
 * @param {Character} C - The player who wants to change the color
 * @param {string} Color - The new color in the format "#rrggbb"
 * @returns {void} - Nothing
 */
function DialogChangeItemColor(C, Color) {

	// Validates that the player isn't blind and can interact with the item
	if (!Player.CanInteract() || Player.IsBlind()) return;

	// If the item is locked, make sure the player could unlock it before swapping colors
	var Item = InventoryGet(C, C.FocusGroup.Name);
	if (Item == null) return;
	if (InventoryItemHasEffect(Item, "Lock", true) && !DialogCanUnlock(C, Item)) return;

	// Make sure the item is allowed, the group isn't blocked and it's not an enclosing item
	if (!InventoryAllow(C, Item.Asset.Prerequisite) || InventoryGroupIsBlocked(C)) return;
	if (InventoryItemHasEffect(Item, "Enclose", true) && (C.ID == 0)) return;

	// Apply the color & redraw the character after 100ms.  Prevent unnecessary redraws to reduce performance impact
	Item.Color = Color;
	clearTimeout(DialogFocusItemColorizationRedrawTimer);
	DialogFocusItemColorizationRedrawTimer = setTimeout(function () { CharacterAppearanceBuildCanvas(C); }, 100);

}

/**
 * Draw the activity selection dialog
 * @param {Character} C - The character for whom the activity selection dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function DialogDrawActivityMenu(C) {

	// Gets the default text that will reset after 5 seconds
	var SelectedGroup = (Player.FocusGroup != null) ? Player.FocusGroup.Description : CurrentCharacter.FocusGroup.Description;
	if (DialogTextDefault == "") DialogTextDefault = DialogFindPlayer("SelectActivityGroup").replace("GroupName", SelectedGroup.toLowerCase());
	if (DialogTextDefaultTimer < CommonTime()) DialogText = DialogTextDefault;

	// Draws the top menu text & icons
	if (DialogMenuButton == null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
	if (DialogMenuButton.length < 8) DrawTextWrap(DialogText, 1000, 0, 975 - DialogMenuButton.length * 110, 125, "White");
	for (let I = DialogMenuButton.length - 1; I >= 0; I--)
		DrawButton(1885 - I * 110, 15, 90, 90, "", "White", "Icons/" + DialogMenuButton[I] + ".png", DialogFindPlayer(DialogMenuButton[I]));

	// Prepares a 4x3 square selection with all activities in the buffer
	var X = 1000;
	var Y = 125;
	for (let A = DialogInventoryOffset; (A < DialogActivity.length) && (A < DialogInventoryOffset + 12); A++) {
		var Act = DialogActivity[A];
		var Hover = (MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275) && !CommonIsMobile;
		DrawRect(X, Y, 225, 275, (Hover) ? "cyan" : "white");
		DrawImageResize("Assets/" + C.AssetFamily + "/Activity/" + Act.Name + ".png", X + 2, Y + 2, 221, 221);
		DrawTextFit(ActivityDictionaryText("Activity" + Act.Name), X + 112, Y + 250, 221, "black");
		X = X + 250;
		if (X > 1800) {
			X = 1000;
			Y = Y + 300;
		}
	}

}

/**
 * Returns the button image name for a dialog menu button based on the button name.
 * @param {string} ButtonName - The menu button name
 * @param {Item} FocusItem - The focused item
 * @returns {string} - The button image name
 */
function DialogGetMenuButtonImage(ButtonName, FocusItem) {
	if (ButtonName === "ColorPick" || ButtonName === "ColorPickDisabled") {
		return ItemColorIsSimple(FocusItem) ? "ColorPick" : "MultiColorPick";
	} else if (ButtonName.endsWith("Disabled")) {
		return ButtonName.replace(/Disabled$/, "");
	} else {
		return ButtonName;
	}
}

/**
 * Returns the background color of a dialog menu button based on the button name.
 * @param {string} ButtonName - The menu button name
 * @returns {string} - The background color that the menu button should use
 */
function DialogGetMenuButtonColor(ButtonName) {
	if (ButtonName.endsWith("Disabled")) {
		return "#808080";
	}	else if (ButtonName === "ColorPick") {
		return DialogColorSelect || "#fff";
	} else {
		return "#fff";
	}
}

/**
 * Determines whether or not a given dialog menu button should be disabled based on the button name.
 * @param {string} ButtonName - The menu button name
 * @returns {boolean} - TRUE if the menu button should be disabled, FALSE otherwise
 */
function DialogIsMenuButtonDisabled(ButtonName) {
	return ButtonName.endsWith("Disabled");
}

/**
 * Draw the item menu dialog
 * @param {Character} C - The character for whom the activity selection dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function DialogDrawItemMenu(C) {

	const FocusItem = InventoryGet(C, C.FocusGroup.Name);

	if (DialogColor != null && FocusItem) {
		return ItemColorDraw(C, C.FocusGroup.Name, 1200, 25, 775, 950, true);
	}

	// Gets the default text that will reset after 5 seconds
	if (DialogTextDefault == "") DialogTextDefault = DialogFindPlayer("SelectItemGroup").replace("GroupName", C.FocusGroup.Description.toLowerCase());
	if (DialogTextDefaultTimer < CommonTime()) DialogText = DialogTextDefault;

	// Draws the top menu text & icons
	if (DialogMenuButton == null) DialogMenuButtonBuild(CharacterGetCurrent());
	if ((DialogColor == null) && Player.CanInteract() && (StruggleProgress < 0 && !StruggleLockPickOrder) && !InventoryGroupIsBlocked(C) && DialogMenuButton.length < 8) DrawTextWrap((!DialogItemPermissionMode) ? DialogText : DialogFind(Player, "DialogPermissionMode"), 1000, 0, 975 - DialogMenuButton.length * 110, 125, "White", null, 3);
	for (let I = DialogMenuButton.length - 1; I >= 0; I--) {
		const ButtonColor = DialogGetMenuButtonColor(DialogMenuButton[I]);
		const ButtonImage = DialogGetMenuButtonImage(DialogMenuButton[I], FocusItem);
		const ButtonHoverText = (DialogColor == null) ? DialogFindPlayer(DialogMenuButton[I]) : null;
		const ButtonDisabled = DialogIsMenuButtonDisabled(DialogMenuButton[I]);
		DrawButton(1885 - I * 110, 15, 90, 90, "", ButtonColor, "Icons/" + ButtonImage + ".png", ButtonHoverText, ButtonDisabled);
	}

	// Draws the color picker
	if (!FocusItem && DialogColor != null) {
		ElementPosition("InputColor", 1450, 65, 300);
		ColorPickerDraw(1300, 145, 675, 830, document.getElementById("InputColor"), function (Color) { DialogChangeItemColor(C, Color); });
		return;
	} else ColorPickerHide();

	// In item permission mode, the player can choose which item he allows other users to mess with.  Allowed items have a green background.  Disallowed have a red background. Limited have an orange background
	if ((DialogItemPermissionMode && (C.ID == 0) && (StruggleProgress < 0 && !StruggleLockPickOrder)) || (Player.CanInteract() && (StruggleProgress < 0 && !StruggleLockPickOrder) && !InventoryGroupIsBlocked(C, null, true))) {


		if (DialogInventory == null) DialogInventoryBuild(C);

		//If only activities are allowed, only add items to the DialogInventory, which can be used for interactions
		if (!DialogItemPermissionMode && InventoryGroupIsBlocked(C)) {
			var tempDialogInventory = [];
			for (let I = 0; I < DialogInventory.length; I++) {
				if ((DialogInventory[I].Asset.Name == "SpankingToys") && (C.FocusGroup.Name != "ItemHands")) tempDialogInventory.push(DialogInventory[I]);
			}
			if (tempDialogInventory.length > 0) {
				for (let I = 0; I < DialogInventory.length; I++) {
					if (DialogInventory[I].Worn) tempDialogInventory.push(DialogInventory[I]);
				}
			}
			DialogInventory = tempDialogInventory;
		}

		// Draw all possible items in that category (12 per screen)
		var X = 1000;
		var Y = 125;
		for (let I = DialogInventoryOffset; (I < DialogInventory.length) && (I < DialogInventoryOffset + 12); I++) {
			const Item = DialogInventory[I];
			const Hover = MouseIn(X, Y, 225, 275) && !CommonIsMobile;
			const Background = AppearanceGetPreviewImageColor(C, Item, Hover);
			const Vibrating = Item.Worn && InventoryItemHasEffect(InventoryGet(C, Item.Asset.Group.Name), "Vibrating", true);
			const Hidden = CharacterAppearanceItemIsHidden(Item.Asset.Name, Item.Asset.Group.Name);

			if (Hidden) DrawPreviewBox(X, Y, "Icons/HiddenItem.png", Item.Asset.DynamicDescription(Player), { Background });
			else DrawAssetPreview(X, Y, Item.Asset, { C: Player, Background, Vibrating });

			if (Item.Icon != "") DrawImage("Icons/" + Item.Icon + ".png", X + 2, Y + 110);
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}

		if (DialogInventory.length > 0) {
			if (!DialogItemPermissionMode && InventoryGroupIsBlocked(C)) DrawText(DialogFindPlayer("ZoneBlocked"), 1500, 700, "White", "Black");
			return;
		}
	}

	// If the player is progressing
	if (StruggleProgress >= 0) {
		StruggleDrawStruggleProgress(C);
		return;
	}
	// If the player is lockpicking
	if (StruggleLockPickOrder) {
		StruggleDrawLockpickProgress(C);
		return;
	}

	// If we must draw the current item from the group
	if (FocusItem != null) {
		const Vibrating = InventoryItemHasEffect(FocusItem, "Vibrating", true);
		DrawAssetPreview(1387, 250, FocusItem.Asset, { C, Vibrating });
	}

	// Show the no access text
	if (C.ID == 0 && DialogItemPermissionMode && Player.GetDifficulty() >= 3)
		DrawTextWrap(DialogFindPlayer("ExtremePermissionMode"), 1000, 550, 1000, 250, "White");
	else if (InventoryGroupIsBlocked(C)) DrawText(DialogFindPlayer("ZoneBlocked"), 1500, 700, "White", "Black");
	else if (DialogInventory.length > 0) DrawText(DialogFindPlayer("AccessBlocked"), 1500, 700, "White", "Black");
	else DrawText(DialogFindPlayer("NoItems"), 1500, 700, "White", "Black");

}

/**
 * Searches in the dialog for a specific stage keyword and returns that dialog option if we find it, error otherwise
 * @param {string} KeyWord - The key word to search for
 * @returns {string}
 */
function DialogFindPlayer(KeyWord) {
	const res = PlayerDialog.get(KeyWord);
	return res !== undefined ? res : `MISSING PLAYER DIALOG: ${KeyWord}`;
}

/**
 * Searches in the dialog for a specific stage keyword and returns that dialog option if we find it
 * @param {Character} C - The character whose dialog optio*
 * @param {string} KeyWord1 - The key word to search for
 * @param {string} [KeyWord2] - An optionally given second key word. is only looked for, if specified and the first
 * keyword was not found.
 * @param {boolean} [ReturnPrevious] - If specified, returns the previous dialog, if neither of the the two key words were found
 ns should be searched
 * @returns {string} - The name of a dialog. That can either be the one with the keyword or the previous dialog.
 * An empty string is returned, if neither keyword was found and no previous dialog was given.
 */
function DialogFind(C, KeyWord1, KeyWord2, ReturnPrevious) {
	for (let D = 0; D < C.Dialog.length; D++)
		if (C.Dialog[D].Stage == KeyWord1)
			return C.Dialog[D].Result.trim();
	if (KeyWord2 != null)
		for (let D = 0; D < C.Dialog.length; D++)
			if (C.Dialog[D].Stage == KeyWord2)
				return C.Dialog[D].Result.trim();
	return ((ReturnPrevious == null) || ReturnPrevious) ? C.CurrentDialog : "";
}

/**
 * Searches in the dialog for a specific stage keyword and returns that dialog option if we find it and replace the names
 * @param {Character} C - The character whose dialog options should be searched
 * @param {string} KeyWord1 - The key word to search for
 * @param {string} [KeyWord2] - An optionally given second key word. is only looked for, if specified and the first
 * keyword was not found.
 * @param {boolean} [ReturnPrevious] - If specified, returns the previous dialog, if neither of the the two key words were found
 * @returns {string} - The name of a dialog. That can either be the one with the keyword or the previous dialog.
 * An empty string is returned, if neither keyword was found and no previous dialog was given. 'SourceCharacter'
 * is replaced with the player's name and 'DestinationCharacter' with the current character's name.
 */
function DialogFindAutoReplace(C, KeyWord1, KeyWord2, ReturnPrevious) {
	return DialogFind(C, KeyWord1, KeyWord2, ReturnPrevious)
		.replace("SourceCharacter", Player.Name)
		.replace("DestinationCharacter", CharacterGetCurrent().Name);
}

/**
 * Draws the initial Dialog screen. That screen is entered, when the player clicks on herself or another player
 * @returns {void} - Nothing
 */
function DialogDraw() {
	if (ControllerActive == true) {
		ClearButtons();
	}
	// Draw both the player and the interaction character
	if (CurrentCharacter.ID != 0) DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(CurrentCharacter, 500, 0, 1);

	CharacterCheckHooks(C, true);

	// Draw the menu for facial expressions if the player clicked on herself
	if (CurrentCharacter.ID == 0) {
		if (DialogSelfMenuOptions.filter(SMO => SMO.IsAvailable()).length > 1 && !CommonPhotoMode) DrawButton(420, 50, 90, 90, "", "White", "Icons/Next.png", DialogFindPlayer("NextPage"));
		if (!DialogSelfMenuSelected)
			DialogDrawExpressionMenu();
		else
			DialogSelfMenuSelected.Draw();
	}

	// If we must show the item/inventory menu
	if (((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)) && (DialogIntro() != "")) {

		var C = CharacterGetCurrent();

		// The view can show one specific extended item or the list of all items for a group
		if (DialogFocusItem != null) {
			CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Draw()");
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		} else {
			if (DialogActivityMode) DialogDrawActivityMenu(C);
			else DialogDrawItemMenu(C);
		}

		// Draw a repositioning button if some zones are offscreen
		if (CurrentCharacter != null && CurrentCharacter.HeightModifier != null && CurrentCharacter.FocusGroup != null) {
			let drawButton = "";
			if (CurrentCharacter.HeightModifier < -90) {
				drawButton = "Icons/Up.png";
			} else if (CurrentCharacter.HeightModifier > 30) {
				drawButton = "Icons/Down.png";
			}
			if (drawButton) DrawButton(510, 50, 90, 90, "", "White", drawButton, DialogFindPlayer("ShowAllZones"));
		}

	} else {

		// Draws the intro text or dialog result
		if ((DialogIntro() != "") && (DialogIntro() != "NOEXIT")) {
			DrawTextWrap(SpeechGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -5, 840, 165, "white", null, 3);
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		} else DrawTextWrap(SpeechGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -5, 950, 165, "white", null, 3);

		// Draws the possible answers
		var pos = 0;
		for (let D = 0; D < CurrentCharacter.Dialog.length; D++)
			if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
				DrawTextWrap(SpeechGarble(Player, CurrentCharacter.Dialog[D].Option), 1025, 160 + 105 * pos, 950, 90, "black", ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 250 + pos * 105) && !CommonIsMobile) ? "cyan" : "white", 2);
				pos++;
			}

		// The more time you spend with an NPC, the more the love will rise
		NPCInteraction();

	}

}

/**
 * Draw the menu for changing facial expressions
 * @returns {void} - Nothing
 */
function DialogDrawExpressionMenu() {

	// Draw the expression groups
	DrawText(DialogFindPlayer("FacialExpression"), 165, 25, "White", "Black");
	if (typeof DialogFacialExpressionsSelected === 'number' && DialogFacialExpressionsSelected >= 0 && DialogFacialExpressionsSelected < DialogFacialExpressions.length && DialogFacialExpressions[DialogFacialExpressionsSelected].Appearance.Asset.Group.AllowColorize && DialogFacialExpressions[DialogFacialExpressionsSelected].Group !== "Eyes") {
		DrawButton(320, 50, 90, 90, "", "White", "Icons/ColorPick.png", DialogFindPlayer("ColorChange"));
	}
	DrawButton(220, 50, 90, 90, "", "White", "Icons/BlindToggle" + DialogFacialExpressionsSelectedBlindnessLevel + ".png", DialogFindPlayer("BlindToggleFacialExpressions"));
	const Expression = WardrobeGetExpression(Player);
	const Eye1Closed = Expression.Eyes === "Closed";
	const Eye2Closed = Expression.Eyes2 === "Closed";
	let WinkIcon = "WinkNone";
	if (Eye1Closed && Eye2Closed) WinkIcon = "WinkBoth";
	else if (Eye1Closed) WinkIcon = "WinkR";
	else if (Eye2Closed) WinkIcon = "WinkL";
	DrawButton(120, 50, 90, 90, "", "White", `Icons/${WinkIcon}.png`, DialogFindPlayer("WinkFacialExpressions"));
	DrawButton(20, 50, 90, 90, "", "White", "Icons/Reset.png", DialogFindPlayer("ClearFacialExpressions"));
	if (!DialogFacialExpressions || !DialogFacialExpressions.length) DialogFacialExpressionsBuild();
	for (let I = 0; I < DialogFacialExpressions.length; I++) {
		const FE = DialogFacialExpressions[I];
		const OffsetY = 185 + 100 * I;

		DrawButton(20, OffsetY, 90, 90, "", I == DialogFacialExpressionsSelected ? "Cyan" : "White", "Assets/Female3DCG/" + FE.Group + (FE.CurrentExpression ? "/" + FE.CurrentExpression : "") + "/Icon.png");

		// Draw the table with expressions
		if (I == DialogFacialExpressionsSelected) {
			for (let j = 0; j < FE.ExpressionList.length; j++) {
				const EOffsetX = 155 + 100 * (j % 3);
				const EOffsetY = 185 + 100 * Math.floor(j / 3);
				DrawButton(EOffsetX, EOffsetY, 90, 90, "", (FE.ExpressionList[j] == FE.CurrentExpression ? "Pink" : "White"), "Assets/Female3DCG/" + FE.Group + (FE.ExpressionList[j] ? "/" + FE.ExpressionList[j] : "") + "/Icon.png");
			}
		}
	}
}

/**
 * Handles clicks in the dialog expression menu.
 * @returns {void} - Nothing
 */
function DialogClickExpressionMenu() {
	if (MouseIn(20, 50, 90, 90)) {
		DialogFacialExpressions.forEach(FE => {
			let Color = null;
			if (FE.Appearance.Asset.Group.AllowColorize && FE.Group !== "Eyes" && FE.Group !== "Mouth") Color = "Default";
			CharacterSetFacialExpression(Player, FE.Group, null, null, Color);
			FE.CurrentExpression = null;
		});
		if (DialogExpressionColor != null) ItemColorSaveAndExit();
	} else if (MouseIn(120, 50, 90, 90)) {
		const CurrentExpression = DialogFacialExpressions.find(FE => FE.Group == "Eyes").CurrentExpression;
		const EyesExpression = WardrobeGetExpression(Player);
		const LeftEyeClosed = EyesExpression.Eyes2 === "Closed";
		const RightEyeClosed = EyesExpression.Eyes === "Closed";
		if (!LeftEyeClosed && !RightEyeClosed) CharacterSetFacialExpression(Player, "Eyes2", "Closed", null);
		else if (LeftEyeClosed && !RightEyeClosed) CharacterSetFacialExpression(Player, "Eyes", "Closed", null);
		else if (LeftEyeClosed && RightEyeClosed) CharacterSetFacialExpression(Player, "Eyes2", CurrentExpression !== "Closed" ? CurrentExpression : null, null);
		else CharacterSetFacialExpression(Player, "Eyes", CurrentExpression !== "Closed" ? CurrentExpression : null, null);
	} else if (MouseIn(220, 50, 90, 90)) {
		DialogFacialExpressionsSelectedBlindnessLevel += 1;
		if (DialogFacialExpressionsSelectedBlindnessLevel > 3)
			DialogFacialExpressionsSelectedBlindnessLevel = 1;
	} else if (MouseIn(320, 50, 90, 90)) {
		if (typeof DialogFacialExpressionsSelected === 'number' && DialogFacialExpressionsSelected >= 0 && DialogFacialExpressionsSelected < DialogFacialExpressions.length && DialogFacialExpressions[DialogFacialExpressionsSelected].Appearance.Asset.Group.AllowColorize && DialogFacialExpressions[DialogFacialExpressionsSelected].Group !== "Eyes") {
			const GroupName = DialogFacialExpressions[DialogFacialExpressionsSelected].Appearance.Asset.Group.Name;
			const Item = InventoryGet(Player, GroupName);
			const originalColor = Item.Color;
			Player.FocusGroup = AssetGroupGet(Player.AssetFamily, GroupName);
			DialogColor = "";
			DialogExpressionColor = "";
			ItemColorLoad(Player, Item, 1200, 25, 775, 950, true);
			ItemColorOnExit((save) => {
				DialogColor = null;
				DialogExpressionColor = null;
				Player.FocusGroup = null;
				if (save && !CommonColorsEqual(originalColor, Item.Color)) {
					ServerPlayerAppearanceSync();
					ChatRoomCharacterItemUpdate(Player, GroupName);
				}
			});
		}
	} else {
		// Expression category buttons
		for (let I = 0; I < DialogFacialExpressions.length; I++) {
			if (MouseIn(20, 185 + 100 * I, 90, 90)) {
				DialogFacialExpressionsSelected = I;
				if (DialogExpressionColor != null) ItemColorSaveAndExit();
			}
		}

		// Expression table
		if (DialogFacialExpressionsSelected >= 0 && DialogFacialExpressionsSelected < DialogFacialExpressions.length) {
			const FE = DialogFacialExpressions[DialogFacialExpressionsSelected];
			for (let j = 0; j < FE.ExpressionList.length; j++) {
				const EOffsetX = 155 + 100 * (j % 3);
				const EOffsetY = 185 + 100 * Math.floor(j / 3);
				if (MouseIn(EOffsetX, EOffsetY, 90, 90)) {
					CharacterSetFacialExpression(Player, FE.Group, FE.ExpressionList[j]);
					FE.CurrentExpression = FE.ExpressionList[j];
				}
			}
		}
	}
}

/**
 * Draws the pose sub menu
 * @returns {void} - Nothing
 */
function DialogDrawPoseMenu() {
	// Draw the pose groups
	DrawText(DialogFindPlayer("PoseMenu"), 250, 100, "White", "Black");

	if (!DialogActivePoses || !DialogActivePoses.length) DialogActivePoseMenuBuild();

	for (let I = 0; I < DialogActivePoses.length; I++) {
		var OffsetX = 140 + 140 * I;
		var PoseGroup = DialogActivePoses[I];

		for (let P = 0; P < PoseGroup.length; P++) {
			var OffsetY = 180 + 100 * P;
			var IsActive = false;

			if (typeof Player.ActivePose == "string" && Player.ActivePose == PoseGroup[P].Name)
				IsActive = true;
			else if (Array.isArray(Player.ActivePose)) {
				if (Player.ActivePose.includes(PoseGroup[P].Name))
					IsActive = true;
				else if (PoseGroup[P].Name == "BaseUpper" && !Player.ActivePose.map(Pose => PoseFemale3DCG.find(PP => PP.Name == Pose)).filter(Pose => Pose).find(Pose => Pose.Category == "BodyUpper" || Pose.Category == "BodyFull"))
					IsActive = true;
				else if (PoseGroup[P].Name == "BaseLower" && !Player.ActivePose.map(Pose => PoseFemale3DCG.find(PP => PP.Name == Pose)).filter(Pose => Pose).find(Pose => Pose.Category == "BodyLower" || Pose.Category == "BodyFull"))
					IsActive = true;
			}
			else if ((PoseGroup[P].Name == "BaseUpper" || PoseGroup[P].Name == "BaseLower") && Player.ActivePose == null)
				IsActive = true;
			DrawButton(OffsetX, OffsetY, 90, 90, "", !Player.CanChangeToPose(PoseGroup[P].Name) ? "#888" : IsActive ? "Pink" : "White", "Icons/Poses/" + PoseGroup[P].Name + ".png");
		}
	}
}

/**
 * Handles clicks in the pose sub menu
 * @returns {void} - Nothing
 */
function DialogClickPoseMenu() {
	for (let I = 0; I < DialogActivePoses.length; I++) {
		var OffsetX = 140 + 140 * I;
		var PoseGroup = DialogActivePoses[I];
		for (let P = 0; P < PoseGroup.length; P++) {
			var OffsetY = 180 + 100 * P;
			var IsActive = false;

			if (typeof Player.ActivePose == "string" && Player.ActivePose == PoseGroup[P].Name)
				IsActive = true;
			if (Array.isArray(Player.ActivePose) && Player.ActivePose.includes(PoseGroup[P].Name))
				IsActive = true;

			if (MouseIn(OffsetX, OffsetY, 90, 90) && !IsActive && Player.CanChangeToPose(PoseGroup[P].Name)) {
				CharacterSetActivePose(Player, PoseGroup[P].Name);
				if (CurrentScreen == "ChatRoom") ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
			}
		}
	}
}


/**
 * Sets the current character sub menu to the owner rules
 * @returns {void} - Nothing
 */
function DialogViewOwnerRules() {
	DialogSelfMenuSelected = DialogSelfMenuOptions.find(M => M.Name == "OwnerRules");
}

/**
 * Draws the owner rules sub menu
 * @returns {void} - Nothing
 */
function DialogDrawOwnerRulesMenu() {
	// Draw the pose groups
	DrawText(DialogFindPlayer("OwnerRulesMenu"), 230, 100, "White", "Black");

	var ToDisplay = [];

	if (LogQuery("BlockOwnerLockSelf", "OwnerRule")) ToDisplay.push({ Tag: "BlockOwnerLockSelf" });
	if (LogQuery("BlockChange", "OwnerRule")) ToDisplay.push({ Tag: "BlockChange", Value: LogValue("BlockChange", "OwnerRule") });
	if (LogQuery("BlockWhisper", "OwnerRule")) ToDisplay.push({ Tag: "BlockWhisper" });
	if (LogQuery("BlockKey", "OwnerRule")) ToDisplay.push({ Tag: "BlockKey" });
	if (LogQuery("BlockRemote", "OwnerRule")) ToDisplay.push({ Tag: "BlockRemote" });
	if (LogQuery("BlockRemoteSelf", "OwnerRule")) ToDisplay.push({ Tag: "BlockRemoteSelf" });
	if (LogQuery("ReleasedCollar", "OwnerRule")) ToDisplay.push({ Tag: "ReleasedCollar" });
	if (ToDisplay.length == 0) ToDisplay.push({ Tag: "Empty" });

	for (let I = 0; I < ToDisplay.length; I++) {
		var OffsetY = 230 + 100 * I;
		DrawText(DialogFindPlayer("OwnerRulesMenu" + ToDisplay[I].Tag) + (ToDisplay[I].Value ?  " " + TimerToString(ToDisplay[I].Value - CurrentTime) : ""), 250, OffsetY, "White", "Black");
	}
}

/**
 * Sets the skill ratio for the player, will be a % of effectiveness applied to the skill when using it.
 * This way a player can use only a part of her bondage or evasion skill.
 * @param {string} SkillType - The name of the skill to influence
 * @param {string} NewRatio - The ration of this skill that should be used
 * @returns {void} - Nothing
 */
function DialogSetSkillRatio(SkillType, NewRatio) {
	SkillSetRatio(SkillType, parseInt(NewRatio) / 100);
}

/**
 * Sends an room administrative command to the server for the chat room from the player dialog
 * @param {string} ActionType - The name of the administrative command to use
 * @param {string} Publish - Determines wether the action should be published to the ChatRoom. As this is a string, use "true" to do so
 * @returns {void} - Nothing
 */
function DialogChatRoomAdminAction(ActionType, Publish) {
	ChatRoomAdminAction(ActionType, Publish);
}

/**
 * Leave the dialog and revert back to a safe state, when the player uses her safe word
 * @returns {void} - Nothing
 */
function DialogChatRoomSafewordRevert() {
	DialogLeave();
	ChatRoomSafewordRevert();
}

/**
 * Leave the dialog and release the player of all restraints before returning them to the Main Lobby
 * @returns {void} - Nothing
 */
function DialogChatRoomSafewordRelease() {
	DialogLeave();
	ChatRoomSafewordRelease();
}
