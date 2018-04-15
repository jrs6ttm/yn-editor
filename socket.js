var socketIo = require('socket.io');
var io = null;
var appSocket;
exports.startSocketIo = function (server) {
    var users = [];
    io = socketIo(server);
    var socketMap = {};
    console.log('Socket service established.');
    //var currHandle=[];
    io.sockets.on('connection', function (socket) {
        var notice = [];
        socket.on('ui',function(data){
            socket.userId = data.id;
            socket.noticeNum = 0;
            socket.notices = [];
            socketMap[data.id] = socket;
        });
        socket.on('newNotice', function (obj) {
            for(var i = 0; i < obj.toOthers.length; i++){
                var fromUserId = obj.fromMe.userId;
                var mySocket = socketMap[fromUserId];
                //if(mySocket === socketMap[socket.userId]){
                    mySocket.notices = notice.push(obj.comment);
                    obj.noticeNum = mySocket.noticeNum;
                    console.log(mySocket.noticeNum);
                    mySocket.broadcast.emit('newNotice',obj);
                //}
            }
        });
        var room;
        /*var currentHandle={};
        var isControl=false;*/
        socket.on('room',function(data){
            room=data.room;
            var flag = 1;
            for(var i=0;i<users.length;i++) {
                if(users[i].id === data.user.id) {
                    users[i].cntNum++;
                    flag = 0;
                    break;
                }
            }
            if(flag) {
                data.user.cntNum = 1;
                users.push(data.user);
                socket.broadcast.to(room).emit('joinRoom', data.user);
            }
            socket.join(room);
            socket.userId =data.user.id;
            socket.emit('joinSuccess',users);
        });
        socket.on('removeId',function(data){
            socket.broadcast.to(room).emit('removeId',data);

        });
        /*socket.on('controlled',function(data){
            socket.broadcast.to(room).emit('controlId',data);
        });*/
        socket.on('addNew',function(newObj){
            //console.log(newObj);
            socket.broadcast.to(room).emit('addNew',newObj);
        });
        socket.on('changeParent',function(changes){
            //socket.broadcast.to(room).emit('changeParent',changes);
        });
        socket.on('geometryChange',function(changes){
            //console.log(changes);
            socket.broadcast.to(room).emit('controlId',changes.id);
            socket.broadcast.to(room).emit('geometryChange',changes);
        });
        socket.on('removeCell', function (changes) {
            socket.broadcast.to(room).emit('removeCell',changes.id);
        });
        socket.on('changeLabel', function (changes) {
            socket.broadcast.to(room).emit('changeLabel',changes);
        });
        socket.on('sendMessage', function (msgData) {
            socket.broadcast.to(room).emit('sendMessage',msgData);
        });
        //用户点击“注销”时
        socket.on('logout',function(data){
            var index;
            for(var i=0;i<users.length;i++) {
                if(users[i].id === data.id) {
                    index = i;
                    users.splice(index,1);
                    socket.broadcast.to(room).emit('logout',data.id);
                    break;
                }
            }
         });
        //用户关闭页面时
          socket.on('disconnect', function () {
             var index;
             for(var i=0;i<users.length;i++) {
                 if(users[i].id === socket.userId) {
                     users[i].cntNum --;
                     if( users[i].cntNum === 0) {
                         index = i;
                         users.splice(index,1);
                         socket.broadcast.to(room).emit('logout',socket.userId);
                     }
                     break;
                 }
             }
          });
    });
};

exports.getSocket = function () {
    return appSocket;
};
exports.getIO = function () {
    return io;
};

