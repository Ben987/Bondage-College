"use strict";

/**
 * An enum for the events in the game that notifications can be raised for
 * @enum {string}
 */
const NotificationEventType = {
	CHATMESSAGE: "ChatMessage",
	CHATJOIN: "ChatJoin",
	BEEP: "Beep",
	DISCONNECT: "Disconnect",
	TEST: "Test",
	LARP: "Larp",
};

/**
 * An enum for the types of notifications that can be raised
 * @enum {number}
 */
const NotificationAlertType = {
	NONE: 0,
	TITLEPREFIX: 1,
	POPUP: 2,
};

/**
 * An enum for the audio settings for notifications
 * @enum {number}
 */
const NotificationAudioType = {
	NONE: 0,
	FIRST: 1,
	REPEAT: 2,
};

/**
 * An object defining the components of the player's settings for a particular notification event
 * @typedef {object} NotificationSetting
 * @property {NotificationAlertType} AlertType - The selected type of notification alert to use
 * @property {NotificationAudioType} Audio - The selected audio setting to apply
 */

/**
 * A class to track the state of each notification event type and handle actions based on the player's settings
 */
class NotificationEventHandler {
	/**
	 * Creates a new NotificationEventHandler for the specified event type
	 * @param {NotificationEventType} eventType - The
	 * @param {NotificationSetting} settings - The player settings corresponding to the event type
	 */
	constructor(eventType, settings) {
		this.eventType = eventType;
		this.settings = settings;
		this.raisedCount = 0;
		this.popup = null;
	}

	/**
	 * Raise a notification
	 * @param {object} data - Data relating to the event that can be passed into a popup
	 * @returns {void} - Nothing
	 */
	raise(data) {
		if (this.settings.AlertType !== NotificationAlertType.NONE) {
			this.raisedCount++;
			if (this.settings.AlertType === NotificationAlertType.POPUP) {
				if (NotificationPopupsEnabled(this.eventType, data)) {
					this.raisePopup(data);
				} else {
					NotificationTitleUpdate();
				}
			}
			else if (this.settings.AlertType === NotificationAlertType.TITLEPREFIX) {
				NotificationTitleUpdate();
			}
			if (this.playAudio(false)) {
				AudioPlayInstantSound("Audio/BeepAlarm.mp3");
			}
		}
	}

	/**
	 * Raise a popup notification
	 * @param {any} data - Data relating to the event passed into the popup
	 * @returns {void} - Nothing
	 */
	raisePopup(data) {
		// Determine the popup's options based on the data passed into the event raise call
		let icon = "Icons/Logo.png";
		let titleStart = "";
		let titleEnd = "";
		let C = data.character;
		if (!C && data.memberNumber) C = Character.find(C => C.MemberNumber === data.memberNumber);
		if (C && 'icon' in Notification.prototype) icon = DrawCharacterSegment(C, 168, 50, 164, 164).toDataURL("image/png");
		if (data.characterName) titleStart = data.characterName + " - ";
		else if (C) titleStart = C.Name + " - ";
		if (data.chatRoomName) titleEnd = DialogFindPlayer("NotificationTitleFromRoom").replace("ChatRoomName", "'" + data.chatRoomName + "'");
			
		// Define the (supported) options of the popup and create it
		let title = titleStart + DialogFindPlayer("NotificationTitle" + this.eventType) + titleEnd;
		let options = {};
		if ('silent' in Notification.prototype) options.silent = !this.playAudio(true);
		if ('body' in Notification.prototype && data.body) options.body = data.body;
		if ('renotify' in Notification.prototype) options.renotify = true;
		if ('tag' in Notification.prototype) options.tag = "BondageClub" + this.eventType;
		if ('icon' in Notification.prototype) options.icon = icon;
		if ('data' in Notification.prototype) options.data = this.eventType;

		// Create the notification
		this.popup = new Notification(title, options);
		if ('onclick' in Notification.prototype) {
			this.popup.onclick = function () {
				if ('data' in Notification.prototype) NotificationReset(this.data);
				window.focus();
				this.close();
			};
		}
	}

	/**
	 * Determines whether an audio alert shoud be played
	 * @param {boolean} usingPopup - If TRUE this indicates that the audio will be played by a popup, rather than an in-game alert
	 * @returns {boolean} - Whether audio should be played
	 */
	playAudio(usingPopup) {
		if (this.settings.Audio === NotificationAudioType.NONE) {
			return false;
		} else if (this.eventType === NotificationEventType.BEEP && Player.AudioSettings.PlayBeeps) {
			return false; // Sound already played in ServerAccountBeep()
		} else if (this.settings.AlertType === NotificationAlertType.POPUP && !usingPopup && 'silent' in Notification.prototype) {
			return false; // The popup will play the sound instead
		} else if (this.settings.Audio === NotificationAudioType.FIRST && this.raisedCount === 1) {
			return true;
		} else if (this.settings.Audio === NotificationAudioType.REPEAT) {
			return true;
		}
	}

	/**
	 * Resets all raised notification for this event
	 * @param {any} updateTitle - If TRUE, the document title should be refreshed to display the new notification count
	 * @returns {void} - Nothing
	 */
	reset(updateTitle) {
		if (this.raisedCount > 0) {
			this.raisedCount = 0;
			if (updateTitle) NotificationTitleUpdate();
			if (this.popup) this.popup.close();
		}
	}
}

let NotificationEventHandlers;
var NotificationAlertTypeList = [];
var NotificationAudioTypeList = [];

/** 
 * Initialise notification variables on startup
 * @returns {void} - Nothing
 */
function NotificationLoad() {
	// Create the list of event handlers
	NotificationEventHandlers = {};
	NotificationEventHandlerSetup(NotificationEventType.CHATMESSAGE, Player.NotificationSettings.ChatMessage);
	NotificationEventHandlerSetup(NotificationEventType.CHATJOIN, Player.NotificationSettings.ChatJoin);
	NotificationEventHandlerSetup(NotificationEventType.BEEP, Player.NotificationSettings.Beeps);
	NotificationEventHandlerSetup(NotificationEventType.DISCONNECT, Player.NotificationSettings.Disconnect);
	NotificationEventHandlerSetup(NotificationEventType.TEST, Player.NotificationSettings.Test);
	NotificationEventHandlerSetup(NotificationEventType.LARP, Player.NotificationSettings.Larp);

	// Create the alert and audio type lists for the Preferences screen
	NotificationAlertTypeList.push(NotificationAlertType.NONE);
	NotificationAlertTypeList.push(NotificationAlertType.TITLEPREFIX);
	if ("Notification" in window) NotificationAlertTypeList.push(NotificationAlertType.POPUP);
	NotificationAudioTypeList = Object.values(NotificationAudioType);
}

/**
 * Create a handler instance to track and handle notifications of that event type
 * @param {NotificationEventType} eventType
 * @param {NotificationSetting} setting
 */
function NotificationEventHandlerSetup(eventType, setting) {
	NotificationEventHandlers[eventType] = new NotificationEventHandler(eventType, setting);
}

/**
 * Create a new notification
 * @param {NotificationEventType} eventType - The type of event that occurred
 * @param {object} [data={}] - Data relating to the event that can be passed into a popup
 * @returns {void} - Nothing
 */
function NotificationRaise(eventType, data = {}) {
	if (NotificationEventHandlers) {
		NotificationEventHandlers[eventType].raise(data);
	}
}

/**
 * Clear all raised notifications of the specified type
 * @param {NotificationEventType} eventType - The type of event to be cleared
 * @returns {void} - Nothing
 */
function NotificationReset(eventType) {
	if (NotificationEventHandlers) {
		NotificationEventHandlers[eventType].reset(true);
	}
}

/**
 * Clear all raised notifications
 * @returns {void} - Nothing
 */
function NotificationResetAll() {
	Object.values(NotificationEventHandlers).forEach(N => N.reset(false));
	NotificationTitleUpdate();
}

/** 
 * Returns whether popup notifications are permitted
 * @param {NotificationEventType} eventType - The type of event that occurred
 * @param {object} [data={}] - Data relating to the event that can be passed into a popup
 * @returns {boolean} - Whether popups can appear
 */
function NotificationPopupsEnabled(eventType, data) {
	if (!("Notification" in window)) {
		return false;
	} else if (Notification.permission === "granted") {
		return true;
	} else if (Notification.permission === 'denied') {
		return false;
	} else if (Notification.permission === 'default') {
		Notification.requestPermission().then(() => {
			if (Notification.permission === "granted") {
				NotificationRaise(eventType, data);
			}
		});
		return false;
	} else {
		return false;
	}
}

/**
 * Sets or clears the notification number in the document header
 * @returns {void} - Nothing
 */
function NotificationTitleUpdate() {
	const totalRaisedCount = Object.values(NotificationEventHandlers).reduce((a, b) => a + b.raisedCount, 0);
	const titlePrefix = totalRaisedCount === 0 ? "" : "(" + totalRaisedCount.toString() + ") ";
	document.title = titlePrefix + "Bondage Club";
}
