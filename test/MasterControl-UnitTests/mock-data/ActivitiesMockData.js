var UsersMockData = require('./UsersMockData');
var data = {};

data.dbComment = {
    _id: '34523',
    user: UsersMockData.dbUser,
    message: 'message',
    date_created: new Date(0)
};

data.dbActivity = {
    _id: '3453',
    user: UsersMockData.dbUser,
    type: 0,
    message: 'message',
    date_created: new Date(0),
    likes: 7,
    comments: [
        data.dbComment,
        data.dbComment,
        data.dbComment
    ]
};

module.exports = data;