"use strict";
var MaidDrinksBackground = "Bar";
var MaidDrinksCustomerLeft = null;
var MaidDrinksCustomerRight = null;
var MaidDrinksCustomerLeftTimer = -1;
var MaidDrinksCustomerRightTimer = -1;
var MaidDrinksCustomerLeftVisible = false;
var MaidDrinksCustomerRightVisible = false;
var MaidDrinksMaxSequence = 1000;
var MaidDrinksMove = [];
var MaidDrinksLastMoveType = -1;
var MaidDrinksLastMoveTypeTimer = -1;

// The game is played using the A, S, K & L keys
var MaidDrinksKeyUpper = [65, 83, 75, 76]; 
var MaidDrinksKeyLower = [97, 115, 107, 108];

// Generates a full sequence
function MaidDrinksGenerateMove(StartTime) {
	
	// Full the sequence
	var CurTimer = StartTime + 3000;
	var Seq = 0;
	MaidDrinksMove = [];
	while (Seq < MaidDrinksMaxSequence) {
		
		// Create a new move to do at a random position
		MaidDrinksMove[MaidDrinksMove.length] = { Type: Math.floor(Math.random() * 4), Time: CurTimer };
		CurTimer = CurTimer + Math.floor(Math.random() * 800) + 400;
		Seq++;
		
	}

}

// Loads the maid drinks mini game
function MaidDrinksLoad() {
	InventoryWear(Player, "WoodenMaidTrayFull", "ItemMisc");
	MaidDrinksCustomerLeftVisible = false;
	MaidDrinksCustomerLeftTimer = -1;
	MaidDrinksCustomerLeft = CharacterLoadNPC("NPC_Customer_Left");
	CharacterAppearanceFullRandom(MaidDrinksCustomerLeft);
	MaidDrinksCustomerRightVisible = false;
	MaidDrinksCustomerRightTimer = -1;
	MaidDrinksCustomerRight = CharacterLoadNPC("NPC_Customer_Right");
	CharacterAppearanceFullRandom(MaidDrinksCustomerRight);
	MaidDrinksGenerateMove(5000);
	if (MiniGameDifficulty == "Easy") MiniGameDifficultyRatio = 1.0;
	if (MiniGameDifficulty == "Normal") MiniGameDifficultyRatio = 1.5;
	if (MiniGameDifficulty == "Hard") MiniGameDifficultyRatio = 2.0;
}

// Draw the mini game icons
function MaidDrinksDrawIcons() {

	// Scroll the icons with time
	var Seq = 0;
	while (Seq < MaidDrinksMove.length) {

		// Draw the move from 3 seconds before to 1 second after
        if ((MaidDrinksMove[Seq].Time <= MiniGameTimer + 3000) && (MaidDrinksMove[Seq].Time >= MiniGameTimer - 1000))
            DrawImage("Screens/" + CurrentModule + "/" + CurrentScreen + "/Icon" + MaidDrinksMove[Seq].Type + ".png", 1200 + (MaidDrinksMove[Seq].Type * 200), 666 + Math.floor((MiniGameTimer - MaidDrinksMove[Seq].Time) / 4));

		// Remove the move from the sequence if it's past due
		if (MaidDrinksMove[Seq].Time < MiniGameTimer - 1000) {
			MaidDrinksMove.splice(Seq, 1);
			MaidDrinksMiss();
		}	
		else Seq = Seq + 1;
		
		// Beyond 3 seconds forward, we exit
		if (Seq < MaidDrinksMove.length)
			if (MaidDrinksMove[Seq].Time > MiniGameTimer + 3000)
				return;

	}

}

// Draw the bars to tell when the moves will hit
function MaidDrinksDrawBar(SquareType) {

	// The color changes when it's clicked or pressed
	DrawRect(1210 + (SquareType * 200), 750, 180, 50, "White");
	if ((MaidDrinksLastMoveType == SquareType) && (MaidDrinksLastMoveTypeTimer >= MiniGameTimer))
		DrawRect(1212 + (SquareType * 200), 752, 176, 46, "#66FF66");
	else
		DrawRect(1212 + (SquareType * 200), 752, 176, 46, "Red");
	if (!CommonIsMobile) DrawText(String.fromCharCode(MaidDrinksKeyUpper[SquareType]), 1300 + (SquareType * 200), 775, "white");

}

// Generates random customers for the mini game
function MaidDrinksCustomers() {
	
	// Manages the left customer
	if (MiniGameTimer >= MaidDrinksCustomerLeftTimer) {
		if (MaidDrinksCustomerLeftVisible == false) {
			MaidDrinksCustomerLeftVisible = true;
			MaidDrinksCustomerLeftTimer = MiniGameTimer + 6000 + Math.random() * 8000;
		} else {
			CharacterAppearanceFullRandom(MaidDrinksCustomerLeft);
			MaidDrinksCustomerLeftVisible = false;
			MaidDrinksCustomerLeftTimer = MiniGameTimer + 3000 + Math.random() * 4000;			
		}
	}

	// Manages the right customer
	if (MiniGameTimer >= MaidDrinksCustomerRightTimer) {
		if (MaidDrinksCustomerRightVisible == false) {
			MaidDrinksCustomerRightVisible = true;
			MaidDrinksCustomerRightTimer = MiniGameTimer + 6000 + Math.random() * 8000;
		} else {
			CharacterAppearanceFullRandom(MaidDrinksCustomerRight);
			MaidDrinksCustomerRightVisible = false;
			MaidDrinksCustomerRightTimer = MiniGameTimer + 3000 + Math.random() * 4000;			
		}
	}

}

// Run the maid drinks mini game
function MaidDrinksRun() {
	
	// Draw the characters
	if (MaidDrinksCustomerLeftVisible) DrawCharacter(MaidDrinksCustomerLeft, -50, 0, 1);
	if (MaidDrinksCustomerRightVisible) DrawCharacter(MaidDrinksCustomerRight, 750, 0, 1);
	DrawCharacter(Player, 350, 0, 1);
	DrawRect(1200, 0, 800, 1000, "Black");
	
	// Increments the timer (altered by the difficulty, the more difficult, the faster it goes)
	if (MiniGameTimer >= 5000) MiniGameTimer = MiniGameTimer + Math.round(TimerRunInterval * MiniGameDifficultyRatio);
	else MiniGameTimer = MiniGameTimer + Math.round(TimerRunInterval);
	
	// Starts the mini game at an even level
	if ((MiniGameProgress == -1) && (MiniGameTimer >= 5000))
		MiniGameProgress = 50;

	// Draw the mini game icons and rectangles
	MaidDrinksDrawBar(0);
	MaidDrinksDrawBar(1);
	MaidDrinksDrawBar(2);
	MaidDrinksDrawBar(3);
	
	// If there's no moves left, we full the move list again, there's no tie match
	if ((MaidDrinksMove.length == 0) && (!MiniGameEnded))
		MaidDrinksGenerateMove(MiniGameTimer);
	
	// Draw the mini game icons and bottom info when the game is running
	if (!MiniGameEnded) {
		if (MiniGameTimer >= 5000) {
			MaidDrinksCustomers();
			MaidDrinksDrawIcons();
			DrawProgressBar(1200, 975, 800, 25, MiniGameProgress);
		} 
		else {
			DrawText(TextGet("StartsIn") + " " + (5 - Math.floor(MiniGameTimer / 1000)).toString(), 1600, 910, "white");
			DrawText(TextGet("Difficulty") + " " + TextGet(MiniGameDifficulty), 1600, 955, "white");
		}
	}
	else {
		if ((MiniGameProgress >= 100) && MiniGamePerfect) DrawText(TextGet("Perfect"), 1600, 150, "white");
		if ((MiniGameProgress >= 100) && !MiniGamePerfect) DrawText(TextGet("Victory"), 1600, 150, "white");
		if (MiniGameProgress <= 0) DrawText(TextGet("Defeat"), 1600, 150, "white");
		DrawText(TextGet("ClickContinue"), 1600, 300, "white");
	}

}

// Ends the game and sends the result back to the screen
function MaidDrinksEnd(Victory) {
	MaidDrinksLastMoveType = -1;
	MaidDrinksCustomerLeft = null;
	MaidDrinksCustomerRight = null;
	InventoryWear(Player, "WoodenMaidTray", "ItemMisc");
	if (Victory) MiniGameProgress = 100;
	else MiniGameProgress = 0;
	MiniGameVictory = Victory;
	MiniGameEnded = true;
}

// When the player hits
function MaidDrinksHit() {
	MiniGameProgress = MiniGameProgress + 1;
	if (MiniGameProgress >= 100)
		MaidDrinksEnd(true);
}

// When the player misses (the penalty is greater on higher difficulties)
function MaidDrinksMiss() {
	MiniGamePerfect = false;
	if (MiniGameDifficulty == "Easy") MiniGameProgress = MiniGameProgress - 2;
	if (MiniGameDifficulty == "Normal") MiniGameProgress = MiniGameProgress - 3;
	if (MiniGameDifficulty == "Hard") MiniGameProgress = MiniGameProgress - 4;
	if (MiniGameProgress <= 0) MaidDrinksEnd(false);
}

// When the player tries a specific move type
function MaidDrinksDoMove(MoveType) {
	
	// Below zero is always a miss
	var Hit = false;
	if ((MoveType >= 0) && (MaidDrinksMove.length > 0)) {

		// For each moves in the list
		var Seq = 0;
		while (Seq < MaidDrinksMove.length) {
			
			// If the move connects (good timing and good type)
			if ((MaidDrinksMove[Seq].Time <= MiniGameTimer + 400) && (MaidDrinksMove[Seq].Time >= MiniGameTimer - 400) && (MoveType == MaidDrinksMove[Seq].Type)) {
				MaidDrinksMove.splice(Seq, 1);
				Hit = true;				
			} 
			else Seq++;

			// Beyond 0.5 seconds forward, we give up
			if (Seq < MaidDrinksMove.length)
				if (MaidDrinksMove[Seq].Time > MiniGameTimer + 400) 
					Seq = MaidDrinksMove.length;

		}
		
	}

	// Depending on hit or miss, we change the progress of the mini game
	MaidDrinksLastMoveType = MoveType;
	MaidDrinksLastMoveTypeTimer = MiniGameTimer + 200;
	if (Hit) MaidDrinksHit();
	else MaidDrinksMiss();

}

// When a key is pressed while in the mini game (for both keyboard and mobile)
function MaidDrinksKeyDown() {

	// If the game has started, we check the key pressed and send it as a move
	if ((MiniGameTimer > 5000) && (MiniGameProgress != -1) && !MiniGameEnded) {
		var MoveType = -1;
		if ((KeyPress == MaidDrinksKeyUpper[0]) || (KeyPress == MaidDrinksKeyLower[0])) MoveType = 0;
		if ((KeyPress == MaidDrinksKeyUpper[1]) || (KeyPress == MaidDrinksKeyLower[1])) MoveType = 1;
		if ((KeyPress == MaidDrinksKeyUpper[2]) || (KeyPress == MaidDrinksKeyLower[2])) MoveType = 2;
		if ((KeyPress == MaidDrinksKeyUpper[3]) || (KeyPress == MaidDrinksKeyLower[3])) MoveType = 3;
		MaidDrinksDoMove(MoveType);
	}
	
}

// When the user clicks in the maid drinks mini game (only works on mobile)
function MaidDrinksClick() {

	// If the game is over, clicking on the image will end it
	if (MiniGameEnded && (MouseX >= 350) && (MouseX <= 849) && (MouseY >= 0) && (MouseY <= 999))
		CommonDynamicFunction(MiniGameReturnFunction + "()");

	// If the game has started, we check the click position and send it as a move
	if ((MiniGameTimer > 5000) && (MiniGameProgress != -1) && !MiniGameEnded && CommonIsMobile) {
		var MoveType = -1;
		if ((MouseX >= 1200) && (MouseX < 1400) && (MouseY >= 700) && (MouseY <= 850)) MoveType = 0;
		if ((MouseX >= 1400) && (MouseX < 1600) && (MouseY >= 700) && (MouseY <= 850)) MoveType = 1;
		if ((MouseX >= 1600) && (MouseX < 1800) && (MouseY >= 700) && (MouseY <= 850)) MoveType = 2;
		if ((MouseX >= 1800) && (MouseX < 2000) && (MouseY >= 700) && (MouseY <= 850)) MoveType = 3;
		MaidDrinksDoMove(MoveType);
	}

}