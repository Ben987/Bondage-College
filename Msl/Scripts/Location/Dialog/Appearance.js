'use strict'


var LocationDialogAppearanceView = function(mainDialog, containerElement){
	this.mainDialog = mainDialog;
	this.containerElements = {};
	
	this.selectedItemGroupTypeName = "cloth";
	this.selectedItemGroupName = "ClothLower";
	
	//initializing containers that will be used throughoug
	this.containerElements.main = containerElement;
	this.containerElements.itemGroupTypeSelection = Util.GetFirstChildNodeByName(this.containerElements.main, "itemGroupTypeSelection");
	this.containerElements.figure = Util.GetFirstChildNodeByName(this.containerElements.main, "figureContainer");
	this.containerElements.itemGroupSelection = Util.GetFirstChildNodeByName(this.containerElements.figure, "itemGroupSelection");
	this.containerElements.updateStackButtons = Util.GetFirstChildNodeByName(this.containerElements.main, "updateStackButtons");
	this.containerElements.groupDetailsAndWardrobe = Util.GetFirstChildNodeByName(this.containerElements.main, "groupDetailsAndWardrobe");
	this.containerElements.groupDetails = Util.GetFirstChildNodeByName(this.containerElements.groupDetailsAndWardrobe, "groupDetailsContainer");
	this.containerElements.groupDetailsButtons = Util.GetFirstChildNodeByName(this.containerElements.groupDetails, "buttons");
	this.containerElements.itemsAndCurrentActions = Util.GetFirstChildNodeByName(this.containerElements.groupDetails, "itemsAndCurrentActions");
	this.containerElements.groupValidation = Util.GetFirstChildNodeByName(this.containerElements.groupDetails, "validation");
	
	this.containerElements.wardrobe = null;//Lazily initialized
	
	//Eye candy for menu
	Util.InitSelectableMenu(this.containerElements.itemGroupTypeSelection);
	Util.InitSelectableMenu(this.containerElements.itemGroupSelection,);
	Util.InitSelectableMenu(this.containerElements.groupDetailsButtons);
	
	//set events on the group type
	for(let itemGroupTypeName in this.mainDialog.updateDelegate.GetApplicableItems()){
		var icon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, itemGroupTypeName);
		
		if(! icon) console.log(itemGroupTypeName);
		icon.addEventListener("click", function(e){this.SelectItemGroupType(itemGroupTypeName);}.bind(this));
		
		if(itemGroupTypeName == this.selectedItemGroupTypeName){
			this.SelectItemGroupType(itemGroupTypeName);
		}
	}
	
	//buttons for the update/undo stack
	Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, "wardrobe").addEventListener("click", function(event){this.ShowWardrobe();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.updateStackButtons, "commit").addEventListener("click", function(event){this.Commit();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.updateStackButtons, "cancel").addEventListener("click", function(event){this.Cancel();}.bind(this));
	Util.GetFirstChildNodeByName(this.containerElements.updateStackButtons, "undo").addEventListener("click", function(event){this.Undo();}.bind(this));
	
	//Right pane group and current item management and actions -- display refactored into separate classses
	this.groupItemActions = {};
	this.selectedGroupItemAction = "items";
	["items", "color", "lock", "variants", "struggle", "vibe", "activity"].forEach(groupItemAction =>{
		var button = Util.GetFirstChildNodeByName(this.containerElements.groupDetailsButtons, groupItemAction);
		var containerElement = Util.GetFirstChildNodeByName(this.containerElements.itemsAndCurrentActions, groupItemAction);
		var constructorFunctionName = Util.Capitalize(groupItemAction) + "DialogAppearanceGroupActionView"; 
		
		if(!window[constructorFunctionName])
			console.error(constructorFunctionName);
		else{
			var callback = function(data){this["GroupItemActionCallback_" + groupItemAction](data);}.bind(this);
			this.groupItemActions[groupItemAction] = {button:button, container:containerElement, controller: new window[constructorFunctionName](containerElement, callback)};
			
			button.addEventListener("click", function(event){this.HideOthersAndShowGroupActionView(groupItemAction);}.bind(this));
		}
	});

	//Render appearance relies on view delegate in main controller to render the figure
	this.RenderAppearance = function(){
		if(this.containerElements.figure.figure) this.containerElements.figure.removeChild(this.containerElements.figure.figure);		
		LocationController.delegates.view.BuildPlayerFigure(this.containerElements.figure, this.mainDialog.updateDelegate.render)
		Util.MoveNodeToEndOfList(this.containerElements.itemGroupSelection);
	}
	setTimeout(this.RenderAppearance.bind(this), 50);
	
	
	this.HideOthersAndShowGroupActionButton = function(buttonsToShow){
		for(var action in this.groupItemActions){
			this.groupItemActions[action].button.style.display = "none";
			
			if(buttonsToShow?.includes(action))
				this.groupItemActions[action].button.style.display = "block";
		}
	}
	
	
	this.HideOthersAndShowGroupActionView = function(groupItemAction){
		this.selectedGroupItemAction = groupItemAction;
		for(var action in this.groupItemActions)
			this.groupItemActions[action].controller.Hide();
		
		if(groupItemAction)
			this.groupItemActions[groupItemAction].controller.Show();
		
		this.selectedGroupAction = groupItemAction;
	}
	this.HideOthersAndShowGroupActionView("items");//.items.button.click();//display items by default
	
	this.Commit = function(){
		if(!this.mainDialog.updateDelegate.HasChanges() )
			this.DisplayErrors(["NoChanges"]);
		else
			LocationController.UpdatePlayerAppearance(this.mainDialog.updateDelegate);
	}
	
	this.Undo = function(){
		this.RenderAppearanceOrShowErrors(this.mainDialog.updateDelegate.Undo());
	}
	
	this.Cancel = function(){
		this.mainDialog.updateDelegate.Invalidate();
		this.mainDialog.updateDelegate = this.mainDialog.player.GetUpdateDelegate();
		this.DisplayErrors(["Reset"]);		
		this.RenderAppearance();
	}
	
	this.DisplayErrors = function(errors){
		errors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.figureContainer
				,innerHTML:error
				,className:"validation_message_fadout"
				,removeAfter:4000
			});
		});
	}
	
	
	this.RenderAppearanceOrShowErrors = function(validationErrors){
		if(! validationErrors?.length)
			this.RenderAppearance();
		else
			this.DisplayErrors(validationErrors);
	}
	
	
	this.DisplayErrors = function(validationErrors){
		validationErrors.forEach(error => {
			var errorDiv = Util.CreateElement({
				parent:this.containerElements.figure
				,innerHTML:error
				,className:"validation_message_fadout"
			});
			setTimeout(() => {errorDiv.parentNode.removeChild(errorDiv);}, 4000);
		});
	}
	
	
	this.ShowWardrobe = function(){
		//Util.ClearNodeContent(this.containerElements.itemSelection);
		//Util.HideAllChildNodes(this.containerElements.itemGroupSelection);
		//Util.ClearNodeContent(this.containerElements.itemSelection);
		//this.HideControlAndActionButtons();
		
		
		if(null == this.containerElements.wardrobe){
			this.containerElements.wardrobe = Util.GetFirstChildNodeByName(this.containerElements.groupDetailsAndWardrobe, "wardrobe");
			
			MainController.playerAccount.wardrobe.forEach((suit, index) => {
				if(! suit) return;
				var figureContainer = Util.CreateElement({parent:this.containerElements.wardrobe});
				var figure = Util.CreateElement({parent:figureContainer});
				
				var text = Util.CreateElement({
					parent:figureContainer, tag:"input", 
					attributes:{name:"wardrobeName-"+index,value:suit.name}
				});
				
				var buttonSave = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Save"}
					,cssStyles:{float:"left"}, events:{click:function(event){this.SaveSuit(index);}.bind(this)}
				});
				
				var buttonLoad = Util.CreateElement({
					parent:figureContainer, tag:"input", attributes:{type:"submit", value:"Load"}
					,cssStyles:{float:"right"}, events:{click:function(event){this.LoadSuit(index);}.bind(this)}
				});
				
				setTimeout(function(){
					LocationController.delegates.view.BuildPlayerFigure(figure, suit.render);
				}, (index+1)*100);
			});
		}
		
		this.containerElements.wardrobe.style.display = "block";
		this.containerElements.groupDetails.style.display = "none";
	}
	
	this.LoadSuit = function(index){
		var validationErrors = this.mainDialog.updateDelegate.AddSuit(MainController.playerAccount.wardrobe[index].appearance);
		this.RenderAppearanceOrShowErrors(validationErrors);
	}
	
	this.SaveSuit = function(index){
		var suit = MainController.playerAccount.wardrobe[index];
		suit.appearance = this.mainDialog.updateDelegate.BuildSuitFromCurrentAppearance();
		suit.render = F3dcgAssetsRender.BuildSuitRender(suit.appearance)
		var figureDiv = this.containerElements.wardrobe.childNodes[index].childNodes[0];
		Util.ClearNodeContent(figureDiv);
		LocationController.delegates.view.BuildPlayerFigure(figureDiv, suit.render);
	}
	
	this.SelectItemGroupType = function(itemGroupTypeName){
		if(this.containerElements.wardrobe) this.containerElements.wardrobe.style.display = "none";
		this.containerElements.groupDetails.style.display = "block";
		
		Util.SelectElementAndDeselectSiblings(Util.GetFirstChildNodeByName(this.containerElements.itemGroupTypeSelection, itemGroupTypeName));
		
		this.selectedItemGroupTypeName = itemGroupTypeName;
		this.selectedItemGroupName = null;
		this.selectedItem = null;
		
		//Redraw item groups above the figure
		Util.HideAllChildNodes(this.containerElements.itemGroupSelection);
		if(this.containerElements.wardrobe) this.containerElements.wardrobe.style.display = "none";	
		Util.MoveNodeToEndOfList(this.containerElements.itemGroupSelection);
		
		for(let itemGroupName in this.mainDialog.updateDelegate.GetApplicableItems()[itemGroupTypeName]){		
			var itemGroupIcon = Util.GetFirstChildNodeByName(this.containerElements.itemGroupSelection, itemGroupName);
			if(! itemGroupIcon) {
				console.log(Object.keys(this.mainDialog.updateDelegate.GetApplicableItems()[itemGroupTypeName]));
				throw "No item group icon defined for " + itemGroupName
			}
			itemGroupIcon.style.display = "block";
			itemGroupIcon.addEventListener("click", function(event){this.SelectItemGroup(itemGroupName);}.bind(this));
			
			var applicableGroup = this.mainDialog.updateDelegate.GetApplicableItems()[itemGroupTypeName][itemGroupName];
			if(applicableGroup.currentItem) itemGroupIcon.classList.add("filled"); else itemGroupIcon.classList.remove("filled");			
			if(applicableGroup.validation?.length) itemGroupIcon.classList.add("blocked"); else itemGroupIcon.classList.remove("blocked");
		}
		
		//hide the item group action buttons, pending item selection
		this.HideOthersAndShowGroupActionView();
		this.HideOthersAndShowGroupActionButton();
	}
	
	
	this.SelectItemGroup = function(itemGroupName, groupActionToShow){
		this.selectedItemGroupName = itemGroupName;
		
		var applicableGroup = this.mainDialog.updateDelegate.GetApplicableItems()[this.selectedItemGroupTypeName][itemGroupName];
		
		//Item icon is always shown
		var buttonsToShow = ["items"];
		if(! applicableGroup.currentItem){
			this.groupItemActions.items.button.childNodes[0].src = "./Images/Icons/Variants.png";
		}else{
			this.groupItemActions.items.button.childNodes[0].src = applicableGroup.currentItem.iconUrl;
		}
		
		//Show validation mesages
		Util.ClearNodeContent(this.containerElements.groupValidation);
		if(applicableGroup.validation?.length)
			applicableGroup.validation.forEach(validationError => {Util.CreateElement({parent:this.containerElements.groupValidation,innerHTML:validationError});});
		
		if(applicableGroup.actions.changeItem)
			this.groupItemActions.items.controller.SetItems(applicableGroup.items, applicableGroup.actions.removeItem && applicableGroup.currentItem);
		else
			this.groupItemActions.items.controller.SetItems([]);//clear the icons for prev list
		
		if(applicableGroup.currentItem){
			if(applicableGroup.actions.struggle)
				buttonsToShow.push("struggle");
			
			if(applicableGroup.actions.color)
				buttonsToShow.push("color");
			
			if(applicableGroup.actions.variants){
				buttonsToShow.push("variants");				
				var variantData = applicableGroup.currentItem.variants[applicableGroup.currentItem.variant];
				this.groupItemActions.variants.button.childNodes[0].src = variantData.iconUrl;
				this.groupItemActions.variants.controller.SetItem(applicableGroup.currentItem);
			}
			
			if(applicableGroup.currentItem.lock){
				buttonsToShow.push("lock");
				this.groupItemActions.lock.button.childNodes[0].src = applicableGroup.currentItem.lock.iconUrl
				this.groupItemActions.lock.controller.SetItemLocked(applicableGroup.currentItem.lock, applicableGroup.actions);
			}else if(applicableGroup.actions.lock?.locks?.length){
				buttonsToShow.push("lock");
				this.groupItemActions.lock.button.childNodes[0].src = "../BondageClub/Icons/Lock.png"
				this.groupItemActions.lock.controller.SetItemUnlocked(applicableGroup.actions.lock.locks);
			}
			
			this.groupItemActions.items.button.childNodes[0].className = "";
			if(applicableGroup.actions.vibe){
				buttonsToShow.push("vibe");
				this.groupItemActions.vibe.controller.SetItem(applicableGroup.currentItem);
				this.groupItemActions.items.button.childNodes[0].classList.add("shaking");
				this.groupItemActions.items.button.childNodes[0].classList.add("speed" + applicableGroup.currentItem.vibeLevel);
			}
		}
		
		if(applicableGroup.actions.activity){
			buttonsToShow.push("activity");
			this.groupItemActions.activity.controller.SetActivities(applicableGroup.actions.activity);			
		}
		
		//Show the actions for the group and current item
		this.HideOthersAndShowGroupActionButton(buttonsToShow);
		
		if(groupActionToShow && buttonsToShow.includes(groupActionToShow))
			this.groupItemActions[groupActionToShow].button.click();
		else
			this.groupItemActions.items.button.click();
		
	}
	
	//Callbacks from group actions
	this.GroupItemActionCallback_struggle = function(){
		if(this.mainDialog.updateDelegate.HasChanges())
			this.DisplayErrors(["ClearChanges"]);
		else
			LocationController.StartPlayerStruggle(this.selectedItemGroupName);	
	}
	
	
	this.GroupItemActionCallback_activity = function(activityName){
		if(this.mainDialog.updateDelegate.HasChanges())
			this.DisplayErrors(["ClearChanges"]);
		else
			LocationController.StartPlayerActivity(this.mainDialog.updateDelegate.player, this.selectedItemGroupName, activityName);	
	}
	
	this.GroupItemActionCallback_vibe = function(level){
		if(! this.selectedItemGroupName) return;
		
		var validationErrors = this.mainDialog.updateDelegate.SetVibeLevel(this.selectedItemGroupName, level);
		if(validationErrors.length > 0){
			this.RenderAppearanceOrShowErrors(validationErrors);
		}else{
			this.groupItemActions.items.button.childNodes[0].className = "";
			this.groupItemActions.items.button.childNodes[0].classList.add("shaking");
			this.groupItemActions.items.button.childNodes[0].classList.add("speed" + level);
		}
	}
	
	
	this.GroupItemActionCallback_items = function(itemName){
		var validationErrors = this.mainDialog.updateDelegate.SetItem(this.selectedItemGroupName, itemName);
		this.RenderAppearanceOrShowErrors(validationErrors);
		this.SelectItemGroup(this.selectedItemGroupName);
	}
	
	
	this.GroupItemActionCallback_color = function(color){
		if(! this.selectedItemGroupName) return;
		
		var validationErrors = this.mainDialog.updateDelegate.SetColor(this.selectedItemGroupName, color);
		this.RenderAppearanceOrShowErrors(validationErrors);
	}
	
	
	this.GroupItemActionCallback_lock = function(action){
		if(! this.selectedItemGroupName) return;
		
		var updateCharacter = false, validationErrors;
		switch(action.actionType){
			case "lock":
				validationErrors = this.mainDialog.updateDelegate.AddLock(this.selectedItemGroupName, action.value, MainController.playerAccount.id);
			break;
			case "unlock":
				validationErrors = this.mainDialog.updateDelegate.RemoveLock(this.selectedItemGroupName);
				updateCharacter = true;//lock removal
			break;
			case "updateProperty":
				validationErrors = this.mainDialog.updateDelegate.UpdateLock(this.selectedItemGroupName, action.value);
			break;
			case "setTime":
				validationErrors = this.mainDialog.updateDelegate.UpdateLock(this.selectedItemGroupName, "setTime", action.value);
			break;
			case "unlockCode":
				validationErrors = this.mainDialog.updateDelegate.RemoveLock(this.selectedItemGroupName, action.value);
				updateCharacter = true;//lock removal
			break;
			case "setCode":
				validationErrors = this.mainDialog.updateDelegate.UpdateLock(this.selectedItemGroupName, "setCode", action.value, action.code);	
			break;
			default: throw "Unrecognized action " + action.actionType;
		}
		
		if(validationErrors.length > 0)
			this.RenderAppearanceOrShowErrors(validationErrors);
		else if(updateCharacter)
			this.RenderAppearanceOrShowErrors(validationErrors);
			
		this.SelectItemGroup(this.selectedItemGroupName, "lock");
	}
	
	this.GroupItemActionCallback_variants = function(data){
		var validationErrors = this.mainDialog.updateDelegate.SetVariant(this.selectedItemGroupName, data.itemName, data.variantName);
		
		if(! validationErrors.length)
			this.RenderAppearance();
		else 
			this.DisplayErrors(validationErrors);
	}
}
