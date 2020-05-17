'use strict'

var LocationFocusView = {
	updateDelegate:null

	,mainContainer:null
	,wardrobeContainer:null
	,figureContainer:null
	,itemSelectionContainer:null
	,itemActionButtonsContainer:null
	,itemGroupSelectionContainer:null
	
	,selectedItemGroupTypeName:F3dcgAssets.CLOTHING
	,selectedItemGroupName:"Cloth"
	,selectedItemName:null
	
	,itemActionViews:{"Color":null, "Variant":null, "Lock":null, "Remote":null, "Direct":null, "Arousal":null}
	,selectedAction:"Color"

	,Init(){}
	,OnScreenChange(){}
	,Interrupt(){
		this.updateDelegate?.Invalidate();
		this.updateDelegate = this.undefined;
		this.mainContainer?.parentNode?.removeChild(this.mainContainer);
		this.mainContainer = null;
		this.wardrobeContainer = null;
	}
	,UnInit(){}
	
	,Commit(){
		if(this.updateDelegate.HasChanges()){
			LocationController.UpdatePlayer(this.updateDelegate);
			this.Interrupt();
		}else
			this.ShowErrors(["No changes"]);
	}
	,Undo(){
		this.ShowErrorsOrPlayer(this.updateDelegate.Undo());
	}
	
	,Cancel(){LocationFocusView.Interrupt();}
	
	,PreSetSelections(itemGroupTypeName, itemGroupName){
		if(itemGroupTypeName) LocationFocusview.selectedItemGroupTypeName = itemGroupTypeName;
		if(itemGroupName) LocationFocusview.selectedItemGroupName = itemGroupName;
	}
	
	,Focus(player){
		this.Interrupt();
		this.updateDelegate = player.GetUpdateDelegate();
		this.mainContainer = Util.CreateElement({parent:LocationController.inputContainer, template:"FocusSelfTemplate"});
		
		this.figureContainer = Util.GetFirstChildNodeByName(this.mainContainer, "figureContainer");
		this.itemSelectionContainer = Util.GetFirstChildNodeByName(this.mainContainer, "itemSelection");
		this.itemActionButtonsContainer = Util.GetFirstChildNodeByName(this.mainContainer, "itemActionButtons");
		this.itemGroupSelectionContainer = Util.GetFirstChildNodeByName(this.figureContainer, "itemGroupSelection");
		/*
		if(MainController.playerAccount.profileSettings.focusTransparentBackground){
			this.mainContainer.classList.add("transparent");
			this.mainContainer.style.backgroundImage  = "";
		}else{
			this.mainContainer.classList.remove("transparent");
			this.mainContainer.style.backgroundImage = "url('" + LocationController.backgroundContainer.src + "')";
		}*/
		
		for(var actionName in this.itemActionViews){
			var containerElement = Util.GetFirstChildNodeByName(this.mainContainer, "item"+actionName+"Actions");
			var constructorFunction = window[actionName + "ActionView"];
			if(constructorFunction && containerElement)
				this.itemActionViews[actionName] = new constructorFunction(containerElement, this["ItemActionCallback" + actionName]);
			else
				console.log("invalid conf for " + actionName + " " + containerElement + " " + constructorFunction);
		}
		
		this.BuildPlayerFigureAndIconsAndEvents();
	}
	
	,ShowErrorsOrPlayer(validationErrors){
		if(validationErrors?.length === 0){
			this.ShowPlayer();
		}else{
			this.ShowErrors(validationErrors);
		}
		
		this.UpdateControlAndActionButtons();
	}
	
	,ShowPlayer(){
		this.figureContainer.removeChild(this.figureContainer.figure);
		this.BuildPlayerFigureAndIconsAndEvents();
	}
	
	,ShowErrors(validationErrors){
		validationErrors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.figureContainer
				,innerHTML:error
				,className:"validation_message_fadout"
			});
			setTimeout(() => {errorDiv.parentNode.removeChild(errorDiv);}, 4000);
		});
	}
	
	,BuildPlayerFigureAndIconsAndEvents(){
		LocationController.delegates.view.BuildPlayerFigure(this.figureContainer, this.updateDelegate.render);
		
		Util.MoveNodeToEndOfList(this.itemGroupSelectionContainer);
		
		var itemGroupSelectionIconContainer = Util.GetFirstChildNodeByName(this.mainContainer, "itemGroupTypeSelection");
		for(let itemGroupTypeName in this.updateDelegate.items){
			var icon = Util.GetFirstChildNodeByName(itemGroupSelectionIconContainer, itemGroupTypeName);
			
			if(! icon) console.log(itemGroupTypeName);
			icon.addEventListener("click", (e) => this.OnItemGroupTypeClick(itemGroupTypeName));
			
			if(itemGroupTypeName == this.selectedItemGroupTypeName){
				this.OnItemGroupTypeClick(itemGroupTypeName);
			}
		}
		
		var icon = Util.GetFirstChildNodeByName(itemGroupSelectionIconContainer, "wardrobe");
		icon.addEventListener("click", (e) => this.OnWardrobeIconClick(e));
	}
	
	
	,OnWardrobeIconClick(){
		var icon = Util.GetFirstChildNodeByName(Util.GetFirstChildNodeByName(this.mainContainer, "itemGroupTypeSelection"), "wardrobe");
		Util.SelectElementAndDeselectSiblings(icon, "selected");
		
		Util.ClearNodeContent(this.itemSelectionContainer);
		Util.HideAllChildNodes(this.itemGroupSelectionContainer);
		Util.ClearNodeContent(this.itemSelectionContainer);
		this.HidControlAndActionButtons();
		
		if(null == this.wardrobeContainer){
			this.wardrobeContainer = Util.CreateElement({parent:this.mainContainer, className:"focus-wardrobe-container"});
			
			MainController.playerAccount.wardrobe.forEach((suit, index) => {
				if(! suit) return;
				var figureContainer = Util.CreateElement({parent:this.wardrobeContainer});
				var figure = Util.CreateElement({parent:figureContainer});
				
				var text = Util.CreateElement({
					parent:figureContainer, tag:"input", 
					attributes:{name:"wardrobeName-"+index,value:suit.name}
				});
				
				var buttonSave = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Save"}
					,cssStyles:{float:"left"},events:{click: (e) => {this.SaveSuit(index);}} 
				});
				
				var buttonLoad = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Load"}
					,cssStyles:{float:"right"}, events:{click:(e) => {this.LoadSuit(index);}}
				});
				
				setTimeout(function(){
					LocationController.delegates.view.BuildPlayerFigure(figure, suit.render);
				}, (index+1)*100);
			});
		}else
			this.wardrobeContainer.style.display = "block";
	}
	
	,LoadSuit(index){
		var validationErrors = this.updateDelegate.AddSuit(MainController.playerAccount.wardrobe[index].appearance);
		this.ShowErrorsOrPlayer(validationErrors);
	}
	
	,SaveSuit(index){
		var suit = MainController.playerAccount.wardrobe[index];
		suit.appearance = this.updateDelegate.BuildSuitFromCurrentAppearance();
		suit.render = F3dcgAssetsRender.BuildSuitRender(suit.appearance)
		var figureDiv = this.wardrobeContainer.childNodes[index].childNodes[0];
		Util.ClearNodeContent(figureDiv);
		LocationController.delegates.view.BuildPlayerFigure(figureDiv, suit.render);
	}
	
	,OnItemGroupTypeClick(itemGroupTypeName){
		LocationFocusView.selectedItemGroupTypeName = itemGroupTypeName;
		var icon = Util.GetFirstChildNodeByName(Util.GetFirstChildNodeByName(this.mainContainer, "itemGroupTypeSelection"), itemGroupTypeName)
		Util.SelectElementAndDeselectSiblings(icon, "selected");
		
		Util.ClearNodeContent(this.itemSelectionContainer);
		Util.HideAllChildNodes(this.itemGroupSelectionContainer);
		Util.ClearNodeContent(this.itemSelectionContainer);		
		if(this.wardrobeContainer) this.wardrobeContainer.style.display = "none";
		
		for(let itemGroupName in this.updateDelegate.items[itemGroupTypeName]){
			var itemGroupIcon = Util.GetFirstChildNodeByName(this.itemGroupSelectionContainer, itemGroupName);
			if(! itemGroupIcon) throw "No item group icon defined for " + itemGroupName
			itemGroupIcon.style.display = "block";
			itemGroupIcon.addEventListener("click", (e) => this.OnItemGroupClick(itemGroupName));
			
			this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, itemGroupName);
			
			//if(itemGroupName == this.selectedItemGroupName)
				//this.OnItemGroupClick(itemGroupName);
		}
	}
	
	
	,OnItemGroupClick(itemGroupName){
		LocationFocusView.selectedItemGroupName = itemGroupName;
		Util.ClearNodeContent(this.itemSelectionContainer);
		
		var icon = Util.GetFirstChildNodeByName(this.itemGroupSelectionContainer, itemGroupName);
		Util.SelectElementAndDeselectSiblings(icon, "selected");
		
		this.updateDelegate.items[this.selectedItemGroupTypeName][itemGroupName].forEach(itemData => {
			var iconContainer = Util.CreateElement({parent:this.itemSelectionContainer});
			var events = {};
			
			if(! itemData.validation?.length)
				events.click = (e) => this.OnItemClick(itemData.itemName);
			else
				for(var i = 0; i < itemData.validation.length; i++)
					Util.CreateElement({parent:iconContainer,innerHTML:itemData.validation[i],cssStyles:{color:"#fcc",top:(i+1)+"em",fontSize:"1em"}});
			
			Util.CreateElement({parent:iconContainer, tag:"img", events:events, attributes:{src:itemData.iconUrl, alt:itemData.itemName}});
			Util.CreateElement({parent:iconContainer,innerHTML:itemData.itemName,cssStyles:{fontSize:".8em"}});
		})
		
		this.UpdateControlAndActionButtons();
	}
	
	
	,OnItemClick(itemName){
		this.selectedItemName = itemName;
		var validationErrors = this.updateDelegate.AddItem(this.selectedItemName);
		this.ShowErrorsOrPlayer(validationErrors);		
		if(! validationErrors.length) this.UpdateItemGroupIconImage(this.selectedItemGroupTypeName, this.selectedItemGroupName);
	}
	
	
	,UpdateItemGroupIconImage(itemGroupTypeName, itemGroupName){
		var wornItem //= this.updateDelegate.GetCurrentWornItem(itemGroupName);
		if(wornItem){
			//current item will be displayed elsewhere
			//var itemGroupIcon = Util.GetFirstChildNodeByName(this.itemGroupSelectionContainer, itemGroupName);		
			//var inventoryItem = this.updateDelegate.inventory.items[itemGroupTypeName][itemGroupName][wornItem.itemName];
			//itemGroupIcon.childNodes[1].setAttribute("src", inventoryItem?.iconUrl ? inventoryItem.iconUrl : "./Images/Icons/e4x4.png");
		}		
	}
	
	
	,UpdateControlAndActionButtons(){
		var wornItem = this.updateDelegate.GetCurrentWornItem(this.selectedItemGroupName);
		this.selectedItemName = wornItem.name;
		
		var buttonsToShow = [];
		for(var action in this.itemActionViews)
			Util.GetFirstChildNodeWithAttribute(this.itemActionButtonsContainer, "alt", action).style.display="none";
		
		if(wornItem){
			//var inventoryItem = this.updateDelegate.items[this.selectedItemGroupTypeName][this.selectedItemGroupName].find(inventoryItem => inventoryItem.itemName == wornItem.name);
			var inventoryItem = this.updateDelegate.GetInventoryItem(this.selectedItemGroupName, wornItem.name);

			if(inventoryItem.colorize){
				buttonsToShow.push("Color");
				if(wornItem.color) this.itemActionViews.Color.SetHexValue(wornItem.color);	
			}
			
			if(wornItem.lock || inventoryItem.allowedLocks?.length > 0){
				buttonsToShow.push("Lock");
				this.itemActionViews.Lock.SetItem(wornItem, inventoryItem, this.updateDelegate.inventory.locks, this.updateDelegate.inventory.keys);
			}
			
			if(inventoryItem.variants){
				buttonsToShow.push("Variant");
				this.itemActionViews.Variant.SetItem(wornItem, inventoryItem);
			}
		}
		
		buttonsToShow.forEach(altValue => Util.GetFirstChildNodeWithAttribute(this.itemActionButtonsContainer, "alt", altValue).style.display="block");
		
		if(! buttonsToShow.includes(this.selectedAction)) 
			this.itemActionViews[this.selectedAction].Hide();
		else
			this.itemActionViews[this.selectedAction].Show();
	}
	
	,HidControlAndActionButtons(){
		for(var action in this.itemActionViews){
			Util.GetFirstChildNodeWithAttribute(this.itemActionButtonsContainer, "alt", action).style.display="none";
			this.itemActionViews[this.selectedAction].Hide();
		}
	}
	
	
	,ShowOrHideActions(action){
		this.selectedAction = action;
		for(var actionName in this.itemActionViews)
			this.itemActionViews[actionName].Hide();
		
		this.itemActionViews[action].Show();
	}
	
	
	,ItemActionCallbackColor(color){
		if(!color || ! LocationFocusView.selectedItemGroupName || ! LocationFocusView.figureContainer) return;
		
		var errors = LocationFocusView.updateDelegate.AddColor(LocationFocusView.selectedItemName, color);
		LocationFocusView.ShowErrorsOrPlayer(errors);
	}
	
	
	,ItemActionCallbackLock(action){
		var appearanceItemWorn = LocationFocusView.updateDelegate.appearance.items[LocationFocusView.selectedItemGroupName];
		var appearanceItemCopy = Util.CloneRecursive(appearanceItemWorn);
		var updateCharacter = false, updateTime = false;
		
		switch(action.actionType){
			case "lock":
				appearanceItemCopy.lock = F3dcgAssets.InitAppearanceItemLock(action.value, MainController.playerAccount.id);
				updateCharacter = true;
			break;
			case "unlock":
				delete appearanceItemCopy.lock;
				updateCharacter = true;
			break;
			//timer adjustment,
			case "selection":		
			case "plus":		
				updateTime = action.value*1000*60;
			break;
			case "minus":		
				updateTime =-action.value*1000*60;
			break;
			case "random":
				var value = Math.random() > .5 ? 1 * action.value : -1 * action.value;
				updateTime = value*1000*60;
			break;
			//timer management
			case "showTimer":
				updateTime = true;//no break is intentional
			case "removeItem":
			case "enableActions":	
				appearanceItemCopy.lock.timer[action.actionType] = action.value;			
			break;
			default: throw "Unrecognized action " + action.actionType;
		}
		
		if(updateTime){
			var maxTime = Date.now() + appearanceItemCopy.lock.timer.maxTime * 1000;
			appearanceItemCopy.lock.timer.time = Math.min(maxTime, appearanceItemCopy.lock.timer.time+updateTime);
		}
		
		var validationErrors = LocationFocusView.updateDelegate.Add(appearanceItemCopy);
		if(validationErrors.length > 0)
			LocationFocusView.ShowErrors(validationErrors);
		else if(updateCharacter) 
			LocationFocusView.ShowErrorsOrPlayer(validationErrors)
		else if(updateTime !== false)
			LocationFocusView.itemActionViews.Lock.OnTimerUpdate(appearanceItemCopy.lock.timer);
	}
	
	,ItemActionCallbackVariant(itemVariantName){
		var wornItem = LocationFocusView.updateDelegate.GetCurrentWornItem(LocationFocusView.selectedItemGroupName);
		
		if(itemVariantName == wornItem.variant) return;
		
		var validationErrors = LocationFocusView.updateDelegate.AddVariant(LocationFocusView.selectedItemName, itemVariantName);
		LocationFocusView.ShowErrorsOrPlayer(validationErrors)
	}
	
	
	,ItemActionCallbackRemote(){}
	,ItemActionCallbackDirect(){}
	,ItemActionCallbackArousal(){}
}
