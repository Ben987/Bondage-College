"use strict";
var PrivateBackground = "Private";
var PrivateVendor = null;
var PrivateCharacter = [];
var PrivateCharacterTypeList = ["NPC_Private_VisitorShy", "NPC_Private_VisitorHorny", "NPC_Private_VisitorTough"];
var PrivateCharacterToSave = 0;
var PrivateCharacterMax = 4;
var PrivateReleaseTimer = 0;
var PrivateActivity = "";
var PrivateActivityCount = 0;
var PrivateActivityAffectLove = true;
//var PrivateActivityList = ["Gag", "Ungag", "Restrain", "FullRestrain", "Release", "Tickle", "Spank", "Pet", "Slap", "Kiss", "Fondle", "Naked", "Underwear", "RandomClothes", "Shibari", "Gift"];
// PrivateActivityList objects consits of {name}, {Conditions}, and {Run}
// {name} contains the string variable to start dialogs 
//{Conditions} is an array of function that returns a boolean (preferabily arrow functions "() =>" for easy reading)
//{Conditions} is used to sort out valid activity based on CurrentCharacter
//Unless all {Conditions} returns true, the activity is not valid
// Lastly the {Run} array of functions (again prefer "() =>")
//{Run} is a replica of current if(PrivateActivity == "(Acts)") //do something...
//To use, just call the object.Run.forEach(x => x())
//{Run} is more easier to maintain so please use it ;) 
const PrivateActivityList = [
	{//Gag
		name: "Gag",
		Conditions: [
			() => Player.CanTalk()	
		],
		Run: [
			() => InventoryWearRandom(Player, "ItemMouth"),
			() => PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000
		]
	},{//Ungag
		name: "Ungag",
		Conditions: [
			() => !Player.CanTalk(),
			() => (CommonTime() > PrivateReleaseTimer)? true : false
		],
		Run: [
			() => {
				 InventoryRemove(Player, "ItemMouth"); 
				 InventoryRemove(Player, "ItemHead"); 
			}
		]
	},{//Restrain
		name:"Restrain",
		Conditions: [
			() => InventoryGet(Player, "ItemArms") == null
		],
		Run: [
			() => InventoryWearRandom(Player, "ItemArms"),
			() => PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000
		]
	},{//FullRestrain (Restrain activity are harsher for serious NPCs)
		name: "FullRestrain",
		Conditions:[
			() => InventoryGet(Player, "ItemArms") == null
		],
		Run: [
			() => {
				if(NPCTraitGet(CurrentCharacter, "Playful") > 0)
					CharacterFullRandomRestrain(Player, "Few");
				if(NPCTraitGet(CurrentCharacter, "Playful") == 0)
					CharacterFullRandomRestrain(Player);
				if(NPCTraitGet(CurrentCharacter, "Serious") > 0)
					CharacterFullRandomRestrain(Player, "Lot");	
			},
			() => PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000
		]
	},{//Release
		name: "Release",
		Conditions:[
			() => Player.IsRestrained(),
			() => CommonTime() > PrivateReleaseTimer
		],
		Run: [
			() => CharacterRelease(Player)
		]
	},{//Tickle
		name: "Tickle",
		Conditions:[
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Playful"),
			() => NPCTraitGet(CurrentCharacter, "Playful") >= 0
		],
		Run: [

		]
	},{//Spank
		name: "Spank",
		Conditions:[
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Violent"),
			() => NPCTraitGet(CurrentCharacter, "Violent") >= 0
		],
		Run: [

		]
	},{//Pet
		name: "Pet",
		Conditions:[
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Peaceful"),
			() => NPCTraitGet(CurrentCharacter, "Peaceful") > 0
		],
		Run: [

		]
	},{//Slap
		name: "Slap",
		Conditions:[
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Violent"),
			()=> NPCTraitGet(CurrentCharacter, "Violent") > 0,
			() => CurrentCharacter.Love < 50,
		],
		Run: [

		]
	},{//Kiss
		name: "Kiss",
		Conditions:[
			() => Player.CanTalk(),
			() => CurrentCharacter.Love >= 50,
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Horny"),
			() => NPCTraitGet(CurrentCharacter, "Horny") >= 0
		],
		Run: [

		]
	},{//Fondle
		name: "Fondle",
		Conditions:[
			() => !Player.IsBreastChaste(),
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Horny"),
			() => NPCTraitGet(CurrentCharacter, "Horny") > 0
		],
		Run: [

		]
	},{//Naked
		name: "Naked",
		Conditions:[
			() => !CharacterIsNaked(Player),
			() => Player.CanChange(),
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Horny"),
			() => NPCTraitGet(CurrentCharacter, "Horny") > 0,
		],
		Run: [
			() => CharacterNaked(Player),
		]
	},{//Underwear
		name: "Underwear",
		Conditions:[
			() => !CharacterIsInUnderwear(Player),
			() => Player.CanChange(),
		],
		Run: [
			() => CharacterRandomUnderwear(Player)
		]
	},{//RandomClothes
		name: "RandomClothes",
		Conditions:[
			() => Player.CanChange()
		],
		Run: [
			() => CharacterAppearanceFullRandom(Player, true)
		]
	},{//Shibari (In Shibari, the player gets naked and fully roped in hemp)
		name: "Shibari",
		Conditions:[
			() => Player.CanChange(),
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Wise"),
			() => NPCTraitGet(CurrentCharacter, "Wise") >= 0,
		],
		Run: [
			() => {
				CharacterNaked(Player);
				CharacterSetActivePose(Player, null);
				InventoryWear(Player, "HempRope", "ItemArms", "Default", Math.floor(Math.random() * 10) + 1);
				InventoryWear(Player, "HempRope", "ItemLegs", "Default", Math.floor(Math.random() * 10) + 1);
				InventoryWear(Player, "SuspensionHempRope", "ItemFeet", "Default", Math.floor(Math.random() * 10) + 1);
				InventoryWear(Player, "HempRopeHarness", "ItemTorso", "Default", Math.floor(Math.random() * 10) + 1);
				InventoryWearRandom(Player, "ItemMouth");
				PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000;
			}
		]
	},{//Gift (gift can only happen once a day if the player is fully collared)
		name: "Gift",
		Conditions:[
			() => Player.Owner != "",
			() => CurrentTime >= NPCEventGet(CurrentCharacter, "LastGift") + 86400000,
			() => CurrentCharacter.Love >= 90
		],
		Run: [
			() => {
				CharacterChangeMoney(Player, 50);
				NPCEventAdd(CurrentCharacter, "LastGift", CurrentTime);
			}
		]
	}
	]
var PrivatePunishment = "";
//var PrivatePunishmentList = ["Cage", "Bound", "BoundPet", "ChastityBelt", "ChastityBra", "ForceNaked", "ConfiscateKey", "ConfiscateCrop", "ConfiscateWhip", "SleepCage"];
const PrivatePunishmentList =[
	{//Cage
		name: "Cage",
		Conditions:[
			() => LogQuery("Cage", "PrivateRoom"),
		]
	},{//Bound
		name: "Bound",
		Conditions:[
			() => true,
		]
	},{//BoundPet
		name: "BoundPet",
		Conditions:[
			() => !Player.IsVulvaChaste(),
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Playful"),
			() => NPCTraitGet(CurrentCharacter, "Playful") >= 0
		]
	},{//ChastityBelt
		name: "ChastityBelt",
		Conditions:[
			() => !Player.IsVulvaChaste(),
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Frigid"),
			() => NPCTraitGet(CurrentCharacter, "Frigid") >= 0
		]
	},{//ChastityBra
		name: "ChastityBra",
		Conditions:[
			() => !Player.IsBreastChaste(),
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Frigid"),
			() => NPCTraitGet(CurrentCharacter, "Frigid") >= 0
		]
	},{//ForcedNaked
		name: "ForcedNaked",
		Conditions:[
			() => !LogQuery("BlockChange", "Rule"),
			() => CurrentCharacter.Trait.map(n=>n.Name).includes("Horny"),
			() => NPCTraitGet(CurrentCharacter, "Horny") >= 0
		]
	},{//ConfisticateKey
		name: "ConfisticateKey",
		Conditions:[
			() => InventoryAvailable(Player, "MetalCuffsKey", "ItemArms"),

		]
	},{//ConfisticateCrop
		name: "ConfisticateCrop",
		Conditions:[
			() => InventoryAvailable(Player, "LeatherCrop", "ItemPelvis")
		]
	},{//ConfisticateWip
		name: "ConfisticateWip",
		Conditions:[
			() => InventoryAvailable(Player, "LeatherWhip", "ItemPelvis")
		]
	},{//SleepCage
		name: "SleepCage",
		Conditions:[
			() => LogQuery("Cage", "PrivateRoom"),
			() => !LogQuery("SleepCage", "Rule")
		]
	}
]

//#region DIALOG CONDITIONS
// Returns TRUE if a specific dialog option is allowed
function PrivateIsCaged() { return (CurrentCharacter.Cage == null) ? false : true }
function PrivateVendorCanPlay() { return (LogQuery("RentRoom", "PrivateRoom") && LogQuery("Wardrobe", "PrivateRoom") && LogQuery("Cage", "PrivateRoom") && Player.CanInteract() && PrivateVendor.CanInteract()) }
function PrivateAllowChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 >= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 < NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateIsRestrained() { return (CurrentCharacter.IsRestrained()) }
function PrivateAllowRestain() { return (CurrentCharacter.AllowItem) }
function PrivateNobodyGagged() { return (Player.CanTalk() && CurrentCharacter.CanTalk()) }
function PrivateCanMasturbate() { return (CharacterIsNaked(CurrentCharacter) && !CurrentCharacter.IsVulvaChaste() && !Player.IsRestrained()) }
function PrivateCanFondle() { return (!CurrentCharacter.IsBreastChaste() && !Player.IsRestrained()) }
function PrivateAllowRestainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 <= NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateWontRestainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 > NPCTraitGet(CurrentCharacter, "Dominant"))) }
function PrivateAllowReleasePlayer() { return (Player.IsRestrained() && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && ((CommonTime() > PrivateReleaseTimer) || CurrentCharacter.IsOwnedByPlayer()) && !PrivateOwnerInRoom()) }
function PrivateWontReleasePlayer() { return (Player.IsRestrained() && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && !((CommonTime() > PrivateReleaseTimer) || CurrentCharacter.IsOwnedByPlayer()) && !PrivateOwnerInRoom()) }
function PrivateWontReleasePlayerOwner() { return (Player.IsRestrained() && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && PrivateOwnerInRoom()) }
function PrivateWillKneel() { return (CurrentCharacter.CanKneel() && CurrentCharacter.CanTalk() && !CurrentCharacter.IsKneeling() && ((ReputationGet("Dominant") > NPCTraitGet(CurrentCharacter, "Dominant")) || CurrentCharacter.IsOwnedByPlayer())) }
function PrivateWillKneelGagged() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.CanTalk() && !CurrentCharacter.IsKneeling() && ((ReputationGet("Dominant") > NPCTraitGet(CurrentCharacter, "Dominant")) || CurrentCharacter.IsOwnedByPlayer())) }
function PrivateWontKneel() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling() && (ReputationGet("Dominant") <= NPCTraitGet(CurrentCharacter, "Dominant")) && !CurrentCharacter.IsOwnedByPlayer()) }
function PrivateCannotKneel() { return (!CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling()) }
function PrivateCanStandUp() { return (CurrentCharacter.CanKneel() && CurrentCharacter.CanTalk() && CurrentCharacter.IsKneeling()) }
function PrivateCanStandUpGagged() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.CanTalk() && CurrentCharacter.IsKneeling()) }
function PrivateCannotStandUp() { return (!CurrentCharacter.CanKneel() && CurrentCharacter.IsKneeling()) }
function PrivateWouldTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") + 50 <= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateWontTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && ((ReputationGet("Dominant") + 50 > NPCTraitGet(CurrentCharacter, "Dominant")) || (CurrentCharacter.Love < 50))) }
function PrivateNeedTimeToTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") + 50 <= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateTrialInProgress() { return ((Player.Owner == "") && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0)) }
function PrivateTrialDoneEnoughLove() { return ((Player.Owner == "") && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0) && (CurrentCharacter.Love >= 90)) }
function PrivateTrialDoneNotEnoughLove() { return ((Player.Owner == "") && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0) && (CurrentCharacter.Love < 90)) }
function PrivateTrialCanCancel() { return ((Player.Owner == "") && NPCEventGet(CurrentCharacter, "EndSubTrial") > 0) }
function PrivateWillForgive() { return (NPCEventGet(CurrentCharacter, "RefusedActivity") < CurrentTime - 60000) }
function PrivateCanAskUncollar() { return (DialogIsOwner() && (NPCEventGet(CurrentCharacter, "PlayerCollaring") > 0) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PlayerCollaring") + NPCLongEventDelay(CurrentCharacter))); }
function PrivateCannotAskUncollar() { return (DialogIsOwner() && (NPCEventGet(CurrentCharacter, "PlayerCollaring") > 0) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PlayerCollaring") + NPCLongEventDelay(CurrentCharacter))); }
function PrivateIsMistress() { return ((CurrentCharacter.Title != null) && (CurrentCharacter.Title == "Mistress")); }
function PrivateWouldTakePlayerAsDom() { return (!Player.IsKneeling() && !Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !CurrentCharacter.IsOwned() && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") - 50 >= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateWontTakePlayerAsDom() { return (!Player.IsKneeling() && !Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !CurrentCharacter.IsOwned() && ((CurrentCharacter.Love < 50) || (ReputationGet("Dominant") - 50 < NPCTraitGet(CurrentCharacter, "Dominant")))) }
function PrivateNeedTimeToTakePlayerAsDom() { return (!Player.IsKneeling() && !Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !CurrentCharacter.IsOwned() && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") - 50 >= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))) }
function PrivateIsHappy() { return (CurrentCharacter.Love > 30) }
function PrivateIsUnhappy() { return (CurrentCharacter.Love < -30) }
function PrivateIsNeutral() { return ((CurrentCharacter.Love >= -30) && (CurrentCharacter.Love <= 30)) }
function PrivateSubTrialInProgress() { return ((NPCEventGet(CurrentCharacter, "EndDomTrial") > 0) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndDomTrial"))) }
function PrivateSubTrialOverWilling() { return ((NPCEventGet(CurrentCharacter, "EndDomTrial") > 0) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndDomTrial")) && (CurrentCharacter.Love >= 90)) }
function PrivateSubTrialOverUnwilling() { return ((NPCEventGet(CurrentCharacter, "EndDomTrial") > 0) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndDomTrial")) && (CurrentCharacter.Love < 90)) }
//#endregion

//#region temp not touch
// Loads the private room vendor NPC
function PrivateLoad() {

	// Loads the vendor and NPCs, also check for relationship decay
	PrivateVendor = CharacterLoadNPC("NPC_Private_Vendor");
	PrivateVendor.AllowItem = false;
	NPCTraitDialog(PrivateVendor);
	for(var C = 1; C < PrivateCharacter.length; C++)
		PrivateLoadCharacter(C);
	PrivateRelationDecay();

}

// Draw all the characters in the private room
function PrivateDrawCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == PrivateCharacterMax) ? 470 : 500;

	// For each character to draw
	for(var C = 0; C < PrivateCharacter.length; C++) {
		if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageBack.png", X + C * S, 0);
		DrawCharacter(PrivateCharacter[C], X + C * S, 0, 1);
		if (PrivateCharacter[C].Cage != null) DrawImage("Screens/Room/Private/CageFront.png", X + C * S, 0);
		DrawButton(X + 145 + C * S, 900, 90, 90, "", "White", "Icons/Character.png");
		if (LogQuery("Cage", "PrivateRoom") && !LogQuery("BlockCage", "Rule"))
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
	if (LogQuery("RentRoom", "PrivateRoom") && Player.CanKneel()) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Kneel.png");
	
	// If we must save a character status after a dialog
	if (PrivateCharacterToSave > 0) {
		ServerPrivateCharacterSync();
		PrivateCharacterToSave = 0;
	}

}

// Checks if the user clicked on a cage button
function PrivateClickCharacterButton() {
	
	// Defines the character position in the private screen
	var X = 1000 - PrivateCharacter.length * 250;
	var S = (PrivateCharacter.length == PrivateCharacterMax) ? 470 : 500;

	// For each character, we find the one to cage, doesn't allow to do it if already in a cage
	for(var C = 0; C < PrivateCharacter.length; C++) {
		if ((MouseX >= X + 265 + C * S) && (MouseX <= X + 355 + C * S))
			if (LogQuery("Cage", "PrivateRoom") && !LogQuery("BlockCage", "Rule"))
				if ((Player.Cage == null) || (C == 0))
					if (!PrivateCharacter[C].IsOwner()) {
						PrivateCharacter[C].Cage = (PrivateCharacter[C].Cage == null) ? true : null;
						if (C > 0) ServerPrivateCharacterSync();
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
			
			// Sets the new character (1000 if she's owner, 2000 if she's owned)
			PrivateCharacterToSave = C;
			if ((PrivateCharacter[C].Stage == "0") && PrivateCharacter[C].IsOwner()) PrivateCharacter[C].Stage = "1000";
			if ((PrivateCharacter[C].Stage == "0") && PrivateCharacter[C].IsOwnedByPlayer()) PrivateCharacter[C].Stage = "2000";
			NPCTraitDialog(PrivateCharacter[C]);
			CharacterSetCurrent(PrivateCharacter[C]);

			// If the owner is serious, she might force the player to kneel
			if ((CurrentCharacter.Stage == "1000") && (CurrentCharacter.Name == Player.Owner.replace("NPC-", "")) && !Player.IsKneeling() && (NPCTraitGet(CurrentCharacter, "Serious") >= Math.random() * 100 - 25)) {
				CurrentCharacter.Stage = "1005";
				NPCLoveChange(CurrentCharacter, -3);
				CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "PlayerMustKneel");
			}
			
		}

}

// When the user clicks in the private room
function PrivateClick() {
	if ((MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) CharacterSetCurrent(Player);
	if ((MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000) && !LogQuery("RentRoom", "PrivateRoom")) { NPCTraitDialog(PrivateVendor); CharacterSetCurrent(PrivateVendor); }
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
function PrivateLoadCharacter(C) {

	// If there's no account, we build the full character from the server template
	if ((PrivateCharacter[C].AccountName == null) && (PrivateCharacter[C].Name != null)) {
		var N = CharacterLoadNPC("NPC_Private_Custom");
		N.Name = PrivateCharacter[C].Name;
		N.AccountName = "NPC_Private_Custom" + N.ID.toString();
		if (PrivateCharacter[C].Title != null) N.Title = PrivateCharacter[C].Title;
		if (PrivateCharacter[C].AssetFamily != null) N.AssetFamily = PrivateCharacter[C].AssetFamily;
		if (PrivateCharacter[C].Appearance != null) N.Appearance = ServerAppearanceLoadFromBundle(PrivateCharacter[C].AssetFamily, PrivateCharacter[C].Appearance);
		if (PrivateCharacter[C].AppearanceFull != null) N.AppearanceFull = ServerAppearanceLoadFromBundle(PrivateCharacter[C].AssetFamily, PrivateCharacter[C].AppearanceFull);
		if (PrivateCharacter[C].Trait != null) N.Trait = PrivateCharacter[C].Trait.slice();
		if (PrivateCharacter[C].Cage != null) N.Cage = PrivateCharacter[C].Cage;
		if (PrivateCharacter[C].Event != null) N.Event = PrivateCharacter[C].Event;
		if (PrivateCharacter[C].Lover != null) N.Lover = PrivateCharacter[C].Lover;
		if (PrivateCharacter[C].Owner != null) N.Owner = PrivateCharacter[C].Owner;
		N.Love = (PrivateCharacter[C].Love == null) ? 0 : parseInt(PrivateCharacter[C].Love);
		AssetReload(N);
		NPCTraitDialog(N);
		CharacterRefresh(N);
		if (NPCEventGet(N, "PrivateRoomEntry") == 0) NPCEventAdd(N, "PrivateRoomEntry", CurrentTime);
		PrivateCharacter[C] = N;
		if (PrivateCharacter[C].CanKneel() && PrivateCharacter[C].IsOwnedByPlayer()) CharacterSetActivePose(PrivateCharacter[C], "Kneel");
	}

	// We allow items on NPC if 25+ dominant reputation, not owner or restrained
	PrivateCharacter[C].AllowItem = (((ReputationGet("Dominant") + 25 >= NPCTraitGet(PrivateCharacter[C], "Dominant")) && !PrivateCharacter[C].IsOwner()) || PrivateCharacter[C].IsOwnedByPlayer() || PrivateCharacter[C].IsRestrained() || !PrivateCharacter[C].CanTalk());

}

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
	ServerPrivateCharacterSync();
	C.AllowItem = (((ReputationGet("Dominant") + 25 >= NPCTraitGet(C, "Dominant")) && !C.IsOwner()) || C.IsRestrained() || !C.CanTalk());
}

// Returns the ID of the private room current character
function PrivateGetCurrentID() {
	for(var P = 1; P < PrivateCharacter.length; P++)
		if (CurrentCharacter.Name == PrivateCharacter[P].Name)
			return P;
}

// When the player kicks out a character
function PrivateKickOut() {
	var ID = PrivateGetCurrentID();
	PrivateCharacter[ID] = null;
	PrivateCharacter.splice(ID, 1);
	ServerPrivateCharacterSync();
	for(var P = 1; P < PrivateCharacter.length; P++)
		if (PrivateCharacter[P] != null) 
			PrivateCharacter[P].AccountName = "NPC_Private_Custom" + P.toString();
	DialogLeave();
}

// When the player tells the character to change
function PrivateChange(NewCloth) {
	if (NewCloth == "Cloth") CharacterDress(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Underwear") CharacterUnderwear(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Naked") CharacterNaked(CurrentCharacter);
}

// Returns TRUE if the player owner is already in the room
//Should this be in the DIALOG CONDITIONS section? <<<<<<
function PrivateOwnerInRoom() {
	for(var C = 1; C < PrivateCharacter.length; C++)
		if (PrivateCharacter[C].IsOwner() && (PrivateCharacter[C].ID != CurrentCharacter.ID))
			return true;
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
	for(var C = 1; C < PrivateCharacter.length; C++) {
		var LastDecay = NPCEventGet(PrivateCharacter[C], "LastDecay");
		if (LastDecay == 0) 
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
//Should this be in the DIALOG CONDITIONS section? <<<<<<
function PrivatePlayerIsOwned() {
	if (Player.Owner != "") return true;
	for(var C = 0; C < PrivateCharacter.length; C++)
		if (PrivateCharacter[C].IsOwner())
			return true;
	return false;
}
//#endregion

//#region tempDone
// Starts a random activity for the player as submissive
function PrivateStartActivity() {

	/*
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
		if ((Act == "Gift") && (Player.Owner != "") && (CurrentCharacter.Love >= 90) && (CurrentTime >= NPCEventGet(CurrentCharacter, "LastGift") + 86400000)) break;
		
		// After 100 tries, we give up on picking an activity and the owner ignore the player
		Count++;
		if (Count >= 100) {
			CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "ActivityNone");
			return;
		}

	}
	*/
	//filter out activities that doesnt fufill all avaliable conditions. 
	//aka if some(or even one)condition === false then filter out
	//and then map only the name (activity in string out as array)

	let ActList = PrivateActivityList.filter(n => !n.Conditions.some(x => x() === false)).map(x => x.name);
	//Pick random item from filtered list
	console.log(ActList);
	//Set to no activity if there's no more new activity avaliable
	if(ActList.length == 1){
		CurrentCharacter.CurrentDialog = DialogFind(CurrentCharacter, "ActivityNone");
		return;
	}	
	else{
		//CommonRandomItemFromList is buggy if list only have one object that is the same as PrivateActivity
		PrivateActivity = CommonRandomItemFromList(PrivateActivity,ActList);
	}
		
		
	
	//PrivateActivity = Act;
	// Starts the activity (any activity adds +2 love automatically)
	PrivateNPCInteraction(2);
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
	/*
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
	
	
	// The gift can only happen once a day if the player is fully collared
	if (PrivateActivity == "Gift") {
		CharacterChangeMoney(Player, 50);
		NPCEventAdd(CurrentCharacter, "LastGift", CurrentTime);
	}
	
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
	*/
	
	//Filter out selected activity again (prefer not have to do this *shrug*)
	//Run selected activity (call all Run functions)
	//Notes for actions are in PrivateActivityList
	let selectedActivity = PrivateActivityList.filter(x => x.name == PrivateActivity);
	if(selectedActivity.length != 1)
		Console.log("There is posibily matching name for Activities in PrivateActivityList, >>the first in list will be used<<");
	//if there are run functions, run it 
	if(selectedActivity[0].Run.length > 0)	
		selectedActivity[0].Run.forEach(x => x());

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

//#endregion
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
	/*
	var Count = 0;
	while (true) {

		// Picks an punishment at random
		PrivatePunishment = CommonRandomItemFromList("", PrivatePunishmentList);

		// If the punishment is valid
		if ((PrivatePunishment == "Cage") && LogQuery("Cage", "PrivateRoom")) break;
		if (PrivatePunishment == "Bound") break;
		if ((PrivatePunishment == "BoundPet") && !Player.IsVulvaChaste() && (NPCTraitGet(CurrentCharacter, "Playful") >= 0)) break;
		if ((PrivatePunishment == "ChastityBelt") && !Player.IsVulvaChaste() && (NPCTraitGet(CurrentCharacter, "Frigid") >= 0)) break;
		if ((PrivatePunishment == "ChastityBra") && !Player.IsBreastChaste() && (NPCTraitGet(CurrentCharacter, "Frigid") >= 0)) break;
		if ((PrivatePunishment == "ForceNaked") && !LogQuery("BlockChange", "Rule") && (NPCTraitGet(CurrentCharacter, "Horny") >= 0)) break;
		if ((PrivatePunishment == "ConfiscateKey") && InventoryAvailable(Player, "MetalCuffsKey", "ItemArms")) break;
		if ((PrivatePunishment == "ConfiscateCrop") && InventoryAvailable(Player, "LeatherCrop", "ItemPelvis")) break;
		if ((PrivatePunishment == "ConfiscateWhip") && InventoryAvailable(Player, "LeatherWhip", "ItemPelvis")) break;
		if ((PrivatePunishment == "SleepCage") && LogQuery("Cage", "PrivateRoom") && !LogQuery("SleepCage", "Rule")) break;

	}
	*/
	//filter for valid punishments
	let ValidPunishments = PrivatePunishmentList.filter(x => !x.Conditions.some(false));
	//pick random from list of punishments
	PrivatePunishment = CommonRandomItemFromList(PrivatePunishment,ValidPunishments);
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
	if (PrivatePunishment == "ChastityBelt") InventoryWear(Player, "MetalChastityBelt", "ItemPelvis");
	if (PrivatePunishment == "ChastityBra") InventoryWear(Player, "MetalChastityBra", "ItemBreast");
	if (PrivatePunishment == "ForceNaked") LogAdd("BlockChange", "Rule", CurrentTime + 1800000);
	if (PrivatePunishment == "ConfiscateKey") InventoryDelete(Player, "MetalCuffsKey", "ItemArms");
	if (PrivatePunishment == "ConfiscateCrop") { InventoryDelete(Player, "LeatherCrop", "ItemPelvis"); InventoryDelete(Player, "LeatherCrop", "ItemBreast"); }
	if (PrivatePunishment == "ConfiscateWhip") { InventoryDelete(Player, "LeatherWhip", "ItemPelvis"); InventoryDelete(Player, "LeatherWhip", "ItemBreast"); }
	if (PrivatePunishment == "SleepCage") LogAdd("SleepCage", "Rule", CurrentTime + 604800000);
}

// Sets up the player collaring ceremony cutscene
function PrivatePlayerCollaring() {
	NPCEventDelete(CurrentCharacter, "EndSubTrial");
	NPCEventAdd(CurrentCharacter, "PlayerCollaring", CurrentTime);
	InventoryRemove(Player, "ItemNeck");
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
	InventoryRemove(Player, "ItemNeck");
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

// The NPC love can only reach 60 without a proper relationship, 100 if in a relationship
function PrivateNPCInteraction(LoveFactor) {
	if (CurrentCharacter.Love == null) CurrentCharacter.Love = 0;
	if ((CurrentCharacter.Love < 60) || (CurrentCharacter.IsOwner()) || (CurrentCharacter.IsOwnedByPlayer()) || (parseInt(LoveFactor) < 0))
		NPCLoveChange(CurrentCharacter, LoveFactor);
}
