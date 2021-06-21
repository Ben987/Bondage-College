"use strict";
var TextData = null;

/**
 * Finds the text value linked to the tag in the buffer
 * @param {string} TextTag - Tag for the text to find
 * @returns {string} - Returns the text associated to the tag, will return a missing tag text if the tag was not found.
 */
function TextGet(TextTag) {
	if (TextData == null) return "";
	for (let T = 0; T < TextData.length; T++)
		if (TextData[T].Tag == TextTag)
			return TextData[T].Value;
	return "MISSING VALUE FOR TAG: " + TextTag;
}

/**
 * Builds the text objects from the CSV file, then applies the translation to the text.
 * @param {string[][]} CSV - The content of the CSV file to parse (List of tag-text pairs)
 * @returns {void} - Nothing
 */
function TextBuild(CSV) {

	// For each lines in the file
	TextData = [];
	for (let L = 0; L < CSV.length; L++)
		if ((CSV[L][0] != null) && (CSV[L][0] != "")) {

			// Creates a text object and adds it to the buffer
			var T = {};
			T.Tag = CSV[L][0].trim();
			if ((CSV[L][1] != null) && (CSV[L][1].trim() != "")) T.Value = CSV[L][1].trim();
			else T.Value = "";
			TextData.push(T);

		}

	// Translate the text
	TranslationText(TextData);

}


/**
 * Loads the CSV text file of the current screen into the buffer. It will get the CSV from the cache if the file was already fetched from
 * the server
 * @param {string} [TextGroup] - Screen for which to load the CSV of
 * @returns {void} - Nothing
 */
function TextLoad(TextGroup) {

	// Finds the full path of the CSV file to use cache
	TextData = null;
	if ((TextGroup == null) || (TextGroup = "")) TextGroup = CurrentScreen;
	var FullPath = "Screens/" + CurrentModule + "/" + TextGroup + "/Text_" + TextGroup + ".csv";
	if (CommonCSVCache[FullPath]) {
		TextBuild(CommonCSVCache[FullPath]);
		return;
	}

	// Opens the file, parse it and returns the result it to build the dialog
	CommonGet(FullPath, function () {
		if (this.status == 200) {
			CommonCSVCache[FullPath] = CommonParseCSV(this.responseText);
			TextBuild(CommonCSVCache[FullPath]);
		}
	});

}

/**
 * A class that can be used to cache a simple key/value CSV file for easy text lookups. Text lookups will be automatically translated to
 * the game's current language, if a translation is available.
 */
class TextCache {
	/**
	 * Creates a new TextCache from the provided CSV file path.
	 * @param {string} path - The path to the CSV lookup file for this TextCache instance
	 */
	constructor(path) {
		this.path = path;
		this.language = TranslationLanguage;
		this.cache = {};
		this.buildCache();
	}

	/**
	 * Looks up a string from this TextCache. If the cache contains a value for the provided key and a translation is available, the return
	 * value will be automatically translated. Otherwise the EN string will be used. If the cache does not contain a value for the requested
	 * key, the key will be returned.
	 * @param {string} key - The text key to lookup
	 * @returns {string} - The text value corresponding to the provided key, translated into the current language, if available
	 */
	get(key) {
		if (TranslationLanguage !== this.language) {
			this.buildCache();
		}
		return this.cache[key] || key;
	}

	/**
	 * Kicks off a build of the text lookup cache
	 * @returns {void} - Nothing
	 */
	buildCache() {
		this.fetchCsv()
			.then((lines) => this.translate(lines))
			.then((lines) => this.cacheLines(lines));
	}

	/**
	 * Fetches and parses the CSV file for this TextCache
	 * @returns {Promise<string[][]>} - A promise resolving to an array of string arrays, corresponding to lines of CSV values in the CSV
	 * file.
	 */
	fetchCsv() {
		if (CommonCSVCache[this.path]) return Promise.resolve(CommonCSVCache[this.path]);
		return new Promise((resolve) => {
			CommonGet(this.path, (xhr) => {
				if (xhr.status === 200) {
					CommonCSVCache[this.path] = CommonParseCSV(xhr.responseText);
					return resolve(CommonCSVCache[this.path]);
				}
				return Promise.resolve([]);
			});
		});
	}

	/**
	 * Stores the contents of a CSV file in the TextCache's internal cache
	 * @param {string[][]} lines - An array of string arrays corresponding to lines in the CSV file
	 * @returns {void} - Nothing
	 */
	cacheLines(lines) {
		lines.forEach((line) => (this.cache[line[0]] = line[1]));
	}

	/**
	 * Translates the contents of a CSV file into the current game language
	 * @param {string[][]} lines - An array of string arrays corresponding to lines in the CSV file
	 * @returns {Promise<string[][]>} - A promise resolving to an array of string arrays corresponding to lines in the CSV file with the
	 * values translated to the current game language
	 */
	translate(lines) {
		this.language = TranslationLanguage;
		const lang = (TranslationLanguage || "").trim().toUpperCase();
		if (!lang || lang === "EN") return Promise.resolve(lines);

		const translationPath = this.path.replace(/\/([^/]+)\.csv$/, `/$1_${lang}.txt`);
		if (!TranslationAvailable(translationPath)) {
			return Promise.resolve(lines);
		}

		if (TranslationCache[translationPath]) {
			return Promise.resolve(this.buildTranslations(lines, TranslationCache[translationPath]));
		} else {
			return new Promise((resolve) => {
				CommonGet(translationPath, (xhr) => {
					if (xhr.status === 200) {
						TranslationCache[translationPath] = TranslationParseTXT(xhr.responseText);
						return resolve(this.buildTranslations(lines, TranslationCache[translationPath]));
					}
					return resolve(lines);
				});
			});
		}
	}

	/**
	 * Maps lines of a CSV to equivalent CSV lines with values translated according to the corresponding translation file
	 * @param {string[][]} lines - An array of string arrays corresponding to lines in the CSV file
	 * @param {string[]} translations - An array of strings in translation file format (with EN and translated values on alternate lines)
	 * @returns {string[][]} - An array of string arrays corresponding to lines in the CSV file with the
	 * values translated to the current game language
	 */
	buildTranslations(lines, translations) {
		return lines.map(line => ([line[0], TranslationString(line[1], translations, "")]));
	}
}
