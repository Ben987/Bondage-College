"use strict";

var OnlineProfileBackground = "Sheet";
var OnlineProfileIsEditMode = false;
var OnlineProfileDescriptionInputMaxLength = 1000;

function OnlineProfileLoad() {
    OnlineProfileSetEditMode(false);
}

function OnlineProfileRun() {
    var C = InformationSheetSelection;

    MainCanvas.textAlign = "center";
    
    // Header text
    DrawText("- Online Profile -", 1000, 100, "Black", "Gray");
    
    MainCanvas.textAlign = "left";

    var desc = ElementValue("DescriptionInput");
    DrawText("Description: ("+ desc.length + "/" + OnlineProfileDescriptionInputMaxLength + " characters)", 100, 150, "Black", "Gray");
    ElementPositionFix("DescriptionInput", 36, 100,200,1650,750);

    MainCanvas.textAlign = "center";

    // Buttons
    DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png", "Back");
    if (C.ID == 0) {
        if (OnlineProfileIsEditMode) {
            DrawButton(1815, 420, 90, 90, "", "White", "Icons/Cancel.png", "Cancel");
            DrawButton(1815, 535, 90, 90, "", "White", "Icons/ColorSelect.png", "Save Changes");
        } else {
            DrawButton(1815, 420, 90, 90, "", "White", "Icons/Use.png", "Edit");
        }
    }
}

function OnlineProfileClick() {
    var C = InformationSheetSelection;
    if (CommonIsClickAt(1815, 75, 90, 90)) OnlineProfileExit();
    if ((C.ID == 0)) {
        if (OnlineProfileIsEditMode) {
            if (CommonIsClickAt(1815, 420, 90, 90)) OnlineProfileSetEditMode(!OnlineProfileIsEditMode);
            if (CommonIsClickAt(1815, 535, 90, 90)) OnlineProfileSave();
        } else {
            if (CommonIsClickAt(1815, 420, 90, 90)) OnlineProfileSetEditMode(!OnlineProfileIsEditMode);
        }
    }
}

function OnlineProfileExit() {
    ElementRemove("DescriptionInput");
    
    CommonSetScreen("Character", "InformationSheet");
}

function OnlineProfileSetEditMode(isEdit) {
    OnlineProfileIsEditMode = isEdit;

    var C = InformationSheetSelection;

    ElementRemove("DescriptionInput");
    ElementCreateTextArea("DescriptionInput");

    var DescriptionInput = document.getElementById("DescriptionInput");
    DescriptionInput.setAttribute("maxlength", OnlineProfileDescriptionInputMaxLength);
    DescriptionInput.value = C.Description;

    if (!isEdit) {
        DescriptionInput.setAttribute("readonly", "readonly");
    }
}

function OnlineProfileSave(){
    var C = InformationSheetSelection;

    var isChanged = false;

    var desc = ElementValue("DescriptionInput").trim();
    if (C.Description != desc) {
        C.Description = desc;
        isChanged = true;
    }

    if (isChanged) {
        ServerSend("AccountUpdate",
            {
                Description: C.Description
            });
        ChatRoomCharacterUpdate(C);
    }

    OnlineProfileSetEditMode(false);
}