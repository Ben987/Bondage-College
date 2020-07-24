"use strict";

/**
 * All tags
 * @constant
 * @type {string}
 */
var BackgroundsTagNone = "Filter by tag";
var BackgroundsTagIndoor = "Indoor";
var BackgroundsTagOutdoor = "Outdoor";
var BackgroundsTagPirates = "Pirates";
var BackgroundsTagSpecial = "Special Events";
var BackgroundsTagSciFiFantasy = "SciFi & Fantasy";

/**
 * List of all tags
 * @constant
 * @type {string[]}
 */
var BackgroundsTagList = [
    BackgroundsTagNone,
    BackgroundsTagIndoor,
    BackgroundsTagOutdoor,
    BackgroundsTagPirates,
    BackgroundsTagSpecial,
    BackgroundsTagSciFiFantasy
];

/**
 * List of all the common backgrounds.
 * @constant 
 * @type {string[]}
 */
var BackgroundsList = [
    { Name: "Introduction", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "KidnapLeague", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "MaidQuarters", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "MainHall", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Management", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Private", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Shibari", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "MaidCafe", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "HorseStable", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Nursery", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Bedroom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "PrisonHall", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Kennels", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "BDSMRoomBlue", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "BDSMRoomPurple", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "BDSMRoomRed", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "BondageBedChamber", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "CeremonialVenue", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial], Public: true },
    { Name: "WeddingRoom", Tag: [BackgroundsTagIndoor, BackgroundsTagSpecial], Public: true },
    { Name: "WeddingArch", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial], Public: true },
    { Name: "WeddingBeach", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial], Public: true },
    { Name: "ParkDay", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "ParkNight", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "Gardens", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "ParkWinter", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial], Public: true },
    { Name: "XmasEve", Tag: [BackgroundsTagIndoor, BackgroundsTagSpecial], Public: true },
    { Name: "XmasDay", Tag: [BackgroundsTagIndoor, BackgroundsTagSpecial], Public: true },
    { Name: "StreetNight", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "SnowyStreet", Tag: [BackgroundsTagOutdoor, BackgroundsTagSpecial], Public: true },
    { Name: "DystopianCity", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "IndoorPool", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "OutdoorPool", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "PublicBath", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Onsen", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "Beach", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "BeachCafe", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "BeachHotel", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "PirateIsland", Tag: [BackgroundsTagOutdoor, BackgroundsTagPirates], Public: true },
    { Name: "PirateIslandNight", Tag: [BackgroundsTagOutdoor, BackgroundsTagPirates], Public: true },
    { Name: "ShipDeck", Tag: [BackgroundsTagOutdoor, BackgroundsTagPirates], Public: true },
    { Name: "CaptainCabin", Tag: [BackgroundsTagIndoor, BackgroundsTagPirates], Public: true },
    { Name: "Shipwreck", Tag: [BackgroundsTagOutdoor, BackgroundsTagPirates], Public: true },
    { Name: "UnderwaterOne", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy], Public: true },
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
    { Name: "SecretChamber", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Dungeon", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "DungeonRuin", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Confessions", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "AncientRuins", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "JungleTemple", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "SunTemple", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "AlchemistOffice", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "ResearchPrep", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "ResearchProgress", Tag: [BackgroundsTagIndoor], Public: true },
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
    { Name: "Cellar", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "SlumCellar", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "VaultCorridor", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "SciFiCell", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "SpaceCaptainBedroom", Tag: [BackgroundsTagIndoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "HellEntrance", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "HeavenEntrance", Tag: [BackgroundsTagOutdoor, BackgroundsTagSciFiFantasy], Public: true },
    { Name: "BarRestaurant", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "LostVages", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "ChillRoom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Boudoir", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "Kitchen", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "DiningRoom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "CozyLivingRoom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "TiledBathroom", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "RooftopParty", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "PartyBasement", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "CosyChalet", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "BalconyNight", Tag: [BackgroundsTagOutdoor], Public: true },
    { Name: "WrestlingRing", Tag: [BackgroundsTagIndoor], Public: false },
    { Name: "RustySaloon", Tag: [BackgroundsTagIndoor], Public: true },
    { Name: "OldFarm", Tag: [BackgroundsTagOutdoor], Public: true }
];
