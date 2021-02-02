"use strict";

var ItemVulvaFuturisticVibratorTriggers = ["Increase", "Decrease", "Disable", "Edge", "Random", "Deny", "Tease"]
var ItemVulvaFuturisticVibratorTriggerValues = []
var FuturisticVibratorCheckChatTime = 1000; // Checks chat every 1 sec

function InventoryItemVulvaFuturisticVibratorLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else {
		VibratorModeLoad([VibratorModeSet.ADVANCED, VibratorModeSet.STANDARD]);
		if ((DialogFocusItem != null) && (DialogFocusItem.Property != null) && (DialogFocusItem.Property.TriggerValues == null)) DialogFocusItem.Property.TriggerValues = CommonConvertArrayToString(ItemVulvaFuturisticVibratorTriggers);

		ItemVulvaFuturisticVibratorTriggerValues = DialogFocusItem.Property.TriggerValues.split(',')

		// Only create the inputs if the zone isn't blocked
		if (!InventoryGroupIsBlocked(C, C.FocusGroup.Name)) {
			for (let I = 0; I < ItemVulvaFuturisticVibratorTriggers.length; I++) {
				ElementCreateInput("FuturisticVibe" + ItemVulvaFuturisticVibratorTriggers[I], "text", "", "12"); document.getElementById("FuturisticVibe" + ItemVulvaFuturisticVibratorTriggers[I]).placeholder = ItemVulvaFuturisticVibratorTriggerValues[I];
			}
		}
	}
}

function InventoryItemVulvaFuturisticVibratorDraw() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied()
	} else {
		DrawAssetPreview(1387, 50, DialogFocusItem.Asset);
		for (let I = 0; I <= ItemVulvaFuturisticVibratorTriggers.length; I++) {
				if (I < ItemVulvaFuturisticVibratorTriggers.length) {
					MainCanvas.textAlign = "right";
					DrawText(DialogFindPlayer("FuturisticVibrator" + ItemVulvaFuturisticVibratorTriggers[I]), 1400, 450+60*I, "white", "gray");
					MainCanvas.textAlign = "center";
					var mode = DialogFindPlayer("Off" )
					if (DialogFocusItem.Property && DialogFocusItem.Property.Mode) {
						mode = DialogFindPlayer(DialogFocusItem.Property.Mode)
					}
					DrawText(DialogFindPlayer("CurrentMode" ) + mode, 1500, 375, "white", "gray");
					ElementPosition("FuturisticVibe" + ItemVulvaFuturisticVibratorTriggers[I], 1650, 450+60*I, 400);
				} else
					DrawButton(1325, 450+60*I, 350, 64, DialogFindPlayer("FuturisticVibratorSaveVoiceCommands"), "White", "");
			}
			
	}
}

function InventoryItemVulvaFuturisticVibratorClick() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied()
	} else {
		
		if ((MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110)) InventoryItemVulvaFuturisticVibratorExit();
		
		if (MouseIn(1325, 450+60*ItemVulvaFuturisticVibratorTriggers.length, 350, 64)) InventoryItemVulvaFuturisticVibratorClickSet();
	}
}


function InventoryItemVulvaFuturisticVibratorClickSet() {
	if ((DialogFocusItem != null) && (DialogFocusItem.Property != null)) {
		var ItemVulvaFuturisticVibratorTriggerValuesTemp = []
		for (let I = 0; I < ItemVulvaFuturisticVibratorTriggers.length; I++) {
			ItemVulvaFuturisticVibratorTriggerValuesTemp.push((ElementValue("FuturisticVibe" + ItemVulvaFuturisticVibratorTriggers[I]) != "") ? ElementValue("FuturisticVibe" + ItemVulvaFuturisticVibratorTriggers[I])
				: ItemVulvaFuturisticVibratorTriggerValues[I])
		}
		
		ItemVulvaFuturisticVibratorTriggerValues = ItemVulvaFuturisticVibratorTriggerValuesTemp
		
		var temp = CommonConvertArrayToString(ItemVulvaFuturisticVibratorTriggerValues)
		
		if (temp != "" && typeof temp === "string") {
			DialogFocusItem.Property.TriggerValues = temp;
			if (CurrentScreen == "ChatRoom") {
				var Dictionary = [];
				Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
				Dictionary.push({Tag: "DestinationCharacter", Text: CurrentCharacter.Name, MemberNumber: CurrentCharacter.MemberNumber});
				Dictionary.push({Tag: "FocusAssetGroup", AssetGroupName: CurrentCharacter.FocusGroup.Name});
				ChatRoomPublishCustomAction("FuturisticVibratorSaveVoiceCommandsAction", true, Dictionary);
			}
			InventoryItemVulvaFuturisticVibratorExit();
		}
		
		
	}
}

function InventoryItemVulvaFuturisticVibratorExit() {
	InventoryItemMouthFuturisticPanelGagExitAccessDenied()
	for (let I = 0; I <= ItemVulvaFuturisticVibratorTriggers.length; I++)
		ElementRemove("FuturisticVibe" + ItemVulvaFuturisticVibratorTriggers[I]);
}

function InventoryItemVulvaFuturisticVibratorDetectMsg(msg, TriggerValues) {
	for (let I = 0; I < TriggerValues.length; I++) {
		if (msg.includes(TriggerValues[I].toUpperCase())) return ItemVulvaFuturisticVibratorTriggers[I]
	}
	return ""
}

function InventoryItemVulvaFuturisticVibratorGetMode(Item, Increase) {
	if (Item.Property.Mode == VibratorMode.MAXIMUM) return (Increase ? VibratorMode.MAXIMUM : VibratorMode.HIGH);
	if (Item.Property.Mode == VibratorMode.HIGH) return (Increase ? VibratorMode.MAXIMUM : VibratorMode.MEDIUM);
	if (Item.Property.Mode == VibratorMode.MEDIUM) return (Increase ? VibratorMode.HIGH : VibratorMode.LOW);
	if (Item.Property.Mode == VibratorMode.LOW) return (Increase ? VibratorMode.MEDIUM : VibratorMode.OFF);
	
	return (Increase ? ((Item.Property.Mode == VibratorMode.OFF) ? VibratorMode.LOW : VibratorMode.MAXIMUM ): VibratorMode.LOW);
}

function InventoryItemVulvaFuturisticVibratorSetMode(C, Item, Option) {
	var OldIntensity = Item.Property.Intensity;
	VibratorModeSetProperty(Item, Option.Property);
	CharacterRefresh(C);
	ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);

	if (CurrentScreen == "ChatRoom") {
		var Message;
		var Dictionary = [
			{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
			{ Tag: "AssetName", AssetName: Item.Asset.Name },
		];

		if (Item.Property.Intensity !== OldIntensity) {
			var Direction = Item.Property.Intensity > OldIntensity ? "Increase" : "Decrease";
			Message = "Vibe" + Direction + "To" + Item.Property.Intensity;
		} else {
			Message = "VibeModeChange";
			Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
		}

		Dictionary.push({ Automatic: true });
		ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
	}
    CharacterSetFacialExpression(C, "Blush", "Soft", 5);
}

function InventoryItemVulvaFuturisticVibratorHandleChat(C, Item, LastTime) {
	if (!Item || !Item.Property || !Item.Property.TriggerValues) return;
	var TriggerValues = Item.Property.TriggerValues.split(',')
	for (let CH = 0; CH < ChatRoomChatLog.length; CH++) {
		if (ChatRoomChatLog[CH].Time > LastTime) {
			var msg = InventoryItemVulvaFuturisticVibratorDetectMsg(ChatRoomChatLog[CH].Chat.toUpperCase(), TriggerValues)
			
			if (msg != "") {
				if (msg == "Edge") InventoryItemVulvaFuturisticVibratorSetMode(C, Item, VibratorModeGetOption(VibratorMode.EDGE))
				if (msg == "Deny") InventoryItemVulvaFuturisticVibratorSetMode(C, Item, VibratorModeGetOption(VibratorMode.DENY))
				if (msg == "Tease") InventoryItemVulvaFuturisticVibratorSetMode(C, Item, VibratorModeGetOption(VibratorMode.TEASE))
				if (msg == "Random") InventoryItemVulvaFuturisticVibratorSetMode(C, Item, VibratorModeGetOption(VibratorMode.RANDOM))
				if (msg == "Disable") InventoryItemVulvaFuturisticVibratorSetMode(C, Item, VibratorModeGetOption(VibratorMode.OFF))
				if (msg == "Increase") InventoryItemVulvaFuturisticVibratorSetMode(C, Item, VibratorModeGetOption(InventoryItemVulvaFuturisticVibratorGetMode(Item, true)))
				if (msg == "Decrease") InventoryItemVulvaFuturisticVibratorSetMode(C, Item, VibratorModeGetOption(InventoryItemVulvaFuturisticVibratorGetMode(Item, false)))
			}
			
		}
	}
	
}

function AssetsItemVulvaFuturisticVibratorScriptDraw(data) {
	var PersistentData = data.PersistentData();
	var C = data.C;
	var Item = data.Item;
	// Only run updates on the player and NPCs
	if (C.ID !== 0 && C.MemberNumber !== null) return;
	
	if (typeof PersistentData.CheckTime !== "number") PersistentData.CheckTime = CommonTime() + FuturisticVibratorCheckChatTime;

	if (CommonTime() > PersistentData.CheckTime) {
		InventoryItemVulvaFuturisticVibratorHandleChat(C, Item, PersistentData.CheckTime - FuturisticVibratorCheckChatTime)
		
		PersistentData.CheckTime = CommonTime() + FuturisticVibratorCheckChatTime;
	}
	
	VibratorModeScriptDraw(data);
}
