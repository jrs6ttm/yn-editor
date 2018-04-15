	var Choice_Question_QItem =
		'<div style="margin-top:10px;cursor: pointer;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>" title="双击编辑或拖拽移位" class="examItem examItem-<%=pageId%>">'+
			'<div style="float:right;display:none; margin-top:5px; margin-right: 8px;" data-action-bar="examItemId-<%=itemId%>">'+
				'<button type="button" class="btn btn-info btn-sm editExamItem">编 辑</button>&nbsp;'+
				'<!--<button type="button" class="btn btn-info btn-sm" >复 制</button>&nbsp;-->'+
				'<button type="button" class="btn btn-info btn-sm deleteExamItem" >删 除</button>'+
			'</div>'+
			'<div class="panel panel-info examItemContents" valign="middle">'+
				'<div class="panel-body" >'+
					'<h4><p><span><%=itemPosition%></span>.<%=itemDescription%><p></h4>'+
					'<%_.each(choiceCollection, function(choiceItem){%>'+
						'<div class="row" style="margin-bottom: 5px;margin-left:5px;">'+
							'<div class="col-sm-1">'+
								'<%if(itemType == "MULTIPLE_RESPONSE"){%>'+
									'<input type="checkbox" name="selectionItem" />'+
								'<%}else{%>'+
									'<input type="radio" name="selectionItem" />'+
								'<%}%>'+
							'</div>'+
							'<label class="col-sm-1" style="margin-left:-3%;"><%=choiceItem.choiceCode%></label>'+
							'<div class="col-sm-9" >'+
								'<p style="margin-left:-6%;"><%=choiceItem.choiceDescription%></p>'+
							'</div>'+
						'</div>'+
					'<%});%>'+
				'</div>'+
			'</div>'+
		'</div>';

	var Likert_QItem =
		'<div style="margin-top:10px;cursor: pointer;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>" title="双击编辑或拖拽移位" class="examItem examItem-<%=pageId%>">'+
			'<div style="float:right;display:none;margin-top:5px;margin-right: 8px;" data-action-bar="examItemId-<%=itemId%>">'+
				'<button type="button" class="btn btn-info btn-sm editExamItem">编 辑</button>&nbsp;'+
				'<!--<button type="button" class="btn btn-info btn-sm" >复 制</button>&nbsp;-->'+
				'<button type="button" class="btn btn-info btn-sm deleteExamItem" >删 除</button>'+
			'</div>'+
			'<div class="panel panel-info examItemContents" valign="middle">'+
				'<div class="panel-body" >'+
					'<h4><p><span><%=itemPosition%></span>.<%=itemDescription%></p></h4>'+
					'<div style="margin-top:10px;margin-bottom: 10px;margin-left: 5px;">' +
						'<table class="table table-striped">' +
							'<thead>' +
								'<tr>' +
									'<th style="width:45%;"></th>' +
									'<%for(var i=1;i<=likertLevel;i++){%>'+
										'<th><%=i%></th>'+
									'<%}%>'+
								'</tr>' +
							'</thead>' +
							'<tbody>' +
								'<%_.each(choiceCollection, function(choiceItem){%>'+
									'<tr>' +
										'<td><p><%=choiceItem.choiceDescription%></p></td>' +
										'<%for(var i=1;i<=likertLevel;i++){%>'+
											'<td><input type="radio" name="myLikert_<%=itemId%>_<%=choiceItem.choiceId%>"></td>' +
										'<%}%>'+
									'</tr>' +
								'<%});%>'+
							'</tbody>' +
						'</table>' +
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>';

	var Slider_QItem =
		'<div style="margin-top:10px;cursor: pointer;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>" title="双击编辑或拖拽移位" class="examItem examItem-<%=pageId%>">'+
			'<div style="float:right;display:none; margin-top:5px; margin-right: 8px;" data-action-bar="examItemId-<%=itemId%>">'+
				'<button type="button" class="btn btn-info btn-sm editExamItem">编 辑</button>&nbsp;'+
				'<!--<button type="button" class="btn btn-info btn-sm" >复 制</button>&nbsp;-->'+
				'<button type="button" class="btn btn-info btn-sm deleteExamItem" >删 除</button>'+
			'</div>'+
			'<div class="panel panel-info examItemContents" valign="middle">'+
				'<div class="panel-body" >'+
					'<h4><p><span><%=itemPosition%></span>.<%=itemDescription%></p></h4>'+
					'<div style="margin-top:10px;margin-bottom: 10px;margin-left: 5px;">' +
						'<div align="center">'+
							'<label for="amount">当前值(百分比)：</label>'+
							'<input type="text"  class="slider_<%=itemId%>_value" style="border:0; color:#f6931f; font-weight:bold;" />'+
						'</div>'+
						'<div class="slider_<%=itemId%>" style="cursor: pointer;margin-top:10px;margin-bottom: 10px;margin-left: 5px;"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>';

	var Fill_IN_Blank_QItem =
		'<div style="margin-top:10px;cursor: pointer;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>" title="双击编辑或拖拽移位" class="examItem examItem-<%=pageId%>">'+
			'<div style="float:right;display:none; margin-top:5px; margin-right: 8px;" data-action-bar="examItemId-<%=itemId%>">'+
				'<button type="button" class="btn btn-info btn-sm editExamItem">编 辑</button>&nbsp;'+
				'<!--<button type="button" class="btn btn-info btn-sm" >复 制</button>&nbsp;-->'+
				'<button type="button" class="btn btn-info btn-sm deleteExamItem" >删 除</button>'+
			'</div>'+
			'<div class="panel panel-info examItemContents" valign="middle">'+
				'<div class="panel-body" >'+
					'<h4><p><span><%=itemPosition%></span>.<%=itemDescription%><p></h4>'+
					'<%_.each(blankCollection, function(blankItem){%>'+
						'<div class="row" style="margin-bottom: 5px;margin-left:5px;">'+
							'<div class="col-sm-1">'+
								'<label class="control-label">(<%=blankItem.blankId%>). </label>'+
							'</div>'+
							'<div class="col-sm-10" style="margin-left:-5px;">'+
								'<input type="text" class="form-control" placeholder="请填写答案" value="" />'+
							'</div>'+
						'</div>'+
					'<%});%>'+
				'</div>'+
			'</div>'+
		'</div>';

	var Inline_Choice_QItem =
		'<div style="margin-top:10px;cursor: pointer;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>" title="双击编辑或拖拽移位" class="examItem examItem-<%=pageId%>">'+
			'<div style="float:right;display:none; margin-top:5px; margin-right: 8px;" data-action-bar="examItemId-<%=itemId%>">'+
				'<button type="button" class="btn btn-info btn-sm editExamItem">编 辑</button>&nbsp;'+
				'<!--<button type="button" class="btn btn-info btn-sm" >复 制</button>&nbsp;-->'+
				'<button type="button" class="btn btn-info btn-sm deleteExamItem" >删 除</button>'+
			'</div>'+
			'<div class="panel panel-info examItemContents" valign="middle">'+
				'<div class="panel-body" >'+
					'<h4><p><span><%=itemPosition%></span>.<%=itemDescription%><p></h4>'+
					'<%_.each(choiceCollection, function(inlineChoiceItem){%>'+
						'<div class="row" style="margin-left:5px;">'+
							'<div class="col-sm-1">'+
								'<label class="control-label">(<%=inlineChoiceItem.inlineChoiceId%>). </label>'+
							'</div>'+
							'<div class="col-sm-10">'+
								'<%_.each(inlineChoiceItem.inlineChoice, function(choiceItem){%>'+
									'<div class="row" style="margin-bottom: 5px;margin-left:-6%;">'+
										'<div class="col-sm-1">'+
											'<input type="radio" name="selectionItem" />'+
										'</div>'+
										'<label class="col-sm-1" style="margin-left:-3%;"><%=choiceItem.choiceCode%></label>'+
										'<div class="col-sm-9">'+
											'<p style="margin-left:-6%;"><%=choiceItem.choiceDescription%></p>'+
										'</div>'+
									'</div>'+
								'<%});%>'+
							'</div>'+
						'</div>'+
					'<%});%>'+
				'</div>'+
			'</div>'+
		'</div>';

	var Open_Question_QItem =
		'<div style="margin-top:10px;cursor: pointer;" data-examItem-id="<%=itemId%>" data-itemPosition="<%=itemPosition%>" title="双击编辑或拖拽移位" class="examItem examItem-<%=pageId%>">'+
			'<div style="float:right;display:none; margin-top:5px; margin-right: 8px;" data-action-bar="examItemId-<%=itemId%>">'+
				'<button type="button" class="btn btn-info btn-sm editExamItem">编 辑</button>&nbsp;'+
				'<!--<button type="button" class="btn btn-info btn-sm" >复 制</button>&nbsp;-->'+
				'<button type="button" class="btn btn-info btn-sm deleteExamItem" >删 除</button>'+
			'</div>'+
			'<div class="panel panel-info examItemContents" valign="middle">'+
				'<div class="panel-body" >'+
					'<h4><p><span><%=itemPosition%></span>.<%=itemDescription%></p></h4>'+
					'<textarea  class="form-control questionDes" rows="3"></textarea>'+
				'</div>'+
			'</div>'+
		'</div>';

	var ExamItemView = Backbone.View.extend({
		attributes : {

		},

		events: {
			'mouseover .examItem': 'mouseOverQItem',
			'mouseout .examItem' : 'mouseOutQItem',
			'dblclick .examItemContents' : 'editExamItem',
			'click .editExamItem' : 'editExamItem',
			'click .deleteExamItem' : 'deleteExamItem'
		},

		initialize : function(){
			_.bindAll(this, 'render', 'addSlider', 'mouseOverQItem','mouseOutQItem','editExamItem','deleteExamItem');
		},

		render : function(){
			var examType = this.model.get('itemType');

			if(examType == 'MULTIPLE_CHOICE' || examType == 'MULTIPLE_RESPONSE' || examType == 'YES_NO'|| examType == 'TRUE_FALSE'){
				this.template = _.template(Choice_Question_QItem);
				$(this.el).append(this.template(this.model.toJSON()));
				return this;
			}else if(examType == 'LIKERT'){
				this.template = _.template(Likert_QItem);
				$(this.el).append(this.template(this.model.toJSON()));
				return this;
			}else if(examType == 'SLIDER'){
				this.template = _.template(Slider_QItem);
				$(this.el).append(this.template(this.model.toJSON()));
				this.addSlider();
				return this;
			}else if(examType == 'FILL_IN_BLANK'){
				this.template = _.template(Fill_IN_Blank_QItem);
				$(this.el).append(this.template(this.model.toJSON()));
				return this;
			}else if(examType == 'INLINE_CHOICE'){
				this.template = _.template(Inline_Choice_QItem);
				$(this.el).append(this.template(this.model.toJSON()));
				return this;
			}else if(examType == 'OPEN_QUESTION'){
				this.template = _.template(Open_Question_QItem);
				$(this.el).append(this.template(this.model.toJSON()));
				return this;
			}else {
				alert('错误，无题型：'+examType.trim()+'!');
				return null;
			}
		},

		addSlider: function(){
			var itemId = this.model.get('itemId'), myAnswer = this.model.get('myAnswer');
			var me = this;
			$(".slider_"+itemId, me.el).slider({
				range: "min",
				value: myAnswer?myAnswer:30,
				min: 1,
				max: 100,
				slide: function( event, ui ) {
					$( ".slider_"+itemId+"_value", me.el ).val(ui.value );
				}
			});
			$( ".slider_"+itemId+"_value", this.el ).val($( ".slider_"+itemId, this.el ).slider( "value" ));
		},

		mouseOverQItem : function (){
			$('div[data-action-bar="examItemId-'+this.model.get('itemId')+'"]',this.el).css('display','block');
		},

		mouseOutQItem : function (){
			$('div[data-action-bar="examItemId-'+this.model.get('itemId')+'"]',this.el).css('display','none');
		},

		editExamItem : function (){
			var pageId = this.model.get('pageId');
			//因可能的移动，删除不方便修改相应View对象里model的itemPosition值，所以我们使data-itemPosition属性保持item的的最新序号
			var curP = $('.examItem-'+pageId, this.el).attr('data-itemPosition');
			curP = Number(curP);
			this.model.set({itemPosition: curP});

			var examPanelView = null;

			var examType = this.model.get('itemType');
			if(examType == 'MULTIPLE_CHOICE' || examType == 'MULTIPLE_RESPONSE' || examType == 'YES_NO'|| examType == 'TRUE_FALSE'){
				examPanelView = new ChoiceQuestionPanelView({model : this.model});
			}else if(examType == 'LIKERT'){
				examPanelView = new LikertPanelView({model : this.model});
			}else if(examType == 'SLIDER'){
				examPanelView = new SliderPanelView({model : this.model});
			}else if(examType == 'FILL_IN_BLANK'){
				examPanelView = new FillInBlankPanelView({model : this.model});
			}else if(examType == 'INLINE_CHOICE'){
				examPanelView = new InlineChoicePanelView({model : this.model});
			}else if(examType == 'OPEN_QUESTION'){
				examPanelView = new OpenQuestionPanelView({model : this.model});
			}

			if(examPanelView != null) {
				$(this.el).before(examPanelView.render().el);
				$('.sortable-' + pageId).sortable('disable');//禁用本页的拖拽功能，目的是为了避免编辑时拖拽Panel，造成次序麻烦
				$('div[data-examItem-id="' + this.model.get('itemId') + '"]', this.el).css('display', 'none');
			}
		},

		deleteExamItem : function(){
			var me = this;
			//var curP = me.model.get('itemPosition');
			var curP = $('.examItem-'+me.model.get('pageId'), me.el).attr('data-itemPosition');//因为一页内的所有item均是同样的class,需加me.el,限制为本对象。
			curP = Number(curP);
			$.post('/exam/deleteExamItem', {itemId : me.model.get('itemId')}, function(result){
				if(result && result.success){
					var sumL = ($('.examItem-'+me.model.get('pageId'))).length;//取本页内item的个数
					var sortItems = [];

					for(var i = curP; i<sumL;i++){
						var currObj = $('.examItem-'+me.model.get('pageId'))[i];
						$(currObj).attr('data-itemPosition', i+'');
						$(currObj).find('h4').eq(0).find('span').eq(0).text(i);
						sortItems.push($(currObj).attr('data-examItem-id'));
					}
					$(me.el).remove();
					var sortedItems = {
						startPosition : curP,
						sortsItems : sortItems
					};

					$.post('/exam/sortExamItems', {sortedItems : JSON.stringify(sortedItems)}, function(result){
						console.log(result);
					});
				}
			});
		}
	});

