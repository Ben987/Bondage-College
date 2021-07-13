"use strict";

/*FuturisticTrainingBeltPunishSpeech,,,Punishment for speaking too much: ,,
FuturisticTrainingBeltPunishSpeech0,,,None,,
FuturisticTrainingBeltPunishSpeech1,,,Shock,,
FuturisticTrainingBeltPunishSpeech2,,,Edge for 10m,,
FuturisticTrainingBeltPunishSpeech3,,,Vibe for 10m,,
FuturisticTrainingBeltPunishRequiredSpeech,,,Punishment for not saying word: ,,
FuturisticTrainingBeltPunishRequiredSpeech0,,,None,,
FuturisticTrainingBeltPunishRequiredSpeech1,,,Shock,,
FuturisticTrainingBeltPunishRequiredSpeech2,,,Edge for 10m,,
FuturisticTrainingBeltPunishRequiredSpeech3,,,Vibe for 10m,,*/

var FuturisticTrainingBeltPermissions = ["Public", "Mistresses", "Locked"];
var FuturisticTrainingBeltSpeechPunishments = ["None", "Shock", "Edge", "Vibe"];
var FuturisticTrainingBeltModes = ["None", "Tease", "Excite", "FullPower", "EdgeAndDeny", "RandomTeasing", "RandomOrgasm"];
var FuturisticTrainingBeltStates = ["None", "LowPriorityEdge", "LowPriorityTease", "LowPriorityLow", "LowPriorityMedium", "LowPriorityMax", "HighPriorityEdge", "HighPriorityMax", "Cooldown"];

var FuturisticTrainingBeltResetCooldown = false;
var FuturisticTrainingBeltSetMode = -1;

var FuturisticTrainingBeltStandUpFlag = false;

var FuturisticTrainingBeltSpeechCharacterLimit = 25;

var FuturisticTrainingBeltRandomEdgeCycle = 150000; // 150s = 20% downtime at low intensity, so 30 of low and 120s of high

var FuturisticTrainingBeltRandomTeaseDurationMin = 30000; // 30 seconds
var FuturisticTrainingBeltRandomTeaseDurationMax = 300000; // 5 minutes
var FuturisticTrainingBeltRandomTeaseDurationCooldown = 30000; // 30 seconds
var FuturisticTrainingBeltRandomTeaseChance = 0.03; // Chance per second that this happens
var FuturisticTrainingBeltRandomTeaseMaxChance = 0.1; // Chance that teasing will be maximum
var FuturisticTrainingBeltRandomDenyChance = 0.01; // Chance per second we will deny the player
var FuturisticTrainingBeltRandomDenyDuration = 30000;

var FuturisticTrainingBeltRandomOrgasmDurationMin = 60000; // 1 minute
var FuturisticTrainingBeltRandomOrgasmDurationMax = 3*60000; // 3 minutes
var FuturisticTrainingBeltRandomOrgasmDurationCooldown = 60000; // 1 minute
var FuturisticTrainingBeltRandomOrgasmChance = 0.02; // Chance per second that this happens

var FuturisticTrainingBeltPunishmentEdgeDuration = 30*60000; // 30 minutes edge
var FuturisticTrainingBeltPunishmentVibeDuration = 10*60000; // 10 minutes constant orgasms

var FuturisticTrainingBeltPage = 0;
var FuturisticTrainingBeltMaxPage = 1;

function InventoryItemPelvisFuturisticTrainingBeltLoad() {
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagLoadAccessDenied();
	} else{
		if (DialogFocusItem.Property == null) DialogFocusItem.Property = {
			Intensity: -1,
			// Security
			ChatMessage: false,
			NextShockTime: 0,
			PunishStruggle: false,
			PunishStruggleOther: false,
			PunishOrgasm: false,
			PunishStandup: false,
			PunishSpeech: 0,
			PunishRequiredSpeech: 0,
			PunishRequiredSpeechWord: "Miss",
			// Public Modes
			PublicModeCurrent: 0,
			PublicModePermission: 0,
			// State machine
			DeviceState: 0,
			DeviceStateTimer: 0, // Timer for the end of the current state
			DeviceVibeMode: VibratorMode.OFF, // Timer for the end of the current state
			};
		// Security
		if (DialogFocusItem.Property.NextShockTime == null) DialogFocusItem.Property.NextShockTime = 0;
		if (DialogFocusItem.Property.PunishStruggle == null) DialogFocusItem.Property.PunishStruggle = false;
		if (DialogFocusItem.Property.PunishSpeech == null) DialogFocusItem.Property.PunishSpeech = 0;
		if (DialogFocusItem.Property.PunishRequiredSpeech == null) DialogFocusItem.Property.PunishRequiredSpeech = 0;
		if (DialogFocusItem.Property.PunishRequiredSpeechWord == null) DialogFocusItem.Property.PunishRequiredSpeechWord = "Miss";
		if (DialogFocusItem.Property.PunishStandup == null) DialogFocusItem.Property.PunishStandup = false;
		if (DialogFocusItem.Property.PunishStruggleOther == null) DialogFocusItem.Property.PunishStruggleOther = false;
		if (DialogFocusItem.Property.PunishOrgasm == null) DialogFocusItem.Property.PunishOrgasm = false;
		if (DialogFocusItem.Property.ChatMessage == null) DialogFocusItem.Property.ChatMessage = false;
		if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = -1;
		if (DialogFocusItem.Property.PublicModeCurrent == null) DialogFocusItem.Property.PublicModeCurrent = 0;
		if (DialogFocusItem.Property.PublicModePermission == null) DialogFocusItem.Property.PublicModePermission = 0;
		if (DialogFocusItem.Property.DeviceState == null) DialogFocusItem.Property.DeviceState = 0;
		if (DialogFocusItem.Property.DeviceStateTimer == null) DialogFocusItem.Property.DeviceStateTimer = 0;
		if (DialogFocusItem.Property.DeviceVibeMode == null) DialogFocusItem.Property.DeviceVibeMode = VibratorMode.OFF;
		
		// Validation
		if (typeof DialogFocusItem.Property.PunishRequiredSpeechWord != "string") DialogFocusItem.Property.PunishRequiredSpeechWord = "Miss";
		if (DialogFocusItem.Property.PublicModePermission >= FuturisticTrainingBeltPermissions.length || DialogFocusItem.Property.PublicModePermission < 0) DialogFocusItem.Property.PublicModePermission = 2;
		if (DialogFocusItem.Property.PublicModeCurrent >= FuturisticTrainingBeltModes.length || DialogFocusItem.Property.PublicModeCurrent < 0) DialogFocusItem.Property.PublicModeCurrent = 0;
		if (DialogFocusItem.Property.DeviceState >= FuturisticTrainingBeltStates.length || DialogFocusItem.Property.DeviceState < 0) DialogFocusItem.Property.DeviceState = 0;
		if (DialogFocusItem.Property.DeviceStateTimer >= CommonTime + 3600000) DialogFocusItem.Property.DeviceStateTimer = 0; // Prevents people from hacking in ultra-long state timers
		
		
		const input = ElementCreateInput("PunishRequiredSpeechWord", "text", "", "25");
		if (input) input.placeholder = DialogFocusItem.Property.PunishRequiredSpeechWord;
	}

	
	if (FuturisticTrainingBeltSetMode < 0 || FuturisticTrainingBeltSetMode > FuturisticTrainingBeltModes.length)
		FuturisticTrainingBeltSetMode = DialogFocusItem.Property.PublicModeCurrent;
}

function InventoryItemPelvisFuturisticTrainingBeltDraw() {
	const Item = DialogFocusItem;
	var canViewMode = false;
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		InventoryItemMouthFuturisticPanelGagDrawAccessDenied();
	} else if (DialogFocusItem && DialogFocusItem.Property) {
		DrawAssetPreview(1387, 125, DialogFocusItem.Asset);
		
		
		if (FuturisticTrainingBeltPage == 0) {
			MainCanvas.textAlign = "left";
			DrawCheckbox(1100, 450, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishChatMessage"), DialogFocusItem.Property.ChatMessage, false, "White");
			DrawCheckbox(1100, 520, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishStruggle"), DialogFocusItem.Property.PunishStruggle, false, "White");
			DrawCheckbox(1100, 590, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishStruggleOther"), DialogFocusItem.Property.PunishStruggleOther, false, "White");
			DrawCheckbox(1100, 660, 64, 64, DialogFindPlayer("FuturisticChastityBeltPunishOrgasm"), DialogFocusItem.Property.PunishOrgasm, false, "White")
			DrawCheckbox(1100, 730, 64, 64, DialogFindPlayer("FuturisticTrainingBeltPunishStandup"), DialogFocusItem.Property.PunishStandup, false, "White");
			
			ElementPosition("PunishRequiredSpeechWord", 3050, 750, 400); // Hide it off the canvas
		} else if (FuturisticTrainingBeltPage == 1) {
			
			if (ElementValue("PunishRequiredSpeechWord") && ElementValue("PunishRequiredSpeechWord").length > 1) FuturisticChastityBeltConfigure = true;
			
			MainCanvas.textAlign = "left";
			
			
			DrawText(DialogFindPlayer("FuturisticTrainingBeltPunishSpeech"), 1100, 480, "white", "gray");
			DrawText(DialogFindPlayer("FuturisticTrainingBeltPunishRequiredSpeech"), 1100, 620, "white", "gray");
			
			ElementPosition("PunishRequiredSpeechWord", 1800, 610, 245);
			
			
			MainCanvas.textAlign = "center";
		
			DrawBackNextButton(1100, 510, 350, 64, DialogFindPlayer("FuturisticTrainingBeltPunishSpeech" + Item.Property.PunishSpeech), "White", "",
				() => DialogFindPlayer("FuturisticTrainingBeltPunishSpeech" + ((Item.Property.PunishSpeech + FuturisticTrainingBeltSpeechPunishments.length - 1) % FuturisticTrainingBeltSpeechPunishments.length)),
				() => DialogFindPlayer("FuturisticTrainingBeltPunishSpeech" + ((Item.Property.PunishSpeech + 1) % FuturisticTrainingBeltSpeechPunishments.length)));
							
			DrawBackNextButton(1100, 650, 350, 64, DialogFindPlayer("FuturisticTrainingBeltPunishRequiredSpeech" + Item.Property.PunishRequiredSpeech), "White", "",
				() => DialogFindPlayer("FuturisticTrainingBeltPunishRequiredSpeech" + ((Item.Property.PunishRequiredSpeech + FuturisticTrainingBeltSpeechPunishments.length - 1) % FuturisticTrainingBeltSpeechPunishments.length)),
				() => DialogFindPlayer("FuturisticTrainingBeltPunishRequiredSpeech" + ((Item.Property.PunishRequiredSpeech + 1) % FuturisticTrainingBeltSpeechPunishments.length)));
			
		}
		
		MainCanvas.textAlign = "left";
		
		DrawText(DialogFindPlayer("FuturisticTrainingBeltPermissions"), 1100, 875, "white", "gray");
		
		MainCanvas.textAlign = "center";
		
		DrawBackNextButton(1550, 840, 350, 64, DialogFindPlayer("FuturisticTrainingBeltPermissions" + Item.Property.PublicModePermission), "White", "",
			() => DialogFindPlayer("FuturisticTrainingBeltPermissions" + ((Item.Property.PublicModePermission + FuturisticTrainingBeltPermissions.length - 1) % FuturisticTrainingBeltPermissions.length)),
			() => DialogFindPlayer("FuturisticTrainingBeltPermissions" + ((Item.Property.PublicModePermission + 1) % FuturisticTrainingBeltPermissions.length)));
			
		// Draw the back/next button
		const currPage = FuturisticTrainingBeltPage + 1;
		const totalPages = FuturisticTrainingBeltMaxPage + 1;
		DrawBackNextButton(1675, 240, 300, 90, DialogFindPlayer("Page") + " " + currPage.toString() + " / " + totalPages.toString(), "White", "", () => "", () => "");
		
		canViewMode = true;
	}
	
	
	MainCanvas.textAlign = "left";
	DrawText(DialogFindPlayer("FuturisticTrainingBeltMode"), 1100, 945, "white", "gray");
	
	MainCanvas.textAlign = "center";
	if (Item.Property.PublicModePermission == 0 || (Item.Property.PublicModePermission == 1 && LogQuery("ClubMistress", "Management"))) canViewMode = true;
	DrawBackNextButton(1550, 910, 350, 64, DialogFindPlayer("FuturisticTrainingBeltMode" + FuturisticTrainingBeltSetMode), !canViewMode ? "Gray" : "White", "",
		() => !canViewMode ? "" : DialogFindPlayer("FuturisticTrainingBeltMode" + ((FuturisticTrainingBeltSetMode + FuturisticTrainingBeltModes.length - 1) % FuturisticTrainingBeltModes.length)),
		() => !canViewMode ? "" : DialogFindPlayer("FuturisticTrainingBeltMode" + ((FuturisticTrainingBeltSetMode + 1) % FuturisticTrainingBeltModes.length)));

	

}

function InventoryItemPelvisFuturisticTrainingBeltClick() {
	const Item = DialogFocusItem;
	var canViewMode = false;
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (InventoryItemMouthFuturisticPanelGagValidate(C) !== "") {
		if (MouseIn(1885, 25, 90, 90)) InventoryItemPelvisFuturisticTrainingBeltExit();
		else InventoryItemMouthFuturisticPanelGagClickAccessDenied();
	} else {
		if (MouseIn(1885, 25, 90, 90)) InventoryItemPelvisFuturisticTrainingBeltExit();

		if (FuturisticTrainingBeltPage == 0) {
			if (MouseIn(1100, 450, 64, 64)) {
				DialogFocusItem.Property.ChatMessage = !DialogFocusItem.Property.ChatMessage;
				FuturisticChastityBeltConfigure = true;
			} else if (MouseIn(1100, 520, 64, 64)) {
				DialogFocusItem.Property.PunishStruggle = !DialogFocusItem.Property.PunishStruggle;
				FuturisticChastityBeltConfigure = true;
			} else if (MouseIn(1100, 590, 64, 64)) {
				DialogFocusItem.Property.PunishStruggleOther = !DialogFocusItem.Property.PunishStruggleOther;
				FuturisticChastityBeltConfigure = true;
			} else if (MouseIn(1100, 660, 64, 64)) {
				DialogFocusItem.Property.PunishOrgasm = !DialogFocusItem.Property.PunishOrgasm;
				FuturisticChastityBeltConfigure = true;
			} else if (MouseIn(1100, 730, 64, 64)) {
				DialogFocusItem.Property.PunishStandup = !DialogFocusItem.Property.PunishStandup;
				FuturisticChastityBeltConfigure = true;
			} 
		} else if (FuturisticTrainingBeltPage == 1) {		
			if (MouseIn(1100, 510, 350, 64)) {
				if (MouseX <= 1275) Item.Property.PunishSpeech = (FuturisticTrainingBeltSpeechPunishments.length + Item.Property.PunishSpeech - 1) % FuturisticTrainingBeltSpeechPunishments.length;
					else Item.Property.PunishSpeech = (Item.Property.PunishSpeech + 1) % FuturisticTrainingBeltSpeechPunishments.length;
				FuturisticChastityBeltConfigure = true;
			} else if (MouseIn(1100, 650, 350, 64)) {
				if (MouseX <= 1275) Item.Property.PunishRequiredSpeech = (FuturisticTrainingBeltSpeechPunishments.length + Item.Property.PunishRequiredSpeech - 1) % FuturisticTrainingBeltSpeechPunishments.length;
					else Item.Property.PunishRequiredSpeech = (Item.Property.PunishRequiredSpeech + 1) % FuturisticTrainingBeltSpeechPunishments.length;
				FuturisticChastityBeltConfigure = true;
			}
		}
		
		// Pagination buttons
		if (MouseIn(1675, 240, 150, 90) && FuturisticTrainingBeltPage > 0) {
			FuturisticTrainingBeltPage = FuturisticTrainingBeltPage - 1;
		}
		else if (MouseIn(1825, 240, 150, 90) && FuturisticTrainingBeltPage < FuturisticTrainingBeltMaxPage) {
			FuturisticTrainingBeltPage = FuturisticTrainingBeltPage + 1;
		}
		
		if (MouseIn(1550, 840, 350, 64)) {
			if (MouseX <= 1725) Item.Property.PublicModePermission = (FuturisticTrainingBeltPermissions.length + Item.Property.PublicModePermission - 1) % FuturisticTrainingBeltPermissions.length;
				else Item.Property.PublicModePermission = (Item.Property.PublicModePermission + 1) % FuturisticTrainingBeltPermissions.length;
			FuturisticChastityBeltConfigure = true;
		} 
		
		canViewMode = true;
	}
	
	
	if (canViewMode || Item.Property.PublicModePermission == 0 || (Item.Property.PublicModePermission == 1 && LogQuery("ClubMistress", "Management"))) {
		if (MouseIn(1550, 910, 350, 64)) {
			if (MouseX <= 1725) FuturisticTrainingBeltSetMode = (FuturisticTrainingBeltModes.length + FuturisticTrainingBeltSetMode - 1) % FuturisticTrainingBeltModes.length;
			else FuturisticTrainingBeltSetMode = (FuturisticTrainingBeltSetMode + 1) % FuturisticTrainingBeltModes.length;
			FuturisticTrainingBeltResetCooldown = true;
			FuturisticChastityBeltConfigure = true;
		}
	}
}

function InventoryItemPelvisFuturisticTrainingBeltExit() {
	if (FuturisticTrainingBeltResetCooldown && DialogFocusItem.Property && DialogFocusItem.Property.DeviceState == FuturisticTrainingBeltStates.indexOf("Cooldown")) DialogFocusItem.Property.DeviceState = FuturisticTrainingBeltStates.indexOf("None");
	FuturisticTrainingBeltResetCooldown = false;
	if (FuturisticChastityBeltConfigure) {
		FuturisticChastityBeltConfigure = false;
		DialogFocusItem.Property.PublicModeCurrent = FuturisticTrainingBeltSetMode;
		FuturisticTrainingBeltSetMode = -1; // Reset for future
		FuturisticTrainingBeltPage = 0; // Reset for future
		
		if (ElementValue("PunishRequiredSpeechWord") && ElementValue("PunishRequiredSpeechWord").length > 1) {
			DialogFocusItem.Property.PunishRequiredSpeechWord = ElementValue("PunishRequiredSpeechWord").replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ");
		}
		
		InventoryItemPelvisFuturisticTrainingBeltPublishGeneric(CurrentCharacter, "FuturisticChastityBeltSetGeneric");
	} else InventoryItemMouthFuturisticPanelGagExitAccessDenied();
	
	ElementRemove("PunishRequiredSpeechWord");
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

function InventoryItemPelvisFuturisticTrainingBeltValidate(C, Item) {
	return InventoryItemMouthFuturisticPanelGagValidate(C, Item); // All futuristic items refer to the gag
}

/*
function InventoryItemPelvisFuturisticTrainingBeltRunOrgasmControl(C) {
	if (CurrentScreen == "ChatRoom" || CurrentScreen == "Private" && (C.ArousalSettings != null) && (C.ArousalSettings.Active != null) && (C.ArousalSettings.Active != "Inactive") && (C.ArousalSettings.Active != "NoMeter")) {
		if ((C.ArousalSettings.OrgasmTimer != null) && (typeof C.ArousalSettings.OrgasmTimer === "number") && !isNaN(C.ArousalSettings.OrgasmTimer) && (C.ArousalSettings.OrgasmTimer > 0)) {
			if (C.ArousalSettings.OrgasmStage == 0) {
				ActivityOrgasmGameGenerate(0); // We generate the orgasm stage to deny the player the opportunity to surrender
			}
		}
	}
	if ((ActivityOrgasmGameTimer != null) && (ActivityOrgasmGameTimer > 0) && (CurrentTime < C.ArousalSettings.OrgasmTimer)) {
		// Ruin the orgasm
		if (ActivityOrgasmGameProgress >= ActivityOrgasmGameDifficulty - 3 || CurrentTime > C.ArousalSettings.OrgasmTimer - 3200) {
			if (CurrentScreen == "ChatRoom") {
				if (CurrentTime > C.ArousalSettings.OrgasmTimer - 3200) {
					ChatRoomMessage({ Content: "FuturisticTrainingBeltOrgasmEdgedTimeout", Type: "Action", Sender: Player.MemberNumber });
				} else {
					ChatRoomMessage({ Content: "FuturisticTrainingBeltOrgasmEdged", Type: "Action", Sender: Player.MemberNumber });
				}
			}
			ActivityOrgasmGameResistCount++;
			ActivityOrgasmStop(C, 65 + Math.ceil(Math.random()*20));
		}
	}
	
}*/

function InventoryItemPelvisFuturisticTrainingBeltNpcDialog(C, Option) { InventoryItemPelvisMetalChastityBeltNpcDialog(C, Option); }

function InventoryItemPelvisFuturisticTrainingBeltGetVibeMode(C, State, First) {
	const ArousalActive = C.ArousalSettings && C.ArousalSettings.Progress && ["Manual", "Hybrid", "Automatic"].includes(C.ArousalSettings.Active);
	if (State.includes("Edge")) {
		if (First || (ArousalActive &&(C.ArousalSettings.Progress < 60 || C.ArousalSettings.Progress > 90)) || (CommonTime() % FuturisticTrainingBeltRandomEdgeCycle > FuturisticTrainingBeltRandomEdgeCycle / 5)) {
			if ((ArousalActive && C.ArousalSettings.Progress > 90))
				return VibratorMode.MAXIMUM;
			else return VibratorMode.HIGH;
		} else
			return VibratorMode.LOW;
	}
	if (State.includes("Tease")) {
		if (Math.random() < FuturisticTrainingBeltRandomTeaseMaxChance) return VibratorMode.MAXIMUM;
		if (ArousalActive) {
			if (C.ArousalSettings.Progress < 35) return VibratorMode.HIGH;
			if (C.ArousalSettings.Progress < 70) return VibratorMode.MEDIUM;
		} 
		return VibratorMode.LOW;
	}
	if (State.includes("Max")) return VibratorMode.MAXIMUM;
	if (State.includes("Medium")) return VibratorMode.MEDIUM;
	if (State.includes("Low")) return VibratorMode.LOW;
	return VibratorMode.OFF;
}

// This function sets the vibration mode, similar to the extended vibrators
function InventoryItemPelvisFuturisticTrainingBeltUpdateVibeMode(C, Item, Force) {
	var OldIntensity = Item.Property.Intensity;
	var State = (Item.Property && Item.Property.DeviceState) ? FuturisticTrainingBeltStates[Item.Property.DeviceState] : "None";
	var VibeMode = InventoryItemPelvisFuturisticTrainingBeltGetVibeMode(C, State, OldIntensity < 0);
	
	if (Force || Item.Property.DeviceVibeMode != VibeMode) {
		Item.Property.DeviceVibeMode = VibeMode;
		
		var Option = VibratorModeGetOption(VibeMode);
		VibratorModeSetProperty(Item, Option.Property);
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, Item.Asset.Group.Name);

		if (CurrentScreen == "ChatRoom") {
			var Message;
			var Dictionary = [
				{ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber },
				{ Tag: "AssetName", AssetName: Item.Asset.Name },
			];

			Message = "FuturisticTrainingBeltSetState" + FuturisticTrainingBeltStates[Item.Property.DeviceState] + VibeMode;
			Dictionary.push({ Tag: "SourceCharacter", Text: C.Name, MemberNumber: Player.MemberNumber });
			// This is meant to cut down on spam for other players
			if (FuturisticTrainingBeltStates[Item.Property.DeviceState].includes("Edge") && (OldIntensity >= 0 && OldIntensity < 3))
				ChatRoomMessage({ Content: Message+"Self", Type: "Action", Sender: Player.MemberNumber, Dictionary: Dictionary  });
			else {
				if (Item.Property && Item.Property.ChatMessage) {
					Dictionary.push({ Automatic: true });
					ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
				} else {
					ChatRoomMessage({ Content: Message, Type: "Action", Sender: Player.MemberNumber, Dictionary: Dictionary  });
				}
			}
				
		}
		if (Item.Property.Intensity > OldIntensity) {
			if (Item.Property.Intensity >= 3)
				CharacterSetFacialExpression(C, "Blush", "Extreme", 5);
			else if (Item.Property.Intensity > 1)
				CharacterSetFacialExpression(C, "Blush", "VeryHigh", 5);
			else CharacterSetFacialExpression(C, "Blush", "Medium", 5);
		}
	}
}

function InventoryFuturisticTrainingBeltCheckPunishSpeech(Item, LastTime) {
	if (!Item) return "";
	if (!Item.Property) return "";
	// Search from latest message backwards, allowing early exit
	for (let CH = ChatRoomChatLog.length - 1; CH >= 0; CH--) {

		// Messages are in order, no need to keep looping
		if (ChatRoomChatLog[CH].Time <= LastTime) break

		// If the message is OOC, just return immediately
		if (ChatRoomChatLog[CH].Chat.indexOf('(') == 0) return "";

		if (ChatRoomChatLog[CH].SenderMemberNumber == Player.MemberNumber) {
			let msg = ChatRoomChatLog[CH].Chat.toUpperCase().replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ");
			let msgTruncated = ChatRoomChatLog[CH].Chat.toUpperCase().replace(/[^a-z0-9]/gmi, "").replace(/\s+/g, "");

			if (Item.Property.PunishSpeech > 0 && msgTruncated.length > FuturisticTrainingBeltSpeechCharacterLimit) return "Speech";
			
			
			if (Item.Property.PunishRequiredSpeech > 0 && Item.Property.PunishRequiredSpeechWord && msg.length > 0) {
				let gagLevel = SpeechGetTotalGagLevel(Player)
				if (gagLevel < 8) {
					let checkWord = SpeechGarbleByGagLevel(gagLevel, Item.Property.PunishRequiredSpeechWord.replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, " ")).toUpperCase();
					if (!msg.includes(checkWord)) return "RequiredSpeech";
				}
			}
		}
	}
}

function AssetsItemPelvisFuturisticTrainingBeltScriptUpdatePlayer(data, LastTime) {
	let Item = data.Item;
	let C = data.C;
	
	if (Item.Property) {
		let punishment = InventoryFuturisticChastityBeltCheckPunish(Item);
		if (punishment != "") {
			if (punishment == "Orgasm") {
				if (Item.Property.PunishOrgasm && C.ArousalSettings && C.ArousalSettings.OrgasmStage > 1) {
					AssetsItemPelvisFuturisticChastityBeltScriptTrigger(C, Item, "Orgasm");
					Item.Property.NextShockTime = CurrentTime + FuturisticChastityBeltShockCooldownOrgasm; // Difficult to have two orgasms in 10 seconds
				}
			} else if (punishment == "StruggleOther") {
				AssetsItemPelvisFuturisticChastityBeltScriptTrigger(C, Item, "StruggleOther");
				StruggleProgressStruggleCount = 0;
				StruggleProgress = 0;
				DialogLeaveDueToItem = true;
			} else if (punishment == "Struggle") {
				AssetsItemPelvisFuturisticChastityBeltScriptTrigger(C, Item, "Struggle");
				StruggleProgressStruggleCount = 0;
				DialogLeaveDueToItem = true;
			}
		} else if (Item.Property.PunishStandup && FuturisticTrainingBeltStandUpFlag) {
			AssetsItemPelvisFuturisticChastityBeltScriptTrigger(C, Item, "Standup");
			CharacterSetActivePose(Player, "Kneel");
			ServerSend("ChatRoomCharacterPoseUpdate", { Pose: Player.ActivePose });
		} else {
			punishment = InventoryFuturisticTrainingBeltCheckPunishSpeech(Item, LastTime);
			let Property = Item.Property;
			if (punishment == "Speech") {
				let NoShock = true;
				if (Item.Property.PunishSpeech == FuturisticTrainingBeltSpeechPunishments.indexOf("Shock")) NoShock = false;
				else if (Item.Property.PunishSpeech == FuturisticTrainingBeltSpeechPunishments.indexOf("Edge")) {
					if (!FuturisticTrainingBeltStates[Item.Property.DeviceState].includes("HighPriority")) {
						Property.DeviceState = FuturisticTrainingBeltStates.indexOf("HighPriorityEdge");
						Property.DeviceStateTimer = CommonTime() + FuturisticTrainingBeltPunishmentEdgeDuration;
					} else Property.DeviceStateTimer = CommonTime() + FuturisticTrainingBeltPunishmentVibeDuration;
					InventoryItemPelvisFuturisticTrainingBeltUpdateVibeMode(C, Item);					
				} else if (Item.Property.PunishSpeech == FuturisticTrainingBeltSpeechPunishments.indexOf("Vibe")) {
					if (!FuturisticTrainingBeltStates[Item.Property.DeviceState].includes("HighPriority"))
						Property.DeviceState = FuturisticTrainingBeltStates.indexOf("HighPriorityMax");
					Property.DeviceStateTimer = Math.max(Property.DeviceStateTimer, CommonTime() + FuturisticTrainingBeltPunishmentVibeDuration);
					InventoryItemPelvisFuturisticTrainingBeltUpdateVibeMode(C, Item);					
				}
				
				AssetsItemPelvisFuturisticChastityBeltScriptTrigger(C, Item, "Speech", "", NoShock);
			} else if (punishment == "RequiredSpeech")  {
				let NoShock = true;
				if (Item.Property.PunishRequiredSpeech == FuturisticTrainingBeltSpeechPunishments.indexOf("Shock")) NoShock = false;
				else if (Item.Property.PunishRequiredSpeech == FuturisticTrainingBeltSpeechPunishments.indexOf("Edge")) {
					if (!FuturisticTrainingBeltStates[Item.Property.DeviceState].includes("HighPriority")) {
						Property.DeviceState = FuturisticTrainingBeltStates.indexOf("HighPriorityEdge");
						Property.DeviceStateTimer = CommonTime() + FuturisticTrainingBeltPunishmentEdgeDuration;
					} else Property.DeviceStateTimer = CommonTime() + FuturisticTrainingBeltPunishmentVibeDuration;
					InventoryItemPelvisFuturisticTrainingBeltUpdateVibeMode(C, Item);					
				} else if (Item.Property.PunishRequiredSpeech == FuturisticTrainingBeltSpeechPunishments.indexOf("Vibe")) {
					if (!FuturisticTrainingBeltStates[Item.Property.DeviceState].includes("HighPriority"))
						Property.DeviceState = FuturisticTrainingBeltStates.indexOf("HighPriorityMax");
					Property.DeviceStateTimer = Math.max(Property.DeviceStateTimer, CommonTime() + FuturisticTrainingBeltPunishmentVibeDuration);
					InventoryItemPelvisFuturisticTrainingBeltUpdateVibeMode(C, Item);					
				}
				
				AssetsItemPelvisFuturisticChastityBeltScriptTrigger(C, Item, "RequiredSpeech", Item.Property.PunishRequiredSpeechWord, NoShock);
			}
		}
	}
	
	FuturisticTrainingBeltStandUpFlag = false;
}

function AssetsItemPelvisFuturisticTrainingBeltScriptStateMachine(data) {
	var update = false;
	
	// We have a state machine
	var Item = data.Item;
	var C = data.C;
	
	var ArousalActive = C.ArousalSettings && C.ArousalSettings.Progress && ["Manual", "Hybrid", "Automatic"].includes(C.ArousalSettings.Active)
	var Property = Item ? Item.Property : null;
	if (!Property) return;
	
	// Get the state
	var State = FuturisticTrainingBeltStates[Property.DeviceState ? Property.DeviceState : FuturisticTrainingBeltStates.indexOf("None")];
	var Mode = FuturisticTrainingBeltModes[Property.PublicModeCurrent ? Property.PublicModeCurrent : 0];
	var StateTimerReady = !(Property.DeviceStateTimer > 0); // Are we ready to start a new event? 
	var StateTimerOver = CommonTime() > Property.DeviceStateTimer; // End the current event
	
	
	
	// Basics of the state machine
	// In high priority, the state must time out before anything special happens. 
	
	if (State.includes("HighPriority")) {// High priority timer
		if (StateTimerOver) {
			Property.DeviceState = FuturisticTrainingBeltStates.indexOf("None");
			update = true;
		}
	} else if (State.includes("LowPriority") || State == "None") {// Check low priority states
		var DeviceSetToState = -1;
		var DeviceTimer = 0;
		if (State != "None" && Mode == "None") { // If the mode is None then we turn off if we are LowPriority regardless of what
			Property.DeviceState = FuturisticTrainingBeltStates.indexOf("None"); // None
			update = true;
		} else if (Mode == "EdgeAndDeny") {
			if (State != "Cooldown")
				DeviceSetToState = FuturisticTrainingBeltStates.indexOf("LowPriorityEdge");
			if (ArousalActive && C.ArousalSettings.Progress > 90) {
				if (Math.random() < FuturisticTrainingBeltRandomDenyChance) {
					DeviceSetToState = FuturisticTrainingBeltStates.indexOf("Cooldown");
					Property.DeviceStateTimer = CommonTime() + FuturisticTrainingBeltRandomDenyDuration;
					update = true;
				}
			}
			
		} else if (Mode == "RandomTeasing") {
			if (State != "LowPriorityTease")
				DeviceSetToState = 0;
			if (State == "None") {
				if (Math.random() < FuturisticTrainingBeltRandomTeaseChance) {
					const r = Math.random();
					DeviceSetToState = FuturisticTrainingBeltStates.indexOf("LowPriorityTease");
					DeviceTimer = FuturisticTrainingBeltRandomTeaseDurationMin + (FuturisticTrainingBeltRandomTeaseDurationMax - FuturisticTrainingBeltRandomTeaseDurationMin) * r * r * r;
				}
			} else DeviceTimer = 1;
		} else if (Mode == "RandomOrgasm") {
			if (State != "LowPriorityMax")
				DeviceSetToState = 0;
			
			if (State == "None") {
				if (Math.random() < FuturisticTrainingBeltRandomOrgasmChance) {
					const r = Math.random();
					DeviceSetToState = FuturisticTrainingBeltStates.indexOf("LowPriorityMax");
					DeviceTimer = FuturisticTrainingBeltRandomOrgasmDurationMin + (FuturisticTrainingBeltRandomOrgasmDurationMax - FuturisticTrainingBeltRandomOrgasmDurationMin) * r * r * r;
				} else DeviceSetToState = -1;
			} else DeviceTimer = 1;
		} else if (Mode == "FullPower") {
			DeviceSetToState = FuturisticTrainingBeltStates.indexOf("LowPriorityMax");
		} else if (Mode == "Tease") {
			DeviceSetToState = FuturisticTrainingBeltStates.indexOf("LowPriorityLow");
		} else if (Mode == "Excite") {
			DeviceSetToState = FuturisticTrainingBeltStates.indexOf("LowPriorityMedium");
		}
		if (DeviceSetToState > -1) {
			if (DeviceSetToState != Property.DeviceState) {
				Property.DeviceState = DeviceSetToState; // Low priority edge
				Property.DeviceStateTimer = CommonTime() + DeviceTimer;
				update = true;
			} else if (StateTimerOver && DeviceTimer != 0) {
				Property.DeviceState = FuturisticTrainingBeltStates.indexOf("Cooldown");
				Property.DeviceStateTimer = CommonTime();
				update = true;
			}
			
			StateTimerReady = false;
		}
	} else if (State == "Cooldown" && StateTimerReady) Property.DeviceState = FuturisticTrainingBeltStates.indexOf("None"); // Return to None state
	
	// In the cooldown state we decide when to get ready for another round of good vibrations
	if (State == "Cooldown") {
		var Cooldown = 0;
		if (!State.includes("HighPriority")) {
			if (Mode == "RandomTeasing") {
				Cooldown = FuturisticTrainingBeltRandomTeaseDurationCooldown;
			} else if (Mode == "RandomOrgasm") {
				Cooldown = FuturisticTrainingBeltRandomOrgasmDurationCooldown;
			} else if (Mode == "EdgeAndDeny") {
				Cooldown = FuturisticTrainingBeltRandomDenyDuration;
			}
		}
		if (CommonTime() > Property.DeviceStateTimer + Cooldown) {
			StateTimerReady = true;
		} else StateTimerReady = false;
	}
	
	// Reset state timers
	if (Mode == "None" && !State.includes("HighPriority")) {
		StateTimerOver = true;
		StateTimerReady = true;
	}
	if (StateTimerReady)
		Property.DeviceStateTimer = 0;
	
	if (update || State.includes("Edge")) InventoryItemPelvisFuturisticTrainingBeltUpdateVibeMode(C, Item);
	
	let EdgeMode = State.includes("Edge") || Mode == "EdgeAndDeny" || Mode == "RandomTeasing";
	
	
	if (EdgeMode) {
		if (Item.Property.Effect && !Item.Property.Effect.includes("DenialMode")) {
			Item.Property.Effect.push("DenialMode");
		}
		if (Item.Property.Effect && !Item.Property.Effect.includes("RuinOrgasms")) {
			Item.Property.Effect.push("RuinOrgasms");
		}
	} else {
		if (Item.Property.Effect && Item.Property.Effect.includes("DenialMode")) {
			for (let E = 0; E < Item.Property.Effect.length; E++) {
				let Effect = Item.Property.Effect[E];
				if (Effect == "DenialMode") {
					Item.Property.Effect.splice(E, 1);
					E--;
				}
			}
		}
		if (Item.Property.Effect && Item.Property.Effect.includes("RuinOrgasms")) {
			for (let E = 0; E < Item.Property.Effect.length; E++) {
				let Effect = Item.Property.Effect[E];
				if (Effect == "RuinOrgasms") {
					Item.Property.Effect.splice(E, 1);
					E--;
				}
			}
		}
	}
	
	
	
	if (ArousalActive) {
		if (EdgeMode && C.ArousalSettings.Progress > 96 && !((ActivityOrgasmGameTimer != null) && (ActivityOrgasmGameTimer > 0) && (CurrentTime < C.ArousalSettings.OrgasmTimer))) { // Manually trigger orgasm at this stage 
			DialogLeave();
			ActivityOrgasmPrepare(C, true);
			// Continuous edging~
			if (Mode == "EdgeAndDeny")
				C.ArousalSettings.Progress = 80;
		}
	}
}

// Update data
function AssetsItemPelvisFuturisticTrainingBeltScriptDraw(data) {
	var persistentData = data.PersistentData();
	var property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;
	if (typeof persistentData.LastMessageLen !== "number") persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
	if (typeof persistentData.CheckTime !== "number") persistentData.CheckTime = 0;

	// Trigger a check if a new message is detected
	let lastMsgIndex = ChatRoomChatLog.length - 1
	if (lastMsgIndex >= 0 && ChatRoomChatLog[lastMsgIndex].Time > persistentData.CheckTime)
		persistentData.UpdateTime = Math.min(persistentData.UpdateTime, CommonTime() + 200); // Trigger if the user speaks

	if (persistentData.UpdateTime < CommonTime() && data.C == Player) {

		if (CommonTime() > property.NextShockTime) {
			AssetsItemPelvisFuturisticTrainingBeltScriptUpdatePlayer(data, persistentData.CheckTime);
			AssetsItemPelvisFuturisticTrainingBeltScriptStateMachine(data);
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		var timeToNextRefresh = 950;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
		
		// Set CheckTime to last processed chat message time
		persistentData.CheckTime = (lastMsgIndex >= 0 ? ChatRoomChatLog[lastMsgIndex].Time : 0);
	}
}
