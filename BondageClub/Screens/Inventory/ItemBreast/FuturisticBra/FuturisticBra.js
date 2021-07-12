"use strict";

var small_yoffset = -5;
var normal_yoffset = 0;
var large_yoffset = 4;
var xlarge_yoffset = 7;

var InventoryItemBreastFuturisticBraOptions = [
	{
		Name: "Show",
		Property: {
			Type: null,
		},
	},
	{
		Name: "Solid",
		Property: {
			Type: "Solid",
		},
	},
	{
		Name: "Show2",
		Property: {
			Type: "Show2",
		},
	},
	{
		Name: "Solid2",
		Property: {
			Type: "Solid2",
		},
	},
];


// Loads the item extension properties
function InventoryItemBreastFuturisticBraLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { HeartRate: 0, HeartIcon: false };
	if (DialogFocusItem.Property.HeartRate == null) DialogFocusItem.Property.HeartRate = 0;
	if (DialogFocusItem.Property.HeartIcon == null) DialogFocusItem.Property.HeartIcon = false;

}

function InventoryItemBreastFuturisticBraUpdate(C) {
	var current_bpm = 65;
	var current_breathing = "Low";
	var current_temp = 37;



	if (C.MemberNumber) {
		current_bpm += C.MemberNumber % 20; // 'Pseudo random baseline'
	}

	if (C.ArousalSettings && C.ArousalSettings.Progress > 0) {
		var Progress = C.ArousalSettings.Progress;
		current_bpm += Math.floor(Progress*0.60);
		current_temp += Math.floor(Progress*0.1)/10;
		if ((C.ArousalSettings.OrgasmStage && C.ArousalSettings.OrgasmStage > 0) || (C.ArousalSettings.ProgressTimer && C.ArousalSettings.ProgressTimer > 1)) {
			current_breathing = "Action";
			current_bpm += 10;
			current_temp += 0.5;
		} else if (C.ArousalSettings.Progress > 10) {
			if (C.ArousalSettings.Progress > 90) {
				current_breathing = "High";
			} else {
				current_breathing = "Med";
			}
		}

	}
	return {bpm: current_bpm, breathing: current_breathing, temp: current_temp};
}

// Draw the item extension screen
function InventoryItemBreastFuturisticBraDraw() {
	DrawAssetPreview(1387, 225, DialogFocusItem.Asset);

	var C = CharacterGetCurrent();

	var update = InventoryItemBreastFuturisticBraUpdate(C);
	var current_bpm = update.bpm;
	var current_breathing = update.breathing;
	var current_temp = update.temp;

	DrawText(DialogFindPlayer("FuturisticBraPlayerDesc") + " " + C.MemberNumber, 1500, 600, "White", "Gray");
	DrawText(DialogFindPlayer("FuturisticBraPlayerHeartRate") + " " + current_bpm + " " + DialogFindPlayer("FuturisticBraPlayerHeartRateBPM"), 1500, 680, "White", "Gray");
	DrawText(DialogFindPlayer("FuturisticBraPlayerTemp") + " " + current_temp + DialogFindPlayer("FuturisticBraPlayerTempC"), 1500, 730, "White", "Gray");
	DrawText(DialogFindPlayer("FuturisticBraPlayerBreathing") + " " + DialogFindPlayer("FuturisticBraPlayerBreathing" + current_breathing), 1500, 780, "White", "Gray");
	DrawText(DialogFindPlayer("FuturisticBraPlayerTracking"), 1500, 830, "White", "Gray");

	// If the player can modify
	if (InventoryItemMouthFuturisticPanelGagValidate(C) == "") {
		if (DialogFocusItem.Property.Type != null) {
			DrawButton(1150, 900, 150, 64, DialogFindPlayer("FuturisticBraPlayerShow"), "White", "");
		} if (DialogFocusItem.Property.Type != "Solid") {
			DrawButton(1337, 900, 150, 64, DialogFindPlayer("FuturisticBraPlayerSolid"), "White", "");
		} if (DialogFocusItem.Property.Type != "Show2") {
			DrawButton(1525, 900, 150, 64, DialogFindPlayer("FuturisticBraPlayerShow2"), "White", "");
		} if (DialogFocusItem.Property.Type != "Solid2") {
			DrawButton(1712, 900, 150, 64, DialogFindPlayer("FuturisticBraPlayerSolid2"), "White", "");
		}
	}


	/*
	DrawText(DialogFindPlayer("Intensity" + DialogFocusItem.Property.Intensity.toString()).replace("Item", DialogFocusItem.Asset.Description), 1500, 600, "White", "Gray");
	if (DialogFocusItem.Property.Intensity > 0) DrawButton(1200, 650, 200, 55, DialogFindPlayer("Low"), "White");
	if (DialogFocusItem.Property.Intensity < 1 || DialogFocusItem.Property.Intensity > 1) DrawButton(1550, 650, 200, 55, DialogFindPlayer("Medium"), "White");
	if (DialogFocusItem.Property.Intensity < 2) DrawButton(1375, 710, 200, 55, DialogFindPlayer("High"), "White");
	if (CurrentScreen == "ChatRoom") DrawButton(1325, 800, 64, 64, "", "White", DialogFocusItem.Property.ShowText ? "Icons/Checked.png" : "");
	if (CurrentScreen == "ChatRoom") DrawText(DialogFindPlayer("ShockCollarShowChat"), 1570, 833, "White", "Gray");
	DrawButton(1375, 900, 200, 55, DialogFindPlayer("TriggerShock"), "White");*/
}

// Catches the item extension clicks
function InventoryItemBreastFuturisticBraClick() {
	if (MouseIn(1885, 25, 90, 90)) DialogFocusItem = null;

	if (MouseIn(1150, 900, 800, 64)) {
		var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;

		// If the player can modify
		if (InventoryItemMouthFuturisticPanelGagValidate(C) == "") {
			if (DialogFocusItem.Property.Type != null && MouseIn(1150, 900, 150, 64)) {
				DialogFocusItem.Property.Type = "";
				if (CurrentScreen == "ChatRoom")
					InventoryItemBreastFuturisticBraPublishAction(C, InventoryItemBreastFuturisticBraOptions[0]);
			} else if (DialogFocusItem.Property.Type != "Solid" && MouseIn(1337, 900, 150, 64)) {
				DialogFocusItem.Property.Type = "Solid";
				if (CurrentScreen == "ChatRoom")
					InventoryItemBreastFuturisticBraPublishAction(C, InventoryItemBreastFuturisticBraOptions[1]);
			} else if (DialogFocusItem.Property.Type != "Show2" && MouseIn(1525, 900, 150, 64)) {
				DialogFocusItem.Property.Type = "Show2";
				if (CurrentScreen == "ChatRoom")
					InventoryItemBreastFuturisticBraPublishAction(C, InventoryItemBreastFuturisticBraOptions[2]);
			} else if (DialogFocusItem.Property.Type != "Solid2" && MouseIn(1712, 900, 150, 64)) {
				DialogFocusItem.Property.Type = "Solid2";
				if (CurrentScreen == "ChatRoom")
					InventoryItemBreastFuturisticBraPublishAction(C, InventoryItemBreastFuturisticBraOptions[3]);
			}

			CharacterRefresh(C, true);
			ChatRoomCharacterUpdate(C);
		}
	}

}

function InventoryItemBreastFuturisticBraPublishAction(C, Option) {
	var msg = "InventoryItemBreastFuturisticBraSet" + Option.Name;
	var Dictionary = [
		{ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber },
		{ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber },
	];
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

/*




// Sets the shock collar intensity
function InventoryItemBreastFuturisticBraSetIntensity(Modifier) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemBreastFuturisticBraLoad();
	}

	DialogFocusItem.Property.Intensity = DialogFocusItem.Property.Intensity + Modifier;
	if (DialogFocusItem.Property.ShowText) {
		var Dictionary = [];
		Dictionary.push({Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber});
		Dictionary.push({Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber});
		Dictionary.push({Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name});
		ChatRoomPublishCustomAction("ShockCollarSet" + DialogFocusItem.Property.Intensity, true, Dictionary);
	}
	else
		DialogLeave();

}

// Trigger a shock from the dialog menu
function InventoryItemBreastFuturisticBraTrigger() {
	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemBreastFuturisticBraLoad();
	}

	var Dictionary = [];
	Dictionary.push({ Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({Tag: "AssetName", AssetName: DialogFocusItem.Asset.Name});
	Dictionary.push({ Tag: "ActivityName", Text: "ShockItem" });
	Dictionary.push({ Tag: "ActivityGroup", Text: DialogFocusItem.Asset.Group.Name });
	Dictionary.push({ AssetName: DialogFocusItem.Asset.Name });
	Dictionary.push({ AssetGroupName: DialogFocusItem.Asset.Group.Name });

	ChatRoomPublishCustomAction("TriggerShock" + DialogFocusItem.Property.Intensity, true, Dictionary);

	if (C.ID == Player.ID) {
		// The Player shocks herself
		ActivityArousalItem(C, C, DialogFocusItem.Asset);
	}

    CharacterSetFacialExpression(C, "Eyebrows", "Soft", 10);
    CharacterSetFacialExpression(C, "Blush", "Soft", 15);
    CharacterSetFacialExpression(C, "Eyes", "Closed", 5);
}



function InventoryItemBreastFuturisticBraDynamicAudio(data) {
	var Modifier = parseInt(data.Content.substr(data.Content.length - 1));
	if (isNaN(Modifier)) Modifier = 0;
	return ["Shocks", Modifier * 3];
}
*/

// Drawing function for the text on the bra
function AssetsItemBreastFuturisticBraAfterDraw({
    C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, G, Color
}) {
	if (L === "_Text" && Property && (Property.Type != "Solid" && Property.Type != "Solid2")) {

		var offset = normal_yoffset;
		if (G == "_Large") offset = large_yoffset;
		if (G == "_XLarge") offset = xlarge_yoffset;
		if (G == "_Small") offset = small_yoffset;

		// We set up a canvas
		const Height = 50;
		const Width = 55;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);

		// We draw the desired info on that canvas
		let context = TempCanvas.getContext('2d');
		context.font = "bold 14px sansserif";
		context.fillStyle = "Black";
		context.textAlign = "center";
		context.fillText((Property && Property.HeartRate) ? Property.HeartRate : "--", Width / 2 + 1, Width / 2 - 1, Width);
		context.fillText((Property && Property.HeartRate) ? Property.HeartRate : "--", Width / 2 - 1, Width / 2 + 1, Width);
		context.fillText((Property && Property.HeartRate) ? Property.HeartRate : "--", Width / 2 + 1, Width / 2 + 1, Width);
		context.fillText((Property && Property.HeartRate) ? Property.HeartRate : "--", Width / 2 - 1, Width / 2 - 1, Width);

		context.font = "bold 14px sansserif";
		context.fillStyle = Color;
		context.textAlign = "center";
		context.fillText((Property && Property.HeartRate) ? Property.HeartRate : "--", Width / 2, Width / 2, Width);

		// We print the canvas to the character based on the asset position
		drawCanvas(TempCanvas, X + 47, Y + 103.5 + offset, AlphaMasks);

		drawCanvasBlink(TempCanvas, X + 47, Y + 103.5 + offset, AlphaMasks);
	}
}

// Update data
function AssetsItemBreastFuturisticBraScriptDraw(data) {
	var persistentData = data.PersistentData();
	var property = (data.Item.Property = data.Item.Property || {});
	if (typeof persistentData.UpdateTime !== "number") persistentData.UpdateTime = CommonTime() + 4000;

	if (persistentData.UpdateTime < CommonTime()) {
		var update = InventoryItemBreastFuturisticBraUpdate(data.C);
		property.HeartRate = update.bpm;
		if (property.Type != "Solid" && property.Type != "Solid2")
			if (property.Type == "Show2Heart" || property.Type == "Show2")
				property.Type = (update.breathing == "Action" || update.breathing == "High") ? "Show2Heart" : "Show2";
			else property.Type = (update.breathing == "Action" || update.breathing ==  "High") ? "Heart" : null;

		var timeToNextRefresh = 1100;
		persistentData.UpdateTime = CommonTime() + timeToNextRefresh;
		AnimationRequestRefreshRate(data.C, 5000 - timeToNextRefresh);
		AnimationRequestDraw(data.C);
	}
}
