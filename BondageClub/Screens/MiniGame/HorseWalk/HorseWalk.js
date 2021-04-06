"use strict";
var HorseWalkBackground = "HorseStableLight";
var HorseWalkCarrots = null;
var HorseWalkCrops = null;
var HorseWalkHurdle = null;
var HorseWalkPlayerX = 0;
var HorseWalkPlayerY = 0;
var HorseWalkItemSize = 100;
var HorseWalkCollectedCarrots = 0;
var HorseWalkCollectedCrops = 0;
var HorseWalkHurdleWin = 0;
var HorseWalkHurdleFail = 0;
var HorseWalkHitPony = 0;
var HorseWalkHitTrainer = 0;
var HorseWalkDrawPony = false;
var HorseWalkDrawTrainer = false;
var HorseWalkDrawXPosition = 0;
var HorseWalkDrawYPosition = 0;
var HorseWalkDrawYHeigh = 0;
var HorseWalkDrawCaracter = 0;
var HorseWalkSpeed = 1;
var HorseWalkText =""
var HorseWalkEventTimer = 0;

/**
 * Generates all the carrots and crops
 * @param {number} MaxCarrot - Maximum number of carrots to generate
 * @param {number} MaxCrop - Maximum number of crops to generate
 * @returns {void} - Nothing
 */
function HorseWalkGenerateCarrotItems(MaxCarrot, MaxCrop) {
	// Fill the Carrots sequence
	HorseWalkCarrots = [];
	for (let S = 0; S < MaxCarrot; S++) {
		// Generates each Carrot 1 by 1
		var NewCarrot = {
			X : Math.floor(Math.random() * 1980) + 10,
			Y : Math.floor(Math.random() * 940) + 10,
		}
		HorseWalkCarrots.push(NewCarrot);
	}
	// Fill the Crops sequence
	HorseWalkCrops = [];
	for (let S = 0; S < MaxCrop; S++) {
		// Generates each Carrot 1 by 1
		var NewCrop = {
			X : Math.floor(Math.random() * 1980) + 10,
			Y : Math.floor(Math.random() * 940) + 10,
		}
		HorseWalkCrops.push(NewCrop);
	}

}

/**
 * Generates all the Hurdles for the basic hurdle difficulty
 * @param {number} MaxHurdle - Maximum number of hurdles to generate
 * @returns {void} - Nothing
 */
function HorseWalkGenerateHurdleItems(MaxHurdle) {
	HorseWalkHurdle = [];
	for (let S = 0; S < MaxHurdle; S++) {
		// Generates each Hurdle 1 by 1
		var NewHurdle = {
			X : 1000 + 800*Math.cos((Math.PI*2)/MaxHurdle*S),
			Y : 550 + 350*Math.sin((Math.PI*2)/MaxHurdle*S),
			Stat : 0 
		}
		HorseWalkHurdle.push(NewHurdle);
	}
}

/**
 * Generates all the Hurdles for the hurdle training difficulty
 * @param {number} MaxHurdle - Maximum number of hurdles to generate
 * @returns {void} - Nothing
 */
function HorseWalkGenerateHurdleTrainingItems(MaxHurdle) {
	HorseWalkHurdle = [];
	for (let S = 0; S < MaxHurdle; S++) {
		// Generates each Hurdle 1 by 1
		var NewHurdle = {
			X : 1150 + 700*Math.cos((Math.PI*2)/MaxHurdle*S),
			Y : 550 + 350*Math.sin((Math.PI*2)/MaxHurdle*S),
			Stat : 0 
		}
		HorseWalkHurdle.push(NewHurdle);
	}
}

/**
 * Draws the carrots & crops, or hurdles based on the current difficulty/mode
 * @returns {void} - Nothing
 */
function HorseWalkDrawItem() {
	if (MiniGameDifficulty == "Carrot") {
		for (let S = 0; S < HorseWalkCarrots.length; S++)
			DrawImage("Screens/MiniGame/HorseWalk/carrot.png", HorseWalkCarrots[S].X - (HorseWalkItemSize / 2), HorseWalkCarrots[S].Y - (HorseWalkItemSize / 2));
		for (let S = 0; S < HorseWalkCrops.length; S++)
			DrawImage("Screens/MiniGame/HorseWalk/LeatherCrop.png", HorseWalkCrops[S].X - (HorseWalkItemSize / 2), HorseWalkCrops[S].Y - (HorseWalkItemSize / 2));
	} else if (MiniGameDifficulty == "Hurdle" || MiniGameDifficulty == "HurdleTraining") {
		for (let S = 0; S < HorseWalkHurdle.length; S++) {
			if (HorseWalkHurdle[S].Stat == 0) {	
				DrawImage("Screens/MiniGame/HorseWalk/hurdle_90.png", HorseWalkHurdle[S].X - (HorseWalkItemSize / 2), HorseWalkHurdle[S].Y - (HorseWalkItemSize / 2));
			} else if (HorseWalkHurdle[S].Stat == 1) {	
				DrawImage("Screens/MiniGame/HorseWalk/hurdle_90_win.png", HorseWalkHurdle[S].X - (HorseWalkItemSize / 2), HorseWalkHurdle[S].Y - (HorseWalkItemSize / 2));
			} else if (HorseWalkHurdle[S].Stat == -1) {	
				DrawImage("Screens/MiniGame/HorseWalk/hurdle_90_fail.png", HorseWalkHurdle[S].X - (HorseWalkItemSize / 2), HorseWalkHurdle[S].Y - (HorseWalkItemSize / 2));
			}
		}
	}
}

/**
 * Loads the Horse Walk mini game and generate the items, there are more carrots on harder difficulties and there are less of them overall on mobile because it is hard (no mouse swiping)
 * @returns {void} - Nothing
 */
function HorseWalkLoad() {

	HorseWalkBackground = "HorseStable";

	HorseWalkPlayerX = 900;
	HorseWalkPlayerY = 400;
	var Factor = (CommonIsMobile) ? 0.25 : 1;
	if (MiniGameDifficulty == "Carrot") {
		var MaxCarrot = 12 * Factor;
		HorseWalkGenerateCarrotItems(MaxCarrot, MaxCarrot);
		HorseWalkCollectedCarrots = 0;
		HorseWalkCollectedCrops = 0;
	} else if (MiniGameDifficulty == "Hurdle") {
		let MaxHurdle = 12;
		HorseWalkGenerateHurdleItems(MaxHurdle);
		HorseWalkHurdleWin = 0;
		HorseWalkHurdleFail = 0;
	} else if (MiniGameDifficulty == "HurdleTraining") {
		let MaxHurdle = 12;
		HorseWalkGenerateHurdleTrainingItems(MaxHurdle);
		HorseWalkHurdleWin = 0;
		HorseWalkHurdleFail = 0;
	} else if (MiniGameDifficulty == "WhipPony") {
		HorseWalkHitPony = 0;
		HorseWalkHitTrainer = 0;
		HorseWalkEventTimer = CommonTime();
	}
	MiniGameTimer = CommonTime() + 40000;
	HorseWalkSpeed = 1 + SkillGetLevel(Player, "Dressage")/5;
}

/**
 * Runs the horse walk mini game and draws the characters and items on screen
 * @returns {void} - Nothing
 */
function HorseWalkRun() {

	// The game ends in victory if the time runs out
	var Time = CommonTime();
	if (!MiniGameEnded && (Time >= MiniGameTimer)) {
		if (MiniGameDifficulty == "Carrot") {
			if (HorseWalkCollectedCarrots > HorseWalkCollectedCrops) {
				let HorseWalkSkillProgress = (HorseWalkCollectedCarrots - HorseWalkCollectedCrops) * 5;
				SkillProgress("Dressage",  HorseWalkSkillProgress);
				HorseWalkEnd(true);
			} else {
				HorseWalkEnd(false);
			}
		} else if (MiniGameDifficulty == "Hurdle" || MiniGameDifficulty == "HurdleTraining") {
			if (HorseWalkHurdleWin > 0 && HorseWalkHurdleFail < 1) {
				let HorseWalkSkillProgress = HorseWalkHurdleWin * 6;
				SkillProgress("Dressage",  HorseWalkSkillProgress);
				HorseWalkEnd(true);
			} else if (HorseWalkHurdleWin > HorseWalkHurdleFail) {
				let HorseWalkSkillProgress = HorseWalkHurdleWin * 4;
				SkillProgress("Dressage",  HorseWalkSkillProgress);
				HorseWalkEnd(true);
			} else {
				let HorseWalkSkillProgress = HorseWalkHurdleWin * 2;
				SkillProgress("Dressage",  HorseWalkSkillProgress);
				HorseWalkEnd(false);
			}
		} else if (MiniGameDifficulty == "WhipPony") {
			if (HorseWalkHitPony > 0 && HorseWalkHitTrainer < 1) {
				let HorseWalkSkillProgress = HorseWalkHitPony * 4;
				SkillProgress("Dressage",  HorseWalkSkillProgress);
				HorseWalkEnd(true);
			} else if (HorseWalkHitPony > HorseWalkHitTrainer) {
				let HorseWalkSkillProgress = HorseWalkHitPony * 3;
				SkillProgress("Dressage",  HorseWalkSkillProgress);
				HorseWalkEnd(true);
			} else {
				let HorseWalkSkillProgress = HorseWalkHitPony * 2;
				SkillProgress("Dressage",  HorseWalkSkillProgress);
				HorseWalkEnd(false);
			}
		}
	}
	if (Time >= MiniGameTimer + 5000) CommonDynamicFunction(MiniGameReturnFunction + "()");

	if (!MiniGameEnded) DrawProgressBar(0, 950, 2000, 50, (MiniGameTimer - Time) / 400);
	else DrawRect(0, 950, 2000, 50, "white");

	if (MiniGameDifficulty == "WhipPony") {
		if (HorseWalkEventTimer < CommonTime()) {
			if (HorseWalkDrawPony == true && !MiniGameEnded) HorseWalkHitTrainer++;
			HorseWalkEventTimer = CommonTime() + 1000;
			if (!MiniGameEnded) {
				HorseWalkDrawXPosition = Math.floor(Math.random() * 1500);
				HorseWalkDrawYHeigh = Math.floor(Math.random() * 750) + 250;
				HorseWalkDrawYPosition = Math.floor(Math.random() * (1000 - HorseWalkDrawYHeigh));
			}
			HorseWalkDrawCaracter = Math.floor(Math.random() * 5);
			if (HorseWalkDrawCaracter == 0) {
				HorseWalkDrawPony = false;
				HorseWalkDrawTrainer = true; 
			} else if (HorseWalkDrawCaracter == 1) {
				HorseWalkDrawPony = true;
				HorseWalkDrawTrainer = false; 
			} else if (HorseWalkDrawCaracter > 1) {
				HorseWalkDrawPony = false;
				HorseWalkDrawTrainer = false; 
			}
		}
		if (HorseWalkDrawPony) DrawCharacter(StablePony, HorseWalkDrawXPosition, HorseWalkDrawYPosition, HorseWalkDrawYHeigh/1000);
		if (HorseWalkDrawTrainer) DrawCharacter(StableTrainer, HorseWalkDrawXPosition, HorseWalkDrawYPosition, HorseWalkDrawYHeigh/1000);
		HorseWalkText = TextGet("HorseWalkHitSpots");
		HorseWalkText = HorseWalkText.replace("$PONY", HorseWalkHitPony).replace("$TRAINER", HorseWalkHitTrainer);
		DrawText(HorseWalkText, 1000, 977, "black", "white");
	} else { //Hurdle & Carrot
		// Draw the player character, progress bar and text
		HorseWalkDoMove();
		if (MiniGameDifficulty == "HurdleTraining") {
			DrawCharacter(Player, 0, 100, 0.8);
			DrawCharacter(StablePony, HorseWalkPlayerX, HorseWalkPlayerY, 0.4);
		} else {
			DrawCharacter(Player, HorseWalkPlayerX, HorseWalkPlayerY, 0.4);
		}
		HorseWalkDrawItem();
		if (Time < MiniGameTimer) {
			if (MiniGameDifficulty == "Carrot") {
				HorseWalkText = TextGet("HorseWalkCarrotSpots");
				HorseWalkText = HorseWalkText.replace("$CARROTS", HorseWalkCollectedCarrots).replace("$CROPS", HorseWalkCollectedCrops);
			} else if (MiniGameDifficulty == "Hurdle" || MiniGameDifficulty == "HurdleTraining") {
				HorseWalkText = TextGet("HorseWalkHurdleSpots");
				HorseWalkText = HorseWalkText.replace("$HURDLEWIN", HorseWalkHurdleWin).replace("$HURDLEFAIL", HorseWalkHurdleFail);
			}
		} else {
			if (MiniGameDifficulty == "Carrot") {
				HorseWalkText = TextGet(MiniGameVictory ? "CarrotVictory" : "CarrotDefeat");
				HorseWalkText = HorseWalkText.replace("$CARROTS", HorseWalkCollectedCarrots).replace("$CROPS", HorseWalkCollectedCrops);
			} else if (MiniGameDifficulty == "Hurdle" || MiniGameDifficulty == "HurdleTraining") {
				HorseWalkText = TextGet(MiniGameVictory ? "HurdleVictory" : "HurdleDefeat");
				HorseWalkText = HorseWalkText.replace("$HURDLEWIN", HorseWalkHurdleWin).replace("$HURDLEFAIL", HorseWalkHurdleFail);
			}
		}
		DrawText(HorseWalkText, 1000, 977, "black", "white");
	}
}

/**
 * Ends the game and sends the result back to the screen
 * @param {boolean} Victory - Whether or not the player has won
 * @returns {void} - Nothing
 */
function HorseWalkEnd(Victory) {
	MiniGameVictory = Victory;
	MiniGameEnded = true;
	MiniGameTimer = CommonTime();
}

/**
 * Validates the clicks during the horse walk mini game for mobile, moves the character and validates touched items
 * @returns {void} - Nothing
 */
function HorseWalkDoMove() {

	// If the position changed
	if (((HorseWalkPlayerX != MouseX - 100) || (HorseWalkPlayerY != MouseY - 100)) && (MouseX >= 0) && (MouseY >= 0)) {
		
		if (HorseWalkPlayerX > (MouseX - 100 + HorseWalkSpeed) ) {
			HorseWalkPlayerX -= HorseWalkSpeed;
		} else if (HorseWalkPlayerX < (MouseX - 100 - HorseWalkSpeed)) {
			HorseWalkPlayerX += HorseWalkSpeed;
		} else {
			HorseWalkPlayerX = MouseX - 100;
		}

		if (HorseWalkPlayerY > (MouseY - 100 + HorseWalkSpeed)) {
			HorseWalkPlayerY -= HorseWalkSpeed;
		} else if ((HorseWalkPlayerY) < (MouseY - 100 - HorseWalkSpeed)) {
			HorseWalkPlayerY += HorseWalkSpeed;
		} else {
			HorseWalkPlayerY = MouseY - 100;
		}

		var Range = ((CommonIsMobile) ? (HorseWalkItemSize / 1.5) : (HorseWalkItemSize / 2));

		// If the game has started, we check the click position and change a Item at that position
		if (!MiniGameEnded) {
			if (MiniGameDifficulty == "Carrot") {
				for (let S = 0; S < HorseWalkCarrots.length; S++) {
					if (((HorseWalkPlayerX+100) >= HorseWalkCarrots[S].X - Range) && ((HorseWalkPlayerX+100) <= HorseWalkCarrots[S].X + Range) && ((HorseWalkPlayerY+100) >= HorseWalkCarrots[S].Y - Range) && ((HorseWalkPlayerY+100) <= HorseWalkCarrots[S].Y + Range)) {
						HorseWalkCarrots.splice(S, 1);
						HorseWalkCollectedCarrots++;
						return;
					}
				}
				for (let S = 0; S < HorseWalkCrops.length; S++) {
					if (((HorseWalkPlayerX+100) >= HorseWalkCrops[S].X - Range) && ((HorseWalkPlayerX+100) <= HorseWalkCrops[S].X + Range) && ((HorseWalkPlayerY+100) >= HorseWalkCrops[S].Y - Range) && ((HorseWalkPlayerY+100) <= HorseWalkCrops[S].Y + Range)) {
						HorseWalkCrops.splice(S, 1);
						HorseWalkCollectedCrops++;
						return;
					}
				}
			} else if (MiniGameDifficulty == "Hurdle" || MiniGameDifficulty == "HurdleTraining") {
				for (let S = 0; S < HorseWalkHurdle.length; S++) {
					if (((HorseWalkPlayerX+100) >= HorseWalkHurdle[S].X - Range) && ((HorseWalkPlayerX+100) <= HorseWalkHurdle[S].X + Range) && ((HorseWalkPlayerY+300) >= HorseWalkHurdle[S].Y - Range) && ((HorseWalkPlayerY+300) <= HorseWalkHurdle[S].Y + Range) && HorseWalkHurdle[S].Stat == 0) {
						if ((Math.random() * Math.random() * 10) < SkillGetLevel(Player, "Dressage")) {
							HorseWalkHurdle[S].Stat = 1;
							HorseWalkHurdleWin++;
						} else {
							HorseWalkHurdle[S].Stat = -1;
							HorseWalkHurdleFail++;
						}
						return;
					}
				}
			}			
		}
	}

}

/**
 * Handles click events during the horse walk mini game. On mobile we move the player on click.
 * @returns {void} - Nothing
 */
function HorseWalkClick() {
	if (MiniGameDifficulty == "WhipPony") {
		if ((MouseX >= HorseWalkDrawXPosition) && (MouseX < (HorseWalkDrawXPosition + (HorseWalkDrawYHeigh / 2))) && (MouseY >= HorseWalkDrawYPosition) && (MouseY < (HorseWalkDrawYPosition + HorseWalkDrawYHeigh))) {
			if (HorseWalkDrawPony && !MiniGameEnded) {
				HorseWalkHitPony++;
				HorseWalkDrawPony = false;
			}
			if (HorseWalkDrawTrainer && !MiniGameEnded) {
				HorseWalkHitTrainer++;
				HorseWalkDrawTrainer = false;
			}
		}
	} else {
		if (CommonIsMobile) HorseWalkDoMove();
	}
}