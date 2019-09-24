"use strict";
var Text = null;

// Finds the text value linked to the tag in the buffer
function TextGet(TextTag) {
	if (Text == null) return "";
	for (var T = 0; T < Text.length; T++)
		if (Text[T].Tag == TextTag)
			return Text[T].Value;
	return "MISSING VALUE FOR TAG: " + TextTag;
}

// Builds the text objects from the CSV file
function TextBuild(CSV) {

	// For each lines in the file
	Text = [];
	for (var L = 0; L < CSV.length; L++)
		if ((CSV[L][0] != null) && (CSV[L][0] != "")) {

			// Creates a text object and adds it to the buffer
			var T = {};
			T.Tag = CSV[L][0].trim();
			if ((CSV[L][1] != null) && (CSV[L][1].trim() != "")) T.Value = CSV[L][1].trim();
			else T.Value = "";
			Text.push(T);

		}

	// Translate the text
	TranslationText(Text);

}

// Loads the CSV text file of the current screen
function TextLoad(TextGroup) {

	// Finds the full path of the CSV file to use cache
	Text = null;
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