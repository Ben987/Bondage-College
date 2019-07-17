"use strict";
var EmptyBackground = "MainHall";
var EmptyCharacter = [];

// When used in struggle mode
function EmptyStruggleSuccess() { return (!Player.IsRestrained() && Player.CanTalk() && (CurrentTime < ManagementTimer)) }
function EmptyStruggleFail() { return (CurrentTime >= ManagementTimer) }
function EmptyStruggleProgress() { return ((Player.IsRestrained() || !Player.CanTalk()) && (CurrentTime < ManagementTimer)) }

// Loads the empty room screen
function EmptyLoad() {
}

// Run the empty room screen
function EmptyRun() {
	for (var C = 0; C < EmptyCharacter.length; C++)
		DrawCharacter(EmptyCharacter[C], 1000 - EmptyCharacter.length * 250 + C * 500, 0, 1);
}

// When the user clicks in the empty room screen
function EmptyClick() {
	for (var C = 0; C < EmptyCharacter.length; C++)
		if ((MouseX >= 1000 - EmptyCharacter.length * 250 + C * 500) && (MouseX < 1500 - EmptyCharacter.length * 250 + C * 500) && (MouseY >= 0) && (MouseY < 1000)) 
			CharacterSetCurrent(EmptyCharacter[C]);
}

// Returns to the main hall
function EmptyManagementMainHall() {
	DialogLeave();
	CommonSetScreen("Room", "MainHall");
}

// Locks the player in a cell for 5 minutes
function EmptyManagementCell() {
	DialogLeave();
	CharacterFullRandomRestrain(Player, "ALL");
	CellLock(5);
}