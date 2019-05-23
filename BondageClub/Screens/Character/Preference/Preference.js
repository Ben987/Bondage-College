"use strict";
var PreferenceBackground = "Sheet";
var PreferenceMessage = "";
var PreferenceColorPick = "";

// When the preference screens loads
function PreferenceLoad() {
	if (Player.RestrainPermission == null) Player.RestrainPermission = 2;
	if (!CommonIsColor(Player.LabelColor)) Player.LabelColor = "#ffffff";
	ElementCreateInput("InputCharacterLabelColor", "text", Player.LabelColor);
}

// Run the preference screen
function PreferenceRun() {

	// Draw the online preferences
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Preferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("CharacterLabelColor"), 500, 225, "Black", "Gray");
	ElementPosition("InputCharacterLabelColor", 990, 212, 250);
	if (CommonIsColor(ElementValue("InputCharacterLabelColor"))) document.getElementById("InputCharacterLabelColor").style.color = ElementValue("InputCharacterLabelColor");
	else document.getElementById("InputCharacterLabelColor").style.color = Player.LabelColor;
	document.getElementById("InputCharacterLabelColor").style.backgroundColor = "#000000";
	DrawButton(1140, 187, 65, 65, "", "White", "Icons/Color.png");
	DrawButton(500, 280, 90, 90, "", "White", "Icons/Next.png");
	DrawText(TextGet("RestrainPermission") + " " + TextGet("PermissionLevel" + Player.RestrainPermission.toString()), 615, 325, "Black", "Gray");
	if (PreferenceMessage != "") DrawText(TextGet(PreferenceMessage), 500, 550, "Red", "Black");
	MainCanvas.textAlign = "center";

	// Draw the player & controls
	DrawCharacter(Player, 50, 50, 0.9);
	if (PreferenceColorPick != "") DrawImage("Backgrounds/ColorPicker.png", 1250, 85);
	else DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

}

// When the user clicks in the preference screen
function PreferenceClick() {
	
	// If we must save and exit
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) {
		if (CommonIsColor(ElementValue("InputCharacterLabelColor"))) {
			Player.LabelColor = ElementValue("InputCharacterLabelColor");
			var P = {
				RestrainPermission: Player.RestrainPermission,
				LabelColor: Player.LabelColor
			}
			ServerSend("AccountUpdate", P);
			ElementRemove("InputCharacterLabelColor");
			CommonSetScreen("Character", "InformationSheet");
		} else PreferenceMessage = "ErrorInvalidColor";
	}

	// If we must change the restrain permission level
	if ((MouseX >= 500) && (MouseX < 590) && (MouseY >= 280) && (MouseY < 370)) {
		Player.RestrainPermission++;
		if (Player.RestrainPermission > 4) Player.RestrainPermission = 0;
	}

	// If we must show/hide/use the color picker
	if ((MouseX >= 1140) && (MouseX < 1205) && (MouseY >= 187) && (MouseY < 252)) PreferenceColorPick = (PreferenceColorPick != "InputCharacterLabelColor") ? "InputCharacterLabelColor" : "";
	if ((MouseX >= 1250) && (MouseX < 1925) && (MouseY >= 85) && (MouseY < 915) && (PreferenceColorPick != "")) ElementValue(PreferenceColorPick, DrawRGBToHex(MainCanvas.getImageData(MouseX, MouseY, 1, 1).data));

}