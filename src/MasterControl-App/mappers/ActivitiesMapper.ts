import ActivitiesDb = require('../services/ActivitiesDbService');
import UsersMapper = require('./UsersMapper');
import Activity = require('../models/Activities/Activity');
import NewActivity = require('../models/Activities/NewActivity');
import ActivityComment = require('../models/Activities/Comment');
import NewComment = require('../models/Activities/NewComment');

module ActivitiesMapper {

    export function mapDbActivityToActivity (dbData : ActivitiesDb.IActivityDoc) : Activity {
        return {
            id: dbData._id.toString(),
            user: UsersMapper.mapDbUserToUser(dbData.user),
            type: dbData.type,
            message: dbData.message,
            dateCreated: dbData.date_created,
            likes: dbData.likes.length,
            comments: dbData.comments.map((comment) => ActivitiesMapper.mapDbCommentToComment(comment))
        };
    }

    export function mapNewActivityToDbActivity (newActivity : NewActivity) : ActivitiesDb.IActivity {
        return {
            user: newActivity.userId,
            type: newActivity.type,
            message: newActivity.message,
            date_created: new Date(),
            likes: [],
            comments: []
        };
    }

    export function mapDbCommentToComment (dbData : ActivitiesDb.ICommentDoc) : ActivityComment {
        return {
            id: dbData._id.toString(),
            user: UsersMapper.mapDbUserToUser(dbData.user),
            message: dbData.message,
            dateCreated: dbData.date_created
        };
    }

    export function mapNewCommentToDbComment (newComment : NewComment) : ActivitiesDb.IComment {
        return {
            user: newComment.userId,
            message: newComment.message,
            date_created: new Date()
        };
    }
}

export = ActivitiesMapper;