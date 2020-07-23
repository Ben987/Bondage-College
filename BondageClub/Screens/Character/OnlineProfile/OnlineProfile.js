"use strict";
var OnlineProfileBackground = "Sheet";

// When the online profile screens loads, we create the text area
function OnlineProfileLoad() {
    ElementRemove("DescriptionInput");
    ElementCreateTextArea("DescriptionInput");
    var DescriptionInput = document.getElementById("DescriptionInput");
    DescriptionInput.setAttribute("maxlength", 1000);
    DescriptionInput.value = (InformationSheetSelection.Description != null) ? InformationSheetSelection.Description : "";
    if (InformationSheetSelection.ID != 0) DescriptionInput.setAttribute("readonly", "readonly");
}

// Run the online profile screens
function OnlineProfileRun() {

    // Sets the screen controls
    var desc = ElementValue("DescriptionInput");
    DrawText(TextGet((InformationSheetSelection.ID == 0) ? "EnterDescription" : "ViewDescription").replace("CharacterName", InformationSheetSelection.Name), 910, 105, "Black", "Gray");
    ElementPositionFix("DescriptionInput", 36, 100, 160, 1790, 750);
    DrawButton(1820, 60, 90, 90, "", "White", "Icons/Exit.png");

}

// When the player clicks in the online profile form
function OnlineProfileClick() {	
    if (MouseIn(1820, 60, 90, 90)) OnlineProfileExit();
}

// when the user exit this screen
function OnlineProfileExit() {
    // If the current character is the player, we update the description
    if ((InformationSheetSelection.ID == 0) && (InformationSheetSelection.Description != ElementValue("DescriptionInput").trim())) {
        InformationSheetSelection.Description = ElementValue("DescriptionInput").trim();
        ServerSend("AccountUpdate", { Description: InformationSheetSelection.Description });
        ChatRoomCharacterUpdate(InformationSheetSelection);
    }
    ElementRemove("DescriptionInput");
    CommonSetScreen("Character", "InformationSheet");
}