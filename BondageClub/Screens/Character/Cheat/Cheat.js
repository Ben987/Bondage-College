"use strict";
var CheatBackground = "Sheet";
var CheatAllow = false;
var CheatList = ["DoubleReputation", "DoubleSkill", "DoubleMoney", "DoubleItemSpeed", "BlockRandomKidnap", "SkipTrialPeriod", "AutoShowTraits", "NoLoveDecay", "CantLoseMistress", "FreeCollegeOutfit", "MiniGameBonus", "FreeNPCDress", "ChangeNPCTrait"];
var CheatBonusList = ["DoubleMoney", "DoubleSkill"];
var CheatBonusFactor = 2;
var CheatBonusTime = 1552967946711;
var CheatActivated = [];
var CheatBrowserName = "";
var CheatBrowserVersion = "";
var CheatBrowserTime = 0;

/**
 * Checks if the cheats are valid
 * @returns {void} - Nothing
 */
function CheatValidate() {
	var BI = CommonGetBrowser();
	var Time = CommonTime();
	CheatAllow = (CheatAllow && (BI.Name == CheatBrowserName) && (BI.Version == CheatBrowserVersion) && (Time >= CheatBrowserTime) && (Time <= CheatBrowserTime + 864000000));
}

/**
 * Checks if the cheat is currently active
 * @param {string} CheatName - Name of the cheat to check for
 * @returns {boolean} - Returns TRUE if the cheat is currently active
 */
function CheatActive(CheatName) {
	CheatValidate();
	return (CheatAllow && (CheatActivated.indexOf(CheatName) >= 0));
}

/**
 * Gets the factor for a given cheat. The bonus factor is added if active.
 * @param {string} CheatName - Name of the cheat to check for
 * @param {number} Factor - Bonus factor on top of the cheat
 * @returns {number} - The total factor for the given cheat
 */
function CheatFactor(CheatName, Factor) {
	CheatValidate();
	Factor = (CheatAllow && (CheatActivated.indexOf(CheatName) >= 0)) ? Factor : 1;
	if ((CheatBonusTime >= CurrentTime) && (CheatBonusList.indexOf(CheatName) >= 0)) Factor = Factor * CheatBonusFactor;
	return Factor;
}

/**
 * Imports the cheats from local storage (only works before the game is loaded)
 * @returns {void} - Nothing
 */
function CheatImport() {
	if (MainCanvas == null) {
		CheatAllow = true;
		var BI = CommonGetBrowser();
		CheatBrowserName = BI.Name;
		CheatBrowserVersion = BI.Version;
		CheatBrowserTime = CommonTime();
		for (let C = 0; C < CheatList.length; C++) {
			var AC = localStorage.getItem("BondageClubCheat" + CheatList[C]);
			if ((AC != null) && (AC.toUpperCase() == "TRUE")) CheatActivated.push(CheatList[C]);
		}
	}
}

/**
 * Exports the cheats to local storage. Each one is its own item.
 * @returns {void} - Nothing
 */
function CheatExport() {
	for (let C = 0; C < CheatList.length; C++)
		localStorage.setItem("BondageClubCheat" + CheatList[C], (CheatActivated.indexOf(CheatList[C]) >= 0) ? "true" : "false");
}

/**
 * Runs and draws the cheat screen
 * @returns {void} - Nothing
 */
function CheatRun() {

	// List all the cheats
	MainCanvas.textAlign = "left";
	for (let C = 0; C < CheatList.length; C++) {
		DrawButton(150 + Math.floor(C / 8) * 850, 115 + ((C % 8) * 100), 64, 64, "", "White", CheatActive(CheatList[C]) ? "Icons/Checked.png" : "");
		DrawText(TextGet(CheatList[C]), 250 + Math.floor(C / 8) * 850, 147 + ((C % 8) * 100), "Black", "Gray");		
	}

	// Draw the exit button
	MainCanvas.textAlign = "center";
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

}

/**
 * Handles clicks in the cheat screen.
 * @returns {void} - Nothing
 */
function CheatClick() {
	
	// When the user exits
	if (MouseIn(1815, 75, 90, 90)) CheatExit();
	
	// When the user activates an option
	for (let C = 0; C < CheatList.length; C++)
		if (MouseIn(150 + Math.floor(C / 8) * 850, 115 + ((C % 8) * 100), 64, 64)) {
			var CheatName = CheatList[C];
			if (CheatActivated.indexOf(CheatName) >= 0)
				CheatActivated.splice(CheatActivated.indexOf(CheatName), 1);
			else
				CheatActivated.push(CheatName);
			return;
		}

}

/**
 * Handles exiting the cheat screen by saving the cheats and going back to the login screen.
 * @returns {void} - Nothing
 */
function CheatExit() {
	CheatExport();
	CommonSetScreen("Character", "Login");
}