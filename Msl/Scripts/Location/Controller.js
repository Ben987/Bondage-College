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
		,view:null	//renderer for the location
		,actions:null //renderer for action html on the location
		,dialog:null
		,devTools:null
		,minigames:null
	}
	
	//constructor and destructor
	,InitAndRender(mainPlayerData, data){
		//Initialize data
		this.location = data;
		this.mainPlayerId = mainPlayerData.id;
		
		//replace player ids with player objects.  Server sends nothing but id for the main player
		for(var spotName in this.location.players)
			this.location.players[spotName] = new LocationPlayer(this.location.players[spotName].id == mainPlayerData.id ? mainPlayerData : this.location.players[spotName]);
		
		
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
		this.delegates.hud = ClassicHud;
		this.delegates.view = LocationView;	
		this.delegates.actions = LocationActions;
		this.delegates.dialog = LocationDialog;
		this.delegates.devTools = DevTools;
		this.delegates.minigames = LocationMinigames;
		
		LocationController.locationContainer.style.display = "block";
		Object.values(this.delegates).forEach(delegate => {/*console.log(delegate);*/ delegate.Init()});
		
		ClassicHud.RollForward();
		setTimeout(function(){ClassicHud.RollBack()}, 2000);
	}
	
	
	,UnInit(){
		LocationController.location = null;
		LocationController.locationContainer.style.display = "none";
		Object.values(this.delegates).forEach(delegate => delegate?.UnInit());
	}
	
	
	//Getters
	,GetSpot(spotName){
		return spotName ? LocationController.location.spots[spotName] : LocationController.GetSpotWithPlayer(MainController.playerData.id);
	}
	
	
	,GetSpotWithPlayer(playerId){
		for(var spotName in LocationController.location.players)
			if(LocationController.location.players[spotName].id == playerId)
				return LocationController.location.spots[spotName];
	}
	
	
	,GetPlayer(playerIdOrSpotName){
		if(typeof(playerIdOrSpotName) == "undefined")
			playerIdOrSpotName = MainController.playerData.id;
		
		var playerId = parseInt(playerIdOrSpotName);
		if(!playerId) return LocationController.location.players[playerIdOrSpotName];
		
		for(var spotName in LocationController.location.players)
			if(LocationController.location.players[spotName].id == playerId)
				return LocationController.location.players[spotName];
	}
	
	
	,GetPlayers(){
		var players = [];
		for(var spotName in LocationController.location.players)
			players.push(LocationController.location.players[spotName])
		
		return players;
	}
	
	
	//Other private methods
	,InterruptDelegateActions(){
		Object.values(LocationController.delegates).forEach(delegate => delegate?.Interrupt());
	}
	
	
	//UI commands
	,ShowMoveActions(){
		LocationController.InterruptDelegateActions();
		LocationController.delegates.actions.ShowActionsMove();
	}
	
	
	,StartPlayerDialogBondageToys(player){
		LocationController.InterruptDelegateActions();
		LocationController.delegates.dialog.StartBondageToys(player ? player : LocationController.GetPlayer(), player);
	}
	
	,StartPlayerDialogProfile(player){
		LocationController.InterruptDelegateActions();
		LocationController.delegates.dialog.Start(player ? player : LocationController.GetPlayer());
	}
	
	,StartPlayerDialogClothes(player){
		LocationController.InterruptDelegateActions();
		LocationController.delegates.dialog.StartClothes(player ? player : LocationController.GetPlayer());
	}
	
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
	
	
	//Actions, that update server state
	,ExitLocation(){MainController.ExitLocation();}	
	
	/*
	,UpdatePlayerProfile(profileData){
		MslServer.Send("UpdateAccountSettings", profileData, function(data){
			
		}.bind(this));
		LocationController.InterruptDelegateActions();
	}*/

	,StartPlayerStruggle(groupName){
		MslServer.Send("ActionStart", {type:"StruggleRemoveSelf", groupName:groupName}, function(data){
			this.OnLocationAction(data);
		}.bind(this));
		LocationController.InterruptDelegateActions();
	}
	
	,StartPlayerActivity(targetPlayer, activityData){
		console.log(activityData);
		MslServer.Send("ActionStart", {type:"Activity", targetPlayerId:targetPlayer.id, activityName:activityData.activityName, itemName:activityData.itemName, groupName:activityData.groupName}, function(data){
			this.OnLocationAction(data);
		}.bind(this));
		LocationController.InterruptDelegateActions();
	}
	
	
	,UpdatePlayerAppearance(playerUpdate){
		if(! playerUpdate?.IsValid()) throw "ChangeWasInvalidated";
		
		var appearanceUpdate = playerUpdate.GetFinalAppItemList();
		try{
			F3dcgAssets.ValidateUpdateAppearanceOrThrow(appearanceUpdate, playerUpdate.playerTarget, LocationController.GetPlayer());
			MslServer.Send("ActionStart", {type:"AppearanceUpdate", targetPlayerId:playerUpdate.playerTarget.id, appearanceUpdate:playerUpdate.GetFinalAppItemList()}, function(data){
				this.OnLocationAction(data);
			}.bind(this));
		}catch(e){
			console.log(appearanceUpdate);
			throw e;
		}
		
		LocationController.InterruptDelegateActions();
	}
	
	//,SpotInfo(spotName){MslServer.ActionStart({type:"SpotInfo", originSpotName:LocationController.currentSpotName, targetSpotName:spotName});}
	,MoveToSpot(spotName){
		MslServer.Send("ActionStart", {type:"MoveToSpot", originSpotName:LocationController.GetSpot().name, targetSpotName:spotName}, function(data){
			this.OnLocationAction(data);
		}.bind(this));
	}
	
	
	,SendChatMessage(content){
		MslServer.Send("ActionStart", {type:"ChatMessage", content:content}, function(data){
			this.OnLocationAction(data);
		}.bind(this));
	}
	
	//TODO:  validate pose change is allowed
	,ChangePose(){
		if(this.GetPlayer().CanChangePose()){
			var pose = this.GetPlayer().activePose == F3dcgAssets.POSE_NONE ? F3dcgAssets.POSE_KNEEL : F3dcgAssets.POSE_NONE;
			
			MslServer.Send("ActionStart", {type:"ChangePose", pose:pose}, function(data){
				this.OnLocationAction(data);
			}.bind(this));		
		}
	}
	
	//TODO change convension from *Resp to On* to indicate a method called by other modules
	,OnFriendMessage(data){
		this.delegates.chat.OnFriendMessage(data);
	}
	
	,OnLocationAction(data){
		console.log("From Server: OnLocationAction", data);
		LocationController["LocationAction_" + data.type](data);
		LocationController.delegates.chat.OnAction(data);
	}
	
	,LocationAction_Activity(data){
		//console.log(data);//handled by chat 	
	}
	
	,LocationAction_ChangePose(data){
		var player = LocationController.GetPlayer(data.playerId);
		if(! player) 	throw "PlayerNotFound " + data.playerId;
		player.activePose = data.result;
		var spot = this.GetSpotWithPlayer(player.id);
		player.UpdateAppearanceAndRender();
		if(spot) //may be update for player that is in spot that is not visible
			LocationController.delegates.view.RenderPlayerInSpot(this.GetSpotWithPlayer(player.id).name, player);
	}
	
	
	,LocationAction_PlayerExit(data){
		var spot = LocationController.GetSpotWithPlayer(data.playerId);
		if(! spot) 	throw "PlayerNotFound " + data.playerId;
		
		var player = LocationController.location.players[spot.name];
		LocationController.delegates.chat.OnPlayerExit(player);
		LocationController.delegates.view.OnPlayerExit(player);
		LocationController.delegates.hud.OnPlayerExit(player);
		
		delete LocationController.location.players[spot.name];
	}
	
	
	,LocationAction_PlayerEnter(data){
		var existingPlayer = LocationController.GetPlayer(data.player.id);
		var spot = LocationController.GetSpot(data.spotName);
		
		var player = new LocationPlayer(data.player);
		LocationController.location.players[data.spotName] = player
		LocationController.delegates.view.RenderPlayerInSpot(data.spotName, player);
		LocationController.delegates.chat.OnPlayerEnter(player, spot);
		LocationController.delegates.hud.OnPlayerEnter(player, spot);
	}
	
	,LocationAction_PlayerReconnect(data){
		console.log(data.playerId + "  reconnected")
		var player = LocationController.GetPlayer(data.playerId);
		LocationController.delegates.view.OnPlayerReconnect(player);
		LocationController.delegates.chat.OnPlayerReconnect(player);
		LocationController.delegates.hud.OnPlayerReconnect(player);
	}
	
	,LocationAction_PlayerDisconnectTimeout(data){
		this.LocationAction_PlayerExit(data)
	}
	
	,LocationAction_PlayerDisconnect(data){
		console.log(data.playerId + "  disconnected")
		var player = LocationController.GetPlayer(data.playerId);
		LocationController.delegates.view.OnPlayerDisconnect(player);
		LocationController.delegates.chat.OnPlayerDisconnect(player);
		LocationController.delegates.hud.OnPlayerDisconnect(player);
	}
	
	
	,LocationAction_ChatMessage(data){
		//already takecn care of earlier
	}
	
	
	,LocationAction_SpotInfo(data){
		console.log("Spot info not implemented");
	}
	
	
	,LocationAction_StruggleRemoveSelf(action){
		var player = this.GetPlayer(action.originPlayerId);
		
		if(player.id == MainController.playerData.id){//self action
			if(! action.finished){//minigame
				LocationController.currentAction = action;
				LocationController.delegates.minigames.StartMinigame(action.challenge, function(result){
					result.id = action.id;
					MslServer.Send("ActionProgress", result, function(data){
						this.OnLocationAction(data);
					}.bind(this));
				}.bind(this));
			}else if(action.success){//finished
				//Move(action.originPlayerId, action.originSpotName, action.targetSpotName)				
				//LocationController.currentAction.finished = true;
				
				player.UpdateAppearanceAndRender(action.result);
				LocationController.delegates.view.RenderPlayerInSpot(this.GetSpotWithPlayer(player.id).name, player);				
			}else{
				throw action;
			}
		}else{//other action
			if(! action.finished){
				//console.log("" + action.originPlayerId + " started struggling");
			}else{
				//console.log("" + action.originPlayerId + " finished struggling");
				player.UpdateAppearanceAndRender(action.result);
				LocationController.delegates.view.RenderPlayerInSpot(this.GetSpotWithPlayer(player.id).name, player);	
			}
		}	
	}
	
	,LocationAction_MoveToSpot(action){
		var Move = function(playerId, originSpotName, targetSpotName){
			var player  = LocationController.GetPlayer(playerId);
			var originSpot = LocationController.GetSpotWithPlayer(playerId), targetSpot = LocationController.location.spots[targetSpotName];
			if(! originSpot.name == action.originSpotName) throw "MismatchedOrigin " + originSpot.name + " " + action.originSpotName;
			if(LocationController.location.players[action.targetSpotName]) throw "SpotOccupied " + action.targetSpotName;		
			LocationController.location.players[targetSpotName] = LocationController.location.players[originSpotName];
			delete LocationController.location.players[originSpotName];
			
			if(player.id == MainController.playerData.id	&& originSpot.screens.Default != targetSpot.screens.Default){
				Object.values(LocationController.delegates).forEach(delegate => {delegate?.OnScreenChange()});		
			}else{
				LocationController.delegates.view.OnPlayerMove(player, originSpotName, targetSpotName);
			}
		}
		
		if(action.originPlayerId == MainController.playerData.id){//self action
			if(! action.finished){//minigame
				LocationController.currentAction = action;
				LocationController.delegates.minigames.StartMinigame(action.challenge, function(result){
					result.id = action.id;
					MslServer.Send("ActionProgress", result, function(data){
						this.OnLocationAction(data);
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
				//console.log("" + action.originPlayerId + " started moving from " + action.originSpotName + " to " + action.targetSpotName);
			}else{
				//console.log("" + action.originPlayerId + " finished moving from " + action.originSpotName + " to " + action.targetSpotName);
				Move(action.originPlayerId, action.originSpotName, action.targetSpotName)
			}
		}
	}
	
	
	,LocationAction_AppearanceUpdate(action){
		var player = this.GetPlayer(action.targetPlayerId);
		player.UpdateAppearanceAndRender(action.result);
		LocationController.delegates.view.RenderPlayerInSpot(this.GetSpotWithPlayer(player.id).name, player);
	}
}
