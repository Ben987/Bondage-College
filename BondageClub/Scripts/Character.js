"use strict";
var Character = [];

/**
 * Loads a character into the buffer, creates it if it does not exist
 * @param {number|string} CharacterID - ID of the character
 * @param {string} CharacterAssetFamily - Name of the asset family of the character
 * @returns {void} - Nothing
 */
function CharacterReset(CharacterID, CharacterAssetFamily) {

	// Prepares the character sheet
	var NewCharacter = {
		ID: CharacterID,
		Name: "",
		AssetFamily: CharacterAssetFamily,
		AccountName: "",
		Owner: "",
		Lover: "",
		Money: 0,
		Inventory: [],
		Appearance: [],
		Stage: "0",
		CurrentDialog: "",
		Dialog: [],
		Reputation: [],
		Skill: [],
		Pose: [],
		AllowedActivePose: [],
		Effect: [],
		FocusGroup: null,
		Canvas: null,
		CanvasBlink: null,
		MustDraw: false,
		BlinkFactor: Math.round(Math.random() * 10) + 10,
		AllowItem: true,
		BlockItems: [],
		LimitedItems: [],
		HiddenItems: [],
		WhiteList: [],
		HeightModifier: 0,
		HasHiddenItems: false,
		CanTalk: function () { return ((this.Effect.indexOf("GagVeryLight") < 0) && (this.Effect.indexOf("GagLight") < 0) && (this.Effect.indexOf("GagEasy") < 0) && (this.Effect.indexOf("GagNormal") < 0) && (this.Effect.indexOf("GagMedium") < 0) && (this.Effect.indexOf("GagHeavy") < 0) && (this.Effect.indexOf("GagVeryHeavy") < 0) && (this.Effect.indexOf("GagTotal") < 0) && (this.Effect.indexOf("GagTotal2") < 0) && (this.Effect.indexOf("GagTotal3") < 0) && (this.Effect.indexOf("GagTotal4") < 0)) },
		CanWalk: function () { return ((this.Effect.indexOf("Freeze") < 0) && (this.Effect.indexOf("Tethered") < 0) && ((this.Pose == null) || (this.Pose.indexOf("Kneel") < 0) || (this.Effect.indexOf("KneelFreeze") < 0))) },
		CanKneel: function () { return ((this.Effect.indexOf("Freeze") < 0) && (this.Effect.indexOf("ForceKneel") < 0) && ((this.Pose == null) || ((!CharacterItemsHavePose(this, "LegsClosed")) && (this.Pose.indexOf("Supension") < 0) && (this.Pose.indexOf("Hogtied") < 0)))) },
		CanInteract: function () { return (this.Effect.indexOf("Block") < 0) },
		CanChange: function () { return ((this.Effect.indexOf("Freeze") < 0) && (this.Effect.indexOf("Block") < 0) && (this.Effect.indexOf("Prone") < 0) && !ManagementIsClubSlave() && !LogQuery("BlockChange", "Rule") && (!LogQuery("BlockChange", "OwnerRule") || (Player.Ownership == null) || (Player.Ownership.Stage != 1))) },
		IsProne: function () { return (this.Effect.indexOf("Prone") >= 0) },
		IsRestrained: function () { return ((this.Effect.indexOf("Freeze") >= 0) || (this.Effect.indexOf("Block") >= 0) || (this.Effect.indexOf("Prone") >= 0)) },
		IsBlind: function () { return ((this.Effect.indexOf("BlindLight") >= 0) || (this.Effect.indexOf("BlindNormal") >= 0) || (this.Effect.indexOf("BlindHeavy") >= 0)) },
		IsEnclose: function () { return (this.Effect.indexOf("Enclose") >= 0) },
		IsMounted: function () { return (this.Effect.indexOf("Mounted") >= 0) },
		IsChaste: function () { return ((this.Effect.indexOf("Chaste") >= 0) || (this.Effect.indexOf("BreastChaste") >= 0)) },
		IsVulvaChaste: function () { return (this.Effect.indexOf("Chaste") >= 0) },
		IsPlugged: function() {return (this.Effect.indexOf("IsPlugged") >= 0) },
		IsBreastChaste: function () { return (this.Effect.indexOf("BreastChaste") >= 0) },
		IsShackled: function () { return (this.Effect.indexOf("Shackled") >= 0) },
		IsSlow: function () { return (this.Effect.indexOf("Slow") >= 0) },
		IsEgged: function () { return (this.Effect.indexOf("Egged") >= 0) },
		IsMouthBlocked: function() { return this.Effect.indexOf("BlockMouth") >= 0 },
		IsMouthOpen: function() { return this.Effect.indexOf("OpenMouth") >= 0 },
		IsVulvaFull: function() { return this.Effect.indexOf("FillVulva") >= 0 },
		IsOwned: function () { return ((this.Owner != null) && (this.Owner.trim() != "")) },
		IsOwnedByPlayer: function () { return (((((this.Owner != null) && (this.Owner.trim() == Player.Name)) || (NPCEventGet(this, "EndDomTrial") > 0)) && (this.Ownership == null)) || ((this.Ownership != null) && (this.Ownership.MemberNumber != null) && (this.Ownership.MemberNumber == Player.MemberNumber))) },
		IsOwner: function () { return ((NPCEventGet(this, "EndSubTrial") > 0) || (this.Name == Player.Owner.replace("NPC-", ""))) },
		IsLoverOfPlayer: function () { return this.IsLover(Player); },
		IsLover: function (C) { return ((this.GetLoversNumbers().indexOf(C.MemberNumber) >= 0) || (((this.Lover != null) && (this.Lover.trim() == C.Name)) || (NPCEventGet(this, "Girlfriend") > 0))); },
		GetLoversNumbers: function (MembersOnly) {
			var LoversNumbers = [];
			if (typeof this.Lovership == "undefined") return [];
			for (let L = 0; L < this.Lovership.length; L++) {
				if (this.Lovership[L].MemberNumber) { LoversNumbers.push(this.Lovership[L].MemberNumber); }
				else if (this.Lovership[L].Name && (MembersOnly == null || MembersOnly == false)) { LoversNumbers.push(this.Lovership[L].Name); }
			}
			return LoversNumbers;
		},
		GetDeafLevel: function () {
			var deafLevel = 0;
			for (let A = 0; A < this.Appearance.length; A++) {
				// Sum up the various level of deafness and returns the final value, Light: 1, Normal: 2, Heavy: 3, Total: 4
				if (this.Appearance[A].Asset.Effect != null) {
					if (this.Appearance[A].Asset.Effect.indexOf("DeafLight") >= 0 || (this.Appearance[A].Property != null && Array.isArray(this.Appearance[A].Property.Effect) && this.Appearance[A].Property.Effect.indexOf("DeafLight") >= 0)) deafLevel += 1;
					else if (this.Appearance[A].Asset.Effect.indexOf("DeafNormal") >= 0 || (this.Appearance[A].Property != null && Array.isArray(this.Appearance[A].Property.Effect) && this.Appearance[A].Property.Effect.indexOf("DeafNormal") >= 0)) deafLevel += 2;
					else if (this.Appearance[A].Asset.Effect.indexOf("DeafHeavy") >= 0 || (this.Appearance[A].Property != null && Array.isArray(this.Appearance[A].Property.Effect) && this.Appearance[A].Property.Effect.indexOf("DeafHeavy") >= 0)) deafLevel += 3;
					else if (this.Appearance[A].Asset.Effect.indexOf("DeafTotal") >= 0 || (this.Appearance[A].Property != null && Array.isArray(this.Appearance[A].Property.Effect) && this.Appearance[A].Property.Effect.indexOf("DeafTotal") >= 0)) deafLevel += 4;
				}
			}
			return deafLevel;
		},
		IsLoverPrivate: function () { return ((NPCEventGet(this, "Girlfriend") > 0) || (Player.GetLoversNumbers().indexOf("NPC-" + this.Name) >= 0)); },
		IsKneeling: function () { return ((this.Pose != null) && (this.Pose.indexOf("Kneel") >= 0)) },
		IsNaked: function () { return CharacterIsNaked(this); },
		IsDeaf: function () { return this.GetDeafLevel() > 0 },
		HasNoItem: function () { return CharacterHasNoItem(this); },
		IsEdged: function () { return CharacterIsEdged(this); },
	};

	// If the character doesn't exist, we create it
	if (CharacterID >= Character.length)
		Character.push(NewCharacter);
	else
		Character[CharacterID] = NewCharacter;

	// Creates the inventory and default appearance
	if (CharacterID == 0) {
		Player = NewCharacter;
		CharacterAppearanceSetDefault(NewCharacter);
	}

	// Load the character image
	CharacterLoadCanvas(NewCharacter);

}

/**
 * Attributes a random name for the character, does not select a name in use
 * @param {Character} C - Character for which to attribute a name
 * @returns {void} - Nothing
 */
function CharacterRandomName(C) {

	// Generates a name from the name bank 
	var NewName = CharacterName[Math.floor(Math.random() * CharacterName.length)];
	C.Name = NewName;

	// If the name is already taken, we generate a new one
	for (let CN = 0; CN < Character.length; CN++)
		if ((Character[CN].Name == NewName) && (Character[CN].ID != C.ID)) {
			CharacterRandomName(C);
			return;
		}

	// If the name is already taken by a private room character
	for (let P = 0; P < PrivateCharacter.length; P++)
		if ((PrivateCharacter[P].Name == NewName) && ((PrivateCharacter[P].ID == null) || (PrivateCharacter[P].ID != C.ID))) {
			CharacterRandomName(C);
			return;
		}

}

/**
 * Builds the dialog objects from the character CSV file
 * @param {Character} C - Character for which to build the dialog
 * @param {string} CSV - Content of the CSV file
 * @returns {void} - Nothing
 */
function CharacterBuildDialog(C, CSV) {

	var OnlinePlayer = C.AccountName.indexOf("Online-") >= 0;
	C.Dialog = [];
	// For each lines in the file
	for (let L = 0; L < CSV.length; L++)
		if ((CSV[L][0] != null) && (CSV[L][0] != "")) {

			// Creates a dialog object
			var D = {};
			D.Stage = CSV[L][0];
			if ((CSV[L][1] != null) && (CSV[L][1].trim() != "")) D.NextStage = CSV[L][1];
			if ((CSV[L][2] != null) && (CSV[L][2].trim() != "")) D.Option = CSV[L][2].replace("DialogCharacterName", C.Name).replace("DialogPlayerName", Player.Name);
			if ((CSV[L][3] != null) && (CSV[L][3].trim() != "")) D.Result = CSV[L][3].replace("DialogCharacterName", C.Name).replace("DialogPlayerName", Player.Name);
			if ((CSV[L][4] != null) && (CSV[L][4].trim() != "")) D.Function = ((CSV[L][4].trim().substring(0, 6) == "Dialog") ? "" : OnlinePlayer ? "ChatRoom" : CurrentScreen) + CSV[L][4];
			if ((CSV[L][5] != null) && (CSV[L][5].trim() != "")) D.Prerequisite = CSV[L][5];
			if ((CSV[L][6] != null) && (CSV[L][6].trim() != "")) D.Group = CSV[L][6];
			if ((CSV[L][7] != null) && (CSV[L][7].trim() != "")) D.Trait = CSV[L][7];
			C.Dialog.push(D);

		}

	// Translate the dialog if needed
	TranslationDialog(C);

}

/**
 * Loads the content of a CSV file to build the character dialog. Can override the current screen.
 * @param {Character} C - Character for which to build the dialog objects
 * @param {string} [Override] - Optional: Path to the specific CSV to build the character dialog with 
 * @returns {void} - Nothing
 */
function CharacterLoadCSVDialog(C, Override) {

	// Finds the full path of the CSV file to use cache
	var FullPath = ((C.ID == 0) ? "Screens/Character/Player/Dialog_Player" : ((Override == null) ? "Screens/" + CurrentModule + "/" + CurrentScreen + "/Dialog_" + C.AccountName : Override)) + ".csv";
	if (CommonCSVCache[FullPath]) {
		CharacterBuildDialog(C, CommonCSVCache[FullPath]);
		return;
	}

	// Opens the file, parse it and returns the result it to build the dialog
	CommonGet(FullPath, function () {
		if (this.status == 200) {
			CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
			CharacterBuildDialog(C, CommonCSVCache[FullPath]);
		}
	});

}

/**
 * Sets the clothes based on a character archetype
 * @param {Character} C - Character to set the clothes for
 * @param {string} Archetype - Archetype to determine the clothes to put on
 * @param {string} [ForceColor] - Color to use for the added clothes 
 * @returns {void} - Nothing
 */
function CharacterArchetypeClothes(C, Archetype, ForceColor) {

	// Maid archetype
	if (Archetype == "Maid") {
		InventoryAdd(C, "MaidOutfit1", "Cloth", false);
		CharacterAppearanceSetItem(C, "Cloth", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, "Default", "Cloth");
		InventoryAdd(C, "MaidHairband1", "Hat", false);
		CharacterAppearanceSetItem(C, "Hat", C.Inventory[C.Inventory.length - 1].Asset);
		CharacterAppearanceSetColorForGroup(C, "Default", "Hat");
		InventoryAdd(C, "MaidOutfit2", "Cloth", false);
		InventoryRemove(C, "ClothAccessory");
		InventoryRemove(C, "HairAccessory1");
		InventoryRemove(C, "HairAccessory2");
		InventoryRemove(C, "ClothLower");
		C.AllowItem = (LogQuery("LeadSorority", "Maid"));
	}

	// Mistress archetype
	if (Archetype == "Mistress") {
		var ColorList = ["#333333", "#AA4444", "#AAAAAA"];
		var Color = (ForceColor == null) ? CommonRandomItemFromList("", ColorList) : ForceColor;
		CharacterAppearanceSetItem(C, "Hat", null);
		InventoryAdd(C, "MistressGloves", "Gloves", false);
		InventoryWear(C, "MistressGloves", "Gloves", Color);
		InventoryAdd(C, "MistressBoots", "Shoes", false);
		InventoryWear(C, "MistressBoots", "Shoes", Color);
		InventoryAdd(C, "MistressTop", "Cloth", false);
		InventoryWear(C, "MistressTop", "Cloth", Color);
		InventoryAdd(C, "MistressBottom", "ClothLower", false);
		InventoryWear(C, "MistressBottom", "ClothLower", Color);
		InventoryAdd(C, "MistressPadlock", "ItemMisc", false);
		InventoryAdd(C, "MistressTimerPadlock","ItemMisc", false);
		InventoryAdd(C, "MistressPadlockKey", "ItemMisc", false);
		InventoryRemove(C, "ClothAccessory");
		InventoryRemove(C, "HairAccessory1");
		InventoryRemove(C, "HairAccessory2");
	}

}

/**
 * Loads an NPC into the character array. The appearance is randomized, and a type can be provided to dress them in a given style.
 * @param {string} NPCType - Archetype of the NPC
 * @returns {Character} - The randomly generated NPC
 */
function CharacterLoadNPC(NPCType) {

	// Checks if the NPC already exists and returns it if it's the case
	for (let C = 0; C < Character.length; C++)
		if (Character[C].AccountName == NPCType)
			return Character[C];

	// Randomize the new character
	CharacterReset(Character.length, "Female3DCG");
	let C = Character[Character.length - 1];
	C.AccountName = NPCType;
	CharacterLoadCSVDialog(C);
	CharacterRandomName(C);
	CharacterAppearanceBuildAssets(C);
	CharacterAppearanceFullRandom(C);

	// Sets archetype clothes
	if (NPCType.indexOf("Maid") >= 0) CharacterArchetypeClothes(C, "Maid");
	if (NPCType.indexOf("Mistress") >= 0) CharacterArchetypeClothes(C, "Mistress");

	// Returns the new character
	return C;

}

/**
 * Sets up an online character
 * @param {Character} Char - Online character to set up
 * @param {object} data - Character data received
 * @param {number} SourceMemberNumber - Source number of the refresh
 */
function CharacterOnlineRefresh(Char, data, SourceMemberNumber) {
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.Title == null))) Char.Title = data.Title;
	Char.ActivePose = data.ActivePose;
	Char.LabelColor = data.LabelColor;
	Char.Creation = data.Creation;
	Char.Description = data.Description;
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.ItemPermission == null))) Char.ItemPermission = data.ItemPermission;
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.ArousalSettings == null))) Char.ArousalSettings = data.ArousalSettings;
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.Game == null))) Char.Game = data.Game;
	Char.Ownership = data.Ownership;
	Char.Lovership = data.Lovership;
	for (let L = Char.Lovership.length - 1; L >= 0; L--) {
		delete Char.Lovership[L].BeginEngagementOfferedByMemberNumber;
		delete Char.Lovership[L].BeginWeddingOfferedByMemberNumber;
		if (Char.Lovership[L].BeginDatingOfferedByMemberNumber) Char.Lovership.splice(L, 1);
	}
	Char.Reputation = (data.Reputation != null) ? data.Reputation : [];
	Char.BlockItems = Array.isArray(data.BlockItems) ? data.BlockItems : [];
	Char.LimitedItems = Array.isArray(data.LimitedItems) ? data.LimitedItems : [];
	if (Char.ID != 0) Char.WhiteList = data.WhiteList;
	Char.Appearance = ServerAppearanceLoadFromBundle(Char, "Female3DCG", data.Appearance, SourceMemberNumber);
	if (Char.ID == 0) LoginValidCollar();
	if ((Char.ID != 0) && ((Char.MemberNumber == SourceMemberNumber) || (Char.Inventory == null) || (Char.Inventory.length == 0))) InventoryLoad(Char, data.Inventory);
	CharacterLoadEffect(Char);
	CharacterRefresh(Char);
}

/**
 * Loads an online character and flags it for a refresh if any data was changed
 * @param {object} data - Character data received
 * @param {number} SourceMemberNumber - Source number of the load trigger
 * @returns {Character} - The reloaded character
 */
function CharacterLoadOnline(data, SourceMemberNumber) {

	// Checks if the NPC already exists and returns it if it's the case
	var Char = null;
	if (data.ID.toString() == Player.OnlineID)
		Char = Player;
	else
		for (let C = 0; C < Character.length; C++)
			if (Character[C].AccountName == "Online-" + data.ID.toString())
				Char = Character[C];

	// If the character isn't found
	if (Char == null) {
		// We delete the duplicate character if the person relogged.
		for (var C = 0; C < Character.length; C++)
			if (Character[C].MemberNumber == data.MemberNumber) { 
				CharacterDelete(Character[C].AccountName);
				break;
			}
		
		// Creates the new character from the online template
		CharacterReset(Character.length, "Female3DCG");
		Char = Character[Character.length - 1];
		Char.Name = data.Name;
		Char.Lover = (data.Lover != null) ? data.Lover : "";
		Char.Owner = (data.Owner != null) ? data.Owner : "";
		Char.Title = data.Title;
		Char.Description = data.Description;
		Char.AccountName = "Online-" + data.ID.toString();
		Char.MemberNumber = data.MemberNumber;
		Char.AllowItem = false;
		CharacterLoadCSVDialog(Char, "Screens/Online/ChatRoom/Dialog_Online");
		CharacterOnlineRefresh(Char, data, SourceMemberNumber);

	} else {

		// If we must add a character, we refresh it
		var Refresh = true;
		if (ChatRoomData.Character != null)
			for (let C = 0; C < ChatRoomData.Character.length; C++)
				if (ChatRoomData.Character[C].ID.toString() == data.ID.toString()) {
					Refresh = false;
					break;
				}

		// Flags "refresh" if we need to redraw the character
		if (!Refresh)
			if ((Char.Description != data.Description) || (Char.Title != data.Title) || (Char.LabelColor != data.LabelColor) || (ChatRoomData == null) || (ChatRoomData.Character == null))
				Refresh = true;
			else
				for (let C = 0; C < ChatRoomData.Character.length; C++)
					if (ChatRoomData.Character[C].ID == data.ID)
						if (ChatRoomData.Character[C].Appearance.length != data.Appearance.length)
							Refresh = true;
						else
							for (let A = 0; A < data.Appearance.length && !Refresh; A++) {
								var Old = ChatRoomData.Character[C].Appearance[A];
								var New = data.Appearance[A];
								if ((New.Name != Old.Name) || (New.Group != Old.Group) || (New.Color != Old.Color)) Refresh = true;
								else if ((New.Property != null) && (Old.Property != null) && (JSON.stringify(New.Property) != JSON.stringify(Old.Property))) Refresh = true;
								else if (((New.Property != null) && (Old.Property == null)) || ((New.Property == null) && (Old.Property != null))) Refresh = true;
							}

		// Flags "refresh" if the ownership or lovership or inventory or blockitems or limiteditems has changed
		if (!Refresh && (JSON.stringify(Char.ActivePose) !== JSON.stringify(data.ActivePose))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.Ownership) !== JSON.stringify(data.Ownership))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.Lovership) !== JSON.stringify(data.Lovership))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.ArousalSettings) !== JSON.stringify(data.ArousalSettings))) Refresh = true;
		if (!Refresh && (JSON.stringify(Char.Game) !== JSON.stringify(data.Game))) Refresh = true;
		if (!Refresh && (data.Inventory != null) && (Char.Inventory.length != data.Inventory.length)) Refresh = true;
		if (!Refresh && (data.BlockItems != null) && (Char.BlockItems.length != data.BlockItems.length)) Refresh = true;
		if (!Refresh && (data.LimitedItems != null) && (Char.LimitedItems.length != data.LimitedItems.length)) Refresh = true;

		// If we must refresh
		if (Refresh) CharacterOnlineRefresh(Char, data, SourceMemberNumber);

	}

	// Returns the character
	return Char;

}

/**
 * Deletes an NPC from the buffer
 * @param {string} NPCType - Account name of the npc to delete
 * @returns {void} - Nothing 
 */
function CharacterDelete(NPCType) {
	for (let C = 0; C < Character.length; C++)
		if (Character[C].AccountName == NPCType) {
			AnimationPurge(Character[C], true);
			Character.splice(C, 1);
			return;
		}
}

/**
 * Deletes all online characters from the character array
 * @returns {void} - Nothing
 */
function CharacterDeleteAllOnline() { 
	for (let C = Character.length - 1; C >= 0; C--)
		if (Character[C].AccountName.startsWith("Online-"))
			CharacterDelete(Character[C].AccountName);
}

/** 
 * Adds a pose to a character's pose list, does not add it if it's already there
 * @param {Character} C - Character for which to add a pose to its list
 * @param {string} NewPose - The name of the pose to add
 * @returns {void} - Nothing 
 */
function CharacterAddPose(C, NewPose) {
	for (let E = 0; E < NewPose.length; E++)
		if (C.Pose.indexOf(NewPose[E]) < 0)
			C.Pose.push(NewPose[E]);
}

/**
 * Checks if a character has a pose from items (not active pose unless an item lets it through)
 * @param {Character} C - Character to check for the pose 
 * @param {string} Pose - Pose to check for within items
 * @returns {boolean} - TRUE if the character has the pose
 */
function CharacterItemsHavePose(C, Pose) { 
	if (C.ActivePose != null && C.AllowedActivePose.includes(Pose) && (typeof C.ActivePose == "string" && C.ActivePose == Pose || Array.isArray(C.ActivePose) && C.ActivePose.includes(Pose))) return true;
	for (let A = 0; A < C.Appearance.length; A++) {
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.SetPose != null) && (C.Appearance[A].Property.SetPose.includes(Pose)))
			return true;
		else
			if (C.Appearance[A].Asset.SetPose != null && (C.Appearance[A].Asset.SetPose.includes(Pose)))
				return true;
			else
				if (C.Appearance[A].Asset.Group.SetPose != null && (C.Appearance[A].Asset.Group.SetPose.includes(Pose)))
					return true;
	}
	return false;
}

/**
 * Checks if a character has a pose type from items (not active pose unless an item lets it through)
 * @param {Character} C - Character to check for the pose type
 * @param {string} Type - Pose type to check for within items
 * @returns {boolean} - TRUE if the character has the pose type active
 */
function CharacterItemsHavePoseType(C, Type) { 
	var PossiblePoses = PoseFemale3DCG.filter(P => P.Category == Type || P.Category == "BodyFull").map(P => P.Name);
	
	for (let A = 0; A < C.Appearance.length; A++) {
		if (C.Appearance[A].Asset.AllowActivePose != null && (C.Appearance[A].Asset.AllowActivePose.find(P => PossiblePoses.includes(P) && C.AllowedActivePose.includes(P))))
			return true;
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.SetPose != null) && (C.Appearance[A].Property.SetPose.find(P => PossiblePoses.includes(P))))
			return true;
		else
			if (C.Appearance[A].Asset.SetPose != null && (C.Appearance[A].Asset.SetPose.find(P => PossiblePoses.includes(P))))
				return true;
			else
				if (C.Appearance[A].Asset.Group.SetPose != null  && (C.Appearance[A].Asset.Group.SetPose.find(P => PossiblePoses.includes(P))))
					return true;
	}
	return false;
}

/**
 * Refreshes the list of poses for a character. Each pose can only be found once in the pose array
 * @param {Character} C - Character for which to refresh the pose list
 * @returns {void} - Nothing 
 */
function CharacterLoadPose(C) {
	C.Pose = [];
	C.AllowedActivePose = [];
	
	for (let A = 0; A < C.Appearance.length; A++) {
		if (C.Appearance[A].Asset.AllowActivePose != null)
			C.Appearance[A].Asset.AllowActivePose.forEach(Pose => C.AllowedActivePose.push(Pose));
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.SetPose != null))
			CharacterAddPose(C, C.Appearance[A].Property.SetPose);
		else
			if (C.Appearance[A].Asset.SetPose != null)
				CharacterAddPose(C, C.Appearance[A].Asset.SetPose);
			else
				if (C.Appearance[A].Asset.Group.SetPose != null)
					CharacterAddPose(C, C.Appearance[A].Asset.Group.SetPose);
	}
	
	// Add possible active poses (Bodyfull can only be alone, and cannot have two of upperbody or bodylower)
	var Poses = C.Pose.map(CP => PoseFemale3DCG.find(P => P.Name == CP)).filter(P => P);
	if (C.ActivePose != null && typeof C.ActivePose == "string") C.ActivePose = [C.ActivePose];
	
	if (C.ActivePose != null && Array.isArray(C.ActivePose)) {
		var ActivePoses = C.ActivePose
			.map(CP => PoseFemale3DCG.find(P => P.Name == CP))
			.filter(P => P);
		
		for (let P = 0; P < ActivePoses.length; P++) {
			var HasPose = C.Pose.includes(ActivePoses[P].Name);
			var IsAllowed = C.AllowedActivePose.includes(ActivePoses[P].Name);
			var MissingGroup = !Poses.find(Pose => Pose.Category == "BodyFull") && !Poses.find(Pose => Pose.Category == ActivePoses[P].Category);
			var IsFullBody = C.Pose.length > 0 && ActivePoses[P].Category == "BodyFull";
			if (!HasPose && (IsAllowed || (MissingGroup && !IsFullBody)))
				C.Pose.push(ActivePoses[P].Name);
		}
	}
}

/**
 * Adds an effect to a character's effect list, does not add it if it's already there
 * @param {Character} C - Character for which to add an effect to its list
 * @param {string} NewEffect - The name of the effect to add
 * @returns {void} - Nothing 
 */
function CharacterAddEffect(C, NewEffect) {
	for (let E = 0; E < NewEffect.length; E++)
		if (C.Effect.indexOf(NewEffect[E]) < 0)
			C.Effect.push(NewEffect[E]);
}

/**
 * Refreshes the list of effects for a character. Each effect can only be found once in the effect array
 * @param {Character} C - Character for which to refresh the effect list
 * @returns {void} - Nothing 
 */
function CharacterLoadEffect(C) {
	C.Effect = [];
	for (let A = 0; A < C.Appearance.length; A++) {
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.Effect != null)) CharacterAddEffect(C, C.Appearance[A].Property.Effect);
		if (C.Appearance[A].Asset.Effect != null)
			CharacterAddEffect(C, C.Appearance[A].Asset.Effect);
		else
			if (C.Appearance[A].Asset.Group.Effect != null)
				CharacterAddEffect(C, C.Appearance[A].Asset.Group.Effect);
	}
}

/**
 * Loads a character's canvas by sorting its appearance and drawing it.
 * @param {Character} C - Character to load the canvas for
 * @returns {void} - Nothing 
 */
function CharacterLoadCanvas(C) {
	// Reset the property that tracks if wearing a hidden item
	C.HasHiddenItems = false;

	// Generates a layer array from the character's appearance array, sorted by drawing order
	C.AppearanceLayers = CharacterAppearanceSortLayers(C);

	// Sets the total height modifier for that character
	CharacterApperanceSetHeightModifier(C);
	
	// Reload the canvas
	CharacterAppearanceBuildCanvas(C);
}

/**
 * Reloads all character canvases in need of being redrawn.
 * @returns {void} - Nothing
 */
function CharacterLoadCanvasAll() {
	for (let C = 0; C < Character.length; C++)
		if (Character[C].MustDraw) {
			CharacterLoadCanvas(Character[C]);
			Character[C].MustDraw = false;
		}
}

/**
 * Sets the current character to have a dialog with
 * @param {Character} C - Character to have a conversation with
 * @returns {void} - Nothing
 */
function CharacterSetCurrent(C) {
	CurrentCharacter = C;
	var NewDialog = DialogIntro();
	if (!Player.CanTalk()) NewDialog = DialogFind(CurrentCharacter, "PlayerGagged", "");
	if (NewDialog != "") C.CurrentDialog = NewDialog;
}

/**
 * Changes the character money and sync with the account server, factors in the cheaters version.
 * @param {Character} C - Character for which we are altering the money amount 
 * @param {number} Value - Money to subtract/add
 * @returns {void} - Nothing
 */
function CharacterChangeMoney(C, Value) {
	C.Money = parseInt(C.Money) + parseInt(Value) * ((Value > 0) ? CheatFactor("DoubleMoney", 2) : 1);
	ServerPlayerSync();
}

/**
 * Refreshes the character parameters (Effects, poses, canvas, settings, etc.)
 * @param {Character} C - Character to refresh
 * @param {boolean} [Push=true] - Pushes the data to the server if true or null 
 * @returns {void} - Nothing
 */
function CharacterRefresh(C, Push) {
	AnimationPurge(C, false);
	CharacterLoadEffect(C);
	CharacterLoadPose(C);
	CharacterLoadCanvas(C);
	if ((C.ID == 0) && (C.OnlineID != null) && ((Push == null) || (Push == true))) {
		ChatRoomRefreshChatSettings(C);
		ServerPlayerAppearanceSync();
	}
	// Also refresh the current dialog menu if the refreshed character is the current character.
	var Current = CharacterGetCurrent();
	if (Current && C.ID == Current.ID) {
		if (DialogFocusItem && DialogFocusItem.Asset) {
			if (!DialogFocusItem.Asset.IsLock) {
				DialogFocusItem = C.Appearance.find(Item =>
					Item.Asset.Name == DialogFocusItem.Asset.Name && Item.Asset.Group.Name == DialogFocusItem.Asset.Group.Name
				);
				if (DialogFocusItem && DialogFocusItem.Asset.Extended && typeof window["Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Load"] === "function") window["Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Load"]();
			} else {
				var DFSI = DialogFocusSourceItem && DialogFocusSourceItem.Asset && C.Appearance.find(Item =>
					Item.Asset.Name == DialogFocusSourceItem.Asset.Name && Item.Asset.Group.Name == DialogFocusSourceItem.Asset.Group.Name
				);
				var Lock = DFSI && InventoryGetLock(DFSI);
				if (!DFSI || !Lock) DialogLeaveFocusItem();
				else DialogExtendItem(Lock, DFSI);
			}
		} else if (DialogFocusItem) DialogLeaveFocusItem();
		if (!DialogFocusItem) {
			DialogInventoryBuild(C, DialogInventoryOffset);
			ActivityDialogBuild(C);
		}
	}
}

/**
 * Checks if a character is wearing items (restraints), the slave collar is ignored.
 * @param {Character} C - Character to inspect the appearance of
 * @returns {boolean} - Returns TRUE if the given character is wearing an item
 */
function CharacterHasNoItem(C) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Category == "Item"))
			if (C.Appearance[A].Asset.Name != "SlaveCollar")
				return false;
	return true;
}

/**
 * Checks if a character is naked
 * @param {Character} C - Character to inspect the appearance of
 * @returns {boolean} - Returns TRUE if the given character is naked
 */
function CharacterIsNaked(C) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Category == "Appearance") && C.Appearance[A].Asset.Group.AllowNone && !C.Appearance[A].Asset.Group.KeepNaked)
			return false;
	return true;
}

/**
 * Checks if a character is in underwear
 * @param {Character} C - Character to inspect the appearance of
 * @returns {boolean} - Returns TRUE if the given character is in underwear
 */
function CharacterIsInUnderwear(C) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.Group.Category == "Appearance") && C.Appearance[A].Asset.Group.AllowNone && !C.Appearance[A].Asset.Group.KeepNaked && !C.Appearance[A].Asset.Group.Underwear)
			return false;
	return true;
}

/**
 * Removes all appearance items from the character
 * @param {Character} C - Character to undress
 * @returns {void} - Nothing
 */
function CharacterNaked(C) {
	CharacterAppearanceNaked(C);
	CharacterRefresh(C);
}

/**
 * Dresses the given character in random underwear
 * @param {Character} C - Character to randomly dress
 * @returns {void} - Nothing
 */
function CharacterRandomUnderwear(C) {

	// Clear the current clothes
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset.Group.Category == "Appearance") && C.Appearance[A].Asset.Group.AllowNone) {
			C.Appearance.splice(A, 1);
			A--;
		}

	// Generate random undies at a random color
	var Color = "";
	for (let A = 0; A < AssetGroup.length; A++)
		if ((AssetGroup[A].Category == "Appearance") && AssetGroup[A].Underwear && (AssetGroup[A].IsDefault || (Math.random() < 0.2))) {
			var Group = [];
			if (Color == "") Color = CommonRandomItemFromList("", AssetGroup[A].ColorSchema);
			for (let I = 0; I < Asset.length; I++)
				if ((Asset[I].Group.Name == AssetGroup[A].Name) && ((Asset[I].Value == 0) || InventoryAvailable(C, Asset[I].Name, Asset[I].Group.Name)))
					Group.push(Asset[I]);
			if (Group.length > 0)
				CharacterAppearanceSetItem(C, AssetGroup[A].Name, Group[Math.floor(Group.length * Math.random())], Color);
		}

	// Refreshes the character
	CharacterRefresh(C);

}

/**
 * Removes all appearance items from the character except underwear
 * @param {Character} C - Character to undress partially
 * @param {Array.<*>} Appearance - Appearance array to remove clothes from
 * @returns {void} - Nothing
 */
function CharacterUnderwear(C, Appearance) {
	CharacterAppearanceNaked(C);
	for (let A = 0; A < Appearance.length; A++)
		if ((Appearance[A].Asset != null) && Appearance[A].Asset.Group.Underwear && (Appearance[A].Asset.Group.Category == "Appearance"))
			C.Appearance.push(Appearance[A]);
	CharacterRefresh(C);
}

/**
 * Redresses a character based on a given appearance array
 * @param {Character} C - Character to redress
 * @param {Array.<*>} Appearance - Appearance array to redress the character with
 * @returns {void} - Nothing
 */
function CharacterDress(C, Appearance) {
	if ((Appearance != null) && (Appearance.length > 0)) {
		for (let A = 0; A < Appearance.length; A++)
			if ((Appearance[A].Asset != null) && (Appearance[A].Asset.Group.Category == "Appearance"))
				if (InventoryGet(C, Appearance[A].Asset.Group.Name) == null)
					C.Appearance.push(Appearance[A]);
		CharacterRefresh(C);
	}
}

/**
 * Removes all binding items from a given character
 * @param {Character} C - Character to release
 * @param {false} [Refresh] - do not call CharacterRefresh if false
 * @returns {void} - Nothing
 */
function CharacterRelease(C, Refresh) {
	for (let E = 0; E < C.Appearance.length; E++)
		if (C.Appearance[E].Asset.IsRestraint) {
			C.Appearance.splice(E, 1);
			E--;
		}
	if (Refresh || Refresh == null) CharacterRefresh(C);
}

/**
 * Releases a character from all locks matching the given lock name
 * @param {Character} C - Character to release from the lock(s)
 * @param {string} LockName - Name of the lock to look for
 * @returns {void} - Nothing
 */
function CharacterReleaseFromLock(C, LockName) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Property != null) && (C.Appearance[A].Property.LockedBy == LockName))
			InventoryUnlock(C, C.Appearance[A]);
}

/**
 * Releases a character from all restraints that are not locked
 * @param {Character} C - Character to release
 * @returns {void} - Nothing
 */
function CharacterReleaseNoLock(C) {
	for (let E = 0; E < C.Appearance.length; E++)
		if (C.Appearance[E].Asset.IsRestraint && ((C.Appearance[E].Property == null) || (C.Appearance[E].Property.LockedBy == null))) {
			C.Appearance.splice(E, 1);
			E--;
		}
	CharacterRefresh(C);
}

/**
 * Removes all items except for clothing and slave collars from the character
 * @param {Character} C - Character to release
 * @returns {void} - Nothing
 */
function CharacterReleaseTotal(C) {
	for (let E = 0; E < C.Appearance.length; E++) {
	    if (C.Appearance[E].Asset.Group.Category != "Appearance") {
	    	if (C.IsOwned() && C.Appearance[E].Asset.Name == "SlaveCollar") {
	    		// Reset slave collar to the default model if it has a gameplay effect (such as gagging the player)
	    		if (C.Appearance[E].Property && C.Appearance[E].Property.Effect && C.Appearance[E].Property.Effect.length > 0)
	    			delete C.Appearance[E].Property;
	    	}
	    	else {
	    		C.Appearance.splice(E,1);
	        	E--;
	    	}
	    }
	}
	CharacterRefresh(C);
}

/**
 * Gets the bonus amount of a given type for a given character (Kidnap league)
 * @param {Character} C - Character for which we want to get the bonus amount
 * @param {string} BonusType - Type/name of the bonus to look for
 * @returns {number} - Active bonus amount for the bonus type
 */
function CharacterGetBonus(C, BonusType) {
	var Bonus = 0;
	for (let I = 0; I < C.Inventory.length; I++)
		if ((C.Inventory[I].Asset != null) && (C.Inventory[I].Asset.Bonus != null))
			for (let B = 0; B < C.Inventory[I].Asset.Bonus.length; B++)
				if ((C.Inventory[I].Asset.Bonus[B].Type == BonusType) && (C.Inventory[I].Asset.Bonus[B].Factor > Bonus))
					Bonus = C.Inventory[I].Asset.Bonus[B].Factor;
	return Bonus;
}

/**
 * Restrains a character with random restraints. Some restraints are specifically disabled for randomization in their definition.
 * @param {Character} C - The target character to restrain
 * @param {"FEW"|"LOT"|"ALL"} [Ratio] - Amount of restraints to put on the character
 * @param {false} [Refresh] - do not call CharacterRefresh if false
 */
function CharacterFullRandomRestrain(C, Ratio, Refresh) {

	// Sets the ratio depending on the parameter
	var RatioRare = 0.75;
	var RatioNormal = 0.25;
	if (Ratio != null) {
		if (Ratio.trim().toUpperCase() == "FEW") { RatioRare = 1; RatioNormal = 0.5; }
		if (Ratio.trim().toUpperCase() == "LOT") { RatioRare = 0.5; RatioNormal = 0; }
		if (Ratio.trim().toUpperCase() == "ALL") { RatioRare = 0; RatioNormal = 0; }
	}

	// Apply each item if needed
	if (InventoryGet(C, "ItemArms") == null) InventoryWearRandom(C, "ItemArms", null, false);
	if ((Math.random() >= RatioRare) && (InventoryGet(C, "ItemHead") == null)) InventoryWearRandom(C, "ItemHead", null, false);
	if ((Math.random() >= RatioNormal) && (InventoryGet(C, "ItemMouth") == null)) InventoryWearRandom(C, "ItemMouth", null, false);
	if ((Math.random() >= RatioRare) && (InventoryGet(C, "ItemNeck") == null)) InventoryWearRandom(C, "ItemNeck", null, false);
	if ((Math.random() >= RatioNormal) && (InventoryGet(C, "ItemLegs") == null)) InventoryWearRandom(C, "ItemLegs", null, false);
	if ((Math.random() >= RatioNormal) && !C.IsKneeling() && (InventoryGet(C, "ItemFeet") == null)) InventoryWearRandom(C, "ItemFeet", null, false);

	if (Refresh || Refresh == null) CharacterRefresh(C);

}

/**
 * Sets a new pose for the character
 * @param {Character} C - Character for which to set the pose
 * @param {string} NewPose - Name of the pose to set as active
 * @param {boolean} ForceChange - TRUE if the set pose(s) should overwrite current active pose(s)
 * @returns {void} - Nothing
 */
function CharacterSetActivePose(C, NewPose, ForceChange) {
	if (NewPose == null || ForceChange || C.ActivePose == null) {
		C.ActivePose = NewPose;
		CharacterRefresh(C, false);
		return;
	}
	
	if (typeof C.ActivePose == null) C.ActivePose = [];
	if (typeof C.ActivePose == "string") C.ActivePose = [C.ActivePose];
		
	const PreviousPoses = C.ActivePose.map(AP => PoseFemale3DCG.find(P => P.Name == AP)).filter(AP => typeof AP == "object");
	const Pose = PoseFemale3DCG.find(P => P.Name == NewPose);
	
	// We only allow poses of different categories to be matched together
	if (Pose && Pose.Category) { 
		C.ActivePose = PreviousPoses
			.filter(PP => PP.AllowMenu && Pose.Category !== "BodyFull" && PP.Category !== "BodyFull" && PP.Category !== Pose.Category)
			.map(AP => AP.Name);
		C.ActivePose.push(Pose.Name);
	}
	
	// If we reset to base, we remove the poses
	if (C.ActivePose.length == 2 && C.ActivePose.includes("BaseUpper") && C.ActivePose.includes("BaseLower")) C.ActivePose = null;
	
	CharacterRefresh(C, false);
}

/**
 * Sets a specific facial expression for the character's specified AssetGroup, if there's a timer, the expression will expire after it, a
 * timed expression cannot override another one.
 * @param {Character} C - Character for which to set the expression of
 * @param {group} AssetGroup - Asset group for the expression
 * @param {string} Expression - Name of the expression to use
 * @param {number} [Timer] - Optional: time the expression will last
 * @returns {void} - Nothing
 */
function CharacterSetFacialExpression(C, AssetGroup, Expression, Timer) {
	// A normal eye expression is triggered for both eyes
	if (AssetGroup == "Eyes") CharacterSetFacialExpression(C, "Eyes2", Expression, Timer);
	if (AssetGroup == "Eyes1") AssetGroup = "Eyes";
		
	var Ex = InventoryGet(C, AssetGroup);
	if ((Timer != null) && (Ex != null) && (Ex.Property != null) && (Ex.Property.Expression != null) && (Ex.Property.Expression != "")) return;
	for (let A = 0; A < C.Appearance.length; A++) {
		if ((C.Appearance[A].Asset.Group.Name == AssetGroup) && (C.Appearance[A].Asset.Group.AllowExpression)) {
			if ((Expression == null) || (C.Appearance[A].Asset.Group.AllowExpression.indexOf(Expression) >= 0)) {
				if (!C.Appearance[A].Property) C.Appearance[A].Property = {};
				if (C.Appearance[A].Property.Expression != Expression) {
					C.Appearance[A].Property.Expression = Expression;
					CharacterRefresh(C, false);
					if (CurrentScreen == "ChatRoom") {
						if (C.ID == 0) ServerSend("ChatRoomCharacterExpressionUpdate", { Name: Expression, Group: AssetGroup, Appearance: ServerAppearanceBundle(C.Appearance) });
						else ChatRoomCharacterUpdate(C);
					}
				}
				if (Timer != null) TimerInventoryRemoveSet(C, AssetGroup, Timer);
				return;
			}
		}
	}
}

/**
 * Resets the character's facial expression to the default
 * @param {Character} C - Character for which to reset the expression of
 * @returns {void} - Nothing
 */
function CharacterResetFacialExpression(C) {
	for (let A = 0; A < C.Appearance.length; A++)
		if (C.Appearance[A].Asset.Group.AllowExpression)
			CharacterSetFacialExpression(C, C.Appearance[A].Asset.Group.Name, null);
}

/**
 * Gets the currently selected character
 * @returns {Character} - Currently selected character
 */
function CharacterGetCurrent() {
	return (Player.FocusGroup != null) ? Player : CurrentCharacter;
}

/**
 * Compresses a character wardrobe from an array to a LZ string to use less storage space
 * @param {Array.<Array.<*>>} Wardrobe - Uncompressed wardrobe
 * @returns {string} - The compressed wardrobe
 */
function CharacterCompressWardrobe(Wardrobe) {
	if (Array.isArray(Wardrobe) && (Wardrobe.length > 0)) {
		var CompressedWardrobe = [];
		for (let W = 0; W < Wardrobe.length; W++) {
			var Arr = [];
			if (Wardrobe[W] != null)
				for (let A = 0; A < Wardrobe[W].length; A++)
					Arr.push([Wardrobe[W][A].Name, Wardrobe[W][A].Group, Wardrobe[W][A].Color]);
			CompressedWardrobe.push(Arr);
		}
		return LZString.compressToUTF16(JSON.stringify(CompressedWardrobe));
	} else return "";
}

/**
 * Decompresses a character wardrobe from a LZ String to an array if it was previously compressed (For backward compatibility with old
 * wardrobes)
 * @param {Array.<Array.<*>> | string} Wardrobe - The current wardrobe
 * @returns {Array.<Array.<*>>} - The array of wardrobe items decompressed
 */
function CharacterDecompressWardrobe(Wardrobe) {
	if (typeof Wardrobe === "string") {
		var CompressedWardrobe = JSON.parse(LZString.decompressFromUTF16(Wardrobe));
		var DecompressedWardrobe = [];
		if (CompressedWardrobe != null) {
			for (let W = 0; W < CompressedWardrobe.length; W++) {
				var Arr = [];
				for (let A = 0; A < CompressedWardrobe[W].length; A++)
					Arr.push({ Name: CompressedWardrobe[W][A][0], Group: CompressedWardrobe[W][A][1], Color: CompressedWardrobe[W][A][2] });
				DecompressedWardrobe.push(Arr);
			}
		}
		return DecompressedWardrobe;
	}
	return Wardrobe;
}

/**
 * Checks if the character is wearing an item that allows for a specific activity
 * @param {Character} C - The character to test for
 * @param {String} Activity - The name of the activity that must be allowed
 * @returns {boolean} - TRUE if at least one item allows that activity
 */
function CharacterHasItemForActivity(C, Activity) {
	for (let A = 0; A < C.Appearance.length; A++)
		if ((C.Appearance[A].Asset != null) && (C.Appearance[A].Asset.AllowActivity != null) && (C.Appearance[A].Asset.AllowActivity.indexOf(Activity) >= 0))
			return true;
	return false;
}

/**
 * Checks if the character is edged or not. The character is edged if every equipped vibrating item on an orgasm zone has the "Edged" effect
 * @param {Character} C - The character to check
 * @returns {boolean} - TRUE if the character is edged, FALSE otherwise
 */
function CharacterIsEdged(C) {
	if (C.ID !== 0 || !C.Effect.includes("Edged")) {
		return false;
	}

	// Get every vibrating item on an orgasm zone
	const VibratingItems = C.ArousalSettings.Zone
		.filter(Zone => Zone.Orgasm)
		.map(Zone => InventoryGet(C, Zone.Name))
		.filter(Item => Item && Item.Property && typeof Item.Property.Intensity === "number" && Item.Property.Intensity >= 0);

	// Return true if every vibrating item on an orgasm zone has the "Edged" effect
	return !!VibratingItems.length && VibratingItems.every(Item => Item.Property.Effect && Item.Property.Effect.includes("Edged"));
}
