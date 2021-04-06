"use strict";

var GamblingBackground = "Gambling";
var GamblingFirstSub = null;
var GamblingSecondSub = null;
var GamblingPlayerDice = null;
var GamblingPolice = null;
var GamblingNpcDice = null;
var GamblingPlayerDiceStack = [];
var GamblingNpcDiceStack = [];
var GamblingPlayerSubState = 0;
var GamblingNpcSubState = 0;	//Game-State of NPC
var GamblingPlayerIsFox = true;	//Player is Fox by Fox and Hunter
var GamblingMoneyBet = 0;	//Money Bet in Current Game
var GamblingShowDiceSum = true; //Show Summ of Dice Dots in DiceStack
var GamblingShowMoney = false;	//Show Money in DiceStack
var GamblingAppearanceFirst = null;
var GamblingAppearanceSecond = null;
var GamblingAppearancePlayer = null;
var GamblingIllegalChange = false; // Sub Player lost Cloth although forbidden by Mistress
var GamblingToothpickCount = 0; // available Toothpicks

// Returns TRUE if the player has maids disabled
/**
 * Checks if the player is helpless (maids disabled) or not.
 * @returns {boolean} - Returns true if the player still has time remaining after asking the maids to stop helping in the maid quarters
 */
function GamblingIsMaidsDisabled() {  var expire = LogValue("MaidsDisabled", "Maid") - CurrentTime ; return (expire > 0)  }


// Returns TRUE if a dialog is permitted
/**
 * Checks if any of the subs in the gambling hall are currentyl restrained
 * @returns {boolean} - Returns true, if any of the two subs is restrained, false otherwise
 */
function GamblingIsSubsRestrained() { return (GamblingFirstSub.IsRestrained() || !GamblingFirstSub.CanTalk() || GamblingSecondSub.IsRestrained() || !GamblingSecondSub.CanTalk());}
/**
 * Checks, wether the left sub is restrained
 * @returns {boolean} - Returns true, if the left sub is restrained, false otherwise
 */
function GamblingFirstSubRestrained() {return (GamblingFirstSub.IsRestrained());}
/**
 * Checks, wether the left sub can offer games to the player
 * @returns {boolean} - Returns true, if neither the left sub nor the player are restrained, false otherwise
 */
function GamblingFirstCanPlay() {return (!Player.IsRestrained() && Player.CanTalk() && !GamblingFirstSub.IsRestrained() && GamblingFirstSub.CanTalk());}
/**
 * Checks, wether the right sub is restrained
 * @returns {boolean} - Returns true, if the right sub is restrained, false otherwise
 */
function GamblingSecondSubRestrained() {return (GamblingSecondSub.IsRestrained());}
/**
* Checks, wether the right sub can offer games to the player
 * @returns {boolean} - Returns true, if neither the right sub nor the player are restrained, false otherwise
  */
function GamblingSecondCanPlay() {return (!Player.IsRestrained() && Player.CanTalk() && !GamblingSecondSub.IsRestrained() && GamblingSecondSub.CanTalk());}
/**
 * Checks, if the simple dice game can be offered
 * @returns {boolean} - Returns true, if the left sub can offer games, false otherwise
 */
function GamblingCanPlaySimpleDice() {return GamblingFirstCanPlay()}
/**
 * Checks, if the game of 21 can be offered
 * @returns {boolean} - Returns true, if the left sub can offer games 
 * and the player's reputation is higer than 10, false otherwise
 */
function GamblingCanPlayTwentyOne() {return (GamblingFirstCanPlay() && ReputationGet("Gambling") >= 10);}
/**
 * Checks, if the toothpick game can be offered
 * @returns {boolean} - Returns true, if the left sub can offer games 
 * and the player's reputation is higer than 20, false otherwise
 */
function GamblingCanPlayToothpick() {return (GamblingFirstCanPlay() && ReputationGet("Gambling") >= 20);}
/**
 * Checks, if the game 'Catch the fox' can be offered
 * @returns {boolean} - Returns true, if the right sub can offer games, the player's reputation is higer than 30 
 * and she has enough money, false otherwise
 */
function GamblingCanPlayFox() {return (GamblingSecondCanPlay() && (ReputationGet("Gambling") >= 30) && (Player.Money >= 10));}
/**
 * Checks, if the game 'Street to Roissy' can be offered
 * @returns {boolean} - Returns true, if the right sub can offer games, the player's reputation is higer than 40 
 * and she has enough money, false otherwise
 */
function GamblingCanPlayStreetRoissy() {return (GamblingSecondCanPlay() && (ReputationGet("Gambling") >= 40) && (Player.Money >= 30));}
/**
 * Checks, if the game 'Dare Six' can be offered
 * @returns {boolean} - Returns true, if the right sub can offer games, the player's reputation is higer than 50 
 * and she has enough money, false otherwise
 */
function GamblingCanPlayDaredSix() {return (GamblingSecondCanPlay() && (ReputationGet("Gambling") >= 50) && (Player.Money >= 50));}

/**
 * Checks, if the player can take one toothpick
 * @returns {boolean} - Returns true, if there is more than one pick left, false otherwise
 */
function GamblingToothpickCanPickOne() {return GamblingToothpickCount >= 1}
/**
 * Checks, if the player can take two toothpicks
 * @returns {boolean} - Returns true, if there are more than two picks left, false otherwise
 */
function GamblingToothpickCanPickTwo() {return GamblingToothpickCount >= 2}
/**
 * Checks, if the player can take three toothpicks
 * @returns {boolean} - Returns true, if there are more than three picks left, false otherwise
 */
function GamblingToothpickCanPickThree() {return GamblingToothpickCount >= 3}

/**
 * Checks, if the player is restrained with a locked item
 * @returns {boolean} - Returns true if a restraint is locked on the player, false otherwise
 */
function GamblingIsRestrainedWithLock() { return InventoryCharacterHasLockedRestraint(Player) }
/**
 * Checks, wether the player is restrained but no lock is used
 * @returns {boolean} - Returns true, if the player is restarined, but no lock was used, false otherwise
 */
function GamblingIsRestrainedWithoutLock() { return (Player.IsRestrained() && !InventoryCharacterHasLockedRestraint(Player)) }

/**
 * Checks, if the player owns enough money to pay for her release
 * @returns {boolean} - Returns true, if the player is not restrained with a lock and owns at least $25, false otherwise
 */
function GamblingCanPayToRelease() { return ((Player.Money >= 25) && !InventoryCharacterHasLockedRestraint(Player)) }
/**
 * Checks, if the player is too poor to pay for her release
 * @returns {boolean} - Returns true, if the player is not restrained with a lock and owns less than $25, false otherwise
 */
function GamblingCannotPayToRelease() { return ((Player.Money < 25) && !InventoryCharacterHasLockedRestraint(Player)) }
/**
 * Checks, if the player can steal the dice
 * @returns {boolean} - Returns true, if the player is able to steal the dice, false otherwise
 */
function GamblingCanStealDice() {return (LogQuery("Joined", "BadGirl") && !(LogQuery("Stolen", "BadGirl") || LogQuery("Hide", "BadGirl"))) }

/**
 * Loads the Gambling Hall and creates the two subs. If the player is on a rescue mission, the restraints are created.
 * This function is called dynamically.
 * @returns {void} - Nothing
 */
function GamblingLoad() {
	
	// Default load
	if (GamblingFirstSub == null) {
		GamblingFirstSub =  CharacterLoadNPC("NPC_Gambling_FirstSub");
		GamblingSecondSub = CharacterLoadNPC("NPC_Gambling_SecondSub");
		GamblingFirstSub.AllowItem = false;
		GamblingSecondSub.AllowItem = false;
		GamblingAppearanceFirst = GamblingFirstSub.Appearance.slice();
		GamblingAppearanceSecond = GamblingSecondSub.Appearance.slice();
	}
	
	GamblingAppearancePlayer = Player.Appearance.slice();
	GamblingIllegalChange = false;
	
	// Rescue mission load
	if ((MaidQuartersCurrentRescue == "Gambling") && !MaidQuartersCurrentRescueStarted) {
		MaidQuartersCurrentRescueStarted = true;
		CharacterNaked(GamblingFirstSub);
		InventoryWearRandom(GamblingFirstSub, "ItemLegs"); 
		InventoryWearRandom(GamblingFirstSub, "ItemFeet"); 
		InventoryWearRandom(GamblingFirstSub, "ItemArms"); 
		InventoryWearRandom(GamblingFirstSub, "ItemMouth"); 
		InventoryWear(GamblingFirstSub, "LeatherBlindfold", "ItemHead");
		GamblingFirstSub.AllowItem = true;
		GamblingFirstSub.Stage = "MaidRescue";
		CharacterNaked(GamblingSecondSub);
		InventoryWearRandom(GamblingSecondSub, "ItemLegs"); 
		InventoryWearRandom(GamblingSecondSub, "ItemFeet"); 
		InventoryWearRandom(GamblingSecondSub, "ItemArms"); 
		InventoryWearRandom(GamblingSecondSub, "ItemMouth"); 
		InventoryWear(GamblingSecondSub, "LeatherBlindfold", "ItemHead");
		GamblingSecondSub.AllowItem = true;
		GamblingSecondSub.Stage = "MaidRescue";
	}
}

/**
 * Run the Gambling Hall, draw all characters. This function is called dynamically at very short intervals. 
 * Don't use expensive loops or call expensive functions from here
 * @returns {void} - Nothing
 */
function GamblingRun() {
	DrawCharacter(GamblingFirstSub, 250, 0, 1);
	DrawCharacter(Player, 750, 0, 1);
	if ((ReputationGet("Gambling") > 20) || MaidQuartersCurrentRescue == "Gambling") DrawCharacter(GamblingSecondSub, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanInteract()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/DressReset.png"); //Only Dess Back after loose Game
	//BadGirlsClub
	if (GamblingCanStealDice()) DrawButton(1885, 385, 90, 90, "", "White", "Icons/DiceTheft.png", TextGet("DiceTheft"));
}

// When the user clicks in the Gambling Hall
/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function GamblingClick() {
	if (MouseIn(250, 0, 500, 1000)) CharacterSetCurrent(GamblingFirstSub);
	if (MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1250, 0, 500, 1000) && ((ReputationGet("Gambling") > 20) || (MaidQuartersCurrentRescue == "Gambling"))) CharacterSetCurrent(GamblingSecondSub);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if (MouseIn(1885, 265, 90, 90)) GamblingDressBackPlayer();
	if (MouseIn(1885, 385, 90, 90) && GamblingCanStealDice()) GamblingStealDice();
}

/**
 * Paint the stack of dice, the sum of ponits and player's money
 * @returns {true} - Always true
 */
function GamblingShowDiceStack() {
	var j = 0;
	for (let i = GamblingPlayerDiceStack.length; i > 0 ; i--) {
		DrawImageResize("Screens/Room/Gambling/dice_" + GamblingPlayerDiceStack[i - 1] + ".png", 25, (25 + j * 60), 60, 60);
		j++;
	}
	if (GamblingShowDiceSum) DrawText(GamblingDiceStackSum(GamblingPlayerDiceStack), 125, 55, "white", "black");
	if (GamblingShowMoney) DrawText(Player.Money.toString() + " $", 175, 125, "white", "black");
	j = 0;
	for (let i = GamblingNpcDiceStack.length; i > 0 ; i--) {
		DrawImageResize("Screens/Room/Gambling/dice_" + GamblingNpcDiceStack[i - 1] + ".png", 525, (25 + j * 60), 60, 60);
		j++;
		}
	if (GamblingShowDiceSum) DrawText(GamblingDiceStackSum(GamblingNpcDiceStack), 625, 55, "white", "black");
	return true;
}

/**
 * Paint the dice for the NPC
 * @returns {true} - Always true
 */
function GamblingShowNpcDice() {
	DrawImageResize("Screens/Room/Gambling/dice_" + GamblingNpcDice + ".png", 525, 25, 60, 60);
	return true;
}

/**
 * Calculates the sum of dice in a given dice stack
 * @param {number[]} DiceStack - The dice stack to sum up
 * @returns {number} - The sum of points in the stack
 */
function GamblingDiceStackSum(DiceStack) {
	var GamblingDiceStackSum = 0;
	for (let i = 0; i < DiceStack.length ; i++) {
		GamblingDiceStackSum = GamblingDiceStackSum + DiceStack[i];
	}
	return GamblingDiceStackSum;
}

/**
 * Controller for the Simple Dice Game
 * @param {"new" | "win" | "lost" | equal} SimpleDiceState - The current game state
 * @returns {void} - Nothing
 */
function GamblingSimpleDiceController(SimpleDiceState) {
	if (SimpleDiceState == "new") {
		GamblingPlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
		GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice;
		GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
		GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
		if (GamblingPlayerDice > GamblingNpcDice) {
			GamblingFirstSub.AllowItem = true;
			GamblingFirstSub.Stage = 81;
			}
		if (GamblingPlayerDice < GamblingNpcDice) {
			GamblingFirstSub.AllowItem = false;
			GamblingFirstSub.Stage = 82;
			}
		if (GamblingPlayerDice == GamblingNpcDice) { 
			GamblingFirstSub.AllowItem = false;
			GamblingFirstSub.Stage = 83;
			}
	} else if (SimpleDiceState == "win") {
			GamblingFirstSub.Stage = 0;
			ReputationProgress("Gambling", 1);
	} else if (SimpleDiceState == "lost") {
			InventoryWearRandom(Player, "ItemArms");
			GamblingFirstSub.Stage = 0;
	} else if (SimpleDiceState == "equal") {
			InventoryRemove(Player, "ItemArms");
			InventoryRemove(GamblingFirstSub, "ItemArms");
			GamblingFirstSub.Stage = 0;
	}
}

/**
 * Draws the Toothpicks
 * @returns {true} - Always true
 */
function GamblingShowToothpickStack () {
	for (let i = 0; i < GamblingToothpickCount; i++) {
		DrawImageResize("Screens/Room/Gambling/toothpick.png", 410, 45 + 26 * i, 160, 7);
	}
	DrawText(GamblingToothpickCount, 490, 25, "white", "black")
	return true;
}

/**
 * Controller for the Toothpick game
 * @param {"new" | "give_up" | "win" | "lost" | string} ToothpickState - The current state of the game
 * @returns {void} - Nothing
 */
function GamblingToothpickController (ToothpickState) {
	if (ToothpickState == "new") {
		GamblingToothpickCount = 15;
		GamblingFirstSub.Stage = 200
	}

	else if (ToothpickState == "give_up") {
		GamblingFirstSub.Stage = 203;
	}
	
	else if (ToothpickState == "win") {
		ReputationProgress("Gambling", 1);
		GamblingFirstSub.AllowItem = true;
	}
	
	else if (ToothpickState == "lost") {
		var difficulty = Math.floor(Math.random() * 5) + 2
		InventoryWearRandom(Player, "ItemArms", difficulty);
		InventoryWearRandom(Player, "ItemMouth", difficulty); 
		InventoryWearRandom(Player, "ItemLegs", difficulty); 
		InventoryWearRandom(Player, "ItemFeet", difficulty); 
	}

	else {
		GamblingToothpickCount -= ToothpickState

		// has player lost?
		if (GamblingToothpickCount <= 0) {
			GamblingFirstSub.Stage = 202;
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ToothpickLost");
		}

		// NPC
		if (GamblingToothpickCount > 0) {
			var npc_choice = GamblingToothpickNPCChoice()
			GamblingFirstSub.Stage = 201
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "Toothpick" + npc_choice.toString());
			GamblingToothpickCount -= npc_choice
			GamblingFirstSub.Stage = 200
		
			// has NPC lost?
			if (GamblingToothpickCount <= 0) {
				GamblingFirstSub.Stage = 201;
			}
		}
	}
}

/**
 * Determines the random toothpick draw of the NPC
 * @returns {number} - The toothpicks the NPC draws
 */
function GamblingToothpickNPCChoice() {
	var max_pick = (GamblingToothpickCount >= 3) ? 3 : GamblingToothpickCount
	var choice = Math.floor(Math.random() * max_pick) + 1;
	if (GamblingToothpickCount == 6) {choice = 1}
	else if (GamblingToothpickCount == 4) {choice = 3}
	else if (GamblingToothpickCount == 3) {choice = 2}
	else if (GamblingToothpickCount == 2) {choice = 1}
	return choice
}

/**
 * Controller for fifteen and six
 * @param {"new" | "add" | "fin" | "win_next" | "lost_next"} TwentyOneState - The current state of the game
 * @returns {void} - Nothing
 */
function GamblingTwentyOneController(TwentyOneState) {
	
	if (TwentyOneState == "new") {
		// Start a New Game
		Player.Appearance = GamblingAppearancePlayer.slice();
		GamblingFirstSub.Appearance = GamblingAppearanceFirst.slice();
		GamblingPlayerSubState = GamblingDressingLevel(Player);
		GamblingNpcSubState = 0;
		GamblingPlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		CharacterRelease(Player);
		CharacterRefresh(GamblingFirstSub);
		CharacterRefresh(Player);

		for (let i = 1; i <= 3; i++) {
			GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
			GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice;
		}
		GamblingFirstSub.Stage = 100 + GamblingDiceStackSum(GamblingPlayerDiceStack);
	
	} else if (TwentyOneState == "add") {
		//Get on more Dice
		GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
		GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice; 
		GamblingFirstSub.Stage = 100 + GamblingDiceStackSum(GamblingPlayerDiceStack);
		if (GamblingDiceStackSum(GamblingPlayerDiceStack) > 21) {
			GamblingPlayerSubState = GamblingPlayerSubState +1;
			GamblingFirstSub.Stage = 170 + GamblingPlayerSubState;
		} else if (GamblingDiceStackSum(GamblingPlayerDiceStack) == 21) {
			//The Player win automatilly
			GamblingNpcSubState = GamblingNpcSubState +1;
			GamblingFirstSub.Stage = 160 + GamblingNpcSubState;
		}
	
	} else if (TwentyOneState == "fin") {
		//The Player is fin in this turn
		//The GamblingFirstSub dices as she win or over 21
		while (GamblingDiceStackSum(GamblingNpcDiceStack) <= GamblingDiceStackSum(GamblingPlayerDiceStack) && GamblingDiceStackSum(GamblingNpcDiceStack) < 22) {
			GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
			GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice; 
		}
		if (GamblingDiceStackSum(GamblingNpcDiceStack) > GamblingDiceStackSum(GamblingPlayerDiceStack) && GamblingDiceStackSum(GamblingNpcDiceStack) < 22) {
			GamblingPlayerSubState = GamblingPlayerSubState +1;
			GamblingFirstSub.Stage = 170 + GamblingPlayerSubState;
		} else {
			GamblingNpcSubState = GamblingNpcSubState +1;
			GamblingFirstSub.Stage = 160 + GamblingNpcSubState;
		}
	
	} else if (TwentyOneState == "win_next") {
		//The winner stiped the loser
		//the next turn started automaticly
		if (GamblingStripTied(GamblingFirstSub, GamblingNpcSubState)) {
			CharacterRelease(Player);
			Player.Appearance = GamblingAppearancePlayer.slice();
			CharacterRefresh(Player);
			GamblingFirstSub.AllowItem = true;
			GamblingFirstSub.Stage = 0; 
			ReputationProgress("Gambling", 3);
			}		
		
		GamblingPlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		for (let i = 1; i <= 3; i++) {
			GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
			GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice;
		}
		if (GamblingFirstSub.Stage != 0) {GamblingFirstSub.Stage = 100 + GamblingDiceStackSum(GamblingPlayerDiceStack); }
	
	} else if (TwentyOneState == "lost_next") {
		//the loser Player ist stipped by winner
		//the next turn started automaticly
		if (GamblingStripTied(Player, GamblingPlayerSubState)) {
			CharacterRelease(GamblingFirstSub);
			GamblingFirstSub.Appearance = GamblingAppearanceFirst.slice();
			CharacterRefresh(GamblingFirstSub);
			GamblingFirstSub.Stage = 0; 
			}

		GamblingPlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		for (let i = 1; i <= 3; i++) {
			GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
			GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice;
		}
		if (GamblingFirstSub.Stage != 0) {GamblingFirstSub.Stage = 100 + GamblingDiceStackSum(GamblingPlayerDiceStack); }
	}
}

/**
 * Controller for Catch the Fox
 * @param {"new" | "fox" | "hunter" | "NextDice" | "player_fox_win" | "player_fox_lost" | "player_hunter_lost" | "player_hunter_win"} FoxState - The current state of the game
 */
function GamblingFoxController(FoxState) {
		if (FoxState == "new") {
			GamblingPlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = true;
		} else if (FoxState == "fox") { 
			GamblingPlayerIsFox = true;
			GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
			GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice;
			GamblingMoneyBet = 5;
			GamblingSecondSub.Stage = 101;
		} else if (FoxState == "hunter") { 
			GamblingPlayerIsFox = false;
			GamblingMoneyBet = 5;
			CharacterChangeMoney(Player, GamblingMoneyBet * -1);
			GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
			GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
			GamblingSecondSub.Stage = 101;
		} else if (FoxState == "NextDice") {
			GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
			GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice;
			GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
			GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice; 
			if (GamblingPlayerIsFox && GamblingDiceStackSum(GamblingPlayerDiceStack) >= 30) {
				//player has won
				GamblingSecondSub.Stage = 102;
			} else if (!GamblingPlayerIsFox && GamblingDiceStackSum(GamblingNpcDiceStack) >= 30) {
				//npc has won
				GamblingSecondSub.Stage = 103;
			} else if (GamblingPlayerIsFox && (GamblingDiceStackSum(GamblingPlayerDiceStack) <= GamblingDiceStackSum(GamblingNpcDiceStack))) {
				//npc has won
				GamblingSecondSub.Stage = 104;
			} else if (!GamblingPlayerIsFox && (GamblingDiceStackSum(GamblingNpcDiceStack) <= GamblingDiceStackSum(GamblingPlayerDiceStack))) {
				//player has won
				GamblingSecondSub.Stage = 105;
			} else {
				//next dice
				GamblingSecondSub.Stage = 101;
			}
		} else if (FoxState == "player_fox_win") {
			GamblingSecondSub.AllowItem = false;
			GamblingSecondSub.CurrentDialog = GamblingSecondSub.CurrentDialog.replace("REPLACEMONEY", GamblingMoneyBet.toString());
			CharacterChangeMoney(Player, GamblingMoneyBet);
			ReputationProgress("Gambling", 2);
			GamblingPlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = false;
		} else if (FoxState == "player_fox_lost") {
			GamblingSecondSub.AllowItem = false;
			InventoryWearRandom(Player, "ItemLegs"); 
			InventoryWearRandom(Player, "ItemFeet"); 
			InventoryWearRandom(Player, "ItemArms"); 
			GamblingPlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = false;
		} else if (FoxState == "player_hunter_win") {
			InventoryWearRandom(GamblingSecondSub, "ItemArms"); 
			GamblingSecondSub.AllowItem = true;
			GamblingSecondSub.CurrentDialog = GamblingSecondSub.CurrentDialog.replace("REPLACEMONEY", GamblingMoneyBet.toString());
			CharacterChangeMoney(Player, GamblingMoneyBet);
			ReputationProgress("Gambling", 1);
			GamblingPlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = false;
		} else if (FoxState == "player_hunter_lost") {
			GamblingSecondSub.AllowItem = false;
			GamblingPlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = false;
		}
}

/**
 * Controller for Street to Roissy
 * @param {"new" | "nextDice" | "both" | "win" | "lost" | "end"} StreetRoissyState - The current state of the game
 * @returns {void} - Nothing
 */
function GamblingStreetRoissyController (StreetRoissyState) {
	if (StreetRoissyState == "new") {
		GamblingShowDiceSum = false;
		GamblingShowMoney = true;
		GamblingMoneyBet = 0;
		Player.Appearance = GamblingAppearancePlayer.slice();
		GamblingSecondSub.Appearance = GamblingAppearanceSecond.slice();
		GamblingPlayerSubState = 1;
		GamblingNpcSubState = GamblingDressingLevel(Player) + 1;
		GamblingPlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		CharacterRefresh(GamblingSecondSub);
		CharacterRefresh(Player);
		GamblingSecondSub.Stage = 200;
	} else if (StreetRoissyState == "nextDice") {
		GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
		GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice;
		GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
		GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
		GamblingSecondSub.Stage = 200;
		if (GamblingPlayerDice == GamblingPlayerSubState && GamblingNpcDice == GamblingNpcSubState) {
			//both the next level
			GamblingSecondSub.Stage = 210 + GamblingPlayerSubState;
			if (GamblingPlayerDice == GamblingNpcDice && GamblingPlayerDice == 6) {
				// both 6, new dice
				GamblingSecondSub.Stage = 220;
			} else if (GamblingNpcDice == 6) {
				//NPC win
				GamblingSecondSub.Stage = 230 + GamblingNpcSubState;
			} else if (GamblingPlayerDice == 6) {
				//Player win
				GamblingSecondSub.Stage = 240 + GamblingPlayerSubState;
			}
		} else { 
			if (GamblingNpcDice == GamblingNpcSubState) {
				//NPC win turn
				GamblingSecondSub.Stage = 230 + GamblingNpcSubState;
			} else {
				GamblingMoneyBet++;
			}
			if (GamblingPlayerDice == GamblingPlayerSubState) {
				//Player win
				GamblingSecondSub.Stage = 240 + GamblingPlayerSubState;
			} else {
				CharacterChangeMoney(Player, -1);
				GamblingMoneyBet++;
			}
		}
	} else if (StreetRoissyState == "both") {
		GamblingStripTied(Player, GamblingNpcSubState);
		GamblingStripTied(GamblingSecondSub, GamblingPlayerSubState);
		GamblingPlayerSubState++;
		GamblingNpcSubState++;
		GamblingSecondSub.Stage = 200;
	} else if (StreetRoissyState == "win") {
		GamblingSecondSub.Stage = 0; 
		if (GamblingStripTied(GamblingSecondSub, GamblingPlayerSubState)) {
			ReputationProgress("Gambling", 2);
			CharacterRelease(Player);
			Player.Appearance = GamblingAppearancePlayer.slice();
			CharacterRefresh(Player);
			GamblingSecondSub.AllowItem = true;
			GamblingSecondSub.CurrentDialog = GamblingSecondSub.CurrentDialog.replace("REPLACEMONEY", GamblingMoneyBet.toString());
			CharacterChangeMoney(Player, GamblingMoneyBet);
			GamblingStreetRoissyController ("end");
		} else {
			GamblingPlayerSubState++;
			GamblingSecondSub.Stage = 200;
		}
	} else if (StreetRoissyState == "lost") {
		GamblingSecondSub.Stage = 0; 
		if (GamblingStripTied(Player, GamblingNpcSubState)) {
			CharacterRelease(GamblingSecondSub);
			GamblingSecondSub.CurrentDialog = GamblingSecondSub.CurrentDialog.replace("REPLACEMONEY", GamblingMoneyBet.toString());
			GamblingSecondSub.Appearance = GamblingAppearanceSecond.slice();
			CharacterRefresh(GamblingSecondSub);
			GamblingSecondSub.AllowItem = false;
			GamblingStreetRoissyController ("end");
		} else {	
			GamblingNpcSubState++;
			GamblingSecondSub.Stage = 200;
		}
	} else if (StreetRoissyState == "end") {
		GamblingMoneyBet = 0;
		GamblingPlayerSubState = 1;
		GamblingNpcSubState = 1; 
		GamblingPlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		GamblingShowDiceSum = true;
		GamblingShowMoney = false;
	}		
}

/**
 * Controller for Dared Six
 * @param {"new" | "add" | "fin" | "win" | "lost"}  DaredSixState - The current state of the game
 * @returns {void} - Nothing
 */
function GamblingDaredSixController(DaredSixState) {
	if (DaredSixState == "new") {
		GamblingShowMoney = true;
		GamblingMoneyBet = 0;
		Player.Appearance = GamblingAppearancePlayer.slice();
		GamblingSecondSub.Appearance = GamblingAppearanceSecond.slice();
		GamblingPlayerSubState = GamblingDressingLevel(Player) + 1;
		GamblingNpcSubState = 1; 
		GamblingPlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		CharacterRefresh(GamblingSecondSub);
		CharacterRefresh(Player);
		GamblingDaredSixController("add");
	} else if (DaredSixState == "add") {
		GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
		GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice;
		GamblingMoneyBet++;
		CharacterChangeMoney(Player, -1);
		GamblingSecondSub.Stage = 300;
		if (GamblingPlayerDice == 6)
		{
			//Player lost automaticly
			GamblingSecondSub.Stage = 310 + GamblingPlayerSubState;
		} 
	} else if (DaredSixState == "fin") {
		do {
		GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
		GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
		GamblingMoneyBet++;
		} while (GamblingDiceStackSum(GamblingNpcDiceStack) <= GamblingDiceStackSum(GamblingPlayerDiceStack) && GamblingNpcDice != 6 ); 
		if (GamblingNpcDice == 6)
		{
			//GamblingNpcDice lost automaticly
			GamblingSecondSub.Stage = 320 + GamblingNpcSubState;
		} else {
			//GamblingNpcDice won, Player lost
			GamblingSecondSub.Stage = 310 + GamblingPlayerSubState;
		}
	} else if (DaredSixState == "win") {
		GamblingPlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		if (GamblingStripTied(GamblingSecondSub, GamblingNpcSubState)) {
			CharacterChangeMoney(Player, GamblingMoneyBet);
			CharacterRelease(Player);
			Player.Appearance = GamblingAppearancePlayer.slice();
			CharacterRefresh(Player);
			GamblingSecondSub.AllowItem = true;
			GamblingSecondSub.Stage = 330; 
			GamblingSecondSub.CurrentDialog = GamblingSecondSub.CurrentDialog.replace("REPLACEMONEY", GamblingMoneyBet.toString());
			GamblingMoneyBet = 0;
			ReputationProgress("Gambling", 3);
			GamblingShowMoney = false;
		} else {		
			GamblingNpcSubState++;
			GamblingDaredSixController("add");
		}
	} else if (DaredSixState == "lost") {
		GamblingPlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		if (GamblingStripTied(Player, GamblingPlayerSubState)) {
			CharacterRelease(GamblingSecondSub);
			GamblingSecondSub.Appearance = GamblingAppearanceSecond.slice();
			CharacterRefresh(GamblingSecondSub);
			GamblingSecondSub.AllowItem = false;
			GamblingSecondSub.Stage = 340; 
			GamblingSecondSub.CurrentDialog = GamblingSecondSub.CurrentDialog.replace("REPLACEMONEY", GamblingMoneyBet.toString());
			GamblingMoneyBet = 0;
			GamblingShowMoney = false;
		} else {
			GamblingPlayerSubState++;
			GamblingDaredSixController("add");
		}
	}		
}	

/**
 * Get the dressinglevel for characters
 * @param {Character} C - The character to check
 * @returns {number} - Returns 0 if the character is naked, 2, if she's in her underwear, 3 if she's still wearing shoes. 1 otherwise
 */
function GamblingDressingLevel(C) {
	if (CharacterIsNaked(C)) return 3;
	if (CharacterIsInUnderwear(C)) return 2;
	for (let I = 0; I < C.Appearance.length; I++)
		if (C.Appearance[I].Asset.Group.Name == "Shoes")
			return 0;
	return 1;
}

/**
 *  Strips or ties a caracter that lost a turn
 * @param {Character} gstCarachter - The character to tie
 * @param {number} gstLevel - The current game level
 * @returns {boolean} - Returns true, if the character lost, false otherwise
 */
function GamblingStripTied(gstCarachter, gstLevel) {
	var r = false;
	if (gstLevel == 1) {
		InventoryRemove(gstCarachter, "Hat"); 
		InventoryRemove(gstCarachter, "Shoes"); 
		InventoryRemove(gstCarachter, "Gloves"); 
	} else if (gstLevel == 2) {
		InventoryRemove(gstCarachter, "Cloth"); 
		InventoryRemove(gstCarachter, "ClothLower"); 
	} else if (gstLevel == 3) {
		InventoryRemove(gstCarachter, "Bra"); 
		InventoryRemove(gstCarachter, "Panties"); 
		InventoryRemove(gstCarachter, "Socks"); 
	} else if (gstLevel == 4) {
		InventoryWearRandom(gstCarachter, "ItemLegs"); 
		InventoryWearRandom(gstCarachter, "ItemFeet"); 
	} else if (gstLevel == 5) {
		InventoryWearRandom(gstCarachter, "ItemArms"); 
	} else if (gstLevel == 6) {
		InventoryWearRandom(gstCarachter, "ItemMouth"); 
		r = true;
	}
	return r;

}

/**
 * The left sub blindfolds the player
 * @returns {void} - Nothing
 */
function GamblingAnnoyGamblingFirstSub() {
	InventoryWear(Player, "LeatherBlindfold", "ItemHead");
	CharacterSetCurrent(Player);
}

/**
 * Uses an activity on the player or releases her
 * @param {"new"| "next" } ReleaseState - The current state of the release process
 * @returns {void} - Nothing
 */
function GamblingReleasePlayerGame(ReleaseState) {
	if (ReleaseState == "new") {
		GamblingNpcSubState = 0;
		GamblingReleasePlayerGame("next");
	} else if (ReleaseState == "next") {
		GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
		GamblingNpcDice = GamblingNpcDice + GamblingNpcSubState;
		if (GamblingNpcDice > 6) GamblingNpcDice = 6;
		GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
		if (GamblingNpcDice == 1) {
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ActivityKissIntro");
			GamblingFirstSub.Stage = "ActivityKiss";
			GamblingNpcSubState++;
		} else if (GamblingNpcDice == 2) {
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ActivitySlapIntro");
			GamblingFirstSub.Stage = "ActivitySlap";
			GamblingNpcSubState++;
		} else if (GamblingNpcDice == 3) {
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ActivityTickleIntro");
			GamblingFirstSub.Stage = "ActivityTickle";
			GamblingNpcSubState++;
		} else if (GamblingNpcDice == 4) {
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ActivityFondleIntro");
			GamblingFirstSub.Stage = "ActivityFondle";
			GamblingNpcSubState++;
		} else if (GamblingNpcDice == 5) {
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ActivitySpankIntro");
			GamblingFirstSub.Stage = "ActivitySpank";
			GamblingNpcSubState++;
		} else if (GamblingNpcDice == 6) {
			if (GamblingIsMaidsDisabled()) {
				GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ActivityReleaseIntroNoMaids");
			} else {
				CharacterRelease(Player);
				GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ActivityReleaseIntro");
			}
			GamblingNpcSubState = 0;
			GamblingFirstSub.Stage = "ActivityRelease";
		}
	}
}

/**
 * Release the player for money
 * @returns {void} - Nothing
 */
function GamblingPayForFreedom() {
	if (!GamblingSecondSub.IsRestrained()) {
		CharacterChangeMoney(Player, -25);
		CharacterRelease(Player);
	} else {
		GamblingSecondSub.Stage = "0";
		GamblingSecondSub.CurrentDialog = DialogFind(GamblingSecondSub, "GamblingSecondSubTied");
	}
}
/**
 * Dresses the character back
 * @returns {void} - Nothing
 */
function GamblingDressBackPlayer() {
	Player.Appearance = GamblingAppearancePlayer.slice();
	CharacterRefresh(Player);
}

//
/**
 * When the player rescues the Gambling Subs
 * @returns {void} - Nothing
 */
function GamblingCompleteRescue() {
	GamblingFirstSub.AllowItem = false;
	GamblingSecondSub.AllowItem = false;
	CharacterRelease(GamblingFirstSub);
	CharacterRelease(GamblingSecondSub);
	GamblingFirstSub.Appearance = GamblingAppearanceFirst.slice();
	GamblingSecondSub.Appearance = GamblingAppearanceSecond.slice();
	CharacterRefresh(GamblingFirstSub);
	CharacterRefresh(GamblingSecondSub);
	GamblingFirstSub.Stage = 0;
	GamblingSecondSub.Stage = 0;
	MaidQuartersCurrentRescueCompleted = true;
}

/**
 * The player tries to steal the dice
 * @returns {void} - Nothing
 */
function GamblingStealDice() {
	if (Math.random() < 0.25) {
		LogAdd("Caught", "BadGirl");
		PrisonMeetPoliceIntro("Gambling");
	} else {
		CharacterSetCurrent(Player);
		Player.CurrentDialog = TextGet("SuccessStolen");
		LogAdd("Stolen", "BadGirl");
	}
}
