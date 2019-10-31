"use strict";

// Returns TRUE if the current speech phrase is a full emote (all between parentheses)
function SpeechFullEmote(D) {
	return ((D.indexOf("(") == 0) && (D.indexOf(")") == D.length - 1));
}

function SpeechGarble(C, CD) {
	/*
	Garbles the speech if the character is gagged.
	Anything between parentheses stays untouched.
	:Param Object C: An object containing information about the player.
	:Param string CD: The message that the player wants to send.
	:Return string: The garbled sentence.
	*/

	// Variables to build the new string and check if we are in a parentheses
	var NS = "";
	var Par = false;
	if (CD == null) CD = "";

	// Total gags always returns mmmmm
	if (C.Effect.indexOf("GagTotal") >= 0 || ((C.ID != 0) && (Player.Effect.indexOf("DeafTotal") >= 0))) {
		NS = GarbleLoop(CD, "total");
		NS = SpeechStutter(C, NS);
		NS = SpeechBabyTalk(C, NS);
		return NS;
	}

	// Heavy garble - Almost no letter stays the same
	if (C.Effect.indexOf("GagHeavy") >= 0 || ((C.ID != 0) && (Player.Effect.indexOf("DeafHeavy") >= 0))) {
		NS = GarbleLoop(CD, "heavy");
		NS = SpeechStutter(C, NS);
		NS = SpeechBabyTalk(C, NS);
		return NS;
	}

	// Normal garble, keep vowels and a few letters the same
	if (C.Effect.indexOf("GagNormal") >= 0 || ((C.ID != 0) && (Player.Effect.indexOf("DeafNormal") >= 0))) {
		NS = GarbleLoop(CD, "normal");
		NS = SpeechStutter(C, NS);
		NS = SpeechBabyTalk(C, NS);
		return NS;
	}

	// Light garble, half of the letters stay the same
	if (C.Effect.indexOf("GagLight") >= 0 || ((C.ID != 0) && (Player.Effect.indexOf("DeafLight") >= 0))) {
		NS = GarbleLoop(CD, "light");
		NS = SpeechStutter(C, NS);
		NS = SpeechBabyTalk(C, NS);
		return NS;
	}

	// No gag effect, we return the regular text
	CD = SpeechStutter(C, CD);
	CD = SpeechBabyTalk(C, CD);
	return CD;

}

function GarbleLoop(CD, weight) {
	/*
	Starts the loop that goes over the message to garble it.
	A seperate function does the actual garbling.
	:Param string CD: The message to garble.
	:Param string weight: Indicates how badly to garble.
	:return string: The garbled message.
	*/
	var Par = false;
	var NS = "";

	for (var L = 0; L < CD.length; L++) {
		var H = CD.charAt(L).toLowerCase();
		if (H == "(") Par = true;
		if (Par) NS += CD.charAt(L);
		else NS += Garble(H, weight);
		if (H == ")") Par = false;
	}
	return NS
}

function Garble(H, weight) {
	/*
	Replaces the letters with a different one, garbling what you are saying.
	:Param string H: A letter of a word you are trying to say.
	:Param string weight: An indicator indicating how badly to garble.
	:Returns string: The different letter.
	*/
	if (weight === "total") {
		if (H == " " || H == "." || H == "?" || H == "!" || H == "~") return H;
		else return "m";
	}
	else if (weight === "heavy") {
		// Regular characters
		if (H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y" || H == "t") return "e";
		if (H == "c" || H == "q" || H == "x") return "k";
		if (H == "j" || H == "k" || H == "l" || H == "r" || H == "w") return "a";
		if (H == "s" || H == "z" || H == "h") return "h";
		if (H == "b" || H == "p" || H == "v") return "f";
		if (H == "d" || H == "f" || H == "g" || H == "n" || H == "m") return "m";
		if (H == " " || H == "." || H == "?" || H == "!" || H == "~") return H;

		// Accents/Latin characters
		if (H == "á" || H == "â" || H == "à" || H == "é" || H == "ê" || H == "è" || H == "ë" || H == "í" || H == "î" || H == "ì" || H == "ï" || H == "ó" || H == "ô" || H == "ò" || H == "ú" || H == "û" || H == "ù" || H == "ü") NS = NS + "e";
		if (H == "ç") NS = NS + "h";
		if (H == "ñ") NS = NS + "m";

		// Cyrillic characters
		if (H == "а" || H == "е" || H == "и" || H == "о" || H == "у" || H == "ю" || H == "л"|| H == "я") NS = NS + "е";
		if (H == "с" || H == "й" || H == "х") NS = NS + "к";
		if (H == "ж" || H == "к" || H == "л" || H == "р" || H == "у") NS = NS + "а";
		if (H == "з" || H == "с" || H == "г" || H == "й") NS = NS + "г";
		if (H == "б" || H == "р" || H == "в" || H == "ы") NS = NS + "ф";
		if (H == "д" || H == "ф" || H == "г" || H == "н" || H == "м") NS = NS + "м";
	}
	else if (weight === "normal") {
		// Regular characters
		if (H == "v" || H == "b" || H == "c" || H == "t") return "e";
		if (H == "q" || H == "k" || H == "x") return "k";
		if (H == "w" || H == "y" || H == "j" || H == "l" || H == "r") return "a";
		if (H == "s" || H == "z") return "h";
		if (H == "d" || H == "f") return "m";
		if (H == "p") return "f";
		if (H == "g")return "n";
		if (H == " " || H == "!" || H == "?" || H == "." || H == "~" || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "m" || H == "n" || H == "h") return H;

		// Accents/Latin characters
		if (H == "á" || H == "â" || H == "à") NS = NS + "a";
		if (H == "é" || H == "ê" || H == "è" || H == "ë") NS = NS + "e";
		if (H == "í" || H == "î" || H == "ì" || H == "ï") NS = NS + "i";
		if (H == "ó" || H == "ô" || H == "ò") NS = NS + "o";
		if (H == "ú" || H == "û" || H == "ù" || H == "ü") NS = NS + "u";
		if (H == "ç") NS = NS + "s";
		if (H == "ñ") NS = NS + "n";

		// Cyrillic characters
		if (H == "в" || H == "ф" || H == "б" || H == "п") NS = NS + "фы";
		if (H == "г" || H == "к" || H == "х") NS = NS + "к";
		if (H == "в" || H == "у" || H == "ж" || H == "л" || H == "р") NS = NS + "а";
		if (H == "с" || H == "я") NS = NS + "х";
		if (H == "д" || H == "ф") NS = NS + "м";
		if (H == "р") NS = NS + "ф";
		if (H == "г") NS = NS + "н";
	}
	else if (weight === "light") {
		// Regular characters
		if (H == "c" || H == "t") return "e";
		if (H == "q" || H == "k" || H == "x") return "k";
		if (H == "j" || H == "l" || H == "r") return "a";
		if (H == "s") return "z";
		if (H == "z") return "s";
		if (H == "d" || H == "f" || H == "m" || H == "g") return "m";
		if (H == "b" || H == "h" || H == "n" || H == "v" || H == "w" || H == "p" || H == " " || H == "'" || H == "?" || H == "!" || H == "." || H == "," || H == "~" || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y") return H;

		// Accents/Latin characters
		if (H == "á" || H == "â" || H == "à") NS = NS + "a";
		if (H == "é" || H == "ê" || H == "è" || H == "ë") NS = NS + "e";
		if (H == "í" || H == "î" || H == "ì" || H == "ï") NS = NS + "i";
		if (H == "ó" || H == "ô" || H == "ò") NS = NS + "o";
		if (H == "ú" || H == "û" || H == "ù" || H == "ü") NS = NS + "u";
		if (H == "ç") NS = NS + "s";
		if (H == "ñ") NS = NS + "n";

		// Cyrillic characters
		if (H == "ч" || H == "ц") NS = NS + "е";
		if (H == "й" || H == "ф" || H == "в") NS = NS + "к";
		if (H == "д" || H == "л" || H == "щ"|| H == "я") NS = NS + "а";
		if (H == "з") NS = NS + "с";
		if (H == "с") NS = NS + "з";
		if (H == "д" || H == "ф" || H == "м" || H == "г") NS = NS + "м";
		if (H == "а" || H == "п" || H == "р" || H == "о" || H == "к" || H == "е"  || H == "н" || H == "м" || H == "и" || H == "т" ) NS = NS + H;
	}
	else if (weight === "babytalk") {
		if (H == "k" || H == "l") return "w";
		if (H == "s") return "sh";
		if (H == "t") return "st";
		if (H == "a" || H == "b" || H == "c" || H == "d" || H == "e" || H == "f" || H == "g" || H == "h" || H == "i" || H == "j" || H == "m" || H == "n" || H == "o" || H == "p" || H == "q" || H == "r" || H == "u" || H == "v" || H == "w" || H == "x" || H == "y" || H == "z" || H == " " || H == "'" || H == "?" || H == "!" || H == "." || H == ",") return H;
	}
}

function SpeechStutter(C, CD) {
	/*
	Makes the character stutter if she has a vibrating egg set to high intensity.
	:Param object C: An object containing information about the player.
	:Param string CD: The message that has to be stuttered.
	:return string: The message, stuttered or regular.
	*/
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
			if (!Par && CS >= 0 && (H.match(/[[a-zа-яё]/i))) {

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

function SpeechBabyTalk(C, CD) {
	/*
	Makes the Player talk like a baby if drunk on regression milk.
	:Param object C: An object containing information about the player.
	:Param string CD: The message that has to be put in baby talk.
	:return string: The message, in baby talk or regular.
	*/
	if (CD == null) CD = "";

	var Par = false;
	var NS = "";

	if (C == Player && NurseryRegressedTalk) {
		// TODO: Needs testing, don't know how to test myself.
		NS = GarbleLoop(CD, "babytalk");
		return NS;
	}

	// Not drunk the milk, we return the regular text
	return CD;
}
