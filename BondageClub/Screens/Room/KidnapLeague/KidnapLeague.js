"use strict";
var KidnapLeagueBackground = "KidnapLeague";
var KidnapLeagueTrainer = null;
var KidnapLeagueRandomKidnapper = null;
var KidnapLeagueRandomKidnapperScenario = "0";
var KidnapLeagueRandomKidnapperDifficulty = 0;
var KidnapLeagueArchetype = null;
var KidnapLeagueWillPayForFreedom = false;
var KidnapLeagueRandomActivityList = ["AddGag", "RemoveGag", "AddFeet", "RemoveFeet", "AddLegs", "RemoveLegs", "Tickle", "Spank", "Kiss", "Fondle"];
var KidnapLeagueRandomActivity = "";
var KidnapLeagueRandomActivityCount = 0;
var KidnapLeagueBounty = null;
var KidnapLeagueBountyDifficulty = null;
var KidnapLeagueBountyLocation = "";
var KidnapLeagueBountyLocationList = ["Introduction", "MaidQuarters", "Shibari", "Shop"];
var KidnapLeagueBountyVictory = null;
var KidnapLeagueVisitRoom = false;

/**
 * Checks if the player can be kidnapped
 * @returns {boolean} - Returns TRUE if the player is restrained and the trainer is not.
 */
function KidnapLeagueAllowKidnap() { return (!Player.IsRestrained() && !KidnapLeagueTrainer.IsRestrained()) }
/**
 * Checks if the kidnap league trainer is restrained.
 * @returns {boolean} - Returns TRUE if the kidnap league trainer is restrained.
 */
function KidnapLeagueIsTrainerRestrained() { return KidnapLeagueTrainer.IsRestrained() }
/**
 * Checks if the player can take a new kidnap league bounty.
 * @returns {boolean} - Returns TRUE if the player has no active bounty.
 */
function KidnapLeagueCanTakeBounty() { return ((ReputationGet("Kidnap") > 0) && (KidnapLeagueBounty == null)) }
/**
 * Checks if a kidnap league bounty was taken.
 * @returns {boolean} - Returns TRUE if the player has an active and unfinished bounty.
 */
function KidnapLeagueBountyTaken() { return ((ReputationGet("Kidnap") > 0) && (KidnapLeagueBounty != null) && (KidnapLeagueBountyVictory == null)) }
/**
 * Checks if the current bounty resulted in a victory.
 * @returns {boolean} - Returns TRUE if the current bounty resulted in a victory.
 */
function KidnapLeagueBountyWasVictory() { return ((ReputationGet("Kidnap") > 0) && (KidnapLeagueBounty != null) && (KidnapLeagueBountyVictory == true)) }
/**
 * Checks if the current bounty resulted in a defeat.
 * @returns {boolean} - Returns TRUE if the current bounty resulted in a defeat.
 */
function KidnapLeagueBountyWasDefeat() { return ((ReputationGet("Kidnap") > 0) && (KidnapLeagueBounty != null) && (KidnapLeagueBountyVictory == false)) }
/**
 * Checks if a NPC can be transfered to the player's private room.
 * @returns {boolean} - Returns TRUE if the player has an accessible private room and a free spot for a NPC.
 */
function KidnapLeagueCanTransferToRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax) && !LogQuery("LockOutOfPrivateRoom", "Rule")) }
/**
 * Checks if the NPC will not visit the player's private room.
 * @returns {boolean} - Returns TRUE if the NPC won't come to the private room even if it's possible
 */
function KidnapLeagueWontVisitRoom() { return (!KidnapLeagueVisitRoom && KidnapLeagueCanTransferToRoom()) }
/**
 * Checks if both players can kiss.
 * @returns {boolean} - Returns TRUE if both players are able to talk which means they can kiss.
 */
function KidnapLeagueCanKiss() { return (Player.CanTalk() && CurrentCharacter.CanTalk()) }

/**
 * Loads the kidnap league NPC
 * @returns {void} - Nothing
 */
function KidnapLeagueLoad() {
	KidnapLeagueBackground = "KidnapLeague";
	KidnapLeagueTrainer = CharacterLoadNPC("NPC_KidnapLeague_Trainer");
	KidnapLeagueTrainer.AllowItem = ((KidnapLeagueTrainer.Stage == "100") || (KidnapLeagueTrainer.Stage == "110"));
}

/**
 * Runs and draws the kidnap league,  this room can be used for daily job search
 * @returns {void} - Nothing
 */
function KidnapLeagueRun() {
	if (!DailyJobSubSearchIsActive()) DrawCharacter(Player, 500, 0, 1);
	if (!DailyJobSubSearchIsActive()) DrawCharacter(KidnapLeagueTrainer, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	DailyJobSubSearchRun();
}

/**
 * Handles clicks in the kidnap league room, this room can be used for daily job search
 * @returns {void} - Nothing
 */
function KidnapLeagueClick() {
	if (!DailyJobSubSearchIsActive() && MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (!DailyJobSubSearchIsActive() && MouseIn(1000, 0, 500, 1000)) {
		ManagementClubSlaveDialog(KidnapLeagueTrainer);
		CharacterSetCurrent(KidnapLeagueTrainer);
	}
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) {
		if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null)) {
			InventoryWear(Player, KidnapPlayerCloth.Asset.Name, "Cloth", KidnapPlayerCloth.Color);
			if (KidnapPlayerClothAccessory != null) InventoryWear(Player, KidnapPlayerClothAccessory.Asset.Name, "ClothAccessory", KidnapPlayerClothAccessory.Color);
			if (KidnapPlayerClothLower != null) InventoryWear(Player, KidnapPlayerClothLower.Asset.Name, "ClothLower", KidnapPlayerClothLower.Color);
		}
		CommonSetScreen("Room", "MainHall");
	}
	DailyJobSubSearchClick();
}

/**
 * Triggered when the player takes a bounty of a given difficulty. An easy bounty lowers the kidnap reputation.
 * @param {number} Difficulty - Difficulty factor of the bounty.
 * @returns {void} - Nothing
 */
function KidnapLeagueTakeBounty(Difficulty) {
	KidnapLeagueBountyDifficulty = parseInt(Difficulty) + Math.floor(Math.random() * 4);
	KidnapLeagueBounty = null;
	CharacterDelete("NPC_KidnapLeague_RandomKidnapper");
	KidnapLeagueBounty = CharacterLoadNPC("NPC_KidnapLeague_RandomKidnapper");
	KidnapLeagueBountyLocation = CommonRandomItemFromList(KidnapLeagueBountyLocation, KidnapLeagueBountyLocationList);
	KidnapLeagueArchetype = (KidnapLeagueBountyLocation == "MaidQuarters") ? "Maid" : null;
	KidnapLeagueBountyRemind();
	KidnapLeagueBountyVictory = null;
	if (KidnapLeagueBountyLocation == "MaidQuarters") { InventoryWear(KidnapLeagueBounty, "MaidOutfit1", "Cloth", "Default"); InventoryWear(KidnapLeagueBounty, "MaidHairband1", "Hat", "Default"); }
	if (KidnapLeagueBountyLocation == "Shibari") InventoryWear(KidnapLeagueBounty, "ChineseDress1", "Cloth");
}

/**
 * Triggered when the league trainer reminds the player of her current bounty. The proper character dialog for it is set.
 * @returns {void} - Nothing
 */
function KidnapLeagueBountyRemind() {
	KidnapLeagueTrainer.CurrentDialog = DialogFind(KidnapLeagueTrainer, "Bounty" + KidnapLeagueBountyLocation).replace("BOUNTYNAME", KidnapLeagueBounty.Name).replace("BOUNTYAMOUNT", (15 + KidnapLeagueBountyDifficulty * 2).toString());
}

/**
 * Starts the bounty hunter mission in the kidnap league screen.
 * @returns {void} - Nothing
 */
function KidnapLeagueBountyStart() {
	CommonSetScreen("Room", "KidnapLeague");
	KidnapLeagueBackground = KidnapLeagueBountyLocation;
	KidnapLeagueBounty.Stage = "50";
	CharacterSetCurrent(KidnapLeagueBounty);
	KidnapLeagueBounty.CurrentDialog = DialogFind(KidnapLeagueBounty, "Bounty" + KidnapLeagueBountyLocation);
}

/**
 * Starts the bounty hunter fight with its settings.
 * @returns {void} - Nothing
 */
function KidnapLeagueBountyFightStart() {
	KidnapStart(KidnapLeagueBounty, KidnapLeagueBountyLocation + "Dark", KidnapLeagueBountyDifficulty, "KidnapLeagueBountyFightEnd()");
}

/**
 * Ends the bounty hunter fight and goes back to the kidnap league screen.
 * @returns {void} - Nothing
 */
function KidnapLeagueBountyFightEnd() {
	KidnapLeagueRandomActivityCount = 0;
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (KidnapLeagueBounty.KidnapMaxWillpower - KidnapLeagueBounty.KidnapWillpower)) * 2);
	KidnapLeagueBounty.AllowItem = KidnapVictory;
	KidnapLeagueBountyVictory = KidnapVictory;
	KidnapLeagueBounty.Stage = (KidnapVictory) ? "101" : "201";
	KidnapLeagueRandomKidnapper = KidnapLeagueBounty;
	if (!KidnapVictory) CharacterRelease(KidnapLeagueBounty);
	CommonSetScreen("Room", "KidnapLeague");	
	KidnapLeagueBackground = KidnapLeagueBountyLocation;
	CharacterSetCurrent(KidnapLeagueBounty);
	KidnapLeagueBounty.CurrentDialog = DialogFind(KidnapLeagueBounty, (KidnapVictory) ? "BountyVictory" : "BountyDefeat");
	KidnapLeagueWillPayForFreedom = false;
}

/**
 * Triggered when the player pays for a kidnap league bounty.
 * @returns {void} - Nothing
 */
function KidnapLeagueBountyPay() {
	KidnapLeagueTrainer.CurrentDialog = DialogFind(KidnapLeagueTrainer, "BountyPay").replace("BOUNTYAMOUNT", (15 + KidnapLeagueBountyDifficulty * 2).toString());
	CharacterChangeMoney(Player, 15 + KidnapLeagueBountyDifficulty * 2);
	KidnapLeagueBountyReset();
}

/**
 * Resets the current kidnap league bounty so another one can be taken. The harder the battle, the more reputation the player gains.
 * @returns {void} - Nothing
 */
function KidnapLeagueBountyReset() {
	ReputationProgress("Kidnap", KidnapLeagueBountyVictory ? 2 + Math.floor(KidnapLeagueBountyDifficulty / 2) : 1);
	KidnapLeagueBounty = null;
	KidnapLeagueBountyVictory = null;
}

/**
 * Starts a kidnap game with the player against the trainer. An easy fight will lower the player dominant reputation.
 * @param {number} Difficulty - Difficulty ratio of the encounter
 * @returns {void} - Nothing
 */
function KidnapLeagueStartKidnap(Difficulty) {
	if (Difficulty < 0) ReputationProgress("Dominant", -2);
	KidnapStart(KidnapLeagueTrainer, "KidnapLeagueDark", Difficulty, "KidnapLeagueEndKidnap()");
}

/**
 * Ends a kidnap match ends. Send the player to the kidnap league screen and sets the right trainer dialog.
 * @returns {void} - Nothing
 */
function KidnapLeagueEndKidnap() {
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (KidnapLeagueTrainer.KidnapMaxWillpower - KidnapLeagueTrainer.KidnapWillpower)));
	KidnapLeagueTrainer.AllowItem = KidnapVictory;
	KidnapLeagueTrainer.Stage = (KidnapVictory) ? "100" : "200";
	if (!KidnapVictory) CharacterRelease(KidnapLeagueTrainer);
	CommonSetScreen("Room", "KidnapLeague");
	CharacterSetCurrent(KidnapLeagueTrainer);
	KidnapLeagueTrainer.CurrentDialog = DialogFind(KidnapLeagueTrainer, (KidnapVictory) ? "KidnapVictory" : "KidnapDefeat");
}

/**
 * Resets the player and teacher for another kidnapping by releasing them and dressing them up.
 * @returns {void} - Nothing
 */
function KidnapLeagueResetTrainer() {
	KidnapLeagueTrainer.AllowItem = false;
	CharacterRelease(Player);
	CharacterRelease(KidnapLeagueTrainer);
	if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null)) {
		InventoryWear(Player, KidnapPlayerCloth.Asset.Name, "Cloth", KidnapPlayerCloth.Color);		
		if (KidnapPlayerClothAccessory != null) InventoryWear(Player, KidnapPlayerClothAccessory.Asset.Name, "ClothAccessory", KidnapPlayerClothAccessory.Color);
		if (KidnapPlayerClothLower != null) InventoryWear(Player, KidnapPlayerClothLower.Asset.Name, "ClothLower", KidnapPlayerClothLower.Color);
	}
	if ((InventoryGet(KidnapLeagueTrainer, "Cloth") == null) && (KidnapOpponentCloth != null)) {
		InventoryWear(KidnapLeagueTrainer, KidnapOpponentCloth.Asset.Name, "Cloth", KidnapOpponentCloth.Color);
		if (KidnapOpponentClothAccessory != null) InventoryWear(KidnapLeagueTrainer, KidnapOpponentClothAccessory.Asset.Name, "ClothAccessory", KidnapOpponentClothAccessory.Color);
		if (KidnapOpponentClothLower != null) InventoryWear(KidnapLeagueTrainer, KidnapOpponentClothLower.Asset.Name, "ClothLower", KidnapOpponentClothLower.Color);
	}
}

/**
 * Triggered at the start of a match, sets a random intro sequence.
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomIntro() {
	
	// Sets the kidnapping scene
	CommonSetScreen("Room", "KidnapLeague");
	KidnapLeagueBackground = "MainHall";
	KidnapLeagueRandomKidnapper = null;
	CharacterDelete("NPC_KidnapLeague_RandomKidnapper");	
	KidnapLeagueRandomKidnapper = CharacterLoadNPC("NPC_KidnapLeague_RandomKidnapper");	
	CharacterSetCurrent(KidnapLeagueRandomKidnapper);
	
	// A Mistress can pop if the player is a master kidnapper
	if ((ReputationGet("Kidnap") >= 100) && (Math.floor(Math.random() * 10) == 0)) {
		CharacterArchetypeClothes(KidnapLeagueRandomKidnapper, "Mistress");
		KidnapLeagueRandomKidnapperScenario = "6";
		KidnapLeagueRandomKidnapperDifficulty = 10;
		KidnapLeagueArchetype = "Mistress";
	} else {
		KidnapLeagueRandomKidnapperScenario = (Math.floor(Math.random() * 6)).toString();
		KidnapLeagueRandomKidnapperDifficulty = Math.floor(Math.random() * 6);
		KidnapLeagueArchetype = "";
	}
	
	// If the player is already tied up, we skip the fight
	if (Player.CanInteract()) {
		KidnapLeagueRandomKidnapper.Stage = KidnapLeagueRandomKidnapperScenario.toString();
		KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, "Intro" + KidnapLeagueRandomKidnapperScenario);
	} else {
		KidnapLeagueRandomKidnapper.Stage = "202";
		KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, "Automatic" + KidnapLeagueRandomKidnapperScenario);
	}
}

/**
 * Triggered at the end of a match, sets a random outro sequence.
 * @param {boolean} Surrender - Whether or not the player surrendered.
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomOutro(Surrender) {
	KidnapLeagueRandomActivityCount = 0;
	CommonSetScreen("Room", "KidnapLeague");	
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (KidnapLeagueRandomKidnapper.KidnapMaxWillpower - KidnapLeagueRandomKidnapper.KidnapWillpower)) * 2);
	KidnapLeagueBackground = "MainHall";
	if ((Surrender == null) || (Surrender == false)) ReputationProgress("Kidnap", KidnapVictory ? 4 : 2);
	KidnapLeagueRandomKidnapper.AllowItem = KidnapVictory;
	KidnapLeagueRandomKidnapper.Stage = (KidnapVictory) ? "100" : "200";	
	KidnapLeagueWillPayForFreedom = (Math.random() >= 0.5);
	if (!KidnapVictory) CharacterRelease(KidnapLeagueRandomKidnapper);
	CharacterSetCurrent(KidnapLeagueRandomKidnapper);
	if ((Surrender != null) && (Surrender == true)) {
		KidnapLeagueRandomKidnapper.Stage = "205";
		InventoryWearRandom(Player, "ItemArms", KidnapLeagueRandomKidnapperDifficulty);
		KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, "Surrender" + KidnapLeagueRandomKidnapperScenario);
	} else KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, ((KidnapVictory) ? "Victory" : "Defeat") + KidnapLeagueRandomKidnapperScenario);
}

/**
 * Triggered when a random kidnap match starts. We start the kidnap minigame with the appropriate settings.
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomStart() {
	KidnapStart(KidnapLeagueRandomKidnapper, "MainHallDark", KidnapLeagueRandomKidnapperDifficulty, "KidnapLeagueRandomOutro()");
}

/**
 * Triggered when a the player successfully bribes her way out of a fight
 * @param {number} Amount - Amount paid (positive number)
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomBribe(Amount) {
	CharacterChangeMoney(Player, Amount * -1);
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

/**
 * Triggered when the player surrenders during a kidnap match, the match ends early.
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomSurrender() {
	KidnapVictory = false;
	KidnapLeagueRandomOutro(true);
}

/**
 * Triggered at the end of a kidnap match. Player is sent to the main hall, dressed back and is unable to do another match for 3 minutes.
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomEnd() {
	if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null)) {
		InventoryWear(Player, KidnapPlayerCloth.Asset.Name, "Cloth", KidnapPlayerCloth.Color);		
		if (KidnapPlayerClothAccessory != null) InventoryWear(Player, KidnapPlayerClothAccessory.Asset.Name, "ClothAccessory", KidnapPlayerClothAccessory.Color);
		if (KidnapPlayerClothLower != null) InventoryWear(Player, KidnapPlayerClothLower.Asset.Name, "ClothLower", KidnapPlayerClothLower.Color);
	}
	if ((InventoryGet(KidnapLeagueRandomKidnapper, "Cloth") == null) && (KidnapOpponentCloth != null)) {
		InventoryWear(KidnapLeagueRandomKidnapper, KidnapOpponentCloth.Asset.Name, "Cloth", KidnapOpponentCloth.Color);
		if (KidnapOpponentClothAccessory != null) InventoryWear(KidnapLeagueRandomKidnapper, KidnapOpponentClothAccessory.Asset.Name, "ClothAccessory", KidnapOpponentClothAccessory.Color);
		if (KidnapOpponentClothLower != null) InventoryWear(KidnapLeagueRandomKidnapper, KidnapOpponentClothLower.Asset.Name, "ClothLower", KidnapOpponentClothLower.Color);
	}
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

/**
 * Triggered when we need to show the amount of money the NPC offers to get out.
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomMoneyAmount() {
	KidnapLeagueRandomKidnapper.CurrentDialog = KidnapLeagueRandomKidnapper.CurrentDialog.replace("DIALOGMONEY", (10 + KidnapLeagueRandomKidnapperDifficulty * 2).toString());
}

/**
 * Triggered when accepts the NPC's offer to pay for freedom, we lower the kidnap reputation.
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomEndMoney() {
	CharacterChangeMoney(Player, 10 + KidnapLeagueRandomKidnapperDifficulty * 2);
	ReputationProgress("Kidnap", -2);
	KidnapLeagueRandomEnd();
}

/**
 * When a random activity starts, set the related NPC dialog and stage
 * @param {string} A - Name of the activity to perform.
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomActivityStart(A) {
	KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, "Activity" + A + "Intro");
	KidnapLeagueRandomKidnapper.Stage = "Activity" + A;
}

/**
 * Triggered when the kidnapper does a random activity on the player.
 * @returns {void} - Nothing
 */
function KidnapLeagueRandomActivityLaunch() {
	
	// After 4 activities, there's more and more chances that the player will be released
	KidnapLeagueRandomActivityCount++;
	if (Math.random() * KidnapLeagueRandomActivityCount >= 4) {
		KidnapLeagueRandomActivityCount = 0;
		if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null)) {
			InventoryWear(Player, KidnapPlayerCloth.Asset.Name, "Cloth", KidnapPlayerCloth.Color);		
			if (KidnapPlayerClothAccessory != null) InventoryWear(Player, KidnapPlayerClothAccessory.Asset.Name, "ClothAccessory", KidnapPlayerClothAccessory.Color);
			if (KidnapPlayerClothLower != null) InventoryWear(Player, KidnapPlayerClothLower.Asset.Name, "ClothLower", KidnapPlayerClothLower.Color);
		}
		if ((!InventoryCharacterHasOwnerOnlyRestraint(Player)) && (!InventoryCharacterHasLoverOnlyRestraint(Player))){
			CharacterRelease(Player);		
			KidnapLeagueRandomActivityStart("End");
			KidnapLeagueVisitRoom = ((Math.random() >= 0.5) && KidnapLeagueCanTransferToRoom());
		} else KidnapLeagueRandomActivityStart("EndNoRelease");
		return;
	}

	// Finds an activity to do on the player
	while (true) {
		
		// Picks an activity at random
		KidnapLeagueRandomActivity = CommonRandomItemFromList(KidnapLeagueRandomActivity, KidnapLeagueRandomActivityList);
				
		// Add or remove an item
		if ((KidnapLeagueRandomActivity == "AddGag") && (InventoryGet(Player, "ItemMouth") == null)) { InventoryWearRandom(Player, "ItemMouth", KidnapLeagueRandomKidnapperDifficulty); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "RemoveGag") && (InventoryGet(Player, "ItemMouth") != null) && !InventoryOwnerOnlyItem(InventoryGet(Player, "ItemMouth"))) { InventoryRemove(Player, "ItemMouth"); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "AddFeet") && (InventoryGet(Player, "ItemFeet") == null) && !Player.IsKneeling()) { InventoryWearRandom(Player, "ItemFeet", KidnapLeagueRandomKidnapperDifficulty); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "RemoveFeet") && (InventoryGet(Player, "ItemFeet") != null) && !InventoryOwnerOnlyItem(InventoryGet(Player, "ItemFeet"))) { InventoryRemove(Player, "ItemFeet"); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "AddLegs") && (InventoryGet(Player, "ItemLegs") == null) && !Player.IsKneeling()) { InventoryWearRandom(Player, "ItemLegs", KidnapLeagueRandomKidnapperDifficulty); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "RemoveLegs") && (InventoryGet(Player, "ItemLegs") != null) && !InventoryOwnerOnlyItem(InventoryGet(Player, "ItemLegs"))) { InventoryRemove(Player, "ItemLegs"); KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		
		// Physical activities
		if ((KidnapLeagueRandomActivity == "Kiss") && (InventoryGet(Player, "ItemMouth") == null)) { KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		if ((KidnapLeagueRandomActivity == "Spank") || (KidnapLeagueRandomActivity == "Fondle") || (KidnapLeagueRandomActivity == "Tickle")) { KidnapLeagueRandomActivityStart(KidnapLeagueRandomActivity); return; }
		
	}
}

/**
 * Triggered when the player transfers the kidnapper to her room, they are sent to the private room.
 * @returns {void} - Nothing
 */
function KidnapLeagueTransferToRoom() {
	KidnapLeagueRandomEnd();
	CharacterRelease(Player);
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(KidnapLeagueRandomKidnapper, KidnapLeagueArchetype);
}