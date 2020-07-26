"use strict";
var OnlineProfileBackground = "Sheet";

/**
 * Loads the online profile screen by creating its input
 * @returns {void} - Nothing
 */
function OnlineProfileLoad() {
    ElementRemove("DescriptionInput");
    ElementCreateTextArea("DescriptionInput");
    var DescriptionInput = document.getElementById("DescriptionInput");
    DescriptionInput.setAttribute("maxlength", 1000);
    DescriptionInput.value = (InformationSheetSelection.Description != null) ? InformationSheetSelection.Description : "";
    if (InformationSheetSelection.ID != 0) DescriptionInput.setAttribute("readonly", "readonly");
}

/**
 * Runs and draws the online profile screen
 * @returns {void} - Nothing
 */
function OnlineProfileRun() {

    // Sets the screen controls
    var desc = ElementValue("DescriptionInput");
    DrawText(TextGet((InformationSheetSelection.ID == 0) ? "EnterDescription" : "ViewDescription").replace("CharacterName", InformationSheetSelection.Name), 910, 105, "Black", "Gray");
    ElementPositionFix("DescriptionInput", 36, 100, 160, 1790, 750);
    DrawButton(1820, 60, 90, 90, "", "White", "Icons/Exit.png");

}

/**
 * Handles clicks in the online profile screen
 * @returns {void} - Nothing
 */
function OnlineProfileClick() {	
    if (MouseIn(1820, 60, 90, 90)) OnlineProfileExit();
}

/**
 * Handles exiting while in the online profile screen. It removes the input and saves the description.
 * @returns {void} - Nothing
 */
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