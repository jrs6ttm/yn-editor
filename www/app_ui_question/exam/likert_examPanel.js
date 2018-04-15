/**
 * @type {string}
 */
var Likert_QPanel =
		'<div class="panel panel-default toAddQPanel">'+
			   '<div class="panel-heading" align="center">'+
				  '<h2 class="panel-title">编辑<%=itemType%><input type="hidden" id="questionId"></h2>'+
			   '</div>'+
			   '<div class="panel-body">'+
				  	'<label for="name">编辑问题描述:</label>'+
					'<%if(itemDescription){%>'+
						'<textarea  class="form-control questionDes" rows="3" placeholder="请输入问题基本描述"><%=itemDescription%></textarea>'+
					'<%}else{%>'+
						'<textarea  class="form-control questionDes" rows="3" placeholder="请输入问题基本描述">阅读下面的问题，请从逐步增大的数字级别中选出符合你的指标(最小数字代表特别不喜欢，最大数字代表特别喜欢)。</textarea>'+
					'<%}%>'+
					'<div class="row" style="margin-top:10px;;">'+
						'<span class="col-md-3" align="right">级别:</span>'+
						'<div class="col-md-3">'+
							'<select class="form-control likert_level">'+
								'<%for(var i=3;i<11;i++){%>'+
									'<option value="<%=i%>" <%if(likertLevel && likertLevel == i){%>selected="selected"<%}%> ><%=i%></option>'+
								'<%}%>'+
							'</select>'+
						'</div>'+
						'<div class="col-md-2" align="left">'+
							'<span>级</span>'+
						'</div>'+
					'</div>'+
					'<div class="row" style="margin-top:10px;;">'+
						'<span class="col-md-3" align="right">关键词:</span>'+
						'<div class="col-md-9">'+
							'<%if(itemDescription){%>'+
								'<span class="col-md-2 likert_keyword"  value="喜欢" align="center" style="cursor:pointer"><strong>喜 欢</strong></span>'+
							'<%}else{%>'+
								'<span class="col-md-2 btn-primary likert_keyword"  value="喜欢" align="center" style="cursor:pointer"><strong>喜 欢</strong></span>'+
							'<%}%>'+
							'<span class="col-md-2 likert_keyword"  value="赞成" align="center" style="cursor:pointer"><strong>赞 成</strong></span>'+
							'<span class="col-md-2 likert_keyword"  value="同意" align="center" style="cursor:pointer"><strong>同 意</strong></span>'+
							'<span class="col-md-2 likert_keyword"  value="满意" align="center" style="cursor:pointer"><strong>满 意</strong></span>'+
						'</div>'+
					'</div>'+
					'<div class="row" style="margin-top:10px;;">'+
						'<span class="col-md-3 myLikertKeywordSpan" style="cursor:pointer" align="right">自定义关键词?</span>'+
						'<div class="col-md-7" style="display:none;">'+
							'<input type="text" class="form-control" name="myLikertKeywordInput" />'+
						'</div>'+
						'<div class="col-md-2" style="display:none;">'+
							'<button type="button" class="btn btn-info btn-sm myLikertKeywordBtn">使 用</button>'+
						'</div>'+
					'</div>'+
				    '<hr />'+
				    '<div style="margin-top: 8px;">'+
					    '<label>'+
						  '<input type="checkbox" name="eChoiceAllItem">选择'+
					    '</label>'+
						'<button type="button" class="btn btn-default btn-sm deleteChoiceItem" style="float:right;">删除问题</button>'+
					    '<button type="button" class="btn btn-default btn-sm addChoiceItem" style="float:right;margin-right:5px;">增加问题</button>'+
				    '</div>'+

			   '</div>'+
			   '<table class="table mySelectionTable">'+
				'<%if(choiceCollection && choiceCollection.length > 0){%>'+
					'<%_.each(choiceCollection, function(item){%>'+
						'<tr>'+
							'<td>'+
								'<div class="form-group">'+
									'<label class="col-sm-1 control-label">' +
										'<input type="checkbox" name="selectionItem">' +
									'</label>'+
									'<div class="col-sm-9">'+
										'<input type="text" class="form-control mySelectionContents"  placeholder="请输入选项" value="<%=item.choiceDescription%>"/>'+
									'</div>'+
								'</div>'+
							'</td>'+
						'</tr>'+
					'<%});%>'+
				'<%}else{%>'+
					'<tr>'+
						'<td>'+
							'<div class="form-group">'+
								'<label class="col-sm-1 control-label"></label>'+
								'<div class="col-sm-9">'+
									'<input type="text" class="form-control mySelectionContents" placeholder="请输入问题" value="你喜欢睡懒觉吗？"/>'+
								'</div>'+
							'</div>'+
						'</td>'+
					'</tr>'+
				'<%}%>'+
			   '</table>'+
			   '<div class="panel-footer" align="right">'+
					'<button type="button" class="btn btn-default btn-sm saveExamItem" style="margin-right: 5%;">确 定</button>'+
					'<button type="button" class="btn btn-default btn-sm cancel_addExamItem" style="margin-right: 5%;">取 消</button>'+
			   '</div>'+
			'</div>';

	var LikertPanelView = Backbone.View.extend({

		events: {
			'click input[name="eChoiceAllItem"]': 'isCheckAll',
			'click .likert_keyword': 'selectKeyWord',
			'click .myLikertKeywordSpan': 'myLikertKeywordSpan',
			'click .myLikertKeywordBtn': 'myLikertKeywordBtn',
			'click .addChoiceItem' : 'addChoiceItem',
			'click .deleteChoiceItem' : 'deleteChoiceItem',
			'click .saveExamItem' : 'saveExamItem',
			'click .cancel_addExamItem' : 'cancel_addExamItem'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'isCheckAll', 'addChoiceItem', 'saveExamItem', 'cancel_addExamItem',
			'getExamItem', 'addItem', 'deleteItem');
			this.template = _.template(Likert_QPanel);
		},

		render : function(){
			$(this.el).append(this.template(this.model.toJSON()));

			return this;
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

		selectKeyWord : function(event){
			var Obj = event.currentTarget;
			$('.likert_keyword').removeClass('btn-primary');
			$(Obj).addClass('btn-primary');
			$('.myLikertKeywordBtn').parent().css('display', 'none');
			$('input[name="myLikertKeywordInput"]').parent().css('display', 'none');

			var likertValue = $(Obj).attr('value');
			var qContent = '阅读下面的问题，请从逐步增大的数字级别中选出符合你的指标(最小数字代表特别不'+likertValue+'，最大数字代表特别'+likertValue+')。';
			$('.questionDes', this.el).val(qContent);
		},

		myLikertKeywordSpan : function(){
			var isShow = $('.myLikertKeywordBtn').parent().css('display');
			if(isShow == 'block'){
				$('.myLikertKeywordBtn').parent().css('display', 'none');
				$('input[name="myLikertKeywordInput"]').parent().css('display', 'none');
			}else{
				$('.myLikertKeywordBtn').parent().css('display', 'block');
				$('input[name="myLikertKeywordInput"]').parent().css('display', 'block');
			}
		},

		myLikertKeywordBtn : function(){
			var myLikertKeyWord = $('input[name="myLikertKeywordInput"]').val();
			if(!myLikertKeyWord || myLikertKeyWord.trim() == ''){
				$('input[name="myLikertKeywordInput"]').focus();
			}else{
				$('.likert_keyword').removeClass('btn-primary');
				var qContent = '阅读下面的问题，请从逐步增大的数字级别中选出符合你的指标(最小数字代表特别不'+myLikertKeyWord.trim()+'，最大数字代表特别'+myLikertKeyWord.trim()+')。';
				$('.questionDes', this.el).val(qContent);
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
				itemType: "LIKERT",
				itemDescription: "",
				likertLevel: 3,
				itemPosition: 1,
				weight:0,
				difficultyDegree:0,
				rightAnswer:[],
				choiceCollection:[]
			};

			var tArea = $(".questionDes", this.el).val();
			if(!tArea || tArea.trim() == ""){
				$(".questionDes", this.el).focus();
				return false;
			}

			item.itemDescription = tArea;

			item.choiceCollection = [];
			var itemType = this.model.get('itemType'), currElementValue='';
			$(".mySelectionContents", this.el).each(function(index, element){
				var choice = {};
				choice.choiceId = index + 1;
				currElementValue = $(element).val();

				if(!currElementValue || currElementValue.trim() == ""){
					item.choiceCollection = [];
					$(element).focus();
					return false;  //return false;跳出所有循环；相当于 javascript 中的 break 效果。return true;跳出当前循环，进入下一个循环；相当于 javascript 中的 continue 效果
				}
				choice.choiceDescription = currElementValue;
				item.choiceCollection.push(choice);
			});

			if(!item.choiceCollection.length){
				return false;
			}

			var level = $('.likert_level', this.el).val();
			item.likertLevel = Number(level);
			/*
			$('input[name="rightAnswerItem"]', this.el).each(function(index){
				if($(this)[0].checked){
					item.rightAnswer.push(index + 1);
				}
			});

			if(!item.rightAnswer.length){
				alert("请勾选正确的选项!");
				return false;
			}
			*/
			console.log(item);

			return item;
		},

		addItem : function(){

			var html = '<tr>'+
							'<td>'+
								'<div class="form-group">'+
									'<label for="firstname" class="col-sm-1 control-label"><input type="checkbox" name="selectionItem"></label>'+
									'<div class="col-sm-9">'+
										'<input type="text" class="form-control mySelectionContents" id="firstname" placeholder="请输入选项" value="你喜欢睡懒觉吗？"/>'+
									'</div>'+
								'</div>'+
							'</td>'+
						'</tr>';

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






