"use strict";

var GamblingBackground = "Gambling";
var GamblingFirstSub = null;
var GamblingSecondSub = null;
var PlayerDice = null;
var GamblingNpcDice = null;
var PlayerDiceStack = [];
var GamblingNpcDiceStack = [];
var GamblingPlayerSubState = 0;
var GamblingNpcSubState = 0;	//Game-State of NPC
var PlayerIsFox = true;	//Player is Fox by Fox and Hunter
var GamblingMoneyBet = 0;	//Money Bet in Current Game
var GamblingShowDiceSum = true; //Show Summ of Dice Dots in DiceStack
var GamblingShowMoney = false;	//Show Money in DiceStack
var GamblingAppearanceFirst = null;
var GamblingAppearanceSecond = null;
var GamblingAppearancePlayer = null;

// Returns TRUE if a dialog is permitted
function GamblingIsSubsRestrained() { return (GamblingFirstSub.IsRestrained() || !GamblingFirstSub.CanTalk() || GamblingSecondSub.IsRestrained() || !GamblingSecondSub.CanTalk());}
function GamblingFirstSubRestrained() {return (GamblingFirstSub.IsRestrained());}
function GamblingFirstCanPlay() {return (!Player.IsRestrained() && Player.CanTalk() && !GamblingFirstSub.IsRestrained() && GamblingFirstSub.CanTalk());}
function GamblingSecondSubRestrained() {return (GamblingSecondSub.IsRestrained());}
function GamblingSecondCanPlay() {return (!Player.IsRestrained() && Player.CanTalk() && !GamblingSecondSub.IsRestrained() && GamblingSecondSub.CanTalk());}
function GamblingCanPlaySimpleDice() {return GamblingFirstCanPlay()}
function GamblingCanPlayTwentyOne() {return (GamblingFirstCanPlay() && ReputationGet("Gambling") >= 10);}
function GamblingCanPlayFox() {return (GamblingSecondCanPlay() && (ReputationGet("Gambling") >= 30) && (Player.Money >= 10));}
function GamblingCanPlayStreetRoissy() {return (GamblingSecondCanPlay() && (ReputationGet("Gambling") >= 40) && (Player.Money >= 30));}
function GamblingCanPlayDaredSix() {return (GamblingSecondCanPlay() && (ReputationGet("Gambling") >= 50) && (Player.Money >= 50));}

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
	if (Player.CanChange()) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Dress.png");
}

// When the user clicks in the Gambling Hall
function GamblingClick() {
	if ((MouseX >= 250) && (MouseX < 750) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(GamblingFirstSub);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if (((MouseX >= 1250) && (MouseX < 1750) && (MouseY >= 0) && (MouseY < 1000)) && ((ReputationGet("Gambling") > 20) || MaidQuartersCurrentRescue == "Gambling") ) CharacterSetCurrent(GamblingSecondSub);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355) && Player.CanChange()) GamblingDressBackPlayer();
}

// Print the Stack of Dices and the Sum of Ponits and Player Money
function GamblingShowDiceStack(){
	var j = 0;
	for (var i = PlayerDiceStack.length; i > 0 ; i--) {
		DrawImageResize("Screens/Room/Gambling/dice_" + PlayerDiceStack[i - 1] + ".png", 25, (25 + j * 60), 60, 60);
		j++;
		}
	if (GamblingShowDiceSum) DrawText(GamblingDiceStackSum(PlayerDiceStack), 125, 55, "white", "black");
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
function GamblingShowNpcDice(){
	DrawImageResize("Screens/Room/Gambling/dice_" + GamblingNpcDice + ".png", 525, 25, 60, 60);
	return true;
}

//Calculate the Sum of Points in the Stock of Dices
function GamblingDiceStackSum(DiceStack){
	var GamblingDiceStackSum = 0;
	for (var i = 0; i < DiceStack.length ; i++) {
		GamblingDiceStackSum = GamblingDiceStackSum + DiceStack[i];
	}
	return GamblingDiceStackSum;
}

// Controller for the Simple Dice Game
function GamblingSimpleDiceController(SimpleDiceState) {
	if (SimpleDiceState == "new"){
		PlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		PlayerDice = Math.floor(Math.random() * 6) + 1;
		PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
		GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
		if (PlayerDice > GamblingNpcDice) {
			GamblingFirstSub.AllowItem = true;
			GamblingFirstSub.Stage = 81;
			}
		if (PlayerDice < GamblingNpcDice) {
			GamblingFirstSub.AllowItem = false;
			GamblingFirstSub.Stage = 82;
			}
		if (PlayerDice == GamblingNpcDice) { 
			GamblingFirstSub.AllowItem = false;
			GamblingFirstSub.Stage = 83;
			}
	} else if (SimpleDiceState == "win"){
			GamblingFirstSub.Stage = 0;
			ReputationProgress("Gambling", 1);
	} else if (SimpleDiceState == "lost"){
			InventoryWearRandom(Player, "ItemArms");
			GamblingFirstSub.Stage = 0;
	} else if (SimpleDiceState == "equal"){
			InventoryRemove(Player, "ItemArms");
			InventoryRemove(GamblingFirstSub, "ItemArms");
			GamblingFirstSub.Stage = 0;
	}
}

//Controller for fifteen and six
function GamblingTwentyOneController(TwentyOneState) {
	
	if (TwentyOneState == "new"){
		// Start a New Game
		GamblingPlayerSubState = 0;
		GamblingNpcSubState = 0;
		PlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		CharacterRelease(Player);
		GamblingFirstSub.Appearance = GamblingAppearanceFirst.slice();
		CharacterRefresh(GamblingFirstSub);
		Player.Appearance = GamblingAppearancePlayer.slice();
		CharacterRefresh(Player);

		for (var i = 1; i <= 3; i++) {
			PlayerDice = Math.floor(Math.random() * 6) + 1;
			PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		}
		GamblingFirstSub.Stage = 100 + GamblingDiceStackSum(PlayerDiceStack);
	
	} else if (TwentyOneState == "add"){
		//Get on more Dice
		PlayerDice = Math.floor(Math.random() * 6) + 1;
		PlayerDiceStack[PlayerDiceStack.length] = PlayerDice; 
		GamblingFirstSub.Stage = 100 + GamblingDiceStackSum(PlayerDiceStack);
		if (GamblingDiceStackSum(PlayerDiceStack) > 21) {
			GamblingPlayerSubState = GamblingPlayerSubState +1;
			GamblingFirstSub.Stage = 170 + GamblingPlayerSubState;
		} else if (GamblingDiceStackSum(PlayerDiceStack) == 21){
			//The Player win automatilly
			GamblingNpcSubState = GamblingNpcSubState +1;
			GamblingFirstSub.Stage = 160 + GamblingNpcSubState;
		}
	
	} else if (TwentyOneState == "fin") {
		//The Player is fin in this turn
		//The GamblingFirstSub dices as she win or over 21
		while (GamblingDiceStackSum(GamblingNpcDiceStack) <= GamblingDiceStackSum(PlayerDiceStack) && GamblingDiceStackSum(GamblingNpcDiceStack) < 22) {
			GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
			GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice; 
		}
		if (GamblingDiceStackSum(GamblingNpcDiceStack) > GamblingDiceStackSum(PlayerDiceStack) && GamblingDiceStackSum(GamblingNpcDiceStack) < 22){
			GamblingPlayerSubState = GamblingPlayerSubState +1;
			GamblingFirstSub.Stage = 170 + GamblingPlayerSubState;
		} else {
			GamblingNpcSubState = GamblingNpcSubState +1;
			GamblingFirstSub.Stage = 160 + GamblingNpcSubState;
		}
	
	} else if (TwentyOneState == "win_next"){
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
		
		PlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		for (var i = 1; i <= 3; i++) {
			PlayerDice = Math.floor(Math.random() * 6) + 1;
			PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		}
		if (GamblingFirstSub.Stage != 0) {GamblingFirstSub.Stage = 100 + GamblingDiceStackSum(PlayerDiceStack); }
	
	} else if (TwentyOneState == "lost_next"){
		//the loser Player ist stipped by winner
		//the next turn started automaticly
		if (GamblingStripTied(Player, GamblingPlayerSubState)) {
			CharacterRelease(GamblingFirstSub);
			GamblingFirstSub.Appearance = GamblingAppearanceFirst.slice();
			CharacterRefresh(GamblingFirstSub);
			GamblingFirstSub.Stage = 0; 
			}

		PlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		for (var i = 1; i <= 3; i++) {
			PlayerDice = Math.floor(Math.random() * 6) + 1;
			PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		}
		if (GamblingFirstSub.Stage != 0) {GamblingFirstSub.Stage = 100 + GamblingDiceStackSum(PlayerDiceStack); }
	}
}

//Controller for Catch the Fox
function GamblingFoxController(FoxState){
		if (FoxState == "new"){
			PlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = true;
		} else if (FoxState == "fox") { 
			PlayerIsFox = true;
			PlayerDice = Math.floor(Math.random() * 6) + 1;
			PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
			GamblingMoneyBet = 10;
			GamblingSecondSub.Stage = 101;
		} else if (FoxState == "hunter") { 
			PlayerIsFox = false;
			CharacterChangeMoney(Player, -10);
			GamblingMoneyBet = 10;
			GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
			GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
			GamblingSecondSub.Stage = 101;
		} else if (FoxState == "NextDice") {
			PlayerDice = Math.floor(Math.random() * 6) + 1;
			PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
			GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
			GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice; 
			if (PlayerIsFox && GamblingDiceStackSum(PlayerDiceStack) >= 30) {
				//player has won
				GamblingSecondSub.Stage = 102;
			} else if (!PlayerIsFox && GamblingDiceStackSum(GamblingNpcDiceStack) >= 30) {
				//npc has won
				GamblingSecondSub.Stage = 103;
			} else if (PlayerIsFox && (GamblingDiceStackSum(PlayerDiceStack) <= GamblingDiceStackSum(GamblingNpcDiceStack))) {
				//npc has won
				GamblingSecondSub.Stage = 104;
			} else if (!PlayerIsFox && (GamblingDiceStackSum(GamblingNpcDiceStack) <= GamblingDiceStackSum(PlayerDiceStack))) {
				//player has won
				GamblingSecondSub.Stage = 105;
			} else {
				//next dice
				GamblingSecondSub.Stage = 101;
			}
		} else if (FoxState == "player_fox_win"){
			GamblingSecondSub.AllowItem = false;
			GamblingSecondSub.CurrentDialog = GamblingSecondSub.CurrentDialog.replace("REPLACEMONEY", GamblingMoneyBet.toString());
			CharacterChangeMoney(Player, 10);
			ReputationProgress("Gambling", 2);
			PlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = false;
		} else if (FoxState == "player_fox_lost"){
			GamblingSecondSub.AllowItem = false;
			InventoryWearRandom(Player, "ItemLegs"); 
			InventoryWearRandom(Player, "ItemFeet"); 
			InventoryWearRandom(Player, "ItemArms"); 
			PlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = false;
		} else if (FoxState == "player_hunter_win"){
			InventoryWearRandom(GamblingSecondSub, "ItemArms"); 
			GamblingSecondSub.AllowItem = true;
			GamblingSecondSub.CurrentDialog = GamblingSecondSub.CurrentDialog.replace("REPLACEMONEY", GamblingMoneyBet.toString());
			CharacterChangeMoney(Player, 10);
			ReputationProgress("Gambling", 1);
			PlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = false;
		} else if (FoxState == "player_hunter_lost"){
			GamblingSecondSub.AllowItem = false;
			PlayerDiceStack = [];
			GamblingNpcDiceStack = [];
			GamblingShowMoney = false;
		}
}

//Controller for Street to Roissy
function GamblingStreetRoissyController (StreetRoissyState){
	if (StreetRoissyState == "new"){
		GamblingShowDiceSum = false;
		GamblingShowMoney = true;
		GamblingMoneyBet = 0;
		GamblingPlayerSubState = 1;
		GamblingNpcSubState = 1; 
		PlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		GamblingSecondSub.Appearance = GamblingAppearanceSecond.slice();
		CharacterRefresh(GamblingSecondSub);
		Player.Appearance = GamblingAppearancePlayer.slice();
		CharacterRefresh(Player);
		GamblingSecondSub.Stage = 200;
	} else if (StreetRoissyState == "nextDice"){
		PlayerDice = Math.floor(Math.random() * 6) + 1;
		PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
		GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
		GamblingSecondSub.Stage = 200;
		if (PlayerDice == GamblingPlayerSubState && GamblingNpcDice == GamblingNpcSubState) {
			//both the next level
			GamblingSecondSub.Stage = 210 + GamblingPlayerSubState;
			if (PlayerDice == GamblingNpcDice && PlayerDice == 6){
				// both 6, new dice
				GamblingSecondSub.Stage = 220;
			} else if (GamblingNpcDice == 6) {
				//NPC win
				GamblingSecondSub.Stage = 230 + GamblingNpcSubState;
			} else if (PlayerDice == 6) {
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
			if (PlayerDice == GamblingPlayerSubState) {
				//Player win
				GamblingSecondSub.Stage = 240 + GamblingPlayerSubState;
			} else {
				CharacterChangeMoney(Player, -1);
				GamblingMoneyBet++;
			}
		}
	} else if (StreetRoissyState == "both"){
		GamblingStripTied(Player, GamblingNpcSubState);
		GamblingStripTied(GamblingSecondSub, GamblingPlayerSubState);
		GamblingPlayerSubState++;
		GamblingNpcSubState++;
		GamblingSecondSub.Stage = 200;
	} else if (StreetRoissyState == "win"){
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
	} else if (StreetRoissyState == "lost"){
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
	} else if (StreetRoissyState == "end"){
		GamblingMoneyBet = 0;
		GamblingPlayerSubState = 1;
		GamblingNpcSubState = 1; 
		PlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		GamblingShowDiceSum = true;
		GamblingShowMoney = false;
	}		
}

//Controller for Dared Six
function GamblingDaredSixController (DaredSixState){
	if (DaredSixState == "new"){
		GamblingShowMoney = true;
		GamblingMoneyBet = 0;
		GamblingPlayerSubState = 1;
		GamblingNpcSubState = 1; 
		PlayerDiceStack = [];
		GamblingNpcDiceStack = [];
		GamblingSecondSub.Appearance = GamblingAppearanceSecond.slice();
		CharacterRefresh(GamblingSecondSub);
		Player.Appearance = GamblingAppearancePlayer.slice();
		CharacterRefresh(Player);
		GamblingDaredSixController("add");
	} else if (DaredSixState == "add"){
		PlayerDice = Math.floor(Math.random() * 6) + 1;
		PlayerDiceStack[PlayerDiceStack.length] = PlayerDice;
		GamblingMoneyBet++;
		CharacterChangeMoney(Player, -1);
		GamblingSecondSub.Stage = 300;
		if (PlayerDice == 6)
		{
			//Player lost automaticly
			GamblingSecondSub.Stage = 310 + GamblingPlayerSubState;
		} 
	} else if (DaredSixState == "fin"){
		do {
		GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
		GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
		GamblingMoneyBet++;
		} while (GamblingDiceStackSum(GamblingNpcDiceStack) <= GamblingDiceStackSum(PlayerDiceStack) && GamblingNpcDice != 6 ); 
		if (GamblingNpcDice == 6)
		{
			//GamblingNpcDice lost automaticly
			GamblingSecondSub.Stage = 320 + GamblingNpcSubState;
		} else {
			//GamblingNpcDice won, Player lost
			GamblingSecondSub.Stage = 310 + GamblingPlayerSubState;
		}
	} else if (DaredSixState == "win"){
		PlayerDiceStack = [];
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
	} else if (DaredSixState == "lost"){
		PlayerDiceStack = [];
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

// Strip or tied a caracter that lost a turn, return true if the last level reached
function GamblingStripTied(gstCarachter, gstLevel){
	var r = false;
	if (gstLevel == 1){
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
function GamblingAnnoyGamblingFirstSub(){
	InventoryWear(Player, "LeatherBlindfold", "ItemHead");
	CharacterSetCurrent(Player);
}

//Release Player
function GamblingReleasePlayerGame(ReleaseState) {
	if (ReleaseState == "new"){
		GamblingNpcSubState = 0;
		GamblingReleasePlayerGame("next");
	} else if (ReleaseState == "next"){
		GamblingNpcDice = Math.floor(Math.random() * 6) + 1;
		GamblingNpcDice = GamblingNpcDice + GamblingNpcSubState;
		if (GamblingNpcDice > 6) GamblingNpcDice = 6;
		GamblingNpcDiceStack[GamblingNpcDiceStack.length] = GamblingNpcDice;
		if (GamblingNpcDice == 1){
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
function GamblingPayForFreedom(){
	if (!GamblingSecondSub.IsRestrained()){
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