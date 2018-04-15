/**
 * learningResService.js
 */
var fs = require('fs');
var path = require('path');
var message = require('../_utils/messageGenerator.js');
var learningResDao = new (require('./LearningResDao.js'))('learningResource');
var uploadProjectDao = new (require('./LearningResDao.js'))('uploadProject');
var videoResDao = new (require('./VideoResDao.js'))('videoResource');
var questionsResDao = new (require('./QuestionsResDao.js'))('questionsResource');
var commentsDao = new (require('./commentsDao.js'))('comments');
var FileSystemService = require('./FileSystemService.js');
var fsService = new FileSystemService();

exports.searchLearningRes = function(query, sortQuery, callback){
    learningResDao.searchLearningRes(query, sortQuery, function(allLearningRes){
        callback(message.genSimpSuccessMsg('', allLearningRes));
    });
};

exports.saveLearningRes = function(saveObj, callback){
    learningResDao.saveLearningRes(saveObj, function(allLearningRes){
        var videoImagePath = saveObj.videoImagePath;
        if(videoImagePath && videoImagePath.trim() != '') {
            var params = {
                sourceF : saveObj.sourceF,
                filename : saveObj.materialsId
            }
            fsService.saveToGridFS(params);
        }
        callback(allLearningRes);

    });
};

exports.saveUploadModelFiles = function(saveObj,callback){
    uploadProjectDao.saveLearningRes(saveObj,function(data){
        callback(data);
    });
};

exports.deleteUploadFile = function(id,callback){
    var queryObj = {
        materialsId : id
    };
    uploadProjectDao.deleteLR(queryObj,function(data){
        callback(data);
    });
};

exports.saveVideoRes = function(query, callback){
    videoResDao.saveVideoRes(query, function(allLearningRes){
        callback(allLearningRes);
    });
};

exports.getVideoParts = function(query, callback){
    videoResDao.getVideoRes(query, function(allLearningRes){
        var x = [];
        for (var i = 0; i < allLearningRes.length; i++) {
            var test = {
                id: allLearningRes[i].id,
                name: allLearningRes[i].name,
                description: allLearningRes[i].description,
                segments: allLearningRes[i].segments,
                editTime:allLearningRes[i].editTime,
                userId:allLearningRes[i].userId
            };
            x.push(test);
        }
        callback(message.genSimpSuccessMsg('', x));
    });
};

exports.deleteLR = function(query, callback){
    learningResDao.deleteLR(query, function(allLearningRes){
        callback(allLearningRes);
    });
};

exports.saveQuestionForm = function(item, callback){
    questionsResDao.saveQuestionForm(item, function(data){
        callback(data);
    });
};

exports.getAnswerQuestionPanel = function(query, callback){
    questionsResDao.getAnswerQuestionPanel(query, function(questionData){
        callback(questionData);
    });
};

exports.updateLR = function(updateObj, callback){
    learningResDao.updateLR({materialsId : updateObj.materialsId}, {$set: updateObj},   function(allLearningRes){
        callback(allLearningRes);
    });
};

exports.isMaterialExist = function(query, callback){
    learningResDao.searchLearningRes(query, function(result){
        if(result && result.length>0){
            var path = 'D:\\apache-tomcat-7.0.57\\webapps\\OfficeTransfer\\'+result[0].sourceF;
            path = path.replace(/\//, '\\');
            fs.exists(path, function(exists){
                callback(exists);
            });
        }else{
            callback(false);
        }
    });

};

exports.saveComment = function(Obj, callback){
    commentsDao.saveComment(Obj, function(data){
        callback(data);
    });
};

exports.getComments = function(query, callback){
    commentsDao.getComments(query, function(data){
        callback(data);
    });
};

exports.updateCourses = function(query, set,  callback){
    learningResDao.updateLR(query, set, function(allLearningRes){
        callback(allLearningRes);
    });
};