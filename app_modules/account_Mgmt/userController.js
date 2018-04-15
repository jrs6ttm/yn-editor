/**
 * Created by xh on 7/28/2015.
 */
var userService = require('./userService');
var message = require('../_utils/messageGenerator.js');
var uuid = require('node-uuid');
var config = require('../../config.json');

var api = [];
exports.addUser = function (user, req, res) {
    //console.log(user);
    userService.addUser(user, function (data) {
    });

};

exports.loadAllUsers = function (req, res) {
    var auth = req.session.auth;
    userService.loadAllUsers(auth, function(msg){
        res.send(msg);
    });
};

exports.handleAutoLogin = function (req, res) {
    var userInfo = {
        "id" : req.query.id,
        "username" : null,
        "password" : null,
    };
    req.session.userData = userInfo;
    var userApi = {};
    userApi.apiKey = uuid.v1();
    userApi.userData = req.session.userData;
    api.push(userApi);
    req.session.userData.apiKey = userApi.apiKey;
    delete req.session.userData.password;
};

exports.isExist = function (req, res, server) {
    var username = req.body.username;
    var password = req.body.password;
    var sessionId=req.session.id;
    var sysCookieId = uuid.v1();
    var design_selection = 'process_design';
    var roomNum = req.body.roomNum;
    var me = this;
    userService.isExist(username, password, sessionId, sysCookieId,server, function (message) {
        //console.log(data);
        if (message.success) {
            //保存session
            req.session.userData = message.data;
            req.session.auth = (new Buffer(username+':'+ password)).toString('base64');
            req.session.sysCookieId = sysCookieId;

            var userApi = {};
            userApi.apiKey = uuid.v1();
            userApi.userData = req.session.userData;
            api.push(userApi);
            req.session.userData.apiKey = userApi.apiKey;
            delete req.session.userData.password;
            if(design_selection === 'task_design&ch=' && roomNum )
               design_selection = 'task_design&ch='+ req.param('roomNum');
            //res.redirect('/?ui=process_design');
            var hosts = JSON.stringify(config.shareCookieHost[config.runMode]);
            res.redirect('/doSetSysCookie?hosts='+hosts+'&target='+'http://'+ config.localHost[config.runMode] +'/?ui='+design_selection);
            //res.redirect('/?ui='+design_selection);
        } else {
            res.redirect('/login');
        }
    });
};
exports.getUserApi = function () {
    return api;
};
exports.removeUserApi = function (req) {
    var apiKey = req.param('apiKey');
    console.log(apiKey);
    var index = -1;
    for (var i = 0; i < api.length; i++) {
        if (api[i].apiKey === apiKey) {
            index = i;
            break;
        }
    }
    for (var j = index; j < api.length - 1; j++) {
        api[j] = api[j + 1];
    }
    api.pop();
};