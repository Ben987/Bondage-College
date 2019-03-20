"use strict";
var SarahIntroBackground = "SarahIntro";
var SarahIntroDone = false;

// Loads the collaring Mistresses
function SarahIntroLoad() {
	CutsceneStage = 0;
	if ((SarahStatus == "Owned") || (SarahStatus == "Curfew")) SarahIntroBackground = "SarahCollarIntro";
}

// Runs the collaring cutscene
function SarahIntroRun() {
	DrawText(TextGet(((SarahStatus == "") ? "ExploreIntro" : "SarahIntro") + CutsceneStage.toString()), 1000, 980, "Black", "White");
}

// When the user clicks in the management room
function SarahIntroClick() {
	CutsceneStage++;
	if (CutsceneStage > 5) {
		SarahIntroDone = true;
		CommonSetScreen("Room", "Sarah");
	}
}