import NotificationsDb = require('../services/NotificationsDbService');
import Notification = require('../models/Notifications/Notification');
import NewNotification = require('../models/Notifications/NewNotification');

module NotificationsMapper {

    export function mapDbNotificationToNotification (dbData : NotificationsDb.INotificationDoc) : Notification {
        return {
            id: dbData._id,
            type: dbData.type,
            message: dbData.message,
            dateCreated: dbData.date_created,
        };
    }

    export function mapNewActivityToDbActivity (newNotification : NewNotification) : NotificationsDb.INotification {
        return {
            user: newNotification.userId,
            type: newNotification.type,
            message: newNotification.message,
            date_created: new Date()
        };
    }
}

export = NotificationsMapper;