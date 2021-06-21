"use strict";
var TranslationLanguage = "EN";
var TranslationCache = {};

/**
 * Dictionary for all supported languages and their files
 * @constant
 */
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
			"Screens/Character/FriendList/Text_FriendList_DE.txt",
			"Screens/Character/InformationSheet/Text_InformationSheet_DE.txt",
			"Screens/Character/Login/Text_Login_DE.txt",
			"Screens/Character/OnlineProfile/Text_OnlineProfile_DE.txt",
			"Screens/Character/PasswordReset/Text_PasswordReset_DE.txt",
			"Screens/Character/Player/Dialog_Player_DE.txt",
			"Screens/Character/Preference/Text_Preference_DE.txt",
			"Screens/Character/Title/Text_Title_DE.txt",
			"Screens/Character/Wardrobe/Text_Wardrobe_DE.txt",
			"Screens/Cutscene/NPCCollaring/Text_NPCCollaring_DE.txt",
			"Screens/Cutscene/NPCSlaveAuction/Text_NPCSlaveAuction_DE.txt",
			"Screens/Cutscene/PlayerCollaring/Text_PlayerCollaring_DE.txt",
			"Screens/Cutscene/PlayerMistress/Text_PlayerMistress_DE.txt",
			"Screens/Cutscene/SarahIntro/Text_SarahIntro_DE.txt",
			"Screens/MiniGame/HorseWalk/Text_HorseWalk_DE.txt",
			"Screens/MiniGame/Kidnap/Text_Kidnap_DE.txt",
			"Screens/MiniGame/MaidCleaning/Text_MaidCleaning_DE.txt",
			"Screens/MiniGame/MaidDrinks/Text_MaidDrinks_DE.txt",
			"Screens/MiniGame/RhythmGame/Text_RhythmGame_DE.txt",
			"Screens/MiniGame/SlaveAuction/Text_SlaveAuction_DE.txt",
			"Screens/MiniGame/Tennis/Text_Tennis_DE.txt",
			"Screens/MiniGame/Therapy/Text_Therapy_DE.txt",
			"Screens/Online/ChatAdmin/Text_ChatAdmin_DE.txt",
			"Screens/Online/ChatCreate/Text_ChatCreate_DE.txt",
			"Screens/Online/ChatRoom/Dialog_Online_DE.txt",
			"Screens/Online/ChatRoom/Text_ChatRoom_DE.txt",
			"Screens/Online/ChatSearch/Text_ChatSearch_DE.txt",
			"Screens/Room/AsylumBedroom/Text_AsylumBedroom_DE.txt",
			"Screens/Room/AsylumEntrance/Dialog_NPC_AsylumEntrance_EscapedPatient_DE.txt",
			"Screens/Room/AsylumEntrance/Dialog_NPC_AsylumEntrance_KidnapNurse_DE.txt",
			"Screens/Room/AsylumEntrance/Dialog_NPC_AsylumEntrance_Nurse_DE.txt",
			"Screens/Room/AsylumEntrance/Text_AsylumEntrance_DE.txt",
			"Screens/Room/AsylumMeeting/Dialog_NPC_AsylumMeeting_PatientLeft_DE.txt",
			"Screens/Room/AsylumMeeting/Dialog_NPC_AsylumMeeting_PatientRight_DE.txt",
			"Screens/Room/AsylumTherapy/Dialog_NPC_AsylumTherapy_Nurse_DE.txt",
			"Screens/Room/AsylumTherapy/Dialog_NPC_AsylumTherapy_Patient_DE.txt",
			"Screens/Room/Cell/Text_Cell_DE.txt",
			"Screens/Room/CollegeEntrance/Dialog_NPC_CollegeEntrance_Student_DE.txt",
			"Screens/Room/CollegeEntrance/Text_CollegeEntrance_DE.txt",
			"Screens/Room/CollegeTennis/Dialog_NPC_CollegeTennis_Jennifer_DE.txt",
			"Screens/Room/CollegeTennis/Text_CollegeTennis_DE.txt",
			"Screens/Room/Gambling/Dialog_NPC_Gambling_FirstSub_DE.txt",
			"Screens/Room/Gambling/Dialog_NPC_Gambling_SecondSub_DE.txt",
			"Screens/Room/Introduction/Dialog_NPC_Introduction_Maid_DE.txt",
			"Screens/Room/Introduction/Dialog_NPC_Introduction_Sub_DE.txt",
			"Screens/Room/KidnapLeague/Dialog_NPC_KidnapLeague_RandomKidnapper_DE.txt",
			"Screens/Room/KidnapLeague/Dialog_NPC_KidnapLeague_Trainer_DE.txt",
			"Screens/Room/Magic/Dialog_NPC_Magic_Assistant_DE.txt",
			"Screens/Room/Magic/Dialog_NPC_Magic_Performer_DE.txt",
			"Screens/Room/MaidQuarters/Dialog_NPC_MaidQuarters_InitiationMaids_DE.txt",
			"Screens/Room/MaidQuarters/Dialog_NPC_MaidQuarters_Maid_DE.txt",
			"Screens/Room/MainHall/Dialog_NPC_MainHall_Maid_DE.txt",
			"Screens/Room/MainHall/Text_MainHall_DE.txt",
			"Screens/Room/Management/Dialog_NPC_Management_Mistress_DE.txt",
			"Screens/Room/Management/Dialog_NPC_Management_RandomGirl_DE.txt",
			"Screens/Room/Management/Dialog_NPC_Management_Sub_DE.txt",
			"Screens/Room/Management/Text_Management_DE.txt",
			"Screens/Room/Nursery/Dialog_NPC_Nursery_ABDL1_DE.txt",
			"Screens/Room/Nursery/Dialog_NPC_Nursery_ABDL2_DE.txt",
			"Screens/Room/Nursery/Dialog_NPC_Nursery_Nurse_DE.txt",
			"Screens/Room/Nursery/Text_Nursery_DE.txt",
			"Screens/Room/Photographic/Dialog_NPC_Photographic_Sub_DE.txt",
			"Screens/Room/Photographic/Text_Photographic_DE.txt",
			"Screens/Room/Prison/Dialog_NPC_Prison_Maid_DE.txt",
			"Screens/Room/Prison/Dialog_NPC_Prison_Sub_DE.txt",
			"Screens/Room/Prison/Text_Prison_DE.txt",
			"Screens/Room/Private/Dialog_NPC_Private_Custom_DE.txt",
			"Screens/Room/Private/Dialog_NPC_Private_Vendor_DE.txt",
			"Screens/Room/Private/Text_Private_DE.txt",
			"Screens/Room/Sarah/Dialog_NPC_Amanda_DE.txt",
			"Screens/Room/Sarah/Dialog_NPC_Sarah_DE.txt",
			"Screens/Room/Sarah/Dialog_NPC_Sophie_DE.txt",
			"Screens/Room/Shibari/Dialog_NPC_Shibari_Student_DE.txt",
			"Screens/Room/Shibari/Dialog_NPC_Shibari_Teacher_DE.txt",
			"Screens/Room/Shop/Dialog_NPC_Shop_Customer_DE.txt",
			"Screens/Room/Shop/Dialog_NPC_Shop_Vendor_DE.txt",
			"Screens/Room/Shop/Text_Shop_DE.txt",
			"Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_Mistress_DE.txt",
			"Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_Slave_DE.txt",
			"Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_SlaveToTrain_DE.txt",
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
			"Assets/Female3DCG/Female3DCG_FR.txt",
			"Assets/Female3DCG/ColorGroups_FR.txt",
			"Assets/Female3DCG/LayerNames_FR.txt",
			"Screens/Character/Appearance/Text_Appearance_FR.txt",
			"Screens/Character/BackgroundSelection/Text_BackgroundSelection_FR.txt",
			"Screens/Character/Cheat/Text_Cheat_FR.txt",
			"Screens/Character/Relog/Text_Relog_FR.txt",
			"Screens/Character/Creation/Text_Creation_FR.txt",
			"Screens/Character/FriendList/Text_FriendList_FR.txt",
			"Screens/Character/InformationSheet/Text_InformationSheet_FR.txt",
			"Screens/Character/Login/Text_Login_FR.txt",
			"Screens/Character/OnlineProfile/Text_OnlineProfile_FR.txt",
			"Screens/Character/ItemColor/ItemColor_FR.txt",
			"Screens/Character/PasswordReset/Text_PasswordReset_FR.txt",
			"Screens/Character/Player/Dialog_Player_FR.txt",
			"Screens/Character/Preference/Text_Preference_FR.txt",
			"Screens/Character/Preference/ActivityDictionary_FR.txt",
			"Screens/Character/Title/Text_Title_FR.txt",
			"Screens/Character/Wardrobe/Text_Wardrobe_FR.txt",
			"Screens/Cutscene/NPCCollaring/Text_NPCCollaring_FR.txt",
			"Screens/Cutscene/NPCSlaveAuction/Text_NPCSlaveAuction_FR.txt",
			"Screens/Cutscene/PlayerCollaring/Text_PlayerCollaring_FR.txt",
			"Screens/Cutscene/PlayerMistress/Text_PlayerMistress_FR.txt",
			"Screens/Cutscene/SarahIntro/Text_SarahIntro_FR.txt",
			"Screens/MiniGame/HorseWalk/Text_HorseWalk_FR.txt",
			"Screens/MiniGame/Kidnap/Text_Kidnap_FR.txt",
			"Screens/MiniGame/MaidCleaning/Text_MaidCleaning_FR.txt",
			"Screens/MiniGame/MaidDrinks/Text_MaidDrinks_FR.txt",
			"Screens/MiniGame/RhythmGame/Text_RhythmGame_FR.txt",
			"Screens/MiniGame/SlaveAuction/Text_SlaveAuction_FR.txt",
			"Screens/MiniGame/Tennis/Text_Tennis_FR.txt",
			"Screens/MiniGame/Therapy/Text_Therapy_FR.txt",
			"Screens/MiniGame/DojoStruggle/Text_DojoStruggle_FR.txt",
			"Screens/MiniGame/PuppyWalker/Text_PuppyWalker_FR.txt",
			"Screens/Online/ChatCreate/Text_ChatCreate_FR.txt",
			"Screens/Online/ChatAdmin/Text_ChatAdmin_FR.txt",
			"Screens/Online/ChatRoom/Dialog_Online_FR.txt",
			"Screens/Online/ChatRoom/Text_ChatRoom_FR.txt",
			"Screens/Online/ChatSearch/Text_ChatSearch_FR.txt",
			"Screens/Room/AsylumBedroom/Text_AsylumBedroom_FR.txt",
			"Screens/Room/AsylumEntrance/Dialog_NPC_AsylumEntrance_EscapedPatient_FR.txt",
			"Screens/Room/AsylumEntrance/Dialog_NPC_AsylumEntrance_KidnapNurse_FR.txt",
			"Screens/Room/AsylumEntrance/Text_AsylumEntrance_FR.txt",
			"Screens/Room/AsylumMeeting/Dialog_NPC_AsylumMeeting_PatientLeft_FR.txt",
			"Screens/Room/AsylumMeeting/Dialog_NPC_AsylumMeeting_PatientRight_FR.txt",
			"Screens/Room/Cafe/Text_Cafe_FR.txt",
			"Screens/Room/Cell/Text_Cell_FR.txt",
			"Screens/Room/CollegeCafeteria/Text_CollegeCafeteria_FR.txt",
			"Screens/Room/CollegeCafeteria/Dialog_NPC_CollegeCafeteria_FarRight_FR.txt",
			"Screens/Room/CollegeCafeteria/Dialog_NPC_CollegeCafeteria_Right_FR.txt",
			"Screens/Room/CollegeDetention/Text_CollegeDetention_FR.txt",
			"Screens/Room/CollegeEntrance/Dialog_NPC_CollegeEntrance_Student_FR.txt",
			"Screens/Room/CollegeEntrance/Text_CollegeEntrance_FR.txt",
			"Screens/Room/CollegeTeacher/Text_CollegeTeacher_FR.txt",
			"Screens/Room/CollegeTennis/Text_CollegeTennis_FR.txt",
			"Screens/Room/CollegeTheater/Text_CollegeTheater_FR.txt",
			"Screens/Room/Introduction/Dialog_NPC_Introduction_Sub_FR.txt",
			"Screens/Room/LARP/Text_LARP_FR.txt",
			"Screens/Room/DailyJob/Dialog_NPC_DailyJob_DojoTeacher_FR.txt",
			"Screens/Room/DailyJob/Dialog_NPC_DailyJob_PuppyMistress_FR.txt",
			"Screens/Room/MaidQuarters/Dialog_NPC_MaidQuarters_InitiationMaids_FR.txt",
			"Screens/Room/MainHall/Dialog_NPC_MainHall_Maid_FR.txt",
			"Screens/Room/MainHall/Text_MainHall_FR.txt",
			"Screens/Room/Management/Dialog_NPC_Management_Sub_FR.txt",
			"Screens/Room/Management/Text_Management_FR.txt",
			"Screens/Room/Magic/Dialog_NPC_Magic_Assistant_FR.txt",
			"Screens/Room/Nursery/Text_Nursery_FR.txt",
			"Screens/Room/Photographic/Text_Photographic_FR.txt",
			"Screens/Room/Prison/Text_Prison_FR.txt",
			"Screens/Room/Private/Text_Private_FR.txt",
			"Screens/Room/Shibari/Dialog_NPC_Shibari_Student_FR.txt",
			"Screens/Room/Shop/Text_Shop_FR.txt",
			"Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_SlaveToTrain_FR.txt",
			"Screens/Room/Stable/Text_Stable_FR.txt",
		]
	},
	{
		LanguageCode: "RU",
		LanguageName: "Русский",
		EnglishName: "Russian",
		Files: [
			"Assets/Female3DCG/Female3DCG_RU.txt",
			"Screens/Character/Appearance/Text_Appearance_RU.txt",
			"Screens/Character/Cheat/Text_Cheat_RU.txt",
			"Screens/Character/Creation/Text_Creation_RU.txt",
			"Screens/Character/FriendList/Text_FriendList_RU.txt",
			"Screens/Character/InformationSheet/Text_InformationSheet_RU.txt",
			"Screens/Character/Login/Text_Login_RU.txt",
			"Screens/Character/OnlineProfile/Text_OnlineProfile_RU.txt",
			"Screens/Character/PasswordReset/Text_PasswordReset_RU.txt",
			"Screens/Character/Player/Dialog_Player_RU.txt",
			"Screens/Character/Preference/Text_Preference_RU.txt",
			"Screens/Character/Title/Text_Title_RU.txt",
			"Screens/Character/Wardrobe/Text_Wardrobe_RU.txt",
			"Screens/Cutscene/NPCCollaring/Text_NPCCollaring_RU.txt",
			"Screens/Cutscene/NPCSlaveAuction/Text_NPCSlaveAuction_RU.txt",
			"Screens/Cutscene/PlayerCollaring/Text_PlayerCollaring_RU.txt",
			"Screens/Cutscene/PlayerMistress/Text_PlayerMistress_RU.txt",
			"Screens/Cutscene/SarahIntro/Text_SarahIntro_RU.txt",
			"Screens/MiniGame/HorseWalk/Text_HorseWalk_RU.txt",
			"Screens/MiniGame/Kidnap/Text_Kidnap_RU.txt",
			"Screens/MiniGame/MaidCleaning/Text_MaidCleaning_RU.txt",
			"Screens/MiniGame/MaidDrinks/Text_MaidDrinks_RU.txt",
			"Screens/MiniGame/RhythmGame/Text_RhythmGame_RU.txt",
			"Screens/MiniGame/SlaveAuction/Text_SlaveAuction_RU.txt",
			"Screens/MiniGame/Tennis/Text_Tennis_RU.txt",
			"Screens/MiniGame/Therapy/Text_Therapy_RU.txt",
			"Screens/Online/ChatAdmin/Text_ChatAdmin_RU.txt",
			"Screens/Online/ChatCreate/Text_ChatCreate_RU.txt",
			"Screens/Online/ChatRoom/Dialog_Online_RU.txt",
			"Screens/Online/ChatRoom/Text_ChatRoom_RU.txt",
			"Screens/Online/ChatSearch/Text_ChatSearch_RU.txt",
			"Screens/Room/AsylumBedroom/Text_AsylumBedroom_RU.txt",
			"Screens/Room/AsylumEntrance/Dialog_NPC_AsylumEntrance_EscapedPatient_RU.txt",
			"Screens/Room/AsylumEntrance/Dialog_NPC_AsylumEntrance_KidnapNurse_RU.txt",
			"Screens/Room/AsylumEntrance/Dialog_NPC_AsylumEntrance_Nurse_RU.txt",
			"Screens/Room/AsylumEntrance/Text_AsylumEntrance_RU.txt",
			"Screens/Room/AsylumMeeting/Dialog_NPC_AsylumMeeting_PatientLeft_RU.txt",
			"Screens/Room/AsylumMeeting/Dialog_NPC_AsylumMeeting_PatientRight_RU.txt",
			"Screens/Room/AsylumTherapy/Dialog_NPC_AsylumTherapy_Nurse_RU.txt",
			"Screens/Room/AsylumTherapy/Dialog_NPC_AsylumTherapy_Patient_RU.txt",
			"Screens/Room/Cell/Text_Cell_RU.txt",
			"Screens/Room/CollegeEntrance/Dialog_NPC_CollegeEntrance_Student_RU.txt",
			"Screens/Room/CollegeEntrance/Text_CollegeEntrance_RU.txt",
			"Screens/Room/CollegeTennis/Dialog_NPC_CollegeTennis_Jennifer_RU.txt",
			"Screens/Room/CollegeTennis/Text_CollegeTennis_RU.txt",
			"Screens/Room/Gambling/Dialog_NPC_Gambling_FirstSub_RU.txt",
			"Screens/Room/Gambling/Dialog_NPC_Gambling_SecondSub_RU.txt",
			"Screens/Room/Introduction/Dialog_NPC_Introduction_Maid_RU.txt",
			"Screens/Room/Introduction/Dialog_NPC_Introduction_Sub_RU.txt",
			"Screens/Room/KidnapLeague/Dialog_NPC_KidnapLeague_RandomKidnapper_RU.txt",
			"Screens/Room/KidnapLeague/Dialog_NPC_KidnapLeague_Trainer_RU.txt",
			"Screens/Room/Magic/Dialog_NPC_Magic_Assistant_RU.txt",
			"Screens/Room/Magic/Dialog_NPC_Magic_Performer_RU.txt",
			"Screens/Room/MaidQuarters/Dialog_NPC_MaidQuarters_InitiationMaids_RU.txt",
			"Screens/Room/MaidQuarters/Dialog_NPC_MaidQuarters_Maid_RU.txt",
			"Screens/Room/MainHall/Dialog_NPC_MainHall_Maid_RU.txt",
			"Screens/Room/MainHall/Text_MainHall_RU.txt",
			"Screens/Room/Management/Dialog_NPC_Management_Mistress_RU.txt",
			"Screens/Room/Management/Dialog_NPC_Management_RandomGirl_RU.txt",
			"Screens/Room/Management/Dialog_NPC_Management_Sub_RU.txt",
			"Screens/Room/Management/Text_Management_RU.txt",
			"Screens/Room/Nursery/Dialog_NPC_Nursery_ABDL1_RU.txt",
			"Screens/Room/Nursery/Dialog_NPC_Nursery_ABDL2_RU.txt",
			"Screens/Room/Nursery/Dialog_NPC_Nursery_Nurse_RU.txt",
			"Screens/Room/Nursery/Text_Nursery_RU.txt",
			"Screens/Room/Photographic/Dialog_NPC_Photographic_Sub_RU.txt",
			"Screens/Room/Photographic/Text_Photographic_RU.txt",
			"Screens/Room/Prison/Dialog_NPC_Prison_Maid_RU.txt",
			"Screens/Room/Prison/Dialog_NPC_Prison_Sub_RU.txt",
			"Screens/Room/Prison/Text_Prison_RU.txt",
			"Screens/Room/Private/Dialog_NPC_Private_Custom_RU.txt",
			"Screens/Room/Private/Dialog_NPC_Private_Vendor_RU.txt",
			"Screens/Room/Private/Text_Private_RU.txt",
			"Screens/Room/Sarah/Dialog_NPC_Amanda_RU.txt",
			"Screens/Room/Sarah/Dialog_NPC_Sarah_RU.txt",
			"Screens/Room/Sarah/Dialog_NPC_Sophie_RU.txt",
			"Screens/Room/Shibari/Dialog_NPC_Shibari_Student_RU.txt",
			"Screens/Room/Shibari/Dialog_NPC_Shibari_Teacher_RU.txt",
			"Screens/Room/Shop/Dialog_NPC_Shop_Customer_RU.txt",
			"Screens/Room/Shop/Dialog_NPC_Shop_Vendor_RU.txt",
			"Screens/Room/Shop/Text_Shop_RU.txt",
			"Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_Mistress_RU.txt",
			"Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_Slave_RU.txt",
			"Screens/Room/SlaveMarket/Dialog_NPC_SlaveMarket_SlaveToTrain_RU.txt",
			"Screens/Room/Stable/Dialog_NPC_Stable_Pony_RU.txt",
			"Screens/Room/Stable/Dialog_NPC_Stable_Trainer_RU.txt",
			"Screens/Room/Stable/Text_Stable_RU.txt"
		]
	}

];

/**
 * Checks if a file can be translated in the selected language
 * @param {string} FullPath - Full path of the file to check for a corresponding translation file
 * @returns {boolean} - Returns TRUE if a translation is available for the given file
 */
function TranslationAvailable(FullPath) {
	var FileName = FullPath.trim().toUpperCase();
	for (let L = 0; L < TranslationDictionary.length; L++)
		if (TranslationDictionary[L].LanguageCode == TranslationLanguage)
			for (let F = 0; F < TranslationDictionary[L].Files.length; F++)
				if (TranslationDictionary[L].Files[F].trim().toUpperCase() == FileName)
					return true;
	return false;
}

/**
 * Parse a TXT translation file and returns it as an array
 * @param {string} str - Content of the translation text file
 * @returns {string[]} - Array of strings with each line divided. For each translated line, the english string precedes the translated one in the array.
 */
function TranslationParseTXT(str) {

	const arr = [];
	let c;
	str = str.replace(/\r\n/g, '\n').trim();

	// iterate over each character, keep track of current row (of the returned array)
	for (let row = c = 0; c < str.length; c++) {
		let cc = str[c];        // current character, next character
		arr[row] = arr[row] || "";             // create a new row if necessary
		if (cc == '\n') { ++row; continue; }   // If it's a newline, move on to the next row
		arr[row] += cc;                        // Otherwise, append the current character to the row
	}

	// Removes any comment rows (starts with ###)
	for (let row = arr.length - 1; row >= 0; row--)
		if (arr[row].indexOf("###") == 0) {
			arr.splice(row, 1);
		}

	// Trims the full translated array
	for (let row = 0; row < arr.length; row++)
		arr[row] = arr[row].trim();
	return arr;
}

/**
 * Translates a string to another language from the array, the translation is always the one right after the english line
 * @param {string} S - The original english string to translate
 * @param {string[]} T - The active translation dictionary
 * @param {string} CharacterName - Name of the character if it is required to replace it within the string.
 * @returns {string} - The translated string
 */
function TranslationString(S, T, CharacterName) {
	if ((S != null) && (S.trim() != "")) {
		S = S.trim();
		for (let P = 0; P < T.length; P++)
			if (S == T[P].replace("DialogCharacterName", CharacterName).replace("DialogPlayerName", Player.Name))
				return T[P + 1].replace("DialogCharacterName", CharacterName).replace("DialogPlayerName", Player.Name);
	}
	return S;
}

/**
 * Translates a character dialog from the specified array
 * @param {Character} C - The character for which we need to translate the dialog array.
 * @param {string[]} T - The active translation dictionary
 * @returns {void} - Nothing
 */
function TranslationDialogArray(C, T) {
	for (let D = 0; D < C.Dialog.length; D++) {
		C.Dialog[D].Option = TranslationString(C.Dialog[D].Option, T, C.Name);
		C.Dialog[D].Result = TranslationString(C.Dialog[D].Result, T, C.Name);
	}
}

/**
 * Translates a set of tags. Rerenders the login message when on the login page.
 * @param {Array.<{Tag: string, Value: string}>} S - Array of current tag-value pairs
 * @param {string[]} T - The active translation dictionary
 * @returns {void} - Nothing
 */
function TranslationTextArray(S, T) {
	for (let P = 0; P < S.length; P++)
		S[P].Value = TranslationString(S[P].Value, T, "");
	if (CurrentScreen == "Login") LoginUpdateMessage();
}

/**
 * Translate a character dialog if the file is in the dictionary
 * @param {Character} C - The character for which we want to translate the dialog
 * @returns {void} - Nothing
 */
function TranslationDialog(C) {

	// If we play in a foreign language
	if ((TranslationLanguage != null) && (TranslationLanguage.trim() != "") && (TranslationLanguage.trim().toUpperCase() != "EN")) {

		var OnlinePlayer = C.AccountName.indexOf("Online-") >= 0;
		// Finds the full path of the translation file to use
		var FullPath = (OnlinePlayer ? "Screens/Online/ChatRoom/Dialog_Online" :  (C.ID == 0) ? "Screens/Character/Player/Dialog_Player" : "Screens/" + CurrentModule + "/" + CurrentScreen + "/Dialog_" + C.AccountName) + "_" + TranslationLanguage + ".txt";

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

/**
 * Translate an array of tags in the current selected language
 * @param {Array.<{Tag: string, Value: string}>} Text - Array of current tag-value pairs
 * @returns {void} - Nothing
 */
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

/**
 * Translates the asset group and asset descriptions based on the given dictionary
 * @param {string[]} T - The active translation dictionary
 * @returns {void} - Nothing
 */
function TranslationAssetProcess(T) {
	for (let A = 0; A < AssetGroup.length; A++)
		AssetGroup[A].Description = TranslationString(AssetGroup[A].Description, T, "");
	for (let A = 0; A < Asset.length; A++)
		Asset[A].Description = TranslationString(Asset[A].Description, T, "");
}

/**
 * Translates the description of the assets and groups of an asset family
 * @param {string} Family - Name of the asset family to translate
 * @returns {void} - Nothing
 */
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

/**
 * Changes the current language and save the new selected language to local storage
 * @returns {void} - Nothing
 */
function TranslationNextLanguage() {
	for (let L = 0; L < TranslationDictionary.length; L++)
		if (TranslationDictionary[L].LanguageCode == TranslationLanguage) {
			if (L != TranslationDictionary.length - 1)
				TranslationLanguage = TranslationDictionary[L + 1].LanguageCode;
			else
				TranslationLanguage = TranslationDictionary[0].LanguageCode;
			localStorage.setItem("BondageClubLanguage", TranslationLanguage);
			return;
		}
}

/**
 * Loads the previous translation language from local storage if it exists
 * @returns {void} - Nothing
 */
function TranslationLoad() {
	var L = localStorage.getItem("BondageClubLanguage");
	if (L != null) TranslationLanguage = L;
}
