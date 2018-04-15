/**
 * learningResController.js
 * @type {exports|module.exports}
 */
var learningResService = require('./learningResService.js');

exports.searchLearningRes = function(req, res){
    //跨域
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    var user = req.session.userData, query = {}, isDeleted = req.query.isDeleted;
    if (isDeleted != null && isDeleted.trim() != '') {
        query.isDeleted = isDeleted;
    } else {
        query.isDeleted = false;
    }
    var toUser = req.query.toUser;
    if (toUser != null && toUser != '0')
        query.toUser = toUser;

    var fileName = req.query.fileName;
    if (fileName != null && fileName.trim() != '') {
        query.fileName = {$regex: req.param('fileName')};
    }

    var materialsId = req.query.materialsId;
    if (materialsId != null && materialsId.trim() != '')
        query.materialsId = materialsId.trim();
/*
    var fileType = req.query.fileType;
    if (fileType != null && fileType.trim() != '')
        query.fileType = fileType.trim();
*/
    var language = req.query.language;
    if(language && language.trim() != '')
        query.language = language.trim();

    var difficulty = req.query.difficulty;
    if(difficulty && difficulty.trim() != '')
        query.difficulty = difficulty.trim();

    var learningResourceType = req.query.learningResourceType;
    if(learningResourceType && learningResourceType.trim() != '')
        query.learningResourceType = learningResourceType.trim();

    var structure = req.query.structure;
    if(structure && structure.trim() != '')
        query.structure = structure.trim();

    var typicalAgeRange = req.query.typicalAgeRange;
    if(typicalAgeRange && typicalAgeRange.trim() != '')
        query.typicalAgeRange = typicalAgeRange.trim();

    var sortType = req.query.sortType, sortQuery = {};
    switch(sortType){
        case 'createTime': sortQuery = {'createTime':-1};break;
        case 'readTimes': sortQuery = {'readTimes':-1};break;
        case 'downloadTimes': sortQuery = {'downloadTimes':-1};break;
        case 'praiseTimes': sortQuery = {'praiseTimes':-1};break;
        default:sortQuery = {'createTime':-1};break;
    }

    learningResService.searchLearningRes(query, sortQuery, function (data) {
        if(data && data.success && data.data.length > 0 && user){
            var result = data.data
            result[0].userId = user.id;
            result[0].username = user.name;
            data.data = result;
        }
        res.send(data);
    });

};

exports.searchRichText = function(req, res){
    var query = {};
    var isDeleted = req.query.isDeleted;

    if (isDeleted != null && isDeleted.trim() != '') {
        query.isDeleted = isDeleted;
    } else {
        query.isDeleted = false;
    }
    var toUser = req.query.toUser;
    if (toUser != null && toUser != '0')
        query.toUser = toUser;
    var fileName = req.query.fileName;
    if (fileName != null && fileName.trim() != '')
        query.fileName = {$regex: req.param('fileName')};
    var materialsId = req.query.materialsId;
    if (materialsId != null && materialsId.trim() != '')
        query.materialsId = materialsId;
    query.fileType ='html';
    learningResService.searchLearningRes(query, null, function (data) {
        res.send(data);
    });
};

exports.saveLearningRes = function(req, res){
    var user = req.session.userData;
    var date = new Date();
    var saveObj  = {
        fileName: req.body.fileName,
        isCreated: req.body.isCreated,
        publisherId: user?user.id:'',
        publisher: user?user.name:'',
        userId:'',
        username:'',
        sourceF: req.body.sourceF,
        usageType: req.body.usageType,
        courses : [],
        transformF: req.body.transformF,
        videoImagePath: req.body.videoImagePath,
        materialsId: req.body.materialsId,
        size: req.body.size,
        fileType: req.body.fileType,
        createTime: date,
        lastModify: date,
        isDeleted: false,
        toUser: req.body.toUser,
        description: req.body.description,
        readTimes : Number(req.body.readTimes),
        downloadTimes : Number(req.body.downloadTimes),
        praiseTimes : Number(req.body.praiseTimes),
        keyword: req.body.keyword,
        difficulty: req.body.difficulty,
        typicalAgeRange: req.body.typicalAgeRange,
        language: req.body.language,
        status: req.body.status,
        learningResourceType: req.body.learningResourceType,
        structure: req.body.structure
    };

    console.log(req.body.keyword);
    learningResService.saveLearningRes(saveObj, function(data){
        res.send(data);
    });
};

exports.saveUploadModelFiles = function(req,res){
    var user = req.session.userData;
    var date = new Date();
    var saveObj = {
        materialsId : req.body.materialsId,
        fileName : req.body.fileName,
        fileDesc : req.body.fileDesc,
        user : user,
        createTime : date
    }
    learningResService.saveUploadModelFiles(saveObj, function(data){
        res.send(data);
    });
};

exports.deleteUploadFiles = function(req,res){
    var id = req.body.id;
    learningResService.deleteUploadFile(id,function(data){
        res.send(data);
    });
};

exports.saveVideoRes = function(req, res){
    var user = req.session.userData;
    var date = new Date();

    var Obj = JSON.parse(req.body.resData);
    if(req.body.isNew === 'false')
        Obj.isNew = false;
    else
        Obj.isNew = true;
    Obj.editTime = date;
    Obj.userId = user?user.id:'';

    learningResService.saveVideoRes(Obj, function(data){
        res.send(data);
    });
};

exports.getVideoRes = function(req, res){
    //跨域
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    var query1 = {},query2 = {};
    var result = {};

    if(req.param('materialsId')) {
        query1.materialsId = req.param('materialsId');
        query2.id = req.param('materialsId');
    }
    //取出视频资料基本信息
    learningResService.searchLearningRes(query1, null, function (data1) {
        result.videoRes = data1;

        //取出视频资料分段信息
        learningResService.getVideoParts(query2, function(data2){
            result.parts = data2;
            console.log(result);
            res.send(result);
        });
    });

};

exports.deleteLR = function(req, res){
    var query = {
        materialsId:req.param('materialsId')
    }

    learningResService.deleteLR(query, function(data){
        res.send(data);
    });
};

exports.saveQuestionForm = function(req, res){
    //跨域
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    var item=req.body.item;
    item = JSON.parse(item);
    item.user = req.session.userData;
    if(!item.user)
        item.user = 'aaa';


    learningResService.saveQuestionForm(item, function(data){
        res.send(data);
    });
};

exports.saveAnswerForm = function(req, res){
    //跨域
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");

    var answerObj=req.body.myAnswer;
    answerObj = JSON.parse(answerObj);
    answerObj.user = req.session.userData;
    if(!answerObj.user)
        answerObj.user = 'aaa';

    var query = {id:answerObj.questionId};

    learningResService.getAnswerQuestionPanel(query, function (questionObj) {

        var result = {};
        if(questionObj.length > 0)
            result = questionObj[0];

        if(answerObj.myOpenAnswer.trim() === ''){//不是开放回答，需判断正误
            var myAnswer = answerObj.myChoice.sort().toString();
            var rightAnswer = result.rightAnswer.sort().toString();
            var rightType = result.rightType;

            if(rightType == 'part'){//部分选中算正确
                if(rightAnswer.indexOf(myAnswer) != -1)
                    answerObj.result = 'right';
                else
                    answerObj.result = 'wrong';
            }else{//全部选中算正确
                if(rightAnswer == myAnswer)
                    answerObj.result = 'right';
                else
                    answerObj.result = 'wrong';
            }

        }else{//自写开放回答，不做判断
            answerObj.result = 'unchecked';
        }

        console.log('answerObj:');
        console.log(answerObj);

        learningResService.saveQuestionForm(answerObj, function(data){
            data.result = answerObj.result;
            res.send(data);
        });
    });

};

exports.getAnswerQuestionPanel = function(req, res){
    //跨域
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //res.header("Content-Type", "application/json;charset=utf-8");


    var query = {};
    var id = req.param('id');
    var type = req.param('type');
    query.id = id;
    console.log(query);

    learningResService.getAnswerQuestionPanel(query, function (data) {
        console.log('data:');
        console.log(data);
        var result = {};
        if(data.length > 0)
            result = data[0];

        if(type == 'data'){
            res.send(result);
        }else {
            if(type=='preShow')
                result.type = 'preShow';

            res.render('answerQuestionPanel', {questionData: result});
        }
    });

};

exports.getAnswerResult = function(req, res){
    //跨域

    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");


    var query = {};
    var id = req.param('questionId');
    query.questionId = id;
    console.log(query);

    learningResService.getAnswerQuestionPanel(query, function (data) {
        console.log('data:');
        console.log(data);
        var result = {};
        if(data.length > 0)
            result = data[0];
        res.send(result.result);
        //res.render('answerQuestionPanel', {questionData: result});
    });

};

exports.updateLR = function(req, res){
    var date = new Date();
    var updateObj = JSON.parse(req.body.updateObj);
    updateObj.lastModify = date;

    learningResService.updateLR(updateObj, function(data){
        res.send(data);
    });
};

exports.isMaterialExist = function (req, res) {
    var id = req.query.materialsId;
    learningResService.isMaterialExist({materialsId : id}, function(data){
        res.send(data);
    });
};

exports.saveComment = function(req, res){
    var Obj = JSON.parse(req.body.comment);

    learningResService.saveComment(Obj, function(data){
        res.send(data);
    });
};

exports.getComments = function(req, res){
    var query = req.query.query;

    learningResService.getComments(query, function(data){
        res.send(data);
    });
};

exports.updateCourses = function(req, res){
    var oldM = JSON.parse(req.query.oldMaterialsId);
    var newM = JSON.parse(req.query.newMaterialsId);
    var set = {};

    if(oldM && oldM.length>0){
        for(var i=0; i<oldM.length; i++) {
            var query = {
                materialsId: oldM[i]
            };
            var course = {courses: req.query.courseId};
            set = {
                $pull: course
            };

            learningResService.updateCourses(query, set, function (data) {
                res.send(data);
            });
        }

    }

    if(newM && newM.length>0){
        for(var i=0; i<newM.length; i++) {
            var query = {
                materialsId : newM[i]
            };

            var course = [req.query.courseId];
            set = {
                $addToSet : {courses : {$each : course}}
            };

            learningResService.updateCourses(query, set, function(data){
                res.send(data);
            });

        }

    }
};

