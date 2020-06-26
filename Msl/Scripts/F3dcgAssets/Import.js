
F3dcgAssets.InitFreeAndQuestClothes = function(){
	for(var i = 0; i < this.ClothesGroups.length; i++){
		for(var itemName in this.AssetGroups[this.ClothesGroups[i]].Items){
			var AssetItem = this.AssetGroups[this.ClothesGroups[i]].Items[itemName];
			
			if(AssetItem.BuyGroup);//two-piece items that are bought once
			else if(AssetItem.Value == -1) 	this.ClothesQuest.push(AssetItem.Name);
			else if(! AssetItem.Value) 		this.ClothesFree.push(AssetItem.Name);
		}
	}

}
	
F3dcgAssets.InitPoses = function(){
/*  Poses:
LegsClosed: true
LegsOpen: true
Horse: true
Kneel: true
BackBoxTie: true
BackElbowTouch: true
Bolero: true
StraitDressOpen: true
Yoked: true
AllFours: true
TapedHands: true
GagFlat: true
GagUnique: true
GagCorset: true
Suspension: true
KneelingSpread: true
*/

/*Effects:
Freeze: true
Prone: true
Egged: true
Mounted: true
Remote: true
Chaste: true
Block: true
Lock: true
BreastChaste: true
ForceKneel: true
Shackled: true
BlockKneel: true
ReceiveShock: true
TriggerShock: true
GagNormal: true
Tethered: true
GagVeryLight: true
GagMedium: true
GagEasy: true
GagLight: true
GagHeavy: true
BlindLight: true
BlindNormal: true
BlindHeavy: true
DeafLight: true
DeafHeavy: true
"": true
Enclose: true
*/

	PoseFemale3DCG.forEach(pose => {
		F3dcgAssets.Poses[pose.Name] = pose;
		F3dcgAssets.Poses[pose.Name].priority = pose.Name == "Kneel" ? 1 : 0;
	});
}
	
F3dcgAssets.InitItems = function(){
	var itemNames = {};
	
	for(var i = 0; i < AssetFemale3DCG.length; i++){
		var AssetGroup = AssetFemale3DCG[i];
		
		AssetGroup.Items = {};
		if(AssetGroup.type == F3dcgAssets.EXPRESSION){
			AssetGroup.Items[AssetGroup.Group] = {Name:AssetGroup.Group};
			AssetGroup.AllowExpression.forEach(exp => {
				AssetGroup.Items[exp] = {Name:exp}
				F3dcgAssets.ItemNameToGroupNameMap[exp] = AssetGroup.Group;
			});
			F3dcgAssets.ItemNameToGroupNameMap[AssetGroup.Group] = AssetGroup.Group;
			F3dcgAssets.ItemNameToGroupNameMap[AssetGroup.Asset[0]] = AssetGroup.Group;
		}else{
			for(var j = 0; j < AssetGroup.Asset.length; j++){
				let AssetItem = AssetGroup.Asset[j];
				if(typeof(AssetItem) === "string") AssetItem = {Name:AssetItem};
				
				if(F3dcgAssets.UNIMPLEMENTED_ITEMS.includes(AssetItem.Name)) continue;
				
				if(AssetItem.Prerequisite && ! AssetItem.Prerequisite.forEach) AssetItem.Prerequisite = [AssetItem.Prerequisite];
				
				if(itemNames[AssetItem.Name]){
					//this.ItemNameToGroupNameMap[AssetItem.Name] = AssetGroup.Group;
					AssetItem.Name = AssetItem.Name + "_" + AssetGroup.Group;
					this.ItemNameToGroupNameMap[AssetItem.Name] = AssetGroup.Group;
				}
				else{
					itemNames[AssetItem.Name] = true;
					this.ItemNameToGroupNameMap[AssetItem.Name] = AssetGroup.Group;
				}
				
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
	var G, A, I, V;
	G = F3dcgAssets.AssetGroups.ItemArms;
	A = G.Items.HempRope_ItemArms;
	A.Variant = {};
	HempRopeArmsOptions.forEach(VariantItem => {
		A.Variant[VariantItem.Name] = VariantItem;
		//VariantItem.iconUrl = this.IconUrl(A, VariantItem.Name);
	});
	
	A = G.Items.Chains_ItemArms;
	A.Variant = {};
	ChainsArmsOptions.forEach(VariantItem => {
		A.Variant[VariantItem.Name] = VariantItem;
		//VariantItem.iconUrl = this.IconUrl(A, VariantItem.Name);
	});
	
	V = this.SimplestVariant(G.Items.BitchSuit, ["Latex", "UnZip"]);
	V.Latex.Property = {Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"]}
	V.Latex.Layer = ["Base", "Latex"];
	V.UnZip.Layer = ["Base", "UnZip"];
	
	V = this.SimplestVariant(G.Items.MermaidSuit, ["Latex", "UnZip"]);
	V.Latex.Property = {Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"]}
	V.Latex.Layer = ["Base", "Latex"];
	V.UnZip.Layer = ["Base", "UnZip"];
	
	V = this.SimplestVariant(G.Items.FullLatexSuit, ["Latex", "UnZip"]);
	V.Latex.Property = {Block: ["ItemBreast", "ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"]}
	V.Latex.Layer = ["Base", "Latex"];
	V.UnZip.Layer = ["Base", "UnZip"];
	
	V = this.SimplestVariant(G.Items.DuctTape_ItemArms, ["Arms", "Bottom", "Top", "Full", "Complete"]);
	V.Bottom.Hide = ["Cloth", "ClothLower"];
	V.Bottom.Block = ["ItemVulva", "ItemButt", "ItemPelvis"];
	V.Bottom.Prerequisite = ["NakedClothLower", "NakedCloth"];
	V.Top.Hide = ["Cloth", "ClothLower"];
	V.Top.Block = ["ItemTorso", "ItemBreast", "ItemNipples"];
	V.Full.Hide = ["Cloth", "ClothLower"];
	V.Full.Block = ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"];
	V.Full.Prerequisite = ["NakedClothLower", "NakedCloth"];
	V.Complete.Hide = ["Cloth", "ClothLower"];
	V.Complete.Block = ["ItemVulva", "ItemButt", "ItemPelvis", "ItemTorso", "ItemBreast", "ItemNipples"];
	V.Complete.Prerequisite = ["NakedClothLower", "NakedCloth"];
	
	V = this.SimplestVariant(G.Items.LeatherArmbinder, ["Base", "Strap", "WrapStrap"]);
	V.Base.Layer = ["Base"];
	V.Strap.Layer  = ["Base", "Strap"];
	V.WrapStrap.Layer  = ["Base", "WrapStrap"];
	
	G.Items.LeatherArmbinder.Layer = [
		{ Name: "Base", AllowColorize: true, Priority: 6 }
		,{ Name: "Strap", AllowColorize: true,Priority: 31}
		,{ Name: "WrapStrap", AllowColorize: true,Priority: 31 }
	]
	
	A = G.Items.Web;
	A.Variant = {};
	InventoryItemArmsWebOptions.forEach(VariantItem => {
		A.Variant[VariantItem.Name] = VariantItem;
	});
	
	//this.SimplestVariant(G.Items.StraitJacket, ["Loose", "Normal", "Snug", "Tight"]);//single image for all, not worth it
	
	V = this.SimplestVariant(G.Items.LeatherStraitJacket, ["Loose", "Normal", "Snug", "Tight"])
	V.Normal.Property = {SetPose:["BackElbowTouch"]}
	V.Snug.Property = {SetPose:["BackElbowTouch"]}
	V.Tight.Property = {SetPose:["BackElbowTouch"]}
	
	V = this.SimplestVariant(G.Items.LeatherCuffs, ["None", "Wrist", "Elbow", "Both"]);
	V.Wrist.Property = {SetPose:["BackBoxTie"],Effect : ["Block", "Prone"]};	
	V.Elbow.Property = {SetPose:["BackElbowTouch"],Effect : ["Block", "Prone"]};
	V.Both.Property = {SetPose:["BackElbowTouch"],Effect : ["Block", "Prone"]};
	
	V = this.SimplestVariant(G.Items.OrnateCuffs, ["None", "Wrist", "Elbow", "Both"]);
	V.Wrist.Property = {SetPose:["BackBoxTie"],Effect : ["Block", "Prone"]};	
	V.Elbow.Property = {SetPose:["BackElbowTouch"],Effect : ["Block", "Prone"]};
	V.Both.Property = {SetPose:["BackElbowTouch"],Effect : ["Block", "Prone"]};
	
	G.Items.SturdyLeatherBelts_ItemArms.SetPose = ["BackElbowTouch"];//Should really be in assets.js
	this.SimplestVariant(G.Items.SturdyLeatherBelts_ItemArms, ["One", "Two", "Three"]);
	
	V = this.SimplestVariant(G.Items.WristShackles, ["InFront", "Behind"]);
	V.Behind.Property = {SetPose:["BackCuffs"],Effect:["Block", "Prone"]}
	
	//ItemButt
	G = F3dcgAssets.AssetGroups.ItemButt;
	V = this.SimplestVariant(G.Items.AnalHook, ["Base", "Chain", "Hair"]);
	V.Chain.Property = {Intensity:1,Effect:["Freeze", "Egged"],Difficulty:20};
	V.Hair.Property = {Intensity:1,Effect:["Freeze", "Egged"],Difficulty:10};
	
	V = this.SimplestVariant(G.Items.ButtPlugLock, ["Base", "ChainShort", "ChainLong"]);
	V.ChainShort.Property = {Effect:["Chaste", "Freeze", "ForceKneel"],SetPose:["Kneel"]}
	V.ChainLong.Property = {Effect:["Chaste", "Tethered"], AllowPose:["Kneel", "Horse", "KneelingSpread"]}
	
	//ItemDevices
	G = F3dcgAssets.AssetGroups.ItemDevices;
	this.SimplestVariant(G.Items.InflatableBodyBag, ["Light", "Inflated", "Bloated", "Max"]);
	this.SimplestVariant(G.Items.TeddyBear, ["Bear", "Kitty", "Pony", "Pup", "Fox", "Bunny"]);
	//*
	V = this.SimplestVariant(G.Items.BondageBench, ["Base", "Light", "Normal", "Heavy", "Full"]);
	V.Base.Layer = ["Base"];
	V.Light.Layer  = ["Base", "Light"];
	V.Normal.Layer  = ["Base", "Normal"];
	V.Heavy.Layer  = ["Base", "Heavy"];
	V.Full.Layer  = ["Base", "Full"];
	G.Items.BondageBench.Layer = [
		{ Name: "Base", AllowColorize: false, Priority: 1 }
		,{ Name: "Light", AllowColorize: true,Priority: 50}
		,{ Name: "Normal", AllowColorize: true,Priority: 50 }
		,{ Name: "Heavy", AllowColorize: true,Priority: 50}
		,{ Name: "Full", AllowColorize: true,Priority: 50}
	]//*/
	
	
	//ItemEars
	G = F3dcgAssets.AssetGroups.ItemEars;
	V = this.SimplestVariant(G.Items.HeadphoneEarPlugs, ["Off","Light","Heavy"]);
	V.Light.Property = {Effect : ["DeafLight"]};
	V.Light.Property = {Effect : ["DeafHeavy"]};
	
	
	//ItemFeet
	G = F3dcgAssets.AssetGroups.ItemFeet;
	V = this.SimplestVariant(G.Items.Chains, ["Basic","Strict", "Suspension"]);
	V.Suspension.Prerequisite = ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"];
	V.Suspension.Property = {SetPose:["Suspension", "LegsClosed"]};
	
	V = this.SimplestVariant(G.Items.HempRope, ["Basic","Mermaid", "Suspension"]);
	V.Suspension.Prerequisite = ["NotKneeling", "NotMounted", "NotChained", "NotHogtied"];
	V.Suspension.Property = {SetPose:["Suspension", "LegsClosed"]};
	
	G.Items.DuctTape.SetPose = ["LegsClosed"];
	V = this.SimplestVariant(G.Items.DuctTape, ["Feet","HalfFeet", "MostFeet", "CompleteFeet"]);
	V.HalfFeet.Prerequisite = ["NakedClothLower"];
	V.HalfFeet.Property = {Hide : ["ClothLower", "Shoes"]};
	V.MostFeet.Prerequisite = ["NakedClothLower"];
	V.MostFeet.Property = {Hide : ["ClothLower", "Shoes"]};
	V.CompleteFeet.Prerequisite = ["NakedClothLower"];
	V.CompleteFeet.Property = {Hide : ["ClothLower", "Shoes"]};
	
	V = this.SimplestVariant(G.Items.LeatherAnkleCuffs, ["None", "Closed"]);
	V.Closed.Property = {SetPose: ["LegsClosed"], Effect:["Prone", "Freeze"]};
	
	V = this.SimplestVariant(G.Items.OrnateAnkleCuffs, ["None", "Closed"]);
	V.Closed.Property = {SetPose: ["LegsClosed"], Effect:["Prone", "Freeze"]};
	
	G.Items.SturdyLeatherBelts.SetPose = ["LegsClosed"];
	this.SimplestVariant(G.Items.SturdyLeatherBelts, ["One", "Two", "Three"]);
	
	//ItemHead
	G = F3dcgAssets.AssetGroups.ItemHead;
	V = this.SimplestVariant(G.Items.DuctTape_ItemHead, ["Double", "Wrap", "Mummy"]);
	V.Double.Property = {Effect:["BlindNormal", "Prone"]};
	V.Wrap.Property = {Effect:["BlindNormal", "Prone"]};
	V.Mummy.Property = {Hide:["HairFront", "HairBack"], Effect:["GagNormal", "BlindNormal", "Prone"], Block:["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"]};
	
	//ItemNeckAccessories
	G = F3dcgAssets.AssetGroups.ItemNeckAccessories;
	["CollarNameTag", "CollarNameTagOval", "CollarNameTagPet", "CollarNameTagLover", "CollarNameTagLivestock"].forEach(itemName =>{
		V = this.SimplestVariant(G.Items[itemName], G.Items[itemName].AllowType);
	});
	
	//ItemMouth
	["ItemMouth", "ItemMouth2", "ItemMouth3"].forEach(GroupName =>{
		G = F3dcgAssets.AssetGroups[GroupName];
		I = G.Items["ClothGag"] ? G.Items["ClothGag"] : G.Items["ClothGag_" + GroupName];
		V = this.SimplestVariant(I, ["Small", "Cleave", "OTM", "OTN"]);
		V.Small.Property = {Effect:["GagVeryLight"]};
		V.Cleave.Property = {Effect:["GagLight"]};
		V.OTM.Property = {Effect:["GagEasy"]};
		V.OTN.Property = {Effect:["GagEasy"]};
		
		I = G.Items["DuctTape"] ? G.Items["DuctTape"] : G.Items["DuctTape_" + GroupName]
		V = this.SimplestVariant(I, ["Single", "Crossed", "Full", "Double", "Cover"]);
		V.Single.Property = {Effect:["GagVeryLight"]};
		V.Crossed.Property = {Effect:["GagVeryLight"]};
		V.Full.Property = {Effect:["GagLight"]};
		V.Double.Property = {Effect:["GagEasy"]};
		V.Cover.Property = {Effect:["GagNormal"]};
	});
	
	
	G = F3dcgAssets.AssetGroups.ItemMouth;//DildoPlugGag_Lock,  DildoPlugGag_Strap, DildoPlugGag_Tongue, DildoPlugGagPlug_Close
	V = this.SimplestVariant(G.Items.DildoPlugGag, ["Open", "Plug"]);
	V.Open.Property = {Effect:["GagVeryLight"]};
	V.Plug.Property = {Effect:["GagVeryHeavy"]};
	V.Open.Layer = ["Strap", "Tongue"];
	V.Plug.Layer  = ["Strap", "Close"];
	G.Items.DildoPlugGag.Layer = [
		{ Name: "Strap", AllowColorize: true }
		,{ Name: "Close", AllowColorize: true, urlPart:"Plug_Close" }
		,{ Name: "Tongue", AllowColorize: false }
	];
	
	V = this.SimplestVariant(G.Items.PlugGag, ["Open", "Plug"]);
	V.Open.Property = {Effect:["GagVeryLight"]};
	V.Plug.Property = {Effect:["GagVeryHeavy"]};
	V.Open.Layer = ["Strap", "Tongue"];
	V.Plug.Layer  = ["Strap", "Close"];
	G.Items.PlugGag.Layer = [
		{ Name: "Strap", AllowColorize: true }
		,{ Name: "Close", AllowColorize: true, urlPart:"Plug_Close" }
		,{ Name: "Tongue", AllowColorize: false }
	];
	
	
	//ItemTorso
	G = F3dcgAssets.AssetGroups.ItemTorso;
	A = G.Items.HempRopeHarness;
	A.Variant = {};
	HempRopeTorsoOptions.forEach(VariantItem => {
		A.Variant[VariantItem.Name] = VariantItem;
		//VariantItem.iconUrl = this.IconUrl(A, VariantItem.Name);
	});
	
	A = G.Items.NylonRopeHarness;
	A.Variant = {};
	HempRopeTorsoOptions.forEach(VariantItem => {
		if(! ["Crotch", "Diamond", "Harness"].includes(VariantItem.Name)) return;
		A.Variant[VariantItem.Name] = VariantItem;
		//VariantItem.iconUrl = this.IconUrl(A, VariantItem.Name);
	});

	//ItemLegs
	G = F3dcgAssets.AssetGroups.ItemLegs;
	G.Items.DuctTape_ItemLegs.SetPose = ["LegsClosed"];
	V = this.SimplestVariant(G.Items.DuctTape_ItemLegs, ["Legs", "HalfLegs", "MostLegs", "CompleteLegs"]);
	V.HalfLegs.Property = {Hide : ["ClothLower"]};
	V.MostLegs.Property = {Hide : ["ClothLower"]};
	V.CompleteLegs.Property = {Hide : ["ClothLower"]};

	V = this.SimplestVariant(G.Items.Chains_ItemLegs, ["Basic", "Strict"]);
	V = this.SimplestVariant(G.Items.HempRope_ItemLegs, ["Basic", "Mermaid"]);
	
	V = this.SimplestVariant(G.Items.LeatherLegCuffs, ["None", "Closed"]);
	V.Closed.Property = {SetPose: ["LegsClosed"], Effect:["Prone", "Freeze"]};
	
	V = this.SimplestVariant(G.Items.OrnateLegCuffs, ["None", "Closed"]);
	V.Closed.Property = {SetPose: ["LegsClosed"], Effect:["Prone", "Freeze"]};
	
	G.Items.SturdyLeatherBelts_ItemLegs.SetPose = ["LegsClosed"];
	this.SimplestVariant(G.Items.SturdyLeatherBelts_ItemLegs, ["One", "Two"]);
	
}
	
F3dcgAssets.SimplestVariant = function(A, variantNames){
	A.Variant = {};//single to follow the conventions
	//variantNames.forEach(variantName => {A.Variant[variantName] = {Name:variantName, iconUrl:this.IconUrl(A, variantName)}});
	variantNames.forEach(variantName => {A.Variant[variantName] = {Name:variantName}});
	return A.Variant;
}

/*
F3dcgAssets.IconUrl = function(A, VariantItemName){
	return F3dcgAssets.F3DCG_TYPE_ICON_BASE + A.Group + "/" + A.Name + "/" + VariantItemName + ".png";
}*/
	
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
/*
F3dcgAssets.InitLocks = function(){
	var ItemMiscAssetGroup = AssetFemale3DCG.find(AssetItemGroup => AssetItemGroup.Group == "ItemMisc");
	var keys = {};
	
	var i = ItemMiscAssetGroup.Asset.length
	while (i--) {
		var AssetItem = ItemMiscAssetGroup.Asset[i];
		if (AssetItem.Name.includes("Padlock") || AssetItem.Name.includes("MetalCuffsKey")) { 
			ItemMiscAssetGroup.Asset.splice(i, 1);
			
			//AssetItem.iconUrl = "ItemMisc/Preview/" + AssetItem.Name + ".png";
			
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
}*/




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

var InventoryItemArmsWebOptions = [
	{
		Name: "Tangled",
		Property: { Type: null, Difficulty: 0 },
	},
	{
		Name: "Wrapped",
		BondageLevel: 0,
		SelfBondageLevel: 4,
		Property: {
			Type: "Wrapped",
			Difficulty: 2,
			Prerequisite: ["NoFeetSpreader"],
			AllowPose: ["Kneel"],
			SetPose: ["LegsClosed", "BackElbowTouch"],
			Effect: ["Block", "Freeze", "Prone"],
			Block: ["ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots"],
		},
	},
	{
		Name: "Cocooned",
		BondageLevel: 1,
		SelfBondageLevel: 5,
		Property: {
			Type: "Cocooned",
			Difficulty: 4,
			Prerequisite: ["NoFeetSpreader"],
			AllowPose: ["Kneel"],
			SetPose: ["LegsClosed", "BackElbowTouch"],
			Effect: ["Block", "Freeze", "Prone"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
	{
		Name: "Hogtied",
		BondageLevel: 3,
		SelfBondageLevel: 6,
		RequiresPrerequisites: true,
		Property: {
			Type: "Hogtied",
			Difficulty: 4,
			Prerequisite: ["NoFeetSpreader"],
			SetPose: ["Hogtied"],
			Effect: ["Block", "Freeze", "Prone"],
			Hide: ["Cloth", "ClothLower", "ClothAccessory", "Necklace"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
	{
		Name: "Suspended",
		BondageLevel: 4,
		SelfBondageLevel: 8,
		RequiresPrerequisites: true,
		Property: {
			Type: "Suspended",
			Difficulty: 6,
			Prerequisite: ["NoFeetSpreader"],
			SetPose: ["LegsClosed", "BackElbowTouch", "Suspension"],
			Effect: ["Block", "Freeze", "Prone"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
	{
		Name: "SuspensionHogtied",
		BondageLevel: 5,
		SelfBondageLevel: 9,
		RequiresPrerequisites: true,
		Property: {
			Type: "SuspensionHogtied",
			Difficulty: 11,
			Prerequisite: ["NoFeetSpreader"],
			SetPose: ["Hogtied", "SuspensionHogtied"],
			Effect: ["Block", "Freeze", "Prone"],
			Hide: ["Cloth", "ClothLower", "ClothAccessory", "Necklace"],
			Block: ["ItemVulva", "ItemVulvaPiercings", "ItemButt", "ItemPelvis", "ItemTorso", "ItemHands", "ItemLegs", "ItemFeet", "ItemBoots", "ItemNipples", "ItemNipplesPiercings", "ItemBreast"],
		},
	},
];