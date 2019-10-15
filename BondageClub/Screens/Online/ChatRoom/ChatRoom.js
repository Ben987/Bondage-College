"use strict";
var ChatRoomBackground = "";
var ChatRoomData = {};
var ChatRoomCharacter = [];
var ChatRoomLog = "";
var ChatRoomLastMessage = [""];
var ChatRoomLastMessageIndex = 0;
var ChatRoomTargetMemberNumber = null;
var ChatRoomOwnershipOption = "";
var ChatRoomPlayerCanJoin = false;
var ChatRoomMoneyForOwner = 0;
var ChatRoomQuestGiven = [];
var ChatRoomSpace = "";

// Returns TRUE if the dialog option is available
function ChatRoomCanAddWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
function ChatRoomCanAddBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
function ChatRoomCanRemoveWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
function ChatRoomCanRemoveBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
function ChatRoomCanAddFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
function ChatRoomCanRemoveFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
function ChatRoomCanChangeClothes() { return (Player.CanInteract() && (CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && CurrentCharacter.AllowItem && !((InventoryGet(CurrentCharacter, "ItemNeck") != null) && (InventoryGet(CurrentCharacter, "ItemNeck").Asset.Name == "ClubSlaveCollar"))) }
function ChatRoomOwnershipOptionIs(Option) { return (Option == ChatRoomOwnershipOption) }
function ChatRoomCanTakeDrink() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (CurrentCharacter.ID != 0) && Player.CanInteract() && (InventoryGet(CurrentCharacter, "ItemMisc") != null) && (InventoryGet(CurrentCharacter, "ItemMisc").Asset.Name == "WoodenMaidTrayFull")) }
function ChatRoomIsCollaredByPlayer() { return ((CurrentCharacter != null) && (CurrentCharacter.Ownership != null) && (CurrentCharacter.Ownership.Stage == 1) && (CurrentCharacter.Ownership.MemberNumber == Player.MemberNumber)) }
function ChatRoomCanServeDrink() { return ((CurrentCharacter != null) && CurrentCharacter.CanWalk() && (ReputationCharacterGet(CurrentCharacter, "Maid") > 0)) }
function ChatRoomCanGiveMoneyForOwner() { return ((ChatRoomMoneyForOwner > 0) && (CurrentCharacter != null) && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (Player.Ownership.MemberNumber == CurrentCharacter.MemberNumber)) }
function ChatRoomPlayerIsAdmin() { return ((ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(Player.MemberNumber) >= 0)) }
function ChatRoomCurrentCharacterIsAdmin() { return ((CurrentCharacter != null) && (ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(CurrentCharacter.MemberNumber) >= 0)) }

// Creates the chat room input elements
function ChatRoomCreateElement() {
	if (document.getElementById("InputChat") == null) {
		ElementCreateInput("InputChat", "text", "", "250");
		document.getElementById("InputChat").setAttribute("autocomplete", "off");
		ElementCreateDiv("TextAreaChatLog");
		ElementPositionFix("TextAreaChatLog", 36, 1005, 5, 988, 923);
		ElementContent("TextAreaChatLog", ChatRoomLog);
		ElementScrollToEnd("TextAreaChatLog");
		if (Player.ChatSettings) {
			for (var property in Player.ChatSettings) {
				ElementSetDataAttribute("TextAreaChatLog", property, Player.ChatSettings[property]);
			}
		}
		ElementFocus("InputChat");
	}
}

// When the chat room loads
function ChatRoomLoad() {
	ElementRemove("InputSearch");
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ChatRoomCreateElement();
}

// Draw the characters in the room
function ChatRoomDrawCharacter(DoClick) {

	// If there's 2 characters, it's zoomed in
	if (!DoClick && (Player.Effect.indexOf("BlindHeavy") < 0) && (Player.Effect.indexOf("BlindNormal") < 0)) {
		var Dark = (Player.Effect.indexOf("BlindLight") < 0) ? "" : "Dark";
		if (ChatRoomCharacter.length <= 2) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + Dark + ".jpg", MainCanvas, 500, 0, 1000, 1000, 0, 0, 1000, 1000);
		if (ChatRoomCharacter.length == 3) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + Dark + ".jpg", MainCanvas, 400, 0, 1200, 1000, 0, 50, 1000, 900);
		if (ChatRoomCharacter.length == 4) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + Dark + ".jpg", MainCanvas, 200, 0, 1600, 1000, 0, 150, 1000, 700);
		if (ChatRoomCharacter.length == 5) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + Dark + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 250, 1000, 500);
		if (ChatRoomCharacter.length >= 6) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + Dark + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 0, 1000, 500);
	}

	// Sets the X position
	var X = 0;
	var Space = 500;	
	if (ChatRoomCharacter.length == 3) Space = 333;
	if (ChatRoomCharacter.length == 4) Space = 250;
	if (ChatRoomCharacter.length >= 5) Space = 200;
	if (ChatRoomCharacter.length >= 3) X = (Space / -5);
	
	// Sets the Y position
	var Y = 0;
	if (ChatRoomCharacter.length == 3) Y = 50;
	if (ChatRoomCharacter.length == 4) Y = 150;
	if (ChatRoomCharacter.length == 5) Y = 250;
	
	// Sets the zoom factor
	var Zoom = 1;
	if (ChatRoomCharacter.length == 3) Zoom = 0.9;
	if (ChatRoomCharacter.length == 4) Zoom = 0.7;
	if (ChatRoomCharacter.length >= 5) Zoom = 0.5;

	// Draw the characters (in click mode, we can open the character menu or start whispering to them)
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if (DoClick) {
			if ((MouseX >= (C % 5) * Space + X) && (MouseX <= (C % 5) * Space + X + 450 * Zoom) && (MouseY >= Y + Math.floor(C / 5) * 500) && (MouseY <= Y + Math.floor(C / 5) * 500 + 1000 * Zoom)) {
				if (MouseY <= Y + Math.floor(C / 5) * 500 + 900 * Zoom) {
					ElementRemove("InputChat");
					ElementRemove("TextAreaChatLog");
					ChatRoomBackground = ChatRoomData.Background;
					ChatRoomCharacter[C].AllowItem = (ChatRoomCharacter[C].ID == 0);
					ChatRoomOwnershipOption = "";
					if (ChatRoomCharacter[C].ID != 0) ServerSend("ChatRoomAllowItem", { MemberNumber: ChatRoomCharacter[C].MemberNumber });
					if (ChatRoomCharacter[C].ID != 0) ServerSend("AccountOwnership", { MemberNumber: ChatRoomCharacter[C].MemberNumber });
					CharacterSetCurrent(ChatRoomCharacter[C]);
				} else {
					if (!LogQuery("BlockWhisper", "OwnerRule") || (Player.Ownership == null) || (Player.Ownership.Stage != 1) || (Player.Ownership.MemberNumber == ChatRoomCharacter[C].MemberNumber))
						ChatRoomTargetMemberNumber = ((ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber) || (ChatRoomCharacter[C].ID == 0)) ? null : ChatRoomCharacter[C].MemberNumber;
				}
				break;
			}
		}
		else {
			
			// Draw the background a second time for characters 6 to 10 (we do it here to correct clipping errors from the first part)
			if ((C == 5) && (Player.Effect.indexOf("BlindHeavy") < 0) && (Player.Effect.indexOf("BlindNormal") < 0)) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ((Player.Effect.indexOf("BlindLight") < 0) ? "" : "Dark") + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 500, 1000, 500);

			// Draw the character
			DrawCharacter(ChatRoomCharacter[C], (C % 5) * Space + X, Y + Math.floor(C / 5) * 500, Zoom);
			if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber) DrawImage("Icons/Small/Whisper.png", (C % 5) * Space + X + 75 * Zoom, Y + Math.floor(C / 5) * 500 + 950 * Zoom);
			
			// Draw the friendlist / blacklist / whitelist icons
			if (ChatRoomCharacter[C].MemberNumber != null) {
				if (Player.WhiteList.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) DrawImage("Icons/Small/WhiteList.png", (C % 5) * Space + X + 75 * Zoom, Y + Math.floor(C / 5) * 500);
				else if (Player.BlackList.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) DrawImage("Icons/Small/BlackList.png", (C % 5) * Space + X + 75 * Zoom, Y + Math.floor(C / 5) * 500);
				if (Player.FriendList.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) DrawImage("Icons/Small/FriendList.png", (C % 5) * Space + X + 375 * Zoom, Y + Math.floor(C / 5) * 500);
			}

		}

}

// Sets the whisper target
function ChatRoomTarget() {
	var TargetName = null;
	if (ChatRoomTargetMemberNumber != null) {
		for (var C = 0; C < ChatRoomCharacter.length; C++)
			if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber)
				TargetName = ChatRoomCharacter[C].Name;
		if (TargetName == null) ChatRoomTargetMemberNumber = null;
	}
	document.getElementById("InputChat").placeholder = (ChatRoomTargetMemberNumber == null) ? TextGet("PublicChat") : TextGet("WhisperTo") + " " + TargetName;
}

// When the chat room runs
function ChatRoomRun() {	
	ChatRoomCreateElement();
	ChatRoomTarget();
	ChatRoomBackground = "";
	DrawRect(0, 0, 2000, 1000, "Black");
	ChatRoomDrawCharacter(false);
	ElementPosition("InputChat", 1339, 959, 668);
	ElementPositionFix("TextAreaChatLog", 36, 1005, 5, 988, 923);
	DrawButton(1675, 935, 60, 60, "", "White", "Icons/Small/Chat.png");
	if (Player.CanKneel()) DrawButton(1740, 935, 60, 60, "", "White", "Icons/Small/Kneel.png");
	if (Player.CanChange()) DrawButton(1805, 935, 60, 60, "", "White", "Icons/Small/Dress.png");
	DrawButton(1870, 935, 60, 60, "", "White", "Icons/Small/Character.png");
	if (Player.CanWalk()) DrawButton(1935, 935, 60, 60, "", "White", "Icons/Small/Exit.png");
}

// When the player clicks in the chat room
function ChatRoomClick() {
	
	// When the user chats
	if ((MouseX >= 0) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) ChatRoomDrawCharacter(true);
	if ((MouseX >= 1675) && (MouseX < 1735) && (MouseY >= 935) && (MouseY < 995)) ChatRoomSendChat();
	
	// When the player kneels
	if ((MouseX >= 1740) && (MouseX < 1800) && (MouseY >= 935) && (MouseY < 995) && Player.CanKneel()) { 
		ServerSend("ChatRoomChat", { Content: Player.Name + " " + TextGet((Player.ActivePose == null) ? "KneelDown": "StandUp"), Type: "Action" } );
		CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
		ChatRoomCharacterUpdate(Player);
	}
	
	// When the user wants to change clothes
	if ((MouseX >= 1805) && (MouseX < 1865) && (MouseY >= 935) && (MouseY < 995) && Player.CanChange()) { 
		ElementRemove("InputChat");
		ElementRemove("TextAreaChatLog");
		CharacterAppearanceReturnRoom = "ChatRoom"; 
		CharacterAppearanceReturnModule = "Online";
		CharacterAppearanceLoadCharacter(Player);
	}

	// When the user checks her profile
	if ((MouseX >= 1870) && (MouseX < 1930) && (MouseY >= 935) && (MouseY < 995)) {
		ElementRemove("InputChat");
		ElementRemove("TextAreaChatLog");
		InformationSheetLoadCharacter(Player);
	}

	// When the user leaves
	if ((MouseX >= 1935) && (MouseX < 1995) && (MouseY >= 935) && (MouseY < 995) && (Player.CanWalk())) {
		ElementRemove("InputChat");
		ElementRemove("TextAreaChatLog");
		ServerSend("ChatRoomLeave", "");
		CommonSetScreen("Online", "ChatSearch");
	}

}

// Chat room keyboard shortcuts
function ChatRoomKeyDown() {

	// The ENTER key sends the chat
	if (KeyPress == 13) ChatRoomSendChat();

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

}

// Sends the chat to everyone in the room
function ChatRoomSendChat() {

	// If there's a message to send
	var msg = ElementValue("InputChat").trim()
	if (msg != "") {

		// Keeps the chat log in memory so it can be accessed with pageup/pagedown
		ChatRoomLastMessage.push(msg);
		ChatRoomLastMessageIndex = ChatRoomLastMessage.length;
		var m = msg.toLowerCase().trim();
		
		// Some custom functions like /dice or /coin are implemented for randomness
		if (m.indexOf("/dice") == 0) {
			
			// The player can roll a dice, if no size is specified, a 6 sided dice is assumed
			var Dice = (isNaN(parseInt(msg.substring(5, 50).trim()))) ? 6 : parseInt(msg.substring(5, 50).trim());
			if ((Dice < 4) || (Dice > 100)) Dice = 6;
			msg = TextGet("ActionDice");
			msg = msg.replace("SourceCharacter", Player.Name);
			msg = msg.replace("DiceType", Dice.toString());
			msg = msg.replace("DiceResult", (Math.floor(Math.random() * Dice) + 1).toString());
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action" } );

		} else if (m.indexOf("/coin") == 0) {

			// The player can flip a coin, heads or tails are 50/50
			msg = TextGet("ActionCoin");
			var Heads = (Math.random() >= 0.5);
			msg = msg.replace("SourceCharacter", Player.Name);
			msg = msg.replace("CoinResult", Heads ? TextGet("Heads") : TextGet("Tails"));
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action" } );

		} else if ((m.indexOf("*") == 0) || (m.indexOf("/me ") == 0)) {

			// The player can emote an action using * or /me (for those IRC or Skype users), it doesn't garble
			msg = msg.replace(/\*/g, "");
			msg = msg.replace(/\/me /g, "");
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" } );

		}
		else if (m.indexOf("/friendlistadd ") == 0) ChatRoomListManipulation(Player.FriendList, null, msg);
		else if (m.indexOf("/friendlistremove ") == 0) ChatRoomListManipulation(null, Player.FriendList, msg);
		else if (m.indexOf("/whitelistadd ") == 0) ChatRoomListManipulation(Player.WhiteList, Player.BlackList, msg);
		else if (m.indexOf("/whitelistremove ") == 0) ChatRoomListManipulation(null, Player.WhiteList, msg);
		else if (m.indexOf("/blacklistadd ") == 0) ChatRoomListManipulation(Player.BlackList, Player.WhiteList, msg);
		else if (m.indexOf("/blacklistremove ") == 0) ChatRoomListManipulation(null, Player.BlackList, msg);
		else if (m.indexOf("/ban ") == 0) ChatRoomAdminChatAction("Ban", msg);
		else if (m.indexOf("/unban ") == 0) ChatRoomAdminChatAction("Unban", msg);
		else if (m.indexOf("/kick ") == 0) ChatRoomAdminChatAction("Kick", msg);
		else if (m.indexOf("/promote ") == 0) ChatRoomAdminChatAction("Promote", msg);
		else if (m.indexOf("/demote ") == 0) ChatRoomAdminChatAction("Demote", msg);
		else {

			// Regular chat can be garbled with a gag
			msg = SpeechGarble(Player, msg);
			if ((msg != "") && (ChatRoomTargetMemberNumber == null)) ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" } );

			// The whispers get sent to the server and shown on the client directly
			if ((msg != "") && (ChatRoomTargetMemberNumber != null)) {
				ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: ChatRoomTargetMemberNumber });
				var TargetName = "";
				for (var C = 0; C < ChatRoomCharacter.length; C++)
					if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber)
						TargetName = ChatRoomCharacter[C].Name;
				var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
				var DataAttributes = 'data-time="' + ChatRoomCurrentTime() + '" data-sender="' + Player.MemberNumber.toString() + '"';
				ChatRoomLog = ChatRoomLog + '<div class="ChatMessage ChatMessageWhisper" ' + DataAttributes + '>' + TextGet("WhisperTo") + " " + TargetName + ": " + msg + '</div>';
				if (document.getElementById("TextAreaChatLog") != null) {
					ElementContent("TextAreaChatLog", ChatRoomLog);
					if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
					ElementFocus("InputChat");
				}
			}

		}

		// Clears the chat text message
		ElementValue("InputChat", "");
	
	}

}

// Publishes the player action (add, remove, swap) to the chat
function ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem, LeaveDialog) {
	if (CurrentScreen == "ChatRoom") {

		// Prepares the message
		var msg = "";
		if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && !DialogProgressNextItem.Asset.IsLock) msg = TextGet("ActionSwap");
		else if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && DialogProgressNextItem.Asset.IsLock) msg = TextGet("ActionAddLock");
		else if (InventoryItemHasEffect(DialogProgressNextItem, "Lock")) msg = TextGet("ActionLock");
		else if (DialogProgressNextItem != null) msg = TextGet("ActionUse");
		else if (InventoryItemHasEffect(DialogProgressPrevItem, "Lock")) msg = TextGet("ActionUnlock");
		else msg = TextGet("ActionRemove");
		
		// Replaces the action tags to build the phrase
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("DestinationCharacter", (C.ID == 0) ? TextGet("Her") : C.Name + TextGet("'s"));
		if (DialogProgressPrevItem != null) msg = msg.replace("PrevAsset", DialogProgressPrevItem.Asset.DynamicDescription().toLowerCase());
		if (DialogProgressNextItem != null) msg = msg.replace("NextAsset", DialogProgressNextItem.Asset.DynamicDescription().toLowerCase());
		if (C.FocusGroup != null) msg = msg.replace("FocusAssetGroup", C.FocusGroup.Description.toLowerCase());
 
		// Sends the result to the server and leaves the dialog if we need to
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action" } );
		ChatRoomCharacterUpdate(C);
		if (LeaveDialog && (CurrentCharacter != null)) DialogLeave();

	}
}

// Publishes a custom action to the chat
function ChatRoomPublishCustomAction(msg, LeaveDialog) {
	if (CurrentScreen == "ChatRoom") {
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action" } );
		ChatRoomCharacterUpdate(CurrentCharacter);
		if (LeaveDialog && (CurrentCharacter != null)) DialogLeave();
	}
}

// Pushes the new character data/appearance to the server
function ChatRoomCharacterUpdate(C) {
	var data = {
		ID: (C.ID == 0) ? Player.OnlineID : C.AccountName.replace("Online-", ""),
		ActivePose: C.ActivePose,
		Appearance: ServerAppearanceBundle(C.Appearance)
	};
	ServerSend("ChatRoomCharacterUpdate", data);
}

// When the server sends a chat message
function ChatRoomMessage(data) {

	// Make sure the message is valid (needs a Sender and Content)
	if ((data != null) && (typeof data === "object") && (data.Content != null) && (typeof data.Content === "string") && (data.Content != "") && (data.Sender != null) && (typeof data.Sender === "number") && (data.Sender > 0)) {

		// Make sure the sender is in the room
		var SenderCharacter = null;
		for(var C = 0; C < ChatRoomCharacter.length; C++)
			if (ChatRoomCharacter[C].MemberNumber == data.Sender) {
				SenderCharacter = ChatRoomCharacter[C]
				break;
			}

		// If we found the sender
		if (SenderCharacter != null) {

			// Replace < and > characters to prevent HTML injections
			var msg = data.Content;
			while (msg.indexOf("<") > -1) msg = msg.replace("<", "&lt;");
			while (msg.indexOf(">") > -1) msg = msg.replace(">", "&gt;");

			// Hidden messages are processed separately, they are used by chat room mini-games
			if ((data.Type != null) && (data.Type == "Hidden")) {
				if (msg == "MaidDrinkPick0") MaidQuartersOnlineDrinkPick(data.Sender, 0);
				if (msg == "MaidDrinkPick5") MaidQuartersOnlineDrinkPick(data.Sender, 5);
				if (msg == "MaidDrinkPick10") MaidQuartersOnlineDrinkPick(data.Sender, 10);
				if (msg.substring(0, 8) == "PayQuest") ChatRoomPayQuest(data);
				if (msg.substring(0, 9) == "OwnerRule") data = ChatRoomSetRule(data);
				if (data.Type == "Hidden") return;
			}

			// [Temporary?] Checks if the message is a notification about the user entering or leaving the room
			var enterLeave = "";
			if ((data.Type == "Action") && (msg.startsWith(SenderCharacter.Name + " entered.") || msg.startsWith(SenderCharacter.Name + " left.") || msg.startsWith(SenderCharacter.Name + " disconnected.") || msg.startsWith(SenderCharacter.Name + " was banned by ") || msg.startsWith(SenderCharacter.Name + " was kicked-out by "))) {
				enterLeave = " ChatMessageEnterLeave";
			}

			// Builds the message to add depending on the type
			if ((data.Type != null) && (data.Type == "Chat") && Player.IsDeaf()) msg = '<span class="ChatMessageName" style="color:' + (SenderCharacter.LabelColor || 'gray') + ';">' + SenderCharacter.Name + ':</span> ' + SpeechGarble(SenderCharacter, msg);
			if ((data.Type != null) && (data.Type == "Chat") && !Player.IsDeaf()) msg = '<span class="ChatMessageName" style="color:' + (SenderCharacter.LabelColor || 'gray') + ';">' + SenderCharacter.Name + ':</span> ' + msg;
			if ((data.Type != null) && (data.Type == "Whisper")) msg = '<span class="ChatMessageName" style="font-style: italic; color:' + (SenderCharacter.LabelColor || 'gray') + ';">' + SenderCharacter.Name + ':</span> ' + msg;
			if ((data.Type != null) && (data.Type == "Emote")) msg = "*" + SenderCharacter.Name + " " + msg + "*";
			if ((data.Type != null) && (data.Type == "Action")) msg = "(" + msg + ")";
			if ((data.Type != null) && (data.Type == "ServerMessage")) msg = "<b>" + DialogFind(Player, "ServerMessage" + msg).replace("SourceCharacter", SenderCharacter.Name) + "</b>";

			// Adds the message and scrolls down unless the user has scrolled up
			var ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
			var DataAttributes = 'data-time="' + ChatRoomCurrentTime() + '" data-sender="' + data.Sender + '"';
			var BackgroundColor = ((data.Type == "Emote" || data.Type == "Action") ? 'style="background-color:' + ChatRoomGetTransparentColor(SenderCharacter.LabelColor) + ';"' : "");
			ChatRoomLog = ChatRoomLog + '<div class="ChatMessage ChatMessage' + data.Type + enterLeave + '" ' + DataAttributes + ' ' + BackgroundColor + '>' + msg + '</div>';
			if (document.getElementById("TextAreaChatLog") != null) {
				ElementContent("TextAreaChatLog", ChatRoomLog);
				if (ShouldScrollDown) ElementScrollToEnd("TextAreaChatLog");
				ElementFocus("InputChat");
			}

		}

	}

}

// Gets the new room data from the server
function ChatRoomSync(data) {
	if ((data != null) && (typeof data === "object") && (data.Name != null)) {

		// Load the room
		if ((CurrentScreen != "ChatRoom") && (CurrentScreen != "Appearance") && (CurrentModule != "Character")) {
			if (ChatRoomPlayerCanJoin) {
				ChatRoomPlayerCanJoin = false;
				CommonSetScreen("Online", "ChatRoom");
			} else return;
		}

		// Load the characters
		ChatRoomCharacter = [];
		for (var C = 0; C < data.Character.length; C++)
			ChatRoomCharacter.push(CharacterLoadOnline(data.Character[C], data.SourceMemberNumber));

		// Keeps a copy of the previous version
		ChatRoomData = data;

	}
}

// If we must show the character profile (information sheet)
function ChatRoomViewProfile() {
	if (CurrentCharacter != null) {
		var C = CurrentCharacter;
		DialogLeave();
		InformationSheetLoadCharacter(C);
	}
}

// Sends an administrative command to the server for the chat room from the character dialog
function ChatRoomAdminAction(ActionType) {
	if ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && ChatRoomPlayerIsAdmin()) {
		ServerSend("ChatRoomAdmin", { MemberNumber: CurrentCharacter.MemberNumber, Action: ActionType });
		DialogLeave();
	}
}

// Sends an administrative command to the server from the chat text field
function ChatRoomAdminChatAction(ActionType, Message) {
	if (ChatRoomPlayerIsAdmin()) {
		var C = parseInt(Message.substring(Message.indexOf(" ") + 1));
		if (!isNaN(C) && (C > 0) && (C != Player.MemberNumber))
			ServerSend("ChatRoomAdmin", { MemberNumber: C, Action: ActionType });
	}
}

// Returns the User's current local time as a displayable string
function ChatRoomCurrentTime() {
	var D = new Date();
	return ("0" + D.getHours()).substr(-2) + ":" + ("0" + D.getMinutes()).substr(-2);
}

// Returns a transparent version of the specified hex color
function ChatRoomGetTransparentColor(Color) {
	if (!Color) return "rgba(128,128,128,0.1)";
	var R = Color.substring(1, 3), G = Color.substring(3, 5), B = Color.substring(5, 7);
	return "rgba(" + parseInt(R, 16) + "," + parseInt(G, 16) + "," + parseInt(B, 16) + ",0.1)";
}

// Adds or remove an online member to/from a specific list
function ChatRoomListManage(Operation, ListType) {
	if (((Operation == "Add" || Operation == "Remove")) && (CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player[ListType] != null) && Array.isArray(Player[ListType])) {
		if ((Operation == "Add") && (Player[ListType].indexOf(CurrentCharacter.MemberNumber) < 0)) Player[ListType].push(CurrentCharacter.MemberNumber);
		if ((Operation == "Remove") && (Player[ListType].indexOf(CurrentCharacter.MemberNumber) >= 0)) Player[ListType].splice(Player[ListType].indexOf(CurrentCharacter.MemberNumber), 1);
		var data = {};
		data[ListType] = Player[ListType];
		ServerSend("AccountUpdate", data);
	}
}

// Modify the player FriendList/WhiteList/BlackList based on typed message
function ChatRoomListManipulation(Add, Remove, Message) {
	var C = parseInt(Message.substring(Message.indexOf(" ") + 1));
	if (!isNaN(C) && (C > 0) && (C != Player.MemberNumber)) {
		if ((Add != null) && (Add.indexOf(C) < 0)) Add.push(C);
		if ((Remove != null) && (Remove.indexOf(C) >= 0)) Remove.splice(Remove.indexOf(C), 1);
		ServerSend("AccountUpdate", { FriendList: Player.FriendList, WhiteList: Player.WhiteList, BlackList: Player.BlackList });
	}
}

// When the server returns if applying an item is allowed
function ChatRoomAllowItem(data) {
	if ((data != null) && (typeof data === "object") && (data.MemberNumber != null) && (typeof data.MemberNumber === "number") && (data.AllowItem != null) && (typeof data.AllowItem === "boolean"))
		if ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber == data.MemberNumber)) {
			CurrentCharacter.AllowItem = data.AllowItem;
			CharacterSetCurrent(CurrentCharacter);
		}
}

// When the player wants to change another player's outfit
function ChatRoomChangeClothes() {
	var C = CurrentCharacter;
	DialogLeave();
	CharacterAppearanceLoadCharacter(C);
}

// When the player selects an ownership dialog option (can change money and reputation)
function ChatRoomSendOwnershipRequest(RequestType) {
	if ((ChatRoomOwnershipOption == "CanOfferEndTrial") && (RequestType == "Propose")) { CharacterChangeMoney(Player, -100); DialogChangeReputation("Dominant", 10); }
	if ((ChatRoomOwnershipOption == "CanEndTrial") && (RequestType == "Accept")) DialogChangeReputation("Dominant", -20);
	ChatRoomOwnershipOption = "";
	ServerSend("AccountOwnership", { MemberNumber: CurrentCharacter.MemberNumber, Action: RequestType });
	if (RequestType == "Accept") DialogLeave();
}

// When the player picks a drink from a maid platter
function ChatRoomDrinkPick(DrinkType, Money) {
	if (ChatRoomCanTakeDrink()) {
		ServerSend("ChatRoomChat", { Content: Player.Name + " " + DialogFind(CurrentCharacter, "MaidDrinkPick" + DrinkType), Type: "Action" } );
		ServerSend("ChatRoomChat", { Content: "MaidDrinkPick" + Money.toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber } );
		CharacterChangeMoney(Player, Money * -1);
		DialogLeave();
	}
}

// Sends a rule / restriction / punishment to the slave character client, it will be handled from there
function ChatRoomSendRule(RuleType, Option) {
	ServerSend("ChatRoomChat", { Content: "OwnerRule" + RuleType, Type: "Hidden", Target: CurrentCharacter.MemberNumber } );
	if (Option == "Quest") {
		if (ChatRoomQuestGiven.indexOf(CurrentCharacter.MemberNumber) >= 0) ChatRoomQuestGiven.splice(ChatRoomQuestGiven.indexOf(CurrentCharacter.MemberNumber), 1);
		ChatRoomQuestGiven.push(CurrentCharacter.MemberNumber);
	}
	if ((Option == "Leave") || (Option == "Quest")) DialogLeave();
}

// Sends the rule / restriction / punishment from the owner
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
		if (data.Content == "OwnerRuleWhisperBlock") { LogAdd("BlockWhisper", "OwnerRule"); ChatRoomTargetMemberNumber = null; }

		// Key rules
		if (data.Content == "OwnerRuleKeyAllow") LogDelete("BlockKey", "OwnerRule");
		if (data.Content == "OwnerRuleKeyConfiscate") InventoryConfiscateKey();
		if (data.Content == "OwnerRuleKeyBlock") LogAdd("BlockKey", "OwnerRule");

		// Timer cell punishment
		var TimerCell = 0;
		if (data.Content == "OwnerRuleTimerCell5") TimerCell = 5;
		if (data.Content == "OwnerRuleTimerCell15") TimerCell = 15;
		if (data.Content == "OwnerRuleTimerCell30") TimerCell = 30;
		if (data.Content == "OwnerRuleTimerCell60") TimerCell = 60;
		if (TimerCell > 0) {
			ServerSend("ChatRoomChat", { Content: Player.Name + " " + TextGet("ActionGrabbedForCell"), Type: "Action" } );
			ElementRemove("InputChat");
			ElementRemove("TextAreaChatLog");
			ServerSend("ChatRoomLeave", "");
			CellLock(TimerCell);
		}

		// Forced labor
		if (data.Content == "OwnerRuleLaborMaidDrinks") {
			CharacterSetActivePose(Player, null);
			InventoryRemove(Player, "ItemMouth");
			ChatRoomCharacterUpdate(Player);
			var D = TextGet("ActionGrabbedToServeDrinksIntro");
			ServerSend("ChatRoomChat", { Content: Player.Name + " " + TextGet("ActionGrabbedToServeDrinks"), Type: "Action" } );
			ElementRemove("InputChat");
			ElementRemove("TextAreaChatLog");
			ServerSend("ChatRoomLeave", "");
			CommonSetScreen("Room", "MaidQuarters");
			CharacterSetCurrent(MaidQuartersMaid);
			MaidQuartersMaid.CurrentDialog = D;
			MaidQuartersMaid.Stage = "205";
			MaidQuartersOnlineDrinkFromOwner = true;
		}

		// Switches it to a server message to announce the new rule to the player
		data.Type = "ServerMessage";

	}

	// Returns the data packet
	return data;

}

// When a slave gives her salary to her owner
function ChatRoomGiveMoneyForOwner() {
	if (ChatRoomCanGiveMoneyForOwner()) {
		ServerSend("ChatRoomChat", { Content: Player.Name + " " + TextGet("ActionGiveEnvelopeToOwner"), Type: "Action" } );
		ServerSend("ChatRoomChat", { Content: "PayQuest" + ChatRoomMoneyForOwner.toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber } );
		ChatRoomMoneyForOwner = 0;
		DialogLeave();
	}
}

// When a quest is paid
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