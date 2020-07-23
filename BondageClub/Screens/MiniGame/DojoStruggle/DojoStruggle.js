"use strict";
var DojoStruggleBackground = "Shibari";
var DojoStrugglePosition = 450;
var DojoStruggleImpulse = 0;
var DojoStruggleRope = [];

/**
 * Loads the dojo struggle mini game and prepare the rope walls
 * @returns {void} - Nothing
 */
function DojoStruggleLoad() {
	DojoStrugglePosition = 450;
	if (MiniGameProgress < 0) MiniGameProgress = 0;
	DojoStruggleRope = [];
	for (var P = 0; P < 25; P++)
		DojoStruggleRope.push(Math.floor(Math.random() * 651) + 175);
}

/**
 * Runs the dojo struggle mini game and draws the relevant information on screen
 * @returns {void} - Nothing
 */
function DojoStruggleRun() {

	// Draw the character
	DrawCharacter(Player, 850, -400, 3, false);
	MiniGameTimer = MiniGameTimer + Math.round(TimerRunInterval);

	// Draw the check boxes to show the number of tries
	DrawImage("Screens/MiniGame/DojoStruggle/" + ((MiniGameProgress <= 0) ? "Success" : "Fail") + ".png", 1875, 250);
	DrawImage("Screens/MiniGame/DojoStruggle/" + ((MiniGameProgress <= 1) ? "Success" : "Fail") + ".png", 1875, 400);
	DrawImage("Screens/MiniGame/DojoStruggle/" + ((MiniGameProgress <= 2) ? "Success" : "Fail") + ".png", 1875, 550);

	// If the mini game is running
	if (!MiniGameEnded && (MiniGameTimer >= 5000)) {

		// The game ends after 71 seconds with a victory
		if (MiniGameTimer >= 71000) {
			CharacterRelease(Player);
			MiniGameVictory = true;
			MiniGameEnded = true;
		} else {

			// Applies gravity & impulse on the rope
			DojoStrugglePosition = DojoStrugglePosition + (TimerRunInterval - DojoStruggleImpulse) * 0.43;
			DojoStruggleImpulse = DojoStruggleImpulse - TimerRunInterval * 0.43;
			if (DojoStruggleImpulse < 0) DojoStruggleImpulse = 0;
			if (DojoStrugglePosition < 25) DojoStrugglePosition = 25;
			if (DojoStrugglePosition > 975) DojoStrugglePosition = 975;

			// Draw the obstacles
			var C = 25;
			for (var P = 0; P < 25; P++) {
				var X = 1000 + (P * 500) + ((5000 - MiniGameTimer) / 5);
				if (X < 150) C--;
				if ((X > 0) && (X < 1200) && (DojoStruggleRope[P] > 150)) DrawImageZoomCanvas("Screens/MiniGame/DojoStruggle/RopeVertical.png", MainCanvas, 0, 0, 50, DojoStruggleRope[P] - 150, X, 0, 50, DojoStruggleRope[P] - 150);
				if ((X > 0) && (X < 1200) && (DojoStruggleRope[P] < 850)) DrawImageZoomCanvas("Screens/MiniGame/DojoStruggle/RopeVertical.png", MainCanvas, 0, 0, 50, 900, X, DojoStruggleRope[P] + 150, 50, 900);
				if ((X >= 200) && (X <= 250) && ((DojoStrugglePosition < DojoStruggleRope[P] - 125) || (DojoStrugglePosition > DojoStruggleRope[P] + 125))) {

					// When the player rope hits another rope, it resets the game 3 times before failing
					MiniGameTimer = 0;
					MiniGameProgress++;
					DojoStruggleLoad();
					if (MiniGameProgress >= 3) {
						MiniGameVictory = false;
						MiniGameEnded = true;
					}

				}
			}

			// Draw the number of ropes left
			DrawText(C.toString(), 50, 50, "White", "Black");

		}

	}

	// Draw the player rope
	DrawImage("Screens/MiniGame/DojoStruggle/RopeHorizontal.png", 0, DojoStrugglePosition - 25);

	// Shows the intro text before the mini game begins
	if (MiniGameTimer < 5000) {
		DrawRect(0, 950, 2000, 50, "black");
		DrawText(TextGet("Intro").replace("StartTimer", (5 - Math.floor(MiniGameTimer / 1000)).toString()), 1000, 975, "white");
	}

	// Draw the end message when the game is over
	if (MiniGameEnded) {
		DrawRect(0, 950, 2000, 50, "black");
		if (MiniGameVictory && (MiniGameProgress == 0)) DrawText(TextGet("Perfect"), 1000, 975, "white");
		else if (MiniGameVictory) DrawText(TextGet("Victory"), 1000, 975, "white");
		else DrawText(TextGet("Defeat"), 1000, 975, "white");
	}

}

/**
 * Handles clicks during the dojo struggle mini game
 * @returns {void} - Nothing
 */
function DojoStruggleClick() {

	// If the game is over, clicking on the image will end it
	if (MiniGameEnded && (MouseX >= 1250))
		CommonDynamicFunction(MiniGameReturnFunction + "()");

	// If the game has started, we check the click position and send it as a move
	if ((MiniGameTimer > 5000) && (MouseX <= 1250) && !MiniGameEnded)
		DojoStruggleImpulse = 86;

}

/**
 * Handles key presses during the dojo struggle mini game. A space bar is handled just like a click is.
 * @returns {void} - Nothing
 */
function DojoStruggleKeyDown() {
	if (!MiniGameEnded && (KeyPress == 32))
		DojoStruggleImpulse = 86;
}