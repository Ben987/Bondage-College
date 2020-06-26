'use strict'

var LocationDialog = {
	figureContainer:null
	,topLevelActionsContainer:null
	,currentAction:"profile"
	,updateDelegate:null
	
	,views:{}
	,viewsContainerElements:{}

	,Init(){}
	,OnScreenChange(){}
	,Interrupt(){
		this.updateDelegate?.Invalidate();
		this.updateDelegate = null;
		
		if(this.mainContainer){
			this.mainContainer.style.opacity = "0";
			this.mainContainer.addEventListener('transitionend', function(){
				this.mainContainer.parentNode.removeChild(this.mainContainer);
				this.mainContainer = null;
				this.topLevelActionsContainer = null;
				this.figureContainer = null;
			}.bind(this));
		}
		
		for(var key in this.viewsContainerElements) {
			delete this.views[key];
			delete this.viewsContainerElements[key];
		}
	}
	,UnInit(){}
	
	,StartClothes(player){
		this.Start(player);
		this.ShowViewAndHideOthers("appearance");
		Util.SelectElementAndDeselectSiblings(Util.GetFirstChildNodeByName(this.topLevelMenuContainer, "appearance"));
		this.views.appearance.SelectItemGroupType("clothes");
	}
	
	,StartBondageToys(player){
		this.Start(player);
		this.ShowViewAndHideOthers("appearance");
		Util.SelectElementAndDeselectSiblings(Util.GetFirstChildNodeByName(this.topLevelMenuContainer, "appearance"));
		this.views.appearance.SelectItemGroupType("bondageToys");
	}
	
	,Start(player){
		this.Interrupt();
		this.player = player;
		this.updateDelegate = player.GetUpdateDelegate();
		
		var parentElement = LocationController.inputContainer;
		if(player.settings.dialog.fullScreen)
			parentElement = document.getElementById("LocationViewHud");	
		
		this.mainContainer = Util.CreateElement({parent:parentElement, template:"DialogSelfTemplate"});
		setTimeout(function(){this.mainContainer.style.opacity = 1;}.bind(this), 20);
		this.topLevelMenuContainer = Util.GetFirstChildNodeByName(this.mainContainer, "topLevelMenuContainer");
		this.viewContainer = Util.GetFirstChildNodeByName(this.mainContainer, "viewContainer");
		Util.InitSelectableMenu(this.topLevelMenuContainer);
		
		Util.GetFirstChildNodeByName(this.topLevelMenuContainer, "cancel").addEventListener("click", function(event){
			this.Interrupt();
		}.bind(this));
		
		var viewNames = player.IsMainPlayer() ?	["Profile", "Social", "Appearance", "Settings"] : ["Profile", "Interaction", "Appearance"];
		viewNames.forEach(actionName => { 
			let a = actionName.toLowerCase();
			var topLevelButton = Util.GetFirstChildNodeByName(this.topLevelMenuContainer, a);
			topLevelButton.addEventListener("click", function(event){this.ShowViewAndHideOthers(a);}.bind(this));
			topLevelButton.style.display = "block";
			
			this.viewsContainerElements[a] = Util.GetFirstChildNodeByName(this.viewContainer, a);
			this.views[a] = new window["LocationDialog" + actionName + "View"](this, this.viewsContainerElements[a]);
		});
		
		var backgroundCoverElement = Util.GetFirstChildNodeByName(this.mainContainer, "background");
		backgroundCoverElement.getElementsByTagName("img")[0].src = LocationController.backgroundContainer.src;		
		if(player.settings.dialog.transparentBackground)
			backgroundCoverElement.classList.add("transparent");
		else
			backgroundCoverElement.classList.remove("transparent");
		
		LocationDialog.ShowViewAndHideOthers(this.currentAction);
	}
	
	,ShowViewAndHideOthers(viewName){
		for(var name in this.views){
			var viewContainerElement = this.viewsContainerElements[name];
			if(! viewContainerElement) continue;
			viewContainerElement.classList.remove("visible");
		}
		
		var viewContainerElement = this.viewsContainerElements[viewName];
		if(! viewContainerElement) return;
		viewContainerElement.classList.add("visible");
	}
}

/*
var LocationDialogAccountView  = function(mainDialog){
	this.Show = function(){}
	this.Hide = function(){}
}*/
