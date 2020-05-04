'use strict'


var LocationView = {
	aspectRatio: .5
	,spotDivs: {}
	,fixtureDivs: {}
	,actionIcons:[]
	,spotClickDivs:[]

	,nsfwAssets:["BodyUpper", "BodyLower", "Nipples", "Pussy"]
	
	,DoubleClick(event){console.log("double click");}
	,Click(event){SideInput.Roll();BottomChat.RollSmallIfHidden();}
	,Touch(event){SideInput.Roll();BottomChat.RollSmallIfHidden();}
	,MouseMove(event){}
	,LoseFocus(event){MslController.LoseFocus();}
	
	
	,RenderScreenAndPlayers(screen, playersInSpots){
		document.getElementById("LocationView").style.display = "block";	
		
		Util.DetachElementsAndClear(LocationView.spotDivs);
		Util.DetachElementsAndClear(LocationView.spotClickDivs);
		Util.DetachElementsAndClear(LocationView.actionIcons);
		
		LocationView.RenderBackground(screen);
		Object.values(screen.spotPositions).forEach(s => LocationView.RenderSpotPosition(s));
		screen.fixtures?.forEach(f => LocationView.RenderFixture(screen, f));
		
		var i = 0;
		for(let spotName in playersInSpots)
			//setTimeout(function(){
				LocationView.RenderPlayerInSpot(spotName, playersInSpots[spotName])
				//}, (++i)*50);
	}
	
	,HideAndClearView(){
		document.getElementById("LocationView").style.display = "none";
		Util.DetachElementsAndClear(LocationView.spotClickDivs);
		Util.DetachElementsAndClear(LocationView.actionIcons);
		Util.DetachElementsAndClear(LocationView.spotDivs);
	}
	
	
	,RenderBackground(screen){
		document.getElementById("LocationViewBackground").src = "./Images/Locations/"+LocationController.location.type+"/"+screen.name+".back.jpg";
		if(screen.foreground)
			document.getElementById("LocationViewForeground").src = "./Images/Locations/"+LocationController.location.type+"/"+screen.name+".fore.png";
		else
			document.getElementById("LocationViewForeground").style.display = "none";
	}
	
	
	,RenderFixture(screen, fixture){
		var url = "./Images/Locations/"+LocationController.location.type+"/"+screen.name+"."+fixture.name+".png";
		
		LocationView.fixtureDivs[fixture.name] = Util.CreateElement({tag:"img", parent:"LocationViewMidground", attributes:{src:url, alt:""}
			,cssStyles:{
				left:fixture.left-fixture.scaleX/2 + "%"
				,top:fixture.top-fixture.scaleY + "%"
				,width:fixture.scaleX + "%"
				,height:fixture.scaleY + "%"
				,zIndex:fixture.zIndex
				,position:"absolute"
			}
		});
	}
	
	
	,RenderSpotPosition(spot){
		var r = LocationView.aspectRatio;
		
		var spotDiv;
		if(LocationView.spotDivs[spot.name]){
			spotDiv = LocationView.spotDivs[spot.name];
		}else{
			var left = spot.left-spot.scale/2 + "%", top = spot.top-spot.scale/LocationView.aspectRatio + "%"
					,width = spot.scale + "%", height = spot.scale*2/LocationView.aspectRatio + "%";
			spotDiv = Util.CreateElement({parent:"LocationViewMidground", className:"screen-spot-container"
				,cssStyles:{
					left:left, top:top, width:width, height:height
					,zIndex:spot.zIndex
					,fontSize:spot.scale/8 + "em"
				}
			});
			this.spotDivs[spot.name] = spotDiv;
			
			var spotClickDiv = Util.CreateElement({parent:"LocationViewInput", className:"screen-spot-event-listener", insertFirst:true
				,cssStyles:{left:left, top:top, width:width, height:height}
				,events:{click:(event) =>{
					var player = LocationController.GetPlayer(spot.name);
					if(! player) return;
					LocationFocusView.Dismiss();
					LocationFocusView.Show(player);
					event.stopPropagation();
				}}
			});
			
			this.spotClickDivs.push(spotClickDiv);
		}
	}
	
	
	,RenderPlayerInSpot(spotName, player){
		var spotDiv = LocationView.spotDivs[spotName]
		if(! spotDiv) return;//player is in a a spot not visible from this screen
		//if(spotDiv.figure) spotDiv.removeChild(spotDiv.figure); shouldn't happen?
		
		this.BuildPlayerFigure(spotDiv, player.appearance);
	}
	
	
	,BuildPlayerFigure(spotDiv, appearance){
		var scaleFactor = .2;//f3dcg asset scale factor	
			
		spotDiv.figure = Util.CreateElement({parent:spotDiv, cssStyles:{
				transform:"rotate("+appearance.rotate +"deg)"
				,top:(appearance.top*scaleFactor/2 + (100 - appearance.scale*100)) + "%"
				,width:appearance.scale*100 + "%"
				,height:appearance.scale*100 + "%"
				,position:"absolute"
		}});
		
		for(let groupName in appearance.items){
			let renderItem = appearance.items[groupName];
			var cssStyles = {left:(renderItem.left*scaleFactor)+"%",top:(renderItem.top*scaleFactor/2)+"%",visibility:"hidden",position:"absolute"}
			
			renderItem.layers.forEach(renderItemLayer => {
				var cS = Util.CloneRecursive(cssStyles);
				Util.CreateImageElement(renderItemLayer.url, spotDiv.figure, cS, scaleFactor, scaleFactor/2
					,(image) => {
						if(renderItemLayer.colorize && renderItem.color)
							Util.ColorizeImage(image, renderItem.color, renderItem.fullAlpha);
							
						if(renderItemLayer.blinking)
							image.classList.add("blinking");
					}
				);
			});
		}
	}
	
	
	,OnPlayerExit(spotName){
		var spotDiv = LocationView.spotDivs[spotName]
		spotDiv.removeChild(spotDiv.figure);
	}
	
	
	,OnPlayerMove(player, originSpot, destinationSpot){
	
		if(player.id == MainController.playerAccount.id 
			&& originSpot.screens.Default.name != destinationSpot.screens.Default.name){
				console.log("Screen switch");
				
				LocationView.RenderScreenAndPlayers(destinationSpot.screens.Default, LocationController.location.players);
		}else{
			var originSpotDiv = this.spotDivs[originSpot.name], destinationSpotDiv = this.spotDivs[destinationSpot.name];
			
			if(! originSpotDiv && ! destinationSpotDiv){
				//do nothing, the player moved outside of POV
			}else if(!destinationSpotDiv){//player went to a spot that's not rendered
				originSpotDiv.removeChild(originSpotDiv.figure);
			}else if(! originSpotDiv){ //player came from a spot that was not rendered
				this.BuildPlayerFigure(destinationSpotDiv, player.appearance);
			}else{ //save rendering effort
				originSpotDiv.removeChild(originSpotDiv.figure);
				destinationSpotDiv.appendChild(originSpotDiv.figure);
				destinationSpotDiv.figure = originSpotDiv.figure;
				originSpotDiv.figure = null;
			}
		}
	}
	
	
	,StartMinigame(params, endCallback){
		switch(params.type){
			case "ComplyRefuse":
				console.log(params);
				MinigameComplyRefuse.Start(endCallback, params.autoProgress);
			break;
			case "AbCancel":
				MinigameAbCancel.Start(endCallback, params.autoProgress, params.mashProgress, params.extraChallenge); 
			break;
			default:  throw "Not implemented " + params.type;
		}
	}
	
	
	,ShowActionsChat(){}
	,ShowActionsSettings(){
		console.log("Settings will be the exit button for a while");
		MainController.ExitLocation();
	}
	
	,ShowActionsExamine(){
		Util.DetachElementsAndClear(LocationView.actionIcons);
		
		for(let spotName in LocationController.location.spots){
			var spot = LocationController.location.spots[spotName];
			var iconDiv = Util.CreateElement({parent:"LocationViewInput", tag:"img", attributes:{src:"./Icons/"+"Examine.png"}, className:"spot-icon-examine"
				,cssStyles:{
					left:spot.left-spot.scale/2 + "%"
					,top:spot.top-spot.scale/LocationView.aspectRatio + "%"
					,width:spot.scale + "%"
					,height:spot.scale/LocationView.aspectRatio + "%"
				}
				,events:{
					click:(event)=>{
						event.stopPropagation();
						LocationController.SpotInfo(spotName);
						Util.DetachElementsAndClear(LocationView.actionIcons);
					}
				}
			});
			this.actionIcons.push(iconDiv);
		}
	}
	
	
	,ShowActionsMove(){
		Util.DetachElementsAndClear(LocationView.actionIcons);
		BottomChat.RollHide();
		
		var currentSpot = LocationController.GetSpot();
		
		for(let spotName in currentSpot.screens.Default.spotPositions){
			
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
			
			var spotPos = currentSpot.screens.Default.spotPositions[spotName];
			var iconDiv = Util.CreateElement({parent:"LocationViewInput", className:className
				,cssStyles:{
					left:(spotPos.left-spotPos.scale/2) + "%"
					,top:(spotPos.top+(spotPos.scale)/LocationView.aspectRatio - spotPos.scale/LocationView.aspectRatio/5) + "%"
					,width:spotPos.scale + "%"
					,height:spotPos.scale/5/LocationView.aspectRatio + "%"
				}
				,events: !free ? null : {
					click:(event)=>{
						event.stopPropagation();
						LocationController.MoveToSpot(spotName);
						Util.DetachElementsAndClear(LocationView.actionIcons);					
					}
				}
			});
			this.actionIcons.push(iconDiv);
		};
	}
}


/*
LocationView.oval = {
	ovalXhalf:8.25/1.5
	, ovalX:12.5/1.5
	, ovalYhalf:15/1.5
	, ovalY:25/1.5
}

LocationView.actionIconPositions = {
	spotInfo:[0, LocationView.oval.ovalY]
	,moveToSpot:[ LocationView.oval.ovalXhalf, LocationView.oval.ovalYhalf]
	,exitLocation:[LocationView.oval.ovalX, 0]
	,appItemChange:[LocationView.oval.ovalXhalf, -LocationView.oval.ovalYhalf]
	,appItemChangeSelf:[-LocationView.oval.ovalXhalf, -LocationView.oval.ovalYhalf]
	,poseChangeSelf:[-LocationView.oval.ovalXhalf, LocationView.oval.ovalYhalf]
	, 
		,[0, -LocationView.Oval.ovalY]

		,[ -LocationView.Oval.ovalX, 0]
		,[-LocationView.Oval.ovalXhalf, LocationView.Oval.ovalYhalf]
	}
}*/
