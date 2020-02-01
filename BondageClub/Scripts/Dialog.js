"use strict";
var DialogText = "";
var DialogTextDefault = "";
var DialogTextDefaultTimer = -1;
var DialogProgress = -1;
var DialogColor = null;
var DialogColorSelect = null;
var DialogProgressStruggleCount = 0;
var DialogProgressAuto = 0;
var DialogProgressOperation = "...";
var DialogProgressPrevItem = null;
var DialogProgressNextItem = null;
var DialogProgressSkill = 0;
var DialogProgressLastKeyPress = 0;
var DialogProgressChallenge = 0;
var DialogInventory = [];
var DialogInventoryOffset = 0;
var DialogFocusItem = null;
var DialogFocusSourceItem = null;
var DialogMenuButton = [];
var DialogItemToLock = null;
var DialogAllowBlush = false;
var DialogAllowEyebrows = false;
var DialogAllowFluids = false;
var DialogFacialExpressions = [];
var DialogItemPermissionMode = false;
var DialogExtendedMessage = "";

function DialogReputationLess(RepType, Value) { return (ReputationGet(RepType) <= Value); } // Returns TRUE if a specific reputation type is less or equal than a given value
function DialogReputationGreater(RepType, Value) { return (ReputationGet(RepType) >= Value); } // Returns FALSE if a specific reputation type is greater or equal than a given value
function DialogMoneyGreater(Amount) { return (parseInt(Player.Money) >= parseInt(Amount)); } // Returns TRUE if the player has enough money
function DialogChangeMoney(Amount) { CharacterChangeMoney(Player, Amount); } // Change the player money amount
function DialogSetReputation(RepType, Value) { ReputationChange(RepType, (parseInt(ReputationGet(RepType)) * -1) + parseInt(Value)); } // Sets a fixed number for the player specific reputation
function DialogChangeReputation(RepType, Value) { ReputationProgress(RepType, Value); } // Change the player reputation progressively through dialog options (a reputation is easier to break than to build)
function DialogWearItem(AssetName, AssetGroup) { InventoryWear(Player, AssetName, AssetGroup); } // Equips a specific item on the player from dialog
function DialogWearRandomItem(AssetGroup) { InventoryWearRandom(Player, AssetGroup); } // Equips a random item from a given group to the player from dialog
function DialogRemoveItem(AssetGroup) { InventoryRemove(Player, AssetGroup); } // Removes an item of a specific item group from the player 
function DialogRelease(C) { CharacterRelease((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter); } // Releases a character from restraints
function DialogNaked(C) { CharacterNaked((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter); } // Strips a character naked and removes the restrains
function DialogFullRandomRestrain(C) { CharacterFullRandomRestrain((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter); } // Strips a character naked and removes the restrains
function DialogLogQuery(LogType, LogGroup) { return LogQuery(LogType, LogGroup); } // Returns TRUE if a specific log is registered
function DialogAllowItem(Allow) { return CurrentCharacter.AllowItem = (Allow.toUpperCase().trim() == "TRUE"); } // Sets the AllowItem flag on the current character
function DialogDoAllowItem(C) { return (C.toUpperCase().trim() == "PLAYER") ? Player.AllowItem : CurrentCharacter.AllowItem } // Sets the AllowItem flag on the current character
function DialogIsKneeling(C) { return (C.toUpperCase().trim() == "PLAYER") ? Player.IsKneeling() : CurrentCharacter.IsKneeling() }
function DialogIsOwner() { return (CurrentCharacter.Name == Player.Owner.replace("NPC-", "")) }
function DialogIsProperty() { return (CurrentCharacter.Owner == Player.Name) }
function DialogIsRestrained(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.IsRestrained() : CurrentCharacter.IsRestrained()) }
function DialogIsBlind(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.IsBlind() : CurrentCharacter.IsBlind()) }
function DialogIsEgged(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.IsEgged() : CurrentCharacter.IsEgged()) }
function DialogCanInteract(C) { return ((C.toUpperCase().trim() == "PLAYER") ? Player.CanInteract() : CurrentCharacter.CanInteract()) }
function DialogSetPose(C, NewPose) { CharacterSetActivePose((C.toUpperCase().trim() == "PLAYER") ? Player : CurrentCharacter, ((NewPose != null) && (NewPose != "")) ? NewPose : null) }
function DialogSkillGreater(SkillType, Value) { return (parseInt(SkillGetLevel(Player, SkillType)) >= parseInt(Value)) } // Returns TRUE if a specific reputation type is less or equal than a given value
function DialogInventoryAvailable(InventoryName, InventoryGroup) { return InventoryAvailable(Player, InventoryName, InventoryGroup) }

// Returns TRUE if the dialog prerequisite condition is met
function DialogPrerequisite(D) {
	if (CurrentCharacter.Dialog[D].Prerequisite == null)
		return true;
	else
		if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("Player.") == 0)
			return Player[CurrentCharacter.Dialog[D].Prerequisite.substring(7, 250).replace("()", "").trim()]();
		else
			if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("!Player.") == 0)
				return !Player[CurrentCharacter.Dialog[D].Prerequisite.substring(8, 250).replace("()", "").trim()]();
			else
				if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("CurrentCharacter.") == 0)
					return CurrentCharacter[CurrentCharacter.Dialog[D].Prerequisite.substring(17, 250).replace("()", "").trim()]();
				else
					if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("!CurrentCharacter.") == 0)
						return !CurrentCharacter[CurrentCharacter.Dialog[D].Prerequisite.substring(18, 250).replace("()", "").trim()]();
					else
						if (CurrentCharacter.Dialog[D].Prerequisite.indexOf("(") >= 0)
							return CommonDynamicFunctionParams(CurrentCharacter.Dialog[D].Prerequisite);
						else
							if (CurrentCharacter.Dialog[D].Prerequisite.substring(0, 1) != "!")
								return window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.trim()];
							else
								return !window[CurrentScreen + CurrentCharacter.Dialog[D].Prerequisite.substr(1, 250).trim()];
}

// Searches for an item in the player inventory to unlock a specific item
function DialogCanUnlock(C, Item) {
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.OwnerOnly == true)) return Item.Asset.Enable && C.IsOwnedByPlayer();
	if ((Item != null) && (Item.Asset != null) && (Item.Asset.SelfUnlock != null) && (Item.Asset.SelfUnlock == false) && !Player.CanInteract()) return false;
	if ((Item != null) && (Item.Property != null) && (Item.Property.SelfUnlock != null) && (Item.Property.SelfUnlock == false) && !Player.CanInteract()) return false;
	if (C.IsOwnedByPlayer() && InventoryAvailable(Player, "OwnerPadlockKey", "ItemMisc") && Item.Asset.Enable) return true;
	var UnlockName = "Unlock-" + Item.Asset.Name;
	if ((Item != null) && (Item.Property != null) && (Item.Property.LockedBy != null)) UnlockName = "Unlock-" + Item.Property.LockedBy;
	for (var I = 0; I < Player.Inventory.length; I++)
		if (InventoryItemHasEffect(Player.Inventory[I], UnlockName))
			if ((InventoryGetLock(Item) == null) || (InventoryGetLock(Item).Asset.OwnerOnly == false) || C.IsOwnedByPlayer())
				return true;
	return false;
}

// Returns the current character dialog intro
function DialogIntro() {
	for (var D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option == null) && (CurrentCharacter.Dialog[D].Result != null) && DialogPrerequisite(D))
			return CurrentCharacter.Dialog[D].Result;
	return "";
}

// Generic dialog function to leave conversation
function DialogLeave() {
	DialogItemPermissionMode = false;
	DialogItemToLock = null;
	Player.FocusGroup = null;
	CurrentCharacter.FocusGroup = null;
	DialogInventory = null;
	CurrentCharacter = null;
}

// Generic dialog function to remove a piece of the conversation that's already done
function DialogRemove() {
	var pos = 0;
	for (var D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
			if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 250 + pos * 105)) {
				CurrentCharacter.Dialog.splice(D, 1);
				break;
			}
			pos++;
		}
}

// Generic dialog function to remove any dialog from a specific group
function DialogRemoveGroup(GroupName) {
	GroupName = GroupName.trim().toUpperCase();
	for (var D = 0; D < CurrentCharacter.Dialog.length; D++)
		if ((CurrentCharacter.Dialog[D].Group != null) && (CurrentCharacter.Dialog[D].Group.trim().toUpperCase() == GroupName)) {
			CurrentCharacter.Dialog.splice(D, 1);
			D--;
		}
}

// Ends any expression with a timer
function DialogEndExpression() {
	if (DialogAllowBlush) {
		TimerInventoryRemoveSet(Player, "Blush", 15);
		DialogAllowBlush = false;
	}
	if (DialogAllowEyebrows) {
		TimerInventoryRemoveSet(Player, "Eyebrows", 5);
		DialogAllowEyebrows = false;
	}		
	if (DialogAllowFluids) {
		TimerInventoryRemoveSet(Player, "Fluids", 5);
		DialogAllowFluids = false;
	}
}
		
// Leaves the item menu for both characters
function DialogLeaveItemMenu() {
	DialogEndExpression();
	DialogItemToLock = null;
	Player.FocusGroup = null;
	CurrentCharacter.FocusGroup = null;
	DialogInventory = null;
	DialogProgress = -1;
	DialogColor = null;
	DialogMenuButton = [];
	DialogItemPermissionMode = false;
	ElementRemove("InputColor");
}

// Adds the item in the dialog list
function DialogInventoryAdd(C, NewInv, NewInvWorn) {

	// Make sure we do not add owneronly items in case of not owned characters
	if (NewInv.Asset.OwnerOnly && !C.IsOwnedByPlayer() && NewInvWorn != true) return;

	// Make sure we do not duplicate the item
	for (var I = 0; I < DialogInventory.length; I++)
		if ((DialogInventory[I].Asset.Group.Name == NewInv.Asset.Group.Name) && (DialogInventory[I].Asset.Name == NewInv.Asset.Name))
			return;

	// Creates a new dialog inventory item
	var DI = {
		Asset: NewInv.Asset,
		Worn: NewInvWorn,
		Icon: ""
	};

	// Loads the correct icon and push the item in the array
	if (NewInvWorn && InventoryItemHasEffect(NewInv, "Lock", true)) DI.Icon = "Locked";
	if (!NewInvWorn && InventoryItemHasEffect(NewInv, "Lock", true)) DI.Icon = "Unlocked";
	DialogInventory.push(DI);

}

// Build the buttons in the top menu
function DialogMenuButtonBuild(C) {

	// The "Exit" button is always available
	var Item = InventoryGet(C, C.FocusGroup.Name);
	DialogMenuButton = [];
	DialogMenuButton.push("Exit");

	// In color picker mode
	if (DialogColor != null) {
		DialogMenuButton.push("ColorCancel");
		DialogMenuButton.push("ColorSelect");
		return;
	}

	// Main buttons
	if (DialogProgress < 0) {
		if ((DialogInventory.length > 12) && ((Player.CanInteract() && !InventoryGroupIsBlocked(C)) || DialogItemPermissionMode)) DialogMenuButton.push("Next");
		if (C.FocusGroup.Name == "ItemMouth" || C.FocusGroup.Name == "ItemMouth2" || C.FocusGroup.Name == "ItemMouth3") DialogMenuButton.push("ChangeLayersMouth");
		if (InventoryItemHasEffect(Item, "Lock", true) && DialogCanUnlock(C, Item) && InventoryAllow(C, Item.Asset.Prerequisite) && !InventoryGroupIsBlocked(C) && (Player.CanInteract() || ((C.ID == 0) && InventoryItemHasEffect(Item, "Block", true)))) DialogMenuButton.push("Unlock");
		if ((Item != null) && (C.ID == 0) && (!Player.CanInteract() || (InventoryItemHasEffect(Item, "Lock", true) && !DialogCanUnlock(C, Item))) && (DialogMenuButton.indexOf("Unlock") < 0) && InventoryAllow(C, Item.Asset.Prerequisite) && !InventoryGroupIsBlocked(C)) DialogMenuButton.push("Struggle");
		if (InventoryItemHasEffect(Item, "Lock", true) && !Player.IsBlind() && (Item.Property != null) && (Item.Property.LockedBy != null) && (Item.Property.LockedBy != "")) DialogMenuButton.push("InspectLock");
		if ((Item != null) && Item.Asset.AllowLock && !InventoryItemHasEffect(Item, "Lock", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !InventoryGroupIsBlocked(C)) DialogMenuButton.push("Lock");
		if ((Item != null) && !InventoryItemHasEffect(Item, "Lock", true) && !InventoryItemHasEffect(Item, "Mounted", true) && !InventoryItemHasEffect(Item, "Enclose", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !InventoryGroupIsBlocked(C)) DialogMenuButton.push("Remove");
		if ((Item != null) && !InventoryItemHasEffect(Item, "Lock", true) && InventoryItemHasEffect(Item, "Mounted", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !InventoryGroupIsBlocked(C)) DialogMenuButton.push("Dismount");
		if ((Item != null) && !InventoryItemHasEffect(Item, "Lock", true) && InventoryItemHasEffect(Item, "Enclose", true) && Player.CanInteract() && InventoryAllow(C, Item.Asset.Prerequisite) && !InventoryGroupIsBlocked(C)) DialogMenuButton.push("Escape");
		if (InventoryItemHasEffect(Item, "Egged") && InventoryAvailable(Player, "VibratorRemote", "ItemVulva") && Player.CanInteract()) DialogMenuButton.push("Remote");
		if ((Item != null) && Item.Asset.Extended && Player.CanInteract() && !InventoryGroupIsBlocked(C) && (!Item.Asset.OwnerOnly || (C.IsOwnedByPlayer()))) DialogMenuButton.push("Use");
		if (Player.CanInteract()) DialogMenuButton.push("ColorPick");
		if (C.ID == 0) {
			if (DialogItemPermissionMode) DialogMenuButton.push("DialogNormalMode");
			else DialogMenuButton.push("DialogPermissionMode");
		}
	}

}

// Build the inventory listing for the dialog which is what's equipped, the player inventory and the character inventory for that group
function DialogInventoryBuild(C) {

	// Make sure there's a focused group
	DialogInventoryOffset = 0;
	DialogInventory = [];
	if (C.FocusGroup != null) {

		// First, we add anything that's currently equipped
		var Item = null;
		for(var A = 0; A < C.Appearance.length; A++)
			if ((C.Appearance[A].Asset.Group.Name == C.FocusGroup.Name) && C.Appearance[A].Asset.DynamicAllowInventoryAdd()) {
				DialogInventoryAdd(C, C.Appearance[A], true, true);
				break;
			}

		if (DialogItemPermissionMode) {
			for (var A = 0; A < Asset.length; A++)
				if (Asset[A].Enable && (Asset[A].Wear || Asset[A].IsLock) && Asset[A].Group.Name == C.FocusGroup.Name)
					if (!DialogInventory.some(D => (D.Asset.Group.Name == Asset[A].Group.Name) && (D.Asset.Name == Asset[A].Name)))
						DialogInventory.push({
							Asset: Asset[A],
							Worn: false,
							Icon: ""
						});
			DialogMenuButtonBuild(C);
			return;
		}

		// Second, we add everything from the victim inventory
		for(var A = 0; A < C.Inventory.length; A++)
			if ((C.Inventory[A].Asset != null) && (C.Inventory[A].Asset.Group.Name == C.FocusGroup.Name) && C.Inventory[A].Asset.DynamicAllowInventoryAdd())
				DialogInventoryAdd(C, C.Inventory[A], false);

		// Third, we add everything from the player inventory if the player isn't the victim
		if (C.ID != 0)
			for(var A = 0; A < Player.Inventory.length; A++)
				if ((Player.Inventory[A].Asset != null) && (Player.Inventory[A].Asset.Group.Name == C.FocusGroup.Name) && Player.Inventory[A].Asset.DynamicAllowInventoryAdd())
					DialogInventoryAdd(C, Player.Inventory[A], false);
		DialogMenuButtonBuild(C);

	}
}

// Build the initial state of the selection available in the facial expressions menu
function DialogFacialExpressionsBuild() {
	DialogFacialExpressions = [];
	for (var I = 0; I < Player.Appearance.length; I++) {
		var PA = Player.Appearance[I];
		var ExpressionList = PA.Asset.Group.AllowExpression;
		if (!ExpressionList || !ExpressionList.length) continue;
		var Item = {};
		Item.Appearance = PA;
		Item.CurrentExpression = (PA.Property == null) ? null : PA.Property.Expression;
		var Index = ExpressionList.indexOf(Item.CurrentExpression);
		Item.MenuExpression1 = (Index < 0) ? ExpressionList[ExpressionList.length - 1] : (Index == 0) ? null : ExpressionList[Index - 1];
		Item.MenuExpression2 = Item.CurrentExpression;
		Item.MenuExpression3 = (Index < 0) ? ExpressionList[0] : (Index == ExpressionList.length - 1) ? null : ExpressionList[Index + 1];
		Item.MenuExpression4 = (Index < 0) ? ExpressionList[1] : (Index == ExpressionList.length - 2) ? null : ExpressionList[Index + 2];
		DialogFacialExpressions.push(Item);
	}
	// Temporary (?) solution to make the facial elements appear in a more logical order, as their alphabetical order currently happens to match up
	DialogFacialExpressions = DialogFacialExpressions.sort(function (a, b) {
		return a.Appearance.Asset.Group.Name < b.Appearance.Asset.Group.Name ? -1 : a.Appearance.Asset.Group.Name > b.Appearance.Asset.Group.Name ? 1 : 0;
	});
}

// Gets the correct label for the current operation (struggling, removing, swaping, adding, etc.)
function DialogProgressGetOperation(C, PrevItem, NextItem) {
	if ((PrevItem != null) && (NextItem != null)) return DialogFind(Player, "Swapping");
	if (InventoryItemHasEffect(PrevItem, "Lock", true) && !DialogCanUnlock(C, PrevItem)) return DialogFind(Player, "Struggling");
	if ((PrevItem != null) && !Player.CanInteract() && !InventoryItemHasEffect(PrevItem, "Block", true)) return DialogFind(Player, "Struggling");
	if (InventoryItemHasEffect(PrevItem, "Lock", true)) return DialogFind(Player, "Unlocking");
	if ((PrevItem != null) && InventoryItemHasEffect(PrevItem, "Mounted", true)) return DialogFind(Player, "Dismounting");
	if ((PrevItem != null) && InventoryItemHasEffect(PrevItem, "Enclose", true)) return DialogFind(Player, "Escaping");
	if (PrevItem != null) return DialogFind(Player, "Removing");
	if (InventoryItemHasEffect(NextItem, "Lock", true)) return DialogFind(Player, "Locking");
	if ((PrevItem == null) && (NextItem != null)) return DialogFind(Player, "Adding");
	return "...";
}

// Starts the dialog progress bar and keeps the items that needs to be added / swaped / removed
function DialogStruggle(Reverse) {

	// Progress calculation
	var P = TimerRunInterval * 2.5 / (DialogProgressSkill * CheatFactor("DoubleItemSpeed", 0.5)); // Regular progress, slowed by long timers, faster with cheats
	P = P * (100 / (DialogProgress + 50));  // Faster when the dialog starts, longer when it ends	
	if ((DialogProgressChallenge > 6) && (DialogProgress > 50) && (DialogProgressAuto < 0)) P = P * (1 - ((DialogProgress - 50) / 50)); // Beyond challenge 6, it becomes impossible after 50% progress
	P = P * (Reverse ? -1 : 1); // Reverses the progress if the user pushed the same key twice

	// Sets the new progress and writes the "Impossible" message if we need to
	DialogProgress = DialogProgress + P;
	if (DialogProgress < 0) DialogProgress = 0;
	if ((DialogProgress >= 100) && (DialogProgressChallenge > 6) && (DialogProgressAuto < 0)) DialogProgress = 99;
	if (!Reverse) DialogProgressStruggleCount++;
	if ((DialogProgressStruggleCount >= 50) && (DialogProgressChallenge > 6) && (DialogProgressAuto < 0)) DialogProgressOperation = DialogFind(Player, "Impossible");

	// At 15 hit: low blush, 50: Medium and 125: High
	if (DialogAllowBlush && !Reverse) {
		if (DialogProgressStruggleCount == 15) CharacterSetFacialExpression(Player, "Blush", "Low");
		if (DialogProgressStruggleCount == 50) CharacterSetFacialExpression(Player, "Blush", "Medium");
		if (DialogProgressStruggleCount == 125) CharacterSetFacialExpression(Player, "Blush", "High");
	}

	// At 15 hit: Start drooling
	if (DialogAllowFluids && !Reverse) {
		if (DialogProgressStruggleCount == 15) CharacterSetFacialExpression(Player, "Fluids", "DroolMessy");
	}

	// Over 50 progress, the character frowns
	if (DialogAllowEyebrows && !Reverse) CharacterSetFacialExpression(Player, "Eyebrows", (DialogProgress >= 50) ? "Angry" : null);

}

// Starts the dialog progress bar and keeps the items that needs to be added / swapped / removed
function DialogProgressStart(C, PrevItem, NextItem) {

	// Gets the required skill / challenge level based on player/rigger skill and item difficulty (0 by default is easy to struggle out)
	var S = 0;
	if ((PrevItem != null) && (C.ID == 0)) {
		S = S + SkillGetLevel(Player, "Evasion"); // Add the player evasion level
		if (PrevItem.Difficulty != null) S = S - PrevItem.Difficulty; // Subtract the item difficulty (regular difficulty + player that restrained difficulty)
		if ((PrevItem.Property != null) && (PrevItem.Property.Difficulty != null)) S = S - PrevItem.Property.Difficulty; // Subtract the additional item difficulty for expanded items only
	}
	if ((C.ID != 0) || ((C.ID == 0) && (PrevItem == null))) S = S + SkillGetLevel(Player, "Bondage"); // Adds the bondage skill if no previous item or playing with another player
	if (Player.IsEnclose() || Player.IsMounted()) S = S - 2; // A little harder if there's an enclosing or mounting item
	if (InventoryItemHasEffect(PrevItem, "Lock", true) && !DialogCanUnlock(C, PrevItem)) S = S - 4; // Harder to struggle from a locked item
	if ((C.ID == 0) && !C.CanInteract() && !InventoryItemHasEffect(PrevItem, "Block", true)) S = S - 8; // Much harder to struggle from another item than the blocking one

	// Gets the standard time to do the operation
	var Timer = 0;
	if ((PrevItem != null) && (PrevItem.Asset != null) && (PrevItem.Asset.RemoveTime != null)) Timer = Timer + PrevItem.Asset.RemoveTime; // Adds the time to remove the previous item
	if ((NextItem != null) && (NextItem.Asset != null) && (NextItem.Asset.WearTime != null)) Timer = Timer + NextItem.Asset.WearTime; // Adds the time to add the new item
	if (Player.IsBlind() || (Player.Effect.indexOf("Suspension") >= 0)) Timer = Timer * 2; // Double the time if suspended from the ceiling or blind
	if (Timer < 1) Timer = 1; // Nothing shorter than 1 second

	// If there's a locking item, we add the time of that lock
	if ((PrevItem != null) && (NextItem == null) && InventoryItemHasEffect(PrevItem, "Lock", true) && DialogCanUnlock(C, PrevItem)) {
		var Lock = InventoryGetLock(PrevItem);
		if ((Lock != null) && (Lock.Asset != null) && (Lock.Asset.RemoveTime != null)) Timer = Timer + Lock.Asset.RemoveTime;
	}

	// Prepares the progress bar and timer
	DialogProgress = 0;
	DialogProgressAuto = TimerRunInterval * (0.22 + (((S <= -10) ? -9 : S) * 0.11)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));  // S: -9 is floor level to always give a false hope
	DialogProgressPrevItem = PrevItem;
	DialogProgressNextItem = NextItem;
	DialogProgressOperation = DialogProgressGetOperation(C, PrevItem, NextItem);
	DialogProgressSkill = Timer;
	DialogProgressChallenge = S * -1;
	DialogProgressLastKeyPress = 0;
	DialogProgressStruggleCount = 0;
	DialogItemToLock = null;
	DialogMenuButtonBuild(C);

	// The progress bar will not go down if the player can use her hands for a new item, or if she has the key for the locked item
	if ((DialogProgressAuto < 0) && Player.CanInteract() && (PrevItem == null)) DialogProgressAuto = 0;
	if ((DialogProgressAuto < 0) && Player.CanInteract() && (PrevItem != null) && (!InventoryItemHasEffect(PrevItem, "Lock", true) || DialogCanUnlock(C, PrevItem)) && !InventoryItemHasEffect(PrevItem, "Mounted", true)) DialogProgressAuto = 0;

	// If there's no current blushing, we update the blushing state while struggling
	DialogAllowBlush = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Blush") == null) || (InventoryGet(C, "Blush").Property == null) || (InventoryGet(C, "Blush").Property.Expression == null)));
	DialogAllowEyebrows = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Eyebrows") == null) || (InventoryGet(C, "Eyebrows").Property == null) || (InventoryGet(C, "Eyebrows").Property.Expression == null)));
	DialogAllowFluids = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Fluids") == null) ||(InventoryGet(C, "Fluids").Property == null) || (InventoryGet(C, "Fluids").Property.Expression == null)));

	// Applying or removing specific items can trigger an audio sound to play
	if ((PrevItem && PrevItem.Asset) || (NextItem && NextItem.Asset)) {
		var AudioFile = (NextItem && NextItem.Asset) ? NextItem.Asset.Audio : PrevItem.Asset.Audio;
		if (AudioFile != null) AudioDialogStart("Audio/" + AudioFile + ".mp3");
	}

}

// The player can use the space bar to speed up the dialog progress, just like clicking
function DialogKeyDown() {
	if (((KeyPress == 65) || (KeyPress == 83) || (KeyPress == 97) || (KeyPress == 115)) && (DialogProgress >= 0) && (DialogColor == null)) {
		DialogStruggle((DialogProgressLastKeyPress == KeyPress));
		DialogProgressLastKeyPress = KeyPress;
	}
}

// When the user clicks on one of icons in the item menu
function DialogMenuButtonClick() {

	// Finds the current icon
	for (var I = 0; I < DialogMenuButton.length; I++)
		if ((MouseX >= 1885 - I * 110) && (MouseX <= 1975 - I * 110)) {
			
			// Stops the dialog sounds
			AudioDialogStop();

			// Gets the current character and item
			var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
			var Item = InventoryGet(C, C.FocusGroup.Name);

			// Exit Icon - Go back to the character dialog
			if (DialogMenuButton[I] == "Exit") {
				DialogLeaveItemMenu();
				return;
			}

			// Next Icon - Shows the next 12 items
			else if (DialogMenuButton[I] == "Next") {
				DialogInventoryOffset = DialogInventoryOffset + 12;
				if (DialogInventoryOffset >= DialogInventory.length) DialogInventoryOffset = 0;
				return;
			}

			// Use Icon - Pops the item extension for the focused item
			else if ((DialogMenuButton[I] == "Use") && (Item != null)) {
				DialogExtendItem(Item);
				return;
			}

			// Remote Icon - Pops the item extension
			else if ((DialogMenuButton[I] == "Remote") && (Item != null)) {
				if (InventoryItemHasEffect(Item, "Egged") && InventoryAvailable(Player, "VibratorRemote", "ItemVulva"))
					DialogExtendItem(Item);
				return;
			}

			// Cycle through the layers of restraints for the mouth
			else if (DialogMenuButton[I] == "ChangeLayersMouth") {
				var NewLayerName;
				if (C.FocusGroup.Name == "ItemMouth") NewLayerName = "ItemMouth2";
				if (C.FocusGroup.Name == "ItemMouth2") NewLayerName = "ItemMouth3";
				if (C.FocusGroup.Name == "ItemMouth3") NewLayerName = "ItemMouth";

				for (var A = 0; A < AssetGroup.length; A++)
					if (AssetGroup[A].Name == NewLayerName) {
						C.FocusGroup = AssetGroup[A];
						DialogInventoryBuild(C);
					}
			}

			// Lock Icon - Rebuilds the inventory list with locking items
			else if ((DialogMenuButton[I] == "Lock") && (Item != null)) {
				if (DialogItemToLock == null) {
					if ((Item != null) && (Item.Asset.AllowLock != null)) {
						DialogInventoryOffset = 0;
						DialogInventory = [];
						DialogItemToLock = Item;
						for (var A = 0; A < Player.Inventory.length; A++)
							if ((Player.Inventory[A].Asset != null) && Player.Inventory[A].Asset.IsLock)
								DialogInventoryAdd(C, Player.Inventory[A], false);
					}
				} else {
					DialogItemToLock = null;
					DialogInventoryBuild(C);
				}
				return;
			}

			// Unlock/Remove/Struggle Icon - Starts the struggling mini-game (can be impossible to complete)
			else if (((DialogMenuButton[I] == "Unlock") || (DialogMenuButton[I] == "Remove") || (DialogMenuButton[I] == "Struggle") || (DialogMenuButton[I] == "Dismount") || (DialogMenuButton[I] == "Escape")) && (Item != null)) {
				DialogProgressStart(C, Item, null);
				return;
			}

			// When the player inspects a lock
			else if ((DialogMenuButton[I] == "InspectLock") && (Item != null)) {
				var Lock = InventoryGetLock(Item);
				if (Lock != null) DialogExtendItem(Lock, Item);
				return;
			}

			// Color picker Icon - Starts the color picking
			else if (DialogMenuButton[I] == "ColorPick") {
				ElementCreateInput("InputColor", "text", (DialogColorSelect != null) ? DialogColorSelect.toString() : "");
				DialogColor = "";
				DialogMenuButtonBuild(C);
				return;
			}

			// When the user selects a color
			else if ((DialogMenuButton[I] == "ColorSelect") && CommonIsColor(ElementValue("InputColor"))) {
				DialogColor = null;
				DialogColorSelect = ElementValue("InputColor");
				ElementRemove("InputColor");
				DialogMenuButtonBuild(C);
				return;
			}

			// When the user cancels out of color picking
			else if (DialogMenuButton[I] == "ColorCancel") {
				DialogColor = null;
				DialogColorSelect = null;
				ElementRemove("InputColor");
				DialogMenuButtonBuild(C);
				return;
			}

			else if (DialogMenuButton[I] == "DialogPermissionMode") {
				DialogItemPermissionMode = true;
				DialogInventoryBuild(C);
				return;
			}

			else if (DialogMenuButton[I] == "DialogNormalMode") {
				DialogItemPermissionMode = false;
				DialogInventoryBuild(C);
				return;
			}
		}

}

// Publishes the item action to the local chat room or the dialog screen
function DialogPublishAction(C, ClickItem) {

	// The shock triggers can trigger items that can shock the wearer
	if (C.FocusGroup != null) {
		var TargetItem = (InventoryGet(C, C.FocusGroup.Name));
		if (InventoryItemHasEffect(ClickItem, "TriggerShock") && InventoryItemHasEffect(TargetItem, "ReceiveShock")) {
			if (CurrentScreen == "ChatRoom") {
				var intensity = TargetItem.Property ? TargetItem.Property.Intensity : 0;
				InventoryExpressionTrigger(C, ClickItem);
				ChatRoomPublishCustomAction(TargetItem.Asset.Name + "Trigger" + intensity, true, [{Tag: "DestinationCharacterName", Text: C.Name, MemberNumber: C.MemberNumber}]);
			}
			else {
				var intensity = TargetItem.Property ? TargetItem.Property.Intensity : 0;
				var D = (DialogFind(Player, TargetItem.Asset.Name + "Trigger" + intensity)).replace("DestinationCharacterName", C.Name);
				if (D != "") {
					InventoryExpressionTrigger(C, ClickItem);
					C.CurrentDialog = "(" + D + ")";
					DialogLeaveItemMenu();
				}
			}
			return;
		}
	}

	// Publishes the item result
	if (CurrentScreen == "ChatRoom" && !InventoryItemHasEffect(ClickItem)) {
		InventoryExpressionTrigger(C, ClickItem);
		ChatRoomPublishAction(CurrentCharacter, null, ClickItem, true);
	}
	else {
		var D = DialogFind(C, ClickItem.Asset.Group.Name + ClickItem.Asset.Name, null, false);
		if (D != "") {
			InventoryExpressionTrigger(C, ClickItem);
			C.CurrentDialog = D;
			DialogLeaveItemMenu();
		}
	}

}

// When the player clicks on an item
function DialogItemClick(ClickItem) {

	// Gets the current character and item
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	var CurrentItem = InventoryGet(C, C.FocusGroup.Name);

	// permission mode allow/block items
	if (C.ID == 0 && DialogItemPermissionMode) {
		if (CurrentItem && (CurrentItem.Asset.Name == ClickItem.Asset.Name)) return;
		if (Player.BlockItems.some(B => B.Name == ClickItem.Asset.Name && B.Group == ClickItem.Asset.Group.Name)) {
			Player.BlockItems = Player.BlockItems.filter(B => B.Name != ClickItem.Asset.Name || B.Group != ClickItem.Asset.Group.Name);
		} else {
			Player.BlockItems.push({ Name: ClickItem.Asset.Name, Group: ClickItem.Asset.Group.Name });
		}
		ServerSend("AccountUpdate", { BlockItems: Player.BlockItems });
		return;
	}
	if (C.BlockItems && C.BlockItems.some(B => B.Name == ClickItem.Asset.Name && B.Group == ClickItem.Asset.Group.Name)) return; // item is blocked

	// If we must apply a lock to an item
	if (DialogItemToLock != null) {
		if ((CurrentItem != null) && CurrentItem.Asset.AllowLock) {
			InventoryLock(C, CurrentItem, ClickItem, Player.MemberNumber);
			DialogItemToLock = null;
			DialogInventoryBuild(C);
			ChatRoomPublishAction(C, CurrentItem, ClickItem, true);
		}
		return;
	}

	// Cannot change item if the previous one is locked or blocked by another group
	if ((CurrentItem == null) || !InventoryItemHasEffect(CurrentItem, "Lock", true)) {
		if (!InventoryGroupIsBlocked(C))
			if (InventoryAllow(C, ClickItem.Asset.Prerequisite))
				if ((CurrentItem == null) || (CurrentItem.Asset.Name != ClickItem.Asset.Name)) {
					if (ClickItem.Asset.Wear) {
						// Prevent two unique gags being equipped. Also check if selfbondage is allowed for the item if used on self
						if (ClickItem.Asset.Prerequisite == "GagUnique" && C.Pose.indexOf("GagUnique") >= 0) DialogSetText("CanOnlyEquipOneOfThisGag");
						else if (ClickItem.Asset.Prerequisite == "GagCorset" && C.Pose.indexOf("GagCorset") >= 0) DialogSetText("CannotUseMultipleCorsetGags");
						else if (ClickItem.Asset.SelfBondage || (C.ID != 0)) DialogProgressStart(C, CurrentItem, ClickItem);
						else DialogSetText("CannotUseOnSelf");
					} else {

						// The vibrating egg remote can open the vibrating egg's extended dialog
						if (ClickItem.Asset.Name == "VibratorRemote" && InventoryItemHasEffect(InventoryGet(C, C.FocusGroup.Name), "Egged"))
							DialogExtendItem(InventoryGet(C, C.FocusGroup.Name));

						// Publishes the item action text
						DialogPublishAction(C, ClickItem);

					}
				}
				else
					if ((CurrentItem.Asset.Name == ClickItem.Asset.Name) && CurrentItem.Asset.Extended)
						DialogExtendItem(CurrentItem);
		return;
	}

	// If the item can unlock another item or simply show dialog text (not wearable)
	if (InventoryAllow(C, ClickItem.Asset.Prerequisite))
		if (InventoryItemHasEffect(ClickItem, "Unlock-" + CurrentItem.Asset.Name))
			DialogProgressStart(C, CurrentItem, null);
		else
			if ((CurrentItem.Asset.Name == ClickItem.Asset.Name) && CurrentItem.Asset.Extended)
				DialogExtendItem(CurrentItem);
			else
				if (!ClickItem.Asset.Wear)
					DialogPublishAction(C, ClickItem);

}

// When the user clicks on a dialog option
function DialogClick() {

	// If the user clicked on the interaction character or herself, we check to build the item menu
	if ((CurrentCharacter.AllowItem || (MouseX < 500)) && (MouseX >= 0) && (MouseX <= 1000) && (MouseY >= 0) && (MouseY < 1000) && ((CurrentCharacter.ID != 0) || (MouseX > 500)) && (DialogIntro() != "")) {
		DialogLeaveItemMenu();
		var C = (MouseX < 500) ? Player : CurrentCharacter;
		var X = (MouseX < 500) ? 0 : 500;
		var HeightRatio = CharacterAppearanceGetCurrentValue(C, "Height", "Zoom");
		if ((Player != null) && (Player.VisualSettings != null) && (Player.VisualSettings.ForceFullHeight != null) && Player.VisualSettings.ForceFullHeight) HeightRatio = 1.0;
		var XOffset = 500 * (1 - HeightRatio) / 2;
		var YOffset = ((C.Pose.indexOf("Suspension") < 0) && (C.Pose.indexOf("SuspensionHogtied") < 0)) ? 1000 * (1 - HeightRatio) : 0;
		for (var A = 0; A < AssetGroup.length; A++)
			if ((AssetGroup[A].Category == "Item") && (AssetGroup[A].Zone != null))
				for (var Z = 0; Z < AssetGroup[A].Zone.length; Z++)
					if (((C.Pose.indexOf("Suspension") < 0) && (MouseX - X >= ((AssetGroup[A].Zone[Z][0] * HeightRatio) + XOffset)) && (MouseY >= (((AssetGroup[A].Zone[Z][1] - C.HeightModifier) * HeightRatio) + YOffset)) && (MouseX - X <= (((AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) * HeightRatio) + XOffset)) && (MouseY <= (((AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3] - C.HeightModifier) * HeightRatio) + YOffset)))
						|| ((C.Pose.indexOf("Suspension") >= 0) && (MouseX - X >= ((AssetGroup[A].Zone[Z][0] * HeightRatio) + XOffset)) && (MouseY >= HeightRatio * ((1000 - (AssetGroup[A].Zone[Z][1] + AssetGroup[A].Zone[Z][3])) - C.HeightModifier)) && (MouseX - X <= (((AssetGroup[A].Zone[Z][0] + AssetGroup[A].Zone[Z][2]) * HeightRatio) + XOffset)) && (MouseY <= HeightRatio * (1000 - ((AssetGroup[A].Zone[Z][1])) - C.HeightModifier)))) {
						C.FocusGroup = AssetGroup[A];
						DialogItemToLock = null;
						DialogFocusItem = null;
						DialogInventoryBuild(C);
						DialogText = DialogTextDefault;
						break;
					}
	}

	// In item menu mode VS text dialog mode
	if (((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)) && (DialogIntro() != "")) {

		// If we must are in the extended menu of the item
		if (DialogFocusItem != null)
			CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Click()");
		else {

			// If the user wants to speed up the add / swap / remove progress
			if ((MouseX >= 1000) && (MouseX < 2000) && (MouseY >= 600) && (MouseY < 1000) && (DialogProgress >= 0) && CommonIsMobile) DialogStruggle(false);

			// If the user wants to click on one of icons in the item menu
			if ((MouseX >= 1000) && (MouseX < 2000) && (MouseY >= 15) && (MouseY <= 105)) DialogMenuButtonClick();

			// In color picker mode, we can pick a color from the color image
			if ((MouseX >= 1300) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 975) && (DialogColor != null))
				ElementValue("InputColor", DrawRGBToHex(MainCanvas.getImageData(MouseX, MouseY, 1, 1).data));

			// If the user clicks on one of the items
			if ((MouseX >= 1000) && (MouseX <= 1975) && (MouseY >= 125) && (MouseY <= 1000) && ((DialogItemPermissionMode && (Player.FocusGroup != null)) || (Player.CanInteract() && !InventoryGroupIsBlocked((Player.FocusGroup != null) ? Player : CurrentCharacter))) && (DialogProgress < 0) && (DialogColor == null)) {

				// For each items in the player inventory
				var X = 1000;
				var Y = 125;
				for (var I = DialogInventoryOffset; (I < DialogInventory.length) && (I < DialogInventoryOffset + 12); I++) {

					// If the item is clicked
					if ((MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275))
						if (DialogInventory[I].Asset.Enable || (DialogInventory[I].Asset.Extended && DialogInventory[I].Asset.OwnerOnly && CurrentCharacter.IsOwnedByPlayer())) {
							DialogItemClick(DialogInventory[I]);
							break;
						}

					// Change the X and Y position to get the next square
					X = X + 250;
					if (X > 1800) {
						X = 1000;
						Y = Y + 300;
					}

				}
			}
		}

	} else {

		// If we need to leave the dialog (only allowed when there's an entry point to the dialog, not in the middle of a conversation)
		if ((DialogIntro() != "") && (DialogIntro() != "NOEXIT") && (MouseX >= 1885) && (MouseX <= 1975) && (MouseY >= 25) && (MouseY <= 110))
			DialogLeave();

		// If the user clicked on a text dialog option, we trigger it
		if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 100) && (MouseY <= 990) && (CurrentCharacter != null)) {
			var pos = 0;
			for (var D = 0; D < CurrentCharacter.Dialog.length; D++)
				if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
					if ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 250 + pos * 105)) {

						// If the player is gagged, the answer will always be the same
						if (!Player.CanTalk()) CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PlayerGagged");
						else CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;

						// A dialog option can change the conversation stage, show text or launch a custom function						
						if ((Player.CanTalk() && CurrentCharacter.CanTalk()) || SpeechFullEmote(CurrentCharacter.Dialog[D].Option)) {
							CurrentCharacter.CurrentDialog = CurrentCharacter.Dialog[D].Result;
							if (CurrentCharacter.Dialog[D].NextStage != null) CurrentCharacter.Stage = CurrentCharacter.Dialog[D].NextStage;
							if (CurrentCharacter.Dialog[D].Function != null) CommonDynamicFunctionParams(CurrentCharacter.Dialog[D].Function);
						} else
							if ((CurrentCharacter.Dialog[D].Function != null) && (CurrentCharacter.Dialog[D].Function.trim() == "DialogLeave()"))
								DialogLeave();
						break;

					}
					pos++;
				}
		}

	}

	// If the user clicked in the facial expression menu
	if ((CurrentCharacter != null) && (CurrentCharacter.ID == 0) && (MouseX >= 0) && (MouseX <= 500)) {
		for (var I = 0; I < DialogFacialExpressions.length; I++) {
			var FE = DialogFacialExpressions[I];
			if ((MouseY >= 125 + 120 * I) && (MouseY <= (125 + 120 * I) + 90)) {

				// Left arrow button
				if (MouseX >= 0 && MouseX <= 45) {
					FE.MenuExpression4 = FE.MenuExpression3;
					FE.MenuExpression3 = FE.MenuExpression2;
					FE.MenuExpression2 = FE.MenuExpression1;
					var ExpressionList = FE.Appearance.Asset.Group.AllowExpression;
					var Index = ExpressionList.indexOf(FE.MenuExpression1);
					FE.MenuExpression1 = (Index < 0) ? ExpressionList[ExpressionList.length - 1] : (Index == 0) ? null : ExpressionList[Index - 1];
				}

				// Right arrow button
				if (MouseX >= 455 && MouseX <= 500) {
					FE.MenuExpression1 = FE.MenuExpression2;
					FE.MenuExpression2 = FE.MenuExpression3;
					FE.MenuExpression3 = FE.MenuExpression4;
					var ExpressionList = FE.Appearance.Asset.Group.AllowExpression;
					var Index = ExpressionList.indexOf(FE.MenuExpression4);
					FE.MenuExpression4 = (Index < 0) ? ExpressionList[0] : (Index == ExpressionList.length - 1) ? null : ExpressionList[Index + 1];
				}

				// Expression choice
				if (MouseX >= 55 && MouseX <= 145) {
					CharacterSetFacialExpression(Player, FE.Appearance.Asset.Group.Name, FE.MenuExpression1);
					FE.CurrentExpression = FE.MenuExpression1;
				}
				if (MouseX >= 155 && MouseX <= 245) {
					CharacterSetFacialExpression(Player, FE.Appearance.Asset.Group.Name, FE.MenuExpression2);
					FE.CurrentExpression = FE.MenuExpression2;
				}
				if (MouseX >= 255 && MouseX <= 345) {
					CharacterSetFacialExpression(Player, FE.Appearance.Asset.Group.Name, FE.MenuExpression3);
					FE.CurrentExpression = FE.MenuExpression3;
				}
				if (MouseX >= 355 && MouseX <= 445) {
					CharacterSetFacialExpression(Player, FE.Appearance.Asset.Group.Name, FE.MenuExpression4);
					FE.CurrentExpression = FE.MenuExpression4;
				}

			}
		}
	}

}

// Sets the dialog 5 seconds text
function DialogSetText(NewText) {
	DialogTextDefaultTimer = CommonTime() + 5000;
	DialogText = DialogFind(Player, NewText);
}

// Extends a specific item (loads its settings and shows its own menu)
function DialogExtendItem(Item, SourceItem) {
	DialogProgress = -1;
	DialogColor = null;
	DialogFocusItem = Item;
	DialogFocusSourceItem = SourceItem;
	CommonDynamicFunction("Inventory" + Item.Asset.Group.Name + Item.Asset.Name + "Load()");
}

// Draw the item menu dialog
function DialogDrawItemMenu(C) {

	// Gets the default text that will reset after 5 seconds
	if (DialogTextDefault == "") DialogTextDefault = DialogFind(Player, "SelectItem");
	if (DialogTextDefaultTimer < CommonTime()) DialogText = DialogTextDefault;

	// Draws the top menu text & icons
	if (DialogMenuButton == null) DialogMenuButtonBuild((Player.FocusGroup != null) ? Player : CurrentCharacter);
	if ((DialogColor == null) && Player.CanInteract() && (DialogProgress < 0) && !InventoryGroupIsBlocked(C) && DialogMenuButton.length < 8) DrawTextWrap((!DialogItemPermissionMode) ? DialogText : DialogFind(Player, "DialogPermissionMode"), 1000, 0, 975 - DialogMenuButton.length * 110, 125, "White");
	for (var I = DialogMenuButton.length - 1; I >= 0; I--)
		DrawButton(1885 - I * 110, 15, 90, 90, "", ((DialogMenuButton[I] == "ColorPick") && (DialogColorSelect != null)) ? DialogColorSelect : "White", "Icons/" + DialogMenuButton[I] + ".png", (DialogColor == null) ? DialogFind(Player, DialogMenuButton[I]) : null);

	// Draws the color picker
	if (DialogColor != null) {
		ElementPosition("InputColor", 1450, 65, 300);
		if (CommonIsColor(ElementValue("InputColor"))) DrawRect(1290, 135, 695, 850, ElementValue("InputColor"));
		DrawImage("Backgrounds/ColorPicker.png", 1300, 145);
		return;
	}

	// In item permission mode, the player can choose which item he allows other users to mess with.  Allowed items have a green background.  Disallowed have a red background.
	if ((DialogItemPermissionMode && (C.ID == 0) && (DialogProgress < 0)) || (Player.CanInteract() && (DialogProgress < 0) && !InventoryGroupIsBlocked(C))) {

		// Draw all possible items in that category (12 per screen)
		if (DialogInventory == null) DialogInventoryBuild(C);
		var X = 1000;
		var Y = 125;
		for (var I = DialogInventoryOffset; (I < DialogInventory.length) && (I < DialogInventoryOffset + 12); I++) {
			var Item = DialogInventory[I];
			var Hover = (MouseX >= X) && (MouseX < X + 225) && (MouseY >= Y) && (MouseY < Y + 275) && !CommonIsMobile;
			var Block = C.BlockItems && C.BlockItems.some(B => B.Name == Item.Asset.Name && B.Group == Item.Asset.Group.Name)
			DrawRect(X, Y, 225, 275, (DialogItemPermissionMode && C.ID == 0) ? 
				(DialogInventory[I].Worn ? "gray" : Block ? Hover ? "red" : "pink" : Hover ? "green" : "lime") : 
				((Hover && !Block) ? "cyan" : DialogInventory[I].Worn ? "pink" : Block ? "gray" : "white"));
			if (Item.Worn && InventoryItemHasEffect(InventoryGet(C, Item.Asset.Group.Name), "Vibrating", true)) DrawImageResize("Assets/" + Item.Asset.Group.Family + "/" + Item.Asset.Group.Name + "/Preview/" + Item.Asset.Name + ".png", X + Math.floor(Math.random() * 3) + 1, Y + Math.floor(Math.random() * 3) + 1, 221, 221);
			else DrawImageResize("Assets/" + Item.Asset.Group.Family + "/" + Item.Asset.Group.Name + "/Preview/" + Item.Asset.Name + Item.Asset.DynamicPreviewIcon() + ".png", X + 2, Y + 2, 221, 221);
			DrawTextFit(Item.Asset.DynamicDescription(), X + 112, Y + 250, 221, "black");
			if (Item.Icon != "") DrawImage("Icons/" + Item.Icon + ".png", X + 2, Y + 110);
			X = X + 250;
			if (X > 1800) {
				X = 1000;
				Y = Y + 300;
			}
		}
		return;

	}

	// If the player is progressing
	var C = (Player.FocusGroup != null) ? Player : CurrentCharacter;
	if (DialogProgress >= 0) {

		// Draw one or both items
		if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null)) {
			DrawItemPreview(1200, 250, DialogProgressPrevItem);
			DrawItemPreview(1575, 250, DialogProgressNextItem);
		} else DrawItemPreview(1387, 250, (DialogProgressPrevItem != null) ? DialogProgressPrevItem : DialogProgressNextItem);

		// Add or subtract to the automatic progression, doesn't move in color picking mode
		DialogProgress = DialogProgress + DialogProgressAuto;
		if (DialogProgress < 0) DialogProgress = 0;

		// Draw the current operation and progress
		if (DialogProgressAuto < 0) DrawText(DialogFind(Player, "Challenge") + " " + ((DialogProgressStruggleCount >= 50) ? DialogProgressChallenge.toString() : "???"), 1500, 150, "White", "Black");
		DrawText(DialogProgressOperation, 1500, 650, "White", "Black");
		DrawProgressBar(1200, 700, 600, 100, DialogProgress);
		DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1500, 900, "White", "Black");

		// If the operation is completed
		if (DialogProgress >= 100) {

			// Stops the dialog sounds
			AudioDialogStop();

			// Add / swap / remove the item
			InventoryRemove(C, C.FocusGroup.Name);
			if (DialogProgressNextItem != null) InventoryWear(C, DialogProgressNextItem.Asset.Name, DialogProgressNextItem.Asset.Group.Name, (DialogColorSelect == null) ? "Default" : DialogColorSelect, SkillGetLevel(Player, "Bondage"));

			// remove associated items at the same time
			if (InventoryGet(C, "ItemNeck") == null) InventoryRemove(C, "ItemNeckAccessories");
			if (InventoryGet(C, "ItemNeck") == null) InventoryRemove(C, "ItemNeckRestraints");

			// The player can use another item right away, for another character we jump back to her reaction
			if (C.ID == 0) {
				if (DialogProgressNextItem == null) SkillProgress("Evasion", DialogProgressSkill);
				if ((DialogProgressNextItem == null) || !DialogProgressNextItem.Asset.Extended) {
					DialogInventoryBuild(C);
					DialogProgress = -1;
					DialogColor = null;
				}
			} else {
				if (DialogProgressNextItem != null) SkillProgress("Bondage", DialogProgressSkill);
				if (((DialogProgressNextItem == null) || !DialogProgressNextItem.Asset.Extended) && (CurrentScreen != "ChatRoom")) {
					C.CurrentDialog = DialogFind(C, ((DialogProgressNextItem == null) ? ("Remove" + DialogProgressPrevItem.Asset.Name) : DialogProgressNextItem.Asset.Name), ((DialogProgressNextItem == null) ? "Remove" : "") + C.FocusGroup.Name);
					DialogLeaveItemMenu();
				}
			}

			// Check to open the extended menu of the item.  In a chat room, we publish the result for everyone
			if ((DialogProgressNextItem != null) && DialogProgressNextItem.Asset.Extended) {
				DialogInventoryBuild(C);
				ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem, false);
				DialogExtendItem(InventoryGet(C, DialogProgressNextItem.Asset.Group.Name));
			} else ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem, true);

			// Rebuilds the menu
			DialogEndExpression();
			if (C.FocusGroup != null) DialogMenuButtonBuild(C);

		}
		return;
	}

	// If we must draw the current item from the group
	var Item = InventoryGet(C, C.FocusGroup.Name);
	if (Item != null) {
		if (InventoryItemHasEffect(Item, "Vibrating", true)) {
			DrawRect(1387, 250, 225, 275, "white");
			DrawImageResize("Assets/" + Item.Asset.Group.Family + "/" + Item.Asset.Group.Name + "/Preview/" + Item.Asset.Name + ".png", 1389 + Math.floor(Math.random() * 3) - 2, 252 + Math.floor(Math.random() * 3) - 2, 221, 221);
			DrawTextFit(Item.Asset.Description, 1497, 500, 221, "black");
		}
		else DrawItemPreview(1387, 250, Item);
	}

	// Show the no access text
	if (InventoryGroupIsBlocked(C)) DrawText(DialogFind(Player, "ZoneBlocked"), 1500, 700, "White", "Black");
	else DrawText(DialogFind(Player, "AccessBlocked"), 1500, 700, "White", "Black");

}

// Searches in the dialog for a specific stage keyword and returns that dialog option if we find it
function DialogFind(C, KeyWord1, KeyWord2, ReturnPrevious) {
	for (var D = 0; D < C.Dialog.length; D++)
		if (C.Dialog[D].Stage == KeyWord1)
			return C.Dialog[D].Result.trim();
	if (KeyWord2 != null)
		for (var D = 0; D < C.Dialog.length; D++)
			if (C.Dialog[D].Stage == KeyWord2)
				return C.Dialog[D].Result.trim();
	return ((ReturnPrevious == null) || ReturnPrevious) ? C.CurrentDialog : "";
}

// Searches in the dialog for a specific stage keyword and returns that dialog option if we find it and replace the names
function DialogFindAutoReplace(C, KeyWord1, KeyWord2, ReturnPrevious) {
	return DialogFind(C, KeyWord1, KeyWord2, ReturnPrevious)
		.replace("SourceCharacter", Player.Name)
		.replace("DestinationCharacter", CharacterGetCurrent().Name);
}

// Draw all the possible interactions 
function DialogDraw() {

	// Draw both the player and the interaction character
	if (CurrentCharacter.ID != 0) DrawCharacter(Player, 0, 0, 1);
	DrawCharacter(CurrentCharacter, 500, 0, 1);

	// Draw the menu for facial expressions if the player clicked on herself
	if (CurrentCharacter.ID == 0) DialogDrawExpressionMenu();

	// If we must show the item/inventory menu
	if (((Player.FocusGroup != null) || ((CurrentCharacter.FocusGroup != null) && CurrentCharacter.AllowItem)) && (DialogIntro() != "")) {

		// The view can show one specific extended item or the list of all items for a group
		if (DialogFocusItem != null) {
			CommonDynamicFunction("Inventory" + DialogFocusItem.Asset.Group.Name + DialogFocusItem.Asset.Name + "Draw()");
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		} else DialogDrawItemMenu((Player.FocusGroup != null) ? Player : CurrentCharacter);

	} else {

		// Draws the intro text or dialog result
		if ((DialogIntro() != "") && (DialogIntro() != "NOEXIT")) {
			DrawTextWrap(SpeechGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -5, 840, 165, "white", null, 3);
			DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
		} else DrawTextWrap(SpeechGarble(CurrentCharacter, CurrentCharacter.CurrentDialog), 1025, -5, 950, 165, "white", null, 3);

		// Draws the possible answers
		var pos = 0;
		for (var D = 0; D < CurrentCharacter.Dialog.length; D++)
			if ((CurrentCharacter.Dialog[D].Stage == CurrentCharacter.Stage) && (CurrentCharacter.Dialog[D].Option != null) && DialogPrerequisite(D)) {
				DrawTextWrap(SpeechGarble(Player, CurrentCharacter.Dialog[D].Option), 1025, 160 + 105 * pos, 950, 90, "black", ((MouseX >= 1025) && (MouseX <= 1975) && (MouseY >= 160 + pos * 105) && (MouseY <= 250 + pos * 105) && !CommonIsMobile) ? "cyan" : "white", 2);
				pos++;
			}

		// The more time you spend with an NPC, the more the love will rise
		NPCInteraction();

	}

}

// Draw the menu for changing facial expressions
function DialogDrawExpressionMenu() {
	
	// Draw the expression groups
	DrawText(DialogFind(Player, "FacialExpression"), 265, 62, "White", "Black");
	if (!DialogFacialExpressions || !DialogFacialExpressions.length) DialogFacialExpressionsBuild();
	for (var I = 0; I < DialogFacialExpressions.length; I++) {
		var FE = DialogFacialExpressions[I];
		var OffsetY = 125 + 120 * I;

		// Draw the back and forth arrow buttons
		DrawButton(0, OffsetY, 45, 90, "", "White");
		MainCanvas.beginPath();
		MainCanvas.moveTo(30, OffsetY + 15);
		MainCanvas.lineTo(15, OffsetY + 45);
		MainCanvas.lineTo(30, OffsetY + 75);
		MainCanvas.stroke();
		DrawButton(455, OffsetY, 45, 90, "", "White");
		MainCanvas.beginPath();
		MainCanvas.moveTo(470, OffsetY + 15);
		MainCanvas.lineTo(485, OffsetY + 45);
		MainCanvas.lineTo(470, OffsetY + 75);
		MainCanvas.stroke();

		// Draw the selection of facial expressions at current scroll position
		DrawButton(55, OffsetY, 90, 90, "", (FE.MenuExpression1 == FE.CurrentExpression ? "Pink" : "White"), "Assets/Female3DCG/" + FE.Appearance.Asset.Group.Name + (FE.MenuExpression1 ? "/" + FE.MenuExpression1 : "") + "/Icon.png");
		DrawButton(155, OffsetY, 90, 90, "", (FE.MenuExpression2 == FE.CurrentExpression ? "Pink" : "White"), "Assets/Female3DCG/" + FE.Appearance.Asset.Group.Name + (FE.MenuExpression2 ? "/" + FE.MenuExpression2 : "") + "/Icon.png");
		DrawButton(255, OffsetY, 90, 90, "", (FE.MenuExpression3 == FE.CurrentExpression ? "Pink" : "White"), "Assets/Female3DCG/" + FE.Appearance.Asset.Group.Name + (FE.MenuExpression3 ? "/" + FE.MenuExpression3 : "") + "/Icon.png");
		DrawButton(355, OffsetY, 90, 90, "", (FE.MenuExpression4 == FE.CurrentExpression ? "Pink" : "White"), "Assets/Female3DCG/" + FE.Appearance.Asset.Group.Name + (FE.MenuExpression4 ? "/" + FE.MenuExpression4 : "") + "/Icon.png");

	}
}
