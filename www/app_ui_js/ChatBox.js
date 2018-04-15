/**
 * Created by fangz_000 on 11/23/2015.
 */
var ChatBox = function(editorUi, container) {
    this.editorUi = editorUi;
    this.container = container;
    this.msgObjs = [];
    this.chatInfo = null;
    this.init();
};
ChatBox.prototype.init = function () {
    this.container.setAttribute('style', 'height: 400px; width: 300px; background: rgba(245, 245, 245, 0.8); position: absolute; right: 0;');
    this.msgDiv = document.createElement('div');
    this.messageDiv = document.createElement('li');
    this.msgDiv.appendChild(this.messageDiv);
    this.messageDiv.setAttribute('style','overflow-y:auto;list-style: none;padding-left:5px 10px;');
    this.messageDiv.style.height = '360px';
    var inputDiv = document.createElement('div');
    inputDiv.setAttribute('style','margin:0px 0px 2px,1px;height:30px');
    var inputMsg = document.createElement('textarea');
    inputMsg.type = 'text';
    inputMsg.setAttribute('style', 'width:82%;height:30px;margin:0px 0px 0px 1px;float:left;resize:none');
    inputMsg.style.hover = 'border:1px solid #B8B8B8;border-top:1px solid #A1A1A1';
    inputMsg.placeholder = 'send message';
    inputMsg.setAttribute('id', 'inputMsg');

    this.sendBtn = document.createElement('button');
    this.sendBtn.innerHTML = mxResources.get('sendMessage');
    this.sendBtn.id = 'sendBtn';
    this.sendBtn.setAttribute('style', 'width:14%;height:38px;float:right;color:#fff;background-color:#3da247;border:0px solid #538730');
    //sendBtn.className = 'geBtn gePrimaryBtn';
    this.container.appendChild(this.msgDiv);
    this.container.appendChild(inputDiv);
    inputDiv.appendChild(inputMsg);
    inputDiv.appendChild(this.sendBtn);
    //发送消息

    this.sendBtn.onclick = mxUtils.bind(this, function () {
        this.msgObj = {
            user: {
                userName: userName,
                userId: userId
            },
            msg: document.getElementById('inputMsg').value,
            sendTime: new Date()
        };
        if(this.msgObj.msg.trim() === ''){
            //mxUtils.confirm('the message can not be null!');
            var message = mxResources.get('nullInput');
            var tipDialog = new tipDialogBody(this.editorUi,message);
            this.editorUi.showDialog(tipDialog, 300, null, true, true);
            document.getElementById('inputMsg').focus();
        }
         else{
            this.sendMessage(this.msgObj);
            this.addMessage(this.msgObj,false);
        }
        document.getElementById('inputMsg').value='';
    });


    //enter键触发点击发送按钮事件
    mxEvent.addListener(inputMsg, 'keypress', function (e) {
        if (e.keyCode == 13) {
            document.getElementById("sendBtn").click();
        }
    });
    this.sendBtn.onmouseover = mxUtils.bind(this, function () {
        this.sendBtn.style.backgroundColor = '#90dfa2';
        this.sendBtn.style.cursor = 'pointer';
    });
    this.sendBtn.onmouseout = mxUtils.bind(this, function () {
        this.sendBtn.style.backgroundColor = '#3da247';
    });
};
ChatBox.prototype.addMessage = function (msgObj,isHistory) {
    //创建一个div用来装发送人和消息（或者时间等）
    var itemDiv = document.createElement('li');
    var nameContainter = document.createElement('li');
    var nameSpan = document.createElement('span');
    var timeSpan = document.createElement('span');
    var msgContainer = document.createElement('li');
    nameContainter.appendChild(nameSpan);
    nameContainter.appendChild(timeSpan);
    nameSpan.innerHTML = msgObj.user.userName+' ';
    timeSpan.innerHTML = (new Date()).toLocaleTimeString();
    msgContainer.innerHTML = msgObj.msg+'<br>';
    itemDiv.appendChild(nameContainter);
    itemDiv.appendChild(msgContainer);
    this.messageDiv.appendChild(itemDiv);
    itemDiv.setAttribute('style','width:100%');
    nameSpan.setAttribute('style','color:#4183C4');
    timeSpan.setAttribute('style','font-size:9px;color:#C0C0C0');
    nameContainter.setAttribute('style','width:280px;text-align:right;float:right;list-style-type: none;');
    msgContainer.setAttribute('style','float:right;list-style::none;border:1px solid #ccc;background-color: #FFFF00;margin-left: 50px;padding:5px 10px;border-radius: 5px;');
    if(msgObj.user.userId != userId){
        nameContainter.setAttribute('style','float:left;width:280px;list-style-type: none;');
        msgContainer.setAttribute('style','float:left;list-style:none;border:1px solid #ccc;background-color: gold;margin-right:50px;padding:5px 10px;border-radius: 5px;');
    }
    // 设置内容区的滚动条到底部
    this.messageDiv.scrollTop = this.messageDiv.scrollHeight;
    if(!isHistory){
        this.msgObjs.push(msgObj);
        this.chatInfo = {
            chatRoom : urlParams['ch'],
            msgObj:this.msgObjs
        };
        //console.log(this.chatInfo);
    }


};
ChatBox.prototype.sendMessage = function (msgObj) {
    //利用syncChanges()向服务器发送socket消息
    sendMsg('sendMessage',msgObj);
};
ChatBox.prototype.getChatInfo = function(){
    return this.chatInfo;
};


