"use strict";

var StableBackground = "HorseStable";

function StableLoad() {
}

function StableRun() {
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png");
	DrawButton(1885, 145, 90, 90, "", "White", "Screens/Room/Stable/Horse.png");

}

function StableClick() {
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 25) && (MouseY < 115) && Player.CanWalk()) CommonSetScreen("Room", "MainHall");
	if ((MouseX >= 1885) && (MouseX < 1975) && (MouseY >= 145) && (MouseY < 235)) StableMiniGameStart("HorseWalk", "Normal");

}

// When the mini game / maid chore starts
function StableMiniGameStart(GameType, Difficulty) {
	MiniGameStart(GameType, Difficulty, "StableMiniGameEnd");
}

// When the mini game ends, we go back to the maid
function StableMiniGameEnd() {
	CommonSetScreen("Room", "Stable");
}
