exports.extend = function(ctor, superCtor)
{
    var f = function() {};
    f.prototype = superCtor.prototype;

    ctor.prototype = new f();
    ctor.prototype.constructor = ctor;
};
