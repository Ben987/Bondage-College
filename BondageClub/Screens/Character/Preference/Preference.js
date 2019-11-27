"use strict";
var PreferenceBackground = "Sheet";
var PreferenceMessage = "";
var PreferenceColorPick = "";
var PreferenceSubscreen = "";
var PreferenceChatColorThemeSelected = "";
var PreferenceChatColorThemeList = null;
var PreferenceChatColorThemeIndex = 0;
var PreferenceChatEnterLeaveSelected = "";
var PreferenceChatEnterLeaveList = null;
var PreferenceChatEnterLeaveIndex = 0;
var PreferenceChatMemberNumbersSelected = "";
var PreferenceChatMemberNumbersList = null;
var PreferenceChatMemberNumbersIndex = 0;

// When the preference screens loads
function PreferenceLoad() {
	if (!CommonIsColor(Player.LabelColor)) Player.LabelColor = "#ffffff";
	ElementCreateInput("InputCharacterLabelColor", "text", Player.LabelColor);

	// If the user never used chat settings before, construct them to replicate the default behavior
	if (!Player.ChatSettings) Player.ChatSettings = {
		DisplayTimestamps: true,
		ColorNames: true,
		ColorActions: true,
		ColorEmotes: true,
	};

	if (!Player.PreferencesSettings) Player.PreferencesSettings = {
		FullSensDep: false
	};

	PreferenceChatColorThemeList = ["Light", "Dark"];
	PreferenceChatEnterLeaveList = ["Normal", "Smaller", "Hidden"];
	PreferenceChatMemberNumbersList = ["Always", "Never", "OnMouseover"];
	PreferenceChatColorThemeIndex = (!Player.ChatSettings || PreferenceChatColorThemeList.indexOf(Player.ChatSettings.ColorTheme) < 0) ? 0 : PreferenceChatColorThemeList.indexOf(Player.ChatSettings.ColorTheme);
	PreferenceChatEnterLeaveIndex = (!Player.ChatSettings || PreferenceChatEnterLeaveList.indexOf(Player.ChatSettings.EnterLeave) < 0) ? 0 : PreferenceChatEnterLeaveList.indexOf(Player.ChatSettings.EnterLeave);
	PreferenceChatMemberNumbersIndex = (!Player.ChatSettings || PreferenceChatMemberNumbersList.indexOf(Player.ChatSettings.MemberNumbers) < 0) ? 0 : PreferenceChatMemberNumbersList.indexOf(Player.ChatSettings.MemberNumbers);
	PreferenceChatColorThemeSelected = PreferenceChatColorThemeList[PreferenceChatColorThemeIndex];
	PreferenceChatEnterLeaveSelected = PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex];
	PreferenceChatMemberNumbersSelected = PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex];
}

// Run the preference screen
function PreferenceRun() {

	// If a subscreen is active, draw that instead
	if (PreferenceSubscreen == "Chat") {
		PreferenceSubscreenChatRun();
		return;
	}

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
	DrawText(TextGet("ItemPermission") + " " + TextGet("PermissionLevel" + Player.ItemPermission.toString()), 615, 325, "Black", "Gray");
	if (PreferenceMessage != "") DrawText(TextGet(PreferenceMessage), 500, 550, "Red", "Black");
	MainCanvas.textAlign = "center";

	//todo to test
	DrawText(TextGet("FullsensDep"), 600, 825, "Black", "Gray");
	DrawButton(500, 792, 64, 64, "", "White", (Player.PreferencesSettings && Player.PreferencesSettings.FullSensDep) ? "Icons/Checked.png" : "");

	// Draw the player & controls
	DrawCharacter(Player, 50, 50, 0.9);
	if (PreferenceColorPick != "") DrawImage("Backgrounds/ColorPicker.png", 1250, 85);
	else {
		DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
		DrawButton(1815, 190, 90, 90, "", "White", "Icons/Chat.png");
	}

}

// When the user clicks in the preference screen
function PreferenceClick() {

	// If a subscreen is active, process that instead
	if (PreferenceSubscreen == "Chat") {
		PreferenceSubscreenChatClick();
		return;
	}

	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) PreferenceExit();

	// If the user clicks on the chat settings button
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 190) && (MouseY < 280) && (PreferenceColorPick == "")) {
		ElementRemove("InputCharacterLabelColor");
		PreferenceSubscreen = "Chat";
	}

	// If we must change the restrain permission level
	if ((MouseX >= 500) && (MouseX < 590) && (MouseY >= 280) && (MouseY < 370)) {
		Player.ItemPermission++;
		if (Player.ItemPermission > 4) Player.ItemPermission = 0;
	}

	// If we must show/hide/use the color picker
	if ((MouseX >= 1140) && (MouseX < 1205) && (MouseY >= 187) && (MouseY < 252)) PreferenceColorPick = (PreferenceColorPick != "InputCharacterLabelColor") ? "InputCharacterLabelColor" : "";
	if ((MouseX >= 1250) && (MouseX < 1925) && (MouseY >= 85) && (MouseY < 915) && (PreferenceColorPick != "")) ElementValue(PreferenceColorPick, DrawRGBToHex(MainCanvas.getImageData(MouseX, MouseY, 1, 1).data));

	//todo to test
	if ((MouseY >= 792) && (MouseY < 856)) Player.PreferencesSettings.FullSensDep = !Player.PreferencesSettings.FullSensDep;
}

// when the user exit this screen
function PreferenceExit() {
	// If we must save and exit
	if (CommonIsColor(ElementValue("InputCharacterLabelColor"))) {
		Player.LabelColor = ElementValue("InputCharacterLabelColor");
		var P = {
			ItemPermission: Player.ItemPermission,
			LabelColor: Player.LabelColor,
			ChatSettings: Player.ChatSettings,
			PreferenceSettings: Player.PreferenceSettings
		}
		ServerSend("AccountUpdate", P);
		ElementRemove("InputCharacterLabelColor");
		CommonSetScreen("Character", "InformationSheet");
	} else PreferenceMessage = "ErrorInvalidColor";
}

// Redirected to from the main Run function if the player is in the chat settings subscreen
function PreferenceSubscreenChatRun() {
	MainCanvas.textAlign = "left";
	DrawText(TextGet("ChatDisplaySettings"), 500, 125, "Black", "Gray");
	DrawText(TextGet("ColorTheme"), 500, 225, "Black", "Gray");
	DrawText(TextGet("EnterLeaveStyle"), 500, 325, "Black", "Gray");
	DrawText(TextGet("DisplayMemberNumbers"), 500, 425, "Black", "Gray");
	DrawText(TextGet("DisplayTimestamps"), 600, 525, "Black", "Gray");
	DrawText(TextGet("ColorNames"), 600, 625, "Black", "Gray");
	DrawText(TextGet("ColorActions"), 600, 725, "Black", "Gray");
	DrawText(TextGet("ColorEmotes"), 600, 825, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawBackNextButton(1000, 190, 350, 70, TextGet(PreferenceChatColorThemeSelected), "White", "",
		() => TextGet((PreferenceChatColorThemeIndex == 0) ? PreferenceChatColorThemeList[PreferenceChatColorThemeList.length - 1] : PreferenceChatColorThemeList[PreferenceChatColorThemeIndex - 1]),
		() => TextGet((PreferenceChatColorThemeIndex >= PreferenceChatColorThemeList.length - 1) ? PreferenceChatColorThemeList[0] : PreferenceChatColorThemeList[PreferenceChatColorThemeIndex + 1]));
	DrawBackNextButton(1000, 290, 350, 70, TextGet(PreferenceChatEnterLeaveSelected), "White", "",
		() => TextGet((PreferenceChatEnterLeaveIndex == 0) ? PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveList.length - 1] : PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex - 1]),
		() => TextGet((PreferenceChatEnterLeaveIndex >= PreferenceChatEnterLeaveList.length - 1) ? PreferenceChatEnterLeaveList[0] : PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex + 1]));
	DrawBackNextButton(1000, 390, 350, 70, TextGet(PreferenceChatMemberNumbersSelected), "White", "",
		() => TextGet((PreferenceChatMemberNumbersIndex == 0) ? PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersList.length - 1] : PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex - 1]),
		() => TextGet((PreferenceChatMemberNumbersIndex >= PreferenceChatMemberNumbersList.length - 1) ? PreferenceChatMemberNumbersList[0] : PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex + 1]));
	DrawButton(500, 492, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.DisplayTimestamps) ? "Icons/Checked.png" : "");
	DrawButton(500, 592, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ColorNames) ? "Icons/Checked.png" : "");
	DrawButton(500, 692, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ColorActions) ? "Icons/Checked.png" : "");
	DrawButton(500, 792, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ColorEmotes) ? "Icons/Checked.png" : "");

	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawCharacter(Player, 50, 50, 0.9);
}

// Redirected to from the main Click function if the player is in the chat settings subscreen
function PreferenceSubscreenChatClick() {
	// If the user clicked one of the checkboxes
	if ((MouseX >= 500) && (MouseX < 564)) {
		if ((MouseY >= 492) && (MouseY < 556)) Player.ChatSettings.DisplayTimestamps = !Player.ChatSettings.DisplayTimestamps;
		if ((MouseY >= 592) && (MouseY < 656)) Player.ChatSettings.ColorNames = !Player.ChatSettings.ColorNames;
		if ((MouseY >= 692) && (MouseY < 756)) Player.ChatSettings.ColorActions = !Player.ChatSettings.ColorActions;
		if ((MouseY >= 792) && (MouseY < 856)) Player.ChatSettings.ColorEmotes = !Player.ChatSettings.ColorEmotes;
	}

	// If the user used one of the BackNextButtons
	if ((MouseX >= 1000) && (MouseX < 1350) && (MouseY >= 190) && (MouseY < 270)) {
		if (MouseX <= 1175) PreferenceChatColorThemeIndex = (PreferenceChatColorThemeIndex <= 0) ? PreferenceChatColorThemeList.length - 1 : PreferenceChatColorThemeIndex - 1;
		else PreferenceChatColorThemeIndex = (PreferenceChatColorThemeIndex >= PreferenceChatColorThemeList.length - 1) ? 0 : PreferenceChatColorThemeIndex + 1;
		PreferenceChatColorThemeSelected = PreferenceChatColorThemeList[PreferenceChatColorThemeIndex];
		Player.ChatSettings.ColorTheme = PreferenceChatColorThemeSelected;
	}
	if ((MouseX >= 1000) && (MouseX < 1350) && (MouseY >= 290) && (MouseY < 370)) {
		if (MouseX <= 1175) PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveIndex <= 0) ? PreferenceChatEnterLeaveList.length - 1 : PreferenceChatEnterLeaveIndex - 1;
		else PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveIndex >= PreferenceChatEnterLeaveList.length - 1) ? 0 : PreferenceChatEnterLeaveIndex + 1;
		PreferenceChatEnterLeaveSelected = PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex];
		Player.ChatSettings.EnterLeave = PreferenceChatEnterLeaveSelected;
	}
	if ((MouseX >= 1000) && (MouseX < 1350) && (MouseY >= 390) && (MouseY < 470)) {
		if (MouseX <= 1175) PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersIndex <= 0) ? PreferenceChatMemberNumbersList.length - 1 : PreferenceChatMemberNumbersIndex - 1;
		else PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersIndex >= PreferenceChatMemberNumbersList.length - 1) ? 0 : PreferenceChatMemberNumbersIndex + 1;
		PreferenceChatMemberNumbersSelected = PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex];
		Player.ChatSettings.MemberNumbers = PreferenceChatMemberNumbersSelected;
	}

	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) {
		PreferenceSubscreen = "";
		ElementCreateInput("InputCharacterLabelColor", "text", Player.LabelColor);
	}
}