"use strict";
var Log = [];

/**
 * Adds a new entry to the player's logs, renews the value if it already exists.
 * @param {string} NewLogName - The name of the log
 * @param {string} NewLogGroup - The name of the log's group
 * @param {number} [NewLogValue] - Value for the log as the time in ms. Is undefined if the value is permanent
 * @param {boolean} [Push] - TRUE if we must push the log to the server
 * @returns {void} - Nothing
 */
function LogAdd(NewLogName, NewLogGroup, NewLogValue, Push) {

	// Makes sure the value is numeric
	if (NewLogValue != null) NewLogValue = parseInt(NewLogValue);

	// Checks to make sure we don't duplicate a log
	var AddToLog = true;
	for (let L = 0; L < Log.length; L++)
		if ((Log[L].Name == NewLogName) && (Log[L].Group == NewLogGroup)) {
			Log[L].Value = NewLogValue;
			AddToLog = false;
			break;
		}

	// Adds a new log object if we need to
	if (AddToLog) {
		var NewLog = {
			Name: NewLogName,
			Group: NewLogGroup,
			Value: NewLogValue
		}
		Log.push(NewLog);
	}

	// Sends the log to the server
	if ((Push == null) || Push)
		ServerPlayerLogSync();

}

/**
 * Deletes a log entry.
 * @param {string} NewLogName - The name of the log
 * @param {string} NewLogGroup - The name of the log's group
 * @param {boolean} [Push] - TRUE if we must push the log to the server
 * @returns {void} - Nothing
 */
function LogDelete(DelLogName, DelLogGroup, Push) {

	// Finds the log entry and deletes it
	for (let L = 0; L < Log.length; L++)
		if ((Log[L].Name == DelLogName) && (Log[L].Group == DelLogGroup)) {
			Log.splice(L, 1);
			break;
		}

	// Sends the new log to the server
	if ((Push == null) || Push)
		ServerPlayerLogSync();

}

// Checks if the log exists, return true if it does (if there's a value, it counts as an expiry time)

/**
 * Searches for an existing log entry.
 * @param {string} NewLogName - The name of the log to search for
 * @param {string} NewLogGroup - The name of the log's group
 * @returns {boolean} - Returns TRUE if there is an existing log matching the Name/Group with no value or a value above the current time in ms.
 */
function LogQuery(QueryLogName, QueryLogGroup) {
	for (let L = 0; L < Log.length; L++)
		if ((Log[L].Name == QueryLogName) && (Log[L].Group == QueryLogGroup))
			if ((Log[L].Value == null) || (Log[L].Value >= CurrentTime))
				return true;
	return false;
}


/**
 * Returns the value associated to a log.
 * @param {string} NewLogName - The name of the log to query the value
 * @param {string} NewLogGroup - The name of the log's group
 * @returns {number | undefined} - Returns the value of the log which is a date represented in ms or undefined. Returns null if no matching log is found.
 */
function LogValue(QueryLogName, QueryLogGroup) {
	for (let L = 0; L < Log.length; L++)
		if ((Log[L].Name == QueryLogName) && (Log[L].Group == QueryLogGroup))
			return Log[L].Value;
	return null;
}

/**
 * Loads the account log.
 * @param {Array.<{Name: string, Group: string, Value: number}>} NewLog - Existing logs received by the server
 * @returns {void} - Nothing
 */
function LogLoad(NewLog) {

	// Make sure we have something to load
	Log = [];
	if (NewLog != null) {

		// Add each log entry one by one, validates the type to prevent client crashes
		for (let L = 0; L < NewLog.length; L++)
			if ((typeof NewLog[L].Name === "string") && (typeof NewLog[L].Group === "string") && ((NewLog[L].Value == null) || (typeof NewLog[L].Value === "number")))
				LogAdd(NewLog[L].Name, NewLog[L].Group, NewLog[L].Value, false);

	}
	
}
