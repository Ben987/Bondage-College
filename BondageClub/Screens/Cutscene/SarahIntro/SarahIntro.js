"use strict";
var SarahIntroBackground = "SarahIntro";
var SarahIntroDone = false;
var SarahIntroType = "SarahExplore";
var AmandaIntroTime = 0;
var AmandaIntroDone = false;
var SophieIntroTime = 0;
var SophieIntroDone = false;

// Loads the Sarah/Amanda/Sophie intro cutscene
function SarahIntroLoad() {
	CutsceneStage = 0;
	if ((SarahIntroType == "SarahExplore") && (SarahStatus != "") && (LogQuery("SarahWillBePunished", "NPC-SarahIntro") || LogQuery("SarahWillBePunished", "NPC-SarahIntro"))) SarahIntroType = "SarahSearch";
	if ((SarahIntroType == "SarahExplore") && (SarahStatus != "") && !LogQuery("SarahWillBePunished", "NPC-SarahIntro") && !LogQuery("SarahWillBePunished", "NPC-SarahIntro")) SarahIntroType = "SarahSurprise";
	if ((SarahIntroType == "AmandaExplore") && (AmandaStatus != "")) SarahIntroType = "AmandaSearch";
	if ((SarahStatus == "Owned") || (SarahStatus == "Curfew")) SarahIntroBackground = "SarahCollarIntro";
	if ((SarahIntroType == "AmandaSearch") || (SarahIntroType == "AmandaExplore"))
		if ((AmandaStatus == "Owned") || (AmandaStatus == "Curfew")) SarahIntroBackground = "AmandaCollarIntro";
		else SarahIntroBackground = "AmandaIntro";
}

// Runs the cutscene
function SarahIntroRun() {
	TextLoad();
	DrawText(TextGet(SarahIntroType + CutsceneStage.toString()), 1000, 980, (SarahIntroType.indexOf("Sarah") >= 0) ? "Black" : "White", (SarahIntroType.indexOf("Sarah") >= 0) ? "White" : "Black");
}

// When the user clicks in the cutscene
function SarahIntroClick() {
	CutsceneStage++;
	if (CutsceneStage > 5) CommonSetScreen("Room", "Sarah");
}