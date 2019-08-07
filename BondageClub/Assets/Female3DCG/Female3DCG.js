// 3D Custom Girl based assets
var AssetFemale3DCG = [

	// Appearance specific
	{
		Group: "Cloth",
		Priority: 27,
		ParentGroup: "BodyUpper",
		Clothing: true,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "TapedHands"],
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Asset: [ 
			{ Name: "CollegeOutfit1", Hide: ["ClothLower", "ItemNeck"], Value: -1 },
			{ Name: "MaidOutfit1", Hide: ["ClothLower"], Value: -1 },
			{ Name: "MaidOutfit2", Hide: ["ClothLower"], Value: -1, Expose: ["ItemNipples", "ItemBreast"] },
			{ Name: "StudentOutfit1", Hide: ["ClothLower", "ItemNeck"] },
			{ Name: "StudentOutfit2", Hide: ["ClothLower"], HideItem: ["ItemArmsLeatherCuffs"] },
			{ Name: "BabydollDress1", Hide: ["ClothLower"] },
			{ Name: "TeacherOutfit1", Hide: ["ClothLower", "ItemNeck"], HideItem: ["ItemArmsLeatherCuffs"] },
			{ Name: "ChineseDress1", Hide: ["ClothLower"] },
			{ Name: "ChineseDress2", Value: 100 },
			{ Name: "TShirt1", Require: ["ClothLower"] },
			{ Name: "TennisShirt1", Require: ["ClothLower"] },
			{ Name: "Sweater1", Require: ["ClothLower"], HideItem: ["ItemArmsLeatherCuffs"] },
			{ Name: "MistressTop", Require: ["ClothLower"], Hide: ["Bra"], Value: -1 },
			{ Name: "AdultBabyDress1", Hide: ["ClothLower"], Value: 200 },
			{ Name: "AdultBabyDress2", Hide: ["ClothLower"], Value: 200 },
			{ Name: "AdultBabyDress3", Hide: ["ClothLower"], Value: 200 },
			{ Name: "NurseUniform", Hide: ["ClothLower"], Value: -1 },
			{ Name: "BunnyCollarCuffs", Value: 10 , Expose: ["ItemNipples", "ItemBreast", "ItemTorso"]},
			{ Name: "Robe1", Value: 50 }
		]
	},
	
	{
		Group: "ClothLower",
		Priority: 21,
		Default: false,
		ParentGroup: "BodyLower",
		ParentColor: "Cloth",
		Clothing: true,
		AllowPose: ["LegsClosed", "Kneel"],
		Color: ["Default", "#bbbbbb", "#808080", "#202020", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 125,
		Top: 400,
		Asset: [
			{ Name: "Skirt1", Expose: ["ItemVulva", "ItemButt"] },
			{ Name: "TennisSkirt1", ParentItem: "TennisShirt1", Expose: ["ItemVulva", "ItemButt"] },
			{ Name: "Jeans1" },
			{ Name: "Shorts1" },
			{ Name: "MistressBottom", Hide: ["Panties"], Value: -1 }
		]
	},
	
	{
		Group: "Bra",
		Priority: 17,
		ParentGroup: "BodyUpper",
		Clothing: true,
		Underwear: true,
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 150,
		Top: 200,
		Asset: [
			{ Name: "Bra1", Hide: ["ItemNipples"] },
			{ Name: "Bra2", Hide: ["ItemNipples"] },
			{ Name: "Bra7", Hide: ["ItemNipples"] },
			{ Name: "Bra8", Value: 15, Hide: ["ItemNipples"] },
			{ Name: "Bra9", Value: 15, Hide: ["ItemNipples"] },
			{ Name: "Bustier1", Value: 30, Hide: ["ItemNipples"] },
			{ Name: "Corset1", Value: 30, Hide: ["ItemNipples"] },
			{ Name: "Corset2", Value: 30, Hide: ["ItemNipples"] },
			{ Name: "Corset3", Value: 30, Hide: ["ItemNipples"] },
			{ Name: "Corset4", Value: 30, Expose: ["ItemNipples", "ItemBreast"]},
			{ Name: "Swimsuit1", Value: 20, Hide: ["Panties", "ItemNipples"] },
			{ Name: "Swimsuit2", Value: 25, Hide: ["Panties", "ItemNipples"] },
			{ Name: "BunnySuit", Value: 30, Hide: ["Panties", "ItemNipples"] }
		]
	},
	
	{
		Group: "Panties",
		Priority: 16,
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Clothing: true,
		Underwear: true,
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 150,
		Top: 425,
		Asset: [
			{ Name: "Panties1" },
			{ Name: "Panties7" },
			{ Name: "Panties8" },
			{ Name: "Panties11" },
			{ Name: "Panties12", Value: 10 },
			{ Name: "Panties13", Value: 10 },
			{ Name: "Panties14", Value: 10 },
			{ Name: "Panties15", Value: 10 },
			{ Name: "Diapers1", Value: 50 }
		]
	},
	
	{
		Group: "Socks",
		Priority: 20,
		ParentGroup: "BodyLower",
		ParentColor: "Bra",
		Clothing: true,
		Underwear: true,
		AllowPose: ["LegsClosed", "Kneel"],
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 125,
		Top: 400,
		Asset: [
			"Socks1", "Socks2", "Socks3", "Socks4", "Socks5", "Stockings1", "Stockings2",
			{ Name: "Stockings3", Value: 10 },
			{ Name: "Stockings4", Value: 10 },
			{ Name: "Pantyhose1", Value: 10, Priority: 16, Block: ["ItemVulva", "ItemButt"]}
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
			{ Name: "MistressBoots", Height: 35, Value: -1, Hide: ["Socks"], Alpha: [[125, 800, 250, 200]] },
			{ Name: "PonyBoots", Height: 35, Value: -1, Hide: ["Socks"], Alpha: [[125, 800, 250, 200]] }
		]
	},
	
	{
		Group: "Hat",
		Priority: 35,
		Default: false,
		Clothing: true,
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		AllowPose: ["Suspension"],
		Left: 125,
		Top: 0,
		Asset: [
			"Band1", "Beret1",
			{ Name: "Ribbons1", Priority: 3 },
			{ Name: "GiantBow1", Priority: 3 },
			{ Name: "MaidHairband1", Value: -1 },
			{ Name: "NurseCap", Value: -1 },
			{ Name: "Santa1", Value: 30 },
			{ Name: "CaptainHat1", Value: 20 },
			{ Name: "BunnySuccubus2", Value: 50 },
			{ Name: "HairFlower1",  Value: 10 }
		]
	},

	{
		Group: "HairAccessory",
		Priority: 34,
		Default: false,
		Clothing: true,
		Color: ["Default", "#202020", "#808080", "#bbbbbb", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		AllowPose: ["Suspension"],
		Left: 90,
		Top: 0,
		Asset: [
			"Ears1", "Ears2", "PonyEars1",
			{ Name: "BunnyEars1", Value: 20 },
			{ Name: "BunnyEars2", Value: 20 },
			{ Name: "PuppyEars1", Value: 20, Priority: 30 },
			{ Name: "SuccubusHorns", Value: 20 },
			{ Name: "Horns", Value: 20 },
			{ Name: "Horns2", Value: 20 },
			{ Name: "Horns3", Value: 20 },
			{ Name: "FoxEars1", Value: 20 },
			{ Name: "BatWings", Value: 20 },
			{ Name: "KittyMask1", Hide: ["HairFront", "Glasses"], Value: 20 }
		]
	},		

	{
		Group: "Gloves",
		Priority: 26,
		ParentGroup: "BodyUpper",
		ParentColor: "Bra",
		Clothing: true,
		Underwear: true,
		Default: false,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch"],
		Color: ["#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 75,
		Top: 275,
		Asset: ["Gloves1", "Gloves2", { Name: "MistressGloves", Value: -1 }]
	},
	
	{
		Group: "Glasses",
		Priority: 29,
		Default: false,
		Clothing: true,
		Underwear: true,
		Color: ["#303030", "#808080", "#e0e0e0", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 200,
		Top: 135,
		Asset: ["Glasses1", "Glasses2", "Glasses3", "Glasses4", "Glasses5", "Glasses6", { Name: "SunGlasses1", Value: 20 }, { Name: "SunGlasses2", Value: 20 },{ Name: "Mask1", Value: 20 }, { Name: "Mask2", Value: 20 }],
	},
	
	{
		Group: "TailStraps",
		Priority: 3,
		Default: false,
		Clothing: true,
		Underwear: true,
		Color: ["Default", "#cccccc", "#aaaaaa", "#888888", "#666666", "#444444", "#222222", "#aa8080", "#80aa80", "#8080aa", "#aaaa80", "#80aaaa", "#aa80aa", "#cc3333", "#33cc33", "#3333cc", "#cccc33", "#33cccc", "#cc33cc"],
		Left: 0,
		Top: 150,
		Zone: [[250, 500, 150, 80]],
		Asset: [
		    { Name: "TailStrap",  Value: 30 },
		    { Name: "HorseTailStrap",  Value: 30 }, 
		    { Name: "FoxTailsStrap",  Value: 30 },
		    { Name: "PuppyTailStrap",  Value: 30 },
		    { Name: "SuccubusStrap",  Value: 30 },
		    { Name: "SuccubusTailStrap",  Value: 30 },
		    { Name: "RaccoonStrap",  Value: 30 },
		    { Name: "RaccoonTailStrap",  Value: 30 }
		]
	},

	{
		Group: "Wings",
		Priority: 1,
		ParentColor: "Bra",
		Default: false,
		Clothing: true,
		Underwear: true,
		Color: ["Default"],
		Asset: [
			{ Name: "SuccubusFeather", Value: 100 },
			{ Name: "SuccubusWings", Value: 100 },
			{ Name: "AngelFeather", Value: 100 },
			{ Name: "DevilWings", Value: 100 },
			{ Name: "FallenAngelWings", Value: 100 },
			{ Name: "AngelWings", Value: 100 },
			{ Name: "BatWings", Value: 100 }
		]
	},

	{
		Group: "BodyUpper",
		Priority: 5,
		AllowNone: false,
		AllowColorize: false,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "TapedHands"],
		Color: ["White", "Asian", "Black"],
		Asset: ["Small", "Normal", "Large", "XLarge"],
	},

	{
		Group: "BodyLower",
		Priority: 6,
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
		Priority: 22,
		AllowNone: false,
		AllowColorize: false,
		ParentColor: "BodyUpper",
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "TapedHands"],
		Color: ["White", "Asian", "Black"],
		Asset: ["Default"]
	},
	 
	{
		Group: "HairBack",
		Priority: 4,
		AllowNone: false,
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"],
		AllowPose: ["Suspension"],
		Left: 50,
		Top: 0,
		Asset: ["HairNone", "HairBack1", "HairBack2", "HairBack4", "HairBack10", "HairBack14", "HairBack15", "HairBack16", "HairBack17", "HairBack18", "HairBack19"]
	},

	{
		Group: "HairFront",
		Priority: 33,
		AllowNone: false,
		ParentColor: "HairBack",
		Color: ["#6a3628", "#202020", "#dcc787", "#6c2132", "#999999", "#dddddd", "#e781b1", "#81e7b1", "#81b1e7", "#eeee99", "#ee9999", "#ee99ee"],
		Left: 150,
		Top: 50,
		Asset: ["HairFront1", "HairFront2", "HairFront3", "HairFront4", "HairFront5", "HairFront6", "HairFront7", "HairFront8", "HairFront9", "HairFront10", "HairFront11", "HairFront12"]
	},

	{
		Group: "Eyes",
		Priority: 8,
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
		ParentGroup: "BodyUpper",
		Default: false,
		Color: ["Default", "#a6665b", "#803d26", "#d68777", "#9b4a2e", "#bb6655"],
		Left: 175,
		Top: 285,
		Asset: ["Nipples1", "Nipples2"]
	},

	{
		Group: "Pussy",
		Priority: 13,
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
		Priority: 7,
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
		Priority: 25,
		ParentGroup: "BodyLower",
		Default: false,
		IsRestraint: true,
		Effect: ["Freeze", "Prone"],
		Color: ["Default"],
		SetPose: ["LegsClosed"],
		Left: 125,
		Top: 725,
		Zone: [[100, 750, 300, 240]],
		Asset: [ 
			{ Name: "NylonRope", Value: 15, Time: 15 },
			{ Name: "HempRope", Value: 30, Time: 15, Difficulty: 3 },
			{ Name: "LeatherBelt", Value: 25, Time: 10, RemoveTime: 5, AllowLock: true },
			{ Name: "SuspensionHempRope", SelfBondage: false, Random: false, RemoveAtLogin: true, SetPose: ["Suspension", "LegsClosed"], Effect: ["Freeze", "Prone"], Value: -1, Height: 150, Time: 30, Difficulty: 3, Alpha: [[125, 850, 250, 150]], ExpressionTrigger: [{Group: "Blush", Name: "High", Timer: 30}, {Group: "Eyebrows", Name: "Raised", Timer: 10}], Prerequisite: "NotChained" },
			{ Name: "DuctTape", Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape" },
			{ Name: "MermaidRopeTie", Value: 30, Time: 15, Difficulty: 3 }
		]
	},

	{
		Group: "ItemLegs",
		Category: "Item",
		Priority: 24,
		ParentGroup: "BodyLower",
		Default: false,
		IsRestraint: true,
		Effect: ["Prone", "KneelFreeze"],
		Color: ["Default"],
		SetPose: ["LegsClosed"],
		AllowPose: ["Kneel"],
		Left: 125,
		Top: 500,
		Zone: [[100, 580, 300, 170]],
		Asset: [ 
			{ Name: "NylonRope", Value: 15, Time: 10 },
			{ Name: "HempRope", Value: 30, Time: 10, RemoveTime: 15, Difficulty: 3 },
			{ Name: "LeatherBelt", Value: 25, Time: 5, AllowLock: true },
			{ Name: "DuctTape", Value: 50, Time: 15, RemoveTime: 10, BuyGroup: "DuctTape" }
		]
	},

	{
		Group: "ItemVulva",
		Category: "Item",
		Priority: 14,
		Default: false,
		Color: ["Default"],
		Left: 125,
		Top: 400,
		Zone: [[100, 500, 150, 80]],
		Asset: [
			{ Name: "VibratingEgg", Effect: ["Egged"], Value: 25, Prerequisite: "AccessVulva", Time: 5, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}], AllowEffect: ["Egged", "Vibrating"], Visible: false },
			{ Name: "VibratingWand", Wear: false, Value: 60, Prerequisite: "AccessVulva", Bonus: [{Type: "KidnapManipulation", Factor: 3}], ExpressionTrigger: [{Group: "Blush", Name: "Medium", Timer: 10}, {Group: "Eyes", Name: "Closed", Timer: 5}], Visible: false },
			{ Name: "VibratorRemote", Effect: ["Remote"], Wear: false, Value: 80, BuyGroup: "VibratorRemote", Visible: false },
			{ Name: "VibratingLatexPanties", Effect: ["Egged", "Chaste"], Block: ["ItemButt"], Value: 65, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}], AllowLock: true, AllowEffect: ["Egged", "Vibrating"]}
		]
	},

	{
		Group: "ItemButt",
		Category: "Item",
		Priority: 2,
		Default: false,
		Color: ["Default"],
		Left: 0,
		Top: 150,
		Zone: [[250, 500, 150, 80]],
		Asset: [
			{ Name: "BlackButtPlug", Value: 20, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}], Visible: false },
			{ Name: "TailButtPlug", Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}] },
			{ Name: "HorsetailPlug", Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}] },
			{ Name: "PuppyTailPlug", Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}] },
			{ Name: "SuccubusButtPlug", Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}] },
			{ Name: "SuccubusButtPlug2", Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}] },
			{ Name: "FoxTails", Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}] },
			{ Name: "RaccoonButtPlug", Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}] },
			{ Name: "RaccoonTailPlug", Value: 50, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}] },
			{ Name: "AnalBeads", Value: 20, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}], Visible: false },
			{ Name: "ButtPump", Effect: [], Value: 35, Extended: true, Prerequisite: "AccessVulva", Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}], Visible: false }
		]
	},

	{
		Group: "ItemPelvis",
		Category: "Item",
		Priority: 15,
		Default: false,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "TapedHands"],
		Color: ["Default"],
		Left: 125,
		Top: 375,
		Zone: [[150, 420, 200, 80]],
		Asset: [
			{ Name: "MetalChastityBelt", Effect: ["Chaste", "Lock"], Block: ["ItemVulva", "ItemButt"], Value: 100, Prerequisite: "AccessVulva", Difficulty: 50, Time: 20, RemoveTime: 10, ExpressionTrigger: [{Group: "Eyebrows", Name: "Soft", Timer: 10}] },
			{ Name: "MetalChastityBeltKey", Wear: false, Value: -1, Effect: ["Unlock-MetalChastityBelt"], Prerequisite: "AccessVulva", Time: 5 },
			{ Name: "LeatherCrop", Value: 40, Wear: false, BuyGroup: "LeatherCrop", Bonus: [{Type: "KidnapDomination", Factor: 3}], ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}, {Group: "Eyebrows", Name: "Soft", Timer: 10}] },
			{ Name: "LeatherWhip", Value: 60, Wear: false, BuyGroup: "LeatherWhip", Bonus: [{Type: "KidnapBruteForce", Factor: 3}], ExpressionTrigger: [{Group: "Blush", Name: "Medium", Timer: 10}, {Group: "Eyebrows", Name: "Soft", Timer: 10}] },
			{ Name: "StraponPanties", Effect: ["Chaste"], Block: ["ItemVulva", "ItemButt"], Value: 50, Prerequisite: "AccessVulva", Time: 15 }
		]
	},
	
	{
		Group: "ItemTorso",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 18,
		Default: false,
		AllowPose: ["BackBoxTie", "BackCuffs", "BackElbowTouch", "TapedHands"],
		Color: ["Default"],
		Left: 125,
		Top: 200,
		Zone: [[150, 340, 200, 80]],
		Asset: [ 
			{ Name: "NylonRopeHarness", Value: 25, Prerequisite: "AccessTorso", Time: 25 }, 
			{ Name: "HempRopeHarness", Value: 50, Prerequisite: "AccessTorso", Time: 25, RemoveTime: 35, Difficulty: 3 },
			{ Name: "LeatherHarness", Value: 100, Prerequisite: "AccessTorso", Time: 15, RemoveTime: 10, Difficulty: 50, AllowLock: true },
			{ Name: "AdultBabyHarness", Value: 80, Priority: 28, Time: 15, RemoveTime: 10, Difficulty: 3, AllowLock: true, ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}] }
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
		Zone: [[150, 260, 100, 80]],
		Asset: [
			{ Name: "StraightPiercing", Value: 10, Prerequisite: "AccessBreast", Time: 15, ExpressionTrigger: [{Group: "Eyes", Name: "Closed", Timer: 5}, {Group: "Eyebrows", Name: "Angry", Timer: 5}] },
			{ Name: "RoundPiercing", Value: 20, Prerequisite: "AccessBreast", Time: 15, ExpressionTrigger: [{Group: "Eyes", Name: "Closed", Timer: 5}, {Group: "Eyebrows", Name: "Angry", Timer: 5}] },
			{ Name: "NippleClamp", Value: 35, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{Group: "Eyes", Name: "Closed", Timer: 5}, {Group: "Eyebrows", Name: "Angry", Timer: 5}] },
			{ Name: "VibeNippleClamp", Value: 50, Effect: ["Egged"], Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{Group: "Eyes", Name: "Closed", Timer: 5}, {Group: "Eyebrows", Name: "Angry", Timer: 5}], AllowEffect: ["Egged", "Vibrating"] },
			{ Name: "VibratorRemote", Value: 80, Effect: ["Remote"], Wear: false, BuyGroup: "VibratorRemote" },
			{ Name: "WeightedPiercing", Value: 35, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{Group: "Eyes", Name: "Closed", Timer: 5}, {Group: "Eyebrows", Name: "Soft", Timer: 5}] },
			{ Name: "ChainClamp", Value: 35, Prerequisite: "AccessBreast", Time: 10, ExpressionTrigger: [{Group: "Eyes", Name: "Closed", Timer: 5}, {Group: "Eyebrows", Name: "Soft", Timer: 5}] }
		]
	},

	{
		Group: "ItemBreast",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 12,
		Default: false,
		Color: ["Default"],
		Left: 150,
		Top: 200,
		Zone: [[250, 260, 100, 80]],
		Asset: [
			{ Name: "MetalChastityBra", Value: 75, Effect: ["Lock", "BreastChaste"], Block: ["ItemNipples"], Hide: ["ItemNipples"], Prerequisite: "AccessBreast", Time: 15, Difficulty: 50, ExpressionTrigger: [{Group: "Eyebrows", Name: "Soft", Timer: 10}] },
			{ Name: "MetalChastityBraKey", Wear: false, Value: -1, Effect: ["Unlock-MetalChastityBra"], Prerequisite: "AccessBreast", Time: 5 },
			{ Name: "LeatherCrop", Value: 40, Wear: false, BuyGroup: "LeatherCrop", Bonus: [{Type: "KidnapDomination", Factor: 3}], ExpressionTrigger: [{Group: "Blush", Name: "Low", Timer: 10}, {Group: "Eyebrows", Name: "Soft", Timer: 10}] },
			{ Name: "LeatherWhip", Value: 60, Wear: false, BuyGroup: "LeatherWhip", Bonus: [{Type: "KidnapBruteForce", Factor: 3}], ExpressionTrigger: [{Group: "Blush", Name: "Medium", Timer: 10}, {Group: "Eyebrows", Name: "Soft", Timer: 10}] }
		]
	},
	
	{
		Group: "ItemArms",
		ParentGroup: "BodyUpper",
		Category: "Item",
		Priority: 28,
		Default: false,
		IsRestraint: true,
		Color: ["Default"],
		Left: 125,		
		Top: 200,
		Zone: [[50, 250, 100, 250], [350, 250, 100, 250]],
		Asset: [ 
			{ Name: "NylonRope", SelfBondage: false, Value: 15, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], Time: 15 },
			{ Name: "HempRope", SelfBondage: false, Value: 30, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone"], Time: 20, Difficulty: 3 },
			{ Name: "MetalCuffs", Priority: 25, Value: 50, SetPose: ["BackCuffs"], Effect: ["Block", "Prone", "Lock"], Difficulty: 5, Time: 5 },
			{ Name: "LeatherArmbinder", SelfBondage: false, Priority: 4, Value: 80, SetPose: ["BackElbowTouch"], Effect: ["Block", "Prone"], Time: 25, RemoveTime: 10, Difficulty: 10, AllowLock: true },
			{ Name: "LeatherCuffs", Priority: 25, Random: false, Value: 100, AllowPose: ["BackBoxTie", "BackElbowTouch"], Time: 20, Difficulty: 3, Extended: true, AllowLock: true, AllowEffect: ["Block", "Prone"] },
			{ Name: "PaddedMittens", SelfBondage: false, Value: 50, Effect: ["Block", "Prone"], Extended: false, Time: 15, Difficulty: 4, AllowLock: true },
			{ Name: "FourLimbsShackles", Enable: false, Value: -1, SetPose: ["BackBoxTie"], Effect: ["Block", "Prone", "Lock"], Time: 30 },
			{ Name: "StraitLeotard", SelfBondage: false, Value: 200, SetPose: ["BackElbowTouch"], Hide: ["Cloth", "ClothLower"], Block: ["ItemNipples", "ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast"], Effect: ["Block", "Prone"], Time: 35, RemoveTime: 20, Difficulty: 13, AllowLock: true },
			{ Name: "PawMittens", SelfBondage: false, Value: 60, Effect: ["Block", "Prone"], Time: 15, Difficulty: 4, AllowLock: true },
			{ Name: "DuctTape", SelfBondage: false, Extended: true, Value: 50, AllowPose: ["TapedHands"], Hide: ["Gloves"], SetPose: ["TapedHands"], Effect: ["Block", "Prone"], Time: 20, RemoveTime: 10, Difficulty: 5, BuyGroup: "DuctTape", AllowBlock: ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"] },
			{ Name: "BitchSuit", Random: false, SelfBondage: false, Value: 250, SetPose: ["BackElbowTouch", "Kneel"], Hide: ["Cloth", "ClothLower", "BodyLower", "Shoes", "Socks"], Block: ["ItemPelvis", "ItemTorso", "ItemBreast"], Effect: ["Block", "Prone", "ForceKneel"], Time: 40, RemoveTime: 30, Difficulty: 15, AllowLock: true, Prerequisite: "NotSuspended" },
			{ Name: "CollarLeashHolding", Random: false, SelfBondage: false, Priority: 34, Value: -1, Time: 3, RemoveTime: 3, Difficulty: 1, Prerequisite: "NotSuspended" }
		]
	},

	{
		Group: "ItemNeck",
		Category: "Item",
		Priority: 29,
		Default: false,
		Color: ["Default"],
		Left: 200,
		Top: 190,
		Zone: [[150, 210, 100, 50]],
		Asset: [ 
			{ Name: "LeatherCollar", Value: 40, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "LeatherCollarBell", Value: 40, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "LeatherCollarBow", Value: 40, Time: 5, Difficulty: 50, AllowLock: true },
			{ Name: "SlaveCollar", Random: false, Effect: ["Lock"], Enable: false, Value: -1, Time: 5, Difficulty: 50 },
			{ Name: "ClubSlaveCollar", Random: false, Effect: ["Lock"], Enable: false, Value: -1, Time: 5, Difficulty: 50, ExpressionTrigger: [{Group: "Blush", Name: "Medium", Timer: 15}] },
			{ Name: "ShockCollar", Random: false, Extended: true, Effect:["ReceiveShock"], BuyGroup: "ShockCollar", Value: 250, Time: 15, Difficulty: 50, AllowLock: true, ExpressionTrigger: [{Group: "Eyebrows", Name: "Soft", Timer: 10}] },
			{ Name: "ShockCollarRemote", Random: false, Wear: false, Effect:["TriggerShock"], BuyGroup: "ShockCollar", Value: -1, ExpressionTrigger: [{Group: "Eyebrows", Name: "Soft", Timer: 10}, {Group: "Blush", Name: "Soft", Timer: 15}, {Group: "Eyes", Name: "Closed", Timer: 5}] },
			{ Name: "BatCollar", Value: 40, Time: 5, Difficulty: 50, AllowLock: true }
		]
	},

	{
		Group: "ItemNeckAccessories",
		Category: "Item",
		Priority: 30,
		Default: false,
		IsRestraint: true,
		Color: ["Default"],
		Left: 0,
		Top: 190,
		Zone: [[250, 210, 100, 50]],
		Asset: [ 
			{ Name: "CollarBell", Value: 3, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 3, AllowLock: true },
			{ Name: "CollarBow", Value: 3, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 1 },
			{ Name: "CollarShockUnit", Value: 250, Random: false, Extended: true, Effect:["ReceiveShock"], Prerequisite: "Collared", Time: 5, Difficulty: 6, AllowLock: true, BuyGroup: "ShockCollar", ExpressionTrigger: [{Group: "Blush", Name: "Medium", Timer: 15}] },
			{ Name: "ShockCollarRemote", Random: false, Wear: false, Effect:["TriggerShock"], BuyGroup: "ShockCollar", Value: -1, ExpressionTrigger: [{Group: "Eyebrows", Name: "Soft", Timer: 10}, {Group: "Blush", Name: "Soft", Timer: 15}, {Group: "Eyes", Name: "Closed", Timer: 5}] },
			{ Name: "CollarChainLong", Value: 30, Random: false, Prerequisite: "CollaredNotSuspended", Time: 5, Difficulty: 6, AllowLock: true, BuyGroup: "CollarChain", AllowPose: ["Kneel"], Effect: ["Tethered"], ExpressionTrigger: [{Group: "Blush", Name: "Medium", Timer: 15}] },
			{ Name: "CollarChainShort", Value: -1, Random: false, Prerequisite: "CollaredNotSuspended", Time: 5, Difficulty: 6, AllowLock: true, BuyGroup: "CollarChain", SetPose: ["Kneel"], Effect: ["Freeze", "ForceKneel"], ExpressionTrigger: [{Group: "Blush", Name: "Medium", Timer: 15}, {Group: "Eyebrows", Name: "Soft", Timer: 5}] },
			{ Name: "CollarLeash", Value: 30, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 6, AllowLock: true, ExpressionTrigger: [{Group: "Blush", Name: "Medium", Timer: 15}] },
			{ Name: "CollarLeashTaken", Value: -1, Random: false, Prerequisite: "Collared", Time: 5, Difficulty: 6, AllowLock: true, Effect: ["Tethered"], ExpressionTrigger: [{Group: "Blush", Name: "Medium", Timer: 15}] }
		]
	},
	
	{
		Group: "ItemMouth",
		Category: "Item",
		Priority: 31,
		Default: false,
		IsRestraint: true,
		Effect: ["GagNormal"],
		Color: ["Default"],
		Left: 150,
		Top: 0,
		Zone: [[150, 160, 200, 50]],
		Asset: [ 
			{ Name: "ClothGag", Extended: true, Difficulty: -4, Value: 25, Time: 10, AllowEffect: ["GagLight"] },
			{ Name: "WiffleGag", Effect: ["GagHeavy"], Difficulty: 1, Value: 35, Time: 10, AllowLock: true, 
				Layer: [
					{ Name: "Strap", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "HarnessBallGag", Effect: ["GagHeavy"], Difficulty: 4, Value: 60, Time: 20, AllowLock: true,
				Layer: [
					{ Name: "Harness", AllowColorize: false },
					{ Name: "Ball", AllowColorize: true }
				]
			},
			{ Name: "HarnessPanelGag", Effect: ["GagHeavy"], Difficulty: 6, Value: 80, Time: 20, AllowLock: true },
			{ Name: "RingGag", Value: 35, Time: 5, AllowLock: true,
				Layer: [
					{ Name: "Mouth", AllowColorize: false },
					{ Name: "Gag", AllowColorize: true }
				] 
			},
			{ Name: "DuctTape", Extended: true, Difficulty: -2, Value: 50, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape", AllowEffect: ["GagLight", "GagNormal"] },
			{ Name: "PacifierGag", Random: false, Difficulty: -50, Effect: ["GagLight"], Value: 15, Time: 2, ExpressionTrigger: [{Group: "Blush", Name: "Light", Timer: 5}, {Group: "Eyes", Name: "Closed", Timer: 5}] },
			{ Name: "HarnessPacifierGag", Random: false, Difficulty: 2, Effect: ["GagLight"], Value: 70, Time: 20, AllowLock: true, ExpressionTrigger: [{Group: "Blush", Name: "Light", Timer: 5}, {Group: "Eyes", Name: "Closed", Timer: 5}] },
			{ Name: "DusterGag", Random: false, Difficulty: 4, Value: -1, Time: 20, AllowLock: true },
			{ Name: "HarnessPonyBits", Random: false, Difficulty: 4, Effect: ["GagHeavy"], Value: -1, Time: 20, AllowLock: true },
			{ Name: "PumpGag", Effect: [], Random: false, Extended: true, Value: 100, Time: 20, AllowLock: true, ExpressionTrigger: [{Group: "Eyebrows", Name: "Soft", Timer: 10}], AllowEffect: ["GagLight", "GagNormal", "GagHeavy", "GagTotal"] },
			{ Name: "KittyGag", Effect: ["GagLight"], Difficulty: -4, Value: 20, Time: 10, ExpressionTrigger: [{Group: "Blush", Name: "Light", Timer: 5}, {Group: "Eyes", Name: "Closed", Timer: 5}] },
			{ Name: "KittenHarnessPanelGag", Effect: ["GagHeavy"], Difficulty: 6, Value: 80, Time: 20, AllowLock: true },
			{ Name: "CarrotGag", Effect: ["GagHeavy"], Random: false, Value: 50, Time: 15 },
			{ Name: "MuzzleGag", Difficulty: 6, Value: 70, Time: 20, AllowLock: true },
			{ Name: "RegularSleepingPill", Enable: false, Wear: false, Value: -1, Bonus: [{Type: "KidnapSneakiness", Factor: 3}] },
			{ Name: "PantiesMask", Effect: [], Random: false, Value: 20, Time: 15 },
			{ Name: "PlugGag", Random: false, Extended: true, Value: 100, Time: 20, AllowLock: true, ExpressionTrigger: [{Group: "Eyebrows", Name: "Soft", Timer: 10}], AllowEffect: ["GagHeavy", "GagTotal"] }
		]
	},

	{
		Group: "ItemHead",
		Category: "Item",
		Priority: 32,
		Default: false,
		IsRestraint: true,
		Color: ["Default"],
		Left: 150,
		Top: 50,
		Zone: [[150, 35, 200, 125]],
		Asset: [
			{ Name: "ClothBlindfold", Effect: ["BlindLight", "Prone"], Hide: ["Glasses"], Value: 20, Time: 5 },
			{ Name: "LeatherBlindfold", Effect: ["BlindNormal", "Prone"], Hide: ["Glasses"], Value: 40, Time: 5, AllowLock: true },
			{ Name: "LeatherHood", Effect: ["BlindHeavy", "DeafHeavy", "Prone", "GagLight"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth", "Eyes"], Block: ["ItemMouth", "ItemNeck"], Difficulty: 50, Value: 90, Time: 15, AllowLock: true },
			{ Name: "LeatherHoodOpenEyes", Effect: ["Prone", "DeafLight", "GagLight"], Hide: ["HairFront", "HairBack", "Glasses", "ItemMouth"], Block: ["ItemMouth", "ItemNeck"], Difficulty: 50, Value: 60, Time: 15, AllowLock: true },
			{ Name: "StuddedBlindfold", Effect: ["BlindNormal", "Prone"], Hide: ["Glasses"], Difficulty: 2, Value: -1, Time: 5, AllowLock: true },
			{ Name: "KittyBlindfold", Effect: ["BlindLight", "Prone"], Hide: ["Glasses"], Value: 25, Time: 5, AllowLock: true },
			{ Name: "DuctTape", Extended: true, AllowEffect: ["BlindNormal", "Prone", "GagNormal"], Hide: ["Glasses"], Value: 50, Time: 10, RemoveTime: 5, BuyGroup: "DuctTape" },
			{ Name: "SmallBlindfold", Effect: ["BlindLight", "Prone"], Hide: ["Glasses"], Value: 40, Time: 5, AllowLock: true },
			{ Name: "LightDutyEarPlugs", Visible: false, Effect: ["Prone", "DeafLight"], Difficulty: 50, Value: 30, Time: 5 },
			{ Name: "HeavyDutyEarPlugs", Visible: false, Effect: ["DeafHeavy", "Prone"], Difficulty: 50, Value: 40, Time: 5 }
		]
	},

	{
		Group: "ItemMisc",
		Category: "Item",
		Priority: 36,
		Default: false,
		Color: ["Default"],
		Top: -250,
		Zone: [[25, 35, 75, 210], [400, 35, 75, 210]],
		Asset: [
			{ Name: "MetalPadlock", Wear: false, Value: 15, Time: 10, IsLock: true, Effect: [] },
			{ Name: "IntricatePadlock", Wear: false, Value: 60, Time: 30, IsLock: true, Effect: [] },
			{ Name: "TimerPadlock", Wear: false, Value: 100, RemoveTimer: 300, IsLock: true, Effect: [] },
			{ Name: "OwnerPadlock", Wear: false, Value: 100, Time: 10, IsLock: true, OwnerOnly: true, Effect: [] },
			{ Name: "MetalPadlockKey", Wear: false, Value: 15, Effect: ["Unlock-MetalPadlock"] },
			{ Name: "IntricatePadlockKey", Wear: false, Value: 60, Effect: ["Unlock-IntricatePadlock"] },
			{ Name: "OwnerPadlockKey", Wear: false, Value: 100, OwnerOnly: true, Effect: ["Unlock-OwnerPadlock"] },
			{ Name: "MetalCuffsKey", Wear: false, Value: 25, Effect: ["Unlock-MetalCuffs"], Time: 5 },
			{ Name: "WoodenMaidTray", Enable: false, Value: -1 },
			{ Name: "WoodenMaidTrayFull", Enable: false, Value: -1 },
			{ Name: "WoodenPaddle", Enable: false, Value: -1 }
		]
	},

	{
		Group: "ItemFrontDevices",
		Category: "Item",
		Priority: 37,
		Default: false,
		Color: ["Default"],
		Top: -250,
		Zone: [[25, 580, 75, 410], [400, 580, 75, 410]],
		Asset: [
			{ Name: "WoodenBox", RemoveAtLogin: true, Effect: ["BlindNormal", "Prone", "Enclose", "GagLight", "Freeze"], Enable: false, Value: 225 , Time: 15, RemoveTime: 10, Difficulty: 4 },
			{ Name: "MilkCan", RemoveAtLogin: true, Effect: ["BlindHeavy", "Prone", "Enclose", "GagHeavy", "Freeze"], SetPose: ["Kneel"], Enable: false, Value: -1 , Time: 15, RemoveTime: 10, Difficulty: 5 },
			{ Name: "WaterCell", RemoveAtLogin: true, Effect: ["Prone", "Enclose", "GagHeavy", "Freeze"], SetPose: ["Suspension", "LegsClosed"], Block: ["ItemFeet"], Enable: false, Value: -1, Time: 15, RemoveTime: 15, Difficulty: 5 }
		]
	}

];

// 3D Custom Girl based pose
var PoseFemale3DCG = [

	{
		Name: "Kneel",
		OverrideHeight: -250,
		Hide: ["ItemFeet"]
	}

];
