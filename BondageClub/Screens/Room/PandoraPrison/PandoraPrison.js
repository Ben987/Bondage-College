"use strict";
var PandoraPrisonBackground = "Cell";
var PandoraWillpowerTimer = 0;
var PandoraPrisonMaid = null;
var PandoraPrisonCharacter = null;

/**
 * Loads the Pandora's Box prison screen
 * @returns {void} - Nothing
 */
function PandoraPrisonLoad() {
	if (PandoraPrisonMaid == null) {
		PandoraPrisonMaid = CharacterLoadNPC("NPC_PandoraPrison_Maid");
		PandoraPrisonMaid.AllowItem = false;
		PandoraDress(PandoraPrisonMaid, "Maid");
	}
	if (PandoraWillpowerTimer == 0) PandoraWillpowerTimer = CurrentTime + ((InfiltrationPerksActive("Recovery")) ? 20000 : 30000);
	PandoraMaxWillpower = 20 + (SkillGetLevel(Player, "Willpower") * 2) + (InfiltrationPerksActive("Resilience") ? 5 : 0) + (InfiltrationPerksActive("Endurance") ? 5 : 0);
	PandoraPrisonBackground = Player.Infiltration.Punishment.Background;
	CharacterSetActivePose(Player, null);
}

/**
 * Runs and draws the prison screen
 * @returns {void} - Nothing
 */
function PandoraPrisonRun() {

	// When time is up, a maid comes to escort the player out
	if (Player.Infiltration.Punishment.Timer < CurrentTime)
		PandoraPrisonCharacter = PandoraPrisonMaid;

	// When the timer ticks, we raise willpower by 1
	if (PandoraWillpowerTimer < CurrentTime) {
		if (PandoraWillpower < PandoraMaxWillpower) PandoraWillpower++;
		PandoraWillpowerTimer = PandoraWillpowerTimer + ((InfiltrationPerksActive("Recovery")) ? 20000 : 30000);
	}

	// Draws the character and it's sentence
	if (PandoraPrisonCharacter != null) {
		DrawCharacter(Player, 500, 0, 1);
		DrawCharacter(PandoraPrisonCharacter, 1000, 0, 1);
	} else DrawCharacter(Player, 750, 0, 1);
	if (Player.CanKneel()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Kneel.png", TextGet("Kneel"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (Player.Infiltration.Punishment.Timer > CurrentTime) {
		DrawText(TextGet("Sentence") + " " + Player.Infiltration.Punishment.Minutes.toString() + " " + TextGet("Minutes"), 1800, 870, "White", "Black");
		DrawText(TextGet("EndsIn") + " " + TimerToString(Player.Infiltration.Punishment.Timer - CurrentTime), 1800, 920, "White", "Black");
	}

	// Draw the willpower / max
	DrawProgressBar(1610, 954, 380, 36, Math.round(PandoraWillpower / PandoraMaxWillpower * 100));
	DrawText(PandoraWillpower.toString(), 1800, 973, "black", "white");

}

/**
 * Handles clicks in the prison screen
 * @returns {void} - Nothing
 */
function PandoraPrisonClick() {
	if (MouseIn(1885, 25, 90, 90) && Player.CanKneel()) CharacterSetActivePose(Player, (Player.ActivePose == null) ? "Kneel" : null, true);
	if ((PandoraPrisonCharacter == null) && MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if ((PandoraPrisonCharacter != null) && MouseIn(500, 0, 500, 1000)) CharacterSetCurrent(Player);
	if ((PandoraPrisonCharacter != null) && MouseIn(1000, 0, 500, 1000)) CharacterSetCurrent(PandoraPrisonCharacter);
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
}

/**
 * When the player gets fully released by a maid
 * @returns {void} - Nothing
 */
function PandoraPrisonReleasePlayer() {
	CharacterRelease(Player);
	CharacterSetActivePose(Player, null);
	PandoraPrisonBackground = "MainHall";
}

/**
 * When the player exits the prison
 * @returns {void} - Nothing
 */
function PandoraPrisonExitPrison() {
	delete Player.Infiltration.Punishment;
	ServerSend("AccountUpdate", { Infiltration: Player.Infiltration });
	DialogLeave();
	if (InfiltrationSupervisor == null) CommonSetScreen("Room", "MainHall");
	else CommonSetScreen("Room", "Infiltration");
}