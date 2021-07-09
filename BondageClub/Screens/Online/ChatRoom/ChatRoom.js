"use strict";
var ChatRoomBackground = "";
var ChatRoomData = {};
/** @type {Character[]} */
var ChatRoomCharacter = [];
var ChatRoomChatLog = [];
var ChatRoomLastMessage = [""];
var ChatRoomLastMessageIndex = 0;
var ChatRoomTargetMemberNumber = null;
var ChatRoomOwnershipOption = "";
var ChatRoomLovershipOption = "";
var ChatRoomPlayerCanJoin = false;
var ChatRoomPlayerJoiningAsAdmin = false;
var ChatRoomMoneyForOwner = 0;
var ChatRoomQuestGiven = [];
var ChatRoomSpace = "";
var ChatRoomGame = "";
var ChatRoomMoveTarget = null;
var ChatRoomHelpSeen = false;
var ChatRoomAllowCharacterUpdate = true;
var ChatRoomStruggleAssistBonus = 0;
var ChatRoomStruggleAssistTimer = 0;
var ChatRoomSlowtimer = 0;
var ChatRoomSlowStop = false;
var ChatRoomChatHidden = false;

var ChatRoomCharacterCount = 0;
var ChatRoomCharacterDrawlist = [];

var ChatRoomGetUpTimer = 0;
var ChatRoomLastName = "";
var ChatRoomLastBG = "";
var ChatRoomLastPrivate = false;
var ChatRoomLastSize = 0;
var ChatRoomLastDesc = "";
var ChatRoomLastAdmin = [];
var ChatRoomNewRoomToUpdate = null;
var ChatRoomNewRoomToUpdateTimer = 0;
var ChatRoomLeashList = [];
var ChatRoomLeashPlayer = null;
var ChatRoomTargetDirty = false;
// Chance of a chat message popping up reminding you of your plugs/crotch rope at 0 arousal. Chance is for each item, but only one message appears, with priority to ones with higher chance
const ChatRoomArousalMsg_Chance = {
	"Kneel" : 0.1,
	"Walk" : 0.33,
	"StruggleFail" : 0.4,
	"StruggleAction" : 0.05,
	"Gag" : 0,
};
const ChatRoomArousalMsg_ChanceScaling = {
	"Kneel" : 0.8,
	"Walk" : 0.67,
	"StruggleFail" : 0.4,
	"StruggleAction" : 0.2,
	"Gag" : 0,
};
const ChatRoomArousalMsg_ChanceVibeMod = {
	"Kneel" : 0.0,
	"Walk" : 0.8,
	"StruggleFail" : 0.6,
	"StruggleAction" : 0.3,
	"Gag" : 0,
};
const ChatRoomArousalMsg_ChanceInflationMod = {
	"Kneel" : 0.1,
	"Walk" : 0.5,
	"StruggleFail" : 0.4,
	"StruggleAction" : 0.2,
	"Gag" : 0,
};
const ChatRoomArousalMsg_ChanceGagMod = {
	"Kneel" : 0,
	"Walk" : 0,
	"StruggleFail" : 0,
	"StruggleAction" : 0,
	"Gag" : 0.3,
};
var ChatRoomPinkFlashTime = 0;
var ChatRoomHideIconState = 0;
var ChatRoomMenuButtons = [];
let ChatRoomFontSize = 30;
const ChatRoomFontSizes = {
	Small: 24,
	Medium: 30,
	Large: 36,
};

/**
 * Chat room resize manager object: Handles resize events for the chat log.
 * @constant
 * @type {object} - The chat room resize manager object. Contains the functions and properties required to handle
 *     resize events.
 */
let ChatRoomResizeManager = {
	atStart : true, // Is this the first event in a chain of resize events?
	timer : null, // Timer that triggers the end function after no resize events have been received recently.
	timeOut : 200, // The amount of milliseconds that has to pass before the chain of resize events is considered over and the timer is called.
	ChatRoomScrollPercentage : 0, // Height of the chat log scroll bar before the first resize event occurs, as a percentage.
	ChatLogScrolledToEnd : false, // Is the chat log scrolled all the way to the end before the first resize event occurs?

	// Triggered by resize event
	ChatRoomResizeEvent : function() {
		if(ChatRoomResizeManager.atStart) { // Run code for the first resize event in a chain of resize events.
			ChatRoomResizeManager.ChatRoomScrollPercentage = ElementGetScrollPercentage("TextAreaChatLog");
			ChatRoomResizeManager.ChatLogScrolledToEnd = ElementIsScrolledToEnd("TextAreaChatLog");
			ChatRoomResizeManager.atStart = false;
		}

		// Reset timer if an event was received recently.
		if (ChatRoomResizeManager.timer) clearTimeout(ChatRoomResizeManager.timer);
		ChatRoomResizeManager.timer = setTimeout(ChatRoomResizeManager.ChatRoomResizeEventsEnd, ChatRoomResizeManager.timeOut);
	},

	// Triggered by ChatRoomResizeManager.timer at the end of a chain of resize events
	ChatRoomResizeEventsEnd : function(){
		var TextAreaChatLog = document.getElementById("TextAreaChatLog");

		if (TextAreaChatLog != null) {
			// Scrolls to the position held before the resize events.
			if (ChatRoomResizeManager.ChatLogScrolledToEnd) ElementScrollToEnd("TextAreaChatLog"); // Prevents drift away from the end of the chat log.
			else TextAreaChatLog.scrollTop = (ChatRoomResizeManager.ChatRoomScrollPercentage * TextAreaChatLog.scrollHeight) - TextAreaChatLog.clientHeight;
		}
		ChatRoomResizeManager.atStart = true;
	},
};


/**
 * Checks if the player can add the current character to her whitelist.
 * @returns {boolean} - TRUE if the current character is not in the player's whitelist nor blacklist.
 */
function ChatRoomCanAddWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)); }
/**
 * Checks if the player can add the current character to her blacklist.
 * @returns {boolean} - TRUE if the current character is not in the player's whitelist nor blacklist.
 */
function ChatRoomCanAddBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)); }
/**
 * Checks if the player can remove the current character from her whitelist.
 * @returns {boolean} - TRUE if the current character is in the player's whitelist, but not her blacklist.
 */
function ChatRoomCanRemoveWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the player can remove the current character from her blacklist.
 * @returns {boolean} - TRUE if the current character is in the player's blacklist, but not her whitelist.
 */
function ChatRoomCanRemoveBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the player can add the current character to her friendlist
 * @returns {boolean} - TRUE if the current character is not in the player's friendlist yet.
 */
function ChatRoomCanAddFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) < 0)); }
/**
 * Checks if the player can remove the current character from her friendlist.
 * @returns {boolean} - TRUE if the current character is in the player's friendlist.
 */
function ChatRoomCanRemoveFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the player can add the current character to her ghostlist
 * @returns {boolean} - TRUE if the current character is not in the player's ghostlist yet.
 */
function ChatRoomCanAddGhost() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.GhostList.indexOf(CurrentCharacter.MemberNumber) < 0)); }
/**
 * Checks if the player can remove the current character from her ghostlist.
 * @returns {boolean} - TRUE if the current character is in the player's ghostlist.
 */
function ChatRoomCanRemoveGhost() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.GhostList.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the player can change the current character's clothes
 * @returns {boolean} - TRUE if the player can change the character's clothes and is allowed to.
 */
function ChatRoomCanChangeClothes() { return (Player.CanInteract() && (CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && CurrentCharacter.AllowItem && !CurrentCharacter.IsEnclose() && !((InventoryGet(CurrentCharacter, "ItemNeck") != null) && (InventoryGet(CurrentCharacter, "ItemNeck").Asset.Name == "ClubSlaveCollar"))); }
/**
 * Checks if the specified owner option is available.
 * @param {string} Option - The option to check for availability
 * @returns {boolean} - TRUE if the current ownership option is the specified one.
 */
function ChatRoomOwnershipOptionIs(Option) { return (Option == ChatRoomOwnershipOption); }
/**
 * Checks if the specified lover option is available.
 * @param {string} Option - The option to check for availability
 * @returns {boolean} - TRUE if the current lover option is the specified one.
 */
function ChatRoomLovershipOptionIs(Option) { return (Option == ChatRoomLovershipOption); }
/**
 * Checks if the player can take a drink from the current character's tray.
 * @returns {boolean} - TRUE if the current character is wearing a drinks tray and the player can interact.
 */
function ChatRoomCanTakeDrink() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (CurrentCharacter.ID != 0) && Player.CanInteract() && (InventoryGet(CurrentCharacter, "ItemMisc") != null) && (InventoryGet(CurrentCharacter, "ItemMisc").Asset.Name == "WoodenMaidTrayFull")); }
/**
 * Checks if the current character is owned by the player.
 * @returns {boolean} - TRUE if the current character is owned by the player.
 */
function ChatRoomIsCollaredByPlayer() { return ((CurrentCharacter != null) && (CurrentCharacter.Ownership != null) && (CurrentCharacter.Ownership.Stage == 1) && (CurrentCharacter.Ownership.MemberNumber == Player.MemberNumber)); }
/**
 * Checks if the current character is lover of the player.
 * @returns {boolean} - TRUE if the current character is lover of the player.
 */
function ChatRoomIsLoverOfPlayer() { return ((CurrentCharacter != null) && CurrentCharacter.GetLoversNumbers().includes(Player.MemberNumber)); }
/**
 * Checks if the current character can serve drinks.
 * @returns {boolean} - TRUE if the character is a maid and is free.
 */
function ChatRoomCanServeDrink() { return ((CurrentCharacter != null) && CurrentCharacter.CanWalk() && (ReputationCharacterGet(CurrentCharacter, "Maid") > 0) && CurrentCharacter.CanTalk()); }
/**
 * Checks if the player can give a money envelope to her owner
 * @returns {boolean} - TRUE if the current character is the owner of the player, and the player has the envelope
 */
function ChatRoomCanGiveMoneyForOwner() { return ((ChatRoomMoneyForOwner > 0) && (CurrentCharacter != null) && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (Player.Ownership.MemberNumber == CurrentCharacter.MemberNumber)); }
/**
 * Checks if the player is a chatroom admin.
 * @returns {boolean} - TRUE if the player is an admin of the current chatroom.
 */
function ChatRoomPlayerIsAdmin() { return ((ChatRoomData != null && ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(Player.MemberNumber) >= 0)); }
/**
 * Checks if the current character is an admin of the chatroom.
 * @returns {boolean} - TRUE if the current character is an admin.
 */
function ChatRoomCurrentCharacterIsAdmin() { return ((CurrentCharacter != null) && (ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(CurrentCharacter.MemberNumber) >= 0)); }
/**
 * Checks if the room allows the photograph feature to be used.
 * @returns {boolean} - TRUE if the player can take a photo.
 */
function ChatRoomCanTakePhotos() { return (ChatRoomData && ChatRoomData.BlockCategory && !ChatRoomData.BlockCategory.includes("Photos")) || !ChatRoomData; }

/**
 * Checks if the player can give the target character her high security keys.
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanGiveHighSecurityKeys() {
	if (Player.Appearance != null)
		for (let A = 0; A < Player.Appearance.length; A++)
			if (Player.Appearance[A].Asset && Player.Appearance[A].Property && InventoryGetLock(Player.Appearance[A]) && InventoryGetLock(Player.Appearance[A]).Asset.ExclusiveUnlock
			&& (Player.Appearance[A].Property.MemberNumberListKeys)
			&& (Player.Appearance[A].Property.MemberNumberListKeys
			&& CommonConvertStringToArray("" + Player.Appearance[A].Property.MemberNumberListKeys).indexOf(Player.MemberNumber) >= 0
			&& CommonConvertStringToArray("" + Player.Appearance[A].Property.MemberNumberListKeys).indexOf(CurrentCharacter.MemberNumber) < 0)) // Make sure you have a lock they dont have the keys to
				return true;
	return false;
}

/**
 * Checks if the player can give the target character her high security keys, while also removing the ones from her
 * possession
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanGiveHighSecurityKeysAll() {
	if (Player.Appearance != null)
		for (let A = 0; A < Player.Appearance.length; A++)
			if (Player.Appearance[A].Asset && Player.Appearance[A].Property && InventoryGetLock(Player.Appearance[A]) && InventoryGetLock(Player.Appearance[A]).Asset.ExclusiveUnlock
			&& (Player.Appearance[A].Property.MemberNumberListKeys || (!Player.Appearance[A].Property.MemberNumberListKeys && Player.Appearance[A].Property.LockMemberNumber == Player.MemberNumber))
			&& (!Player.Appearance[A].Property.MemberNumberListKeys
			|| (CommonConvertStringToArray("" + Player.Appearance[A].Property.MemberNumberListKeys).indexOf(Player.MemberNumber) >= 0))) // Make sure you have a lock they dont have the keys to
				return true;
	return false;
}

function ChatRoomGiveHighSecurityKeys() {
	var C = Player;
	if (C.Appearance != null)
		for (let A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset && C.Appearance[A].Property && InventoryGetLock(Player.Appearance[A]) && InventoryGetLock(Player.Appearance[A]).Asset.ExclusiveUnlock
			&& C.Appearance[A].Property.MemberNumberListKeys
			&& CommonConvertStringToArray("" + C.Appearance[A].Property.MemberNumberListKeys).indexOf(Player.MemberNumber) >= 0
			&& CommonConvertStringToArray("" + C.Appearance[A].Property.MemberNumberListKeys).indexOf(CurrentCharacter.MemberNumber) < 0) // Make sure you have a lock they dont have the keys to
				C.Appearance[A].Property.MemberNumberListKeys = C.Appearance[A].Property.MemberNumberListKeys + "," + CurrentCharacter.MemberNumber;
	CharacterRefresh(Player);
	ChatRoomCharacterUpdate(Player);
}
function ChatRoomGiveHighSecurityKeysAll() {
	var C = Player;
	if (C.Appearance != null)
		for (let A = 0; A < C.Appearance.length; A++)
			if (C.Appearance[A].Asset && C.Appearance[A].Property && InventoryGetLock(Player.Appearance[A]) && InventoryGetLock(Player.Appearance[A]).Asset.ExclusiveUnlock
			&& (C.Appearance[A].Property.MemberNumberListKeys || (!C.Appearance[A].Property.MemberNumberListKeys && C.Appearance[A].Property.LockMemberNumber == Player.MemberNumber))
			&& (!C.Appearance[A].Property.MemberNumberListKeys || (C.Appearance[A].Property.MemberNumberListKeys
			&& CommonConvertStringToArray("" + C.Appearance[A].Property.MemberNumberListKeys).indexOf(Player.MemberNumber) >= 0))) // Make sure you have a lock they dont have the keys to
			{
				if (C.Appearance[A].Property.MemberNumberListKeys) {
					var list = CommonConvertStringToArray("" + C.Appearance[A].Property.MemberNumberListKeys);

					if (list) {
						list = list.filter(x => x !== Player.MemberNumber);
						if (list.indexOf(CurrentCharacter.MemberNumber) < 0)
							list.push(CurrentCharacter.MemberNumber);
						C.Appearance[A].Property.MemberNumberListKeys = "" +
							CommonConvertArrayToString(list); // Convert to array and back; can only save strings on server
					}
				}
				C.Appearance[A].Property.LockMemberNumber = CurrentCharacter.MemberNumber;
			}
	CharacterRefresh(Player);
	ChatRoomCharacterUpdate(Player);
}



/**
 * Checks if the player can help the current character by giving them a lockpick
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanGiveLockpicks() {
	if (Player.CanInteract())
		for (let I = 0; I < Player.Inventory.length; I++)
			if (Player.Inventory[I].Name == "Lockpicks") {
				return true;
			}
	return false;
}
/**
 * Checks if the player can help the current character by giving her lockpicks
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanAssistStruggle() { return CurrentCharacter.AllowItem && !CurrentCharacter.CanInteract(); }
/**
 * Checks if the character options menu is available.
 * @returns {boolean} - Whether or not the player can interact with the target character
 */
function ChatRoomCanPerformCharacterAction() {
	return ChatRoomCanAssistStand() || ChatRoomCanAssistKneel() || ChatRoomCanAssistStruggle() || ChatRoomCanHoldLeash() || ChatRoomCanStopHoldLeash()
		|| ChatRoomCanTakePhotos() || ChatRoomCanGiveLockpicks() || ChatRoomCanGiveHighSecurityKeys() || ChatRoomCanGiveHighSecurityKeysAll();
}
/**
 * Checks if the target character can be helped back on her feet. This is different than CurrentCharacter.CanKneel()
 * because it listens for the current active pose and removes certain checks that are not required for someone else to
 * help a person kneel down.
 * @returns {boolean} - Whether or not the target character can stand
 */
function ChatRoomCanAssistStand() {
	return Player.CanInteract() && CurrentCharacter.AllowItem && CharacterItemsHavePoseAvailable(CurrentCharacter, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(CurrentCharacter, "Kneel") && CurrentCharacter.IsKneeling();
}
/**
 * Checks if the target character can be helped down on her knees. This is different than CurrentCharacter.CanKneel()
 * because it listens for the current active pose and removes certain checks that are not required for someone else to
 * help a person kneel down.
 * @returns {boolean} - Whether or not the target character can stand
 */

function ChatRoomCanAssistKneel() {
	return Player.CanInteract() && CurrentCharacter.AllowItem && CharacterItemsHavePoseAvailable(CurrentCharacter, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(CurrentCharacter, "Kneel") && !CurrentCharacter.IsKneeling();
}

/**
* Checks if the player character can attempt to stand up. This is different than CurrentCharacter.CanKneel() because it
* listens for the current active pose, but it forces the player to do a minigame.
 * @returns {boolean} - Whether or not the player character can stand
 */
function ChatRoomCanAttemptStand() { return CharacterItemsHavePoseAvailable(Player, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(Player, "Kneel") && Player.IsKneeling();}
/**
 * Checks if the player character can attempt to get down on her knees. This is different than
 * CurrentCharacter.CanKneel() because it listens for the current active pose, but it forces the player to do a
 * minigame.
 * @returns {boolean} - Whether or not the player character can stand
 */
function ChatRoomCanAttemptKneel() { return CharacterItemsHavePoseAvailable(Player, "BodyLower", "Kneel") && !CharacterDoItemsSetPose(Player, "Kneel") && !Player.IsKneeling(); }

/**
 * Checks if the player can stop the current character from leaving.
 * @returns {boolean} - TRUE if the current character is slowed down and can be interacted with.
 */
function ChatRoomCanStopSlowPlayer() { return (CurrentCharacter.IsSlow() && Player.CanInteract() && CurrentCharacter.AllowItem ); }
/**
 * Checks if the player can grab the targeted player's leash
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanHoldLeash() { return CurrentCharacter.AllowItem && Player.CanInteract() && CurrentCharacter.OnlineSharedSettings && CurrentCharacter.OnlineSharedSettings.AllowPlayerLeashing != false && ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) < 0
	&& ChatRoomCanBeLeashed(CurrentCharacter);}
/**
 * Checks if the player can let go of the targeted player's leash
 * @returns {boolean} - TRUE if the player can interact and is allowed to interact with the current character.
 */
function ChatRoomCanStopHoldLeash() {
	if (CurrentCharacter.AllowItem && Player.CanInteract() && CurrentCharacter.OnlineSharedSettings && CurrentCharacter.OnlineSharedSettings.AllowPlayerLeashing != false && ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) >= 0) {
		if (ChatRoomCanBeLeashed(CurrentCharacter)) {
			return true;
		} else {
			ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber), 1);
		}
	}
	return false;
}
/**
 * Checks if the targeted player is a valid leash target
 * @returns {boolean} - TRUE if the player can be leashed
 */
function ChatRoomCanBeLeashed(C) {
	return ChatRoomCanBeLeashedBy(Player.MemberNumber, C);
}

/**
 * Checks if the targeted player is a valid leash target for the source member number
 * @param {number} sourceMemberNumber - Member number of the source player
 * @param {Character} C - Target player
 * @returns {boolean} - TRUE if the player can be leashed
 */
function ChatRoomCanBeLeashedBy(sourceMemberNumber, C) {
	if ((ChatRoomData && ChatRoomData.BlockCategory.indexOf("Leashing") < 0) || !ChatRoomData) {
		// Have to not be tethered, and need a leash
		var canLeash = false;
		var isTrapped = false;
		var neckLock = null;
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Family == C.AssetFamily)) {
				if (InventoryItemHasEffect(C.Appearance[A], "Leash", true)) {
					canLeash = true;
					if (C.Appearance[A].Asset.Group.Name == "ItemNeckRestraints")
						neckLock = InventoryGetLock(C.Appearance[A]);
				} else if (InventoryItemHasEffect(C.Appearance[A], "Tethered", true) || InventoryItemHasEffect(C.Appearance[A], "Mounted", true) || InventoryItemHasEffect(C.Appearance[A], "Enclose", true) || InventoryItemHasEffect(C.Appearance[A], "OneWayEnclose", true)){
					isTrapped = true;
				}
			}

		if (canLeash && !isTrapped) {
			if (sourceMemberNumber == 0 || !neckLock || (!neckLock.Asset.OwnerOnly && !neckLock.Asset.LoverOnly) ||
				(neckLock.Asset.OwnerOnly && C.IsOwnedByMemberNumber(sourceMemberNumber)) ||
				(neckLock.Asset.LoverOnly && C.IsLoverOfMemberNumber(sourceMemberNumber))) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Checks if the player has waited long enough to be able to call the maids
 * @returns {boolean} - TRUE if the current character has been in the last chat room for more than 30 minutes
 */
function DialogCanCallMaids() { return (CurrentScreen == "ChatRoom" && (ChatRoomData && ChatRoomData.Game == "" && !(LogValue("Committed", "Asylum") >= CurrentTime)) &&  !Player.CanWalk()) && !MainHallIsMaidsDisabled();}


/**
 * Checks if the player has waited long enough to be able to call the maids
 * @returns {boolean} - TRUE if the current character has been in the last chat room for more than 30 minutes
 */
function DialogCanCallMaidsPunishmentOn() { return (DialogCanCallMaids() && (!Player.RestrictionSettings || !Player.RestrictionSettings.BypassNPCPunishments));}


/**
 * Checks if the player has waited long enough to be able to call the maids
 * @returns {boolean} - TRUE if the current character has been in the last chat room for more than 30 minutes
 */
function DialogCanCallMaidsPunishmentOff() { return (DialogCanCallMaids() && Player.RestrictionSettings && Player.RestrictionSettings.BypassNPCPunishments);}



/**
 * Creates the chat room input elements.
 * @returns {void} - Nothing.
 */
function ChatRoomCreateElement() {
	// Creates the chat box
	if (document.getElementById("InputChat") == null) {
		ElementCreateTextArea("InputChat");
		document.getElementById("InputChat").setAttribute("maxLength", 1000);
		document.getElementById("InputChat").setAttribute("autocomplete", "off");
		ElementFocus("InputChat");
	} else if (document.getElementById("InputChat").style.display == "none") ElementFocus("InputChat");

	// Creates the chat log
	if (document.getElementById("TextAreaChatLog") == null) {

		// Sets the size and position
		ElementCreateDiv("TextAreaChatLog");
		ElementPositionFix("TextAreaChatLog", ChatRoomFontSize, 1005, 5, 988, 859);
		ElementScrollToEnd("TextAreaChatLog");
		ChatRoomRefreshChatSettings();

		// If we relog, we reload the previous chat log
		if (RelogChatLog != null) {
			while (RelogChatLog.children.length > 0)
				document.getElementById("TextAreaChatLog").appendChild(RelogChatLog.children[0]);
			ElementValue("InputChat", RelogInputText);
			RelogChatLog = null;
			RelogInputText = "";
		} else ElementContent("TextAreaChatLog", "");

		// Creates listener for resize events.
		window.addEventListener("resize", ChatRoomResizeManager.ChatRoomResizeEvent);

	} else if (document.getElementById("TextAreaChatLog").style.display == "none") {
		setTimeout(() => ElementScrollToEnd("TextAreaChatLog"), 100);
		ChatRoomRefreshChatSettings();
	}

}

/**
 * Loads the chat room screen by displaying the proper inputs.
 * @returns {void} - Nothing.
 */
function ChatRoomLoad() {
	ElementRemove("InputSearch");
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ChatRoomRefreshFontSize();
	ChatRoomCreateElement();
	ChatRoomCharacterUpdate(Player);
	ActivityChatRoomArousalSync(Player);
	if (!ChatRoomData || ChatRoomData.Name !== Player.LastChatRoom) {
		ChatRoomHideIconState = 0;
	}
	ChatRoomMenuBuild();
}

/**
 * Removes all elements that can be open in the chat room
*/
function ChatRoomClearAllElements() {
	// Dialog
	DialogLeave();
	
	// Friendlist
	ElementRemove("FriendList");
	FriendListBeepMenuClose();
	FriendListModeIndex = 0;

	// Admin
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ElementRemove("InputAdminList");
	ElementRemove("InputBanList");
	ElementRemove("InputBackground");
	ElementRemove("TagDropDown");

	// Chatroom
	ElementRemove("InputChat");
	ElementRemove("TextAreaChatLog");

	// Preferences
	ElementRemove("InputEmailOld");
	ElementRemove("InputEmailNew");
	ElementRemove("InputCharacterLabelColor");
	PreferenceSubscreen = "";

	// Profile
	ElementRemove("DescriptionInput");

	// Wardrobe
	ElementRemove("InputWardrobeName");
	CharacterAppearanceMode = "";

	// Listeners
	window.removeEventListener("resize", ChatRoomResizeManager.ChatRoomResizeEvent);
}

/**
 * Starts the chatroom selection screen.
 * @param {string} Space - Name of the chatroom space
 * @param {string} Game - Name of the chatroom game to play
 * @param {string} LeaveRoom - Name of the room to go too when exiting chatsearch.
 * @param {string} Background - Name of the background to use in chatsearch.
 * @param {Array} BackgroundTagList - List of available backgrounds in the chatroom space.
 * @returns {void} - Nothing.
 */
function ChatRoomStart(Space, Game, LeaveRoom, Background, BackgroundTagList) {
	ChatRoomSpace = Space;
	ChatRoomGame = Game;
	ChatSearchLeaveRoom = LeaveRoom;
	ChatSearchBackground = Background;
	ChatCreateBackgroundList = BackgroundsGenerateList(BackgroundTagList);
	BackgroundSelectionTagList = BackgroundTagList;
	CommonSetScreen("Online", "ChatSearch");

}

/**
 * Create the list of chat room menu buttons
 * @returns {void} - Nothing
 */
function ChatRoomMenuBuild() {
	ChatRoomMenuButtons = [];
	ChatRoomMenuButtons.push("Exit");
	if (ChatRoomGame === "") ChatRoomMenuButtons.push("Cut");
	else ChatRoomMenuButtons.push("GameOption");
	ChatRoomMenuButtons.push("Kneel", "Icons");
	if (ChatRoomCanTakePhotos()) ChatRoomMenuButtons.push("Camera");
	ChatRoomMenuButtons.push("Dress", "Profile", "Admin");
}

/**
 * Checks if the player's owner is inside the chatroom.
 * @returns {boolean} - Returns TRUE if the player's owner is inside the room.
 */
function ChatRoomOwnerInside() {
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (Player.Ownership.MemberNumber == ChatRoomCharacter[C].MemberNumber)
			return true;
	return false;
}


/**
 * Updates the temporary drawing arrays for characters, to handle things that are dependent on the drawn chat room
 * characters rather than the ones actually present
 * @returns {void} - Nothing
 */

function ChatRoomUpdateDisplay() {
	// The number of characters to show in the room
	const RenderSingle = Player.GameplaySettings.SensDepChatLog == "SensDepExtreme" && Player.GetBlindLevel() >= 3 && !Player.Effect.includes("VRAvatars");
	ChatRoomCharacterDrawlist = ChatRoomCharacter;
	if (Player.Effect.includes("VRAvatars")) {
		ChatRoomCharacterDrawlist = [];
		for (let CC = 0; CC < ChatRoomCharacter.length; CC++) {
			if (ChatRoomCharacter[CC].Effect.includes("VRAvatars")) {
				ChatRoomCharacterDrawlist.push(ChatRoomCharacter[CC]);
			}
		}
	} else if (Player.GetBlindLevel() > 0 && Player.GetBlindLevel() < 3 && Player.ImmersionSettings.BlindAdjacent) {
		// We hide all players except those who are adjacent
		ChatRoomCharacterDrawlist = [];
		let PlayerIndex = -1;
		// First find the player index
		for (let CC = 0; CC < ChatRoomCharacter.length; CC++) {
			if (ChatRoomCharacter[CC].ID == 0) {
				PlayerIndex = CC;
				break;
			}
		}
		// Then filter the characters
		for (let CC = 0; CC < ChatRoomCharacter.length; CC++) {
			if (Math.abs(CC - PlayerIndex) <= 1) {
				ChatRoomCharacterDrawlist.push(ChatRoomCharacter[CC]);
			}
		}
	}

	ChatRoomCharacterCount = RenderSingle ? 1 : ChatRoomCharacterDrawlist.length;
}

/**
 * Draws the chatroom characters.
 * @param {boolean} DoClick - Whether or not a click was registered.
 * @returns {void} - Nothing.
 */
function ChatRoomDrawCharacter(DoClick) {
	// Intercepts the online game chat room clicks if we need to
	if (DoClick && OnlineGameClick()) return;

	// The darkness factors varies with blindness level (1 is bright, 0 is pitch black)
	let DarkFactor = CharacterGetDarkFactor(Player);

	// Check if we should use a custom background
	const CustomBG = !DoClick ? DrawGetCustomBackground() : "";
	const Background = CustomBG || ChatRoomData.Background;
	if (CustomBG && (DarkFactor === 0.0 || Player.GameplaySettings.SensDepChatLog == "SensDepLight")) DarkFactor = CharacterGetDarkFactor(Player, true);

	// Determine the horizontal & vertical position and zoom levels to fit all characters evenly in the room
	const Space = ChatRoomCharacterCount >= 2 ? 1000 / Math.min(ChatRoomCharacterCount, 5) : 500;
	const Zoom = ChatRoomCharacterCount >= 3 ? Space / 400 : 1;
	const X = ChatRoomCharacterCount >= 3 ? (Space - 500 * Zoom) / 2 : 0;
	const Y = ChatRoomCharacterCount <= 5 ? 1000 * (1 - Zoom) / 2 : 0;
	const InvertRoom = Player.GraphicsSettings.InvertRoom && Player.IsInverted();

	// Draw the background
	if (!DoClick) {
		ChatRoomDrawBackground(Background, Y, Zoom, DarkFactor, InvertRoom);
	}

	// Draw the characters (in click mode, we can open the character menu or start whispering to them)
	for (let C = 0; C < ChatRoomCharacterDrawlist.length; C++) {
		const CharX = ChatRoomCharacterCount == 1 ? 0 : X + (C % 5) * Space;
		const CharY = ChatRoomCharacterCount == 1 ? 0 : Y + Math.floor(C / 5) * 500;
		if (ChatRoomCharacterCount == 1 && ChatRoomCharacterDrawlist[C].ID !== 0) { // Only render the player!
			continue;
		}
		if (DoClick) {
			if (MouseIn(CharX, CharY, Space, 1000 * Zoom)) {
				return ChatRoomClickCharacter(ChatRoomCharacterDrawlist[C], CharX, CharY, Zoom, (MouseX - CharX) / Zoom, (MouseY - CharY) / Zoom, C);
			}
		} else {
			// Draw the background a second time for characters 6 to 10 (we do it here to correct clipping errors from the first part)
			if (C === 5) {
				ChatRoomDrawBackground(Background, 500, Zoom, DarkFactor, InvertRoom);
			}

			// Draw the character
			DrawCharacter(ChatRoomCharacterDrawlist[C], CharX, CharY, Zoom);

			// Draw the character overlay
			if (ChatRoomCharacterDrawlist[C].MemberNumber != null) {
				ChatRoomDrawCharacterOverlay(ChatRoomCharacterDrawlist[C], CharX, CharY, Zoom, C);
			}
		}
	}
}

/**
 * Draw the background of a chat room
 * @param {string} Background - The name of the background image file
 * @param {number} Y - The starting Y co-ordinate of the image
 * @param {number} Zoom - The zoom factor based on the number of characters
 * @param {number} DarkFactor - The value (0 = fully visible, 1 = black) to tint the background
 * @param {boolean} InvertRoom - Whether the background image should be inverted
 * @returns {void} - Nothing
 */
function ChatRoomDrawBackground(Background, Y, Zoom, DarkFactor, InvertRoom) {
	if (DarkFactor > 0) {
		// Draw the zoomed background
		DrawImageZoomCanvas("Backgrounds/" + Background + ".jpg", MainCanvas, 500 * (2 - 1 / Zoom), 0, 1000 / Zoom, 1000, 0, Y, 1000, 1000 * Zoom, InvertRoom);

		// Draw an overlay if the character is partially blinded
		if (DarkFactor < 1.0) {
			DrawRect(0, Y, 1000, 1000 - Y, "rgba(0,0,0," + (1.0 - DarkFactor) + ")");
		}
	}
}

/**
 * Draws any overlays on top of character
 * @param {Character} C The target character
 * @param {number} CharX Character's X position on canvas
 * @param {number} CharY Character's Y position on canvas
 * @param {number} Zoom Room zoom
 * @param {number} Pos Index of target character
 */
function ChatRoomDrawCharacterOverlay(C, CharX, CharY, Zoom, Pos) {
	// Draw the ghostlist/friendlist, whitelist/blacklist, admin icons
	if (ChatRoomHideIconState == 0) {
		if (Player.WhiteList.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/WhiteList.png", CharX + 75 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		} else if (Player.BlackList.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/BlackList.png", CharX + 75 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		}
		if (Array.isArray(ChatRoomData.Admin) && ChatRoomData.Admin.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/Admin.png", CharX + 125 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		}
		// Warning icon when game versions don't match
		if (C.OnlineSharedSettings && C.OnlineSharedSettings.GameVersion !== GameVersion) {
			DrawImageResize("Icons/Small/Warning.png", CharX + 325 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		}
		if (Player.GhostList.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/GhostList.png", CharX + 375 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		} else if (Player.FriendList.includes(C.MemberNumber)) {
			DrawImageResize("Icons/Small/FriendList.png", CharX + 375 * Zoom, CharY, 50 * Zoom, 50 * Zoom);
		}
	}

	if (ChatRoomTargetMemberNumber == C.MemberNumber && ChatRoomHideIconState <= 1) {
		DrawImage("Icons/Small/Whisper.png", CharX + 75 * Zoom, CharY + 950 * Zoom);
	}

	if (ChatRoomMoveTarget !== null) {
		const MoveTargetPos = ChatRoomCharacter.findIndex(c => c.MemberNumber === ChatRoomMoveTarget);
		if (MoveTargetPos < 0) {
			ChatRoomMoveTarget = null;
		} else {
			if (ChatRoomMoveTarget === C.MemberNumber) {
				DrawButton(CharX + 200 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom, "", "White");
				DrawImageResize("Icons/Remove.png", CharX + 202 * Zoom, CharY + 752 * Zoom, 86 * Zoom, 86 * Zoom);
			} else {
				if (Pos < MoveTargetPos) {
					DrawButton(CharX + 100 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom, "", "White");
					DrawImageResize("Icons/Here.png", CharX + 102 * Zoom, CharY + 752 * Zoom, 86 * Zoom, 86 * Zoom);
				}
				DrawButton(CharX + 200 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom, "", "White");
				DrawImageResize("Icons/Swap.png", CharX + 202 * Zoom, CharY + 752 * Zoom, 86 * Zoom, 86 * Zoom);
				if (Pos > MoveTargetPos) {
					DrawButton(CharX + 300 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom, "", "White");
					DrawImageResize("Icons/Here.png", CharX + 302 * Zoom, CharY + 752 * Zoom, 86 * Zoom, 86 * Zoom);
				}
			}
		}
	}
}

/**
 * Called when character is clicked
 * @param {Character} C The target character
 * @param {number} CharX Character's X position on canvas
 * @param {number} CharY Character's Y position on canvas
 * @param {number} Zoom Room zoom
 * @param {number} ClickX Click X postion relative to character, without zoom
 * @param {number} ClickY Click Y postion relative to character, without zoom
 * @param {number} Pos Index of target character
 */
function ChatRoomClickCharacter(C, CharX, CharY, Zoom, ClickX, ClickY, Pos) {

	// Click on name
	if (ClickY > 900) {
		// Clicking on self or current target removes whisper target
		if (C.ID === 0 || ChatRoomTargetMemberNumber === C.MemberNumber) {
			ChatRoomSetTarget(null);
			return;
		}
		// BlockWhisper rule, if owner is in chatroom
		if (LogQuery("BlockWhisper", "OwnerRule") && Player.Ownership && Player.Ownership.Stage === 1 && Player.Ownership.MemberNumber !== C.MemberNumber && ChatRoomOwnerInside()) {
			return;
		}
		// Sensory deprivation setting: Total (no whispers) blocks whispers while blind unless both players are in the virtual realm. Then they can text each other.
		if (Player.GameplaySettings.SensDepChatLog === "SensDepExtreme" && Player.GetBlindLevel() >= 3 && !(Player.Effect.includes("VRAvatars") && C.Effect.includes("VRAvatars"))) {
			return;
		}
		ChatRoomSetTarget(C.MemberNumber);
		return;
	}

	// Moving character inside room
	if (ChatRoomMoveTarget !== null) {
		const MoveTargetPos = ChatRoomCharacter.findIndex(c => c.MemberNumber === ChatRoomMoveTarget);
		if (MoveTargetPos < 0) {
			ChatRoomMoveTarget = null;
		} else {
			if (Pos < MoveTargetPos && MouseIn(CharX + 100 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom)) {
				// Move left
				for (let i = 0; i < MoveTargetPos - Pos; i++) {
					ServerSend("ChatRoomAdmin", {
						MemberNumber: ChatRoomMoveTarget,
						Action: "MoveLeft",
						Publish: i === 0
					});
				}
				ChatRoomMoveTarget = null;
			} else if (MouseIn(CharX + 200 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom)) {
				// Swap or cancel
				if (ChatRoomMoveTarget !== C.MemberNumber) {
					ServerSend("ChatRoomAdmin", {
						MemberNumber: Player.ID,
						TargetMemberNumber: ChatRoomMoveTarget,
						DestinationMemberNumber: C.MemberNumber,
						Action: "Swap"
					});
				}
				ChatRoomMoveTarget = null;
			} else if ( Pos > MoveTargetPos && MouseIn(CharX + 300 * Zoom, CharY + 750 * Zoom, 90 * Zoom, 90 * Zoom)) {
				// Move right
				for (let i = 0; i < Pos - MoveTargetPos; i++) {
					ServerSend("ChatRoomAdmin", {
						MemberNumber: ChatRoomMoveTarget,
						Action: "MoveRight",
						Publish: i === 0
					});
				}
				ChatRoomMoveTarget = null;
			}
			return;
		}
	}

	// Disable examining when blind setting. If both players are in the virtual realm, then they can examine each other.
	if (Player.GameplaySettings.BlindDisableExamine && !(Player.Effect.includes("VRAvatars") && C.Effect.includes("VRAvatars")) && C.ID !== 0 && Player.GetBlindLevel() >= 3) {
		return;
	}

	// If the arousal meter is shown for that character, we can interact with it
	if (C.ArousalSettings && ["Manual", "Hybrid", "Automatic"].includes(C.ArousalSettings.Active)) {
		let MeterShow = C.ID === 0;
		if (C.ID !== 0 && Player.ArousalSettings.ShowOtherMeter && C.ArousalSettings) {
			if (C.ArousalSettings.Visible === "Access") {
				MeterShow = C.AllowItem;
			} else if (C.ArousalSettings.Visible === "All") {
				MeterShow = true;
			}
		}
		if (MeterShow) {
			// The arousal meter can be maximized or minimized by clicking on it
			if (MouseIn(CharX + 60 * Zoom, CharY + 400 * Zoom, 80 * Zoom, 100 * Zoom) && !C.ArousalZoom) { C.ArousalZoom = true; return; }
			if (MouseIn(CharX + 50 * Zoom, CharY + 615 * Zoom, 100 * Zoom, 85 * Zoom) && C.ArousalZoom) { C.ArousalZoom = false; return; }

			// If the player can manually control her arousal, we set the progress manual and change the facial expression, it can trigger an orgasm at 100%
			if (C.ID === 0 && MouseIn(CharX + 50 * Zoom, CharY + 200 * Zoom, 100 * Zoom, 500 * Zoom) && C.ArousalZoom) {
				if (Player.ArousalSettings.Active === "Manual" || Player.ArousalSettings.Active === "Hybrid") {
					var Arousal = Math.round((CharY + 625 * Zoom - MouseY) / (4 * Zoom));
					ActivitySetArousal(Player, Arousal);
					if (Player.ArousalSettings.AffectExpression) ActivityExpression(Player, Player.ArousalSettings.Progress);
					if (Player.ArousalSettings.Progress == 100) ActivityOrgasmPrepare(Player);
				}
				return;
			}

			// Don't do anything if the thermometer is clicked without access to it
			if (MouseIn(CharX + 50 * Zoom, CharY + 200 * Zoom, 100 * Zoom, 415 * Zoom) && C.ArousalZoom) return;
		}
	}

	// Intercepts the online game character clicks if we need to
	if (OnlineGameClickCharacter(C)) return;

	// Gives focus to the character
	document.getElementById("InputChat").style.display = "none";
	document.getElementById("TextAreaChatLog").style.display = "none";
	ChatRoomChatHidden = true;
	ChatRoomBackground = ChatRoomData.Background;
	C.AllowItem = C.ID === 0 || ServerChatRoomGetAllowItem(Player, C);
	ChatRoomOwnershipOption = "";
	ChatRoomLovershipOption = "";
	if (C.ID !== 0) ServerSend("ChatRoomAllowItem", { MemberNumber: C.MemberNumber });
	if (C.IsOwnedByPlayer() || C.IsLoverOfPlayer()) ServerSend("ChatRoomChat", { Content: "RuleInfoGet", Type: "Hidden", Target: C.MemberNumber });
	CharacterSetCurrent(C);
}

/**
 * Sends the request to the server to check the current character's relationship status.
 * @returns {void} - Nothing.
 */
function ChatRoomCheckRelationships() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (C.ID != 0) ServerSend("AccountOwnership", { MemberNumber: C.MemberNumber });
	if (C.ID != 0) ServerSend("AccountLovership", { MemberNumber: C.MemberNumber });
}

/**
 * Displays /help content to the player if it's their first visit to a chatroom this session
 * @returns {void} - Nothing.
 */
function ChatRoomFirstTimeHelp() {
	if (!ChatRoomHelpSeen) {
		ChatRoomMessage({ Content: "ChatRoomHelp", Type: "Action", Sender: Player.MemberNumber });
		ChatRoomHelpSeen = true;
	}
}

/**
 * Sets the current whisper target and flags a target update
 * @param {number} MemberNumber - The target member number to set
 * @returns {void} - Nothing
 */
function ChatRoomSetTarget(MemberNumber) {
	if (MemberNumber !== ChatRoomTargetMemberNumber) {
		ChatRoomTargetMemberNumber = MemberNumber;
		ChatRoomTargetDirty = true;
	}
}

/**
 * Updates the chat input's placeholder text to reflect the current whisper target
 * @returns {void} - Nothing.
 */
function ChatRoomTarget() {
	// If the target member number hasn't changed, do nothing
	if (!ChatRoomTargetDirty) return;

	var TargetName = null;
	if (ChatRoomTargetMemberNumber != null) {
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber) {
				TargetName = ChatRoomCharacter[C].Name;
				break;
			}
		if (TargetName == null) ChatRoomSetTarget(null);
	}
	let placeholder;
	if (ChatRoomTargetMemberNumber != null) {
		placeholder = TextGet("WhisperTo");
		placeholder += " " + TargetName;
	} else {
		placeholder = TextGet("PublicChat");
	}
	document.getElementById("InputChat").placeholder = placeholder;
}

/**
 * Updates the account to set the last chat room
 * @param {string} room - room to set it to. "" to reset.
 * @returns {void} - Nothing
 */
function ChatRoomSetLastChatRoom(room) {
	if (room != "") {
		if (!ChatRoomNewRoomToUpdate) {
			if (ChatRoomData && ChatRoomData.Background)
				Player.LastChatRoomBG = ChatRoomData.Background;
			if (ChatRoomData && ChatRoomData.Private)
				Player.LastChatRoomPrivate = ChatRoomData.Private;
			if (ChatRoomData && ChatRoomData.Limit)
				Player.LastChatRoomSize = ChatRoomData.Limit;
			if (ChatRoomData && ChatRoomData.Description != null)
				Player.LastChatRoomDesc = ChatRoomData.Description;
			if (ChatRoomData && ChatRoomData.Admin)
				Player.LastChatRoomAdmin = ChatRoomData.Admin;

			ChatRoomLastName = ChatRoomData.Name;
			ChatRoomLastBG = ChatRoomData.Background;
			ChatRoomLastSize = ChatRoomData.Limit;
			ChatRoomLastPrivate = ChatRoomData.Private;
			ChatRoomLastDesc = ChatRoomData.Description;
			ChatRoomLastAdmin = ChatRoomData.Admin;
		}
	} else {
		Player.LastChatRoomBG = "";
		Player.LastChatRoomPrivate = false;
		ChatRoomLastName = "";
		ChatRoomLastBG = "";
		ChatRoomLastSize = 0;
		ChatRoomLastPrivate = false;
		ChatRoomLastDesc = "";
		ChatRoomLastAdmin = [];
	}
	Player.LastChatRoom = room;
	var P = {
		LastChatRoom: Player.LastChatRoom,
		LastChatRoomBG: Player.LastChatRoomBG,
		LastChatRoomPrivate: Player.LastChatRoomPrivate,
		LastChatRoomSize: Player.LastChatRoomSize,
		LastChatRoomDesc: Player.LastChatRoomDesc,
		LastChatRoomAdmin: Player.LastChatRoomAdmin.toString(),

	};
	ServerAccountUpdate.QueueData(P);
}

/**
 * Triggers a chat room event for things like plugs and crotch ropes, will send a chat message if the chance is right.
 * @returns {void} - Nothing.
 */
function ChatRoomStimulationMessage(Context) {
	if (CurrentScreen == "ChatRoom" && Player.ImmersionSettings && Player.ImmersionSettings.StimulationEvents) {
		var C = Player;
		if (Context == null || Context == "") Context = "StruggleAction";

		var modBase = 0;
		var modArousal = 0;
		var modVibe = 0;
		var modInflation = 0;
		var modGag = 0;

		if (ChatRoomArousalMsg_Chance[Context]) modBase = ChatRoomArousalMsg_Chance[Context];
		if (ChatRoomArousalMsg_ChanceScaling[Context]) modArousal = ChatRoomArousalMsg_ChanceScaling[Context];
		if (ChatRoomArousalMsg_ChanceVibeMod[Context]) modVibe = ChatRoomArousalMsg_ChanceVibeMod[Context];
		if (ChatRoomArousalMsg_ChanceInflationMod[Context]) modInflation = ChatRoomArousalMsg_ChanceInflationMod[Context];
		if (ChatRoomArousalMsg_ChanceGagMod[Context]) modGag = ChatRoomArousalMsg_ChanceGagMod[Context];

		// Decide the trigger message
		var trigPriority = 0.0;
		var trigMsg = "";
		var trigGroup = "";
		var trigPlug = "";
		var arousalAmount = 0; // Increases based on how many items
		for (let A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Family == C.AssetFamily)) {
				var trigChance = 0;
				var trigMsgTemp = "";
				var Intensity = InventoryItemHasEffect(C.Appearance[A], "Vibrating", true) ? InventoryGetItemProperty(C.Appearance[A], "Intensity", true) : 0;
				if (InventoryItemHasEffect(C.Appearance[A], "CrotchRope", true)) {
					if (trigChance == 0) trigChance = modBase;
					trigMsgTemp = "CrotchRope";
					arousalAmount += 2;
				} else if (Intensity > 0) {
					if (trigChance == 0 && modVibe > 0) trigChance = modBase; // Some things are not affected by vibration, like kneeling
					trigChance += modVibe * Intensity;
					trigMsgTemp = "Vibe";
					arousalAmount += Intensity;
					if (InventoryItemHasEffect(C.Appearance[A], "FillVulva", true) && Math.random() < 0.5) {
						trigMsgTemp = "VibePlugFront";
						arousalAmount += 1;
						if (trigPlug == "Back") trigPlug = "Both";
						else trigPlug = "Front";
					}
					if (InventoryItemHasEffect(C.Appearance[A], "IsPlugged", true) && Math.random() < 0.5) {
						if (trigMsgTemp == "Vibe")
							trigMsgTemp = "VibePlugFront";
						arousalAmount += 1;
						if (trigPlug == "Front") trigPlug = "Both";
						else trigPlug = "Back";
					}
				} else {
					if (InventoryItemHasEffect(C.Appearance[A], "FillVulva", true)){
						if (trigChance == 0) trigChance = modBase;
						trigMsgTemp = "PlugFront";
						arousalAmount += 1;
						if (trigPlug == "Back") trigPlug = "Both";
						else trigPlug = "Front";
					}
					if (InventoryItemHasEffect(C.Appearance[A], "IsPlugged", true)) {
						if (trigChance == 0) trigChance = modBase;
						if (trigMsgTemp == "")
							trigMsgTemp = "PlugBack";
						arousalAmount += 1;
						if (trigPlug == "Front") trigPlug = "Both";
						else trigPlug = "Back";
					}
				}
				if (trigMsgTemp != "" && Player.ArousalSettings && Player.ArousalSettings.Progress > 0) {
					trigChance += modArousal * Player.ArousalSettings.Progress/100;
				}
				if (trigMsgTemp != "") {
					const Inflation = InventoryGetItemProperty(C.Appearance[A], "InflateLevel", true);
					if (typeof Inflation === "number" && Inflation > 0) {
						trigChance += modInflation * Inflation/4;
						arousalAmount += Inflation/2;
					}
				}

				if (trigPlug == "Both") {
					if ((trigMsgTemp == "VibePlugFront" || trigMsgTemp == "VibePlugBack"
					|| trigMsgTemp == "PlugFront" || trigMsgTemp == "PlugBack") && Math.random() > 0.7) {
						trigMsgTemp = "PlugBoth";
						arousalAmount += 1;
					}
				}


				if (InventoryItemHasEffect(C.Appearance[A], "GagTotal", true) || InventoryItemHasEffect(C.Appearance[A], "GagTotal2", true)) {
					if (trigChance == 0 && modGag > 0) trigChance = modBase; // Some things are not affected by vibration, like kneeling
					trigChance += modGag;


					if (trigChance > 0) {
						arousalAmount += 12;
						trigMsgTemp = "Gag";
					}
				}

				if (trigMsgTemp != "" && Math.random() < trigChance && trigChance >= trigPriority) {
					trigPriority = trigChance;
					trigMsg = trigMsgTemp;
					trigGroup = C.Appearance[A].Asset.Group.Name;
				}

			}

		// Now we have a trigger message, hopefully!
		if (trigMsg != "") {
			// Increase player arousal to the zone
			if (!Player.IsEdged() && Player.ArousalSettings && Player.ArousalSettings.Progress && Player.ArousalSettings.Progress < 70 - arousalAmount && trigMsgTemp != "Gag")
				ActivityEffectFlat(Player, Player, arousalAmount, trigGroup, 1);

			if ((Player.ChatSettings != null) && (Player.ChatSettings.ShowActivities != null) && !Player.ChatSettings.ShowActivities) return;

			ChatRoomPinkFlashTime = CommonTime() + (Math.random() + arousalAmount/2.4) * 500;

			CharacterSetFacialExpression(Player, "Blush", "VeryHigh", Math.ceil((ChatRoomPinkFlashTime - CommonTime())/250));

			var index = Math.floor(Math.random() * 3);
			ChatRoomMessage({ Content: "ChatRoomStimulationMessage"+trigMsg+""+index, Type: "Action", Sender: Player.MemberNumber });
		}
	}
}

/**
 * Called when screen size or position changes or after screen load
 * @param {boolean} load - If the reason for call was load (`true`) or window resize (`false`)
 */
function ChatRoomResize(load) {
	if (
		CharacterGetCurrent() == null
		&& CurrentScreen == "ChatRoom"
		&& document.getElementById("InputChat")
		&& document.getElementById("TextAreaChatLog")
	) {
		ElementPositionFix("TextAreaChatLog", ChatRoomFontSize, 1005, 66, 988, 835);
		ElementPosition("InputChat", 1456, 950, 900, 82);
	}
}

/**
 * Runs the chatroom screen.
 * @returns {void} - Nothing.
 */
function ChatRoomRun() {
	// Draws the chat room controls
	ChatRoomUpdateDisplay();
	ChatRoomCreateElement();
	ChatRoomFirstTimeHelp();
	ChatRoomTarget();
	ChatRoomBackground = "";
	DrawRect(0, 0, 2000, 1000, "Black");
	ChatRoomDrawCharacter(false);
	if (ChatRoomChatHidden) {
		ChatRoomChatHidden = false;
		ChatRoomResize(false);
	}
	DrawButton(1905, 908, 90, 90, "", "White", "Icons/Chat.png");
	if (!ChatRoomCanLeave() && ChatRoomSlowtimer != 0){//Player got interrupted while trying to leave. (Via a bind)
		ServerSend("ChatRoomChat", { Content: "SlowLeaveInterrupt", Type: "Action", Dictionary: [{Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber}]});
		ServerSend("ChatRoomChat", { Content: "SlowLeaveInterrupt", Type: "Hidden", Dictionary: [{Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber}]});
		ChatRoomSlowtimer = 0;
		ChatRoomSlowStop = false;
	}

	const PlayerIsSlow = Player.IsSlow();

	// If the player is slow (ex: ball & chains), she can leave the room with a timer and can be blocked by others
	if (PlayerIsSlow && ChatRoomCanLeave() && (ChatRoomSlowStop == false)) {
		if (ChatRoomSlowtimer == 0) DrawButton(1005, 2, 120, 60, "", "#FFFF00", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
		if ((CurrentTime < ChatRoomSlowtimer) && (ChatRoomSlowtimer != 0)) DrawButton(1005, 2, 120, 60, "", "White", "Icons/Rectangle/Cancel.png", TextGet("MenuCancel"));
		if ((CurrentTime > ChatRoomSlowtimer) && (ChatRoomSlowtimer != 0)) {
			ChatRoomSlowtimer = 0;
			ChatRoomSlowStop = false;
			DialogLentLockpicks = false;
			ChatRoomClearAllElements();
			ChatRoomSetLastChatRoom("");
			ServerSend("ChatRoomLeave", "");
			CommonSetScreen("Online", "ChatSearch");
		}
	}

	if (CurrentTime > ChatRoomGetUpTimer) {
		ChatRoomGetUpTimer = 0;
	}

	// If the player is slow and was stopped from leaving by another player
	if ((ChatRoomSlowStop == true) && PlayerIsSlow) {
		DrawButton(1005, 2, 120, 60, "", "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
		if (CurrentTime > ChatRoomSlowtimer) {
			ChatRoomSlowtimer = 0;
			ChatRoomSlowStop = false;
		}
	}

	// Draws the top buttons in pink if they aren't available
	if (!PlayerIsSlow || (ChatRoomSlowtimer == 0 && !ChatRoomCanLeave())){
		if (ChatRoomSlowtimer != 0) ChatRoomSlowtimer = 0;
		DrawButton(1005, 2, 120, 60, "", (ChatRoomCanLeave()) ? "White" : "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
	}

	// Draw the buttons at the top-right
	ChatRoomMenuDraw();

	// In orgasm mode, we add a pink filter and different controls depending on the stage.  The pink filter shows a little above 90
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.Active != null) && (Player.ArousalSettings.Active != "Inactive") && (Player.ArousalSettings.Active != "NoMeter")) {
		if ((Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {
			DrawRect(0, 0, 1003, 1000, "#FFB0B0B0");
			DrawRect(1003, 0, 993, 63, "#FFB0B0B0");
			if (Player.ArousalSettings.OrgasmStage == null) Player.ArousalSettings.OrgasmStage = 0;
			if (Player.ArousalSettings.OrgasmStage == 0) {
				DrawText(TextGet("OrgasmComing"), 500, 410, "White", "Black");
				DrawButton(200, 532, 250, 64, TextGet("OrgasmTryResist"), "White");
				DrawButton(550, 532, 250, 64, TextGet("OrgasmSurrender"), "White");
			}
			if (Player.ArousalSettings.OrgasmStage == 1) DrawButton(ActivityOrgasmGameButtonX, ActivityOrgasmGameButtonY, 250, 64, ActivityOrgasmResistLabel, "White");
			if (ActivityOrgasmRuined) ActivityOrgasmControl();
			if (Player.ArousalSettings.OrgasmStage == 2) DrawText(TextGet("OrgasmRecovering"), 500, 500, "White", "Black");
			ActivityOrgasmProgressBar(50, 970);
		} else if ((Player.ArousalSettings.Progress != null) && (Player.ArousalSettings.Progress >= 91) && (Player.ArousalSettings.Progress <= 99) && !CommonPhotoMode) {
			if ((ChatRoomCharacterCount <= 2) || (ChatRoomCharacterCount >= 6) ||
				(Player.GameplaySettings && (Player.GameplaySettings.SensDepChatLog == "SensDepExtreme") && (Player.GetBlindLevel() >= 3))) DrawRect(0, 0, 1003, 1000, "#FFB0B040");
			else if (ChatRoomCharacterCount == 3) DrawRect(0, 50, 1003, 900, "#FFB0B040");
			else if (ChatRoomCharacterCount == 4) DrawRect(0, 150, 1003, 700, "#FFB0B040");
			else if (ChatRoomCharacterCount == 5) DrawRect(0, 250, 1003, 500, "#FFB0B040");
		}
	}

	if ((Player.ImmersionSettings != null && Player.GraphicsSettings != null) && (Player.ImmersionSettings.StimulationEvents && Player.GraphicsSettings.StimulationFlash) && ChatRoomPinkFlashTime > CommonTime()) {
		let FlashTime = ChatRoomPinkFlashTime - CommonTime(); // ChatRoomPinkFlashTime is the end of the flash. The flash is brighter based on the distance to the end.
		let PinkFlashAlpha = DrawGetScreenFlash(FlashTime);
		if (
			(ChatRoomCharacterCount <= 2) || (ChatRoomCharacterCount >= 6) ||
			(Player.GameplaySettings && (Player.GameplaySettings.SensDepChatLog == "SensDepExtreme") && (Player.GetBlindLevel() >= 3))
		)
			DrawRect(0, 0, 1003, 1000, "#FFB0B0" + PinkFlashAlpha);
		else if (ChatRoomCharacterCount == 3) DrawRect(0, 50, 1003, 900, "#FFB0B0" + PinkFlashAlpha);
		else if (ChatRoomCharacterCount == 4) DrawRect(0, 150, 1003, 700, "#FFB0B0" + PinkFlashAlpha);
		else if (ChatRoomCharacterCount == 5) DrawRect(0, 250, 1003, 500, "#FFB0B0" + PinkFlashAlpha);
	}


	// Runs any needed online game script
	OnlineGameRun();

	// Clear notifications if needed
	ChatRoomNotificationReset();
	
	// Recreates the chatroom with the stored chatroom data if necessary
	ChatRoomRecreate();
}

/**
 * Draws the chat room menu buttons
 * @returns {void} - Nothing
 */
function ChatRoomMenuDraw() {
	const Space = 870 / (ChatRoomMenuButtons.length - 1);
	let ButtonColor = "White";
	for (let B = 0; B < ChatRoomMenuButtons.length; B++) {
		let Button = ChatRoomMenuButtons[B];
		if (Button === "Exit") continue; // handled in ChatRoomRun()
		const ImageSuffix = Button === "Icons" ? ChatRoomHideIconState.toString() : "";
		if (Button === "Kneel" && !Player.CanKneel()) {
			if (ChatRoomGetUpTimer === 0 && (ChatRoomCanAttemptStand() || ChatRoomCanAttemptKneel())) {
				ButtonColor = "Yellow";
			} else {
				ButtonColor = "Pink";
			}
		} else if (Button === "Dress" && (!Player.CanChange() || !OnlineGameAllowChange())) {
			ButtonColor = "Pink";
		} else {
			ButtonColor = "White";
		}
		DrawButton(1005 + Space * B, 2, 120, 60, "", ButtonColor, "Icons/Rectangle/" + Button + ImageSuffix + ".png", TextGet("Menu" + Button));
	}
}

/**
 * Handles clicks the chatroom screen.
 * @returns {void} - Nothing.
 */
function ChatRoomClick() {

	// In orgasm mode, we do not allow any clicks expect the chat
	if (MouseIn(1905, 910, 90, 90)) ChatRoomSendChat();
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {

		// On stage 0, the player can choose to resist the orgasm or not.  At 1, the player plays a mini-game to fight her orgasm
		if (MouseIn(200, 532, 250, 68) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmGameGenerate(0);
		if (MouseIn(550, 532, 250, 68) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmStart(Player);
		if ((MouseX >= ActivityOrgasmGameButtonX) && (MouseX <= ActivityOrgasmGameButtonX + 250) && (MouseY >= ActivityOrgasmGameButtonY) && (MouseY <= ActivityOrgasmGameButtonY + 64) && (Player.ArousalSettings.OrgasmStage == 1)) ActivityOrgasmGameGenerate(ActivityOrgasmGameProgress + 1);
		return;

	}

	// When the user chats or clicks on a character
	if (MouseIn(0, 0, 1000, 1000)) ChatRoomDrawCharacter(true);

	// When the user clicks a menu button in the top-right
	if (MouseYIn(0, 62)) ChatRoomMenuClick();
}

/**
 * Process chat room menu button clicks
 * @returns {void} - Nothing
 */
function ChatRoomMenuClick() {
	const Space = 870 / (ChatRoomMenuButtons.length - 1);
	for (let B = 0; B < ChatRoomMenuButtons.length; B++) {
		if (MouseXIn(1005 + Space * B, 120)) {
			switch (ChatRoomMenuButtons[B]) {
				case "Exit": {
					const PlayerIsSlow = Player.IsSlow();
					// When the user leaves
					if (ChatRoomCanLeave() && !PlayerIsSlow) {
						DialogLentLockpicks = false;
						ChatRoomClearAllElements();
						ServerSend("ChatRoomLeave", "");
						ChatRoomSetLastChatRoom("");
						// Clear leash since the player has escaped
						ChatRoomLeashPlayer = null;
						CommonSetScreen("Online", "ChatSearch");
						CharacterDeleteAllOnline();
					}
					// When the player is slow and attempts to leave
					if (ChatRoomCanLeave() && PlayerIsSlow) {
						// If the player clicked to leave, we start a timer based on evasion level and send a chat message
						if ((ChatRoomSlowtimer == 0) && (ChatRoomSlowStop == false)) {
							ServerSend("ChatRoomChat", { Content: "SlowLeaveAttempt", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
							ChatRoomSlowtimer = CurrentTime + (10 * (1000 - (50 * SkillGetLevelReal(Player, "Evasion"))));
						}
						// If the player clicked to cancel leaving, we alert the room and stop the timer
						else if ((ChatRoomSlowtimer != 0) && (ChatRoomSlowStop == false)) {
							ServerSend("ChatRoomChat", { Content: "SlowLeaveCancel", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
							ChatRoomSlowtimer = 0;
						}
					}
					break;
				}
				case "Cut":
					// When the user wants to remove the top part of his chat to speed up the screen, we only keep the last 20 entries
					var L = document.getElementById("TextAreaChatLog");
					while (L.childElementCount > 20)
						L.removeChild(L.childNodes[0]);
					ElementScrollToEnd("TextAreaChatLog");
					break;
				case "GameOption":
					// The cut button can become the game option button if there's an online game going on
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					CommonSetScreen("Online", "Game" + ChatRoomGame);
					break;
				case "Kneel":
					// When the user character kneels
					if (Player.CanKneel()) {
						const PlayerIsKneeling = Player.ActivePose && Player.ActivePose.includes("Kneel");
						ServerSend("ChatRoomChat", { Content: PlayerIsKneeling ? "StandUp" : "KneelDown", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
						FuturisticTrainingBeltStandUpFlag = Player.IsKneeling();
						CharacterSetActivePose(Player, PlayerIsKneeling ? "BaseLower" : "Kneel");
						ChatRoomStimulationMessage("Kneel");
						ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
					} else if (ChatRoomGetUpTimer == 0 && (ChatRoomCanAttemptStand() || ChatRoomCanAttemptKneel())) { // If the player can theoretically get up, we start a minigame!
						var diff = 0;
						if (Player.IsBlind()) diff += 1;
						if (Player.IsKneeling()) diff += 2;
						if (Player.IsDeaf()) diff += 1;
						if (InventoryGet(Player, "ItemTorso") || InventoryGroupIsBlocked(Player, "ItemTorso")) diff += 1;
						if (InventoryGroupIsBlocked(Player, "ItemHands")) diff += 1;
						if (InventoryGet(Player, "ItemArms")) diff += 1;
						if (InventoryGet(Player, "ItemLegs") || InventoryGroupIsBlocked(Player, "ItemLegs")) diff += 1;
						if (InventoryGet(Player, "ItemFeet") || InventoryGroupIsBlocked(Player, "ItemFeet")) diff += 1;
						if (InventoryGet(Player, "ItemBoots")) diff += 2;

						MiniGameStart("GetUp", diff, "ChatRoomAttemptStandMinigameEnd");
					}
					break;
				case "Icons":
					// When the user toggles icon visibility
					ChatRoomHideIconState += 1;
					if (ChatRoomHideIconState > 3) ChatRoomHideIconState = 0;
					break;
				case "Camera":
					// When the user takes a photo of the room
					ChatRoomPhotoFullRoom();
					break;
				case "Dress":
					// When the user wants to change clothes
					if (Player.CanChange() && OnlineGameAllowChange()) {
						document.getElementById("InputChat").style.display = "none";
						document.getElementById("TextAreaChatLog").style.display = "none";
						CharacterAppearanceReturnRoom = "ChatRoom";
						CharacterAppearanceReturnModule = "Online";
						CharacterAppearanceLoadCharacter(Player);
					}
					break;
				case "Profile":
					// When the user checks her profile
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					InformationSheetLoadCharacter(Player);
					break;
				case "Admin":
					// When the user enters the room administration screen
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					CommonSetScreen("Online", "ChatAdmin");
					break;
			}
		}
	}
}

function ChatRoomAttemptStandMinigameEnd() {

	if (MiniGameVictory)  {
		if (MiniGameType == "GetUp"){
			ServerSend("ChatRoomChat", { Content: (!Player.IsKneeling()) ? "KneelDownPass" : "StandUpPass", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
			FuturisticTrainingBeltStandUpFlag = Player.IsKneeling();
			CharacterSetActivePose(Player, (!Player.IsKneeling()) ? "Kneel" : null, true);
			ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
		}
	} else {
		if (MiniGameType == "GetUp") {
			ChatRoomGetUpTimer = CurrentTime + 15000;
			ServerSend("ChatRoomChat", { Content: (!Player.IsKneeling()) ? "KneelDownFail" : "StandUpFail", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
			if (!Player.IsKneeling()) {
				CharacterSetFacialExpression(Player, "Eyebrows", "Soft", 15);
				CharacterSetFacialExpression(Player, "Blush", "Medium", 15);
				CharacterSetFacialExpression(Player, "Eyes", "Dizzy", 15);
			}
		}
	}

	CommonSetScreen("Online", "ChatRoom");
}

/**
 * Checks if the player can leave the chatroom.
 * @returns {boolean} - Returns TRUE if the player can leave the current chat room.
 */
function ChatRoomCanLeave() {
	if (ChatRoomLeashPlayer != null) {
		if (ChatRoomCanBeLeashedBy(0, Player)) {
			return false;
		} else ChatRoomLeashPlayer = null;
	}
	if (!Player.CanWalk()) return false; // Cannot leave if cannot walk
	if (!ChatRoomData.Locked || ChatRoomPlayerIsAdmin()) return true; // Can leave if the room isn't locked or is an administrator
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomData.Admin.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0)
			return false; // Cannot leave if the room is locked and there's an administrator inside
	return true; // Can leave if the room is locked and there's no administrator inside
}

/**
 * Handles keyboard shortcuts in the chatroom screen.
 * @param {KeyboardEvent} event - The event that triggered this
 * @returns {void} - Nothing.
 */
function ChatRoomKeyDown(event) {

	// If the input text is not focused and not on mobile, set the focus to it
	if (document.activeElement.id != "InputChat") ElementFocus("InputChat");

	// The ENTER key sends the chat.  The "preventDefault" is needed for <textarea>, otherwise it adds a new line after clearing the field
	if (KeyPress == 13 && !event.shiftKey) {
		event.preventDefault();
		ChatRoomSendChat();
	}

	// On page up, we show the previous chat typed
	if (KeyPress == 33) {
		if (ChatRoomLastMessageIndex > 0) ChatRoomLastMessageIndex--;
		ElementValue("InputChat", ChatRoomLastMessage[ChatRoomLastMessageIndex]);
	}

	// On page down, we show the next chat typed
	if (KeyPress == 34) {
		ChatRoomLastMessageIndex++;
		if (ChatRoomLastMessageIndex > ChatRoomLastMessage.length - 1) ChatRoomLastMessageIndex = ChatRoomLastMessage.length - 1;
		ElementValue("InputChat", ChatRoomLastMessage[ChatRoomLastMessageIndex]);
	}

	// On escape, scroll to the bottom of the chat
	if (KeyPress == 27) ElementScrollToEnd("TextAreaChatLog");
}

/**
 * Sends the chat message to the room
 * @returns {void} - Nothing.
 */
function ChatRoomSendChat() {

	// If there's a message to send
	var msg = ElementValue("InputChat").trim();
	if (msg != "") {

		// Keeps the chat log in memory so it can be accessed with pageup/pagedown
		ChatRoomLastMessage.push(msg);
		ChatRoomLastMessageIndex = ChatRoomLastMessage.length;

		var m = msg.toLowerCase().trim();


		// Some custom functions like /dice or /coin are implemented for randomness
		if (m.indexOf("/dice") == 0) {
			let DiceNumber = 0;
			let DiceSize = 0;

			// The player can roll X dice of Y faces, using XdY.  If no size is specified, a 6 sided dice is assumed
			if (/(^\d+)[dD](\d+$)/.test(msg.substring(5, 50).trim())) {
				let Roll = /(^\d+)[dD](\d+$)/.exec((msg.substring(5, 50).trim()));
				DiceNumber = (!Roll) ? 1 : parseInt(Roll[1]);
				DiceSize = (!Roll) ? 6 : parseInt(Roll[2]);
				if ((DiceNumber < 1) || (DiceNumber > 100)) DiceNumber = 1;
			}
			else if (/(^\d+$)/.test((msg.substring(5, 50).trim()))) {
				let Roll = /(^\d+)/.exec((msg.substring(5, 50).trim()));
				DiceNumber = 1;
				DiceSize = (!Roll) ? 6 : parseInt(Roll[1]);
			}

			// If there's at least one dice to roll
			if (DiceNumber > 0) {
				if ((DiceSize < 2) || (DiceSize > 100)) DiceSize = 6;
				var CurrentRoll = 0;
				var Result = [];
				var Total = 0;
				while (CurrentRoll < DiceNumber) {
					let Roll = Math.floor(Math.random() * DiceSize) + 1;
					Result.push(Roll);
					Total += Roll;
					CurrentRoll++;
				}
				msg = "ActionDice";
				let Dictionary = [];
				Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name });
				Dictionary.push({ Tag: "DiceType", Text: DiceNumber.toString() + "D" + DiceSize.toString() });
				if (DiceNumber > 1) {
					Result.sort((a, b) => a - b);
					Dictionary.push({ Tag: "DiceResult", Text: Result.toString() + " = " + Total.toString() });
				}
				else if (DiceNumber == 1) Dictionary.push({ Tag: "DiceResult", Text: Total.toString() });
				if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
			}

		} else if (m.indexOf("/coin") == 0) {

			// The player can flip a coin, heads or tails are 50/50
			msg = "ActionCoin";
			var Heads = (Math.random() >= 0.5);
			let Dictionary = [];
			Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name });
			Dictionary.push({ Tag: "CoinResult", TextToLookUp: Heads ? "Heads" : "Tails" });
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });

		} else if ((m.indexOf("*") == 0) || (m.indexOf("/me ") == 0) || (m.indexOf("/action ") == 0) || (Player.ChatSettings.MuStylePoses && m.indexOf(":") == 0 && m.length > 3)) {

			// The player can emote an action using :, * or /me (for those IRC, MU* or Skype users), it doesn't garble
			// The command /action or ** does not add the player's name to it
			if (Player.ChatSettings.MuStylePoses) msg = msg.replace(":", "");
			msg = msg.replace("*", "");
			msg = msg.replace(/\/me /g, "");
			msg = msg.replace(/\/action /g, "*");
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" });

		}
		else if (m.indexOf("/help") == 0) ServerSend("ChatRoomChat", { Content: "ChatRoomHelp", Type: "Action", Target: Player.MemberNumber});
		else if (m.indexOf("/safeword") == 0) ChatRoomSafewordChatCommand();
		else if (m.indexOf("/friendlistadd ") == 0) ChatRoomListManipulation(Player.FriendList, null, msg);
		else if (m.indexOf("/friendlistremove ") == 0) ChatRoomListManipulation(null, Player.FriendList, msg);
		else if (m.indexOf("/ghostadd ") == 0) { ChatRoomListManipulation(Player.GhostList, null, msg); ChatRoomListManipulation(Player.BlackList, Player.WhiteList, msg); }
		else if (m.indexOf("/ghostremove ") == 0) { ChatRoomListManipulation(null, Player.GhostList, msg); ChatRoomListManipulation(null, Player.BlackList, msg); }
		else if (m.indexOf("/whitelistadd ") == 0) ChatRoomListManipulation(Player.WhiteList, Player.BlackList, msg);
		else if (m.indexOf("/whitelistremove ") == 0) ChatRoomListManipulation(null, Player.WhiteList, msg);
		else if (m.indexOf("/blacklistadd ") == 0) ChatRoomListManipulation(Player.BlackList, Player.WhiteList, msg);
		else if (m.indexOf("/blacklistremove ") == 0) ChatRoomListManipulation(null, Player.BlackList, msg);
		else if (m.indexOf("/ban ") == 0) ChatRoomAdminChatAction("Ban", msg);
		else if (m.indexOf("/unban ") == 0) ChatRoomAdminChatAction("Unban", msg);
		else if (m.indexOf("/kick ") == 0) ChatRoomAdminChatAction("Kick", msg);
		else if (m.indexOf("/promote ") == 0) ChatRoomAdminChatAction("Promote", msg);
		else if (m.indexOf("/demote ") == 0) ChatRoomAdminChatAction("Demote", msg);
		else if (m.indexOf("/afk") == 0) {
			const expression = WardrobeGetExpression(Player).Emoticon != "Afk" ? "Afk" : null;
			CharacterSetFacialExpression(Player, "Emoticon", expression);
		}
		else if (m.indexOf("/bot") == 0) {
			for (let CC = 0; CC < ChatRoomCharacter.length; CC++)
				if (ChatRoomCharacter[CC].MemberNumber && ChatRoomCharacter[CC].ID != 0)
					ServerSend("ChatRoomChat", { Content: "ChatRoomBot " + msg.substring(4), Type: "Hidden", Target: ChatRoomCharacter[CC].MemberNumber});
		} else {
			var WhisperTarget = null;
			for (let C = 0; C < ChatRoomCharacter.length; C++)
				if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber)
					WhisperTarget = ChatRoomCharacter[C];
			if (msg != "" && !((ChatRoomTargetMemberNumber != null || m.indexOf("(") >= 0) && Player.ImmersionSettings && (Player.ImmersionSettings.BlockGaggedOOC && (!(Player.Effect.includes("HideRestraints") && Player.Effect.includes("VRAvatars")) || !WhisperTarget || !WhisperTarget.Effect.includes("VRAvatars"))) && !Player.CanTalk())) {
				if (ChatRoomTargetMemberNumber == null) {
					// Regular chat
					ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });
					ChatRoomStimulationMessage("Gag");
				} else {
					// The whispers get sent to the server and shown on the client directly
					ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: ChatRoomTargetMemberNumber });
					var TargetName = "";
					if (WhisperTarget) TargetName = WhisperTarget.Name;

					var div = document.createElement("div");
					div.setAttribute('class', 'ChatMessage ChatMessageWhisper');
					div.setAttribute('data-time', ChatRoomCurrentTime());
					div.setAttribute('data-sender', Player.MemberNumber.toString());
					div.innerHTML = TextGet("WhisperTo") + " " + TargetName + ": " + msg;

					var Refocus = document.activeElement.id == "InputChat";
					var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
					if (document.getElementById("TextAreaChatLog") != null) {
						document.getElementById("TextAreaChatLog").appendChild(div);
						if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
						if (Refocus) ElementFocus("InputChat");
					}
				}
			} else {
				// Throw an error message
				ChatRoomMessage({ Content: "ChatRoomBlockGaggedOOC", Type: "Action", Sender: Player.MemberNumber });
			}
		}
		// Clears the chat text message
		ElementValue("InputChat", "");

	}

}

/**
 * Publishes common player actions (add, remove, swap) to the chat.
 * @param {Character} C - Character on which the action is done.
 * @param {Item} StruggleProgressPrevItem - The item that has been removed.
 * @param {Item} StruggleProgressNextItem - The item that has been added.
 * @param {boolean} LeaveDialog - Whether to leave the current dialog after publishing the action.
 * @param {string} [Action] - Action modifier
 * @returns {void} - Nothing.
 */
function ChatRoomPublishAction(C, StruggleProgressPrevItem, StruggleProgressNextItem, LeaveDialog, Action = null) {
	if (CurrentScreen == "ChatRoom") {

		// Prepares the message
		var msg = "";
		var Dictionary = [];
		if (Action == null) {
			if ((StruggleProgressPrevItem != null) && (StruggleProgressNextItem != null) && (StruggleProgressPrevItem.Asset.Name == StruggleProgressNextItem.Asset.Name) && (StruggleProgressPrevItem.Color != StruggleProgressNextItem.Color)) msg = "ActionChangeColor";
			else if ((StruggleProgressPrevItem != null) && (StruggleProgressNextItem != null) && !StruggleProgressNextItem.Asset.IsLock) msg = "ActionSwap";
			else if ((StruggleProgressPrevItem != null) && (StruggleProgressNextItem != null) && StruggleProgressNextItem.Asset.IsLock) msg = "ActionAddLock";
			else if (InventoryItemHasEffect(StruggleProgressNextItem, "Lock", false)) msg = "ActionLock";
			else if ((StruggleProgressNextItem != null) && (!StruggleProgressNextItem.Asset.Wear) && (StruggleProgressNextItem.Asset.DynamicActivity(Player) != null)) msg = "ActionActivity" + StruggleProgressNextItem.Asset.DynamicActivity(Player);
			else if (StruggleProgressNextItem != null) msg = "ActionUse";
			else if (InventoryItemHasEffect(StruggleProgressPrevItem, "Lock")) msg = "ActionUnlockAndRemove";
			else msg = "ActionRemove";
		} else if (Action == "interrupted") {
			if ((StruggleProgressPrevItem != null) && (StruggleProgressNextItem != null) && !StruggleProgressNextItem.Asset.IsLock) msg = "ActionInterruptedSwap";
			else if (StruggleProgressNextItem != null) msg = "ActionInterruptedAdd";
			else msg = "ActionInterruptedRemove";
			Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
		} else msg = Action;

		// Replaces the action tags to build the phrase
		Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
		if (StruggleProgressPrevItem != null) Dictionary.push({ Tag: "PrevAsset", AssetName: StruggleProgressPrevItem.Asset.Name });
		if (StruggleProgressNextItem != null) Dictionary.push({ Tag: "NextAsset", AssetName: StruggleProgressNextItem.Asset.Name });
		if (C.FocusGroup != null) Dictionary.push({ Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name });

		// Prepares the item packet to be sent to other players in the chatroom
		ChatRoomCharacterItemUpdate(C);

		// Sends the result to the server and leaves the dialog if we need to
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
		if (LeaveDialog && (CurrentCharacter != null)) DialogLeave();

	}
}

/**
 * Updates an item on character for everyone in a chat room - replaces ChatRoomCharacterUpdate to cut on the lag.
 * @param {Character} C - Character to update.
 * @param {string} [Group] - Item group to update.
 * @returns {void} - Nothing.
 */
function ChatRoomCharacterItemUpdate(C, Group) {
	if ((Group == null) && (C.FocusGroup != null)) Group = C.FocusGroup.Name;
	if ((CurrentScreen == "ChatRoom") && (Group != null)) {
		if (ChatRoomData && ChatRoomData.Character) {
			// Single item updates aren't sent back to the source member, so update the ChatRoomData accordingly
			if (ChatRoomData && ChatRoomData.Character) {
				const characterIndex = ChatRoomData.Character.findIndex((char) => char.MemberNumber === C.MemberNumber);
				if (characterIndex !== -1) {
					ChatRoomData.Character[characterIndex] = C;
				}
			}
		}

		const Item = InventoryGet(C, Group);
		const P = {};
		P.Target = C.MemberNumber;
		P.Group = Group;
		P.Name = (Item != null) ? Item.Asset.Name : undefined;
		P.Color = ((Item != null) && (Item.Color != null)) ? Item.Color : "Default";
		P.Difficulty = (Item != null) ? Item.Difficulty - Item.Asset.Difficulty : SkillGetWithRatio("Bondage");
		P.Property = ((Item != null) && (Item.Property != null)) ? Item.Property : undefined;
		ServerSend("ChatRoomCharacterItemUpdate", P);
	}
}

/**
 * Publishes a custom action to the chat
 * @param {string} msg - Tag of the action to send
 * @param {boolean} LeaveDialog - Whether or not the dialog should be left.
 * @param {Array.<{Tag: string, Text: string, MemberNumber: number}>} Dictionary - Dictionary of tags and data to send
 *     to the room.
 * @returns {void} - Nothing.
 */
function ChatRoomPublishCustomAction(msg, LeaveDialog, Dictionary) {
	if (CurrentScreen == "ChatRoom") {
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
		var C = CharacterGetCurrent();
		if (C) ChatRoomCharacterItemUpdate(C);
		if (LeaveDialog && (C != null)) DialogLeave();
	}
}

/**
 * Pushes the new character data/appearance to the server.
 * @param {Character} C - Character to update.
 * @returns {void} - Nothing.
 */
function ChatRoomCharacterUpdate(C) {
	if (ChatRoomAllowCharacterUpdate) {
		var data = {
			ID: (C.ID == 0) ? Player.OnlineID : C.AccountName.replace("Online-", ""),
			ActivePose: C.ActivePose,
			Appearance: ServerAppearanceBundle(C.Appearance)
		};
		ServerSend("ChatRoomCharacterUpdate", data);
	}
}

/**
 * Escapes a given string.
 * @param {string} str - Text to escape.
 * @returns {string} - Escaped string.
 */
function ChatRoomHTMLEntities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Handles the reception of a chatroom message. Ghost players' messages are ignored.
 * @param {object} data - Message object containing things like the message type, sender, content, etc.
 * @returns {void} - Nothing.
 */
function ChatRoomMessage(data) {

	// Make sure the message is valid (needs a Sender and Content)
	if ((data != null) && (typeof data === "object") && (data.Content != null) && (typeof data.Content === "string") && (data.Content != "") && (data.Sender != null) && (typeof data.Sender === "number")) {

		// If we must reset the current game played in the room
		if (data.Content == "ServerUpdateRoom") OnlineGameReset();

		// Exits right away if the sender is ghosted
		if (Player.GhostList.indexOf(data.Sender) >= 0) return;

		// Make sure the sender is in the room
		var SenderCharacter = null;
		for (let C = 0; C < ChatRoomCharacter.length; C++)
			if (ChatRoomCharacter[C].MemberNumber == data.Sender) {
				SenderCharacter = ChatRoomCharacter[C];
				break;
			}

		// If we found the sender
		if (SenderCharacter != null) {
			// Replace < and > characters to prevent HTML injections
			var msg = ChatRoomHTMLEntities(data.Content);

			// Hidden messages are processed separately, they are used by chat room mini-games / events
			if (data.Type == "Hidden") {
				if (msg == "RuleInfoGet") ChatRoomGetLoadRules(SenderCharacter);
				else if (msg == "RuleInfoSet") ChatRoomSetLoadRules(SenderCharacter, data.Dictionary);
				else if (msg.startsWith("StruggleAssist")) {
					let A = parseInt( msg.substr("StruggleAssist".length));
					if ((A >= 1) && (A <= 7)) {
						ChatRoomStruggleAssistTimer = CurrentTime + 60000;
						ChatRoomStruggleAssistBonus = A;
					}
				}
				else if (msg == "SlowStop"){
					ChatRoomSlowtimer = CurrentTime + 45000;
					ChatRoomSlowStop = true;
				}
				else if (msg.startsWith("MaidDrinkPick")){
					let A = parseInt(msg.substr("MaidDrinkPick".length));
					if ((A == 0) || (A == 5) || (A == 10)) MaidQuartersOnlineDrinkPick(data.Sender, A);
				}
				else if (msg.startsWith("PayQuest")) ChatRoomPayQuest(data);
				else if (msg.startsWith("OwnerRule")) data = ChatRoomSetRule(data);
				else if (msg.startsWith("LoverRule")) data = ChatRoomSetRule(data);
				else if (msg == "HoldLeash"){
					if (SenderCharacter.MemberNumber != ChatRoomLeashPlayer && ChatRoomLeashPlayer != null) {
						ServerSend("ChatRoomChat", { Content: "RemoveLeash", Type: "Hidden", Target: ChatRoomLeashPlayer });
					}
					if (ChatRoomCanBeLeashedBy(SenderCharacter.MemberNumber, Player)) {
						ChatRoomLeashPlayer = SenderCharacter.MemberNumber;
					} else {
						ServerSend("ChatRoomChat", { Content: "RemoveLeash", Type: "Hidden", Target: SenderCharacter.MemberNumber });
					}
				}
				else if (msg == "StopHoldLeash"){
					if (SenderCharacter.MemberNumber == ChatRoomLeashPlayer) {
						ChatRoomLeashPlayer = null;
					}
				}
				else if (msg == "PingHoldLeash"){ // The dom will ping all players on her leash list and ones that no longer have her as their leasher will remove it
					if (SenderCharacter.MemberNumber != ChatRoomLeashPlayer || !ChatRoomCanBeLeashedBy(SenderCharacter.MemberNumber, Player)) {
						ServerSend("ChatRoomChat", { Content: "RemoveLeash", Type: "Hidden", Target: SenderCharacter.MemberNumber });
					}
				}
				else if (msg == "RemoveLeash" || msg == "RemoveLeashNotFriend") {
					if (ChatRoomLeashList.indexOf(SenderCharacter.MemberNumber) >= 0) {
						ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(SenderCharacter.MemberNumber), 1);
					}
				}
				else if (msg == "GiveLockpicks") DialogLentLockpicks = true;
				else if (msg == "RequestFullKinkyDungeonData") {
					KinkyDungeonStreamingPlayers.push(SenderCharacter.MemberNumber);
					if (CurrentScreen == "KinkyDungeon")
						KinkyDungeonSendData(KinkyDungeonPackData(true, true, true, true), SenderCharacter.MemberNumber);
				}

				// If the message is still hidden after any modifications, stop processing
				if (data.Type == "Hidden") return;
			}

			// Checks if the message is a notification about the user entering or leaving the room
			var MsgEnterLeave = "";
			var MsgNonDialogue = "";
			if ((data.Type == "Action") && (msg.startsWith("ServerEnter") || msg.startsWith("ServerLeave") || msg.startsWith("ServerDisconnect") || msg.startsWith("ServerBan") || msg.startsWith("ServerKick")))
				MsgEnterLeave = " ChatMessageEnterLeave";
			if ((data.Type != "Chat" && data.Type != "Whisper" && data.Type != "Emote"))
				MsgNonDialogue = " ChatMessageNonDialogue";

			if (msg.startsWith("ServerDisconnect") && SenderCharacter.MemberNumber == ChatRoomLeashPlayer) ChatRoomLeashPlayer = null;

			// Replace actions by the content of the dictionary
			if (data.Type && ((data.Type == "Action") || (data.Type == "ServerMessage"))) {
				if (data.Type == "ServerMessage") msg = "ServerMessage" + msg;
				var orig_msg = msg;
				msg = DialogFindPlayer(msg);
				if (data.Dictionary) {
					var dictionary = data.Dictionary;
					var SourceCharacter = null;
					var IsPlayerInvolved = (SenderCharacter.MemberNumber == Player.MemberNumber);
					let TargetMemberNumber = null;
					let ActivityName = null;
					var GroupName = null;
					let ActivityCounter = 1;
					var Automatic = false;
					for (let D = 0; D < dictionary.length; D++) {

						// If there's a member number in the dictionary packet, we use that number to alter the chat message
						if (dictionary[D].MemberNumber) {

							// Alters the message displayed in the chat room log, and stores the source & target in case they're required later
							if ((dictionary[D].Tag == "DestinationCharacter") || (dictionary[D].Tag == "DestinationCharacterName")) {
								msg = msg.replace(dictionary[D].Tag, ((SenderCharacter.MemberNumber == dictionary[D].MemberNumber) && (dictionary[D].Tag == "DestinationCharacter")) ? DialogFindPlayer("Her") : (PreferenceIsPlayerInSensDep() && dictionary[D].MemberNumber != Player.MemberNumber ? DialogFindPlayer("Someone").toLowerCase() : ChatRoomHTMLEntities(dictionary[D].Text) + DialogFindPlayer("'s")));
								TargetMemberNumber = dictionary[D].MemberNumber;
							}
							else if ((dictionary[D].Tag == "TargetCharacter") || (dictionary[D].Tag == "TargetCharacterName")) {
								msg = msg.replace(dictionary[D].Tag, ((SenderCharacter.MemberNumber == dictionary[D].MemberNumber) && (dictionary[D].Tag == "TargetCharacter")) ? DialogFindPlayer("Herself") : (PreferenceIsPlayerInSensDep() && dictionary[D].MemberNumber != Player.MemberNumber ? DialogFindPlayer("Someone").toLowerCase() : ChatRoomHTMLEntities(dictionary[D].Text)));
								TargetMemberNumber = dictionary[D].MemberNumber;
							}
							else if (dictionary[D].Tag == "SourceCharacter") {
								msg = msg.replace(dictionary[D].Tag, (PreferenceIsPlayerInSensDep() && (dictionary[D].MemberNumber != Player.MemberNumber)) ? DialogFindPlayer("Someone") : ChatRoomHTMLEntities(dictionary[D].Text));
								for (let T = 0; T < ChatRoomCharacter.length; T++)
									if (ChatRoomCharacter[T].MemberNumber == dictionary[D].MemberNumber)
										SourceCharacter = ChatRoomCharacter[T];
							}

							// Sets if the player is involved in the action
							if (!IsPlayerInvolved && ((dictionary[D].Tag == "DestinationCharacter") || (dictionary[D].Tag == "DestinationCharacterName") || (dictionary[D].Tag == "TargetCharacter") || (dictionary[D].Tag == "TargetCharacterName") || (dictionary[D].Tag == "SourceCharacter" || dictionary[D].Tag === "ItemMemberNumber")))
								if (dictionary[D].MemberNumber == Player.MemberNumber)
									IsPlayerInvolved = true;

						}
						else if (dictionary[D].TextToLookUp) msg = msg.replace(dictionary[D].Tag, DialogFindPlayer(ChatRoomHTMLEntities(dictionary[D].TextToLookUp)).toLowerCase());
						else if (dictionary[D].AssetName) {
							for (let A = 0; A < Asset.length; A++)
								if (Asset[A].Name == dictionary[D].AssetName) {
									msg = msg.replace(dictionary[D].Tag, Asset[A].DynamicDescription(SourceCharacter || Player).toLowerCase());
									ActivityName = Asset[A].DynamicActivity(SourceCharacter || Player);
									break;
								}
						}
						else if (dictionary[D].AssetGroupName) {
							for (let A = 0; A < AssetGroup.length; A++)
								if (AssetGroup[A].Name == dictionary[D].AssetGroupName) {
									msg = msg.replace(dictionary[D].Tag, AssetGroup[A].Description.toLowerCase());
									GroupName = dictionary[D].AssetGroupName;
								}
						}
						else if (dictionary[D].ActivityCounter) ActivityCounter = dictionary[D].ActivityCounter;
						else if (dictionary[D].Automatic) Automatic = true;
						else if (msg != null) msg = msg.replace(dictionary[D].Tag, ChatRoomHTMLEntities(dictionary[D].Text));
					}

					// For automatic messages, do not show the message if the player is not involved, depending on their preferences
					if (Automatic && !IsPlayerInvolved && !Player.ChatSettings.ShowAutomaticMessages) {
						return;
					}

					// When the player is in total sensory deprivation, hide messages if the player is not involved
					if (Player.ImmersionSettings.SenseDepMessages && !IsPlayerInvolved && PreferenceIsPlayerInSensDep()) {
						return;
					}

					// Handle stimulation
					if ((orig_msg == "HelpKneelDown" || orig_msg == "HelpStandUp") && ((TargetMemberNumber != null && TargetMemberNumber == Player.MemberNumber) || (SenderCharacter.MemberNumber != null && SenderCharacter.MemberNumber == Player.MemberNumber))) {
						ChatRoomStimulationMessage("Kneel");
					}

					// If another player is using an item which applies an activity on the current player, apply the effect here
					if ((ActivityName != null) && (TargetMemberNumber != null) && (TargetMemberNumber == Player.MemberNumber) && (SenderCharacter.MemberNumber != Player.MemberNumber))
						if ((Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic"))
							ActivityEffect(SenderCharacter, Player, ActivityName, GroupName, ActivityCounter);

					// Launches the audio file if allowed
					if (!Player.AudioSettings.PlayItemPlayerOnly || IsPlayerInvolved)
						AudioPlayContent(data);

					// Raise a notification if required
					if (data.Type === "Action" && IsPlayerInvolved && Player.NotificationSettings.ChatMessage.Activity)
						ChatRoomNotificationRaiseChatMessage(SenderCharacter, msg);
				}
			}

			// Prepares the HTML tags
			if (data.Type != null) {
				const HideOthersMessages = Player.ImmersionSettings.SenseDepMessages
					&& PreferenceIsPlayerInSensDep()
					&& SenderCharacter.ID !== 0
					&& Player.GetDeafLevel() >= 4;

				if (data.Type == "Chat" || data.Type == "Whisper") {
					msg = '<span class="ChatMessageName" style="color:' + (SenderCharacter.LabelColor || 'gray');
					if (data.Type == "Whisper") msg += '; font-style: italic';
					msg += ';">';

					// Garble names
					let senderName = "";
					if (PreferenceIsPlayerInSensDep() && SenderCharacter.MemberNumber != Player.MemberNumber && data.Type != "Whisper") {
						if ((Player.GetDeafLevel() >= 4))
							senderName = DialogFindPlayer("Someone");
						else
							senderName = SpeechGarble(SenderCharacter, SenderCharacter.Name, true);
					} else {
						senderName = SenderCharacter.Name;
					}
					msg += senderName;
					msg += ':</span> ';

					const chatMsg = ChatRoomHTMLEntities(data.Type === "Whisper" ? data.Content : SpeechGarble(SenderCharacter, data.Content));
					msg += chatMsg;
					ChatRoomChatLog.push({ Chat: SpeechGarble(SenderCharacter, data.Content, true), Garbled: chatMsg, SenderName: senderName, SenderMemberNumber: SenderCharacter.MemberNumber, Time: CommonTime() });

					if (ChatRoomChatLog.length > 6) { // Keep it short
						ChatRoomChatLog.splice(0, 1);
					}

					if (HideOthersMessages && data.Type === "Chat") {
						return;
					}

					if ((data.Type === "Chat" && Player.NotificationSettings.ChatMessage.Normal)
						|| (data.Type === "Whisper" && Player.NotificationSettings.ChatMessage.Whisper))
						ChatRoomNotificationRaiseChatMessage(SenderCharacter, chatMsg);
				}
				else if (data.Type == "Emote") {
					if (HideOthersMessages && !msg.toLowerCase().includes(Player.Name.toLowerCase())) {
						return;
					}

					if (msg.indexOf("*") == 0) msg = msg + "*";
					else if ((msg.indexOf("'") == 0) || (msg.indexOf(",") == 0)) msg = "*" + SenderCharacter.Name + msg + "*";
					else if (PreferenceIsPlayerInSensDep() && SenderCharacter.MemberNumber != Player.MemberNumber) {
						msg = "*" + DialogFindPlayer("Someone") + " " + msg + "*";

						for (let C = 0; C < ChatRoomCharacter.length; C++) {
							if (ChatRoomCharacter[C] && ChatRoomCharacter[C].Name && ChatRoomCharacter[C].ID != 0)
								msg = msg.replace(ChatRoomCharacter[C].Name.charAt(0).toUpperCase() + ChatRoomCharacter[C].Name.slice(1), DialogFindPlayer("Someone"));
						}
					}
					else msg = "*" + SenderCharacter.Name + " " + msg + "*";

					if (Player.NotificationSettings.ChatMessage.Normal)
						ChatRoomNotificationRaiseChatMessage(SenderCharacter, msg);
				}
				else if (data.Type == "Action") msg = "(" + msg + ")";
				else if (data.Type == "ServerMessage") msg = "<b>" + msg + "</b>";
			}

			// Outputs the sexual activities text and runs the activity if the player is targeted
			if ((data.Type != null) && (data.Type === "Activity")) {

				// Creates the output message using the activity dictionary and tags, keep some values to calculate the activity effects on the player
				msg = "(" + ActivityDictionaryText(msg) + ")";
				let TargetMemberNumber = null;
				let ActivityName = null;
				var ActivityGroup = null;
				let ActivityCounter = 1;
				if (data.Dictionary != null)
					for (let D = 0; D < data.Dictionary.length; D++) {
						if (data.Dictionary[D].MemberNumber != null) msg = msg.replace(data.Dictionary[D].Tag, (PreferenceIsPlayerInSensDep() && (data.Dictionary[D].MemberNumber != Player.MemberNumber)) ? DialogFindPlayer("Someone") : ChatRoomHTMLEntities(data.Dictionary[D].Text));
						if ((data.Dictionary[D].MemberNumber != null) && (data.Dictionary[D].Tag == "TargetCharacter")) TargetMemberNumber = data.Dictionary[D].MemberNumber;
						if (data.Dictionary[D].Tag == "ActivityName") ActivityName = data.Dictionary[D].Text;
						if (data.Dictionary[D].Tag == "ActivityGroup") ActivityGroup = data.Dictionary[D].Text;
						if (data.Dictionary[D].ActivityCounter != null) ActivityCounter = data.Dictionary[D].ActivityCounter;
					}



				// If the player does the activity on herself or an NPC, we calculate the result right away
				if ((data.Type === "Action") || ((TargetMemberNumber == Player.MemberNumber) && (SenderCharacter.MemberNumber != Player.MemberNumber)))
					if ((Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic"))
						ActivityEffect(SenderCharacter, Player, ActivityName, ActivityGroup, ActivityCounter);

				// When the player is in total sensory deprivation, hide messages if the player is not involved
				if (Player.ImmersionSettings.SenseDepMessages && TargetMemberNumber != Player.MemberNumber && SenderCharacter.MemberNumber != Player.MemberNumber && PreferenceIsPlayerInSensDep()) {
					return;
				}

				// Exits before outputting the text if the player doesn't want to see the sexual activity messages
				if ((Player.ChatSettings != null) && (Player.ChatSettings.ShowActivities != null) && !Player.ChatSettings.ShowActivities) return;

				// Raise a notification if required
				if (TargetMemberNumber === Player.MemberNumber && Player.NotificationSettings.ChatMessage.Activity)
					ChatRoomNotificationRaiseChatMessage(SenderCharacter, msg);
			}

			// Adds the message and scrolls down unless the user has scrolled up
			var div = document.createElement("div");
			div.setAttribute('class', 'ChatMessage ChatMessage' + data.Type + MsgEnterLeave + MsgNonDialogue);
			div.setAttribute('data-time', ChatRoomCurrentTime());
			div.setAttribute('data-sender', data.Sender);
			if (data.Type == "Emote" || data.Type == "Action" || data.Type == "Activity")
				div.setAttribute('style', 'background-color:' + ChatRoomGetTransparentColor(SenderCharacter.LabelColor) + ';');
			div.innerHTML = msg;

			// Returns the focus on the chat box
			var Refocus = document.activeElement.id == "InputChat";
			var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
			if (document.getElementById("TextAreaChatLog") != null) {
				document.getElementById("TextAreaChatLog").appendChild(div);
				if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
				if (Refocus) ElementFocus("InputChat");
			}
		}
	}
}

/**
 * Adds a character into the chat room.
 * @param {Character} newCharacter - The new character to be added to the chat room.
 * @param {object} newRawCharacter - The raw character data of the new character as it was received from the server.
 * @returns {void} - Nothing
 */
function ChatRoomAddCharacterToChatRoom(newCharacter, newRawCharacter)
{
	if(newCharacter == null) { return; }
	if(newRawCharacter == null) { return; }

	// Update the chat room characters
	let characterIndex = ChatRoomCharacter.findIndex(x => x.MemberNumber == newCharacter.MemberNumber);
	if(characterIndex >= 0) // If we found an existing entry...
	{
		// Update it
		ChatRoomCharacter[characterIndex] = newCharacter;
	}
	else // If we didn't update existing data...
	{
		// Push a new entry
		ChatRoomCharacter.push(newCharacter);
	}

	// Update chat room data backup
	characterIndex = ChatRoomData.Character.findIndex(x => x.MemberNumber == newRawCharacter.MemberNumber);
	if(characterIndex >= 0) // If we found an existing entry...
	{
		// Update it
		ChatRoomData.Character[characterIndex] = newRawCharacter;
	}
	else // If we didn't update existing data...
	{
		// Push a new entry
		ChatRoomData.Character.push(newRawCharacter);
	}

}

/**
 * Handles the reception of the complete room data from the server.
 * @param {object} chatRoomProperties - Room object containing the updated chatroom data.
 * @returns {boolean} - Returns true if the passed properties are valid and false if they're invalid.
 */
function ChatRoomValidateProperties(chatRoomProperties)
{
	return chatRoomProperties != null && typeof chatRoomProperties === "object"
		&& chatRoomProperties.Name != null && typeof chatRoomProperties.Name === "string"
		&& chatRoomProperties.Description != null && typeof chatRoomProperties.Description === "string"
		&& Array.isArray(chatRoomProperties.Admin)
		&& Array.isArray(chatRoomProperties.Ban)
		&& chatRoomProperties.Background != null && typeof chatRoomProperties.Background === "string"
		&& chatRoomProperties.Limit != null && typeof chatRoomProperties.Limit === "number"
		&& chatRoomProperties.Locked != null && typeof chatRoomProperties.Locked === "boolean"
		&& chatRoomProperties.Private != null && typeof chatRoomProperties.Private === "boolean"
		&& Array.isArray(chatRoomProperties.BlockCategory);
}

/**
 * Handles the reception of the new room data from the server.
 * @param {object} data - Room object containing the updated chatroom data.
 * @returns {void} - Nothing.
 */
function ChatRoomSync(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	if(ChatRoomValidateProperties(data) == false) // If the room data we received is invalid...
	{
		// Instantly leave the chat room again
		DialogLentLockpicks = false;
		ChatRoomClearAllElements();
		ChatRoomSetLastChatRoom("");
		ServerSend("ChatRoomLeave", "");
		ChatSearchMessage = "ErrorInvalidRoomProperties";
		CommonSetScreen("Online", "ChatSearch");
		return;
	}

	// Loads the room
	if ((CurrentScreen != "ChatRoom") && (CurrentScreen != "ChatAdmin") && (CurrentScreen != "Appearance") && (CurrentModule != "Character")) {
		if (ChatRoomPlayerCanJoin) {
			ChatRoomPlayerCanJoin = false;
			CommonSetScreen("Online", "ChatRoom");
			if (ChatRoomPlayerJoiningAsAdmin) {
				ChatRoomPlayerJoiningAsAdmin = false;
				// Check if we should push banned members
				if (Player.OnlineSettings && data.Character.length == 1) {
					const BanList = ChatRoomConcatenateBanList(Player.OnlineSettings.AutoBanBlackList, Player.OnlineSettings.AutoBanGhostList);
					if (BanList.length > 0) {
						data.Ban = BanList;
						data.Limit = data.Limit.toString();
						ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: data, Action: "Update" });
					}
				}
			}
		} else return;
	}

	// Treat chatroom updates from ourselves as if the updated characters had sent them
	const trustedUpdate = data.SourceMemberNumber === Player.MemberNumber;

	// Load the characters
	ChatRoomCharacter = [];
	for (let C = 0; C < data.Character.length; C++) {
		const sourceMemberNumber = trustedUpdate ? data.Character[C].MemberNumber : data.SourceMemberNumber;
		const Char = CharacterLoadOnline(data.Character[C], sourceMemberNumber);
		ChatRoomCharacter.push(Char);
	}

	// Keeps a copy of the previous version
	ChatRoomData = data;
	if (ChatRoomData.Game != null) {
		ChatRoomGame = ChatRoomData.Game;
	}

	// Check whether the player's last chatroom data needs updating
	ChatRoomCheckForLastChatRoomUpdates();

	// Reloads the online game statuses if needed
	OnlineGameLoadStatus();

	// The allowed menu actions may have changed
	ChatRoomMenuBuild();
}


/**
 * Handles the reception of the character data of a single player from the server.
 * @param {object} data - object containing the character's data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncCharacter(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	const newCharacter = CharacterLoadOnline(data.Character, data.SourceMemberNumber);
	ChatRoomAddCharacterToChatRoom(newCharacter, data.Character);

}

/**
 * Handles the reception of the character data of a newly joined player from the server.
 * @param {object} data - object containing the joined character's data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncMemberJoin(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	//Load the character to the chat room
	const newCharacter = CharacterLoadOnline(data.Character, data.SourceMemberNumber);
	ChatRoomAddCharacterToChatRoom(newCharacter, data.Character);

	if (Array.isArray(data.WhiteListedBy)) {
		for (const MemberNumber of data.WhiteListedBy) {
			for (const character of Character) {
				if (character.MemberNumber === MemberNumber && Array.isArray(character.WhiteList) && character.ID != 0) {
					if (!character.WhiteList.includes(newCharacter.MemberNumber)) {
						character.WhiteList.push(newCharacter.MemberNumber);
						character.WhiteList.sort((a, b) => a - b);
					}
				}
			}
		}
	}
	if (Array.isArray(data.BlackListedBy)) {
		for (const MemberNumber of data.BlackListedBy) {
			for (const character of Character) {
				if (character.MemberNumber === MemberNumber && Array.isArray(character.BlackList) && character.ID != 0) {
					if (!character.BlackList.includes(newCharacter.MemberNumber)) {
						character.BlackList.push(newCharacter.MemberNumber);
						character.BlackList.sort((a, b) => a - b);
					}
				}
			}
		}
	}

	// After Join Actions
	if (ChatRoomNotificationRaiseChatJoin(newCharacter)) {
		NotificationRaise(NotificationEventType.CHATJOIN, { characterName: newCharacter.Name });
	}
	if (ChatRoomLeashList.includes(newCharacter.MemberNumber)) {
		// Ping to make sure they are still leashed
		ServerSend("ChatRoomChat", { Content: "PingHoldLeash", Type: "Hidden", Target: newCharacter.MemberNumber });
	}
	// Check whether the player's last chatroom data needs updating
	ChatRoomCheckForLastChatRoomUpdates();
	// The allowed menu actions may have changed
	ChatRoomMenuBuild();

}

/**
 * Handles the reception of the leave notification of a player from the server.
 * @param {object} data - Room object containing the leaving character's member number.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncMemberLeave(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	// Remove the character
	ChatRoomCharacter = ChatRoomCharacter.filter(x => x.MemberNumber != data.SourceMemberNumber);
	ChatRoomData.Character = ChatRoomData.Character.filter(x => x.MemberNumber != data.SourceMemberNumber);

	// Check whether the player's last chatroom data needs updating
	ChatRoomCheckForLastChatRoomUpdates();

	// The allowed menu actions may have changed
	ChatRoomMenuBuild();

}

/**
 * Handles the reception of the room properties from the server.
 * @param {object} data - Room object containing the updated chatroom properties.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncRoomProperties(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	if(ChatRoomValidateProperties(data) == false) // If the room data we received is invalid...
	{
		// Instantly leave the chat room again
		DialogLentLockpicks = false;
		ChatRoomClearAllElements();
		ChatRoomSetLastChatRoom("");
		ServerSend("ChatRoomLeave", "");
		ChatSearchMessage = "ErrorInvalidRoomProperties";
		CommonSetScreen("Online", "ChatSearch");
		return;
	}

	// Copy the received properties to chat room data
	Object.assign(ChatRoomData, data);

	if (ChatRoomData.Game != null) ChatRoomGame = ChatRoomData.Game;

	// Check whether the player's last chatroom data needs updating
	ChatRoomCheckForLastChatRoomUpdates();

	// Reloads the online game statuses if needed
	OnlineGameLoadStatus();

	// The allowed menu actions may have changed
	ChatRoomMenuBuild();

}

/**
 * Handles the swapping of two players by a room administrator.
 * @param {object} data - Object containing the member numbers of the swapped characters.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncSwapPlayers(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	// Update the chat room characters
	let index1 = ChatRoomCharacter.findIndex(x => (x.MemberNumber == data.MemberNumber1));
	let index2 = ChatRoomCharacter.findIndex(x => (x.MemberNumber == data.MemberNumber2));

	if(index1 >= 0 && index2 >= 0) // If we found both characters to swap...
	{
		//Swap them
		let bufferCharacter = ChatRoomCharacter[index1];
		ChatRoomCharacter[index1] = ChatRoomCharacter[index2];
		ChatRoomCharacter[index2] = bufferCharacter;
	}

	// Update the chat room data backup
	index1 = ChatRoomData.Character.findIndex(x => x.MemberNumber == data.MemberNumber1);
	index2 = ChatRoomData.Character.findIndex(x => x.MemberNumber == data.MemberNumber2);

	if(index1 >= 0 && index2 >= 0) // If we found both entries to swap...
	{
		//Swap them
		let bufferCharacter = ChatRoomData.Character[index1];
		ChatRoomData.Character[index1] = ChatRoomData.Character[index2];
		ChatRoomData.Character[index2] = bufferCharacter;
	}

}

/**
 * Handles the moving of a player by a room administrator.
 * @param {object} data - Object containing the member numbers of the swapped characters.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncMovePlayer(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	let moveOffset = 0;
	switch(data.Direction)
	{
		case "Left": moveOffset = -1; break;
		case "Right": moveOffset = 1; break;
		default: moveOffset = 0; break;
	}

	// Update the chat room characters
	let index = ChatRoomCharacter.findIndex(x => x.MemberNumber == data.TargetMemberNumber);
	if(index >= 0 && index < ChatRoomCharacter.length &&
		index+moveOffset >= 0 && index+moveOffset < ChatRoomCharacter.length) // If we found the character to move and the moving is valid...
	{
		//Move it
		let bufferCharacter = ChatRoomCharacter[index];
		ChatRoomCharacter[index] = ChatRoomCharacter[index+moveOffset];
		ChatRoomCharacter[index+moveOffset] = bufferCharacter;
	}

	// Update the chat room data backup
	index = ChatRoomData.Character.findIndex(x => x.MemberNumber == data.TargetMemberNumber);
	if(index >= 0 && index < ChatRoomCharacter.length &&
		index+moveOffset >= 0 && index+moveOffset < ChatRoomCharacter.length) // If we found the entry to move and the moving is valid...
	{
		//Move it
		let bufferCharacter = ChatRoomData.Character[index];
		ChatRoomData.Character[index] = ChatRoomData.Character[index+moveOffset];
		ChatRoomData.Character[index+moveOffset] = bufferCharacter;
	}

}

/**
 * Handles the swapping of two players by a room administrator.
 * @param {object} data - Object containing the member numbers of the swapped characters.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncReorderPlayers(data) {
	if (data == null || (typeof data !== "object")) {
		return;
	}

	let newChatRoomCharacter = [];
	let newChatRoomDataCharacter = [];
	let index = 0;

	for(let i=0; i<data.PlayerOrder.length; i++) // For every player to reorder...
	{
		//Chat Room Characters
		index = ChatRoomCharacter.findIndex(x => x.MemberNumber == data.PlayerOrder[i]);
		newChatRoomCharacter.push(ChatRoomCharacter.splice(index, 1)[0]);

		//Chat Room Data Backup
		index = ChatRoomData.Character.findIndex(x => x.MemberNumber == data.PlayerOrder[i]);
		newChatRoomDataCharacter.push(ChatRoomData.Character.splice(index, 1)[0]);

	}

	if(ChatRoomCharacter.length > 0) // If we forgot about some characters for some reason...
	{
		//Push the missed entries to the end
		Array.prototype.push.apply(newChatRoomCharacter, ChatRoomCharacter);
	}
	if(ChatRoomData.Character.length > 0) // If we forgot about some entries for some reason...
	{
		//Push the missed entries to the end
		Array.prototype.push.apply(newChatRoomDataCharacter, ChatRoomData.Character);
	}

	//Update the origin arrays
	ChatRoomCharacter = newChatRoomCharacter;
	ChatRoomData.Character = newChatRoomDataCharacter;

}

/**
 * Updates a single character in the chatroom
 * @param {object} data - Data object containing the new character data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncSingle(data) {

	// Sets the chat room character data
	if ((data == null) || (typeof data !== "object")) return;
	if ((data.Character == null) || (typeof data.Character !== "object")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.Character.MemberNumber)
			ChatRoomCharacter[C] = CharacterLoadOnline(data.Character, data.SourceMemberNumber);

	// Keeps a copy of the previous version
	for (let C = 0; C < ChatRoomData.Character.length; C++)
		if (ChatRoomData.Character[C].MemberNumber == data.Character.MemberNumber)
			ChatRoomData.Character[C] = data.Character;

}

/**
 * Updates a single character's expression in the chatroom.
 * @param {object} data - Data object containing the new character expression data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncExpression(data) {
	if ((data == null) || (typeof data !== "object") || (data.Group == null) || (typeof data.Group !== "string")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.MemberNumber) {

			// Changes the facial expression
			for (let A = 0; A < ChatRoomCharacter[C].Appearance.length; A++)
				if ((ChatRoomCharacter[C].Appearance[A].Asset.Group.Name == data.Group) && (ChatRoomCharacter[C].Appearance[A].Asset.Group.AllowExpression))
					if ((data.Name == null) || (ChatRoomCharacter[C].Appearance[A].Asset.Group.AllowExpression.indexOf(data.Name) >= 0)) {
						if (!ChatRoomCharacter[C].Appearance[A].Property) ChatRoomCharacter[C].Appearance[A].Property = {};
						if (ChatRoomCharacter[C].Appearance[A].Property.Expression != data.Name) {
							ChatRoomCharacter[C].Appearance[A].Property.Expression = data.Name;
							CharacterRefresh(ChatRoomCharacter[C], false);
						}
					}

			// Keeps a copy of the previous version
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber)
					ChatRoomData.Character[C].Appearance = ChatRoomCharacter[C].Appearance;
			return;

		}
}

/**
 * Updates a single character's pose in the chatroom.
 * @param {object} data - Data object containing the new character pose data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncPose(data) {
	if ((data == null) || (typeof data !== "object")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.MemberNumber) {

			// Sets the active pose
			ChatRoomCharacter[C].ActivePose = data.Pose;
			CharacterRefresh(ChatRoomCharacter[C], false);

			// Keeps a copy of the previous version
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber)
					ChatRoomData.Character[C].ActivePose = data.Pose;
			return;

		}
}

/**
 * Updates a single character's arousal progress in the chatroom.
 * @param {object} data - Data object containing the new character arousal data.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncArousal(data) {
	if ((data == null) || (typeof data !== "object")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].MemberNumber == data.MemberNumber) && (ChatRoomCharacter[C].ArousalSettings != null)) {

			// Sets the orgasm count & progress
			ChatRoomCharacter[C].ArousalSettings.OrgasmTimer = data.OrgasmTimer;
			ChatRoomCharacter[C].ArousalSettings.OrgasmCount = data.OrgasmCount;
			ChatRoomCharacter[C].ArousalSettings.Progress = data.Progress;
			ChatRoomCharacter[C].ArousalSettings.ProgressTimer = data.ProgressTimer;
			if ((ChatRoomCharacter[C].ArousalSettings.AffectExpression == null) || ChatRoomCharacter[C].ArousalSettings.AffectExpression) ActivityExpression(ChatRoomCharacter[C], ChatRoomCharacter[C].ArousalSettings.Progress);

			// Keeps a copy of the previous version
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber) {
					ChatRoomData.Character[C].ArousalSettings.OrgasmTimer = data.OrgasmTimer;
					ChatRoomData.Character[C].ArousalSettings.OrgasmCount = data.OrgasmCount;
					ChatRoomData.Character[C].ArousalSettings.Progress = data.Progress;
					ChatRoomData.Character[C].ArousalSettings.ProgressTimer = data.ProgressTimer;
					ChatRoomData.Character[C].Appearance = ChatRoomCharacter[C].Appearance;
				}
			return;

		}
}


/**
 * Updates a single item on a specific character in the chatroom.
 * @param {object} data - Data object containing the data pertaining to the singular item to update.
 * @returns {void} - Nothing.
 */
function ChatRoomSyncItem(data) {
	if ((data == null) || (typeof data !== "object") || (data.Source == null) || (typeof data.Source !== "number") || (data.Item == null) || (typeof data.Item !== "object") || (data.Item.Target == null) || (typeof data.Item.Target !== "number") || (data.Item.Group == null) || (typeof data.Item.Group !== "string")) return;
	for (let C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber === data.Item.Target) {

			const updateParams = ValidationCreateDiffParams(ChatRoomCharacter[C], data.Source);
			const previousItem = InventoryGet(ChatRoomCharacter[C], data.Item.Group);
			const newItem = ServerBundledItemToAppearanceItem(ChatRoomCharacter[C].AssetFamily, data.Item);

			let { item, valid } = ValidationResolveAppearanceDiff(previousItem, newItem, updateParams);

			ChatRoomAllowCharacterUpdate = false;
			if (item) {
				CharacterAppearanceSetItem(
					ChatRoomCharacter[C], data.Item.Group, item.Asset, item.Color, item.Difficulty, null, false);

				InventoryGet(ChatRoomCharacter[C], data.Item.Group).Property = item.Property;

				/** @type {AppearanceDiffMap} */
				const diffMap = {};
				for (const appearanceItem of ChatRoomCharacter[C].Appearance) {
					const groupName = appearanceItem.Asset.Group.Name;
					if (groupName === data.Item.Group) {
						diffMap[groupName] = [previousItem, appearanceItem];
					} else {
						diffMap[groupName] = [appearanceItem, appearanceItem];
					}
				}

				const cyclicBlockSanitizationResult = ValidationResolveCyclicBlocks(ChatRoomCharacter[C].Appearance, diffMap);
				ChatRoomCharacter[C].Appearance = cyclicBlockSanitizationResult.appearance;
				valid = valid && cyclicBlockSanitizationResult.valid;
			} else {
				InventoryRemove(ChatRoomCharacter[C], data.Item.Group);
			}

			ChatRoomAllowCharacterUpdate = true;

			// If the update was invalid, send a correction update
			if (ChatRoomCharacter[C].ID === 0 && !valid) {
				console.warn(`Invalid appearance update to group ${data.Item.Group}. Updating with sanitized appearance.`);
				ChatRoomCharacterUpdate(ChatRoomCharacter[C]);
			} else {
				CharacterRefresh(ChatRoomCharacter[C]);
			}

			// Keeps the change in the chat room data and allows the character to be updated again
			for (let R = 0; R < ChatRoomData.Character.length; R++) {
				if (ChatRoomData.Character[R].MemberNumber == data.Item.Target)
					ChatRoomData.Character[R].Appearance = ChatRoomCharacter[C].Appearance;
			}

			return;
		}
}

/**
 * Refreshes the chat log elements for Player
 * @returns {void} - Nothing.
 */
function ChatRoomRefreshChatSettings() {
	if (Player.ChatSettings) {
		for (let property in Player.ChatSettings)
			ElementSetDataAttribute("TextAreaChatLog", property, Player.ChatSettings[property]);
		if (Player.GameplaySettings &&
			(Player.GameplaySettings.SensDepChatLog == "SensDepNames" || Player.GameplaySettings.SensDepChatLog == "SensDepTotal" || Player.GameplaySettings.SensDepChatLog == "SensDepExtreme") &&
			(Player.GetDeafLevel() >= 3) &&
			(Player.GetBlindLevel() >= 3)) {
			ElementSetDataAttribute("TextAreaChatLog", "EnterLeave", "Hidden");
		}
		if (Player.GameplaySettings && (Player.GameplaySettings.SensDepChatLog == "SensDepTotal" || Player.GameplaySettings.SensDepChatLog == "SensDepExtreme") && (Player.GetDeafLevel() >= 3) && (Player.GetBlindLevel() >= 3)) {
			ElementSetDataAttribute("TextAreaChatLog", "DisplayTimestamps", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorNames", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorActions", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorEmotes", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorActivities", "false");
			ElementSetDataAttribute("TextAreaChatLog", "MemberNumbers", "Never");
		}
	}
}

/**
 * Shows the current character's profile (Information Sheet screen)
 * @returns {void} - Nothing.
 */
function ChatRoomViewProfile() {
	if (CurrentCharacter != null) {
		var C = CurrentCharacter;
		DialogLeave();
		InformationSheetLoadCharacter(C);
	}
}

/**
 * Brings the player into the main hall and starts the maid punishment sequence
 * @returns {void}
 */
function DialogCallMaids() {
	ChatRoomSlowtimer = 0;
	ChatRoomSlowStop = false;
	ChatRoomClearAllElements();
	ChatRoomSetLastChatRoom("");
	ServerSend("ChatRoomLeave", "");
	CommonSetScreen("Room", "MainHall");
	if (!Player.RestrictionSettings || !Player.RestrictionSettings.BypassNPCPunishments) {
		MainHallPunishFromChatroom();
	}
}


/**
 * Triggered when the player assists another player to struggle out, the bonus is evasion / 2 + 1, with penalties if
 * the player is restrained.
 * @returns {void} - Nothing.
 */
function ChatRoomStruggleAssist() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
	var Bonus = SkillGetLevelReal(Player, "Evasion") / 2 + 1;
	if (!Player.CanInteract()) {
		if (InventoryItemHasEffect(InventoryGet(Player, "ItemArms"), "Block", true)) Bonus = Bonus / 1.5;
		if (InventoryItemHasEffect(InventoryGet(Player, "ItemHands"), "Block", true)) Bonus = Bonus / 1.5;
		if (!Player.CanTalk()) Bonus = Bonus / 1.25;
	}
	ServerSend("ChatRoomChat", { Content: "StruggleAssist", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "StruggleAssist" + Math.round(Bonus).toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	DialogLeave();
}

/**

 * Triggered when the player assists another player to by giving lockpicks
 * @returns {void} - Nothing.
 */
function ChatRoomGiveLockpicks() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
	ServerSend("ChatRoomChat", { Content: "GiveLockpicks", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "GiveLockpicks", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	DialogLeave();
}

/*
 * Triggered when the player grabs another player's leash
 * @returns {void} - Nothing.
 */
function ChatRoomHoldLeash() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
	ServerSend("ChatRoomChat", { Content: "HoldLeash", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "HoldLeash", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	if (ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) < 0)
		ChatRoomLeashList.push(CurrentCharacter.MemberNumber);
	DialogLeave();
}

/**
 * Triggered when the player lets go of another player's leash
 * @returns {void} - Nothing.
 */
function ChatRoomStopHoldLeash() {
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
	ServerSend("ChatRoomChat", { Content: "StopHoldLeash", Type: "Action", Dictionary: Dictionary });
	ServerSend("ChatRoomChat", { Content: "StopHoldLeash", Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	if (ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber) >= 0)
		ChatRoomLeashList.splice(ChatRoomLeashList.indexOf(CurrentCharacter.MemberNumber), 1);
	DialogLeave();
}

/**
 * Triggered when a dom enters the room
 * @returns {void} - Nothing.
 */
function ChatRoomPingLeashedPlayers(NoBeep) {
	if (ChatRoomLeashList && ChatRoomLeashList.length > 0) {
		for (let P = 0; P < ChatRoomLeashList.length; P++) {
			ServerSend("ChatRoomChat", { Content: "PingHoldLeash", Type: "Hidden", Target: ChatRoomLeashList[P] });
			ServerSend("AccountBeep", { MemberNumber: ChatRoomLeashList[P], BeepType:"Leash"});
		}
	}
}


/**
 * Triggered when a character makes another character kneel/stand.
 * @returns {void} - Nothing
 */
function ChatRoomKneelStandAssist() {
	ServerSend("ChatRoomChat", { Content: !CurrentCharacter.IsKneeling() ? "HelpKneelDown" : "HelpStandUp", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }, { Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber }] });
	CharacterSetActivePose(CurrentCharacter, !CurrentCharacter.IsKneeling() ? "Kneel" : null, true);
	ChatRoomCharacterUpdate(CurrentCharacter);
}

/**
 * Triggered when a character stops another character from leaving.
 * @returns {void} - Nothing
 */
function ChatRoomStopLeave(){
	var Dictionary = [];
	Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
	Dictionary.push({Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber});
	ServerSend("ChatRoomChat", { Content: "SlowStop", Type: "Action", Dictionary: Dictionary});
	ServerSend("ChatRoomChat", { Content: "SlowStop", Type: "Hidden", Target: CurrentCharacter.MemberNumber } );
	DialogLeave();
}

/**
 * Sends an administrative command to the server for the chat room from the character dialog.
 * @param {string} ActionType - Type of action performed.
 * @param {boolean | string} [Publish=true] - Whether or not the action should be published.
 * @returns {void} - Nothing
 */
function ChatRoomAdminAction(ActionType, Publish) {
	if ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && ChatRoomPlayerIsAdmin()) {
		if (ActionType == "Move") {
			ChatRoomMoveTarget = CurrentCharacter.MemberNumber;
		} else {
			ServerSend("ChatRoomAdmin", { MemberNumber: CurrentCharacter.MemberNumber, Action: ActionType, Publish: ((Publish == null) || (Publish != false && Publish != "false")) });
		}
		DialogLeave();
	}
}

/**
 * Sends an administrative command to the server from the chat text field.
 * @param {string} ActionType - Type of action performed.
 * @param {string} Message - Target number of the action.
 * @returns {void} - Nothing
 */
function ChatRoomAdminChatAction(ActionType, Message) {
	if (ChatRoomPlayerIsAdmin()) {
		var C = parseInt(Message.substring(Message.indexOf(" ") + 1));
		if (!isNaN(C) && (C > 0) && (C != Player.MemberNumber))
			ServerSend("ChatRoomAdmin", { MemberNumber: C, Action: ActionType });
	}
}

/**
 * Gets the player's current time as a string.
 * @returns {string} - The player's current local time as a string.
 */
function ChatRoomCurrentTime() {
	var D = new Date();
	return ("0" + D.getHours()).substr(-2) + ":" + ("0" + D.getMinutes()).substr(-2);
}

/**
 * Gets a transparent version of the specified hex color.
 * @param {HexColor} Color - Hex color code.
 * @returns {string} - A transparent version of the specified hex color in the rgba format.
 */
function ChatRoomGetTransparentColor(Color) {
	if (!Color) return "rgba(128,128,128,0.1)";
	var R = Color.substring(1, 3), G = Color.substring(3, 5), B = Color.substring(5, 7);
	return "rgba(" + parseInt(R, 16) + "," + parseInt(G, 16) + "," + parseInt(B, 16) + ",0.1)";
}

/**
 * Adds or removes an online member to/from a specific list. (From the dialog menu)
 * @param {"Add" | "Remove"} Operation - Operation to perform.
 * @param {string} ListType - Name of the list to alter. (Whitelist, friendlist, blacklist, ghostlist)
 * @returns {void} - Nothing
 */
function ChatRoomListManage(Operation, ListType) {
	if (((Operation == "Add" || Operation == "Remove")) && (CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player[ListType] != null) && Array.isArray(Player[ListType])) {
		if ((Operation == "Add") && (Player[ListType].indexOf(CurrentCharacter.MemberNumber) < 0)) Player[ListType].push(CurrentCharacter.MemberNumber);
		if ((Operation == "Remove") && (Player[ListType].indexOf(CurrentCharacter.MemberNumber) >= 0)) Player[ListType].splice(Player[ListType].indexOf(CurrentCharacter.MemberNumber), 1);
		ServerPlayerRelationsSync();
		setTimeout(() => ChatRoomCharacterUpdate(Player), 5000);
	}
	if (ListType == "GhostList") {
		CharacterRefresh(CurrentCharacter, false);
		ChatRoomListManage(Operation, "BlackList");
	}
}

/**
 * Adds or removes an online member to/from a specific list. (From a typed message.)
 * @param {number[]|null} Add - List to add to.
 * @param {number[]|null} Remove - List to remove from.
 * @param {string} Message - Member number to add/remove.
 * @returns {void} - Nothing
 */
function ChatRoomListManipulation(Add, Remove, Message) {
	var C = parseInt(Message.substring(Message.indexOf(" ") + 1));
	if (!isNaN(C) && (C > 0) && (C != Player.MemberNumber)) {
		if ((Add != null) && (Add.indexOf(C) < 0)) Add.push(C);
		if ((Remove != null) && (Remove.indexOf(C) >= 0)) Remove.splice(Remove.indexOf(C), 1);
		if ((Player.GhostList == Add || Player.GhostList == Remove) && Character.find(Char => Char.MemberNumber == C)) CharacterRefresh(Character.find(Char => Char.MemberNumber == C), false);
		ServerPlayerRelationsSync();
		setTimeout(() => ChatRoomCharacterUpdate(Player), 5000);
	}
}

/**
 * Handles reception of data pertaining to if applying an item is allowed.
 * @param {object} data - Data object containing if the player is allowed to interact with a character.
 * @returns {void} - Nothing
 */
function ChatRoomAllowItem(data) {
	if ((data != null) && (typeof data === "object") && (data.MemberNumber != null) && (typeof data.MemberNumber === "number") && (data.AllowItem != null) && (typeof data.AllowItem === "boolean"))
		if (CurrentCharacter != null && CurrentCharacter.MemberNumber == data.MemberNumber && data.AllowItem !== CurrentCharacter.AllowItem) {
			console.warn(`ChatRoomGetAllowItem mismatch trying to access ${CurrentCharacter.Name} (${CurrentCharacter.MemberNumber})`);
			CurrentCharacter.AllowItem = data.AllowItem;
			CharacterSetCurrent(CurrentCharacter);
		}
}

/**
 * Triggered when the player wants to change another player's outfit.
 * @returns {void} - Nothing
 */
function ChatRoomChangeClothes() {
	var C = CurrentCharacter;
	DialogLeave();
	CharacterAppearanceLoadCharacter(C);
}

/**
 * Triggered when the player selects an ownership dialog option. (It can change money and reputation)
 * @param {string} RequestType - Type of request being performed.
 * @returns {void} - Nothing
 */
function ChatRoomSendOwnershipRequest(RequestType) {
	if ((ChatRoomOwnershipOption == "CanOfferEndTrial") && (RequestType == "Propose")) { CharacterChangeMoney(Player, -100); DialogChangeReputation("Dominant", 10); }
	if ((ChatRoomOwnershipOption == "CanEndTrial") && (RequestType == "Accept")) DialogChangeReputation("Dominant", -20);
	ChatRoomOwnershipOption = "";
	ServerSend("AccountOwnership", { MemberNumber: CurrentCharacter.MemberNumber, Action: RequestType });
	if (RequestType == "Accept") DialogLeave();
}

/**
 * Triggered when the player selects an lovership dialog option. (It can change money and reputation)
 * @param {string} RequestType - Type of request being performed.
 * @returns {void} - Nothing
 */
function ChatRoomSendLovershipRequest(RequestType) {
	if ((ChatRoomLovershipOption == "CanOfferBeginWedding") && (RequestType == "Propose")) CharacterChangeMoney(Player, -100);
	if ((ChatRoomLovershipOption == "CanBeginWedding") && (RequestType == "Accept")) CharacterChangeMoney(Player, -100);
	ChatRoomLovershipOption = "";
	ServerSend("AccountLovership", { MemberNumber: CurrentCharacter.MemberNumber, Action: RequestType });
	if (RequestType == "Accept") DialogLeave();
}

/**
 * Triggered when the player picks a drink from a character's maid tray.
 * @param {string} DrinkType - Drink chosen.
 * @param {number} Money - Cost of the drink.
 * @returns {void} - Nothing
 */
function ChatRoomDrinkPick(DrinkType, Money) {
	if (ChatRoomCanTakeDrink()) {
		var Dictionary = [];
		Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "DestinationCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
		Dictionary.push({ Tag: "TargetCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber });
		ServerSend("ChatRoomChat", { Content: "MaidDrinkPick" + DrinkType, Type: "Action", Dictionary: Dictionary });
		ServerSend("ChatRoomChat", { Content: "MaidDrinkPick" + Money.toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
		CharacterChangeMoney(Player, Money * -1);
		DialogLeave();
	}
}

function ChatRoomSendLoverRule(RuleType, Option) { ChatRoomSendRule(RuleType, Option, "Lover"); }
function ChatRoomSendOwnerRule(RuleType, Option) { ChatRoomSendRule(RuleType, Option, "Owner"); }
/**
 * Sends a rule / restriction / punishment to the player's slave/lover client, it will be handled on the slave/lover's
 * side when received.
 * @param {string} RuleType - The rule selected.
 * @param {"Quest" | "Leave"} Option - If the rule is a quest or we should just leave the dialog.
 * @param {"Owner" | "Lover"} Sender - Type of the sender
 * @returns {void} - Nothing
 */
function ChatRoomSendRule(RuleType, Option, Sender) {
	ServerSend("ChatRoomChat", { Content: Sender + "Rule" + RuleType, Type: "Hidden", Target: CurrentCharacter.MemberNumber });
	if (Option == "Quest") {
		if (ChatRoomQuestGiven.indexOf(CurrentCharacter.MemberNumber) >= 0) ChatRoomQuestGiven.splice(ChatRoomQuestGiven.indexOf(CurrentCharacter.MemberNumber), 1);
		ChatRoomQuestGiven.push(CurrentCharacter.MemberNumber);
	}
	if ((Option == "Leave") || (Option == "Quest")) DialogLeave();
}

function ChatRoomGetLoverRule(RuleType) { return ChatRoomGetRule(RuleType, "Lover"); }
function ChatRoomGetOwnerRule(RuleType) { return ChatRoomGetRule(RuleType, "Owner"); }

/**
 * Gets a rule from the current character
 * @param {string} RuleType - The name of the rule to retrieve.
 * @param {"Owner" | "Lover"} Sender - Type of the sender
 * @returns {boolean} - The owner or lover rule corresponding to the requested rule name
 */
function ChatRoomGetRule(RuleType, Sender) {
	return LogQueryRemote(CurrentCharacter, RuleType, Sender + "Rule");
}


/**
 * Processes a rule sent to the player from her owner or from her lover.
 * @param {object} data - Received rule data object.
 * @returns {object} - Returns the data object, used to continue processing the chat message.
 */
function ChatRoomSetRule(data) {

	// Only works if the sender is the player, and the player is fully collared
	if ((data != null) && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (Player.Ownership.MemberNumber == data.Sender)) {

		// Wardrobe/changing rules
		if (data.Content == "OwnerRuleChangeAllow") LogDelete("BlockChange", "OwnerRule");
		if (data.Content == "OwnerRuleChangeBlock1Hour") LogAdd("BlockChange", "OwnerRule", CurrentTime + 3600000);
		if (data.Content == "OwnerRuleChangeBlock1Day") LogAdd("BlockChange", "OwnerRule", CurrentTime + 86400000);
		if (data.Content == "OwnerRuleChangeBlock1Week") LogAdd("BlockChange", "OwnerRule", CurrentTime + 604800000);
		if (data.Content == "OwnerRuleChangeBlock") LogAdd("BlockChange", "OwnerRule", CurrentTime + 1000000000000);

		// Whisper rules
		if (data.Content == "OwnerRuleWhisperAllow") LogDelete("BlockWhisper", "OwnerRule");
		if (data.Content == "OwnerRuleWhisperBlock") { LogAdd("BlockWhisper", "OwnerRule"); ChatRoomSetTarget(null); }

		// Key rules
		if (data.Content == "OwnerRuleKeyAllow") LogDelete("BlockKey", "OwnerRule");
		if (data.Content == "OwnerRuleKeyConfiscate") {InventoryConfiscateKey(); DialogLentLockpicks = false;}
		if (data.Content == "OwnerRuleKeyBlock") LogAdd("BlockKey", "OwnerRule");
		if (data.Content == "OwnerRuleSelfOwnerLockAllow") LogDelete("BlockOwnerLockSelf", "OwnerRule");
		if (data.Content == "OwnerRuleSelfOwnerLockBlock") LogAdd("BlockOwnerLockSelf", "OwnerRule");

		// Remote rules
		if (data.Content == "OwnerRuleRemoteAllow") LogDelete("BlockRemote", "OwnerRule");
		if (data.Content == "OwnerRuleRemoteAllowSelf") LogDelete("BlockRemoteSelf", "OwnerRule");
		if (data.Content == "OwnerRuleRemoteConfiscate") InventoryConfiscateRemote();
		if (data.Content == "OwnerRuleRemoteBlock") LogAdd("BlockRemote", "OwnerRule");
		if (data.Content == "OwnerRuleRemoteBlockSelf") LogAdd("BlockRemoteSelf", "OwnerRule");

		// Timer cell punishment
		var TimerCell = 0;
		if (data.Content == "OwnerRuleTimerCell5") TimerCell = 5;
		if (data.Content == "OwnerRuleTimerCell15") TimerCell = 15;
		if (data.Content == "OwnerRuleTimerCell30") TimerCell = 30;
		if (data.Content == "OwnerRuleTimerCell60") TimerCell = 60;
		if (TimerCell > 0) {
			ServerSend("ChatRoomChat", { Content: "ActionGrabbedForCell", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }] });

			DialogLentLockpicks = false;
			ChatRoomClearAllElements();
			ServerSend("ChatRoomLeave", "");
			CharacterDeleteAllOnline();
			CellLock(TimerCell);
		}

		// Collar Rules
		if (data.Content == "OwnerRuleCollarRelease") {
			if ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name == "SlaveCollar")) {
				InventoryRemove(Player, "ItemNeck");
				ChatRoomCharacterItemUpdate(Player, "ItemNeck");
				ServerSend("ChatRoomChat", { Content: "PlayerOwnerCollarRelease", Type: "Action", Dictionary: [{Tag: "DestinationCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber}] });
			}
			LogAdd("ReleasedCollar", "OwnerRule");
		}
		if (data.Content == "OwnerRuleCollarWear") {
			if ((InventoryGet(Player, "ItemNeck") == null) || ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name != "SlaveCollar"))) {
				ServerSend("ChatRoomChat", { Content: "PlayerOwnerCollarWear", Type: "Action", Dictionary: [{Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber}] });
			}
			LogDelete("ReleasedCollar", "OwnerRule");
			LoginValidCollar();
		}

		// Forced labor
		if (data.Content == "OwnerRuleLaborMaidDrinks" && Player.CanTalk()) {
			CharacterSetActivePose(Player, null);
			var D = TextGet("ActionGrabbedToServeDrinksIntro");
			ServerSend("ChatRoomChat", { Content: "ActionGrabbedToServeDrinks", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
			DialogLentLockpicks = false;
			ChatRoomClearAllElements();
			ServerSend("ChatRoomLeave", "");
			CharacterDeleteAllOnline();
			CommonSetScreen("Room", "MaidQuarters");
			CharacterSetCurrent(MaidQuartersMaid);
			MaidQuartersMaid.CurrentDialog = D;
			MaidQuartersMaid.Stage = "205";
			MaidQuartersOnlineDrinkFromOwner = true;
		}

		// Switches it to a server message to announce the new rule to the player
		data.Type = "ServerMessage";

		ChatRoomGetLoadRules(data.Sender);
	}

	// Only works if the sender is the lover of the player
	if ((data != null) && Player.GetLoversNumbers().includes(data.Sender)) {
		if (data.Content == "LoverRuleSelfLoverLockAllow") LogDelete("BlockLoverLockSelf", "LoverRule");
		if (data.Content == "LoverRuleSelfLoverLockBlock") LogAdd("BlockLoverLockSelf", "LoverRule");
		if (data.Content == "LoverRuleOwnerLoverLockAllow") LogDelete("BlockLoverLockOwner", "LoverRule");
		if (data.Content == "LoverRuleOwnerLoverLockBlock") LogAdd("BlockLoverLockOwner", "LoverRule");

		data.Type = "ServerMessage";

		ChatRoomGetLoadRules(data.Sender);
	}

	// Returns the data packet
	return data;

}

/**
 * Sends quest money to the player's owner.
 * @returns {void} - Nothing
 */
function ChatRoomGiveMoneyForOwner() {
	if (ChatRoomCanGiveMoneyForOwner()) {
		ServerSend("ChatRoomChat", { Content: "ActionGiveEnvelopeToOwner", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
		ServerSend("ChatRoomChat", { Content: "PayQuest" + ChatRoomMoneyForOwner.toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
		ChatRoomMoneyForOwner = 0;
		DialogLeave();
	}
}

/**
 * Handles the reception of quest data, when payment is received.
 * @param {object} data - Data object containing the payment.
 * @returns {void} - Nothing
 */
function ChatRoomPayQuest(data) {
	if ((data != null) && (data.Sender != null) && (ChatRoomQuestGiven.indexOf(data.Sender) >= 0)) {
		var M = parseInt(data.Content.substring(8));
		if ((M == null) || isNaN(M)) M = 0;
		if (M < 0) M = 0;
		if (M > 30) M = 30;
		CharacterChangeMoney(Player, M);
		ChatRoomQuestGiven.splice(ChatRoomQuestGiven.indexOf(data.Sender), 1);
	}
}

/**
 * Triggered when a game message comes in, we forward it to the current online game being played.
 * @param {object} data - Game data to process, sent to the current game handler.
 * @returns {void} - Nothing
 */
function ChatRoomGameResponse(data) {
	if (data.Data.KinkyDungeon)
		KinkyDungeonHandleData(data.Data.KinkyDungeon, data.Sender);
	else if (ChatRoomGame == "LARP") GameLARPProcess(data);
}

/**
 * Triggered when the player uses the /safeword command, we revert the character if safewords are enabled, and display
 * a warning in chat if not.
 * @returns {void} - Nothing
 */
function ChatRoomSafewordChatCommand() {
	if (DialogChatRoomCanSafeword())
		ChatRoomSafewordRevert();
	else if (CurrentScreen == "ChatRoom") {
		var msg = {Sender: Player.MemberNumber, Content: "SafewordDisabled", Type: "Action"};
		ChatRoomMessage(msg);
	}
}

/**
 * Triggered when the player activates her safeword to revert, we swap her appearance to the state when she entered the
 * chat room lobby, minimum permission becomes whitelist and up.
 * @returns {void} - Nothing
 */
function ChatRoomSafewordRevert() {
	if (ChatSearchSafewordAppearance != null) {
		Player.Appearance = ChatSearchSafewordAppearance.slice(0);
		Player.ActivePose = ChatSearchSafewordPose;
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		ServerSend("ChatRoomChat", { Content: "ActionActivateSafewordRevert", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name }] });
		if (Player.ItemPermission < 3) {
			Player.ItemPermission = 3;
			ServerAccountUpdate.QueueData({ ItemPermission: Player.ItemPermission }, true);
			setTimeout(() => ChatRoomCharacterUpdate(Player), 5000);
		}
	}
}

/**
 * Triggered when the player activates her safeword and wants to be released, we remove all bondage from her and return
 * her to the chat search screen.
 * @returns {void} - Nothing
 */
function ChatRoomSafewordRelease() {
	CharacterReleaseTotal(Player);
	CharacterRefresh(Player);
	ServerSend("ChatRoomChat", { Content: "ActionActivateSafewordRelease", Type: "Action", Dictionary: [{Tag: "SourceCharacter", Text: Player.Name}] });

	DialogLentLockpicks = false;
	ChatRoomClearAllElements();
	ServerSend("ChatRoomLeave", "");
	CommonSetScreen("Online","ChatSearch");
}

/**
 * Concatenates the list of users to ban.
 * @param {boolean} IncludesBlackList - Adds the blacklist to the banlist
 * @param {boolean} IncludesGhostList - Adds the ghostlist to the banlist
 * @param {number[]} [ExistingList] - The existing Banlist, if applicable
 * @returns {number[]} Complete array of members to ban
 */
function ChatRoomConcatenateBanList(IncludesBlackList, IncludesGhostList, ExistingList) {
	var BanList = Array.isArray(ExistingList) ? ExistingList : [];
	if (IncludesBlackList) BanList = BanList.concat(Player.BlackList);
	if (IncludesGhostList) BanList = BanList.concat(Player.GhostList);
	return BanList.filter((MemberNumber, Idx, Arr) => Arr.indexOf(MemberNumber) == Idx);
}

/**
 * Concatenates the list of users for Admin list.
 * @param {boolean} IncludesOwner - Adds the owner to the admin list
 * @param {boolean} IncludesLovers - Adds lovers to the admin list
 * @param {number[]} [ExistingList] - The existing Admin list, if applicable
 * @returns {number[]} Complete array of admin members
 */
function ChatRoomConcatenateAdminList(IncludesOwner, IncludesLovers, ExistingList) {
	var AdminList = Array.isArray(ExistingList) ? ExistingList : [];
	if (IncludesOwner) AdminList = AdminList.concat(Player.Ownership.MemberNumber);
	if (IncludesLovers) CommonArrayConcatDedupe(AdminList, Player.GetLoversNumbers(true));
	return AdminList.filter((MemberNumber, Idx, Arr) => Arr.indexOf(MemberNumber) == Idx);
}

/**
 * Handles a request from another player to read the player's log entries that they are permitted to read. Lovers and
 * owners can read certain entries from the player's log.
 * @param {Character|number} C - A character object representing the requester, or the account number of the requester.
 * @returns {void} - Nothing
 */
function ChatRoomGetLoadRules(C) {
	if (typeof C === "number") {
		C = ChatRoomCharacter.find(CC => CC.MemberNumber == C);
	}
	if (C == null) return;
	if (Player.Ownership && Player.Ownership.MemberNumber != null && Player.Ownership.MemberNumber == C.MemberNumber) {
		ServerSend("ChatRoomChat", {
			Content: "RuleInfoSet",
			Type: "Hidden",
			Target: C.MemberNumber,
			Dictionary: LogGetOwnerReadableRules(C.IsLoverOfPlayer()),
		});
	} else if (C.IsLoverOfPlayer()) {
		ServerSend("ChatRoomChat", {
			Content: "RuleInfoSet",
			Type: "Hidden",
			Target: C.MemberNumber,
			Dictionary: LogGetLoverReadableRules(),
		});
	}
}

/**
 * Handles a response from another player containing the rules that the current player is allowed to read.
 * @param {Character} C - Character to set the rules on
 * @param {LogRecord[]} Rule - An array of rules that the current player can read.
 * @returns {void} - Nothing
 */
function ChatRoomSetLoadRules(C, Rule) {
	if (Array.isArray(Rule)) C.Rule = Rule;
}

/**
 * Take a screenshot of all characters in the chatroom
 * @returns {void} - Nothing
 */
function ChatRoomPhotoFullRoom() {
	// Get the room dimensions
	let Space = ChatRoomCharacterCount >= 2 ? 1000 / Math.min(ChatRoomCharacterCount, 5) : 500;
	let Zoom = ChatRoomCharacterCount >= 3 && ChatRoomCharacterCount < 6 ? Space / 400 : 1;
	let Y = ChatRoomCharacterCount <= 5 ? 1000 * (1 - Zoom) / 2 : 0;
	let Width = ChatRoomCharacterCount === 1 ? 500 : 1000;

	// Take the photo
	ChatRoomPhoto(0, Y, Width, 1000 * Zoom, ChatRoomCharacter);
}

/**
 * Take a screenshot of the player and current character
 * @returns {void} - Nothing
 */
function ChatRoomPhotoCurrentCharacters() {
	ChatRoomPhoto(0, 0, 1000, 1000, [Player, CurrentCharacter]);
}

/**
 * Take a screenshot of the player
 * @returns {void} - Nothing
 */
function DialogChatRoomPhotoPlayer() {
	ChatRoomPhoto(500, 0, 500, 1000, [Player]);
}

/**
 * Take a screenshot in a chatroom, temporary removing emoticons
 * @param {number} Left - Position of the area to capture from the left of the canvas
 * @param {number} Top - Position of the area to capture from the top of the canvas
 * @param {number} Width - Width of the area to capture
 * @param {number} Height - Height of the area to capture
 * @param {any} Characters - The characters that will be included in the screenshot
 * @returns {void} - Nothing
 */
function ChatRoomPhoto(Left, Top, Width, Height, Characters) {
	// Temporarily remove AFK emoticons
	let CharsToReset = [];
	for (let CR = 0; CR < Characters.length; CR++) {
		let C = Characters[CR];
		let Emoticon = C.Appearance.find(A => A.Asset.Group.Name == "Emoticon");
		if (Emoticon && Emoticon.Property && Emoticon.Property.Expression == "Afk") {
			CharsToReset.push(C);
			Emoticon.Property.Expression = null;
			CharacterRefresh(C, false);
		}
	}

	// Take the photo
	CommonTakePhoto(Left, Top, Width, Height);

	// Revert temporary changes
	for (let CR = 0; CR < CharsToReset.length; CR++) {
		let C = CharsToReset[CR];
		C.Appearance.find(A => A.Asset.Group.Name == "Emoticon").Property.Expression = "Afk";
		CharacterRefresh(C, false);
	}
}

/**
 * Returns whether the most recent chat message is on screen
 * @returns {boolean} - TRUE if the screen has focus and the chat log is scrolled to the bottom
 */
function ChatRoomNotificationNewMessageVisible() {
	return document.hasFocus() && ElementIsScrolledToEnd("TextAreaChatLog");
}

/**
 * Raise a notification for the new chat message if required
 * @param {Character} C - The character that sent the message
 * @param {string} msg - The text of the message
 * @returns {void} - Nothing
 */
function ChatRoomNotificationRaiseChatMessage(C, msg) {
	if (C.ID !== 0
		&& Player.NotificationSettings.ChatMessage.AlertType !== NotificationAlertType.NONE
		&& !ChatRoomNotificationNewMessageVisible())
	{
		NotificationRaise(NotificationEventType.CHATMESSAGE, { body: msg, character: C, useCharAsIcon: true });
	}
}

/**
 * Resets any previously raised Chat Message or Chatroom Join notifications if required
 * @returns {void} - Nothing
 */
function ChatRoomNotificationReset() {
	if (CurrentScreen !== "ChatRoom" || ChatRoomNotificationNewMessageVisible()) {
		NotificationReset(NotificationEventType.CHATMESSAGE);
	}
	if (document.hasFocus()) NotificationReset(NotificationEventType.CHATJOIN);
}

/**
 * Returns whether a notification should be raised for the character entering a chatroom
 * @param {Character} C - The character that entered the room
 * @returns {boolean} - Whether a notification should be raised
 */
function ChatRoomNotificationRaiseChatJoin(C) {
	let raise = false;
	if (!document.hasFocus()) {
		const settings = Player.NotificationSettings.ChatJoin;
		if (settings.AlertType === NotificationAlertType.NONE) raise = false;
		else if (!settings.Owner && !settings.Lovers && !settings.Friendlist && !settings.Subs) raise = true;
		else if (settings.Owner && C.IsOwner()) raise = true;
		else if (settings.Lovers && C.IsLoverOfPlayer()) raise = true;
		else if (settings.Friendlist && Player.FriendList.includes(C.MemberNumber)) raise = true;
		else if (settings.Subs && C.IsOwnedByPlayer()) raise = true;
	}
	return raise;
}

/**
 * Updates the chatroom with the player's stored chatroom data if needed (happens when entering a recreated chatroom for
 * the first time)
 * @returns {void} - Nothing
 */
function ChatRoomRecreate() {
	if (CurrentTime > ChatRoomNewRoomToUpdateTimer && ChatRoomNewRoomToUpdate && Player.ImmersionSettings && Player.ImmersionSettings.ReturnToChatRoomAdmin &&
		Player.ImmersionSettings.ReturnToChatRoom && Player.LastChatRoomAdmin) {
		// Add the player if they are not an admin
		if (!Player.LastChatRoomAdmin.includes(Player.MemberNumber) && Player.LastChatRoomPrivate) {
			Player.LastChatRoomAdmin.push(Player.MemberNumber);
		}
		var UpdatedRoom = {
			Name: Player.LastChatRoom,
			Description: Player.LastChatRoomDesc,
			Background: Player.LastChatRoomBG,
			Limit: "" + Player.LastChatRoomSize,
			Admin: Player.LastChatRoomAdmin,
			Ban: ChatRoomData.Ban,
			BlockCategory: ChatRoomData.BlockCategory,
			Game: ChatRoomData.Game,
			Private: Player.LastChatRoomPrivate,
			Locked: ChatRoomData.Locked,
		};
		
		ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: UpdatedRoom, Action: "Update" });
		ChatRoomNewRoomToUpdate = null;
	}
}

/**
 * Checks whether or not the player's last chatroom data needs updating
 * @returns {void} - Nothing
 */
function ChatRoomCheckForLastChatRoomUpdates() {
	const Blacklist = Player.BlackList || [];
	// Check whether the chatroom contains at least one "safe" character (a friend, owner, or non-blacklisted player)
	const ContainsSafeCharacters = ChatRoomCharacter.length === 1 || ChatRoomCharacter.some((Char) => {
		return Char.ID !== 0 && (
			Player.FriendList.includes(Char.MemberNumber) ||
			Player.IsOwnedByMemberNumber(Char.MemberNumber) ||
			!Blacklist.includes(Char.MemberNumber)
		);
	});

	if (!ChatRoomData || !ContainsSafeCharacters) {
		// If the room only contains blacklisted characters, do not save the room data
		ChatRoomSetLastChatRoom("");
	} else if (Player.ImmersionSettings && ChatRoomDataChanged()) {
		// Otherwise save the chatroom data if it has changed
		ChatRoomSetLastChatRoom(ChatRoomData.Name);
	}
}

/**
 * Determines whether or not the current chatroom data differs from the locally stroed chatroom data
 * @returns {boolean} - TRUE if the stored chatroom data is different from the current chatroom data, FALSE otherwise
 */
function ChatRoomDataChanged() {
	return ChatRoomLastName != ChatRoomData.Name ||
		ChatRoomLastBG != ChatRoomData.Background ||
		ChatRoomLastSize != ChatRoomData.Limit ||
		ChatRoomLastPrivate != ChatRoomData.Private ||
		ChatRoomLastDesc != ChatRoomData.Description ||
		!CommonArraysEqual(ChatRoomLastAdmin, ChatRoomData.Admin);
}

function ChatRoomRefreshFontSize() {
	ChatRoomFontSize = ChatRoomFontSizes[Player.ChatSettings.FontSize || "Medium"];
}
