import ActivitiesDb = require('../services/ActivitiesDbService');
import ActivitiesMapper = require('../mappers/ActivitiesMapper');
import UsersDb = require('../services/UsersDbService');
import UsersMapper = require('../mappers/UsersMapper');

import Activity = require('../models/Activities/Activity');
import NewActivity = require('../models/Activities/NewActivity');
import NewComment = require('../models/Activities/NewComment');

module ActivitiesController {

    export module New {

        export var PATH = 'activity/new';

        export interface Data extends NewActivity {
        }

        export function handler (data : Data) : Promise<string> {
            return ActivitiesDb.createActivity(ActivitiesMapper.mapNewActivityToDbActivity(data))
                .then((data) => data._id);
        }
    }

    export module Feed {

        export var PATH = 'activity/feed';

        export interface Data {
            userId : string
            maxResults? : number
        }

        export interface Return { activities : Activity[]
        }

        export function handler (data : Data) : Promise<Return> {
            return UsersDb.getUserById(data.userId)
                .then((user) => UsersMapper.mapDbUserToUser(user))
                .then((user) => ActivitiesDb.getActivitiesByUser(user.friendIds, data.maxResults))
                .then((activities) => activities.map((activity) => ActivitiesMapper.mapDbActivityToActivity(activity)))
                .then((activities) => {
                    return { activities: activities };
                })
        }
    }

    export module Like {

        export var PATH = 'activity/like';

        export interface Data {
            activityId : string
            userId : string
        }

        export function handler (data : Data) : Promise<void> {
            return ActivitiesDb.addLike(data.activityId, data.userId);
        }
    }

    export module Unlike {

        export var PATH = 'activity/unlike';

        export interface Data {
            activityId : string
            userId : string
        }

        export function handler (data : Data) : Promise<void> {
            return ActivitiesDb.removeLike(data.activityId, data.userId);
        }
    }

    export module Comment {

        export var PATH = 'activity/comment';

        export interface Data {
            activityId : string
            comment: NewComment
        }

        export function handler (data : Data) : Promise<void> {
            return ActivitiesDb.addComment(data.activityId, ActivitiesMapper.mapNewCommentToDbComment(data.comment));
        }
    }
}

export = ActivitiesController;