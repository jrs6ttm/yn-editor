/**
 * Created by xh on 7/28/2015.
 */
var uuId = require('../_utils/uuidGenerator.js');
var userDao = require('./userDao.js');
var message = require('../_utils/messageGenerator.js');
var serverCommunication = require('../_utils/communication.js');

exports.addUser = function (user, next) {
    var user = {
        id: uuId.generateId(8, 32),
        username: user.username,
        password: user.password,
    };
    userDao.add(user, function (resDoc) {
        if (resDoc) {
            next(message.genSimpSuccessMsg('add success', null));
        } else {
            next(message.genSimpFailedMsg('add failed', null));
        }
    });
};

exports.isExist = function (username, password,sessionId,sysCookieId, server, next) {
    //userDao.isExist(username, password, function (data) {
    //    if (data) {
    //        next(message.genSimpSuccessMsg('exist', data));
    //    } else {
    //        next(message.genSimpFailedMsg('not exist', null));
    //    }
    //});
    var path = '/user/login?username='+username+'&password='+password + '&sessionId='+sessionId + '&sysCookieId='+sysCookieId+'&server=' + server;
    serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
        //console.log(resData);
        if (data.success){
            var userData = {
                id : data.data.id2,
                username : data.data.username,
                password : data.data.password,
            };
            next(message.genSimpSuccessMsg('exist', userData));
        } else {
            next(message.genSimpFailedMsg('not exist', null));
        }
    });
};
exports.loadAllUsers = function (auth, next) {
    //userDao.findAll(function (err, allUsersRaw) {
    //    if(err){
    //        next(message.genSimpFailedMsg('loadAllUsers', null));
    //    }else{
    //        var allUsers = [];
    //        for(var i = 0; i < allUsersRaw.length; i++){
    //            allUsers.push({
    //                name:allUsersRaw[i].name.firstName + ' ' + allUsersRaw[i].name.lastName,
    //                id:allUsersRaw[i].id
    //            });
    //        }
    //        next(message.genSimpSuccessMsg(null, allUsers));
    //
    //    }
    //});
    var path = '/user/getAllUsers?auth='+auth;
    serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
        var item = [],result = [];
        if(data){
            for(var i = 0; i < data.length; i++){
                if(data[i].id){
                    item[i] = {
                        id : data[i].id2,
                        username : data[i].username,
                        password : data[i].psw,
                    };
                    result.push(item[i]);
                }
            }
            next(message.genSimpSuccessMsg('load success', result));
        }else{
            next(message.genSimpFailedMsg('no users', null));
        }
    });
};





