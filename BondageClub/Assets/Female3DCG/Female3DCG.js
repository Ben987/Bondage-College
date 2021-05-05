"use strict";
// *** Item value guidelines ***
// First, check if there's a similar item and use that price.  If there isn't, use the real price in US dollars
// If it's an item that can only used once in real life (duct tape), raise the price a lot (you buy a great quantity of it)
// If it's an item with extended capabilities, raise the price
// If it's an item with multiple image layers, raise the price a little
// If it's a restraint that's impossible to remove, raise the price a little
// If the item doesn't have any image (butt plug), lower the price
// Bondage items should not go over 250$ - The love belt is that item right now
// Regular clothes should not go over 100$ - Dress2 is that item right now
// Empty value is a free item that everyone has from the start
// -1 value items cannot be bought, they must be acquired in-game in some other ways

// *** Sort order of asset & asset group properties ***
// Name, Priority, Value, Difficulty, SelfBondage, Time, RemoveTime, Enable, Visible, Random, Wear, IsRestraint, AllowLock, OwnerOnly, LoverOnly, Left, Top, DefaultColor, BuyGroup, Prerequisite, Hide, HideItem, everything else
// Group, ParentGroup, ParentSize, ParentColor, Category, Priority, Default, Clothing, Underwear, Random, IsRestraint, Blink, Left, Top, Color, FullAlpha, AllowNone, AllowColorize, AllowCustomize, AllowPose, SetPose, Effect, Zone, Activity

// *** Item addition & modification guidelines ***
// Don't include images, sounds or names that are obviously copyrighted
// Don't create anything that could be viewed by lots of players as racist, sexist, anti-LGBT, pedophilic, religious or political
// If you change an item or a piece of code made by someone else, make sure to get their approval first

// Spanking Toys Asset
var AssetSpankingToys = {
	Name: "SpankingToys", Random: false, Wear: false, BuyGroup: "SpankingToys",
	DynamicAllowInventoryAdd: C => InventoryIsWorn(Player, "SpankingToys", "ItemHands") && InventorySpankingToysActivityAllowed(C),
	DynamicDescription: C => InventorySpankingToysGetDescription(C),
	DynamicExpressionTrigger: C => InventoryItemHandsSpankingToysOptions.find(x => x.Name == InventorySpankingToysGetType(Player)).ExpressionTrigger,
	DynamicPreviewIcon: C => InventorySpankingToysGetType(Player),
	DynamicName: C => "SpankingToys" + InventorySpankingToysGetType(C),
	DynamicGroupName: "ItemHands",
	DynamicActivity: C => InventorySpankingToysGetActivity(C),
	DynamicAudio: C => InventorySpankingToysGetAudio(C),
	ParentGroup: null,
	Effect: [],
	DialogSortOverride: DialogSortOrderEquipped
};

// 3D Custom Girl based assets
var AssetFemale3DCG = [

	// Appearance specific
	{
		Group: "Cloth",
		ParentGroup: "BodyUpper",
		Priority: 30,
		Clothing: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "AllFours", "OverTheHead"],
		PreviewZone: [0, 150, 500, 500],
		Asset: [
			{
				Name: "CollegeOutfit1", Value: -1, DefaultColor: ["Default", "#202020", "Default"], Hide: ["ItemNeck"], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"], Layer: [
					{ Name: "Shirt" },
					{ Name: "Tie" },
					{ Name: "Skirt" },
				]
			},
			{ Name: "MaidOutfit1", Fetish: ["Lingerie"], Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "MaidOutfit2", Fetish: ["Lingerie"], Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"], Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"] },
			{ Name: "StudentOutfit1", Hide: ["ItemNeck", "ItemHidden"], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "StudentOutfit2", HideItem: ["ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemHiddenLeatherArmbinderStrap", "ItemHiddenLeatherArmbinderWrapStrap", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{
				Name: "StudentOutfit3", HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemHiddenLeatherArmbinderStrap", "ItemHiddenLeatherArmbinderWrapStrap", "ItemNipplesLactationPump"], Layer: [
					{ Name: "White" },
					{ Name: "Color" }
				],
				Require: ["ClothLower", "ClothAccessory"]
			},
			{ Name: "BabydollDress1", Fetish: ["ABDL"], HideItem: ["ClothLowerLatexSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"], Layer: [
				{ Name: "Dress"},
				{ Name: "Trim"}
			] },
			{ Name: "TeacherOutfit1", Hide: ["ItemNeck", "ItemHidden"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"], AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "AllFours", "OverTheHead", "Horse", "KneelingSpread"] },
			{ Name: "ChineseDress1", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{
				Name: "ChineseDress2", Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"],
				Layer: [
					{ Name: "Dress", AllowColorize: true },
					{ Name: "Edges", AllowColorize: true },
				]
			},
			{ Name: "TShirt1", HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"], Require: ["ClothLower"] },
			{ Name: "TennisShirt1", Hide: ["ItemHidden"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"], Require: ["ClothLower"] },
			{ Name: "Sweater1", HideItem: ["ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"], Require: ["ClothLower"] },
			{ Name: "MistressTop", Fetish: ["Leather"], Value: -1, Bonus: "KidnapDomination", Hide: ["Bra"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"], Require: ["ClothLower"] },
			{ Name: "AdultBabyDress1", Fetish: ["ABDL"], Value: 60, Hide: ["ItemHidden"], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"], Layer: [
				{ Name: "Dress"},
				{ Name: "Sash"},
				{ Name: "Trim"}
			] },
			{ Name: "AdultBabyDress2", Fetish: ["ABDL"], Value: 80, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "AdultBabyDress3", Fetish: ["ABDL"], Value: 40, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "AdultBabyDress4", Fetish: ["ABDL"], Value: 80, Left: 100, Top: 190, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "NurseUniform", Value: -1, Bonus: "KidnapDomination", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "Robe1", Value: 30, Hide: ["ItemHidden"], HideItem: ["ClothLowerLatexSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "SuspenderTop1", Fetish: ["Lingerie"], Priority: 25, Value: 50, Hide: ["Panties", "ItemVulva", "ItemVulvaPiercings"], Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"] },
			{ Name: "LeatherCorsetTop1", Fetish: ["Leather"], BuyGroup: "LeatherCorsetTop1", Priority: 25, Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"] },
			{
				Name: "FlowerDress", Value: 50, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"],
				AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "AllFours", "OverTheHead", "Suspension"],
				Layer: [
					{ Name: "Dress", AllowColorize: true },
					{ Name: "Flower", AllowColorize: false }
				]
			},
			{ Name: "Dress2", Value: 100, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "LaceBabydoll", Fetish: ["Lingerie"], Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"] },
			{ Name: "SleevelessTop", Fetish: ["Lingerie"], Value: 20, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"] },
			{
				Name: "DressFur", Value: 70, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"],
				Layer: [
					{ Name: "Fabric" },
					{ Name: "Fur" }
				]
			},
			{ Name: "BodyTowel1", Value: 30, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"] },
			{ Name: "Yukata1", Value: 50, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "SteampunkCorsetTop1", Fetish: ["Leather"], Priority: 25, Value: 70, Hide: ["ItemHidden"], HideItem: ["ClothLowerTennisSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"] },
			{ Name: "BondageDress1", BuyGroup: "BondageDress1", Value: 90, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "BondageDress2", BuyGroup: "BondageDress2", Value: 90, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "ShoulderlessTop", Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"] },
			{ Name: "Dress3", Value: 80, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "ComfyTop", Value: 60, Hide: ["ItemNipples", "ItemNipplesPiercings"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "WeddingDress1", Fetish: ["Lingerie"], Priority: 22, Value: 150, Hide: ["ClothLower", "BodyLower", "Panties", "Shoes", "ItemBoots"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemLegsLeatherLegCuffs", "ItemLegsFuturisticLegCuffs", "ItemLegsWoodenHorse", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar", "ItemLegsOrnateLegCuffs", "ItemFeetOrnateAnkleCuffs", "ItemDevicesSaddleStand", "ItemVulvaWandBelt", "ItemFeetAnkleShackles", "ItemFeetIrish8Cuffs", "ItemFeetBallChain", "ItemNipplesLactationPump", "ItemDevicesDiaperHarness"], AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "LegsClosed", "Kneel", "KneelingSpread", "AllFours","OverTheHead"] },
			{ Name: "WeddingDress2", Fetish: ["Lingerie"], Priority: 22, Value: 150, Hide: ["ClothLower", "BodyLower", "Panties", "Shoes", "ItemBoots"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemLegsFuturisticLegCuffs", "ItemLegsLeatherLegCuffs", "ItemLegsWoodenHorse", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar", "ItemLegsOrnateLegCuffs", "ItemNipplesLactationPump", "ItemFeetOrnateAnkleCuffs", "ItemDevicesSaddleStand", "ItemVulvaWandBelt", "ItemFeetAnkleShackles", "ItemFeetIrish8Cuffs", "ItemFeetBallChain", "ItemDevicesDiaperHarness"], AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "LegsClosed", "Kneel", "KneelingSpread", "AllFours","OverTheHead"] },
			{ Name: "BridesmaidDress1", Fetish: ["Lingerie"], Value: 100, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemNipplesLactationPump"] },
			{ Name: "Gown1", Value: 70, Random: false, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "Gown2Top", Value: 90, Random: false, Left: 125, Top: 220, BuyGroup: "Gown2", HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesLactationPump", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Require: ["ClothLower"] },
			{ Name: "Gown3", Value: 70, Random: false, Left: 99, Top: 194, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesLactationPump", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "MaidApron1", Fetish: ["Lingerie"], Priority: 32, Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "MaidApron2", Fetish: ["Lingerie"], Priority: 32, Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"] },
			{ Name: "AdmiralTop", Value: 30, Hide: ["ItemNeck", "ItemHidden"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsFuturisticCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "VirginKiller1", Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"] },
			{ Name: "ReverseBunnySuit", Fetish: ["Nylon", "Pet"], Value: 100, BuyGroup: "ReverseBunnySuit", Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemTorso"] },
			{ Name: "LeatherCropTop", Fetish: ["Leather"], Value: 60, Hide: ["ItemNipples", "ItemNipplesPiercings"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "CorsetShirt", Fetish: ["Lingerie"], Priority: 25, Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"],
				Layer: [
					{ Name: "Shirt" },
					{ Name: "Corset" }
				]
			},
			{ Name: "BondageBustier1", BuyGroup: "BondageDress1", Value: -1, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"] },
			{ Name: "BondageBustier2", BuyGroup: "BondageDress2", Value: -1, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"] },
			{ Name: "LeatherBolero", Fetish:["Leather"], Value: 60, Alpha: [{ Group: ["ItemNeck"], Masks: [[185, 215, 130, 65]] }], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemTorso"], HideItem: ["ItemNeckLeatherCollar", "ItemNeckLeatherCollarBell", "ItemNeckLeatherCollarBow", "ItemNeckSlaveCollar", "ItemNeckClubSlaveCollar", "ItemNeckShockCollar", "ItemNeckShockCollarRemote", "ItemNeckBatCollar", "ItemNeckPostureCollar", "ItemNeckSteelPostureCollar", "ItemNeckDogCollar", "ItemNeckSpikeCollar", "ItemNeckHighCollar", "ItemNeckLeatherChoker", "ItemNeckPetCollar", "ItemNeckMaidCollar", "ItemNeckBordelleCollar", "ItemNeckLoveLeatherCollar", "ItemNeckNobleCorsetCollar", "ItemNeckHeartCollar", "ItemNeckHighSecurityCollar", "ItemNeckOrnateCollar", "ItemNeckSlenderSteelCollar", "ItemNeckHeartLinkChoker", "ItemNeckNeckRope"] },
			{
				Name: "Bodice1", Value: 90, Top: 213,
				HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"],
				HideForPose: ["Hogtied", "AllFours"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Trim" },
					{ Name: "Pattern" }
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ClothAccessory",
		Priority: 32,
		Default: false,
		Clothing: true,
		PreviewZone: [0, 200, 500, 500],
		Asset: [
			{ Name: "StudentOutfit3Scarf", Priority: 34, Left: 200, Top: 250 },
			{ Name: "StudentOutfit3Bow1", Priority: 34, Left: 200, Top: 250 },
			{ Name: "StudentOutfit3Bow2", Priority: 34, Left: 200, Top: 250 },
			{ Name: "StudentOutfit3Bow3", Priority: 34, Left: 200, Top: 250 },
			{
				Name: "Bouquet", Priority: 41, Value: 40, Left: 175, Top: 350, BuyGroup: "Bouquet", AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Flowers" }
				]
			},
			{ Name: "FrillyApron", Fetish: ["Lingerie"], ParentGroup: "BodyUpper", Value: -1, Left: 135, Top: 179, BuyGroup: "Maid", AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead"] },
			{ Name: "BunnyCollarCuffs", Fetish: ["Pet"], ParentGroup: "BodyUpper", Value: 10, AllowPose: ["AllFours", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead"], AllowType: ["Collar", "Cuffs"], Extended: true,
				Layer: [
					{ Name: "Collar"},
					{ Name: "Bow"},
					{ Name: "Cuffs"}
				]
			},
			{ Name: "Camera1", Priority: 41, Value: -1, Left: 175, Top: 225, Bonus: "KidnapSneakiness", AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "OverTheHead"] },
			{
				Name: "Cape", Priority: 41, Value: 40, AllowPose: ["AllFours", "Hogtied", "Kneel"],
				Layer: [
					{ Name: "Back",  Priority: 6 },
					{ Name: "Front",  Priority: 41 }
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Necklace",
		ParentGroup: "BodyUpper",
		Priority: 31,
		Default: false,
		Clothing: true,
		PreviewZone: [165, 170, 170, 170],
		Asset: [
			{ Name: "Necklace1", Value: 40, Left: 148, Top: 70, ParentGroup: null },
			{ Name: "Necklace2", Left: 147, Top: 90, ParentGroup: null },
			{ Name: "Necklace3", Left: 147, Top: 110, ParentGroup: null },
			{ Name: "Necklace4", Value: 30, Left: 147, Top: 110, ParentGroup: null },
			{
				Name: "NecklaceLock", Fetish: ["Metal"], Value: 40, Left: 155, Top: 152, ParentGroup: null, AllowType: ["Tucked"], Extended: true,
				Layer: [
					{ Name: "Chain", HasType: false },
					{ Name: "Lock", HasType: false },
				]
			},
			{
				Name: "NecklaceKey", Fetish: ["Metal"], Value: 40, Left: 153, Top: 152, ParentGroup: null, AllowType: ["Tucked"], Extended: true,
				Layer: [
					{ Name: "Chain", HasType: false },
					{ Name: "Key", HasType: false },
				]
			},
			{
				Name: "IDCard", Value: 10, Left: 145, Top: 180, ParentGroup: null,
				Layer: [
					{ Name: "String" },
					{ Name: "Card" }
				]

			},
			{ Name: "BlackHeart", Value: 40, Left: 148, Top: 70, ParentGroup: null },
			{ Name: "ElegantHeartNecklace", Value: 30, Left:155, Top: 152, ParentGroup: null,
				Layer: [
					{ Name: "Necklace", AllowColorize: true },
					{ Name: "Jewels", AllowColorize: true },
				]
			},
			{ Name: "Bandana", Value: 15, Left: 148, Top: 97, BuyGroup: "ScarfGag", ParentGroup: null},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Suit",
		ParentGroup: "BodyUpper",
		Priority: 14,
		Default: false,
		Clothing: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "OverTheHead"],
		PreviewZone: [75, 150, 350, 350],
		Asset: [
			{
				Name: "Catsuit", Fetish: ["Latex"], Value: 100, BuyGroup: "Catsuit", Hide: ["ItemNipplesPiercings"], HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Zip" }
				]
			},
			{ Name: "SeamlessCatsuit", Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", Hide: ["ItemNipplesPiercings"], HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "PilotSuit", Fetish: ["Latex"], Value: 150, BuyGroup: "PilotSuit", DefaultColor: ["#3270C1", "#2B408B", "#969696", "#2B408B"], Hide: ["ItemNipplesPiercings"], HideItem: ["ItemNipplesChopStickNippleClamps"],
				Layer: [
					{ Name: "Layer1", AllowColorize: true },
					{ Name: "Layer2", AllowColorize: true },
					{ Name: "Layer3", AllowColorize: true },
					{ Name: "Layer4", AllowColorize: true },
				]
			},
			{ Name: "SeethroughSuit", Fetish: ["Latex"], Value: 100, BuyGroup: "SeethroughSuit", HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{
				Name: "SeethroughSuitZip", Fetish: ["Latex"], Value: -1, BuyGroup: "SeethroughSuit", HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Zip" }
				]
			},
			{ Name: "ReverseBunnySuit", Fetish: ["Latex", "Pet"], Value: 100, BuyGroup: "ReverseBunnySuit", Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemTorso"] }
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ClothLower",
		ParentGroup: "BodyLower",
		ParentColor: "Cloth",
		Priority: 26,
		Default: false,
		Clothing: true,
		Left: 105,
		Top: 380,
		AllowPose: ["LegsClosed", "Kneel", "Horse", "KneelingSpread", "Spread"],
		PreviewZone: [0, 380, 500, 500],
		Asset: [
			{ Name: "Skirt1", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "Skirt2", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Layer: [
					{ Name: "Color" },
					{ Name: "Stripe" }
				],
				ParentItem: "StudentOutfit3"
			},
			{
				Name: "Skirt3", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Layer: [
					{ Name: "Color" },
					{ Name: "Stripe" }
				],
				ParentItem: "StudentOutfit3"
			},
			{ Name: "TennisSkirt1", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], ParentItem: "TennisShirt1" },
			{ Name: "Jeans1", Priority: 22, Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks6", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo"] },
			{ Name: "Shorts1", Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo"] },
			{ Name: "Pajama1", Priority: 25, Random: false, HideItem: ["ItemButtAnalBeads2",  "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt"] },
			{ Name: "MistressBottom", Fetish: ["Leather"], Value: -1, Hide: ["Panties"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo", "ItemVulvaPenisDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Waspie1", Fetish: ["Leather"], Value: 60, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Waspie2", Fetish: ["Leather"], Value: 80, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Waspie3", Fetish: ["Leather"], Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "LatexPants1", Fetish: ["Latex"], Priority: 21, Value: 60, Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksStockings2", "SocksStockings3", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo"] },
			{ Name: "LatexSkirt1", Fetish: ["Latex"], Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "LatexSkirt2", Fetish: ["Latex"], Value: 60, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "ClothSkirt1", Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Jeans2", Priority: 22, Value: 20, Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks6", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo"] },
			{ Name: "ChineseSkirt1", Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Gown2Skirt", Value: -1, Random: false, Left: 50, Top: 462, BuyGroup: "Gown2", Hide: ["ItemFeet"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemLegsNylonRope", "ItemLegsHempRope", "ItemLegsLeatherBelt", "ItemLegsSturdyLeatherBelts", "ItemLegsDuctTape", "ItemLegsLeatherLegCuffs", "ItemLegsFuturisticLegCuffs", "ItemLegsOrnateLegCuffs", "ItemLegsZipties", "ItemLegsChains", "ItemBootsThighHighLatexHeels"], SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"], ParentItem: "Gown2Top" },
			{ Name: "AdmiralSkirt", Value: 30, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "JeanSkirt", Value: 30, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "PencilSkirt", Fetish: ["Leather"], Value: 60, Left: 105, Top: 380, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemLegsNylonRope", "ItemLegsHempRope", "ItemLegsLeatherBelt", "ItemLegsSturdyLeatherBelts", "ItemLegsDuctTape", "ItemLegsLeatherLegCuffs", "ItemLegsOrnateLegCuffs", "ItemLegsFuturisticLegCuffs", "ItemLegsZipties", "ItemLegsChains", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar"], SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"] },
			{ Name: "JeansShorts", Value: 20, Priority: 22, Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaHempRopeBelt", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaHeavyWeightClamp", "ItemVulvaClitAndDildoVibratorbelt", "ItemVulvaShockDildo"] },
			{
				Name: "Leggings1", Value: 15, Priority: 21, DefaultColor: "#4499c4", Hide: ["ItemVulvaPiercings", "Panties"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks4", "SocksSocks5", "SocksSocks6", "ItemVulvaVibratingLatexPanties", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaTapeStrips", "ItemVulvaBenWaBalls", "ItemVulvaHeavyWeightClamp", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing", "ItemVulvaShockDildo"], Layer: [
					{ Name: "Cloth" },
					{ Name: "Stripe" }
				]
			},
			{
				Name: "Leggings2", Value: 20, Priority: 21, DefaultColor: "#4499c4", Hide: ["ItemVulvaPiercings", "Panties"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "ItemVulvaVibratingLatexPanties", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaTapeStrips", "ItemVulvaBenWaBalls", "ItemVulvaHeavyWeightClamp", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing", "ItemVulvaShockDildo"], Layer: [
					{ Name: "Cloth" },
					{ Name: "Stripe" }
				]
			},
			{
				Name: "PleatedSkirt", Value: 35, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Layer: [
					{ Name: "Dress", AllowColorize: true },
					{ Name: "Stripe", AllowColorize: false }
				]
			},
			{
				Name: "LongSkirt1", Value: 40, Left: 69, ParentGroup: null,
				HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"],
				Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
				AllowPose: ["Kneel"],
				HideForPose: ["KneelingSpread", "Horse"],
				Layer: [
					{ Name: "Back" },
					{ Name: "Front", CopyLayerColor: "Back", Priority: 28 },
				],
			},
			{ Name: "ShortPencilSkirt", Fetish: ["Leather"], Value: 50, Left: 105, Top: 380, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemLegsNylonRope", "ItemLegsHempRope", "ItemLegsLeatherBelt", "ItemLegsSturdyLeatherBelts", "ItemLegsDuctTape", "ItemLegsLeatherLegCuffs", "ItemLegsOrnateLegCuffs", "ItemLegsFuturisticLegCuffs", "ItemLegsZipties", "ItemLegsChains", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar"], SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"], WhitelistActivePose: ["BaseLower", "Kneel"] },
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "SuitLower",
		ParentGroup: "BodyLower",
		Priority: 14,
		Default: false,
		Clothing: true,
		Left: 95,
		Top: 380,
		AllowPose: ["LegsClosed", "Kneel", "Horse", "KneelingSpread", "Spread", "Hogtied"],
		PreviewZone: [0, 450, 500, 500],
		Asset: [
			{
				Name: "Catsuit", Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", Hide: ["ItemVulvaPiercings"], HideItem: ["SocksPantyhose1"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Zip" }
				]
			},
			{ Name: "SeamlessCatsuit", Fetish: ["Latex"], Value: -1, BuyGroup: "Catsuit", Hide: ["ItemVulvaPiercings"], HideItem: ["SocksPantyhose1"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "PilotSuit", Fetish: ["Latex"], Value: -1, BuyGroup: "PilotSuit", DefaultColor: ["#3270C1", "#2B408B", "#969696", "#282828"], Hide: ["ItemVulvaPiercings"], HideItem: ["SocksPantyhose1"], Expose: ["ItemVulva", "ItemVulvaPiercings"],
				Layer: [
					{ Name: "Layer1", AllowColorize: true },
					{ Name: "Layer2", AllowColorize: true },
					{ Name: "Layer3", AllowColorize: true },
					{ Name: "Layer4", AllowColorize: true }
				]
			},
			{ Name: "SeethroughSuit", Fetish: ["Latex"], Value: -1, BuyGroup: "SeethroughSuit", HideItem: ["SocksPantyhose1"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "SeethroughSuitZip", Fetish: ["Latex"], Value: -1, BuyGroup: "SeethroughSuit", HideItem: ["SocksPantyhose1"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Zip" }
				]
			},
			{ Name: "ReverseBunnySuit", Fetish: ["Latex", "Pet"], Value: -1, BuyGroup: "ReverseBunnySuit", Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Pantyhose1", Fetish: ["Nylon"], Value: 10, Left: 125, Top: 400, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], BuyGroup: "Pantyhose", Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], DynamicGroupName: "Socks" },
			{ Name: "Pantyhose2", Fetish: ["Nylon"], Value: 10, Left: 125, Top: 400, BuyGroup: "Pantyhose2", DynamicGroupName: "Socks" },
			{ Name: "Stockings1", Fetish: ["Nylon"], Left: 125, Top: 400, BuyGroup: "Stockings1", DynamicGroupName: "Socks" },
			{ Name: "Stockings2", Fetish: ["Nylon"], Left: 125, Top: 400, BuyGroup: "Stockings2", DynamicGroupName: "Socks" },
			{ Name: "Stockings3", Fetish: ["Nylon"], Value: 10, Left: 125, Top: 400, BuyGroup: "Stockings3", DynamicGroupName: "Socks" },
			{ Name: "Stockings4", Fetish: ["Nylon"], Value: 10, Left: 125, Top: 400, BuyGroup: "Stockings4", DynamicGroupName: "Socks" },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Bra",
		ParentGroup: "BodyUpper",
		Priority: 21,
		Clothing: true,
		Underwear: true,
		Left: 150,
		Top: 200,
		AllowPose: ["Yoked", "Hogtied"],
		PreviewZone: [75, 190, 350, 350],
		Asset: [
			{ Name: "Bra1", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra2", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra7", Priority: 20, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra8", Value: 15, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra9", Value: 10, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bandeau1", Fetish: ["Lingerie"], Priority: 20, Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bustier1", Fetish: ["Lingerie"], Value: 30, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bikini1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikini1", Value: 50, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikini2", Value: 40, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikini3", Value: 45, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Swimsuit1", Value: 15, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "Swimsuit2", Value: 25, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "BunnySuit", Fetish: ["Nylon", "Pet"], Value: 30, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "FrameBra1", Value: 20, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "FrameBra2", Value: 15, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "BondageBra1", Fetish: ["Leather"], Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "LatexBra1", Fetish: ["Lingerie", "Latex"], Value: 30, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra1", Fetish: ["Leather"], Priority: 20, Value: 30, BuyGroup: "HarnessBra1", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra2", Fetish: ["Leather"], Priority: 20, Value: 40, BuyGroup: "HarnessBra2", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "CuteBikini1", Fetish: ["Lingerie"], Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "CorsetBikini1", Fetish: ["Lingerie"], Priority: 20, Value: 40, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "OuvertPerl1", Fetish: ["Lingerie"], Priority: 20, Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Sarashi1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "KittyBra1", Fetish: ["Pet"], Value: 30, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "FishnetBikini1", Priority: 20, Value: 45, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "SexyBeachBra1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikiniBra1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "StarHarnessBra", Fetish: ["Leather"], Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HeartTop", Fetish: ["Lingerie"], Priority: 20, Value: 35, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "ChineseBra1", Fetish: ["Lingerie"], Value: 35, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "LeatherStrapBra1", Fetish: ["Leather"], Value: 15, BuyGroup: "LeatherStrapBra1", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Swimsuit3", Value: 35, DefaultColor: "#E53771", Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemVulva"] },
			{ Name: "ClamShell", Value: 20, Left: 0, Top: 0, DefaultColor: "#E53771", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "CowPrintedBra", Value: 15, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{
				Name: "StuddedHarness", Fetish: ["Lingerie", "Leather"], Priority: 20, Value: -1, DefaultColor:"#343131", BuyGroup: "StuddedHarness", Expose:["ItemBreast"], Hide: ["ItemNipples","ItemNipplesPiercings"], HideItem: ["PantiesDiapers1","PantiesDiapers2","PantiesDiapers3"],
				Layer:[
					{ Name: "Harness", AllowColorize: true},
					{ Name: "Metal", AllowColorize: false}
				]
			},
			{ Name: "Camisole", Priority: 22, DefaultColor: "#908867", Value: 5, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Corset",
		ParentGroup: "BodyUpper",
		Priority: 22,
		Clothing: true,
		Default: false,
		Underwear: true,
		Left: 150,
		Top: 200,
		AllowPose: ["Hogtied"],
		PreviewZone: [75, 250, 350, 350],
		Asset: [
			{ Name: "Corset1", Fetish: ["Lingerie"], Priority: 22, Value: 35, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset2", Fetish: ["Lingerie"], Priority: 22, Value: 30, BuyGroup: "Corset2", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset3", Fetish: ["Lingerie"], Priority: 22, Value: 25, BuyGroup: "Corset3", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset4", Fetish: ["Lingerie"], Priority: 22, Value: 15, BuyGroup: "Corset4", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Corset5", Fetish: ["Lingerie"], Priority: 22, Value: 20, BuyGroup: "Corset5", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{
				Name: "LatexCorset1", Fetish: ["Lingerie", "Latex"], Priority: 21, Value: 40, BuyGroup: "LatexCorset1", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], Extended: true, HasType: false,
				Layer:[
					{ Name: "Base", HasType: false },
					{ Name: "Garter", CopyLayerColor: "Base", HasType: false, AllowTypes: [""] }
				],
			},
			{ Name: "LeatherCorsetTop1", Fetish: ["Leather"], Left: 0, Top: 0, BuyGroup: "LeatherCorsetTop1", Priority: 25, Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemNipplesLactationPump"], AllowPose: ["Hogtied", "Yoked"] },
			{Name: "Corset6", Fetish: ["Lingerie"], Value: 40, DefaultColor:["#435331","#363535","#A08759"], Hide: ["ItemNipples", "ItemNipplesPiercings"],
				Layer:[
					{ Name: "Cloth", AllowColorize: true},
					{ Name: "Leather", AllowColorize: true},
					{ Name: "Buttons", AllowColorize: true}
				]
			},
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Panties",
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Priority: 19,
		Clothing: true,
		Underwear: true,
		Left: 150,
		Top: 395,
		PreviewZone: [125, 350, 250, 250],
		Asset: [
			{ Name: "Panties1", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties7", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties8", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties11", Fetish: ["Lingerie"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties12", Fetish: ["Lingerie"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties13", Fetish: ["Lingerie"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties14", Fetish: ["Lingerie"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties15", Fetish: ["Lingerie"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Bikini1", Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Diapers1", Priority: 23, Category: ["ABDL"], Fetish: ["ABDL"], Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{
				Name: "Diapers2", Priority: 23, Category: ["ABDL"], Fetish: ["ABDL"], Value: 30, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				Layer: [
					{ Name: "Diaper" },
					{ Name: "Cover" }
				]
			},
			{ Name: "Diapers3", Priority: 23, Category: ["ABDL"], Fetish: ["ABDL"], Value: 30, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "Panties16", Fetish: ["Lingerie"], Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "MaidPanties1", Fetish: ["Lingerie"], Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "LatexPanties1", BuyGroup: "LatexPanties", Fetish: ["Latex"], Value: -1, Expose: ["ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "WrapPanties1", Value: 25, Expose: ["ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "CrotchPanties1", Value: 30, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "StringPanties1", Value: 15, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "StringPasty1", Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "ZipPanties1", Value: 15, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "HarnessPanties1", Fetish: ["Leather"], Value: 35, BuyGroup: "HarnessPanties1", AllowPose: ["LegsClosed", "Kneel"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "HarnessPanties2", Fetish: ["Leather"], Value: 40, Left: 85, Top: 395, BuyGroup: "HarnessPanties2", AllowPose: ["LegsClosed", "Kneel", "Horse", "KneelingSpread", "Spread"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "KittyPanties1", Fetish: ["Pet"], Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "PearlPanties1", Fetish: ["Lingerie"], Value: 20, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "SunstripePanties1", Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "SexyBeachPanties1", Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "ChinesePanties1", Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "LeatherStrapPanties1", Fetish: ["Leather"], Value: 20, BuyGroup: "LeatherStrapPanties1", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "CowPrintedPanties", Value: 15, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "LatexPanties2", BuyGroup: "LatexPanties", Fetish: ["Latex"], Value: 30,  HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"] },
			{ Name: "PilotPanties", BuyGroup: "PilotSuit", DefaultColor: ["#3270C1", "#2B408B", "#969696"], Left: 95, Top: 380, Fetish: ["Latex"], Value: -1,  HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"],
				Layer: [
					{ Name: "Layer1", AllowColorize: true },
					{ Name: "Layer2", AllowColorize: true },
					{ Name: "Layer3", AllowColorize: true },
				]
			},
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Socks",
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Priority: 20,
		Clothing: true,
		Underwear: true,
		Left: 125,
		Top: 400,
		AllowPose: ["LegsClosed", "Kneel", "Spread", "Hogtied"],
		PreviewZone: [0, 450, 500, 500],
		Asset: [
			"Socks0", "Socks1", "Socks2", "Socks3", "Socks4", "Socks5",
			{ Name: "Stockings1", Fetish: ["Nylon"], BuyGroup: "Stockings1"},
			{ Name: "Stockings2", Fetish: ["Nylon"], BuyGroup: "Stockings2"},
			{ Name: "Stockings3", Fetish: ["Nylon"], Value: 10, BuyGroup: "Stockings3"},
			{ Name: "Stockings4", Fetish: ["Nylon"], Value: 10, BuyGroup: "Stockings4"},
			{ Name: "Pantyhose1", Fetish: ["Nylon"], Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], BuyGroup: "Pantyhose", Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "Socks6", Fetish: ["Nylon"], Value: 25,
				Layer: [
					{ Name: "Sock" },
					{ Name: "Frill" }
				]
			},
			{
				Name: "SocksFur", Fetish: ["Nylon"], Value: 40,
				Layer: [
					{ Name: "Fabric" },
					{ Name: "Fur" }
				]
			},
			{
				Name: "SocksStriped1", Value: 10, Layer: [
					{ Name: "Light" },
					{ Name: "Dark" },
				]
			},
			{ Name: "LatexSocks1", Fetish: ["Latex"], Value: 30 },
			{ Name: "FootlessSocks1", Value: 15 },
			{ Name: "ReverseBunnySuit", Fetish: ["Nylon", "Pet"], Value: 100, BuyGroup: "ReverseBunnySuit" },
			{ Name: "LeatherSocks1", Fetish: ["Leather"], Value: 20 },
			{ Name: "Pantyhose2", Fetish: ["Nylon"], Value: 10, BuyGroup: "Pantyhose2" },
			{ Name: "CowPrintedSocks", Fetish: ["Nylon"], Value: 15 },
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "RightAnklet",
		ParentGroup: "BodyLower",
		Priority: 22,
		Clothing: true,
		Default: false,
		Left: 115,
		Top: 500,
		AllowPose: ["LegsClosed", "Spread"],
		PreviewZone: [100, 700, 300, 300],
		Asset: [
			{ Name: "BandAnklet", BuyGroup: "BandAnklet"}
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "LeftAnklet",
		ParentGroup: "BodyLower",
		Priority: 22,
		Clothing: true,
		Default: false,
		Left: 115,
		Top: 500,
		AllowPose: ["LegsClosed", "Spread"],
		PreviewZone: [100, 700, 300, 300],
		Asset: [
			{ Name: "BandAnklet", BuyGroup: "BandAnklet"}
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Shoes",
		ParentGroup: "BodyLower",
		Priority: 23,
		Clothing: true,
		Left: 115,
		Top: 500,
		AllowPose: ["LegsClosed", "Kneel", "Spread", "Hogtied"],
		PreviewZone: [100, 700, 300, 300],
		Asset: [
			{ Name: "Shoes1", Height: 6 },
			{ Name: "Shoes2", Height: 6 },
			{ Name: "Shoes4", Height: 6 },
			{ Name: "Sneakers1", Height: 3 },
			{ Name: "Sneakers2", Height: 3 },
			{ Name: "Heels1", Height: 15 },
			{ Name: "Heels2", Height: 15 },
			{ Name: "Boots1", Height: 9,
				Layer: [
					{ Name: "Shoes", AllowColorize: true},
					{ Name: "Sides", AllowColorize: true},
					{ Name: "Laces", AllowColorize: true}
				]
			},
			{ Name: "MistressBoots", Fetish: ["Leather"], Value: -1, HideItem: ["SocksSocks4", "SocksSocks5"], Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 875, 350, 200]] }], Height: 35	},
			{ Name: "PonyBoots", Fetish: ["Pony"], Value: -1, Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 875, 350, 200]] }], Height: 35},
			{ Name: "Sandals", Priority: 22, Value: 30, HideItem: ["SocksSocks0", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksSocksFur"], Height: 3 },
			{ Name: "SandalsRS", Priority: 22, Value: 30, DefaultColor:["#AA9977", "#999999"], HideItem: ["SocksSocks0", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksSocksFur"], Height: 1, Alpha: [{ Group: ["BodyUpper"], Pose: ["Hogtied"], Masks: [[0, 0, 500, 70]] }],
				Layer: [
					{ Name: "Soles",  Priority: 6 },
					{ Name: "Top",  Priority: 22 }
				]
			},
			{ Name: "PawBoots", Fetish: ["Pet"], Value: 45, Height: 3 },
			{ Name: "WoollyBootsTall", Fetish: ["Pet"], Value: 60, Height: 9 },
			{ Name: "ThighHighLatexHeels", Fetish: ["Latex"], Value: 80, BuyGroup: "ThighHighLatexHeels",
				Alpha: [
					{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 680, 350, 320]] },
					{ Group: ["BodyLower", "Socks", "SuitLower"], Pose: ["LegsClosed"], Masks: [[75, 650, 350, 350]] },
				], Height: 30
			},
			{ Name: "Heels3", Height: 15, Value: 30 },
			{ Name: "BarefootSandals1", Hide: ["Socks"], Value: 10, BuyGroup: "BarefootSandals" },
			{ Name: "LatexAnkleShoes", Fetish: ["Latex"], Value: 60, DefaultColor: ["#373636"], },
			{ Name: "Flippers", Height: 40, Value: 25, Left: 84,
				Layer: [
					{ Name: "Fins",  AllowColorize: true },
					{ Name: "Shoes",  AllowColorize: false }
				]
			},
			{ Name: "DeluxeBoots", Fetish: ["Leather"], Value: -1, Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[180, 900, 50, 100], [280, 900, 50, 100]] }], DefaultColor: ["#9F0D0D", "#700A0A", "#700A0A", "#9F0D0D"], Height: 35,
				Layer: [
					{ Name: "Boots", AllowColorize: true},
					{ Name: "Laces", AllowColorize: true},
					{ Name: "Heels", AllowColorize: true},
					{ Name: "Straps", AllowColorize: true},
					{ Name: "Buckles", AllowColorize: false},
				]
			},
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Hat",
		Priority: 55,
		Default: false,
		Clothing: true,
		Left: 125,
		Top: 0,
		AllowPose: ["Suspension"],
		PreviewZone: [140, 0, 220, 220],
		Asset: [
			"Band1", "Band2", "Beret1",
			{ Name: "MaidHairband1", Fetish: ["Lingerie"], Value: -1 },
			{ Name: "NurseCap", Value: -1 },
			{
				Name: "Santa1", Value: 20,
				Layer: [
					{ Name: "Fabric" },
					{ Name: "Fur" }
				]
			},
			{
				Name: "CaptainHat1", Value: 25, Layer: [
					{ Name: "Top" },
					{ Name: "Insignia" },
					{ Name: "Rope" },
					{ Name: "Brim" },
				]
			},
			{ Name: "BunnySuccubus2", Fetish: ["Pet"], Value: 35 },
			{ Name: "WitchHat1", Value: 40 },
			{
				Name: "PirateBandana1", Value: 15, Layer: [
					{ Name: "Bandana" },
					{ Name: "Skull" },
					{ Name: "Dots" },
				]
			},
			{
				Name: "PoliceWomanHat", Value: 40, Layer: [
					{ Name: "Badge" },
					{ Name: "Hat" }
				]
			},
			{ Name: "HeadTowel1", Value: 15, Hide: ["HairFront", "HairBack"] },
			{ Name: "CollegeDunce", Value: -1 },
			{ Name: "Tiara1", Value: 40 },
			{
				Name: "Bonnet1", Value: 20,
				Layer: [
					{ Name: "Base" },
					{ Name: "Lace" }
				]
			},
			{ Name: "Bonnet2", Value: 20 },
			{ Name: "Crown1", Value: 20 },
			{
				Name: "Crown2", Value: 20, Layer: [
					{ Name: "Crown" },
					{ Name: "Jewels" }
				]
			},
			{
				Name: "Crown3", Value: 20, Layer: [
					{ Name: "Crown" },
					{ Name: "Jewels" }
				]
			},
			{ Name: "Crown4", Value: 20 },
			{ Name: "Crown5", Value: 20 },
			{ Name: "SmallHat1", Value: 30 },
			{ Name: "Veil1", Fetish: ["Lingerie"], Value: 40 },
			{ Name: "Veil2", Fetish: ["Lingerie"], Value: 40 },
			{ Name: "BakerBoyHat", Value: 40, },
			{ Name: "ReindeerBand", Value: 10 },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	// Hair accessory 1: Ears & Accessories
	// Hair accessory 2: Ears only
	// Hair accessory 3: Accessories only
	{
		Group: "HairAccessory3",
		Priority: 56,
		Default: false,
		Clothing: true,
		Left: 90,
		Top: 0,
		PreviewZone: [125, 0, 250, 250],
		DynamicGroupName: "HairAccessory1",
		Asset: [
			{ Name: "Ribbons1", Priority: 4, BuyGroup: "Ribbons1" },
			{ Name: "Ribbons2", Priority: 4, Value: -1, BuyGroup: "Ribbons2" },
			{ Name: "Ribbons3", BuyGroup: "Ribbons3" },
			{ Name: "Ribbons4", BuyGroup: "Ribbons4" },
			{ Name: "GiantBow1", Priority: 4, BuyGroup: "GiantBow1" },
			{ Name: "HairFlower1", Value: -1, BuyGroup: "HairFlower1" },
			{ Name: "WeddingVeil1", Priority: 4, Value: -1, BuyGroup: "WeddingVeil1" },
			{ Name: "HairFeathers1", Value: -1, BuyGroup: "HairFeathers1" },
			{
				Name: "Halo", Value: -1, BuyGroup: "Halo", Top: -100, Left: 0, DefaultColor: ["#fff4a0", "#ffee66", "#fffdee"], Extended: true, MinOpacity: 0, Opacity: 0, AllowType: ["Broken"],
				Layer: [
					{ Name: "Glow", Opacity: 0 },
					{ Name: "Base", MinOpacity: 1 },
					{ Name: "Core", Opacity: 0, }
				]
			}
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "HairAccessory1",
		Priority: 54,
		Default: false,
		Clothing: true,
		Left: 90,
		Top: 0,
		PreviewZone: [125, 0, 250, 250],
		Asset: [
			{ Name: "Ears1", Fetish: ["Pet"], BodyCosplay: true },
			{ Name: "Ears2", Fetish: ["Pet"], BodyCosplay: true },
			{ Name: "PonyEars1", Fetish: ["Pony"], BodyCosplay: true },
			{ Name: "Ribbons1", Priority: 4, BuyGroup: "Ribbons1" },
			{ Name: "Ribbons2", Priority: 4, Value: -1, BuyGroup: "Ribbons2" },
			{ Name: "Ribbons3", BuyGroup: "Ribbons3" },
			{ Name: "Ribbons4", BuyGroup: "Ribbons4" },
			{ Name: "GiantBow1", Priority: 4, BuyGroup: "GiantBow1" },
			{ Name: "BunnyEars1", Fetish: ["Pet"], Value: 10, BuyGroup: "BunnyEars1", BodyCosplay: true },
			{
				Name: "BunnyEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "BunnyEars2", BodyCosplay: true, Layer: [
					{ Name: "Outer" },
					{ Name: "Inner" },
				]
			},
			{ Name: "PuppyEars1", Fetish: ["Pet"], Priority: 6, Value: 20, BuyGroup: "PuppyEars1", BodyCosplay: true },
			{ Name: "SuccubusHorns", Fetish: ["Pet"], Value: 15, BuyGroup: "SuccubusHorns", BodyCosplay: true },
			{ Name: "Horns", Fetish: ["Pet"], Value: 20, BuyGroup: "Horns", BodyCosplay: true },
			{ Name: "Horns2", Fetish: ["Pet"], Value: 15, BuyGroup: "Horns2", BodyCosplay: true },
			{ Name: "Horns3", Fetish: ["Pet"], Value: 15, BuyGroup: "Horns3", BodyCosplay: true },
			{ Name: "HairFlower1", Value: 10, BuyGroup: "HairFlower1" },
			{ Name: "FoxEars1", Fetish: ["Pet"], Value: 15, BuyGroup: "FoxEars1", BodyCosplay: true },
			{ Name: "BatWings", Fetish: ["Pet"], Value: 20, BuyGroup: "BatWings", BodyCosplay: true },
			{ Name: "KittenEars1", Fetish: ["Pet"], Value: 20, BuyGroup: "KittenEars1", BodyCosplay: true,
				Layer: [
					{ Name: "Outer" },
					{ Name: "Inner" },
				]
			},
			{ Name: "KittenEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "KittenEars2", BodyCosplay: true },
			{ Name: "WolfEars1", Fetish: ["Pet"], Value: 20, BuyGroup: "WolfEars1", BodyCosplay: true },
			{ Name: "WolfEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "WolfEars2", BodyCosplay: true },
			{ Name: "FoxEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "FoxEars2", BodyCosplay: true,
				Layer: [
					{ Name: "Outer" },
					{ Name: "Inner" },
				]
			},
			{ Name: "FoxEars3", Fetish: ["Pet"], Value: 20, BuyGroup: "FoxEars3", BodyCosplay: true, Layer:[
				{ Name: "EarOuter"},
				{ Name: "EarInner"},
				{ Name: "Strap"},
				{ Name: "Bell"}
			]},
			{ Name: "PuppyEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "PuppyEars2", BodyCosplay: true },
			{ Name: "RaccoonEars1", Fetish: ["Pet"], Value: 15, BuyGroup: "RaccoonEars1", BodyCosplay: true },
			{ Name: "WeddingVeil1", Priority: 4, Value: 30, BuyGroup: "WeddingVeil1" },
			{ Name: "HairFeathers1", Value: 10, BuyGroup: "HairFeathers1" },
			{ Name: "MouseEars1", Fetish: ["Pet"], Value: 20, BuyGroup: "MouseEars1", BodyCosplay: true },
			{ Name: "MouseEars2", Fetish: ["Pet"], Value: 20, BuyGroup: "MouseEars2", BodyCosplay: true },
			{ Name: "ElfEars", Value: 20, BuyGroup: "ElfEars", BodyCosplay: true, InheritColor: "BodyUpper", Extended: true, HasType: false, AllowType: ["Behind"] },
			{ Name: "CowHorns", Fetish: ["Pet"], Value: 15, BuyGroup: "CowHorns", BodyCosplay: true },
			{
				Name: "Halo", Value: 20, BuyGroup: "Halo", Top: -100, Left: 0, DefaultColor: ["#fe6", "#fe6", "#fff"], Extended: true, MinOpacity: 0, Opacity: 0, AllowType: ["Broken"],
				Layer: [
					{ Name: "Glow", Opacity: 0 },
					{ Name: "Base", MinOpacity: 1 },
					{ Name: "Core", Opacity: 0, }
				]
			}
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "HairAccessory2",
		Priority: 53,
		Default: false,
		Clothing: true,
		BodyCosplay: true,
		Left: 90,
		Top: 0,
		PreviewZone: [125, 0, 250, 250],
		DynamicGroupName: "HairAccessory1",
		Asset: [
			{ Name: "Ears1", Fetish: ["Pet"] },
			{ Name: "Ears2", Fetish: ["Pet"] },
			{ Name: "PonyEars1", Fetish: ["Pony"] },
			{ Name: "BunnyEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "BunnyEars1" },
			{
				Name: "BunnyEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "BunnyEars2", Layer: [
					{ Name: "Outer" },
					{ Name: "Inner" },
				]
			},
			{ Name: "PuppyEars1", Fetish: ["Pet"], Priority: 29, Value: -1, BuyGroup: "PuppyEars1" },
			{ Name: "SuccubusHorns", Fetish: ["Pet"], Value: -1, BuyGroup: "SuccubusHorns" },
			{ Name: "Horns", Fetish: ["Pet"], Value: -1, BuyGroup: "Horns" },
			{ Name: "Horns2", Fetish: ["Pet"], Value: -1, BuyGroup: "Horns2" },
			{ Name: "Horns3", Fetish: ["Pet"], Value: -1, BuyGroup: "Horns3" },
			{ Name: "FoxEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "FoxEars1" },
			{ Name: "BatWings", Fetish: ["Pet"], Value: -1, BuyGroup: "BatWings" },
			{ Name: "KittenEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "KittenEars1",
				Layer: [
					{ Name: "Outer" },
					{ Name: "Inner" },
				],
			},
			{ Name: "KittenEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "KittenEars2" },
			{ Name: "WolfEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "WolfEars1" },
			{ Name: "WolfEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "WolfEars2" },
			{ Name: "FoxEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "FoxEars2",
				Layer: [
					{ Name: "Outer" },
					{ Name: "Inner" },
				],
			},
			{ Name: "FoxEars3", Fetish: ["Pet"], Value: -1, BuyGroup: "FoxEars3",
				Layer:[
					{ Name: "EarOuter"},
					{ Name: "EarInner"},
					{ Name: "Strap"},
					{ Name: "Bell"}
				]
			},
			{ Name: "PuppyEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "PuppyEars2" },
			{ Name: "RaccoonEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "RaccoonEars1" },
			{ Name: "MouseEars1", Fetish: ["Pet"], Value: -1, BuyGroup: "MouseEars1" },
			{ Name: "MouseEars2", Fetish: ["Pet"], Value: -1, BuyGroup: "MouseEars2" },
			{ Name: "ElfEars", Value: -1, BuyGroup: "ElfEars", InheritColor: "BodyUpper", Extended: true, HasType: false, AllowType: ["Behind"] },
			{ Name: "CowHorns", Fetish: ["Pet"], Value: -1, BuyGroup: "CowHorns" }
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Gloves",
		ParentGroup: "BodyUpper",
		ParentColor: "Bra",
		Priority: 28,
		Default: false,
		Clothing: true,
		Underwear: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "AllFours", "OverTheHead"],
		PreviewZone: [125, 265, 250, 250],
		Asset: [
			"Gloves1",
			{ Name: "Gloves2", Alpha: [{ Group: ["BodyUpper"], Pose: ["OverTheHead"],  Masks: [[90, 125, 30, 70], [370, 125, 30, 70]] }] },
			{ Name: "Gloves3", Value: 15, Left: 60, Top: 109 },
			{ Name: "MistressGloves", Fetish: ["Leather"], Value: -1 },
			{ Name: "FingerlessGloves", Value: 20 },
			{
				Name: "GlovesFur", Value: 30,
				Layer: [
					{ Name: "Fabric" },
					{ Name: "Fur" }
				]
			},
			{ Name: "Catsuit", Fetish: ["Nylon"], Value: -1, BuyGroup: "Catsuit" },
			{ Name: "SeethroughSuit", Fetish: ["Nylon"], Value: -1, BuyGroup: "SeethroughSuit" },
			{ Name: "CowPrintedGloves", Value: 15, Alpha: [{ Group: ["BodyUpper"], Pose: ["OverTheHead"],  Masks: [[90, 125, 30, 70], [370, 125, 30, 70]] }] },
			{ Name: "LatexElbowGloves", Fetish: ["Latex"], Value: 75 }
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Glasses",
		Priority: 27,
		Default: false,
		Clothing: true,
		Underwear: true,
		Left: 180,
		Top: 125,
		PreviewZone: [140, 40, 220, 220],
		Asset: [
			"Glasses1", "Glasses2", "Glasses3", "Glasses4", "Glasses5", "Glasses6",
			{ Name: "SunGlasses1", Value: 15 },
			{ Name: "SunGlasses2", Value: 15 },
			{ Name: "SunGlassesClear", Value: 15 },
			{ Name: "EyePatch1", Value: 10, Priority: 29, AllowType: ["Right"], Extended: true },
		],
		Color: ["#303030", "#808080", "#e0e0e0", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
	},

	{
		Group: "Mask",
		Priority: 53,
		Default: false,
		Clothing: true,
		Underwear: true,
		Left: 180,
		Top: 125,
		PreviewZone: [140, 25, 220, 220],
		Asset: [
			{ Name: "VenetianMask", Priority: 49, Fetish: ["Lingerie"], HideItem: ["ItemNoseNoseRing"] },
			{ Name: "DominoMask", Priority: 49, Fetish: ["Lingerie"], HideItem: ["ItemNoseNoseRing"] },
			{ Name: "ButterflyMask", Fetish: ["Lingerie"], Priority: 49, Value: 30, HideItem: ["ItemNoseNoseRing"] },
			{ Name: "ShinobiMask", Fetish: ["Nylon"], Value: 30, Left: 199, Top: 88, Priority: 49, HideItem: ["ItemNoseNoseRing"] },
			{
				Name: "FoxMask", Fetish: ["Pet"], Priority: 49, Value: 30, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing"], Layer: [
					{ Name: "Upper" },
					{ Name: "Lower" },
				]
			},
			{
				Name: "BunnyMask1", Fetish: ["Pet"], Value: 40, AllowType: ["Earless"], Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HairAccessory1Ears1", "HairAccessory2Ears1", "HairAccessory1PonyEars1", "HairAccessory2PonyEars1", "HairAccessory1FoxEars1", "HairAccessory2FoxEars1", "HairAccessory1FoxEars3", "HairAccessory2FoxEars3", "HairAccessory1RaccoonEars1", "HairAccessory2RaccoonEars1", "HatVeil1", "HatVeil2", "HatCaptainHat1", "HatPoliceWomanHat"], Hide: ["Glasses"], Extended: true, HasType: false,
				Layer: [
					{ Name: "Base", HasType: false },
					{ Name: "Ears", CopyLayerColor: "Base", HasType: false, AllowTypes: [""] }
				],
			},
			{ Name: "BunnyMask2", Fetish: ["Pet"], Value: 40, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HairAccessory1Ears1", "HairAccessory2Ears1", "HairAccessory1PonyEars1", "HairAccessory2PonyEars1", "HairAccessory1FoxEars1", "HairAccessory2FoxEars1", "HairAccessory1FoxEars3", "HairAccessory2FoxEars3", "HairAccessory1RaccoonEars1", "HairAccessory2RaccoonEars1", "HatVeil1", "HatVeil2", "HatCaptainHat1", "HatPoliceWomanHat"], Hide: ["Glasses"] },
			{ Name: "BunnyMask3", Fetish: ["Pet"], Value: 40, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HairAccessory1Ears1", "HairAccessory2Ears1", "HairAccessory1PonyEars1", "HairAccessory2PonyEars1", "HairAccessory1FoxEars1", "HairAccessory2FoxEars1", "HairAccessory1FoxEars3", "HairAccessory2FoxEars3", "HairAccessory1RaccoonEars1", "HairAccessory2RaccoonEars1", "HatVeil1", "HatVeil2", "HatCaptainHat1", "HatPoliceWomanHat"], Hide: ["Glasses"] },
			{ Name: "KittyMask1", Fetish: ["Pet"], Value: 30, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HatVeil1", "HatVeil2"], Hide: ["Glasses"] },
			{ Name: "KittyMask2", Fetish: ["Pet"], Value: 30, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HatVeil1", "HatVeil2"], Hide: ["Glasses"] },
			{
				Name: "KittyMask3", Fetish: ["Pet"], Value: 25, Left: 140, Top: 50, Hide: ["HairFront", "Glasses", "HairAccessory1", "HairAccessory2", "HairAccessory3"], Layer: [
					{ Name: "Highlights" },
					{ Name: "Mask" },
				]
			},
			{ Name: "LaceMask1", Fetish: ["Lingerie"], Value: 25, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HatVeil1", "HatVeil2"], Hide: ["Glasses"] },
			{ Name: "LaceMask2", Fetish: ["Lingerie"], Value: 25, Left: 150, Top: 20, HideItem: ["ItemNoseNoseRing", "HatVeil1", "HatVeil2"], Hide: ["Glasses"] },
			{ Name: "FuturisticVisor", Category: ["SciFi"], BuyGroup: "FuturisticVisor", Value: 35, Priority: 27, Random: false, HideItem: ["ItemNoseNoseRing"] },
			{ Name: "OpenFaceHood", Fetish: ["Latex"], Value: -1, Priority: 40, Left: 150, Top: 20, DefaultColor: "#404040", BuyGroup: "OpenFace", Hide: ["HairFront", "HairBack"] },
		],
		Color: ["Default", "#303030", "#808080", "#e0e0e0", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
	},

	{
		Group: "TailStraps",
		Priority: 4,
		Default: false,
		Clothing: true,
		Underwear: true,
		BodyCosplay: true,
		Left: 0,
		Top: 150,
		PreviewZone: [0, 200, 500, 500],
		Asset: [
			{ Name: "TailStrap", Fetish: ["Pet"], Value: 30, Top: 180, Layer: [
				{ Name: "Tail"},
				{ Name: "Ribbon"},
				{ Name: "Bell"},
			] },
			{ Name: "HorseTailStrap", Fetish: ["Pony"], Value: 20, Top: 110, AllowPose: ["AllFours"] },
			{ Name: "HorseTailStrap1", Fetish: ["Pony"], Value: 30, Top: 110, AllowPose: ["AllFours"] },
			{ Name: "FoxTailsStrap", Fetish: ["Pet"], Priority: 2, Value: 50, Top: 120, Layer: [
				{ Name: "Tips"},
				{ Name: "Bases"}
			] },
			{ Name: "PuppyTailStrap", Fetish: ["Pet"], Value: 15, Top: 130, AllowPose: ["AllFours"] },
			{ Name: "SuccubusTailStrap", Fetish: ["Pet"], Value: 10, AllowPose: ["AllFours"] },
			{ Name: "SuccubusHeartTailStrap", Fetish: ["Pet"], Value: 15, Layer: [
				{ Name: "Heart"},
				{ Name: "Tail"}
			]},
			{ Name: "RaccoonStrap", Fetish: ["Pet"], Value: 25 },
			{ Name: "RaccoonTailStrap", Fetish: ["Pet"], Priority: 2, Value: 35 },
			{ Name: "PuppyTailStrap1", Fetish: ["Pet"], Value: 20, AllowPose: ["AllFours"] },
			{ Name: "KittenTailStrap1", Fetish: ["Pet"], Value: 20, Top: 100 },
			{ Name: "KittenTailStrap2", Fetish: ["Pet"], Value: 20, AllowPose: ["AllFours"] },
			{ Name: "FoxTailStrap1", Fetish: ["Pet"], Value: 20, Top: 170, Layer: [
				{ Name: "Tip"},
				{ Name: "Base"}
			] },
			{ Name: "FoxTailStrap2", Fetish: ["Pet"], Value: 20, Top: 200, Layer: [
				{ Name: "Tip"},
				{ Name: "Base"}
			]},
			{ Name: "WolfTailStrap1", Fetish: ["Pet"], Value: 20 },
			{ Name: "WolfTailStrap2", Fetish: ["Pet"], Value: 20, AllowPose: ["AllFours"] },
			{ Name: "WolfTailStrap3", Fetish: ["Pet"], Value: 20, Top: 140, AllowPose: ["AllFours"] },
			{ Name: "DemonPlug", Fetish: ["Pet"], Value: 30, AllowPose: ["AllFours"] },
			{ Name: "MouseTailStrap1", Fetish: ["Pet"], Value: 20, Top: 120 },
			{ Name: "MouseTailStrap2", Fetish: ["Pet"], Value: 20 },
			{ Name: "CowtailStrap", Fetish: ["Pet"], BuyGroup: "CowTails", Value: 20, AllowPose: ["AllFours"] },
			{ Name: "BunnyTailStrap", Fetish: ["Pet"], Value: 1, Visible: false, },
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Wings",
		Priority: 3,
		Default: false,
		Clothing: true,
		Underwear: true,
		BodyCosplay: true,
		PreviewZone: [0, 50, 500, 500],
		Asset: [
			{ Name: "SuccubusFeather", Value: 35 },
			{ Name: "SuccubusWings", Value: 35 },
			{ Name: "AngelFeather", Value: 50 },
			{ Name: "DevilWings", Value: 25 },
			{ Name: "FallenAngelWings", Value: 50 },
			{ Name: "AngelWings", Value: 50 },
			{ Name: "BatWings", Value: 20 },
			{ Name: "FairyWings", Value: 50 },
		],
		Color: ["Default"]
	},

	{
		Group: "Height",
		AllowNone: false,
		AllowColorize: false,
		Asset: [
			{ Name: "H0950", Visible: false, Zoom: 0.950 },
			{ Name: "H0960", Visible: false, Zoom: 0.960 },
			{ Name: "H0970", Visible: false, Zoom: 0.970 },
			{ Name: "H0980", Visible: false, Zoom: 0.980 },
			{ Name: "H0990", Visible: false, Zoom: 0.990 },
			{ Name: "H1000", Visible: false, Zoom: 1.000 },
			{ Name: "H0900", Visible: false, Zoom: 0.900 },
			{ Name: "H0910", Visible: false, Zoom: 0.910 },
			{ Name: "H0920", Visible: false, Zoom: 0.920 },
			{ Name: "H0930", Visible: false, Zoom: 0.930 },
			{ Name: "H0940", Visible: false, Zoom: 0.940 }
		]
	},

	{
		Group: "BodyUpper",
		Priority: 7,
		AllowNone: false,
		AllowColorize: false,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "AllFours", "OverTheHead"],
		Asset: ["Small", "Normal", "Large", "XLarge"],
		Color: ["White", "Asian", "Black"]
	},

	{
		Group: "BodyLower",
		ParentSize: "BodyUpper",
		ParentColor: "BodyUpper",
		Priority: 9,
		Top: 462,
		AllowNone: false,
		AllowColorize: false,
		AllowPose: ["LegsClosed", "Kneel", "Horse", "KneelingSpread", "Spread"],
		Asset: ["Small", "Normal", "Large", "XLarge"],
		Color: ["Default", "White", "Asian", "Black"],
		InheritColor: "BodyUpper"

	},

	{
		Group: "HairFront",
		Priority: 52,
		Left: 150,
		Top: 50,
		AllowNone: false,
		PreviewZone: [140, 40, 220, 220],
		Asset: ["HairFront1", "HairFront1b", "HairFront2", "HairFront2b", "HairFront3", "HairFront3b", "HairFront4", "HairFront4b", "HairFront5",
			"HairFront5b", "HairFront6", "HairFront6b", "HairFront7", "HairFront7b", "HairFront8", "HairFront8b", "HairFront9", "HairFront9b",
			"HairFront10", "HairFront10b", "HairFront11", "HairFront11b", "HairFront12", "HairFront12b", "HairFront13", "HairFront13b", "HairFront14",
			"HairFront14b", "HairFront15", "HairFront16", "HairFront17", "HairFront17b", "HairFront18", "HairFront19"],
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"]
	},

	{
		Group: "HairBack",
		ParentColor: "HairFront",
		Priority: 5,
		Left: 50,
		Top: 0,
		AllowNone: false,
		AllowPose: ["Suspension", "Hogtied", "AllFours"],
		PreviewZone: [55, 0, 390, 390],
		Asset: ["HairNone", "HairBack1", "HairBack2", "HairBack4", "HairBack10", "HairBack14", "HairBack15", "HairBack16", "HairBack17", "HairBack18", "HairBack19", "HairBack20", "HairBack5", "HairBack8", "HairBack11", "HairBack6", "HairBack21", "HairBack22",
			{ Name: "HairBack23", Priority: 39 },
			{ Name: "HairBack24", Priority: 39 },
			"HairBack25", "HairBack26", "HairBack27", "HairBack28", "HairBack29", "HairBack30", "HairBack31", "HairBack32", "HairBack33", "HairBack34", "HairBack35", "HairBack36", "HairBack37", "HairBack38", "HairBack39", "HairBack40", "HairBack41", "HairBack42", "HairBack43", "HairBack44", "HairBack45", "HairBack46", "HairBack47", "HairBack48", "HairBack49"
		],
		Color: ["Default", "#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"],
		InheritColor: "HairFront"
	},

	{
		Group: "Eyes",
		Priority: 9,
		Left: 200,
		Top: 145,
		Blink: true,
		FullAlpha: false,
		AllowNone: false,
		AllowExpression: ["Closed", "Dazed", "Shy", "Sad", "Horny", "Lewd", "VeryLewd", "Heart", "HeartPink", "LewdHeart", "LewdHeartPink", "Dizzy", "Daydream", "Angry", "Surprised", "Scared"],
		MirrorGroup: "Eyes2",
		PreviewZone: [190, 100, 120, 120],
		Asset: ["Eyes1", "Eyes2", "Eyes3", "Eyes4", "Eyes5", "Eyes6", "Eyes7", "Eyes8", "Eyes9", "Eyes10", "Eyes11", "Eyes12", "Eyes13"],
		Color: ["Default", "#6a3628", "#5e481e", "#666666", "#555588", "#558855", "#885555", "#202020", "#aa3333", "#33aa33", "#3333aa", "#aaaa33", "#33aaaa", "#aa33aa"]
	},

	{
		Group: "Eyes2",
		Priority: 9,
		Left: 250,
		Top: 145,
		Blink: true,
		FullAlpha: false,
		AllowNone: false,
		AllowExpression: ["Closed", "Dazed", "Shy", "Sad", "Horny", "Lewd", "VeryLewd", "Heart", "HeartPink", "LewdHeart", "LewdHeartPink", "Dizzy", "Daydream", "Angry", "Surprised", "Scared"],
		MirrorGroup: "Eyes",
		PreviewZone: [190, 100, 120, 120],
		Asset: [{ Name: "Eyes1", ParentItem: "Eyes1" }, { Name: "Eyes2", ParentItem: "Eyes2" }, { Name: "Eyes3", ParentItem: "Eyes3" }, { Name: "Eyes4", ParentItem: "Eyes4" }, { Name: "Eyes5", ParentItem: "Eyes5" }, { Name: "Eyes6", ParentItem: "Eyes6" }, { Name: "Eyes7", ParentItem: "Eyes7" }, { Name: "Eyes8", ParentItem: "Eyes8" }, { Name: "Eyes9", ParentItem: "Eyes9" }, { Name: "Eyes10", ParentItem: "Eyes10" }, { Name: "Eyes11", ParentItem: "Eyes11" }, { Name: "Eyes12", ParentItem: "Eyes12" }, { Name: "Eyes13", ParentItem: "Eyes13" }],
		Color: ["Default", "#6a3628", "#5e481e", "#666666", "#555588", "#558855", "#885555", "#202020", "#aa3333", "#33aa33", "#3333aa", "#aaaa33", "#33aaaa", "#aa33aa"]
	},

	{
		Group: "Mouth",
		Priority: 10,
		Left: 235,
		Top: 180,
		AllowNone: false,
		AllowExpression: ["Frown", "Sad", "Pained", "Angry", "HalfOpen", "Open", "Ahegao", "Moan", "TonguePinch", "LipBite", "Happy", "Devious", "Laughing", "Grin", "Smirk"],
		PreviewZone: [190, 100, 120, 120],
		Asset: [
			{
				Name: "Regular",
				Layer: [
					{ Name: "Lips", AllowColorize: true },
					{ Name: "Inner", AllowColorize: false }
				]
			},
			{ Name: "Discreet" }
		],
		Color: ["Default", "#803d26", "#aa5555", "#cc3333", "#55aa55", "#5555aa", "#55aaaa", "#aa55aa", "#aaaa55"]
	},

	{
		Group: "Nipples",
		ParentGroup: "BodyUpper",
		Priority: 11,
		Left: 175,
		Top: 285,
		AllowNone: false,
		Asset: ["Nipples1", "Nipples2", "Nipples3"],
		Color: ["Default", "#a6665b", "#803d26", "#d68777", "#9b4a2e", "#bb6655"]
	},

	{
		Group: "Pussy",
		Priority: 12,
		Left: 225,
		Top: 500,
		FullAlpha: false,
		AllowNone: false,
		Asset: ["PussyLight1", "PussyLight2", "PussyLight3", "PussyDark1", "PussyDark2", "PussyDark3"],
		Color: ["Default", "#6a3628", "#443330", "#222222"]
	},

	// Facial Expression specific
	{
		Group: "Blush",
		Priority: 8,
		Left: 190,
		Top: 100,
		AllowNone: false,
		AllowColorize: true,
		AllowCustomize: false,
		AllowExpression: ["Low", "Medium", "High", "VeryHigh", "Extreme", "ShortBreath"],
		Asset: ["Blush"]
	},

	{
		Group: "Fluids",
		Priority: 11,
		Left: 200,
		Top: 145,
		AllowNone: false,
		AllowColorize: true,
		AllowCustomize: false,
		AllowExpression: ["DroolLow", "DroolMedium", "DroolHigh", "DroolSides", "DroolMessy", "DroolTearsLow", "DroolTearsMedium", "DroolTearsHigh", "DroolTearsMessy", "DroolTearsSides", "TearsHigh", "TearsMedium", "TearsLow"],
		Asset: ["Fluids"]
	},

	{
		Group: "Emoticon",
		Priority: 60,
		Left: 250,
		Top: 0,
		AllowNone: false,
		AllowColorize: true,
		AllowCustomize: false,
		AllowExpression: ["Afk", "Whisper", "Sleep", "Hearts", "Tear", "Hearing", "Confusion", "Exclamation", "Annoyed", "Read", "RaisedHand", "Spectator", "ThumbsDown", "ThumbsUp", "LoveRope", "LoveGag", "LoveLock", "Wardrobe"],
		Asset: ["Emoticon"]
	},
	// Uncolorable body parts
	{
		Group: "Eyebrows",
		Priority: 9,
		Left: 200,
		Top: 120,
		AllowNone: false,
		AllowColorize: false,
		AllowCustomize: false,
		AllowExpression: ["Raised", "Lowered", "OneRaised", "Harsh", "Angry", "Soft"],
		Asset: ["Eyebrows1"]
	},

	{
		Group: "Hands",
		ParentColor: "BodyUpper",
		Priority: 27,
		AllowNone: false,
		AllowColorize: false,
		AllowCustomize: false,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "AllFours"],
		Asset: ["Default"],
		InheritColor: "BodyUpper",
		Color: ["Default"],
	},

	{
		Group: "Head",
		ParentColor: "BodyUpper",
		Priority: 7,
		AllowNone: false,
		AllowColorize: false,
		AllowCustomize: false,
		Asset: ["Default"],
		InheritColor: "BodyUpper"
	},

	// Item specific
	{
		Group: "ItemFeet",
		ParentGroup: "BodyLower",
		Category: "Item",
		Priority: 27,
		Default: false,
		IsRestraint: true,
		Left: 125,
		Top: 725,
		Effect: ["Freeze", "Prone"],
		FreezeActivePose: ["BodyLower"],
		Zone: [[100, 750, 300, 120]],
		Activity: ["Bite", "Kiss", "Lick", "Nibble", "Tickle", "Spank", "Caress", "MassageHands", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem", "ShockItem", "Wiggle"],
		Asset: [
			{ Name: "NylonRope", Fetish: ["Rope", "Nylon"], Value: 30, Time: 15, DefaultColor: "#909090", BuyGroup: "NylonRope", SetPose: ["LegsClosed"], Audio: "RopeShort", AllowActivePose: ["Kneel"] },
			{ Name: "HempRope", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 15, DefaultColor: "#956B1C", BuyGroup: "HempRope", HideItem: ["ItemDevicesTeddyBear", "ItemDevicesLittleMonster", "ItemDevicesFamiliar"], SetPose: ["LegsClosed"], AllowBlock: ["ItemLegs", "ItemBoots", "ItemDevices"], AllowType: ["Mermaid", "Suspension", "FullBinding", "Diamond", "Link", "BedSpreadEagle"], Audio: "RopeShort", Extended: true, AllowActivePose: ["Kneel"], DynamicBeforeDraw: true },
			{ Name: "LeatherBelt", Fetish: ["Leather"], Value: 25, Time: 10, RemoveTime: 5, AllowLock: true, SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"] },
			{ Name: "SturdyLeatherBelts", Fetish: ["Leather"], Value: 50, Time: 10, RemoveTime: 5, AllowLock: true, BuyGroup: "SturdyLeatherBelts", SetPose: ["LegsClosed"], AllowType: ["Two", "Three"], Extended: true, AllowActivePose: ["Kneel"] },
			{ Name: "Irish8Cuffs", Fetish: ["Metal"], Value: 25, Time: 10, RemoveTime: 5, AllowLock: true, Audio: "CuffsMetal", SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"] },
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape", Audio: "DuctTape", HideItem: ["ItemBootsThighHighLatexHeels"], SetPose: ["LegsClosed"], AllowType: ["HalfFeet", "MostFeet", "CompleteFeet"], Extended: true, AllowActivePose: ["Kneel"] },
			{ Name: "LeatherAnkleCuffs", Fetish: ["Leather"], Priority: 24, Value: 30, Difficulty: 2, Time: 10, Random: false, AllowLock: true, AllowPose: ["LegsClosed", "Spread"], Effect: ["CuffedFeet"], AllowEffect: ["Freeze", "Prone"], Extended: true, AllowActivePose: ["Kneel"], AllowType: ["Closed"], HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }], FreezeActivePose: [],
				DefaultColor: ["#2E2E2E", "Default"],
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Rings" }
				]
			},
			{
				Name: "FloorShackles", Fetish: ["Metal"], Priority: 24, Left: 0, Value: 20, Difficulty: 6, Time: 10, AllowLock: true, Prerequisite: ["NoItemLegs", "LegsOpen"], SetPose: ["Spread"], AllowPose: ["Spread"], Effect: ["Freeze", "Prone", "BlockKneel"], Block: ["ItemLegs", "ItemBoots", "ItemDevices"], AllowActivityOn: ["ItemLegs", "ItemBoots"],
				Layer: [
					{ Name: "Chain", Priority: 6 },
					{ Name: "Cuffs" }
				]
			},
			{ Name: "FuturisticAnkleCuffs", Category: ["SciFi"], Fetish: ["Metal"], DefaultColor: ["#40812C", "#707070"], Audio: "FuturisticApply", Priority: 24, Value: 45, Difficulty: 4, Time: 10, Random: false, AllowLock: true, DrawLocks: false, AllowPose: ["LegsClosed", "Spread"], Effect: ["CuffedFeet"], AllowEffect: ["Freeze", "Prone"], Extended: true, AllowActivePose: ["Kneel"], AllowType: ["Closed"], HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }], FreezeActivePose: [],
				Layer: [
					{ Name: "Display", ParentGroup: null},
					{ Name: "Cuffs" },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "OrnateAnkleCuffs", Fetish: ["Metal"], Priority: 24, Value: 90, Difficulty: 3, Time: 10, Random: false, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["LegsClosed", "Spread"], Effect: ["CuffedFeet"], AllowEffect: ["Freeze", "Prone"], Extended: true, AllowActivePose: ["Kneel"], AllowType: ["Closed"], HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }], FreezeActivePose: [],
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Gems" }
				]
			},
			{ Name: "SpreaderMetal", Fetish: ["Metal"], Value: 50, Difficulty: 3, Time: 10, Random: false, AllowLock: true, AllowType: ["Wide"], Prerequisite: ["NotKneeling"], Block: ["ItemLegs"], AllowActivityOn: ["ItemLegs"], Extended: true, RemoveAtLogin: true },
			{ Name: "BallChain", Fetish: ["Metal"], Value: 40, Difficulty: 5, Time: 10, RemoveTime: 10, Random: false, AllowLock: true, AllowPose: ["LegsClosed"], Effect: ["Slow"], FreezeActivePose: [] },
			{ Name: "AnkleShackles", Fetish: ["Metal"], Value: 30, Difficulty: 6, Time: 10, RemoveTime: 5, Random: false, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["LegsClosed"], Effect: ["Prone","Slow"], FreezeActivePose: [] },
			{ Name: "PlasticWrap", Value: 100, Difficulty: 7, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", SetPose: ["LegsClosed"]},
			{ Name: "Zipties", Value: 20, Difficulty: 6, Time: 5, RemoveTime: 6, BuyGroup: "Zipties", SetPose: ["LegsClosed"], Audio: "ZipTie", Extended: true, AllowType: ["ZipFeetMedium", "ZipFeetFull"], AllowActivePose: ["Kneel"] },
			{ Name: "Chains", Fetish: ["Metal"], Value: 90, Difficulty: 5, Time: 20, AllowLock: true, BuyGroup: "Chains", Audio: "ChainLong", SetPose: ["LegsClosed"], AllowType: ["Strict", "Suspension"], Extended: true, AllowActivePose: ["Kneel"] },
			{
				Name: "SpreaderDildoBar", Fetish: ["Metal", "Leather"], Priority: 25, Value: 60, Difficulty: 5, Time: 10, Random: false, AllowLock: true, Top: 400, Prerequisite: ["AccessVulva", "LegsOpen", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste"], SetPose: ["LegsOpen"], Effect: ["FillVulva", "Freeze", "Prone", "BlockKneel"], Block: ["ItemPelvis", "ItemLegs", "ItemVulva"], AllowActivityOn: ["ItemPelvis", "ItemLegs"],
				Layer: [
					{ Name: "DildoBar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				], RemoveAtLogin: true
			},
			{
				Name: "SpreaderVibratingDildoBar", Fetish: ["Metal", "Leather"], Priority: 25, Value: 70, Difficulty: 5, Time: 10, Random: false, AllowLock: true, Top: 400, Prerequisite: ["AccessVulva", "LegsOpen", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste"], SetPose: ["LegsOpen"], Effect: ["FillVulva", "Egged", "Freeze", "Prone", "BlockKneel"], AllowEffect: ["Egged", "Vibrating"], Block: ["ItemPelvis", "ItemLegs", "ItemVulva"], AllowActivityOn: ["ItemPelvis", "ItemLegs"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true,
				Layer: [
					{ Name: "DildoBar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				], RemoveAtLogin: true, ArousalZone: "ItemVulva"
			},
			{ Name: "WoodenCuffs", Priority: 24, Value: 30, Difficulty: 2, Time: 5, Random: false, Left: 74, AllowLock: true, Audio: "WoodenCuffs", BuyGroup: "WoodenCuffs", Prerequisite: ["LegsOpen", "NotKneeling"], SetPose: ["LegsOpen"], Effect: ["Freeze", "Prone"], Block: ["ItemLegs"], AllowActivityOn: ["ItemLegs"], RemoveAtLogin: false },
			{
				Name: "MedicalBedRestraints", Value: -1, Difficulty: 5, Time: 5, Random: false, RemoveTime: 5, DefaultColor: "#ccc", AllowLock: true, BuyGroup: "MedicalBedRestraints", Left: 0, Top: 0,
				Prerequisite: ["OnBed", "LegsOpen"], SetPose: ["LegsOpen"], Effect: ["Prone", "BlockKneel"], Block: ["ItemDevices"], AvailableLocations: ["Asylum"],
				HideItem: ["ClothLowerGown2Skirt", "ClothLowerPajama1"],
				Layer: [
					{ Name: "Base", Priority: 1, ParentGroup: null },
					{ Name: "Straps"}
				],
			},
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemLegs",
		ParentGroup: "BodyLower",
		Category: "Item",
		Priority: 25,
		Default: false,
		IsRestraint: true,
		Left: 125,
		Top: 400,
		AllowPose: ["Kneel"],
		Effect: ["Prone", "KneelFreeze", "Slow"],
		FreezeActivePose: ["BodyLower"],
		Zone: [[100, 580, 300, 170]],
		Activity: ["Bite", "Kiss", "Lick", "Nibble", "Tickle", "Spank", "Caress", "MassageHands", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem", "ShockItem", "StruggleLegs", "Wiggle", "Sit"],
		Asset: [
			{ Name: "NylonRope", Fetish: ["Rope", "Nylon"], Value: 30, Time: 10, DefaultColor: "#909090", BuyGroup: "NylonRope", Audio: "RopeShort", SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"] },
			{ Name: "HempRope", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 10, RemoveTime: 15, DefaultColor: "#956B1C", BuyGroup: "HempRope", SetPose: ["LegsClosed"], AllowBlock: ["ItemFeet"], AllowEffect: ["ForceKneel"], AllowType: ["Mermaid", "FullBinding", "Frogtie", "Link", "Crossed"], Extended: true, AllowActivePose: ["Kneel"] },
			{ Name: "LeatherBelt", Fetish: ["Leather"], Value: 25, Time: 5, AllowLock: true, SetPose: ["LegsClosed"], AllowActivePose: ["Kneel"] },
			{ Name: "SturdyLeatherBelts", Fetish: ["Leather"], Value: 50, Time: 5, AllowLock: true, BuyGroup: "SturdyLeatherBelts", SetPose: ["LegsClosed"], AllowType: ["Two"], Extended: true, AllowActivePose: ["Kneel"] },
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape", Audio: "DuctTape", HideItem: ["ItemBootsThighHighLatexHeels", "ShoesThighHighLatexHeels"], SetPose: ["LegsClosed"], AllowType: ["HalfLegs", "MostLegs", "CompleteLegs"], Extended: true, AllowActivePose: ["Kneel"] },
			{ Name: "LeatherLegCuffs", Fetish: ["Leather"], Priority: 24, Value: 45, Difficulty: 4, Time: 10, Random: false, AllowLock: true, AllowPose: ["Kneel", "LegsClosed"], Effect: [], AllowEffect: ["Prone", "KneelFreeze", "Slow"], AllowType: ["Closed"], Extended: true, AllowActivePose: ["Kneel"], FreezeActivePose: [], HasType: false,
				DefaultColor: ["#2E2E2E", "Default"],
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Rings" }
				]
			},
			{ Name: "FuturisticLegCuffs",  Category: ["SciFi"], Fetish: ["Metal"], DefaultColor: ["#40812C", "#707070"], Audio: "FuturisticApply", Priority: 24, Value: 30, Difficulty: 2, Time: 10, Random: false, AllowLock: true, DrawLocks: false, AllowPose: ["Kneel", "LegsClosed"], Effect: [], AllowEffect: ["Prone", "KneelFreeze", "Slow"], AllowType: ["Closed"], Extended: true, AllowActivePose: ["Kneel"], FreezeActivePose: [], HasType: false,
				Layer: [
					{ Name: "Display", ParentGroup: null},
					{ Name: "Cuffs" },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, ParentGroup: null},
				]
			},
			{
				Name: "OrnateLegCuffs", Fetish: ["Metal"], Priority: 24, Value: 90, Difficulty: 3, Time: 10, Random: false, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["Kneel", "LegsClosed"], Effect: [], AllowEffect: ["Prone", "KneelFreeze", "Slow"], AllowType: ["Closed"], Extended: true, AllowActivePose: ["Kneel"], FreezeActivePose: [], HasType: false,
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Gems" }
				]
			},
			{
				Name: "LegBinder", Fetish: ["Latex"], Value: 80, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: ["#222", "Default"], Prerequisite: ["NotSuspended", "NotHogtied"], Hide: ["Shoes", "Socks", "ClothLower"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemBootsThighHighLatexHeels"], SetPose: ["LegsClosed"], Effect: ["Prone", "Slow"], Block: ["ItemFeet"], AllowActivePose: ["Kneel"],
				Layer: [
					{ Name: "Latex" },
					{ Name: "Belts" },
				]
			},
			{
				Name: "HobbleSkirt", Fetish: ["Latex"], Value: 125, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: ["#222", "Default"], Prerequisite: ["NotSuspended", "NotHogtied"], Hide: ["Shoes", "Socks", "ClothLower"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemBootsThighHighLatexHeels"], SetPose: ["LegsClosed"], Effect: ["Prone", "Slow"], Block: ["ItemPelvis", "ItemFeet", "ItemVulva", "ItemVulvaPiercings", "ItemButt"], AllowActivePose: ["Kneel"],
				Layer: [
					{ Name: "Latex" },
					{ Name: "Belts" }
				]
			},
			{ Name: "SeamlessLegBinder", Value: 80, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: "#222222", Prerequisite: ["NotSuspended", "NotHogtied"], Hide: ["Shoes"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemBootsThighHighLatexHeels", "ClothLowerPajama1", "SocksSocks6", "SocksSocksFur"], SetPose: ["LegsClosed"], Effect: ["Prone", "Slow"], Block: ["ItemFeet"], AllowActivePose: ["Kneel"] },
			{ Name: "SeamlessHobbleSkirt", Value: 125, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: "#222222", Prerequisite: ["NotSuspended", "NotHogtied"], Hide: ["Shoes"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemBootsThighHighLatexHeels", "ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerLatexPants1", "ClothLowerLeggings1", "ClothLowerLeggings2", "ClothLowerMistressBottom", "ClothLowerPencilSkirt", "SocksSocks6", "SocksSocksFur"], SetPose: ["LegsClosed"], Effect: ["Prone", "Slow"], Block: ["ItemPelvis", "ItemFeet", "ItemVulva", "ItemVulvaPiercings", "ItemButt"], AllowActivePose: ["Kneel"] },
			{
				Name: "WoodenHorse", Priority: 34, Value: 200, Difficulty: 2, Time: 10, Random: false, Prerequisite: ["NotKneeling", "LegsOpen", "NotSuspended", "NotHogtied", "NotShackled"], Hide: ["Shoes", "Socks", "ItemBoots"], HideItem: ["ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerGown2Skirt", "ClothLowerLatexPants1", "ClothLowerLeggings2", "ItemDevicesTeddyBear", "ItemDevicesLittleMonster", "ItemDevicesFamiliar", "SuitLowerReverseBunnySuit", "ClothLowerJeansShorts" ], SetPose: ["Horse"], Effect: ["Prone", "Freeze", "Mounted"], Alpha: [{ Masks: [[160, 720, 200, 240]] }], Block: ["ItemFeet", "ItemBoots"], AllowActivityOn: ["ItemFeet", "ItemBoots"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Frame" },
					{ Name: "Wood" }
				]
			},
			{ Name: "Zipties", Value: 20, Difficulty: 6, Time: 5, RemoveTime: 6, BuyGroup: "Zipties", Audio: "ZipTie", SetPose: ["LegsClosed"], Extended: true, AllowBlock: ["ItemFeet"], AllowEffect: ["ForceKneel"], AllowType: ["ZipLegMedium", "ZipLegFull", "ZipFrogtie"] },
			{ Name: "Chains", Fetish: ["Metal"], Value: 90, Difficulty: 5, Time: 20, RemoveTime: 15, AllowLock: true, BuyGroup: "Chains", Audio: "ChainLong", SetPose: ["LegsClosed"], AllowType: ["Strict"], Extended: true, AllowActivePose: ["Kneel"] },
			{ Name: "PlasticWrap", Value: 100, Difficulty: 7, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", SetPose: ["LegsClosed"], Hide: ["ClothLower"]},
			{ Name: "FrogtieStraps", Fetish: ["Leather"], Value: 25, Time: 5, Random: false, AllowLock: true, Prerequisite: ["NotSuspended", "CanKneel"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Slow"] },
			{
				Name: "MermaidTail",
				Value: 120, Left: 0, Top: 380, Difficulty: 5, Time: 30, RemoveTime: 20, Random: false, AllowLock: true, DefaultColor: "#0D7800", ArousalZone: "ItemVulva", DynamicScriptDraw: true,
				Fetish: ["Latex", "Pet"],
				Prerequisite: ["NotSuspended", "NotHogtied", "AccessVulva", "AccessVulvaSuitZip","NotKneeling", "NoOuterClothes", "NotChaste"],
				Hide: ["Shoes", "Socks", "BodyLower", "ClothLower", "ItemFeet", "ItemBoots"],
				SetPose: ["LegsClosed"],
				Effect: ["Prone", "Freeze", "FillVulva", "Egged","BlockKneel"],
				AllowEffect: ["Egged", "Vibrating", "FillVulva", "Edged"],
				AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "TapedHands", "Yoked", "OverTheHead"],
				Block: ["ItemFeet", "ItemBoots", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
			},
			{
				Name: "MedicalBedRestraints", Value: -1, Difficulty: 5, Time: 5, RemoveTime: 5, Random: false, DefaultColor: "#ccc", AllowLock: true, BuyGroup: "MedicalBedRestraints", Left: 0, Top: 0,
				Prerequisite: ["OnBed", "LegsOpen"], SetPose: ["LegsOpen"], Effect: ["Prone", "BlockKneel"], Block: ["ItemDevices"], AvailableLocations: ["Asylum"],
				HideItem: ["ClothBondageDress1", "ClothBondageDress2", "ClothBridesmaidDress1", "ClothDress3", "ClothGown3", "ClothWeddingDress1", "ClothWeddingDress2", "ClothLowerWaspie1", "ClothLowerGown2Skirt", "ClothLowerPajama1", "ClothLowerClothSkirt1", "ClothLowerPencilSkirt", "ClothLowerWaspie2", "ClothLowerWaspie3"],
				Layer: [
					{ Name: "Base", Priority: 1, ParentGroup: null },
					{ Name: "Straps", Priority: 26 },
				],
			},
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemVulva",
		Category: "Item",
		Priority: 15,
		Default: false,
		Left: 125,
		Top: 400,
		AllowPose: ["Kneel"],
		Zone: [[100, 500, 100, 80]],
		Activity: ["MasturbateHand", "MasturbateFist", "MasturbateFoot", "MasturbateTongue", "Caress", "Slap", "Kiss", "Lick", "Nibble", "SpankItem", "TickleItem", "RubItem", "ShockItem", "MasturbateItem", "PenetrateSlow", "PenetrateFast"],
		Asset: [
			{ Name: "VibratingEgg", Value: 25, Time: 5, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating", "Edged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true },
			{ Name: "VibratingWand", Value: 60, Visible: false, Wear: false, Activity: "MasturbateItem", Audio: "Wand", ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "VibratorRemote", Value: 50, Visible: false, Wear: false, BuyGroup: "VibratorRemote", Prerequisite: ["RemotesAllowed"], Effect: ["Remote"] },
			{ Name: "VibratingLatexPanties", Fetish: ["Latex"], Value: 50, Time: 10, AllowLock: true, DefaultColor: "#60A0AF", Prerequisite: ["AccessVulva", "CannotHaveWand"], Effect: ["Egged", "Chaste"], AllowEffect: ["Egged", "Vibrating", "Edged"], Block: ["ItemButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true },
			{
				Name: "WandBelt", Priority: 24, Value: 80, Time: 15, AllowLock: true, DefaultColor: ["#baa", "Default"], Prerequisite: ["CannotHaveWand"], HideItem: ["ClothLowerPajama1", "ClothLowerMistressBottom"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating", "Edged"], Block: ["ItemPelvis"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true,
				Layer: [
					{ Name: "Belt" },
					{ Name: "Wand" }
				]
			},
			{
				Name: "PenisDildo", Priority: 11, Value: 20, Time: 10, BuyGroup: "PenisDildo", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["FillVulva"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{
				Name: "ShockDildo", Fetish: ["Masochism"], Priority: 11, Value: 70, Time: 10, Extended: true, AlwaysExtend: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["FillVulva"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], Activity: "ShockItem",
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{
				Name: "VibratingDildo", Priority: 11, DefaultColor: "#ED4BEE", Value: 60, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged", "FillVulva"], AllowEffect: ["Egged", "Vibrating", "FillVulva", "Edged"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true,
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "End", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{
				Name: "FuturisticVibrator",  DefaultColor: ["#3C724C", "Default"], Value: 70, Difficulty: 3, AllowLock: true, DrawLocks: false, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged", "FillVulva"], AllowEffect: ["Egged", "Vibrating", "FillVulva", "Edged"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], AllowType: ["TriggerValue"], DynamicScriptDraw: true,
				Layer: [
					{ Name: "Display", AllowColorize: true },
					{ Name: "Band", AllowColorize: true },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "InflatableVibeDildo", Priority: 11, Value: 100, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged", "FillVulva"], AllowEffect: ["Egged", "Vibrating", "FillVulva", "Edged"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{
				Name: "ClitoralStimulator", Priority: 11, Value: 70, Time: 10, DefaultColor: "#8a00d1", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating", "Edged"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true,
				Layer: [
					{ Name: "Stimulator", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{ Name: "ClitSuctionCup", Priority: 11, Value: 25, Time: 10, Prerequisite: "AccessVulva", AllowType: ["Light", "Medium", "Heavy", "Maximum"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true, HasType: false },
			{ Name: "TapeStrips", Fetish: ["Tape"], Value: 10, Time: 5, Prerequisite: "AccessVulva", ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "BenWaBalls", Fetish: ["Metal"], Value: 30, Time: 5, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "HeavyWeightClamp", Fetish: ["Metal", "Masochism"], Value: 30, Time: 5, Prerequisite: "AccessVulva", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "FullLatexSuitWand", Fetish: ["Latex"], Priority: 34, Value: -1, Difficulty: 12, Time: 5, IsRestraint: true, AllowLock: true, Effect: ["Egged", "Block", "Prone"], AllowEffect: ["Egged", "Vibrating", "Edged"], Block: ["ItemVulvaPiercings"], DynamicScriptDraw: true },
			{
				Name: "ClitAndDildoVibratorbelt", Fetish: ["Leather"], Priority: 11, Value: 100, Time: 10, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Hide: ["Panties"], Effect: ["Egged", "FillVulva"], AllowEffect: ["Egged", "Vibrating", "FillVulva", "Edged"], Block: ["ItemPelvis"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Belt", AllowColorize: true },
					{ Name: "Crotch", AllowColorize: false }
				]
			},
			{
				Name: "HempRopeBelt", Fetish: ["Rope"], Value: 60, Time: 24, DefaultColor: ["#956B1C", "Default"], BuyGroup: "HempRope", Audio: "RopeShort", Prerequisite: ["CannotHaveWand"], HideItem: ["ClothLowerPajama1", "ClothLowerMistressBottom"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating", "Edged"], Block: ["ItemPelvis"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true,
				Layer: [
					{ Name: "Rope" },
					{ Name: "Wand" }
				]
			},
			{
				Name: "WiredEgg", ParentGroup: "BodyLower", Value: 30, Time: 5, Prerequisite: "AccessVulva", AllowPose: ["Kneel", "LegsClosed"], Effect: ["Egged"], DynamicScriptDraw: true,
				Layer: [
					{ Name: "Remote" },
					{ Name: "Strap" }
				]
			},
			{ Name: "LoversVibrator", Value: 75, Time: 5, LoverOnly: true, DefaultColor: "#790c0c", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged", "FillVulva"], AllowEffect: ["Egged", "Vibrating", "Edged", "FillVulva"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], AllowRemoveExclusive: true, CharacterRestricted: true, DynamicScriptDraw: true},
			{ Name: "LoversVibratorRemote", Value: 75, Wear: false, LoverOnly: true, BuyGroup: "LoversVibratorRemote", Prerequisite: ["RemotesAllowed"], Effect: ["Remote"] },
			{ Name: "DoubleEndDildo", Value: 15, Time: 10, Effect: ["FillVulva"], Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 20 }], AllowActivity: ["Penetrate"] },
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemVulvaPiercings",
		Category: "Item",
		Priority: 13,
		Default: false,
		Left: 125,
		Top: 400,
		AllowPose: ["Kneel"],
		Zone: [[200, 500, 100, 80]],
		Asset: [
			{ Name: "StraightClitPiercing", Fetish: ["Metal"], Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "RoundClitPiercing", Fetish: ["Metal"], Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "WeightedClitPiercing", Fetish: ["Metal", "Masochism"], Value: 30, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "BarbellClitPiercing", Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChastityClitPiercing", Fetish: ["Metal"], Value: 50, Difficulty: 50, Time: 20, RemoveTime: 20, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"], Effect: ["Chaste"], Block: ["ItemVulva"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChastityClitShield", Fetish: ["Metal"], Value: 70, Difficulty: 50, Time: 30, RemoveTime: 30, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"], Effect: ["Chaste"], Block: ["ItemVulva"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "HighSecurityVulvaShield", Fetish: ["Metal"], Value: 100, Difficulty: 99, Time: 60, RemoveTime: 200, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"], Effect: ["Chaste"], Block: ["ItemVulva"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "JewelClitPiercing", Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "AdornedClitPiercing", Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{
				Name: "VibeHeartClitPiercing", Value: 35, Difficulty: 10, Time: 5, AllowLock: true, BuyGroup: "VibeHeart", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating", "Edged"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], ArousalZone: "ItemVulva", DynamicScriptDraw: true,
				Layer: [
					{ Name: "Heart" },
					{ Name: "Ring" }
				]
			},
			{ Name: "ClitRing", Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 15, Random: false, AllowLock: true, Left: 50, AllowEffect: ["Leash"], AllowType: ["Leash"], Extended: true },
			{ Name: "BellClitPiercing", Fetish: ["Metal"], Value: 30, Difficulty: 10, Time: 5, AllowLock: true, Audio: "BellSmall", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "TapedClitEgg", Fetish: ["Tape"], Value: 25, Time: 5, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating", "Edged"], ArousalZone: "ItemVulva", ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true }
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemButt",
		Category: "Item",
		Priority: 4,
		Default: false,
		Left: 0,
		Top: 0,
		Effect: ["IsPlugged"],
		Zone: [[300, 500, 100, 80]],
		Activity: ["Bite", "Kiss", "MasturbateHand", "MasturbateFist", "MasturbateTongue", "Spank", "Caress", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem", "ShockItem", "PenetrateSlow", "PenetrateFast", "Wiggle"],
		Asset: [
			{ Name: "BlackButtPlug", Value: 15, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "PenisPlug", Value: 20, Time: 10, Visible: false, BuyGroup: "PenisDildo", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{
				Name: "TailButtPlug", Fetish: ["Pet"], Value: 40, Time: 10, Top: 100, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Layer: [
					{ Name: "Tail" },
					{ Name: "Ribbon" },
					{ Name: "Bell" },
				]
			},
			{ Name: "HorsetailPlug", Fetish: ["Pony"], Value: 30, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "HorsetailPlug1", Fetish: ["Pony"], Value: 40, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "PuppyTailPlug", Fetish: ["Pet"], Value: 25, Time: 10, Top: 20, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "PuppyTailPlug1", Fetish: ["Pet"], Value: 30, Time: 10, Top: 30, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "SuccubusButtPlug", Fetish: ["Pet"], Value: 15, Time: 10, Top: 65, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "SuccubusHeartButtPlug", Fetish: ["Pet"], Value: 25, Time: 10, Top: 60, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Tail" },
					{ Name: "Heart" },
				]
			},
			{
				Name: "FoxTails", Fetish: ["Pet"], Priority: 2, Value: 60, Time: 10, Top: 20, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Layer: [
					{ Name: "Tips" },
					{ Name: "Bases" }
				]
			},
			{ Name: "RaccoonButtPlug", Fetish: ["Pet"], Value: 40, Time: 10, Top: 20, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "RaccoonTailPlug", Fetish: ["Pet"], Priority: 2, Value: 50, Time: 10, Top: 30, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "AnalBeads", Value: 20, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "AnalBeads2", Fetish: ["Metal"],  Value: 70, Time: 14, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowType: ["Base", "_2in", "_3in", "_4in", "_5in"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Extended: true, Activity: "MasturbateItem" },
			{ Name: "ButtPump", Value: 35, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowType: ["Light", "Inflated", "Bloated", "Maximum"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Extended: true },
			{ Name: "VibratingButtplug", Value: 60, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["IsPlugged", "Egged"], AllowEffect: ["IsPlugged", "Egged", "Vibrating", "Edged"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], DynamicScriptDraw: true },
			{ Name: "InflVibeButtPlug", Value: 90, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["IsPlugged", "Egged"], AllowEffect: ["IsPlugged", "Egged", "Vibrating", "Edged"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }] },
			{ Name: "AnalHook", Fetish: ["Metal"], Value: 20, Time: 10, IsRestraint: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["IsPlugged"], AllowEffect: ["Freeze", "Egged"], AllowType: ["Chain", "Hair"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], Extended: true },
			{ Name: "ButtPlugLock", Fetish: ["Metal"], Value: 75, Difficulty: 50, Time: 30, RemoveTime: 50, IsRestraint: true, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], AllowEffect: ["IsPlugged", "Tethered", "Freeze", "ForceKneel", "IsChained"], AllowType: ["ChainShort", "ChainLong"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 10 }, { Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }], Extended: true },
			{ Name: "KittenTail1", Fetish: ["Pet"], Value: 30, Time: 10, Top: 100, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "KittenTail2", Fetish: ["Pet"], Value: 30, Time: 10, Top: 30, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "FoxTail1", Fetish: ["Pet"], Value: 50, Time: 10, Top: 80, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Base" },
					{ Name: "Tip" },
				]
			},
			{ Name: "FoxTail2", Fetish: ["Pet"], Value: 50, Time: 10, Top: 100, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Base" },
					{ Name: "Tip" },
				]
			},
			{ Name: "WolfTail1", Fetish: ["Pet"], Value: 35, Time: 10, Top: 50, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "WolfTail2", Fetish: ["Pet"], Value: 35, Time: 10, Top: 60, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "WolfTail3", Fetish: ["Pet"], Value: 35, Time: 10, Top: 40, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "DemonPlug", Fetish: ["Pet"], Value: 35, Time: 10, Top: 70, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "MouseTail1", Fetish: ["Pet"], Value: 35, Time: 10, Top: 150, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "MouseTail2", Fetish: ["Pet"], Value: 35, Time: 10, Top: 180, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "VibratingDildoPlug", Value: 60, Time: 10, Visible: false, BuyGroup: "VibratingDildo", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["IsPlugged", "Egged"], AllowEffect: ["IsPlugged", "Egged", "Vibrating", "Edged"], DynamicScriptDraw: true },
			{ Name: "BunnyTailPlug1", Fetish: ["Pet"], Value: 1, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "BunnyTailPlug2", Fetish: ["Pet"], Value: 1, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "BunnyTailVibePlug", Fetish: ["Pet"], Effect: ["IsPlugged", "Egged"], Value: 75, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }], AllowEffect: ["Egged", "Vibrating", "Edged"], Visible: false, DynamicScriptDraw: true },
			{ Name: "EggVibePlugXXL", Effect: ["IsPlugged", "Egged"], Value: 90, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 10 }], AllowEffect: ["Egged", "Vibrating", "Edged"], Visible: false, DynamicScriptDraw: true },
			{ Name: "LockingVibePlug", Effect: ["IsPlugged", "Egged"], Value: 80, Difficulty: 30, Time: 30, RemoveTime: 50, IsRestraint: true, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 10 }], AllowEffect: ["Egged", "Vibrating", "Edged"], Visible: false, DynamicScriptDraw: true },
			{ Name: "ShockPlug", Fetish: ["Masochism"], Value: 60, Time: 10, Visible: false, Extended: true, AlwaysExtend: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Activity: "ShockItem" },
			{ Name: "Cowtail", Fetish: ["Pet"], BuyGroup: "CowTails", Value: 20, Time: 10, Top: 80, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "HollowButtPlug", Value: 15, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemPelvis",
		ParentGroup: "BodyLower",
		Category: "Item",
		Priority: 16,
		Default: false,
		Left: 125,
		Top: 375,
		Zone: [[100, 420, 300, 80]],
		Activity: ["Kiss", "Lick", "Nibble", "Tickle", "Spank", "Caress", "Pinch", "MassageHands", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem", "ShockItem", "Wiggle", "Step"],
		RemoveItemOnRemove: [
			{ Group: "ItemAddon", Name: "CeilingRope" },
			{ Group: "ItemAddon", Name: "CeilingChain" },
		],
		Asset: [
			{ Name: "StraponPanties", Fetish: ["Latex"], Value: -1, Time: 15, DefaultColor: "#505050", Prerequisite: "AccessVulva", AllowActivity: ["Penetrate"], Bonus: "KidnapBruteForce", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"] },
			{ Name: "LeatherChastityBelt", Fetish: ["Leather"], Value: 30, Difficulty: 8, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "SleekLeatherChastityBelt", Fetish: ["Leather"], Value: 45, Difficulty: 11, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "StuddedChastityBelt", Fetish: ["Leather", "Metal"], Value: 60, Difficulty: 14, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], AllowBlock: ["ItemButt"], AllowType: ["ClosedBack"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false },
			{ Name: "MetalChastityBelt", Fetish: ["Metal"], Value: 100, Difficulty: 20, Time: 20, RemoveTime: 10, AllowLock: true, Audio: "CuffsMetal", Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], AllowBlock: ["ItemButt"], AllowType: ["ClosedBack"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false },
			{ Name: "PolishedChastityBelt", Fetish: ["Metal"], Value: 150, Difficulty: 30, Time: 20, RemoveTime: 10, AllowLock: true, Audio: "CuffsMetal", Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], AllowBlock: ["ItemButt"], AllowType: ["ClosedBack"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false },
			{ Name: "FuturisticChastityBelt", Category: ["SciFi"], Fetish: ["Metal"], Value: 170, BuyGroup: "FuturisticChastityBelt", Difficulty: 50, Time: 15, RemoveTime: 12, Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#93C48C", "#3B7F2C", "Default"], Audio: "FuturisticApply", Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], AllowBlock: ["ItemVulvaPiercings", "ItemButt", "ItemVulva"], AllowType: ["ClosedBack","OpenFront", "ChatMessage", "PunishOrgasm", "PunishStruggle", "PunishStrugleOther"], Block: [], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false, AlwaysExtend: true, DynamicScriptDraw: true,
				Layer: [
					{ Name: "Mesh", AllowColorize: true , ParentGroup: null},
					{ Name: "Screen", AllowColorize: true , ParentGroup: null},
					{ Name: "Belt", AllowColorize: true , ParentGroup: null},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{ Name: "FuturisticChastityBelt2", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 50, Time: 15, RemoveTime: 12, BuyGroup: "FuturisticChastityBelt", Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#93C48C", "#3B7F2C", "Default", "Default", "Default"], Audio: "FuturisticApply", Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], AllowBlock: ["ItemVulvaPiercings", "ItemButt", "ItemVulva"], AllowType: ["ClosedBack","OpenFront", "ChatMessage", "PunishOrgasm", "PunishStruggle", "PunishStrugleOther"], Block: [], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false, AlwaysExtend: true, DynamicScriptDraw: true,
				Layer: [
					{ Name: "Mesh", AllowColorize: true},
					{ Name: "Screen", AllowColorize: true , ParentGroup: null},
					{ Name: "Band", AllowColorize: true},
					{ Name: "Belt", AllowColorize: true},
					{ Name: "Plug", AllowColorize: true},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{ Name: "SciFiPleasurePanties", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 50, Time: 15, RemoveTime: 12, BuyGroup: "FuturisticChastityBelt", Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#592599", "#202020", "#592599", "#202020", "#7631cc", "#7631cc"], Audio: "FuturisticApply", Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste", "Egged"], AllowBlock: ["ItemVulvaPiercings", "ItemButt", "ItemVulva"], ArousalZone: "ItemVulva", AllowEffect: ["Egged", "Vibrating", "DenialMode"], Block: [], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false, AlwaysExtend: true,
				Layer: [
					{ Name: "Screen", AllowColorize: true, ParentGroup: null},
					{ Name: "Mesh2", AllowColorize: true},
					{ Name: "Mesh1", AllowColorize: true},
					{ Name: "Band", AllowColorize: true, ParentGroup: null},
					{ Name: "Plug2", AllowColorize: true, ParentGroup: null},
					{ Name: "Plug1", AllowColorize: true, ParentGroup: null},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "OrnateChastityBelt", Fetish: ["Metal"], Value: 200, Difficulty: 50, Time: 20, RemoveTime: 10, AllowLock: true, Audio: "CuffsMetal", Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], AllowBlock: ["ItemButt"], AllowType: ["ClosedBack"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false,
				Layer: [
					{ Name: "Belt" },
					{ Name: "Gems" }
				]
			},
			{ Name: "SteelChastityPanties", Fetish: ["Metal"], Value: 150, Difficulty: 50, Time: 50, RemoveTime: 60, AllowLock: true, Audio: "CuffsMetal", Prerequisite: "AccessVulva", Hide: ["ItemVulva", "ItemVulvaPiercings"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "HarnessPanties1", Fetish: ["Leather"], Priority: 19, Value: 35, Difficulty: 8, Time: 10, RemoveTime: 15, AllowLock: true, BuyGroup: "HarnessPanties1", Prerequisite: "AccessVulva", AllowPose: ["LegsClosed", "Kneel"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "HarnessPanties2", Fetish: ["Leather"], Priority: 19, Value: 40, Difficulty: 9, Time: 10, RemoveTime: 15, AllowLock: true, Left: 85, Top: 395, BuyGroup: "HarnessPanties2", Prerequisite: "AccessVulva", AllowPose: ["LegsClosed", "Kneel", "Horse", "KneelingSpread", "Spread"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], DrawLocks: false },
			{ Name: "LeatherStrapPanties1", Fetish: ["Leather"], Value: 20, Difficulty: 5, Time: 20, RemoveTime: 10, AllowLock: true, Left: 150, Top: 395, BuyGroup: "LeatherStrapPanties1", Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo", "ItemVulvaPiercingsVibeHeartClitPiercing", "ItemVulvaPiercingsClitRing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{
				Name: "LoveChastityBelt", Fetish: ["Metal"], Value: 250, Difficulty: 50, Time: 20, RemoveTime: 10, OwnerOnly: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaShockDildo"],
				Effect: ["Lock"], AllowBlock: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ArousalZone: "ItemVulva",
				Audio: "CuffsMetal",
				AllowEffect: ["Chaste", "Egged", "Vibrating"],
				AllowType: ["Open", "Closed", "Vibe", "Shock"],
				DynamicExpressionTrigger: C => {
					if (InventoryItemPelvisLoveChastityBeltLastAction == "Open") {
						return [{ Name: "Low", Group: "Blush", Timer: 10 }];
					} else if (InventoryItemPelvisLoveChastityBeltLastAction == "Closed") {
						return [{ Name: "Medium", Group: "Blush", Timer: 10 }];
					} else if (InventoryItemPelvisLoveChastityBeltLastAction == "Vibe") {
						return [{ Name: "Medium", Group: "Blush", Timer: 10 }];
					} else if (InventoryItemPelvisLoveChastityBeltLastAction == "Shock") {
						return [{ Name: "Medium", Group: "Blush", Timer: 10 }];
					} else if (InventoryItemPelvisLoveChastityBeltLastAction == "ShockTriggered") {
						var belt = InventoryGet(CharacterGetCurrent(), "ItemPelvis");
						var intensity = belt && belt.Property && belt.Property.Intensity;
						if (intensity == 0) {
							return [{ Name: "Low", Group: "Blush", Timer: 10 }];
						} else if (intensity == 1) {
							return [{ Name: "Medium", Group: "Blush", Timer: 10 }];
						} else if (intensity == 2) {
							return [{ Name: "High", Group: "Blush", Timer: 10 }];
						} else {
							return null;
						}
					} else {
						return null;
					}
				},
				Extended: true,
				Layer: [
					{ Name: "Open", AllowColorize: true, AllowTypes: ["", "Open"], HasType: false },
					{ Name: "Closed", AllowColorize: true, CopyLayerColor: "Open", AllowTypes: ["Closed", "Vibe", "Shock"], HasType: false },
					{ Name: "Vibe", AllowColorize: false, AllowTypes: ["Vibe"], HasType: false, AllowPose: [] },
					{ Name: "Shock", AllowColorize: false, AllowTypes: ["Shock"], HasType: false, AllowPose: [] },
					{ Name: "Lock", AllowColorize: false, AllowTypes: ["", "Open", "Closed", "Vibe", "Shock"], HasType: false, AllowPose: [] },
					{ Name: "ShieldLock", AllowColorize: false, AllowTypes: ["Closed", "Vibe", "Shock"], HasType: false, AllowPose: [] },
				]
			},
			{ Name: "LeatherCrop", Value: 20, Wear: false, BuyGroup: "LeatherCrop", Activity: "SpankItem", Audio: "SmackSkin1", ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }, { Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "LeatherWhip", Value: 40, Wear: false, BuyGroup: "LeatherWhip", Activity: "SpankItem", Audio: "Whip2", ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }, { Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "HempRope", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 20, RemoveTime: 25, DefaultColor: "#956B1C", BuyGroup: "HempRope", Audio: "RopeShort", Prerequisite: "AccessTorso", AllowType: ["SwissSeat", "KikkouHip", "OverPanties"], AllowEffect: ["CrotchRope"], AllowPose: ["KneelingSpread", "Horse", "LegsClosed", "Kneel"], Extended: true },
			{ Name: "DiaperHarness", Category: ["ABDL"], Fetish: ["Leather", "ABDL"], Priority: 24, Value: 65, Difficulty: 50, Time: 25, RemoveTime: 30, AllowLock: true, Left: 150, Top: 395, Hide: ["ItemVulva", "ItemVulvaPiercings"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "PelvisChainLeash", Priority: 27, Fetish: ["Metal"], Value: 40, Difficulty: 5, Time: 20, RemoveTime: 25, AllowLock: true, Effect: ["Leash"] },
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemTorso",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 17,
		Default: false,
		Left: 125,
		Top: 200,
		AllowPose: ["Hogtied", "AllFours"],
		Zone: [[100, 340, 300, 80]],
		Activity: ["Bite", "Kiss", "Lick", "Nibble", "Tickle", "Spank", "Caress", "MassageHands", "MassageFeet", "Rub", "SpankItem", "TickleItem", "RubItem", "RollItem", "PourItem", "ShockItem", "Wiggle", "Step"],
		RemoveItemOnRemove: [
			{ Group: "ItemAddon", Name: "CeilingRope" },
			{ Group: "ItemAddon", Name: "CeilingChain" },
		],
		Asset: [
			{ Name: "NylonRopeHarness", Fetish: ["Rope", "Nylon"], Value: 30, Time: 20, DefaultColor: "#909090", BuyGroup: "NylonRope", Audio: "RopeShort", Prerequisite: "AccessTorso", AllowType: ["Harness", "Diamond", "Star", "Waist"], Extended: true, AllowEffect: ["CrotchRope"] },
			{ Name: "HempRopeHarness", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 20, RemoveTime: 25, DefaultColor: "#956B1C", BuyGroup: "HempRope", Audio: "RopeShort", Prerequisite: "AccessTorso", AllowType: ["Harness", "Diamond", "Star", "Waist"], AllowEffect: ["CrotchRope"], Extended: true },
			{ Name: "LeatherHarness", Fetish: ["Leather"], Value: 60, Difficulty: 50, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessTorso" },
			{ Name: "LeatherStrapHarness", Fetish: ["Leather"], Value: 50, Difficulty: 50, Time: 15, RemoveTime: 10, DefaultColor: "#101010", AllowLock: true, Prerequisite: "AccessTorso" },
			{ Name: "AdultBabyHarness", Category: ["ABDL"], Fetish: ["Leather", "ABDL"], Priority: 33, Value: 50, Difficulty: 3, Time: 15, RemoveTime: 10, HideItem: ["ItemNipplesLactationPump"], AllowLock: true, DefaultColor: "#aaaaaa", ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "HarnessBra1", Fetish: ["Leather"], Priority: 20, Value: 30, Difficulty: 8, Time: 15, RemoveTime: 10, HideItem: ["ItemNipplesLactationPump"], AllowLock: true, BuyGroup: "HarnessBra1", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra2", Fetish: ["Leather"], Priority: 20, Value: 40, Difficulty: 8, Time: 15, RemoveTime: 10, HideItem: ["ItemNipplesLactationPump"], AllowLock: true, BuyGroup: "HarnessBra2", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Corset2", Fetish: ["Lingerie"], Priority: 22, Value: 30, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, BuyGroup: "Corset2", Prerequisite: "AccessTorso", Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"], DynamicGroupName: "Corset" },
			{ Name: "FuturisticHarness", Fetish: ["Metal"], Category: ["SciFi"], Value: 30, Difficulty: 20, Time: 17, RemoveTime: 12, Audio: "FuturisticApply", DefaultColor: ["#50913C", "Default", "#889FA7"], AllowLock: true, DrawLocks: false, Prerequisite: "AccessTorso", HideForPose: ["AllFours"], Extended: true, AllowType: ["Upper", "Lower"],
				Layer:[
					{ Name: "Display", AllowColorize: true, ParentGroup: null, Priority: 15, AllowTypes: ["", "Lower"], HasType: false},
					{ Name: "Band", AllowColorize: true, Priority: 15 , AllowTypes: ["", "Lower"], HasType: false},
					{ Name: "Mesh", AllowColorize: true, ParentGroup: null, Priority: 15, AllowTypes: ["", "Lower"], HasType: false},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, ParentGroup: null, AllowTypes: ["", "Lower"], HasType: false},
					{ Name: "Display2", AllowColorize: true, CopyLayerColor: "Display", ParentGroup: null, AllowTypes: ["", "Upper"], HasType: false},
					{ Name: "Band2", AllowColorize: true, CopyLayerColor: "Band", AllowTypes: ["", "Upper"], HasType: false},
					{ Name: "Lock2", LockLayer: true, CopyLayerColor: "Lock", ParentGroup: null, AllowTypes: ["", "Upper"], HasType: false},
				]
			},
			{ Name: "Corset3", Fetish: ["Lingerie"], Priority: 22, Value: 25, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, BuyGroup: "Corset3", Prerequisite: "AccessTorso", Hide: ["ItemNipples", "ItemNipplesPiercings"], HideForPose: ["AllFours"], DynamicGroupName: "Corset" },
			{ Name: "Corset4", Fetish: ["Lingerie"], Priority: 22, Value: 15, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, BuyGroup: "Corset4", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["Hogtied", "AllFours"], DynamicGroupName: "Corset" },
			{ Name: "Corset5", Fetish: ["Lingerie"], Priority: 22, Value: 20, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, BuyGroup: "Corset5", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["Hogtied", "AllFours"], DynamicGroupName: "Corset" },
			{ Name: "LeatherBreastBinder", Fetish: ["Leather"], Value: 30, Difficulty: 50, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessTorso" },
			{
				Name: "LatexCorset1", Fetish: ["Lingerie", "Latex"], Priority: 21, Value: 40, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, BuyGroup: "LatexCorset1", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideForPose: ["Hogtied", "AllFours"], DynamicGroupName: "Corset", Extended: true, HasType: false,
				Layer:[
					{ Name: "Base", HasType: false },
					{ Name: "Garter", CopyLayerColor: "Base", HasType: false, AllowTypes: [""] }
				]
			},
			{ Name: "LeatherStrapBra1", Fetish: ["Leather"], Value: 15, Difficulty: 5, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, Top: 200, BuyGroup: "LeatherStrapBra1", Prerequisite: "AccessTorso" },
			{ Name: "CrotchChain", Fetish: ["Metal"], Value: 40, Difficulty: 50, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "ChainLong", Effect: ["CrotchRope"], Prerequisite: "AccessTorso", HideForPose: ["AllFours", "Hogtied"] },
			{
				Name: "StuddedHarness", Fetish: ["Lingerie", "Leather"], Priority: 20, Value: 100, DefaultColor:"#343131", Difficulty: 30, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessTorso",BuyGroup: "StuddedHarness", Expose:["ItemBreast"], Hide: ["ItemNipples","ItemNipplesPiercings"], HideItem: ["PantiesDiapers1","PantiesDiapers2","PantiesDiapers3"], AllowPose: ["Hogtied", "AllFours", "Yoked"],
				Layer:[
					{ Name: "Harness", AllowColorize: true},
					{ Name: "Metal", AllowColorize: false}
				],
			},
			{ Name: "HeavyLatexCorset", Fetish: ["Lingerie", "Latex"], Priority: 22, Value: 60, Difficulty: 10, Time: 20, RemoveTime: 15, AllowLock: true, Prerequisite: "AccessTorso", AllowType: ["Straps"], AllowPose: ["OverTheHead"], HideForPose: ["AllFours", "Hogtied"], Extended: true},
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNipples",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 22,
		Default: false,
		Left: 150,
		Top: 200,
		AllowPose: ["AllFours"],
		Zone: [[100, 270, 100, 70]],
		Activity: ["Bite", "Kiss", "Lick", "Suck", "Nibble", "Pinch", "Caress", "SpankItem", "Pull", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem", "ShockItem"],
		Asset: [
			{ Name: "NippleClamp", Fetish: ["Metal", "Masochism"], Value: 25, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "VibeNippleClamp", Fetish: ["Metal", "Masochism"], Value: 40, Time: 10, Prerequisite: "AccessBreast", Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating", "Edged"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], DynamicScriptDraw: true },
			{ Name: "VibratorRemote", Value: 50, Wear: false, BuyGroup: "VibratorRemote", Prerequisite: ["RemotesAllowed"], Effect: ["Remote"] },
			{ Name: "ChainClamp", Fetish: ["Metal", "Masochism"], Value: 25, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ScrewClamps", Fetish: ["Metal", "Masochism"], Value: 35, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChainTassles", Value: 45, Time: 10, Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "HeartPasties", Value: 20, Time: 10, DefaultColor: "#800000", Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "TapedVibeEggs", Fetish: ["Tape"], Value: 30, Time: 5, Prerequisite: "AccessBreast", Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating", "Edged"], DynamicScriptDraw: true, Layer: [
				{ Name: "Egg1", ColorGroup: "Eggs" },
				{ Name: "Egg2", ColorGroup: "Eggs" },
				{ Name: "Tape1", ColorGroup: "Tape" },
				{ Name: "Tape2", ColorGroup: "Tape" }

			] },
			{ Name: "NippleSuctionCups", Value: 25, Time: 10, Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], AllowType: ["Light", "Medium", "Heavy", "Maximum"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true, HasType: false },
			{ Name: "NippleTape", Fetish: ["Tape"], Value: 10, Time: 5, Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChopStickNippleClamps", Fetish: ["Rope", "Masochism"], Value: 25, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "KittyPasties", Value: 20, Time: 10, DefaultColor: "#444444", Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "Clothespins", Fetish: ["Masochism"], Value: 15, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "NippleWeightClamps", Fetish: ["Metal", "Masochism"], Value: 35, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "BellClamps", Fetish: ["Metal", "Masochism"], Value: 20, Time: 10, Prerequisite: "AccessBreast", Audio: "BellSmall", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "LactationPump", Fetish: ["Pet"], Value: 130, Top: 0, Priority: 38, Left: 0, Time: 10, Prerequisite: ["AccessBreast", "CannotBeSuited"], AllowPose: ["AllFours", "Kneel", "Hogtied", "SuspensionHogtied", "KneelingSpread"], Block: ["ItemNipplesPiercings", "ItemBreast"], Hide: ["ItemNipplesPiercings"], AllowType: ["LowSuction", "MediumSuction", "HighSuction", "MaximumSuction"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true, AlwaysExtend: true, HasType: false },
			{ Name: "ShockClamps", Fetish: ["Metal", "Masochism"], Value: 60, Time: 10, Extended: true, AlwaysExtend: true, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }], Activity: "ShockItem" },
			{Name: "PlateClamps", Fetish: ["Metal", "Masochism"], Value: 20, Time: 15, Extended: true, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }], AllowType: ["Tight"]},
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNipplesPiercings",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 13,
		Default: false,
		Left: 150,
		Top: 200,
		AllowPose: ["AllFours"],
		Zone: [[200, 270, 100, 70]],
		Asset: [
			{ Name: "StraightPiercing", Fetish: ["Metal"], Value: 10, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "RoundPiercing", Fetish: ["Metal"], Value: 40, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], AllowBlock: ["ItemNeck"], AllowType: ["Chain", "Weighted", "WeightedChain"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true },
			{ Name: "NippleAccessory1", Fetish: ["Metal"], Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"] },
			{ Name: "NippleAccessory2", Fetish: ["Metal"], Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"] },
			{ Name: "NippleAccessory3", Fetish: ["Metal"], Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"] },
			{ Name: "BarbellPiercing", Fetish: ["Metal"], Value: 20, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "NippleChastityPiercing1", Fetish: ["Metal"], Value: 50, Difficulty: 50, Time: 30, RemoveTime: 30, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], Effect: ["BreastChaste"], Block: ["ItemNipples"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "NippleChastityPiercing2", Fetish: ["Metal"], Value: 50, Difficulty: 50, Time: 30, RemoveTime: 30, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], Effect: ["BreastChaste"], Block: ["ItemNipples"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{
				Name: "VibeHeartPiercings", Value: 40, Difficulty: 10, Time: 10, AllowLock: true, BuyGroup: "VibeHeart", Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating", "Edged"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], DynamicScriptDraw: true,
				Layer: [
					{ Name: "Heart" },
					{ Name: "Ring" }
				]
			},
			{ Name: "BellPiercing", Fetish: ["Metal"], Value: 30, Difficulty: 10, Time: 15, AllowLock: true, Audio: "BellSmall", Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "CrossedStraightPiercing", Fetish: ["Metal"], Value: 10, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemBreast",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 16,
		Default: false,
		Left: 150,
		Top: 200,
		AllowPose: ["AllFours"],
		Zone: [[300, 270, 100, 70]],
		Activity: ["Bite", "Kiss", "Lick", "Tickle", "Slap", "Caress", "MasturbateHand", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem", "ShockItem", "Wiggle"],
		Asset: [
			{ Name: "MetalChastityBra", Fetish: ["Metal"], Value: 60, Difficulty: 50, Time: 15, AllowLock: true, Audio: "CuffsMetal", Prerequisite: "AccessBreast", Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "PolishedChastityBra", Fetish: ["Metal"], Value: 100, Difficulty: 50, Time: 15, AllowLock: true, Audio: "CuffsMetal", Prerequisite: "AccessBreast", Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "FuturisticBra", Category: ["SciFi"], Fetish: ["Metal"], Value: 120, BuyGroup: "FuturisticBra", Difficulty: 50, Time: 10, Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#50913C", "#FFFFFF", "#889FA7", "Default"], AllowType: ["", "Heart", "Solid"], Audio: "FuturisticApply", Prerequisite: "AccessBreast", Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, AlwaysExtend: true, DynamicAfterDraw: true,  DynamicScriptDraw: true,
				Layer: [
					{ Name: "Display", AllowColorize: true , HasType: false},
					{ Name: "Text" , AllowColorize: true , AllowTypes: ["", "Heart"]},
					{ Name: "Mesh" , AllowColorize: true , HasType: false},
					{ Name: "Bra" , AllowColorize: true , AllowTypes: ["", "Heart", "Solid"]},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{ Name: "FuturisticBra2", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, BuyGroup: "FuturisticBra", Difficulty: 50, Time: 10, Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#50913C", "Default", "#889FA7", "#404040"], AllowType: ["NoDisplay"], Audio: "FuturisticApply", Prerequisite: "AccessBreast", Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, AlwaysExtend: true,
				Layer: [
					{ Name: "Display", AllowColorize: true , HasType: false, AllowTypes: [""], ParentGroup: null},
					{ Name: "Bra" , AllowColorize: true, HasType: false},
					{ Name: "Mesh" , AllowColorize: true , HasType: false},
					{ Name: "Straps" , AllowColorize: true , HasType: false},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: true, ParentGroup: null},
				]
			},
			{
				Name: "OrnateChastityBra", Audio: "CuffsMetal", Fetish: ["Metal"], Value: 150, Difficulty: 50, Time: 15, AllowLock: true, Prerequisite: "AccessBreast", Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }],
				Layer: [
					{ Name: "Bra" },
					{ Name: "Gems" }
				]
			},
			{ Name: "LeatherCrop", Value: 20, Wear: false, BuyGroup: "LeatherCrop", Activity: "SpankItem", ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }, { Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "LeatherWhip", Value: 40, Wear: false, BuyGroup: "LeatherWhip", Activity: "SpankItem", ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }, { Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemArms",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 31,
		Default: false,
		IsRestraint: true,
		Left: 50,
		Top: 200,
		Zone: [[10, 200, 90, 200], [400, 200, 90, 200]],
		Activity: ["Bite", "Kiss", "Lick", "Nibble", "Tickle", "Spank", "Pinch", "Caress", "MassageHands", "Grope", "Cuddle", "SpankItem", "TickleItem", "RubItem", "RollItem", "PourItem", "ShockItem", "StruggleArms", "Wiggle"],
		RemoveItemOnRemove: [
			{ Group: "ItemAddon", Name: "CeilingRope" },
			{ Group: "ItemAddon", Name: "CeilingChain" },
		],
		Asset: [
			{ Name: "NylonRope", Fetish: ["Rope", "Nylon"], Value: 30, SelfBondage: 2, Time: 15, DefaultColor: "#909090", BuyGroup: "NylonRope", SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], Audio: "RopeShort" },
			{
				Name: "HempRope", Fetish: ["Rope"], Value: 60, Difficulty: 3, SelfBondage: 2, Time: 20, DefaultColor: "#956B1C", BuyGroup: "HempRope", Audio: "RopeShort", SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], AllowBlock: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowEffect: ["Freeze", "Block", "Prone", "ForceKneel"], AllowType: ["Hogtied", "SuspensionHogtied", "AllFours", "WristTie", "WristElbowTie", "RopeCuffs", "WristElbowHarnessTie", "KneelingHogtie", "TightBoxtie", "SimpleHogtie", "CrossedBoxtie", "BedSpreadEagle"], Extended: true, DynamicBeforeDraw: true,
				Layer: [
					{ Name: "", AllowColorize: true },
					{ Name: "Suspension", AllowColorize: true, HasType: false, Priority: 31, ParentGroup: "", AllowTypes: ["SuspensionHogtied"], AllowPose: [], Left: 0, Top: 0, HideAs: { Group: "ItemHidden", Asset: "SuspensionHempRope" } },
				]
			},
			{
				Name: "MetalCuffs", Fetish: ["Metal"], Priority: 29, Value: 40, Difficulty: 5, Time: 5, Audio: "LockSmall", Extended: true,
				SetPose: ["BackCuffs"],
				Effect: ["Lock", "Block", "Prone"],
				AllowPose: ["BackCuffs"],
				AllowType: ["InFront"]
			},
			{ Name: "SturdyLeatherBelts", Fetish: ["Leather"], Value: 50, Difficulty: 5, SelfBondage: 4, Time: 20, AllowLock: true, BuyGroup: "SturdyLeatherBelts", SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone", "NotSelfPickable"], AllowType: ["Two", "Three"], Extended: true, SelfUnlock: false },
			{
				Name: "LeatherArmbinder", Fetish: ["Leather"], Priority: 6, Value: 80, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, DefaultColor: "#404040", SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], Extended: true, AllowType: ["Strap", "WrapStrap"], SelfUnlock: false, DrawLocks: false,
				Layer: [
					{ Name: "Binder", HasType: false, ParentGroup: null },
					{ Name: "Strap", HasType: false, Priority: 31, ParentGroup: null, AllowTypes: ["Strap"], HideAs: { Group: "ItemHidden", Asset: "LeatherArmbinderStrap" } },
					{ Name: "WrapStrap", CopyLayerColor: "Strap", HasType: false, Priority: 31, ParentGroup: null, AllowTypes: ["WrapStrap"], HideAs: { Group: "ItemHidden", Asset: "LeatherArmbinderWrapStrap" } },
					{ Name: "Lock", LockLayer: true, HasType: false, Priority: 6, ParentGroup: null, AllowColorize: false }
				]
			},
			{
				Name: "ArmbinderJacket", Fetish: ["Leather"], Priority: 33, Value: 100, Difficulty: 12, SelfBondage: 8, DefaultColor: ["#B23E46", "#0A0A0A", "Default"], Time: 35, RemoveTime: 25, AllowLock: true, Hide: ["Cloth"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false,
				Alpha: [{Group: ["Cloth", "ClothAccessory", "Suit"], Masks: [[0, 200, 500, 40], [0, 240, 135, 20], [365, 240, 135, 20]]}],
				Layer: [
					{ Name: "Jacket" },
					{ Name: "Straps" },
					{ Name: "Rings" },
				]
			},
			{ Name: "LeatherCuffs", Fetish: ["Leather"], Priority: 29, Value: 100, Left: 0, Top: 0, Difficulty: 3, Time: 20, Random: false, AllowLock: true, AllowPose: ["BackBoxTie", "BackElbowTouch", "OverTheHead", "BackCuffs", "Yoked"], Effect: ["CuffedArms"], AllowEffect: ["Block", "Prone", "NotSelfPickable"], AllowType: ["Wrist", "Elbow", "Both"], Extended: true, HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }],
				DefaultColor: ["#2E2E2E", "Default"],
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Rings" }
				]
			},
			{ Name: "CeilingShackles", Fetish: ["Metal"], Priority: 29, Value: 100, Left: 0, Top: 0, Difficulty: 6, Time: 20, Random: false, AllowLock: true, AllowPose: ["OverTheHead", "Yoked", "Suspension"], Effect: ["Block", "Prone", "Freeze", "NotSelfPickable"], SetPose: ["Yoked"], AllowType: ["Overhead"], Extended: true,
				Layer: [
					{ Name: "Chain", Top: -388, Priority: 6 },
					{ Name: "Cuffs" }
				]
			},
			{ Name: "FuturisticCuffs", Category: ["SciFi"], Fetish: ["Metal"], DefaultColor: ["#40812C", "#707070"],Audio: "FuturisticApply",  Priority: 29, Value: 100, Left: 0, Top: 0, Difficulty: 5, Time: 20, Random: false, AllowLock: true, DrawLocks: false, AllowPose: ["BackBoxTie", "BackElbowTouch", "OverTheHead", "BackCuffs", "Yoked"], Effect: ["CuffedArms"], AllowEffect: ["Block", "Prone", "NotSelfPickable"], AllowType: ["Wrist", "Elbow", "Both"], Extended: true, HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }],
				Layer: [
					{ Name: "Display", ParentGroup: null },
					{ Name: "Cuffs" },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				],
			},
			{
				Name: "OrnateCuffs", Fetish: ["Metal"], Priority: 29, Value: 200, Left: 0, Top: 0, Difficulty: 4, Time: 20, Random: false, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["BackBoxTie", "BackElbowTouch", "OverTheHead", "BackCuffs", "Yoked"], Effect: ["CuffedArms"], AllowEffect: ["Block", "Prone", "NotSelfPickable"], AllowType: ["Wrist", "Elbow", "Both"], Extended: true, HasType: false, RemoveItemOnRemove: [{ Name: "X-Cross", Group: "ItemDevices" }],
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Gems" },
				],
			},
			{ Name: "MittenChain1", Fetish: ["Metal"], Priority: 33, Value: -1, Difficulty: 5, SelfBondage: 5, Time: 15, Random: false, AllowLock: true, Block: ["ItemHands", "ItemTorso"], SetPose: ["BaseUpper"] },
			{ Name: "FourLimbsShackles", Fetish: ["Metal"], Value: -1, Time: 30, Enable: false, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone", "Lock"] },
			{ Name: "Manacles", Fetish: ["Metal"], Value: 120, Difficulty: 16, SelfBondage: 1, Time: 30, Random: false, AllowLock: true, Prerequisite: ["NoItemFeet", "NotMounted", "NotSuspended", "NotHogtied", "NotKneelingSpread"], SetPose: ["BackBoxTie", "Kneel"], Effect: ["Block", "Freeze", "Prone", "ForceKneel"], Block: ["ItemFeet"], AllowActivityOn: ["ItemFeet"]},
			{ Name: "FullBodyShackles", Fetish: ["Metal"], Value: 150, Difficulty: 18, Random: false, AllowLock: true, Audio: "ChainLong", Prerequisite: ["NoItemFeet", "NotMounted", "NotSuspended", "NotHogtied", "NotKneelingSpread"], AllowPose: ["LegsClosed", "Kneel"], Effect: ["Prone", "Shackled"], Block: ["ItemFeet"], AllowActivityOn: ["ItemFeet"], SetPose: ["BaseUpper"] },
			{
				Name: "WristShackles", Fetish: ["Metal"], Top: 0, Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, Audio: "CuffsMetal", Extended: true, ParentGroup: null, HasType: false,
				AllowPose: ["BackCuffs", "OverTheHead"],
				Effect: ["Prone"],
				AllowEffect: ["Block", "Prone"],
				AllowType: ["Behind", "Overhead"],
				SetPose: ["BaseUpper"],
				Layer: [
					{ Name: "Cuffs" },
					{ Name: "Chain" },
				]
			},
			{
				Name: "StraitLeotard", Fetish: ["Latex"], Value: 120, Priority: 23, Difficulty: 13, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#70C0C0", Hide: ["Cloth", "ItemNipplesPiercings", "ItemVulvaPiercings", "Corset"], HideItemExclude: ["CorsetCorset1", "CorsetLatexCorset1"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemNipplesLactationPump"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"], SelfUnlock: false,
				Layer: [
					{ Name: "Lower" },
					{ Name: "Gloves" },
					{ Name: "Upper" },
				]
			},
			{
				Name: "FuturisticStraitjacket", Category: ["SciFi"], Fetish: ["Latex"], Value: 100, Priority: 15, Difficulty: 13, SelfBondage: 4, Time: 35, RemoveTime: 15, Audio: "FuturisticApply", AllowLock: true, DrawLocks: false, DefaultColor: ["#528FD1", "#8EADC4", "#A4A4A4", "#93C48C", "Default"],
				Hide: ["Cloth", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemNipples"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemHands"],
				AllowBlock: ["ItemPelvis", "ItemBreast"],
				HideItem: ["ItemButtAnalBeads2"],
				SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], SelfUnlock: false, Extended: true, AllowType: ["HandsBack","HandsFront","HandsBackChastity"],
				Layer: [
					{ Name: "Lower", AllowColorize: true , HasType: false},
					{ Name: "Mesh", AllowColorize: true , HasType: false},
					{ Name: "Sides", AllowColorize: true, HasType: false},
					{ Name: "Display", AllowColorize: true, HasType: false, ParentGroup: null},
					{ Name: "Band", AllowColorize: true, HasType: false},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
					{ Name: "GlovesBack", CopyLayerColor: "Lower", HasType: false, Priority: 14, AllowTypes: ["HandsBack", "HandsBackChastity"]},
					{ Name: "Gloves", CopyLayerColor: "Lower", HasType: false, Priority: 23, AllowTypes: ["HandsFront", ""]},
				]
			},
			{ Name: "StraitJacket", Value: 150, Difficulty: 6, SelfBondage: 8, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#A0A0A0", Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerGown2Skirt", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], AllowType: ["Normal", "Snug", "Tight"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"], Extended: true, SelfUnlock: false, HasType: false },
			{ Name: "CollarCuffs", Fetish: ["Leather"], Value: 60, Difficulty: 6, SelfBondage: 3, Time: 35, RemoveTime: 20, Visible: false, Random: false, AllowLock: true, Prerequisite: "Collared", SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], Block: ["ItemHands", "ItemNeck"], AllowType: ["Normal", "Snug", "Tight"], Extended: true, SelfUnlock: false, AllowActivityOn: ["ItemNeck"] },
			{ Name: "LeatherStraitJacket", Fetish: ["Leather"], Value: 200, Difficulty: 7, SelfBondage: 8, Time: 45, RemoveTime: 30, AllowLock: true, Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerGown2Skirt", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt", "ItemNipplesLactationPump"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], AllowType: ["Normal", "Snug", "Tight"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"], Extended: true, SelfUnlock: false },
			{
				Name: "Bolero", Fetish: ["Leather"], Priority: 33, Value: 100, Difficulty: 11, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: ["#E080A0", "Default"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"],
				Alpha: [{ Group: ["Cloth", "ClothAccessory", "Suit"], Masks: [[0, 190, 500, 60], [0, 250, 175, 90], [325, 250, 175, 90]] }],
				Layer: [
					{ Name: "Leather" },
					{ Name: "Belts" }
				],
				SelfUnlock: false
			},
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Difficulty: 5, SelfBondage: 4, Time: 20, RemoveTime: 10, BuyGroup: "DuctTape", Audio: "DuctTape", Hide: ["ItemNipplesPiercings"], HideItem: ["ItemNipplesLactationPump"], AllowPose: ["Horse", "KneelingSpread"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], AllowBlock: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples", "ItemNipplesPiercings"], AllowType: ["Bottom", "Top", "Full", "Complete", "ExposedComplete"], Extended: true },
			{
				Name: "BitchSuit", Fetish: ["Latex", "Pet"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#888888", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel"], Hide: ["Cloth", "ClothLower", "Bra", "Panties", "Shoes", "Socks", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "ItemFeet", "Corset"],
				SetPose: ["BackElbowTouch", "Kneel", "LegsClosed"],
				Effect: ["Block", "Prone", "ForceKneel"],
				HideItem: ["ItemNipplesLactationPump"],
				Block: ["ItemPelvis", "ItemTorso", "ItemHands"],
				AllowActivityOn: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"],
				Extended: true,
				Layer: [
					{
						Name: "Latex", AllowTypes: [""], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[140, 462, 75, 238], [285, 462, 75, 238], [215 ,545, 70, 155]]}],
					},
					{
						Name: "UnZip", CopyLayerColor: "Latex", AllowTypes: ["UnZip"], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[140, 462, 75, 238], [285, 462, 75, 238], [215 ,545, 70, 155]]}],
					}
				],
				SelfUnlock: false
			},
			{
				Name: "BitchSuitExposed", Fetish: ["Latex", "Pet"], Value: 175, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#888888",
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel"],
				Hide: ["Cloth", "ClothLower", "Shoes", "Socks", "ItemBoots", "ItemLegs", "ItemFeet"],
				SetPose: ["BackElbowTouch", "Kneel", "LegsClosed"],
				Effect: ["Block", "Prone", "ForceKneel"],
				Block: ["ItemPelvis", "ItemTorso", "ItemHands"],
				AllowActivityOn: ["ItemPelvis", "ItemTorso", "ItemHands"],
				Alpha: [{Group: ["BodyLower"], Masks: [[140, 462, 75, 238], [285, 462, 75, 238], [215 ,545, 70, 155]]}],
				SelfUnlock: false
			},
			{ Name: "CollarLeashHolding", Fetish: ["Sadism"], Priority: 36, Value: -1, Difficulty: 1, Time: 3, RemoveTime: 3, Random: false, Prerequisite: ["NotSuspended", "NotHogtied"], SetPose: ["BaseUpper"], Effect: ["Leash"] },
			{
				Name: "StraitDress", Fetish: ["Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "StraitDress", DefaultColor: ["#4040C0", "Default"], Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Socks", "BodyLower", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "Suit", "SuitLower"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemNipplesLactationPump", "ItemFeetChains"], AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone", "Slow"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemButt"], AllowActivePose: ["Kneel"], Layer: [
					{ Name: "Latex" },
					{ Name: "Belts" }
				],
				SelfUnlock: false
			},
			{
				Name: "StraitDressOpen", Fetish: ["Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "StraitDress", DefaultColor: ["#400000", "Default"],
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"],
				Hide: ["Cloth", "Shoes", "Socks", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "Suit", "LeftAnklet", "RightAnklet"],
				AllowPose: ["Kneel"],
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Slow"],
				Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemLegs"],
				AllowActivePose: ["Kneel"],
				Alpha: [
					{
						Group: ["BodyLower", "ClothLower", "ItemLegs", "ItemFeet", "SuitLower", "Bra", "Panties", "Corset", "ItemTorso"],
						Masks: [[0, 220, 500, 242], [0, 462, 210, 120], [290, 462, 210, 120], [0, 582, 500, 418]]
					}
				],
				Layer: [
					{ Name: "Latex" },
					{ Name: "Belts" }
				],
				SelfUnlock: false
			},
			{ Name: "SeamlessStraitDress", Fetish: ["Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "SeamlessStraitDress", DefaultColor: "#4040C0", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Socks", "BodyLower", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "Suit", "SuitLower", "Corset"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemNipplesLactationPump"], AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone", "Slow"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemButt"], AllowActivePose: ["Kneel"], SelfUnlock: false },
			{ Name: "SeamlessStraitDressOpen", Fetish: ["Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "SeamlessStraitDress", DefaultColor: "#400000",
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"],
				Hide: ["Cloth", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "Suit"],
				HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetFuturisticAnkleCuffs", "ItemFeetFuturisticAnkleCuffs","ItemNipplesLactationPump"],
				AllowPose: ["Kneel"],
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Slow"],
				Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemLegs"],
				AllowActivePose: ["Kneel"], SelfUnlock: false,
				Alpha: [{Group: ["BodyLower"], Masks: [[135, 462, 75, 120], [290, 462, 75, 120], [135, 582, 230, 418]]}],
			},
			{
				Name: "Yoke", Fetish: ["Metal", "Leather"], Priority: 39, Value: 80, Difficulty: 10, SelfBondage: 6, Time: 20, AllowLock: true, ParentGroup: null,
				SetPose: ["Yoked"],
				Effect: ["Block", "Prone", "NotSelfPickable"],
				Layer: [
					{ Name: "Straps" },
					{ Name: "Bars" },
				]
			},
			{
				Name: "Pillory", Fetish: ["Metal"], Priority: 46, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 20, Random: false, AllowLock: true, ParentGroup: null, Bonus: "KidnapDomination",
				Prerequisite: ["NotMasked"],
				SetPose: ["Yoked"],
				Effect: ["Block", "Prone", "NotSelfPickable"],
				Layer: [
					{ Name: "Wood" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "FullLatexSuit", Fetish: ["Leather", "Latex"], Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#888888", Prerequisite: ["NotSuspended", "NotKneeling", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotShackled", "CannotBeSuited"],
				Hide: ["Socks", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "Suit", "SuitLower", "Corset"],
				HideItem: ["ItemNipplesLactationPump"],
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Freeze", "BlockKneel", "Slow"],
				AllowBlock: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemButt"],
				AllowEffect: ["Egged", "Vibrating"],
				AllowType: ["", "UnZip"],
				Block: ["ItemBoots", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet"],
				Extended: true,
				Layer: [
					{
						Name: "Latex", AllowTypes: ["", "Base"], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[100, 546, 300, 440], [150, 462, 70, 98], [280, 462, 70, 98]]}],
					},
					{
						Name: "UnZip", CopyLayerColor: "Latex", AllowTypes: ["UnZip", "Base"], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[100, 546, 300, 440], [150, 462, 70, 98], [280, 462, 70, 98]]}],
					},
					{ Name: "Base", AllowTypes: ["", "Base", "UnZip", "Latex"], HasType: false }
				],
				RemoveItemOnRemove: [{ Name: "FullLatexSuitWand", Group: "ItemVulva" }],
			},
			{ Name: "Zipties", Value: 20, Difficulty: 6, SelfBondage: 1, RemoveTime: 6, BuyGroup: "Zipties", Audio: "ZipTie", SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], AllowBlock: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowEffect: ["Freeze", "Block", "Prone", "ForceKneel"], AllowType: ["ZipMedium", "ZipFull", "ZipElbowWrist", "ZipWristLight", "ZipWristMedium", "ZipWristFull", "ZipWrist", "ZipHogtied", "ZipAllFours", "ZipKneelingHogtie"], Extended: true },
			{
				Name: "BoxTieArmbinder", Fetish: ["Latex"], Value: 140, Difficulty: 11, SelfBondage: 7, Time: 40, RemoveTime: 30, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false,
				Alpha: [{Group: ["Cloth", "ClothAccessory", "Suit"], Masks: [[0, 190, 500, 60], [0, 250, 175, 90], [325, 250, 175, 90]]}],
			},
			{
				Name: "BondageBouquet", Fetish: ["Metal"], Priority: 41, Value: 40, Difficulty: 3, Time: 15, Random: false, AllowLock: true, Audio: "CuffsMetal", BuyGroup: "Bouquet", Effect: ["Prone"], SetPose: ["BaseUpper"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Flowers" }
				]
			},
			{
				Name: "Chains", Fetish: ["Metal"], Value: 90, Difficulty: 5, SelfBondage: 3, Time: 30, AllowLock: true, BuyGroup: "Chains", Audio: "ChainLong", SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], AllowBlock: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowEffect: ["Freeze", "Block", "Prone", "ForceKneel", "NotSelfPickable"], AllowType: ["Hogtied", "SuspensionHogtied", "AllFours", "WristTie", "WristElbowTie", "ChainCuffs", "WristElbowHarnessTie", "KneelingHogtie"], Extended: true,
				Layer: [
					{ Name: "", AllowColorize: true },
					{ Name: "Suspension", AllowColorize: true, HasType: false, Priority: 31, ParentGroup: "", AllowTypes: ["SuspensionHogtied"], AllowPose: [], Left: 0, Top: 0, HideAs: { Group: "ItemHidden", Asset: "SuspensionHempRope" } },
				]
			},
			{ Name: "ChainLeashHolding", Fetish: ["Sadism"], Priority: 36, Value: -1, Difficulty: 1, Time: 3, RemoveTime: 3, Random: false, Prerequisite: ["NotSuspended", "NotHogtied"], SetPose: ["BaseUpper"], Effect: ["Leash"] },
			{
				Name: "PetCrawler", Priority: 36, Value: 80, Difficulty: 10, SelfBondage: 7, Time: 20, Random: false, AllowLock: true, Prerequisite: ["NoItemFeet", "NoItemLegs", "LegsOpen", "NotMounted", "NotHorse", "NotSuspended", "NotYoked", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["ItemBoots", "Suit", "Panties", "Bra"],
				HideItem: ["ItemButtRaccoonTailPlug", "TailStrapsRaccoonTailStrap", "ItemButtKittenTail1", "TailStrapsKittenTail1", "ItemNipplesPiercingsNippleChastityPiercing2", "ItemTorsoAdultBabyHarness", "ItemTorsoCorset2", "ItemTorsoCorset3", "ItemNipplesPiercingsNippleChastityPiercing1", "ItemNipplesChainTassles", "ItemNipplesHeartPasties", "ItemNipplesNippleTape", "ItemNipplesKittyPasties"],
				SetPose: ["AllFours"],
				Effect: ["Block", "Prone", "ForceKneel"],
				Block: ["ItemLegs", "ItemFeet", "ItemDevices"],
				AllowActivityOn: ["ItemLegs", "ItemFeet"]
			},
			{
				Name: "MermaidSuit", Fetish: ["Latex", "Pet"], Value: 200, Difficulty: 15, SelfBondage: 6, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#400000", Prerequisite: ["NotSuspended", "NotKneeling", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotShackled", "CannotBeSuited"],
				Hide: ["Socks", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemLegs", "Suit", "SuitLower", "ItemPelvis", "ItemFeet", "Panties", "Corset"],
				HideItem: ["ItemNipplesLactationPump"],
				SetPose: ["BackElbowTouch", "LegsClosed"],
				Effect: ["Block", "Prone", "Freeze", "BlockKneel"],
				AllowBlock: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
				AllowType: ["UnZip"],
				Block: ["ItemBoots", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet"],
				Extended: true,
				Layer: [
					{
						Name: "Latex", AllowTypes: [""], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[100, 546, 300, 440], [150, 462, 70, 98], [280, 462, 70, 98]]}],
					},
					{
						Name: "UnZip", CopyLayerColor: "Latex", AllowTypes: ["UnZip"], HasType: false,
						Alpha: [{Group: ["BodyLower"], Masks: [[100, 546, 300, 440], [150, 462, 70, 98], [280, 462, 70, 98]]}],
					}
				]
			},
			{
				Name: "Web", Fetish: ["Tape"], Priority: 35, Value: 150, Difficulty: 4, SelfBondage: 2, Time: 20, RemoveTime: 30, Random: false, Left: 0, Top: 0,
				Prerequisite: ["NotKneelingSpread", "NotMounted"],
				Hide: ["Cloth", "ClothLower", "Shoes"], HideItem: ["ItemNipplesLactationPump"],
				AllowPose: ["Kneel", "Hogtied", "Suspension"],
				SetPose: ["LegsOpen", "BackElbowTouch"],
				Effect: ["Block", "Freeze", "Prone"],
				AllowBlock: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemDevices", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
				AllowType: ["Wrapped", "Cocooned", "Hogtied", "Suspended", "KneelingSuspended", "SuspensionHogtied"],
				Block: ["ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
				Extended: true,
			},
			{
				Name: "LatexArmbinder", Fetish: ["Latex"], Priority: 6, Value: 60, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false,
				Layer: [
					{ Name: "Latex" },
					{ Name: "Strap1", ColorGroup: "BottomStrap" },
					{ Name: "Strap2", ColorGroup: "TopStrap" },
					{ Name: "Hole2", ColorGroup: "TopStrap" },
					{ Name: "Buckle2", ColorGroup: "TopStrap" },
					{ Name: "Buckle1" ,ColorGroup: "BottomStrap" },
					{ Name: "Hole1", ColorGroup: "BottomStrap" },
					{ Name: "Laces"}
				]
			},
			{
				Name: "FuturisticArmbinder", Category: ["SciFi"], Fetish: ["Metal"], Random: false, Priority: 31, Value: 80, Difficulty: 10, Left: 0, Top: 0, SelfBondage: 6, Time: 20, RemoveTime: 15, Audio: "FuturisticApply", AllowLock: true, DrawLocks: false, DefaultColor: ["#40812C", "#555555", "#777777", "Default",], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false, AllowType: ["Tight"], Extended: true, AlwaysExtend: true,
				Layer: [
					{ Name: "Display" , ParentGroup: null, HasType: false, Priority: 31, Left: 0, Top: 0,   },
					{ Name: "Binder" , ParentGroup: null, AllowTypes: [""], Priority: 6, Left: 50, Top: 200,	},
					{ Name: "Band" , ParentGroup: null, AllowTypes: [""], Priority: 6, Left: 50, Top: 200,	},
					{ Name: "Straps", Priority: 31, HasType: false,  Left: 0, Top: 0,  },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, Priority: 31, ParentGroup: null},
				]
			},
			{ Name: "SeamlessLatexArmbinder", Fetish: ["Latex"], Priority: 6, Value: 60, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false },
			{
				Name: "FullBodyLeatherHarness", Fetish: ["Leather"], Priority: 29, Value: 60, Difficulty: 14, SelfBondage: 6, Time: 20, RemoveTime: 15, AllowLock: true, SetPose: ["BackElbowTouch", "LegsClosed"], AllowPose: ["Kneel"], Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotShackled"], Effect: ["Block", "Prone", "Slow"], SelfUnlock: false,
				HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerGown2Skirt", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt", "ClothLowerPajama1"], AllowActivePose: ["Kneel"]
			},
			{ Name: "UnderBedBondageCuffs", Fetish: ["Leather"], Value: -1, Difficulty: 9, SelfBondage: 3, Random: false, IsRestraint: true, SetPose: ["Yoked", "LegsOpen"], Prerequisite: ["OnBed", "LegsOpen"], Effect: ["Block", "Prone", "Freeze", "BlockKneel"], Block: ["ItemDevices", "ItemLegs", "ItemFeet", "ItemBoots"], AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots"], AllowLock: true, BuyGroup: "Bed", Left: 0, Top: -250 },
			{ Name: "TightJacket", Fetish: ["Leather"], DefaultColor: "#FFFFFF", Value: 150, Difficulty: 6, SelfBondage: 8, Time: 35, RemoveTime: 20, AllowLock: true, Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerGown2Skirt", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"], BuyGroup: "TightJacket", SelfUnlock: false, Extended: true, AllowType: ["PulledStraps", "LiningStraps", "ExtraPadding", "PulledLining", "PulledPadding", "PaddedLining", "FullJacket"] },
			{ Name: "LatexSleevelessLeotard", Fetish: ["Latex"], Value: 120, Priority: 23, Difficulty: 14, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#d986a2", Hide: ["Cloth", "ItemNipplesPiercings", "ItemVulvaPiercings", "Corset"], HideItemExclude: ["CorsetCorset1", "CorsetLatexCorset1"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"], Extended: true, SelfUnlock: false,
				Layer: [
					{ Name: "Latex", AllowColorize: true, AllowTypes: ["", "Polished"], HasType: false },
					{ Name: "Highlights", AllowColorize: false, AllowTypes: ["", "Polished"] }
				]
			},
			{
				Name: "LatexBoxtieLeotard", Fetish: ["Latex"], Value: 120, Priority: 23, Difficulty: 14, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#185d97", BuyGroup: "LatexSleevelessLeotard", Hide: ["Cloth", "ItemNipplesPiercings", "ItemVulvaPiercings", "Corset"], HideItemExclude: ["CorsetCorset1", "CorsetLatexCorset1"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"], Extended: true, SelfUnlock: false, 
				Layer: [
					{ Name: "Latex", AllowColorize: true, AllowTypes: ["", "Polished"], HasType: false },
					{ Name: "Highlights", AllowColorize: false, AllowTypes: ["", "Polished"] }
				]
			},
			{
				Name: "LatexButterflyLeotard", Fetish: ["Latex"], Value: 150, Priority: 23, Difficulty: 14, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#580505", Hide: ["Cloth", "Bra", "ItemNipplesPiercings", "ItemVulvaPiercings", "Corset"], HideItemExclude: ["CorsetCorset1", "CorsetLatexCorset1"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"], Extended: true, SelfUnlock: false, 
				Layer: [
					{ Name: "Latex", AllowColorize: true, AllowTypes: ["", "Polished"], HasType: false },
					{ Name: "Highlights", AllowColorize: false, AllowTypes: ["", "Polished"] }
				]
			},
			{
				Name: "PrisonLockdownSuit", Value: 125, Difficulty: 7, SelfBondage: 7, Time: 50, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "PrisonLockdownSuit", DefaultColor: ["#ab5207", "Default"], Hide: ["BodyUpper", "ItemNeck", "BodyLower", "Cloth", "ClothLower", "Shoes", "Socks", "ItemLegs", "ItemFeet", "ItemPelvis", "ItemBoots", "SuitLower", "Panties", "ItemVulva", "ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2"], SetPose: ["LegsClosed", "BackElbowTouch"], Prerequisite: ["NotSuspended", "NotKneeling", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotShackled"], Effect: ["Block", "Prone", "Slow", "BlockKneel"], AllowEffect: ["Freeze"], AllowType: ["Ankles", "Thighs", "Full"], Block: ["ItemBreast", "ItemNipplesPiercings", "ItemNipples", "ItemTorso", "ItemPelvis", "ItemHands", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemLegs", "ItemFeet", "ItemBoots"], Extended: true, SelfUnlock: false, Layer: [
					{ Name: "Suit", AllowTypes: ["", "Ankles", "Thighs", "Full"] },
					{ Name: "Belts", AllowTypes: ["", "Ankles", "Thighs", "Full"] }
				]
			},
			{ Name: "LeatherArmSplints", Value: 65, Fetish: ["Leather"], Difficulty: 7, SelfBondage: 7, Time: 15, RemoveTime: 10, Visible: false, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], SelfUnlock: false },
			{ Name: "TightJacketCrotch", Fetish: ["Leather"], DefaultColor: "#FFFFFF", Value: 150, Difficulty: 6, SelfBondage: 8, Time: 35, RemoveTime: 20, AllowLock: true, Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerGown2Skirt", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands", "ItemVulva", "ItemButt", "ItemVulvsPiercings"], BuyGroup: "TightJacket", SelfUnlock: false, Extended: true, AllowType: ["PulledStraps", "LiningStraps", "ExtraPadding", "PulledLining", "PulledPadding", "PaddedLining", "FullJacket"] },
			{ Name: "HighSecurityStraitJacket", Value: 220, Priority: 25, Difficulty: 4, SelfBondage: 2, Time: 45, RemoveTime: 30, Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#333", "#333", "#3e3e3e", "#3e3e3e"], Hide: ["Cloth", "ItemNipplesPiercings"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"],
				Extended: true,
				Layer: [
					{ Name: "Crotch", ColorGroup: "Canvas", ParentGroup: null, AllowModuleTypes: ["c1"], HasType: false },
					{ Name: "JacketLoose", ColorGroup: "Canvas", ParentGroup: null, AllowModuleTypes: ["a0"], HasType: false},
					{ Name: "JacketFront", CopyLayerColor: "JacketLoose", AllowModuleTypes: ["a1"], HasType: false },
					{ Name: "JacketBack", CopyLayerColor: "JacketLoose", AllowModuleTypes: ["a2"], HasType: false },
					{ Name: "StrapsLoose", ColorGroup: "Straps", AllowModuleTypes: ["a0"], HasType: false},
					{ Name: "StrapsFront", CopyLayerColor: "StrapsLoose", AllowModuleTypes: ["a1"], HasType: false },
					{ Name: "StrapsBack", CopyLayerColor: "StrapsLoose", AllowModuleTypes: ["a2"], HasType: false },
					{ Name: "CrotchStrapsSingle", ColorGroup: "Straps", ParentGroup: null, AllowModuleTypes: ["s1"], HasType: false },
					{ Name: "CrotchStrapsDouble", CopyLayerColor: "CrotchStrapsSingle", ParentGroup: null, AllowModuleTypes: ["s2"], HasType: false },
					{ Name: "CrotchStrapsTriple", CopyLayerColor: "CrotchStrapsSingle", ParentGroup: null, AllowModuleTypes: ["s3"], HasType: false },
					{ Name: "Lock", AllowColorize: false, ParentGroup: null, AllowModuleTypes: ["s1", "s2", "s3", "a2"], LockLayer: true }
				],
				SelfUnlock: false
			},
			{ Name: "PantyhoseBody", Fetish: ["Nylon"], Value: 75, Priority: 15, Difficulty: 3, SelfBondage: 4, Time: 30, RemoveTime: 20, Random: false, BuyGroup: "PantyhoseBody", AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone", "Slow"],
				Prerequisite: ["NotHogtied", "NotMounted", "NoFeetSpreader"], Hide: ["Cloth", "ClothLower", "Suit", "SuitLower"],
				Block: ["ItemHands", "ItemVulva", "ItemButt", "ItemVulvaPiercings", "ItemNipplesPiercings"], AllowActivePose: ["Kneel"] },
			{ Name: "PantyhoseBodyOpen", Fetish: ["Nylon"], Value: 75, Priority: 15, Difficulty: 3, SelfBondage: 4, Time: 30, RemoveTime: 20, Random: false, BuyGroup: "PantyhoseBody", AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone", "Slow"],
				Prerequisite: ["NotHogtied", "NotMounted", "NoFeetSpreader"], Hide: ["Cloth", "ClothLower", "Suit", "SuitLower"], Block: ["ItemHands",  "ItemNipplesPiercings"], AllowActivePose: ["Kneel"] },
			{ Name: "WoodenCuffs", Value: 30, Difficulty: 2, Time: 5, Random: false, AllowLock: true, Audio: "WoodenCuffs", BuyGroup: "WoodenCuffs", SetPose: ["BaseUpper"], Effect: ["Block", "Prone", "NotSelfPickable"] },
			{Name: "InflatableStraightLeotard", ParentGroup: null, Fetish: ["Latex"], Value: 150, Top: 137 ,Left: 3, Difficulty: 10, SelfBondage: 6, Time: 30, RemoveTime: 50, AllowLock: true, Prerequisite: ["NotSuspended", "AllFours", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread"],
				Hide: ["Cloth", "Suit", "ClothLower", "ClothAccessory", "ItemButt", "TailStraps", "Wings", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemPelvis", "ItemTorso"],
				HideItem: ["ItemNipplesLactationPump"],
				SetPose: ["BackElbowTouch"],
				Effect: ["Block", "Prone"], AllowEffect: ["Block", "Prone", "Freeze"],
				AllowType: ["Inflated", "Bloated", "Max"],
				Block: ["ItemBreast", "ItemButt", "ItemHands", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"], SelfUnlock: false, Extended:true},
			{ Name: "StrictLeatherPetCrawler", Fetish: ["Leather", "Pet"], Value: 150, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#888888",
				Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel"],
				Hide: ["Cloth", "ClothLower","Shoes", "ItemBoots", "ItemLegs", "ItemFeet"],
				SetPose: ["BackElbowTouch", "Kneel", "LegsClosed"],
				Effect: ["Block", "Prone", "ForceKneel"],
				Block: ["ItemHands"],
				SelfUnlock: false,
				Layer:[
					{ Name: "Arms", AllowColorize: true},
					{ Name: "Legs", CopyLayerColor: "Arms", ParentGroup: "BodyLower"},
				]
			},
			{
				Name: "MedicalBedRestraints", Value: -1, Priority: 39, Difficulty: 5, Time: 5, RemoveTime: 5, Random: false, DefaultColor: "#ccc", AllowLock: true, Left: 0, BuyGroup: "MedicalBedRestraints",
				Prerequisite: ["OnBed"], SetPose: ["Yoked"], Effect: ["Block", "Prone"], Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemDevices"], AvailableLocations: ["Asylum"], Hide: ["Cloth", "ClothLower", "ItemVulva", "ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2"],
				HideItemExclude: ["ClothBondageBustier1", "ClothBondageBustier2", "ClothLowerLatexSkirt1", "ClothCorsetShirt", "ClothGown2Top", "ClothLeatherBolero", "ClothLeatherCorsetTop1", "ClothLeatherCropTop", "ClothMistressTop", "ClothReverseBunnySuit", "ClothShoulderlessTop", "ClothComfyTop", "ClothSleevelessTop", "ClothStudentOutfit3", "ClothSuspenderTop1", "ClothSweater1", "ClothTShirt1", "ClothTennisShirt1", "ClothBodyTowel1", "ClothVirginKiller1", "ClothLowerLeggings1", "ClothLowerLeggings2", "ClothLowerMistressBottom", "ItemVulvaLoversVibrator", "ItemVulvaFuturisticVibrator", "ItemVulvaTapeStrips", "ItemVulvaVibratingLatexPanties"],
				Layer: [
					{ Name: "Base", Priority: 2, ParentGroup: null },
					{ Name: "Straps"}
				],
			},
			{
				Name: "TransportJacket", Value: 100, Difficulty: 7, Time: 25, RemoveTime: 15, AllowLock: true, DrawLocks: false, Left: 100, AllowPose: ["Kneel", "LegsClosed", "Horse", "KneelingSpread", "Spread"], SetPose: ["BackElbowTouch"], Extended: true, DynamicAfterDraw: true,
				DefaultColor: ["#888", "#801612", "#888", "#eee", "#801612", "#888"],
				AllowType: ["Shorts", "ShortsAndStraps"],
				Effect: ["Block", "Prone"],
				Hide: ["Cloth", "ClothLower", "ItemNipplesPiercings"],
				HideItemExclude: ["ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerJeansShorts", "ClothLowerLatexPants1", "ClothLowerLeggings1", "ClothLowerLeggings2", "ClothLowerMistressBottom"],
				Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands", "ItemPelvis"],
				AllowBlock: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis"],
				Layer: [
					{ Name: "Shorts", ColorGroup: "Canvas", ParentGroup: "BodyLower", AllowTypes: ["Shorts", "ShortsAndStraps"], HasType: false, HideForPose: ["Horse", "KneelingSpread", "Spread"] },
					{ Name: "StripesLegs", ColorGroup: "Stripes", ParentGroup: null, AllowTypes: ["Shorts", "ShortsAndStraps"], HasType: false, HideForPose: ["Horse", "KneelingSpread", "Spread"] },
					{ Name: "Jacket", ColorGroup: "Canvas", ParentGroup: null, HasType: false, AllowPose: [] },
					{ Name: "Text", HasImage: false },
					{ Name: "Stripes", ColorGroup: "Stripes", ParentGroup: null, HasType: false, AllowPose: [] },
					{ Name: "CrotchStraps", CopyLayerColor: "Straps", ParentGroup: null, HasType: false, AllowPose: ["Horse", "KneelingSpread", "Spread"], HideForPose: ["Horse", "KneelingSpread", "Spread"] },
					{ Name: "Straps", ParentGroup: null, HasType: false, AllowPose: [] },
					{ Name: "StrapsLegs", CopyLayerColor: "Straps", ParentGroup: "BodyLower", AllowTypes: ["ShortsAndStraps"], HasType: false, HideForPose: ["Horse", "KneelingSpread", "Spread"] },
				],
			},
			{ Name: "PlasticWrap", Value: 100, Difficulty: 7, SelfBondage: 3, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", SetPose: ["BackElbowTouch"], Block:["ItemBreast","ItemNipples", "ItemNipplesPiercings", "ItemTorso"], Hide: ["Cloth", "ClothAccessory"], Effect: ["Block", "Prone"]},
			{ Name: "WrappedBlanket", Extended: true, Value: -1, Difficulty: 15, SelfBondage: 3, Time: 40, RemoveTime: 30, Random: false, BuyGroup: "Bed", Prerequisite: ["NotSuspended", "NotHogtied", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Shoes", "Socks", "Cloth", "ClothLower", "Bra", "ItemNipplesPiercings", "ItemLegs"], HideItem: ["ItemFeetOrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetLeatherAnkleCuffs", "ItemNipplesLactationPump"], AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemButt"], AllowType: ["ShouldersWrapped", "FeetWrapped", "FullWrapped"] },

			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
	},

	{
		Group: "ItemHands",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 35,
		Default: false,
		IsRestraint: true,
		Zone: [[10, 400, 90, 200], [400, 400, 90, 200]],
		Activity: ["Bite", "Kiss", "PoliteKiss", "Lick", "Suck", "Nibble", "Spank", "Caress", "TakeCare", "Wiggle"],
		Asset: [
			{ Name: "PaddedMittens", Fetish: ["ABDL"], Value: 40, Difficulty: 4, SelfBondage: 2, Time: 15, AllowLock: true, DefaultColor: "#bbbbbb", AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], Effect: ["Block", "Prone"], Extended: true,
				Layer: [
					{ Name: "Gloves", AllowColorize: true},
					{ Name: "Straps", AllowColorize: true},
					{ Name: "Buckles", AllowColorize: true},
				]
			},
			{ Name: "PawMittens", Fetish: ["ABDL", "Pet"], Value: 50, Difficulty: 4, SelfBondage: 1, Time: 15, AllowLock: true, DefaultColor: ["#bbbbbb","#bbbbbb","#bbbbbb","#B38295"], AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], Effect: ["Block", "Prone"], Extended: true,
				Layer: [
					{ Name: "Gloves", AllowColorize: true},
					{ Name: "Straps", AllowColorize: true},
					{ Name: "Buckles", AllowColorize: true},
					{ Name: "Paws", AllowColorize: true},
				]
			},
			{ Name: "LeatherMittens", Fetish: ["Leather"], Value: 60, Difficulty: 5, SelfBondage: 4, Time: 15, RemoveTime: 5, AllowLock: true, AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone"] },
			{ Name: "FuturisticMittens", Fetish: ["Metal"], Category: ["SciFi"], Value: 70, Difficulty: 5, SelfBondage: 0, Time: 5, RemoveTime: 5, Audio: "FuturisticApply", Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#93C48C", "#3B7F2C", "Default"], AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: [], AllowEffect: ["Block", "Prone"], SelfUnlock: false, AllowType: ["Gloves"], Extended: true, AlwaysExtend: true,
				Layer: [
					{ Name: "Mesh", ParentGroup: null},
					{ Name: "Display", ParentGroup: null},
					{ Name: "Body", ParentGroup: null},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},

				]
			},
			{ Name: "PaddedLeatherMittens", Fetish: ["Leather"], Value: 70, Difficulty: 6, SelfBondage: 5, Time: 15, RemoveTime: 5, AllowLock: true, AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone"] },
			{ Name: "PolishedMittens", Fetish: ["Metal"], Value: 80, Difficulty: 8, SelfBondage: 6, Time: 20, RemoveTime: 10, AllowLock: true, Audio: "CuffsMetal", AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], Effect: ["Block", "Prone"] },
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Difficulty: 5, SelfBondage: 3, Time: 20, RemoveTime: 10, BuyGroup: "DuctTape", Audio: "DuctTape", Hide: ["Gloves"], AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone"] },
			{
				Name: "SpankingToys", Fetish: ["Sadism"], Priority: 46, Random: false, Wear: true, IsRestraint: false, BuyGroup: "SpankingToys", AllowPose: ["OverTheHead", "BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], AllowType: ["Flogger", "Cane", "HeartCrop", "Paddle", "WhipPaddle", "Whip", "CattleProd", "TennisRacket", "Gavel", "Feather", "FeatherDuster", "LongDuster", "IceCube", "WartenbergWheel", "VibratingWand", "SmallVibratingWand", "CandleWax", "LargeDildo", "PetToy", "Vibrator", "Belt", "Hairbrush", "SmallDildo", "ElectricToothbrush", "Toothbrush", "ShockWand", "Lotion", "Ruler", "Sword", "VibeRemote", "ShockRemote", "Towel", "RopeCoilLong", "RopeCoilShort", "Ballgag", "LongSock", "Baguette", "Panties", "TapeRoll", "Spatula"], DynamicPreviewIcon: C => InventorySpankingToysGetType(C),
				DynamicAllowInventoryAdd: C => { return InventorySpankingToysAvailableToys(C).length > 0; },
				Extended: true,
				ParentGroup: null
			}, {
				Name: "SpankingToysCrop", Value: 20, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysFlogger", Value: 40, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysCane", Value: 15, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysHeartCrop", Value: 30, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysPaddle", Value: 35, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysWhipPaddle", Value: 25, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysWhip", Value: 50, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysCattleProd", Value: 45, Random: false, Activity: "ShockItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysTennisRacket", Value: -1, Random: false, Activity: "SpankItem", Bonus: "KidnapBruteForce", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysGavel", Value: -1, Random: false, Activity: "SpankItem", Bonus: "KidnapDomination", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysFeather", Value: 2, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysFeatherDuster", Value: 4, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysLongDuster", Value: -1, Random: false, Activity: "TickleItem", Bonus: "KidnapSneakiness", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysIceCube", Value: 3, Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysWartenbergWheel", Value: 10, Random: false, Activity: "RollItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysVibratingWand", Value: 40, Random: false, Activity: "MasturbateItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysSmallVibratingWand", Value: 20, Random: false, Activity: "MasturbateItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysCandleWax", Value: 10, Random: false, Activity: "PourItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysLargeDildo", Value: 30, Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysPetToy", Value: 5, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysVibrator", Value: 45, Random: false, Activity: "MasturbateItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysBelt", Value: 10, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysHairbrush", Value: 5, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysSmallDildo", Value: 20, Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysElectricToothbrush", Value: 20, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysToothbrush", Value: 10, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysShockWand", Value: 50, Random: false, Activity: "ShockItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysLotion", Value: 10, Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysRuler", Value: 3, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysSword", Value: 5, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysVibeRemote", Value: 50, Random: false, BuyGroup: "VibratorRemote", Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysShockRemote", Value: 50, Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},{
				Name: "SpankingToysTowel", Value: 10, Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},{
				Name: "SpankingToysRopeCoilLong", Value: 60, BuyGroup: "HempRope", Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},{
				Name: "SpankingToysRopeCoilShort", Value: 60, BuyGroup: "HempRope", Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},{
				Name: "SpankingToysBallgag", Value: 40, Random: false,  Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},{
				Name: "SpankingToysLongSock", Value: 40, Random: false,  Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},{
				Name: "SpankingToysBaguette", Value: -1, Random: false,  Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},{
				Name: "SpankingToysPanties", Value: 10, Random: false,  Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},{
				Name: "SpankingToysTapeRoll", Value: 50, Random: false,  Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false; },
			},{
				Name: "SpankingToysSpatula", Value: 5, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false; },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},
			{ Name: "HoofMittens", Fetish: ["Pony"], Value: -1, Difficulty: 5, SelfBondage: 4, Time: 15, RemoveTime: 5, AllowLock: true, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours", "OverTheHead"], SetPose: ["TapedHands"], Effect: ["Block", "Prone"] },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNeck",
		Category: "Item",
		Priority: 34,
		Default: false,
		Left: 185,
		Top: 160,
		Zone: [[200, 200, 100, 70]],
		RemoveItemOnRemove: [
			{ Group: "ItemNeckAccessories", Name: ""},
			{ Group: "ItemNeckRestraints", Name: ""},
			{ Group: "ItemArms", Name: "CollarCuffs"},
			{ Group: "ItemNipplesPiercings", Name: "RoundPiercing", Type: "Chain"},
			{ Group: "ItemNipplesPiercings", Name: "RoundPiercing", Type: "WeightedChain"},
		],
		Activity: ["Bite", "Kiss", "Lick", "Nibble", "Caress", "MassageHands", "Choke", "TickleItem", "RubItem", "RollItem"],
		Asset: [
			{ Name: "LeatherCollar", Fetish: ["Leather"], DefaultColor: ["#000000", "Default"], Value: 20, Difficulty: 50, Time: 5, AllowLock: true, Layer: [
				{ Name: "Collar"},
				{ Name: "Ring"}
			] },
			{ Name: "LeatherCollarBell", Fetish: ["Leather"], Value: 30, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LeatherCollarBow", Fetish: ["Leather"], Value: 25, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "SlaveCollar", Value: -1, Difficulty: 50, Time: 5, Enable: false, Random: false, OwnerOnly: true, Effect: ["Lock"], AllowBlock: ["ItemMouth", "ItemMouth2", "ItemMouth3"], AllowEffect: ["GagNormal", "FixedHead"], AllowType: ["SteelPosture", "LeatherPosture", "PetCollar", "HighCollar", "LeatherCollarBell", "LeatherCollarBow", "MaidCollar", "BatCollar", "HighSecurityCollar", "SpikeCollar", "BordelleCollar", "LeatherCorsetCollar", "StrictPostureCollar", "LatexPostureCollar", "HeartCollar", "NobleCorsetCollar", "OrnateCollar", "LoveLeatherCollar", "SlenderSteelCollar", "HeartLinkChoker", "NeckRope"], Extended: true },
			{ Name: "ClubSlaveCollar", Value: -1, Difficulty: 50, Time: 5, Enable: false, Random: false, Effect: ["Lock"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{
				Name: "ShockCollar", Fetish: ["Leather", "Masochism"], Value: 80, Difficulty: 50, Time: 15, Random: false, AllowLock: true, BuyGroup: "ShockCollar", Effect: ["ReceiveShock"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], AllowType: ["", "Blink"], Extended: true, AlwaysExtend: true, Activity: "ShockItem", Layer: [
					{ Name: "Collar", HasType: false, AllowTypes: ["", "Blink"] },
					{ Name: "Light", AllowTypes: ["Blink"], HideColoring: true },
				], DynamicBeforeDraw: true, DynamicScriptDraw: true,
			},
			{
				Name: "AutoShockCollar", Fetish: ["Leather", "Masochism"], Value: -1, Difficulty: 50, Time: 15, Random: false, AllowLock: true, BuyGroup: "ShockCollar", Effect: ["ReceiveShock"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], AllowType: ["", "Blink", "Sensitivity"], Extended: true, AlwaysExtend: true, Activity: "ShockItem", Layer: [
					{ Name: "Collar", HasType: false, AllowTypes: ["", "Blink"] },
					{ Name: "Light", AllowTypes: ["Blink"], HideColoring: true },
				], DynamicBeforeDraw: true, DynamicScriptDraw: true,
			},
			{ Name: "ShockCollarRemote", Value: -1, Random: false, Wear: false, BuyGroup: "ShockCollar", Activity: "ShockItem", Effect: ["TriggerShock"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }, { Name: "Soft", Group: "Blush", Timer: 15 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "BatCollar", Fetish: ["Leather"], Value: 25, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "PostureCollar", Fetish: ["Leather"], Effect: ["FixedHead"], DefaultColor: ["#000000", "Default", "Default", "Default"], Value: 40, Difficulty: 50, Time: 5, AllowLock: true, Layer: [
				{ Name: "Collar" },
				{ Name: "Ring1", ColorGroup: "Rings"},
				{ Name: "Ring2", ColorGroup: "Rings"},
				{ Name: "Ring3", ColorGroup: "Rings"}

			] },
			{ Name: "SteelPostureCollar", Fetish: ["Metal"], Effect: ["FixedHead"], Value: 60, Difficulty: 50, Time: 5, AllowLock: true, Audio: "CuffsMetal" },
			{ Name: "DogCollar", Fetish: ["Leather", "Pet"], Value: 20, Difficulty: 50, Time: 5, Random: false, AllowLock: true },
			{ Name: "SpikeCollar", Fetish: ["Leather", "Metal", "Pet"], Value: 40, Difficulty: 50, Time: 5, AllowLock: true },
			{
				Name: "HighCollar", Fetish: ["Leather", "Metal"], Value: 50, Difficulty: 50, Time: 5, AllowLock: true,
				Layer: [
					{ Name: "Leather" },
					{ Name: "Rings" }
				]
			},
			{
				Name: "FuturisticCollar", Category: ["SciFi"], Fetish: ["Metal"], Value: 100, Difficulty: 50, Time: 12, Audio: "FuturisticApply", Random: false, DefaultColor: ["#40812C", "Default", "Default"], AllowLock: true, DrawLocks: false, Extended: true, AllowEffect:["BlockRemotes", "OpenPermission"],
				Layer: [
					{ Name: "Display" },
					{ Name: "Band" },
					{ Name: "Mesh",  HasType: false},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{ Name: "LeatherChoker", Fetish: ["Leather"], DefaultColor: ["Default", "#000000"], Value: 10, Difficulty: 50, Time: 5, AllowLock: true, Layer: [
				{ Name: "Metal" },
				{ Name: "Leather" }
			] },
			{ Name: "PetCollar", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "MaidCollar", Fetish: ["Lingerie"], Value: 30, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "BordelleCollar", Fetish: ["Leather"], Value: 30, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LoveLeatherCollar", Fetish: ["Leather"], Value: 50, Difficulty: 50, Time: 5, Random: false, AllowLock: true, LoverOnly: false },
			{ Name: "NobleCorsetCollar", Fetish: ["Leather"], Value: 45, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "StrictPostureCollar", Effect: ["FixedHead"], Fetish: ["Leather"], Priority: 38, Value: 60, Difficulty: 50, Time: 30, RemoveTime: 40, AllowLock: true },
			{ Name: "HeartCollar", Fetish: ["Leather"], Value: 50, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LeatherCorsetCollar", Fetish: ["Leather"], Priority: 38, Value: 75, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, IsRestraint: true, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", Effect: ["GagNormal"], },
			{ Name: "LatexPostureCollar", Fetish: ["Latex"], Priority: 38, Value: 80, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, IsRestraint: true, AllowLock: true, BuyGroup: "LatexPostureCollar", Effect: ["GagNormal", "FixedHead"], },
			{ Name: "HighSecurityCollar", Fetish: ["Metal"], Value: 70, Difficulty: 50, Time: 5, AllowLock: true, Audio: "LockLarge" },
			{
				Name: "OrnateCollar", Fetish: ["Metal"], Value: 80, Difficulty: 50, Time: 5, AllowLock: true, Audio: "CuffsMetal",
				Layer: [
					{ Name: "Collar" },
					{ Name: "Gem" }
				]
			},
			{ Name: "SlenderSteelCollar", Fetish: ["Metal"], Value: 30, Difficulty: 50, Time: 5, AllowLock: true, Audio: "CuffsMetal" },
			{ Name: "HeartLinkChoker", Fetish: ["Leather"], Value: 15, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "NeckRope", Fetish: ["Rope"], Value: 60, Difficulty: 50, Time: 5, AllowLock: false, BuyGroup: "HempRope", Audio: "RopeShort", DefaultColor: "#956B1C", ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 3 }, { Name: "Soft", Group: "Eyebrows", Timer: 3 }] },
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNeckAccessories",
		Category: "Item",
		Priority: 41,
		Default: false,
		Left: 0,
		Top: 190,
		Zone: [[100, 200, 100, 70]],
		Asset: [
			{
				Name: "CustomCollarTag", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: ["#aaa366", "#000000"], Prerequisite: "Collared", DynamicAfterDraw: true, Extended: true,
				Layer: [
					{ Name: "Tag" },
					{ Name: "Text" }
				]
			},
			{
				Name: "ElectronicTag", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#40812C", "Default", "#000000"], Prerequisite: "Collared", DynamicAfterDraw: true, Extended: true,
				Layer: [
					{ Name: "Display" },
					{ Name: "Tag" },
					{ Name: "Text" }
				]
			},
			{ Name: "CollarBell", Fetish: ["Metal", "Pet"], Value: 5, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared", Audio: "BellMedium" },
			{ Name: "CollarBow", Fetish: ["Lingerie"], Value: 5, Difficulty: 1, Time: 5, Random: false, Prerequisite: "Collared" },
			{
				Name: "CollarShockUnit", Fetish: ["Masochism"], Value: 80, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "ShockCollar", Prerequisite: "Collared", Effect: ["ReceiveShock"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }], AllowType: ["", "Blink"], Extended: true, AlwaysExtend: true, Activity: "ShockItem", Layer: [
					{ Name: "Unit", AllowTypes: ["", "Blink"], HasType: false },
					{ Name: "Light", AllowTypes: ["Blink"], HideColoring: true },
				], DynamicBeforeDraw: true, DynamicScriptDraw: true,
			},
			{
				Name: "CollarAutoShockUnit", Fetish: ["Masochism"], Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "ShockCollar", Prerequisite: "Collared", Effect: ["ReceiveShock"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }], AllowType: ["", "Blink", "Sensitivity"], Extended: true, AlwaysExtend: true, Activity: "ShockItem", Layer: [
					{ Name: "Unit", AllowTypes: ["", "Blink"], HasType: false },
					{ Name: "Light", AllowTypes: ["Blink"], HideColoring: true },
				], DynamicBeforeDraw: true, DynamicScriptDraw: true,
			},
			{ Name: "ShockCollarRemote", Value: -1, Random: false, Wear: false, BuyGroup: "ShockCollar", Activity: "ShockItem", Effect: ["TriggerShock"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }, { Name: "Soft", Group: "Blush", Timer: 15 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "CollarNameTag", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", AllowType: ["Angel", "BadGirl", "BindMe", "Bitch", "Boobs", "Cupcake", "Devil", "Dom", "Free", "FuckMe", "GagMe", "Goddess", "GoodGirl", "HoldMe", "Jewel", "Love", "Maid", "Meat", "Miss", "Mummy", "Nice", "Needy", "Owned", "Precious", "Pudding", "Queen", "Slave", "Slut", "Sub", "Sweetie", "Taken", "Toy", "Useless", "UseMe", "Whore"], Extended: true },
			{ Name: "CollarNameTagOval", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", AllowType: ["Babe", "Bandit", "Bimbo", "Bratty", "Chair", "Chaste", "Crazy", "Cumslut", "Cutie", "Damsel", "Doll", "EdgeMe", "Evil", "ForSale", "Greedy", "Happy", "Horny", "Kinky", "Lady", "LockMe", "Nude", "Nurse", "Nympho", "Painslut", "Pillow", "Punish", "Robber", "Sad", "Switch", "Table", "Ticklish", "Undress", "Victim", "Violent", "Worm", "AnalSlut", "ButtSlut"], Extended: true },
			{ Name: "CollarNameTagPet", Fetish: ["Pet"], Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", AllowType: ["Bunny", "Cat", "Dog", "Foxy", "Kitten", "Kitty", "Mochi", "Panda", "Pet", "PetMe", "Pixie", "Pony", "Puppy", "Racoon", "Sloth"], Extended: true },
			{ Name: "CollarNameTagLover", Value: -1, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", AllowType: ["Cookie", "Feather", "Lover", "Muffin"], Extended: true },
			{ Name: "CollarNameTagLivestock", Fetish: ["Pet"], Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, Prerequisite: "Collared", AllowType: ["Animal", "BreedMe", "Cow", "Meat", "MilkMe", "Pig"], Extended: true },
			{ Name: "CollarMoon", Value: 5, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarSun", Value: 10, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarLapis", Value: 10, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarPentagram", Value: 10, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarFlower", Value: 5, Difficulty: 1, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarRose", Value: 5, Difficulty: 1, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarCowBell", Fetish: ["Pet"], Value: 15, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarPupBone", Fetish: ["Pet"], Value: 25, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNeckRestraints",
		Category: "Item",
		Priority: 40,
		Default: false,
		IsRestraint: true,
		Left: 0,
		Top: 190,
		Zone: [[300, 200, 100, 70]],
		Asset: [
			{ Name: "CollarChainLong", Fetish: ["Metal"], Value: 30, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "CollarChain", Audio: "ChainLong", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["Kneel", "Horse", "KneelingSpread", "AllFours"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "CollarChainShort", Fetish: ["Metal"], Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "CollarChain", Audio: "ChainLong", Prerequisite: ["Collared", "AllFours", "NotSuspended", "NotMounted", "CanKneel"], AllowPose: ["AllFours"], SetPose: ["Kneel"], Effect: ["Freeze", "ForceKneel", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "CollarLeash", Fetish: ["Leather"], Value: 20, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Audio: "LockSmall", Prerequisite: "Collared", Effect: ["Leash"], AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "CollarLeashTaken", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Audio: "LockSmall", Prerequisite: "Collared", AllowPose: ["AllFours"], Effect: ["Tethered", "Leash"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "ChainLeash", Fetish: ["Leather"], Value: 25, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared", Audio: "LockSmall", AllowPose: ["AllFours"], Effect: ["Leash"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "ChainLeashTaken", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Audio: "LockSmall", Prerequisite: "Collared", AllowPose: ["AllFours"], Effect: ["Tethered", "Leash"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "CollarChainMedium", Fetish: ["Metal"], Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "CollarChain", Audio: "ChainLong", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["AllFours", "Horse", "Kneel", "KneelingSpread"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "CollarRopeLong", Fetish: ["Rope"], Value: 30, Difficulty: 5, Time: 5, Random: false, DefaultColor: "#956B1C", BuyGroup: "CollarRope", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["AllFours", "Horse", "Kneel", "KneelingSpread"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }]},
			{ Name: "CollarRopeShort", Fetish: ["Rope"], Value: -1, Difficulty: 5, Time: 5, Random: false, DefaultColor: "#956B1C", BuyGroup: "CollarRope", Prerequisite: ["Collared", "AllFours", "NotSuspended", "NotMounted", "CanKneel"], AllowPose: ["AllFours"], SetPose:["Kneel"], Effect: ["Freeze", "ForceKneel", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }, ]},
			{ Name: "CollarRopeMedium",  Fetish: ["Rope"], Value: -1, Difficulty: 6, Time: 5, Random: false, DefaultColor: "#956B1C", BuyGroup: "CollarRope", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["AllFours", "Horse", "Kneel", "KneelingSpread"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }]}
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemMouth",
		Category: "Item",
		Priority: 35,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 0,
		Effect: ["BlockMouth", "GagNormal"],
		Zone: [[100, 130, 100, 70]],
		Activity: ["Bite", "Kiss", "FrenchKiss", "PoliteKiss", "Lick", "Nibble", "Caress", "HandGag", "TickleItem", "RubItem", "RollItem", "PenetrateSlow", "PenetrateFast", "MoanGag", "MoanGagTalk", "MoanGagWhimper", "MoanGagGroan", "MoanGagAngry", "MoanGagGiggle", "GagKiss"],
		Asset: [
			{ Name: "ClothGag", Value: 15, Difficulty: -4, Time: 10, DefaultColor: "#B0B0B0", BuyGroup: "ClothGag", Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Extended: true },
			{
				Name: "WiffleGag", Fetish: ["Leather"], Value: 30, Difficulty: 1, Time: 10, AllowLock: true, BuyGroup: "WiffleGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["Default", "#FF6060"],
				Extended: true,
				Layer: [
					{ Name: "Strap" , HasType: false},
					{ Name: "Ball" },
				]
			},
			{
				Name: "HarnessBallGag", Fetish: ["Leather"], Value: 60, Difficulty: 6, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["#FF6060", "Default"], Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Harness", HasType: false},
				]
			},
			{
				Name: "Ball", Fetish: ["Pet"], Value: 5, Difficulty: 1, Time: 5, Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], AllowEffect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 20 }],
				DefaultColor: ["#E1D31C", "Default"],
				Layer: [
					{ Name: "Base" },
					{ Name: "Stripes", HasType: false},
				]
			},
			{
				Name: "HarnessPanelGag", Fetish: ["Leather"], Value: 80, Difficulty: 6, Time: 20, AllowLock: true, DefaultColor: "#404040", BuyGroup: "HarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "RingGag", Fetish: ["Leather", "Metal"], Value: 30, Difficulty: 2, Time: 5, AllowLock: true, DefaultColor: "#404040", BuyGroup: "RingGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Difficulty: -2, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape", Audio: "DuctTape", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], Extended: true },
			{ Name: "PacifierGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: 10, Difficulty: -50, Time: 2, Random: false, BuyGroup: "PacifierGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{
				Name: "HarnessPacifierGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: 50, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPacifierGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Harness" },
					{ Name: "Metal" },
					{ Name: "PacifierOuter" },
					{ Name: "PacifierInner" },
				]
			},
			{
				Name: "DusterGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DusterGag", Bonus: "KidnapBruteForce", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Block: ["ItemMouth2", "ItemMouth3"],
				Layer: [
					{ Name: "Duster" },
					{ Name: "Panel" },
				]
			},
			{
				Name: "CupholderGag", Fetish: ["Leather"], Priority: 42, Value: 30, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "CupholderGag", Hide: ["Mouth"], Extended: true, AlwaysExtend: true, AlwaysInteract: true, Effect: ["BlockMouth", "GagEasy"], Block: ["ItemMouth2", "ItemMouth3"],
				Layer: [
					{ Name: "Gag", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Holder", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Cup", HasType: false, AllowTypes: ["Cup"] }
				]
			},
			{
				Name: "HarnessPonyBits", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPonyBits", Prerequisite: "GagUnique", Bonus: "KidnapBruteForce",
				Layer: [
					{ Name: "Metal" },
					{ Name: "Straps" },
					{ Name: "Bobble" },
				]
			},
			{ Name: "PumpGag", Fetish: ["Leather"], Value: 100, Difficulty: 2, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "PumpGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true, HasType: false },
			{ Name: "KittyGag", Fetish: ["Pet"], Value: 20, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#A0A0A0", BuyGroup: "KittyGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "KittenHarnessPanelGag", Fetish: ["Leather", "Pet"], Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#A0A0A0", BuyGroup: "KittenHarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{
				Name: "CarrotGag", Fetish: ["Leather", "Pony"], Value: 40, Difficulty: 3, Time: 15, Random: false, AllowLock: true, BuyGroup: "CarrotGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Carrot" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "MuzzleGag", Fetish: ["Leather"], Value: 70, Difficulty: 6, Time: 20, AllowLock: true, DefaultColor: "#404040", BuyGroup: "MuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Layer: [
					{ Name: "Muzzle" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "FuturisticPanelGag", Category: ["SciFi"], Fetish: ["Metal"], Value: 100, Difficulty: 4, Time: 15, Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#50913C", "Default"], BuyGroup: "FuturisticPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth"], AllowEffect: ["BlockMouth", "GagVeryLight", "LightBall", "GagMedium", "GagTotal"], AllowType: ["Padded", "LightBall", "Ball", "Plug", "AutoPunish", "AutoPunishUndoTime", "AutoPunishUndoTimeSetting", "OriginalSetting", "ChatMessage"], HideItem: ["ItemNoseNoseRing"], Extended: true, AlwaysExtend: true,DynamicScriptDraw: true,DynamicBeforeDraw: true, Audio: "FuturisticApply",
				Layer: [
					{ Name: "Ball", AllowColorize: true, HasType: false },
					{ Name: "Mask" , AllowColorize: true, HasType: false },
					{ Name: "Light" , AllowColorize: true, AllowTypes: ["", "LightBall", "Ball", "Plug", "Blink"]},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, ParentGroup: null},
				]
			},
			{
				Name: "FuturisticHarnessPanelGag", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 6, Time: 15, Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#50913C", "Default"], BuyGroup: "FuturisticPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth"], AllowEffect: ["BlockMouth", "GagVeryLight", "GagMedium", "GagTotal"], AllowType: ["Padded", "LightBall", "Ball", "Plug", "AutoPunish", "AutoPunishUndoTime", "AutoPunishUndoTimeSetting", "OriginalSetting", "ChatMessage"], HideItem: ["ItemNoseNoseRing"], Extended: true, AlwaysExtend: true,DynamicScriptDraw: true,DynamicBeforeDraw: true, Audio: "FuturisticApply",
				Layer: [
					{ Name: "Ball", AllowColorize: true, HasType: false },
					{ Name: "Straps" , AllowColorize: true, HasType: false },
					{ Name: "Mask" , AllowColorize: true, HasType: false },
					{ Name: "Light" , AllowColorize: true, AllowTypes: ["", "LightBall", "Ball", "Plug", "Blink"]},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, ParentGroup: null},
				]
			},
			{
				Name: "FuturisticHarnessBallGag", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 6, Time: 15, Random: false, AllowLock: true, DrawLocks: false, DefaultColor: ["#50913C", "Default", "Default", "Default"], BuyGroup: "FuturisticPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], AllowEffect: ["BlockMouth", "GagLight", "GagMedium", "GagTotal"], AllowType: ["LightBall", "Ball", "Plug", "AutoPunish", "AutoPunishUndoTime", "AutoPunishUndoTimeSetting", "OriginalSetting", "ChatMessage"], Extended: true, AlwaysExtend: true,DynamicScriptDraw: true,DynamicBeforeDraw: true, Audio: "FuturisticApply",
				Layer: [
					{ Name: "Ball", AllowColorize: true, HasType: false },
					{ Name: "Mask" , AllowColorize: true, HasType: false },
					{ Name: "Straps" , AllowColorize: true, HasType: false },
					{ Name: "Light" , AllowColorize: true, AllowTypes: ["", "LightBall", "Ball", "Plug", "Blink"]},
					{ Name: "Lock", LockLayer: true,AllowColorize: true, ParentGroup: null},
					{ Name: "BallHighlights", AllowColorize: false, HasType: false },
				]
			},
			{ Name: "RegularSleepingPill", Value: -1, Enable: false, Wear: false, Bonus: "KidnapSneakiness" },
			{
				Name: "PantiesMask", Fetish: ["Lingerie"], Value: 20, Time: 15, Random: false, BuyGroup: "PantiesMask", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], HideItem: ["ItemNoseNoseRing"], Layer: [
					{ Name: "DarkStripes" },
					{ Name: "LightStripes" },
				]
			},
			{
				Name: "PlugGag", Fetish: ["Leather"], Value: 100, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "PlugGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["GagMedium"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true,
				Layer: [
					{ Name: "Strap", AllowColorize: true, HasType: false },
					{ Name: "Tongue", AllowColorize: false, HasType: false },
					{ Name: "Close", CopyLayerColor: "Strap", AllowColorize: true, AllowTypes: ["Plug"] }
				]
			},
			{
				Name: "DildoGag", Fetish: ["Leather"], Priority: 42, Value: 60, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DildoGag", Prerequisite: "GagUnique", AllowActivity: ["Penetrate"], Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], Block: ["ItemMouth2", "ItemMouth3"],
				DefaultColor: ["Default", "#404040"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Dildo" },
				]
			},
			{
				Name: "BoneGag", Fetish: ["Leather"], Value: 50, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "BoneGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "ChopstickGag", Fetish: ["Rope"], Value: 15, Difficulty: 2, Time: 10, BuyGroup: "ChopstickGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Chopsticks", AllowColorize: true },
					{ Name: "Tongue", AllowColorize: false }
				]
			},
			{
				Name: "BambooGag", Fetish: ["Rope"], Value: 30, Difficulty: 6, Time: 10, BuyGroup: "BambooGag", Prerequisite: "GagUnique", Hide: ["Mouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["Default", "#A07858"],
				Layer: [
					{ Name: "Rod" },
					{ Name: "Rope" },
				]
			},
			{
				Name: "HarnessBallGag1", Fetish: ["Leather"], Value: 75, Difficulty: 6, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag1", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap" },
				]
			},
			{
				Name: "PumpkinGag", Fetish: ["Leather"], Value: 40, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "PumpkinGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Pumpkin" },
					{ Name: "Straps" },
					{ Name: "Rings" },
				]
			},
			{
				Name: "LipGag", Fetish: ["Leather"], Value: 40, Difficulty: 2, Time: 5, DefaultColor: ["#cc3333", "Default", "Default"], AllowLock: true, BuyGroup: "LipGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagLight", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Lips", AllowColorize: true },
					{ Name: "Straps", AllowColorize: true },
					{ Name: "Rings", AllowColorize: true },
				]
			},
			{
				Name: "SpiderGag", Fetish: ["Leather", "Metal"], Value: 45, Difficulty: 4, Time: 5, AllowLock: true, BuyGroup: "SpiderGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "ClothStuffing", Value: 10, Difficulty: -20, Time: 5, BuyGroup: "ClothStuffing", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"],
				Layer: [
					{ Name: "Cheeks", AllowColorize: false },
					{ Name: "Cloth", AllowColorize: true }
				]
			},
			{
				Name: "PantyStuffing", Fetish: ["Lingerie"], Value: 10, Difficulty: -20, Time: 5, DefaultColor: "#900000", BuyGroup: "PantyStuffing", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"],
				Layer: [
					{ Name: "Lips", AllowColorize: false },
					{ Name: "Cloth", AllowColorize: true }
				]
			},
			{
				Name: "LargeDildo", Value: 20, Difficulty: -20, Time: 5, DefaultColor: "#333333", BuyGroup: "PenisDildo", Hide: ["Mouth"], ExpressionTrigger: [{ Name: "Raised", Group: "Eyebrows", Timer: 10 }],
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Lips", AllowColorize: false }
				]
			},
			{ Name: "ChloroformCloth", Value: 40, Time: 2, Random: false, Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 20 }, { Name: "Soft", Group: "Eyebrows", Timer: 180 }, { Name: "Wink", Group: "Eyes", Timer: 180 }] },
			{ Name: "ScarfGag", Value: 15, Time: 10, BuyGroup: "ScarfGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "LewdGag", Value: 70, Time: 10, Random: false, AllowLock: true, BuyGroup: "LewdGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "DeepthroatGag", Fetish: ["Leather"], Value: 55, Difficulty: 5, Time: 15, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "DeepthroatGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "Raised", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "LeatherCorsetCollar", Fetish: ["Leather"], Value: 75, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck"] },
			{ Name: "LatexPostureCollar", Fetish: ["Latex"], Effect: ["FixedHead","BlockMouth","GagNormal"], Value: 80, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "LatexPostureCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck"] },
			{
				Name: "BitGag", Fetish: ["Leather", "Pony"], Value: 40, Difficulty: 4, Time: 20, AllowLock: true, BuyGroup: "BitGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bit" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "XLBoneGag", Fetish: ["Leather", "Pet"], Value: 60, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "XLBoneGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{ Name: "DogMuzzleExposed", Fetish: ["Leather", "Pet"], Value: 50, Difficulty: 7, Time: 10, Random: false, AllowLock: true, Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Block: ["ItemMouth2", "ItemMouth3"] },
			{
				Name: "FoxyHarnessPanelGag", Fetish: ["Leather", "Pet"], Value: 40, Difficulty: 6, Time: 20, Random: false, AllowLock: true, Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Block: ["ItemMouth2", "ItemMouth3"],
				Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "BallGag", Fetish: ["Leather"], Value: 40, Difficulty: 4, Time: 10, AllowLock: true, BuyGroup: "BallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap", HasType: false},
				]
			},
			{
				Name: "TongueStrapGag", Fetish: ["Leather", "Metal"], Value: 35, Difficulty: 4, Time: 15, AllowLock: true, BuyGroup: "TongueStrapGag", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "BallGagMask", Fetish: ["Leather"], Value: 90, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "BallGagMask", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Ball" },
				]
			},
			{
				Name: "HookGagMask", Fetish: ["Leather"], Value: 70, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "HookGagMask", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "DildoPlugGag", Fetish: ["Leather"], Value: 100, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "DildoPlugGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true,
				Layer: [
					{ Name: "Strap", AllowColorize: true, HasType: false, },
					{ Name: "Tongue", AllowColorize: false, HasType: false },
					{ Name: "Close", AllowColorize: true, AllowTypes: ["Plug"] }
				]
			},
			{ Name: "SteelMuzzleGag", Fetish: ["Metal"], Value: 80, Difficulty: 8, Time: 30, AllowLock: true, Audio: "CuffsMetal", BuyGroup: "SteelMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"] },
			{ Name: "StitchedMuzzleGag", Fetish: ["Leather"], Value: 60, Difficulty: 5, Time: 15, AllowLock: true, BuyGroup: "StitchedMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "LatexBallMuzzleGag", Fetish: ["Latex"], Value: 65, Difficulty: 6, Time: 15, AllowLock: true, BuyGroup: "LatexBallMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"] },
			{
				Name: "SockStuffing", Value: 10, Difficulty: -20, Time: 5, DefaultColor: "#FFFFFF", BuyGroup: "SockStuffing", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"],
				Layer: [
					{ Name: "Lips", AllowColorize: false },
					{ Name: "Cloth", AllowColorize: true }
				]
			},
			{ Name: "GasMaskGag", Fetish: ["Leather"], Priority: 53, Value: 40, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "GasMaskGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth"], Block: ["ItemMouth2", "ItemMouth3"],
				Layer: [
					{ Name: "Mask"},
					{ Name: "Sides"},
					{ Name: "Highlights"},
				]
			},
			{ Name: "WebGag", Fetish: ["Tape"], Value: 30, Difficulty: 3, Time: 5, RemoveTime: 10, BuyGroup: "WebGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "RopeGag", Fetish: ["Rope"], Value: 60, Difficulty: 3, Time: 20, RemoveTime: 10, BuyGroup: "HempRope", Audio: "RopeShort", Prerequisite: "GagUnique", DefaultColor: "#956B1C", Effect: ["BlockMouth", "GagLight"] },
			{ Name: "MilkBottle", Category: ["ABDL"], Fetish: ["ABDL"], Priority: 42, Value: 30, Difficulty: -50, Time: 1, Random: false, AllowLock: false, Left: 199, Top: 0, BuyGroup: "MilkBottle", Prerequisite: "GagUnique", Effect: ["GagVeryLight"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }], ParentGroup: null, Extended: true },
			{
				Name: "MedicalMask", Value: 25, Time: 10, Random: false, BuyGroup: "MedicalMask", Hide: ["Mouth"], Effect: ["BlockMouth"], HideItem: ["ItemNoseNoseRing"],
				Layer: [
					{ Name: "Inner" },
					{ Name: "Outer" },
				]
			},
			{ Name: "RegressedMilk", Category: ["ABDL"], Fetish: ["ABDL"], Value: -1, Time: 10, IsRestraint: false,Random: false, Visible: false, BuyGroup: "RegressedMilk", Block: [], Effect: ["RegressedTalk"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }]},
			{
				Name: "PrisonLockdownGag", Value: -1, Difficulty: 5, Time: 20, AllowLock: true, BuyGroup: "PrisonLockdownSuit", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"],
				DefaultColor: ["#8c4309", "Default"],
				Layer: [
					{ Name: "Mask" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "ShoeGag", Fetish: ["Leather"], Priority: 42, Value: 30, Difficulty: 4, Time: 20, DefaultColor: ["Default", "#000000" ], Random: false, BuyGroup: "ShoeGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 25 }, { Name: "Daydream", Group: "Eyes", Timer: 10 }], Layer: [
					{ Name: "Shoe" },
					{ Name: "Strap" },
				]
			},
			{
				Name: "FunnelGag", Value: 50, Difficulty: 4, Time: 20, Random: false, Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["OpenMouth", "GagMedium"], Block: ["ItemMouth2", "ItemMouth3", "ItemHood"], Extended: true, Layer: [
					{ Name: "Straps", AllowColorize: true, HasType: false },
					{ Name: "Base", AllowColorize: false, HasType: false },
					{ Name: "Funnel", Priority: 55, AllowColorize: false, AllowTypes: ["Funnel"] }
				]
			},
			{ Name: "PlasticWrap", Value: 100, Difficulty: 4, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", Effect: ["BlockMouth", "GagLight"]},
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemMouth2",
		Category: "Item",
		Priority: 36,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 0,
		Block: ["ItemMouth"],
		Effect: ["BlockMouth", "GagNormal"],
		Zone: [[200, 130, 100, 70]],
		DynamicGroupName: "ItemMouth",
		Asset: [
			{ Name: "ClothGag", Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#B0B0B0", BuyGroup: "ClothGag", Prerequisite: "GagFlat", Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Extended: true },
			{
				Name: "WiffleGag", Fetish: ["Leather"], Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "WiffleGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["Default", "#FF6060"],
				Extended: true,
				Layer: [
					{ Name: "Strap" , HasType: false},
					{ Name: "Ball" },
				]
			},
			{
				Name: "HarnessBallGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessBallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["#FF6060", "Default"],
				Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Harness", HasType: false},
				]
			},
			{
				Name: "HarnessPanelGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "HarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "RingGag", Value: -1, Difficulty: 2, Time: 5, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "RingGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Fetish: ["Tape"], Value: -1, Difficulty: -2, Time: 10, RemoveTime: 5, Random: false, BuyGroup: "DuctTape", Audio: "DuctTape", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], Extended: true },
			{
				Name: "HarnessPacifierGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPacifierGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Harness" },
					{ Name: "Metal" },
					{ Name: "PacifierOuter" },
					{ Name: "PacifierInner" },
				]
			},
			{
				Name: "DusterGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DusterGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Block: ["ItemMouth", "ItemMouth3"],
				Layer: [
					{ Name: "Duster" },
					{ Name: "Panel" },
				]
			},
			{
				Name: "CupholderGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "CupholderGag", Hide: ["Mouth"], Extended: true, AlwaysExtend: true, AlwaysInteract: true, Effect: ["BlockMouth", "GagEasy"], Block: ["ItemMouth", "ItemMouth3"],
				Layer: [
					{ Name: "Gag", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Holder", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Cup", HasType: false, AllowTypes: ["Cup"] }
				]
			},
			{
				Name: "HarnessPonyBits", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPonyBits", Prerequisite: "GagUnique",
				Layer: [
					{ Name: "Metal" },
					{ Name: "Straps" },
					{ Name: "Bobble" },
				]
			},
			{ Name: "KittyGag", Fetish: ["Pet"], Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#A0A0A0", BuyGroup: "KittyGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "KittenHarnessPanelGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#A0A0A0", BuyGroup: "KittenHarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{
				Name: "CarrotGag", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 3, Time: 15, Random: false, AllowLock: true, BuyGroup: "CarrotGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Carrot" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "MuzzleGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "MuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Layer: [
					{ Name: "Muzzle" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "PantiesMask", Fetish: ["Lingerie"], Value: -1, Time: 15, Random: false, BuyGroup: "PantiesMask", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], Layer: [
					{ Name: "DarkStripes" },
					{ Name: "LightStripes" },
				]
			},
			{
				Name: "DildoGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DildoGag", Prerequisite: "GagFlat", AllowActivity: ["Penetrate"], Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], Block: ["ItemMouth", "ItemMouth3"],
				DefaultColor: ["Default", "#404040"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Dildo" },
				]
			},
			{
				Name: "BoneGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "BoneGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "HarnessBallGag1", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag1", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap" },
				]
			},
			{
				Name: "PumpkinGag", Fetish: ["Leather"], Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "PumpkinGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Pumpkin" },
					{ Name: "Straps" },
					{ Name: "Rings" },
				]
			},
			{
				Name: "LipGag", Fetish: ["Leather"], Value: -1, Difficulty: 2, Time: 5, DefaultColor: ["#cc3333", "Default", "Default"], Random: false, AllowLock: true, BuyGroup: "LipGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagLight", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Lips", AllowColorize: true },
					{ Name: "Straps", AllowColorize: true },
					{ Name: "Rings", AllowColorize: true },
				]
			},
			{
				Name: "SpiderGag", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 4, Time: 5, Random: false, AllowLock: true, BuyGroup: "SpiderGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "ChloroformCloth", Value: -1, Time: 2, Random: false, BuyGroup: "ChloroformCloth", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 20 }, { Name: "Soft", Group: "Eyebrows", Timer: 180 }, { Name: "Wink", Group: "Eyes", Timer: 180 }] },
			{ Name: "ScarfGag", Value: -1, Time: 10, Random: false, BuyGroup: "ScarfGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "LewdGag", Value: -1, Time: 10, Random: false, AllowLock: true, BuyGroup: "LewdGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }], },
			{ Name: "LeatherCorsetCollar", Fetish: ["Leather"], Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck", "ItemMouth"], },
			{ Name: "LatexPostureCollar", Fetish: ["Latex"], Effect: ["FixedHead", "BlockMouth", "GagNormal"], Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "LatexPostureCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck", "ItemMouth"], },
			{
				Name: "BitGag", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "BitGag", Prerequisite: "GagUnique", ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bit" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "XLBoneGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "XLBoneGag", Prerequisite: "GagUnique", ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "BallGag", Fetish: ["Leather"], Value: -1, Difficulty: 4, Time: 10, AllowLock: true, BuyGroup: "BallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap", HasType: false},
				]
			},
			{
				Name: "BallGagMask", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "BallGagMask", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Ball" },
				]
			},
			{ Name: "SteelMuzzleGag", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 8, Time: 30, AllowLock: true, Audio: "CuffsMetal", BuyGroup: "SteelMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], },
			{ Name: "StitchedMuzzleGag", Fetish: ["Leather"], Value: -1, Difficulty: 5, Time: 15, AllowLock: true, BuyGroup: "StitchedMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], },
			{ Name: "LatexBallMuzzleGag", Fetish: ["Latex"], Value: -1, Difficulty: 6, Time: 15, AllowLock: true, BuyGroup: "LatexBallMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], },
			{ Name: "GasMaskGag", Fetish: ["Leather"], Priority: 53, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "GasMaskGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth"], Prerequisite: "GagFlat", Block: ["ItemMouth", "ItemMouth3"],
				Layer: [
					{ Name: "Mask"},
					{ Name: "Sides"},
					{ Name: "Highlights"},
				]
			},
			{ Name: "WebGag", Fetish: ["Tape"], Value: -1, Difficulty: 3, Time: 5, RemoveTime: 10, BuyGroup: "WebGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], },
			{ Name: "RopeGag", Fetish: ["Rope"], Value: -1, Difficulty: 3, Time: 20, RemoveTime: 10, Audio: "RopeShort", Prerequisite: "GagUnique", DefaultColor: "#956B1C", BuyGroup: "HempRope", Effect: ["BlockMouth", "GagLight"], },
			{
				Name: "MedicalMask", Value: -1, Time: 10, Random: false, BuyGroup: "MedicalMask", Hide: ["Mouth"], Effect: ["BlockMouth"], HideItem: ["ItemNoseNoseRing"],
				Layer: [
					{ Name: "Inner" },
					{ Name: "Outer" },
				]
			},
			{ Name: "RegressedMilk", Category: ["ABDL"], Fetish: ["ABDL"], Value: -1, Time: 10, IsRestraint: false,Random: false, Visible: false, BuyGroup: "RegressedMilk", Block: [], Effect: ["RegressedTalk"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }]},
			{
				Name: "PrisonLockdownGag", Value: -1, Difficulty: 5, Time: 20, AllowLock: true, BuyGroup: "PrisonLockdownSuit", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"],
				DefaultColor: ["#8c4309", "Default"],
				Layer: [
					{ Name: "Mask" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "ShoeGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, DefaultColor: ["Default", "#000000"], Random: false, BuyGroup: "ShoeGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], Block: ["ItemMouth", "ItemMouth3"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 25 }, { Name: "Daydream", Group: "Eyes", Timer: 10 }], Layer: [
					{ Name: "Shoe" },
					{ Name: "Strap" },
				]
			},
			{ Name: "PlasticWrap", Value: 100, Difficulty: 4, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", Effect: ["BlockMouth", "GagLight"]},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemMouth3",
		Category: "Item",
		Priority: 37,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 0,
		Block: ["ItemMouth", "ItemMouth2"],
		Effect: ["BlockMouth", "GagNormal"],
		Zone: [[300, 130, 100, 70]],
		DynamicGroupName: "ItemMouth",
		Asset: [
			{ Name: "ClothGag", Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#B0B0B0", BuyGroup: "ClothGag", Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Extended: true },
			{
				Name: "WiffleGag", Fetish: ["Leather"], Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "WiffleGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["Default", "#FF6060"],
				Extended: true,
				Layer: [
					{ Name: "Strap" , HasType: false},
					{ Name: "Ball" },
				]
			},
			{
				Name: "HarnessBallGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessBallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				DefaultColor: ["#FF6060", "Default"], Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Harness", HasType: false},
				]
			},
			{
				Name: "HarnessPanelGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "HarnessPanelGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Layer: [
					{ Name: "Panel" },
					{ Name: "Straps" },
					{ Name: "Metal" },
				]
			},
			{
				Name: "RingGag", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 2, Time: 5, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "RingGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Fetish: ["Tape"], Value: -1, Difficulty: -2, Time: 10, RemoveTime: 5, Random: false, BuyGroup: "DuctTape", Audio: "DuctTape", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], Extended: true },
			{
				Name: "HarnessPacifierGag", Category: ["ABDL"], Fetish: ["ABDL", "Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPacifierGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Harness" },
					{ Name: "Metal" },
					{ Name: "PacifierOuter" },
					{ Name: "PacifierInner" },
				]
			},
			{
				Name: "DusterGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DusterGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"],
				Layer: [
					{ Name: "Duster" },
					{ Name: "Panel" },
				]
			},
			{
				Name: "CupholderGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "CupholderGag", Hide: ["Mouth"], Extended: true, AlwaysExtend: true, AlwaysInteract: true, Effect: ["BlockMouth", "GagEasy"],
				Layer: [
					{ Name: "Gag", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Holder", HasType: false, AllowTypes: ["", "Cup"] },
					{ Name: "Cup", HasType: false, AllowTypes: ["Cup"] }
				]
			},
			{
				Name: "HarnessPonyBits", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPonyBits", Prerequisite: "GagUnique",
				Layer: [
					{ Name: "Metal" },
					{ Name: "Straps" },
					{ Name: "Bobble" },
				]
			},
			{ Name: "KittyGag", Fetish: ["Pet"], Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#A0A0A0", BuyGroup: "KittyGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "KittenHarnessPanelGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#A0A0A0", BuyGroup: "KittenHarnessPanelGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{
				Name: "CarrotGag", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 3, Time: 15, Random: false, AllowLock: true, BuyGroup: "CarrotGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Carrot" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "MuzzleGag", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "MuzzleGag", Hide: ["Mouth"], Layer: [
					{ Name: "Muzzle" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "PantiesMask", Fetish: ["Lingerie"], Value: -1, Time: 15, Random: false, BuyGroup: "PantiesMask", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], Layer: [
					{ Name: "DarkStripes" },
					{ Name: "LightStripes" },
				]
			},
			{
				Name: "DildoGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DildoGag", Prerequisite: "GagFlat", AllowActivity: ["Penetrate"], Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"],
				DefaultColor: ["Default", "#404040"],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Dildo" },
				]
			},
			{
				Name: "BoneGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "BoneGag", Prerequisite: "GagUnique", Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "HarnessBallGag1", Value: -1, Difficulty: 6, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag1", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap" },
				]
			},
			{
				Name: "PumpkinGag", Fetish: ["Leather"], Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "PumpkinGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Pumpkin" },
					{ Name: "Straps" },
					{ Name: "Rings" },
				]
			},
			{
				Name: "LipGag", Fetish: ["Leather"], Value: -1, Difficulty: 2, Time: 5, DefaultColor: ["#cc3333", "Default", "Default"], Random: false, AllowLock: true, BuyGroup: "LipGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagLight", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Lips", AllowColorize: true },
					{ Name: "Straps", AllowColorize: true },
					{ Name: "Rings", AllowColorize: true },
				]
			},
			{
				Name: "SpiderGag", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 4, Time: 5, Random: false, AllowLock: true, BuyGroup: "SpiderGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["GagEasy", "OpenMouth"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", Priority: 10, AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "ChloroformCloth", Value: -1, Time: 2, Random: false, BuyGroup: "ChloroformCloth", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 20 }, { Name: "Soft", Group: "Eyebrows", Timer: 180 }, { Name: "Wink", Group: "Eyes", Timer: 180 }], },
			{ Name: "ScarfGag", Value: -1, Time: 10, Random: false, BuyGroup: "ScarfGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], },
			{ Name: "LewdGag", Value: -1, Time: 10, Random: false, AllowLock: true, BuyGroup: "LewdGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }], },
			{ Name: "LeatherCorsetCollar", Fetish: ["Leather"], Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck", "ItemMouth", "ItemMouth2"], },
			{ Name: "LatexPostureCollar", Fetish: ["Latex"], Effect: ["FixedHead", "BlockMouth", "GagNormal"], Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "LatexPostureCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], Block: ["ItemNeck", "ItemMouth", "ItemMouth2"], },
			{
				Name: "BitGag", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "BitGag", Prerequisite: "GagUnique", ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bit" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "XLBoneGag", Fetish: ["Leather", "Pet"], Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "XLBoneGag", Prerequisite: "GagUnique", ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Bone" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "BallGag", Fetish: ["Leather"], Value: -1, Difficulty: 4, Time: 10, AllowLock: true, BuyGroup: "BallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Extended: true,
				Layer: [
					{ Name: "Ball" },
					{ Name: "Strap", HasType: false},
				]
			},
			{
				Name: "BallGagMask", Fetish: ["Leather"], Value: -1, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "BallGagMask", Prerequisite: "GagUnique", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap" },
					{ Name: "Ball" },
				]
			},
			{ Name: "SteelMuzzleGag", Fetish: ["Metal"], Value: -1, Difficulty: 8, Time: 30, AllowLock: true, Audio: "CuffsMetal", BuyGroup: "SteelMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"] },
			{ Name: "FuturisticMuzzle", Category: ["SciFi"], Fetish: ["Metal"], Value: -1, Difficulty: 8, Time: 30, BuyGroup: "FuturisticPanelGag", Random: false, AllowLock: true, Audio: "FuturisticApply", Effect: ["BlockMouth", "GagLight"], Prerequisite: "GagFlat", Hide: ["Mouth", "ItemNoseNoseRing"], DynamicGroupName: "ItemMouth3" },
			{ Name: "StitchedMuzzleGag", Fetish: ["Leather"], Value: -1, Difficulty: 5, Time: 15, AllowLock: true, BuyGroup: "StitchedMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "LatexBallMuzzleGag", Fetish: ["Latex"], Value: -1, Difficulty: 6, Time: 15, AllowLock: true, BuyGroup: "LatexBallMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"] },
			{ Name: "GasMaskGag", Fetish: ["Leather"], Priority: 53, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "GasMaskGag", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth"], Prerequisite: "GagFlat", Block: ["ItemMouth", "ItemMouth2"],
				Layer: [
					{ Name: "Mask"},
					{ Name: "Sides"},
					{ Name: "Highlights"},
				]
			},
			{ Name: "WebGag", Fetish: ["Tape"], Value: -1, Difficulty: 3, Time: 5, RemoveTime: 10, BuyGroup: "WebGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "RopeGag", Fetish: ["Rope"], Value: -1, Difficulty: 3, Time: 20, RemoveTime: 10, Audio: "RopeShort", Prerequisite: "GagUnique", DefaultColor: "#956B1C", BuyGroup: "HempRope", Effect: ["BlockMouth", "GagLight"] },
			{
				Name: "MedicalMask", Value: -1, Time: 10, Random: false, BuyGroup: "MedicalMask", Hide: ["Mouth"], Effect: ["BlockMouth"], HideItem: ["ItemNoseNoseRing"],
				Layer: [
					{ Name: "Inner" },
					{ Name: "Outer" },
				]
			},
			{ Name: "RegressedMilk", Category: ["ABDL"], Fetish: ["ABDL"], Value: -1, Time: 10, IsRestraint: false,Random: false, Visible: false, BuyGroup: "RegressedMilk", Block: [], Effect: ["RegressedTalk"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{
				Name: "PrisonLockdownGag", Value: -1, Difficulty: 5, Time: 20, AllowLock: true, BuyGroup: "PrisonLockdownSuit", Prerequisite: "GagFlat", DefaultColor: "#8c4309", Hide: ["Mouth"], HideItem: ["ItemNoseNoseRing"],
				Layer: [
					{ Name: "Mask" },
					{ Name: "Straps" },
				]
			},
			{
				Name: "ShoeGag", Fetish: ["Leather"], Priority: 42, Value: -1, Difficulty: 4, Time: 20, DefaultColor: ["Default", "#000000"], Random: false, BuyGroup: "ShoeGag", Prerequisite: "GagFlat", Hide: ["Mouth"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 25 }, { Name: "Daydream", Group: "Eyes", Timer: 10 }], Layer: [
					{ Name: "Shoe" },
					{ Name: "Strap" },
				]
			},
			{
				Name: "CageMuzzle", Fetish: ["Pet", "Metal"], Value: 30, Difficulty: 4, Time: 20, Random: false, AllowLock: true, Effect: ["BlockMouth"], DynamicGroupName: "ItemMouth3",
				Layer: [
					{ Name: "Strap" },
					{ Name: "Muzzle" },
				]
			},
			{ Name: "PlasticWrap", Value: 100, Difficulty: 4, Time: 30, RemoveTime: 25, BuyGroup: "PlasticWrap", Effect: ["BlockMouth", "GagLight"]},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemHead",
		Category: "Item",
		Priority: 44,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 20,
		Zone: [[175, 0, 150, 65]],
		Activity: ["Bite", "Kiss", "Slap", "Caress", "TakeCare", "Pet", "Pull", "Rub", "Nod", "Wiggle"],
		Asset: [
			{ Name: "ClothBlindfold", Value: 15, Time: 5, DefaultColor: "#A0A0A0", Hide: ["Glasses"], Effect: ["BlindLight", "Prone"] },
			{ Name: "LeatherBlindfold", Fetish: ["Leather"], Value: 30, Time: 5, AllowLock: true, DefaultColor: "#404040", Hide: ["Glasses"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "PaddedBlindfold", Fetish: ["Leather"], Value: 35, Time: 5, AllowLock: true, DefaultColor: ["#545454", "#808080"], Hide: ["Glasses"], Effect: ["BlindHeavy", "Prone"],
				Layer: [
					{ Name: "Trim", HasType: false},
					{ Name: "Base", HasType: false},
				]
			},
			{ Name: "InteractiveVisor", Category: ["SciFi"], Fetish: ["Metal"], Priority: 34, BuyGroup: "FuturisticVisor", Difficulty: 6, Value: 50, Time: 6, Random: false, AllowLock: true, Hide: ["ItemNoseNoseRing", "MaskFuturisticVisor"], Effect: [], AllowEffect: ["Prone", "BlindNormal", "BlindHeavy", "BlindLight"], AllowType: ["LightTint", "HeavyTint", "Blind"], Extended: true, AlwaysExtend: true, Audio: "FuturisticApply"},
			{ Name: "InteractiveVRHeadset", Difficulty: 6, Value: 80, Time: 6, Random: false, AllowLock: true, DrawLocks: false, Hide: ["ItemNoseNoseRing", "Mask", "Glasses"], Effect: [], AllowEffect: ["BlindHeavy", "Prone", "VRAvatars", "HideRestraints", "KinkyDungeonParty"], AllowType: ["Off", "AR", "FreeVR", "Gaming"], Extended: true, AlwaysExtend: true, Audio: "FuturisticApply", CustomBlindBackground: {"None" : "SynthWave", "FreeVR" : "SynthWave", "Gaming" : "Dungeon", "Off" : "", "AR" : ""},
				Layer: [
					{ Name: "Body", HasType: false},
					{ Name: "Display", HasType: false},
				]
			},
			{ Name: "LeatherSlimMask", Fetish: ["Leather"], Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied"], Hide: ["Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3"], Effect: ["BlindHeavy", "Prone", "GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNose"] },
			{ Name: "LeatherSlimMaskOpenMouth", Fetish: ["Leather"], Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied"], Hide: ["Glasses"], Effect: ["BlindHeavy", "Prone"], Block: ["ItemEars", "ItemNose"] },
			{ Name: "LeatherSlimMaskOpenEyes", Fetish: ["Leather"], Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied"], Hide: ["ItemMouth", "ItemMouth2", "ItemMouth3"], Effect: ["GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNose"] },
			{ Name: "StuddedBlindfold", Fetish: ["Leather", "Metal"], Value: -1, Difficulty: 2, Time: 5, AllowLock: true, DefaultColor: "#FF4040", Bonus: "KidnapSneakiness", Hide: ["Glasses"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "KittyBlindfold", Fetish: ["Pet"], Value: 25, Time: 5, AllowLock: true, DefaultColor: "#A0A0A0", Hide: ["Glasses"], Effect: ["BlindLight", "Prone"] },
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape", Audio: "DuctTape", Hide: ["Glasses"], AllowBlock: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHood", "ItemNose"], AllowEffect: ["BlindNormal", "Prone", "GagNormal", "BlockMouth"], AllowType: ["Wrap", "Mummy"], Effect: ["BlindNormal", "Prone"], Extended: true },
			{ Name: "SmallBlindfold", Fetish: ["Leather"], Value: 40, Time: 5, AllowLock: true, DefaultColor: "#404040", Hide: ["Glasses"], Effect: ["BlindLight", "Prone"] },
			{ Name: "FullBlindfold", Fetish: ["Latex"], Priority: 30, Value: 40, Difficulty: 6, Time: 5, AllowLock: true, DefaultColor: "#353535", Hide: ["Glasses"], Effect: ["BlindHeavy", "Prone"] },
			{ Name: "LewdBlindfold", Priority: 30, Value: 45, Time: 5, Random: false, AllowLock: true, Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "LatexBlindfold", Fetish: ["Latex"], Value: 35, Time: 5, AllowLock: true, Hide: ["Glasses", "Mask"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "FrilledSleepMask", Fetish: ["Lingerie"], Value: 5, Time: 5, Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"] },
			{ Name: "BlackoutLenses", Value: 60, Difficulty: 10, Random: false, DefaultColor: "#333333", OverrideBlinking: true, Hide: ["Glasses", "Eyes", "Eyes2", "Mask"], Block: [], Effect: ["BlindHeavy", "Prone"], AllowExpression: ["Closed"],
				Layer: [
					{ Name: "Left", MirrorExpression: "Eyes" },
					{ Name: "Right", MirrorExpression: "Eyes2" },
				]
			},
			{ Name: "WebBlindfold", Fetish: ["Tape"], Value: 50, Difficulty: 5, Time: 10, RemoveTime: 20, Random: false, Hide: ["Glasses", "Mask"], AllowBlock: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHood", "ItemNose"], AllowEffect: ["BlindHeavy", "GagNormal", "BlockMouth"], AllowType: ["Cocoon"], Effect: ["BlindLight", "Prone"], Extended: true },
			{ Name: "RopeBlindfold", Fetish: ["Rope"], Value: 60, Time: 15, DefaultColor: "#956B1C", BuyGroup: "HempRope", Audio: "RopeShort", Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"] },
			{ Name: "SleepMask", Value: 5, Time: 5, Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"] },
			{ Name: "PrisonLockdownBlindfold", Priority: 34, Value: -1, Time: 5, BuyGroup: "PrisonLockdownSuit", DefaultColor: "#77511f", Hide: ["Glasses"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "Pantyhose", Value: 10, Time: 5, Hide: ["Glasses", "Mask", "HairFront", "HairBack", "HairAccessory1", "HairAccessory2", "HairAccessory3"], BuyGroup: "Pantyhose", Effect: ["BlindLight", "Prone"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNose"] },
			{
				Name: "Snorkel", Priority: 55, Value: 30, Top: 30, Difficulty: 5, Time: 15, Random: false, AllowLock: true, Block: [],
				Layer: [
					{ Name: "Mask", AllowColorize: false },
					{ Name: "Tube", Priority: 56, AllowColorize: true },
				]
			},
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemNose",
		Category: "Item",
		Priority: 33,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 20,
		Zone: [[175, 65, 150, 65]],
		Activity: ["Lick", "Choke", "Nibble", "Bite", "Kiss", "Pinch", "Caress", "Pet", "Pull", "Cuddle", "Rub", "TickleItem", "RubItem", "Wiggle"],
		Asset: [
			{
				Name: "NoseHook", Fetish: ["Metal"], Priority: 26, Value: 25, Difficulty: 20, Time: 15, Random: false, AllowLock: true, BuyGroup: "Nosehook", Layer: [
					{ Name: "Band" },
					{ Name: "Hook" },
				]
			},
			{ Name: "NoseRing", Priority: 43, Fetish: ["Metal"], Value: 25, Difficulty: 10, Time: 15, Random: false, AllowLock: true, Left: 50, AllowEffect: ["Tethered", "Freeze", "ForceKneel", "IsChained", "Leash"], AllowType: ["ChainShort", "ChainLong", "Leash"], AllowPose: ["Kneel"], Extended: true },
			{ Name: "DuctTape", Fetish: ["Tape"], Value: 50, BuyGroup: "DuctTape", Audio: "DuctTape", Difficulty: 2, Time: 10, RemoveTime: 5},
			{ Name: "NosePlugs", Value: 20, Difficulty: 3, Time: 5, RemoveTime: 5},
			{ Name: "BarbelPiercing", Left: 124, Top: 50, Value: 20, Difficulty: 3, Time: 5, RemoveTime: 5},
			{
				Name: "PigNoseHook", Fetish: ["Metal"], Priority: 26, Value: -1, Difficulty: 30, Time: 15, Random: false, AllowLock: true, BuyGroup: "Nosehook", Layer: [
					{ Name: "Band" },
					{ Name: "Hook" },
				]
			},
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "ItemHood",
		Category: "Item",
		Priority: 45,
		Default: false,
		IsRestraint: true,
		Block: ["ItemHead", "ItemNose", "ItemEars"],
		Left: 150,
		Top: 20,
		Zone: [[325, 0, 75, 130]],
		Activity: ["TickleItem", "RubItem"],
		Asset: [
			{ Name: "LeatherHoodSealed", Fetish: ["Leather"], Value: 70, Difficulty: 5, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied", "CanUseAlphaHood"], HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["Head", "HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], Effect: ["BlindHeavy", "Prone", "GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"] },
			{ Name: "BlanketHood", Value: 50, Difficulty: 3, Time: 5, HideItem: ["ItemEarsFuturisticEarphones"], Hide: ["Head", "HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], Effect: ["BlindNormal", "Prone", "GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"] },
			{ Name: "PolishedSteelHood", Fetish: ["Metal"], Value: 85, Difficulty: 8, Time: 15, AllowLock: true, Audio: "LockLarge", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars"], HideItem: ["HatBand1", "HatBand2", "HatTiara1", "ItemEarsFuturisticEarphones"], Effect: ["BlindHeavy", "DeafLight", "Prone", "GagHeavy", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck", "ItemHead", "ItemNose", "ItemEars"] },
			{
				Name: "InflatedBallHood", Fetish: ["Latex"], Value: 65, Difficulty: 5, Time: 15, AllowLock: true, Prerequisite: ["GagUnique"], Extended: true, HasType: false,
				Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "Hat", "Mask", "ItemEars"],
				HideItem: ["ItemEarsFuturisticEarphones"],
				Effect: ["BlindHeavy", "DeafLight", "Prone", "BlockMouth"],
				AllowEffect: ["GagLight", "GagEasy", "GagMedium", "GagVeryHeavy", "BlockMouth"],
				AllowType: ["Light", "Inflated", "Bloated", "Maximum"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck", "ItemHead", "ItemNose", "ItemEars"],
			},
			{
				Name: "OldGasMask", Fetish: ["Leather"], Value: 85, Difficulty: 25, Time: 10, Random: false, AllowLock: true, Prerequisite: ["GasMask"], DefaultColor: "#313131", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones"], Effect: ["BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck", "ItemHead", "ItemNose", "ItemEars"], Extended: true, RemoveItemOnRemove: [{ Group: "ItemHoodAddon", Name: "" }], Layer: [
					{ Name: "Mask", AllowColorize: true },
					{ Name: "Light", AllowColorize: false }
				]
			},
			{
				Name: "KirugumiMask", Fetish: ["Latex"], Value: 50, Priority: 51, Difficulty: 15, Time: 10,
				Random: false, AllowLock: true, DrawLocks: false, Prerequisite: ["GasMask"], DefaultColor: ["#9A7F76", "Default"],
				Hide: ["Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Mask"],
				HideItem: ["ItemHeadSnorkel"],
				Effect: ["BlockMouth"],
				AllowEffect: ["BlindLight", "BlindHeavy", "Prone"],
				Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose", "ItemEars"],
				RemoveItemOnRemove: [{ Group: "ItemHoodAddon", Name: "" }],
				Layer: [
					{ Name: "Mask", AllowColorize: true, HasType: false },
					{ Name: "Blush1", AllowColorize: true, HasType: false, Left: 190, Top: 100, AllowModuleTypes:["b0"]},
					{ Name: "Blush2", AllowColorize: true, HasType: false, CopyLayerColor: "Blush1", Left: 190, Top: 100, AllowModuleTypes:["b1"]},
					{ Name: "Blush3", AllowColorize: true, HasType: false, CopyLayerColor: "Blush1", Left: 190, Top: 100, AllowModuleTypes:["b2"]},
					{ Name: "Blush4", AllowColorize: true, HasType: false, CopyLayerColor: "Blush1", Left: 190, Top: 100, AllowModuleTypes:["b3"]},
					{ Name: "Eyes1", AllowColorize: true, HasType: false, Left: 200, Top: 145, AllowModuleTypes:["e0"]},
					{ Name: "Eyes2", AllowColorize: true, HasType: false, CopyLayerColor: "Eyes1", Left: 200, Top: 145, AllowModuleTypes:["e1"]},
					{ Name: "Eyes3", AllowColorize: true, HasType: false, CopyLayerColor: "Eyes1", Left: 200, Top: 145, AllowModuleTypes:["e2"]},
					{ Name: "Eyes4", AllowColorize: true, HasType: false, CopyLayerColor: "Eyes1", Left: 200, Top: 145, AllowModuleTypes:["e3"]},
					// CopyLayerColor: "Back"
					{ Name: "Mouth1", AllowColorize: true, HasType: false, Left: 235, Top: 180, AllowModuleTypes:["m0"]},
					{ Name: "Mouth2", AllowColorize: true, HasType: false, CopyLayerColor: "Mouth1", Left: 235, Top: 180, AllowModuleTypes:["m1"]},
					{ Name: "Mouth3", AllowColorize: true, HasType: false, CopyLayerColor: "Mouth1", Left: 235, Top: 180, AllowModuleTypes:["m2"]},
					{ Name: "Mouth4", AllowColorize: true, HasType: false, CopyLayerColor: "Mouth1", Left: 235, Top: 180, AllowModuleTypes:["m3"]},

					{ Name: "Brows1", AllowColorize: false, HasType: false, Left: 200, Top: 120, AllowModuleTypes:["br0"]},
					{ Name: "Brows2", AllowColorize: false, HasType: false, CopyLayerColor: "Brows1", Left: 200, Top: 120, AllowModuleTypes:["br1"]},
					{ Name: "Brows3", AllowColorize: false, HasType: false, CopyLayerColor: "Brows1", Left: 200, Top: 120, AllowModuleTypes:["br2"]},
					{ Name: "Brows4", AllowColorize: false, HasType: false, CopyLayerColor: "Brows1", Left: 200, Top: 120, AllowModuleTypes:["br3"]},
				],
				Extended: true
			},
			{
				Name: "PumpkinHead", Priority: 54, Value: 40, Difficulty: 2, Time: 10, Random: false, AllowLock: false,  Hide: ["HairBack"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck", "ItemHead", "ItemNose", "ItemEars"],
				Alpha: [{ Masks: [[150, 0, 200, 80]] }],
				Layer: [
					{ Name: "Front", AllowColorize: true, Priority:54},
					{ Name: "Back", AllowColorize: true, Priority: 1 }
				]
			},
			{ Name: "SackHood", Fetish: ["Rope"], Value: 20, Difficulty: 3, Time: 5, Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Hat", "Mask", "ItemEars"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones"], Effect: ["Prone", "BlindHeavy", "BlockMouth"], Block: ["ItemEars", "ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose"] },
			{ Name: "LeatherHoodSensDep", Fetish: ["Leather"], Value: 100, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied", "CanUseAlphaHood"], HideItem: ["HatBand1", "HatBand2", "HatTiara1", "ItemEarsFuturisticEarphones"], Hide: ["Head", "HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], Effect: ["BlindHeavy", "DeafHeavy", "Prone", "GagHeavy", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"] },
			{
				Name: "LatexHoodOpenHair", Fetish: ["Latex"], Value: 45, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: ["Default", "#555555"], Prerequisite: ["NotHogtied", "CanUseAlphaHood"], HideItem: ["HatBand1", "HatBand2", "HatTiara1", "ItemEarsFuturisticEarphones"], Hide: ["HairFront", "HairBack", "Hat", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], Alpha: [{ Group: ["Head"], Masks: [[150, 50, 200, 87]] }], Block: ["ItemEars", "ItemHead", "ItemNose"], Layer: [
					{ Name: "Hair", InheritColor: "HairFront" },
					{ Name: "Hood" },
				]
			},
			{
				Name: "LeatherHood", Fetish: ["Leather"], Value: 60, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: ["#404040", "#404040", "#888"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones"], Effect: ["BlindHeavy", "DeafLight", "Prone", "GagNormal", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"], Layer: [
					{ Name: "Hood", AllowColorize: true },
					{ Name: "Collar", AllowColorize: true },
					{ Name: "Snaps", AllowColorize: false },
				]
			},
			{ Name: "LeatherHoodOpenEyes", Fetish: ["Leather"], Value: 40, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#404040", HideItem: ["HatBand1", "HatBand2", "HatTiara1", "ItemEarsFuturisticEarphones"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3"], Effect: ["GagLight", "BlockMouth"], Block: ["ItemHead", "ItemNose", "ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"] },
			{ Name: "GasMask", Fetish: ["Leather"], Value: 50, Difficulty: 25, Time: 10, Random: false, AllowLock: true, DefaultColor: "#585858", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones"], Effect: ["BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"] },
			{ Name: "DogHood", Fetish: ["Leather", "Pet"], Value: 60, Difficulty: 50, Time: 15, Random: false, AllowLock: true, HideItem: ["HatBand1", "HatBand2", "HatTiara1", "ItemEarsFuturisticEarphones"], DefaultColor: "#404040", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], Effect: ["GagNormal", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemHead", "ItemNose"] },
			{ Name: "FoxyMask", Fetish: ["Pet"], Value: 50, Difficulty: 2, Time: 15, Random: false, AllowLock: true, Effect: ["GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose"] },
			{ Name: "PonyHood", Fetish: ["Pony"], Value: -1, Difficulty: 50, Time: 15, Random: false, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones"], Effect: ["BlindLight", "GagNormal", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck", "ItemHead", "ItemNose"] },
			{ Name: "LeatherHoodOpenMouth", Fetish: ["Leather"], Value: 50, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "HairBack", "Glasses", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask"], HideItem: ["ItemHeadSnorkel",  "ItemEarsFuturisticEarphones"], Effect: ["Prone", "BlindHeavy"], Block: ["ItemEars", "ItemHead", "ItemNose"] },
			{ Name: "CanvasHood", Value: 50, Difficulty: 20, Time: 15, AllowLock: true, DefaultColor: ["#a5a095", "#ce7210"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "HairAccessory3", "Mask", "ItemEars"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones"], Effect: ["Prone", "BlindHeavy", "GagHeavy", "BlockMouth", "DeafLight"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNose", "ItemHead"], Extended: true, DynamicAfterDraw: true,
				Layer: [
					{ Name: "Hood" },
					{ Name: "Text" },
				]
			},
			{ Name: "Pantyhose", Value: 10, Time: 5, Hide: ["Glasses", "Mask", "HairFront", "HairBack", "HairAccessory1", "HairAccessory2", "HairAccessory3"], HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones"], BuyGroup: "Pantyhose", Effect: ["BlindLight", "Prone"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNose", "ItemHead"] },
			{
				Name: "GP9GasMask", Priority: 54, Value: 75, Difficulty: 25, Time: 10, HideItem: ["ItemHeadSnorkel", "ItemEarsFuturisticEarphones"], Random: false, Alpha: [{ Group: ["HairFront"], Masks: [[206, 115, 88, 70]] }], AllowLock: true, Effect: ["BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemHead", "ItemNose"], RemoveItemOnRemove: [{ Group: "ItemHoodAddon", Name: "" }], Layer: [
					{ Name: "Mouth", AllowColorize: true },
					{ Name: "Lens", AllowColorize: true },
					{ Name: "Mask", AllowColorize: true },
					{ Name: "Edges", AllowColorize: true },
				]
			},
			{ Name: "OpenFaceHood", Fetish: ["Latex"], Value: 35, Priority: 40, Difficulty: 5, Time: 15, AllowLock: false, DefaultColor: "#404040", BuyGroup: "OpenFace", Block: ["ItemEars"], Hide: ["HairFront", "HairBack", "Ears"] },
			{ Name: "GwenHood", Fetish: ["Leather"], Value: 35, Difficulty: 5, Time: 15, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "Ears",], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"], Extended: true, AllowType: ["HairOutAccIn", "HairInAccIn", "HairInAccOut"], Alpha: [{ Group: ["ItemMouth", "ItemMouth2", "ItemMouth3"], Masks: [[0, 185, 400, 400]] }], HasType: false },
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "ItemEars",
		Category: "Item",
		Priority: 1,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 50,
		Zone: [[100, 0, 75, 130]],
		Activity: ["Kiss", "Lick", "Nibble", "Pinch", "Caress", "Whisper", "TickleItem", "RubItem", "RollItem", "Wiggle"],
		Asset: [
			{ Name: "LightDutyEarPlugs", Value: 15, Difficulty: 50, Time: 5, Visible: false, Effect: ["DeafLight"] },
			{ Name: "HeavyDutyEarPlugs", Value: 30, Difficulty: 50, Time: 5, Visible: false, Effect: ["DeafHeavy"] },
			{ Name: "HeadphoneEarPlugs", Value: 50, Difficulty: 50, Time: 5, Visible: false, Effect: [], AllowEffect: ["DeafLight", "DeafHeavy", "DeafTotal"], AllowType: ["Light", "Heavy", "NoiseCancelling"], Extended: true },
			{ Name: "BluetoothEarbuds", Value: 50, Difficulty: 50, Time: 5, Visible: false, Effect: [], AllowEffect: ["DeafLight", "DeafHeavy", "DeafTotal"], AllowType: ["Light", "Heavy", "NoiseCancelling"], Extended: true, AlwaysExtend: true },
			{ Name: "FuturisticEarphones", Priority: 54, Category: ["SciFi"], Value: 60, Difficulty: 50, Top: 20, Time: 12, DefaultColor: ["Default", "#50913C"], AllowLock: true, DrawLocks: false, Random: false, Effect: [], AllowEffect: ["DeafLight", "DeafHeavy", "DeafTotal"], AllowType: ["Light", "Heavy", "NoiseCancelling"], Extended: true, AlwaysExtend: true, HasType: false,
				Layer: [
					{ Name: "Band" },
					{ Name: "Display" },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "Headphones", Priority: 54, Value: 50, Time: 5, Random: false, Top: 20, Effect: [], AllowEffect: ["DeafLight", "DeafHeavy", "DeafTotal"], AllowType: ["Light", "Heavy", "NoiseCancelling"], Extended: true, AlwaysExtend: true, HasType: false,
				Layer: [
					{ Name: "Light" },
					{ Name: "Dark" },
				]
			},
			AssetSpankingToys
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemMisc",
		Category: "Item",
		Priority: 48,
		Default: false,
		Top: -250,
		Zone: [[10, 0, 90, 200]],
		Asset: [
			{ Name: "MetalPadlock", Value: 15, Time: 10, Wear: false, Effect: [], IsLock: true},
			{ Name: "IntricatePadlock", Value: 50, Time: 30, Wear: false, Effect: [], IsLock: true, PickDifficulty: 7, ExclusiveUnlock: true, AllowType: ["LockPickSeed"]},
			{ Name: "HighSecurityPadlock", Value: 60, Time: 10, Wear: false, Effect: [], IsLock: true, PickDifficulty: 10, ExclusiveUnlock: true, AllowType: ["LockPickSeed"]},
			{ Name: "TimerPadlock", Value: 80, Wear: false, Effect: [], IsLock: true, MaxTimer: 300, RemoveTimer: 300 },
			{ Name: "CombinationPadlock", Value: 100, Random: false, Wear: false, Effect: [], IsLock: true, AllowType: ["CombinationNumber"]},
			{ Name: "PasswordPadlock", Value: 100, BuyGroup: "PasswordPadlock", Random: false, Wear: false, Effect: [], IsLock: true, AllowType: ["Password", "Hint", "LockSet"]},
			{ Name: "TimerPasswordPadlock", Value: -1, BuyGroup: "PasswordPadlock", Random: false, Wear: false, Effect: [], IsLock: true, AllowType: ["Password", "Hint", "LockSet"], MaxTimer: 14400, RemoveTimer: 300 },
			{ Name: "OwnerPadlock", Value: 60, Time: 10, Wear: false, OwnerOnly: true, Effect: [], IsLock: true },
			{ Name: "OwnerTimerPadlock", Value: 100, Wear: false, OwnerOnly: true, Effect: [], IsLock: true, MaxTimer: 604800, RemoveTimer: 300 },
			{ Name: "LoversPadlock", Value: 60, Time: 10, Wear: false, LoverOnly: true, Effect: [], IsLock: true},
			{ Name: "LoversTimerPadlock", Value: 100, Wear: false, LoverOnly: true, Effect: [], IsLock: true, MaxTimer: 604800, RemoveTimer: 300 },
			{ Name: "MistressPadlock", Value: -1, Time: 10, Wear: false, Effect: [], IsLock: true},
			{ Name: "MistressTimerPadlock", Value: -1, Wear: false, Effect: [], IsLock: true, MaxTimer: 14400, RemoveTimer: 300 },
			{ Name: "ExclusivePadlock", Value: 50, Time: 10, Wear: false, Effect: [], IsLock: true},
			{ Name: "SafewordPadlock", Value: 40, Random: false, Wear: false, Effect: [], IsLock: true, AllowType: ["Password", "Hint", "LockSet"]},
			{ Name: "MetalPadlockKey", Value: 10, Wear: false, Effect: ["Unlock-MetalPadlock"] },
			{ Name: "OwnerPadlockKey", Value: 60, Wear: false, OwnerOnly: true, Effect: ["Unlock-OwnerPadlock", "Unlock-OwnerTimerPadlock"] },
			{ Name: "LoversPadlockKey", Value: 40, Wear: false, LoverOnly: true, Effect: ["Unlock-LoversPadlock", "Unlock-LoversTimerPadlock"] },
			{ Name: "MistressPadlockKey", Value: -1, Wear: false, Effect: ["Unlock-MistressPadlock", "Unlock-MistressTimerPadlock"] },
			{ Name: "MetalCuffsKey", Value: 20, Time: 5, Wear: false, Effect: ["Unlock-MetalCuffs"] },
			{ Name: "Lockpicks", Value: 25, Time: 5, Wear: false, Effect: ["Unlock-"] },
			{ Name: "WoodenMaidTray", Value: -1, Enable: false },
			{ Name: "WoodenMaidTrayFull", Value: -1, Enable: false },
			{ Name: "WoodenPaddle", Value: -1, Enable: false },
			{
				Name: "WoodenSign", Value: 90, Top: 0, Left: 0, Priority: 57, Difficulty: 1, Time: 5, Random: false, Prerequisite: ["NoMaidTray"], Hide: ["ItemNipples", "ItemNipplesPiercings"], AllowPose: ["Suspension"], Extended: true, DynamicAfterDraw: true, Layer: [
					{ Name: "Sign" },
					{ Name: "Rope" },
					{ Name: "Text" },
				]
			},
		],
		Color: ["Default"]
	},

	{
		Group: "ItemDevices",
		Category: "Item",
		Priority: 56,
		Default: false,
		IsRestraint: true,
		Left: 0,
		Top: -250,
		Zone: [[10, 600, 90, 400], [400, 600, 90, 400]],
		Asset: [
			{
				Name: "WoodenBox", Priority: 58, Value: 60, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", RemoveAtLogin: true, DefaultColor: ["Default", "#600"], SetPose: ["BaseLower"], Extended: true, DynamicAfterDraw: true, MinOpacity: 0, Opacity: 0, FixedPosition: true,
				AllowType: ["NWSE"],
				Prerequisite: ["NotSuspended", "NotHogtied", "NotHorse"],
				Effect: ["Prone", "Enclose", "Freeze"],
				AllowEffect: ["Prone", "Enclose", "BlindNormal", "GagLight", "Freeze"],
				Layer: [
					{ Name: "Back", Priority: 1, MinOpacity: 1, HasType: false },
					{ Name: "Panel", CopyLayerColor: "Back", HasType: false },
					{ Name: "Text", HasImage: false, HasType: false },
					{
						Name: "Frame", CopyLayerColor: "Back", MinOpacity: 1, HasType: false,
						Alpha: [{ Masks: [[0, -50, 500, 80], [0, 10, 45, 980], [445, 10, 55, 980], [0, 990, 500, 110]] }],
					},
				],
			},
			{ Name: "SmallWoodenBox", Priority: 58, Value: 40, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "BlindNormal", "GagLight", "Freeze"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 1, 70, 999], [420, 1, 80, 999]] }], RemoveAtLogin: true },
			{ Name: "MilkCan", Priority: 58, Fetish: ["Metal"], Value: -1, Difficulty: 1, Time: 15, RemoveTime: 10, SetPose: ["Kneel"], Effect: ["BlindHeavy", "Prone", "Enclose", "GagHeavy", "Freeze"], HideItem: ["ShoesFlippers"], RemoveAtLogin: true },
			{
				Name: "WaterCell", Priority: 58, Fetish: ["Metal"], Value: -1, Difficulty: 1, Time: 15, RemoveTime: 15, SetPose: ["Suspension", "LegsClosed"], Effect: ["Prone", "Enclose", "GagMedium", "Freeze"], HideItem: ["ShoesFlippers"], Block: ["ItemFeet"], RemoveAtLogin: true,
				Alpha: [{ Masks: [[0, 145, 81, 910], [419, 145, 81, 910]] }],
				OverrideHeight: { Height: -150, Priority: 41, HeightRatioProportion: 0 },
			},
			{
				Name: "Cage", Priority: 58, Fetish: ["Metal"], Value: 120, Difficulty: 4, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", RemoveAtLogin: true,
				Prerequisite: ["NotKneeling", "NotSuspended"],
				Effect: ["Prone", "Enclose", "Freeze"],
				HideItem: ["ShoesFlippers"],
				Alpha: [{ Masks: [[1, 80, 105, 900], [410, 80, 105, 900]] }],
				SetPose: ["BaseLower"],
				Layer: [
					{ Name: "Frame", ColorGroup: "Cage" },
					{ Name: "Mesh", ColorGroup: "Cage" },
					{ Name: "Tint" },
				]
			},
			{ Name: "LowCage", Priority: 58, Fetish: ["Metal"], Value: 80, Difficulty: 4, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "Freeze"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 80, 75, 900], [400, 80, 100, 900]] }], RemoveAtLogin: true },
			{ Name: "SaddleStand", Fetish: ["Metal"], Priority: 39, Value: 100, Difficulty: -2, Time: 10, AllowLock: true, Prerequisite: ["LegsOpen", "AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotKneelingSpread", "NotShackled"], SetPose: ["LegsOpen"], Effect: ["Prone", "Freeze", "Mounted"], Block: ["ItemPelvis", "ItemLegs", "ItemFeet"], AllowActivityOn: ["ItemPelvis", "ItemLegs", "ItemFeet"], Height: 30, RemoveAtLogin: true },
			{ Name: "BurlapSack", Priority: 39, Value: 35, Difficulty: 5, SelfBondage: 4, Time: 15, RemoveTime: 6, Audio: "Bag", Prerequisite: ["NotSuspended", "AllFours", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Cloth", "ClothLower", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "ItemArms", "ItemButt", "TailStraps", "Wings", "BodyLower", "Socks", "ItemHidden", "ItemNipplesPiercings", "ItemTorso"], SetPose: ["Kneel", "BackElbowTouch"], Effect: ["ForceKneel", "Block", "Prone", "Freeze"], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots"] },
			{ Name: "InflatableBodyBag", Fetish: ["Latex"], Priority: 31, Value: 225, Difficulty: 1, SelfBondage: 6, Time: 30, RemoveTime: 50, AllowLock: true, Audio: "Bag", Prerequisite: ["NotSuspended", "AllFours", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Cloth", "Suit", "ClothLower", "SuitLower", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "ItemArms", "ItemButt", "TailStraps", "Wings", "BodyLower", "Socks", "ItemNipplesPiercings"], HideItem: ["ItemVulvaFullLatexSuitWand", "ItemNipplesLactationPump"], AllowPose: ["Kneel"], SetPose: ["LegsClosed", "BackElbowTouch"], Effect: ["Block", "Prone", "Freeze"], AllowType: ["Inflated", "Bloated", "Max"], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots"], Extended: true, SelfUnlock: false, AllowActivePose: ["Kneel"] },
			{
				Name: "BondageBench", Fetish: ["Leather"], Priority: 1, Value: 250, SelfBondage: 0, Time: 10, RemoveTime: 10, Extended: true, RemoveAtLogin: true,
				Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NoFeetSpreader"],
				SetPose: ["LegsClosed"],
				Effect: ["Mounted"],
				AllowEffect: ["Block", "Prone", "Freeze", "Mounted"],
				AllowType: ["Light", "Normal", "Heavy", "Full"],
				AllowLock: true,
				AllowLockType: ["Light", "Normal", "Heavy", "Full"],
				Layer: [
					{ Name: "Bench", AllowColorize: true, Priority: 1, HasType: false },
					{ Name: "Straps", AllowColorize: true, Priority: 53, HasType: true },
				],
			},
			{ Name: "TeddyBear", Fetish: ["ABDL"], Priority: 34, Value: 50, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["AllFours", "Hogtied", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Horse", "Yoked", "OverTheHead"], Effect: [], AllowType: ["Fox", "Kitty", "Pup", "Bunny", "Pony"], Extended: true, RemoveAtLogin: true },
			{ Name: "BBQ", Priority: 1, Value: 30, Difficulty: -10, Time: 5, IsRestraint: false, Effect: [], RemoveAtLogin: true, FixedPosition: true },
			{ Name: "LittleMonster", Priority: 34, Value: 40, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["AllFours", "Hogtied", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Horse", "Yoked", "OverTheHead"], Effect: [], AllowType: ["Red", "Green", "Blue"], Extended: true, RemoveAtLogin: true },
			{ Name: "Familiar", Priority: 6, Value: 200, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["AllFours", "Hogtied", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Horse", "Yoked", "OverTheHead"], Effect: [], AllowType: ["Cat", "Skeleton", "Parrot"], Extended: true, RemoveAtLogin: true },
			{ Name: "Coffin", Priority:70, Value: 240,  Top: -150, Left:10, Difficulty: -20, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NoFeetSpreader"], SetPose: ["LegsClosed"], AllowEffect: ["Freeze", "GagMedium", "Prone", "Enclose", "BlindLight"], HideItem: ["ShoesFlippers"],
				Layer: [
					{Name:"Inside", Priority:1, HasType: false},
					{Name:"Frame", Priority:57, ColorGroup: "Main", HasType: false, Alpha: [{ Masks: [
						[0, 0, 500, 20],  //Above
						[0, 950, 500, 50],  //Below
						[0, 0, 160, 1000], //Left side is covered by lid
						[360, 0, 135, 200], //Triangle approx of right side
						[370, 200, 135, 1000],
						[355, 500, 15, 500],
						[350, 600, 5, 400],
						[345, 700, 5, 300],
						[340, 800, 5, 200]
					]}]},
					{Name:"Open", Priority:58, ColorGroup:"Main", AllowTypes:["", "Open"]},
					{Name:"Closed", Priority:59, ColorGroup:"Main", AllowTypes:["Closed"]}
				],
				Extended:true, RemoveAtLogin: true, AllowType:["Closed"]
			},
			{ Name: "CryoCapsule", Category: ["SciFi"], Priority:70, Value: 240,  Top: 0, Left:10, Difficulty: -20, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NoFeetSpreader"], SetPose: ["LegsClosed"], AllowEffect: ["Freeze", "GagMedium", "Prone", "Enclose", "BlindLight"], HideItem: ["ShoesFlippers"],
				Layer: [
					{Name:"Inside", Priority:1, HasType: false},
					{Name:"Frame", Priority:57, ColorGroup: "Main", HasType: false, Alpha: [{ Masks: [
						[0, 0, 500, 50],  //Above
						[0, 970, 500, 30],  //Below
						[0, 0, 160, 1000], //Left side is covered by lid
						[360, 0, 135, 200], //Triangle approx of right side
						[370, 200, 135, 1000],
						[365, 500, 15, 500],
						[355, 600, 5, 400],
						[355, 700, 5, 300],
						[350, 800, 5, 200]
					]}]},
					{Name:"Open", Priority:58, ColorGroup:"Main", AllowTypes:["", "Open"]},
					{Name:"Closed", Priority:59, ColorGroup:"Main", AllowTypes:["Closed"]}
				],
				Extended:true, RemoveAtLogin: true, AllowType: ["Closed"]
			},
			{
				Name: "OneBarPrison", Fetish: ["Metal"], Priority: 16, Value: 75, Difficulty: 8, SelfBondage: 2, Time: 20, AllowLock: true, Prerequisite: ["AccessVulva", "AllFours", "LegsOpen", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste"], SetPose: ["LegsOpen"], Effect: ["FillVulva", "Prone", "Freeze", "Mounted"], Block: ["ItemPelvis", "ItemLegs", "ItemVulva", "ItemFeet"], AllowActivityOn: ["ItemPelvis", "ItemLegs", "ItemFeet"], Layer: [
					{ Name: "Bar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				],
				RemoveAtLogin: true
			},
			{ Name: "TheDisplayFrame", Fetish: ["Metal"], Value: 100, Difficulty: 50, SelfBondage: 5, Time: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["DisplayFrame", "AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotMasked"], SetPose: ["LegsClosed", "BackElbowTouch"], Effect: ["Prone", "Freeze", "Block", "Mounted"], HideItem: ["ShoesFlippers"],  Block: ["ItemArms", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNeckAccessories"], RemoveAtLogin: true },
			{ Name: "Sybian", Priority: 22, Value: 80, Difficulty: 1, Time: 10, IsRestraint: false, Prerequisite: ["AccessVulva", "AllFours", "LegsOpen", "NotSuspended", "NotHogtied", "NotShackled", "NotChaste", "NotHorse"], Hide: ["Shoes", "Socks", "ItemBoots", "ItemFeet", "ItemLegs", "ItemVulva"], HideItem: ["ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexPants1", "ClothLowerLeggings1", "ClothLowerLeggings2", "ItemDevicesTeddyBear", "SuitLowerReverseBunnySuit", "ClothLowerJeansShorts"], SetPose: ["KneelingSpread"], Effect: ["FillVulva", "Egged", "Freeze", "Mounted"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemPelvis", "ItemButt", "ItemVulva"], AllowActivityOn: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemPelvis"], RemoveAtLogin: true, ArousalZone: "ItemVulva", DynamicScriptDraw: true },
			{ Name: "StrapOnSmooth", Fetish: ["Leather"], Priority: 34, Value: 25, Difficulty: 1, Time: 10, IsRestraint: false, AllowActivity: ["Penetrate"] },
			{ Name: "StrapOnStuds", Fetish: ["Leather"], Priority: 34, Value: 25, Difficulty: 1, Time: 10, IsRestraint: false, AllowActivity: ["Penetrate"] },
			{ Name: "DisplayCase", Priority: 58, Fetish: ["Metal"], Value: 60, Difficulty: -2, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended"], Effect: ["Prone", "Enclose", "DeafLight", "GagLight", "Freeze"],  HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 1, 70, 999], [420, 1, 80, 999]] }], RemoveAtLogin: true, SetPose: ["BaseLower"] },
			{ Name: "SmallDisplayCase", Priority: 58, Fetish: ["Metal"], Value: 40, Difficulty: -2, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "DeafLight", "GagLight", "Freeze"], HideItem: ["ShoesFlippers"],  Alpha: [{ Masks: [[1, 1, 70, 999], [420, 1, 80, 999]] }], RemoveAtLogin: true },
			{ Name: "WoodenBoxOpenHead", Value: 60, Difficulty: -2, SelfBondage: 3, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotHogtied", "NotYoked"], Hide: ["Wings"], Effect: ["Prone", "Freeze", "Block"],  HideItem: ["ShoesFlippers"],  AllowBlock: ["ItemHands"], Alpha: [{ Masks: [[1, 220, 70, 999], [420, 220, 80, 999]] }], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots", "ItemHands"], RemoveAtLogin: true, SetPose: ["BaseLower"] },
			{ Name: "SmallWoodenBoxOpenHead", Value: 40, Difficulty: -2, SelfBondage: 3, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel", "NotYoked"], Hide: ["Wings"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Freeze", "Block"], HideItem: ["ShoesFlippers"],  AllowBlock: ["ItemHands"], Alpha: [{ Masks: [[1, 220, 70, 999], [420, 220, 80, 999]] }], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots", "ItemHands"], RemoveAtLogin: true },
			{ Name: "WoodenStocks", Value: 150, Difficulty: 50, SelfBondage: 4, Time: 10, AllowLock: true, Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NoItemArms", "LegsOpen"], SetPose: ["Yoked", "LegsOpen"], Effect: ["Prone", "Freeze", "Block", "Mounted"], Block: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"], AllowActivityOn: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"],RemoveAtLogin: true },
			{ Name: "Vacbed", Fetish: ["Latex"], ParentGroup: "BodyUpper", Value: 200, Difficulty: 50, Priority: 36, SelfBondage: 3, Time: 10, Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NoItemArms", "LegsOpen", "NoItemHands", "NoItemLegs", "NoHorse", "NoItemFeet"], Extended: true, AllowType: ["Nohair"], Hide: ["ItemNeckAccessories", "ItemNeckRestraints", "HairBack", "ClothAccessory"], SetPose: ["Yoked", "BaseLower"], Effect: ["Prone", "Freeze", "Block", "Mounted"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 1, 70, 999], [420, 1, 80, 999]] }], Block: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemLegs", "ItemMisc", "ItemAddon", "ItemNeck", "ItemNeckAccessories", "ItemNeckRestraints", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"], RemoveAtLogin: true },
			{
				Name: "Crib", Category: ["ABDL"], Fetish: ["ABDL"], Priority: 1, Value: 100,
				Difficulty: 0, SelfBondage: 1, Time: 15, RemoveTime: 10, IsRestraint: true, AllowLock: true, Left: -30, Top: -235,
				Effect: ["Freeze", "Leash"], HideItem: ["ShoesFlippers"], RemoveAtLogin: true, Prerequisite: ["AllFours", "NotSuspended", "NotHogtied", "NoFeetSpreader"], Extended: true, SetPose: ["BaseLower"],
				Layer: [
					{ Name: "GateClosed", CopyLayerColor: "Frame", AllowModuleTypes: ["g1"], HasType: false },
					{ Name: "GateOpen", CopyLayerColor: "Frame", AllowModuleTypes: ["g0"], HasType: false },
					{ Name: "Frame", ColorGroup: "Frame", ParentGroup: null, HasType: false },
					{ Name: "Mattress", ColorGroup: "Mattress", ParentGroup: null, HasType: false },
					{ Name: "Pillow", ColorGroup: "Pillow", ParentGroup: null, HasType: false },
					{ Name: "PillowTrim", ColorGroup: "PillowTrim", ParentGroup: null, HasType: false },
					{ Name: "Plushies", Priority: 54, ColorGroup: "Plushies", ParentGroup: null, AllowModuleTypes: ["p1"], HasType: false }
				],
			},
			{
				Name: "Bed", Value: 100, Priority: 1, Difficulty: -20, SelfBondage: 0, Time: 5, RemoveTime: 5, RemoveAtLogin: true, DefaultColor: ["#523629", "#888990", "#808284"], BuyGroup: "Bed",
				RemoveItemOnRemove: [
					{ Group: "ItemAddon", Name: "Covers" },
					{ Group: "ItemAddon", Name: "BedRopes" },
					{ Group: "ItemAddon", Name: "BedStraps" },
					{ Group: "ItemAddon", Name: "BedTape" },
					{ Group: "ItemAddon", Name: "BedChains" },
					{ Group: "ItemArms", Name: "UnderBedBondageCuffs" },
					{ Group: "ItemArms", Name: "MedicalBedRestraints" },
					{ Group: "ItemArms", Name: "HempRope", Type: "BedSpreadEagle" },
					{ Group: "ItemLegs", Name: "MedicalBedRestraints" },
					{ Group: "ItemFeet", Name: "HempRope", Type: "BedSpreadEagle" },
					{ Group: "ItemFeet", Name: "MedicalBedRestraints" },
				],
				Effect: ["Freeze", "Mounted", "OnBed"],
				Prerequisite: ["AllFours", "NotSuspended", "NotHogtied", "NoFeetSpreader"],
				SetPose: ["BaseLower"],
				Layer: [
					{ Name: "BedFrame" },
					{ Name: "Mattress" },
					{ Name: "Pillow" }
				]
			},
			{
				Name: "X-Cross", Priority: 1, Value: 200, Left: 0, Top: -50, Difficulty: 9, SelfBondage: 1, Time: 15, AllowLock: true, RemoveAtLogin: true, Prerequisite: ["CuffedArms", "CuffedFeet", "AllFours", "NotSuspended", "NotHogtied", "LegsOpen", "NotKneeling"], SetPose: ["OverTheHead", "Spread"], HideItem: ["PencilSkirt", "Gown2Skirt", "ShoesMistressBoots", "ShoesPonyBoots", "ShoesThighHighLatexHeels"], Effect: ["Prone", "Freeze", "Block", "Mounted"], Block: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"], AllowActivityOn: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"],
				OverrideHeight: { Height: -25, Priority: 10 },
				Layer: [
					{ Name: "Cross" },
					{ Name: "Padding" }
				]
			},
			{
				Name: "ChangingTable", Category: ["ABDL"], Fetish: ["ABDL"], Priority: 1, Value: 100, Difficulty: 0, SelfBondage: 1, Time: 15, RemoveTime: 10, IsRestraint: true, AllowLock: false, Left: -30, Top: -235, Effect: ["Freeze"], RemoveAtLogin: true, Prerequisite: ["NotSuspended", "NotHogtied"], SetPose: ["BaseLower"], Layer: [
					{ Name: "Frame" },
					{ Name: "Table" }
				]
			},
			{ Name: "Locker", Priority: 58, Value: 50, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, Top: 0, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied"], Effect: ["Prone", "Enclose", "BlindLight", "Freeze"], HideItem: ["ShoesFlippers"],  Alpha: [{ Masks: [[1, 1, 125, 999],[360, 1, 140, 999]] }], SetPose: ["BaseLower"], Extended: true, RemoveAtLogin: true, AllowType:["Opaque"] },
			{ Name: "SmallLocker", Priority: 58, Value: 40, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, Top: 0, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "BlindLight", "Freeze"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 1, 125, 999], [360, 1, 140, 999]] }], Extended: true, RemoveAtLogin: true, AllowType: ["Opaque"] },
			{ Name: "VentlessLocker", Priority: 58, Value: 50, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, Top: 0, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied"], Effect: ["Prone", "Enclose", "BlindHeavy", "GagLight", "Freeze"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 1, 125, 999],[360, 1, 140, 999]] }], SetPose: ["BaseLower"], Extended: true, RemoveAtLogin: true, AllowType:["Opaque"] },
			{ Name: "SmallVentlessLocker", Priority: 58, Value: 40, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, Top: 0, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "BlindHeavy", "GagLight", "Freeze"], HideItem: ["ShoesFlippers"], Alpha: [{ Masks: [[1, 1, 125, 999], [360, 1, 140, 999]] }], Extended: true, RemoveAtLogin: true, AllowType: ["Opaque"] },
			{
				Name: "ConcealingCloak", Value: 75, Difficulty: 0, Top: 0, SelfBondage: 5, Time: 7, AllowLock: true, Prerequisite: ["NotSuspended", "AllFours", "Notkneeling", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread"], Hide: [ "Suit", "ItemArms", "ItemButt", "TailStraps", "Wings", "ItemNipplesPiercings"], HideItem: ["ItemVulvaFullLatexSuitWand"], Effect: ["Prone"], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemHands", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"], SetPose: ["BaseUpper"], Layer: [
					{ Name: "Front", Priority: 48 },
					{ Name: "Back", Priority: 3, CopyLayerColor: "Front" },
					{ Name: "Strap", Priority: 52 }
				]
			},
			{
				Name: "PetBed", Fetish: ["Pet"], Value: 50, Difficulty: -25, SelfBondage: 0, Time: 5, RemoveTime: 5, Effect: ["Tethered"], RemoveAtLogin: true, SetPose: ["Kneel"], FixedPosition: true, Extended: true, HasType: false,
				AllowType: ["Blanket"],
				AllowBlock: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemBoots", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings"],
				Layer: [
					{ Name: "Lining", Priority: 1, AllowColorize: false},
					{ Name: "Bed", AllowColorize: true, Alpha: [{ Masks: [[0, 800, 500, 900]] }] },
					{ Name: "Blanket", Priority: 4, AllowColorize: true, AllowTypes: ["Blanket"] },
					{ Name: "Inner", Priority: 2, AllowColorize: true, AllowTypes: ["Blanket"]},
				],
			},
			{
				Name: "TransportWoodenBox", Priority: 58, Value: 60, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, AllowLock: true, Audio: "LockLarge", DefaultColor: ["Default", "Default", "Default", "#600"], Extended: true, RemoveAtLogin: true, SetPose: ["BaseLower"], MinOpacity: 0, Opacity: 0, DynamicAfterDraw: true, FixedPosition: true,
				AllowType: ["NWSE"],
				Prerequisite: ["NotSuspended", "NotHogtied"],
				Effect: ["Prone", "Enclose", "Freeze", "Leash"],
				AllowEffect: ["Prone", "Enclose", "BlindNormal", "GagLight", "Freeze", "Leash"],
				Layer: [
					{ Name: "Back", Priority: 1, MinOpacity: 1, HasType: false },
					{ Name: "Panel", CopyLayerColor: "Back", HasType: false },
					{
						Name: "Frame", CopyLayerColor: "Back", MinOpacity: 1, HasType: false,
						Alpha: [{ Masks: [[0, -50, 500, 80], [0, 10, 45, 980], [445, 10, 55, 980], [0, 990, 500, 110]] }],
					},
					{ Name: "Wheelholders", MinOpacity: 1, HasType: false },
					{ Name: "Wheels", MinOpacity: 1, HasType: false },
					{ Name: "Text", HasImage: false, HasType: false },
				],
			},
			{
				Name: "VacCube", Fetish: ["Latex"], Value: 250, Difficulty: 50, Priority: 36, Top: -70, Left: 0, SelfBondage: 4, Time: 20, RemoveAtLogin: true, DefaultColor: "#480000",
				Prerequisite: ["NoItemArms", "NoItemLegs", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NotYoked", "LegsOpen", "NoHorse", "NoItemFeet"],
				Hide: ["BodyLower", "Hands", "HairBack", "Cloth", "ClothLower", "ClothAccessory", "Necklace", "Suit", "SuitLower", "Bra", "Panties", "Socks", "RightAnklet", "LeftAnklet", "Shoes", "Gloves", "TailStraps", "Wings", "ItemFeet", "ItemLegs", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemArms", "ItemHands", "ItemBoots", "Pussy", "Corset"],
				SetPose: ["BaseUpper", "BaseLower"],
				Effect: ["Prone", "Freeze", "Block"],
				HideItem: ["ShoesFlippers"],
				Block: ["ItemArms", "ItemBoots", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemLegs", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemAddon"],
				AllowActivityOn: ["ItemArms", "ItemBoots", "ItemBreast", "ItemFeet", "ItemLegs", "ItemNipples", "ItemPelvis", "ItemTorso"],
				OverrideHeight: { Height: -570, Priority: 60, HeightRatioProportion: 0.95 },
				Alpha: [{Group: ["BodyUpper"], Masks: [[0, 225, 500, 775]]}],
				Layer: [
					{ Name: "Latex", ParentGroup: "BodyUpper" },
					{ Name: "Highlights", ParentGroup: null, AllowColorize: false },
				]
			},
			{
				Name: "PetBowl", Value: 20, Time: 5, IsRestraint: false, DefaultColor: ["Default", "#000000"], AllowPose: ["Suspension"], HideForPose: ["Suspension"], Extended: true, DynamicBeforeDraw: true, DynamicAfterDraw: true, Layer: [
					{ Name: "Bowl", Top: 885, Left: 300 },
					{ Name: "Text", HasImage: false, Top: 905, Left: 335 },
				]
			},
			{ Name: "Pole", Value: 40, Top: -150, Priority: 1, Difficulty: -5, RemoveTime: 10, HasType: false, AllowType: ["Tied"], AllowEffect: ["Block", "Freeze", "Prone"], RemoveAtLogin: true, Extended: true, FixedPosition: true },
			{ Name: "Cushion", Priority: 34, Value: 4, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["AllFours", "Hogtied", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "OverTheHead", "Horse"], AllowType: ["Kneel"], Extended: true },
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "ItemHoodAddon",
		Category: "Item",
		Priority: 46,
		Default: false,
		IsRestraint: true,
		Left: 0,
		Top: -250,
		Zone: [[400, 100, 90, 100]],
		Asset: [
			{ Name: "OldGasMaskLenses", Priority: 46, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 5, AllowLock: true, Effect: ["BlindHeavy"] },
			{ Name: "OldGasMaskTube1", Priority: 45, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 5, AllowLock: true },
			{ Name: "OldGasMaskTube2", Effect: ["GagEasy"], Priority: 45, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 5, AllowLock: true },
			{ Name: "OldGasMaskRebreather", Priority: 45, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 5, AllowLock: true, Effect: ["GagEasy"] },
			{
				Name: "OldGasMaskLensesTube1", Value: -1, Difficulty: 12, SelfBondage: 5, Time: 10, AllowLock: true, Effect: ["BlindHeavy"], Layer: [
					{ Name: "Lenses", Priority: 46 },
					{ Name: "Tube1", Priority: 45 },
				]
			},
			{
				Name: "OldGasMaskLensesTube2", Value: -1, Difficulty: 12, SelfBondage: 5, Time: 10, AllowLock: true, Effect: ["BlindHeavy", "GagEasy"], Layer: [
					{ Name: "Lenses", Priority: 46 },
					{ Name: "Tube2", Priority: 45 },
				]
			},
			{
				Name: "OldGasMaskLensesRebreather", Value: -1, Difficulty: 12, SelfBondage: 5, Time: 10, AllowLock: true, Effect: ["BlindHeavy", "GagEasy"], Layer: [
					{ Name: "Lenses", Priority: 46 },
					{ Name: "Rebreather", Priority: 45 },
				]
			},
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},
	{
		Group: "ItemAddon",
		Category: "Item",
		Priority: 51,
		Default: false,
		IsRestraint: true,
		Left: 0,
		Top: -250,
		Zone: [[400, 0, 90, 100]],
		Asset: [
			{
				Name: "Covers", Value: -1, Difficulty: 1, SelfBondage: 0, DefaultColor: ["#99A2AB", "Default"], Prerequisite: "OnBed", BuyGroup: "Bed",
				Layer: [
					{ Name: "Outer" },
					{ Name: "Inner" },
				]
			},
			{ Name: "BedRopes", Fetish: ["Rope"], Value: -1, Difficulty: 6, SelfBondage: 3, DefaultColor: "#956B1C", Audio: "RopeShort", Block: ["ItemDevices"], Hide: ["TailStraps"], Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "BedStraps",Fetish: ["Leather"], Value: -1, Difficulty: 6, SelfBondage: 2, Block: ["ItemDevices"], Hide: ["TailStraps"], AllowLock: true, Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "BedTape", Fetish: ["Tape"], Value: -1, Difficulty: 6, SelfBondage: 2, Block: ["ItemDevices"], Hide: ["TailStraps"], Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "BedChains", Fetish: ["Metal"], Value: -1, Difficulty: 6, SelfBondage: 4, Block: ["ItemDevices"], Hide: ["TailStraps"], AllowLock: true, Audio: "ChainLong", Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "CeilingRope", Top: -700, Random: false, Priority: 1, Fetish: ["Rope"], Value: 60, Prerequisite: ["CanBeCeilingTethered"], BuyGroup: "HempRope", Difficulty: 6, SelfBondage: 0, Extended: true, HasType: false, AllowType: ["Suspended"], DefaultColor: "#956B1C", Effect: ["Freeze"], SetPose: ["BaseLower"], WhitelistActivePose: ["BaseLower", "LegsClosed"], AllowActivePose: ["LegsClosed"], },
			{ Name: "CeilingChain", Top: -700, Random: false, Priority: 1, Fetish: ["Metal"], Prerequisite: ["CanBeCeilingTethered"], Value: 90, BuyGroup: "Chains", Difficulty: 6, SelfBondage: 0, Extended: true, HasType: false, AllowType: ["Suspended"], Effect: ["Freeze"], SetPose: ["BaseLower"], WhitelistActivePose: ["BaseLower", "LegsClosed"], AllowActivePose: ["LegsClosed"] }
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "ItemBoots",
		ParentGroup: "BodyLower",
		Category: "Item",
		Priority: 23,
		Default: false,
		IsRestraint: true,
		Left: 125,
		Top: 500,
		Hide: ["Shoes"],
		AllowPose: ["LegsClosed", "Kneel", "Hogtied"],
		Zone: [[100, 870, 300, 130]],
		Activity: ["Bite", "Kiss", "PoliteKiss", "Lick", "Suck", "Nibble", "Tickle", "Spank", "MassageHands", "MassageFeet", "TakeCare", "SpankItem", "TickleItem", "RubItem", "RollItem", "PourItem", "ShockItem", "Wiggle"],
		Asset: [
			{ Name: "PonyBoots", Fetish: ["Leather", "Pony"], Value: -1, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 875, 350, 200]] }], Height: 35 },
			{ Name: "BalletHeels", Fetish: ["Leather"], Value: 75, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 825, 350, 200]] }], Height: 35 },
			{ Name: "BalletWedges", Fetish: ["Leather"], Value: 50, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Alpha: [{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 825, 350, 200]] }], Height: 35 },
			{ Name: "ToeCuffs", Fetish: ["Metal"], Value: 35, Difficulty: 4, Time: 10, RemoveTime: 5, AllowLock: true, Prerequisite: "ToeTied", Audio: "LockSmall", SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"], AllowActivePose: ["Kneel"], FreezeActivePose: ["BodyLower"] },
			{ Name: "LeatherToeCuffs", Fetish: ["Leather"], Value: 50, Difficulty: 3, Time: 10, RemoveTime: 5, AllowLock: true, Prerequisite: "ToeTied", SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"], AllowActivePose: ["Kneel"], FreezeActivePose: ["BodyLower"] },
			{ Name: "ToeTie", Fetish: ["Rope"], Value: 15, Difficulty: 2, Time: 10, RemoveTime: 5, DefaultColor: "#956B1C", Prerequisite: "ToeTied", Audio: "RopeShort", SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"], AllowActivePose: ["Kneel"], FreezeActivePose: ["BodyLower"] },
			{ Name: "ThighHighLatexHeels", Fetish: ["Latex"], Value: -1, Time: 10, RemoveTime: 15, AllowLock: true, BuyGroup: "ThighHighLatexHeels",
				Alpha: [
					{ Group: ["BodyLower", "Socks", "SuitLower"], Masks: [[75, 680, 350, 320]] },
					{ Group: ["BodyLower", "Socks", "SuitLower"], Pose: ["LegsClosed"], Masks: [[75, 650, 350, 350]] },
				], Height: 30
			},
			{ Name: "LockingHeels", Value: 20, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Height: 15 },
			{ Name: "LockingHeels2", Value: 25, Difficulty: 7, Time: 10, RemoveTime: 15, AllowLock: true, Height: 15 },
			{ Name: "LockingShoes1", Value: 15, Difficulty: 3, Time: 5, RemoveTime: 8, AllowLock: true, Height: 6 },
			{ Name: "LockingShoes2", Value: 20, Difficulty: 4, Time: 5, RemoveTime: 8, AllowLock: true, Height: 6 },
			{ Name: "FuturisticHeels", Category: ["SciFi"], Value: 50, Difficulty: 7, Time: 10, RemoveTime: 20, DefaultColor: ["#50913C", "Default"], Random: false, AllowLock: true, DrawLocks: false, Height: 6, AllowType: ["Heel"], Extended: true, AlwaysExtend: true, Audio: "FuturisticApply",
				Layer: [
					{ Name: "Display", HasType: false },
					{ Name: "Shoes", AllowTypes:["", "Heel"] },
					{ Name: "Lock", LockLayer: true,AllowColorize: true, HasType: false, ParentGroup: null},
				]
			},
			{
				Name: "LockingBoots1", Value: 30, Difficulty: 6, Time: 7, RemoveTime: 14, AllowLock: true, Height: 9,
				Layer: [
					{ Name: "Boots" },
					{ Name: "Straps" }
				]
			},
			{
				Name: "LeatherFootMitts1", Fetish: ["Leather"], Value: 35, Difficulty: 4, Time: 6, RemoveTime: 7, AllowLock: true, Hide: ["Shoes", "Socks"],
				Layer: [
					{ Name: "Mitts" },
					{ Name: "Straps" }
				]
			},
			{ Name: "ToeTape", Fetish: ["Tape"], Extended: true, Value: 50, BuyGroup: "DuctTape", Audio: "DuctTape", Difficulty: 2, Time: 10, RemoveTime: 5, Prerequisite: "ToeTied", SetPose: ["LegsClosed"], AllowType: ["Full"], AllowActivePose: ["Kneel"] },
			{ Name: "Zipties", Value: 20, Difficulty: 6, Time: 5, RemoveTime: 6, BuyGroup: "Zipties", Audio: "ZipTie", Prerequisite: "ToeTied", SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"], AllowActivePose: ["Kneel"] },
			AssetSpankingToys
		],
		Color: ["Default"]
	},

];

/* eslint-disable */
/** 3D Custom Girl based pose
 * @type {Pose[]}
 */
var PoseFemale3DCG = [
	{
		Name: "BaseUpper",
		Category: "BodyUpper",
		AllowMenu: true,
	},
	{
		Name: "BaseLower",
		Category: "BodyLower",
		AllowMenu: true,
	},
	{
		Name: "Kneel",
		Category: "BodyLower",
		AllowMenu: true,
		OverrideHeight: { Height: -250, Priority: 20 },
		Hide: ["ItemFeet", "LeftAnklet", "RightAnklet"]
	},
	{
		Name: "Horse",
		Category: "BodyLower",
		OverrideHeight: { Height: -75, Priority: 20 },
		Hide: ["ItemFeet", "LeftAnklet", "RightAnklet"]
	},
	{
		Name: "KneelingSpread",
		Category: "BodyLower",
		OverrideHeight: { Height: -250, Priority: 20 },
		Hide: ["ItemFeet", "LeftAnklet", "RightAnklet"]
	},
	{
		Name: "Yoked",
		Category: "BodyUpper",
		AllowMenu: true,
		Hide: ["Hands"]
	},
	{
		Name: "OverTheHead",
		Category: "BodyUpper",
		AllowMenu: true,
		Hide: ["Hands"],
	},
	{
		Name: "Hogtied",
		Category: "BodyFull",
		OverrideHeight: { Height: -575, Priority: 50 },
		Hide: ["BodyLower", "Head", "Hands", "ClothLower", "Wings", "Gloves", "Panties", "Pussy", "ItemHands", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemFeet", "LeftAnklet", "RightAnklet"],
		MovePosition: [{ Group: "Socks", X: 0, Y: -400 }, { Group: "Shoes", X: 0, Y: -500 }, { Group: "ItemBoots", X: 0, Y: -500 }, { Group: "SuitLower", X: 0, Y: -380 }, { Group: "TailStraps", X: 0, Y: -300 }, { Group: "ItemButt", X: 0, Y: -300 }]
	},
	{
		Name: "Suspension",
		OverrideHeight: { Height: -150, Priority: 40 },
		Hide: []
	},
	{
		Name: "SuspensionHogtied",
		Category: "BodyFull",
		OverrideHeight: { Height: 0, Priority: 50 },
		Hide: ["BodyLower", "Hands", "ClothLower", "Wings", "Gloves", "Panties", "Pussy", "ItemHands", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemFeet", "SuitLower", "ItemDevices", "LeftAnklet", "RightAnklet"]
	},
	{
		Name: "AllFours",
		Category: "BodyFull",
		OverrideHeight: { Height: -560, Priority: 50 },
		Hide: ["ItemFeet", "ClothLower", "SuitLower", "Nipples", "Pussy", "BodyLower", "Head", "Wings", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemBoots", "Suit", "Panties", "Bra", "Socks", "Shoes", "LeftAnklet", "RightAnklet", "Corset"],
		MovePosition: [{ Group: "TailStraps", X: 0, Y: -300 }, { Group: "ItemButt", X: 0, Y: -300 }]
	},
	{
		Name: "BackBoxTie",
		Category: "BodyUpper",
		AllowMenu: true,
	},
	{
		Name: "LegsClosed",
		Category: "BodyLower",
		AllowMenu: true,
	},
	{
		Name: "Spread",
		Category: "BodyLower",
		Hide: ["ItemBoots"],
		MovePosition: [{ Group: "Pussy", X: 0, Y: -5 }, { Group: "ItemVulva", X: 0, Y: -5 }, { Group: "ItemButt", X: 0, Y: -5 }, { Group: "TailStraps", X: 0, Y: -5 }, { Group: "ItemVulvaPiercings", X: 0, Y: -5 }]
	},
	{
		Name: "BackElbowTouch",
		Category: "BodyUpper",
		AllowMenu: true,
	},
	{
		Name: "BackCuffs",
		Category: "BodyUpper",
		AllowMenu: true,
	},
	{
		Name: "TapedHands",
	},
	{
		Name: "LegsOpen",
		Category: "BodyLower",
	},
];

// 3D Custom Girl based activities
var ActivityFemale3DCG = [
	{
		Name: "Kiss",
		MaxProgress: 50,
		TargetSelf: ["ItemHands", "ItemArms", "ItemBoots", "ItemBreast", "ItemNipples"],
		Prerequisite: ["ZoneAccessible", "UseMouth"]
	},
	{
		Name: "GagKiss",
		MaxProgress: 55,
		Prerequisite: ["ZoneAccessible", "UseMouth", "TargetMouthBlocked"]
	},
	{
		Name: "FrenchKiss",
		MaxProgress: 70,
		Prerequisite: ["ZoneAccessible", "UseTongue", "ZoneNaked", "TargetCanUseTongue"]
	},
	{
		Name: "PoliteKiss",
		MaxProgress: 30,
		TargetSelf: ["ItemHands", "ItemBoots"],
		Prerequisite: ["UseMouth"]
	},
	{
		Name: "Lick",
		MaxProgress: 80,
		TargetSelf: ["ItemMouth", "ItemHands", "ItemArms", "ItemBoots", "ItemBreast", "ItemNipples"],
		Prerequisite: ["ZoneAccessible", "UseTongue", "ZoneNaked"]
	},
	{
		Name: "Suck",
		MaxProgress: 60,
		TargetSelf: ["ItemHands", "ItemArms", "ItemBoots", "ItemNipples"],
		Prerequisite: ["ZoneAccessible", "UseMouth", "ZoneNaked"]
	},
	{
		Name: "Nibble",
		MaxProgress: 40,
		TargetSelf: ["ItemMouth", "ItemHands", "ItemArms", "ItemBoots", "ItemNipples"],
		Prerequisite: ["ZoneAccessible", "UseMouth", "ZoneNaked"]
	},
	{
		Name: "Bite",
		MaxProgress: 40,
		TargetSelf: ["ItemMouth", "ItemHands", "ItemArms", "ItemBoots", "ItemLegs", "ItemFeet"],
		Prerequisite: ["ZoneAccessible", "UseMouth", "ZoneNaked"]
	},
	{
		Name: "Whisper",
		MaxProgress: 20,
		Prerequisite: ["UseMouth"]
	},
	{
		Name: "Tickle",
		MaxProgress: 50,
		TargetSelf: ["ItemTorso", "ItemPelvis", "ItemBreast", "ItemNipples", "ItemLegs", "ItemFeet", "ItemBoots", "ItemArms", "ItemHands"],
		Prerequisite: ["ZoneAccessible", "UseHands"]
	},
	{
		Name: "Caress",
		MaxProgress: 80,
		TargetSelf: ["ItemTorso", "ItemPelvis", "ItemBreast", "ItemNipples", "ItemLegs", "ItemFeet", "ItemBoots", "ItemArms", "ItemHands", "ItemButt", "ItemVulva", "ItemHead", "ItemNeck", "ItemMouth", "ItemEars", "ItemNose"],
		Prerequisite: ["ZoneAccessible", "UseHands"]
	},
	{
		Name: "Pet",
		MaxProgress: 20,
		TargetSelf: ["ItemHead", "ItemNose"],
		Prerequisite: ["UseArms"]
	},
	{
		Name: "Cuddle",
		MaxProgress: 30,
		Prerequisite: []
	},
	{
		Name: "Rub",
		MaxProgress: 60,
		TargetSelf: ["ItemNose"],
		Prerequisite: []
	},
	{
		Name: "TakeCare",
		MaxProgress: 10,
		TargetSelf: ["ItemBoots", "ItemHands", "ItemHead"],
		Prerequisite: ["ZoneAccessible", "UseHands", "ZoneNaked"]
	},
	{
		Name: "MassageHands",
		MaxProgress: 60,
		TargetSelf: ["ItemTorso", "ItemPelvis", "ItemBreast", "ItemLegs", "ItemFeet", "ItemBoots", "ItemArms", "ItemHands", "ItemButt", "ItemVulva", "ItemHead", "ItemNeck"],
		Prerequisite: ["ZoneAccessible", "UseHands"]
	},
	{
		Name: "MassageFeet",
		MaxProgress: 40,
		Prerequisite: ["ZoneAccessible", "UseFeet"]
	},
	{
		Name: "Sit",
		MaxProgress: 25,
		Prerequisite: ["UseFeet", "TargetKneeling"]
	},
	{
		Name: "Step",
		MaxProgress: 25,
		Prerequisite: ["UseFeet", "TargetKneeling"]
	},
	{
		Name: "Grope",
		MaxProgress: 50,
		TargetSelf: ["ItemButt", "ItemBreast"],
		Prerequisite: ["UseHands"]
	},
	{
		Name: "Pinch",
		MaxProgress: 20,
		TargetSelf: ["ItemNipples", "ItemEars", "ItemArms", "ItemPelvis", "ItemNose"],
		Prerequisite: ["ZoneAccessible", "UseHands"]
	},
	{
		Name: "Spank",
		MaxProgress: 40,
		TargetSelf: ["ItemButt", "ItemLegs", "ItemFeet", "ItemArms", "ItemHands", "ItemPelvis", "ItemTorso"],
		Prerequisite: ["UseHands"]
	},
	{
		Name: "Slap",
		MaxProgress: 30,
		TargetSelf: ["ItemBreast", "ItemHead"],
		Prerequisite: ["UseHands"]
	},
	{
		Name: "Pull",
		MaxProgress: 30,
		TargetSelf: ["ItemHead", "ItemNose", "ItemNipples"],
		Prerequisite: ["ZoneAccessible", "UseHands"]
	},
	{
		Name: "Choke",
		MaxProgress: 50,
		TargetSelf: ["ItemNeck", "ItemNose"],
		Prerequisite: ["ZoneAccessible", "UseHands"]
	},
	{
		Name: "HandGag",
		MaxProgress: 40,
		TargetSelf: ["ItemMouth"],
		Prerequisite: ["UseHands"]
	},
	{
		Name: "Wiggle",
		MaxProgress: 10,
		TargetSelf: ["ItemLegs", "ItemArms", "ItemFeet", "ItemTorso", "ItemButt", "ItemHead", "ItemPelvis", "ItemBreast", "ItemNose", "ItemEars", "ItemBoots", "ItemHands"],
		Prerequisite: ["SelfOnly", "MoveHead"]
	},
	{
		Name: "StruggleArms",
		MaxProgress: 10,
		TargetSelf: ["ItemArms"],
		Prerequisite: ["SelfOnly", "CantUseArms"]
	},
	{
		Name: "StruggleLegs",
		MaxProgress: 10,
		TargetSelf: ["ItemLegs"],
		Prerequisite: ["SelfOnly", "CantUseFeet"]
	},
	{
		Name: "Nod",
		MaxProgress: 0,
		TargetSelf: ["ItemHead"],
		Prerequisite: ["SelfOnly", "MoveHead"]
	},
	{
		Name: "MoanGag",
		MaxProgress: 60,
		MakeSound: true, // used for setting AutoPunishGagActionFlag to true
		TargetSelf: ["ItemMouth"],
		Prerequisite: ["IsGagged", "SelfOnly"]
	},
	{
		Name: "MoanGagGiggle",
		MaxProgress: 20,
		MakeSound: true, // used for setting AutoPunishGagActionFlag to true
		TargetSelf: ["ItemMouth"],
		Prerequisite: ["IsGagged", "SelfOnly"]
	},
	{
		Name: "MoanGagTalk",
		MaxProgress: 10,
		MakeSound: true, // used for setting AutoPunishGagActionFlag to true
		TargetSelf: ["ItemMouth"],
		Prerequisite: ["IsGagged", "SelfOnly"]
	},
	{
		Name: "MoanGagWhimper",
		MaxProgress: 40,
		MakeSound: true, // used for setting AutoPunishGagActionFlag to true
		TargetSelf: ["ItemMouth"],
		Prerequisite: ["IsGagged", "SelfOnly"]
	},
	{
		Name: "MoanGagAngry",
		MaxProgress: 10,
		MakeSound: true, // used for setting AutoPunishGagActionFlag to true
		TargetSelf: ["ItemMouth"],
		Prerequisite: ["IsGagged", "SelfOnly"]
	},
	{
		Name: "MoanGagGroan",
		MaxProgress: 30,
		MakeSound: true, // used for setting AutoPunishGagActionFlag to true
		TargetSelf: ["ItemMouth"],
		Prerequisite: ["IsGagged", "SelfOnly"]
	},
	{
		Name: "MasturbateTongue",
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "UseTongue", "ZoneNaked"]
	},
	{
		Name: "MasturbateHand",
		TargetSelf: ["ItemBreast", "ItemVulva", "ItemButt"],
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "UseHands", "ZoneNaked"]
	},
	{
		Name: "MasturbateFist",
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "VulvaEmpty", "UseHands", "ZoneNaked"]
	},
	{
		Name: "MasturbateFoot",
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "UseFeet", "ZoneNaked"]
	},
	{
		Name: "MasturbateItem",
		MaxProgress: 100,
		Prerequisite: ["ZoneNaked"]
	},
	{
		Name: "PenetrateSlow",
		MaxProgress: 80,
		Prerequisite: ["ZoneAccessible", "TargetMouthOpen", "VulvaEmpty", "WearingPenetrationItem", "ZoneNaked"]
	},
	{
		Name: "PenetrateFast",
		MaxProgress: 100,
		Prerequisite: ["ZoneAccessible", "TargetMouthOpen", "VulvaEmpty", "WearingPenetrationItem", "ZoneNaked"]
	},
	{
		Name: "SpankItem",
		MaxProgress: 70,
		Prerequisite: []
	},
	{
		Name: "TickleItem",
		MaxProgress: 50,
		Prerequisite: []
	},
	{
		Name: "RubItem",
		MaxProgress: 60,
		Prerequisite: []
	},
	{
		Name: "RollItem",
		MaxProgress: 30,
		Prerequisite: []
	},
	{
		Name: "PourItem",
		MaxProgress: 40,
		Prerequisite: []
	},
	{
		Name: "ShockItem",
		MaxProgress: 50,
		Prerequisite: []
	}
];

// 3D Custom Girl based fetishes
var FetishFemale3DCG = [
	{
		Name: "Bondage",
		GetFactor: function (C) { return C.IsRestrained() ? (PreferenceGetFetishFactor(C, "Bondage") - 2) : 0 }
	},
	{
		Name: "Gagged",
		GetFactor: function (C) { return !C.CanTalk() ? (PreferenceGetFetishFactor(C, "Gagged") - 2) : 0 }
	},
	{
		Name: "Blindness",
		GetFactor: function (C) { return C.IsBlind() ? (PreferenceGetFetishFactor(C, "Blindness") - 2) : 0 }
	},
	{
		Name: "Deafness",
		GetFactor: function (C) { return C.IsDeaf() ? (PreferenceGetFetishFactor(C, "Deafness") - 2) : 0 }
	},
	{
		Name: "Chastity",
		GetFactor: function (C) { return C.IsChaste() ? (PreferenceGetFetishFactor(C, "Chastity") - 2) : 0 }
	},
	{
		Name: "Exhibitionist",
		GetFactor: function (C) { return C.IsNaked() ? (PreferenceGetFetishFactor(C, "Exhibitionist") - 2) : 0 }
	},
	{
		Name: "Masochism",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Masochism") }
	},
	{
		Name: "Sadism",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Sadism") }
	},
	{
		Name: "Rope",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Rope") }
	},
	{
		Name: "Latex",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Latex") }
	},
	{
		Name: "Leather",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Leather") }
	},
	{
		Name: "Metal",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Metal") }
	},
	{
		Name: "Tape",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Tape") }
	},
	{
		Name: "Nylon",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Nylon") }
	},
	{
		Name: "Lingerie",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Lingerie") }
	},
	{
		Name: "Pet",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Pet") }
	},
	{
		Name: "Pony",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "Pony") }
	},
	{
		Name: "ABDL",
		GetFactor: function (C) { return ActivityFetishItemFactor(C, "ABDL") }
	}
];
/* eslint-enable */
