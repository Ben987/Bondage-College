"use strict";
var ChatRoomBackground = "";
var ChatRoomData = {};
var ChatRoomCharacter = [];
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
var ChatRoomSwapTarget = null;
var ChatRoomHelpSeen = false;
var ChatRoomAllowCharacterUpdate = true;
var ChatRoomStruggleAssistBonus = 0;
var ChatRoomStruggleAssistTimer = 0;

// Returns TRUE if the dialog option is available
function ChatRoomCanAddWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
function ChatRoomCanAddBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) < 0) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
function ChatRoomCanRemoveWhiteList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.WhiteList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
function ChatRoomCanRemoveBlackList() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.BlackList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
function ChatRoomCanAddFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
function ChatRoomCanRemoveFriend() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.FriendList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
function ChatRoomCanAddGhost() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.GhostList.indexOf(CurrentCharacter.MemberNumber) < 0)) }
function ChatRoomCanRemoveGhost() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (Player.GhostList.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
function ChatRoomCanChangeClothes() { return (Player.CanInteract() && (CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && CurrentCharacter.AllowItem && !((InventoryGet(CurrentCharacter, "ItemNeck") != null) && (InventoryGet(CurrentCharacter, "ItemNeck").Asset.Name == "ClubSlaveCollar"))) }
function ChatRoomOwnershipOptionIs(Option) { return (Option == ChatRoomOwnershipOption) }
function ChatRoomLovershipOptionIs(Option) { return (Option == ChatRoomLovershipOption) }
function ChatRoomCanTakeDrink() { return ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && (CurrentCharacter.ID != 0) && Player.CanInteract() && (InventoryGet(CurrentCharacter, "ItemMisc") != null) && (InventoryGet(CurrentCharacter, "ItemMisc").Asset.Name == "WoodenMaidTrayFull")) }
function ChatRoomIsCollaredByPlayer() { return ((CurrentCharacter != null) && (CurrentCharacter.Ownership != null) && (CurrentCharacter.Ownership.Stage == 1) && (CurrentCharacter.Ownership.MemberNumber == Player.MemberNumber)) }
function ChatRoomCanServeDrink() { return ((CurrentCharacter != null) && CurrentCharacter.CanWalk() && (ReputationCharacterGet(CurrentCharacter, "Maid") > 0) && CurrentCharacter.CanTalk()) }
function ChatRoomCanGiveMoneyForOwner() { return ((ChatRoomMoneyForOwner > 0) && (CurrentCharacter != null) && (Player.Ownership != null) && (Player.Ownership.Stage == 1) && (Player.Ownership.MemberNumber == CurrentCharacter.MemberNumber)) }
function ChatRoomPlayerIsAdmin() { return ((ChatRoomData != null && ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(Player.MemberNumber) >= 0)) }
function ChatRoomCurrentCharacterIsAdmin() { return ((CurrentCharacter != null) && (ChatRoomData.Admin != null) && (ChatRoomData.Admin.indexOf(CurrentCharacter.MemberNumber) >= 0)) }
function ChatRoomHasSwapTarget() { return (ChatRoomSwapTarget != null) }
function ChatRoomCanAssistStruggle() { return !CurrentCharacter.CanInteract() }

// Creates the chat room input elements
function ChatRoomCreateElement() {

	// Creates the chat box
	if (document.getElementById("InputChat") == null) {
		ElementCreateTextArea("InputChat");
		document.getElementById("InputChat").setAttribute("maxLength", 250);
		document.getElementById("InputChat").setAttribute("autocomplete", "off");
		ElementFocus("InputChat");
	} else if (document.getElementById("InputChat").style.display == "none") ElementFocus("InputChat");

	// Creates the chat log
	if (document.getElementById("TextAreaChatLog") == null) {

		// Sets the size and position
		ElementCreateDiv("TextAreaChatLog");
		ElementPositionFix("TextAreaChatLog", 36, 1005, 5, 988, 859);
		ElementScrollToEnd("TextAreaChatLog");
		ChatRoomRefreshChatSettings(Player);

		// If we relog, we reload the previous chat log
		if (RelogChatLog != null) {
			while (RelogChatLog.children.length > 0)
				document.getElementById("TextAreaChatLog").appendChild(RelogChatLog.children[0]);
			RelogChatLog = null;
		} else ElementContent("TextAreaChatLog", "");

	} else if (document.getElementById("TextAreaChatLog").style.display == "none") {
		setTimeout(() => ElementScrollToEnd("TextAreaChatLog"), 100);
		ChatRoomRefreshChatSettings(Player);
	}

}

// When the chat room loads
function ChatRoomLoad() {
	ElementRemove("InputSearch");
	ElementRemove("InputName");
	ElementRemove("InputDescription");
	ElementRemove("InputSize");
	ChatRoomCreateElement();
	ChatRoomCharacterUpdate(Player);
	ActivityChatRoomArousalSync(Player);
}

// When the chat room selection must start
function ChatRoomStart(Space, Game, LeaveRoom, Background, BackgroundList) {
	ChatRoomSpace = Space;
	OnlineGameName = Game;
	ChatSearchLeaveRoom = LeaveRoom;
	ChatSearchBackground = Background;
	ChatCreateBackgroundList = BackgroundList;
	CommonSetScreen("Online", "ChatSearch");
}

// Returns TRUE if the player owner is inside the room
function ChatRoomOwnerInside() {
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if (Player.Ownership.MemberNumber == ChatRoomCharacter[C].MemberNumber)
			return true;
	return false;
}

// Draw the characters in the room
function ChatRoomDrawCharacter(DoClick) {

	// Intercepts the online game chat room clicks if we need to
	if (DoClick && OnlineGameClick()) return;

	// The darkness factors varies with blindness level (1 is bright, 0 is pitch black)
	var DarkFactor = 1.0;

	// If there's more than 2 characters, we apply a zoom factor, also apply the darkness factor if the player is blindfolded
	if (!DoClick && (Player.Effect.indexOf("BlindHeavy") < 0)) {

		// Draws the zoomed background
		if (ChatRoomCharacter.length <= 2) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 500, 0, 1000, 1000, 0, 0, 1000, 1000);
		if (ChatRoomCharacter.length == 3) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 400, 0, 1200, 1000, 0, 50, 1000, 900);
		if (ChatRoomCharacter.length == 4) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 200, 0, 1600, 1000, 0, 150, 1000, 700);
		if (ChatRoomCharacter.length == 5) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 250, 1000, 500);
		if (ChatRoomCharacter.length >= 6) DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 0, 1000, 500);

		// Draws a black overlay if the character is blind
		if (Player.Effect.indexOf("BlindNormal") >= 0) DarkFactor = 0.15;
		else if (Player.Effect.indexOf("BlindLight") >= 0) DarkFactor = 0.3;
		if (DarkFactor < 1.0) DrawRect(0, 0, 2000, 1000, "rgba(0,0,0," + (1.0 - DarkFactor) + ")");

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
				if ((MouseY <= Y + Math.floor(C / 5) * 500 + 900 * Zoom) && (Player.GameplaySettings && Player.GameplaySettings.BlindDisableExamine ? (!(Player.Effect.indexOf("BlindHeavy") >= 0) || ChatRoomCharacter[C].ID == Player.ID) : true)) {

					// If the arousal meter is shown for that character, we can interact with it
					if ((ChatRoomCharacter[C].ID == 0) || (Player.ArousalSettings.ShowOtherMeter == null) || Player.ArousalSettings.ShowOtherMeter)
						if ((ChatRoomCharacter[C].ID == 0) || ((ChatRoomCharacter[C].ArousalSettings != null) && (ChatRoomCharacter[C].ArousalSettings.Visible != null) && (ChatRoomCharacter[C].ArousalSettings.Visible == "Access") && ChatRoomCharacter[C].AllowItem) || ((ChatRoomCharacter[C].ArousalSettings != null) && (ChatRoomCharacter[C].ArousalSettings.Visible != null) && (ChatRoomCharacter[C].ArousalSettings.Visible == "All")))
							if ((ChatRoomCharacter[C].ArousalSettings != null) && (ChatRoomCharacter[C].ArousalSettings.Active != null) && ((ChatRoomCharacter[C].ArousalSettings.Active == "Manual") || (ChatRoomCharacter[C].ArousalSettings.Active == "Hybrid") || (ChatRoomCharacter[C].ArousalSettings.Active == "Automatic"))) {

								// The arousal meter can be maximized or minimized by clicking on it
								if ((MouseX >= (C % 5) * Space + X + 60 * Zoom) && (MouseX <= (C % 5) * Space + X + 140 * Zoom) && (MouseY >= Y + Math.floor(C / 5) * 500 + 400 * Zoom) && (MouseY <= Y + Math.floor(C / 5) * 500 + 500 * Zoom) && !ChatRoomCharacter[C].ArousalZoom) { ChatRoomCharacter[C].ArousalZoom = true; return; }
								if ((MouseX >= (C % 5) * Space + X + 50 * Zoom) && (MouseX <= (C % 5) * Space + X + 150 * Zoom) && (MouseY >= Y + Math.floor(C / 5) * 500 + 615 * Zoom) && (MouseY <= Y + Math.floor(C / 5) * 500 + 700 * Zoom) && ChatRoomCharacter[C].ArousalZoom) { ChatRoomCharacter[C].ArousalZoom = false; return; }

								// If the player can manually control her arousal, we set the progress manual and change the facial expression, it can trigger an orgasm at 100%
								if ((ChatRoomCharacter[C].ID == 0) && (MouseX >= (C % 5) * Space + X + 50 * Zoom) && (MouseX <= (C % 5) * Space + X + 150 * Zoom) && (MouseY >= Y + Math.floor(C / 5) * 500 + 200 * Zoom) && (MouseY <= Y + Math.floor(C / 5) * 500 + 700 * Zoom) && ChatRoomCharacter[C].ArousalZoom)
									if ((Player.ArousalSettings != null) && (Player.ArousalSettings.Active != null) && (Player.ArousalSettings.Progress != null)) {
										if ((Player.ArousalSettings.Active == "Manual") || (Player.ArousalSettings.Active == "Hybrid")) {
											var Arousal = Math.round((Y + (Math.floor(C / 5) * 500 + 625 * Zoom) - MouseY) / (4 * Zoom), 0);
											ActivitySetArousal(Player, Arousal);
											if ((Player.ArousalSettings.AffectExpression == null) || Player.ArousalSettings.AffectExpression) ActivityExpression(Player, Player.ArousalSettings.Progress);
											if (Player.ArousalSettings.Progress == 100) ActivityOrgasmPrepare(Player);
										}
										return;
									}

								// Don't do anything if the thermometer is clicked without access to it
								if ((MouseX >= (C % 5) * Space + X + 50 * Zoom) && (MouseX <= (C % 5) * Space + X + 150 * Zoom) && (MouseY >= Y + Math.floor(C / 5) * 500 + 200 * Zoom) && (MouseY <= Y + Math.floor(C / 5) * 500 + 615 * Zoom) && ChatRoomCharacter[C].ArousalZoom) return;

							}

					// If a character to swap was selected, we can complete the swap with the second character
					if (ChatRoomHasSwapTarget() && ChatRoomSwapTarget != ChatRoomCharacter[C].MemberNumber) {
						ChatRoomCompleteSwap(ChatRoomCharacter[C].MemberNumber);
						break;
					}

					// Intercepts the online game character clicks if we need to
					if (DoClick && OnlineGameClickCharacter(ChatRoomCharacter[C])) return;

					// Gives focus to the character
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					ChatRoomBackground = ChatRoomData.Background;
					ChatRoomCharacter[C].AllowItem = (ChatRoomCharacter[C].ID == 0);
					ChatRoomOwnershipOption = "";
					ChatRoomLovershipOption = "";
					if (ChatRoomCharacter[C].ID != 0) ServerSend("ChatRoomAllowItem", { MemberNumber: ChatRoomCharacter[C].MemberNumber });
					CharacterSetCurrent(ChatRoomCharacter[C]);

				} else
					if (!LogQuery("BlockWhisper", "OwnerRule") || (Player.Ownership == null) || (Player.Ownership.Stage != 1) || (Player.Ownership.MemberNumber == ChatRoomCharacter[C].MemberNumber) || !ChatRoomOwnerInside())
						ChatRoomTargetMemberNumber = ((ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber) || (ChatRoomCharacter[C].ID == 0)) ? null : ChatRoomCharacter[C].MemberNumber;
				break;
			}
		}
		else {

			// Draw the background a second time for characters 6 to 10 (we do it here to correct clipping errors from the first part)
			if ((C == 5) && (Player.Effect.indexOf("BlindHeavy") < 0)) {
				DrawImageZoomCanvas("Backgrounds/" + ChatRoomData.Background + ".jpg", MainCanvas, 0, 0, 2000, 1000, 0, 500, 1000, 500);
				if (DarkFactor < 1.0) DrawRect(0, 500, 1000, 500, "rgba(0,0,0," + (1.0 - DarkFactor) + ")");
			}

			// Draw the character
			DrawCharacter(ChatRoomCharacter[C], (C % 5) * Space + X, Y + Math.floor(C / 5) * 500, Zoom);
			if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber) DrawImage("Icons/Small/Whisper.png", (C % 5) * Space + X + 75 * Zoom, Y + Math.floor(C / 5) * 500 + 950 * Zoom);

			// Draw the friendlist / blacklist / whitelist icons
			if (ChatRoomCharacter[C].MemberNumber != null) {
				if (Player.WhiteList.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) DrawImage("Icons/Small/WhiteList.png", (C % 5) * Space + X + 75 * Zoom, Y + Math.floor(C / 5) * 500);
				else if (Player.BlackList.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) DrawImage("Icons/Small/BlackList.png", (C % 5) * Space + X + 75 * Zoom, Y + Math.floor(C / 5) * 500);
				if (Player.GhostList.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) DrawImage("Icons/Small/GhostList.png", (C % 5) * Space + X + 375 * Zoom, Y + Math.floor(C / 5) * 500);
				else if (Player.FriendList.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0) DrawImage("Icons/Small/FriendList.png", (C % 5) * Space + X + 375 * Zoom, Y + Math.floor(C / 5) * 500);
			}

		}

}

// Sends the request to the server to check relationships
function ChatRoomCheckRelationships() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (C.ID != 0) ServerSend("AccountOwnership", { MemberNumber: C.MemberNumber });
	if (C.ID != 0) ServerSend("AccountLovership", { MemberNumber: C.MemberNumber });
}

// Displays /help content to the player if it's their first visit to a chatroom this session
function ChatRoomFirstTimeHelp() {
	if (!ChatRoomHelpSeen) {
		ChatRoomMessage({ Content: "ChatRoomHelp", Type: "Action", Sender: Player.MemberNumber });
		ChatRoomHelpSeen = true;
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

	// Draws the chat room controls
	ChatRoomCreateElement();
	ChatRoomFirstTimeHelp();
	ChatRoomTarget();
	ChatRoomBackground = "";
	DrawRect(0, 0, 2000, 1000, "Black");
	ChatRoomDrawCharacter(false);
	ElementPositionFix("TextAreaChatLog", 36, 1005, 66, 988, 835);
	ElementPosition("InputChat", 1456, 950, 900, 82);
	DrawButton(1905, 908, 90, 90, "", "White", "Icons/Chat.png");

	// Draws the top button, in red if they aren't enabled
	DrawButton(1005, 2, 120, 60, "", (ChatRoomCanLeave()) ? "White" : "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));
	if (OnlineGameName == "") DrawButton(1179, 2, 120, 60, "", "White", "Icons/Rectangle/Cut.png", TextGet("MenuCut"));
	else DrawButton(1179, 2, 120, 60, "", "White", "Icons/Rectangle/GameOption.png", TextGet("MenuGameOption"));
	DrawButton(1353, 2, 120, 60, "", (Player.CanKneel()) ? "White" : "Pink", "Icons/Rectangle/Kneel.png", TextGet("MenuKneel"));
	DrawButton(1527, 2, 120, 60, "", (Player.CanChange() && OnlineGameAllowChange()) ? "White" : "Pink", "Icons/Rectangle/Dress.png", TextGet("MenuDress"));
	DrawButton(1701, 2, 120, 60, "", "White", "Icons/Rectangle/Character.png", TextGet("MenuProfile"));
	DrawButton(1875, 2, 120, 60, "", "White", "Icons/Rectangle/Preference.png", TextGet("MenuAdmin"));

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
			if (Player.ArousalSettings.OrgasmStage == 2) DrawText(TextGet("OrgasmRecovering"), 500, 500, "White", "Black");
			ActivityOrgasmProgressBar(50, 970);
		} else if ((Player.ArousalSettings.Progress != null) && (Player.ArousalSettings.Progress >= 91) && (Player.ArousalSettings.Progress <= 99)) {
			if ((ChatRoomCharacter.length <= 2) || (ChatRoomCharacter.length >= 6)) DrawRect(0, 0, 1003, 1000, "#FFB0B040");
			else if (ChatRoomCharacter.length == 3) DrawRect(0, 50, 1003, 900, "#FFB0B040");
			else if (ChatRoomCharacter.length == 4) DrawRect(0, 150, 1003, 700, "#FFB0B040");
			else if (ChatRoomCharacter.length == 5) DrawRect(0, 250, 1003, 500, "#FFB0B040");
		}
	}

	// Runs any needed online game script
	OnlineGameRun();

}

// When the player clicks in the chat room
function ChatRoomClick() {

	// In orgasm mode, we do not allow any clicks expect the chat
	if ((MouseX >= 1905) && (MouseX <= 1995) && (MouseY >= 910) && (MouseY <= 999)) ChatRoomSendChat();
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {

		// On stage 0, the player can choose to resist the orgasm or not.  At 1, the player plays a mini-game to fight her orgasm
		if ((MouseX >= 200) && (MouseX <= 450) && (MouseY >= 532) && (MouseY <= 600) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmGameGenerate(0);
		if ((MouseX >= 550) && (MouseX <= 800) && (MouseY >= 532) && (MouseY <= 600) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmStart(Player);
		if ((MouseX >= ActivityOrgasmGameButtonX) && (MouseX <= ActivityOrgasmGameButtonX + 250) && (MouseY >= ActivityOrgasmGameButtonY) && (MouseY <= ActivityOrgasmGameButtonY + 64) && (Player.ArousalSettings.OrgasmStage == 1)) ActivityOrgasmGameGenerate(ActivityOrgasmGameProgress + 1);
		return;

	}

	// When the user chats or clicks on a character
	if ((MouseX >= 0) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) ChatRoomDrawCharacter(true);

	// When the user leaves
	if ((MouseX >= 1005) && (MouseX < 1125) && (MouseY >= 0) && (MouseY <= 62) && ChatRoomCanLeave()) {
		ElementRemove("InputChat");
		ElementRemove("TextAreaChatLog");
		ServerSend("ChatRoomLeave", "");
		CommonSetScreen("Online", "ChatSearch");
		CharacterDeleteAllOnline();
	}

	// When the user wants to remove the top part of his chat to speed up the screen, we only keep the last 20 entries
	if ((MouseX >= 1179) && (MouseX < 1299) && (MouseY >= 2) && (MouseY <= 62) && (OnlineGameName == "")) {
		var L = document.getElementById("TextAreaChatLog");
		while (L.childElementCount > 20)
			L.removeChild(L.childNodes[0]);
		ElementScrollToEnd("TextAreaChatLog");
	}

	// The cut button can become the game option button if there's an online game going on
	if ((MouseX >= 1179) && (MouseX < 1299) && (MouseY >= 0) && (MouseY <= 62) && (OnlineGameName != "")) {
		document.getElementById("InputChat").style.display = "none";
		document.getElementById("TextAreaChatLog").style.display = "none";
		CommonSetScreen("Online", "Game" + OnlineGameName);
	}

	// When the user character kneels
	if ((MouseX >= 1353) && (MouseX < 1473) && (MouseY >= 0) && (MouseY <= 62) && Player.CanKneel()) {
		ServerSend("ChatRoomChat", { Content: (Player.ActivePose == null) ? "KneelDown" : "StandUp", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
		CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
		ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
	}

	// When the user wants to change clothes
	if ((MouseX >= 1527) && (MouseX < 1647) && (MouseY >= 0) && (MouseY <= 62) && Player.CanChange() && OnlineGameAllowChange()) {
		document.getElementById("InputChat").style.display = "none";
		document.getElementById("TextAreaChatLog").style.display = "none";
		CharacterAppearanceReturnRoom = "ChatRoom";
		CharacterAppearanceReturnModule = "Online";
		CharacterAppearanceLoadCharacter(Player);
	}

	// When the user checks her profile
	if ((MouseX >= 1701) && (MouseX < 1821) && (MouseY >= 0) && (MouseY <= 62)) {
		document.getElementById("InputChat").style.display = "none";
		document.getElementById("TextAreaChatLog").style.display = "none";
		InformationSheetLoadCharacter(Player);
	}

	// When the user enters the room administration screen
	if ((MouseX >= 1875) && (MouseX < 1995) && (MouseY >= 0) && (MouseY <= 62)) {
		document.getElementById("InputChat").style.display = "none";
		document.getElementById("TextAreaChatLog").style.display = "none";
		CommonSetScreen("Online", "ChatAdmin");
	}

}

// Returns TRUE if the player can leave the current chat room
function ChatRoomCanLeave() {
	if (!Player.CanWalk()) return false; // Cannot leave if cannot walk
	if (!ChatRoomData.Locked || ChatRoomPlayerIsAdmin()) return true; // Can leave if the room isn't locked or is an administrator
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomData.Admin.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0)
			return false; // Cannot leave if the room is locked and there's an administrator inside
	return true; // Can leave if the room is locked and there's no administrator inside
}

// Chat room keyboard shortcuts
function ChatRoomKeyDown() {

	// If the input textfield is not focussed at the moment, set the focus to it.
	if (document.activeElement.id != "InputChat") document.getElementById("InputChat").focus();

	// The ENTER key sends the chat.  The "preventDefault" is needed for <textarea>, otherwise it adds a new line after clearing the field
	if (KeyPress == 13) {
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

}

// Sends the chat to everyone in the room
function ChatRoomSendChat() {

	// If there's a message to send
	var msg = ElementValue("InputChat").trim()
	if (msg != "") {

		// Keeps the chat log in memory so it can be accessed with pageup/pagedown
		ChatRoomLastMessage.push(msg);
		ChatRoomLastMessageIndex = ChatRoomLastMessage.length;

		// Replace < and > characters to prevent HTML injections
		while (msg.indexOf("<") > -1) msg = msg.replace("<", "&lt;");
		while (msg.indexOf(">") > -1) msg = msg.replace(">", "&gt;");
		var m = msg.toLowerCase().trim();

		// Some custom functions like /dice or /coin are implemented for randomness
		if (m.indexOf("/dice") == 0) {

			// The player can roll X dice of Y faces, using XdY.  If no size is specified, a 6 sided dice is assumed
			if (/(^\d+)[dD](\d+$)/.test(msg.substring(5, 50).trim())) {
				var Roll = /(^\d+)[dD](\d+$)/.exec((msg.substring(5, 50).trim()));
				var DiceNumber = (!Roll) ? 1 : parseInt(Roll[1]);
				var DiceSize = (!Roll) ? 6 : parseInt(Roll[2]);
				if ((DiceNumber < 1) || (DiceNumber > 100)) DiceNumber = 1;
			}
			else if (/(^\d+$)/.test((msg.substring(5, 50).trim()))) {
				var Roll = /(^\d+)/.exec((msg.substring(5, 50).trim()));
				var DiceNumber = 1;
				var DiceSize = (!Roll) ? 6 : parseInt(Roll[1]);
			}
			else DiceNumber = 0;

			// If there's at least one dice to roll
			if (DiceNumber > 0) {
				if ((DiceSize < 2) || (DiceSize > 100)) DiceSize = 6;
				var CurrentRoll = 0;
				var Result = [];
				var Total = 0;
				while (CurrentRoll < DiceNumber) {
					var Roll = Math.floor(Math.random() * DiceSize) + 1
					Result.push(Roll);
					Total += Roll;
					CurrentRoll++;
				}
				msg = "ActionDice";
				var Dictionary = [];
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
			var Dictionary = [];
			Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name });
			Dictionary.push({ Tag: "CoinResult", TextToLookUp: Heads ? "Heads" : "Tails" });
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });

		} else if ((m.indexOf("*") == 0) || (m.indexOf("/me ") == 0) || (m.indexOf("/action ") == 0)) {

			// The player can emote an action using * or /me (for those IRC or Skype users), it doesn't garble
			// The command /action or ** does not add the player's name to it
			msg = msg.replace("*", "");
			msg = msg.replace(/\/me /g, "");
			msg = msg.replace(/\/action /g, "*");
			if (msg != "") ServerSend("ChatRoomChat", { Content: msg, Type: "Emote" });

		}
		else if (m.indexOf("/help") == 0) ServerSend("ChatRoomChat", { Content: "ChatRoomHelp", Type: "Action", Target: Player.MemberNumber });
		else if (m.indexOf("/safeword") == 0) ChatRoomSafeword();
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
		else {

			// Regular chat can be garbled with a gag
			if ((msg != "") && (ChatRoomTargetMemberNumber == null)) ServerSend("ChatRoomChat", { Content: msg, Type: "Chat" });

			// The whispers get sent to the server and shown on the client directly
			if ((msg != "") && (ChatRoomTargetMemberNumber != null)) {
				ServerSend("ChatRoomChat", { Content: msg, Type: "Whisper", Target: ChatRoomTargetMemberNumber });
				var TargetName = "";
				for (var C = 0; C < ChatRoomCharacter.length; C++)
					if (ChatRoomTargetMemberNumber == ChatRoomCharacter[C].MemberNumber)
						TargetName = ChatRoomCharacter[C].Name;

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

		}

		// Clears the chat text message
		ElementValue("InputChat", "");

	}

}

// Publishes the player action (add, remove, swap) to the chat
function ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem, LeaveDialog, Action = null) {
	if (CurrentScreen == "ChatRoom") {

		// Prepares the message
		var msg = "";
		var Dictionary = [];
		if (Action == null) {
			if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && (DialogProgressPrevItem.Asset.Name == DialogProgressNextItem.Asset.Name) && (DialogProgressPrevItem.Color != DialogProgressNextItem.Color)) msg = "ActionChangeColor";
			else if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && !DialogProgressNextItem.Asset.IsLock) msg = "ActionSwap";
			else if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && DialogProgressNextItem.Asset.IsLock) msg = "ActionAddLock";
			else if (InventoryItemHasEffect(DialogProgressNextItem, "Lock")) msg = "ActionLock";
			else if ((DialogProgressNextItem != null) && (DialogProgressNextItem.Asset.DynamicActivity(Player) != null)) msg = "ActionActivity" + DialogProgressNextItem.Asset.DynamicActivity(Player);
			else if (DialogProgressNextItem != null) msg = "ActionUse";
			else if (InventoryItemHasEffect(DialogProgressPrevItem, "Lock")) msg = "ActionUnlockAndRemove";
			else msg = "ActionRemove";
		} else if (Action == "interrupted") {
			if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null) && !DialogProgressNextItem.Asset.IsLock) msg = "ActionInterruptedSwap";
			else if (DialogProgressNextItem != null) msg = "ActionInterruptedAdd";
			else msg = "ActionInterruptedRemove";
			Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
		} else msg = Action;

		// Replaces the action tags to build the phrase
		Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
		Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
		if (DialogProgressPrevItem != null) Dictionary.push({ Tag: "PrevAsset", AssetName: DialogProgressPrevItem.Asset.Name });
		if (DialogProgressNextItem != null) Dictionary.push({ Tag: "NextAsset", AssetName: DialogProgressNextItem.Asset.Name });
		if (C.FocusGroup != null) Dictionary.push({ Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name });

		// Prepares the item packet to be sent to other players in the chatroom
		ChatRoomCharacterItemUpdate(C);

		// Sends the result to the server and leaves the dialog if we need to
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
		if (LeaveDialog && (CurrentCharacter != null)) DialogLeave();

	}
}

// Updates an item on character for everyone in a chat room - replaces ChatRoomCharacterUpdate to cut on the lag
function ChatRoomCharacterItemUpdate(C, Group) {
	if ((Group == null) && (C.FocusGroup != null)) Group = C.FocusGroup.Name;
	if ((CurrentScreen == "ChatRoom") && (Group != null)) {
		var Item = InventoryGet(C, Group);
		var P = {};
		P.Target = C.MemberNumber;
		P.Group = Group;
		P.Name = (Item != null) ? Item.Asset.Name : null;
		P.Color = ((Item != null) && (Item.Color != null)) ? Item.Color : "Default";
		P.Difficulty = SkillGetWithRatio("Bondage");
		P.Property = ((Item != null) && (Item.Property != null)) ? Item.Property : null;
		ServerSend("ChatRoomCharacterItemUpdate", P);
	}
}

// Publishes a custom action to the chat
function ChatRoomPublishCustomAction(msg, LeaveDialog, Dictionary) {
	if (CurrentScreen == "ChatRoom") {
		ServerSend("ChatRoomChat", { Content: msg, Type: "Action", Dictionary: Dictionary });
		var C = CharacterGetCurrent();
		ChatRoomCharacterItemUpdate(C);
		if (LeaveDialog && (C != null)) DialogLeave();
	}
}

// Pushes the new character data/appearance to the server
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

// Escapes string
function ChatRoomHTMLEntities(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// When the server sends a chat message
function ChatRoomMessage(data) {

	// Make sure the message is valid (needs a Sender and Content)
	if ((data != null) && (typeof data === "object") && (data.Content != null) && (typeof data.Content === "string") && (data.Content != "") && (data.Sender != null) && (typeof data.Sender === "number")) {

		// Exits right away if the sender is ghosted
		if (Player.GhostList.indexOf(data.Sender) >= 0) return;

		// Make sure the sender is in the room
		var SenderCharacter = null;
		for (var C = 0; C < ChatRoomCharacter.length; C++)
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

			// Hidden messages are processed separately, they are used by chat room mini-games / events
			if ((data.Type != null) && (data.Type == "Hidden")) {
				for (var A = 1; A <= 6; A++)
					if (msg == "StruggleAssist" + A.toString()) {
						ChatRoomStruggleAssistTimer = CurrentTime + 60000;
						ChatRoomStruggleAssistBonus = A;
					}
				if (msg == "MaidDrinkPick0") MaidQuartersOnlineDrinkPick(data.Sender, 0);
				if (msg == "MaidDrinkPick5") MaidQuartersOnlineDrinkPick(data.Sender, 5);
				if (msg == "MaidDrinkPick10") MaidQuartersOnlineDrinkPick(data.Sender, 10);
				if (msg.substring(0, 8) == "PayQuest") ChatRoomPayQuest(data);
				if (msg.substring(0, 9) == "OwnerRule") data = ChatRoomSetRule(data);
				if (data.Type == "Hidden") return;
			}

			// Checks if the message is a notification about the user entering or leaving the room
			var MsgEnterLeave = "";
			if ((data.Type == "Action") && (msg.startsWith("ServerEnter")) || (msg.startsWith("ServerLeave")) || (msg.startsWith("ServerDisconnect")) || (msg.startsWith("ServerBan")) || (msg.startsWith("ServerKick")))
				MsgEnterLeave = " ChatMessageEnterLeave";

			// Replace actions by the content of the dictionary
			if (data.Type && ((data.Type == "Action") || (data.Type == "ServerMessage"))) {
				if (data.Type == "ServerMessage") msg = "ServerMessage" + msg;
				msg = DialogFind(Player, msg);
				if (data.Dictionary) {
					var dictionary = data.Dictionary;
					var SourceCharacter = null;
					var isPlayerInvolved = SenderCharacter.MemberNumber == Player.MemberNumber;
					var TargetMemberNumber = null;
					var ActivityName = null;
					var GroupName = null;
					for (var D = 0; D < dictionary.length; D++) {

						// If there's a member number in the dictionary packet, we use that number to alter the chat message
						if (dictionary[D].MemberNumber) {

							// Alters the message displayed in the chat room log, and stores the source & target in case they're required later
							if ((dictionary[D].Tag == "DestinationCharacter") || (dictionary[D].Tag == "DestinationCharacterName")) {
								msg = msg.replace(dictionary[D].Tag, ((SenderCharacter.MemberNumber == dictionary[D].MemberNumber) && (dictionary[D].Tag == "DestinationCharacter")) ? DialogFind(Player, "Her") : (PreferenceIsPlayerInSensDep() && dictionary[D].MemberNumber != Player.MemberNumber ? DialogFind(Player, "Someone").toLowerCase() : ChatRoomHTMLEntities(dictionary[D].Text) + DialogFind(Player, "'s")));
								TargetMemberNumber = dictionary[D].MemberNumber;
							}
							else if ((dictionary[D].Tag == "TargetCharacter") || (dictionary[D].Tag == "TargetCharacterName")) {
								msg = msg.replace(dictionary[D].Tag, ((SenderCharacter.MemberNumber == dictionary[D].MemberNumber) && (dictionary[D].Tag == "TargetCharacter")) ? DialogFind(Player, "Herself") : (PreferenceIsPlayerInSensDep() && dictionary[D].MemberNumber != Player.MemberNumber ? DialogFind(Player, "Someone").toLowerCase() : ChatRoomHTMLEntities(dictionary[D].Text)));
								TargetMemberNumber = dictionary[D].MemberNumber;
							}
							else if (dictionary[D].Tag == "SourceCharacter") {
								msg = msg.replace(dictionary[D].Tag, (PreferenceIsPlayerInSensDep() && (dictionary[D].MemberNumber != Player.MemberNumber)) ? DialogFind(Player, "Someone") : ChatRoomHTMLEntities(dictionary[D].Text));
								for (var T = 0; T < ChatRoomCharacter.length; T++)
									if (ChatRoomCharacter[T].MemberNumber == dictionary[D].MemberNumber)
										SourceCharacter = ChatRoomCharacter[T];
							}

							// Checks if the player is involved in the action
							if (!isPlayerInvolved && ((dictionary[D].Tag == "DestinationCharacter") || (dictionary[D].Tag == "DestinationCharacterName") || (dictionary[D].Tag == "TargetCharacter") || (dictionary[D].Tag == "TargetCharacterName") || (dictionary[D].Tag == "SourceCharacter")))
								if (dictionary[D].MemberNumber == Player.MemberNumber)
									isPlayerInvolved = true;
						}
						else if (dictionary[D].TextToLookUp) msg = msg.replace(dictionary[D].Tag, DialogFind(Player, ChatRoomHTMLEntities(dictionary[D].TextToLookUp)).toLowerCase());
						else if (dictionary[D].AssetName) {
							for (var A = 0; A < Asset.length; A++)
								if (Asset[A].Name == dictionary[D].AssetName) {
									msg = msg.replace(dictionary[D].Tag, Asset[A].DynamicDescription(SourceCharacter || Player).toLowerCase());
									ActivityName = Asset[A].DynamicActivity(SourceCharacter || Player);
									break;
								}
						}
						else if (dictionary[D].AssetGroupName) {
							for (var A = 0; A < AssetGroup.length; A++)
								if (AssetGroup[A].Name == dictionary[D].AssetGroupName) {
									msg = msg.replace(dictionary[D].Tag, AssetGroup[A].Description.toLowerCase());
									GroupName = dictionary[D].AssetGroupName;
								}
						}
						else if (msg != null) msg = msg.replace(dictionary[D].Tag, ChatRoomHTMLEntities(dictionary[D].Text));
					}

					// If another player is using an item which applies an activity on the current player, apply the effect here
					if ((ActivityName != null) && (TargetMemberNumber != null) && (TargetMemberNumber == Player.MemberNumber) && (SenderCharacter.MemberNumber != Player.MemberNumber))
						if ((Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic"))
							ActivityEffect(SenderCharacter, Player, ActivityName, GroupName);

					if (!Player.AudioSettings.PlayItemPlayerOnly || isPlayerInvolved)
						AudioPlayContent(data);
				}
			}

			// Prepares the HTML tags
			if (data.Type != null) {
				if (data.Type == "Chat") {
					if (PreferenceIsPlayerInSensDep() && SenderCharacter.MemberNumber != Player.MemberNumber) msg = '<span class="ChatMessageName" style="color:' + (SenderCharacter.LabelColor || 'gray') + ';">' + SpeechGarble(SenderCharacter, SenderCharacter.Name) + ':</span> ' + SpeechGarble(SenderCharacter, msg);
					else if (Player.IsDeaf()) msg = '<span class="ChatMessageName" style="color:' + (SenderCharacter.LabelColor || 'gray') + ';">' + SenderCharacter.Name + ':</span> ' + SpeechGarble(SenderCharacter, msg);
					else msg = '<span class="ChatMessageName" style="color:' + (SenderCharacter.LabelColor || 'gray') + ';">' + SenderCharacter.Name + ':</span> ' + SpeechGarble(SenderCharacter, msg);
				}
				else if (data.Type == "Whisper") msg = '<span class="ChatMessageName" style="font-style: italic; color:' + (SenderCharacter.LabelColor || 'gray') + ';">' + SenderCharacter.Name + ':</span> ' + msg;
				else if (data.Type == "Emote") {
					if (msg.indexOf("*") == 0) msg = msg + "*";
					else if ((msg.indexOf("'") == 0) || (msg.indexOf(",") == 0)) msg = "*" + SenderCharacter.Name + msg + "*";
					else if (PreferenceIsPlayerInSensDep() && SenderCharacter.MemberNumber != Player.MemberNumber) msg = "*" + DialogFind(Player, "Someone") + " " + msg + "*";
					else msg = "*" + SenderCharacter.Name + " " + msg + "*";
				}
				else if (data.Type == "Action") msg = "(" + msg + ")";
				else if (data.Type == "ServerMessage") msg = "<b>" + msg + "</b>";
			}

			// Outputs the sexual activities text and runs the activity if the player is targeted
			if ((data.Type != null) && (data.Type == "Activity")) {

				// Creates the output message using the activity dictionary and tags, keep some values to calculate the activity effects on the player
				msg = "(" + ActivityDictionaryText(msg) + ")";
				var TargetMemberNumber = null;
				var ActivityName = null;
				var ActivityGroup = null;
				if (data.Dictionary != null)
					for (var D = 0; D < data.Dictionary.length; D++) {
						if (data.Dictionary[D].MemberNumber != null) msg = msg.replace(data.Dictionary[D].Tag, (PreferenceIsPlayerInSensDep() && (data.Dictionary[D].MemberNumber != Player.MemberNumber)) ? DialogFind(Player, "Someone") : ChatRoomHTMLEntities(data.Dictionary[D].Text));
						if ((data.Dictionary[D].MemberNumber != null) && (data.Dictionary[D].Tag == "TargetCharacter")) TargetMemberNumber = data.Dictionary[D].MemberNumber;
						if (data.Dictionary[D].Tag == "ActivityName") ActivityName = data.Dictionary[D].Text;
						if (data.Dictionary[D].Tag == "ActivityGroup") ActivityGroup = data.Dictionary[D].Text;
					}

				// If the player does the activity on herself or an NPC, we calculate the result right away
				if ((TargetMemberNumber == Player.MemberNumber) && (SenderCharacter.MemberNumber != Player.MemberNumber))
					if ((Player.ArousalSettings == null) || (Player.ArousalSettings.Active == null) || (Player.ArousalSettings.Active == "Hybrid") || (Player.ArousalSettings.Active == "Automatic"))
						ActivityEffect(SenderCharacter, Player, ActivityName, ActivityGroup);

				// Exits before outputting the text if the player doesn't want to see the sexual activity messages
				if ((Player.ChatSettings != null) && (Player.ChatSettings.ShowActivities != null) && !Player.ChatSettings.ShowActivities) return;

			}

			// Adds the message and scrolls down unless the user has scrolled up
			var div = document.createElement("div");
			div.setAttribute('class', 'ChatMessage ChatMessage' + data.Type + MsgEnterLeave);
			div.setAttribute('data-time', ChatRoomCurrentTime());
			div.setAttribute('data-sender', data.Sender);
			if (data.Type == "Emote" || data.Type == "Action" || data.Type == "Activity")
				div.setAttribute('style', 'background-color:' + ChatRoomGetTransparentColor(SenderCharacter.LabelColor) + ';');
			div.innerHTML = msg;

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

// Gets the new room data from the server
function ChatRoomSync(data) {
	if ((data != null) && (typeof data === "object") && (data.Name != null)) {

		// Loads the room
		var Joining = false;
		if ((CurrentScreen != "ChatRoom") && (CurrentScreen != "ChatAdmin") && (CurrentScreen != "Appearance") && (CurrentModule != "Character")) {
			if (ChatRoomPlayerCanJoin) {
				Joining = true;
				ChatRoomPlayerCanJoin = false;
				CommonSetScreen("Online", "ChatRoom");
				if (ChatRoomPlayerJoiningAsAdmin) {
					ChatRoomPlayerJoiningAsAdmin = false;
					// Check if we should push banned members
					if (Player.ChatSettings && data.Character.length == 1) {
						var BanList = ChatRoomConcatenateBanList(Player.ChatSettings.AutoBanBlackList, Player.ChatSettings.AutoBanGhostList);
						if (BanList.length > 0) {
							data.Ban = BanList;
							data.Limit = data.Limit.toString();
							ServerSend("ChatRoomAdmin", { MemberNumber: Player.ID, Room: data, Action: "Update" });
						}
					}
				}
			} else return;
		}

		// If someone enters or leaves the chat room only that character must be updated
		if (!Joining && ChatRoomCharacter && ChatRoomData && (ChatRoomData.Name == data.Name)) {
			if (ChatRoomCharacter.length == data.Character.length + 1) {
				ChatRoomCharacter = ChatRoomCharacter.filter(A => data.Character.some(B => A.MemberNumber == B.MemberNumber));
				ChatRoomData = data;
				// Remove non-present chatroom characters from the characters array as they are no longer needed
				for (var C = 0; C < Character.length; C++)
					if (Character[C].AccountName.startsWith("Online-") && data.Character.find(DC => DC.MemberNumber == Character[C].MemberNumber) == null)
						CharacterDelete(Character[C].AccountName);
				return;
			}
			else if (ChatRoomCharacter.length == data.Character.length - 1) {
				ChatRoomCharacter.push(CharacterLoadOnline(data.Character[data.Character.length - 1], data.SourceMemberNumber));
				ChatRoomData = data;
				return;
			}
		}

		// Load the characters
		ChatRoomCharacter = [];
		for (var C = 0; C < data.Character.length; C++)
			ChatRoomCharacter.push(CharacterLoadOnline(data.Character[C], data.SourceMemberNumber));

		// Keeps a copy of the previous version
		ChatRoomData = data;

		// Reloads the online game statuses if needed
		OnlineGameLoadStatus();

	}
}

// Updates a single character in the chatroom
function ChatRoomSyncSingle(data) {

	// Sets the chat room character data
	if ((data == null) || (typeof data !== "object")) return;
	if ((data.Character == null) || (typeof data.Character !== "object")) return;
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.Character.MemberNumber)
			ChatRoomCharacter[C] = CharacterLoadOnline(data.Character, data.SourceMemberNumber);

	// Keeps a copy of the previous version
	for (var C = 0; C < ChatRoomData.Character.length; C++)
		if (ChatRoomData.Character[C].MemberNumber == data.Character.MemberNumber)
			ChatRoomData.Character[C] = data.Character;

}

// Updates a single character expression in the chatroom
function ChatRoomSyncExpression(data) {
	if ((data == null) || (typeof data !== "object") || (data.Group == null) || (typeof data.Group !== "string")) return;
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.MemberNumber) {

			// Changes the facial expression
			for (var A = 0; A < ChatRoomCharacter[C].Appearance.length; A++)
				if ((ChatRoomCharacter[C].Appearance[A].Asset.Group.Name == data.Group) && (ChatRoomCharacter[C].Appearance[A].Asset.Group.AllowExpression))
					if ((data.Name == null) || (ChatRoomCharacter[C].Appearance[A].Asset.Group.AllowExpression.indexOf(data.Name) >= 0)) {
						if (!ChatRoomCharacter[C].Appearance[A].Property) ChatRoomCharacter[C].Appearance[A].Property = {};
						if (ChatRoomCharacter[C].Appearance[A].Property.Expression != data.Name) {
							ChatRoomCharacter[C].Appearance[A].Property.Expression = data.Name;
							CharacterRefresh(ChatRoomCharacter[C], false);
						}
					}

			// Keeps a copy of the previous version
			for (var C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber)
					ChatRoomData.Character[C].Appearance = ChatRoomCharacter[C].Appearance;
			return;

		}
}

// Updates a single character pose in the chatroom
function ChatRoomSyncPose(data) {
	if ((data == null) || (typeof data !== "object")) return;
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.MemberNumber) {

			// Sets the active pose
			ChatRoomCharacter[C].ActivePose = data.Pose;
			CharacterRefresh(ChatRoomCharacter[C], false);

			// Keeps a copy of the previous version
			for (var C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber)
					ChatRoomData.Character[C].ActivePose = data.Pose;
			return;

		}
}

// Updates a single character arousal progress in the chatroom
function ChatRoomSyncArousal(data) {
	if ((data == null) || (typeof data !== "object")) return;
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if ((ChatRoomCharacter[C].MemberNumber == data.MemberNumber) && (ChatRoomCharacter[C].ArousalSettings != null)) {

			// Sets the active pose
			ChatRoomCharacter[C].ArousalSettings.OrgasmTimer = data.OrgasmTimer;
			ChatRoomCharacter[C].ArousalSettings.Progress = data.Progress;
			ChatRoomCharacter[C].ArousalSettings.ProgressTimer = data.ProgressTimer;
			if ((ChatRoomCharacter[C].ArousalSettings.AffectExpression == null) || ChatRoomCharacter[C].ArousalSettings.AffectExpression) ActivityExpression(ChatRoomCharacter[C], ChatRoomCharacter[C].ArousalSettings.Progress);

			// Keeps a copy of the previous version
			for (var C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].MemberNumber == data.MemberNumber) {
					ChatRoomData.Character[C].ArousalSettings.OrgasmTimer = data.OrgasmTimer;
					ChatRoomData.Character[C].ArousalSettings.Progress = data.Progress;
					ChatRoomData.Character[C].ArousalSettings.ProgressTimer = data.ProgressTimer;
					ChatRoomData.Character[C].Appearance = ChatRoomCharacter[C].Appearance;
				}
			return;

		}
}

// Return TRUE if we can allow to change the item properties, when this item is owner/lover locked
function ChatRoomAllowChangeLockedItem(Data, Item) {
	if (Item.Asset.Name == "SlaveCollar") return false;
	if ((Data.Item.Name == null) || (Data.Item.Name == "") || (Data.Item.Name != Item.Asset.Name)) return false;
	if ((Data.Item.Property == null) || (Data.Item.Property.LockedBy == null) || (Data.Item.Property.LockedBy != Item.Property.LockedBy) || (Data.Item.Property.LockMemberNumber == null) || (Data.Item.Property.LockMemberNumber != Item.Property.LockMemberNumber)) return false;
	return true;
}

// Updates a single character item in the chatroom
function ChatRoomSyncItem(data) {
	if ((data == null) || (typeof data !== "object") || (data.Source == null) || (typeof data.Source !== "number") || (data.Item == null) || (typeof data.Item !== "object") || (data.Item.Target == null) || (typeof data.Item.Target !== "number") || (data.Item.Group == null) || (typeof data.Item.Group !== "string")) return;
	for (var C = 0; C < ChatRoomCharacter.length; C++)
		if (ChatRoomCharacter[C].MemberNumber == data.Item.Target) {

			// From another user, we prevent changing the item if the current item is locked by owner/lover locks
			if (data.Source != data.Item.Target) {
				var Item = InventoryGet(ChatRoomCharacter[C], data.Item.Group);
				if ((Item != null) && (ChatRoomCharacter[C].Ownership != null) && (ChatRoomCharacter[C].Ownership.MemberNumber != data.Source) && InventoryOwnerOnlyItem(Item))
					if (!ChatRoomAllowChangeLockedItem(data, Item))
						return;
				if ((Item != null) && (ChatRoomCharacter[C].GetLoversNumbers().indexOf(data.Source) < 0) && InventoryLoverOnlyItem(Item) && ((ChatRoomCharacter[C].Ownership == null) || (ChatRoomCharacter[C].Ownership.MemberNumber != data.Source)) && !ChatRoomAllowChangeLockedItem(data, Item))
					return;
			}

			// If there's no name in the item packet, we remove the item instead of wearing it
			ChatRoomAllowCharacterUpdate = false;
			if ((data.Item.Name == null) || (data.Item.Name == "")) {
				InventoryRemove(ChatRoomCharacter[C], data.Item.Group);
			} else {

				// Wear the item and applies locks and properties if we need to
				InventoryWear(ChatRoomCharacter[C], data.Item.Name, data.Item.Group, data.Item.Color, data.Item.Difficulty);
				if (data.Item.Property != null) {
					var Item = InventoryGet(ChatRoomCharacter[C], data.Item.Group);
					if (Item != null) {
						Item.Property = data.Item.Property;
						ServerValidateProperties(ChatRoomCharacter[C], Item);
						CharacterRefresh(ChatRoomCharacter[C]);
					}
				}

			}

			// Keeps the change in the chat room data and allows the character to be updated again
			for (var R = 0; R < ChatRoomData.Character.length; R++)
				if (ChatRoomData.Character[R].MemberNumber == data.Item.Target)
					ChatRoomData.Character[R].Appearance = ChatRoomCharacter[C].Appearance;
			ChatRoomAllowCharacterUpdate = true;

		}
}

// Refreshes the chat log element
function ChatRoomRefreshChatSettings(C) {
	if (C.ChatSettings) {
		for (var property in C.ChatSettings)
			ElementSetDataAttribute("TextAreaChatLog", property, C.ChatSettings[property]);
		if (C.GameplaySettings && (C.GameplaySettings.SensDepChatLog == "SensDepNames" || C.GameplaySettings.SensDepChatLog == "SensDepTotal") && (C.Effect.indexOf("DeafHeavy") >= 0) && (C.Effect.indexOf("BlindHeavy") >= 0)) ElementSetDataAttribute("TextAreaChatLog", "EnterLeave", "Hidden");
		if (C.GameplaySettings && (C.GameplaySettings.SensDepChatLog == "SensDepTotal") && (C.Effect.indexOf("DeafHeavy") >= 0) && (C.Effect.indexOf("BlindHeavy") >= 0)) {
			ElementSetDataAttribute("TextAreaChatLog", "DisplayTimestamps", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorNames", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorActions", "false");
			ElementSetDataAttribute("TextAreaChatLog", "ColorEmotes", "false");
			ElementSetDataAttribute("TextAreaChatLog", "MemberNumbers", "Never");
		}
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

// The player can assist another player to struggle out, the bonus is evasion / 2 + 1, with penalties if the player is restrained
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

// Sends an administrative command to the server for the chat room from the character dialog
function ChatRoomAdminAction(ActionType, Publish) {
	if ((CurrentCharacter != null) && (CurrentCharacter.MemberNumber != null) && ChatRoomPlayerIsAdmin()) {
		if ((ActionType == "Swap") || (ActionType == "SwapCancel")) {
			ChatRoomSwapTarget = (ActionType == "Swap") ? CurrentCharacter.MemberNumber : null;
			DialogLeave();
			return;
		}
		ServerSend("ChatRoomAdmin", { MemberNumber: CurrentCharacter.MemberNumber, Action: ActionType, Publish: ((Publish == null) || (Publish != "false")) });
		if ((ActionType == "MoveLeft") || (ActionType == "MoveRight")) {
			var Pos = ChatRoomCharacter.indexOf(CurrentCharacter);
			if (ActionType == "MoveRight") Pos = Pos + 2;
			if (Pos < 1) Pos = 1;
			if (Pos > ChatRoomCharacter.length) Pos = ChatRoomCharacter.length;
			CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("CharacterPosition", Pos.toString());
		} else DialogLeave();
	}
}

// Swaps a character position with another character
function ChatRoomCompleteSwap(MemberNumber) {
	if (ChatRoomSwapTarget == null) return;
	ServerSend("ChatRoomAdmin",
		{
			MemberNumber: Player.ID,
			TargetMemberNumber: ChatRoomSwapTarget,
			DestinationMemberNumber: MemberNumber,
			Action: "Swap",
			Publish: true
		});
	ChatRoomSwapTarget = null;
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
		CommonWait(1000);
		ChatRoomCharacterUpdate(Player);
	}
	if (ListType == "GhostList") ChatRoomListManage(Operation, "BlackList");
}

// Modify the player FriendList/GhostList/WhiteList/BlackList based on typed message
function ChatRoomListManipulation(Add, Remove, Message) {
	var C = parseInt(Message.substring(Message.indexOf(" ") + 1));
	if (!isNaN(C) && (C > 0) && (C != Player.MemberNumber)) {
		if ((Add != null) && (Add.indexOf(C) < 0)) Add.push(C);
		if ((Remove != null) && (Remove.indexOf(C) >= 0)) Remove.splice(Remove.indexOf(C), 1);
		ServerSend("AccountUpdate", { FriendList: Player.FriendList, GhostList: Player.GhostList, WhiteList: Player.WhiteList, BlackList: Player.BlackList });
		CommonWait(1000);
		ChatRoomCharacterUpdate(Player);
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

// When the player selects a lovership dialog option (can change money)
function ChatRoomSendLovershipRequest(RequestType) {
	if ((ChatRoomLovershipOption == "CanOfferBeginWedding") && (RequestType == "Propose")) CharacterChangeMoney(Player, -100);
	if ((ChatRoomLovershipOption == "CanBeginWedding") && (RequestType == "Accept")) CharacterChangeMoney(Player, -100);
	ChatRoomLovershipOption = "";
	ServerSend("AccountLovership", { MemberNumber: CurrentCharacter.MemberNumber, Action: RequestType });
	if (RequestType == "Accept") DialogLeave();
}

// When the player picks a drink from a maid platter
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

// Sends a rule / restriction / punishment to the slave character client, it will be handled from there
function ChatRoomSendRule(RuleType, Option) {
	ServerSend("ChatRoomChat", { Content: "OwnerRule" + RuleType, Type: "Hidden", Target: CurrentCharacter.MemberNumber });
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
			ElementRemove("InputChat");
			ElementRemove("TextAreaChatLog");
			ServerSend("ChatRoomLeave", "");
			CharacterDeleteAllOnline();
			CellLock(TimerCell);
		}

		// Forced labor
		if (data.Content == "OwnerRuleLaborMaidDrinks" && Player.CanTalk()) {
			CharacterSetActivePose(Player, null);
			var D = TextGet("ActionGrabbedToServeDrinksIntro");
			ServerSend("ChatRoomChat", { Content: "ActionGrabbedToServeDrinks", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
			ElementRemove("InputChat");
			ElementRemove("TextAreaChatLog");
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

	}

	// Returns the data packet
	return data;

}

// When a slave gives her salary to her owner
function ChatRoomGiveMoneyForOwner() {
	if (ChatRoomCanGiveMoneyForOwner()) {
		ServerSend("ChatRoomChat", { Content: "ActionGiveEnvelopeToOwner", Type: "Action", Dictionary: [{ Tag: "TargetCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }] });
		ServerSend("ChatRoomChat", { Content: "PayQuest" + ChatRoomMoneyForOwner.toString(), Type: "Hidden", Target: CurrentCharacter.MemberNumber });
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

// When a game message comes in, we forward it to the current online game being played
function ChatRoomGameResponse(data) {
	if (OnlineGameName == "LARP") GameLARPProcess(data);
}

// When the player activates her safeword, we swap her appearance to the state when she entered the chat room lobby, minimum permission becomes whitelist and up
function ChatRoomSafeword() {
	if (ChatSearchSafewordAppearance != null) {
		Player.Appearance = ChatSearchSafewordAppearance.slice(0);
		CharacterSetActivePose(Player, ChatSearchSafewordPose);
		CharacterRefresh(Player);
		ChatRoomCharacterUpdate(Player);
		ServerSend("ChatRoomChat", { Content: "ActionActivateSafeword", Type: "Action", Dictionary: [{ Tag: "SourceCharacter", Text: Player.Name }] });
		if (Player.ItemPermission < 3) {
			Player.ItemPermission = 3;
			ServerSend("AccountUpdate", { ItemPermission: Player.ItemPermission });
			CommonWait(1000);
			ChatRoomCharacterUpdate(Player);
		}
	}
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