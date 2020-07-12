"use strict";
var PuppyWalkerBackground = "Gardens";
var PuppyWalkerMoves = [0, 0, 0, 0];
var PuppyWalkerMovesTimer = [0, 0, 0, 0];
var PuppyWalkerEscape = [0, 0, 0, 0];
var PuppyWalkerGenerateMoveTimer = 0;

// Loads the puppy walker mini game and sets the difficulty (a little faster on mobile)
function PuppyWalkerLoad() {
	PuppyWalkerMoves = [0, 0, 0, 0];
	PuppyWalkerEscape = [0, 0, 0, 0];
	PuppyWalkerMovesTimer = [0, 0, 0, 0];
	PuppyWalkerGenerateMoveTimer = CurrentTime + 10000;
	MiniGameDifficultyRatio = 1600;
	if (CommonIsMobile) MiniGameDifficultyRatio = Math.round(MiniGameDifficultyRatio * 0.75);
}

// Draws on the puppy girl if she hasn't escaped
function PuppyWalkerDraw(Puppy, X, Fail) {
	if (Fail < 3) DrawCharacter(Puppy, X, 0, 1);
	DrawImage("Screens/MiniGame/PuppyWalker/" + ((Fail <= 0) ? "Success" : "Fail") + ".png", X + 60, 100);
	DrawImage("Screens/MiniGame/PuppyWalker/" + ((Fail <= 1) ? "Success" : "Fail") + ".png", X + 190, 100);
	DrawImage("Screens/MiniGame/PuppyWalker/" + ((Fail <= 2) ? "Success" : "Fail") + ".png", X + 320, 100);
}

// Runs the puppy walker mini game
function PuppyWalkerRun() {
	
	// Draw the characters
	PuppyWalkerDraw(DailyJobPuppy1, -50, PuppyWalkerEscape[0]);
	PuppyWalkerDraw(DailyJobPuppy2, 350, PuppyWalkerEscape[1]);
	DrawCharacter(Player, 750, 0, 1);
	PuppyWalkerDraw(DailyJobPuppy3, 1150, PuppyWalkerEscape[2]);
	PuppyWalkerDraw(DailyJobPuppy4, 1550, PuppyWalkerEscape[3]);
	MiniGameTimer = MiniGameTimer + Math.round(TimerRunInterval);

	// Shows the intro text before the mini game begins
	if (MiniGameTimer < 10000) {
		DrawRect(0, 950, 2000, 50, "black");
		DrawText(TextGet("Intro").replace("StartTimer", (10 - Math.floor(MiniGameTimer / 1000)).toString()), 1000, 975, "white");
		return;
	}
	
	// If the mini game is running
	if (!MiniGameEnded) {

		// Draws the progress bar based on the timer
		var Progress = 100;
		if (MiniGameTimer > 10000) Progress = (60 - ((MiniGameTimer - 10000) / 1000)) * 100 / 60
		DrawProgressBar(0, 950, 2000, 50, Progress);

		// If the mini-game is running
		if (PuppyWalkerGenerateMoveTimer < CurrentTime) {

			// Ends moves and generates new moves if we need to
			PuppyWalkerGenerateMoveTimer = PuppyWalkerGenerateMoveTimer + 100;
			for (var M = 0; M < PuppyWalkerMoves.length; M++) {
				if ((PuppyWalkerMoves[M] > 0) && (PuppyWalkerMoves[M] <= CurrentTime))
					PuppyWalkerDoMove(M);
				if ((PuppyWalkerMoves[M] <= CurrentTime) && (PuppyWalkerMovesTimer[M] < CurrentTime) && (Math.random() >= 0.95))
					PuppyWalkerMoves[M] = CurrentTime + MiniGameDifficultyRatio;
			}

		}

		// Draws the move & checks if the game must end
		if (PuppyWalkerMoves[0] >= CurrentTime) DrawCircle(200, 500, 100, 25, "yellow");
		if (PuppyWalkerMoves[1] >= CurrentTime) DrawCircle(600, 500, 100, 25, "yellow");
		if (PuppyWalkerMoves[2] >= CurrentTime) DrawCircle(1400, 500, 100, 25, "yellow");
		if (PuppyWalkerMoves[3] >= CurrentTime) DrawCircle(1800, 500, 100, 25, "yellow");
		PuppyWalkerVerifyEnd();

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
	if ((PuppyWalkerEscape[0] >= 3) || (PuppyWalkerEscape[1] >= 3) || (PuppyWalkerEscape[2] >= 3) || (PuppyWalkerEscape[3] >= 3)) {
		MiniGameVictory = false;
		MiniGameEnded = true;
	}
	if (!MiniGameEnded && (MiniGameTimer >= 70000)) {
		MiniGameVictory = true;
		MiniGameEnded = true;
	}
}

// When a move is done, we validate it and raise the escape counter if not
function PuppyWalkerDoMove(MoveType) {
	if (PuppyWalkerMoves[MoveType] <= CurrentTime) PuppyWalkerEscape[MoveType]++;
	PuppyWalkerMoves[MoveType] = 0;
	PuppyWalkerMovesTimer[MoveType] = CurrentTime + (MiniGameDifficultyRatio * 0.5);
	PuppyWalkerVerifyEnd();
}

// When the user clicks in the puppy walker mini game
function PuppyWalkerClick() {

	// If the game is over, clicking on the image will end it
	if (MiniGameEnded && (MouseX >= 800) && (MouseX <= 1200) && (MouseY >= 0) && (MouseY <= 999))
		CommonDynamicFunction(MiniGameReturnFunction + "()");

	// If the game has started, we check the click position and send it as a move
	if ((MiniGameTimer > 10000) && (MouseY >= 350) && (MouseY <= 650) && !MiniGameEnded) {
		if ((MouseX >= 50) && (MouseX <= 350)) PuppyWalkerDoMove(0);
		if ((MouseX >= 450) && (MouseX <= 750)) PuppyWalkerDoMove(1);
		if ((MouseX >= 1250) && (MouseX <= 1550)) PuppyWalkerDoMove(2);
		if ((MouseX >= 1650) && (MouseX <= 1950)) PuppyWalkerDoMove(3);
	}

}