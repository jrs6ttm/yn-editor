/**
 * Created by fangz on 8/9/2015.
 */
var instanceService = require('./instanceService.js');
var message = require('../_utils/messageGenerator.js');

exports.save = function (req, res) {
    if (req.body.isUpdateFile) {
        var id = req.body.fileId;
        var xml = req.body.xml;
        var user = req.session.userData;
        instanceService.update(id, xml, user, function (resData) {
            res.send(resData);
        });
    }else {
        var processId = req.body.fileId;
        var name = req.body.instanceName;
        //var description = req.body.instanceDes;
        var detailDes = req.body.detailDes;
        var user = req.session.userData;
        var fileIcon = req.body.fileIcon;
        var fileType = req.body.fileType;
        var isCooperation = (req.body.isCooperation=='true');
        instanceService.save(processId, name,detailDes, user,fileIcon, fileType,isCooperation,function (resData) {
            res.send(resData);
        });
    }
};

exports.loadFile = function (userApi, req, res) {
    var id;
    if(req.param('isInstance') === true ||req.param('isInstance') === 'true' ){
        id = req.param('instanceId');
    }else{
        id = req.param('gFileId');
    }
    var userKey = req.param('userKey');
    if (req.session.userData && !userKey){
        instanceService.loadFile(id, req.session.userData, function (data) {
            res.send(data);
        });
    }else{
        if(userKey==='123'){
            instanceService.loadFile1(id, function (data) {
                res.send(data);
            });
        }else{
            var isChecked=false;
            for (var i = 0; i < userApi.length; i++) {
                if (userApi[i].apiKey && userKey) {
                    if (userApi[i].apiKey === userKey) {
                        instanceService.loadFile(id, userApi[i].userData, function (data) {
                            res.send(data);
                        });
                        isChecked=true;
                        break;
                    }
                }
            }
            if(!isChecked){
                res.send(message.genSimpFailedMsg('not log in', null));
            }
        }
    }
};

exports.saveInstanceUser = function (req, res) {
    var roleUserData = JSON.parse(req.body.roleUsers);
    console.log(roleUserData);
    if (req.body.isSaveNew === 'true') {
        var user = req.session.userData;
        instanceService.saveInstanceUser(roleUserData, user, function (resData) {
            res.send(resData);
        });
    }else {
        instanceService.updateInstanceUser(roleUserData, function (resData) {
            res.send(resData);
        });
    }
};
exports.loadInstanceUser = function (req, res) {
    var instanceId = req.param('instanceId');
    var roleId = req.param('roleId');
    instanceService.loadInstanceUser(instanceId, roleId, function (resData) {
        console.log(resData);
        if (resData.length>0) {
            console.log(resData[0].participants);
            res.send(resData[0].participants);
        } else {
            res.send(resData);
        }
    });
};
exports.loadAllLane = function (req, res) {
    var fileId = req.param('fileId');
    instanceService.loadAllLane(fileId, function (resData) {
        if (req.query.jsonCallBack){//解决龙龙org跨域问题，161009
            var callbackName = req.query.jsonCallBack;
            var sendStr = callbackName + '('+JSON.stringify(resData)+')';
            res.send(sendStr);
        }else {
            res.send(resData);
        }
    })
};
exports.loadTaskType = function (req, res) {
    var boardId = req.param('boardId');
    instanceService.loadTaskType(boardId, function (resData) {
        res.send(resData);
    })
};
exports.renameInstance = function (req, res) {
    var id = req.query.gFileId;
    var processId = req.query.processId;
    var fileName = req.query.fileName;
    var user = req.session.userData;
    if (user) {
        instanceService.renameInstance(id, fileName,user,processId, function (data) {
            res.send(data);
        });
    }
};
exports.trashInstances = function (req, res, way) {
    var idArray = [];
    if(way==1){
        idArray = req.body.gFileId;
    }else{
        idArray = req.query.gFileId;
    }
    instanceService.trashInstances(idArray, function (data) {
        if (data) {
            res.send(data);
        }
    });
};

exports.restoreInstances = function (req, res, way) {
    var idArray = [];
    if(way==1){
        idArray = req.body.gFileId;
    }else{
        idArray = req.query.gFileId;
    }
    instanceService.restoreInstances(idArray,function(data){
        if(data) {
            res.send(data);
        }
    });
};

exports.removeInstances = function (req, res, way) {
    var idArray = [];
    if(way==1){
        idArray = req.body.gFileId;
    }else{
        idArray = req.query.gFileId;
    }
    instanceService.removeInstances(idArray, function (data) {
        if (data) {
            res.send(data);
        }
    });
};

exports.loadInstanceOfProcess = function (req, res) {
    var processId = req.query.processId;
    var isOut = req.query.isOut;
    if(isOut=='true'){
        isOut=true;
    }else{
        isOut=false;
    }
    instanceService.loadInstanceOfProcess(processId, !isOut, function (resData) {
        res.send(resData);
    });
};
exports.loadInstanceFile = function(req,res){
    var instanceId = req.query.instanceId;
    instanceService.loadInstanceFile(instanceId,function(resData){
        res.send(resData);
    });
};
exports.updateInstanceFile = function(req,res){
    var id = req.body.instanceId;
    var name = req.body.instanceName;
    var fileIcon = req.body.fileIcon;
    //var description = req.query.instanceDes;
    var detailDes = req.body.detailDes;
    var groupRange = req.body.groupRange;
    var isCooperation = (req.body.isCooperation!=="false");
    instanceService.updateInstanceFile(id,name,detailDes,fileIcon,groupRange,isCooperation,function(resData){
        res.send(resData);
    });
};
//load without model's id
exports.loadAllInstance = function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    var isPublished = req.query.isPublished;
    var isCooperation = req.query.isCooperation;
    instanceService.loadAllInstance(isPublished,isCooperation, function (message) {
        res.send(message);
    })
};
exports.getSingleCourseInfo = function(req,res) {
    var courseId = req.query.courseId;
	res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    instanceService.getSingleCourseInfo(courseId,function (message) {
        res.send(message);
    });
};
exports.loadAllPublishedInstanceOfUser = function(req,res) {
    //var userId = req.query.userId;
    var userId = 'PKCH5L9U';
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    instanceService.loadAllPublishedInstanceOfUser(userId,function (message) {
        res.send(message);
    });
};
exports.getInstanceByUser = function(req,res) {
    var userId = req.query.userId;
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    if (userId){
        var isPublished = req.query.isPublished;
        var isCooperation = req.query.isCooperation;
        instanceService.getInstanceByUser(userId, isPublished, isCooperation, function (message) {
            res.send(message);
        });
    } else {
        res.send(message.genSimpFailedMsg('miss_user_id', null));
    }
};
exports.addCourseToUser = function (req, res) {
    var email = req.query.email;
    var courseId = req.query.courseId;
    instanceService.addCourseToUser(email, courseId, function (message) {
        res.send(message);
    })
};
exports.removeCoursesFromUser = function (req,res) {
    var email = req.query.email;
    var courseId = req.query.courseId;
    if(email === 'null') {
        email = null;
    }
    instanceService.removeCoursesFromUser(email,courseId,function(message) {
        res.send(message);
    });
};
exports.checkAcourseSelected = function(req,res) {
    var email = req.query.email;
    var courseId = req.query.courseId;
    instanceService.checkAcourseSelected(email,courseId,function(message) {
        res.send(message);
    })
};
exports.completeCourse = function (req, res) {
    var email = req.query.email;
    var courseId = req.query.courseId;
    instanceService.completeCourse(email, courseId, function (message) {
        res.send(message);
    })
};
exports.getUsersSelectedCourse = function(req,res) {
    var email = req.query.email;
    instanceService.getUsersSelectedCourse(email,function(message) {
        res.send(message);
    });
};
exports.getUsersCompletedCourse = function(req,res) {
    var email = req.query.email;
    instanceService.getUsersCompletedCourse(email,function(message) {
        res.send(message);
    });
};
exports.getUsersAllcourses = function(req,res) {
    var email = req.query.email;
    instanceService.getUsersAllcourses(email,function(message) {
        res.send(message);
    });
};
exports.addWBTaskId = function(req,res){
    var fileId = req.query.fileId;
    instanceService.addWorkbenchTaskId(fileId,function(message){
        console.log(message.msg);
        res.send('<br><br><h1>数据更新完成。</h1><br>更新内容：<br>添加任务ID(workbench.taskId);删除角色（workbench.role,knowledge.role,skill.role）');
    });
};
exports.changePublicState = function(req,res){
    var instanceId = req.query.fileId;
    instanceService.changePublicState(instanceId, req.session.userData.id,function(message){
        res.send(message);
    });
};

exports.loadInstancesOfModels = function (req, modelArr, next) {
    var isPublished = req.query.isPublished;
    //isLearnable可直接学习，有值（除了0以外任何值）则返回isCooperation=false的记录
    var isLearnable = (req.query.isLearnable) ? true : null;
    var instanceArr = [];
    var count = 0;
    for (var i = 0; i < modelArr.length; i++){
        instanceService.loadInstancesOfModels(modelArr[i], isPublished, isLearnable, function (resArr) {
            count++;
            if (resArr.success){
                for (var j = 0; j < resArr.data.length; j++){
                    instanceArr.push(resArr.data[j]);
                }
            }else {
                next(message.genSimpFailedMsg('some instance not exist', null));
            }
            if (count === modelArr.length){
                next(message.genSimpSuccessMsg('', instanceArr));
            }
        });
    }
};

exports.loadStandardXml = function (req, res) {
    var source = req.query.source;
    var instanceId = req.query.instanceId;
    var isCooperation = (req.query.isCooperation!="0");
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    if (source==='egn'){
        instanceService.getSingleCourseInfo(instanceId, function (data) {
            if (data.success){
                instanceService.loadStandardXml(instanceId, isCooperation, function (resData) {
                    res.send(resData);
                })
            } else {
                res.send(message.genSimpFailedMsg('wrong-instance-id', null));
            }
        });
    }else {
        res.send(message.genSimpFailedMsg('refused', null));
    }
};