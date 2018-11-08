// Race parameters
var RaceTimer = 0;
var RaceStartTime = 5000;
var RaceEndTimer = 0;
var RaceEnded = false;
var RaceVictory = false;
var RaceEndFunction = "";
var RacePerfect = true;
var RaceText;
var RaceActor = "";
var RaceActorImageSet = "";
var RaceActorImageFrame = 0;
var RaceActorImageFrameTime = 0;
var RaceBackupChapter = "";
var RaceBackupScreen = "";
var RaceDifficultyText = "";
var RaceIconLeft = "";
var RaceIconRight = "";
var RaceBackgroundImage = "";
var RaceLastMoveType = -1;
var RaceLastMoveTypeTimer = -1;
var RaceProgress = -1;
var RaceGoal = -1;
var RaceGoalText = "";
var RaceMoves;
var RaceSkillBonus = 0;
var RaceMovesTypeKeyUpper = [65, 83, 68, 70, 72, 74, 75, 76];
var RaceMovesTypeKeyLower = [97, 115, 100, 102, 104, 106, 107, 108];
var RaceCombo = 0;
var RaceSpeed = 0;

// Generates a full race sequence
function RaceGenerateMoves(StartTime, DifficultyText) {
	
	// Set the difficulty ratio
	var DifficultyRatio = 1;
	if (DifficultyText == "Easy") DifficultyRatio = 1.5;
	if (DifficultyText == "Hard") DifficultyRatio = 0.6667;
		
	// Full the race sequence
	var CurTimer = StartTime + 3000;
	var Seq = 0;
	RaceMoves = [];
	while (Seq < MaxRaceSequence) {
		
		// Create a new race move to do at a random position
		RaceMoves[RaceMoves.length] = [Math.floor(Math.random() * 8), CurTimer];
		CurTimer = CurTimer + Math.floor((Math.random() * 600 + 300) * DifficultyRatio);
		Seq++;
		
	}

}

// Load the race animations and full sequence
function RaceLoad(Racer, RacerImageSet, AllowedMinutes, Difficulty, EndGoal, EndGoalText, IconLeft, IconRight, BackgroundImage, EndFunction, SkillBonus) {
	
	// Creates a brand new race 
	LeaveIcon = "";
	RaceTimer = 0;
	RaceEndTimer = RaceStartTime + (AllowedMinutes * 60 * 1000);
	RaceCombo = 0;
	RaceSpeed = 0;
	RaceProgress = 0;
	RaceActorImageFrame = 0;
	RaceEnded = false;	
	RacePerfect = true;
	RaceLastMoveType = -1;
	RaceLastMoveTypeTimer = -1;
	RaceSkillBonus = SkillBonus;
	if (RaceText == null) ReadCSV("RaceText", "C999_Common", "Races", "Text", CurrentLanguageTag);

	// Loads the parameters
	RaceActor = Racer;
	RaceActorImageSet = RacerImageSet;
	RaceDifficultyText = Difficulty;
	RaceGoal = EndGoal;
	RaceGoalText = EndGoalText;
	RaceIconLeft = IconLeft;
	RaceIconRight = IconRight;
	RaceEndFunction = EndFunction;
	RaceBackgroundImage = BackgroundImage;
	RaceGenerateMoves(RaceStartTime, Difficulty);
	
	// Keep a backup of the current chapter and screen
	RaceBackupChapter = CurrentChapter;
	RaceBackupScreen = CurrentScreen;
	CurrentChapter = "C999_Common";
	CurrentScreen = "Race";
	
}

// Draw the race icons
function RaceDrawIcons() {

	// Scroll the race icons with time
	var Seq = 0;
	while (Seq < RaceMoves.length) {
	
		// Draw the move from 3 seconds before to 1 second after
		if ((RaceMoves[Seq][RaceMoveTime] <= RaceTimer + 3000) && (RaceMoves[Seq][RaceMoveTime] >= RaceTimer - 1000)) {			
			if (RaceMoves[Seq][RaceMoveType] <= 3)
				DrawImage(RaceIconLeft, 3 + (RaceMoves[Seq][RaceMoveType] * 75), 410 + Math.floor((RaceTimer - RaceMoves[Seq][RaceMoveTime]) / 6));
			else 
				DrawImage(RaceIconRight, 603 + (RaceMoves[Seq][RaceMoveType] * 75), 410 + Math.floor((RaceTimer - RaceMoves[Seq][RaceMoveTime]) / 6));
		}
		
		// Remove the move from the sequence if it's past due
		if (RaceMoves[Seq][RaceMoveTime] < RaceTimer - 1000) {
			RaceMoves.splice(Seq, 1);
			RaceMiss();
		}	
		else Seq = Seq + 1;
		
		// Beyond 3 seconds forward, we exit
		if (Seq < RaceMoves.length)
			if (RaceMoves[Seq][RaceMoveTime] > RaceTimer + 3000)
				return;

	}

}

// Draw the race bars to tell when the moves will hit
function RaceDrawBar() {

	// Draw 4 bars on each sides
	var XOffset = 0;
	for(BarNum = 0; BarNum <= 7; BarNum++) {
		
		// Draw the bars on both sides of the screen
		if (BarNum == 4) XOffset = 600;
		
		// The color changes when it's clicked or pressed
		DrawRect(XOffset + 3 + (BarNum * 75), 437, 70, 27, "White");
		if ((RaceLastMoveType == BarNum) && (RaceLastMoveTypeTimer >= RaceTimer))
			DrawRect(XOffset + 4 + (BarNum * 75), 438, 68, 25, "#66FF66");
		else
			DrawRect(XOffset + 4 + (BarNum * 75), 438, 68, 25, "Red");
		if (!IsMobile) DrawText(String.fromCharCode(RaceMovesTypeKeyUpper[BarNum]), XOffset + 36 + (BarNum * 75), 451, "white");

	}

}

// Draw the race progress in the bottom screen
function RaceDrawStats() {
	DrawText(GetCSVText(RaceText, "Combo") + " " + RaceCombo.toString(), 400, 25, "white");
	DrawText(GetCSVText(RaceText, "Speed") + " " + RaceSpeed.toString(), 575, 25, "white");
	DrawText(GetCSVText(RaceText, "Timer") + " " + msToTime(RaceEndTimer - RaceTimer), 800, 25, "white");
}

// Draw the actor on the screen
function RaceDrawActor() {

	// Builds the image name
	var ImageName = "C999_Common/Races/Actors/" + RaceActor + "/" + RaceActorImageSet;

	// Gets the moving of stopped anim
	if (RaceSpeed <= 0) ImageName = ImageName + "_Stop";
	else ImageName = ImageName + "_Move";

	// If we must get the next actor image frame
	if (RaceActorImageFrameTime < RaceTimer) {

		// Sets the current frame
		RaceActorImageFrame++;
		if (RaceActorImageFrame > 3) RaceActorImageFrame = 0;

		// Sets the next frame time
		if (RaceSpeed > 0) RaceActorImageFrameTime = RaceTimer + 1500 / (RaceSpeed / 10);
		else RaceActorImageFrameTime = RaceTimer + 1500;

	};

	// Draw the image on the screen
	ImageName = ImageName + "_" + (RaceActorImageFrame).toString() + ".png";
	DrawImage(ImageName, 300, 0);

}

// Ends the race and sends the result back to the screen
function RaceEnd(Victory) {
	RaceActorImageFrameTime = -1;
	RaceEnded = true;
	RaceVictory = Victory;
	if (RaceTimer <= 65000) AchievementUnlock("SpeedrunningBitch"); // If more races get added to the game, this needs to be done differently
	if (RaceTimer >= RaceEndTimer) RaceTimer = RaceEndTimer;
}

// When the player hits we increase the combo which calculates the moving speed in pixels per second
function RaceHit() {
	RaceCombo++;
	if (RaceCombo < 3) RaceSpeed = 0;
	if ((RaceCombo >= 3) && (RaceCombo <= 4)) RaceSpeed = 10;
	if ((RaceCombo >= 5) && (RaceCombo <= 6)) RaceSpeed = 12;
	if ((RaceCombo >= 7) && (RaceCombo <= 9)) RaceSpeed = 14;
	if ((RaceCombo >= 10) && (RaceCombo <= 12)) RaceSpeed = 16;
	if ((RaceCombo >= 13) && (RaceCombo <= 16)) RaceSpeed = 18;
	if ((RaceCombo >= 17) && (RaceCombo <= 20)) RaceSpeed = 20;
	if ((RaceCombo >= 21) && (RaceCombo <= 24)) RaceSpeed = 22;
	if ((RaceCombo >= 25) && (RaceCombo <= 29)) RaceSpeed = 24;
	if ((RaceCombo >= 30) && (RaceCombo <= 39)) RaceSpeed = 26;
	if ((RaceCombo >= 40) && (RaceCombo <= 49)) RaceSpeed = 28;
	if ((RaceCombo >= 50) && (RaceCombo <= 59)) RaceSpeed = 30;
	if ((RaceCombo >= 60) && (RaceCombo <= 69)) RaceSpeed = 32;
	if ((RaceCombo >= 70) && (RaceCombo <= 79)) RaceSpeed = 34;
	if ((RaceCombo >= 80) && (RaceCombo <= 89)) RaceSpeed = 36;
	if ((RaceCombo >= 90) && (RaceCombo <= 99)) RaceSpeed = 38;
	if (RaceCombo >= 100) RaceSpeed = 40;
	RaceSpeed = Math.round(RaceSpeed * (1.0 + RaceSkillBonus / 2));
}

// When the player misses (we reset the combo and the speed)
function RaceMiss() {
	RacePerfect = false;
	RaceSpeed = 0;
	RaceCombo = 0;
}

// When the player tries a specific move type
function RaceDoMove(MoveType) {

	// Make sure the hit is valid
	if ((MoveType >= 0) && (RaceMoves.length > 0)) {
		
		// For each moves in the list
		var Hit = false;
		var Seq = 0;
		while (Seq < RaceMoves.length) {
			
			// If the move connects (good timing and good type)
			if ((RaceMoves[Seq][RaceMoveTime] <= RaceTimer + 300) && (RaceMoves[Seq][RaceMoveTime] >= RaceTimer - 300) && (MoveType == RaceMoves[Seq][RaceMoveType])) {
				RaceMoves.splice(Seq, 1);
				Hit = true;
				Seq = RaceMoves.length;
			}
			else Seq++;
			
			// Beyond 0.5 seconds forward, we give up
			if (Seq < RaceMoves.length)
				if (RaceMoves[Seq][RaceMoveTime] > RaceTimer + 300) 
					Seq = RaceMoves.length;

		}

		// Depending on hit or miss, we change the progress of the race
		RaceLastMoveType = MoveType;
		RaceLastMoveTypeTimer = RaceTimer + 200;
		if (Hit) RaceHit();
		else RaceMiss();

	}

}

// Render the race scene
function C999_Common_Race_Run() {

	// If the actor must move forward and progress
	if ((RaceSpeed > 0) && !RaceEnded) {
		
		// The progress is (Speed) pixels every second
		RaceProgress = RaceProgress + (RunInterval / 1000) * RaceSpeed;
		
		// If the goal is achieved
		if (RaceProgress >= RaceGoal) {
			RaceProgress = RaceGoal;
			RaceEnd(true);
		}
		
	}

	// Paints the background
	DrawImage("C999_Common/Races/Backgrounds/" + RaceBackgroundImage + ".jpg", RaceProgress * -1, 0);

	// Increments the race timer and draw the actor
	if (!RaceEnded) RaceTimer = RaceTimer + RunInterval;
	RaceDrawActor();
	
	// If the race is over and not completed, we flag a defeat
	if ((RaceTimer >= RaceEndTimer) && !RaceEnded)
		RaceEnd(false);

	// Draw the race icons, bars and bottom info when the race is running
	if (!RaceEnded) {
		if (RaceTimer >= RaceStartTime) {
			RaceDrawBar();
			RaceDrawIcons();
			RaceDrawStats();
		} 
		else {
			DrawText(RaceGoalText, 600, 25, "white");
			DrawText(GetCSVText(RaceText, "Difficulty") + " " + GetCSVText(RaceText, RaceDifficultyText), 500, 65, "white");
			DrawText(GetCSVText(RaceText, "StartsIn") + " " + (5 - Math.floor(RaceTimer / 1000)).toString(), 700, 65, "white");
		}
	}

	// Draw the end text
	if (RaceEnded) {		
		if ((RaceProgress >= RaceGoal) && RacePerfect) DrawText(GetCSVText(RaceText, "Perfect"), 600, 25, "white");
		if ((RaceProgress >= RaceGoal) && !RacePerfect) DrawText(GetCSVText(RaceText, "Victory"), 600, 25, "white");
		if (RaceProgress < RaceGoal) DrawText(GetCSVText(RaceText, "Defeat"), 600, 25, "white");
		DrawText(GetCSVText(RaceText, "RaceTime") + " " + msToTime(RaceTimer - RaceStartTime), 600, 65, "white");
	}

}

// When a key is pressed while racing (for both keyboard and mobile)
function C999_Common_Race_KeyDown() {
	
	// If the race has started, we check the key pressed and send it as a race move
	if ((RaceTimer > RaceStartTime) && !RaceEnded) {
		
		var MoveType = -1;
		for(T = 0; T <= 7; T++)
			if ((KeyPress == RaceMovesTypeKeyUpper[T]) || (KeyPress == RaceMovesTypeKeyLower[T])) 
				MoveType = T;
		RaceDoMove(MoveType);
	}
	
}

// When a click is done while racing (only works on mobile)
function C999_Common_Race_Click() {

	// If the race is over, clicking on the running actor will end the race
	if (RaceEnded && (MouseX >= 300) && (MouseX <= 900) && (MouseY <= 600)) {
		CurrentChapter = RaceBackupChapter;
		CurrentScreen = RaceBackupScreen;
		DynamicFunction(RaceEndFunction + "(" + RaceVictory.toString() + ")");
	}

	// If the race has started, we check the click position and send it as a race move
	if ((RaceTimer > RaceStartTime) && !RaceEnded && IsMobile) {
		var MoveType = -1;
		if ((MouseX >= 0) && (MouseX <= 300) && (MouseY >= 400) && (MouseY <= 500)) MoveType = Math.floor((MouseX) / 75);
		if ((MouseX >= 900) && (MouseX <= 1200) && (MouseY >= 400) && (MouseY <= 500)) MoveType = Math.floor((MouseX - 900) / 75) + 4;
		RaceDoMove(MoveType);
	}

}
