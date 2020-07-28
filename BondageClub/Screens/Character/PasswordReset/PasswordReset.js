"use strict";
var PasswordResetBackground = "Dressing";
var PasswordResetMessage = "";

/**
 * Loads the password reset screen
 * @returns {void} Nothing
 */
function PasswordResetLoad() {

	// Creates the controls
	ElementCreateInput("InputEmail", "text", "", "100");
	ElementCreateInput("InputAccountName", "text", "", "50");
	ElementCreateInput("InputResetNumber", "text", "", "20");
	ElementCreateInput("InputPassword1", "password", "", "20");
	ElementCreateInput("InputPassword2", "password", "", "20");

	// No autocomplete
	document.getElementById("InputEmail").setAttribute("autocomplete", "off");
	document.getElementById("InputAccountName").setAttribute("autocomplete", "off");
	document.getElementById("InputResetNumber").setAttribute("autocomplete", "off");
	document.getElementById("InputPassword1").setAttribute("autocomplete", "off");
	document.getElementById("InputPassword2").setAttribute("autocomplete", "off");

	// Clears the fields after a little while
	setTimeout(function() {
		ElementValue("InputResetNumber", "");
		ElementValue("InputPassword1", "");
	}, 500);

}

/**
 * Runs the password reset screen
 * @returns {void} Nothing
 */
function PasswordResetRun() {

	// Draw the email validation controls
	if (PasswordResetMessage == "") PasswordResetMessage = TextGet("EnterEmail");
	DrawText(PasswordResetMessage, 1000, 60, "White", "Black");
	ElementPosition("InputEmail", 1000, 120, 1000);
	DrawButton(800, 180, 400, 60, TextGet("SendEmail"), "White", "");

	// Draw the recovery controls
	DrawText(TextGet("AccountName"), 1000, 320, "White", "Black");
	ElementPosition("InputAccountName", 1000, 380, 500);
	DrawText(TextGet("ResetNumber"), 1000, 460, "White", "Black");
	ElementPosition("InputResetNumber", 1000, 520, 500);
	DrawText(TextGet("Password1"), 1000, 600, "White", "Black");
	ElementPosition("InputPassword1", 1000, 660, 500);
	DrawText(TextGet("Password2"), 1000, 740, "White", "Black");
	ElementPosition("InputPassword2", 1000, 800, 500);
	DrawButton(675, 890, 300, 60, TextGet("ResetPassword"), "White", "");
	DrawButton(1025, 890, 300, 60, TextGet("Return"), "White", "");

}

/**
 * Handles a password reset response
 * @param {string} msg - The password reset response message to be displayed to the player
 * @returns {void} Nothing
 */
function PasswordResetResponse(msg) {
	PasswordResetMessage = TextGet(msg);
}

/**
 * Handles player click events on the password reset screen
 * @returns {void} Nothing
 */
function PasswordResetClick() {

	// Push a recovery request to the server
	if ((MouseX >= 800) && (MouseX <= 1200) && (MouseY >= 180) && (MouseY <= 240)) {
		var Email = ElementValue("InputEmail");
		var E = /^[a-zA-Z0-9@.]+$/;
		if (Email.match(E) && (Email.length >= 5) && (Email.length <= 100) && (Email.indexOf("@") > 0) && (Email.indexOf(".") > 0)) {
			ServerSend("PasswordReset", Email);
			PasswordResetMessage = TextGet("QueryServer");
		} else PasswordResetMessage = TextGet("InvalidEmail");
	}

	// If we must try to login (make sure we don't send the login query twice)
	if ((MouseX >= 775) && (MouseX <= 975) && (MouseY >= 500) && (MouseY <= 560) && !LoginSubmitted) {
		var Name = ElementValue("InputName");
		var Password = ElementValue("InputPassword");
		var letters = /^[a-zA-Z0-9]+$/;
		if (Name.match(letters) && Password.match(letters) && (Name.length > 0) && (Name.length <= 20) && (Password.length > 0) && (Password.length <= 20)) {
		    LoginSetSubmitted();
			ServerSend("AccountLogin", { AccountName: Name, Password: Password } );
		}
		else LoginStatusReset("InvalidNamePassword");
		LoginUpdateMessage();
	}

	// If we must send the reset number info to the server
	if ((MouseX >= 675) && (MouseX <= 975) && (MouseY >= 890) && (MouseY <= 950)) {
		
		// Make sure the passwords match
		var AccountName = ElementValue("InputAccountName");
		var ResetNumber = ElementValue("InputResetNumber");
		var Password1 = ElementValue("InputPassword1");
		var Password2 = ElementValue("InputPassword2");		
		if (Password1 == Password2) {

			// Validates the fields
			var LN = /^[a-zA-Z0-9 ]+$/;
			if (AccountName.match(LN) && ResetNumber.match(LN) && Password1.match(LN) && (AccountName.length > 0) && (AccountName.length <= 20) && (ResetNumber.length > 0) && (ResetNumber.length <= 20) && (Password1.length > 0) && (Password1.length <= 20)) {
				
				// Sends the reset query to the server
				var data = {
					AccountName: AccountName,
					ResetNumber: ResetNumber,
					NewPassword: Password1
				}
				ServerSend("PasswordResetProcess", data);

			} else PasswordResetMessage = TextGet("InvalidResetInfo");

		} else PasswordResetMessage = TextGet("PasswordDoNotMatch");

	}

	// Go back to the login screen
	if ((MouseX >= 1025) && (MouseX <= 1325) && (MouseY >= 890) && (MouseY <= 950)) PasswordResetExit();

}

/**
 * Sends the player back to the login screen
 * @returns {void} Nothing
 */
function PasswordResetExit() {
	ElementRemove("InputEmail");
	ElementRemove("InputAccountName");
	ElementRemove("InputResetNumber");
	ElementRemove("InputPassword1");
	ElementRemove("InputPassword2");
	CommonSetScreen("Character", "Login");
}