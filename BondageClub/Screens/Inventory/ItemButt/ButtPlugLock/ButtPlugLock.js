"use strict";
var InventoryItemButtButtPlugLockMessage = "SelectAttachmentState";

// Loads the item extension properties
function InventoryItemButtButtPlugLockLoad() {
	if (DialogFocusItem.Property == null) DialogFocusItem.Property = { Type: null, Restrain: null };
	InventoryItemButtButtPlugLockMessage = "SelectAttachmentState";
}

// check, if a short chain can be applied
function InventoryItemButtButtPlugLockChainShortPrerequesites(C) {
	var ChainShortPrerequisites = true;
	if (C.Pose.indexOf("Suspension") >= 0 || C.Effect.indexOf("BlockKneel") >= 0 || C.Pose.indexOf("SuspensionHogtied") >= 0 || C.Effect.indexOf("Mounted") >= 0) {
		ChainShortPrerequisites = false;
	} // if
	return ChainShortPrerequisites;
} //getChainShortPrerequesites

// Draw the item extension screen
function InventoryItemButtButtPlugLockDraw() {
	const A = DialogFocusItem.Asset;
	const Property = DialogFocusItem.Property;

	// Variables to check if short chain can be applied
	const C = CharacterGetCurrent();
	const ChainShortPrerequisites = InventoryItemButtButtPlugLockChainShortPrerequesites(C);

	// Draw the header and item
	DrawAssetPreview(1387, 125, A);


	// Draw the possible poses
	DrawText(DialogFindPlayer(InventoryItemButtButtPlugLockMessage), 1500, 500, "white", "gray");

	DrawPreviewBox(1000, 550, `${AssetGetInventoryPath(A)}/Base.png`, DialogFindPlayer("ButtPlugLockPoseBase"), {Hover: true, Disabled: Property.Type === null});
	DrawPreviewBox(1250, 550, `${AssetGetInventoryPath(A)}/ChainShort.png`, DialogFindPlayer("ButtPlugLockPoseChainShort"), {Hover: true, Disabled: Property.Type === "ChainShort" || !ChainShortPrerequisites});
	DrawPreviewBox(1500, 550, `${AssetGetInventoryPath(A)}/ChainLong.png`, DialogFindPlayer("ButtPlugLockPoseChainLong"), {Hover: true, Disabled: Property.Type === "ChainLong" || C.Pose.includes("Suspension")});
}

// Catches the item extension clicks
function InventoryItemButtButtPlugLockClick() {
	const Property = DialogFocusItem.Property

	// Variables to check if short chain can be applied
	const C = CharacterGetCurrent();
	const ChainShortPrerequisites = InventoryItemButtButtPlugLockChainShortPrerequesites(C);

	// Trigger click handlers
	if (MouseIn(1885, 25, 90, 90)) DialogFocusItem = null;
	else if (MouseIn(1000, 550, 225, 275) && (Property.Restrain != null)) InventoryItemButtButtPlugLockSetPose(null);
	else if (MouseIn(1250, 550, 225, 275) && ((Property.Restrain == null) || (Property.Restrain != "ChainShort")) && ChainShortPrerequisites) InventoryItemButtButtPlugLockSetPose("ChainShort");
	else if (MouseIn(1500, 550, 225, 275) && ((Property.Restrain == null) || (Property.Restrain != "ChainLong")) && !C.Pose.includes("Suspension")) InventoryItemButtButtPlugLockSetPose("ChainLong");
}


// Sets the item pose (shorts chains, long chains or none)
function InventoryItemButtButtPlugLockSetPose(NewPose) {

	// Gets the current item and character
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if ((CurrentScreen == "ChatRoom") || (DialogFocusItem == null)) {
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);
		InventoryItemButtButtPlugLockLoad();
	}

	// Sets the new pose with it's effects
	DialogFocusItem.Property.Restrain = NewPose;
	if (NewPose == null) {
		delete DialogFocusItem.Property.Effect;
		delete DialogFocusItem.Property.Type;
		delete DialogFocusItem.Property.SetPose;
		delete DialogFocusItem.Property.AllowPose;
	} else {
		DialogFocusItem.Property.Type = NewPose;
		if (NewPose == "ChainShort") {
			DialogFocusItem.Property.Effect = ["Freeze", "ForceKneel", "IsChained"];
			DialogFocusItem.Property.SetPose = ["Kneel"];
		}
		if (NewPose == "ChainLong") {
			DialogFocusItem.Property.SetPose = [""];
			DialogFocusItem.Property.Effect = ["Tethered", "IsChained"];
			DialogFocusItem.Property.AllowPose = ["Kneel", "Horse", "KneelingSpread"];
		}
	}

	// Adds the lock effect back if it was padlocked
	if ((DialogFocusItem.Property.LockedBy != null) && (DialogFocusItem.Property.LockedBy != "")) {
		if (DialogFocusItem.Property.Effect == null) DialogFocusItem.Property.Effect = [];
		DialogFocusItem.Property.Effect.push("Lock");
	}

	// Refreshes the character and chatroom
	CharacterRefresh(C);
	var msg = "ButtPlugLockRestrain" + ((NewPose == null) ? "Base" : NewPose);
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "DestinationCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);

	// Rebuilds the inventory menu
	if (DialogInventory != null) {
		DialogFocusItem = null;
		DialogMenuButtonBuild(C);
	}

}
