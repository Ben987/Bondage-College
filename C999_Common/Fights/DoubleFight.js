// Fight parameters
var DoubleFightTimer = 0;
var DoubleFightStartTime = 5000;
var DoubleFightEnded = false;
var DoubleFightVictory = false;
var DoubleFightEndFunction = "";
var DoubleFightPerfect = true;
var DoubleFightOpponent1 = {};
var DoubleFightOpponent2 = {};
var DoubleFightText;
var DoubleFightBackupChapter = "";
var DoubleFightBackupScreen = "";
var DoubleFightSkillBonus = 0;

// Generates a full fight sequence
function DoubleFightGenerateMoves(StartTime, DifficultyText) {
	
	// Set the difficulty ratio
	var DifficultyRatio = 1;
	if (DifficultyText == "Easy") DifficultyRatio = 1.5;
	if (DifficultyText == "Hard") DifficultyRatio = 0.6667;
		
	// Full the fight sequence
	var CurTimer = StartTime + 3000;
	var Seq = 0;
	DoubleFightMoves = [];
	while (Seq < MaxFightSequence) {
		
		// Create a new fight move to do at a random position
		DoubleFightMoves[DoubleFightMoves.length] = [Math.floor(Math.random() * 4), CurTimer];
		CurTimer = CurTimer + Math.floor((Math.random() * 800 + 400) * DifficultyRatio);
		Seq++;
		
	}

	// Returns the fight move set
	return DoubleFightMoves;

}

// Load the fight animations and full sequence
function DoubleFightLoad(Opp1ActorName, Opp1Difficulty, Opp1Icon, Opp2ActorName, Opp2Difficulty, Opp2Icon, BackgroundImage, EndFunction, SkillBonus) {
	
	// Creates a brand new fight 
	LeaveIcon = "";
	DoubleFightTimer = 0;
	DoubleFightEnded = false;	
	DoubleFightPerfect = true;
	DoubleFightEndFunction = EndFunction;
	DoubleFightBackgroundImage = BackgroundImage;
	DoubleFightSkillBonus = SkillBonus;
	if (DoubleFightText == null) ReadCSV("DoubleFightText", "C999_Common", "Fights", "Text", CurrentLanguageTag);

	// Setup the 2 opponents
	DoubleFightOpponent1 = { ActorName:Opp1ActorName, DifficultyText:Opp1Difficulty, FightIcon:Opp1Icon, LastMoveType:-1, LastMoveTypeTimer:-1, FightProgress:-1, FightMoves:DoubleFightGenerateMoves(DoubleFightStartTime, Opp1Difficulty), FightMoveTypeKeyUpper:[65, 83, 68, 70], FightMoveTypeKeyLower:[97, 115, 100, 102], FightXOffset:0, ImageXOffset:220, ImageName:"", NextImageTime:-1 };
	DoubleFightOpponent2 = { ActorName:Opp2ActorName, DifficultyText:Opp2Difficulty, FightIcon:Opp2Icon, LastMoveType:-1, LastMoveTypeTimer:-1, FightProgress:-1, FightMoves:DoubleFightGenerateMoves(DoubleFightStartTime, Opp2Difficulty), FightMoveTypeKeyUpper:[72, 74, 75, 76], FightMoveTypeKeyLower:[104, 106, 107, 108], FightXOffset:900, ImageXOffset:520, ImageName:"", NextImageTime:-1 };
	
	// Keep a backup of the current chapter and screen
	DoubleFightBackupChapter = CurrentChapter;
	DoubleFightBackupScreen = CurrentScreen;
	CurrentChapter = "C999_Common";
	CurrentScreen = "DoubleFight";
	
}

// Draw the fight icons
function DoubleFightDrawIcons(Opponent) {

	// Scroll the fight icons with time
	var Seq = 0;
	while (Seq < Opponent.FightMoves.length) {
	
        // Draw the move from 3 seconds before to 1 second after
        var currentOpponentIconTime = Opponent.FightMoves[Seq][FightMoveTime];
        if ((currentOpponentIconTime <= DoubleFightTimer + 3000) && (currentOpponentIconTime >= DoubleFightTimer - 1000))
            DrawImage(Opponent.FightIcon, Opponent.FightXOffset + 3 + (Opponent.FightMoves[Seq][FightMoveType] * 75), 410 + Math.floor((DoubleFightTimer - currentOpponentIconTime) / 6));  
		
		// Remove the move from the sequence if it's past due
		if (currentOpponentIconTime < DoubleFightTimer - 1000) {
			Opponent.FightMoves.splice(Seq, 1);
			DoubleFightMiss(Opponent);
		}	
		else Seq = Seq + 1;	
		
		// Beyond 3 seconds forward, we exit
		if (Seq < Opponent.FightMoves.length)
			if (Opponent.FightMoves[Seq][FightMoveTime] > DoubleFightTimer + 3000)
				return;

	}

}

// Draw the fight bars to tell when the moves will hit
function DoubleFightDrawBar(Opponent) {

	// Draw 4 bars per opponent
	for(BarNum = 0; BarNum <= 3; BarNum++) {
		
		// The color changes when it's clicked or pressed
		DrawRect(Opponent.FightXOffset + 3 + (BarNum * 75), 437, 70, 27, "White");
		if ((Opponent.LastMoveType == BarNum) && (Opponent.LastMoveTypeTimer >= DoubleFightTimer))
			DrawRect(Opponent.FightXOffset + 4 + (BarNum * 75), 438, 68, 25, "#66FF66");
		else
			DrawRect(Opponent.FightXOffset + 4 + (BarNum * 75), 438, 68, 25, "Red");
		if (!IsMobile) DrawText(String.fromCharCode(Opponent.FightMoveTypeKeyUpper[BarNum]), Opponent.FightXOffset + 36 + (BarNum * 75), 451, "white");

	}

}

// Draw the fight progress in the bottom of the fight scene
function DoubleFightDrawProgress(Opponent) {
	DrawRect(Opponent.FightXOffset, 590, 300, 1, "white");
	DrawRect(Opponent.FightXOffset, 591, Opponent.FightProgress * 3, 9, "#66FF66");
	DrawRect(Opponent.FightXOffset + (Opponent.FightProgress * 3), 591, (100 - Opponent.FightProgress) * 3, 9, "red");
}

// Draw the opponent actor on the screen
function DoubleFightDrawOpponent(Opponent) {

	// Before the timer, we use the previous image
	if (Opponent.NextImageTime < DoubleFightTimer) {

		// The image file is constructed based on the actor clothes and winning position
		Opponent.NextImageTime = DoubleFightTimer + 1000 + Math.round(Math.random() * 2000);
		Opponent.ImageName = "C999_Common/Fights/Actors/" + Opponent.ActorName + "/" + ActorSpecificGetValue(Opponent.ActorName, ActorCloth) + "_";
		if (Opponent.FightProgress == -1) Opponent.ImageName = Opponent.ImageName + "Provoke.png";
		if (Opponent.FightProgress == 100) Opponent.ImageName = Opponent.ImageName + "Defeat.png";
		if (Opponent.FightProgress == 0) Opponent.ImageName = Opponent.ImageName + "Victory.png";
		if ((Opponent.FightProgress >= 1) && (Opponent.FightProgress <= 33)) Opponent.ImageName = Opponent.ImageName + "Winning" + ((Math.round(new Date().getTime() / 3000) % 3) + 1).toString() + ".png";
		if ((Opponent.FightProgress >= 34) && (Opponent.FightProgress <= 66)) Opponent.ImageName = Opponent.ImageName + "Even" + ((Math.round(new Date().getTime() / 3000) % 3) + 1).toString() + ".png";
		if ((Opponent.FightProgress >= 67) && (Opponent.FightProgress <= 99)) Opponent.ImageName = Opponent.ImageName + "Losing" + ((Math.round(new Date().getTime() / 3000) % 3) + 1).toString() + ".png";
		
	};

	// Draw the image on the screen
	DrawImageZoom(Opponent.ImageName, 0, 0, 600, 900, Opponent.ImageXOffset, 50, 600 * 0.75, 900 * 0.75);

}

// Renders a specific opponent
function DoubleFightRenderOpponent(Opponent) {

	// Starts the fight at an even level and generates moves if there'S none left
	if (Opponent.FightProgress > 100) Opponent.FightProgress = 100;
	if ((Opponent.FightProgress == -1) && (DoubleFightTimer >= DoubleFightStartTime)) Opponent.FightProgress = 50;
	if ((Opponent.FightMoves.length == 0) && !DoubleFightEnded && Opponent.FightProgress > 0) Opponent.FightMoves = DoubleFightGenerateMoves(DoubleFightTimer, Opponent.DifficultyText);

	// Draw the fighting actors
	DoubleFightDrawOpponent(Opponent);
	
	// Draw the fight icons, bars and bottom info when the fight is running
	if (!DoubleFightEnded) {
		if (DoubleFightTimer >= DoubleFightStartTime) {
			if (Opponent.FightProgress < 100) {
				DoubleFightDrawBar(Opponent);
				DoubleFightDrawIcons(Opponent);
				DoubleFightDrawProgress(Opponent);
			}
		} 
		else {
			DrawText(GetCSVText(DoubleFightText, "Opponent") + " " + Opponent.ActorName, Opponent.FightXOffset + 150, 250, "white");
			DrawText(GetCSVText(DoubleFightText, "Difficulty") + " " + GetCSVText(DoubleFightText, Opponent.DifficultyText), Opponent.FightXOffset + 150, 350, "white");
		}
	}
	
}

// Ends the fight and sends the result back to the screen
function DoubleFightEnd(Victory) {
	DoubleFightOpponent1.NextImageTime = -1;
	DoubleFightOpponent2.NextImageTime = -1;
	if (DoubleFightOpponent1.FightProgress < 100) DoubleFightOpponent1.FightProgress = Victory ? 100 : 0;
	if (DoubleFightOpponent2.FightProgress < 100) DoubleFightOpponent2.FightProgress = Victory ? 100 : 0;
	DoubleFightEnded = true;
	DoubleFightVictory = Victory;
}

// When the player hits
function DoubleFightHit(Opponent) {
	Opponent.FightProgress = Opponent.FightProgress + 2 + DoubleFightSkillBonus;
	if (Opponent.FightProgress >= 100) Opponent.NextImageTime = -1;
	if ((DoubleFightOpponent1.FightProgress >= 100) && (DoubleFightOpponent2.FightProgress >= 100)) DoubleFightEnd(true);
}

// When the player misses (the penalty is greater on higher difficulties)
function DoubleFightMiss(Opponent) {
	DoubleFightPerfect = false;
	if (Opponent.DifficultyText == "Easy") Opponent.FightProgress = Opponent.FightProgress - 2;
	if (Opponent.DifficultyText == "Normal") Opponent.FightProgress = Opponent.FightProgress - 3;
	if (Opponent.DifficultyText == "Hard") Opponent.FightProgress = Opponent.FightProgress - 4;
	if (Opponent.FightProgress <= 0) DoubleFightEnd(false);
}

// When the player tries a specific move type
function DoubleFightDoMove(Opponent, MoveType) {

	// Make sure the hit is valid
	if ((MoveType >= 0) && (Opponent.FightMoves.length > 0) && (Opponent.FightProgress > 0) && (Opponent.FightProgress < 100)) {
		
		// For each moves in the list
		var Hit = false;
		var Seq = 0;
		while (Seq < Opponent.FightMoves.length) {
			
			// If the move connects (good timing and good type)
			if ((Opponent.FightMoves[Seq][FightMoveTime] <= DoubleFightTimer + 300) && (Opponent.FightMoves[Seq][FightMoveTime] >= DoubleFightTimer - 300) && (MoveType == Opponent.FightMoves[Seq][FightMoveType])) {
				Opponent.FightMoves.splice(Seq, 1);
				Hit = true;
				Seq = Opponent.FightMoves.length;
			}
			else Seq++;
			
			// Beyond 0.5 seconds forward, we give up
			if (Seq < Opponent.FightMoves.length)
				if (Opponent.FightMoves[Seq][FightMoveTime] > DoubleFightTimer + 300) 
					Seq = Opponent.FightMoves.length;

		}

		// Depending on hit or miss, we change the progress of the fight
		Opponent.LastMoveType = MoveType;
		Opponent.LastMoveTypeTimer = DoubleFightTimer + 200;
		if (Hit) DoubleFightHit(Opponent);
		else DoubleFightMiss(Opponent);

		// Each hit or miss add 5 seconds to the game clock
		CurrentTime = CurrentTime + 5000;
		
	}

}

// Checks if the key is a valid fight move for an opponent
function DoubleFightCheckKey(Opponent) {	
	var MoveType = -1;
	if ((KeyPress == Opponent.FightMoveTypeKeyUpper[0]) || (KeyPress == Opponent.FightMoveTypeKeyLower[0])) MoveType = 0;
	if ((KeyPress == Opponent.FightMoveTypeKeyUpper[1]) || (KeyPress == Opponent.FightMoveTypeKeyLower[1])) MoveType = 1;
	if ((KeyPress == Opponent.FightMoveTypeKeyUpper[2]) || (KeyPress == Opponent.FightMoveTypeKeyLower[2])) MoveType = 2;
	if ((KeyPress == Opponent.FightMoveTypeKeyUpper[3]) || (KeyPress == Opponent.FightMoveTypeKeyLower[3])) MoveType = 3;
	DoubleFightDoMove(Opponent, MoveType);
}

// When a click is done on a mobile device, we send it to hit or miss
function DoubleFightCheckClick(Opponent) {
	var MoveType = -1;
	if ((MouseX >= Opponent.FightXOffset) && (MouseX <= Opponent.FightXOffset + 300) && (MouseY >= 400) && (MouseY <= 500)) MoveType = Math.floor((MouseX - Opponent.FightXOffset) / 75);
	DoubleFightDoMove(Opponent, MoveType);
}

// Render the double fight scene
function C999_Common_DoubleFight_Run() {

	// Paints the background
	DrawImage("C999_Common/Fights/Backgrounds/" + DoubleFightBackgroundImage + ".jpg", 0, 0);

	// Increments the fight timer and renders the 2 opponents
	DoubleFightTimer = DoubleFightTimer + RunInterval;
	DoubleFightRenderOpponent(DoubleFightOpponent1);
	DoubleFightRenderOpponent(DoubleFightOpponent2);

	// Draw the fight icons and bottom info when the fight is running
	if (!DoubleFightEnded && (DoubleFightTimer < DoubleFightStartTime)) DrawText(GetCSVText(DoubleFightText, "StartsIn") + " " + (5 - Math.floor(DoubleFightTimer / 1000)).toString(), 600, 30, "white");

	// Draw the end text
	if (DoubleFightEnded) {
		if ((DoubleFightOpponent1.FightProgress >= 100) && (DoubleFightOpponent2.FightProgress >= 100) && DoubleFightPerfect) DrawText(GetCSVText(DoubleFightText, "Perfect"), 600, 30, "white");
		if ((DoubleFightOpponent1.FightProgress >= 100) && (DoubleFightOpponent2.FightProgress >= 100) && !DoubleFightPerfect) DrawText(GetCSVText(DoubleFightText, "Victory"), 600, 30, "white");
		if ((DoubleFightOpponent1.FightProgress <= 0) || (DoubleFightOpponent2.FightProgress <= 0)) DrawText(GetCSVText(DoubleFightText, "Defeat"), 600, 30, "white");
	}

}

// When a key is pressed while fighting (for both keyboard and mobile)
function C999_Common_DoubleFight_KeyDown() {
	
	// If the fight has started, we check the key pressed and send it as a fight move
	if ((DoubleFightTimer > DoubleFightStartTime) && (DoubleFightOpponent1.FightProgress != -1) && !DoubleFightEnded) {
		DoubleFightCheckKey(DoubleFightOpponent1);
		DoubleFightCheckKey(DoubleFightOpponent2);
	}
	
}

// When a click is done while fighting (only works on mobile)
function C999_Common_DoubleFight_Click() {

	// If the fight is over, clicking above the opponents will end it
	if (DoubleFightEnded && (MouseX >= 300) && (MouseX <= 900) && (MouseY <= 600)) {
		CurrentChapter = DoubleFightBackupChapter;
		CurrentScreen = DoubleFightBackupScreen;
		DynamicFunction(DoubleFightEndFunction + "(" + DoubleFightVictory.toString() + ")");
	}

	// If the fight has started, we check the click position and send it as a fight move
	if ((DoubleFightTimer > DoubleFightStartTime) && (DoubleFightOpponent1.FightProgress != -1) && !DoubleFightEnded && IsMobile) {
		DoubleFightCheckClick(DoubleFightOpponent1);
		DoubleFightCheckClick(DoubleFightOpponent2);
	}

}
