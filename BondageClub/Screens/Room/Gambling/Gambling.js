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

// Returns TRUE if a dialog is permitted
function GamblingIsSubsRestrained() { return (GamblingFirstSub.IsRestrained() || !GamblingFirstSub.CanTalk() || GamblingSecondSub.IsRestrained() || !GamblingSecondSub.CanTalk());}
function GamblingFirstSubRestrained() {return (GamblingFirstSub.IsRestrained());}
function GamblingFirstCanPlay() {return (!Player.IsRestrained() && Player.CanTalk() && !GamblingFirstSub.IsRestrained() && GamblingFirstSub.CanTalk());}
function GamblingSecondSubRestrained() {return (GamblingSecondSub.IsRestrained());}
function GamblingSecondCanPlay() {return (!Player.IsRestrained() && Player.CanTalk() && !GamblingSecondSub.IsRestrained() && GamblingSecondSub.CanTalk());}
function GamblingCanPlaySimpleDice() {return GamblingFirstCanPlay()}
function GamblingCanPlayTwentyOne() {return (GamblingFirstCanPlay() && ReputationGet("Gambling") >= 10);}
function GamblingCanPlayToothpick() {return (GamblingFirstCanPlay() && ReputationGet("Gambling") >= 20);}
function GamblingCanPlayFox() {return (GamblingSecondCanPlay() && (ReputationGet("Gambling") >= 30) && (Player.Money >= 10));}
function GamblingCanPlayStreetRoissy() {return (GamblingSecondCanPlay() && (ReputationGet("Gambling") >= 40) && (Player.Money >= 30));}
function GamblingCanPlayDaredSix() {return (GamblingSecondCanPlay() && (ReputationGet("Gambling") >= 50) && (Player.Money >= 50));}

function GamblingToothpickCanPickOne() {return GamblingToothpickCount >= 1}
function GamblingToothpickCanPickTwo() {return GamblingToothpickCount >= 2}
function GamblingToothpickCanPickThree() {return GamblingToothpickCount >= 3}

function GamblingIsRestrainedWithLock() { return InventoryCharacterHasLockedRestraint(Player) };
function GamblingIsRestrainedWithoutLock() { return (Player.IsRestrained() && !InventoryCharacterHasLockedRestraint(Player)) };

function GamblingCanPayToRelease() { return ((Player.Money >= 25) && !InventoryCharacterHasLockedRestraint(Player)) };
function GamblingCannotPayToRelease() { return ((Player.Money < 25) && !InventoryCharacterHasLockedRestraint(Player)) };

function GamblingCanStealDice() {return (LogQuery("Joined", "BadGirl") && !(LogQuery("Stolen", "BadGirl") || LogQuery("Hide", "BadGirl"))) }

// Loads the Gambling Hall
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

// Run the Gambling Hall, draw all characters
function GamblingRun() {
	DrawCharacter(GamblingFirstSub, 250, 0, 1);
	DrawCharacter(Player, 750, 0, 1);
	if ((ReputationGet("Gambling") > 20) || MaidQuartersCurrentRescue == "Gambling") DrawCharacter(GamblingSecondSub, 1250, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png");
	if (Player.CanInteract()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png"); //Only Dess Back after loose Game
	//BadGirlsClub
	if (GamblingCanStealDice()) DrawButton(1885, 385, 90, 90, "", "White", "Icons/DiceTheft.png", TextGet("DiceTheft"));
}

// When the user clicks in the Gambling Hall
function GamblingClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(GamblingFirstSub);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if (((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) && ((ReputationGet("Gambling") > 20) || MaidQuartersCurrentRescue == "Gambling") ) CharacterSetCurrent(GamblingSecondSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) GamblingDressBackPlayer();
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475)  && GamblingCanStealDice()) GamblingStealDice();
}

// Print the Stack of Dices and the Sum of Ponits and Player Money
function GamblingShowDiceStack() {
	var j = 0;
	for (var i = GamblingPlayerDiceStack.length; i > 0 ; i--) {
		DrawImageResize("Screens/Room/Gambling/dice_" + GamblingPlayerDiceStack[i - 1] + ".png", 25, (25 + j * 60), 60, 60);
		j++;
		}
	if (GamblingShowDiceSum) DrawText(GamblingDiceStackSum(GamblingPlayerDiceStack), 125, 55, "white", "black");
	if (GamblingShowMoney) DrawText(Player.Money.toString() + " $", 175, 125, "white", "black");
	j = 0;
	for (var i = GamblingNpcDiceStack.length; i > 0 ; i--) {
		DrawImageResize("Screens/Room/Gambling/dice_" + GamblingNpcDiceStack[i - 1] + ".png", 525, (25 + j * 60), 60, 60);
		j++;
		}
	if (GamblingShowDiceSum) DrawText(GamblingDiceStackSum(GamblingNpcDiceStack), 625, 55, "white", "black");
	return true;
}

// Print the Dices for the NPC
function GamblingShowNpcDice() {
	DrawImageResize("Screens/Room/Gambling/dice_" + GamblingNpcDice + ".png", 525, 25, 60, 60);
	return true;
}

//Calculate the Sum of Points in the Stock of Dices
function GamblingDiceStackSum(DiceStack) {
	var GamblingDiceStackSum = 0;
	for (var i = 0; i < DiceStack.length ; i++) {
		GamblingDiceStackSum = GamblingDiceStackSum + DiceStack[i];
	}
	return GamblingDiceStackSum;
}

// Controller for the Simple Dice Game
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

// Draws the Toothpicks
function GamblingShowToothpickStack () {
	for (var i = 0; i < GamblingToothpickCount; i++) {
		DrawImageResize("Screens/Room/Gambling/toothpick.png", 410, 45 + 26 * i, 160, 7);
	}
	DrawText(GamblingToothpickCount, 490, 25, "white", "black")
	return true;
}

//Controller for Toothpick
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

function GamblingToothpickNPCChoice() {
	var max_pick = (GamblingToothpickCount >= 3) ? 3 : GamblingToothpickCount
	var choice = Math.floor(Math.random() * max_pick) + 1;
	if (GamblingToothpickCount == 6) {choice = 1}
	else if (GamblingToothpickCount == 4) {choice = 3}
	else if (GamblingToothpickCount == 3) {choice = 2}
	else if (GamblingToothpickCount == 2) {choice = 1}
	return choice
}

//Controller for fifteen and six
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

		for (var i = 1; i <= 3; i++) {
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
		for (var i = 1; i <= 3; i++) {
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
		for (var i = 1; i <= 3; i++) {
			GamblingPlayerDice = Math.floor(Math.random() * 6) + 1;
			GamblingPlayerDiceStack[GamblingPlayerDiceStack.length] = GamblingPlayerDice;
		}
		if (GamblingFirstSub.Stage != 0) {GamblingFirstSub.Stage = 100 + GamblingDiceStackSum(GamblingPlayerDiceStack); }
	}
}

//Controller for Catch the Fox
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

//Controller for Street to Roissy
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

//Controller for Dared Six
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

//get dressinglevel for Caracters
function GamblingDressingLevel(C) {
	if (CharacterIsNaked(C)) return 3;
	if (CharacterIsInUnderwear(C)) return 2;
	for (var I = 0; I < C.Appearance.length; I++)
		if (C.Appearance[I].Asset.Group.Name == "Shoes")
			return 0;
	return 1;
}

// Strip or tied a caracter that lost a turn, return true if the last level reached
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

// The GamblingFirstSub blindfold the Player
function GamblingAnnoyGamblingFirstSub() {
	InventoryWear(Player, "LeatherBlindfold", "ItemHead");
	CharacterSetCurrent(Player);
}

//Release Player
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
			CharacterRelease(Player);
			GamblingNpcSubState = 0;
			GamblingFirstSub.CurrentDialog = DialogFind(GamblingFirstSub, "ActivityReleaseIntro");
			GamblingFirstSub.Stage = "ActivityRelease";
		}
	}
}

//Release Player for Money
function GamblingPayForFreedom() {
	if (!GamblingSecondSub.IsRestrained()) {
		CharacterChangeMoney(Player, -25);
		CharacterRelease(Player);
	} else {
		GamblingSecondSub.Stage = "0";
		GamblingSecondSub.CurrentDialog = DialogFind(GamblingSecondSub, "GamblingSecondSubTied");
	}
}
//Dress Caracter Back
function GamblingDressBackPlayer() {
	Player.Appearance = GamblingAppearancePlayer.slice();
	CharacterRefresh(Player);
}

// When the player rescues the Gambling Subs
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

// Try to Steal the Dice for BadGirlsClub
function GamblingStealDice() {
	if (Math.random() < 0.25) {
		PrisonMeetPoliceIntro("Gambling");
	} else {
		CharacterSetCurrent(Player);
		Player.CurrentDialog = TextGet("SuccessStolen");
		LogAdd("Stolen", "BadGirl");
	}
}
