/**
 * learningResController.js
 * @type {exports|module.exports}
 */
var net = require('net');
//var logService = require('./logService.js');

exports.searchLogs = function(req, res, LogClient){
    var client = new net.Socket();
    client.setEncoding('utf8');
    client.connect(3600, 'localhost', function(){
        console.log('日志服务已连接。');
        //client.write(JSON.stringify(msg));
    });
    /*
     client.on('data', function(msg){
     console.log('已接受日志服务器的数据：' + msg);
     });
     */
    client.on('error', function(e){
        console.log(e);
        client.destroy();
    });

    //跨域
    /*
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    */

    var query = {}, receiveLogs = '';
    var userId = req.query.userId;
    if(userId && userId.trim() != ''){
        query.userId = userId;
    }
    var courseId = req.query.courseId;
    if(courseId && courseId.trim() != ''){
        query.courseId = courseId;
    }

    client.write(JSON.stringify({logType:'getFromEngine', query: query, sort: {'createTime':-1}}));

    client.on('data', function(Logs){
        receiveLogs += Logs;
    });

   setTimeout(function(){
       res.send(receiveLogs);
   },1000);

    client.on('end', function(){
        //console.log(JSON.parse(receiveLogs));
        //res.send(receiveLogs);
    });

};

