"use strict";
var PrivateRansomBackground = "Sheet";
var PrivateRansomCharacter = null;

/**
 * Check if we must start a Pandora ransom for one of the girls in the private room
 * @returns {boolean} - TRUE if a ransom or more was started
 */
function PrivateRansomStart() {

	// Nothing to check if the player is alone
	if (!LogQuery("RentRoom", "PrivateRoom") || (PrivateCharacter.length <= 1)) return false;

	// The odds of a kidnapping are 1% everyday for each character + 0.4% for each skill points in infiltration (max 5%)
	let Odds = 0.01 + (SkillGetLevel(Player, "Infiltration") / 250);

	// For all NPCs that can be kidnapped in the room (Sophie & owners cannot be kidnapped yet)
	let KidnapDone = false;
	for (let C = 1; C < PrivateCharacter.length; C++)
		if ((PrivateCharacter[C].Name != "Sophie") && (NPCEventGet(PrivateCharacter[C], "NextKidnap") <= CurrentTime) && !PrivateCharacter[C].IsOwner() && (NPCEventGet(PrivateCharacter[C], "AsylumSent") <= CurrentTime) && (NPCEventGet(PrivateCharacter[C], "SlaveMarketRent") <= CurrentTime)) {

			// If we beat the odds, we kidnap that NPC for 1 week
			if (Math.random() <= Odds) {
				CharacterFullRandomRestrain(PrivateCharacter[C], "ALL");
				NPCEventAdd(PrivateCharacter[C], "Kidnap", CurrentTime + 604800000);
				NPCEventAdd(PrivateCharacter[C], "NextKidnap", CurrentTime + 1209600000);
				KidnapDone = true;
			} else NPCEventAdd(PrivateCharacter[C], "NextKidnap", CurrentTime + 86400000);

		}

	// Returns TRUE if a kidnapping was, so we can sync the data
	return KidnapDone;

}

/**
 * Loads the private ransom note screen
 * @returns {void} - Nothing.
 */
function PrivateRansomLoad() {
}

/**
 * Draws the character and the ransom note
 * @returns {void} - Nothing.
 */
function PrivateRansomRun() {

	// Draw the ransomed character on the left
	DrawCharacter(PrivateRansomCharacter, 150, 100, 0.8);
	
	// Draw the ransom note, in 5 lines
	for (let T = 0; T <= 5; T++)
		DrawText(TextGet("Ransom" + T.toString()).replace("RansomCharacterName", PrivateRansomCharacter.Name), 1150, T * 125 + 187, "Black", "Silver");

	// Draw the buttons
	DrawButton(1800, 100, 90, 90, "", "White", "Icons/Exit.png", TextGet("Exit"));
	DrawButton(1800, 215, 90, 90, "", "White", "Icons/Infiltration.png", TextGet("Infiltration"));

}

/**
 * Handles clicks in the ransom note
 * @returns {void} - Nothing.
 */
function PrivateRansomClick() {
	if (MouseIn(1800, 100, 90, 90)) PrivateRansomExit();
	if (MouseIn(1800, 215, 90, 90)) {
		let Intro = TextGet("InfiltrationIntro");
		CommonSetScreen("Room", "Infiltration");
		InfiltrationSupervisor.Stage = "100";
		InfiltrationSupervisor.CurrentDialog = Intro;
		CharacterSetCurrent(InfiltrationSupervisor);
	}
}

/**
 * When the player leaves the note, we go back to the private room
 * @returns {void} - Nothing.
 */
function PrivateRansomExit() {
	CommonSetScreen("Room", "Private");
}