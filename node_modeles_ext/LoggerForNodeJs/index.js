var express = require('./node_modules/express/index.js');
var process = require('process');

var app = express(); 
var routesForMyIndex = require('./myRoutes/myIndexRoute.js');

//封装的日志应用

//【步骤一】获得定义日志全局唯一对象
var objLogManager = require('./myLogManager/LogManager.js').ObjLogManager;
var FuncLogEntity = require('./myLogManager/LogManager.js').FuncLogEntity;

//这里的语句只在监听的类中使用该语句
process.on('uncaughtException', function (err)
{
    objLogManager.error(err);
});


//一般的方式在Express中的应用
app.get('/', function(req, res)
{ 
    res.send('hello world'); 
    
    //【步骤二】在系统中针对日志的应用

    //六种日志的级别
    objLogManager.WriteLogTraceInfo("I am a Trace Log Data!");
    objLogManager.WriteLogDebugInfo("I am a Debug Log Data!");
    objLogManager.WriteLogInfoInfo("I am a Info Log Data!");
    objLogManager.WriteLogWarnInfo("I am a warn Log Data!");
    objLogManager.WriteLogErrorInfo("I am a Debug error Data!");
    objLogManager.WriteLogFatalInfo("I am a Debug fatal Data!");
    
    //日志支持的数据格式
    objLogManager.WriteLogInfoInfo("I am a Info Log Data!");
    objLogManager.WriteLogInfoInfo(["I am a Info Log Data_A!", "I am a Info Log Data_B!"]);

    objLogManager.WriteLogInfoInfo({ A: 1, B: 2, C: "333" });
    objLogManager.WriteLogInfoInfo([{ A: 1, B: 2, C: "333" }, "I am a Info Log Data_A!"]);

    objLogManager.WriteLogInfoInfo({ StrMessage: "我想我是海" });
    objLogManager.WriteLogInfoInfo([{ StrMessage: "我想我是海" }, { A1: 6, B1: 7, C1: "44333" }]);
    
    try
    {
        throw new Error("我是一个异常.......")
    }
    catch (ex)
    {
        objLogManager.WriteLogErrorInfo(ex);
    }

    try
    {
        throw new Error("我又是一个异常.......")
    }
    catch (ex)
    {
        objLogManager.WriteLogErrorInfo([ex, ex]);
    }
    
    //总体封装的形式
    objLogManager.WriteLogInfo(FuncLogEntity.LoggerLevels.DEBUG, 'Entering cheese testing In index_A_1');
    objLogManager.WriteLogInfo(FuncLogEntity.LoggerLevels.DEBUG,['Entering cheese testing In index_A_2', { a: 1, b: 2, c: 3 }]);
    
    //支持将控制台的异常重定向到日志中去
    console.error("DDDDDXXXXXXXXXXXXXXXXXXXX");
    
    try
    {
       throw new Error("我是一个异常.......")
    }
    catch (ex)
    {
        objLogManager.WriteLogErrorInfo(ex);
    }
        
    var curProcess = require("./myLogManager/ProcessInfo.js").GetCurProcess();    
    console.log("当前进程日志信息如下：");
    objLogManager.info({version:curProcess.version,title:curProcess.title,pid:curProcess.pid});

    console.log("当前进程信息如下：");
    console.log({ version: curProcess.version, title: curProcess.title, pid: curProcess.pid });

    //console.log(curProcess);

    //建议的使用方法:参数objct日志实体配置
    objLogManager.WriteLogDebugInfo(
        {
            objArguments: arguments,
            StrMessage: "这是一个日志的测试",
            StrOptManID: "admin",
            StrOptMan: "系统管理员",
            StrOptManOrgID: "BS0023",
            StrOptManOrg: "武汉大汉",
            StrOptManOrgStrutcID: "COMTERT_004",
            StrOptManOrgStrutc: "计算机学院"
        });

    //建议的使用方法:参数objct日志实体
    objLogManager.WriteLogDebugInfo(new FuncLogEntity(
        {
            objArguments: arguments,
            StrMessage: "这是一个日志的测试",
            StrOptManID:"admin",
            StrOptMan:"系统管理员",
            StrOptManOrgID:"BS0023",
            StrOptManOrg:"武汉大汉",
            StrOptManOrgStrutcID:"COMTERT_004",
            StrOptManOrgStrutc:"计算机学院"
        }));


    console.log('hello world');
}); 

app.get('/myIndex', routesForMyIndex.myIndexRoute);

//【步骤三】如果是Express的入口则在这里加入到App中间件中去,否则不需要该步骤
objLogManager.UseToApp(app);

app.listen('9990');

console.log('服务端已在端口9990启动服务.............');