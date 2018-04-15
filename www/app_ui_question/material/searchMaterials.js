(function($){
	var TemplateView = {
		SearchInputHTML : '<form class="bs-example bs-example-form" role="form">'+
			            '<div class="row">'+
			               '<div class="col-md-1">'+
			/*
		  					 '<a href="http://player.xuezuowang.com/#/website-pages/home" title="首页">'+
							  	'<img src="images/logo.png" width="50px;" alt="易能教育"/>'+
			 				  '</a>'+
			 				  */
						'</div>'+
						'<div class="col-md-10">'+
							'<div class="input-group">'+
			                     '<input type="text" class="form-control" placeholder="搜一下~" name="keyWords" value="<%=fileName%>">'+
			                     '<span class="input-group-btn">'+
			                        '<button class="btn btn-success animate" type="button" id="submitSearchBut">SEARCH</button>'+
			                     '</span>'+
			                  '</div>'+
			               '</div>'+
			            '</div>'+
						'<div class="col-md-1"></div>'+
			         '</form>',

	    SearchConditionHTML : '<ul class="list-group">'+
						           '<li class="list-group-item">'+
						              '<div class="row">'+
						                 '<span class="col-md-2" align="center">适用用户:</span>'+
						                 '<div class="col-md-10">'+
						                    '<span class="col-md-2 btn-primary toUser"  value="0" align="center">不限</span>'+
						                    '<span class="col-md-2 toUser"  value="1" align="center">新手</span>'+
						                    '<span class="col-md-2 toUser"  value="2" align="center">生手</span>'+
						                    '<span class="col-md-2 toUser"  value="3" align="center">熟手</span>'+
						                    '<span class="col-md-2 toUser"  value="4" align="center">高手</span>'+
						                    '<span class="col-md-2 toUser"  value="5" align="center">能手</span>'+
						                 '</div>'+
						               '</div>'+
						           '</li>'+
									'<li class="list-group-item">'+
										'<div class="row">'+
											'<span class="col-sm-2" align="center">资源语言:</span>'+
											'<div class="col-sm-3">'+
												'<select class="form-control" name="language">'+
													'<option value="">-- 不限 --</option>'+
													'<option value="zh">中文</option>'+
													'<option value="en">英文</option>'+
												'</select>'+
											'</div>'+
											'<span class="col-sm-2" align="center">难  度:</span>'+
											'<div class="col-sm-3">'+
												'<select class="form-control" name="difficulty">'+
													'<option value="">-- 不限 --</option>'+
													'<option value="very-easy">非常容易</option>'+
													'<option value="easy">容易</option>'+
													'<option value="medium">适中</option>'+
													'<option value="difficult">困难</option>'+
													'<option value="very-difficult">非常困难</option>'+
												'</select>'+
											'</div>'+
										'</div>'+
									'</li>'+
									'<li class="list-group-item">'+
										'<div class="row">'+
											'<span class="col-sm-2" align="center">资源类型:</span>'+
											'<div class="col-sm-3">'+
												'<select class="form-control" name="learningResourceType">'+
													'<option value="">-- 不限 --</option>'+
													'<option value="exercise">练习</option>'+
													'<option value="simulation">模拟</option>'+
													'<option value="questionnaire">问卷</option>'+
													'<option value="diagram">示意图</option>'+
													'<option value="graph">图表</option>'+
													'<option value="index">索引</option>'+
													'<option value="slide">幻灯片</option>'+
													'<option value="table">表格</option>'+
													'<option value="narrative-text">文本/档</option>'+
													'<option value="exam">考试</option>'+
													'<option value="experiment">实验</option>'+
													'<option value="problemStatement">问题陈述</option>'+
													'<option value="selfAssessment">自我评估</option>'+
												'</select>'+
											'</div>'+
											'<span class="col-sm-2" align="center">资源结构:</span>'+
											'<div class="col-sm-3">'+
												'<select class="form-control" name="structure">'+
													'<option value="">-- 不限 --</option>'+
													'<option value="atomic">原子</option>'+
													'<option value="collection">集合</option>'+
													'<option value="mixed">混合</option>'+
													'<option value="linear">线性</option>'+
													'<option value="hierarchical">层级</option>'+
													'<option value="networked">网状</option>'+
													'<option value="branched">分支</option>'+
													'<option value="parceled">打包</option>'+
												'</select>'+
											'</div>'+
										'</div>'+
									'</li>'+
									'<li class="list-group-item">'+
										'<div class="row">'+
											'<span class="col-sm-2" align="center">适用年龄:</span>'+
											'<div class="col-sm-3" style="margin-left:-5px;">'+
												'<select class="form-control" name="typicalAgeRange">'+
													'<option value="">-- 不限 --</option>'+
													'<option value="baby">婴幼儿</option>'+
													'<option value="child">儿童</option>'+
													'<option value="teenager">青少年</option>'+
													'<option value="middle-age">中年</option>'+
													'<option value="old-age">老年</option>'+
												'</select>'+
											'</div>'+
										'</div>'+
									'</li>'+
						        '</ul>',

		SortConditionHTML : '<nav class="navbar navbar-default" role="navigation" title="排序">'+
					           '<div>'+
					              '<ul class="nav navbar-nav">'+
					                 '<li class="sortItem   active"  value="createTime"><a href="#">按时间</a></li>'+
					                 '<li class="sortItem"  value="readTimes"><a href="#">按阅读量</a></li>'+
		   							 '<li class="sortItem"  value="downloadTimes"><a href="#">按下载量</a></li>'+
					                 '<li class="sortItem"  value="praiseTimes"><a href="#">按点赞数</a></li>'+
					              '</ul>'+

					           '</div>'+
					        '</nav>',				      

		ResultTableHTML : 	'<table class="table table-striped">'+
					           '<thead>'+
					              '<th class="col-md-6">资源标题</th>'+
					              '<th class="col-md-2">下载属性</th>'+
					           '</thead>'+
					           '<tbody>'+
					           '</tbody>'+
					        '</table>',		      

		ResultItemHTML  :   '<td>'+
						        '<p class="showFile" data-fileType="<%=fileType%>" data-sourcePath="<%=sourceF%>" data-transformPath="<%=transformF%>" data-materialId="<%=materialsId%>">'+
									'<button type="button" class="btn btn-link" style="margin-left:-12px;"><strong><font size="4"><%=fileName%></font></strong></button></p>'+
						        '<p>简介：<%=description%></p>'+
						        '<p><small>分类：web开发-Javascript 技术文档 其它 互联网/IT</small></p>'+
						        '<p><small>上传者：<%=publisher%> &nbsp;-&nbsp;  时间：<%=new Date(createTime).toLocaleDateString()%>  &nbsp;-&nbsp; '+
							        '适用用户：<% if(toUser == "0"){%>不限<%}else if(toUser == "1"){%>新手<%}else if(toUser == "2"){%>生手<%}else if(toUser == "3"){%>熟手'+
							        '<%}else if(toUser == "4"){%>高手<%}else if(toUser == "5"){%>能手<%}%>'+
			/*
		                            '/  排序：<%if(sortType == "all"){%>综合排序<%}else if(sortType == "createTime"){%>时间'+
							        '<%}else if(sortType == "readCounts"){%>阅读量<%}else if(sortType == "praiseCounts"){%>点赞数<%}%></small>'+
			*/
							     '</p>'+
						     '</td>'+
						     '<td>'+
						        '<p style="margin-top: 6px;"><span class="showFile" data-fileName="<%=fileName%>" data-sourcePath="<%=sourceF%>" data-transformPath="<%=transformF%>">'+
									'<button type="button" class="btn btn-link" style="margin-left:-12px;">预览</button> </span>'+
									'<!--- <span class="downloadFile" data-sourceF="<%=sourceF%>" data-fileType="<%=fileType%>" data-fileName="<%=fileName%>"> '+
										'<button type="button" class="btn btn-link" style="margin-left:-12px;"> 下载</button> </span>-->'+
						            '<!--- <span class="deleteFile" data-materialId="<%=materialsId%>"> '+
										'<button type="button" class="btn btn-link" style="margin-left:-12px;">删除</button></span>--></p>'+
						        '<p>下载量: <%=downloadTimes%></p>'+
						        '<p>阅读量: <%=readTimes%></p>'+
						        '<p>点赞数: <%=praiseTimes%></p>'+
						     '</td>',

		PreShowFileHTML : '<div class="modal fade" id="myModal" tabindex="-1" role="dialog"aria-labelledby="myModalLabel" aria-hidden="true">'+
							'<div class="modal-dialog">'+
								'<div class="modal-content">'+
									'<div class="modal-header">'+
										'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
										'<h4 class="modal-title" id="myModalLabel"><%=fileName%></h4>'+
									'</div>'+
									'<div class="modal-body">'+
										'<iframe src="http://www.xuezuowang.com:8088/OfficeTransfer/<%=transformF?transformF:sourceF%>" width="100%" height="600px;"></iframe>'+
									'</div>'+
									'<div class="modal-footer">'+
										'<button type="button" class="btn btn-info" data-dismiss="modal">关闭</button>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
	};

	//查询条件model
	//var Query = new QueryModel();

	//数据集合
	//var materialList = new MaterialList();

	//搜索框
	var SearchInputView = Backbone.View.extend({
		className: 'searchInput',
		attributes: {
			style: 'margin-bottom: 10px'
		},

		events : {
			'click  #submitSearchBut' : 'submitSearch'
		},

		initialize : function(){
			_.bindAll(this, 'render');

			this.render();
		},

		render: function(){
			this.template = _.template(TemplateView.SearchInputHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);
			$('.container', 'body').append(this.el);
		},

		submitSearch : function(){
			var keyWords = $('input[name="keyWords"]').val();
			Query.set({fileName : keyWords});
		}
	});

	//搜索条件
	var SearchConditionView = Backbone.View.extend({
		className : 'searchCondition',

		events : {
			'click .toUser' : 'selectToUser',
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

		selectToUser : function(event){
			var Obj = event.currentTarget;
			$('.toUser').removeClass('btn-primary');
          	$(Obj).addClass('btn-primary');
			$(Obj).addClass('animate');

          	Query.set({toUser : $(Obj).attr('value')});
		},

		changeCondition: function(event){
			var currObj = event.currentTarget;
			var cName = $(currObj).attr('name')
				,cValue = $(currObj).val();
			switch (cName) {
				case 'language':
					Query.set({language: cValue});
					break;
				case 'difficulty':
					Query.set({difficulty: cValue});
					break;
				case 'learningResourceType':
					Query.set({learningResourceType: cValue});
					break;
				case 'structure':
					Query.set({structure: cValue});
					break;
				case 'typicalAgeRange':
					Query.set({typicalAgeRange: cValue});
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
			'click .sortItem' : 'selectSortCondition',
			'click .myPage' : 'devidePage'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'selectSortCondition');
			this.render();
		},

		render: function(){
			this.template = _.template(TemplateView.SortConditionHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);
			$('.container', 'body').append(this.el);
		},

		selectSortCondition : function(event){
			var Obj = event.currentTarget;
			$('.sortItem').removeClass('active');
        	$(Obj).addClass('active');

        	Query.set({sortType : $(Obj).attr('value')});
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

	//资料播放
	var  DocPlayerView = Backbone.View.extend({
		tagName : 'div',
		className : 'docPlayerDiv',
		initialize : function(){
			_.bindAll(this, 'render');
		},

		render : function(){
			this.template = _.template(TemplateView.PreShowFileHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);
			return this;
		}
	});

	//结果item
	var ResultItemView = Backbone.View.extend({
		tagName : 'tr',
		events: {
			'click .showFile' : 'showFile',
			'click .downloadFile' : 'downloadFile',
			'click .deleteFile' : 'deleteFile'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'changeTimes', 'downloadFile', 'deleteFile');
			this.listenTo(this.model, 'change', this.changeTimes);
			this.render();
		},

		render : function(){
			this.template = _.template(TemplateView.ResultItemHTML);
			$(this.el).append(
				this.template(this.model.toJSON())
			);
		},

		showFile : function(event){
			var Obj = event.currentTarget;
			var fileName  = $(Obj).attr('data-transformPath');
			if(!fileName || fileName.trim() == ''){
				fileName = $(Obj).attr('data-sourcePath');
				if(!fileName || fileName.trim() == ''){
					alert('该资料文件不存在，或者已被删除!');
					return false;
				}
			}

			var id = $(Obj).attr('data-materialId');
			if(id && id.trim() != ''){//打开模式
				//window.open('/readMaterial?materialsId='+id);
				window.location.href='/readMaterial?materialsId='+id;
			}else{//预览模式
				$('.docPlayerDiv', 'body').remove();
				this.docPlayerView = new DocPlayerView({model: this.model});
				$('body').append(this.docPlayerView.render().el);
				$('#myModal').modal({keyboard: true});
				$('#myModal').modal('show');
			}

			this.model.set({readTimes : Number(this.model.get('readTimes'))+1});
		},

		downloadFile : function(event){
			var Obj = event.currentTarget;
			var params = '?';
			params = params + 'sourceF=' + $(Obj).attr('data-sourceF')+ '&fileType=' + $(Obj).attr('data-fileType')+ '&fileName=' + $(Obj).attr('data-fileName');
			window.location.href='/LR/downloadMaterial'+params;
			this.model.set({downloadTimes : Number(this.model.get('downloadTimes'))+1});
		},

		deleteFile : function(event){
			if(this.model.get('courses').length > 0){
				alert('该资料正在课程中使用，不能删除！');
				return false;
			}
			var me = this;

			var Obj = event.currentTarget;
			var materialId = $(Obj).attr('data-materialId');
			$.get('/remove/deleteLR', {materialsId : materialId} , function(data){
				if(data && data.success){
					materialList.remove(me.model);
					$(me.el).remove();
				}
			});
		},

		changeTimes : function(){
			var changedObj = this.model.changed;
			console.log(changedObj);
			if(changedObj.readTimes)
				$(this.el).find('td').eq(1).find('p').eq(2).text('阅读量: '+changedObj.readTimes);
			if(changedObj.downloadTimes)
				$(this.el).find('td').eq(1).find('p').eq(1).text('下载量: '+changedObj.downloadTimes);

			this.model.updateTimes();
		}
	});

	//结果集，用来组织结果item
	var ResultListView = Backbone.View.extend({
		className : 'lrList',

		initialize : function(){
			_.bindAll(this, 'render', 'addItem',  'removeSelf', 'waitData');
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
			this.el.innerHTML = '<div style="margin-top:15%;margin-left:45%;"><img src = "images/wait.jpg"  alt="请稍等..."/></div>';
		}
	});

	//主视图，组织各个子视图
	var APPView = Backbone.View.extend({
		className : 'container',
		attributes : {
			style : "padding: 50px 50px 10px"
		},

		initialize : function(){
			_.bindAll(this, 'render', 'writeItem', 'getDevidedList', 'findByQuery', 'reLoad');
			this.listenTo(materialList, 'reset', this.writeItem);
			this.listenTo(materialList, 'sort', this.writeItem);
			this.listenTo(materialList, 'remove', this.reLoad);
			this.listenTo(Query, 'change', this.findByQuery);
			this.render();
		},

		render : function(){
			$('body').append(this.el);
			this.searchInputView = new SearchInputView({model: Query});
			this.searchConditionView = new SearchConditionView();
			this.sortConditionView = new SortConditionView({model: Query});
			this.pageMaterialsList = new MaterialList();//分页collection
			
			this.getDevidedList();
		},

		writeItem : function(){
			if(this.resultListView)
				this.resultListView.removeSelf();
			if(this.sortPageView) {
				this.sortPageView.removeSelf();
				var temp = $('.nav', this.sortConditionView.el);
				if(temp.length > 1)
					temp.last().remove();
			}
			if(this.bottomPageView)
				this.bottomPageView.removeSelf();

			this.getDevidedList();
		},

		findByQuery : function(){
			this.resultListView.waitData();//等待提示
			var devideType = Query.changed.currentPage;
			if(devideType){//是分页动作
				materialList.sort();
				//this.writeItem();
			}else{//排序或查询动作
				var changed = Query.changed.sortType;
				//处理page
				if(changed) {
					var endPage = Query.get('totalPage');
					Query.set({currentPage : 1, startPage: 1, endPage: endPage > 10?10:endPage}, {silent: true});
					materialList.sort();
				}else {
					materialList.postForm();
				}
			}

		},

		getDevidedList : function(){
			//处理分页list
			var totalLength = materialList.length;
			if(totalLength > 0) {
				var start = (Query.get('currentPage') - 1) * Query.get('recordsSize');
				var end = start + Query.get('recordsSize');
				if(end > totalLength)
					end = totalLength;
				this.pageMaterialsList.reset(materialList.slice(start, end));

				if (this.pageMaterialsList.length > 0) {
					this.resultListView = new ResultListView({collection: this.pageMaterialsList});
					this.bottomPageView = new PageView({model: Query});
					this.sortPageView = new PageView({model: Query});
					$('nav div', this.sortConditionView.el).append(this.sortPageView.render(PageTemplateView.PageHTML1).el.innerHTML);
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