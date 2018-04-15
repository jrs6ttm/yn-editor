/**
 * Created by Administrator on 2015/11/27.
 */

var xml2js = require('xml2js');

exports.inlineChoice_interaction_toXML = function(examItem, assessmentItemModel){

    var assessmentItem = assessmentItemModel.assessmentItem,
        responseProcessing={$:{template:"http://www.imsglobal.org/question/qti_v2p1/rptemplates/map_response"}};

    var responseDeclarationArr = [];var simpleChoice = [];
    var builder = new (xml2js.Builder)();
    var examItemChoices = examItem.choiceCollection, prompt = examItem.itemDescription, inlineChoiceInteraction='', inlineChoice_identifier='';
    var eIRAnswers = examItem.rightAnswer;
    for (var j = 0; j < examItemChoices.length; j++) {
        simpleChoice = [];
        var inlineChoice = examItemChoices[j];
        inlineChoice_identifier = examItem.itemId + '_' + inlineChoice.inlineChoiceId;

        var inlineChoices = inlineChoice.inlineChoice;

        for (var i = 0; i < inlineChoices.length; i++) {
            var choiceIdentifier = examItem.itemId + '_' +inlineChoice.inlineChoiceId+'_'+ inlineChoices[i].choiceId;
            simpleChoice.push({_:inlineChoices[i].choiceDescription, $:{identifier:choiceIdentifier, fixed:"false"}});
        }
        inlineChoiceInteraction = {
            inlineChoiceInteraction: {
                $: {responseIdentifier: inlineChoice_identifier, shuffle: "false", maxChoices: "1"},
                inlineChoice: simpleChoice
            }
        };

        inlineChoiceInteraction = builder.buildObject(inlineChoiceInteraction);

        var startIndex = inlineChoiceInteraction.indexOf('<inlineChoiceInteraction');
        inlineChoiceInteraction = inlineChoiceInteraction.substring(startIndex, inlineChoiceInteraction.length);
        prompt = prompt.replace('__'+inlineChoice.inlineChoiceId+'__', '\n'+inlineChoiceInteraction+'\n');

        var temp = {
                        $:{
                            identifier:inlineChoice_identifier,
                            cardinality:'single',
                            baseType:"string"
                        },
                        correctResponse:{
                            value:examItem.itemId + '_' +inlineChoice.inlineChoiceId+'_'+eIRAnswers[j].rightChoiceId
                        }
                    };

        responseDeclarationArr.push(temp);
    }
    //prompt = '<itemBody>\n  <blockquote>\n    <p>'+ prompt + '</p>\n    </blockquote>\n  </itemBody>';
    prompt = '<itemBody><blockquote><p>'+ prompt + '</p></blockquote></itemBody>';
    assessmentItem.responseDeclaration = responseDeclarationArr;

    assessmentItem.$["identifier"] = examItem.itemType+'_'+examItem.itemId;
    assessmentItem.responseProcessing = responseProcessing;

    assessmentItemModel.assessmentItem = assessmentItem;


    var xml = builder.buildObject(assessmentItemModel);
    console.log(assessmentItemModel);

    var cutIndex = xml.indexOf('<itemBody/>'), firstStr='', lastStr='';
    if(cutIndex != -1) {
        firstStr = xml.substring(0, cutIndex);
        lastStr = xml.substring(cutIndex+11, xml.length);
    }

    xml = firstStr + prompt + lastStr;
    return xml;
};

exports.inlineChoice__interaction_toJSON = function(choiceSample_XML, callback){
    var aaa = JSON.stringify({data: choiceSample_XML});
    var reqData = JSON.parse(aaa);
    xml2js.parseString(reqData.data, {explicitArray : false}, function(err, result){
        if(err){
            callback(err);
        }else {
            var assessmentItem = result.assessmentItem;

            var startIndex = choiceSample_XML.indexOf('<itemBody>'), endIndex =choiceSample_XML.indexOf('</itemBody>'), itemBody='';
            if(startIndex != -1 && endIndex != -1) {
                itemBody = choiceSample_XML.substring(startIndex+10, endIndex);

                var responseDeclaration = assessmentItem.responseDeclaration;
                if(responseDeclaration instanceof Array){
                    for(var i=0; i<responseDeclaration.length;i++){
                        var identifier = responseDeclaration[i].$.identifier;
                        itemBody = getItemBodyStr(itemBody, identifier);
                    }
                }else{
                    var identifier = responseDeclaration.$.identifier;
                    itemBody = getItemBodyStr(itemBody, identifier);
                }

                result.assessmentItem.itemBody = itemBody;
                console.log(result);

                callback(result);
            }
        }
    });
};

function getItemBodyStr(itemBody, identifier){
    var cutIndex = itemBody.indexOf(identifier);
    if(cutIndex != -1){
        var start = itemBody.lastIndexOf('<inlineChoiceInteraction', cutIndex );
        var end = itemBody.indexOf('</inlineChoiceInteraction>', cutIndex );
        if(end != -1){
            var firstStr = itemBody.substring(0, start ), lastStr = itemBody.substring(end+26, itemBody.length);
            itemBody = firstStr +　'__'+identifier+'__'+ lastStr ;
        }
    }

    return itemBody;
}
