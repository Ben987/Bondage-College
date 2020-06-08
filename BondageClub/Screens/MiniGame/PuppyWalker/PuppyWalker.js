"use strict";
var PuppyWalkerBackground = "Gardens";
var PuppyWalkerMoves = [0, 0, 0, 0];
var PuppyWalkerGenerateMoveTimer = 0;
var PuppyWalkerEscape = [0, 0, 0, 0];

// Loads the puppy walker mini game and sets the difficulty (a little faster on mobile)
function PuppyWalkerLoad() {
	PuppyWalkerGenerateMoveTimer = CurrentTime + 10000;
	PuppyWalkerEscape = [0, 0, 0, 0];
	MiniGameDifficultyRatio = 1000;
	if (CommonIsMobile) MiniGameDifficultyRatio = Math.round(MiniGameDifficultyRatio * 0.75);
}

// Runs the puppy walker mini game
function PuppyWalkerRun() {
	
	// Draw the characters
	DrawCharacter(DailyJobPuppy1, -50, 0, 1);
	DrawCharacter(DailyJobPuppy2, 350, 0, 1);
	DrawCharacter(Player, 750, 0, 1);
	DrawCharacter(DailyJobPuppy3, 1150, 0, 1);	
	DrawCharacter(DailyJobPuppy4, 1550, 0, 1);
	MiniGameTimer = MiniGameTimer + Math.round(TimerRunInterval);

	// If the mini game is running
	if (!MiniGameEnded) {

		// If we must draw the progress bars
		if (MiniGameProgress >= 0) {
			var Progress = 100;
			if (MiniGameTimer > 10000) Progress = (60 - ((MiniGameTimer - 10000) / 1000)) * 100 / 60
			DrawProgressBar(0, 950, 2000, 50, Progress);
		}
	
		// Draw the intro text in the bottom
		if (MiniGameProgress == -1) {
			DrawRect(0, 950, 2000, 50, "black");
			DrawText(TextGet("Intro").replace("StartTimer", (10 - Math.floor(MiniGameTimer / 1000)).toString()), 1000, 975, "white");
		}

		// Generates new moves if we need to
		if (PuppyWalkerGenerateMoveTimer < CurrentTime) {
			if (MiniGameProgress < 0) MiniGameProgress = 0;
			PuppyWalkerGenerateMoveTimer = PuppyWalkerGenerateMoveTimer + 100;
			for (var M = 0; M < PuppyWalkerMoves.length; M++) {
				if ((PuppyWalkerMoves[M] > 0) && (PuppyWalkerMoves[M] <= CurrentTime)) {
					PuppyWalkerEscape[M]++;
					PuppyWalkerMoves[M] = 0;
					PuppyWalkerVerifyEnd();
				}
				if ((PuppyWalkerMoves[M] <= CurrentTime) && (Math.random() >= 0.95))
					PuppyWalkerMoves[M] = CurrentTime + MiniGameDifficultyRatio;
			}
		}

		// Draws the move
		if (PuppyWalkerMoves[0] >= CurrentTime) DrawCircle(200, 500, 100, 25, "yellow");
		if (PuppyWalkerMoves[1] >= CurrentTime) DrawCircle(600, 500, 100, 25, "yellow");
		if (PuppyWalkerMoves[2] >= CurrentTime) DrawCircle(1400, 500, 100, 25, "yellow");
		if (PuppyWalkerMoves[3] >= CurrentTime) DrawCircle(1800, 500, 100, 25, "yellow");

	} else {

		// Draw the end message
		DrawRect(0, 950, 2000, 50, "black");
		if (MiniGameVictory && (PuppyWalkerEscape[0] + PuppyWalkerEscape[1] + PuppyWalkerEscape[2] + PuppyWalkerEscape[3] == 0)) DrawText(TextGet("Perfect"), 1000, 975, "white");
		else if (MiniGameVictory) DrawText(TextGet("Victory"), 1000, 975, "white");
		else DrawText(TextGet("Defeat"), 1000, 975, "white");

	}

}

// Validates if the mini game must end
function PuppyWalkerVerifyEnd() {
	if (MiniGameProgress >= 100) {
		MiniGameVictory = true;
		MiniGameEnded = true;
		MiniGameProgress = 100;
	}
	if ((PuppyWalkerEscape[0] >= 3) || (PuppyWalkerEscape[1] >= 3) || (PuppyWalkerEscape[2] >= 3) || (PuppyWalkerEscape[3] >= 3)) {
		MiniGameVictory = false;
		MiniGameEnded = true;
	}
}

// When a move is done, we validate it
function PuppyWalkerDoMove(MoveType) {

	// Checks if the move is valid
	if ((MoveType >= 0) && (PuppyWalkerMoves[MoveType] >= CurrentTime))
		PuppyWalkerMoves[MoveType] = 0;
	else 
		PuppyWalkerEscape[MoveType]++;
	PuppyWalkerVerifyEnd();

}

// When the user clicks in the puppy walker mini game
function PuppyWalkerClick() {

	// If the game is over, clicking on the image will end it
	if (MiniGameEnded && (MouseX >= 800) && (MouseX <= 1200) && (MouseY >= 0) && (MouseY <= 999))
		CommonDynamicFunction(MiniGameReturnFunction + "()");

	// If the game has started, we check the click position and send it as a move
	if ((MiniGameTimer > 5000) && (MouseX >= 1000) && (MiniGameProgress != -1) && !MiniGameEnded) {

		// Gets the move type and sends it
		if ((MouseX >= 100) && (MouseX <= 300) && (MouseY >= 400) && (MouseY <= 600)) PuppyWalkerDoMove(0);
		if ((MouseX >= 500) && (MouseX <= 300) && (MouseY >= 400) && (MouseY <= 600)) PuppyWalkerDoMove(1);
		if ((MouseX >= 1300) && (MouseX <= 1500) && (MouseY >= 400) && (MouseY <= 600)) PuppyWalkerDoMove(2);
		if ((MouseX >= 1700) && (MouseX <= 1900) && (MouseY >= 400) && (MouseY <= 600)) PuppyWalkerDoMove(3);

	}

}