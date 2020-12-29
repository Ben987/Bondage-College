var ButtonsX = [];
var ButtonsY = [];
var ControllerActive = true;
var CurrentButton = 0;
var ButtonsRepeat = false;
var AxesRepeat = false;
var IgnoreButton = false;
var AxesRepeatTime = 0;
var ControllerA = 1;
var ControllerB = 0;
var ControllerX = 3;
var ControllerY = 2;
var ControllerStickUpDown = 1;
var ControllerStickLeftRight = 0;
var ControllerStickRight = 1;
var ControllerStickDown = 1;
var ControllerDPadUp = 12;
var ControllerDPadDown = 13;
var ControllerDPadLeft = 14;
var ControllerDPadRight = 15;
var Calibrating = false;
var Stick = false;
var waitasec = false;






function ClearButtons() {
    ButtonsX = [];
    ButtonsY = [];
}

function setButton(X, Y) {
    if (IgnoreButton == false) {
        X += 10;
        Y += 10;
        if (!ButtonExists(X, Y)) {
            ButtonsX.push(X);
            ButtonsY.push(Y);
        }
    }
}

function ButtonExists(X, Y) {
    var fff = 0; //just a var for counting
    var ButtonExists = false;
    while (fff < ButtonsX.length) {
        if (ButtonsX[fff] == X && ButtonsY[fff] == Y) {
            ButtonExists = true;
        }
        fff += 1;
    }
    return ButtonExists;
}


function ControllerAxis(axes) {
    if (Calibrating == false) {
        var g = 0;
        while (g < axes.length && Stick == false) {
            if (Math.abs(axes[g]) > 0.1) {
                Stick = true;
            }
            g += 1;
        }
        if (Stick == true && ControllerActive == true) {
            MouseY += axes[ControllerStickUpDown] * ControllerStickDown * 5;
            MouseX += axes[ControllerStickLeftRight] * ControllerStickRight * 5;
            if (MouseX < 0) {
                MouseX = 0;
            }
            if (MouseX > 2000) {
                MouseX = 2000;
            }
            if (MouseY < 0) {
                MouseY = 0;
            }
            if (MouseY > 1000) {
                MouseY = 1000;
            }
        }
    }
    if (Calibrating == true) {
        if (CalibrationStage == 101) {
            var g = 0;
            var f = false;
            while (g < axes.length && f == false) {
                if (Math.abs(axes[g]) > 0.8) {
                    ControllerStickUpDown = g;
                    if (axes[g] > 0) {
                        ControllerStickDown = -1;
                    }
                    if (axes[g] < 0) {
                        ControllerStickDown = 1;
                    }
                    waitasec = true;
                    CalibrationStage = 102;
                    f = true;
                }
                g += 1;
            }
        }
        if (CalibrationStage == 102) {
            if (waitasec == true) {
                var g = 0;
                var f = false;
                while (g < axes.length) {
                    if (Math.abs(axes[g]) > 0.1) {
                        f = true;
                    }
                    g += 1;
                }
                if (f == false) {
                    waitasec = false;
                }
            }
            if (waitasec == false) {
                var g = 0;
                var f = false;
                while (g < axes.length && f == false) {
                    if (Math.abs(axes[g]) > 0.8) {
                        ControllerStickLeftRight = g;
                        if (axes[g] > 0) {
                            ControllerStickRight = 1;
                        }
                        if (axes[g] < 0) {
                            ControllerStickRight = -1;
                        }
                        CalibrationStage = 0;
                        Calibrating = false;
                        f = true;
                    }
                    g += 1;
                }
            }
        }
    }
}


function ControllerButton(buttons) {
    if (ControllerActive == true) {
        if (ButtonsRepeat == false) {
            if (Calibrating == false) {
                if (buttons[ControllerA].pressed == true) {
                    ControllerClick();
                    ButtonsRepeat = true;
                }

                if (buttons[ControllerB].pressed == true) {
                    if (typeof window[CurrentScreen + "Exit"] === "function") {
                        window[CurrentScreen + "Exit"]();
                    } else if ((CurrentCharacter != null) && Array.isArray(DialogMenuButton) && (DialogMenuButton.indexOf("Exit") >= 0)) {
                        if (!DialogLeaveFocusItem())
                            DialogLeaveItemMenu();
                    } else if ((CurrentCharacter != null) && (CurrentScreen == "ChatRoom")) {
                        DialogLeave();
                    } else if ((CurrentCharacter == null) && (CurrentScreen == "ChatRoom") && (document.getElementById("TextAreaChatLog") != null)) {
                        ElementScrollToEnd("TextAreaChatLog");
                    }
                    ButtonsRepeat = true;
                }

                if (buttons[ControllerX].pressed == true) {
                    KeyPress = 65;
                    DialogKeyDown();
                    ButtonsRepeat = true;
                }

                if (buttons[ControllerY].pressed == true) {
                    KeyPress = 97;
                    DialogKeyDown();
                    ButtonsRepeat = true;
                }

                if (buttons[ControllerDPadUp].pressed == true) {
                    Stick = true;
                    ControllerUp();
                    ButtonsRepeat = true;
                }
                if (buttons[ControllerDPadDown].pressed == true) {
                    Stick = true;
                    ControllerDown();
                    ButtonsRepeat = true;
                }
                if (buttons[ControllerDPadLeft].pressed == true) {
                    Stick = true;
                    ControllerLeft();
                    ButtonsRepeat = true;
                }
                if (buttons[ControllerDPadRight].pressed == true) {
                    Stick = true;
                    ControllerRight();
                    ButtonsRepeat = true;
                }
            }
            if (ButtonsRepeat == false) {
                if (Calibrating == true) {
                    if (ButtonsRepeat == false) {
                        if (CalibrationStage == 1) {
                            var g = 0;
                            var h = false;
                            while (g < buttons.length && h == false) {
                                if (buttons[g].pressed == true) {
                                    ControllerA = g;
                                    h = true;
                                    CalibrationStage = 2;
                                    ButtonsRepeat = true;
                                }
                                g += 1;
                            }
                        }
                    }

                    if (ButtonsRepeat == false) {
                        if (CalibrationStage == 2) {
                            var g = 0;
                            var h = false;
                            while (g < buttons.length && h == false) {
                                if (buttons[g].pressed == true) {
                                    ControllerB = g;
                                    h = true;
                                    CalibrationStage = 3;
                                    ButtonsRepeat = true;
                                }
                                g += 1;
                            }
                        }
                    }
                    if (ButtonsRepeat == false) {
                        if (CalibrationStage == 3) {
                            var g = 0;
                            var h = false;
                            while (g < buttons.length && h == false) {
                                if (buttons[g].pressed == true) {
                                    ControllerX = g;
                                    h = true;
                                    CalibrationStage = 4;
                                    ButtonsRepeat = true;
                                }
                                g += 1;
                            }
                        }
                    }
                    if (ButtonsRepeat == false) {
                        if (CalibrationStage == 4) {
                            var g = 0;
                            var h = false;
                            while (g < buttons.length && h == false) {
                                if (buttons[g].pressed == true) {
                                    ControllerY = g;
                                    h = true;
                                    CalibrationStage = 5;
                                    ButtonsRepeat = true;
                                }
                                g += 1;
                            }
                        }
                    }
                    if (ButtonsRepeat == false) {
                        if (CalibrationStage == 5) {
                            var g = 0;
                            var h = false;
                            while (g < buttons.length && h == false) {
                                if (buttons[g].pressed == true) {
                                    ControllerDPadUp = g;
                                    h = true;
                                    CalibrationStage = 6;
                                    ButtonsRepeat = true;
                                }
                                g += 1;
                            }
                        }
                    }
                    if (ButtonsRepeat == false) {
                        if (CalibrationStage == 6) {
                            var g = 0;
                            var h = false;
                            while (g < buttons.length && h == false) {
                                if (buttons[g].pressed == true) {
                                    ControllerDPadDown = g;
                                    h = true;
                                    CalibrationStage = 7;
                                    ButtonsRepeat = true;
                                }
                                g += 1;
                            }
                        }
                    }
                    if (ButtonsRepeat == false) {
                        if (CalibrationStage == 7) {
                            var g = 0;
                            var h = false;
                            while (g < buttons.length && h == false) {
                                if (buttons[g].pressed == true) {
                                    ControllerDPadLeft = g;
                                    h = true;
                                    CalibrationStage = 8;
                                    ButtonsRepeat = true;
                                }
                                g += 1;
                            }
                        }
                    }
                    if (ButtonsRepeat == false) {
                        if (CalibrationStage == 8) {
                            var g = 0;
                            var h = false;
                            while (g < buttons.length && h == false) {
                                if (buttons[g].pressed == true) {
                                    ControllerDPadRight = g;
                                    h = true;
                                    CalibrationStage = 0;
                                    Calibrating = 0;
                                    ButtonsRepeat = true;
                                }
                                g += 1;
                            }
                        }
                    }
                }
            }
        }


        if (ButtonsRepeat == true) {
            var g = 0;
            var h = false;
            while (g < buttons.length && h == false) {
                if (buttons[g].pressed == true) {
                    h = true;
                }
                g += 1
            }
            if (h == false) {
                ButtonsRepeat = false;
            }
        }
    }
}


//uncomment to test it with keyboard
/**
 * handles controller/keyboard inputs 
 * @returns {void} Nothing
 */
function ControllerSupportKeyDown() {
/*i*///    if (KeyPress == 105) ControllerUp();
/*k*///    if (KeyPress == 107) ControllerDown();
/*j*///    if (KeyPress == 106) ControllerLeft();
/*l*///    if (KeyPress == 108) ControllerRight();
/*space*///if (KeyPress == 32) ControllerClick();
}

function ControllerClick() {
    if (ControllerActive == true) {
        if (Stick == false) {
            MouseX = ButtonsX[CurrentButton];
            MouseY = ButtonsY[CurrentButton];
        }
        CommonClick();
    }
}

function ControllerUp() {
    MouseX = ButtonsX[CurrentButton];
    MouseY = ButtonsY[CurrentButton];
    // console.log("starting search");
    if (CurrentButton > ButtonsX.length) CurrentButton = 0;
    var CurrentY = ButtonsY[CurrentButton];
    var CurrentX = ButtonsX[CurrentButton];
    var found = false;
    while (CurrentY > 0 && found == false) {
        CurrentY -= 1;
        var f = 0;
        while (f < ButtonsX.length && found == false) {
            if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                found = true;
                MouseX = CurrentX;
                MouseY = CurrentY;
                CurrentButton = f;
                //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
            }
            f += 1;
            //console.log("searching: " + CurrentY + " " + CurrentX); //debug
        }
    }
    if (found == false) {
        // console.log("round 2");
        var CurrentY = ButtonsY[CurrentButton];
        var CurrentX = ButtonsX[CurrentButton];
        var CurrentXX = ButtonsX[CurrentButton];
        while (CurrentY > 0 && found == false) {
            CurrentY -= 1;
            var OffsetX = 0;
            while (OffsetX < 2000 && found == false) {
                OffsetX += 1;
                CurrentX = CurrentXX + OffsetX;
                var f = 0;
                while (f < ButtonsX.length && found == false) {
                    if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                        found = true;
                        MouseX = CurrentX;
                        MouseY = CurrentY;
                        CurrentButton = f;
                        //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
                    }
                    f += 1;
                    //console.log("searching: " + CurrentY + " " + CurrentX); //debug
                }
                CurrentX = CurrentXX - OffsetX;
                var f = 0;
                while (f < ButtonsX.length && found == false) {
                    if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                        found = true;
                        MouseX = CurrentX;
                        MouseY = CurrentY;
                        CurrentButton = f;
                        //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
                    }
                    f += 1;
                    //console.log("searching: " + CurrentY + " " + CurrentX); //debug
                }
                //console.log(OffsetX);
            }
            //console.log("searching round 2 Y=" + CurrentY);
            //console.log("searching round 2 MouseX, MouseY=" + MouseX + ", " + MouseY);
        }
    }
    if (found == false) {
        // console.log("not found");
    }
}

function ControllerDown() {
    MouseX = ButtonsX[CurrentButton];
    MouseY = ButtonsY[CurrentButton];
    // console.log("starting search");
    if (CurrentButton > ButtonsX.length) CurrentButton = 0;
    var CurrentY = ButtonsY[CurrentButton];
    var CurrentX = ButtonsX[CurrentButton];
    var found = false;
    while (CurrentY < 1000 && found == false) {
        CurrentY += 1;
        var f = 0;
        while (f < ButtonsX.length && found == false) {
            if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                found = true;
                MouseX = CurrentX;
                MouseY = CurrentY;
                CurrentButton = f;
                //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
            }
            f += 1;
            //console.log("searching: " + CurrentY + " " + CurrentX); //debug
        }
    }
    if (CurrentY >= 1000 && found == false) {
        // console.log("round 2");
        var CurrentY = ButtonsY[CurrentButton];
        var CurrentX = ButtonsX[CurrentButton];
        var CurrentXX = ButtonsX[CurrentButton];
        while (CurrentY < 1000 && found == false) {
            CurrentY += 1;
            var OffsetX = 0;
            while (OffsetX < 2000 && found == false) {
                OffsetX += 1;
                CurrentX = CurrentXX + OffsetX;
                var f = 0;
                while (f < ButtonsX.length && found == false) {
                    if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                        found = true;
                        MouseX = CurrentX;
                        MouseY = CurrentY;
                        CurrentButton = f;
                        //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
                    }
                    f += 1;
                    //console.log("searching: " + CurrentY + " " + CurrentX); //debug
                }
                CurrentX = CurrentXX - OffsetX;
                var f = 0;
                while (f < ButtonsX.length && found == false) {
                    if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                        found = true;
                        MouseX = CurrentX;
                        MouseY = CurrentY;
                        CurrentButton = f;
                        //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
                    }
                    f += 1;
                    //console.log("searching: " + CurrentY + " " + CurrentX); //debug
                }
                //console.log(OffsetX);
            }
            //console.log("searching round 2 Y=" + CurrentY);
            //console.log("searching round 2 MouseX, MouseY=" + MouseX + ", " + MouseY);
        }
    }
    if (found == false) {
        // console.log("not found");
    }
}

function ControllerLeft() {
    MouseX = ButtonsX[CurrentButton];
    MouseY = ButtonsY[CurrentButton];
    // console.log("starting search");
    if (CurrentButton > ButtonsX.length) CurrentButton = 0;
    var CurrentY = ButtonsY[CurrentButton];
    var CurrentX = ButtonsX[CurrentButton];
    var found = false;
    while (CurrentX > 0 && found == false) {
        CurrentX -= 1;
        var f = 0;
        while (f < ButtonsX.length && found == false) {
            if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                found = true;
                MouseX = CurrentX;
                MouseY = CurrentY;
                CurrentButton = f;
                //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
            }
            f += 1;
            //console.log("searching: " + CurrentY + " " + CurrentX); //debug
        }
    }
    if (found == false) {
        // console.log("round 2");
        var CurrentY = ButtonsY[CurrentButton];
        var CurrentX = ButtonsX[CurrentButton];
        var CurrentYY = ButtonsY[CurrentButton];
        while (CurrentX > 0 && found == false) {
            CurrentX -= 1;
            var OffsetY = 0;
            while (OffsetY < 1000 && found == false) {
                OffsetY += 1;
                CurrentY = CurrentYY + OffsetY;
                var f = 0;
                while (f < ButtonsX.length && found == false) {
                    if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                        found = true;
                        MouseX = CurrentX;
                        MouseY = CurrentY;
                        CurrentButton = f;
                        //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
                    }
                    f += 1;
                    //console.log("searching: " + CurrentY + " " + CurrentX); //debug
                }
                CurrentY = CurrentYY - OffsetY;
                var f = 0;
                while (f < ButtonsX.length && found == false) {
                    if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                        found = true;
                        MouseX = CurrentX;
                        MouseY = CurrentY;
                        CurrentButton = f;
                        //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
                    }
                    f += 1;
                    //console.log("searching: " + CurrentY + " " + CurrentX); //debug
                }
                //console.log(OffsetX);
            }
            //console.log("searching round 2 Y=" + CurrentY);
            //console.log("searching round 2 MouseX, MouseY=" + MouseX + ", " + MouseY);
        }
    }
    if (found == false) {
        // console.log("not found");
    }
}

function ControllerRight() {
    MouseX = ButtonsX[CurrentButton];
    MouseY = ButtonsY[CurrentButton];
    // console.log("starting search");
    if (CurrentButton > ButtonsX.length) CurrentButton = 0;
    var CurrentY = ButtonsY[CurrentButton];
    var CurrentX = ButtonsX[CurrentButton];
    var found = false;
    while (CurrentX <= 2000 && found == false) {
        CurrentX += 1;
        var f = 0;
        while (f < ButtonsX.length && found == false) {
            if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                found = true;
                MouseX = CurrentX;
                MouseY = CurrentY;
                CurrentButton = f;
                //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
            }
            f += 1;
            //console.log("searching: " + CurrentY + " " + CurrentX); //debug
        }
    }
    if (found == false) {
        // console.log("round 2");
        var CurrentY = ButtonsY[CurrentButton];
        var CurrentX = ButtonsX[CurrentButton];
        var CurrentYY = ButtonsY[CurrentButton];
        while (CurrentX < 2000 && found == false) {
            CurrentX += 1;
            var OffsetY = 0;
            while (OffsetY < 1000 && found == false) {
                OffsetY += 1;
                CurrentY = CurrentYY + OffsetY;
                var f = 0;
                while (f < ButtonsX.length && found == false) {
                    if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                        found = true;
                        MouseX = CurrentX;
                        MouseY = CurrentY;
                        CurrentButton = f;
                        //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
                    }
                    f += 1;
                    //console.log("searching: " + CurrentY + " " + CurrentX); //debug
                }
                CurrentY = CurrentYY - OffsetY;
                var f = 0;
                while (f < ButtonsX.length && found == false) {
                    if (CurrentY == ButtonsY[f] && CurrentX == ButtonsX[f]) {
                        found = true;
                        MouseX = CurrentX;
                        MouseY = CurrentY;
                        CurrentButton = f;
                        //console.log("found at X=" + CurrentX + ", Y=" + CurrentY);
                    }
                    f += 1;
                    //console.log("searching: " + CurrentY + " " + CurrentX); //debug
                }
                //console.log(OffsetX);
            }
            //console.log("searching round 2 Y=" + CurrentY);
            //console.log("searching round 2 MouseX, MouseY=" + MouseX + ", " + MouseY);
        }
    }
    if (found == false) {
        // console.log("not found");
    }
}





//old version (just in case i need it at some point)
 /*   function ControllerUp() {
        if (CurrentButton > 0) {
            CurrentButton -= 1;
            MouseX = ButtonsX[CurrentButton];
            MouseY = ButtonsY[CurrentButton];
        }
    }
    function ControllerDown() {
        if (CurrentButton < ButtonsX.length - 1) {
            CurrentButton += 1;
            MouseX = ButtonsX[CurrentButton];
            MouseY = ButtonsY[CurrentButton];
        }
    }
*/


