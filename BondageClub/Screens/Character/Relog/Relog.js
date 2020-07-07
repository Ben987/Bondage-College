"use strict";
var RelogBackground = "";
var RelogCanvas = document.createElement("canvas");
var RelogData = null;
var RelogChatLog = null;

// Loads the relog screen
function RelogLoad() {
	
	// Hides any HTML DOM element with the tag "HideOnPopup", like text boxes
	var Elements = document.getElementsByClassName("HideOnPopup");
	for (var E = 0; E < Elements.length; E++)
		Elements[E].style.display = "none";

	// Clears the previous login message
	LoginIsRelog = true;
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

// Run the relog screen 
function RelogRun() {
	
	// The previous darkened background is drawn
	MainCanvas.drawImage(RelogCanvas, 0, 0);
	
	// Draw the relog controls
	if (!LoginMessage) LoginUpdateMessage();
	DrawText(LoginMessage, 1000, 150, "White", "Black");
	DrawText(TextGet("EnterPassword"), 1000, 230, "White", "Black");
	DrawText(TextGet("Account") + "  " + Player.AccountName, 1000, 400, "White", "Black");
	DrawText(TextGet("Password"), 1000, 500, "White", "Black");
	ElementPosition("InputPassword", 1000, 550, 500);
	DrawButton(675, 750, 300, 60, TextGet("LogBack"), "White", "");
	DrawButton(1025, 750, 300, 60, TextGet("GiveUp"), "White", "");

}

// When the user clicks on the relog screen buttons
function RelogClick() {
	if ((MouseX >= 675) && (MouseX <= 975) && (MouseY >= 750) && (MouseY <= 810)) RelogSend();
	if ((MouseX >= 1025) && (MouseX <= 1325) && (MouseY >= 750) && (MouseY <= 810)) RelogExit();
}

// When the user press "enter" we send the relog query
function RelogKeyDown() {
	if (KeyPress == 13) RelogSend();
}

// Sends the relog query to the server
function RelogSend() {
	if (LoginMessage != TextGet("ValidatingNamePassword")) {
		var Name = Player.AccountName;
		var Password = ElementValue("InputPassword");
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {
			LoginSubmitted = true;
			LoginInvalid = false;
			ServerSend("AccountLogin", { AccountName: Name, Password: Password });
		} else LoginInvalid = true;
	}
	LoginUpdateMessage();
}

// when the user exit this screen, we go back to login
function RelogExit() {
	window.location = window.location;
}
