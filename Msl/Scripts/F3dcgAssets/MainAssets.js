//can not use strict because needs to be evaled by server code

var F3dcgAssets = {};

	//Constants (group type) are singular, members are plural
F3dcgAssets.BODY = "body"
F3dcgAssets.EXPRESSION = "expressions" 	//can be changed at any time
F3dcgAssets.CLOTH = "clothes"			//few restrictions
F3dcgAssets.ACCESSORY = "accessories" 	//do not block restraints and needed for the remove function
F3dcgAssets.BONDAGE_TOY = "bondageToys" 	//have forced poses, effects, blocks
	
F3dcgAssets.UNIMPLEMENTED_ITEMS = ["SpankingToys", "DildoPlugGag", "PlugGag"
		,"CollarNameTag", "CollarNameTagLivestock", "CollarNameTagLover"
		,"CollarNameTagOval", "CollarNameTagPet", "CollarShockUnit"]
	
F3dcgAssets.POSE_None = "None"
F3dcgAssets.POSE_KNEELEING = "Kneel"
	
F3dcgAssets.F3DCG_ASSET_BASE = "../BondageClub/Assets/Female3DCG/"//
F3dcgAssets.F3DCG_TYPE_ICON_BASE = "../BondageClub/Screens/Inventory/"//ItemArms/OrnateCuffs/Elbow.png None.png
	
F3dcgAssets.Padlocks = {}
F3dcgAssets.Poses = {}	
F3dcgAssets.AssetGroups = {}
F3dcgAssets.AssetNameToGroupNameMap = {}

F3dcgAssets.IgnoreGroups = ["ItemNeckAccessories", "ItemNeckRestraints", "ItemMisc"]	
F3dcgAssets.BodyItemsGroups = ["Eyes", "Mouth", "Nipples", "Pussy", "HairFront", "HairBack"]
F3dcgAssets.ExpressionGroups = ["Eyebrows", "Blush", "Fluids", "Emoticon"]	
F3dcgAssets.ClothesGroups = []//Asset group has a meaningful flag
F3dcgAssets.AccessoriesGroups = ["TailStraps", "Wings", "HairAccessory1", "HairAccessory2"]
F3dcgAssets.BondageToyGroups = [
	"ItemHead", "ItemEars", "ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck"
	,"ItemHands", "ItemArms"
	,"ItemBreast", "ItemTorso", "ItemPelvis"
	,"ItemLegs", "ItemFeet", "ItemBoots"
	,"ItemDevices"
	,"ItemNipples", "ItemNipplesPiercings", "ItemVulva", "ItemVulvaPiercings", "ItemButt"
]

F3dcgAssets.ClothesFree = []
F3dcgAssets.ClothesQuest = []
	
//Regular and wardrobe update limitations
F3dcgAssets.FullCharacterTypeGroups = {};
F3dcgAssets.SuitSelfTypeGroups = {};
F3dcgAssets.SuitOtherTypeGroups = {};
	
F3dcgAssets.Init = function(){
	this.InitLocks();
	this.InitClothesGroupsNames();
	this.InitGroupTypes();
	this.InitItems();
	this.InitPoses();
	this.InitVariants();
	this.InitFreeAndQuestClothes();
	
	this.FullCharacterTypeGroups[this.BODY] = this.BodyItemsGroups;
	this.FullCharacterTypeGroups[this.EXPRESSION] = this.ExpressionGroups;
	this.FullCharacterTypeGroups[this.CLOTH] = this.ClothesGroups;
	this.FullCharacterTypeGroups[this.ACCESSORY] = this.AccessoriesGroups;
	this.FullCharacterTypeGroups[this.BONDAGE_TOY] = this.BondageToyGroups;
	
	this.SuitSelfTypeGroups[this.BODY] = this.BodyItemsGroups;
	this.SuitSelfTypeGroups[this.CLOTH] = this.ClothesGroups;
	this.SuitSelfTypeGroups[this.ACCESSORY] = this.AccessoriesGroups;
	
	this.SuitOtherTypeGroups[this.CLOTH] = this.ClothesGroups;
	//this.SuitOtherTypeGroups[this.ACCESSORY] = this.AccessoriesGroups;
}
	
	
F3dcgAssets.UpdateAppearance = function(appearanceUpdate, playerTarget, playerOrigin){		
	var validationErrors = this.ValidateUpdateAppearance(appearanceUpdate, playerTarget, playerOrigin);
	
	if(validationErrors.length == 0){
		for(var groupName in appearanceUpdate){
			var appearanceItem = appearanceUpdate[groupName];
			var AssetGroup = F3dcgAssets.AssetGroups[groupName];
			
			if(!AssetGroup)  console.log(groupName);
			
			switch(AssetGroup.type){
				case F3dcgAssets.CLOTH:
				case F3dcgAssets.ACCESSORY:
				case F3dcgAssets.EXPRESSION:
				case F3dcgAssets.BODY:
				case F3dcgAssets.BONDAGE_TOY:
					playerTarget.appearance[AssetGroup.type][groupName] = appearanceItem;
				break;				
				default:
					console.log("UnimplementedType " + groupName);
			}
		}
	}else{
		throw validationErrors;//we should not get here unless a client forges an invalid request.
		//server side, exception will propagate to the response and handled there.
	}
}


F3dcgAssets.BuildExpressionAppearanceItem = function(name){
	return {name:name};
}
F3dcgAssets.BuildBodyAppearanceItem = function(name, color){
	return {name:name,color:color};
}
F3dcgAssets.BuildClothAppearanceItem = function(name, color){
	return {name:name,color:color};
}	
F3dcgAssets.BuildAccessoryAppearanceItem = function(name, color){
	return {name:name,color:color}
}
F3dcgAssets.BuildBondageToyAppearanceItem = function(name, color, variant){
	return {name:name,color:color,variant:variant}
}
