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
		DrawAssetPreview(1387, 75, DialogFocusItem.Asset);
		for (let I = 0; I <= ItemVulvaFuturisticVibratorTriggers.length; I++) {
				if (I < ItemVulvaFuturisticVibratorTriggers.length) {
					MainCanvas.textAlign = "right";
					DrawText(DialogFindPlayer("FuturisticVibrator" + ItemVulvaFuturisticVibratorTriggers[I]), 1400, 450+60*I, "white", "gray");
					MainCanvas.textAlign = "center";
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


function AssetsItemVulvaFuturisticVibratorScriptDraw(data) {
	var PersistentData = data.PersistentData();
	
	if (typeof PersistentData.CheckTime !== "number") PersistentData.CheckTime = CommonTime() + FuturisticVibratorCheckChatTime;

	if (CommonTime() > PersistentData.CheckTime) {
		
		PersistentData.CheckTime = CommonTime() + FuturisticVibratorCheckChatTime;
	}
	
	VibratorModeScriptDraw(data);
}
