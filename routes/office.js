var BufferHelper = require('../app_modules/_utils/bufferhelper.js');
var path = require('path');
var fs = require('fs');
var serverCommunication = require('../app_modules/_utils/communication.js');
var message = require('../app_modules/_utils/messageGenerator.js');
var uuid = require('node-uuid');

var savedOfficeIdMap = {};

function Controller (router){
    router.get('/123', function(req, res, next) {
        res.send('123');
        //res.render('index', { title: 'page office' });
    });

    router.get('/office/:userId/:fileName', function(req, res) {
        var filePath = path.join(__dirname, '../www/temp/', req.params.userId, req.params.fileName);
        fs.stat(filePath, function(err, stats) {
            if (err) {
                res.send();
                return
            }
            if (stats.isFile()) {
                res.sendFile(filePath);
            } else {
                res.send();
            }
        });
    });

    router.get('/office/clearOfficeIdMap', function(req, res) {
        var key = req.query.uuid;
        if (key && key === 'ec'){
            savedOfficeIdMap = [];
            res.send(message.genSimpSuccessMsg('cleared', savedOfficeIdMap));
        } else {
            res.send(message.genSimpFailedMsg('wrong_key_or_no_key', null));
        }
    });
    router.get('/office/getOfficeIdMap', function(req, res) {
        var key = req.query.uuid;
        if (key && key === 'ec'){
            res.send(message.genSimpSuccessMsg('ok', savedOfficeIdMap));
        } else {
            res.send(message.genSimpFailedMsg('wrong_key_or_no_key', null));
        }
    });
    router.get('/office/getSavedFileId', function(req, res) {
        var uuid = req.query.uuid;
        if (savedOfficeIdMap[uuid]){
            var fileId = savedOfficeIdMap[uuid];
            //销毁
            delete savedOfficeIdMap[uuid];
            res.send(message.genSimpSuccessMsg(null, fileId));
        }else {
            res.send(message.genSimpFailedMsg('no_file', null));
        }
    });
    //暂弃用
    router.get('/office/checkIsFile', function(req, res) {
        var filePath = path.join(__dirname, '../www/temp/', req.query.userId + '/' + req.query.uuid);
        fs.stat(filePath, function (err, stats) {
            if (err){
                res.send(message.genSimpFailedMsg('wrong_path', null));
            } else if (stats.isFile()){
                res.send(message.genSimpSuccessMsg(null, true));
            }else {
                res.send(message.genSimpFailedMsg('not_file', null));
            }
        })
    });
    router.put('/office/:userId/:uuid/:fileName', function(req, res, next) {
        var uuid = req.params.uuid;
        var tempPath = '/temp/' + req.params.userId + '/' + uuid;
        var fileDirPath = path.join(__dirname, '../www/temp/', req.params.userId);
        fs.stat(fileDirPath, function(err, stats) {
            if (err) {
                fs.mkdir(fileDirPath, function(err) {
                    saveFile(req, res);
                    console.log(err);
                })
            } else if (stats.isDirectory()) {
                saveFile(req, res);
            }
        });

        function saveFile(req, res) {
            var bufferhelper = new BufferHelper();
            req.on('data', function(chunk) {
                bufferhelper.concat(chunk);
            });
            req.on('end', function() {
                fs.writeFile(path.join(__dirname, '../www', tempPath), bufferhelper.toBuffer(), function(err) {
                    if (err){
                        console.log(err);
                        res.send(err);
                    } else {
                        var path='/index.php/apps/managementsysext/file_api/save_uri_file';
                        var auth = (new Buffer(router.externalConfig.ocAuth)).toString('base64');
                        var fileNameArr = req.params.fileName.split('.');
                        var postData = {
                            uri: 'http://' + router.externalConfig.localHost[router.externalConfig.runMode] + tempPath,
                            fileName: req.params.fileName,
                            fileType: fileNameArr[fileNameArr.length-1],
                            userId: req.params.userId
                        };
                        serverCommunication.OCServer(postData, 'post', path,auth, null, "application/json", function (data) {
                            console.log(data);
                            data = JSON.parse(data);
                            if (data.id){
                                savedOfficeIdMap[uuid] = data.id;
                                res.send(message.genSimpSuccessMsg('success', data));
                            }
                        });
                    }
                })
            });
        }
    });

    router.put('/sys_office/:userId/:fileName', function(req, res, next) {
        var tempPath = '/temp/' +　uuid.v1();
        var fileDirPath = path.join(__dirname, '../www/temp/');
        console.log(fileDirPath);
        fs.stat(fileDirPath, function(err, stats) {
            if (err) {
                fs.mkdir(fileDirPath, function(err) {
                    saveFile(req, res);
                    console.log(err);
                })
            } else if (stats.isDirectory()) {
                saveFile(req, res);
            }
        });

        function saveFile(req, res) {
            var bufferhelper = new BufferHelper();
            req.on('data', function(chunk) {
                bufferhelper.concat(chunk);
            });
            req.on('end', function() {
                fs.writeFile(path.join(__dirname, '../www' + tempPath), bufferhelper.toBuffer(), function(err) {
                    if (err){
                        console.log(err);
                        res.send(err);
                    } else {
                        var path='/index.php/apps/managementsysext/file_api/save_uri_file';
                        var auth = (new Buffer(router.externalConfig.ocAuth)).toString('base64');
                        var fileNameArr = req.params.fileName.split('.');
                        var postData = {
                            uri: 'http://' + router.externalConfig.localHost[router.externalConfig.runMode] + tempPath,
                            fileName: req.params.fileName,
                            fileType: fileNameArr[fileNameArr.length-1],
                            userId: req.params.userId,
                            isToSys: true
                        };
                        serverCommunication.OCServer(postData, 'post', path,auth, null, "application/json", function (data) {
                            console.log(data);
                            res.send(message.genSimpSuccessMsg('success', data));
                        });
                    }
                })
            });
        }
    });

    router.post('/office/:userId/:fileName', function(req, res, next) {
        var fileDirPath = path.join(__dirname, '../www/temp/', req.params.userId);
        fs.stat(fileDirPath, function(err, stats) {
            if (err) {
                fs.mkdir(fileDirPath, function(err) {
                    saveFile(req, res);
                    console.log(err);
                })
            } else if (stats.isDirectory()) {
                saveFile(req, res);
            }
        });

        function saveFile(req, res) {
            var writerStream = fs.createWriteStream(path.join(__dirname, '../www/temp/', req.params.userId, req.params.fileName));
            req.on('data', function(chunk) {
                writerStream.write(chunk, function() {

                });
            });
            req.on('end', function() {
                writerStream.end(function() {
                    console.log('end');
                });

                writerStream.on('finish', function() {
                    console.log("写入完成。");
                    res.send();
                });

                writerStream.on('error', function(err){
                    console.log(err.stack);
                    res.send(err);
                });
            });
        }
    });
}


module.exports = Controller;
