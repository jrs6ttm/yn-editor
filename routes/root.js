var fs = require('fs');
var path = require('path');
var dateFormat = require('../www/app_cs_js/dateFormat.js');
var serverCommunication = require('../app_modules/_utils/communication.js');
var fileController = require('../app_modules/bpmn_Process_Mgmt/fileController.js');
var instanceController = require('../app_modules/bpmn_Process_Mgmt/instanceController.js');
var userController = require('../app_modules/account_Mgmt/userController.js');
var richTextController = require('../app_modules/rich_text_mgmt/richTextController.js');
var message = require('../app_modules/_utils/messageGenerator.js');
var learningResController = require('../app_modules/learning_resc_mgmt/learningResController.js');
var FileSystemService = require('../app_modules/learning_resc_mgmt/FileSystemService.js');
var logController = require('../app_modules/log_mgmt/logController.js');
//龙龙的试题监控日志，已弃用
//var LogObj = require('./Log.js');
//var LogClient = LogObj.logClient;
var Log = require('./Log.js');

var ObjectId = require('mongodb').ObjectID;
var examController = require('../app_modules/exam_mgmt/examController.js');
var FSService = new FileSystemService();
var taskCommentController = require('../app_modules/bpmn_Process_Mgmt/taskCommentController.js');
var emailController = require('../app_modules/email_mgmt/emailController.js');

var uuid = require('node-uuid');
//for receiving form data file 160817; 'connect-multiparty' -> 'multiparty',160927
var multiparty = require('multiparty');
var OfficeRoute = require('./office.js');
var objLogManager = require('../node_modeles_ext/LoggerForNodeJs/myLogManager/LogManager.js').ObjLogManager;
var CourseManager = require('./courseManager.js');
var checkSession2 = require('../app_modules/_utils/prehandleRequest.js').checkSession2;
var checkSession = require('../app_modules/_utils/prehandleRequest.js').checkSession;

module.exports = function (app) {
    app.use
    new OfficeRoute(app);
    new CourseManager(app);
    Log(app);
    //部署系统时，检验、创建一些文件夹
    var makeDir = function (innerDirPath, next) {
        var dirPath = path.join(__dirname, '../',innerDirPath);
        fs.stat(dirPath, function(err, stats) {
            if (err || (!stats.isDirectory())) {
                fs.mkdir(dirPath, function(err) {
                    if (err) {
                        throw err;
                    } else {
                        objLogManager.WriteLogInfoInfo(dirPath + ' created successfully');
                        if (next) {
                            next();
                        }
                    }
                })
            }
        });
    };
    //部署系统时，检验、创建一些文件夹
    makeDir('./_static_content', function () {
        makeDir('./_static_content/BPMN_files', function () {
            makeDir('./_static_content/BPMN_files/normal');
            makeDir('./_static_content/BPMN_files/trash');
        });
        makeDir('./_static_content/LogFolder');
    });
    //makeDir('./www/temp');
    var multipartyMiddleware = function (req,res,next) {
        var form = new multiparty.Form({'autoFiles':true,'uploadDir':'./www/temp/'});
        form.parse(req, function(err, fields, files) {
            if (err){
                res.send(message.genSimpFailedMsg('error', err));
            }else {
                req.fields = fields;
                req.files = (files.file)?files.file[0]:null;
                next();
            }
        });
    };
    app.get('/', function (req, res) {
        checkSession(req, res, function(){
            if (req.query.ui&&(/*req.query.ui==='course_design'||*/req.query.ui==='process_design'||req.query.ui==='task_design')){
                res.render('app', {
                    isStartProcessEngine: app.externalConfig.isStartProcessEngine,
                    userName: req.session.userData.name,
                    userRole: req.session.userData.role,
                    userId: req.session.userData.id,
                    apiKey: req.session.userData.apiKey,
                    resourceServerHost:app.externalConfig.resourceServerHost[app.externalConfig.runMode],
                    materialUrl:app.externalConfig.materialUrl[app.externalConfig.runMode],
                    imageServerHost:app.externalConfig.imageServerHost[app.externalConfig.runMode],
                    engineSocketUrl:app.externalConfig.engineSocketUrl[app.externalConfig.runMode],
                    loginHost:app.externalConfig.loginHost[app.externalConfig.runMode],
                    orgHost:app.externalConfig.orgHost[app.externalConfig.runMode],
                    examUrl:app.externalConfig.examUrl[app.externalConfig.runMode],
                    localHost:app.externalConfig.localHost[app.externalConfig.runMode],
                    pageOfficeHost:app.externalConfig.pageOfficeHost[app.externalConfig.runMode]
                });
                //if (req.session.userData) {
                //    if (req.query.ui === undefined) {
                //        res.redirect('/?ui=process_design');
                //        return;
                //        //} else if (req.query.ui === 'task_design' && !req.query.theKey) {
                //        //    //res.redirect('/?ui=task_design&theKey='+req.session.userData.apiKey);
                //        //    res.redirect('/?ui=task_design');
                //    }
                //
                //    if(!req.cookies.userAuth || req.cookies.userAuth === 'undefined'){
                //        //设置cookie
                //        res.cookie('sysCookieId', req.session.sysCookieId);
                //        res.cookie('userAuth', req.session.auth);
                //    }
                //    console.log('session登入成功');
                //    res.render('app', {
                //        isStartProcessEngine: app.externalConfig.isStartProcessEngine,
                //        userName: req.session.userData.name.firstName + ' ' + req.session.userData.name.lastName,
                //        userId: req.session.userData.id,
                //        apiKey: req.session.userData.apiKey,
                //        resourceServerHost:app.externalConfig.resourceServerHost[app.externalConfig.runMode]
                //    });
                //} else if (req.cookies.userAuth && req.cookies.userAuth != 'undefined'){
                //    console.log('cookie登入。userAuth: ' + req.cookies.userAuth);
                //    getUserSelfInfo(req.cookies.userAuth, function (userData) {
                //        req.session.userData = userData;
                //        //req.session.auth = (new Buffer(userData.username+':'+ userData.password)).toString('base64');
                //        if (req.query.ui === undefined) {
                //            res.redirect('/?ui=process_design');
                //            return;
                //        }
                //        console.log('cookie登入成功');
                //        res.render('app', {
                //            isStartProcessEngine: app.externalConfig.isStartProcessEngine,
                //            userName: req.session.userData.name.firstName + ' ' + req.session.userData.name.lastName,
                //            userId: req.session.userData.id,
                //            apiKey: req.session.userData.apiKey,
                //            resourceServerHost:app.externalConfig.resourceServerHost[app.externalConfig.runMode]
                //        });
                //    });
                //    //checkSessionInUMB(req, function (hasSession) {
                //    //    if (hasSession) {
                //    //        if (req.query.ui === undefined) {
                //    //            res.redirect('/?ui=process_design');
                //    //            return;
                //    //        }
                //    //        res.render('app', {
                //    //            isStartProcessEngine: app.externalConfig.isStartProcessEngine,
                //    //            userName: req.session.userData.name.firstName + ' ' + req.session.userData.name.lastName,
                //    //            userId: req.session.userData.id,
                //    //            apiKey: req.session.userData.apiKey
                //    //        });
                //    //    } else {
                //    //        //res.cookie('fz','fz');
                //    //        res.redirect('/login');
                //    //    }
                //    //})
                //} else{
                //    console.log('没有session或cookie');
                //    res.cookie('lastModify',new Date());
                //    res.redirect('/login');
                //}
            } else if (req.query.ui&&(req.query.ui==='course_design')){
                if (req.query.gFileId){
                    res.redirect('/courseEdit?id=' + req.query.gFileId);
                }else {
                    res.redirect('/courseCreate');
                }
            } else {
                res.redirect('/coursesManage');
            }
        });
    });
    app.get('/logout', function (req, res) {
        if(app.externalConfig.runMode === 'dev'){
            if (req.session.userData){
                req.session.destroy();
                res.redirect('http://' + app.externalConfig.loginHost[app.externalConfig.runMode] + '/login');
            }
        } else {
            var path = '/app/logout';
            //oc abandoned in v2.1;
            //var path = '/index.php/apps/courseplayer/getCourseTypes';
            serverCommunication.OrgServer(null, 'get', path, '', null, "application/json", function (data) {
                if (data){
                    res.redirect('http://' + app.externalConfig.loginHost[app.externalConfig.runMode]);
                } else {
                    objLogManager.WriteLogInfoInfo('err-in-logout:'+ req.session.userData.name);
                    res.send('err-in-logout');
                };
            })
        }
        //var main_usid=req.cookies.main_usid;
        //var path = '/session/logOut?mainUsid='+main_usid;
        //serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
        //    if (data.success) {
        //        var userData = userSessionMap[req.cookies.ecg_usid];
        //        console.log(userData);
        //        //userSessionMap[req.cookies.ecg_usid]=null;
        //        //userData = null;
        //        //delete userData.tfz;
        //        //console.log(Object.is(userData,req.session.userData));
        //        console.log(Object.is(tfz, req.session));
        //        console.log(req.session.userData);
        //
        //        //delete req.session.userData;
        //        //delete userSessionMap[req.cookies.ecg_usid];
        //        //res.clearCookie('ecg_usid');
        //        //res.clearCookie('main_usid');
        //        //userController.removeUserApi(req);
        //        //console.log('log out');
        //        res.redirect('/');
        //    } else {
        //        if (data.msg === 'not found'){
        //            delete req.session.userData;
        //            delete userSessionMap[req.cookies.ecg_usid];
        //            res.clearCookie('ecg_usid');
        //            res.clearCookie('main_usid');
        //            userController.removeUserApi(req);
        //            console.log('no user info');
        //            res.redirect('/');
        //        } else {
        //            res.send(data);
        //        }
        //    }
        //});
    });
    /*
    var checkLogin = function (req, res, next) {
        if (req.session.userData){
            console.log('session登入成功');
            if (next){
                next(message.genSimpSuccessMsg('has session', null));
            }
        } else if (req.cookies.ecg_usid){
            if (userSessionMap[req.cookies.ecg_usid]){
                req.session.userData = userSessionMap[req.cookies.ecg_usid];
                console.log('ecg session登入成功');
                if (next){
                    next(message.genSimpSuccessMsg('has ecg session', null));
                }
            } else {

                next(message.genSimpFailedMsg('no', null));
            }
        } else if (req.cookies.main_usid){
            console.log(req.cookies.main_usid);
            checkSessionInUMB(req, res, function (isSuccess) {
                if(isSuccess){
                    console.log('main session登入成功');
                    if (next){
                        next(message.genSimpSuccessMsg('has main session', null));
                    }
                } else {
                    console.log('umb中无登入信息');
                    if (next){
                        next(message.genSimpFailedMsg('no umb', null));
                    }
                }
            })
        } else {
            console.log('没有session，失败');
            if (next){
                next(message.genSimpFailedMsg('no session', null));
            }
        }

        //if (req.session.userData) {
        //    if(!req.cookies.userAuth || req.cookies.userAuth === 'undefined'){
        //        //设置cookie
        //        res.cookie('sysCookieId', req.session.sysCookieId);
        //        res.cookie('userAuth', req.session.auth);
        //    }
        //    console.log('session登入成功');
        //    if (next){
        //        next(message.genSimpSuccessMsg('has session', null));
        //    }
        //} else if (req.cookies.userAuth && req.cookies.userAuth != 'undefined'){
        //    console.log('cookie登入。userAuth: ' + req.cookies.userAuth);
        //    getUserSelfInfo(req.cookies.userAuth, function (userData) {
        //        req.session.userData = userData;
        //        console.log('cookie登入成功');
        //        if (next){
        //            next(message.genSimpSuccessMsg('has session', null));
        //        }
        //    });
        //} else {
        //    console.log('没有session或cookie');
        //    res.cookie('lastModify',new Date());
        //    if (next){
        //        next(message.genSimpFailedMsg('no session', null));
        //    }
        //}
    };

    var checkLoginToLogin = function (req, res, next) {
        checkLogin(req, res, function (msg) {
            if(msg.success){
                next();
            } else {
                res.redirect('http://' + (app.externalConfig.localHost[app.externalConfig.runMode].split(":"))[0] + ':3000/login');
            }
        });
    };
     */
    //var userSessionMap = {};
    //var tfz;
    //var checkSessionInUMB = function (req,res, next) {
    //    var main_usid = req.cookies.main_usid;
    //    var server = app.externalConfig.localHost[app.externalConfig.runMode];
    //    var path = '/session/checkSession?mainUsid='+main_usid+'&server='+server;
    //    serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
    //        if (data.success) {
    //            req.session.userData = data.data.userInfo;//session
    //            tfz = req.session;
    //            req.session.userData.tfz='6';
    //            var usid = uuid.v1();
    //            res.cookie('ecg_usid', usid);//cookie
    //            userSessionMap[usid] =req.session.userData;//user session map
    //            console.log(userSessionMap);
    //            next(true);
    //        } else {
    //            next(false);
    //        }
    //    });
    //};
    var getUserSelfInfo = function (userAuth, next) {
        var path = '/user/checkUser?auth=' + userAuth;
        serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
            var result;
            if(data.success){
                var userData = {
                    id: data.data.id2,
                    username: data.data.username,
                    password: data.data.password
                };
                next(userData);
            }
        });
    };
    //===file handler=====
    //[moved]save or update a instance
    //app.post('/saveInstance', checkSession2, function (req, res) {
    //    instanceController.save(req, res);
    //});
    //[moved]save or update a model file
    //app.post('/save', checkSession2, function (req, res) {
    //    fileController.save(req, res);
    //});
    //[moved]打开model file
    //app.get('/load', checkSession2, function (req, res) {
    //    //if (req.param('ch')){
    //    //    var userApi = userController.getUserApi();
    //    //    userApi.push({
    //    //        apiKey:req.param('userKey')
    //    //    });
    //    //} else {
    //    var userApi = userController.getUserApi();
    //    //}
    //    //console.log(userApi);
    //    fileController.loadFile(userApi, req, res);
    //
    //});
    //[moved]//似乎是：查询a model file的详细信息
    //app.get('/load/loadModelFile', checkSession2, function(req,res){
    //    fileController.loadModelFile(req,res);
    //});
    //[moved] update a model file 的属性（名字，描述，isSingleSuppoted）
    //app.post('/save/saveModelFile', checkSession2, function(req,res){
    //    fileController.updateModelFile(req,res);
    //});
    //[moved]打开实例file；引擎也有用到//引擎不再用了161111fz
    //app.get('/load/loadInstance', checkSession2, function (req, res) {
    //    var userApi = userController.getUserApi();
    //    instanceController.loadFile(userApi, req, res);
    //});
    //[moved] 查询a instance file的详细信息
    //app.get('/load/loadInstanceFile',function(req,res){
    //    instanceController.loadInstanceFile(req,res);
    //});
    //[moved]update instance 的属性
    //app.post('/save/saveInstanceFile', checkSession2, function(req,res){
    //    instanceController.updateInstanceFile(req,res);
    //});
    //[moved]load all models
    //app.get('/load/loadAllModelFile',checkSession2, function (req, res) {
    //    fileController.loadAllFiles(req, res);
    //});
    //[moved] put file into trash box
    //app.get('/toTrash', checkSession2, function (req, res) {
    //    if (req.param('isInstance') === 'true') {
    //        instanceController.trashInstances(req, res, 0);
    //    } else {
    //        fileController.trashFiles(req, res, 0);
    //    }
    //});
    // [moved]
    //app.post('/allToTrash', checkSession2, function (req, res) {
    //    if (req.body.isInstance[0] === 'true') {
    //        instanceController.trashInstances(req, res, 1);
    //    } else {
    //        fileController.trashFiles(req, res, 1);
    //    }
    //});
    //[moved] 彻底删除 model files or instances
    //app.get('/remove', checkSession2, function (req, res) {
    //    if (req.param('isInstance') === 'true') {
    //        instanceController.removeInstances(req, res, 0);
    //    } else {
    //        fileController.removeFiles(req, res, 0);
    //    }
    //});
    //[moved] 彻底删除 model files or instances（可能是多选删除时，要传的数据比较多，所以用post请求的方式）
    //app.post('/removeAll', checkSession2, function (req, res) {
    //    if (req.body.isInstance[0] === 'true') {
    //        instanceController.removeInstances(req, res, 1);
    //    } else {
    //        fileController.removeFiles(req, res, 1);
    //    }
    //});
    //[moved]
    //app.get('/toNormal', checkSession2, function (req, res) {
    //    if (req.param('isInstance') === 'true') {
    //        instanceController.restoreInstances(req, res, 0);
    //    } else {
    //        fileController.restoreFiles(req, res, 0);
    //    }
    //});
    //[moved]
    //app.post('/allToNormal', checkSession2, function (req, res) {
    //    if (req.body.isInstance[0] === 'true') {
    //        instanceController.restoreInstances(req, res, 1);
    //    } else {
    //        fileController.restoreFiles(req, res, 1);
    //    }
    //});
    //[moved]
    //app.get('/rename', checkSession2, function (req, res) {
    //    fileController.renameFile(req, res);
    //});
    //[moved]
    //app.get('/renameInstance', checkSession2, function (req, res) {
    //    instanceController.renameInstance(req, res);
    //});
    //[moved]
    //app.get('/update/changePublicState', checkSession2, function (req, res) {
    //    var isInstance = req.query.isInstance;
    //    if (isInstance==='true'){
    //        instanceController.changePublicState(req, res);
    //    }else {
    //        fileController.changePublicState(req, res);
    //    }
    //});
    //load某个课程的实例
    app.get('/load/loadInstanceOfProcess', checkSession2, function (req, res) {
        instanceController.loadInstanceOfProcess(req, res);
    });
    //===end file handler=====
    //===external interface====
    //[moved] 拿到所有course_design课程 //for player
    //app.get('/getAllModelCourses', function (req, res) {
    //    var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
    //    fileController.loadAllUserFiles(req,res, auth);
    //});
    //[moved] 拿到一个course的所有子课程的实例
    //app.get('/getCoursesOfCourse', function (req, res) {
    //    res.header('Access-Control-Allow-Origin', '*');
    //    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //    res.header("Content-Type", "application/json;charset=utf-8");
    //    //get xml
    //    //get model ids
    //    fileController.getModelIdArr(req, function (modelArr) {
    //        if (modelArr.success){
    //            // get instances based on models
    //            if(modelArr.data.length>0){
    //                instanceController.loadInstancesOfModels(req, modelArr.data, function (msg) {
    //                    res.send(msg);
    //                });
    //            } else {
    //                res.send(message.genSimpSuccessMsg('no situation file in this course', modelArr.data))
    //            }
    //        }else {
    //            res.send(message.genSimpFailedMsg('no situation file in this course', null));
    //        }
    //    });
    //});
    // [moved] 获取一个课程的信息
    //app.get('/getSingleCourseInfo', function (req, res) {
    //    instanceController.getSingleCourseInfo(req,res);
    //});
    //[moved] 获取所有泳池、泳道中的角色 //for engine
    //app.get('/load/loadAllLane', checkSession2, function (req, res) {
    //    res.header('Access-Control-Allow-Origin', '*');
    //    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //    res.header("Content-Type", "application/json;charset=utf-8");
    //    instanceController.loadAllLane(req, res);
    //});
    //[moved] get all sub courses of the user //for ZhangWei
    //app.get('/getInstanceByUser',function(req,res){
    //    instanceController.getInstanceByUser(req,res);
    //});
    //[moved]get translated xml file //for engine
    //app.get('/load/loadStandardXml', function (req, res) {
    //    instanceController.loadStandardXml(req, res);
    //});
    //===end interface====
    app.get('/load/loadAllRichTextsModel', function (req, res) {
        richTextController.loadAllRichTextModel(req, res);
    });
    app.get('/load/loadRichTextsModel', function (req, res) {
        //var userApi = userController.getUserApi();
        richTextController.loadRichTextModel(req, res);
    });
    app.put('/file/metaData', fileController.putFileMetaData);
    /*[syncope, abandoned]获得所有用户
    app.get('/load/allusers', checkSession2, function (req, res) {
        //userController.loadAllUsers(req, res);
        var path = '/user/getAllUsers?auth=' + (new Buffer(app.externalConfig.serverAuth)).toString('base64');
        serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
            var item = [],result = [];
            if(data){
                for(var i = 0; i < data.length; i++){
                    if(data[i].id && data[i].role==='user'){
                        item[i] = {
                            id : data[i].id2,
                            name : data[i].username,
                            email : data[i].email
                        };
                        result.push(item[i]);
                    }
                }
            }else{
                result = data;
            }
            res.send(message.genSimpSuccessMsg('success', result));
        });
    });*/

    //===user board =====
    app.get('/load/loadAllUserOfBoard', function (req, res) {
        fileController.loadAllUserOfBoard(req, res);
    });
    app.get('/remove/removeAllUserOfBoard', function (req, res) {
        fileController.removeAllUserOfBoard(req, res);
    });
    app.get('/save/saveBoardUsers', function (req, res) {
        fileController.saveBoardUsers(req, res);
    });
    app.get('/remove/deleteBoardUsers', function (req, res) {
        fileController.deleteBoardUsers(req, res);
    });
    app.get('/update/changeBoardUserType', function (req, res) {
        fileController.changeBoardUserType(req, res);
    });
    app.get('/load/loadBoardUserInfo', function (req, res) {
        fileController.loadBoardUserInfo(req, res);
    });
    //===end  user board =====
    //==task comment ===
    app.get('/save/saveTaskComment', function (req, res) {
        taskCommentController.save(req, res);
    });
    app.get('/load/loadTaskComment', function (req, res) {
        taskCommentController.find(req, res);
    });
    app.get('/remove/removeTaskComment', function (req, res) {
        taskCommentController.remove(req, res);
    });
    app.get('/remove/removeCommentsOfTask', function (req, res) {
        taskCommentController.removeComments(req, res);
    });
    //===end task comment===
    app.get('/getDocOfXml', checkSession2, function (req, res) {
        fileController.getDocOfXml(req, res);
    });
    app.get('/load/loadTaskType', function (req, res) {
        instanceController.loadTaskType(req, res);
    });
    app.get('/load/loadAllTopProcess', function (req, res) {
        fileController.loadAllTopProcess(req, res);
    });
    //app.get('/load/loadTrashedInstOfProcess', function (req, res) {
    //    instanceController.loadTrashedInstOfProcess(req, res);
    //});
    app.post('/saveInstanceUser', function (req, res) {
        instanceController.saveInstanceUser(req, res);
    });
    //与分配角色有关的
    app.get('/load/loadInstanceUser', checkSession, function (req, res) {
        instanceController.loadInstanceUser(req, res);
    });
    app.get('/load/loadChatHistory', function (req, res) {
        fileController.loadChatHistory(req, res);
    });

    app.get('/find', function (req, res) {
        fileController.findByLikeName(req, res);
    });

    app.post('/parseSequence', function (req, res) {
        var path = '/parseSequence';
        serverCommunication.communication(req, res, path);
    });
    app.post('/getStartFigure', function (req, res) {
        var path = '/getStartFigure';
        serverCommunication.communication(req, res, path);
    });
    app.post('/getNextFigure', function (req, res) {
        var path = '/getNextFigure';
        serverCommunication.communication(req, res, path);

    });
    //获取某用户下已发布的所有课程 替代by 'getInstanceByUser'
    app.get('/getAllPublishedInstance',function(req,res){
        instanceController.loadAllPublishedInstanceOfUser(req,res);
    });
    app.get('/admin/i18n/check', function (req, res) {
        var fs = require('fs');
        var path = require('path');
        var dir = "./www/resources";
        var keystr = "grapheditor";
        var filePath = [];
        var maxKey = [];
        var i, j;
        var arrLeft = [];
        var arr1Left = [];
        var arr2Left = [];
        var tmp = [];
        var n;

        function getAllTxtPath(array) {
            var newArray = [];
            j = 0;
            for (i = 0; i < array.length; i++) {
                if (array[i].substr(0, 11) == keystr) {
                    j++;
                    newArray[j] = array[i];
                }
            }
            return newArray;
        }

        var allPath = fs.readdirSync(dir);
        var src = getAllTxtPath(allPath);
        //console.log(src.length);
        for (i = 0; i < src.length - 1; i++) {
            filePath[i] = dir + '/' + src[i + 1];
        }
        /*
         ȥ��
         */
        function unique(data) {
            data = data || [];
            var a = {};
            len = data.length;
            for (i = 0; i < len; i++) {
                var v = data[i];
                if (typeof(a[v]) == 'undefined') {
                    a[v] = 1;
                }
            }
            ;
            data.length = 0;
            for (var i in a) {
                data[data.length] = i;
            }
            return data;
        }

        /*
         read file
         */
        function readFile(path) {
            var file = fs.readFileSync(path, 'utf-8');
            return file.split("\r\n");
        }

        /*
         write file
         */
        function writeFile(path, fileContent) {
            fs.writeFile(path, fileContent, 'utf-8', function (err) {
                if (err) {
                    console.log(err);
                }
                console.log('create' + path + 'success!');
            });
        }

        /*
         quick sort
         */
        function quickSort(array) {
            var arr = [];
            for (i = 0; i < array.length; i++)
                arr[i] = array[i];
            if (arr.length <= 1) {
                return arr;
            }
            var pivotIndex = Math.floor(arr.length / 2);
            var pivot = arr.splice(pivotIndex, 1)[0];
            var left = [];
            var right = [];
            for (i = 0; i < arr.length; i++) {
                if (arr[i].localeCompare(pivot) < 0) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
            return quickSort(left).concat([pivot], quickSort(right));
        }

        /**
         * get maxKey
         * @type {Array}
         */
        var al = [];
        var ar = [];
        for (k = 0; k < filePath.length; k++) {
            var arr1 = quickSort(readFile(filePath[k]));
            for (i = 0; i < arr1.length; i++) {
                tmp = arr1[i].split('=');
                al[i] = tmp[0];
                ar[i] = tmp[1];
            }
            temp = maxKey.concat(maxKey, al);
            maxKey = quickSort(unique(temp));
            //for (i = 0; i < maxKey.length; i++)
            //    console.log('maxKey[' + i + ']=' + maxKey[i]);
            //console.log('maxKey.length='+maxKey.length);
        }
        var array1 = quickSort(readFile(filePath[0]));
        var array2 = quickSort(readFile(filePath[1]));

        function getKey(key, arr, path) {
            for (i = 0; i < arr.length; i++) {
                tmp = arr[i].split('=');
                arrLeft[i] = tmp[0];
            }
            var flag;
            for (i = 0; i < key.length; i++) {
                flag = 0;
                for (j = 0; j < arr.length; j++) {
                    if (arrLeft[j] == key[i]) {
                        flag = 1;
                        break;
                    }
                }
                if (flag == 0) {
                    n = arr.length++;
                    arr[n] = key[i] + '=' + '[]';
                }
            }
            arr = quickSort(unique(arr));
            var array = arr.join('\r\n');
            var len = array.length;
            array[len] = '';
            writeFile(path, array);
        }

        getKey(maxKey, array1, filePath[0]);
        getKey(maxKey, array2, filePath[1]);

        /**
         * output
         */
        var outArr1 = [];
        var tmp1 = [];
        var k = 0;
        for (i = 0; i < array1.length; i++) {
            tmp1 = array1[i].split('=');
            arr1Left[i] = tmp1[0];
        }
        for (i = 0; i < array1.length - 1; i++) {
            for (j = i + 1; j < array1.length; j++) {
                if (arr1Left[i] == arr1Left[j]) {
                    outArr1[k] = array1[i];
                    outArr1[k + 1] = array1[j];
                    k = k + 2;
                }
            }

        }
        var outArr2 = [];
        var tmp2 = [];
        var p = 0;
        for (i = 0; i < array2.length; i++) {
            tmp = array2[i].split('=');
            arr2Left[i] = tmp2[0];
        }
        for (i = 0; i < array2.length - 1; i++) {
            for (j = i + 1; j < array2.length; j++) {
                if (arrLeft[i] == arrLeft[j]) {
                    outArr2[p] = array2[i];
                    outArr2[p + 1] = array2[j];
                    p = p + 2;
                }
            }

        }
        var string1 = 'The file [' + filePath[0] + '] has conflict translation:';
        var string2 = 'The file [' + filePath[1] + '] has conflict translation:';
        //var info = '. All duplicated translation has been removed!';
        var outInfo, str1, str2;
        if (outArr1.length != 0) {
            str1 = string1 + outArr1.join(';');
        } else {
            str1 = 'The file [' + filePath[0] + '] has no duplicated translation';
        }
        if (outArr2.length != 0) {
            str2 = string2 + outArr2.join(';');
        } else {
            str2 = 'The file [' + filePath[1] + '] has no duplicated translation';
        }
        outInfo = str1 + '. ' + str2 + '.';
        res.send(message.genSimpSuccessMsg(outInfo));
        console.log(outInfo);
    });

    app.get('/admin/users/autoadd', function (req, res) {
        for (var i = 1; i <= 20; i++) {
            var user = {
                username: 'user' + i,
                password: '123'
            };
            userController.addUser(user, req, res);
        }
        res.send(new message.genSimpSuccessMsg('Command has been sent.'));

    });
    app.get('/login', function (req, res) {
        res.render('login');
    });
    //app.post('/loginHandle', function (req, res) {
    //    var server = app.externalConfig.localHost[app.externalConfig.runMode];
    //    userController.isExist(req, res, server);
    //});

    //====learning resource=>oc file=====160817 oc file sys replace learning res====
    app.get('/load/loadAllLearningRes', function (req, res) {
        var userId = req.session.user_id;
        var path='/index.php/apps/managementsysext/file_api/get_folder_files?path=/&userId=' + userId;
        var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
        serverCommunication.OCServer(null, 'get', path,auth, null, "application/json", function (data) {
            var resData = JSON.parse(data);
            for (var i = 0; i <resData.length; i++){
                resData[i].lastModify = new Date(resData[i].lastModify*1000);
                resData[i].createTime = new Date(resData[i].createTime*1000);
                resData[i].ownerId = userId;
            }
            res.send({data:resData});
        });
        //learningResController.searchLearningRes(req, res);
    });
    app.get('/load/loadPdfFile', function (req, res) {
        var doIt = function () {
            var filePath = encodeURI(req.query.path);
            var ownerId = req.query.ownerId;
            var reqPath = '/index.php/apps/managementsysext/file_api/read_file?path=' + filePath + '&ownerId=' + ownerId;
            var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
            //var fileType= filePath.split('.')[filePath.split('.').length - 1];
            var tempPath = 'www/temp/'+uuid.v1();
            serverCommunication.OCReceiveFile(null, 'get', reqPath, auth, tempPath, function (contentType) {
                res.setHeader('Content-Type', contentType);
                res.setHeader('Content-Disposition', 'inline');
                res.sendFile(path.join(__dirname, '../' + tempPath));
            });
        };
        if (req.query.source && req.query.source ==='pgofc'){
            doIt();
        } else {
            checkSession(req, res, function () {
                doIt();
            });
        }
    });
    app.get('/load/loadAllRichTextRes', checkSession2, function (req, res) {
        //todo fz
        var userId = req.session.user_id;
        var path='/index.php/apps/managementsysext/file_api/get_folder_files?path=/&userId=' + userId;
        var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
        serverCommunication.OCServer(null, 'get', path,auth, null, "application/json", function (data) {
            var resData = JSON.parse(data);
            var resArr = [];
            for (var i = 0; i <resData.length; i++){
                if (resData[i].fileType == 'html' || resData[i].fileType == 'txt'){
                    resData[i].lastModify = new Date(resData[i].lastModify*1000);
                    resData[i].createTime = new Date(resData[i].createTime*1000);
                    resData[i].ownerId = userId;
                    resArr.push(resData[i]);
                }
            }
            res.send({data:resArr});
        });
        //learningResController.searchRichText(req, res);
    });
    app.get('/load/loadStr', function (req, res) {
        var filePath = encodeURI(req.query.path);//oc不能识别该请求中的中文
        var ownerId = req.query.ownerId;
        var reqPath = '/index.php/apps/managementsysext/file_api/read_str?path=' + filePath + '&ownerId=' + ownerId;
        var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
        serverCommunication.OCServer(null, 'get', reqPath, auth, null, 'text/html', function (resData) {
            resData = JSON.parse(resData);
            if (resData){
                res.send(resData);
            } else {
                res.send(false);
            }
        });
    });
    app.get('/load/searchLearningRes', function (req, res) {
        var str=req.query.fileName;
        var userId = req.session.user_id;
        var path='/index.php/apps/managementsysext/file_api/search_by_name?str=' + str + '&userId=' + userId;
        var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
        serverCommunication.OCServer(null, 'get', path,auth, null, "application/json", function (data) {
            var resData = JSON.parse(data);
            for (var i = 0; i <resData.length; i++){
                resData[i].lastModify = new Date(resData[i].lastModify*1000);
                resData[i].createTime = new Date(resData[i].createTime*1000);
                resData[i].ownerId = userId;
            }
            res.send({data:resData});
        });
        //learningResController.searchLearningRes(req, res);
    });
    app.get('/remove/deleteLR', function (req, res) {
        var id=req.query.materialsId;
        var userId = req.session.user_id;
        var path='/index.php/apps/managementsysext/file_api/delete_file?id=' + id + '&userId=' + userId;
        var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
        serverCommunication.OCServer(null, 'get', path,auth, null, "application/json", function (data) {
            res.send(message.genSimpSuccessMsg('success', null));
        });
        //learningResController.deleteLR(req, res);
    });

    app.post('/saveFileToOC', multipartyMiddleware, function (req, res) {
        /*var filePath=req.files.file.path;
        var fileName =req.files.file.name;
        var fileType =req.files.file.type;
        var reqPath='/remote.php/webdav/'+fileName;
        var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
        var ocFileHost = app.externalConfig.ocFileHost[app.externalConfig.runMode];
        serverCommunication.OCFileServer(ocFileHost.split(':')[0],ocFileHost.split(':')[1],'PUT',filePath,fileName, fileType, reqPath,auth, function (data) {
            console.log(data)
            res.send();
        });*/
        var path='/index.php/apps/managementsysext/file_api/save_uri_file';
        var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
        var postData = {
            uri: 'http://' + app.externalConfig.localHost[app.externalConfig.runMode] + req.files.path.slice(3).replace(/\\/g, "/"),
            fileName: req.fields.fileName[0],
            fileType: req.fields.fileType[0],
            userId: req.session.user_id
        };
        serverCommunication.OCServer(postData, 'post', path,auth, null, "application/json", function (data) {
            res.send(message.genSimpSuccessMsg('success', data));
        });
    });
    app.post('/saveStrToOC',multipartyMiddleware, function (req, res) {
        var reqPath='/index.php/apps/managementsysext/file_api/save_str';
        var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
        var postData = {
            fileName: req.fields.fileName[0],
            fileType: req.fields.fileType[0],
            content: req.fields.content[0],
            userId: req.session.user_id
        };
        serverCommunication.OCServer(postData, 'post', reqPath,auth, null, "application/json", function (data) {
            res.send(message.genSimpSuccessMsg('success', data));
        });
    });
    app.get('/tfz', function (req, res) {
        var reqPath='/index.php/apps/managementsysext/file_api/cp_file_to_system';
        var auth = (new Buffer('user1:ecgogo')).toString('base64');
        res.send(auth);
        var postData = {
            'sourceF': '/测试富文本.html',
            'ownerId': 'user1',
            'userId': 'user1',
            'targetName': 'adff2129-a2dc-4cd6-b90e-b44f1b21753d.html'
        };
        serverCommunication.OCServer(postData, 'post', reqPath,auth, null, "application/json", function (data) {
            res.send(data);
        });
    });
    app.post('/ecg2', multipartyMiddleware, function (req, res) {
        var userId = req.session.user_id;
        var reqPath='/OfficeTransfer/transfer';
        var filePath=req.files.file.path;
        var fileName =req.files.file.name;
        var dataType =req.files.file.type;
        var fileType = (fileName.split('.').length>1) ? fileName.split('.') : '';
        serverCommunication.OCFileServer('192.168.1.25',8080,'POST',filePath,fileName, dataType, reqPath,null, function (data) {
            res.send(data);

            if(data){
                var path='/index.php/apps/managementsysext/file_api/save_office_pdf';
                var auth = (new Buffer('admin:123')).toString('base64');
                var postData = {
                    ofcPath: 'uc_upload/223e8930-15bc-460c-bc2d-b47b84b0dce3.doc',
                    pdfPath: 'uc_transfer/223e8930-15bc-460c-bc2d-b47b84b0dce3.pdf',
                    fileName: fileName,
                    ofcType: fileType,
                    userId: 'admin'
                };
                serverCommunication.OCServer(postData, 'post', path,auth, null, "application/json", function (data) {
                    res.send(data);
                });
            }


        });
    });
    app.post('/savePdfToOC', function (req, res) {
        var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
        if (req.body.pdfPath=='false'){
            //不需要传pdf
            var path='/index.php/apps/managementsysext/file_api/save_uri_file';
            var postData = {
                uri: app.externalConfig.resourceServerHost[app.externalConfig.runMode] + req.body.ofcPath,
                fileName: req.body.fileName,
                fileType: req.body.ofcType,
                userId: req.session.user_id
            };
            serverCommunication.OCServer(postData, 'post', path,auth, null, "application/json", function (data) {
                res.send(message.genSimpSuccessMsg('success', data));
            });
        } else {
            var path='/index.php/apps/managementsysext/file_api/save_office_pdf';
            var postData = {
                ofcPath: req.body.ofcPath,
                pdfPath: req.body.pdfPath,
                fileName:req.body.fileName,
                ofcType: req.body.ofcType,
                userId: req.session.user_id
                //todo fz
            };
            serverCommunication.OCServer(postData, 'post', path,auth, null, "application/json", function (data) {
                res.send(message.genSimpSuccessMsg('success', data));
            });
        }
    });
    //===end lr ====
    app.get('/load/loadAllUserBoard', function (req, res) {
        fileController.loadAllUserBoard(req, res);

    });
    app.get('/searchMaterials', function (req, res) {
        res.render('material/searchMaterials');
    });

    app.get('/editMaterial', checkSession, function (req, res) {
        res.render('material/editMaterial', {resourceServerHost:app.externalConfig.resourceServerHost[app.externalConfig.runMode]});
    });
    app.post('/save/saveUploadFile', function (req, res) {
        learningResController.saveUploadModelFiles(req, res);
    });
    app.post('/remove/deleteUploadFile', function (req, res) {
        learningResController.deleteUploadFiles(req, res);
    });
    app.get('/readMaterial', function (req, res) {
       res.render('material/readMaterial');
    });

    app.get('/save-get-gridfs', function (req, res) {
        FSService.saveToGridFS({sourceF : 'upload/'+req.query.sourceF ,filename : req.query.materialsId});
        res.send('hello world.');
    });

    app.get('/get-from-gridfs', function (req, res) {
        FSService.getFromGridFS(req, res);
    });

    app.post('/LR/updateLR', function (req, res) {
        learningResController.updateLR(req, res);
    });

    app.get('/LR/isMaterialExist', function (req, res) {
        learningResController.isMaterialExist(req, res);
    });

    app.get('/getNotFoundPage', function (req, res) {
        res.render('notFound', {message: '该资料不存在！'});
    });

    app.get('/LR/downloadMaterial', checkSession, function (req, res) {
        var path = 'D:\\apache-tomcat-7.0.57\\webapps\\OfficeTransfer\\' + req.query.sourceF;
        var filename = req.query.fileName + '.' + req.query.fileType;
        path = path.replace(/\//, '\\');
        res.download(path, filename);
    });

    app.post('/LR/saveComment', function (req, res) {
        learningResController.saveComment(req, res);
    });

    app.get('/LR/getComments', function (req, res) {
        learningResController.getComments(req, res);
    });

    app.get('/LR/updateCourses', function (req, res) {
        learningResController.updateCourses(req, res);
    });
    app.post('/save/saveLearningRes', function (req, res) {
        learningResController.saveLearningRes(req, res);

    });
    app.post('/save/saveVideoRes', function (req, res) {
        learningResController.saveVideoRes(req, res);
    });
    app.get('/load/getVideoRes', function (req, res) {
        learningResController.getVideoRes(req, res);
    });
    app.get('remove/deleteResFiles',function(req,res) {
        learningResController.deleteResFiles(req,res);
    });
    app.get('/remove/deleteRichTextareaModel', function (req, res) {
        richTextController.deleteRichTextModel(req, res);
    });

    app.get('/getEditQuestionPanel', function (req, res) {//获取编辑问题面板
        if(req.param('id') == '12345')
            res.render('editQuestionPanel');
    });

    app.post('/saveQuestionForm', function (req, res) {//保存编辑的问题
        learningResController.saveQuestionForm(req, res);
    });

    app.get('/getAnswerQuestionPanel', function (req, res) {//获取回答问题面板
        learningResController.getAnswerQuestionPanel(req, res);
    });

    app.post('/saveAnswerForm', function (req, res) {//保存问题作答
        learningResController.saveAnswerForm(req, res);
    });

    app.get('/getAnswerResult', function (req, res) {//获取答案结果
        learningResController.getAnswerResult(req, res);
    });

    app.post('/save/saveRichTextareaModel', function (req, res) {
        richTextController.saveRichText(req, res);
    });
    //get VM's type from TongKui
    app.get('/load/getVMTypes', checkSession, function (req, res) {
        var VMTypes = [];
        ////160513日前的虚拟机类型
        //soap.createClient("http://" + app.externalConfig.oldVMTypeHost[app.externalConfig.runMode] + "/VBoxService/webservice/inquiryVm?wsdl", function (err, client) {
        //    if (err) {
        //        console.log(err);
        //        res.send(message.genSimpSuccessMsg('failed', err));
        //    }
        //    else {
        //        client.inquiryVm(function (err, result) {
        //            for (var i = 0; i < result._return.entry.length; i++){
        //                VMTypes.push({
        //                    name: result._return.entry[i].value.$value,
        //                    value: result._return.entry[i].key
        //                })
        //            }
                    //新的虚拟机类型
                    var postData = {command:'queryAllCourseTemplates'};
                    var path = '/XenServerVM-WebService/courseAPI';
                    serverCommunication.VMServer(postData, path, function (resData) {
                        if (typeof resData == 'object'){
                            for (var i = 0; i < resData.length; i++){
                                VMTypes.push({
                                    name: resData[i].courseName,
                                    value: resData[i].courseId
                                })
                            }
                            res.send(message.genSimpSuccessMsg('', VMTypes));
                        } else {
                            res.send(message.genSimpFailedMsg('', null));
                        }
                    })
        //        })
        //    }
        //});
    });

    app.post('/contact/sendMessage', function (req, res) {//发送邮件
        emailController.sendMessage(req, res);
    });

    //----------------------------------监控日志start-----------------------------------
    app.get('/searchLogs', function (req, res) {
        checkSession(req, res,function() {
            res.render('log/searchLogs', {playerHost: app.externalConfig.playerHost[app.externalConfig.runMode]});
        });
    });
    app.get('/log/searchLogs', function (req, res) {
        logController.searchLogs(req, res, LogClient);
    });

    app.get('/searchExamLogs', function (req, res) {
        checkSession(req, res,function() {
            res.render('log/searchExamLogs', {localHost: app.externalConfig.localHost[app.externalConfig.runMode]});
        });
    });
    app.get('/log/searchExamLogs', function (req, res) {
        examController.getExam(req, res);
    });

    app.get('/exam/getMyExam', function (req, res) {
        checkSession(req, res,function() {
            res.render('log/searchMyExamLogs', {localHost: app.externalConfig.localHost[app.externalConfig.runMode]});
        });
    });
    app.post('/exam/getMyExam', function (req, res) {
        examController.getMyExam(req, res);
    });

    app.get('/examItemsStatistic', function (req, res) {
        checkSession(req, res,function() {
            res.render('log/examItemsStatistic');
        });
    });

    app.post('/exam/getExamStatistic', function (req, res) {
        examController.getExamStatisticData(req, res);
    });


    //----------------------------------监控日志end-----------------------------------

    //嵌入课程开发过程-进入准备编辑试卷页面
    app.get('/exam/toEditExam_course', checkSession, function (req, res) {
        examController.getExam(req, res);
    });

    //从主页进入-准备编辑试卷页面
    app.get('/exam/toEditExam_home', checkSession, function (req, res) {
        examController.getExam(req, res);
    });

    //进入编辑试卷页面
    app.get('/exam/editExam', checkSession, function (req, res) {
        res.render('exam/editExam');
    });

    //保存试卷信息
    app.get('/exam/saveExam', checkSession, function (req, res) {
        examController.saveExam(req, res);
    });

    //获取试卷信息
    app.get('/exam/getExam', function (req, res) {
        examController.getExam(req, res);
    });

    //提交完成编辑的试卷
    app.post('/exam/finishEditExam', function (req, res) {
        examController.finishEditExam(req, res);
    });

    //进入查看/准备考试试卷页面
    app.get('/exam/enterExam', function (req, res) {
        //跨域
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        var examType = req.query.examType;
        if(examType == 'test'){
            //examController.prepareToExam(req, res);//准备考试：从原试卷拷贝考试副本，初始化我的试卷作答
            checkSession(req, res,function(){
                examController.prepareToExam(req, res);//准备考试：从原试卷拷贝考试副本，初始化我的试卷作答
            });
        }else {//预览、检查试卷
            res.render('exam/enterExam');
        }
    });

    //进入考试试卷页面
    app.get('/exam/startToExam', function (req, res) {
        res.render('exam/enterExam');
    });

    //修改试卷信息
    app.post('/exam/updateExam', function (req, res) {
        examController.updateExam(req, res);
    });

    //（目前以页为单位）记录我的试题作答
    app.post('/exam/updateMyExamAnswer', function (req, res) {
        examController.updateMyExamAnswer(req, res);
    });

    //提交我的试卷
    app.post('/exam/submitMyExam', function (req, res) {
        examController.submitMyExam(req, res);
    });

    //我的试卷是否提交
    app.post('/exam/MyExamIsSubmit', function (req, res) {
        examController.MyExamIsSubmit(req, res);
    });

    //批改试卷
    app.post('/exam/getMyExamReport', function (req, res) {
        examController.getMyExamReport(req, res);
    });

    //保存试卷的页的信息
    app.post('/exam/saveExamPage', function (req, res) {
        examController.saveExamPage(req, res);
    });

    //获取试卷的页的信息
    app.get('/exam/getExamPage', function (req, res) {
        examController.getExamPage(req, res);
    });

    //删除试卷的页
    app.post('/exam/deleteExamPage', function (req, res) {
        examController.deleteExamPage(req, res);
    });

    //更新试卷的页的页码
    app.post('/exam/sortExamPages', function (req, res) {
        examController.sortExamPages(req, res);
    });

    //获取试卷的页的页码数
    app.post('/exam/getExamPageCount', function (req, res) {
        examController.getExamPageCount(req, res);
    });

    //保存试题信息
    app.post('/exam/saveExamItem', function (req, res) {
        examController.saveExamItem(req, res);
    });

    //修改试题信息
    app.post('/exam/updateExamItem', function (req, res) {
        examController.updateExamItem(req, res);
    });

    //获取试题信息
    app.post('/exam/getExamItems', function (req, res) {
        examController.getExamItems(req, res);
    });

    //更新试题在页中的序号
    app.post('/exam/sortExamItems', function (req, res) {
        examController.sortItems(req, res);
    });

    //删除试题
    app.post('/exam/deleteExamItem', function (req, res) {
        examController.deleteExamItem(req, res);
    });

    //（目前以页为单位）记录试题作答---暂时不用了，思路不对
    app.post('/exam/saveExamItemAnswer', function (req, res) {
        examController.saveExamItemAnswer(req, res);
    });

    //试题导出为qti标准题型文件
    app.get('/exam/exportQTI_AI', function (req, res) {
        examController.exportQTI_AI(req, res);
    });

    //导入qti标准题型文件
    app.get('/exam/importQTI_AI', function (req, res) {
        examController.importQTI_AI(req, res);
    });

    //苗苗api
    //拿到所有实例
    app.get('/getAllCourses', function (req, res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json;charset=utf-8");
        instanceController.loadAllInstance(req, res);
    });
    ////[moved]向播放器获取课程分类
    //app.get('/getCourseCategoryTrees', function (req, res) {
    //    //var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
    //    fileController.getCategoryTrees('', res);
    //});
    //=====选课类=========
    //某人选某课程
    app.get('/addCourseToUser', function (req, res) {
        instanceController.addCourseToUser(req, res);
    });
    //某人取消选某课程
    app.get('/removeCoursesFromUser', function (req, res) {
        instanceController.removeCoursesFromUser(req,res);

    });
    //check某人是否选了某课程
    app.get('/checkAcourseSelected', function (req, res) {
        instanceController.checkAcourseSelected(req,res);
    });
    //获得用户已选课程
    app.get('/getUsersSelectedCourse', function (req, res) {
        instanceController.getUsersSelectedCourse(req,res);

    });
    //=========完成课程类==========
    //某人完成一个课程
    app.get('/completeCourse', function (req, res) {
        instanceController.completeCourse(req, res);
    });
    //获得用户已完成课程
    app.get('/getUsersCompletedCourse', function (req, res) {
        instanceController.getUsersCompletedCourse(req,res);
    });
    //获得用户所有课程（包括已选和已完成）
    app.get('/getUsersAllCourses', function (req, res) {
        instanceController.getUsersAllcourses(req,res);
    });
    //=====temp=====
    app.get('/allCourse_temp', function (req, res) {
        res.redirect('allCourse_temp.html');
    });
    app.get('/temp/addFileType', function (req, res) {
        fileController.addFileType_temp(req, res);
    });
    app.get('/temp/addWBTaskId',function(req,res){
        instanceController.addWBTaskId(req,res);
    });
    app.get('/temp/login',function(req,res){
        //serverCommunication.user3();
        var username = 'user9';
        var password = '123';
        var sessionId=req.session.id;
        var server = app.externalConfig.localHost[app.externalConfig.runMode];
        var path = '/user/login?username='+username+'&password='+password + '&sessionId='+sessionId+'&server=' + server;
        serverCommunication.syncope(null, 'get', path, null, "application/json", function (responseString) {
            res.setHeader("Content-Type", "application/json");
            res.send(responseString);
        });
    });
    app.get('/UMB/logOut', function (req, res) {
        delete req.session.userData;
        res.clearCookie('sysCookieId');
        res.clearCookie('userAuth');
        res.send('true');
    });
    /*[syncope, abandoned]
    app.get('/temp/createUser' ,function(req,res){
        var path = '/user/createUser';
        var postData = {
            "userData" : {
                "id2" : new ObjectId().toString(),
                "username" : "user19",
                "password":"123",
                //"psw" : (sha1('11')).toUpperCase(),
                'email':'123@1.111',
                'sex':'male',
                'age':'26',
                "description":"asdgh...",
                'phoneNumber':'1586666666'
            },
            "auth":(new Buffer(app.externalConfig.serverAuth)).toString('base64')
        };
        serverCommunication.syncope(postData, 'post', path, "application/json", "application/json", function (resData) {
            if (resData.id){
                var formatData = {
                    "id": resData.id2,
                    "username": resData.username,
                    "password": resData.password
                };
                res.setHeader("Content-Type", "application/json");
                res.send(formatData);
            } else {
                res.setHeader("Content-Type", "application/json");
                res.send('error');
            }
        });
    });*/
    app.get('/temp/checkUser',function(req,res){
        var userName = 'user9';
        var password = '123';
        var path = '/user/login?username='+username+'&password='+password + '&sessionId='+sessionId+'&server=' + server;
        serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
            if(data.id){
                data = {
                    id : data.id2,
                    username : data.username,
                    password : data.password
                };
            }
            res.setHeader("Content-Type", "application/json");
            res.send(data);
        });
    });
    app.get('/temp/getUserInfo',function(req,res){
        var path = '/user/getUserInfo?fiql=id2==569327ff86dcf4403a702ce0&auth=' + req.session.auth;
        serverCommunication.syncope(null, 'get', path, null, "application/json", function (data) {
            if (data.success) {
                var userData = {
                    id: data.data.id2,
                    username: data.data.username,
                    password: data.data.password
                };
                res.setHeader("Content-Type", "application/json");
                res.send(userData);
            }
        });
    });
    app.get('/temp/updateUserInfo',function(req,res){
        var path = '/user/updateUserInfo';
        var postData = {
            "userData" : {
                id : '221',
                    username : 'asdf',
                password : '1111',
                email:'baidu@qq.com',
                sex :'female',
                phoneNumber :'18627867808',
                description :'very good',
                //birthday : (new Date()).toLocaleDateString(),
                //psw : '11111',
                age : '23'
            },
            "auth": req.session.auth
        };
        serverCommunication.syncope(postData, 'post', path, "application/json", "application/json", function (data) {
            if(data.id){
                data = {
                    id : data.id2,
                    username : data.username,
                    password : data.password
                };
            }
            res.setHeader("Content-Type", "application/json");
            res.send(data);
        });
    });
    app.get('/setSysCookie', function (req, res) {
        var a = req.cookies;
        res.cookie('lastModify',new Date());
        res.send(true);
    });
    app.get('/doSetSysCookie', function (req, res) {
        var redirectTarget = req.query.target;
        var redirectHosts = JSON.parse(req.query.hosts);
        res.render('cookiesRegister',{
            hosts: redirectHosts,
            redirectTarget: redirectTarget
        });
    });
    app.post('/load/getBindTaskXml',function(req,res){
        fileController.taskToProcess(req,res);
    });
    var dataSource = require('../app_db/dataSource.js');
    app.get('/temp/moveSubCourse', function (req, res) {
        var courseId = req.query.courseId;
        var parentId = req.query.pId;
        transTemplate(courseId, parentId, function (resData) {
            res.send(resData);
        });
        /*var saveNewCourseInfo = function (data, next) {
            var db = dataSource.getDB();
            db.collection('subCourse').insert(data, function (err, result) {
                if (err) {
                    throw err;
                } else {
                    console.log(result.result);
                    next(result);
                }
            });
        };
        var resData = {};
        resData['courseId'] = courseId;*/
        //1.连db；2.取info
        /*dataSource.connectSecondDb("mongodb://localhost:27017/ecgeditor", function (oldDb) {
            oldDb.collection('processInstances').findOne({'id': courseId}, function (err, data) {
                if (err) {
                    throw err;
                } else {
                    console.log('get old sub course info:');
                    console.log(data);
                    //fileIcon
                    if (data.fileIcon && (data.fileIcon!="undefined")){
                        var oldFileIcon = JSON.parse(data.fileIcon);
                        var fileIcon = {
                            materialsId: oldFileIcon.materialsId,
                            fileName: oldFileIcon.originalName,
                            ownerId: '457bff90-135d-11e7-8c55-1f33be1fa07e',
                            filePath: "457bff90-135d-11e7-8c55-1f33be1fa07e/own/2017-04/images/" + oldFileIcon.materialsId + '.' + oldFileIcon.originalName.split('.')[1]
                        };
                        fileIcon = JSON.stringify(fileIcon);
                        console.log(fileIcon);
                    }
                    var newCourseInfo = {
                        id: data.processId,
                        name: data.name,
                        parentId: null,
                        briefDes: null,//info
                        detailDes: data.detailDes,//info
                        courseType: 'situation',//create
                        fileIcon: (fileIcon)? fileIcon: null,
                        createTime: data.createTime,//create
                        lastModify: data.lastModify,
                        publishModifyTime: data.publishModifyTime,
                        isDeleted: data.isDeleted,
                        isPublished: data.isPublished,
                        isCooperation: data.isCooperation,//default value: false
                        groupRange: data.groupRange,//info
                        rolePool: null, // JSON string
                        userId: '457bff90-135d-11e7-8c55-1f33be1fa07e',
                        userName: 'ynlisa'
                    };
                    oldDb.close();
                    resData['fileIcon'] = data.fileIcon;
                    resData['parentId'] = data.processId;
                    console.log('【1】info success');
                    //xml
                    transTemplate(courseId,resData, function (resData) {
                        //info
                        saveNewCourseInfo(newCourseInfo, function (result) {
                            console.log('final saved success');
                            res.send(resData);
                        });
                    });
                    //fs.writeFileSync(path.join(__dirname, '../_static_content/BPMN_files/normal/' + data.processId + '.xml'), fs.readFileSync(path.join(__dirname, '../../../App/ecgeditor_2_0/_static_content/BPMN_files/normal/' + courseId + '.xml'), 'utf-8'), 'utf-8');
                }
            })
        });*/
    });
    /*var exportFile = function (fileList,resData, next) {
        if (fileList.length === 0){
            next(resData);
        } else {
            fs.mkdir('www/trans/' + resData.courseId, function(err) {
                var count = 0;
                for (var i = 0; i < fileList.length; i++){
                    //下载，放到目录
                    var filePath = encodeURI(fileList[i].filePath);
                    var tempPath = 'www/trans/' + resData.courseId + '/'+fileList[i].id + '###' +fileList[i].name;
                    var ownerId = fileList[i].ownerId;
                    var reqPath = '/index.php/apps/managementsysext/file_api/read_file?path=' + filePath + '&ownerId=' + ownerId;
                    var auth = (new Buffer(app.externalConfig.ocAuth)).toString('base64');
                    serverCommunication.OCReceiveFile(null, 'get', reqPath, auth, tempPath, function (contentType) {
                        console.log('template文件下载成功：'+ count);
                        count++;
                        if (count === fileList.length) {
                            //返回，完成。
                            console.log('【3】file download success');
                            next(resData);
                        }
                    });
                }
            })
        }
    };*/
    //trans template
    var parseString = require('xml2js').parseString;
    var xml2js = require('xml2js');
    var transTemplate = function (courseId, parentId, next) {
        fs.readFile(path.join(__dirname, '../../../App/ecgeditor_2_0/_static_content/BPMN_files/normal/' + courseId + '.xml'), 'utf-8', function (err, data) {
            if (err) {
                console.log(message.genSimpFailedMsg('no_file', null));
                //throw err;
            } else {
                var graphXml = [];
                var reqBodyStr = JSON.stringify({data:data});
                var reqData = JSON.parse(reqBodyStr);
                graphXml[0] = reqData.data;
                var obj;
                parseString(graphXml[0], {explicitArray: false}, function (err, result) {
                    obj = result;
                    var nodes = obj.mxGraphModel.root.ecCell;
                    var fileList = [];
                    for (var i = 0; i < nodes.length; i++){
                        if ((nodes[i].$.type ==='bpmn.task.user') && (nodes[i].$.workbench)){
                            var workbench = JSON.parse(nodes[i].$.workbench);
                            if (workbench['input'].template){
                                var oldTemplate = workbench['input'].template;
                                var temp = oldTemplate.name.split('.');
                                var fileType = temp[temp.length - 1];
                                var id = courseId + oldTemplate.id;
                                fileList.push({
                                    id: id,
                                    filePath: oldTemplate.sourceF,
                                    name: oldTemplate.name,
                                    ownerId: oldTemplate.ownerId
                                });
                                var template = {
                                    id: id,
                                    name: oldTemplate.name,
                                    filePath: '457bff90-135d-11e7-8c55-1f33be1fa07e/own/2017-04/file/'+ id + '.' + fileType,
                                    fileType: fileType,
                                    ownerId: '457bff90-135d-11e7-8c55-1f33be1fa07e'
                                };
                                workbench['input'].template = template;
                                var newWorkbench = JSON.stringify(workbench);
                                console.log(workbench);
                                nodes[i].$.workbench = newWorkbench;
                            }
                        } 
                        if (i == nodes.length -1){
                            //转回xml，存入某处
                            obj.mxGraphModel.root.ecCell = nodes;
                            var builder = new xml2js.Builder();
                            var xml = builder.buildObject(obj);
                            fs.writeFileSync(path.join(__dirname, '../_static_content/BPMN_files/normal/' + parentId + '.xml'), xml, 'utf-8');
                            console.log('【2】xml trans success-----'+ fileList.length);
                            console.log(fileList);
                            next();
                            //resData['template'] = fileList;
                            //exportFile(fileList,resData, next);
                        }
                    }
                });
            }
        })
    };
    app.get('/temp/moveCourse', function (req, res) {
        var courseId = req. query.courseId;
        //xml
        fs.writeFileSync(path.join(__dirname, '../_static_content/BPMN_files/normal/' + courseId + '.xml'), fs.readFileSync(path.join(__dirname, '../../../App/ecgeditor_2_0/_static_content/BPMN_files/normal/' + courseId + '.xml'), 'utf-8'), 'utf-8');
        res.send(courseId);
        /*//info
        var saveNewCourseInfo = function (data, next) {
            var db = dataSource.getDB();
            db.collection('parentCourse').insert(data, function (err, result) {
                if (err) {
                    throw err;
                } else {
                    console.log(result.result);
                    next(result);
                }
            });
        };
        var resData = {};
        //1.连db；2.取info
        dataSource.connectSecondDb("mongodb://localhost:27017/ecgeditor", function (oldDb) {
            oldDb.collection('graphMetaData').findOne({'id': courseId}, function (err, data) {
                if (err) {
                    throw err;
                } else {
                    console.log('get old course info:');
                    console.log(data);
                    //fileIcon
                    if (data.fileIcon && (data.fileIcon!="undefined")){
                        var oldFileIcon = JSON.parse(data.fileIcon);
                        var fileIcon = {
                            materialsId: oldFileIcon.materialsId,
                            fileName: oldFileIcon.originalName,
                            ownerId: '457bff90-135d-11e7-8c55-1f33be1fa07e',
                            filePath: "457bff90-135d-11e7-8c55-1f33be1fa07e/own/2017-04/images/" + oldFileIcon.materialsId + '.' + oldFileIcon.originalName.split('.')[1]
                        };
                        fileIcon = JSON.stringify(fileIcon);
                        console.log(fileIcon);
                    }
                    var newCourseInfo = {
                        id: data.id,
                        name: data.fileName,
                        briefDes: null,
                        detailDes: data.fileDesc,
                        fileType: data.fileType,
                        courseType: 'situation',
                        categoryId: data.categoryId,
                        fileIcon: (fileIcon)? fileIcon: null,
                        createTime: data.createTime,
                        lastModify: data.lastModify,
                        publishModifyTime: data.publishModifyTime,
                        isDeleted: data.isDeleted,
                        isPublished: data.isPublished,
                        publishPermission: data.publishPermission,
                        userId: '457bff90-135d-11e7-8c55-1f33be1fa07e',
                        userName: 'ynlisa'
                    };
                    oldDb.close();
                    resData['fileIcon'] = data.fileIcon;
                    saveNewCourseInfo(newCourseInfo, function (result) {
                        console.log('saved success');
                        res.send(resData);
                    });
                }
            })
        });*/
    });
    // error handlers
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
    return app;
};

