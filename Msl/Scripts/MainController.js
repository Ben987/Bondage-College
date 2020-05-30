'use strict'

var MainController = {
	divIdList : ["LoginView", "MainView", "CreateLocationTypesView", "CreateLocationView"]
	,locationTypesCache:null
	,playerAccount:null
	,onlineFriendList:{}
	
	,Init(){
		var loginContainer = document.getElementById("LoginView");
		var userSelect = Util.GetFirstChildNodeByName(loginContainer, "userList");
		
		MslServer.Send("GetAllUserNames", {}, function(data){
			for(var id in data){
				Util.CreateElement({tag:"option", parent:userSelect, textContent:data[id], attributes:{value:id }});
			}
		}.bind(this))
	}
	
	,Login(playerId){
		var loginContainer = document.getElementById("LoginView");
		var userSelect = Util.GetFirstChildNodeByName(loginContainer, "userList");
		
		playerId = playerId ? playerId : parseInt(userSelect.value);
		
		MslServer.Send("GetPlayerCharacter", {playerId:playerId}, function(data){
			this.GetPlayerCharacterResp(data);
		}.bind(this));
	}
	
	,LoginWithMainSession(mainSessionId, playerId){
		MslServer.Send("LoginWithSessionToken", {playerId:parseInt(playerId), mainSessionId:mainSessionId}, {
			success:
				function(data){
					this.GetPlayerCharacterResp(data);
				}.bind(this)
			,error:
				function(error){
					console.error(error);
					this.Init();
				}.bind(this)
			}
		);
	}
	
	
	,GetPlayerCharacterResp(data){
		console.log("GetPlayerCharacterResp");
		console.log(data);
		MainController.playerAccount = new PlayerAccount(data.player);
		MainController.ShowMainViewAndCreateButton();
		MslServer.Send("GetAvailableLocations", {}, function(data){
			this.GetAvailableLocationsResp(data);
		}.bind(this));
	}
	
	
	,GetAvailableLocationsResp(data){
		console.log("GetAvailableLocationsResp");
		console.log(data);
		MainController.ShowMainViewAndCreateButton();
		Util.CreateElement({parent:"MainView", tag:"br"});
		data.locations.forEach(location => {
			Util.CreateElement({parent:"MainView", tag:"button",textContent:"Enter " + location.id
					,events:{click:() => MainController.EnterLocation(location.id)}});
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
	
	
	,ShowMainViewAndCreateButton(){
		MainController.HideOtherAndShowView("MainView", true);		
		Util.CreateElement({parent:"MainView",  tag:"button", textContent:"Create Location"
			,events:{click:MainController.ShowCreateLocationTypes.bind(this)}
		});
	}
	
	
	,ShowCreateLocationTypes(){
		if(!MainController.locationTypesCache){
			MslServer.Send("GetAvailableLocationTypes", {}, function(data){
				this.GetAvailableLocationTypesResp(data);
			}.bind(this));
		}
		else
			MainController.HideOtherAndShowView("CreateLocationTypesView");
	}
	
	
	,GetAvailableLocationTypesResp(data){
		console.log("GetAvailableLocationTypesResp");
		console.log(data);
		MainController.locationTypesCache = data.locationTypes;
		
		if(LocationController.location) return;
		
		MainController.HideOtherAndShowView("CreateLocationTypesView");
		MainController.locationTypesCache.forEach(el => {
			Util.CreateElement({parent:"CreateLocationTypesView", tag:"button", textContent:el.name
					,events:{click:function(){MainController.ShowCreateLocation(el)}}});
		});
		
		//var container = Util.createElement({parent:"CreateLocationTypesView", cssText :"width:20%;height:10%;background-color:red"});
	}
	
	
	,ShowCreateLocation(locationDef){ 
		MainController.HideOtherAndShowView("CreateLocationView", true);
		
		var buttonElement = Util.CreateElement({
			parent:"CreateLocationView"
			,tag:"button"
			,textContent:"Create new " + locationDef.name
			,events:{click:function(){MainController.CreateLocation(locationDef.name)}}
		});
		
		Util.CreateElement({parent:"CreateLocationView", tag:"br"});
		
		locationDef.entrances.forEach(el =>{
			var radio = Util.CreateElement({
				parent:"CreateLocationView", tag:"input"
				,attributes:{type:"radio",name:"LocationEntrance", value:el, id:el}
			});
			Util.CreateElement({parent:"CreateLocationView", tag:"label", attributes:{"for":el}, innerHTML:el});
			Util.CreateElement({parent:"CreateLocationView", tag:"br"});
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
		MainController.ShowMainViewAndCreateButton();
		MslServer.Send("GetAvailableLocations", {}, function(data){
			this.GetAvailableLocationsResp(data);
		}.bind(this));
	}
	
	
	,EnterLocationResp(data){
		console.log("EnterLocationResp");
		console.log(data);
		MainController.HideOtherAndShowView();
		LocationController.InitAndRender(data);
	}
	
	
	,HideOtherAndShowView(viewElementId, clearInnerHtml){
		MainController.divIdList.forEach(viewElementId => document.getElementById(viewElementId).style.display = "none");
		if(viewElementId) {
			document.getElementById(viewElementId).style.display = "block";
			if(clearInnerHtml) document.getElementById(viewElementId).innerHTML = "";
		}
	}	
}
