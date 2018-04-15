(function($){
	var TemplateView = {
	    SearchConditionHTML : '<ul class="list-group">'+
						           '<li class="list-group-item">'+
						                 '<div class="row">'+
											 '<span class="col-md-2" align="center">课程:</span>'+
											 '<div class="col-md-3">'+
												'<select class="form-control" name="student">'+
													'<option value="">-- 不限 --</option>'+
													'<option value="56e77f7a32d47e4d5eb5e40a">student1</option>'+
													'<option value="56e77f8b519742275e0be58c">student2</option>'+
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
									'<th style="width:10%;text-align: center">测试者</th>'+
									'<th style="width:20%;text-align: center">考卷</th>'+
									'<th style="width:10%;text-align: center">得分</th>'+
									'<th style="width:10%;text-align: center">总分</th>'+
									'<th style="width:10%;text-align: center">正确率</th>'+
									'<th style="width:10%;text-align: center">是否提交</th>'+
									'<th style="width:10%;text-align: center">是否批改</th>'+
									'<th style="width:20%;text-align: center">测试时间</th>'+
					           '</thead>'+
					           '<tbody>'+
					           '</tbody>'+
					        '</table>',		      

		ResultItemHTML  :   '<td><%=username%></td>'+
							'<td><%=examName%>_V<%=exam_version%></td>'+
							'<%if(isCorrected){%>'+
								'<td><%=sumMyScore%></td>'+
								'<td><%=sumScore%></td>'+
								'<td><%=Math.round((sumMyScore/sumScore)*100*100)/100%>%</td>'+
								'<td><%=isSubmit?"已提交":"未提交"%></td>'+
								'<td>已批改</td>'+
							'<%}else{%>'+
								'<td>--</td>'+
								'<td>--</td>'+
								'<td>--</td>'+
								'<td><%=isSubmit?"已提交":"未提交"%></td>'+
								'<td>未批改</td>'+
							'<%}%>'+
							'<td><%=new Date(createTime).toLocaleString()%></td>'

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
			title : '查看测试者考卷的详细情况',
			style : 'cursor:pointer;text-align: center'
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

			$(this.el).attr({data_exam_id: this.model.get('examId')});
			$(this.el).attr({data_user_id: this.model.get('userId')});
			if(!this.model.get('isSubmit')){
				$(this.el).attr('title', '尚未提交，不能查看');
				$(this.el).attr({disabled: true});
			}
		}
	});

	//结果集，用来组织结果item
	var ResultListView = Backbone.View.extend({
		className : 'lrList',

		events: {
			'click tr' : 'lookDetailLog'
		},
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

		lookDetailLog : function(event){
			var optObj = event.currentTarget;
			if($(optObj).attr('disabled')){
				alert('测试者尚未提交，不能查看');
				return false;
			}
			var examId = $(optObj).attr('data_exam_id');
			var userId = $(optObj).attr('data_user_id');

			window.open('http://'+localHost+'/exam/enterExam?examId='+examId+'&examType=check&userId='+userId);
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
			//this.searchConditionView = new SearchConditionView();
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
					$('nav div', this.el).append(this.sortPageView.render(PageTemplateView.PageHTML2).el.innerHTML);
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