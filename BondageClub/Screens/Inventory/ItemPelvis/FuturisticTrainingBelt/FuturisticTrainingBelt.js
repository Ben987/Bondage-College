"use strict";

var FuturisticTrainingBeltPermissions = ["Public", "Mistresses", "Locked"];
var FuturisticTrainingBeltModes = ["None", "EdgeAndDeny", "RandomTeasing", "RandomOrgasm", "FullPower"];

function InventoryItemPelvisFuturisticTrainingBeltLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else{
		if (DialogFocusItem.Property == null) DialogFocusItem.Property = {
			Intensity: 0,
			// Security
			ChatMessage: false,
			NextShockTime: 0,
			PunishStruggle: false,
			PunishStruggleOther: false,
			PunishOrgasm: false,
			// Public Modes
			PublicModeCurrent: "None",
			PublicModePermission: "Public",
			};
		// Security
		if (DialogFocusItem.Property.NextShockTime == null) DialogFocusItem.Property.NextShockTime = 0;
		if (DialogFocusItem.Property.PunishStruggle == null) DialogFocusItem.Property.PunishStruggle = false;
		if (DialogFocusItem.Property.PunishStruggleOther == null) DialogFocusItem.Property.PunishStruggleOther = false;
		if (DialogFocusItem.Property.PunishOrgasm == null) DialogFocusItem.Property.PunishOrgasm = false;
		if (DialogFocusItem.Property.ChatMessage == null) DialogFocusItem.Property.ChatMessage = false;
		if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = 0;
		if (DialogFocusItem.Property.PublicModeCurrent == null) DialogFocusItem.Property.PublicModeCurrent = 0;
		if (DialogFocusItem.Property.PublicModePermission == null) DialogFocusItem.Property.PublicModePermission = 0;
		
		// Validation
		if (DialogFocusItem.Property.PublicModePermission >= FuturisticTrainingBeltPermissions.length || DialogFocusItem.Property.PublicModePermission < 0) DialogFocusItem.Property.PublicModePermission = 2;
		// Validation
		if (DialogFocusItem.Property.PublicModeCurrent >= FuturisticTrainingBeltModes.length || DialogFocusItem.Property.PublicModeCurrent < 0) DialogFocusItem.Property.PublicModeCurrent = 2;
		
	}
}

function InventoryItemPelvisFuturisticTrainingBeltDraw() {
	const Item = DialogFocusItem;
	var canViewMode = false;
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else if (DialogFocusItem && DialogFocusItem.Property) {
		DrawAssetPreview(1387, 125, DialogFocusItem.Asset);
		
		MainCanvas.textAlign = "left";
		DrawCheckbox(1100, 550, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishChatMessage"), DialogFocusItem.Property.ChatMessage, false, "White");
		DrawCheckbox(1100, 620, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishStruggle"), DialogFocusItem.Property.PunishStruggle, false, "White");
		DrawCheckbox(1100, 690, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishStruggleOther"), DialogFocusItem.Property.PunishStruggleOther, false, "White");
		DrawCheckbox(1100, 760, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishOrgasm"), DialogFocusItem.Property.PunishOrgasm, false, "White");
		
		
		DrawText(DialogFindPlayer("FuturisticTrainingBeltPermissions"), 1100, 875, "white", "gray");
		
		MainCanvas.textAlign = "center";
		
		DrawBackNextButton(1550, 840, 350, 64, DialogFindPlayer("FuturisticTrainingBeltPermissions" + Item.Property.PublicModePermission), "White", "",
			() => DialogFindPlayer("FuturisticTrainingBeltPermissions" + ((Item.Property.PublicModePermission + FuturisticTrainingBeltPermissions.length - 1) % FuturisticTrainingBeltPermissions.length)),
			() => DialogFindPlayer("FuturisticTrainingBeltPermissions" + ((Item.Property.PublicModePermission + 1) % FuturisticTrainingBeltPermissions.length)));
		
		canViewMode = true;
	}
	
	
	MainCanvas.textAlign = "left";
	DrawText(DialogFindPlayer("FuturisticTrainingBeltMode"), 1100, 945, "white", "gray");
	
	MainCanvas.textAlign = "center";
	if (Item.Property.PublicModePermission == 0 || (Item.Property.PublicModePermission == 1 && LogQuery("ClubMistress", "Management"))) canViewMode = true;
	DrawBackNextButton(1550, 910, 350, 64, DialogFindPlayer("FuturisticTrainingBeltMode" + Item.Property.PublicModeCurrent), !canViewMode ? "Gray" : "White", "",
		() => !canViewMode ? "" : DialogFindPlayer("FuturisticTrainingBeltMode" + ((Item.Property.PublicModeCurrent + FuturisticTrainingBeltModes.length - 1) % FuturisticTrainingBeltModes.length)),
		() => !canViewMode ? "" : DialogFindPlayer("FuturisticTrainingBeltMode" + ((Item.Property.PublicModeCurrent + 1) % FuturisticTrainingBeltModes.length)));

	

}

function InventoryItemPelvisFuturisticTrainingBeltClick() {
	const Item = DialogFocusItem;
	var canViewMode = false;
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else {
		if (MouseIn(1885, 25, 90, 90)) InventoryItemPelvisFuturisticTrainingBeltExit();

		if (MouseIn(1100, 550, 64, 64)) {
			DialogFocusItem.Property.ChatMessage = !DialogFocusItem.Property.ChatMessage;
			FuturisticChastityBeltConfigure = true;
		} else if (MouseIn(1100, 620, 64, 64)) {
			DialogFocusItem.Property.PunishStruggle = !DialogFocusItem.Property.PunishStruggle;
			FuturisticChastityBeltConfigure = true;
			//InventoryItemPelvisFuturisticTrainingBeltPublishMode(C, "PunishStruggle", DialogFocusItem.Property.PunishStruggle);
		} else if (MouseIn(1100, 690, 64, 64)) {
			DialogFocusItem.Property.PunishStruggleOther = !DialogFocusItem.Property.PunishStruggleOther;
			FuturisticChastityBeltConfigure = true;
			//InventoryItemPelvisFuturisticTrainingBeltPublishMode(C, "PunishStruggleOther", DialogFocusItem.Property.PunishStruggleOther);
		} else if (MouseIn(1100, 760, 64, 64)) {
			DialogFocusItem.Property.PunishOrgasm = !DialogFocusItem.Property.PunishOrgasm;
			FuturisticChastityBeltConfigure = true;
			//InventoryItemPelvisFuturisticChastityBeltPublishMode(C, "PunishOrgasm", DialogFocusItem.Property.PunishOrgasm);
		} else if (MouseIn(1550, 840, 250, 64)) {
			if (MouseX <= 1725) Item.Property.PublicModePermission = (FuturisticTrainingBeltPermissions.length + Item.Property.PublicModePermission - 1) % FuturisticTrainingBeltPermissions.length;
				else Item.Property.PublicModePermission = (Item.Property.PublicModePermission + 1) % FuturisticTrainingBeltPermissions.length;
			FuturisticChastityBeltConfigure = true;
		} 
		
		canViewMode = true;
	}
	
	
	if (canViewMode || Item.Property.PublicModePermission == 0 || (Item.Property.PublicModePermission == 1 && LogQuery("ClubMistress", "Management"))) {
		if (MouseIn(1550, 910, 250, 64)) {
			if (MouseX <= 1725) Item.Property.PublicModeCurrent = (FuturisticTrainingBeltModes.length + Item.Property.PublicModeCurrent - 1) % FuturisticTrainingBeltModes.length;
				else Item.Property.PublicModeCurrent = (Item.Property.PublicModeCurrent + 1) % FuturisticTrainingBeltModes.length;
			FuturisticChastityBeltConfigure = true;
		}
	}
}

function InventoryItemPelvisFuturisticTrainingBeltExit() {
	if (FuturisticChastityBeltConfigure) {
		FuturisticChastityBeltConfigure = false;
		InventoryItemPelvisFuturisticTrainingBeltPublishGeneric(CurrentCharacter, "FuturisticChastityBeltSetGeneric");
	} else InventoryItemMouthFuturisticPanelGagExitAccessDenied();
}

function InventoryItemPelvisFuturisticTrainingBeltPublishAction(C, Option) {
	if (FuturisticChastityBeltSwitchModel) {
		FuturisticChastityBeltSwitchModel = false;
		return;
	}
	var msg = "FuturisticChastityBeltSet" + Option.Name;
	InventoryItemPelvisFuturisticTrainingBeltPublishGeneric(C, msg);
}

function InventoryItemPelvisFuturisticTrainingBeltPublishMode(C, Setting, Active) {
	var msg = "FuturisticChastityBeltSet" + Setting + ((Active) ? "On" : "Off");
	InventoryItemPelvisFuturisticTrainingBeltPublishGeneric(C, msg);
}

function InventoryItemPelvisFuturisticTrainingBeltPublishGeneric(C, msg) {
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemPelvisFuturisticTrainingBeltValidate(C) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Option); // All futuristic items refer to the gag
}




function InventoryItemPelvisFuturisticTrainingBeltNpcDialog(C, Option) { InventoryItemPelvisMetalChastityBeltNpcDialog(C, Option); }


function AssetsItemPelvisFuturisticTrainingBeltScriptUpdatePlayer(data) {
	var Item = data.Item;
	
	const punishment = InventoryFuturisticChastityBeltCheckPunish(Item);
	if (punishment) {
		if (punishment == "Orgasm") {
			if (Item.Property.PunishOrgasm && Player.ArousalSettings && Player.ArousalSettings.OrgasmStage > 1) {
				AssetsItemPelvisFuturisticChastityBeltScriptTrigger(Player, Item, "Orgasm");
				Item.Property.NextShockTime = CurrentTime + FuturisticChastityBeltShockCooldownOrgasm; // Difficult to have two orgasms in 10 seconds
			}
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
function AssetsItemPelvisFuturisticTrainingBeltScriptTrigger(C, Item, ShockType) {

	if (!(CurrentScreen == "ChatRoom")) {
		AudioPlayInstantSound("Audio/Shocks.mp3");
	} else {
		if (Item.Property && Item.Property.ChatMessage) {
			var Dictionary = [];
			Dictionary.push({ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber });
			Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
			Dictionary.push({ Tag: "SourceCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
			Dictionary.push({Tag: "AssetName", AssetName: Item.Asset.Name});
			Dictionary.push({ Tag: "ActivityName", Text: "ShockItem" });
			Dictionary.push({ Tag: "ActivityGroup", Text: Item.Asset.Group.Name });
			Dictionary.push({ AssetName: Item.Asset.Name });
			Dictionary.push({ AssetGroupName: Item.Asset.Group.Name });
			Dictionary.push({ Automatic: true });

			ServerSend("ChatRoomChat", { Content: "FuturisticChastityBeltShock" + ShockType, Type: "Action", Dictionary });
		}
	}
    CharacterSetFacialExpression(C, "Eyebrows", "Soft", 10);
    CharacterSetFacialExpression(C, "Blush", "Soft", 15);
    CharacterSetFacialExpression(C, "Eyes", "Closed", 5);
}


// Update data
function AssetsItemPelvisFuturisticTrainingBeltScriptDraw(data) {
	var persistentData = data.PersistentData();
	var property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;

	if (persistentData.UpdateTime < CommonTime() && data.C == Player) {

		if (CommonTime() > property.NextShockTime) {
			AssetsItemPelvisFuturisticTrainingBeltScriptUpdatePlayer(data);
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		var timeToNextRefresh = 950;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}
