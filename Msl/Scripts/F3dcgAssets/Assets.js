//can not use strict because needs to be evaled by server code

var F3dcgAssets = {};

	//Constants (group type) are singular, members are plural
F3dcgAssets.BODY = "body"
F3dcgAssets.EXPRESSION = "expressions" 	//can be changed at any time
F3dcgAssets.CLOTH = "clothes"			//few restrictions
F3dcgAssets.ACCESSORY = "accessories" 	//do not block restraints and needed for the remove function
F3dcgAssets.BONDAGE_TOY = "bondageToys" 	//have forced poses, effects, blocks
	
F3dcgAssets.POSE_NONE = "None";
F3dcgAssets.POSE_KNEEL = "Kneel";
	
F3dcgAssets.F3DCG_ASSET_BASE = "../BondageClub/Assets/Female3DCG/"//
F3dcgAssets.F3DCG_TYPE_ICON_BASE = "../BondageClub/Screens/Inventory/"//ItemArms/OrnateCuffs/Elbow.png None.png
	
F3dcgAssets.Padlocks = {}
F3dcgAssets.Poses = {}	
F3dcgAssets.Activities = {}	
F3dcgAssets.AssetGroups = {}
F3dcgAssets.ItemNameToGroupNameMap = {}

F3dcgAssets.IgnoreItems = [
	"VibratorRemote" //Handled separately
	,"VibratingWand","LeatherWhip", "LeatherCrop", "SpankingToys"//Used via hand held actions
	,"CollarShockUnit"//TODO -- implement instant (shock) actions
	,"ClitAndDildoVibratorbelt"//Two vibrating actions is too small of a use case.
	,"MetalCuffsKey", "MetalCuffs"//not worth the effort
];
F3dcgAssets.IgnoreGroups = ["ItemMisc"]	
F3dcgAssets.BodyItemsGroups = ["Eyes", "Mouth", "Nipples", "Pussy", "HairFront", "HairBack"]
F3dcgAssets.ExpressionGroups = ["Eyebrows", "Blush", "Fluids", "Emoticon"]	
F3dcgAssets.ClothesGroups = []//Asset group has a meaningful flag
F3dcgAssets.AccessoriesGroups = ["TailStraps", "Wings", "HairAccessory1", "HairAccessory2"]
F3dcgAssets.BondageToyGroups = [
	"ItemHead", "ItemEars", "ItemMouth", "ItemMouth2", "ItemMouth3", "ItemNeck"
	,"ItemNeckAccessories", "ItemNeckRestraints"
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
	//this.InitLocks(); 
	this.InitClothesGroupsNames();
	this.InitGroupTypes();
	this.InitItems();
	this.InitPoses();
	this.InitVariants();
	this.InitFreeAndQuestClothes();
	this.InitPrerequisites();
	this.InitVibes();
	this.InitActivities();
	
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
	for(var groupName in appearanceUpdate){
		var appearanceItem = appearanceUpdate[groupName];
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		
		if(!AssetGroup)  throw groupName;
		
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
		
		//Removal of things such as leash and collar tag
		if(! appearanceItem && AssetGroup.RemoveOtherGroup){
			for(var i = 0; i < AssetGroup.RemoveOtherGroup.length; i++){
				var otherGroupName = AssetGroup.RemoveOtherGroup[i];
				playerTarget.appearance[F3dcgAssets.AssetGroups[otherGroupName].type][otherGroupName] = null;
			}
		}
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
	var groupName = F3dcgAssets.ItemNameToGroupNameMap[name];
	var AssetItem = F3dcgAssets.AssetGroups[groupName].Items[name];
	
	if(! variant){
		//during server side imorts process, assets.js finds the asset group on its own for the default variant
		if(AssetItem.Variant) variant = Object.values(AssetItem.Variant)[0].Name;
	}
	
	var item = {name:name,color:color,variant:variant}
	
	if(AssetItem.CommonVibe) item.vibeLevel = 0;

	return item;
}
