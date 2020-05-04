'use strict'


var LocationController = {
	//currentActionData:null
	//,currentActionTimer:null
	//,serverTimeDiff:0
	location:null
	
	,InitAndRender(data){
		this.location = data;
		
		for(var spotName in this.location.players){
			this.location.players[spotName] = new LocationPlayer(this.location.players[spotName]);
		} 
		
		LocationView.RenderScreenAndPlayers(this.GetSpot().screens.Default, this.location.players);
	}
	
	,GetSpot(spotName){
		return spotName ? LocationController.location.spots[spotName] : LocationController.GetSpotWithPlayer(MainController.playerAccount.id);
	}
	
	,GetSpotWithPlayer(playerId){
		for(var spotName in LocationController.location.players)
			if(LocationController.location.players[spotName].id == playerId)
				return LocationController.location.spots[spotName];
	}
	
	,GetPlayer(playerIdOrSpotName){
		if(typeof(playerIdOrSpotName) == "undefined")
			playerIdOrSpotName = MainController.playerAccount.id;
		
		var playerId = parseInt(playerIdOrSpotName);
		if(!playerId) return LocationController.location.players[playerIdOrSpotName];
		
		for(var spotName in LocationController.location.players)
			if(LocationController.location.players[spotName].id == playerId)
				return LocationController.location.players[spotName];
	}
	
	/*
	,IsActionInProgress(){
		return currentActionData && ! currentActionData.finished;
	}*/
	
	/*
	,GetActionsForSpot(spot){
		var actions = {
			spotInfo:function(){LocationController.SpotInfo(spot.name);} //instant resposne to origin only
			,moveToSpot:false		//one challenge response
			,exitLocation:false		//instance response, update everyone
			,AppearanceUpdate:false			//challenge to target, challenge to origin, challenge to target
		};
		
		if(spot.name == LocationController.currentSpotName){//actions for this player
			if(spot.entrance)	actions.exitLocation = MainController.ExitLocation;
			
			actions.AppearanceUpdateSelf = LocationController.AppearanceUpdateSelf;
			actions.poseChangeSelf = LocationController.PoseChangeSelf;
		}else{
			if(! spot.player){//actions for other player
				var connection =  LocationController.currentScreen.spots[LocationController.currentSpotName].connections.find(el => el.targetName == spot.name);
				if(connection)	actions.moveToSpot = () => LocationController.MoveToSpot(spot.name);
			}else{//actions for 
				actions.AppearanceUpdate = () => LocationController.AppearanceUpdate(spot.name, spot.player.id);
			}
		}
		
		return actions;
	}
	*/
	
	/*
	,PoseChangeSelf(){
		var player = this.GetPlayer();
		if(! F3dcgAssets.ValidateChangePoseSelf(player)) return;
		player.kneelingActive = ! player.kneelingActive;
		LocationView.RenderPlayerInSpot(this.GetCurrentSpot());	
	}*/
	

	,UpdatePlayer(playerUpdate){
		if(! playerUpdate?.IsValid()) throw "ChangeWasInvalidated";
		if(playerUpdate.player.id == MainController.playerAccount.id)
			MslServer.ActionStart({type:"AppearanceUpdateSelf", AppearanceUpdate:playerUpdate.GetFinalAppItemList()});
		else
			MslServer.ActionStart({type:"AppearanceUpdateOther", targetPlayerId:playerUpdate.player.id, AppearanceUpdate:playerUpdate.GetFinalAppItemList()});
		
		LocationFocusView.Dismiss();
	}
	
	,SpotInfo(spotName){MslServer.ActionStart({type:"SpotInfo", originSpotName:LocationController.currentSpotName, targetSpotName:spotName});}
	,MoveToSpot(spotName){
		MslServer.ActionStart({type:"MoveToSpot", originSpotName:LocationController.GetSpot().name, targetSpotName:spotName});
	}
	
	,SendChatMessage(content){
		MslServer.ActionStart({type:"ChatMessage", content:content});
	}
	
	,PlayerExitLocationResp(data){
		console.log("PlayerExitLocationResp");
		console.log(data);
		
		var spot = LocationController.GetSpotWithPlayer(data.playerId);
		if(! spot) 	throw "PlayerNotFound " + data.playerId;
		
		delete LocationController.location.players[spot.name]
		LocationView.OnPlayerExit(spot.name);
	}
	
	
	,PlayerEnterLocationResp(data){
		console.log("PlayerEnterLocationResp");
		console.log(data);
		
		var existingPlayer = LocationController.GetPlayer(data.player.id);
		if(! existingPlayer){
			LocationController.location.players[data.spotName] = new LocationPlayer(data.player);
			LocationView.RenderPlayerInSpot(data.spotName, LocationController.location.players[data.spotName]);
		}else if(existingPlayer.id == data.player.id){
			console.log("player reconnected");
		}else{
			console.log("mismatch detected, update whole thing");
		}
	}
	
	
	,LocationActionResp(data){
		console.log("LocationActionResp"); 
		console.log(data);
		LocationController["LocationAction_" + data.type](data);
	}
	
	
	,LocationAction_ChatMessage(data){
		BottomChat.AddChatMessageToLog(data.originPlayerId, "", data.result.content);
	}
	
	
	,LocationAction_SpotInfo(data){
		console.log("Spot info not implemented");
	}
	
	
	,LocationAction_MoveToSpot(action){
		var Move = function(playerId, originSpotName, targetSpotName){
			var player  = LocationController.GetPlayer(playerId);
			var originSpot = LocationController.GetSpotWithPlayer(playerId);
			if(! originSpot.name == action.originSpotName) throw "MismatchedOrigin " + originSpot.name + " " + action.originSpotName;
			if(LocationController.location.players[action.targetSpotName]) throw "SpotOccupied " + action.targetSpotName;		
			LocationController.location.players[targetSpotName] = LocationController.location.players[originSpotName];
			delete LocationController.location.players[originSpotName]
			LocationView.OnPlayerMove(player, originSpot, LocationController.GetSpot(targetSpotName));
		}
	
		if(action.originPlayerId == MainController.playerAccount.id){//self action
			if(! action.finished){//minigame
				LocationController.currentAction = action;
				LocationView.StartMinigame(action.challenge, (result) => {result.id=action.id; MslServer.ActionProgress(result);});
			}else if(action.success){//finished
				Move(action.originPlayerId, action.originSpotName, action.targetSpotName)				
				LocationController.currentAction.finished = true;
			}else{
				throw action;
			}
		}else{//other action
			if(! action.finished){
				console.log("" + action.originPlayerId + " started moving from " + action.originSpotName + " to " + action.targetSpotName);
			}else{
				console.log("" + action.originPlayerId + " finished moving from " + action.originSpotName + " to " + action.targetSpotName);
				Move(action.originPlayerId, action.originSpotName, action.targetSpotName)
			}
		}
	}
	

	
	
	,LocationAction_AppearanceUpdateOther(action){
		var player = this.GetPlayer(action.targetPlayerId);
		player.UpdateApearance(action.result);
		LocationView.RenderPlayerInSpot(this.GetSpotWithPlayer(player.id).name, player);
	}
	
	,LocationAction_AppearanceUpdateSelf(action){
		var player = this.GetPlayer(action.targetPlayerId);
		player.UpdateApearance(action.result);
		LocationView.RenderPlayerInSpot(this.GetSpotWithPlayer(player.id).name, player);
	}
	
	/*
	,LocationAction_AppearanceUpdate(action){
		if(action.originPlayerId == MainController.playerId){
			LocationController.currentAction = action;
		}
		
		//if(action.targetPlayerId != MainController.GetPlayer().id){
			if(! action.finished){
				console.log("" + action.originPlayerId + " started AppearanceUpdateing " + action.targetPlayerId);
			}else{
				if(action.success){
					console.log("" + action.originPlayerId + " finished AppearanceUpdateing " + action.targetPlayerId + ", need update");
					var r = action.result[0];
					var spot = LocationController.GetSpotWithPlayer(r.playerId);
					for(var spotName in LocationController.currentScreen.spots){
						var spot = LocationController.currentScreen.spots[spotName];
						if(spot.player && spot.player.id == r.playerId){
							spot.player.appClothBond[r.group] = r.item;
							LocationView.RenderPlayerInSpot(spot);
							break;
						}
					}					
				}else{
					console.log("" + action.originPlayerId + " did not AppearanceUpdate " + action.targetPlayerId);
				}
			}
		//}else(
		if(action.targetPlayerId == MainController.playerId){
			if(! action.finished){				
				LocationView.StartMinigame(action.challenge, (result) => {result.id=action.id; MslServer.ActionProgress(result);});
			}else{
				//need additional update
			}
		}
	}*/
}
