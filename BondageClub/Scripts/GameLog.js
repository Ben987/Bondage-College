"use strict";
var Log = [];

// Add a new log to the server side
function LogAdd(NewLogName, NewLogGroup, NewLogValue, Push) {

	// OwnerRule can only be added if the player has owner
	if (QueryLogGroup == "OwnerRule" && !Player.IsOwned()) return;

	// Makes sure the value is numeric
	if (NewLogValue != null) NewLogValue = parseInt(NewLogValue);

	// Checks to make sure we don't duplicate a log
	var AddToLog = true;
	for (var L = 0; L < Log.length; L++)
		if ((Log[L].Name == NewLogName) && (Log[L].Group == NewLogGroup)) {
			Log[L].Value = NewLogValue;
			AddToLog = false;
			break;
		}

	// Adds a new log object if we need to
	if (AddToLog) {
		Log.push(NewLog = {
			Name: NewLogName,
			Group: NewLogGroup,
			Value: NewLogValue
		});
	}

	// Sends the log to the server
	if ((Push == null) || Push)
		ServerPlayerLogSync();

}

// Deletes a log entry
function LogDelete(DelLogName, DelLogGroup, Push) {

	// Finds the log entry and deletes it
	Log = Log.filter(L => L.Name != DelLogName && L.Group != DelLogGroup);

	// Sends the new log to the server
	if ((Push == null) || Push)
		ServerPlayerLogSync();

}

// Checks if the log exists, return true if it does (if there's a value, it counts as an expiry time)
function LogQuery(QueryLogName, QueryLogGroup) {
	// If it is an OwnerRule and Player is not owned than return false
	if (QueryLogGroup == "OwnerRule" && !Player.IsOwned()) return false;
	return Log.some(L => L.Name == QueryLogName && L.Group == QueryLogGroup && (L.Value == null || L.Value >= CurrentTime));;
}

// Returns the value associated to the log
function LogValue(QueryLogName, QueryLogGroup) {
	// If it is an OwnerRule and Player is not owned than return null
	if (QueryLogGroup == "OwnerRule" && !Player.IsOwned()) return null;
	return Log.find(L => L.Name == QueryLogName && L.Group == QueryLogGroup);
}

// Loads the account log
function LogLoad(NewLog) {

	// Make sure we have something to load
	Log = [];
	if (NewLog != null) {

		// Add each log entry one by one
		for (var L = 0; L < NewLog.length; L++)
			LogAdd(NewLog[L].Name, NewLog[L].Group, NewLog[L].Value, false);

	}
}