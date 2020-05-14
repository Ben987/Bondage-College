'use strict'


var LocationView = {
	aspectRatio: .5
	,spotDivs: {}
	,fixtureDivs: {}

	,nsfw:{Groups:["BodyUpper", "BodyLower", "Nipples", "Pussy"]}
	
	//,DoubleClick(event){console.log("double click");}
	//,Click(event){SideInput.Roll();BottomChat.RollSmallIfHidden();}
	//,Touch(event){SideInput.Roll();BottomChat.RollSmallIfHidden();}
	//,MouseMove(event){}
	//,LoseFocus(event){MslController.LoseFocus();}
	,Init(){
		LocationController.canvasContainer.style.display = "block";	
		this.OnScreenChange();
	}
	
	,OnScreenChange(){
		Util.ClearNodeContent(LocationController.midgroundContainer);	
		
		var currentSpot = LocationController.GetSpot();
		var currentScreen = LocationController.location.screens[currentSpot.screens.Default];
		
		LocationView.RenderBackground(currentScreen);
		Object.values(currentScreen.spotPositions).forEach(s => LocationView.RenderSpotPosition(s));
		currentScreen.fixtures?.forEach(f => LocationView.RenderFixture(currentScreen, f));
		
		Object.values(currentScreen.spotPositions).forEach((spotPosition, index) => {
			var player = LocationController.location.players[spotPosition.name];
			if(! player) return;
			setTimeout(function(){
				LocationView.BuildPlayerFigure(LocationView.spotDivs[spotPosition.name], player.render);
				}, (index+1)*50);
		});
	}
	
	,Interrupt(){
		
	}
	
	,UnInit(){
		LocationController.canvasContainer.style.display = "none";
		
		Util.DetachElementsAndClear(LocationView.spotDivs);
		Util.DetachElementsAndClear(LocationView.fixtureDivs);
		Util.ClearNodeContent(LocationController.midgroundContainer);
	}
	
	,RenderBackground(screen){
		LocationController.backgroundContainer.src = "./Images/Locations/"+LocationController.location.type+"/"+screen.name+"/background.jpg";
		if(screen.foreground){
			LocationController.foregroundContainer.style.display = "block";
			LocationController.foregroundContainer.src = "./Images/Locations/"+LocationController.location.type+"/"+screen.name+"/foreground.png";
		}
		else
			LocationController.foregroundContainer.style.display = "none";
	}
	
	
	,RenderFixture(screen, fixture){
		var url = "./Images/Locations/"+LocationController.location.type+"/"+screen.name+"/"+fixture.name+".png";
		
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
		//if(LocationView.spotDivs[spot.name]){
			//spotDiv = LocationView.spotDivs[spot.name];
		//}else{
			var left = spot.left+"%", top = spot.top+"%", width = spot.scale+"%", height = spot.scale*2/LocationView.aspectRatio+"%";
			spotDiv = Util.CreateElement({parent:"LocationViewMidground", className:"screen-spot-container"
				,cssStyles:{
					left:left, top:top, width:width, height:height
					,zIndex:spot.zIndex
					,fontSize:spot.scale/8 + "em"
				}
			});
			
			this.spotDivs[spot.name] = spotDiv;
		//}
	}
	
	
	,RenderPlayerInSpot(spotName, player){
		var spotDiv = LocationView.spotDivs[spotName]
		if(! spotDiv) return;//player is in a a spot not visible from this screen
		if(spotDiv.figure) spotDiv.removeChild(spotDiv.figure); //when player render gets updated, redraw the whole thing
		
		this.BuildPlayerFigure(spotDiv, player.render);
	}
	
	
	,BuildPlayerFigure(spotDiv, render){
		var scaleFactor = .2;//f3dcg asset scale factor	
		
		spotDiv.figure = Util.CreateElement({parent:spotDiv, cssStyles:{
				transform:"rotate("+render.rotate +"deg)"
				,top:(render.top*scaleFactor/2 + (100 - render.scale*100)) + "%"
				,width:render.scale*100 + "%"
				,height:render.scale*100 + "%"
				,position:"absolute"
		}});
		
		//for(let groupName in render.items){
		render.items.forEach(renderItem => {
			//let renderItem = render.items[groupName];
			//let renderItem = render.items[groupName];
			var cssStyles = {left:(renderItem.left*scaleFactor)+"%",top:(renderItem.top*scaleFactor/2)+"%",visibility:"hidden",position:"absolute"}
			
			renderItem.layers.forEach(renderItemLayer => {
				var cS = Util.CloneRecursive(cssStyles);
				Util.CreateImageElement(renderItemLayer.url, spotDiv.figure, cS, scaleFactor, scaleFactor/2
					,(image) => {
						//if(renderItemLayer.colorize && renderItem.color)
							//Util.ColorizeImage(image, renderItem.color, renderItem.fullAlpha);
							
						if(renderItemLayer.blinking)
							image.classList.add("blinking");
					}
				);
			});
		});
	}
	
	
	,OnPlayerExit(spotName){
		var spotDiv = LocationView.spotDivs[spotName]
		spotDiv.removeChild(spotDiv.figure);
	}
	
	
	,OnPlayerMove(player, originSpotName, destinationSpotName){
		//screen change is detected in controller
		var originSpotDiv = this.spotDivs[originSpotName], destinationSpotDiv = this.spotDivs[destinationSpotName];
		
		if(! originSpotDiv && ! destinationSpotDiv){
			//do nothing, the player moved outside of POV
		}else if(!destinationSpotDiv){//player went to a spot that's not rendered
			originSpotDiv.removeChild(originSpotDiv.figure);
		}else if(! originSpotDiv){ //player came from a spot that was not rendered
			this.BuildPlayerFigure(destinationSpotDiv, player.render);
		}else{ //save rendering effort
			originSpotDiv.removeChild(originSpotDiv.figure);
			destinationSpotDiv.appendChild(originSpotDiv.figure);
			destinationSpotDiv.figure = originSpotDiv.figure;
			originSpotDiv.figure = null;
		}
	}
	
	/*
	
	,ShowActionsChat(){}
	,ShowActionsSettings(){
		console.log("Settings will be the exit button for a while");
	}
	
	,ShowActionsExamine(){
		Util.DetachElementsAndClear(LocationView.actionIcons);
		
		for(let spotName in LocationController.location.spots){
			var spot = LocationController.location.spots[spotName];
			var iconDiv = Util.CreateElement({parent:"LocationViewInput", tag:"img", attributes:{src:"./Icons/"+"Examine.png"}, className:"spot-icon-examine"
				,cssStyles:{
					left:spot.left + "%"
					,top:spot.top + "%"
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
	}*/
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
