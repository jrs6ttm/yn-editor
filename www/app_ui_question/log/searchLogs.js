(function($){
	var TemplateView = {
	    SearchConditionHTML : '<ul class="list-group">'+
						           '<li class="list-group-item">'+
						                 '<div class="row">'+
											 '<span class="col-md-2" align="center">学生:</span>'+
											 '<div class="col-md-3">'+
												'<select class="form-control" name="student">'+
													'<option value="">-- 不限 --</option>'+
													'<!--<option value="06bc71be-c8eb-46e9-989f-3899d9456966">user1</option>-->'+
													'<option value="56e77f7a32d47e4d5eb5e40a">student1</option>'+
													'<option value="56e77f8b519742275e0be58c">student2</option>'+
													'<option value="56e77f9632d47e4d5eb5e40b">student3</option>'+
													'<option value="56e77fa7c59d31375e73a780">student4</option>'+
													'<option value="56e77fb0519742275e0be58d">student5</option>'+
													'<option value="56e77fbc32d47e4d5eb5e40c">student6</option>'+
													'<option value="56e77fc9c59d31375e73a781">student7</option>'+
													'<option value="56e77fd61726762c5e4c5c22">student8</option>'+
													'<option value="56e77fe11726762c5e4c5c23">student9</option>'+
													'<option value="56e77fee519742275e0be58e">student10</option>'+
													'<option value="56eb9ab81f795ed865ea5a39">student11</option>'+
													'<option value="56dfdc1b957e425c152b907a">student12</option>'+
													'<option value="56d6dd5b4f8d16142b62eb94">student13</option>'+
												'</select>'+
											 '</div>'+
											'<!--<span class="col-sm-2" align="center">课程:</span>'+
											'<div class="col-sm-3">'+
												'<select class="form-control" name="course">'+
													'<option value="">-- 不限 --</option>'+
													'<option value="9941be80-ef46-11e5-ac90-f1d200081a5f@06bc71be-c8eb-46e9-989f-3899d9456966">ople_for_sk_1</option>'+
												'</select>'+
											'</div>-->'+
									    '</div>'+
									'</li>'+
						        '</ul>',

		SortConditionHTML : '<nav class="navbar navbar-default" role="navigation">'+
								'<div>'+
								'</div>'+
							'</nav>',

		ResultTableHTML : 	'<table class="table table-hover">'+
					           '<thead>'+
									'<th style="width:10%;text-align: center">用户</th>'+
									'<th style="width:20%;text-align: center">事件</th>'+
									'<th style="width:20%;text-align: center">任务名称</th>'+
									'<th style="width:20%;text-align: center">课程名称</th>'+
									'<th style="width:10%;text-align: center">课程状态</th>'+
									'<th style="width:20%;text-align: center">时间</th>'+
					           '</thead>'+
					           '<tbody>'+
					           '</tbody>'+
					        '</table>',		      

		ResultItemHTML  :   '<td><%=username%></td>'+
							'<td><%=event%></td>'+
							'<td><%=taskName%></td>'+
							'<td><%=courseName%></td>'+
							'<td><%=courseStatus%></td>'+
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
			title : '查看任务详细操作',
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

			$(this.el).attr({data_course_id: this.model.get('courseId')});
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
			var courseId = $(optObj).attr('data_course_id');
			window.open(playerHost+'/#player/'+courseId+'/check');
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