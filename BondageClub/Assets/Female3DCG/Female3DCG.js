// *** Item Value Guidelines ***
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

// Sort order of asset properties:
// Name, Priority, Value, Difficulty, SelfBondage, Time, RemoveTime, Enable, Visible, Random, Wear, IsRestraint, AllowLock, OwnerOnly, LoverOnly, Left, Top, DefaultColor, BuyGroup, Prerequisite, Hide, HideItem, everything else

// Sort order of asset group properties:
// Group, ParentGroup, ParentSize, ParentColor, Category, Priority, Default, Clothing, Underwear, Random, IsRestraint, Blink, Left, Top, Color, FullAlpha, AllowNone, AllowColorize, AllowCustomize, AllowPose, SetPose, Effect, Zone, Activity

// Spanking Toys Asset
var AssetSpankingToys = {
	Name: "SpankingToys", Random: false, Wear: false, BuyGroup: "SpankingToys", DynamicAllowInventoryAdd: C => InventoryIsWorn(Player, "SpankingToys", "ItemHands") && InventorySpankingToysActivityAllowed(C),
	DynamicDescription: C => InventorySpankingToysGetDescription(C),
	DynamicExpressionTrigger: C => SpankingInventory.find(x => x.Name == InventorySpankingToysGetType(Player)).ExpressionTrigger,
	DynamicPreviewIcon: C => InventorySpankingToysGetType(Player),
	DynamicName: C => "SpankingToys" + InventorySpankingToysGetType(C),
	DynamicGroupName: "ItemHands",
	DynamicActivity: C => InventorySpankingToysGetActivity(C),
	IgnoreParentGroup: true
};

// 3D Custom Girl based assets
var AssetFemale3DCG = [

	// Appearance specific
	{
		Group: "Cloth",
		ParentGroup: "BodyUpper",
		Priority: 30,
		Clothing: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Yoked", "Hogtied", "AllFours"],
		Asset: [
			{ Name: "CollegeOutfit1", Value: -1, Hide: ["ItemNeck"], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "MaidOutfit1", Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "MaidOutfit2", Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"] },
			{ Name: "StudentOutfit1", Hide: ["ItemNeck", "ItemHidden"], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "StudentOutfit2", HideItem: ["ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemHiddenLeatherArmbinderStrap", "ItemHiddenLeatherArmbinderWrapStrap", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{
				Name: "StudentOutfit3", HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemHiddenLeatherArmbinderStrap", "ItemHiddenLeatherArmbinderWrapStrap"], Layer: [
					{ Name: "White", AllowColorize: false },
					{ Name: "Color", AllowColorize: true }
				],
				Require: ["ClothLower", "ClothAccessory"]
			},
			{ Name: "BabydollDress1", HideItem: ["ClothLowerLatexSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "TeacherOutfit1", Hide: ["ItemNeck", "ItemHidden"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], AllowPose: ["Horse", "KneelingSpread", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero"] },
			{ Name: "ChineseDress1", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "ChineseDress2", Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "TShirt1", HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Require: ["ClothLower"] },
			{ Name: "TennisShirt1", Hide: ["ItemHidden"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Require: ["ClothLower"] },
			{ Name: "Sweater1", HideItem: ["ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Require: ["ClothLower"] },
			{ Name: "MistressTop", Value: -1, Hide: ["Bra"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Require: ["ClothLower"] },
			{ Name: "AdultBabyDress1", Value: 60, Hide: ["ItemHidden"], HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "AdultBabyDress2", Value: 80, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "AdultBabyDress3", Value: 40, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "AdultBabyDress4", Value: 80, Left: 100, Top: 190, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "NurseUniform", Value: -1, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "Robe1", Value: 30, Hide: ["ItemHidden"], HideItem: ["ClothLowerLatexSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "SuspenderTop1", Priority: 25, Value: 50, Hide: ["Panties", "ItemVulva", "ItemVulvaPiercings"], Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"] },
			{ Name: "LeatherCorsetTop1", Priority: 25, Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{
				Name: "FlowerDress", Value: 50, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"],
				AllowPose: ["Suspension"],
				Layer: [
					{ Name: "Dress", AllowColorize: true },
					{ Name: "Flower", AllowColorize: false }
				]
			},
			{ Name: "Dress2", Value: 100, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "LaceBabydoll", Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "SleevelessTop", Value: 20, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{
				Name: "DressFur", Value: 70, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"],
				Layer: [
					{ Name: "Fabric", AllowColorize: true },
					{ Name: "Fur", AllowColorize: false }
				]
			},
			{ Name: "BodyTowel1", Value: 30, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "Yukata1", Value: 50, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "SteampunkCorsetTop1", Priority: 25, Value: 70, Hide: ["ItemHidden"], HideItem: ["ClothLowerTennisSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "BondageDress1", Value: 90, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "BondageDress2", Value: 90, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "ShoulderlessTop", Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "Dress3", Value: 80, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "ComfyTop", Value: 60, Hide: ["ItemNipples", "ItemNipplesPiercings"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "WeddingDress1", Priority: 22, Value: 150, Hide: ["ClothLower", "BodyLower", "Panties", "Shoes", "ItemBoots"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemFeetLeatherAnkleCuffs", "ItemLegsLeatherLegCuffs", "ItemLegsWoodenHorse", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar", "ItemLegsOrnateLegCuffs", "ItemFeetOrnateAnkleCuffs", "ItemDevicesSaddleStand", "ItemVulvaWandBelt", "ItemFeetAnkleShackles", "ItemFeetIrish8Cuffs", "ItemFeetBallChain"], AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Yoked", "Hogtied", "LegsClosed", "Kneel", "KneelingSpread"] },
			{ Name: "WeddingDress2", Priority: 22, Value: 150, Hide: ["ClothLower", "BodyLower", "Panties", "Shoes", "ItemBoots"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemFeetLeatherAnkleCuffs", "ItemLegsLeatherLegCuffs", "ItemLegsWoodenHorse", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar", "ItemLegsOrnateLegCuffs", "ItemFeetOrnateAnkleCuffs", "ItemDevicesSaddleStand", "ItemVulvaWandBelt", "ItemFeetAnkleShackles", "ItemFeetIrish8Cuffs", "ItemFeetBallChain"], AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Yoked", "Hogtied", "LegsClosed", "Kneel", "KneelingSpread"] },
			{ Name: "BridesmaidDress1", Value: 100, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "Gown1", Value: 70, Random: false, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "Gown2Top", Value: 90, Random: false, Left: 125, Top: 220, BuyGroup: "Gown2", HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Require: ["ClothLower"] },
			{ Name: "Gown3", Value: 70, Random: false, Left: 99, Top: 194, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "MaidApron1", Priority: 32, Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "MaidApron2", Priority: 32, Value: -1, BuyGroup: "Maid", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"] },
			{ Name: "AdmiralTop", Value: 30, Hide: ["ItemNeck", "ItemHidden"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], AllowPose: ["Horse", "KneelingSpread", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero"] },
			{ Name: "VirginKiller1", Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "ReverseBunnySuit", Value: 100, BuyGroup: "ReverseBunnySuit" },
			{ Name: "LeatherCropTop", Value: 60, Hide: ["ItemNipples", "ItemNipplesPiercings"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "CorsetShirt", Priority: 25, Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"],
				Layer: [
					{ Name: "Shirt", AllowColorize: true },
					{ Name: "Corset", AllowColorize: false }
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
		Random: false,
		Asset: [
			{ Name: "StudentOutfit3Scarf", Priority: 34, Left: 200, Top: 250 },
			{ Name: "StudentOutfit3Bow1", Priority: 34, Left: 200, Top: 250 },
			{ Name: "StudentOutfit3Bow2", Priority: 34, Left: 200, Top: 250 },
			{ Name: "StudentOutfit3Bow3", Priority: 34, Left: 200, Top: 250 },
			{
				Name: "Bouquet", Priority: 41, Value: 40, Left: 175, Top: 350, BuyGroup: "Bouquet", AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Yoked", "Hogtied"],
				Layer: [
					{ Name: "Base", AllowColorize: false },
					{ Name: "Flowers", AllowColorize: true }
				]
			},
			{ Name: "FrillyApron", ParentGroup: "BodyUpper", Value: -1, Left: 135, Top: 179, BuyGroup: "Maid", AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Yoked", "Hogtied"] },
			{ Name: "BunnyCollarCuffs", ParentGroup: "BodyUpper", Value: 10, Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast", "ItemTorso"], AllowPose: ["AllFours", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Yoked", "Hogtied"] }
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Necklace",
		ParentGroup: "BodyUpper",
		Priority: 31,
		Default: false,
		Clothing: true,
		Random: false,
		Asset: [
			{ Name: "Necklace1", Value: 40, Left: 148, Top: 70, IgnoreParentGroup: true },
			{ Name: "Necklace2", Left: 147, Top: 90, IgnoreParentGroup: true },
			{ Name: "Necklace3", Left: 147, Top: 110, IgnoreParentGroup: true },
			{ Name: "Necklace4", Value: 30, Left: 147, Top: 110, IgnoreParentGroup: true },
			{
				Name: "NecklaceLock", Value: 40, Left: 155, Top: 152, Priority: 29, IgnoreParentGroup: true,
				Layer: [
					{ Name: "Chain", AllowColorize: true },
					{ Name: "Lock", AllowColorize: false }
				]
			},
			{
				Name: "NecklaceKey", Value: 40, Left: 153, Top: 152, Priority: 29, IgnoreParentGroup: true,
				Layer: [
					{ Name: "Chain", AllowColorize: true },
					{ Name: "Key", AllowColorize: false }
				]
			},
			{
				Name: "IDCard", Value: 10, Left: 145, Top: 180, IgnoreParentGroup: true,
				Layer: [
					{ Name: "String", AllowColorize: true },
					{ Name: "Card", AllowColorize: false }
				]

			}

		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Suit",
		ParentGroup: "BodyUpper",
		Priority: 14,
		Clothing: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Yoked", "Hogtied"],
		Asset: [
			{
				Name: "Catsuit", Value: 100, BuyGroup: "Catsuit", Hide: ["ItemNipplesPiercings"], HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"],
				Layer: [
					{ Name: "Base", AllowColorize: true },
					{ Name: "Zip", AllowColorize: false }
				]
			},
			{ Name: "SeamlessCatsuit", Value: -1, BuyGroup: "Catsuit", Hide: ["ItemNipplesPiercings"], HideItem: ["ItemNipplesChopStickNippleClamps"] },
			{ Name: "SeethroughSuit", Value: 100, BuyGroup: "SeethroughSuit", HideItem: ["ItemNipplesChopStickNippleClamps"] },
			{
				Name: "SeethroughSuitZip", Value: -1, BuyGroup: "SeethroughSuit", HideItem: ["ItemNipplesChopStickNippleClamps"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"],
				Layer: [
					{ Name: "Base", AllowColorize: true },
					{ Name: "Zip", AllowColorize: false }
				]
			},
			{ Name: "ReverseBunnySuit", Value: 100, BuyGroup: "ReverseBunnySuit" }
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
		AllowPose: ["LegsClosed", "Kneel", "StraitDressOpen", "Horse", "KneelingSpread"],
		Asset: [
			{ Name: "Skirt1", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "Skirt2", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Layer: [
					{ Name: "Color", AllowColorize: true },
					{ Name: "Stripe", AllowColorize: false }
				],
				ParentItem: "StudentOutfit3"
			},
			{
				Name: "Skirt3", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], Layer: [
					{ Name: "Color", AllowColorize: true },
					{ Name: "Stripe", AllowColorize: false }
				],
				ParentItem: "StudentOutfit3"
			},
			{ Name: "TennisSkirt1", HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], ParentItem: "TennisShirt1" },
			{ Name: "Jeans1", Priority: 22, Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks6", "VibratingLatexPanties", "VibratingDildo", "InflatableVibeDildo", "ClitSuctionCup", "TapeStrips", "BenWaBalls", "HeavyWeightClamp", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Shorts1", Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "VibratingLatexPanties", "VibratingDildo", "InflatableVibeDildo", "ClitSuctionCup", "TapeStrips", "BenWaBalls", "HeavyWeightClamp", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Pajama1", Priority: 25, Random: false, HideItem: ["ItemButtAnalBeads2"] },
			{ Name: "MistressBottom", Value: -1, Hide: ["Panties"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Waspie1", Value: 60, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Waspie2", Value: 80, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Waspie3", Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "LatexPants1", Priority: 21, Value: 60, Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksStockings2", "SocksStockings3", "VibratingLatexPanties", "VibratingDildo", "InflatableVibeDildo", "ClitSuctionCup", "TapeStrips", "BenWaBalls", "HeavyWeightClamp", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "LatexSkirt1", Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "LatexSkirt2", Value: 60, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "ClothSkirt1", Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Jeans2", Priority: 22, Value: 20, Hide: ["ItemVulvaPiercings"], HideItem: ["ItemButtAnalBeads2", "SocksSocksFur", "SocksSocks6", "VibratingLatexPanties", "WandBelt", "VibratingDildo", "InflatableVibeDildo", "ClitSuctionCup", "TapeStrips", "BenWaBalls", "HeavyWeightClamp", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "ChineseSkirt1", Value: 40, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Gown2Skirt", Value: -1, Random: false, Left: 50, Top: 462, BuyGroup: "Gown2", Hide: ["ItemFeet"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemLegsNylonRope", "ItemLegsHempRope", "ItemLegsLeatherBelt", "ItemLegsSturdyLeatherBelts", "ItemLegsDuctTape", "ItemLegsLeatherLegCuffs", "ItemLegsOrnateLegCuffs", "ItemLegsZipties", "ItemLegsChains", "ItemBootsThighHighLatexHeels"], SetPose: ["LegsClosed"], ParentItem: "Gown2Top" },
			{ Name: "AdmiralSkirt", Value: 30, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "JeanSkirt", Value: 30, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds"] },
			{ Name: "PencilSkirt", Value: 60, Left: 105, Top: 380, HideItem: ["ItemDevicesStrapOnSmooth", "ItemDevicesStrapOnStuds", "ItemLegsNylonRope", "ItemLegsHempRope", "ItemLegsLeatherBelt", "ItemLegsSturdyLeatherBelts", "ItemLegsDuctTape", "ItemLegsLeatherLegCuffs", "ItemLegsOrnateLegCuffs", "ItemLegsZipties", "ItemLegsChains", "ItemFeetSpreaderMetal", "ItemFeetSpreaderDildoBar", "ItemFeetSpreaderVibratingDildoBar"], SetPose: ["LegsClosed"] },
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
		AllowPose: ["LegsClosed", "Kneel", "StraitDressOpen", "Horse", "KneelingSpread"],
		Asset: [
			{
				Name: "Catsuit", Value: -1, BuyGroup: "Catsuit", Hide: ["ItemVulvaPiercings", "BodyLower"], HideItem: ["SocksPantyhose1"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
				Layer: [
					{ Name: "Base", AllowColorize: true },
					{ Name: "Zip", AllowColorize: false }
				]
			},
			{ Name: "SeamlessCatsuit", Value: -1, BuyGroup: "Catsuit", Hide: ["ItemVulvaPiercings", "BodyLower"], HideItem: ["SocksPantyhose1"] },
			{ Name: "SeethroughSuit", Value: -1, BuyGroup: "SeethroughSuit", HideItem: ["SocksPantyhose1"] },
			{
				Name: "SeethroughSuitZip", Value: -1, BuyGroup: "SeethroughSuit", HideItem: ["SocksPantyhose1"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"],
				Layer: [
					{ Name: "Base", AllowColorize: true },
					{ Name: "Zip", AllowColorize: false }
				]
			},
			{ Name: "ReverseBunnySuit", Value: -1, BuyGroup: "ReverseBunnySuit", Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] }
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
		Asset: [
			{ Name: "Bra1", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra2", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra7", Priority: 20, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra8", Value: 15, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra9", Value: 10, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bandeau1", Priority: 20, Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bustier1", Value: 30, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset1", Value: 35, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset2", Value: 30, BuyGroup: "Corset2", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset3", Value: 25, BuyGroup: "Corset3", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset4", Value: 15, BuyGroup: "Corset4", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Corset5", Value: 20, BuyGroup: "Corset5", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Bikini1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikini1", Value: 50, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikini2", Value: 40, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikini3", Value: 45, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Swimsuit1", Value: 15, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings"], HideItem: ["VibratingLatexPanties", "VibratingDildo", "InflatableVibeDildo", "ClitSuctionCup", "TapeStrips", "BenWaBalls", "HeavyWeightClamp"] },
			{ Name: "Swimsuit2", Value: 25, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings"], HideItem: ["VibratingLatexPanties", "VibratingDildo", "InflatableVibeDildo", "ClitSuctionCup", "TapeStrips", "BenWaBalls", "HeavyWeightClamp"] },
			{ Name: "BunnySuit", Value: 30, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings"], HideItem: ["VibratingLatexPanties", "VibratingDildo", "InflatableVibeDildo", "ClitSuctionCup", "TapeStrips", "BenWaBalls", "HeavyWeightClamp"] },
			{ Name: "FrameBra1", Value: 20, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "FrameBra2", Value: 15, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "BondageBra1", Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "LatexBra1", Value: 30, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra1", Priority: 20, Value: 30, BuyGroup: "HarnessBra1", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra2", Priority: 20, Value: 40, BuyGroup: "HarnessBra2", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "CuteBikini1", Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "CorsetBikini1", Priority: 20, Value: 40, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings"], HideItem: ["VibratingLatexPanties", "VibratingDildo", "InflatableVibeDildo", "ClitSuctionCup", "TapeStrips", "BenWaBalls", "HeavyWeightClamp"] },
			{ Name: "OuvertPerl1", Priority: 20, Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Sarashi1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "KittyBra1", Value: 30, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "FishnetBikini1", Priority: 20, Value: 45, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings"], HideItem: ["VibratingLatexPanties", "VibratingDildo", "InflatableVibeDildo", "ClitSuctionCup", "TapeStrips", "BenWaBalls", "HeavyWeightClamp"] },
			{ Name: "SexyBeachBra1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikiniBra1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "StarHarnessBra", Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HeartTop", Priority: 20, Value: 35, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "ChineseBra1", Value: 35, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "LatexCorset1", Priority: 20, Value: 40, BuyGroup: "LatexCorset1", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "LeatherStrapBra1", Value: 15, BuyGroup: "LeatherStrapBra1", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] }
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
		Asset: [
			{ Name: "Panties1", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Panties7", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Panties8", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Panties11", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Panties12", Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Panties13", Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Panties14", Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Panties15", Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Bikini1", Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Diapers1", Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{
				Name: "Diapers2", Value: 30, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"],
				Layer: [
					{ Name: "Diaper", AllowColorize: false },
					{ Name: "Cover", AllowColorize: true }
				]
			},
			{ Name: "Diapers3", Value: 30, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "Panties16", Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "MaidPanties1", Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "LatexPanties1", Value: 30, Expose: ["ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "WrapPanties1", Value: 25, Expose: ["ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "CrotchPanties1", Value: 30, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "StringPanties1", Value: 15, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "StringPasty1", Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "ZipPanties1", Value: 15, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "HarnessPanties1", Value: 35, BuyGroup: "HarnessPanties1", AllowPose: ["LegsClosed", "Kneel"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "HarnessPanties2", Value: 40, Left: 85, Top: 395, BuyGroup: "HarnessPanties2", AllowPose: ["LegsClosed", "Kneel", "Horse", "KneelingSpread"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "KittyPanties1", Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "PearlPanties1", Value: 20, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "SunstripePanties1", Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "SexyBeachPanties1", Value: 20, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "ChinesePanties1", Value: 25, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] },
			{ Name: "LeatherStrapPanties1", Value: 20, BuyGroup: "LeatherStrapPanties1", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup", "ItemVulvaPiercingsVibeHeartClitPiercing"] }

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
		AllowPose: ["LegsClosed", "Kneel", "StraitDressOpen", "Hogtied"],
		Asset: [
			"Socks0", "Socks1", "Socks2", "Socks3", "Socks4", "Socks5", "Stockings1", "Stockings2",
			{ Name: "Stockings3", Value: 10 },
			{ Name: "Stockings4", Value: 10 },
			{ Name: "Pantyhose1", Value: 10, HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "Socks6", Value: 25,
				Layer: [
					{ Name: "Sock", AllowColorize: true },
					{ Name: "Frill", AllowColorize: false }
				]
			},
			{
				Name: "SocksFur", Value: 40,
				Layer: [
					{ Name: "Fabric", AllowColorize: true },
					{ Name: "Fur", AllowColorize: false }
				]
			},
			{ Name: "SocksStriped1", Value: 10 },
			{ Name: "LatexSocks1", Value: 30 },
			{ Name: "FootlessSocks1", Value: 15 },
			{ Name: "ReverseBunnySuit", Value: 100, BuyGroup: "ReverseBunnySuit" },
			{ Name: "LeatherSocks1", Value: 20 }
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Shoes",
		ParentGroup: "BodyLower",
		Priority: 23,
		Clothing: true,
		Left: 125,
		Top: 500,
		AllowPose: ["LegsClosed", "Kneel", "Hogtied"],
		Asset: [
			{ Name: "Shoes1", Height: 6 },
			{ Name: "Shoes2", Height: 6 },
			{ Name: "Shoes4", Height: 6 },
			{ Name: "Sneakers1", Height: 3 },
			{ Name: "Sneakers2", Height: 3 },
			{ Name: "Heels1", Height: 15 },
			{ Name: "Heels2", Height: 15 },
			{ Name: "Boots1", Height: 9 },
			{ Name: "MistressBoots", Value: -1, HideItem: ["SocksSocks4", "SocksSocks5"], Alpha: [[75, 875, 140, 200], [290, 875, 140, 200]], Height: 35 },
			{ Name: "PonyBoots", Value: -1, Alpha: [[75, 875, 140, 200], [290, 875, 140, 200]], Height: 35 },
			{ Name: "Sandals", Priority: 22, Value: 30, HideItem: ["SocksSocks0", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksSocksFur"], Height: 3 },
			{ Name: "PawBoots", Value: 45, Height: 3 },
			{ Name: "WoollyBootsTall", Value: 60, Height: 9 },
			{ Name: "ThighHighLatexHeels", Value: 80, BuyGroup: "ThighHighLatexHeels", Alpha: [[75, 850, 140, 200], [290, 850, 140, 200]], Height: 30 },
			{ Name: "Heels3", Height: 15, Value: 30 }
		],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Hat",
		Priority: 46,
		Default: false,
		Clothing: true,
		Left: 125,
		Top: 0,
		AllowPose: ["Suspension"],
		Asset: [
			"Band1", "Band2", "Beret1",
			{ Name: "MaidHairband1", Value: -1 },
			{ Name: "NurseCap", Value: -1 },
			{
				Name: "Santa1", Value: 20,
				Layer: [
					{ Name: "Fabric", AllowColorize: true },
					{ Name: "Fur", AllowColorize: false }
				]
			},
			{ Name: "CaptainHat1", Value: 25 },
			{ Name: "BunnySuccubus2", Value: 35 },
			{ Name: "WitchHat1", Value: 40 },
			{ Name: "PirateBandana1", Value: 15 },
			{ Name: "PoliceWomanHat", Value: 40 },
			{ Name: "HeadTowel1", Value: 15, Hide: ["HairFront", "HairBack"] },
			{ Name: "CollegeDunce", Value: -1 },
			{ Name: "Tiara1", Value: 40 },
			{
				Name: "Bonnet1", Value: 20,
				Layer: [
					{ Name: "Base", AllowColorize: true },
					{ Name: "Lace", AllowColorize: false }
				]
			},
			{ Name: "Bonnet2", Value: 20 },
			{ Name: "Crown1", Value: 20 },
			{ Name: "Crown2", Value: 20 },
			{ Name: "Crown3", Value: 20 },
			{ Name: "Crown4", Value: 20 },
			{ Name: "Crown5", Value: 20 }
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "HairAccessory1",
		Priority: 45,
		Default: false,
		Clothing: true,
		Left: 90,
		Top: 0,
		AllowPose: ["Suspension"],
		Asset: [
			{ Name: "Ears1", BodyCosplay: true },
			{ Name: "Ears2", BodyCosplay: true },
			{ Name: "PonyEars1", BodyCosplay: true },
			{ Name: "Ribbons1", Priority: 4, BuyGroup: "Ribbons1" },
			{ Name: "Ribbons2", Priority: 4, Value: -1, BuyGroup: "Ribbons2" },
			{ Name: "Ribbons3", BuyGroup: "Ribbons3" },
			{ Name: "Ribbons4", BuyGroup: "Ribbons4" },
			{ Name: "GiantBow1", Priority: 4, BuyGroup: "GiantBow1" },
			{ Name: "BunnyEars1", Value: 10, BuyGroup: "BunnyEars1", BodyCosplay: true },
			{ Name: "BunnyEars2", Value: 20, BuyGroup: "BunnyEars2", BodyCosplay: true },
			{ Name: "PuppyEars1", Priority: 6, Value: 20, BuyGroup: "PuppyEars1", BodyCosplay: true },
			{ Name: "SuccubusHorns", Value: 15, BuyGroup: "SuccubusHorns", BodyCosplay: true },
			{ Name: "Horns", Value: 20, BuyGroup: "Horns", BodyCosplay: true },
			{ Name: "Horns2", Value: 15, BuyGroup: "Horns2", BodyCosplay: true },
			{ Name: "Horns3", Value: 15, BuyGroup: "Horns3", BodyCosplay: true },
			{ Name: "HairFlower1", Value: 10, BuyGroup: "HairFlower1" },
			{ Name: "FoxEars1", Value: 15, BuyGroup: "FoxEars1", BodyCosplay: true },
			{ Name: "BatWings", Value: 20, BuyGroup: "BatWings", BodyCosplay: true },
			{ Name: "KittyMask1", Value: 25, BuyGroup: "BatWings", Hide: ["HairFront", "Glasses", "HairAccessory2"] },
			{ Name: "KittenEars1", Value: 20, BuyGroup: "KittenEars1", BodyCosplay: true },
			{ Name: "KittenEars2", Value: 20, BuyGroup: "KittenEars2", BodyCosplay: true },
			{ Name: "WolfEars1", Value: 20, BuyGroup: "WolfEars1", BodyCosplay: true },
			{ Name: "WolfEars2", Value: 20, BuyGroup: "WolfEars2", BodyCosplay: true },
			{ Name: "FoxEars2", Value: 20, BuyGroup: "FoxEars2", BodyCosplay: true },
			{ Name: "FoxEars3", Value: 20, BuyGroup: "FoxEars3", BodyCosplay: true },
			{ Name: "PuppyEars2", Value: 20, BuyGroup: "PuppyEars2", BodyCosplay: true },
			{ Name: "RaccoonEars1", Value: 15, BuyGroup: "RaccoonEars1", BodyCosplay: true },
			{ Name: "WeddingVeil1", Priority: 4, Value: 30, BuyGroup: "WeddingVeil1" },
			{ Name: "HairFeathers1", Value: 10, BuyGroup: "HairFeathers1" },
			{ Name: "MouseEars1", Value: 20, BuyGroup: "MouseEars1", BodyCosplay: true },
			{ Name: "MouseEars2", Value: 20, BuyGroup: "MouseEars2", BodyCosplay: true }
		],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "HairAccessory2",
		Priority: 47,
		Default: false,
		Clothing: true,
		Left: 90,
		Top: 0,
		AllowPose: ["Suspension"],
		Asset: [
			{ Name: "Ears1", BodyCosplay: true },
			{ Name: "Ears2", BodyCosplay: true },
			{ Name: "PonyEars1", BodyCosplay: true },
			{ Name: "Ribbons1", Priority: 4, BuyGroup: "Ribbons1" },
			{ Name: "Ribbons2", Priority: 4, Value: -1, BuyGroup: "Ribbons2" },
			{ Name: "Ribbons3", BuyGroup: "Ribbons3" },
			{ Name: "Ribbons4", BuyGroup: "Ribbons4" },
			{ Name: "GiantBow1", Priority: 4, BuyGroup: "GiantBow1" },
			{ Name: "BunnyEars1", Value: -1, BuyGroup: "BunnyEars1", BodyCosplay: true },
			{ Name: "BunnyEars2", Value: -1, BuyGroup: "BunnyEars2", BodyCosplay: true },
			{ Name: "PuppyEars1", Priority: 29, Value: -1, BuyGroup: "PuppyEars1", BodyCosplay: true },
			{ Name: "SuccubusHorns", Value: -1, BuyGroup: "SuccubusHorns", BodyCosplay: true },
			{ Name: "Horns", Value: -1, BuyGroup: "Horns", BodyCosplay: true },
			{ Name: "Horns2", Value: -1, BuyGroup: "Horns2", BodyCosplay: true },
			{ Name: "Horns3", Value: -1, BuyGroup: "Horns3", BodyCosplay: true },
			{ Name: "HairFlower1", Value: -1, BuyGroup: "HairFlower1" },
			{ Name: "FoxEars1", Value: -1, BuyGroup: "FoxEars1", BodyCosplay: true },
			{ Name: "BatWings", Value: -1, BuyGroup: "BatWings", BodyCosplay: true },
			{ Name: "KittyMask1", Value: -1, BuyGroup: "BatWings", Hide: ["HairFront", "Glasses", "HairAccessory1"] },
			{ Name: "KittenEars1", Value: -1, BuyGroup: "KittenEars1", BodyCosplay: true },
			{ Name: "KittenEars2", Value: -1, BuyGroup: "KittenEars2", BodyCosplay: true },
			{ Name: "WolfEars1", Value: -1, BuyGroup: "WolfEars1", BodyCosplay: true },
			{ Name: "WolfEars2", Value: -1, BuyGroup: "WolfEars2", BodyCosplay: true },
			{ Name: "FoxEars2", Value: -1, BuyGroup: "FoxEars2", BodyCosplay: true },
			{ Name: "FoxEars3", Value: -1, BuyGroup: "FoxEars3", BodyCosplay: true },
			{ Name: "PuppyEars2", Value: -1, BuyGroup: "PuppyEars2", BodyCosplay: true },
			{ Name: "RaccoonEars1", Value: -1, BuyGroup: "RaccoonEars1", BodyCosplay: true },
			{ Name: "WeddingVeil1", Priority: 4, Value: -1, BuyGroup: "WeddingVeil1" },
			{ Name: "HairFeathers1", Value: -1, BuyGroup: "HairFeathers1" },
			{ Name: "MouseEars1", Value: 20, BuyGroup: "MouseEars1", BodyCosplay: true },
			{ Name: "MouseEars2", Value: 20, BuyGroup: "MouseEars2", BodyCosplay: true }
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
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "AllFours"],
		Asset: [
			"Gloves1", "Gloves2",
			{ Name: "Gloves3", Value: 15, Left: 60, Top: 109 },
			{ Name: "MistressGloves", Value: -1 },
			{ Name: "FingerlessGloves", Value: 20 },
			{
				Name: "GlovesFur", Value: 30,
				Layer: [
					{ Name: "Fabric", AllowColorize: true },
					{ Name: "Fur", AllowColorize: false }
				]
			},
			{ Name: "Catsuit", Value: -1, BuyGroup: "Catsuit" },
			{ Name: "SeethroughSuit", Value: -1, BuyGroup: "SeethroughSuit" }
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
		Asset: [
			"Glasses1", "Glasses2", "Glasses3", "Glasses4", "Glasses5", "Glasses6",
			{ Name: "SunGlasses1", Value: 15 },
			{ Name: "SunGlasses2", Value: 15 },
			{ Name: "EyePatch1", Value: 10, Priority: 29 }],
		Color: ["#303030", "#808080", "#e0e0e0", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
	},
	{
		Group: "Mask",
		Priority: 28,
		Default: false,
		Clothing: true,
		Underwear: true,
		Left: 180,
		Top: 125,
		Asset: [
			{ Name: "VenetianMask", HideItem: ["ItemHeadNoseRing"] },
			{ Name: "DominoMask", HideItem: ["ItemHeadNoseRing"] },
			{ Name: "ButterflyMask", Value: 30, HideItem: ["ItemHeadNoseRing"] },
			{ Name: "ShinobiMask", Value: 30, Left: 199, Top: 88, HideItem: ["ItemHeadNoseRing"] },
			{ Name: "FoxMask", Value: 30, Left: 150, Top: 20, HideItem: ["ItemHeadNoseRing"] }],
		Color: ["#303030", "#808080", "#e0e0e0", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
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
		AllowPose: ["AllFours"],
		Asset: [
			{ Name: "TailStrap", Value: 30 },
			{ Name: "HorseTailStrap", Value: 20 },
			{ Name: "HorseTailStrap1", Value: 30 },
			{ Name: "FoxTailsStrap", Priority: 2, Value: 50 },
			{ Name: "PuppyTailStrap", Value: 15 },
			{ Name: "SuccubusStrap", Value: 15 },
			{ Name: "SuccubusTailStrap", Value: 10 },
			{ Name: "RaccoonStrap", Value: 25 },
			{ Name: "RaccoonTailStrap", Priority: 2, Value: 35 },
			{ Name: "PuppyTailStrap1", Value: 20 },
			{ Name: "KittenTailStrap1", Value: 20 },
			{ Name: "KittenTailStrap2", Value: 20 },
			{ Name: "FoxTailStrap1", Value: 20 },
			{ Name: "FoxTailStrap2", Value: 20 },
			{ Name: "WolfTailStrap1", Value: 20 },
			{ Name: "WolfTailStrap2", Value: 20 },
			{ Name: "WolfTailStrap3", Value: 20 },
			{ Name: "DemonPlug", Value: 30 },
			{ Name: "MouseTailStrap1", Value: 20 },
			{ Name: "MouseTailStrap2", Value: 20 }
		],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"]
	},

	{
		Group: "Wings",
		ParentColor: "Bra",
		Priority: 3,
		Default: false,
		Clothing: true,
		Underwear: true,
		BodyCosplay: true,
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
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "StraitDressOpen", "Yoked", "Hogtied", "AllFours"],
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
		AllowPose: ["LegsClosed", "Kneel", "Horse", "KneelingSpread"],
		Asset: ["Small", "Normal", "Large", "XLarge"],
		Color: ["White", "Asian", "Black"]
	},

	{
		Group: "Hands",
		ParentColor: "BodyUpper",
		Priority: 27,
		AllowNone: false,
		AllowColorize: false,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "AllFours"],
		Asset: ["Default"],
		Color: ["White", "Asian", "Black"]
	},

	{
		Group: "HairBack",
		Priority: 5,
		Left: 50,
		Top: 0,
		AllowNone: false,
		AllowPose: ["Suspension", "Hogtied", "AllFours"],
		Asset: ["HairNone", "HairBack1", "HairBack2", "HairBack4", "HairBack10", "HairBack14", "HairBack15", "HairBack16", "HairBack17", "HairBack18", "HairBack19", "HairBack20", "HairBack5", "HairBack8", "HairBack11", "HairBack6", "HairBack21", "HairBack22",
			{ Name: "HairBack23", Priority: 39 },
			{ Name: "HairBack24", Priority: 39 }
		],
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"]
	},

	{
		Group: "HairFront",
		ParentColor: "HairBack",
		Priority: 44,
		Left: 150,
		Top: 50,
		AllowNone: false,
		Asset: ["HairFront1", "HairFront1b", "HairFront2", "HairFront2b", "HairFront3", "HairFront3b", "HairFront4", "HairFront4b", "HairFront5", "HairFront5b", "HairFront6", "HairFront6b", "HairFront7", "HairFront7b", "HairFront8", "HairFront8b", "HairFront9", "HairFront9b", "HairFront10", "HairFront10b", "HairFront11", "HairFront11b", "HairFront12", "HairFront12b", "HairFront13", "HairFront13b", "HairFront14", "HairFront14b"],
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"]
	},

	{
		Group: "Eyes",
		Priority: 9,
		Blink: true,
		Left: 200,
		Top: 145,
		FullAlpha: false,
		AllowNone: false,
		AllowExpression: ["Closed", "Dazed", "Shy", "Sad", "Horny", "Lewd", "VeryLewd", "Heart", "HeartPink", "LewdHeart", "LewdHeartPink", "Dizzy", "Daydream", "WinkL", "WinkR", "Angry", "Surprised", "Scared"],
		Asset: ["Eyes1", "Eyes2", "Eyes3", "Eyes4", "Eyes5", "Eyes6", "Eyes7", "Eyes8", "Eyes9", "Eyes10", "Eyes11"],
		Color: ["#6a3628", "#5e481e", "#666666", "#555588", "#558855", "#885555", "#202020", "#aa3333", "#33aa33", "#3333aa", "#aaaa33", "#33aaaa", "#aa33aa"]
	},

	{
		Group: "Mouth",
		Priority: 10,
		Left: 235,
		Top: 180,
		AllowNone: false,
		AllowExpression: ["Frown", "Sad", "Pained", "Angry", "HalfOpen", "Open", "Ahegao", "Moan", "TonguePinch", "LipBite", "Happy", "Devious", "Laughing", "Grin", "Smirk"],
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
		Default: false,
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
		Group: "Blush",
		Priority: 8,
		Left: 190,
		Top: 100,
		AllowNone: false,
		AllowColorize: false,
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
		AllowColorize: false,
		AllowCustomize: false,
		AllowExpression: ["DroolLow", "DroolMedium", "DroolHigh", "DroolSides", "DroolMessy", "DroolTearsLow", "DroolTearsMedium", "DroolTearsHigh", "DroolTearsMessy", "DroolTearsSides", "TearsHigh", "TearsMedium", "TearsLow"],
		Asset: ["Fluids"]
	},

	{
		Group: "Emoticon",
		Priority: 50,
		Left: 250,
		Top: 0,
		AllowNone: false,
		AllowColorize: false,
		AllowCustomize: false,
		AllowExpression: ["Afk", "Sleep", "Hearts", "Tear", "Hearing", "Confusion", "Exclamation", "Annoyed", "Read"],
		Asset: ["Emoticon"]
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
		Zone: [[100, 750, 300, 120]],
		Activity: ["Kiss", "Lick", "Nibble", "Tickle", "Spank", "Caress", "MassageHands", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem"],
		Asset: [
			{ Name: "NylonRope", Value: 30, Time: 15, DefaultColor: "#909090", BuyGroup: "NylonRope", SetPose: ["LegsClosed"], Audio: "RopeLong" },
			{ Name: "HempRope", Value: 60, Difficulty: 3, Time: 15, DefaultColor: "#956B1C", BuyGroup: "HempRope", HideItem: ["ItemDevicesTeddyBear"], SetPose: ["LegsClosed"], AllowType: ["Mermaid", "Suspension", "FullBinding", "Diamond", "Link"], Audio: "RopeLong", Extended: true },
			{ Name: "LeatherBelt", Value: 25, Time: 10, RemoveTime: 5, AllowLock: true, SetPose: ["LegsClosed"] },
			{ Name: "SturdyLeatherBelts", Value: 50, Time: 10, RemoveTime: 5, AllowLock: true, BuyGroup: "SturdyLeatherBelts", SetPose: ["LegsClosed"], AllowType: ["One", "Two", "Three", "Four"], Extended: true },
			{ Name: "Irish8Cuffs", Value: 25, Time: 10, RemoveTime: 5, AllowLock: true, SetPose: ["LegsClosed"] },
			{ Name: "DuctTape", Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape", HideItem: ["ItemBootsThighHighLatexHeels"], SetPose: ["LegsClosed"], AllowType: ["HalfFeet", "MostFeet", "CompleteFeet"], Extended: true },
			{ Name: "LeatherAnkleCuffs", Priority: 24, Value: 30, Difficulty: 2, Time: 10, Random: false, AllowLock: true, AllowPose: ["LegsClosed"], Effect: [], AllowEffect: ["Freeze", "Prone"], Extended: true },
			{
				Name: "OrnateAnkleCuffs", Priority: 24, Value: 90, Difficulty: 3, Time: 10, Random: false, AllowLock: true, AllowPose: ["LegsClosed"], Effect: [], AllowEffect: ["Freeze", "Prone"], Extended: true,
				Layer: [
					{ Name: "Cuffs", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{ Name: "SpreaderMetal", Value: 50, Difficulty: 3, Time: 10, Random: false, AllowLock: true, Prerequisite: ["LegsOpen", "NotKneeling"], SetPose: ["LegsOpen"], Effect: ["Freeze", "Prone"], Block: ["ItemLegs"], RemoveAtLogin: true },
			{ Name: "BallChain", Value: 40, Difficulty: 5, Time: 10, RemoveTime: 10, Random: false, AllowLock: true, AllowPose: ["LegsClosed"], Effect: [] },
			{ Name: "AnkleShackles", Value: 30, Difficulty: 6, Time: 10, RemoveTime: 5, Random: false, AllowLock: true, AllowPose: ["LegsClosed"], Effect: ["Prone"] },
			{ Name: "Zipties", Value: 20, Difficulty: 6, Time: 5, RemoveTime: 6, BuyGroup: "Zipties", SetPose: ["LegsClosed"] },
			{ Name: "Chains", Value: 90, Difficulty: 5, Time: 20, AllowLock: true, BuyGroup: "Chains", SetPose: ["LegsClosed"], AllowType: ["Strict", "Suspension"], Extended: true },
			{
				Name: "SpreaderDildoBar", Priority: 25, Value: 60, Difficulty: 5, Time: 10, Random: false, AllowLock: true, Top: 400, Prerequisite: ["AccessVulva", "LegsOpen", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste"], SetPose: ["LegsOpen"], Effect: ["Freeze", "Prone"], Block: ["ItemPelvis", "ItemLegs", "ItemVulva"],
				Layer: [
					{ Name: "DildoBar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				], RemoveAtLogin: true
			},
			{
				Name: "SpreaderVibratingDildoBar", Priority: 25, Value: 70, Difficulty: 5, Time: 10, Random: false, AllowLock: true, Top: 400, Prerequisite: ["AccessVulva", "LegsOpen", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste"], SetPose: ["LegsOpen"], Effect: ["Egged", "Freeze", "Prone"], AllowEffect: ["Egged", "Vibrating"], Block: ["ItemPelvis", "ItemLegs", "ItemVulva"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "DildoBar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				], RemoveAtLogin: true, ArousalZone: "ItemVulva"
			},
			AssetSpankingToys
		],
		Color: ["Default"]
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
		Effect: ["Prone", "KneelFreeze"],
		Zone: [[100, 580, 300, 170]],
		Activity: ["Kiss", "Lick", "Nibble", "Tickle", "Spank", "Caress", "MassageHands", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem"],
		Asset: [
			{ Name: "NylonRope", Value: 30, Time: 10, DefaultColor: "#909090", BuyGroup: "NylonRope", SetPose: ["LegsClosed"], Audio: "RopeLong" },
			{ Name: "HempRope", Value: 60, Difficulty: 3, Time: 10, RemoveTime: 15, DefaultColor: "#956B1C", BuyGroup: "HempRope", SetPose: ["LegsClosed"], AllowBlock: ["ItemFeet"], AllowEffect: ["ForceKneel"], AllowType: ["Mermaid", "FullBinding", "Frogtie", "Link", "Crossed"], Audio: "RopeLong", Extended: true },
			{ Name: "LeatherBelt", Value: 25, Time: 5, AllowLock: true, SetPose: ["LegsClosed"] },
			{ Name: "SturdyLeatherBelts", Value: 50, Time: 5, AllowLock: true, BuyGroup: "SturdyLeatherBelts", SetPose: ["LegsClosed"], AllowType: ["One", "Two", "Three", "Four"], Extended: true },
			{ Name: "DuctTape", Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape", HideItem: ["ItemBootsThighHighLatexHeels", "ShoesThighHighLatexHeels"], SetPose: ["LegsClosed"], AllowType: ["HalfLegs", "MostLegs", "CompleteLegs"], Extended: true },
			{ Name: "LeatherLegCuffs", Priority: 24, Value: 30, Difficulty: 2, Time: 10, Random: false, AllowLock: true, AllowPose: ["LegsClosed"], Effect: [], AllowEffect: ["Prone", "KneelFreeze"], AllowType: ["Closed"], Extended: true },
			{
				Name: "OrnateLegCuffs", Priority: 24, Value: 90, Difficulty: 3, Time: 10, Random: false, AllowLock: true, AllowPose: ["LegsClosed"], Effect: [], AllowEffect: ["Prone", "KneelFreeze"], AllowType: ["Closed"], Extended: true,
				Layer: [
					{ Name: "Cuffs", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{
				Name: "LegBinder", Value: 80, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: "#222222", Prerequisite: ["NotSuspended", "NotHogtied"], Hide: ["Shoes", "Socks", "ClothLower"], HideItem: ["OrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetLeatherAnkleCuffs", "ItemFeetMermaidRopeTie", "ItemBootsThighHighLatexHeels"], SetPose: ["LegsClosed"], Effect: ["Prone"], Block: ["ItemFeet"],
				Layer: [
					{ Name: "Latex", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false },
				]
			},
			{
				Name: "HobbleSkirt", Value: 125, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: "#222222", Prerequisite: ["NotKneeling", "NotSuspended", "NotHogtied"], Hide: ["Shoes", "Socks", "ClothLower"], HideItem: ["OrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetLeatherAnkleCuffs", "ItemFeetMermaidRopeTie", "ItemBootsThighHighLatexHeels"], SetPose: ["LegsClosed"], Effect: ["Prone"], Block: ["ItemPelvis", "ItemFeet", "ItemVulva", "ItemVulvaPiercings", "ItemButt"],
				Layer: [
					{ Name: "Latex", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false }
				]
			},
			{ Name: "SeamlessLegBinder", Value: 80, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: "#222222", Prerequisite: ["NotSuspended", "NotHogtied"], Hide: ["Shoes"], HideItem: ["OrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetLeatherAnkleCuffs", "ItemFeetMermaidRopeTie", "ItemBootsThighHighLatexHeels", "ClothLowerPajama1", "SocksSocks6", "SocksSocksFur"], SetPose: ["LegsClosed"], Effect: ["Prone"], Block: ["ItemFeet"] },
			{ Name: "SeamlessHobbleSkirt", Value: 125, Difficulty: 15, Time: 30, RemoveTime: 20, AllowLock: true, DefaultColor: "#222222", Prerequisite: ["NotKneeling", "NotSuspended", "NotHogtied"], Hide: ["Shoes"], HideItem: ["OrnateAnkleCuffs", "ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetLeatherAnkleCuffs", "ItemFeetMermaidRopeTie", "ItemBootsThighHighLatexHeels", "ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerLatexPants1", "ClothLowerMistressBottom", "ClothLowerPencilSkirt", "SocksSocks6", "SocksSocksFur"], SetPose: ["LegsClosed"], Effect: ["Prone"], Block: ["ItemPelvis", "ItemFeet", "ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{
				Name: "WoodenHorse", Priority: 34, Value: 200, Difficulty: 2, Time: 10, Random: false, Prerequisite: ["NotKneeling", "LegsOpen", "NotSuspended", "NotHogtied", "NotShackled"], Hide: ["Shoes", "Socks", "ItemBoots"], HideItem: ["ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerGown2Skirt", "ClothLowerLatexPants1", "ItemDevicesTeddyBear", "SuitLowerReverseBunnySuit"], SetPose: ["Horse"], Effect: ["Prone", "Freeze", "Mounted"], Alpha: [[160, 720, 200, 240]], Block: ["ItemFeet", "ItemBoots"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }, { Name: "Closed", Group: "Eyes", Timer: 5 }],
				Layer: [
					{ Name: "Frame", AllowColorize: true },
					{ Name: "Wood", AllowColorize: false }
				]
			},
			{ Name: "Zipties", Value: 20, Difficulty: 6, Time: 5, RemoveTime: 6, BuyGroup: "Zipties", SetPose: ["LegsClosed"] },
			{ Name: "Chains", Value: 90, Difficulty: 5, Time: 20, RemoveTime: 15, AllowLock: true, BuyGroup: "Chains", SetPose: ["LegsClosed"], AllowType: ["Strict"], Extended: true },
			{ Name: "FrogtieStraps", Value: 25, Time: 5, Random: false, AllowLock: true, Prerequisite: ["NotSuspended", "CanKneel"], SetPose: ["Kneel"], Effect: ["ForceKneel"] },
			AssetSpankingToys
		],
		Color: ["Default"]
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
		Activity: ["MasturbateHand", "MasturbateFist", "MasturbateFoot", "MasturbateTongue", "Caress", "Slap", "Kiss", "Nibble", "SpankItem", "TickleItem", "RubItem", "MasturbateItem"],
		Asset: [
			{ Name: "VibratingEgg", Value: 25, Time: 5, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "VibratingWand", Value: 60, Visible: false, Wear: false, Activity: "MasturbateItem", Bonus: [{ Factor: 3, Type: "KidnapManipulation" }], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "VibratorRemote", Value: 50, Visible: false, Wear: false, BuyGroup: "VibratorRemote", Prerequisite: ["RemotesAllowed"], Effect: ["Remote"] },
			{ Name: "VibratingLatexPanties", Value: 50, Time: 10, AllowLock: true, DefaultColor: "#60A0AF", Prerequisite: ["AccessVulva", "CannotHaveWand"], Effect: ["Egged", "Chaste"], AllowEffect: ["Egged", "Vibrating"], Block: ["ItemButt"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{
				Name: "WandBelt", Priority: 24, Value: 80, Time: 15, AllowLock: true, DefaultColor: "#BBAAAA", Prerequisite: ["CannotHaveWand"], HideItem: ["ClothLowerPajama1", "ClothLowerMistressBottom"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], Block: ["ItemPelvis"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Belt", AllowColorize: true },
					{ Name: "Wand", AllowColorize: false }
				]
			},
			{
				Name: "PenisDildo", Priority: 11, Value: 20, Time: 10, BuyGroup: "PenisDildo", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{
				Name: "VibratingDildo", Priority: 11, Value: 60, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{
				Name: "InflatableVibeDildo", Priority: 11, Value: 100, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{
				Name: "ClitoralStimulator", Priority: 11, Value: 70, Time: 10, DefaultColor: "#8a00d1", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Stimulator", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{ Name: "ClitSuctionCup", Priority: 11, Value: 25, Time: 10, Prerequisite: "AccessVulva", Effect: [], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true },
			{ Name: "TapeStrips", Value: 10, Time: 5, Prerequisite: "AccessVulva", ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "BenWaBalls", Value: 30, Time: 5, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "HeavyWeightClamp", Value: 30, Time: 5, Prerequisite: "AccessVulva", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "FullLatexSuitWand", Priority: 34, Value: -1, Difficulty: 12, Time: 5, IsRestraint: true, AllowLock: true, Effect: ["Egged", "Block", "Prone"], AllowEffect: ["Egged", "Vibrating"], Block: ["ItemVulvaPiercings"] },
			{
				Name: "ClitAndDildoVibratorbelt", Priority: 11, Value: 100, Time: 10, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Hide: ["Panties"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], Block: ["ItemPelvis"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Belt", AllowColorize: true },
					{ Name: "Crotch", AllowColorize: false }
				]
			},
			{
				Name: "HempRopeBelt", Value: 60, Time: 24, DefaultColor: "#956B1C", BuyGroup: "HempRope", Prerequisite: ["CannotHaveWand"], HideItem: ["ClothLowerPajama1", "ClothLowerMistressBottom"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], Block: ["ItemPelvis"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }],
				Layer: [
					{ Name: "Rope", AllowColorize: true },
					{ Name: "Wand", AllowColorize: false }
				]
			},
			{
				Name: "WiredEgg", ParentGroup: "BodyLower", Value: 30, Time: 5, Prerequisite: "AccessVulva", AllowPose: ["LegsClosed"], Effect: ["Egged"],
				Layer: [
					{ Name: "Remote", AllowColorize: true },
					{ Name: "Strap", AllowColorize: false }
				]
			},
			AssetSpankingToys
		],
		Color: ["Default"]
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
			{ Name: "StraightClitPiercing", Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "RoundClitPiercing", Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "WeightedClitPiercing", Value: 30, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "BarbellClitPiercing", Value: 20, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChastityClitPiercing", Value: 50, Difficulty: 50, Time: 20, RemoveTime: 20, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"], Effect: ["Chaste"], Block: ["ItemVulva"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChastityClitShield", Value: 70, Difficulty: 50, Time: 30, RemoveTime: 30, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"], Effect: ["Chaste"], Block: ["ItemVulva"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "HighSecurityVulvaShield", Value: 100, Difficulty: 99, Time: 60, RemoveTime: 200, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"], Effect: ["Chaste"], Block: ["ItemVulva"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "JewelClitPiercing", Value: 20, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "AdornedClitPiercing", Value: 20, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{
				Name: "VibeHeartClitPiercing", Value: 35, Difficulty: 10, Time: 5, AllowLock: true, BuyGroup: "VibeHeart", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], ArousalZone: "ItemVulva",
				Layer: [
					{ Name: "Heart", AllowColorize: true },
					{ Name: "Ring", AllowColorize: false }
				]
			},
			{ Name: "BellClitPiercing", Value: 30, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "TapedClitEgg", Value: 25, Time: 5, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] }
		],
		Color: ["Default"]
	},

	{
		Group: "ItemButt",
		Category: "Item",
		Priority: 4,
		Default: false,
		Left: 0,
		Top: 0,
		AllowPose: ["AllFours"],
		Effect: ["IsPlugged"],
		Zone: [[300, 500, 100, 80]],
		Activity: ["Kiss", "MasturbateHand", "MasturbateFist", "MasturbateTongue", "Spank", "Caress", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem"],
		Asset: [
			{ Name: "BlackButtPlug", Value: 15, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "PenisPlug", Value: 20, Time: 10, Visible: false, BuyGroup: "PenisDildo", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "TailButtPlug", Value: 40, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "HorsetailPlug", Value: 30, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "HorsetailPlug1", Value: 40, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "PuppyTailPlug", Value: 25, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "PuppyTailPlug1", Value: 30, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "SuccubusButtPlug", Value: 25, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "SuccubusButtPlug2", Value: 25, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "FoxTails", Priority: 2, Value: 60, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "RaccoonButtPlug", Value: 40, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "RaccoonTailPlug", Priority: 2, Value: 50, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "AnalBeads", Value: 20, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "AnalBeads2", Value: 70, Time: 14, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowType: ["Base", "_2in", "_3in", "_4in", "_5in"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Extended: true },
			{ Name: "ButtPump", Value: 35, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }], Extended: true },
			{ Name: "VibratingButtplug", Value: 60, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["IsPlugged", "Egged"], AllowEffect: ["IsPlugged", "Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }] },
			{ Name: "InflVibeButtPlug", Value: 90, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["IsPlugged", "Egged"], AllowEffect: ["IsPlugged", "Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }] },
			{ Name: "AnalHook", Value: 20, Time: 10, IsRestraint: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowEffect: ["IsPlugged", "Freeze", "Egged"], AllowType: ["Base", "Chain", "Hair"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }], Extended: true },
			{ Name: "ButtPlugLock", Value: 75, Difficulty: 50, Time: 30, RemoveTime: 50, IsRestraint: true, AllowLock: true, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], AllowEffect: ["IsPlugged", "Tethered", "Freeze", "ForceKneel", "IsChained"], AllowType: ["Base", "ChainShort", "ChainLong"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 10 }, { Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }], Extended: true },
			{ Name: "KittenTail1", Value: 30, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "KittenTail2", Value: 30, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "FoxTail1", Value: 50, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "FoxTail2", Value: 50, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "WolfTail1", Value: 35, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "WolfTail2", Value: 35, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "WolfTail3", Value: 35, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "DemonPlug", Value: 35, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "MouseTail1", Value: 35, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "MouseTail2", Value: 35, Time: 10, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "VibratingDildoPlug", Value: 60, Time: 10, Visible: false, BuyGroup: "VibratingDildo", Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], Effect: ["IsPlugged", "Egged"] },
			{ Name: "BunnyTailPlug1", Value: 1, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "BunnyTailPlug2", Value: 1, Time: 10, Visible: false, Prerequisite: ["AccessVulva", "AccessVulvaSuitZip"], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			AssetSpankingToys
		],
		Color: ["Default"]
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
		Activity: ["Kiss", "Lick", "Nibble", "Tickle", "Spank", "Caress", "Pinch", "MassageHands", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem"],
		Asset: [
			{ Name: "StraponPanties", Value: -1, Time: 15, DefaultColor: "#505050", Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaPiercingsVibeHeartClitPiercing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"] },
			{ Name: "LeatherChastityBelt", Value: 30, Difficulty: 8, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "SleekLeatherChastityBelt", Value: 45, Difficulty: 11, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaPiercingsVibeHeartClitPiercing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "StuddedChastityBelt", Value: 60, Difficulty: 14, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaPiercingsVibeHeartClitPiercing"], Effect: ["Chaste"], AllowBlock: ["ItemButt"], AllowType: ["ClosedBack"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true },
			{ Name: "MetalChastityBelt", Value: 100, Difficulty: 20, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaPiercingsVibeHeartClitPiercing"], Effect: ["Chaste"], AllowBlock: ["ItemButt"], AllowType: ["ClosedBack"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true },
			{ Name: "PolishedChastityBelt", Value: 150, Difficulty: 30, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaPiercingsVibeHeartClitPiercing"], Effect: ["Chaste"], AllowBlock: ["ItemButt"], AllowType: ["ClosedBack"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true },
			{
				Name: "OrnateChastityBelt", Value: 200, Difficulty: 50, Time: 20, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaPiercingsVibeHeartClitPiercing"], Effect: ["Chaste"], AllowBlock: ["ItemButt"], AllowType: ["ClosedBack"], Block: ["ItemVulva", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true,
				Layer: [
					{ Name: "Belt", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{ Name: "SteelChastityPanties", Value: 150, Difficulty: 50, Time: 50, RemoveTime: 60, AllowLock: true, Prerequisite: "AccessVulva", Hide: ["ItemVulva", "ItemVulvaPiercings"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "HarnessPanties1", Priority: 19, Value: 35, Difficulty: 8, Time: 10, RemoveTime: 15, AllowLock: true, BuyGroup: "HarnessPanties1", Prerequisite: "AccessVulva", AllowPose: ["LegsClosed", "Kneel"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "HarnessPanties2", Priority: 19, Value: 40, Difficulty: 9, Time: 10, RemoveTime: 15, AllowLock: true, Left: 85, Top: 395, BuyGroup: "HarnessPanties2", Prerequisite: "AccessVulva", AllowPose: ["LegsClosed", "Kneel", "Horse", "KneelingSpread"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "LeatherStrapPanties1", Value: 20, Difficulty: 5, Time: 20, RemoveTime: 10, AllowLock: true, Left: 150, Top: 395, BuyGroup: "LeatherStrapPanties1", Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo", "ItemVulvaPiercingsVibeHeartClitPiercing"], Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{
				Name: "LoveChastityBelt", Value: 250, Difficulty: 50, Time: 20, RemoveTime: 10, OwnerOnly: true, Prerequisite: "AccessVulva", HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo", "ItemVulvaHeavyWeightClamp", "ItemVulvaPenisDildo"],
				Effect: ["Lock"], AllowBlock: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], ArousalZone: "ItemVulva",
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
					{ Name: "Closed", AllowColorize: true, AllowTypes: ["Closed", "Vibe", "Shock"], HasType: false },
					{ Name: "Vibe", AllowColorize: false, AllowTypes: ["Vibe"], HasType: false, OverrideAllowPose: [] },
					{ Name: "Shock", AllowColorize: false, AllowTypes: ["Shock"], HasType: false, OverrideAllowPose: [] },
					{ Name: "Lock", AllowColorize: false, AllowTypes: ["", "Open", "Closed", "Vibe", "Shock"], HasType: false, OverrideAllowPose: [] },
					{ Name: "ShieldLock", AllowColorize: false, AllowTypes: ["Closed", "Vibe", "Shock"], HasType: false, OverrideAllowPose: [] },
				]
			},
			{ Name: "LeatherCrop", Value: 20, Wear: false, BuyGroup: "LeatherCrop", Activity: "SpankItem", Bonus: [{ Factor: 3, Type: "KidnapDomination" }], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }, { Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "LeatherWhip", Value: 40, Wear: false, BuyGroup: "LeatherWhip", Activity: "SpankItem", Bonus: [{ Factor: 3, Type: "KidnapBruteForce" }], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }, { Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "HempRope", Value: 60, Difficulty: 3, Time: 20, RemoveTime: 25, DefaultColor: "#956B1C", BuyGroup: "HempRope", Prerequisite: "AccessTorso", AllowType: ["SwissSeat", "KikkouHip"], Audio: "RopeLong", AllowPose: ["KneelingSpread", "Horse", "LegsClosed", "Kneel"], Extended: true },
			AssetSpankingToys
		],
		Color: ["Default"]
	},

	{
		Group: "ItemTorso",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 17,
		Default: false,
		Left: 125,
		Top: 200,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked", "Hogtied", "AllFours"],
		Zone: [[100, 340, 300, 80]],
		Activity: ["Kiss", "Lick", "Nibble", "Tickle", "Spank", "Caress", "MassageHands", "MassageFeet", "Rub", "SpankItem", "TickleItem", "RubItem", "RollItem", "PourItem"],
		Asset: [
			{ Name: "NylonRopeHarness", Value: 30, Time: 20, DefaultColor: "#909090", BuyGroup: "NylonRope", Prerequisite: "AccessTorso", AllowType: ["Harness", "Diamond", "Star", "Waist"], Audio: "RopeLong", Extended: true },
			{ Name: "HempRopeHarness", Value: 60, Difficulty: 3, Time: 20, RemoveTime: 25, DefaultColor: "#956B1C", BuyGroup: "HempRope", Prerequisite: "AccessTorso", AllowType: ["Harness", "Diamond", "Star", "Waist"], Audio: "RopeLong", Extended: true },
			{ Name: "LeatherHarness", Value: 60, Difficulty: 50, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessTorso" },
			{ Name: "AdultBabyHarness", Priority: 33, Value: 50, Difficulty: 3, Time: 15, RemoveTime: 10, AllowLock: true, DefaultColor: "#aaaaaa", ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }] },
			{ Name: "HarnessBra1", Priority: 20, Value: 30, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, BuyGroup: "HarnessBra1", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra2", Priority: 20, Value: 40, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, BuyGroup: "HarnessBra2", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Corset2", Priority: 21, Value: 30, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, BuyGroup: "Corset2", Prerequisite: "AccessTorso", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset3", Priority: 21, Value: 25, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, BuyGroup: "Corset3", Prerequisite: "AccessTorso", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset4", Priority: 21, Value: 15, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, BuyGroup: "Corset4", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Corset5", Priority: 21, Value: 20, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, BuyGroup: "Corset5", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "LeatherBreastBinder", Value: 30, Difficulty: 50, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessTorso" },
			{ Name: "LatexCorset1", Priority: 20, Value: 40, Difficulty: 8, Time: 15, RemoveTime: 10, AllowLock: true, BuyGroup: "LatexCorset1", Prerequisite: "AccessTorso", Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "LeatherStrapBra1", Value: 15, Difficulty: 5, Time: 15, RemoveTime: 10, AllowLock: true, Left: 150, Top: 200, BuyGroup: "LeatherStrapBra1", Prerequisite: "AccessTorso" },
			{ Name: "CrotchChain", Value: 40, Difficulty: 50, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: "AccessTorso" },
			AssetSpankingToys
		],
		Color: ["Default"]
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
		Activity: ["Kiss", "Lick", "Suck", "Nibble", "Pinch", "Caress", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem"],
		Asset: [
			{ Name: "NippleClamp", Value: 25, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "VibeNippleClamp", Value: 40, Time: 10, Prerequisite: "AccessBreast", Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "VibratorRemote", Value: 50, Wear: false, BuyGroup: "VibratorRemote", Prerequisite: ["RemotesAllowed"], Effect: ["Remote"] },
			{ Name: "ChainClamp", Value: 25, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ScrewClamps", Value: 35, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChainTassles", Value: 45, Time: 10, Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "HeartPasties", Value: 20, Time: 10, DefaultColor: "#800000", Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "TapedVibeEggs", Value: 30, Time: 5, Prerequisite: "AccessBreast", Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"] },
			{ Name: "NippleSuctionCups", Value: 25, Time: 10, Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], Effect: [], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true },
			{ Name: "NippleTape", Value: 10, Time: 5, Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "ChopStickNippleClamps", Value: 25, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "KittyPasties", Value: 20, Time: 10, DefaultColor: "#444444", Prerequisite: "AccessBreast", Hide: ["ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "Clothespins", Value: 15, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "NippleWeightClamps", Value: 35, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "BellClamps", Value: 20, Time: 10, Prerequisite: "AccessBreast", ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 10 }] },
			AssetSpankingToys
		],
		Color: ["Default"]
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
			{ Name: "StraightPiercing", Value: 10, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "RoundPiercing", Value: 30, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], AllowType: ["Base", "Chain"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }], Extended: true },
			{ Name: "WeightedPiercing", Value: 40, Difficulty: 10, Time: 10, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], AllowType: ["Base", "Chain"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }], Extended: true },
			{ Name: "NippleAccessory1", Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"] },
			{ Name: "NippleAccessory2", Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"] },
			{ Name: "NippleAccessory3", Value: 15, Difficulty: 10, Time: 5, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"] },
			{ Name: "BarbellPiercing", Value: 20, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "NippleChastityPiercing1", Value: 50, Difficulty: 50, Time: 30, RemoveTime: 30, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], Effect: ["BreastChaste"], Block: ["ItemNipples"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "NippleChastityPiercing2", Value: 50, Difficulty: 50, Time: 30, RemoveTime: 30, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], Effect: ["BreastChaste"], Block: ["ItemNipples"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{
				Name: "VibeHeartPiercings", Value: 40, Difficulty: 10, Time: 10, AllowLock: true, BuyGroup: "VibeHeart", Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], Effect: ["Egged"], AllowEffect: ["Egged", "Vibrating"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }],
				Layer: [
					{ Name: "Heart", AllowColorize: true },
					{ Name: "Ring", AllowColorize: false }
				]
			},
			{ Name: "BellPiercing", Value: 30, Difficulty: 10, Time: 15, AllowLock: true, Prerequisite: ["AccessBreast", "AccessBreastSuitZip"], ExpressionTrigger: [{ Name: "Closed", Group: "Eyes", Timer: 5 }, { Name: "Angry", Group: "Eyebrows", Timer: 5 }] }
		],
		Color: ["Default"]
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
		Activity: ["Kiss", "Lick", "Tickle", "Slap", "Caress", "MasturbateHand", "Grope", "SpankItem", "TickleItem", "RubItem", "RollItem", "MasturbateItem", "PourItem"],
		Asset: [
			{ Name: "MetalChastityBra", Value: 60, Difficulty: 50, Time: 15, AllowLock: true, Prerequisite: "AccessBreast", Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "PolishedChastityBra", Value: 100, Difficulty: 50, Time: 15, AllowLock: true, Prerequisite: "AccessBreast", Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{
				Name: "OrnateChastityBra", Value: 150, Difficulty: 50, Time: 15, AllowLock: true, Prerequisite: "AccessBreast", Hide: ["ItemNipples", "ItemNipplesPiercings"], Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }],
				Layer: [
					{ Name: "Bra", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{ Name: "LeatherCrop", Value: 20, Wear: false, BuyGroup: "LeatherCrop", Activity: "SpankItem", Bonus: [{ Factor: 3, Type: "KidnapDomination" }], ExpressionTrigger: [{ Name: "Low", Group: "Blush", Timer: 10 }, { Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "LeatherWhip", Value: 40, Wear: false, BuyGroup: "LeatherWhip", Activity: "SpankItem", Bonus: [{ Factor: 3, Type: "KidnapBruteForce" }], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 10 }, { Name: "Soft", Group: "Eyebrows", Timer: 10 }] },
			AssetSpankingToys
		],
		Color: ["Default"]
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
		Activity: ["Kiss", "Lick", "Nibble", "Tickle", "Spank", "Pinch", "Caress", "MassageHands", "Grope", "Cuddle", "SpankItem", "TickleItem", "RubItem", "RollItem", "PourItem"],
		Asset: [
			{ Name: "NylonRope", Value: 30, SelfBondage: 2, Time: 15, DefaultColor: "#909090", BuyGroup: "NylonRope", SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], Audio: "RopeLong" },
			{ Name: "HempRope", Value: 60, Difficulty: 3, SelfBondage: 2, Time: 20, DefaultColor: "#956B1C", BuyGroup: "HempRope", SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], AllowBlock: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowEffect: ["Freeze", "Block", "Prone", "ForceKneel"], AllowType: ["Hogtied", "SuspensionHogtied", "AllFours", "WristTie", "WristElbowTie", "RopeCuffs", "WristElbowHarnessTie"], Audio: "RopeLong", Extended: true, RemoveItemOnRemove: [{ Name: "SuspensionHempRope", Group: "ItemHidden" }] },
			{ Name: "MetalCuffs", Priority: 29, Value: 40, Difficulty: 5, Time: 5, SetPose: ["BackCuffs"], Effect: ["Block", "Prone", "Lock"] },
			{ Name: "SturdyLeatherBelts", Value: 50, Difficulty: 5, SelfBondage: 4, Time: 20, AllowLock: true, BuyGroup: "SturdyLeatherBelts", SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], AllowType: ["One", "Two", "Three", "Four"], Extended: true },
			{ Name: "LeatherArmbinder", Priority: 6, Value: 80, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, DefaultColor: "#404040", SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], Extended: true, RemoveItemOnRemove: [{ Name: "LeatherArmbinderStrap", Group: "ItemHidden" }, { Name: "LeatherArmbinderWrapStrap", Group: "ItemHidden" }], SelfUnlock: false },
			{ Name: "ArmbinderJacket", Priority: 33, Value: 100, Difficulty: 12, SelfBondage: 8, Time: 35, RemoveTime: 25, AllowLock: true, Hide: ["Cloth"], SetPose: ["BackElbowTouch", "Bolero"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false },
			{ Name: "LeatherCuffs", Priority: 29, Value: 100, Difficulty: 3, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", AllowPose: ["BackBoxTie", "BackElbowTouch"], AllowEffect: ["Block", "Prone"], AllowType: ["Wrist", "Elbow", "Both"], Extended: true },
			{
				Name: "OrnateCuffs", Priority: 29, Value: 200, Difficulty: 4, Time: 20, Random: false, AllowLock: true, AllowPose: ["BackBoxTie", "BackElbowTouch"], AllowEffect: ["Block", "Prone"], AllowType: ["Wrist", "Elbow", "Both"], Extended: true,
				Layer: [
					{ Name: "Cuffs", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{ Name: "MittenChain1", Priority: 33, Value: -1, Difficulty: 5, SelfBondage: 5, Time: 15, Random: false, AllowLock: true, Block: ["ItemHands", "ItemTorso"] },
			{ Name: "FourLimbsShackles", Value: -1, Time: 30, Enable: false, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone", "Lock"] },
			{ Name: "Manacles", Value: 120, Difficulty: 16, SelfBondage: 1, Time: 30, Random: false, AllowLock: true, Prerequisite: ["NoItemFeet", "NotMounted", "NotSuspended", "NotHogtied", "NotKneelingSpread"], SetPose: ["BackBoxTie", "Kneel"], Effect: ["Block", "Freeze", "Prone", "ForceKneel"], Block: ["ItemFeet"] },
			{ Name: "FullBodyShackles", Value: 150, Difficulty: 18, Random: false, AllowLock: true, Prerequisite: ["NoItemFeet", "NotMounted", "NotSuspended", "NotHogtied", "NotKneelingSpread"], AllowPose: ["LegsClosed", "Kneel"], Effect: ["Prone", "Shackled"], Block: ["ItemFeet"] },
			{ Name: "WristShackles", Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, AllowPose: ["BackCuffs"], Effect: ["Prone"], AllowEffect: ["Block", "Prone"], AllowType: ["Behind"], Extended: true },
			{ Name: "StraitLeotard", Value: 120, Priority: 23, Difficulty: 13, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#70C0C0", Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ItemButtAnalBeads2", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"], SelfUnlock: false },
			{ Name: "StraitJacket", Value: 150, Difficulty: 6, SelfBondage: 8, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#A0A0A0", Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerGown2Skirt", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"], Extended: true, SelfUnlock: false },
			{ Name: "CollarCuffs", Value: 60, Difficulty: 9, SelfBondage: 3, Time: 35, RemoveTime: 20, Visible: false, Random: false, AllowLock: true, Prerequisite: "Collared", SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], Block: ["ItemHands", "ItemNeck"], Extended: true, SelfUnlock: false },
			{ Name: "LeatherStraitJacket", Value: 200, Difficulty: 7, SelfBondage: 8, Time: 45, RemoveTime: 30, AllowLock: true, Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerGown2Skirt", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], AllowType: ["Normal", "Snug", "Tight"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"], Extended: true, SelfUnlock: false },
			{
				Name: "Bolero", Priority: 33, Value: 100, Difficulty: 11, SelfBondage: 7, Time: 35, RemoveTime: 20, AllowLock: true, DefaultColor: "#E080A0", SetPose: ["BackElbowTouch", "Bolero"], Effect: ["Block", "Prone"], Block: ["ItemHands"], Layer: [
					{ Name: "Leather", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false }
				],
				SelfUnlock: false
			},
			{ Name: "DuctTape", Value: 50, Difficulty: 5, SelfBondage: 4, Time: 20, RemoveTime: 10, BuyGroup: "DuctTape", Hide: ["ItemNipplesPiercings"], AllowPose: ["Horse", "KneelingSpread"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], AllowBlock: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples", "ItemNipplesPiercings"], AllowType: ["Bottom", "Top", "Full", "Complete"], Extended: true },
			{
				Name: "BitchSuit", Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#888888", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Cloth", "ClothLower", "Bra", "Panties", "BodyLower", "Shoes", "Socks", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "ItemFeet"],
				SetPose: ["BackElbowTouch", "Kneel", "StraitDressOpen"],
				Effect: ["Block", "Prone", "ForceKneel"],
				AllowBlock: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemButt"],
				AllowType: ["", "UnZip", "Latex"],
				Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"],
				Extended: true,
				Layer: [
					{ Name: "Latex", AllowColorize: true, AllowTypes: [""], HasType: false },
					{ Name: "UnZip", AllowColorize: true, AllowTypes: ["UnZip"], HasType: false }
				],
				SelfUnlock: false
			},
			{
				Name: "BitchSuitExposed", Value: 175, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#888888", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"],
				Hide: ["Cloth", "ClothLower", "BodyLower", "Shoes", "Socks", "ItemBoots", "ItemLegs", "ItemFeet"],
				SetPose: ["BackElbowTouch", "Kneel", "StraitDressOpen"],
				Effect: ["Block", "Prone", "ForceKneel"],
				Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"],
				SelfUnlock: false
			},
			{ Name: "CollarLeashHolding", Priority: 36, Value: -1, Difficulty: 1, Time: 3, RemoveTime: 3, Random: false, Prerequisite: ["NotSuspended", "NotHogtied"] },
			{
				Name: "StraitDress", Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "StraitDress", DefaultColor: "#4040C0", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Socks", "BodyLower", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "Suit", "SuitLower"], HideItem: ["ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetMermaidRopeTie", "ItemFeetLeatherAnkleCuffs"], AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemButt"], Layer: [
					{ Name: "Latex", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false }
				],
				SelfUnlock: false
			},
			{
				Name: "StraitDressOpen", Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "StraitDress", DefaultColor: "#400000", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Cloth", "BodyLower", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "Suit"], HideItem: ["ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetMermaidRopeTie", "ItemFeetLeatherAnkleCuffs"], AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "StraitDressOpen"], Effect: ["Block", "Prone"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemLegs"], Layer: [
					{ Name: "Latex", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false }
				],
				SelfUnlock: false
			},
			{ Name: "SeamlessStraitDress", Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "SeamlessStraitDress", DefaultColor: "#4040C0", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Socks", "BodyLower", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "Suit", "SuitLower"], HideItem: ["ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetMermaidRopeTie", "ItemFeetLeatherAnkleCuffs"], AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "LegsClosed"], Effect: ["Block", "Prone"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemButt"], SelfUnlock: false },
			{ Name: "SeamlessStraitDressOpen", Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "SeamlessStraitDress", DefaultColor: "#400000", Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Cloth", "BodyLower", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "Suit"], HideItem: ["ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetMermaidRopeTie", "ItemFeetLeatherAnkleCuffs"], AllowPose: ["Kneel"], SetPose: ["BackElbowTouch", "StraitDressOpen"], Effect: ["Block", "Prone"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemLegs"], SelfUnlock: false },
			{ Name: "Yoke", Priority: 39, Value: 80, Difficulty: 10, SelfBondage: 6, Time: 20, AllowLock: true, SetPose: ["Yoked"], Effect: ["Block", "Prone"] },
			{ Name: "Pillory", Priority: 44, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 20, Random: false, AllowLock: true, Prerequisite: ["NotMasked"], SetPose: ["Yoked"], Effect: ["Block", "Prone"] },
			{
				Name: "FullLatexSuit", Value: 200, Difficulty: 15, SelfBondage: 8, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#888888", Prerequisite: ["NotSuspended", "NotKneeling", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotKneelingSpread", "NoFeetSpreader", "NotShackled", "CannotBeSuited"],
				Hide: ["Socks", "BodyLower", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "Suit", "SuitLower"],
				SetPose: ["BackElbowTouch", "StraitDressOpen"],
				Effect: ["Block", "Prone", "Freeze", "BlockKneel"],
				AllowBlock: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemButt"],
				AllowEffect: ["Egged", "Vibrating"],
				AllowType: ["", "Base", "UnZip", "Latex"],
				Block: ["ItemBoots", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet"],
				Extended: true,
				Layer: [
					{ Name: "Latex", AllowColorize: true, AllowTypes: ["", "Base"], HasType: false },
					{ Name: "UnZip", AllowColorize: true, AllowTypes: ["UnZip", "Base"], HasType: false },
					{ Name: "Base", AllowColorize: false, AllowTypes: ["", "Base", "UnZip", "Latex"], HasType: false }
				],
				RemoveItemOnRemove: [{ Name: "FullLatexSuitWand", Group: "ItemVulva" }]
			},
			{ Name: "Zipties", Value: 20, Difficulty: 6, SelfBondage: 1, RemoveTime: 6, BuyGroup: "Zipties", SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"] },
			{ Name: "BoxTieArmbinder", Value: 140, Difficulty: 11, SelfBondage: 7, Time: 40, RemoveTime: 30, AllowLock: true, SetPose: ["BackElbowTouch", "Bolero"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false },
			{
				Name: "BondageBouquet", Priority: 41, Value: 40, Difficulty: 3, Time: 15, Random: false, AllowLock: true, BuyGroup: "Bouquet", Effect: ["Prone"],
				Layer: [
					{ Name: "Base", AllowColorize: false },
					{ Name: "Flowers", AllowColorize: true }
				]
			},
			{ Name: "Chains", Value: 90, Difficulty: 5, SelfBondage: 3, Time: 30, AllowLock: true, BuyGroup: "Chains", SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], AllowBlock: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemDevices"], AllowEffect: ["Freeze", "Block", "Prone", "ForceKneel"], AllowType: ["Hogtied", "SuspensionHogtied", "AllFours", "WristTie", "WristElbowTie", "ChainCuffs", "WristElbowHarnessTie"], Extended: true, RemoveItemOnRemove: [{ Name: "SuspensionChains", Group: "ItemHidden" }] },
			{ Name: "ChainLeashHolding", Priority: 36, Value: -1, Difficulty: 1, Time: 3, RemoveTime: 3, Random: false, Prerequisite: ["NotSuspended", "NotHogtied"] },
			{
				Name: "PetCrawler", Priority: 39, Value: 80, Difficulty: 10, SelfBondage: 7, Time: 20, Random: false, AllowLock: true, Prerequisite: ["NoItemFeet", "NoItemLegs", "LegsOpen", "NotMounted", "NotHorse", "NotSuspended", "NotYoked", "NotKneelingSpread", "NoFeetSpreader", "StraitDressOpen"], Hide: ["ItemBoots", "Suit", "Panties", "Bra"],
				HideItem: ["ItemButtRaccoonTailPlug", "TailStrapsRaccoonTailStrap", "ItemButtKittenTail1", "TailStrapsKittenTail1", "ItemNipplesPiercingsNippleChastityPiercing2", "ItemTorsoAdultBabyHarness", "ItemTorsoCorset2", "ItemTorsoCorset3", "ItemNipplesPiercingsNippleChastityPiercing1", "ItemNipplesChainTassles", "ItemNipplesHeartPasties", "ItemNipplesNippleTape", "ItemNipplesKittyPasties"],
				SetPose: ["AllFours"],
				Effect: ["Block", "Prone", "ForceKneel"],
				Block: ["ItemLegs", "ItemFeet", "ItemDevices"]
			},
			{
				Name: "MermaidSuit", Value: 200, Difficulty: 15, SelfBondage: 6, Time: 40, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#400000", Prerequisite: ["NotSuspended", "NotKneeling", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotKneelingSpread", "NoFeetSpreader", "NotShackled", "CannotBeSuited"],
				Hide: ["Socks", "BodyLower", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemLegs", "Suit", "SuitLower", "ItemPelvis", "ItemFeet", "Panties"],
				HideItem: ["ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetMermaidRopeTie", "ItemFeetLeatherAnkleCuffs"],
				SetPose: ["BackElbowTouch", "StraitDressOpen"],
				Effect: ["Block", "Prone", "Freeze", "BlockKneel"],
				AllowBlock: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulvaPiercings", "ItemButt"],
				AllowEffect: ["Egged", "Vibrating"],
				AllowType: ["", "UnZip", "Latex"],
				Block: ["ItemBoots", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet"],
				Extended: true,
				Layer: [
					{ Name: "Latex", AllowColorize: true, AllowTypes: [""], HasType: false },
					{ Name: "UnZip", AllowColorize: true, AllowTypes: ["UnZip"], HasType: false }
				]
			},
			{
				Name: "Web", Priority: 35, Value: 150, Difficulty: 4, SelfBondage: 2, Time: 20, RemoveTime: 30, Random: false, Left: 0, Top: 0,
				Prerequisite: ["NotKneelingSpread", "NotMounted"],
				Hide: ["Cloth", "ClothLower", "Shoes"],
				AllowPose: ["Kneel", "Hogtied", "Suspension"],
				SetPose: ["LegsOpen", "BackElbowTouch"],
				Effect: ["Block", "Freeze", "Prone"],
				AllowBlock: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemDevices"],
				AllowType: ["Wrapped", "Cocooned", "Hogtied", "Suspended", "KneelingSuspended", "SuspensionHogtied"],
				Block: ["ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
				Extended: true,
			},
			{
				Name: "LatexArmbinder", Priority: 6, Value: 60, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false,
				Layer: [
					{ Name: "Latex", AllowColorize: true },
					{ Name: "Straps", AllowColorize: false }
				]
			},
			{ Name: "SeamlessLatexArmbinder", Priority: 6, Value: 60, Difficulty: 10, SelfBondage: 7, Time: 25, RemoveTime: 10, AllowLock: true, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], SelfUnlock: false },
			{
				Name: "FullBodyLeatherHarness", Priority: 29, Value: 60, Difficulty: 14, SelfBondage: 6, Time: 20, RemoveTime: 15, AllowLock: true, SetPose: ["BackElbowTouch", "LegsClosed"], AllowPose: ["Kneel"], Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "NotKneelingSpread", "NoFeetSpreader", "NotShackled"], Effect: ["Block", "Prone"], SelfUnlock: false,
				HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerGown2Skirt", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt", "ClothLowerPajama1"]
			},
			{ Name: "UnderBedBondageCuffs", Value: -1, Difficulty: 9, SelfBondage: 3, Random: false, IsRestraint: true, SetPose: ["Yoked"], Prerequisite: ["OnBed", "LegsOpen"], Effect: ["Block", "Prone", "Freeze", "BlockKneel"], Block: ["ItemDevices", "ItemLegs", "ItemFeet", "ItemBoots"], AllowLock: true, BuyGroup: "Bed", Left: 0, Top: -250 },
			{
				Name: "TightJacket", Value: 150, Difficulty: 6, SelfBondage: 8, Time: 35, RemoveTime: 20, AllowLock: true, Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerSkirt2", "ClothLowerSkirt3", "ClothLowerTennisSkirt1", "ClothLowerGown2Skirt", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerClothSkirt1", "ClothLowerChineseSkirt1", "ClothLowerAdmiralSkirt", "ClothLowerJeanSkirt", "ClothLowerPencilSkirt"], SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"], SelfUnlock: false, Layer: [
					{ Name: "Jacket", AllowColorize: true },
					{ Name: "Straps", AllowColorize: false }
				]
			},
			AssetSpankingToys
		],
		Color: ["Default"]
	},

	{
		Group: "ItemHands",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 35,
		Default: false,
		IsRestraint: true,
		Zone: [[10, 400, 90, 200], [400, 400, 90, 200]],
		Activity: ["Kiss", "PoliteKiss", "Lick", "Suck", "Nibble", "Spank", "Caress", "TakeCare"],
		Asset: [
			{ Name: "PaddedMittens", Value: 40, Difficulty: 4, SelfBondage: 2, Time: 15, AllowLock: true, DefaultColor: "#bbbbbb", AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], Effect: ["Block", "Prone"], Extended: true },
			{ Name: "PawMittens", Value: 50, Difficulty: 4, SelfBondage: 1, Time: 15, AllowLock: true, DefaultColor: "#bbbbbb", AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], Effect: ["Block", "Prone"], Extended: true },
			{ Name: "LeatherMittens", Value: 60, Difficulty: 5, SelfBondage: 4, Time: 15, RemoveTime: 5, AllowLock: true, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone"] },
			{ Name: "PaddedLeatherMittens", Value: 70, Difficulty: 6, SelfBondage: 5, Time: 15, RemoveTime: 5, AllowLock: true, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone"] },
			{ Name: "PolishedMittens", Value: 80, Difficulty: 8, SelfBondage: 6, Time: 20, RemoveTime: 10, AllowLock: true, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], Effect: ["Block", "Prone"] },
			{ Name: "DuctTape", Value: 50, Difficulty: 5, SelfBondage: 3, Time: 20, RemoveTime: 10, BuyGroup: "DuctTape", Hide: ["Gloves"], AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone"] },
			{
				Name: "SpankingToys", Priority: 46, Random: false, Wear: true, IsRestraint: false, BuyGroup: "SpankingToys", AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], AllowType: ["Crop", "Flogger", "Cane", "HeartCrop", "Paddle", "WhipPaddle", "Whip", "CattleProd", "TennisRacket", "Feather", "FeatherDuster", "IceCube", "WartenbergWheel", "VibratingWand", "SmallVibratingWand", "CandleWax", "LargeDildo", "PetToy", "Vibrator", "Belt", "Hairbrush", "SmallDildo", "ElectricToothbrush", "Toothbrush"], DynamicPreviewIcon: C => InventorySpankingToysGetType(C),
				Extended: true,
				IgnoreParentGroup: true
			}, {
				Name: "SpankingToysCrop", Value: 20, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysFlogger", Value: 40, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysCane", Value: 15, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysHeartCrop", Value: 30, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysPaddle", Value: 35, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysWhipPaddle", Value: 25, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysWhip", Value: 50, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysCattleProd", Value: 45, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysTennisRacket", Value: -1, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysFeather", Value: 2, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysFeatherDuster", Value: 4, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysIceCube", Value: 3, Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysWartenbergWheel", Value: 10, Random: false, Activity: "RollItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysVibratingWand", Value: 40, Random: false, Activity: "MasturbateItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysSmallVibratingWand", Value: 20, Random: false, Activity: "MasturbateItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysCandleWax", Value: 10, Random: false, Activity: "PourItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysLargeDildo", Value: 30, Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysPetToy", Value: 5, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysVibrator", Value: 45, Random: false, Activity: "MasturbateItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysBelt", Value: 10, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysHairbrush", Value: 5, Random: false, Activity: "SpankItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysSmallDildo", Value: 20, Random: false, Activity: "RubItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysElectricToothbrush", Value: 20, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			}, {
				Name: "SpankingToysToothbrush", Value: 10, Random: false, Activity: "TickleItem", DynamicAllowInventoryAdd: () => { return false },
				PrerequisiteBuyGroups: ["SpankingToys"]
			},
			{ Name: "HoofMittens", Value: -1, Difficulty: 5, SelfBondage: 4, Time: 15, RemoveTime: 5, AllowLock: true, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked", "AllFours"], SetPose: ["TapedHands"], Effect: ["Block", "Prone"] },
		],
		Color: ["Default"]
	},

	{
		Group: "ItemNeck",
		Category: "Item",
		Priority: 34,
		Default: false,
		Left: 185,
		Top: 160,
		Zone: [[200, 200, 100, 70]],
		Activity: ["Kiss", "Lick", "Nibble", "Caress", "MassageHands", "Choke", "TickleItem", "RubItem", "RollItem"],
		Asset: [
			{ Name: "LeatherCollar", Value: 20, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LeatherCollarBell", Value: 30, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LeatherCollarBow", Value: 25, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "SlaveCollar", Value: -1, Difficulty: 50, Time: 5, Enable: false, Random: false, OwnerOnly: true, Effect: ["Lock"], AllowBlock: ["ItemMouth", "ItemMouth2", "ItemMouth3"], AllowEffect: ["GagNormal"], AllowType: ["SteelPosture", "LeatherPosture", "PetCollar", "HighCollar", "LeatherCollarBell", "LeatherCollarBow", "MaidCollar", "BatCollar", "HighSecurityCollar", "SpikeCollar", "BordelleCollar", "LeatherCorsetCollar", "StrictPostureCollar", "LatexPostureCollar", "HeartCollar", "NobleCorsetCollar", "OrnateCollar", "LoveLeatherCollar", "SlenderSteelCollar"], Extended: true },
			{ Name: "ClubSlaveCollar", Value: -1, Difficulty: 50, Time: 5, Enable: false, Random: false, Effect: ["Lock"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "ShockCollar", Value: 80, Difficulty: 50, Time: 15, Random: false, AllowLock: true, BuyGroup: "ShockCollar", Effect: ["ReceiveShock"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true },
			{ Name: "ShockCollarRemote", Value: -1, Random: false, Wear: false, BuyGroup: "ShockCollar", Effect: ["TriggerShock"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }, { Name: "Soft", Group: "Blush", Timer: 15 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "BatCollar", Value: 25, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "PostureCollar", Value: 40, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "SteelPostureCollar", Value: 60, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "DogCollar", Value: 20, Difficulty: 50, Time: 5, Random: false, AllowLock: true },
			{ Name: "SpikeCollar", Value: 40, Difficulty: 50, Time: 5, AllowLock: true },
			{
				Name: "HighCollar", Value: 50, Difficulty: 50, Time: 5, AllowLock: true,
				Layer: [
					{ Name: "Leather", AllowColorize: true },
					{ Name: "Rings", AllowColorize: false }
				]
			},
			{ Name: "LeatherChoker", Value: 10, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "PetCollar", Value: -1, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "MaidCollar", Value: 30, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "BordelleCollar", Value: 30, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LoveLeatherCollar", Value: 50, Difficulty: 50, Time: 5, Random: false, AllowLock: true, LoverOnly: false },
			{ Name: "StrictPostureCollar", Priority: 38, Value: 60, Difficulty: 50, Time: 30, RemoveTime: 40, AllowLock: true },
			{ Name: "NobleCorsetCollar", Value: 45, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "HeartCollar", Value: 50, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "LatexPostureCollar", Priority: 38, Value: 80, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, IsRestraint: true, AllowLock: true, BuyGroup: "LatexPostureCollar", Effect: ["GagNormal"], },
			{ Name: "LeatherCorsetCollar", Priority: 38, Value: 75, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, IsRestraint: true, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", Effect: ["GagNormal"], },
			{ Name: "HighSecurityCollar", Value: 70, Difficulty: 50, Time: 5, AllowLock: true },
			{
				Name: "OrnateCollar", Value: 80, Difficulty: 50, Time: 5, AllowLock: true,
				Layer: [
					{ Name: "Collar", AllowColorize: true },
					{ Name: "Gem", AllowColorize: false }
				]
			},
			{ Name: "SlenderSteelCollar", Value: 30, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "HeartLinkChoker", Value: 15, Difficulty: 50, Time: 5, AllowLock: true },
			{ Name: "NeckRope", Value: 60, Difficulty: 50, Time: 5, AllowLock: false, BuyGroup: "HempRope", DefaultColor: "#956B1C", ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 3 }, { Name: "Soft", Group: "Eyebrows", Timer: 3 }] },
			AssetSpankingToys
		],
		Color: ["Default"]
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
			{ Name: "CollarBell", Value: 5, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarBow", Value: 5, Difficulty: 1, Time: 5, Random: false, Prerequisite: "Collared" },
			{ Name: "CollarShockUnit", Value: 80, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "ShockCollar", Prerequisite: "Collared", Effect: ["ReceiveShock"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }], Extended: true },
			{ Name: "ShockCollarRemote", Value: -1, Random: false, Wear: false, BuyGroup: "ShockCollar", Effect: ["TriggerShock"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }, { Name: "Soft", Group: "Blush", Timer: 15 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "CollarNameTag", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", AllowType: ["Angel", "BadGirl", "BindMe", "Bitch", "Boobs", "Cupcake", "Devil", "Dom", "Free", "FuckMe", "GagMe", "Goddess", "GoodGirl", "HoldMe", "Jewel", "Love", "Maid", "Meat", "Miss", "Mummy", "Nice", "Needy", "Owned", "Precious", "Pudding", "Queen", "Slave", "Slut", "Sub", "Sweetie", "Taken", "Toy", "Useless", "UseMe", "Whore"], Extended: true, PropertyLocked: true },
			{ Name: "CollarNameTagOval", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", AllowType: ["Babe", "Bandit", "Bimbo", "Bratty", "Chair", "Chaste", "Crazy", "Cumslut", "Cutie", "Damsel", "Doll", "EdgeMe", "Evil", "ForSale", "Greedy", "Happy", "Horny", "Kinky", "Lady", "LockMe", "Nude", "Nurse", "Nympho", "Painslut", "Pillow", "Punish", "Robber", "Sad", "Switch", "Table", "Ticklish", "Undress", "Victim", "Violent", "Worm"], Extended: true, PropertyLocked: true },
			{ Name: "CollarNameTagPet", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", AllowType: ["Bunny", "Cat", "Dog", "Foxy", "Kitten", "Kitty", "Mochi", "Panda", "Pet", "PetMe", "Pixie", "Pony", "Puppy", "Racoon", "Sloth"], Extended: true, PropertyLocked: true },
			{ Name: "CollarNameTagLover", Value: -1, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, DefaultColor: "#aaa366", Prerequisite: "Collared", AllowType: ["Cookie", "Feather", "Lover", "Muffin"], Extended: true, PropertyLocked: true },
			{ Name: "CollarNameTagLivestock", Value: 50, Difficulty: 20, Time: 5, Random: false, IsRestraint: false, AllowLock: true, Prerequisite: "Collared", AllowType: ["Animal", "BreedMe", "Cow", "Meat", "MilkMe", "Pig"], Extended: true, PropertyLocked: true },
			{ Name: "CollarMoon", Value: 5, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarSun", Value: 10, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarLapis", Value: 10, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarPentagram", Value: 10, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarFlower", Value: 5, Difficulty: 1, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarRose", Value: 5, Difficulty: 1, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" },
			{ Name: "CollarCowBell", Value: 15, Difficulty: 3, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared" }
		],
		Color: ["Default"]
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
			{ Name: "CollarChainLong", Value: 30, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "CollarChain", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["Kneel", "Horse", "KneelingSpread", "AllFours"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "CollarChainShort", Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "CollarChain", Prerequisite: ["Collared", "AllFours", "NotSuspended", "NotMounted", "CanKneel"], AllowPose: ["AllFours"], SetPose: ["Kneel"], Effect: ["Freeze", "ForceKneel", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }, { Name: "Soft", Group: "Eyebrows", Timer: 5 }] },
			{ Name: "CollarLeash", Value: 20, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared", AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "CollarLeashTaken", Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared", AllowPose: ["AllFours"], Effect: ["Tethered"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "ChainLeash", Value: 25, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared", AllowPose: ["AllFours"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "ChainLeashTaken", Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, Prerequisite: "Collared", AllowPose: ["AllFours"], Effect: ["Tethered"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] },
			{ Name: "CollarChainMedium", Value: -1, Difficulty: 6, Time: 5, Random: false, AllowLock: true, BuyGroup: "CollarChain", Prerequisite: ["Collared", "NotSuspended"], AllowPose: ["AllFours", "Kneel"], Effect: ["Tethered", "IsChained"], ExpressionTrigger: [{ Name: "Medium", Group: "Blush", Timer: 15 }] }
		],
		Color: ["Default"]
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
		Activity: ["Kiss", "FrenchKiss", "PoliteKiss", "Lick", "Nibble", "Caress", "TickleItem", "RubItem", "RollItem"],
		Asset: [
			{ Name: "ClothGag", Value: 15, Difficulty: -4, Time: 10, DefaultColor: "#B0B0B0", BuyGroup: "ClothGag", Prerequisite: "GagFlat", SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagVeryLight"], AllowEffect: ["BlockMouth", "GagVeryLight", "GagLight", "GagEasy"], AllowType: ["Small", "Cleave", "OTM", "OTN"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Extended: true },
			{
				Name: "WiffleGag", Value: 30, Difficulty: 1, Time: 10, AllowLock: true, DefaultColor: "#FF6060", BuyGroup: "WiffleGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{
				Name: "HarnessBallGag", Value: 60, Difficulty: 4, Time: 20, AllowLock: true, DefaultColor: "#FF6060", BuyGroup: "HarnessBallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Harness", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "HarnessPanelGag", Value: 80, Difficulty: 6, Time: 20, AllowLock: true, DefaultColor: "#404040", BuyGroup: "HarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagEasy"] },
			{
				Name: "RingGag", Value: 30, Time: 5, AllowLock: true, DefaultColor: "#404040", BuyGroup: "RingGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Value: 50, Difficulty: -2, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagVeryLight"], AllowEffect: ["BlockMouth", "GagVeryLight", "GagLight", "GagEasy", "GagNormal"], AllowType: ["Small", "Crossed", "Full", "Double", "Cover"], Extended: true },
			{ Name: "PacifierGag", Value: 10, Difficulty: -50, Time: 2, Random: false, BuyGroup: "PacifierGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "HarnessPacifierGag", Value: 50, Difficulty: 2, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPacifierGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "DusterGag", Priority: 50, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DusterGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Block: ["ItemMouth2", "ItemMouth3"] },
			{ Name: "HarnessPonyBits", Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPonyBits", Prerequisite: "GagUnique", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagNormal"] },
			{ Name: "PumpGag", Value: 100, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "PumpGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth"], AllowEffect: ["BlockMouth", "GagLight", "GagEasy", "GagMedium", "GagVeryHeavy"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true },
			{ Name: "KittyGag", Value: 20, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#A0A0A0", BuyGroup: "KittyGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "KittenHarnessPanelGag", Value: 80, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#A0A0A0", BuyGroup: "KittenHarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "CarrotGag", Value: 40, Time: 15, Random: false, BuyGroup: "CarrotGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{ Name: "MuzzleGag", Value: 70, Difficulty: 6, Time: 20, AllowLock: true, DefaultColor: "#404040", BuyGroup: "MuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"] },
			{ Name: "RegularSleepingPill", Value: -1, Enable: false, Wear: false, Bonus: [{ Factor: 3, Type: "KidnapSneakiness" }] },
			{ Name: "PantiesMask", Value: 20, Time: 15, Random: false, BuyGroup: "PantiesMask", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], HideItem: ["ItemHeadNoseRing"] },
			{
				Name: "PlugGag", Value: 100, Time: 20, Random: false, AllowLock: true, BuyGroup: "PlugGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["GagEasy"], AllowEffect: ["BlockMouth", "GagEasy", "GagHeavy"], AllowType: ["Open", "Plug"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true,
				Layer: [
					{ Name: "Strap", AllowColorize: true },
					{ Name: "Tongue", AllowColorize: false },
					{ Name: "Close", AllowColorize: true, AllowTypes: ["Plug"] }
				]
			},
			{
				Name: "DildoGag", Priority: 50, Value: 60, Difficulty: 4, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "DildoGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], Block: ["ItemMouth2", "ItemMouth3"],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Dildo", AllowColorize: true }
				]
			},
			{ Name: "BoneGag", Value: 50, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "BoneGag", Prerequisite: "GagUnique", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{
				Name: "ChopstickGag", Value: 15, Difficulty: 2, Time: 10, BuyGroup: "ChopstickGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Chopsticks", AllowColorize: true },
					{ Name: "Tongue", AllowColorize: false }
				]
			},
			{
				Name: "BambooGag", Value: 30, Difficulty: 6, Time: 10, DefaultColor: "#A07858", BuyGroup: "BambooGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Rod", AllowColorize: false },
					{ Name: "Rope", AllowColorize: true }
				]
			},
			{
				Name: "HarnessBallGag1", Value: 75, Difficulty: 4, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag1", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "PumpkinGag", Value: 40, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "PumpkinGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{
				Name: "LipGag", Value: 40, Time: 5, AllowLock: true, BuyGroup: "LipGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "SpiderGag", Value: 45, Time: 5, AllowLock: true, BuyGroup: "SpiderGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", AllowColorize: false },
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
				Name: "PantyStuffing", Value: 10, Difficulty: -20, Time: 5, DefaultColor: "#900000", BuyGroup: "PantyStuffing", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"],
				Layer: [
					{ Name: "Lips", AllowColorize: false },
					{ Name: "Cloth", AllowColorize: true }
				]
			},
			{ Name: "ChloroformCloth", Value: 40, Time: 2, Random: false, Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 20 }, { Name: "Soft", Group: "Eyebrows", Timer: 180 }, { Name: "Wink", Group: "Eyes", Timer: 180 }] },
			{ Name: "ScarfGag", Value: 15, Time: 10, BuyGroup: "ScarfGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "LewdGag", Value: 70, Time: 10, Random: false, AllowLock: true, BuyGroup: "LewdGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "DeepthroatGag", Value: 55, Difficulty: 5, Time: 15, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "DeepthroatGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "Raised", Group: "Eyebrows", Timer: 10 }] },
			{ Name: "LeatherCorsetCollar", Value: 75, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", BuyGroup: "LeatherCorsetCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], SetPose: ["GagCorset"], Block: ["ItemNeck"] },
			{ Name: "LatexPostureCollar", Value: 80, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "LatexPostureCollar", BuyGroup: "LatexPostureCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], SetPose: ["GagCorset"], Block: ["ItemNeck"] },
			{ Name: "BitGag", Value: 40, Difficulty: 4, Time: 20, AllowLock: true, BuyGroup: "BitGag", Prerequisite: "GagUnique", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{ Name: "XLBoneGag", Value: 60, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "XLBoneGag", Prerequisite: "GagUnique", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagNormal"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{ Name: "DogMuzzleExposed", Value: 50, Difficulty: 7, Time: 10, Random: false, AllowLock: true, Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Block: ["ItemMouth2", "ItemMouth3"] },
			{ Name: "FoxyHarnessPanelGag", Value: 40, Difficulty: 6, Time: 20, Random: false, AllowLock: true, Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Block: ["ItemMouth2", "ItemMouth3"] },
			{
				Name: "BallGag", Value: 40, Difficulty: 2, Time: 10, AllowLock: true, BuyGroup: "BallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{
				Name: "TongueStrapGag", Value: 35, Time: 15, AllowLock: true, BuyGroup: "TongueStrapGag", Hide: ["Mouth"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "BallGagMask", Value: 90, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "BallGagMask", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{
				Name: "HookGagMask", Value: 70, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "HookGagMask", Hide: ["Mouth"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Mouth", AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "DildoPlugGag", Value: 100, Time: 20, Random: false, AllowLock: true, BuyGroup: "DildoPlugGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagEasy"], AllowEffect: ["BlockMouth", "GagEasy", "GagVeryHeavy"], AllowType: ["Open", "Plug"], ExpressionTrigger: [{ Name: "Soft", Group: "Eyebrows", Timer: 10 }], Extended: true,
				Layer: [
					{ Name: "Strap", AllowColorize: true },
					{ Name: "Tongue", AllowColorize: false },
					{ Name: "Close", AllowColorize: true, AllowTypes: ["Plug"] }
				]
			},
			{ Name: "SteelMuzzleGag", Value: 80, Difficulty: 8, Time: 30, AllowLock: true, BuyGroup: "SteelMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"] },
			{ Name: "StitchedMuzzleGag", Value: 60, Difficulty: 5, Time: 15, AllowLock: true, BuyGroup: "StitchedMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "LatexBallMuzzleGag", Value: 65, Difficulty: 6, Time: 15, AllowLock: true, BuyGroup: "LatexBallMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagMedium"] },
			{
				Name: "SockStuffing", Value: 10, Difficulty: -20, Time: 5, DefaultColor: "#FFFFFF", BuyGroup: "SockStuffing", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"],
				Layer: [
					{ Name: "Lips", AllowColorize: false },
					{ Name: "Cloth", AllowColorize: true }
				]
			},
			{ Name: "GasMaskGag", Priority: 50, Value: 40, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "GasMaskGag", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Effect: ["BlockMouth", "GagEasy"], Block: ["ItemMouth2", "ItemMouth3"] },
			{ Name: "WebGag", Value: 30, Difficulty: 3, Time: 5, RemoveTime: 10, BuyGroup: "WebGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "RopeGag", Value: 60, Difficulty: 3, Time: 20, RemoveTime: 10, BuyGroup: "HempRope", Prerequisite: "GagUnique", DefaultColor: "#956B1C", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "MilkBottle", Priority: 50, Value: 30, Difficulty: -50, Time: 1, Random: false, AllowLock: false, Left: 199, Top: 0, BuyGroup: "MilkBottle", Prerequisite: "GagUnique", Effect: ["GagVeryLight"], Block: ["ItemMouth2", "ItemMouth3"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }], IgnoreParentGroup: true, Extended: true, AllowType: ["Rest", "Raised", "Chug"] },
			{
				Name: "MedicalMask", Value: 25, Time: 10, Random: false, BuyGroup: "MedicalMask", Hide: ["Mouth"], Effect: ["BlockMouth"], HideItem: ["ItemHeadNoseRing"],
				Layer: [
					{ Name: "Inner", AllowColorize: false },
					{ Name: "Outer", AllowColorize: true }
				]
			},
			AssetSpankingToys
		],
		Color: ["Default"]
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
		Asset: [
			{ Name: "ClothGag", Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#B0B0B0", BuyGroup: "ClothGag", Prerequisite: "GagFlat", SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagVeryLight"], AllowEffect: ["GagVeryLight", "GagLight", "GagEasy"], AllowType: ["Small", "Cleave", "OTM", "OTN"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Extended: true },
			{
				Name: "WiffleGag", Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, DefaultColor: "#FF6060", BuyGroup: "WiffleGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{
				Name: "HarnessBallGag", Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, DefaultColor: "#FF6060", BuyGroup: "HarnessBallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Harness", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "HarnessPanelGag", Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "HarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagEasy"] },
			{
				Name: "RingGag", Value: -1, Time: 5, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "RingGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Value: -1, Difficulty: -2, Time: 10, RemoveTime: 5, Random: false, BuyGroup: "DuctTape", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagVeryLight"], AllowEffect: ["BlockMouth", "GagVeryLight", "GagLight", "GagEasy", "GagNormal"], AllowType: ["Small", "Crossed", "Full", "Double", "Cover"], Extended: true },
			{ Name: "HarnessPacifierGag", Value: -1, Difficulty: 2, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPacifierGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "DusterGag", Priority: 50, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DusterGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"], Block: ["ItemMouth", "ItemMouth3"] },
			{ Name: "HarnessPonyBits", Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPonyBits", Prerequisite: "GagUnique", SetPose: ["GagUnique"] },
			{ Name: "KittyGag", Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#A0A0A0", BuyGroup: "KittyGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "KittenHarnessPanelGag", Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#A0A0A0", BuyGroup: "KittenHarnessPanelGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "CarrotGag", Value: -1, Time: 15, Random: false, Random: false, BuyGroup: "CarrotGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{ Name: "MuzzleGag", Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "MuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"] },
			{ Name: "PantiesMask", Value: -1, Time: 15, Random: false, Random: false, BuyGroup: "PantiesMask", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Effect: ["BlockMouth", "GagVeryLight"] },
			{
				Name: "DildoGag", Priority: 50, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "DildoGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagMedium"], Block: ["ItemMouth", "ItemMouth3"],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Dildo", AllowColorize: true }
				]
			},
			{ Name: "BoneGag", Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "BoneGag", Prerequisite: "GagUnique", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{
				Name: "HarnessBallGag1", Value: -1, Difficulty: 4, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag1", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "PumpkinGag", Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "PumpkinGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{
				Name: "LipGag", Value: -1, Time: 5, Random: false, AllowLock: true, BuyGroup: "LipGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "SpiderGag", Value: -1, Time: 5, Random: false, AllowLock: true, BuyGroup: "SpiderGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "ChloroformCloth", Value: -1, Time: 2, Random: false, BuyGroup: "ChloroformCloth", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 20 }, { Name: "Soft", Group: "Eyebrows", Timer: 180 }, { Name: "Wink", Group: "Eyes", Timer: 180 }] },
			{ Name: "ScarfGag", Value: -1, Time: 10, Random: false, BuyGroup: "ScarfGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "LewdGag", Value: -1, Time: 10, Random: false, AllowLock: true, BuyGroup: "LewdGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "LeatherCorsetCollar", Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", BuyGroup: "LeatherCorsetCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], SetPose: ["GagCorset"], Block: ["ItemNeck", "ItemMouth"] },
			{ Name: "LatexPostureCollar", Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "LatexPostureCollar", BuyGroup: "LatexPostureCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], SetPose: ["GagCorset"], Block: ["ItemNeck", "ItemMouth"] },
			{ Name: "BitGag", Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "BitGag", Prerequisite: "GagUnique", SetPose: ["GagUnique"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{ Name: "XLBoneGag", Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "XLBoneGag", Prerequisite: "GagUnique", SetPose: ["GagUnique"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{ Name: "BallGag", Value: -1, Difficulty: 2, Time: 10, AllowLock: true, BuyGroup: "BallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Layer: [{ Name: "Strap", AllowColorize: false }, { Name: "Ball", AllowColorize: true }] },
			{
				Name: "BallGagMask", Value: -1, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "BallGagMask", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "SteelMuzzleGag", Value: -1, Difficulty: 8, Time: 30, AllowLock: true, BuyGroup: "SteelMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"] },
			{ Name: "StitchedMuzzleGag", Value: -1, Difficulty: 5, Time: 15, AllowLock: true, BuyGroup: "StitchedMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "LatexBallMuzzleGag", Value: -1, Difficulty: 6, Time: 15, AllowLock: true, BuyGroup: "LatexBallMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagMedium"] },
			{ Name: "GasMaskGag", Priority: 50, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "GasMaskGag", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Effect: ["BlockMouth", "GagEasy"], Prerequisite: "GagFlat", SetPose: ["GagFlat"], Block: ["ItemMouth", "ItemMouth3"] },
			{ Name: "WebGag", Value: -1, Difficulty: 3, Time: 5, RemoveTime: 10, BuyGroup: "WebGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "RopeGag", Value: -1, Difficulty: 3, Time: 20, RemoveTime: 10, Prerequisite: "GagUnique", DefaultColor: "#956B1C", BuyGroup: "HempRope", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagLight"] },
			{
				Name: "MedicalMask", Value: -1, Time: 10, Random: false, BuyGroup: "MedicalMask", Hide: ["Mouth"], Effect: ["BlockMouth"], HideItem: ["ItemHeadNoseRing"],
				Layer: [
					{ Name: "Inner", AllowColorize: false },
					{ Name: "Outer", AllowColorize: true }
				]
			}
		],
		Color: ["Default"]
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
		Asset: [
			{ Name: "ClothGag", Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#B0B0B0", BuyGroup: "ClothGag", Effect: ["BlockMouth", "GagVeryLight"], AllowEffect: ["BlockMouth", "GagVeryLight", "GagLight", "GagEasy"], AllowType: ["Small", "Cleave", "OTM", "OTN"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Extended: true },
			{
				Name: "WiffleGag", Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, DefaultColor: "#FF6060", BuyGroup: "WiffleGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{
				Name: "HarnessBallGag", Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, DefaultColor: "#FF6060", BuyGroup: "HarnessBallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Harness", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "HarnessPanelGag", Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "HarnessPanelGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{
				Name: "RingGag", Value: -1, Time: 5, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "RingGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Value: -1, Difficulty: -2, Time: 10, RemoveTime: 5, Random: false, BuyGroup: "DuctTape", Hide: ["Mouth"], Effect: ["BlockMouth", "GagVeryLight"], AllowEffect: ["BlockMouth", "GagVeryLight", "GagLight", "GagEasy", "GagNormal"], AllowType: ["Small", "Crossed", "Full", "Double", "Cover"], Extended: true },
			{ Name: "HarnessPacifierGag", Value: -1, Difficulty: 2, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPacifierGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "DusterGag", Priority: 50, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "DusterGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "HarnessPonyBits", Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "HarnessPonyBits", Prerequisite: "GagUnique", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagNormal"] },
			{ Name: "KittyGag", Value: -1, Difficulty: -4, Time: 10, Random: false, DefaultColor: "#A0A0A0", BuyGroup: "KittyGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "KittenHarnessPanelGag", Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#A0A0A0", BuyGroup: "KittenHarnessPanelGag", Hide: ["Mouth"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "CarrotGag", Value: -1, Time: 15, Random: false, BuyGroup: "CarrotGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{ Name: "MuzzleGag", Value: -1, Difficulty: 6, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "MuzzleGag", Hide: ["Mouth"] },
			{ Name: "PantiesMask", Value: -1, Time: 15, Random: false, BuyGroup: "PantiesMask", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Effect: ["BlockMouth", "GagVeryLight"] },
			{
				Name: "DildoGag", Priority: 50, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "DildoGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagMedium"],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Dildo", AllowColorize: true }
				]
			},
			{ Name: "BoneGag", Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "BoneGag", Prerequisite: "GagUnique", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{
				Name: "HarnessBallGag1", Value: -1, Difficulty: 4, Time: 20, AllowLock: true, BuyGroup: "HarnessBallGag1", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagHeavy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "PumpkinGag", Value: -1, Difficulty: 1, Time: 10, Random: false, AllowLock: true, BuyGroup: "PumpkinGag", BuyGroup: "PumpkinGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{
				Name: "LipGag", Value: -1, Time: 5, Random: false, AllowLock: true, BuyGroup: "LipGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagLight"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "SpiderGag", Value: -1, Time: 5, Random: false, AllowLock: true, BuyGroup: "SpiderGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["GagEasy"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "ChloroformCloth", Value: -1, Time: 2, Random: false, BuyGroup: "ChloroformCloth", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagVeryLight"], ExpressionTrigger: [{ Name: "High", Group: "Blush", Timer: 20 }, { Name: "Soft", Group: "Eyebrows", Timer: 180 }, { Name: "Wink", Group: "Eyes", Timer: 180 }] },
			{ Name: "ScarfGag", Value: -1, Time: 10, Random: false, BuyGroup: "ScarfGag", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "LewdGag", Value: -1, Time: 10, Random: false, AllowLock: true, BuyGroup: "LewdGag", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Effect: ["BlockMouth", "GagLight"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "LeatherCorsetCollar", Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, DefaultColor: "#404040", BuyGroup: "LeatherCorsetCollar", BuyGroup: "LeatherCorsetCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], SetPose: ["GagCorset"], Block: ["ItemNeck", "ItemMouth", "ItemMouth2"] },
			{ Name: "LatexPostureCollar", Value: -1, Difficulty: 50, Time: 20, RemoveTime: 30, Random: false, AllowLock: true, BuyGroup: "LatexPostureCollar", BuyGroup: "LatexPostureCollar", Prerequisite: "GagCorset", Hide: ["Mouth"], SetPose: ["GagCorset"], Block: ["ItemNeck", "ItemMouth", "ItemMouth2"] },
			{ Name: "BitGag", Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "BitGag", Prerequisite: "GagUnique", SetPose: ["GagUnique"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{ Name: "XLBoneGag", Value: -1, Difficulty: 6, Time: 10, Random: false, AllowLock: true, BuyGroup: "XLBoneGag", Prerequisite: "GagUnique", SetPose: ["GagUnique"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }] },
			{ Name: "BallGag", Value: -1, Difficulty: 2, Time: 10, AllowLock: true, BuyGroup: "BallGag", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }], Layer: [{ Name: "Strap", AllowColorize: false }, { Name: "Ball", AllowColorize: true }] },
			{
				Name: "BallGagMask", Value: -1, Difficulty: 6, Time: 30, AllowLock: true, BuyGroup: "BallGagMask", Prerequisite: "GagUnique", Hide: ["Mouth"], SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagMedium"], ExpressionTrigger: [{ Name: "DroolSides", Group: "Fluids", Timer: 30 }],
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "SteelMuzzleGag", Value: -1, Difficulty: 8, Time: 30, AllowLock: true, BuyGroup: "SteelMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"] },
			{ Name: "StitchedMuzzleGag", Value: -1, Difficulty: 5, Time: 15, AllowLock: true, BuyGroup: "StitchedMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagEasy"] },
			{ Name: "LatexBallMuzzleGag", Value: -1, Difficulty: 6, Time: 15, AllowLock: true, BuyGroup: "LatexBallMuzzleGag", Prerequisite: "GagFlat", Hide: ["Mouth"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagMedium"] },
			{ Name: "GasMaskGag", Priority: 50, Value: -1, Difficulty: 4, Time: 20, Random: false, AllowLock: true, BuyGroup: "GasMaskGag", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], Effect: ["BlockMouth", "GagEasy"], Prerequisite: "GagFlat", SetPose: ["GagFlat"], Block: ["ItemMouth", "ItemMouth2"] },
			{ Name: "WebGag", Value: -1, Difficulty: 3, Time: 5, RemoveTime: 10, BuyGroup: "WebGag", Prerequisite: "GagFlat", Hide: ["Mouth"], HideItem: ["ItemHeadNoseRing"], SetPose: ["GagFlat"], Effect: ["BlockMouth", "GagLight"] },
			{ Name: "RopeGag", Value: -1, Difficulty: 3, Time: 20, RemoveTime: 10, Prerequisite: "GagUnique", DefaultColor: "#956B1C", BuyGroup: "HempRope", SetPose: ["GagUnique"], Effect: ["BlockMouth", "GagLight"] },
			{
				Name: "MedicalMask", Value: -1, Time: 10, Random: false, BuyGroup: "MedicalMask", Hide: ["Mouth"], Effect: ["BlockMouth"], HideItem: ["ItemHeadNoseRing"],
				Layer: [
					{ Name: "Inner", AllowColorize: false },
					{ Name: "Outer", AllowColorize: true }
				]
			}
		],
		Color: ["Default"]
	},

	{
		Group: "ItemHead",
		Category: "Item",
		Priority: 43,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 20,
		Zone: [[175, 0, 150, 130]],
		Activity: ["Kiss", "Slap", "Caress", "TakeCare", "Pet", "Pull", "Cuddle", "Rub", "TickleItem", "RubItem"],
		Asset: [
			{ Name: "ClothBlindfold", Value: 15, Time: 5, DefaultColor: "#A0A0A0", Hide: ["Glasses"], Effect: ["BlindLight", "Prone"] },
			{ Name: "LeatherBlindfold", Value: 30, Time: 5, AllowLock: true, DefaultColor: "#404040", Hide: ["Glasses"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "LeatherHood", Value: 60, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", , "Eyes", "HairAccessory1", "HairAccessory2"], Effect: ["BlindHeavy", "DeafLight", "Prone", "GagNormal", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"] },
			{ Name: "LeatherHoodOpenEyes", Value: 40, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2"], Effect: ["GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"] },
			{ Name: "GasMask", Value: 50, Difficulty: 25, Time: 10, Random: false, AllowLock: true, DefaultColor: "#585858", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2"], Effect: ["BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"] },
			{ Name: "LeatherSlimMask", Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied"], Hide: ["Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Eyes"], Effect: ["BlindHeavy", "Prone", "GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"] },
			{ Name: "LeatherSlimMaskOpenMouth", Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied"], Hide: ["Glasses", "Eyes"], Effect: ["BlindHeavy", "Prone"], Block: ["ItemEars"] },
			{ Name: "LeatherSlimMaskOpenEyes", Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied"], Hide: ["ItemMouth", "ItemMouth2", "ItemMouth3"], Effect: ["GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"] },
			{ Name: "StuddedBlindfold", Value: -1, Difficulty: 2, Time: 5, AllowLock: true, DefaultColor: "#FF4040", Hide: ["Glasses"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "KittyBlindfold", Value: 25, Time: 5, AllowLock: true, DefaultColor: "#A0A0A0", Hide: ["Glasses"], Effect: ["BlindLight", "Prone"] },
			{ Name: "DuctTape", Value: 50, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape", Hide: ["Glasses"], AllowBlock: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"], AllowEffect: ["BlindNormal", "Prone", "GagNormal", "BlockMouth"], AllowType: ["Double", "Wrap", "Mummy"], Effect: ["BlindNormal", "Prone"], Extended: true },
			{ Name: "SmallBlindfold", Value: 40, Time: 5, AllowLock: true, DefaultColor: "#404040", Hide: ["Glasses"], Effect: ["BlindLight", "Prone"] },
			{ Name: "LeatherHoodOpenMouth", Value: 50, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "HairBack", "Glasses", "HairAccessory1", "HairAccessory2"], Effect: ["Prone", "BlindHeavy"], Block: ["ItemEars"] },
			{ Name: "FullBlindfold", Priority: 30, Value: 40, Difficulty: 6, Time: 5, AllowLock: true, DefaultColor: "#353535", Hide: ["Glasses"], Effect: ["BlindHeavy", "Prone"] },
			{ Name: "LeatherHoodSensDep", Value: 100, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied", "CanUseAlphaHood"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Eyes", "Hat", "HairAccessory1", "HairAccessory2"], Effect: ["BlindHeavy", "DeafHeavy", "Prone", "GagHeavy", "BlockMouth"], Alpha: [[150, 50, 200, 50]], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"] },
			{ Name: "LatexHoodOpenHair", Value: 45, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied", "CanUseAlphaHood"], Hide: ["HairFront", "HairBack", "Hat", "HairAccessory1", "HairAccessory2"], Alpha: [[150, 50, 200, 87]], Block: ["ItemEars"] },
			{ Name: "LeatherHoodSealed", Value: 70, Difficulty: 50, Time: 15, AllowLock: true, DefaultColor: "#555555", Prerequisite: ["NotHogtied", "CanUseAlphaHood"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Eyes", "Hat", "HairAccessory1", "HairAccessory2"], Effect: ["BlindHeavy", "Prone", "GagLight", "BlockMouth"], Alpha: [[150, 50, 200, 100]], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"] },
			{ Name: "PolishedSteelHood", Value: 85, Difficulty: 50, Time: 15, AllowLock: true, Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Eyes", "HairAccessory1", "HairAccessory2"], HideItem: ["HatBand1", "HatBand2", "HatTiara1"], Effect: ["BlindHeavy", "DeafLight", "Prone", "GagHeavy", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"] },
			{ Name: "NoseRing", Value: 25, Difficulty: 50, Time: 15, Random: false, AllowLock: true, Left: 50, AllowEffect: ["Tethered", "Freeze", "ForceKneel", "IsChained"], AllowType: ["Base", "ChainShort", "ChainLong", "Leash"], AllowPose: ["Kneel"], Extended: true },
			{
				Name: "NoseHook", Priority: 26, Value: 25, Difficulty: 20, Time: 15, Random: false, AllowLock: true, Layer: [
					{ Name: "Band", AllowColorize: true },
					{ Name: "Hook", AllowColorize: false },
				]
			},
			{ Name: "InflatedBallHood", Value: 65, Difficulty: 50, Time: 15, AllowLock: true, Prerequisite: ["GagUnique"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Eyes", "HairAccessory1", "HairAccessory2", "ItemHat", "Mask"], Effect: ["BlindHeavy", "DeafLight", "Prone", "BlockMouth"], AllowEffect: ["GagLight", "GagEasy", "GagMedium", "GagVeryHeavy", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"], Extended: true },
			{
				Name: "OldGasMask", Value: 85, Difficulty: 25, Time: 10, Random: false, AllowLock: true, Prerequisite: ["GasMask"], DefaultColor: "#888", DefaultColor: "#313131", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "Mask"], Effect: ["BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"], Extended: true, RemoveItemOnRemove: [{ Name: "OldGasMaskTube1", Group: "ItemAddon" }, { Name: "OldGasMaskTube2", Group: "ItemAddon" }, { Name: "OldGasMaskLenses", Group: "ItemAddon" }, { Name: "OldGasMaskRebreather", Group: "ItemAddon" }], Layer: [
					{ Name: "Mask", AllowColorize: true },
					{ Name: "Light", AllowColorize: false }
				]
			},
			{ Name: "SackHood", Value: 20, Difficulty: 3, Time: 5, Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "Hat", "Mask"], Effect: ["Prone", "BlindHeavy", "BlockMouth"], Block: ["ItemEars", "ItemMouth", "ItemMouth2", "ItemMouth3"] },
			{ Name: "LewdBlindfold", Priority: 30, Value: 45, Time: 5, Random: false, AllowLock: true, Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"], ExpressionTrigger: [{ Name: "Light", Group: "Blush", Timer: 5 }, { Name: "Closed", Group: "Eyes", Timer: 5 }] },
			{ Name: "LatexBlindfold", Value: 35, Time: 5, AllowLock: true, Hide: ["Glasses", "Mask"], Effect: ["BlindNormal", "Prone"] },
			{ Name: "DogHood", Value: 60, Difficulty: 50, Time: 15, Random: false, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "HairAccessory1", "HairAccessory2", "Mask"], Effect: ["GagNormal", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"] },
			{ Name: "FoxyMask", Value: 50, Difficulty: 2, Time: 15, Random: false, AllowLock: true, Effect: ["GagLight", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3"] },
			{ Name: "FrilledSleepMask", Value: 5, Time: 5, Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"] },
			{ Name: "BlackoutLenses", Value: 60, Difficulty: 10, Random: false, DefaultColor: "#333333", Hide: ["Glasses", "Eyes", "Mask"], Effect: ["BlindHeavy", "Prone"] },
			{ Name: "WebBlindfold", Value: 50, Difficulty: 5, Time: 10, RemoveTime: 20, Random: false, Hide: ["Glasses", "Mask"], AllowBlock: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"], AllowEffect: ["BlindHeavy", "GagNormal", "BlockMouth"], AllowType: ["Cocoon"], Effect: ["BlindLight", "Prone"], Extended: true },
			{ Name: "RopeBlindfold", Value: 60, Time: 15, DefaultColor: "#956B1C", BuyGroup: "HempRope", Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"] },
			{ Name: "PonyHood", Value: -1, Difficulty: 50, Time: 15, Random: false, AllowLock: true, DefaultColor: "#404040", Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "ItemMouth2", "ItemMouth3", "Eyes", "HairAccessory1", "HairAccessory2", "Mask"], Effect: ["BlindHeavy", "DeafLight", "Prone", "GagNormal", "BlockMouth"], Block: ["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars", "ItemNeck"] },
			{ Name: "SleepMask", Value: 5, Time: 5, Hide: ["Glasses", "Mask"], Effect: ["BlindLight", "Prone"] },
			AssetSpankingToys
		],
		Color: ["Default"]
	},

	{
		Group: "ItemEars",
		Category: "Item",
		Priority: 1,
		Default: false,
		IsRestraint: true,
		Left: 150,
		Top: 50,
		Zone: [[100, 0, 75, 130], [325, 0, 75, 130]],
		Activity: ["Kiss", "Lick", "Nibble", "Pinch", "Caress", "Whisper", "TickleItem", "RubItem", "RollItem"],
		Asset: [
			{ Name: "LightDutyEarPlugs", Value: 15, Difficulty: 50, Time: 5, Visible: false, Effect: ["DeafLight"] },
			{ Name: "HeavyDutyEarPlugs", Value: 30, Difficulty: 50, Time: 5, Visible: false, Effect: ["DeafHeavy"] },
			{ Name: "HeadphoneEarPlugs", Value: 50, Difficulty: 50, Time: 5, Visible: false, Effect: [""], AllowEffect: ["DeafLight", "DeafHeavy"], AllowType: ["Off", "Light", "Heavy"], Extended: true },
			AssetSpankingToys
		],
		Color: ["Default"]
	},

	{
		Group: "ItemMisc",
		Category: "Item",
		Priority: 47,
		Default: false,
		Top: -250,
		Zone: [[10, 0, 90, 200]],
		Asset: [
			{ Name: "MetalPadlock", Value: 15, Time: 10, Wear: false, Effect: [], IsLock: true },
			{ Name: "IntricatePadlock", Value: 50, Time: 30, Wear: false, Effect: [], IsLock: true },
			{ Name: "TimerPadlock", Value: 80, Wear: false, Effect: [], IsLock: true, MaxTimer: 300, RemoveTimer: 300 },
			{ Name: "CombinationPadlock", Value: 100, Random: false, Wear: false, Effect: [], IsLock: true },
			{ Name: "OwnerPadlock", Value: 60, Time: 10, Wear: false, OwnerOnly: true, Effect: [], IsLock: true },
			{ Name: "OwnerTimerPadlock", Value: 100, Wear: false, OwnerOnly: true, Effect: [], IsLock: true, MaxTimer: 604800, RemoveTimer: 300 },
			{ Name: "LoversPadlock", Value: 60, Time: 10, Wear: false, LoverOnly: true, Effect: [], IsLock: true },
			{ Name: "LoversTimerPadlock", Value: 100, Wear: false, LoverOnly: true, Effect: [], IsLock: true, MaxTimer: 604800, RemoveTimer: 300 },
			{ Name: "MistressPadlock", Value: -1, Time: 10, Wear: false, Effect: [], IsLock: true },
			{ Name: "MistressTimerPadlock", Value: -1, Wear: false, Effect: [], IsLock: true, MaxTimer: 14400, RemoveTimer: 300 },
			{ Name: "ExclusivePadlock", Value: 50, Time: 10, Wear: false, Effect: [], IsLock: true },
			{ Name: "MetalPadlockKey", Value: 10, Wear: false, Effect: ["Unlock-MetalPadlock"] },
			{ Name: "IntricatePadlockKey", Value: 30, Wear: false, Effect: ["Unlock-IntricatePadlock"] },
			{ Name: "OwnerPadlockKey", Value: 60, Wear: false, OwnerOnly: true, Effect: ["Unlock-OwnerPadlock", "Unlock-OwnerTimerPadlock"] },
			{ Name: "LoversPadlockKey", Value: 40, Wear: false, LoverOnly: true, Effect: ["Unlock-LoversPadlock", "Unlock-LoversTimerPadlock"] },
			{ Name: "MistressPadlockKey", Value: -1, Wear: false, Effect: ["Unlock-MistressPadlock", "Unlock-MistressTimerPadlock"] },
			{ Name: "MetalCuffsKey", Value: 20, Time: 5, Wear: false, Effect: ["Unlock-MetalCuffs"] },
			{ Name: "WoodenMaidTray", Value: -1, Enable: false },
			{ Name: "WoodenMaidTrayFull", Value: -1, Enable: false },
			{ Name: "WoodenPaddle", Value: -1, Enable: false }
		],
		Color: ["Default"]
	},

	{
		Group: "ItemDevices",
		Category: "Item",
		Priority: 49,
		Default: false,
		IsRestraint: true,
		Left: 0,
		Top: -250,
		Zone: [[10, 600, 90, 400], [400, 600, 90, 400]],
		Asset: [
			{ Name: "WoodenBox", Value: 60, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied"], Effect: ["Prone", "Enclose", "BlindNormal", "GagLight", "Freeze"], Alpha: [[1, 1, 70, 999], [420, 1, 80, 999]], RemoveAtLogin: true },
			{ Name: "SmallWoodenBox", Value: 40, Difficulty: -2, SelfBondage: 5, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "BlindNormal", "GagLight", "Freeze"], Alpha: [[1, 1, 70, 999], [420, 1, 80, 999]], RemoveAtLogin: true },
			{ Name: "MilkCan", Value: -1, Difficulty: 1, Time: 15, RemoveTime: 10, SetPose: ["Kneel"], Effect: ["BlindHeavy", "Prone", "Enclose", "GagHeavy", "Freeze"], RemoveAtLogin: true },
			{ Name: "WaterCell", Value: -1, Difficulty: 1, Time: 15, RemoveTime: 15, SetPose: ["Suspension", "LegsClosed"], Effect: ["Prone", "Enclose", "GagMedium", "Freeze"], Block: ["ItemFeet"], RemoveAtLogin: true },
			{ Name: "Cage", Value: 120, Difficulty: 4, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["NotKneeling", "NotSuspended"], Effect: ["Prone", "Enclose", "Freeze"], Alpha: [[1, 80, 105, 900], [410, 80, 105, 900]], RemoveAtLogin: true },
			{ Name: "LowCage", Value: 80, Difficulty: 4, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "Freeze"], Alpha: [[1, 80, 75, 900], [400, 80, 100, 900]], RemoveAtLogin: true },
			{ Name: "SaddleStand", Priority: 39, Value: 100, Difficulty: -2, Time: 10, AllowLock: true, Prerequisite: ["LegsOpen", "AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotKneelingSpread", "NotShackled", "StraitDressOpen"], SetPose: ["LegsOpen"], Effect: ["Prone", "Freeze", "Mounted"], Block: ["ItemPelvis", "ItemLegs", "ItemFeet"], Height: 30, RemoveAtLogin: true },
			{ Name: "BurlapSack", Priority: 39, Value: 35, Difficulty: 5, SelfBondage: 4, Time: 15, RemoveTime: 6, Prerequisite: ["NotSuspended", "AllFours", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Cloth", "ClothLower", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "ItemArms", "ItemButt", "TailStraps", "Wings", "BodyLower", "Socks", "ItemHidden", "ItemNipplesPiercings", "ItemTorso"], SetPose: ["Kneel", "BackElbowTouch"], Effect: ["ForceKneel", "Block", "Prone", "Freeze"], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots"] },
			{ Name: "InflatableBodyBag", Priority: 31, Value: 225, Difficulty: 1, SelfBondage: 6, Time: 30, RemoveTime: 50, AllowLock: true, Prerequisite: ["NotSuspended", "AllFours", "NotHogtied", "NotYoked", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], Hide: ["Cloth", "Suit", "ClothLower", "SuitLower", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "ItemArms", "ItemButt", "TailStraps", "Wings", "BodyLower", "Socks", "ItemNipplesPiercings"], HideItem: ["ItemVulvaFullLatexSuitWand"], AllowPose: ["Kneel"], SetPose: ["LegsClosed", "BackElbowTouch"], Effect: ["Block", "Prone", "Freeze"], AllowType: ["Light", "Inflated", "Bloated", "Max"], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots"], Extended: true, SelfUnlock: false },
			{ Name: "BondageBench", Priority: 1, Value: 250, SelfBondage: 4, Time: 10, RemoveTime: 10, Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NoFeetSpreader"], SetPose: ["LegsClosed"], Effect: ["Block", "Prone", "Freeze", "Mounted"], Extended: true, RemoveAtLogin: true },
			{ Name: "TeddyBear", Priority: 34, Value: 50, Difficulty: -10, Time: 5, IsRestraint: false, AllowPose: ["AllFours", "Hogtied", "TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Horse", "StraitDressOpen", "Yoked"], Effect: [], AllowType: ["Bear", "Fox", "Kitty", "Pup", "Bunny", "Pony"], Extended: true, RemoveAtLogin: true },
			{
				Name: "OneBarPrison", Priority: 16, Value: 75, Difficulty: 8, SelfBondage: 2, Time: 20, AllowLock: true, Prerequisite: ["AccessVulva", "AllFours", "LegsOpen", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotChaste", "StraitDressOpen"], SetPose: ["LegsOpen"], Effect: ["Prone", "Freeze", "Mounted"], Block: ["ItemPelvis", "ItemLegs", "ItemVulva", "ItemFeet"], Layer: [
					{ Name: "Bar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				],
				RemoveAtLogin: true
			},
			{ Name: "TheDisplayFrame", Value: 100, Difficulty: 50, SelfBondage: 5, Time: 10, AllowLock: true, Prerequisite: ["DisplayFrame", "AllFours", "NotSuspended", "NotHogtied", "NotHorse", "NotKneeling", "NotMasked"], SetPose: ["LegsClosed", "BackElbowTouch"], Effect: ["Prone", "Freeze", "Block", "Mounted"], Block: ["ItemArms", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNeckAccessories"], RemoveAtLogin: true },
			{ Name: "Sybian", Priority: 22, Value: 80, Difficulty: 1, Time: 10, IsRestraint: false, Prerequisite: ["AccessVulva", "NotKneeling", "AllFours", "LegsOpen", "NotSuspended", "NotHogtied", "NotShackled", "NotChaste", "StraitDressOpen", "NotHorse"], Hide: ["Shoes", "Socks", "ItemBoots", "ItemFeet", "ItemLegs", "ItemVulva"], HideItem: ["ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexPants1", "ItemDevicesTeddyBear", "SuitLowerReverseBunnySuit"], SetPose: ["KneelingSpread"], Effect: ["Egged", "Freeze", "Mounted"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemPelvis", "ItemButt", "ItemVulva"], RemoveAtLogin: true, ArousalZone: "ItemVulva" },
			{ Name: "StrapOnSmooth", Priority: 34, Value: 25, Difficulty: 1, Time: 10, IsRestraint: false },
			{ Name: "StrapOnStuds", Priority: 34, Value: 25, Difficulty: 1, Time: 10, IsRestraint: false },
			{ Name: "DisplayCase", Value: 60, Difficulty: -2, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["NotSuspended"], Effect: ["Prone", "Enclose", "DeafLight", "GagLight", "Freeze"], Alpha: [[1, 1, 70, 999], [420, 1, 80, 999]], RemoveAtLogin: true },
			{ Name: "SmallDisplayCase", Value: 40, Difficulty: -2, SelfBondage: 1, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "DeafLight", "GagLight", "Freeze"], Alpha: [[1, 1, 70, 999], [420, 1, 80, 999]], RemoveAtLogin: true },
			{ Name: "WoodenBoxOpenHead", Value: 60, Difficulty: -2, SelfBondage: 3, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied", "NotYoked"], Hide: ["Wings"], Effect: ["Prone", "Freeze", "Block"], AllowBlock: ["ItemHands"], Alpha: [[1, 220, 70, 999], [420, 220, 80, 999]], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots", "ItemHands"], RemoveAtLogin: true },
			{ Name: "SmallWoodenBoxOpenHead", Value: 40, Difficulty: -2, SelfBondage: 3, Time: 15, RemoveTime: 10, AllowLock: true, Prerequisite: ["NotSuspended", "NotHogtied", "NotMounted", "NotKneelingSpread", "NoFeetSpreader", "CanKneel", "NotYoked"], Hide: ["Wings"], SetPose: ["Kneel"], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Freeze", "Block"], AllowBlock: ["ItemHands"], Alpha: [[1, 220, 70, 999], [420, 220, 80, 999]], Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots", "ItemHands"], RemoveAtLogin: true },
			{ Name: "WoodenStocks", Value: 150, Difficulty: 50, SelfBondage: 4, Time: 10, AllowLock: true, Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NoItemArms", "LegsOpen"], SetPose: ["Yoked"], Effect: ["Prone", "Freeze", "Block", "Mounted"], Block: ["ItemArms", "ItemFeet", "ItemLegs", "ItemBoots"], RemoveAtLogin: true },
			{ Name: "Vacbed", ParentGroup: "BodyUpper", Value: 200, Difficulty: 50, SelfBondage: 3, Time: 10, Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NotKneelingSpread", "NoItemArms", "LegsOpen", "NoItemHands", "NoItemLegs", "NoHorse", "NoItemFeet"], Hide: ["HairFront"], SetPose: ["Yoked"], Effect: ["Prone", "Freeze", "Block", "Mounted"], Alpha: [[1, 1, 70, 999], [420, 1, 80, 999]], Block: ["ItemArms", "ItemBoots", "ItemBreasts", "ItemButt", "ItemEars", "ItemFeet", "ItemHands", "ItemLegs", "ItemMisc", "ItemNeck", "ItemNeckAccessories", "ItemNeckRestraints", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "DogHood", "ItemHead"], RemoveAtLogin: true },
			{ Name: "Crib", Priority: -30, Value: 100, Difficulty: 0, SelfBondage: 1, Time: 15, RemoveTime: 10, IsRestraint: true, AllowLock: true, Left: -30, Top: -235, Effect: ["Freeze"], RemoveAtLogin: true, Prerequisite: ["CannotUseWithAlphaHood", "AllFours", "NotSuspended", "NotHogtied", "NoFeetSpreader"], HideItem: ["ShoesMistressBoots", "ShoesPonyBoots", "ThighHighLatexHeels", "Shoes", "ItemBootsPonyBoots", "ItemBootsBalletHeels", "ItemBootsBalletWedges", "ItemBootsThighHighLatexHeels"], Extended: true, AllowType: ["Open", "Closed", "Stuffed"] },
			{ Name: "Bed", Value: 100, Priority: 1, Difficulty: -20, SelfBondage: 0, Time: 5, RemoveTime: 5, Effect: ["Freeze", "Mounted"], Prerequisite: ["NotKneeling", "AllFours", "NotSuspended", "NotHogtied", "NoFeetSpreader", "CannotUseWithAlphaHood"], HideItem: ["ShoesMistressBoots", "ShoesPonyBoots", "ShoesThighHighLatexHeels", "ItemBootsPonyBoots", "ItemBootsBalletHeels", "ItemBootsBalletWedges", "ItemBootsThighHighLatexHeels"], BuyGroup: "Bed", RemoveItemOnRemove: [{ Name: "Covers", Group: "ItemAddon" }] }
		],
		Color: ["Default"]
	},

	{
		Group: "ItemAddon",
		Category: "Item",
		Priority: 50,
		Default: false,
		IsRestraint: true,
		Left: 0,
		Top: -250,
		Zone: [[400, 0, 90, 200]],
		Asset: [
			{ Name: "BondageBenchStraps", Value: -1, Difficulty: 12, SelfBondage: 5, Time: 5, IsRestraint: true, AllowLock: true, Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"], SetPose: ["LegsClosed"], Effect: ["Block", "Prone"], AllowType: ["Light", "Normal", "Heavy", "Full"], Block: ["ItemDevices"], Extended: true, RemoveAtLogin: true },
			{ Name: "OldGasMaskLenses", Priority: 44, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 5, AllowLock: true, Effect: ["BlindHeavy"] },
			{ Name: "OldGasMaskTube1", Effect: ["GagEasy"], Priority: 43, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 5, AllowLock: true },
			{ Name: "OldGasMaskTube2", Effect: ["GagEasy"], Priority: 43, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 5, AllowLock: true },
			{ Name: "OldGasMaskRebreather", Priority: 43, Value: -1, Difficulty: 12, SelfBondage: 5, Time: 5, AllowLock: true, Effect: ["GagNormal"] },
			{ Name: "Covers", Value: -1, Difficulty: 1, SelfBondage: 0, Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "BedRopes", Value: -1, Difficulty: 6, SelfBondage: 3, DefaultColor: "#956B1C", Block: ["ItemDevices"], Hide: ["TailStraps"], Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "BedStraps", Value: -1, Difficulty: 6, SelfBondage: 2, Block: ["ItemDevices"], Hide: ["TailStraps"], AllowLock: true, Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "BedTape", Value: -1, Difficulty: 6, SelfBondage: 2, Block: ["ItemDevices"], Hide: ["TailStraps"], Prerequisite: "OnBed", BuyGroup: "Bed" },
			{ Name: "BedChains", Value: -1, Difficulty: 6, SelfBondage: 4, Block: ["ItemDevices"], Hide: ["TailStraps"], AllowLock: true, Prerequisite: "OnBed", BuyGroup: "Bed" },
		],
		Color: ["Default"]
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
		Activity: ["Kiss", "PoliteKiss", "Lick", "Suck", "Nibble", "Tickle", "Spank", "MassageHands", "MassageFeet", "TakeCare", "SpankItem", "TickleItem", "RubItem", "RollItem", "PourItem"],
		Asset: [
			{ Name: "PonyBoots", Value: -1, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Alpha: [[75, 875, 140, 200], [290, 875, 140, 200]], Height: 35 },
			{ Name: "BalletHeels", Value: 75, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Alpha: [[75, 875, 140, 200], [290, 875, 140, 200]], Height: 35 },
			{ Name: "BalletWedges", Value: 50, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Alpha: [[75, 875, 140, 200], [290, 875, 140, 200]], Height: 35 },
			{ Name: "ToeCuffs", Value: 35, Difficulty: 4, Time: 10, RemoveTime: 5, AllowLock: true, Prerequisite: "ToeTied", SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"] },
			{ Name: "LeatherToeCuffs", Value: 50, Difficulty: 3, Time: 10, RemoveTime: 5, AllowLock: true, Prerequisite: "ToeTied", SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"] },
			{ Name: "ToeTie", Value: 15, Difficulty: 2, Time: 10, RemoveTime: 5, DefaultColor: "#956B1C", Prerequisite: "ToeTied", SetPose: ["LegsClosed"], Effect: ["Freeze", "Prone"] },
			{ Name: "ThighHighLatexHeels", Value: -1, Time: 10, RemoveTime: 15, AllowLock: true, BuyGroup: "ThighHighLatexHeels", Alpha: [[75, 850, 140, 200], [290, 850, 140, 200]], Height: 30 },
			{ Name: "LockingHeels", Value: 20, Difficulty: 6, Time: 10, RemoveTime: 15, AllowLock: true, Height: 15 },
			{ Name: "LockingHeels2", Value: 25, Difficulty: 7, Time: 10, RemoveTime: 15, AllowLock: true, Height: 15 },
			{ Name: "LockingShoes1", Value: 15, Difficulty: 3, Time: 5, RemoveTime: 8, AllowLock: true, Height: 6 },
			{ Name: "LockingShoes2", Value: 20, Difficulty: 4, Time: 5, RemoveTime: 8, AllowLock: true, Height: 6 },
			{
				Name: "LockingBoots1", Value: 30, Difficulty: 6, Time: 7, RemoveTime: 14, AllowLock: true, Height: 9,
				Layer: [
					{ Name: "Boots", AllowColorize: true },
					{ Name: "Straps", AllowColorize: false }
				]
			},
			{
				Name: "LeatherFootMitts1", Value: 35, Difficulty: 4, Time: 6, RemoveTime: 7, AllowLock: true, Hide: ["Shoes", "Socks"],
				Layer: [
					{ Name: "Mitts", AllowColorize: true },
					{ Name: "Straps", AllowColorize: false }
				]
			},
			{ Name: "ToeTape", Extended: true, Value: 50, BuyGroup: "DuctTape", Difficulty: 2, Time: 10, RemoveTime: 5, Prerequisite: "ToeTied", SetPose: ["LegsClosed"], AllowType: ["Full"] },
			AssetSpankingToys
		],
		Color: ["Default"]
	},

	{
		Group: "ItemHidden",
		Category: "Item",
		Default: false,
		IsRestraint: true,
		Asset: [
			{ Name: "LeatherArmbinderStrap", Priority: 31, Value: -1, AllowType: ["Strap", "WrapStrap", "None"] },
			{ Name: "LeatherArmbinderWrapStrap", Priority: 31, Value: -1, AllowType: ["WrapStrap", "None"] },
			{ Name: "SuspensionHempRope", Priority: 31, Value: -1 },
			{ Name: "SuspensionChains", Priority: 31, Value: -1 }
		],
		Color: ["Default"]
	}

];

/* eslint-disable */
// 3D Custom Girl based pose
var PoseFemale3DCG = [

	{
		Name: "Kneel",
		OverrideHeight: -250,
		Hide: ["ItemFeet"]
	},
	{
		Name: "Horse",
		OverrideHeight: -75,
		Hide: ["ItemFeet"]
	},
	{
		Name: "KneelingSpread",
		OverrideHeight: -250,
		Hide: ["ItemFeet"]
	},
	{
		Name: "Yoked",
		Hide: ["Hands"]
	},
	{
		Name: "Hogtied",
		OverrideHeight: -575,
		Hide: ["BodyLower", "Hands", "ClothLower", "Wings", "TailStraps", "Gloves", "Panties", "Pussy", "ItemHands", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemLegs", "ItemFeet", "SuitLower"],
		MovePosition: [{ Group: "Socks", X: 0, Y: -400 }, { Group: "Shoes", X: 0, Y: -500 }, { Group: "ItemBoots", X: 0, Y: -500 }]
	},
	{
		Name: "Suspension",
		OverrideHeight: 150,
		Hide: []
	},
	{
		Name: "SuspensionHogtied",
		OverrideHeight: 0,
		Hide: ["BodyLower", "Hands", "ClothLower", "Wings", "TailStraps", "Gloves", "Panties", "Pussy", "ItemHands", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemLegs", "ItemFeet", "SuitLower", "ItemDevices"]
	},
	{
		Name: "AllFours",
		OverrideHeight: -560,
		Hide: ["ItemFeet", "ClothLower", "SuitLower", "Nipples", "Pussy", "BodyLower", "Wings", "ItemPelvis", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemBoots", "Suit", "Panties", "Bra", "Socks", "Shoes"],
		MovePosition: [{ Group: "TailStraps", X: 0, Y: -300 }, { Group: "ItemButt", X: 0, Y: -300 }]
	}

];

// 3D Custom Girl based activities
var ActivityFemale3DCG = [
	{
		Name: "Kiss",
		MaxProgress: 50,
		TargetSelf: ["ItemHands", "ItemArms", "ItemBoots", "ItemBreast", "ItemNipples"],
		Prerequisite: ["UseMouth"]
	},
	{
		Name: "FrenchKiss",
		MaxProgress: 70,
		Prerequisite: ["UseMouth", "ZoneNaked", "TargetCanUseTongue"]
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
		Prerequisite: ["UseTongue", "ZoneNaked"]
	},
	{
		Name: "Suck",
		MaxProgress: 60,
		TargetSelf: ["ItemHands", "ItemArms", "ItemBoots", "ItemNipples"],
		Prerequisite: ["UseMouth", "ZoneNaked"]
	},
	{
		Name: "Nibble",
		MaxProgress: 40,
		TargetSelf: ["ItemMouth", "ItemHands", "ItemArms", "ItemBoots", "ItemNipples"],
		Prerequisite: ["UseMouth", "ZoneNaked"]
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
		Prerequisite: ["UseHands"]
	},
	{
		Name: "Caress",
		MaxProgress: 80,
		TargetSelf: ["ItemTorso", "ItemPelvis", "ItemBreast", "ItemNipples", "ItemLegs", "ItemFeet", "ItemBoots", "ItemArms", "ItemHands", "ItemButt", "ItemVulva", "ItemHead", "ItemNeck", "ItemMouth", "ItemEars"],
		Prerequisite: ["UseHands"]
	},
	{
		Name: "Pet",
		MaxProgress: 20,
		TargetSelf: ["ItemHead"],
		Prerequisite: ["UseHands"]
	},
	{
		Name: "Cuddle",
		MaxProgress: 30,
		Prerequisite: []
	},
	{
		Name: "Rub",
		MaxProgress: 60,
		Prerequisite: []
	},
	{
		Name: "TakeCare",
		MaxProgress: 10,
		TargetSelf: ["ItemBoots", "ItemHands", "ItemHead"],
		Prerequisite: ["UseHands", "ZoneNaked"]
	},
	{
		Name: "MassageHands",
		MaxProgress: 60,
		TargetSelf: ["ItemTorso", "ItemPelvis", "ItemBreast", "ItemLegs", "ItemFeet", "ItemBoots", "ItemArms", "ItemHands", "ItemButt", "ItemVulva", "ItemHead", "ItemNeck"],
		Prerequisite: ["UseHands"]
	},
	{
		Name: "MassageFeet",
		MaxProgress: 40,
		Prerequisite: ["UseFeet"]
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
		TargetSelf: ["ItemNipples", "ItemEars", "ItemArms", "ItemPelvis"],
		Prerequisite: ["UseHands"]
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
		TargetSelf: ["ItemHead"],
		Prerequisite: ["UseHands"]
	},
	{
		Name: "Choke",
		MaxProgress: 50,
		TargetSelf: ["ItemNeck"],
		Prerequisite: ["UseHands"]
	},
	{
		Name: "MasturbateTongue",
		MaxProgress: 100,
		Prerequisite: ["UseTongue", "ZoneNaked"]
	},
	{
		Name: "MasturbateHand",
		TargetSelf: ["ItemBreast", "ItemVulva", "ItemButt"],
		MaxProgress: 100,
		Prerequisite: ["UseHands", "ZoneNaked"]
	},
	{
		Name: "MasturbateFist",
		MaxProgress: 100,
		Prerequisite: ["UseHands", "ZoneNaked"]
	},
	{
		Name: "MasturbateFoot",
		MaxProgress: 100,
		Prerequisite: ["UseFeet", "ZoneNaked"]
	},
	{
		Name: "MasturbateItem",
		MaxProgress: 100,
		Prerequisite: ["ZoneNaked"]
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
	}
];
/* eslint-enable */
