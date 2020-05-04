'use strict'

var F3dcgAssetsAdd = {
	Init(){
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
		
		AssetFemale3DCG.forEach(AssetItemGroup => {
			F3dcgAssets.ItemGroups[AssetItemGroup.Group] = AssetItemGroup;
			
			//var bodyTypes = ["BodyUpper", "BodyLower", "Height", "Hands", "HairFront", "HairBack", "Eyes", "Mouth", "Nipples", "Pussy"];
			var expressionTypes = ["Eyebrows", "Blush", "Fluids", "Emoticon"];
			var accessorries = ["ClothAccessory", "HairAccessory1", "HairAccessory2", "Glasses", "TailStraps", "Wings", "ItemMisc"];
			var toys = ["ItemEars"];
			
			if(expressionTypes.includes(AssetItemGroup.Group)){
				AssetItemGroup.type = F3dcgAssets.EXPRESSION;
			}else if(accessorries.includes(AssetItemGroup.Group)){
				AssetItemGroup.type = F3dcgAssets.ACCESSORY			
			}else if(toys.includes(AssetItemGroup.Group)){
				AssetItemGroup.type = F3dcgAssets.TOY			
			}else if(false === AssetItemGroup.AllowNone){
				AssetItemGroup.type = F3dcgAssets.BODY;
			}else if(AssetItemGroup.IsRestraint){
				AssetItemGroup.type = F3dcgAssets.RESTRAINT;
			}else if(AssetItemGroup.Clothing){
				AssetItemGroup.type = F3dcgAssets.CLOTHING;
			}else{
				AssetItemGroup.type = F3dcgAssets.TOY;
			}
			
			AssetItemGroup.Items = {};
			if(AssetItemGroup.type == F3dcgAssets.EXPRESSION){
				AssetItemGroup.Items["None"] = {Name:"None", iconUrl:AssetItemGroup.Group + "/Icon.png"};
				AssetItemGroup.AllowExpression.forEach(exp => AssetItemGroup.Items[exp] = {Name:exp,iconUrl:AssetItemGroup.Group + "/" + exp + "/Icon.png"});
			}else{
				for(var j = 0; j < AssetItemGroup.Asset.length; j++){
					let AssetItem = AssetItemGroup.Asset[j];
					if(typeof(AssetItem) === "string") AssetItem = {Name:AssetItem};
					
					if(F3dcgAssets.UNIMPLEMENTED_ITEMS.includes(AssetItem.Name)) continue;
					
					AssetItem.Group = AssetItemGroup.Group
					AssetItemGroup.Items[AssetItem.Name] = AssetItem;
					
					switch(AssetItemGroup.type){
						case F3dcgAssets.RESTRAINT: case F3dcgAssets.CLOTHING: case F3dcgAssets.TOY: case F3dcgAssets.ACCESSORY:
							AssetItem.iconUrl = AssetItem.Name == "None" ? false : AssetItem.Group + "/Preview/" + AssetItem.Name + ".png";
						break;
						case F3dcgAssets.BODY:
						case F3dcgAssets.MISC:
							AssetItem.iconUrl = "./Icons/Icon.png";
						break;
						default: //console.log(AssetItem);
					}
					
				}
			}
		});
		
		PoseFemale3DCG.forEach(pose => {
			F3dcgAssets.Poses[pose.Name] = pose;
			F3dcgAssets.Poses[pose.Name].priority = pose.Name == "Kneel" ? 1 : 0;
		});
	}
	
	,InitAppearance(){
		return {items:{},left:0,top:0,rotate:0,scale:1.0,poses:[],effects:[],blocks:[]}
	}
	
	,InitAppearanceItem(AppItem, AssetItem, AssetItemGroup){
		var appearanceItem = {
			itemName:AppItem.Name
			,itemGroupName:AppItem.Group
			,itemGroupTypeName:AssetItemGroup.type
			,priority : AssetItem.Priority ? AssetItem.Priority : AssetItemGroup.Priority
			,left : (AssetItem.Left ? AssetItem.Left : AssetItemGroup.Left) || 0
			,top : (AssetItem.Top ? AssetItem.Top : AssetItemGroup.Top) || 0
			,color:null
			,fullAlpha:true
			,layers:[]//url and allow colorize
		}
		
		if(AppItem.Property?.Type)	appearanceItem.itemVariantName = AppItem.Property.Type;
		if(AppItem.Property?.Restrain)	appearanceItem.itemVariantName = AppItem.Property.Restrain;
		if(AssetItem.Variants && ! appearanceItem.itemVariantName) appearanceItem.itemVariantName = Object.keys(AssetItem.Variants)[0];
		
		return appearanceItem;
	}
	
	
	,InitAppearanceItemLock(itemNameLock, playerId){
		var lock = {itemName:itemNameLock,originPlayerId:playerId};
		if(itemNameLock.includes("Timer"))
			lock.timer = {showTimer:true, removeItem:false, time:Date.now() + 1000*60*5}
		return lock;
	}
	
	,TranslateAppearanceItem(appearanceItem, translation){
		if(!translation) return;
		appearanceItem.left += translation.left;
		appearanceItem.top += translation.top;
	}
	
	,AdjustEyes(appearanceItemEyes){
		appearanceItemEyes.fullAlpha = false;
		var l = appearanceItemEyes.layers[0];
		l.blinking = true;
		appearanceItemEyes.layers.unshift({url:l.url.replace("Eyes/", "Eyes/Closed/"), colorize:false});
	}
	
	
	,LockAppearanceItem(appearanceItem, AppItem, AssetItem, mainPlayerAccount, locationPlayer){
		if(AppItem.Property?.LockedBy){
			var AssetItemLock = F3dcgAssets.Padlocks[AppItem.Property.LockedBy];
			
			appearanceItem.lock = {itemName:AppItem.Property.LockedBy,originPlayerId:AppItem.Property.LockMemberNumber, unlockable:false}
			var l = appearanceItem.lock;
			
			if(l.itemName != "TimerPadlock"){//Not even owner can unlock the timer padlocks		
				var InventoryItemKey = mainPlayerAccount.Inventory.find(InventoryItem => InventoryItem.Group == "ItemMisc" && InventoryItem.Name == l.itemName.replace("Timer", "") + "Key");
				if(InventoryItemKey){
					if(mainPlayerAccount.id == locationPlayer.ownerId) l.unlockable = true;//lover and owner are equal
					if(mainPlayerAccount.id == locationPlayer.loverId) l.unlockable = true;
					if(mainPlayerAccount.IsMistress() && !l.itemName.includes("Owner") && !l.itemName.includes("Lover")) l.unlockable = true;
					if(!l.itemName.includes("Mistress") && !l.itemName.includes("Owner") && !l.itemName.includes("Lover")) l.unlockable = true;
				}
			}
			
			if(AppItem.Property.RemoveTimer){
				l.timer = {
					time:AppItem.Property.RemoveTimer
					,showTimer: l.itemName == "TimerPadlock" || AppItem.Property.ShowTimer
					,maxTime:AssetItemLock.MaxTimer
					,removeItem:AppItem.Property.RemoveItem
					,enableActions:AppItem.Property.EnableRandomInput
					,actions: l.unlockable ? AssetItemLock.KeyHolderActions : AppItem.Property.EnableRandomInput ? AssetItemLock.KeylessActions : []
					,management: l.unlockable ? {showTimer:AppItem.Property.ShowTimer, removeItem:AppItem.Property.RemoveItem, enableActions:AppItem.Property.EnableRandomInput} : {}
				}
			}
		}
		else if(AssetItem.AllowLock){
			appearanceItem.allowedLocks = [];
			
			["MetalPadlock", "IntricatePadlock", "TimerPadlock"].forEach(lockItemName => {
				if(locationPlayer.Inventory.find(InventoryItem => InventoryItem.Name == lockItemName))
					appearanceItem.allowedLocks.push(lockItemName);
			});
				
			if(mainPlayerAccount.id == locationPlayer.ownerId){
				["OwnerPadlock", "OwnerTimerPadlock"].forEach(lockItemName => {
					if(locationPlayer.Inventory.find(InventoryItem => InventoryItem.Name == lockItemName))
						appearanceItem.allowedLocks.push(lockItemName);
				});
			}
			
			if(mainPlayerAccount.id == locationPlayer.loverId){
				["LoversPadlock", "LoversTimerPadlock"].forEach(lockItemName => {
					if(locationPlayer.Inventory.find(InventoryItem => InventoryItem.Name == lockItemName))
						appearanceItem.allowedLocks.push(lockItemName);
				});
			}
			
			if(mainPlayerAccount.IsMistress()){
				["MistressPadlock", "MistressTimerPadlock"].forEach(lockItemName => {
					if(locationPlayer.Inventory.find(InventoryItem => InventoryItem.Name == lockItemName))
						appearanceItem.allowedLocks.push(lockItemName);
				});
			}
		}
	}
	
	
	,ColorizeApearanceItem(appearanceItem, AppItem, assetItemGroup){
		if(assetItemGroup.AllowColorize !== false){
			appearanceItem.colorize = true;
			if(AppItem.Color && AppItem.Color != "Default"){
				appearanceItem.color = new Util.Color.Instance(Util.Color.TYPE_HEXSTRING, AppItem.Color);
				if(assetItemGroup.Group == "Eyes") appearanceItem.color.lightness = 100;
			}
		}
	}
	
	,DeconvertItem(appearanceItem){
		var AppItem = {Group:appearanceItem.itemGroupName};
		
		if(appearanceItem.itemGroupTypeName == F3dcgAssets.EXPRESSION){
			AppItem.Name = appearanceItem.itemGroupName;
			AppItem.Property = {Expression:appearanceItem.itemName};
			return AppItem;
		}
		
		AppItem.Name = appearanceItem.itemName;
		
		if(appearanceItem.color) AppItem.Color = appearanceItem.color.ToHexString();
		
		if(appearanceItem.lock){
			if(!AppItem.Property) AppItem.Property = {};
			AppItem.Property.LockedBy = appearanceItem.lock.itemName;
			AppItem.Property.Effect = ["Lock"]; 
			AppItem.Property.LockMemberNumber = appearanceItem.lock.originPlayerId;
			
			if(appearanceItem.lock.timer){
				AppItem.Property.RemoveTimer = appearanceItem.lock.timer.time;
				AppItem.Property.RemoveItem = appearanceItem.lock.timer.removeItem;
				AppItem.Property.ShowTimer = appearanceItem.lock.timer.showTimer;
				AppItem.Property.EnableRandomInput = appearanceItem.lock.timer.enableActions;
			}
		}
		
		var AssetItem = F3dcgAssets.ItemGroups[appearanceItem.itemGroupName].Items[appearanceItem.itemName];
		if(appearanceItem.itemVariantName && appearanceItem.itemVariantName != "None"){
			if(!AppItem.Property) AppItem.Property = {};
			
			var AssetItemVariant = AssetItem.Variants[appearanceItem.itemVariantName];
			AppItem.Property.Type = appearanceItem.itemVariantName;
		}
		
		return AppItem;	
	}
}





