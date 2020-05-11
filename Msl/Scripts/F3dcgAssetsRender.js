'use strict'

var F3dcgAssetsRender = {

	InitRenderItem(AssetItemGroup, AssetItem){
		var renderItem = {
			priority : AssetItem?.Priority ? AssetItem.Priority : AssetItemGroup.Priority
			,left : (AssetItem?.Left ? AssetItem.Left : AssetItemGroup.Left) || 0
			,top : (AssetItem?.Top ? AssetItem.Top : AssetItemGroup.Top) || 0
			,color:null
			,fullAlpha:AssetItemGroup.FullAlpha === false ? false : true
			,layers:[]//url and allow colorize
		}
		
		return renderItem;
	}
	
	,TranslateRenderItem(renderItem, translation){
		if(!translation) return;
		renderItem.left += translation.left;
		renderItem.top += translation.top;
	}
	
	
	,BuildRenderItem(AssetItemGroup, body, appearanceItemEffects, appearanceItem){
		var AssetItem = AssetItemGroup.Items[appearanceItem.name];
		
		var renderItem = this.InitRenderItem(AssetItemGroup, AssetItem);
		
		this.TranslateRenderItem(renderItem, appearanceItemEffects.itemGroupsToTranslateByPose[AssetItemGroup.Group]);
		
		var posePart = this.GetPoseUrlPart(AssetItemGroup, AssetItem, appearanceItemEffects.poses);
		var variantPart = appearanceItem.variantName ?  appearanceItem.variantName : "";
		var sizePart = AssetItemGroup.useBodySize  && ! (AssetItem.IgnoreParentGroup === true) ? "_" + body[AssetItemGroup.useBodySize] : "";
		
		var groupPart = AssetItemGroup.Group +"/";
		var itemPart = appearanceItem.name;
			
			if(AssetItem.Layer) {
				AssetItem.Layer.forEach(AssetItemLayer => {					
					/*if(AssetItem.Variants){
						console.log(AssetItemLayer.Name  + " " + appearanceItem.itemVariantName);
						
						var isDefaultVariant = appearanceItem.itemVariantName == Object.keys(AssetItem.Variants)[0];
						var isDefaultLayer = !AssetItemLayer.AllowTypes;
						
						if(isDefaultVariant && AssetItemLayer.AllowTypes?.includes(""))
							variantPart = "";
						else if(AssetItemLayer.AllowTypes && !AssetItemLayer.AllowTypes.includes(appearanceItem.itemVariantName)) 
							return;
						else if(AssetItemLayer.AllowTypes && !AssetItemLayer.AllowTypes.includes(appearanceItem.itemVariantName))
							variantPart = AssetItemLayer.Name;
						else
							variantPart = "";
						
					}*/
					
					if(posePart) variantPart = ""; //ornate cuffs
					
					var urlPartLayerName = "_" + AssetItemLayer.Name;
					renderItem.layers.push({
						colorize:AssetItemLayer.AllowColorize ? true : false
						,url:F3dcgAssets.F3DCG_ASSET_BASE + groupPart + posePart + itemPart + sizePart + urlPartLayerName + variantPart + ".png"
					});
				});
				//if(AppItem.lock) item.urlLock = groupPart + posePart + itemPart + "_Lock.png";  Looks like layered items never have locks rendered
			} else {
				if(AssetItem.Variants)
					variantPart = variantPart == Object.keys(AssetItem.Variants)[0] ? "" : variantPart;
				
				if(posePart) variantPart = ""; //Leather cuffs				
				
				var url = F3dcgAssets.F3DCG_ASSET_BASE + groupPart + posePart + itemPart + sizePart + variantPart + ".png";
				renderItem.layers.push({url:url, colorize: true});
				
				//if(appearanceItem.lock) appearanceItem.layers.push({url:F3dcgAssets.F3DCG_ASSET_BASE + groupPart + posePart + itemPart + "_Lock.png", colorize:false});
			}
		
		if(AssetItemGroup.AllowColorize !== false){
			renderItem.colorize = true;
			if(appearanceItem.color && appearanceItem.color != "Default"){
				renderItem.color = new Util.Color.Instance(Util.Color.TYPE_HEXSTRING, appearanceItem.color);
				//if(AssetItemGroup.Group == "Eyes") appearanceItem.color.lightness = 100;
			}
		}
		
		return renderItem;
	}
	
	
	,BuildRenderItems(appearanceItems, body, appearanceItemEffects){
		var renderItemList = [];
		for(var groupName in appearanceItems){
			var appearanceItem = appearanceItems[groupName];
			if(! appearanceItem) continue;
			
			if(appearanceItemEffects.itemGroupsToHideByPose.includes(groupName)) continue;
			if(appearanceItemEffects.itemGroupsToHideByItem.includes(groupName)) continue;
			if(appearanceItemEffects.itemsToHideByItems.includes(appearanceItem.name)) continue;
			
			//Items such as headphones are not rendered, the layer array is empty
			var AssetItemGroup = F3dcgAssets.AssetGroups[groupName];
			var AssetItem = AssetItemGroup.Items[appearanceItem.name];
			if(! AssetItemGroup.Wear && (AssetItem.Visible === false || AssetItemGroup.Visible === false)) continue;
			
			renderItemList.push(this.BuildRenderItem(AssetItemGroup, body, appearanceItemEffects, appearanceItem));
			
			if(groupName == "Eyes"){
				var renderItemEyes = renderItemList[renderItemList.length - 1];
				var layer = renderItemEyes.layers[0];
				renderItemEyes.layers[0].blinking = true;
				renderItemEyes.layers.unshift({url:renderItemEyes.layers[0].url.replace("Eyes/", "Eyes/Closed/"), colorize:false});
			}
		}
		
		return renderItemList;
	}
	
	
	,GetPoseUrlPart(AssetItemGroup, AssetItem, currentPoses){
		var urlPartPose = "";
		var allowedPoses = [];
		if(AssetItemGroup?.AllowPose) AssetItemGroup.AllowPose.forEach(poseName => allowedPoses.push(poseName));
		if(AssetItem?.AllowPose) AssetItem.AllowPose.forEach(poseName => allowedPoses.push(poseName));
		currentPoses.forEach(poseName => {if(allowedPoses.includes(poseName)) urlPartPose = poseName + "/";});	
		return urlPartPose;
	}
	
	
	,BuildExpressionRenderItems(expressionItems, appearanceItemEffects){
		var renderItems = [];
		for(var groupName in expressionItems){
			var AssetItemGrop = F3dcgAssets.AssetGroups[groupName];
			var renderItem = this.InitRenderItem(AssetItemGrop);
			if(expressionItems[groupName] == groupName)
				renderItem.layers.push({colorize:false, url:F3dcgAssets.F3DCG_ASSET_BASE + groupName + "/" + AssetItemGrop.Asset[0] + ".png"});//Because Eyebrows1 are special case
			else
				renderItem.layers.push({colorize:false, url:F3dcgAssets.F3DCG_ASSET_BASE + groupName + "/" + expressionItems[groupName]+"/" + AssetItemGrop.Asset[0] + ".png"});//Because Eyebrows1 are special case
			renderItems.push(renderItem);
		}
		
		return renderItems;
	}
	
	,BuildBodyRenderItems(body, appearanceItemEffects){
		var renderBodyUpper = this.InitRenderItem(F3dcgAssets.AssetGroups.BodyUpper);
		var poseUrlPart = this.GetPoseUrlPart(F3dcgAssets.AssetGroups.BodyUpper, null, appearanceItemEffects.poses);
		renderBodyUpper.layers.push({colorize:false, url:F3dcgAssets.F3DCG_ASSET_BASE + "BodyUpper/" + poseUrlPart + body.upperSize + "_" + body.color + ".png"});
		
		var renderBodyLower = this.InitRenderItem(F3dcgAssets.AssetGroups.BodyLower);
		var poseUrlPart = this.GetPoseUrlPart(F3dcgAssets.AssetGroups.BodyLower, null, appearanceItemEffects.poses);
		renderBodyLower.layers.push({colorize:false, url:F3dcgAssets.F3DCG_ASSET_BASE + "BodyLower/" + poseUrlPart + body.lowerSize + "_" + body.color + ".png"});
		
		var renderHands = this.InitRenderItem(F3dcgAssets.AssetGroups.Hands);
		var poseUrlPart = this.GetPoseUrlPart(F3dcgAssets.AssetGroups.Hands, null, appearanceItemEffects.poses);
		renderHands.layers.push({colorize:false, url:F3dcgAssets.F3DCG_ASSET_BASE + "Hands/" + poseUrlPart + "Default_" + body.color + ".png"});
		
		var renderItems = [renderBodyUpper, renderBodyLower, renderHands];
		renderItems.push(... this.BuildRenderItems(body.items, body, appearanceItemEffects));
		return renderItems;
	}
	
	
	,BuildPlayerRender(appearance){
		var appearanceItemEffects = F3dcgAssets.BuildAppearanceItemsEffects(appearance);
		
		var renderItemList = [];
		renderItemList.push(...this.BuildBodyRenderItems(appearance.body, appearanceItemEffects));
		renderItemList.push(...this.BuildRenderItems(appearance.clothes, appearance.body, appearanceItemEffects));
		renderItemList.push(...this.BuildRenderItems(appearance.bondageToys, appearance.body, appearanceItemEffects));
		renderItemList.push(...this.BuildExpressionRenderItems(appearance.expressions, appearance.body, appearanceItemEffects));
		renderItemList.push(...this.BuildRenderItems(appearance.accessories, appearance.body, appearanceItemEffects));
		
		renderItemList.sort((item1, item2) => {return item1.priority - item2.priority;});
		return {
			top:appearanceItemEffects.top
			,rotate:appearanceItemEffects.rotate
			,scale:appearanceItemEffects.scale
			,items:renderItemList
		};
	}
}