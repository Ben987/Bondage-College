var ButtonsX = [];
var ButtonsY = [];
var ControllerActive = true;
var CurrentButton = 0;

if (ControllerActive == true) {

    function ClearButtons() {
        ButtonsX = [];
        ButtonsY = [];
    }

    function setButton(X, Y) {
        if (ButtonsX.indexOf(X) < 0 || ButtonsY.indexOf(Y) < 0) {
            ButtonsX.push(X);
            ButtonsY.push(Y);
        }
    }

    /**
     * handles controller/keyboard inputs 
     * @returns {void} Nothing
     */
    function ControllerSupportKeyDown() {
/*i*/    if (KeyPress == 105) ControllerUp();
/*k*/    if (KeyPress == 107) ControllerDown();
/*j*/    if (KeyPress == 106) ControllerLeft();  //jump 5 up for now
/*l*/    if (KeyPress == 108) ControllerRight(); //jump 5 down for now
/*space*/if (KeyPress == 32)  ControllerClick(); 
    }

    function ControllerClick() {
        CommonClick();
    }

    function ControllerUp() {
        if (CurrentButton > 0) {
            CurrentButton -= 1;
            MouseX = ButtonsX[CurrentButton] + 10;
            MouseY = ButtonsY[CurrentButton] + 10;
        }
    }
    function ControllerDown() {
        if (CurrentButton < ButtonsX.length - 1) {
            CurrentButton += 1;
            MouseX = ButtonsX[CurrentButton] + 10;
            MouseY = ButtonsY[CurrentButton] + 10;
        }
    }
    function ControllerLeft() {
        ControllerUp();
        ControllerUp();
        ControllerUp();
        ControllerUp();
        ControllerUp();
    }
    function ControllerRight() {
        ControllerDown();
        ControllerDown();
        ControllerDown();
        ControllerDown();
        ControllerDown();
    }




}