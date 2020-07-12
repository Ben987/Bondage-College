'use strict'

var LocationActions = {
	actionIcons:[]

	,spotClickDivs:{}
	,figureClickDivs:{}

	,Init(){this.OnScreenChange();}
	,Interrupt(){
		Util.DetachElementsAndClear(LocationActions.actionIcons);
	}
	
	,UnInit(){
		Util.DetachElementsAndClear(LocationActions.actionIcons);
		Util.DetachElementsAndClear(LocationActions.spotClickDivs);
		Util.DetachElementsAndClear(LocationActions.figureClickDivs);
	}
	
	,OnScreenChange(){
		Util.DetachElementsAndClear(LocationActions.actionIcons);	
		Util.DetachElementsAndClear(LocationActions.spotClickDivs);
		Util.DetachElementsAndClear(LocationActions.figureClickDivs);
		
		var currentSpot = LocationController.GetSpot();
		var currentScreen = LocationController.location.screens[currentSpot.screens.Default];
		
		for(let spotName in currentScreen.spotPositions){
			var spotPos = currentScreen.spotPositions[spotName];
			var left = spotPos.left, top = spotPos.top,width = spotPos.scale, height = spotPos.scale*2/LocationView.aspectRatio;
			
			var spotClickDiv = Util.CreateElement({parent:LocationController.inputContainer, className:"location-spot-event-listener", insertFirst:true
				,cssStyles:{left:left + "%", top:top + "%", width:width + "%", height:height + "%"}
				,events:{
					click:(event) => {
						event.stopPropagation();
						LocationController.ShowMoveActions();
					}
				}
			});
			this.spotClickDivs[spotName] = spotClickDiv;
		}
		
		for(let spotName in currentScreen.spotPositions){
			var spotPos = currentScreen.spotPositions[spotName];
			var left = spotPos.left, top = spotPos.top,width = spotPos.scale, height = spotPos.scale*2/LocationView.aspectRatio;	
			left += width * .25;
			top += height * .25;
			width *= .5;
			height *= .5;
			
			var figureClickDiv = Util.CreateElement({parent:LocationController.inputContainer, className:"location-spot-figure-listener"
				,cssStyles:{border:DevTools.locationSpotBorder, left:left + "%", top:top + "%", width:width + "%", height:height + "%"}
				,events:{
					click:(event) => {
						var player = LocationController.GetPlayer(spotName);
						if(! player) return;
						
						//console.log("click on " + spotName + " " + player.id);
						event.stopPropagation();
						LocationController.StartPlayerDialogBondageToys(player);
					}
				}
			});
			
			this.figureClickDivs[spotName] = figureClickDiv;
		}
	}
	
	,ShowActionsMove(){
		this.Interrupt();
		
		var currentSpot = LocationController.GetSpot();
		var currentScreen = LocationController.location.screens[currentSpot.screens.Default];
		
		for(let spotName in currentScreen.spotPositions){
			var spot = LocationController.location.spots[spotName];
			var playerInSpot = LocationController.GetPlayer(spotName);
			var connection = Object.keys(currentSpot.connections).find(conn => conn == spotName);
			
			var className = "spot-base ", free = false;
			if(spotName == currentSpot.name) 
				className += "spot-base-self";
			else if(playerInSpot && ! connection) 
				className += "spot-base-far-occupied";
			else if(playerInSpot) 
				className += "spot-base-occupied";
			else if(! connection) 
				className += "spot-base-far";
			else{
				className += "spot-base-free";
				free = true;
			}
			
			var spotPos = currentScreen.spotPositions[spotName];
			var iconDiv = Util.CreateElement({parent:LocationController.inputContainer, className:className
				,cssStyles:{
					left:(spotPos.left) + "%"
					,top:(spotPos.top+(spotPos.scale)*2/LocationView.aspectRatio - spotPos.scale/LocationView.aspectRatio/5) + "%"
					,width:spotPos.scale + "%"
					,height:spotPos.scale/5/LocationView.aspectRatio + "%"
				}
				,events: !free ? null : {
					click:(event)=>{
						event.stopPropagation();
						LocationController.MoveToSpot(spotName);
						Util.DetachElementsAndClear(LocationActions.actionIcons);					
					}
				}
			});
			
			LocationActions.actionIcons.push(iconDiv);
		};
	}	
}


