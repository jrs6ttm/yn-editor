var examService = require('./examService.js');
var uuid = require('node-uuid');

//----------------------------------------------exam operations-----------------------------------------------------------------------------
exports.getExam = function(req, res){
    var query = {};
    var type = req.query.type,
        examId = req.query.examId,
        courseId = req.query.courseId,
        examType = req.query.examType,
        userId = req.query.userId;
    if (examId != null && examId.trim() != '')
        query.examId = examId;
    if (userId != null && userId.trim() != '')
        query.userId = userId;
    if (examType != null && examType.trim() != '')
        query.examType = examType;
    if (courseId != null && courseId.trim() != '')
        query.courseId = courseId;

    if(type=='data') {
        examService.getExamPage(query, function (data1) {
            if(data1.length != 1){
                res.send(false);
            }else{
                examService.getExamItems({pageId: data1[0].pageId}, null, null, function(data2){
                    if(data2.length != 1){
                        res.send(false);
                    }else {
                        res.send(data2[0]);
                    }
                });
            }
        });
    }else{
        examService.getExam(query, function (data) {
            if(type == 'fromCourse'){//从从课程开发过程中进入预编辑页面，获取exam列表，供创建其副本
                res.render('exam/toEditExam_course', {exams: data});
            }else if(type == "fromHome"){//从主页进入预编辑页面，获取exam列表，供创建其副本
                res.render('exam/toEditExam_home', {exams: data});
            }else if(type == "statistic"){//获取exam数据与统计数据
                examService.getExamStatistic({examId: query.examId, statisticType: 'choice'}, function (sData) {
                    console.log('--------------------------------------------statistic data----------------------------------------------------');
                    console.log(sData);
                    data[0].numbers = sData.numbers;
                    data[0].statisticDate = sData.statisticDate;
                    data[0].startSDate = sData.startDate;
                    data[0].endSDate = sData.endDate;
                    res.send(data);
                });

            }else{//获取exam数据
                res.send(data);
            }
        });
    }

};

exports.finishEditExam = function(req, res){
    var examId = req.body.examId
        ,setObj={
            isFinish: true
        };
    examService.updateExam({examId: examId}, setObj, function(data){
        res.send(data);
    });
};

exports.saveExam = function(req, res){
    var user = req.session.userData;
    var date = new Date();
    var saveExamObj  = {
        examId : req.query.examId,
        examName : req.query.examName,
        examType : 'created', //created:原试题；copy:考试副本
        userId   : user?user.id:'',
        username : user?user.name:'',
        isFinish : false,
        exam_version : 1.0,
        isUsed : false,//是否被使用
        copyTime : '',//创建考试副本的时间
        copyFrom : '',//试卷id，代表是谁的副本
        createTime : date,
        lastModify: date
    };

    var editType = req.query.editType;
    if(editType == 'new') {//新建试卷
        var saveExamPageObj = {
            pageId: getDateStrUUID(),
            pageName: '',
            pagePosition: 1,
            examId: req.query.examId
        };
        examService.saveExam_new(saveExamObj, saveExamPageObj, function (data) {
            res.send(data);
        });
    }else if(editType == 'copy'){//编辑试卷的副本，生成新的试卷，不是生成考试副本场景
        var examId_copy = req.query.examId_copy;
        examService.saveExam_copy(saveExamObj, examId_copy, function(data){
            res.send(data);
        });
    }else if(type == "assembly"){//从题库中在线组装试卷

    }else{
        res.send(null);
    }
};

exports.updateExam = function(req, res){
    var examId = req.body.examId, setObj = {};
    var examName = req.body.examName;
    if(examName && examName.trim() != '')
        setObj.examName = examName;
    var isFinish = req.body.isFinish;
    if(isFinish && isFinish.trim() != '')
        setObj.isFinish = isFinish;
    var isUsed = req.body.isUsed;
    if(isUsed && isUsed.trim() != '')
        setObj.isUsed = isUsed == 'false'? false:true;
    var exam_version = req.body.exam_version;
    if(exam_version && exam_version.trim() != '')
        setObj.exam_version = Number(exam_version);
    setObj.lastModify = new Date();

    examService.updateExam({examId: examId}, setObj, function(data){
        res.send(data);
    });
};

//导入QTI，生成exam
exports.importQTI = function(req, res){
    var query = {};
    var examId = req.body.examId;
    if (examId != null && examId.trim() != '')
        query.examId = examId;

    examService.getExam(query, function (data) {-
        res.send(data);
    });
};

//导出exam为QTI
exports.exportQTI = function(req, res){

    var query = {};
    var examId = req.query.examId;
    if (examId != null && examId.trim() != '')
        query.examId = examId;

    examService.exportQTI(query, function (data) {
        res.send(data);
    });
};

exports.getExamStatisticData = function(req, res){
    var query={
        examId: req.body.examId,
        isSubmit: true
    };

    examService.getExamStatisticData(query, function(result) {
        res.send(result);
    });

};



//----------------------------------------------examPage operations-----------------------------------------------------------------------------
exports.getExamPage = function(req, res){
    var query = {};
    var examId = req.query.examId;
    if (examId != null && examId.trim() != '')
        query.examId = examId;
    var pagePosition = req.query.pagePosition;
    if (pagePosition != null && pagePosition.trim() != '')
        query.pagePosition = Number(pagePosition);

    examService.getExamPage(query, function (data) {
        res.send(data);
    });
};

exports.saveExamPage = function(req, res){
    //var user = req.session.userData;
    var param = req.body.examPage;
    var saveExamPageObj  = JSON.parse(param);

    examService.saveExamPage(saveExamPageObj ,function(data){
        res.send(data);
    });
};

exports.deleteExamPage = function(req, res){
    var pageId=req.body.pageId;
    examService.deleteExamPage({pageId: pageId}, function(data){
        res.send(data);
    });
};

exports.sortExamPages = function(req, res){
    var sortedItems = JSON.parse(req.body.sortedItems);
    examService.sortExamPages(sortedItems ,function(data){
        res.send(data);
    });
};

exports.getExamPageCount = function(req, res){
    var query = {};
    var examId = req.body.examId;
    if (examId != null && examId.trim() != '')
        query.examId = examId;
    examService.getExamPageCount(query, function (count) {
        console.log(count);
        res.send(count+'');
    });
};


//----------------------------------------------examItem operations-----------------------------------------------------------------------------
exports.saveExamItem = function(req, res){
    var item=req.body.item;
    item = JSON.parse(item);
    examService.saveExamItem(item, function(data){
        res.send(data);
    });
};

exports.updateExamItem = function(req, res){
    var item=req.body.item;
    item = JSON.parse(item);
    examService.updateExamItem(item, function(data){
        res.send(data);
    });
};

exports.getExamItems = function(req, res){
    var query1={}, query2={};
    var pageId=req.body.pageId;
    if(pageId && pageId.trim())
        query1.pageId = pageId;
    var itemType=req.body.itemType;
    if(itemType && itemType.trim())
        query1.itemType = itemType;
    var isExample=req.body.isExample;
    if(isExample && isExample.trim())
        query1.isExample = isExample;

    var examType = req.body.examType, examId = req.body.examId, user = req.session.userData;
    query2.userId = user?user.id:'';
    if(examId && examId.trim())
        query2.examId = examId;

    examService.getExamItems(query1, query2, examType, function(data){
        res.send(data);
    });
};

exports.deleteExamItem = function(req, res){
    var itemId=req.body.itemId;
    examService.deleteExamItem({itemId: itemId}, function(data){
        res.send(data);
    });
};

exports.sortItems = function(req, res){
    var sortedItems = JSON.parse(req.body.sortedItems);

    examService.sortItems(sortedItems ,function(data){
        res.send(data);
    });
};

//现在暂时没用，思路不对
exports.saveExamItemAnswer = function(req, res){
    var answers=req.body.answers;
    answers = JSON.parse(answers);
    var myAnswer = answers.myAnswer;
    examService.saveExamItemAnswer(myAnswer, function(data){
        res.send(data);
    });
};

//导出examItem为QTI_AI
exports.exportQTI_AI = function(req, res){

    var query = {};
    var itemId = req.query.itemId;
    if (itemId != null && itemId.trim() != '')
        query.itemId = itemId;

    examService.exportQTI_AI(query, function (data) {
        res.send(data);
    });

};

//导出examItem为QTI_AI
exports.importQTI_AI = function(req, res){
    var query = {};
    /*
    var itemId = req.query.itemId;
    if (itemId != null && itemId.trim() != '')
        query.itemId = itemId;
    */
    examService.importQTI_AI(query, function (data) {
        res.send(data);
    });

};

//---------------------------------------------------------my examination------------------------------------------------------------------------------
exports.prepareToExam = function(req, res){
    var pExamId = req.query.examId,  user = req.session.userData,
        taskId = req.query.taskId, tabIndex = req.query.index, courseName = req.query.courseName;
    var examId = pExamId ? pExamId:'';
    if(examId == ''){
        res.render('exam/toEnterExam', {errorMsg: "error,获取不到试卷id！"});
    }else {
        var versionType = req.query.versionType;
        if(versionType && versionType == 'newest'){//试卷版本要求最新
            copyToExam(res, user, examId, taskId, tabIndex, courseName);
        }else{//试卷版本不作要求时，获取自己已做答的最新版本的试卷副本（此方法其实是倒序返回自己所有的已做答试卷副本，取第一个为最新版）
            examService.getMyExamAnswer({userId: user?user.id:'', copyFrom: examId}, null, {exam_version: -1}, function (result) {
                if(result && result.length > 0){//自己已做答的最新版本的试卷副本存在，直接找到，返回
                    res.render('exam/toEnterExam', {examId: result[0].examId});
                }else{//说明自己还没做答过该试卷的最新版本的试卷副本
                    copyToExam(res, user, examId, taskId, tabIndex, courseName);
                }
            });
        }
    }
};

var copyToExam = function(res, user, examId, taskId, tabIndex, courseName){
    //1,拷贝试卷最新副本
    examService.getExam({examId: examId}, function (exam) {
        if(exam && exam.length>0){
            console.log(exam[0].isUsed);
            if(exam[0].isUsed){//已经被使用了(说明试卷当前版本与其最新副本的版本一致)，不用再拷贝了，直接找其最新的副本即可
                examService.getExam({copyFrom: examId, exam_version:exam[0].exam_version}, function(copies){//获取最新副本
                    if(copies && copies.length>0){
                        //2,初始化我的试卷作答
                        initMyExamAnswer(res, user, {examId:copies[0].examId, copyFrom: examId, exam_version:exam[0].exam_version}, taskId, tabIndex);
                    }else{
                        console.log("error,获取不到试卷的最新考试副本！");
                        res.render('exam/toEnterExam', {errorMsg: "error,获取不到试卷的最新考试副本！"});
                    }
                });
            }else{//没有被使用(说明试卷当前版本比其现有最新副本的版本高)，拷贝其最新副本
                var date = new Date();
                var saveExamObj  = {
                    examId : uuid.v1(),
                    examName : exam[0].examName,
                    examType : 'copy', //created:原试题；copy:考试副本
                    userId   : exam[0].userId,
                    username : exam[0].username,
                    courseId : '',
                    courseName : courseName,
                    isFinish : exam[0].isFinish,
                    exam_version : exam[0].exam_version,
                    isUsed : true,//是否被使用
                    copyTime : getDateStrUUID(),//创建考试副本的时间
                    copyFrom : exam[0].examId,//试卷id，代表是谁的副本
                    createTime : date,
                    lastModify: date
                };

                if(taskId){
                    var course = taskId.split('@');
                    saveExamObj.courseId = course[0];
                }
                examService.saveExam_copy(saveExamObj, exam[0].examId, function(data){
                    if(data && data.success) {
                        examService.updateExam({examId: examId}, {isUsed: true}, function(updateResult){
                            if(updateResult && updateResult.success) {
                                //2,初始化我的试卷作答
                                initMyExamAnswer(res, user, {examId:saveExamObj.examId, copyFrom: examId, exam_version:exam[0].exam_version}, taskId, tabIndex);
                            }else{
                                console.log("error,修改试卷使用状态失败！");
                                res.render('exam/toEnterExam', {errorMsg: "error,修改试卷使用状态失败！"});
                            }
                        });
                    }else{
                        console.log("error,创建试卷考试副本失败！");
                        res.render('exam/toEnterExam', {errorMsg: "error,创建试卷考试副本失败！"});
                    }
                });
            }
        }else{
            console.log("error,要拷贝的试卷找不到！");
            res.render('exam/toEnterExam', {errorMsg: "error,要拷贝的试卷找不到！"});
        }
    });
};

var initMyExamAnswer = function(res, user, params, taskId, tabIndex){
    var initMyExam = {
        userId: user ? user.id : '',
        username: user ? user.name : '',
        examId: params.examId,
        copyFrom : params.copyFrom,
        exam_version : params.exam_version,
        taskId : taskId,
        tabIndex : tabIndex,
        //examType: 'exam',
        myAnswer: [],
        sumScore: 0,
        sumMyScore: 0,
        isSubmit: false,
        isCorrected: false
    };
    examService.initMyExamAnswer({userId: user ? user.id : '', examId: params.examId}, initMyExam, function (data) {
        console.log(data);
        if (data && data.success) {
            //此处应该把考试副本的examId送到前台，这个是真正用于考试的试卷。而前台现在的examId是被拷贝的原试卷---跳转页处理
            res.render('exam/toEnterExam', {examId: initMyExam.examId});
        } else {
            console.log("error, 初始化试卷作答失败！");
            res.render('exam/toEnterExam', {errorMsg: "error, 初始化试卷作答失败！"});
        }
    });
};

exports.updateMyExamAnswer = function(req, res){
    var user = req.session.userData;
    var answers=req.body.answers, query={
        userId: user?user.id:'',
        examId: req.body.examId
    };
    answers = JSON.parse(answers);
    var myAnswer = answers.myAnswer;
    examService.updateMyExamAnswer(query, myAnswer, function(data){
        res.send(data);
    });
};

exports.submitMyExam = function(req, res){
    var user = req.session.userData;
    var query={
        userId: user?user.id:'',
        examId: req.body.examId
    };
    examService.submitMyExam(query, function(data){
        res.send(data);
    });
};

exports.getMyExam = function(req, res){
    var user = req.session.userData, userId = req.body.userId, type = req.body.type;
    var query={
        examId: req.body.examId
    };
    if(type && type == 'all'){

    }else{
        query.userId = userId?userId:(user?user.id:'');
    }
    examService.getMyExamAnswer(query, null, {createTime: -1}, function(myExams) {
        res.send(myExams);
    });
};

exports.MyExamIsSubmit = function(req, res){
    var user = req.session.userData;
    var query={
        userId: user?user.id:'',
        examId: req.body.examId
    };
    examService.getMyExamAnswer(query, null, null, function(myExamAnswer) {
        var isSubmitted = false;
        if (myExamAnswer && myExamAnswer.length > 0) {
            isSubmitted = myExamAnswer[0].isSubmit;
            console.log(isSubmitted);
        }

        res.send(isSubmitted);
    });
};

exports.getMyExamReport = function(req, res){
    //跨域
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    var user = req.session.userData, userId = req.body.userId;
    var query={
        userId: userId?userId:(user?user.id:''),
        examId: req.body.examId
    };

    var isDetailed = req.body.isDetailed;
    examService.getMyExamReportData(query, isDetailed, function(data){
        res.send(data);
    });
};

function getDateStrUUID(){
    var date = new Date();
    var month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1);
    var day = date.getDate()<10 ? ('0'+date.getDate()) : date.getDate();
    var hour = date.getHours()<10 ? ('0'+date.getHours()) : date.getHours();
    var minutes = date.getMinutes()<10 ? ('0'+date.getMinutes()) : date.getMinutes();
    var seconds = date.getSeconds()<10 ? ('0'+date.getSeconds()) : date.getSeconds();
    var millSeconds = date.getMilliseconds();
    if(millSeconds<100){
        if(millSeconds<10){
            millSeconds = '00'+millSeconds;
        }else {
            millSeconds = '0' + millSeconds;
        }
    }

    var dateStr = '' + date.getFullYear() +  month +  day +hour +  minutes +  seconds + millSeconds;

    return dateStr;
}


