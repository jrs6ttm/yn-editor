//【步骤一】获得定义日志全局唯一对象
var objLogManager = require('../myLogManager/LogManager.js').ObjLogManager;
var FuncLogEntity = require('../myLogManager/LogManager.js').FuncLogEntity;

exports.myIndexRoute = function (req, res)
{
	var strRes = "I am myIndexRoute!";

	res.send(strRes);

	objLogManager.WriteLogInfo(FuncLogEntity.LoggerLevels.DEBUG, 'I am myIndexRoute,Entering cheese testing In index_A_1');
	objLogManager.WriteLogInfo(FuncLogEntity.LoggerLevels.DEBUG, ['I am myIndexRoute,Entering cheese testing In index_A_2', { a2: 1, b3: 2, c3: 3 }]);
    
    console.log(strRes);
};