"use strict";
var FuturisticChastityBeltShockCooldownOrgasm = 15000; // 15 sec
var FuturisticChastityBeltConfigure = false;
var FuturisticChastityBeltSwitchModel = false;

var InventoryItemPelvisFuturisticChastityBeltTamperZones = [
	"ItemPelvis",
	"ItemButt",
	"ItemVulva",
];
var InventoryItemPelvisFuturisticChastityBeltOptions = [
	{
		Name: "OpenBack1",
		Property: {
			Type: null,
			Block: ["ItemVulva", "ItemVulvaPiercings"],
		},
	},
	{
		Name: "OpenBoth1",
		Property: {
			Type: "OpenBoth1",
			Block: [],
		},
	},
	{
		Name: "ClosedBack1",
		Property: {
			Type: "ClosedBack1",
			Block: ["ItemButt", "ItemVulvaPiercings", "ItemVulva"],
		},
	},
	{
		Name: "OpenBack2",
		Property: {
			Type: "OpenBack2",
			Block: ["ItemVulva", "ItemVulvaPiercings"],
		},
	},
	{
		Name: "OpenBoth2",
		Property: {
			Type: "OpenBoth2",
			Block: [],
		},
	},
	{
		Name: "ClosedBack2",
		Property: {
			Type: "ClosedBack2",
			Block: ["ItemButt", "ItemVulvaPiercings", "ItemVulva"],
		},
	},
	{
		Name: "OpenBack3",
		Property: {
			Type: "OpenBack3",
			Block: ["ItemVulva", "ItemVulvaPiercings"],
		},
	},
	{
		Name: "OpenBoth3",
		Property: {
			Type: "OpenBoth3",
			Block: [],
		},
	},
	{
		Name: "ClosedBack3",
		Property: {
			Type: "ClosedBack3",
			Block: ["ItemButt", "ItemVulvaPiercings", "ItemVulva"],
		},
	},
];


function InventoryItemPelvisFuturisticChastityBeltLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else{
		if (DialogFocusItem.Property == null) DialogFocusItem.Property = { NextShockTime: 0, PunishStruggle: false , PunishStruggleOther: false , PunishOrgasm: false, ChatMessage: false,  CloseBack: false, };
		if (DialogFocusItem.Property.NextShockTime == null) DialogFocusItem.Property.NextShockTime = 0;
		if (DialogFocusItem.Property.PunishStruggle == null) DialogFocusItem.Property.PunishStruggle = false;
		if (DialogFocusItem.Property.PunishStruggleOther == null) DialogFocusItem.Property.PunishStruggleOther = false;
		if (DialogFocusItem.Property.PunishOrgasm == null) DialogFocusItem.Property.PunishOrgasm = false;
		if (DialogFocusItem.Property.ChatMessage == null) DialogFocusItem.Property.ChatMessage = false;
	}
}

function InventoryItemPelvisFuturisticChastityBeltDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else if (DialogFocusItem && DialogFocusItem.Property) {
		DrawAssetPreview(1387, 125, DialogFocusItem.Asset);

		/*if (DialogFocusItem.Property.NextShockTime - CurrentTime > 0)
			DrawText(DialogFindPlayer("FuturisticChastityBeltTime") + " " + TimerToString(DialogFocusItem.Property.NextShockTime - CurrentTime), 1500, 475, "White", "Gray");
		else
			DrawText(DialogFindPlayer("FuturisticChastityBeltTimeReady"), 1500, 475, "White", "Gray");*/


		MainCanvas.textAlign = "left";
		DrawCheckbox(1100, 550, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishChatMessage"), DialogFocusItem.Property.ChatMessage, false, "White");
		DrawCheckbox(1100, 620, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishStruggle"), DialogFocusItem.Property.PunishStruggle, false, "White");
		DrawCheckbox(1100, 690, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishStruggleOther"), DialogFocusItem.Property.PunishStruggleOther, false, "White");
		DrawCheckbox(1100, 760, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishOrgasm"), DialogFocusItem.Property.PunishOrgasm, false, "White");
		MainCanvas.textAlign = "center";

		if (DialogFocusItem.Property.Type != null && DialogFocusItem.Property.Type != "OpenBack2" && DialogFocusItem.Property.Type != "OpenBack3") {
			DrawButton(1225, 910, 150, 64, DialogFindPlayer("FuturisticChastityBeltOpenBack"), "White", "");
		}
		if (DialogFocusItem.Property.Type != "OpenBoth1" && DialogFocusItem.Property.Type != "OpenBoth2" && DialogFocusItem.Property.Type != "OpenBoth3") {
			DrawButton(1425, 910, 150, 64, DialogFindPlayer("FuturisticChastityBeltOpenFront"), "White", "");
		}
		if (DialogFocusItem.Property.Type != "ClosedBack1" && DialogFocusItem.Property.Type != "ClosedBack2" && DialogFocusItem.Property.Type != "ClosedBack3") {
			DrawButton(1625, 910, 150, 64, DialogFindPlayer("FuturisticChastityBeltClosedBack"), "White", "");
		}
		
		if (DialogFocusItem.Property.Type != null && DialogFocusItem.Property.Type != "OpenBoth1" && DialogFocusItem.Property.Type != "ClosedBack1") {
			DrawButton(1225, 840, 150, 64, DialogFindPlayer("FuturisticChastityBeltModel1"), "White", "");
		}
		if (DialogFocusItem.Property.Type != "OpenBack2" && DialogFocusItem.Property.Type != "OpenBoth2" && DialogFocusItem.Property.Type != "ClosedBack2") {
			DrawButton(1425, 840, 150, 64, DialogFindPlayer("FuturisticChastityBeltModel2"), "White", "");
		}
		if (DialogFocusItem.Property.Type != "OpenBack3" && DialogFocusItem.Property.Type != "OpenBoth3" && DialogFocusItem.Property.Type != "ClosedBack3") {
			DrawButton(1625, 840, 150, 64, DialogFindPlayer("FuturisticChastityBeltModel3"), "White", "");
		}
		


	}

}

function InventoryItemPelvisFuturisticChastityBeltClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else {
		if (MouseIn(1885, 25, 90, 90)) InventoryItemPelvisFuturisticChastityBeltExit();

		if (MouseIn(1100, 550, 64, 64)) {
			DialogFocusItem.Property.ChatMessage = !DialogFocusItem.Property.ChatMessage;
			FuturisticChastityBeltConfigure = true;
		} else if (MouseIn(1100, 620, 64, 64)) {
			DialogFocusItem.Property.PunishStruggle = !DialogFocusItem.Property.PunishStruggle;
			FuturisticChastityBeltConfigure = true;
			//InventoryItemPelvisFuturisticChastityBeltPublishMode(C, "PunishStruggle", DialogFocusItem.Property.PunishStruggle);
		} else if (MouseIn(1100, 690, 64, 64)) {
			DialogFocusItem.Property.PunishStruggleOther = !DialogFocusItem.Property.PunishStruggleOther;
			FuturisticChastityBeltConfigure = true;
			//InventoryItemPelvisFuturisticChastityBeltPublishMode(C, "PunishStruggleOther", DialogFocusItem.Property.PunishStruggleOther);
		} else if (MouseIn(1100, 760, 64, 64)) {
			DialogFocusItem.Property.PunishOrgasm = !DialogFocusItem.Property.PunishOrgasm;
			FuturisticChastityBeltConfigure = true;
			//InventoryItemPelvisFuturisticChastityBeltPublishMode(C, "PunishOrgasm", DialogFocusItem.Property.PunishOrgasm);
		} else if (MouseIn(1200, 840, 600, 138)) {		
			let FuturisticTypeOffset = 0;
			let FuturisticModelOffset = 0;
			
			if (DialogFocusItem.Property.Type == "OpenBoth1" || DialogFocusItem.Property.Type == "OpenBoth2" || DialogFocusItem.Property.Type == "OpenBoth3") FuturisticTypeOffset = 1;
			else if (DialogFocusItem.Property.Type == "ClosedBack1" || DialogFocusItem.Property.Type == "ClosedBack2" || DialogFocusItem.Property.Type == "ClosedBack3") FuturisticTypeOffset = 2;
			
			if (DialogFocusItem.Property.Type == "OpenBack2" || DialogFocusItem.Property.Type == "OpenBoth2" || DialogFocusItem.Property.Type == "ClosedBack2") FuturisticModelOffset = 3;
			else if (DialogFocusItem.Property.Type == "OpenBack3" || DialogFocusItem.Property.Type == "OpenBoth3" || DialogFocusItem.Property.Type == "ClosedBack3") FuturisticModelOffset = 6;
		
			if (MouseIn(1225, 910, 150, 64) && DialogFocusItem.Property.Type != null && DialogFocusItem.Property.Type != "OpenBack2" && DialogFocusItem.Property.Type != "OpenBack3") {
				ExtendedItemSetType(C, InventoryItemPelvisFuturisticChastityBeltOptions, InventoryItemPelvisFuturisticChastityBeltOptions[0+FuturisticModelOffset]);
			}
			if (MouseIn(1425, 910, 150, 64) && DialogFocusItem.Property.Type != "OpenBoth1" && DialogFocusItem.Property.Type != "OpenBoth2" && DialogFocusItem.Property.Type != "OpenBoth3") {
				ExtendedItemSetType(C, InventoryItemPelvisFuturisticChastityBeltOptions, InventoryItemPelvisFuturisticChastityBeltOptions[1+FuturisticModelOffset]);
			}
			if (MouseIn(1625, 910, 150, 64) && DialogFocusItem.Property.Type != "ClosedBack1" && DialogFocusItem.Property.Type != "ClosedBack2" && DialogFocusItem.Property.Type != "ClosedBack3") {
				ExtendedItemSetType(C, InventoryItemPelvisFuturisticChastityBeltOptions, InventoryItemPelvisFuturisticChastityBeltOptions[2+FuturisticModelOffset]);
			}

			if (MouseIn(1225, 840, 150, 64) && DialogFocusItem.Property.Type != null && DialogFocusItem.Property.Type != "OpenBoth1" && DialogFocusItem.Property.Type != "ClosedBack1") {
				FuturisticChastityBeltSwitchModel = true;
				ExtendedItemSetType(C, InventoryItemPelvisFuturisticChastityBeltOptions, InventoryItemPelvisFuturisticChastityBeltOptions[0+FuturisticTypeOffset]);
				FuturisticChastityBeltSwitchModel = false;
			}
			if (MouseIn(1425, 840, 150, 64) && DialogFocusItem.Property.Type != "OpenBack2" && DialogFocusItem.Property.Type != "OpenBoth2" && DialogFocusItem.Property.Type != "ClosedBack2") {
				FuturisticChastityBeltSwitchModel = true;
				ExtendedItemSetType(C, InventoryItemPelvisFuturisticChastityBeltOptions, InventoryItemPelvisFuturisticChastityBeltOptions[3+FuturisticTypeOffset]);
				FuturisticChastityBeltSwitchModel = false;
			}
			if (MouseIn(1625, 840, 150, 64) && DialogFocusItem.Property.Type != "OpenBack3" && DialogFocusItem.Property.Type != "OpenBoth3" && DialogFocusItem.Property.Type != "ClosedBack3") {
				FuturisticChastityBeltSwitchModel = true;
				ExtendedItemSetType(C, InventoryItemPelvisFuturisticChastityBeltOptions, InventoryItemPelvisFuturisticChastityBeltOptions[6+FuturisticTypeOffset]);
				FuturisticChastityBeltSwitchModel = false;
			}

		}



	}
}

function InventoryItemPelvisFuturisticChastityBeltExit() {
	if (FuturisticChastityBeltConfigure) {
		FuturisticChastityBeltConfigure = false;
		InventoryItemPelvisFuturisticChastityBeltPublishGeneric(CurrentCharacter, "FuturisticChastityBeltSetGeneric");
	} else InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

function InventoryItemPelvisFuturisticChastityBeltPublishAction(C, Option) {
	if (FuturisticChastityBeltSwitchModel) {
		FuturisticChastityBeltSwitchModel = false;
		return;
	}
	var msg = "FuturisticChastityBeltSet" + Option.Name;
	InventoryItemPelvisFuturisticChastityBeltPublishGeneric(C, msg);
}

function InventoryItemPelvisFuturisticChastityBeltPublishMode(C, Setting, Active) {
	var msg = "FuturisticChastityBeltSet" + Setting + ((Active) ? "On" : "Off");
	InventoryItemPelvisFuturisticChastityBeltPublishGeneric(C, msg);
}

function InventoryItemPelvisFuturisticChastityBeltPublishGeneric(C, msg) {
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemPelvisFuturisticChastityBeltValidate(C, Item) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Item); // All futuristic items refer to the gag
}




function InventoryItemPelvisFuturisticChastityBeltNpcDialog(C, Option) { InventoryItemPelvisMetalChastityBeltNpcDialog(C, Option); }



function InventoryFuturisticChastityBeltCheckPunish(Item) {
	// Punish the player if they try to mess with the groin area
	if (Item.Property.PunishStruggle && Player.FocusGroup && (StruggleProgress >= 0 || StruggleLockPickProgressCurrentTries > 0) && StruggleProgressPrevItem != null && StruggleProgressStruggleCount > 0) {
		var inFocus = false;
		for (var Z = 0; Z < InventoryItemPelvisFuturisticChastityBeltTamperZones.length; Z++)
			if (Player.FocusGroup.Name == InventoryItemPelvisFuturisticChastityBeltTamperZones[Z])
				inFocus = true;

		if (inFocus) {
			return "Struggle";
		}
	}
	
	// Punish the player if they struggle anywhere
	if (Item.Property.PunishStruggleOther && Player.FocusGroup && StruggleProgressPrevItem != null && StruggleProgressStruggleCount > 0 && (StruggleProgress > 50 || StruggleLockPickProgressCurrentTries > 2)) {
		return "StruggleOther";
	}
	
	// Punish the player if they orgasm
	if (Item.Property.NextShockTime - CurrentTime <= 0 && Item.Property.PunishOrgasm && Player.ArousalSettings && Player.ArousalSettings.OrgasmStage > 1) {
		// Punish the player if they orgasm
		return "Orgasm";
	}
	return "";
}

function AssetsItemPelvisFuturisticChastityBeltScriptUpdatePlayer(data) {
	var Item = data.Item;
	
	const punishment = InventoryFuturisticChastityBeltCheckPunish(Item);
	if (punishment) {
		if (punishment == "Orgasm") {
			AssetsItemPelvisFuturisticChastityBeltScriptTrigger(Player, Item, "Orgasm");
			Item.Property.NextShockTime = CurrentTime + FuturisticChastityBeltShockCooldownOrgasm; // Difficult to have two orgasms in 10 seconds
		} else if (punishment == "StruggleOther") {
			AssetsItemPelvisFuturisticChastityBeltScriptTrigger(Player, Item, "StruggleOther");
			StruggleProgressStruggleCount = 0;
			StruggleProgress = 0;
			DialogLeaveDueToItem = true;
		} else if (punishment == "Struggle") {
			AssetsItemPelvisFuturisticChastityBeltScriptTrigger(Player, Item, "Struggle");
			StruggleProgressStruggleCount = 0;
			DialogLeaveDueToItem = true;
		} 
	}
}

// Trigger a shock automatically
function AssetsItemPelvisFuturisticChastityBeltScriptTrigger(C, Item, ShockType, ReplacementWord, NoShock) {

	if (!(CurrentScreen == "ChatRoom")) {
		if (!NoShock)
			AudioPlayInstantSound("Audio/Shocks.mp3");
	} else {
		
		var Dictionary = [];
		Dictionary.push({ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber });
		Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
		Dictionary.push({ Tag: "SourceCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
		if (ReplacementWord)
			Dictionary.push({ Tag: "ReplacementWord", Text: ReplacementWord });
		Dictionary.push({Tag: "AssetName", AssetName: Item.Asset.Name});
		Dictionary.push({ Tag: "ActivityName", Text: "ShockItem" });
		Dictionary.push({ Tag: "ActivityGroup", Text: Item.Asset.Group.Name });
		Dictionary.push({ AssetName: Item.Asset.Name });
		Dictionary.push({ AssetGroupName: Item.Asset.Group.Name });
		let ShockPhrase = !NoShock ? "Shock" : "Punish"
		if (Item.Property && Item.Property.ChatMessage) {
			Dictionary.push({ Automatic: true });
			ServerSend("ChatRoomChat", { Content: "FuturisticChastityBelt" + ShockPhrase + ShockType, Type: "Action", Dictionary });
		} else {
			ChatRoomMessage({ Content: "FuturisticChastityBelt" + ShockPhrase + ShockType, Type: "Action", Sender: Player.MemberNumber, Dictionary: Dictionary  });
		}
	}
	InventoryShockExpression(C);
}


// Update data
function AssetsItemPelvisFuturisticChastityBeltScriptDraw(data) {
	var persistentData = data.PersistentData();
	var property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;

	if (persistentData.UpdateTime < CommonTime() && data.C == Player) {

		if (CommonTime() > property.NextShockTime) {
			AssetsItemPelvisFuturisticChastityBeltScriptUpdatePlayer(data);
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		var timeToNextRefresh = 950;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}
