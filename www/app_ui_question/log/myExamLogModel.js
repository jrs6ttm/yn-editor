var LogModel = Backbone.Model.extend({
    defaults : {
        _id : '',
        userId: '',
        username : '',
        examId : '',
        examName : '',
        sumMyScore : '',
        sumScore: '',
        isSubmit: false,
        isCorrected : false,
        exam_version : 1.0,
        createTime : '',
        lastModify : ''
    }
});

var QueryModel = Backbone.Model.extend({
    defaults:{
        userId : '',
        username : '',
        courseId : '123',
        courseName : '',
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
        //window.open('http://192.168.1.44:14000/exam/getMyExam?examId='+examId+'&examName='+examName+'&type=all');
        var urlParams = window.location.search;
        if(urlParams.indexOf('?') != -1){
            var param = urlParams.substr(1);
            var paramArr = param.split('&');
            Query.set({examId : paramArr[0].split('=')[1], examName:decodeURI(paramArr[1].split('=')[1]), type:paramArr[2].split('=')[1]}, {silent: true});
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
        $.post('/exam/getMyExam', Query.toJSON(), function(data){
            me.reset(null);

            if(data  && data.length > 0) {
                var counts = data.length;
                var size = Math.ceil(counts / Query.get('recordsSize'));

                for(var i=0;i<data.length;i++){
                    var tempModel = new LogModel(data[i]);
                    tempModel.set({examName: Query.get('examName')});
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


