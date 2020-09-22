"use strict";
var ManagementBackground = "Management";
var ManagementMistress = null;
var ManagementSub = null;
var ManagementMistressAngryCount = 0;
var ManagementMistressReleaseTimer = 0;
var ManagementPlayerAppearance = null;
var ManagementMistressAllowPlay = false;
var ManagementCanReleaseChastity = true;
var ManagementEmpty = false;
var ManagementRandomGirl = null;
var ManagementRandomGirlArchetype = "";
var ManagementRandomActivityCount = 0;
var ManagementRandomActivity = "";
var ManagementRandomActivityList = ["AddArms", "RemoveArms", "AddGag", "RemoveGag", "AddTorso", "RemoveTorso", "AddFeet", "RemoveFeet", "AddLegs", "RemoveLegs", "Tickle", "Spank", "Kiss", "Fondle", "Masturbate"];
var ManagementRandomActivityCategory = "";
var ManagementRandomActivityCategoryList = ["Activity", "Quiz", "Struggle"];
var ManagementRandomTalkCount = 0;
var ManagementVisitRoom = false;
var ManagementTimer = 0;

/**
 * Checks if the player has a special title such as maid, mistress, kidnapper, etc.
 * @returns {boolean} - TRUE if the player has a special title.
 */
function ManagementNoTitle() { return (!LogQuery("JoinedSorority", "Maid") && !LogQuery("ClubMistress", "Management") && (ReputationGet("Kidnap") < 50) && !SarahUnlockQuest) }
/**
 * Checks if the player has unlocked sarah's quest.
 * @returns {boolean} - TRUE if the player has unlocked sarah's quest.
 */
function ManagementSarahUnlockQuest() { return (SarahUnlockQuest) }
/**
 * Checks if the player is Sarah's owner.
 * @returns {boolean} - TRUE if the player is Sarah's owner.
 */
function ManagementIsSarahOwner() { return (SarahUnlockQuest && (Sarah.Owner == Player.Name)) }
/**
 * Checks if the mistress has been angered for a given amount of times.
 * @param {number} InCount - Number of times the mistress has to have been angered.
 * @returns {boolean} - TRUE if the mistress has been angered the specified amount.
 */
function ManagementGetMistressAngryCount(InCount) { return (InCount == ManagementMistressAngryCount) }
/**
 * Increments the amount of times the mistress has been angered.
 * @returns {void} - Nothing
 */
function ManagementMistressAngryAdd() { ManagementMistressAngryCount++ }
/**
 * Checks if the mistress is willing to release the player. (Based on the release timer)
 * @returns {boolean} - TRUE if the mistress will release the player
 */
function ManagementMistressWillRelease() { return (CommonTime() >= ManagementMistressReleaseTimer) }
/**
 * Checks if the player is about to play with the submissive, albeit without the consent of the mistress.
 * @returns {boolean} - TRUE if the dialog option is available.
 */
function ManagementCanPlayWithoutPermission() { return (!ManagementMistressAllowPlay && Player.CanInteract() && (ManagementMistressReleaseTimer == 0) && !ManagementIsClubSlave()) } 
/**
 * Checks if the player is owned by one of the bondage college NPCs.
 * @returns {boolean} - TRUE if the player is owned by a bondage college NPC
 */
function ManagementOwnerFromBondageCollege() { return ((Player.Owner == "NPC-Sidney") || (Player.Owner == "NPC-Amanda") || (Player.Owner == "NPC-Jennifer")) }
/**
 * Checks if the player's owner is a NPC in her private room.
 * @returns {boolean} - TRUE if the player's owner is in the player's private room.
 */
function ManagementOwnerInPrivateRoom() { return PrivateOwnerInRoom() }
/**
 * Checks if the player's owner is not one of the bondage college NPC.
 * @returns {boolean} - TRUE if the player is NOT owned by a bondage college NPC
 */
function ManagementOwnerAway() { return !((Player.Owner == "NPC-Sidney") || (Player.Owner == "NPC-Amanda") || (Player.Owner == "NPC-Jennifer")) }
/**
 * Checks if the player is wearing any chastity item that can currently be removed by the mistress.
 * @returns {boolean} - TRUE if there is at least one chastity item that can be removed.
 */
function ManagementAllowReleaseChastity() { return (Player.IsChaste() && ManagementCanReleaseChastity && (ManagementCanUnlockBra() || ManagementCanUnlockBelt() || ManagementCanUnlockButt() || ManagementCanUnlockVulva() || ManagementCanUnlockNipples()) )}
/**
 * Checks if the player is chaste, but cannot be released.
 * @returns {boolean} - TRUE if the player is chaste and cannot be released.
 */
function ManagementRefuseReleaseChastity() { return (Player.IsChaste() && !ManagementCanReleaseChastity) }
/**
 * Checks if the player cannot be released by the mistress.
 * @returns {boolean} - TRUE if the player cannot be released.
 */
function ManagementOwnerPending() { return (CommonTime() < ManagementMistressReleaseTimer) }
/**
 * Checks if the player can be released from her chastity items by the mistress
 * @returns {boolean} - TRUE if the release timer has expired and the mistress can release the player from chastity.
 */
function ManagementOwnerAccepted() { return ((CommonTime() >= ManagementMistressReleaseTimer) && ManagementCanReleaseChastity) }
/**
 * Checks if the player can be released by the mistress (timer), but cannot be released from chastity due to her owner.
 * @returns {boolean} - TRUE if the player can be released, but cannot be released from chastity.
 */
function ManagementOwnerRefused() { return ((CommonTime() >= ManagementMistressReleaseTimer) && !ManagementCanReleaseChastity) }
/**
 * Checks if the mistress can remove the player's chastity bra
 * @returns {boolean} - TRUE if the mistress can remove the item. (Not owner locked while owned and has at least 25$.)
 */
function ManagementCanUnlockBra() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemBreast"), "BreastChaste") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemBreast")) || !Player.IsOwned() )) }
/**
 * Checks if the mistress can remove the player's butt item with a chaste effect
 * @returns {boolean} - TRUE if the mistress can remove the item. (Not owner locked while owned and has at least 25$.)
 */
function ManagementCanUnlockButt() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemButt"), "Chaste") && !InventoryGroupIsBlocked(Player, "ItemButt") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemButt")) || !Player.IsOwned())) }
/**
 * Checks if the mistress can remove the player's vulva item with a chaste effect
 * @returns {boolean} - TRUE if the mistress can remove the item. (Not owner locked while owned and has at least 25$.)
 */
function ManagementCanUnlockVulva() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemVulvaPiercings"), "Chaste") && !InventoryGroupIsBlocked(Player, "ItemVulvaPiercings") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemVulvaPiercings")) || !Player.IsOwned())) }
/**
 * Checks if the mistress can remove the player's nipple item with a chaste effect
 * @returns {boolean} - TRUE if the mistress can remove the item. (Not owner locked while owned and has at least 25$.)
 */
function ManagementCanUnlockNipples() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemNipplesPiercings"), "BreastChaste") && !InventoryGroupIsBlocked(Player, "ItemNipplesPiercings") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemNipplesPiercings")) ||!Player.IsOwned())) }
/**
 * Checks if the mistress can remove the player's pelvis item with a chaste effect
 * @returns {boolean} - TRUE if the mistress can remove the item. (Not owner locked while owned and has at least 25$.)
 */
function ManagementCanUnlockBelt() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemPelvis"), "Chaste") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemPelvis")) || !Player.IsOwned())) }
/**
 * Sets the player's chastity release timer to 0.
 * @returns {void} - Nothing.
 */
function ManagementEndChastityRelease() { ManagementMistressReleaseTimer = 0 }
/**
 * Checks if the player can be released from her owner, but for the first time ever.
 * @returns {boolean} - TRUE if the player has at least 60$ and has never been released from an owner before.
 */
function ManagementCanReleaseFromOwnerFirst() { return ((Player.Money >= 60) && !LogQuery("ReleasedFromOwner", "Management")) }
/**
 * Checks if the player can be released from her owner, but has been released before.
 * @returns {boolean} - TRUE if the player has at least 200$ and has been released from an owner before.
 */
function ManagementCanReleaseFromOwner() { return ((Player.Money >= 200) && LogQuery("ReleasedFromOwner", "Management")) }
/**
 * Checks if the player can break an online ownership trial.
 * @returns {boolean} - TRUE if the player can break her trial.
 */
function ManagementCanBreakTrialOnline() { return ((Player.Owner == "") && (Player.Ownership != null) && (Player.Ownership.Stage != null) && (Player.Ownership.Stage == 0)) }
/**
 * Checks if the player can part ways from their online owner. (7 days wait time over)
 * @returns {boolean} - TRUE if the player can break her full collar.
 */
function ManagementCanBeReleasedOnline() { return ((Player.Owner != "") && (Player.Ownership != null) && (Player.Ownership.Start != null) && (Player.Ownership.Start + 604800000 <= CurrentTime)) }
/**
 * Checks if the player cannot part ways from their online owner. (7 days wait time not over)
 * @returns {boolean} - TRUE if the player cannot break her full collar.
 */
function ManagementCannotBeReleasedOnline() { return ((Player.Owner != "") && (Player.Ownership != null) && (Player.Ownership.Start != null) && (Player.Ownership.Start + 604800000 > CurrentTime)) }
/**
 * Checks if the player can part ways from her owner. (The NPC left the private room.)
 * @returns {boolean} - TRUE if the player can part ways with her current NPC owner.
 */
function ManagementCanBeReleased() { return ((Player.Owner != "") && (Player.Ownership == null) && !PrivateOwnerInRoom()) }
/**
 * Checks if the player cannot part ways from her owner. (The NPC is still in the private room.)
 * @returns {boolean} - TRUE if the player cannot part ways with her current NPC owner.
 */
function ManagementCannotBeReleased() { return ((Player.Owner != "") && (Player.Ownership == null) && PrivateOwnerInRoom()) }
/**
 * Checks if the player can be owned by the mistress.
 * @returns {boolean} - TRUE if the player is fully submissive, the player is not owned, the mistress has not been angered and the mistress can enter the private room.
 */
function ManagementWillOwnPlayer() { return ((Player.Owner == "") && (ReputationGet("Dominant") <= -100) && (ManagementMistressAngryCount == 0) && (PrivateCharacter.length <= PrivateCharacterMax) && !PrivatePlayerIsOwned() && ManagementNoMistressInPrivateRoom()) }
/**
 * Checks if the mistress is not willing to own the player.
 * @returns {boolean} - TRUE if the player can be owned, but is not submissive enough.
 */
function ManagementWontOwnPlayer() { return ((Player.Owner == "") && (ReputationGet("Dominant") <= -1) && (ReputationGet("Dominant") >= -99) && (PrivateCharacter.length <= PrivateCharacterMax) && !PrivatePlayerIsOwned() && ManagementNoMistressInPrivateRoom()) }
/**
 * Checks if the player has at least one lover who is a NPC from bondage college.
 * @returns {boolean} - TRUE if the player has at least one lover who is a NPC from bondage college.
 */
function ManagementLoverFromBondageCollege() { var L = Player.GetLoversNumbers(); return ((L.indexOf("NPC-Sidney") >= 0) || (L.indexOf("NPC-Amanda") >= 0) || (L.indexOf("NPC-Jennifer") >= 0)); }
/**
 * Checks if the player can stop dating the given online lover (1 to 5)
 * @param {number} L - Index of the potential lover
 * @returns {boolean} - TRUE if the player can stop dating the specified lover
 */
function ManagementCanBreakDatingLoverOnline(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].Stage != null) && (Player.Lovership[L].Stage != 2)); }
/**
 * Checks if the player can divorce the given online lover (The 1 week waiting period is over)
 * @param {number} L - Index of the potential lover
 * @returns {boolean} - TRUE if the they can get divorced
 */
function ManagementCanBreakUpLoverOnline(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].Stage != null) && (Player.Lovership[L].Stage == 2) && (Player.Lovership[L].Start != null) && (Player.Lovership[L].Start + 604800000 < CurrentTime)); }
/**
 * Checks if the player is not able to divorce the given online lover (The 1 week waiting period is not over)
 * @param {number} L - Index of the potential lover
 * @returns {boolean} - TRUE if the they cannot get divorced
 */
function ManagementCannotBreakUpLoverOnline(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].Stage != null) && (Player.Lovership[L].Stage == 2) && (Player.Lovership[L].Start != null) && (Player.Lovership[L].Start + 604800000 >= CurrentTime)) }
/**
 * Checks if the player can stop dating the given NPC lover (1 to 5)
 * @param {number} L - Index of the potential lover
 * @returns {boolean} - TRUE if the player can stop dating the specified lover. (The NPC is gone from the room.)
 */
function ManagementCanBreakUpLoverNPC(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].MemberNumber == null) && !PrivateLoverInRoom(L)) }
/**
 * Checks if the player cannot stop dating the given NPC lover (1 to 5)
 * @param {number} L - Index of the potential lover
 * @returns {boolean} - TRUE if the player cannot stop dating the specified lover (The lover is still in the player's private room.)
 */
function ManagementCannotBreakUpLoverNPC(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].MemberNumber == null) && PrivateLoverInRoom(L)) }
/**
 * Checks if the player is currently a club slave.
 * @returns {boolean} - TRUE if the player is a club slave.
 */
function ManagementIsClubSlave() { return ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name == "ClubSlaveCollar")) }
/**
 * Checks if the player is wearing a slave collar.
 * @returns {boolean} - TRUE if the player is wearing a slave collar.
 */
function ManagementWearingSlaveCollar() { return ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name == "SlaveCollar")) }
/**
 * Checks if a NPC can be transfered to the player's private room.
 * @returns {boolean} - TRUE if the player owns a private room, has space for an extra NPC and is not locked out of her room.
 */
function ManagementCanTransferToRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax) && !LogQuery("LockOutOfPrivateRoom", "Rule")) }
/**
 * Checks if the mistress is not willing to visit the player's room.
 * @returns {boolean} - TRUE if the mistress could transfer to the player's room, but is not willing to.
 */
function ManagementWontVisitRoom() { return (!ManagementVisitRoom && ManagementCanTransferToRoom()) }
/**
 * Checks if the player can become a club mistress.
 * @returns {boolean} - TRUE if the player is fully dominant, has been in the club for more than a month, is currently not restrained, is not kneeling, can currently change and is currently not a club mistress.
 */
function ManagementCanBeClubMistress() { return ((ReputationGet("Dominant") >= 100) && ((Math.floor((CurrentTime - Player.Creation) / 86400000)) >= 30) && !LogQuery("ClubMistress", "Management") && !Player.IsRestrained() && !Player.IsKneeling() && Player.CanChange()) }
/**
 * Checks if the player is not able to become a club mistress due to her reputation.
 * @returns {boolean} - TRUE if the player could be a club mistress, but has a dominant reputation between 50 and 99.
 */
function ManagementCannotBeClubMistress() { return ((ReputationGet("Dominant") < 100) && (ReputationGet("Dominant") >= 50) && ((Math.floor((CurrentTime - Player.Creation) / 86400000)) >= 30) && !LogQuery("ClubMistress", "Management") && !Player.IsRestrained() && !Player.IsKneeling() && Player.CanChange()) }
/**
 * Checks if the player is not able to become a club mistress due to her reputation (by a large amount, which makes the mistress laugh.)
 * @returns {boolean} - TRUE if the player could be a club mistress, but has a dominant reputation below 50.
 */
function ManagementCannotBeClubMistressLaugh() { return ((ReputationGet("Dominant") < 50) && ((Math.floor((CurrentTime - Player.Creation) / 86400000)) >= 30) && !LogQuery("ClubMistress", "Management") && !Player.IsRestrained() && !Player.IsKneeling() && Player.CanChange()) }
/**
 * Checks if the player is not able to become a club mistress due to her short time in the club.
 * @returns {boolean} - TRUE if the player has been in the club for less than a month.
 */
function ManagementCannotBeClubMistressTime() { return (((Math.floor((CurrentTime - Player.Creation) / 86400000)) < 30) && !LogQuery("ClubMistress", "Management") && !Player.IsRestrained() && !Player.IsKneeling() && Player.CanChange()) }
/**
 * Checks if the player can receive her club mistress pay check.
 * @returns {boolean} - TRUE if the player is a club mistress and has not been paid this week.
 */
function ManagementMistressCanBePaid() { return (LogQuery("ClubMistress", "Management") && !LogQuery("MistressWasPaid", "Management")) }
/**
 * Checks if the player cannot receive her club mistress pay check.
 * @returns {boolean} - TRUE if the player is a club mistress, but has already been paid this week.
 */
function ManagementMistressCannotBePaid() { return (LogQuery("ClubMistress", "Management") && LogQuery("MistressWasPaid", "Management")) }
/**
 * Checks if the player can be a club slave.
 * @returns {boolean} - TRUE if the player is not wearing an owner/lover only restraint and is not too dominant.
 */
function ManagementCanBeClubSlave() { return (!InventoryCharacterHasOwnerOnlyRestraint(Player) && !InventoryCharacterHasLoverOnlyRestraint(Player) && DialogReputationLess("Dominant", -50)) }
/**
 * Checks if the player cannot be a club slave due to her dominant reputation.
 * @returns {boolean} - TRUE if the player is not wearing an owner/lover only restraint, but is too dominant.
 */
function ManagementCannotBeClubSlaveDominant() { return (!InventoryCharacterHasOwnerOnlyRestraint(Player) && !InventoryCharacterHasLoverOnlyRestraint(Player) && DialogReputationGreater("Dominant", -49)) }
/**
 * Checks if the player cannot be a club slave due to her currently worn owner-only restraint(s).
 * @returns {boolean} - TRUE if the player is wearing an owner-only restraint.
 */
function ManagementCannotBeClubSlaveOwnerLock() { return InventoryCharacterHasOwnerOnlyRestraint(Player) }
/**
 * Checks if the player cannot be a club slave due to her currently worn lover-only restraint(s).
 * @returns {boolean} - TRUE if the player is wearing a lover-only restraint.
 */
function ManagementCannotBeClubSlaveLoverLock() { return InventoryCharacterHasLoverOnlyRestraint(Player) }
/**
 * Checks if the player can kiss the current NPC.
 * @returns {boolean} - TRUE if both the NPC and the player can talk. 
 */
function ManagementCanKiss() { return (Player.CanTalk() && CurrentCharacter.CanTalk()) }
/**
 * Checks if the player can masturbate the current NPC.
 * @returns {boolean} - TRUE if the NPC is not chaste and the player can interact.
 */
function ManagementCanMasturbate() { return (Player.CanInteract() && !CurrentCharacter.IsVulvaChaste()) }
/**
 * Checks if the player can play with the management submissive NPC.
 * @returns {boolean} - TRUE if the player's dominant reputation is below 23 and the player is not wearing a locked restraint.
 */
function ManagementCanPlayWithSub() { return (DialogReputationLess("Dominant", 24) && !InventoryCharacterHasLockedRestraint(Player)) }
/**
 * Checks if the player cannot play with the management submissive NPC due to a locked restraint.
 * @returns {boolean} - TRUE if the player's dominant reputation is below 23, but the player is wearing a locked restraint.
 */
function ManagementCannotPlayWithSubLock() { return (DialogReputationLess("Dominant", 24) && InventoryCharacterHasLockedRestraint(Player)) }

/**
 * Checks if there is no mistress in the player's private room.
 * @returns {boolean} - TRUE if there's no other Mistress in the player private room
 */
function ManagementNoMistressInPrivateRoom() {
	if (PrivateCharacter.length <= 1) return true;
	for (let C = 1; C < PrivateCharacter.length; C++)
		if ((PrivateCharacter[C].Title != null) && (PrivateCharacter[C].Title == "Mistress"))
			return false;
	return true;
}

/**
 * Checks if there is a chaste NPC in the player's private room.
 * @returns {boolean} - TRUE if any NPC in the private room is chaste.
 */
function ManagementFriendIsChaste() {
	for (let C = 1; C < PrivateCharacter.length; C++)
		if ((PrivateCharacter[C].AccountName != null) && PrivateCharacter[C].IsChaste())
			return true;
	return false;
}

/**
 * Loads the club management room, creates the Mistress and sub character
 * @returns {void} - Nothing.
 */
function ManagementLoad() {
	ManagementBackground = "Management";
	if ((ManagementMistress == null) && (TextGet("Mistress") != "")) {
		ManagementMistress = CharacterLoadNPC("NPC_Management_Mistress");
		ManagementMistress.Name = TextGet("Mistress") + " " + ManagementMistress.Name;
		ManagementMistress.AllowItem = false;
		ManagementMistressAngryCount = 0;
		ManagementSub = CharacterLoadNPC("NPC_Management_Sub");
		CharacterNaked(ManagementSub);
		InventoryWear(ManagementSub, "SlaveCollar", "ItemNeck");
		CharacterFullRandomRestrain(ManagementSub, "Lot");
		InventoryWear(ManagementSub, "Ears" + (Math.floor(Math.random() * 2) + 1).toString(), "HairAccessory1", "#BBBBBB");
		InventoryWear(ManagementSub, "TailButtPlug", "ItemButt");
		InventoryWear(ManagementSub, "MetalChastityBelt", "ItemPelvis");
		InventoryWear(ManagementSub, "MetalChastityBra", "ItemBreast");
		CharacterSetActivePose(ManagementSub, "Kneel", true);
		ManagementSub.AllowItem = false;
	}
}

/**
 * Run the club management room, draws the player and 2 NPCs (if they are not gone).
 * @returns {void} - Nothing.
 */
function ManagementRun() {
	ManagementLoad();
	DrawCharacter(Player, 250, 0, 1);
	if (!ManagementEmpty) DrawCharacter(ManagementMistress, 750, 0, 1);
	if (!ManagementEmpty) DrawCharacter(ManagementSub, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanKneel()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Kneel.png");
}

/**
 * Handles clicks in the club management room.
 * @returns {void} - Nothing.
 */
function ManagementClick() {
	if (MouseIn(250, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(750, 0, 500, 1000) && !ManagementEmpty) {		
		if ((ManagementMistress.Stage == "0") && ManagementIsClubSlave()) ManagementMistress.Stage = "350";
		if ((ManagementMistress.Stage == "0") && (ReputationGet("Dominant") < 50) && LogQuery("ClubMistress", "Management")) {
			ManagementMistress.Stage = "500";
			ManagementMistress.CurrentDialog = DialogFind(ManagementMistress, "MistressExpulsion");
		}
		if (((ManagementMistress.Stage == "0") || (ManagementMistress.Stage == "5")) && (ReputationGet("Dominant") < 0) && !Player.IsKneeling() && Player.CanKneel()) {
			ReputationProgress("Dominant", 1);
			ManagementMistress.CurrentDialog = DialogFind(ManagementMistress, "KneelToTalk");
			ManagementMistress.Stage = "5";
		}
		if ((ManagementMistress.Stage == "5") && Player.IsKneeling()) ManagementMistress.Stage = "0";
		CharacterSetCurrent(ManagementMistress);
	}
	if (MouseIn(1250, 0, 500, 1000) && !ManagementEmpty) CharacterSetCurrent(ManagementSub);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1885, 265, 90, 90) && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null, true);
}

/**
 * Triggered when the mistress releases the player and dress her back
 * @returns {void} - Nothing.
 */
function ManagementPlayerStrip() {
	ManagementPlayerAppearance = Player.Appearance.slice();
	CharacterRelease(Player);
	CharacterNaked(Player);
}

/**
 * Triggered when the mistress straps a tight armbinder on the player for 2 minutes.
 * @param {number} ChangeRep - The value the player's Dominant reputation should be altered by
 * @returns {void} - Nothing.
 */
function ManagementPlayerArmbinder(ChangeRep) {
	if (ChangeRep != 0) DialogChangeReputation("Dominant", ChangeRep);
	InventoryWear(Player, "LeatherArmbinder", "ItemArms");
	InventorySetDifficulty(Player, "ItemArms", 20);
	ManagementMistressReleaseTimer = CommonTime() + 120000;
}

/**
 * Triggered when the mistress straps many restrains and chastity items on the player. The mistress will refuse to free the player afterwards.
 * @returns {void} - Nothing.
 */
function ManagementPlayerRandomRestrain() {
	CharacterFullRandomRestrain(Player, "Lot");
	if (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemPelvis"))) {
		InventoryWear(Player, "MetalChastityBelt", "ItemPelvis");
		InventoryLock(Player, "ItemPelvis", "MistressPadlock", -1);
	}
	if (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemBreast"))) {
		InventoryWear(Player, "MetalChastityBra", "ItemBreast");
		InventoryLock(Player, "ItemBreast", "MistressPadlock", -1);
	}
	ManagementCanReleaseChastity = false;
}

/**
 * Triggered when the player starts playing with the management submissive. The player is restrained.
 * @returns {void} - Nothing.
 */
function ManagementPlayerRandomRestrainPlay() {
	CharacterFullRandomRestrain(Player, "Lot");
	ManagementMistressAllowPlay = true;
}

/**
 * Triggered when the mistress releases the player and dresses her back.
 * @returns {void} - Nothing.
 */
function ManagementPlayerRelease() {
	CharacterRelease(Player);
	CharacterDress(Player, ManagementPlayerAppearance);
	ManagementMistressAllowPlay = false;
	ManagementMistressReleaseTimer = 0;
}

/**
 * Triggered when the player switches from the sub to the Mistress because the mistress is angry.
 * @returns {void} - Nothing.
 */
function ManagementSwitchToAngryMistress() {
	ManagementSub.Stage = "0";
	if (ManagementMistressAngryCount >= 3) {
		ManagementMistress.Stage = "11";
		CharacterSetCurrent(ManagementMistress);
		ManagementMistress.CurrentDialog = DialogFind(ManagementMistress, "TouchSubPunishment");
	} else {
		ManagementMistress.Stage = "30";
		CharacterSetCurrent(ManagementMistress);
		ManagementMistressAngryCount++;
		ManagementMistress.CurrentDialog = DialogFind(ManagementMistress, "TouchSubAngry" + ManagementMistressAngryCount.toString());
	}
}

/**
 * Triggered when the mistress releases all girls that are locked in chastity items in the player's private room.
 * @returns {void} - Nothing.
 */
function ManagementReleasePrivateRoom() {
	for (let P = 1; P < PrivateCharacter.length; P++) {
		if (PrivateCharacter[P].IsVulvaChaste()) InventoryRemove(PrivateCharacter[P], "ItemPelvis");
		if (PrivateCharacter[P].IsBreastChaste()) InventoryRemove(PrivateCharacter[P], "ItemBreast");
		ServerPrivateCharacterSync();
	}
	CharacterChangeMoney(Player, -50);
}

/**
 * Triggered when the player pays to have a chastity item unlocked.
 * @param {string} ItemGroup - The group of the item to unlock.
 * @returns {void} - Nothing.
 */
function ManagementUnlockItem(ItemGroup) {
	InventoryRemove(Player, ItemGroup);
	CharacterChangeMoney(Player, -25);
}

/**
 * Triggered when the mistress will contact the player's NPC owner
 * @returns {void} - Nothing.
 */
function ManagementContactOwner() {
	ManagementMistressReleaseTimer = CommonTime() + 200000 + Math.floor(Math.random() * 200000);
	CharacterChangeMoney(Player, -20);
	ManagementCanReleaseChastity = (Math.random() >= 0.3);
	if (Player.Owner == "NPC-Sidney") ManagementCanReleaseChastity = (Math.random() >= 0.6);
}

/**
 * Triggered when the mistress releases the player from her owner.
 * @param {number} RepChange - The amount of dominant reputation the player will lose.
 * @returns {void} - Nothing.
 */
function ManagementReleaseFromOwner(RepChange) {
	Player.Owner = "";
	ServerPlayerSync();
	InventoryRemove(Player, "ItemNeck");
	ReputationProgress("Dominant", RepChange);
	LogAdd("ReleasedFromOwner", "Management");
	LogDelete("ReleasedCollar", "OwnerRule");
	if ((Player.Ownership != null) && (Player.Ownership.MemberNumber != null)) ServerSend("AccountOwnership", { MemberNumber: Player.Ownership.MemberNumber, Action: "Break" });
}

/**
 * Breaks the online trial period and removes any owner locked items.
 * @returns {void} - Nothing.
 */
function ManagementBreakTrialOnline() {
	if ((Player.Ownership != null) && (Player.Ownership.MemberNumber != null)) {
		ServerSend("AccountOwnership", { MemberNumber: Player.Ownership.MemberNumber, Action: "Break" });
		Player.Ownership = null;
		for (let A = 0; A < Player.Appearance.length; A++)
			ServerValidateProperties(Player, Player.Appearance[A]);
	}
}

/**
 * Triggered when the Mistress breaks the bond between lovers.
 * @param {number} L - Index of the lover to remove. 
 * @returns {void} - Nothing.
 */
function ManagementBreakLover(L) {
	Player.Lover = "";
	ServerSend("AccountLovership", { MemberNumber: Player.Lovership[L].MemberNumber ? Player.Lovership[L].MemberNumber : -1, Name: Player.Lovership[L].Name, Action: "Break" });
	ServerPlayerSync();
}

/**
 * Triggered when the Mistress leaves her job to go see the player
 * @param {number} RepChange - The amount of dominant reputation the player will gain.
 * @returns {void} - Nothing.
 */
function ManagementSendMistressToPrivateRoom(RepChange) {
	ReputationProgress("Dominant", RepChange);
	ManagementEmpty = true;
	CurrentScreen = "Private";
	ManagementMistress.Name = ManagementMistress.Name.replace(TextGet("Mistress") + " ", "");
	PrivateAddCharacter(ManagementMistress, "Mistress");
	CurrentScreen = "Management";
	DialogLeave();
}

/**
 * Triggered when the Mistress locks the club slave collar on the player.
 * @param {number} RepChange - The amount of dominant reputation the player will lose.
 * @returns {void} - Nothing.
 */
function ManagementClubSlaveCollar(RepChange) {
	ReputationProgress("Dominant", RepChange);
	CharacterRelease(Player);
	InventoryWear(Player, "ClubSlaveCollar", "ItemNeck");
	LogAdd("ClubSlave", "Management", CurrentTime + 3600000);
	LogAdd("BlockChange", "Rule", CurrentTime + 3600000);
	TitleSet("ClubSlave");
}

/**
 * Triggered when the player finishes the club slave contract.
 * @param {number} RepChange - The amount of dominant reputation the player will gain or lose.
 * @returns {void} - Nothing.
 */
function ManagementFinishClubSlave(RepChange) {
	ReputationProgress("Dominant", RepChange);
	CharacterChangeMoney(Player, 80);
	if (Player.IsOwned() && !LogQuery("ReleasedCollar", "OwnerRule")) InventoryWear(Player, "SlaveCollar", "ItemNeck");
	else {
		InventoryRemove(Player, "ItemNeck");
	}
	if (Player.IsNaked()) CharacterDress(Player, ManagementPlayerAppearance);
}

/**
 * Triggered when the player gets stopped by a random girl while the player is a club slave.
 * @returns {void} - Nothing.
 */
function ManagementClubSlaveRandomIntro() {
	
	// Sets the girl that greets the club slave player
	CommonSetScreen("Room", "Management");
	ManagementBackground = "MainHall";
	ManagementRandomGirl = null;
	CharacterDelete("NPC_Management_RandomGirl");	
	ManagementRandomGirl = CharacterLoadNPC("NPC_Management_RandomGirl");	
	CharacterSetCurrent(ManagementRandomGirl);
	ManagementRandomGirl.AllowItem = false;
	ManagementRandomActivityCount = 0;

	// Picks a random category of activities from the list
	ManagementRandomActivityCategory = CommonRandomItemFromList(ManagementRandomActivityCategory, ManagementRandomActivityCategoryList);
	ManagementRandomGirl.Stage = ManagementRandomActivityCategory + "Intro";

	// 1 out of 7 girls will be a maid
	var Intro = (Math.floor(Math.random() * 7)).toString();
	if (Intro == "0") {
		CharacterArchetypeClothes(ManagementRandomGirl, "Maid");
		ManagementRandomGirlArchetype = "Maid";
	} else ManagementRandomGirlArchetype = "";

	// If the player is already tied up, there's a different intro
	if (Player.CanInteract()) ManagementRandomGirl.CurrentDialog = DialogFind(ManagementRandomGirl, "Intro" + Intro);
	else ManagementRandomGirl.CurrentDialog = DialogFind(ManagementRandomGirl, "IntroRestrained" + Intro);

}

/**
 * Triggered when the player meets a random club slave while the player is a club mistress.
 * @returns {void} - Nothing.
 */
function ManagementFindClubSlaveRandomIntro() {

	// Sets the girl that greets the club slave player
	CommonSetScreen("Room", "Management");
	ManagementBackground = "MainHall";
	ManagementRandomGirl = null;
	CharacterDelete("NPC_Management_RandomGirl");
	ManagementRandomGirl = CharacterLoadNPC("NPC_Management_RandomGirl");
	ManagementRandomGirl.AllowItem = !ManagementIsClubSlave();
	CharacterNaked(ManagementRandomGirl);
	ManagementRandomActivityCount = 0;
	ManagementRandomTalkCount = 0;
	ManagementVisitRoom = ((Math.random() >= 0.67) && ManagementCanTransferToRoom());

	// At 0, the club slave player meets another slave.  At 1, 2 & 3, the club slave isn't restrained.  At 4 and more, the club slave is restrained.
	var Intro = (Math.floor(Math.random() * 6) + 1).toString();
	if (ManagementIsClubSlave()) Intro = "0";
	ManagementRandomGirl.Stage = "ClubSlaveIntro" + Intro;
	if (Intro == "4") CharacterFullRandomRestrain(ManagementRandomGirl, "FEW");
	if (Intro == "5") CharacterFullRandomRestrain(ManagementRandomGirl, "LOT");
	if (Intro == "6") CharacterFullRandomRestrain(ManagementRandomGirl, "ALL");
	if (Intro != "6") {
		InventoryRemove(ManagementRandomGirl, "ItemMouth");
		InventoryRemove(ManagementRandomGirl, "ItemMouth2");
		InventoryRemove(ManagementRandomGirl, "ItemMouth3");
		InventoryRemove(ManagementRandomGirl, "ItemHead");
	}
	InventoryWear(ManagementRandomGirl, "ClubSlaveCollar", "ItemNeck");
	CharacterSetCurrent(ManagementRandomGirl);
	ManagementRandomGirl.CurrentDialog = DialogFind(ManagementRandomGirl, "ClubSlaveIntroText" + Intro);

}

/**
 * Triggered when a random club management activity starts.
 * @param {string} A - Name of the activity being started.
 * @returns {void} - Nothing.
 */
function ManagementRandomActivityStart(A) {
	ManagementRandomActivity = A;
	ManagementRandomGirl.CurrentDialog = DialogFind(ManagementRandomGirl, "Activity" + A + "Intro");
	ManagementRandomGirl.Stage = "Activity" + A;
}

/**
 * Launches a random club slave activity.
 * @returns {void} - Nothing.
 */
function ManagementClubSlaveRandomActivityLaunch() {
	
	// After 4 activities, there's more and more chances that it will stop
	ManagementRandomActivityCount++;
	if (Math.random() * ManagementRandomActivityCount >= 4) {
		if ((Math.random() >= 0.5) && (!Player.CanInteract() || !Player.CanTalk())) {
			CharacterRelease(Player);
			ManagementRandomGirl.CurrentDialog = DialogFind(ManagementRandomGirl, "ActivityEndReleaseIntro");
		} else ManagementRandomGirl.CurrentDialog = DialogFind(ManagementRandomGirl, "ActivityEndIntro");
		ManagementRandomGirl.Stage = "ActivityEnd";
		ManagementVisitRoom = ((Math.random() >= 0.5) && ManagementCanTransferToRoom());
		return;
	}

	// Finds an activity to do on the player
	while (true) {

		// Picks an activity at random
		var A = CommonRandomItemFromList(ManagementRandomActivity, ManagementRandomActivityList);

		// Add or remove an item
		if ((A == "AddArms") && (InventoryGet(Player, "ItemArms") == null)) { InventoryWearRandom(Player, "ItemArms", 3); ManagementRandomActivityStart(A); return; }
		if ((A == "RemoveArms") && (InventoryGet(Player, "ItemArms") != null)) { InventoryRemove(Player, "ItemArms"); ManagementRandomActivityStart(A); return; }
		if ((A == "AddGag") && (InventoryGet(Player, "ItemMouth") == null)) { InventoryWearRandom(Player, "ItemMouth", 3); ManagementRandomActivityStart(A); return; }
		if ((A == "RemoveGag") && (InventoryGet(Player, "ItemMouth") != null)) { InventoryRemove(Player, "ItemMouth"); InventoryRemove(Player, "ItemMouth2"); InventoryRemove(Player, "ItemMouth3"); ManagementRandomActivityStart(A); return; }
		if ((A == "AddTorso") && (InventoryGet(Player, "ItemTorso") == null)) { InventoryWearRandom(Player, "ItemTorso", 3); ManagementRandomActivityStart(A); return; }
		if ((A == "RemoveTorso") && (InventoryGet(Player, "ItemTorso") != null)) { InventoryRemove(Player, "ItemTorso"); ManagementRandomActivityStart(A); return; }
		if ((A == "AddFeet") && (InventoryGet(Player, "ItemFeet") == null)) { InventoryWearRandom(Player, "ItemFeet", 3); ManagementRandomActivityStart(A); return; }
		if ((A == "RemoveFeet") && (InventoryGet(Player, "ItemFeet") != null)) { InventoryRemove(Player, "ItemFeet"); ManagementRandomActivityStart(A); return; }
		if ((A == "AddLegs") && (InventoryGet(Player, "ItemLegs") == null)) { InventoryWearRandom(Player, "ItemLegs", 3); ManagementRandomActivityStart(A); return; }
		if ((A == "RemoveLegs") && (InventoryGet(Player, "ItemLegs") != null)) { InventoryRemove(Player, "ItemLegs"); ManagementRandomActivityStart(A); return; }

		// Physical activities
		if ((A == "Kiss") && (InventoryGet(Player, "ItemMouth") == null) && (InventoryGet(Player, "ItemMouth2") == null) && (InventoryGet(Player, "ItemMouth3") == null)) { ManagementRandomActivityStart(A); return; }
		if ((A == "Spank") || (A == "Tickle")) { ManagementRandomActivityStart(A); return; }
		if ((A == "Fondle") && !Player.IsBreastChaste()) { ManagementRandomActivityStart(A); return; }
		if ((A == "Masturbate") && !Player.IsVulvaChaste()) { ManagementRandomActivityStart(A); return; }
		
	}
}

/**
 * Triggered when the random activity stops.
 * @param {number} RepChange - Amount of dominant reputation to gain or lose.
 * @returns {void} - Nothing.
 */
function ManagementClubSlaveRandomActivityEnd(RepChange) {
	ReputationProgress("Dominant", RepChange);
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

/**
 * Triggered when the player transfers the random NPC to her room.
 * @returns {void} - Nothing.
 */
function ManagementClubSlaveTransferToRoom() {
	ManagementClubSlaveRandomActivityEnd(2);
	InventoryRemove(Player, "ItemFeet");
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(ManagementRandomGirl, ManagementRandomGirlArchetype);
}

/**
 * Triggered when the player earns the mistress clothes.
 * @param {string} Color - The color of the outfit
 * @returns {void} - Nothing.
 */
function ManagementGetMistressOutfit(Color) {
	CharacterRelease(Player);
	CharacterArchetypeClothes(Player, "Mistress", Color);
	ServerPlayerInventorySync();
}

/**
 * Triggered when the player starts the Mistress introduction cutscene.
 * @returns {void} - Nothing.
 */
function ManagementPlayerMistressCutscene() {
	LogAdd("ClubMistress", "Management");
	LogAdd("MistressWasPaid", "Management", CurrentTime + 604800000);
	DialogLeave();
	ManagementMistress.Stage = "0";
	CommonSetScreen("Cutscene", "PlayerMistress");
}

/**
 * Triggered when the player receives her weekly 100$ mistress pay.
 * @returns {void} - Nothing.
 */
function ManagementMistressPay() {
	LogAdd("MistressWasPaid", "Management", CurrentTime + 604800000);
	CharacterChangeMoney(Player, 100);
}

/**
 * Triggered when the player gets kicked out of the Mistress community
 * @returns {void} - Nothing.
 */
function ManagementMistressKicked() {
	LogAdd("BlockChange", "Rule", CurrentTime + 3600000);
	LogDelete("ClubMistress", "Management");
	LoginMistressItems();
	ReputationProgress("Dominant", -6);
	ServerPlayerInventorySync();
}

/**
 * Unlocks Sarah if the player is already her owner
 * @returns {void} - Nothing.
 */
function ManagementFreeSarah() {
	ReputationProgress("Dominant", 4);
	SarahUnlock();
}

/**
 * Fully restrains the player for the struggle activity
 * @returns {void} - Nothing.
 */
function ManagementActivityStruggleRestrain() {
	CharacterFullRandomRestrain(Player, "ALL");
}

/**
 * Starts the struggle game
 * @returns {void} - Nothing.
 */
function ManagementActivityStruggleStart() {
	ManagementTimer = CurrentTime + 60000;
	DialogLeave();
	EmptyBackground = "MainHall";
	EmptyCharacterOffset = 0;
	EmptyCharacter = [];
	EmptyCharacter.push(Player);
	EmptyCharacter.push(ManagementRandomGirl);
	CommonSetScreen("Room", "Empty");
}

/**
 * Starts the quiz game (picks a question at random)
 * @returns {void} - Nothing.
 */
function ManagementStartQuiz() {
	var Q = (Math.floor(Math.random() * 20)).toString();
	CurrentCharacter.Stage = "QuizAnswer" + Q;
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "QuizQuestion" + Q);
}

/**
 * Removes gagging items from the player.
 * @returns {void} - Nothing.
 */
function ManagementRemoveGag() {
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(Player, "ItemMouth2");
	InventoryRemove(Player, "ItemMouth3");
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemHood");
}

/**
 * Locks the player in the timer cell for 5 minutes.
 * @returns {void} - Nothing.
 */
function ManagementCell() {
	DialogLeave();
	CharacterFullRandomRestrain(Player, "ALL");
	CellLock(5);
}

/**
 * Returns to the main hall.
 * @returns {void} - Nothing.
 */
function ManagementMainHall() {
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

/**
 * Runs an activity with a random club slave. (Reputation is only added for the first 3 activities)
 * @param {string} ActivityType - The type of the club slave activity performed.
 * @param {number} RepChange - Amount of dominant reputation to gain or lose.
 * @returns {void} - Nothing.
 */
function ManagementClubSlaveActiviy(ActivityType, RepChange) {
	if (ActivityType == "Talk") {
		ManagementRandomTalkCount++;
		ReputationProgress("Dominant", RepChange);
		DialogRemove();
	} else {
		ManagementRandomActivityCount++;
		if (ManagementRandomActivityCount <= 3) ReputationProgress("Dominant", RepChange);
	}
}

/**
 * Triggered after player with a club slave. There's a 50% chance the club slave will go to the player's private room.
 * @returns {void} - Nothing. 
 */
function ManagementClubSlaveVisitRoom() {
	if ((ManagementRandomTalkCount >= 2) && (ManagementRandomActivityCount >= 2) && ManagementVisitRoom && ManagementRandomGirl.CanTalk()) {
		CommonSetScreen("Room", "Private");
		PrivateAddCharacter(ManagementRandomGirl, "Submissive");
		CommonSetScreen("Room", "Management");
		ManagementBackground = "MainHall";
		ManagementRandomGirl.Stage = "ClubSlaveVisit";
		ManagementRandomGirl.CurrentDialog = DialogFind(ManagementRandomGirl, "ClubSlaveWillVisit");
	}
}

/**
 * Triggered when the player asks to have her slave collar model changed
 * @param {string} NewType - The new slave collar type to change to. 
 * @returns {void} - Nothing. 
 */
function ManagementChangeSlaveCollarType(NewType) {
	var Collar = InventoryGet(Player, "ItemNeck");
	var TypeProperties = InventoryItemNeckSlaveCollarTypes.find(T => T.Name == NewType);
	if (!TypeProperties) Collar.Property = null;
	else Collar.Property = TypeProperties.Property;
	CharacterRefresh(Player);
	CharacterChangeMoney(Player, -30);
}

/**
 * Sets the given NPC's dialog based on if the player is a club slave or not. Some NPC are not available or have special dialog for club slaves.
 * @param {Character} C - Current NPC.
 * @returns {void} - Nothing. 
 */
function ManagementClubSlaveDialog(C) {
	if ((C != null) && (C.Stage == "0") && ManagementIsClubSlave()) C.Stage = "ClubSlave";
	if ((C != null) && (C.Stage == "ClubSlave") && !ManagementIsClubSlave()) C.Stage = "0";
}
