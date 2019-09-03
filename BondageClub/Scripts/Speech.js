"use strict";

// Returns TRUE if the current speech phrase is a full emote (all between parentheses)
function SpeechFullEmote(D) {
	return ((D.indexOf("(") == 0) && (D.indexOf(")") == D.length - 1));
}

// Garbles the speech if the character is gagged, anything between parentheses isn't touched
function SpeechGarble(C, CD) {

	// Variables to build the new string and check if we are in a parentheses
	var NS = "";
	var Par = false;
	if (CD == null) CD = "";

	// Total gags always returns mmmmm
	if (C.Effect.indexOf("GagTotal") >= 0 || ((C.ID != 0) && (Player.Effect.indexOf("DeafTotal") >= 0))) {
		for (var L = 0; L < CD.length; L++) {
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (Par) NS = NS + CD.charAt(L);
			else {
				if (H == " " || H == "." || H == "?" || H == "!" || H == "~") NS = NS + H;
				else NS = NS + "m";
			}

			if (H == ")") Par = false;
		}
		NS = SpeechStutter(C, NS);
		NS = SpeechBabyTalk(C, NS);
		return NS;
	}

	// Heavy garble - Almost no letter stays the same
	if (C.Effect.indexOf("GagHeavy") >= 0 || ((C.ID != 0) && (Player.Effect.indexOf("DeafHeavy") >= 0))) {
		for (var L = 0; L < CD.length; L++) {
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (!Par) {
				if (H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y" || H == "t") NS = NS + "e";
				if (H == "c" || H == "q" || H == "x") NS = NS + "k";
				if (H == "j" || H == "k" || H == "l" || H == "r" || H == "w") NS = NS + "a";
				if (H == "s" || H == "z" || H == "h") NS = NS + "h";
				if (H == "b" || H == "p" || H == "v") NS = NS + "f";
				if (H == "d" || H == "f" || H == "g" || H == "n" || H == "m") NS = NS + "m";
				if (H == " " || H == "." || H == "?" || H == "!" || H == "~") NS = NS + H;
			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		NS = SpeechStutter(C, NS);
		NS = SpeechBabyTalk(C, NS);
		return NS;
	}

	// Normal garble, keep vowels and a few letters the same
	if (C.Effect.indexOf("GagNormal") >= 0 || ((C.ID != 0) && (Player.Effect.indexOf("DeafNormal") >= 0))) {
		for (var L = 0; L < CD.length; L++) {
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (!Par) {
				if (H == "v" || H == "b" || H == "c" || H == "t") NS = NS + "e";
				if (H == "q" || H == "k" || H == "x") NS = NS + "k";
				if (H == "w" || H == "y" || H == "j" || H == "l" || H == "r") NS = NS + "a";
				if (H == "s" || H == "z") NS = NS + "h";
				if (H == "d" || H == "f") NS = NS + "m";
				if (H == "p") NS = NS + "f";
				if (H == "g") NS = NS + "n";
				if (H == " " || H == "!" || H == "?" || H == "." || H == "~" || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "m" || H == "n" || H == "h") NS = NS + H;
			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		NS = SpeechStutter(C, NS);
		NS = SpeechBabyTalk(C, NS);
		return NS;
	}

	// Light garble, half of the letters stay the same
	if (C.Effect.indexOf("GagLight") >= 0 || ((C.ID != 0) && (Player.Effect.indexOf("DeafLight") >= 0))) {
		for (var L = 0; L < CD.length; L++) {
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (!Par) {
				if (H == "c" || H == "t") NS = NS + "e";
				if (H == "q" || H == "k" || H == "x") NS = NS + "k";
				if (H == "j" || H == "l" || H == "r") NS = NS + "a";
				if (H == "s") NS = NS + "z";
				if (H == "z") NS = NS + "s";
				if (H == "d" || H == "f" || H == "m" || H == "g") NS = NS + "m";
				if (H == "b" || H == "h" || H == "n" || H == "v" || H == "w" || H == "p" || H == " " || H == "'" || H == "?" || H == "!" || H == "." || H == "," || H == "~" || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y") NS = NS + H;
			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		NS = SpeechStutter(C, NS);
		NS = SpeechBabyTalk(C, NS);
		return NS;
	}

	// No gag effect, we return the regular text
	CD = SpeechStutter(C, CD);
	CD = SpeechBabyTalk(C, CD);
	return CD;

}

// Makes the character stutter if she has a vibrating egg set to high intensity
function SpeechStutter(C, CD) {

	if (CD == null) CD = "";
	if (C.IsEgged()) {
		var intensity = C.Appearance
			.filter(function (item) { return InventoryItemHasEffect(item, "Egged", true) && item.Property && item.Property.Intensity; })
			.map(function (item) { return item.Property.Intensity; })
			.sort()
			.pop();
		if (intensity == null) intensity = 0;

		// If intensity is lower than 1, no stuttering occurs and we return the regular text
		if (intensity <= 0) return CD;

		var Par = false;
		var CS = 1;
		var seed = CD.length;

		for (var L = 0; L < CD.length; L++) {

			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;

			// If we are not between brackets and at the start of a word, there's a chance to stutter that word
			if (!Par && CS >= 0 && (H.match(/[a-z]/i))) {

				// Generate a pseudo-random number using a seed, so that the same text always stutters the same way.
				var R = Math.sin(seed++) * 10000;
				R = R - Math.floor(R);
				R = Math.floor(R * 10) + 1;
				R += (intensity - 1);
				if (CS == 1 || R >= 10) {
					CD = CD.substring(0, L) + CD.charAt(L) + "-" + CD.substring(L, CD.length);
					L += 2;
				}
				CS = -1;
			}
			if (H == ")") Par = false;
			if (H == " ") CS = 0;
		}
		return CD;
	}

	// No stutter effect, we return the regular text
	return CD;
}

// Makes Character talk like a Baby if the have drunk regression milk
function SpeechBabyTalk(C, CD) {
	if (CD == null) CD = "";

	var Par = false;
	var NS = "";

	if (C == Player && NurseryRegressedTalk) {
		for (var L = 0; L < CD.length; L++) {
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;
			if (!Par) {
				if (H == "k" || H == "l") NS = NS + "w";
				if (H == "s") NS = NS + "sh";
				if (H == "t") NS = NS + "st";
				if (H == "a" || H == "b" || H == "c" || H == "d" || H == "e" || H == "f" || H == "g" || H == "h" || H == "i" || H == "j" || H == "m" || H == "n" || H == "o" || H == "p" || H == "q" || H == "r" || H == "u" || H == "v" || H == "w" || H == "x" || H == "y" || H == "z" || H == " " || H == "'" || H == "?" || H == "!" || H == "." || H == ",") NS = NS + H;
			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// Not drunk the milk, we return the regular text
	return CD;
}
