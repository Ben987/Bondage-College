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
    DescriptionInput.setAttribute("maxlength", 10000);
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
    if (InformationSheetSelection.ID == 0) DrawButton(1720, 60, 90, 90, "", "White", "Icons/Accept.png", TextGet("LeaveSave"));
    DrawButton(1820, 60, 90, 90, "", "White", ((InformationSheetSelection.ID == 0) ? "Icons/Cancel.png" : "Icons/Exit.png"), TextGet((InformationSheetSelection.ID == 0) ? "LeaveNoSave" : "Leave"));

}

/**
 * Handles clicks in the online profile screen
 * @returns {void} - Nothing
 */
function OnlineProfileClick() {
    if (MouseIn(1820, 60, 90, 90)) OnlineProfileExit(false);
    if (InformationSheetSelection.ID == 0 && MouseIn(1720, 60, 90, 90)) OnlineProfileExit(true);
}

/**
 * Handles exiting while in the online profile screen. It removes the input and saves the description.
 * @param {boolean} Save - Whether or not we should save the changes
 * @returns {void} - Nothing
 */
function OnlineProfileExit(Save) {
    // If the current character is the player, we update the description
    if ((InformationSheetSelection.ID == 0) && (InformationSheetSelection.Description != ElementValue("DescriptionInput").trim()) && Save) {
        InformationSheetSelection.Description = ElementValue("DescriptionInput").trim().substr(0, 10000);
        let Description = InformationSheetSelection.Description;
        const CompressedDescription = "╬" + LZString.compressToUTF16(Description);
        if (CompressedDescription.length < Description.length || Description.startsWith("╬")) {
            Description = CompressedDescription;
        }
        ServerAccountUpdate.QueueData({ Description });
        ChatRoomCharacterUpdate(InformationSheetSelection);
    }
    ElementRemove("DescriptionInput");
    CommonSetScreen("Character", "InformationSheet");
}