var config = require('../../config.json');
var objLogManager = require('../../node_modeles_ext/LoggerForNodeJs/myLogManager/LogManager.js').ObjLogManager;
var message = require('./messageGenerator.js');

var checkSession = function (req, res, next) {
    if (config.runMode === 'dev'){
        req.session.userData={
            id: 'user14id',/*PKCH5L9U*/
            name:'user14',
            role:['admin','teacher', 'student']
        };
    }
    if (req.session.userData){
        //console.log('【' + req.session.userData.name + '】session登入成功-跳转');
        objLogManager.WriteLogInfoInfo('【' + req.session.userData.name + '】session登入成功-跳转');
        next();
    } else {
        objLogManager.WriteLogErrorInfo({msg:'no_session_goto_login', originalUrl: req.originalUrl, address: req._remoteAddress});
        var url = 'http://' + config.localHost[config.runMode] + req.originalUrl;
        res.redirect('http://' + config.loginHost[config.runMode] + '/#redirect_url=' + escape(url));
    }
};

var checkSession2 = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    if (config.runMode === 'dev'){
        req.session.userData={
            id: 'user14id',/*PKCH5L9U*/
            name:'user14',
            role:['admin','teacher', 'student']
        };
    }
    if (req.session.userData){
        //console.log('?' + req.session.userData.name + '?session????');
        objLogManager.WriteLogInfoInfo('【' + req.session.userData.name + '】session登入成功');
        next();
    } else {
        objLogManager.WriteLogErrorInfo({msg:'no_session', originalUrl: req.originalUrl, address: req._remoteAddress});
        res.send(message.genSimpFailedMsg('no_session', null));
    }
};

exports.checkSession = checkSession;
exports.checkSession2 = checkSession2;