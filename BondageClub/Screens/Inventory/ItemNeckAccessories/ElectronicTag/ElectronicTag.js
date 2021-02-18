"use strict";
// Loads the item extension properties
function InventoryItemNeckAccessoriesElectronicTagLoad() {
    var C = CharacterGetCurrent();
	var MustRefresh = false;
	
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = {};
	if (DialogFocusItem.Property.Text == null) {
		DialogFocusItem.Property.Text = "Tag";
		MustRefresh = true;
	}
	if (MustRefresh) {
		CharacterRefresh(C);
		ChatRoomCharacterItemUpdate(C, DialogFocusItem.Asset.Group.Name);
	}
	
	// Only create the inputs if the item isn't locked
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		ElementCreateInput("TagText", "text", DialogFocusItem.Property.Text, "9");
	}
}

// Draw the extension screen
function InventoryItemNeckAccessoriesElectronicTagDraw() {
	var C = CharacterGetCurrent();
	// Draw the header and item
	DrawAssetPreview(1387, 125, DialogFocusItem.Asset);

	if (C.TamperLock) {
		var samelock = 0
		var total = 0
		var sameperson = true
		var name = ""
		var membernumber = ""
		for (var G in C.TamperLock) {
			var lock = InventoryGetLock(InventoryGet(C, G))
			if (lock && lock.Asset && lock.Asset.Name == C.TamperLock[G].LockType) {
				total += 1;
				if (membernumber == "") {
					membernumber = C.TamperLock[G].AppliedBy;
					name = C.TamperLock[G].AppliedByName;
				}
				else if (membernumber != C.TamperLock[G].AppliedBy) sameperson = false
				if (sameperson)	samelock += 1;
			}
		}
		if (total > 0) {
			if (samelock == total) {
				if (membernumber != Player.MemberNumber)
					DrawText(DialogFindPlayer("ElectronicTagGoodLock") + name, 1500, 825, "white", "gray");
				else DrawText(DialogFindPlayer("ElectronicTagGoodLockYou"), 1500, 825, "#88FF88", "gray");
			} else {
				DrawText(DialogFindPlayer("ElectronicTagBadLock"), 1500, 825, "red", "gray");
			}
		}
	}


    // Tag data
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		ElementPosition("TagText", 1375, 680, 250);
		DrawButton(1500, 651, 350, 64, DialogFindPlayer("CustomTagText"), ElementValue("TagText").match(InventoryItemNeckAccessoriesCustomCollarTagAllowedChars) ? "White" : "#888", "");
	} else {
		DrawText(DialogFindPlayer("SelectCollarNameTagTypeLocked"), 1500, 500, "white", "gray");
		
		if (C.TamperLock && C.FocusGroup && C.FocusGroup.Name && C.TamperLock[C.FocusGroup.Name]) {
			var TamperInfo = TamperInfo = C.TamperLock[C.FocusGroup.Name]
			if (TamperInfo.AppliedBy && TamperInfo.AppliedByName && TamperInfo.LastChange) {
				var time = new Date(TamperInfo.LastChange - new Date().getTimezoneOffset() * 60000 )
				DrawText(DialogFindPlayer("TamperLockSetBy") + " " + TamperInfo.AppliedByName + " (" + TamperInfo.AppliedBy.toString() + ")", 1500, 560, "white", "gray");
				DrawText(DialogFindPlayer("TamperLockSetTime") + " " + time.toLocaleDateString(), 1500, 625, "white", "gray");
			} else {
				DrawText("This is a bug, please report it in the discord", 1500, 600, "white", "gray");
			}
		}
    }
}

// Catches the item extension clicks
function InventoryItemNeckAccessoriesElectronicTagClick() {
	
	if (!InventoryItemHasEffect(DialogFocusItem, "Lock", true)) {
		// Change values if they are different and the tag is not locked
		if ((MouseX >= 1500) && (MouseX <= 1850)) {
			// Changes the text
			if ((MouseY >= 671) && (MouseY <= 735) && DialogFocusItem.Property.Text !== ElementValue("TagText") && ElementValue("TagText").match(InventoryItemNeckAccessoriesCustomCollarTagAllowedChars)) {
				DialogFocusItem.Property.Text = ElementValue("TagText");
				InventoryItemNeckAccessoriesElectronicTagChange();
			}
		}
	}
	// Exits the screen
	if (MouseIn(1885, 25, 90, 90)) {
		InventoryItemNeckAccessoriesElectronicTagExit();
	}
}

// Leaves the extended screen
function InventoryItemNeckAccessoriesElectronicTagExit() {
	ElementRemove("TagText");
	PreferenceMessage = "";
	DialogFocusItem = null;
	if (DialogInventory != null) DialogMenuButtonBuild(CharacterGetCurrent());
}

// When the tag is changed
function InventoryItemNeckAccessoriesElectronicTagChange() { 
    var C = CharacterGetCurrent();
    CharacterRefresh(C);
    if (CurrentScreen == "ChatRoom") {
        var Dictionary = [];
        Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
        Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
        ChatRoomPublishCustomAction("ChangeCustomTag", true, Dictionary);
		InventoryItemNeckAccessoriesElectronicTagExit();
    }
}

// Drawing function for the text on the tag
function AssetsItemNeckAccessoriesElectronicTagAfterDraw({
    C, A, X, Y, Property, drawCanvas, drawCanvasBlink, AlphaMasks, L, Color
}) { 
	if (L === "_Text") {
		// We set up a canvas
		const Height = 50;
		const Width = 45;
		const TempCanvas = AnimationGenerateTempCanvas(C, A, Width, Height);
    
		// We draw the desired info on that canvas
		let context = TempCanvas.getContext('2d');
		context.font = "14px sansserif";
		context.fillStyle = Color;
		context.textAlign = "center";
		context.fillText((Property && Property.Text.match(InventoryItemNeckAccessoriesCustomCollarTagAllowedChars) ? Property.Text : "Tag"), Width / 2, Width / 2, Width);
    
		// We print the canvas to the character based on the asset position
		drawCanvas(TempCanvas, X + 228.5, Y + 30, AlphaMasks);
		drawCanvasBlink(TempCanvas, X + 228.5, Y + 30, AlphaMasks);
	}
}
