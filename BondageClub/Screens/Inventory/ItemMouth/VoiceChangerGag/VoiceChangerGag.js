"use strict";

var InventoryItemMouthVoiceChangerGagOptions = [
	{
		Name: "Ball",
		Property: {
			Type: null,
			Effect: ["GagLight"],
		},
	},
	{
		Name: "Harness",
		Property: {
			Type: "Harness",
			Effect: ["BlockMouth", "GagMedium"],
		},
	},
	{
		Name: "Muzzle",
		Property: {
			Type: "Muzzle",
			Effect: ["BlockMouth", "GagTotal"],
		},
	},
];

// Loads the item extension properties
function InventoryItemMouthVoiceChangerGagLoad() {	
	var C = CharacterGetCurrent();
	
	
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = {
		TimerMessage: "",
		TimerEdgeMessage: "",
		TimerNonArousedMessage: "",
		OrgasmMessage: "",
		ArousedMessage: "",
		StandMessage: "",
		KneelMessage: "",
		TimerLength: "0",
		TimerLength2: 0,
		//MsgTime: 0,
		Kneeling: false,
		Aroused: false,
		Edged: false,
		Reset: false,
		};
	if (DialogFocusItem.Property.TimerMessage == null) DialogFocusItem.Property.TimerMessage = "";
	if (DialogFocusItem.Property.TimerEdgeMessage == null) DialogFocusItem.Property.TimerEdgeMessage = "";
	if (DialogFocusItem.Property.TimerNonArousedMessage == null) DialogFocusItem.Property.TimerNonArousedMessage = "";
	if (DialogFocusItem.Property.OrgasmMessage == null) DialogFocusItem.Property.OrgasmMessage = "";
	if (DialogFocusItem.Property.ArousedMessage == null) DialogFocusItem.Property.ArousedMessage = "";
	if (DialogFocusItem.Property.StandMessage == null) DialogFocusItem.Property.StandMessage = "";
	if (DialogFocusItem.Property.KneelMessage == null) DialogFocusItem.Property.KneelMessage = "";
	if (DialogFocusItem.Property.TimerLength == null) DialogFocusItem.Property.TimerLength = "0";
	if (DialogFocusItem.Property.TimerLength2 == null) DialogFocusItem.Property.TimerLength2 = 0;
	if (DialogFocusItem.Property.Reset == null) DialogFocusItem.Property.Reset = false;
	if (DialogFocusItem.Property.Aroused == null) DialogFocusItem.Property.Aroused = C.ArousalSettings.Progress > 5;
	if (DialogFocusItem.Property.Edged == null) DialogFocusItem.Property.Edged = C.ArousalSettings.Progress > 97;
	if (DialogFocusItem.Property.Kneeling == null) DialogFocusItem.Property.Kneeling = C.IsKneeling();
	
	
	// Only create the inputs if the zone isn't blocked
	if (!InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
		ElementCreateInput("OrgMsg", "text", "", "1000");	
		ElementCreateInput("ArousedMsg", "text", "", "1000");	
		ElementCreateInput("KneelMsg", "text", "", "1000");	
		ElementCreateInput("StandMsg", "text", "", "1000");	
		ElementCreateInput("TimerMsg", "text", "", "1000");	
		ElementCreateInput("TimerMinutes", "text", "", "4");	
		ElementCreateInput("TimerEdgeMsg", "text", "", "1000");	
		ElementCreateInput("TimerNonArousedMsg", "text", "", "1000");		
		
		if (DialogFocusItem != null && !(DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem))) {
			document.getElementById("OrgMsg").placeholder = DialogFocusItem.Property.OrgasmMessage;
			document.getElementById("ArousedMsg").placeholder = DialogFocusItem.Property.ArousedMessage;
			document.getElementById("KneelMsg").placeholder = DialogFocusItem.Property.KneelMessage;
			document.getElementById("StandMsg").placeholder = DialogFocusItem.Property.StandMessage;
			document.getElementById("TimerMsg").placeholder = DialogFocusItem.Property.TimerMessage;
			document.getElementById("TimerMinutes").placeholder = DialogFocusItem.Property.TimerLength;
			document.getElementById("TimerEdgeMsg").placeholder = DialogFocusItem.Property.TimerEdgeMessage;
			document.getElementById("TimerNonArousedMsg").placeholder = DialogFocusItem.Property.TimerNonArousedMessage;
		}
		
	}
}

// Draw the item extension screen
function InventoryItemMouthVoiceChangerGagDraw() {
	
	var C = CharacterGetCurrent();
	
	
	DrawRect(1437, 175, 150, 175, "white");
	DrawImageResize("Assets/" + DialogFocusItem.Asset.Group.Family + "/" + DialogFocusItem.Asset.Group.Name + "/Preview/" + DialogFocusItem.Asset.Name + ".png", 1439, 175, 146, 171);
	//DrawTextFit(DialogFocusItem.Asset.Description, 1500, 475, 221, "black");
	
	if (InventoryGroupIsBlocked(C, C.FocusGroup.Name) || (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem))) {
		// If the zone is blocked, just display some text informing the player that they can't access the lock
		DrawText(DialogFind(Player, "CantChangeWhileLockedVoiceChanger"), 1500, 800, "white", "gray");
	} else {
		// Otherwise, draw the combination inputs
		MainCanvas.textAlign = "right";
		DrawText(DialogFind(Player, "VoiceChangerGagMsg"), 1580, 380, "white", "gray");
		//DrawText(DialogFind(Player, "VoiceChangerGagTimerTime"), 1560, 621, "white", "gray");
		MainCanvas.textAlign = "center";
		ElementPosition("OrgMsg", 1340, 440, 680);
		ElementPosition("ArousedMsg", 1340, 500, 680);
		ElementPosition("KneelMsg", 1340, 560, 680);
		ElementPosition("StandMsg", 1340, 620, 680);
		ElementPosition("TimerMinutes", 1350, 680, 125);
		ElementPosition("TimerMsg", 1340, 740, 680);
		ElementPosition("TimerEdgeMsg", 1340, 800, 680);
		ElementPosition("TimerNonArousedMsg", 1340, 860, 680);
		DrawButton(1700, 414, 250, 64, DialogFind(Player, "VoiceChangerGagOrgMsgEnter"), "White", "");
		DrawButton(1700, 474, 250, 64, DialogFind(Player, "VoiceChangerGagArousedMsgEnter"), "White", "");
		DrawButton(1700, 534, 250, 64, DialogFind(Player, "VoiceChangerGagKneelMsgEnter"), "White", "");
		DrawButton(1700, 594, 250, 64, DialogFind(Player, "VoiceChangerGagStandMsgEnter"), "White", "");
		DrawButton(1700, 654, 250, 64, DialogFind(Player, "VoiceChangerGagTimerTimeEnter"), "White", "");
		DrawButton(1700, 714, 250, 64, DialogFind(Player, "VoiceChangerGagTimerMsgEnter"), "White", "");
		DrawButton(1700, 774, 250, 64, DialogFind(Player, "VoiceChangerGagTimerEdgeMsgEnter"), "White", "");
		DrawButton(1700, 834, 250, 64, DialogFind(Player, "VoiceChangerGagTimerNonArousedMsgEnter"), "White", "");
		
		if (DialogFocusItem.Property.Type != null)
			DrawButton(1000, 894, 250, 64, DialogFind(Player, "VoiceChangerGagBall"), "White", "");
		if (DialogFocusItem.Property.Type != "Harness")
			DrawButton(1350, 894, 250, 64, DialogFind(Player, "VoiceChangerGagHarness"), "White", "");
		if (DialogFocusItem.Property.Type != "Muzzle")
			DrawButton(1700, 894, 250, 64, DialogFind(Player, "VoiceChangerGagMuzzle"), "White", "");
		if (PreferenceMessage != "") DrawText(DialogFind(Player, PreferenceMessage), 1500, 963, "Red", "Black");
	}
}

// Catches the item extension clicks
function InventoryItemMouthVoiceChangerGagClick() {
	var C = CharacterGetCurrent();
	var Item = InventoryGet(C, C.FocusGroup.Name);
	if ((MouseX >= 1000) && (MouseX <= 1950) && !InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
				// Changes the non aroused timer message
		if ((MouseY >= 884) && (MouseY <= 948)) {
			
			if ((MouseX > 1000) && (MouseX < 1250)){
				ExtendedItemSetType(C, InventoryItemMouthVoiceChangerGagOptions, InventoryItemMouthVoiceChangerGagOptions[0], false);
				PreferenceMessage = "VoiceChangerGagTypeChanged";
				CharacterRefresh(C);
				InventoryItemMouthVoiceChangerGagExit();
			} else if ((MouseX > 1350) && (MouseX < 1600)){
				ExtendedItemSetType(C, InventoryItemMouthVoiceChangerGagOptions, InventoryItemMouthVoiceChangerGagOptions[1], false);
				PreferenceMessage = "VoiceChangerGagTypeChanged";
				CharacterRefresh(C);
				InventoryItemMouthVoiceChangerGagExit();
			} else if ((MouseX > 1700) && (MouseX < 1950)){
				ExtendedItemSetType(C, InventoryItemMouthVoiceChangerGagOptions, InventoryItemMouthVoiceChangerGagOptions[2], false);
				PreferenceMessage = "VoiceChangerGagTypeChanged";
				CharacterRefresh(C);
				InventoryItemMouthVoiceChangerGagExit();
			}
		} else if ((MouseX >= 1700)) {
			// Changes the orgasm message
			if ((MouseY >= 414) && (MouseY <= 478)) {
				var NewMsg = ElementValue("OrgMsg");
				DialogFocusItem.Property.OrgasmMessage = NewMsg;
				//for (let A = 0; A < C.Appearance.length; A++) {
				//	if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
				//		C.Appearance[A] = DialogFocusItem;
				//}
				if (CurrentScreen == "ChatRoom") {
					var Dictionary = [];
					Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
					Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
					Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
					
					
					if (NewMsg != "") {
						ChatRoomPublishCustomAction("VoiceChangerGagOrgMsgChange", false, Dictionary);
					} else {
						ChatRoomPublishCustomAction("VoiceChangerGagOrgDisable", false, Dictionary);
					}
				}
				else {
					CharacterRefresh(C);
				}
				PreferenceMessage = "VoiceChangerGagOrgMsgChanged";
			}
				
			// Changes the aroused message
			if ((MouseY >= 474) && (MouseY <= 538)) {
				var NewMsg = ElementValue("ArousedMsg");
				DialogFocusItem.Property.ArousedMessage = NewMsg;
				//for (let A = 0; A < C.Appearance.length; A++) {
				//	if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
				//		C.Appearance[A] = DialogFocusItem;
				//}
				if (CurrentScreen == "ChatRoom") {
					var Dictionary = [];
					Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
					Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
					Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
					
					
					if (NewMsg != "") {
						ChatRoomPublishCustomAction("VoiceChangerGagArousedMsgChange", false, Dictionary);
					} else {
						ChatRoomPublishCustomAction("VoiceChangerGagArousedDisable", false, Dictionary);
					}
				}
				else {
					CharacterRefresh(C);
				}
				PreferenceMessage = "VoiceChangerGagArousedMsgChanged";
			}
				
			// Changes the kneeling message
			if ((MouseY >= 534) && (MouseY <= 598)) {
				var NewMsg = ElementValue("KneelMsg");
				DialogFocusItem.Property.KneelMessage = NewMsg;
				//for (let A = 0; A < C.Appearance.length; A++) {
				//	if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
				//		C.Appearance[A] = DialogFocusItem;
				//}
				if (CurrentScreen == "ChatRoom") {
					var Dictionary = [];
					Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
					Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
					Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
					
					
					if (NewMsg != "") {
						ChatRoomPublishCustomAction("VoiceChangerGagKneelMsgChange", false, Dictionary);
					} else {
						ChatRoomPublishCustomAction("VoiceChangerGagKneelDisable", false, Dictionary);
					}
				}
				else {
					CharacterRefresh(C);
				}
				PreferenceMessage = "VoiceChangerGagKneelMsgChanged";
				
			}
				
			// Changes the standing message
			if ((MouseY >= 594) && (MouseY <= 658)) {
				var NewMsg = ElementValue("StandMsg");
				DialogFocusItem.Property.StandMessage = NewMsg;
				//for (let A = 0; A < C.Appearance.length; A++) {
				//	if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
				//		C.Appearance[A] = DialogFocusItem;
				//}
				if (CurrentScreen == "ChatRoom") {
					var Dictionary = [];
					Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
					Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
					Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
					
					
					if (NewMsg != "") {
						ChatRoomPublishCustomAction("VoiceChangerGagStandMsgChange", false, Dictionary);
					} else {
						ChatRoomPublishCustomAction("VoiceChangerGagStandDisable", false, Dictionary);
					}
				}
				else {
					CharacterRefresh(C);
				}
				PreferenceMessage = "VoiceChangerGagStandMsgChanged";
				
			}
			
			
			
			//InventoryItemMouthVoiceChangerGagExit();
			// Changes the timer
			if ((MouseY >= 654) && (MouseY <= 718)) {
				var E = /^[0-9]+$/;
				var NewTime = ElementValue("TimerMinutes");
				// We only accept code made of digits
				if (NewTime.match(E)) {
					DialogFocusItem.Property.TimerLength = NewTime;
					DialogFocusItem.Property.TimerLength2 = parseInt(NewTime);
					DialogFocusItem.Property.Reset = true
					//for (let A = 0; A < C.Appearance.length; A++) {
					//	if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
					//		C.Appearance[A] = DialogFocusItem;
					//}
					if (CurrentScreen == "ChatRoom") {
						var Dictionary = [];
						Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
						Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
						Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
						
						
						if (parseInt(NewTime) > 0) {
							ChatRoomPublishCustomAction("VoiceChangerGagTimeChange", false, Dictionary);
						} else {
							ChatRoomPublishCustomAction("VoiceChangerGagTimeDisable", false, Dictionary);
						}
					}
					else {
						CharacterRefresh(C);
					}
				}
				else { PreferenceMessage = "VoiceChangerGagNumberError"; }
				
				//InventoryItemMouthVoiceChangerGagExit();
				PreferenceMessage = "VoiceChangerGagTimeChanged";
			}
			
			// Changes the timer message
			if ((MouseY >= 714) && (MouseY <= 778)) {
			
				var NewMsg = ElementValue("TimerMsg");
				DialogFocusItem.Property.TimerMessage = NewMsg;
				//for (let A = 0; A < C.Appearance.length; A++) {
				//	if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
				//		C.Appearance[A] = DialogFocusItem;
				//}
				if (CurrentScreen == "ChatRoom") {
					var Dictionary = [];
					Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
					Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
					Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
					
					
					if (NewMsg != "") {
						ChatRoomPublishCustomAction("VoiceChangerGagTimeMsgChange", false, Dictionary);
					} else {
						ChatRoomPublishCustomAction("VoiceChangerGagTimeDisable", false, Dictionary);
					}
				}
				else {
					CharacterRefresh(C);
				}
				PreferenceMessage = "VoiceChangerGagTimeMsgChanged";
			}
				
			
			// Changes the edge timer message
			if ((MouseY >= 774) && (MouseY <= 838)) {
				var NewMsg = ElementValue("TimerEdgeMsg");
				DialogFocusItem.Property.TimerEdgeMessage = NewMsg;
				//for (let A = 0; A < C.Appearance.length; A++) {
				//	if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
				//		C.Appearance[A] = DialogFocusItem;
				//}
				if (CurrentScreen == "ChatRoom") {
					var Dictionary = [];
					Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
					Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
					Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
					
					
					if (NewMsg != "") {
						ChatRoomPublishCustomAction("VoiceChangerGagTimerEdgeChange", false, Dictionary);
					} else {
						ChatRoomPublishCustomAction("VoiceChangerGagTimerEdgeDisable", false, Dictionary);
					}
				}
				else {
					CharacterRefresh(C);
				}
				PreferenceMessage = "VoiceChangerGagTimerEdgeMsgChanged";
			}
			
			// Changes the non aroused timer message
			if ((MouseY >= 834) && (MouseY <= 898)) {
				var NewMsg = ElementValue("TimerNonArousedMsg");
				DialogFocusItem.Property.TimerNonArousedMessage = NewMsg;
				//for (let A = 0; A < C.Appearance.length; A++) {
				//	if (C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name)
				//		C.Appearance[A] = DialogFocusItem;
				//}
				if (CurrentScreen == "ChatRoom") {
					var Dictionary = [];
					Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
					Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
					Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: C.FocusGroup.Name});
					
					
					if (NewMsg != "") {
						ChatRoomPublishCustomAction("VoiceChangerGagTimerNonArousedChange", false, Dictionary);
					} else {
						ChatRoomPublishCustomAction("VoiceChangerGagTimerNonArousedDisable", false, Dictionary);
					}
				}
				else {
					CharacterRefresh(C);
				}
				PreferenceMessage = "VoiceChangerGagTimerNonArousedMsgChanged";
			}
			
		}
		
	}

	// Exits the screen
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) {
		CharacterRefresh(C);
		InventoryItemMouthVoiceChangerGagExit();
	}
	
	/*
	if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) DialogFocusItem = null;
	if ((MouseX >= 1325) && (MouseX <= 1389) && (MouseY >= 800) && (MouseY <= 864) && (CurrentScreen == "ChatRoom")) {
		DialogFocusItem.Property.ShowText = !DialogFocusItem.Property.ShowText;
	}
	if ((MouseX >= 1200) && (MouseX <= 1400) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity > 0)) InventoryItemMouthVoiceChangerGagSetIntensity(0 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1550) && (MouseX <= 1750) && (MouseY >= 650) && (MouseY <= 705) && (DialogFocusItem.Property.Intensity < 1 || DialogFocusItem.Property.Intensity > 1)) InventoryItemMouthVoiceChangerGagSetIntensity(1 - DialogFocusItem.Property.Intensity);
	if ((MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 710) && (MouseY <= 765) && (DialogFocusItem.Property.Intensity < 2)) InventoryItemMouthVoiceChangerGagSetIntensity(2 - DialogFocusItem.Property.Intensity);
	if (Player.CanInteract() && (MouseX >= 1375) && (MouseX <= 1575) && (MouseY >= 900) && (MouseY <= 955)) InventoryItemMouthVoiceChangerGagTrigger();*/
}

function InventoryItemMouthVoiceChangerGagExit() {
	ElementRemove("OrgMsg");
	ElementRemove("ArousedMsg");
	ElementRemove("StandMsg");
	ElementRemove("KneelMsg");
	ElementRemove("TimerMsg");
	ElementRemove("TimerMinutes");
	ElementRemove("TimerEdgeMsg");
	ElementRemove("TimerNonArousedMsg");
	PreferenceMessage = "";
	DialogFocusItem = null;
	
	if (DialogInventory != null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
}


function InventoryItemMouthVoiceChangerGagString(msg) { 
	var msgs = msg.split("|")
	var rl = Math.random()*msgs.length
	var ii = Math.floor(rl)
	var currmsg = msgs[ii]
	if (currmsg.length > 200) {
		currmsg = "My gag is malfunctioning. Please shorten my message."
	}
	return currmsg
}

// Trigger timer message
function InventoryItemMouthVoiceChangerGagTrigger_Timer(C, property) { 
	if (CurrentScreen == "ChatRoom" && property.TimerLength2 > 0 && C == Player) {
		var msg = ""
		if (property.TimerMessage != "") {
			msg = property.TimerMessage
		}
		if (property.Aroused == false && property.TimerNonArousedMessage != "") {
			msg = property.TimerNonArousedMessage
		} else if (property.Edged == true && property.TimerEdgeMessage != "") {
			msg = property.TimerEdgeMessage
		}
		if (msg != "") {
			ServerSend("ChatRoomChat", { Content: "*" + C.Name + ": " + InventoryItemMouthVoiceChangerGagString(msg), Type: "Emote"});
			return true
		}
		//ChatRoomPublishCustomAction(Player.Name + " says: " + property.TimerMessage, false, Dictionary);
	}
	if (CurrentScreen != "ChatRoom") {
		return true // To avoid queuing up messages
	}
	return false
	
}
// Trigger an orgasm message
function InventoryItemMouthVoiceChangerGagTrigger_Orgasm(C, property) { 
	if (CurrentScreen == "ChatRoom" && property.OrgasmMessage != "" && C == Player) {
		var msg = property.OrgasmMessage
		ServerSend("ChatRoomChat", { Content: "*" + C.Name + ": " + InventoryItemMouthVoiceChangerGagString(msg), Type: "Emote"});
	}
}
// Trigger an edge message (Currently unused due to lack of space)
/*function InventoryItemMouthVoiceChangerGagTrigger_Edge(C, property) { 
	if (CurrentScreen == "ChatRoom" && property.EdgeMessage != "" && C == Player) {
		var msg = property.EdgeMessage
		ServerSend("ChatRoomChat", { Content: "*" + C.Name + ": " + InventoryItemMouthVoiceChangerGagString(msg), Type: "Emote"});
	}
}*/
// Trigger an arousal message
function InventoryItemMouthVoiceChangerGagTrigger_Aroused(C, property) { 
	if (CurrentScreen == "ChatRoom" && property.ArousedMessage != "" && C == Player) {
		var msg = property.ArousedMessage
		ServerSend("ChatRoomChat", { Content: "*" + C.Name + ": " + InventoryItemMouthVoiceChangerGagString(msg), Type: "Emote"});
	}
		
}
// Trigger a standing message
function InventoryItemMouthVoiceChangerGagTrigger_Stand(C, property) { 
	if (CurrentScreen == "ChatRoom" && property.StandMessage != "" && C == Player) {
		var msg = property.StandMessage
		ServerSend("ChatRoomChat", { Content: "*" + C.Name + ": " + InventoryItemMouthVoiceChangerGagString(msg), Type: "Emote"});
	}
		
}
// Trigger an kneeling message
function InventoryItemMouthVoiceChangerGagTrigger_Kneel(C, property) { 
	if (CurrentScreen == "ChatRoom" && property.KneelMessage != "" && C == Player) {
		var msg = property.KneelMessage
		ServerSend("ChatRoomChat", { Content: "*" + C.Name + ": " + InventoryItemMouthVoiceChangerGagString(msg), Type: "Emote"});
	}
		
}




function InventoryItemMouthVoiceChangerGagValidate(C, Option) {
	var Allowed = true;

	if (DialogFocusItem.Property.LockedBy && !DialogCanUnlock(C, DialogFocusItem)) {
		DialogExtendedMessage = DialogFind(Player, "CantChangeWhileLockedVoiceChanger");
		Allowed = false;
	} 

	return Allowed;
}

function AssetsItemMouthVoiceChangerGagBeforeDraw(data) {
	return null;//data.L === "_Light" ? { Color: "#2f0" } : null;
}

function InventoryItemMouthVoiceChangerGagrandomTime(property) {
	return Math.max(property.TimerLength2, 1)*(30000 + 60000*Math.random())
}

function AssetsItemMouthVoiceChangerGagScriptDraw(data) {
	var C = data.C
	var property = (data.Item.Property = data.Item.Property || {});
	var persistentData = data.PersistentData();
	
	
	if (C == Player) {
		if (typeof persistentData.MsgTime !== "number") persistentData.MsgTime = CommonTime() + InventoryItemMouthVoiceChangerGagrandomTime(property);
		if (typeof persistentData.OrgTime !== "number") persistentData.OrgTime = CommonTime() + 1000;
		if (typeof persistentData.ArousedTime !== "number") persistentData.ArousedTime = CommonTime() + 1000;
		if (typeof persistentData.KneelTime !== "number") persistentData.KneelTime = CommonTime() + 1000;
		
		
		var time = CommonTime()
		
		if (property.Reset != null && property.Reset == true && property.TimerLength2 > 0) {
			property.Reset = false
			persistentData.MsgTime = time + InventoryItemMouthVoiceChangerGagrandomTime(property);
		}
		

		if (CurrentScreen == "ChatRoom") { // We don't want all of these timers going off and tracking every player
			
			
			
			if (persistentData.MsgTime < time) {
				
				CharacterRefresh(C);
				// Sometimes the timer doesnt get refreshed and the timer gives a message when you enter the menu. This fixes that.
				if (persistentData.MsgTime < time) {
					var success = InventoryItemMouthVoiceChangerGagTrigger_Timer(C, property)
					var timeToNextRefresh = InventoryItemMouthVoiceChangerGagrandomTime(property);//wasBlinking ? 4000 : 1000;
					
					// In the case where there is no Timer message but there is an Edge message, we want to be able to make the edge message appear more often.
					// So if the conditions for the timer are not met, but there is a valid timer, we shorten the timer to 5 seconds to make it more likely that the timer will happen.
					
					if (success == false && (property.TimerMessage != "" || property.TimerEdgeMessage != "" || property.TimerNonArousedMessage != "")) {
						timeToNextRefresh = 5000
					}
					
					persistentData.MsgTime = time + timeToNextRefresh;
					
					//AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
					//AnimationRequestDraw(data.C);
				}
			}
			
			if (persistentData.OrgTime < time) {
				if (C.ArousalSettings.OrgasmStage > 1) {
					persistentData.OrgTime = time + 25000; // 25 second cooldown before the gag is ready to play the message again
					
					InventoryItemMouthVoiceChangerGagTrigger_Orgasm(C, property)
				} else {
					persistentData.OrgTime = time + 2000;
				}
			}
			
			
			if (persistentData.ArousedTime < time) {
				
				persistentData.ArousedTime = time + 2000;
					
				if (property.Aroused == false && C.ArousalSettings.Progress > 5) {
					persistentData.ArousedTime = time + 15000; // 15 second cooldown before the gag is ready to play the message again
					property.Aroused = true
					InventoryItemMouthVoiceChangerGagTrigger_Aroused(C, property)
				} else {
					if (property.Aroused == true && C.ArousalSettings.Progress < 4) {
						property.Aroused = false
					}
				}
				if (property.Edged == false && C.ArousalSettings.Progress > 95) {
					persistentData.ArousedTime = time + 15000; // 15 second cooldown before the gag is ready to play the message again
					property.Edged = true
					//InventoryItemMouthVoiceChangerGagTrigger_Edge(C, property)
				} else {
					if (property.Edged == true && C.ArousalSettings.Progress < 94) {
						property.Edged = false
					}
				}
			}
			
			
			if (persistentData.KneelTime < time) {
				persistentData.KneelTime = time + 1500;
				
				if (property.Kneeling == false && C.IsKneeling()) {
					InventoryItemMouthVoiceChangerGagTrigger_Kneel(C, property)
					property.Kneeling = true
				} else if (property.Kneeling == true && C.IsKneeling() == false) {
					InventoryItemMouthVoiceChangerGagTrigger_Stand(C, property)
					property.Kneeling = false
				}
			}
		} else {
			
			// Keep gag timers going if the player leaves chat. This is to prevent all the timers from appearing at once as soon as they return to a room.
			if (persistentData.MsgTime < time) {
				
				persistentData.MsgTime = time + InventoryItemMouthVoiceChangerGagrandomTime(property)
			}
			
			if (persistentData.OrgTime < time) {
				persistentData.OrgTime = time + 2000;
			}
			
			if (persistentData.ArousedTime < time) {
				property.Aroused = C.ArousalSettings.Progress > 5;
				property.Edged = C.ArousalSettings.Progress > 97;
			}
			if (persistentData.KneelTime < time) {
				persistentData.KneelTime = time + 1500;
				property.Kneeling = C.IsKneeling();
			}
		}
	}
}

