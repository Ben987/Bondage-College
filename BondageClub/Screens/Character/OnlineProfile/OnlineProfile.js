"use strict";

class OnlineProfile {
    IsDebug = false;
    CurrentChar = null;
    IsEditMode = false;

    DescriptionInputMaxLength = 1000;
    DescriptionInputRect = [100,150,1650,750];

    constructor() {
        this.CurrentChar = null;
    }

    SetEditMode(isEdit) {
        this.IsEditMode = isEdit;

        var C = this.CurrentChar;

        ElementRemove("DescriptionInput");
        ElementCreateTextArea("DescriptionInput");

        var DescriptionInput = document.getElementById("DescriptionInput");
        DescriptionInput.setAttribute("maxlength", this.DescriptionInputMaxLength);
        DescriptionInput.value = C.Description;

        if (!isEdit) {
            DescriptionInput.setAttribute("readonly", "readonly");
        }

        this.Log("SetEditMode = " + this.IsEditMode);
    }

    ToggleEditMode() {
        this.Log("ToggleEditMode");
        this.SetEditMode(!this.IsEditMode);
    }

    Load(C) {
        this.CurrentChar = C;
        this.SetEditMode(false);
    }

    Run() {
        var C = this.CurrentChar;

        DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png", "Back");

        if (C.ID == 0) {
            if (this.IsEditMode) {
                DrawButton(1815, 420, 90, 90, "", "White", "Icons/Cancel.png");
                DrawButton(1815, 535, 90, 90, "", "White", "Icons/ColorSelect.png");
            } else {
                DrawButton(1815, 420, 90, 90, "", "White", "Icons/Use.png");
            }
        }

        DrawText("Description: ", 200, 100, "Black", "Gray");
        var P = this.DescriptionInputRect;
        ElementPositionFix("DescriptionInput", 36, P[0], P[1], P[2], P[3]);
    }

    Click() {
        var C = this.CurrentChar;
        if (CommonIsClickAt(1815, 75, 90, 90)) this.Exit();
        if ((C.ID == 0)) {
            if (this.IsEditMode) {
                if (CommonIsClickAt(1815, 420, 90, 90)) this.ToggleEditMode();
                if (CommonIsClickAt(1815, 535, 90, 90)) this.Save();
            } else {
                if (CommonIsClickAt(1815, 420, 90, 90)) this.ToggleEditMode();
            }
        }
    }

    Exit() {
        this.Log("Exit");
        
        ElementRemove("DescriptionInput");
        
        CommonSetScreen("Character", "InformationSheet");
    }

    Save() {
        this.Log("Save");
        var C = this.CurrentChar;

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

        this.SetEditMode(false);
    }

    Log(msg) {
        if (this.IsDebug == false) return;
        console.log(msg);
    }
}

var OnlineProfileBackground = "Sheet";
var OnlineProfileScreen = null;

function OnlineProfileLoad() {
    console.log("OnlineProfileLoad");
    if(OnlineProfileScreen == null){
        console.log("OnlineProfileScreen CREATE");
        OnlineProfileScreen = new OnlineProfile();
    }
    OnlineProfileScreen.Load(InformationSheetSelection);
}

function OnlineProfileRun() {
    OnlineProfileScreen.Run();
}

function OnlineProfileClick() {
    OnlineProfileScreen.Click();
}

function OnlineProfileExit() {
    OnlineProfileScreen.Exit();
}