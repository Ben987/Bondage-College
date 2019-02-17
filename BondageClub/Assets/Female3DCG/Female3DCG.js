// 3D Custom Girl based assets
var AssetFemale3DCG = [

	// Appearance specific
	{
		Group: "BodyUpper",
		Priority: 3,
		AllowNone: false,
		AllowColorize: false,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch"],
		Color: ["White", "Asian", "Black"],
		Asset: ["Small", "Normal", "Large", "XLarge"],
	},

	{
		Group: "BodyLower",
		Priority: 4,
		AllowNone: false,
		AllowColorize: false,
		ParentSize: "BodyUpper",
		ParentColor: "BodyUpper",
		AllowPose: ["LegsClosed", "Kneel"],
		Color: ["White", "Asian", "Black"],
		Top: 462,
		Asset: ["Small", "Normal", "Large", "XLarge"]
	},

	{
		Group: "Hands",
		Priority: 18,
		AllowNone: false,
		AllowColorize: false,
		ParentColor: "BodyUpper",
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch"],
		Color: ["White", "Asian", "Black"],
		Asset: ["Default"]
	},
	
	{
		Group: "Cloth",
		Priority: 23,
		ParentGroup: "BodyUpper",
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch"],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Asset: [ 
			{ Name: "CollegeOutfit1", Hide: ["ClothLower"], Value: -1 },
			{ Name: "MaidOutfit1", Hide: ["ClothLower"], Value: -1 },
			{ Name: "StudentOutfit1", Hide: ["ClothLower"] },
			{ Name: "StudentOutfit2", Hide: ["ClothLower"] },
			{ Name: "BabydollDress1", Hide: ["ClothLower"] },
			{ Name: "TeacherOutfit1", Hide: ["ClothLower"] },
			{ Name: "ChineseDress1", Hide: ["ClothLower"] },
			{ Name: "ChineseDress2", Value: 100 },
			{ Name: "TShirt1", Require: ["ClothLower"] },
			{ Name: "TennisShirt1", Require: ["ClothLower"] },
			{ Name: "Sweater1", Require: ["ClothLower"] },
			{ Name: "MistressTop", Require: ["ClothLower"], Hide: ["Bra"], Value: -1 }
		]
	},
	
	{
		Group: "ClothLower",
		Priority: 17,
		Default: false,
		ParentGroup: "BodyLower",
		ParentColor: "Cloth",
		AllowPose: ["LegsClosed", "Kneel"],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 125,
		Top: 400,
		Asset: [
			{ Name: "Skirt1" },
			{ Name: "TennisSkirt1", ParentItem: "TennisShirt1" },
			{ Name: "Jeans1" },
			{ Name: "Shorts1" },
			{ Name: "MistressBottom", Hide: ["Panties"], Value: -1 }
		]
	},
	 
	{
		Group: "HairBack",
		Priority: 2,
		AllowNone: false,
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"],
		AllowPose: ["Suspension"],
		Left: 50,
		Top: 0,
		Asset: ["HairNone", "HairBack1", "HairBack2", "HairBack4", "HairBack10", "HairBack14", "HairBack15", "HairBack16", "HairBack17", "HairBack18", "HairBack19"]
	},

	{
		Group: "HairFront",
		Priority: 28,
		AllowNone: false,
		ParentColor: "HairBack",
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"],
		Left: 150,
		Top: 50,
		Asset: ["HairFront1", "HairFront2", "HairFront3", "HairFront4", "HairFront5", "HairFront6", "HairFront7", "HairFront8", "HairFront9", "HairFront10", "HairFront11", "HairFront12"]
	},

	{
		Group: "Hat",
		Priority: 29,
		Default: false,
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		AllowPose: ["Suspension"],
		Left: 125,
		Top: 0,
		Asset: ["Band1", "Beret1", "Ears1", "Ears2", { Name: "MaidHairband1", Value: -1 }, { Name: "Santa1", Value: 30 }]
	},

	{
		Group: "Eyes",
		Priority: 5,
		AllowNone: false,
		Color: ["#6a3628", "#5e481e", "#666666", "#555588", "#558855", "#885555", "#202020", "#aa3333", "#33aa33", "#3333aa", "#aaaa33", "#33aaaa", "#aa33aa"],
		Left: 200,
		Top: 150,
		FullAlpha: false,
		Blink: true,
		Asset: ["Eyes1", "Eyes2", "Eyes3", "Eyes4", "Eyes5", "Eyes6", "Eyes7", "Eyes8", "Eyes9", "Eyes10", "Eyes11"]
	},
	
	{
		Group: "Glasses",
		Priority: 25,
		Default: false,
		Underwear: true,
		Color: ["#303030", "#808080", "#e0e0e0", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 200,
		Top: 135,
		Asset: ["Glasses1", "Glasses2", "Glasses3", "Glasses4", "Glasses5", "Glasses6", { Name: "SunGlasses1", Value: 20 }, { Name: "SunGlasses2", Value: 20 }]
	},

	{
		Group: "Mouth",
		Priority: 6,
		AllowNone: false,
		Color: ["Default", "#803d26", "#aa5555", "#cc3333", "#55aa55", "#5555aa", "#55aaaa", "#aa55aa", "#aaaa55"],
		Left: 240,
		Top: 190,
		Asset: ["Mouth1", "Mouth2", "Mouth3", "Mouth4"]
	},
	
	{
		Group: "Nipples",
		Priority: 7,
		ParentGroup: "BodyUpper",
		Default: false,
		Color: ["Default", "#a6665b", "#803d26", "#d68777", "#9b4a2e", "#bb6655"],
		Left: 175,
		Top: 285,
		Asset: ["Nipples1", "Nipples2"]
	},
	
	{
		Group: "Bra",
		Priority: 13,
		ParentGroup: "BodyUpper",
		Underwear: true,
		Color: ["#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 150,
		Top: 200,
		Asset: ["Bra1", "Bra2", "Bra7"]
	},
	
	{
		Group: "Gloves",
		Priority: 22,
		ParentGroup: "BodyUpper",
		ParentColor: "Bra",
		Underwear: true,
		Default: false,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch"],
		Color: ["#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 75,
		Top: 275,
		Asset: ["Gloves1", "Gloves2", { Name: "MistressGloves", Value: -1 }]
	},

	{
		Group: "Pussy",
		Priority: 9,
		AllowNone: false,
		Color: ["Default", "#6a3628", "#443330", "#222222"],
		Left: 225,
		Top: 500,
		FullAlpha: false,
		Asset: ["PussyLight1", "PussyLight2", "PussyLight3", "PussyDark1", "PussyDark2", "PussyDark3"]
	},
	
	{
		Group: "Panties",
		Priority: 12,
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Underwear: true,
		Color: ["#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 150,
		Top: 425,
		Asset: ["Panties1", "Panties7", "Panties8", "Panties11"]
	},

	{
		Group: "Socks",
		Priority: 16,
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Underwear: true,
		AllowPose: ["LegsClosed", "Kneel"],
		Color: ["#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 125,
		Top: 500,
		Asset: ["Socks1", "Socks2", "Socks3", "Socks4", "Socks5", "Stockings1", "Stockings2"]
	},

	{
		Group: "Shoes",
		Priority: 19,
		ParentGroup: "BodyLower",
		AllowPose: ["LegsClosed"],
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
			{ Name: "MistressBoots", Height: 35, Value: -1, Hide: ["Socks"], Alpha: [[125, 800, 250, 200]] }
		]
	},

	// Item specific
	{
		Group: "ItemFeet",
		Category: "Item",
		Priority: 21,
		ParentGroup: "BodyLower",
		Default: false,
		Effect: ["Freeze", "Prone"],
		Color: ["Default"],
		SetPose: ["LegsClosed"],
		Left: 125,
		Top: 725,
		Zone: [[100, 750, 300, 240]],
		Asset: [ 
			{ Name: "NylonRope", Value: 15, Time: 10 },
			{ Name: "HempRope", Value: 30, Time: 10, RemoveTime: 15, Difficulty: 2 },
			{ Name: "LeatherBelt", Value: 25, Time: 5 },
			{ Name: "SuspensionHempRope", SelfBondage: false, Random: false, RemoveAtLogin: true, SetPose: ["Suspension", "LegsClosed"], Effect: ["Freeze", "Prone", "Struggle"], Value: -1, Height: 150, Time: 30, Difficulty: 2 }
		]
	},

	{
		Group: "ItemLegs",
		Category: "Item",
		Priority: 20,
		ParentGroup: "BodyLower",
		Default: false,
		Effect: ["Prone"],
		Color: ["Default"],
		SetPose: ["LegsClosed"],
		AllowPose: ["Kneel"],
		Left: 125,
		Top: 500,
		Zone: [[100, 580, 300, 170]],
		Asset: [ 
			{ Name: "NylonRope", Value: 15, Time: 10 },
			{ Name: "HempRope", Value: 30, Time: 10, RemoveTime: 15, Difficulty: 2 },
			{ Name: "LeatherBelt", Value: 25, Time: 5 }
		]
	},

	{
		Group: "ItemVulva",
		Category: "Item",
		Priority: 10,
		Default: false,
		Color: ["Default"],
		Left: 125,
		Top: 400,
		Zone: [[100, 500, 150, 80]],
		Asset: [
			{ Name: "VibratingEgg", Value: 25, Prerequisite: "AccessVulva", Time: 5 },
			{ Name: "VibratingWand", Wear: false, Value: 60, Prerequisite: "AccessVulva", Bonus: [{Type: "KidnapManipulation", Factor: 3}] }
		]
	},

	{
		Group: "ItemButt",
		Category: "Item",
		Priority: 1,
		Default: false,
		Color: ["Default"],
		Left: 0,
		Top: 150,
		Zone: [[250, 500, 150, 80]],
		Asset: [
			{ Name: "BlackButtPlug", Value: 20, Prerequisite: "AccessVulva", Time: 10 },
			{ Name: "TailButtPlug", Value: 50, Prerequisite: "AccessVulva", Time: 10 },
			{ Name: "HorsetailPlug", Value: 50, Prerequisite: "AccessVulva", Time: 10 }
		]
	},

	{
		Group: "ItemPelvis",
		Category: "Item",
		Priority: 11,
		Default: false,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch"],
		Color: ["Default"],
		Left: 125,
		Top: 375,
		Zone: [[150, 420, 200, 80]],
		Asset: [
			{ Name: "MetalChastityBelt", Effect: ["Chaste", "Lock"], Block: ["ItemVulva", "ItemButt"], Value: 100, Prerequisite: "AccessVulva", Time: 20, RemoveTime: 10 },
			{ Name: "LeatherCrop", Value: 40, Wear: false, BuyGroup: "LeatherCrop", Bonus: [{Type: "KidnapDomination", Factor: 3}] },
			{ Name: "LeatherWhip", Value: 60, Wear: false, BuyGroup: "LeatherWhip", Bonus: [{Type: "KidnapBruteForce", Factor: 3}] }
		]
	},
	
	{
		Group: "ItemTorso",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 15,
		Default: false,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch"],
		Color: ["Default"],
		Left: 125,
		Top: 200,
		Zone: [[150, 340, 200, 80]],
		Asset: [ 
			{ Name: "NylonRopeHarness", Value: 25, Prerequisite: "AccessTorso", Time: 25 },
			{ Name: "HempRopeHarness", Value: 50, Prerequisite: "AccessTorso", Time: 25, RemoveTime: 35, Difficulty: 2 },
			{ Name: "LeatherHarness", Value: 100, Prerequisite: "AccessTorso", Time: 15, RemoveTime: 10 }
		]
	},

	{
		Group: "ItemBreast",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 8,
		Default: false,
		Color: ["Default"],
		Left: 150,
		Top: 200,
		Zone: [[150, 260, 200, 80]],
		Asset: [
			{ Name: "StraightPiercing", Value: 10, Prerequisite: "AccessBreast", Time: 15 },
			{ Name: "RoundPiercing", Value: 20, Prerequisite: "AccessBreast", Time: 15 },
			{ Name: "NippleClamp", Value: 35, Prerequisite: "AccessBreast", Time: 10 },
			{ Name: "MetalChastityBra", Value: 75, Effect: ["Lock", "BreastChaste"], Prerequisite: "AccessBreast", Time: 15 },
			{ Name: "LeatherCrop", Value: 40, Wear: false, BuyGroup: "LeatherCrop", Bonus: [{Type: "KidnapDomination", Factor: 3}] },
			{ Name: "LeatherWhip", Value: 60, Wear: false, BuyGroup: "LeatherWhip", Bonus: [{Type: "KidnapBruteForce", Factor: 3}] }
		]
	},
	
	{
		Group: "ItemArms",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 24,
		Default: false,
		Color: ["Default"],
		Left: 125,		
		Top: 200,
		Zone: [[50, 250, 100, 250], [350, 250, 100, 250]],
		Asset: [ 
			{ Name: "NylonRope", SelfBondage: false, Value: 15, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone", "Struggle"], Time: 15 },
			{ Name: "HempRope", SelfBondage: false, Value: 30, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone", "Struggle"], Time: 20, Difficulty: 2 },
			{ Name: "MetalCuffs", Priority: 22, Value: 50, SetPose: ["BackCuffs"], Effect: ["Block", "Prone", "Lock"], Time: 5 },
			{ Name: "MetalCuffsKey", Wear: false, Value: 25, Effect: ["Unlock-MetalCuffs"], Time: 5 },
			{ Name: "LeatherArmbinder", SelfBondage: false, Priority: 2, Value: 80, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone", "Struggle"], Time: 25, RemoveTime: 10, Difficulty: 10 }
		]
	},

	{
		Group: "ItemNeck",
		Category: "Item",
		Priority: 14,
		Default: false,
		Color: ["Default"],
		Left: 200,
		Top: 190,
		Zone: [[150, 210, 200, 50]],
		Asset: [ 
			{ Name: "LeatherCollar", Value: 40, Time: 5 },
			{ Name: "SlaveCollar", Random: false, Effect: ["Lock"], Enable: true, Value: -1, Time: 5 }
		]
	},
	
	{
		Group: "ItemMouth",
		Category: "Item",
		Priority: 26,
		Default: false,
		Effect: ["GagNormal"],
		Color: ["Default"],
		Left: 150,
		Top: 50,
		Zone: [[150, 160, 200, 50]],
		Asset: [ 
			{ Name: "SmallClothGag", Effect: ["GagLight"], Value: 10, Time: 10 },
			{ Name: "ClothCleaveGag", Effect: ["GagLight"], Value: 15, Time: 10 },
			{ Name: "ClothOTMGag", Value: 20, Time: 10 },
			{ Name: "ClothOTNGag", Value: 25, Time: 10 },
			{ Name: "HarnessBallGag", Effect: ["GagHeavy"], Value: 60, Time: 20 },
			{ Name: "HarnessPanelGag", Effect: ["GagHeavy"], Value: 80, Time: 20 },
			{ Name: "RingGag", Value: 35, Time: 5 },
			{ Name: "DuctTapeGag", Value: 20, Time: 5, RemoveTime: 2 },
			{ Name: "DusterGag", Random: false, RemoveAtLogin: true, Value: -1, Time: 20 },
			{ Name: "RegularSleepingPill", Enable: false, Wear: false, Value: -1, Bonus: [{Type: "KidnapSneakiness", Factor: 3}] }
		]
	},

	{
		Group: "ItemHead",
		Category: "Item",
		Priority: 27,
		Default: false,
		Color: ["Default"],
		Left: 150,
		Top: 50,
		Zone: [[150, 35, 200, 125]],
		Asset: [ 
			{ Name: "ClothBlindfold", Effect: ["BlindLight", "Prone"], Hide: ["Glasses"], Value: 20, Time: 5 },
			{ Name: "LeatherBlindfold", Effect: ["BlindNormal", "Prone"], Hide: ["Glasses"], Value: 40, Time: 5 },
			{ Name: "LeatherHood", Effect: ["BlindHeavy", "Prone", "GagLight"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "Eyes"], Block: ["ItemMouth", "ItemNeck"], Value: 90, Time: 15 },
			{ Name: "LeatherHoodOpenEyes", Effect: ["Prone", "GagLight"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth"], Block: ["ItemMouth", "ItemNeck"], Value: 60, Time: 15 }
		]
	},

	{
		Group: "ItemMisc",
		Category: "Item",
		Priority: 30,
		Default: false,
		Color: ["Default"],
		Asset: [ 
			{ Name: "WoodenMaidTray", Enable: false, Value: -1 },
			{ Name: "WoodenMaidTrayFull", Enable: false, Value: -1 },
			{ Name: "WoodenPaddle", Enable: false, Value: -1 },
		]
	}

];

// 3D Custom Girl based pose
var PoseFemale3DCG = [

	{
		Name: "Kneel",
		OverrideHeight: -250,
		Hide: ["Shoes", "ItemFeet"]
	}

];