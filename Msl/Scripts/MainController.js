'use strict'

var MainController = {
	locationTypesCache:null
	,playerAccount:null
	,onlineFriendList:[]
	,onlineLocationList:[]
	,locationId:null
	,containers:{}
	
	,Init(){
		this.mainContainer = document.getElementById("MainView");
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
		var userSelect = Util.GetFirstChildNodeByName(this.containers.login, "userList");
		
		playerId = playerId ? playerId : parseInt(userSelect.value);
		
		MslServer.Send("Login", {playerId:playerId}, function(data){
			console.log("Login");
			console.log(data);
			
			sessionStorage.setItem("playerId", data.playerId), 
			sessionStorage.setItem("sessionId", data.sessionId);
			
			this.locationId = data.locationId;
			
			MslServer.Send("GetPlayerAccount", {}, function(data){
				this.GetPlayerCharacterResp(data);
			}.bind(this));
		}.bind(this));
	}
	
	,LoginWithSessionId(sessionId, playerId){		
		MslServer.Send("LoginWithSessionId", {playerId:parseInt(playerId), sessionId:sessionId}, {
			success:
				function(data){
					sessionStorage.setItem("sessionId", data.sessionId);				
					console.log("LoginWithSessionId");
					console.log(data);
					
					this.locationId = data.locationId;
					
					MslServer.Send("GetPlayerAccount", {}, function(data){
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
	
	
	,GetPlayerCharacterResp(data){
		console.log("GetPlayerCharacterResp");
		console.log(data);
		MainController.playerAccount = new PlayerAccount(data.player);
		
		if(this.locationId){
			this.EnterLocation(this.locationId)
		}else{
			MainController.HideOtherAndShowView(this.containers.locations);
			MslServer.Send("GetAvailableLocations", {}, function(data){
				this.GetAvailableLocationsResp(data);
			}.bind(this));
		}
	}
	
	
	,GetAvailableLocationsResp(data){
		console.log("GetAvailableLocationsResp");
		console.log(data);
		
		MainController.HideOtherAndShowView(this.containers.locations);
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
			this.EnterLocationResp(data);
		}.bind(this));
	}
	
	,ExitLocation(){
		MslServer.Send("ExitLocation", {originSpotName:LocationController.GetSpot().name}, function(data){
			this.ExitLocationResp(data);
		}.bind(this));
	}
	
	
	,ShowLocationsView(){	
		MainController.HideOtherAndShowView(this.containers.locations);
	}
	
	
	,ShowCreateLocationTypes(){
		if(!MainController.locationTypesCache){
			MslServer.Send("GetAvailableLocationTypes", {}, function(data){
				this.GetAvailableLocationTypesResp(data);
			}.bind(this));
		}
		else
			MainController.HideOtherAndShowView(this.containers.newLocationTypes);
	}
	
	
	,GetAvailableLocationTypesResp(data){
		console.log("GetAvailableLocationTypesResp");
		console.log(data);
		MainController.locationTypesCache = data.locationTypes;
		
		if(LocationController.location) return;
		
		MainController.HideOtherAndShowView(this.containers.newLocationTypes);
		MainController.locationTypesCache.forEach(el => {
			Util.CreateElement({parent:this.containers.newLocationTypes, tag:"button", textContent:el.name
					,events:{click:function(){MainController.ShowCreateLocation(el)}}});
		});
		
		//var container = Util.createElement({parent:"CreateLocationTypesView", cssText :"width:20%;height:10%;background-color:red"});
	}
	
	
	,ShowCreateLocation(locationDef){ 
		MainController.HideOtherAndShowView(this.containers.newLocation);
		
		var buttonElement = Util.CreateElement({
			parent:this.containers.newLocation
			,tag:"button"
			,textContent:"Create new " + locationDef.name
			,events:{click:function(){MainController.CreateLocation(locationDef.name)}}
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
			this.EnterLocationResp(data);
		}.bind(this));
	}
	
	
	,ExitLocationResp(data){
		LocationController.UnInit();
		this.mainContainer.style.display = "block";
		MainController.HideOtherAndShowView(this.containers.locations);
		MslServer.Send("GetAvailableLocations", {}, function(data){
			this.GetAvailableLocationsResp(data);
		}.bind(this));
	}
	
	
	,EnterLocationResp(data){
		console.log("EnterLocationResp");
		console.log(data);
		this.mainContainer.style.display = "none";
		LocationController.InitAndRender(data);
	}
	
	
	,HideOtherAndShowView(viewContainerElement){
		for(var name in this.containers)
			this.containers[name].style.display = "none";
		
		if(viewContainerElement)
			viewContainerElement.style.display = "block"

	}	
}
