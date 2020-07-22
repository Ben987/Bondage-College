"use strict";
var PrivateBackground = "Private";
var PrivateVendor = null;
var PrivateCharacter = [];
var PrivateCharacterOffset = 0;
var PrivateCharacterTypeList = ["NPC_Private_VisitorShy", "NPC_Private_VisitorHorny", "NPC_Private_VisitorTough"];
var PrivateCharacterToSave = 0;
var PrivateCharacterMax = 4;
var PrivateReleaseTimer = 0;
var PrivateActivity = "";
var PrivateActivityCount = 0;
var PrivateActivityAffectLove = true;
var PrivateActivityList = ["Gag", "Ungag", "Restrain", "RestrainOther", "FullRestrain", "FullRestrainOther", "Release", "Tickle", "Spank", "Pet", "Slap", "Kiss", "Fondle", "Naked", "Underwear", "RandomClothes", "CollegeClothes", "Shibari", "Gift", "PetGirl", "Locks"];
var PrivateActivityTarget = null;
var PrivatePunishment = "";
var PrivatePunishmentList = ["Cage", "Bound", "BoundPet", "ChastityBelt", "ChastityBra", "ForceNaked", "ConfiscateKey", "ConfiscateCrop", "ConfiscateWhip", "SleepCage", "LockOut", "Cell"];
var PrivateCharacterNewClothes = null;
var PrivateSlaveImproveType = "";
var PrivateNextLoveYou = 0;
var PrivateLoverActivity = "";
var PrivateLoverActivityList = ["Skip1", "Skip2", "Kiss", "FrenchKiss", "Caress", "Rub", "MasturbateHand", "MasturbateTongue", "MasturbatePlayer", "MasturbateSelf", "Underwear", "Naked", "EggInsert", "LockBelt", "UnlockBelt", "EggSpeedUp", "EggSpeedDown"];
var PrivateBeltList = ["LeatherChastityBelt", "SleekLeatherChastityBelt", "StuddedChastityBelt", "MetalChastityBelt", "PolishedChastityBelt", "OrnateChastityBelt", "SteelChastityPanties"];

// Returns TRUE if a specific dialog option is allowed
function PrivateIsCaged() { return (CurrentCharacter.Cage == null) ? false : true }
function PrivateCanGetSecondExtension() { return (LogQuery("Expansion", "PrivateRoom") && !LogQuery("SecondExpansion", "PrivateRoom")) }
function PrivateVendorCanPlay() { return (LogQuery("RentRoom", "PrivateRoom") && LogQuery("Wardrobe", "PrivateRoom") && LogQuery("Cage", "PrivateRoom") && LogQuery("Expansion", "PrivateRoom") && Player.CanInteract() && PrivateVendor.CanInteract()) }
function PrivateAllowChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 >= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 < NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateIsRestrained() { return (CurrentCharacter.IsRestrained()) }
function PrivateAllowRestain() { return (CurrentCharacter.AllowItem) }
function PrivateNobodyGagged() { return (Player.CanTalk() && CurrentCharacter.CanTalk()) }
function PrivateCanMasturbate() { return (CharacterIsNaked(CurrentCharacter) && !CurrentCharacter.IsVulvaChaste() && !Player.IsRestrained()) }
function PrivateCanFondle() { return (!CurrentCharacter.IsBreastChaste() && !Player.IsRestrained()) }
function PrivateAllowRestainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 <= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontRestainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 > NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateAllowReleasePlayer() { return (Player.IsRestrained() && !InventoryCharacterHasOwnerOnlyRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && ((CommonTime() > PrivateReleaseTimer) || CurrentCharacter.IsOwnedByPlayer()) && !PrivateOwnerInRoom()) }
function PrivateWontReleasePlayer() { return (Player.IsRestrained() && !InventoryCharacterHasOwnerOnlyRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && !((CommonTime() > PrivateReleaseTimer) || CurrentCharacter.IsOwnedByPlayer()) && !PrivateOwnerInRoom()) }
function PrivateWontReleasePlayerOwner() { return (Player.IsRestrained() && !InventoryCharacterHasOwnerOnlyRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && PrivateOwnerInRoom()) }
function PrivateWontReleasePlayerOwnerOnly() { return (Player.IsRestrained() && InventoryCharacterHasOwnerOnlyRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract()) }
function PrivateWillKneel() { return (CurrentCharacter.CanKneel() && CurrentCharacter.CanTalk() && !CurrentCharacter.IsKneeling() && ((ReputationGet("Dominant") > NPCTraitGet(CurrentCharacter, "Dominant")) || CurrentCharacter.IsOwnedByPlayer())) }
function PrivateWillKneelGagged() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.CanTalk() && !CurrentCharacter.IsKneeling() && ((ReputationGet("Dominant") > NPCTraitGet(CurrentCharacter, "Dominant")) || CurrentCharacter.IsOwnedByPlayer())) }
function PrivateWontKneel() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling() && (ReputationGet("Dominant") <= NPCTraitGet(CurrentCharacter, "Dominant")) && !CurrentCharacter.IsOwnedByPlayer()) }
function PrivateCannotKneel() { return (!CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling()) }
function PrivateCanStandUp() { return (CurrentCharacter.CanKneel() && CurrentCharacter.CanTalk() && CurrentCharacter.IsKneeling()) }
function PrivateCanStandUpGagged() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.CanTalk() && CurrentCharacter.IsKneeling()) }
function PrivateCannotStandUp() { return (!CurrentCharacter.CanKneel() && CurrentCharacter.IsKneeling()) }
function PrivateWouldTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (NPCTraitGet(CurrentCharacter, "Dominant") >= -50) && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") + 50 <= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateWontTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (NPCTraitGet(CurrentCharacter, "Dominant") >= -50) && ((ReputationGet("Dominant") + 50 > NPCTraitGet(CurrentCharacter, "Dominant")) || (CurrentCharacter.Love < 50))) }
function PrivateNeedTimeToTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (NPCTraitGet(CurrentCharacter, "Dominant") >= -50) && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") + 50 <= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateNeverTakePlayerAsSub() { return (NPCTraitGet(CurrentCharacter, "Dominant") < -50) }
function PrivateTrialInProgress() { return ((Player.Owner == "") && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0)) }
function PrivateTrialDoneEnoughLove() { return ((Player.Owner == "") && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0) && (CurrentCharacter.Love >= 90)) }
function PrivateTrialDoneNotEnoughLove() { return ((Player.Owner == "") && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0) && (CurrentCharacter.Love < 90)) }
function PrivateTrialCanCancel() { return ((Player.Owner == "") && NPCEventGet(CurrentCharacter, "EndSubTrial") > 0) }
function PrivateWillForgive() { return (NPCEventGet(CurrentCharacter, "RefusedActivity") < CurrentTime - 60000) }
function PrivateCanAskUncollar() { return (DialogIsOwner() && (NPCEventGet(CurrentCharacter, "PlayerCollaring") > 0) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PlayerCollaring") + NPCLongEventDelay(CurrentCharacter))); }
function PrivateCannotAskUncollar() { return (DialogIsOwner() && (NPCEventGet(CurrentCharacter, "PlayerCollaring") > 0) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PlayerCollaring") + NPCLongEventDelay(CurrentCharacter))); }
function PrivateIsMistress() { return ((CurrentCharacter.Title != null) && (CurrentCharacter.Title == "Mistress")); }
function PrivateWouldTakePlayerAsDom() { return (!Player.IsKneeling() && !Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !CurrentCharacter.IsOwned() && (NPCTraitGet(CurrentCharacter, "Dominant") <= 50) && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") - 50 >= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateWontTakePlayerAsDom() { return (!Player.IsKneeling() && !Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !CurrentCharacter.IsOwned() && (NPCTraitGet(CurrentCharacter, "Dominant") <= 50) && ((CurrentCharacter.Love < 50) || (ReputationGet("Dominant") - 50 < NPCTraitGet(CurrentCharacter, "Dominant")))) }
function PrivateNeedTimeToTakePlayerAsDom() { return (!Player.IsKneeling() && !Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !CurrentCharacter.IsOwned() && (NPCTraitGet(CurrentCharacter, "Dominant") <= 50) && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") - 50 >= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateNeverTakePlayerAsDom() { return (!CurrentCharacter.IsRestrained() && NPCTraitGet(CurrentCharacter, "Dominant") > 50) }
function PrivateIsHappy() { return (CurrentCharacter.Love > 30) }
function PrivateIsUnhappy() { return (CurrentCharacter.Love < -30) }
function PrivateIsNeutral() { return ((CurrentCharacter.Love >= -30) && (CurrentCharacter.Love <= 30)) }
function PrivateIsLoverHappy() { return ((CurrentCharacter.Love > 30) && CurrentCharacter.IsLoverPrivate()) }
function PrivateIsLoverUnhappy() { return ((CurrentCharacter.Love < -30) && CurrentCharacter.IsLoverPrivate()) }
function PrivateIsLoverNeutral() { return ((CurrentCharacter.Love >= -30) && (CurrentCharacter.Love <= 30) && CurrentCharacter.IsLoverPrivate()) }
function PrivateSubTrialInProgress() { return ((NPCEventGet(CurrentCharacter, "EndDomTrial") > 0) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndDomTrial"))) }
function PrivateSubTrialOverWilling() { return ((NPCEventGet(CurrentCharacter, "EndDomTrial") > 0) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndDomTrial")) && (CurrentCharacter.Love >= 90)) }
function PrivateSubTrialOverUnwilling() { return ((NPCEventGet(CurrentCharacter, "EndDomTrial") > 0) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndDomTrial")) && (CurrentCharacter.Love < 90)) }
function PrivateCanPet() { return ((CurrentCharacter.Love >= 0) && !CurrentCharacter.IsRestrained() && (InventoryGet(Player, "ItemArms") != null) && (InventoryGet(Player, "ItemArms").Asset.Name == "BitchSuit")) }
function PrivateCanSellSlave() { return (!Player.IsRestrained() && (CurrentCharacter.Love >= 0) && (CurrentCharacter.Name != "Amanda") && (CurrentCharacter.Name != "Sarah") && (CurrentCharacter.Name != "Sophie") && (CurrentCharacter.Name != "Jennifer") && (CurrentCharacter.Name != "Sidney") && (NPCEventGet(CurrentCharacter, "NPCCollaring") > 0)) }
function PrivateCannotSellSlave() { return (!Player.IsRestrained() && (CurrentCharacter.Love < 0) && (CurrentCharacter.Name != "Amanda") && (CurrentCharacter.Name != "Sarah") && (CurrentCharacter.Name != "Sophie") && (CurrentCharacter.Name != "Jennifer") && (CurrentCharacter.Name != "Sidney") && (NPCEventGet(CurrentCharacter, "NPCCollaring") > 0)) }
function PrivateCanGetCollegeClothes() { return (!InventoryAvailable(Player, "CollegeOutfit1", "Cloth") && ((CurrentCharacter.Name == "Amanda") || (CurrentCharacter.Name == "Sarah") || (CurrentCharacter.Name == "Jennifer") || (CurrentCharacter.Name == "Sidney"))) }
function PrivateIsLover() { return CurrentCharacter.IsLoverPrivate() }
function PrivateWillTakePlayerAsLover() { return (((CurrentCharacter.Lover == null) || (CurrentCharacter.Lover == "")) && (Player.Lovership.length < 5) && (CurrentCharacter.Love >= 50) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongLoverEventDelay(CurrentCharacter))) }
function PrivateWontTakePlayerAsLover() { return (((CurrentCharacter.Lover == null) || (CurrentCharacter.Lover == "")) && (Player.Lovership.length < 5) && ((CurrentCharacter.Love < 50) || (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongLoverEventDelay(CurrentCharacter)))) }
function PrivateWontTakePlayerAsLoverAlreadyDating() { return ((CurrentCharacter.Lover != null) && (CurrentCharacter.Lover != "") && (CurrentCharacter.Lover != Player.Name) && (Player.Lovership.length < 5)) }
function PrivateWontTakePlayerAsLoverPlayerDating() { return (((CurrentCharacter.Lover == null) || (CurrentCharacter.Lover == "")) && (Player.Lovership.length >= 5)) }

// Loads the private room vendor NPC
function PrivateLoad() {

	// Saves the private character new clothes
	if (PrivateCharacterNewClothes != null) {
		PrivateCharacterNewClothes.AppearanceFull = PrivateCharacterNewClothes.Appearance;
		ServerPrivateCharacterSync();
		PrivateCharacterNewClothes = null;
	}

	// Loads the vendor and NPCs, also check for relationship decay
	PrivateVendor = CharacterLoadNPC("NPC_Private_Vendor");
	PrivateVendor.AllowItem = false;
	NPCTraitDialog(PrivateVendor);
	for (var C = 1; C < PrivateCharacter.length; C++)
		PrivateLoadCharacter(C);
	PrivateRelationDecay();

}

// Draw all the characters in the private room
function PrivateDrawCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - ((PrivateCharacter.length - PrivateCharacterOffset) * 250);
	if (X < 0) X = 0;

	// For each character to draw (maximum 4 at a time)
	for (var C = PrivateCharacterOffset; (C < PrivateCharacter.length && C < PrivateCharacterOffset + 4); C++) {

		// If the character is rent, she won't show in the room but her slot is still taken
		if (NPCEventGet(PrivateCharacter[C], "SlaveMarketRent") <= CurrentTime) {

			// If the character is sent to the asylum, she won't show in the room but her slot is still taken
			if (NPCEventGet(PrivateCharacter[C], "AsylumSent") <= CurrentTime) {
		
				// Draw the NPC and the cage if needed
				if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageBack.png", X + (C - PrivateCharacterOffset) * 470, 0);
				DrawCharacter(PrivateCharacter[C], X + (C - PrivateCharacterOffset) * 470, 0, 1);
				if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageFront.png", X + (C - PrivateCharacterOffset) * 470, 0);
				if (LogQuery("Cage", "PrivateRoom") && !LogQuery("BlockCage", "Rule"))
					if ((Player.Cage == null) || (C == 0))
						if (!PrivateCharacter[C].IsOwner())
							DrawButton(X + 205 + (C - PrivateCharacterOffset) * 470, 900, 90, 90, "", "White", "Icons/Cage.png");

			} else {

				// Draw the "X on rental for a day" text
				DrawText(PrivateCharacter[C].Name, X + 235 + (C - PrivateCharacterOffset) * 470, 420, "White", "Black");
				DrawText(TextGet("AsylumDay"), X + 235 + (C - PrivateCharacterOffset) * 470, 500, "White", "Black");

			}

		} else {

			// Draw the "X on rental for a day" text
			DrawText(PrivateCharacter[C].Name, X + 235 + (C - PrivateCharacterOffset) * 470, 420, "White", "Black");
			DrawText(TextGet("RentalDay"), X + 235 + (C - PrivateCharacterOffset) * 470, 500, "White", "Black");

		}

		// Draw the profile and switch position buttons
		DrawButton(X + 85 + (C - PrivateCharacterOffset) * 470, 900, 90, 90, "", "White", "Icons/Character.png");
		if ((C > 0) && (C < PrivateCharacter.length - 1)) DrawButton(X + 325 + (C - PrivateCharacterOffset) * 470, 900, 90, 90, "", "White", "Icons/Next.png");

	}

}

// Run the private room
function PrivateRun() {

	// The vendor is only shown if the room isn't rent
	if (LogQuery("RentRoom", "PrivateRoom")) {
		PrivateDrawCharacter();
		if ((Player.Cage == null) && Player.CanWalk()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Shop.png");
		if (Player.CanChange()) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Dress.png");
		if (LogQuery("Wardrobe", "PrivateRoom") && Player.CanChange()) DrawButton(1885, 505, 90, 90, "", "White", "Icons/Wardrobe.png");
		if (LogQuery("Expansion", "PrivateRoom")) DrawButton(1885, 625, 90, 90, "", "White", "Icons/Next.png");
	} else {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(PrivateVendor, 1000, 0, 1);
	}

	// Standard buttons
	if (Player.CanWalk() && (Player.Cage == null)) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	if (LogQuery("RentRoom", "PrivateRoom") && Player.CanKneel()) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Kneel.png");

	// In orgasm mode, we add a pink filter and different controls depending on the stage
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.Active != null) && (Player.ArousalSettings.Active != "Inactive") && (Player.ArousalSettings.Active != "NoMeter")) {
		if ((Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {
			DrawRect(0, 0, 2000, 1000, "#FFB0B0B0");
			if (Player.ArousalSettings.OrgasmStage == null) Player.ArousalSettings.OrgasmStage = 0;
			if (Player.ArousalSettings.OrgasmStage == 0) {
				DrawText(TextGet("OrgasmComing"), 1000, 410, "White", "Black");
				DrawButton(700, 532, 250, 64, TextGet("OrgasmTryResist"), "White");
				DrawButton(1050, 532, 250, 64, TextGet("OrgasmSurrender"), "White");
			}
			if (Player.ArousalSettings.OrgasmStage == 1) DrawButton(ActivityOrgasmGameButtonX + 500, ActivityOrgasmGameButtonY, 250, 64, ActivityOrgasmResistLabel, "White");
			if (Player.ArousalSettings.OrgasmStage == 2) DrawText(TextGet("OrgasmRecovering"), 1000, 500, "White", "Black");
			ActivityOrgasmProgressBar(550, 970);
		} else if ((Player.ArousalSettings.Progress != null) && (Player.ArousalSettings.Progress >= 91) && (Player.ArousalSettings.Progress <= 99)) DrawRect(0, 0, 2000, 1000, "#FFB0B040");
	}

	// If we must save a character status after a dialog
	if (PrivateCharacterToSave > 0) {
		ServerPrivateCharacterSync();
		PrivateCharacterToSave = 0;
	}

}

// Checks if the user clicked on a button below a character
function PrivateClickCharacterButton() {
	
	// Defines the character position in the private screen
	var X = 1000 - ((PrivateCharacter.length - PrivateCharacterOffset) * 250);
	if (X < 0) X = 0;

	// For each character, we check if the player clicked on the cage or information button
	for (var C = PrivateCharacterOffset; (C < PrivateCharacter.length && C < PrivateCharacterOffset + 4); C++) {
		
		// The information sheet button is always available
		if ((MouseX >= X + 85 + (C - PrivateCharacterOffset) * 470) && (MouseX <= X + 175 + (C - PrivateCharacterOffset) * 470))
			InformationSheetLoadCharacter(PrivateCharacter[C]);

		// The cage is only available on certain conditions
		if ((MouseX >= X + 205 + (C - PrivateCharacterOffset) * 470) && (MouseX <= X + 295 + (C - PrivateCharacterOffset) * 470))
			if ((NPCEventGet(PrivateCharacter[C], "SlaveMarketRent") <= CurrentTime) && (NPCEventGet(PrivateCharacter[C], "AsylumSent") <= CurrentTime))
				if (LogQuery("Cage", "PrivateRoom") && !LogQuery("BlockCage", "Rule"))
					if ((Player.Cage == null) || (C == 0))
						if (!PrivateCharacter[C].IsOwner()) {
							PrivateCharacter[C].Cage = (PrivateCharacter[C].Cage == null) ? true : null;
							if (C > 0) ServerPrivateCharacterSync();
						}

		// Can switch girls position in the private room if there's more than one friend
		if ((C > 0) && (C < PrivateCharacter.length - 1))
			if ((MouseX >= X + 325 + (C - PrivateCharacterOffset) * 470) && (MouseX <= X + 415 + (C - PrivateCharacterOffset) * 470)) {
				var P = PrivateCharacter[C];
				PrivateCharacter[C] = PrivateCharacter[C + 1];
				PrivateCharacter[C + 1] = P;
				ServerPrivateCharacterSync();
				break;
			}

	}

}

// Checks if the user clicked on a character
function PrivateClickCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - ((PrivateCharacter.length - PrivateCharacterOffset) * 250);
	if (X < 0) X = 0;

	// For each character, we find the one that was clicked and open it's dialog
	for (var C = PrivateCharacterOffset; (C < PrivateCharacter.length && C < PrivateCharacterOffset + 4); C++)
		if ((MouseX >= X + (C - PrivateCharacterOffset) * 470) && (MouseX <= X + 470 + (C - PrivateCharacterOffset) * 470))
			if ((NPCEventGet(PrivateCharacter[C], "SlaveMarketRent") <= CurrentTime) && (NPCEventGet(PrivateCharacter[C], "AsylumSent") <= CurrentTime)) {

				// If the arousal meter is shown for that character, we can interact with it
				if ((PrivateCharacter[C].ID == 0) || (Player.ArousalSettings.ShowOtherMeter == null) || Player.ArousalSettings.ShowOtherMeter)
					if ((PrivateCharacter[C].ID == 0) || ((PrivateCharacter[C].ArousalSettings != null) && (PrivateCharacter[C].ArousalSettings.Visible != null) && (PrivateCharacter[C].ArousalSettings.Visible == "Access") && PrivateCharacter[C].AllowItem) || ((PrivateCharacter[C].ArousalSettings != null) && (PrivateCharacter[C].ArousalSettings.Visible != null) && (PrivateCharacter[C].ArousalSettings.Visible == "All")))
						if ((PrivateCharacter[C].ArousalSettings != null) && (PrivateCharacter[C].ArousalSettings.Active != null) && ((PrivateCharacter[C].ArousalSettings.Active == "Manual") || (PrivateCharacter[C].ArousalSettings.Active == "Hybrid") || (PrivateCharacter[C].ArousalSettings.Active == "Automatic"))) {

							// The arousal meter can be maximized or minimized by clicking on it
							if ((MouseX >= X + (C - PrivateCharacterOffset) * 470 + 60) && (MouseX <= X + (C - PrivateCharacterOffset) * 470 + 140) && (MouseY >= 400) && (MouseY <= 500) && !PrivateCharacter[C].ArousalZoom) { PrivateCharacter[C].ArousalZoom = true; return; }
							if ((MouseX >= X + (C - PrivateCharacterOffset) * 470 + 50) && (MouseX <= X + (C - PrivateCharacterOffset) * 470 + 150) && (MouseY >= 615) && (MouseY <= 715) && PrivateCharacter[C].ArousalZoom) { PrivateCharacter[C].ArousalZoom = false; return; }

							// If the player can manually control her arousal or wants to fight her desire
							if ((PrivateCharacter[C].ID == 0) && (MouseX >= X + (C - PrivateCharacterOffset) * 470 + 50) && (MouseX <= X + (C - PrivateCharacterOffset) * 470 + 150) && (MouseY >= 200) && (MouseY <= 615) && PrivateCharacter[C].ArousalZoom)
								if ((Player.ArousalSettings != null) && (Player.ArousalSettings.Active != null) && (Player.ArousalSettings.Progress != null)) {
									if ((Player.ArousalSettings.Active == "Manual") || (Player.ArousalSettings.Active == "Hybrid")) {
										var Arousal = Math.round((625 - MouseY) / 4, 0);
										ActivitySetArousal(Player, Arousal);
										if ((Player.ArousalSettings.AffectExpression == null) || Player.ArousalSettings.AffectExpression) ActivityExpression(Player, Player.ArousalSettings.Progress);
										if (Player.ArousalSettings.Progress == 100) ActivityOrgasmPrepare(Player);
									}
									return;
								}

							// Don't do anything if the thermometer is clicked without access to it
							if ((MouseX >= X + (C - PrivateCharacterOffset) * 470 + 50) && (MouseX <= X + (C - PrivateCharacterOffset) * 470 + 150) && (MouseY >= 200) && (MouseY <= 615) && PrivateCharacter[C].ArousalZoom) return;

						}

				// Cannot click on a character that's having an orgasm
				if ((PrivateCharacter[C].ID != 0) && (PrivateCharacter[C].ArousalSettings != null) && (PrivateCharacter[C].ArousalSettings.OrgasmTimer != null) && (PrivateCharacter[C].ArousalSettings.OrgasmTimer > 0))
					return;

				// Sets the new character (1000 if she's owner, 2000 if she's owned)
				if (PrivateCharacter[C].ID != 0) {
					PrivateCharacterToSave = C;
					PrivateLoadCharacter(C);
					if ((PrivateCharacter[C].Stage == "0") && PrivateCharacter[C].IsOwner()) PrivateCharacter[C].Stage = "1000";
					if ((PrivateCharacter[C].Stage == "0") && PrivateCharacter[C].IsOwnedByPlayer()) PrivateCharacter[C].Stage = "2000";
					NPCTraitDialog(PrivateCharacter[C]);
				}
				CharacterSetCurrent(PrivateCharacter[C]);

				// If the owner has beeped the player
				if ((CurrentCharacter.Stage == "1000") && (CurrentCharacter.Name == Player.Owner.replace("NPC-", "")) && LogQuery("OwnerBeepActive", "PrivateRoom")) {
					if (LogQuery("OwnerBeepTimer", "PrivateRoom")) {
						CurrentCharacter.Stage = "1020";
						CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "OwnerBeepSuccess");
						NPCLoveChange(CurrentCharacter, 8);
					} else {
						CurrentCharacter.Stage = "1030";
						CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "OwnerBeepFail");
						NPCLoveChange(CurrentCharacter, -10);
					}
					LogDelete("OwnerBeepActive", "PrivateRoom");
					LogAdd("OwnerBeepTimer", "PrivateRoom", CurrentTime + 1800000);
				}

				// If the owner is serious, she might force the player to kneel
				if ((CurrentCharacter.Stage == "1000") && (CurrentCharacter.Name == Player.Owner.replace("NPC-", "")) && !Player.IsKneeling() && Player.CanKneel() && (NPCTraitGet(CurrentCharacter, "Serious") >= Math.random() * 100 - 25)) {
					CurrentCharacter.Stage = "1005";
					NPCLoveChange(CurrentCharacter, -3);
					CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PlayerMustKneel");
				}

			}

}

// When the user clicks in the private room
function PrivateClick() {

	// If the player is having an orgasm, only the orgasm controls are available
	if ((Player.ArousalSettings != null) && (Player.ArousalSettings.OrgasmTimer != null) && (typeof Player.ArousalSettings.OrgasmTimer === "number") && !isNaN(Player.ArousalSettings.OrgasmTimer) && (Player.ArousalSettings.OrgasmTimer > 0)) {

		// On stage 0, the player can choose to resist the orgasm or not.  At 1, the player plays a mini-game to fight her orgasm
		if ((MouseX >= 700) && (MouseX <= 950) && (MouseY >= 532) && (MouseY <= 600) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmGameGenerate(0);
		if ((MouseX >= 1050) && (MouseX <= 1300) && (MouseY >= 532) && (MouseY <= 600) && (Player.ArousalSettings.OrgasmStage == 0)) ActivityOrgasmStart(Player);
		if ((MouseX >= ActivityOrgasmGameButtonX + 500) && (MouseX <= ActivityOrgasmGameButtonX + 700) && (MouseY >= ActivityOrgasmGameButtonY) && (MouseY <= ActivityOrgasmGameButtonY + 64) && (Player.ArousalSettings.OrgasmStage == 1)) ActivityOrgasmGameGenerate(ActivityOrgasmGameProgress + 1);
		return;

	}

	// Main screens buttons
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) { NPCTraitDialog(PrivateVendor); CharacterSetCurrent(PrivateVendor); }
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk() && (Player.Cage == null)) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235) && LogQuery("RentRoom", "PrivateRoom") && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && LogQuery("RentRoom", "PrivateRoom") && Player.CanWalk() && (Player.Cage == null)) CharacterSetCurrent(PrivateVendor);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && LogQuery("RentRoom", "PrivateRoom") && Player.CanChange()) CharacterAppearanceLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 505) && (MouseY < 595) && LogQuery("RentRoom", "PrivateRoom") && Player.CanChange() && LogQuery("Wardrobe", "PrivateRoom")) CommonSetScreen("Character", "Wardrobe");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 625) && (MouseY < 715) && LogQuery("RentRoom", "PrivateRoom") && LogQuery("Expansion", "PrivateRoom")) PrivateCharacterOffset = (PrivateCharacterOffset + 4 == PrivateCharacterMax) ? 0 : PrivateCharacterOffset + 4;
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

// When the player gets the room expansion
function PrivateGetExpansion() {
	CharacterChangeMoney(Player, -200);
	LogAdd("Expansion", "PrivateRoom");
	PrivateCharacterMax = 8;
}

// When the player gets the room expansion
function PrivateGetSecondExpansion() {
	CharacterChangeMoney(Player, -400);
	LogAdd("SecondExpansion", "PrivateRoom");
	PrivateCharacterMax = 12;
}

// Loads the private room character
function PrivateLoadCharacter(C) {

	// If there's no account, we build the full character from the server template
	if ((PrivateCharacter[C].AccountName == null) && (PrivateCharacter[C].Name != null)) {
		var N = CharacterLoadNPC("NPC_Private_Custom");
		N.Name = PrivateCharacter[C].Name;
		PrivateCharacter[C].AccountName = "NPC_Private_Custom" + N.ID.toString();
		N.AccountName = "NPC_Private_Custom" + N.ID.toString();
		if (PrivateCharacter[C].Title != null) N.Title = PrivateCharacter[C].Title;
		if (PrivateCharacter[C].AssetFamily != null) N.AssetFamily = PrivateCharacter[C].AssetFamily;
		if (PrivateCharacter[C].Appearance != null) N.Appearance = ServerAppearanceLoadFromBundle(PrivateCharacter[C], PrivateCharacter[C].AssetFamily, PrivateCharacter[C].Appearance);
		if (PrivateCharacter[C].AppearanceFull != null) N.AppearanceFull = ServerAppearanceLoadFromBundle(PrivateCharacter[C], PrivateCharacter[C].AssetFamily, PrivateCharacter[C].AppearanceFull);
		if (PrivateCharacter[C].Trait != null) N.Trait = PrivateCharacter[C].Trait.slice();
		if (PrivateCharacter[C].Cage != null) N.Cage = PrivateCharacter[C].Cage;
		if (PrivateCharacter[C].Event != null) N.Event = PrivateCharacter[C].Event;
		if (PrivateCharacter[C].Lover != null) N.Lover = PrivateCharacter[C].Lover;
		if (PrivateCharacter[C].Owner != null) N.Owner = PrivateCharacter[C].Owner;
		if (PrivateCharacter[C].ArousalSettings != null) N.ArousalSettings = PrivateCharacter[C].ArousalSettings;
		N.Love = (PrivateCharacter[C].Love == null) ? 0 : parseInt(PrivateCharacter[C].Love);
		NPCTraitDialog(N);
		NPCArousal(N);
		ActivityTimerProgress(N, 0);
		CharacterRefresh(N);
		if (NPCEventGet(N, "PrivateRoomEntry") == 0) NPCEventAdd(N, "PrivateRoomEntry", CurrentTime);
		PrivateCharacter[C] = N;
		if (PrivateCharacter[C].CanKneel() && PrivateCharacter[C].IsOwnedByPlayer()) CharacterSetActivePose(PrivateCharacter[C], "Kneel");
	}

	// We allow items on NPC if 25+ dominant reputation, not owner or restrained
	if (PrivateCharacter[C].ArousalSettings == null) NPCArousal(PrivateCharacter[C]);
	PrivateCharacter[C].ArousalSettings.Active = "Automatic";
	PrivateCharacter[C].ArousalSettings.Visible = "All";
	PrivateCharacter[C].AllowItem = (((ReputationGet("Dominant") + 25 >= NPCTraitGet(PrivateCharacter[C], "Dominant")) && !PrivateCharacter[C].IsOwner()) || PrivateCharacter[C].IsOwnedByPlayer() || PrivateCharacter[C].IsRestrained() || !PrivateCharacter[C].CanTalk());

}

// When a new character is added to the room
function PrivateAddCharacter(Template, Archetype, CustomData) {
	var C = CharacterLoadNPC("NPC_Private_Custom");
	C.Name = Template.Name;
	C.AccountName = "NPC_Private_Custom" + PrivateCharacter.length.toString();
	C.Appearance = Template.Appearance.slice();
	C.AppearanceFull = Template.Appearance.slice();
	C.Love = 0;
	if ((Archetype != null) && (Archetype != "") && (Archetype != "Submissive")) C.Title = Archetype;
	NPCTraitGenerate(C);
	if ((Archetype != null) && (Archetype == "Mistress")) NPCTraitSet(C, "Dominant", 60 + Math.floor(Math.random() * 41));
	if ((Archetype != null) && (Archetype == "Submissive")) NPCTraitSet(C, "Dominant", -50 - Math.floor(Math.random() * 51));
	if ((CustomData == null) || (CustomData == false)) NPCTraitDialog(C);
	CharacterRefresh(C);
	PrivateCharacter.push(C);
	NPCEventAdd(C, "PrivateRoomEntry", CurrentTime);
	if ((CustomData == null) || (CustomData == false)) ServerPrivateCharacterSync();
	C.AllowItem = (((ReputationGet("Dominant") + 25 >= NPCTraitGet(C, "Dominant")) && !C.IsOwner()) || C.IsRestrained() || !C.CanTalk());
	if ((InventoryGet(C, "ItemNeck") != null) && (InventoryGet(C, "ItemNeck").Asset.Name == "ClubSlaveCollar")) InventoryRemove(C, "ItemNeck");
}

// Returns the ID of the private room current character
function PrivateGetCurrentID() {
	for (var P = 1; P < PrivateCharacter.length; P++)
		if (CurrentCharacter.Name == PrivateCharacter[P].Name)
			return P;
}

// When the player kicks out a character
function PrivateKickOut() {
	var ID = PrivateGetCurrentID();
	PrivateCharacter[ID] = null;
	PrivateCharacter.splice(ID, 1);
	ServerPrivateCharacterSync();
	for (var P = 1; P < PrivateCharacter.length; P++)
		if (PrivateCharacter[P] != null) 
			PrivateCharacter[P].AccountName = "NPC_Private_Custom" + P.toString();
	DialogLeave();
}

// When the player tells the character to change
function PrivateChange(NewCloth) {
	if (NewCloth == "Cloth") CharacterDress(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Underwear") CharacterUnderwear(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Naked") CharacterNaked(CurrentCharacter);
	if (NewCloth == "Custom") {
		PrivateNPCInteraction(10);
		CharacterChangeMoney(Player, -50);
		PrivateCharacterNewClothes = CurrentCharacter;
		DialogLeave();
		CharacterAppearanceLoadCharacter(PrivateCharacterNewClothes);
	}
}

// Returns TRUE if the player owner is already in the room
function PrivateOwnerInRoom() {
	for (var C = 1; C < PrivateCharacter.length; C++) {
		if ((PrivateCharacter[C].AccountName == null) && (PrivateCharacter[C].Name != null) && (PrivateCharacter[C].Name == Player.Owner.replace("NPC-", ""))) return true;
		if ((PrivateCharacter[C].AccountName != null) && PrivateCharacter[C].IsOwner() && (CurrentCharacter != null) && (PrivateCharacter[C].ID != CurrentCharacter.ID)) return true;
		if ((PrivateCharacter[C].AccountName != null) && PrivateCharacter[C].IsOwner() && (CurrentCharacter == null)) return true;
	}
	return false;
}

// Returns TRUE if the player lover is already in the room
function PrivateLoverInRoom(L) {
	for (var C = 1; C < PrivateCharacter.length; C++) {
		if ((PrivateCharacter[C].AccountName == null) && (PrivateCharacter[C].Name != null) && (Player.GetLoversNumbers()[L] == "NPC-" + PrivateCharacter[C].Name)) return true;
		if ((PrivateCharacter[C].AccountName != null) && (Player.GetLoversNumbers()[L] == "NPC-" + PrivateCharacter[C].Name) && (CurrentCharacter != null) && (PrivateCharacter[C].ID != CurrentCharacter.ID)) return true;
		if ((PrivateCharacter[C].AccountName != null) && (Player.GetLoversNumbers()[L] == "NPC-" + PrivateCharacter[C].Name) && (CurrentCharacter == null)) return true;
	}
	return false;
}

// When a custom NPC restrains the player, there's a minute timer before release
function PrivateRestrainPlayer() {
	CharacterFullRandomRestrain(Player);
	PrivateNPCInteraction(5);
	PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000;
}

// Relationship with any NPC will decay with time, below -100, the NPC leaves if she's not caged
function PrivateRelationDecay() {
	var MustSave = false;
	for (var C = 1; C < PrivateCharacter.length; C++) {
		var LastDecay = NPCEventGet(PrivateCharacter[C], "LastDecay");
		if (LastDecay * CheatFactor("NoLoveDecay", 0) == 0)
			NPCEventAdd(PrivateCharacter[C], "LastDecay", CurrentTime);
		else
			if (LastDecay <= CurrentTime - 7200000) {
				var Decay = Math.floor((CurrentTime - LastDecay) / 7200000);
				NPCEventAdd(PrivateCharacter[C], "LastDecay", LastDecay + (Decay * 7200000));
				NPCLoveChange(PrivateCharacter[C], Decay * -1);
				MustSave = true;
				if ((PrivateCharacter[C].Love <= -100) && (PrivateCharacter[C].Cage == null)) {
					CurrentCharacter = PrivateCharacter[C];
					PrivateKickOut();
				}
			}
	}
	if (MustSave) ServerPrivateCharacterSync();
}

// When the player starts a submissive trial with an NPC
function PrivateStartTrial(ChangeRep) {
	DialogChangeReputation("Dominant", ChangeRep);
	CharacterDress(CurrentCharacter, CurrentCharacter.AppearanceFull);
	NPCEventAdd(CurrentCharacter, "EndSubTrial", CurrentTime + NPCLongEventDelay(CurrentCharacter));
	NPCLoveChange(CurrentCharacter, 30);
	ServerPrivateCharacterSync();
}

// When the player stops a submissive trial with an NPC
function PrivateStopTrial(ChangeRep) {
	DialogChangeReputation("Dominant", ChangeRep);
	NPCEventDelete(CurrentCharacter, "EndSubTrial");
	NPCLoveChange(CurrentCharacter, -60);
	ServerPrivateCharacterSync();
}

// Shows the number or hours remaining for the trial
function PrivateShowTrialHours() {
	CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("DialogHours", Math.ceil((NPCEventGet(CurrentCharacter, "EndSubTrial") - CurrentTime) / 3600000).toString());
}

// Returns TRUE if the player is owned (from the room or not)
function PrivatePlayerIsOwned() {
	if (Player.Owner != "") return true;
	for (var C = 0; C < PrivateCharacter.length; C++)
		if (typeof PrivateCharacter[C].IsOwner === 'function') 
			if (PrivateCharacter[C].IsOwner())
				return true;
	return false;
}

// Returns TRUE if someone else in the room can be restrained by the player owner, keep that target in a variable to be used later
function PrivateCanRestrainOther() {
	PrivateActivityTarget = null;
	var List = [];
	for (var C = 0; C < PrivateCharacter.length; C++)
		if ((PrivateCharacter[C].ID != 0) && (PrivateCharacter[C].ID != CurrentCharacter.ID) && (NPCTraitGet(CurrentCharacter, "Dominant") > NPCTraitGet(PrivateCharacter[C], "Dominant")) && (InventoryGet(PrivateCharacter[C], "ItemArms") == null))
			List.push(PrivateCharacter[C]);
	if (List.length > 0)
		PrivateActivityTarget = List[Math.floor(Math.random() * List.length)];
	return (PrivateActivityTarget != null);
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
		if ((Act == "RestrainOther") && PrivateCanRestrainOther()) break;
		if ((Act == "FullRestrain") && (InventoryGet(Player, "ItemArms") == null)) break;
		if ((Act == "FullRestrainOther") && PrivateCanRestrainOther()) break;
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
		if ((Act == "CollegeClothes") && Player.CanChange() && ((CurrentCharacter.Name == "Amanda") || (CurrentCharacter.Name == "Sarah") || (CurrentCharacter.Name == "Jennifer") || (CurrentCharacter.Name == "Sidney"))) break;
		if ((Act == "Shibari") && Player.CanChange() && (NPCTraitGet(CurrentCharacter, "Wise") >= 0)) break;
		if ((Act == "Gift") && (Player.Owner != "") && (CurrentCharacter.Love >= 90) && (CurrentTime >= NPCEventGet(CurrentCharacter, "LastGift") + 86400000)) break;
		if ((Act == "PetGirl") && (InventoryGet(Player, "ItemArms") == null) && (NPCTraitGet(CurrentCharacter, "Peaceful") >= 0)) break;
		if ((Act == "Locks") && InventoryHasLockableItems(Player)) break;

		// After 100 tries, we give up on picking an activity and the owner ignore the player
		Count++;
		if (Count >= 100) {
			CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "ActivityNone");
			return;
		}

	}

	// Starts the activity (any activity adds +2 love automatically)
	PrivateActivity = Act;
	PrivateNPCInteraction(2);
	PrivateActivityAffectLove = true;
	PrivateActivityCount = 0;
	CurrentCharacter.Stage = "Activity" + PrivateActivity;
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "Activity" + PrivateActivity + "Intro");
	if (PrivateActivityTarget != null) CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("ActivityTarget", PrivateActivityTarget.Name);

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
		if (NPCEventGet(CurrentCharacter, "RefusedActivity") >= CurrentTime - 300000) Punish = Punish + 50;
		if (Player.Owner == "") Stop = Stop + 50;
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
	if (PrivateActivity == "RestrainOther") InventoryWearRandom(PrivateActivityTarget, "ItemArms");
	if ((PrivateActivity == "FullRestrain") && (NPCTraitGet(CurrentCharacter, "Playful") > 0)) CharacterFullRandomRestrain(Player, "Few");
	if ((PrivateActivity == "FullRestrain") && (NPCTraitGet(CurrentCharacter, "Playful") == 0)) CharacterFullRandomRestrain(Player);
	if ((PrivateActivity == "FullRestrain") && (NPCTraitGet(CurrentCharacter, "Serious") > 0)) CharacterFullRandomRestrain(Player, "Lot");
	if (PrivateActivity == "FullRestrainOther") CharacterFullRandomRestrain(PrivateActivityTarget);
	if (PrivateActivity == "Release") CharacterRelease(Player);
	if (PrivateActivity == "Ungag") { InventoryRemove(Player, "ItemMouth"); InventoryRemove(Player, "ItemMouth2"); InventoryRemove(Player, "ItemMouth3"); InventoryRemove(Player, "ItemHead"); InventoryRemove(Player, "ItemHood");}
	if (PrivateActivity == "Naked") CharacterNaked(Player);
	if (PrivateActivity == "Underwear") CharacterRandomUnderwear(Player);
	if (PrivateActivity == "RandomClothes") CharacterAppearanceFullRandom(Player, true);
	if (PrivateActivity == "CollegeClothes") { CollegeEntranceWearStudentClothes(Player); InventoryAdd(Player, "CollegeOutfit1", "Cloth"); }
	if (PrivateActivity == "Locks") InventoryFullLockRandom(Player, true);

	// Some activities creates a release timer
	if ((PrivateActivity == "Gag") || (PrivateActivity == "Restrain") || (PrivateActivity == "FullRestrain") || (PrivateActivity == "Locks")) PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000;

	// The gift can only happen once a day if the player is fully collared
	if (PrivateActivity == "Gift") {
		CharacterChangeMoney(Player, 50);
		NPCEventAdd(CurrentCharacter, "LastGift", CurrentTime);
	}

	// In Shibari, the player gets naked and fully roped in hemp
	if (PrivateActivity == "Shibari") {
		CharacterNaked(Player);
		CharacterSetActivePose(Player, null);
		InventoryRemove(Player, "ItemHood");
		InventoryRemove(Player, "ItemHead");
		ShibariRandomBondage(Player, 3);
		InventoryWearRandom(Player, "ItemMouth");
		PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000;
	}

	// In PetGirl, the player gets gagged, bound & dressed as a puppy
	if (PrivateActivity == "PetGirl") {
		InventoryRemove(Player, "ItemLegs");
		InventoryRemove(Player, "ItemFeet");
		InventoryRemove(Player, "Hat");
		InventoryRemove(Player, "HairAccessory2");
		InventoryWearRandom(Player, "ItemMouth");
		InventoryWear(Player, "BitchSuit", "ItemArms", "Default", Math.floor(Math.random() * 10) + 1);
		InventoryWear(Player, "PuppyEars1", "HairAccessory1");
		InventoryWear(Player, "PuppyTailPlug", "ItemButt");
		PrivateReleaseTimer = CommonTime() + (Math.random() * 120000) + 120000;
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
	ServerPlayerAppearanceSync();
}

// Starts a random punishment for the player as submissive
function PrivateSelectPunishment() {
	
	// Release the player first
	if (Player.IsRestrained() || !Player.CanTalk()) {
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
		PrivatePunishment = CommonRandomItemFromList(PrivatePunishment, PrivatePunishmentList);

		// If the punishment is valid
		if ((PrivatePunishment == "Cage") && LogQuery("Cage", "PrivateRoom")) break;
		if (PrivatePunishment == "Bound") break;
		if ((PrivatePunishment == "BoundPet") && !Player.IsVulvaChaste() && (NPCTraitGet(CurrentCharacter, "Playful") >= 0)) break;
		if ((PrivatePunishment == "ChastityBelt") && !Player.IsVulvaChaste() && (NPCTraitGet(CurrentCharacter, "Frigid") >= 0)) break;
		if ((PrivatePunishment == "ChastityBra") && !Player.IsBreastChaste() && (NPCTraitGet(CurrentCharacter, "Frigid") >= 0)) break;
		if ((PrivatePunishment == "ForceNaked") && Player.CanChange() && (NPCTraitGet(CurrentCharacter, "Horny") >= 0)) break;
		if ((PrivatePunishment == "ConfiscateKey") && (InventoryAvailable(Player, "MetalCuffsKey", "ItemMisc") || InventoryAvailable(Player, "MetalPadlockKey", "ItemMisc") || InventoryAvailable(Player, "IntricatePadlockKey", "ItemMisc"))) break;
		if ((PrivatePunishment == "ConfiscateCrop") && (InventoryAvailable(Player, "LeatherCrop", "ItemPelvis") || InventoryAvailable(Player, "LeatherCrop", "ItemBreast"))) break;
		if ((PrivatePunishment == "ConfiscateWhip") && (InventoryAvailable(Player, "LeatherWhip", "ItemPelvis") || InventoryAvailable(Player, "LeatherWhip", "ItemBreast"))) break;
		if ((PrivatePunishment == "SleepCage") && LogQuery("Cage", "PrivateRoom") && !LogQuery("SleepCage", "Rule")) break;
		if ((PrivatePunishment == "LockOut") && (NPCTraitGet(CurrentCharacter, "Serious") >= 0)) break;
		if (PrivatePunishment == "Cell") break;

	}

	// Starts the punishment
	CurrentCharacter.Stage = "Punish" + PrivatePunishment;
	CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "Punish" + PrivatePunishment + "Intro");

}

// Runs the player punishment
function PrivateRunPunishment(LoveFactor) {
	NPCLoveChange(CurrentCharacter, LoveFactor);
	NPCEventAdd(CurrentCharacter, "RefusedActivity", CurrentTime);
	if (PrivatePunishment == "Cage") { Player.Cage = true; LogAdd("BlockCage", "Rule", CurrentTime + 120000); DialogLeave(); }
	if (PrivatePunishment == "Bound") { PrivateReleaseTimer = CommonTime() + 240000; CharacterFullRandomRestrain(Player, "All"); InventoryRemove(Player, "ItemArms"); InventoryWear(Player, "HempRope", "ItemArms"); InventorySetDifficulty(Player, "ItemArms", 12); }
	if (PrivatePunishment == "BoundPet") { PrivateReleaseTimer = CommonTime() + 240000; CharacterSetActivePose(Player, "Kneel"); InventoryWear(Player, "LeatherBelt", "ItemLegs"); InventoryWear(Player, "TailButtPlug", "ItemButt"); InventoryWear(Player, "Ears" + (Math.floor(Math.random() * 2) + 1).toString(), "Hat"); InventoryWear(Player, "LeatherArmbinder", "ItemArms"); InventorySetDifficulty(Player, "ItemArms", 15); }
	if ((PrivatePunishment == "ChastityBelt") && (NPCTraitGet(CurrentCharacter, "Horny") >= 0) && (InventoryGet(Player, "ItemVulva") == null)) InventoryWear(Player, "VibratingEgg", "ItemVulva");
	if ((PrivatePunishment == "ChastityBelt") && (NPCTraitGet(CurrentCharacter, "Horny") >= 0) && (InventoryGet(Player, "ItemButt") == null)) InventoryWear(Player, "BlackButtPlug", "ItemButt");
	if (PrivatePunishment == "ChastityBelt") { InventoryWear(Player, CommonRandomItemFromList("", PrivateBeltList), "ItemPelvis"); InventoryLock(Player, "ItemPelvis", "OwnerPadlock", null); }
	if (PrivatePunishment == "ChastityBra") { InventoryWear(Player, "MetalChastityBra", "ItemBreast"); InventoryLock(Player, "ItemBreast", "OwnerPadlock", null); }
	if (PrivatePunishment == "ForceNaked") LogAdd("BlockChange", "Rule", CurrentTime + 1800000);
	if (PrivatePunishment == "ConfiscateKey") InventoryConfiscateKey();
	if (PrivatePunishment == "ConfiscateCrop") { InventoryDelete(Player, "LeatherCrop", "ItemPelvis"); InventoryDelete(Player, "LeatherCrop", "ItemBreast"); }
	if (PrivatePunishment == "ConfiscateWhip") { InventoryDelete(Player, "LeatherWhip", "ItemPelvis"); InventoryDelete(Player, "LeatherWhip", "ItemBreast"); }
	if (PrivatePunishment == "SleepCage") LogAdd("SleepCage", "Rule", CurrentTime + 604800000);
	if (PrivatePunishment == "LockOut") { LogAdd("LockOutOfPrivateRoom", "Rule", CurrentTime + 3600000); DialogLeave(); CommonSetScreen("Room", "MainHall"); }
	if (PrivatePunishment == "Cell") { DialogLeave(); CharacterFullRandomRestrain(Player, "ALL"); CellLock(5); }
}

// Sets up the player collaring ceremony cutscene
function PrivatePlayerCollaring() {
	NPCEventDelete(CurrentCharacter, "EndSubTrial");
	NPCEventAdd(CurrentCharacter, "PlayerCollaring", CurrentTime);
	InventoryRemove(Player, "ItemNeck");
	InventoryRemove(Player, "ItemNeckAccessories");
	InventoryRemove(Player, "ItemNeckRestraints");
	CharacterRelease(Player);
	CharacterSetActivePose(Player, null);
	ReputationProgress("Dominant", -20);
	Player.Owner = "NPC-" + CurrentCharacter.Name;
	ServerPlayerSync();
	PlayerCollaringMistress = CurrentCharacter;
	CommonSetScreen("Cutscene", "PlayerCollaring");
	DialogLeave();
}

// Starts the D/s trial period with the player as Dominant
function PrivateStartDomTrial(TrialTime) {
	DialogChangeReputation("Dominant", TrialTime);
	NPCEventAdd(CurrentCharacter, "EndDomTrial", CurrentTime + TrialTime * 86400000);
	NPCLoveChange(CurrentCharacter, TrialTime * 5);
	ServerPrivateCharacterSync();
}

// Sets up the NPC collaring ceremony cutscene
function PrivateNPCCollaring() {
	CharacterChangeMoney(Player, -100);
	NPCEventDelete(CurrentCharacter, "EndDomTrial");
	NPCEventAdd(CurrentCharacter, "NPCCollaring", CurrentTime);
	InventoryRemove(CurrentCharacter, "ItemNeck");
	CharacterRelease(Player);
	CharacterRelease(CurrentCharacter);
	CharacterSetActivePose(Player, null);
	CharacterSetActivePose(CurrentCharacter, null);
	ReputationProgress("Dominant", 10);
	CurrentCharacter.Owner = Player.Name;
	CurrentCharacter.Love = 100;
	NPCCollaringSub = CurrentCharacter;
	CommonSetScreen("Cutscene", "NPCCollaring");
	DialogLeave();
}

// When the player gets an NPC girlfriend, we assign that new lover
function PrivateStartGirlfriend() {
	NPCEventAdd(CurrentCharacter, "Girlfriend", CurrentTime);
	CurrentCharacter.Lover = Player.Name;
	NPCLoveChange(CurrentCharacter, 20);
	Player.Lover = "NPC-" + CurrentCharacter.Name;
	ServerPlayerSync();
	ServerPrivateCharacterSync();
}

// The NPC love can only reach 60 without a proper relationship, 100 if in a relationship
function PrivateNPCInteraction(LoveFactor) {
	if (CurrentCharacter.Love == null) CurrentCharacter.Love = 0;
	if ((CurrentCharacter.Love < 60) || (CurrentCharacter.IsOwner()) || (CurrentCharacter.IsOwnedByPlayer()) || CurrentCharacter.IsLoverPrivate() || (parseInt(LoveFactor) < 0))
		NPCLoveChange(CurrentCharacter, LoveFactor);
}

// When the slave market transation starts (10$ + 1$ per day for sold slave + 0% to 100% from the random auction, divide in 7 for rentals)
function PrivateSlaveMarketStart(AuctionType) {
	if (AuctionType == "Rent") NPCEventAdd(CurrentCharacter, "SlaveMarketRent", CurrentTime + 86400000);
	else InventoryRemove(CurrentCharacter, "ItemNeck");
	CharacterRelease(CurrentCharacter);
	CharacterNaked(CurrentCharacter);
	CharacterSetActivePose(CurrentCharacter, "Kneel");
	NPCSlaveAuctionVendor = Player;
	NPCSlaveAuctionSlave = CurrentCharacter;
	NPCSlaveAuctionAmount = Math.floor((CurrentTime - NPCEventGet(CurrentCharacter, "NPCCollaring")) / 86400000);
	if (NPCSlaveAuctionAmount > 90) NPCSlaveAuctionAmount = 90;
	if (NPCSlaveAuctionAmount < 0) NPCSlaveAuctionAmount = 0;
	NPCSlaveAuctionAmount = Math.round((10 + NPCSlaveAuctionAmount) * (1 + Math.random()));
	if (AuctionType == "Rent") NPCSlaveAuctionAmount = Math.round(NPCSlaveAuctionAmount / 7);
	CharacterChangeMoney(Player, NPCSlaveAuctionAmount);
	CommonSetScreen("Cutscene", "NPCSlaveAuction");
	if (AuctionType == "Sell") PrivateKickOut();
	else DialogLeave();
}

// When the player selects how to improve her slave
function PrivateSlaveImproveSelect(Type) {
	PrivateSlaveImproveType = Type;
}

// The player slave can be sent to the asylum to have a trait corrected (The higher the value, the slower it raises)
function PrivateSlaveImproveSend() {
	CharacterChangeMoney(Player, -25);
	var T = NPCTraitGet(CurrentCharacter, PrivateSlaveImproveType);
	var N = T + 20 - Math.floor((T + 100) / 10);
	if (N < 0) {
		PrivateSlaveImproveType = NPCTraitReverse(PrivateSlaveImproveType);
		N = N * -1;
	}
	NPCTraitSet(CurrentCharacter, PrivateSlaveImproveType, N);
	NPCEventAdd(CurrentCharacter, "AsylumSent", CurrentTime + 86400000);
	DialogLeave();
}

// When Amanda/Sarah/Sidney/Jennifer gives her college outfit to the player
function PrivateGetCollegeClothes() {
	NPCLoveChange(CurrentCharacter, -10);
	InventoryAdd(Player, "CollegeOutfit1", "Cloth");
	if ((InventoryGet(CurrentCharacter, "Cloth") != null) && (InventoryGet(CurrentCharacter, "Cloth").Asset.Name == "CollegeOutfit1")) InventoryRemove(CurrentCharacter, "Cloth");
}

// When the player says "I love you" to her NPC girlfriend
function PrivateLoveYou() {

	// Once every minute, it will raise the love meter a little
	if (PrivateNextLoveYou < CurrentTime) {
		PrivateNextLoveYou = CurrentTime + 60000;
		NPCLoveChange(CurrentCharacter, Math.floor(Math.random() * 5) + 2);
	}

	// If the lover loves the player enough, she might start a random activity with her
	if (CurrentCharacter.Love >= Math.random() * 100) {

		// Finds a valid lover activity at random, some activities skip the loop and don't return any event
		var Zone = "";
		var Act;
		while (true) {
			Act = CommonRandomItemFromList(PrivateLoverActivity, PrivateLoverActivityList);
			if ((Act == "Skip1") || (Act == "Skip2")) return;
			if ((Act == "Kiss") && Player.CanTalk() && CurrentCharacter.CanTalk() && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose() && (NPCTraitGet(CurrentCharacter, "Horny") <= 33)) { Zone = "ItemMouth"; break; }
			if ((Act == "FrenchKiss") && Player.CanTalk() && CurrentCharacter.CanTalk() && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose() && (NPCTraitGet(CurrentCharacter, "Horny") >= -33)) { Zone = "ItemMouth"; break; }
			if ((Act == "Caress") && CharacterIsInUnderwear(Player) && CharacterIsInUnderwear(CurrentCharacter) && Player.CanInteract() && CurrentCharacter.CanInteract() && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose() && (NPCTraitGet(CurrentCharacter, "Horny") <= -33)) { Zone = "ItemTorso"; break; }
			if ((Act == "Rub") && CharacterIsInUnderwear(Player) && CharacterIsInUnderwear(CurrentCharacter) && Player.CanInteract() && CurrentCharacter.CanInteract() && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose() && (NPCTraitGet(CurrentCharacter, "Horny") >= -33)) { Zone = "ItemTorso"; break; }
			if ((Act == "MasturbateHand") && CharacterIsNaked(Player) && CharacterIsNaked(CurrentCharacter) && Player.CanInteract() && CurrentCharacter.CanInteract() && !Player.IsVulvaChaste() && !CurrentCharacter.IsVulvaChaste() && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose()) { Zone = "ItemVulva"; break; }
			if ((Act == "MasturbateTongue") && CharacterIsNaked(Player) && CharacterIsNaked(CurrentCharacter) && Player.CanTalk() && CurrentCharacter.CanTalk() && !Player.IsVulvaChaste() && !CurrentCharacter.IsVulvaChaste() && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose()) { Zone = "ItemVulva"; break; }
			if ((Act == "MasturbatePlayer") && CharacterIsNaked(Player) && CurrentCharacter.CanInteract() && !Player.IsVulvaChaste() && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose()) break;
			if ((Act == "MasturbateSelf") && CharacterIsNaked(CurrentCharacter) && CurrentCharacter.CanInteract() && !CurrentCharacter.IsVulvaChaste()) break;
			if ((Act == "Underwear") && (!CharacterIsInUnderwear(Player) || !CharacterIsInUnderwear(CurrentCharacter)) && Player.CanInteract() && CurrentCharacter.CanInteract()) break;
			if ((Act == "Naked") && (!CharacterIsNaked(Player) || !CharacterIsNaked(CurrentCharacter)) && Player.CanInteract() && CurrentCharacter.CanInteract()) break;
			if ((Act == "EggInsert") && CharacterIsNaked(Player) && CurrentCharacter.CanInteract() && !Player.IsVulvaChaste() && (InventoryGet(Player, "ItemVulva") == null) && !CurrentCharacter.IsOwnedByPlayer() && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose()) break;
			if ((Act == "LockBelt") && CharacterIsNaked(Player) && CurrentCharacter.CanInteract() && !Player.IsVulvaChaste() && InventoryIsWorn(Player, "VibratingEgg", "ItemVulva") && !CurrentCharacter.IsOwnedByPlayer() && (NPCTraitGet(CurrentCharacter, "Dominant") >= 0) && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose()) break;
			if ((Act == "UnlockBelt") && CharacterIsNaked(Player) && CurrentCharacter.CanInteract() && Player.IsVulvaChaste() && (InventoryGet(Player, "ItemPelvis") != null) && (InventoryGetLock(InventoryGet(Player, "ItemPelvis")) != null) && (InventoryGetLock(InventoryGet(Player, "ItemPelvis")).Asset.Name == "LoversPadlock") && (Player.Cage == null) && (CurrentCharacter.Cage == null) && !Player.IsEnclose() && !CurrentCharacter.IsEnclose()) break;
			if ((Act == "EggSpeedUp") && CurrentCharacter.CanInteract() && !CurrentCharacter.IsOwnedByPlayer() && (InventoryIsWorn(Player, "VibratingEgg", "ItemVulva")) && (InventoryGet(Player, "ItemVulva").Property.Intensity < 3)) break;
			if ((Act == "EggSpeedDown") && CurrentCharacter.CanInteract() && !CurrentCharacter.IsOwnedByPlayer() && (InventoryIsWorn(Player, "VibratingEgg", "ItemVulva")) && (InventoryGet(Player, "ItemVulva").Property.Intensity > -1)) break;
		}

		// For regular sexual activities
		PrivateLoverActivity = Act;
		if ((PrivateLoverActivity == "Kiss") || (PrivateLoverActivity == "FrenchKiss") || (PrivateLoverActivity == "Caress") || (PrivateLoverActivity == "Rub") || (PrivateLoverActivity == "MasturbateHand") || (PrivateLoverActivity == "MasturbateTongue")) {
			ActivityEffect(CurrentCharacter, Player, PrivateLoverActivity, Zone);
			ActivityEffect(Player, CurrentCharacter, PrivateLoverActivity, Zone);
		}

		// When the NPC masturbates herself or the player
		if (PrivateLoverActivity == "MasturbatePlayer") ActivityEffect(CurrentCharacter, Player, "MasturbateHand", "ItemVulva");
		if (PrivateLoverActivity == "MasturbateSelf") ActivityEffect(CurrentCharacter, CurrentCharacter, "MasturbateHand", "ItemVulva");

		// When the NPC and players gets in undies or naked
		if (PrivateLoverActivity == "Underwear") { CharacterUnderwear(Player, Player.Appearance); CharacterUnderwear(CurrentCharacter, CurrentCharacter.Appearance); }
		if (PrivateLoverActivity == "Naked") { CharacterNaked(Player); CharacterNaked(CurrentCharacter); }

		// When the NPC equips an egg or a belt on the player
		if (PrivateLoverActivity == "EggInsert") { InventoryWear(Player, "VibratingEgg", "ItemVulva"); InventoryGet(Player, "ItemVulva").Property = { Intensity: 0 }; }
		if (PrivateLoverActivity == "LockBelt") { InventoryWear(Player, CommonRandomItemFromList("", PrivateBeltList), "ItemPelvis"); InventoryLock(Player, "ItemPelvis", "LoversPadlock", null); }
		if (PrivateLoverActivity == "UnlockBelt") InventoryRemove(Player, "ItemPelvis");

		// When the NPC plays with the egg speed
		if ((PrivateLoverActivity == "EggSpeedUp") || (PrivateLoverActivity == "EggSpeedDown")) {
			var Egg = InventoryGet(Player, "ItemVulva");
			Egg.Property.Intensity = Egg.Property.Intensity + ((PrivateLoverActivity == "EggSpeedUp") ? 1 : -1);
		}

		// Shows the activity text dialog and raise the love a little
		CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "LoverActivity" + PrivateLoverActivity);
		NPCLoveChange(CurrentCharacter, Math.floor(Math.random() * 3) + 1);

	}

}