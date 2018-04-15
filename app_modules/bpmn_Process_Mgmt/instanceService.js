/**
 * Created by fangz on 8/10/2015.
 */
var fs = require('fs');
var path = require('path');
var message = require('../_utils/messageGenerator.js');
var uuid = require('node-uuid');
var parseString = require('xml2js').parseString;
var processInstanceDao = new (require('./ProcessFileDao.js'))('processInstances');
var processUsersDao = new (require('./ProcessFileDao.js'))('instanceRolesUsers');
var courseUsersDao = new (require('./ProcessFileDao.js'))('courseUser');
var xml2js = require('xml2js');
var updateLogDao = new (require('./ProcessFileDao.js'))('courseUpdateLog');
var translateXML = require("../_utils/translateXml2BPMN_v2.js");

exports.save = function (processId, name,detailDes, user,fileIcon,fileType, isCooperation, next) {
    var id = uuid.v1();
    fs.writeFileSync( path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), fs.readFileSync(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + processId + '.xml'), 'utf-8'), 'utf-8');
    var instanceData = {
        id: id,
        processId:processId,
        name: name,
        detailDes:detailDes,
        createTime: new Date(),
        lastModify: new Date(),
        isDeleted: false,
        fileIcon: fileIcon,
        userId: user.id,
        fileType : fileType,
        userName: user.name,
        isCooperation: isCooperation
    };
    processInstanceDao.insertNew(instanceData, function (resData) {
        var logObj = {
            fileId:id,
            fileName:name,
            fileType:fileType+'_instance',
            userId:user.id,
            userName: user.name
        };
        updateLogDao.courseLog('create',logObj, function (data) {
            if(data){
                next(message.genSimpSuccessMsg('save success', resData.ops[0]));
            }
        });

        //console.log(resData);
    });
};

exports.update = function (id, xml, user, next) {
    fs.writeFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), xml, 'utf-8', function (err) {
        if (err) {
            next(message.genSysErrMsg(err));
            throw err;
        } else {
            var stat = fs.statSync(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'));
            var size = stat.size;
            processInstanceDao.updateById(id, size, function (result) {
                if(result) {
                    var logObj = {
                        fileId:id,
                        fileType:'process_design_instance',
                        userId:user.id,
                        userName: user.name
                    };
                    updateLogDao.courseLog('update',logObj, function (data) {
                        if(data){
                            next(message.genSimpSuccessMsg('save success', null));
                        }
                    });
                }
            })
        }
    });
};
exports.changePublicState = function (instanceId, userId, next) {
    processInstanceDao.findFileByIdUnderAccount(instanceId, {"id" : userId}, function (result) {
        if(result) {
            var isPublished = (result.isPublished) ? (!result.isPublished) : true;
            processInstanceDao.updateObj({"id": instanceId}, {$set:{"isPublished":isPublished,"publishModifyTime":new Date()}}, function (result) {
                if(result) {
                    next(message.genSimpSuccessMsg('save success', null));
                }
            })
        }
    })

};
exports.loadFile = function (id, user, next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), 'utf-8', function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg('delete', null));
            //throw err;
        } else {
            processInstanceDao.findFileByIdUnderAccount(id, user, function (doc) {
                if (doc) {
                    var resData = {
                        gFileId:id,
                        fileName: doc.name,
                        xml:data,
                        processId:doc.processId,
                        description:doc.description,
                        createTime: doc.createTime,
                        lastModify: doc.lastModify,
                        userId: doc.userId,
                        userName: doc.userName,
                        isDeleted: doc.isDeleted,
                        isPublished:doc.isPublished,
                        fileIcon : doc.fileIcon?doc.fileIcon:"",
                        fileType : doc.fileType,
                        publishModifyTime:doc.publishModifyTime,
                        groupRange: doc.groupRange
                    };
                    //console.log(doc);
                    next(message.genSimpSuccessMsg('', resData));
                } else {
                    next(message.genSimpFailedMsg('not exist', null))
                }

            });


        }
    });
};
exports.loadFile1 = function (id, next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), 'utf-8', function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg('delete', null));
            //throw err;
        } else {
            processInstanceDao.findFileByIdUnderAccount1(id, function (doc) {
                if (doc) {
                    var resData = {
                        gFileId:id,
                        fileName: doc.name,
                        xml:data,
                        processId:doc.processId,
                        description:doc.description,
                        createTime: doc.createTime,
                        lastModify: doc.lastModify,
                        userId: doc.userId,
                        userName: doc.userName,
                        isDeleted: doc.isDeleted,
                        isPublished:doc.isPublished,
                        publishModifyTime:doc.publishModifyTime,
                        groupRange: doc.groupRange
                    };
                    //console.log(doc);
                    next(message.genSimpSuccessMsg('', resData));
                } else {
                    next(message.genSimpFailedMsg('not exist', null))
                }

            });


        }
    });
};

exports.saveInstanceUser = function (roleUsers, user, next) {
    var insRoleUserData = [];
    for (var i = 0; i < roleUsers.length; i++) {
        var id = uuid.v1();
        insRoleUserData[i] = {
            id: id,
            processInstanceId:roleUsers[i].instanceId,
            processId: roleUsers[i].fileId,
            roleId: roleUsers[i].roleId,
            roleName: roleUsers[i].roleName,
            participants: JSON.parse(roleUsers[i].participants),
            createTime: new Date(),
            lastModify: new Date(),
            userId: user.id,
            userName: user.name
        };
    }
    //todo
    processUsersDao.insertManyNew(insRoleUserData, function (resData) {
        next(resData.ops);
        //console.log(resData);
    });
};

exports.loadInstanceUser = function (instanceId, roleId, next) {
    processUsersDao.findByInstanceRole(instanceId, roleId, function (resData) {
        next(resData);
    })
};
exports.updateInstanceUser = function (roleUserData, next) {
    var userUpdateData = [];
    var temp = 0;
    for (var i = 0; i < roleUserData.length; i++) {
        userUpdateData[i] = {
            processInstanceId:roleUserData[i].instanceId,
            roleId: roleUserData[i].roleId,
            participants: JSON.parse(roleUserData[i].participants)
        };
        var query = {
            'processInstanceId': userUpdateData[i].processInstanceId,
            'roleId': userUpdateData[i].roleId
        };
        var update = {
            'lastModify': new Date(),
            'participants': userUpdateData[i].participants
        };
        processUsersDao.updateOneRecord(query,update,function (result) {
            if(result) {
                temp++;
                if (temp === roleUserData.length){
                    next(message.genSimpSuccessMsg('save success', null));
                }
            }
        })
    }
};

exports.loadInstanceOfProcess = function (processId, isInTrash, next) {
    processInstanceDao.findFileByProcessId(processId, isInTrash, function (resData) {
        var fileDatas = [];
        for (var i = 0; i < resData.length; i++) {
            var fileData = {
                gFileId: resData[i].id,
                fileName: resData[i].name,
                processId: resData[i].processId,
                createTime: resData[i].createTime,
                lastModify: resData[i].lastModify,
                description: resData[i].description,
                detailDesc:resData[i].detailDesc,
                userId: resData[i].userId,
                userName: resData[i].userName,
                isDeleted: resData[i].isDeleted,
                isPublished:resData[i].isPublished,
                publishModifyTime:resData[i].publishModifyTime
            };
            fileDatas.push(fileData);
        }
        next(message.genSimpSuccessMsg('', fileDatas));
    })
};
exports.loadInstanceFile = function(instanceId,next){
    processInstanceDao.findOneInstanceFileById(instanceId,function(resData){
        next(message.genSimpSuccessMsg('', resData));
    });
};

exports.loadAllLane = function(instanceId, next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + instanceId + '.xml'), 'utf-8', function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg('delete', null));
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
            var laneArrays = [];
            var poolArrays = [];
            if (figures){
                for (var i = 0; i < figures.length; i++) {
                    if(figures[i].$.type === 'bpmn.participant.lane') {
                        laneArrays.push(figures[i].$.label);
                    }
                    if(figures[i].$.type === 'bpmn.participant.pool') {
                        poolArrays.push(figures[i].$.label);
                    }
                }
                //deal with pool and lane
                var roleData = [];
                for (var i = 0; i < laneArrays.length; i++) {
                    roleData[i] = laneArrays[i];
                }
                for (var i = 0; i < poolArrays.length; i++) {
                    var poolRole = poolArrays[i].split('+');
                    for (var j = 0; j< poolRole.length; j++){
                        var temp = 0;
                        for (var k = 0; k< roleData.length; k++){
                            if (poolRole[j] === roleData[k]) {
                                temp = 1;
                                break;
                            }
                        }
                        if (temp === 0) {
                            roleData.push(poolRole[j]);
                        }
                    }
                }
                var resData = [];
                for (var i = 0; i<roleData.length;i++){
                    resData.push({
                        roleId: roleData[i],
                        roleName: roleData[i]
                    })
                }
                //无泳道时加上默认角色
                if (resData.length === 0){
                    resData.push({
                        roleId: '学生',
                        roleName: '学生'
                    })
                }
                next(message.genSimpSuccessMsg('', resData));
            }

        }
    })
};
exports.loadTaskType = function(boardId, next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + boardId + '.xml'), 'utf-8', function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg('delete', null));
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
            var taskGroups = [];
            var subTasks = [];
            var count1 = 0,count2=0;
            for (var i = 0; i < figures.length; i++) {
                if(figures[i].$.type === 'task_design.taskGroup') {
                    taskGroups[count1++] = {
                        'objValue':figures[i],
                        'groupId':figures[i].$.id
                    };
                }
                if(figures[i].$.type === 'task_design.subTask') {
                    subTasks[count2++] = {
                        'objValue': figures[i],
                        'parentId': figures[i].mxCell.$.parent
                    }
                }
            }
            var taskCategory = [];

            for(var i = 0; i < taskGroups.length; i++){
                var tasks = [];
                for(var j = 0; j < subTasks.length; j++){
                    if(subTasks[j].parentId === taskGroups[i].groupId){
                        subTasks[j] = subTasks[j].objValue;
                        tasks.push(subTasks[j]);
                    }
                }
                taskCategory[i] = {
                    taskGroup: taskGroups[i].objValue,
                    subTask : tasks
                }
            }
            var resData = {
                taskData: taskCategory
            };
            next(resData);
        }
    })
};
exports.renameInstance = function (id, name,user,processId,next) {
    var query = {
        name:name,
        userId:user.id,
        processId:processId
    };
    processInstanceDao.findByQuery(query,function(doc){
        console.log(doc);
        if(doc.length > 0){
            next(message.genSimpFailedMsg('exist',null));
        }else {
            processInstanceDao.renameInstanceById(id, name, user, function (result) {
                if (result) {
                    next(message.genSimpSuccessMsg('renameSuccess', result));
                }
            });
        }
    });
};
exports.updateInstanceFile = function (id, name,detailDes,fileIcon,groupRange,isCooperation,next) {
    var query = {
      id:id
    };
    processInstanceDao.findByQuery(query,function(doc){
        if(doc.length > 0){
           processInstanceDao.updateInstanceFileById(id,name,detailDes,fileIcon,groupRange,isCooperation,function(result){
             if(result){
                 next(message.genSimpSuccessMsg('update success',result));
             }
           });
        }
    });
};

exports.trashInstances = function (idArray, next) {
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
                //console.log(idArray[count1 - 1]);
                processInstanceDao.toTrashById(idArray[count1 - 1], function (result) {
                    count2++;
                    if (result) {
                        resultArray.push(result);
                        //console.log('result: ' + result);
                        if (count2 == idArray.length) {
                            //console.log(message.genSimpSuccessMsg('', resultArray));
                            next(message.genSimpSuccessMsg('', resultArray));
                        }
                    }
                });
            }
        });
    }
};
//[moved]
exports.restoreInstances=function(idArray, next){
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
                processInstanceDao.restoreById(idArray[count1 - 1], function (result) {
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
exports.removeInstances = function(idArray,next){
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
                processInstanceDao.removeById(idArray[count1 - 1], function (result) {
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

exports.loadAllInstance = function (isPublished,isCooperation, next) {
    var findObj = {
        "isDeleted":false
    };
    if (isPublished==true || (isPublished =='true')){
        findObj['isPublished'] = true;
    } else {
        findObj['isPublished'] = {$ne: true}
    }
    if (isCooperation =='true'){
        findObj['isCooperation'] = true;
    } else {
        findObj['isCooperation'] = {$ne: true}
    }
    processInstanceDao.findAndResMessage(findObj, function (data) {
        if (data.success) {
            var dataArr = data.data;
            var resArr = [];
            for (var i = 0; i < dataArr.length; i++) {
                var resInstanceData = {
                    "courseId": dataArr[i].id,
                    "courseName": dataArr[i].name,
                    "courseDescpt": dataArr[i].description,
                    "detailDes":dataArr[i].detailDes,
                    "courseCreator":{
                        "username": dataArr[i].userName,
                        "id": dataArr[i].userId,
                        "email": dataArr[i].email
                    },
                    "createTime": dataArr[i].createTime,
                    "chosenTimes":"fz designing",//选课次数
                    "grade":"fz designing",//课程等级
                    "Evaluation":"fz designing",//课程评价
                    "isPublished":((dataArr[i].isPublished)? true:false),//是否发布
                    "fileIcon" : dataArr[i].fileIcon?dataArr[i].fileIcon:"",//课程封面
                    "publishModifyTime":dataArr[i].publishModifyTime,//（取消）发布时间
                    "fileType":dataArr[i].fileType,
                    "groupRange":dataArr[i].groupRange,//分组规则
                    "isCooperation":dataArr[i].isCooperation//是否为协作课程
                    //...其他课程的信息
                };
                resArr.push(resInstanceData);
            }
            next(message.genSimpSuccessMsg('', resArr));
        } else {
            next(message.genSimpFailedMsg('fail', null));
        }
    })
};
exports.getInstanceFields = function(data) {
    return {
        "courseId": data.id,
        "courseName": data.name,
        "courseDescpt": data.description,
        "detailDes":data.detailDes,
        "posterImage":"fz designing",//课程封面的路径或者ID
        "courseCreator":{
            "username": data.userName,
            "id": data.userId,
            "email": data.email,
            "description":"fz designing"
        },
        "createTime": data.createTime,
        "chosenTimes": "123",//选课次数
        "grade": "简单",//课程等级
        "Evaluation": "9.9",//课程评价
        "isPublished":((data.isPublished)? true:false),
        "fileIcon" : data.fileIcon?data.fileIcon:"",
        "publishModifyTime":data.publishModifyTime,
        "groupRange":data.groupRange,//分组规则
        "isCooperation":data.isCooperation//是否为协作课程
        //...其他课程的信息
    };
};
exports.getSingleCourseInfo = function(courseId,next) {
    var resArr = [];
    var me = this;
    processInstanceDao.getCourseById(courseId, function (data) {
        if (data) {
            if(data.fileType === 'ople_design' || data.fileType === 'ople2_design'){
                var isOple = true;
            }else{
                var isOple = false;
            }
            var courseInfo = me.getInstanceFields(data);
            courseInfo.isOple = isOple;
            resArr.push(courseInfo);
            next(message.genSimpSuccessMsg('true', resArr));
        } else {
            next(message.genSimpFailedMsg('false', null));
        }
    });
};
exports.loadAllPublishedInstanceOfUser = function(userId,next) {
    var resArr = [];
    processInstanceDao.getPublishedCourseByUserId(userId, function (data) {
        if (data.length > 0) {
            for(var i = 0; i < data.length; i++){
                var courseInfo = {
                    "courseId": data[i].id,
                    "courseName": data[i].name,
                    "posterImage": "fz designing",//课程封面的路径或者ID
                    "description": "sadasdasda",
                    "detailDes":data[i].detailDes,//课程的详细介绍
                    "courseCreator": {
                        "username": data[i].userName,
                        "id": data[i].userId,
                        "email": "fz designing ",
                        "description": " fz designing "
                    },
                    "createTime": data[i].createTime,
                    "chosenTimes": "123",//选课次数
                    "grade": "专家",//课程等级
                    "Evaluation": "8.6",//课程评价
                    "isPublished":((data[i].isPublished)? true:false),
                    "fileIcon" : data[i].fileIcon?data.fileIcon:"",
                    "publishModifyTime":data[i].publishModifyTime,
                    "fileType":data[i].fileType
                    //...其他课程的信息
                };
                resArr.push(courseInfo);
            }
            next(message.genSimpSuccessMsg('true', resArr));
        } else {
            next(message.genSimpFailedMsg('false', null));
        }
    });
};
exports.getInstanceByUser = function(userId, isPublished, isCooperation, next) {
    var me = this;
    var findObj = {
        "isDeleted":false,
        'userId':userId
    };
    if (isPublished === 'true'){
        findObj['isPublished'] = true;
    } else if (isPublished === 'false'){
        findObj['isPublished'] = {$ne: true};
    }
    if (isCooperation === 'true'){
        findObj['isCooperation'] = true;
    } else if (isCooperation === 'false'){
        findObj['isCooperation'] = {$ne: true};
    }
    var resArr = [];
    processInstanceDao.findAndResMessage(findObj, function (data) {
        if (data.success) {
            for(var i = 0; i < data.data.length; i++){
                var courseInfo =  me.getInstanceFields(data.data[i]);
                resArr.push(courseInfo);
            }
            next(message.genSimpSuccessMsg('true', resArr));
        } else {
            next(message.genSimpFailedMsg('error', null));
        }
    });
};
exports.addCourseToUser = function (email, courseId, next) {
    var saveObj = {
        "courseId": courseId,
        "userEmail": email,
        "isAccomplished": false,
        "joinTime": new Date()
    };
    courseUsersDao.save(saveObj, function (data) {
        if (data.success) {
            next(message.genSimpSuccessMsg('add success', null));
        } else {
            next(message.genSimpFailedMsg('add fail', null));
        }
    })
};
exports.removeCoursesFromUser = function(email,courseId,next) {
    var delObj = {
        "courseId": courseId,
        "userEmail": email
    };
    courseUsersDao.removeSelectedInstance(delObj,function(data) {
        if(data>0) {
            next(message.genSimpSuccessMsg('remove success!', null));
        } else {
            next(message.genSimpFailedMsg('remove failed!', null));
        }
    });
};
exports.completeCourse = function (email, courseId, next) {
    var findObj = {
        "courseId": courseId,
        "userEmail": email
    };
    var setObj = {
        $set:{
            "isAccomplished": true,
            "accomplishTime": new Date()
        }
    };
    courseUsersDao.updateAndResMessage(findObj, setObj, function (data) {
        if (data.success) {
            next(message.genSimpSuccessMsg('success', null));
        } else {
            next(message.genSimpFailedMsg('fail', null));
        }
    })
};
exports.checkAcourseSelected = function (email,courseId,next) {
    var checkObj = {
        "courseId": courseId,
        "userEmail": email
    };
    courseUsersDao.checkAcourseSelected(checkObj,function(data) {
        if(data.length > 0) {
            next(message.genSimpSuccessMsg('selected', null));
        } else {
            next(message.genSimpFailedMsg('not selected', null));
        }
    });
};
exports.getUsersSelectedCourse = function(email,next) {
    var query = {
        'userEmail':email
    };
    courseUsersDao.getCourseId(query,function(mess) {
        if(mess.length > 0) {
            var resArr = [];
            for(var j = 0; j < mess.length; j++){
                processInstanceDao.getCourseById(mess[j].courseId,function(data) {
                    if(data) {
                        var getCoursesInfo = {
                            "courseId": data.id,
                            "courseName": data.name,
                            "posterImage":"fz designing",//课程封面的路径或者ID
                            "courseCreator":{
                                "username": data.userName,
                                "email": email,
                                "description":" fz designing "
                            },
                            "createTime":data.createTime,
                            "chosenTimes":"fz designing",//选课次数
                            "grade":"fz designing",//课程等级
                            "Evaluation":"fz designing",//课程评价
                            "isPublished":data.isPublished,
                            "fileIcon" : data.fileIcon?data.fileIcon:"",
                            "publishModifyTime":data.publishModifyTime,
                            "fileType":data.fileType
                            //...其他课程的信息
                        };
                        resArr.push(getCoursesInfo);
                        if (resArr.length === mess.length) {
                            next(message.genSimpSuccessMsg('true', resArr));
                        }
                    }

                });
            }
        } else {
            next(message.genSimpFailedMsg('false',null));
        }
    });
};
exports.getUsersCompletedCourse = function(email,next) {
    var query = {
        'userEmail':email,
        'isAccomplished':true
    };
    courseUsersDao.getCourseId(query,function(mess) {
        if(mess.length > 0) {
            var resArr = [];
            var count = 0;
            for(var j = 0; j<mess.length; j ++) {
                processInstanceDao.getCourseById(mess[j].courseId,function(data) {
                    if(data) {
                        var getCoursesInfo = {
                            "courseId": data.id,
                            "courseName": data.name,
                            "posterImage":"fz designing",//课程封面的路径或者ID
                            "courseCreator":{
                                "username": data.userName,
                                "email": email,
                                "description":" fz designing "
                            },
                            "createTime":data.createTime,
                            "chosenTimes":"fz designing",//选课次数
                            "grade":"fz designing",//课程等级
                            "Evaluation":"fz designing",//课程评价
                            "isPublished":data.isPublished,
                            "fileIcon" : data.fileIcon?data.fileIcon:"",
                            "publishModifyTime":data.publishModifyTime,
                            "fileType":data.fileType
                            //...其他课程的信息
                        };
                        resArr.push(getCoursesInfo);
                        if (resArr.length === mess.length) {
                            next(message.genSimpSuccessMsg('true', resArr));
                        }
                    }
                });
            }
        } else {
            next(message.genSimpFailedMsg('false',null));
        }
    });
};
exports.getUsersAllcourses = function(email,next) {
    var query = {
        'userEmail':email
    };
    courseUsersDao.getCourseId(query,function(mess) {
       if(mess) {
           var resSelected = [];
           var resDone = [];
           var resArr = {};
           for (var j = 0; j < mess.length; j++) {
               var ff = mess[j].isAccomplished;
               processInstanceDao.getCourseById(mess[j].courseId, function (data) {
                   if (data) {
                       if(ff) {
                           var DoneCoursesInfo = {
                               "courseId": data.id,
                               "courseName": data.name,
                               "posterImage": "fz designing",//课程封面的路径或者ID
                               "courseCreator": {
                                   "username": data.userName,
                                   "email": email,
                                   "description": " fz designing "
                               },
                               "createTime": data.createTime,
                               "chosenTimes": "fz designing",//选课次数
                               "grade": "fz designing",//课程等级
                               "Evaluation": "fz designing",//课程评价
                               "isPublished":data.isPublished,
                               "publishModifyTime":data.publishModifyTime,
                               "fileIcon" : data.fileIcon?data.fileIcon:"",
                               "fileType":data.fileType
                               //...其他课程的信息
                           };
                           resDone.push(DoneCoursesInfo);
                       }
                       var getCoursesInfo = {
                           "courseId": data.id,
                           "courseName": data.name,
                           "posterImage":"fz designing",//课程封面的路径或者ID
                           "courseCreator":{
                               "username": data.userName,
                               "email": email,
                               "description":" fz designing "
                           },
                           "createTime":data.createTime,
                           "chosenTimes":"fz designing",//选课次数
                           "grade":"fz designing",//课程等级
                           "Evaluation":"fz designing",//课程评价
                           "isPublished":data.isPublished,
                           "publishModifyTime":data.publishModifyTime,
                           "fileIcon" : data.fileIcon?data.fileIcon:"",
                           "fileType":data.fileType
                           //...其他课程的信息
                       };
                       resSelected.push(getCoursesInfo);
                       resArr = {
                           'selected':resSelected,
                           'done':resDone
                       };
                       if (resSelected.length === mess.length) {
                           next(message.genSimpSuccessMsg('true', resArr));
                       }
                   }
               });
           }
       }
    });
};
exports.addWorkbenchTaskId = function(fileId,next){
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + fileId + '.xml'), 'utf-8', function (err, data) {
    if(err){
        next(message.genSimpFailedMsg('delete',null));
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
        if(figures.length){
            for(var i = 0; i < figures.length; i++){
                if(figures[i].$.type){
                    var figureName = (figures[i].$.type).toLocaleString();
                    var cellTypeSegs = figureName.split('.');
                    if(((cellTypeSegs[0]+'.'+cellTypeSegs[1]) === 'bpmn.task') &&  figures[i].$.workbench){
                        var workbench = JSON.parse(figures[i].$.workbench);
                        if(workbench.length > 0){
                            for(var j = 0 ; j < workbench.length; j++){
                                if(!workbench[j].taskId){
                                    var taskId = uuid.v1();
                                    workbench[j]['taskId'] = taskId;
                                }
                                //deal with role
                                if (workbench[j].role){
                                    delete workbench[j].role;
                                }
                            }
                            figures[i].$.workbench = JSON.stringify(workbench);
                        }
                        if(figures[i].$.knowledge){
                            var knowledge = JSON.parse(figures[i].$.knowledge);
                            if(knowledge.length > 0){
                                for(var j = 0 ; j < knowledge.length; j++){
                                    //deal with role
                                    if (knowledge[j].role){
                                        delete knowledge[j].role;
                                    }
                                }
                                figures[i].$.knowledge = JSON.stringify(knowledge);
                            }
                        }
                        if(figures[i].$.skill){
                            var skill = JSON.parse(figures[i].$.skill);
                            if(skill.length > 0){
                                for(var j = 0 ; j < skill.length; j++){
                                    //deal with role
                                    if (skill[j].role){
                                        delete skill[j].role;
                                    }
                                }
                                figures[i].$.skill = JSON.stringify(skill);
                            }
                        }

                    }
                }
            }
            obj.mxGraphModel.root.ecCell=figures.slice(0);
        }else{
            obj.mxGraphModel.root.ecCell = figures;
        }
        var builder = new (xml2js.Builder)();
        var xml = builder.buildObject(obj);
        fs.writeFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + fileId + '.xml'), xml , 'utf-8', function (err) {
            if(err){
                next(message.genSimpFailedMsg('write err',''));
                throw err;
            }else{
                next(message.genSimpSuccessMsg('update success',''))
            }
        });
    }
  });
};
exports.loadInstancesOfModels = function (processId, isPublished, isLearnable, next) {
    var me = this;
    var findObj = {
        "isDeleted":false,
        "processId": processId
    };
    if (isPublished==true || (isPublished =='true')){
        findObj['isPublished'] = true;
    } else {
        findObj['isPublished'] = {$ne: true}
    }
    if (isLearnable){
        findObj['isCooperation'] = false;
    }
    processInstanceDao.findAndResMessage(findObj, function (data) {
        if (data.success) {
            var dataArr = data.data;
            var resArr = [];
            for (var i = 0; i < dataArr.length; i++) {
                var resInstanceData = me.getInstanceFields(dataArr[i]);
                resArr.push(resInstanceData);
            }
            next(message.genSimpSuccessMsg('', resArr));
        } else {
            next(message.genSimpFailedMsg('', null));
        }
    })
};
exports.loadStandardXml = function(instanceId, isCooperation, next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + instanceId + '.xml'), 'utf-8', function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg('no_file', null));
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
            translateXML.first(instanceId);
            var obj = translateXML.parseXmlToBpmn(obj, isCooperation, instanceId);

            var builder = new xml2js.Builder();
            var obj = builder.buildObject(obj);
            //next(message.genSimpSuccessMsg('success', obj));
            next(obj);
        }
    })
};