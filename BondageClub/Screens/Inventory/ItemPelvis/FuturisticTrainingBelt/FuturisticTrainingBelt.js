"use strict";

var FuturisticTrainingBeltPermissions = ["Public", "Mistresses", "Locked"];
var FuturisticTrainingBeltModes = ["None", "EdgeAndDeny", "RandomTeasing", "RandomOrgasm", "FullPower"];
var FuturisticTrainingBeltStates = ["None", "LowPriorityEdge", "LowPriorityTease", "LowPriorityMax", "HighPriorityEdge", "HighPriorityMax", "Cooldown"];

var FuturisticTrainingBeltRandomEdgeCycle = 150000; // 150s = 20% downtime at low intensity, so 30 of low and 120s of high

var FuturisticTrainingBeltRandomTeaseDurationMin = 3000; // 30 seconds
var FuturisticTrainingBeltRandomTeaseDurationMax = 6000; // 5 minutes
var FuturisticTrainingBeltRandomTeaseDurationCooldown = 2000; // 30 seconds
var FuturisticTrainingBeltRandomTeaseChance = 0.03; // Chance per second that this happens
var FuturisticTrainingBeltRandomTeaseMaxChance = 0.1; // Chance that teasing will be maximum
var FuturisticTrainingBeltRandomDenyChance = 0.01; // Chance per second we will deny the player
var FuturisticTrainingBeltRandomDenyDuration = 30000;

var FuturisticTrainingBeltRandomOrgasmDurationMin = 60000; // 1 minute
var FuturisticTrainingBeltRandomOrgasmDurationMax = 3*60000; // 3 minutes
var FuturisticTrainingBeltRandomOrgasmDurationCooldown = 60000; // 1 minute
var FuturisticTrainingBeltRandomOrgasmChance = 0.02; // Chance per second that this happens

var FuturisticTrainingBeltPunishmentEdgeDuration = 30*60000; // 30 minutes edge
var FuturisticTrainingBeltPunishmentOrgasmDuration = 10*60000; // 10 minutes constant orgasms

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
		if (DialogFocusItem.Property.PunishStruggleOther == null) DialogFocusItem.Property.PunishStruggleOther = false;
		if (DialogFocusItem.Property.PunishOrgasm == null) DialogFocusItem.Property.PunishOrgasm = false;
		if (DialogFocusItem.Property.ChatMessage == null) DialogFocusItem.Property.ChatMessage = false;
		if (DialogFocusItem.Property.Intensity == null) DialogFocusItem.Property.Intensity = 0;
		if (DialogFocusItem.Property.PublicModeCurrent == null) DialogFocusItem.Property.PublicModeCurrent = 0;
		if (DialogFocusItem.Property.PublicModePermission == null) DialogFocusItem.Property.PublicModePermission = 0;
		if (DialogFocusItem.Property.DeviceState == null) DialogFocusItem.Property.DeviceState = 0;
		if (DialogFocusItem.Property.DeviceStateTimer == null) DialogFocusItem.Property.DeviceStateTimer = 0;
		if (DialogFocusItem.Property.DeviceVibeMode == null) DialogFocusItem.Property.DeviceVibeMode = VibratorMode.OFF;
		
		// Validation
		if (DialogFocusItem.Property.PublicModePermission >= FuturisticTrainingBeltPermissions.length || DialogFocusItem.Property.PublicModePermission < 0) DialogFocusItem.Property.PublicModePermission = 2;
		if (DialogFocusItem.Property.PublicModeCurrent >= FuturisticTrainingBeltModes.length || DialogFocusItem.Property.PublicModeCurrent < 0) DialogFocusItem.Property.PublicModeCurrent = 2;
		if (DialogFocusItem.Property.DeviceState >= FuturisticTrainingBeltStates.length || DialogFocusItem.Property.DeviceState < 0) DialogFocusItem.Property.DeviceState = 0;
		if (DialogFocusItem.Property.DeviceStateTimer >= CommonTime + 3600000) DialogFocusItem.Property.DeviceStateTimer = 0; // Prevents people from hacking in ultra-long state timers
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
		} else if (MouseIn(1550, 840, 350, 64)) {
			if (MouseX <= 1725) Item.Property.PublicModePermission = (FuturisticTrainingBeltPermissions.length + Item.Property.PublicModePermission - 1) % FuturisticTrainingBeltPermissions.length;
				else Item.Property.PublicModePermission = (Item.Property.PublicModePermission + 1) % FuturisticTrainingBeltPermissions.length;
			FuturisticChastityBeltConfigure = true;
		} 
		
		canViewMode = true;
	}
	
	
	if (canViewMode || Item.Property.PublicModePermission == 0 || (Item.Property.PublicModePermission == 1 && LogQuery("ClubMistress", "Management"))) {
		if (MouseIn(1550, 910, 350, 64)) {
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

			Message = "FuturisticTrainingBeltSetState" + Item.Property.DeviceState + VibeMode;
			Dictionary.push({ Tag: "SourceCharacter", Text: C.Name, MemberNumber: Player.MemberNumber });
			
			Dictionary.push({ Automatic: true });
			// This is meant to cut down on spam for other players
			if (FuturisticTrainingBeltStates[Item.Property.DeviceState].includes("Edge") && (OldIntensity >= 0 && OldIntensity < 3))
				ChatRoomMessage({ Content: Message+"Self", Type: "Action", Sender: Player.MemberNumber });
			else 
				ServerSend("ChatRoomChat", { Content: Message, Type: "Action", Dictionary });
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


function AssetsItemPelvisFuturisticTrainingBeltScriptUpdatePlayer(data) {
	var Item = data.Item;
	var C = data.C;
	
	const punishment = InventoryFuturisticChastityBeltCheckPunish(Item);
	if (punishment) {
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


function AssetsItemPelvisFuturisticTrainingBeltScriptStateMachine(data) {
	var update = false;
	
	// We have a state machine
	var Item = data.Item;
	var C = data.C;
	
	var ArousalActive = C.ArousalSettings && C.ArousalSettings.Progress && ["Manual", "Hybrid", "Automatic"].includes(C.ArousalSettings.Active)
	var Property = Item ? Item.Property : null;
	if (!Property) return;
	
	// Get the state
	var State = FuturisticTrainingBeltStates[Property.DeviceState ? Property.DeviceState : 0];
	var Mode = FuturisticTrainingBeltModes[Property.PublicModeCurrent ? Property.PublicModeCurrent : 0];
	var StateTimerReady = !(Property.DeviceStateTimer > 0); // Are we ready to start a new event? 
	var StateTimerOver = CommonTime() > Property.DeviceStateTimer; // End the current event
	
	
	
	// Basics of the state machine
	// In high priority, the state must time out before anything special happens. 
	
	if (State.includes("HighPriority")) {// High priority timer
		if (StateTimerOver) {
			Property.DeviceState = 0;
			update = true;
		}
	} else if (State.includes("LowPriority") || State == "None") {// Check low priority states
		var DeviceSetToState = -1;
		var DeviceTimer = 0;
		if (State != "None" && Mode == "None") { // If the mode is None then we turn off if we are LowPriority regardless of what
			Property.DeviceState = 0; // None
			update = true;
		} else if (Mode == "EdgeAndDeny") {
			DeviceSetToState = 1;
			if (ArousalActive && C.ArousalSettings.Progress > 90) {
				if (Math.random() < FuturisticTrainingBeltRandomDenyChance) {
					DeviceSetToState = 6;
					Property.DeviceStateTimer = CommonTime();
					update = true;
				}
			}
			
		} else if (Mode == "RandomTeasing") {
			DeviceSetToState = 2;
			if (State == "None") {
				if (Math.random() < FuturisticTrainingBeltRandomTeaseChance) {
					const r = Math.random();
					DeviceTimer = FuturisticTrainingBeltRandomTeaseDurationMin + (FuturisticTrainingBeltRandomTeaseDurationMax - FuturisticTrainingBeltRandomTeaseDurationMin) * r * r * r;
				} else DeviceSetToState = -1;
			} else DeviceTimer = 1;
		} else if (Mode == "RandomOrgasm") {
			DeviceSetToState = 3;
			if (State == "None") {
				if (Math.random() < FuturisticTrainingBeltRandomOrgasmChance) {
					const r = Math.random();
					DeviceTimer = FuturisticTrainingBeltRandomOrgasmDurationMin + (FuturisticTrainingBeltRandomOrgasmDurationMax - FuturisticTrainingBeltRandomOrgasmDurationMin) * r * r * r;
				} else DeviceSetToState = -1;
			} else DeviceTimer = 1;
		} else if (Mode == "FullPower") {
			DeviceSetToState = 3;
		}
		if (DeviceSetToState > -1) {
			if (DeviceSetToState != Property.DeviceState) {
				Property.DeviceState = DeviceSetToState; // Low priority edge
				Property.DeviceStateTimer = CommonTime() + DeviceTimer;
				update = true;
			} else if (StateTimerOver && DeviceTimer != 0) {
				Property.DeviceState = 6;
				Property.DeviceStateTimer = CommonTime();
				update = true;
			}
			
			StateTimerReady = false;
		}
	} else if (State == "Cooldown" && StateTimerReady) Property.DeviceState = 0; // Return to None state
	
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
	if (Mode == "None") {
		StateTimerOver = true;
		StateTimerReady = true;
	}
	if (StateTimerReady) Property.DeviceStateTimer = 0;
	
	if (update || State.includes("Edge")) InventoryItemPelvisFuturisticTrainingBeltUpdateVibeMode(C, Item);
	
	
	if (ArousalActive) {
		if (C.ArousalSettings.Progress > 99 && !((ActivityOrgasmGameTimer != null) && (ActivityOrgasmGameTimer > 0) && (CurrentTime < C.ArousalSettings.OrgasmTimer))) { // Manually trigger orgasm at this stage 
			ActivityOrgasmPrepare(C, true);
		}
	}
	
	else if (State.includes("HighPriorityEdge")) {
		if (!Item.Property.Effect.includes("DenialMode")) {
			Item.Property.Effect.push("DenialMode");
		}
	}
	else if (!State.includes("HighPriorityEdge")) {
		if (Item.Property.Effect.includes("DenialMode")) {
			for (let E = 0; E < Item.Property.Effect.length; E++) {
				var Effect = Item.Property.Effect[E];
				if (Effect == "DenialMode") {
					Item.Property.Effect.splice(E, 1);
					E--;
				}
			}
		}
	}
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
			AssetsItemPelvisFuturisticTrainingBeltScriptStateMachine(data);
			persistentData.LastMessageLen = (ChatRoomLastMessage) ? ChatRoomLastMessage.length : 0;
		}

		var timeToNextRefresh = 950;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}
