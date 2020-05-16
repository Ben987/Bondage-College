

F3dcgAssets.InitFreeAndQuestClothes = function(){
		for(var i = 0; i < this.ClothesGroups.length; i++){
			for(var itemName in this.AssetGroups[this.ClothesGroups[i]].Items){
				var AssetItem = this.AssetGroups[this.ClothesGroups[i]].Items[itemName];
				
				if(AssetItem.BuyGroup);//two - piece suits that are bought in the same shop
				else if(AssetItem.Value == -1) 	this.ClothesQuest.push(AssetItem.Name);
				else if(! AssetItem.Value) 		this.ClothesFree.push(AssetItem.Name);
			}
		}
	}
	
F3dcgAssets.InitPoses = function(){
	PoseFemale3DCG.forEach(pose => {
		F3dcgAssets.Poses[pose.Name] = pose;
		F3dcgAssets.Poses[pose.Name].priority = pose.Name == "Kneel" ? 1 : 0;
	});
}
	
F3dcgAssets.InitItems = function(){
	for(var i = 0; i < AssetFemale3DCG.length; i++){
		var AssetGroup = AssetFemale3DCG[i];
		
		AssetGroup.Items = {};
		if(AssetGroup.type == F3dcgAssets.EXPRESSION){
			AssetGroup.Items["None"] = {Name:"None", iconUrl:AssetGroup.Group + "/Icon.png"};
			AssetGroup.AllowExpression.forEach(exp => {
				AssetGroup.Items[exp] = {Name:exp,iconUrl:AssetGroup.Group + "/" + exp + "/Icon.png"}
				F3dcgAssets.AssetNameToGroupNameMap[exp] = AssetGroup.Group;
			});
			F3dcgAssets.AssetNameToGroupNameMap[AssetGroup.Group] = AssetGroup.Group;
			F3dcgAssets.AssetNameToGroupNameMap[AssetGroup.Asset[0]] = AssetGroup.Group;
		}else{
			for(var j = 0; j < AssetGroup.Asset.length; j++){
				let AssetItem = AssetGroup.Asset[j];
				if(typeof(AssetItem) === "string") AssetItem = {Name:AssetItem};
				
				if(F3dcgAssets.UNIMPLEMENTED_ITEMS.includes(AssetItem.Name)) continue;
				this.AssetNameToGroupNameMap[AssetItem.Name] = AssetGroup.Group;
				
				AssetItem.Group = AssetGroup.Group;
				AssetGroup.Items[AssetItem.Name] = AssetItem;
				if(AssetGroup.ParentGroup) AssetGroup.useBodySize = AssetGroup.ParentGroup == "BodyUpper" ? "upperSize" : "lowerSize";
			}
		}	
	}
}
	
	
F3dcgAssets.InitVariants = function(){
	//Item Addon -- skipping as too difficult
	//Item Arms
	var G, A, V;
	G = F3dcgAssets.AssetGroups.ItemArms;
	A = G.Items.HempRope;
	A.Variants = {};
	HempRopeArmsOptions.forEach(VariantItem => {
		A.Variants[VariantItem.Name] = VariantItem;
		VariantItem.iconUrl = this.IconUrl(A, VariantItem.Name);
	});
	
	A = G.Items.Chains;
	A.Variants = {};
	ChainsArmsOptions.forEach(VariantItem => {
		A.Variants[VariantItem.Name] = VariantItem;
		VariantItem.iconUrl = this.IconUrl(A, VariantItem.Name);
	});
	
	V = this.SimplestVariants(G.Items.BitchSuit, ["Latex", "UnZip"]);
	V.Latex.Property = {Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"]}
	
	V = this.SimplestVariants(G.Items.MermaidSuit, ["Latex", "UnZip"]);
	V.Latex.Property = {Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"]}
	
	V = this.SimplestVariants(G.Items.FullLatexSuit, ["Latex", "UnZip"]);
	V.Latex.Property = {Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"]}
	
	V = this.SimplestVariants(G.Items.DuctTape, ["Arms", "Bottom", "Top", "Full", "Complete"]);
	V.Bottom.Hide = ["Cloth", "ClothLower"];
	V.Bottom.Block = ["ItemVulva", "ItemButt", "ItemPelvis"];
	V.Top.Hide = ["Cloth", "ClothLower"];
	V.Top.Block = ["ItemTorso", "ItemBreast", "ItemNipples"];
	V.Full.Hide = ["Cloth", "ClothLower"];
	V.Full.Block = ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"];
	V.Complete.Hide = ["Cloth", "ClothLower"];
	V.Complete.Block =["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"];
	
	//this.SimplestVariants(G.Items.StraitJacket, ["Loose", "Normal", "Snug", "Tight"]);//single image for all, not interesting
	
	V = this.SimplestVariants(G.Items.LeatherStraitJacket, ["Loose", "Normal", "Snug", "Tight"])
	V.Normal.Property = {SetPose:["BackElbowTouch"]}
	V.Snug.Property = {SetPose:["BackElbowTouch"]}
	V.Tight.Property = {SetPose:["BackElbowTouch"]}
	
	V = this.SimplestVariants(G.Items.LeatherCuffs, ["None", "Wrist", "Elbow", "Both"]);
	V.Wrist.Property = {SetPose:["BackBoxTie"]};
	V.Elbow.Property = {SetPose:["BackElbowTouch"]};
	V.Both.Property = {SetPose:["BackElbowTouch"]};
	
	V = this.SimplestVariants(G.Items.OrnateCuffs, ["None", "Wrist", "Elbow", "Both"]);
	V.Wrist.Property = {SetPose:["BackBoxTie"]};
	V.Elbow.Property = {SetPose:["BackElbowTouch"]};
	V.Both.Property = {SetPose:["BackElbowTouch"]};
	
	G.Items.SturdyLeatherBelts.SetPose = ["BackElbowTouch"];//Should really be in assets.js
	this.SimplestVariants(G.Items.SturdyLeatherBelts, ["One", "Two", "Three"]);
	
	V = this.SimplestVariants(G.Items.WristShackles, ["InFront", "Behind"]);
	V.Behind.Property = {SetPose:["BackCuffs"],Effect:["Block", "Prone"]}
	
	//ItemButt
	G = F3dcgAssets.AssetGroups.ItemButt;
	V = this.SimplestVariants(G.Items.AnalHook, ["Base", "Chain", "Hair"]);
	V.Chain.Property = {Intensity:1,Effect:["Freeze", "Egged"],Difficulty:20};
	V.Hair.Property = {Intensity:1,Effect:["Freeze", "Egged"],Difficulty:10};
	
	V = this.SimplestVariants(G.Items.ButtPlugLock, ["Base", "ChainShort", "ChainLong"]);
	V.ChainShort.Property = {Effect:["Chaste", "Freeze", "ForceKneel"],SetPose:["Kneel"]}
	V.ChainLong.Property = {Effect:["Chaste", "Tethered"], AllowPose:["Kneel", "Horse", "KneelingSpread"]}
	
	//ItemDevices
	G = F3dcgAssets.AssetGroups.ItemDevices;
	this.SimplestVariants(G.Items.InflatableBodyBag, ["Light", "Inflated", "Bloated", "Max"]);
	this.SimplestVariants(G.Items.TeddyBear, ["Bear", "Kitty", "Pony", "Pup", "Fox", "Bunny"]);
	
	//ItemEars
	G = F3dcgAssets.AssetGroups.ItemEars;
	V = this.SimplestVariants(G.Items.HeadphoneEarPlugs, ["Off","Light","Heavy"]);
	V.Light.Property = {Effect : ["DeafLight"]};
	V.Light.Property = {Effect : ["DeafHeavy"]};
	
	
	//ItemFeet
	G = F3dcgAssets.AssetGroups.ItemFeet;
	V = this.SimplestVariants(G.Items.Chains, ["Basic","Strict", "Suspension"]);
	V.Suspension.Prerequisite = ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"];
	V.Suspension.Property = {SetPose:["Suspension", "LegsClosed"]};
	
	V = this.SimplestVariants(G.Items.HempRope, ["Basic","Mermaid", "Suspension"]);
	V.Suspension.Prerequisite = ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"];
	V.Suspension.Property = {SetPose:["Suspension", "LegsClosed"]};
	
	G.Items.DuctTape.SetPose = ["LegsClosed"];
	V = this.SimplestVariants(G.Items.DuctTape, ["Feet","HalfFeet", "MostFeet", "CompleteFeet"]);
	V.HalfFeet.Prerequisite = ["NakedClothLower"];
	V.HalfFeet.Property = {Hide : ["ClothLower", "Shoes"]};
	V.MostFeet.Prerequisite = ["NakedClothLower"];
	V.MostFeet.Property = {Hide : ["ClothLower", "Shoes"]};
	V.CompleteFeet.Prerequisite = ["NakedClothLower"];
	V.CompleteFeet.Property = {Hide : ["ClothLower", "Shoes"]};
	
	V = this.SimplestVariants(G.Items.LeatherAnkleCuffs, ["None", "Closed"]);
	V.Closed.Property = {SetPose: ["LegsClosed"], Effect:["Prone", "Freeze"]};
	
	V = this.SimplestVariants(G.Items.OrnateAnkleCuffs, ["None", "Closed"]);
	V.Closed.Property = {SetPose: ["LegsClosed"], Effect:["Prone", "Freeze"]};
	
	G.Items.SturdyLeatherBelts.SetPose = ["LegsClosed"];
	this.SimplestVariants(G.Items.SturdyLeatherBelts, ["One", "Two", "Three"]);
	
	//ItemHead
	G = F3dcgAssets.AssetGroups.ItemHead;
	V = this.SimplestVariants(G.Items.DuctTape, ["Double", "Wrap", "Mummy"]);
	V.Double.Property = {Effect:["BlindNormal", "Prone"]};
	V.Wrap.Property = {Effect:["BlindNormal", "Prone"]};
	V.Mummy.Property = {Hide:["HairFront", "HairBack"], Effect:["GagNormal", "BlindNormal", "Prone"], Block:["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"]};
	
	//ItemLegs
	G = F3dcgAssets.AssetGroups.ItemLegs;
	G.Items.DuctTape.SetPose = ["LegsClosed"];
	V = this.SimplestVariants(G.Items.DuctTape, ["Legs", "HalfLegs", "MostLegs", "CompleteLegs"]);
	V.HalfLegs.Property = {Hide : ["ClothLower"]};
	V.MostLegs.Property = {Hide : ["ClothLower"]};
	V.CompleteLegs.Property = {Hide : ["ClothLower"]};

	V = this.SimplestVariants(G.Items.Chains, ["Basic", "Strict"]);
	V = this.SimplestVariants(G.Items.HempRope, ["Basic", "Mermaid"]);
	
	V = this.SimplestVariants(G.Items.LeatherLegCuffs, ["None", "Closed"]);
	V.Closed.Property = {SetPose: ["LegsClosed"], Effect:["Prone", "Freeze"]};
	
	V = this.SimplestVariants(G.Items.OrnateLegCuffs, ["None", "Closed"]);
	V.Closed.Property = {SetPose: ["LegsClosed"], Effect:["Prone", "Freeze"]};
	
	G.Items.SturdyLeatherBelts.SetPose = ["LegsClosed"];
	this.SimplestVariants(G.Items.SturdyLeatherBelts, ["One", "Two"]);
	
	//ItemMouth
	
	["ItemMouth", "ItemMouth2", "ItemMouth3"].forEach(GroupName =>{
		G = F3dcgAssets.AssetGroups[GroupName];
		V = this.SimplestVariants(G.Items.ClothGag, ["Small", "Cleave", "OTM", "OTN"]);
		V.Small.Property = {Effect:["GagVeryLight"]};
		V.Cleave.Property = {Effect:["GagLight"]};
		V.OTM.Property = {Effect:["GagEasy"]};
		V.OTN.Property = {Effect:["GagEasy"]};
		
		V = this.SimplestVariants(G.Items.DuctTape, ["Single", "Crossed", "Full", "Double", "Cover"]);
		V.Single.Property = {Effect:["GagVeryLight"]};
		V.Crossed.Property = {Effect:["GagVeryLight"]};
		V.Full.Property = {Effect:["GagLight"]};
		V.Double.Property = {Effect:["GagEasy"]};
		V.Cover.Property = {Effect:["GagNormal"]};
	});
	
	/* Dropping this as layer logic is too complex
	V = this.SimplestVariants(G.Items.DildoPlugGag, ["Open", "Plug"]);
	V.Open.Property = {Effect:["GagVeryLight"]};
	V.Plug.Property = {Effect:["GagVeryHeavy"]};*/
	
	//ItemTorso
	G = F3dcgAssets.AssetGroups.ItemTorso;
	A = G.Items.HempRopeHarness;
	A.Variants = {};
	HempRopeTorsoOptions.forEach(VariantItem => {
		A.Variants[VariantItem.Name] = VariantItem;
		VariantItem.iconUrl = this.IconUrl(A, VariantItem.Name);
	});
	
	A = G.Items.NylonRopeHarness;
	A.Variants = {};
	HempRopeTorsoOptions.forEach(VariantItem => {
		if(! ["Crotch", "Diamond", "Harness"].includes(VariantItem.Name)) return;
		A.Variants[VariantItem.Name] = VariantItem;
		VariantItem.iconUrl = this.IconUrl(A, VariantItem.Name);
	});
}
	
F3dcgAssets.SimplestVariants = function(A, variantNames){
	A.Variants = {};
	variantNames.forEach(variantName => {A.Variants[variantName] = {Name:variantName, iconUrl:this.IconUrl(A, variantName)}});
	return A.Variants;
}

F3dcgAssets.IconUrl = function(A, VariantItemName){
	return F3dcgAssets.F3DCG_TYPE_ICON_BASE + A.Group + "/" + A.Name + "/" + VariantItemName + ".png";
}
	
F3dcgAssets.InitGroupTypes = function(){		
	for(var i = 0; i < AssetFemale3DCG.length; i++){
		var AssetGroup = AssetFemale3DCG[i];			
		F3dcgAssets.AssetGroups[AssetGroup.Group] = AssetGroup;
		
		if(F3dcgAssets.IgnoreGroups.includes(AssetGroup.Group))
			continue;
		else if(F3dcgAssets.ExpressionGroups.includes(AssetGroup.Group))
			AssetGroup.type = F3dcgAssets.EXPRESSION;
		else if(F3dcgAssets.BodyItemsGroups.includes(AssetGroup.Group))
			AssetGroup.type = F3dcgAssets.BODY;
		else if(F3dcgAssets.AccessoriesGroups.includes(AssetGroup.Group))
			AssetGroup.type = F3dcgAssets.ACCESSORY;
		else if(F3dcgAssets.BondageToyGroups.includes(AssetGroup.Group))
			AssetGroup.type = F3dcgAssets.BONDAGE_TOY;
		else if(F3dcgAssets.ClothesGroups.includes(AssetGroup.Group))
			AssetGroup.type = F3dcgAssets.CLOTH;				
	}
}
	
F3dcgAssets.InitClothesGroupsNames = function(){
	for(var i = 0; i < AssetFemale3DCG.length; i++){
		var AssetGroup = AssetFemale3DCG[i];
		
		if(AssetGroup.Clothing && ! F3dcgAssets.AccessoriesGroups.includes(AssetGroup.Group))
			F3dcgAssets.ClothesGroups.push(AssetGroup.Group) 
	}
} 
	
F3dcgAssets.InitLocks = function(){
	var ItemMiscAssetGroup = AssetFemale3DCG.find(AssetItemGroup => AssetItemGroup.Group == "ItemMisc");
	var keys = {};
	
	var i = ItemMiscAssetGroup.Asset.length
	while (i--) {
		var AssetItem = ItemMiscAssetGroup.Asset[i];
		if (AssetItem.Name.includes("Padlock") || AssetItem.Name.includes("MetalCuffsKey")) { 
			ItemMiscAssetGroup.Asset.splice(i, 1);
			
			AssetItem.iconUrl = "ItemMisc/Preview/" + AssetItem.Name + ".png";
			
			if(AssetItem.Name.includes("PadlockKey"))
				keys[AssetItem.Name] = AssetItem;
			else if(AssetItem.Name.includes("Padlock"))
				F3dcgAssets.Padlocks[AssetItem.Name] = AssetItem;
			
		}
	}
	
	F3dcgAssets.Padlocks.MetalPadlock.Key = keys.MetalPadlockKey;
	F3dcgAssets.Padlocks.IntricatePadlock.Key = keys.MetalPadlockKey;
	F3dcgAssets.Padlocks.OwnerPadlock.Key = keys.OwnerPadlockKey;
	F3dcgAssets.Padlocks.OwnerTimerPadlock.Key = keys.OwnerPadlockKey;
	F3dcgAssets.Padlocks.LoversPadlock.Key = keys.LoversPadlockKey;
	F3dcgAssets.Padlocks.LoversTimerPadlock.Key = keys.LoversPadlockKey;
	F3dcgAssets.Padlocks.MistressPadlock.Key = keys.MistressPadlockKey;
	F3dcgAssets.Padlocks.MistressTimerPadlock.Key = keys.MistressPadlockKey;		
	
	F3dcgAssets.Padlocks.LoversTimerPadlock.KeyHolderActions = {selection:[1, 2, 4, 8, 16, 24, 48, 72, 96, 120, 144, 168, -144, -72, -48, -24, -8, -4]};
	F3dcgAssets.Padlocks.OwnerTimerPadlock.KeyHolderActions = {selection:[1, 2, 4, 8, 16, 24, 48, 72, 96, 120, 144, 168, -144, -72, -48, -24, -8, -4]};
	F3dcgAssets.Padlocks.MistressTimerPadlock.KeyHolderActions = {selection:[5, 10, 15, 30, 60, 120, 180, 240, -180, -120, -60, -30, -15]};
	
	F3dcgAssets.Padlocks.LoversTimerPadlock.KeylessActions = {random:240, plus:120, minus:120};
	F3dcgAssets.Padlocks.OwnerTimerPadlock.KeylessActions = {random:240, plus:120, minus:120};
	F3dcgAssets.Padlocks.MistressTimerPadlock.KeylessActions = {random:20, plus:10, minus:10};
	
	F3dcgAssets.Padlocks.TimerPadlock.KeylessSelections = {plus:5};	
}




var HempRopeArmsOptions = [
	{
		Name: "BoxTie",
		RequiredBondageLevel: null,
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		ArmsOnly: true
	}, {
		Name: "WristTie",
		RequiredBondageLevel: null,
		Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }],
		ArmsOnly: true
	}, {
		Name: "RopeCuffs",
		RequiredBondageLevel: null,
		Property: { Type: "RopeCuffs", Effect: ["Block", "Prone"], SetPose: ["BackCuffs"], Difficulty: 1, OverridePriority: 30 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }],
		ArmsOnly: true
	}, {
		Name: "WristElbowTie",
		RequiredBondageLevel: 2,
		Property: { Type: "WristElbowTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }],
		ArmsOnly: true
	}, {
		Name: "WristElbowHarnessTie",
		RequiredBondageLevel: 3,
		Property: { Type: "WristElbowHarnessTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }],
		ArmsOnly: true
	}, {
		Name: "Hogtied",
		RequiredBondageLevel: 4,
		Property: { Type: "Hogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemMisc"], SetPose: ["Hogtied"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		ArmsOnly: false
	}, {
		Name: "AllFours",
		RequiredBondageLevel: 6,
		Property: { Type: "AllFours", Effect: ["ForceKneel"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemMisc"], SetPose: ["AllFours"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		ArmsOnly: false
	}, {
		Name: "SuspensionHogtied",
		RequiredBondageLevel: 8,
		Property: { Type: "SuspensionHogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied", "SuspensionHogtied"], Difficulty: 6 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		ArmsOnly: false,
		HiddenItem: "SuspensionHempRope"
	}
];

var ChainsArmsOptions = [
	{
		Name: "BoxTie",
		RequiredBondageLevel: null,
		Property: { Type: null, Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		ArmsOnly: true
	}, {
		Name: "WristTie",
		RequiredBondageLevel: null,
		Property: { Type: "WristTie", Effect: ["Block", "Prone"], SetPose: ["BackBoxTie"], Difficulty: 1 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }],
		ArmsOnly: true
	}, {
		Name: "ChainCuffs",
		RequiredBondageLevel: null,
		Property: { Type: "ChainCuffs", Effect: ["Block", "Prone"], SetPose: ["BackCuffs"], Difficulty: 1, OverridePriority: 30 },
		Expression: [{ Group: "Blush", Name: "Low", Timer: 5 }],
		ArmsOnly: true
	}, {
		Name: "WristElbowTie",
		RequiredBondageLevel: 2,
		Property: { Type: "WristElbowTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 2 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }],
		ArmsOnly: true
	}, {
		Name: "WristElbowHarnessTie",
		RequiredBondageLevel: 3,
		Property: { Type: "WristElbowHarnessTie", Effect: ["Block", "Prone"], SetPose: ["BackElbowTouch"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 5 }],
		ArmsOnly: true
	}, {
		Name: "Hogtied",
		RequiredBondageLevel: 4,
		Property: { Type: "Hogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemMisc"], SetPose: ["Hogtied"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		ArmsOnly: false
	}, {
		Name: "AllFours",
		RequiredBondageLevel: 6,
		Property: { Type: "AllFours", Effect: ["ForceKneel"], Block: ["ItemLegs", "ItemFeet", "ItemBoots", "ItemMisc"], SetPose: ["AllFours"], Difficulty: 3 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		ArmsOnly: false
	}, {
		Name: "SuspensionHogtied",
		RequiredBondageLevel: 8,
		Property: { Type: "SuspensionHogtied", Effect: ["Block", "Freeze", "Prone"], Block: ["ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"], SetPose: ["Hogtied", "SuspensionHogtied"], Difficulty: 6 },
		Expression: [{ Group: "Blush", Name: "Medium", Timer: 10 }],
		ArmsOnly: false,
		HiddenItem: "SuspensionChains"
	}
];

var HempRopeTorsoOptions = [
	{
		Name: "Crotch",
		RequiredBondageLevel: null,
		Property: { Type: null, Difficulty: 1 },
	}, {
		Name: "Waist",
		RequiredBondageLevel: null,
		Property: { Type: "Waist" , Difficulty: 1 },
	}, {
		Name: "Harness",
		RequiredBondageLevel: 2,
		Property: { Type: "Harness" , Difficulty: 1 },
	}, {
		Name: "Star",
		RequiredBondageLevel: 3,
		Property: { Type: "Star" , Difficulty: 2 },
	}, {
		Name: "Diamond",
		RequiredBondageLevel: 4,
		Property: { Type: "Diamond" , Difficulty: 3 },
		
	}
];