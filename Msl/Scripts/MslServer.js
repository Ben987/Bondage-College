'use strict'

var MslServer = {
	socket:null
	,Init(){
		//console.log(ServerURL + "/msl");
		MslServer.socket = io(ServerURL + "/msl");
		MslServer.socket.on("GeneralError", resp => {  console.log(resp); });
		MslServer.socket.on("GetPlayerCharacter", resp => MslServer.ServerResponse(resp, MainController.GetPlayerCharacterResp));
		MslServer.socket.on("GetAvailableLocations", resp => MslServer.ServerResponse(resp, MainController.GetAvailableLocationsResp));
		MslServer.socket.on("GetAvailableLocationTypes", resp => MslServer.ServerResponse(resp, MainController.GetAvailableLocationTypesResp));
		//MslServer.socket.on("CreateLocation", resp => MslServer.ServerResponse(resp, MainController.CreateLocationResp));
		MslServer.socket.on("EnterLocation", resp => MslServer.ServerResponse(resp, MainController.EnterLocationResp));
		MslServer.socket.on("ExitLocation", resp => MslServer.ServerResponse(resp, MainController.ExitLocationResp));
		
		MslServer.socket.on("PlayerEnterLocation", resp => MslServer.ServerResponse(resp, LocationController.PlayerEnterLocationResp));
		MslServer.socket.on("PlayerExitLocation", resp => MslServer.ServerResponse(resp, LocationController.PlayerExitLocationResp));
		
		MslServer.socket.on("LocationAction", resp => MslServer.ServerResponse(resp, LocationController.LocationActionResp));
		//MslServer.socket.on("LocationUpdate", resp => MslServer.ServerResponse(resp, LocationController.LocationUpdateResp));
	}
	,ServerResponse(resp, callback){
		if(!resp.meta.success)		console.log(resp); 
		else						callback(resp.data);
	}
	
	,ExitLocation(spotName){
		MslServer.socket.emit("ExitLocation", {spotName:spotName});
	}
	
	,EnterLocation(locationId){
		MslServer.socket.emit("EnterLocation", {locationId:locationId});
	}

	,GetAvailableLocations(){
		MslServer.socket.emit("GetAvailableLocations", {});
	}
	,ActionStart(data){
		MslServer.socket.emit("ActionStart", data);
	}
	,ActionProgress(data){
		MslServer.socket.emit("ActionProgress", data);
	}
	,GetPlayerCharacter(id){
		MslServer.socket.emit("GetPlayerCharacter", {memberNumber: id});
	}
	,GetAvailableLocationTypes(){
		MslServer.socket.emit("GetAvailableLocationTypes", {});
	}
	,CreateLocation(locationType, selectedEntry){
		MslServer.socket.emit("CreateLocation", {locationType:locationType, selectedEntry:selectedEntry});
	}
	,MoveToSpot(originSpotName, destinationSpotName){
		MslServer.socket.emit("MoveToSpot", {originSpotName:originSpotName, destinationSpotName:destinationSpotName});
	}
}