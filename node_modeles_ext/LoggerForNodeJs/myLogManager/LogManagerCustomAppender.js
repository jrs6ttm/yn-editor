"use strict";
var layouts = require('../node_modules/log4js/lib/layouts.js');

function LogManagerCustomAppender(layout, timezoneOffset)
{
    layout = layout || layouts.colouredLayout;

    return function (loggingEvent)
    {
        console.log("-------------------------------------------");
        //170207 invalidated by fz(打印重复信息)
        //console.log(loggingEvent);

        //console.log(layout(loggingEvent, timezoneOffset));
    };
}

function LogManagerConfigure(config)
{
    var layout;

    if (config.layout)
    {
        layout = layouts.layout(config.layout.type, config.layout);
    }

    return LogManagerCustomAppender(layout, config.timezoneOffset);
}

module.exports.appender = LogManagerCustomAppender;
module.exports.configure = LogManagerConfigure;
