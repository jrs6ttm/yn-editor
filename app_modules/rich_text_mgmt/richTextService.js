/**
 * Created by Eamonn on 2015/8/25.
 */

var richTextDao = new (require('./RichTextDao.js'))('richTexts');
var message = require('../_utils/messageGenerator.js');



exports.saveRichText = function(id,textContent,name,description,user,callback){
    var richTextModelData = {
        typeId: id,
        textContent: textContent,
        name: name,
        description: description,
        user: user
    };
    richTextDao.saveRichText(richTextModelData,function(message){
        callback(message);
    });
};

exports.loadAllRichTextModel = function (user,isOut,next) {
    var findObj = {
        user: user,
        isOut: isOut
    };
    richTextDao.findAllByTrashFlagUnderAccount(findObj,function(allFiles){
        var changeFiles=[];
        for(var i=0;i<allFiles.length;i++){
            var test={
                id:allFiles[i].id,
                typeId:allFiles[i].typeId,
                fileName: allFiles[i].name,
                description: allFiles[i].description,
                textContent : allFiles[i].textContent,
                createTime:allFiles[i].createTime,
                lastModify:allFiles[i].lastModify,
                isDeleted: allFiles[i].isDeleted,
                userId: allFiles[i].userId,
                userName: allFiles[i].userName
            };
            changeFiles.push(test);
        }
        next(message.genSimpSuccessMsg('', changeFiles));
    });
};

exports.loadRichTextModel = function(id,user,next){
    richTextDao.findFileByIdUnderAccount(id, user, function (doc) {
        if (doc) {
            var resData = {
                id:doc.id,
                typeId:doc.typeId,
                fileName: doc.name,
                description: doc.description,
                textContent : doc.textContent,
                createTime:doc.createTime,
                lastModify:doc.lastModify
            };
            next(message.genSimpSuccessMsg('', resData));
        } else {
            next(message.genSimpFailedMsg('not exist', null))
        }

    });
};

exports.loadRichTextModel2 = function(id,next){
    richTextDao.findFileById(id,function (doc) {
        if (doc) {
            var resData = {
                id:doc.id,
                typeId:doc.typeId,
                fileName: doc.name,
                description: doc.description,
                textContent : doc.textContent,
                createTime:doc.createTime,
                lastModify:doc.lastModify
            };
            next(message.genSimpSuccessMsg('', resData));
        } else {
            next(message.genSimpFailedMsg('not exist', null))
        }

    });
};

exports.updateRichTextModel = function (updateQuery,updateData,next) {
    richTextDao.updateOneRecord(updateQuery, updateData, function(resData){
        console.log(resData);
        //if(err){
        //    next(message.genSimpFailedMsg('putFileMetaData', null))
        //}else{
            next(message.genSimpSuccessMsg('', resData));
        //}
    });
};

exports.deleteRichTextModel = function (idArray,next) {
    var resultArray = [];
    var count1 = 0;
    var count2 = 0;
    if(!(idArray instanceof Array)){
        idArray=[idArray];
    }
    for (var i = 0; i < idArray.length; i++) {
        count1++;
        richTextDao.removeById(idArray[count1 - 1], function (result) {
            count2++;
            if(result){
                resultArray.push(result);
                if (count2 == idArray.length) {
                    next(message.genSimpSuccessMsg('', resultArray));
                }
            }
        });
    }
};
