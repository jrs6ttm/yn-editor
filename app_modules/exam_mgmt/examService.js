var examDao = new (require('./examDao.js'))('examination');
var examPageDao = new (require('./examPageDao.js'))('examinationPage');
var examItemDao = new (require('./examItemDao.js'))('examinationItem');
var myExamDao = new (require('./myExamDao.js'))('myExamination');
var examStatisticDao = new (require('./examStatisticDao.js'))('examStatistic');
var uuid = require('node-uuid');
var QTI = new (require('./QTIHandler.js'))();
//----------------------------------------------exam operations-----------------------------------------------------------------------------
exports.getExam = function(query, callback){
    examDao.getExam(query, function(exam){
        callback(exam);
    });
};

//初次创建exam，同时也创建exam的第一页
exports.saveExam_new = function(saveExamObj, saveExamPageObj,callback){
    examDao.saveExam(saveExamObj, function(result1){
        examPageDao.saveExamPage(saveExamPageObj,function(result2){
            console.log(result2);
            callback(result1);
        });

    });
};

//创建已有exam的副本
exports.saveExam_copy = function(saveExamObj, examId_copy, callback){
    copyExam(examId_copy, function(examPages_copy, examItems_copy){
        optAfterCopyExam(examPages_copy, examItems_copy, saveExamObj, callback);
    });
};

var copyExam = function (examId_copy, callback){
    examPageDao.getExamPage({examId: examId_copy}, function(examPages_copy){
        if(examPages_copy){
            var examPageLength = examPages_copy.length;
            if(examPageLength > 0){
                var k = 0, examItems = [];
                for(var i=0; i< examPageLength; i++){
                    examItemDao.getExamItems({pageId : examPages_copy[i].pageId},function(examItems_copy){
                        k++;
                        for(var j=0;j<examItems_copy.length;j++) {
                            examItems.push(examItems_copy[j]);
                        }
                        if(k === examPageLength){
                            callback(examPages_copy, examItems);
                        }
                    });
                }
            }else{
                callback(null);
            }
        }else{
            callback(null);
        }
    });
};

var optAfterCopyExam = function(examPages_copy, examItems_copy, saveExamObj, callback){
    if(examPages_copy) {
        for (var i = 0; i < examPages_copy.length; i++) {
            var date = new Date();
            delete examPages_copy[i]._id;
            examPages_copy[i].id = uuid.v1();
            examPages_copy[i].createTime = date;
            examPages_copy[i].lastModify = date;
        }
        for (var i = 0; i < examItems_copy.length; i++) {
            var date = new Date();
            delete examItems_copy[i]._id;
            examItems_copy[i].id = uuid.v1();
            examItems_copy[i].createTime = date;
            examItems_copy[i].lastModify = date;
        }
        for (var i = 0; i < examPages_copy.length; i++) {
            var currPageId = examPages_copy[i].pageId;
            examPages_copy[i].examId = saveExamObj.examId;
            examPages_copy[i].pageId = uuid.v1();

            for (var j = 0; j < examItems_copy.length; j++) {
                if(examItems_copy[j].pageId == currPageId){
                    examItems_copy[j].pageId = examPages_copy[i].pageId;
                    examItems_copy[j].itemId = uuid.v1();
                }
            }
        }
        //保存saveExamObj,批量保存examPages、examItems
        examDao.saveExam(saveExamObj, function(result1){
            console.log(result1);
            if(result1 && result1.success) {
                examPageDao.saveExamPageBatch(examPages_copy, function (result2) {
                    console.log(result2);
                    if(result2 && result2.success) {
                        examItemDao.saveExamItemBatch(examItems_copy, function (result3) {
                            callback(result3);
                        });
                    }else{
                        callback(null);
                    }
                });
            }else{
                callback(null);
            }
        });
    }else{
        callback(null);
    }
};

exports.updateExam = function(query, updateObj, callback){
    examDao.updateExam(query, {$set: updateObj},   function(allLearningRes){
        callback(allLearningRes);
    });
};

exports.exportQTI = function(query, callback){
    var examItemsArr = [];

    examDao.getExam(query, function(exam){
        //callback1(exam);
        if(exam && exam.length > 0){
            examPageDao.getExamPage({examId: exam[0].examId}, function(examPages){
                //callback(examPage);
                if(examPages){
                    var examPageLength = examPages.length;
                    if(examPageLength > 0){
                        var k = 0;
                        for(var i=0; i< examPageLength; i++){
                            examItemDao.getExamItems({pageId : examPages[i].pageId},function(examItems){
                                k++;
                                for(var j=0;j<examItems.length;j++) {
                                    examItemsArr.push(JSON.stringify(examItems[j]));
                                }
                                if(k === examPageLength){
                                    QTI.exportQTI(examItemsArr, callback);
                                }
                            });
                        }

                    }


                }
            });
        }
    });

};

var examItemsStatistic = function(query1, query2, sort, callback){
    myExamDao.getMyExamAnswer(query1, query2, sort, function(myExamAnswers){
        var itemsStatistic = {}, alt = ['A','B','C','D','F','G','H','I','J','K'];
        for(var n=0; n<myExamAnswers.length;n++){
            var myAnswerArr = myExamAnswers[n].myAnswer;//myExamAnswers[n]:第n个人的试卷答案
            if(myAnswerArr && myAnswerArr.length > 0){
                for(var k=0;k<myAnswerArr.length;k++) {
                    if(!itemsStatistic[myAnswerArr[k].pageId]) {//myAnswerArr[k]:第k+1页答案
                        itemsStatistic[myAnswerArr[k].pageId] = {};//itemsStatistic = {'pageId0':{}, 'pageId1':{},...}
                    }
                    var itemAnswers = myAnswerArr[k].itemAnswers;
                    if (itemAnswers && itemAnswers.length > 0) {
                        for (var i = 0; i < itemAnswers.length; i++) {
                            if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]){//itemAnswers[i]:第i个item的答案
                                itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId] = {};//itemsStatistic = {'pageId0':{'itemId0':{},'itemId1':{},...}, 'pageId1':{},...}
                            }
                            var itemType = itemAnswers[i].itemType,
                                answer = itemAnswers[i].myAnswer;
                            if (itemType == 'MULTIPLE_CHOICE' || itemType == 'MULTIPLE_RESPONSE' || itemType == 'YES_NO' || itemType == 'TRUE_FALSE') {
                                var myChoiceIds = answer[0].rightChoiceIds;
                                if(myChoiceIds.length == 0){
                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['none']){
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['none'] = 1;
                                    }else{
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['none'] ++;
                                    }
                                }else {
                                    for (var j = 0; j < myChoiceIds.length; j++) {
                                        var letter = alt[myChoiceIds[j] - 1];//'A','B'...
                                        if (!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][letter]) {//itemsStatistic = {'pageId0':{'itemId0':{'A':1},'itemId1':{},...}, 'pageId1':{},...}
                                            itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][letter] = 1;
                                        } else {
                                            itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][letter]++;
                                        }
                                    }
                                }

                            } else if (itemType == 'LIKERT') {
                                for (var j = 0; j < answer.length; j++) {
                                    var value_likert = answer[j].value;
                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].choiceId]){
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].choiceId] = {};
                                    }

                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].choiceId][value_likert]){
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].choiceId][value_likert] = 1;
                                    }else{
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].choiceId][value_likert] ++;
                                    }
                                }
                            } else if (itemType == 'SLIDER') {
                                var value_slider = answer[0];
                                if(value_slider <= 60){
                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['le60']){
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['le60'] = 1;
                                    }else{
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['le60'] ++;
                                    }
                                }else if(value_slider > 60 && value_slider <= 70){
                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['60~70']){
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['60~70'] = 1;
                                    }else{
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['60~70'] ++;
                                    }
                                }else if(value_slider > 70 && value_slider <= 80){
                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['70~80']){
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['70~80'] = 1;
                                    }else{
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['70~80'] ++;
                                    }
                                }else if(value_slider > 80 && value_slider <= 90){
                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['80~90']){
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['80~90'] = 1;
                                    }else{
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['80~90'] ++;
                                    }
                                }else{
                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['90~100']){
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['90~100'] = 1;
                                    }else{
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId]['90~100'] ++;
                                    }
                                }

                            } else if (itemType == 'FILL_IN_BLANK') {
                                for (var j = 0; j < answer.length; j++) {
                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].blankId]){//itemsStatistic = {'pageId0':{'itemId0':{'A':1},'itemId1':{'1':{'right':1}},...}, 'pageId1':{},...}
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].blankId] = {};
                                    }
                                    if(answer[j].myScore == answer[j].score){
                                        if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].blankId]['right']){
                                            itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].blankId]['right'] = 1;
                                        }else{
                                            itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].blankId]['right'] ++;
                                        }
                                    }else{
                                        if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].blankId]['wrong']){
                                            itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].blankId]['wrong'] = 1;
                                        }else{
                                            itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].blankId]['wrong'] ++;
                                        }
                                    }

                                }
                            } else if (itemType == 'INLINE_CHOICE') {
                                for (var j = 0; j < answer.length; j++) {
                                    //itemsStatistic = {'pageId0':{'itemId0':{'A':1},'itemId1':{'1':{'right':1}},'itemId1':{'1':{}}...}, 'pageId1':{},...}
                                    if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].inlineChoiceId]){
                                        itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].inlineChoiceId] = {};
                                    }
                                    var myChoiceIds = answer[j].rightChoiceIds;
                                    if(myChoiceIds.length == 0){
                                        if(!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].inlineChoiceId]['none']){
                                            itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].inlineChoiceId]['none'] = 1;
                                        }else{
                                            itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].inlineChoiceId]['none'] ++;
                                        }
                                    }else {
                                        for (var t = 0; t < myChoiceIds.length; t++) {
                                            var letter = myChoiceIds[t] - 1;
                                            //itemsStatistic = {'pageId0':{'itemId0':{'A':1},'itemId1':{'1':{'right':1}},'itemId1':{'1':{'A':1}}...}, 'pageId1':{},...}
                                            if (!itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].inlineChoiceId][alt[letter]]) {
                                                itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].inlineChoiceId][alt[letter]] = 1;
                                            } else {
                                                itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].inlineChoiceId][alt[letter]]++;
                                            }
                                        }
                                    }
                                }
                            } else if (itemType == 'OPEN_QUESTION') {
                                /*
                                for (var j = 0; j < answer.length; j++) {
                                    items[i].myAnswer = answer[j];
                                }
                                */
                            } else {
                                console.log('error--无题型：' + itemType);
                            }
                        }
                    }
                }
            }

        }
        var examItemsStatistic = {
            examId : query1.examId,
            statisticType : 'choice',//choice: 选项统计；percent: 试卷正确率统计
            numbers : myExamAnswers.length, //统计人数
            statisticDate : new Date(),//统计时间
            startDate : '',//统计取样时间范围
            endDate : '',
            statisticData : itemsStatistic
        };
        examStatisticDao.saveExamStatistic(examItemsStatistic, function(result){
            callback(examItemsStatistic);
        });
    });
};

//----------------------------------------------examPage operations-----------------------------------------------------------------------------

exports.getExamPage = function(query, callback){

    examPageDao.getExamPage(query, function(exam){
        callback(exam);
    });

};

exports.saveExamPage = function(saveExamPageObj,callback){
    examPageDao.saveExamPage(saveExamPageObj,function(result){
        callback(result);
    });
};

//删除页面
exports.deleteExamPage = function(query,callback){
    examPageDao.deleteExamPage(query,function(result){
        if(result){
            examItemDao.deleteExamItem(query,function(result){//删除页面里的题目
            });
        }
        callback(result);
    });
};

exports.sortExamPages = function(sortItems,callback){
    var startPosition = sortItems.startPosition;
    var sortItemIds = sortItems.sortsItems, isOver=0;
    for(var i=0; i< sortItemIds.length; i++) {
        examPageDao.updateExamPages({pageId : sortItemIds[i]}, {$set:{pagePosition: startPosition + i}}, function (result) {
            isOver++;
            if(isOver == sortItemIds.length){
                callback({success: 'ok'});
            }
        });
    }
};

exports.getExamPageCount = function(query, callback){
    examPageDao.getExamPageCount(query, function(count){
        callback(count);
    });

};

//----------------------------------------------examItem operations-----------------------------------------------------------------------------
exports.saveExamItem = function(examItemDaoObj,callback){
    examItemDao.saveExamItem(examItemDaoObj,function(result){
        callback(result);
    });
};

exports.updateExamItem = function(examItemDaoObj,callback){
    examItemDao.updateExamItem({itemId : examItemDaoObj.itemId}, {$set : examItemDaoObj}, function(data){
        callback(data);
    });
};


//组合试题与答案{userId: user?user.id:'', copyFrom: examId}
var mixItemsAndAnswers = function(query1, query2, examType, items, callback){
    myExamDao.getMyExamAnswer(query1, query2, null, function(result){//获取页里的题目的作答
        if(result && result.length > 0){//作答放入相应题目里
            var myAnswer = result[0].myAnswer;
            if(myAnswer && myAnswer.length > 0){
                var itemAnswers = myAnswer[0].itemAnswers;
                if(itemAnswers && itemAnswers.length > 0){
                    for(var i = 0; i < itemAnswers.length;i++){
                        var itemType = itemAnswers[i].itemType,answer = itemAnswers[i].myAnswer;
                        if(itemType == 'MULTIPLE_CHOICE' || itemType == 'MULTIPLE_RESPONSE' || itemType == 'YES_NO'|| itemType == 'TRUE_FALSE'){
                            var myChoiceIds = answer[0].rightChoiceIds;
                            for(var j=0; j<myChoiceIds.length;j++){
                                items[i].choiceCollection[myChoiceIds[j]-1].isChecked = true;
                            }

                            var feedback = '', currColl = items[i].choiceCollection;
                            for(var j=0; j<currColl.length;j++){
                                feedback += currColl[j].feedback;
                            }

                            if(examType == 'check') {
                                items[i].rightAnswer[0].feedback = feedback;
                                items[i].rightAnswer[0].myScore = answer[0].myScore;
                                items[i].rightAnswer[0].isRight = answer[0].isRight;
                            }
                        }else if(itemType == 'LIKERT'){
                            for(var j=0; j<answer.length;j++){
                                items[i].choiceCollection[answer[j].choiceId-1].myAnswer = answer[j].value;
                            }
                        }else if(itemType == 'SLIDER'){
                            for(var j=0; j<answer.length;j++){
                                items[i].myAnswer = answer[j];
                            }
                        }else if(itemType == 'FILL_IN_BLANK'){
                            for(var j=0; j<answer.length;j++){
                                items[i].blankCollection[answer[j].blankId-1].myAnswer = answer[j].blankValue;

                                if(examType == 'check') {
                                    items[i].blankCollection[answer[j].blankId - 1].myScore = answer[j].myScore;
                                    items[i].blankCollection[answer[j].blankId - 1].isRight = answer[j].isRight;
                                }
                            }
                        }else if(itemType == 'INLINE_CHOICE'){
                            for(var j=0; j<answer.length;j++){
                                var myChoiceIds = answer[j].rightChoiceIds;
                                for(var t=0; t<myChoiceIds.length; t++) {
                                    items[i].choiceCollection[answer[j].inlineChoiceId - 1].inlineChoice[myChoiceIds[t] - 1].isChecked = true;
                                }

                                if(examType == 'check') {
                                    var feedback = '', currColl = items[i].choiceCollection[answer[j].inlineChoiceId - 1].inlineChoice;
                                    for(var t=0; t<currColl.length;t++){
                                        feedback += currColl[t].feedback;
                                    }

                                    items[i].rightAnswer[answer[j].inlineChoiceId - 1].feedback = feedback;
                                    items[i].rightAnswer[answer[j].inlineChoiceId - 1].myScore = answer[j].myScore;
                                    items[i].rightAnswer[answer[j].inlineChoiceId - 1].isRight = answer[j].isRight;
                                }
                            }
                        }else if(itemType == 'OPEN_QUESTION'){
                            for(var j=0; j<answer.length;j++){
                                items[i].myAnswer = answer[j];
                            }
                        }else {
                            console.log('error--无题型：'+itemType);
                        }
                    }
                }
            }
        }
        callback(items);
    });
};

//获取组合试题的统计数据
exports.getExamStatistic = function(query, callback){
    examStatisticDao.getExamStatistic(query, {statisticDate: -1}, function(sDataFromDB){
        if(sDataFromDB.length == 0){//尚未统计
            if(query.statisticType == 'percent'){
                examStatistic({examId: examId, isSubmit: true}, null, null, function(sDataNew) {
                    callback(sDataNew);
                });
            }else{
                examItemsStatistic({examId: examId, isSubmit: true}, null, null, function(sDataNew) {
                    callback(sDataNew);
                });
            }
        }else{//已统计
            callback(sDataFromDB[0]);
        }
    });
};

//获取组合试题的统计数据
var preMixItemsAndStatisticData = function(pageId, examId, items, callback){
    examStatisticDao.getExamStatistic({examId: examId, statisticType: 'choice'},{statisticDate: -1}, function(sDataFromDB){
        if(sDataFromDB.length == 0){//尚未统计
            examItemsStatistic({examId: examId, isSubmit: true}, null, null, function(sDataNew) {
                mixItemsAndStatisticData(pageId, items, sDataNew, callback);
            });
        }else{//已统计
            mixItemsAndStatisticData(pageId, items, sDataFromDB[0], callback);
        }
    });
};

//组合试题与统计数据
var mixItemsAndStatisticData = function(pageId, items, sData, callback){
    if(sData.numbers == 0){
        callback(items);
        return false;
    }
    //statisticData = {'pageId0':{'itemId0':{'A':1},'itemId1':{'1':{'right':1}},'itemId1':{'1':{'A':1}}...}, 'pageId1':{},...}
    var statisticData = sData.statisticData,
        pageSData = statisticData[pageId], statisticDate = sData.statisticDate;
    for(var i=0; i<items.length;i++){
        var itemType = items[i].itemType, itemId = items[i].itemId, itemSData = pageSData[itemId];
        if(itemType == 'MULTIPLE_CHOICE' || itemType == 'MULTIPLE_RESPONSE' || itemType == 'YES_NO'|| itemType == 'TRUE_FALSE' || itemType == 'SLIDER'){
            items[i].statisticData = itemSData;
            items[i].statisticDate = statisticDate;
        }else if(itemType == 'LIKERT'){//itemsStatistic[myAnswerArr[k].pageId][itemAnswers[i].itemId][answer[j].choiceId][value_likert]
            var likertCollection = items[i].choiceCollection;
            for(var j=0; j<likertCollection.length;j++){
                var likertSData = itemSData[likertCollection[j].choiceId];
                likertCollection[j].statisticData = likertSData;
                likertCollection[j].statisticDate = statisticDate;
            }
            items[i].choiceCollection = likertCollection;
        }else if(itemType == 'FILL_IN_BLANK'){
            var blankCollection = items[i].blankCollection;
            for(var j=0; j<blankCollection.length;j++){
                var blankSData = itemSData[blankCollection[j].blankId];
                blankCollection[j].statisticData = blankSData;
                blankCollection[j].statisticDate = statisticDate;
            }
            items[i].blankCollection = blankCollection;
        }else if(itemType == 'INLINE_CHOICE'){
            var choiceCollection = items[i].choiceCollection;
            for(var j=0; j<choiceCollection.length;j++){
                var inlineChoiceSData = itemSData[choiceCollection[j].inlineChoiceId];
                choiceCollection[j].statisticData = inlineChoiceSData;
                choiceCollection[j].statisticDate = statisticDate;
            }
            items[i].choiceCollection = choiceCollection;
        }else if(itemType == 'OPEN_QUESTION'){

        }else {
            console.log('error--无题型：'+itemType);
        }
    }

    callback(items);
};

exports.getExamItems = function(query1, query2, examType, callback){
    examItemDao.getExamItems(query1,function(items){//页里的题目
        if(items && items.length > 0 && examType && examType != 'preShow'){//examType != 'preShow'说明是作答('test)/查看('check')/统计('statistic')考卷场景，需要把作答/统计数据组装进题目里呈现在前台;'preShow'是预览试卷场景
            if(examType == 'statistic'){
                preMixItemsAndStatisticData(query1.pageId, query2.examId, items, callback);
            }else{
                mixItemsAndAnswers(query2, {myAnswer:{$elemMatch:{pageId:query1.pageId}}}, examType, items, callback);
            }

        }else{
            callback(items);
        }
    });
};

exports.deleteExamItem = function(query,callback){
    examItemDao.deleteExamItem(query,function(result){
        callback(result);
    });
};

exports.sortItems = function(sortItems,callback){
    var startPosition = sortItems.startPosition;
    var sortItemIds = sortItems.sortsItems;
    var isOver = 0;
    for(var i=0; i< sortItemIds.length; i++) {
        examItemDao.updateExamItem({itemId : sortItemIds[i]}, {$set:{itemPosition: startPosition + i}}, function (result) {
            isOver++;
            if(isOver == sortItemIds.length) {
                callback(result);
            }
        });
    }
};

//现在暂时没用，思路不对
exports.saveExamItemAnswer = function(answers,callback){
    var isOver = 0;
    for(var i=0; i<answers.length;i++) {
        var currAnswer = answers[i];
        examItemDao.updateExamItem({itemId: currAnswer.itemId}, {$set: {myAnswer: currAnswer.myAnswer}}, function (data) {
            isOver++;
            if(isOver == answers.length) {
                callback(data);
            }
        });
    }
};

exports.exportQTI_AI = function(query,callback){
    examItemDao.getExamItems(query,function(examItem){
        //callback(result);
        if(examItem && examItem.length > 0)
            QTI.exportQTI_AI(examItem[0], callback);
        else
            callback('找不到该题目，无法导出！');
    });
};

exports.importQTI_AI = function(query,callback){
    QTI.importQTI_AI(null, callback);
};

//------------------------------------------------------------------my examination----------------------------------------------------------------
exports.initMyExamAnswer = function(query, initMyExam,callback){
    myExamDao.getMyExamAnswer(query, null, null, function(myExamAnswer){//第二个参数决定是获取试卷级别的作答，还是获取页级别的作答
        if(!myExamAnswer || myExamAnswer.length == 0){
            myExamDao.initMyExamAnswer(initMyExam,function(result){
                callback(result);
            });
        }else{
            myExamDao.updateMyExamAnswer(query, {$set:{lastModify: new Date()}}, function(data){
                callback(data);
            });
        }
    });

};

exports.submitMyExam = function(query, callback){
    myExamDao.updateMyExamAnswer(query, {$set : {isSubmit: true}}, function(result){
        callback(result);
    });
};

exports.updateMyExamAnswer = function(query, myAnswer,callback){
    myExamDao.updateMyExamAnswer(query, {$pull : {myAnswer: {pageId: myAnswer.pageId}}}, function(result){
        if(result){//每当更新作答时，置isCorrected为false，将试卷还原为未批改状态，这样试卷可以做多次
            myExamDao.updateMyExamAnswer(query, {$push : {myAnswer: myAnswer}, $set:{isCorrected: false}}, function(data){
                callback(data);
            });
        }
    });

};

exports.getMyExamAnswer = function(query1, query2, sort, callback){//query2决定是获取试卷级别的作答，还是获取页级别的作答
    myExamDao.getMyExamAnswer(query1, query2, sort, function(myExamAnswer){
        callback(myExamAnswer);
    });
};

var correctMyExam = function(myExamAnswer, isDetailed){
    var myExamReport = {username:'', examName: '', createTime:''};

    myExamReport.username = myExamAnswer.username;
    myExamReport.examName = myExamAnswer.examName;
    myExamReport.createTime = myExamAnswer.createTime;

    var isCorrected = myExamAnswer.isCorrected;//试卷是否批改过，防止每次获取report时都批改，确保只批改一次
    if(!isCorrected || isDetailed == 1) {
        var myAnswer = myExamAnswer.myAnswer;
        if (myAnswer && myAnswer.length > 0) {
            var sumScore = 0, sumMyScore = 0;
            var multiChoiceReport = {itemType: 'MULTIPLE_CHOICE', score: 0, myScore: 0},
                multiResponseReport = {itemType: 'MULTIPLE_RESPONSE', score: 0, myScore: 0},
                yesNoReport = {itemType: 'YES_NO', score: 0, myScore: 0},
                trueFalseReport = {itemType: 'TRUE_FALSE', score: 0, myScore: 0},
                likertReport = {itemType: 'LIKERT', score: 0, myScore: 0},
                sliderReport = {itemType: 'SLIDER', score: 0, myScore: 0},
                inlineChoiceReport = {itemType: 'INLINE_CHOICE', score: 0, myScore: 0},
                fillInBlankReport = {itemType: 'FILL_IN_BLANK', score: 0, myScore: 0},
                OpenQuestionReport = {itemType: 'OPEN_QUESTION', score: 0, myScore: 0};
            for (var j = 0; j < myAnswer.length; j++) {
                var itemAnswers = myAnswer[j].itemAnswers;
                if (itemAnswers && itemAnswers.length > 0) {
                    for (var i = 0; i < itemAnswers.length; i++) {
                        var itemType = itemAnswers[i].itemType, currItemAnswer = itemAnswers[i].myAnswer;
                        if (itemType == 'MULTIPLE_CHOICE') {
                            multiChoiceReport.score += currItemAnswer[0].score;
                            multiChoiceReport.myScore += currItemAnswer[0].myScore;

                            if(!isCorrected || !isDetailed){
                                sumScore += currItemAnswer[0].score;
                                sumMyScore += currItemAnswer[0].myScore;
                            }
                        } else if (itemType == 'MULTIPLE_RESPONSE') {
                            multiResponseReport.score += currItemAnswer[0].score;
                            multiResponseReport.myScore += currItemAnswer[0].myScore;

                            if(!isCorrected || !isDetailed){
                                sumScore += currItemAnswer[0].score;
                                sumMyScore += currItemAnswer[0].myScore;
                            }
                        } else if (itemType == 'YES_NO') {
                            yesNoReport.score += currItemAnswer[0].score;
                            yesNoReport.myScore += currItemAnswer[0].myScore;

                            if(!isCorrected || !isDetailed){
                                sumScore += currItemAnswer[0].score;
                                sumMyScore += currItemAnswer[0].myScore;
                            }
                        } else if (itemType == 'TRUE_FALSE') {
                            trueFalseReport.score += currItemAnswer[0].score;
                            trueFalseReport.myScore += currItemAnswer[0].myScore;

                            if(!isCorrected || !isDetailed){
                                sumScore += currItemAnswer[0].score;
                                sumMyScore += currItemAnswer[0].myScore;
                            }
                        } else if (itemType == 'LIKERT') {

                        } else if (itemType == 'SLIDER') {

                        } else if (itemType == 'FILL_IN_BLANK') {
                            for (var t = 0; t < currItemAnswer.length; t++) {
                                fillInBlankReport.score += currItemAnswer[t].score;
                                fillInBlankReport.myScore += currItemAnswer[t].myScore;

                                if(!isCorrected || !isDetailed){
                                    sumScore += currItemAnswer[t].score;
                                    sumMyScore += currItemAnswer[t].myScore;
                                }
                            }
                        } else if (itemType == 'INLINE_CHOICE') {
                            for (var t = 0; t < currItemAnswer.length; t++) {
                                inlineChoiceReport.score += currItemAnswer[t].score;
                                inlineChoiceReport.myScore += currItemAnswer[t].myScore;

                                if(!isCorrected || !isDetailed){
                                    sumScore += currItemAnswer[t].score;
                                    sumMyScore += currItemAnswer[t].myScore;
                                }
                            }
                        } else if (itemType == 'OPEN_QUESTION') {

                        } else {
                            console.log('error--无题型：' + itemType);
                        }
                    }


                }
            }

            if(isDetailed == 1) {
                myExamReport.itemReports = [];
                myExamReport.itemReports.push(multiChoiceReport);
                myExamReport.itemReports.push(multiResponseReport);
                myExamReport.itemReports.push(yesNoReport);
                myExamReport.itemReports.push(trueFalseReport);
                myExamReport.itemReports.push(likertReport);
                myExamReport.itemReports.push(sliderReport);
                myExamReport.itemReports.push(inlineChoiceReport);
                myExamReport.itemReports.push(fillInBlankReport);
                myExamReport.itemReports.push(OpenQuestionReport);
            }else{
                myExamReport.sumMyScore = sumMyScore;
                myExamReport.sumScore = sumScore;
            }

            if(!isCorrected){//保存批改结果
                myExamDao.updateMyExamAnswer(query, {$set : {sumScore: sumScore, sumMyScore: sumMyScore, isCorrected: true}}, function(data){
                    if(data) {
                        //callback(myExamReport);
                        return myExamReport;
                    }
                });
            }
        }
    }else{
        myExamReport.sumMyScore = myExamAnswer.sumMyScore;
        myExamReport.sumScore = myExamAnswer.sumScore;
    }

    if(isCorrected) {
        //callback(myExamReport);
        return myExamReport;
    }
};

var examStatistic = function(query, callback){
    myExamDao.getMyExamAnswer(query, null, null, function (myExamAnswers) {//获取试卷作答
        var examStatisticData = {le60:0, '60~70':0, '70~80':0, '80~90':0, '90~100':0};
        for(var i = 0; i< myExamAnswers.length; i++){
            var currExamStatistic = correctMyExam(myExamAnswers[i], 0);
            var myPercent = Math.round((currExamStatistic.myScore/currExamStatistic.score)*100*100)/100;
            if(myPercent <= 60){
                examStatisticData['le60'] ++;
            }else if(myPercent > 60 && myPercent <= 70){
                examStatisticData['60~70'] ++;
            }else if(myPercent > 70 && myPercent <= 80){
                examStatisticData['70~80'] ++;
            }else if(myPercent > 80 && myPercent <= 90){
                examStatisticData['80~90'] ++;
            }else{
                examStatisticData['90~100'] ++;
            }
        }

        var examStatistic = {
            examId : query.examId,
            statisticType : 'percent',//choice: 选项统计；percent: 试卷正确率统计
            numbers : myExamAnswers.length, //统计人数
            statisticDate : new Date(),//统计时间
            startDate : '',//统计取样时间范围
            endDate : '',
            statisticData : examStatisticData
        };
        examStatisticDao.saveExamStatistic(examStatistic, function(result){
            callback(examStatistic);
        });
    });
};

exports.getMyExamReportData = function(query, isDetailed, callback){
    myExamDao.getMyExamAnswer(query, null, null, function (result) {//获取试卷作答
        if (result && result.length > 0) {
            var currExamStatistic = correctMyExam(result[0], isDetailed);
            callback(currExamStatistic);
        }else{
            callback(null);
        }
    });
};

exports.getExamStatisticData = function(query, callback){//choice:试题每一项级别的统计;percent:试卷考试结果分布情况
    examStatisticDao.getExamStatistic({examId: query.examId, statisticType: 'percent'},{statisticDate: -1}, function(sDataFromDB){
        if(sDataFromDB.length == 0){//尚未统计
            examStatistic(query, function(sDataNew) {
                //mixItemsAndStatisticData(pageId, items, sDataNew, callback);
                callback(sDataNew);
            });
        }else{//已统计
            //mixItemsAndStatisticData(pageId, items, sDataFromDB[0], callback);
            callback(sDataFromDB[0]);
        }
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
