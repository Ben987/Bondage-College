'use strict'

//The controller has to be a singleton because being called by MslServer
var LocationController = {
	locationContainer:null
	,canvasContainer:null
	,backgroundContainer:null
	,midgroundContainer:null
	,foregroundContainer:null
	,inputContainer:null
	,hudContainer:null

	//currentActionData:null
	//,currentActionTimer:null
	//,serverTimeDiff:0
	
	,location:null//the data model
	
	,delegates:{//Each delegate implements Init, OnScreenChange, InterruptActions and UnInit
		chat:null
		//,profile:null //Move this to main controller?
		,view:null	//renderer for the location
		,actions:null //renderer for action html on the location
		,dialog:null
		,devTools:null
		,minigames:null
	}
	
	//constructor and destructor
	,InitAndRender(data){
		//Initialize data
		this.location = data;
		
		//replace player ids with player objects
		for(var spotName in this.location.players)
			this.location.players[spotName] = new LocationPlayer(this.location.players[spotName]);
		
		
		//DOM container elements
		this.locationContainer = document.getElementById("LocationView");
		this.canvasContainer = document.getElementById("LocationViewCanvas");
		this.backgroundContainer = document.getElementById("LocationViewBackground");
		this.midgroundContainer = document.getElementById("LocationViewMidground");
		this.foregroundContainer = document.getElementById("LocationViewForeground");
		this.inputContainer = document.getElementById("LocationViewInput");
		this.hudContainer = document.getElementById("LocationViewHud");
		
		//Delegates Order is important
		this.delegates.chat = LocationViewChat;
		//this.delegates.profile = ProfileManagement;
		this.delegates.view = LocationView;	
		this.delegates.actions = LocationActions;
		this.delegates.dialog = LocationDialog;
		this.delegates.devTools = DevTools;
		this.delegates.minigames = LocationMinigames;
		
		LocationController.locationContainer.style.display = "block";
		Object.values(this.delegates).forEach(delegate => {/*console.log(delegate);*/ delegate.Init()});
		
		ClassicHud.RollForward();
		setTimeout(ClassicHud.RollBack, 2000);
	}
	
	
	,UnInit(){
		LocationController.location = null;
		LocationController.locationContainer.style.display = "none";
		Object.values(this.delegates).forEach(delegate => delegate?.UnInit());
	}
	
	
	//Getters
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
	
	
	//Other private methods
	,InterruptDelegateActions(){
		Object.values(LocationController.delegates).forEach(delegate => delegate?.Interrupt());
	}
	
	
	//Show actions or popups
	,ShowMoveActions(){
		LocationController.InterruptDelegateActions();
		LocationController.delegates.actions.ShowActionsMove();
	}
	
	
	,StartPlayerDialog(player){
		LocationController.InterruptDelegateActions();
		LocationController.delegates.dialog.Start(player ? player : LocationController.GetPlayer());
	}
	
	/*
	,ShowPlayerProfile(player){
		//console.log(player);
		LocationController.InterruptDelegateActions();
		LocationController.delegates.profile.ShowProfile(player ? player : LocationController.GetPlayer());
	}*/
	
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
		LocationController.viewDelegate.RenderPlayerInSpot(this.GetCurrentSpot());	
	}*/
	
	//Actions, that update server state
	,ExitLocation(){MainController.ExitLocation();}	
	
	/*
	,UpdatePlayerProfile(profileData){
		MslServer.Send("UpdateAccountSettings", profileData, function(data){
			
		}.bind(this));
		LocationController.InterruptDelegateActions();
	}*/

	,UpdatePlayerAppearance(playerUpdate){
		if(! playerUpdate?.IsValid()) throw "ChangeWasInvalidated";
		
		var appearanceUpdate = playerUpdate.GetFinalAppItemList();
		try{
			if(playerUpdate.player.id == MainController.playerAccount.id){
				F3dcgAssets.ValidateUpdateAppearanceOrThrow(appearanceUpdate, playerUpdate.player);
				MslServer.Send("ActionStart", {type:"AppearanceUpdateSelf", appearanceUpdate:appearanceUpdate}, function(data){
					this.LocationActionResp(data);
				}.bind(this));
			}else{
				F3dcgAssets.ValidateUpdateAppearanceOrThrow(appearanceUpdate, playerUpdate.player, LocationController.GetPlayer());
				MslServer.Send("ActionStart", {type:"AppearanceUpdateOther", targetPlayerId:playerUpdate.player.id, appearanceUpdate:playerUpdate.GetFinalAppItemList()}, function(data){
					this.LocationActionResp(data);
				}.bind(this));
			}
		}catch(e){
			console.log(appearanceUpdate);
			throw e;
		}
		
		LocationController.InterruptDelegateActions();
	}
	
	//,SpotInfo(spotName){MslServer.ActionStart({type:"SpotInfo", originSpotName:LocationController.currentSpotName, targetSpotName:spotName});}
	,MoveToSpot(spotName){
		MslServer.Send("ActionStart", {type:"MoveToSpot", originSpotName:LocationController.GetSpot().name, targetSpotName:spotName}, function(data){
			this.LocationActionResp(data);
		}.bind(this));
	}
	
	,SendChatMessage(content){
		MslServer.Send("ActionStart", {type:"ChatMessage", content:content}, function(data){
			this.LocationActionResp(data);
		}.bind(this));
	}
	
	
	,FriendMessageResp(data){
		this.delegates.chat.OnFriendMessage(data);
	}
	
	,LocationActionResp(data){
		console.log("LocationActionResp"); 
		console.log(data);
		console.log("LocationAction_" + data.type);
		LocationController["LocationAction_" + data.type](data);
		LocationController.delegates.chat.OnAction(data);
	}
	
	,LocationAction_PlayerExit(data){
		var spot = LocationController.GetSpotWithPlayer(data.playerId);
		if(! spot) 	throw "PlayerNotFound " + data.playerId;
		
		var player = LocationController.location.players[spot.name];
		LocationController.delegates.view.OnPlayerExit(player);
		LocationController.delegates.chat.OnPlayerExit(player);
		
		delete LocationController.location.players[spot.name];

	}
	
	
	,LocationAction_PlayerEnter(data){
		var existingPlayer = LocationController.GetPlayer(data.player.id);
		var spot = LocationController.GetSpot(data.spotName);
		
		var player = new LocationPlayer(data.player);
		LocationController.location.players[data.spotName] = player
		LocationController.delegates.view.RenderPlayerInSpot(data.spotName, player);
		LocationController.delegates.chat.OnPlayerEnter(player, spot);
	}
	
	,LocationAction_PlayerReconnect(data){
		console.log(data.playerId + "  reconnected")
		var player = LocationController.GetPlayer(data.playerId);
		LocationController.delegates.view.OnPlayerReconnect(player);
		LocationController.delegates.chat.OnPlayerReconnect(player);
	}
	
	,LocationAction_PlayerDisconnectTimeout(data){
		this.LocationAction_PlayerExit(data)
	}
	
	,LocationAction_PlayerDisconnect(data){
		console.log(data.playerId + "  disconnected")
		var player = LocationController.GetPlayer(data.playerId);
		LocationController.delegates.view.OnPlayerDisconnect(player);
		LocationController.delegates.chat.OnPlayerDisconnect(player);
	}
	
	
	,LocationAction_ChatMessage(data){
		//already takecn care of earlier
	}
	
	
	,LocationAction_SpotInfo(data){
		console.log("Spot info not implemented");
	}
	
	
	,LocationAction_MoveToSpot(action){
		var Move = function(playerId, originSpotName, targetSpotName){
			var player  = LocationController.GetPlayer(playerId);
			var originSpot = LocationController.GetSpotWithPlayer(playerId), targetSpot = LocationController.location.spots[targetSpotName];
			if(! originSpot.name == action.originSpotName) throw "MismatchedOrigin " + originSpot.name + " " + action.originSpotName;
			if(LocationController.location.players[action.targetSpotName]) throw "SpotOccupied " + action.targetSpotName;		
			LocationController.location.players[targetSpotName] = LocationController.location.players[originSpotName];
			delete LocationController.location.players[originSpotName];
			
			if(player.id == MainController.playerAccount.id	&& originSpot.screens.Default != targetSpot.screens.Default){
				Object.values(LocationController.delegates).forEach(delegate => {delegate?.OnScreenChange()});		
			}else{
				LocationController.delegates.view.OnPlayerMove(player, originSpotName, targetSpotName);
			}
		}
		
		if(action.originPlayerId == MainController.playerAccount.id){//self action
			if(! action.finished){//minigame
				LocationController.currentAction = action;
				LocationController.delegates.minigames.StartMinigame(action.challenge, function(result){
					result.id = action.id;
					MslServer.Send("ActionProgress", result, function(data){
						this.LocationActionResp(data);
					}.bind(this));
				}.bind(this));
			}else if(action.success){//finished
				Move(action.originPlayerId, action.originSpotName, action.targetSpotName)				
				//LocationController.currentAction.finished = true;
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
		player.UpdateAppearanceAndRender(action.result);
		LocationController.delegates.view.RenderPlayerInSpot(this.GetSpotWithPlayer(player.id).name, player);
	}
	
	
	,LocationAction_AppearanceUpdateSelf(action){
		var player = this.GetPlayer(action.targetPlayerId);
		player.UpdateAppearanceAndRender(action.result);
		LocationController.delegates.view.RenderPlayerInSpot(this.GetSpotWithPlayer(player.id).name, player);
	}
}
