"use strict";
var ChatRoomBackground = "";
var ChatRoomData = {};
var ChatRoomCharacter = [];
var ChatRoomLog = "";
var ChatRoomLastMessage = [""];
var ChatRoomLastMessageIndex = 0;

// Creates the chat room input elements
function ChatRoomCreateElement() {
	if (document.getElementById("InputChat") == null) {
		ElementCreateInput("InputChat", "text", "", "250");
		document.getElementById("InputChat").setAttribute("autocomplete", "off");
		ElementCreateTextArea("TextAreaChatLog");
		ElementValue("TextAreaChatLog", ChatRoomLog);
		ElementScrollToEnd("TextAreaChatLog");
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
		if (ChatRoomCharacter.length >= 6) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + Dark + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 500, 1000, 500);
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

	// Draw the characters
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if (DoClick) {
			if ((MouseX >= (C % 5) * Space + X) && (MouseX <= (C % 5) * Space + X + 450 * Zoom) && (MouseY >= Y + Math.floor(C / 5) * 500) && (MouseY <= Y + Math.floor(C / 5) * 500 + 1000 * Zoom)) {
				ElementRemove("InputChat");
				ElementRemove("TextAreaChatLog");
				ChatRoomBackground = ChatRoomData.Background;
				CharacterSetCurrent(ChatRoomCharacter[C]);
				break;
			}
		}
		else
			DrawCharacter(ChatRoomCharacter[C], (C % 5) * Space + X, Y + Math.floor(C / 5) * 500, Zoom);

}

// When the chat room runs
function ChatRoomRun() {
	ChatRoomCreateElement();
	ChatRoomBackground = "";
	DrawRect(0, 0, 2000, 1000, "Black");
	ChatRoomDrawCharacter(false);
	ElementPosition("InputChat", 1365, 959, 720);
	ElementPositionFix("TextAreaChatLog", 36, 1005, 5, 990, 925);
	DrawButton(1725, 935, 60, 60, "", "White", "Icons/Small/Chat.png");
	if (Player.CanKneel()) DrawButton(1795, 935, 60, 60, "", "White", "Icons/Small/Kneel.png");
	if (Player.CanInteract() && !LogQuery("BlockChange", "Rule")) DrawButton(1865, 935, 60, 60, "", "White", "Icons/Small/Dress.png");
	if (Player.CanWalk()) DrawButton(1935, 935, 60, 60, "", "White", "Icons/Small/Exit.png");
}

// When the player clicks in the chat room
function ChatRoomClick() {
	
	// When the user chats
	if ((MouseX >= 0) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) ChatRoomDrawCharacter(true);
	if ((MouseX >= 1725) && (MouseX < 1785) && (MouseY >= 935) && (MouseY < 995)) ChatRoomSendChat();
	
	// When the player kneels
	if ((MouseX >= 1795) && (MouseX < 1855) && (MouseY >= 935) && (MouseY < 995) && Player.CanKneel()) { 
		ServerSend("ChatRoomChat", { Content: Player.Name + " " + TextGet((Player.ActivePose == null) ? "KneelDown": "StandUp"), Type: "Action" } );
		CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
		ChatRoomCharacterUpdate(Player);
	}
	
	// When the user wants to change clothes
	if ((MouseX >= 1865) && (MouseX < 1925) && (MouseY >= 935) && (MouseY < 995) && Player.CanInteract() && !LogQuery("BlockChange", "Rule")) { 
		ElementRemove("InputChat");
		ElementRemove("TextAreaChatLog");
		CharacterAppearanceReturnRoom = "ChatRoom"; 
		CharacterAppearanceReturnModule = "Online";
		CommonSetScreen("Character", "Appearance");
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
		
		// Some custom functions like /dice or /coin are implemented for randomness
		if (msg.toLowerCase().indexOf("/dice") == 0) {
			
			// The player can roll a dice, if no size is specified, a 6 sided dice is assumed
			var Dice = (isNaN(parseInt(msg.substring(5, 50).trim()))) ? 6 : parseInt(msg.substring(5, 50).trim());
			if ((Dice < 4) || (Dice > 100)) Dice = 6;
			msg = TextGet("ActionDice");
			msg = msg.replace("SourceCharacter", Player.Name);
			msg = msg.replace("DiceType", Dice.toString());
			msg = msg.replace("DiceResult", (Math.floor(Math.random() * Dice) + 1).toString());
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action" } );

		} else if (msg.toLowerCase().indexOf("/coin") == 0) {

			// The player can flip a coin, heads or tails are 50/50
			msg = TextGet("ActionCoin");
			var Heads = (Math.random() >= 0.5);
			msg = msg.replace("SourceCharacter", Player.Name);
			msg = msg.replace("CoinResult", Heads ? TextGet("Heads") : TextGet("Tails"));
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action" } );

		} else if (msg.indexOf("*") == 0) {

			// The player can emote an action using *, it doesn't garble
			msg = msg.replace(/\*/g, "");
			if (msg != "") msg = Player.Name + " " + msg;
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" } );

		} else {
			
			// Regular chat can be garbled with a gag
			msg = DialogGarble(Player, msg);
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" } );
			
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
		if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null)) msg = TextGet("ActionSwap");
		else if ((DialogProgressNextItem != null) && (DialogProgressNextItem.Asset.Effect != null) && (DialogProgressNextItem.Asset.Effect.indexOf("Lock") >= 0)) msg = TextGet("ActionLock");
		else if (DialogProgressNextItem != null) msg = TextGet("ActionUse");
		else if ((DialogProgressPrevItem != null) && (DialogProgressPrevItem.Asset.Effect != null) && (DialogProgressPrevItem.Asset.Effect.indexOf("Lock") >= 0)) msg = TextGet("ActionUnlock");
		else msg = TextGet("ActionRemove");
		
		// Replaces the action tags to build the phrase
		msg = msg.replace("SourceCharacter", Player.Name);
		msg = msg.replace("DestinationCharacter", (C.ID == 0) ? TextGet("Her") : C.Name + TextGet("'s"));
		if (DialogProgressPrevItem != null) msg = msg.replace("PrevAsset", DialogProgressPrevItem.Asset.Description.toLowerCase());
		if (DialogProgressNextItem != null) msg = msg.replace("NextAsset", DialogProgressNextItem.Asset.Description.toLowerCase());
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

// When the server sends a response
function ChatRoomResponse(data) {
	if ((data != null) && (typeof data === "string") && (data != ""))
		ChatRoomLog = data + '\r\n';
}

// When the server sends a chat message
function ChatRoomMessage(data) {
	if ((data != null) && (typeof data === "string") && (data != "")) {
		ChatRoomLog = ChatRoomLog + data + '\r\n';
		if (document.getElementById("TextAreaChatLog") != null) {
			ElementValue("TextAreaChatLog", ChatRoomLog);
			ElementScrollToEnd("TextAreaChatLog");
			ElementFocus("InputChat");
		}
	}
}

// Gets the new room data from the server
function ChatRoomSync(data) {
	if ((data != null) && (typeof data === "object") && (data.Name != null)) {

		// Load the room
		if (CurrentScreen != "ChatRoom") CommonSetScreen("Online", "ChatRoom");

		// Load the characters
		ChatRoomCharacter = [];		
		for (var C = 0; C < data.Character.length; C++)
			ChatRoomCharacter.push(CharacterLoadOnline(data.Character[C]));

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