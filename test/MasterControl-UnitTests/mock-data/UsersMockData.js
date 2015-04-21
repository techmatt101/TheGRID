var clone = require("clone");
var data = {};

data.dbUser = {
    _id: '34jhb234',
    username: 'name',
    full_name: 'full_name',
    email: 'email',
    date_created: new Date(0),
    developer: false,
    friends: ['42342', '753432']
};

data.dbUserWithPassword = clone(data.dbUser);
data.dbUserWithPassword.password = '$2a$10$wuAk6AT.xmzq2Cx9TCH1B.n59niOoLKNSSQqh0ZBzYP7qpvZ9AU8S';

data.mappedUser = {
    id: '34jhb234',
    username: 'name',
    fullName: 'full_name',
    email: 'email',
    password: null,
    developer: false,
    dateCreated: new Date(0),
    friendIds: ['42342', '753432']
};

module.exports = data;