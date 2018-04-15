/**
 * Created by xh on 7/17/2015.
 */
var fileService = require('./fileService');
exports.save = function (req, res) {
    var name = req.body.fileName;
    var id = req.body.gFileId;
    var graphXml = req.body.xml;
    var xmlId = req.body.xmlId;
    var fileType = req.body.fileType;
    var fileDesc = req.body.fileDesc;
    var fileIcon = req.body.fileIcon;
    var categoryId = req.body.categoryId;
    var taskFileId = null;
    //var isSingleSupported = (req.body.isSingleSupported !='false');
    var chatHistory = null;
    if(req.body.boardId){
        taskFileId = req.body.boardId;
    }
    if( req.body.chatHistory) {
        chatHistory = JSON.parse(req.body.chatHistory);
    }
    var saveNewFile = req.body.isSaveNewFile;
    var user = req.session.userData;
    if (user) {
        if (xmlId){
            fileService.loadFile(xmlId, user, function (data) {
                if (data.success){
                    graphXml =data.data.xml;
                    fileService.save(id, name, graphXml, fileType, saveNewFile, user,fileDesc,taskFileId,chatHistory,fileIcon,categoryId, function (data) {
                        res.send(data);
                    });
                }else {
                    res.send(message.genSimpFailedMsg('ori-file not exist', null));
                }
            });
        }else {
            fileService.save(id, name, graphXml, fileType, saveNewFile, user,fileDesc,taskFileId,chatHistory,fileIcon,categoryId, function (data) {
                res.send(data);
            });
        }
    }
};
exports.loadFile = function (req, res) {
    var id=req.param('gFileId');
    var userKey=req.param('userKey');
    if (req.session.userData.id){
        fileService.loadFile(id, req.session.userData, function (data) {
            res.send(data);
        });
    }else{
        var isChecked=false;
        for (var i = 0; i < userApi.length; i++) {
            if (userApi[i].apiKey && userKey) {
                if (userApi[i].apiKey === userKey) {
                    fileService.loadFile(id, userApi[i].userData, function (data) {
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
};
exports.loadAllUserOfBoard = function (req, res) {
    var boardId = req.query.boardId;
    var user = req.session.userData;
    fileService.loadAllUserOfBoard(boardId, user, function (data) {
        res.send(data);
    })
};
exports.removeAllUserOfBoard = function (req, res) {
    var boardId = req.query.boardId;
    var user = req.session.userData;
    fileService.removeAllUserOfBoard(boardId, user, function (data) {
        res.send(data);
    })
};
exports.saveBoardUsers = function (req, res) {
    var boardId = req.query.boardId;
    var userDatas = JSON.parse(req.query.userData);
    var userType = req.query.userType;
    var currentUser = req.session.userData;
    if (userDatas) {
        fileService.saveNewBoardUsers(boardId, userDatas, userType, currentUser, function (data) {
            res.send(data);
        })
    }
};
exports.deleteBoardUsers = function (req, res) {
    var boardId = req.query.boardId;
    var userIds = JSON.parse(req.query.userIds);
    var user = req.session.userData;
    if (userIds) {
        fileService.delBoardUsers(boardId, userIds, user, function (data) {
            res.send(data);
        })
    }
};
exports.changeBoardUserType = function (req, res) {
    var boardId = req.query.boardId;
    var changes = JSON.parse(req.query.changes);
    var user = req.session.userData;
    if (changes) {
        fileService.changeBoardUserType(boardId, changes, user, function (data) {
            res.send(data);
        })
    }
};
exports.loadBoardUserInfo = function (req, res) {
    var boardId = req.query.boardId;
    var userId = req.query.userId;
    fileService.loadBoardUserInfo(boardId, userId, function (data) {
        res.send(data);
    })
};
exports.loadAllTopProcess=function(req,res){
    var user = req.session.userData;
    if(user){
        fileService.findAllTopProcess(function(data){
            res.send(data);
        });
    }
};

exports.loadAllFiles = function (req, res) {
    if(req.query.from==='temp'){
        var user = {
            id:'MFEMT0D1'
            //id:'PKCH5L9U'
        }
    }else{
        var user = req.session.userData;
    }
    var isOut = req.query.isOut;
    var fileType = req.query.fileType;
    if(isOut=='true'){
        isOut=true;
    }else{
        isOut=false;
    }
    if(user){
        fileService.loadAllFileByTrashFlag(user,isOut, fileType,function (data) {
            res.send(data);
        });
    }

};
exports.removeFiles= function (req,res,way) {
    var idArray = [];
    if(way==1){
        idArray = req.body.gFileId;
    }else{
        idArray = req.query.gFileId;
    }
    fileService.removeFiles(idArray,function(data){
        if(data){
            res.send(data);
        }
    });
};

exports.trashFiles = function (req,res,way) {
    var idArray = [];
    if(way==1){
        idArray = req.body.gFileId;
    }else{
        idArray = req.query.gFileId;
    }
    fileService.trashFiles(idArray,function(data){
        if(data){
            res.send(data);
        }
    });
};

exports.restoreFiles = function(req,res,way){
    var idArray = [];
    if(way==1){
        idArray = req.body.gFileId;
    }else{
        idArray = req.query.gFileId;
    }
    fileService.restoreFiles(idArray,function(data){
        if(data){
            res.send(data);
        }
    });
};

exports.renameFile = function (req, res) {
    var id = req.query.gFileId;
    var fileName = req.query.fileName;
    var fileType = req.query.fileType;
    var user = req.session.userData;
    if (user) {
        fileService.renameFile(id, fileName,user,fileType, function (data) {
            res.send(data);
        });
    }
};

exports.findByLikeName = function (req, res) {
    var fileName = req.query.fileName;
    fileService.findByLikeName(fileName, function (data) {
        if (data) {
            res.send(data);
        }
    });
};

exports.putFileMetaData = function(req, res){
    var updateQuery = {};
    var updateData = {};

    if(req.query.fileId){
        updateQuery.id = req.query.fileId;
    }
    if(req.query.fileType){
        updateData.fileType = req.query.fileType;
    }

    if(req.query.isTopProcess){
        updateData.isTopProcess = (req.query.isTopProcess === 'true');
    }
    fileService.updateFileMetaData(updateQuery, updateData, function(message){
        res.send(message);
    });
};
exports.loadAllUserBoard = function (req, res) {
    var userId = req.session.userData.id;
    fileService.findUserBoard(userId, function (data) {
        if (data) {
            res.send(data);
        }
    });
};
exports.addFileType_temp = function (req, res) {
    fileService.addFileType_temp(function (taskNum, processNum) {
        var sum = processNum + taskNum;
        res.send('补充fileType完毕，共查询到'+sum+'条文件记录，其中有'+taskNum+'个已分享的task_design');
    })
};
exports.loadChatHistory = function (req, res) {
    var gFileId = req.param('gFileId');
    fileService.findChatHistory(gFileId, function (data) {
        if (data) {
            res.send(data);
        }
    });
};
exports.loadModelFile = function(req,res){
    var fileId = req.query.fileId;
    fileService.loadOneModelFile(fileId,function(data){
        res.send(data);
    });

};
exports.updateModelFile = function(req,res){
    var fileId = req.body.fileId;
    var fileName = req.body.fileName;
    var fileDesc = req.body.fileDesc;
    var fileIcon = req.body.fileIcon;
    var categoryId = req.body.categoryId;
    //var isSingleSupported = (req.body.isSingleSupported!='false');
    fileService.updateOneModelFile(fileId,fileName,fileDesc,fileIcon,categoryId,function(data){
        res.send(data);
    });
};
exports.taskToProcess = function(req,res){
    var taskFileId = req.body.boardId;
    fileService.taskToProcess(taskFileId,function(data){
        res.send(data);
    });
};

exports.loadAllUserFiles = function (req, res, auth) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    var isPublished = req.query.isPublished;
    var fileType = req.query.fileType;
    var categoryId,ctClass;
    if(fileType === 'course_design'){
        categoryId = req.query.categoryId;
        ctClass = parseInt(req.query.ctClass);
    }
    fileService.loadAllUserFiles(isPublished, fileType, categoryId, ctClass, auth, function (data) {
        res.send(data);
    });
};
exports.getModelIdArr = function (req, next) {
    var fileId = req.param('fileId');
    fileService.getModelIdArr(fileId,function (data) {
        next(data);
    });
};

exports.changePublicState = function(req,res){
    var fileId = req.query.fileId;
    var permission = JSON.parse(req.query.isInstance);
    fileService.changePublicState(fileId,permission, req.session.userData.id,function(message){
        res.send(message);
    });
};
exports.getDocOfXml = function (req, res) {
    var fileId = req.param('fileId');
    fileService.getDocOfXml(fileId,function (data) {
        res.send(data);
    });
};
exports.getCategoryTrees = function (auth, res) {
    fileService.getCategoryTrees(auth, function (data) {
        res.send(data);
    });
};