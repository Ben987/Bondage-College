"use strict";
var MaidCleaningBackground = "";
var MaidCleaningSpots = null;
var MaidCleaningPlayerX = 0;
var MaidCleaningPlayerY = 0;
var MaidCleaningSpotSize = 100;

/**
 * Generates all the spots to clean for the main cleaning minigame
 * @param {number} MaxSpot - Maximum amount of spots to generate
 * @returns {void} - Nothing
 */
function MaidCleaningGenerateSpots(MaxSpot) {

	// Full the spots sequence
	MaidCleaningSpots = [];
	for (let S = 0; S < MaxSpot; S++) {

		// Generates each spot 1 by 1
		var NewSpot = {
			X : Math.floor(Math.random() * 1980) + 10,
			Y : Math.floor(Math.random() * 940) + 10,
			T : Math.floor(Math.random() * 4) + 1
		}
		MaidCleaningSpots.push(NewSpot);

	}

}

/**
 * Draw the cleaning spots for the maid cleaning mini game
 * @returns {void} - Nothing
 */
function MaidCleaningDrawSpots() {
	for (let S = 0; S < MaidCleaningSpots.length; S++)
		DrawImage("Screens/MiniGame/MaidCleaning/Spot" + MaidCleaningSpots[S].T + ".png", MaidCleaningSpots[S].X - (MaidCleaningSpotSize / 2), MaidCleaningSpots[S].Y - (MaidCleaningSpotSize / 2));
}

/**
 * Loads the maid cleaning mini game. It will select a random background and generate spots based on the difficulty
 * @returns {void} - Nothing
 */
function MaidCleaningLoad() {

	// Picks a random place to clean
	var Room = Math.floor(Math.random() * 6);
	if (Room == 0) MaidCleaningBackground = "MainHall";
	if (Room == 1) MaidCleaningBackground = "Shibari";
	if (Room == 2) MaidCleaningBackground = "Shop";
	if (Room == 3) MaidCleaningBackground = "Introduction";
	if (Room == 4) MaidCleaningBackground = "Dressing";
	if (Room == 5) MaidCleaningBackground = "KidnapLeague";

	// The higher the difficulty, the more spots there will be (less spots on mobile since we cannot swipe the mouse)
	MaidCleaningPlayerX = 500;
	MaidCleaningPlayerY = 0;
	var Factor = (CommonIsMobile) ? 0.25 : 1;
	var MaxSpot = 220 * Factor;
	if (MiniGameDifficulty == "Normal") MaxSpot = 360 * Factor;
	if (MiniGameDifficulty == "Hard") MaxSpot = 500 * Factor;
	MiniGameTimer = CommonTime() + 60000;
	MaidCleaningGenerateSpots(MaxSpot);

}

/**
 * Runs the maid cleaning mini game
 * @returns {void} - Nothing
 */
function MaidCleaningRun() {

	// The game ends in victory if everything is clean or in defeat if the time runs out
	var Time = CommonTime();
	if (!MiniGameEnded && (MaidCleaningSpots.length == 0)) MaidCleaningEnd(true);
	if (!MiniGameEnded && (Time >= MiniGameTimer)) MaidCleaningEnd(false);
	if (Time >= MiniGameTimer + 5000) CommonDynamicFunction(MiniGameReturnFunction + "()");

	// Draw the player character, progress bar and text
	MaidCleaningDoMove();
	DrawCharacter(Player, MaidCleaningPlayerX, MaidCleaningPlayerY, 2, false);
	MaidCleaningDrawSpots();
	if (!MiniGameEnded) DrawProgressBar(0, 950, 2000, 50, (MiniGameTimer - Time) / 600);
	else DrawRect(0, 950, 2000, 50, "white");
	if (Time < MiniGameTimer) DrawText(TextGet("CleanDirtySpots"), 1000, 977, "black", "white");
	else DrawText(TextGet(MiniGameVictory ? "Victory" : "Defeat"), 1000, 977, "black", "white");

}

/**
 * Ends the game and sends the result back to the screen
 * @param {boolean} Victory - Whether or not the game was won
 * @returns {void} - Nothing
 */
function MaidCleaningEnd(Victory) {
	MiniGameVictory = Victory;
	MiniGameEnded = true;
	MiniGameTimer = CommonTime();
}

/**
 * Handles moving the player on the screen with a click, used for mobile users
 * @returns {void} - Nothing
 */
function MaidCleaningDoMove() {

	// If the position changed
	if (((MaidCleaningPlayerX != MouseX - 500) || (MaidCleaningPlayerY != MouseY - 500)) && (MouseX >= 0) && (MouseY >= 0)) {
		
		// Sets the player position		
		MaidCleaningPlayerX = MouseX - 500;
		MaidCleaningPlayerY = MouseY - 500;
		var Range = ((CommonIsMobile) ? (MaidCleaningSpotSize / 1.5) : (MaidCleaningSpotSize / 2));

		// If the game has started, we check the click position and remove a spot at that position
		if (!MiniGameEnded)
			for (let S = 0; S < MaidCleaningSpots.length; S++)
				if ((MouseX >= MaidCleaningSpots[S].X - Range) && (MouseX <= MaidCleaningSpots[S].X + Range) && (MouseY >= MaidCleaningSpots[S].Y - Range) && (MouseY <= MaidCleaningSpots[S].Y + Range)) {
					if (MaidCleaningSpots[S].T == 1) MaidCleaningSpots.splice(S, 1);
					else MaidCleaningSpots[S].T--;
					return;
				}
		
	}

}

/**
 * Handles clicks during the maid cleaning minigame. On mobile, we need to move the player on a click.
 */
function MaidCleaningClick() {
	if (CommonIsMobile) MaidCleaningDoMove();
}