"use strict";
var TennisBackground = "CollegeTennisPlay";
var TennisCharacterLeft = null;
var TennisCharacterRight = null;
var TennisCharacterLeftPoint = 0;
var TennisCharacterRightPoint = 0;
var TennisCharacterLeftRacket = 500;
var TennisCharacterRightRacket = 500;
var TennisBallX = 1000;
var TennisBallY = 500;
var TennisBallSpeed = 100;
/** Angle of the ball.  Angle is in radians (0 is right, PI / 2 is up, PI is left, 3 PI / 2 is down)*/
var TennisBallAngle = 0;

/**
 * Called when a player servers, the angle can vary by 45 degrees up or down
 * @param {number} CharacterLeftServe - Ball angle given for the serve
 * @returns {void} - Nothing
 */
function TennisServe(CharacterLeftServe) {
	TennisBallSpeed = 120;
	if (MiniGameDifficulty == "Normal") TennisBallSpeed = 180;
	if (MiniGameDifficulty == "Hard") TennisBallSpeed = 240;
	TennisBallAngle = (CharacterLeftServe ? 0 : Math.PI) - (Math.PI * 0.25) + (Math.PI * 0.5 * Math.random());
	TennisBallX = CharacterLeftServe ? 600 : 1400;
	TennisBallY = 500;
}

/**
 * Gets the current score/status of the game
 * @param {number} PointFor - Point of the player
 * @param {number} PointAgainst - Point of the NPC
 * @returns {string} - Score in text, or current status (Win, loss, advantage)
 */
function TennisGetScore(PointFor, PointAgainst) {
	if (PointFor + PointAgainst >= 6) {
		if (PointFor >= PointAgainst + 2) return TextGet("Winner");
		if (PointFor >= PointAgainst + 1) return TextGet("Advantage");
		if (PointFor == PointAgainst) return TextGet("Deuce");
		return "";
	}
	if (PointFor >= 4) return TextGet("Winner");
	else return TextGet("Point" + PointFor.toString());
}

/**
 * Loads the tennis mini game and sets the difficulty ratio before serving the first ball
 * @returns {void} - Nothing
 */
function TennisLoad() {
	TennisCharacterLeftPoint = 0;
	TennisCharacterRightPoint = 0;
	TennisCharacterLeftRacket = 500;
	TennisCharacterRightRacket = 500;
	MiniGameDifficultyRatio = 100;
	if (MiniGameDifficulty == "Normal") MiniGameDifficultyRatio = 175;
	if (MiniGameDifficulty == "Hard") MiniGameDifficultyRatio = 250;
	TennisServe(Math.random() > 0.5);
}

/**
 * Runs the tennis mini game and draws its components on screen
 * @returns {void} - Nothing
 */
function TennisRun() {
	
	// Draw the characters
	DrawCharacter(TennisCharacterLeft, 0, 100, 0.9);
	DrawText(TennisCharacterLeft.Name, 225, 30, "white");
	DrawText(TennisGetScore(TennisCharacterLeftPoint, TennisCharacterRightPoint), 225, 80, "white");
	DrawCharacter(TennisCharacterRight, 1550, 100, 0.9);
	DrawText(TennisCharacterRight.Name, 1775, 30, "white");
	DrawText(TennisGetScore(TennisCharacterRightPoint, TennisCharacterLeftPoint), 1775, 80, "white");
	MiniGameTimer = MiniGameTimer + Math.round(TimerRunInterval);

	// If the mini game is running
	if (!MiniGameEnded) {

		// Sets the new progress
		if (MiniGameTimer >= 5000) MiniGameProgress = 0;

		// Draw the intro text or progress bar
		if (MiniGameProgress == -1) {
			DrawText(TextGet("Intro1"), 1000, 400, "black");
			DrawText(TextGet("Intro2"), 1000, 500, "black");
			DrawText(TextGet("StartsIn") + " " + (5 - Math.floor(MiniGameTimer / 1000)).toString(), 1000, 600, "black");
		} else {
			
			// Moves the ball
			TennisBallX += Math.cos(TennisBallAngle) * (TennisBallSpeed / 20) * (TimerRunInterval / 16.6667);
			TennisBallY -= Math.sin(TennisBallAngle) * (TennisBallSpeed / 20) * (TimerRunInterval / 16.6667);
			
			// Moves the player and opponent racket, the opponent speeds up with difficulty, tracks the ball in defense, go back toward the middle in offense
			if ((MouseY >= 0) && (MouseY <= 999)) TennisCharacterLeftRacket = MouseY;
			if ((Math.cos(TennisBallAngle) > 0) && (TennisBallY > TennisCharacterRightRacket + 55)) TennisCharacterRightRacket = TennisCharacterRightRacket + (MiniGameDifficultyRatio / TimerRunInterval);
			if ((Math.cos(TennisBallAngle) > 0) && (TennisBallY < TennisCharacterRightRacket - 55)) TennisCharacterRightRacket = TennisCharacterRightRacket - (MiniGameDifficultyRatio / TimerRunInterval);
			if ((Math.cos(TennisBallAngle) < 0) && (TennisCharacterRightRacket < 450)) TennisCharacterRightRacket = TennisCharacterRightRacket + (MiniGameDifficultyRatio / TimerRunInterval);
			if ((Math.cos(TennisBallAngle) < 0) && (TennisCharacterRightRacket > 550)) TennisCharacterRightRacket = TennisCharacterRightRacket - (MiniGameDifficultyRatio / TimerRunInterval);

			// Bounces on the upper and lower side
			if (TennisBallY < 20) {
				TennisBallY = 20 + (20 - TennisBallY);
				TennisBallAngle = Math.PI + Math.acos((Math.cos(TennisBallAngle) * -1));
			}
			if (TennisBallY > 980) {
				TennisBallY = 980 - (TennisBallY - 980);
				TennisBallAngle = Math.PI - Math.acos((Math.cos(TennisBallAngle) * -1));
			}

			// If the racket hits the ball, we bounce it at an angle linked to the racket vs ball Y position
			if ((Math.cos(TennisBallAngle) < 0) && (TennisBallX >= 500) && (TennisBallX <= 550) && (TennisBallY >= TennisCharacterLeftRacket - 110) && (TennisBallY <= TennisCharacterLeftRacket + 110)) {
				TennisBallAngle = (Math.PI * 0.4 * ((TennisCharacterLeftRacket - TennisBallY) / 110));
				TennisBallSpeed = TennisBallSpeed + 20;
			}
			if ((Math.cos(TennisBallAngle) > 0) && (TennisBallX >= 1450) && (TennisBallX <= 1500) && (TennisBallY >= TennisCharacterRightRacket - 110) && (TennisBallY <= TennisCharacterRightRacket + 110)) {
				TennisBallAngle = Math.PI + (Math.PI * 0.4 * ((TennisBallY - TennisCharacterRightRacket) / 110));
				TennisBallSpeed = TennisBallSpeed + 20;
			}
			
			// Shows the rackets and ball
			DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/RacketLeft.png", 500, TennisCharacterLeftRacket - 75);
			DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/RacketRight.png", 1450, TennisCharacterRightRacket - 75);
			DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/TennisBall.png", TennisBallX - 20, TennisBallY - 20);
			
			// If the opponent scores
			if (TennisBallX < 450) {
				MiniGameProgress = -1;
				MiniGameTimer = 2000;
				TennisServe(true);
				TennisCharacterRightPoint++;
				if ((TennisCharacterRightPoint >= 4) && (TennisCharacterRightPoint >= TennisCharacterLeftPoint + 2)) {
					MiniGameVictory = false;
					MiniGameEnded = true;
				}
			}

			// If the player scores
			if (TennisBallX > 1550) {
				MiniGameProgress = -1;
				MiniGameTimer = 2000;
				TennisServe(false);
				TennisCharacterLeftPoint++;
				if ((TennisCharacterLeftPoint >= 4) && (TennisCharacterLeftPoint >= TennisCharacterRightPoint + 2)) {
					MiniGameVictory = true;
					MiniGameEnded = true;
				}
			}
			
		}

	} else {
		
		// Draw the end message
		if (MiniGameVictory && (TennisCharacterRightPoint == 0)) DrawText(TextGet("Perfect"), 1000, 400, "black");
		else if (MiniGameVictory) DrawText(TextGet("Victory"), 1000, 400, "black");
		else DrawText(TextGet("Defeat"), 1000, 400, "black");
		DrawText(TextGet("ClickContinue"), 1000, 600, "black");

	}

}

/**
 * Checks if the tennis game should end. The tennis game ends when a player has 4 or more points, and is leading by at least 2 points
 * @returns {void} - Nothing
 */
function TennisVerifyEnd() {
	if ((TennisCharacterLeftPoint >= 4) && (TennisCharacterLeftPoint >= TennisCharacterRightPoint + 2)) {
		MiniGameVictory = true;
		MiniGameEnded = true;
	}
}

/**
 * Handles clicks during the tennis mini game
 * @returns {void} - Nothing
 */
function TennisClick() {

	// If the game is over, clicking on the player image will end it
	if (MiniGameEnded && (MouseX >= 0) && (MouseX <= 450) && (MouseY >= 100) && (MouseY <= 999))
		CommonDynamicFunction(MiniGameReturnFunction + "()");

}
