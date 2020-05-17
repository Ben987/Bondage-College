
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
F3dcgAssets.ValidateUpdateAppearance = function(appearanceUpdate, playerTarget, playerOrigin){
	var bondageToyUpdated = false;

	for(var groupName in appearanceUpdate){
		var AssetGroup = F3dcgAssets.AssetGroups[groupName];
		if(! AssetGroup) throw "GroupNotFound " + groupName;
		
		var posesEffectsBlocks, item, AssetItem;
		if(appearanceUpdate[groupName]){
			var item = appearanceUpdate[groupName];
			var itemName = item.name;
			AssetItem = AssetGroup.Items[itemName];
			if(! AssetItem) throw "ItemNotFound " + itemName;
		}
		
		switch(AssetGroup.type){//the suit type is never propagated here,itemGroupTypes, or lock change
			case F3dcgAssets.EXPRESSION:	//validate expression and body  -- self only
			
			break;
			case F3dcgAssets.BODY:		//validate expression and body  -- self only
			
			break;
			case F3dcgAssets.ACCESSORY:	//Must own.  If not self, subject to permission.
			
			break;
			
			case F3dcgAssets.CLOTH:		//Must own, or free.  if not self, subject to permission.
				if(null == posesEffectsBlocks) posesEffectsBlocks = F3dcgAssets.BuildPosesEffectsBlocks(playerTarget.appearance[F3dcgAssets.BONDAGE_TOY]);
				if(posesEffectsBlocks.blocks.includes(groupName)) throw "Blocked";
			break;
			
			case F3dcgAssets.BONDAGE_TOY: //Must own.  If not self, subject to permission.  If slef, check self bondage.  Must pass the main validation
				if(null == posesEffectsBlocks) posesEffectsBlocks = F3dcgAssets.BuildPosesEffectsBlocks(playerTarget.appearance[F3dcgAssets.BONDAGE_TOY]);
				if(bondageToyUpdated) throw "BondageToyLimitExceeded";
				if(posesEffectsBlocks.blocks.includes(groupName)) throw "Blocked";
				
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


