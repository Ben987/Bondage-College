'use strict'

var MainController = {
	locationTypesCache:null
	,playerData:null
	,onlineFriendList:[]
	,onlineLocationList:[]
	,locationId:null
	
	//TODO refactor to separate main menu and hud
	,mainContainer:null
	,mainHudContainer:null
	,containers:{}
	
	,friendMessages:[]
	
	,Init(){
		this.mainContainer = document.getElementById("MainView");
		this.mainHudContainer = document.getElementById("MainHud");
		this.containers.login = Util.GetFirstChildNodeByName(this.mainContainer, "login");
		this.containers.locations = Util.GetFirstChildNodeByName(this.mainContainer, "locations")
		this.containers.newLocationTypes = Util.GetFirstChildNodeByName(this.mainContainer, "newLocationTypes");
		this.containers.newLocation = Util.GetFirstChildNodeByName(this.mainContainer, "newLocation");
	}
	
	,ShowLoginView(){
		MslServer.Send("GetAllUserNames", {}, function(data){
			var userSelect = Util.GetFirstChildNodeByName(this.containers.login, "userList");		
			for(var id in data){
				Util.CreateElement({tag:"option", parent:userSelect, textContent:data[id], attributes:{value:id }});
			}
		}.bind(this))	
	}
	
	,Login(playerId){
		var name = Util.GetFirstChildNodeByName(this.containers.login, "AccountName").value;
		var pass = Util.GetFirstChildNodeByName(this.containers.login, "Password").value;
		var userSelect = Util.GetFirstChildNodeByName(this.containers.login, "userList");		
		playerId = playerId ? playerId : userSelect.value ? parseInt(userSelect.value) : 0;
		
		MslServer.Send("Login", {playerId:playerId, AccountName:name, Password:pass}, function(data){
			console.log("From Server: Login", data);
			
			sessionStorage.setItem("playerId", data.playerId), 
			sessionStorage.setItem("sessionId", data.sessionId);
			
			this.locationId = data.locationId;
			
			MslServer.Send("GetPlayerAccount", {}, function(data){
				console.log("From Server: GetPlayerAccount", data);				
				this.GetPlayerCharacterResp(data);
			}.bind(this));
		}.bind(this));
	}
	
	,LoginWithSessionId(sessionId, playerId){		
		MslServer.Send("LoginWithSessionId", {playerId:parseInt(playerId), sessionId:sessionId}, {
			success:
				function(data){
					sessionStorage.setItem("sessionId", data.sessionId);				
					console.log("From Server: LoginWithSessionId", data);
					
					this.locationId = data.locationId;
					
					MslServer.Send("GetPlayerAccount", {}, function(data){
						console.log("From Server: GetPlayerAccount", data);					
						this.GetPlayerCharacterResp(data);
					}.bind(this));
				}.bind(this)
			,error:
				function(error){
					console.error(error);
					this.Init();
					this.ShowLoginView();
				}.bind(this)
			}
		);
	}
	
	,RefreshAvailableLocations(){

	}
	
	
	
	,OnFriendMessage(data){
		console.log("From Server: OnFriendMessage", data);		
		data.timestamp = Date.now();
		this.friendMessages.push(data);
		
		var el = Util.CreateElement({parent:this.mainHudContainer, removeAfter:5000, className:"main-beep",  textContent:"Beep " + data.message});
		
		if(this.locationId){
			LocationController.OnFriendMessage(data);
		}
	}
	
	
	,GetPlayerCharacterResp(data){
		this.playerData = data.player;
		
		if(this.locationId){
			this.EnterLocation(this.locationId)
		}else{
			this.HideOtherAndShowView(this.containers.locations);
			MslServer.Send("GetAvailableLocations", {}, function(data){
				console.log("From Server: GetAvailableLocations", data);			
				this.GetAvailableLocationsResp(data);
			}.bind(this));
		}
	}
	
	
	,GetAvailableLocationsResp(data){	
		this.HideOtherAndShowView(this.containers.locations);
		//Util.CreateElement({parent:"MainView", tag:"br"});
		
		var container = Util.GetFirstChildNodeByName(this.containers.locations, "enterButtons");
		Util.ClearNodeContent(container);
		
		this.onlineLocationList = {}
		data.locations.forEach(location => {
			this.onlineLocationList[location.id] = location;
			
			var buttonInnerHtml = "<span>" + location.type  + "</span>"	
								+ " <span>(" + location.playerCount + "/" + location.capacity + ")</span>"
								//+ " <span class='tooltiptext'>Tooltip text</span>";
			var button = Util.CreateElement({parent:container, tag:"button",innerHTML:buttonInnerHtml,cssClass:"main-locations-enter", events:{
				click:function(){
					//this.EnterLocation(location.id);
					this.ShowLocationInfo(location.id);
				}.bind(this)
			}});
			
			if(location.friends){
				button.classList.add("has-friends");
			}
		});
	}
	
	
	,ShowLocationInfo(locationId){
		var container = Util.GetFirstChildNodeByName(this.containers.locations, "info");
		Util.ClearNodeContent(container);
		var location = this.onlineLocationList[locationId];
		
		var button = Util.CreateElement({parent:container, tag:"button",innerHTML:"ENTER",cssClass:"main-locations-enter", events:{
			click:function(){
				Util.ClearNodeContent(container);				
				this.EnterLocation(location.id);
			}.bind(this)
		}});
		
		Util.CreateElement({parent:container, textContent:"Permissions: default"});
		
		location.friends?.forEach(friend =>{
			Util.CreateElement({parent:container, textContent:friend.name + " (" + friend.id + ")"});
		});
	}
	
	
	,EnterLocation(locationId){
		MslServer.Send("EnterLocation",{locationId:locationId},function(data){
			console.log("From Server: EnterLocation", data);
			this.EnterLocationResp(data);
		}.bind(this));
	}
	
	,ExitLocation(){
		MslServer.Send("ExitLocation", {originSpotName:LocationController.GetSpot().name}, function(data){
			console.log("From Server: ExitLocation", data);		
			this.ExitLocationResp(data);
		}.bind(this));
	}
	
	
	,ShowLocationsView(){	
		this.HideOtherAndShowView(this.containers.locations);
	}
	
	
	,ShowCreateLocationTypes(){
		if(!this.locationTypesCache){
			MslServer.Send("GetAvailableLocationTypes", {}, function(data){
				this.GetAvailableLocationTypesResp(data);
			}.bind(this));
		}
		else
			this.HideOtherAndShowView(this.containers.newLocationTypes);
	}
	
	
	,GetAvailableLocationTypesResp(data){
		console.log("GetAvailableLocationTypesResp", data);
		this.locationTypesCache = data.locationTypes;
		
		if(LocationController.location) return;
		
		this.HideOtherAndShowView(this.containers.newLocationTypes);
		this.locationTypesCache.forEach(el => {
			Util.CreateElement({parent:this.containers.newLocationTypes, tag:"button", textContent:el.name
					,events:{click:function(){this.ShowCreateLocation(el)}.bind(this)}});
		});
		
		//var container = Util.createElement({parent:"CreateLocationTypesView", cssText :"width:20%;height:10%;background-color:red"});
	}
	
	
	,ShowCreateLocation(locationDef){ 
		this.HideOtherAndShowView(this.containers.newLocation);
		Util.ClearNodeContent(this.containers.newLocation);
		
		var buttonElement = Util.CreateElement({
			parent:this.containers.newLocation
			,tag:"button"
			,textContent:"Create new " + locationDef.name
			,events:{click:function(){this.CreateLocation(locationDef.name)}.bind(this)}
		});
		
		Util.CreateElement({parent:this.containers.newLocation, tag:"br"});
		
		locationDef.entrances.forEach(el =>{
			var radio = Util.CreateElement({
				parent:this.containers.newLocation, tag:"input"
				,attributes:{type:"radio",name:"LocationEntrance", value:el, id:el}
			});
			Util.CreateElement({parent:this.containers.newLocation, tag:"label", attributes:{"for":el}, innerHTML:el});
			Util.CreateElement({parent:this.containers.newLocation, tag:"br"});
		});
	}
	
	
	,CreateLocation(locationType){
		var selectedEntry = [...document.getElementsByName('LocationEntrance')].find(el => el.checked);
		MslServer.Send("CreateLocation", {locationType:locationType, selectedEntry:selectedEntry ? selectedEntry.value : null}, function(data){
			console.log("From Server: CreateLocation", data);		
			this.EnterLocationResp(data);
		}.bind(this));
	}
	
	
	,ExitLocationResp(data){
		LocationController.UnInit();
		this.mainContainer.style.display = "block";
		this.HideOtherAndShowView(this.containers.locations);
		MslServer.Send("GetAvailableLocations", {}, function(data){
			console.log("From Server: GetAvailableLocations", data);			
			this.GetAvailableLocationsResp(data);
		}.bind(this));
		this.locationId = null;
	}
	
	
	,EnterLocationResp(data){
		this.mainContainer.style.display = "none";
		LocationController.InitAndRender(this.playerData, data);
	}
	
	
	,HideOtherAndShowView(viewContainerElement){
		for(var name in this.containers)
			this.containers[name].style.display = "none";
		
		if(viewContainerElement)
			viewContainerElement.style.display = "block"
	}	
}
