/**
 * Created by Eamonn on 2015/8/25.
 */

var richTextService = require('./richTextService');

exports.saveRichText = function(req,res){
    var id = req.body.id;
    var typeId = req.body.typeId;
    var textContent = req.body.textContent;
    var name = req.body.name;
    var description = req.body.description;
    var isSaveNew = req.body.isSaveNew;
    var user = req.session.userData;
    if(isSaveNew==='true'){
        richTextService.saveRichText(typeId,textContent,name,description,user,function(data){
            res.send(data);
        });
    }else{
        var updateModel ={
            typeId : typeId,
            textContent:textContent,
            name:name,
            description : description
        };
        var idQuery = {
            id : id
        };
        richTextService.updateRichTextModel(idQuery,updateModel,function(data){
            console.log(data);
            data.obj=updateModel;
            res.send(data);
        });
    }
};

exports.loadAllRichTextModel = function (req,res) {
    var user = req.session.userData;
    var isOut = req.query.isOut;
    if(isOut == 'true'){
        isOut=true;
    }else{
        isOut=false;
    }
    if(user){
        richTextService.loadAllRichTextModel(user,isOut,function (data) {
            res.send(data);
        });
    }
};

exports.loadRichTextModel = function(req,res){
    var id=req.query.id;
    richTextService.loadRichTextModel2(id, function (data) {
        res.send(data);
    });

};

exports.updateRichTextModel = function (req,res) {
    richTextService.updateRichTextModel(updateQuery,updateData,function(data){
        res.send(data);
    });
};

exports.deleteRichTextModel = function (req,res) {
    richTextService.deleteRichTextModel(idArray, function (data) {
        res.send(data);
    });
};