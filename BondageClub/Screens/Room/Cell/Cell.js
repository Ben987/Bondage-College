"use strict";
var CellBackground = "Cell";
var CellMinutes = 5;
var CellOpenTimer = 0;
var CellKeyDepositStaff = null;

/**
 * Loads the cell screen and its NPC, then checks if it should be locked or not
 * @returns {void} - Nothing
 */
function CellLoad() {
	CellKeyDepositStaff = CharacterLoadNPC("NPC_Cell_KeyDepositStaff");
	CellKeyDepositStaff.AllowItem = false;
	CharacterSetActivePose(Player, null);
	CellOpenTimer = LogValue("Locked", "Cell");
	if (CellOpenTimer == null) CellOpenTimer = 0;
	if (CellOpenTimer > CurrentTime + 3600000) {
		LogDelete("Locked", "Cell");
		CellOpenTimer = 0;
	}
}

/**
 * Runs and draws the cell screen
 * @returns {void} - Nothing
 */
function CellRun() {
	DrawCharacter(Player, 750, 0, 1);
	if (CellOpenTimer < CurrentTime) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Leave"));
	if (Player.CanKneel() && (CellOpenTimer > CurrentTime)) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Kneel.png", TextGet("Kneel"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (CellOpenTimer < CurrentTime) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Cell.png", TextGet("Lock"));
	if (CellOpenTimer < CurrentTime) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Plus.png", TextGet("AddTime"));
	if (CellOpenTimer < CurrentTime) DrawButton(1885, 505, 90, 90, "", "White", "Icons/Minus.png", TextGet("RemoveTime"));
	if (CellOpenTimer < CurrentTime) DrawButton(1885, 625, 90, 90, "", "White", "Icons/Chest.png", TextGet("KeyDeposit"));
	if (CellOpenTimer < CurrentTime) DrawText(TextGet("Timer") + " " + CellMinutes.toString() + " " + TextGet("Minutes"), 1620, 920, "White", "Black");
	else DrawText(TextGet("OpensIn") + " " + TimerToString(CellOpenTimer - CurrentTime), 1620, 920, "White", "Black");
}

/**
 * Handles clicks in the cell screen
 * @returns {void} - Nothing
 */
function CellClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanKneel() && (CellOpenTimer > CurrentTime)) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null, true);
	if (MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	if (CellOpenTimer < CurrentTime) {
		if (MouseIn(1885, 25, 90, 90)) CommonSetScreen("Room", "MainHall");
		if (MouseIn(1885, 265, 90, 90)) CellLock(CellMinutes);
		if (MouseIn(1885, 385, 90, 90) && (CellMinutes < 60)) CellMinutes = CellMinutes + 5;
		if (MouseIn(1885, 505, 90, 90) && (CellMinutes > 5)) CellMinutes = CellMinutes - 5;
		if (MouseIn(1885, 625, 90, 90)) CharacterSetCurrent(CellKeyDepositStaff);
	}
}

/**
 * Locks the player in the cell for the given amount of time
 * @param {number} LockTime - Number of minutes to be locked for 
 * @returns {void} - Nothing
 */
function CellLock(LockTime) {
	LogAdd("Locked", "Cell", CurrentTime + LockTime * 60000);
	CommonSetScreen("Room", "Cell");
}

/**
 * Takes away the player's keys for the given amount of time
 * @param {number} DepositTime - Number of hours to lose the keys for 
 * @returns {void} - Nothing
 */
function CellDepositKeys(DepositTime) {
	LogAdd("KeyDeposit", "Cell", CurrentTime + DepositTime * 3600000);
}