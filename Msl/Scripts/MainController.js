'use strict'

var MainController = {
	divIdList : ["LoginView", "MainView", "CreateLocationTypesView", "CreateLocationView"]
	,locationTypesCache:null
	,playerAccount:null
	
	,Login(memberNumber){
		memberNumber = memberNumber ? memberNumber : parseInt(document.getElementById("loginMemberNumber").value);
		if(! memberNumber) return;
		
		MslServer.GetPlayerCharacter(memberNumber);
	}
	
	
	,GetPlayerCharacterResp(data){
		console.log("GetPlayerCharacterResp");
		console.log(data);
		MainController.playerAccount = new PlayerAccount(data.player);
		MainController.ShowMainViewAndCreateButton();
		MslServer.GetAvailableLocations();
	}
	
	
	,GetAvailableLocationsResp(data){
		console.log("GetAvailableLocationsResp");
		console.log(data);
		MainController.ShowMainViewAndCreateButton();
		Util.CreateElement({parent:"MainView", tag:"br"});
		data.locations.forEach(location => {
			Util.CreateElement({parent:"MainView", template:"InterfaceButtonTemplate",attributes:{value:"Enter " + location.id}
					,events:{click:() => MainController.EnterLocation(location.id)}});
		});
	}
	
	
	,EnterLocation(locationId){
		MslServer.EnterLocation(locationId);
	}
	
	,ExitLocation(){
		MslServer.ExitLocation(LocationController.GetSpot().name);
	}
	
	
	,ShowMainViewAndCreateButton(){
		MainController.HideOtherAndShowView("MainView", true);		
		Util.CreateElement({parent:"MainView", template:"InterfaceButtonTemplate",attributes:{value:"Create Location"}
				,events:{click:MainController.ShowCreateLocationTypes}
		})
	}
	
	
	,ShowCreateLocationTypes(){
		if(!MainController.locationTypesCache)
			MslServer.GetAvailableLocationTypes();
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
			Util.CreateElement({parent:"CreateLocationTypesView", template:"CreateLocationButtonTemplate", attributes:{type:"submit", value:el.name}
					,events:{click:function(){MainController.ShowCreateLocation(el)}}});
		});
		
		//var container = Util.createElement({parent:"CreateLocationTypesView", cssText :"width:20%;height:10%;background-color:red"});
	}
	
	
	,ShowCreateLocation(locationDef){
		MainController.HideOtherAndShowView("CreateLocationView", true);
		
		var buttonElement = Util.CreateElement({parent:"CreateLocationView", template:"CreateLocationButtonTemplate"
			, attributes:{value:"Create new " + locationDef.name}
			, events:{click:function(){MainController.CreateLocation(locationDef.name)}}});
		
		Util.CreateElement({parent:"CreateLocationView", tag:"br"});
		
		locationDef.entrances.forEach(el =>{
			var radio = Util.CreateElement({parent:"CreateLocationView", template:"LocationEntranceSelectionTemplate"
				,attributes:{name:"LocationEntrance", value:el, id:el}
			});
			Util.CreateElement({parent:"CreateLocationView", tag:"label", attributes:{"for":el}, innerHTML:el});
			Util.CreateElement({parent:"CreateLocationView", tag:"br"});
		});
	}
	
	
	,CreateLocation(locationType){
		var selectedEntry = [...document.getElementsByName('LocationEntrance')].find(el => el.checked);
		MslServer.CreateLocation(locationType, selectedEntry ? selectedEntry.value : null);
	}
	
	
	,ExitLocationResp(data){
		LocationController.currentLocation = null;
		LocationController.currentScreen = null;
		LocationController.currentSpotName = null;
		LocationController.currentActionData = null;
		LocationView.HideAndClearView();
		MainController.ShowMainViewAndCreateButton();
		MslServer.GetAvailableLocations();		
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
