var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var message = require('../_utils/messageGenerator.js');
var serverCommunication = require('../_utils/communication.js');
var parseString = require('xml2js').parseString;
var processFileDao = new (require('./ProcessFileDao.js'))('parentCourse');
var updateLogDao = new (require('./ProcessFileDao.js'))('courseUpdateLog');


var courseData = {
    id: null,
    name: null,
    briefDes: null,//info
    detailDes: null,//info
    fileType: null,//create
    courseType: null,//create
    categoryId: null,//info
    fileIcon: null,//info
    createTime: null,//create
    lastModify: null,
    publishModifyTime: null,
    isDeleted: false,
    isPublished: false,
    publishPermission: null,
    userId: null,
    userName: null
};

exports.formatInfo = function(data, type) {
    if (type === 'ext'){
        //for external interface
        return {
            "courseId": data.id,
            "courseName": data.name,
            "courseDescpt": data.briefDes,
            "detailDes":data.detailDes,
            "courseCreator":{
                "username": data.userName,
                "id": data.userId
            },
            "createTime": data.createTime,
            "isPublished":((data.isPublished)? true:false),
            "fileIcon" : data.fileIcon?data.fileIcon:"",
            "publishModifyTime":data.publishModifyTime,
            "groupRange":data.groupRange,//????
            "isCooperation":data.isCooperation//???????
        };
    } else if(type === 'manager') {
        // for file manager
        return {
            gFileId: data.id,
            fileName: data.name,
            briefDes: data.briefDes,
            fileType: 'course_design',
            courseType: 'situation',
            categoryId: data.categoryId,
            createTime: data.createTime,
            lastModify: data.lastModify,
            isDeleted: data.isDeleted,
            isPublished: data.isPublished,
            fileIcon: data.fileIcon?data.fileIcon:null,
            userId: data.userId,
            userName: data.userName
        }
    }else {
        return data;
    }
};
exports.create = function (name, briefDes, detailDes,fileType, courseType, categoryId, fileIcon, graphXml, user, next) {
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
                    var graphMetaData = {
                        id: id,
                        name: name,
                        briefDes: briefDes,
                        detailDes: detailDes,
                        fileType: fileType,
                        courseType: courseType,
                        categoryId: categoryId,
                        fileIcon: fileIcon,
                        createTime: new Date(),
                        lastModify: new Date(),
                        isDeleted: false,
                        isPublished: false,
                        userId: user.id,
                        userName: user.name
                    };
                    processFileDao.insertNew(graphMetaData, function (resData) {
                        resData = {
                            gFileId: resData.ops[0].id,
                            fileName: resData.ops[0].name,
                            briefDes: resData.ops[0].briefDes,
                            fileDesc: resData.ops[0].detailDes,
                            fileType: resData.ops[0].fileType,
                            courseType: resData.ops[0].courseType,
                            categoryId:resData.ops[0].categoryId,
                            fileIcon:resData.ops[0].fileIcon,
                            createTime: resData.ops[0].createTime,
                            lastModify: resData.ops[0].lastModify,
                            isDeleted: resData.ops[0].isDeleted,
                            isPublished: resData.ops[0].isPublished,
                            userId: resData.ops[0].userId,
                            userName: resData.ops[0].userName
                        };
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
};

exports.updateXml = function(id, name, courseType, graphXml, user, next){
    processFileDao.findFileByIdUnderAccount(id, user, function (data) {
        if (data) {
            fs.writeFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), graphXml, 'utf-8', function (err) {
                if (err) {
                    next(message.genSysErrMsg(err));
                    throw err;
                } else {
                    processFileDao.updateById(id, function (data) {
                        if (data) {
                            var logObj = {
                                fileId:id,
                                fileName:name,
                                fileType:courseType,
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
};

exports.updateInfo = function(fileId,fileName,briefDes,detailDes,categoryId,fileIcon,next){
    processFileDao.updateOneCourseInfo(fileId,fileName,briefDes,detailDes,categoryId,fileIcon,function(data){
        if(data){
            next(message.genSimpSuccessMsg('updateSuccess',data));
        }
    });
};

exports.loadXml = function (id, userData, next) {
    fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + id + '.xml'), 'utf-8', function (err, data) {
        if (err) {
            next(message.genSimpFailedMsg('delete', null));
            //throw err;
        } else {
            processFileDao.findFileByIdUnderAccount(id, userData, function (doc) {
                if (doc) {
                    var resData = {
                        gFileId: id,
                        fileName: doc.name,
                        fileType:doc.fileType,
                        courseType: doc.courseType,
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
};

exports.loadInfo = function(fileId,next){
    processFileDao.loadOneModelFile(fileId,function(data){
        if(data){
            var resData = {
                id: data.id,
                fileName: data.name,
                briefDes: data.briefDes,
                fileDesc: data.detailDes,
                fileIcon: data.fileIcon,
                categoryId: data.categoryId,
                userId: data.userId,
                userName: data.userName,
                courseType: data.courseType,
                isPublished: data.isPublished,
                subCourseIds: data.subCourseIds
            };
            next(message.genSimpSuccessMsg('findOne',resData));
        } else {
            next(message.genSimpFailedMsg('not-found',null));
        }
    })
};

exports.deleteSubCourseId = function(subCourseId, next) {

};
exports.getSubCourseIdArr = function(fileId, next) {
    //v2.2
    this.loadInfo(fileId, function (msg) {
        next(message.genSimpSuccessMsg('', (msg.data.subCourseIds)?(msg.data.subCourseIds):[]));
    });
    /*fs.readFile(path.join(__dirname, '../../_static_content/BPMN_files/normal/' + fileId + '.xml'), 'utf-8', function (err, data) {
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
    })*/
};
exports.getManyInfoByTrashFlag = function(user, isDeleted, courseType, next){
    var me = this;
    var findObj = {
        isDeleted: isDeleted,
        userId: user.id,
        fileType: 'course_design'
    };
    if (courseType) {
        findObj['courseType'] = courseType;
    }
    processFileDao.findAllByTrashFlagUnderAccount(findObj, function(data){
        var infoArr=[];
        for(var i=0;i<data.length;i++){
            infoArr.push(me.formatInfo(data[i], 'manager'));
        }
        next(message.genSimpSuccessMsg('', infoArr));
    });
};

//lj
exports.getManyInfoForExt = function(categoryTrees, isDeleted, isPublished, fileType, categoryId, ctClass, next){
    var me = this;
    var findObj = {
        isDeleted: isDeleted,
        fileType: fileType
    };
    if(isPublished==='true'){
        findObj['isPublished']=true;
    }else if(isPublished==='false'){
        findObj['isPublished']={$ne: true};
    }
    //???? ??????????findObj????or???
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
                            //??
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
                } else {//????????????
                }
            }else {
                //?????
                findObj['categoryId']=categoryId;
            }
        } else {
            //?????
            next(message.genSimpFailedMsg('not_find_category', null));
            return;
        }
    }
    processFileDao.findAndResMessage(findObj,function(msg){
        var fileArr=[];
        if(msg.success){
            for(var i=0;i<msg.data.length;i++){
                fileArr.push(me.formatInfo(msg.data[i], 'ext'));
            }
            next(message.genSimpSuccessMsg('', fileArr));
        } else {
            next(message.genSimpFailedMsg('something_wrong_in_YiBian', msg.msg));
        }
    });
};

exports.trashMany = function (idArray, next) {
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
                processFileDao.toTrashById(idArray[count1 - 1], function (result) {
                //toTrashModelById(idArray[count1 - 1], function (result) {
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
exports.rename = function (id, name,user,fileType, next) {
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

//v2.2
exports.update = function (courseId, paramObj, next) {
    //fileId,fileName,briefDes,detailDes,categoryId,fileIcon，subCourseIds
    var setObj = {'lastModify': new Date()};
    if (paramObj.title) {
        setObj['name'] = paramObj.title;
    }
    if (paramObj.briefDes) {
        setObj['briefDes'] = paramObj.briefDes;
    }
    if (paramObj.categoryId) {
        setObj['categoryId'] = paramObj.categoryId;
    }
    if (paramObj.detailDes) {
        setObj['detailDes'] = paramObj.detailDes;
    }
    if (paramObj.icon) {
        setObj['fileIcon'] = paramObj.icon;
    }
    if (paramObj.subCourseIds) {
        setObj['subCourseIds'] = paramObj.subCourseIds;
    }
    processFileDao.updateById(courseId, setObj, function (result) {
        if (result.result.ok) {
            next(message.genSimpSuccessMsg('update-success',paramObj));
        } else {
            next(message.genSimpFailedMsg('update-fail',null));
        }
    })
};