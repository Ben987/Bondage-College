
F3dcgAssets.BuildPosesEffectsBlocks = function(bondageToyItems){
	var result = {poses:[],effects:[],blocks:[]}
	
	for(var groupName in bondageToyItems){
		var item = bondageToyItems[groupName];
		if(! item) continue;
		var AssetGroup = F3dcgAssets.AssetGroups[groupName], AssetItem = AssetGroup.Items[item.name], AssetVariant = AssetItem.Variants ? AssetItem.Variants[item.variantName] : null;			
		
		//if(AssetItem.Height) result.top -= AssetItem.Height;
		
		if(item.variantName)
			if(! AssetItem.Variants) {console.log("Variants not defined for " + AssetItem.Name + " " + AssetItem.Group);continue;}
		
		if(AssetVariant && AssetVariant.Property && AssetVariant.Property.SetPose)
			result.poses.push(...AssetVariant.Property.SetPose);
		else if(AssetItem.SetPose)
			result.poses.push(...AssetItem.SetPose);
		
		if(AssetVariant && AssetVariant.Property && AssetVariant.Property.Effect)
			result.effects.push(...AssetVariant.Property.Effect)
		else if(AssetItem.Effect)
			result.effects.push(...AssetItem.Effect)				
		
		if(AssetVariant && AssetVariant.Property && AssetVariant.Property.Block)
			result.blocks.push(...AssetVariant.Property.Block);
		else if(AssetItem.Block)
			result.blocks.push(...AssetItem.Block)
	}
	
	return result;;
}


//All validation checks should have been performed before we arrive here, hence throwing exception
//A single validaton error invalidates the whole batch.
//1.  Check that the asset item exists
//2.  if self, allow Body, Accessory, Expression, otherwise do not permit.
//3.  for all item group types other than Expression and Body, check that item is owned by either player.
//4.  if not self, check a. player not blacklisted or ghostlisted, b. origin player either whitelisted or meets the permission setting requirement for the item group type
//5.  clothes and bondage toys are subject to additional validation rules.
//6.  TODO sanitize input.
//7.  TODO:  playerOrigin is not tied and has other prerequisites
F3dcgAssets.ValidateUpdateAppearanceOrThrow = function(appearanceUpdate, playerTarget, playerOrigin){
	var bondageToyUpdated = false;
	
	//Individual item checks
	for(var groupName in appearanceUpdate){
		//Validation step 1, check asset item exists
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		if(! AssetGroup) throw "GroupNotFound " + groupName;
		
		var posesEffectsBlocks, item, AssetItem;
		if(appearanceUpdate[groupName]){
			var item = appearanceUpdate[groupName];
			var itemName = item.name;
			AssetItem = AssetGroup.Items[itemName];
			if(! AssetItem) throw "ItemNotFound " + itemName;
		}
		
		//Check that item is owned and not blacklisted
		F3dcgAssets.ValidateItemIsOwned(item, AssetGroup.type, playerTarget, playerOrigin);
		F3dcgAssets.ValidateItemNotBlacklisted(item, playerTarget);
		
		switch(AssetGroup.type){//the suit type is never propagated here
			case F3dcgAssets.EXPRESSION:
				if(playerOrigin) throw "SelfOnly " + AssetGroup.type;
			break;
			case F3dcgAssets.BODY:
				if(playerOrigin) throw "SelfOnly " + AssetGroup.type;
			break;
			case F3dcgAssets.ACCESSORY:
				if(playerOrigin) throw "SelfOnly " + AssetGroup.type;
			break;
			
			case F3dcgAssets.CLOTH:
				if(! F3dcgAssets.DoesPlayerHavePermission(F3dcgAssets.CLOTH, playerTarget, playerOrigin)) throw "PermissionDenied " + originPlayer.id;
				if(null == posesEffectsBlocks) posesEffectsBlocks = F3dcgAssets.BuildPosesEffectsBlocks(playerTarget.appearance[F3dcgAssets.BONDAGE_TOY]);
				if(posesEffectsBlocks.blocks.includes(groupName)) throw "ItemGroupBlocked " + groupName;
			break;
			
			case F3dcgAssets.BONDAGE_TOY: //Must own.  If not self, subject to permission.  If slef, check self bondage.  Must pass the main validation
				if(! F3dcgAssets.DoesPlayerHavePermission(F3dcgAsset.CLOTH, playerTarget, playerOrigin)) throw "PermissionDenied " + originPlayer.id;			
				if(null == posesEffectsBlocks) posesEffectsBlocks = F3dcgAssets.BuildPosesEffectsBlocks(playerTarget.appearance[F3dcgAssets.BONDAGE_TOY]);
				if(bondageToyUpdated) throw "BondageToyLimitExceeded";
				if(posesEffectsBlocks.blocks.includes(groupName)) throw "ItemGroupBlocked " + groupName;
				
				if(AssetItem && AssetItem.Variant && ! AssetItem.Variant[item.variant]) throw "VariantNotFound " + item.variant;
				
				if(AssetItem && AssetItem.Prerequisite){
					for(var i = 0; i < AssetItem.Prerequisite.length; i++){
						var errorReason = F3dcgAssets.ValidatePrerequisite(AssetItem.Prerequisite[i], playerTarget.appearance, posesEffectsBlocks);
						if(errorReason.length > 0) throw errorReason;
					}
				}
			break;
			default:
				throw "UnhandledGroupType " + AssetGroup.type;
		}
	}
	return [];
}


F3dcgAssets.IsPlayerFriendListed = function(playerTarget, playerOrigin){return this.IsPlayerListed(playerTarget, playerOrigin,"friend");}
F3dcgAssets.IsPlayerBlackListed = function(playerTarget, playerOrigin){return this.IsPlayerListed(playerTarget, playerOrigin,"black");}
F3dcgAssets.IsPlayerWhiteListed = function(playerTarget, playerOrigin){return this.IsPlayerListed(playerTarget, playerOrigin,"white");}
F3dcgAssets.IsPlayerGhostListed = function(playerTarget, playerOrigin){return this.IsPlayerListed(playerTarget, playerOrigin,"ghost");}
F3dcgAssets.IsPlayerListed = function(playerTarget, playerOrigin, listType){
	if(!playerOrigin) return false;
	//if(typeof(this[key]) == "boolean") return this[key];
	return playerTarget.settings.permissions.playerLists[listType].contains(this.playerOrigin.id);
	//this[key] = this.playerTarget.settings.permissions.playerLists[listType].contains(this.playerOrigin.id))
	//return this[key];	
}
	
F3dcgAssets.IsPlayerOwner = function(playerTarget, playerOrigin){return playerTarget.clubStanding.owner.id == playerOrigin.id;}
F3dcgAssets.IsPlayerLover = function(playerTarget, playerOrigin){return playerTarget.clubStanding.lover.id == playerOrigin.id;}
F3dcgAssets.IsPlayerDomEnough = function(playerTarget, playerOrigin){return playerOrigin.clubStanding.reputation.Dominant - playerTarget.clubStanding.reputation.Dominant >= -25;}
	
F3dcgAssets.DoesPlayerHavePermission = function(permissionActionType, pT, pO){
	if(! pO) return true;	
	switch(pT.settings.permissions.actions[permissionActionType]){
		case "0": case 0: return ! this.IsPlayerGhostListed(pT, pO); //everyone except ghostlist
		case "1": case 1: return ! this.IsPlayerBlackListed(pT, pO); //everyone but blacklist
		case "2": case 2: return (! this.IsPlayerBlackListed(pT, pO) && this.IsPlayerDomEnough(pT, pO)) || this.IsPlayerWhiteListed(pT, pO); //Any Dom and whitelist
		case "3": case 3: return this.IsPlayerOwner(pT, pO) || this.IsPlayerLover(pT, pO) || this.IsPlayerWhiteListed(pT, pO); //Owner, lover, whitelist
		case "4": case 4: return this.IsPlayerOwner(pT, pO) || this.IsPlayerLover(pT, pO);  //Owner, lover
		case "5": case 5: return this.IsPlayerOwner(pT, pO); //Owner only		
	}
	return this[key];
}


F3dcgAssets.ValidateItemNotBlacklisted = function(item, playerTarget) {
	if(!item) return;
	if(playerTarget.settings.permissions.itemLists.black.includes(item)) throw "ItemBlacklisted " + item.name;
}

F3dcgAssets.ValidateItemIsOwned = function(item, groupType, playerTarget, playerOrigin) {
	if(null == item) return;
	if(groupType == F3dcgAssets.BODY || groupType == F3dcgAssets.EXPRESSION) return;
	if(groupType == F3dcgAssets.CLOTH && F3dcgAssets.ClothesFree.includes(item.name)) return;
	if(! playerTarget.inventory[groupType].includes(item.name) && ! (playerOrigin && playerOrigin.inventory[groupType].includes(item.name)))
		throw "ItemNotOwned " + item.name;
}

F3dcgAssets.ValidatePrerequisite = function(prerequisite, appearance, posesEffectsBlocks) {
	// Basic prerequisites that can apply to many items
	var c = appearance[F3dcgAssets.CLOTH];
	var b = appearance[F3dcgAssets.BONDAGE_TOY];
	
	var poses = posesEffectsBlocks.poses;
	var blocks = posesEffectsBlocks.blocks;
	var effects = posesEffectsBlocks.effects;
	
	switch(prerequisite){
		//Item group must be empty
		case "NoItemFeet":  	return b.ItemFeet ? "MustFreeFeetFirst" : "";
		case "NoItemLegs":  	return b.ItemLegs ? "MustFreeLegsFirst" : "";
		case "NoItemHands":	  	return b.ItemHands ? "MustFreeHandsFirst" : "";
		case "NakedClothLower":	return c.ClothLower ? "RemoveClothesForItem" : "";
		case "NakedFeet":	  	return b.ItemBoots || c.Socks || c.Shoes ? "RemoveClothesForItem" : "";
		case "NakedHands":	  	return b.ItemHands || c.Gloves ? "RemoveClothesForItem" : "";
		case "DisplayFrame":	
			if(b.ItemArms || b.ItemLegs || b.ItemFeet || b.ItemBoots) return "RemoveRestraintsFirst";
			if(c.Cloth || c.ClothLower || c.Shoes) return "RemoveClothesForItem";
			return "";
		
		//specific item must be absent 
		case "NotChained":		return b.ItemNeckRestraints && b.ItemNeckRestraints.itemName == "CollarChainLong" ? "RemoveChainForItem" : "";
		case "NoFeetSpreader":	return b.ItemFeet && b.ItemFeet.itemName == "SpreaderMetal" ? "CannotBeUsedWithFeetSpreader" : "";
		case "CannotHaveWand":	return b.ItemArms && b.ItemArms.itemName == "FullLatexSuit" ? "CannotHaveWand" : "";
		case "CannotBeSuited":	return b.ItemVulva && b.ItemVulva.itemName == "WandBelt" ? "CannotHaveWand" : "";
		
		case "ToeTied":
			return b.ItemFeet && b.ItemFeet.itemName == "SpreaderMetal" 
					|| b.ItemLegs && b.ItemLegs.itemName == "WoodenHorse" 
					|| b.ItemDevices && b.ItemDevices.itemName == "OneBarPrison" 
					|| b.ItemDevices && b.ItemDevices.itemName == "SaddleStand"
				? "LegsCannotClose" : "";
		
		//an item group must be filled
		case "Collared":		return b.ItemNeck ? "" : "MustCollaredFirst";
		
		//a pose shouldn't be in the list
		case "LegsOpen":			return poses.includes("LegsClosed")		? "LegsCannotOpen" : "";
		case "NotKneeling":			return poses.includes("Kneel")			? "MustStandUpFirst" : "";
		case "NotHorse":			return poses.includes("Horse")			? "CannotBeUsedWhenMounted" : "";
		case "NotHogtied":			return poses.includes("Hogtied")		? "ReleaseHogtieForItem" : "";
		case "NotYoked":			return poses.includes("Yoked")			? "CannotBeUsedWhenYoked" : "";
		case "NotKneelingSpread":	return poses.includes("KneelingSpread")	? "MustStandUpFirst" : "";
		case "NotSuspended":		return poses.includes("Suspension")		? "RemoveSuspensionForItem" : "";
		case "AllFours":			return poses.includes("AllFours") 		? "StraitDressOpen" : "";
		case "StraitDressOpen":		return poses.includes("StraitDressOpen")? "StraitDressOpen" : "";
		
		//effect shouldn't be in the list
		case "CanKneel":	return effects.includes("BlockKneel")? "MustBeAbleToKneel" : "";
		case "NotMounted":	return effects.includes("Mounted")	? "CannotBeUsedWhenMounted" : "";
		case "NotChaste":	return effects.includes("Chaste")	? "RemoveChastityFirst" : "";
		case "NotShackled":	return effects.includes("Shackled")	? "RemoveShacklesFirst" : "";
		
		//Clothes may block
		case "AccessTorso":	return this.AppItemsExpose(c, ["Cloth"], "ItemTorso") ? "" : "RemoveClothesForItem";
		case "AccessBreast": this.AppItemsExpose(c, ["Cloth", "Bra"], "ItemBreast") ? "" : "RemoveClothesForItem";
		case "AccessBreastSuitZip": return this.AppItemsExpose(c, ["Cloth", "Suit"], "ItemNipplesPiercings") ? "" : "UnZipSuitForItem";
		case "AccessVulva": 
			var exposed = this.AppItemsExpose(c, ["ClothLower", "SuitLower", "Panties", "Socks"], "ItemVulva");
			var blocked = this.AppItemsBlock(c, ["Socks"], "ItemVulva");
			return (blocked || ! exposed) ? "RemoveClothesForItem" : "";
		
		case "GagUnique":
			var appliedGag = b.ItemMouth ?  F3dcgAssets.AssetGroups.ItemMouth.Items[b.ItemMouth.itemName] : null;
			if(appliedGag && appliedGag.Prerequisite.includes("GagFlat")) return "CannotBeUsedOverFlatGag"
			if(appliedGag && appliedGag.Prerequisite.includes("GagCorset")) return "CannotBeUsedOverFlatGag"
			
			var appliedGag2 = b.ItemMouth ?  F3dcgAssets.AssetGroups.ItemMouth2.Items[b.ItemMouth.itemName] : null;
			if(appliedGag2 && appliedGag2.Prerequisite.includes("GagFlat")) return "CannotBeUsedOverFlatGag"
			if(appliedGag2 && appliedGag2.Prerequisite.includes("GagCorset")) return "CannotBeUsedOverFlatGag"
			
			return "";
		
		case "AccessVulvaSuitZip":
		case "GagFlat":
		case "GagCorset":
		case "NoItemArms":
		case "NoHorse":
			return "";//TODO
		
		default: 
			throw "UnhandledCase " + prerequisite;
	}
	
	//if (Prerequisite == "CannotBeHogtiedWithAlphaHood") return ((InventoryGet(C, "ItemHead") != null) && (InventoryGet(C, "ItemHead").Asset.Prerequisite != null) && (InventoryGet(C, "ItemHead").Asset.Prerequisite.indexOf("NotHogtied") >= 0)) ? "CannotBeHogtiedWithAlphaHood" : "";
	return "";
}


F3dcgAssets.AppItemsExpose = function(appearanceItems, groups, exposition){
	for(var i = 0; i < groups.length; i++){
		if(! appearanceItems[groups[i]]) continue;
		var assetItem = F3dcgAssets.AssetGroups.Cloth.Items[appearanceItems[groups[i]].itemName];
		if(assetItem && assetItem.Expose && !assetItem.Expose.includes(exposition)) return false;
	}
	return true;
}
	
F3dcgAssets.AppItemsBlock = function(appearanceItems, groups, expositiion){
	for(var i = 0; i < groups.length; i++){
		if(! appearanceItems[groups[i]]) continue;			
		var assetItem = F3dcgAssets.AssetGroups.Cloth.Items[appearanceItems[groups[i]].itemName];
		if(assetItem && assetItem.Block && !assetItem.Block.includes(exposition)) return false;
	}
	return false;
}


