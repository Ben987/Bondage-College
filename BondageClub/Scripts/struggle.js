var DialogLockPickItem = null;
var DialogLockPickOrder = null;
var DialogLockPickSet = null;
var DialogLockPickSetFalse = null;
var DialogLockPickOffset = null;
var DialogLockPickOffsetTarget = null;
var DialogLockPickImpossiblePins = null;
var DialogLockPickProgressItem = null;
var DialogLockPickProgressOperation = "";
var DialogLockPickProgressSkill = 0;
var DialogLockPickProgressSkillLose = 0;
var DialogLockPickProgressChallenge = 0;
var DialogLockPickProgressMaxTries = 0;
var DialogLockPickProgressCurrentTries = 0;
var DialogLockPickSuccessTime = 0;
var DialogLockPickFailTime = 0;
var DialogLockPickArousalTick = 0;
var DialogLockPickArousalTickTime = 12000;
var DialogLockPickArousalText = ""
var DialogLockPickFailTimeout = 30000
var DialogLockPickTotalTries = 0

var DialogProgressStruggleCount = 0;
var DialogProgressAuto = 0;
var DialogProgressOperation = "...";
var DialogProgressPrevItem = null;
var DialogProgressNextItem = null;
var DialogProgressSkill = 0;
var DialogProgressLastKeyPress = 0;
var DialogProgressChallenge = 0;


var DialogProgressCurrentMinigame = "Strength"
var DialogProgressChoosePrevItem = null;
var DialogProgressChooseNextItem = null;

// For flexibility
var DialogProgressFlexCircles = []
var DialogProgressFlexTimer = 0
var DialogProgressFlexCirclesRate = 1000

// For dexterity
var DialogProgressDexTarget = 0
var DialogProgressDexCurrent = 0
var DialogProgressDexMax = 300
var DialogProgressDexDirectionRight = false // Moves left when false, right when true



function DialogDrawStruggleProgress(C) {
	if (DialogProgressCurrentMinigame == "Strength") DialogDrawStrengthProgress(C);
	else if (DialogProgressCurrentMinigame == "Flexibility") DialogDrawFlexibilityProgress(C);
	else if (DialogProgressCurrentMinigame == "Dexterity") DialogDrawDexterityProgress(C);
	
	else {
		if ((DialogProgressChoosePrevItem != null) && (DialogProgressChooseNextItem != null)) {
			DrawItemPreview(1200, 150, DialogProgressChoosePrevItem);
			DrawItemPreview(1575, 150, DialogProgressChooseNextItem);
		} else DrawItemPreview(1387, 150, (DialogProgressChoosePrevItem != null) ? DialogProgressChoosePrevItem : DialogProgressChooseNextItem);

		
		DrawText(DialogFind(Player, "ChooseStruggleMethod"), 1500, 550, "White", "Black");
		
		
		if (MouseIn(1387-300, 600, 225, 275)) DrawRect(1387-300, 600, 225, 275, "aqua");
		else DrawRect(1387-300, 600, 225, 275, "white");
		DrawImageResize("Icons/Struggle/Strength.png", 1389-300, 602, 221, 221);
		DrawTextFit(DialogFind(Player, "Strength"), 1500-300, 850, 221, "black");
		
		
		if (MouseIn(1387, 600, 225, 275)) DrawRect(1387, 600, 225, 275, "aqua");
		else DrawRect(1387, 600, 225, 275, "white");
		DrawImageResize("Icons/Struggle/Flexibility.png", 1389, 602, 221, 221);
		DrawTextFit(DialogFind(Player, "Flexibility"), 1500, 850, 221, "black");
		
		
		if (MouseIn(1387+300, 600, 225, 275)) DrawRect(1387+300, 600, 225, 275, "aqua");
		else DrawRect(1387+300, 600, 225, 275, "white");
		DrawImageResize("Icons/Struggle/Dexterity.png", 1389+300, 602, 221, 221);
		DrawTextFit(DialogFind(Player, "Dexterity"), 1500+300, 850, 221, "black");
		
	}
	
}

/**
 * Handles the KeyDown event. The player can use the space bar to speed up the dialog progress, just like clicking.
 * Increases or decreases the struggle mini-game, if a/A or s/S were pressed.
 * @returns {void} - Nothing
 */
function DialogKeyDown() {
	if (((KeyPress == 65) || (KeyPress == 83) || (KeyPress == 97) || (KeyPress == 115)) && (DialogProgress >= 0) && (DialogColor == null)) {
		DialogStrength((DialogProgressLastKeyPress == KeyPress));
		DialogProgressLastKeyPress = KeyPress;
	}
}

/**
 * Handles the Click event. The player can use the space bar to speed up the dialog progress, just like clicking.
 * Increases or decreases the struggle mini-game, if a/A or s/S were pressed.
 * @returns {void} - Nothing
 */
function DialogStruggleClick(Reverse) {
	if (DialogProgressCurrentMinigame == "Strength") {if (CommonIsMobile) DialogStrength(Reverse);}
	else if (DialogProgressCurrentMinigame == "Flexibility") DialogFlexibility(Reverse);
	else if (DialogProgressCurrentMinigame == "Dexterity") DialogDexterity(Reverse);
	else {
		if (MouseIn(1387-300, 600, 225, 275)) DialogProgressCurrentMinigame = "Strength"
		else if (MouseIn(1387, 600, 225, 275)) DialogProgressCurrentMinigame = "Flexibility"
		else if (MouseIn(1387+300, 600, 225, 275)) DialogProgressCurrentMinigame = "Dexterity"
		
		if (DialogProgressCurrentMinigame == "Strength") DialogStrengthStart(Player, DialogProgressChoosePrevItem, DialogProgressChooseNextItem);
		else if (DialogProgressCurrentMinigame == "Flexibility") DialogFlexibilityStart(Player, DialogProgressChoosePrevItem, DialogProgressChooseNextItem);
		else if (DialogProgressCurrentMinigame == "Dexterity") DialogDexterityStart(Player, DialogProgressChoosePrevItem, DialogProgressChooseNextItem);
	}
	
}

function DialogProgressStart(C, PrevItem, NextItem) {
	DialogProgressChoosePrevItem = PrevItem
	DialogProgressChooseNextItem = NextItem
	DialogProgressCurrentMinigame = ""
	
	DialogProgress = 0;
	DialogMenuButtonBuild(C);
		
	if (C != Player || PrevItem == null) {
		DialogProgressCurrentMinigame = "Strength"
		DialogStrengthStart(C, DialogProgressChoosePrevItem, DialogProgressChooseNextItem);
	}
	
}

function DialogProgressAutoDraw(C) {
	// Draw one or both items
	if ((DialogProgressPrevItem != null) && (DialogProgressNextItem != null)) {
		DrawItemPreview(1200, 250, DialogProgressPrevItem);
		DrawItemPreview(1575, 250, DialogProgressNextItem);
	} else DrawItemPreview(1387, 250, (DialogProgressPrevItem != null) ? DialogProgressPrevItem : DialogProgressNextItem);

	// Add or subtract to the automatic progression, doesn't move in color picking mode
	DialogProgress = DialogProgress + DialogProgressAuto;
	if (DialogProgress < 0) DialogProgress = 0;
	
	// We cancel out if at least one of the following cases apply: a new item conflicts with this, the player can no longer interact, something else was added first, the item was already removed
	if (InventoryGroupIsBlocked(C) || (C != Player && !Player.CanInteract()) || (DialogProgressNextItem == null && !InventoryGet(C, DialogProgressPrevItem.Asset.Group.Name)) || (DialogProgressNextItem != null && !InventoryAllow(C, DialogProgressNextItem.Asset.Prerequisite)) || (DialogProgressNextItem != null && DialogProgressPrevItem != null && ((InventoryGet(C, DialogProgressPrevItem.Asset.Group.Name) && InventoryGet(C, DialogProgressPrevItem.Asset.Group.Name).Asset.Name != DialogProgressPrevItem.Asset.Name) || !InventoryGet(C, DialogProgressPrevItem.Asset.Group.Name))) || (DialogProgressNextItem != null && DialogProgressPrevItem == null && InventoryGet(C, DialogProgressNextItem.Asset.Group.Name))) {
		if (DialogProgress > 0)
			ChatRoomPublishAction(C, DialogProgressPrevItem, DialogProgressNextItem, true, "interrupted");
		else
			DialogLeave();
		DialogProgress = -1;
		DialogLockMenu = false
		return;
	}
}

function DialogProgressCheckEnd(C) {
	// If the operation is completed
	if (DialogProgress >= 100) {

		// Stops the dialog sounds
		AudioDialogStop();

		// Removes the item & associated items if needed, then wears the new one 
		InventoryRemove(C, C.FocusGroup.Name);
		if (DialogProgressNextItem != null) InventoryWear(C, DialogProgressNextItem.Asset.Name, DialogProgressNextItem.Asset.Group.Name, (DialogColorSelect == null) ? "Default" : DialogColorSelect, SkillGetWithRatio("Bondage"), Player.MemberNumber);

		// The player can use another item right away, for another character we jump back to her reaction
		if (C.ID == 0) {
			if (DialogProgressNextItem == null) SkillProgress("Evasion", DialogProgressSkill);
			if ((DialogProgressPrevItem == null) && (DialogProgressNextItem != null)) SkillProgress("SelfBondage", (DialogProgressSkill + DialogProgressNextItem.Asset.SelfBondage) * 2);
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

		// Reset the the character's position
		if (CharacterAppearanceForceUpCharacter == C.MemberNumber) {
			CharacterAppearanceForceUpCharacter = 0;
			CharacterAppearanceSetHeightModifiers(C);
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
function DialogDrawStrengthProgress(C) {
	DialogProgressAutoDraw(C)

	// Draw the current operation and progress
	if (DialogProgressAuto < 0) DrawText(DialogFind(Player, "Challenge") + " " + ((DialogProgressStruggleCount >= 50) ? DialogProgressChallenge.toString() : "???"), 1500, 150, "White", "Black");
	DrawText(DialogProgressOperation, 1500, 650, "White", "Black");
	DrawProgressBar(1200, 700, 600, 100, DialogProgress);
	DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1500, 900, "White", "Black");

	DialogProgressCheckEnd(C)
}



/**
 * Starts the dialog progress bar and keeps the items that needs to be added / swaped / removed. 
 * The change of facial expressions during struggling is done here
 * @param {boolean} Reverse - If set to true, the progress is decreased
 * @returns {void} - Nothing
 */
function DialogStrength(Reverse) {
	
	// Progress calculation
	var P = 42 / (DialogProgressSkill * CheatFactor("DoubleItemSpeed", 0.5)); // Regular progress, slowed by long timers, faster with cheats
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

/**
 * Starts the dialog progress bar for struggling out of bondage and keeps the items that needs to be added / swapped / removed.
 * First the challenge level is calculated based on the base item difficulty, the skill of the rigger and the escapee and modified, if
 * the escapee is bound in a way. Also blushing and drooling, as well as playing a sound is handled in this function.
 * @param {Character} C - The character who tries to struggle
 * @param {Item} PrevItem - The item, the character wants to struggle out of
 * @param {Item} [NextItem] - The item that should substitute the first one
 * @returns {void} - Nothing
 */
function DialogStrengthStart(C, PrevItem, NextItem) {

	// Gets the required skill / challenge level based on player/rigger skill and item difficulty (0 by default is easy to struggle out)
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

	// Roleplay users can bypass the struggle mini-game with a toggle
	if ((CurrentScreen == "ChatRoom") && ((DialogProgressChallenge <= 6) || (DialogProgressAuto >= 0)) && Player.RestrictionSettings.BypassStruggle) {
		DialogProgressAuto = 1;
		DialogProgressSkill = 5;
	}

	// If there's no current blushing, we update the blushing state while struggling
	DialogAllowBlush = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Blush") == null) || (InventoryGet(C, "Blush").Property == null) || (InventoryGet(C, "Blush").Property.Expression == null)));
	DialogAllowEyebrows = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Eyebrows") == null) || (InventoryGet(C, "Eyebrows").Property == null) || (InventoryGet(C, "Eyebrows").Property.Expression == null)));
	DialogAllowFluids = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Fluids") == null) || (InventoryGet(C, "Fluids").Property == null) || (InventoryGet(C, "Fluids").Property.Expression == null)));

	// Applying or removing specific items can trigger an audio sound to play
	if ((PrevItem && PrevItem.Asset) || (NextItem && NextItem.Asset)) {
		var AudioFile = (NextItem && NextItem.Asset) ? NextItem.Asset.Audio : PrevItem.Asset.Audio;
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
function DialogFlexibilityStart(C, PrevItem, NextItem) {

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
		if ((PrevItem.Asset.Group.Name != "ItemArms") && InventoryItemHasEffect(InventoryGet(C, "ItemArms"), "Block", true)) S = S - 4; // Harder If we don't target the arms while arms are restrained
		if ((PrevItem.Asset.Group.Name != "ItemLegs") && InventoryItemHasEffect(InventoryGet(C, "ItemLegs"), "Block", true)) S = S - 4; // Harder If we don't target the legs while arms are restrained
		if ((PrevItem.Asset.Group.Name != "ItemHands") && InventoryItemHasEffect(InventoryGet(C, "ItemHands"), "Block", true)) S = S - 1; // Harder If we don't target the hands while hands are restrained 
		if ((PrevItem.Asset.Group.Name != "ItemTorso") && InventoryItemHasEffect(InventoryGet(C, "ItemTorso"), "Block", true)) S = S - 1; // A little harder if you are in a corset or harness
		if ((PrevItem.Asset.Group.Name != "ItemFeet") && InventoryItemHasEffect(InventoryGet(C, "ItemFeet"), "Block", true)) S = S - 2; // Harder if you can't split your feet apart
		if ((PrevItem.Asset.Group.Name != "ItemNeck") && InventoryItemHasEffect(InventoryGet(C, "ItemNeck"), "Block", true)) S = S - 1; // Neck collars are restrictive

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
	DialogProgress = 0;
	DialogProgressAuto = TimerRunInterval * (0.22 + (((S <= -10) ? -9 : S) * 0.11)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));  // S: -9 is floor level to always give a false hope
	DialogProgressPrevItem = PrevItem;
	DialogProgressNextItem = NextItem;
	DialogProgressOperation = DialogProgressGetOperation(C, PrevItem, NextItem);
	DialogProgressSkill = Timer;
	DialogProgressChallenge = S * -1;
	DialogProgressStruggleCount = 0;
	DialogItemToLock = null;
	DialogMenuButtonBuild(C);
	
	
	DialogProgressFlexCircles = []
	DialogProgressFlexTimer = 0
	DialogProgressFlexCirclesRate = 1000

	// The progress bar will not go down if the player can use her hands for a new item, or if she has the key for the locked item
	if ((DialogProgressAuto < 0) && Player.CanInteract() && (PrevItem == null)) DialogProgressAuto = 0;
	if ((DialogProgressAuto < 0) && Player.CanInteract() && (PrevItem != null) && (!InventoryItemHasEffect(PrevItem, "Lock", true) || DialogCanUnlock(C, PrevItem)) && !InventoryItemHasEffect(PrevItem, "Mounted", true)) DialogProgressAuto = 0;

	// Roleplay users can bypass the struggle mini-game with a toggle
	if ((CurrentScreen == "ChatRoom") && ((DialogProgressChallenge <= 6) || (DialogProgressAuto >= 0)) && Player.RestrictionSettings.BypassStruggle) {
		DialogProgressAuto = 1;
		DialogProgressSkill = 5;
	}

	// If there's no current blushing, we update the blushing state while struggling
	DialogAllowBlush = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Blush") == null) || (InventoryGet(C, "Blush").Property == null) || (InventoryGet(C, "Blush").Property.Expression == null)));
	DialogAllowEyebrows = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Eyebrows") == null) || (InventoryGet(C, "Eyebrows").Property == null) || (InventoryGet(C, "Eyebrows").Property.Expression == null)));
	DialogAllowFluids = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Fluids") == null) || (InventoryGet(C, "Fluids").Property == null) || (InventoryGet(C, "Fluids").Property.Expression == null)));

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
function DialogDrawFlexibilityProgress(C) {
	DialogProgressAutoDraw(C)

	// Draw the current operation and progress
	if (DialogProgressAuto < 0) DrawText(DialogFind(Player, "Challenge") + " " + ((DialogProgressStruggleCount >= 50) ? DialogProgressChallenge.toString() : "???"), 1500, 150, "White", "Black");
	DrawText(DialogProgressOperation, 1500, 650, "White", "Black");
	DrawProgressBar(1200, 700, 600, 100, DialogProgress);
	DrawText(DialogFind(Player, (CommonIsMobile) ? "ProgressClick" : "ProgressKeys"), 1500, 900, "White", "Black");

	DialogProgressCheckEnd(C)
}



/**
 * Starts the dialog progress bar and keeps the items that needs to be added / swaped / removed. 
 * The change of facial expressions during struggling is done here
 * @param {boolean} Reverse - If set to true, the progress is decreased
 * @returns {void} - Nothing
 */
function DialogFlexibility(Reverse) {
	
	// Progress calculation
	var P = 42 / (DialogProgressSkill * CheatFactor("DoubleItemSpeed", 0.5)); // Regular progress, slowed by long timers, faster with cheats
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
function DialogDexterityStart(C, PrevItem, NextItem) {

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
		var blockedAreas = 0
		
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
	DialogProgress = 0;
	DialogProgressAuto = TimerRunInterval * (0.22 + (((S <= -10) ? -9 : S) * 0.11)) / (Timer * CheatFactor("DoubleItemSpeed", 0.5));  // S: -9 is floor level to always give a false hope
	DialogProgressPrevItem = PrevItem;
	DialogProgressNextItem = NextItem;
	DialogProgressOperation = DialogProgressGetOperation(C, PrevItem, NextItem);
	DialogProgressSkill = Timer;
	DialogProgressChallenge = S * -1;
	DialogProgressStruggleCount = 0;
	DialogItemToLock = null;
	DialogMenuButtonBuild(C);
	
	
	DialogProgressDexTarget = Math.random() * 2 * DialogProgressDexMax - DialogProgressDexMax
	DialogProgressDexCurrent = 0
	DialogProgressDexDirectionRight = false

	// The progress bar will not go down if the player can use her hands for a new item, or if she has the key for the locked item
	if ((DialogProgressAuto < 0) && Player.CanInteract() && (PrevItem == null)) DialogProgressAuto = 0;
	if ((DialogProgressAuto < 0) && Player.CanInteract() && (PrevItem != null) && (!InventoryItemHasEffect(PrevItem, "Lock", true) || DialogCanUnlock(C, PrevItem)) && !InventoryItemHasEffect(PrevItem, "Mounted", true)) DialogProgressAuto = 0;

	// Roleplay users can bypass the struggle mini-game with a toggle
	if ((CurrentScreen == "ChatRoom") && ((DialogProgressChallenge <= 6) || (DialogProgressAuto >= 0)) && Player.RestrictionSettings.BypassStruggle) {
		DialogProgressAuto = 1;
		DialogProgressSkill = 5;
	}

	// If there's no current blushing, we update the blushing state while struggling
	DialogAllowBlush = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Blush") == null) || (InventoryGet(C, "Blush").Property == null) || (InventoryGet(C, "Blush").Property.Expression == null)));
	DialogAllowEyebrows = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Eyebrows") == null) || (InventoryGet(C, "Eyebrows").Property == null) || (InventoryGet(C, "Eyebrows").Property.Expression == null)));
	DialogAllowFluids = ((DialogProgressAuto < 0) && (DialogProgressChallenge > 0) && (C.ID == 0) && ((InventoryGet(C, "Fluids") == null) || (InventoryGet(C, "Fluids").Property == null) || (InventoryGet(C, "Fluids").Property.Expression == null)));

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
function DialogDrawDexterityProgress(C) {
	DialogProgressAutoDraw(C)


	DrawImageResize("Icons/Struggle/Buckle.png", 1420 + DialogProgressDexTarget, 625, 150, 150);
	DrawImageResize("Icons/Struggle/Player.png", 1420 + DialogProgressDexCurrent, 625, 150, 150);
	
	var speed = (5 + Math.max(0, -DialogProgressAuto*7))
	
	DialogProgressDexCurrent += (DialogProgressDexDirectionRight) ? speed : -speed
	
	if (DialogProgressDexCurrent > DialogProgressDexMax) {
		DialogProgressDexCurrent = DialogProgressDexMax
		DialogProgressDexDirectionRight = false
	}
	if (DialogProgressDexCurrent < -DialogProgressDexMax) {
		DialogProgressDexCurrent = -DialogProgressDexMax
		DialogProgressDexDirectionRight = true
	}
	
	

	// Draw the current operation and progress
	if (DialogProgressAuto < 0) DrawText(DialogFind(Player, "Challenge") + " " + ((DialogProgressStruggleCount >= 50) ? DialogProgressChallenge.toString() : "???"), 1500, 150, "White", "Black");
	DrawText(DialogProgressOperation, 1500, 600, "White", "Black");
	DrawProgressBar(1200, 800, 600, 100, DialogProgress);
	DrawText(DialogFind(Player, "ProgressDex"), 1500, 950, "White", "Black");

	DialogProgressCheckEnd(C)
}



/**
 * Starts the dialog progress bar and keeps the items that needs to be added / swaped / removed. 
 * The change of facial expressions during struggling is done here
 * @param {boolean} Reverse - If set to true, the progress is decreased
 * @returns {void} - Nothing
 */
function DialogDexterity(Reverse) {
	
	
	// Progress calculation
	var P = 200 / (DialogProgressSkill/4 * CheatFactor("DoubleItemSpeed", 0.5)); // Regular progress, slowed by long timers, faster with cheats
	if ((DialogProgressChallenge > 6) && (DialogProgress > 50) && (DialogProgressAuto < 0)) P = P * (1 - ((DialogProgress - 50) / 50)); // Beyond challenge 6, it becomes impossible after 50% progress
	P = P * Math.max(-0.5, Math.min(1, (85 - Math.abs(DialogProgressDexTarget - DialogProgressDexCurrent))/75)); // Reverses the progress if too far

	if (P > 0) {
		DialogProgressDexTarget = Math.random() * 2 * DialogProgressDexMax - DialogProgressDexMax
	}

	// Sets the new progress and writes the "Impossible" message if we need to
	DialogProgress = DialogProgress + P;
	if (DialogProgress < 0) DialogProgress = 0;
	if ((DialogProgress >= 100) && (DialogProgressChallenge > 6) && (DialogProgressAuto < 0)) DialogProgress = 99;
	if (!Reverse) DialogProgressStruggleCount += 5;
	if ((DialogProgressStruggleCount >= 50) && (DialogProgressChallenge > 6) && (DialogProgressAuto < 0)) DialogProgressOperation = DialogFind(Player, "Impossible");

	// At 15 hit: low blush, 50: Medium and 125: High
	if (DialogAllowBlush && !Reverse) {
		if (DialogProgressStruggleCount == 15) CharacterSetFacialExpression(Player, "Blush", "Low");
		if (DialogProgressStruggleCount == 50) CharacterSetFacialExpression(Player, "Blush", "Medium");
		if (DialogProgressStruggleCount == 125) CharacterSetFacialExpression(Player, "Blush", "High");
	}

	// Over 50 progress, the character frowns
	if (DialogAllowEyebrows && !Reverse) CharacterSetFacialExpression(Player, "Eyebrows", (DialogProgress >= 50) ? "Angry" : null);

	
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
function DialogLockPickClick(C) {
	var X = 1475
	var Y = 500
	var PinSpacing = 100
	var PinWidth = 200
	var PinHeight = 200
	var skill = Math.min(10, SkillGetWithRatio("LockPicking"))
	var current_pins = DialogLockPickSet.filter(x => x==true).length
	var false_set_chance = 0.75 - 0.15 * skill/10
	var unset_false_set_chance = 0.1 + 0.1 * skill/10
	if (current_pins < DialogLockPickSet.length && LogValue("FailedLockPick", "LockPick") < CurrentTime)
		for (let P = 0; P < DialogLockPickSet.length; P++) {
			if (!DialogLockPickSet[P]) {
				var XX = X - PinWidth/2 + (0.5-DialogLockPickSet.length/2 + P) * PinSpacing
				if (MouseIn(XX + PinSpacing/2, Y - PinHeight, PinSpacing, PinWidth+PinHeight)) {
					if (DialogLockPickProgressCurrentTries < DialogLockPickProgressMaxTries) {
						
						if (DialogLockPickOrder[current_pins] == P && DialogLockPickImpossiblePins.filter(x => x==P).length == 0) {
							// Successfully set the pin
							DialogLockPickSet[P] = true
							DialogLockPickArousalText = ""; // Reset arousal text
							// We also unset any false set pins
							if (current_pins+1 < DialogLockPickOrder.length && DialogLockPickSetFalse[DialogLockPickOrder[current_pins+1]] == true) {
								DialogLockPickSetFalse[DialogLockPickOrder[current_pins+1]] = false
								DialogLockPickProgressCurrentTries += 1
							}
						} else {
							// There is a chance we false set
							if (Math.random() < false_set_chance) {
								DialogLockPickSetFalse[P] = true
							} else if (DialogLockPickSetFalse[P] == false) {
							// Otherwise: fail
								DialogLockPickProgressCurrentTries += 1
								DialogLockPickTotalTries += 1
							}
						}
						if (DialogLockPickProgressCurrentTries < DialogLockPickProgressMaxTries) {
							for (let PP = 0; PP < DialogLockPickSetFalse.length; PP++) {
								if (P != PP && DialogLockPickSetFalse[PP] == true && Math.random() < unset_false_set_chance) {
									DialogLockPickSetFalse[PP] = false;
									DialogLockPickProgressCurrentTries += 1
									break;
								}
							}
						}
						var order = Math.max(0, DialogLockPickOrder.indexOf(P)-current_pins)/Math.max(1, DialogLockPickSet.length-current_pins) * (0.25+0.75*skill/10) // At higher skills you can see which pins are later in the order
						DialogLockPickOffsetTarget[P] = (DialogLockPickSet[P] || DialogLockPickSetFalse[P]) ? PinHeight : PinHeight*(0.1+0.8*order)
						
						if (DialogLockPickProgressCurrentTries == DialogLockPickProgressMaxTries && DialogLockPickSet.filter(x => x==false).length > 0 ) {
							SkillProgress("LockPicking", DialogLockPickProgressSkillLose);
							if (DialogLentLockpicks)  {
								DialogLentLockpicks = false
								if (CurrentScreen == "ChatRoom")
									ChatRoomPublishCustomAction("LockPickBreak", true, [{ Tag: "DestinationCharacterName", Text: Player.Name, MemberNumber: Player.MemberNumber }]);
							}
							
						}
					}
					
					
					

					break;
				}
			}
		}
		
	if (current_pins >= DialogLockPickSet.length - 1 && DialogLockPickSet.filter(x => x==false).length == 0 ) {
		DialogLockPickSuccessTime = CurrentTime + 1000;
	}
}


 
 
 
function DialogDrawLockpickProgress(C) {
	// Place where to draw the pins
	var X = 1475
	var Y = 500
	var PinSpacing = 100
	var PinWidth = 200
	var PinHeight = 200
	for (let P = 0; P < DialogLockPickSet.length; P++) {
		var XX = X - PinWidth/2 + (0.5-DialogLockPickSet.length/2 + P) * PinSpacing
		
		if (DialogLockPickOffset[P] < DialogLockPickOffsetTarget[P]) {
			
			if ( DialogLockPickOffsetTarget[P] == 0)
				DialogLockPickOffset[P] = 0
			else
				DialogLockPickOffset[P] += 1 + Math.abs(DialogLockPickOffsetTarget[P] - DialogLockPickOffset[P])/4
		}
		if (DialogLockPickOffset[P] >= DialogLockPickOffsetTarget[P]) {
			if (DialogLockPickOffsetTarget[P] != 0)
				DialogLockPickOffset[P] = DialogLockPickOffsetTarget[P]
			if (DialogLockPickOffsetTarget[P] != PinHeight || (!DialogLockPickSetFalse[P] && !DialogLockPickSet[P])) {
				DialogLockPickOffsetTarget[P] = 0
				DialogLockPickOffset[P] -= 1 + Math.abs(DialogLockPickOffsetTarget[P] - DialogLockPickOffset[P])/8
			}
		}
		
		DrawImageResize("Screens/MiniGame/Lockpick/Cylinder.png", XX, Y - PinHeight, PinWidth, PinWidth + PinHeight);
		DrawImageResize("Screens/MiniGame/Lockpick/Pin.png", XX, Y - DialogLockPickOffset[P], PinWidth, PinWidth);
		if (MouseIn(XX + PinSpacing/2, Y - PinHeight, PinSpacing, PinWidth+PinHeight))
			DrawImageResize("Screens/MiniGame/Lockpick/Arrow.png", XX, Y + 25, PinWidth, PinWidth);
	}

	
	DrawText(DialogFind(Player, "LockpickTriesRemaining") + (DialogLockPickProgressMaxTries - DialogLockPickProgressCurrentTries), X, 212, "white");
	if (LogValue("FailedLockPick", "LockPick") > CurrentTime)
		DrawText(DialogFind(Player, "LockpickFailedTimeout") + TimerToString(LogValue("FailedLockPick", "LockPick") - CurrentTime), X, 262, "red");
	else {
		if (DialogLockPickProgressCurrentTries >= DialogLockPickProgressMaxTries && DialogLockPickSuccessTime == 0) {
			if (DialogLockPickFailTime > 0) {
				if (DialogLockPickFailTime < CurrentTime) {
					DialogLockPickFailTime = 0
					
					DialogLockPickProgressStart(C, DialogLockPickItem)
					
				}
				else {
					DrawText(DialogFind(Player, "LockpickFailed"), X, 262, "red");
				}
			} else if (Math.random() < 0.25 && DialogLockPickTotalTries > 5) { // DialogLockPickTotalTries is meant to give players a bit of breathing room so they don't get tired right away
				LogAdd("FailedLockPick", "LockPick", CurrentTime + DialogLockPickFailTimeout);
				DialogLockPickFailTime = CurrentTime + DialogLockPickFailTimeout;
				DialogLockPickTotalTries = 0
			} else 
				DialogLockPickFailTime = CurrentTime + 1500
		}
		if (DialogLockPickArousalText != "") {
			DrawText(DialogLockPickArousalText, X, 170, "pink");
		}
	}
		

	DrawText(DialogFind(Player, "LockpickIntro"), X, 800, "white");
	DrawText(DialogFind(Player, "LockpickIntro2"), X, 850, "white");
	
	if (DialogLockPickSuccessTime != 0) {
		if (CurrentTime > DialogLockPickSuccessTime) {
			DialogLockPickSuccessTime = 0
			// Success!
			if (C.FocusGroup && C) {
				var item = InventoryGet(C, C.FocusGroup.Name)
				if (item) {
					InventoryUnlock(C, item)
				}
			}
			SkillProgress("LockPicking", DialogLockPickProgressSkill);
			// The player can use another item right away, for another character we jump back to her reaction
			if (C.ID == 0) {
				DialogInventoryBuild(C);
				DialogLockPickOrder = null;
				DialogLockMenu = false;
				DialogMenuButtonBuild(C);
				
			} else {
				DialogLeaveItemMenu();
			}
			if (CurrentScreen == "ChatRoom" && Player.FocusGroup) {
				var item = InventoryGet(C, Player.FocusGroup.Name)
				if (item)
					ChatRoomPublishAction(C, item, null, true, "ActionPick");
			}
		}
	} else {
		if ( Player.ArousalSettings && Player.ArousalSettings.Progress > 20 && DialogLockPickProgressCurrentTries < DialogLockPickProgressMaxTries && DialogLockPickProgressCurrentTries > 0) {
			if (CurrentTime > DialogLockPickArousalTick) {
				var arousalmaxtime = 2.6 - 2.0*Player.ArousalSettings.Progress/100
				if (DialogLockPickArousalTick - CurrentTime > CurrentTime + DialogLockPickArousalTickTime*arousalmaxtime) {
					DialogLockPickArousalTick = CurrentTime + DialogLockPickArousalTickTime*arousalmaxtime // In case it gets set out way too far
				}
				
				if (DialogLockPickArousalTick > 0 && DialogLockPickSet.filter(x => x==true).length > 0) {
					DialogLockPickArousalText = DialogFind(Player, "LockPickArousal")
					if (DialogLockPickSet.filter(x => x==true).length < DialogLockPickSet.length) {
						for (let P = DialogLockPickOrder.length; P >= 0; P--) {
							if (DialogLockPickSet[DialogLockPickOrder[P]] == true) {
								DialogLockPickOffsetTarget[DialogLockPickOrder[P]] = 0
								DialogLockPickSet[DialogLockPickOrder[P]] = false
								break;
							}
						}
					}
				}
				
				var arousalmod = (0.3 + Math.random()*0.7) * (arousalmaxtime) // happens very often at 100 arousal
				DialogLockPickArousalTick = CurrentTime + DialogLockPickArousalTickTime * arousalmod
			}
			var alpha = "10"
			if (DialogLockPickArousalTick - CurrentTime < 1000) alpha = "70"
			else if (DialogLockPickArousalTick - CurrentTime < 2000) alpha = "50"
			else if (DialogLockPickArousalTick - CurrentTime < 3000) alpha = "30"
			else if (DialogLockPickArousalTick - CurrentTime < 5000) alpha = "20";
			DrawRect(0, 0, 2000, 1000, "#FFB0B0" + alpha);
		} else {
			DialogLockPickArousalText = ""
		}
	}
	
}



/**
 * Starts the dialog progress bar for picking a lock
 * First the challenge level is calculated based on the base lock difficulty, the skill of the rigger and the escapee
 * @param {Character} C - The character who tries to struggle
 * @param {Item} PrevItem - The item, the character wants to unlock
 * @returns {void} - Nothing
 */
function DialogLockPickProgressStart(C, Item) {

	DialogLockPickArousalText = ""
	DialogLockPickArousalTick = 0
	if (Item) {
		DialogLockPickItem = Item
	}

	var lock = InventoryGetLock(Item)
	var LockRating = 1
	var LockPickingImpossible = false
	if (Item != null && lock) {
		// Gets the lock rating
		var BondageLevel = (Item.Difficulty - Item.Asset.Difficulty)
		
		// Gets the required skill / challenge level based on player/rigger skill and item difficulty (0 by default is easy to pick)
		var S = 0;
		S = S + SkillGetWithRatio("LockPicking"); // Add the player evasion level (modified by the effectiveness ratio)
		if (lock.Asset.PickDifficulty && lock.Asset.PickDifficulty > 0) {
			S = S - lock.Asset.PickDifficulty; // Subtract the item difficulty (regular difficulty + player that restrained difficulty)
			LockRating = lock.Asset.PickDifficulty // Some features of the minigame are independent of the relative skill level
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
					LockPickingImpossible = true // The above stuff can make picking the lock impossible. Everything else will make it incrementally harder
				}
				
				if (!C.CanTalk()) S = S - 1; // A little harder while gagged, but it wont make it impossible
				if (InventoryItemHasEffect(InventoryGet(Player, "ItemLegs"), "Block", true)) S = S - 1; // A little harder while legs bound, but it wont make it impossible
				if (InventoryItemHasEffect(InventoryGet(Player, "ItemFeet"), "Block", true)) S = S - 1; // A little harder while legs bound, but it wont make it impossible
				if (InventoryGroupIsBlocked(Player, "ItemFeet")) S = S - 1; // A little harder while wearing something like a legbinder as well
				if (Player.IsBlind()) S = S - 1; // harder while blind
				if (Player.GetDeafLevel() > 0) S = S - Math.Ceiling(Player.GetDeafLevel()/2); // harder while deaf
				
				// No bonus from struggle assist. Lockpicking is a solo activity!
			}
		}
		
		// Gets the number of pins on the lock
		var NumPins = 4
		if (LockRating >= 6) NumPins += 2 // 6 pins for the intricate lock
		if (LockRating >= 8) NumPins += 1 // 7 pins for the exclusive lock
		if (LockRating >= 10) NumPins += 1 // 8 pins for the high security lock
		if (LockRating >= 11) NumPins += 2 // Cap at 10 pins
		

		
			
		// Prepares the progress bar and timer
		DialogLockPickOrder = [];
		DialogLockPickSet = [];
		DialogLockPickSetFalse = [];
		DialogLockPickOffset = [];
		DialogLockPickOffsetTarget = [];
		DialogLockPickImpossiblePins = [];
		DialogLockPickProgressItem = Item;
		DialogLockPickProgressOperation = DialogLockPickProgressGetOperation(C, Item);
		DialogLockPickProgressSkill = Math.floor(NumPins*NumPins/2) + Math.floor(Math.max(0, -S)*Math.max(0, -S)); // Scales squarely, so that more difficult locks provide bigger reward!
		DialogLockPickProgressSkillLose = NumPins*NumPins/2 // Even if you lose you get some reward. You get this no matter what if you run out of tries.
		DialogLockPickProgressChallenge = S * -1;
		DialogLockPickProgressCurrentTries = 0;
		DialogLockPickSuccessTime = 0
		DialogLockPickFailTime = 0
		DialogMenuButtonBuild(C);
		
		
		
		
		for (let P = 0; P < NumPins; P++) {
			DialogLockPickOrder.push(P)
			DialogLockPickSet.push(false)
			DialogLockPickSetFalse.push(false)
			DialogLockPickOffset.push(0)
			DialogLockPickOffsetTarget.push(0)
		}
		/* Randomize array in-place using Durstenfeld shuffle algorithm */
		// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		for (var i = DialogLockPickOrder.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = DialogLockPickOrder[i];
			DialogLockPickOrder[i] = DialogLockPickOrder[j];
			DialogLockPickOrder[j] = temp;
		}
		
		// Initialize persistent pins
		if ((Item.Property == null)) Item.Property = {};
		if (Item.Property != null)
			if ((Item.Property.LockPickSeed == null) || (typeof Item.Property.LockPickSeed != "string")) {Item.Property.LockPickSeed = CommonConvertArrayToString(DialogLockPickOrder); DialogLockPickTotalTries = 0}
			else {
				var conv = CommonConvertStringToArray(Item.Property.LockPickSeed)
				for (let PP = 0; PP < conv.length; PP++) {
						if (typeof conv[PP] != "number") {
							Item.Property.LockPickSeed = CommonConvertArrayToString(DialogLockPickOrder)
							conv = DialogLockPickOrder
							break;
						}
					}
				DialogLockPickOrder = conv
			}
		
		var PickingImpossible = false
		if (S < -6 && LockPickingImpossible) {
			PickingImpossible = true // if picking is impossible, then some pins will never set
			DialogLockPickImpossiblePins.push(DialogLockPickOrder[DialogLockPickOrder.length-1])
			if (NumPins >= 6) DialogLockPickImpossiblePins.push(DialogLockPickOrder[DialogLockPickOrder.length-2])
			if (NumPins >= 8) DialogLockPickImpossiblePins.push(DialogLockPickOrder[DialogLockPickOrder.length-3])
		}

		// At 4 pins we have a base of 16 tries, with 10 maximum permutions possible
		// At 10 pins we have a base of 40-30 tries, with 55 maximum permutions possible
		var NumTries = Math.max(Math.floor(NumPins * (1.5 - 0.3*BondageLevel/10)),
				Math.ceil(NumPins * (3.25 - BondageLevel/10) - Math.max(0, (DialogLockPickProgressChallenge + BondageLevel/2)*1.5)))
			    // negative skill of 1 subtracts 2 from the normal lock and 4 from 10 pin locks,
				// negative skill of 6 subtracts 12 from all locks
	

		DialogLockPickProgressMaxTries = NumTries - NumPins;
	}
}