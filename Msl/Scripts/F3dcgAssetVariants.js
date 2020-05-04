'use sctrict'

var F3dcgAssetVariants = {
	Init(){
	
		//Item Addon -- skipping as too difficult
		//Item Arms
		var G, A, V;
		G = F3dcgAssets.ItemGroups.ItemArms;
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
		G = F3dcgAssets.ItemGroups.ItemButt;
		V = this.SimplestVariants(G.Items.AnalHook, ["Base", "Chain", "Hair"]);
		V.Chain.Property = {Intensity:1,Effect:["Freeze", "Egged"],Difficulty:20};
		V.Hair.Property = {Intensity:1,Effect:["Freeze", "Egged"],Difficulty:10};
		
		V = this.SimplestVariants(G.Items.ButtPlugLock, ["Base", "ChainShort", "ChainLong"]);
		V.ChainShort.Property = {Effect:["Chaste", "Freeze", "ForceKneel"],SetPose:["Kneel"]}
		V.ChainLong.Property = {Effect:["Chaste", "Tethered"], AllowPose:["Kneel", "Horse", "KneelingSpread"]}
		
		//ItemDevices
		G = F3dcgAssets.ItemGroups.ItemDevices;
		this.SimplestVariants(G.Items.InflatableBodyBag, ["Light", "Inflated", "Bloated", "Max"]);
		this.SimplestVariants(G.Items.TeddyBear, ["Bear", "Kitty", "Pony", "Pup", "Fox", "Bunny"]);
		
		//ItemEars
		G = F3dcgAssets.ItemGroups.ItemEars;
		V = this.SimplestVariants(G.Items.HeadphoneEarPlugs, ["Off","Light","Heavy"]);
		V.Light.Property = {Effect : ["DeafLight"]};
		V.Light.Property = {Effect : ["DeafHeavy"]};
		
		
		//ItemFeet
		G = F3dcgAssets.ItemGroups.ItemFeet;
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
		G = F3dcgAssets.ItemGroups.ItemHead;
		V = this.SimplestVariants(G.Items.DuctTape, ["Double", "Wrap", "Mummy"]);
		V.Double.Property = {Effect:["BlindNormal", "Prone"]};
		V.Wrap.Property = {Effect:["BlindNormal", "Prone"]};
		V.Mummy.Property = {Hide:["HairFront", "HairBack"], Effect:["GagNormal", "BlindNormal", "Prone"], Block:["ItemMouth", "ItemMouth2", "ItemMouth3", "ItemEars"]};
		
		//ItemLegs
		G = F3dcgAssets.ItemGroups.ItemLegs;
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
			G = F3dcgAssets.ItemGroups[GroupName];
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
		G = F3dcgAssets.ItemGroups.ItemTorso;
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
	
	,SimplestVariants(A, variantNames){
		A.Variants = {};
		variantNames.forEach(variantName => {A.Variants[variantName] = {Name:variantName, iconUrl:this.IconUrl(A, variantName)}});
		return A.Variants;
	}
	,IconUrl(A, VariantItemName){
		return F3dcgAssets.F3DCG_TYPE_ICON_BASE + A.Group + "/" + A.Name + "/" + VariantItemName + ".png";
	}	
}













