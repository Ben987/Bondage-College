"use strict";
var TranslationLanguage = "EN";
var TranslationCache = {};

// Dictionary for all supported languages and their files
var TranslationDictionary = [

	{
		LanguageCode: "EN",
		LanguageName: "English",
		EnglishName: "English",
		Files: [
		]
	},
	{
		LanguageCode: "DE",
		LanguageName: "Deutsch",
		EnglishName: "German",
		Files: [
			"Assets/Female3DCG/Female3DCG_DE.txt",
			"Screens/Character/Appearance/Text_Appearance_DE.txt",
			"Screens/Character/Cheat/Text_Cheat_DE.txt",
			"Screens/Character/Creation/Text_Creation_DE.txt",
			"Screens/Character/InformationSheet/Text_InformationSheet_DE.txt",
			"Screens/Character/Login/Text_Login_DE.txt",
			"Screens/Character/Player/Dialog_Player_DE.txt",
			"Screens/Character/Wardrobe/Text_Wardrobe_DE.txt",
			"Screens/Cutscene/NPCCollaring/Text_NPCCollaring_DE.txt",
			"Screens/Cutscene/PlayerCollaring/Text_PlayerCollaring_DE.txt",
			"Screens/Cutscene/PlayerMistress/Text_PlayerMistress_DE.txt",
			"Screens/Cutscene/SarahIntro/Text_SarahIntro_DE.txt",
			"Screens/MiniGame/HorseWalk/Text_HorseWalk_DE.txt",
			"Screens/MiniGame/Kidnap/Text_Kidnap_DE.txt",
			"Screens/MiniGame/MaidCleaning/Text_MaidCleaning_DE.txt",
			"Screens/MiniGame/MaidDrinks/Text_MaidDrinks_DE.txt",
			"Screens/Online/ChatCreate/Text_ChatCreate_DE.txt",
			"Screens/Online/ChatRoom/Dialog_Online_DE.txt",
			"Screens/Online/ChatRoom/Text_ChatRoom_DE.txt",
			"Screens/Online/ChatSearch/Text_ChatSearch_DE.txt",
			"Screens/Room/Gambling/Dialog_NPC_Gambling_FirstSub_DE.txt",
			"Screens/Room/Gambling/Dialog_NPC_Gambling_SecondSub_DE.txt",
			"Screens/Room/Introduction/Dialog_NPC_Introduction_Maid_DE.txt",
			"Screens/Room/Introduction/Dialog_NPC_Introduction_Sub_DE.txt",
			"Screens/Room/KidnapLeague/Dialog_NPC_KidnapLeague_RandomKidnapper_DE.txt",
			"Screens/Room/KidnapLeague/Dialog_NPC_KidnapLeague_Trainer_DE.txt",
			"Screens/Room/MaidQuarters/Dialog_NPC_MaidQuarters_InitiationMaids_DE.txt",
			"Screens/Room/MaidQuarters/Dialog_NPC_MaidQuarters_Maid_DE.txt",
			"Screens/Room/MainHall/Dialog_NPC_MainHall_Maid_DE.txt",
			"Screens/Room/MainHall/Text_MainHall_DE.txt",
			"Screens/Room/Management/Dialog_NPC_Management_Mistress_DE.txt",
			"Screens/Room/Management/Dialog_NPC_Management_RandomGirl_DE.txt",
			"Screens/Room/Management/Dialog_NPC_Management_Sub_DE.txt",
			"Screens/Room/Nursery/Dialog_NPC_Nursery_Maid_DE.txt",
			"Screens/Room/Photographic/Dialog_NPC_Photographic_Sub_DE.txt",
			"Screens/Room/Photographic/Text_Photographic_DE.txt",
			"Screens/Room/Prison/Dialog_NPC_Prison_Maid_DE.txt",
			"Screens/Room/Prison/Dialog_NPC_Prison_Sub_DE.txt",
			"Screens/Room/Prison/Text_Prison_DE.txt",
			"Screens/Room/Private/Dialog_NPC_Private_Custom_DE.txt",
			"Screens/Room/Private/Dialog_NPC_Private_Vendor_DE.txt",
			"Screens/Room/Sarah/Dialog_NPC_Amanda_DE.txt",
			"Screens/Room/Sarah/Dialog_NPC_Sarah_DE.txt",
			"Screens/Room/Shibari/Dialog_NPC_Shibari_Student_DE.txt",
			"Screens/Room/Shibari/Dialog_NPC_Shibari_Teacher_DE.txt",
			"Screens/Room/Shop/Dialog_NPC_Shop_Vendor_DE.txt",
			"Screens/Room/Shop/Text_Shop_DE.txt",
			"Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_Auctioneer_DE.txt",
			"Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_Trader_DE.txt",
			"Screens/Room/Stable/Dialog_NPC_Stable_Pony_DE.txt",
			"Screens/Room/Stable/Dialog_NPC_Stable_Trainer_DE.txt",
			"Screens/Room/Stable/Text_Stable_DE.txt"
		]
	},
	{
		LanguageCode: "FR",
		LanguageName: "Français",
		EnglishName: "French",
		Files: [
			"Screens/Character/Login/Text_Login_FR.txt"
		]
	}

];

// Returns TRUE if a translation is available for the current file
function TranslationAvailable(FullPath) {
	var FileName = FullPath.trim().toUpperCase();
	for (var L = 0; L < TranslationDictionary.length; L++)
		if (TranslationDictionary[L].LanguageCode == TranslationLanguage)
			for (var F = 0; F < TranslationDictionary[L].Files.length; F++)
				if (TranslationDictionary[L].Files[F].trim().toUpperCase() == FileName)
					return true;
	return false;
}

// Parse a TXT translation file and returns it as JSON array
function TranslationParseTXT(str) {
		
    var arr = [];
	var c;

    // iterate over each character, keep track of current row (of the returned array)
    for (var row = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary        
        if (cc == '\n') { ++row; continue; }   // If it's a newline, move on to the next row
        arr[row] += cc;                        // Otherwise, append the current character to the row
    }

	// Removes any comment rows (starts with ###)
    for (var row = 0; row < arr.length; row++)
		if (arr[row].indexOf("###") == 0) {
			arr.splice(row, 1);
			row = row - 1;
		}

	// Trims the full translated array
    for (var row = 0; row < arr.length; row++)
		arr[row] = arr[row].trim();
		
    return arr;
}

// Translates a string (S) to another language from the array (T), the translation is the line right after
function TranslationString(S, T, CharacterName) {
	if ((S != null) && (S.trim() != "")) {
		S = S.trim();
		for (var P = 0; P < T.length; P++)
			if (S == T[P].replace("DialogCharacterName", CharacterName).replace("DialogPlayerName", Player.Name))
				return T[P + 1].replace("DialogCharacterName", CharacterName).replace("DialogPlayerName", Player.Name);
	}
	return S;
}

// Translates a character dialog from the specified array
function TranslationDialogArray(C, T) {
	for (var D = 0; D < C.Dialog.length; D++) {
		C.Dialog[D].Option = TranslationString(C.Dialog[D].Option, T, C.Name);
		C.Dialog[D].Result = TranslationString(C.Dialog[D].Result, T, C.Name);
	}
}

// Translates a character dialog from the specified array
function TranslationTextArray(S, T) {
	for (var P = 0; P < S.length; P++)
		S[P].Value = TranslationString(S[P].Value, T, "");
	if (CurrentScreen == "Login") LoginMessage = "";
}

// Translate a character dialog if the file is in the dictionary
function TranslationDialog(C) {

	// If we play in a foreign language
	if ((TranslationLanguage != null) && (TranslationLanguage.trim() != "") && (TranslationLanguage.trim().toUpperCase() != "EN")) {

		// Finds the full path of the translation file to use
		var FullPath = ((C.ID == 0) ? "Screens/Character/Player/Dialog_Player" : "Screens/" + CurrentModule + "/" + CurrentScreen + "/Dialog_" + C.AccountName) + "_" + TranslationLanguage + ".txt";

		// If the translation file is already loaded, we translate from it
		if (TranslationCache[FullPath]) {
			TranslationDialogArray(C, TranslationCache[FullPath]);
			return;
		}

		// If the translation is available, we open the txt file, parse it and returns the result to build the dialog
		if (TranslationAvailable(FullPath))
			CommonGet(FullPath, function() {
				if (this.status == 200) {
					TranslationCache[FullPath] = TranslationParseTXT(this.responseText);
					TranslationDialogArray(C, TranslationCache[FullPath]);
				}
			});
	
	}
	
}

// Translate a character dialog if the file is in the dictionary
function TranslationText(Text) {
	
	// If we play in a foreign language
	if ((TranslationLanguage != null) && (TranslationLanguage.trim() != "") && (TranslationLanguage.trim().toUpperCase() != "EN")) {
		
		// Finds the full path of the translation file to use
		var FullPath = "Screens/" + CurrentModule + "/" + CurrentScreen + "/Text_" + CurrentScreen + "_" + TranslationLanguage + ".txt";

		// If the translation file is already loaded, we translate from it
		if (TranslationCache[FullPath]) {
			TranslationTextArray(Text, TranslationCache[FullPath]);
			return;
		}

		// If the translation is available, we open the txt file, parse it and returns the result to build the dialog
		if (TranslationAvailable(FullPath))
			CommonGet(FullPath, function() {
				if (this.status == 200) {
					TranslationCache[FullPath] = TranslationParseTXT(this.responseText);
					TranslationTextArray(Text, TranslationCache[FullPath]);
				}
			});

	}

}

// Translates the asset group and asset description
function TranslationAssetProcess(T) {
	for (var A = 0; A < AssetGroup.length; A++)
		AssetGroup[A].Description = TranslationString(AssetGroup[A].Description, T, "");
	for (var A = 0; A < Asset.length; A++)
		Asset[A].Description = TranslationString(Asset[A].Description, T, "");
}

// Translates the description of the assets and groups
function TranslationAsset(Family) {
	
	// If we play in a foreign language
	if ((TranslationLanguage != null) && (TranslationLanguage.trim() != "") && (TranslationLanguage.trim().toUpperCase() != "EN")) {

		// Finds the full path of the translation file to use
		var FullPath = "Assets/" + Family + "/" + Family + "_" + TranslationLanguage + ".txt";

		// If the translation file is already loaded, we translate from it
		if (TranslationCache[FullPath]) {
			TranslationAssetProcess(TranslationCache[FullPath]);
			return;
		}

		// If the translation is available, we open the txt file, parse it and returns the result to build the dialog
		if (TranslationAvailable(FullPath))
			CommonGet(FullPath, function() {
				if (this.status == 200) {
					TranslationCache[FullPath] = TranslationParseTXT(this.responseText);
					TranslationAssetProcess(TranslationCache[FullPath]);
				}
			});
	
	}
	
}

// Changes the current language
function TranslationNextLanguage() {
	for (var L = 0; L < TranslationDictionary.length; L++)
		if (TranslationDictionary[L].LanguageCode == TranslationLanguage) {
			if (L != TranslationDictionary.length - 1)
				TranslationLanguage = TranslationDictionary[L + 1].LanguageCode;
			else
				TranslationLanguage = TranslationDictionary[0].LanguageCode;
			localStorage.setItem("BondageClubLanguage", TranslationLanguage);
			return;
		}
}

// Loads the translations
function TranslationLoad() {
	var L = localStorage.getItem("BondageClubLanguage");
	if (L != null) TranslationLanguage = L;
}