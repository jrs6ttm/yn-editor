/**
 * @type {string}
 */
var Choice_Question_QPanel =
		'<div class="panel panel-default toAddQPanel">'+
			   '<div class="panel-heading" align="center">'+
				  '<h2 class="panel-title">编辑<%=itemType%><input type="hidden" id="questionId"></h2>'+
			   '</div>'+
			   '<div class="panel-body">'+
					'<ul class="nav nav-tabs nav-justified" style="margin-bottom:25px;">'+
						'<li class="active myTabsLi" data-tab = "tab1"><a href="javascript:void(0);">题目基本设置</a></li>'+
						'<li class="myTabsLi" data-tab = "tab2"><a href="javascript:void(0);">分数设置</a></li>'+
					'</ul>'+
					'<div class="myTabsDiv tab1">'+
						'<label for="name">编辑问题描述:</label>'+
						'<textarea  class="form-control questionDes" rows="3" placeholder="请输入问题描述"><%=itemDescription%></textarea>'+
						'<hr />'+
					   '<%if(itemType == "MULTIPLE_RESPONSE" || itemType == "MULTIPLE_CHOICE"){%>'+
						  '<div style="margin-top: 8px;">'+
							  '<label>'+
								'<input type="checkbox" name="eChoiceAllItem">选择'+
							  '</label>'+
							  '<button type="button" class="btn btn-default btn-sm deleteChoiceItem" style="float:right;">删除选项</button>'+
							  '<button type="button" class="btn btn-default btn-sm addChoiceItem" style="float:right;margin-right:5px;"> '+
									'增加选项</button>'+
						  '</div>'+
					   '<%}%>'+
					   '<table class="table mySelectionTable">'+
							'<%if(choiceCollection && choiceCollection.length > 0){%>'+
								'<%_.each(choiceCollection, function(item, index){%>'+
									'<tr>'+
										'<td>'+
											'<div class="row">'+
												'<label class="col-sm-1 control-label">' +
													'<%if(itemType == "MULTIPLE_RESPONSE" || itemType == "MULTIPLE_CHOICE"){%>'+
														'<input type="checkbox" name="selectionItem">' +
													'<%}else{%>'+
														'<span><%=(index==0)?"A":"B"%></span>'+
													'<%}%>'+
												'</label>'+
												'<div class="col-sm-9">'+
													'<%if(itemType == "YES_NO" || itemType == "TRUE_FALSE"){%>'+
														'<span class="mySelectionContents"><%=item.choiceDescription%></span>'+
													'<%}else{%>'+
														'<input type="text" class="form-control mySelectionContents"  placeholder="请输入选项" value="<%=item.choiceDescription%>"/>'+
													'<%}%>'+
												'</div>'+
												'<label  class="col-sm-2 control-label">'+
												'<%if(itemType == "MULTIPLE_RESPONSE"){%>'+
													'<input type="checkbox" name="rightAnswerItem" <%if(item.isAnswer){%>checked = "checked"<%}%>>设为答案</label>'+
												'<%}else{%>'+
													'<input type="radio" name="rightAnswerItem" <%if(item.isAnswer){%>checked = "checked"<%}%>>设为答案</label>'+
												'<%}%>'+
											'</div>'+
											'<div class="row">'+
												'<label class="col-sm-1"></label>'+
												'<div class="col-sm-9">'+
													'<span class="glyphicon glyphicon-chevron-up"></span><label style="cursor:pointer;" class="feedbackSpan">选项反馈:</label>'+
													'<textarea  style="display:none;" class="form-control feedback" rows="2" placeholder="请输入选项反馈信息"><%=item.feedback%></textarea>'+
												'</div>'+
											'</div>'+
										'</td>'+
									'</tr>'+
								'<%});%>'+
							'<%}else{%>'+
								'<tr>'+
									'<td>'+
										'<div class="row">'+
											'<label class="col-sm-1 control-label">'+
												'<%if(itemType == "MULTIPLE_RESPONSE" || itemType == "MULTIPLE_CHOICE"){%>'+
													'<input type="checkbox" name="selectionItem">' +
												'<%}else{%>'+
													'<span>A</span>'+
												'<%}%>'+
											'</label>'+
											'<div class="col-sm-9">'+
												'<%if(itemType == "MULTIPLE_RESPONSE" || itemType == "MULTIPLE_CHOICE"){%>'+
													'<input type="text" class="form-control mySelectionContents" placeholder="请输入选项" value=""/>'+
												'<%}else if(itemType == "YES_NO"){%>'+
													'<span class="mySelectionContents">YES</span>'+
												'<%}else if(itemType == "TRUE_FALSE"){%>'+
													'<span class="mySelectionContents">TRUE</span>'+
												'<%}%>'+
											'</div>'+
											'<label  class="col-sm-2 control-label">'+
											'<%if(itemType == "MULTIPLE_RESPONSE"){%>'+
												'<input type="checkbox" name="rightAnswerItem">设为答案</label>'+
											'<%}else{%>'+
												'<input type="radio" name="rightAnswerItem">设为答案</label>'+
											'<%}%>'+
										'</div>'+
										'<div class="row">'+
											'<label class="col-sm-1"></label>'+
											'<div class="col-sm-9">'+
												'<span class="glyphicon glyphicon-chevron-up"></span><label style="cursor:pointer;" class="feedbackSpan">选项反馈:</label>'+
												'<textarea  style="display:none;" class="form-control feedback" rows="2" placeholder="请输入选项反馈信息"></textarea>'+
											'</div>'+
										'</div>'+
									'</td>'+
								'</tr>'+

								'<tr>'+
									'<td>'+
										'<div class="row">'+
											'<label class="col-sm-1 control-label">'+
												'<%if(itemType == "MULTIPLE_RESPONSE" || itemType == "MULTIPLE_CHOICE"){%>'+
													'<input type="checkbox" name="selectionItem">' +
												'<%}else{%>'+
													'<span>B</span>'+
												'<%}%>'+
											'</label>'+
											'<div class="col-sm-9">'+
												'<%if(itemType == "MULTIPLE_RESPONSE" || itemType == "MULTIPLE_CHOICE"){%>'+
													'<input type="text" class="form-control mySelectionContents" placeholder="请输入选项" value=""/>'+
												'<%}else if(itemType == "YES_NO"){%>'+
													'<span class="mySelectionContents">NO</span>'+
												'<%}else if(itemType == "TRUE_FALSE"){%>'+
													'<span class="mySelectionContents">FALSE</span>'+
												'<%}%>'+
											'</div>'+
											'<label  class="col-sm-2 control-label">'+
											'<%if(itemType == "MULTIPLE_RESPONSE"){%>'+
												'<input type="checkbox" name="rightAnswerItem">设为答案</label>'+
											'<%}else{%>'+
												'<input type="radio" name="rightAnswerItem">设为答案</label>'+
											'<%}%>'+
										'</div>'+
										'<div class="row">'+
											'<label class="col-sm-1"></label>'+
											'<div class="col-sm-9">'+
												'<span class="glyphicon glyphicon-chevron-up"></span><label style="cursor:pointer;" class="feedbackSpan">选项反馈:</label>'+
												'<textarea  style="display:none;" class="form-control feedback" rows="2" placeholder="请输入选项反馈信息"></textarea>'+
											'</div>'+
										'</div>'+
									'</td>'+
								'</tr>'+
							'<%}%>'+
					   '</table>'+
					'</div>'+
					'<div class="myTabsDiv tab2" style="display:none;margin-bottom:25px;">'+
						'<div class="row" style="margin-bottom:10px;">'+
							'<label  class="col-sm-3" align="center">正确得分：</label>'+
							'<div class="col-sm-3" style="margin-left:-5%;">'+
								'<input type="number"  class="form-control" id="tab2_score" placeholder="请输入分数" value="5"/>'+
							'</div>'+
							'<label  class="col-sm-3" align="center">错误扣分：</label>'+
							'<div class="col-sm-3" style="margin-left:-5%;">'+
								'<input type="number"  class="form-control" id="tab2_deduct" placeholder="请输入分数" value="0"/>'+
							'</div>'+
						'</div>'+
						'<div class="row">'+
							'<label  class="col-sm-3" align="center">题目权重：</label>'+
							'<div class="col-sm-3" style="margin-left:-5%;">'+
								'<input type="number"  class="form-control" id="tab2_weight" placeholder="请输入得分权重" value="0.1"/>'+
							'</div>'+
							'<label  class="col-sm-3" align="center">难度系数：</label>'+
							'<div class="col-sm-3" style="margin-left:-5%;">'+
								'<input type="number"  class="form-control" id="tab2_difficulty_degree" placeholder="请输入难度系数" value="0.1"/>'+
							'</div>'+
						'</div>'+
					'</div>'+
		       '</div>'+
			   '<div class="panel-footer" align="right">'+
					'<button type="button" class="btn btn-default btn-sm saveExamItem" style="margin-right: 5%;">确 定</button>'+
					'<button type="button" class="btn btn-default btn-sm cancel_addExamItem" style="margin-right: 5%;">取 消</button>'+
			   '</div>'+
			'</div>';

	var ChoiceQuestionPanelView = Backbone.View.extend({
		attributes : {

		},

		events: {
			'click .myTabsLi': 'switchTab',
			'click .feedbackSpan': 'feedbackOpt',
			'click input[name="eChoiceAllItem"]': 'isCheckAll',
			'click .addChoiceItem' : 'addChoiceItem',
			'click .deleteChoiceItem' : 'deleteChoiceItem',
			'click .saveExamItem' : 'saveExamItem',
			'click .cancel_addExamItem' : 'cancel_addExamItem'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'isCheckAll', 'addChoiceItem', 'saveExamItem', 'cancel_addExamItem',
			'getExamItem', 'addItem', 'deleteItem');
			this.template = _.template(Choice_Question_QPanel);
		},

		render : function(){
			$(this.el).append(this.template(this.model.toJSON()));

			return this;
		},

		switchTab: function(event){
			var obj = event.currentTarget;
			this.switchTabOpt($(obj).attr('data-tab'));
		},

		switchTabOpt: function(data_tab){
			$('.myTabsLi', this.el).removeClass('active');
			$('.myTabsDiv', this.el).css('display', 'none');

			$('[data-tab="'+data_tab+'"]', this.el).addClass('active');
			$('.'+data_tab, this.el).css('display', 'block');
		},

		feedbackOpt: function(event){
			var obj = event.currentTarget;
			var currFeedbackArea = $(obj).parent().find('textarea').eq(0), arrowSpan = $(obj).parent().find('span').eq(0);
			var status = $(currFeedbackArea).css('display');
			if(status == 'block'){
				status = 'none';
				$(arrowSpan).removeClass('glyphicon-chevron-down');
				$(arrowSpan).addClass('glyphicon-chevron-up');
			}else{
				status = 'block';
				$(arrowSpan).removeClass('glyphicon-chevron-up');
				$(arrowSpan).addClass('glyphicon-chevron-down');
			}
			$(currFeedbackArea).css('display', status);
		},

		isCheckAll : function(event){
			var obj = event.currentTarget;
			var status = $(obj)[0].checked;
			var selectedItem = $('input[name="selectionItem"]', this.el);

			if(status){
				$.each(selectedItem, function(index, element){
					$(element)[0].checked = true;
				});
			}else{
				$.each(selectedItem, function(index, element){
					$(element)[0].checked = false;
				});
			}
		},

		addChoiceItem : function(){
			this.addItem();
		},

		deleteChoiceItem : function(){
			this.deleteItem(null);
		},

		saveExamItem : function(){
			var item = this.getExamItem();
			if(item) {
				item.itemType =  this.model.get('itemType');
				var pageId = this.model.get('pageId');
				if(pageId && pageId.trim() != '')//update item.不能用new item的方法取pageId, 因为这两种情况下Panel加载的位置不一样
					item.pageId = pageId;
				else
					item.pageId = $(this.el).parent().find('.sortable').eq(0).attr('data-page-id');//new item


				var me = this;
				var hasItemId = this.model.get('itemId');
				if(hasItemId && hasItemId.trim() != ''){//update
					item.itemId = hasItemId;
					item.itemPosition = this.model.get('itemPosition');
					$.post("/exam/updateExamItem", {item: JSON.stringify(item)},
							function (result) {
								if (result && result.success) {
									var examItemModel = new ExamItemModel(item);
									//var examItemView = new ChoiceQuestionItemView({model: examItemModel});
									var examItemView = new ExamItemView({model: examItemModel});

									var render = examItemView.render();
									if(render != null) {
										$('div[data-examItem-id="' + me.model.get('itemId') + '"]').parent().remove();//先删除旧的item,再重新添加新的item
										$(me.el).before(render.el);

										$(me.el).remove();
										$('.sortable-' + pageId).sortable('enable');//启用本页拖拽功能
									}
								}
							}
					);
				}else {//new
					item.itemPosition = ($('.examItem-'+item.pageId)).length + 1;
					$.post("/exam/saveExamItem", {item: JSON.stringify(item)},
							function (result) {
								if (result && result.success) {
									var examItemModel = new ExamItemModel(item);
									//var examItemView = new ChoiceQuestionItemView({model: examItemModel});
									var examItemView = new ExamItemView({model: examItemModel});

									var render = examItemView.render();
									if(render != null) {
										$('div[data-page-id="' + item.pageId + '"]').append(render.el);
										me.model.set({itemPosition: item.itemPosition + 1});
										//$(me.el).children().remove();
										me.el.innerHTML = '';
										me.render();
										$('.sortable-' + pageId).sortable('enable');//启用本页拖拽功能
									}
								}
							}
					);
				}

			}

		},

		cancel_addExamItem : function(){
			var itemId = this.model.get('itemId');
			var pageId = this.model.get('pageId');
			if(itemId) {//取消编辑已有item
				$('div[data-examItem-id="' + itemId + '"]').css('display', 'block');
			}else{//取消新编辑item
				$(".droppable-"+pageId).css('display', 'block');
			}

			$(this.el).remove();
			$('.sortable-'+pageId).sortable('enable');//启用本页拖拽功能
		},

		getExamItem : function(){
			var item = {
				itemId :  getDateStrUUID(),
				itemName: "question",
				itemType: "MULTIPLE_RESPONSE",
				itemDescription: "",
				itemPosition: 1,
				weight:0,
				difficultyDegree:0,
				rightAnswer:[],
				choiceCollection:[]
			};

			var score = $('#tab2_score', this.el).val();
			if(!score || Number(score) <0 || Number(score) >100){
				alert('正确得分请输入0~100的数字！');
				this.switchTabOpt('tab2');
				$('#tab2_score', this.el).focus();
				return false;
			}

			var deduct = $('#tab2_deduct', this.el).val();
			if(!deduct || Number(score) <0 || Number(score) >100){
				alert('错误扣分请输入0~100的数字！');
				this.switchTabOpt('tab2');
				$('#tab2_deduct', this.el).focus();
				return false;
			}

			var weight = $('#tab2_weight', this.el).val();
			if(!weight || Number(weight) <0 || Number(weight) >1){
				alert('得分权重请输入0~1的数字！');
				this.switchTabOpt('tab2');
				$('#tab2_weight', this.el).focus();
				return false;
			}
			item.weight = Number(weight);

			var difficulty_degree = $('#tab2_difficulty_degree', this.el).val();
			if(!difficulty_degree || Number(difficulty_degree) <0 || Number(difficulty_degree) >1){
				alert('难度系数请输入0~1的数字！');
				this.switchTabOpt('tab2');
				$('#tab2_difficulty_degree', this.el).focus();
				return false;
			}
			item.difficultyDegree = Number(difficulty_degree);

			var tArea = $(".questionDes", this.el).val();
			if(!tArea || tArea.trim() == ""){
				//alert("请输入问题描述!");
				this.switchTabOpt('tab1');
				$(".questionDes", this.el).focus();
				return false;
			}

			item.itemDescription = tArea;

			var choiceLength = $(".mySelectionContents", this.el).length;
			if(choiceLength == 0){
				alert('请添加选项！')
				return false;
			}

			item.choiceCollection = [];
			var alt = ['A','B','C','D','F','G','H','I','J','K'];
			var itemType = this.model.get('itemType'), currElementValue='', me=this;
			$(".mySelectionContents", this.el).each(function(index, element){
				var choice = {choiceId:index + 1, choiceCode:alt[index], choiceDescription:'', feedback:'', isAnswer: false};

				if(itemType == "MULTIPLE_RESPONSE" || itemType == "MULTIPLE_CHOICE")
					currElementValue = $(element, me.el).val();
				else
					currElementValue = $(element, me.el).text();

				if(!currElementValue || currElementValue.trim() == ""){
					//alert("您有未输入的选项描述!");
					item.choiceCollection = [];
					me.switchTabOpt('tab1');
					$(element, me.el).focus();
					return false;  //return false;跳出所有循环；相当于 javascript 中的 break 效果。return true;跳出当前循环，进入下一个循环；相当于 javascript 中的 continue 效果
				}
				choice.choiceDescription = currElementValue;

				var currFeedback = $('.feedback', me.el)[index];
				var feedback = $(currFeedback).val();
				choice.feedback = feedback;

				item.choiceCollection.push(choice);
			});

			if(!item.choiceCollection.length){
				return false;
			}

			var rightItem = {choiceItemId:1, rightChoiceIds:[], score: Number(score), deduct: Number(deduct)};
			$('input[name="rightAnswerItem"]', this.el).each(function(index){
				if($(this)[0].checked){
					rightItem.rightChoiceIds.push(index + 1);
					item.choiceCollection[index].isAnswer = true;
				}
			});

			if(!rightItem.rightChoiceIds.length){
				alert("请勾选正确的选项!");
				this.switchTabOpt('tab1');
				return false;
			}

			item.rightAnswer.push(rightItem);

			console.log(item);

			return item;
		},

		addItem : function(){

			/*
			var rightType = $('input[name="rightType"]:checked', this.el).val();
			if(rightType == '0')//全部选中
				$('#rightTypeSpan').css('display','inline');
			else
				$('#rightTypeSpan').css('display','none');*/
			var choiceLength = $('.mySelectionContents', this.el).length;
			if(choiceLength >= 20){
				alert('最多只能添加20条选项！');
				return false;
			}

			//var questionType = $('input[name="questionType"]:checked');
			var questionType = this.model.get('itemType');
			var html = '';

			if(questionType == 'MULTIPLE_RESPONSE'){//多选题
				html = '<tr>'+
							'<td>'+
								'<div class="row">'+
									'<label class="col-sm-1 control-label"><input type="checkbox" name="selectionItem"></label>'+
									'<div class="col-sm-9">'+
										'<input type="text" class="form-control mySelectionContents"  placeholder="请输入选项" />'+
									'</div>'+
									'<label  class="col-sm-2 control-label"><input type="checkbox" name="rightAnswerItem">设为答案</label>'+
								'</div>'+
								'<div class="row">'+
									'<label class="col-sm-1"></label>'+
									'<div class="col-sm-9">'+
										'<span class="glyphicon glyphicon-chevron-up"></span><label style="cursor:pointer;" class="feedbackSpan">选项反馈:</label>'+
										'<textarea  style="display:none;" class="form-control feedback" rows="2" placeholder="请输入选项反馈信息"></textarea>'+
									'</div>'+
								'</div>'+
							'</td>'+
						'</tr>';
			}else{
				html = '<tr>'+
							'<td>'+
								'<div class="row">'+
									'<label class="col-sm-1 control-label"><input type="checkbox" name="selectionItem"></label>'+
									'<div class="col-sm-9">'+
										'<input type="text" class="form-control mySelectionContents" placeholder="请输入选项" />'+
									'</div>'+
									'<label  class="col-sm-2 control-label"><input type="radio" name="rightAnswerItem">设为答案</label>'+
								'</div>'+
								'<div class="row">'+
									'<label class="col-sm-1"></label>'+
									'<div class="col-sm-9">'+
										'<span class="glyphicon glyphicon-chevron-up"></span><label style="cursor:pointer;" class="feedbackSpan">选项反馈:</label>'+
										'<textarea  style="display:none;" class="form-control feedback" rows="2" placeholder="请输入选项反馈信息"></textarea>'+
									'</div>'+
								'</div>'+
							'</td>'+
						'</tr>';
			}


			$(".mySelectionTable", this.el).append(html);

		},

		deleteItem: function(type){

			var selectedItem;
			if(type && type == 'clear'){
				selectedItem = $('input[name="selectionItem"]', this.el);
			}else{
				selectedItem = $('input[name="selectionItem"]:checked', this.el);
				if(!selectedItem.length){
					alert("请选择要删除的选项!");
				}
			}
			$.each(selectedItem, function(index, element){
				var aaa = $(element).parent().parent().parent().parent();
				$(aaa).remove();
			});
			if($('input[name="selectionItem"]:checked', this.el).length == 0)
				$('input[name="eChoiceAllItem"]')[0].checked = false;

		}

	});






