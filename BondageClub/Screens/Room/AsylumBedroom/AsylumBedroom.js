"use strict";
var AsylumBedroomBackground = "AsylumBedroom";

/**
 * Loads the room and initializes the UI elements. Called dynamically
 * @returns {void} - Nothing
 */
function AsylumBedroomLoad() {
	if (Player.ImmersionSettings && Player.LastChatRoom && Player.LastChatRoom != "") {
		// We return to the chat room that the player was last in		
		if (Player.ImmersionSettings.ReturnToChatRoom) {
			ChatRoomStart("Asylum", "", "AsylumEntrance", "AsylumEntrance", [BackgroundsTagAsylum]);
		} else {
			ChatRoomSetLastChatRoom("")
		}
	}
}

/**
 * Runs the bedroom. Is called dynamically at very short intervals so don't use espensive loops or other functions from within
 * @returns {void} - Nothing
 */
function AsylumBedroomRun() {
	DrawCharacter(Player, 750, 0, 1);
	if (Player.CanWalk()) DrawButton(1885, 25, 90, 90, "", "White", "Icons/Exit.png", TextGet("Entrance"));
	DrawButton(1885, 145, 90, 90, "", "White", "Icons/Character.png", TextGet("Profile"));
	if (LogValue("Committed", "Asylum") >= CurrentTime) {
		DrawButton(1885, 265, 90, 90, "", "White", "Icons/Bedroom.png", TextGet("Sleep"));
		DrawText(TextGet("RemainingTime"), 1800, 915, "white", "gray");
		DrawText(TimerToString(LogValue("Committed", "Asylum") - CurrentTime), 1800, 965, "white", "gray");
	}
}

// When the user clicks in the room
/**
 * Handles the click events. Is called from CommonClick()
 * @returns {void} - Nothing
 */
function AsylumBedroomClick() {
	if (MouseIn(750, 0, 500, 1000)) CharacterSetCurrent(Player);
	if (MouseIn(1885, 25, 90, 90) && Player.CanWalk()) CommonSetScreen("Room", "AsylumEntrance");
	if (MouseIn(1885, 145, 90, 90)) InformationSheetLoadCharacter(Player);
	// eslint-disable-next-line no-self-assign
	if (MouseIn(1885, 265, 90, 90) && LogValue("Committed", "Asylum") >= CurrentTime) window.location = window.location;
}