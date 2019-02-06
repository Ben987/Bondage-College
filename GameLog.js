var GameLog = [];
var GameLogChapter = 0;
var GameLogActor = 1;
var GameLogEvent = 2;
var GameLogTimer = 3;

// Log a specific event that happened in the game to be consulted by other scripts afterward
function GameLogSpecificAdd(ChapterToLog, ActorToLog, EventToLog) {

	// If no actor is specified, we imply the player
	if (ActorToLog == "") ActorToLog = "Player";

	// Do not log the same event twice
	for (var L = 0; L < GameLog.length; L++)
		if ((ChapterToLog == GameLog[L][GameLogChapter]) && (ActorToLog == GameLog[L][GameLogActor]) && (EventToLog == GameLog[L][GameLogEvent]))
			return;
		
	// Log the event
	GameLog[GameLog.length] = [ChapterToLog, ActorToLog, EventToLog, 0];

}

// Log a specific event that happened in the game with a timer to be used in the game later
function GameLogSpecificAddTimer(ChapterToLog, ActorToLog, EventToLog, TimerToLog) {

	// If no actor is specified, we imply the player
	if (ActorToLog == "") ActorToLog = "Player";

	// Do not log the same event twice, replace the timer
	for (var L = 0; L < GameLog.length; L++)
		if ((ChapterToLog == GameLog[L][GameLogChapter]) && (ActorToLog == GameLog[L][GameLogActor]) && (EventToLog == GameLog[L][GameLogEvent])) {
			GameLog[L] = [ChapterToLog, ActorToLog, EventToLog, TimerToLog];
			return;
		}

	// Log the event with it's timer
	GameLog[GameLog.length] = [ChapterToLog, ActorToLog, EventToLog, TimerToLog];

}

// Flush a specific event from the log
function GameLogSpecificDelete(ChapterToDelete, ActorToDelete, EventToDelete) {
	for (var L = 0; L < GameLog.length; L++)
		if ((ChapterToDelete == GameLog[L][GameLogChapter]) && (ActorToDelete == GameLog[L][GameLogActor]) && (EventToDelete == GameLog[L][GameLogEvent]))
			GameLog.splice(L, 1);
}

// Log a specific event for the current chapter and actor, to be consulted by other scripts afterward
function GameLogAdd(EventToLog) {
	GameLogSpecificAdd(CurrentChapter, CurrentActor, EventToLog);
}

// Log a specific event that happened in the game with a timer to be used in the game later (negative timer means we flush the log)
function GameLogAddTimer(EventToLog, TimerToLog) {
	if (TimerToLog >= 0)
		GameLogSpecificAddTimer(CurrentChapter, CurrentActor, EventToLog, TimerToLog);
	else
		GameLogSpecificDelete(CurrentChapter, CurrentActor, EventToLog);
}

// Returns TRUE if the event happened based on the query parameters, none of them are mandatory, the timer must be still valid at game time, it acts an expiry date
function GameLogQuery(ChapterToQuery, ActorToQuery, EventToQuery) {

	// Scan the log based on the query parameters, returns TRUE if all parameters are a match
	for (var L = 0; L < GameLog.length; L++)
		if ((ChapterToQuery == "") || (ChapterToQuery == GameLog[L][GameLogChapter]))
			if ((ActorToQuery == "") || (ActorToQuery == GameLog[L][GameLogActor]))
				if ((EventToQuery == "") || (EventToQuery == GameLog[L][GameLogEvent]))
					if ((GameLog[L][GameLogTimer] == 0) || (CurrentTime < GameLog[L][GameLogTimer]))
						return true;

	// Since the queried event wasn't found, we return FALSE
	return false;

}
