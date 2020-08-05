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

// Returns TRUE if the dialog situation is allowed
function ManagementNoTitle() { return (!LogQuery("JoinedSorority", "Maid") && !LogQuery("ClubMistress", "Management") && (ReputationGet("Kidnap") < 50) && !SarahUnlockQuest) }
function ManagementSarahUnlockQuest() { return (SarahUnlockQuest) }
function ManagementIsSarahOwner() { return (SarahUnlockQuest && (Sarah.Owner == Player.Name)) }
function ManagementGetMistressAngryCount(InCount) { return (InCount == ManagementMistressAngryCount) }
function ManagementMistressAngryAdd() { ManagementMistressAngryCount++ }
function ManagementMistressWillRelease() { return (CommonTime() >= ManagementMistressReleaseTimer) }
function ManagementCanPlayWithoutPermission() { return (!ManagementMistressAllowPlay && Player.CanInteract() && (ManagementMistressReleaseTimer == 0) && !ManagementIsClubSlave()) } 
function ManagementOwnerFromBondageCollege() { return ((Player.Owner == "NPC-Sidney") || (Player.Owner == "NPC-Amanda") || (Player.Owner == "NPC-Jennifer")) }
function ManagementOwnerInPrivateRoom() { return PrivateOwnerInRoom() }
function ManagementOwnerAway() { return !((Player.Owner == "NPC-Sidney") || (Player.Owner == "NPC-Amanda") || (Player.Owner == "NPC-Jennifer")) }
function ManagementAllowReleaseChastity() { return (Player.IsChaste() && ManagementCanReleaseChastity && (ManagementCanUnlockBra() || ManagementCanUnlockBelt() || ManagementCanUnlockButt() || ManagementCanUnlockVulva() || ManagementCanUnlockNipples()) )}
function ManagementRefuseReleaseChastity() { return (Player.IsChaste() && !ManagementCanReleaseChastity) }
function ManagementOwnerPending() { return (CommonTime() < ManagementMistressReleaseTimer) }
function ManagementOwnerAccepted() { return ((CommonTime() >= ManagementMistressReleaseTimer) && ManagementCanReleaseChastity) }
function ManagementOwnerRefused() { return ((CommonTime() >= ManagementMistressReleaseTimer) && !ManagementCanReleaseChastity) }
function ManagementCanUnlockBra() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemBreast"), "BreastChaste") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemBreast")) || !Player.IsOwned() )) }
function ManagementCanUnlockButt() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemButt"), "Chaste") && !InventoryGroupIsBlocked(Player, "ItemButt") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemButt")) || !Player.IsOwned())) }
function ManagementCanUnlockVulva() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemVulvaPiercings"), "Chaste") && !InventoryGroupIsBlocked(Player, "ItemVulvaPiercings") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemVulvaPiercings")) || !Player.IsOwned())) }
function ManagementCanUnlockNipples() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemNipplesPiercings"), "BreastChaste") && !InventoryGroupIsBlocked(Player, "ItemNipplesPiercings") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemNipplesPiercings")) ||!Player.IsOwned())) }
function ManagementCanUnlockBelt() { return ((Player.Money >= 25) && InventoryItemHasEffect(InventoryGet(Player, "ItemPelvis"), "Chaste") && (!InventoryOwnerOnlyItem(InventoryGet(Player, "ItemPelvis")) || !Player.IsOwned())) }
function ManagementEndChastityRelease() { ManagementMistressReleaseTimer = 0 }
function ManagementCanReleaseFromOwnerFirst() { return ((Player.Money >= 60) && !LogQuery("ReleasedFromOwner", "Management")) }
function ManagementCanReleaseFromOwner() { return ((Player.Money >= 200) && LogQuery("ReleasedFromOwner", "Management")) }
function ManagementCanBreakTrialOnline() { return ((Player.Owner == "") && (Player.Ownership != null) && (Player.Ownership.Stage != null) && (Player.Ownership.Stage == 0)) }
function ManagementCanBeReleasedOnline() { return ((Player.Owner != "") && (Player.Ownership != null) && (Player.Ownership.Start != null) && (Player.Ownership.Start + 604800000 <= CurrentTime)) }
function ManagementCannotBeReleasedOnline() { return ((Player.Owner != "") && (Player.Ownership != null) && (Player.Ownership.Start != null) && (Player.Ownership.Start + 604800000 > CurrentTime)) }
function ManagementCanBeReleased() { return ((Player.Owner != "") && (Player.Ownership == null) && !PrivateOwnerInRoom()) }
function ManagementCannotBeReleased() { return ((Player.Owner != "") && (Player.Ownership == null) && PrivateOwnerInRoom()) }
function ManagementWillOwnPlayer() { return ((Player.Owner == "") && (ReputationGet("Dominant") <= -100) && (ManagementMistressAngryCount == 0) && (PrivateCharacter.length <= PrivateCharacterMax) && !PrivatePlayerIsOwned() && ManagementNoMistressInPrivateRoom()) }
function ManagementWontOwnPlayer() { return ((Player.Owner == "") && (ReputationGet("Dominant") <= -1) && (ReputationGet("Dominant") >= -99) && (PrivateCharacter.length <= PrivateCharacterMax) && !PrivatePlayerIsOwned() && ManagementNoMistressInPrivateRoom()) }
function ManagementLoverFromBondageCollege() { var L = Player.GetLoversNumbers(); return ((L.indexOf("NPC-Sidney") >= 0) || (L.indexOf("NPC-Amanda") >= 0) || (L.indexOf("NPC-Jennifer") >= 0)); }
function ManagementCanBreakDatingLoverOnline(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].Stage != null) && (Player.Lovership[L].Stage != 2)); }
function ManagementCanBreakUpLoverOnline(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].Stage != null) && (Player.Lovership[L].Stage == 2) && (Player.Lovership[L].Start != null) && (Player.Lovership[L].Start + 604800000 < CurrentTime)); }
function ManagementCannotBreakUpLoverOnline(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].Stage != null) && (Player.Lovership[L].Stage == 2) && (Player.Lovership[L].Start != null) && (Player.Lovership[L].Start + 604800000 >= CurrentTime)) }
function ManagementCanBreakUpLoverNPC(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].MemberNumber == null) && !PrivateLoverInRoom(L)) }
function ManagementCannotBreakUpLoverNPC(L) { return ((Player.Lovership.length > L) && (Player.Lovership[L].MemberNumber == null) && PrivateLoverInRoom(L)) }
function ManagementIsClubSlave() { return ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name == "ClubSlaveCollar")) }
function ManagementWearingSlaveCollar() { return ((InventoryGet(Player, "ItemNeck") != null) && (InventoryGet(Player, "ItemNeck").Asset.Name == "SlaveCollar")) }
function ManagementCanTransferToRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax) && !LogQuery("LockOutOfPrivateRoom", "Rule")) }
function ManagementWontVisitRoom() { return (!ManagementVisitRoom && ManagementCanTransferToRoom()) }
function ManagementCanBeClubMistress() { return ((ReputationGet("Dominant") >= 100) && ((Math.floor((CurrentTime - Player.Creation) / 86400000)) >= 30) && !LogQuery("ClubMistress", "Management") && !Player.IsRestrained() && !Player.IsKneeling() && Player.CanChange()) }
function ManagementCannotBeClubMistress() { return ((ReputationGet("Dominant") < 100) && (ReputationGet("Dominant") >= 50) && ((Math.floor((CurrentTime - Player.Creation) / 86400000)) >= 30) && !LogQuery("ClubMistress", "Management") && !Player.IsRestrained() && !Player.IsKneeling() && Player.CanChange()) }
function ManagementCannotBeClubMistressLaugh() { return ((ReputationGet("Dominant") < 50) && ((Math.floor((CurrentTime - Player.Creation) / 86400000)) >= 30) && !LogQuery("ClubMistress", "Management") && !Player.IsRestrained() && !Player.IsKneeling() && Player.CanChange()) }
function ManagementCannotBeClubMistressTime() { return (((Math.floor((CurrentTime - Player.Creation) / 86400000)) < 30) && !LogQuery("ClubMistress", "Management") && !Player.IsRestrained() && !Player.IsKneeling() && Player.CanChange()) }
function ManagementMistressCanBePaid() { return (LogQuery("ClubMistress", "Management") && !LogQuery("MistressWasPaid", "Management")) }
function ManagementMistressCannotBePaid() { return (LogQuery("ClubMistress", "Management") && LogQuery("MistressWasPaid", "Management")) }
function ManagementCanBeClubSlave() { return (!InventoryCharacterHasOwnerOnlyRestraint(Player) && !InventoryCharacterHasLoverOnlyRestraint(Player) && DialogReputationLess("Dominant", -50)) }
function ManagementCannotBeClubSlaveDominant() { return (!InventoryCharacterHasOwnerOnlyRestraint(Player) && !InventoryCharacterHasLoverOnlyRestraint(Player) && DialogReputationGreater("Dominant", -49)) }
function ManagementCannotBeClubSlaveOwnerLock() { return InventoryCharacterHasOwnerOnlyRestraint(Player) }
/**
 * Checks, if the player is wearing a lover locked restraint
 * @returns {boolean} - Returns true, if the player wears a lover locked item, false otherwise
 */
function ManagementCannotBeClubSlaveLoverLock() { return InventoryCharacterHasLoverOnlyRestraint(Player) }
function ManagementCanKiss() { return (Player.CanTalk() && CurrentCharacter.CanTalk()) }
function ManagementCanMasturbate() { return (Player.CanInteract() && !CurrentCharacter.IsVulvaChaste()) }
function ManagementCanPlayWithSub() { return (DialogReputationLess("Dominant", 24) && !InventoryCharacterHasLockedRestraint(Player)) }
function ManagementCannotPlayWithSubLock() { return (DialogReputationLess("Dominant", 24) && InventoryCharacterHasLockedRestraint(Player)) }

// Returns TRUE if there's no other Mistress in the player private room
function ManagementNoMistressInPrivateRoom() {
	if (PrivateCharacter.length <= 1) return true;
	for (var C = 1; C < PrivateCharacter.length; C++)
		if ((PrivateCharacter[C].Title != null) && (PrivateCharacter[C].Title == "Mistress"))
			return false;
	return true;
}

// Returns TRUE if any friend in the private room is chaste
function ManagementFriendIsChaste() {
	for (var C = 1; C < PrivateCharacter.length; C++)
		if ((PrivateCharacter[C].AccountName != null) && PrivateCharacter[C].IsChaste())
			return true;
	return false;
}

// Loads the club management room, creates the Mistress and sub character
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
		CharacterSetActivePose(ManagementSub, "Kneel");
		ManagementSub.AllowItem = false;
	}
}

// Run the management room, draw the 2 characters
function ManagementRun() {
	ManagementLoad();
	DrawCharacter(Player, 250, 0, 1);
	if (!ManagementEmpty) DrawCharacter(ManagementMistress, 750, 0, 1);
	if (!ManagementEmpty) DrawCharacter(ManagementSub, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanKneel()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Kneel.png");
}

// When the user clicks in the management room
function ManagementClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000) && !ManagementEmpty) {		
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
	if ((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000) && !ManagementEmpty) CharacterSetCurrent(ManagementSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
}

// Releases the player and dress her back
function ManagementPlayerStrip() {
	ManagementPlayerAppearance = Player.Appearance.slice();
	CharacterRelease(Player);
	CharacterNaked(Player);
}

// Straps a tight armbinder on the player for 2 players
function ManagementPlayerArmbinder(ChangeRep) {
	if (ChangeRep != 0) DialogChangeReputation("Dominant", ChangeRep);
	InventoryWear(Player, "LeatherArmbinder", "ItemArms");
	InventorySetDifficulty(Player, "ItemArms", 20);
	ManagementMistressReleaseTimer = CommonTime() + 120000;
}

// Straps many restrains and chastity items on the player
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

// Starts the submissive play mode for the player
function ManagementPlayerRandomRestrainPlay() {
	CharacterFullRandomRestrain(Player, "Lot");
	ManagementMistressAllowPlay = true;
}

// Releases the player and dress her back
function ManagementPlayerRelease() {
	CharacterRelease(Player);
	CharacterDress(Player, ManagementPlayerAppearance);
	ManagementMistressAllowPlay = false;
	ManagementMistressReleaseTimer = 0;
}

// When the player switches from the sub to the Mistress because she's angry
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

// Releases all girls that are locked in chastity items in the private room
function ManagementReleasePrivateRoom() {
	for (var P = 1; P < PrivateCharacter.length; P++) {
		if (PrivateCharacter[P].IsVulvaChaste()) InventoryRemove(PrivateCharacter[P], "ItemPelvis");
		if (PrivateCharacter[P].IsBreastChaste()) InventoryRemove(PrivateCharacter[P], "ItemBreast");
		ServerPrivateCharacterSync();
	}
	CharacterChangeMoney(Player, -50);
}

// When the player gets unlocked
function ManagementUnlockItem(ItemGroup) {
	InventoryRemove(Player, ItemGroup);
	CharacterChangeMoney(Player, -25);
}

// When the Mistress will contact the player owner
function ManagementContactOwner() {
	ManagementMistressReleaseTimer = CommonTime() + 200000 + Math.floor(Math.random() * 200000);
	CharacterChangeMoney(Player, -20);
	ManagementCanReleaseChastity = (Math.random() >= 0.3);
	if (Player.Owner == "NPC-Sidney") ManagementCanReleaseChastity = (Math.random() >= 0.6);
}

// When the Mistress releases the player from her owner
function ManagementReleaseFromOwner(RepChange) {
	Player.Owner = "";
	ServerPlayerSync();
	InventoryRemove(Player, "ItemNeck");
	InventoryRemove(Player, "ItemNeckAccessories");
	InventoryRemove(Player, "ItemNeckRestraints");
	ReputationProgress("Dominant", RepChange);
	LogAdd("ReleasedFromOwner", "Management");
	if ((Player.Ownership != null) && (Player.Ownership.MemberNumber != null)) ServerSend("AccountOwnership", { MemberNumber: Player.Ownership.MemberNumber, Action: "Break" });
}

// Breaks the online trial period and removes any owner locked items
function ManagementBreakTrialOnline() {
	if ((Player.Ownership != null) && (Player.Ownership.MemberNumber != null)) {
		ServerSend("AccountOwnership", { MemberNumber: Player.Ownership.MemberNumber, Action: "Break" });
		Player.Ownership = null;
		for (var A = 0; A < Player.Appearance.length; A++)
			ServerValidateProperties(Player, Player.Appearance[A]);
	}
}

// When the Mistress breaks the bond between lovers
function ManagementBreakLover(L) {
	Player.Lover = "";
	ServerSend("AccountLovership", { MemberNumber: Player.Lovership[L].MemberNumber ? Player.Lovership[L].MemberNumber : -1, Name: Player.Lovership[L].Name, Action: "Break" });
	ServerPlayerSync();
}

// When the Mistress leaves her job to go see the player
function ManagementSendMistressToPrivateRoom(RepChange) {
	ReputationProgress("Dominant", RepChange);
	ManagementEmpty = true;
	CurrentScreen = "Private";
	ManagementMistress.Name = ManagementMistress.Name.replace(TextGet("Mistress") + " ", "");
	PrivateAddCharacter(ManagementMistress, "Mistress");
	CurrentScreen = "Management";
	DialogLeave();
}

// When the Mistress locks the club slave collar on the player
function ManagementClubSlaveCollar(RepChange) {
	ReputationProgress("Dominant", RepChange);
	CharacterRelease(Player);
	InventoryWear(Player, "ClubSlaveCollar", "ItemNeck");
	LogAdd("ClubSlave", "Management", CurrentTime + 3600000);
	LogAdd("BlockChange", "Rule", CurrentTime + 3600000);
	TitleSet("ClubSlave");
}

// When the player finishes the club slave contract
function ManagementFinishClubSlave(RepChange) {
	ReputationProgress("Dominant", RepChange);
	CharacterChangeMoney(Player, 80);
	if (Player.IsOwned()) InventoryWear(Player, "SlaveCollar", "ItemNeck");
	else {
		InventoryRemove(Player, "ItemNeck");
		InventoryRemove(Player, "ItemNeckAccessories");
		InventoryRemove(Player, "ItemNeckRestraints");
	}
	if (Player.IsNaked()) CharacterDress(Player, ManagementPlayerAppearance);
}

// When the player as club slave gets stopped by a random girl
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

// When the player meets a random club slave
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

// When a random activity starts
function ManagementRandomActivityStart(A) {
	ManagementRandomActivity = A;
	ManagementRandomGirl.CurrentDialog = DialogFind(ManagementRandomGirl, "Activity" + A + "Intro");
	ManagementRandomGirl.Stage = "Activity" + A;
}

// Club slave random activity
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

// When the random activities stops
function ManagementClubSlaveRandomActivityEnd(RepChange) {
	ReputationProgress("Dominant", RepChange);
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

// When the player transfers the random girl to her room
function ManagementClubSlaveTransferToRoom() {
	ManagementClubSlaveRandomActivityEnd(2);
	InventoryRemove(Player, "ItemFeet");
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(ManagementRandomGirl, ManagementRandomGirlArchetype);
}

// When the player gets the Mistress clothes
function ManagementGetMistressOutfit(Color) {
	CharacterRelease(Player);
	CharacterArchetypeClothes(Player, "Mistress", Color);
	ServerPlayerInventorySync();
}

// When the player starts the Mistress introduction party
function ManagementPlayerMistressCutscene() {
	LogAdd("ClubMistress", "Management");
	LogAdd("MistressWasPaid", "Management", CurrentTime + 604800000);
	DialogLeave();
	ManagementMistress.Stage = "0";
	CommonSetScreen("Cutscene", "PlayerMistress");
}

// When the player gets her Mistress pay
function ManagementMistressPay() {
	LogAdd("MistressWasPaid", "Management", CurrentTime + 604800000);
	CharacterChangeMoney(Player, 100);
}

// When the player gets kicked out of the Mistress community
function ManagementMistressKicked() {
	LogAdd("BlockChange", "Rule", CurrentTime + 3600000);
	LogDelete("ClubMistress", "Management");
	LoginMistressItems();
	ReputationProgress("Dominant", -6);
	ServerPlayerInventorySync();
}

// Frees Sarah if the player is already her owner
function ManagementFreeSarah() {
	ReputationProgress("Dominant", 4);
	SarahUnlock();
}

// Fully restrains the player for the struggle activity
function ManagementActivityStruggleRestrain() {
	CharacterFullRandomRestrain(Player, "ALL");
}

// Starts the struggle game
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

// Starts the quiz game (picks a question at random)
function ManagementStartQuiz() {
	var Q = (Math.floor(Math.random() * 20)).toString();
	CurrentCharacter.Stage = "QuizAnswer" + Q;
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "QuizQuestion" + Q);
}

// Locks the player in a cell for 5 minutes
function ManagementRemoveGag() {
	InventoryRemove(Player, "ItemMouth");
	InventoryRemove(Player, "ItemMouth2");
	InventoryRemove(Player, "ItemMouth3");
	InventoryRemove(Player, "ItemHead");
	InventoryRemove(Player, "ItemHood");
}

// Locks the player in a cell for 5 minutes
function ManagementCell() {
	DialogLeave();
	CharacterFullRandomRestrain(Player, "ALL");
	CellLock(5);
}

// Returns to the main hall
function ManagementMainHall() {
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

// Runs an activity with a random club slave
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

// If the player talked and played with the club slave, there's a 50% chance she will go to the player's room
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

// When the player wants to change her slave collar model
function ManagementChangeSlaveCollarType(NewType) {
	var Collar = InventoryGet(Player, "ItemNeck");
	if (NewType == "") Collar.Property = null;
	else Collar.Property = { Type: NewType, Effect: [] };
	CharacterRefresh(Player);
	CharacterChangeMoney(Player, -30);
}

// Some NPC won't be available if the player is a club slave, they will have a special dialog for that
function ManagementClubSlaveDialog(C) {
	if ((C != null) && (C.Stage == "0") && ManagementIsClubSlave()) C.Stage = "ClubSlave";
	if ((C != null) && (C.Stage == "ClubSlave") && !ManagementIsClubSlave()) C.Stage = "0";
}