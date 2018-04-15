(function($){
	var TemplateView = {
	    SearchConditionHTML : '<ul class="list-group">'+
						           '<li class="list-group-item">'+
						                 '<div class="row">'+
											 '<span class="col-md-2" align="center">课程:</span>'+
											 '<div class="col-md-3">'+
												'<select class="form-control" name="course">'+
													'<option value="">-- 不限 --</option>'+
													'<option value="70d3dea0-ca17-11e5-9d39-6343fd21f38a">SQL注入漏洞获取网站权限</option>'+
													'<option value="55420730-ca16-11e5-9d39-6343fd21f38a">SQL注入漏洞识别</option>'+
													'<option value="cd7d1cf0-ca19-11e5-9d39-6343fd21f38a">SQL注入与系统之间的安全关系</option>'+
													'<option value="1cd68750-ca1a-11e5-9d39-6343fd21f38a">客户端SQL注入漏洞</option>'+
												'</select>'+
											 '</div>'+
									    '</div>'+
									'</li>'+
						        '</ul>',

		SortConditionHTML : '<nav class="navbar navbar-default" role="navigation">'+
								'<div>'+
								'</div>'+
							'</nav>',

		ResultTableHTML : 	'<table class="table table-hover">'+
					           '<thead>'+
									'<th style="width:10%;text-align: center">课程</th>'+
									'<th style="width:20%;text-align: center">考卷</th>'+
									'<th style="width:10%;text-align: center">版本</th>'+
									'<th style="width:30%;text-align: center">操作</th>'+
					           '</thead>'+
					           '<tbody>'+
					           '</tbody>'+
					        '</table>',		      

		ResultItemHTML  :   '<td><%=courseName%></td>'+
							'<td><%=examName%></td>'+
							'<td>V<%=exam_version%></td>'+
							'<td>'+
								'<button type="button" class="btn btn-info btn-xs lookTester" >查看测试人员</button>&nbsp;&nbsp;'+
								'<button type="button" class="btn btn-info btn-xs lookStatistic">查看统计情况</button>'+
							'</td>'

	};

	//搜索条件
	var SearchConditionView = Backbone.View.extend({
		className : 'searchCondition',

		events : {
			'change select' : 'changeCondition'
		},

		initialize : function(){
			_.bindAll(this, 'render');
			this.render();
		},

		render: function(){
			$(this.el).append(TemplateView.SearchConditionHTML);
			$('.container', 'body').append(this.el);					      
		},

		changeCondition: function(event){
			var currObj = event.currentTarget;
			var cName = $(currObj).attr('name')
				,cValue = $(currObj).val();
			switch (cName) {
				case 'student':
					Query.set({userId: cValue});
					break;
				case 'course':
					Query.set({courseId: cValue});
					break;
				default:
					break;
			}

		}

	});

	//排序条件
	var SortConditionView = Backbone.View.extend({
		className : 'sortCondition',

		events : {
			'click .myPage' : 'devidePage'
		},

		initialize : function(){
			_.bindAll(this, 'render');
			this.render();
		},

		render: function(){
			this.template = _.template(TemplateView.SortConditionHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);
			$('.container', 'body').append(this.el);
		},

		devidePage : function(event){
			var Obj = event.currentTarget;
			var toPage = Number($(Obj).attr('data-currentPage'));
			if(toPage < 7){
				Query.set({currentPage: toPage, startPage:1});
			}else{
				var startP = toPage - 5;
				var stopP = toPage + 4;
				if(startP < 1)
					startP = 1;
				if(stopP > Query.get('totalPage'))
					stopP = Query.get('totalPage');
				Query.set({currentPage: toPage, startPage: startP, endPage: stopP});
			}
		}
	});

	//结果item
	var ResultItemView = Backbone.View.extend({
		tagName : 'tr',
		attributes : {
			style : 'text-align: center'
		},
		events : {
			'click .lookTester' : 'lookTester',
			'click .lookStatistic' : 'lookStatistic'
		},

		initialize : function(){
			_.bindAll(this, 'render');
			this.render();
		},

		render : function(){
			this.template = _.template(TemplateView.ResultItemHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);
		},

		lookTester: function(){
			var examId = this.model.get('examId'), examName = this.model.get('examName');
			window.open('http://'+localHost+'/exam/getMyExam?examId='+examId+'&examName='+encodeURI(examName)+'&type=all');
		},

		lookStatistic : function(){
			var examId = this.model.get('examId');
			window.open('http://'+localHost+'/examItemsStatistic?examId='+examId+'&examType=statistic');
		}
	});

	//结果集，用来组织结果item
	var ResultListView = Backbone.View.extend({
		className : 'lrList',

		initialize : function(){
			_.bindAll(this, 'render', 'addItem', 'waitData');
			this.render();
			this.addItem();
		},

		render :  function(){
			$(this.el).append(TemplateView.ResultTableHTML);
			$('.container', 'body').append(this.el);
		},

		addItem : function(){
			var resultList = this.collection.models;
			_.each(resultList, function(item){
				var resultItemView = new ResultItemView({model: item});
				$('tbody', this.el).append(resultItemView.el);
			});

		},

		removeSelf : function(){
			$(this.el).remove();
		},

		waitData : function(){
			this.el.innerHTML = '<div style="margin-top:15%;margin-left:45%;"><img src = "../../images/wait.jpg"  alt="请稍等..."/></div>';
		}
	});

	//主视图，组织各个子视图
	var APPView = Backbone.View.extend({
		className : 'container',
		attributes : {
			style : "padding: 20px 50px 10px"
		},

		initialize : function(){
			_.bindAll(this, 'render', 'writeItem', 'getDevidedList', 'findByQuery');
			//this.listenTo(logList, 'reset', this.writeItem);
			this.listenTo(logList, 'sort', this.writeItem);
			this.listenTo(Query, 'change', this.findByQuery);
			this.render();
		},

		render : function(){
			$('body').append(this.el);
			this.searchConditionView = new SearchConditionView();
			this.sortConditionView = new SortConditionView({model: Query});
			this.pageMaterialsList = new LogList();//分页collection
			this.resultListView = new ResultListView({collection: this.pageMaterialsList});
			
			this.getDevidedList();
		},

		writeItem : function(){
			if(this.resultListView)
				this.resultListView.removeSelf();
			if(this.sortPageView) {
				this.sortPageView.removeSelf();
				var temp = $('.nav', this.sortConditionView.el);
				if(temp.length > 0)
					temp.last().remove();
			}

			if(this.bottomPageView)
				this.bottomPageView.removeSelf();

			this.getDevidedList();
		},

		findByQuery : function(){
			if(this.bottomPageView)
				this.bottomPageView.removeSelf();
			if(this.sortPageView) {
				this.sortPageView.removeSelf();
			}
			this.resultListView.waitData();//等待提示

			var changedItems = Query.changed;
			if(changedItems.hasOwnProperty('userId') || changedItems.hasOwnProperty('courseId')){//查询动作
				logList.postForm();
			}else{//是分页动作
				this.writeItem();
			}

		},

		getDevidedList : function(){
			//处理分页list
			var totalLength = logList.length;
			if(totalLength > 0) {
				var start = (Query.get('currentPage') - 1) * Query.get('recordsSize');
				var end = start + Query.get('recordsSize');
				if(end > totalLength)
					end = totalLength;
				var tempLogArr = logList.slice(start, end);
				this.pageMaterialsList.reset(null);

				if (tempLogArr.length > 0) {
					for(var i=0;i<tempLogArr.length;i++){
						this.pageMaterialsList.push(tempLogArr[i]);
					}

					this.resultListView = new ResultListView({collection: this.pageMaterialsList});
					this.bottomPageView = new PageView({model: Query});
					this.sortPageView = new PageView({model: Query});
					$('nav div', this.el).append(this.sortPageView.render(PageTemplateView.PageHTML1).el.innerHTML);
					$(this.el, 'body').append(this.bottomPageView.render(PageTemplateView.PageHTML).el);
				}
			}
		},

		reLoad : function(data){
			//处理page
			Query.set({currentPage : 1, startPage: 1, endPage: Query.get('totalPage')}, {silent: true});
			this.writeItem();
		}

	});

	var appView = new APPView();
})(jQuery);