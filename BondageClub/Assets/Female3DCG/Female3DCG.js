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

// Spanking Toys Asset
var AssetSpankingToys = {
	Name: "SpankingToys", Wear: false, Random: false, BuyGroup: "SpankingToys", IgnoreParentGroup: true,
	DynamicDescription: () => InventorySpankingToysGetType(),
	DynamicPreviewIcon: () => InventorySpankingToysGetType(),
	DynamicAllowInventoryAdd: () => InventoryIsWorn(Player, "ItemHands", "SpankingToys"),
	DynamicExpressionTrigger: () => SpankingInventory.find(x => x.Name == InventorySpankingToysGetType()).ExpressionTrigger
};

// 3D Custom Girl based assets
var AssetFemale3DCG = [

	// Appearance specific
	{
		Group: "Cloth",
		Priority: 31,
		ParentGroup: "BodyUpper",
		Clothing: true,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Yoked"],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Asset: [
			{ Name: "CollegeOutfit1", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Hide: ["ItemNeck"], Value: -1 },
			{ Name: "MaidOutfit1", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Value: -1 },
			{ Name: "MaidOutfit2", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1"], Value: -1, Expose: ["ItemNipples", "ItemNipplesPiercings", "ItemBreast"] },
			{ Name: "StudentOutfit1", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Hide: ["ItemNeck"] },
			{ Name: "StudentOutfit2", HideItem: ["ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "BabydollDress1", HideItem: ["ClothLowerLatexSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "TeacherOutfit1", Hide: ["ItemNeck"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs", "ClothLowerLatexSkirt1", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], ParentGroup: ["BodyLower"], AllowPose: ["Horse", "KneelingSpread", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero"] },
			{ Name: "ChineseDress1", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "ChineseDress2", Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "TShirt1", Require: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "TennisShirt1", Require: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "Sweater1", Require: ["ClothLower"], HideItem: ["ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "MistressTop", Require: ["ClothLower"], Hide: ["Bra"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Value: -1 },
			{ Name: "AdultBabyDress1", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Value: 60 },
			{ Name: "AdultBabyDress2", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Value: 80 },
			{ Name: "AdultBabyDress3", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Value: 40 },
			{ Name: "NurseUniform", HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"], Value: -1 },
			{ Name: "BunnyCollarCuffs", Value: 10, Expose: ["ItemNipples","ItemNipplesPiercings", "ItemBreast", "ItemTorso"] },
			{ Name: "Robe1", Value: 30, HideItem: ["ClothLowerLatexSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs"] },
			{ Name: "SuspenderTop1", Priority: 25, Value: 50, Expose: ["ItemNipples","ItemNipplesPiercings", "ItemBreast"], Hide: ["Panties", "ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "LeatherCorsetTop1", Priority: 25, Value: 60, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{
			    Name: "FlowerDress", Value: 50, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"],
				Layer: [
					{ Name: "Dress", AllowColorize: true },
					{ Name: "Flower", AllowColorize: false }
				]
			},
			{ Name: "Dress2", Value: 100, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "LaceBabydoll", Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "SleevelessTop", Value: 20, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{
				Name: "DressFur", Value: 70, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"],
				Layer: [
					{ Name: "Fabric", AllowColorize: true },
					{ Name: "Fur", AllowColorize: false }
				]
			},
			{ Name: "BodyTowel1", Value: 30, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "Yukata1", Value: 50, HideItem: ["ClothLowerLatexSkirt1", "ClothLowerLatexSkirt2", "ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ClothLowerClothSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing", "ItemArmsLeatherCuffs", "ItemArmsOrnateCuffs"] },
			{ Name: "SteampunkCorsetTop1", Priority: 25, Value: 70, HideItem: ["ClothLowerTennisSkirt1", "ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "BondageDress1", Value: 90, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "BondageDress2", Value: 90, Hide: ["ClothLower"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "ShoulderlessTop", Value: 40, HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] }
		]
	},

	{
		Group: "ClothLower",
		Priority: 26,
		Default: false,
		ParentGroup: "BodyLower",
		ParentColor: "Cloth",
		Clothing: true,
		AllowPose: ["LegsClosed", "Kneel", "StraitDressOpen", "Horse","KneelingSpread"],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 105,
		Top: 380,
		Asset: [
			{ Name: "Skirt1", Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "TennisSkirt1", ParentItem: "TennisShirt1", Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Jeans1", Priority: 22, Hide: ["ItemVulva", "ItemVulvaPiercings"], HideItem: ["SocksSocksFur", "SocksSocks6"] },
			{ Name: "Shorts1", Hide: ["ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "Pajama1", Random: false, Priority: 25 },
			{ Name: "MistressBottom", Hide: ["Panties"], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Value: -1 },
			{ Name: "Waspie1", Priority: 26, Value: 60, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Waspie2", Priority: 26, Value: 80, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Waspie3", Priority: 26, Value: 40, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "LatexPants1", Priority: 21, Value: 60, Hide: ["ItemVulva", "ItemVulvaPiercings"], HideItem: ["SocksSocksFur", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksStockings2", "SocksStockings3"] },
			{ Name: "LatexSkirt1", Priority: 26, Value: 40, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "LatexSkirt2", Priority: 26, Value: 60, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "ClothSkirt1", Priority: 26, Value: 40, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "Jeans2", Priority: 22, Hide: ["ItemVulva", "ItemVulvaPiercings"], HideItem: ["SocksSocksFur", "SocksSocks6"], Value: 20 }
		]
	},

	{
		Group: "Bra",
		Priority: 21,
		ParentGroup: "BodyUpper",
		Clothing: true,
		Underwear: true,
		AllowPose: ["Yoked"],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 150,
		Top: 200,
		Asset: [
			{ Name: "Bra1", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra2", Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra7", Priority: 20, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra8", Value: 15, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bra9", Value: 10, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bandeau1", Priority: 20, Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Bustier1", Value: 30, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset1", Value: 35, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset2", Value: 30, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset3", Value: 25, BuyGroup: ["Corset3"], Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Corset4", Value: 15, BuyGroup: ["Corset4"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Corset5", Value: 20, BuyGroup: ["Corset5"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "Bikini1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikini1", Value: 50, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikini2", Value: 40, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikini3", Value: 45, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "Swimsuit1", Value: 15, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "Swimsuit2", Value: 25, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "BunnySuit", Value: 30, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "FrameBra1", Value: 20, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "FrameBra2", Value: 15, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "BondageBra1", Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "LatexBra1", Value: 30, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra1", Priority: 20, Value: 30, BuyGroup: ["HarnessBra1"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "HarnessBra2", Priority: 20, Value: 40, BuyGroup: ["HarnessBra2"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "CuteBikini1", Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"] },
			{ Name: "CorsetBikini1", Priority: 20, Value: 40, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "OuvertPerl1", Priority: 20, Value: 40, Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], HideItem: ["ItemNipplesPiercingsRoundPiercing", "ItemNipplesPiercingsWeightedPiercing"] },
			{ Name: "Sarashi1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "KittyBra1", Value: 30, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "FishnetBikini1", Priority: 20, Value: 45, Hide: ["Panties", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "SexyBeachBra1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] },
			{ Name: "SexyBikiniBra1", Value: 25, Hide: ["ItemNipples", "ItemNipplesPiercings"] }
		]
	},

	{
		Group: "Panties",
		Priority: 19,
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Clothing: true,
		Underwear: true,
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 150,
		Top: 395,
		Asset: [
			{ Name: "Panties1", HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Panties7", HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Panties8", HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Panties11", HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Panties12", Value: 10, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Panties13", Value: 10, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Panties14", Value: 10, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Panties15", Value: 10, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Bikini1", Value: 25, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Diapers1", Value: 30, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "Panties16", Value: 20, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "MaidPanties1", Value: 25, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "LatexPanties1", Value: 30, Expose: ["ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "WrapPanties1", Value: 25, Expose: ["ItemVulva", "ItemVulvaPiercings"] },
			{ Name: "CrotchPanties1", Value: 30, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "StringPanties1", Value: 15, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "StringPasty1", Value: 10, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "ZipPanties1", Value: 15, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "HarnessPanties1", Value: 40, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], AllowPose: ["LegsClosed", "Kneel"] },
			{ Name: "KittyPanties1", Value: 20, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "PearlPanties1", Value: 20, Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"] },
			{ Name: "SunstripePanties1", Value: 20, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] },
			{ Name: "SexyBeachPanties1", Value: 20, HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"] }
		]
	},

	{
		Group: "Socks",
		Priority: 20,
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Clothing: true,
		Underwear: true,
		AllowPose: ["LegsClosed", "Kneel", "StraitDressOpen"],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 125,
		Top: 400,
		Asset: [
			"Socks0", "Socks1", "Socks2", "Socks3", "Socks4", "Socks5", "Stockings1", "Stockings2",
			{ Name: "Stockings3", Value: 10 },
			{ Name: "Stockings4", Value: 10 },
			{ Name: "Pantyhose1", Value: 10, Priority: 20, Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"] },
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
			{ Name: "SocksStriped1", Value: 10 }
		]
	},

	{
		Group: "Shoes",
		Priority: 23,
		ParentGroup: "BodyLower",
		Clothing: true,
		AllowPose: ["LegsClosed", "Kneel"],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 125,
		Top: 500,
		Asset: [
			{ Name: "Shoes1", Height: 6 },
			{ Name: "Shoes2", Height: 6 },
			{ Name: "Shoes4", Height: 6 },
			{ Name: "Sneakers1", Height: 3 },
			{ Name: "Sneakers2", Height: 3 },
			{ Name: "Heels1", Height: 15 },
			{ Name: "Heels2", Height: 15 },
			{ Name: "Boots1", Height: 9 },
			{ Name: "MistressBoots", Height: 35, Value: -1, HideItem: ["SocksSocks4", "SocksSocks5"], Alpha: [[75, 800, 140, 200],[290, 800, 140, 200]] },
			{ Name: "PonyBoots", Height: 35, Value: -1, Alpha: [[75, 800, 140, 200],[290, 800, 140, 200]] },
			{ Name: "Sandals", Priority: 22, Height: 3, Value: 30, HideItem: ["SocksSocks0", "SocksSocks1", "SocksSocks2", "SocksSocks3", "SocksSocks4", "SocksSocks5", "SocksSocks6", "SocksSocksFur"] },
			{ Name: "PawBoots", Height: 3, Value: 45 },
			{ Name: "WoollyBootsTall", Height: 9, Value: 60 }
		]
	},

	{
		Group: "Hat",
		Priority: 43,
		Default: false,
		Clothing: true,
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		AllowPose: ["Suspension"],
		Left: 125,
		Top: 0,
		Asset: [
			"Band1", "Beret1",
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
			{ Name: "CollegeDunce", Value: -1 }
		]
	},

	{
		Group: "HairAccessory1",
		Priority: 41,
		Default: false,
		Clothing: true,
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		AllowPose: ["Suspension"],
		Left: 90,
		Top: 0,
		Asset: [
			"Ears1", "Ears2", "PonyEars1",
			{ Name: "Ribbons1", Priority: 4, BuyGroup: "Ribbons1" },
			{ Name: "GiantBow1", Priority: 4, BuyGroup: "GiantBow1" },
			{ Name: "BunnyEars1", Value: 10, BuyGroup: "BunnyEars1" },
			{ Name: "BunnyEars2", Value: 20, BuyGroup: "BunnyEars2" },
			{ Name: "PuppyEars1", Value: 20, Priority: 30, BuyGroup: "PuppyEars1" },
			{ Name: "SuccubusHorns", Value: 15, BuyGroup: "SuccubusHorns" },
			{ Name: "Horns", Value: 20, BuyGroup: "Horns" },
			{ Name: "Horns2", Value: 15, BuyGroup: "Horns2"},
			{ Name: "Horns3", Value: 15, BuyGroup: "Horns3" },
			{ Name: "HairFlower1", Value: 10, BuyGroup: "HairFlower1"},
			{ Name: "FoxEars1", Value: 15, BuyGroup: "FoxEars1" },
			{ Name: "BatWings", Value: 20, BuyGroup: "BatWings" },
			{ Name: "KittyMask1", Hide: ["HairFront", "Glasses", "HairAccessory2"], Value: 25, BuyGroup: "BatWings" }
		]
	},
	
	{
		Group: "HairAccessory2",
		Priority: 42,
		Default: false,
		Clothing: true,
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		AllowPose: ["Suspension"],
		Left: 90,
		Top: 0,
		Asset: [
			"Ears1", "Ears2", "PonyEars1",
			{ Name: "Ribbons1", Priority: 4, BuyGroup: "Ribbons1" },
			{ Name: "GiantBow1", Priority: 4, BuyGroup: "GiantBow1" },
			{ Name: "BunnyEars1", Value: 10, BuyGroup: "BunnyEars1" },
			{ Name: "BunnyEars2", Value: 20, BuyGroup: "BunnyEars2" },
			{ Name: "PuppyEars1", Value: 20, Priority: 30, BuyGroup: "PuppyEars1" },
			{ Name: "SuccubusHorns", Value: 15, BuyGroup: "SuccubusHorns" },
			{ Name: "Horns", Value: 20, BuyGroup: "Horns" },
			{ Name: "Horns2", Value: 15, BuyGroup: "Horns2"},
			{ Name: "Horns3", Value: 15, BuyGroup: "Horns3" },
			{ Name: "HairFlower1", Value: 10, BuyGroup: "HairFlower1"},
			{ Name: "FoxEars1", Value: 15, BuyGroup: "FoxEars1" },
			{ Name: "BatWings", Value: 20, BuyGroup: "BatWings" },
			{ Name: "KittyMask1", Hide: ["HairFront", "Glasses", "HairAccessory1"], Value: 25, BuyGroup: "BatWings" }
		]
	},

	{
		Group: "Gloves",
		Priority: 29,
		ParentGroup: "BodyUpper",
		ParentColor: "Bra",
		Clothing: true,
		Underwear: true,
		Default: false,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked"],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Asset: [
			"Gloves1", "Gloves2",
			{ Name: "MistressGloves", Value: -1 },
			{ Name: "FingerlessGloves", Value: 20 },
			{ 
				Name: "GlovesFur", Value: 30,
				Layer: [
					{ Name: "Fabric", AllowColorize: true },
					{ Name: "Fur", AllowColorize: false }
				]
			}
		]
	},

	{
		Group: "Glasses",
		Priority: 28,
		Default: false,
		Clothing: true,
		Underwear: true,
		Color: ["#303030", "#808080", "#e0e0e0", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 180,
		Top: 125,
		Asset: ["Glasses1", "Glasses2", "Glasses3", "Glasses4", "Glasses5", "Glasses6", { Name: "SunGlasses1", Value: 15 }, { Name: "SunGlasses2", Value: 15 }, { Name: "Mask1", Value: 20 }, { Name: "Mask2", Value: 20 }, { Name: "ButterflyMask1", Value: 30 }, { Name: "EyePatch1", Value: 10 }],
	},

	{
		Group: "TailStraps",
		Priority: 4,
		Default: false,
		Clothing: true,
		Underwear: true,
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 0,
		Top: 150,
		Zone: [[250, 500, 150, 80]],
		Asset: [
			{ Name: "TailStrap", Value: 30 },
			{ Name: "HorseTailStrap", Value: 20 },
			{ Name: "FoxTailsStrap", Priority: 2, Value: 50 },
			{ Name: "PuppyTailStrap", Value: 15 },
			{ Name: "SuccubusStrap", Value: 15 },
			{ Name: "SuccubusTailStrap", Value: 10 },
			{ Name: "RaccoonStrap", Value: 25 },
			{ Name: "RaccoonTailStrap", Priority: 2, Value: 35 },
			{ Name: "PuppyTailStrap1", Value: 20 }
		]
	},

	{
		Group: "Wings",
		Priority: 3,
		ParentColor: "Bra",
		Default: false,
		Clothing: true,
		Underwear: true,
		Color: ["Default"],
		Asset: [
			{ Name: "SuccubusFeather", Value: 35 },
			{ Name: "SuccubusWings", Value: 35 },
			{ Name: "AngelFeather", Value: 50 },
			{ Name: "DevilWings", Value: 25 },
			{ Name: "FallenAngelWings", Value: 50 },
			{ Name: "AngelWings", Value: 50 },
			{ Name: "BatWings", Value: 20 }
		]
	},

	{
		Group: "Height",
		AllowNone: false,
		AllowColorize: false,
		Asset: [
			{ Name: "H0950", Zoom: 0.950, Visible: false },
			{ Name: "H0960", Zoom: 0.960, Visible: false },
			{ Name: "H0970", Zoom: 0.970, Visible: false },
			{ Name: "H0980", Zoom: 0.980, Visible: false },
			{ Name: "H0990", Zoom: 0.990, Visible: false },
			{ Name: "H1000", Zoom: 1.000, Visible: false },
			{ Name: "H0900", Zoom: 0.900, Visible: false },
			{ Name: "H0910", Zoom: 0.910, Visible: false },
			{ Name: "H0920", Zoom: 0.920, Visible: false },
			{ Name: "H0930", Zoom: 0.930, Visible: false },
			{ Name: "H0940", Zoom: 0.940, Visible: false }
		]
	},
	
	{
		Group: "BodyUpper",
		Priority: 7,
		AllowNone: false,
		AllowColorize: false,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "StraitDressOpen", "Yoked"],
		Color: ["White", "Asian", "Black"],
		Asset: ["Small", "Normal", "Large", "XLarge"],
	},

	{
		Group: "BodyLower",
		Priority: 9,
		AllowNone: false,
		AllowColorize: false,
		ParentSize: "BodyUpper",
		ParentColor: "BodyUpper",
		AllowPose: ["LegsClosed", "Kneel", "Horse", "KneelingSpread"],
		Color: ["White", "Asian", "Black"],
		Top: 462,
		Asset: ["Small", "Normal", "Large", "XLarge"]
	},

	{
		Group: "Hands",
		Priority: 28,
		AllowNone: false,
		AllowColorize: false,
		ParentColor: "BodyUpper",
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch"],
		Color: ["White", "Asian", "Black"],
		Asset: ["Default"]
	},

	{
		Group: "HairBack",
		Priority: 5,
		AllowNone: false,
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"],
		AllowPose: ["Suspension"],
		Left: 50,
		Top: 0,
		Asset: ["HairNone", "HairBack1", "HairBack2", "HairBack4", "HairBack10", "HairBack14", "HairBack15", "HairBack16", "HairBack17", "HairBack18", "HairBack19", "HairBack20", "HairBack5", "HairBack8", "HairBack11", "HairBack6", "HairBack21", "HairBack22"]
	},

	{
		Group: "HairFront",
		Priority: 40,
		AllowNone: false,
		ParentColor: "HairBack",
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"],
		Left: 150,
		Top: 50,
		Asset: ["HairFront1", "HairFront2", "HairFront3", "HairFront4", "HairFront5", "HairFront6", "HairFront7", "HairFront8", "HairFront9", "HairFront10", "HairFront11", "HairFront12", "HairFront13"]
	},

	{
		Group: "Eyes",
		Priority: 9,
		AllowNone: false,
		Color: ["#6a3628", "#5e481e", "#666666", "#555588", "#558855", "#885555", "#202020", "#aa3333", "#33aa33", "#3333aa", "#aaaa33", "#33aaaa", "#aa33aa"],
		AllowExpression: ["Closed", "Wink", "Dazed"],
		Left: 200,
		Top: 150,
		FullAlpha: false,
		Blink: true,
		Asset: ["Eyes1", "Eyes2", "Eyes3", "Eyes4", "Eyes5", "Eyes6", "Eyes7", "Eyes8", "Eyes9", "Eyes10", "Eyes11"]
	},

	{
		Group: "Mouth",
		Priority: 10,
		AllowNone: false,
		Color: ["Default", "#803d26", "#aa5555", "#cc3333", "#55aa55", "#5555aa", "#55aaaa", "#aa55aa", "#aaaa55"],
		AllowExpression: ["Frown"],
		Left: 240,
		Top: 190,
		Asset: ["Mouth1", "Mouth2", "Mouth3", "Mouth4", "Mouth5"]
	},

	{
		Group: "Nipples",
		Priority: 11,
		AllowNone: false,
		ParentGroup: "BodyUpper",
		Default: false,
		Color: ["Default", "#a6665b", "#803d26", "#d68777", "#9b4a2e", "#bb6655"],
		Left: 175,
		Top: 285,
		Asset: ["Nipples1", "Nipples2"]
	},

	{
		Group: "Pussy",
		Priority: 12,
		AllowNone: false,
		Color: ["Default", "#6a3628", "#443330", "#222222"],
		Left: 225,
		Top: 500,
		FullAlpha: false,
		Asset: ["PussyLight1", "PussyLight2", "PussyLight3", "PussyDark1", "PussyDark2", "PussyDark3"]
	},

	// Facial Expression specific
	{
		Group: "Eyebrows",
		Priority: 9,
		AllowNone: false,
		AllowColorize: false,
		AllowCustomize: false,
		AllowExpression: ["Raised", "Lowered", "OneRaised", "Harsh", "Angry", "Soft"],
		Left: 200,
		Top: 120,
		Asset: ["Eyebrows1"]
	},

	{
		Group: "Blush",
		Priority: 8,
		AllowNone: false,
		AllowColorize: false,
		AllowCustomize: false,
		AllowExpression: ["Low", "Medium", "High"],
		Left: 200,
		Top: 150,
		Asset: ["Blush"]
	},

	// Item specific
	{
		Group: "ItemFeet",
		Category: "Item",
		Priority: 27,
		ParentGroup: "BodyLower",
		Default: false,
		IsRestraint: true,
		Effect: ["Freeze", "Prone"],
		Color: ["Default"],
		Left: 125,
		Top: 725,
		Zone: [[100, 750, 300, 120]],
		Asset: [
			{ Name: "NylonRope", DefaultColor: "#909090", Value: 30, BuyGroup: ["NylonRope"], Time: 15, SetPose: ["LegsClosed"] },
			{ Name: "HempRope", Value: 60, Time: 15, Difficulty: 3, BuyGroup: ["HempRope"], SetPose: ["LegsClosed"], Extended: true, AllowType: ["Mermaid"] },
			{ Name: "LeatherBelt", Value: 25, Time: 10, RemoveTime: 5, AllowLock: true, SetPose: ["LegsClosed"] },
			{ Name: "SturdyLeatherBelts", Value: 50, Time: 10, RemoveTime: 5, AllowLock: true, SetPose: ["LegsClosed"], BuyGroup: "SturdyLeatherBelts", Extended: true, AllowType: ["One", "Two", "Three", "Four"] },
			{ Name: "Irish8Cuffs", Value: 25, Time: 10, RemoveTime: 5, AllowLock: true, SetPose: ["LegsClosed"] },
			{ Name: "SuspensionHempRope", SelfBondage: false, Random: false, RemoveAtLogin: true, SetPose: ["Suspension", "LegsClosed"], Effect: ["Freeze", "Prone"], HideItem: ["ItemDevicesTeddyBear"], Value: -1, Height: 150, Time: 30, Difficulty: 3, Alpha: [[125, 850, 250, 150]], ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 30 }, { Group: "Eyebrows", Name: "Raised", Timer: 10 }], Prerequisite: "NotChained" },
			{ Name: "DuctTape", Extended: true, Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape", SetPose: ["LegsClosed"], AllowType: ["HalfFeet", "MostFeet", "CompleteFeet"] },
			{ Name: "LeatherAnkleCuffs", Value: 30, Time: 10, Difficulty: 2, Effect: [], Priority: 24, AllowPose: ["LegsClosed"], Extended: true, AllowLock: true, AllowEffect: ["Freeze", "Prone"] },
			{ Name: "OrnateAnkleCuffs", Value: 90, Time: 10, Difficulty: 3, Effect: [], Priority: 24, AllowPose: ["LegsClosed"], Extended: true, AllowLock: true, AllowEffect: ["Freeze", "Prone"],
			Layer: [
					{ Name: "Cuffs", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{ Name: "SpreaderMetal", Value: 50, Time: 10, Difficulty: 3, Random: false, AllowLock: true, Effect: ["Freeze", "Prone"], SetPose: ["LegsOpen"], Block: ["ItemLegs"],  Prerequisite: "LegsOpen", RemoveAtLogin: true },
			{ Name: "BallChain", Value: 40, Time: 10, Difficulty: 5, Effect: [], RemoveTime: 10, Random: false, AllowLock: true, AllowPose: ["LegsOpen", "LegsClosed"] },
			{ Name: "AnkleShackles", Value: 30, Time: 10, Difficulty: 6, RemoveTime: 5, Effect: ["Prone"], Random: false, AllowLock: true, AllowPose: ["LegsOpen", "LegsClosed"] },
			AssetSpankingToys
		]
	},

	{
		Group: "ItemLegs",
		Category: "Item",
		Priority: 25,
		ParentGroup: "BodyLower",
		Default: false,
		IsRestraint: true,
		Effect: ["Prone", "KneelFreeze"],
		Color: ["Default"],
		AllowPose: ["Kneel"],
		Left: 125,
		Top: 400,
		Zone: [[100, 580, 300, 170]],
		Asset: [
			{ Name: "NylonRope", DefaultColor: "#909090", Value: 30, Time: 10, BuyGroup: ["NylonRope"], SetPose: ["LegsClosed"] },
			{ Name: "HempRope", Value: 60, Time: 10, RemoveTime: 15, Difficulty: 3, BuyGroup: ["HempRope"], SetPose: ["LegsClosed"], Extended: true, AllowType: ["Mermaid"] },
			{ Name: "LeatherBelt", Value: 25, Time: 5, AllowLock: true, SetPose: ["LegsClosed"] },
			{ Name: "SturdyLeatherBelts", Value: 50, Time: 5, AllowLock: true, SetPose: ["LegsClosed"], BuyGroup: "SturdyLeatherBelts", Extended: true, AllowType: ["One", "Two", "Three", "Four"] },
			{ Name: "DuctTape", Extended: true, Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape", SetPose: ["LegsClosed"], AllowType: ["HalfLegs", "MostLegs", "CompleteLegs"] },
			{ Name: "LeatherLegCuffs", Value: 30, Time: 10, Difficulty: 2, Priority: 24, AllowPose: ["LegsClosed"], Extended: true, AllowLock: true, Effect: [], AllowEffect: ["Prone", "KneelFreeze"], AllowType: ["Closed"] },
			{ Name: "OrnateLegCuffs", Value: 90, Time: 10, Difficulty: 3, Priority: 24, AllowPose: ["LegsClosed"], Extended: true, AllowLock: true, Effect: [], AllowEffect: ["Prone", "KneelFreeze"], AllowType: ["Closed"],
			Layer: [
					{ Name: "Cuffs", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{
				Name: "LegBinder", DefaultColor: "#70C0C0", Value: 80, Block: ["ItemFeet"], SetPose: ["LegsClosed"], Hide: ["Shoes", "Socks", "ClothLower"], HideItem: ["ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherAnkleCuffs", "ItemFeetMermaidRopeTie"], Effect: ["Prone"], Time: 30, RemoveTime: 20, Difficulty: 15, AllowLock: true, Prerequisite: "NotSuspended",
				Layer: [
					{ Name: "Latex", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false },
				]
			},
			{
				Name: "HobbleSkirt", DefaultColor: "#222222", Value: 125, Block: ["ItemPelvis", "ItemFeet", "ItemVulva", "ItemVulvaPiercings", "ItemButt"], SetPose: ["LegsClosed"], Hide: ["Socks", "BodyLower", "ClothLower", "Shoes", "ItemBoots"], HideItem: ["ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetMermaidRopeTie", "ItemFeetLeatherAnkleCuffs"], Effect: ["Prone"], Time: 30, RemoveTime: 20, Difficulty: 15, AllowLock: true, Prerequisite: "NotKneeling",
				Layer: [
					{ Name: "Latex", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false }
				]
			},
			{
				Name: "WoodenHorse", Random: false, Alpha: [[160, 720, 200, 240]], Priority: 33, Value: 200, Time: 10, Difficulty: 2, SetPose: ["Horse"], ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyes", Name: "Closed", Timer: 5 }], Effect: ["Prone", "Freeze", "Mounted"], Block: ["ItemFeet", "ItemBoots"], Hide: ["Shoes", "Socks", "ItemBoots"], HideItem: ["ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexPants1", "ItemDevicesTeddyBear"], Prerequisite: "Horse",
				Layer: [
					{ Name: "Frame", AllowColorize: true },
					{ Name: "Wood", AllowColorize: false }
				]
			},
			AssetSpankingToys
		]
	},

	{
		Group: "ItemVulva",
		Category: "Item",
		Priority: 15,
		Default: false,
		Color: ["Default"],
		AllowPose: ["Kneel"],
		Left: 125,
		Top: 400,
		Zone: [[100, 500, 100, 80]],
		Asset: [
			{ Name: "VibratingEgg", Effect: ["Egged"], Value: 25, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }], AllowEffect: ["Egged", "Vibrating"], Visible: false },
			{ Name: "VibratingWand", Wear: false, Value: 60, Prerequisite: "AccessVulva", Bonus: [{ Type: "KidnapManipulation", Factor: 3 }], ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyes", Name: "Closed", Timer: 5 }], Visible: false },
			{ Name: "VibratorRemote", Effect: ["Remote"], Wear: false, Value: 50, BuyGroup: "VibratorRemote", Visible: false },
			{ Name: "VibratingLatexPanties", DefaultColor: "#60A0AF", Effect: ["Egged", "Chaste"], Block: ["ItemButt"], Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }], AllowLock: true, AllowEffect: ["Egged", "Vibrating"] },
			{
				Name: "WandBelt", DefaultColor: "#BBAAAA", Priority: 24, Effect: ["Egged"], Block: ["ItemPelvis"], Value: 80, Prerequisite: "AccessVulva", Time: 15, ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }], AllowLock: true, AllowEffect: ["Egged", "Vibrating"], HideItem: ["PantiesDiapers1", "ClothLowerJeans1", "ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerMistressBottom"],
				Layer: [
					{ Name: "Belt", AllowColorize: true },
					{ Name: "Wand", AllowColorize: false }
				]
			},
			{ Name: "VibratingDildo", Priority: 11, Effect: ["Egged"], Value: 60, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }], AllowEffect: ["Egged", "Vibrating"],
			Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{ Name: "InflatableVibeDildo", Priority: 11, Effect: ["Egged"], Value: 100, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }], AllowEffect: ["Egged", "Vibrating"],
			Layer: [
					{ Name: "Dildo", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{ Name: "ClitSuctionCup", Priority: 11, Effect: [], Value: 25, Extended: true, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Angry", Timer: 5 }] },
			{ Name: "TapeStrips", Value: 10, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "BenWaBalls", Value: 30, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "HeavyWeightClamp", Value: 30, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			AssetSpankingToys
		]
	},
	
	{
		Group: "ItemVulvaPiercings",
		Category: "Item",
		Priority: 13,
		Default: false,
		Color: ["Default"],
		AllowPose: ["Kneel"],
		Left: 125,
		Top: 400,
		Zone: [[200, 500, 100, 80]],
		Asset: [
			{ Name: "StraightClitPiercing", Value: 15, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "RoundClitPiercing", Value: 15, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "WeightedClitPiercing", Value: 30, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "BarbellClitPiercing", Value: 20, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "ChastityClitPiercing", Effect: ["Chaste"], Block: ["ItemVulva"], Value: 50, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 50, Time: 20, RemoveTime: 20, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"] },
			{ Name: "ChastityClitShield", Effect: ["Chaste"], Block: ["ItemVulva"], Value: 70, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 50, Time: 30, RemoveTime: 30, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"] },
			{ Name: "HighSecurityVulvaShield", Effect: ["Chaste"], Block: ["ItemVulva"], Value: 100, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 99, Time: 60, RemoveTime: 200, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo"] },
			{ Name: "JewelClitPiercing", Value: 20, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "AdornedClitPiercing", Value: 20, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			AssetSpankingToys
		]
	},

	{
		Group: "ItemButt",
		Category: "Item",
		Priority: 4,
		Default: false,
		Color: ["Default"],
		Left: 0,
		Top: 0,
		Zone: [[300, 500, 100, 80]],
		Asset: [
			{ Name: "BlackButtPlug", Value: 15, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }], Visible: false },
			{ Name: "TailButtPlug", Value: 40, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "HorsetailPlug", Value: 30, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "PuppyTailPlug", Value: 25, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "PuppyTailPlug1", Value: 30, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "SuccubusButtPlug", Value: 25, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "SuccubusButtPlug2", Value: 25, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "FoxTails", Priority: 2, Value: 60, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "RaccoonButtPlug", Value: 40, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "RaccoonTailPlug", Priority: 2, Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "AnalBeads", Value: 20, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }], Visible: false },
			{ Name: "ButtPump", Effect: [], Value: 35, Extended: true, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }], Visible: false },
			{ Name: "VibratingButtplug", Effect: ["Egged"], Value: 60, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }], AllowEffect: ["Egged", "Vibrating"], Visible: false },
			{ Name: "InflVibeButtPlug", Effect: ["Egged"], Value: 90, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }], AllowEffect: ["Egged", "Vibrating"], Visible: false },
			{ Name: "AnalHook", IsRestraint: true, Value: 20, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }], AllowEffect: ["Freeze", "Egged"], Extended: true, AllowType: ["Base", "Chain", "Hair"] },
			{ Name: "ButtPlugLock", IsRestraint: true, Effect: ["Chaste"], Value: 75, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 50, Time: 30, RemoveTime: 50, ExpressionTrigger: [{ Group: "Blush", Name: "High", Timer: 10}, { Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }], AllowEffect: ["Chaste", "Tethered", "Freeze", "ForceKneel"], Extended: true, AllowType: ["Base", "ChainShort", "ChainLong"] },
			AssetSpankingToys
		]
	},
	
	{
		Group: "ItemPelvis",
		Category: "Item",
		Priority: 17,
		ParentGroup: "BodyLower",
		Default: false,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Yoked"],
		Color: ["Default"],
		Left: 125,
		Top: 375,
		Zone: [[150, 420, 200, 80]],
		Asset: [
			{ Name: "StraponPanties", DefaultColor: "#505050", Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Value: -1, Prerequisite: "AccessVulva", Time: 15 },
			{ Name: "LeatherChastityBelt", Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Value: 30, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 8, Time: 20, RemoveTime: 10, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "SleekLeatherChastityBelt", Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Value: 45, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 11, Time: 20, RemoveTime: 10, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "StuddedChastityBelt", Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Value: 60, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 14, Time: 20, RemoveTime: 10, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "MetalChastityBelt", Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Value: 100, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 20, Time: 20, RemoveTime: 10, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "PolishedChastityBelt", Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Value: 150, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 30, Time: 20, RemoveTime: 10, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "OrnateChastityBelt", Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Value: 200, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 50, Time: 20, RemoveTime: 10, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }],
			Layer: [
					{ Name: "Belt", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{ Name: "SteelChastityPanties", Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"], Hide: ["ItemVulva", "ItemVulvaPiercings"], Value: 150, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 50, Time: 50, RemoveTime: 60, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "HarnessPanties1", Priority: 19, Value: 40, Prerequisite: "AccessVulva", AllowLock: true, Difficulty: 8, Time: 10, RemoveTime: 15, BuyGroup: ["HarnessPanties1"], Expose: ["ItemVulva", "ItemVulvaPiercings", "ItemButt"], AllowPose: ["LegsClosed", "Kneel"] },
			{
				Name: "LoveChastityBelt", HideItem: ["ItemVulvaVibratingDildo", "ItemVulvaClitSuctionCup", "ItemVulvaInflatableVibeDildo"], Value: 250, Prerequisite: "AccessVulva", Difficulty: 50, Time: 20, RemoveTime: 10, Extended: true,
				Effect: ["Lock"], OwnerOnly: true,
				AllowEffect: ["Chaste", "Egged", "Vibrating"],
				AllowBlock: ["ItemVulva", "ItemButt", "ItemVulvaPiercings"],
				AllowType: ["Open", "Closed", "Vibe", "Shock"],
				DynamicExpressionTrigger: () => {
					if (InventoryItemPelvisLoveChastityBeltLastAction == "Open") {
						return [{ Group: "Blush", Name: "Low", Timer: 10 }];
					} else if (InventoryItemPelvisLoveChastityBeltLastAction == "Closed") {
						return [{ Group: "Blush", Name: "Medium", Timer: 10 }];
					} else if (InventoryItemPelvisLoveChastityBeltLastAction == "Vibe") {
						return [{ Group: "Blush", Name: "Medium", Timer: 10 }];
					} else if (InventoryItemPelvisLoveChastityBeltLastAction == "Shock") {
						return [{ Group: "Blush", Name: "Medium", Timer: 10 }];
					} else if (InventoryItemPelvisLoveChastityBeltLastAction == "ShockTriggered") {
						var belt = InventoryGet(CharacterGetCurrent(), "ItemPelvis");
						var intensity = belt && belt.Property && belt.Property.Intensity;
						if (intensity == 0) {
							return [{ Group: "Blush", Name: "Low", Timer: 10 }];
						} else if (intensity == 1) {
							return [{ Group: "Blush", Name: "Medium", Timer: 10 }];
						} else if (intensity == 2) {
							return [{ Group: "Blush", Name: "High", Timer: 10 }];
						} else {
							return null;
						}
					} else {
						return null;
					}
				},
				Layer: [
					{ Name: "Open", AllowColorize: true, AllowTypes: ["", "Open"], HasType: false },
					{ Name: "Closed", AllowColorize: true, AllowTypes: ["Closed", "Vibe", "Shock"], HasType: false },
					{ Name: "Vibe", AllowColorize: false, AllowTypes: ["Vibe"], HasType: false, OverrideAllowPose: [] },
					{ Name: "Shock", AllowColorize: false, AllowTypes: ["Shock"], HasType: false, OverrideAllowPose: [] },
					{ Name: "Lock", AllowColorize: false, AllowTypes: ["", "Open", "Closed", "Vibe", "Shock"], HasType: false, OverrideAllowPose: [] },
					{ Name: "ShieldLock", AllowColorize: false, AllowTypes: ["Closed", "Vibe", "Shock"], HasType: false, OverrideAllowPose: [] },
				]
			},
			{ Name: "LeatherCrop", Value: 20, Wear: false, BuyGroup: "LeatherCrop", Bonus: [{ Type: "KidnapDomination", Factor: 3 }], ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "LeatherWhip", Value: 40, Wear: false, BuyGroup: "LeatherWhip", Bonus: [{ Type: "KidnapBruteForce", Factor: 3 }], ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			AssetSpankingToys
		]
	},

	{
		Group: "ItemTorso",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 18,
		Default: false,
		AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch"],
		Color: ["Default"],
		Left: 125,
		Top: 200,
		Zone: [[150, 340, 200, 80]],
		Asset: [
			{ Name: "NylonRopeHarness", DefaultColor: "#909090", Value: 30, BuyGroup: ["NylonRope"], Prerequisite: "AccessTorso", Time: 25, Extended: true, AllowType: ["CrotchRope"] },
			{ Name: "HempRopeHarness", DefaultColor: "#A07858", Value: 60, Extended: true, Prerequisite: "AccessTorso", Time: 25, RemoveTime: 35, Difficulty: 3, BuyGroup: ["HempRope"], AllowType: ["Diamond", "CrotchRope"] },
			{ Name: "LeatherHarness", Value: 60, Prerequisite: "AccessTorso", Time: 15, RemoveTime: 10, Difficulty: 50, AllowLock: true },
			{ Name: "AdultBabyHarness", DefaultColor: "#aaaaaa", Value: 50, Priority: 33, Time: 15, RemoveTime: 10, Difficulty: 3, AllowLock: true, ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }] },
			{ Name: "HarnessBra1", Priority: 20, Value: 30, Prerequisite: "AccessTorso", Time: 15, RemoveTime: 10, Difficulty: 8, BuyGroup: ["HarnessBra1"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], AllowLock: true },
			{ Name: "HarnessBra2", Priority: 20, Value: 40, Prerequisite: "AccessTorso", Time: 15, RemoveTime: 10, Difficulty: 8, BuyGroup: ["HarnessBra2"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], AllowLock: true },
			{ Name: "Corset3", Priority: 21, Value: 25, Prerequisite: "AccessTorso", Time: 15, RemoveTime: 10, Difficulty: 8, BuyGroup: ["Corset3"], Hide: ["ItemNipples", "ItemNipplesPiercings"], AllowLock: true },
			{ Name: "Corset4", Priority: 21, Value: 15, Prerequisite: "AccessTorso", Time: 15, RemoveTime: 10, Difficulty: 8, BuyGroup: ["Corset4"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], AllowLock: true },
			{ Name: "Corset5", Priority: 21, Value: 20, Prerequisite: "AccessTorso", Time: 15, RemoveTime: 10, Difficulty: 8, BuyGroup: ["Corset5"], Expose: ["ItemNipples", "ItemBreast", "ItemNipplesPiercings"], AllowLock: true },
			AssetSpankingToys
		]
	},

	{
		Group: "ItemNipples",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 19,
		Default: false,
		Color: ["Default"],
		Left: 150,
		Top: 200,
		Zone: [[130, 270, 80, 70]],
		Asset: [
			{ Name: "NippleClamp", Value: 25, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Angry", Timer: 5 }] },
			{ Name: "VibeNippleClamp", Value: 40, Effect: ["Egged"], Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Angry", Timer: 5 }], AllowEffect: ["Egged", "Vibrating"] },
			{ Name: "VibratorRemote", Value: 50, Effect: ["Remote"], Wear: false, BuyGroup: "VibratorRemote" },
			{ Name: "ChainClamp", Value: 25, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "ScrewClamps", Value: 35, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "ChainTassles", Value: 45, Hide: ["ItemNipplesPiercings"], Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "HeartPasties", DefaultColor: "#800000", Value: 20, Hide: ["ItemNipplesPiercings"],  Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "TapedVibeEggs", Value: 30, Effect: ["Egged"], Prerequisite: "AccessBreast", Time: 5, AllowEffect: ["Egged", "Vibrating"] },
			{ Name: "NippleSuctionCups", Effect: [], Value: 25, Hide: ["ItemNipplesPiercings"],  Extended: true, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Angry", Timer: 5 }] },
			{ Name: "NippleTape" ,Value: 10, Hide: ["ItemNipplesPiercings"], Prerequisite: "AccessBreast", Time: 5, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "ChopStickNippleClamps", Value: 25, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "KittyPasties", DefaultColor: "#444444", Value: 20, Hide: ["ItemNipplesPiercings"], Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "Clothespins", Value: 15, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Angry", Timer: 5 }] },
			{ Name: "NippleWeightClamps", Value: 35, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Angry", Timer: 10 }] },
			AssetSpankingToys
		]
	},
	
	{
		Group: "ItemNipplesPiercings",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 18,
		Default: false,
		Color: ["Default"],
		Left: 150,
		Top: 200,
		Zone: [[210, 270, 80, 70]],
		Asset: [
			{ Name: "StraightPiercing", Value: 10, Prerequisite: "AccessBreast", Time: 15, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Angry", Timer: 5 }] },
			{ Name: "RoundPiercing", Priority: 36, Value: 30, Prerequisite: "AccessBreast", Time: 15, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Angry", Timer: 5 }], Extended: true, AllowType: ["Base", "Chain"] },
			{ Name: "WeightedPiercing", Priority: 36, Value: 40, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }], Extended: true, AllowType: ["Base", "Chain"] },
			{ Name: "NippleAccessory1", Value: 15, Prerequisite: "AccessBreast", Time: 5, },
			{ Name: "NippleAccessory2", Value: 15, Prerequisite: "AccessBreast", Time: 5, },
			{ Name: "NippleAccessory3", Value: 15, Prerequisite: "AccessBreast", Time: 5, },
			{ Name: "BarbellPiercing", Value: 20, Prerequisite: "AccessBreast", Time: 15, ExpressionTrigger: [{ Group: "Eyes", Name: "Closed", Timer: 5 }, { Group: "Eyebrows", Name: "Angry", Timer: 5 }] },
			{ Name: "NippleChastityPiercing1", Value: 50, Effect: ["BreastChaste"], Block: ["ItemNipples"], Prerequisite: "AccessBreast", AllowLock: true, Time: 30, RemoveTime: 30, Difficulty: 50, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "NippleChastityPiercing2", Value: 50, Effect: ["BreastChaste"], Block: ["ItemNipples"], Prerequisite: "AccessBreast", AllowLock: true, Time: 30, RemoveTime: 30, Difficulty: 50, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			AssetSpankingToys
		]
	},

	{
		Group: "ItemBreast",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 14,
		Default: false,
		Color: ["Default"],
		Left: 150,
		Top: 200,
		Zone: [[290, 270, 80, 70]],
		Asset: [
			{ Name: "MetalChastityBra", Value: 60, Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], Hide: ["ItemNipples", "ItemNipplesPiercings"], Prerequisite: "AccessBreast", AllowLock: true, Time: 15, Difficulty: 50, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "PolishedChastityBra", Value: 100, Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], Hide: ["ItemNipples", "ItemNipplesPiercings"], Prerequisite: "AccessBreast", AllowLock: true, Time: 15, Difficulty: 50, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "OrnateChastityBra", Value: 150, Effect: ["BreastChaste"], Block: ["ItemNipples", "ItemNipplesPiercings"], Hide: ["ItemNipples", "ItemNipplesPiercings"], Prerequisite: "AccessBreast", AllowLock: true, Time: 15, Difficulty: 50, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }],
			Layer: [
					{ Name: "Bra", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{ Name: "LeatherCrop", Value: 20, Wear: false, BuyGroup: "LeatherCrop", Bonus: [{ Type: "KidnapDomination", Factor: 3 }], ExpressionTrigger: [{ Group: "Blush", Name: "Low", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "LeatherWhip", Value: 40, Wear: false, BuyGroup: "LeatherWhip", Bonus: [{ Type: "KidnapBruteForce", Factor: 3 }], ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 10 }, { Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			AssetSpankingToys
		]
	},

	{
		Group: "ItemArms",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 32,
		Default: false,
		IsRestraint: true,
		Color: ["Default"],
		Left: 50,
		Top: 200,
		Zone: [[30, 250, 100, 150], [370, 250, 100, 150]],
		Asset: [
			{ Name: "NylonRope", DefaultColor: "#909090", SelfBondage: false, Value: 30, BuyGroup: ["NylonRope"], SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], Time: 15 },
			{ Name: "HempRope", SelfBondage: false, Value: 60, SetPose: ["BackBoxTie"], BuyGroup: ["HempRope"], Effect: ["Block", "Prone"], Time: 20, Difficulty: 3 },
			{ Name: "MetalCuffs", Priority: 30, Value: 40, SetPose: ["BackCuffs"], Effect: ["Block", "Prone", "Lock"], Difficulty: 5, Time: 5 },
			{ Name: "SturdyLeatherBelts", SelfBondage: false, AllowLock: true, Value: 50, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Time: 20, Difficulty: 5, BuyGroup: "SturdyLeatherBelts", Extended: true, AllowType: ["One", "Two", "Three", "Four"] },
			{ Name: "LeatherArmbinder", DefaultColor: "#404040", SelfBondage: false, SelfUnlock: false, Priority: 6, Value: 80, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Block: ["ItemHands"], Time: 25, RemoveTime: 10, Difficulty: 10, AllowLock: true },
			{ Name: "ArmbinderJacket", SelfBondage: false, SelfUnlock: false, Value: 100, SetPose: ["BackElbowTouch", "Bolero"], Hide: ["Cloth"], Effect: ["Block", "Prone"], Block: ["ItemHands"], Time: 35, RemoveTime: 25, Difficulty: 12, AllowLock: true },
			{ Name: "LeatherCuffs", DefaultColor: "#404040", Priority: 30, Random: false, Value: 100, AllowPose: ["BackBoxTie", "BackElbowTouch"], Time: 20, Difficulty: 3, Extended: true, AllowLock: true, AllowEffect: ["Block", "Prone"], AllowType: ["Wrist", "Elbow", "Both"] },
			{ Name: "OrnateCuffs", Priority: 30, Random: false, Value: 200, AllowPose: ["BackBoxTie", "BackElbowTouch"], Time: 20, Difficulty: 4, Extended: true, AllowLock: true, AllowEffect: ["Block", "Prone"], AllowType: ["Wrist", "Elbow", "Both"],
			Layer: [
					{ Name: "Cuffs", AllowColorize: true },
					{ Name: "Gems", AllowColorize: false }
				]
			},
			{ Name: "MittenChain1", Random: false, SelfBondage: false, Value: -1, Block: ["ItemHands", "ItemTorso"], Time: 15, Difficulty: 5, AllowLock: true },
			{ Name: "FourLimbsShackles", Enable: false, Value: -1, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone", "Lock"], Time: 30 },
			{ Name: "Manacles", Random: false, Value: 120, AllowLock: true, SelfBondage: false, Difficulty: 16, SetPose: ["BackBoxTie", "Kneel"], Effect: ["Block", "Freeze", "Prone", "ForceKneel"], Time: 30, Prerequisite: "Shackles", Block: ["ItemFeet"] },
			{ Name: "FullBodyShackles", Random: false, Value: 150, AllowLock: true, Difficulty: 18, AllowPose: ["LegsClosed", "Kneel"], Effect: ["Prone", "Shackled"], Prerequisite: "Shackles", Block: ["ItemFeet"]},
			{ Name: "WristShackles", Random: false, Value: 80, AllowPose: ["BackCuffs"], Time: 20, Difficulty: 6, Extended: true, AllowLock: true, AllowEffect: ["Block", "Prone"], Effect: ["Prone"], AllowType: ["Behind"] },
			{ Name: "StraitLeotard", DefaultColor: "#70C0C0", SelfBondage: false, SelfUnlock: false, Value: 120, SetPose: ["BackElbowTouch"], Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerTennisSkirt1", "ItemVulvaVibratingDildo", "ItemVulvaInflatableVibeDildo", "ItemVulvaClitSuctionCup"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"], Effect: ["Block", "Prone"], Time: 35, RemoveTime: 20, Difficulty: 13, AllowLock: true },
			{ Name: "StraitJacket", DefaultColor: "#A0A0A0", SelfBondage: false, SelfUnlock: false, Extended: true, Value: 150, SetPose: ["BackElbowTouch"], Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerTennisSkirt1"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"], Effect: ["Block", "Prone"], Time: 35, RemoveTime: 20, Difficulty: 6, AllowLock: true },
			{ Name: "LeatherStraitJacket", SelfBondage: false, SelfUnlock: false, Extended: true, Value: 200, SetPose: ["BackElbowTouch"], Hide: ["Cloth", "ItemNipplesPiercings"], HideItem: ["ClothLowerSkirt1", "ClothLowerTennisSkirt1"], Block: ["ItemNipples", "ItemNipplesPiercings", "ItemTorso", "ItemBreast", "ItemHands"], Effect: ["Block", "Prone"], Time: 45, RemoveTime: 30, Difficulty: 7, AllowLock: true, AllowType: ["Normal", "Snug", "Tight"] },
			{ 
				Name: "Bolero", DefaultColor: "#E080A0", SelfBondage: false, SelfUnlock: false, Value: 100, SetPose: ["BackElbowTouch", "Bolero"], Block: ["ItemHands"], Effect: ["Block", "Prone"], Time: 35, RemoveTime: 20, Difficulty: 11, AllowLock: true,
				Layer: [
					{ Name: "Leather", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false }
				]
			},
			{ Name: "DuctTape", SelfBondage: false, Extended: true, Value: 50, SetPose: ["BackElbowTouch"], Hide: ["ItemNipplesPiercings"], Effect: ["Block", "Prone"], Time: 20, RemoveTime: 10, Difficulty: 5, BuyGroup: "DuctTape", AllowBlock: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples", "ItemNipplesPiercings"], AllowType: ["Bottom", "Top", "Full", "Complete"], ParentGroup: ["BodyLower"], AllowPose: ["Horse", "KneelingSpread"] },
			{ Name: "BitchSuit", DefaultColor: "#C08080", Random: false, SelfBondage: false, SelfUnlock: false, Value: 200, SetPose: ["BackElbowTouch", "Kneel"], Hide: ["Cloth", "ClothLower", "Bra", "Panties", "BodyLower", "Shoes", "Socks", "ItemBoots", "ItemNipplesPiercings", "ItemLegs", "ItemFeet"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands"], Effect: ["Block", "Prone", "ForceKneel"], Time: 40, RemoveTime: 30, Difficulty: 15, AllowLock: true, Prerequisite: "NotSuspendedOrHorsed" },
			{ Name: "CollarLeashHolding", Random: false, SelfBondage: false, Priority: 35, Value: -1, Time: 3, RemoveTime: 3, Difficulty: 1, Prerequisite: "NotSuspended" },
			{
			    Name: "StraitDress", DefaultColor: "#4040C0", AllowPose: ["Kneel"], Random: false, SelfBondage: false, SelfUnlock: false, Value: 200, SetPose: ["BackElbowTouch", "LegsClosed"], Hide: ["Socks", "BodyLower", "Cloth", "ClothLower", "Bra", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemLegs", "ItemButt"], Effect: ["Block", "Prone"], HideItem: ["ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetMermaidRopeTie", "ItemFeetLeatherAnkleCuffs"], Time: 40, RemoveTime: 30, Difficulty: 15, AllowLock: true, Prerequisite: "NotSuspendedOrHorsed",
				Layer: [
					{ Name: "Latex", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false }
				]
			},
			{
			    Name: "StraitDressOpen", DefaultColor: "#400000", AllowPose: ["Kneel"], Random: false, SelfBondage: false, SelfUnlock: false, Value: 200, SetPose: ["BackElbowTouch", "StraitDressOpen"], Hide: ["Cloth", "BodyLower", "Shoes", "ItemBoots", "ItemNipplesPiercings", "ItemLegs"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast", "ItemHands", "ItemFeet", "ItemNipples", "ItemNipplesPiercings", "ItemLegs"], Effect: ["Block", "Prone"], HideItem: ["ItemFeetNylonRope", "ItemFeetHempRope", "ItemFeetLeatherBelt", "ItemFeetIrish8Cuffs", "ItemFeetDuctTape", "ItemFeetMermaidRopeTie", "ItemFeetLeatherAnkleCuffs"], Time: 40, RemoveTime: 30, Difficulty: 15, AllowLock: true, Prerequisite: "NotSuspendedOrHorsed",
				Layer: [
					{ Name: "Latex", AllowColorize: true },
					{ Name: "Belts", AllowColorize: false }
				]
			},
			{ Name: "Yoke", Value: 80, SetPose: ["Yoked"], SelfBondage: false, Priority: 37, Effect: ["Block", "Prone"], Time: 20, Difficulty: 11, AllowLock: true },
			AssetSpankingToys
		]
	},

	{
		Group: "ItemHands",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 34,
		Default: false,
		IsRestraint: true,
		Color: ["Default"],
		Zone: [[50, 400, 100, 100], [350, 400, 100, 100]],
		Asset: [
			{ Name: "PaddedMittens", DefaultColor: "#bbbbbb", SelfBondage: false, Value: 40, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked"], Effect: ["Block", "Prone"], Extended: true, Time: 15, Difficulty: 4, AllowLock: true },
			{ Name: "PawMittens", DefaultColor: "#bbbbbb", SelfBondage: false, Value: 50, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked"], Effect: ["Block", "Prone"], Extended: true, Time: 15, Difficulty: 4, AllowLock: true },
			{ Name: "LeatherMittens", SelfBondage: false, Value: 60, SetPose: ["TapedHands"], AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked"], Hide: ["Gloves"], Effect: ["Block", "Prone"], Time: 15, RemoveTime: 5, Difficulty: 5, AllowLock: true },
			{ Name: "PaddedLeatherMittens", SelfBondage: false, Value: 70, SetPose: ["TapedHands"], AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked"], Hide: ["Gloves"], Effect: ["Block", "Prone"], Time: 15, RemoveTime: 5, Difficulty: 6, AllowLock: true },
			{ Name: "PolishedMittens", SelfBondage: false, Value: 80, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked"], Effect: ["Block", "Prone"], Time: 20, RemoveTime: 10, Difficulty: 8, AllowLock: true  },
			{ Name: "DuctTape", SelfBondage: false, Value: 50, SetPose: ["TapedHands"], AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked"], Hide: ["Gloves"], Effect: ["Block", "Prone"], Time: 20, RemoveTime: 10, Difficulty: 5, BuyGroup: "DuctTape" },
			{
				Name: "SpankingToys", Priority: 43, Wear: true,  IsRestraint: false, Extended: true, Random: false, BuyGroup: "SpankingToys", AllowType: ["Crop", "Flogger", "Cane", "HeartCrop", "Paddle", "WhipPaddle", "Whip", "CattleProd", "TennisRacket"], IgnoreParentGroup: true, AllowPose: ["BackBoxTie", "BackElbowTouch", "BackCuffs", "Yoked"],
				DynamicDescription: () => { return ((InventoryIsWorn(CurrentCharacter, "ItemHands", "SpankingToys")) && (InventoryGet(CurrentCharacter, "ItemHands").Property != null)) ? InventoryGet(CurrentCharacter, "ItemHands").Property.Type : "Spanking Toy" },
				DynamicPreviewIcon: () => { return ((InventoryIsWorn(CurrentCharacter, "ItemHands", "SpankingToys")) && (InventoryGet(CurrentCharacter, "ItemHands").Property != null)) ? InventoryGet(CurrentCharacter, "ItemHands").Property.Type : "Paddle" }
			}, {
				Name: "SpankingToysCrop", Value: 20, PrerequisiteBuyGroups: ["SpankingToys"], Random: false,
				DynamicAllowInventoryAdd: () => { return false }
			}, {
				Name: "SpankingToysFlogger", Value: 40, PrerequisiteBuyGroups: ["SpankingToys"], Random: false,
				DynamicAllowInventoryAdd: () => { return false }
			}, {
				Name: "SpankingToysCane", Value: 15, PrerequisiteBuyGroups: ["SpankingToys"], Random: false,
				DynamicAllowInventoryAdd: () => { return false }
			}, {
				Name: "SpankingToysHeartCrop", Value: 30, PrerequisiteBuyGroups: ["SpankingToys"], Random: false,
				DynamicAllowInventoryAdd: () => { return false }
			}, {
				Name: "SpankingToysPaddle", Value: 35, PrerequisiteBuyGroups: ["SpankingToys"], Random: false,
				DynamicAllowInventoryAdd: () => { return false }
			}, {
				Name: "SpankingToysWhipPaddle", Value: 25, PrerequisiteBuyGroups: ["SpankingToys"], Random: false,
				DynamicAllowInventoryAdd: () => { return false }
			}, {
				Name: "SpankingToysWhip", Value: 50, PrerequisiteBuyGroups: ["SpankingToys"], Random: false,
				DynamicAllowInventoryAdd: () => { return false }
			}, {
				Name: "SpankingToysCattleProd", Value: 45, PrerequisiteBuyGroups: ["SpankingToys"], Random: false,
				DynamicAllowInventoryAdd: () => { return false }
			}, {
				Name: "SpankingToysTennisRacket", Value: -1, PrerequisiteBuyGroups: ["SpankingToys"], Random: false,
				DynamicAllowInventoryAdd: () => { return false }
			}
		]
	},

	{
		Group: "ItemNeck",
		Category: "Item",
		Priority: 33,
		Default: false,
		Color: ["Default"],
		Left: 185,
		Top: 160,
		Zone: [[210, 210, 80, 60]],
		Asset: [
			{ Name: "LeatherCollar", Value: 20, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "LeatherCollarBell", Value: 30, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "LeatherCollarBow", Value: 25, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "SlaveCollar", Priority: 35, Random: false, Effect: ["Lock"], OwnerOnly: true, Extended: true, Enable: false, Value: -1, Time: 5, Difficulty: 50, AllowType: ["SteelPosture", "LeatherPosture", "PetCollar", "HighCollar", "LeatherCollarBell", "LeatherCollarBow", "MaidCollar", "BatCollar", "HighSecurityCollar", "SpikeCollar", "BordelleCollar", "LeatherCorsetCollar", "StrictPostureCollar", "LatexPostureCollar", "HeartCollar", "NobleCorsetCollar"]},
			{ Name: "ClubSlaveCollar", Random: false, Effect: ["Lock"], Enable: false, Value: -1, Time: 5, Difficulty: 50, ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 15 }] },
			{ Name: "ShockCollar", Random: false, Extended: true, Effect: ["ReceiveShock"], BuyGroup: "ShockCollar", Value: 80, Time: 15, Difficulty: 50, AllowLock: true, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }] },
			{ Name: "ShockCollarRemote", Random: false, Wear: false, Effect: ["TriggerShock"], BuyGroup: "ShockCollar", Value: -1, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Blush", Name: "Soft", Timer: 15 }, { Group: "Eyes", Name: "Closed", Timer: 5 }] },
			{ Name: "BatCollar", Value: 25, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "PostureCollar", Value: 40, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "SteelPostureCollar", Value: 60, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "DogCollar", Random: false, Value: 20, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "SpikeCollar", Value: 40, Time: 5, Difficulty: 50, AllowLock: true },
			{
				Name: "HighCollar", Value: 50, Time: 5, Difficulty: 50, AllowLock: true,
				Layer: [
					{ Name: "Leather", AllowColorize: true },
					{ Name: "Rings", AllowColorize: false }
				]
			},
			{ Name: "LeatherChoker", Value: 10, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "PetCollar", Value: -1, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "MaidCollar", Value: 30, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "BordelleCollar", Value: 30, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "LoveLeatherCollar", Value: 50, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "StrictPostureCollar", Priority: 35, Value: 60, Time: 30, RemoveTime: 40, Difficulty: 50, AllowLock: true },
			{ Name: "NobleCorsetCollar", Value: 45, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "HeartCollar", Value: 50, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "LatexPostureCollar", IsRestraint: true, Priority: 35, Random: false, BuyGroup: ["LatexPostureCollar"], Block: ["ItemMouth"], Effect: ["GagNormal"], Value: 80, Time: 20, RemoveTime: 30, Difficulty: 50, AllowLock: true },
			{ Name: "LeatherCorsetCollar", IsRestraint: true, DefaultColor: "#404040", Random: false, Priority: 35, BuyGroup: ["LeatherCorsetCollar"], Block: ["ItemMouth"], Effect: ["GagNormal"], Value: 75, Time: 20, RemoveTime: 30, Difficulty: 50, AllowLock: true },
			{ Name: "HighSecurityCollar", Value: 70, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "OrnateCollar", Value: 80, Time: 5, Difficulty: 50, AllowLock: true ,
			Layer: [
					{ Name: "Collar", AllowColorize: true },
					{ Name: "Gem", AllowColorize: false }
				]
			}
		]
	},

	{
		Group: "ItemNeckAccessories",
		Category: "Item",
		Priority: 37,
		Default: false,
		Color: ["Default"],
		Left: 0,
		Top: 190,
		Zone: [[130, 210, 80, 60]],
		Asset: [
			{ Name: "CollarBell", Value: 5, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 3, AllowLock: true },
			{ Name: "CollarBow", Value: 5, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 1 },
			{ Name: "CollarShockUnit", Value: 80, Random: false, Extended: true, Effect: ["ReceiveShock"], Prerequisite: "Collared", Time: 5, Difficulty: 6, AllowLock: true, BuyGroup: "ShockCollar", ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 15 }] },
			{ Name: "ShockCollarRemote", Random: false, Wear: false, Effect: ["TriggerShock"], BuyGroup: "ShockCollar", Value: -1, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }, { Group: "Blush", Name: "Soft", Timer: 15 }, { Group: "Eyes", Name: "Closed", Timer: 5 }] },
			{ Name: "CollarNameTag", Value: 50, DefaultColor: "#aaa366", Random: false, IsRestraint: false, Prerequisite: "Collared", Time: 5, Difficulty: 20, Extended: true, AllowLock: true, PropertyLocked: true, AllowType: ["Angel", "BadGirl", "BindMe", "Bitch", "Boobs", "Cupcake", "Devil", "Dom", "Free", "FuckMe", "GagMe", "Goddess", "GoodGirl", "HoldMe", "Jewel", "Love", "Maid", "Meat", "Miss", "Mummy", "Nice", "Needy", "Owned", "Precious", "Pudding", "Queen", "Slave", "Slut", "Sub", "Sweetie", "Taken", "Toy", "Useless", "UseMe", "Whore"] },
			{ Name: "CollarNameTagOval", Value: 50, DefaultColor: "#aaa366", Random: false, IsRestraint: false, Prerequisite: "Collared", Time: 5, Difficulty: 20, Extended: true, AllowLock: true, PropertyLocked: true, AllowType: ["Babe", "Bandit", "Bimbo", "Bratty", "Chair", "Chaste", "Crazy", "Cumslut", "Cutie", "Damsel", "Doll", "EdgeMe", "Evil", "ForSale", "Greedy", "Happy", "Horny", "Kinky", "Lady", "LockMe", "Nude", "Nurse", "Nympho", "Painslut", "Pillow", "Punish", "Robber", "Sad", "Switch", "Table", "Ticklish", "Undress", "Victim", "Violent", "Worm"] },
			{ Name: "CollarNameTagPet", Value: 50, DefaultColor: "#aaa366", Random: false, IsRestraint: false, Prerequisite: "Collared", Time: 5, Difficulty: 20, Extended: true, AllowLock: true, PropertyLocked: true, AllowType: ["Bunny", "Cat", "Dog", "Foxy", "Kitten", "Kitty", "Mochi", "Panda", "Pet", "PetMe", "Pixie", "Pony", "Puppy", "Racoon", "Sloth"] },
			{ Name: "CollarNameTagLover", Value: -1, DefaultColor: "#aaa366", Random: false, IsRestraint: false, Prerequisite: "Collared", Time: 5, Difficulty: 20, Extended: true, AllowLock: true, PropertyLocked: true, AllowType: ["Cookie", "Lover", "Muffin"] },
			{ Name: "CollarMoon", Value: 5, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 3, AllowLock: true },
			{ Name: "CollarSun", Value: 10, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 3, AllowLock: true },
			{ Name: "CollarLapis", Value: 10, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 3, AllowLock: true },
			{ Name: "CollarPentagram", Value: 10, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 3, AllowLock: true },
			{ Name: "CollarFlower", Value: 5, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 1, AllowLock: true },
			{ Name: "CollarRose", Value: 5, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 1, AllowLock: true }
		]
	},

	{
		Group: "ItemNeckRestraints",
		Category: "Item",
		Priority: 38,
		Default: false,
		IsRestraint: true,
		Color: ["Default"],
		Left: 0,
		Top: 190,
		Zone: [[290, 210, 80, 60]],
		Asset: [
			{ Name: "CollarChainLong", Value: 30, Random: false, Prerequisite: "CollaredNotSuspended", Time: 5, Difficulty: 6, AllowLock: true, BuyGroup: "CollarChain", AllowPose: ["Kneel", "Horse", "KneelingSpread"], Effect: ["Tethered"], ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 15 }], ParentGroup: ["BodyLower"] },
			{ Name: "CollarChainShort", Value: -1, Random: false, Prerequisite: "CollaredNotSuspended1", Time: 5, Difficulty: 6, AllowLock: true, BuyGroup: "CollarChain", SetPose: ["Kneel"], Effect: ["Freeze", "ForceKneel"], ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 15 }, { Group: "Eyebrows", Name: "Soft", Timer: 5 }] },
			{ Name: "CollarLeash", Value: 20, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 6, AllowLock: true, ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 15 }] },
			{ Name: "CollarLeashTaken", Value: -1, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 6, AllowLock: true, Effect: ["Tethered"], ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 15 }] },
		]
	},

	{
		Group: "ItemMouth",
		Category: "Item",
		Priority: 34,
		Default: false,
		IsRestraint: true,
		Effect: ["GagNormal"],
		Color: ["Default"],
		Left: 150,
		Top: 0,
		Zone: [[150, 160, 200, 50]],
		Asset: [
			{ Name: "ClothGag", DefaultColor: "#B0B0B0", Extended: true, Difficulty: -4, Value: 15, Time: 10, AllowEffect: ["GagLight"], AllowType: ["Small", "Cleave", "OTM", "OTN"] },
			{
				Name: "WiffleGag", DefaultColor: "#FF6060", Effect: ["GagHeavy"], Difficulty: 1, Value: 30, Time: 10, AllowLock: true,
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{
				Name: "HarnessBallGag", DefaultColor: "#FF6060", Effect: ["GagHeavy"], Difficulty: 4, Value: 60, Time: 20, AllowLock: true,
				Layer: [
					{ Name: "Harness", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "HarnessPanelGag", DefaultColor: "#404040", Effect: ["GagHeavy"], Difficulty: 6, Value: 80, Time: 20, AllowLock: true },
			{
				Name: "RingGag", DefaultColor: "#404040", Value: 30, Time: 5, AllowLock: true,
				Layer: [
					{ Name: "Mouth", AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{ Name: "DuctTape", Extended: true, Difficulty: -2, Value: 50, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape", AllowEffect: ["GagLight", "GagNormal"], AllowType: ["Small", "Crossed", "Full", "Double", "Cover"] },
			{ Name: "PacifierGag", Random: false, Difficulty: -50, Effect: ["GagLight"], Value: 10, Time: 2, ExpressionTrigger: [{ Group: "Blush", Name: "Light", Timer: 5 }, { Group: "Eyes", Name: "Closed", Timer: 5 }] },
			{ Name: "HarnessPacifierGag", Random: false, Difficulty: 2, Effect: ["GagLight"], Value: 50, Time: 20, AllowLock: true, ExpressionTrigger: [{ Group: "Blush", Name: "Light", Timer: 5 }, { Group: "Eyes", Name: "Closed", Timer: 5 }] },
			{ Name: "DusterGag", Random: false, Priority: 38, Difficulty: 4, Value: -1, Time: 20, AllowLock: true },
			{ Name: "HarnessPonyBits", Random: false, Difficulty: 4, Effect: ["GagHeavy"], Value: -1, Time: 20, AllowLock: true },
			{ Name: "PumpGag", DefaultColor: "#404040", Effect: [], Random: false, Extended: true, Value: 100, Time: 20, AllowLock: true, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }], AllowEffect: ["GagLight", "GagNormal", "GagHeavy", "GagTotal"] },
			{ Name: "KittyGag", DefaultColor: "#A0A0A0", Effect: ["GagLight"], Difficulty: -4, Value: 20, Time: 10, ExpressionTrigger: [{ Group: "Blush", Name: "Light", Timer: 5 }, { Group: "Eyes", Name: "Closed", Timer: 5 }] },
			{ Name: "KittenHarnessPanelGag", DefaultColor: "#A0A0A0", Effect: ["GagHeavy"], Difficulty: 6, Value: 80, Time: 20, AllowLock: true },
			{ Name: "CarrotGag", Effect: ["GagHeavy"], Random: false, Value: 40, Time: 15 },
			{ Name: "MuzzleGag", DefaultColor: "#404040", Difficulty: 6, Value: 70, Time: 20, AllowLock: true },
			{ Name: "RegularSleepingPill", Enable: false, Wear: false, Value: -1, Bonus: [{ Type: "KidnapSneakiness", Factor: 3 }] },
			{ Name: "PantiesMask", Effect: [], Random: false, Value: 20, Time: 15 },
			{
				Name: "PlugGag", Random: false, Extended: true, Value: 100, Time: 20, AllowLock: true, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Soft", Timer: 10 }], AllowEffect: ["GagHeavy", "GagTotal"], AllowType: ["Open", "Plug"],
				Layer: [
					{ Name: "Strap", AllowColorize: true },
					{ Name: "Tongue", AllowColorize: false },
					{ Name: "Close", AllowColorize: true, AllowTypes: ["Plug"] }
				]
			},
			{
				Name: "DildoGag", DefaultColor: "#404040", Effect: ["GagHeavy"], Difficulty: 4, Value: 60, Time: 20, AllowLock: true,
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Dildo", AllowColorize: true }
				]
			},
			{ Name: "BoneGag", Difficulty: 6, Value: 50, Time: 10, Effect: ["GagNormal"], AllowLock: true },
			{ 
				Name: "ChopstickGag", Difficulty: 2, Value: 15, Time: 10,
				Layer: [
					{ Name: "Chopsticks", AllowColorize: true },
					{ Name: "Tongue", AllowColorize: false }
				]
			},
			{
				Name: "BambooGag", DefaultColor: "#A07858", Difficulty: 6, Value: 30, Time: 10,
				Layer: [
					{ Name: "Rod", AllowColorize: false },
					{ Name: "Rope", AllowColorize: true }
				]
			},
			{ Name: "HarnessBallGag1", Effect: ["GagHeavy"], Difficulty: 4, Value: 75, Time: 20, AllowLock: true},
			{ Name: "PumpkinGag", Effect: ["GagHeavy"], Difficulty: 1, Value: 40, Time: 10, AllowLock: true},
			{
				Name: "LipGag", Value: 40, Time: 5, AllowLock: true,
				Layer: [
					{ Name: "Mouth", AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "SpiderGag", Value: 45, Time: 5, AllowLock: true,
				Layer: [
					{ Name: "Mouth", AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				]
			},
			{
				Name: "ClothStuffing", Effect: ["GagLight"], Difficulty: -20, Value: 10, Time: 5,
				Layer: [
					{ Name: "Cheeks", AllowColorize: false },
					{ Name: "Cloth", AllowColorize: true }
				]
			},
			{ Name: "ChloroformCloth", Effect: ["GagLight"], Random: false, RemoveAtLogin: true, Value: 40, Time: 2, ExpressionTrigger: [{ Group: "Blush", Name: "Medium", Timer: 20 }, { Group: "Eyes", Name: "Closed", Timer: 180 }] },
			{ Name: "ScarfGag", Effect: ["GagLight"], Value: 15, Time: 10 },
			{ Name: "LewdGag", Random: false, Effect: ["GagLight"], Value: 70, Time: 10, AllowLock: true, ExpressionTrigger: [{ Group: "Blush", Name: "Light", Timer: 5 }, { Group: "Eyes", Name: "Closed", Timer: 5 }] },
			{ Name: "DeepthroatGag", DefaultColor: "#404040", Difficulty: 5, Effect: ["GagHeavy"], Value: 55, Time: 15, AllowLock: true, ExpressionTrigger: [{ Group: "Eyebrows", Name: "Raised", Timer: 10 }] },
			{ Name: "LeatherCorsetCollar", DefaultColor: "#404040", Priority: 35, BuyGroup: ["LeatherCorsetCollar"], Block: ["ItemNeck"], Value: 75, Time: 20, RemoveTime: 30, Difficulty: 50, AllowLock: true },
			{ Name: "LatexPostureCollar", Priority: 35, BuyGroup: ["LatexPostureCollar"], Block: ["ItemNeck"], Value: 80, Time: 20, RemoveTime: 30, Difficulty: 50, AllowLock: true },
			{ Name: "BitGag", Difficulty: 4, Effect: ["GagHeavy"], Value: 40, Time: 20, AllowLock: true },
			{ Name: "XLBoneGag", Difficulty: 6, Value: 60, Time: 10, Effect: ["GagHeavy"], AllowLock: true },
			{ Name: "DogMuzzleExposed", Difficulty: 7, Value: 50, Time: 10, Effect: ["GagNormal"], AllowLock: true }
		]
	},

	{
		Group: "ItemHead",
		Category: "Item",
		Priority: 39,
		Default: false,
		IsRestraint: true,
		Color: ["Default"],
		Left: 150,
		Top: 20,
		Zone: [[175, 25, 150, 125]],
		Asset: [
			{ Name: "ClothBlindfold", DefaultColor: "#A0A0A0", Effect: ["BlindLight", "Prone"], Hide: ["Glasses"], Value: 15, Time: 5 },
			{ Name: "LeatherBlindfold", DefaultColor: "#404040", Effect: ["BlindNormal", "Prone"], Hide: ["Glasses"], Value: 30, Time: 5, AllowLock: true },
			{ Name: "LeatherHood", DefaultColor: "#404040", Effect: ["BlindHeavy", "DeafLight", "Prone", "GagNormal"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "Eyes", "HairAccessory1", "HairAccessory2"], Block: ["ItemMouth", "ItemEars", "ItemNeck"], Difficulty: 50, Value: 60, Time: 15, AllowLock: true },
			{ Name: "LeatherHoodOpenEyes", Priority: 33, DefaultColor: "#404040", Effect: ["GagLight"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "HairAccessory1", "HairAccessory2"], Block: ["ItemMouth", "ItemEars", "ItemNeck"], Difficulty: 50, Value: 40, Time: 15, AllowLock: true },
			{ Name: "StuddedBlindfold", DefaultColor: "#FF4040", Effect: ["BlindNormal", "Prone"], Hide: ["Glasses"], Difficulty: 2, Value: -1, Time: 5, AllowLock: true },
			{ Name: "KittyBlindfold", DefaultColor: "#A0A0A0", Effect: ["BlindLight", "Prone"], Hide: ["Glasses"], Value: 25, Time: 5, AllowLock: true },
			{ Name: "DuctTape", Extended: true, AllowEffect: ["BlindNormal", "Prone", "GagNormal"], AllowBlock: ["ItemMouth", "ItemEars"], Hide: ["Glasses"], Value: 50, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape", AllowType: ["Double", "Wrap", "Mummy"] },
			{ Name: "SmallBlindfold", DefaultColor: "#404040", Effect: ["BlindLight", "Prone"], Hide: ["Glasses"], Value: 40, Time: 5, AllowLock: true },
			{ Name: "LeatherHoodOpenMouth", DefaultColor: "#404040", Effect: ["Prone", "BlindHeavy"], Block: ["ItemEars"], Hide: ["HairFront", "HairBack", "Glasses", "HairAccessory1", "HairAccessory2"], Difficulty: 50, Value: 50, Time: 15, AllowLock: true },
			{ Name: "FullBlindfold", Priority: 31, DefaultColor: "#353535", Effect: ["BlindHeavy", "Prone"], Hide: ["Glasses"], Difficulty: 6, Value: 40, Time: 5, AllowLock: true },
			{ Name: "LeatherHoodSensDep", DefaultColor: "#555555", Effect: ["BlindHeavy", "DeafHeavy", "Prone", "GagTotal"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "Eyes", "Hat", "HairAccessory1", "HairAccessory2"], Block: ["ItemMouth", "ItemEars", "ItemNeck"], Difficulty: 50, Value: 100, Time: 15, AllowLock: true, Alpha: [[150, 50, 200, 50]] },
			{ Name: "LatexHoodOpenHair", DefaultColor: "#555555", Block: ["ItemEars"], Hide: ["HairFront", "HairBack", "Hat", "HairAccessory1", "HairAccessory2"], Difficulty: 50, Value: 45, Time: 15, AllowLock: true, Alpha: [[150, 50, 200, 87]] },
			{ Name: "LeatherHoodSealed", DefaultColor: "#555555", Effect: ["BlindHeavy", "Prone", "GagLight"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "Eyes", "Hat", "HairAccessory1", "HairAccessory2"], Block: ["ItemMouth", "ItemEars", "ItemNeck"], Difficulty: 50, Value: 70, Time: 15, AllowLock: true, Alpha: [[150, 50, 200, 100]] },
			{ Name: "PolishedSteelHood", Effect: ["BlindHeavy", "DeafLight", "Prone", "GagHeavy"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "Eyes", "HairAccessory1", "HairAccessory2"], Block: ["ItemMouth", "ItemEars", "ItemNeck"], Difficulty: 50, Value: 85, Time: 15, AllowLock: true },
			{ Name: "SackHood", Effect: ["Prone", "BlindHeavy"], Block: ["ItemEars", "ItemMouth"], Hide: ["HairFront", "HairBack", "Glasses", "HairAccessory1", "HairAccessory2", "Hat"], Difficulty: 3, Value: 20, Time: 5 },
			{ Name: "LewdBlindfold", Priority: 31, Random: false, Effect: ["BlindLight", "Prone"], Hide: ["Glasses"], Value: 45, Time: 5, AllowLock: true, ExpressionTrigger: [{ Group: "Blush", Name: "Light", Timer: 5 }, { Group: "Eyes", Name: "Closed", Timer: 5 }] },
			{ Name: "LatexBlindfold", Effect: ["BlindNormal", "Prone"], Hide: ["Glasses"], Value: 35, Time: 5, AllowLock: true },
			{ Name: "DogHood", DefaultColor: "#404040", Random: false, Effect: ["Prone", "GagNormal"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "HairAccessory1", "HairAccessory2"], Block: ["ItemMouth", "ItemEars"], Difficulty: 50, Value: 60, Time: 15, AllowLock: true }
		]
	},

	{
		Group: "ItemEars",
		Category: "Item",
		Priority: 1,
		Default: false,
		IsRestraint: true,
		Color: ["Default"],
		Left: 150,
		Top: 50,
		Zone: [[125, 25, 50, 125], [325, 25, 50, 125]],
		Asset: [
			{ Name: "LightDutyEarPlugs", Visible: false, Effect: ["DeafLight"], Difficulty: 50, Value: 15, Time: 5 },
			{ Name: "HeavyDutyEarPlugs", Visible: false, Effect: ["DeafHeavy"], Difficulty: 50, Value: 30, Time: 5 },
			{ Name: "HeadphoneEarPlugs", Visible: false, Effect: [""], AllowEffect: ["DeafLight", "DeafHeavy"], Difficulty: 50, Value: 50, Time: 5, Extended: true, AllowType: ["Off", "Light", "Heavy"] }
		]
	},

	{
		Group: "ItemMisc",
		Category: "Item",
		Priority: 44,
		Default: false,
		Color: ["Default"],
		Top: -250,
		Zone: [[25, 35, 75, 210]],
		Asset: [
			{ Name: "MetalPadlock", Wear: false, Value: 15, Time: 10, IsLock: true, Effect: [] },
			{ Name: "IntricatePadlock", Wear: false, Value: 50, Time: 30, IsLock: true, Effect: [] },
			{ Name: "TimerPadlock", Wear: false, Value: 80, RemoveTimer: 300, IsLock: true, Effect: [] },
			{ Name: "OwnerPadlock", Wear: false, Value: 100, Time: 10, IsLock: true, OwnerOnly: true, Effect: [] },
			{ Name: "MistressPadlock", Wear: false, Value: -1, Time: 10, IsLock: true, Effect: [] },
			{ Name: "MetalPadlockKey", Wear: false, Value: 10, Effect: ["Unlock-MetalPadlock"] },
			{ Name: "IntricatePadlockKey", Wear: false, Value: 30, Effect: ["Unlock-IntricatePadlock"] },
			{ Name: "OwnerPadlockKey", Wear: false, Value: 60, OwnerOnly: true, Effect: ["Unlock-OwnerPadlock"] },
			{ Name: "MistressPadlockKey", Wear: false, Value: -1, Effect: ["Unlock-MistressPadlock"] },
			{ Name: "MetalCuffsKey", Wear: false, Value: 20, Effect: ["Unlock-MetalCuffs"], Time: 5 },
			{ Name: "WoodenMaidTray", Enable: false, Value: -1 },
			{ Name: "WoodenMaidTrayFull", Enable: false, Value: -1 },
			{ Name: "WoodenPaddle", Enable: false, Value: -1 }
		]
	},

	{
		Group: "ItemDevices",
		Category: "Item",
		Priority: 48,
		IsRestraint: true,
		Default: false,
		Color: ["Default"],
		Left: 0,
		Top: -250,
		Zone: [[25, 580, 75, 410], [400, 580, 75, 410]],
		Asset: [
			{ Name: "WoodenBox", RemoveAtLogin: true, Alpha: [[1, 80, 105, 900], [410, 80, 105, 900]], Effect: ["Prone", "Enclose", "BlindNormal", "GagLight", "Freeze"], Value: 60, Time: 15, RemoveTime: 10, Difficulty: -2, AllowLock: true, Prerequisite: "NotSuspended" },
			{ Name: "SmallWoodenBox", RemoveAtLogin: true, Alpha: [[1, 80, 75, 900], [400, 80, 95, 900]], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "BlindNormal", "GagLight", "Freeze"], Value: 40, Time: 15, RemoveTime: 10, Difficulty: -2, AllowLock: true, Prerequisite: "NotSuspendedOrHorsed" },
			{ Name: "MilkCan", RemoveAtLogin: true, Effect: ["BlindHeavy", "Prone", "Enclose", "GagHeavy", "Freeze"], SetPose: ["Kneel"], Value: -1, Time: 15, RemoveTime: 10, Difficulty: 1 },
			{ Name: "WaterCell", RemoveAtLogin: true, Effect: ["Prone", "Enclose", "GagHeavy", "Freeze"], SetPose: ["Suspension", "LegsClosed"], Block: ["ItemFeet"], Value: -1, Time: 15, RemoveTime: 15, Difficulty: 1 },
			{ Name: "Cage", RemoveAtLogin: true,  Alpha: [[1, 80, 105, 900], [410, 80, 105, 900]], Effect: ["Prone", "Enclose", "Freeze"], Value: 120, Time: 15, RemoveTime: 10, Difficulty: 4, AllowLock: true, Prerequisite: "NotKneeling" },
			{ Name: "LowCage", RemoveAtLogin: true, Alpha: [[1, 80, 75, 900], [400, 80, 95, 900]], SetPose: ["Kneel"], Effect: ["ForceKneel", "Prone", "Enclose", "Freeze"], Value: 80, Time: 15, RemoveTime: 10, Difficulty: 4, AllowLock: true, Prerequisite: "NotSuspendedOrHorsed" },
			{ Name: "SaddleStand", RemoveAtLogin: true, Height: 30, Value: 100, Time: 10, Difficulty: -2, AllowLock: false, SetPose: ["LegsOpen"], Prerequisite: "LegsOpen1", Block: ["ItemPelvis", "ItemLegs"], Effect: ["Prone", "Freeze", "Mounted"] },
			{ Name: "BurlapSack", SelfBondage: false, Priority : 29, Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots"], SetPose: ["Kneel", "BackElbowTouch"], Effect: ["ForceKneel", "Block", "Prone", "Freeze"], Hide: ["Cloth", "ClothLower", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "ItemArms", "ItemButt", "TailStraps", "Wings", "BodyLower", "Socks"], Difficulty: 5, Value: 35, Time: 15, RemoveTime: 6, Prerequisite: "NotSuspendedOrHorsed" },
			{ Name: "InflatableBodyBag", Priority: 32, Extended: true, SelfBondage: false, SelfUnlock: false, Block: ["ItemArms", "ItemBreast", "ItemButt", "ItemFeet", "ItemHands", "ItemLegs", "ItemMisc", "ItemNipples", "ItemNipplesPiercings", "ItemPelvis", "ItemTorso", "ItemVulva", "ItemVulvaPiercings", "ItemBoots"], SetPose: ["LegsClosed", "BackElbowTouch"], AllowPose: ["Kneel"], Effect: ["Block", "Prone", "Freeze"], Hide: ["Cloth", "ClothLower", "Shoes", "ItemBoots", "ItemLegs", "ItemFeet", "ItemArms", "ItemButt", "TailStraps", "Wings", "BodyLower", "Socks", "ItemNipplesPiercings"], AllowType: ["Light", "Inflated", "Bloated", "Max"], Difficulty: 1, Value: 225, Time: 30, RemoveTime: 50, AllowLock: true, Prerequisite: "NotSuspendedOrHorsed" },
			{ Name: "BondageBench", RemoveAtLogin: false, Priority: 1, Extended: true, SetPose: ["LegsClosed"], Effect: ["Block", "Prone", "Freeze"], Value: 250, Time: 10, RemoveTime: 10, Prerequisite: "NotKneeling" },
			{ Name: "TeddyBear", RemoveAtLogin: true, Priority: 33, IsRestraint: false, Extended: true, Difficulty: -10, Value: 50, Time: 5, Effect: [], AllowPose: ["TapedHands", "BackBoxTie", "BackCuffs", "BackElbowTouch", "Bolero", "Horse", "StraitDressOpen"], AllowType: ["Bear", "Fox", "Kitty", "Pup", "Bunny", "Pony"] },
			{ Name: "OneBarPrison", RemoveAtLogin: true, Priority: 17, Value: 75, Time: 20, Difficulty: 8, AllowLock: false, SetPose: ["LegsOpen"], Prerequisite: "OBP", Block: ["ItemPelvis", "ItemLegs", "ItemVulva", "ItemFeet"], Effect: ["Prone", "Freeze", "Mounted"],
				Layer: [
					{ Name: "Bar", AllowColorize: true },
					{ Name: "Pussy", AllowColorize: false }
				]
			},
			{ Name: "TheDisplayFrame", RemoveAtLogin: true, Value: 100, Time: 10, Difficulty: 50, Priority: 42, AllowLock: true, SetPose: ["LegsClosed", "BackElbowTouch"], Prerequisite: "DisplayFrame", Block: ["ItemArms", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNeckAccessories"], Effect: ["Prone", "Freeze", "Block"] },
			{ Name: "Sybian", RemoveAtLogin: true, IsRestraint: false, Value: 80, Time: 10, Difficulty: 1, Priority: 22, SetPose: ["KneelingSpread"], Prerequisite: "Sybian", Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemPelvis", "ItemButt", "ItemVulva"], Effect: ["Egged", "Freeze"], Hide: ["Shoes", "Socks", "ItemBoots", "ItemFeet", "ItemLegs", "ItemVulva"], HideItem: ["ClothLowerPajama1", "ClothLowerShorts1", "ClothLowerJeans1", "ClothLowerJeans2", "ClothLowerWaspie1", "ClothLowerWaspie2", "ClothLowerWaspie3", "ClothLowerLatexPants1", "ItemDevicesTeddyBear"] }
		
		]
	},
	
	{
		Group: "ItemAddon",
		Category: "Item",
		Priority: 49,
		IsRestraint: true,
		Default: false,
		Color: ["Default"],
		Left: 0,
		Top: -250,
		Zone: [[400, 35, 75, 210]],
		Asset: [
			{ Name: "BondageBenchStraps", RemoveAtLogin: false, IsRestraint: true, Extended: true, Block: ["ItemDevices"], AllowType: ["Light", "Normal", "Heavy", "Full"], Hide: ["HairBack", "Wings", "TailStraps", "ItemButt"], SelfBondage: false, AllowLock: true, Value: -1, SetPose: ["LegsClosed"], Effect: ["Block", "Prone"], Time: 5, Difficulty: 12 }
		]
	},

	{
		Group: "ItemBoots",
		Category: "Item",
		Priority: 23,
		ParentGroup: "BodyLower",
		Default: false,
		AllowPose: ["LegsClosed", "Kneel"],
		IsRestraint: true,
		Color: ["Default"],
		Left: 125,
		Top: 500,
		Zone: [[100, 870, 300, 120]],
		Asset: [
			{ Name: "PonyBoots", Height: 35, Value: -1, Time: 10, RemoveTime: 15, Difficulty: 6, AllowLock: true, Alpha: [[75, 800, 140, 200],[290, 800, 140, 200]], Hide: ["Shoes"] },
			{ Name: "BalletHeels", Height: 35, Value: 75, Time: 10, RemoveTime: 15, Difficulty: 6, AllowLock: true, Alpha: [[75, 770, 140, 200],[290, 770, 140, 200]], Hide: ["Shoes"] },
			{ Name: "BalletWedges", Height: 35, Value: 50, Time: 10, RemoveTime: 15, Difficulty: 6, AllowLock: true, Alpha: [[75, 810, 140, 200],[290, 810, 140, 200]], Hide: ["Shoes"] },
			{ Name: "ToeCuffs", Value: 35, Time: 10, RemoveTime: 5, Difficulty: 4, Effect: ["Freeze", "Prone"], SetPose: ["LegsClosed"], AllowLock: true, Hide: ["Shoes"], Prerequisite: "ToeTied" },
			{ Name: "LeatherToeCuffs", Value: 50, Time: 10, RemoveTime: 5, Difficulty: 3, Effect: ["Freeze", "Prone"], SetPose: ["LegsClosed"], AllowLock: true, Hide: ["Shoes"], Prerequisite: "ToeTied" },
			{ Name: "ToeTie", DefaultColor: "#605020", Value: 15, Time: 10, RemoveTime: 5, Difficulty: 2, Effect: ["Freeze", "Prone"], SetPose: ["LegsClosed"], Hide: ["Shoes"], Prerequisite: "ToeTied" }
		]
	}
	
];

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
			}
];
