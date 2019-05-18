var checkSession2 = require('../app_modules/_utils/prehandleRequest.js').checkSession2;
var checkSession = require('../app_modules/_utils/prehandleRequest.js').checkSession;
var message = require('../app_modules/_utils/messageGenerator.js');
var serverCommunication = require('../app_modules/_utils/communication.js');
var fs = require('fs');
var path = require('path');
var subCourseService = require('../app_modules/bpmn_Process_Mgmt/subCourseService.js');
var courseService = require('../app_modules/bpmn_Process_Mgmt/courseService.js');

var fileController = require('../app_modules/bpmn_Process_Mgmt/fileController.js');
var instanceController = require('../app_modules/bpmn_Process_Mgmt/instanceController.js');

var Controller = function (router) {
    var controller = this;
    this.getCategoryTrees(function (categoryTrees) {
        controller.categoryTrees = categoryTrees;
        console.log('get course category tree successfully');
    });
    // v2.2
    router.get('/courseEdit', checkSession, function (req, res) {
        res.header("Content-Type", "text/html; charset=utf-8");
        var courseId = req.query.id;
        courseService.loadInfo(courseId,function(msg){
            console.log(msg);
            if (msg.success){
                res.render('course/courseEdit', {
                    userName: req.session.userData.name,
                    loginHost: router.externalConfig.loginHost[router.externalConfig.runMode],
                    orgHost: router.externalConfig.orgHost[router.externalConfig.runMode],
                    CourseId: msg.data.id,
                    CourseName: msg.data.fileName,
                    BriefDes: msg.data.briefDes,
                    DetailDes: msg.data.fileDesc,
                    FileIcon: msg.data.fileIcon,
                    CategoryId: msg.data.categoryId,
                    TeacherId: msg.data.userId,
                    TeacherName: msg.data.userName,
                    CourseType: msg.data.courseType,
                    IsPublished: msg.data.isPublished,
                    MATERIAL_URL: router.externalConfig.materialUrl[router.externalConfig.runMode]
                });
            } else {
                res.send('wrong course id');
            }
        });
    });
    router.post('/updateCourse/:label', checkSession, function (req, res) {
        controller.updateCourse(req, res);
    });
    router.post('/updateSubCourseInfo', checkSession, function (req, res) {
        controller.updateSubCourseInfo_v2(req, res);
    });
    router.get('/courseCreate', checkSession, function (req, res) {
        res.header("Content-Type", "text/html; charset=utf-8");
        res.render('course/courseCreate', {
            userName: req.session.userData.name,
            loginHost: router.externalConfig.loginHost[router.externalConfig.runMode]
        });
    });
    router.get('/coursesManage', checkSession, function (req, res) {
        res.header("Content-Type", "text/html; charset=utf-8");
        res.render('course/coursesManage', {
            userName: req.session.userData.name,
            loginHost: router.externalConfig.loginHost[router.externalConfig.runMode],
            MATERIAL_URL: router.externalConfig.materialUrl[router.externalConfig.runMode]
        });
    });
    //===end v2.2=====
    router.get('/refreshCategoryTree', function (req, res) {
        controller.getCategoryTrees(function (categoryTrees) {
            controller.categoryTrees = categoryTrees;
            res.send(controller.categoryTrees);
        });
    });
    //向播放器获取课程分类
    router.get('/getCourseCategoryTrees', function (req, res) {
        res.send(controller.categoryTrees);
    });
    //save or update a instance
    router.post('/exchangeSubCourse', checkSession2, function (req, res) {
        controller.exchangeSubCourse(req, res);
    });
    //save or update a instance
    router.post('/saveInstance', checkSession2, function (req, res) {
        controller.saveSubCourse(req, res);
    });
    //打开实例file；引擎也有用到//引擎不再用了161111fz
    router.get('/load/loadInstance', checkSession2, function (req, res) {
        controller.loadSubCourseXml(req, res);
    });
    //??a instance file?????
    router.get('/load/loadInstanceFile',function(req,res){
        controller.loadSubCourseInfo(req,res);
    });
    //update instance ???
    router.post('/save/saveInstanceFile', checkSession2, function(req,res){
        controller.updateSubCourseInfo(req,res);
    });


    // save or update a model file
    router.post('/save', checkSession2, function (req, res) {
        if (req.body.fileType === 'course_design'){
            controller.saveCourse(req, res);
        } else {
            fileController.save(req, res);
        }
    });
    //??model file
    router.get('/load', checkSession2, function (req, res) {
        if (req.query.fileType === 'course_design'){
            controller.loadCourseXml(req, res);
        } else {
            fileController.loadFile(req, res);
        }
    });
    //??????a model file?????
    router.get('/load/loadModelFile', checkSession2, function(req,res){
        var fileType = req.query.fileType;
        if (fileType && fileType === 'course_design'){
            controller.loadCourseInfo(req, res);
        }else {
            fileController.loadModelFile(req, res);
        }
    });
    // update a model file ??????????isSingleSuppoted?
    router.post('/save/saveModelFile', checkSession2, function(req,res){
        if (req.body.fileType && req.body.fileType === 'course_design'){
            controller.updateCourseInfo(req, res);
        } else {
            fileController.updateModelFile(req, res);
        }
    });
    //load all models
    //params: fileType; [isDeleted].
    router.get('/load/loadAllModelFile',checkSession2, function (req, res) {
        var fileType = req.query.fileType;
        if (fileType && fileType === 'course_design'){
            controller.getAllCoursesInfo(req, res);
        } else if (fileType && fileType === 'process_design'){
            controller.getAllSubCoursesInfo(req, res);
        }  else {
            fileController.loadAllFiles(req, res);
        }
    });
    //put file into trash box
    router.get('/toTrash', checkSession2, function (req, res) {
        var  idArray = req.query.gFileId;
        if (req.query.isInstance === 'true') {
            controller.trashSubCourses(req, res, idArray);
        } else {
            controller.trashCourses(req, res, idArray);
        }
    });
    router.post('/allToTrash', checkSession2, function (req, res) {
        var  idArray = req.body.gFileId;
        if (req.body.isInstance[0] === 'true') {
            controller.trashSubCourses(req, res, idArray);
        } else {
            controller.trashCourses(req, res, idArray);
        }
    });
    //彻底删除 model files or instances
    router.get('/remove', checkSession2, function (req, res) {
        var idArray = req.query.gFileId;
        if (req.param('isInstance') === 'true') {
            controller.removeSubCourses(req, res, idArray);
        } else {
            controller.removeCourses(req, res, idArray);
        }
    });
    //彻底删除 model files or instances（可能是多选删除时，要传的数据比较多，所以用post请求的方式）
    router.post('/removeAll', checkSession2, function (req, res) {
        var idArray = req.body.gFileId;
        if (req.body.isInstance[0] === 'true') {
            controller.removeSubCourses(req, res, idArray);
        } else {
            controller.removeCourses(req, res, idArray);
        }
    });
    router.get('/toNormal', checkSession2, function (req, res) {
        var idArray = req.query.gFileId;
        if (req.param('isInstance') === 'true') {
            controller.restoreSubCourses(req, res, idArray);
        } else {
            controller.restoreCourses(req, res, idArray);
        }
    });
    router.post('/allToNormal', checkSession2, function (req, res) {
        var idArray = req.body.gFileId;
        if (req.body.isInstance[0] === 'true') {
            controller.restoreSubCourses(req, res, idArray);
        } else {
            controller.restoreCourses(req, res, idArray);
        }
    });
    //gFileId; fileName; fileType;
    router.get('/rename', checkSession2, function (req, res) {
        controller.renameCourse(req, res);
    });
    router.get('/renameInstance', checkSession2, function (req, res) {
        controller.renameSubCourse(req, res);
    });
    router.get('/update/changePublicState', checkSession2, function (req, res) {
        var isInstance = req.query.isInstance;
        if (isInstance==='true'){
            controller.changeSubCoursePublicState(req, res);
        }else {
            controller.changeCoursePublicState(req, res);
        }
    });

    //===external interface====
    //get all 'course_design' course info  //for player
    //params: fileType; [isDeleted]; [isPublished]; [categoryId]; [ctClass].
    router.get('/getAllModelCourses', function (req, res) {
        //var auth = (new Buffer(router.externalConfig.ocAuth)).toString('base64');
        controller.getAllCoursesInfoForExt(req, res);
    });
    //get all sub courses' of the parent course //for player//ecgeditor use it too after v2.2(contained)
    router.get('/getCoursesOfCourse', function (req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");
        //get xml
        //get sub courses' id
        //get sub courses' info
        controller.getSubCoursesInfoOfCourseForExt(req, res);
    });
    // get the sub course's info //for player;for engine
    router.get('/getSingleCourseInfo', function (req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");
        controller.getSubCourseInfo(req,res);
    });
    //get all roles of the sub course //for engine
    router.get('/load/loadAllLane', checkSession2, function (req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");
        controller.loadAllLane(req, res);
    });
    //get all sub courses of the user //for ZhangWei
    router.get('/getInstanceByUser',function(req,res){
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");
        controller.getInstanceByUser(req,res);
    });
    //get translated xml file //for engine
    router.get('/load/loadStandardXml', function (req, res) {
        controller.loadStandardXml(req, res);
    });
    //===end interface====

    router.get('/temp/transCourseData', function (req, res) {
        var user = req.session.userData;
        subCourseService.getManyInfoByTrashFlag(user, false, null, function (courses) {
            courses = courses.data;
            var count=0;
            console.log('courses number:' + courses.length);
            for (var i = 0; i<courses.length; i++){
                var instanceId = courses[i].gFileId;
                (function(instanceId, i){
                    console.log('---------read '+i+' : '+instanceId);
                    fs.readFile(path.join(__dirname, '../_static_content/BPMN_files/normal/' + instanceId + '.xml'), 'utf-8', function (err, data) {
                        if (err) {
                            res.send(message.genSimpFailedMsg('no_file', instanceId));
                            //throw err;
                        } else {
                            data = data.replace(/newengine3w.xuezuowang.com/g, 'localhost:8080');
                            console.log('---------write '+i+' : '+instanceId);
                            fs.writeFileSync(path.join(__dirname, '../_static_content/BPMN_files/normal_new/' + instanceId + '.xml'), data, 'utf-8');
                            count++;
                            console.log(count);
                            if (count === courses.length){
                                res.send('yeah~');
                            }
                        }
                    });
                })(instanceId, i)
            }
        });
    });

    /**************************课程授权接口**********************/
    router.post('/getSysOrgList', checkSession2, function (req, res) {
        controller.getSysOrgList(req, res);
    });
    router.post('/getAuthorizedInfos', checkSession2, function (req, res) {
        controller.getAuthorizedInfos(req, res);
    });
    router.post('/authorizeToDept', checkSession2, function (req, res) {
        controller.authorizeToDept(req, res);
    });
    router.post('/authorizeToUser', checkSession2, function (req, res) {
        controller.authorizeToUser(req, res);
    });
    router.post('/cancelAuthorizeOfDept', checkSession2, function (req, res) {
        controller.cancelAuthorizeOfDept(req, res);
    });
    router.post('/cancelAuthorizeOfUser', checkSession2, function (req, res) {
        controller.cancelAuthorizeOfUser(req, res);
    });
};
Controller.prototype.getCategoryTrees = function (next) {
    var path = '/getCourseType';
    //oc abandoned in v2.1;
    //var path = '/index.php/apps/courseplayer/getCourseTypes';
    serverCommunication.OrgServer(null, 'get', path, '', null, "application/json", function (data) {
        if (data){
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
Controller.prototype.loadStandardXml = function (req, res) {
    var source = req.query.source;
    var instanceId = req.query.instanceId;
    var isCooperation = (req.query.isCooperation!="0");
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    if (source==='egn'){
        subCourseService.loadInfo(instanceId, 'ext', function (data) {
            if (data.success){
                subCourseService.loadStandardXml(instanceId, isCooperation, function (resData) {
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
Controller.prototype.getInstanceByUser = function(req,res) {
    var userId = req.query.userId;
    if (userId){
        var isPublished = req.query.isPublished;
        var isCooperation = req.query.isCooperation;
        subCourseService.getInstanceByUser(userId, isPublished, isCooperation, function (message) {
            res.send(message);
        });
    } else {
        res.send(message.genSimpFailedMsg('miss_user_id', null));
    }
};
Controller.prototype.loadAllLane = function (req, res) {
    var fileId = req.query.fileId;
    subCourseService.loadAllLane(fileId, function (resData) {
        if (req.query.jsonCallBack){//解决龙龙org跨域问题，161009
            var callbackName = req.query.jsonCallBack;
            var sendStr = callbackName + '('+JSON.stringify(resData)+')';
            res.send(sendStr);
        }else {
            res.send(resData);
        }
    })
};
Controller.prototype.getSubCourseInfo = function(req,res) {
    var fileId = req.query.courseId;
    subCourseService.loadInfo(fileId, 'ext',function (message) {
        res.send(message);
    });
};
Controller.prototype.getAllCoursesInfo = function (req, res) {
    //origin-pass temporarily for testing
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    var user = req.session.userData;
    var isDeleted = (req.query.isDeleted==='true');
    var courseType = req.query.courseType;
    courseService.getManyInfoByTrashFlag(user, isDeleted, courseType, function (data) {
        res.send(data);
    });
};
//from 'loadAllUserFiles'
Controller.prototype.getAllCoursesInfoForExt = function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    var isPublished = req.query.isPublished;
    var isDeleted = (req.query.isDeleted==='true');
    var fileType = req.query.fileType;
    var categoryId,ctClass;
    if(fileType === 'course_design'){
        categoryId = req.query.categoryId;
        ctClass = parseInt(req.query.ctClass);
    }
    courseService.getManyInfoForExt(this.categoryTrees, isDeleted, isPublished, fileType, categoryId, ctClass, function (data) {
        res.send(data);
    });
};
/**
 *
 * @param fileId
 * @param isPublished: 'true'|'false'|undefined
 * @param isLearnable: '0'|not '0'|undefined  //isLearnable可直接学习，有值（除了0以外任何值）则返回isCooperation=false的记录
 * @param source: editor
 */
Controller.prototype.getSubCoursesInfoOfCourseForExt = function (req, res) {
    //get xml
    //get sub courses' id
    //get sub courses' info
    var fileId = req.query.fileId;
    var source = req.query.source;
    var isPublished = req.query.isPublished;
    var isLearnable = req.query.isLearnable;
    isPublished = (isPublished === 'true') ? true : ((isPublished === 'false') ? false : undefined);
    var isCooperation = (isLearnable === '0') ? true : ((isLearnable === '1') ? false : undefined);
    courseService.getSubCourseIdArr(fileId, function (subCourseIdMsg) {
        if (subCourseIdMsg.success){
            if(subCourseIdMsg.data.length>0){
                //get sub courses' info
                var subCourseInfoArr = subCourseIdMsg.data;
                var count = 0;
                for (var i = 0; i < subCourseIdMsg.data.length; i++){
                    subCourseService.loadInfo(subCourseIdMsg.data[i], (source)?source:'ext', function(resData){
                        count++;
                        if (resData.success){
                            try{
                                var subCourseInfo = resData.data;
                                var index = subCourseInfoArr.indexOf(subCourseInfo.courseId);
                                //check limitation
                                if ((isPublished!==undefined) && (subCourseInfo.isPublished!==isPublished)) {
                                    subCourseInfoArr[index] = null;
                                }
                                if ((isCooperation!==undefined) && (subCourseInfo.isCooperation!==isCooperation)) {
                                    subCourseInfoArr[index] = null;
                                }
                                if (subCourseInfoArr[index]){
                                    subCourseInfoArr[index] = subCourseInfo;
                                }
                            } catch (err){
                                throw err;
                            }
                        }else {
                            res.send(message.genSimpFailedMsg('some instance not exist', null));
                        }
                        if (count === subCourseIdMsg.data.length){
                            // remove all null items
                            var resSubCourseInfoArr = [];
                            for (var i = 0; i <subCourseInfoArr.length; i++){
                                if (subCourseInfoArr[i]){
                                    resSubCourseInfoArr.push(subCourseInfoArr[i]);
                                }
                            }
                            res.send(message.genSimpSuccessMsg('', resSubCourseInfoArr));
                        }

                    });
                }

            } else {
                res.send(message.genSimpSuccessMsg('no situation file in this course', []))
            }
        }else {
            res.send(message.genSimpFailedMsg('no situation file in this course', null));
        }
    });
};
Controller.prototype.loadCourseInfo = function(req,res){
    var fileId = req.query.fileId;
    courseService.loadInfo(fileId,function(data){
        res.send(data);
    });
};
Controller.prototype.loadCourseXml = function (req, res) {
    var id=req.query.gFileId;
    courseService.loadXml(id, req.session.userData, function (data) {
        res.send(data);
    });
};
//from 'save'
Controller.prototype.saveCourse = function (req, res) {
    var saveNewFile = req.body.isSaveNewFile;
    var name = req.body.fileName;
    var courseType = req.body.courseType;
    var graphXml = req.body.xml;
    var user = req.session.userData;
    if (saveNewFile === 'true'){
        //create course
        var briefDes = req.body.briefDes;
        var detailDes = req.body.fileDesc;
        var fileType = req.body.fileType;
        var categoryId = req.body.categoryId;
        var fileIcon = req.body.fileIcon;
        courseService.create(name, briefDes, detailDes,fileType, courseType, categoryId, fileIcon, graphXml, user, function (data) {
            res.send(data);
        });
    } else {
        //update Xml
        var id = req.body.gFileId;
        courseService.updateXml(id, name, courseType, graphXml, user, function (data) {
            res.send(data);
        });
    }
};
//from 'updateModelFile'
Controller.prototype.updateCourseInfo = function(req,res){
    var fileId = req.body.fileId;
    var fileName = req.body.fileName;
    var briefDes = req.body.briefDes;
    var detailDes = req.body.detailDes;
    var categoryId = req.body.categoryId;
    var fileIcon = req.body.fileIcon;
    courseService.updateInfo(fileId,fileName,briefDes,detailDes,categoryId,fileIcon,function(data){
        res.send(data);
    });
};
Controller.prototype.trashCourses = function (req,res,idArray) {
    courseService.trashMany(idArray,function(data){
        if(data){
            res.send(data);
        }
    });
};
Controller.prototype.removeCourses= function (req,res,idArray) {
    courseService.removeMany(idArray,function(data){
        if(data){
            res.send(data);
        }
    });
};
Controller.prototype.restoreCourses = function(req,res,idArray){
    courseService.restoreMany(idArray,function(data){
        if(data){
            res.send(data);
        }
    });
};
Controller.prototype.renameCourse = function (req, res) {
    var id = req.query.gFileId;
    var fileName = req.query.fileName;
    var fileType = req.query.fileType;
    var user = req.session.userData;
    courseService.rename(id, fileName,user,fileType, function (data) {
        res.send(data);
    });
};
Controller.prototype.changeCoursePublicState = function(req,res){
    var fileId = req.query.fileId;
    var permission = (req.query.isInstance)?(JSON.parse(req.query.isInstance)):'1';
    courseService.changePublicState(fileId,permission, req.session.userData.id,function(message){
        res.send(message);
    });
};

Controller.prototype.exchangeSubCourse = function(req,res){
    var parentId = req.body.parentId;
    var subCourseId1 = req.body.subCourseId1;
    var subCourseId2 = req.body.subCourseId2;
    courseService.loadInfo(parentId, function(msg){
        if (msg.success){
            var subCourseIds = (msg.data.subCourseIds)?(msg.data.subCourseIds):[];
            if(subCourseIds.length > 0){
                var subCourseIdsStr = subCourseIds.join(",").replace(subCourseId2, "subCourseId2").replace(subCourseId1, subCourseId2).replace("subCourseId2", subCourseId1);
                courseService.update(parentId, {subCourseIds:subCourseIdsStr.split(",")}, function(msg){
                    if (msg.success){
                        res.send(msg);
                    }else {
                        res.send(message.genSimpFailedMsg('fail-to-exchange-subCOurse', null));
                    }
                });
            }else {
                res.send(message.genSimpFailedMsg('fail-to-exchange-subCOurse', null));
            }
        }
    })
};

//from 'save'
Controller.prototype.saveSubCourse = function (req, res) {
    if (req.body.isUpdateFile=="true") {
        var id = req.body.fileId;
        var xml = req.body.xml;
        var rolePool = req.body.rolePool;
        var rolePoolArr = JSON.parse(rolePool);
        var user = req.session.userData;
        var isCooperation;
        //1.role范围包括1 2.泳道中角色只有一个。则isCooperation=false
        if (rolePoolArr.length === 1) {
            subCourseService.loadInfo(id, null, function (resMsg) {
                if (resMsg.success){
                    groupRange = JSON.parse(resMsg.data.groupRange);
                    if ((groupRange.minRole < 2) && (groupRange.maxRole > 1)){
                        isCooperation = false;
                        subCourseService.update(id, xml, isCooperation, rolePool, user, function (resData) {
                            res.send(resData);
                        });
                    }else {
                        isCooperation = true;
                        subCourseService.update(id, xml, isCooperation, rolePool, user, function (resData) {
                            res.send(resData);
                        });
                    }
                }
            });
        }else {
            isCooperation = true;
            subCourseService.update(id, xml, isCooperation, rolePool, user, function (resData) {
                res.send(resData);
            });
        }
    }else {
        var name = req.body.name;
        var parentId = req.body.parentId;
        var briefDes = req.body.briefDes;
        var detailDes = req.body.detailDes;
        var courseType = req.body.courseType;
        var fileIcon = req.body.fileIcon;
        var isCooperation = (req.body.isCooperation=='true');
        var groupRange = req.body.groupRange;
        var user = req.session.userData;
        var graphXml = req.body.xml;
        var rolePool = req.body.rolePool;
        var xmlId = req.body.xmlId;
        var addIdToParent = function (id, next) {
            courseService.loadInfo(parentId, function(msg){
                if (msg.success){
                    var subCourseIds = (msg.data.subCourseIds)?(msg.data.subCourseIds):[];
                    subCourseIds.push(id);
                    courseService.update(parentId, {subCourseIds:subCourseIds}, function(msg){
                        if (msg.success){
                            next();
                        }
                        else {
                            res.send(message.genSimpFailedMsg('fail-to-add-in-parent', null));
                        }
                    });
                }
            })
        };
        if (xmlId) {
            //cp ori sub-course's xml, isCooperation, rolePool
            try{
                graphXml = fs.readFileSync(path.join(__dirname, '../_static_content/BPMN_files/normal/' + xmlId + '.xml'), 'utf-8');
            }catch (e){
                console.log(message.genSimpFailedMsg('ori-xml not exist', null));
                throw e;
            }
            subCourseService.loadInfo(xmlId, null, function (resMsg) {
                if (resMsg.success){
                    isCooperation = resMsg.data.isCooperation;
                    rolePool = resMsg.data.rolePool;
                    subCourseService.createCourse(graphXml, name, parentId, briefDes, detailDes, courseType, fileIcon, isCooperation, groupRange, rolePool, user, function (resData) {
                        addIdToParent(resData.data.id, function () {
                            res.send(resData);
                        });
                    });
                }else {
                    res.send(message.genSimpFailedMsg('ori-file not exist', null));
                }
            })
        }else {
            subCourseService.createCourse(graphXml, name, parentId, briefDes, detailDes, courseType, fileIcon, isCooperation, groupRange, rolePool, user, function (resData) {
                addIdToParent(resData.data.id, function () {
                    res.send(resData);
                });
            });
        }
    }
};
Controller.prototype.removeSubIdFromParent = function (subId, parentId, next) {
    courseService.loadInfo(parentId, function(msg){
        if (msg.success){
            var subCourseIds = (msg.data.subCourseIds)?(msg.data.subCourseIds):[];
            if (subCourseIds.length > 0){
                var index = subCourseIds.indexOf(subId);
                if (index >= 0){
                    subCourseIds.splice(index, 1);
                    courseService.update(parentId, {subCourseIds:subCourseIds}, function(msg){
                        if (msg.success){
                            next(true);
                        }
                        else {
                            next(false);
                        }
                    });
                }
            }
        }
    })
};
Controller.prototype.updateSubCourseInfo = function(req,res){
    var id = req.body.instanceId;
    var name = req.body.instanceName;
    var fileIcon = req.body.fileIcon;
    //var description = req.query.instanceDes;
    var detailDes = req.body.detailDes;
    var groupRange = req.body.groupRange;
    var isCooperation = (req.body.isCooperation!=="false");
    subCourseService.updateInfo(id,name,detailDes,fileIcon,groupRange,isCooperation,function(resData){
        res.send(resData);
    });
};
Controller.prototype.loadSubCourseInfo = function(req,res){
    var instanceId = req.query.instanceId;
    subCourseService.loadInfo(instanceId, 'editor', function(resData){
        res.send(resData);
    });
};
Controller.prototype.loadSubCourseXml = function(req,res){
    var id;
    id = req.query.instanceId;
    subCourseService.loadXml(id, req.session.userData, function (data) {
        res.send(data);
    });
};
Controller.prototype.getAllSubCoursesInfo = function (req, res) {
    var user = req.session.userData;
    var isDeleted = (req.query.isDeleted==='true');
    var courseType = (req.query.courseType)?(req.query.courseType):null;
    subCourseService.getManyInfoByTrashFlag(user, isDeleted, courseType, function (data) {
        res.send(data);
    });
};

Controller.prototype.trashSubCourses = function (req, res, idArray) {
    subCourseService.trashMany(idArray, this.removeSubIdFromParent, function (data) {
        if (data) {
            res.send(data);
        }
    });
};

Controller.prototype.removeSubCourses = function (req, res, idArray) {
    subCourseService.removeMany(idArray, function (data) {
        if (data) {
            res.send(data);
        }
    });
};

Controller.prototype.restoreSubCourses = function (req, res, idArray) {
    subCourseService.restoreMany(idArray,function(data){
        if(data) {
            res.send(data);
        }
    });
};
Controller.prototype.renameSubCourse = function (req, res) {
    var id = req.query.gFileId;
    var fileName = req.query.fileName;
    var user = req.session.userData;
    subCourseService.rename(id, fileName,user, function (data) {
        res.send(data);
    });
};
Controller.prototype.changeSubCoursePublicState = function(req,res){
    var instanceId = req.query.fileId;
    subCourseService.changePublicState(instanceId, req.session.userData.id,function(message){
        res.send(message);
    });
};
//v2.2
Controller.prototype.updateCourse = function(req,res){
    var paramObj = {};
    var courseId = req.body.id;
    for (var param in req.body){
        if (param!='id'){
            paramObj[param] = req.body[param];
        }
    }
    courseService.update(courseId, paramObj, function(msg){
        res.send(msg);
    });
};
Controller.prototype.updateSubCourseInfo_v2 = function(req,res){
    var paramObj = {};
    var courseId = req.body.id;
    for (var param in req.body){
        if (param!='id'){
            paramObj[param] = req.body[param];
        }
    }
    subCourseService.updateInfo_v2(courseId, paramObj, function(msg){
        res.send(msg);
    });
};
/*****************************课程授权相关****************************/
Controller.prototype.getSysOrgList = function(req,res){
    var paramObj = {};
    for (var param in req.body){
        if (param!='id'){
            paramObj[param] = req.body[param];
        }
    }
    if(req.session.userData){
        paramObj.userData = req.session.userData;
    }
    serverCommunication.OrgServer(paramObj, 'post', '/org/getSysOrgList', '', null, "application/json", function (data) {
        res.send(data);
    });
};
Controller.prototype.getAuthorizedInfos = function(req,res){
    var paramObj = {};
    for (var param in req.body){
        if (param!='id'){
            paramObj[param] = req.body[param];
        }
    }
    if(req.session.userData){
        paramObj.userData = req.session.userData;
    }
    serverCommunication.OrgServer(paramObj, 'post', '/org/getAuthorizedInfos', '', null, "application/json", function (data) {
        res.send(data);
    });
};
Controller.prototype.authorizeToDept = function(req,res){
    var paramObj = {};
    for (var param in req.body){
        if (param!='id'){
            paramObj[param] = req.body[param];
        }
    }
    if(req.session.userData){
        paramObj.userData = req.session.userData;
    }
    serverCommunication.OrgServer(paramObj, 'post', '/org/authorizeToDept', '', null, "application/json", function (data) {
        res.send(data);
    });
};
Controller.prototype.authorizeToUser = function(req,res){
    var paramObj = {};
    for (var param in req.body){
        if (param!='id'){
            paramObj[param] = req.body[param];
        }
    }
    if(req.session.userData){
        paramObj.userData = req.session.userData;
    }
    serverCommunication.OrgServer(paramObj, 'post', '/org/authorizeToUser', '', null, "application/json", function (data) {
        res.send(data);
    });
};
Controller.prototype.cancelAuthorizeOfDept = function(req,res){
    var paramObj = {};
    for (var param in req.body){
        if (param!='id'){
            paramObj[param] = req.body[param];
        }
    }
    if(req.session.userData){
        paramObj.userData = req.session.userData;
    }
    serverCommunication.OrgServer(paramObj, 'post', '/org/cancelAuthorizeOfDept', '', null, "application/json", function (data) {
        res.send(data);
    });
};
Controller.prototype.cancelAuthorizeOfUser = function(req,res){
    var paramObj = {};
    for (var param in req.body){
        if (param!='id'){
            paramObj[param] = req.body[param];
        }
    }
    if(req.session.userData){
        paramObj.userData = req.session.userData;
    }
    serverCommunication.OrgServer(paramObj, 'post', '/org/cancelAuthorizeOfUser', '', null, "application/json", function (data) {
        res.send(data);
    });
};
module.exports = Controller;