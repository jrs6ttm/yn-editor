
var process = require('process');

process.on('exit', function ()
{
    console.log('Bye.');
});

process.on('uncaughtException', function (err)
{
    console.log('Caught exception: ' + err);

    console.log(err);

});


//对象模块返回对象
module.exports.GetCurProcess = function ()
{
    return process;
};