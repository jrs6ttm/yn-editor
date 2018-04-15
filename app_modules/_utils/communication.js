/**
 * Created by xh on 7/16/2015.
 */
var http = require('http');
var fs = require('fs');
http.post = require('http-post');
var config = require('../../config.json');
var request = require('request');

exports.communication = function (req, res,path) {
    var reqBodyStr, headers, options, internalReq, queryId;

    queryId = (Date.now() - 1300000000000).toString(32) + Math.random().toString(32).slice(4);
    req.body.queryId = queryId;
    reqBodyStr = JSON.stringify(req.body);


    headers = {

        'Content-Type': 'application/json'
        //disi todo research the meaning of the length
        //'Content-Length': reqBodyStr.length
    };

    options = {
        host: 'localhost',
        port: 5000,
        path: path,
        method: 'POST',
        headers: headers
    };

    internalReq = http.request(options, function (newRes) {
        newRes.setEncoding('utf-8');

        var responseString = '';

        newRes.on('data', function (data) {
            responseString += data;
        });

        newRes.on('end', function () {
            try {
                var resultObject = JSON.parse(responseString);
                console.log(resultObject);
                res.send(resultObject);
            }catch (e){
                res.send('error');
            }

        });
    });
    internalReq.on('error', function (e) {

    });
    internalReq.write(reqBodyStr);
    internalReq.end();

};

//exports.user3 = function () {
//    http.get("http://192.168.1.40:3500/user/login?fiql=username==11;psw==17BA0791499DB908433B80F37C5FBC89B870084B&sessionId=FAC_mLmjkQh9UkdtOSEHzeFbTuogT7-X&server=192.168.1.40:4000", function(res1) {
//        console.log("Got response: " + res1.statusCode);
//        res=res1.slice(0);
//    }).on('error', function(e) {
//        console.log("Got error: " + e.message);
//    });
//}
exports.syncope = function (postData, method, path, reqType, resType, next) {
    var reqBodyStr, headers, options, internalReq;
    //准备post的数据
    reqBodyStr = JSON.stringify(postData);

    headers = {
        "Content-Type":(reqType) ? reqType : 'application/json;charset=utf-8',
        "Accept": (resType) ? resType : "application/json"
    };
    options = {
        host: (config.UMBHost[config.runMode].split(":"))[0],
        port: (config.UMBHost[config.runMode].split(":"))[1],
        path: path,
        method: (method) ? method : 'get',
        headers: headers
    };

    internalReq = http.request(options, function (newRes) {
        newRes.setEncoding('utf-8');
        var responseString = '';
        newRes.on('data', function (data) {
            responseString += data;
        });
        newRes.on('end', function () {
            try {
                //console.log(responseString);
                //res.setHeader("Content-Type", (resType) ? resType : "application/json");
                //res.send(responseString);
                if (next){
                    next(JSON.parse(responseString));
                }
            }catch (e){
                //res.send('error');
                next('error');
            }

        });
    });
    internalReq.on('error', function (e) {
        console.log('e');
        console.log(e);
    });
    if (method==='post'){
        internalReq.write(reqBodyStr);
    }
    internalReq.end();
};
exports.VMServer = function (postData, path, next) {
    var headers, options, internalReq;
    options = {
        host: (config.VMTypeHost[config.runMode].split(":"))[0],
        port: (config.VMTypeHost[config.runMode].split(":"))[1],
        path: path
    };

    internalReq = http.post(options, postData, function (newRes) {
        newRes.setEncoding('utf-8');
        var responseString = '';
        newRes.on('data', function (data) {
            responseString += data;
        });
        newRes.on('end', function () {
            try {
                if (next){
                    next(JSON.parse(responseString));
                }
            }catch (e){
                next('error');
            }

        });
    });
    internalReq.on('error', function (e) {
        console.log('e');
        console.log(e);
    });
    internalReq.end();
};
exports.OCServer = function (postData, method, path, auth, reqType, resType, next) {
    var reqBodyStr, headers, options, internalReq;
    //准备post的数据
    reqBodyStr = JSON.stringify(postData);
    headers = {
        "Content-Type":(reqType) ? reqType : 'application/json;charset=utf-8',
        "Accept": (resType) ? resType : "application/json",
        "Authorization":"Basic " + auth
    };
    options = {
        host: config.ocFileHost[config.runMode].split(':')[0],
        port: config.ocFileHost[config.runMode].split(':')[1],
        path: path,
        method: (method) ? method : 'get',
        headers: headers
    };

    internalReq = http.request(options, function (newRes) {
        newRes.setEncoding('utf-8');
        var responseString = '';
        newRes.on('data', function (data) {
            responseString += data;
        });
        newRes.on('end', function () {
            try {
                if (next){
                    next(responseString);
                }
            }catch (e){
                next('error');
            }

        });
    });
    internalReq.on('error', function (e) {
        console.log('e');
        console.log(e);
    });
    if (method==='post'){
        internalReq.write(reqBodyStr);
    }
    internalReq.end();
};
exports.OrgServer = function (postData, method, path, auth, reqType, resType, next) {
    var reqBodyStr, headers, options, internalReq;
    //准备post的数据
    reqBodyStr = JSON.stringify(postData);
    headers = {
        "Content-Type":(reqType) ? reqType : 'application/json;charset=utf-8',
        "Accept": (resType) ? resType : "application/json"
    };
    options = {
        host: config.orgHost[config.runMode].split(':')[0],
        port: config.orgHost[config.runMode].split(':')[1],
        path: path,
        method: (method) ? method : 'get',
        headers: headers
    };

    internalReq = http.request(options, function (newRes) {
        newRes.setEncoding('utf-8');
        var responseString = '';
        newRes.on('data', function (data) {
            responseString += data;
        });
        newRes.on('end', function () {
            try {
                if (next){
                    next(responseString);
                }
            }catch (e){
                next();
                throw e;
            }

        });
    });
    internalReq.on('error', function (e) {
        console.log('e');
        console.log(e);
    });
    if (method==='post'){
        internalReq.write(reqBodyStr);
    }
    internalReq.end();
};
exports.OCFileServer = function (host,port,method,orgFilePath,fileName, fileType, path, auth, next) {
    var headers, options, internalReq;
    var boundaryKey = '----' + new Date().getTime();
    headers = {
        "Content-Type":'multipart/form-data; boundary=' + boundaryKey,
        "Connection": 'keep-alive',
        "Authorization":"Basic " + auth
    };
    options = {
        host: host,
        port: port,
        path: path,
        method: method,
        headers: headers
    };

    internalReq = http.request(options, function (newRes) {
        newRes.setEncoding('utf-8');
        var responseString = '';
        newRes.on('data', function (data) {
            responseString += data;
        });
        newRes.on('end', function () {
            try {
                if (next){
                    next(responseString);
                }
            }catch (e){
                next('error');
            }

        });
    });
    internalReq.on('error', function (e) {
        console.log('e');
        console.log(e);
    });
    internalReq.write(
        '–' + boundaryKey + '\r\n' +
        'Content-Disposition: form-data; name=“file”; filename=“' + fileName + '”\r\n' +
        'Content-Type: ' + fileType + '\r\n\r\n'
    );

    //设置1M的缓冲区
    var fileStream = fs.createReadStream(orgFilePath, {bufferSize:1024 * 1024});
    fileStream.pipe(internalReq, {end:false});
    fileStream.on('end',function(){
        internalReq.end('\r\n–' + boundaryKey + '–');
    });
    /*160808 模拟formdata格式请求的另一种方式
    var request = require('request');
    var formData = {
        file: {
            value:  fs.createReadStream(orgFilePath),
            options: {
                filename: 'test0808_5.pdf',
                contentType: 'application/pdf'
            }
        }
    };
    request.put({
        //url:'http://192.168.1.47:8080/index.php/apps/managementsysext/file/ecg',
        url:'http://192.168.1.47:8080/remote.php/webdav/0805',
        formData: formData,
        headers:{Authorization:"Basic " + auth}
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    });*/
};

exports.OCReceiveFile = function (postData, method, path, auth, tempPath, next) {
    var host=config.ocFileHost[config.runMode].split(':')[0];
    var port=config.ocFileHost[config.runMode].split(':')[1];
    var fileType;
    var tempFile = fs.createWriteStream(tempPath);
    request({
        url: 'http://'+host+':'+port+path,
        method: (method) ? method : 'get',
        headers: {
            'Authorization': "Basic " + auth
        }
    }).on('response', function(response) {
        console.log(response.statusCode); // 200
        console.log(response.headers['content-type']);
        fileType = response.headers['content-type'];
    }).on('end', function() {
        console.log('receive end');
    }).pipe(tempFile);
    tempFile.on('close',function(){
        next(fileType);
    });
};