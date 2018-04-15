
var log4js = require('../node_modules/log4js');

//LogConfig.json中除了标准的配置外，还有扩展的配置ExtendCfg部分
var cfgLog4js = require('./LogConfig.json');

//日志模中的日志类
var FuncLogger = require('../node_modules/log4js/lib/logger.js').Logger;

log4js.configure(cfgLog4js);

//下面的方式也可以加载配置，但由于我们对配置进行了扩展，因此采用读取出配置对象方式进行
//log4js.configure('./LogConfig.json');

//对日志的输入机别和输入格式进行调整：当然也可以不调整
//log4js.connectLogger(consoleLog, { level: 'INFO', format: ':method :url :status :response-time ms - :res[content-length]' });
//log4js.connectLogger(dateFileLog, { level: 'INFO', format: ':method :url :status :response-time ms - :res[content-length]' });
//log4js.connectLogger(dateFileLog_A, { level: 'INFO', format: ':method :url :status :response-time ms - :res[content-length]' });

var generateUUID = function()
{
    var d = new Date().getTime();
 
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) 
    {
        var r = (d + Math.random()*16)%16 | 0;
     
        d = Math.floor(d/16);
        
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });

    return uuid;
};

//实现功能:日志的通用实体
//参数说明:objLogEntityCfg
//         objLogEntityCfg.StrLogID:日志的UUID：不填时自动生成UUID
//         objLogEntityCfg.StrLogEevel:默认为TRACE
//         objLogEntityCfg.StrPorcessID:进程ID，不提供时自动从环境中去获取
//         objLogEntityCfg.StrProcessName:进程名
//         objLogEntityCfg.StrThreadID:线程ID，由于Node.js一般情况下单线程，因此这里一般不需提供
//         objLogEntityCfg.StrMessage:日志的内容【必填】
//         objLogEntityCfg.StrStackTrace:出错的跟踪信息
//         objLogEntityCfg.StrCurUrl:当前访问的网址
//         objLogEntityCfg.SourceFile:当前源文件，如需要的话请提供
//         objLogEntityCfg.objArguments:当前执行方法的参数【建议提供】
//         objLogEntityCfg.StrClassName:当前类名:默认从argments中获得
//         objLogEntityCfg.StrMethodName:当前方法名:默认从argments中获得
//         objLogEntityCfg.DtmOptDate:默认为当前时间
//         objLogEntityCfg.NRss:rss代表ram的使用情况
//         objLogEntityCfg.NHeapTotal:v8引擎内存分配
//         objLogEntityCfg.NHeapUsed:v8引擎内存分配中已使用的部分
//         objLogEntityCfg.StrOptManID:操作人ID【建议提供】
//         objLogEntityCfg.StrOptMan:操作人【建议提供】
//         objLogEntityCfg.StrOptManOrgID:操作人组织ID【建议提供】
//         objLogEntityCfg.StrOptManOrg:操作人组织【建议提供】
//         objLogEntityCfg.StrOptManOrgStrutcID:操作机构ID【建议提供】
//         objLogEntityCfg.StrOptManOrgStrutc:操作机构【建议提供】
//
var FuncLogEntity = function (objLogEntityCfg)
{
    //日志ID：由于要持久化，因此需要唯一例UUID
    this.StrLogID = "";

    //日志的级别:按Log4js中级别为准
    this.StrLogEevel = "";
    
    //进程ID
    this.StrPorcessID = "";

    //进程名称
    this.StrProcessName = "";

    //线程ID
    this.StrThreadID = "";
    
    //日志的信息
    this.StrMessage = "";

    //出错的堆栈信息
    this.StrStackTrace = "";

    //当前网址
    this.StrCurUrl = "";

    //源文件
    this.SourceFile = "";
    
    //类名
    this.StrClassName = "";

    //方法名称
    this.StrMethodName = "";
      
    //操作的时间
    this.DtmOptDate = null;

    //操作人员名称
    this.StrOptMan = "";

    //操作人ID
    this.StrOptManID = "";

    //操作组织名称
    this.StrOptManOrg = "";

    //操作组织ID
    this.StrOptManOrgID = "";

    //操作机构名称
    this.StrOptManOrgStrutc = "";

    //操作机构ID
    this.StrOptManOrgStrutcID = "";

    this.ObjLogEntityCfg = objLogEntityCfg || {};

    this.NRss = null;

    //V8引擎内存情况
    this.NHeapTotal = null;

    //V8引擎内存使用情况
    this.NHeapUsed = null;

    var me = this;

    var initFunc = function ()
    {
        me.StrLogID = me.ObjLogEntityCfg.StrLogID || generateUUID();

        //默认级别是跟踪级别
        me.StrLogEevel = me.ObjLogEntityCfg.StrLogEevel || "TRACE";

        //进程ID
        me.StrPorcessID = me.ObjLogEntityCfg.StrPorcessID || process.pid;

        //进程名称
        me.StrProcessName = me.ObjLogEntityCfg.StrProcessName || process.title;

        //日志的信息
        me.StrMessage = me.ObjLogEntityCfg.StrMessage || "";

        //类名
        if (me.ObjLogEntityCfg.StrClassName)
        {
            me.StrClassName = me.ObjLogEntityCfg.StrClassName;
        }
        else if (!me.ObjLogEntityCfg.objArguments || !me.ObjLogEntityCfg.objArguments.callee || !me.ObjLogEntityCfg.objArguments.callee.caller)
        {
            me.StrClassName = "";
        }
        else if (typeof me.ObjLogEntityCfg.objArguments.callee.calleer == "Function")
        {
            me.StrClassName = me.ObjLogEntityCfg.objArguments.callee.calleer.name || me.ObjLogEntityCfg.objArguments.callee.calleer.toString().match(/function\s*([^(]*)\(/)[1];
        }

        //方法名
        if (me.ObjLogEntityCfg.StrMethodName)
        {
            me.StrMethodName = me.ObjLogEntityCfg.StrMethodName;
        }
        else if (!me.ObjLogEntityCfg.objArguments || !me.ObjLogEntityCfg.objArguments.callee)
        {
            me.StrMethodName = "";
        }
        else if (typeof me.ObjLogEntityCfg.objArguments.callee == "Function")
        {
            me.StrMethodName = me.ObjLogEntityCfg.objArguments.callee.name || me.ObjLogEntityCfg.objArguments.callee.toString().match(/function\s*([^(]*)\(/)[1];
        }

        //内存使用情况
        me.NRss = me.ObjLogEntityCfg.NRss || process.memoryUsage().rss;
        
        //V8引擎内存使用情况
        me.NHeapTotal = me.ObjLogEntityCfg.NHeapTotal || process.memoryUsage().heapTotal;
        me.NHeapUsed = me.ObjLogEntityCfg.NHeapUsed || process.memoryUsage().heapUsed;
        
        //操作日期
        me.DtmOptDate = me.ObjLogEntityCfg.DtmOptDate || new Date();


        //操作人及其机构信息
        me.StrOptMan = me.ObjLogEntityCfg.StrOptMan || "";
        me.StrOptManID = me.ObjLogEntityCfg.StrOptManID || "";
        me.StrOptManOrg = me.ObjLogEntityCfg.StrOptManOrg || "";
        me.StrOptManOrgID = me.ObjLogEntityCfg.StrOptManOrgID || "";
        me.StrOptManOrgStrutc = me.ObjLogEntityCfg.StrOptManOrgStrutc || "";
        me.StrOptManOrgStrutcID = me.ObjLogEntityCfg.StrOptManOrgStrutcID || "";
    };

    initFunc();
};

//日志的级别
FuncLogEntity.LoggerLevels = { ALL: "ALL", TRACE: "TRACE", DEBUG: "DEBUG", INFO: "INFO", WARN: "WARN", ERROR: "ERROR", FATAL: "FATAL", NONE: "NONE" };

var FuncLogManager = function (cfgLog4js, log4js)
{
    //得到单个日志管理对象
    var funcGetLogManage = function (cfgLog4js, log4js)
    {
        var objRetValue = {};
        var dictCfgMap = (cfgLog4js.ExtendCfg && cfgLog4js.ExtendCfg.ExtendCfgItemMap ? cfgLog4js.ExtendCfg.ExtendCfgItemMap : null);

        for (var objTmp in cfgLog4js.appenders)
        {
            if (!dictCfgMap ||
                !dictCfgMap[cfgLog4js.appenders[objTmp].category] ||
                !dictCfgMap[cfgLog4js.appenders[objTmp].category] ||
                !dictCfgMap[cfgLog4js.appenders[objTmp].category].IsEnable ||
                typeof dictCfgMap[cfgLog4js.appenders[objTmp].category].IsEnable != "boolean" ||
                !dictCfgMap[cfgLog4js.appenders[objTmp].category].IsEnable)
            {
                continue;
            }

            objRetValue[cfgLog4js.appenders[objTmp].category] = log4js.getLogger(cfgLog4js.appenders[objTmp].category);
        }

        return objRetValue;
    };
    
    //实现功能：装配日志的实体
    //          funcGetLogEntity(""):
    //          funcGetLogEntity(FuncLogEntityCfg objLogData ):
    //          funcGetLogEntity( FuncLogEntity obj):
    //          funcGetLogEntity(其它 obj):
    //          funcGetLogEntity(Error obj):
    var funcGetLogEntity = function (objLogData)
    {       
        var objFuncLogEntityRetValue = null;

        if (!objLogData)
        {
            objFuncLogEntityRetValue = new FuncLogEntity({});

            return objFuncLogEntityRetValue;
        }

        //异常参数
        if (typeof objLogData == "object" && (objLogData instanceof Error))
        {
            objFuncLogEntityRetValue = new FuncLogEntity({});

            objFuncLogEntityRetValue.StrMessage = objLogData;

            return objFuncLogEntityRetValue;
        }


        //如果objLogData本身就是:FuncLogEntity
        if (typeof objLogData == "object" && objLogData instanceof FuncLogEntity)
        {
            objFuncLogEntityRetValue = objLogData;

            return objFuncLogEntityRetValue;
        }
        
        //如果objLogData是配置
        if (typeof objLogData == "object")
        {
            //由成员变量StrMessage确定是否为配置
            if (objLogData.hasOwnProperty("StrMessage"))
            {
                objFuncLogEntityRetValue = new FuncLogEntity(objLogData);
            }
            else
            {
                objFuncLogEntityRetValue = new FuncLogEntity({});
                objFuncLogEntityRetValue.StrMessage = objLogData;
            }

            return objFuncLogEntityRetValue;
        }
        
        if (typeof objLogData == "string")
        {
            objFuncLogEntityRetValue = new FuncLogEntity({});
            objFuncLogEntityRetValue.StrMessage = objLogData;

            return objFuncLogEntityRetValue;
        }

        objFuncLogEntityRetValue = new FuncLogEntity({});
        objFuncLogEntityRetValue.StrMessage = objLogData;

        return objFuncLogEntityRetValue;
    };

    //实现功能：装配实体日志实体数组
    //参数说明：objLog：可以为字符串，一般object，object配置，日志实体,或前面类型的数组
    //          objUnitCfg:只能为object配置或日志实体
    //返回结果：装配后的日志实体的数组
    //附注说明：装配的objUnitCfg中的同名内容强制赋值到装配的数组元素中去
    var funcGetLogEntityArray = function (objLog,objUnitCfg)
    {
        var arrParam = [];

        if (!objLog)
        {
            return arrParam;
        }

        if (typeof objLog == "object" && Array.isArray(objLog))
        {
            for (var objTmp in objLog)
            {
                arrParam.push(funcGetLogEntity(objLog[objTmp]));
            }
        }
        else
        {
            arrParam.push(funcGetLogEntity(objLog));
        }

        if (objUnitCfg && typeof objUnitCfg == "object" && (objUnitCfg.StrMessage || objUnitCfg instanceof FuncLogEntity))
        {
            for (var nI in arrParam)
            {
                for (var strTmp in objUnitCfg)
                {
                    if (!objUnitCfg.hasOwnProperty(strTmp))
                    {
                        continue;
                    }

                    if (arrParam[nI][strTmp])
                    {
                        arrParam[nI][strTmp] = objUnitCfg[strTmp];
                    }
                }
            }
        }

        return arrParam;
    }

    this.objlog4js = log4js;
    this.objcfgLog4js = cfgLog4js;
    this.dictAppenderCfg = {};
    this.objLogManage = funcGetLogManage(cfgLog4js, log4js);

    //实现功能：实现自定义日志的过程
    //参数说明: objLogParam
    //          objLogParam.strCategoryName:日志的CategoryName
    //          objLogParam.LogType:日志的类型：自定义类型，可以随意指定只要不重复就可了
    //          objLogParam.FuncLogappender:日志的appender
    //附注说明：上面的参数，可以是数组也可以
    this.PutCustomLogger = function (objLogParam)
    {
        if (!this.objcfgLog4js ||
            !this.objcfgLog4js.ExtendCfg ||
            !this.objcfgLog4js.ExtendCfg.ExtendCfgItemMapForCustomLog ||
            !this.objcfgLog4js.ExtendCfg.ExtendCfgItemMapForCustomLog[objLogParam.strCategoryName] ||
            !this.objcfgLog4js.ExtendCfg.ExtendCfgItemMapForCustomLog[objLogParam.strCategoryName].IsEnable)
        {
            return;
        }

        var objLogger = null;

        this.objlog4js.appenders[objLogParam.strCategoryName] = objLogParam.FuncLogappender;

        this.objlog4js.appenderMakers[objLogParam.strLogType] = objLogParam.FuncLogappender;

        objLogger = new FuncLogger(objLogParam.strCategoryName, (objLogParam.strLogLevel || "ALL"));


        if (this.objcfgLog4js &&
            this.objcfgLog4js.ExtendCfg &&
            this.objcfgLog4js.ExtendCfg.ExtendCfgItemMapForCustomLog &&
            this.objcfgLog4js.ExtendCfg.ExtendCfgItemMapForCustomLog[objLogParam.strCategoryName] &&
            this.objcfgLog4js.ExtendCfg.ExtendCfgItemMapForCustomLog[objLogParam.strCategoryName].levels)
        {
            objLogger.setLevel(this.objcfgLog4js.ExtendCfg.ExtendCfgItemMapForCustomLog[objLogParam.strCategoryName].levels);
        }

        //objLogger.addListener("log", objLogParam.FuncLogappender);
        objLogger.on("log", objLogParam.FuncLogappender);

        this.objLogManage[objLogParam.strCategoryName] = objLogger;
    };

    //针对向Express应用的初始化
    this.UseToApp = function(app)
    {
        for (var objTmp in this.objLogManage)
        {
            if (!this.objLogManage.hasOwnProperty(objTmp))
            {
                continue;
            }
            
            app.use(this.objlog4js.connectLogger(this.objLogManage[objTmp], { level: this.objcfgLog4js.levels[objTmp], format: ':req[accept] :res[content-length] :date :referrer :http-version :method :url :status :user-agent :response-time' }));
        }
    };

    //实现功能：写TRACE级别日志信息的原生接口方法
    //参数说明：objLog:日志的数据：支持字符串，数组，object等
    //返回参数: 无
    //附注说明：本方法将原生的日志对应的方法公开出来，功能，方法名和参数均与遵循原生的同名方法
    this.trace = function (objLog)
    {
        for (var objTmp in this.objLogManage)
        {
            if (!this.objLogManage.hasOwnProperty(objTmp))
            {
                continue;
            }

            this.objLogManage[objTmp].trace(objLog);
        }
    };
   
    //实现功能：写DEBUG级别日志信息的原生接口方法
    //参数说明：objLog:日志的数据：支持字符串，数组，object等
    //返回参数: 无
    //附注说明：本方法将原生的日志对应的方法公开出来，功能，方法名和参数均与遵循原生的同名方法
    this.debug = function (objLog)
    {
        for (var objTmp in this.objLogManage)
        {
            if (!this.objLogManage.hasOwnProperty(objTmp))
            {
                continue;
            }

            this.objLogManage[objTmp].debug(objLog);
        }
    };

    //实现功能：写INFO级别日志信息的原生接口方法
    //参数说明：objLog:日志的数据：支持字符串，数组，object等
    //返回参数: 无
    //附注说明：本方法将原生的日志对应的方法公开出来，功能，方法名和参数均与遵循原生的同名方法
    this.info = function (objLog)
    {
        for (var objTmp in this.objLogManage)
        {
            if (!this.objLogManage.hasOwnProperty(objTmp))
            {
                continue;
            }

            this.objLogManage[objTmp].info(objLog);
        }
    };

    //实现功能：写WARN级别日志信息的原生接口方法
    //参数说明：objLog:日志的数据：支持字符串，数组，object等
    //返回参数: 无
    //附注说明：本方法将原生的日志对应的方法公开出来，功能，方法名和参数均与遵循原生的同名方法
    this.warn = function (objLog)
    {
        for (var objTmp in this.objLogManage)
        {
            if (!this.objLogManage.hasOwnProperty(objTmp))
            {
                continue;
            }

            this.objLogManage[objTmp].warn(objLog);
        }
    };

    //实现功能：写ERROR级别日志信息的原生接口方法
    //参数说明：objLog:日志的数据：支持字符串，数组，object等
    //返回参数: 无
    //附注说明：本方法将原生的日志对应的方法公开出来，功能，方法名和参数均与遵循原生的同名方法
    this.error = function (objLog, blIsFromCosole)
    {
        blIsFromCosole = (!blIsFromCosole ? false : true);

        for (var objTmp in this.objLogManage)
        {
            if (!this.objLogManage.hasOwnProperty(objTmp))
            {
                continue;
            }

            if (blIsFromCosole && this.dictAppenderCfg[objTmp] && this.dictAppenderCfg[objTmp].type == "console")
            {
                continue;
            }

            this.objLogManage[objTmp].error(objLog);
        }
    };

    //实现功能：写FATAL级别日志信息的原生接口方法
    //参数说明：objLog:日志的数据：支持字符串，数组，object等
    //返回参数: 无
    //附注说明：本方法将原生的日志对应的方法公开出来，功能，方法名和参数均与遵循原生的同名方法
    this.fatal = function (objLog)
    {
        for (var objTmp in this.objLogManage)
        {
            if (!this.objLogManage.hasOwnProperty(objTmp))
            {
                continue;
            }

            this.objLogManage[objTmp].fatal(objLog);
        }
    };

    //实现功能：写日志信息的方法
    //参数说明：strLogLevel：必须为：FuncLogEntity.LoggerLevels中的级别
    //          objLog:日志的数据：支持一般Object，字符串，Object配置及日志实体
    this.WriteLogInfo = function (strLogLevel, objLog)
    {
        strLogLevel = strLogLevel || "TRACE";

        switch (strLogLevel)
        {
            case FuncLogEntity.LoggerLevels.DEBUG:
                {
                    this.WriteLogDebugInfo(objLog);
                } break;
            case FuncLogEntity.LoggerLevels.ERROR:
                {
                    this.WriteLogErrorInfo(objLog);
                } break;
            case FuncLogEntity.LoggerLevels.FATAL:
                {
                    this.fatal(objLog);
                } break;
            case FuncLogEntity.LoggerLevels.INFO:
                {
                    this.WriteLogInfoInfo(objLog);
                } break;
            case FuncLogEntity.LoggerLevels.ALL:
            case FuncLogEntity.LoggerLevels.TRACE:
                {
                    this.WriteLogTraceInfo(objLog);
                } break;
            case FuncLogEntity.LoggerLevels.WARN:
                {
                    this.WriteLogWarnInfo(objLog);
                } break;
            default:
            case FuncLogEntity.LoggerLevels.NONE:
                {

                } break;
        }
    };

    //实现功能：写TRACE级别日志信息的方法
    //参数说明：objLog:日志的数据：支持一般Object，字符串，Object配置及日志实体
    //返回参数: 无
    this.WriteLogTraceInfo = function (objLog)
    {
        var arrParam = funcGetLogEntityArray(objLog, {StrLogEevel:FuncLogEntity.LoggerLevels.TRACE});

        this.trace(arrParam);
    };

    //实现功能：写日志DEBUG的方法
    //参数说明：objLog:日志的数据：支持一般Object，字符串，Object配置及日志实体
    //返回参数: 无
    this.WriteLogDebugInfo = function (objLog)
    {
        var arrParam = funcGetLogEntityArray(objLog, { StrLogEevel: FuncLogEntity.LoggerLevels.DEBUG });

        this.debug(arrParam);
    };

    //实现功能：写日志INFO的方法
    //参数说明：objLog:日志的数据：支持一般Object，字符串，Object配置及日志实体
    //返回参数: 无
    this.WriteLogInfoInfo = function (objLog)
    {
        var arrParam = funcGetLogEntityArray(objLog, { StrLogEevel: FuncLogEntity.LoggerLevels.INFO });

        this.info(arrParam);
    };

    //实现功能：写日志WARN的方法
    //参数说明：objLog:日志的数据：支持一般Object，字符串，Object配置及日志实体
    //返回参数: 无
    this.WriteLogWarnInfo = function (objLog)
    {
        var arrParam = funcGetLogEntityArray(objLog, { StrLogEevel: FuncLogEntity.LoggerLevels.WARN });

        this.warn(arrParam);
    };

    //实现功能：写日志ERROR的方法
    //参数说明：objLog:日志的数据：支持一般Object，字符串，Object配置及日志实体
    //返回参数: 无
    this.WriteLogErrorInfo = function (objLog, blIsFromCosole)
    {
        var arrParam = funcGetLogEntityArray(objLog,{ StrLogEevel: FuncLogEntity.LoggerLevels.ERROR });

        blIsFromCosole = (!blIsFromCosole ? false : true);

        for (var objTmp in this.objLogManage)
        {
            if (!this.objLogManage.hasOwnProperty(objTmp))
            {
                continue;
            }

            if (blIsFromCosole && this.dictAppenderCfg[objTmp] && this.dictAppenderCfg[objTmp].type == "console")
            {
                continue;
            }

            this.objLogManage[objTmp].error(arrParam);
        }
    };

    //实现功能：写日志FATAL的方法
    //参数说明：objLog:日志的数据：支持一般Object，字符串，Object配置及日志实体
    //返回参数: 无
    this.WriteLogFatalInfo = function (objLog)
    {
        var arrParam = funcGetLogEntityArray(objLog, { StrLogEevel: FuncLogEntity.LoggerLevels.FATAL });

        this.fatal(arrParam);
    };

    var me = this;

    //相当于构造函数后的初始化方法
    var FuncInit = function ()
    {
        //初始化成员dictAppenderCfg
        for (var objTmp in me.objcfgLog4js.appenders)
        {
            me.dictAppenderCfg[me.objcfgLog4js.appenders[objTmp].category] = me.objcfgLog4js.appenders[objTmp];
        }

        //console.log(me.dictAppenderCfg);

        //将控制台的出错信息给重定到日志中
        console.error = function ()
        {
            me.WriteLogErrorInfo(funcGetLogEntity(Array.prototype.slice.call(arguments, 0)[0]), true);
        };

        //这里可加入初始化过程
    };

    FuncInit();
};

var ObjLogManager = new FuncLogManager(cfgLog4js, log4js);

var FuncAppenderCustom = require("./LogManagerCustomAppender.js").appender();

//加入自定义的日志
ObjLogManager.PutCustomLogger(
{
    strCategoryName: "MyCustomLog20170114",
    strLogType: "MyCustomLog20170114_Type",
    FuncLogappender: FuncAppenderCustom || function (loggingEvent)
    {
        console.log("这是我的自定义日志！");
        console.log(loggingEvent);
    }
});

//对象模块返回对象
module.exports.ObjLogManager = ObjLogManager;
module.exports.FuncLogEntity = FuncLogEntity;