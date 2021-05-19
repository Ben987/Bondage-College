"use strict";

/**
 * A lookup mapping the gag effect names to their corresponding gag level numbers.
 * @type {Object.<string,number>}
 * @constant
 */
var SpeechGagLevelLookup = {
	GagTotal4: 20,
	GagTotal3: 16,
	GagTotal2: 12,
	GagTotal: 8,
	GagVeryHeavy: 7,
	GagHeavy: 6,
	GagMedium: 5,
	GagNormal: 4,
	GagEasy: 3,
	GagLight: 2,
	GagVeryLight: 1,
};

/**
 * Analyzes a phrase to determine if it is a full emote. A full emote is a phrase wrapped in "()"
 * @param {string} D - A phrase
 * @returns {boolean} - Returns TRUE if the current speech phrase is a full emote (all between parentheses)
 */
function SpeechFullEmote(D) {
	return ((D.indexOf("(") == 0) && (D.indexOf(")") == D.length - 1));
}

/**
 * Returns the gag level corresponding to the given effect array, or 0 if the effect array contains no gag effects
 * @param {string} Effect - The effect to lookup the gag level for
 * @return {number} - The gag level corresponding to the given effects
 */
function SpeechGetEffectGagLevel(Effect) {
	return Effect.reduce((Modifier, EffectName) => Modifier + (SpeechGagLevelLookup[EffectName] || 0), 0);
}

/**
 * Gets the cumulative gag level of an asset group. Each gagging effect has a specific numeric value. The following
 * Effect arrays are used for the calculation, (higher on this list means that effect array will override the others):
 *     - Item.Property.Effect
 *     - Item.Asset.Effect
 *     - Item.Asset.Group.Effect
 * @param {Character} C - The character, whose assets are used for the check
 * @param {string} AssetGroup - The name of the asset group to look through
 * @returns {number} - Returns the total gag effect of the character's assets
 */
function SpeechGetGagLevel(C, AssetGroup) {
	var GagEffect = 0;
	for (let i = 0; i < C.Appearance.length; i++) {
		var item = C.Appearance[i];
		if (item.Asset.Group.Name === AssetGroup) {
			var EffectArray = [];
			if (item.Property &&
				Array.isArray(item.Property.Effect) &&
				!(typeof item.Property.Type === "undefined")
			) EffectArray = item.Property.Effect;
			else if (Array.isArray(item.Asset.Effect)) EffectArray = item.Asset.Effect;
			else if (Array.isArray(item.Asset.Group.Effect)) EffectArray = item.Asset.Group.Effect;
			GagEffect += SpeechGetEffectGagLevel(EffectArray);
			break;
		}
	}
	return GagEffect;
}

/**
 * Processes the character's speech, anything between parentheses isn't touched. Effects alter the speech differently according to a character's language. Effects that can be applied are the following: gag talk, baby talk and stuttering.
 * @param {Character} C - The character, whose dialog might need to be altered
 * @param {string} CD - The character's dialog to alter
 * @param {boolean} NoDeaf - Whether or not deafness affects the dialogue
 * @returns {string} - Returns the dialog after speech effects were processed (Garbling, Stuttering, Baby talk)
 */
function SpeechGarble(C, CD, NoDeaf) {
	let GagEffect = 0;
	let NS = CD;
	GagEffect += SpeechGetGagLevel(C, "ItemMouth");
	GagEffect += SpeechGetGagLevel(C, "ItemMouth2");
	GagEffect += SpeechGetGagLevel(C, "ItemMouth3");
	GagEffect += SpeechGetGagLevel(C, "ItemHead");
	GagEffect += SpeechGetGagLevel(C, "ItemHood");
	GagEffect += SpeechGetGagLevel(C, "ItemNeck");
	GagEffect += SpeechGetGagLevel(C, "ItemDevices");
	GagEffect += SpeechGetGagLevel(C, "ItemHoodAddon");

	if (C.ID != 0 && !NoDeaf) {
		if (Player.GetDeafLevel() >= 7) GagEffect = Math.max(GagEffect, 20);
		else if (Player.GetDeafLevel() >= 6) GagEffect = Math.max(GagEffect, 16);
		else if (Player.GetDeafLevel() >= 5) GagEffect = Math.max(GagEffect, 12);
		else if (Player.GetDeafLevel() >= 4) GagEffect = Math.max(GagEffect, 8);
		else if (Player.GetDeafLevel() >= 3) GagEffect = Math.max(GagEffect, 6);
		else if (Player.GetDeafLevel() >= 2) GagEffect = Math.max(GagEffect, 4);
		else if (Player.GetDeafLevel() >= 1) GagEffect = Math.max(GagEffect, 2);
	}

	if (GagEffect > 0) NS = SpeechGarbleByGagLevel(GagEffect, CD);

	// No gag effect, we return the regular text
	NS = SpeechStutter(C, NS);
	NS = SpeechBabyTalk(C, NS);

	return NS;
}

/**
 * The core of the speech garble function, usable without being tied to a specific character
 * @param {Int} GagEffect - The gag level of the speech
 * @param {string} CD - The character's dialog to alter
 */
function SpeechGarbleByGagLevel(GagEffect, CD, IgnoreOOC) {

	// Variables to build the new string and check if we are in a parentheses
	var NS = "";
	var Par = false;
	if (CD == null) CD = "";

	// GagTotal4 always returns mmmmm and muffles some frequent letters entirely, 75% least frequent letters
	if (GagEffect >= 20) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (Par) NS = NS + CD.charAt(L);
			else {
				if (H == " " || H == "." || H == "?" || H == "!" || H == "~" || H == "-") NS = NS + H;
				else if (H == "z" || H == "q" || H == "j" || H == "x" || H == "k" || H == "v" || H == "b" || H == "y" || H == "w" || H == "g" || H == "p" || H == "f" || H == "u" || H == "c" || H == "d" || H == "l" || H == "h" || H == "r") NS = NS + " ";
				else NS = NS + "m";
			}

			if (H == ")") Par = false;
		}
		return NS;
	}

	// GagTotal3 always returns mmmmm and muffles some relatively frequent letters entirely, 50% least frequent letters
	if (GagEffect >= 16) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (Par) NS = NS + CD.charAt(L);
			else {
				if (H == " " || H == "." || H == "?" || H == "!" || H == "~" || H == "-") NS = NS + H;
				else if (H == "z" || H == "q" || H == "j" || H == "x" || H == "k" || H == "v" || H == "b" || H == "y" || H == "w" || H == "g" || H == "p" || H == "f") NS = NS + " ";
				else NS = NS + "m";
			}

			if (H == ")") Par = false;
		}
		return NS;
	}

	// GagTotal2 always returns mmmmm and muffles some less frequent letters entirely; 25% least frequent letters
	if (GagEffect >= 12) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (Par) NS = NS + CD.charAt(L);
			else {
				if (H == " " || H == "." || H == "?" || H == "!" || H == "~" || H == "-") NS = NS + H;
				else if (H == "z" || H == "q" || H == "j" || H == "x" || H == "k" || H == "v") NS = NS + " ";
				else NS = NS + "m";
			}

			if (H == ")") Par = false;
		}
		return NS;
	}

	// Total gags always returns mmmmm
	if (GagEffect >= 8) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (Par) NS = NS + CD.charAt(L);
			else {
				if (H == " " || H == "." || H == "?" || H == "!" || H == "~" || H == "-") NS = NS + H;
				else NS = NS + "m";
			}

			if (H == ")") Par = false;
		}
		return NS;
	}

	// VeryHeavy garble - Close to no letter stays the same
	if (GagEffect >= 7) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (!Par) {

				// Regular characters
				if (H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y") NS = NS + "e";
				if (H == "j" || H == "k" || H == "l" || H == "r") NS = NS + "a";
				if (H == "s" || H == "z" || H == "h") NS = NS + "h";
				if (H == "d" || H == "f" || H == "g" || H == "n" || H == "m" || H == "w" || H == "t" || H == "c" || H == "q" || H == "x" || H == "p" || H == "v") NS = NS + "m";
				if (H == " " || H == "." || H == "?" || H == "!" || H == "~" || H == "-" || H == "b") NS = NS + H;

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

			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// Heavy garble - Almost no letter stays the same
	if (GagEffect >= 6) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (!Par) {

				// Regular characters
				if (H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y" || H == "t") NS = NS + "e";
				if (H == "c" || H == "q" || H == "x") NS = NS + "k";
				if (H == "j" || H == "k" || H == "l" || H == "r" || H == "w") NS = NS + "a";
				if (H == "s" || H == "z" || H == "h") NS = NS + "h";
				if (H == "b" || H == "p" || H == "v") NS = NS + "f";
				if (H == "d" || H == "f" || H == "g" || H == "n" || H == "m") NS = NS + "m";
				if (H == " " || H == "." || H == "?" || H == "!" || H == "~" || H == "-") NS = NS + H;

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

			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// Medium garble - Some letters stays the same
	if (GagEffect >= 5) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (!Par) {

				// Regular characters
				if (H == "e" || H == "i" || H == "o" || H == "u" || H == "y" || H == "t") NS = NS + "e";
				if (H == "c" || H == "q" || H == "x" || H == "k" ) NS = NS + "k";
				if (H == "j" || H == "l" || H == "r" || H == "w" || H == "a") NS = NS + "a";
				if (H == "s" || H == "z" || H == "h") NS = NS + "h";
				if (H == "b" || H == "p" || H == "v") NS = NS + "f";
				if (H == "d" || H == "f" || H == "g" || H == "m") NS = NS + "m";
				if (H == " " || H == "." || H == "?" || H == "!" || H == "~" || H == "-" || H == "n") NS = NS + H;

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

			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// Normal garble, keep vowels and a few letters the same
	if (GagEffect >= 4) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (!Par) {

				// Regular characters
				if (H == "v" || H == "b" || H == "c" || H == "t") NS = NS + "e";
				if (H == "q" || H == "k" || H == "x") NS = NS + "k";
				if (H == "w" || H == "y" || H == "j" || H == "l" || H == "r") NS = NS + "a";
				if (H == "s" || H == "z") NS = NS + "h";
				if (H == "d" || H == "f") NS = NS + "m";
				if (H == "p") NS = NS + "f";
				if (H == "g") NS = NS + "n";
				if (H == " " || H == "!" || H == "?" || H == "." || H == "~" || H == "-" || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "m" || H == "n" || H == "h") NS = NS + H;

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

			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// Easy garble, keep vowels and a some letters the same
	if (GagEffect >= 3) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (!Par) {

				// Regular characters
				if (H == "v" || H == "b" || H == "c" || H == "t") NS = NS + "e";
				if (H == "q" || H == "k" || H == "x") NS = NS + "k";
				if (H == "w" || H == "y" || H == "j" || H == "l" || H == "r") NS = NS + "a";
				if (H == "s" || H == "z") NS = NS + "s";
				if (H == "d") NS = NS + "m";
				if (H == "p") NS = NS + "f";
				if (H == "g") NS = NS + "h";
				if (H == " " || H == "!" || H == "?" || H == "." || H == "~" || H == "-" || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "m" || H == "n" || H == "h" || H == "f") NS = NS + H;

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

			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// Light garble, half of the letters stay the same
	if (GagEffect >= 2) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (!Par) {

				// Regular characters
				if (H == "c" || H == "t") NS = NS + "e";
				if (H == "q" || H == "k" || H == "x") NS = NS + "k";
				if (H == "j" || H == "l" || H == "r") NS = NS + "a";
				if (H == "s") NS = NS + "z";
				if (H == "z") NS = NS + "s";
				if (H == "f") NS = NS + "h";
				if (H == "d" || H == "m" || H == "g") NS = NS + "m";
				if (H == "b" || H == "h" || H == "n" || H == "v" || H == "w" || H == "p" || H == " " || H == "'" || H == "?" || H == "!" || H == "." || H == "," || H == "~" || H == "-" || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y") NS = NS + H;

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

			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	// Very Light garble, most of the letters stay the same
	if (GagEffect >= 1) {
		for (let L = 0; L < CD.length; L++) {
			let H = CD.charAt(L).toLowerCase();
			if (H == "(" && !IgnoreOOC) Par = true;
			if (!Par) {

				// Regular characters
				if (H == "t") NS = NS + "e";
				if (H == "c" || H == "q" || H == "k" || H == "x") NS = NS + "k";
				if (H == "j" || H == "l" || H == "r") NS = NS + "a";
				if (H == "d" || H == "m" || H == "g") NS = NS + "m";
				if (H == "b" || H == "h" || H == "n" || H == "v" || H == "w" || H == "p" || H == " " || H == "'" || H == "?" || H == "!" || H == "." || H == "," || H == "~" || H == "-" || H == "a" || H == "e" || H == "i" || H == "o" || H == "u" || H == "y" || H == "f" || H == "s" || H == "z") NS = NS + H;

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

			} else NS = NS + CD.charAt(L);
			if (H == ")") Par = false;
		}
		return NS;
	}

	return CD;

}

/**
 * Makes the character stutter if she has a vibrating item and/or is aroused. Stuttering based on arousal is toggled in the character's settings.
 * @param {Character} C - The character, whose dialog might need to be altered
 * @param {string} CD - The character's dialog to alter
 * @returns {string} - Returns the dialog after the stuttering factor was applied
 */
function SpeechStutter(C, CD) {

	// Validate nulls
	if (CD == null) CD = "";

	// Validates that the preferences allow stuttering
	if ((C.ArousalSettings == null) || (C.ArousalSettings.AffectStutter == null) || (C.ArousalSettings.AffectStutter != "None")) {

		// Gets the factor from current arousal
		var Factor = 0;
		if ((C.ArousalSettings == null) || (C.ArousalSettings.AffectStutter == null) || (C.ArousalSettings.AffectStutter == "Arousal") || (C.ArousalSettings.AffectStutter == "All"))
			if ((C.ArousalSettings != null) && (C.ArousalSettings.Progress != null) && (typeof C.ArousalSettings.Progress === "number") && !isNaN(C.ArousalSettings.Progress))
				Factor = Math.floor(C.ArousalSettings.Progress / 20);

		// Checks all items that "eggs" with an intensity, and replaces the factor if it's higher
		if (C.IsEgged() && ((C.ArousalSettings == null) || (C.ArousalSettings.AffectStutter == null) || (C.ArousalSettings.AffectStutter == "Vibration") || (C.ArousalSettings.AffectStutter == "All")))
			for (let A = 0; A < C.Appearance.length; A++) {
				var Item = C.Appearance[A];
				if (InventoryItemHasEffect(Item, "Egged", true) && Item.Property && Item.Property.Intensity && (typeof Item.Property.Intensity === "number") && !isNaN(Item.Property.Intensity) && (Item.Property.Intensity > Factor))
					Factor = Item.Property.Intensity;
			}

		// If the intensity factor is lower than 1, no stuttering occurs and we return the regular text
		if (Factor <= 0) return CD;

		// Loops in all letters to create a stuttering effect
		var Par = false;
		var CS = 1;
		var Seed = CD.length;
		for (let L = 0; L < CD.length; L++) {

			// Do not stutter the letters between parentheses
			var H = CD.charAt(L).toLowerCase();
			if (H == "(") Par = true;

			// If we are not between brackets and at the start of a word, there's a chance to stutter that word
			if (!Par && CS >= 0 && (H.match(/[[a-zа-яё]/i))) {

				// Generate a pseudo-random number using a seed, so that the same text always stutters the same way
				var R = Math.sin(Seed++) * 10000;
				R = R - Math.floor(R);
				R = Math.floor(R * 10) + Factor;
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

/**
 * Makes the character talk like a Baby when she has drunk regression milk
 * @param {Character} C - The character, whose dialog needs to be altered
 * @param {string} CD - The character's dialog to alter
 * @returns {string} - Returns the dialog after baby talk was applied
 */
function SpeechBabyTalk(C, CD) {
	if (CD == null) CD = "";

	var Par = false;
	var NS = "";

	if (C.Effect.indexOf("RegressedTalk") >= 0) {
		for (let L = 0; L < CD.length; L++) {
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
