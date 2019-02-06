// Struggle parameters
var StruggleType = "";
var StruggleDifficulty = ""; // Easy, Normal, Hard, Impossible
var StruggleDifficultyShown = ""; // To translate the shown difficulty
var StruggleMessage = "";
var StruggleDoneMessage = "";
var StruggleX = 0;
var StruggleY = 0;
var StruggleRadius = 0;
var StruggleProgress = 0; // 0 - Not started, 100 - Done
var StruggleNextTick = 0;
var StruggleDone = false;
var StruggleImageFrame = 0;
var StruggleImageFrameMax = 1;
var StruggleImageFrameTime = 0;
var StruggleSkillBonus = 0;

// For each Rope Mastery level, it's 50% easier to struggle out
function StruggleLoad() {
	StruggleDone = false;
	StruggleProgress = 0;
	StruggleSkillBonus = PlayerGetSkillLevel("RopeMastery");
}

// The next tick to lower the struggle time comes faster with harder levels
function StruggleGetNextTick() {
	if ((StruggleDifficulty == "Easy") && (StruggleProgress <= 33)) StruggleNextTick = CurrentTime + 600;
	if ((StruggleDifficulty == "Easy") && (StruggleProgress > 33) && (StruggleProgress <= 66)) StruggleNextTick = CurrentTime + 450;
	if ((StruggleDifficulty == "Easy") && (StruggleProgress > 66)) StruggleNextTick = CurrentTime + 300;
	if ((StruggleDifficulty == "Normal") && (StruggleProgress <= 33)) StruggleNextTick = CurrentTime + 400;
	if ((StruggleDifficulty == "Normal") && (StruggleProgress > 33) && (StruggleProgress <= 66)) StruggleNextTick = CurrentTime + 325;
	if ((StruggleDifficulty == "Normal") && (StruggleProgress > 66)) StruggleNextTick = CurrentTime + 250;
	if ((StruggleDifficulty == "Hard") && (StruggleProgress <= 33)) StruggleNextTick = CurrentTime + 300;
	if ((StruggleDifficulty == "Hard") && (StruggleProgress > 33) && (StruggleProgress <= 66)) StruggleNextTick = CurrentTime + 225;
	if ((StruggleDifficulty == "Hard") && (StruggleProgress > 66)) StruggleNextTick = CurrentTime + 150;
	if ((StruggleDifficulty == "Impossible") && (StruggleProgress <= 33)) StruggleNextTick = CurrentTime + 250;
	if ((StruggleDifficulty == "Impossible") && (StruggleProgress > 33) && (StruggleProgress <= 66)) StruggleNextTick = CurrentTime + 125;
	if ((StruggleDifficulty == "Impossible") && (StruggleProgress > 66)) StruggleNextTick = CurrentTime + 10;
}

// When the user clicks to struggle
function StruggleClick(SType, SDifficulty, SMessage, SDoneMessage, SX, SY, SRadius) {

	// If the user clicked on a struggling point
	if ((MouseX >= SX - SRadius) && (MouseX <= SX + SRadius) && (MouseY >= SY - SRadius) && (MouseY <= SY + SRadius)) {

		// If we must start a new struggling
		if ((SType != StruggleType) || (StruggleDifficultyShown == "")) {
			StruggleType = SType;
			StruggleDifficulty = SDifficulty;
			StruggleDifficultyShown = GetText(SDifficulty);
			StruggleMessage = SMessage;
			StruggleDoneMessage = SDoneMessage;
			StruggleX = SX;
			StruggleY = SY;
			StruggleRadius = SRadius;
			StruggleProgress = 0;	
			StruggleDone = false;
			StruggleGetNextTick();
		}
		
		// Raise the progress by 2 for each click, 100 is done
		if (StruggleProgress <= 0) StruggleProgress = 8;
		StruggleProgress = StruggleProgress + 2 + StruggleSkillBonus;
		if (StruggleProgress >= 100) {
			StruggleProgress = 100;
			StruggleDone = true;
			StruggleNextTick = CurrentTime + 6000;
		}
	
	}
	
}

// Return the correct background image related to the player's progress
function StruggleGetImage(StruggleStage) {

	// The frame of the image changes faster when progress is higher
	if (StruggleImageFrameTime < CurrentTime) {
		if (StruggleProgress <= 0) StruggleImageFrameTime = CurrentTime + 3000;
		if ((StruggleProgress > 0) && (StruggleProgress <= 33)) StruggleImageFrameTime = CurrentTime + 2000;
		if ((StruggleProgress > 33) && (StruggleProgress <= 66)) StruggleImageFrameTime = CurrentTime + 1300;
		if ((StruggleProgress > 66) && (StruggleProgress < 100)) StruggleImageFrameTime = CurrentTime + 800;
		StruggleImageFrame++;
		if (StruggleImageFrame > StruggleImageFrameMax) StruggleImageFrame = 0;
	}	
	if (StruggleProgress >= 100) StruggleImageFrame = StruggleImageFrameMax + 1;

	// Returns the correct image file
	if (StruggleProgress <= 0) return CurrentChapter + "/" + CurrentScreen + "/Idle_" + StruggleStage.toString() + "_" + StruggleImageFrame.toString() + ".jpg";
	else return CurrentChapter + "/" + CurrentScreen + "/" + StruggleType + "_" + StruggleStage.toString() + "_" + StruggleImageFrame.toString() + ".jpg";

}

// Draw the fight progress in the bottom of the fight scene
function StruggleDraw(NoStruggleMessage, StruggleStage) {
	
	// Draw the background image
	DrawImage(StruggleGetImage(StruggleStage), 0, 0);

	// Draw the struggle text on top
	if (StruggleProgress <= 0) DrawText(NoStruggleMessage, 600, 30, "white");
	if (StruggleProgress >= 100) DrawText(StruggleDoneMessage, 600, 30, "white");
	if ((StruggleProgress > 0) && (StruggleProgress < 100)) { DrawText(StruggleMessage, 600, 30, "white"); DrawCircle(StruggleX, StruggleY, StruggleRadius + 4, 4, "white"); }
	if ((StruggleProgress > 50) && (StruggleProgress < 100)) DrawText(StruggleDifficultyShown, StruggleX, StruggleY + StruggleRadius + 30, "white");

	// Draw the progress meter
	DrawRect(399, 579, 402, 12, "white");
	DrawRect(400, 580, StruggleProgress * 4, 10, "#66FF66");
	DrawRect(400 + (StruggleProgress * 4), 580, (100 - StruggleProgress) * 4, 10, "red");

}

// When the struggle timer runs
function StruggleRun(NoStruggleMessage, StruggleStage) {

	// When the struggle timer ticks
	if (StruggleNextTick <= CurrentTime) {
		
		// If it's done, we call the done procedure from the calling module, if not we lower the struggle progress
		if (StruggleDone) {
			DynamicFunction(CurrentChapter + "_" + CurrentScreen + "_StruggleDone()");
			StruggleDone = false;
			StruggleProgress = 0;
			StruggleType = "";
		} else {
			StruggleProgress--;
			if (StruggleProgress < 0) StruggleProgress = 0;
			StruggleGetNextTick();
		}
		
	}

	// Draw the struggle scene
	StruggleDraw(NoStruggleMessage, StruggleStage);

}