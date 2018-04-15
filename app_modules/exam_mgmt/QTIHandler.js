/**
 * Created by Administrator on 2015/11/16.
 */
var xml2js = require('xml2js');
var ChoiceInteraction = require('./qti_elements/choiceInteraction.js');
var ExtendedTextInteraction = require('./qti_elements/extendedTextInteraction.js');
var TextEntryInteraction = require('./qti_elements/textEntryInteraction.js');
var InlineChoiceInteraction = require('./qti_elements/inlineChoiceInteraction.js');
var SliderInteraction = require('./qti_elements/sliderInteraction.js');
var LikertInteraction = require('./qti_elements/likertInteraction.js');


var QTI = function(){
    this.assessmentItemModel =
    {assessmentItem:
        {
            $:{},
            responseDeclaration:{},
            outcomeDeclaration:{
                $:{identifier:"SCORE",cardinality:"single",baseType:"float"},
                defaultValue:{
                    value:0
                }
            },
            itemBody:{}
        }

    };

    this.assessmentItemModel.assessmentItem.$["xmlns"] = "http://www.imsglobal.org/xsd/imsqti_v2p1";
    this.assessmentItemModel.assessmentItem.$["xmlns:xsi"] = "http://www.w3.org/2001/XMLSchema-instance";
    this.assessmentItemModel.assessmentItem.$["xsi:schemaLocation"] = "http://www.imsglobal.org/xsd/imsqti_v2p1  http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd";
    this.assessmentItemModel.assessmentItem.$["identifier"] = "choiceMultiple";
    this.assessmentItemModel.assessmentItem.$["title"] = "Composition of Water";
    this.assessmentItemModel.assessmentItem.$["adaptive"] = "false";
    this.assessmentItemModel.assessmentItem.$["timeDependent"] = "false";
};

QTI.prototype.importQTI = function (Obj, callback) {

};

QTI.prototype.exportQTI = function (examItemsArr, callback) {
    console.log('examItemsArr:');
    console.log(examItemsArr);
    var assessment = '<?xml version="1.0" encoding="UTF-8"?>', itemLength = examItemsArr.length;
    for(var i=0; i<itemLength;i++){
        var examItem = JSON.parse(examItemsArr[i]);

        var examItemType = examItem.itemType;
        if(examItemType == 'radio' || examItemType == 'checkbox') {
            //assessment += ChoiceInteraction.choice_interaction_toXML(examItem, this.assessmentItemModel);
        }else if(examItemType == 'short-answer'){
            //assessment += ExtendedTextInteraction.extended_text_interaction_toXML(examItem, this.assessmentItemModel);
        }
    }

    console.log(assessment);
    callback(assessment);
};

//TEST
QTI.prototype.importQTI_AI = function (Obj, callback) {
    /*TEST
   var choiceSample_XML =   '<?xml version="1.0" encoding="UTF-8"?>'+
                            '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" '+
                            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '+
                            'xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1  http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd" '+
                            'identifier="choiceMultiple" title="Composition of Water" adaptive="false" timeDependent="false">'+
                                '<responseDeclaration identifier="RESPONSE" cardinality="multiple" baseType="identifier">'+
                                    '<correctResponse>'+
                                        '<value>H</value>'+
                                        '<value>O</value>'+
                                    '</correctResponse>'+
                                    '<mapping lowerBound="0" upperBound="2" defaultValue="-2">'+
                                        '<mapEntry mapKey="H" mappedValue="1"/>'+
                                        '<mapEntry mapKey="O" mappedValue="1"/>'+
                                        '<mapEntry mapKey="Cl" mappedValue="-1"/>'+
                                    '</mapping>'+
                                '</responseDeclaration>'+
                                '<outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float"/>'+
                                '<itemBody>'+
                                    '<choiceInteraction responseIdentifier="RESPONSE" shuffle="true" maxChoices="0">'+
                                        '<prompt>Which of the following elements are used to form water?</prompt>'+
                                        '<simpleChoice identifier="H" fixed="false">Hydrogen</simpleChoice>'+
                                        '<simpleChoice identifier="He" fixed="false">Helium</simpleChoice>'+
                                        '<simpleChoice identifier="C" fixed="false">Carbon</simpleChoice>'+
                                        '<simpleChoice identifier="O" fixed="false">Oxygen</simpleChoice>'+
                                        '<simpleChoice identifier="N" fixed="false">Nitrogen</simpleChoice>'+
                                        '<simpleChoice identifier="Cl" fixed="false">Chlorine</simpleChoice>'+
                                    '</choiceInteraction>'+
                                '</itemBody>'+
                                '<responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/map_response"/>'+
                            '</assessmentItem>';

*/
    var choiceSample_XML = '<?xml version="1.0" encoding="UTF-8"?>'+
                            '<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1" '+
                            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '+
                            'xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p1  http://www.imsglobal.org/xsd/qti/qtiv2p1/imsqti_v2p1.xsd" '+
                            'identifier="inlineChoice" title="Richard III (Take 2)" adaptive="false" timeDependent="false">'+
                                '<responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">'+
                                    '<correctResponse>'+
                                        '<value>Y</value>'+
                                    '</correctResponse>'+
                                '</responseDeclaration>'+
                                '<outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float"/>'+
                                '<itemBody>'+
                                    '<p>Identify the missing word in this famous quote from Shakespeare\'s Richard III.</p>'+
                                    '<blockquote>'+
                                        '<p>Now is the winter of our discontent<br/> Made glorious summer by this sun of'+
                                            '<inlineChoiceInteraction responseIdentifier="RESPONSE" shuffle="false">'+
                                                '<inlineChoice identifier="G">Gloucester</inlineChoice>'+
                                                '<inlineChoice identifier="L">Lancaster</inlineChoice>'+
                                                '<inlineChoice identifier="Y">York</inlineChoice>'+
                                            '</inlineChoiceInteraction>;<br/> '+
                                        'And all the clouds that lour\'d upon our house<br/>'+
                                        'In the deep bosom of the ocean buried.</p>'+
                                    '</blockquote>'+
                                '</itemBody>'+
                                '<responseProcessing template="http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct"/>'+
                            '</assessmentItem>';

    var aaa = JSON.stringify({data: choiceSample_XML});
    var reqData = JSON.parse(aaa);

    xml2js.parseString(reqData.data, {explicitArray : false}, function(err, result){
        if(err){
            callback(err);
        }else {
            console.log(result);

            var builder = new (xml2js.Builder)();
            var xml = builder.buildObject(reqData.data);
            console.log(xml);

            var itemBody = result.assessmentItem.itemBody;

            if(itemBody.hasOwnProperty('choiceInteraction')){
                console.log(itemBody.choiceInteraction.prompt);


            }else if(itemBody.hasOwnProperty('extendedTextInteraction')){
                console.log(itemBody.extendedTextInteraction.prompt);

            }else if(itemBody.hasOwnProperty('inlineChoiceInteraction')){
                console.log(itemBody.p);

            }

            callback(result);
        }
    });
};

QTI.prototype.exportQTI_AI = function (examItem, callback) {
    console.log('examItem:');
    console.log(examItem);
    var assessmentItem = {};

    var examItemType = examItem.itemType;
    if(examItemType == 'MULTIPLE_CHOICE' || examItemType == 'MULTIPLE_RESPONSE'||examItemType == 'YES_NO' || examItemType == 'TRUE_FALSE') {
        assessmentItem = ChoiceInteraction.choice_interaction_toXML(examItem, this.assessmentItemModel);
    }else if(examItemType == 'OPEN_QUESTION'){
        assessmentItem = ExtendedTextInteraction.extended_text_interaction_toXML(examItem, this.assessmentItemModel);
    }else if(examItemType == 'INLINE_CHOICE'){
        assessmentItem = InlineChoiceInteraction.inlineChoice_interaction_toXML(examItem, this.assessmentItemModel);
        //InlineChoiceInteraction.inlineChoice__interaction_toJSON(assessmentItem, null);
    }else if(examItemType == 'FILL_IN_BLANK'){
        assessmentItem = TextEntryInteraction.textEntry_interaction_toXML(examItem, this.assessmentItemModel);
        //TextEntryInteraction.textEntry__interaction_toJSON(assessmentItem, null);
    }else if(examItemType == 'SLIDER'){
        assessmentItem = SliderInteraction.slider_interaction_toXML(examItem, this.assessmentItemModel);
        //SliderInteraction.slider_interaction_toJSON(assessmentItem, null);
    }else if(examItemType == 'LIKERT'){
        assessmentItem = LikertInteraction.likert_interaction_toXML(examItem, this.assessmentItemModel);
        //LikertInteraction.likert_interaction_toJSON(assessmentItem, null);
    }

    console.log(assessmentItem);
    callback(assessmentItem);
};

QTI.prototype.getScore = function (query, callback) {
    console.log('query:');
    console.log(query);

    this.findAndSort(query, {itemPosition : 1}, callback);

};

module.exports = QTI;
