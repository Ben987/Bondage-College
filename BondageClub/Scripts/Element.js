"use strict";

/** 
 * Handles the value of a HTML element. It sets the value of the element when the Value parameter is provided or it returns the value when the parameter is omitted
 * @param {string} ID - The id of the element for which we want to get/set the value.
 * @param {string} [Value] - The value to give to the element (if applicable)
 * @returns {string | undefined} - The value of the element (When no value parameter was passed to the function)
 */
function ElementValue(ID, Value) {
	if (document.getElementById(ID) != null)
		if (Value == null)
			return document.getElementById(ID).value.trim();
		else
			document.getElementById(ID).value = Value;
}

// Returns the current HTML content of an element

/** 
 * Handles the content of a HTML element. It sets the content of the element when the Content parameter is provided or it returns the value when the parameter is omitted
 * @param {string} ID - The id of the element for which we want to get/set the value.
 * @param {string} [Content] - The content/inner HTML to give to the element (if applicable)
 * @returns {string | undefined} - The content of the element (When no Content parameter was passed to the function)
 */
function ElementContent(ID, Content) {
	if (document.getElementById(ID) != null)
		if (Content == null)
			return document.getElementById(ID).innerHTML;
		else
			document.getElementById(ID).innerHTML = Content;
}

/**
 * Creates a new text area element in the main document. Does not create a new element if there is already an existing one with the same ID
 * @param {string} ID - The id of the text area to create.
 * @returns {void} - Nothing
 */
function ElementCreateTextArea(ID) {
	if (document.getElementById(ID) == null) {
		var TextArea = document.createElement("TextArea");
		TextArea.setAttribute("ID", ID);
		TextArea.setAttribute("name", ID);
		TextArea.addEventListener("keydown", KeyDown);
		TextArea.className = "HideOnPopup";
		document.body.appendChild(TextArea);
	}
}

/** 
 * Creates a new text input element in the main document.Does not create a new element if there is already an existing one with the same ID
 * @param {string} ID - The id of the input tag to create.
 * @param {string} Type - Type of the input tag to create.
 * @param {string} Value - Value of the input tag to create.
 * @param {string} MaxLength - Maximum input tag of the input to create.
 * @returns {void} - Nothing
 */
function ElementCreateInput(ID, Type, Value, MaxLength) {
	if (document.getElementById(ID) == null) {
		var Input = document.createElement("input");
		Input.setAttribute("ID", ID);
		Input.setAttribute("name", ID);
		Input.setAttribute("type", Type);
		Input.setAttribute("value", Value);
		Input.setAttribute("maxlength", MaxLength);
		Input.setAttribute("onfocus", "this.removeAttribute('readonly');");
		Input.addEventListener("keydown", KeyDown);
		Input.className = "HideOnPopup";
		document.body.appendChild(Input);
	}
}

/** 
 * Creates a new div element in the main document. Does not create a new element if there is already an existing one with the same ID
 * @param {string} ID - The id of the div tag to create.
 * @returns {void} - Nothing
 */
function ElementCreateDiv(ID) {
	if (document.getElementById(ID) == null) {
		var Div = document.createElement("div");
		Div.setAttribute("ID", ID);
		Div.setAttribute("name", ID);
		Div.addEventListener("keydown", KeyDown);
		Div.className = "HideOnPopup";
		document.body.appendChild(Div);
	}
}

/**
 * Removes an element from the main document
 * @param {string} ID - The id of the tag to remove from the document.
 * @returns {void} - Nothing
 */
function ElementRemove(ID) {
	if (document.getElementById(ID) != null)
		document.getElementById(ID).parentNode.removeChild(document.getElementById(ID));
}

/** 
 * Draws an existing HTML element at a specific position within the document. The element is "centered" on the given coordinates by dividing its height and width by two. 
 * @param {string} ElementID - The id of the input tag to (re-)position.
 * @param {number} X - Center point of the element on the X axis.
 * @param {number} Y - Center point of the element on the Y axis.
 * @param {number} W - Width of the element.
 * @param {number} H - Height of the element.
 * @returns {void} - Nothing
 */
function ElementPosition(ElementID, X, Y, W, H) {

	// Different positions based on the width/height ratio
	var Font;
	var Height;
	var Left;
	var Width;
	var Top;
	if (DrawScreenWidth <= DrawScreenHeight * 2) {
		Font = (DrawScreenWidth / 50);
		Height = H ? (H * DrawScreenWidth / 2000) : (Font * 1.15);
		Left = ((X - (W / 2)) * DrawScreenWidth / 2000);
		Width = (W * DrawScreenWidth / 2000) - 18;
		Top = (Y * DrawScreenWidth / 2000) + ((DrawScreenHeight * 2 - DrawScreenWidth) / 4) - (Height / 2);
	} else {
		Font = (DrawScreenHeight / 25);
		Height = H ? (H * DrawScreenHeight / 1000) : (Font * 1.15);
		Left = ((X - (W / 2)) * DrawScreenHeight / 1000) + (DrawScreenWidth - DrawScreenHeight * 2) / 2;
		Width = (W * DrawScreenHeight / 1000) - 18;
		Top = (Y * DrawScreenHeight / 1000) - (Height / 2);
	}

	// Sets the element style
	document.getElementById(ElementID).setAttribute("style", "font-size:" + Font + "px; font-family:Arial; position:absolute; padding-left:10px; left:" + Left + "px; top:" + Top + "px; width:" + Width + "px; height:" + Height + "px;");

}

/** 
 * Draws an existing HTML element at a specific position within the document. The element will not be centered on its given coordinates unlike the ElementPosition function. 
 * @param {string} ElementID - The id of the input tag to (re-)position.
 * @param {number} X - Starting point of the element on the X axis.
 * @param {number} Y - Starting point of the element on the Y axis.
 * @param {number} W - Width of the element.
 * @param {number} H - Height of the element.
 * @returns {void} - Nothing
 */
function ElementPositionFix(ElementID, Font, X, Y, W, H) {

	// Different positions based on the width/height ratio
	var Left;
	var Width;
	var Top;
	var Height;
	if (DrawScreenWidth <= DrawScreenHeight * 2) {
		Font = Font * DrawScreenWidth / 2000;
		Left = X * DrawScreenWidth / 2000;
		Width = W * DrawScreenWidth / 2000;
		Top = (Y * DrawScreenWidth / 2000) + ((DrawScreenHeight * 2 - DrawScreenWidth) / 4);
		Height = H * DrawScreenWidth / 2000;
	} else {
		Font = Font * DrawScreenHeight / 1000;
		Left = (X * DrawScreenHeight / 1000) + (DrawScreenWidth - DrawScreenHeight * 2) / 2;
		Width = W * DrawScreenHeight / 1000;
		Top = Y * DrawScreenHeight / 1000;
		Height = H * DrawScreenHeight / 1000;
	}

	// Sets the element style
	document.getElementById(ElementID).setAttribute("style", "font-size:" + Font + "px; font-family:Arial; position:absolute; padding-left:10px; left:" + Left + "px; top:" + Top + "px; width:" + Width + "px; height:" + Height + "px; resize: none;");

}

/** 
 * Sets a custom data-attribute to a specified value on a specified element
 * @param {string} ID - The id of the element to create/set the data attribute of.
 * @param {string} Name - Name of the data attribute. ("data-" will be automatically appended to it.)
 * @param {string} Value - Value to give to the attribute.
 * @returns {void} - Nothing
 */
function ElementSetDataAttribute(ID, Name, Value) {
	var element = document.getElementById(ID);
	if (element != null) {
		element.setAttribute(("data-" + Name).toLowerCase(), Value.toString().toLowerCase());
	}
}

/**
 * Scrolls to the end of a specified element
 * @param {string} ID - The id of the element to scroll down to the bottom of.
 * @returns {void} - Nothing
 */
function ElementScrollToEnd(ID) {
	var element = document.getElementById(ID);
	if (element != null) element.scrollTop = element.scrollHeight;
}

/**
 * Checks if a given HTML element is scrolled to the very bottom. 
 * @param {string} ID - The id of the element to check for scroll height.
 * @returns {boolean} - Returns TRUE if the specified element is scrolled to the very bottom
 */
function ElementIsScrolledToEnd(ID) {
	var element = document.getElementById(ID);
	return element != null && element.scrollHeight - element.scrollTop - element.clientHeight < 1
}

/**
 * Gives focus to a specified existing element for non-mobile users. 
 * @param {string} ID - The id of the element to give focus to.
 * @returns {void} - Nothing
 */
function ElementFocus(ID) {
	if ((document.getElementById(ID) != null) && !CommonIsMobile)
		document.getElementById(ID).focus();
}