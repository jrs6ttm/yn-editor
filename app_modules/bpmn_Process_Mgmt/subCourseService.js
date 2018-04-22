var fs = require('fs');
var path = require('path');
var message = require('../_utils/messageGenerator.js');
var uuid = require('node-uuid');
var parseString = require('xml2js').parseString;
var translateXML = require("../_utils/translateXml2BPMN_v2.js");
var xml2js = require('xml2js');
var processInstanceDao = new (require('./ProcessFileDao.js'))('subCourse');
var updateLogDao = new (require('./ProcessFileDao.js'))('courseUpdateLog');

var subCourseData = {
    id: null,
    name: null,
    parentId: null,
    briefDes: null,//info
    detailDes: null,//info
    courseType: null,//create
    fileIcon: null,//info
    createTime: null,//create
    lastModify: null,
    publishModifyTime: null,
    isDeleted: false,
    isPublished: false,
    isCooperation: false,//default value: false
    groupRange: null,//info
    rolePool: null, // JSON string
    userId: null,
    userName: null
};

exports.formatInfo = function(data, type) {
    if (type === 'ext'){
        //for external interface
        return {
            "courseId": data.id,
            "courseName": data.name,
            "parentId": data.parentId,
            "courseDescpt": data.briefDes,
            "detailDes":data.detailDes,
            "courseType":data.courseType,
            "fileIcon" : data.fileIcon?data.fileIcon:"",
            "createTime": data.createTime,
            "publishModifyTime":data.publishModifyTime,
            "isPublished":((data.isPublished)? true:false),
            "groupRange":data.groupRange,//????
            "rolePool":data.rolePool,//????
            "isCooperation":data.isCooperation,//???????
            "courseCreator":{
                "username": data.userName,
                "id": data.userId
            }
        };
    } else if(type === 'manager') {
        // for file manager
        return {
            gFileId: data.id,
            fileName: data.name,
            parentId: data.parentId,
            briefDes: data.briefDes,
            fileType: 'process_design',
            courseType: data.courseType,
            createTime: data.createTime,
            lastModify: data.lastModify,
            isDeleted: data.isDeleted,
            isPublished:data.isPublished,
            isCooperation:data.isCooperation,
            userId: data.userId,
            userName: data.userName
        };
    } else if(type === 'editor') {
        // for opening file in editor
        return {
            id: data.id,
            fileName: data.name,
            briefDes: data.briefDes,
            fileDesc: data.detailDes,
            fileIcon: data.fileIcon,
            isCooperation: data.isCooperation,
            groupRange: data.groupRange
        };
    } else if(type === 'edit') {
        // v2.2 for editing in sub courses list
        data['courseId'] = data.id; //只是为了，李杰和易编共用的一个接口中，返回数据都有courseId
        return data;
    }else {
        return data;
    }
};

exports.createCourse = function (graphXml, name, parentId, briefDes, detailDes, courseType, fileIcon, isCooperation, groupRange, rolePool, user,next) {
    var id = uuid.v1();
    fs.writeFileSync(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), graphXml, 'utf-8');
    var instanceData = {
        id: id,
        name: name,
        parentId: parentId,
        briefDes: briefDes,
        detailDes: detailDes,
        courseType: courseType,
        fileIcon: fileIcon,
        createTime: new Date(),
        lastModify: new Date(),
        isDeleted: false,
        isPublished: false,
        isCooperation: isCooperation,
        groupRange: groupRange,
        rolePool: rolePool,
        userId: user.id,
        userName: user.name
    };
    processInstanceDao.insertNew(instanceData, function (resData) {
        var logObj = {
            fileId:id,
            fileName:name,
            fileType:courseType+'_instance',
            userId:user.id,
            userName: user.name
        };
        updateLogDao.courseLog('create',logObj, function (data) {
            if(data){
                next(message.genSimpSuccessMsg('save success', instanceData));
            }
        });

        //console.log(resData);
    });
};
exports.update = function (id, xml, isCooperation, rolePool, user, next) {
    fs.writeFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), xml, 'utf-8', function (err) {
        if (err) {
            next(message.genSysErrMsg(err));
            throw err;
        } else {
            var stat = fs.statSync(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'));
            processInstanceDao.updateObj({'id': id}, {
                $set: {
                    'isCooperation': isCooperation,
                    'rolePool': rolePool,
                    'lastModify': new Date()
                }
            }, function (result) {
                if(result.success) {
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
exports.loadXml= function (id, user, next) {
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
                        processId:doc.parentId,
                        courseType : doc.courseType,
                        createTime: doc.createTime,
                        lastModify: doc.lastModify,
                        isDeleted: doc.isDeleted,
                        userId: doc.userId,
                        userName: doc.userName,
                        xml:data
                    };
                    next(message.genSimpSuccessMsg('', resData));
                } else {
                    next(message.genSimpFailedMsg('not exist', null))
                }
            });
        }
    });
};
exports.loadInfo = function(instanceId, formatType, next){
    var me = this;
    processInstanceDao.findOneInstanceFileById(instanceId,function(data){
        if(data){
            var resData = me.formatInfo(data, formatType);
            next(message.genSimpSuccessMsg('findOne',resData));
        } else {
            next(message.genSimpFailedMsg('not-found',null));
        }
    });
};
exports.updateInfo = function (id, name,detailDes,fileIcon,groupRange,isCooperation,next) {
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
exports.getManyInfoByTrashFlag = function(user, isDeleted, courseType, next){
    var me = this;
    var findObj = {
        isDeleted: isDeleted,
        userId: user.id
    };
    if (courseType) {
        findObj['courseType'] = courseType;
    }
    processInstanceDao.findAllByTrashFlagUnderAccount(findObj, function(data){
        var infoArr=[];
        for(var i=0;i<data.length;i++){
            infoArr.push(me.formatInfo(data[i], 'manager'));
        }
        next(message.genSimpSuccessMsg('', infoArr));
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
                //??????????
                if (resData.length === 0){
                    resData.push({
                        roleId: '??',
                        roleName: '??'
                    })
                }
                next(message.genSimpSuccessMsg('', resData));
            }

        }
    })
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
                var courseInfo =  me.formatInfo(data.data[i], 'ext');
                resArr.push(courseInfo);
            }
            next(message.genSimpSuccessMsg('true', resArr));
        } else {
            next(message.genSimpFailedMsg('error', null));
        }
    });
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
exports.parseBPMNToMxXml = function(next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/5.xml'), 'utf-8', function (err, data) {
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
                //next(obj);
            });
            //translateXML.first(instanceId);
            var obj = translateXML.parseXmlToBpmn2(obj);
            //
            ////var builder = new xml2js.Builder();
            ////var obj = builder.buildObject(obj);
            ////next(message.genSimpSuccessMsg('success', obj));
            next(obj);
        }
    })
};
exports.trashMany = function (idArray, removeSubIdFromParent, next) {
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
                processInstanceDao.toTrashById(idArray[count1 - 1], function (result, instanceId) {
                    //remove id in parent's childList
                    processInstanceDao.findOneInstanceFileById(instanceId,function(data){
                        if(data && data.parentId){
                            removeSubIdFromParent(instanceId, data.parentId, function (res) {
                                if (res){
                                    count2++;
                                    if (result) {
                                        resultArray.push(result);
                                        //console.log('result: ' + result);
                                        if (count2 == idArray.length) {
                                            //console.log(message.genSimpSuccessMsg('', resultArray));
                                            next(message.genSimpSuccessMsg('', resultArray));
                                        }
                                    }
                                } else {
                                    next(message.genSimpFailedMsg('fail-to-remove-in-parent', null))
                                }
                            })
                        } else {
                            count2++;
                            if (result) {
                                resultArray.push(result);
                                //console.log('result: ' + result);
                                if (count2 == idArray.length) {
                                    //console.log(message.genSimpSuccessMsg('', resultArray));
                                    next(message.genSimpSuccessMsg('', resultArray));
                                }
                            }
                        }
                    });
                });
            }
        });
    }
};
exports.removeMany = function(idArray,next){
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
exports.restoreMany=function(idArray, next){
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
exports.rename = function (id, name,user,next) {
    var query = {
        name:name,
        userId:user.id
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

//v2.2
exports.updateInfo_v2 = function (courseId, paramObj, next) {
    var setObj = {'lastModify': new Date()};
    if (paramObj.title) {
        setObj['name'] = paramObj.title;
    }
    if (paramObj.detailDes) {
        setObj['detailDes'] = paramObj.detailDes;
    }
    if (paramObj.icon) {
        setObj['fileIcon'] = paramObj.icon;
    }
    if (paramObj.groupRange) {
        setObj['groupRange'] = paramObj.groupRange;
    }
    processInstanceDao.updateById(courseId, setObj, function (result) {
        if (result.result.ok) {
            next(message.genSimpSuccessMsg('update-success',paramObj));
        } else {
            next(message.genSimpFailedMsg('update-fail',null));
        }
    })
};