"use strict";
var HorseWalkBackground = "HorseStable";
var HorseWalkCarrots = null;
var HorseWalkPlayerX = 0;
var HorseWalkPlayerY = 0;
var HorseWalkCarrotsize = 100;

// Generates all the Carrots
function HorseWalkGenerateCarrots(MaxCarrot) {

	// Full the Carrots sequence
	HorseWalkCarrots = [];
	for(var S = 0; S < MaxCarrot; S++) {

		// Generates each Carrot 1 by 1
		var NewCarrot = {
			X : Math.floor(Math.random() * 1980) + 10,
			Y : Math.floor(Math.random() * 940) + 10,
			T : Math.floor(Math.random() * 4) + 1
		}
		HorseWalkCarrots.push(NewCarrot);

	}

}

// Draw the Carrots
function HorseWalkDrawCarrots() {
	for(var S = 0; S < HorseWalkCarrots.length; S++)
		DrawImage("Screens/MiniGame/HorseWalk/Carrot.png", HorseWalkCarrots[S].X - (HorseWalkCarrotsize / 2), HorseWalkCarrots[S].Y - (HorseWalkCarrotsize / 2));
}

// Loads the Horse Walk mini game
function HorseWalkLoad() {

	HorseWalkBackground = "HorseStable";

	// The higher the difficulty, the more Carrots there will be (less Carrots on mobile since we cannot swipe the mouse)
	HorseWalkPlayerX = 500;
	HorseWalkPlayerY = 0;
	var Factor = (CommonIsMobile) ? 0.25 : 1;
	var MaxCarrot = 22 * Factor;
	if (MiniGameDifficulty == "Normal") MaxCarrot = 36 * Factor;
	if (MiniGameDifficulty == "Hard") MaxCarrot = 50 * Factor;
	MiniGameTimer = CommonTime() + 60000;
	HorseWalkGenerateCarrots(MaxCarrot);

}

// Run the maid cleaning mini game
function HorseWalkRun() {

	// The game ends in victory if everything is clean or in defeat if the time runs out
	var Time = CommonTime();
	if (!MiniGameEnded && (HorseWalkCarrots.length == 0)) HorseWalkEnd(true);
	if (!MiniGameEnded && (Time >= MiniGameTimer)) HorseWalkEnd(false);
	if (Time >= MiniGameTimer + 5000) CommonDynamicFunction(MiniGameReturnFunction + "()");

	// Draw the player character, progress bar and text
	HorseWalkDoMove();
	DrawCharacter(Player, HorseWalkPlayerX, HorseWalkPlayerY, 0.4);
	HorseWalkDrawCarrots();
	if (!MiniGameEnded) DrawProgressBar(0, 950, 2000, 50, (MiniGameTimer - Time) / 600);
	else DrawRect(0, 950, 2000, 50, "white");
	if (Time < MiniGameTimer) DrawText(TextGet("HorsWalkSpots"), 1000, 977, "black", "white");
	else DrawText(TextGet(MiniGameVictory ? "Victory" : "Defeat"), 1000, 977, "black", "white");

}

// Ends the game and sends the result back to the screen
function HorseWalkEnd(Victory) {
	MiniGameVictory = Victory;
	MiniGameEnded = true;
	MiniGameTimer = CommonTime();
}

// When the user clicks in the maid cleaning mini game
function HorseWalkDoMove() {

	// If the position changed
	if (((HorseWalkPlayerX != MouseX - 100) || (HorseWalkPlayerY != MouseY - 100)) && (MouseX >= 0) && (MouseY >= 0)) {
		
		// Sets the player position		
		/*var HorseWalkPlayerXdiff = HorseWalkPlayerX - MouseX - 100;
		var HorseWalkPlayerYdiff = HorseWalkPlayerY - MouseY - 100;
		var HorseWalkPlayerFactor = Math.sqrt(Math.pow(HorseWalkPlayerXdiff, 2) + Math.pow(HorseWalkPlayerYdiff, 2));
		HorseWalkPlayerX = HorseWalkPlayerX + (HorseWalkPlayerFactor * HorseWalkPlayerXdiff);
		HorseWalkPlayerY = HorseWalkPlayerY + (HorseWalkPlayerFactor * HorseWalkPlayerYdiff);*/

		if ( HorseWalkPlayerX > (MouseX - 95) ) {
			HorseWalkPlayerX -= 5;
		} else if ( HorseWalkPlayerX < (MouseX - 105) ){
			HorseWalkPlayerX += 5;
		} else {
			HorseWalkPlayerX = MouseX - 100;
		}
		
		if ( HorseWalkPlayerY > (MouseY - 95) ) {
			HorseWalkPlayerY -= 5;
		} else if ( (HorseWalkPlayerY) < (MouseY - 105) ){
			HorseWalkPlayerY += 5;
		} else {
			HorseWalkPlayerY = MouseY - 100;
		}



		var Range = ((CommonIsMobile) ? (HorseWalkCarrotsize / 1.5) : (HorseWalkCarrotsize / 2));

		// If the game has started, we check the click position and remove a Carrot at that position
		if (!MiniGameEnded)
			for(var S = 0; S < HorseWalkCarrots.length; S++)
				if (((HorseWalkPlayerX+100) >= HorseWalkCarrots[S].X - Range) && ((HorseWalkPlayerX+100) <= HorseWalkCarrots[S].X + Range) && ((HorseWalkPlayerY+100) >= HorseWalkCarrots[S].Y - Range) && ((HorseWalkPlayerY+100) <= HorseWalkCarrots[S].Y + Range)) {
					if (HorseWalkCarrots[S].T == 1) HorseWalkCarrots.splice(S, 1);
					else HorseWalkCarrots[S].T--;
					return;
				}
		
	}

}

// On mobile, we need to move the player on click
function HorseWalkClick() {
	if (CommonIsMobile) HorseWalkDoMove();
}