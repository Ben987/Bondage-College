"use strict";
var PrivateBackground = "Private";
var PrivateVendor = null;
/** @type {Character[]} */
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

/**
 * Checks if the player is caged.
 * @returns {boolean} - TRUE if the player is in the cage.
 */
function PrivateIsCaged() { return (CurrentCharacter.Cage == null) ? false : true; }
/**
 * Checks if the player can get the second private room expansion.
 * @returns {boolean} - TRUE if the player has the first private room expansion, but not the second.
 */
function PrivateCanGetSecondExtension() { return (LogQuery("Expansion", "PrivateRoom") && !LogQuery("SecondExpansion", "PrivateRoom")); }
/**
 * Checks if the player can play with the private room vendor.
 * @returns {boolean} - TRUE if the player has every upgrade and both characters can interact.
 */
function PrivateVendorCanPlay() { return (LogQuery("RentRoom", "PrivateRoom") && LogQuery("Wardrobe", "PrivateRoom") && LogQuery("Cage", "PrivateRoom") && LogQuery("Expansion", "PrivateRoom") && Player.CanInteract() && PrivateVendor.CanInteract()); }
/**
 * Checks if the player can change her clothes.
 * @returns {boolean} - TRUE if the player is not restrained and is more dominant than the current character.
 */
function PrivateAllowChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 >= NPCTraitGet(CurrentCharacter, "Dominant"))); }
/**
 * Checks if the player is not able to change.
 * @returns {boolean} - TRUE if the player is not restrained, but is not enough dominant to change.
 */
function PrivateWontChange() { return (!CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") + 25 < NPCTraitGet(CurrentCharacter, "Dominant"))); }
/**
 * Checks if the current character is restrained.
 * @returns {boolean} - TRUE if the character is restrained.
 */
function PrivateIsRestrained() { return (CurrentCharacter.IsRestrained()); }
/**
 * Checks if the current character can be restrained.
 * @returns {boolean} - TRUE if the character can be restrained.
 */
function PrivateAllowRestain() { return (CurrentCharacter.AllowItem); }
/**
 * Checks if both characters in the current dialog can talk.
 * @returns {boolean} - TRUE if both characters are not under a gagging effect.
 */
function PrivateNobodyGagged() { return (Player.CanTalk() && CurrentCharacter.CanTalk()); }
/**
 * Checks if the player can masturbate the current character.
 * @returns {boolean} - TRUE if the player is not restrained, the character is not vulva chaste and the character is naked.
 */
function PrivateCanMasturbate() { return (CharacterIsNaked(CurrentCharacter) && !CurrentCharacter.IsVulvaChaste() && !Player.IsRestrained()); }
/**
 * Checks if the player can fondle the current character's breasts.
 * @returns {boolean} - TRUE if the player is not restrained and the character is not breast chaste.
 */
function PrivateCanFondle() { return (!CurrentCharacter.IsBreastChaste() && !Player.IsRestrained()); }
/**
 * Checks if the player can be restrained by the current character.
 * @returns {boolean} - TRUE if both characters are not restrained and the player is less dominant than the NPC.
 */
function PrivateAllowRestrainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 <= NPCTraitGet(CurrentCharacter, "Dominant"))); }
/**
 * Checks if the player cannot be restrained by the current character.
 * @returns {boolean} - TRUE if both characters are not restrained, but the player is too dominant to be tied by the NPC.
 */
function PrivateWontRestrainPlayer() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && (ReputationGet("Dominant") - 25 > NPCTraitGet(CurrentCharacter, "Dominant"))); }
/**
 * Checks if the player can be released by the current character.
 * @returns {boolean} - TRUE if the player is not wearing owner restraints, the player is restrained, the release timer is up or the character is owned by the player, the current character is free and the player's owner is not around.
 */
function PrivateAllowReleasePlayer() { return (Player.IsRestrained() && !InventoryCharacterHasOwnerOnlyRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && ((CommonTime() > PrivateReleaseTimer) || CurrentCharacter.IsOwnedByPlayer()) && !PrivateOwnerInRoom()); }
/**
 * Checks if the player cannot be released by the current character due to time/character restrictions.
 * @returns {boolean} - TRUE if the player is restrained, but cannot be released due to the character not being owned by the player or the release timer not being expired yet.
 */
function PrivateWontReleasePlayer() { return (Player.IsRestrained() && !InventoryCharacterHasOwnerOnlyRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && !((CommonTime() > PrivateReleaseTimer) || CurrentCharacter.IsOwnedByPlayer()) && !PrivateOwnerInRoom()); }
/**
 * Checks if the player cannot be released by the current character due to her owner being around.
 * @returns {boolean} - TRUE if the player is restrained, but cannot be released due to her owner being in the room.
 */
function PrivateWontReleasePlayerOwner() { return (Player.IsRestrained() && !InventoryCharacterHasOwnerOnlyRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract() && PrivateOwnerInRoom()); }
/**
 * Checks if the player cannot be released by the current character due to worn owner only restraint(s).
 * @returns {boolean} - TRUE if the player is restrained, but is wearing owner-only restraints.
 */
function PrivateWontReleasePlayerOwnerOnly() { return (Player.IsRestrained() && InventoryCharacterHasOwnerOnlyRestraint(Player) && CurrentCharacter.CanTalk() && CurrentCharacter.CanInteract()); }
/**
 * Checks if the NPC will kneel willingly while not gagged.
 * @returns {boolean} - TRUE if the player is more dominant than the NPC or if the player owns the NPC.
 */
function PrivateWillKneel() { return (CurrentCharacter.CanKneel() && CurrentCharacter.CanTalk() && !CurrentCharacter.IsKneeling() && ((ReputationGet("Dominant") > NPCTraitGet(CurrentCharacter, "Dominant")) || CurrentCharacter.IsOwnedByPlayer())); }
/**
 * Checks if the NPC will kneel willingly while gagged.
 * @returns {boolean} - TRUE if the player is more dominant than the NPC or if the player owns the NPC.
 */
function PrivateWillKneelGagged() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.CanTalk() && !CurrentCharacter.IsKneeling() && ((ReputationGet("Dominant") > NPCTraitGet(CurrentCharacter, "Dominant")) || CurrentCharacter.IsOwnedByPlayer())); }
/**
 * Checks if the NPC will not kneel willingly.
 * @returns {boolean} - TRUE if the player is less dominant than the NPC and if the player does owns the NPC.
 */
function PrivateWontKneel() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling() && (ReputationGet("Dominant") <= NPCTraitGet(CurrentCharacter, "Dominant")) && !CurrentCharacter.IsOwnedByPlayer()); }
/**
 * Checks if the NPC cannot kneel.
 * @returns {boolean} - TRUE if the NPC cannot kneel.
 */
function PrivateCannotKneel() { return (!CurrentCharacter.CanKneel() && !CurrentCharacter.IsKneeling()); }
/**
 * Checks if the NPC can stand.
 * @returns {boolean} - TRUE if the NPC can stand.
 */
function PrivateCanStandUp() { return (CurrentCharacter.CanKneel() && CurrentCharacter.CanTalk() && CurrentCharacter.IsKneeling()); }
/**
 * Checks if the NPC can stand while gagged.
 * @returns {boolean} - TRUE if the NPC can stand.
 */
function PrivateCanStandUpGagged() { return (CurrentCharacter.CanKneel() && !CurrentCharacter.CanTalk() && CurrentCharacter.IsKneeling()); }
/**
 * Checks if the NPC cannot stand up.
 * @returns {boolean} - TRUE if the NPC is not able to stand.
 */
function PrivateCannotStandUp() { return (!CurrentCharacter.CanKneel() && CurrentCharacter.IsKneeling()); }
/**
 * Checks if the character would take the player as a sub.
 * @returns {boolean} - TRUE if the character is willing to own the player.
 */
function PrivateWouldTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (NPCTraitGet(CurrentCharacter, "Dominant") >= -50) && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") + 50 <= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))); }
/**
 * Checks if the character will not take the player as a sub.
 * @returns {boolean} - TRUE if the character is not willing to own the player.
 */
function PrivateWontTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (NPCTraitGet(CurrentCharacter, "Dominant") >= -50) && ((ReputationGet("Dominant") + 50 > NPCTraitGet(CurrentCharacter, "Dominant")) || (CurrentCharacter.Love < 50))); }
/**
 * Checks if the character would take the player has a sub, but the wait time is not over.
 * @returns {boolean} - TRUE if some time is still needed before the NPC can own the player.
 */
function PrivateNeedTimeToTakePlayerAsSub() { return (!PrivatePlayerIsOwned() && !PrivateIsCaged() && !CurrentCharacter.IsKneeling() && !CurrentCharacter.IsRestrained() && (NPCTraitGet(CurrentCharacter, "Dominant") >= -50) && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") + 50 <= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))); }
/**
 * Checks if the character would never own the player.
 * @returns {boolean} - TRUE if the character is too submissive to own the player.
 */
function PrivateNeverTakePlayerAsSub() { return (NPCTraitGet(CurrentCharacter, "Dominant") < -50); }
/**
 * Checks if the character is currently on a trial.
 * @returns {boolean} - TRUE if the trial is in progress.
 */
function PrivateTrialInProgress() { return ((Player.Owner == "") && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0)); }
/**
 * Checks if the trial period is over and the character likes the player enough.
 * @returns {boolean} - TRUE if the trial period is over and the character loves the player enough.
 */
function PrivateTrialDoneEnoughLove() { return ((Player.Owner == "") && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0) && (CurrentCharacter.Love >= 90)); }
/**
 * Checks if the trial period is over, but the character does not like the player enough.
 * @returns {boolean} - TRUE if the trial period is over, but the character does not like the player enough.
 */
function PrivateTrialDoneNotEnoughLove() { return ((Player.Owner == "") && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndSubTrial")) && (NPCEventGet(CurrentCharacter, "EndSubTrial") > 0) && (CurrentCharacter.Love < 90)); }
/**
 * Checks if the player can cancel an active trial with the current NPC.
 * @returns {boolean} - TRUE if the player can cancel the trial.
 */
function PrivateTrialCanCancel() { return ((Player.Owner == "") && NPCEventGet(CurrentCharacter, "EndSubTrial") > 0); }
/**
 * Checks if the current NPC will forgive the player for refusing to play.
 * @returns {boolean} - TRUE if the NPC forgives the player.
 */
function PrivateWillForgive() { return (NPCEventGet(CurrentCharacter, "RefusedActivity") < CurrentTime - 60000); }
/**
 * Checks if the player can ask to be uncollared.
 * @returns {boolean} - TRUE if the NPC will allow the player to be uncollared.
 */
function PrivateCanAskUncollar() { return (DialogIsOwner() && (NPCEventGet(CurrentCharacter, "PlayerCollaring") > 0) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PlayerCollaring") + NPCLongEventDelay(CurrentCharacter))); }
/**
 * Checks if the player cannot ask to be uncollared.
 * @returns {boolean} - TRUE if the player cannot ask to be uncollared.
 */
function PrivateCannotAskUncollar() { return (DialogIsOwner() && (NPCEventGet(CurrentCharacter, "PlayerCollaring") > 0) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PlayerCollaring") + NPCLongEventDelay(CurrentCharacter))); }
/**
 * Checks if the current character is a mistress.
 * @returns {boolean} - TRUE if the NPC is a club mistress.
 */
function PrivateIsMistress() { return ((CurrentCharacter.Title != null) && (CurrentCharacter.Title == "Mistress")); }
/**
 * Checks if the NPC is willing to take the player as her owner.
 * @returns {boolean} - TRUE if the player can own the NPC
 */
function PrivateWouldTakePlayerAsDom() { return (!Player.IsKneeling() && !Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !CurrentCharacter.IsOwned() && (NPCTraitGet(CurrentCharacter, "Dominant") <= 50) && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") - 50 >= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))); }
/**
 * Checks if the NPC is not willing to take the player as her owner
 * @returns {boolean} - TRUE if the player cannot own the NPC
 */
function PrivateWontTakePlayerAsDom() { return (!Player.IsKneeling() && !Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !CurrentCharacter.IsOwned() && (NPCTraitGet(CurrentCharacter, "Dominant") <= 50) && ((CurrentCharacter.Love < 50) || (ReputationGet("Dominant") - 50 < NPCTraitGet(CurrentCharacter, "Dominant")))); }
/**
 * Checks if the NPC is willing to be own, but the waiting period is not over.
 * @returns {boolean} - TRUE if the NPC can be own, but more time is needed.
 */
function PrivateNeedTimeToTakePlayerAsDom() { return (!Player.IsKneeling() && !Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !CurrentCharacter.IsOwned() && (NPCTraitGet(CurrentCharacter, "Dominant") <= 50) && (CurrentCharacter.Love >= 50) && (ReputationGet("Dominant") - 50 >= NPCTraitGet(CurrentCharacter, "Dominant")) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongEventDelay(CurrentCharacter))); }
/**
 * Checks if the NPC would never take the player as an owner
 * @returns {boolean} - TRUE if the character has a dominant reputation above 50
 */
function PrivateNeverTakePlayerAsDom() { return (!CurrentCharacter.IsRestrained() && NPCTraitGet(CurrentCharacter, "Dominant") > 50); }
/**
 * Checks if the NPC is happy.
 * @returns {boolean} - TRUE if the love value is above 30.
 */
function PrivateIsHappy() { return (CurrentCharacter.Love > 30); }
/**
 * Checks if the NPC is unhappy
 * @returns {boolean} - TRUE if the love value is below -30.
 */
function PrivateIsUnhappy() { return (CurrentCharacter.Love < -30); }
/**
 * Checks if the NPC is in a neutral mood.
 * @returns {boolean} - TRUE if the love value is between -30 and 30
 */
function PrivateIsNeutral() { return ((CurrentCharacter.Love >= -30) && (CurrentCharacter.Love <= 30)); }
/**
 * Checks if the lover NPC is happy.
 * @returns {boolean} - TRUE if the NPC is a lover and the love value is above 30
 */
function PrivateIsLoverHappy() { return ((CurrentCharacter.Love > 30) && CurrentCharacter.IsLoverPrivate()); }
/**
 * Checks if the lover NPC is unhappy.
 * @returns {boolean} - TRUE if the NPC is a lover and the love value is below -30
 */
function PrivateIsLoverUnhappy() { return ((CurrentCharacter.Love < -30) && CurrentCharacter.IsLoverPrivate()); }
/**
 * Checks if the lover NPC is in a neutral mood.
 * @returns {boolean} - TRUE if the NPC is a lover and the love value is between -30 and 30
 */
function PrivateIsLoverNeutral() { return ((CurrentCharacter.Love >= -30) && (CurrentCharacter.Love <= 30) && CurrentCharacter.IsLoverPrivate()); }
/**
 * Checks if the sub trial for the NPC is over.
 * @returns {boolean} - TRUE if the trial period is over.
 */
function PrivateSubTrialInProgress() { return ((NPCEventGet(CurrentCharacter, "EndDomTrial") > 0) && (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndDomTrial"))); }
/**
 * Checks if the NPC is willing to be fully collared after the trial.
 * @returns {boolean} - TRUE if the NPC is willing to be fully collared after the trial.
 */
function PrivateSubTrialOverWilling() { return ((NPCEventGet(CurrentCharacter, "EndDomTrial") > 0) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndDomTrial")) && (CurrentCharacter.Love >= 90)); }
/**
 * Checks if the NPC is not willing to be fully collared after the trial.
 * @returns {boolean} - TRUE if the NPC is not willing to be fully collared after the trial.
 */
function PrivateSubTrialOverUnwilling() { return ((NPCEventGet(CurrentCharacter, "EndDomTrial") > 0) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "EndDomTrial")) && (CurrentCharacter.Love < 90)); }
/**
 * Checks if the player can be pet by a NPC.
 * @returns {boolean} - TRUE if the player is restrained by a petsuit and the NPC is free.
 */
function PrivateCanPet() { return ((CurrentCharacter.Love >= 0) && !CurrentCharacter.IsRestrained() && (InventoryGet(Player, "ItemArms") != null) && (InventoryGet(Player, "ItemArms").Asset.Name == "BitchSuit")); }
/**
 * Checks if the player can sell her slave.
 * @returns {boolean} - TRUE if the player is free and the slave is not a bondage college NPC.
 */
function PrivateCanSellSlave() { return (!Player.IsRestrained() && (CurrentCharacter.Love >= 0) && (CurrentCharacter.Name != "Amanda") && (CurrentCharacter.Name != "Sarah") && (CurrentCharacter.Name != "Sophie") && (CurrentCharacter.Name != "Jennifer") && (CurrentCharacter.Name != "Sidney") && (NPCEventGet(CurrentCharacter, "NPCCollaring") > 0)); }
/**
 * Checks if the player cannot sell her slave.
 * @returns {boolean} - TRUE if the player is free and the slave is not a bondage college NPC, but the current love value is negative.
 */
function PrivateCannotSellSlave() { return (!Player.IsRestrained() && (CurrentCharacter.Love < 0) && (CurrentCharacter.Name != "Amanda") && (CurrentCharacter.Name != "Sarah") && (CurrentCharacter.Name != "Sophie") && (CurrentCharacter.Name != "Jennifer") && (CurrentCharacter.Name != "Sidney") && (NPCEventGet(CurrentCharacter, "NPCCollaring") > 0)); }
/**
 * Checks if the player can get the college outfit.
 * @returns {boolean} - TRUE if the player does not have the college outfit and the current NPC is a bondage college NPC.
 */
function PrivateCanGetCollegeClothes() { return (!InventoryAvailable(Player, "CollegeOutfit1", "Cloth") && ((CurrentCharacter.Name == "Amanda") || (CurrentCharacter.Name == "Sarah") || (CurrentCharacter.Name == "Jennifer") || (CurrentCharacter.Name == "Sidney"))); }
/**
 * Checks if the current NPC is a lover of the player.
 * @returns {boolean} - TRUE if the NPC is a lover of the player.
 */
function PrivateIsLover() { return CurrentCharacter.IsLoverPrivate(); }
/**
 * Checks if the NPC will take the player as a lover.
 * @returns {boolean} - TRUE if the player can have one more lover, the NPC loves the player enough and the event delay has expired.
 */
function PrivateWillTakePlayerAsLover() { return (((CurrentCharacter.Lover == null) || (CurrentCharacter.Lover == "")) && (Player.Lovership.length < 5) && (CurrentCharacter.Love >= 50) && (CurrentTime >= CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongLoverEventDelay(CurrentCharacter))); }
/**
 * Checks if the NPC will not take the player as a lover.
 * @returns {boolean} - TRUE if the player cannot have one more lover, the NPC does not love the player enough, or the event delay has not expired yet.
 */
function PrivateWontTakePlayerAsLover() { return (((CurrentCharacter.Lover == null) || (CurrentCharacter.Lover == "")) && (Player.Lovership.length < 5) && ((CurrentCharacter.Love < 50) || (CurrentTime < CheatFactor("SkipTrialPeriod", 0) * NPCEventGet(CurrentCharacter, "PrivateRoomEntry") + NPCLongLoverEventDelay(CurrentCharacter)))); }
/**
 * Checks if the NPC will not take the player as a lover because she is already dating someone.
 * @returns {boolean} - TRUE if the NPC is already dating something.
 */
function PrivateWontTakePlayerAsLoverAlreadyDating() { return ((CurrentCharacter.Lover != null) && (CurrentCharacter.Lover != "") && (CurrentCharacter.Lover != Player.Name) && (Player.Lovership.length < 5)); }
/**
 * Checks if the NPC will not take the player as a lover because the player reached the lover limit.
 * @returns {boolean} - TRUE if the NPC is free, but the player has 5 lovers.
 */
function PrivateWontTakePlayerAsLoverPlayerDating() { return (((CurrentCharacter.Lover == null) || (CurrentCharacter.Lover == "")) && (Player.Lovership.length >= 5)); }
/**
 * Checks if it's possible for the player to turn the tables against her NPC owner
 * @returns {boolean} - TRUE if turning the tables is possible
 */
function PrivatePlayerCanTurnTables() { return (!Player.IsRestrained() && (ReputationGet("Dominant") - 50 >= NPCTraitGet(CurrentCharacter, "Dominant")) && (NPCEventGet(CurrentCharacter, "PlayerCollaring") > 0)); }
/**
 * Checks if it's possible for the submissive to turn the tables against her player owner
 * @returns {boolean} - TRUE if turning the tables is possible
 */
function PrivateSubCanTurnTables() { return (!Player.IsRestrained() && !CurrentCharacter.IsRestrained() && !Player.IsOwned() && !PrivateOwnerInRoom() && (ReputationGet("Dominant") + 50 <= NPCTraitGet(CurrentCharacter, "Dominant")) && (NPCEventGet(CurrentCharacter, "NPCCollaring") > 0)); }
/**
 * Checks if it's possible to use cheats on an NPC
 * @returns {boolean} - TRUE if we allow NPC cheats
 */
function PrivateNPCAllowCheat() { return (CheatFactor("ChangeNPCTrait", 0) == 0); }

/**
 * Loads the private room screen and the vendor NPC.
 * @returns {void} - Nothing.
 */
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
	Player.ArousalSettings.OrgasmCount = 0;
	NPCTraitDialog(PrivateVendor);
	let mustSync = false;
	for (let C = 1; C < PrivateCharacter.length; C++) {
		const updateRequired = PrivateLoadCharacter(C);
		mustSync = mustSync || updateRequired;
	}
	mustSync = mustSync || PrivateRelationDecay();

	if (mustSync) ServerPrivateCharacterSync();
}

/**
 * Draws all the characters in the private room.
 * @returns {void} - Nothing.
 */
function PrivateDrawCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - ((PrivateCharacter.length - PrivateCharacterOffset) * 250);
	if (X < 0) X = 0;

	// For each character to draw (maximum 4 at a time)
	for (let C = PrivateCharacterOffset; (C < PrivateCharacter.length && C < PrivateCharacterOffset + 4); C++) {

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

				// Draw the "X in the asylum for a day" text
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

/**
 * Runs the private room screen.
 * @returns {void} - Nothing.
 */
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
	if (LogQuery("RentRoom", "PrivateRoom")) {
		if (Player.CanKneel()) DrawButton(1885, 145, 90, 90, "", "White", "Icons/Kneel.png");
		DrawButton(1885, 745, 90, 90, "", "White", "Icons/CollegeBackground.png", TextGet("MainHallBackground"));
		DrawButton(1885, 865, 90, 90, "", "White", "Icons/BedroomBackground.png", TextGet("PrivateRoomBackground"));
	}

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

/**
 * Handles clicks on the buttons below NPCs.
 * @returns {void} - Nothing.
 */
function PrivateClickCharacterButton() {

	// Defines the character position in the private screen
	var X = 1000 - ((PrivateCharacter.length - PrivateCharacterOffset) * 250);
	if (X < 0) X = 0;

	// For each character, we check if the player clicked on the cage or information button
	for (let C = PrivateCharacterOffset; (C < PrivateCharacter.length && C < PrivateCharacterOffset + 4); C++) {

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

/**
 * Handles clicks on the NPCs.
 * @returns {void} - Nothing.
 */
function PrivateClickCharacter() {

	// Defines the character position in the private screen
	var X = 1000 - ((PrivateCharacter.length - PrivateCharacterOffset) * 250);
	if (X < 0) X = 0;

	// For each character, we find the one that was clicked and open it's dialog
	for (let C = PrivateCharacterOffset; (C < PrivateCharacter.length && C < PrivateCharacterOffset + 4); C++)
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

/**
 * Handles clicks in the private room.
 * @returns {void} - Nothing.
 */
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
	if (MouseIn(500, 0, 500, 1000) && !LogQuery("RentRoom", "PrivateRoom")) CharacterSetCurrent(Player);
	if (MouseIn(1000, 0, 500, 1000) && !LogQuery("RentRoom", "PrivateRoom")) { NPCTraitDialog(PrivateVendor); CharacterSetCurrent(PrivateVendor); }
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk() && (Player.Cage == null)) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90) && LogQuery("RentRoom", "PrivateRoom") && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null, true);
	if (MouseIn(1885, 265, 90, 90) && LogQuery("RentRoom", "PrivateRoom") && Player.CanWalk() && (Player.Cage == null)) CharacterSetCurrent(PrivateVendor);
	if (MouseIn(1885, 385, 90, 90) && LogQuery("RentRoom", "PrivateRoom") && Player.CanChange()) CharacterAppearanceLoadCharacter(Player);
	if (MouseIn(1885, 505, 90, 90) && LogQuery("RentRoom", "PrivateRoom") && Player.CanChange() && LogQuery("Wardrobe", "PrivateRoom")) CommonSetScreen("Character", "Wardrobe");
	if (MouseIn(1885, 625, 90, 90) && LogQuery("RentRoom", "PrivateRoom") && LogQuery("Expansion", "PrivateRoom")) PrivateCharacterOffset = (PrivateCharacterOffset + 4 == PrivateCharacterMax) ? 0 : PrivateCharacterOffset + 4;
	if (MouseIn(1885, 745, 90, 90) && LogQuery("RentRoom", "PrivateRoom")) {
		if (Player.VisualSettings == null) Player.VisualSettings = {};
		let backgrounds = BackgroundsGenerateList(BackgroundsPrivateRoomTagList);
		let index = backgrounds.indexOf(MainHallBackground);
		if (index < 0) index = 0;
		BackgroundSelectionMake(backgrounds, index, Name => {
			Player.VisualSettings.MainHallBackground = Name;
			ServerSend("AccountUpdate", { VisualSettings: Player.VisualSettings });
		});
	}
	if (MouseIn(1885, 865, 90, 90) && LogQuery("RentRoom", "PrivateRoom")) {
		if (Player.VisualSettings == null) Player.VisualSettings = {};
		let backgrounds = BackgroundsGenerateList(BackgroundsPrivateRoomTagList);
		let index = backgrounds.indexOf(PrivateBackground);
		if (index < 0) index = 0;
		BackgroundSelectionMake(backgrounds, index, Name => {
			Player.VisualSettings.PrivateRoomBackground = Name;
			PrivateBackground = Name;
			ServerSend("AccountUpdate", { VisualSettings: Player.VisualSettings });
		});

	}

	if ((MouseX <= 1885) && (MouseY < 900) && LogQuery("RentRoom", "PrivateRoom") && (Player.Cage == null)) PrivateClickCharacter();
	if ((MouseX <= 1885) && (MouseY >= 900) && LogQuery("RentRoom", "PrivateRoom")) PrivateClickCharacterButton();

}

/**
 * Triggered when the player rents the room.
 * @returns {void} - Nothing.
 */
function PrivateRentRoom() {
	CharacterChangeMoney(Player, -250);
	LogAdd("RentRoom", "PrivateRoom");
}

/**
 * Triggered when the player gets the wardrobe.
 * @returns {void} - Nothing.
 */
function PrivateGetWardrobe() {
	CharacterChangeMoney(Player, -100);
	LogAdd("Wardrobe", "PrivateRoom");
}

/**
 * Triggered when the player gets the cage.
 * @returns {void} - Nothing.
 */
function PrivateGetCage() {
	CharacterChangeMoney(Player, -150);
	LogAdd("Cage", "PrivateRoom");
}

/**
 * Triggered when the player gets the room expansion.
 * @returns {void} - Nothing.
 */
function PrivateGetExpansion() {
	CharacterChangeMoney(Player, -200);
	LogAdd("Expansion", "PrivateRoom");
	PrivateCharacterMax = 8;
}

/**
 * Triggered when the player gets the second room expansion.
 * @returns {void} - Nothing.
 */
function PrivateGetSecondExpansion() {
	CharacterChangeMoney(Player, -400);
	LogAdd("SecondExpansion", "PrivateRoom");
	PrivateCharacterMax = 12;
}

/**
 * Loads a given private room character.
 * @param {number} C - Index of the private character to load.
 * @returns {boolean} - Update required.
 */
function PrivateLoadCharacter(C) {
	let updateRequired = false;

	// If there's no account, we build the full character from the server template
	if ((PrivateCharacter[C].AccountName == null) && (PrivateCharacter[C].Name != null)) {
		const N = CharacterLoadNPC("NPC_Private_Custom");
		N.Name = PrivateCharacter[C].Name;
		PrivateCharacter[C].AccountName = "NPC_Private_Custom" + N.ID.toString();
		N.AccountName = "NPC_Private_Custom" + N.ID.toString();
		if (PrivateCharacter[C].Title != null) N.Title = PrivateCharacter[C].Title;
		if (PrivateCharacter[C].AssetFamily != null) N.AssetFamily = PrivateCharacter[C].AssetFamily;
		if (PrivateCharacter[C].Appearance != null) {
			const updateValid = ServerAppearanceLoadFromBundle(N, PrivateCharacter[C].AssetFamily, PrivateCharacter[C].Appearance);
			updateRequired = updateRequired || !updateValid;
		}
		if (PrivateCharacter[C].AppearanceFull != null) {
			const updateValid = ServerAppearanceLoadFromBundle(N, PrivateCharacter[C].AssetFamily, PrivateCharacter[C].AppearanceFull, null, true);
			updateRequired = updateRequired || !updateValid;
		}
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
		if (PrivateCharacter[C].CanKneel() && PrivateCharacter[C].IsOwnedByPlayer()) CharacterSetActivePose(PrivateCharacter[C], "Kneel", true);
	}

	// We allow items on NPC if 25+ dominant reputation, not owner or restrained
	if (PrivateCharacter[C].ArousalSettings == null) NPCArousal(PrivateCharacter[C]);
	PrivateCharacter[C].ArousalSettings.Active = "Automatic";
	PrivateCharacter[C].ArousalSettings.Visible = "All";
	PrivateCharacter[C].AllowItem = (((ReputationGet("Dominant") + 25 >= NPCTraitGet(PrivateCharacter[C], "Dominant")) && !PrivateCharacter[C].IsOwner()) || PrivateCharacter[C].IsOwnedByPlayer() || PrivateCharacter[C].IsRestrained() || !PrivateCharacter[C].CanTalk());

	return updateRequired;
}

/**
 * Triggered when a new character is added to the player's private room.
 * @param {object} Template - The base of the character, includes the name and appearance.
 * @param {string} Archetype - The type of character such as maid or mistress.
 * @param {boolean} CustomData - Whether or not the character has non-random traits.
 * @returns {void} - Nothing.
 */
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

/**
 * Gets the index of a given private room character.
 * @returns {number} - Index of the NPC inside the private characters array.
 */
function PrivateGetCurrentID() {
	for (let P = 1; P < PrivateCharacter.length; P++)
		if (CurrentCharacter.Name == PrivateCharacter[P].Name)
			return P;
}

/**
 * Triggered when the player kicks out a character.
 * @returns {void} - Nothing.
 */
function PrivateKickOut() {
	var ID = PrivateGetCurrentID();
	PrivateCharacter[ID] = null;
	PrivateCharacter.splice(ID, 1);
	ServerPrivateCharacterSync();
	for (let P = 1; P < PrivateCharacter.length; P++)
		if (PrivateCharacter[P] != null)
			PrivateCharacter[P].AccountName = "NPC_Private_Custom" + P.toString();
	DialogLeave();
}

/**
 * Triggered when the player tells a NPC to change.
 * @param {Asset[]} NewCloth - The new appearance to dress the NPC with
 * @returns {void} - Nothing.
 */
function PrivateChange(NewCloth) {
	if (NewCloth == "Cloth") CharacterDress(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Underwear") CharacterUnderwear(CurrentCharacter, CurrentCharacter.AppearanceFull);
	if (NewCloth == "Naked") CharacterNaked(CurrentCharacter);
	if (NewCloth == "Custom") {
		PrivateNPCInteraction(10);
		if (CheatFactor("FreeNPCDress", 0) != 0) CharacterChangeMoney(Player, -50);
		PrivateCharacterNewClothes = CurrentCharacter;
		DialogLeave();
		CharacterAppearanceLoadCharacter(PrivateCharacterNewClothes);
	}
}

/**
 * Checks if the player's owner is inside her private room.
 * @returns {boolean} - Returns TRUE if the player's owner is inside her private room.
 */
function PrivateOwnerInRoom() {
	for (let C = 1; C < PrivateCharacter.length; C++) {
		if ((PrivateCharacter[C].AccountName == null) && (PrivateCharacter[C].Name != null) && (PrivateCharacter[C].Name == Player.Owner.replace("NPC-", ""))) return true;
		if ((PrivateCharacter[C].AccountName != null) && PrivateCharacter[C].IsOwner() && (CurrentCharacter != null) && (PrivateCharacter[C].ID != CurrentCharacter.ID)) return true;
		if ((PrivateCharacter[C].AccountName != null) && PrivateCharacter[C].IsOwner() && (CurrentCharacter == null)) return true;
	}
	return false;
}

/**
 * Checks if the player's lover is inside her private room.
 * @param {number} L - Index of the lover to check for.
 * @returns {boolean} - Returns TRUE if the player's lover is inside her private room.
 */
function PrivateLoverInRoom(L) {
	for (let C = 1; C < PrivateCharacter.length; C++) {
		if ((PrivateCharacter[C].AccountName == null) && (PrivateCharacter[C].Name != null) && (Player.GetLoversNumbers()[L] == "NPC-" + PrivateCharacter[C].Name)) return true;
		if ((PrivateCharacter[C].AccountName != null) && (Player.GetLoversNumbers()[L] == "NPC-" + PrivateCharacter[C].Name) && (CurrentCharacter != null) && (PrivateCharacter[C].ID != CurrentCharacter.ID)) return true;
		if ((PrivateCharacter[C].AccountName != null) && (Player.GetLoversNumbers()[L] == "NPC-" + PrivateCharacter[C].Name) && (CurrentCharacter == null)) return true;
	}
	return false;
}

/**
 * Triggered when a NPC restrains the player, there's a 1-2 minute timer before the player can be released.
 * @returns {void} - Nothing.
 */
function PrivateRestrainPlayer() {
	CharacterFullRandomRestrain(Player);
	PrivateNPCInteraction(5);
	PrivateReleaseTimer = CommonTime() + (Math.random() * 60000) + 60000;
}

/**
 * Alters relationships to make them decay after some time. Below -100, the NPC leaves if she's not caged.
 * @returns {boolean} - Whether or not any private characters require updating.
 */
function PrivateRelationDecay() {
	var MustSave = false;
	for (let C = 1; C < PrivateCharacter.length; C++) {
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
	return MustSave;
}

/**
 * Triggered when the player starts a submissive trial with an NPC
 * @param {number} ChangeRep - Amount of dominant reputation to lose.
 * @returns {void} - Nothing.
 */
function PrivateStartTrial(ChangeRep) {
	DialogChangeReputation("Dominant", ChangeRep);
	CharacterDress(CurrentCharacter, CurrentCharacter.AppearanceFull);
	NPCEventAdd(CurrentCharacter, "EndSubTrial", CurrentTime + NPCLongEventDelay(CurrentCharacter));
	NPCLoveChange(CurrentCharacter, 30);
	ServerPrivateCharacterSync();
}

/**
 * Triggered when the player stops a submissive trial with an NPC
 * @param {number} ChangeRep - Amount of dominant reputation to gain/lose.
 * @returns {void} - Nothing.
 */
function PrivateStopTrial(ChangeRep) {
	DialogChangeReputation("Dominant", ChangeRep);
	NPCEventDelete(CurrentCharacter, "EndSubTrial");
	NPCLoveChange(CurrentCharacter, -60);
	ServerPrivateCharacterSync();
}

/**
 * Shows the number or hours remaining for the trial in the dialog phrase.
 * @returns {void} - Nothing.
 */
function PrivateShowTrialHours() {
	CurrentCharacter.CurrentDialog = CurrentCharacter.CurrentDialog.replace("DialogHours", Math.ceil((NPCEventGet(CurrentCharacter, "EndSubTrial") - CurrentTime) / 3600000).toString());
}

/**
 * Checks if the player is owned. (In general)
 * @returns {boolean} - Returns TRUE if the player has an owner.
 */
function PrivatePlayerIsOwned() {
	if (Player.Owner != "") return true;
	for (let C = 0; C < PrivateCharacter.length; C++)
		if (typeof PrivateCharacter[C].IsOwner === 'function')
			if (PrivateCharacter[C].IsOwner())
				return true;
	return false;
}

/**
 * Checks if an NPC in the private room can be restrained by another.
 * @returns {boolean} - Returns TRUE if someone else in the room can be restrained by the player's owner, keep that target in a variable to be used later
 */
function PrivateCanRestrainOther() {
	PrivateActivityTarget = null;
	var List = [];
	for (let C = 0; C < PrivateCharacter.length; C++)
		if ((PrivateCharacter[C].ID != 0) && (PrivateCharacter[C].ID != CurrentCharacter.ID) && (NPCTraitGet(CurrentCharacter, "Dominant") > NPCTraitGet(PrivateCharacter[C], "Dominant")) && (InventoryGet(PrivateCharacter[C], "ItemArms") == null))
			List.push(PrivateCharacter[C]);
	if (List.length > 0)
		PrivateActivityTarget = List[Math.floor(Math.random() * List.length)];
	return (PrivateActivityTarget != null);
}

/**
 * Starts a random activity for the player as submissive.
 * @returns {void} - Nothing.
 */
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

/**
 * Runs the currently selected activity
 * @param {number} LoveFactor - Amount of love to be added or removed from the NPC.
 * @returns {void} - Nothing.
 */
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
		InventoryRemove(Player, "HairAccessory3");
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

/**
 * Set the no change rule for the player.
 * @param {number} Minutes - The number of minutes to apply the rule for
 * @returns {void} - Nothing.
 */
function PrivateBlockChange(Minutes) {
	LogAdd("BlockChange", "Rule", CurrentTime + (Minutes * 60000));
	ServerPlayerAppearanceSync();
}

/**
 * Starts a random punishment for the player as submissive.
 * @returns {void} - Nothing.
 */
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
		if ((PrivatePunishment == "ConfiscateKey") && (InventoryAvailable(Player, "MetalCuffsKey", "ItemMisc") || InventoryAvailable(Player, "MetalPadlockKey", "ItemMisc") || InventoryAvailable(Player, "IntricatePadlockKey", "ItemMisc") || InventoryAvailable(Player, "HighSecurityPadlockKey", "ItemMisc"))) break;
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

/**
 * Runs the currently selected player punishment.
 * @param {number} LoveFactor - Amount of love to be added or removed from the NPC.
 * @returns {void} - Nothing.
 */
function PrivateRunPunishment(LoveFactor) {
	NPCLoveChange(CurrentCharacter, LoveFactor);
	NPCEventAdd(CurrentCharacter, "RefusedActivity", CurrentTime);
	if (PrivatePunishment == "Cage") { Player.Cage = true; LogAdd("BlockCage", "Rule", CurrentTime + 120000); DialogLeave(); }
	if (PrivatePunishment == "Bound") { PrivateReleaseTimer = CommonTime() + 240000; CharacterFullRandomRestrain(Player, "All"); InventoryRemove(Player, "ItemArms"); InventoryWear(Player, "HempRope", "ItemArms"); InventorySetDifficulty(Player, "ItemArms", 12); }
	if (PrivatePunishment == "BoundPet") { PrivateReleaseTimer = CommonTime() + 240000; CharacterSetActivePose(Player, "Kneel", true); InventoryWear(Player, "LeatherBelt", "ItemLegs"); InventoryWear(Player, "TailButtPlug", "ItemButt"); InventoryWear(Player, "Ears" + (Math.floor(Math.random() * 2) + 1).toString(), "Hat"); InventoryWear(Player, "LeatherArmbinder", "ItemArms"); InventorySetDifficulty(Player, "ItemArms", 15); }
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

/**
 * Sets up the player collaring ceremony cutscene.
 * @returns {void} - Nothing.
 */
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

/**
 * Starts the D/s trial period with the player as the owner.
 * @param {number} TrialTime - amount of days the trial will go for.
 * @returns {void} - Nothing.
 */
function PrivateStartDomTrial(TrialTime) {
	DialogChangeReputation("Dominant", TrialTime);
	NPCEventAdd(CurrentCharacter, "EndDomTrial", CurrentTime + TrialTime * 86400000);
	NPCLoveChange(CurrentCharacter, TrialTime * 5);
	ServerPrivateCharacterSync();
}

/**
 * Sets up the NPC collaring ceremony cutscene.
 * @returns {void} - Nothing.
 */
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

/**
 * Triggered when the player gets a NPC lover, it assigns the current character as one of the player's lovers.
 * @returns {void} - Nothing.
 */
function PrivateStartGirlfriend() {
	NPCEventAdd(CurrentCharacter, "Girlfriend", CurrentTime);
	CurrentCharacter.Lover = Player.Name;
	NPCLoveChange(CurrentCharacter, 20);
	Player.Lover = "NPC-" + CurrentCharacter.Name;
	ServerPlayerSync();
	ServerPrivateCharacterSync();
}

/**
 * Processes a love change for a NPC.The NPC love can only reach 60 without a proper relationship, 100 if in a relationship.
 * @param {number} LoveFactor - Amount of love to gain or lose.
 * @returns {void} - Nothing.
 */
function PrivateNPCInteraction(LoveFactor) {
	if (CurrentCharacter.Love == null) CurrentCharacter.Love = 0;
	if ((CurrentCharacter.Love < 60) || (CurrentCharacter.IsOwner()) || (CurrentCharacter.IsOwnedByPlayer()) || CurrentCharacter.IsLoverPrivate() || (parseInt(LoveFactor) < 0))
		NPCLoveChange(CurrentCharacter, LoveFactor);
}

/**
 * Triggered when the slave market transation starts (10$ + 1$ per day for sold slave + 0% to 100% from the random auction, divide in 7 for rentals)
 * @param {"Rent" | "Sell"} AuctionType - Type of the auction to start.
 * @returns {void} - Nothing.
 */
function PrivateSlaveMarketStart(AuctionType) {
	if (AuctionType == "Rent") NPCEventAdd(CurrentCharacter, "SlaveMarketRent", CurrentTime + 86400000);
	else InventoryRemove(CurrentCharacter, "ItemNeck");
	CharacterRelease(CurrentCharacter);
	CharacterNaked(CurrentCharacter);
	CharacterSetActivePose(CurrentCharacter, "Kneel", true);
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

/**
 * Triggered when the player selects how to improve her slave.
 * @param {string} Type - Trait to improve.
 * @returns {void} - Nothing.
 */
function PrivateSlaveImproveSelect(Type) {
	PrivateSlaveImproveType = Type;
}

/**
 * Triggered when the player's slave is sent to the asylum to have a trait corrected. (The higher the value, the slower it raises)
 * @returns {void} - Nothing.
 */
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

/**
 * Triggered when Amanda/Sarah/Sidney/Jennifer gives her college outfit to the player.
 * @returns {void} - Nothing.
 */
function PrivateGetCollegeClothes() {
	NPCLoveChange(CurrentCharacter, -10);
	InventoryAdd(Player, "CollegeOutfit1", "Cloth");
	if ((InventoryGet(CurrentCharacter, "Cloth") != null) && (InventoryGet(CurrentCharacter, "Cloth").Asset.Name == "CollegeOutfit1")) InventoryRemove(CurrentCharacter, "Cloth");
}

/**
 * Triggered when the player says "I love you" to her NPC girlfriend.
 * @returns {void} - Nothing.
 */
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

/**
 * Triggered when the player starts turning the tables on her NPC owner.  The player stands up.
 * @returns {void} - Nothing.
 */
function PrivatePlayerTurnTablesStart() {
	CharacterSetActivePose(Player, null);
	PrivateNPCInteraction(-5);
}

/**
 * Triggered when the player turns the table with her owner but only removes her collar
 * @returns {void} - Nothing.
 */
function PrivatePlayerTurnTablesRemove() {
	PrivateNPCInteraction(-20);
	NPCEventDelete(CurrentCharacter, "EndSubTrial");
	ManagementReleaseFromOwner(8);
}

/**
 * Triggered when the player turns the table with her owner and transfer her collar
 * @returns {void} - Nothing.
 */
function PrivatePlayerTurnTablesCollar() {
	PrivateNPCInteraction(10);
	ManagementReleaseFromOwner(15);
	NPCEventDelete(CurrentCharacter, "EndSubTrial");
	NPCEventAdd(CurrentCharacter, "NPCCollaring", CurrentTime);
	CurrentCharacter.Owner = Player.Name;
	InventoryWear(CurrentCharacter, "SlaveCollar", "ItemNeck");
	ServerPrivateCharacterSync();
}

/**
 * Triggered when the sub starts to the turn the tables against the player
 * @returns {void} - Nothing.
 */
function PrivateSubTurnTablesStart() {
	CharacterSetActivePose(CurrentCharacter, null);
	PrivateNPCInteraction(-3);
}

/**
 * Triggered when the sub turns the table on the player
 * @returns {void} - Nothing.
 */
function PrivateSubTurnTablesDone() {

	// Clears the submissive ownership
	NPCEventDelete(CurrentCharacter, "EndSubTrial");
	NPCEventDelete(CurrentCharacter, "NPCCollaring");
	CurrentCharacter.Owner = "";
	InventoryRemove(CurrentCharacter, "ItemNeck");
	InventoryRemove(CurrentCharacter, "ItemNeckAccessories");
	InventoryRemove(CurrentCharacter, "ItemNeckRestraints");
	PrivateNPCInteraction(10);
	ServerPrivateCharacterSync();

	// The submissive becomes the player owner and the player gets collared
	NPCEventAdd(CurrentCharacter, "PlayerCollaring", CurrentTime);
	ReputationProgress("Dominant", -20);
	InventoryRemove(Player, "ItemNeck");
	InventoryRemove(Player, "ItemNeckAccessories");
	InventoryRemove(Player, "ItemNeckRestraints");
	InventoryWear(Player, "SlaveCollar", "ItemNeck");
	Player.Owner = "NPC-" + CurrentCharacter.Name;
	ServerPlayerSync();

}

/**
 * When the player triggers a cheat on a NPC
 * @returns {void} - Nothing.
 */
function PrivateNPCCheat(Type) {
	if (Type == "TraitDominant") NPCTraitSet(CurrentCharacter, "Dominant", (NPCTraitGet(CurrentCharacter, "Dominant") >= 90) ? 100 : NPCTraitGet(CurrentCharacter, "Dominant") + 10);
	if (Type == "TraitSubmissive") NPCTraitSet(CurrentCharacter, "Dominant", (NPCTraitGet(CurrentCharacter, "Dominant") <= -90) ? -100 : NPCTraitGet(CurrentCharacter, "Dominant") - 10);
}
