"use strict";
var RelogBackground = "";
var RelogCanvas = document.createElement("canvas");
var RelogData = null;

// Loads the relog screen
function RelogLoad() {
	
	// Clears the previous login message
	LoginMessage = "";
	
	// Keeps a copy of the main canvas and darkens it
	var Context = RelogCanvas.getContext("2d");
	RelogCanvas.width = 2000;
	RelogCanvas.height = 1000;
	Context.drawImage(MainCanvas.canvas, 0, 0);
	Context.fillStyle = "rgba(0, 0, 0, 0.7)";
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
	if (LoginMessage == "") LoginMessage = TextGet("Disconnected");
	DrawText(LoginMessage, 1000, 100, "White", "Black");
	DrawText(TextGet("EnterPassword"), 1000, 180, "White", "Black");
	DrawText(TextGet("Account") + "  " + Player.AccountName, 1000, 300, "White", "Black");
	DrawText(TextGet("Password"), 1000, 400, "White", "Black");
	ElementPosition("InputPassword", 1000, 450, 500);
	DrawButton(675, 650, 300, 60, TextGet("LogBack"), "White", "");
	DrawButton(1025, 650, 300, 60, TextGet("GiveUp"), "White", "");

}

// When the user clicks on the relog screen
function RelogClick() {

	// Push a relog request to the server
	if ((MouseX >= 675) && (MouseX <= 975) && (MouseY >= 650) && (MouseY <= 710) && (LoginMessage != TextGet("ValidatingNamePassword"))) {
		var Name = Player.AccountName;
		var Password = ElementValue("InputPassword");
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {
			LoginMessage = TextGet("ValidatingNamePassword");
			ServerSend("AccountLogin", { AccountName: Name, Password: Password });
		} else LoginMessage = TextGet("InvalidNamePassword");
	}

	// If the user gives up on relogin, we go back to the intro screen
	if ((MouseX >= 1025) && (MouseX <= 1325) && (MouseY >= 650) && (MouseY <= 710))
		RelogExit();

}

// when the user exit this screen, we go back to login
function RelogExit() {
	window.location = window.location;
}