"use strict";
var Notifications = {};

/**
 * Increase the reported number of a notifications by one and updates the header
 * @param {string} Type - The type of notification
 * @returns {void}
 */
function NotificationsIncrement(Type) {
	Notifications[Type] = (Notifications[Type] || 0) + 1;
	NotificationsUpdate();
}

/**
 * Sets the number of notifications for a type back to zero and updates the header
 * @param {any} Type - The type of notification
 * @returns {void}
 */
function NotificationsReset(Type) {
	if (Notifications[Type] != null && Notifications[Type] != 0) {
		Notifications[Type] = 0;
		NotificationsUpdate();
	}
}

/**
 * Sets the number of notifications to zero
 * @returns {void}
 */
function NotificationsResetAll() {
	Notifications = {};
	NotificationsUpdate();
}

/**
 * Sets or clears notifications in the tab header
 * @returns {void} - Nothing
 */
function NotificationsUpdate() {
	let total = 0;
	for (let key in Notifications) total += Notifications[key];
	let prefix = total == 0 ? "" : "(" + total.toString() + ") ";
	document.title = prefix + "Bondage Club";
}

/**
 * Increase the number of unread messages in the notifications
 * @returns {void} - Nothing
 */
function NotificationsChatRoomIncrement() {
	if (!NotificationsChatRoomNewMessageVisible()) {
		ChatRoomUnreadMessages = true;
		NotificationsIncrement("Chat");
	}
}

/**
 * Remove the notifications if there are new messages that have been seen
 * @returns {void} - Nothing
 */
function NotificationsChatRoomCheck() {
	if (ChatRoomUnreadMessages && NotificationsChatRoomNewMessageVisible()) {
		ChatRoomUnreadMessages = false;
		NotificationsReset("Chat");
	}
}

/**
 * Returns whether the most recent chat message is on screen
 * @returns {boolean} - TRUE if the screen has focus and the chat log is scrolled to the bottom
 */
function NotificationsChatRoomNewMessageVisible() {
	if (!document.hasFocus()) return false;
	else return ElementIsScrolledToEnd("TextAreaChatLog");
}
