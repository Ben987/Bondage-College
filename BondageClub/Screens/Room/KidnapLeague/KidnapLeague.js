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

// Returns TRUE if the dialog option are available
function KidnapLeagueAllowKidnap() { return (!Player.IsRestrained() && !KidnapLeagueTrainer.IsRestrained()) }
function KidnapLeagueIsTrainerRestrained() { return KidnapLeagueTrainer.IsRestrained() }
function KidnapLeagueCanTakeBounty() { return ((ReputationGet("Kidnap") > 0) && (KidnapLeagueBounty == null)) }
function KidnapLeagueBountyTaken() { return ((ReputationGet("Kidnap") > 0) && (KidnapLeagueBounty != null) && (KidnapLeagueBountyVictory == null)) }
function KidnapLeagueBountyWasVictory() { return ((ReputationGet("Kidnap") > 0) && (KidnapLeagueBounty != null) && (KidnapLeagueBountyVictory == true)) }
function KidnapLeagueBountyWasDefeat() { return ((ReputationGet("Kidnap") > 0) && (KidnapLeagueBounty != null) && (KidnapLeagueBountyVictory == false)) }
function KidnapLeagueCanTransferToRoom() { return (LogQuery("RentRoom", "PrivateRoom") && (PrivateCharacter.length < PrivateCharacterMax) && !LogQuery("LockOutOfPrivateRoom", "Rule")) }
function KidnapLeagueWontVisitRoom() { return (!KidnapLeagueVisitRoom && KidnapLeagueCanTransferToRoom()) }
function KidnapLeagueCanKiss() { return (Player.CanTalk() && CurrentCharacter.CanTalk()) }

// Loads the kidnap league NPC
function KidnapLeagueLoad() {
	KidnapLeagueBackground = "KidnapLeague";
	KidnapLeagueTrainer = CharacterLoadNPC("NPC_KidnapLeague_Trainer");
	KidnapLeagueTrainer.AllowItem = ((KidnapLeagueTrainer.Stage == "100") || (KidnapLeagueTrainer.Stage == "110"));
}

// Run the kidnap league (The screen can be used for the search daily job)
function KidnapLeagueRun() {
	if (!DailyJobSubSearchIsActive()) DrawCharacter(Player, 500, 0, 1);
	if (!DailyJobSubSearchIsActive()) DrawCharacter(KidnapLeagueTrainer, 1000, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	DailyJobSubSearchRun();
}

// When the user clicks in the kidnap league room
function KidnapLeagueClick() {
	if (!DailyJobSubSearchIsActive() && (MouseX >= 500) && (MouseX < 1000) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if (!DailyJobSubSearchIsActive() && (MouseX >= 1000) && (MouseX < 1500) && (MouseY >= 0) && (MouseY < 1000)) {
		ManagementClubSlaveDialog(KidnapLeagueTrainer);
		CharacterSetCurrent(KidnapLeagueTrainer);
	}
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) {
		if ((InventoryGet(Player, "Cloth") == null) && (KidnapPlayerCloth != null)) {
			InventoryWear(Player, KidnapPlayerCloth.Asset.Name, "Cloth", KidnapPlayerCloth.Color);
			if (KidnapPlayerClothAccessory != null) InventoryWear(Player, KidnapPlayerClothAccessory.Asset.Name, "ClothAccessory", KidnapPlayerClothAccessory.Color);
			if (KidnapPlayerClothLower != null) InventoryWear(Player, KidnapPlayerClothLower.Asset.Name, "ClothLower", KidnapPlayerClothLower.Color);
		}
		CommonSetScreen("Room", "MainHall");
	}
	DailyJobSubSearchClick();
}

// When the player starts a kidnap game against the trainer (an easy fight will lower the player dominant reputation)
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

// Reminds the player on the bounty taken
function KidnapLeagueBountyRemind() {
	KidnapLeagueTrainer.CurrentDialog = DialogFind(KidnapLeagueTrainer, "Bounty" + KidnapLeagueBountyLocation).replace("BOUNTYNAME", KidnapLeagueBounty.Name).replace("BOUNTYAMOUNT", (15 + KidnapLeagueBountyDifficulty * 2).toString());
}

// Starts the bounty hunter mission
function KidnapLeagueBountyStart() {
	CommonSetScreen("Room", "KidnapLeague");
	KidnapLeagueBackground = KidnapLeagueBountyLocation;
	KidnapLeagueBounty.Stage = "50";
	CharacterSetCurrent(KidnapLeagueBounty);
	KidnapLeagueBounty.CurrentDialog = DialogFind(KidnapLeagueBounty, "Bounty" + KidnapLeagueBountyLocation);
}

// Starts the bounty hunter fight
function KidnapLeagueBountyFightStart() {
	KidnapStart(KidnapLeagueBounty, KidnapLeagueBountyLocation + "Dark", KidnapLeagueBountyDifficulty, "KidnapLeagueBountyFightEnd()");
}

// Ends the bounty hunter fight
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

// Pays the player bounty
function KidnapLeagueBountyPay() {
	KidnapLeagueTrainer.CurrentDialog = DialogFind(KidnapLeagueTrainer, "BountyPay").replace("BOUNTYAMOUNT", (15 + KidnapLeagueBountyDifficulty * 2).toString());
	CharacterChangeMoney(Player, 15 + KidnapLeagueBountyDifficulty * 2);
	KidnapLeagueBountyReset();
}

// Resets the bounty so another one can be taken
function KidnapLeagueBountyReset() {
	ReputationProgress("Kidnap", KidnapLeagueBountyVictory ? 2 + Math.floor(KidnapLeagueBountyDifficulty / 2) : 1);
	KidnapLeagueBounty = null;
	KidnapLeagueBountyVictory = null;
}

// When the player starts a kidnap game against the trainer (an easy fight will lower the player dominant reputation)
function KidnapLeagueStartKidnap(Difficulty) {
	if (Difficulty < 0) ReputationProgress("Dominant", -2);
	KidnapStart(KidnapLeagueTrainer, "KidnapLeagueDark", Difficulty, "KidnapLeagueEndKidnap()");
}

// When the kidnap match ends
function KidnapLeagueEndKidnap() {
	SkillProgress("Willpower", ((Player.KidnapMaxWillpower - Player.KidnapWillpower) + (KidnapLeagueTrainer.KidnapMaxWillpower - KidnapLeagueTrainer.KidnapWillpower)));
	KidnapLeagueTrainer.AllowItem = KidnapVictory;
	KidnapLeagueTrainer.Stage = (KidnapVictory) ? "100" : "200";
	if (!KidnapVictory) CharacterRelease(KidnapLeagueTrainer);
	CommonSetScreen("Room", "KidnapLeague");
	CharacterSetCurrent(KidnapLeagueTrainer);
	KidnapLeagueTrainer.CurrentDialog = DialogFind(KidnapLeagueTrainer, (KidnapVictory) ? "KidnapVictory" : "KidnapDefeat");
}

// Resets the player and teacher for another kidnapping
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

// When the player gets in a random kidnap match
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

// When a random kidnap match ends
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

// When a random kidnap match starts
function KidnapLeagueRandomStart() {
	KidnapStart(KidnapLeagueRandomKidnapper, "MainHallDark", KidnapLeagueRandomKidnapperDifficulty, "KidnapLeagueRandomOutro()");
}

// When a the player bribes her way out of a fight
function KidnapLeagueRandomBribe(Amount) {
	CharacterChangeMoney(Player, Amount * -1);
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

// When a random kidnap match is surrendered
function KidnapLeagueRandomSurrender() {
	KidnapVictory = false;
	KidnapLeagueRandomOutro(true);
}

// When a random kidnap match event ends, we dress the player back and no more kidnappings for 3 minutes
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

// When we need to show the amount of money offered to get out
function KidnapLeagueRandomMoneyAmount() {
	KidnapLeagueRandomKidnapper.CurrentDialog = KidnapLeagueRandomKidnapper.CurrentDialog.replace("DIALOGMONEY", (10 + KidnapLeagueRandomKidnapperDifficulty * 2).toString());
}

// When we need to show the amount of money offered to get out
function KidnapLeagueRandomEndMoney() {
	CharacterChangeMoney(Player, 10 + KidnapLeagueRandomKidnapperDifficulty * 2);
	ReputationProgress("Kidnap", -2);
	KidnapLeagueRandomEnd();
}

// When a random activity starts
function KidnapLeagueRandomActivityStart(A) {
	KidnapLeagueRandomKidnapper.CurrentDialog = DialogFind(KidnapLeagueRandomKidnapper, "Activity" + A + "Intro");
	KidnapLeagueRandomKidnapper.Stage = "Activity" + A;
}

// When there's a random activity to do on the player from the kidnapper
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

// When the player transfers the kidnapper to her room 
function KidnapLeagueTransferToRoom() {
	KidnapLeagueRandomEnd();
	CharacterRelease(Player);
	CommonSetScreen("Room", "Private");
	PrivateAddCharacter(KidnapLeagueRandomKidnapper, KidnapLeagueArchetype);
}