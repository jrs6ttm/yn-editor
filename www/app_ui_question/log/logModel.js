var LogModel = Backbone.Model.extend({
    defaults : {
        _id : '',
        id : '',
        userId : '',
        username : '',
        event: '',
        role : '',
        taskId : '',
        taskName : '',
        //step: 0,
        courseId : '',
        courseName : '',
        courseStatus : '',
        createTime : ''
    }
});

var QueryModel = Backbone.Model.extend({
    defaults:{
        userId : '',
        username : '',
        event: '',
        role : '',
        taskId : '',
        taskName : '',
        //step: 0,
        courseId : '',
        courseName : '',
        courseStatus : '',
        createTime : '',

        recordsSize: 20,
        totalPage: 0,
        totalRecords: 0,
        currentPage: 1,
        pageSize: 10,
        startPage:1,
        endPage: 10
    }
});
var Query = new QueryModel();

var LogList = Backbone.Collection.extend({
    model: LogModel,
    initialize : function(){
        _.bindAll(this, 'postForm');
        //处理可能的请求，即此页面可能由其他页面请求而来
        var urlParams = window.location.search;
        if(urlParams.indexOf('?') != -1){
            var param = urlParams.substr(1);
            var paramArr = param.split('=');
            Query.set({fileName : paramArr[1]}, {silent: true});
            console.log(Query);
        }

        //this.postForm();//初始化对象，也即加载初始化页面时，请求数据
    },
    //集合数据排序依据
    comparator : function(model_1, model_2){
        var start = model_1.get('createTime');
        var end = model_2.get('createTime');
        var compareResult = start > end;
        return compareResult ? 0:1;
    },
    postForm : function(){
        var me = this;
        $.get('/log/searchLogs', Query.toJSON(), function(data){
            me.reset(null);
            var dataArr = JSON.parse(data);
            console.log(dataArr);
            if(dataArr  && dataArr.length > 0) {
                var counts = dataArr.length;
                var size = Math.ceil(counts / Query.get('recordsSize'));

                for(var i=0;i<dataArr.length;i++){
                    var tempModel = new LogModel(dataArr[i]);
                    me.push(tempModel);
                }
                //me.reset(dataArr);
                Query.set({totalRecords: counts, totalPage: size, currentPage : 1, startPage: 1, endPage: size > 10?10:size});
                //me.sort();
            }else {
                Query.set({totalRecords: 0, totalPage: 0, currentPage : 1, startPage: 1, endPage: Query.get('totalPage')});
                me.reset(null);
            }
        });
    }

});
var logList = new LogList();
logList.postForm();


