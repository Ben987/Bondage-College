"use strict";
var StruggleLockPickItem = null;
var StruggleLockPickOrder = null;
var StruggleLockPickSet = null;
var StruggleLockPickSetFalse = null;
var StruggleLockPickOffset = null;
var StruggleLockPickOffsetTarget = null;
var StruggleLockPickImpossiblePins = null;
var StruggleLockPickProgressItem = null;
var StruggleLockPickProgressOperation = "";
var StruggleLockPickProgressSkill = 0;
var StruggleLockPickProgressSkillLose = 0;
var StruggleLockPickProgressChallenge = 0;
var StruggleLockPickProgressMaxTries = 0;
var StruggleLockPickProgressCurrentTries = 0;
var StruggleLockPickSuccessTime = 0;
var StruggleLockPickFailTime = 0;
var StruggleLockPickArousalTick = 0;
var StruggleLockPickArousalTickTime = 12000;
var StruggleLockPickArousalText = "";
var StruggleLockPickFailTimeout = 30000;
var StruggleLockPickTotalTries = 0;

var StruggleProgressStruggleCount = 0;
var StruggleProgressAuto = 0;
var StruggleProgressOperation = "...";
var StruggleProgressPrevItem = null;
var StruggleProgressNextItem = null;
var StruggleProgressSkill = 0;
var StruggleProgressLastKeyPress = 0;
var StruggleProgressChallenge = 0;


var StruggleProgressCurrentMinigame = "Strength";
var StruggleProgressChoosePrevItem = null;
var StruggleProgressChooseNextItem = null;

// For flexibility
var StruggleProgressFlexCircles = [];
var StruggleProgressFlexTimer = 0;
var StruggleProgressFlexMaxX = 300;
var StruggleProgressFlexMaxY = 150;
var StruggleProgressFlexCirclesRate = 200;

// For dexterity
var StruggleProgressDexTarget = 0;
var StruggleProgressDexCurrent = 0;
var StruggleProgressDexMax = 300;
var StruggleProgressDexDirectionRight = false; // Moves left when false, right when true



function StruggleDrawStruggleProgress(C) {
	if (StruggleProgressCurrentMinigame == "Strength") StruggleDrawStrengthProgress(C);
	else if (StruggleProgressCurrentMinigame == "Flexibility") StruggleDrawFlexibilityProgress(C);
	else if (StruggleProgressCurrentMinigame == "Dexterity") StruggleDrawDexterityProgress(C);

	else {
		if ((StruggleProgressChoosePrevItem != null) && (StruggleProgressChooseNextItem != null)) {
			DrawAssetPreview(1200, 150, StruggleProgressChoosePrevItem.Asset);
			DrawAssetPreview(1575, 150, StruggleProgressChooseNextItem.Asset);
		} else DrawAssetPreview(1387, 150, (StruggleProgressChoosePrevItem != null) ? StruggleProgressChoosePrevItem.Asset : StruggleProgressChooseNextItem.Asset);


		DrawText(DialogFindPlayer("ChooseStruggleMethod"), 1500, 550, "White", "Black");


		if (MouseIn(1387-300, 600, 225, 275)) DrawRect(1387-300, 600, 225, 275, "aqua");
		else DrawRect(1387-300, 600, 225, 275, "white");
		DrawImageResize("Icons/Struggle/Strength.png", 1389-300, 602, 221, 221);
		DrawTextFit(DialogFindPlayer("Strength"), 1500-300, 850, 221, "black");


		if (MouseIn(1387, 600, 225, 275)) DrawRect(1387, 600, 225, 275, "aqua");
		else DrawRect(1387, 600, 225, 275, "white");
		DrawImageResize("Icons/Struggle/Flexibility.png", 1389, 602, 221, 221);
		DrawTextFit(DialogFindPlayer("Flexibility"), 1500, 850, 221, "black");


		if (MouseIn(1387+300, 600, 225, 275)) DrawRect(1387+300, 600, 225, 275, "aqua");
		else DrawRect(1387+300, 600, 225, 275, "white");
		DrawImageResize("Icons/Struggle/Dexterity.png", 1389+300, 602, 221, 221);
		DrawTextFit(DialogFindPlayer("Dexterity"), 1500+300, 850, 221, "black");

	}

}


/**
 * Gets the correct label for the current operation (struggling, removing, swaping, adding, etc.)
 * @param {Character} C - The character who acts
 * @param {Item} PrevItem - The first item that's part of the action
 * @param {Item} NextItem - The second item that's part of the action
 * @returns {string} - The appropriate dialog option
 */
function StruggleProgressGetOperation(C, PrevItem, NextItem) {
	if ((PrevItem != null) && (NextItem != null)) return DialogFindPlayer("Swapping");
	if ((C.ID == 0) && (PrevItem != null) && (SkillGetRatio("Evasion") != 1)) return DialogFindPlayer("Using" + (SkillGetRatio("Evasion") * 100).toString());
	if (InventoryItemHasEffect(PrevItem, "Lock", true) && !DialogCanUnlock(C, PrevItem)) return DialogFindPlayer("Struggling");
	if ((PrevItem != null) && !Player.CanInteract() && !InventoryItemHasEffect(PrevItem, "Block", true)) return DialogFindPlayer("Struggling");
	if (InventoryItemHasEffect(PrevItem, "Lock", true)) return DialogFindPlayer("Unlocking");
	if ((PrevItem != null) && InventoryItemHasEffect(PrevItem, "Mounted", true)) return DialogFindPlayer("Dismounting");
	if ((PrevItem != null) && InventoryItemHasEffect(PrevItem, "Enclose", true)) return DialogFindPlayer("Escaping");
	if (PrevItem != null) return DialogFindPlayer("Removing");
	if ((PrevItem == null) && (NextItem != null) && (SkillGetRatio("Bondage") != 1)) return DialogFindPlayer("Using" + (SkillGetRatio("Bondage") * 100).toString());
	if (InventoryItemHasEffect(NextItem, "Lock", true)) return DialogFindPlayer("Locking");
	if ((PrevItem == null) && (NextItem != null)) return DialogFindPlayer("Adding");
	return "...";
}



/**
 * Handles the KeyDown event. The player can use the space bar to speed up the dialog progress, just like clicking.
 * Increases or decreases the struggle mini-game, if a/A or s/S were pressed.
 * @returns {void} - Nothing
 */
function StruggleKeyDown() {
	if (((KeyPress == 65) || (KeyPress == 83) || (KeyPress == 97) || (KeyPress == 115)) && (StruggleProgress >= 0) && (DialogColor == null) && (StruggleProgressCurrentMinigame == "Strength")) {
		StruggleStrength((StruggleProgressLastKeyPress == KeyPress));
		StruggleProgressLastKeyPress = KeyPress;
	}
}

/**
 * Handles the Click event. The player can use the space bar to speed up the dialog progress, just like clicking.
 * Increases or decreases the struggle mini-game, if a/A or s/S were pressed.
 * @returns {void} - Nothing
 */
function StruggleClick(Reverse) {
	if (StruggleProgressCurrentMinigame == "Strength") {if (CommonIsMobile) StruggleStrength(Reverse);}
	else if (StruggleProgressCurrentMinigame == "Flexibility") StruggleFlexibility(Reverse);
	else if (StruggleProgressCurrentMinigame == "Dexterity") StruggleDexterity(Reverse);
	else {
		if (MouseIn(1387-300, 600, 225, 275)) StruggleProgressCurrentMinigame = "Strength";
		else if (MouseIn(1387, 600, 225, 275)) StruggleProgressCurrentMinigame = "Flexibility";
		else if (MouseIn(1387+300, 600, 225, 275)) StruggleProgressCurrentMinigame = "Dexterity";

		if (StruggleProgressCurrentMinigame == "Strength") StruggleStrengthStart(Player, StruggleProgressChoosePrevItem, StruggleProgressChooseNextItem);
		else if (StruggleProgressCurrentMinigame == "Flexibility") StruggleFlexibilityStart(Player, StruggleProgressChoosePrevItem, StruggleProgressChooseNextItem);
		else if (StruggleProgressCurrentMinigame == "Dexterity") StruggleDexterityStart(Player, StruggleProgressChoosePrevItem, StruggleProgressChooseNextItem);
	}

}

function StruggleProgressStart(C, PrevItem, NextItem) {
	StruggleProgressChoosePrevItem = PrevItem;
	StruggleProgressChooseNextItem = NextItem;
	StruggleProgressCurrentMinigame = "";

	StruggleProgress = 0;
	DialogMenuButtonBuild(C);

	if (C != Player || PrevItem == null ||
		((PrevItem != null) && (!InventoryItemHasEffect(PrevItem, "Lock", true) || DialogCanUnlock(C, PrevItem)) && ((Player.CanInteract() && !InventoryItemHasEffect(PrevItem, "Mounted", true)) || StruggleStrengthGetDifficulty(C, PrevItem, NextItem).auto >= 0))) {
		StruggleProgressCurrentMinigame = "Strength";
		StruggleStrengthStart(C, StruggleProgressChoosePrevItem, StruggleProgressChooseNextItem);
	}

}

function StruggleProgressAutoDraw(C, Offset) {
	if (!Offset) Offset = 0;
	// Draw one or both items
	if ((StruggleProgressPrevItem != null) && (StruggleProgressNextItem != null)) {
		DrawAssetPreview(1200, 250 + Offset, StruggleProgressPrevItem.Asset);
		DrawAssetPreview(1575, 250 + Offset, StruggleProgressNextItem.Asset);
	} else DrawAssetPreview(1387, 250 + Offset, (StruggleProgressPrevItem != null) ? StruggleProgressPrevItem.Asset : StruggleProgressNextItem.Asset);

	// Add or subtract to the automatic progression, doesn't move in color picking mode
	StruggleProgress = StruggleProgress + StruggleProgressAuto;
	if (StruggleProgress < 0) StruggleProgress = 0;

	// We cancel out if at least one of the following cases apply: a new item conflicts with this, the player can no longer interact, something else was added first, the item was already removed
	if (InventoryGroupIsBlocked(C) || (C != Player && !Player.CanInteract()) || (StruggleProgressNextItem == null && !InventoryGet(C, StruggleProgressPrevItem.Asset.Group.Name)) || (StruggleProgressNextItem != null && !InventoryAllow(C, StruggleProgressNextItem.Asset.Prerequisite)) || (StruggleProgressNextItem != null && StruggleProgressPrevItem != null && ((InventoryGet(C, StruggleProgressPrevItem.Asset.Group.Name) && InventoryGet(C, StruggleProgressPrevItem.Asset.Group.Name).Asset.Name != StruggleProgressPrevItem.Asset.Name) || !InventoryGet(C, StruggleProgressPrevItem.Asset.Group.Name))) || (StruggleProgressNextItem != null && StruggleProgressPrevItem == null && InventoryGet(C, StruggleProgressNextItem.Asset.Group.Name))) {
		if (StruggleProgress > 0)
			ChatRoomPublishAction(C, StruggleProgressPrevItem, StruggleProgressNextItem, true, "interrupted");
		else
			DialogLeave();
		StruggleProgress = -1;
		DialogLockMenu = false;
		return;
	}
}

function StruggleProgressCheckEnd(C) {
	// If the operation is completed
	if (StruggleProgress >= 100) {

		// Stops the dialog sounds
		AudioDialogStop();

		// Removes the item & associated items if needed, then wears the new one
		InventoryRemove(C, C.FocusGroup.Name);
		if (StruggleProgressNextItem != null) InventoryWear(C, StruggleProgressNextItem.Asset.Name, StruggleProgressNextItem.Asset.Group.Name, (DialogColorSelect == null) ? "Default" : DialogColorSelect, SkillGetWithRatio("Bondage"), Player.MemberNumber);

		// The player can use another item right away, for another character we jump back to her reaction
		if (C.ID == 0) {
			if (StruggleProgressNextItem == null) SkillProgress("Evasion", StruggleProgressSkill);
			if ((StruggleProgressPrevItem == null) && (StruggleProgressNextItem != null)) SkillProgress("SelfBondage", (StruggleProgressSkill + StruggleProgressNextItem.Asset.SelfBondage) * 2);
			if ((StruggleProgressNextItem == null) || !StruggleProgressNextItem.Asset.Extended) {
				DialogInventoryBuild(C);
				StruggleProgress = -1;
				DialogColor = null;
			}
		} else {
			if (StruggleProgressNextItem != null) SkillProgress("Bondage", StruggleProgressSkill);
			if (((StruggleProgressNextItem == null) || !StruggleProgressNextItem.Asset.Extended) && (CurrentScreen != "ChatRoom")) {
				C.CurrentDialog = DialogFind(C, ((StruggleProgressNextItem == null) ? ("Remove" + StruggleProgressPrevItem.Asset.Name) : StruggleProgressNextItem.Asset.Name), ((StruggleProgressNextItem == null) ? "Remove" : "") + C.FocusGroup.Name);
				DialogLeaveItemMenu();
			}
		}

		// Check to open the extended menu of the item.  In a chat room, we publish the result for everyone
		if ((StruggleProgressNextItem != null) && StruggleProgressNextItem.Asset.Extended) {
			DialogInventoryBuild(C);
			ChatRoomPublishAction(C, StruggleProgressPrevItem, StruggleProgressNextItem, false);
			DialogExtendItem(InventoryGet(C, StruggleProgressNextItem.Asset.Group.Name));
		} else ChatRoomPublishAction(C, StruggleProgressPrevItem, StruggleProgressNextItem, true);

		// Reset the the character's position
		if (CharacterAppearanceForceUpCharacter == C.MemberNumber) {
			CharacterAppearanceForceUpCharacter = -1;
			CharacterRefresh(C, false);
		}

		// Rebuilds the menu
		DialogEndExpression();
		if (C.FocusGroup != null) DialogMenuButtonBuild(C);

	}
}

////////////////////////////STRUGGLE MINIGAME: BRUTE FORCE//////////////////////////////
/*
Featuring:
-Quick time events!
-Smooth gameplay!
-Innovative strategies!

Game description: Mash A and S until you get out
*/



/**
 * Draw the struggle dialog
 * @param {Character} C - The character for whom the struggle dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function StruggleDrawStrengthProgress(C) {
	StruggleProgressAutoDraw(C);

	// Draw the current operation and progress
	if (StruggleProgressAuto < 0) DrawText(DialogFindPlayer("Challenge") + " " + ((StruggleProgressStruggleCount >= 50) ? StruggleProgressChallenge.toString() : "???"), 1500, 150, "White", "Black");
	DrawText(StruggleProgressOperation, 1500, 650, "White", "Black");
	DrawProgressBar(1200, 700, 600, 100, StruggleProgress);
	if (ControllerActive == false) {
		DrawText(DialogFindPlayer((CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1500, 900, "White", "Black");
	}
	if (ControllerActive == true) {
		DrawText(DialogFindPlayer((CommonIsMobile) ? "ProgressClick" : "ProgressKeysController"), 1500, 900, "White", "Black");
	}

	StruggleProgressCheckEnd(C);
}



/**
 * Starts the dialog progress bar and keeps the items that needs to be added / swaped / removed.
 * The change of facial expressions during struggling is done here
 * @param {boolean} Reverse - If set to true, the progress is decreased
 * @returns {void} - Nothing
 */
function StruggleStrength(Reverse) {

	// Progress calculation
	var P = 42 / (StruggleProgressSkill * CheatFactor("DoubleItemSpeed", 0.5)); // Regular progress, slowed by long timers, faster with cheats
	P = P * (100 / (StruggleProgress + 50));  // Faster when the dialog starts, longer when it ends
	if ((StruggleProgressChallenge > 6) && (StruggleProgress > 50) && (StruggleProgressAuto < 0)) P = P * (1 - ((StruggleProgress - 50) / 50)); // Beyond challenge 6, it becomes impossible after 50% progress
	P = P * (Reverse ? -1 : 1); // Reverses the progress if the user pushed the same key twice

	// Sets the new progress and writes the "Impossible" message if we need to
	StruggleProgress = StruggleProgress + P;
	if (StruggleProgress < 0) StruggleProgress = 0;
	if ((StruggleProgress >= 100) && (StruggleProgressChallenge > 6) && (StruggleProgressAuto < 0)) StruggleProgress = 99;
	if (!Reverse) StruggleProgressStruggleCount++;
	if ((StruggleProgressStruggleCount >= 50) && (StruggleProgressChallenge > 6) && (StruggleProgressAuto < 0)) StruggleProgressOperation = DialogFindPlayer("Impossible");

	if (!Reverse && Player.OnlineSharedSettings.ItemsAffectExpressions) {
		// At 15 hit: low blush, 50: Medium and 125: High
		if (DialogAllowBlush) {
			if (StruggleProgressStruggleCount == 15) CharacterSetFacialExpression(Player, "Blush", "Low");
			if (StruggleProgressStruggleCount == 50) CharacterSetFacialExpression(Player, "Blush", "Medium");
			if (StruggleProgressStruggleCount == 125) CharacterSetFacialExpression(Player, "Blush", "High");
		}

		// At 15 hit: Start drooling
		if (DialogAllowFluids) {
			if (StruggleProgressStruggleCount == 15) CharacterSetFacialExpression(Player, "Fluids", "DroolMessy");
		}

		// Over 50 progress, the character frowns
		if (DialogAllowEyebrows) CharacterSetFacialExpression(Player, "Eyebrows", (StruggleProgress >= 50) ? "Angry" : null);
	}

}
/**
 * Starts the dialog progress bar for struggling out of bondage and keeps the items that needs to be added / swapped / removed.
 * First the challenge level is calculated based on the base item difficulty, the skill of the rigger and the escapee and modified, if
 * the escapee is bound in a way. Also blushing and drooling, as well as playing a sound is handled in this function.
 * @param {Character} C - The character who tries to struggle
 * @param {Item} PrevItem - The item, the character wants to struggle out of
 * @param {Item} [NextItem] - The item that should substitute the first one
 * @returns {{difficulty: number; auto: number; timer: number; }} - Nothing
 */
function StruggleStrengthGetDifficulty(C, PrevItem, NextItem) {
	var S = 0;
	if ((PrevItem != null) && (C.ID == 0)) {
		S = S + SkillGetWithRatio("Evasion"); // Add the player evasion level (modified by the effectiveness ratio)
		if (PrevItem.Difficulty != null) S = S - PrevItem.Difficulty; // Subtract the item difficulty (regular difficulty + player that restrained difficulty)
		if ((PrevItem.Property != null) && (PrevItem.Property.Difficulty != null)) S = S - PrevItem.Property.Difficulty; // Subtract the additional item difficulty for expanded items only
	}
	if ((C.ID != 0) || ((C.ID == 0) && (PrevItem == null))) S = S + SkillGetLevel(Player, "Bondage"); // Adds the bondage skill if no previous item or playing with another player
	if (Player.IsEnclose() || Player.IsMounted()) S = S - 2; // A little harder if there's an enclosing or mounting item
	if (InventoryItemHasEffect(PrevItem, "Lock", true) && !DialogCanUnlock(C, PrevItem)) S = S - 4; // Harder to struggle from a locked item

	// When struggling to remove or swap an item while being blocked from interacting
	if ((C.ID == 0) && !C.CanInteract() && (PrevItem != null)) {
		if (!InventoryItemHasEffect(PrevItem, "Block", true)) S = S - 4; // Non-blocking items become harder to struggle out when already blocked
		if ((PrevItem.Asset.Group.Name != "ItemArms") && InventoryItemHasEffect(InventoryGet(C, "ItemArms"), "Block", true)) S = S - 4; // Harder If we don't target the arms while arms are restrained
		if ((PrevItem.Asset.Group.Name != "ItemHands") && InventoryItemHasEffect(InventoryGet(C, "ItemHands"), "Block", true)) S = S - 4; // Harder If we don't target the hands while hands are restrained
		if ((PrevItem.Asset.Group.Name != "ItemMouth") && (PrevItem.Asset.Group.Name != "ItemMouth2") && (PrevItem.Asset.Group.Name != "ItemMouth3") && (PrevItem.Asset.Group.Name != "ItemHead") && (PrevItem.Asset.Group.Name != "ItemHood") && !C.CanTalk()) S = S - 2; // A little harder if we don't target the head while gagged
		if ((ChatRoomStruggleAssistTimer >= CurrentTime) && (ChatRoomStruggleAssistBonus >= 1) && (ChatRoomStruggleAssistBonus <= 6)) S = S + ChatRoomStruggleAssistBonus; // If assisted by another player, the player can get a bonus to struggle out
	}

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

	return {difficulty: S, auto: TimerRunInterval * (0.22 + (((S <= -10) ? -9 : S) * 0.11)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5)), timer: Timer};
}

/**
 * Starts the dialog progress bar for struggling out of bondage and keeps the items that needs to be added / swapped / removed.
 * First the challenge level is calculated based on the base item difficulty, the skill of the rigger and the escapee and modified, if
 * the escapee is bound in a way. Also blushing and drooling, as well as playing a sound is handled in this function.
 * @param {Character} C - The character who tries to struggle
 * @param {Item} PrevItem - The item, the character wants to struggle out of
 * @param {Item} [NextItem] - The item that should substitute the first one
 * @returns {void} - Nothing
 */
function StruggleStrengthStart(C, PrevItem, NextItem) {

	// Gets the required skill / challenge level based on player/rigger skill and item difficulty (0 by default is easy to struggle out)
	var StruggleDiff = StruggleStrengthGetDifficulty(C, PrevItem, NextItem);
	var S = StruggleDiff.difficulty;


	// Prepares the progress bar and timer
	StruggleProgress = 0;
	StruggleProgressAuto = StruggleDiff.auto;  // S: -9 is floor level to always give a false hope
	StruggleProgressPrevItem = PrevItem;
	StruggleProgressNextItem = NextItem;
	StruggleProgressOperation = StruggleProgressGetOperation(C, PrevItem, NextItem);
	StruggleProgressSkill = StruggleDiff.timer;
	StruggleProgressChallenge = S * -1;
	StruggleProgressLastKeyPress = 0;
	StruggleProgressStruggleCount = 0;
	DialogItemToLock = null;
	DialogMenuButtonBuild(C);

	// The progress bar will not go down if the player can use her hands for a new item, or if she has the key for the locked item
	if ((StruggleProgressAuto < 0) && Player.CanInteract() && (PrevItem == null)) StruggleProgressAuto = 0;
	if ((StruggleProgressAuto < 0) && Player.CanInteract() && (PrevItem != null) && (!InventoryItemHasEffect(PrevItem, "Lock", true) || DialogCanUnlock(C, PrevItem)) && !InventoryItemHasEffect(PrevItem, "Mounted", true)) StruggleProgressAuto = 0;

	// Roleplay users can bypass the struggle mini-game with a toggle
	if ((CurrentScreen == "ChatRoom") && ((StruggleProgressChallenge <= 6) || (StruggleProgressAuto >= 0)) && Player.RestrictionSettings.BypassStruggle) {
		StruggleProgressAuto = 1;
		StruggleProgressSkill = 5;
	}

	// If there's no current blushing, we update the blushing state while struggling
	DialogAllowBlush = ((StruggleProgressAuto < 0) && (StruggleProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Blush") == null) || (InventoryGet(C, "Blush").Property == null) || (InventoryGet(C, "Blush").Property.Expression == null)));
	DialogAllowEyebrows = ((StruggleProgressAuto < 0) && (StruggleProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Eyebrows") == null) || (InventoryGet(C, "Eyebrows").Property == null) || (InventoryGet(C, "Eyebrows").Property.Expression == null)));
	DialogAllowFluids = ((StruggleProgressAuto < 0) && (StruggleProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Fluids") == null) || (InventoryGet(C, "Fluids").Property == null) || (InventoryGet(C, "Fluids").Property.Expression == null)));

	// Applying or removing specific items can trigger an audio sound to play
	if ((PrevItem && PrevItem.Asset) || (NextItem && NextItem.Asset)) {
		var AudioFile = null;
		if (NextItem && NextItem.Asset) {
			AudioFile = NextItem.Asset.DynamicAudio ? NextItem.Asset.DynamicAudio(C) : NextItem.Asset.Audio;
		} else {
			AudioFile = PrevItem.Asset.DynamicAudio ? PrevItem.Asset.DynamicAudio(C) : PrevItem.Asset.Audio;
		}
		if (AudioFile != null) AudioDialogStart("Audio/" + AudioGetFileName(AudioFile) + ".mp3");
	}

}







////////////////////////////STRUGGLE MINIGAME: USE FLEXIBILITY//////////////////////////////
/*
Represents squeezing out of a restraint by being limber or having good leverage

Does not get more difficult with a lock on the item
Tightness of the item has extra weight

Game description:
*/


/**
 * Starts the dialog progress bar for struggling out of bondage and keeps the items that needs to be added / swapped / removed.
 * First the challenge level is calculated based on the base item difficulty, the skill of the rigger and the escapee and modified, if
 * the escapee is bound in a way. Also blushing and drooling, as well as playing a sound is handled in this function.
 * @param {Character} C - The character who tries to struggle
 * @param {Item} PrevItem - The item, the character wants to struggle out of
 * @param {Item} [NextItem] - The item that should substitute the first one
 * @returns {void} - Nothing
 */
function StruggleFlexibilityStart(C, PrevItem, NextItem) {

	// Gets the required skill / challenge level based on player/rigger skill and item difficulty (0 by default is easy to struggle out)
	var S = 0;
	if ((PrevItem != null) && (C.ID == 0)) {
		S = S + SkillGetWithRatio("Evasion"); // Add the player evasion level (modified by the effectiveness ratio)
		if (PrevItem.Difficulty != null) S = S - PrevItem.Difficulty; // Subtract the item difficulty (regular difficulty + player that restrained difficulty)
		if ((PrevItem.Property != null) && (PrevItem.Property.Difficulty != null)) S = S - PrevItem.Property.Difficulty; // Subtract the additional item difficulty for expanded items only
	}
	if ((C.ID != 0) || ((C.ID == 0) && (PrevItem == null))) S = S + SkillGetLevel(Player, "Bondage"); // Adds the bondage skill if no previous item or playing with another player
	if (Player.IsEnclose() || Player.IsMounted()) S = S - 4; // Harder if there's an enclosing or mounting item
	if (InventoryItemHasEffect(PrevItem, "Lock", true) && !DialogCanUnlock(C, PrevItem)) S = S - 2; // Locking the item has less effect on flexibility escapes

	// When struggling to remove or swap an item while being blocked from interacting
	if ((C.ID == 0) && !C.CanInteract() && (PrevItem != null)) {
		if (!InventoryItemHasEffect(PrevItem, "Block", true)) S = S - 4; // Non-blocking items become harder to struggle out when already blocked
		if (PrevItem.Asset.Category) {
			if (PrevItem.Asset.Fetish.includes("Metal")) S = S - 2; // Metal items are very inflexible
			if (PrevItem.Asset.Fetish.includes("Latex")) S = S + 1; // Latex items are flexible
			if (PrevItem.Asset.Fetish.includes("Nylon")) S = S + 2; // Nylon items are very flexible
		}
		if ((PrevItem.Asset.Group.Name != "ItemArms") && InventoryItemHasEffect(InventoryGet(C, "ItemArms"), "Block", true)) S = S - 4; // Harder If we don't target the arms while arms are restrained
		if ((PrevItem.Asset.Group.Name != "ItemLegs") && InventoryItemHasEffect(InventoryGet(C, "ItemLegs"), "Block", true)) S = S - 4; // Harder If we don't target the legs while arms are restrained
		if ((PrevItem.Asset.Group.Name != "ItemHands") && InventoryItemHasEffect(InventoryGet(C, "ItemHands"), "Block", true)) S = S - 1; // Harder If we don't target the hands while hands are restrained
		if ((PrevItem.Asset.Group.Name != "ItemFeet") && InventoryItemHasEffect(InventoryGet(C, "ItemFeet"), "Block", true)) S = S - 2; // Harder if you can't split your feet apart

		if ((PrevItem.Asset.Group.Name == "ItemMouth") || (PrevItem.Asset.Group.Name == "ItemMouth2") || (PrevItem.Asset.Group.Name == "ItemMouth3") || (PrevItem.Asset.Group.Name == "ItemNeck") || (PrevItem.Asset.Group.Name == "ItemHood")) S = S - 4; // The head is not very flexible


		if ((ChatRoomStruggleAssistTimer >= CurrentTime) && (ChatRoomStruggleAssistBonus >= 1) && (ChatRoomStruggleAssistBonus <= 6)) S = S + ChatRoomStruggleAssistBonus; // If assisted by another player, the player can get a bonus to struggle out
	}

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
	StruggleProgress = 0;
	StruggleProgressAuto = TimerRunInterval * (0.22 + (((S <= -10) ? -9 : S) * 0.11)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));  // S: -9 is floor level to always give a false hope
	StruggleProgressPrevItem = PrevItem;
	StruggleProgressNextItem = NextItem;
	StruggleProgressOperation = StruggleProgressGetOperation(C, PrevItem, NextItem);
	StruggleProgressSkill = Timer;
	StruggleProgressChallenge = S * -1;
	StruggleProgressStruggleCount = 0;
	DialogItemToLock = null;
	DialogMenuButtonBuild(C);


	StruggleProgressFlexCircles = [];
	StruggleProgressFlexTimer = 0;

	// The progress bar will not go down if the player can use her hands for a new item, or if she has the key for the locked item
	if ((StruggleProgressAuto < 0) && Player.CanInteract() && (PrevItem == null)) StruggleProgressAuto = 0;
	if ((StruggleProgressAuto < 0) && Player.CanInteract() && (PrevItem != null) && (!InventoryItemHasEffect(PrevItem, "Lock", true) || DialogCanUnlock(C, PrevItem)) && !InventoryItemHasEffect(PrevItem, "Mounted", true)) StruggleProgressAuto = 0;

	// Roleplay users can bypass the struggle mini-game with a toggle
	if ((CurrentScreen == "ChatRoom") && ((StruggleProgressChallenge <= 6) || (StruggleProgressAuto >= 0)) && Player.RestrictionSettings.BypassStruggle) {
		StruggleProgressAuto = 1;
		StruggleProgressSkill = 5;
	}

	// If there's no current blushing, we update the blushing state while struggling
	DialogAllowBlush = ((StruggleProgressAuto < 0) && (StruggleProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Blush") == null) || (InventoryGet(C, "Blush").Property == null) || (InventoryGet(C, "Blush").Property.Expression == null)));
	DialogAllowEyebrows = ((StruggleProgressAuto < 0) && (StruggleProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Eyebrows") == null) || (InventoryGet(C, "Eyebrows").Property == null) || (InventoryGet(C, "Eyebrows").Property.Expression == null)));
	DialogAllowFluids = ((StruggleProgressAuto < 0) && (StruggleProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Fluids") == null) || (InventoryGet(C, "Fluids").Property == null) || (InventoryGet(C, "Fluids").Property.Expression == null)));

	// Applying or removing specific items can trigger an audio sound to play
	if ((PrevItem && PrevItem.Asset) || (NextItem && NextItem.Asset)) {
		var AudioFile = (NextItem && NextItem.Asset) ? NextItem.Asset.Audio : PrevItem.Asset.Audio;
		if (AudioFile != null) AudioDialogStart("Audio/" + AudioGetFileName(AudioFile) + ".mp3");
	}

}

/**
 * Draw the struggle dialog
 * @param {Character} C - The character for whom the struggle dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function StruggleDrawFlexibilityProgress(C) {

	if (StruggleProgressFlexTimer < CurrentTime) {
		StruggleProgressFlexTimer = CurrentTime + StruggleProgressFlexCirclesRate + StruggleProgressFlexCirclesRate * Math.random();
		StruggleProgressFlexCircles.push({
			X: Math.random()*StruggleProgressFlexMaxX*2 - StruggleProgressFlexMaxX,
			Y: -StruggleProgressFlexMaxY,
			Size: 37 + Math.floor(Math.random() * 50),
			Velocity: Math.random()*3 + 1,
		});
	}

	for (let RR = 0; RR < StruggleProgressFlexCircles.length; RR++) {
		let R = StruggleProgressFlexCircles[RR];
		if (R.X && R.Y && R.Size) {
			DrawImageResize("Icons/Struggle/Rope.png", 1485 + R.X - R.Size, 625+ R.Y - R.Size, R.Size*2, R.Size*2);
		}

		if (R.Y && R.Velocity)
			R.Y += (R.Velocity + Math.max(0, -StruggleProgressAuto));
	}

	for (let RR = 0; RR < StruggleProgressFlexCircles.length; RR++) {
		let R = StruggleProgressFlexCircles[RR];
		if (R.Y > StruggleProgressFlexMaxY) {
			if (!((CurrentScreen == "ChatRoom") && ((StruggleProgressChallenge <= 6) || (StruggleProgressAuto >= 0)) && Player.RestrictionSettings.BypassStruggle))
				StruggleFlexibility(true);
			StruggleProgressFlexCircles.splice(RR,1);
			break;
		}
	}

	if (StruggleFlexibilityCheck()) {
		StruggleFlexibility(false, true);
	}

	StruggleProgressAutoDraw(C, -150);

	// Draw the current operation and progress
	if (StruggleProgressAuto < 0) DrawText(DialogFindPlayer("Challenge") + " " + ((StruggleProgressStruggleCount >= 50) ? StruggleProgressChallenge.toString() : "???"), 1500, 425, "White", "Black");
	DrawText(StruggleProgressOperation, 1500, 476, "White", "Black");
	DrawProgressBar(1200, 800, 600, 100, StruggleProgress);
	DrawText(DialogFindPlayer("ProgressFlex"), 1500, 950, "White", "Black");

	StruggleProgressCheckEnd(C);
}


/**
 * Checks for collision with the mouse
 * @returns {boolean} - Result of check
 */
function StruggleFlexibilityCheck() {

	for (let RR = 0; RR < StruggleProgressFlexCircles.length; RR++) {
		var R = StruggleProgressFlexCircles[RR];

		if (R.X && R.Y && R.Size) {
			var Smod = (CommonIsMobile) ? 1.0 : 0.5;
			if (MouseIn(1485 + R.X - R.Size*Smod, 625 + R.Y - R.Size*Smod, R.Size*2*Smod, R.Size*2*Smod)) {
				StruggleProgressFlexCircles.splice(RR,1);
				return true;
			}
		}
	}
	return false;
}

/**
 * Starts the dialog progress bar and keeps the items that needs to be added / swaped / removed.
 * The change of facial expressions during struggling is done here
 * @param {boolean} Reverse - If set to true, the progress is decreased
 * @returns {void} - Nothing
 */
function StruggleFlexibility(Reverse, Hover) {

	if (!Reverse && !Hover) {
		if (!StruggleFlexibilityCheck()) return;
	}

	// Progress calculation
	var P = 60 / (StruggleProgressSkill/3 * CheatFactor("DoubleItemSpeed", 0.5)); // Regular progress, slowed by long timers, faster with cheats

	if ((StruggleProgressChallenge > 6) && (StruggleProgress > 50) && (StruggleProgressAuto < 0)) P = P * (1 - ((StruggleProgress - 50) / 50)); // Beyond challenge 6, it becomes impossible after 50% progress
	P = P * (Reverse ? -1 : 1); // Reverses the progress if the user pushed the same key twice

	// Sets the new progress and writes the "Impossible" message if we need to
	StruggleProgress = StruggleProgress + P;
	if (StruggleProgress < 0) StruggleProgress = 0;
	if ((StruggleProgress >= 100) && (StruggleProgressChallenge > 6) && (StruggleProgressAuto < 0)) StruggleProgress = 99;
	if (!Reverse) StruggleProgressStruggleCount += 3;
	if ((StruggleProgressStruggleCount >= 50) && (StruggleProgressChallenge > 6) && (StruggleProgressAuto < 0)) StruggleProgressOperation = DialogFindPlayer("Impossible");

	if (!Reverse && Player.OnlineSharedSettings.ItemsAffectExpressions) {
		// At 15 hit: low blush, 50: Medium and 125: High
		if (DialogAllowBlush) {
			if (StruggleProgressStruggleCount == 15) CharacterSetFacialExpression(Player, "Blush", "Low");
			if (StruggleProgressStruggleCount == 50) CharacterSetFacialExpression(Player, "Blush", "Medium");
			if (StruggleProgressStruggleCount == 125) CharacterSetFacialExpression(Player, "Blush", "High");
		}

		// At 25 hit: Start one eye closed
		if (DialogAllowFluids) {
			if (StruggleProgressStruggleCount == 25) CharacterSetFacialExpression(Player, "Eyes2", "Closed");
		}

		// Over 50 progress, the character frowns
		if (DialogAllowEyebrows) CharacterSetFacialExpression(Player, "Eyebrows", (StruggleProgress >= 50) ? "Angry" : null);
	}

}

////////////////////////////STRUGGLE MINIGAME: DEXTERITY//////////////////////////////
/*
Represents using a sharp object or corner to undo the buckles on a restraint
Much easier if you have legs, arms, hands, toes, or mouth free than brute force
Much harder if you have neither
Extremely ineffective if there is a lock on the item

Game description:
*/



/**
 * Starts the dialog progress bar for struggling out of bondage and keeps the items that needs to be added / swapped / removed.
 * First the challenge level is calculated based on the base item difficulty, the skill of the rigger and the escapee and modified, if
 * the escapee is bound in a way. Also blushing and drooling, as well as playing a sound is handled in this function.
 * @param {Character} C - The character who tries to struggle
 * @param {Item} PrevItem - The item, the character wants to struggle out of
 * @param {Item} [NextItem] - The item that should substitute the first one
 * @returns {void} - Nothing
 */
function StruggleDexterityStart(C, PrevItem, NextItem) {

	// Gets the required skill / challenge level based on player/rigger skill and item difficulty (0 by default is easy to struggle out)
	var S = 0;
	if ((PrevItem != null) && (C.ID == 0)) {
		S = S + SkillGetWithRatio("Evasion"); // Add the player evasion level (modified by the effectiveness ratio)
		if (PrevItem.Difficulty != null) S = S - PrevItem.Difficulty; // Subtract the item difficulty (regular difficulty + player that restrained difficulty)
		if ((PrevItem.Property != null) && (PrevItem.Property.Difficulty != null)) S = S - PrevItem.Property.Difficulty; // Subtract the additional item difficulty for expanded items only
	}
	if ((C.ID != 0) || ((C.ID == 0) && (PrevItem == null))) S = S + SkillGetLevel(Player, "Bondage"); // Adds the bondage skill if no previous item or playing with another player
	if (Player.IsEnclose() || Player.IsMounted()) S = S - 1; // A little harder if there's an enclosing or mounting item
	if (InventoryItemHasEffect(PrevItem, "Lock", true) && !DialogCanUnlock(C, PrevItem)) S = S - 12; // Very hard to struggle from a locked item

	// When struggling to remove or swap an item while being blocked from interacting
	if ((C.ID == 0) && !C.CanInteract() && (PrevItem != null)) {
		if (!InventoryItemHasEffect(PrevItem, "Block", true)) S = S - 2; // Non-blocking items become slightly harder to struggle out when already blocked

		if (PrevItem.Asset.Category) {
			if (PrevItem.Asset.Fetish.includes("Tape")) S = S - 3; // Tape is pretty hard to unfasten
		}

		var blockedAreas = 0;

		if (InventoryItemHasEffect(InventoryGet(C, "ItemArms"), "Block", true) || InventoryGroupIsBlocked(Player, "ItemArms")) {S = S - 2; blockedAreas += 1;} // Harder if arms are blocked
		if (InventoryItemHasEffect(InventoryGet(C, "ItemLegs"), "Block", true) || InventoryGroupIsBlocked(Player, "ItemLegs")) blockedAreas += 1;
		if (InventoryItemHasEffect(InventoryGet(C, "ItemHands"), "Block", true) || InventoryGroupIsBlocked(Player, "ItemHands")) blockedAreas += 1;
		if (!C.CanTalk()) blockedAreas += 1;
		if (InventoryItemHasEffect(InventoryGet(C, "ItemFeet"), "Block", true) || InventoryGroupIsBlocked(Player, "ItemFeet")) blockedAreas += 1;
		if (InventoryItemHasEffect(InventoryGet(C, "ItemBoots"), "Block", true) || InventoryGroupIsBlocked(Player, "ItemBoots")) blockedAreas += 1;

		if (blockedAreas >= 1) S = S - 1; // Little bit harder if only one area is blocked, but you can still manipulate using other parts...
		if (blockedAreas >= 2) S = S - 2; // But wait, it gets harder...
		if (blockedAreas >= 3) S = S - 3; // And harder....
		if (blockedAreas >= 4) S = S - 4; // After a certain point it's pointless
		if (blockedAreas >= 5) S = S - 5; // After a certain point it's pointless

		if (Player.IsBlind()) S = S - 2; // Harder if blind
		if ((ChatRoomStruggleAssistTimer >= CurrentTime) && (ChatRoomStruggleAssistBonus >= 1) && (ChatRoomStruggleAssistBonus <= 6)) S = S + ChatRoomStruggleAssistBonus; // If assisted by another player, the player can get a bonus to struggle out
	}

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
	StruggleProgress = 0;
	StruggleProgressAuto = TimerRunInterval * (0.22 + (((S <= -10) ? -9 : S) * 0.11)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));  // S: -9 is floor level to always give a false hope
	StruggleProgressPrevItem = PrevItem;
	StruggleProgressNextItem = NextItem;
	StruggleProgressOperation = StruggleProgressGetOperation(C, PrevItem, NextItem);
	StruggleProgressSkill = Timer;
	StruggleProgressChallenge = S * -1;
	StruggleProgressStruggleCount = 0;
	DialogItemToLock = null;
	DialogMenuButtonBuild(C);


	StruggleProgressDexTarget = Math.random() * 2 * StruggleProgressDexMax - StruggleProgressDexMax;
	StruggleProgressDexCurrent = 0;
	StruggleProgressDexDirectionRight = false;

	// The progress bar will not go down if the player can use her hands for a new item, or if she has the key for the locked item
	if ((StruggleProgressAuto < 0) && Player.CanInteract() && (PrevItem == null)) StruggleProgressAuto = 0;
	if ((StruggleProgressAuto < 0) && Player.CanInteract() && (PrevItem != null) && (!InventoryItemHasEffect(PrevItem, "Lock", true) || DialogCanUnlock(C, PrevItem)) && !InventoryItemHasEffect(PrevItem, "Mounted", true)) StruggleProgressAuto = 0;

	// Roleplay users can bypass the struggle mini-game with a toggle
	if ((CurrentScreen == "ChatRoom") && ((StruggleProgressChallenge <= 6) || (StruggleProgressAuto >= 0)) && Player.RestrictionSettings.BypassStruggle) {
		StruggleProgressAuto = 1;
		StruggleProgressSkill = 5;
	}

	// If there's no current blushing, we update the blushing state while struggling
	DialogAllowBlush = ((StruggleProgressAuto < 0) && (StruggleProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Blush") == null) || (InventoryGet(C, "Blush").Property == null) || (InventoryGet(C, "Blush").Property.Expression == null)));
	DialogAllowEyebrows = ((StruggleProgressAuto < 0) && (StruggleProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Eyebrows") == null) || (InventoryGet(C, "Eyebrows").Property == null) || (InventoryGet(C, "Eyebrows").Property.Expression == null)));
	DialogAllowFluids = ((StruggleProgressAuto < 0) && (StruggleProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Fluids") == null) || (InventoryGet(C, "Fluids").Property == null) || (InventoryGet(C, "Fluids").Property.Expression == null)));

	// Applying or removing specific items can trigger an audio sound to play
	if ((PrevItem && PrevItem.Asset) || (NextItem && NextItem.Asset)) {
		var AudioFile = (NextItem && NextItem.Asset) ? NextItem.Asset.Audio : PrevItem.Asset.Audio;
		if (AudioFile != null) AudioDialogStart("Audio/" + AudioGetFileName(AudioFile) + ".mp3");
	}

}

/**
 * Draw the struggle dialog
 * @param {Character} C - The character for whom the struggle dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function StruggleDrawDexterityProgress(C) {
	StruggleProgressAutoDraw(C);


	DrawImageResize("Icons/Struggle/Buckle.png", 1420 + StruggleProgressDexTarget, 625, 150, 150);
	DrawImageResize("Icons/Struggle/Player.png", 1420 + StruggleProgressDexCurrent, 625, 150, 150);

	var speed = (5 + Math.max(0, -StruggleProgressAuto*7));

	StruggleProgressDexCurrent += (StruggleProgressDexDirectionRight) ? speed : -speed;

	if (StruggleProgressDexCurrent > StruggleProgressDexMax) {
		StruggleProgressDexCurrent = StruggleProgressDexMax;
		StruggleProgressDexDirectionRight = false;
	}
	if (StruggleProgressDexCurrent < -StruggleProgressDexMax) {
		StruggleProgressDexCurrent = -StruggleProgressDexMax;
		StruggleProgressDexDirectionRight = true;
	}



	// Draw the current operation and progress
	if (StruggleProgressAuto < 0) DrawText(DialogFindPlayer("Challenge") + " " + ((StruggleProgressStruggleCount >= 50) ? StruggleProgressChallenge.toString() : "???"), 1500, 150, "White", "Black");
	DrawText(StruggleProgressOperation, 1500, 600, "White", "Black");
	DrawProgressBar(1200, 800, 600, 100, StruggleProgress);
	DrawText(DialogFindPlayer("ProgressDex"), 1500, 950, "White", "Black");

	StruggleProgressCheckEnd(C);
}



/**
 * Starts the dialog progress bar and keeps the items that needs to be added / swaped / removed.
 * The change of facial expressions during struggling is done here
 * @param {boolean} Reverse - If set to true, the progress is decreased
 * @returns {void} - Nothing
 */
function StruggleDexterity(Reverse) {


	// Progress calculation
	var P = 200 / (StruggleProgressSkill/3.5 * CheatFactor("DoubleItemSpeed", 0.5)); // Regular progress, slowed by long timers, faster with cheats
	if ((StruggleProgressChallenge > 6) && (StruggleProgress > 50) && (StruggleProgressAuto < 0)) P = P * (1 - ((StruggleProgress - 50) / 50)); // Beyond challenge 6, it becomes impossible after 50% progress
	var distMult = Math.max(-0.5, Math.min(1, (85 - Math.abs(StruggleProgressDexTarget - StruggleProgressDexCurrent))/75));
	P = P * distMult; // Reverses the progress if too far

	if (P > 0) {
		StruggleProgressDexTarget = Math.random() * 2 * StruggleProgressDexMax - StruggleProgressDexMax;
	}

	// Sets the new progress and writes the "Impossible" message if we need to
	StruggleProgress = StruggleProgress + P;
	if (StruggleProgress < 0) StruggleProgress = 0;
	if ((StruggleProgress >= 100) && (StruggleProgressChallenge > 6) && (StruggleProgressAuto < 0)) StruggleProgress = 99;
	StruggleProgressStruggleCount += Math.max(1, 3*(distMult + 0.5));
	if ((StruggleProgressStruggleCount >= 50) && (StruggleProgressChallenge > 6) && (StruggleProgressAuto < 0)) StruggleProgressOperation = DialogFindPlayer("Impossible");

	if (Player.OnlineSharedSettings.ItemsAffectExpressions) {
		// At 15 hit: low blush, 50: Medium and 125: High
		if (DialogAllowBlush) {
			if (StruggleProgressStruggleCount == 15) CharacterSetFacialExpression(Player, "Blush", "Low");
			if (StruggleProgressStruggleCount == 50) CharacterSetFacialExpression(Player, "Blush", "Medium");
			if (StruggleProgressStruggleCount == 125) CharacterSetFacialExpression(Player, "Blush", "High");
		}

		// At 25 hit: Eyes look glazed
		if (DialogAllowFluids) {
			if (StruggleProgressStruggleCount == 25) CharacterSetFacialExpression(Player, "Eyes", "Dazed");
		}

		// Over 50 progress, the character frowns
		if (DialogAllowEyebrows) CharacterSetFacialExpression(Player, "Eyebrows", (StruggleProgress >= 50) ? "Angry" : null);
	}

}


////////////////////////////STRUGGLE MINIGAME: LOCK PICKING//////////////////////////////
/*
Game description: There is a persistent, correct combination which you must find. You have to set the pins in order, but many pins will set falsely, and you will only discover this after attempting to set other pins.
Meanwhile, you have a limited number of pin uses before you have to restart. Restart too many times, and you will become tired for 30s and be unable to pick during that time!

Only applies to locks at the moment
*/



/**
 * Advances the lock picking dialog
 * @returns {void} - Nothing
 */
function StruggleLockPickClick(C) {
	var X = 1475;
	var Y = 500;
	var PinSpacing = 100;
	var PinWidth = 200;
	var PinHeight = 200;
	var skill = Math.min(10, SkillGetWithRatio("LockPicking"));
	var current_pins = StruggleLockPickSet.filter(x => x==true).length;
	var false_set_chance = 0.75 - 0.15 * skill/10;
	var unset_false_set_chance = 0.1 + 0.1 * skill/10;
	if (current_pins < StruggleLockPickSet.length && LogValue("FailedLockPick", "LockPick") < CurrentTime)
		for (let P = 0; P < StruggleLockPickSet.length; P++) {
			if (!StruggleLockPickSet[P]) {
				var XX = X - PinWidth/2 + (0.5-StruggleLockPickSet.length/2 + P) * PinSpacing;
				if (MouseIn(XX + PinSpacing/2, Y - PinHeight, PinSpacing, PinWidth+PinHeight)) {
					if (StruggleLockPickProgressCurrentTries < StruggleLockPickProgressMaxTries) {

						if (StruggleLockPickOrder[current_pins] == P && StruggleLockPickImpossiblePins.filter(x => x==P).length == 0) {
							// Successfully set the pin
							StruggleLockPickSet[P] = true;
							StruggleLockPickArousalText = ""; // Reset arousal text
							// We also unset any false set pins
							if (current_pins+1 < StruggleLockPickOrder.length && StruggleLockPickSetFalse[StruggleLockPickOrder[current_pins+1]] == true) {
								StruggleLockPickSetFalse[StruggleLockPickOrder[current_pins+1]] = false;
								StruggleLockPickProgressCurrentTries += 1;
							}
						} else {
							StruggleLockPickTotalTries += 1;
							// There is a chance we false set
							if (Math.random() < false_set_chance && StruggleLockPickImpossiblePins.filter(x => x==P).length == 0) {
								StruggleLockPickSetFalse[P] = true;
							} else if (StruggleLockPickSetFalse[P] == false) {
							// Otherwise: fail
								StruggleLockPickProgressCurrentTries += 1;
							}
						}
						if (StruggleLockPickProgressCurrentTries < StruggleLockPickProgressMaxTries) {
							for (let PP = 0; PP < StruggleLockPickSetFalse.length; PP++) {
								if (P != PP && StruggleLockPickSetFalse[PP] == true && Math.random() < unset_false_set_chance) {
									StruggleLockPickSetFalse[PP] = false;
									StruggleLockPickProgressCurrentTries += 1;
									break;
								}
							}
						}
						var order = Math.max(0, StruggleLockPickOrder.indexOf(P)-current_pins)/Math.max(1, StruggleLockPickSet.length-current_pins) * (0.25+0.75*skill/10); // At higher skills you can see which pins are later in the order
						StruggleLockPickOffsetTarget[P] = (StruggleLockPickSet[P] || StruggleLockPickSetFalse[P]) ? PinHeight : PinHeight*(0.1+0.8*order);

						if (StruggleLockPickProgressCurrentTries == StruggleLockPickProgressMaxTries && StruggleLockPickSet.filter(x => x==false).length > 0 ) {
							SkillProgress("LockPicking", StruggleLockPickProgressSkillLose);

						}
					}




					break;
				}
			}
		}

	if (current_pins >= StruggleLockPickSet.length - 1 && StruggleLockPickSet.filter(x => x==false).length == 0 ) {
		StruggleLockPickSuccessTime = CurrentTime + 1000;
	}
}


/**
var StruggleLockPickOrder = null;
var StruggleLockPickSet = null;
var StruggleLockPickImpossiblePins = null;
var StruggleLockPickProgressItem = null;
var StruggleLockPickProgressOperation = "";
var StruggleLockPickProgressSkill = 0;
var StruggleLockPickProgressChallenge = 0;
var StruggleLockPickProgressMaxTries = 0;
var StruggleLockPickProgressCurrentTries = 0;
 * Draw the lockpicking dialog
 * @param {Character} C - The character for whom the lockpicking dialog is drawn. That can be the player or another character.
 * @returns {void} - Nothing
 */
function StruggleDrawLockpickProgress(C) {
	// Place where to draw the pins
	var X = 1475;
	var Y = 500;
	var PinSpacing = 100;
	var PinWidth = 200;
	var PinHeight = 200;
	for (let P = 0; P < StruggleLockPickSet.length; P++) {
		var XX = X - PinWidth/2 + (0.5-StruggleLockPickSet.length/2 + P) * PinSpacing;

		if (StruggleLockPickOffset[P] < StruggleLockPickOffsetTarget[P]) {

			if ( StruggleLockPickOffsetTarget[P] == 0)
				StruggleLockPickOffset[P] = 0;
			else
				StruggleLockPickOffset[P] += 1 + Math.abs(StruggleLockPickOffsetTarget[P] - StruggleLockPickOffset[P])/4;
		}
		if (StruggleLockPickOffset[P] >= StruggleLockPickOffsetTarget[P]) {
			if (StruggleLockPickOffsetTarget[P] != 0)
				StruggleLockPickOffset[P] = StruggleLockPickOffsetTarget[P];
			if (StruggleLockPickOffsetTarget[P] != PinHeight || (!StruggleLockPickSetFalse[P] && !StruggleLockPickSet[P])) {
				StruggleLockPickOffsetTarget[P] = 0;
				StruggleLockPickOffset[P] -= 1 + Math.abs(StruggleLockPickOffsetTarget[P] - StruggleLockPickOffset[P])/8;
			}
		}

		DrawImageResize("Screens/MiniGame/Lockpick/Cylinder.png", XX, Y - PinHeight, PinWidth, PinWidth + PinHeight);
		DrawImageResize("Screens/MiniGame/Lockpick/Pin.png", XX, Y - StruggleLockPickOffset[P], PinWidth, PinWidth);
		if (MouseIn(XX + PinSpacing/2, Y - PinHeight, PinSpacing, PinWidth+PinHeight))
			DrawImageResize("Screens/MiniGame/Lockpick/Arrow.png", XX, Y + 25, PinWidth, PinWidth);
	}


	DrawText(DialogFindPlayer("LockpickTriesRemaining") + (StruggleLockPickProgressMaxTries - StruggleLockPickProgressCurrentTries), X, 212, "white");
	if (LogValue("FailedLockPick", "LockPick") > CurrentTime)
		DrawText(DialogFindPlayer("LockpickFailedTimeout") + TimerToString(LogValue("FailedLockPick", "LockPick") - CurrentTime), X, 262, "red");
	else {
		if (StruggleLockPickProgressCurrentTries >= StruggleLockPickProgressMaxTries && StruggleLockPickSuccessTime == 0) {
			if (StruggleLockPickFailTime > 0) {
				if (StruggleLockPickFailTime < CurrentTime) {
					StruggleLockPickFailTime = 0;

					StruggleLockPickProgressStart(C, StruggleLockPickItem);

				}
				else {
					DrawText(DialogFindPlayer("LockpickFailed"), X, 262, "red");
				}
			} else if (Math.random() < 0.25 && StruggleLockPickTotalTries > 5) { // StruggleLockPickTotalTries is meant to give players a bit of breathing room so they don't get tired right away
				if (DialogLentLockpicks)  {
					DialogLentLockpicks = false;
					if (CurrentScreen == "ChatRoom")
						ChatRoomPublishCustomAction("LockPickBreak", true, [{ Tag: "DestinationCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }]);
				} else {
					LogAdd("FailedLockPick", "LockPick", CurrentTime + StruggleLockPickFailTimeout);
					StruggleLockPickFailTime = CurrentTime + StruggleLockPickFailTimeout;
					StruggleLockPickTotalTries = 0;
				}
			} else
				StruggleLockPickFailTime = CurrentTime + 1500;
		}
		if (StruggleLockPickArousalText != "") {
			DrawText(StruggleLockPickArousalText, X, 170, "pink");
		}
	}


	DrawText(DialogFindPlayer("LockpickIntro"), X, 800, "white");
	DrawText(DialogFindPlayer("LockpickIntro2"), X, 850, "white");
	DrawText(DialogFindPlayer("LockpickIntro3"), X, 900, "white");

	if (StruggleLockPickSuccessTime != 0) {
		if (CurrentTime > StruggleLockPickSuccessTime) {
			StruggleLockPickSuccessTime = 0;
			// Success!
			if (C.FocusGroup && C) {
				var item = InventoryGet(C, C.FocusGroup.Name);
				if (item) {
					InventoryUnlock(C, item);
					if (CurrentScreen == "ChatRoom") ChatRoomPublishAction(C, item, null, C.ID !== 0, "ActionPick");
				}
			}
			SkillProgress("LockPicking", StruggleLockPickProgressSkill);
			// The player can use another item right away, for another character we jump back to her reaction
			if (C.ID == 0) {
				DialogInventoryBuild(C);
				StruggleLockPickOrder = null;
				DialogLockMenu = false;
				DialogMenuButtonBuild(C);

			} else {
				DialogLeaveItemMenu();
			}
		}
	} else {
		if ( Player.ArousalSettings && (Player.ArousalSettings.Active != "Inactive" && Player.ArousalSettings.Active != "NoMeter") && Player.ArousalSettings.Progress > 20 && StruggleLockPickProgressCurrentTries < StruggleLockPickProgressMaxTries && StruggleLockPickProgressCurrentTries > 0) {
			if (CurrentTime > StruggleLockPickArousalTick) {
				var arousalmaxtime = 2.6 - 2.0*Player.ArousalSettings.Progress/100;
				if (StruggleLockPickArousalTick - CurrentTime > CurrentTime + StruggleLockPickArousalTickTime*arousalmaxtime) {
					StruggleLockPickArousalTick = CurrentTime + StruggleLockPickArousalTickTime*arousalmaxtime; // In case it gets set out way too far
				}
				var totalSet = StruggleLockPickSet.filter(x => x==true).length + StruggleLockPickSetFalse.filter(x => x==true).length;
				if (StruggleLockPickArousalTick > 0 && totalSet > 0) {
					var RealUnsetChance = StruggleLockPickSet.filter(x => x==true).length / (totalSet);
					if (Math.random() < RealUnsetChance) {
						if (StruggleLockPickSet.filter(x => x==true).length > 0) {
							if (StruggleLockPickSet.filter(x => x==true).length < StruggleLockPickSet.length) {
								for (let P = StruggleLockPickOrder.length; P >= 0; P--) {
									if (StruggleLockPickSet[StruggleLockPickOrder[P]] == true) {
										StruggleLockPickOffsetTarget[StruggleLockPickOrder[P]] = 0;
										StruggleLockPickSet[StruggleLockPickOrder[P]] = false;
										break;
									}
								}
							}
						}
					} else {
						if (StruggleLockPickSetFalse.filter(x => x==true).length > 0) {
							if (StruggleLockPickSetFalse.filter(x => x==true).length < StruggleLockPickSetFalse.length) {
								var looped = false;
								var startLoop = Math.floor(Math.random() * StruggleLockPickOrder.length);
								var P = startLoop;
								while (!looped) {
									if (StruggleLockPickSetFalse[P] == true) {
										StruggleLockPickOffsetTarget[P] = 0;
										StruggleLockPickSetFalse[P] = false;
										break;
									}
									P += 1;
									if (P >= StruggleLockPickOrder.length) P = 0;
									if (P == startLoop) looped = true;
								}
							}
						}
					}

					StruggleLockPickArousalText = DialogFindPlayer("LockPickArousal");
				}
				var arousalmod = (0.3 + Math.random()*0.7) * (arousalmaxtime); // happens very often at 100 arousal
				StruggleLockPickArousalTick = CurrentTime + StruggleLockPickArousalTickTime * arousalmod;
			}
			var alpha = "10";
			if (StruggleLockPickArousalTick - CurrentTime < 1000) alpha = "70";
			else if (StruggleLockPickArousalTick - CurrentTime < 2000) alpha = "50";
			else if (StruggleLockPickArousalTick - CurrentTime < 3000) alpha = "30";
			else if (StruggleLockPickArousalTick - CurrentTime < 5000) alpha = "20";
			DrawRect(0, 0, 2000, 1000, "#FFB0B0" + alpha);
		} else {
			StruggleLockPickArousalText = "";
		}
	}

}

/**
 * Gets the correct label for the current operation (struggling, removing, swaping, adding, etc.)
 * @param {Character} C - The character who acts
 * @param {Item} Item - The item that's part of the action
 * @returns {string} - The appropriate dialog option
 */
function StruggleLockPickProgressGetOperation(C, Item) {
	var lock = InventoryGetLock(Item);
	if ((Item != null && lock != null)) {
		if (lock.Name == "CombinationPadlock" || lock.Name == "PasswordPadlock") return DialogFindPlayer("Decoding");
		if (Item.Asset.Name.indexOf("Futuristic") >= 0 || Item.Asset.Name.indexOf("Interactive") >= 0) return DialogFindPlayer("Hacking");
		return DialogFindPlayer("Picking");
	}
	return "...";
}

/**
 * Starts the dialog progress bar for picking a lock
 * First the challenge level is calculated based on the base lock difficulty, the skill of the rigger and the escapee
 * @param {Character} C - The character who tries to struggle
 * @param {Item} Item - The item, the character wants to unlock
 * @returns {void} - Nothing
 */
function StruggleLockPickProgressStart(C, Item) {

	StruggleLockPickArousalText = "";
	StruggleLockPickArousalTick = 0;
	if (Item) {
		StruggleLockPickItem = Item;
	}

	var lock = InventoryGetLock(Item);
	var LockRating = 1;
	var LockPickingImpossible = false;
	if (Item != null && lock) {
		// Gets the lock rating
		var BondageLevel = Item.Difficulty - Item.Asset.Difficulty;

		// Gets the required skill / challenge level based on player/rigger skill and item difficulty (0 by default is easy to pick)
		var S = 0;
		S = S + SkillGetWithRatio("LockPicking"); // Add the player evasion level (modified by the effectiveness ratio)
		if (lock.Asset.PickDifficulty && lock.Asset.PickDifficulty > 0) {
			S = S - lock.Asset.PickDifficulty; // Subtract the item difficulty (regular difficulty + player that restrained difficulty)
			LockRating = lock.Asset.PickDifficulty; // Some features of the minigame are independent of the relative skill level
		}
		//if (Item.Asset && Item.Asset.Difficulty) {
		//	S -= BondageLevel/2 // Adds the bondage skill of the item but not the base difficulty!
		//}

		if (Player.IsEnclose() || Player.IsMounted()) S = S - 2; // A little harder if there's an enclosing or mounting item

		// When struggling to pick a lock while being blocked from interacting (for the future if we allow picking locks while bound -Ada)
		if (!Player.CanInteract() && (Item != null)) {

			if (InventoryItemHasEffect(Item, "NotSelfPickable", true))
			{
				S = S - 50;
				LockPickingImpossible = true;
			} // Impossible if the item is such that it can't be picked alone (e.g yokes or elbow cuffs)
			else {
				if (InventoryItemHasEffect(InventoryGet(Player, "ItemArms"), "Block", true)) {
					if (Item.Asset.Group.Name != "ItemArms" && Item.Asset.Group.Name != "ItemHands")
						S = S - 50; // MUST target arms item or hands item if your arrms are bound
					else
						S = S - 2; // Harder If arms are restrained
				}

				if (InventoryItemHasEffect(InventoryGet(Player, "ItemHands"), "Block", true)) {
					if (!LogQuery("KeyDeposit", "Cell") && DialogHasKey(Player, Item))// If you have keys, its just a matter of getting the keys into the lock~
						S = S - 4;
					else // Otherwise it's not possible to pick a lock. Too much dexterity required
						S = S - 50;
					// With key, the difficulty is as follows:
					// Mittened and max Lockpinking, min bondage: Metal padlock is easy, intricate is also easy, anything above will be slightly more challenging than unmittened
					// Mittened, arms bound, and max Lockpinking, min bondage: Metal padlock is easy, intricate is somewhat hard, high security is very hard, combo impossible
				}

				if (S < -6) {
					LockPickingImpossible = true; // The above stuff can make picking the lock impossible. Everything else will make it incrementally harder
				}

				if (!C.CanTalk()) S = S - 1; // A little harder while gagged, but it wont make it impossible
				if (InventoryItemHasEffect(InventoryGet(Player, "ItemLegs"), "Block", true)) S = S - 1; // A little harder while legs bound, but it wont make it impossible
				if (InventoryItemHasEffect(InventoryGet(Player, "ItemFeet"), "Block", true)) S = S - 1; // A little harder while legs bound, but it wont make it impossible
				if (InventoryGroupIsBlocked(Player, "ItemFeet")) S = S - 1; // A little harder while wearing something like a legbinder as well
				if (Player.IsBlind()) S = S - 1; // harder while blind
				if (Player.GetDeafLevel() > 0) S = S - Math.ceil(Player.GetDeafLevel()/2); // harder while deaf

				// No bonus from struggle assist. Lockpicking is a solo activity!
			}
		}

		// Gets the number of pins on the lock
		var NumPins = 4;
		if (LockRating >= 6) NumPins += 2; // 6 pins for the intricate lock
		if (LockRating >= 8) NumPins += 1; // 7 pins for the exclusive lock
		if (LockRating >= 10) NumPins += 1; // 8 pins for the high security lock
		if (LockRating >= 11) NumPins += 2; // Cap at 10 pins




		// Prepares the progress bar and timer
		StruggleLockPickOrder = [];
		StruggleLockPickSet = [];
		StruggleLockPickSetFalse = [];
		StruggleLockPickOffset = [];
		StruggleLockPickOffsetTarget = [];
		StruggleLockPickImpossiblePins = [];
		StruggleLockPickProgressItem = Item;
		StruggleLockPickProgressOperation = StruggleLockPickProgressGetOperation(C, Item);
		StruggleLockPickProgressSkill = Math.floor(NumPins*NumPins/2) + Math.floor(Math.max(0, -S)*Math.max(0, -S)); // Scales squarely, so that more difficult locks provide bigger reward!
		StruggleLockPickProgressSkillLose = NumPins*NumPins/2; // Even if you lose you get some reward. You get this no matter what if you run out of tries.
		StruggleLockPickProgressChallenge = S * -1;
		StruggleLockPickProgressCurrentTries = 0;
		StruggleLockPickSuccessTime = 0;
		StruggleLockPickFailTime = 0;
		DialogMenuButtonBuild(C);




		for (let P = 0; P < NumPins; P++) {
			StruggleLockPickOrder.push(P);
			StruggleLockPickSet.push(false);
			StruggleLockPickSetFalse.push(false);
			StruggleLockPickOffset.push(0);
			StruggleLockPickOffsetTarget.push(0);
		}
		/* Randomize array in-place using Durstenfeld shuffle algorithm */
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		for (var i = StruggleLockPickOrder.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = StruggleLockPickOrder[i];
			StruggleLockPickOrder[i] = StruggleLockPickOrder[j];
			StruggleLockPickOrder[j] = temp;
		}

		// Initialize persistent pins
		if ((Item.Property == null)) Item.Property = {};
		if (Item.Property != null)
			if ((Item.Property.LockPickSeed == null) || (typeof Item.Property.LockPickSeed != "string")) {Item.Property.LockPickSeed = CommonConvertArrayToString(StruggleLockPickOrder); StruggleLockPickTotalTries = 0;}
			else {
				var conv = CommonConvertStringToArray(Item.Property.LockPickSeed);
				for (let PP = 0; PP < conv.length; PP++) {
					if (typeof conv[PP] != "number") {
						Item.Property.LockPickSeed = CommonConvertArrayToString(StruggleLockPickOrder);
						conv = StruggleLockPickOrder;
						break;
					}
				}
				StruggleLockPickOrder = conv;
			}

		var PickingImpossible = false;
		if (S < -6 && LockPickingImpossible) {
			PickingImpossible = true; // if picking is impossible, then some pins will never set
			StruggleLockPickImpossiblePins.push(StruggleLockPickOrder[StruggleLockPickOrder.length-1]);
			if (NumPins >= 6) StruggleLockPickImpossiblePins.push(StruggleLockPickOrder[StruggleLockPickOrder.length-2]);
			if (NumPins >= 8) StruggleLockPickImpossiblePins.push(StruggleLockPickOrder[StruggleLockPickOrder.length-3]);
		}

		// At 4 pins we have a base of 16 tries, with 10 maximum permutions possible
		// At 10 pins we have a base of 40-30 tries, with 55 maximum permutions possible
		var NumTries = Math.max(Math.floor(NumPins * (1.5 - 0.3*BondageLevel/10)),
			Math.ceil(NumPins * (3.25 - BondageLevel/10) - Math.max(0, (StruggleLockPickProgressChallenge + BondageLevel/2)*1.5)));
			// negative skill of 1 subtracts 2 from the normal lock and 4 from 10 pin locks,
			// negative skill of 6 subtracts 12 from all locks


		StruggleLockPickProgressMaxTries = Math.max(1, NumTries - NumPins);
	}
}




