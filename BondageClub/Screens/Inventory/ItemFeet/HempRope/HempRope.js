"use strict";

const HempRopeFeetOptions = [
	{
		Name: "Basic",
		Property: { Type: null, SetPose: ["LegsClosed"], Difficulty: 1 }
	}, {
		Name: "FullBinding",
		BondageLevel: 2,
		Property: { Type: "FullBinding", SetPose: ["LegsClosed"], Difficulty: 2 }
	}, {
		Name: "Link",
		BondageLevel: 2,
		Property: { Type: "Link", SetPose: ["LegsClosed"], Difficulty: 2 }
	}, {
		Name: "Diamond",
		BondageLevel: 4,
		Property: { Type: "Diamond", SetPose: ["LegsClosed"], Difficulty: 4 }
	}, {
		Name: "Mermaid",
		BondageLevel: 4,
		Property: { Type: "Mermaid", SetPose: ["LegsClosed"], Difficulty: 4 }
	}, {
		Name: "Suspension",
		BondageLevel: 6,
		Property: { Type: "Suspension", SetPose: ["LegsClosed", "Suspension"], Difficulty: 6 },
		Expression: [{ Group: "Blush", Name: "High", Timer: 30 }],
		Prerequisite: ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"]
	}, {
		Name: "BedSpreadEagle",
		BondageLevel: 1,
		Property: { Type: "BedSpreadEagle", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemLegs", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemLegs", "ItemBoots"], SetPose: ["Spread"], Difficulty: 5 },
		Prerequisite: ["OnBed", "NoItemLegs", "LegsOpen"]
	}
];

function AssetsItemFeetHempRopeBeforeDraw(data) {
    if (data.LayerType === "BedSpreadEagle") {
        return {
            X: data.X -125,
            Y: data.Y -170,
        };
    }
    return null;
}

function InventoryItemFeetHempRopeLoad() {
	ExtendedItemLoad(HempRopeFeetOptions, "SelectRopeBondage");
}

function InventoryItemFeetHempRopeDraw() {
	ExtendedItemDraw(HempRopeFeetOptions, "RopeBondage");
}

function InventoryItemFeetHempRopeClick() {
	ExtendedItemClick(HempRopeFeetOptions);
}

/**
 * Validates whether the chosen option is possible. Sets the global variable 'DialogExtendedMessage' to the appropriate
 * error message if not.
 * @param {Character} C - The character to check the options for
 * @param {Option} Option - The next option to use on the character
 * @returns {string} - Returns false and sets DialogExtendedMessage, if the chosen option is not possible.
 */
function InventoryItemFeetHempRopeValidate(C, Option) {
	var Allowed = "";

	// Validates some prerequisites before allowing more advanced poses
	if (Option.Prerequisite) {

		// Remove the item temporarily for prerequisite-checking - we should still be able to change type if the item
		// is the only thing that fails the prerequisite check
		var Rope = InventoryGet(C, C.FocusGroup.Name);
		InventoryRemove(C, C.FocusGroup.Name);

		if (!InventoryAllow(C, Option.Prerequisite, true)) {
			Allowed = DialogText;
		}

		// Re-add the item
		var DifficultyFactor = Rope.Difficulty - Rope.Asset.Difficulty;
		CharacterAppearanceSetItem(C, C.FocusGroup.Name, Rope.Asset, Rope.Color, DifficultyFactor, null, false);
		InventoryGet(C, C.FocusGroup.Name).Property = Rope.Property;
		CharacterRefresh(C);
		DialogFocusItem = InventoryGet(C, C.FocusGroup.Name);

	}
	return Allowed;
}

function InventoryItemFeetHempRopePublishAction(C, Option) {
	var msg = "LegRopeSet" + Option.Name;
	var Dictionary = [];
	Dictionary.push({ Tag: "SourceCharacter", Text: Player.Name, MemberNumber: Player.MemberNumber });
	Dictionary.push({ Tag: "TargetCharacter", Text: C.Name, MemberNumber: C.MemberNumber });
	ChatRoomPublishCustomAction(msg, true, Dictionary);
}

function InventoryItemFeetHempRopeNpcDialog(C, Option) {
	C.CurrentDialog = DialogFind(C, "RopeBondage" + Option.Name, "ItemFeet");
}
