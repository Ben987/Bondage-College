// Fight parameters
var MaxFightSequence = 500;
var FightProgress = -1;
var FightTimer = 0;
var FightMove = [];
var FightAnim;
var FightAnimFrom = 0;
var FightAnimTo = 1;
var FightAnimImage = 2;
var FightEnded = false;
var FightEndScreen = "";
var FightIcon;
var FightDifficultyRatio = 1;
var FightDifficultyText = "";
var FightPerfect = true;
var FightSkillBonus = 0;

// Fighting is done using the A, S, K, L keys
var FightMoveTypeKeyUpper = [65, 83, 75, 76]; 
var FightMoveTypeKeyLower = [97, 115, 107, 108];

// Generates a full fight sequence
function GenerateFightSequence(FightStartTime) {
	
	// Full the fight sequence
	var CurTimer = FightStartTime + 3000;
	var Seq = 0;
	FightMoves = [];
	while (Seq < MaxFightSequence) {
		
		// Create a new fight move to do at a random position
		FightMoves[FightMoves.length] = [Math.floor(Math.random() * 4), CurTimer];
		CurTimer = CurTimer + Math.floor(Math.random() * 800) + 400;
		Seq++;
		
	}

}

// Load the fight animations and full sequence
function LoadFight(EndScreen, DifficultyText, IconImage, SkillBonus) {
	
	// Creates a brand new fight with the current screen animations
	LeaveIcon = "";
	LastMoveType = -1;
	FightProgress = -1;
	FightTimer = 0;
	FightEnded = false;	
	FightAnim = null;
	FightEndScreen = EndScreen;
    FightIcon = IconImage;
	FightSkillBonus = SkillBonus;
	FightPerfect = true;
	ReadCSV("FightAnim", CurrentChapter, CurrentScreen, "Fight");
	LoadText();
	GenerateFightSequence(5000);

	// 1 is the regular difficulty, the higher it goes, the harder it gets
	FightDifficultyText = DifficultyText;	
	FightDifficultyRatio = 1;
	if (FightDifficultyText == "Easy") FightDifficultyRatio = 0.6667;
	if (FightDifficultyText == "Hard") FightDifficultyRatio = 1.6667;

}

// Find the image file related to the current fight progress
function FindFightImage() {

	// The image is found within the from and to columns
	for (var A = 1; A < FightAnim.length; A++)
		if ((FightAnim[A][FightAnimFrom] <= FightProgress) && (FightAnim[A][FightAnimTo] >= FightProgress))
			return FightAnim[A][FightAnimImage];
	return "";

}

// Draw the fight icons
function DrawFightIcons() {

	// Scroll the fight icons with time
	var Seq = 0;
	while (Seq < FightMoves.length) {

		// Draw the move from 3 seconds before to 1 second after
        var currentIconTime = FightMoves[Seq][FightMoveTime];
        var currentIconType = FightMoves[Seq][FightMoveType];
        if ((currentIconTime <= FightTimer + 3000) && (currentIconTime >= FightTimer - 1000))
            DrawImage(FightIcon, 812 + (currentIconType * 100), 410 + Math.floor((FightTimer - currentIconTime) / 6));

		// Remove the move from the sequence if it's past due
		if (FightMoves[Seq][FightMoveTime] < FightTimer - 1000) {
			FightMoves.splice(Seq, 1);
			FightMiss();
		}	
		else Seq = Seq + 1;	
		
		// Beyond 3 seconds forward, we exit
		if (Seq < FightMoves.length)
			if (FightMoves[Seq][FightMoveTime] > FightTimer + 3000)
				return;

	}

}

// Draw the fight bars to tell when the moves will hit
function DrawFightBar(SquareType) {

	// The color changes when it's clicked or pressed
	DrawRect(810 + (SquareType * 100), 437, 80, 27, "White");
	if ((LastMoveType == SquareType) && (LastMoveTypeTimer >= FightTimer))
		DrawRect(811 + (SquareType * 100), 438, 78, 25, "#66FF66");
	else
		DrawRect(811 + (SquareType * 100), 438, 78, 25, "Red");
	if (!IsMobile) DrawText(String.fromCharCode(FightMoveTypeKeyUpper[SquareType]), 850 + (SquareType * 100), 451, "white");
	
}

// Draw the fight progress in the bottom of the fight scene
function DrawFightProgress() {
	DrawRect(800, 590, 400, 1, "white");
	DrawRect(800, 591, FightProgress * 4, 9, "#66FF66");
	DrawRect(800 + (FightProgress * 4), 591, (100 - FightProgress) * 4, 9, "red");
}

// Render the fight scene
function RenderFight() {

	// Make sure the CSV files for animation is loaded
	if (FightAnim != null) {
		
		// Increments the fight timer (altered by the difficulty, the more difficult, the faster it goes)
		if (FightTimer >= 5000) FightTimer = FightTimer + Math.round(RunInterval * FightDifficultyRatio);
		else FightTimer = FightTimer + Math.round(RunInterval);
		
		// Starts the fight at an even level
		if ((FightProgress == -1) && (FightTimer >= 5000))
			FightProgress = 50;

		// Paints the background depending on the current fight progress
		DrawImage(CurrentChapter + "/" + CurrentScreen + "/" + FindFightImage(), 0, 0);
		DrawRect(800, 0, 400, 600, "Black");
		
		// Draw the fight icons and rectangles
		DrawFightBar(0);
		DrawFightBar(1);
		DrawFightBar(2);
		DrawFightBar(3);
		
		// If there's no moves left, we full the move list again, there's no tie match
		if ((FightMoves.length == 0) && (!FightEnded))
			GenerateFightSequence(FightTimer);
		
		// Draw the fight icons and bottom info when the fight is running
		if (!FightEnded) {
			if (FightTimer >= 5000) {
				DrawFightIcons();
				DrawFightProgress();
			} 
			else {
				DrawText(GetText("StartsIn") + " " + (5 - Math.floor(FightTimer / 1000)).toString(), 1000, 510, "white");
				DrawText(GetText("Difficulty") + " " + GetText(FightDifficultyText), 1000, 555, "white");
			}
		}
		else {
			if ((FightProgress >= 100) && FightPerfect) DrawText(GetText("Perfect"), 1000, 150, "white");
			if ((FightProgress >= 100) && !FightPerfect) DrawText(GetText("Victory"), 1000, 150, "white");
			if (FightProgress <= 0) DrawText(GetText("Defeat"), 1000, 150, "white");
			DrawText(GetText("ClickContinue"), 1000, 300, "white");
		}

	}

}

// Ends the fight and sends the result back to the screen
function FightEnd(Victory) {
	if (Victory) FightProgress = 100;
	else FightProgress = 0;
	FightEnded = true;
	DynamicFunction(CurrentChapter + "_" + CurrentScreen + "_FightEnd(" + Victory.toString() + ")");
}

// When the player hits
function FightHit() {
	FightProgress = FightProgress + 2 + FightSkillBonus;
	if (FightProgress >= 100)
		FightEnd(true);
}

// When the player misses (the penalty is greater on higher difficulties)
function FightMiss() {
	FightPerfect = false;
	if (FightDifficultyText == "Easy") FightProgress = FightProgress - 2;
	if (FightDifficultyText == "Normal") FightProgress = FightProgress - 3;
	if (FightDifficultyText == "Hard") FightProgress = FightProgress - 4;
	if (FightProgress <= 0)
		FightEnd(false);
}

// When the player tries a specific move type
function DoFightMove(MoveType) {
	
	// Below zero is always a miss
	var Hit = false;
	if ((MoveType >= 0) && (FightMoves.length > 0)) {
		
		// For each moves in the list
		var Seq = 0;
		while (Seq < FightMoves.length) {
			
			// If the move connects (good timing and good type)
			if ((FightMoves[Seq][FightMoveTime] <= FightTimer + 300) && (FightMoves[Seq][FightMoveTime] >= FightTimer - 300) && (MoveType == FightMoves[Seq][FightMoveType])) {
				FightMoves.splice(Seq, 1);
				Hit = true;				
			} 
			else Seq++;
			
			// Beyond 0.5 seconds forward, we give up
			if (Seq < FightMoves.length)
				if (FightMoves[Seq][FightMoveTime] > FightTimer + 300) 
					Seq = FightMoves.length;

		}
		
	}

	// Depending on hit or miss, we change the progress of the fight
	LastMoveType = MoveType;
	LastMoveTypeTimer = FightTimer + 200;
	CurrentTime = CurrentTime + 5000;
	if (Hit) FightHit(); 
	else FightMiss(); 

}

// When a key is pressed while fighting (for both keyboard and mobile)
function FightKeyDown() {
	
	// If the fight has started, we check the key pressed and send it as a fight move
	if ((FightTimer > 5000) && (FightProgress != -1) && !FightEnded) {
		var MoveType = -1;
		if ((KeyPress == FightMoveTypeKeyUpper[0]) || (KeyPress == FightMoveTypeKeyLower[0])) MoveType = 0;
		if ((KeyPress == FightMoveTypeKeyUpper[1]) || (KeyPress == FightMoveTypeKeyLower[1])) MoveType = 1;
		if ((KeyPress == FightMoveTypeKeyUpper[2]) || (KeyPress == FightMoveTypeKeyLower[2])) MoveType = 2;
		if ((KeyPress == FightMoveTypeKeyUpper[3]) || (KeyPress == FightMoveTypeKeyLower[3])) MoveType = 3;
		DoFightMove(MoveType);
	}
	
}

// When a click is done while fighting (only works on mobile)
function FightClick() {

	// If the fight is over, clicking on the fight image will end it
	if (FightEnded && (MouseX >= 0) && (MouseX <= 799) && (MouseY >= 0) && (MouseY <= 599))
		SetScene(CurrentChapter, FightEndScreen);

	// If the fight has started, we check the click position and send it as a fight move
	if ((FightTimer > 5000) && (FightProgress != -1) && !FightEnded && IsMobile) {
		var MoveType = -1;
		if ((MouseX >= 800) && (MouseX <= 900) && (MouseY >= 400) && (MouseY <= 500)) MoveType = 0;
		if ((MouseX >= 900) && (MouseX <= 1000) && (MouseY >= 400) && (MouseY <= 500)) MoveType = 1;
		if ((MouseX >= 1000) && (MouseX <= 1100) && (MouseY >= 400) && (MouseY <= 500)) MoveType = 2;
		if ((MouseX >= 1100) && (MouseX <= 1200) && (MouseY >= 400) && (MouseY <= 500)) MoveType = 3;
		DoFightMove(MoveType);
	}

}