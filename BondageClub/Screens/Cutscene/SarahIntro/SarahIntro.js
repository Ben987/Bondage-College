"use strict";
var SarahIntroBackground = "SarahIntro";
var SarahIntroDone = false;
var SarahIntroType = "SarahExplore";
var AmandaIntroTime = 0;
var AmandaIntroDone = false;
var SophieIntroTime = 0;
var SophieIntroDone = false;

/**
 * Loads the Sarah/Amanda/Sophie intro cutscene by creating the NPCs and setting the stage based on the current state the player is at in the story
 * @returns {void} - Nothing
 */
function SarahIntroLoad() {
	CutsceneStage = 0;
	if ((SarahIntroType == "SarahExplore") && (SarahStatus != "") && (LogQuery("SarahWillBePunished", "NPC-SarahIntro") || LogQuery("SarahWillBePunished", "NPC-SarahIntro"))) SarahIntroType = "SarahSearch";
	if ((SarahIntroType == "SarahExplore") && (SarahStatus != "") && !LogQuery("SarahWillBePunished", "NPC-SarahIntro") && !LogQuery("SarahWillBePunished", "NPC-SarahIntro")) SarahIntroType = "SarahSurprise";
	if ((SarahIntroType == "AmandaExplore") && (AmandaStatus != "")) SarahIntroType = "AmandaSearch";
	if ((SarahStatus == "Owned") || (SarahStatus == "Curfew")) SarahIntroBackground = "SarahCollarIntro";
	if ((SarahIntroType == "AmandaSearch") || (SarahIntroType == "AmandaExplore"))
		if ((AmandaStatus == "Owned") || (AmandaStatus == "Curfew")) SarahIntroBackground = "AmandaCollarIntro";
		else SarahIntroBackground = "AmandaIntro";
	if (SarahIntroType == "Sophie") SarahIntroBackground = "SophieIntro";
}

/**
 * Runs and draws the Sarah/Amanda/Sophie intro cutscene
 * @returns {void} - Nothing
 */
function SarahIntroRun() {
	TextLoad();
	DrawText(TextGet(SarahIntroType + CutsceneStage.toString()), 1000, 980, (SarahIntroType.indexOf("Sarah") >= 0) ? "Black" : "White", (SarahIntroType.indexOf("Sarah") >= 0) ? "White" : "Black");
}

/**
 * Handles clicks during the Sarah/Amanda/Sophie intro cutscene. Clicking anywhere on the screen advances the cutscene. At the end of the cutscene, the player is sent back to Sarah's room.
 * @returns {void} - Nothing
 */
function SarahIntroClick() {
	CutsceneStage++;
	if ((CutsceneStage > 3) && (SarahIntroType == "Sophie")) CommonSetScreen("Room", "Sarah");
	if (CutsceneStage > 5) CommonSetScreen("Room", "Sarah");
}