/**
 * Created by Administrator on 2015/11/27.
 */

var xml2js = require('xml2js');

exports.textEntry_interaction_toXML = function(examItem, assessmentItemModel){

    var assessmentItem = assessmentItemModel.assessmentItem,
        responseProcessing={$:{template:"http://www.imsglobal.org/question/qti_v2p1/rptemplates/map_response"}};

    var responseDeclarationArr = [];
    var examItemChoices = examItem.choiceCollection, prompt = examItem.itemDescription, textEntryInteraction='', identifier='';
    for (var j = 0; j < examItemChoices.length; j++) {
        identifier = examItem.itemId + '_' + examItemChoices[j].choiceId;
        textEntryInteraction = '<textEntryInteraction responseIdentifier="'+identifier+'" expectedLength="15"/>';
        prompt = prompt.replace('__'+examItemChoices[j].choiceId+'__', textEntryInteraction);
        var temp = {
                        $:{
                            identifier:identifier,
                            cardinality:'single',
                            baseType:"string"
                        },
                        correctResponse:{
                            value:examItemChoices[j].choiceDescription
                        }
                    };

        responseDeclarationArr.push(temp);
    }
    prompt = '<itemBody><blockquote><p>'+ prompt + '</p></blockquote></itemBody>';
    assessmentItem.responseDeclaration = responseDeclarationArr;

    assessmentItem.$["identifier"] = examItem.itemType+'_'+examItem.itemId;
    assessmentItem.responseProcessing = responseProcessing;

    assessmentItemModel.assessmentItem = assessmentItem;
    var builder = new (xml2js.Builder)();
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

exports.textEntry__interaction_toJSON = function(choiceSample_XML, callback){
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
        var start = itemBody.lastIndexOf('<textEntryInteraction', cutIndex );
        var end1 = itemBody.indexOf('/>', cutIndex ), end2 = itemBody.indexOf('</textEntryInteraction>', cutIndex ), end = 0;
        if(end1 != -1){
            if(end2 != -1){
                end = (end1 < end2)? (end1+2): (end2+23);
            }else{
                end = end1+2;
            }
            var firstStr = itemBody.substring(0, start ), lastStr = itemBody.substring(end, itemBody.length);
            itemBody = firstStr +　'__'+identifier+'__'+ lastStr ;
        }
    }

    return itemBody;
}
