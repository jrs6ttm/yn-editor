/**
 * Created by Administrator on 2015/11/19.
 */
var xml2js = require('xml2js');

exports.choice_interaction_toXML = function(examItem, assessmentItemModel){

    var assessmentItem = assessmentItemModel.assessmentItem,
        responseProcessing={$:{template:"http://www.imsglobal.org/question/qti_v2p1/rptemplates/map_response"}};

    var simpleChoice = [], value=[];

    var examItemChoices = examItem.choiceCollection;
    for (var j = 0; j < examItemChoices.length; j++) {
        simpleChoice.push({_:examItemChoices[j].choiceDescription, $:{identifier:examItem.itemId + '_' + examItemChoices[j].choiceId, fixed:"false"}});
    }

    assessmentItem.itemBody.choiceInteraction ={
        $:{responseIdentifier:examItem.itemId, shuffle:"false",maxChoices:"1"},
        prompt:examItem.itemDescription,
        simpleChoice:simpleChoice
    };

    var eIRAnswers = examItem.rightAnswer;
    for (var z = 0; z < eIRAnswers.length; z++) {
        value.push(examItem.itemId + '_' + eIRAnswers[z]);
    }

    assessmentItem.responseDeclaration = {
        $:{
            identifier:examItem.itemId,
            cardinality:(examItem.itemType == 'radio') ? 'single':'multiple',
            baseType:"identifier"
        },
        correctResponse:{
            value:value
        }
    };

    assessmentItem.$["identifier"] = examItem.itemType+'_'+examItem.itemId;
    assessmentItem.responseProcessing = responseProcessing;

    assessmentItemModel.assessmentItem = assessmentItem;
    var builder = new (xml2js.Builder)();
    var xml = builder.buildObject(assessmentItemModel);
    console.log(assessmentItemModel);

    return xml;
};

exports.choice_interaction_toJSON = function(choiceSample_XML, callback){
    var aaa = JSON.stringify({data: choiceSample_XML});
    var reqData = JSON.parse(aaa);
    xml2js.parseString(reqData.data, {explicitArray : false}, function(err, result){
        if(err){
            callback(err);
        }else {
            console.log(result);
            var assessmentItem = result.assessmentItem;
            console.log(assessmentItem.itemBody.choiceInteraction.prompt);
            callback(result);
        }
    });
};
