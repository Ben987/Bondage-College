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
var BackgroundsTagClub = "Club rooms";
var BackgroundsTagHouse = "Regular house";
var BackgroundsTagDungeon = "Dungeon";
var BackgroundsTagAsylum = "Asylum";  // not public, hence not added to the select form
var BackgroundsTagLARP = "LARP";

/**
 * List of all tags
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
 * List of all the common backgrounds.
 * @constant 
 * @type {string[]}
 */
var BackgroundsList = [
    { Name: "Introduction", Tag: [BackgroundsTagIndoor, BackgroundsTagClub], Public: true },
    { Name: "KidnapLeague", Tag: [BackgroundsTagIndoor, BackgroundsTagClub], Public: true },
    { Name: "MaidQuarters", Tag: [BackgroundsTagIndoor, BackgroundsTagClub], Public: true },
    { Name: "MainHall", Tag: [BackgroundsTagIndoor, BackgroundsTagClub], Public: true },
    { Name: "Management", Tag: [BackgroundsTagIndoor, BackgroundsTagClub], Public: true },
    { Name: "Private", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "Shibari", Tag: [BackgroundsTagIndoor, BackgroundsTagClub], Public: true },
    { Name: "MaidCafe", Tag: [BackgroundsTagIndoor, BackgroundsTagClub], Public: true },
    { Name: "HorseStable", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Nursery", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Bedroom", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "PrisonHall", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Kennels", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "BDSMRoomBlue", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon], Public: true },
    { Name: "BDSMRoomPurple", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon], Public: true },
    { Name: "BDSMRoomRed", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon], Public: true },
    { Name: "BondageBedChamber", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon], Public: true },
    { Name: "CeremonialVenue", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial], Public: true },
    { Name: "WeddingRoom", Tag: [BackgroundsTagIndoor, BackgroundsTagSpecial], Public: true },
    { Name: "WeddingArch", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial], Public: true },
    { Name: "WeddingBeach", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial, BackgroundsTagAquatic], Public: true },
    { Name: "ParkDay", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "ParkNight", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "Gardens", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "ParkWinter", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial], Public: true },
    { Name: "XmasEve", Tag: [BackgroundsTagIndoor, BackgroundsTagSpecial], Public: true },
    { Name: "XmasDay", Tag: [BackgroundsTagIndoor, BackgroundsTagSpecial], Public: true },
    { Name: "StreetNight", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "SnowyStreet", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial], Public: true },
    { Name: "DystopianCity", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "IndoorPool", Tag: [BackgroundsTagIndoor, BackgroundsTagAquatic, BackgroundsTagHouse], Public: true },
    { Name: "OutdoorPool", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic], Public: true },
    { Name: "PublicBath", Tag: [BackgroundsTagIndoor, BackgroundsTagAquatic], Public: true },
    { Name: "Onsen", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic], Public: true },
    { Name: "Beach", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic], Public: true },
    { Name: "BeachCafe", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "BeachHotel", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "PirateIsland", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic], Public: true },
    { Name: "PirateIslandNight", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic], Public: true },
    { Name: "ShipDeck", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic], Public: true },
    { Name: "CaptainCabin", Tag: [BackgroundsTagIndoor, BackgroundsTagAquatic], Public: true },
    { Name: "Shipwreck", Tag: [BackgroundsTagOutdoor, BackgroundsTagAquatic], Public: true },
    { Name: "UnderwaterOne", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy, BackgroundsTagAquatic], Public: true },
    { Name: "MedinaMarket", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "SheikhPrivate", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "SheikhTent", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "ForestPath", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "WoodenCabin", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "DeepForest", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "ForestCave", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "SpookyForest", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "WitchWood", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "DesolateVillage", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "ThroneRoom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "SecretChamber", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "Dungeon", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon], Public: true },
    { Name: "DungeonRuin", Tag: [BackgroundsTagIndoor, BackgroundsTagDungeon], Public: true },
    { Name: "Confessions", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy, BackgroundsTagDungeon], Public: true },
    { Name: "AncientRuins", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "JungleTemple", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "SunTemple", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "AlchemistOffice", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "ResearchPrep", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy, BackgroundsTagDungeon], Public: true },
    { Name: "ResearchProgress", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy, BackgroundsTagDungeon], Public: true },
    { Name: "MiddletownSchool", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "SlipperyClassroom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "LockerRoom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "SchoolHospital", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "SchoolRuins", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "SlumRuins", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "SlumApartment", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "AbandonedBuilding", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "AbandonedSideRoom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Industrial", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "BackAlley", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "CreepyBasement", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Cellar", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "SlumCellar", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "VaultCorridor", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "SciFiCell", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy, BackgroundsTagDungeon], Public: true },
    { Name: "SpaceCaptainBedroom", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "HellEntrance", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "HeavenEntrance", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "BarRestaurant", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "LostVages", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "ChillRoom", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "Boudoir", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "Kitchen", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "DiningRoom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "CozyLivingRoom", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "TiledBathroom", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "RooftopParty", Tag: [BackgroundsTagOutdoor, BackgroundsTagHouse], Public: true },
    { Name: "PartyBasement", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "CosyChalet", Tag: [BackgroundsTagIndoor, BackgroundsTagHouse], Public: true },
    { Name: "BalconyNight", Tag: [BackgroundsTagOutdoor, BackgroundsTagHouse], Public: true },
    { Name: "WrestlingRing", Tag: [BackgroundsTagIndoor, BackgroundsTagLARP], Public: false },
    { Name: "RustySaloon", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "OldFarm", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "AsylumEntrance", Tag: [BackgroundsTagAsylum], Public: false },
    { Name: "AsylumBedroom", Tag: [BackgroundsTagAsylum], Public: false },
    { Name: "AsylumMeeting", Tag: [BackgroundsTagAsylum], Public: false },
    { Name: "AsylumTherapy", Tag: [BackgroundsTagAsylum], Public: false },
    { Name: "PaddedCell", Tag: [BackgroundsTagAsylum], Public: false },
    { Name: "PaddedCell2", Tag: [BackgroundsTagAsylum], Public: false }
];
