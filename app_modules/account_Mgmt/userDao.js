/**
 * Created by xh on 7/28/2015.
 */
var dbManager = require('../../app_db/dataSource.js');

// disi todo
//var db = dbManager.getDB();
//var usersCollection = db.collection('users');

exports.add = function (user, next) {
    var db = dbManager.getDB();
    db.collection('users').insert({
        id: user.id,
        username: user.username,
        password: user.password,
    }, function (err, result) {
        if (err) {
            throw err;
        } else {
            next(result);
        }
    })
};
exports.isExist = function (username, password, next) {
    var db = dbManager.getDB();
    db.collection('users').findOne({'username': username, 'password': password}, function (err, resDoc) {
        if (err) {
            throw err;
        } else {
            next(resDoc);
        }
    });
};
exports.findById = function (id, next) {
    var db = dbManager.getDB();
    db.collection('users').find({'id': id}).toArray(function (err, resDoc) {
        if (err) {
            throw err;
        } else {
            next(resDoc[0]);
        }
    });
};
exports.findAll = function (next) {
    var db = dbManager.getDB();
    db.collection('users').find().toArray(next);
};
exports.findByName = function (name, next) {
    var db = dbManager.getDB();
    db.collection('users').find({'name': name}).toArray(function (err, resDoc) {
        if (err) {
            throw err;
        } else {
            next(resDoc);
        }
    });
};
exports.updatePwdById = function (id, password, next) {
    db.collection('users').update({'id': id}
        , {
            $set: {
                'password': password
            }
        }, function (err, resDoc) {
            if (err) {
                throw err;
            } else {
                next(resDoc);
            }
        });
};
exports.removeById = function (id, next) {
    var db = dbManager.getDB();
    db.collection('users').remove({'id': id}, function (err, resDoc) {
        if (err) {
            throw err;
        } else {
            next(resDoc);
        }
    });
};