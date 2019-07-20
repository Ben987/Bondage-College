"use strict";
var CellBackground = "Cell";
var CellMinutes = 5;
var CellOpenTimer = 0;

// Loads the cell screen
function CellLoad() {
	CharacterSetActivePose(Player, null);
	CellOpenTimer = LogValue("Locked", "Cell")
	if (CellOpenTimer == null) CellOpenTimer = 0;
	if (CellOpenTimer > CurrentTime + 3600000) {
		LogDelete("Locked", "Cell");
		CellOpenTimer = 0;
	}
}

// Run the cell screen
function CellRun() {
	DrawCharacter(Player, 750, 0, 1);
	if (CellOpenTimer < CurrentTime) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Leave"));
	if (Player.CanKneel() && (CellOpenTimer > CurrentTime)) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Kneel.png", TextGet("Kneel"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (CellOpenTimer < CurrentTime) DrawButton(1885, 265, 90, 90, "", "White", "Icons/Cell.png", TextGet("Lock"));
	if (CellOpenTimer < CurrentTime) DrawButton(1885, 385, 90, 90, "", "White", "Icons/Plus.png", TextGet("AddTime"));
	if (CellOpenTimer < CurrentTime) DrawButton(1885, 505, 90, 90, "", "White", "Icons/Minus.png", TextGet("RemoveTime"));
	if (CellOpenTimer < CurrentTime) DrawText(TextGet("Timer") + " " + CellMinutes.toString() + " " + TextGet("Minutes"), 1620, 920, "White", "Black");
	else DrawText(TextGet("OpensIn") + " " + TimerToString(CellOpenTimer - CurrentTime), 1620, 920, "White", "Black");
}

// When the user clicks in the cell screen
function CellClick() {
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanKneel() && (CellOpenTimer > CurrentTime)) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null);
	if ((MouseX >= 750) && (MouseX < 1250) && (MouseY >= 0) && (MouseY < 1000)) CharacterSetCurrent(Player);
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) InformationSheetLoadCharacter(Player);
	if (CellOpenTimer < CurrentTime) {
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115)) CommonSetScreen("Room", "MainHall");
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 265) && (MouseY < 355)) CellLock(CellMinutes);
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 385) && (MouseY < 475) && (CellMinutes < 60)) CellMinutes = CellMinutes + 5;
		if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 505) && (MouseY < 595) && (CellMinutes > 5)) CellMinutes = CellMinutes - 5;
	}
}

// When the player gets locked in the cell
function CellLock(LockTime) {
	LogAdd("Locked", "Cell", CurrentTime + LockTime * 60000);
	CommonSetScreen("Room", "Cell");
}