"use strict";
var PrivateBackground = "Private";
var PrivateVendor = null;
var PrivateCharacter = [];
var PrivateCharacterTypeList = ["NPC_Private_VisitorShy", "NPC_Private_VisitorHorny", "NPC_Private_VisitorTough"];
var PrivateCharacterToSave = 0;
var PrivateReleaseTimer = 0;
var PrivateActivity = "";
var PrivateActivityCount = 0;
var PrivateActivityAffectLove = true;
var PrivateActivityList = ["Gag", "Ungag", "Restrain", "FullRestrain", "Release", "Tickle", "Spank", "Pet", "Slap", "Kiss", "Fondle", "Naked", "Underwear", "RandomClothes", "Shibari"];
var PrivatePunishment = "";
var PrivatePunishmentList = ["Cage", "Bound", "BoundPet", "ChastityBelt", "ChastityBra", "ForceNaked", "ConfiscateKey"];

// Returns TRUE if a specific dialog option is allowed
function PrivateIsCaged() { return (CurrentCharacter.Cage == null) ? false : true }
function PrivateVendorCanPlay() { return (LogQuery("RentRoom", "PrivateRoom") && LogQuery("Wardrobe", "PrivateRoom") && LogQuery("Cage", "PrivateRoom") && Player.CanInteract() && PrivateVendor.CanInteract()) }
function PrivateAllowChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 >= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 < NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateIsRestrained() { return (CurrentCharacter.IsRestrained()) }
function PrivateAllowRestain() { return (CurrentCharacter.IsRestrained() || (ReputationGet("Dominant") + 25 >= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateNobodyGagged() { return (Player.CanTalk() && CurrentCharacter.CanTalk()) }
function PrivateCanMasturbate() { return (CharacterIsNaked(CurrentCharacter) && !CurrentCharacter.IsVulvaChaste() && !Player.IsRestrained()) }
function PrivateCanFondle() { return (!CurrentCharacter.IsBreastChaste() && !Player.IsRestrained()) }
function PrivateAllowRestainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 <= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontRestainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 > NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateAllowReleasePlayer() { return (Player.IsRestrained() && CurrentCharacter.CanInteract() && (CommonTime() > PrivateReleaseTimer) && !PrivateOwnerInRoom()) }
function PrivateWontReleasePlayer() { return (Player.IsRestrained() && CurrentCharacter.CanInteract() && (CommonTime() <= PrivateReleaseTimer) && !PrivateOwnerInRoom()) }
function PrivateWontReleasePlayerOwner() { return (Player.IsRestrained() && CurrentCharacter.CanInteract() && PrivateOwnerInRoom()) }
function PrivateWillKneel() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling() && (ReputationGet("Dominant") > NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontKneel() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling() && (ReputationGet("Dominant") <= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateCannotKneel() { return (!CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling()) }
function PrivateCanStandUp() { return (CurrentCharacter.CanKneel() && CurrentCharacter.IsKneeling()) }
function PrivateCannotStandUp() { return (!CurrentCharacter.CanKneel() && CurrentCharacter.IsKneeling()) }
function PrivateWouldTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") + 50 <= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime >= NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateWontTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && ((ReputationGet("Dominant") + 50 > NPCTraitGet(CurrentCharacter, "Dominant")) || (CurrentCharacter.Love < 50))) }
function PrivateNeedTimeToTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") + 50 <= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime < NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateTrialInProgress() { return ((CurrentTime < NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0)) }
function PrivateTrialDone() { return ((CurrentTime >= NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0)) }
function PrivateTrialCanCancel() { return (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0) }
function PrivateNPCInteraction(LoveFactor) { if ((CurrentCharacter.Love < 60) || (parseInt(LoveFactor) < 0)) NPCLoveChange(CurrentCharacter, LoveFactor); }
function PrivateWillForgive() { return (NPCEventGet(CurrentCharacter, "RefusedActivity") < CurrentTime - 60000) }

// Loads the private room vendor NPC
function PrivateLoad() {
	
	// Loads the vendor and NPC from storage
	PrivateVendor = CharacterLoadNPC("NPC_Private_Vendor");
	PrivateVendor.AllowItem = false;
	if (PrivateCharacter.length == 0) {
		PrivateCharacter.push(Player);
		PrivateLoadCharacter(1);
		PrivateLoadCharacter(2);
		PrivateLoadCharacter(3);
	} else {
		NPCTraitDialog(PrivateVendor);
		for(var C = 1; C < PrivateCharacter.length; C++)
			NPCTraitDialog(PrivateCharacter[C]);
	}

	// Checks if we allow items on each NPC based on their trait and dominant reputation of the player
	if (PrivateCharacter.length >= 2) PrivateCharacter[1].AllowItem = ((ReputationGet("Dominant") + 25 >= NPCTraitGet(PrivateCharacter[1], "Dominant")) || PrivateCharacter[1].IsRestrained());
	if (PrivateCharacter.length >= 3) PrivateCharacter[2].AllowItem = ((ReputationGet("Dominant") + 25 >= NPCTraitGet(PrivateCharacter[2], "Dominant")) || PrivateCharacter[2].IsRestrained());
	if (PrivateCharacter.length >= 4) PrivateCharacter[3].AllowItem = ((ReputationGet("Dominant") + 25 >= NPCTraitGet(PrivateCharacter[3], "Dominant")) || PrivateCharacter[3].IsRestrained());
	PrivateRelationDecay();

}

// Draw all the characters in the private room
function PrivateDrawCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == 4) ? 470 : 500;

	// For each character to draw
	for(var C = 0; C < PrivateCharacter.length; C++) {
		if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageBack.png", X + C * S, 0);
		DrawCharacter(PrivateCharacter[C], X + C * S, 0, 1);
		if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageFront.png", X + C * S, 0);
		DrawButton(X + 145 + C * S, 900, 90, 90, "", "White", "Icons/Character.png");
		if (LogQuery("Cage", "PrivateRoom"))
			if ((Player.Cage == null) || (C == 0))
				if (!PrivateCharacter[C].IsOwner())
					DrawButton(X + 265 + C * S, 900, 90, 90, "", "White", "Icons/Cage.png");
	}
	
}

// Run the private room
function PrivateRun() {
	
	// The vendor is only shown if the room isn't rent
	if (LogQuery("RentRoom", "PrivateRoom")) {
		PrivateDrawCharacter();
		if ((Player.Cage == null) && Player.CanWalk()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Shop.png");
		if (!LogQuery("BlockChange", "Rule")) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Dress.png");
		if (LogQuery("Wardrobe", "PrivateRoom") && !LogQuery("BlockChange", "Rule")) DrawButton(1885, 505, 90, 90, "", "White", "Icons/Wardrobe.png");
	} else {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(PrivateVendor, 1000, 0, 1);
	}
	
	// Standard buttons
	if (Player.CanWalk() && (Player.Cage == null)) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	if (Player.CanKneel()) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Kneel.png");
	
	// If we must save a character status after a dialog
	if (PrivateCharacterToSave > 0) {
		PrivateSaveCharacter(PrivateCharacterToSave);
		PrivateCharacterToSave = 0;
	}

}

// Checks if the user clicked on a cage button
function PrivateClickCharacterButton() {
	
	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == 4) ? 470 : 500;

	// For each character, we find the one to cage, doesn't allow to do it if already in a cage
	for(var C = 0; C < PrivateCharacter.length; C++) {
		if ((MouseX >= X + 265 + C * S) && (MouseX <= X + 355 + C * S))
			if (LogQuery("Cage", "PrivateRoom"))
				if ((Player.Cage == null) || (C == 0))
					if (!PrivateCharacter[C].IsOwner()) {
						PrivateCharacter[C].Cage = (PrivateCharacter[C].Cage == null) ? true : null;
						if (C > 0) PrivateSaveCharacter(C);
					}
		if ((MouseX >= X + 145 + C * S) && (MouseX <= X + 235 + C * S))
			InformationSheetLoadCharacter(PrivateCharacter[C]);
	}

}

// Checks if the user clicked on a character
function PrivateClickCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == 4) ? 470 : 500;

	// For each character, we find the one that was clicked and open it's dialog
	for(var C = 0; C < PrivateCharacter.length; C++)
		if ((MouseX >= X + C * S) && (MouseX <= X + S + C * S)) {
			PrivateCharacterToSave = C;
			if ((PrivateCharacter[C].Stage == "0") && PrivateCharacter[C].IsOwner()) PrivateCharacter[C].Stage = "1000";
			CharacterSetCurrent(PrivateCharacter[C]);
		}

}

// When the user clicks in the private room
function PrivateClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) CharacterSetCurrent(PrivateVendor);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk() && (Player.Cage == null)) { CharacterAppearanceValidate(Player); CommonSetScreen("Room", "MainHall"); }
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235) && LogQuery("RentRoom", "PrivateRoom") && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && LogQuery("RentRoom", "PrivateRoom") && Player.CanWalk() && (Player.Cage == null)) CharacterSetCurrent(PrivateVendor);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && LogQuery("RentRoom", "PrivateRoom") && !LogQuery("BlockChange", "Rule")) { CharacterAppearanceReturnRoom = "Private"; CommonSetScreen("Character", "Appearance"); }
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 505) && (MouseY < 595) && LogQuery("RentRoom", "PrivateRoom") && !LogQuery("BlockChange", "Rule") && LogQuery("Wardrobe", "PrivateRoom")) CommonSetScreen("Character", "Wardrobe");
	if ((MouseX <= 1885) && (MouseY < 900) && LogQuery("RentRoom", "PrivateRoom") && (Player.Cage == null)) PrivateClickCharacter();
	if ((MouseX <= 1885) && (MouseY >= 900) && LogQuery("RentRoom", "PrivateRoom")) PrivateClickCharacterButton();
}

// When the player rents the room
function PrivateRentRoom() {
	CharacterChangeMoney(Player, -250);
	LogAdd("RentRoom", "PrivateRoom");
}

// When the player gets the wardrobe
function PrivateGetWardrobe() {
	CharacterChangeMoney(Player, -100);
	LogAdd("Wardrobe", "PrivateRoom");
}

// When the player gets the cage
function PrivateGetCage() {
	CharacterChangeMoney(Player, -150);
	LogAdd("Cage", "PrivateRoom");
}

// Loads the private room character
function PrivateLoadCharacter(ID) {
	var Char = JSON.parse(localStorage.getItem("BondageClubPrivateRoomCharacter" + Player.AccountName + ID.toString()));
	if (Char != null) {
		var C = CharacterLoadNPC("NPC_Private_Custom");
		C.Name = Char.Name;
		C.AccountName = "NPC_Private_Custom" + ID.toString();
		if (Char.Title != null) C.Title = Char.Title;
		if (Char.Appearance != null) C.Appearance = Char.Appearance.slice();
		if (Char.AppearanceFull != null) C.AppearanceFull = Char.AppearanceFull.slice();
		if (Char.Trait != null) C.Trait = Char.Trait.slice();
		if (Char.Cage != null) C.Cage = Char.Cage;
		if (Char.Event != null) C.Event = Char.Event;
		C.Love = (Char.Love == null) ? 0 : parseInt(Char.Love);
		AssetReload(C);
		NPCTraitDialog(C);
		CharacterRefresh(C);
		PrivateCharacter.push(C);
		if (NPCEventGet(C, "PrivateRoomEntry") == 0) NPCEventAdd(C, "PrivateRoomEntry", CurrentTime - 604800000);
	}
}

// Saves the private room character info
function PrivateSaveCharacter(ID) {
	if (PrivateCharacter[ID] != null) {
		var C = {
			Name: PrivateCharacter[ID].Name,
			Love: PrivateCharacter[ID].Love,
			Title: PrivateCharacter[ID].Title,
			Trait: PrivateCharacter[ID].Trait,
			Cage: PrivateCharacter[ID].Cage,
			AccountName: PrivateCharacter[ID].AccountName,
			Appearance: PrivateCharacter[ID].Appearance.slice(),
			AppearanceFull: PrivateCharacter[ID].AppearanceFull.slice(),
			Event: PrivateCharacter[ID].Event
		};
		localStorage.setItem("BondageClubPrivateRoomCharacter" + Player.AccountName + ID.toString(), JSON.stringify(C));
	} else localStorage.removeItem("BondageClubPrivateRoomCharacter" + Player.AccountName + ID.toString());
};

// When a new character is added to the room
function PrivateAddCharacter(Template, Archetype) {
	var C = CharacterLoadNPC("NPC_Private_Custom");
	C.Name = Template.Name;
	C.AccountName = "NPC_Private_Custom" + PrivateCharacter.length.toString();
	C.Appearance = Template.Appearance.slice();
	C.AppearanceFull = Template.Appearance.slice();
	C.Love = 0;
	if ((Archetype != null) && (Archetype != "")) C.Title = Archetype;
	NPCTraitGenerate(C);
	if ((Archetype != null) && (Archetype == "Mistress")) NPCTraitSet(C, "Dominant", 60 + Math.floor(Math.random() * 41));
	NPCTraitDialog(C);
	CharacterRefresh(C);
	PrivateCharacter.push(C);
	NPCEventAdd(C, "PrivateRoomEntry", CurrentTime);
	PrivateSaveCharacter(PrivateCharacter.length - 1);
	C.AllowItem = ((ReputationGet("Dominant") + 25 >= NPCTraitGet(C, "Dominant")) || C.IsRestrained());
}

// Returns the ID of the private room current character
function PrivateGetCurrentID() {
	if ((PrivateCharacter[3] != null) && (CurrentCharacter.Name == PrivateCharacter[3].Name)) return 3;
	if ((PrivateCharacter[2] != null) && (CurrentCharacter.Name == PrivateCharacter[2].Name)) return 2;
	return 1;
}

// When the player kicks out a character
function PrivateKickOut() {
	var ID = PrivateGetCurrentID();
	PrivateCharacter[ID] = null;
	PrivateCharacter.splice(ID, 1);
	PrivateSaveCharacter(1);
	PrivateSaveCharacter(2);
	PrivateSaveCharacter(3);
	if (PrivateCharacter[1] != null) PrivateCharacter[1].AccountName = "NPC_Private_Custom1";
	if (PrivateCharacter[2] != null) PrivateCharacter[2].AccountName = "NPC_Private_Custom2";
	DialogLeave();
}

// When the player tells the character to change
function PrivateChange(NewCloth) {
	if (NewCloth == "Cloth") CharacterDress(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Underwear") CharacterUnderwear(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Naked") CharacterNaked(CurrentCharacter);
}

// Returns TRUE if the player owner is already in the room
function PrivateOwnerInRoom() {
	for(var C = 1; C < PrivateCharacter.length; C++)
		if (PrivateCharacter[C].IsOwner() && (PrivateCharacter[C].ID != CurrentCharacter.ID))
			return true;
	return false;
}

// When a custom NPC restrains the player, there's a minute timer before release
function PrivateRestrainPlayer() {
	CharacterFullRandomRestrain(Player);
	PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000;
}

// Relationship with any NPC will decay with time, below -100, the NPC leaves if she's not caged
function PrivateRelationDecay() {
	for(var C = 1; C < PrivateCharacter.length; C++) {
		var LastDecay = NPCEventGet(PrivateCharacter[C], "LastDecay");
		if (LastDecay == 0) 
			NPCEventAdd(PrivateCharacter[C], "LastDecay", CurrentTime);
		else 
			if (LastDecay <= CurrentTime - 7200000) {
				var Decay = Math.floor((CurrentTime - LastDecay) / 7200000);
				NPCEventAdd(PrivateCharacter[C], "LastDecay", LastDecay + (Decay * 7200000));
				NPCLoveChange(PrivateCharacter[C], Decay * -1);
				PrivateSaveCharacter(C);
				if ((PrivateCharacter[C].Love <= -100) && (PrivateCharacter[C].Cage == null)) {
					CurrentCharacter = PrivateCharacter[C];
					PrivateKickOut();
				}
			}
	}
}

// When the player starts a submissive trial with an NPC
function PrivateStartTrial(ChangeRep) {
	DialogChangeReputation("Dominant", ChangeRep);
	CharacterDress(CurrentCharacter, CurrentCharacter.AppearanceFull);
	NPCEventAdd(CurrentCharacter, "EndSubTrial", CurrentTime + NPCLongEventDelay(CurrentCharacter));
	NPCLoveChange(CurrentCharacter, 30);
	PrivateSaveCharacter(PrivateGetCurrentID());
}

// When the player stops a submissive trial with an NPC
function PrivateStopTrial(ChangeRep) {
	DialogChangeReputation("Dominant", ChangeRep);
	NPCEventDelete(CurrentCharacter, "EndSubTrial");
	NPCLoveChange(CurrentCharacter, -30);
	PrivateSaveCharacter(PrivateGetCurrentID());
}

// Shows the number or hours remaining for the trial
function PrivateShowTrialHours() {
	CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("DialogHours", Math.ceil((NPCEventGet(CurrentCharacter, "EndSubTrial") - CurrentTime) / 3600000).toString());
}

// Returns TRUE if the player is owned (from the room or not)
function PrivatePlayerIsOwned() {
	if (Player.Owner != "") return true;
	for(var C = 0; C < PrivateCharacter.length; C++)
		if (PrivateCharacter[C].IsOwner())
			return true;
	return false;
}

// Starts a random activity for the player as submissive
function PrivateStartActivity() {

	// Finds a valid activity for the player
	var Act = "";
	var Count = 0;
	while (true) {

		// Picks an activity at random
		Act = CommonRandomItemFromList(PrivateActivity, PrivateActivityList);

		// If the activity is valid
		if ((Act == "Gag") && Player.CanTalk()) break;
		if ((Act == "Ungag") && !Player.CanTalk() && (CommonTime() > PrivateReleaseTimer)) break;
		if ((Act == "Restrain") && (InventoryGet(Player, "ItemArms") == null)) break;
		if ((Act == "FullRestrain") && (InventoryGet(Player, "ItemArms") == null)) break;
		if ((Act == "Release") && Player.IsRestrained() && (CommonTime() > PrivateReleaseTimer)) break;
		if ((Act == "Tickle") && (NPCTraitGet(CurrentCharacter, "Playful") >= 0)) break;
		if ((Act == "Spank") && (NPCTraitGet(CurrentCharacter, "Violent") >= 0)) break;
		if ((Act == "Pet") && (NPCTraitGet(CurrentCharacter, "Peaceful") > 0)) break;
		if ((Act == "Slap") && (CurrentCharacter.Love < 50) && (NPCTraitGet(CurrentCharacter, "Violent") > 0)) break;
		if ((Act == "Kiss") && Player.CanTalk() && (CurrentCharacter.Love >= 50) && (NPCTraitGet(CurrentCharacter, "Horny") >= 0)) break;
		if ((Act == "Fondle") && !Player.IsBreastChaste() && (NPCTraitGet(CurrentCharacter, "Horny") > 0)) break;
		if ((Act == "Naked") && !CharacterIsNaked(Player) && (NPCTraitGet(CurrentCharacter, "Horny") >= 0) && Player.CanChange()) break;
		if ((Act == "Underwear") && !CharacterIsInUnderwear(Player) && Player.CanChange()) break;
		if ((Act == "RandomClothes") && Player.CanChange()) break;
		if ((Act == "Shibari") && Player.CanChange() && (NPCTraitGet(CurrentCharacter, "Wise") >= 0)) break;
		
		// After 100 tries, we give up on picking an activity and the owner ignore the player
		Count++;
		if (Count >= 100) {
			CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "ActivityNone");
			return;
		}

	}

	// Starts the activity (any activity adds +2 love automatically)
	PrivateActivity = Act;
	NPCLoveChange(CurrentCharacter, 2);
	PrivateActivityAffectLove = true;
	PrivateActivityCount = 0;
	CurrentCharacter.Stage = "Activity" + PrivateActivity;
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "Activity" + PrivateActivity + "Intro");

}

// Runs the current activity
function PrivateActivityRun(LoveFactor) {

	// Changes the love factor only once per activity (except if negative)
	PrivateActivityCount++;
	LoveFactor = parseInt(LoveFactor);
	if ((LoveFactor < 0) || PrivateActivityAffectLove) NPCLoveChange(CurrentCharacter, LoveFactor);
	if ((LoveFactor > 0) && PrivateActivityAffectLove) PrivateActivityAffectLove = false;

	// If the player refused to do the activity, she will be either forced, punished or the Domme will stop it
	if (LoveFactor <= -3) {

		// Each factor is randomized and added to a stat, punishment is increased if the another activity was refused in the last 5 minutes
		var Force = Math.random() * 150 + NPCTraitGet(CurrentCharacter, "Violent");
		var Punish = Math.random() * 150 + NPCTraitGet(CurrentCharacter, "Serious");
		var Stop = Math.random() * 150 + NPCTraitGet(CurrentCharacter, "Wise");
		if (NPCEventGet(CurrentCharacter, "RefusedActivity") >= CurrentTime - 300000) Punish = Punish + 100;
		NPCEventAdd(CurrentCharacter, "RefusedActivity", CurrentTime);

		// If we must punish
		if ((Punish > Force) && (Punish > Stop)) {
			CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PunishIntro");
			CurrentCharacter.Stage = "Punish";
			return;
		}

		// If we must stop the activity
		if ((Stop > Force) && (Stop > Punish)) {
			CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "ActivityStop");
			CurrentCharacter.Stage = "1001";
			return;
		}

	}

	// The restraining activities are harsher for serious NPCs
	if (PrivateActivity == "Gag") InventoryWearRandom(Player, "ItemMouth");
	if (PrivateActivity == "Restrain") InventoryWearRandom(Player, "ItemArms");
	if ((PrivateActivity == "FullRestrain") && (NPCTraitGet(CurrentCharacter, "Playful") > 0)) CharacterFullRandomRestrain(Player, "Few");
	if ((PrivateActivity == "FullRestrain") && (NPCTraitGet(CurrentCharacter, "Playful") == 0)) CharacterFullRandomRestrain(Player);
	if ((PrivateActivity == "FullRestrain") && (NPCTraitGet(CurrentCharacter, "Serious") > 0)) CharacterFullRandomRestrain(Player, "Lot");
	if (PrivateActivity == "Release") CharacterRelease(Player);
	if (PrivateActivity == "Ungag") { InventoryRemove(Player, "ItemMouth"); InventoryRemove(Player, "ItemHead"); }
	if ((PrivateActivity == "Gag") || (PrivateActivity == "Restrain") || (PrivateActivity == "FullRestrain")) PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000;
	if (PrivateActivity == "Naked") CharacterNaked(Player);
	if (PrivateActivity == "Underwear") CharacterRandomUnderwear(Player);
	if (PrivateActivity == "RandomClothes") CharacterAppearanceFullRandom(Player, true);

	// In Shibari, the player gets naked and fully roped in hemp
	if (PrivateActivity == "Shibari") {
		CharacterNaked(Player);
		CharacterSetActivePose(Player, null);
		InventoryWear(Player, "HempRope", "ItemArms", "Default", Math.floor(Math.random() * 10) + 1);
		InventoryWear(Player, "HempRope", "ItemLegs", "Default", Math.floor(Math.random() * 10) + 1);
		InventoryWear(Player, "SuspensionHempRope", "ItemFeet", "Default", Math.floor(Math.random() * 10) + 1);
		InventoryWear(Player, "HempRopeHarness", "ItemTorso", "Default", Math.floor(Math.random() * 10) + 1);
		InventoryWearRandom(Player, "ItemMouth");
		PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000;
	}

	// After running the activity a few times, we stop
	if (PrivateActivityCount >= Math.floor(Math.random() * 4) + 2) {
		CurrentCharacter.Stage = "1000";
		CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "Activity" + PrivateActivity + "Outro");
	}

}

// Set the no change rule for the player
function PrivateBlockChange(Minutes) {
	LogAdd("BlockChange", "Rule", CurrentTime + (Minutes * 60000));
	CharacterAppearanceSave(Player);
}

// Starts a random punishment for the player as submissive
function PrivateSelectPunishment() {
	
	// Release the player first
	if (Player.IsRestrained()) {
		CharacterRelease(Player);
		CurrentCharacter.Stage = "PunishReleaseBefore";
		CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PunishReleaseBeforeIntro");
		return;
	}

	// Strip the player second
	if (!Player.IsNaked()) {
		CharacterNaked(Player);
		CurrentCharacter.Stage = "PunishStripBefore";
		CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PunishStripBeforeIntro");
		return;
	}
	
	// Finds a valid punishment for the player
	var Count = 0;
	while (true) {

		// Picks an punishment at random
		PrivatePunishment = CommonRandomItemFromList("", PrivatePunishmentList);
		
		// If the punishment is valid
		if ((PrivatePunishment == "Cage") && (LogQuery("Cage", "PrivateRoom"))) break;
		if (PrivatePunishment == "Bound") break;
		if ((PrivatePunishment == "BoundPet") && !Player.IsVulvaChaste() && (NPCTraitGet(CurrentCharacter, "Playful") >= 0)) break;
		if ((PrivatePunishment == "ChastityBelt") && !Player.IsVulvaChaste() && (NPCTraitGet(CurrentCharacter, "Frigid") >= 0)) break;
		if ((PrivatePunishment == "ChastityBra") && !Player.IsBreastChaste() && (NPCTraitGet(CurrentCharacter, "Frigid") >= 0)) break;
		if ((PrivatePunishment == "ForceNaked") && (NPCTraitGet(CurrentCharacter, "Horny") >= 0)) break;
		if ((PrivatePunishment == "ConfiscateKey") && InventoryAvailable(Player, "MetalCuffsKey", "ItemArms")) break;
		if ((PrivatePunishment == "ConfiscateCrop") && InventoryAvailable(Player, "LeatherCrop", "ItemPelvis")) break;
		if ((PrivatePunishment == "ConfiscateWhip") && InventoryAvailable(Player, "LeatherWhip", "ItemPelvis")) break;

	}

	// Starts the punishment
	CurrentCharacter.Stage = "Punish" + PrivatePunishment;
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "Punish" + PrivatePunishment + "Intro");

}

// Runs the player punishment
function PrivateRunPunishment() {
	if (PrivatePunishment == "Cage") { Player.Cage = true; LogAdd("BlockCage", "Rule", CurrentTime + (150000)); DialogLeave(); }
	if (PrivatePunishment == "Bound") { PrivateReleaseTimer = CommonTime() + 300000; CharacterFullRandomRestrain(Player, "All"); InventoryRemove(Player, "ItemArms"); InventoryWear(Player, "LeatherArmbinder", "ItemArms"); InventorySetDifficulty(Player, "ItemArms", 20); }
	if (PrivatePunishment == "BoundPet") { PrivateReleaseTimer = CommonTime() + 300000; CharacterSetActivePose(Player, "Kneel"); InventoryWear(Player, "LeatherBelt", "ItemLegs"); InventoryWear(Player, "TailButtPlug", "ItemButt"); InventoryWear(Player, "LeatherArmbinder", "ItemArms"); InventorySetDifficulty(Player, "ItemArms", 20); }
	if ((PrivatePunishment == "ChastityBelt") && (NPCTraitGet(CurrentCharacter, "Horny") >= 0) && (InventoryGet(Player, "ItemVulva") == null)) InventoryWear(Player, "VibratingEgg", "ItemVulva");
	if ((PrivatePunishment == "ChastityBelt") && (NPCTraitGet(CurrentCharacter, "Horny") >= 0) && (InventoryGet(Player, "ItemButt") == null)) InventoryWear(Player, "BlackButtPlug", "ItemButt");
	if (PrivatePunishment == "ChastityBelt") InventoryWear(Player, "MetalChastityBelt", "ItemPelvis");
	if (PrivatePunishment == "ChastityBra") InventoryWear(Player, "MetalChastityBra", "ItemBreast");
	if (PrivatePunishment == "ForceNaked") LogAdd("BlockChange", "Rule", CurrentTime + 1800000);
	if (PrivatePunishment == "ConfiscateKey") InventoryDelete(Player, "MetalCuffsKey", "ItemArms");
	if (PrivatePunishment == "ConfiscateCrop") { InventoryDelete(Player, "LeatherCrop", "ItemPelvis"); InventoryDelete(Player, "LeatherCrop", "ItemBreast"); }
	if (PrivatePunishment == "ConfiscateWhip") { InventoryDelete(Player, "LeatherWhip", "ItemPelvis"); InventoryDelete(Player, "LeatherWhip", "ItemBreast"); }
	NPCEventAdd(CurrentCharacter, "RefusedActivity", CurrentTime);
}