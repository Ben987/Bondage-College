// Race parameters
var QuizTimer = 0;
var QuizEnded = false;
var QuizVictory = false;
var QuizEndFunction = "";
var QuizPerfect = true;
var QuizActorLeft = "";
var QuizActorRight = "";
var QuizActorLeader = "";
var QuizImageActorLeft = "";
var QuizImageActionActorLeft = "";
var QuizImageActorRight = "";
var QuizImageActionActorRight = "";
var QuizImageActorLeader = "";
var QuizImageActionActorLeader = "";
var QuizBackupChapter = "";
var QuizBackupScreen = "";
var QuizDifficultyText = "";
var QuizBackgroundImage = "";
var QuizProgressLeft = 0;
var QuizProgressRight = 0;
var QuizGoal = -1;
var QuizText = null;
var QuizQuestion = null;
var QuizAnswer = null;
var QuizFirstQuestionTime = 5000;
var QuizBeforeAnswerTime = 3000;
var QuizAnswerProgressTime = 3000;
var QuizOtherQuestionTime = 3000;
var QuizBetweenQuestionTimer = 0;
var QuizShuffleDone = false;
var QuizQuestionText = 0;
var QuizQuestionAnswer1 = 1; // The first answer is always correct, the answer order will be shuffled
var QuizQuestionAnswer2 = 2;
var QuizQuestionAnswer3 = 3;
var QuizQuestionAnswer4 = 4;
var QuizAnswerBy = "";
var QuizAnswerText = "";
var QuizRightActorAnswerTimer = 0;

// Load the race animations and full sequence
function QuizLoad(ActorLeft, ImageActorLeft, ActorRight, ImageActorRight, ActorLeader, ImageActorLeader, Difficulty, ProgressTime, Goal, BackgroundImage, QuestionFile, EndFunction) {
	
	// Creates a brand new quiz
	LeaveIcon = "";
	QuizTimer = QuizFirstQuestionTime * -1;
	QuizProgressLeft = 0;
	QuizProgressRight = 0;
	QuizGoal = Goal;
	QuizEnded = false;	
	QuizPerfect = true;
	QuizAnswerBy = "";
	QuizAnswerText = "";
	QuizBetweenQuestionTimer = 0;
	
	// Loads the quiz texts and questions
	if (QuizText == null) ReadCSV("QuizText", "C999_Common/Quiz/Text_" + CurrentLanguageTag + ".csv");
	QuizQuestion = null;
	QuizAnswer = null;
	QuizShuffleDone = false;
	ReadCSV("QuizQuestion", "C999_Common/Quiz/Questions/" + QuestionFile + "_" + CurrentLanguageTag + ".csv");

	// Loads the parameters
	QuizActorLeft = ActorLeft;
	QuizImageActorLeft = ImageActorLeft;
	QuizActorRight = ActorRight;
	QuizImageActorRight = ImageActorRight;
	QuizActorLeader = ActorLeader;
	QuizImageActorLeader = ImageActorLeader;
	QuizDifficultyText = Difficulty;
	QuizEndFunction = EndFunction;
	QuizBackgroundImage = BackgroundImage;
	QuizAnswerProgressTime = ProgressTime;
	QuizImageActionActorRight = "";
	QuizImageActionActorLeft = "";
	QuizImageActionActorLeader = "";
	
	// Keep a backup of the current chapter and screen
	QuizBackupChapter = CurrentChapter;
	QuizBackupScreen = CurrentScreen;
	CurrentChapter = "C999_Common";
	CurrentScreen = "Quiz";

}

// Prepare the quiz answers if we need to
function QuizPrepareAnswers() {
	if ((QuizAnswer == null) && (QuizQuestion != null)) {
		QuizAnswer = [QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionAnswer1], QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionAnswer2], QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionAnswer3], QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionAnswer4]]; 
		QuizAnswer = ArrayShuffle(QuizAnswer);
	}
}

// Renders the little timer before the quiz and shows the opponent name and strength
function QuizRenderBeforeQuestion() {
	if ((QuizProgressLeft == 0) && (QuizProgressRight == 0)) {
		DrawText(GetCSVText(QuizText, "Opponent") + " " + QuizActorRight, 600, 50, "white");
		DrawText(GetCSVText(QuizText, "Difficulty") + " " + GetCSVText(QuizText, QuizDifficultyText), 600, 90, "white");
		DrawText(GetCSVText(QuizText, "Explanation"), 600, 150, "white");
		DrawText(GetCSVText(QuizText, "FirstQuestionIn") + " " + (Math.floor(QuizTimer * -1 / 1000)).toString(), 600, 210, "white");
	} else {
		DrawText(Common_PlayerName + ": " + QuizProgressLeft.toString(), 600, 60, "white");
		DrawText(QuizActorRight + ": " + QuizProgressRight.toString(), 600, 130, "white");
		DrawText(GetCSVText(QuizText, "NextQuestionIn") + " " + (Math.floor(QuizTimer * -1 / 1000)).toString(), 600, 200, "white");
	}
}

// Once the question is asked, we draw all the speech bubbles to answer it
function QuizRenderAfterQuestion() {
	
	// Draw the question from the quiz leader
	DrawImage("C999_Common/Quiz/Images/QuestionBubble.png", 425, 100);
	DrawText(QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionText], 600, 180, "black");

	// Draw the think bubble which which will give a better clue with each second
	DrawImage("C999_Common/Quiz/Images/ThinkBubble.png", 0, 0);
	if (QuizTimer <= QuizBeforeAnswerTime) DrawText("...", 150, 75, "black");
	else {
		var AnswerProg = Math.floor((QuizTimer - QuizBeforeAnswerTime) / QuizAnswerProgressTime);
		if (QuizAnswerProgressTime > 0) DrawText(QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionAnswer1].substring(0, AnswerProg), 150, 75, "black");
		else DrawText("???", 150, 75, "black");
	}

	// Draw all four answers (or only one if the player chose to answer)
	for(var a = 0; a <= 3; a++)	{
		var col = "#BB0000";
		var txt = "...";
		var img = "PossibleAnswerBubble";
		if ((MouseX >= 0) && (MouseX <= 250) && (MouseY >= 200 + (a * 100)) && (MouseY <= 250 + (a * 100))) { col = "#00BB00"; img = "AnswerBubble"; }
		if (QuizTimer >= QuizBeforeAnswerTime) txt = QuizAnswer[a];
		DrawImage("C999_Common/Quiz/Images/" + img + ".png", 0, 200 + (a * 100));
		DrawText(txt, 122, 225 + (a * 100), col);
	}

}

// Once the answer is given, the leader confirms and one of the participant gets hit
function QuizRenderAfterAnswer() {

	// On the first phase, an opponent answers and the leader confirms
	if (QuizTimer + (QuizOtherQuestionTime / 2) < QuizBetweenQuestionTimer) {

		// Draw the answer bubble from the left side
		if ((QuizAnswerText != "") && (QuizAnswerBy == "Left")) {
			DrawImage("C999_Common/Quiz/Images/AnswerBubble.png", 0, 75);
			DrawText(QuizAnswerText, 122, 100, "black");
		}

		// Draw the answer bubble from the left side
		if ((QuizAnswerText != "") && (QuizAnswerBy == "Right")) {
			DrawImageMirror("C999_Common/Quiz/Images/AnswerBubble.png", 1200, 75);
			DrawText(QuizAnswerText, 1078, 100, "black");
		}
		
		// The leader yells if the answer is correct or not but doesn't give the correct answer
		var txt = GetCSVText(QuizText, "GoodAnswer");
		if (QuizAnswerText != QuizQuestion[QuizProgressLeft + QuizProgressRight - 1][QuizQuestionAnswer1]) txt = GetCSVText(QuizText, "BadAnswer");
		DrawImage("C999_Common/Quiz/Images/YellBubble.png", 500, 200);
		DrawText(txt, 600, 238, "black");

	} else {

		// Depending on who gave the correct answer, someone gets hit
		if ((QuizAnswerText != QuizQuestion[QuizProgressLeft + QuizProgressRight - 1][QuizQuestionAnswer1]) && (QuizAnswerBy == "Left")) QuizImageActionActorLeft = "_Hit";
		if ((QuizAnswerText != QuizQuestion[QuizProgressLeft + QuizProgressRight - 1][QuizQuestionAnswer1]) && (QuizAnswerBy == "Right")) QuizImageActionActorRight = "_Hit";
		if ((QuizAnswerText == QuizQuestion[QuizProgressLeft + QuizProgressRight - 1][QuizQuestionAnswer1]) && (QuizAnswerBy == "Left")) QuizImageActionActorRight = "_Hit";
		if ((QuizAnswerText == QuizQuestion[QuizProgressLeft + QuizProgressRight - 1][QuizQuestionAnswer1]) && (QuizAnswerBy == "Right")) QuizImageActionActorLeft = "_Hit";
		if (QuizImageActionActorLeft == "_Hit") QuizImageActionActorLeader = "_HitLeft";
		if (QuizImageActionActorRight == "_Hit") QuizImageActionActorLeader = "_HitRight";

	}

}

// Renders the end of the quiz
function QuizRenderEnd() {
	DrawText(Common_PlayerName + ": " + QuizProgressLeft.toString(), 600, 60, "white");
	DrawText(QuizActorRight + ": " + QuizProgressRight.toString(), 600, 120, "white");
	if (QuizProgressRight == 0) DrawText(GetCSVText(QuizText, "Perfect"), 600, 200, "white");
	else if (QuizProgressLeft > QuizProgressRight) DrawText(GetCSVText(QuizText, "Victory"), 600, 200, "white");
	else DrawText(GetCSVText(QuizText, "Defeat"), 600, 200, "white");	
}

// Prepare the next quiz question if needed
function QuizNextQuestion() {
	if ((QuizTimer >= QuizBetweenQuestionTimer) && (QuizBetweenQuestionTimer > 0)) {
		if ((QuizProgressLeft >= QuizGoal) || (QuizProgressRight >= QuizGoal)) QuizEnded = true;
		QuizTimer = QuizOtherQuestionTime * -1;
		QuizAnswerText = "";
		QuizAnswerBy = "";
		QuizBetweenQuestionTimer = 0;
		QuizAnswer = null;
		QuizImageActionActorLeader = "";
		QuizRightActorAnswerTimer = 0;
	}	
}

// Checks if the right answer should answer
function QuizRightActorAnswer() {
	
	// Sets the timer when the right actor will answer if needed
	if (QuizRightActorAnswerTimer == 0) {
		if (QuizDifficultyText == "Easy") QuizRightActorAnswerTimer = Math.floor(QuizBeforeAnswerTime * 2.0 + Math.random() * QuizBeforeAnswerTime * 3.0);
		if (QuizDifficultyText == "Normal") QuizRightActorAnswerTimer = Math.floor(QuizBeforeAnswerTime * 1.75 + Math.random() * QuizBeforeAnswerTime * 2.0);
		if (QuizDifficultyText == "Hard") QuizRightActorAnswerTimer = Math.floor(QuizBeforeAnswerTime * 1.5 + Math.random() * QuizBeforeAnswerTime * 1.0);
	}
	
	// If the right actor is ready to answer, the answer is correct by default, 50% random if easy, 25% random if normal
	if ((QuizTimer > QuizRightActorAnswerTimer) && (QuizAnswerText == "") && (QuizTimer > 0)) {
		var ans = QuizQuestionAnswer1;
		if ((QuizDifficultyText == "Easy") && (Math.floor(Math.random() * 2) == 0)) ans = Math.floor(Math.random() * 4) + QuizQuestionAnswer1;
		if ((QuizDifficultyText == "Normal") && (Math.floor(Math.random() * 4) == 0)) ans = Math.floor(Math.random() * 4) + QuizQuestionAnswer1;
		QuizAnswerText = QuizQuestion[QuizProgressLeft + QuizProgressRight][ans];
		QuizAnswerBy = "Right";
		QuizBetweenQuestionTimer = QuizTimer + QuizOtherQuestionTime;
		if (QuizAnswerText == QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionAnswer1]) QuizProgressRight++;
		else QuizProgressLeft++;
	}
	
}

// Paints the background and the actors, also resets the opponents actions if needed
function QuizRender() {
	if ((QuizTimer >= (QuizOtherQuestionTime * -1 / 2)) && (QuizTimer <= 0) && (QuizImageActionActorLeft != "")) QuizImageActionActorLeft = "";
	if ((QuizTimer >= (QuizOtherQuestionTime * -1 / 2)) && (QuizTimer <= 0) && (QuizImageActionActorRight != "")) QuizImageActionActorRight = "";
	DrawImage("C999_Common/Quiz/Backgrounds/" + QuizBackgroundImage + ".jpg", 0, 0);
	DrawImageZoom("C999_Common/Quiz/Actors/" + QuizActorLeft + "/" + QuizImageActorLeft + QuizImageActionActorLeft + ".png", 0, 0, 600, 900, 150, 0, 600 * 0.675, 900 * 0.675);
	DrawImageZoomMirror("C999_Common/Quiz/Actors/" + QuizActorRight + "/" + QuizImageActorRight + QuizImageActionActorRight + ".png", 0, 0, 600, 900, 650, 0, 600 * 0.675, 900 * 0.675);
	DrawImage("C999_Common/Quiz/Actors/" + QuizActorLeader + "/" + QuizImageActorLeader + "_Leader" + QuizImageActionActorLeader + ".png", 375, 150);	
}

// Render the quiz scene
function C999_Common_Quiz_Run() {

	// Shuffles the questions if needed
	if (!QuizShuffleDone && (QuizQuestion != null)) {
		QuizQuestion = ArrayShuffle(QuizQuestion);
		QuizShuffleDone = true;
	}

	// Prepare the questions and answers
	QuizNextQuestion();
	QuizPrepareAnswers();
	QuizRightActorAnswer();
	
	// Increments the quiz timer and paints the background
	if (!QuizEnded) QuizTimer = QuizTimer + RunInterval;
	QuizRender();

	// Renders the correct scene, depending on the progress
	if (QuizEnded) QuizRenderEnd();
	else if (QuizTimer < 0) QuizRenderBeforeQuestion();
	else if (QuizBetweenQuestionTimer == 0) QuizRenderAfterQuestion();
	else QuizRenderAfterAnswer();

}

// When a click is done while in the quiz
function C999_Common_Quiz_Click() {

	// When the quiz is over, one last click will exit from the scene 
	if ((QuizEnded) && (MouseX >= 0) && (MouseX <= 1200) && (MouseY >= 0) && (MouseY <= 600)) {
		CurrentChapter = QuizBackupChapter;
		CurrentScreen = QuizBackupScreen;
		DynamicFunction(QuizEndFunction + "(" + (QuizProgressLeft >= QuizProgressRight).toString() + ")");
		return;
	}

	// If an answer can be given by the player (the speech bubbles must be visible)
	if ((QuizTimer >= QuizBeforeAnswerTime) && (QuizBetweenQuestionTimer == 0))
		for(var a = 0; a <= 3; a++)
			if ((MouseX >= 0) && (MouseX <= 300) && (MouseY >= 200 + (a * 100)) && (MouseY <= 250 + (a * 100))) {
				QuizAnswerText = QuizAnswer[a];
				QuizAnswerBy = "Left";
				QuizBetweenQuestionTimer = QuizTimer + QuizOtherQuestionTime;
				if (QuizAnswerText == QuizQuestion[QuizProgressLeft + QuizProgressRight][QuizQuestionAnswer1]) QuizProgressLeft++;
				else QuizProgressRight++;
			}

}