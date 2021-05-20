"use strict";
var GetUpVelocity = 0;
var GetUpPosition = 0;
var GetUpAcceleration = 0;
var GetUpMaxPosition = 100;
var GetUpGameDuration = 5000;
var GetUpNextTick = 0;
var GetUpText = "";
var GetUpChallenge = 0;
var GetUpBackground = "Introduction";

/**
 * Ends the game and sends the result back to the screen
 * @param {boolean} Victory - Whether or not the player has won
 * @returns {void} - Nothing
 */
function GetUpEnd(Victory) {
	MiniGameVictory = Victory;
	MiniGameEnded = true;
	MiniGameTimer = CommonTime();
}



/**
 * Loads the Get Up mini game
 * @returns {void} - Nothing
 */
function GetUpLoad() {
	GetUpBackground = ChatRoomBackground;

	GetUpVelocity = 0;
	GetUpPosition = 0;
	GetUpAcceleration = 0;
	if (typeof MiniGameDifficulty != "number") {
		MiniGameTimer = CommonTime() + GetUpGameDuration; // 5 seconds base
		GetUpChallenge = 0;
	} else {
		GetUpGameDuration = 5000 + 1000 * (MiniGameDifficulty-SkillGetLevel(Player, "Evasion")*0.33);
		MiniGameTimer = CommonTime() + GetUpGameDuration; // One extra second per challenge level, minus a third of a second per evasion.
		GetUpChallenge = MiniGameDifficulty;
	}

	GetUpMaxPosition = 400 - GetUpChallenge * 40;
}

function GetUpPhysics(delta) {
	var timeElapsed = 3 + (GetUpGameDuration +  CommonTime() - MiniGameTimer) / 2000;

	if (CommonTime() > GetUpNextTick) {
		GetUpNextTick = CommonTime() + 400;
		GetUpAcceleration = -timeElapsed*1 + 1.3*timeElapsed*Math.random();
	}
	GetUpVelocity = Math.min(GetUpVelocity, GetUpVelocity + GetUpAcceleration * 0.25);

	if (Math.abs(GetUpPosition) <= GetUpMaxPosition)
		GetUpPosition += GetUpVelocity / 1000 * delta * 3.5;


	GetUpPosition = Math.max(-GetUpMaxPosition*1.1, Math.min(GetUpPosition, GetUpMaxPosition*1.1));
}

/**
 * Runs the get up mini game and draws the characters and items on screen
 * @returns {void} - Nothing
 */
function GetUpRun() {
	GetUpBackground = ChatRoomBackground;

	DrawRect(0, 0, 1000, 1000, "Black");

	// The game ends if the time runs out
	var Time = CommonTime();
	if (!MiniGameEnded && (Time >= MiniGameTimer)) {
		if (Math.abs(GetUpPosition) > GetUpMaxPosition) {
			GetUpEnd(false);
		} else {
			GetUpEnd(true);
		}
		SkillProgress("Evasion",  GetUpChallenge/2 + 1);
	} else if (Time < MiniGameTimer) {
		GetUpPhysics(TimerRunInterval);
	}
	if (Math.abs(GetUpPosition) > GetUpMaxPosition) {
		MiniGameTimer = Math.min(CommonTime() + 750, MiniGameTimer);
		MiniGameVictory = false;
	}


	DrawProgressBar(500 - GetUpMaxPosition, 500, 2*GetUpMaxPosition, 50, 50*((GetUpPosition + GetUpMaxPosition)/GetUpMaxPosition));
	DrawCharacter(Player, 400 + GetUpPosition, 300, 0.4);



	if (Time < MiniGameTimer) {
		GetUpText = TextGet("GetUpObjective");
	} else {
		if (Math.abs(GetUpPosition) > GetUpMaxPosition) {
			GetUpText = TextGet("GetUpFail");
		} else {
			GetUpText = TextGet("GetUpPass");
		}
	}
	DrawText(GetUpText, 500, 977, "white", "black");


	if (Time >= MiniGameTimer + 750) CommonDynamicFunction(MiniGameReturnFunction + "()");

}

/**
 * Validates the clicks during the horse walk mini game for mobile, moves the character and validates touched items
 * @returns {void} - Nothing
 */
function GetUpClick() {
	//CommonIsMobile
	GetUpVelocity += 20;

}
