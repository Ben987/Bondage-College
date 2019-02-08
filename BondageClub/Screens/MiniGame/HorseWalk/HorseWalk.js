"use strict";
var HorseWalkBackground = "HorseStableLight";
var HorseWalkCarrots = null;
var HorseWalkCrops = null;
var HorseWalkPlayerX = 0;
var HorseWalkPlayerY = 0;
var HorseWalkItemSize = 100;
var HorseWalkCollectedCarrots = 0;
var HorseWalkCollectedCrops = 0;
var HorseWalkSpeed = 1;
var HorseWalkText =""

// Generates all the Carrots
function HorseWalkGenerateItems(MaxCarrot, MaxCrop) {
	// Full the Carrots sequence
	HorseWalkCarrots = [];
	for(var S = 0; S < MaxCarrot; S++) {
		// Generates each Carrot 1 by 1
		var NewCarrot = {
			X : Math.floor(Math.random() * 1980) + 10,
			Y : Math.floor(Math.random() * 940) + 10,
			T : 1
		}
		HorseWalkCarrots.push(NewCarrot);
	}
	// Full the Carrots sequence
	HorseWalkCrops = [];
	for(var S = 0; S < MaxCrop; S++) {
		// Generates each Carrot 1 by 1
		var NewCrop = {
			X : Math.floor(Math.random() * 1980) + 10,
			Y : Math.floor(Math.random() * 940) + 10,
			T : Math.floor(Math.random() * 4) + 1
		}
		HorseWalkCrops.push(NewCrop);
	}

}

// Draw the Carrots
function HorseWalkDrawItem() {
	for(var S = 0; S < HorseWalkCarrots.length; S++)
		DrawImage("Screens/MiniGame/HorseWalk/carrot.png", HorseWalkCarrots[S].X - (HorseWalkItemSize / 2), HorseWalkCarrots[S].Y - (HorseWalkItemSize / 2));
	for(var S = 0; S < HorseWalkCrops.length; S++)
		DrawImage("Screens/MiniGame/HorseWalk/LeatherCrop.png", HorseWalkCrops[S].X - (HorseWalkItemSize / 2), HorseWalkCrops[S].Y - (HorseWalkItemSize / 2));
}

// Loads the Horse Walk mini game
function HorseWalkLoad() {

	HorseWalkBackground = "HorseStable";

	// The higher the difficulty, the more Carrots there will be (less Carrots on mobile since we cannot swipe the mouse)
	HorseWalkPlayerX = 900;
	HorseWalkPlayerY = 400;
	var Factor = (CommonIsMobile) ? 0.25 : 1;
	var MaxCarrot = 6 * Factor;
	if (MiniGameDifficulty == "Normal") MaxCarrot = 12 * Factor;
	if (MiniGameDifficulty == "Hard") MaxCarrot = 18 * Factor;
	MiniGameTimer = CommonTime() + 40000;
	HorseWalkGenerateItems(MaxCarrot, MaxCarrot);
	HorseWalkCollectedCarrots = 0;
	HorseWalkCollectedCrops = 0;
	HorseWalkSpeed = 1 + SkillGetLevel(Player, "Dressage")/5;
}

// Run the maid cleaning mini game
function HorseWalkRun() {

	// The game ends in victory if the time runs out
	var Time = CommonTime();
	//if (!MiniGameEnded && (HorseWalkCarrots.length == 0)) HorseWalkEnd(true);
	if (!MiniGameEnded && (Time >= MiniGameTimer)){
		if (HorseWalkCollectedCarrots > HorseWalkCollectedCrops) {
			var HorseWalkSkillProgress = (HorseWalkCollectedCarrots - HorseWalkCollectedCrops) * 5;
			SkillProgress("Dressage",  HorseWalkSkillProgress);
			HorseWalkEnd(true);
		} else {
			HorseWalkEnd(false);
		}
	}
	if (Time >= MiniGameTimer + 5000) CommonDynamicFunction(MiniGameReturnFunction + "()");

	// Draw the player character, progress bar and text
	HorseWalkDoMove();
	DrawCharacter(Player, HorseWalkPlayerX, HorseWalkPlayerY, 0.4);
	HorseWalkDrawItem();
	if (!MiniGameEnded) DrawProgressBar(0, 950, 2000, 50, (MiniGameTimer - Time) / 600);
	else DrawRect(0, 950, 2000, 50, "white");
	if (Time < MiniGameTimer) {
		HorseWalkText = TextGet("HorseWalkSpots");
		HorseWalkText = HorseWalkText.replace("$CARROTS", HorseWalkCollectedCarrots).replace("$CROPS", HorseWalkCollectedCrops);
		DrawText(HorseWalkText, 1000, 977, "black", "white");
	} else {
		HorseWalkText = TextGet(MiniGameVictory ? "Victory" : "Defeat");
		HorseWalkText = HorseWalkText.replace("$CARROTS", HorseWalkCollectedCarrots).replace("$CROPS", HorseWalkCollectedCrops);
		DrawText(HorseWalkText, 1000, 977, "black", "white");
	}
}

// Ends the game and sends the result back to the screen
function HorseWalkEnd(Victory) {
	MiniGameVictory = Victory;
	MiniGameEnded = true;
	MiniGameTimer = CommonTime();
}

// When the user clicks in the horse walk game
function HorseWalkDoMove() {

	// If the position changed
	if (((HorseWalkPlayerX != MouseX - 100) || (HorseWalkPlayerY != MouseY - 100)) && (MouseX >= 0) && (MouseY >= 0)) {
		
		if ( HorseWalkPlayerX > (MouseX - 100 + HorseWalkSpeed) ) {
			HorseWalkPlayerX -= HorseWalkSpeed;
		} else if ( HorseWalkPlayerX < (MouseX - 100 - HorseWalkSpeed) ){
			HorseWalkPlayerX += HorseWalkSpeed;
		} else {
			HorseWalkPlayerX = MouseX - 100;
		}
		
		if ( HorseWalkPlayerY > (MouseY - 100 + HorseWalkSpeed) ) {
			HorseWalkPlayerY -= HorseWalkSpeed;
		} else if ( (HorseWalkPlayerY) < (MouseY - 100 - HorseWalkSpeed) ){
			HorseWalkPlayerY += HorseWalkSpeed;
		} else {
			HorseWalkPlayerY = MouseY - 100;
		}



		var Range = ((CommonIsMobile) ? (HorseWalkItemSize / 1.5) : (HorseWalkItemSize / 2));

		// If the game has started, we check the click position and remove a Item at that position
		if (!MiniGameEnded){
			for(var S = 0; S < HorseWalkCarrots.length; S++){
				if (((HorseWalkPlayerX+100) >= HorseWalkCarrots[S].X - Range) && ((HorseWalkPlayerX+100) <= HorseWalkCarrots[S].X + Range) && ((HorseWalkPlayerY+100) >= HorseWalkCarrots[S].Y - Range) && ((HorseWalkPlayerY+100) <= HorseWalkCarrots[S].Y + Range)) {
					HorseWalkCarrots.splice(S, 1);
					HorseWalkCollectedCarrots++;
					return;
				}
			}
			for(var S = 0; S < HorseWalkCrops.length; S++){
				if (((HorseWalkPlayerX+100) >= HorseWalkCrops[S].X - Range) && ((HorseWalkPlayerX+100) <= HorseWalkCrops[S].X + Range) && ((HorseWalkPlayerY+100) >= HorseWalkCrops[S].Y - Range) && ((HorseWalkPlayerY+100) <= HorseWalkCrops[S].Y + Range)) {
					HorseWalkCrops.splice(S, 1);
					HorseWalkCollectedCrops++;
					return;
				}
			}
		}
	}

}

// On mobile, we need to move the player on click
function HorseWalkClick() {
	if (CommonIsMobile) HorseWalkDoMove();
}