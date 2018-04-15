/**
 * Created by xh on 7/17/2015.
 */
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var parseString = require('xml2js').parseString;
var message = require('../_utils/messageGenerator.js');
var processFileDao = new (require('./ProcessFileDao.js'))('graphMetaData');
var boardFileDao = new (require('./ProcessFileDao.js'))('boardUser');
var updateLogDao = new (require('./ProcessFileDao.js'))('courseUpdateLog');

exports.save = function (id, name, graphXml, fileType, saveNewFile, user,fileDesc,taskFileId,chatHistory, fileIcon,categoryId,next) {
    var resData;
    if (saveNewFile === 'true' ) {
        //insert
        processFileDao.fileNameIsExist(name,user,fileType,function(doc){
            if(doc.length>0){
                next(message.genSimpSuccessMsg('exist',null));
            }else{
                var id = uuid.v1();
                fs.writeFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), graphXml, 'utf-8', function (err) {
                    if (err) {
                        next(message.genSysErrMsg(err));
                        throw err;
                    } else {
                        var stat = fs.statSync(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'));
                        var size = stat.size;
                        var graphMetaData = {
                            id: id,
                            fileName: name,
                            createTime: new Date(),
                            lastModify: new Date(),
                            size: size,
                            isDeleted: false,
                            fileType: fileType,
                            fileDesc:fileDesc,
                            fileIcon:fileIcon,
                            categoryId:categoryId,
                            taskFileId: taskFileId,
                            chatHistory:chatHistory,
                            userId: user.id,
                            userName: user.name
                        };
                        if(graphMetaData.taskFileId == null){
                            delete graphMetaData.taskFileId;
                        }
                        if(graphMetaData.chatHistory == null){
                            delete graphMetaData.chatHistory;
                        }
                        processFileDao.insertNew(graphMetaData, function (resData) {
                            resData = {
                                gFileId: resData.ops[0].id,
                                fileName: resData.ops[0].fileName,
                                createTime: resData.ops[0].createTime,
                                lastModify: resData.ops[0].lastModify,
                                size: resData.ops[0].size,
                                isDeleted: resData.ops[0].isDeleted,
                                fileType: fileType,
                                fileDesc:resData.ops[0].fileDesc,
                                fileIcon:resData.ops[0].fileIcon,
                                categoryId:resData.ops[0].categoryId,
                                chatHistory:resData.ops[0].chatHistory,
                                userId: resData.ops[0].userId,
                                userName: resData.ops[0].userName
                            };
                            if(resData.taskFileId == null){
                                delete resData.taskFileId;
                            }
                            if(resData.chatHistory == null){
                                delete resData.chatHistory;
                            }
                            var logObj = {
                                fileId:resData.gFileId,
                                fileName:resData.fileName,
                                fileType:fileType,
                                userId:user.id,
                                userName: user.name
                            };
                            updateLogDao.courseLog('create',logObj, function (data) {
                                if(data){
                                    next(message.genSimpSuccessMsg('save success', resData));
                                }
                            });
                        })
                    }
                });
            }
        });
    } else {
        //update
        if (id !== '' && id !== undefined && id !== null) {
            if (fileType === 'task_design') {
                if(chatHistory){
                    //delete chatHistory.chatRoom;
                    var newMsgs = chatHistory.msgObj;
                    processFileDao.updateChatHistory(id,newMsgs,function(data){
                        next(message.genSimpSuccessMsg('update chat information success',data));
                    });
                }else{
                    //boardFileDao.checkBoardUser(id, user, function (doc) {
                    //    if (doc) {
                    processFileDao.findFileByIdUnderAccount1(id, function (doc) {
                        if (doc) {
                            fs.writeFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), graphXml, 'utf-8', function (err) {
                                if (err) {
                                    next(message.genSysErrMsg(err));
                                    throw err;
                                } else {
                                    var stat = fs.statSync(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'));
                                    var size = stat.size;
                                    processFileDao.updateById(id, function (data) {
                                        if (data) {
                                            boardFileDao.updateBoardById(id, user, function (data) {
                                                if (data){
                                                    next(message.genSimpSuccessMsg('save success', null));
                                                }
                                            })
                                        }
                                    });
                                }
                            });
                        } else {
                            processFileDao.findFileByIdUnderAccount(id, user, function (data) {
                                if (data) {
                                    fs.writeFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), graphXml, 'utf-8', function (err) {
                                        if (err) {
                                            next(message.genSysErrMsg(err));
                                            throw err;
                                        } else {
                                            var stat = fs.statSync(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'));
                                            var size = stat.size;
                                            processFileDao.updateById(id, function (data) {
                                                if (data) {
                                                    var logObj = {
                                                        fileId:id,
                                                        fileName: name,
                                                        fileType:fileType,
                                                        userId:user.id,
                                                        userName: user.name
                                                    };
                                                    updateLogDao.courseLog('update',logObj, function (data) {
                                                        if(data){
                                                            next(message.genSimpSuccessMsg('save success', null));
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    next(message.genSimpFailedMsg('not exist', null));
                                }
                            });
                        }
                    });
                    //} else {
                    //    next(message.genSimpFailedMsg('no ', null))
                    //}
                    //});
                }

            } else if (fileType === 'process_design'||fileType === 'subject_design' || fileType === 'ople_design' || fileType === 'ople2_design'|| fileType === 'course_design') {
                processFileDao.findFileByIdUnderAccount(id, user, function (data) {
                    if (data) {
                        fs.writeFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), graphXml, 'utf-8', function (err) {
                            if (err) {
                                next(message.genSysErrMsg(err));
                                throw err;
                            } else {
                                var stat = fs.statSync(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'));
                                var size = stat.size;
                                processFileDao.updateById(id, function (data) {
                                    if (data) {
                                        var logObj = {
                                            fileId:id,
                                            fileName:name,
                                            fileType:fileType,
                                            userId:user.id,
                                            userName: user.name
                                        };
                                        updateLogDao.courseLog('update',logObj, function (data) {
                                            if(data){
                                                next(message.genSimpSuccessMsg('save success', null));
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    }
};

exports.loadFile = function (id, userData, next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), 'utf-8', function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg('delete', null));
            //throw err;
        } else {
            if (userData) {
                //test for board-user
                boardFileDao.checkBoardUser(id, userData, function (doc) {
                    if (doc) {
                        processFileDao.findFileByIdUnderAccount1(id, function (doc) {
                            if (doc) {
                                var resData = {
                                    gFileId: id,
                                    taskFileId: doc.taskFileId,
                                    fileName: doc.fileName,
                                    fileType:doc.fileType,
                                    size: doc.size,
                                    createTime: doc.createTime,
                                    lastModify: doc.lastModify,
                                    userId: doc.userId,
                                    userName: doc.userName,
                                    chatHistory:(doc.chatHistory)?doc.chatHistory:null,
                                    xml: data
                                };
                                next(message.genSimpSuccessMsg('', resData));
                            } else {
                                next(message.genSimpFailedMsg('not exist', null))
                            }
                        });
                    } else {
                        processFileDao.findFileByIdUnderAccount(id, userData, function (doc) {
                            if (doc) {
                                var resData = {
                                    gFileId: id,
                                    taskFileId: doc.taskFileId,
                                    fileName: doc.fileName,
                                    fileType:doc.fileType,
                                    size: doc.size,
                                    createTime: doc.createTime,
                                    lastModify: doc.lastModify,
                                    userId: doc.userId,
                                    userName: doc.userName,
                                    xml: data
                                };
                                next(message.genSimpSuccessMsg('', resData));
                            } else {
                                next(message.genSimpFailedMsg('not exist', null))
                            }
                        });
                    }
                });
                //end test

                //processFileDao.findFileByIdUnderAccount(id, userApi.userData, function (doc) {
                //    if (doc) {
                //        var resData = {
                //            gFileId: id,
                //            fileName: doc.fileName,
                //            size: doc.size,
                //            createTime: doc.createTime,
                //            lastModify: doc.lastModify,
                //            userId: doc.userId,
                //            userName: doc.userName,
                //            xml: data
                //        };
                //        next(message.genSimpSuccessMsg('', resData));
                //    } else {
                //        next(message.genSimpFailedMsg('not exist', null))
                //    }
                //});

                //} else {
                //    processFileDao.findFileByIdUnderAccount1(id, function (doc) {
                //        if (doc) {
                //            var resData = {
                //                gFileId: id,
                //                fileName: doc.fileName,
                //                size: doc.size,
                //                createTime: doc.createTime,
                //                lastModify: doc.lastModify,
                //                userId: doc.userId,
                //                userName: doc.userName,
                //                xml: data
                //            };
                //            next(message.genSimpSuccessMsg('', resData));
                //        } else {
                //            next(message.genSimpFailedMsg('not exist', null))
                //        }
                //    });
            }
        }
    });
};

exports.loadAllUserOfBoard = function (boardId, userData, next) {
    if (userData) {
        boardFileDao.checkBoardUser(boardId, userData, function (data) {
            if (data) {
                boardFileDao.findAllUserOfBoard(boardId, function (data) {
                    if (data) {
                        /*var userData = [];
                         for (var i = 0; i < data.length; i++) {
                         userData.push(data[i].userData);
                         }*/
                        next(message.genSimpSuccessMsg('', data));
                    } else {
                        next(message.genSimpFailedMsg('not exist', null));
                    }
                })
            } else {
                //我不知道当时为什么要这么写了==
                processFileDao.findFileByIdUnderAccount(boardId, userData, function (data) {
                    if (data) {
                        var userData = [];
                        for (var i = 0; i < data.length; i++) {
                            userData.push(data[i].userData);
                        }
                        next(message.genSimpSuccessMsg('', userData));
                    } else {
                        next(message.genSimpFailedMsg('not exist', null));
                    }
                })
            }
        })
    }
};
exports.removeAllUserOfBoard = function (boardId, userData, next) {
    if (userData) {
        boardFileDao.checkBoardUser(boardId, userData, function (data) {
            if (data) {
                boardFileDao.deleteRecord({'boardId':boardId}, function (data) {
                    if (data) {
                        next(message.genSimpSuccessMsg('success', data));
                    } else {
                        next(message.genSimpFailedMsg('not exist', null));
                    }
                })
            } else{
                next(message.genSimpFailedMsg('没有权限', null));
            }
        })
    }
};
exports.saveNewBoardUsers = function (boardId, addArr, userType, user, next) {
    //check if current user is creator or not (will be changed to check it in the db of "quanxian")
    processFileDao.findFileByIdUnderAccount(boardId, user, function (data) {
        if (data) {
            var count = 0;
            var resDatas = [];
            for (var i = 0; i < addArr.length; i++){
                var saveObj = {
                    "boardId": boardId,
                    "userData": addArr[i],
                    "userType": userType,
                    "joinTime": new Date()
                };
                boardFileDao.saveNew(saveObj, function (resData) {
                    if (resData) {
                        count++;
                        resDatas.push(resData.ops[0]);
                        if (count === addArr.length) {
                            next(message.genSimpSuccessMsg('save success',resDatas));
                        }
                        //next(message.genSimpSuccessMsg('save success', resData));
                    } else{
                        next(message.genSimpFailedMsg('failed to save', null));
                    }
                })
            }
        }
    });
};
exports.delBoardUsers = function (boardId, delArr, user, next) {
    //check if current user is creator or not (will be changed to check it in the db of "quanxian")
    processFileDao.findFileByIdUnderAccount(boardId, user, function (data) {
        if (data) {
            var count = 0;
            for (var i = 0; i < delArr.length; i++){
                var delObj = {
                    "boardId": boardId,
                    "userData.id": delArr[i]
                };
                boardFileDao.delBoardUser(delObj, function (resData) {
                    if (resData) {
                        count++;
                        if (count === delArr.length) {
                            next(message.genSimpSuccessMsg('delete success',true));
                        }
                    } else{
                        next(message.genSimpFailedMsg('failed to delete', null));
                    }
                })
            }
        }
    });
};
exports.changeBoardUserType = function (boardId, changeArr, user, next) {
    var count = 0;
    for (var i = 0; i < changeArr.length; i++){
        var delObj = {
            "boardId": boardId,
            "userData.id": changeArr[i].userId
        };
        var setObj = {
            $set: {
                "userType" : changeArr[i].newType
            }
        };
        boardFileDao.updateAndResMessage(delObj, setObj, function (resData) {
            if (resData.success) {
                count++;
                if (count === changeArr.length) {
                    next(message.genSimpSuccessMsg('update success',true));
                }
            } else{
                next(message.genSimpFailedMsg('failed to update', null));
            }
        })
    }
};
exports.loadBoardUserInfo = function (boardId, userId, next) {
    if (boardId && userId) {
        boardFileDao.checkBoardUser(boardId, {id: userId}, function (data) {
            if (data) {
                next(message.genSimpSuccessMsg('success', data));
            } else {
                next(message.genSimpSuccessMsg('no result', null))
            }
        })
    } else {
        next(message.genSimpFailedMsg('lack of data', null));
    }
};
exports.updateFileMetaData = function(updateQuery, updateData, next){
    console.log('update');
    processFileDao.updateMultiRecords(updateQuery, updateData, function(err, resData){
        if(err){
            next(message.genSimpFailedMsg('putFileMetaData', null))
        }else{
            next(message.genSimpSuccessMsg('', resData));
        }
    });
};

exports.findAllTopProcess=function(next){
    processFileDao.findAllTopProcess(function(data){
        if(data.length>0){
            next(message.genSimpSuccessMsg('allTopProcess',data));
        }else{
            next(message.genSimpFailedMsg('noTopProcess',null));
        }
    });
};

exports.loadAllFileByTrashFlag = function(user,isOut, fileType,next){
    var findObj = {
        isDeleted: !isOut,
        userId: user.id,
        fileType: fileType
    };
    if (fileType === 'process_design') {
        findObj = {
            $or: [
                {
                    isDeleted: {$ne: isOut},
                    userId: user.id,
                    fileType: fileType
                },{
                    isDeleted: {$ne: isOut},
                    userId: user.id,
                    fileType: {$exists: false}
                }
            ]
        }
    }
    processFileDao.findAllByTrashFlagUnderAccount(findObj,function(allFiles){
        var changeFiles=[];
        var count = 0;
        if(allFiles.length > 0){
            for(var i=0;i<allFiles.length;i++){
                var test={
                    gFileId:allFiles[i].id,
                    taskFileId: allFiles[i].taskFileId,
                    fileName: allFiles[i].fileName,
                    size:allFiles[i].size,
                    createTime:allFiles[i].createTime,
                    lastModify:allFiles[i].lastModify,
                    isDeleted: allFiles[i].isDeleted,
                    userId: allFiles[i].userId,
                    userName: allFiles[i].userName,
                    fileType:allFiles[i].fileType,
                    chatHistory:allFiles[i].chatHistory?allFiles[i].chatHistory:null,
                    isPublished:allFiles[i].isPublished
                };
                changeFiles.push(test);
                boardFileDao.findOneBoardById(i, allFiles[i].id, function(data, num){
                    if (data) {
                        console.log(data);
                        changeFiles[num].isShared = true;
                    }
                    count++;
                    if (count === allFiles.length) {
                        next(message.genSimpSuccessMsg('', changeFiles));
                    }
                });
            }
        } else {
            next(message.genSimpSuccessMsg('', allFiles));
        }
    });
};
//[moved]
exports.removeFiles = function(idArray,next){
    var resultArray = [];
    var count1 = 0;
    var count2 = 0;
    if(!(idArray instanceof Array)){
        idArray=[idArray];
    }
    for (var i = 0; i < idArray.length; i++) {
        fs.unlink(path.join(__dirname, '../../_static_content/BPMN_files/trash/' + idArray[i] + '.xml'), function (err) {
            if (err) {
                next(message.genSysErrMsg(err));
                throw err;
            } else {
                count1++;
                processFileDao.removeById(idArray[count1 - 1], function (result) {
                    count2++;
                    if(result){
                        resultArray.push(result);
                        if (count2 == idArray.length) {
                            next(message.genSimpSuccessMsg('', resultArray));
                        }
                    }
                });
            }
        });
    }
};

var instanceService = require('./instanceService.js');
var toTrashModelById = function (id, next) {
    instanceService.loadInstanceOfProcess(id, false, function (resMsg) {
        if (resMsg.success){
            var idArray = [];
            for (var i = 0; i < resMsg.data.length; i++){
                idArray.push(resMsg.data[i].gFileId);
            }
            if (idArray.length > 0){
                instanceService.trashInstances(idArray, function (resRemoveMsg) {
                    if (resRemoveMsg.success){
                        processFileDao.toTrashById(id, function (resRemoveModelMsg) {
                            next(message.genSimpSuccessMsg('', resRemoveModelMsg));
                        });
                    }
                })
            } else {
                processFileDao.toTrashById(id, function (resRemoveModelMsg) {
                    next(message.genSimpSuccessMsg('', resRemoveModelMsg));
                });
            }
        }
    })
};

exports.trashFiles = function (idArray, next) {
    var resultArray = [];
    var count1 = 0;
    var count2 = 0;
    if(!(idArray instanceof Array)){
        idArray=[idArray];
    }
    for (var i = 0; i < idArray.length; i++) {
        fs.rename(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + idArray[i] + '.xml'), path.join(__dirname, '../../_static_content/BPMN_files/trash/' + idArray[i] + '.xml'), function (err) {

            if (err) {
                next(message.genSysErrMsg(err));
                throw err;
            } else {
                count1++;
                //processFileDao.toTrashById(idArray[count1 - 1], function (result) {
                toTrashModelById(idArray[count1 - 1], function (result) {
                    count2++;
                    if (result) {
                        resultArray.push(result);
                        if (count2 == idArray.length) {
                            next(message.genSimpSuccessMsg('', resultArray));
                        }
                    }
                });
            }
        });
    }
};
//[moved]
exports.restoreFiles=function(idArray, next){
    var resultArray = [];
    var count1 = 0;
    var count2 = 0;
    if(!(idArray instanceof Array)){
        idArray=[idArray];
    }
    for (var i = 0; i < idArray.length; i++) {
        fs.rename(path.join(__dirname, '../../_static_content/BPMN_files/trash/' + idArray[i] + '.xml'), path.join(__dirname, '../../_static_content/BPMN_files/normal/' + idArray[i] + '.xml'), function (err) {

            if (err) {
                next(message.genSysErrMsg(err));
                throw err;
            } else {
                count1++;
                processFileDao.restoreById(idArray[count1 - 1], function (result) {
                    count2++;
                    if (result) {
                        resultArray.push(result);
                        if (count2 == idArray.length) {
                            next(message.genSimpSuccessMsg('', resultArray));
                        }
                    }
                });
            }
        });
    }
};

exports.renameFile = function (id, name,user,fileType, next) {
    processFileDao.fileNameIsExist(name,user,fileType,function(doc){
        if(doc.length > 0){
            next(message.genSimpFailedMsg('exist',null));
        }else{
            processFileDao.renameById(id, name,function (result) {
                if(result){
                    next(message.genSimpSuccessMsg('renameSuccess', result));

                }
            });
        }
    });
};

exports.findByLikeName = function (filename,user, next) {
    processFileDao.findFileByLikeNameUnderAccount(filename,user,function (result) {
        if (result) {
            next(result);
        }
    });
};
exports.findUserBoard = function (userId, next) {
    boardFileDao.findAllUserBoard(userId,function (resData) {
        if (resData) {
            for (var i = 0; i < resData.length; i ++) {
                var boardDatas = [];
                processFileDao.findFileByIdUnderAccount1(resData[i].boardId, function (boardData) {
                    if(boardData){
                        var test= {
                            gFileId: boardData.id,
                            fileName: boardData.fileName,
                            size: boardData.size,
                            createTime: boardData.createTime,
                            lastModify: boardData.lastModify,
                            isDeleted: boardData.isDeleted,
                            userId: boardData.userId,
                            userName: boardData.userName,
                            fileType:boardData.fileType,
                            chatHistory:(boardData.chatHistory)?boardData.chatHistory:null
                        };
                        boardDatas.push(test);
                        if (boardDatas.length === resData.length) {
                            next(message.genSimpSuccessMsg('success', boardDatas));
                        }
                    }
                });
            }
        }
    });
};
exports.addFileType_temp = function (next) {
    processFileDao.findByQuery(null, function (fileArray) {
        var count1 = 0;
        var count2 = 0;
        for (var i = 0; i < fileArray.length; i++) {
            boardFileDao.findAndDeliver_temp({boardId:fileArray[i].id}, i, function (num, data) {
                if (data.length) {
                    processFileDao.updateObj({id: fileArray[num].id, fileType: {$exists: false}}, {$set: {"fileType" : "task_design"}}, function () {
                        count1++;
                        if (count1 + count2 === fileArray.length) {
                            next(count1, count2);
                        }
                    })
                } else {
                    processFileDao.updateObj({id: fileArray[num].id, fileType: {$exists: false}}, {$set: {"fileType": "process_design"}}, function () {
                        count2++;
                        if (count1 + count2 === fileArray.length) {
                            next(count1, count2);
                        }
                    })
                }
            })
        }
    })
};
exports.findChatHistory=function(gFileId,next){
    processFileDao.findChatHistory(gFileId,function(data){
        if(data){
            next(data);
        }
    });
};
exports.loadOneModelFile = function(fileId,next){
    processFileDao.loadOneModelFile(fileId,function(data){
        if(data){
            next(message.genSimpSuccessMsg('findOne',data));
        }
    })
};
exports.updateOneModelFile = function(fileId,fileName,fileDesc,fileIcon,categoryId,next){
    processFileDao.loadOneModelFile(fileId,function(doc){
        if(doc){
            if(doc.fileType === 'process_design'){
                processFileDao.updateOneModelFile(fileId,fileName,fileDesc,function(data){
                    if(data){
                        next(message.genSimpSuccessMsg('updateSuccess',data));
                    }
                });
            }else{
                processFileDao.updateOneTaskFile(fileId,fileName,fileDesc,fileIcon,categoryId,function(data){
                    if(data){
                        next(message.genSimpSuccessMsg('updateSuccess',data));
                    }
                });
            }
        }
    })
};
exports.taskToProcess = function(taskFileId,next){
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + taskFileId + '.xml'),'utf-8',function(err,data){
        if(err){
            next(message.genSimpFailedMsg('read task file error'),null);
        }else{
            var graphXml = [];
            var reqBodyStr = JSON.stringify({data:data});
            var reqData = JSON.parse(reqBodyStr);
            graphXml[0] = reqData.data;
            var obj;
            parseString(graphXml[0],{explicitArray:false},function(err,result){
                obj = result;
            });
            var figures = obj.mxGraphModel.root.ecCell;
            var taskGroupArr = [];
            var subTaskArr = [];
            if(figures.length){
                //找出所有的任务类组以及子任务
                for(var i = 0; i < figures.length; i++){
                    if(figures[i].$.type){
                        if(figures[i].$.type === 'task_design.taskGroup'){
                            var taskGroupObj = {
                                id : figures[i].$.id,
                                label : figures[i].$.label,
                                location : figures[i].mxCell.mxGeometry.$.y + 10000 + figures[i].mxCell.mxGeometry.$.x
                            };
                            taskGroupArr.push(taskGroupObj);
                        }else if(figures[i].$.type === 'task_design.subTask'){
                            var subTaskObj = {
                                parent : figures[i].mxCell.$.parent,
                                id : figures[i].$.id,
                                label : figures[i].$.label,
                                location : figures[i].mxCell.mxGeometry.$.y
                            };
                            subTaskArr.push(subTaskObj);
                        }
                    }
                }
                //将任务类组与其对应的子任务放在一起
                for(var i = 0; i < taskGroupArr.length; i++){
                    var groupSubTaskArr = [];
                    for(var j = 0 ; j < subTaskArr.length; j++){
                        if(taskGroupArr[i].id === subTaskArr[j].parent ){
                            groupSubTaskArr.push(subTaskArr[j]);
                        }
                    }
                    var temp;
                    for(var j = 0 ; j < groupSubTaskArr.length-1; j++){
                        if(parseInt(groupSubTaskArr[j].location) > parseInt(groupSubTaskArr[j+1].location)){
                            temp = groupSubTaskArr[j];
                            groupSubTaskArr[j] = groupSubTaskArr[j+1];
                            groupSubTaskArr[j+1] = temp;
                        }
                    }
                    taskGroupArr[i].subTask = groupSubTaskArr;
                }
                console.log(taskGroupArr.length);
            }
            next(message.genSimpSuccessMsg('parse task xml success',taskGroupArr));
        }
    });
};

exports.loadAllUserFiles = function(isPublished, fileType, categoryId, ctClass, auth, next){
    var findObj = {
        isDeleted: false,
        fileType: fileType
    };
    if(isPublished=='true'){
        findObj['isPublished']=true;
    }else if(isPublished=='false'){
        findObj['isPublished']={$ne: true};
    }
    this.getCategoryTrees(auth, function (categoryTrees) {
        //课程分类 （必须放在最后，因为findObj可能变为or类型）
        if (categoryId && ctClass){
            var findNode = function (num, trees) {
                if (num === ctClass){
                    for (var i = 0; i < trees.length; i++){
                        if (trees[i].value === categoryId){
                            return trees[i];
                        }
                    }
                    return false;
                }else {
                    for (var i = 0; i < trees.length; i++){
                        if (trees[i].child && trees[i].child.length > 0){
                            var result = findNode(num+1, trees[i].child);
                            if (result) {
                                return result;
                            }
                        }
                    }
                }
            };
            var selectedNode = findNode(1, categoryTrees);
            if(selectedNode){
                if (selectedNode.child && selectedNode.child.length > 0){
                    var findOrArr = [];
                    var findLeaves = function (trees) {
                        for (var j = 0; j < trees.length; j++){
                            if (trees[j].child && trees[j].child.length > 0){
                                findLeaves(trees[j].child);
                            } else {
                                //叶子
                                var oriFindObj = {};
                                for (var key in findObj){
                                    oriFindObj[key] = findObj[key];
                                }
                                oriFindObj['categoryId']=trees[j].value;
                                findOrArr.push(oriFindObj);
                            }
                        }
                    };
                    findLeaves(selectedNode.child);
                    if (findOrArr.length > 0){
                        findObj = {$or: findOrArr};
                        console.log(findOrArr.length)
                    } else {//没有叶子，这不可能。。。
                    }
                }else {
                    //该类为叶子
                    findObj['categoryId']=categoryId;
                }
            } else {
                //没找到该类
                next(message.genSimpFailedMsg('not_find_category', null));
                return;
            }
        }
        processFileDao.findAndResMessage(findObj,function(msg){
            var fileArr=[];
            if(msg.success && msg.data.length > 0){
                var allFiles = msg.data;
                for(var i=0;i<allFiles.length;i++){
                    var oneFile={
                        "courseId": allFiles[i].id,
                        "courseName": allFiles[i].fileName,
                        "detailDes":allFiles[i].fileDesc,
                        "courseCreator":{
                            "username": allFiles[i].userName,
                            "id": allFiles[i].userId
                        },
                        "createTime": allFiles[i].createTime,
                        "fileType":allFiles[i].fileType,
                        "posterImage":"fz designing",//课程封面的路径或者ID
                        "fileIcon" : allFiles[i].fileIcon,//课程封面
                        "categoryId" : allFiles[i].categoryId,//课程分类id
                        "isPublished": allFiles[i].isPublished,//是否发布
                        "publishModifyTime":allFiles[i].publishModifyTime,//发布/取消发布的时间
                        "publishPermission":allFiles[i].publishPermission,//发布范围
                        "chosenTimes":"fz designing",//选课次数
                        "grade":"fz designing",//课程等级
                        "Evaluation":"fz designing"//课程评价
                        //...其他课程的信息
                    };
                    fileArr.push(oneFile);
                }
                next(message.genSimpSuccessMsg('', fileArr));
            } else {
                next(message.genSimpFailedMsg('', null));
            }
        });
    });
};
exports.getModelIdArr = function(fileId, next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + fileId + '.xml'), 'utf-8', function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg('deleted', null));
            //throw err;
        } else {
            var graphXml = [];
            var reqBodyStr = JSON.stringify({data:data});
            var reqData = JSON.parse(reqBodyStr);
            graphXml[0] = reqData.data;
            var obj;
            parseString(graphXml[0], {explicitArray: false}, function (err, result) {
                obj = result;
            });
            var figures = obj.mxGraphModel.root.ecCell;
            var modelIdArr = [];
            if (figures){
                for (var i = 0; i < figures.length; i++) {
                    if(figures[i].$.type === 'bpmn.subprocess.call' && figures[i].$.subProcessId) {
                        modelIdArr.push(figures[i].$.subProcessId);
                    }
                }
                next(message.genSimpSuccessMsg('', modelIdArr));
            }
        }
    })
};

exports.changePublicState = function (fileId,permission, userId, next) {
    processFileDao.findFileByIdUnderAccount(fileId, {"id" : userId}, function (result) {
        if(result) {
            var isPublished = (result.isPublished) ? (!result.isPublished) : true;
            var setObj = {};
            if (permission === 'false'){
                setObj = {"isPublished":isPublished,"publishModifyTime":new Date(),"publishPermission": void 0};
            } else {
                setObj = {"isPublished":isPublished,"publishModifyTime":new Date(),"publishPermission":permission}
            }
            processFileDao.updateObj({"id": fileId}, {$set: setObj}, function (result) {
                if(result) {
                    next(message.genSimpSuccessMsg('save success', null));
                }
            })
        }
    })

};
exports.getDocOfXml = function(fileId, next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + fileId + '.xml'), 'utf-8', function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg('deleted', null));
            //throw err;
        } else {
            var graphXml = [];
            var reqBodyStr = JSON.stringify({data:data});
            var reqData = JSON.parse(reqBodyStr);
            graphXml[0] = reqData.data;
            var obj;
            parseString(graphXml[0], {explicitArray: false}, function (err, result) {
                obj = result;
            });
            var nodes = obj.mxGraphModel.root.ecCell;
            var edges = obj.mxGraphModel.root.mxCell;
            var tasks = {};
            var taskArr = [];
            var indexArr = [];
            for (var i = 0; i < nodes.length; i++){
                if(nodes[i].$.type ==='bpmn.gateway.general.start'){
                    indexArr.push(nodes[i].$.id);
                } else if (nodes[i].$.type ==='bpmn.task.user'){
                    tasks[nodes[i].$.id] = nodes[i].$;
                }
            }
            for (var i = 0; i < nodes.length; i++){
                for (var j = 0; j < edges.length; j++){
                    if (edges[j].$.edge){
                        if(edges[j].$.source === indexArr[i]){
                            indexArr[i+1]=edges[j].$.target;
                            break;
                        }
                    }
                }
            }
            for (var i = 1; i < indexArr.length-1; i++){
                taskArr.push(tasks[indexArr[i]]);
            }
            //next(getDoc(taskArr));
            next(taskArr);
        }
    });
    var getDoc = function (arr) {
        var docArr = [];
        for(var i = 0; i < arr.length; i++){
            var issue = {};
            issue['任务名']=arr[i].label;
            issue['基本信息']=arr[i].basicInfo;
            issue['行动设计']=arr[i].workbench;
            docArr.push(issue);
        }
        return docArr
    }
};
var serverCommunication = require('../_utils/communication.js');
exports.getCategoryTrees = function(auth, next) {
    var path = '/getCourseType';
    //oc abandoned in v2.1;
    //var path = '/index.php/apps/courseplayer/getCourseTypes';
    serverCommunication.OrgServer(null, 'get', path, '', null, "application/json", function (data) {
        if (data){
            /*var categoryTrees = [
                {
                    value:'f4d54935-6b68-11e6-882e-080027477d92',
                    text:'电子信息',
                    child:[
                        {value: 'f4d557df-6b68-11e6-882e-080027477d92', text:'计算机类', child:[
                            {value: '80ebda40-6b6c-11e6-882e-080027477d92', text:'计算机应用'},
                            {value: '80ebdb54-6b6c-11e6-882e-080027477d92', text:'计算机网络'},
                            {value: '80ebdc34-6b6c-11e6-882e-080027477d92', text:'计算机信息管理'},
                            {value: '80ebdd05-6b6c-11e6-882e-080027477d92', text:'网络系统管理'},
                            {value: '80ebddd7-6b6c-11e6-882e-080027477d92', text:'动漫设计与制作'},
                            {value: '80ebdeb1-6b6c-11e6-882e-080027477d92', text:'嵌入式系统技术与应用'}
                        ]},
                        {value: 'f4d558d0-6b68-11e6-882e-080027477d92', text:'电子信息类', child:[
                            {value: '207581d4-6b6d-11e6-882e-080027477d92', text:'电子信息物联网方向'},
                            {value: '2075861b-6b6d-11e6-882e-080027477d92', text:'电子信息网络信息方向'},
                            {value: '20758bc5-6b6d-11e6-882e-080027477d92', text:'应用电子技术'},
                            {value: '20758ed6-6b6d-11e6-882e-080027477d92', text:'信息安全技术'},
                            {value: '20759196-6b6d-11e6-882e-080027477d92', text:'微电子技术'},
                            {value: '20759408-6b6d-11e6-882e-080027477d92', text:'数字媒体技术'},
                            {value: '2075963c-6b6d-11e6-882e-080027477d92', text:'嵌入式工程'}
                        ]},
                        {value: 'f4d559c0-6b68-11e6-882e-080027477d92', text:'通信类'}
                    ]
                },
                {value:'40855937-6b68-11e6-882e-080027477d92', text:'财经文化教育'},
                {value:'f4d54a41-6b68-11e6-882e-080027477d92', text:'医药卫生'},
                {value:'f4d54b1b-6b68-11e6-882e-080027477d92', text:'农林牧渔'},
                {value:'f4d54bea-6b68-11e6-882e-080027477d92', text:'资源开发与测绘'},
                {value:'f4d54cbb-6b68-11e6-882e-080027477d92', text:'土建水利与气象环保安全'},
                {value:'f4d54d9b-6b68-11e6-882e-080027477d92', text:'制造'},
                {value:'f4d54e6f-6b68-11e6-882e-080027477d92', text:'轻纺食品'},
                {value:'f4d550ff-6b68-11e6-882e-080027477d92', text:'旅游'},
                {value:'f4d551d9-6b68-11e6-882e-080027477d92', text:'公共事业'},
                {value:'f4d552b3-6b68-11e6-882e-080027477d92', text:'艺术与传媒'},
                {value:'f4d5538d-6b68-11e6-882e-080027477d92', text:'法律类'},
                {value:'f4d55467-6b68-11e6-882e-080027477d92', text:'交通运输'},
                {value:'f4d556d6-6b68-11e6-882e-080027477d92', text:'材料与能源'}
            ];*/
            var arr = JSON.parse(data);
            var findChildByParentId = function(arr,id){
                var categoryTrees = [];
                for (var i = 0; i< arr.length; i++){
                    if(arr[i].courseTypeParentId == id){
                        if(arr[i].levelIndex != '3'){
                            categoryTrees.push({
                                value: arr[i].courseTypeId,
                                text: arr[i].courseTypeDes,
                                child: findChildByParentId(arr,arr[i].courseTypeId)
                            })
                        }else{
                            categoryTrees.push({
                                value: arr[i].courseTypeId,
                                text: arr[i].courseTypeDes
                            })
                        }
                    }
                }
                return categoryTrees;
            };
            var newCategoryTrees = function(arr){
                var categoryTrees = [];
                for (var i = 0; i< arr.length; i++){
                    if(arr[i].levelIndex == '1'){
                        categoryTrees.push({
                            value: arr[i].courseTypeId,
                            text: arr[i].courseTypeDes,
                            child: findChildByParentId(arr,arr[i].courseTypeId)
                        })
                    }
                }
                return categoryTrees;
            };
            next(newCategoryTrees(arr));

        } else {
            console.log('从播放器获取课程分类失败');
            next([]);
        }
    });
};