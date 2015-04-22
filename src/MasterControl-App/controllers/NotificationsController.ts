import NotificationsDb = require('../services/NotificationsDbService');
import NotificationsMapper = require('../mappers/NotificationsMapper');
import Notification = require('../models/Notifications/Notification');
import NewNotification = require('../models/Notifications/NewNotification');

module NotificationsController {

    export module New {

        export var PATH = 'notifications/new';

        export interface Data extends NewNotification {
        }

        export function handler (data : Data) : Promise<string> {
            return NotificationsDb.createNotification(NotificationsMapper.mapNewActivityToDbActivity(data))
                .then((data) => data._id);
        }
    }

    export module Get {

        export var PATH = 'notifications/get';

        export interface Data {
            userId : string
            maxResults? : number
        }

        export interface Return {
            notifications : Notification[]
        }

        export function handler (data : Data) : Promise<Return> {
            return NotificationsDb.getNotificationsByUser(data.userId, data.maxResults)
                .then((notifications) => notifications.map((notification) => NotificationsMapper.mapDbNotificationToNotification(notification)))
                .then((notifications) => {
                    return { notifications: notifications };
                });
        }
    }
}

export = NotificationsController;