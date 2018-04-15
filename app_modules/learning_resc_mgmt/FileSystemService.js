/**
 * FileSystemService.js
 */
var Gridfs = require('gridfs-stream');
var fs = require('fs');
var dataSource = require('../../app_db/dataSource.js');
var FSService = function(){
    this.db = dataSource.getDB();
    this.mongo = dataSource.getMongo();
};


FSService.prototype.saveToGridFS = function(params){
    console.log(params);
    var gfs = Gridfs(this.db, this.mongo);
    var writeStream = gfs.createWriteStream({
        filename : params.filename
    });
    var path = 'D:/apache-tomcat-7.0.57/webapps/OfficeTransfer/'+params.sourceF;
    fs.exists(path , function(exist){
        if(exist){
            var readStream = fs.createReadStream(path);
            readStream.pipe(writeStream);
        }else{
            console.log('找不到视频文件：'+path);
        }
    });

};

FSService.prototype.getFromGridFS = function(req, res){

    res.writeHead(200, {
        'Content-Type' : 'video/mp4'
    });

    var gfs = Gridfs(this.db, this.mongo);
    var readStream = gfs.createReadStream({
        filename : 'b608e16d-a7f8-45a7-b6dd-b2e7337adc46'
    });

    readStream.on('error', function(err){
        console.log('An error occurred when reading files from Gridfs!', err);
        throw err;
    });
    readStream.on('close', function(){
        res.end();
        console.log('reading files from Gridfs is finished!');
    });

   readStream.pipe(res);
};


module.exports = FSService;
