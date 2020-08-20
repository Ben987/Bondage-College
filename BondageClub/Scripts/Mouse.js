"use strict";
var MouseX = 0;
var MouseY = 0;

/**
 * Check if the mouse position is within the boundaries of a given zone (Useful for UI components)
 * @param {number} Left - Starting position on the X axis
 * @param {number} Top - Starting position on the Y axis
 * @param {number} Width - Width of the zone
 * @param {number} Height - Height of the zone
 * @returns {boolean} - Returns TRUE if the click occurred in the given zone
 */
function MouseIn(Left, Top, Width, Height) {
	return (MouseX >= Left) && (MouseX <= Left + Width) && (MouseY >= Top) && (MouseY <= Top + Height);
}