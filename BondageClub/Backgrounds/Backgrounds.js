"use strict";

/**
 * All tags
 * @constant
 * @type {string}
 */
var BackgroundsTagNone = "Filter by tag";
var BackgroundsTagIndoor = "Indoor";
var BackgroundsTagOutdoor = "Outdoor";
var BackgroundsTagAquatic = "Aquatic";
var BackgroundsTagSpecial = "Special Events";
var BackgroundsTagSciFiFantasy = "SciFi & Fantasy";
var BackgroundsTagClub = "Club & College";
var BackgroundsTagHouse = "Regular house";
var BackgroundsTagDungeon = "Dungeon";
var BackgroundsTagAsylum = "Asylum";

/**
 * List of all tags to create online chat rooms
 * @constant
 * @type {string[]}
 */
var BackgroundsTagList = [
    BackgroundsTagNone,
    BackgroundsTagIndoor,
    BackgroundsTagOutdoor,
    BackgroundsTagAquatic,
    BackgroundsTagSpecial,
    BackgroundsTagSciFiFantasy,
    BackgroundsTagClub,
    BackgroundsTagHouse,
    BackgroundsTagDungeon
];

/**
 * List of all tags to setup your main hall or private room
 * @constant
 * @type {string[]}
 */
var BackgroundsPrivateRoomTagList = [
    BackgroundsTagClub,
    BackgroundsTagHouse,
    BackgroundsTagDungeon
];

/**
 * List of all the common backgrounds.
 * @constant 
 * @type {string[]}
 */
var BackgroundsList = [
    { Name: "Introduction", Tag: [BackgroundsTagIndoor, BackgroundsTagClub] },
    { Name: "KidnapLeague", Tag: [BackgroundsTagIndoor, BackgroundsTagClub] },
    { Name: "MaidQuarters", Tag: [BackgroundsTagIndoor, BackgroundsTagClub] },
    { Name: "MainHall", Tag: [BackgroundsTagIndoor, BackgroundsTagClub] },
    { Name: "Management", Tag: [BackgroundsTagIndoor, BackgroundsTagClub] },
    { Name: "Private", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "Shibari", Tag: [BackgroundsTagIndoor, BackgroundsTagClub] },
    { Name: "MaidCafe", Tag: [BackgroundsTagIndoor, BackgroundsTagClub] },
    { Name: "HorseStable", Tag: [BackgroundsTagIndoor] },
    { Name: "Nursery", Tag: [BackgroundsTagIndoor] },
    { Name: "Bedroom", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "PrisonHall", Tag: [BackgroundsTagIndoor] },
    { Name: "Kennels", Tag: [BackgroundsTagIndoor] },
    { Name: "BDSMRoomBlue", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon] },
    { Name: "BDSMRoomPurple", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon] },
    { Name: "BDSMRoomRed", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon] },
    { Name: "BondageBedChamber", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon] },
    { Name: "CeremonialVenue", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial] },
    { Name: "WeddingRoom", Tag: [BackgroundsTagIndoor, BackgroundsTagSpecial] },
    { Name: "WeddingArch", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial] },
    { Name: "WeddingBeach", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial, BackgroundsTagAquatic] },
    { Name: "ParkDay", Tag: [BackgroundsTagOutdoor] },
    { Name: "ParkNight", Tag: [BackgroundsTagOutdoor] },
    { Name: "Gardens", Tag: [BackgroundsTagOutdoor] },
    { Name: "ParkWinter", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial] },
    { Name: "XmasEve", Tag: [BackgroundsTagIndoor, BackgroundsTagSpecial] },
    { Name: "XmasDay", Tag: [BackgroundsTagIndoor, BackgroundsTagSpecial] },
    { Name: "StreetNight", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyStreet", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial] },
    { Name: "BoutiqueMain", Tag: [BackgroundsTagIndoor] },
    { Name: "BoutiqueBack", Tag: [BackgroundsTagIndoor] },
    { Name: "DystopianCity", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy] },
    { Name: "IndoorPool", Tag: [BackgroundsTagIndoor, BackgroundsTagAquatic, BackgroundsTagHouse] },
    { Name: "OutdoorPool", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic] },
    { Name: "PublicBath", Tag: [BackgroundsTagIndoor, BackgroundsTagAquatic] },
    { Name: "Onsen", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic] },
    { Name: "Beach", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic] },
    { Name: "BeachCafe", Tag: [BackgroundsTagOutdoor] },
    { Name: "BeachHotel", Tag: [BackgroundsTagOutdoor] },
    { Name: "PirateIsland", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic] },
    { Name: "PirateIslandNight", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic] },
    { Name: "ShipDeck", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic] },
    { Name: "CaptainCabin", Tag: [BackgroundsTagIndoor, BackgroundsTagAquatic] },
    { Name: "Shipwreck", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic] },
    { Name: "UnderwaterOne", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy, BackgroundsTagAquatic] },
    { Name: "MedinaMarket", Tag: [BackgroundsTagOutdoor] },
    { Name: "SheikhPrivate", Tag: [BackgroundsTagIndoor] },
    { Name: "SheikhTent", Tag: [BackgroundsTagIndoor] },
    { Name: "ForestPath", Tag: [BackgroundsTagOutdoor] },
    { Name: "WoodenCabin", Tag: [BackgroundsTagIndoor] },
    { Name: "DeepForest", Tag: [BackgroundsTagOutdoor] },
    { Name: "ForestCave", Tag: [BackgroundsTagOutdoor] },
    { Name: "SpookyForest", Tag: [BackgroundsTagOutdoor] },
    { Name: "WitchWood", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy] },
    { Name: "DesolateVillage", Tag: [BackgroundsTagOutdoor] },
    { Name: "ThroneRoom", Tag: [BackgroundsTagIndoor] },
    { Name: "SecretChamber", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy] },
    { Name: "Dungeon", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon] },
    { Name: "DungeonRuin", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon] },
    { Name: "Confessions", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy, BackgroundsTagDungeon] },
    { Name: "AncientRuins", Tag: [BackgroundsTagOutdoor] },
    { Name: "JungleTemple", Tag: [BackgroundsTagOutdoor] },
    { Name: "SunTemple", Tag: [BackgroundsTagOutdoor] },
    { Name: "AlchemistOffice", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy] },
    { Name: "ResearchPrep", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy, BackgroundsTagDungeon] },
    { Name: "ResearchProgress", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy, BackgroundsTagDungeon] },
    { Name: "MiddletownSchool", Tag: [BackgroundsTagOutdoor] },
    { Name: "SlipperyClassroom", Tag: [BackgroundsTagIndoor] },
    { Name: "LockerRoom", Tag: [BackgroundsTagIndoor] },
    { Name: "SchoolHospital", Tag: [BackgroundsTagIndoor] },
    { Name: "SchoolRuins", Tag: [BackgroundsTagOutdoor] },
    { Name: "SlumRuins", Tag: [BackgroundsTagOutdoor] },
    { Name: "SlumApartment", Tag: [BackgroundsTagIndoor] },
    { Name: "AbandonedBuilding", Tag: [BackgroundsTagIndoor] },
    { Name: "AbandonedSideRoom", Tag: [BackgroundsTagIndoor] },
    { Name: "Industrial", Tag: [BackgroundsTagIndoor] },
    { Name: "BackAlley", Tag: [BackgroundsTagOutdoor] },
    { Name: "CreepyBasement", Tag: [BackgroundsTagIndoor] },
    { Name: "Cellar", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "SlumCellar", Tag: [BackgroundsTagIndoor] },
    { Name: "VaultCorridor", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy] },
    { Name: "SciFiCell", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy, BackgroundsTagDungeon] },
    { Name: "SpaceCaptainBedroom", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy] },
    { Name: "HellEntrance", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy] },
    { Name: "HeavenEntrance", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy] },
    { Name: "BarRestaurant", Tag: [BackgroundsTagIndoor] },
    { Name: "LostVages", Tag: [BackgroundsTagIndoor] },
    { Name: "ChillRoom", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "Boudoir", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "Kitchen", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "DiningRoom", Tag: [BackgroundsTagIndoor] },
    { Name: "CozyLivingRoom", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "TiledBathroom", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "RooftopParty", Tag: [BackgroundsTagOutdoor, BackgroundsTagHouse] },
    { Name: "PartyBasement", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "CosyChalet", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse] },
    { Name: "BalconyNight", Tag: [BackgroundsTagOutdoor, BackgroundsTagHouse] },
    { Name: "WrestlingRing", Tag: [BackgroundsTagIndoor] },
    { Name: "RustySaloon", Tag: [BackgroundsTagIndoor] },
    { Name: "OldFarm", Tag: [BackgroundsTagOutdoor] },
    { Name: "AsylumEntrance", Tag: [BackgroundsTagAsylum] },
    { Name: "AsylumBedroom", Tag: [BackgroundsTagAsylum] },
    { Name: "AsylumMeeting", Tag: [BackgroundsTagAsylum] },
    { Name: "AsylumTherapy", Tag: [BackgroundsTagAsylum] },
    { Name: "PaddedCell", Tag: [BackgroundsTagAsylum] },
    { Name: "PaddedCell2", Tag: [BackgroundsTagAsylum] },
    { Name: "RainyForestPathDay", Tag: [BackgroundsTagOutdoor] },
    { Name: "RainyForstPathNight", Tag: [BackgroundsTagOutdoor] },
    { Name: "RainyStreetDay", Tag: [BackgroundsTagOutdoor] },
    { Name: "RainyStreetNight", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyChaletDay", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyChaletNight", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyDeepForest", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyForestPathDay", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyForestPathNight", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyLakeNight", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyStreetDay1", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyStreetDay2", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyStreetNight2", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyTown1", Tag: [BackgroundsTagOutdoor] },
    { Name: "SnowyTown2", Tag: [BackgroundsTagOutdoor] },
    { Name: "NightClub", Tag: [BackgroundsTagIndoor] },
    { Name: "EgyptianExhibit", Tag: [BackgroundsTagIndoor] },
    { Name: "SciFiOutdoors", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy] },
    { Name: "Castle", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy] },
    { Name: "EgyptianTomb", Tag: [BackgroundsTagIndoor] },
    { Name: "PoolBottom", Tag: [BackgroundsTagAquatic] },
    { Name: "LatexRoom", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon, BackgroundsTagAsylum] },
    { Name: "OutsideCells", Tag: [BackgroundsTagAsylum] },
    { Name: "WesternStreet", Tag: [BackgroundsTagOutdoor] },
    { Name: "Desert", Tag: [BackgroundsTagOutdoor] },
    { Name: "Ranch", Tag: [BackgroundsTagOutdoor] },
    { Name: "Wagons", Tag: [BackgroundsTagOutdoor] },
    { Name: "OutdoorPool2", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic] },
    { Name: "SynthWave", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy] },
    { Name: "Infiltration", Tag: [BackgroundsTagClub, BackgroundsTagIndoor, BackgroundsTagSciFiFantasy] },
    { Name: "MovieStudio", Tag: [BackgroundsTagClub, BackgroundsTagIndoor] },
    { Name: "CollegeTennis", Tag: [BackgroundsTagClub, BackgroundsTagOutdoor] },
    { Name: "CollegeTheater", Tag: [BackgroundsTagClub, BackgroundsTagIndoor] },
    { Name: "CollegeClass", Tag: [BackgroundsTagClub, BackgroundsTagIndoor] },
    { Name: "SchoolHallway", Tag: [BackgroundsTagIndoor] },
    { Name: "HotelBedroom", Tag: [BackgroundsTagIndoor] }
];

/**
 * Builds the selectable background arrays based on the tags supplied
 * @param {array} BackgroundTagList - An array of string of all the tags to load
 * @returns {array} - The list of all background names
 */
function BackgroundsGenerateList(BackgroundTagList) {
	var List = [];
	BackgroundSelectionAll = [];
	for (let B = 0; B < BackgroundsList.length; B++)
		for (let T = 0; T < BackgroundsList[B].Tag.length; T++)
			if (BackgroundTagList.indexOf(BackgroundsList[B].Tag[T]) >= 0) {
				List.push(BackgroundsList[B].Name);
				var Desc = DialogFindPlayer(BackgroundsList[B].Name);
				BackgroundSelectionAll.push({ Name: BackgroundsList[B].Name, Description: Desc, Low: Desc.toLowerCase() });
				break;
			}
	return List;
}
