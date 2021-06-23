"use strict";
var RelogBackground = "";
var RelogCanvas = document.createElement("canvas");
var RelogData = null;
var RelogChatLog = null;
var RelogInputText = "";

/**
 * Loads the relog screen
 * @returns {void} Nothing
 */
function RelogLoad() {

	// Hides any HTML DOM element with the tag "HideOnPopup", like text boxes
	var Elements = document.getElementsByClassName("HideOnPopup");
	for (let E = 0; E < Elements.length; E++)
		Elements[E].style.display = "none";
	Elements = document.getElementsByClassName("HideOnDisconnect");
	for (let E = 0; E < Elements.length; E++)
		Elements[E].style.display = "none";

	// Resets login variables and sets the login message
	LoginStatusReset(null, true);
	LoginUpdateMessage();

	// Keeps a copy of the main canvas and darkens it
	var Context = RelogCanvas.getContext("2d");
	RelogCanvas.width = 2000;
	RelogCanvas.height = 1000;
	Context.drawImage(MainCanvas.canvas, 0, 0);
	Context.fillStyle = "rgba(0, 0, 0, 0.75)";
	Context.fillRect(0, 0, 2000, 1000);

	// Creates the password control without autocomplete and make sure it's cleared
	ElementCreateInput("InputPassword", "password", "", "20");
	document.getElementById("InputPassword").setAttribute("autocomplete", "off");
	setTimeout(function() { ElementValue("InputPassword", ""); }, 500);

}

/**
 * Runs the relog screen
 * @returns {void} Nothing
 */
function RelogRun() {

	// The previous darkened background is drawn
	MainCanvas.drawImage(RelogCanvas, 0, 0);
	const CanLogin = ServerIsConnected && !LoginSubmitted;

	// Draw the relog controls
	if (!LoginMessage) LoginUpdateMessage();
	if (LoginMessage != TextGet("EnterPassword")) DrawText(LoginMessage, 1000, 150, "White", "Black");
	DrawText(TextGet("EnterPassword"), 1000, 230, "White", "Black");
	DrawText(TextGet("Account") + "  " + Player.AccountName, 1000, 400, "White", "Black");
	DrawText(TextGet("Password"), 1000, 500, "White", "Black");
	ElementPosition("InputPassword", 1000, 550, 500);
	DrawButton(675, 750, 300, 60, TextGet("LogBack"), CanLogin ? "White" : "Grey", "");
	DrawButton(1025, 750, 300, 60, TextGet("GiveUp"), "White", "");

	// Reset any disconnect notifications
	if (document.hasFocus()) NotificationReset(NotificationEventType.DISCONNECT);
}

/**
 * Handles player click events on the relog screen
 * @returns {void} Nothing
 */
function RelogClick() {
	if (MouseIn(675, 750, 300, 60)) RelogSend(); // Log Back button
	if (MouseIn(1025, 750, 300, 60)) RelogExit(); // Give Up button
}

/**
 * Handles player keyboard events on the relog screen
 * @returns {void} Nothing
 */
function RelogKeyDown() {
	if (KeyPress == 13) RelogSend(); // On an "enter" key press, try to relog the player
}

/**
 * Attempt to log the user in based on the current player account name and the input password
 * @returns {void} Nothing
 */
function RelogSend() {
    // Ensure the login request is not sent twice
	if (!LoginSubmitted && ServerIsConnected) {
		var Name = Player.AccountName;
		var Password = ElementValue("InputPassword");
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {
			LoginSetSubmitted();
			ServerSend("AccountLogin", { AccountName: Name, Password: Password });
		} else LoginStatusReset("InvalidNamePassword", true);
	}
	LoginUpdateMessage();
}

/**
 * Sends the player back to the main login screen
 * @returns {void} Nothing
 */
function RelogExit() {
	// eslint-disable-next-line no-self-assign
	window.location = window.location;
}
